/**
 * GET /api/auth/me
 * Returns the currently logged-in user (read from the JWT cookie)
 * so the frontend AuthContext can show name/role without ever
 * touching localStorage.
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/apiAuth";
import Student from "@/models/Student";
import Worker from "@/models/Worker";
import Admin from "@/models/Admin";

const MODEL_MAP = { student: Student, worker: Worker, admin: Admin } as const;

export async function GET(req: NextRequest) {
  const payload = getAuthUser(req);
  if (!payload) return NextResponse.json({ user: null }, { status: 401 });

  await connectDB();
  const Model = MODEL_MAP[payload.role];
  const user = await Model.findById(payload.id);
  if (!user) return NextResponse.json({ user: null }, { status: 401 });

  return NextResponse.json({
    user: {
      id: user._id, name: user.name, email: user.email, role: payload.role, profilePicture: user.profilePicture,
    },
  });
}
