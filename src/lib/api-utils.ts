import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, JwtPayload } from "./auth";

export function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireAuth(
  req: NextRequest
): Promise<{ auth: JwtPayload } | { error: NextResponse }> {
  const auth = await getAuthFromRequest(req);
  if (!auth) {
    return { error: errorResponse("Unauthorized", 401) };
  }
  return { auth };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
  "text/csv",
  "text/html",
  "text/css",
  "text/javascript",
  "application/json",
  "application/zip",
  "application/x-zip-compressed",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "application/octet-stream",
]);

export function isAllowedMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.has(mimeType) || mimeType.startsWith("text/");
}

export function getMaxFileSize(): number {
  const mb = parseInt(process.env.MAX_FILE_SIZE_MB || "50", 10);
  return mb * 1024 * 1024;
}
