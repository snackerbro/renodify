// SEO content hub — structured guide articles. Stored as typed data so we keep
// full control of metadata + JSON-LD (Article / BreadcrumbList / FAQPage).

export interface GuideBlock {
  type: "p" | "ul" | "ol" | "quote" | "h3";
  text?: string;
  items?: string[];
}

export interface GuideSection {
  id: string;
  heading: string;
  blocks: GuideBlock[];
}

export interface Guide {
  slug: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  category: string; // related category slug for CTA
  categoryLabel: string;
  standfirst: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  authorBio: string;
  readMins: number;
  takeaways: string[];
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  relatedSlugs: string[];
  featured?: boolean;
  coverUrl?: string;
}

export const GUIDES: Guide[] = [
  {
    slug: "after-your-id-what-to-sort-next",
    title: "After your interior designer: what to sort next",
    metaDescription:
      "You've confirmed your ID — here's the renovation checklist of specialists most Singapore homeowners still need to arrange themselves, and when to book each.",
    keywords: ["after interior designer", "renovation checklist singapore", "what to do after ID"],
    category: "blinds",
    categoryLabel: "Blinds",
    standfirst:
      "Your interior designer handles the big build. But a surprising number of essentials sit outside most ID packages. Here's what to line up — and the right order to do it.",
    datePublished: "2026-02-10",
    author: "Renodify Editorial",
    authorBio: "The Renodify team writes practical, Singapore-specific renovation guides for homeowners.",
    readMins: 6,
    featured: true,
    coverUrl:
      "https://slsjihcxunpnzduamthp.supabase.co/storage/v1/object/public/site-images/guides/after-your-id-what-to-sort-next.jpg",
    takeaways: [
      "Many finishings — blinds, grilles, smart home — are outside a standard ID scope.",
      "Book site-measured items (blinds, grilles, curtains) only after carpentry is up.",
      "Aircon and electrical rough-in must be planned before tiling and false ceilings close up.",
    ],
    sections: [
      {
        id: "whats-not-included",
        heading: "What your ID usually doesn't cover",
        blocks: [
          {
            type: "p",
            text: "Interior design packages in Singapore typically cover hacking, masonry, carpentry, painting and basic electrical. The rest is often left to you — and that's where homeowners get caught out near handover.",
          },
          {
            type: "ul",
            items: [
              "Window dressings — blinds and curtains",
              "Invisible grilles for windows and balconies",
              "Aircon supply and installation (sometimes separate)",
              "Smart home — locks, lighting control, cameras",
              "Awnings, ceiling fans, water filters and laundry systems",
            ],
          },
        ],
      },
      {
        id: "the-right-order",
        heading: "The right order to book",
        blocks: [
          {
            type: "ol",
            items: [
              "Confirm aircon and electrical points before ceilings and tiling close up.",
              "Waterproofing and flooring next, while the unit is still empty.",
              "Carpentry and painting — your ID's core scope.",
              "Site-measured items last: blinds, curtains and invisible grilles need final wall and window positions.",
            ],
          },
          {
            type: "quote",
            text: "Measure-to-install items should always come after carpentry — a 5cm shift in a feature wall changes every blind dimension.",
          },
        ],
      },
      {
        id: "use-renodify",
        heading: "How Renodify helps",
        blocks: [
          {
            type: "p",
            text: "Renodify is the directory for everyone your ID doesn't bring. Browse vetted specialists by category, compare ratings and opening hours, and send one quote request to the right vendors for your property type.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Does my interior designer arrange blinds and grilles?",
        a: "Usually not. Blinds, curtains and invisible grilles are commonly excluded from ID packages and arranged directly by the homeowner — which is exactly what Renodify is for.",
      },
      {
        q: "When should I book site-measured items?",
        a: "After carpentry is installed. Final wall and window positions can shift during the build, and measure-to-install items must reflect the as-built dimensions.",
      },
      {
        q: "Is Renodify free for homeowners?",
        a: "Yes. Browsing, comparing and requesting quotes is always free for homeowners. Vendors pay a subscription to receive enquiries.",
      },
    ],
    relatedSlugs: ["motorised-blinds-hdb", "invisible-grilles-condo", "aircon-btu-sizing"],
  },
  {
    slug: "motorised-blinds-hdb",
    coverUrl:
      "https://slsjihcxunpnzduamthp.supabase.co/storage/v1/object/public/site-images/guides/motorised-blinds-hdb.jpg",
    title: "Motorised blinds for HDB flats: a 2026 buyer's guide",
    metaDescription:
      "Everything Singapore HDB owners need to know about motorised blinds — power options, costs, battery vs wired, and how to plan installation around your renovation.",
    keywords: ["motorised blinds hdb", "smart blinds singapore", "automated blinds cost"],
    category: "blinds",
    categoryLabel: "Blinds",
    standfirst:
      "Motorised blinds have dropped in price and are now a realistic HDB upgrade. Here's how to choose, budget and plan installation.",
    datePublished: "2026-01-22",
    author: "Renodify Editorial",
    authorBio: "The Renodify team writes practical, Singapore-specific renovation guides for homeowners.",
    readMins: 7,
    takeaways: [
      "Battery-powered motors avoid extra wiring and suit most HDB retrofits.",
      "Plan a concealed power point during renovation if you want wired motors.",
      "Expect S$250–S$600 per window depending on fabric and motor brand.",
    ],
    sections: [
      {
        id: "power-options",
        heading: "Battery vs wired motors",
        blocks: [
          {
            type: "p",
            text: "The biggest decision is power. Rechargeable battery motors are the simplest retrofit — no wiring, charge every few months. Wired motors are tidier and never need charging but require a concealed power point planned during renovation.",
          },
          {
            type: "ul",
            items: [
              "Battery: easiest retrofit, ideal if renovation is already done",
              "Wired: cleanest finish, plan the power point before false ceiling closes",
              "Solar top-up: useful for sun-facing windows",
            ],
          },
        ],
      },
      {
        id: "cost",
        heading: "What it costs in Singapore",
        blocks: [
          {
            type: "p",
            text: "As a 2026 rule of thumb, budget S$250–S$600 per motorised window depending on fabric grade, blind type (roller, honeycomb, zebra) and motor brand. Whole-flat packages often come with bundle pricing.",
          },
        ],
      },
      {
        id: "planning",
        heading: "Planning around your renovation",
        blocks: [
          {
            type: "ol",
            items: [
              "If you want wired motors, tell your electrician before ceilings close.",
              "Book site measurement after carpentry and window grilles are in.",
              "Confirm hub/app compatibility if integrating with smart home.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: "Do motorised blinds need an electrician?",
        a: "Only wired motors do. Battery motors are a plug-and-charge retrofit and need no electrical work.",
      },
      {
        q: "Can motorised blinds work with smart home apps?",
        a: "Many do — look for motors supporting your ecosystem (e.g. via a bridge/hub). Confirm compatibility before ordering.",
      },
      {
        q: "How much do motorised blinds cost in an HDB flat?",
        a: "Around S$250–S$600 per window in 2026, with bundle discounts for whole-flat orders.",
      },
    ],
    relatedSlugs: ["after-your-id-what-to-sort-next", "invisible-grilles-condo"],
  },
  {
    slug: "invisible-grilles-condo",
    coverUrl:
      "https://slsjihcxunpnzduamthp.supabase.co/storage/v1/object/public/site-images/guides/invisible-grilles-condo.jpg",
    title: "Invisible grilles for condos: safety, rules and cost",
    metaDescription:
      "A guide to invisible grilles for Singapore condos — MCST approval, cable spacing, child safety, materials and typical pricing per foot.",
    keywords: ["invisible grilles condo", "invisible grille singapore", "balcony grille mcst"],
    category: "invisible-grilles",
    categoryLabel: "Invisible Grilles",
    standfirst:
      "Invisible grilles keep the view while adding safety. For condos, approval and cable spec matter — here's what to check.",
    datePublished: "2026-02-02",
    author: "Renodify Editorial",
    authorBio: "The Renodify team writes practical, Singapore-specific renovation guides for homeowners.",
    readMins: 6,
    takeaways: [
      "Check MCST rules before installing on condo balconies and windows.",
      "Tighter cable spacing (under ~7cm) is safer for young children.",
      "Marine-grade 316 stainless steel resists Singapore's humidity best.",
    ],
    sections: [
      {
        id: "rules",
        heading: "Condo approval and rules",
        blocks: [
          {
            type: "p",
            text: "Most condos require MCST approval for anything attached to the building façade or balcony. Ask your management for the approved spec — colour, cable type and fixing method — before booking.",
          },
        ],
      },
      {
        id: "safety",
        heading: "Child and pet safety",
        blocks: [
          {
            type: "ul",
            items: [
              "Cable spacing under ~7cm for homes with young children",
              "316 marine-grade stainless steel for corrosion resistance",
              "Aluminium track quality affects long-term smoothness",
            ],
          },
        ],
      },
      {
        id: "cost",
        heading: "Typical pricing",
        blocks: [
          {
            type: "p",
            text: "Invisible grilles are usually priced per square foot or running foot. Budget roughly S$18–S$30 per foot in 2026 depending on cable grade, spacing and warranty.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Do I need MCST approval for invisible grilles in a condo?",
        a: "Usually yes for balconies and façade-facing windows. Check your condo's by-laws and approved specifications first.",
      },
      {
        q: "What cable spacing is safe for children?",
        a: "Spacing under about 7cm is generally recommended for homes with young children. Confirm with your installer.",
      },
      {
        q: "What material lasts longest in Singapore?",
        a: "316 marine-grade stainless steel resists humidity and salt air better than 304, making it the safer long-term choice.",
      },
    ],
    relatedSlugs: ["motorised-blinds-hdb", "after-your-id-what-to-sort-next"],
  },
  {
    slug: "aircon-btu-sizing",
    coverUrl:
      "https://slsjihcxunpnzduamthp.supabase.co/storage/v1/object/public/site-images/guides/aircon-btu-sizing.jpg",
    title: "Aircon BTU sizing for Singapore homes",
    metaDescription:
      "How to size your aircon correctly in Singapore — BTU per room, system types, and why oversizing wastes money. A practical sizing guide for HDB and condo.",
    keywords: ["aircon btu singapore", "aircon sizing hdb", "how many btu bedroom"],
    category: "aircon-servicing",
    categoryLabel: "Aircon Servicing",
    standfirst:
      "The wrong BTU rating means high bills or a room that never cools. Here's how to size aircon for Singapore conditions.",
    datePublished: "2026-01-15",
    author: "Renodify Editorial",
    authorBio: "The Renodify team writes practical, Singapore-specific renovation guides for homeowners.",
    readMins: 5,
    takeaways: [
      "Roughly 400–600 BTU per square metre for Singapore's climate.",
      "Oversized units short-cycle, cooling poorly and running humid.",
      "Match the system (multi-split) to total indoor load and ledge space.",
    ],
    sections: [
      {
        id: "rule-of-thumb",
        heading: "A simple BTU rule of thumb",
        blocks: [
          {
            type: "p",
            text: "For Singapore's heat and humidity, a common starting point is 400–600 BTU per square metre of room area, adjusting up for sun-facing rooms, large windows or high occupancy.",
          },
          {
            type: "ul",
            items: [
              "Small bedroom (~9 sqm): ~9,000 BTU",
              "Master bedroom (~14 sqm): ~12,000 BTU",
              "Living/dining (~24 sqm): ~18,000–24,000 BTU",
            ],
          },
        ],
      },
      {
        id: "system-match",
        heading: "Matching the system",
        blocks: [
          {
            type: "p",
            text: "Most flats use a multi-split system — one outdoor condenser serving several indoor units. The condenser must handle the combined load and fit your aircon ledge. An installer will confirm the right combination.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "How many BTU do I need for an HDB bedroom?",
        a: "A typical bedroom needs about 9,000 BTU; a master bedroom around 12,000 BTU, adjusted for sun exposure and window size.",
      },
      {
        q: "Is a bigger aircon always better?",
        a: "No. Oversized units short-cycle — they cool the air fast then switch off before removing humidity, leaving the room cold but clammy and wasting energy.",
      },
    ],
    relatedSlugs: ["when-to-waterproof", "after-your-id-what-to-sort-next"],
  },
  {
    slug: "flooring-vinyl-tile-spc",
    coverUrl:
      "https://slsjihcxunpnzduamthp.supabase.co/storage/v1/object/public/site-images/guides/flooring-vinyl-tile-spc.jpg",
    title: "Flooring in Singapore: vinyl vs tile vs SPC",
    metaDescription:
      "Compare vinyl, tile and SPC flooring for Singapore homes — water resistance, comfort, cost and resale. Pick the right floor for HDB and condo renovations.",
    keywords: ["spc flooring singapore", "vinyl vs tile", "best flooring hdb"],
    category: "flooring",
    categoryLabel: "Flooring",
    standfirst:
      "Three popular floors, three very different trade-offs. Here's how vinyl, tile and SPC compare for Singapore homes.",
    datePublished: "2026-02-18",
    author: "Renodify Editorial",
    authorBio: "The Renodify team writes practical, Singapore-specific renovation guides for homeowners.",
    readMins: 6,
    takeaways: [
      "Tile is the most durable and water-resistant but hardest underfoot.",
      "SPC is a rigid, waterproof click floor that installs over most surfaces.",
      "Vinyl is the most budget-friendly but least resistant to heavy wear.",
    ],
    sections: [
      {
        id: "comparison",
        heading: "Quick comparison",
        blocks: [
          {
            type: "ul",
            items: [
              "Tile: most durable, fully water-resistant, cold and hard, higher install cost",
              "SPC: rigid waterproof core, warm-ish, fast click install, mid price",
              "Vinyl (LVT): softest underfoot, lowest cost, less scratch/dent resistant",
            ],
          },
        ],
      },
      {
        id: "moisture",
        heading: "Moisture and Singapore humidity",
        blocks: [
          {
            type: "p",
            text: "All three handle humidity, but standing water is the test. Tile and SPC shrug off spills; glue-down vinyl can lift over time in wet zones. For kitchens and yards, prioritise water resistance.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Is SPC flooring good for HDB?",
        a: "Yes — SPC is rigid, waterproof and installs quickly over existing screed, making it popular for HDB renovations.",
      },
      {
        q: "Which flooring is cheapest?",
        a: "Vinyl (LVT) is usually the most budget-friendly upfront, though tile and SPC can offer better longevity.",
      },
    ],
    relatedSlugs: ["when-to-waterproof", "post-reno-cleaning"],
  },
  {
    slug: "when-to-waterproof",
    coverUrl:
      "https://slsjihcxunpnzduamthp.supabase.co/storage/v1/object/public/site-images/guides/when-to-waterproof.jpg",
    title: "When to waterproof during a renovation",
    metaDescription:
      "Waterproofing timing matters. Learn when to waterproof bathrooms, kitchens and balconies during a Singapore renovation — and why redoing it later is costly.",
    keywords: ["waterproofing singapore", "bathroom waterproofing", "when to waterproof renovation"],
    category: "waterproofing",
    categoryLabel: "Waterproofing",
    standfirst:
      "Waterproofing is hidden but critical. Do it at the wrong time and you'll be hacking finished tiles to fix leaks.",
    datePublished: "2026-01-30",
    author: "Renodify Editorial",
    authorBio: "The Renodify team writes practical, Singapore-specific renovation guides for homeowners.",
    readMins: 5,
    takeaways: [
      "Waterproof after hacking and screeding, before tiling.",
      "Always test with a water ponding test before finishes go on.",
      "Wet areas — bathrooms, kitchen, yard, balcony — are non-negotiable.",
    ],
    sections: [
      {
        id: "timing",
        heading: "The right moment",
        blocks: [
          {
            type: "ol",
            items: [
              "Hacking and removal of old finishes",
              "Screeding to set falls toward drains",
              "Waterproofing membrane applied and cured",
              "Water ponding test (typically 24–48 hours)",
              "Tiling only after the test passes",
            ],
          },
        ],
      },
      {
        id: "why",
        heading: "Why timing is everything",
        blocks: [
          {
            type: "quote",
            text: "Fixing a missed waterproofing layer after tiling means hacking finished surfaces — often 5–10× the original cost.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Should waterproofing be done before or after tiling?",
        a: "Before. The membrane goes on after screeding and must pass a ponding test before any tiles are laid.",
      },
      {
        q: "What is a ponding test?",
        a: "Water is held on the waterproofed area for 24–48 hours to confirm there are no leaks before finishes are applied.",
      },
    ],
    relatedSlugs: ["flooring-vinyl-tile-spc", "post-reno-cleaning"],
  },
  {
    slug: "post-reno-cleaning",
    coverUrl:
      "https://slsjihcxunpnzduamthp.supabase.co/storage/v1/object/public/site-images/guides/post-reno-cleaning.jpg",
    title: "Post-renovation cleaning: what to expect",
    metaDescription:
      "A guide to post-renovation cleaning in Singapore — what's included, cement and paint residue, timing before move-in, and typical costs by flat size.",
    keywords: ["post renovation cleaning singapore", "post reno cleaning cost", "move in cleaning"],
    category: "cleaning-services",
    categoryLabel: "Cleaning Services",
    standfirst:
      "Renovation dust gets everywhere. A proper post-reno clean is different from regular housekeeping — here's what's involved.",
    datePublished: "2026-02-12",
    author: "Renodify Editorial",
    authorBio: "The Renodify team writes practical, Singapore-specific renovation guides for homeowners.",
    readMins: 4,
    takeaways: [
      "Post-reno cleaning tackles cement, paint and adhesive residue, not just dust.",
      "Book it after all trades finish but before furniture delivery.",
      "Price scales with flat size and condition — get a few quotes.",
    ],
    sections: [
      {
        id: "whats-included",
        heading: "What's included",
        blocks: [
          {
            type: "ul",
            items: [
              "Cement, grout and paint residue removal",
              "Detailed wipe-down of carpentry, tracks and grilles",
              "Floor scrubbing and window cleaning",
              "Disposal of fine renovation dust from every surface",
            ],
          },
        ],
      },
      {
        id: "timing",
        heading: "When to book",
        blocks: [
          {
            type: "p",
            text: "Schedule the clean after every trade is done — including blinds and grilles — but before furniture and appliances are delivered, so surfaces are clear.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "How is post-reno cleaning different from normal cleaning?",
        a: "It removes construction residue — cement, grout haze, paint and adhesive — and fine dust embedded in every surface, which standard cleaning doesn't cover.",
      },
      {
        q: "When should I schedule it?",
        a: "After all trades finish (including blinds and grilles) and before furniture arrives, so every surface is accessible.",
      },
    ],
    relatedSlugs: ["after-your-id-what-to-sort-next", "flooring-vinyl-tile-spc"],
  },
];

export const GUIDE_BY_SLUG = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));
export const getFeaturedGuide = () => GUIDES.find((g) => g.featured) ?? GUIDES[0];
