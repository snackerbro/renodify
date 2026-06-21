"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ds/Button";
import { Icon } from "@/components/ds/Icon";

export function ClaimButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function claim() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/vendor/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push(`/register?role=vendor&next=${encodeURIComponent(`/claim/${slug}`)}`);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Could not claim this listing");
      // Claimed — go to the dashboard to complete the profile & subscribe.
      router.push("/vendor-dashboard?claimed=1");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Button variant="primary" size="lg" onClick={claim} disabled={busy} iconRight="arrowRight">
        {busy ? "Claiming…" : "Claim this business"}
      </Button>
      {error && (
        <div className="danger-note" style={{ marginTop: 14 }}>
          <Icon name="shield" size={18} /> {error}
        </div>
      )}
    </div>
  );
}

export default ClaimButton;
