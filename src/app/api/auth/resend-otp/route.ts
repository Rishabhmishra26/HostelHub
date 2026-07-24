import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Otp from "@/models/Otp";
import { generateOtp, otpExpiryDate } from "@/lib/otp";
import { hashPassword } from "@/lib/password";
import { sendEmail, otpEmailTemplate } from "@/lib/mailer";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        await connectDB();

        const student = await Student.findOne({ email });

        if (!student) {
            return NextResponse.json(
                { message: "Account not found" },
                { status: 404 }
            );
        }

        if (student.isVerified) {
            return NextResponse.json(
                { message: "Account already verified" },
                { status: 400 }
            );
        }

        const otp = generateOtp();
        const hashedOtp = await hashPassword(otp);

        await Otp.findOneAndDelete({
            email,
            purpose: "verify-email",
        });

        await Otp.create({
            email,
            code: hashedOtp,
            purpose: "verify-email",
            expiresAt: otpExpiryDate(),
        });

        console.log("Resent OTP for", email, "is", otp);

        await sendEmail(
            email,
            "Verify your HostelHub account",
            otpEmailTemplate(otp)
        );

        return NextResponse.json({
            message: "OTP sent successfully",
        });
    }
    catch (err: any) {
        console.error("RESEND OTP ERROR:", err);

        return NextResponse.json(
            {
                message: err?.message || "Failed to resend OTP",
            },
            { status: 500 }
        );
    }
}