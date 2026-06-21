"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { Icon } from "@/components/ds/Icon";

const KEY = "renodify-checklist";

export function RenoChecklist({ categories }: { categories: Category[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // Hydrate persisted progress on mount (client-only state).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(done));
  }, [done, loaded]);

  const total = categories.length;
  const completed = Object.values(done).filter(Boolean).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  function toggle(slug: string) {
    setDone((d) => ({ ...d, [slug]: !d[slug] }));
  }

  return (
    <div>
      <div className="panel" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <strong>{completed} of {total} sorted</strong>
          <span style={{ color: "var(--rdf-text-secondary)", fontSize: 14 }}>{pct}%</span>
        </div>
        <div style={{ height: 10, borderRadius: 999, background: "var(--rdf-border)", marginTop: 10, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: "var(--rdf-primary)",
              borderRadius: 999,
              transition: "width .25s var(--rdf-ease)",
            }}
          />
        </div>
        {completed === total && total > 0 && (
          <p style={{ marginTop: 12, color: "var(--rdf-success)", fontWeight: 600 }}>
            All done — your renovation is fully covered! 🎉
          </p>
        )}
      </div>

      <div className="manage-list">
        {categories.map((c) => {
          const checked = !!done[c.slug];
          return (
            <div className="manage-item" key={c.slug} style={{ opacity: checked ? 0.7 : 1 }}>
              <button
                type="button"
                onClick={() => toggle(c.slug)}
                aria-pressed={checked}
                className="manage-item__icon"
                style={{
                  cursor: "pointer",
                  border: "none",
                  background: checked ? "var(--rdf-success-soft)" : "var(--rdf-primary-soft)",
                  color: checked ? "var(--rdf-success)" : "var(--rdf-primary)",
                }}
                aria-label={`Mark ${c.label} as done`}
              >
                <Icon name={checked ? "check" : c.icon} size={22} />
              </button>
              <div className="manage-item__main">
                <div className="manage-item__title" style={{ textDecoration: checked ? "line-through" : "none" }}>
                  {c.label}
                </div>
                <div className="manage-item__meta">
                  {checked ? "Sorted" : "Still outstanding"}
                </div>
              </div>
              <div className="manage-item__actions">
                {!checked && (
                  <Link href={`/category/${c.slug}`} className="rdf-btn rdf-btn--secondary rdf-btn--sm">
                    Find vendors
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RenoChecklist;
