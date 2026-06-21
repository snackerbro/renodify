import React from "react";
import type { Metadata } from "next";
import { PricingTiers } from "@/components/billing/PricingTiers";
import { ButtonLink } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "List your business on Renodify",
  description:
    "Reach Singapore homeowners mid-renovation. Claim your listing and receive qualified enquiries with a Renodify vendor subscription — Basic, Silver or Gold.",
  path: "/list-your-business",
});

export default function ListYourBusinessPage() {
  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <span className="hero__eyebrow">
              <span /> For vendors
            </span>
            <h1>
              Reach homeowners <em>mid-renovation.</em>
            </h1>
            <p className="hero__sub">
              Renodify homeowners have already confirmed their interior designer — they&apos;re
              actively looking for the specialists you offer. Claim your listing and start receiving
              qualified enquiries.
            </p>
            <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <ButtonLink href="#pricing" variant="primary" size="lg">
                Find &amp; claim my business
              </ButtonLink>
              <ButtonLink href="/login" variant="secondary" size="lg">
                Vendor login
              </ButtonLink>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__card" style={{ padding: 22 }}>
              <div className="stat__v" style={{ color: "var(--rdf-primary)" }}>4</div>
              <div className="stat__l">enquiries waiting for vendors in your category</div>
            </div>
            <div className="hero__chip hero__chip--a">
              <span className="ic">
                <Icon name="inbox" size={18} />
              </span>
              New enquiry
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="pricing">
        <div className="container">
          <div className="page-head" style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: 28 }}>Simple plans, priced by enquiries</h2>
            <p style={{ margin: "8px auto 0" }}>
              Pick a plan that matches your volume. Change or cancel anytime.
            </p>
          </div>
          <div style={{ marginTop: 22 }}>
            <PricingTiers />
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container narrow">
          <div className="section__head">
            <h2>What counts as an enquiry?</h2>
          </div>
          <div className="panel">
            <p style={{ color: "var(--rdf-text-secondary)", lineHeight: 1.6 }}>
              An enquiry is a homeowner&apos;s quote request delivered to your inbox — with their
              property type, budget, timeline and contact details. You only receive enquiries that
              match your category and service area. Browsing your public profile, calls and WhatsApp
              taps are <strong>free</strong> and never counted against your quota.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
