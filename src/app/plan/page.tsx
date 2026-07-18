"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plane, ArrowLeft, ArrowRight, Check, Sparkles, User } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const DESTINATIONS = [
  { name: "Goa Beaches", tag: "Beach & Chill" },
  { name: "Manali Mountains", tag: "Adventure" },
  { name: "Udaipur Heritage", tag: "Culture" },
  { name: "Kerala Backwaters", tag: "Nature" },
  { name: "Jaipur Pink City", tag: "Heritage" },
  { name: "Andaman Islands", tag: "Tropical" },
];

const COMPANIONS = [
  { label: "Solo 🎒", desc: "Just me — flexible & free" },
  { label: "Couple 🕯️", desc: "Romantic getaway for two" },
  { label: "Family 👨‍👩‍👧‍👦", desc: "Kid & senior-friendly picks" },
  { label: "Friends 🍻", desc: "Group energy, shared memories" },
];

const BUDGETS = [
  { label: "Economy", sub: "under ₹15,000/person", color: "text-green-400" },
  { label: "Comfort", sub: "₹15,000–₹50,000/person", color: "text-indigo-400" },
  { label: "Luxury", sub: "₹50,000+/person", color: "text-amber-400" },
];

const CONSTRAINTS = [
  "Pure Veg / Jain Food 🥦", "Direct Flights Only ✈️",
  "Pet-Friendly 🐾", "Senior-Friendly 🧓",
  "Wi-Fi for Remote Work 💻", "Off-beat Spots ⛰️",
];

