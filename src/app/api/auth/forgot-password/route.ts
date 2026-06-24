import { randomBytes } from "crypto";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { jsonResponse, errorResponse, validateEmail } from "@/lib/api-utils";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, locale } = body;

    if (!email || !validateEmail(email)) {
      return errorResponse("Invalid email address");
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    const successMessage =
      "If an account exists with this email, a reset link has been sent.";

    if (!user) {
      return jsonResponse({ message: successMessage });
    }

    // Invalidate old tokens
    await prisma.passwordReset.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const sent = await sendPasswordResetEmail(user.email, token, locale || user.language || "en");

    // In dev without email, log the reset link
    if (!sent && process.env.NODE_ENV !== "production") {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      console.log(`[DEV] Password reset link: ${baseUrl}/${locale || "en"}/reset-password?token=${token}`);
    }

    return jsonResponse({ message: successMessage, emailSent: sent });
  } catch (error) {
    console.error("Forgot password error:", error);
    return errorResponse("Failed to process request", 500);
  }
}
