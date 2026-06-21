import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVendorBySlug, getVendors } from "@/lib/services/catalog";
import { VendorCard } from "@/components/site/VendorCard";
import { Rating } from "@/components/ds/Rating";
import { Badge, VerifiedPendingBadge } from "@/components/ds/Badge";
import { ButtonLink } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import { DAYS } from "@/lib/constants";
import { pageMeta, breadcrumbJsonLd, localBusinessJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import type { Outlet } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVendorBySlug(slug);
  if (!v) return {};
  return pageMeta({
    title: `${v.name} — ${v.category} in Singapore`,
    description: `${v.name}: ${v.category} specialist in Singapore. ${v.ratingAvg.toFixed(1)}★ from ${v.reviewCount} reviews. ${v.about ?? ""}`.slice(0, 300),
    path: `/vendor/${slug}`,
  });
}

function HoursTable({ outlet }: { outlet: Outlet }) {
  const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0
  return (
    <div className="hours-table">
      {DAYS.map((d, i) => {
        const h = outlet.hours.find((x) => x.day === d);
        const open = h?.open;
        return (
          <div key={d} className={`hours-table__row${i === todayIdx ? " today" : ""}`}>
            <span className="d">{d}</span>
            <span className={`t${open ? "" : " closed"}`}>
              {open ? `${h?.from} – ${h?.to}` : "Closed"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default async function VendorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = await getVendorBySlug(slug);
  if (!v) notFound();

  const similar = (await getVendors({ category: v.categorySlug }))
    .filter((x) => x.slug !== v.slug)
    .slice(0, 3);

  const monogram = v.name.slice(0, 1).toUpperCase();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: v.category, path: `/category/${v.categorySlug}` },
            { name: v.name, path: `/vendor/${v.slug}` },
          ]),
          localBusinessJsonLd({
            name: v.name,
            slug: v.slug,
            category: v.category,
            ratingAvg: v.ratingAvg,
            reviewCount: v.reviewCount,
            address: v.outlets[0]?.address,
            phone: v.phone,
            priceFrom: v.priceFrom,
          }),
        ]}
      />

      {/* Cover */}
      <div className="container" style={{ paddingTop: 16 }}>
        <Link href={`/category/${v.categorySlug}`} className="backlink">
          <Icon name="chevronLeft" size={16} /> {v.category}
        </Link>
      </div>
      <div className="container" style={{ marginTop: 12 }}>
        <div
          className="rdf-ph"
          style={{ aspectRatio: "16/5", borderRadius: 18, overflow: "hidden" }}
        >
          {v.coverUrl ? (
            <Image src={v.coverUrl} alt="" width={1180} height={370} style={{ objectFit: "cover" }} />
          ) : (
            "Cover photo"
          )}
        </div>
      </div>

      <div className="container" style={{ paddingTop: 20, paddingBottom: 90 }}>
        {v.unclaimed && (
          <div className="claim-banner">
            <span className="claim-banner__icon">
              <Icon name="shield" size={22} />
            </span>
            <div className="claim-banner__txt">
              <div className="claim-banner__title">Is this your business?</div>
              <div className="claim-banner__sub">
                Claim this listing to reply to enquiries and manage your profile.
              </div>
            </div>
            <ButtonLink href="/list-your-business" variant="solid" size="sm">
              Claim
            </ButtonLink>
          </div>
        )}

        <div className="vp-layout">
          <div>
            {/* Identity */}
            <div className="rdf-vendor__head" style={{ alignItems: "center", gap: 16 }}>
              <span className="rdf-vendor__logo" style={{ width: 64, height: 64, fontSize: 24 }}>
                {v.logoUrl ? <Image src={v.logoUrl} alt="" width={64} height={64} /> : monogram}
              </span>
              <div>
                <h1 style={{ fontSize: "clamp(26px,4vw,34px)", margin: 0 }}>{v.name}</h1>
                <div className="rdf-vendor__cat" style={{ marginTop: 4 }}>
                  {v.category} · {v.areas.join(", ")}
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
                  <Rating value={v.ratingAvg} count={v.reviewCount} />
                  <VerifiedPendingBadge />
                  {v.deal && <Badge variant="deal">{v.deal}</Badge>}
                </div>
              </div>
            </div>

            {/* Trust meta */}
            <div className="stat-grid" style={{ marginTop: 20 }}>
              <div className="stat">
                <div className="stat__v">{v.yearsInBusiness}</div>
                <div className="stat__l">Years in business</div>
              </div>
              <div className="stat">
                <div className="stat__v">{v.responseRate ?? "—"}%</div>
                <div className="stat__l">Response rate</div>
              </div>
              <div className="stat">
                <div className="stat__v" style={{ fontSize: 20 }}>{v.priceFrom ?? "—"}</div>
                <div className="stat__l">From price</div>
              </div>
              <div className="stat">
                <div className="stat__v">{v.reviewCount}</div>
                <div className="stat__l">Reviews</div>
              </div>
            </div>

            {v.about && (
              <p style={{ marginTop: 20, color: "var(--rdf-text-secondary)", lineHeight: 1.6 }}>
                {v.about}
              </p>
            )}

            {/* Services */}
            {v.services.length > 0 && (
              <section style={{ marginTop: 30 }}>
                <div className="section__head">
                  <h2>Products &amp; services</h2>
                </div>
                <div className="svc-grid">
                  {v.services.map((s) => (
                    <div className="svc-card" key={s.id}>
                      <div className="svc-card__thumb">
                        <span className={`svc-card__tag${s.kind === "Product" ? " svc-card__tag--product" : ""}`}>
                          {s.kind}
                        </span>
                        <Icon name={s.icon || "image"} size={28} />
                      </div>
                      <div className="svc-card__body">
                        <div className="svc-card__name">{s.name}</div>
                        <div className="svc-card__desc">{s.description}</div>
                        {s.features && s.features.length > 0 && (
                          <div className="svc-card__feats">
                            {s.features.map((f) => (
                              <span className="svc-card__feat" key={f}>
                                <Icon name="check" size={15} /> {f}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="svc-card__foot">
                          <span className="svc-card__price">
                            {s.price} <small>{s.unit}</small>
                          </span>
                          <ButtonLink
                            href={`/get-quotes?vendor=${v.slug}`}
                            variant="secondary"
                            size="sm"
                          >
                            Enquire
                          </ButtonLink>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Outlets & hours */}
            {v.outlets.length > 0 && (
              <section style={{ marginTop: 30 }}>
                <div className="section__head">
                  <h2>Outlets &amp; opening hours</h2>
                </div>
                <div className="outlet-grid">
                  {v.outlets.map((o) => (
                    <div className="outlet-card" key={o.id}>
                      <div className="outlet-card__name">
                        <Icon name="building" size={18} /> {o.name}
                      </div>
                      <div className="outlet-card__row">
                        <Icon name="pin" size={16} /> {o.address}
                      </div>
                      <div className="outlet-card__row">
                        <Icon name="phone" size={16} /> {o.phone}
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <HoursTable outlet={o} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Past work gallery */}
            {v.pastWork.length > 0 && (
              <section style={{ marginTop: 30 }}>
                <div className="section__head">
                  <h2>Past work</h2>
                </div>
                <div className="gallery-grid">
                  {v.pastWork.map((p) => (
                    <div className="ph" key={p.id} title={`${p.title} · ${p.location} · ${p.year}`}>
                      {p.title}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            {v.reviews.length > 0 && (
              <section style={{ marginTop: 30 }}>
                <div className="section__head">
                  <h2>Reviews</h2>
                  <span style={{ color: "var(--rdf-text-secondary)", fontSize: 14 }}>
                    Moderated by Renodify
                  </span>
                </div>
                <div className="rdf-stack" style={{ gap: 14 }}>
                  {v.reviews.map((r) => (
                    <div className="panel" key={r.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong>{r.authorName}</strong>
                        <Rating value={r.rating} showValue={false} size={14} />
                      </div>
                      <p style={{ marginTop: 8, color: "var(--rdf-text-secondary)" }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Desktop sticky contact */}
          <aside className="vp-aside">
            <div className="panel">
              <h3 style={{ fontSize: 18, marginBottom: 12 }}>Contact {v.name}</h3>
              <div className="rdf-stack" style={{ gap: 10 }}>
                <ButtonLink href={`/get-quotes?vendor=${v.slug}`} variant="primary" block>
                  Get a quote
                </ButtonLink>
                {v.phone && (
                  <ButtonLink href={`tel:${v.phone}`} variant="secondary" block iconLeft="phone">
                    Call
                  </ButtonLink>
                )}
                {v.whatsapp && (
                  <ButtonLink
                    href={`https://wa.me/${v.whatsapp.replace(/[^0-9]/g, "")}`}
                    variant="secondary"
                    block
                    iconLeft="message"
                  >
                    WhatsApp
                  </ButtonLink>
                )}
              </div>
              <p style={{ marginTop: 12, fontSize: 13, color: "var(--rdf-text-muted)" }}>
                Free for homeowners. No obligation.
              </p>
            </div>
          </aside>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <div className="section__head">
              <h2>Similar companies</h2>
            </div>
            <div className="vendor-grid">
              {similar.map((s) => (
                <VendorCard key={s.id} vendor={s} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky contact bar */}
      <div className="vp-contact-bar">
        {v.phone && (
          <ButtonLink href={`tel:${v.phone}`} variant="secondary" size="sm" aria-label="Call">
            <Icon name="phone" size={18} />
          </ButtonLink>
        )}
        {v.whatsapp && (
          <ButtonLink
            href={`https://wa.me/${v.whatsapp.replace(/[^0-9]/g, "")}`}
            variant="secondary"
            size="sm"
            aria-label="WhatsApp"
          >
            <Icon name="message" size={18} />
          </ButtonLink>
        )}
        <ButtonLink
          href={`/get-quotes?vendor=${v.slug}`}
          variant="primary"
          size="sm"
          block
          className="grow"
        >
          Get a quote
        </ButtonLink>
      </div>
    </>
  );
}
