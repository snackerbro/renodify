"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Category, PropertyType } from "@/lib/types";
import { Field, Input, Textarea } from "@/components/ds/Field";
import { Button } from "@/components/ds/Button";
import { FilterChip } from "@/components/ds/Chip";
import { Icon } from "@/components/ds/Icon";
import { PROPERTY_TYPES, BUDGET_OPTIONS, TIMELINE_OPTIONS } from "@/lib/constants";

const STEPS = ["Property", "Categories", "Budget", "Contact"];

export function GetQuotesFlow({
  categories,
  initialCategory,
  vendorSlug,
}: {
  categories: Category[];
  initialCategory?: string;
  vendorSlug?: string;
}) {
  const [step, setStep] = useState(0);
  const [property, setProperty] = useState<PropertyType | "">("");
  const [picked, setPicked] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleCategory(slug: string) {
    setPicked((p) => (p.includes(slug) ? p.filter((x) => x !== slug) : [...p, slug]));
  }

  const canContinue =
    (step === 0 && property) ||
    (step === 1 && picked.length > 0) ||
    (step === 2 && budget && timeline) ||
    step === 3;

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyType: property,
          categories: picked,
          budget,
          timeline,
          name,
          contact,
          message,
          pdpaConsent: consent,
          vendorSlugs: vendorSlug ? [vendorSlug] : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="quote-card" style={{ padding: 32, textAlign: "center" }}>
        <span
          className="step-card__n"
          style={{ margin: "0 auto 14px", width: 56, height: 56, borderRadius: 16 }}
        >
          <Icon name="check" size={26} />
        </span>
        <h2>Request sent!</h2>
        <p style={{ color: "var(--rdf-text-secondary)", margin: "10px 0 22px", lineHeight: 1.6 }}>
          We&apos;ve shared your request with relevant vendors. You&apos;ll start receiving quotes
          shortly. Track replies anytime from your dashboard.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/customer-dashboard" className="rdf-btn rdf-btn--primary">
            Track my quotes
          </Link>
          <Link href="/browse-categories" className="rdf-btn rdf-btn--secondary">
            Keep browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="quote-card">
      {/* Progress segments */}
      <div style={{ display: "flex", gap: 6, padding: 18 }}>
        {STEPS.map((s, i) => (
          <div
            key={s}
            title={s}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 999,
              background: i <= step ? "var(--rdf-primary)" : "var(--rdf-border)",
              transition: "background .2s",
            }}
          />
        ))}
      </div>

      <div className="modal__body" style={{ padding: "8px 22px 4px" }}>
        <div className="eyebrow">
          Step {step + 1} of {STEPS.length}
        </div>

        {step === 0 && (
          <>
            <h3 style={{ margin: "6px 0 4px" }}>What type of property?</h3>
            <p style={{ color: "var(--rdf-text-secondary)", margin: 0 }}>
              We match vendors who work with your property type.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              {PROPERTY_TYPES.map((p) => (
                <FilterChip key={p} active={property === p} onClick={() => setProperty(p)}>
                  {p}
                </FilterChip>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h3 style={{ margin: "6px 0 4px" }}>What do you need?</h3>
            <p style={{ color: "var(--rdf-text-secondary)", margin: 0 }}>
              Pick all that apply — select more than one to compare specialists.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              {categories.map((c) => (
                <FilterChip
                  key={c.slug}
                  active={picked.includes(c.slug)}
                  icon={c.icon}
                  onClick={() => toggleCategory(c.slug)}
                >
                  {c.label}
                </FilterChip>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 style={{ margin: "6px 0 12px" }}>Budget &amp; timeline</h3>
            <Field label="Estimated budget">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {BUDGET_OPTIONS.map((b) => (
                  <FilterChip key={b} active={budget === b} onClick={() => setBudget(b)}>
                    {b}
                  </FilterChip>
                ))}
              </div>
            </Field>
            <Field label="Timeline" className="full">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TIMELINE_OPTIONS.map((t) => (
                  <FilterChip key={t} active={timeline === t} onClick={() => setTimeline(t)}>
                    {t}
                  </FilterChip>
                ))}
              </div>
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <h3 style={{ margin: "6px 0 12px" }}>How can vendors reach you?</h3>
            <Field label="Your name" htmlFor="q-name">
              <Input id="q-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarah Tan" />
            </Field>
            <Field label="Phone or email" htmlFor="q-contact">
              <Input
                id="q-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+65 9xxx xxxx or you@email.com"
              />
            </Field>
            <Field label="Anything else? (optional)" htmlFor="q-msg">
              <Textarea
                id="q-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share unit size, preferences, or questions."
              />
            </Field>
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, color: "var(--rdf-text-secondary)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ marginTop: 3, width: 18, height: 18, flex: "none" }}
              />
              <span>
                I consent to Renodify sharing my contact details with matched vendors so they can
                respond to my enquiry, in line with the{" "}
                <Link href="/legal">PDPA Privacy Policy</Link>.
              </span>
            </label>
            {error && (
              <div className="danger-note">
                <Icon name="shield" size={18} /> {error}
              </div>
            )}
          </>
        )}
      </div>

      <div className="modal__foot" style={{ padding: "12px 22px 22px" }}>
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep((s) => s - 1)} type="button">
            Back
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button
            variant="primary"
            className="grow"
            disabled={!canContinue}
            onClick={() => setStep((s) => s + 1)}
            type="button"
          >
            Continue
          </Button>
        ) : (
          <Button
            variant="primary"
            className="grow"
            disabled={!name || !contact || !consent || submitting}
            onClick={submit}
            type="button"
          >
            {submitting ? "Sending…" : "Send request"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default GetQuotesFlow;
