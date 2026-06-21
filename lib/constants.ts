import type { Category, PlanTier, PropertyType } from "./types";

export const SITE_NAME = "Renodify";
export const SITE_TAGLINE = "You found your ID. Now find everyone else.";
export const SITE_DESCRIPTION =
  "Renodify is Singapore's directory for every renovation vendor you need after your interior designer — blinds, curtains, invisible grilles, aircon, flooring, smart home and more. Free for homeowners.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const PROPERTY_TYPES: PropertyType[] = ["HDB", "Condo", "Landed"];

export const SG_AREAS = [
  "Central",
  "East",
  "West",
  "North",
  "North-East",
  "Islandwide",
];

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

// 21 specialist categories — alphabetical A→Z, each mapped to an icon name
// from the Renodify icon set (lib/icons.ts).
export const CATEGORIES: Category[] = [
  { id: "aircon-servicing", slug: "aircon-servicing", label: "Aircon Servicing", icon: "aircon" },
  { id: "awnings", slug: "awnings", label: "Awnings", icon: "awning" },
  { id: "blinds", slug: "blinds", label: "Blinds", icon: "blinds" },
  { id: "carpentry", slug: "carpentry", label: "Carpentry", icon: "carpentry" },
  { id: "ceiling-fans", slug: "ceiling-fans", label: "Ceiling Fans", icon: "fan" },
  { id: "cleaning-services", slug: "cleaning-services", label: "Cleaning Services", icon: "cleaning" },
  { id: "curtains", slug: "curtains", label: "Curtains", icon: "curtains" },
  { id: "doors-gates", slug: "doors-gates", label: "Doors & Gates", icon: "door" },
  { id: "electrical", slug: "electrical", label: "Electrical", icon: "electrical" },
  { id: "feng-shui", slug: "feng-shui", label: "Feng Shui", icon: "fengshui" },
  { id: "flooring", slug: "flooring", label: "Flooring", icon: "flooring" },
  { id: "furniture", slug: "furniture", label: "Furniture", icon: "furniture" },
  { id: "invisible-grilles", slug: "invisible-grilles", label: "Invisible Grilles", icon: "grille" },
  { id: "laundry-systems", slug: "laundry-systems", label: "Laundry Systems", icon: "laundry" },
  { id: "lighting", slug: "lighting", label: "Lighting", icon: "lighting" },
  { id: "painting", slug: "painting", label: "Painting", icon: "painting" },
  { id: "smart-home", slug: "smart-home", label: "Smart Home", icon: "smartHome" },
  { id: "sound-systems", slug: "sound-systems", label: "Sound Systems", icon: "soundSystem" },
  { id: "wallpaper", slug: "wallpaper", label: "Wallpaper", icon: "wallpaper" },
  { id: "water-filters", slug: "water-filters", label: "Water Filters", icon: "waterFilter" },
  { id: "waterproofing", slug: "waterproofing", label: "Waterproofing", icon: "waterproofing" },
];

export const CATEGORY_BY_SLUG = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
);

// Vendor subscription plans (priced by enquiries/month).
export const PLAN_TIERS: PlanTier[] = [
  {
    plan: "basic",
    name: "Basic",
    price: 199,
    enquiriesPerMonth: 15,
    priceEnvKey: "NEXT_PUBLIC_STRIPE_PRICE_BASIC",
    features: [
      "Claimed listing with logo",
      "Up to 15 enquiries / month",
      "Manage services & opening hours",
      "WhatsApp & call buttons",
    ],
  },
  {
    plan: "silver",
    name: "Silver",
    price: 349,
    enquiriesPerMonth: 40,
    popular: true,
    priceEnvKey: "NEXT_PUBLIC_STRIPE_PRICE_SILVER",
    features: [
      "Everything in Basic",
      "Up to 40 enquiries / month",
      "Promotions & deals",
      "Events & past-work gallery",
      "Priority placement in category",
    ],
  },
  {
    plan: "gold",
    name: "Gold",
    price: 599,
    enquiriesPerMonth: 120,
    priceEnvKey: "NEXT_PUBLIC_STRIPE_PRICE_GOLD",
    features: [
      "Everything in Silver",
      "Up to 120 enquiries / month",
      "Top placement & homepage feature",
      "Multiple outlets",
      "Renodify Verified (when live)",
    ],
  },
];

export const PLAN_BY_KEY = Object.fromEntries(PLAN_TIERS.map((t) => [t.plan, t]));

export const BUDGET_OPTIONS = [
  "Under S$2,000",
  "S$2,000 – S$5,000",
  "S$5,000 – S$10,000",
  "S$10,000 – S$20,000",
  "Above S$20,000",
];

export const TIMELINE_OPTIONS = [
  "ASAP",
  "Within 1 month",
  "1 – 3 months",
  "3 – 6 months",
  "Just exploring",
];
