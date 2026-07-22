/**
 * GET /api/hostels - returns hostel/floor/block reference data,
 * used to populate dropdowns and the admin's hostel management page.
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Hostel from "@/models/Hostel";
import { requireUser, ApiAuthError } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    requireUser(req);
    await connectDB();
    const hostels = await Hostel.find();
    return NextResponse.json(hostels);
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ message: err.message }, { status: err.status });
    return NextResponse.json({ message: "Failed to fetch hostels" }, { status: 500 });
  }
}
