"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plane, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to plan
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push("/plan");
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (err) throw err;
        setMessage("✓ Check your email for a verification link.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        router.push("/plan");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F] flex flex-col">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <header className="relative z-10 border-b border-white/[0.06] px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-tight">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Plane className="w-4 h-4 text-indigo-400 -rotate-45" />
          </div>
          <span className="text-white">Bhraman</span>
        </Link>
      </header>

      {/* Auth Card */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">
              {isSignUp ? "Create account" : "Welcome back"}
            </h1>
            <p className="text-white/40 text-sm font-medium">
              {isSignUp ? "Start planning your perfect Indian trip" : "Sign in to continue your journey"}
            </p>
          </div>

          <div className="bg-[#12141A] border border-white/[0.07] rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold rounded-xl p-3">
                  {error}
                </div>
              )}
              {message && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold rounded-xl p-3">
                  {message}
                </div>
              )}

              <div className="space-y-1">
                <label className="label-muted block mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#1A1C24] border border-white/[0.08] text-white placeholder-white/20 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="label-muted block mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1A1C24] border border-white/[0.08] text-white placeholder-white/20 rounded-xl pl-10 pr-10 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>{isSignUp ? "Create Account" : "Sign In"} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-white/30 font-medium mt-6">
            {isSignUp ? "Already have an account?" : "New to Bhraman?"}{" "}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
              className="text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer transition-colors"
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </p>

          {/* Continue without login */}
          <div className="text-center mt-4">
            <Link href="/plan" className="text-xs text-white/20 hover:text-white/40 transition-colors font-medium">
              Continue without account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
