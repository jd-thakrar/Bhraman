export interface Hotel {
  id: string;
  name: string;
  pricePerNight: number;
  rating: number;
  walkability: number;
  travelTimeMinutes: number;
  attributes: string[];
  rejectionReason?: string;
}

export interface ScoreBreakdown {
  budget_fit: number;
  travel_time: number;
  review_quality: number;
  walkability: number;
}

export interface TripItinerary {
  destination: string;
  description: string;
  flightRoute?: string;
  seasonNote?: string;
  hotels: Hotel[];
  winnerConfidence: number;
  winnerBreakdown: ScoreBreakdown;
  rejectedScores: Record<string, number>;
  itinerary: Array<{
    day: number;
    title: string;
    activities: Array<{ time: string; description: string }>;
  }>;
  budget: {
    flights: number;
    accommodation: number;
    food: number;
    activities: number;
    total: number;
    currency: "INR";
  };
  packing_list: Array<{ category: string; items: string[] }>;
}

export interface TripPreferences {
  destination: string;
  companions: string;
  budget: string;
  constraints: string[];
  specialInstructions: string;
}

export interface ChallengeResponse {
  recalculated_confidence: number;
  score_breakdown: ScoreBreakdown;
  delta_summary: string;
  still_recommend_selected: boolean;
}
