import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/services/account";
import { listEnquiriesForCustomer } from "@/lib/services/enquiries";
import { getDeals } from "@/lib/services/catalog";
import { Icon } from "@/components/ds/Icon";
import { ButtonLink } from "@/components/ds/Button";

export const metadata: Metadata = {
  title: "My dashboard",
  robots: { index: false, follow: false },
};

export default async function CustomerDashboardPage() {
  const profile = await getCurrentProfile();
  const [enquiries, deals] = await Promise.all([
    listEnquiriesForCustomer(),
    getDeals(),
  ]);
  const name = profile?.fullName || "there";

  return (
    <div className="dash">
      <div className="dash__head">
        <div className="container dash__head-inner">
          <div className="dash__avatar">
            <Icon name="user" size={24} />
          </div>
          <div className="dash__who">
            <h1>Hi, {name}</h1>
            <p>Track your quote requests and saved deals.</p>
          </div>
          <ButtonLink href="/get-quotes" variant="primary" size="sm">
            New request
          </ButtonLink>
        </div>
      </div>

      <div className="container" style={{ padding: "24px 20px 56px" }}>
        <div className="section__head">
          <h2>Your quote requests</h2>
        </div>
        {enquiries.length ? (
          <div className="enq">
            {enquiries.map((e) => (
              <div className="enq-card" key={e.id}>
                <div className="enq-card__top">
                  <span className="enq-card__icon">
                    <Icon name="message" size={20} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div className="enq-card__title">{e.categories.join(", ") || "Quote request"}</div>
                    <div className="enq-card__meta">
                      {e.propertyType} · {e.budget} · {e.timeline} · {e.createdAt}
                    </div>
                  </div>
                  <span className={`pill-status pill-status--${e.status}`}>
                    {e.status === "replied" ? "Replied" : "Awaiting"}
                  </span>
                </div>
                {e.message && <p className="enq-card__body">{e.message}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="manage-empty">
            <Icon name="inbox" size={28} />
            <p>No requests yet. Send your first quote request to get matched.</p>
            <ButtonLink href="/get-quotes" variant="primary">
              Get quotes
            </ButtonLink>
          </div>
        )}

        <div className="section__head" style={{ marginTop: 32 }}>
          <h2>Saved deals</h2>
          <Link href="/deals">All deals →</Link>
        </div>
        <div className="cards-2">
          {deals.slice(0, 4).map((d) => (
            <Link key={d.vendorSlug} href={`/vendor/${d.vendorSlug}`} className="panel" style={{ display: "block" }}>
              <span className="rdf-badge rdf-badge--deal">
                <Icon name="tag" size={13} /> {d.deal}
              </span>
              <h3 style={{ margin: "10px 0 2px", fontSize: 17 }}>{d.vendorName}</h3>
              <p style={{ color: "var(--rdf-text-secondary)", fontSize: 14 }}>{d.category}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
