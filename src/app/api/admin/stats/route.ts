/**
 * GET /api/admin/stats
 * Aggregated counts for the Admin Dashboard: total/pending/
 * completed complaints, plus a hostel-wise and category-wise
 * breakdown. Uses MongoDB's aggregation pipeline ($group) instead
 * of pulling every complaint into Node and counting in JS - much
 * faster once there are thousands of complaints.
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Complaint from "@/models/Complaint";
import { requireUser, ApiAuthError } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    requireUser(req, ["admin"]);
    await connectDB();

    const [total, pending, completed] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: { $in: ["Pending", "Assigned", "In Progress"] } }),
      Complaint.countDocuments({ status: { $in: ["Completed", "Closed"] } }),
    ]);

    const hostelWise = await Complaint.aggregate([
      { $group: { _id: "$hostel", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categoryWise = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return NextResponse.json({ total, pending, completed, hostelWise, categoryWise });
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ message: err.message }, { status: err.status });
    console.error(err);
    return NextResponse.json({ message: "Failed to load stats" }, { status: 500 });
  }
}
