import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse, validatePassword } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token) {
      return errorResponse("Reset token is required");
    }

    if (!password || !validatePassword(password)) {
      return errorResponse("Password must be at least 8 characters");
    }

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.used) {
      return errorResponse("Invalid or expired reset link", 400);
    }

    if (resetRecord.expiresAt < new Date()) {
      return errorResponse("Reset link has expired. Please request a new one.", 400);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { used: true },
      }),
    ]);

    return jsonResponse({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return errorResponse("Failed to reset password", 500);
  }
}
