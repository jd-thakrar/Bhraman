"use client";

import Link from "next/link";
import { Plane, ArrowRight, Check, Sparkles } from "lucide-react";

export default function Pricing() {
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
            <Link href="/how-it-works" className="text-sm font-medium text-white/50 hover:text-white transition-colors">How it works</Link>
            <Link href="/pricing" className="text-sm font-medium text-white transition-colors">Pricing</Link>
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
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
          Simple, transparent pricing
        </h1>
        <p className="text-lg sm:text-xl text-white/40 font-medium mt-6 max-w-xl mx-auto leading-relaxed">
          No hidden agency markups. Pay for the intelligent reasoning engine directly.
        </p>
      </section>

      {/* Pricing cards */}
      <section className="relative z-10 py-12 px-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free plan */}
        <div className="bg-[#12141A] rounded-3xl p-8 border border-white/[0.07] shadow-2xl flex flex-col justify-between">
          <div>
            <div className="text-white/30 font-bold uppercase text-xs tracking-wider mb-2">Free Plan</div>
            <div className="text-5xl font-black text-white">₹0</div>
            <p className="text-white/40 text-sm mt-2">Perfect for exploring and casual weekend plans</p>
            
            <hr className="my-6 border-white/[0.06]" />
            
            <ul className="space-y-4">
              <li className="flex items-center text-sm font-medium text-white/60">
                <Check className="w-4.5 h-4.5 text-indigo-400 mr-3 shrink-0" />
                1 Saved Trip at a time
              </li>
              <li className="flex items-center text-sm font-medium text-white/60">
                <Check className="w-4.5 h-4.5 text-indigo-400 mr-3 shrink-0" />
                Standard AI Destination matching
              </li>
              <li className="flex items-center text-sm font-medium text-white/60">
                <Check className="w-4.5 h-4.5 text-indigo-400 mr-3 shrink-0" />
                Basic Day-wise Itinerary
              </li>
              <li className="flex items-center text-sm font-medium text-white/60">
                <Check className="w-4.5 h-4.5 text-indigo-400 mr-3 shrink-0" />
                Community support
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <Link href="/plan" className="w-full inline-flex items-center justify-center border border-white/10 text-white/70 font-bold py-3 rounded-full hover:bg-white/5 transition-all">
              Get Started
            </Link>
          </div>
        </div>

        {/* Pro plan */}
        <div className="bg-[#12141A] rounded-3xl p-8 border-2 border-indigo-500 shadow-2xl flex flex-col justify-between relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1 rounded-full flex items-center gap-1.5 shadow-md shadow-indigo-500/20">
            <Sparkles className="w-3 h-3 fill-white/20" /> Most Popular
          </div>
          
          <div>
            <div className="text-indigo-400 font-bold uppercase text-xs tracking-wider mb-2">Pro Traveler</div>
            <div className="text-5xl font-black text-white">₹499<span className="text-white/30 text-base font-semibold">/trip</span></div>
            <p className="text-white/40 text-sm mt-2">For serious travelers wanting optimized confidence layouts</p>
            
            <hr className="my-6 border-white/[0.06]" />
            
            <ul className="space-y-4">
              <li className="flex items-center text-sm font-semibold text-[#F0F2F8]">
                <Check className="w-4.5 h-4.5 text-indigo-400 mr-3 shrink-0" />
                Unlimited dynamic itineraries
              </li>
              <li className="flex items-center text-sm font-semibold text-[#F0F2F8]">
                <Check className="w-4.5 h-4.5 text-indigo-400 mr-3 shrink-0" />
                Structured Gemini 2.5 Pro outputs
              </li>
              <li className="flex items-center text-sm font-semibold text-[#F0F2F8]">
                <Check className="w-4.5 h-4.5 text-indigo-400 mr-3 shrink-0" />
                Contestable AI re-evaluation dashboard
              </li>
              <li className="flex items-center text-sm font-semibold text-[#F0F2F8]">
                <Check className="w-4.5 h-4.5 text-indigo-400 mr-3 shrink-0" />
                Priority 24/7 travel desk support
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <Link href="/plan" className="w-full inline-flex items-center justify-center bg-indigo-500 text-white font-bold py-3 rounded-full hover:bg-indigo-400 transition-all shadow-md shadow-indigo-500/20 hover:scale-[1.02]">
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 bg-[#12141A] py-24 px-6 border-t border-white/[0.06] mt-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-white mb-12">Pricing FAQs</h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-white mb-2">Can I cancel my plan?</h3>
              <p className="text-white/40 text-sm leading-relaxed">Yes, Pro trips are purchased on a per-trip generation basis. There are no recurring monthly subscription commitments.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Why charge in INR?</h3>
              <p className="text-white/40 text-sm leading-relaxed">We localize pricing in Indian Rupees to save you foreign transaction charges and offer standard regional payment methods.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-12 border-t border-white/[0.06] bg-[#0A0B0F] text-center text-sm font-medium text-white/20">
        Built for Prompt Wars 2026 🏆 | Bhraman Inc.
      </footer>
    </main>
  );
}
