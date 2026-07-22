/**
 * middleware.ts
 * --------------------------------------------------------------
 * Runs BEFORE every matching request reaches a page. This is how
 * we implement "Protected Routes" + "Role Based Authentication":
 *
 *  1. No token at all           -> redirect to /login
 *  2. Token belongs to wrong role for that section -> redirect to
 *     that role's own dashboard (a student can't open /admin/*)
 *
 * We only decode the JWT here (cheap) - we never touch the
 * database in middleware, since middleware runs on Next.js's
 * lightweight Edge runtime.
 * --------------------------------------------------------------
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Next.js middleware runs on the lightweight "Edge Runtime", which
// does not support Node.js APIs used by the `jsonwebtoken` package.
// `jose` is a Web-Crypto-based JWT library that works on the Edge,
// so we use it here ONLY for verification. Signing still happens
// with `jsonwebtoken` inside API routes (see src/lib/jwt.ts), which
// run in the normal Node.js runtime.
const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

const ROLE_HOME: Record<string, string> = {
  student: "/student/dashboard",
  worker: "/worker/dashboard",
  admin: "/admin/dashboard",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected =
    pathname.startsWith("/student") || pathname.startsWith("/worker") || pathname.startsWith("/admin");

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    const role = payload.role as string;

    // Each role can only access its own section of the app.
    if (pathname.startsWith("/student") && role !== "student") {
      return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));
    }
    if (pathname.startsWith("/worker") && role !== "worker") {
      return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));
    }
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));
    }

    return NextResponse.next();
  } catch {
    // Token expired/invalid -> treat as logged out.
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/student/:path*", "/worker/:path*", "/admin/:path*"],
};
