/**
 * Worker.ts
 * --------------------------------------------------------------
 * Maintenance staff who get complaints assigned to them.
 * `specialization` lets the admin quickly find, e.g., the right
 * electrician instead of assigning plumbing work to them.
 * --------------------------------------------------------------
 */
import mongoose, { Schema, models, model } from "mongoose";

export interface IWorker extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profilePicture?: string;
  specialization: string; // e.g. "Electrician", "Plumber", "General"
  assignedHostels: string[];
  createdAt: Date;
}

const WorkerSchema = new Schema<IWorker>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    profilePicture: { type: String, default: "" },
    specialization: { type: String, default: "General" },
    assignedHostels: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default models.Worker || model<IWorker>("Worker", WorkerSchema);
