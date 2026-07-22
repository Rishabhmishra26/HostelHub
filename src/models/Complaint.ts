/**
 * Complaint.ts
 * --------------------------------------------------------------
 * The most important collection in the whole app.
 *
 * `timeline` is an embedded array (sub-documents) rather than a
 * separate collection because timeline entries:
 *   1. Always belong to exactly one complaint (no sharing).
 *   2. Are always read together with the complaint.
 * This is a classic "embed vs reference" decision in MongoDB
 * schema design - a great thing to be able to explain in a viva.
 * --------------------------------------------------------------
 */
import mongoose, { Schema, models, model } from "mongoose";
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } from "@/lib/constants";

export interface ITimelineEntry {
  status: string;
  note?: string;
  timestamp: Date;
}

export interface IComplaint extends mongoose.Document {
  student: mongoose.Types.ObjectId;
  hostel: string;
  floor?: number;
  block?: string;
  roomNumber: string;
  category: string;
  title: string;
  description: string;
  images: { url: string; publicId: string }[];
  completionImages: { url: string; publicId: string }[];
  status: string;
  assignedWorker?: mongoose.Types.ObjectId;
  workerNotes?: string;
  timeline: ITimelineEntry[];
  aiAssisted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TimelineEntrySchema = new Schema<ITimelineEntry>(
  {
    status: { type: String, required: true },
    note: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const ComplaintSchema = new Schema<IComplaint>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    hostel: { type: String, required: true },
    floor: { type: Number },
    block: { type: String },
    roomNumber: { type: String, required: true },
    category: { type: String, enum: COMPLAINT_CATEGORIES, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [ImageSchema], default: [] },
    completionImages: { type: [ImageSchema], default: [] },
    status: { type: String, enum: COMPLAINT_STATUSES, default: "Pending", index: true },
    assignedWorker: { type: Schema.Types.ObjectId, ref: "Worker" },
    workerNotes: { type: String },
    timeline: {
      type: [TimelineEntrySchema],
      default: () => [{ status: "Pending", note: "Complaint submitted by student", timestamp: new Date() }],
    },
    aiAssisted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Speeds up the admin/student search bar (complaint id, room, category).
ComplaintSchema.index({ title: "text", roomNumber: "text" });

export default models.Complaint || model<IComplaint>("Complaint", ComplaintSchema);
