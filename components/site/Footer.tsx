import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { SITE_TAGLINE } from "@/lib/constants";

const COLS = [
  {
    title: "For homeowners",
    links: [
      { href: "/browse-categories", label: "Browse categories" },
      { href: "/get-quotes", label: "Get quotes" },
      { href: "/reno-checklist", label: "Reno checklist" },
      { href: "/deals", label: "Deals" },
      { href: "/guides", label: "Guides" },
    ],
  },
  {
    title: "For vendors",
    links: [
      { href: "/list-your-business", label: "List your business" },
      { href: "/renodify-verified", label: "Renodify Verified" },
      { href: "/login", label: "Vendor login" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About & trust" },
      { href: "/events", label: "Events" },
      { href: "/legal", label: "Legal & privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Logo light />
          <p>{SITE_TAGLINE} Renodify is the directory for the rest of your Singapore renovation.</p>
        </div>
        {COLS.map((col) => (
          <div className="site-footer__col" key={col.title}>
            <h4>{col.title}</h4>
            {col.links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="container">
        <div className="site-footer__bar">
          <span>© {new Date().getFullYear()} Renodify. Made in Singapore.</span>
          <Link href="/legal" style={{ color: "inherit" }}>
            Privacy &amp; Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
