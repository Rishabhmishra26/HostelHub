/**
 * /api/complaints/[id]
 * GET -> single complaint detail, with an ownership check so a
 * student can never view someone else's complaint by guessing
 * the URL id.
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Complaint from "@/models/Complaint";
import { requireUser, ApiAuthError } from "@/lib/apiAuth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireUser(req);
    await connectDB();

    const complaint = await Complaint.findById(params.id)
      .populate("student", "name email roomNumber phone")
      .populate("assignedWorker", "name specialization phone");

    if (!complaint) return NextResponse.json({ message: "Complaint not found" }, { status: 404 });

    const isOwner = user.role === "student" && complaint.student._id.toString() === user.id;
    const isAssignedWorker =
      user.role === "worker" && complaint.assignedWorker?._id?.toString() === user.id;

    if (!isOwner && !isAssignedWorker && user.role !== "admin") {
      return NextResponse.json({ message: "You cannot view this complaint" }, { status: 403 });
    }

    return NextResponse.json(complaint);
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ message: err.message }, { status: err.status });
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch complaint" }, { status: 500 });
  }
}
