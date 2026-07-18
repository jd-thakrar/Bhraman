import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

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

    const prompt = `You are Bhraman AI, a smart travel assistant for Indian trips. You help travelers handle live changes — like flight delays, tiredness, weather changes, food preferences, or spontaneous mood shifts.

${context}

Recent conversation:
${historyText}

Traveler's message: "${message}"

Respond naturally and helpfully. If the traveler mentions a problem (delayed flight, tired, hungry, wants to skip something), give specific, actionable suggestions that account for their current trip context. Be concise (2-4 sentences max). Use Indian context (₹ prices, local food names, Indian transport options like auto-rickshaw, local train, etc.). If they want to change the itinerary, suggest specific time-slot swaps. End with a follow-up question or offer.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ reply: response.text });
  } catch (err: any) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { reply: "I'm having trouble connecting right now. Try rephrasing your question!" },
      { status: 200 }
    );
  }
}
