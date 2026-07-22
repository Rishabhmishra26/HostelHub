/**
 * Notification.ts
 * --------------------------------------------------------------
 * A simple in-app notification. `recipient` + `recipientModel`
 * uses Mongoose's "dynamic reference" pattern, so ONE collection
 * can serve notifications to Students, Workers, or Admins instead
 * of duplicating this schema three times.
 * --------------------------------------------------------------
 */
import mongoose, { Schema, models, model } from "mongoose";

export interface INotification extends mongoose.Document {
  recipient: mongoose.Types.ObjectId;
  recipientModel: "Student" | "Worker" | "Admin";
  message: string;
  complaint?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, required: true, refPath: "recipientModel" },
    recipientModel: { type: String, required: true, enum: ["Student", "Worker", "Admin"] },
    message: { type: String, required: true },
    complaint: { type: Schema.Types.ObjectId, ref: "Complaint" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Notification || model<INotification>("Notification", NotificationSchema);
