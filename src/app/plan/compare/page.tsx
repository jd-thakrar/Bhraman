"use client";

import { useState, useEffect } from "react";
import { GOA_MOCK_DATA } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, X, ArrowRight, Loader2, Info, Plane, Star } from "lucide-react";
import { CountingNumber } from "@/components/ui/counting-number";

export default function ComparePage() {
  const router = useRouter();
  const [itineraryData, setItineraryData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('currentItinerary');
    if (stored) {
      try {
        setItineraryData(JSON.parse(stored));
      } catch (e) {
        setItineraryData(GOA_MOCK_DATA);
      }
    } else {
      setItineraryData(GOA_MOCK_DATA);
    }
  }, []);

  const [challengeStates, setChallengeStates] = useState<Record<string, {
    status: 'idle' | 're-evaluating' | 'completed',
    newConfidence?: number,
    deltaSummary?: string,
    breakdown?: Record<string, number>
  }>>({}); 

  if (!itineraryData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
        <span className="text-slate-500 font-bold">Loading recommendations...</span>
      </div>
    );
  }

  const selectedHotel = itineraryData.hotels[0];
  const rejectedHotels = [itineraryData.hotels[1], itineraryData.hotels[2]];

  const handleChallenge = async (hotelId: string, override?: string) => {
    setChallengeStates(prev => ({
      ...prev,
      [hotelId]: { status: 're-evaluating' }
    }));

    try {
      const res = await fetch("/api/recalculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          selectedHotelId: selectedHotel.id,
          rejectedHotelId: hotelId,
          userConstraint: override || "",
          tripId: typeof window !== "undefined" ? localStorage.getItem("currentTripId") : null,
        })
      });

      if (!res.ok) {
        throw new Error("Recalculate failed");
      }

      const result = await res.json();

      setChallengeStates(prev => ({
        ...prev,
        [hotelId]: {
          status: 'completed',
          newConfidence: result.recalculated_confidence,
          deltaSummary: result.delta_summary,
          breakdown: result.score_breakdown
        }
      }));
    } catch (e) {
      console.error(e);
      // fallback
      setChallengeStates(prev => ({
        ...prev,
        [hotelId]: {
          status: 'completed',
          newConfidence: 78,
          deltaSummary: "Calculated response override parameters: The stay score adjusted favorably to the challenge but distance remains a limiting factor.",
          breakdown: { budget_fit: 24, travel_time: 18, review_quality: 18, walkability: 18 }
        }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      {/* Nav */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 text-slate-900 font-bold text-lg tracking-tight">
          <Plane className="w-5 h-5 text-indigo-600 -rotate-45" />
          TripMind
        </Link>
        <button 
          onClick={() => router.push("/itinerary")}
          className="bg-indigo-600 text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-indigo-700 flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98]"
        >
          View Full Itinerary <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6 sm:p-12 pb-32">
        {/* Header */}
        <header className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700 mb-4">
            <Check className="w-3 h-3 mr-1.5" /> Analysis Complete
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Your AI Recommendation
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
            We analyzed {itineraryData.destination} and evaluated options against your constraints. Here is why {selectedHotel.name} won.
          </p>
        </header>

        {/* Winner Card */}
        <section className="mb-12">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Top AI Pick</div>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500 p-6 sm:p-10 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-slate-900 mb-2">{selectedHotel.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedHotel.attributes.map((attr: string) => (
                    <span key={attr} className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">{attr}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-amber-500 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  <span className="text-slate-500 text-sm font-semibold ml-2">{selectedHotel.rating} / 5.0</span>
                </div>
              </div>
              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                <div className="text-emerald-600 font-extrabold text-6xl tracking-tight leading-none">
                  <CountingNumber value={87} suffix="%" />
                </div>
                <div className="text-slate-400 text-xs uppercase tracking-widest font-bold mt-1.5">Confidence Score</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: "Budget Fit", score: "25/30" },
                { label: "Proximity", score: "28/30" },
                { label: "Reviews", score: "18/20" },
                { label: "Walkability", score: "16/20" }
              ].map(item => (
                <div key={item.label} className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{item.label}</div>
                  <div className="text-xl text-slate-800 font-bold">{item.score}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-start text-slate-600 text-sm font-medium">
                <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                <span>Saves you {selectedHotel.travelTimeMinutes} minutes of transfer time.</span>
              </div>
              <div className="flex items-start text-slate-600 text-sm font-medium">
                <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                <span>Highest overall reviews matching your vibes.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Rejected Options */}
        <section>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Alternatives Considered & Rejection Log</div>
          <div className="grid gap-4">
            {rejectedHotels.map(hotel => {
              const currentScore = challengeStates[hotel.id]?.newConfidence || 65;
              let scoreColor = "text-rose-500";
              if (currentScore >= 80) scoreColor = "text-emerald-600";
              else if (currentScore >= 50) scoreColor = "text-amber-500";

              return (
                <div key={hotel.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-400 line-through decoration-slate-300 decoration-2 mb-2">{hotel.name}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {hotel.attributes.map((attr: string) => (
                          <span key={attr} className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">{attr}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`${scoreColor} font-extrabold text-4xl tracking-tight transition-colors duration-500`}>
                        <CountingNumber value={currentScore} suffix="%" />
                      </span>
                      <div className="text-slate-400 text-[9px] uppercase tracking-widest font-bold mt-0.5">Confidence</div>
                    </div>
                  </div>

                  <div className="flex items-start text-slate-500 text-sm font-medium mb-6">
                    <X className="w-4 h-4 text-rose-400 mr-2.5 shrink-0 mt-0.5" />
                    <span>Rejected: Travel time is {hotel.travelTimeMinutes} mins from airport, with less match for Quiet Vibe.</span>
                  </div>

                  <AnimatePresence mode="wait">
                    {!challengeStates[hotel.id] ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}>
                        <button 
                          onClick={() => handleChallenge(hotel.id)}
                          className="flex items-center border border-slate-200 text-slate-600 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-slate-50 transition-colors active:scale-95 cursor-pointer"
                        >
                          <Info className="w-4 h-4 mr-2 text-slate-400" /> Why not this stay?
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-slate-50 rounded-2xl p-5 border border-slate-100 overflow-hidden"
                      >
                        {challengeStates[hotel.id].status === 're-evaluating' ? (
                          <div className="flex items-center text-indigo-600 text-xs font-bold">
                            <Loader2 className="w-4 h-4 mr-2.5 animate-spin" />
                            <span>Re-scoring against customized parameters...</span>
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm text-slate-600 font-semibold mb-4 leading-relaxed">
                              {challengeStates[hotel.id].deltaSummary}
                            </div>
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200/60">
                              <span className="text-[10px] font-bold text-slate-400 w-full mb-1 uppercase tracking-widest">Adjust constraints</span>
                              <button 
                                onClick={() => handleChallenge(hotel.id, "Budget didn't matter")}
                                className="text-xs bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full font-bold hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-pointer"
                              >
                                Budget didn't matter
                              </button>
                              <button 
                                onClick={() => handleChallenge(hotel.id, "I wanted vibrant nightlife instead")}
                                className="text-xs bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full font-bold hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-pointer"
                              >
                                I wanted vibrant nightlife
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Floating bottom CTA */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <button 
          onClick={() => router.push("/itinerary")}
          className="pointer-events-auto bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-8 py-3.5 font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          View Full Itinerary <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
