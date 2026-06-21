import React from "react";
import type { Metadata } from "next";
import { searchAll } from "@/lib/services/catalog";
import { VendorCard } from "@/components/site/VendorCard";
import { CategoryTile } from "@/components/site/CategoryTile";
import { SearchBar } from "@/components/ds/SearchBar";
import { Icon } from "@/components/ds/Icon";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Search renovation vendors & categories",
  description: "Search Renodify for renovation vendors, services and categories across Singapore.",
  path: "/search",
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const { categories, vendors } = await searchAll(q);

  return (
    <div className="container" style={{ paddingBottom: 48 }}>
      <div className="page-head">
        <h1>Search</h1>
        {q ? (
          <p>
            Results for <strong>“{q}”</strong>
          </p>
        ) : (
          <p>Find vendors, services and categories.</p>
        )}
      </div>

      <div style={{ margin: "16px 0 24px", maxWidth: 560 }}>
        <SearchBar defaultValue={q} />
      </div>

      {categories.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <div className="section__head">
            <h2>Categories</h2>
          </div>
          <div className="cat-grid">
            {categories.map((c) => (
              <CategoryTile key={c.slug} category={c} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="section__head">
          <h2>Vendors {q && `(${vendors.length})`}</h2>
        </div>
        {vendors.length ? (
          <div className="vendor-grid">
            {vendors.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        ) : (
          <div className="manage-empty">
            <Icon name="search" size={28} />
            <p>No matches{q ? ` for “${q}”` : ""}. Try a different search.</p>
          </div>
        )}
      </section>
    </div>
  );
}
