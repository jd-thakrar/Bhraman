"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plane, ArrowLeft, ArrowRight, User, Check, Users, Shield, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function PlanTripPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState<any>(null);
  
  const [preferences, setPreferences] = useState({
    destination: "",
    companions: "Solo Adventurer",
    budget: "Comfort (₹15,000 - ₹50,000)",
    constraints: [] as string[],
    specialInstructions: ""
  });

  useEffect(() => {
    // Check auth status
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  const destinationsList = [
    { name: "Goa Beachfront Resort", vibe: "Beach & Relaxation" },
    { name: "Himachal Mountain Trek", vibe: "Mountains & Adventure" },
    { name: "Udaipur Heritage Tour", vibe: "Heritage & Culture" },
    { name: "Kerala Backwaters Cruise", vibe: "Nature & Romance" }
  ];

  const companionOptions = [
    { label: "Solo Adventurer 🎒", desc: "Traveling alone" },
    { label: "Couple / Romantic Getaway 🕯️", desc: "For two travelers" },
    { label: "Family Vacation (with Kids/Seniors) 👨‍👩‍👧‍👦", desc: "Kid/senior-friendly stays" },
    { label: "Group of Friends 🍻", desc: "Active & social outings" }
  ];

  const budgetOptions = [
    { label: "Economy (under ₹15,000 per person)", desc: "Backpacker shacks & budget stays" },
    { label: "Comfort (₹15,000 - ₹50,000 per person)", desc: "Optimal 3/4-star stays & flights" },
    { label: "Luxury (₹50,000+ per person)", desc: "Premium 5-star resorts & private transfers" }
  ];

  const constraintOptions = [
    "Pure Vegetarian / Jain Food 🥦",
    "Elderly-Friendly (minimal stairways/walking) 🚶‍♂️",
    "Direct Flights Only ✈️",
    "Pet-Friendly Stays 🐾",
    "Off-beat / Avoid Crowded Spots ⛰️",
    "Strong Wi-Fi for Remote Work 💻"
  ];

  const toggleConstraint = (item: string) => {
    setPreferences(prev => ({
      ...prev,
      constraints: prev.constraints.includes(item)
        ? prev.constraints.filter(c => c !== item)
        : [...prev.constraints, item]
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      localStorage.setItem('tripPreferences', JSON.stringify(preferences));
      router.push("/plan/reasoning");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-100">
      {/* Top Nav */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-slate-900 font-bold text-lg tracking-tight">
          <Plane className="w-5 h-5 text-indigo-600 -rotate-45" />
          TripMind
        </Link>
        <div className="flex items-center gap-4">
          {step > 0 && (
            <button 
              onClick={() => setStep(step - 1)} 
              className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{user.email}</span>
              <button 
                onClick={handleLogout}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full max-w-xl mx-auto mt-8 px-6">
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                i <= step ? "bg-indigo-600" : "bg-slate-200"
              }`} 
            />
          ))}
        </div>
        <div className="text-center mt-6 text-xs uppercase tracking-widest font-bold text-slate-400">
          Onboarding Stage {step + 1} of 4
        </div>
      </div>

      {/* Conversational Questions */}
      <div className="flex-1 flex flex-col items-center px-6 pt-6 pb-24 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* STEP 1: Destination Finder */}
            {step === 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Where do you want to explore?</h2>
                  <p className="text-slate-400 text-sm font-semibold">Select a preset template or search any place in India</p>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                  <input
                    type="text"
                    required
                    value={preferences.destination}
                    onChange={(e) => setPreferences({ ...preferences, destination: e.target.value })}
                    placeholder="e.g. Manali, Udaipur, Ooty..."
                    className="block w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                  />
                  
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Popular Recommendations</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {destinationsList.map((dest) => (
                        <button
                          key={dest.name}
                          onClick={() => setPreferences({ ...preferences, destination: dest.name })}
                          className={`p-3 text-left rounded-xl border transition-all text-sm font-semibold flex items-center justify-between cursor-pointer ${
                            preferences.destination === dest.name
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          <span>{dest.name}</span>
                          <span className="text-xs text-slate-400 font-medium">{dest.vibe}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Companions & Travel Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Who is traveling with you?</h2>
                  <p className="text-slate-400 text-sm font-semibold">Companions adjust hotel options and activity speeds</p>
                </div>

                <div className="grid gap-3">
                  {companionOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setPreferences({ ...preferences, companions: opt.label })}
                      className={`p-5 text-left rounded-3xl border transition-all flex items-center justify-between cursor-pointer ${
                        preferences.companions === opt.label
                          ? "bg-indigo-50 border-indigo-300 shadow-sm"
                          : "bg-white border-slate-100 hover:border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
                      }`}
                    >
                      <div>
                        <span className="font-bold text-slate-800 block text-lg">{opt.label}</span>
                        <span className="text-xs font-semibold text-slate-400 mt-1 block">{opt.desc}</span>
                      </div>
                      {preferences.companions === opt.label && (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Budget Tier & Constraints */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Configure budget & restrictions</h2>
                  <p className="text-slate-400 text-sm font-semibold">Customize pricing rules and absolute constraints</p>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                  {/* Budget Selector */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Budget Tier</span>
                    <div className="space-y-2">
                      {budgetOptions.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => setPreferences({ ...preferences, budget: opt.label })}
                          className={`w-full p-4 text-left rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                            preferences.budget === opt.label
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 font-medium"
                          }`}
                        >
                          <div>
                            <span className="text-sm block">{opt.label}</span>
                            <span className="text-[10px] opacity-70 block mt-0.5">{opt.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Constraints Selector */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Key Constraints</span>
                    <div className="flex flex-wrap gap-2">
                      {constraintOptions.map((opt) => {
                        const active = preferences.constraints.includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={() => toggleConstraint(opt)}
                            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              active
                                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                                : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Conversational Instruction prompts */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Any special requests?</h2>
                  <p className="text-slate-400 text-sm font-semibold">Write anything else you want the AI to accommodate</p>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                  <textarea
                    rows={5}
                    value={preferences.specialInstructions}
                    onChange={(e) => setPreferences({ ...preferences, specialInstructions: e.target.value })}
                    placeholder="e.g. 'I want to see historical monuments but skip the long walks. Only veg meals are preferred, and we need a quiet hotel with private balconies...'"
                    className="block w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold"
                  />
                  <div className="text-xs font-semibold text-slate-400 flex items-start gap-1.5 leading-relaxed">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Gemini AI will dynamically interpret this request and modify itineraries, budgets, and stays accordingly.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Action Button */}
            <div className="mt-8 flex justify-end">
              <button
                disabled={step === 0 && !preferences.destination}
                onClick={handleNext}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-indigo-600 text-white rounded-full px-8 py-3.5 font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
              >
                {step === 3 ? "Generate Plan" : "Continue"} <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
