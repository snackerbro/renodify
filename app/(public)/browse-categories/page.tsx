import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategoriesWithCounts } from "@/lib/services/catalog";
import { CategoryTile } from "@/components/site/CategoryTile";
import { SearchBar } from "@/components/ds/SearchBar";
import { ChipLink } from "@/components/ds/Chip";
import { Icon } from "@/components/ds/Icon";
import { PROPERTY_TYPES } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Browse renovation categories in Singapore",
  description:
    "Browse every renovation specialist category on Renodify — blinds, curtains, invisible grilles, aircon, flooring, smart home and more. Free for homeowners.",
  path: "/browse-categories",
  keywords: ["renovation vendors singapore", "blinds", "invisible grilles", "aircon servicing"],
});

export default async function BrowseCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ property?: string }>;
}) {
  const { property } = await searchParams;
  const categories = await getCategoriesWithCounts();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Browse categories", path: "/browse-categories" },
        ])}
      />
      <div className="container">
        <div className="page-head">
          <h1>Browse categories</h1>
          <p>
            Everything you still need after your interior designer. Pick a category to see vetted
            Singapore specialists.
          </p>
        </div>

        <div style={{ margin: "16px 0 18px", maxWidth: 560 }}>
          <SearchBar />
        </div>

        <div className="cat-filters__chips" style={{ marginBottom: 22 }}>
          <ChipLink href="/browse-categories" active={!property}>
            All properties
          </ChipLink>
          {PROPERTY_TYPES.map((p) => (
            <ChipLink
              key={p}
              href={`/browse-categories?property=${p}`}
              active={property === p}
            >
              {p}
            </ChipLink>
          ))}
        </div>

        <div className="cat-grid">
          {categories.map((c) => (
            <CategoryTile key={c.slug} category={c} />
          ))}
        </div>

        <Link href="/about" className="id-note" style={{ margin: "28px 0 40px" }}>
          <span className="id-note__icon">
            <Icon name="design" size={22} />
          </span>
          <div style={{ flex: 1 }}>
            <strong>Still need an interior designer?</strong>
            <div style={{ fontSize: 13.5, color: "var(--rdf-text-secondary)" }}>
              Renodify complements your ID — see how we fit into your renovation.
            </div>
          </div>
          <Icon name="arrowRight" size={20} className="id-note__arrow" />
        </Link>
      </div>
    </>
  );
}
