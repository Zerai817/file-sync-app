import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  requireAuth,
  jsonResponse,
  errorResponse,
  isAllowedMimeType,
  getMaxFileSize,
} from "@/lib/api-utils";
import { saveFile, computeChecksum, formatFileSize, usesDatabaseStorage } from "@/lib/file-storage";

export async function POST(req: NextRequest) {
  const result = await requireAuth(req);
  if ("error" in result) return result.error;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return errorResponse("No file provided");
    }

    if (file.size > getMaxFileSize()) {
      return errorResponse(`File exceeds maximum size of ${getMaxFileSize() / 1024 / 1024}MB`);
    }

    const mimeType = file.type || "application/octet-stream";
    if (!isAllowedMimeType(mimeType)) {
      return errorResponse("File type not allowed");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const checksum = computeChecksum(buffer);
    const storeInDb = usesDatabaseStorage();

    const dbFile = await prisma.file.create({
      data: {
        userId: result.auth.userId,
        filename: file.name,
        originalName: file.name,
        mimeType,
        size: file.size,
        checksum,
        uploadedBy: result.auth.deviceId || null,
        ...(storeInDb ? { data: new Uint8Array(buffer) } : {}),
      },
    });

    if (!storeInDb) {
      await saveFile(result.auth.userId, dbFile.id, buffer);
    }

    if (result.auth.deviceId) {
      await prisma.device.update({
        where: { id: result.auth.deviceId },
        data: { lastSyncAt: new Date() },
      }).catch(() => {});
    }

    const { data: _data, ...fileMeta } = dbFile;

    return jsonResponse(
      {
        file: {
          ...fileMeta,
          sizeFormatted: formatFileSize(dbFile.size),
        },
      },
      201
    );
  } catch (error) {
    console.error("Upload error:", error);
    return errorResponse("Upload failed", 500);
  }
}
