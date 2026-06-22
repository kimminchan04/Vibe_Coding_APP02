import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv } from "@/lib/env/public";

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getPublicEnv();

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
