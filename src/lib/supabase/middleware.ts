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

  // Check bypass cookie
  const bypassCookie = request.cookies.get("bhraman_bypass_session")?.value;
  let user: any = null;
  let userRole = "customer";

  if (bypassCookie) {
    try {
      const parsed = JSON.parse(bypassCookie);
      user = { id: parsed.id, email: parsed.email };
      userRole = parsed.role;
    } catch {}
  }

  if (!user) {
    const { data: authData } = await supabase.auth.getUser();
    user = authData?.user;
    
    if (user) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile) userRole = profile.role;
      } catch {}
    }
  }

  // Force admin role for the hardcoded admin email
  if (user && user.email?.toLowerCase().trim() === "chiragthakrardk@gmail.com") {
    userRole = "admin";
  }

  const path = request.nextUrl.pathname;

  // ── Route Protection ──────────────────────────────────────────────────────
  
  // 1. Admin Protection
  if (path.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/plan", request.url));
    }
  }

  // 2. Customer Plan Page Protection
  if (path.startsWith("/plan")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // 3. Login Protection: Redirect logged-in users away from /login
  if (path === "/login") {
    if (user) {
      if (user.email?.toLowerCase().trim() === "chiragthakrardk@gmail.com") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
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
