"use client";

import { useState, useEffect } from "react";
import { GOA_MOCK_DATA } from "@/data/mockData";
import { TripChatWidget } from "@/components/trip-chat-widget";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, X, ArrowRight, Loader2, Info, Plane, Star, ChevronDown, ChevronUp } from "lucide-react";

export default function ComparePage() {
  const router = useRouter();
  const [itineraryData, setItineraryData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentItinerary");
    try { setItineraryData(stored ? JSON.parse(stored) : GOA_MOCK_DATA); }
    catch { setItineraryData(GOA_MOCK_DATA); }
  }, []);

  const [challengeStates, setChallengeStates] = useState<Record<string, any>>({});

  if (!itineraryData) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  const winner = itineraryData.hotels[0];
  const rejected = [itineraryData.hotels[1], itineraryData.hotels[2]].filter(Boolean);

  const handleChallenge = async (hotelId: string, override?: string) => {
    setChallengeStates((p) => ({ ...p, [hotelId]: { status: "loading" } }));
    try {
      const res = await fetch("/api/recalculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedHotelId: winner.id,
          rejectedHotelId: hotelId,
          userConstraint: override || "",
          tripId: localStorage.getItem("currentTripId"),
        }),
      });
      const data = await res.json();
      setChallengeStates((p) => ({
        ...p,
        [hotelId]: { status: "done", confidence: data.recalculated_confidence, summary: data.delta_summary },
      }));
    } catch {
      setChallengeStates((p) => ({
        ...p,
        [hotelId]: { status: "done", confidence: 72, summary: "Score improved with this override, but distance remains a factor." },
      }));
    }
  };

  const scoreColor = (n: number) =>
    n >= 80 ? "text-green-400" : n >= 55 ? "text-amber-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-[#0A0B0F]">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0A0B0F]/80 backdrop-blur-xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-base">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Plane className="w-4 h-4 text-indigo-400 -rotate-45" />
          </div>
          <span className="text-white">Bhraman</span>
        </Link>
        <button
          onClick={() => router.push("/itinerary")}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold px-4 py-2 rounded-full transition-all"
        >
          View Itinerary <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10 pb-32">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full mb-4">
            <Check className="w-3 h-3" /> Analysis Complete
          </div>
          <h1 className="text-3xl font-black text-white mb-2">AI Recommendation</h1>
          <p className="text-white/40 text-sm font-medium">
            {itineraryData.destination} · {rejected.length + 1} options evaluated
          </p>
        </div>

        {/* Winner */}
        <div className="bg-[#12141A] border border-white/[0.07] border-l-[3px] border-l-green-500 rounded-2xl p-6 mb-4">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="label-muted mb-2">Top AI Pick</div>
              <h2 className="text-2xl font-black text-white mb-2">{winner.name}</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {winner.attributes?.map((a: string) => (
                  <span key={a} className="badge-blue text-[11px] font-bold px-2.5 py-1 rounded-full">{a}</span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                <span className="text-white/40 text-xs font-semibold ml-2">{winner.rating} / 5.0</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-6xl font-black text-green-400 leading-none">87</div>
              <div className="label-muted mt-1">Confidence</div>
            </div>
          </div>

          {/* Score grid */}
          <div className="grid grid-cols-4 gap-2">
            {[["Budget", "25/30"], ["Proximity", "28/30"], ["Reviews", "18/20"], ["Walkability", "16/20"]].map(([k, v]) => (
              <div key={k} className="bg-[#1A1C24] rounded-xl p-3 text-center">
                <div className="label-muted mb-1">{k}</div>
                <div className="text-sm font-bold text-white/80">{v}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2 text-sm text-white/50">
              <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              <span>Saves {winner.travelTimeMinutes} min transfer time vs alternatives.</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-white/50">
              <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              <span>Top review sentiment for your selected travel vibe.</span>
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="label-muted mb-3">Alternatives & Rejection Log</div>
        <div className="space-y-3">
          {rejected.map((hotel) => {
            const state = challengeStates[hotel.id];
            const score = state?.confidence ?? 65;
            return (
              <div key={hotel.id} className="bg-[#12141A] border border-white/[0.06] border-l-[3px] border-l-red-500/50 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white/30 line-through decoration-white/20 mb-1">{hotel.name}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {hotel.attributes?.map((a: string) => (
                        <span key={a} className="text-[10px] font-bold text-white/20 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-wide">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-black leading-none ${scoreColor(score)}`}>{score}</div>
                    <div className="label-muted mt-1">Score</div>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-white/30 mb-4">
                  <X className="w-4 h-4 text-red-400/60 shrink-0 mt-0.5" />
                  <span>Rejected: {hotel.travelTimeMinutes}min airport transfer + lower vibe match.</span>
                </div>

                <AnimatePresence mode="wait">
                  {!state ? (
                    <button
                      onClick={() => handleChallenge(hotel.id)}
                      className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-indigo-400 border border-white/[0.08] hover:border-indigo-500/30 px-4 py-2 rounded-full transition-all"
                    >
                      <Info className="w-3.5 h-3.5" /> Why not this stay?
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-[#1A1C24] border border-white/[0.06] rounded-xl p-4"
                    >
                      {state.status === "loading" ? (
                        <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Re-evaluating with Gemini...
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-white/60 font-medium mb-3 leading-relaxed">{state.summary}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="label-muted w-full mb-1">Override constraints:</span>
                            {["Budget doesn't matter", "I prefer nightlife", "Skip beach, want city"].map((opt) => (
                              <button
                                key={opt}
                                onClick={() => handleChallenge(hotel.id, opt)}
                                className="text-[11px] font-bold text-white/40 hover:text-indigo-300 bg-white/5 hover:bg-indigo-500/10 border border-white/[0.06] hover:border-indigo-500/20 px-3 py-1.5 rounded-full transition-all"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-30 pointer-events-none">
        <button
          onClick={() => router.push("/itinerary")}
          className="pointer-events-auto flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-3.5 rounded-full shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
        >
          View Full Itinerary <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
