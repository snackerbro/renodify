"use client";

import React, { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { Icon } from "@/components/ds/Icon";

const MAX_BYTES = 2 * 1024 * 1024;
const BUCKET = "vendor-logos";

export function LogoUpload({
  vendorId,
  initialUrl,
  onChange,
}: {
  vendorId: string;
  initialUrl?: string | null;
  onChange?: (url: string | null) => void;
}) {
  const [url, setUrl] = useState<string | null>(initialUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!/image\/(png|svg\+xml|jpeg|webp)/.test(file.type)) {
      setError("Use a PNG, SVG, JPG or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Max file size is 2 MB.");
      return;
    }

    setBusy(true);
    try {
      if (hasSupabaseEnv) {
        const supabase = createClient();
        const ext = file.name.split(".").pop() || "png";
        const path = `${vendorId}/logo-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { upsert: true, cacheControl: "3600" });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        setUrl(data.publicUrl);
        onChange?.(data.publicUrl);
      } else {
        // Demo mode — preview only.
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        onChange?.(objectUrl);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  function remove() {
    setUrl(null);
    onChange?.(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="logo-upload">
      <div className="logo-upload__preview">
        {url ? (
          <div className="logo-upload__img" style={{ backgroundImage: `url(${url})` }} />
        ) : (
          <span className="logo-upload__ph">
            <Icon name="image" size={28} />
          </span>
        )}
      </div>
      <div className="logo-upload__body">
        <p className="logo-upload__hint">
          Recommended <strong>512 × 512px</strong> (min 200), PNG/SVG transparent, max 2 MB.
        </p>
        {error && (
          <p style={{ color: "var(--rdf-danger)", fontSize: 13, margin: "0 0 10px" }}>{error}</p>
        )}
        <div className="logo-upload__actions">
          <label className="logo-upload__btn">
            <Icon name="image" size={16} />
            {busy ? "Uploading…" : url ? "Replace" : "Upload logo"}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/svg+xml,image/jpeg,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </label>
          {url && (
            <button type="button" className="btn-ghost btn-ghost--sm" onClick={remove}>
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LogoUpload;
