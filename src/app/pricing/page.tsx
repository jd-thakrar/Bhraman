"use client";

import Link from "next/link";
import { Plane, ArrowRight, Check, Sparkles } from "lucide-react";

export default function Pricing() {
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
            <Link href="/how-it-works" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              How it works
            </Link>
            <Link href="/pricing" className="text-sm font-semibold text-slate-900 transition-colors">
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
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
          Simple, transparent pricing
        </h1>
        <p className="text-lg sm:text-xl text-slate-500 font-medium mt-6 max-w-xl mx-auto leading-relaxed">
          No hidden agency markups. Pay for the intelligent reasoning engine directly.
        </p>
      </section>

      {/* Pricing cards */}
      <section className="py-12 px-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free plan */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-2">Free Plan</div>
            <div className="text-5xl font-extrabold text-slate-900">₹0</div>
            <p className="text-slate-400 text-sm mt-2">Perfect for exploring and casual weekend plans</p>
            
            <hr className="my-6 border-slate-100" />
            
            <ul className="space-y-4">
              <li className="flex items-center text-sm font-medium text-slate-600">
                <Check className="w-4.5 h-4.5 text-slate-400 mr-3 shrink-0" />
                1 Saved Trip at a time
              </li>
              <li className="flex items-center text-sm font-medium text-slate-600">
                <Check className="w-4.5 h-4.5 text-slate-400 mr-3 shrink-0" />
                Standard AI Destination matching
              </li>
              <li className="flex items-center text-sm font-medium text-slate-600">
                <Check className="w-4.5 h-4.5 text-slate-400 mr-3 shrink-0" />
                Basic Day-wise Itinerary
              </li>
              <li className="flex items-center text-sm font-medium text-slate-600">
                <Check className="w-4.5 h-4.5 text-slate-400 mr-3 shrink-0" />
                Community support
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <Link href="/plan" className="w-full inline-flex items-center justify-center border border-slate-200 text-slate-700 font-bold py-3 rounded-full hover:bg-slate-50 transition-all">
              Get Started
            </Link>
          </div>
        </div>

        {/* Pro plan */}
        <div className="bg-white rounded-3xl p-8 border-2 border-indigo-600 shadow-[0_15px_40px_rgba(79,70,229,0.1)] flex flex-col justify-between relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1 rounded-full flex items-center gap-1.5 shadow-md shadow-indigo-100">
            <Sparkles className="w-3 h-3 fill-white/20" /> Most Popular
          </div>
          
          <div>
            <div className="text-indigo-600 font-bold uppercase text-xs tracking-wider mb-2">Pro Traveler</div>
            <div className="text-5xl font-extrabold text-slate-900">₹499<span className="text-slate-400 text-base font-semibold">/trip</span></div>
            <p className="text-slate-500 text-sm mt-2">For serious travelers wanting optimized confidence layouts</p>
            
            <hr className="my-6 border-slate-100" />
            
            <ul className="space-y-4">
              <li className="flex items-center text-sm font-semibold text-slate-700">
                <Check className="w-4.5 h-4.5 text-indigo-600 mr-3 shrink-0" />
                Unlimited dynamic itineraries
              </li>
              <li className="flex items-center text-sm font-semibold text-slate-700">
                <Check className="w-4.5 h-4.5 text-indigo-600 mr-3 shrink-0" />
                Structured Gemini 2.5 Pro outputs
              </li>
              <li className="flex items-center text-sm font-semibold text-slate-700">
                <Check className="w-4.5 h-4.5 text-indigo-600 mr-3 shrink-0" />
                Contestable AI re-evaluation dashboard
              </li>
              <li className="flex items-center text-sm font-semibold text-slate-700">
                <Check className="w-4.5 h-4.5 text-indigo-600 mr-3 shrink-0" />
                Priority 24/7 travel desk support
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <Link href="/plan" className="w-full inline-flex items-center justify-center bg-indigo-600 text-white font-bold py-3 rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 hover:scale-[1.02]">
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 py-24 px-6 border-t border-slate-100 mt-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">Pricing FAQs</h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-slate-800 mb-2">Can I cancel my plan?</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Yes, Pro trips are purchased on a per-trip generation basis. There are no recurring monthly subscription commitments.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-2">Why charge in INR?</h3>
              <p className="text-slate-500 text-sm leading-relaxed">We localize pricing in Indian Rupees to save you foreign transaction charges and offer standard regional payment methods.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 bg-slate-50 text-center text-sm font-medium text-slate-400">
        Built for Prompt Wars 2026 🏆 | TripMind Inc.
      </footer>
    </main>
  );
}
