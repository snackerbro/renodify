import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategoriesWithCounts, getPopularVendors } from "@/lib/services/catalog";
import { CategoryTile } from "@/components/site/CategoryTile";
import { VendorCard } from "@/components/site/VendorCard";
import { SearchBar } from "@/components/ds/SearchBar";
import { ChipLink } from "@/components/ds/Chip";
import { ButtonLink } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { Rating } from "@/components/ds/Rating";
import { PROPERTY_TYPES, SITE_DESCRIPTION } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Renodify — find every renovation vendor after your ID",
  description: SITE_DESCRIPTION,
  path: "/",
});

const STEPS = [
  {
    n: 1,
    t: "Tell us what you need",
    b: "Pick the specialists still missing from your renovation — blinds, grilles, aircon and more.",
  },
  {
    n: 2,
    t: "Get matched quotes",
    b: "We send your request to relevant, property-aware vendors. Compare replies in one place.",
  },
  {
    n: 3,
    t: "Choose with confidence",
    b: "Read reviews, see past work and opening hours, then book directly. Always free for homeowners.",
  },
];

export default async function HomePage() {
  const [categories, popular] = await Promise.all([
    getCategoriesWithCounts(),
    getPopularVendors(3),
  ]);
  const featured = popular[0];

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <span className="hero__eyebrow">
              <span /> For Singapore homeowners
            </span>
            <h1>
              You found your ID. <em>Now find everyone else.</em>
            </h1>
            <p className="hero__sub">
              Renodify is the directory for every renovation vendor you still need after your
              interior designer — vetted, property-aware and free to use.
            </p>

            <div className="hero__toggle">
              {PROPERTY_TYPES.map((p) => (
                <ChipLink key={p} href={`/browse-categories?property=${p}`}>
                  {p}
                </ChipLink>
              ))}
            </div>

            <div className="hero__search">
              <SearchBar placeholder="Search blinds, grilles, aircon…" />
            </div>

            <div className="hero__trust">
              <span className="hero__trust-item">
                <Icon name="check" size={16} /> Free for homeowners
              </span>
              <span className="hero__trust-item">
                <Icon name="check" size={16} /> Property-aware matching
              </span>
              <span className="hero__trust-item">
                <Icon name="check" size={16} /> Moderated reviews
              </span>
            </div>
          </div>

          {featured && (
            <div className="hero__visual">
              <div className="hero__card">
                <VendorCard vendor={featured} />
              </div>
              <div className="hero__chip hero__chip--a">
                <span className="ic">
                  <Icon name="check" size={18} />
                </span>
                Quote in 24h
              </div>
              <div className="hero__chip hero__chip--b">
                <span className="ic">
                  <Icon name="star" size={18} />
                </span>
                <span>
                  <Rating value={4.8} showValue count={86} size={13} />
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2>What do you still need?</h2>
            <Link href="/browse-categories">All categories →</Link>
          </div>
          <div className="cat-grid">
            {categories.map((c) => (
              <CategoryTile key={c.slug} category={c} />
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR VENDORS */}
      <section className="section section--alt">
        <div className="container">
          <div className="section__head">
            <h2>Popular vendors</h2>
            <Link href="/browse-categories">Browse all →</Link>
          </div>
          <div className="vendor-grid">
            {popular.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2>How Renodify works</h2>
          </div>
          <div className="steps">
            {STEPS.map((s) => (
              <div className="step-card" key={s.n}>
                <span className="step-card__n">{s.n}</span>
                <div>
                  <div className="step-card__t">{s.t}</div>
                  <div className="step-card__b">{s.b}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta">
            <div className="cta__main">
              <div className="cta__title">
                <Icon name="clipboardCheck" size={22} color="var(--rdf-primary)" />
                <h3>Ready to finish your renovation?</h3>
              </div>
              <p className="cta__body">
                Send one request and get quotes from the specialists you still need. It only takes a
                couple of minutes — and it&apos;s free.
              </p>
            </div>
            <ButtonLink href="/get-quotes" variant="primary" size="lg" className="cta__btn">
              Get quotes
            </ButtonLink>
          </div>
          <p className="id-link">
            <Link href="/about">
              Still need an interior designer? <b>Here&apos;s how Renodify fits in →</b>
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
