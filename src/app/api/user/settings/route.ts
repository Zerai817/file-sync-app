import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, jsonResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  const result = await requireAuth(req);
  if ("error" in result) return result.error;

  const user = await prisma.user.findUnique({
    where: { id: result.auth.userId },
    select: {
      id: true,
      email: true,
      name: true,
      language: true,
      syncMode: true,
      createdAt: true,
    },
  });

  if (!user) return errorResponse("User not found", 404);
  return jsonResponse({ user });
}

export async function PATCH(req: NextRequest) {
  const result = await requireAuth(req);
  if ("error" in result) return result.error;

  const body = await req.json();
  const { name, language, syncMode } = body;

  const data: Record<string, string> = {};
  if (name !== undefined) data.name = name;
  if (language !== undefined) data.language = language;
  if (syncMode !== undefined) data.syncMode = syncMode;

  const user = await prisma.user.update({
    where: { id: result.auth.userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      language: true,
      syncMode: true,
    },
  });

  return jsonResponse({ user });
}
