/**
 * Admin.ts
 * --------------------------------------------------------------
 * College staff who manage the whole system.
 * --------------------------------------------------------------
 */
import mongoose, { Schema, models, model } from "mongoose";

export interface IAdmin extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    profilePicture: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.Admin || model<IAdmin>("Admin", AdminSchema);
