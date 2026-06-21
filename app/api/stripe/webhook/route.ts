import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, hasStripeEnv } from "@/lib/stripe/client";
import { upsertSubscriptionFromStripe } from "@/lib/services/subscriptions";
import type { Plan } from "@/lib/types";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

// Stripe needs the raw body to verify the signature.
export async function POST(request: Request) {
  if (!hasStripeEnv || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const sig = request.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const raw = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (e) {
    console.error("Webhook signature verification failed", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const vendorId = s.metadata?.vendorId || s.client_reference_id || "";
        const plan = (s.metadata?.plan as Plan) || "basic";
        if (vendorId && s.subscription) {
          const sub = await stripe.subscriptions.retrieve(s.subscription as string);
          await upsertSubscriptionFromStripe({
            vendorId,
            plan,
            stripeCustomerId: (s.customer as string) || "",
            stripeSubscriptionId: sub.id,
            status: sub.status,
            renewsOn: new Date(
              (sub as unknown as { current_period_end: number }).current_period_end * 1000,
            )
              .toISOString()
              .slice(0, 10),
          });
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const vendorId = (sub.metadata?.vendorId as string) || "";
        const plan = (sub.metadata?.plan as Plan) || "basic";
        if (vendorId) {
          await upsertSubscriptionFromStripe({
            vendorId,
            plan,
            stripeCustomerId: (sub.customer as string) || "",
            stripeSubscriptionId: sub.id,
            status: sub.status,
            renewsOn: new Date(
              (sub as unknown as { current_period_end: number }).current_period_end * 1000,
            )
              .toISOString()
              .slice(0, 10),
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("Webhook handler error", e);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
