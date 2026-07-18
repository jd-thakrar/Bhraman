import { GoogleGenAI } from '@google/genai';

// Initialize SDK. It will automatically load GEMINI_API_KEY from environment variables.
const ai = new GoogleGenAI({});

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
    },
    {
      id: "h2"; // Rejected alternative 1
      name: string;
      pricePerNight: number;
      rating: number;
      walkability: number;
      travelTimeMinutes: number;
      attributes: string[];
    },
    {
      id: "h3"; // Rejected alternative 2
      name: string;
      pricePerNight: number;
      rating: number;
      walkability: number;
      travelTimeMinutes: number;
      attributes: string[];
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

export async function recalculateConfidenceServer(selectedOptionId: string, rejectedOptionId: string, userConstraint: string) {
  const prompt = `You are a travel recommender algorithm. We previously recommended hotel ${selectedOptionId} and rejected hotel ${rejectedOptionId}.
The user has challenged this decision with the following override constraint: "${userConstraint}"

Recalculate the match score and confidence level of the rejected hotel (${rejectedOptionId}) if we apply this constraint override.
Return a raw JSON object with this exact structure:
{
  recalculated_confidence: number; // new confidence score out of 100
  score_breakdown: {
    budget_fit: number; // score out of 30
    travel_time: number; // score out of 30
    review_quality: number; // score out of 20
    walkability: number; // score out of 20
  };
  delta_summary: string; // A short explanation (1-2 sentences) of how this constraint change impacts the decision
  still_recommend_selected: boolean; // whether the primary recommendation stays the winner
}

Just return the raw JSON object. Do not wrap in markdown formatting.`;

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
    console.error("Error recalculating confidence via Gemini API:", error);
    throw error;
  }
}
