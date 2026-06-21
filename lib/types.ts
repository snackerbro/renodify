// ─────────────────────────────────────────────────────────────────────────
// Domain types — mirror the Supabase schema (supabase/migrations).
// ─────────────────────────────────────────────────────────────────────────

export type Role = "homeowner" | "customer" | "vendor";
export type PropertyType = "HDB" | "Condo" | "Landed";
export type Plan = "basic" | "silver" | "gold";
export type EnquiryStatus = "new" | "replied";
export type ServiceKind = "Service" | "Product";

export interface Category {
  id: string;
  slug: string;
  label: string;
  icon: string; // icon name from the rdf icon set
  vendorCount?: number;
}

export interface DayHours {
  day: string; // Mon..Sun
  open: boolean;
  from: string; // "09:00"
  to: string; // "18:00"
}

export interface Outlet {
  id: string;
  vendorId: string;
  name: string;
  address: string;
  phone: string;
  hours: DayHours[];
}

export interface Service {
  id: string;
  vendorId: string;
  kind: ServiceKind;
  icon: string;
  name: string;
  price: string;
  unit: string;
  description: string;
  features?: string[];
}

export interface Deal {
  id: string;
  vendorId: string;
  icon: string;
  title: string;
  discount: string;
  scope: string;
  endsOn: string;
  details: string;
}

export interface VendorEvent {
  id: string;
  vendorId: string;
  type: string; // Expo | Fair | Roadshow
  title: string;
  role: string;
  date: string; // ISO date
  location: string;
}

export interface PastWork {
  id: string;
  vendorId: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  images?: string[];
}

export interface Review {
  id: string;
  vendorId: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  slug: string;
  ownerId?: string | null;
  name: string;
  categorySlug: string;
  category: string;
  areas: string[];
  propertyTypes: PropertyType[];
  website?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  whatsapp?: string;
  phone?: string;
  location?: string;
  email?: string;
  plan?: Plan | null;
  verified: boolean;
  ratingAvg: number;
  reviewCount: number;
  yearsInBusiness: number;
  responseRate?: number;
  priceFrom?: string;
  deal?: string | null;
  unclaimed?: boolean;
  about?: string;
}

export interface VendorDetail extends Vendor {
  outlets: Outlet[];
  services: Service[];
  deals: Deal[];
  events: VendorEvent[];
  pastWork: PastWork[];
  reviews: Review[];
}

export interface Enquiry {
  id: string;
  homeownerName: string;
  homeownerContact: string;
  propertyType: PropertyType;
  categories: string[];
  budget: string;
  timeline: string;
  message: string;
  vendorIds: string[];
  status: EnquiryStatus;
  createdAt: string;
}

export interface Subscription {
  id: string;
  vendorId: string;
  plan: Plan;
  enquiriesIncluded: number;
  enquiriesUsed: number;
  renewsOn: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  status: string;
}

export interface Profile {
  id: string;
  role: Role;
  email: string;
  fullName?: string;
  vendorId?: string | null;
}

export interface PlanTier {
  plan: Plan;
  name: string;
  price: number; // SGD / month
  enquiriesPerMonth: number;
  popular?: boolean;
  features: string[];
  priceEnvKey: string;
}
