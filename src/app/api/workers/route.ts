/**
 * /api/workers
 * GET  -> admin fetches the worker list (e.g. to populate the
 *         "Assign Worker" dropdown).
 * POST -> admin creates a new worker account.
 */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Worker from "@/models/Worker";
import { requireUser, ApiAuthError } from "@/lib/apiAuth";
import { hashPassword } from "@/lib/password";

export async function GET(req: NextRequest) {
  try {
    requireUser(req, ["admin"]);
    await connectDB();
    const workers = await Worker.find().sort({ name: 1 });
    return NextResponse.json(workers);
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ message: err.message }, { status: err.status });
    return NextResponse.json({ message: "Failed to fetch workers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireUser(req, ["admin"]);
    const body = await req.json();
    const { name, email, password, specialization, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email and password are required" }, { status: 400 });
    }

    await connectDB();
    const existing = await Worker.findOne({ email });
    if (existing) return NextResponse.json({ message: "Worker already exists" }, { status: 409 });

    const hashed = await hashPassword(password);
    const worker = await Worker.create({ name, email, password: hashed, specialization, phone });
    return NextResponse.json(worker, { status: 201 });
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ message: err.message }, { status: err.status });
    console.error(err);
    return NextResponse.json({ message: "Failed to create worker" }, { status: 500 });
  }
}
