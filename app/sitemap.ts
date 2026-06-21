import type { MetadataRoute } from "next";
import { SITE_URL, CATEGORIES } from "@/lib/constants";
import { GUIDES } from "@/lib/guides";
import { getAllVendorSlugs, getEvents } from "@/lib/services/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPaths = [
    "/",
    "/browse-categories",
    "/get-quotes",
    "/deals",
    "/events",
    "/guides",
    "/reno-checklist",
    "/list-your-business",
    "/renodify-verified",
    "/about",
    "/legal",
  ].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : 0.7,
  }));

  const categoryPaths = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const guidePaths = GUIDES.map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    lastModified: new Date(g.dateModified ?? g.datePublished),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const [vendorSlugs, events] = await Promise.all([getAllVendorSlugs(), getEvents()]);
  const vendorPaths = vendorSlugs.map((slug) => ({
    url: `${SITE_URL}/vendor/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  const eventPaths = events.map((e) => ({
    url: `${SITE_URL}/events/${e.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPaths, ...categoryPaths, ...guidePaths, ...vendorPaths, ...eventPaths];
}
