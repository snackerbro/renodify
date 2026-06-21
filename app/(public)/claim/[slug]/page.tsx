import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVendorBySlug } from "@/lib/services/catalog";
import { getCurrentProfile } from "@/lib/services/account";
import { ClaimButton } from "@/components/vendor/ClaimButton";
import { ButtonLink } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { pageMeta } from "@/lib/seo";

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
        ) : (
          <>
            <div className="svc-card__feats" style={{ margin: "20px 0 24px", gap: 12 }}>
              {BENEFITS.map((x) => (
                <span className="svc-card__feat" key={x.t} style={{ fontSize: 14.5 }}>
                  <Icon name={x.icon} size={16} />
                  <span>
                    <strong>{x.t}.</strong> {x.b}
                  </span>
                </span>
              ))}
            </div>

            {profile ? (
              <ClaimButton slug={slug} />
            ) : (
              <div className="rdf-stack" style={{ gap: 10, maxWidth: 360 }}>
                <ButtonLink
                  href={`/register?role=vendor&next=${encodeURIComponent(`/claim/${slug}`)}`}
                  variant="primary"
                  size="lg"
                  block
                >
                  Create a vendor account to claim
                </ButtonLink>
                <ButtonLink
                  href={`/login?next=${encodeURIComponent(`/claim/${slug}`)}`}
                  variant="secondary"
                  block
                >
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
