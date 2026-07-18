-- ============================================================
-- TripMind — Seed Data (Optional)
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- Sample Goa trip with full itinerary cached
insert into public.trips (id, destination, preferences, selected_hotel, status)
values (
  'a0000000-0000-4000-8000-000000000001',
  'Goa, India',
  '{"destination": "Goa Beachfront Resort", "companions": "Couple / Romantic Getaway", "budget": "Comfort", "constraints": ["Pure Vegetarian / Jain Food"], "specialInstructions": ""}'::jsonb,
  'Taj Exotica Resort & Spa',
  'generated'
) on conflict (id) do nothing;

insert into public.reasoning_cache (trip_id, stage_name, result)
values (
  'a0000000-0000-4000-8000-000000000001',
  'full_itinerary',
  '{
    "destination": "Goa, India",
    "description": "Sun-kissed beaches and Portuguese heritage.",
    "flightRoute": "DEL → GOI · IndiGo 6E-234 · 2h 15m",
    "hotels": [
      {"id": "h1", "name": "Taj Exotica Resort & Spa", "pricePerNight": 25000, "rating": 4.8, "walkability": 8, "travelTimeMinutes": 45, "attributes": ["Luxury", "Beachfront"]},
      {"id": "h2", "name": "W Goa", "pricePerNight": 18000, "rating": 4.6, "walkability": 9, "travelTimeMinutes": 60, "attributes": ["Party", "Modern"]},
      {"id": "h3", "name": "Ahilya by the Sea", "pricePerNight": 22000, "rating": 4.9, "walkability": 6, "travelTimeMinutes": 75, "attributes": ["Boutique", "Heritage"]}
    ],
    "winnerConfidence": 87,
    "winnerBreakdown": {"budget_fit": 25, "travel_time": 28, "review_quality": 18, "walkability": 16},
    "rejectedScores": {"h2": 71, "h3": 65},
    "budget": {"flights": 15000, "accommodation": 50000, "food": 20000, "activities": 10000, "total": 95000, "currency": "INR"},
    "itinerary": [{"day": 1, "title": "Arrival", "activities": [{"time": "14:00", "description": "Check-in at Taj Exotica."}]}],
    "packing_list": [{"category": "Essentials", "items": ["Sunscreen SPF 50+", "Mosquito repellent"]}]
  }'::jsonb
);

-- Sample challenge response
insert into public.challenge_responses (trip_id, challenged_hotel_id, user_constraint, recalculated_confidence, score_breakdown, delta_summary, still_recommend_selected)
values (
  'a0000000-0000-4000-8000-000000000001',
  'h2',
  'Budget didn''t matter',
  81,
  '{"budget_fit": 28, "travel_time": 18, "review_quality": 17, "walkability": 18}'::jsonb,
  'With budget deprioritised, W Goa scores higher on nightlife and walkability but still trails on transfer time.',
  true
) on conflict do nothing;
