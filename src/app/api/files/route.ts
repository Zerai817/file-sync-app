import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse } from "@/lib/api-utils";
import { formatFileSize } from "@/lib/file-storage";

export async function GET(req: NextRequest) {
  const result = await requireAuth(req);
  if ("error" in result) return result.error;

  const files = await prisma.file.findMany({
    where: { userId: result.auth.userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      filename: true,
      originalName: true,
      mimeType: true,
      size: true,
      checksum: true,
      uploadedBy: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return jsonResponse({
    files: files.map((f) => ({
      ...f,
      sizeFormatted: formatFileSize(f.size),
    })),
  });
}
