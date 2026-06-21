import type { DayHours, VendorDetail, VendorEvent } from "./types";
import { DAYS } from "./constants";

// Sample content so the site renders fully before Supabase is connected.
// Replace by seeding the database (supabase/migrations/0002_seed.sql).

function hours(from = "09:00", to = "18:00", closed: string[] = ["Sun"]): DayHours[] {
  return DAYS.map((day) => ({
    day,
    open: !closed.includes(day),
    from,
    to: day === "Sat" ? "14:00" : to,
  }));
}

const base = (v: Partial<VendorDetail> & {
  slug: string;
  name: string;
  categorySlug: string;
  category: string;
}): VendorDetail => ({
  id: v.slug,
  ownerId: null,
  areas: ["Islandwide"],
  propertyTypes: ["HDB", "Condo"],
  logoUrl: null,
  coverUrl: null,
  whatsapp: "+65 8123 4567",
  phone: "+65 6123 4567",
  location: "Singapore",
  email: "hello@example.sg",
  plan: "silver",
  verified: false,
  ratingAvg: 4.7,
  reviewCount: 42,
  yearsInBusiness: 8,
  responseRate: 94,
  priceFrom: "S$280",
  deal: null,
  unclaimed: false,
  about:
    "An established Singapore specialist trusted by homeowners across HDB and condo renovations. Get a fast, no-obligation quote.",
  outlets: [
    {
      id: `${v.slug}-o1`,
      vendorId: v.slug,
      name: "Main Showroom",
      address: "12 Tai Seng Street, #03-08, Singapore 534118",
      phone: "+65 6123 4567",
      hours: hours(),
    },
  ],
  services: [
    {
      id: `${v.slug}-s1`,
      vendorId: v.slug,
      kind: "Service",
      icon: v.category ? "sliders" : "sliders",
      name: "Site measurement & consultation",
      price: "Free",
      unit: "per visit",
      description: "On-site measurement and recommendation for your unit.",
      features: ["Same-week appointment", "Islandwide", "No obligation"],
    },
    {
      id: `${v.slug}-s2`,
      vendorId: v.slug,
      kind: "Product",
      icon: "tag",
      name: "Premium installation package",
      price: "S$680",
      unit: "from",
      description: "Supply and professional installation with workmanship warranty.",
      features: ["2-year warranty", "Certified installers"],
    },
  ],
  deals: [],
  events: [],
  pastWork: [
    {
      id: `${v.slug}-p1`,
      vendorId: v.slug,
      title: "4-room BTO at Tengah",
      category: v.category,
      location: "Tengah",
      year: "2024",
      description: "Full supply and install completed in 3 days.",
    },
  ],
  reviews: [
    {
      id: `${v.slug}-r1`,
      vendorId: v.slug,
      authorName: "Wei Ling",
      rating: 5,
      text: "Responsive and tidy. Highly recommend for HDB owners.",
      createdAt: "2025-03-12",
    },
    {
      id: `${v.slug}-r2`,
      vendorId: v.slug,
      authorName: "Daniel T.",
      rating: 4,
      text: "Good price and finishing. Slight delay but kept me updated.",
      createdAt: "2025-01-08",
    },
  ],
  ...v,
});

export const SAMPLE_VENDORS: VendorDetail[] = [
  base({
    slug: "shadeworks-blinds",
    name: "ShadeWorks Blinds",
    categorySlug: "blinds",
    category: "Blinds",
    ratingAvg: 4.8,
    reviewCount: 86,
    deal: "10% off motorised",
    priceFrom: "S$180",
    propertyTypes: ["HDB", "Condo", "Landed"],
  }),
  base({
    slug: "dripfold-curtains",
    name: "DripFold Curtains",
    categorySlug: "curtains",
    category: "Curtains",
    ratingAvg: 4.6,
    reviewCount: 51,
    priceFrom: "S$220",
  }),
  base({
    slug: "safeview-grilles",
    name: "SafeView Invisible Grilles",
    categorySlug: "invisible-grilles",
    category: "Invisible Grilles",
    ratingAvg: 4.9,
    reviewCount: 120,
    deal: "Free installation",
    priceFrom: "S$25/ft",
  }),
  base({
    slug: "coolbreeze-aircon",
    name: "CoolBreeze Aircon",
    categorySlug: "aircon-servicing",
    category: "Aircon Servicing",
    ratingAvg: 4.5,
    reviewCount: 210,
    priceFrom: "S$40",
    areas: ["Central", "East"],
  }),
  base({
    slug: "planklab-flooring",
    name: "PlankLab Flooring",
    categorySlug: "flooring",
    category: "Flooring",
    ratingAvg: 4.7,
    reviewCount: 64,
    priceFrom: "S$4.50/sqft",
  }),
  base({
    slug: "brightwire-electrical",
    name: "BrightWire Electrical",
    categorySlug: "electrical",
    category: "Electrical",
    ratingAvg: 4.4,
    reviewCount: 38,
    priceFrom: "S$90",
    plan: "basic",
  }),
  base({
    slug: "nestsmart-home",
    name: "NestSmart Home",
    categorySlug: "smart-home",
    category: "Smart Home",
    ratingAvg: 4.8,
    reviewCount: 47,
    priceFrom: "S$350",
    plan: "gold",
  }),
  base({
    slug: "sealtight-waterproofing",
    name: "SealTight Waterproofing",
    categorySlug: "waterproofing",
    category: "Waterproofing",
    ratingAvg: 4.6,
    reviewCount: 29,
    priceFrom: "S$450",
  }),
  base({
    slug: "lumen-lighting",
    name: "Lumen Lighting Studio",
    categorySlug: "lighting",
    category: "Lighting",
    ratingAvg: 4.9,
    reviewCount: 73,
    deal: "Bundle discount",
    priceFrom: "S$60",
  }),
  base({
    slug: "freshfold-laundry",
    name: "FreshFold Laundry Systems",
    categorySlug: "laundry-systems",
    category: "Laundry Systems",
    ratingAvg: 4.3,
    reviewCount: 18,
    priceFrom: "S$520",
    unclaimed: true,
    plan: null,
  }),
];

export const SAMPLE_EVENTS: (VendorEvent & { slug: string; description: string })[] = [
  {
    id: "evt-1",
    slug: "renovation-expo-2026",
    vendorId: "shadeworks-blinds",
    type: "Expo",
    title: "Singapore Renovation & Reno Expo 2026",
    role: "Exhibitor",
    date: "2026-07-18",
    location: "Suntec Convention Centre, Halls 401–403",
    description:
      "Three days of renovation deals, live demos and free consultations from Renodify-listed vendors across blinds, flooring, smart home and more.",
  },
  {
    id: "evt-2",
    slug: "bto-furnishing-fair",
    vendorId: "planklab-flooring",
    type: "Fair",
    title: "BTO Furnishing Fair",
    role: "Exhibitor",
    date: "2026-08-09",
    location: "Singapore Expo, Hall 5",
    description:
      "Tailored for new BTO owners — group-buy pricing on flooring, curtains, grilles and lighting.",
  },
  {
    id: "evt-3",
    slug: "smart-living-roadshow",
    vendorId: "nestsmart-home",
    type: "Roadshow",
    title: "Smart Living Roadshow",
    role: "Exhibitor",
    date: "2026-09-20",
    location: "VivoCity, Level 1 Atrium",
    description: "Hands-on smart home demos and special installation bundles.",
  },
];
