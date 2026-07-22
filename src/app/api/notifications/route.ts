/**
 * GET /api/notifications - the logged-in user's own notifications,
 * newest first.
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { requireUser, ApiAuthError } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    const user = requireUser(req);
    await connectDB();
    const notifications = await Notification.find({ recipient: user.id }).sort({ createdAt: -1 }).limit(20);
    return NextResponse.json(notifications);
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ message: err.message }, { status: err.status });
    return NextResponse.json({ message: "Failed to fetch notifications" }, { status: 500 });
  }
}
