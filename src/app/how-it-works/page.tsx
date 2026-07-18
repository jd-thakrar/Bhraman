"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plane, ArrowRight, Brain, Cpu, Database, Check, ShieldCheck, Zap } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Goal Extraction & Preferences",
      desc: "TripMind parses travel dates, vibe constraints, and budget caps to map a structured intent matrix."
    },
    {
      num: 2,
      title: "Hard Constraint Filtering",
      desc: "Flags impossible combinations (e.g., traveling to Leh/Ladakh without acclimation time or over-budget options)."
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
      desc: "Leverages algorithms to minimize transit bottlenecks between daily activities so you spend less time in traffic."
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
    <main className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-900 font-bold text-xl tracking-tight">
            <Plane className="w-6 h-6 text-indigo-600 -rotate-45" />
            TripMind
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/how-it-works" className="text-sm font-semibold text-slate-900 transition-colors">
              How it works
            </Link>
            <Link href="/pricing" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
          </nav>
          <div>
            <Link href="/plan" className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-all hover:scale-[1.02]">
              Plan My Trip <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700 mb-6">
          <Cpu className="w-3.5 h-3.5 mr-1.5" /> Core Algorithm Engine
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
          The 8-Stage Reasoning Pipeline
        </h1>
        <p className="text-lg sm:text-xl text-slate-500 font-medium mt-6 max-w-2xl mx-auto leading-relaxed">
          TripMind doesn't just hit a database. Our pipeline runs a strict, multi-stage scoring process powered by Gemini AI to guarantee decision accuracy.
        </p>
      </section>

      {/* Timeline Steps */}
      <section className="py-12 px-6 max-w-2xl mx-auto">
        <div className="relative border-l-2 border-indigo-100 ml-4 space-y-12 pb-12">
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
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm border-4 border-white">
                {step.num}
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 font-medium text-[15px] leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contestable AI Section */}
      <section className="bg-slate-50 py-24 px-6 border-y border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700 mb-6">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Full Transparency
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Don't agree? Challenge the AI.</h2>
          <p className="text-lg text-slate-500 font-medium mt-4 max-w-2xl mx-auto leading-relaxed">
            Most engines force an itinerary down your throat. TripMind exposes the AI's rejections. Simply click "Why not this stay?" to trace the mathematical trade-offs live, adjust variables, and recalculate score outputs.
          </p>

          <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm max-w-md mx-auto text-left">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-slate-400 font-bold line-through decoration-slate-300">W Goa — Vagator</span>
                <p className="text-slate-400 text-xs font-medium mt-1">Party • Modern • Vibrant</p>
              </div>
              <span className="text-amber-500 font-bold text-lg">65% Match</span>
            </div>
            <button className="w-full inline-flex items-center justify-center border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold px-4 py-2 rounded-full text-xs transition-colors">
              <Zap className="w-3 h-3 mr-1.5" /> Simulating Re-evaluation
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Experience intelligent planning yourself</h2>
        <Link href="/plan" className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-full px-8 py-4 text-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
          Start Your AI Build
        </Link>
      </section>

      <footer className="py-12 border-t border-slate-100 bg-slate-50 text-center text-sm font-medium text-slate-400">
        Built for Prompt Wars 2026 🏆 | TripMind Inc.
      </footer>
    </main>
  );
}