export default function PlanPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [prefs, setPrefs] = useState({
    destination: "", companions: "Solo 🎒",
    budget: "Comfort", constraints: [] as string[], notes: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const toggle = (item: string) =>
    setPrefs(p => ({
      ...p,
      constraints: p.constraints.includes(item)
        ? p.constraints.filter(c => c !== item)
        : [...p.constraints, item],
    }));

  const next = () => {
    if (step < 3) { setStep(s => s + 1); return; }
    localStorage.setItem("tripPreferences", JSON.stringify(prefs));
    router.push("/plan/reasoning");
  };

  const steps = ["Destination", "Companions", "Budget & Needs", "Final Details"];

  return (
    <div className="min-h-screen bg-[#0A0B0F] flex flex-col">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/6 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <header className="relative z-10 border-b border-white/[0.06] bg-[#0A0B0F]/80 backdrop-blur-xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-base">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Plane className="w-4 h-4 text-indigo-400 -rotate-45" />
          </div>
          <span className="text-white">Bhraman</span>
        </Link>
        <div className="flex items-center gap-4">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1 text-sm text-white/40 hover:text-white transition-colors font-semibold">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          {user ? (
            <span className="text-xs font-bold text-white/30 bg-white/5 border border-white/[0.08] px-3 py-1 rounded-full">
              {user.email}
            </span>
          ) : (
            <Link href="/login" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Progress */}
      <div className="relative z-10 max-w-xl mx-auto w-full px-6 mt-8">
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-indigo-500" : "bg-white/[0.08]"}`} />
          ))}
        </div>
        <div className="flex justify-between mt-3">
          {steps.map((s, i) => (
            <span key={i} className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${i === step ? "text-indigo-400" : "text-white/20"}`}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-start justify-center px-6 pt-10 pb-24">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>

              {/* Step 0 — Destination */}
              {step === 0 && (
                <div>
                  <h2 className="text-3xl font-black text-white mb-1">Where to?</h2>
                  <p className="text-white/30 text-sm font-medium mb-6">Type any Indian city or pick a preset</p>
                  <div className="bg-[#12141A] border border-white/[0.07] rounded-2xl p-5 space-y-4">
                    <input
                      type="text"
                      value={prefs.destination}
                      onChange={e => setPrefs(p => ({ ...p, destination: e.target.value }))}
                      placeholder="e.g. Rishikesh, Coorg, Darjeeling..."
                      className="w-full bg-[#1A1C24] border border-white/[0.08] text-white placeholder-white/20 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                    <div className="label-muted">Popular Picks</div>
                    <div className="grid grid-cols-2 gap-2">
                      {DESTINATIONS.map(d => (
                        <button
                          key={d.name}
                          onClick={() => setPrefs(p => ({ ...p, destination: d.name }))}
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                            prefs.destination === d.name
                              ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                              : "bg-white/[0.02] border-white/[0.06] text-white/60 hover:border-white/20"
                          }`}
                        >
                          <span className="text-sm font-bold">{d.name}</span>
                          <span className="text-[10px] font-semibold opacity-60">{d.tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1 — Companions */}
              {step === 1 && (
                <div>
                  <h2 className="text-3xl font-black text-white mb-1">Who's joining?</h2>
                  <p className="text-white/30 text-sm font-medium mb-6">This shapes hotel and activity recommendations</p>
                  <div className="space-y-2">
                    {COMPANIONS.map(c => (
                      <button
                        key={c.label}
                        onClick={() => setPrefs(p => ({ ...p, companions: c.label }))}
                        className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all text-left ${
                          prefs.companions === c.label
                            ? "bg-indigo-500/10 border-indigo-500/30"
                            : "bg-[#12141A] border-white/[0.07] hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="text-base font-bold text-white">{c.label}</div>
                          <div className="text-sm text-white/30 font-medium mt-0.5">{c.desc}</div>
                        </div>
                        {prefs.companions === c.label && (
                          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 — Budget & Constraints */}
              {step === 2 && (
                <div>
                  <h2 className="text-3xl font-black text-white mb-1">Budget & needs</h2>
                  <p className="text-white/30 text-sm font-medium mb-6">We'll score every hotel against these</p>
                  <div className="bg-[#12141A] border border-white/[0.07] rounded-2xl p-5 space-y-5">
                    <div>
                      <div className="label-muted mb-3">Budget Tier</div>
                      <div className="space-y-2">
                        {BUDGETS.map(b => (
                          <button
                            key={b.label}
                            onClick={() => setPrefs(p => ({ ...p, budget: b.label }))}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                              prefs.budget === b.label
                                ? "bg-indigo-500/10 border-indigo-500/30"
                                : "bg-white/[0.02] border-white/[0.06] hover:border-white/20"
                            }`}
                          >
                            <div className="text-left">
                              <div className={`text-sm font-bold ${prefs.budget === b.label ? b.color : "text-white"}`}>{b.label}</div>
                              <div className="text-xs text-white/30 font-medium mt-0.5">{b.sub}</div>
                            </div>
                            {prefs.budget === b.label && <Check className="w-4 h-4 text-indigo-400" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="label-muted mb-3">Hard Requirements</div>
                      <div className="flex flex-wrap gap-2">
                        {CONSTRAINTS.map(c => {
                          const on = prefs.constraints.includes(c);
                          return (
                            <button
                              key={c}
                              onClick={() => toggle(c)}
                              className={`text-xs font-bold px-3.5 py-2 rounded-full border transition-all ${
                                on ? "bg-indigo-500 border-indigo-500 text-white" : "bg-white/[0.03] border-white/[0.08] text-white/40 hover:border-white/20 hover:text-white/70"
                              }`}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 — Notes */}
              {step === 3 && (
                <div>
                  <h2 className="text-3xl font-black text-white mb-1">Anything else?</h2>
                  <p className="text-white/30 text-sm font-medium mb-6">Give the AI full context — the more detail, the better</p>
                  <div className="bg-[#12141A] border border-white/[0.07] rounded-2xl p-5">
                    <textarea
                      rows={6}
                      value={prefs.notes}
                      onChange={e => setPrefs(p => ({ ...p, notes: e.target.value }))}
                      placeholder="e.g. 'We have a 3-year-old so no late evenings. My wife is vegetarian. We prefer quiet spots over tourist traps. Birthday trip so something special would be nice...'"
                      className="w-full bg-[#1A1C24] border border-white/[0.08] text-white placeholder-white/20 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                    />
                    <div className="flex items-start gap-2 mt-3">
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-white/30 font-medium leading-relaxed">
                        Gemini AI reads every word of this. The more specific you are, the more personalised your itinerary will be.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={next}
                disabled={step === 0 && !prefs.destination}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/20"
              >
                {step === 3 ? (
                  <><Sparkles className="w-4 h-4" /> Generate My Trip</>
                ) : (
                  <>Continue <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
