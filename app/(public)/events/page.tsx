import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getEvents } from "@/lib/services/catalog";
import { Icon } from "@/components/ds/Icon";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Renovation events, expos & fairs in Singapore",
  description:
    "Upcoming renovation expos, fairs and roadshows in Singapore featuring Renodify vendors. Find deals and meet specialists in person.",
  path: "/events",
});

function dateParts(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-SG", { day: "2-digit" }),
    mon: d.toLocaleDateString("en-SG", { month: "short" }).toUpperCase(),
    full: d.toLocaleDateString("en-SG", { weekday: "short", day: "numeric", month: "long", year: "numeric" }),
  };
}

export default async function EventsPage() {
  const events = await getEvents();
  const [featured, ...rest] = events;
  const fd = featured && dateParts(featured.date);

  return (
    <div className="container" style={{ paddingBottom: 48 }}>
      <div className="page-head">
        <h1>Events &amp; expos</h1>
        <p>Renovation fairs and roadshows where you can meet Renodify vendors in person.</p>
      </div>

      {featured && fd && (
        <Link href={`/events/${featured.slug}`} className="event-feature" style={{ marginTop: 8 }}>
          <div className="event-feature__cover">
            <span className="event-feature__date">
              <strong>{fd.day}</strong>
              {fd.mon}
            </span>
            <span className="event-feature__ph">Event</span>
          </div>
          <div className="event-feature__body">
            <span className="event-tag">{featured.type}</span>
            <h2>{featured.title}</h2>
            <p>{featured.description}</p>
            <div className="event-meta">
              <span className="event-meta__item">
                <Icon name="calendar" size={16} /> {fd.full}
              </span>
              <span className="event-meta__item">
                <Icon name="pin" size={16} /> {featured.location}
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
          const d = dateParts(e.date);
          return (
            <Link key={e.slug} href={`/events/${e.slug}`} className="event-card">
              <div className="event-card__cover">
                <span className="event-card__date">
                  <strong>{d.day}</strong>
                  {d.mon}
                </span>
                <span className="event-card__type">{e.type}</span>
              </div>
              <div className="event-card__body">
                <h3>{e.title}</h3>
                <span className="event-card__row">
                  <Icon name="pin" size={15} /> {e.location}
                </span>
                <div className="event-card__foot">
                  <span className="event-card__vendors">
                    <Icon name="users" size={15} /> Vendors exhibiting
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
