/**
 * otp.ts
 * --------------------------------------------------------------
 * Generates a 6-digit One-Time-Password used for:
 *  - Verifying a student's college email at registration
 *  - Verifying identity during "Forgot Password"
 *
 * The OTP itself is stored (hashed) in the `Otp` collection with
 * an `expiresAt` field. MongoDB's TTL index automatically deletes
 * expired OTPs, so we never need a cleanup job.
 * --------------------------------------------------------------
 */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function otpExpiryDate(minutes = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
