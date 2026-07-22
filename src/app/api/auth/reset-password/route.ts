/**
 * POST /api/auth/reset-password
 * Verifies the OTP sent by /forgot-password, then updates the
 * student's password hash.
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Otp from "@/models/Otp";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { hashPassword, comparePassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.errors[0].message }, { status: 400 });
  }
  const { email, otp, newPassword } = parsed.data;

  await connectDB();
  const record = await Otp.findOne({ email, purpose: "reset-password" });
  if (!record) {
    return NextResponse.json({ message: "OTP expired or not found" }, { status: 400 });
  }

  const isValid = await comparePassword(otp, record.code);
  if (!isValid) {
    return NextResponse.json({ message: "Incorrect OTP" }, { status: 400 });
  }

  const hashed = await hashPassword(newPassword);
  await Student.updateOne({ email }, { password: hashed });
  await Otp.deleteOne({ _id: record._id });

  return NextResponse.json({ message: "Password reset successfully. You can now log in." });
}
