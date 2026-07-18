# ✈️ Bhraman — AI Travel Planner for India

[![Next.js](https://img.shields.io/badge/Next.js-16-blue?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat&logo=supabase)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Pro-orange?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)

**Bhraman** is a premium, high-performance Next.js application that plans tailored Indian getaways. It features real-time cost calculation, confidence-scored hotel selections, and a conversational Live AI Co-pilot to make instant modifications to your itinerary. 

The user experience is inspired by **Flighty** — featuring a dark, premium, status-driven interface built for speed and responsiveness.

---

## 🔑 Demo Login Credentials

You can log in to test both the Customer workspace and the Administrator control dashboard using these pre-configured credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **👤 Customer** | `jd.thakrar05@gmail.com` | `123456` | Plan trips, chat with Co-pilot, save itineraries |
| **🔑 Admin** | `chiragthakrardk@gmail.com` | `123456` | View all users' trips, trace AI confidence scores, trigger seeds |

---

## 🌟 Key Features & Animations

- **⚡ Fast-Track 4-Step Intake**: Select destination, companions, custom duration (days), custom budget (in INR), and region-specific constraints (e.g., pure vegetarian, elderly-friendly, child-friendly).
- **🌀 Radar Processing Engine**: Shows an interactive radar sweep animation with live state updates (e.g. *"Goal Extraction"*, *"Constraint Filtering"*, *"Weighted Hotel Evaluation"*) while the Gemini AI compiles the itinerary.
- **💬 Live AI Co-pilot**: Dynamic chat interface that lets you ask questions (e.g., "My flight is late", "Make Day 2 simpler", "Add a spa session") to update and recalculate your travel plan instantly.
- **📍 Interactive Map & Budget**: Renders exact latitude/longitude markers on a map for hotels and sightseeing spots, paired with an interactive cost calculator for flights, stays, dining, and custom expenses.
- **🛡️ Contestable AI Stays**: Exposes the AI's internal reasoning score (e.g. 87/100). Click *"Why not this stay?"* to challenge the AI, input your constraints, and trigger automated re-scoring.
- **📱 Native Mobile Responsiveness**: Stacks into a clean single-column view on mobile screens with a native tab-style switcher to toggle between the **Itinerary Board** and **Live Co-pilot Chat**.
- **💾 Supabase Persistence**: Secure user login, persistent trip saving, and reasoning cache logging.

---

## 🚀 Quick Start

1. **Clone and Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_KEY=your-supabase-service-role-key
   GEMINI_API_KEY=your-google-gemini-key
   DEMO_MODE=false
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🗄️ Database Setup (Supabase)

To initialize your database tables and enable saving trips, run the following SQL script in your **Supabase SQL Editor**:

```sql
-- 1. Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text NOT NULL,
  role       text NOT NULL DEFAULT 'customer',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Create Trips table
CREATE TABLE IF NOT EXISTS public.trips (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  user_id        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  destination    text,
  preferences    jsonb NOT NULL DEFAULT '{}'::jsonb,
  selected_hotel text,
  itinerary      jsonb,
  status         text NOT NULL DEFAULT 'pending'
);

-- 4. Create Reasoning Cache table
CREATE TABLE IF NOT EXISTS public.reasoning_cache (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id    uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  stage_name text NOT NULL,
  result     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Create Challenge Responses table
CREATE TABLE IF NOT EXISTS public.challenge_responses (
  id                       uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id                  uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  challenged_hotel_id      text NOT NULL,
  user_constraint          text,
  recalculated_confidence  integer,
  score_breakdown          jsonb NOT NULL DEFAULT '{}'::jsonb,
  delta_summary            text,
  still_recommend_selected boolean DEFAULT true,
  created_at               timestamptz NOT NULL DEFAULT now()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reasoning_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_responses ENABLE ROW LEVEL SECURITY;

-- 7. Create open policies for client/service interaction
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

-- 8. Refresh Supabase REST Cache
NOTIFY pgrst, 'reload schema';
```

---

## 🛠️ Tech Stack & Tools Used

- **Framework**: Next.js 16 (App Router) with Turbopack compilation
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion (for physics-based smooth UI transitions)
- **Icons**: Lucide React
- **Database & Auth**: Supabase Database, Supabase Auth
- **AI Model**: Google Gemini API (Gemini 2.5 Pro / Flash models) for structured JSON itinerary outputs

---

## 📂 Project Structure

```
travel-engine/
├── src/
│   ├── app/                # Pages, layouts, and API routing
│   │   ├── admin/          # Administrator control dashboard
│   │   ├── api/            # Serverless functions (generate, setup, trips)
│   │   ├── login/          # Auth login and registration screen
│   │   └── plan/           # Main workspace split-screen planner
│   ├── components/         # Reusable UI component blocks
│   ├── lib/                # Database clients & AI generation engines
│   └── types/              # Type Definitions for trips and stays
├── schema.sql              # Database schema blueprint
└── package.json            # Scripts & dependencies manifest
```

---

*Designed and developed for Prompt Wars 2026 🏆*
