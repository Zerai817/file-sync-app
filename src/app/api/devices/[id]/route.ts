import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await requireAuth(req);
  if ("error" in result) return result.error;

  const { id } = await params;
  const body = await req.json();
  const { name, syncMode } = body;

  const device = await prisma.device.findFirst({
    where: { id, userId: result.auth.userId },
  });

  if (!device) return errorResponse("Device not found", 404);

  const updated = await prisma.device.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(syncMode !== undefined && { syncMode }),
    },
  });

  return jsonResponse({ device: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await requireAuth(req);
  if ("error" in result) return result.error;

  const { id } = await params;

  const device = await prisma.device.findFirst({
    where: { id, userId: result.auth.userId },
  });

  if (!device) return errorResponse("Device not found", 404);

  await prisma.device.delete({ where: { id } });
  return jsonResponse({ success: true });
}
