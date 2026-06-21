import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { GUIDES, getFeaturedGuide } from "@/lib/guides";
import { Icon } from "@/components/ds/Icon";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = pageMeta({
  title: "Renovation guides for Singapore homeowners",
  description:
    "Practical, Singapore-specific renovation guides — blinds, invisible grilles, aircon sizing, flooring, waterproofing and more. Plan the rest of your renovation with confidence.",
  path: "/guides",
  keywords: ["renovation guides singapore", "hdb renovation tips", "condo renovation guide"],
});

export default function GuidesPage() {
  const featured = getFeaturedGuide();
  const rest = GUIDES.filter((g) => g.slug !== featured.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
        ])}
      />
      <div className="container" style={{ paddingBottom: 48 }}>
        <div className="page-head">
          <h1>Renovation guides</h1>
          <p>The practical knowledge you need for everything after your interior designer.</p>
        </div>

        <Link href={`/guides/${featured.slug}`} className="guide-featured" style={{ marginTop: 8 }}>
          {featured.coverUrl ? (
            <div className="cover" style={{ padding: 0, overflow: "hidden" }}>
              <Image
                src={featured.coverUrl}
                alt={featured.title}
                width={800}
                height={450}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : (
            <div className="cover">Featured guide</div>
          )}
          <div style={{ padding: "22px 24px" }}>
            <span className="eyebrow" style={{ color: "var(--rdf-accent-dark)" }}>
              Start here
            </span>
            <h2 style={{ margin: "8px 0 8px", fontSize: 24 }}>{featured.title}</h2>
            <p style={{ color: "var(--rdf-text-secondary)", lineHeight: 1.5 }}>
              {featured.standfirst}
            </p>
            <span className="rdf-btn rdf-btn--link" style={{ marginTop: 12, display: "inline-flex" }}>
              Read guide <Icon name="arrowRight" size={16} />
            </span>
          </div>
        </Link>

        <div className="cards-2" style={{ marginTop: 22 }}>
          {rest.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="panel" style={{ display: "block" }}>
              <span className="event-tag">{g.categoryLabel}</span>
              <h3 style={{ margin: "12px 0 8px", fontSize: 19 }}>{g.title}</h3>
              <p style={{ color: "var(--rdf-text-secondary)", fontSize: 14.5, lineHeight: 1.5 }}>
                {g.metaDescription}
              </p>
              <span style={{ fontSize: 13, color: "var(--rdf-text-muted)", marginTop: 10, display: "block" }}>
                {g.readMins} min read
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
