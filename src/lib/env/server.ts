import { getPublicEnv } from "@/lib/env/public";

/** 서버 전용 환경변수 (.env.local — API Route, Server Action, RSC) */
export function getServerEnv() {
  const publicEnv = getPublicEnv();

  return {
    ...publicEnv,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "",
    daejinCafeteriaUrl: process.env.DAEJIN_CAFETERIA_URL?.trim() ?? "",
    openaiApiKey: process.env.OPENAI_API_KEY?.trim() ?? "",
  };
}

export function hasSupabaseServerEnv() {
  const { supabaseUrl, supabaseAnonKey } = getServerEnv();
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function hasSupabaseAdminEnv() {
  const { supabaseUrl, supabaseServiceRoleKey } = getServerEnv();
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}
