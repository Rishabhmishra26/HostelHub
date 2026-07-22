/**
 * POST /api/ai/suggest
 * Takes the student's raw complaint text and returns an AI
 * generated { title, category, improvedDescription }. This is
 * ONLY a suggestion - the student must click "Submit" themselves,
 * nothing is saved to the database here.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireUser, ApiAuthError } from "@/lib/apiAuth";
import { getAiSuggestion } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    requireUser(req, ["student"]);
    const { text } = await req.json();
    if (!text || text.trim().length < 5) {
      return NextResponse.json({ message: "Please write a bit more detail first" }, { status: 400 });
    }

    const suggestion = await getAiSuggestion(text);
    return NextResponse.json(suggestion);
  } catch (err) {
    if (err instanceof ApiAuthError) return NextResponse.json({ message: err.message }, { status: err.status });
    console.error(err);
    return NextResponse.json({ message: "AI suggestion failed" }, { status: 500 });
  }
}
