-- ============================================================
-- Bhraman — Dynamic Supabase Schema with Roles
-- Run this entire script in your Supabase SQL Editor.
-- ============================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Profiles table with roles
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  role        text not null check (role in ('customer', 'admin')) default 'customer',
  created_at  timestamptz not null default now()
);

-- 3. trips table
create table if not exists public.trips (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),
  user_id         uuid references auth.users(id) on delete set null,
  destination     text,
  preferences     jsonb not null default '{}'::jsonb,
  selected_hotel  text,
  status          text not null default 'pending'
                  check (status in ('pending', 'generating', 'generated', 'failed'))
);

-- 4. reasoning_cache table
create table if not exists public.reasoning_cache (
  id          uuid primary key default uuid_generate_v4(),
  trip_id     uuid references public.trips(id) on delete cascade not null,
  stage_name  text not null,
  result      jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- 5. challenge_responses table
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

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.reasoning_cache enable row level security;
alter table public.challenge_responses enable row level security;

-- Policies for profiles
create policy "Allow public read profiles" on public.profiles for select using (true);
create policy "Allow user update profiles" on public.profiles for update using (auth.uid() = id);
create policy "Allow service insertion" on public.profiles for insert with check (true);

-- Policies for trips
create policy "Allow anon insert on trips" on public.trips for insert with check (true);
create policy "Allow anon select on trips" on public.trips for select using (true);
create policy "Allow anon update on trips" on public.trips for update using (true);
create policy "Allow admin delete trips" on public.trips for delete using (true);

-- Policies for reasoning_cache
create policy "Allow anon insert on reasoning_cache" on public.reasoning_cache for insert with check (true);
create policy "Allow anon select on reasoning_cache" on public.reasoning_cache for select using (true);

-- Policies for challenge_responses
create policy "Allow anon insert on challenge_responses" on public.challenge_responses for insert with check (true);
create policy "Allow anon select on challenge_responses" on public.challenge_responses for select using (true);
