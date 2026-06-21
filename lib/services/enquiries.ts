import "server-only";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { Enquiry } from "@/lib/types";
import type { EnquiryInput } from "@/lib/validators";
import { SAMPLE_VENDORS } from "@/lib/sample-data";

/** Create an enquiry from the Get-Quotes flow and fan it out to matched vendors. */
export async function createEnquiry(input: EnquiryInput): Promise<{ id: string }> {
  if (!hasSupabaseEnv) {
    // No DB configured yet — accept the enquiry so the flow completes in demo mode.
    return { id: "demo-enquiry" };
  }
  const supabase = await createClient();

  // Resolve target vendor ids: explicit vendors, else all vendors in the chosen categories.
  let vendorIds: string[] = [];
  if (input.vendorSlugs.length) {
    const { data } = await supabase
      .from("vendors")
      .select("id")
      .in("slug", input.vendorSlugs);
    vendorIds = (data ?? []).map((r: { id: string }) => r.id);
  } else if (input.categories.length) {
    const { data } = await supabase
      .from("vendors")
      .select("id")
      .in("category_slug", input.categories);
    vendorIds = (data ?? []).map((r: { id: string }) => r.id);
  }

  const { data: enquiry, error } = await supabase
    .from("enquiries")
    .insert({
      homeowner_name: input.name,
      homeowner_contact: input.contact,
      property_type: input.propertyType,
      categories: input.categories,
      budget: input.budget,
      timeline: input.timeline,
      message: input.message,
      status: "new",
    })
    .select("id")
    .single();
  if (error || !enquiry) throw error ?? new Error("Failed to create enquiry");

  if (vendorIds.length) {
    await supabase.from("enquiry_vendors").insert(
      vendorIds.map((vid) => ({ enquiry_id: enquiry.id, vendor_id: vid })),
    );
  }
  return { id: enquiry.id };
}

function demoEnquiries(): Enquiry[] {
  return [
    {
      id: "e1",
      homeownerName: "Priya S.",
      homeownerContact: "+65 9012 3456",
      propertyType: "Condo",
      categories: ["blinds"],
      budget: "S$2,000 – S$5,000",
      timeline: "Within 1 month",
      message: "Looking for motorised blinds for 3 bedrooms and living room.",
      vendorIds: [SAMPLE_VENDORS[0].id],
      status: "new",
      createdAt: "2026-06-18",
    },
    {
      id: "e2",
      homeownerName: "Marcus L.",
      homeownerContact: "marcus@example.sg",
      propertyType: "HDB",
      categories: ["blinds"],
      budget: "Under S$2,000",
      timeline: "1 – 3 months",
      message: "Roller blinds for a 4-room flat. What's the lead time?",
      vendorIds: [SAMPLE_VENDORS[0].id],
      status: "replied",
      createdAt: "2026-06-10",
    },
  ];
}

export async function listEnquiriesForCustomer(): Promise<Enquiry[]> {
  // Demo data until auth + DB link enquiries to a homeowner account.
  if (!hasSupabaseEnv) return demoEnquiries();
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (data ?? []).map((r: any) => ({
      id: r.id,
      homeownerName: r.homeowner_name,
      homeownerContact: r.homeowner_contact,
      propertyType: r.property_type,
      categories: r.categories ?? [],
      budget: r.budget,
      timeline: r.timeline,
      message: r.message,
      vendorIds: [],
      status: r.status,
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}

export async function listEnquiriesForVendor(vendorId: string): Promise<Enquiry[]> {
  if (!hasSupabaseEnv) return demoEnquiries();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("enquiry_vendors")
      .select("enquiries(*)")
      .eq("vendor_id", vendorId);
    if (error) throw error;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (data ?? [])
      .map((row: any) => row.enquiries)
      .filter(Boolean)
      .map((r: any) => ({
        id: r.id,
        homeownerName: r.homeowner_name,
        homeownerContact: r.homeowner_contact,
        propertyType: r.property_type,
        categories: r.categories ?? [],
        budget: r.budget,
        timeline: r.timeline,
        message: r.message,
        vendorIds: [vendorId],
        status: r.status,
        createdAt: r.created_at,
      }));
  } catch {
    return [];
  }
}
