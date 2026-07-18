-- ============================================================
-- TripMind — Supabase Schema
-- Run this entire script in your Supabase SQL Editor.
-- Dashboard: https://yvmcewikubyuzbpavstz.supabase.co
-- ============================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. trips table
-- Stores each user's trip session and preferences.
create table if not exists public.trips (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),
  user_id         uuid references auth.users(id) on delete set null,
  destination     text,
  preferences     jsonb not null default '{}'::jsonb,
  selected_hotel  text,
  status          text not null default 'pending'
                  check (status in ('pending', 'generated', 'failed'))
);

-- 3. reasoning_cache table
-- Caches the full Gemini output so refreshing the page doesn't re-run the AI pipeline.
create table if not exists public.reasoning_cache (
  id          uuid primary key default uuid_generate_v4(),
  trip_id     uuid references public.trips(id) on delete cascade not null,
  stage_name  text not null,
  result      jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- 4. challenge_responses table
-- Stores Contestable AI re-evaluation results for demo replay stability.
create table if not exists public.challenge_responses (
  id                      uuid primary key default uuid_generate_v4(),
  trip_id                 uuid references public.trips(id) on delete cascade not null,
  challenged_hotel_id     text not null,
  user_constraint         text,
  recalculated_confidence integer,
  score_breakdown         jsonb not null default '{}'::jsonb,
  delta_summary           text,
  still_recommend_selected boolean default true,
  created_at              timestamptz not null default now()
);

-- 5. Row-Level Security (RLS)
alter table public.trips enable row level security;
alter table public.reasoning_cache enable row level security;
alter table public.challenge_responses enable row level security;

-- Allow anyone to insert/select trips (anonymous session support)
create policy "Allow anon insert on trips" on public.trips
  for insert with check (true);

create policy "Allow anon select on trips" on public.trips
  for select using (true);

create policy "Allow anon update on trips" on public.trips
  for update using (true);

-- Allow anyone to insert/select reasoning_cache
create policy "Allow anon insert on reasoning_cache" on public.reasoning_cache
  for insert with check (true);

create policy "Allow anon select on reasoning_cache" on public.reasoning_cache
  for select using (true);

-- Allow anyone to insert/select challenge_responses
create policy "Allow anon insert on challenge_responses" on public.challenge_responses
  for insert with check (true);

create policy "Allow anon select on challenge_responses" on public.challenge_responses
  for select using (true);
