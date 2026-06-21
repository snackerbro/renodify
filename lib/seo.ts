import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "./constants";

interface PageMetaInput {
  title: string;
  description?: string;
  path?: string; // absolute path beginning with "/"
  keywords?: string[];
  type?: "website" | "article";
  images?: string[];
}

/** Build consistent, SEO-complete Metadata (canonical + OpenGraph + Twitter). */
export function pageMeta({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  keywords,
  type = "website",
  images,
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImages = images ?? [`${SITE_URL}/opengraph-image`];
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_SG",
      type,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
  };
}

/* ── JSON-LD builders (GEO / rich results) ─────────────────────────────── */

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function articleJsonLd(a: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${a.path}` },
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    author: { "@type": "Organization", name: a.authorName },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function localBusinessJsonLd(v: {
  name: string;
  slug: string;
  category: string;
  ratingAvg: number;
  reviewCount: number;
  address?: string;
  phone?: string;
  priceFrom?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: v.name,
    url: `${SITE_URL}/vendor/${v.slug}`,
    "@id": `${SITE_URL}/vendor/${v.slug}`,
    description: `${v.category} specialist in Singapore, listed on ${SITE_NAME}.`,
    areaServed: "Singapore",
    address: { "@type": "PostalAddress", addressCountry: "SG", streetAddress: v.address },
    telephone: v.phone,
    aggregateRating:
      v.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: v.ratingAvg,
            reviewCount: v.reviewCount,
          }
        : undefined,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    areaServed: "Singapore",
  };
}
