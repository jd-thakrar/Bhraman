import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function createSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return browserClient;
}

/** @deprecated Use createSupabaseBrowserClient() — kept for existing imports */
export const supabase = {
  get auth() {
    const client = createSupabaseBrowserClient();
    if (!client) {
      throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }
    return client.auth;
  },
  from(table: string) {
    const client = createSupabaseBrowserClient();
    if (!client) {
      throw new Error("Supabase is not configured.");
    }
    return client.from(table);
  },
};
