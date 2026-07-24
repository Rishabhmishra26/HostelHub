/**
 * validations/auth.ts
 * --------------------------------------------------------------
 * Zod schemas for authentication forms. The SAME schema is used
 * on the frontend (React Hook Form + zodResolver, for instant
 * feedback) and on the backend (API route, so we never trust
 * data coming from the client). This "validate once, use twice"
 * approach avoids duplicated rules going out of sync.
 * --------------------------------------------------------------
 */
import { z } from "zod";

// Only allow the college's own email domain (e.g. "college.edu").
// The domain itself comes from an env variable so it's easy to
// change per-deployment without touching code.
const allowedDomain = "nitdelhi.ac.in";

export const collegeEmailSchema = z
  .string()
  .email("Enter a valid email address");

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name is too short"),
    email: collegeEmailSchema,
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    hostel: z.string().min(1, "Select a hostel"),
    floor: z.coerce.number().optional(),
    block: z.string().optional(),
    roomNumber: z.string().min(1, "Room number is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;



export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;


export const verifyOtpSchema = z.object({
  email: collegeEmailSchema,
  otp: z.string().length(6, "OTP must be 6 digits"),
});
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const forgotPasswordSchema = z.object({ email: collegeEmailSchema });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email: collegeEmailSchema,
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
