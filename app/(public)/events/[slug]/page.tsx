import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug, getEvents, getVendors } from "@/lib/services/catalog";
import { VendorCard } from "@/components/site/VendorCard";
import { Icon } from "@/components/ds/Icon";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
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

  const d = new Date(e.date);
  const exhibitors = (await getVendors()).slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
          { name: e.title, path: `/events/${slug}` },
        ])}
      />
      <section className="eventd-hero">
        <div className="container eventd-hero__grid">
          <div>
            <span className="event-tag" style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}>
              {e.type}
            </span>
            <h1>{e.title}</h1>
            <p className="eventd-hero__sub">{e.description}</p>
          </div>
          <div className="eventd-facts">
            <div className="eventd-fact">
              <span className="ic">
                <Icon name="calendar" size={18} />
              </span>
              <span>
                <b>{d.toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long" })}</b>
                <small>{d.toLocaleDateString("en-SG", { year: "numeric" })}</small>
              </span>
            </div>
            <div className="eventd-fact">
              <span className="ic">
                <Icon name="pin" size={18} />
              </span>
              <span>
                <b>Location</b>
                <small>{e.location}</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: "30px 20px 48px" }}>
        <div className="map-ph" style={{ marginBottom: 30 }}>Venue map</div>
        <div className="section__head">
          <h2>Renodify vendors exhibiting</h2>
          <Link href="/browse-categories">Browse all →</Link>
        </div>
        <div className="vendor-grid">
          {exhibitors.map((v) => (
            <VendorCard key={v.id} vendor={v} />
          ))}
        </div>
      </div>
    </>
  );
}
