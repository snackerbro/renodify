import React from "react";
import type { Metadata } from "next";
import { Icon } from "@/components/ds/Icon";
import { ButtonLink } from "@/components/ds/Button";
import { pageMeta } from "@/lib/seo";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: "About Renodify & our approach to trust",
  description:
    "Renodify is the complement to your interior designer — the directory for every other renovation vendor in Singapore. Learn about our property-aware, trust-first approach.",
  path: "/about",
});

const TRUST = [
  { icon: "users", t: "Soft trust signals", b: "Tenure, response rate and moderated reviews instead of empty badges." },
  { icon: "building", t: "Property-aware", b: "Matching that respects HDB, condo and landed differences." },
  { icon: "shieldCheck", t: "Verified — coming", b: "Independent verification is in development for added assurance." },
];

export default function AboutPage() {
  return (
    <>
      <section className="hero">
        <div className="container" style={{ padding: "44px 20px 48px" }}>
          <span className="hero__eyebrow">
            <span /> About {SITE_NAME}
          </span>
          <h1 style={{ maxWidth: "16ch" }}>
            The rest of your renovation, <em>in one place.</em>
          </h1>
          <p className="hero__sub">{SITE_TAGLINE}</p>
        </div>
      </section>

      <div className="container prose" style={{ padding: "36px 20px 56px" }}>
        <div className="prose-article" style={{ maxWidth: 760 }}>
          <h2>A complement to your interior designer</h2>
          <p>
            Your interior designer handles the big build — hacking, carpentry, the look and feel. But
            a renovation needs far more: blinds, curtains, invisible grilles, aircon, smart home,
            lighting and more. Those are usually left to you to find, compare and coordinate.
          </p>
          <p>
            {SITE_NAME} brings every one of those specialists into a single, property-aware directory.
            We don&apos;t replace your ID — we pick up where they stop.
          </p>
        </div>

        <div className="section__head" style={{ marginTop: 32 }}>
          <h2>Our approach to trust</h2>
        </div>
        <div className="cards-2">
          {TRUST.map((t) => (
            <div className="panel" key={t.t}>
              <span className="rdf-tile__icon">
                <Icon name={t.icon} size={22} />
              </span>
              <h3 style={{ margin: "12px 0 4px", fontSize: 18 }}>{t.t}</h3>
              <p style={{ color: "var(--rdf-text-secondary)", fontSize: 14.5 }}>{t.b}</p>
            </div>
          ))}
        </div>

        <div className="cta" style={{ marginTop: 32 }}>
          <div className="cta__main">
            <div className="cta__title">
              <h3>Get started</h3>
            </div>
            <p className="cta__body">Free for homeowners — find the specialists you still need.</p>
          </div>
          <ButtonLink href="/get-quotes" variant="primary" className="cta__btn">
            Get quotes
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
