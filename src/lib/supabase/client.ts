import { createBrowserClient } from "@supabase/ssr";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Singleton client to avoid warning/performance penalties
let clientInstance: SupabaseClient | null = null;

function getClientInstance(): SupabaseClient {
  if (!clientInstance) {
    if (typeof window === "undefined") {
      clientInstance = createClient(supabaseUrl, supabaseAnonKey);
    } else {
      clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
    }
  }
  return clientInstance;
}

export const supabase = getClientInstance();

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function createSupabaseBrowserClient(): SupabaseClient {
  return supabase;
}
