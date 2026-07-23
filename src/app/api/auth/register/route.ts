/**
 * POST /api/auth/register
 * --------------------------------------------------------------
 * Step 1 of signup: create an UNVERIFIED student account and
 * email them a 6-digit OTP. The account cannot log in until it
 * is verified via /api/auth/verify-otp.
 * --------------------------------------------------------------
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Otp from "@/models/Otp";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/lib/password";
import { generateOtp, otpExpiryDate } from "@/lib/otp";
import { sendEmail, otpEmailTemplate } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, email, password, hostel, floor, block, roomNumber } = parsed.data;

    await connectDB();

    const existing = await Student.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    await Student.create({
      name, email, password: hashedPassword, hostel, floor, block, roomNumber, isVerified: false,
    });

    // Generate + store a hashed OTP, then email the plain code to the student.
    const otp = generateOtp();
    const hashedOtp = await hashPassword(otp);
    await Otp.findOneAndDelete({ email, purpose: "verify-email" }); // remove any stale OTP first
    await Otp.create({ email, code: hashedOtp, purpose: "verify-email", expiresAt: otpExpiryDate() });

    console.log("OTP for", email, "is", otp);

    try {
      await sendEmail(
        email,
        "Verify your HostelHub account",
        otpEmailTemplate(otp)
      );
    } catch (err) {
      console.error("Email sending failed:", err);
    }
    return NextResponse.json({ message: "Registered. Check your email for the OTP." }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Registered successfully. Enter the OTP shown in the terminal." },
      { status: 201 }
    );
  }
}
