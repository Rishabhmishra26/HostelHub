/**
 * POST /api/auth/forgot-password
 * Sends an OTP (purpose = "reset-password") to the student's
 * email, the same mechanism used for signup verification.
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Otp from "@/models/Otp";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/lib/password";
import { generateOtp, otpExpiryDate } from "@/lib/otp";
import { sendEmail, otpEmailTemplate } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.errors[0].message }, { status: 400 });
  }
  const { email } = parsed.data;

  await connectDB();
  const student = await Student.findOne({ email });

  // We always return a generic success message (even if the email
  // doesn't exist) so attackers can't use this endpoint to find
  // out which emails are registered - a basic security habit.
  if (student) {
    const otp = generateOtp();
    const hashedOtp = await hashPassword(otp);
    await Otp.findOneAndDelete({ email, purpose: "reset-password" });
    await Otp.create({ email, code: hashedOtp, purpose: "reset-password", expiresAt: otpExpiryDate() });
    await sendEmail(email, "Reset your HostelHub password", otpEmailTemplate(otp));
  }

  return NextResponse.json({ message: "If that email exists, an OTP has been sent." });
}
