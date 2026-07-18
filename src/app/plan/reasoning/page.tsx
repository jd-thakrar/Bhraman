"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plane } from "lucide-react";
import Link from "next/link";
import { GOA_MOCK_DATA } from "@/data/mockData";

const STAGES = [
  "Understanding your travel goals...",
  "Extracting constraints & preferences...",
  "Analyzing 120+ Indian destinations...",
  "Comparing top hotel options...",
  "Optimizing daily routes & itineraries...",
  "Estimating budget requirements in ₹...",
  "Generating smart packing checklist...",
  "Calibrating score matrices...",
];

export default function ReasoningPipelinePage() {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(0);
  const dataLoadedRef = useRef(false);
  const tripIdRef = useRef<string | null>(null);

  useEffect(() => {
    const startGeneration = async () => {
      try {
        const storedPrefs = localStorage.getItem("tripPreferences");
        const preferences = storedPrefs
          ? JSON.parse(storedPrefs)
          : {
              destination: "Goa Beach Escapade",
              companions: "Couple / Romantic Getaway",
              budget: "Comfort (₹15,000 - ₹50,000 per person)",
              constraints: [],
              specialInstructions: "",
            };

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preferences),
        });

        if (!res.ok) {
          throw new Error("API error — using fallback data.");
        }

        const data = await res.json();
        if (data.tripId) {
          tripIdRef.current = data.tripId;
          localStorage.setItem("currentTripId", data.tripId);
        }
        // Remove tripId before storing as itinerary
        const { tripId: _t, ...itinerary } = data;
        localStorage.setItem("currentItinerary", JSON.stringify(itinerary));
        dataLoadedRef.current = true;
      } catch (err) {
        console.error("Generation failed, using mock data:", err);
        localStorage.setItem("currentItinerary", JSON.stringify(GOA_MOCK_DATA));
        dataLoadedRef.current = true;
      }
    };

    startGeneration();
  }, []);

  useEffect(() => {
    if (currentStage < STAGES.length - 1) {
      const timer = setTimeout(() => setCurrentStage((p) => p + 1), 1100);
      return () => clearTimeout(timer);
    } else {
      const interval = setInterval(() => {
        if (dataLoadedRef.current) {
          clearInterval(interval);
          router.push("/plan/compare");
        }
      }, 400);
      return () => clearInterval(interval);
    }
  }, [currentStage, router]);

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-indigo-100">
      <div className="flex items-center px-6 py-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 text-slate-900 font-bold text-lg tracking-tight">
          <Plane className="w-5 h-5 text-indigo-600 -rotate-45" />
          TripMind
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center max-w-md w-full">
          {/* Pulsing Rings */}
          <div className="relative w-28 h-28 mb-12">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-indigo-100"
              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-indigo-200"
              animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                <Plane className="w-8 h-8 text-white -rotate-45" />
              </motion.div>
            </div>
          </div>

          {/* Stage Label */}
          <div className="h-16 flex items-center justify-center text-center w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-xl text-slate-700 font-bold tracking-tight"
              >
                {STAGES[currentStage]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <div className="w-full mt-10 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200/50">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStage + 1) / STAGES.length) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>

          <div className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            {currentStage === STAGES.length - 1 && !dataLoadedRef.current ? (
              <span className="text-indigo-600 animate-pulse">Running Gemini reasoning engine...</span>
            ) : (
              `Stage ${currentStage + 1} of ${STAGES.length}`
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
