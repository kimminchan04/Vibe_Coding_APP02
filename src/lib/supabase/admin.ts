import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/env/server";

export function createAdminClient() {
  const { supabaseUrl, supabaseServiceRoleKey } = getServerEnv();

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
