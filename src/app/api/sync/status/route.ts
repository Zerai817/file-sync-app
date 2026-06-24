import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const result = await requireAuth(req);
  if ("error" in result) return result.error;

  const [fileCount, devices, lastSyncDevice] = await Promise.all([
    prisma.file.count({ where: { userId: result.auth.userId } }),
    prisma.device.findMany({
      where: { userId: result.auth.userId },
      select: {
        id: true,
        name: true,
        deviceType: true,
        syncMode: true,
        lastSyncAt: true,
      },
    }),
    prisma.device.findFirst({
      where: { userId: result.auth.userId },
      orderBy: { lastSyncAt: "desc" },
      select: { lastSyncAt: true },
    }),
  ]);

  const totalSize = await prisma.file.aggregate({
    where: { userId: result.auth.userId },
    _sum: { size: true },
  });

  return jsonResponse({
    status: "ready",
    fileCount,
    totalSize: totalSize._sum.size || 0,
    lastSyncAt: lastSyncDevice?.lastSyncAt || null,
    devices,
    currentDeviceId: result.auth.deviceId || null,
  });
}
