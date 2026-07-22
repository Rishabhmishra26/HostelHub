/**
 * apiAuth.ts
 * --------------------------------------------------------------
 * Helper used INSIDE API routes to find out who is calling them.
 * The access token is read from the "accessToken" cookie (set
 * during login - see /api/auth/login/route.ts).
 *
 * We deliberately keep this separate from `middleware.ts`:
 *  - middleware.ts   -> blocks the request before it reaches the
 *                       page/route (fast, runs on the Edge)
 *  - apiAuth.ts       -> used INSIDE a route handler when we also
 *                       need the user's id/role to fetch their data
 * --------------------------------------------------------------
 */
import { NextRequest } from "next/server";
import { verifyAccessToken, JwtPayload, UserRole } from "@/lib/jwt";

export function getAuthUser(req: NextRequest): JwtPayload | null {
  const token = req.cookies.get("accessToken")?.value;
  if (!token) return null;

  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

/** Throws a 401/403-style error object that the route can catch and return. */
export class ApiAuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export function requireUser(req: NextRequest, allowedRoles?: UserRole[]): JwtPayload {
  const user = getAuthUser(req);
  if (!user) throw new ApiAuthError("Not authenticated", 401);
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new ApiAuthError("You do not have permission to do this", 403);
  }
  return user;
}
