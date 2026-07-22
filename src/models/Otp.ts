/**
 * Otp.ts
 * --------------------------------------------------------------
 * Temporary storage for email-verification / password-reset
 * codes. `expiresAt` has a TTL (time-to-live) index, so MongoDB
 * automatically deletes the document once it expires - we don't
 * need a manual cleanup cron job.
 * --------------------------------------------------------------
 */
import mongoose, { Schema, models, model } from "mongoose";

export interface IOtp extends mongoose.Document {
  email: string;
  code: string; // hashed OTP
  purpose: "verify-email" | "reset-password";
  expiresAt: Date;
}

const OtpSchema = new Schema<IOtp>({
  email: { type: String, required: true, lowercase: true },
  code: { type: String, required: true },
  purpose: { type: String, enum: ["verify-email", "reset-password"], required: true },
  expiresAt: { type: Date, required: true },
});

// TTL index: MongoDB deletes the document automatically once
// the current time passes `expiresAt`.
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default models.Otp || model<IOtp>("Otp", OtpSchema);
