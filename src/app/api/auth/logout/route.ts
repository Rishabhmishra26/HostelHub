/**
 * POST /api/auth/logout
 * Simply clears both auth cookies.
 */
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
}
