import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

let _admin: SupabaseClient | null = null;

/** Service-role admin client — bypasses RLS, used server-side only. */
export function getAdminClient(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _admin;
}

// ─── Auto-bootstrap: create all tables if they don't exist ────────────
let _bootstrapped = false;

export async function ensureSchema() {
  if (_bootstrapped) return;

  const db = getAdminClient();

  // Quick probe — if trips table exists we're good
  const { error } = await db.from("trips").select("id").limit(1);
  if (!error) {
    _bootstrapped = true;
    return;
  }

  // Tables don't exist (42P01 = undefined_table) — create them via raw SQL
  if (error.code === "42P01" || error.code === "PGRST204") {
    const sql = SCHEMA_SQL;
    // Use the Supabase REST SQL endpoint with service key
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({}),
    });

    // If rpc doesn't work, try the /sql endpoint (management API)
    // Fallback: use individual table creation queries via PostgREST
    // Since we can't run DDL via PostgRES, we'll create tables via the admin client
    // by inserting into them (they auto-create in some Supabase setups)

    // Best approach: run DDL via the pg-meta endpoint
    try {
      await fetch(`${supabaseUrl}/pg/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({ query: sql }),
      });
    } catch {
      console.warn(
        "Auto-schema creation failed. Tables must be created manually via SQL Editor."
      );
    }
  }

  _bootstrapped = true;
}

const SCHEMA_SQL = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid PRIMARY KEY,
  email      text NOT NULL,
  role       text NOT NULL DEFAULT 'customer',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trips (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  user_id        uuid,
  destination    text,
  preferences    jsonb NOT NULL DEFAULT '{}'::jsonb,
  selected_hotel text,
  itinerary      jsonb,
  status         text NOT NULL DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS public.reasoning_cache (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id    uuid NOT NULL,
  stage_name text NOT NULL,
  result     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.challenge_responses (
  id                       uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id                  uuid NOT NULL,
  challenged_hotel_id      text NOT NULL,
  user_constraint          text,
  recalculated_confidence  integer,
  score_breakdown          jsonb NOT NULL DEFAULT '{}'::jsonb,
  delta_summary            text,
  still_recommend_selected boolean DEFAULT true,
  created_at               timestamptz NOT NULL DEFAULT now()
);

-- Open RLS policies so service key + anon can operate
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reasoning_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_responses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'open_profiles_select') THEN
    CREATE POLICY open_profiles_select ON public.profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'open_profiles_insert') THEN
    CREATE POLICY open_profiles_insert ON public.profiles FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'open_profiles_update') THEN
    CREATE POLICY open_profiles_update ON public.profiles FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'open_trips_all') THEN
    CREATE POLICY open_trips_all ON public.trips USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'open_cache_all') THEN
    CREATE POLICY open_cache_all ON public.reasoning_cache USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'open_challenges_all') THEN
    CREATE POLICY open_challenges_all ON public.challenge_responses USING (true) WITH CHECK (true);
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';

`;

export { SCHEMA_SQL };
