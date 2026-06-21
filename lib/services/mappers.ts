import type {
  Deal,
  Outlet,
  PastWork,
  Review,
  Service,
  Vendor,
  VendorEvent,
} from "@/lib/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Map snake_case Supabase rows → camelCase domain objects.
export function mapVendor(r: any): Vendor {
  return {
    id: r.id,
    slug: r.slug,
    ownerId: r.owner_id ?? null,
    name: r.name,
    categorySlug: r.category_slug,
    category: r.category,
    areas: r.areas ?? [],
    propertyTypes: r.property_types ?? [],
    website: r.website ?? undefined,
    logoUrl: r.logo_url ?? null,
    coverUrl: r.cover_url ?? null,
    whatsapp: r.whatsapp ?? undefined,
    phone: r.phone ?? undefined,
    location: r.location ?? undefined,
    email: r.email ?? undefined,
    plan: r.plan ?? null,
    verified: !!r.verified,
    ratingAvg: Number(r.rating_avg ?? 0),
    reviewCount: r.review_count ?? 0,
    yearsInBusiness: r.years_in_business ?? 0,
    responseRate: r.response_rate ?? undefined,
    priceFrom: r.price_from ?? undefined,
    deal: r.deal ?? null,
    unclaimed: !!r.unclaimed,
    about: r.about ?? undefined,
  };
}

export const mapOutlet = (r: any): Outlet => ({
  id: r.id,
  vendorId: r.vendor_id,
  name: r.name,
  address: r.address,
  phone: r.phone,
  hours: r.hours ?? [],
});

export const mapService = (r: any): Service => ({
  id: r.id,
  vendorId: r.vendor_id,
  kind: r.kind,
  icon: r.icon,
  name: r.name,
  price: r.price,
  unit: r.unit,
  description: r.description,
  features: r.features ?? [],
});

export const mapDeal = (r: any): Deal => ({
  id: r.id,
  vendorId: r.vendor_id,
  icon: r.icon,
  title: r.title,
  discount: r.discount,
  scope: r.scope,
  endsOn: r.ends_on,
  details: r.details,
});

export const mapEvent = (r: any): VendorEvent => ({
  id: r.id,
  vendorId: r.vendor_id,
  type: r.type,
  title: r.title,
  role: r.role,
  date: r.date,
  location: r.location,
});

export const mapPastWork = (r: any): PastWork => ({
  id: r.id,
  vendorId: r.vendor_id,
  title: r.title,
  category: r.category,
  location: r.location,
  year: r.year,
  description: r.description,
  images: r.images ?? [],
});

export const mapReview = (r: any): Review => ({
  id: r.id,
  vendorId: r.vendor_id,
  authorName: r.author_name,
  rating: r.rating,
  text: r.text,
  createdAt: r.created_at,
});
