"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ds/Icon";

const TABS = [
  { href: "/", label: "Home", icon: "building" },
  { href: "/browse-categories", label: "Browse", icon: "grid" },
  { href: "/get-quotes", label: "Quotes", icon: "message" },
  { href: "/reno-checklist", label: "Checklist", icon: "clipboardCheck" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="site-tabbar rdf-tabbar" aria-label="Mobile">
      {TABS.map((t) => {
        const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className="rdf-tab"
            aria-current={active ? "page" : undefined}
          >
            <span className="rdf-tab__icon">
              <Icon name={t.icon} size={20} />
            </span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomNav;
