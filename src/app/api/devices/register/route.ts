import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db";
import { signToken, authCookieOptions } from "@/lib/auth";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-utils";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const result = await requireAuth(req);
  if ("error" in result) return result.error;

  const body = await req.json();
  const { name, deviceType, syncMode, userAgent } = body;

  if (!name || !deviceType) {
    return errorResponse("Device name and type are required");
  }

  const deviceToken = uuidv4();

  const device = await prisma.device.create({
    data: {
      userId: result.auth.userId,
      deviceToken,
      name,
      deviceType,
      syncMode: syncMode || (deviceType === "ios" ? "manual" : "auto"),
      userAgent: userAgent || null,
    },
  });

  const token = await signToken({
    userId: result.auth.userId,
    email: result.auth.email,
    deviceId: device.id,
  });

  const cookieStore = await cookies();
  cookieStore.set(authCookieOptions(token));

  return jsonResponse(
    {
      device: {
        id: device.id,
        name: device.name,
        deviceType: device.deviceType,
        syncMode: device.syncMode,
        deviceToken: device.deviceToken,
      },
      token,
    },
    201
  );
}
