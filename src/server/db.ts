// 서버 전용. service role 키는 RLS를 우회하므로 브라우저 번들에 절대 들어가면 안 된다.
// 프레임워크 무관 모듈(Next/React import 금지) — NestJS 이전 대상.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

export function db(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (server env, no NEXT_PUBLIC_ prefix)");
  }
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
