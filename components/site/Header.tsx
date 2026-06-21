import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { ButtonLink } from "@/components/ds/Button";
import { HeaderAuth } from "./HeaderAuth";

const NAV = [
  { href: "/browse-categories", label: "Browse" },
  { href: "/deals", label: "Deals" },
  { href: "/events", label: "Events" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__brand" aria-label="Renodify home">
          <Logo />
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link href="/list-your-business" className="site-header__list">
            List your business
          </Link>
          <HeaderAuth />
          <ButtonLink href="/get-quotes" variant="primary" size="sm">
            Get Quotes
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
