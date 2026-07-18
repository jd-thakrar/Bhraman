"use client";

import { useState, useEffect } from "react";
import { GOA_MOCK_DATA } from "@/data/mockData";
import { Plane, Home, Utensils, Activity, ArrowLeft, Check, Compass } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CountingNumber } from "@/components/ui/counting-number";
import Link from "next/link";

export default function ItineraryPage() {
  const [itineraryData, setItineraryData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('currentItinerary');
    if (stored) {
      try {
        setItineraryData(JSON.parse(stored));
      } catch (e) {
        setItineraryData(GOA_MOCK_DATA);
      }
    } else {
      setItineraryData(GOA_MOCK_DATA);
    }
  }, []);

  if (!itineraryData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Compass className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
        <span className="text-slate-500 font-bold">Loading itinerary details...</span>
      </div>
    );
  }

  const { itinerary, budget, packing_list, destination } = itineraryData;

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100">
      {/* Nav */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/85 backdrop-blur-md border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 text-slate-900 font-bold text-lg tracking-tight">
          <Plane className="w-5 h-5 text-indigo-600 -rotate-45" />
          TripMind
        </Link>
        <Link href="/plan/compare" className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to comparison
        </Link>
      </div>

      <div className="max-w-5xl mx-auto p-6 sm:p-12 pb-32">
        {/* Header */}
        <header className="mb-16 text-center sm:text-left">
          <div className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700 mb-4">
            <Compass className="w-3.5 h-3.5 mr-1.5 text-indigo-600 animate-spin" />
            AI-Optimized Journey Plan
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Your {destination} Trip
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
            Every route and accommodation choice has been mathematically audited for comfort and cost performance.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Timeline */}
          <div className="lg:col-span-2 space-y-8">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Day-by-Day Journey Map</div>
            
            <div className="relative border-l-2 border-indigo-100 ml-4 space-y-12 pb-12">
              {itinerary.map((day: any, idx: number) => (
                <div key={idx} className="relative pl-10">
                  <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-indigo-600 border-4 border-white shadow-sm" />
                  
                  <div className="mb-6">
                    <span className="text-indigo-600 font-bold text-xs tracking-widest uppercase mb-1 block">
                      Day {day.day}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{day.title}</h3>
                  </div>

                  <div className="space-y-3">
                    {day.activities.map((activity: any, aIdx: number) => (
                      <div key={aIdx} className="bg-white rounded-2xl p-5 flex gap-4 items-start border border-slate-100 shadow-sm">
                        <div className="w-16 shrink-0 text-slate-400 font-bold text-sm mt-0.5">
                          {activity.time}
                        </div>
                        <div className="text-slate-700 font-semibold text-[15px] leading-relaxed flex-1">
                          {activity.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Budget */}
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Budget Estimate</div>
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Total Cost</div>
                    <div className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                      <CountingNumber value={budget.total} prefix="₹" />
                    </div>
                  </div>
                  <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-100">
                    Optimal
                  </div>
                </div>
                
                <div className="space-y-4 text-sm font-semibold">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-slate-500"><Plane className="w-4 h-4 mr-3 text-slate-400" /> Flights</div>
                    <div className="text-slate-900 font-bold">₹{budget.flights.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-slate-500"><Home className="w-4 h-4 mr-3 text-slate-400" /> Hotel</div>
                    <div className="text-slate-900 font-bold">₹{budget.accommodation.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-slate-500"><Utensils className="w-4 h-4 mr-3 text-slate-400" /> Food</div>
                    <div className="text-slate-900 font-bold">₹{budget.food.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-slate-500"><Activity className="w-4 h-4 mr-3 text-slate-400" /> Activities</div>
                    <div className="text-slate-900 font-bold">₹{budget.activities.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Packing List */}
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Smart Packing Checklist</div>
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                {packing_list.map((category: any, cIdx: number) => (
                  <div key={cIdx}>
                    <h4 className="text-indigo-600 text-xs font-bold mb-3 uppercase tracking-wider">{category.category}</h4>
                    <ul className="space-y-3">
                      {category.items.map((item: string, iIdx: number) => (
                        <li key={iIdx} className="flex items-center text-slate-700 text-sm font-semibold">
                          <div className="w-5 h-5 rounded-lg border border-slate-200 bg-white mr-3 flex-shrink-0 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer">
                            <Check className="w-3.5 h-3.5 text-transparent hover:text-indigo-600 transition-colors" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    {cIdx < packing_list.length - 1 && <Separator className="bg-slate-100 mt-5" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
