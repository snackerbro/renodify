import React from "react";
import type { Metadata } from "next";
import { getCategoriesWithCounts } from "@/lib/services/catalog";
import { RenoChecklist } from "@/components/checklist/RenoChecklist";
import { ButtonLink } from "@/components/ds/Button";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Renovation checklist for Singapore homeowners",
  description:
    "Track every renovation specialist you still need with the free Renodify reno checklist. Tick off blinds, grilles, aircon, flooring and more as you go.",
  path: "/reno-checklist",
});

export default async function RenoChecklistPage() {
  const categories = await getCategoriesWithCounts();
  return (
    <div className="container narrow" style={{ paddingBottom: 56 }}>
      <div className="page-head">
        <h1>Your reno checklist</h1>
        <p>
          Tick off each specialist as you arrange it. We save your progress on this device — see what
          you&apos;ve covered and what&apos;s still outstanding.
        </p>
      </div>
      <div style={{ marginTop: 16 }}>
        <RenoChecklist categories={categories} />
      </div>
      <div className="cta" style={{ marginTop: 28 }}>
        <div className="cta__main">
          <div className="cta__title">
            <h3>Knock out the rest in one request</h3>
          </div>
          <p className="cta__body">Send a single quote request for everything still outstanding.</p>
        </div>
        <ButtonLink href="/get-quotes" variant="primary" className="cta__btn">
          Get quotes
        </ButtonLink>
      </div>
    </div>
  );
}
