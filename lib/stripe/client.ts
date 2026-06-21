import "server-only";
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY || "";

export const hasStripeEnv = Boolean(key);

/**
 * Lazily-created Stripe client. Throws if called without STRIPE_SECRET_KEY so
 * missing config fails loudly in the API route rather than silently.
 */
export function getStripe(): Stripe {
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it in .env.local / Vercel env. See SETUP.md.",
    );
  }
  return new Stripe(key);
}

export function priceIdForPlan(plan: "basic" | "silver" | "gold"): string | undefined {
  const map: Record<string, string | undefined> = {
    basic: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC,
    silver: process.env.NEXT_PUBLIC_STRIPE_PRICE_SILVER,
    gold: process.env.NEXT_PUBLIC_STRIPE_PRICE_GOLD,
  };
  return map[plan];
}
