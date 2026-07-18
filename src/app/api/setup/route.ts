import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST() {
  const db = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const errors: string[] = [];

  // ── 1. Create tables if they don't exist ─────────────────────────────
  // Use rpc to execute raw SQL for table creation
  const createTablesSql = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS public.profiles (
      id          uuid PRIMARY KEY,
      email       text NOT NULL,
      role        text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
      created_at  timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public.trips (
      id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_at      timestamptz NOT NULL DEFAULT now(),
      user_id         uuid,
      destination     text,
      preferences     jsonb NOT NULL DEFAULT '{}'::jsonb,
      selected_hotel  text,
      status          text NOT NULL DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS public.reasoning_cache (
      id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      trip_id     uuid NOT NULL,
      stage_name  text NOT NULL,
      result      jsonb NOT NULL DEFAULT '{}'::jsonb,
      created_at  timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public.challenge_responses (
      id                      uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      trip_id                 uuid NOT NULL,
      challenged_hotel_id     text NOT NULL,
      user_constraint         text,
      recalculated_confidence integer,
      score_breakdown         jsonb NOT NULL DEFAULT '{}'::jsonb,
      delta_summary           text,
      still_recommend_selected boolean DEFAULT true,
      created_at              timestamptz NOT NULL DEFAULT now()
    );
  `;

  // Try to create tables via rpc
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ sql: createTablesSql }),
    });
    if (!res.ok) {
      // exec_sql function might not exist — that's OK, we'll try direct table operations
      console.warn("exec_sql RPC not available, tables must exist already");
    }
  } catch {
    console.warn("RPC call failed, continuing with seed data");
  }

  // ── 2. Test table existence ──────────────────────────────────────────
  const { error: pingTrips } = await db.from("trips").select("id").limit(1);
  if (pingTrips?.code === "42P01") {
    return NextResponse.json({
      ok: false,
      message: "Tables not found. Please run schema.sql in your Supabase SQL Editor first.",
      instructions: [
        "1. Go to your Supabase Dashboard → SQL Editor",
        "2. Copy the contents of schema.sql from the project root",
        "3. Paste and run it",
        "4. Then call this endpoint again to seed data",
      ],
      sqlEditorUrl: `https://supabase.com/dashboard/project/yvmcewikubyuzbpavstz/sql/new`,
    }, { status: 400 });
  }

  // Test profiles table existence
  const { error: pingProfiles } = await db.from("profiles").select("id").limit(1);
  if (pingProfiles?.code === "42P01") {
    return NextResponse.json({
      ok: false,
      message: "Profiles table not found. Please run schema.sql which includes the profiles table with role column.",
      sqlEditorUrl: `https://supabase.com/dashboard/project/yvmcewikubyuzbpavstz/sql/new`,
    }, { status: 400 });
  }

  // ── 3. Clear old seed data ───────────────────────────────────────────
  await db.from("challenge_responses").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await db.from("reasoning_cache").delete().in("trip_id", [
    "00000000-0000-0000-0000-000000000001",
    "00000000-0000-0000-0000-000000000002",
    "00000000-0000-0000-0000-000000000003",
  ]);
  await db.from("trips").delete().in("id", [
    "00000000-0000-0000-0000-000000000001",
    "00000000-0000-0000-0000-000000000002",
    "00000000-0000-0000-0000-000000000003",
  ]);

  // ── 4. Seed Trips ────────────────────────────────────────────────────
  const { error: tripErr } = await db.from("trips").upsert([
    {
      id: "00000000-0000-0000-0000-000000000001",
      destination: "Goa, India",
      preferences: {
        destination: "Goa Beaches",
        companions: "Couple 🕯️",
        budget: "Luxury",
        constraints: ["Direct Flights Only ✈️"],
        notes: "Anniversary trip. Want a private beach villa.",
      },
      selected_hotel: "Taj Exotica Resort & Spa",
      status: "generated",
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      destination: "Manali, Himachal Pradesh",
      preferences: {
        destination: "Manali Mountains",
        companions: "Friends 🍻",
        budget: "Comfort",
        constraints: ["Off-beat Spots ⛰️", "Wi-Fi for Remote Work 💻"],
        notes: "Group of 5 friends. Love trekking and local food.",
      },
      selected_hotel: "Solang Valley Resort",
      status: "generated",
    },
    {
      id: "00000000-0000-0000-0000-000000000003",
      destination: "Jaipur, Rajasthan",
      preferences: {
        destination: "Jaipur Pink City",
        companions: "Family 👨‍👩‍👧‍👦",
        budget: "Economy",
        constraints: ["Pure Veg / Jain Food 🥦", "Senior-Friendly 🧓"],
        notes: "Parents are 65+. Need easy walking, vegetarian meals.",
      },
      selected_hotel: "",
      status: "pending",
    },
  ]);
  if (tripErr) errors.push(`trips: ${tripErr.message}`);

  // ── 5. Seed Reasoning Cache ──────────────────────────────────────────
  const { error: cacheErr } = await db.from("reasoning_cache").upsert([
    {
      trip_id: "00000000-0000-0000-0000-000000000001",
      stage_name: "full_itinerary",
      result: {
        destination: "Goa, India",
        hotels: [
          { id: "h1", name: "Taj Exotica Resort & Spa", pricePerNight: 28000, rating: 4.9, walkability: 9, travelTimeMinutes: 40, attributes: ["Luxury", "Beachfront", "Spa", "Private Pool"] },
          { id: "h2", name: "W Goa – Vagator", pricePerNight: 18000, rating: 4.6, walkability: 8, travelTimeMinutes: 65, attributes: ["Trendy", "Nightlife", "Pool"] },
          { id: "h3", name: "Ahilya by the Sea", pricePerNight: 22000, rating: 4.8, walkability: 6, travelTimeMinutes: 80, attributes: ["Boutique", "Romantic", "Quiet"] },
        ],
        itinerary: [
          { day: 1, title: "Arrival & Sunset Drinks", activities: [{ time: "14:00", description: "Check in to private villa. Champagne welcome." }, { time: "18:00", description: "Sunset walk on Benaulim Beach." }, { time: "20:00", description: "Candlelight dinner at Thalassa with live music." }] },
          { day: 2, title: "Beach & Heritage", activities: [{ time: "09:00", description: "Private breakfast on villa terrace." }, { time: "11:00", description: "Basilica of Bom Jesus & Se Cathedral." }, { time: "15:00", description: "Spa session for two." }, { time: "19:00", description: "Sunset cruise on Mandovi River." }] },
          { day: 3, title: "Departure Day", activities: [{ time: "09:00", description: "Morning yoga on the beach." }, { time: "12:00", description: "Brunch at Fisherman's Wharf." }, { time: "15:00", description: "Transfer to Goa airport." }] },
        ],
        budget: { flights: 18000, accommodation: 84000, food: 15000, activities: 8000, total: 125000, currency: "INR" },
        packing_list: [
          { category: "Clothing", items: ["Beachwear", "Breezy cotton shirts", "Formal for dinner"] },
          { category: "Essentials", items: ["SPF 50 sunscreen", "Sunglasses", "Insect repellent"] },
        ],
      },
    },
    {
      trip_id: "00000000-0000-0000-0000-000000000002",
      stage_name: "full_itinerary",
      result: {
        destination: "Manali, Himachal Pradesh",
        hotels: [
          { id: "h1", name: "Solang Valley Resort", pricePerNight: 7500, rating: 4.5, walkability: 7, travelTimeMinutes: 55, attributes: ["Mountain View", "Adventure Base", "Wi-Fi"] },
          { id: "h2", name: "Club Mahindra Manali", pricePerNight: 9000, rating: 4.3, walkability: 5, travelTimeMinutes: 30, attributes: ["Family", "Pool", "Restaurant"] },
          { id: "h3", name: "Apple Country Resort", pricePerNight: 5500, rating: 4.1, walkability: 6, travelTimeMinutes: 40, attributes: ["Budget", "Orchard", "Cozy"] },
        ],
        itinerary: [
          { day: 1, title: "Arrival & Mall Road", activities: [{ time: "15:00", description: "Check in. Freshen up." }, { time: "18:00", description: "Stroll Mall Road, try local Siddu bread." }, { time: "20:00", description: "Dinner at Johnson's Café." }] },
          { day: 2, title: "Solang Valley & Snow", activities: [{ time: "08:00", description: "Early drive to Solang Valley." }, { time: "10:00", description: "Zorbing & rope activities in snow." }, { time: "14:00", description: "Yak ride & bonfire lunch." }, { time: "18:00", description: "Return & hot springs soak." }] },
          { day: 3, title: "Rohtang Pass Trek", activities: [{ time: "07:00", description: "Early start to Rohtang Pass (permit needed)." }, { time: "11:00", description: "Summit photography & chai." }, { time: "15:00", description: "Return via scenic Beas River trail." }] },
        ],
        budget: { flights: 12000, accommodation: 22500, food: 9000, activities: 7000, total: 50500, currency: "INR" },
        packing_list: [
          { category: "Warm Clothing", items: ["Thermals", "Heavy jacket", "Gloves & woollen cap"] },
          { category: "Trekking Gear", items: ["Waterproof boots", "Trekking poles", "Backpack"] },
        ],
      },
    },
  ]);
  if (cacheErr) errors.push(`reasoning_cache: ${cacheErr.message}`);

  // ── 6. Seed Challenge Responses ──────────────────────────────────────
  const { error: chalErr } = await db.from("challenge_responses").upsert([
    {
      trip_id: "00000000-0000-0000-0000-000000000001",
      challenged_hotel_id: "h2",
      user_constraint: "I prefer vibrant nightlife",
      recalculated_confidence: 78,
      score_breakdown: { budget_fit: 22, travel_time: 18, review_quality: 20, walkability: 18 },
      delta_summary: "W Goa scores higher for nightlife and walkability. However it loses on proximity (65min vs 40min from airport) and the romantic vibe you selected.",
      still_recommend_selected: true,
    },
    {
      trip_id: "00000000-0000-0000-0000-000000000002",
      challenged_hotel_id: "h2",
      user_constraint: "Budget doesn't matter",
      recalculated_confidence: 81,
      score_breakdown: { budget_fit: 28, travel_time: 24, review_quality: 17, walkability: 12 },
      delta_summary: "Club Mahindra scores better when budget is removed from scoring. It wins on comfort but loses points on walkability and off-beat vibes.",
      still_recommend_selected: false,
    },
  ]);
  if (chalErr) errors.push(`challenge_responses: ${chalErr.message}`);

  // ── 7. Create a demo admin user profile ──────────────────────────────
  // (We can't create auth users via client SDK, but we can prepare profiles)
  
  if (errors.length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: "✓ Supabase seeded successfully with 3 trips, 2 cached itineraries, 2 AI challenges.",
    counts: { trips: 3, cached: 2, challenges: 2 },
    nextSteps: [
      "1. Go to /login and register a customer account",
      "2. Register a second account with 'Administrator' role selected",
      "3. Sign in as customer → /plan workspace loads with saved trips",
      "4. Sign in as admin → /admin dashboard with real-time monitoring",
    ],
  });
}

export async function GET() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  // Test all tables
  const results: Record<string, any> = {};

  const { data: trips, error: tripsErr } = await db.from("trips").select("id, destination, status").order("created_at", { ascending: false }).limit(5);
  results.trips = tripsErr ? { error: tripsErr.message, code: tripsErr.code } : { count: trips?.length, data: trips };

  const { data: profiles, error: profilesErr } = await db.from("profiles").select("id, email, role").limit(5);
  results.profiles = profilesErr ? { error: profilesErr.message, code: profilesErr.code } : { count: profiles?.length, data: profiles };

  const { data: cache, error: cacheErr } = await db.from("reasoning_cache").select("id, trip_id, stage_name").limit(5);
  results.reasoning_cache = cacheErr ? { error: cacheErr.message, code: cacheErr.code } : { count: cache?.length, data: cache };

  const { data: challenges, error: chalErr } = await db.from("challenge_responses").select("id, challenged_hotel_id").limit(5);
  results.challenge_responses = chalErr ? { error: chalErr.message, code: chalErr.code } : { count: challenges?.length, data: challenges };

  const allOk = !tripsErr && !profilesErr && !cacheErr && !chalErr;

  return NextResponse.json({ ok: allOk, tables: results });
}
