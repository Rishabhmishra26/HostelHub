/**
 * PATCH /api/complaints/[id]/status
 * --------------------------------------------------------------
 * Used by WORKERS to move a complaint through its lifecycle:
 * Assigned -> In Progress -> Completed. Every change appends a
 * new entry onto `timeline`, which is what powers the student's
 * "Submitted -> Assigned -> Work Started -> Completed" view.
 * Also creates a Notification for the student.
 * --------------------------------------------------------------
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Complaint from "@/models/Complaint";
import Notification from "@/models/Notification";
import { requireUser, ApiAuthError } from "@/lib/apiAuth";
import { COMPLAINT_STATUSES } from "@/lib/constants";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireUser(req, ["worker", "admin"]);
    const body = await req.json();
    const { status, note, completionImage } = body;

    // console.log("PATCH BODY:", body);
    // console.log("COMPLETION IMAGE:", completionImage);

    if (!COMPLAINT_STATUSES.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    await connectDB();
    const complaint = await Complaint.findById(params.id);
    if (!complaint) return NextResponse.json({ message: "Complaint not found" }, { status: 404 });

    if (user.role === "worker" && complaint.assignedWorker?.toString() !== user.id) {
      return NextResponse.json({ message: "This complaint is not assigned to you" }, { status: 403 });
    }

    complaint.status = status;
    complaint.timeline.push({ status, note, timestamp: new Date() });
    if (note) complaint.workerNotes = note;
    if (completionImage) {
      complaint.completionImages.push({
        url: completionImage.url,
        publicId: completionImage.publicId,
      });
    }
    await complaint.save();

    await Notification.create({
      recipient: complaint.student,
      recipientModel: "Student",
      message: `Your complaint "${complaint.title}" is now "${status}"`,
      complaint: complaint._id,
    });

    return NextResponse.json(complaint);
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ message: err.message }, { status: err.status });
    console.error(err);
    return NextResponse.json({ message: "Failed to update status" }, { status: 500 });
  }
}
