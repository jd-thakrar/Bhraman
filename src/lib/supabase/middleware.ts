import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // ── Route Protection ──────────────────────────────────────────────────────
  
  // 1. Admin Protection
  if (path.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    // Check role in profiles
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
        
      if (error || !profile || profile.role !== "admin") {
        return NextResponse.redirect(new URL("/plan", request.url));
      }
    } catch {
      // Fallback: If database is not setup yet, redirect to plan
      return NextResponse.redirect(new URL("/plan", request.url));
    }
  }

  // 2. Customer Plan Page Protection
  if (path.startsWith("/plan")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    // Redirect admin trying to access plan page to admin dashboard
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
        
      if (profile?.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } catch {}
  }

  // 3. Login Protection: Redirect logged-in users away from /login
  if (path === "/login") {
    if (user) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
          
        if (profile?.role === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url));
        } else {
          return NextResponse.redirect(new URL("/plan", request.url));
        }
      } catch {
        return NextResponse.redirect(new URL("/plan", request.url));
      }
    }
  }

  return supabaseResponse;
}
