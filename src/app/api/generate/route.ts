import { NextRequest, NextResponse } from "next/server";
import { generateTripItineraryServer } from "@/lib/ai/decisionEngine";
import { getMockDataFromPreferences } from "@/data/mockData";
import {
  getSupabaseServer,
  getAuthenticatedUserId,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "true" || !process.env.GEMINI_API_KEY;
}

export async function POST(req: NextRequest) {
  try {
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

    const supabase = getSupabaseServer();
    const userId = await getAuthenticatedUserId();
    let currentTripId = tripId as string | undefined;

    if (currentTripId && supabase) {
      const { data: cached } = await supabase
        .from("reasoning_cache")
        .select("result")
        .eq("trip_id", currentTripId)
        .eq("stage_name", "full_itinerary")
        .maybeSingle();

      if (cached?.result) {
        return NextResponse.json({
          ...cached.result,
          tripId: currentTripId,
          supabaseConnected: true,
          cached: true,
        });
      }
    }

    if (!currentTripId && supabase) {
      const { data: trip, error: tripErr } = await supabase
        .from("trips")
        .insert({
          destination,
          preferences,
          status: "pending",
          user_id: userId,
        })
        .select("id")
        .single();

      if (tripErr) {
        console.warn("Supabase insert skipped:", tripErr.message);
      } else {
        currentTripId = trip?.id;
      }
    } else if (currentTripId && supabase && userId) {
      await supabase
        .from("trips")
        .update({ user_id: userId, preferences, destination })
        .eq("id", currentTripId);
    }

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

    if (currentTripId && supabase) {
      const { error: cacheErr } = await supabase.from("reasoning_cache").insert({
        trip_id: currentTripId,
        stage_name: "full_itinerary",
        result: data,
      });

      if (cacheErr) {
        console.warn("Cache insert failed:", cacheErr.message);
      }

      await supabase
        .from("trips")
        .update({ status: "generated", selected_hotel: data.hotels?.[0]?.name || "" })
        .eq("id", currentTripId);
    }

    return NextResponse.json({
      ...data,
      tripId: currentTripId,
      source: isDemoMode() ? "demo" : "ai",
      supabaseConnected: isSupabaseConfigured(),
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
    return NextResponse.json({
      ...fallback,
      source: "fallback",
      supabaseConnected: isSupabaseConfigured(),
    });
  }
}
