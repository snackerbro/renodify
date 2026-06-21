import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getDeals } from "@/lib/services/catalog";
import { Icon } from "@/components/ds/Icon";
import { ButtonLink } from "@/components/ds/Button";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Renovation deals & promotions in Singapore",
  description:
    "Current renovation deals and group-buy promotions from Renodify vendors — blinds, grilles, flooring, smart home and more for BTO and condo homes.",
  path: "/deals",
});

export default async function DealsPage() {
  const deals = await getDeals();
  return (
    <div className="container" style={{ paddingBottom: 48 }}>
      <div className="page-head">
        <h1>Deals &amp; promotions</h1>
        <p>Limited-time offers from vetted Singapore renovation specialists.</p>
      </div>

      <div className="feature-banner" style={{ margin: "8px 0 24px" }}>
        <span className="event-tag" style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}>
          BTO &amp; Condo group buy
        </span>
        <h2 style={{ color: "#fff", margin: "12px 0 8px", fontSize: 26 }}>
          Bundle your finishings and save
        </h2>
        <p style={{ color: "rgba(255,255,255,.85)", maxWidth: "56ch", lineHeight: 1.5 }}>
          Combine blinds, grilles and lighting in one request and unlock group-buy pricing from
          participating vendors.
        </p>
        <div style={{ marginTop: 16 }}>
          <ButtonLink href="/get-quotes" variant="primary">
            Get bundle quotes
          </ButtonLink>
        </div>
      </div>

      <div className="section__head">
        <h2>Current promotions</h2>
      </div>
      {deals.length ? (
        <div className="cards-2">
          {deals.map((d) => (
            <Link key={d.vendorSlug} href={`/vendor/${d.vendorSlug}`} className="panel" style={{ display: "block" }}>
              <span className="rdf-badge rdf-badge--deal">
                <Icon name="tag" size={13} /> {d.deal}
              </span>
              <h3 style={{ margin: "12px 0 4px", fontSize: 19 }}>{d.vendorName}</h3>
              <p style={{ color: "var(--rdf-text-secondary)", fontSize: 14.5 }}>{d.category}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="manage-empty">
          <Icon name="tag" size={28} />
          <p>No active promotions right now. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
