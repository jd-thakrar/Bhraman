"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Check,
  Star,
  IndianRupee,
  CloudRain,
  AlertTriangle,
  Train,
  Sun,
} from "lucide-react";
import { FlightyCard, StatusBadge } from "@/components/layout/Navbar";

const INDIAN_TRIP_ALERTS = [
  {
    badge: "success" as const,
    badgeText: "87% Match",
    badgeIcon: Check,
    title: "Goa Beach Escapade",
    subtitle: "IndiGo 6E-234 · 2h 15m · Oct–Mar season",
    alert: null,
    from: "DEL",
    fromCity: "New Delhi",
    to: "GOI",
    toCity: "Goa",
    budget: "95,000",
    hotel: "Taj Exotica",
    constraints: "Veg ✓ · Direct ✓",
  },
  {
    badge: "warning" as const,
    badgeText: "Monsoon Watch",
    badgeIcon: CloudRain,
    title: "Kerala Backwaters",
    subtitle: "SpiceJet SG-872 · On time · Best Sep–Mar",
    alert: "Heavy rain expected in Kochi — houseboat routes may shift to Alleppey canals.",
    from: "BOM",
    fromCity: "Mumbai",
    to: "COK",
    toCity: "Kochi",
    budget: "1,12,000",
    hotel: "Kumarakom Lake Resort",
    constraints: "Veg ✓ · Elderly ✓",
  },
  {
    badge: "info" as const,
    badgeText: "Gate Changed",
    badgeIcon: AlertTriangle,
    title: "Manali Mountain Trek",
    subtitle: "Air India AI-981 · Delayed 35m · T3 Gate 42",
    alert: "Inbound aircraft late from Chandigarh — new departure 11:45 AM (was 11:10 AM).",
    from: "DEL",
    fromCity: "New Delhi",
    to: "KUU",
    toCity: "Kullu",
    budget: "78,500",
    hotel: "The Himalayan",
    constraints: "Direct ✓ · Wi-Fi ✓",
  },
  {
    badge: "success" as const,
    badgeText: "Vande Bharat",
    badgeIcon: Train,
    title: "Udaipur Heritage Tour",
    subtitle: "VB-129 · 7h 20m · Faster than flight + transfer",
    alert: "Train option saves ₹4,200 vs Delhi-Udaipur flight + cab to city.",
    from: "NDLS",
    fromCity: "New Delhi",
    to: "UDZ",
    toCity: "Udaipur",
    budget: "68,000",
    hotel: "Taj Lake Palace",
    constraints: "Jain ✓ · Heritage ✓",
  },
  {
    badge: "success" as const,
    badgeText: "On Time",
    badgeIcon: Sun,
    title: "Rajasthan Desert Safari",
    subtitle: "IndiGo 6E-508 · Clear skies · 32°C in Jaisalmer",
    alert: null,
    from: "BLR",
    fromCity: "Bengaluru",
    to: "JSA",
    toCity: "Jaisalmer",
    budget: "1,05,000",
    hotel: "Suryagarh",
    constraints: "Off-beat ✓ · Pet ✓",
  },
];

export function LiveTripCard() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trip = INDIAN_TRIP_ALERTS[index];

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % INDIAN_TRIP_ALERTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused]);

  const BadgeIcon = trip.badgeIcon;

  return (
    <div
      className="relative w-full max-w-2xl mx-auto flighty-glow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <FlightyCard accent="green" className="p-6 sm:p-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center justify-between mb-6">
              <StatusBadge variant={trip.badge}>
                <BadgeIcon className="w-3 h-3 mr-1" /> {trip.badgeText}
              </StatusBadge>
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                Live Analysis · India
              </span>
            </div>

            {trip.alert && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mb-5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm font-medium"
              >
                {trip.alert}
              </motion.div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{trip.from}</div>
                <div className="text-xs text-zinc-500">{trip.fromCity}</div>
              </div>
              <div className="flex-1 flex items-center gap-2 px-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
                <Plane className="w-5 h-5 text-sky-400 -rotate-45 shrink-0" />
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{trip.to}</div>
                <div className="text-xs text-zinc-500">{trip.toCity}</div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{trip.title}</h3>
            <p className="text-sm text-zinc-400 mb-6">{trip.subtitle}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.04]">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-1">
                  Total Budget
                </div>
                <div className="text-lg font-bold text-white flex items-center gap-1">
                  <IndianRupee className="w-4 h-4 text-emerald-400" />
                  {trip.budget}
                </div>
              </div>
              <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.04]">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-1">
                  Top Pick
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  {trip.hotel} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                </div>
              </div>
              <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.04] col-span-2 sm:col-span-1">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-1">
                  Constraints
                </div>
                <div className="text-sm font-bold text-emerald-400">{trip.constraints}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-1.5 mt-6">
          {INDIAN_TRIP_ALERTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === index ? "w-6 bg-sky-400" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Show trip ${i + 1}`}
            />
          ))}
        </div>
      </FlightyCard>
    </div>
  );
}
