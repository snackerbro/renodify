import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { PLAN_BY_KEY } from "@/lib/constants";
import type { Plan, Subscription } from "@/lib/types";

export async function getSubscriptionForVendor(
  vendorId: string,
): Promise<Subscription | null> {
  if (!hasSupabaseEnv) {
    const tier = PLAN_BY_KEY["silver"];
    return {
      id: "demo-sub",
      vendorId,
      plan: "silver",
      enquiriesIncluded: tier.enquiriesPerMonth,
      enquiriesUsed: 6,
      renewsOn: "2026-07-21",
      status: "active",
    };
  }
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("vendor_id", vendorId)
      .maybeSingle();
    if (!data) return null;
    return {
      id: data.id,
      vendorId: data.vendor_id,
      plan: data.plan,
      enquiriesIncluded: data.enquiries_included,
      enquiriesUsed: data.enquiries_used,
      renewsOn: data.renews_on,
      stripeCustomerId: data.stripe_customer_id,
      stripeSubscriptionId: data.stripe_subscription_id,
      status: data.status,
    };
  } catch {
    return null;
  }
}

/** Upsert a subscription from a Stripe event (service-role, bypasses RLS). */
export async function upsertSubscriptionFromStripe(args: {
  vendorId: string;
  plan: Plan;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: string;
  renewsOn: string | null;
}) {
  const admin = createAdminClient();
  const included = PLAN_BY_KEY[args.plan]?.enquiriesPerMonth ?? 0;
  await admin.from("subscriptions").upsert(
    {
      vendor_id: args.vendorId,
      plan: args.plan,
      enquiries_included: included,
      stripe_customer_id: args.stripeCustomerId,
      stripe_subscription_id: args.stripeSubscriptionId,
      status: args.status,
      renews_on: args.renewsOn,
    },
    { onConflict: "vendor_id" },
  );
  await admin.from("vendors").update({ plan: args.plan }).eq("id", args.vendorId);
}
