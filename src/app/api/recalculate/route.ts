import { NextRequest, NextResponse } from "next/server";
import { recalculateConfidenceServer } from "@/lib/ai/decisionEngine";
import { getMockChallengeResponse } from "@/data/mockData";
import { getSupabaseServer } from "@/lib/supabase/server";

function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "true" || !process.env.GEMINI_API_KEY;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { selectedHotelId, rejectedHotelId, userConstraint, tripId } = body;

    if (!selectedHotelId || !rejectedHotelId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let data;
    if (isDemoMode()) {
      data = getMockChallengeResponse(rejectedHotelId, userConstraint || "");
    } else {
      try {
        data = await recalculateConfidenceServer(
          selectedHotelId,
          rejectedHotelId,
          userConstraint || ""
        );
      } catch {
        data = getMockChallengeResponse(rejectedHotelId, userConstraint || "");
      }
    }

    const supabase = getSupabaseServer();
    if (tripId && supabase) {
      await supabase.from("challenge_responses").insert({
        trip_id: tripId,
        challenged_hotel_id: rejectedHotelId,
        user_constraint: userConstraint || "",
        recalculated_confidence: data.recalculated_confidence,
        score_breakdown: data.score_breakdown,
        delta_summary: data.delta_summary,
        still_recommend_selected: data.still_recommend_selected,
      });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("API recalculate error:", error);
    return NextResponse.json(
      getMockChallengeResponse("h2", "Budget didn't matter")
    );
  }
}
