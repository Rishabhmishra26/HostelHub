/**
 * /api/complaints
 * --------------------------------------------------------------
 * GET  -> list complaints (with search, filters, pagination).
 *         - Students only see THEIR OWN complaints.
 *         - Workers only see complaints ASSIGNED to them.
 *         - Admins see EVERYTHING.
 * POST -> create a new complaint (students only).
 * --------------------------------------------------------------
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Complaint from "@/models/Complaint";
import { complaintSchema } from "@/lib/validations/complaint";
import { requireUser, ApiAuthError } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    const user = requireUser(req); // any logged-in role may list (scoped below)
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Number(searchParams.get("pageSize") || 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const hostel = searchParams.get("hostel") || "";
    const category = searchParams.get("category") || "";

    const query: Record<string, any> = {};
    if (user.role === "student") query.student = user.id;
    if (user.role === "worker") query.assignedWorker = user.id;
    if (status) query.status = status;
    if (hostel) query.hostel = hostel;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { roomNumber: { $regex: search, $options: "i" } },
        { _id: search.match(/^[0-9a-fA-F]{24}$/) ? search : undefined },
      ].filter((c) => Object.values(c)[0] !== undefined);
    }

    const total = await Complaint.countDocuments(query);
    const data = await Complaint.find(query)
      .populate("student", "name email roomNumber")
      .populate("assignedWorker", "name specialization")
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return NextResponse.json({
      data, total, page, pageSize, totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ message: err.message }, { status: err.status });
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch complaints" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireUser(req, ["student"]);
    const body = await req.json();
    // console.log("COMPLAINT BODY:", body);
    const parsed = complaintSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.errors[0].message }, { status: 400 });
    }

    await connectDB();

    const images = body.images || [];

    const complaint = await Complaint.create({
      ...parsed.data,
      student: user.id,
      images,
      aiAssisted: Boolean(body.aiAssisted),
    });

    return NextResponse.json(complaint, { status: 201 });
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ message: err.message }, { status: err.status });
    console.error(err);
    return NextResponse.json({ message: "Failed to submit complaint" }, { status: 500 });
  }
}
