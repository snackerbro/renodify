import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVendors, getCategoriesWithCounts } from "@/lib/services/catalog";
import { CATEGORY_BY_SLUG, CATEGORIES, PROPERTY_TYPES } from "@/lib/constants";
import { VendorCard } from "@/components/site/VendorCard";
import { ChipLink } from "@/components/ds/Chip";
import { ButtonLink } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORY_BY_SLUG[slug];
  if (!cat) return {};
  return pageMeta({
    title: `${cat.label} specialists in Singapore`,
    description: `Compare trusted ${cat.label.toLowerCase()} vendors in Singapore on Renodify. Ratings, opening hours and free quotes for HDB, condo and landed homes.`,
    path: `/category/${slug}`,
    keywords: [`${cat.label.toLowerCase()} singapore`, `${cat.label.toLowerCase()} hdb`, `${cat.label.toLowerCase()} condo`],
  });
}

export default async function CategoryListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ property?: string }>;
}) {
  const { slug } = await params;
  const { property } = await searchParams;
  const cat = CATEGORY_BY_SLUG[slug];
  if (!cat) notFound();

  const [vendors, categories] = await Promise.all([
    getVendors({ category: slug, propertyType: property }),
    getCategoriesWithCounts(),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Browse", path: "/browse-categories" },
          { name: cat.label, path: `/category/${slug}` },
        ])}
      />
      <div className="container" style={{ paddingTop: 18, paddingBottom: 40 }}>
        <Link href="/browse-categories" className="backlink">
          <Icon name="chevronLeft" size={16} /> All categories
        </Link>

        <div className="page-head" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="rdf-tile__icon" style={{ width: 52, height: 52 }}>
            <Icon name={cat.icon} size={28} />
          </span>
          <div>
            <h1 style={{ margin: 0 }}>{cat.label}</h1>
            <p style={{ margin: "4px 0 0" }}>
              {vendors.length} {vendors.length === 1 ? "vendor" : "vendors"} in Singapore
            </p>
          </div>
        </div>

        <div className="cat-layout" style={{ marginTop: 18 }}>
          <aside className="cat-filters">
            <div className="label">Property type</div>
            <div className="cat-filters__chips">
              <ChipLink href={`/category/${slug}`} active={!property}>
                All
              </ChipLink>
              {PROPERTY_TYPES.map((p) => (
                <ChipLink
                  key={p}
                  href={`/category/${slug}?property=${p}`}
                  active={property === p}
                >
                  {p}
                </ChipLink>
              ))}
            </div>

            <div className="label" style={{ marginTop: 18 }}>
              Other categories
            </div>
            <div className="cat-filters__chips">
              {categories
                .filter((c) => c.slug !== slug)
                .slice(0, 8)
                .map((c) => (
                  <ChipLink key={c.slug} href={`/category/${c.slug}`} count={c.vendorCount}>
                    {c.label}
                  </ChipLink>
                ))}
            </div>

            <div className="cat-filters__cta">
              <ButtonLink href={`/get-quotes?category=${slug}`} variant="primary" block>
                Get quotes
              </ButtonLink>
            </div>
          </aside>

          <div>
            {vendors.length ? (
              <div className="vendor-grid">
                {vendors.map((v) => (
                  <VendorCard key={v.id} vendor={v} />
                ))}
              </div>
            ) : (
              <div className="manage-empty">
                <Icon name="inbox" size={28} />
                <p>No vendors here yet. Be the first to get matched.</p>
                <ButtonLink href={`/get-quotes?category=${slug}`} variant="primary">
                  Request quotes
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sticky-cta" style={{ display: "block" }}>
        <div className="container">
          <ButtonLink href={`/get-quotes?category=${slug}`} variant="primary" block>
            Get quotes for {cat.label}
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
