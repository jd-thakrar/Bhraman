import { NextResponse } from "next/server";
import { createSupabaseServerClient, getSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const authClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ trips: [], authenticated: Boolean(user) });
  }

  let query = supabase
    .from("trips")
    .select("id, destination, status, selected_hotel, created_at, preferences")
    .order("created_at", { ascending: false })
    .limit(20);

  if (user) {
    query = query.eq("user_id", user.id);
  } else {
    return NextResponse.json({ trips: [], authenticated: false });
  }

  const { data: trips, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ trips: trips ?? [], authenticated: true });
}
