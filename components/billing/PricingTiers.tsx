"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PLAN_TIERS } from "@/lib/constants";
import { Button } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import type { Plan } from "@/lib/types";

const PLANS: Plan[] = ["basic", "silver", "gold"];

export function PricingTiers() {
  const [loading, setLoading] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const choose = useCallback(async (plan: Plan) => {
    setError(null);
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (res.status === 401) {
        // Not signed in — register, then come back here and resume checkout.
        const next = encodeURIComponent(`/list-your-business?plan=${plan}`);
        window.location.assign(`/register?role=vendor&next=${next}`);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Checkout unavailable");
      if (data.url) {
        window.location.assign(data.url); // -> Stripe Checkout
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout unavailable");
      setLoading(null);
    }
  }, []);

  // Resume checkout after signup: /list-your-business?plan=<plan> auto-starts it.
  useEffect(() => {
    const plan = new URLSearchParams(window.location.search).get("plan");
    if (plan && PLANS.includes(plan as Plan)) {
      // Intentional: resume checkout for the plan chosen before signup.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      choose(plan as Plan);
    }
  }, [choose]);

  return (
    <>
      <div className="tiers">
        {PLAN_TIERS.map((t) => (
          <div
            className="panel"
            key={t.plan}
            style={{
              display: "flex",
              flexDirection: "column",
              borderColor: t.popular ? "var(--rdf-primary)" : undefined,
              borderWidth: t.popular ? 2 : undefined,
              position: "relative",
            }}
          >
            {t.popular && (
              <span
                className="rdf-badge rdf-badge--deal"
                style={{ position: "absolute", top: -12, left: 20 }}
              >
                Most popular
              </span>
            )}
            <h3 style={{ fontSize: 20 }}>{t.name}</h3>
            <div style={{ margin: "8px 0 4px" }}>
              <span style={{ fontFamily: "var(--rdf-font-head)", fontWeight: 800, fontSize: 34 }}>
                S${t.price}
              </span>
              <span style={{ color: "var(--rdf-text-secondary)" }}> / month</span>
            </div>
            <p style={{ color: "var(--rdf-text-secondary)", fontSize: 14 }}>
              Up to {t.enquiriesPerMonth} enquiries / month
            </p>
            <div className="svc-card__feats" style={{ margin: "14px 0 18px", gap: 8 }}>
              {t.features.map((f) => (
                <span className="svc-card__feat" key={f}>
                  <Icon name="check" size={15} /> {f}
                </span>
              ))}
            </div>
            <div style={{ marginTop: "auto" }}>
              <Button
                variant={t.popular ? "primary" : "secondary"}
                block
                onClick={() => choose(t.plan)}
                disabled={loading !== null}
              >
                {loading === t.plan ? "Starting…" : `Choose ${t.name}`}
              </Button>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <p style={{ marginTop: 14, color: "var(--rdf-danger)", fontSize: 14 }}>
          {error} — please try again, or contact us to get set up.
        </p>
      )}
    </>
  );
}

export default PricingTiers;
