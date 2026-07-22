/**
 * PATCH /api/auth/profile
 * Lets any logged-in user (student/worker/admin) update their
 * own phone number, profile picture, or password.
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Worker from "@/models/Worker";
import Admin from "@/models/Admin";
import { requireUser, ApiAuthError } from "@/lib/apiAuth";
import { hashPassword } from "@/lib/password";

const MODEL_MAP = { student: Student, worker: Worker, admin: Admin } as const;

export async function PATCH(req: NextRequest) {
  try {
    const user = requireUser(req);
    const { phone, profilePicture, newPassword } = await req.json();

    await connectDB();
    const Model = MODEL_MAP[user.role];

    const update: Record<string, any> = {};
    if (phone !== undefined) update.phone = phone;
    if (profilePicture !== undefined) update.profilePicture = profilePicture;
    if (newPassword) update.password = await hashPassword(newPassword);

    const updated = await Model.findByIdAndUpdate(user.id, update, { new: true });
    return NextResponse.json({
      id: updated._id, name: updated.name, email: updated.email, phone: updated.phone, profilePicture: updated.profilePicture,
    });
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ message: err.message }, { status: err.status });
    console.error(err);
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
