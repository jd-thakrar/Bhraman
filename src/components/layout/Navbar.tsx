"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plane } from "lucide-react";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface NavbarProps {
  children?: React.ReactNode;
  sticky?: boolean;
}

export function Navbar({ children, sticky = true }: NavbarProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserEmail(user?.email ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header
      className={`${sticky ? "sticky top-0 z-50" : ""} bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.06]`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white font-semibold text-lg tracking-tight"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Plane className="w-4 h-4 text-white -rotate-45" />
          </div>
          TripMind
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/my-trips"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            My Trips
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {children}
          {userEmail ? (
            <Link
              href="/my-trips"
              className="hidden sm:inline text-xs font-medium text-zinc-400 hover:text-white bg-white/[0.06] px-3 py-1.5 rounded-full truncate max-w-[140px]"
            >
              {userEmail}
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/plan"
            className="inline-flex items-center justify-center bg-sky-500 hover:bg-sky-400 text-white rounded-full px-4 py-2 text-sm font-semibold transition-all shadow-lg shadow-sky-500/25"
          >
            Plan Trip
          </Link>
        </div>
      </div>
    </header>
  );
}

export function StatusBadge({
  children,
  variant = "success",
}: {
  children: React.ReactNode;
  variant?: "success" | "warning" | "info" | "neutral";
}) {
  const styles = {
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    info: "bg-sky-500/15 text-sky-400 border-sky-500/20",
    neutral: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

export function FlightyCard({
  children,
  className = "",
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: "green" | "blue" | "amber" | "none";
}) {
  const accentBorder = {
    green: "border-l-emerald-500",
    blue: "border-l-sky-500",
    amber: "border-l-amber-500",
    none: "",
  };

  return (
    <div
      className={`bg-[#141419] rounded-2xl border border-white/[0.06] ${accent ? `border-l-[3px] ${accentBorder[accent]}` : ""} ${className}`}
    >
      {children}
    </div>
  );
}
