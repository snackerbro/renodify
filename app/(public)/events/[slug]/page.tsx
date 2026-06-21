import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug, getEvents } from "@/lib/services/catalog";
import { formatEventDate } from "@/lib/events";
import { Icon } from "@/components/ds/Icon";
import { ButtonLink } from "@/components/ds/Button";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL, SITE_NAME, DEFAULT_COVER_URL } from "@/lib/constants";
import { JsonLd } from "@/components/JsonLd";

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = await getEventBySlug(slug);
  if (!e) return {};
  return pageMeta({
    title: e.title,
    description: e.description,
    path: `/events/${slug}`,
    images: e.imageUrl ? [e.imageUrl] : undefined,
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = await getEventBySlug(slug);
  if (!e) notFound();

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    description: e.description,
    startDate: e.startDate,
    endDate: e.endDate ?? e.startDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: e.imageUrl ? [e.imageUrl] : undefined,
    url: `${SITE_URL}/events/${e.slug}`,
    location: {
      "@type": "Place",
      name: e.venue ?? e.locationDisplay,
      address: { "@type": "PostalAddress", streetAddress: e.address, addressCountry: "SG" },
    },
    organizer: e.organiser ? { "@type": "Organization", name: e.organiser } : undefined,
    offers: /free/i.test(e.admission ?? "")
      ? { "@type": "Offer", price: "0", priceCurrency: "SGD", availability: "https://schema.org/InStock", url: e.officialUrl }
      : undefined,
  };

  const facts: { icon: string; label: string; value?: string }[] = [
    { icon: "calendar", label: "Date", value: formatEventDate(e) },
    { icon: "clock", label: "Time", value: e.startTime ? `${e.startTime}–${e.endTime}` : undefined },
    { icon: "pin", label: "Venue", value: e.venue },
    { icon: "tag", label: "Admission", value: e.admission },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Events", path: "/events" },
            { name: e.title, path: `/events/${slug}` },
          ]),
          eventJsonLd,
        ]}
      />
      <section className="eventd-hero">
        <div className="container eventd-hero__grid">
          <div>
            <span className="event-tag" style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}>
              {e.type}
            </span>
            <h1>{e.title}</h1>
            <p className="eventd-hero__sub">{e.description}</p>
            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {e.officialUrl && (
                <ButtonLink
                  href={e.officialUrl}
                  variant="primary"
                  iconRight="arrowRight"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official event page
                </ButtonLink>
              )}
              <ButtonLink href="/browse-categories" variant="secondary">
                Browse vendors
              </ButtonLink>
            </div>
          </div>
          <div className="eventd-facts">
            {facts
              .filter((f) => f.value)
              .map((f) => (
                <div className="eventd-fact" key={f.label}>
                  <span className="ic">
                    <Icon name={f.icon} size={18} />
                  </span>
                  <span>
                    <b>{f.value}</b>
                    <small>{f.label}</small>
                  </span>
                </div>
              ))}
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: "30px 20px 48px" }}>
        <div
          style={{ aspectRatio: "16/7", borderRadius: 16, overflow: "hidden", marginBottom: 28 }}
        >
          <Image
            src={e.imageUrl || DEFAULT_COVER_URL}
            alt={e.title}
            width={1200}
            height={525}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            priority
          />
        </div>

        <div className="prose" style={{ maxWidth: 760, margin: 0 }}>
          {e.address && (
            <p style={{ color: "var(--rdf-text-secondary)" }}>
              <strong>Location:</strong> {e.address}
            </p>
          )}
          {e.organiser && (
            <p style={{ color: "var(--rdf-text-secondary)" }}>
              <strong>Organiser:</strong> {e.organiser}
            </p>
          )}
          {e.registration && (
            <p style={{ color: "var(--rdf-text-secondary)" }}>
              <strong>Registration:</strong> {e.registration}
            </p>
          )}
          {e.vendors && (
            <p style={{ color: "var(--rdf-text-secondary)" }}>
              <strong>Participating firms:</strong> {e.vendors}
            </p>
          )}
        </div>

        <div className="note-row" style={{ marginTop: 24, maxWidth: 760 }}>
          <Icon name="shield" size={18} color="var(--rdf-text-secondary)" />
          <p style={{ margin: 0, fontSize: 14, color: "var(--rdf-text-secondary)" }}>
            Event details are compiled from public sources — please confirm date, time and venue on
            the official event page before attending.
          </p>
        </div>

        <div className="cta" style={{ marginTop: 28 }}>
          <div className="cta__main">
            <div className="cta__title">
              <h3>Planning your renovation?</h3>
            </div>
            <p className="cta__body">
              Find the specialists you still need on {SITE_NAME} — free quotes, property-aware
              matching.
            </p>
          </div>
          <ButtonLink href="/get-quotes" variant="primary" className="cta__btn">
            Get quotes
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
