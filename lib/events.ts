// Curated Renodify events hub (expos, fairs, roadshows). Editorial content with
// images re-hosted in our Supabase Storage (site-images/events/).

export interface SiteEvent {
  slug: string;
  type: string; // Expo | Fair | Roadshow | Workshop | Talk
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  startTime?: string;
  endTime?: string;
  locationDisplay: string;
  venue?: string;
  address?: string;
  admission?: string;
  registration?: string;
  organiser?: string;
  vendors?: string;
  officialUrl?: string;
  imageUrl?: string;
  status?: string;
}

export const EVENTS: SiteEvent[] = [
  {
    slug: "qanvast-hangout",
    type: "Fair",
    title: "Qanvast Hangout: Meet Interior Designers for Your Renovation",
    description:
      "Meet multiple vetted interior design firms in one place, compare approaches and discuss your renovation plans face to face.",
    startDate: "2026-06-27",
    endDate: "2026-06-28",
    startTime: "11:00",
    endTime: "19:30",
    locationDisplay: "JustCo at The Centrepoint, Level 5",
    venue: "JustCo at The Centrepoint",
    address: "176 Orchard Road, The Centrepoint, #05-05, Singapore 238843",
    admission: "Free",
    registration: "Recommended",
    organiser: "Qanvast",
    vendors: "Multiple participating interior design firms",
    officialUrl: "https://renovate.qanvast.com/hangout/",
    imageUrl:
      "https://slsjihcxunpnzduamthp.supabase.co/storage/v1/object/public/site-images/events/qanvast-hangout.jpg",
    status: "Ready after organiser/vendor check",
  },
  {
    slug: "reno-fiesta-jun-2026",
    type: "Expo",
    title: "Reno Fiesta 2026",
    description:
      "Compare interior design firms, explore materials and furniture, and access event-only renovation packages in a multi-storey design gallery.",
    startDate: "2026-06-27",
    endDate: "2026-06-28",
    startTime: "10:00",
    endTime: "19:00",
    locationDisplay: "51 Ubi Avenue 3",
    venue: "Reno Fiesta venue",
    address: "51 Ubi Avenue 3, Singapore 408858",
    admission: "Free",
    registration: "Yes",
    organiser: "IDLah Singapore / Reno Fiesta",
    vendors: "Seven interior design studios plus home brands and suppliers",
    officialUrl: "https://renofiesta.sg/",
    imageUrl:
      "https://slsjihcxunpnzduamthp.supabase.co/storage/v1/object/public/site-images/events/reno-fiesta-jun-2026.jpg",
    status: "Ready after organiser/vendor check",
  },
  {
    slug: "singapore-joint-renovation-fair",
    type: "Fair",
    title: "Singapore Biggest Joint Renovation Fair",
    description:
      "A renovation consultation fair where homeowners can meet interior designers and explore renovation ideas and packages.",
    startDate: "2026-07-04",
    endDate: "2026-07-05",
    startTime: "10:00",
    endTime: "19:00",
    locationDisplay: "Musee – Interior Design Resource Library & Renovation Experiential Centre",
    venue: "Musee – Interior Design Resource Library & Renovation Experiential Centre",
    address: "Singapore — exact unit/address to reconfirm from organiser",
    admission: "Free / registration listing",
    registration: "Yes",
    organiser: "Sky Creation",
    vendors: "Sky Creation and participating renovation partners",
    officialUrl:
      "https://www.eventbrite.com/e/singapore-biggest-joint-renovation-fair-tickets-1992191049056",
    imageUrl:
      "https://slsjihcxunpnzduamthp.supabase.co/storage/v1/object/public/site-images/events/singapore-joint-renovation-fair.jpg",
    status: "Needs date/time/address confirmation",
  },
  {
    slug: "sunnyside-design-fair-2026",
    type: "Fair",
    title: "SunnySide Interior Design Fair 2026",
    description:
      "Free consultations with interior designers plus smart-home, furnishing and renovation-material vendors for HDB, condo and landed homeowners.",
    startDate: "2026-07-04",
    endDate: "2026-07-05",
    startTime: "12:00",
    endTime: "18:00",
    locationDisplay: "Scanteak, 1 Genting Lane",
    venue: "Scanteak",
    address: "1 Genting Lane, #01-01, Singapore 349544",
    admission: "Free",
    registration: "Recommended",
    organiser: "SunnySide Homes Pte Ltd",
    vendors: "Participating ID firms; smart-home, furnishing and renovation-material vendors",
    officialUrl: "https://event.sunnyside.sg/",
    imageUrl:
      "https://slsjihcxunpnzduamthp.supabase.co/storage/v1/object/public/site-images/events/sunnyside-design-fair-2026.jpg",
    status: "Ready after participant-list check",
  },
  {
    slug: "reno-fiesta-jul-2026",
    type: "Expo",
    title: "Reno Fiesta 2026 – July Weekend",
    description:
      "A homeowner renovation event for comparing design firms, materials, furniture and event-only packages.",
    startDate: "2026-07-11",
    endDate: "2026-07-12",
    startTime: "10:00",
    endTime: "19:00",
    locationDisplay: "51 Ubi Avenue 3",
    venue: "Reno Fiesta venue",
    address: "51 Ubi Avenue 3, Singapore 408858",
    admission: "Free",
    registration: "Yes",
    organiser: "IDLah Singapore / Reno Fiesta",
    vendors: "Seven interior design studios plus home brands and suppliers",
    officialUrl: "https://renofiesta.sg/",
    imageUrl:
      "https://slsjihcxunpnzduamthp.supabase.co/storage/v1/object/public/site-images/events/reno-fiesta-jul-2026.jpg",
    status: "Ready after organiser/vendor check",
  },
  {
    slug: "my-home-reno-expo-2026",
    type: "Expo",
    title: "My Home Grand Furniture and Reno Expo 2026",
    description:
      "Explore renovation ideas, interior design consultations, furniture, furnishings and expo-only home deals under one roof.",
    startDate: "2026-08-08",
    endDate: "2026-08-16",
    startTime: "11:00",
    endTime: "21:00",
    locationDisplay: "Singapore Expo, Hall 6B",
    venue: "Singapore Expo",
    address: "1 Expo Drive, Singapore 486150 — Hall 6B",
    admission: "Free",
    registration: "No / check organiser",
    organiser: "My Home International",
    vendors: "Interior designers, furniture and home-living exhibitors",
    officialUrl: "https://www.myhomeinternational.com.sg/",
    imageUrl:
      "https://slsjihcxunpnzduamthp.supabase.co/storage/v1/object/public/site-images/events/my-home-reno-expo-2026.jpg",
    status: "Ready after exhibitor-list check",
  },
];

// Sorted by start date.
export const EVENTS_SORTED = [...EVENTS].sort((a, b) => a.startDate.localeCompare(b.startDate));
export const EVENT_BY_SLUG = Object.fromEntries(EVENTS.map((e) => [e.slug, e]));

export function formatEventDate(e: SiteEvent): string {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  const s = new Date(e.startDate).toLocaleDateString("en-SG", opts);
  if (!e.endDate || e.endDate === e.startDate) return s;
  const end = new Date(e.endDate);
  const start = new Date(e.startDate);
  // Same month/year → "27–28 Jun 2026"
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()}–${end.getDate()} ${end.toLocaleDateString("en-SG", { month: "short", year: "numeric" })}`;
  }
  return `${s} – ${end.toLocaleDateString("en-SG", opts)}`;
}
