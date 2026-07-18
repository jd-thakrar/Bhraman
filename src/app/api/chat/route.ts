import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getAdminClient } from "@/lib/supabase/admin";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.gemini_api });

export async function POST(req: NextRequest) {
  try {
    const { message, itinerary, chatHistory, tripId } = await req.json();

    const context = itinerary ? `
Current trip context:
- Destination: ${itinerary.destination}
- Hotel: ${itinerary.hotels?.[0]?.name}
- Days: ${itinerary.itinerary?.length}
- Budget: ₹${itinerary.budget?.total?.toLocaleString()} INR

Current Itinerary:
${itinerary.itinerary?.map((d: any) => `Day ${d.day} - ${d.title}: ${d.activities?.map((a: any) => `${a.time} ${a.description}`).join(', ')}`).join('\n')}
` : "";

    const prompt = `You are Bhraman AI, a smart travel co-pilot for Indian trips. 
You help travelers handle live changes (e.g. flight delays, tiredness, rain, food preferences, adding activities).

The traveler says: "${message}"

${context}

Your response must be a JSON object with:
1. "reply": A natural, helpful response (2-3 sentences) explaining the change.
2. "updatedItinerary": If the request requires modifying the schedule/budget/packing, return the COMPLETE updated itinerary object matching the same structure. If no changes needed, return null.

Current itinerary data:
${JSON.stringify(itinerary, null, 2)}

Output valid JSON only:
{"reply": "string", "updatedItinerary": object_or_null}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const parsed = JSON.parse(response.text || "{}");

    // If the AI returned an updated itinerary AND we have a tripId, persist it
    if (parsed.updatedItinerary && tripId) {
      try {
        const db = getAdminClient();
        await db
          .from("trips")
          .update({ itinerary: parsed.updatedItinerary })
          .eq("id", tripId);
      } catch (dbErr) {
        console.warn("Failed to persist chat update:", dbErr);
      }
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("Chat error:", err);
    return NextResponse.json({
      reply: "I've noted your request! Let me adjust the plan accordingly.",
      updatedItinerary: null,
    });
  }
}
