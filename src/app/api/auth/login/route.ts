import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken, authCookieOptions } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/api-utils";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse("Email and password are required");
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return errorResponse("Invalid email or password", 401);
    }

    const token = await signToken({ userId: user.id, email: user.email });
    const cookieStore = await cookies();
    cookieStore.set(authCookieOptions(token));

    return jsonResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        language: user.language,
        syncMode: user.syncMode,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Login failed", 500);
  }
}
