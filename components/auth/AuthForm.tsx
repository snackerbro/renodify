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

type Mode = "login" | "register" | "forgot";

const COPY: Record<Mode, { title: string; sub: string; cta: string }> = {
  login: { title: "Welcome back", sub: "Log in to manage your enquiries and account.", cta: "Log in" },
  register: { title: "Create your account", sub: "Join Renodify in under a minute.", cta: "Create account" },
  forgot: { title: "Reset password", sub: "We'll email you a reset link.", cta: "Send reset link" },
};

export function AuthForm({ mode, defaultRole = "customer" }: { mode: Mode; defaultRole?: Role }) {
  const router = useRouter();
  const [role, setRole] = useState<Exclude<Role, "homeowner">>(
    defaultRole === "vendor" ? "vendor" : "customer",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const dest = role === "vendor" ? "/vendor-dashboard" : "/customer-dashboard";

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!hasSupabaseEnv) {
      setError("Authentication isn't configured yet. Add Supabase keys (see SETUP.md).");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(dest);
        router.refresh();
      } else if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role, full_name: fullName, business_name: businessName },
            emailRedirectTo: `${window.location.origin}${dest}`,
          },
        });
        if (error) throw error;
        setNotice("Account created. Check your email to confirm, then log in.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
        setNotice("If that email exists, a reset link is on its way.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
          {[
            "Property-aware matching",
            "Moderated, trustworthy reviews",
            "Free for homeowners",
          ].map((p) => (
            <div className="auth__point" key={p}>
              <span className="ic">
                <Icon name="check" size={18} />
              </span>
              {p}
            </div>
          ))}
        </div>
      </div>

      <div className="auth__panelwrap">
        <div className="auth__panel">
          <div className="auth-card">
            <h1 className="auth-card__title">{c.title}</h1>
            <p className="auth-card__sub">{c.sub}</p>

            {mode !== "forgot" && (
              <div className="roletoggle" style={{ marginBottom: 18 }}>
                <button
                  type="button"
                  aria-pressed={role === "customer"}
                  onClick={() => setRole("customer")}
                >
                  <Icon name="user" size={16} /> Homeowner
                </button>
                <button
                  type="button"
                  aria-pressed={role === "vendor"}
                  onClick={() => setRole("vendor")}
                >
                  <Icon name="building" size={16} /> Vendor
                </button>
              </div>
            )}

            <form className="auth-form" onSubmit={handle}>
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
                <Input id="a-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </Field>

              {mode !== "forgot" && (
                <Field label="Password" htmlFor="a-pwd">
                  <div className="pwd">
                    <Input
                      id="a-pwd"
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                    />
                    <button type="button" className="pwd__eye" onClick={() => setShowPwd((s) => !s)} aria-label="Toggle password">
                      <Icon name={showPwd ? "eyeOff" : "eye"} size={18} />
                    </button>
                  </div>
                </Field>
              )}

              {mode === "login" && (
                <div className="auth-meta">
                  <span />
                  <Link href="/forgot-password" className="auth-link">
                    Forgot password?
                  </Link>
                </div>
              )}

              {error && (
                <div className="danger-note">
                  <Icon name="shield" size={18} /> {error}
                </div>
              )}
              {notice && (
                <div className="note-row" style={{ borderStyle: "solid" }}>
                  <Icon name="check" size={18} color="var(--rdf-success)" /> {notice}
                </div>
              )}

              <Button variant="primary" block disabled={busy} type="submit">
                {busy ? "Please wait…" : c.cta}
              </Button>
            </form>

            <p className="auth-foot">
              {mode === "login" ? (
                <>
                  New to Renodify? <Link href="/register">Create an account</Link>
                </>
              ) : mode === "register" ? (
                <>
                  Already have an account? <Link href="/login">Log in</Link>
                </>
              ) : (
                <>
                  Remembered it? <Link href="/login">Back to log in</Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
