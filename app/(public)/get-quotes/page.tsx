import React from "react";
import type { Metadata } from "next";
import { getCategoriesWithCounts } from "@/lib/services/catalog";
import { CATEGORY_BY_SLUG } from "@/lib/constants";
import { GetQuotesFlow } from "@/components/quotes/GetQuotesFlow";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Get free renovation quotes",
  description:
    "Send one request and get matched quotes from Singapore renovation specialists — blinds, grilles, aircon, flooring and more. Free for homeowners.",
  path: "/get-quotes",
});

export default async function GetQuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; vendor?: string }>;
}) {
  const { category, vendor } = await searchParams;
  const categories = await getCategoriesWithCounts();
  const initialCategory = category && CATEGORY_BY_SLUG[category] ? category : undefined;

  return (
    <div className="container" style={{ padding: "26px 20px 56px" }}>
      <div className="quote-wrap">
        <div className="page-head" style={{ textAlign: "center" }}>
          <h1>Get quotes</h1>
          <p style={{ margin: "6px auto 0" }}>
            Tell us what you need and we&apos;ll match you with the right specialists.
          </p>
        </div>
        <div style={{ marginTop: 18 }}>
          <GetQuotesFlow
            categories={categories}
            initialCategory={initialCategory}
            vendorSlug={vendor}
          />
        </div>
      </div>
    </div>
  );
}
