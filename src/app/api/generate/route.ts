import { NextRequest, NextResponse } from "next/server";
import { generateTripItineraryServer } from "@/lib/ai/decisionEngine";
import { getMockDataFromPreferences } from "@/data/mockData";
import { getAdminClient, ensureSchema } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Weather code description helper
function getWeatherDescription(code: number): { condition: string; emoji: string } {
  const codes: Record<number, { condition: string; emoji: string }> = {
    0: { condition: "Clear Sky", emoji: "☀️" },
    1: { condition: "Mainly Clear", emoji: "🌤️" },
    2: { condition: "Partly Cloudy", emoji: "⛅" },
    3: { condition: "Overcast", emoji: "☁️" },
    45: { condition: "Foggy", emoji: "🌫️" },
    48: { condition: "Depositing Rime Fog", emoji: "🌫️" },
    51: { condition: "Light Drizzle", emoji: "🌧️" },
    53: { condition: "Moderate Drizzle", emoji: "🌧️" },
    55: { condition: "Dense Drizzle", emoji: "🌧️" },
    61: { condition: "Slight Rain", emoji: "🌧️" },
    63: { condition: "Moderate Rain", emoji: "🌧️" },
    65: { condition: "Heavy Rain", emoji: "⛈️" },
    71: { condition: "Slight Snowfall", emoji: "❄️" },
    73: { condition: "Moderate Snowfall", emoji: "❄️" },
    75: { condition: "Heavy Snowfall", emoji: "❄️" },
    77: { condition: "Snow Grains", emoji: "❄️" },
    80: { condition: "Slight Rain Showers", emoji: "🌧️" },
    81: { condition: "Moderate Rain Showers", emoji: "🌧️" },
    82: { condition: "Violent Rain Showers", emoji: "⛈️" },
    95: { condition: "Thunderstorm", emoji: "⚡" },
  };
  return codes[code] || { condition: "Pleasant Weather", emoji: "🍃" };
}

export async function POST(req: NextRequest) {
  try {
    await ensureSchema();

    const body = await req.json();
    const { destination, companions, budget, constraints, specialInstructions, tripId } = body;

    if (!destination) {
      return NextResponse.json({ error: "Destination is required" }, { status: 400 });
    }

    const preferences = {
      destination,
      companions: companions || "Solo Adventurer",
      budget: budget || "Comfort",
      constraints: constraints || [],
      specialInstructions: specialInstructions || "",
    };

    // Get authenticated user
    let userId: string | null = null;
    try {
      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {}

    const db = getAdminClient();
    let currentTripId = tripId as string | undefined;

    // Check for cached itinerary on existing trip
    if (currentTripId) {
      const { data: existing } = await db
        .from("trips")
        .select("itinerary")
        .eq("id", currentTripId)
        .single();

      if (existing?.itinerary) {
        return NextResponse.json({
          ...existing.itinerary,
          tripId: currentTripId,
          cached: true,
        });
      }
    }

    // Create new trip row if needed
    if (!currentTripId) {
      const { data: trip, error: tripErr } = await db
        .from("trips")
        .insert({
          destination,
          preferences,
          status: "generating",
          user_id: userId,
        })
        .select("id")
        .single();

      if (!tripErr && trip) {
        currentTripId = trip.id;
      }
    }

    // Generate itinerary dynamically using Gemini API (try live call first, fallback to mock if key is missing or calls fail)
    let data;
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is not defined.");
      }
      data = await generateTripItineraryServer(preferences);
    } catch (aiError) {
      console.warn("Live Gemini generation failed or key is missing. Falling back to dynamic mock generator:", aiError);
      data = getMockDataFromPreferences(preferences);
    }

    // ── Real-Time Weather Lookup ──────────────────────────────────────────
    let weather = { temp: 26, condition: "Pleasant", emoji: "🍃" };
    try {
      const lat = data.latitude || 24.5854;
      const lon = data.longitude || 73.7125;
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
        { next: { revalidate: 3600 } } // Cache weather query for 1 hour
      );
      if (weatherRes.ok) {
        const weatherData = await weatherRes.json();
        const current = weatherData.current_weather;
        if (current) {
          const desc = getWeatherDescription(current.weathercode);
          weather = {
            temp: Math.round(current.temperature),
            condition: desc.condition,
            emoji: desc.emoji,
          };
        }
      }
    } catch (weatherErr) {
      console.warn("Weather API call failed:", weatherErr);
    }

    // Append weather block to itinerary output
    data.weather = weather;

    // Save generated itinerary directly into the trip row
    if (currentTripId) {
      await db
        .from("trips")
        .update({
          status: "generated",
          selected_hotel: data.hotels?.[0]?.name || "",
          itinerary: data,
          user_id: userId,
        })
        .eq("id", currentTripId);
    }

    return NextResponse.json({
      ...data,
      tripId: currentTripId,
      source: "dynamic_ai",
    });
  } catch (error: unknown) {
    console.error("API generate error:", error);
    const fallback = getMockDataFromPreferences({
      destination: "Goa Beachfront Resort",
      companions: "Solo Adventurer",
      budget: "Comfort",
      constraints: [],
      specialInstructions: "",
    });
    return NextResponse.json({ ...fallback, source: "fallback" });
  }
}
