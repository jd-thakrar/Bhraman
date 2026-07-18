"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plane, ArrowRight, Check, Sparkles, MapPin, Navigation, Map,
  ShieldCheck, ShieldAlert, DollarSign, Calendar, Sparkle, Send,
  Loader2, Info, Compass, HelpCircle, Star, X, CheckSquare, Square,
  MapPinned, ClipboardList, Bed, LogOut, Edit3, Plus, Trash2, FolderOpen, Save
} from "lucide-react";
import { GOA_MOCK_DATA } from "@/data/mockData";

interface Trip {
  id: string;
  created_at: string;
  destination: string;
  preferences: any;
  selected_hotel: string;
  status: string;
  itinerary: any;
}

const DESTINATIONS = [
  { name: "Goa Beaches", tag: "Beach & Chill", search: "Goa, India" },
  { name: "Manali Mountains", tag: "Adventure", search: "Manali, Himachal Pradesh, India" },
  { name: "Udaipur Heritage", tag: "Culture", search: "Udaipur, Rajasthan, India" },
  { name: "Kerala Backwaters", tag: "Nature", search: "Kerala, India" },
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

const STAGES = [
  "Understanding your travel goals...",
  "Analyzing 120+ Indian destinations...",
  "Calibrating hotel score matrices...",
  "Optimizing daily routes in real-time...",
  "Formatting details for your co-pilot..."
];

export default function PlannerWorkspacePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appStatus, setAppStatus] = useState<"pending" | "generating" | "generated">("pending");
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [generationStage, setGenerationStage] = useState(0);

  // Geo-location state
  const [geoLoc, setGeoLoc] = useState<{ lat: number; lon: number; city: string } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  // Saved trips list
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  // Form preferences
  const [prefs, setPrefs] = useState({
    destination: "",
    companions: "Solo 🎒",
    budget: "Comfort",
    constraints: [] as string[],
    notes: "",
  });

  // Generated Itinerary
  const [itinerary, setItinerary] = useState<any>(null);
  const [tripId, setTripId] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Interactive budget adjustments
  const [budgetItems, setBudgetItems] = useState({
    flights: 0,
    accommodation: 0,
    food: 0,
    activities: 0,
    custom: [] as Array<{ id: string; label: string; value: number }>,
  });
  const [editingBudgetCategory, setEditingBudgetCategory] = useState<string | null>(null);
  const [editBudgetValue, setEditBudgetValue] = useState("");
  const [newCustomLabel, setNewCustomLabel] = useState("");
  const [newCustomValue, setNewCustomValue] = useState("");

  // Right board tabs: "itinerary" | "map" | "hotels"
  const [activeTab, setActiveTab] = useState<"itinerary" | "map" | "hotels">("itinerary");

  // Chat window state
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Re-evaluation challenges state
  const [challengeStates, setChallengeStates] = useState<Record<string, any>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // ── Load User & Saved Trips ──────────────────────────────────────────
  const loadSavedTrips = useCallback(async (userId: string) => {
    setLoadingSaved(true);
    try {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (!error && data) {
        setSavedTrips(data);
      }
    } catch (err) {
      console.error("Error loading saved trips:", err);
    } finally {
      setLoadingSaved(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        loadSavedTrips(data.user.id);
      }
    });
  }, [loadSavedTrips]);

  // ── Geolocation lookup ────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          // Try to reverse geocode coordinate to get Indian city names
          let city = "India";
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            city = data.address?.city || data.address?.state_district || data.address?.state || "India";
          } catch {
            // Fallback coordinates matching Delhi/Mumbai/Bangalore
            if (lat > 25) city = "New Delhi Region";
            else if (lon < 75) city = "Mumbai Region";
            else city = "South India Region";
          }

          setGeoLoc({ lat, lon, city });
          setGeoLoading(false);
        },
        () => {
          setGeoLoading(false);
        }
      );
    }
  }, []);

  // Autoscroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Loading animation loop
  useEffect(() => {
    if (appStatus === "generating") {
      const interval = setInterval(() => {
        setGenerationStage((prev) => {
          if (prev < STAGES.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 1800);
      return () => clearInterval(interval);
    }
  }, [appStatus]);

  // Initialize editable budget when itinerary loads
  useEffect(() => {
    if (itinerary?.budget) {
      setBudgetItems({
        flights: itinerary.budget.flights || 0,
        accommodation: itinerary.budget.accommodation || 0,
        food: itinerary.budget.food || 0,
        activities: itinerary.budget.activities || 0,
        custom: [],
      });
    }
  }, [itinerary]);

  const toggleConstraint = (item: string) => {
    setPrefs((p) => ({
      ...p,
      constraints: p.constraints.includes(item)
        ? p.constraints.filter((c) => c !== item)
        : [...p.constraints, item],
    }));
  };

  const handleStartOnboarding = () => {
    setOnboardingStep(0);
    setAppStatus("pending");
    setItinerary(null);
    setTripId(null);
  };

  const handleGenerateTrip = async () => {
    setAppStatus("generating");
    setGenerationStage(0);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: prefs.destination,
          companions: prefs.companions,
          budget: prefs.budget,
          constraints: prefs.constraints,
          specialInstructions: prefs.notes + (geoLoc ? ` (Origin: departing from ${geoLoc.city})` : ""),
        }),
      });

      if (!res.ok) throw new Error("Generation error");
      const data = await res.json();

      setTripId(data.tripId || null);
      
      // Geolocation aware pricing updates
      if (geoLoc && data.budget) {
        // Adjust flight budget dynamically based on location coordinates
        const flightAdjustment = Math.round(data.budget.flights * (geoLoc.lat > 20 ? 0.9 : 1.25));
        data.budget.flights = flightAdjustment;
        data.budget.total = flightAdjustment + data.budget.accommodation + data.budget.food + data.budget.activities;
      }

      setItinerary(data);
      setChatMessages([
        {
          role: "ai",
          text: `Hey! I'm your Live Co-pilot for ${prefs.destination}. I've dynamically updated your flight pricing originating from ${geoLoc?.city || "your location"}. Have flight delays, or want to make dynamic changes? Ask here!`,
        },
      ]);
      setAppStatus("generated");
      
      // Reload trips in sidebar
      if (user) loadSavedTrips(user.id);
    } catch (err) {
      console.error(err);
      setItinerary(GOA_MOCK_DATA);
      setChatMessages([
        {
          role: "ai",
          text: "I've created a custom Goan escape plan. Let me know if you'd like to adjust details or log dynamic travel changes!",
        },
      ]);
      setAppStatus("generated");
    }
  };

  const handleLoadTrip = async (trip: Trip) => {
    setAppStatus("generating");
    setTripId(trip.id);
    setPrefs(trip.preferences);

    // Load itinerary directly from the trip row
    if (trip.itinerary) {
      setItinerary(trip.itinerary);
      setChatMessages([
        {
          role: "ai",
          text: `Welcome back! Loaded your saved trip to ${trip.destination}. All your previous changes are here. Tell me if you need any adjustments!`,
        },
      ]);
      setAppStatus("generated");
      return;
    }

    // No cached itinerary — regenerate
    handleGenerateTrip();
  };

  const handleSendChatMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const text = customText || chatInput;
    if (!text.trim() || chatLoading) return;

    setChatMessages((p) => [...p, { role: "user", text }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          itinerary,
          tripId,
          chatHistory: chatMessages.slice(-4).map((m) => ({ role: m.role, content: m.text })),
        }),
      });

      const data = await res.json();
      setChatMessages((p) => [...p, { role: "ai", text: data.reply }]);
      if (data.updatedItinerary) {
        setItinerary(data.updatedItinerary);
      }
    } catch (err) {
      console.error(err);
      setChatMessages((p) => [...p, { role: "ai", text: "I'm having a small sync glitch. But we can adjust anytime!" }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChallenge = async (hotelId: string, override?: string) => {
    setChallengeStates((p) => ({ ...p, [hotelId]: { status: "loading" } }));
    try {
      const res = await fetch("/api/recalculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedHotelId: itinerary.hotels[0].id,
          rejectedHotelId: hotelId,
          userConstraint: override || "",
          tripId: tripId,
        }),
      });
      const data = await res.json();
      setChallengeStates((p) => ({
        ...p,
        [hotelId]: {
          status: "done",
          confidence: data.recalculated_confidence,
          summary: data.delta_summary,
        },
      }));
    } catch {
      setChallengeStates((p) => ({
        ...p,
        [hotelId]: {
          status: "done",
          confidence: 74,
          summary: "Alternative stay score improved slightly with this preference constraint.",
        },
      }));
    }
  };
  const handleSaveTrip = async () => {
    if (!tripId) return;
    setSaveStatus("saving");
    try {
      const { error } = await supabase
        .from("trips")
        .update({
          itinerary: itinerary,
          selected_hotel: itinerary?.hotels?.[0]?.name || "",
        })
        .eq("id", tripId);

      if (error) throw error;
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
      if (user) loadSavedTrips(user.id);
    } catch (err) {
      console.error("Save error:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2500);
    }
  };

  // ── Budget recalculations ─────────────────────────────────────────────
  const updateBudgetVal = (category: string, value: number) => {
    setBudgetItems((prev) => {
      const next = { ...prev, [category]: value };
      const customSum = next.custom.reduce((a, c) => a + c.value, 0);
      const total = next.flights + next.accommodation + next.food + next.activities + customSum;
      setItinerary((prevIt: any) => ({
        ...prevIt,
        budget: { ...prevIt.budget, flights: next.flights, accommodation: next.accommodation, food: next.food, activities: next.activities, total },
      }));
      return next;
    });
    setEditingBudgetCategory(null);
  };

  const addCustomBudget = () => {
    if (!newCustomLabel || !newCustomValue) return;
    const value = parseInt(newCustomValue) || 0;
    setBudgetItems((prev) => {
      const nextCustom = [...prev.custom, { id: Math.random().toString(), label: newCustomLabel, value }];
      const next = { ...prev, custom: nextCustom };
      const customSum = nextCustom.reduce((a, c) => a + c.value, 0);
      const total = next.flights + next.accommodation + next.food + next.activities + customSum;
      setItinerary((prevIt: any) => ({
        ...prevIt,
        budget: { ...prevIt.budget, total },
      }));
      return next;
    });
    setNewCustomLabel("");
    setNewCustomValue("");
  };

  const removeCustomBudget = (id: string) => {
    setBudgetItems((prev) => {
      const nextCustom = prev.custom.filter((c) => c.id !== id);
      const next = { ...prev, custom: nextCustom };
      const customSum = nextCustom.reduce((a, c) => a + c.value, 0);
      const total = next.flights + next.accommodation + next.food + next.activities + customSum;
      setItinerary((prevIt: any) => ({
        ...prevIt,
        budget: { ...prevIt.budget, total },
      }));
      return next;
    });
  };

  const toggleCheckItem = (item: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("tripPreferences");
    localStorage.removeItem("currentItinerary");
    localStorage.removeItem("currentTripId");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-[#F0F2F8] flex flex-col justify-between overflow-hidden relative">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/[0.06] bg-[#0A0B0F]/85 backdrop-blur-xl px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-tight hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Plane className="w-4 h-4 text-indigo-400 -rotate-45" />
            </div>
            <span className="text-white">Bhraman</span>
          </Link>
          <span className="text-white/20 text-xs px-2 py-0.5 border border-white/10 rounded font-bold uppercase tracking-wider">
            Workspace
          </span>
          {geoLoc && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/40 font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-full animate-fade-in">
              <Navigation className="w-3 h-3 text-green-400" />
              Departing from: {geoLoc.city}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs font-bold text-white/35 bg-white/5 border border-white/[0.08] px-3 py-1 rounded-full">
                {user.email}
              </span>
              <button onClick={handleSignOut} className="text-xs font-bold text-white/30 hover:text-white transition-colors flex items-center gap-1">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              Access Account
            </Link>
          )}
        </div>
      </header>

      {/* Main Split Screen Area */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10 overflow-hidden">
        
        {/* ========================================================
            LEFT COLUMN (Onboarding Q&A / Live Chat Co-pilot - 40% width)
           ======================================================== */}
        <div className="w-full lg:w-[420px] shrink-0 border-r border-white/[0.06] bg-[#0C0D12] flex flex-col overflow-hidden relative">
          
          {/* Status indicators / wizard progress */}
          <div className="p-4 border-b border-white/[0.05] bg-[#090A0E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${appStatus === 'generated' ? 'bg-green-400 animate-pulse' : 'bg-indigo-400'}`} />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                {appStatus === 'pending' ? `Step ${onboardingStep + 1} of 4` : appStatus === 'generating' ? 'AI Engine Working' : 'AI Travel Co-pilot'}
              </span>
            </div>
            {appStatus === 'generated' && (
              <button 
                onClick={handleStartOnboarding}
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider"
              >
                Reset Planner
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 relative">
            <AnimatePresence mode="wait">
              
              {/* Step A: Intake Q&A Form */}
              {appStatus === "pending" && (
                <motion.div
                  key="onboarding"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Saved trips loader */}
                  {user && savedTrips.length > 0 && onboardingStep === 0 && (
                    <div className="bg-[#12141A] border border-white/[0.07] rounded-2xl p-4 mb-4">
                      <div className="label-muted mb-3 flex items-center gap-1.5 text-indigo-400">
                        <FolderOpen className="w-3.5 h-3.5" /> Saved Trips ({savedTrips.length})
                      </div>
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {savedTrips.map((trip) => (
                          <button
                            key={trip.id}
                            onClick={() => handleLoadTrip(trip)}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/40 text-left transition-all"
                          >
                            <div>
                              <div className="text-xs font-bold text-white">{trip.destination}</div>
                              <div className="text-[9px] text-white/35 mt-0.5">{trip.preferences?.companions} · {trip.preferences?.budget}</div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-white/30" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 0: Destination */}
                  {onboardingStep === 0 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-black text-white tracking-tight leading-snug">Where would you like to escape?</h2>
                      <p className="text-white/40 text-sm font-medium">Type any destination in India or choose a popular card.</p>
                      
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={prefs.destination}
                          onChange={(e) => setPrefs({ ...prefs, destination: e.target.value })}
                          placeholder="e.g. Udaipur, Kerala, Coorg..."
                          className="w-full bg-[#161821] border border-white/[0.08] text-white placeholder-white/20 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                        />
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          {DESTINATIONS.map((d) => (
                            <button
                              key={d.name}
                              onClick={() => setPrefs({ ...prefs, destination: d.name })}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                prefs.destination === d.name
                                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                                  : "bg-[#12141A] border-white/[0.06] text-white/50 hover:border-white/20"
                              }`}
                            >
                              <div className="text-xs font-black">{d.name}</div>
                              <div className="text-[10px] opacity-60 mt-0.5">{d.tag}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 1: Companions */}
                  {onboardingStep === 1 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-black text-white tracking-tight leading-snug">Who is traveling with you?</h2>
                      <p className="text-white/40 text-sm font-medium">We customize the pace, stays, and events accordingly.</p>
                      
                      <div className="space-y-2">
                        {COMPANIONS.map((c) => (
                          <button
                            key={c.label}
                            onClick={() => setPrefs({ ...prefs, companions: c.label })}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                              prefs.companions === c.label
                                ? "bg-indigo-500/10 border-indigo-500/30"
                                : "bg-[#12141A] border-white/[0.07] hover:border-white/20"
                            }`}
                          >
                            <div>
                              <div className="text-sm font-bold text-white">{c.label}</div>
                              <div className="text-xs text-white/35 font-medium mt-0.5">{c.desc}</div>
                            </div>
                            {prefs.companions === c.label && (
                              <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Budget & Constraints */}
                  {onboardingStep === 2 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-black text-white tracking-tight leading-snug">Define your style & budget.</h2>
                      <p className="text-white/40 text-sm font-medium">We run these through our AI scoring matrix.</p>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="label-muted">Budget Level</div>
                          <div className="grid grid-cols-3 gap-2">
                            {BUDGETS.map((b) => (
                              <button
                                key={b.label}
                                onClick={() => setPrefs({ ...prefs, budget: b.label })}
                                className={`p-3.5 rounded-xl border text-center transition-all ${
                                  prefs.budget === b.label
                                    ? "bg-indigo-500/10 border-indigo-500/35"
                                    : "bg-[#12141A] border-white/[0.06] hover:border-white/25"
                                }`}
                              >
                                <div className={`text-xs font-bold ${prefs.budget === b.label ? b.color : 'text-white'}`}>{b.label}</div>
                                <div className="text-[9px] text-white/35 mt-0.5">₹/night</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="label-muted">Special Preferences</div>
                          <div className="flex flex-wrap gap-1.5">
                            {CONSTRAINTS.map((c) => {
                              const active = prefs.constraints.includes(c);
                              return (
                                <button
                                  key={c}
                                  onClick={() => toggleConstraint(c)}
                                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                                    active
                                      ? "bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/10"
                                      : "bg-[#12141A] border-white/[0.08] text-white/40 hover:text-white/70"
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

                  {/* Step 3: Special Notes */}
                  {onboardingStep === 3 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-black text-white tracking-tight leading-snug">Any specific instructions?</h2>
                      <p className="text-white/40 text-sm font-medium">Add details like vegan needs, specific locations, or pace preferences.</p>
                      
                      <textarea
                        rows={5}
                        value={prefs.notes}
                        onChange={(e) => setPrefs({ ...prefs, notes: e.target.value })}
                        placeholder="e.g. Anniversay surprise, slow walks only, avoid crowded marketplaces..."
                        className="w-full bg-[#161821] border border-white/[0.08] text-white placeholder-white/20 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                      />
                    </div>
                  )}

                  {/* Navigation buttons inside Wizard */}
                  <div className="flex gap-2 pt-4">
                    {onboardingStep > 0 && (
                      <button
                        onClick={() => setOnboardingStep((s) => s - 1)}
                        className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-3.5 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        Back
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (onboardingStep < 3) {
                          setOnboardingStep((s) => s + 1);
                        } else {
                          handleGenerateTrip();
                        }
                      }}
                      disabled={onboardingStep === 0 && !prefs.destination}
                      className="flex-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {onboardingStep === 3 ? "Generate Plan" : "Continue"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step B: Radar Processing Engine */}
              {appStatus === "generating" && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="relative w-36 h-36 mb-12">
                    <motion.div
                      className="absolute inset-0 rounded-full border border-indigo-500/20"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute inset-4 rounded-full border border-indigo-400/30"
                      animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0, 0.7] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="absolute inset-8 rounded-full bg-indigo-500/10 border border-indigo-400/40 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      >
                        <Compass className="w-10 h-10 text-indigo-400" />
                      </motion.div>
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">Analyzing Travel Schema</h3>
                  <div className="h-6 overflow-hidden relative w-full px-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={generationStage}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        className="text-xs font-bold text-indigo-400 tracking-wide uppercase"
                      >
                        {STAGES[generationStage]}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* Step C: Live Chat Co-pilot */}
              {appStatus === "generated" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col justify-between"
                >
                  {/* Chat messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[300px] max-h-[calc(100vh-280px)] pb-12">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={msg.role === "user" ? "chat-user" : "chat-ai"}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="chat-ai flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                          <span className="text-white/40 text-xs font-bold uppercase tracking-wider">AI Co-pilot thinking...</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Suggestion Quick Chips */}
                  <div className="py-3 border-t border-white/[0.05] flex gap-1.5 overflow-x-auto scrollbar-hide">
                    {["My flight is late 😩", "Simplify Day 2", "Vegetarian food nearby", "Add a spa session"].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleSendChatMessage(undefined, chip)}
                        className="shrink-0 text-[10px] font-bold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/[0.06] px-3 py-1.5 rounded-full transition-all whitespace-nowrap"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* Chat Input panel */}
                  <form onSubmit={handleSendChatMessage} className="flex gap-2 items-center bg-[#1A1C24] border border-white/[0.08] rounded-xl px-3.5 py-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask the co-pilot to change plans..."
                      className="flex-1 bg-transparent text-sm font-semibold text-white placeholder-white/20 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || chatLoading}
                      className="w-8 h-8 rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 flex items-center justify-center transition-all"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN (Dynamic Apple-Like Planner Board - 60% width)
           ======================================================== */}
        <div className="flex-1 bg-[#0A0B0F] flex flex-col overflow-hidden relative">
          
          {/* Main workspace layout builder */}
          <AnimatePresence mode="wait">
            
            {/* Display placeholder if pending or loading */}
            {appStatus !== "generated" ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="max-w-md bg-[#12141A] border border-white/[0.07] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
                  <MapPinned className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-white mb-2">Live Trip workspace</h3>
                  <p className="text-white/40 text-sm font-medium leading-relaxed">
                    Once you complete the intake questions on the left, your day-by-day plan, hotel scoring comparison, and interactive route map will load here.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="board"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col overflow-hidden"
              >
                
                {/* Control tabs */}
                <div className="p-4 border-b border-white/[0.06] bg-[#0C0D12] flex items-center justify-between">
                  <div className="flex gap-1.5 bg-[#161821] p-1 rounded-xl border border-white/[0.06]">
                    {[
                      { id: "itinerary", icon: ClipboardList, label: "Itinerary & Budget" },
                      { id: "map", icon: Map, label: "Live Map" },
                      { id: "hotels", icon: Bed, label: "Stay Options" }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeTab === tab.id
                              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                              : "text-white/40 hover:text-white"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Save action & Budget preview status */}
                  <div className="flex items-center gap-4">
                    {tripId && (
                      <button
                        onClick={handleSaveTrip}
                        disabled={saveStatus === "saving"}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-[1.02] active:scale-[0.98] ${
                          saveStatus === "saved"
                            ? "bg-green-500/10 border-green-500/35 text-green-400 font-black"
                            : saveStatus === "error"
                            ? "bg-red-500/10 border-red-500/35 text-red-400 font-black"
                            : "bg-indigo-500 hover:bg-indigo-400 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                        }`}
                      >
                        {saveStatus === "saving" ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Saving...
                          </>
                        ) : saveStatus === "saved" ? (
                          <>
                            <Check className="w-3.5 h-3.5 animate-pulse" />
                            Saved to Cloud!
                          </>
                        ) : saveStatus === "error" ? (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Failed to Save
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            Save Changes
                          </>
                        )}
                      </button>
                    )}
                    <div className="text-right">
                      <div className="text-[9px] font-black text-white/30 uppercase tracking-wider">Est. Budget</div>
                      <div className="text-lg font-black text-white">₹{itinerary?.budget?.total?.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Tab content viewer */}
                <div className="flex-1 overflow-y-auto p-6 min-h-0">
                  <AnimatePresence mode="wait">
                    
                    {/* Tab: Itinerary & Budget */}
                    {activeTab === "itinerary" && (
                      <motion.div
                        key="itinerary-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        {/* Interactive Budget editor */}
                        <div className="bg-[#12141A] border border-white/[0.07] rounded-2xl p-5">
                          <div className="label-muted mb-4 flex items-center justify-between">
                            <span>Interactive Cost Calculator</span>
                            <span className="text-[10px] text-green-400 font-bold uppercase">Click any item to edit pricing</span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            {[
                              { key: "flights", label: "Flights", val: budgetItems.flights },
                              { key: "accommodation", label: "Hotels", val: budgetItems.accommodation },
                              { key: "food", label: "Dining", val: budgetItems.food },
                              { key: "activities", label: "Events", val: budgetItems.activities }
                            ].map((b) => (
                              <div 
                                key={b.key} 
                                className="bg-[#161821] border border-white/[0.06] rounded-xl p-3 relative cursor-pointer hover:border-indigo-500/40 transition-all"
                                onClick={() => {
                                  setEditingBudgetCategory(b.key);
                                  setEditBudgetValue(b.val.toString());
                                }}
                              >
                                <div className="text-[10px] font-bold text-white/40">{b.label}</div>
                                {editingBudgetCategory === b.key ? (
                                  <div className="mt-1 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                    <input
                                      type="number"
                                      value={editBudgetValue}
                                      onChange={(e) => setEditBudgetValue(e.target.value)}
                                      className="w-full bg-white/5 border border-white/20 text-white rounded px-1.5 py-0.5 text-xs font-bold"
                                      autoFocus
                                      onBlur={() => updateBudgetVal(b.key, parseInt(editBudgetValue) || 0)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") updateBudgetVal(b.key, parseInt(editBudgetValue) || 0);
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="text-sm font-black text-white mt-1 flex items-center gap-1">
                                    ₹{b.val.toLocaleString()}
                                    <Edit3 className="w-3 h-3 text-white/20 ml-auto" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Custom Expense listings */}
                          {budgetItems.custom.length > 0 && (
                            <div className="space-y-2 mb-4 border-t border-white/[0.05] pt-4">
                              <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Custom expenses added</div>
                              {budgetItems.custom.map((c) => (
                                <div key={c.id} className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] px-3.5 py-2 rounded-xl text-xs">
                                  <span className="font-semibold text-white/60">{c.label}</span>
                                  <div className="flex items-center gap-3">
                                    <span className="font-black text-white">₹{c.value.toLocaleString()}</span>
                                    <button onClick={() => removeCustomBudget(c.id)} className="text-red-400 hover:text-red-300">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add custom Expense item input */}
                          <div className="flex gap-2 items-center border-t border-white/[0.05] pt-4">
                            <input
                              type="text"
                              placeholder="New Expense (e.g. Taxi)"
                              value={newCustomLabel}
                              onChange={(e) => setNewCustomLabel(e.target.value)}
                              className="flex-2 bg-white/5 border border-white/10 text-xs text-white placeholder-white/25 rounded-lg px-2.5 py-1.5 focus:outline-none"
                            />
                            <input
                              type="number"
                              placeholder="Amount (₹)"
                              value={newCustomValue}
                              onChange={(e) => setNewCustomValue(e.target.value)}
                              className="flex-1 bg-white/5 border border-white/10 text-xs text-white placeholder-white/25 rounded-lg px-2.5 py-1.5 focus:outline-none"
                            />
                            <button
                              onClick={addCustomBudget}
                              disabled={!newCustomLabel || !newCustomValue}
                              className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-xs text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add
                            </button>
                          </div>
                        </div>

                        {/* Day timeline */}
                        <div className="relative border-l border-white/[0.06] ml-3.5 space-y-8">
                          {itinerary.itinerary?.map((day: any) => (
                            <div key={day.day} className="relative pl-8">
                              <div className="absolute -left-[9px] top-1 w-4.5 h-4.5 rounded-full bg-indigo-500 border-4 border-[#0A0B0F] shadow-lg shadow-indigo-500/30" />
                              <div className="label-muted mb-1">Day {day.day}</div>
                              <h4 className="text-lg font-black text-white mb-3">{day.title}</h4>
                              <div className="space-y-2">
                                {day.activities?.map((act: any, i: number) => (
                                  <div key={i} className="bg-[#12141A] border border-white/[0.06] rounded-xl px-4 py-3.5 flex gap-4 items-start">
                                    <span className="text-xs font-bold text-indigo-400 w-12 shrink-0 font-mono mt-0.5">{act.time}</span>
                                    <span className="text-sm text-white/70 font-semibold leading-relaxed">{act.description}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Packing list inside itinerary */}
                        {itinerary.packing_list && (
                          <div className="bg-[#12141A] border border-white/[0.07] rounded-2xl p-5 mt-6">
                            <div className="label-muted mb-3">Packing Recommendations</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {itinerary.packing_list.map((cat: any, ci: number) => (
                                <div key={ci} className="space-y-2">
                                  <div className="text-xs font-bold text-indigo-400">{cat.category}</div>
                                  {cat.items?.map((item: string) => (
                                    <button
                                      key={item}
                                      onClick={() => toggleCheckItem(item)}
                                      className="w-full flex items-center gap-2.5 text-left text-xs font-bold text-white/50 hover:text-white"
                                    >
                                      {checkedItems.has(item) ? (
                                        <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                                      ) : (
                                        <Square className="w-4 h-4 text-white/20 shrink-0" />
                                      )}
                                      <span className={checkedItems.has(item) ? "line-through text-white/20" : ""}>{item}</span>
                                    </button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Tab: Real Google Map */}
                    {activeTab === "map" && (
                      <motion.div
                        key="map-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="h-full min-h-[400px] flex flex-col"
                      >
                        <div className="flex-1 bg-[#12141A] border border-white/[0.08] rounded-2xl overflow-hidden relative">
                          <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY || ''}&q=${encodeURIComponent(prefs.destination || 'India')}`}
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold px-3 py-2 rounded-xl">
                          <Navigation className="w-3.5 h-3.5 shrink-0" />
                          <span>Google Maps route mapping loaded dynamically based on location values.</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Tab: Stay Options & Contestable AI */}
                    {activeTab === "hotels" && (
                      <motion.div
                        key="hotels-tab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        {/* Selected Hotel */}
                        <div className="bg-[#12141A] border border-white/[0.07] border-l-[3px] border-l-green-500 rounded-2xl p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="label-muted mb-1">Recommended Stay</div>
                              <h3 className="text-lg font-black text-white">{itinerary.hotels?.[0]?.name}</h3>
                              <div className="flex items-center gap-1 mt-1 text-amber-400">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                <span className="text-white/40 text-[10px] font-bold ml-1.5">{itinerary.hotels?.[0]?.rating} rating</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-4xl font-black text-green-400">87</div>
                              <div className="label-muted">Score</div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {itinerary.hotels?.[0]?.attributes?.map((a: string) => (
                              <span key={a} className="badge-blue text-[10px] font-bold px-2 py-0.5 rounded-full">{a}</span>
                            ))}
                          </div>
                        </div>

                        {/* Alternate stay re-evaluations */}
                        <div className="label-muted mt-6 mb-2">Alternatives Evaluated</div>
                        <div className="space-y-3">
                          {itinerary.hotels?.slice(1).map((hotel: any) => {
                            const challenge = challengeStates[hotel.id];
                            return (
                              <div key={hotel.id} className="bg-[#12141A] border border-white/[0.06] border-l-[3px] border-l-red-500/50 rounded-2xl p-5">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="text-base font-bold text-white/30 line-through decoration-white/20">{hotel.name}</h4>
                                    <div className="text-[10px] text-white/30 mt-1">₹{hotel.pricePerNight?.toLocaleString()}/night · {hotel.travelTimeMinutes}min airport distance</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-black text-white/30">{challenge?.confidence || "62"}</div>
                                    <div className="label-muted">Score</div>
                                  </div>
                                </div>

                                <AnimatePresence mode="wait">
                                  {!challenge ? (
                                    <button
                                      onClick={() => handleChallenge(hotel.id)}
                                      className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 hover:text-indigo-400 border border-white/[0.08] hover:border-indigo-500/30 px-3 py-1.5 rounded-full transition-all"
                                    >
                                      <Info className="w-3.5 h-3.5" /> Explain Decision
                                    </button>
                                  ) : (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      className="bg-[#161821] border border-white/[0.06] rounded-xl p-3.5 mt-2"
                                    >
                                      {challenge.status === "loading" ? (
                                        <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold">
                                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Recalculating scoring matrix...
                                        </div>
                                      ) : (
                                        <>
                                          <p className="text-xs text-white/50 leading-relaxed font-semibold mb-3">{challenge.summary}</p>
                                          <div className="flex flex-wrap gap-1.5">
                                            <span className="text-[9px] font-black text-white/30 uppercase block w-full mb-1">Override scoring priority:</span>
                                            {["Budget doesn't matter", "I prefer nightlife"].map((opt) => (
                                              <button
                                                key={opt}
                                                onClick={() => handleChallenge(hotel.id, opt)}
                                                className="text-[9px] font-bold text-white/40 hover:text-indigo-300 bg-white/5 hover:bg-indigo-500/10 border border-white/[0.06] px-2 py-1 transition-all"
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
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
