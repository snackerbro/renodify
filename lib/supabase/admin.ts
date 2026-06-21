import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "./env";

/**
 * Service-role Supabase client — BYPASSES Row-Level Security.
 * Server-only. Use exclusively for trusted privileged operations such as
 * Stripe webhook handling and admin tasks. Never import into client code.
 */
export function createAdminClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
