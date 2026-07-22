/**
 * POST /api/upload
 * Accepts a single base64 image and forwards it to Cloudinary.
 * Kept as its own tiny endpoint so the ImageUploader component
 * can upload images one at a time and show per-image progress.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireUser, ApiAuthError } from "@/lib/apiAuth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    requireUser(req); // any logged-in role can upload
    const { image } = await req.json();
    if (!image) return NextResponse.json({ message: "No image provided" }, { status: 400 });

    const { url, publicId } = await uploadImage(image);
    return NextResponse.json({ url, publicId });
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ message: err.message }, { status: err.status });
    console.error(err);
    return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
  }
}
