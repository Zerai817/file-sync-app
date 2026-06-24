import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken, authCookieOptions } from "@/lib/auth";
import {
  jsonResponse,
  errorResponse,
  validateEmail,
  validatePassword,
} from "@/lib/api-utils";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, language } = body;

    if (!email || !password) {
      return errorResponse("Email and password are required");
    }

    if (!validateEmail(email)) {
      return errorResponse("Invalid email address");
    }

    if (!validatePassword(password)) {
      return errorResponse("Password must be at least 8 characters");
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return errorResponse("Email already registered", 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name: name || null,
        language: language || "en",
      },
    });

    const token = await signToken({ userId: user.id, email: user.email });
    const cookieStore = await cookies();
    cookieStore.set(authCookieOptions(token));

    return jsonResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          language: user.language,
          syncMode: user.syncMode,
        },
        token,
      },
      201
    );
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse("Registration failed", 500);
  }
}
