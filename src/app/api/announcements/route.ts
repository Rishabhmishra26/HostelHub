/**
 * /api/announcements
 * A lightweight announcement is just a Notification broadcast to
 * ALL students at once (recipientModel = "Student"). Kept simple
 * on purpose - a real "Announcement" collection would be the
 * next natural refactor once the feature grows.
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import Notification from "@/models/Notification";
import { requireUser, ApiAuthError } from "@/lib/apiAuth";

export async function POST(req: NextRequest) {
  try {
    requireUser(req, ["admin"]);
    const { message } = await req.json();
    if (!message) return NextResponse.json({ message: "Announcement text is required" }, { status: 400 });

    await connectDB();
    const students = await Student.find().select("_id");
    await Notification.insertMany(
      students.map((s) => ({ recipient: s._id, recipientModel: "Student", message }))
    );

    return NextResponse.json({ message: "Announcement sent to all students" });
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ message: err.message }, { status: err.status });
    console.error(err);
    return NextResponse.json({ message: "Failed to send announcement" }, { status: 500 });
  }
}
