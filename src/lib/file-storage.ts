import { createHash } from "crypto";
import { mkdir, writeFile, readFile, unlink, stat } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { formatFileSize as formatSize } from "@/lib/utils";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

export function usesDatabaseStorage(): boolean {
  return (
    process.env.STORAGE_MODE === "database" ||
    !!process.env.VERCEL ||
    !!process.env.DATABASE_URL?.startsWith("postgresql")
  );
}

export async function saveFile(
  userId: string,
  fileId: string,
  buffer: Buffer
): Promise<void> {
  if (usesDatabaseStorage()) {
    await prisma.file.update({
      where: { id: fileId },
      data: { data: new Uint8Array(buffer) },
    });
    return;
  }

  const dir = path.join(UPLOAD_DIR, userId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileId), buffer);
}

export async function readStoredFile(userId: string, fileId: string): Promise<Buffer> {
  if (usesDatabaseStorage()) {
    const file = await prisma.file.findFirst({
      where: { id: fileId, userId },
      select: { data: true },
    });
    if (!file?.data) throw new Error("File data not found");
    return Buffer.from(file.data);
  }

  return readFile(path.join(UPLOAD_DIR, userId, fileId));
}

export async function deleteStoredFile(userId: string, fileId: string): Promise<void> {
  if (usesDatabaseStorage()) return;

  try {
    await unlink(path.join(UPLOAD_DIR, userId, fileId));
  } catch {
    // File may not exist on disk
  }
}

export function computeChecksum(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export async function fileExists(userId: string, fileId: string): Promise<boolean> {
  if (usesDatabaseStorage()) {
    const file = await prisma.file.findFirst({
      where: { id: fileId, userId },
      select: { data: true },
    });
    return !!file?.data;
  }

  try {
    await stat(path.join(UPLOAD_DIR, userId, fileId));
    return true;
  } catch {
    return false;
  }
}

export { formatSize as formatFileSize };

export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export function isPreviewable(mimeType: string): boolean {
  return (
    mimeType.startsWith("image/") ||
    mimeType === "application/pdf" ||
    mimeType.startsWith("text/") ||
    mimeType === "application/json"
  );
}
