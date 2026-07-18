import { NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  getSupabaseServer,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      connected: false,
      message: "Supabase env vars not configured",
    });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ connected: false, message: "Server client unavailable" });
  }

  try {
    const { error } = await supabase.from("trips").select("id").limit(1);
    if (error) {
      return NextResponse.json({ connected: false, message: error.message });
    }

    const authClient = await createSupabaseServerClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    return NextResponse.json({
      connected: true,
      authenticated: Boolean(user),
      userEmail: user?.email ?? null,
    });
  } catch (err) {
    return NextResponse.json({
      connected: false,
      message: err instanceof Error ? err.message : "Connection failed",
    });
  }
}
