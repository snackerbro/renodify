import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVendorBySlug } from "@/lib/services/catalog";
import { getCurrentProfile } from "@/lib/services/account";
import { ClaimButton } from "@/components/vendor/ClaimButton";
import { ButtonLink } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { pageMeta } from "@/lib/seo";
import { hostFromUrl, emailMatchesVendorDomain } from "@/lib/domain";

export const metadata: Metadata = {
  ...pageMeta({ title: "Claim your business", path: "/claim" }),
  robots: { index: false, follow: false },
};

const BENEFITS = [
  { icon: "inbox", t: "Receive enquiries", b: "Get homeowner quote requests straight to your dashboard." },
  { icon: "image", t: "Manage your profile", b: "Upload your logo, cover, services, deals and opening hours." },
  { icon: "shieldCheck", t: "Build trust", b: "Show your real listing and respond to reviews." },
];

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);
  if (!vendor) notFound();

  const profile = await getCurrentProfile();
  const alreadyClaimed = !vendor.unclaimed && vendor.ownerId && vendor.ownerId !== profile?.id;
  const vendorHost = hostFromUrl(vendor.website);
  const emailOk = profile ? emailMatchesVendorDomain(profile.email, vendor.website) : false;
  const claimUrl = `/claim/${slug}`;

  return (
    <div className="container narrow" style={{ padding: "32px 20px 64px" }}>
      <div className="panel" style={{ padding: 28 }}>
        <span className="rdf-tile__icon" style={{ width: 52, height: 52 }}>
          <Icon name="building" size={26} />
        </span>
        <h1 style={{ fontSize: 28, margin: "16px 0 6px" }}>Claim {vendor.name}</h1>
        <p style={{ color: "var(--rdf-text-secondary)", lineHeight: 1.6 }}>
          {vendor.category} · {vendor.areas.join(", ")}
        </p>

        {alreadyClaimed ? (
          <div className="note-row" style={{ marginTop: 20 }}>
            <Icon name="shieldCheck" size={18} color="var(--rdf-success)" />
            <span>This listing has already been claimed. If it&apos;s yours, contact us.</span>
          </div>
        ) : !vendorHost ? (
          <div className="note-row" style={{ marginTop: 20 }}>
            <Icon name="shield" size={18} color="var(--rdf-text-secondary)" />
            <span>This listing has no website on file, so it can&apos;t be self-claimed yet. Contact us to verify ownership.</span>
          </div>
        ) : (
          <>
            <div className="svc-card__feats" style={{ margin: "20px 0 20px", gap: 12 }}>
              {BENEFITS.map((x) => (
                <span className="svc-card__feat" key={x.t} style={{ fontSize: 14.5 }}>
                  <Icon name={x.icon} size={16} />
                  <span>
                    <strong>{x.t}.</strong> {x.b}
                  </span>
                </span>
              ))}
            </div>

            {/* Verification requirement */}
            <div className="note-row" style={{ marginBottom: 20 }}>
              <Icon name="lock" size={18} color="var(--rdf-primary)" />
              <span style={{ fontSize: 14 }}>
                To prove ownership, claim with a company email at{" "}
                <strong>@{vendorHost}</strong>. We email a one-time code to verify it.
              </span>
            </div>

            {profile && emailOk ? (
              <ClaimButton slug={slug} />
            ) : profile && !emailOk ? (
              <div>
                <div className="danger-note" style={{ marginBottom: 14 }}>
                  <Icon name="shield" size={18} />
                  <span>
                    You&apos;re signed in as <strong>{profile.email}</strong>, which isn&apos;t a
                    @{vendorHost} address. Sign in with your company email to claim this listing.
                  </span>
                </div>
                <ButtonLink href={`/login?next=${encodeURIComponent(claimUrl)}`} variant="primary">
                  Sign in with @{vendorHost} email
                </ButtonLink>
              </div>
            ) : (
              <div className="rdf-stack" style={{ gap: 10, maxWidth: 380 }}>
                <ButtonLink
                  href={`/register?role=vendor&next=${encodeURIComponent(claimUrl)}`}
                  variant="primary"
                  size="lg"
                  block
                >
                  Verify with my @{vendorHost} email
                </ButtonLink>
                <ButtonLink href={`/login?next=${encodeURIComponent(claimUrl)}`} variant="secondary" block>
                  I already have an account
                </ButtonLink>
              </div>
            )}
            <p style={{ marginTop: 16, fontSize: 13, color: "var(--rdf-text-muted)" }}>
              After claiming, choose a plan to start receiving enquiries.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
