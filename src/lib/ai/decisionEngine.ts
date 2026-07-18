import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.gemini_api });

export async function generateTripItineraryServer(preferences: { 
  destination: string; 
  companions: string; 
  budget: string; 
  constraints: string[]; 
  specialInstructions: string;
}) {
  const prompt = `You are a premium travel planning assistant. Generate a highly customized travel plan in India based on these preferences:
Destination / Vibe Idea: ${preferences.destination}
Companions: ${preferences.companions}
Budget Tier: ${preferences.budget}
Constraints / Preferences: ${preferences.constraints.join(', ') || 'None'}
Special Instructions: ${preferences.specialInstructions || 'None'}

You must respond with a raw JSON object. Do not include markdown code block formatting (like \`\`\`json). Just return the raw JSON text.
The JSON object must match this exact TypeScript structure:
{
  destination: string; // The specific Indian destination city/region determined based on inputs (e.g. "Manali, Himachal Pradesh", "Udaipur, Rajasthan")
  latitude: number; // Estimated latitude of the destination city center
  longitude: number; // Estimated longitude of the destination city center
  description: string; // Short engaging description reflecting companions and constraints
  hotels: [
    {
      id: "h1"; // Recommended winner matching budget & constraints perfectly
      name: string; 
      pricePerNight: number; // in INR
      rating: number; // e.g. 4.8
      walkability: number; // score 1-10
      travelTimeMinutes: number; // travel time from closest airport
      attributes: string[]; // e.g. ["Luxury", "Pool", "Quiet"]
      latitude: number; // Estimated latitude of this hotel
      longitude: number; // Estimated longitude of this hotel
    },
    {
      id: "h2"; // Rejected alternative 1
      name: string;
      pricePerNight: number;
      rating: number;
      walkability: number;
      travelTimeMinutes: number;
      attributes: string[];
      latitude: number;
      longitude: number;
    },
    {
      id: "h3"; // Rejected alternative 2
      name: string;
      pricePerNight: number;
      rating: number;
      walkability: number;
      travelTimeMinutes: number;
      attributes: string[];
      latitude: number;
      longitude: number;
    }
  ]; // Exactly 3 hotels: h1 must be the recommended winner, h2 and h3 are the alternatives/rejected options
  itinerary: [
    {
      day: number; // e.g. 1
      title: string;
      activities: [
        { time: string; description: string; }
      ]
    }
  ]; // At least 3 days
  budget: {
    flights: number; // in INR
    accommodation: number; // in INR
    food: number; // in INR
    activities: number; // in INR
    total: number; // Sum of all costs in INR
    currency: "INR";
  };
  packing_list: [
    {
      category: string; // e.g. "Clothing", "Essentials"
      items: string[];
    }
  ];
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating itinerary via Gemini API:", error);
    throw error;
  }
}

export async function recalculateConfidenceServer(
  selectedHotelId: string,
  rejectedHotelId: string,
  userConstraint: string
) {
  const prompt = `You are a travel planning decision assistant.
We have selected hotel ID "${selectedHotelId}" but the traveler is challenging this choice and wants alternative hotel ID "${rejectedHotelId}".
 Traveler's preference/reason: "${userConstraint}"

Analyze if the alternative hotel makes more sense now. Recalculate the confidence scores.
Return a raw JSON object matching this structure:
{
  "recalculated_confidence": number, // 0-100 score for the alternative stay
  "score_breakdown": {
    "budget_fit": number, // out of 30
    "travel_time": number, // out of 30
    "review_quality": number, // out of 20
    "walkability": number // out of 20
  },
  "delta_summary": "string", // Explanation of why the recommendation changed or stayed the same
  "still_recommend_selected": boolean // True if original selection remains better overall
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error recalculating confidence:", error);
    throw error;
  }
}
