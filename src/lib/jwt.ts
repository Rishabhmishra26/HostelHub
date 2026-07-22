/**
 * jwt.ts
 * --------------------------------------------------------------
 * Small wrapper around the `jsonwebtoken` library.
 *
 * We issue TWO tokens on login:
 *  - accessToken  -> short lived (15 min), sent on every request
 *  - refreshToken -> long lived (7 days), used only to get a new
 *                    access token when the old one expires
 *
 * This is the standard "access + refresh token" pattern used in
 * most real-world apps, and it is a great topic to explain in a
 * viva: it limits how long a stolen token stays useful.
 * --------------------------------------------------------------
 */
import jwt from "jsonwebtoken";

export type UserRole = "student" | "worker" | "admin";

export interface JwtPayload {
  id: string;
  role: UserRole;
  email: string;
}

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
  });
}

export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}
