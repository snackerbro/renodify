import React from "react";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: "Legal — Privacy Policy & Terms of Use",
  description:
    "Renodify's PDPA Privacy Policy and Terms of Use for homeowners and vendors in Singapore.",
  path: "/legal",
});

export default function LegalPage() {
  return (
    <div className="container prose" style={{ paddingBottom: 56 }}>
      <div className="page-head">
        <h1>Legal</h1>
        <p>How we handle your data and the terms of using {SITE_NAME}.</p>
      </div>

      <nav className="breadcrumb" style={{ marginTop: 8 }}>
        <a href="#privacy">Privacy Policy (PDPA)</a>
        <span className="sep">·</span>
        <a href="#terms">Terms of Use</a>
      </nav>

      <section id="privacy" className="prose-article" style={{ maxWidth: "none" }}>
        <h2>Privacy Policy (PDPA)</h2>
        <p>
          {SITE_NAME} is committed to protecting your personal data in accordance with Singapore&apos;s
          Personal Data Protection Act (PDPA). This policy explains what we collect, why, and how we
          use it.
        </p>
        <h3>What we collect</h3>
        <ul>
          <li>Contact details you submit when requesting quotes (name, phone, email).</li>
          <li>Enquiry details such as property type, budget, timeline and categories.</li>
          <li>Account information for registered homeowners and vendors.</li>
        </ul>
        <h3>How we use it</h3>
        <ul>
          <li>To share your enquiry with relevant vendors so they can respond — only with your consent.</li>
          <li>To operate and improve the platform and its matching.</li>
          <li>To communicate updates relevant to your enquiries or account.</li>
        </ul>
        <h3>Your rights</h3>
        <p>
          You may withdraw consent, request access to, or correction of your personal data at any time
          by contacting us. We retain data only as long as necessary for the purposes above or as
          required by law.
        </p>
      </section>

      <section id="terms" className="prose-article" style={{ maxWidth: "none", marginTop: 24 }}>
        <h2>Terms of Use</h2>
        <p>
          By using {SITE_NAME} you agree to these terms. {SITE_NAME} is a directory and introduction
          platform; we are not a party to any contract between homeowners and vendors.
        </p>
        <h3>For homeowners</h3>
        <ul>
          <li>Browsing and requesting quotes is free.</li>
          <li>Vendor listings are provided by vendors; verify details before engaging.</li>
          <li>Reviews are moderated but reflect individual experiences.</li>
        </ul>
        <h3>For vendors</h3>
        <ul>
          <li>Subscriptions grant a claimed listing and enquiry access per your plan.</li>
          <li>You are responsible for the accuracy of your listing and your dealings with homeowners.</li>
          <li>Misrepresentation or abuse may result in suspension.</li>
        </ul>
        <p style={{ color: "var(--rdf-text-muted)", fontSize: 14 }}>
          This is template legal content for launch and should be reviewed by a qualified legal
          professional before going live.
        </p>
      </section>
    </div>
  );
}
