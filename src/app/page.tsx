"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plane, ArrowRight, Sparkles, Check, MapPin, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0B0F] text-[#F0F2F8] overflow-hidden">

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <header className="relative z-50 border-b border-white/[0.06] bg-[#0A0B0F]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Plane className="w-4 h-4 text-indigo-400 -rotate-45" />
            </div>
            <span className="text-white">Bhraman</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/how-it-works" className="text-sm font-medium text-white/50 hover:text-white transition-colors">How it works</Link>
            <Link href="/pricing" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Pricing</Link>
            <Link href="/admin" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Admin</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-white/60 hover:text-white transition-colors">Sign In</Link>
            <Link href="/plan" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold px-4 py-2 rounded-full transition-all hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-indigo-500/20">
              Plan Trip <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold px-4 py-1.5 rounded-full mb-8">
            <Sparkles className="w-3.5 h-3.5" /> Powered by Gemini 2.5 Pro
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-[1.02] mb-6">
            Your AI travel<br />
            <span className="gradient-text">co-pilot for India</span>
          </h1>
          <p className="text-lg text-white/40 font-medium max-w-xl mx-auto leading-relaxed mb-10">
            Tell it your destination, budget, and vibe. Watch it build a mathematically perfect trip — and update it live when plans change.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/plan" className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/25">
              Start Planning Free
            </Link>
            <Link href="/how-it-works" className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4 rounded-full transition-all">
              See How It Works
            </Link>
          </div>
        </motion.div>

        {/* Live Trip Card — Flighty style */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative mt-20 max-w-2xl mx-auto"
        >
          {/* Card glow */}
          <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl blur-xl" />

          <div className="relative bg-[#12141A] border border-white/[0.07] rounded-3xl overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Live AI Analysis</span>
              </div>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">87% Match</span>
            </div>

            {/* Main content */}
            <div className="p-6 grid grid-cols-3 gap-4">
              {/* Left — Destination */}
              <div className="col-span-2">
                <div className="label-muted mb-2">Recommended</div>
                <div className="text-3xl font-black text-white mb-1">GOA</div>
                <div className="text-sm text-white/40 font-medium mb-4">Taj Exotica Resort & Spa · Beachfront</div>
                <div className="flex gap-2">
                  <span className="badge-green text-[11px] font-bold px-3 py-1 rounded-full">✓ Best Value</span>
                  <span className="badge-blue text-[11px] font-bold px-3 py-1 rounded-full">45 min airport</span>
                </div>
              </div>
              {/* Right — Score */}
              <div className="flex flex-col items-end justify-between">
                <div className="text-right">
                  <div className="label-muted mb-1">Confidence</div>
                  <div className="text-5xl font-black text-green-400 leading-none">87</div>
                  <div className="text-white/30 text-xs font-bold">/ 100</div>
                </div>
                <div className="text-right">
                  <div className="label-muted mb-1">Budget</div>
                  <div className="text-xl font-bold text-white">₹95,000</div>
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-4 border-t border-white/[0.06]">
              {[["Budget Fit", "25/30"], ["Proximity", "28/30"], ["Reviews", "18/20"], ["Walkability", "16/20"]].map(([k, v]) => (
                <div key={k} className="p-4 text-center border-r border-white/[0.05] last:border-r-0">
                  <div className="label-muted mb-1">{k}</div>
                  <div className="text-sm font-bold text-white/80">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature highlights */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Zap, title: "Live AI Chat", desc: "Tell it 'flight delayed 2 hours' and it instantly rebuilds your itinerary around your new reality.", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
            { icon: Shield, title: "Contestable AI", desc: "Don't like a recommendation? Challenge it. The AI explains every decision with full score breakdowns.", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
            { icon: MapPin, title: "120+ Indian Destinations", desc: "From Leh to Kanyakumari. Every recommendation scored against 8 weighted factors in real time.", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="bg-[#12141A] border border-white/[0.06] rounded-2xl p-6">
              <div className={`w-10 h-10 rounded-xl border ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 py-8 border-y border-white/[0.05]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[["120+", "Destinations"], ["500+", "Hotels Scored"], ["₹ INR", "Indian Pricing"], ["Gemini", "AI Engine"]].map(([num, label]) => (
            <div key={label}>
              <div className="text-2xl font-black text-indigo-400 mb-1">{num}</div>
              <div className="label-muted">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-black text-white mb-4">Ready to plan smarter?</h2>
        <p className="text-white/40 mb-8 font-medium">Built for real travelers. Backed by real AI.</p>
        <Link href="/plan" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-10 py-4 rounded-full transition-all hover:scale-105 shadow-xl shadow-indigo-500/25">
          Start Free <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <footer className="border-t border-white/[0.05] py-8 text-center text-xs text-white/20 font-medium">
        Bhraman · Built for Prompt Wars 2026 🏆
      </footer>
    </main>
  );
}
