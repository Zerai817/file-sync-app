import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const result = await requireAuth(req);
  if ("error" in result) return result.error;

  const devices = await prisma.device.findMany({
    where: { userId: result.auth.userId },
    orderBy: { lastSyncAt: "desc" },
    select: {
      id: true,
      name: true,
      deviceType: true,
      syncMode: true,
      lastSyncAt: true,
      createdAt: true,
    },
  });

  return jsonResponse({ devices });
}
