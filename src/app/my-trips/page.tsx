"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Loader2, MapPin, ArrowRight, Calendar } from "lucide-react";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { FlightyCard, StatusBadge, Navbar } from "@/components/layout/Navbar";
import { SupabaseStatus } from "@/components/flighty/SupabaseStatus";

interface TripRow {
  id: string;
  destination: string;
  status: string;
  selected_hotel: string | null;
  created_at: string;
  preferences: { companions?: string; budget?: string };
}

export default function MyTripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<TripRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setAuthenticated(Boolean(user));

      if (!user) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/trips");
      const data = await res.json();
      setTrips(data.trips ?? []);
      setLoading(false);
    }

    load();
  }, []);

  const openTrip = async (tripId: string) => {
    localStorage.setItem("currentTripId", tripId);
    try {
      const res = await fetch(`/api/trips/${tripId}`);
      if (res.ok) {
        const data = await res.json();
        const { tripId: _t, ...itinerary } = data;
        localStorage.setItem("currentItinerary", JSON.stringify(itinerary));
        router.push("/plan/compare");
      }
    } catch {
      router.push("/plan");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <Navbar>
        <SupabaseStatus compact />
      </Navbar>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Trips</h1>
            <p className="text-zinc-500 mt-1 text-sm">
              Saved to Supabase — pick up where you left off
            </p>
          </div>
          <Link
            href="/plan"
            className="inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
          >
            New Trip <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading && (
          <div className="flex flex-col items-center py-24 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-sky-400 mb-4" />
            Loading your trips…
          </div>
        )}

        {!loading && !isSupabaseConfigured() && (
          <FlightyCard className="p-8 text-center">
            <p className="text-zinc-400">
              Supabase is not configured. Add{" "}
              <code className="text-sky-400">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="text-sky-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
              <code className="text-sky-400">.env.local</code>.
            </p>
          </FlightyCard>
        )}

        {!loading && isSupabaseConfigured() && !authenticated && (
          <FlightyCard className="p-8 text-center">
            <p className="text-zinc-400 mb-4">Sign in to see trips saved to your account.</p>
            <Link
              href="/login"
              className="inline-flex items-center bg-sky-500 hover:bg-sky-400 text-white rounded-full px-6 py-3 text-sm font-semibold"
            >
              Sign In
            </Link>
          </FlightyCard>
        )}

        {!loading && authenticated && trips.length === 0 && (
          <FlightyCard className="p-8 text-center">
            <MapPin className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">No trips yet. Plan your first Indian getaway!</p>
            <Link
              href="/plan"
              className="inline-flex items-center mt-4 text-sky-400 font-semibold text-sm hover:text-sky-300"
            >
              Start planning →
            </Link>
          </FlightyCard>
        )}

        {!loading && trips.length > 0 && (
          <div className="space-y-3">
            {trips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => openTrip(trip.id)}
                className="w-full text-left cursor-pointer group"
              >
                <FlightyCard className="p-5 hover:border-sky-500/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                        {trip.destination}
                      </h3>
                      {trip.selected_hotel && (
                        <p className="text-sm text-zinc-500 mt-0.5">{trip.selected_hotel}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-zinc-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(trip.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {trip.preferences?.budget && (
                          <span className="truncate max-w-[200px]">{trip.preferences.budget}</span>
                        )}
                      </div>
                    </div>
                    <StatusBadge variant={trip.status === "generated" ? "success" : "neutral"}>
                      {trip.status}
                    </StatusBadge>
                  </div>
                </FlightyCard>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
