/**
 * GET /api/students - admin-only list of all registered students.
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import { requireUser, ApiAuthError } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    requireUser(req, ["admin"]);
    await connectDB();
    const students = await Student.find().sort({ createdAt: -1 });
    return NextResponse.json(students);
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ message: err.message }, { status: err.status });
    return NextResponse.json({ message: "Failed to fetch students" }, { status: 500 });
  }
}
