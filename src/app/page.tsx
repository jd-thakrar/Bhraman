"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plane, MapPin, Brain, Sparkles, ArrowRight, Check, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden selection:bg-indigo-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-900 font-bold text-xl tracking-tight">
            <Plane className="w-6 h-6 text-indigo-600 -rotate-45" />
            TripMind
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/how-it-works" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              How it works
            </Link>
            <Link href="/pricing" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link href="/plan" className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98]">
              Start Planning <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-6 max-w-6xl mx-auto flex flex-col items-center">
        <div className="text-center max-w-3xl z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-600 fill-indigo-200" />
            Powered by Gemini 2.5 Pro AI
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05]"
          >
            Plan your perfect <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Indian Getaway
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-slate-500 font-medium mt-6 leading-relaxed max-w-2xl mx-auto"
          >
            Stop drowning in fifty open tabs. TripMind analyzes thousands of options — hotels, routes, and budgets — to find the mathematically perfect trip.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/plan" className="w-full sm:w-auto inline-flex items-center justify-center bg-indigo-600 text-white rounded-full px-8 py-4 text-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95">
              Start Planning
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-50 text-slate-700 rounded-full px-8 py-4 text-lg font-bold hover:bg-slate-100 border border-slate-200 transition-all active:scale-95">
              See How It Works
            </Link>
          </motion.div>
        </div>

        {/* 3D Interactive App Mockup - Styled beautifully like Flighty */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="relative w-full max-w-3xl mt-16 aspect-video bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col"
        >
          {/* Mockup Header */}
          <div className="h-12 border-b border-slate-100 flex items-center px-6 bg-slate-50/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
            </div>
            <div className="mx-auto text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Trip Analysis</div>
          </div>
          
          {/* Mockup Content */}
          <div className="flex-1 p-6 sm:p-8 grid grid-cols-3 gap-4 bg-white relative">
            <div className="col-span-2 space-y-4">
              <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100/50 relative overflow-hidden">
                <div className="text-2xl font-bold text-slate-900 mb-1">Goa Beach Escapade</div>
                <div className="text-emerald-600 font-semibold text-sm flex items-center">
                  <Check className="w-4 h-4 mr-1" /> 87% Confidence Match
                </div>
                <Plane className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 text-slate-100/20 -rotate-45" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100/50">
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Budget Fit</div>
                  <div className="text-lg font-bold text-slate-800">₹95,000 Total</div>
                </div>
                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100/50">
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Hotel Winner</div>
                  <div className="text-lg font-bold text-slate-800 flex items-center gap-1">
                    Taj Exotica <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="h-full bg-slate-50/70 rounded-2xl p-5 border border-slate-100/50 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">AI Engine Reasoning</div>
                  <div className="space-y-2">
                    <div className="h-2 w-3/4 bg-slate-200 rounded-full" />
                    <div className="h-2 w-full bg-slate-200 rounded-full" />
                    <div className="h-2 w-5/6 bg-slate-200 rounded-full" />
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-indigo-600">Checked 120+ factors</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Steps Section */}
      <section className="bg-slate-50/80 border-y border-slate-100 py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">How TripMind Works</h2>
          <p className="text-slate-500 mt-2 font-medium">Three steps to your mathematically guaranteed vacation</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-6 font-bold text-xl">1</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Tell Us Your Vibe</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Answer 3 simple questions about dates, budget, and travel style. Quick, conversational, and simple.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-6 font-bold text-xl">2</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Crunches the Numbers</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Our Gemini-powered 8-stage pipeline parses destinations, hotels, proximity, and reviews.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-6 font-bold text-xl">3</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Review & Challenge</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Get a custom itinerary. Don't agree? Challenge the AI directly to update details dynamically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-indigo-600">120+</div>
            <div className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">Destinations</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-indigo-600">500+</div>
            <div className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">Hotels Scored</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-indigo-600">₹ INR</div>
            <div className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">Indian Standards</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-indigo-600">Gemini</div>
            <div className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">Real AI Engine</div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-xl shadow-indigo-100">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Ready to build your dream itinerary?</h2>
          <p className="text-indigo-100 text-lg mt-4 max-w-xl mx-auto font-medium">Join thousands of Indian travelers making travel decisions backed by algorithms, not ads.</p>
          <div className="mt-8">
            <Link href="/plan" className="inline-flex items-center justify-center bg-white text-indigo-600 font-bold px-8 py-4 rounded-full hover:bg-slate-50 transition-all shadow-md active:scale-95">
              Plan My Trip Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50/50 text-center text-sm font-medium text-slate-400">
        Built for Prompt Wars 2026 🏆 | TripMind Inc.
      </footer>
    </main>
  );
}
