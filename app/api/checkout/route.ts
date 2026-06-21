import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validators";
import { getStripe, hasStripeEnv, priceIdForPlan } from "@/lib/stripe/client";
import { getCurrentProfile } from "@/lib/services/account";
import { SITE_URL } from "@/lib/constants";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 422 });
  }
  const { plan } = parsed.data;

  // Require a signed-in vendor.
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  if (profile.role !== "vendor") {
    return NextResponse.json(
      { error: "A vendor account is required to subscribe." },
      { status: 403 },
    );
  }

  if (!hasStripeEnv) {
    return NextResponse.json(
      { error: "Billing is not configured yet. Add Stripe keys (see SETUP.md)." },
      { status: 503 },
    );
  }

  const priceId = priceIdForPlan(plan);
  if (!priceId) {
    return NextResponse.json(
      { error: `Missing Stripe price ID for the ${plan} plan.` },
      { status: 503 },
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: profile.email || undefined,
      client_reference_id: profile.vendorId || profile.id,
      metadata: { plan, vendorId: profile.vendorId || "", profileId: profile.id },
      success_url: `${SITE_URL}/subscription-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/list-your-business`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout failed", e);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }
}
