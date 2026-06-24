import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, errorResponse } from "@/lib/api-utils";
import { readStoredFile, deleteStoredFile } from "@/lib/file-storage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await requireAuth(req);
  if ("error" in result) return result.error;

  const { id } = await params;

  const file = await prisma.file.findFirst({
    where: { id, userId: result.auth.userId },
  });

  if (!file) return errorResponse("File not found", 404);

  try {
    const buffer = await readStoredFile(result.auth.userId, file.id);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(file.originalName)}"`,
        "Content-Length": String(file.size),
      },
    });
  } catch {
    return errorResponse("File not found on disk", 404);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await requireAuth(req);
  if ("error" in result) return result.error;

  const { id } = await params;

  const file = await prisma.file.findFirst({
    where: { id, userId: result.auth.userId },
  });

  if (!file) return errorResponse("File not found", 404);

  await deleteStoredFile(result.auth.userId, file.id);
  await prisma.file.delete({ where: { id } });

  return Response.json({ success: true });
}
