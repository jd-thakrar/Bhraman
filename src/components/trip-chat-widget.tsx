"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Send, X, MessageSquare, Loader2, Sparkles, Zap } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  "My flight is delayed 2 hours 😩",
  "I'm exhausted, simplify tomorrow",
  "Suggest a good local restaurant nearby",
  "What if it rains today?",
  "I want to skip the morning activity",
  "Add a spa session to Day 2",
];

export function TripChatWidget({ itinerary }: { itinerary: any }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: `Hey! I'm your live trip assistant for ${itinerary?.destination || "your trip"}. Plans changed? Flight delayed? Feeling tired? Just tell me — I'll fix it. 🧠`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          itinerary,
          chatHistory: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.reply, timestamp: new Date() }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I'm having a moment. Try again!", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-5 py-3 rounded-full shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
      >
        <Zap className="w-4 h-4" />
        <span className="text-sm">Trip Assistant</span>
        {messages.length > 1 && (
          <span className="bg-white text-indigo-600 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
            {messages.filter(m => m.role === 'ai').length - 1}
          </span>
        )}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[580px] flex flex-col bg-[#12141A] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0D0E14]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white leading-none">Trip Assistant</div>
                  <div className="text-[10px] text-green-400 font-semibold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                    Live · Gemini AI
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white transition-colors p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={msg.role === "user" ? "chat-user" : "chat-ai"}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="chat-ai flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span className="text-white/40 text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-3 py-2 border-t border-white/[0.05] flex gap-1.5 overflow-x-auto scrollbar-hide">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="shrink-0 text-[11px] font-semibold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/[0.06] px-3 py-1.5 rounded-full transition-all whitespace-nowrap"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/[0.06]">
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex items-center gap-2 bg-[#1A1C24] border border-white/[0.07] rounded-xl px-3 py-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="My flight got delayed..."
                  className="flex-1 bg-transparent text-white placeholder-white/20 text-sm font-medium focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-30 rounded-lg flex items-center justify-center transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
