/**
 * gemini.ts
 * --------------------------------------------------------------
 * Talks to Google's Gemini API to give the student a HELPING
 * HAND while writing a complaint. It never submits anything by
 * itself - it only returns suggestions that the student can edit
 * or ignore, which is why the API route is called "/api/ai/suggest".
 *
 * We ask Gemini to reply in strict JSON so our backend can parse
 * it reliably (see the "structured output" pattern).
 * --------------------------------------------------------------
 */

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

export interface AiSuggestion {
  title: string;
  category: string;
  improvedDescription: string;
}

const CATEGORY_LIST = [
  "Electricity", "Water Leakage", "Cleaning", "Washroom", "Broken Door Handle",
  "Window Damage", "Furniture", "WiFi / Internet", "Mess", "Fan", "Tube Light",
  "Switch Board", "Water Cooler", "Lift", "Plumbing", "Security", "Garbage", "Other",
];

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function getAiSuggestion(rawText: string): Promise<AiSuggestion> {
  if (!process.env.GEMINI_API_KEY) {
    return fallbackSuggestion(rawText);
  }

  const prompt = `
You are helping a hostel student write a maintenance complaint.

Reply ONLY in valid JSON.

{
  "title": "",
  "category": "",
  "improvedDescription": ""
}

Valid categories:
${CATEGORY_LIST.join(", ")}

Student Complaint:
${rawText}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    const text = response.text ?? "";

    // console.log("Gemini:", text);

    const parsed = JSON.parse(
      text.replace(/```json|```/g, "").trim()
    );

    return {
      title: parsed.title,
      category: CATEGORY_LIST.includes(parsed.category)
        ? parsed.category
        : "Other",
      improvedDescription: parsed.improvedDescription,
    };
  } catch (err) {
    console.error(err);
    return fallbackSuggestion(rawText);
  }
}

/** Very small keyword-matching fallback so the AI feature "degrades gracefully". */
function fallbackSuggestion(rawText: string): AiSuggestion {
  const text = rawText.toLowerCase();
  const map: Record<string, string> = {
    fan: "Fan", light: "Tube Light", bulb: "Tube Light", wifi: "WiFi / Internet",
    internet: "WiFi / Internet", water: "Water Leakage", tap: "Plumbing",
    door: "Broken Door Handle", window: "Window Damage", switch: "Switch Board",
    lift: "Lift", elevator: "Lift", mess: "Mess", food: "Mess", clean: "Cleaning",
    washroom: "Washroom", toilet: "Washroom", furniture: "Furniture",
    chair: "Furniture", table: "Furniture", cooler: "Water Cooler",
    garbage: "Garbage", security: "Security", electricity: "Electricity",
  };
  const found = Object.keys(map).find((k) => text.includes(k));
  const category = found ? map[found] : "Other";
  const title = rawText.split(" ").slice(0, 6).join(" ");

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    category,
    improvedDescription: rawText.trim(),
  };
}
