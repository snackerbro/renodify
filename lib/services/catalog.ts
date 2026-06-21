import "server-only";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { CATEGORIES } from "@/lib/constants";
import { SAMPLE_VENDORS } from "@/lib/sample-data";
import { EVENTS_SORTED, EVENT_BY_SLUG } from "@/lib/events";
import type { Category, Vendor, VendorDetail } from "@/lib/types";
import {
  mapDeal,
  mapEvent,
  mapOutlet,
  mapPastWork,
  mapReview,
  mapService,
  mapVendor,
} from "./mappers";

export interface VendorFilter {
  category?: string;
  propertyType?: string;
  area?: string;
  query?: string;
}

function filterSample(vendors: Vendor[], f: VendorFilter): Vendor[] {
  return vendors.filter((v) => {
    if (f.category && v.categorySlug !== f.category) return false;
    if (f.propertyType && !v.propertyTypes.includes(f.propertyType as never)) return false;
    if (f.area && !v.areas.includes(f.area)) return false;
    if (f.query) {
      const q = f.query.toLowerCase();
      if (!`${v.name} ${v.category}`.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

/** Categories with live vendor counts. */
export async function getCategoriesWithCounts(): Promise<Category[]> {
  if (!hasSupabaseEnv) {
    return CATEGORIES.map((c) => ({
      ...c,
      vendorCount: SAMPLE_VENDORS.filter((v) => v.categorySlug === c.slug).length,
    }));
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("vendors").select("category_slug");
    if (error) throw error;
    const counts = new Map<string, number>();
    (data ?? []).forEach((r: { category_slug: string }) =>
      counts.set(r.category_slug, (counts.get(r.category_slug) ?? 0) + 1),
    );
    return CATEGORIES.map((c) => ({ ...c, vendorCount: counts.get(c.slug) ?? 0 }));
  } catch {
    return CATEGORIES.map((c) => ({ ...c, vendorCount: 0 }));
  }
}

export async function getVendors(filter: VendorFilter = {}): Promise<Vendor[]> {
  if (!hasSupabaseEnv) return filterSample(SAMPLE_VENDORS, filter);
  try {
    const supabase = await createClient();
    let q = supabase.from("vendors").select("*").order("rating_avg", { ascending: false });
    if (filter.category) q = q.eq("category_slug", filter.category);
    if (filter.propertyType) q = q.contains("property_types", [filter.propertyType]);
    if (filter.area) q = q.contains("areas", [filter.area]);
    if (filter.query) q = q.ilike("name", `%${filter.query}%`);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []).map(mapVendor);
  } catch {
    return filterSample(SAMPLE_VENDORS, filter);
  }
}

export async function getPopularVendors(limit = 3): Promise<Vendor[]> {
  const all = await getVendors();
  return all.slice(0, limit);
}

export async function getVendorBySlug(slug: string): Promise<VendorDetail | null> {
  if (!hasSupabaseEnv) {
    return SAMPLE_VENDORS.find((v) => v.slug === slug) ?? null;
  }
  try {
    const supabase = await createClient();
    const { data: v, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error || !v) throw error ?? new Error("not found");
    const vendorId = v.id;
    const [outlets, services, deals, events, pastWork, reviews] = await Promise.all([
      supabase.from("outlets").select("*").eq("vendor_id", vendorId),
      supabase.from("services").select("*").eq("vendor_id", vendorId),
      supabase.from("deals").select("*").eq("vendor_id", vendorId),
      supabase.from("events").select("*").eq("vendor_id", vendorId).order("date"),
      supabase.from("past_work").select("*").eq("vendor_id", vendorId),
      supabase.from("reviews").select("*").eq("vendor_id", vendorId).order("created_at", { ascending: false }),
    ]);
    return {
      ...mapVendor(v),
      outlets: (outlets.data ?? []).map(mapOutlet),
      services: (services.data ?? []).map(mapService),
      deals: (deals.data ?? []).map(mapDeal),
      events: (events.data ?? []).map(mapEvent),
      pastWork: (pastWork.data ?? []).map(mapPastWork),
      reviews: (reviews.data ?? []).map(mapReview),
    };
  } catch {
    return SAMPLE_VENDORS.find((v) => v.slug === slug) ?? null;
  }
}

export async function getVendorById(id: string): Promise<VendorDetail | null> {
  if (!hasSupabaseEnv) return SAMPLE_VENDORS.find((v) => v.id === id) ?? null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("vendors").select("slug").eq("id", id).single();
    if (error || !data) throw error ?? new Error("not found");
    return getVendorBySlug(data.slug);
  } catch {
    return null;
  }
}

export async function getAllVendorSlugs(): Promise<string[]> {
  if (!hasSupabaseEnv) return SAMPLE_VENDORS.map((v) => v.slug);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("vendors").select("slug");
    if (error) throw error;
    return (data ?? []).map((r: { slug: string }) => r.slug);
  } catch {
    return SAMPLE_VENDORS.map((v) => v.slug);
  }
}

// Events are curated editorial content (see lib/events.ts), with images hosted
// in our Supabase Storage. Re-exported here so existing imports keep working.
export type { SiteEvent } from "@/lib/events";

export async function getEvents() {
  return EVENTS_SORTED;
}

export async function getEventBySlug(slug: string) {
  return EVENT_BY_SLUG[slug] ?? null;
}

export interface DealItem {
  vendorSlug: string;
  vendorName: string;
  category: string;
  deal: string;
}

export async function getDeals(): Promise<DealItem[]> {
  const vendors = await getVendors();
  return vendors
    .filter((v) => v.deal)
    .map((v) => ({
      vendorSlug: v.slug,
      vendorName: v.name,
      category: v.category,
      deal: v.deal as string,
    }));
}

export interface SearchResults {
  categories: Category[];
  vendors: Vendor[];
}

export async function searchAll(query: string): Promise<SearchResults> {
  const q = query.trim().toLowerCase();
  const cats = await getCategoriesWithCounts();
  const vendors = await getVendors(q ? { query: q } : {});
  return {
    categories: q ? cats.filter((c) => c.label.toLowerCase().includes(q)) : [],
    vendors,
  };
}
