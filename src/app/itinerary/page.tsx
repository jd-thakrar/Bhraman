"use client";

import { useState, useEffect } from "react";
import { GOA_MOCK_DATA } from "@/data/mockData";
import { TripChatWidget } from "@/components/trip-chat-widget";
import Link from "next/link";
import { Plane, Home, Utensils, Activity, ArrowLeft, Check, Compass, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ItineraryPage() {
  const [data, setData] = useState<any>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem("currentItinerary");
    try { setData(stored ? JSON.parse(stored) : GOA_MOCK_DATA); }
    catch { setData(GOA_MOCK_DATA); }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  const { itinerary, budget, packing_list, destination, hotels } = data;

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F] pb-32">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0A0B0F]/80 backdrop-blur-xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-base">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Plane className="w-4 h-4 text-indigo-400 -rotate-45" />
          </div>
          <span className="text-white">Bhraman</span>
        </Link>
        <Link href="/plan/compare" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full mb-4">
            <Compass className="w-3.5 h-3.5" /> AI-Optimised Itinerary
          </div>
          <h1 className="text-4xl font-black text-white mb-2">{destination}</h1>
          <p className="text-white/40 font-medium text-sm">
            {hotels?.[0]?.name} · {itinerary?.length} days · ₹{budget?.total?.toLocaleString()} total
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <div className="label-muted mb-6">Day-by-Day Plan</div>
            <div className="relative border-l border-white/[0.06] ml-3 space-y-10">
              {itinerary?.map((day: any) => (
                <div key={day.day} className="relative pl-8">
                  {/* Day dot */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-[#0A0B0F] shadow-lg shadow-indigo-500/30" />
                  <div className="label-muted mb-1">Day {day.day}</div>
                  <h3 className="text-xl font-black text-white mb-4">{day.title}</h3>
                  <div className="space-y-2">
                    {day.activities?.map((act: any, i: number) => (
                      <div key={i} className="bg-[#12141A] border border-white/[0.06] rounded-xl px-4 py-3 flex gap-4 items-start">
                        <span className="text-xs font-bold text-indigo-400 w-14 shrink-0 mt-0.5 font-mono">{act.time}</span>
                        <span className="text-sm text-white/70 font-medium leading-relaxed">{act.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Card — Flighty style with big number */}
            <div className="bg-[#12141A] border border-white/[0.07] rounded-2xl p-5">
              <div className="label-muted mb-4">Total Budget</div>
              <div className="text-5xl font-black text-white mb-1">
                ₹{budget?.total?.toLocaleString()}
              </div>
              <div className="text-xs text-green-400 font-bold mb-6 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Optimally priced
              </div>
              <div className="space-y-3">
                {[
                  { icon: Plane, label: "Flights", value: budget?.flights },
                  { icon: Home, label: "Hotel", value: budget?.accommodation },
                  { icon: Utensils, label: "Food", value: budget?.food },
                  { icon: Activity, label: "Activities", value: budget?.activities },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-t border-white/[0.05]">
                    <div className="flex items-center gap-2 text-sm text-white/40 font-medium">
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </div>
                    <div className="text-sm font-bold text-white/70">₹{value?.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Packing Checklist */}
            <div className="bg-[#12141A] border border-white/[0.07] rounded-2xl p-5">
              <div className="label-muted mb-4">Smart Packing List</div>
              <div className="space-y-5">
                {packing_list?.map((cat: any, ci: number) => (
                  <div key={ci}>
                    <div className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wider">{cat.category}</div>
                    <div className="space-y-2">
                      {cat.items?.map((item: string) => (
                        <button
                          key={item}
                          onClick={() => toggleCheck(item)}
                          className="w-full flex items-center gap-3 text-left group"
                        >
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                            checkedItems.has(item)
                              ? "bg-indigo-500 border-indigo-500"
                              : "border-white/[0.12] group-hover:border-indigo-500/40"
                          }`}>
                            {checkedItems.has(item) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className={`text-sm font-medium transition-colors ${
                            checkedItems.has(item) ? "text-white/20 line-through" : "text-white/60"
                          }`}>{item}</span>
                        </button>
                      ))}
                    </div>
                    {ci < packing_list.length - 1 && <Separator className="bg-white/[0.05] mt-4" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Widget */}
      <TripChatWidget itinerary={data} />
    </div>
  );
}
