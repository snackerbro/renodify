"use client";

import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const toSnake = (s: string) => s.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);

/** Best-effort persistence of a dashboard entity to its Supabase table (RLS-scoped). */
export async function writeEntity(
  table: string,
  row: Record<string, unknown>,
  vendorId: string,
): Promise<void> {
  if (!hasSupabaseEnv) return;
  try {
    const supabase = createClient();
    const mapped: Record<string, unknown> = { vendor_id: vendorId };
    Object.entries(row).forEach(([k, v]) => {
      if (k === "vendorId") return;
      mapped[toSnake(k)] = v;
    });
    await supabase.from(table).upsert(mapped);
  } catch {
    /* keep local state; surfacing is handled by the caller's UI */
  }
}

export async function deleteEntity(table: string, id: string): Promise<void> {
  if (!hasSupabaseEnv) return;
  try {
    const supabase = createClient();
    await supabase.from(table).delete().eq("id", id);
  } catch {
    /* ignore */
  }
}
