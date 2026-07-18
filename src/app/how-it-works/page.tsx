"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plane, ArrowRight, Cpu, Check, ShieldCheck, Zap } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Goal Extraction & Preferences",
      desc: "Bhraman parses travel dates, companions, budget caps, and personal constraints to map a structured intent matrix."
    },
    {
      num: 2,
      title: "Hard Constraint Filtering",
      desc: "Flags impossible combinations (e.g., traveling to high-altitude areas without acclimation time or over-budget options)."
    },
    {
      num: 3,
      title: "120+ Indian Destination Indexing",
      desc: "Scores key spots based on real-time weather logs, flight timings, and local seasonal trends."
    },
    {
      num: 4,
      title: "Weighted Hotel Evaluation",
      desc: "Compares stays on budget fit (30%), proximity to hub (30%), review sentiment (20%), and walkability (20%)."
    },
    {
      num: 5,
      title: "Itinerary Route Optimization",
      desc: "Leverages distance maps to minimize transit bottlenecks between daily activities so you spend less time in traffic."
    },
    {
      num: 6,
      title: "Granular Budget Estimation",
      desc: "Aggregates real estimates of flights, hotels, food shacks, and active tickets to yield a final ₹ amount."
    },
    {
      num: 7,
      title: "Packing List Intelligence",
      desc: "Tailors checklists specifically for regional activities (e.g., sunset cruises vs. trekking) and weather trends."
    },
    {
      num: 8,
      title: "Consolidated Score Calibration",
      desc: "Applies statistical confidence parameters to rank hotels, generating a clear winner and rejected options."
    }
  ];

  return (
    <main className="min-h-screen bg-[#0A0B0F] text-[#F0F2F8] overflow-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[140px]" />
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
            <Link href="/how-it-works" className="text-sm font-medium text-white transition-colors">How it works</Link>
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
      <section className="relative z-10 py-20 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-xs font-semibold text-indigo-400 mb-6">
          <Cpu className="w-3.5 h-3.5 mr-1.5" /> Core Algorithm Engine
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
          The 8-Stage Reasoning Pipeline
        </h1>
        <p className="text-lg sm:text-xl text-white/40 font-medium mt-6 max-w-2xl mx-auto leading-relaxed">
          Bhraman doesn't just hit a database. Our pipeline runs a strict, multi-stage scoring process powered by Gemini AI to guarantee decision accuracy.
        </p>
      </section>

      {/* Timeline Steps */}
      <section className="relative z-10 py-12 px-6 max-w-2xl mx-auto">
        <div className="relative border-l-2 border-white/[0.08] ml-4 space-y-12 pb-12">
          {steps.map((step) => (
            <motion.div 
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="relative pl-10"
            >
              {/* Number Dot */}
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md border-4 border-[#0A0B0F]">
                {step.num}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/40 font-medium text-[15px] leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contestable AI Section */}
      <section className="relative z-10 bg-[#12141A] py-24 px-6 border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-xs font-semibold text-indigo-400 mb-6">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Full Transparency
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Don't agree? Challenge the AI.</h2>
          <p className="text-lg text-white/40 font-medium mt-4 max-w-2xl mx-auto leading-relaxed">
            Most engines force an itinerary down your throat. Bhraman exposes the AI's rejections. Simply click "Why not this stay?" to trace the mathematical trade-offs live, adjust variables, and recalculate score outputs.
          </p>

          <div className="mt-12 bg-[#1A1C24] rounded-2xl p-6 border border-white/[0.08] shadow-2xl max-w-md mx-auto text-left">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-white/40 font-bold line-through decoration-white/20">W Goa — Vagator</span>
                <p className="text-white/30 text-xs font-medium mt-1">Party • Modern • Vibrant</p>
              </div>
              <span className="text-amber-500 font-bold text-lg">65% Match</span>
            </div>
            <button className="w-full inline-flex items-center justify-center border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 font-bold px-4 py-2 rounded-full text-xs transition-colors">
              <Zap className="w-3.5 h-3.5 mr-1.5" /> Simulating Re-evaluation
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-24 px-6 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-6">Experience intelligent planning yourself</h2>
        <Link href="/plan" className="inline-flex items-center justify-center bg-indigo-500 hover:bg-indigo-400 text-white rounded-full px-8 py-4 text-lg font-bold transition-all shadow-xl shadow-indigo-500/25 active:scale-95">
          Start Your AI Build
        </Link>
      </section>

      <footer className="relative z-10 py-12 border-t border-white/[0.06] bg-[#0A0B0F] text-center text-sm font-medium text-white/20">
        Built for Prompt Wars 2026 🏆 | Bhraman Inc.
      </footer>
    </main>
  );
}
