"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plane, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, UserCheck, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "admin">("customer");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto redirect if already logged in based on role
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        if (profile?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/plan");
        }
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        // Sign up user
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (authErr) throw authErr;

        if (authData?.user) {
          // Create role-based profile
          const { error: profileErr } = await supabase
            .from("profiles")
            .upsert({
              id: authData.user.id,
              email,
              role: role,
            });
          if (profileErr) console.error("Profile creation error:", profileErr);
        }

        setMessage("✓ Account created! You can now sign in.");
        setIsSignUp(false);
      } else {
        // Sign in user
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authErr) throw authErr;

        if (authData?.user) {
          // Fetch user profile role
          const { data: profile, error: profileErr } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", authData.user.id)
            .single();

          if (profileErr || !profile) {
            // Create a default profile if missing
            await supabase.from("profiles").upsert({
              id: authData.user.id,
              email,
              role: "customer"
            });
            router.push("/plan");
          } else if (profile.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/plan");
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F] flex flex-col justify-between relative overflow-hidden">
      {/* Ambient background blur */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[30%] w-[600px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[30%] w-[600px] h-[500px] bg-violet-600/8 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06] px-6 h-14 flex items-center justify-between bg-[#0A0B0F]/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-tight">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Plane className="w-4 h-4 text-indigo-400 -rotate-45" />
          </div>
          <span className="text-white">Bhraman</span>
        </Link>
      </header>

      {/* Auth Main Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black text-white tracking-tight mb-2"
            >
              {isSignUp ? "Create an Account" : "Access Portal"}
            </motion.h1>
            <p className="text-white/40 text-sm font-medium">
              Unified role-based portal for Customers & Administrators
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#12141A]/90 border border-white/[0.08] rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl p-3.5 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              {message && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-xl p-3.5 flex items-start gap-2">
                  <UserCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{message}</span>
                </div>
              )}

              {/* Role Picker for Sign Up */}
              {isSignUp && (
                <div className="space-y-2">
                  <label className="label-muted block">Select Role</label>
                  <div className="grid grid-cols-2 gap-2 bg-[#1A1C24] p-1 rounded-xl border border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => setRole("customer")}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        role === "customer" 
                          ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("admin")}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        role === "admin" 
                          ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      Administrator
                    </button>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="label-muted block mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-[#1A1C24] border border-white/[0.08] text-white placeholder-white/25 rounded-xl pl-10.5 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="label-muted block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1A1C24] border border-white/[0.08] text-white placeholder-white/25 rounded-xl pl-10.5 pr-10 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 shadow-lg shadow-indigo-500/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>{isSignUp ? "Register Account" : "Access Console"} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </motion.div>

          <p className="text-center text-sm text-white/30 font-medium mt-6">
            {isSignUp ? "Already registered?" : "Need workspace access?"}{" "}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
              className="text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer transition-colors"
            >
              {isSignUp ? "Sign In" : "Register"}
            </button>
          </p>

          <div className="text-center mt-4">
            <Link href="/plan" className="text-xs text-white/20 hover:text-white/40 transition-colors font-medium">
              Continue as Guest Client →
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/[0.05] py-6 text-center text-xs text-white/20 font-medium z-10">
        Bhraman Secure Role-Based authentication framework.
      </footer>
    </div>
  );
}
