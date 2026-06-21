import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getEvents } from "@/lib/services/catalog";
import { formatEventDate, type SiteEvent } from "@/lib/events";
import { Icon } from "@/components/ds/Icon";
import { pageMeta } from "@/lib/seo";
import { DEFAULT_COVER_URL } from "@/lib/constants";

export const metadata: Metadata = pageMeta({
  title: "Renovation events, expos & fairs in Singapore",
  description:
    "Upcoming renovation expos, fairs and roadshows in Singapore. Meet interior designers and specialists, compare options and find event-only deals.",
  path: "/events",
});

export const revalidate = 3600;

function dateChip(e: SiteEvent) {
  const d = new Date(e.startDate);
  return {
    day: d.toLocaleDateString("en-SG", { day: "2-digit" }),
    mon: d.toLocaleDateString("en-SG", { month: "short" }).toUpperCase(),
  };
}

export default async function EventsPage() {
  const events = await getEvents();
  const [featured, ...rest] = events;
  const fd = featured && dateChip(featured);

  return (
    <div className="container" style={{ paddingBottom: 48 }}>
      <div className="page-head">
        <h1>Events &amp; expos</h1>
        <p>Renovation fairs, expos and roadshows in Singapore — meet designers and specialists in person.</p>
      </div>

      {featured && fd && (
        <Link href={`/events/${featured.slug}`} className="event-feature" style={{ marginTop: 8 }}>
          <div className="event-feature__cover">
            <span className="event-feature__date">
              <strong>{fd.day}</strong>
              {fd.mon}
            </span>
            <Image
              src={featured.imageUrl || DEFAULT_COVER_URL}
              alt={featured.title}
              width={800}
              height={450}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              priority
            />
          </div>
          <div className="event-feature__body">
            <span className="event-tag">{featured.type}</span>
            <h2>{featured.title}</h2>
            <p>{featured.description}</p>
            <div className="event-meta">
              <span className="event-meta__item">
                <Icon name="calendar" size={16} /> {formatEventDate(featured)}
              </span>
              <span className="event-meta__item">
                <Icon name="pin" size={16} /> {featured.locationDisplay}
              </span>
            </div>
          </div>
        </Link>
      )}

      <div className="section__head" style={{ marginTop: 28 }}>
        <h2>More events</h2>
      </div>
      <div className="event-grid">
        {rest.map((e) => {
          const d = dateChip(e);
          return (
            <Link key={e.slug} href={`/events/${e.slug}`} className="event-card">
              <div className="event-card__cover">
                <span className="event-card__date">
                  <strong>{d.day}</strong>
                  {d.mon}
                </span>
                <span className="event-card__type">{e.type}</span>
                <Image
                  src={e.imageUrl || DEFAULT_COVER_URL}
                  alt={e.title}
                  width={480}
                  height={300}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="event-card__body">
                <h3>{e.title}</h3>
                <span className="event-card__row">
                  <Icon name="calendar" size={15} /> {formatEventDate(e)}
                </span>
                <span className="event-card__row">
                  <Icon name="pin" size={15} /> {e.locationDisplay}
                </span>
                <div className="event-card__foot">
                  <span className="event-card__vendors">
                    <Icon name="tag" size={15} /> {e.admission || "See details"}
                  </span>
                  <span className="event-card__cta">
                    Details <Icon name="chevronRight" size={14} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
