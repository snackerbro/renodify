"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { Field, Input } from "@/components/ds/Field";
import { Button } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";
import type { Role } from "@/lib/types";

type Mode = "login" | "register";

const COPY: Record<Mode, { title: string; sub: string }> = {
  login: { title: "Log in", sub: "Enter your email and we'll send you a one-time code." },
  register: { title: "Create your account", sub: "No password needed — we'll email you a code." },
};

export function AuthForm({ mode, defaultRole = "customer" }: { mode: Mode; defaultRole?: Role }) {
  const router = useRouter();
  const [role, setRole] = useState<Exclude<Role, "homeowner">>(
    defaultRole === "vendor" ? "vendor" : "customer",
  );
  const [step, setStep] = useState<"enter" | "verify">("enter");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function notConfigured() {
    setError("Authentication isn't configured yet. Add Supabase keys + email (see SETUP.md).");
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!hasSupabaseEnv) return notConfigured();
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: mode === "register",
          data:
            mode === "register"
              ? { role, full_name: fullName, business_name: businessName }
              : undefined,
        },
      });
      if (error) throw error;
      setStep("verify");
      setNotice(`We sent a 6-digit code to ${email}.`);
    } catch (err) {
      setError(humanize(err, mode));
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!hasSupabaseEnv) return notConfigured();
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code.trim(),
        type: "email",
      });
      if (error) throw error;

      // Resolve destination by role.
      let dest = role === "vendor" ? "/vendor-dashboard" : "/customer-dashboard";
      if (mode === "login") {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();
          if (profile?.role === "vendor") dest = "/vendor-dashboard";
          else dest = "/customer-dashboard";
        }
      }
      router.push(dest);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired code");
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setError(null);
    setNotice(null);
    if (!hasSupabaseEnv) return notConfigured();
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: mode === "register",
          data:
            mode === "register"
              ? { role, full_name: fullName, business_name: businessName }
              : undefined,
        },
      });
      if (error) throw error;
      setNotice("A new code is on its way.");
    } catch (err) {
      setError(humanize(err, mode));
    } finally {
      setBusy(false);
    }
  }

  const c = COPY[mode];

  return (
    <div className="auth__split">
      <div className="auth__brand">
        <h2>
          {role === "vendor"
            ? "Win renovation enquiries from ready homeowners."
            : "Track every renovation quote in one place."}
        </h2>
        <p>
          {role === "vendor"
            ? "Manage your listing, reply to enquiries and grow your business."
            : "Compare vendor replies and saved deals as you finish your renovation."}
        </p>
        <div className="auth__points">
          {["Passwordless — just a one-time code", "Property-aware matching", "Free for homeowners"].map(
            (p) => (
              <div className="auth__point" key={p}>
                <span className="ic">
                  <Icon name="check" size={18} />
                </span>
                {p}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="auth__panelwrap">
        <div className="auth__panel">
          <div className="auth-card">
            <h1 className="auth-card__title">{c.title}</h1>
            <p className="auth-card__sub">{c.sub}</p>

            {step === "enter" ? (
              <>
                {mode === "register" && (
                  <div className="roletoggle" style={{ marginBottom: 18 }}>
                    <button type="button" aria-pressed={role === "customer"} onClick={() => setRole("customer")}>
                      <Icon name="user" size={16} /> Homeowner
                    </button>
                    <button type="button" aria-pressed={role === "vendor"} onClick={() => setRole("vendor")}>
                      <Icon name="building" size={16} /> Vendor
                    </button>
                  </div>
                )}

                <form className="auth-form" onSubmit={sendCode}>
                  {mode === "register" && (
                    <>
                      <Field label="Full name" htmlFor="a-name">
                        <Input id="a-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                      </Field>
                      {role === "vendor" && (
                        <Field label="Business name" htmlFor="a-biz">
                          <Input id="a-biz" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
                        </Field>
                      )}
                    </>
                  )}

                  <Field label="Email" htmlFor="a-email">
                    <Input
                      id="a-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      placeholder="you@email.com"
                    />
                  </Field>

                  {error && (
                    <div className="danger-note">
                      <Icon name="shield" size={18} /> {error}
                    </div>
                  )}

                  <Button variant="primary" block disabled={busy} type="submit">
                    {busy ? "Sending…" : "Send code"}
                  </Button>
                </form>
              </>
            ) : (
              <form className="auth-form" onSubmit={verify}>
                {notice && (
                  <div className="note-row" style={{ borderStyle: "solid" }}>
                    <Icon name="mail" size={18} color="var(--rdf-primary)" /> {notice}
                  </div>
                )}
                <Field label="6-digit code" htmlFor="a-code">
                  <Input
                    id="a-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    required
                    autoFocus
                    style={{ letterSpacing: "0.4em", fontSize: 20, textAlign: "center" }}
                  />
                </Field>

                {error && (
                  <div className="danger-note">
                    <Icon name="shield" size={18} /> {error}
                  </div>
                )}

                <Button variant="primary" block disabled={busy || code.length < 6} type="submit">
                  {busy ? "Verifying…" : "Verify & continue"}
                </Button>

                <div className="auth-meta">
                  <button type="button" className="auth-link" onClick={() => setStep("enter")} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    ← Change email
                  </button>
                  <button type="button" className="auth-link" onClick={resend} disabled={busy} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    Resend code
                  </button>
                </div>
              </form>
            )}

            <p className="auth-foot">
              {mode === "login" ? (
                <>
                  New to Renodify? <Link href="/register">Create an account</Link>
                </>
              ) : (
                <>
                  Already have an account? <Link href="/login">Log in</Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function humanize(err: unknown, mode: Mode): string {
  const msg = err instanceof Error ? err.message : "Something went wrong";
  if (mode === "login" && /signups? not allowed|user not found/i.test(msg)) {
    return "No account found for that email. Create an account first.";
  }
  return msg;
}

export default AuthForm;
