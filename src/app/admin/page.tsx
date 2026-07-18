"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { Plane, Users, MapPin, MessageSquare, TrendingUp, RefreshCw, Loader2, Check, X, Clock } from "lucide-react";

interface Trip { id: string; created_at: string; destination: string; preferences: any; selected_hotel: string; status: string; }
interface Challenge { id: string; created_at: string; challenged_hotel_id: string; user_constraint: string; recalculated_confidence: number; delta_summary: string; }

export default function AdminPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"trips" | "challenges">("trips");

  const loadData = async () => {
    setLoading(true);
    const [{ data: t }, { data: c }] = await Promise.all([
      supabase.from("trips").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("challenge_responses").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    setTrips(t || []);
    setChallenges(c || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const statusColor = (s: string) =>
    s === "generated" ? "badge-green" : s === "failed" ? "badge-red" : "badge-amber";

  const fmt = (d: string) => new Date(d).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" });

  return (
    <div className="min-h-screen bg-[#0A0B0F]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0A0B0F]/80 backdrop-blur-xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-base">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Plane className="w-4 h-4 text-indigo-400 -rotate-45" />
          </div>
          <span className="text-white">Bhraman</span>
          <span className="text-white/30 font-normal">/ Admin</span>
        </Link>
        <button
          onClick={loadData}
          className="flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white border border-white/[0.08] hover:border-white/20 px-3 py-1.5 rounded-full transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Users, label: "Total Trips", value: trips.length, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
            { icon: Check, label: "Generated", value: trips.filter(t => t.status === "generated").length, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
            { icon: MessageSquare, label: "AI Challenges", value: challenges.length, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            { icon: Clock, label: "Pending", value: trips.filter(t => t.status === "pending").length, color: "text-white/40", bg: "bg-white/5 border-white/10" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-[#12141A] border border-white/[0.07] rounded-2xl p-5">
              <div className={`w-9 h-9 rounded-xl border ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="text-3xl font-black text-white mb-1">{value}</div>
              <div className="label-muted">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#12141A] border border-white/[0.06] rounded-xl p-1 w-fit">
          {(["trips", "challenges"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                tab === t ? "bg-indigo-500 text-white" : "text-white/40 hover:text-white"
              }`}
            >
              {t === "trips" ? `Trips (${trips.length})` : `AI Challenges (${challenges.length})`}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 text-white/30 text-sm font-medium py-8">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading from Supabase...
          </div>
        )}

        {/* Trips Table */}
        {!loading && tab === "trips" && (
          <div className="bg-[#12141A] border border-white/[0.07] rounded-2xl overflow-hidden">
            {trips.length === 0 ? (
              <div className="py-16 text-center">
                <MapPin className="w-8 h-8 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm font-medium">No trips yet. Generate one from the app!</p>
                <Link href="/plan" className="inline-flex items-center gap-2 bg-indigo-500 text-white text-sm font-bold px-4 py-2 rounded-full mt-4 hover:bg-indigo-400 transition-all">
                  Generate a Trip
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Destination", "Hotel", "Vibe", "Budget", "Status", "Created"].map((h) => (
                        <th key={h} className="label-muted text-left px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((trip, i) => (
                      <tr key={trip.id} className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i === trips.length - 1 ? "border-b-0" : ""}`}>
                        <td className="px-5 py-4 text-sm font-bold text-white">{trip.destination || trip.preferences?.destination || "—"}</td>
                        <td className="px-5 py-4 text-sm text-white/50 font-medium">{trip.selected_hotel || "—"}</td>
                        <td className="px-5 py-4 text-sm text-white/40">{trip.preferences?.vibe || trip.preferences?.companions || "—"}</td>
                        <td className="px-5 py-4 text-sm text-white/50">{trip.preferences?.budget?.split("(")[0]?.trim() || "—"}</td>
                        <td className="px-5 py-4">
                          <span className={`${statusColor(trip.status)} text-[11px] font-bold px-2.5 py-1 rounded-full capitalize`}>
                            {trip.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-white/30 font-mono">{fmt(trip.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Challenges Table */}
        {!loading && tab === "challenges" && (
          <div className="bg-[#12141A] border border-white/[0.07] rounded-2xl overflow-hidden">
            {challenges.length === 0 ? (
              <div className="py-16 text-center">
                <MessageSquare className="w-8 h-8 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm font-medium">No AI challenges yet. Click "Why not this stay?" in the compare view.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Hotel Challenged", "User Constraint", "New Score", "AI Summary", "Time"].map((h) => (
                        <th key={h} className="label-muted text-left px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {challenges.map((c, i) => (
                      <tr key={c.id} className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i === challenges.length - 1 ? "border-b-0" : ""}`}>
                        <td className="px-5 py-4 text-sm font-bold text-white/60">{c.challenged_hotel_id}</td>
                        <td className="px-5 py-4 text-sm text-white/50 max-w-[180px] truncate">{c.user_constraint || "Default challenge"}</td>
                        <td className="px-5 py-4">
                          <span className={`text-lg font-black ${
                            c.recalculated_confidence >= 80 ? "text-green-400" :
                            c.recalculated_confidence >= 55 ? "text-amber-400" : "text-red-400"
                          }`}>{c.recalculated_confidence}</span>
                        </td>
                        <td className="px-5 py-4 text-xs text-white/30 max-w-[240px] truncate">{c.delta_summary}</td>
                        <td className="px-5 py-4 text-xs text-white/30 font-mono">{fmt(c.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
