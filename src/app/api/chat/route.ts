import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({});

export async function POST(req: NextRequest) {
  try {
    const { message, itinerary, chatHistory } = await req.json();

    const context = itinerary ? `
Current trip context:
- Destination: ${itinerary.destination}
- Hotel: ${itinerary.hotels?.[0]?.name}
- Days: ${itinerary.itinerary?.length}
- Budget: ₹${itinerary.budget?.total?.toLocaleString()} INR

Current Itinerary:
${itinerary.itinerary?.map((d: any) => `Day ${d.day} - ${d.title}: ${d.activities?.map((a: any) => `${a.time} ${a.description}`).join(', ')}`).join('\n')}
` : "";

    const historyText = chatHistory?.slice(-6).map((m: any) => `${m.role === 'user' ? 'Traveler' : 'AI'}: ${m.content}`).join('\n') || '';

    const prompt = `You are Bhraman AI, a smart travel co-pilot for Indian trips. 
You help travelers handle live changes (e.g. flight delays, tiredness, rain, food preferences, adding activities).

Analyze the traveler's request: "${message}"

Your response must contain two parts in JSON format:
1. "reply": A natural, concise response (2-3 sentences) explaining how you are updating the plan.
2. "updatedItinerary": (Optional) If the traveler's request changes the schedule, budget, or packing list, return the COMPLETE, fully-updated itinerary object with the same structure as the current itinerary. If no changes are needed, return null.

Current Itinerary Object to modify:
${JSON.stringify(itinerary, null, 2)}

Strictly output your response as a valid JSON object matching this schema:
{
  "reply": "string",
  "updatedItinerary": object or null
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("Chat error:", err);
    return NextResponse.json({
      reply: "I've processed your update. Let's adjust your itinerary accordingly!",
      updatedItinerary: null
    });
  }
}
