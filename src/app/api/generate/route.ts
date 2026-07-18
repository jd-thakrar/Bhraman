import { NextRequest, NextResponse } from "next/server";
import { generateTripItineraryServer } from "@/lib/ai/decisionEngine";
import { getMockDataFromPreferences } from "@/data/mockData";
import { getAdminClient, ensureSchema } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "true" || !process.env.GEMINI_API_KEY;
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

    // Generate itinerary
    let data;
    if (isDemoMode()) {
      data = getMockDataFromPreferences(preferences);
    } else {
      try {
        data = await generateTripItineraryServer(preferences);
      } catch (aiError) {
        console.warn("Gemini failed, using mock data:", aiError);
        data = getMockDataFromPreferences(preferences);
      }
    }

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
      source: isDemoMode() ? "demo" : "ai",
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
