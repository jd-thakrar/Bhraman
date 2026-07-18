import { NextResponse } from "next/server";
import { getAdminClient, SCHEMA_SQL } from "@/lib/supabase/admin";

export async function POST() {
  const db = getAdminClient();
  const errors: string[] = [];

  // ── 1. Try to create schema via raw SQL ──────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Attempt DDL via multiple Supabase endpoints
  let schemaCreated = false;
  const endpoints = [
    `${supabaseUrl}/rest/v1/rpc/exec_sql`,
    `${supabaseUrl}/pg/query`,
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify(
          endpoint.includes("rpc") ? { sql: SCHEMA_SQL } : { query: SCHEMA_SQL }
        ),
      });
      if (res.ok || res.status === 204) {
        schemaCreated = true;
        break;
      }
    } catch {
      continue;
    }
  }

  // ── 2. Test each table ───────────────────────────────────────────────
  const tables = ["profiles", "trips", "reasoning_cache", "challenge_responses"];
  const missing: string[] = [];
  for (const table of tables) {
    const { error } = await db.from(table).select("*").limit(1);
    if (error?.code === "42P01") missing.push(table);
  }

  if (missing.length > 0) {
    return NextResponse.json({
      ok: false,
      message: `Tables missing: ${missing.join(", ")}. Please run the SQL below in your Supabase SQL Editor.`,
      sqlEditorUrl: `https://supabase.com/dashboard/project/yvmcewikubyuzbpavstz/sql/new`,
      sql: SCHEMA_SQL,
    }, { status: 400 });
  }

  // ── 3. Seed dummy data ───────────────────────────────────────────────
  // Clear old seeds
  await db.from("challenge_responses").delete().in("trip_id", [
    "00000000-0000-0000-0000-000000000001",
    "00000000-0000-0000-0000-000000000002",
    "00000000-0000-0000-0000-000000000003",
  ]);
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

  // Insert trips
  const { error: te } = await db.from("trips").insert([
    {
      id: "00000000-0000-0000-0000-000000000001",
      destination: "Goa, India",
      preferences: { destination: "Goa Beaches", companions: "Couple 🕯️", budget: "Luxury", constraints: ["Direct Flights Only ✈️"], notes: "Anniversary trip." },
      selected_hotel: "Taj Exotica Resort & Spa",
      status: "generated",
      itinerary: {
        destination: "Goa, India",
        hotels: [
          { id: "h1", name: "Taj Exotica Resort & Spa", pricePerNight: 28000, rating: 4.9, walkability: 9, travelTimeMinutes: 40, attributes: ["Luxury","Beachfront","Spa","Pool"] },
          { id: "h2", name: "W Goa – Vagator", pricePerNight: 18000, rating: 4.6, walkability: 8, travelTimeMinutes: 65, attributes: ["Trendy","Nightlife"] },
          { id: "h3", name: "Ahilya by the Sea", pricePerNight: 22000, rating: 4.8, walkability: 6, travelTimeMinutes: 80, attributes: ["Boutique","Romantic"] },
        ],
        itinerary: [
          { day: 1, title: "Arrival & Sunset", activities: [{ time: "14:00", description: "Check in to villa." },{ time: "18:00", description: "Sunset at Benaulim Beach." },{ time: "20:00", description: "Candlelight dinner at Thalassa." }] },
          { day: 2, title: "Heritage & Spa", activities: [{ time: "09:00", description: "Breakfast on terrace." },{ time: "11:00", description: "Basilica of Bom Jesus." },{ time: "15:00", description: "Couples spa session." },{ time: "19:00", description: "Sunset cruise on Mandovi." }] },
          { day: 3, title: "Departure", activities: [{ time: "09:00", description: "Beach yoga." },{ time: "12:00", description: "Brunch at Fisherman's Wharf." },{ time: "15:00", description: "Airport transfer." }] },
        ],
        budget: { flights: 18000, accommodation: 84000, food: 15000, activities: 8000, total: 125000, currency: "INR" },
        packing_list: [{ category: "Beach", items: ["Beachwear","Sunscreen","Sunglasses"] },{ category: "Essentials", items: ["Charger","Medications","Cash"] }],
      },
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      destination: "Manali, Himachal Pradesh",
      preferences: { destination: "Manali Mountains", companions: "Friends 🍻", budget: "Comfort", constraints: ["Off-beat Spots ⛰️"], notes: "Trek group." },
      selected_hotel: "Solang Valley Resort",
      status: "generated",
      itinerary: {
        destination: "Manali, HP",
        hotels: [
          { id: "h1", name: "Solang Valley Resort", pricePerNight: 7500, rating: 4.5, walkability: 7, travelTimeMinutes: 55, attributes: ["Mountain View","Wi-Fi"] },
          { id: "h2", name: "Club Mahindra", pricePerNight: 9000, rating: 4.3, walkability: 5, travelTimeMinutes: 30, attributes: ["Family","Pool"] },
        ],
        itinerary: [
          { day: 1, title: "Arrival & Mall Road", activities: [{ time: "15:00", description: "Check in." },{ time: "18:00", description: "Mall Road walk, try Siddu bread." },{ time: "20:00", description: "Johnson's Café dinner." }] },
          { day: 2, title: "Solang Valley", activities: [{ time: "08:00", description: "Drive to Solang." },{ time: "10:00", description: "Zorbing in snow." },{ time: "14:00", description: "Bonfire lunch." }] },
        ],
        budget: { flights: 12000, accommodation: 22500, food: 9000, activities: 7000, total: 50500, currency: "INR" },
        packing_list: [{ category: "Warm Clothing", items: ["Thermals","Heavy jacket","Gloves"] }],
      },
    },
    {
      id: "00000000-0000-0000-0000-000000000003",
      destination: "Jaipur, Rajasthan",
      preferences: { destination: "Jaipur Pink City", companions: "Family 👨‍👩‍👧‍👦", budget: "Economy", constraints: ["Pure Veg 🥦","Senior-Friendly 🧓"], notes: "Parents are 65+." },
      selected_hotel: "",
      status: "pending",
      itinerary: null,
    },
  ]);
  if (te) errors.push(`trips: ${te.message}`);

  if (errors.length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    schemaCreated,
    message: "✓ Database ready! 3 trips seeded with full itineraries stored directly in the trips table.",
    counts: { trips: 3 },
  });
}

export async function GET() {
  const db = getAdminClient();
  const results: Record<string, any> = {};

  for (const table of ["profiles", "trips", "reasoning_cache", "challenge_responses"]) {
    const { data, error } = await db.from(table).select("*").limit(3);
    results[table] = error
      ? { error: error.message, code: error.code }
      : { count: data?.length, sample: data };
  }

  return NextResponse.json({ ok: true, tables: results });
}
