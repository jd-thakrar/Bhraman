"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane, Users, MapPin, MessageSquare, Clock, Check, RefreshCw,
  Loader2, Zap, LogOut, Database, Wifi, WifiOff, ArrowRight,
} from "lucide-react";

interface Trip {
  id: string; created_at: string; destination: string;
  preferences: any; selected_hotel: string; status: string;
}
interface Challenge {
  id: string; created_at: string; challenged_hotel_id: string;
  user_constraint: string; recalculated_confidence: number; delta_summary: string;
}

type Tab = "trips" | "challenges";

export default function AdminPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");
  const [tab, setTab] = useState<Tab>("trips");
  const [connected, setConnected] = useState(false);
  const [realtimeEvents, setRealtimeEvents] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  // ── Auth check ────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // ── Load data ─────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    const [{ data: t }, { data: c }] = await Promise.all([
      supabase.from("trips").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("challenge_responses").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    setTrips(t || []);
    setChallenges(c || []);
    setLoading(false);
    setConnected(true);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Real-time subscriptions ───────────────────────────────────────────
  useEffect(() => {
    const pushEvent = (msg: string) =>
      setRealtimeEvents((prev) => [`${new Date().toLocaleTimeString("en-IN")} — ${msg}`, ...prev.slice(0, 7)]);

    const tripsChannel = supabase
      .channel("admin-trips")
      .on("postgres_changes", { event: "*", schema: "public", table: "trips" }, (payload) => {
        pushEvent(`Trip ${payload.eventType}: ${(payload.new as any)?.destination || (payload.old as any)?.id}`);
        if (payload.eventType === "INSERT") {
          setTrips((prev) => [payload.new as Trip, ...prev]);
        } else if (payload.eventType === "UPDATE") {
          setTrips((prev) => prev.map((t) => t.id === (payload.new as Trip).id ? payload.new as Trip : t));
        } else if (payload.eventType === "DELETE") {
          setTrips((prev) => prev.filter((t) => t.id !== (payload.old as any).id));
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") { setConnected(true); pushEvent("Real-time connected ✓"); }
        if (status === "CLOSED") setConnected(false);
      });

    const chalChannel = supabase
      .channel("admin-challenges")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "challenge_responses" }, (payload) => {
        pushEvent(`New AI challenge: score ${(payload.new as any)?.recalculated_confidence}`);
        setTrips((prev) => prev); // trigger re-render
        setChallenges((prev) => [payload.new as Challenge, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(tripsChannel);
      supabase.removeChannel(chalChannel);
    };
  }, []);

  // ── Seed data ─────────────────────────────────────────────────────────
  const seedData = async () => {
    setSeeding(true);
    setSeedMsg("");
    const res = await fetch("/api/setup", { method: "POST" });
    const data = await res.json();
    setSeedMsg(data.ok ? `✓ ${data.message}` : `✗ ${data.errors?.join(", ") || data.message}`);
    setSeeding(false);
    if (data.ok) await loadData();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const statusColor = (s: string) =>
    s === "generated" ? "badge-green" : s === "failed" ? "badge-red" : "badge-amber";

  const fmt = (d: string) =>
    new Date(d).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" });

  return (
    <div className="min-h-screen bg-[#0A0B0F]">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0A0B0F]/90 backdrop-blur-xl px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-base">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Plane className="w-4 h-4 text-indigo-400 -rotate-45" />
            </div>
            <span className="text-white">Bhraman</span>
          </Link>
          <span className="text-white/20 font-normal text-sm">/ Admin</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Realtime indicator */}
          <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
            connected ? "text-green-400 bg-green-500/10 border-green-500/20" : "text-white/30 bg-white/5 border-white/10"
          }`}>
            {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {connected ? "Real-time Live" : "Disconnected"}
          </div>
          {user && (
            <button onClick={signOut} className="flex items-center gap-1.5 text-xs font-bold text-white/30 hover:text-white transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Realtime log strip ─────────────────────────────────────── */}
        <AnimatePresence>
          {realtimeEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 bg-[#0D0E14] border border-white/[0.06] rounded-xl p-3 font-mono"
            >
              <div className="label-muted mb-2">Real-time Event Log</div>
              {realtimeEvents.map((e, i) => (
                <div key={i} className={`text-xs py-0.5 ${i === 0 ? "text-green-400" : "text-white/20"}`}>
                  {e}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stat Cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Total Trips", value: trips.length, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
            { icon: Check, label: "Generated", value: trips.filter((t) => t.status === "generated").length, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
            { icon: MessageSquare, label: "AI Challenges", value: challenges.length, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            { icon: Clock, label: "Pending", value: trips.filter((t) => t.status === "pending").length, color: "text-white/40", bg: "bg-white/5 border-white/10" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <motion.div
              key={label}
              layout
              className="bg-[#12141A] border border-white/[0.07] rounded-2xl p-5"
            >
              <div className={`w-9 h-9 rounded-xl border ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <motion.div
                key={value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-black text-white mb-1"
              >
                {value}
              </motion.div>
              <div className="label-muted">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Actions row ───────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={seedData}
            disabled={seeding}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-full transition-all"
          >
            {seeding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
            {seeding ? "Seeding…" : "Seed Dummy Data"}
          </button>
          <button
            onClick={loadData}
            className="flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white border border-white/[0.08] hover:border-white/20 px-4 py-2 rounded-full transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <Link
            href="/plan"
            className="flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white border border-white/[0.08] hover:border-white/20 px-4 py-2 rounded-full transition-all"
          >
            <ArrowRight className="w-3.5 h-3.5" /> New Trip
          </Link>
          {seedMsg && (
            <div className={`flex items-center text-xs font-bold px-4 py-2 rounded-full border ${
              seedMsg.startsWith("✓")
                ? "text-green-400 bg-green-500/10 border-green-500/20"
                : "text-red-400 bg-red-500/10 border-red-500/20"
            }`}>
              {seedMsg}
            </div>
          )}
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────── */}
        <div className="flex gap-1 mb-5 bg-[#12141A] border border-white/[0.06] rounded-xl p-1 w-fit">
          {(["trips", "challenges"] as Tab[]).map((t) => (
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

        {/* ── Loading ────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center gap-3 text-white/30 text-sm font-medium py-12 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> Fetching from Supabase…
          </div>
        )}

        {/* ── Trips Table ────────────────────────────────────────────── */}
        {!loading && tab === "trips" && (
          <div className="bg-[#12141A] border border-white/[0.07] rounded-2xl overflow-hidden">
            {trips.length === 0 ? (
              <div className="py-16 text-center">
                <MapPin className="w-8 h-8 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm font-medium mb-4">No trips yet.</p>
                <button onClick={seedData} disabled={seeding} className="inline-flex items-center gap-2 bg-indigo-500 text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-indigo-400 transition-all">
                  <Database className="w-4 h-4" /> Seed Dummy Data
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Destination", "Companions", "Budget", "Hotel", "Status", "Created"].map((h) => (
                        <th key={h} className="label-muted text-left px-5 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {trips.map((trip, i) => (
                        <motion.tr
                          key={trip.id}
                          initial={{ opacity: 0, backgroundColor: "rgba(91,110,245,0.1)" }}
                          animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0)" }}
                          transition={{ duration: 0.8 }}
                          className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i === trips.length - 1 ? "border-b-0" : ""}`}
                        >
                          <td className="px-5 py-4 text-sm font-bold text-white">
                            {trip.destination || trip.preferences?.destination || "—"}
                          </td>
                          <td className="px-5 py-4 text-sm text-white/40 font-medium">
                            {trip.preferences?.companions || "—"}
                          </td>
                          <td className="px-5 py-4 text-sm text-white/40">
                            {trip.preferences?.budget || "—"}
                          </td>
                          <td className="px-5 py-4 text-sm text-white/50 max-w-[160px] truncate">
                            {trip.selected_hotel || "—"}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`${statusColor(trip.status)} text-[11px] font-bold px-2.5 py-1 rounded-full capitalize`}>
                              {trip.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-white/20 font-mono whitespace-nowrap">
                            {fmt(trip.created_at)}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Challenges Table ───────────────────────────────────────── */}
        {!loading && tab === "challenges" && (
          <div className="bg-[#12141A] border border-white/[0.07] rounded-2xl overflow-hidden">
            {challenges.length === 0 ? (
              <div className="py-16 text-center">
                <MessageSquare className="w-8 h-8 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm font-medium">No AI challenges yet.</p>
                <p className="text-white/20 text-xs mt-1">Click "Why not this stay?" in the compare view to generate one.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Hotel Challenged", "Constraint", "New Score", "AI Verdict", "Time"].map((h) => (
                        <th key={h} className="label-muted text-left px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {challenges.map((c, i) => (
                        <motion.tr
                          key={c.id}
                          initial={{ opacity: 0, backgroundColor: "rgba(245,158,11,0.08)" }}
                          animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0)" }}
                          transition={{ duration: 0.8 }}
                          className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i === challenges.length - 1 ? "border-b-0" : ""}`}
                        >
                          <td className="px-5 py-4 text-sm font-bold text-white/60">{c.challenged_hotel_id}</td>
                          <td className="px-5 py-4 text-sm text-white/40 max-w-[160px] truncate">
                            {c.user_constraint || "Default challenge"}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-2xl font-black ${
                              c.recalculated_confidence >= 80 ? "text-green-400" :
                              c.recalculated_confidence >= 55 ? "text-amber-400" : "text-red-400"
                            }`}>
                              {c.recalculated_confidence}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-white/30 max-w-[260px]">
                            <div className="line-clamp-2">{c.delta_summary}</div>
                          </td>
                          <td className="px-5 py-4 text-xs text-white/20 font-mono whitespace-nowrap">
                            {fmt(c.created_at)}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
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
