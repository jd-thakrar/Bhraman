-- ============================================================
-- Bhraman — Complete Supabase Schema
-- Run this ENTIRE script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yvmcewikubyuzbpavstz/sql/new
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (role-based access)
CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid PRIMARY KEY,
  email      text NOT NULL,
  role       text NOT NULL DEFAULT 'customer'
             CHECK (role IN ('customer', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Trips (stores full itinerary JSON for persistence)
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

-- 3. Reasoning cache (optional, for multi-stage AI pipelines)
CREATE TABLE IF NOT EXISTS public.reasoning_cache (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id    uuid NOT NULL,
  stage_name text NOT NULL,
  result     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Challenge responses (AI hotel re-evaluations)
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

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reasoning_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_responses ENABLE ROW LEVEL SECURITY;

-- Open policies (service_role key bypasses these anyway)
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
    CREATE POLICY open_trips_all ON public.trips FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'open_cache_all') THEN
    CREATE POLICY open_cache_all ON public.reasoning_cache FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'open_challenges_all') THEN
    CREATE POLICY open_challenges_all ON public.challenge_responses FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
