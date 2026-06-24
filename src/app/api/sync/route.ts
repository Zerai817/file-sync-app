import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-utils";
import { formatFileSize } from "@/lib/file-storage";

export async function POST(req: NextRequest) {
  const result = await requireAuth(req);
  if ("error" in result) return result.error;

  const body = await req.json().catch(() => ({}));
  const { deviceId } = body;

  const files = await prisma.file.findMany({
    where: { userId: result.auth.userId },
    orderBy: { updatedAt: "desc" },
  });

  if (deviceId) {
    await prisma.device.update({
      where: { id: deviceId },
      data: { lastSyncAt: new Date() },
    }).catch(() => {});
  } else if (result.auth.deviceId) {
    await prisma.device.update({
      where: { id: result.auth.deviceId },
      data: { lastSyncAt: new Date() },
    }).catch(() => {});
  }

  return jsonResponse({
    syncedAt: new Date().toISOString(),
    files: files.map((f) => ({
      id: f.id,
      originalName: f.originalName,
      mimeType: f.mimeType,
      size: f.size,
      sizeFormatted: formatFileSize(f.size),
      checksum: f.checksum,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      downloadUrl: `/api/files/${f.id}`,
    })),
    totalFiles: files.length,
  });
}
