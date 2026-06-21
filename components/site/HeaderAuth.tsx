"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { Button, ButtonLink } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";

interface AuthState {
  loading: boolean;
  email?: string | null;
  dash?: string;
}

/**
 * Client-side auth island for the header. Keeps the rest of the page static
 * while reflecting the signed-in session, and subscribes to auth changes so
 * sign-in / sign-out update instantly. Session itself is managed by
 * @supabase/ssr (cookie-based) and refreshed in proxy.ts middleware.
 */
export function HeaderAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ loading: true });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!hasSupabaseEnv) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ loading: false, email: null });
      return;
    }
    const supabase = createClient();
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      if (!user) {
        setState({ loading: false, email: null });
        return;
      }
      const { data: prof } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setState({
        loading: false,
        email: user.email,
        dash: prof?.role === "vendor" ? "/vendor-dashboard" : "/customer-dashboard",
      });
    }
    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setState({ loading: false, email: null });
    setBusy(false);
    router.push("/");
    router.refresh();
  }

  // Avoid layout shift / flash before we know the state.
  if (state.loading) return <span style={{ width: 1 }} aria-hidden />;

  if (!state.email) {
    return (
      <ButtonLink href="/login" variant="ghost" aria-label="Sign in">
        <Icon name="user" size={20} />
      </ButtonLink>
    );
  }

  return (
    <>
      <Link href={state.dash || "/customer-dashboard"} className="site-header__list">
        Dashboard
      </Link>
      <Button variant="ghost" size="sm" iconLeft="logOut" onClick={logout} disabled={busy}>
        {busy ? "…" : "Log out"}
      </Button>
    </>
  );
}

export default HeaderAuth;
