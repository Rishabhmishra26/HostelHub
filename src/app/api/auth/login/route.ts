/**
 * POST /api/auth/login
 * --------------------------------------------------------------
 * Checks credentials against Student, Worker, AND Admin
 * collections (in that order) since all three roles share one
 * login form. On success it:
 *   1. Signs an access + refresh JWT
 *   2. Stores BOTH as httpOnly cookies (so client-side JS/XSS
 *      cannot read them - more secure than localStorage)
 *   3. Returns basic user info for the frontend AuthContext
 * --------------------------------------------------------------
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Worker from "@/models/Worker";
import Admin from "@/models/Admin";
import { loginSchema } from "@/lib/validations/auth";
import { comparePassword } from "@/lib/password";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.errors[0].message }, { status: 400 });
    }
    const { email, password } = parsed.data;

    await connectDB();

    // Try each role's collection until we find a matching email.
    let user: any = await Student.findOne({ email }).select("+password");
    let role: "student" | "worker" | "admin" = "student";

    if (!user) {
      user = await Worker.findOne({ email }).select("+password");
      role = "worker";
    }
    if (!user) {
      user = await Admin.findOne({ email }).select("+password");
      role = "admin";
    }

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    if (role === "student" && !user.isVerified) {
      return NextResponse.json({ message: "Please verify your email before logging in" }, { status: 403 });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const payload = { id: user._id.toString(), role, email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const response = NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role, profilePicture: user.profilePicture },
    });

    // httpOnly => JavaScript in the browser cannot read this cookie.
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 15,
    });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
