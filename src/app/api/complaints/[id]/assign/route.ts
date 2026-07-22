/**
 * PATCH /api/complaints/[id]/assign
 * Admin-only: assigns (or re-assigns) a worker to a complaint.
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Complaint from "@/models/Complaint";
import Notification from "@/models/Notification";
import { requireUser, ApiAuthError } from "@/lib/apiAuth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireUser(req, ["admin"]);
    const { workerId } = await req.json();

    await connectDB();
    const complaint = await Complaint.findById(params.id);
    if (!complaint) return NextResponse.json({ message: "Complaint not found" }, { status: 404 });

    complaint.assignedWorker = workerId;
    complaint.status = "Assigned";
    complaint.timeline.push({ status: "Assigned", note: "A worker has been assigned", timestamp: new Date() });
    await complaint.save();

    await Notification.create({
      recipient: complaint.student,
      recipientModel: "Student",
      message: `A worker has been assigned to your complaint "${complaint.title}"`,
      complaint: complaint._id,
    });

    return NextResponse.json(complaint);
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ message: err.message }, { status: err.status });
    console.error(err);
    return NextResponse.json({ message: "Failed to assign worker" }, { status: 500 });
  }
}
