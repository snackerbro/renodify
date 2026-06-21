import "server-only";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { Profile } from "@/lib/types";

/** The signed-in user's profile, or null when signed out / not configured. */
export async function getCurrentProfile(): Promise<Profile | null> {
  if (!hasSupabaseEnv) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (!data) {
      return { id: user.id, role: "homeowner", email: user.email ?? "" };
    }
    return {
      id: data.id,
      role: data.role,
      email: data.email ?? user.email ?? "",
      fullName: data.full_name ?? undefined,
      vendorId: data.vendor_id ?? null,
    };
  } catch {
    return null;
  }
}
