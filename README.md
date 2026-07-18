# TripMind — AI Travel Planner for India

TripMind is a Next.js app that plans Indian getaways with AI-powered hotel scoring, INR budgets, and contestable recommendations. UI inspired by [Flighty](https://flighty.com/) — dark, premium, status-driven.

## Features

- **4-step trip wizard** — destination, companions, budget (INR), Indian constraints (Jain/veg, elderly-friendly, etc.)
- **AI itinerary generation** — Gemini 2.5 Flash with rich fallback mock data
- **Hotel comparison** — confidence scores, challenge AI to recalculate
- **Full itinerary** — day-by-day plan, ₹ budget breakdown, packing list
- **Supabase persistence** — trips, reasoning cache, challenge responses

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | For DB | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For DB | Supabase anon key |
| `SUPABASE_SECRET_KEY` | For DB writes | Service role key (server-side) |
| `GEMINI_API_KEY` | Optional | Google Gemini API key |
| `DEMO_MODE` | Optional | Set `true` to use pre-built Indian mock data (no AI calls) |

**Demo mode works out of the box** — set `DEMO_MODE=true` and skip Gemini. The app includes full mock data for Goa, Manali, Udaipur, and Kerala.

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `schema.sql` in the SQL Editor
3. (Optional) Run `seed.sql` for sample trips
4. Copy URL and keys to `.env.local`

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables from `.env.example`
4. Deploy — no extra config needed

Recommended production env:

```
DEMO_MODE=true
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SECRET_KEY=...
```

Add `GEMINI_API_KEY` only if you want live AI generation.

## Demo Flow

1. Landing → **Start Planning**
2. Pick **Kerala Backwaters Cruise** + **Couple** + **Comfort** + **Pure Vegetarian**
3. Watch the 8-stage reasoning animation
4. Compare hotels → **Challenge** an alternative
5. View full itinerary with ₹ budget and packing list

## Tech Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4 · shadcn/ui · Framer Motion
- Supabase · Google Gemini AI

## Project Structure

```
src/
├── app/              # Pages & API routes
├── components/       # UI components
├── data/mockData.ts  # Indian destination dummy data
├── lib/              # Supabase & AI helpers
└── types/trip.ts     # Shared TypeScript types
```

Built for Prompt Wars 2026 🇮🇳
