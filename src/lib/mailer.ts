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
 */
import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  const transporter = getTransporter();

  await transporter.verify();
  console.log("SMTP verified successfully!");

  await transporter.sendMail({
    from: `"HostelHub" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent successfully to:", to);
}

export function otpEmailTemplate(otp: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color:#2563eb;">HostelHub Verification Code</h2>
      <p>Use the code below to verify your account. It expires in 10 minutes.</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
      <p style="color:#64748b; font-size:13px;">
        If you did not request this, you can ignore this email.
      </p>
    </div>
  `;
}