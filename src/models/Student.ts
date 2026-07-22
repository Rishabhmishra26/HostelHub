/**
 * Student.ts
 * --------------------------------------------------------------
 * Mongoose schema for a Student user.
 * Notice the `select: false` on `password` - this means a normal
 * `Student.find()` will NEVER return the password hash unless we
 * explicitly ask for it with `.select("+password")`. This is a
 * simple but important security habit.
 * --------------------------------------------------------------
 */
import mongoose, { Schema, models, model } from "mongoose";

export interface IStudent extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profilePicture?: string;
  hostel: string;
  floor?: number;
  block?: string;
  roomNumber: string;
  isVerified: boolean;
  createdAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    profilePicture: { type: String, default: "" },
    hostel: { type: String, required: true },
    floor: { type: Number },
    block: { type: String },
    roomNumber: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevents "OverwriteModelError" during Next.js hot-reload in dev.
export default models.Student || model<IStudent>("Student", StudentSchema);
