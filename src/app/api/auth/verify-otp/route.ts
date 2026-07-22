/**
 * POST /api/auth/verify-otp
 * --------------------------------------------------------------
 * Step 2 of signup: student enters the OTP they received by
 * email. If it matches (and hasn't expired), we mark the account
 * `isVerified: true` so they can now log in.
 * --------------------------------------------------------------
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Otp from "@/models/Otp";
import { verifyOtpSchema } from "@/lib/validations/auth";
import { comparePassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifyOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.errors[0].message }, { status: 400 });
    }
    const { email, otp } = parsed.data;

    await connectDB();

    const record = await Otp.findOne({ email, purpose: "verify-email" });
    if (!record) {
      return NextResponse.json({ message: "OTP expired or not found. Please register again." }, { status: 400 });
    }

    const isValid = await comparePassword(otp, record.code);
    if (!isValid) {
      return NextResponse.json({ message: "Incorrect OTP" }, { status: 400 });
    }

    await Student.updateOne({ email }, { isVerified: true });
    await Otp.deleteOne({ _id: record._id });

    return NextResponse.json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Verification failed" }, { status: 500 });
  }
}
