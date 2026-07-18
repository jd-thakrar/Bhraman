"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plane } from "lucide-react";
import Link from "next/link";
import { getMockDataFromPreferences } from "@/data/mockData";
import type { TripPreferences } from "@/types/trip";

const STAGES = [
  "Understanding your travel goals...",
  "Extracting constraints & preferences...",
  "Scanning 120+ Indian destinations...",
  "Scoring hotels on budget, reviews & distance...",
  "Optimising daily routes & transfer times...",
  "Calculating INR budget breakdown...",
  "Building packing checklist for Indian climate...",
  "Finalising confidence scores...",
];

export default function ReasoningPipelinePage() {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(0);
  const dataLoadedRef = useRef(false);

  useEffect(() => {
    const startGeneration = async () => {
      try {
        const storedPrefs = localStorage.getItem("tripPreferences");
        const preferences: TripPreferences = storedPrefs
          ? JSON.parse(storedPrefs)
          : {
              destination: "Goa Beachfront Resort",
              companions: "Couple / Romantic Getaway 🕯️",
              budget: "Comfort (₹15,000 - ₹50,000 per person)",
              constraints: [],
              specialInstructions: "",
            };

        const existingTripId = localStorage.getItem("currentTripId");

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...preferences, tripId: existingTripId }),
        });

        const data = await res.json();

        if (data.error && !data.destination) {
          throw new Error(data.error);
        }

        if (data.tripId) {
          localStorage.setItem("currentTripId", data.tripId);
        }

        const { tripId: _t, source: _s, supabaseConnected: _sc, ...itinerary } = data;
        localStorage.setItem("currentItinerary", JSON.stringify(itinerary));
        dataLoadedRef.current = true;
      } catch (err) {
        console.error("Generation failed, using mock data:", err);
        const storedPrefs = localStorage.getItem("tripPreferences");
        const preferences: TripPreferences = storedPrefs
          ? JSON.parse(storedPrefs)
          : { destination: "Goa Beachfront Resort", companions: "Solo", budget: "Comfort", constraints: [], specialInstructions: "" };
        localStorage.setItem("currentItinerary", JSON.stringify(getMockDataFromPreferences(preferences)));
        dataLoadedRef.current = true;
      }
    };

    startGeneration();
  }, []);

  useEffect(() => {
    if (currentStage < STAGES.length - 1) {
      const timer = setTimeout(() => setCurrentStage((p) => p + 1), 1000);
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
    <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
      <div className="flex items-center px-6 py-4 border-b border-white/[0.06]">
        <Link href="/" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
          TripMind
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center max-w-md w-full">
          <div className="relative w-28 h-28 mb-12">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-sky-500/20"
              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-sky-400/30"
              animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                <Plane className="w-8 h-8 text-white -rotate-45" />
              </motion.div>
            </div>
          </div>

          <div className="h-16 flex items-center justify-center text-center w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-xl text-zinc-300 font-semibold tracking-tight"
              >
                {STAGES[currentStage]}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="w-full mt-10 bg-white/[0.06] rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStage + 1) / STAGES.length) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>

          <div className="mt-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {currentStage === STAGES.length - 1 && !dataLoadedRef.current ? (
              <span className="text-sky-400 animate-pulse">Scoring your trip...</span>
            ) : (
              `Stage ${currentStage + 1} of ${STAGES.length}`
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
