import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { emailMatchesVendorDomain, hostFromUrl } from "@/lib/domain";

/**
 * Claim an unclaimed vendor listing for the signed-in user.
 * Uses the service-role client (after verifying auth) because the row's
 * owner_id is currently null, so the RLS owner policy can't authorise it yet.
 */
export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  const { slug } = await request.json().catch(() => ({}));
  if (!slug) return NextResponse.json({ error: "Missing vendor" }, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const admin = createAdminClient();

  const { data: vendor, error } = await admin
    .from("vendors")
    .select("id, owner_id, unclaimed, website, name")
    .eq("slug", slug)
    .single();
  if (error || !vendor) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  if (vendor.owner_id && vendor.owner_id !== user.id) {
    return NextResponse.json({ error: "This listing is already claimed." }, { status: 409 });
  }

  // Ownership verification: the signed-in email's domain must match the
  // listing's website domain (the OTP already proved control of that inbox).
  const vendorHost = hostFromUrl(vendor.website);
  if (!vendorHost) {
    return NextResponse.json(
      { error: "This listing can't be self-claimed yet. Contact us to verify ownership." },
      { status: 403 },
    );
  }
  if (!emailMatchesVendorDomain(user.email, vendor.website)) {
    return NextResponse.json(
      {
        error: `To claim ${vendor.name}, sign in with a company email at @${vendorHost} (we emailed a code to verify it).`,
        requiredDomain: vendorHost,
      },
      { status: 403 },
    );
  }

  // Link the listing to this user.
  await admin
    .from("vendors")
    .update({ owner_id: user.id, unclaimed: false })
    .eq("id", vendor.id);

  // Point the profile at the claimed vendor and ensure vendor role.
  await admin
    .from("profiles")
    .update({ role: "vendor", vendor_id: vendor.id })
    .eq("id", user.id);

  // Remove the empty auto-created placeholder vendor from sign-up, if any.
  await admin
    .from("vendors")
    .delete()
    .eq("owner_id", user.id)
    .neq("id", vendor.id)
    .like("slug", "vendor-%");

  return NextResponse.json({ ok: true, vendorId: vendor.id });
}
