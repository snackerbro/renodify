import React from "react";
import type { Metadata } from "next";
import { Icon } from "@/components/ds/Icon";
import { Badge } from "@/components/ds/Badge";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Renodify Verified — our vendor verification programme",
  description:
    "How Renodify will verify vendors — business registration, insurance, track record and reviews. The Verified badge is coming soon.",
  path: "/renodify-verified",
});

const CHECKS = [
  { icon: "building", t: "Business registration", b: "ACRA-registered with a valid UEN." },
  { icon: "shieldCheck", t: "Insurance & licences", b: "Relevant work licences and liability cover." },
  { icon: "star", t: "Track record", b: "Verified completed projects and tenure." },
  { icon: "message", t: "Review integrity", b: "Reviews tied to genuine enquiries." },
];

export default function VerifiedPage() {
  return (
    <div className="container" style={{ paddingBottom: 56 }}>
      <div className="feature-banner" style={{ margin: "16px 0 28px" }}>
        <Badge variant="verified-pending">Coming soon</Badge>
        <h2 style={{ color: "#fff", margin: "12px 0 8px", fontSize: 28 }}>Renodify Verified</h2>
        <p style={{ color: "rgba(255,255,255,.85)", maxWidth: "56ch", lineHeight: 1.55 }}>
          A trust badge that means a vendor has passed independent checks. The programme is in
          development — at launch, all vendors show a &ldquo;Verification pending&rdquo; status.
        </p>
      </div>

      <div className="page-head">
        <h2 style={{ fontSize: 24 }}>What we&apos;ll check</h2>
      </div>
      <div className="cards-2">
        {CHECKS.map((c) => (
          <div className="panel" key={c.t}>
            <span className="rdf-tile__icon">
              <Icon name={c.icon} size={22} />
            </span>
            <h3 style={{ margin: "12px 0 4px", fontSize: 18 }}>{c.t}</h3>
            <p style={{ color: "var(--rdf-text-secondary)", fontSize: 14.5 }}>{c.b}</p>
          </div>
        ))}
      </div>

      <div className="note-row" style={{ marginTop: 24 }}>
        <Icon name="shield" size={22} color="var(--rdf-text-secondary)" />
        <p style={{ margin: 0, fontSize: 14.5, color: "var(--rdf-text-secondary)" }}>
          Until Verified launches, we rely on soft trust signals — moderated reviews, tenure, response
          rate and property-aware matching.
        </p>
      </div>
    </div>
  );
}
