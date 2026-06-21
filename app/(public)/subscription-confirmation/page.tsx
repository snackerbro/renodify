import React from "react";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Subscription confirmed",
    description: "Your Renodify vendor subscription is active.",
    path: "/subscription-confirmation",
  }),
  robots: { index: false, follow: false },
};

export default function SubscriptionConfirmationPage() {
  return (
    <div className="container narrow" style={{ padding: "48px 20px 64px", textAlign: "center" }}>
      <span
        className="step-card__n"
        style={{ margin: "0 auto 16px", width: 64, height: 64, borderRadius: 18, background: "var(--rdf-success-soft)", color: "var(--rdf-success)" }}
      >
        <Icon name="check" size={30} />
      </span>
      <h1>You&apos;re all set!</h1>
      <p style={{ color: "var(--rdf-text-secondary)", margin: "12px auto 24px", lineHeight: 1.6, maxWidth: "48ch" }}>
        Your Renodify vendor subscription is active. Head to your dashboard to complete your profile,
        upload your logo, and start receiving enquiries.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <ButtonLink href="/vendor-dashboard" variant="primary" size="lg">
          Go to dashboard
        </ButtonLink>
        <ButtonLink href="/" variant="secondary" size="lg">
          Back home
        </ButtonLink>
      </div>
    </div>
  );
}
