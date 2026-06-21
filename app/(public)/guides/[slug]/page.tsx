import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDES, GUIDE_BY_SLUG } from "@/lib/guides";
import { CATEGORY_BY_SLUG } from "@/lib/constants";
import { Icon } from "@/components/ds/Icon";
import { ButtonLink } from "@/components/ds/Button";
import { JsonLd } from "@/components/JsonLd";
import {
  pageMeta,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import type { GuideBlock } from "@/lib/guides";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = GUIDE_BY_SLUG[slug];
  if (!g) return {};
  return pageMeta({
    title: g.title,
    description: g.metaDescription,
    path: `/guides/${slug}`,
    keywords: g.keywords,
    type: "article",
  });
}

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "quote":
      return <blockquote>{block.text}</blockquote>;
    case "ul":
      return (
        <ul>
          {block.items?.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items?.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ol>
      );
    default:
      return null;
  }
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = GUIDE_BY_SLUG[slug];
  if (!g) notFound();

  const cat = CATEGORY_BY_SLUG[g.category];
  const related = g.relatedSlugs
    .map((s) => GUIDE_BY_SLUG[s])
    .filter(Boolean)
    .slice(0, 3);
  const initials = g.author
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <article className="container" style={{ paddingTop: 18, paddingBottom: 56 }}>
      <JsonLd
        data={[
          articleJsonLd({
            title: g.title,
            description: g.metaDescription,
            path: `/guides/${g.slug}`,
            datePublished: g.datePublished,
            dateModified: g.dateModified,
            authorName: g.author,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: g.title, path: `/guides/${g.slug}` },
          ]),
          faqJsonLd(g.faq),
        ]}
      />

      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="sep">/</span>
        <Link href="/guides">Guides</Link>
        <span className="sep">/</span>
        <span aria-current="page">{g.categoryLabel}</span>
      </nav>

      <header className="article-head">
        <span className="eyebrow">{g.categoryLabel} · Guide</span>
        <h1>{g.title}</h1>
        <p className="standfirst">{g.standfirst}</p>
        <div className="article-byline">
          <span className="who">
            <span className="ava">{initials}</span>
            <span>
              <span className="name">{g.author}</span>
              <span className="meta" style={{ display: "block" }}>
                {new Date(g.datePublished).toLocaleDateString("en-SG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </span>
          </span>
          <span className="dot" />
          <span className="tag">
            <Icon name="clock" size={14} /> {g.readMins} min read
          </span>
        </div>
      </header>

      <div className="article-cover">Guide illustration</div>

      <div className="article-layout">
        <div className="prose-article">
          {/* Key takeaways */}
          <div className="takeaways">
            <h2>
              <Icon name="clipboardCheck" size={18} /> Key takeaways
            </h2>
            <ul>
              {g.takeaways.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          {g.sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{s.heading}</h2>
              {s.blocks.map((b, i) => (
                <Block key={i} block={b} />
              ))}
            </section>
          ))}

          {/* FAQ */}
          <section id="faq">
            <h2>Frequently asked questions</h2>
            {g.faq.map((f) => (
              <div className="faq-item" key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </section>

          {/* CTA */}
          <div className="article-cta">
            <h3>Need a {g.categoryLabel.toLowerCase()} specialist?</h3>
            <p>Compare vetted Singapore vendors and get free quotes in minutes.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {cat && (
                <ButtonLink href={`/category/${cat.slug}`} variant="primary">
                  Browse {g.categoryLabel}
                </ButtonLink>
              )}
              <ButtonLink href="/get-quotes" variant="secondary">
                Get quotes
              </ButtonLink>
            </div>
          </div>

          {/* Author */}
          <div className="article-author">
            <span className="ava">{initials}</span>
            <div>
              <div className="name">{g.author}</div>
              <div className="bio">{g.authorBio}</div>
            </div>
          </div>
        </div>

        {/* TOC */}
        <aside className="toc">
          <h4>On this page</h4>
          <nav>
            {g.sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.heading}
              </a>
            ))}
            <a href="#faq">FAQ</a>
          </nav>
        </aside>
      </div>

      {related.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <div className="section__head">
            <h2>Related guides</h2>
          </div>
          <div className="cards-2">
            {related.map((r) => (
              <Link key={r.slug} href={`/guides/${r.slug}`} className="panel" style={{ display: "block" }}>
                <span className="event-tag">{r.categoryLabel}</span>
                <h3 style={{ margin: "12px 0 6px", fontSize: 18 }}>{r.title}</h3>
                <p style={{ color: "var(--rdf-text-secondary)", fontSize: 14, lineHeight: 1.5 }}>
                  {r.standfirst}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
