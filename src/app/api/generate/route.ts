import { NextRequest, NextResponse } from "next/server";
import { generateTripItineraryServer } from "@/lib/ai/decisionEngine";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destination, companions, budget, constraints, specialInstructions, tripId } = body;

    if (!destination) {
      return NextResponse.json({ error: "Destination is required" }, { status: 400 });
    }

    // Check cache first — don't re-run Gemini if we already have this trip
    if (tripId) {
      const { data: cached } = await supabase
        .from("reasoning_cache")
        .select("result")
        .eq("trip_id", tripId)
        .eq("stage_name", "full_itinerary")
        .single();

      if (cached?.result) {
        return NextResponse.json(cached.result);
      }
    }

    // Create or update a trip record in Supabase
    let currentTripId = tripId;
    if (!currentTripId) {
      const { data: trip, error: tripErr } = await supabase
        .from("trips")
        .insert({
          destination,
          preferences: { destination, companions, budget, constraints, specialInstructions },
          status: "pending",
        })
        .select("id")
        .single();

      if (tripErr) {
        console.error("Supabase insert error:", tripErr);
      } else {
        currentTripId = trip?.id;
      }
    }

    // Call Gemini
    const data = await generateTripItineraryServer({
      destination,
      companions: companions || "Solo Adventurer",
      budget: budget || "Comfort",
      constraints: constraints || [],
      specialInstructions: specialInstructions || "",
    });

    // Cache the result and update trip status
    if (currentTripId) {
      await supabase.from("reasoning_cache").insert({
        trip_id: currentTripId,
        stage_name: "full_itinerary",
        result: data,
      });

      await supabase
        .from("trips")
        .update({ status: "generated", selected_hotel: data.hotels?.[0]?.name || "" })
        .eq("id", currentTripId);
    }

    return NextResponse.json({ ...data, tripId: currentTripId });
  } catch (error: any) {
    console.error("API generate error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate travel plan" },
      { status: 500 }
    );
  }
}
