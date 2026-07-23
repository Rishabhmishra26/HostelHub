/**
 * mailer.ts
 * --------------------------------------------------------------
 * Sends transactional emails (OTP codes, password reset links)
 * using Nodemailer + any SMTP provider (Gmail, SendGrid, etc).
 *
 * Kept as a single `sendEmail` function so the rest of the app
 * doesn't need to know HOW email is sent - only WHAT to send.
 * This is the "single responsibility" idea: one file, one job.
 * --------------------------------------------------------------
 */import { resend } from "./resend";

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  try {
    const { error } = await resend.emails.send({
      from: "HostelHub <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend Error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Email Error:", err);
    throw err;
  }
}

export function otpEmailTemplate(otp: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width:480px; margin:auto;">
      <h2 style="color:#2563eb;">HostelHub Verification Code</h2>

      <p>
        Use the verification code below to verify your HostelHub account.
      </p>

      <div
        style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:6px;
          background:#f3f4f6;
          padding:18px;
          text-align:center;
          border-radius:8px;
        "
      >
        ${otp}
      </div>

      <p style="margin-top:20px;">
        This OTP will expire in <b>10 minutes</b>.
      </p>

      <p style="color:#6b7280;font-size:13px;">
        If you didn't request this email, you can safely ignore it.
      </p>
    </div>
  `;
}