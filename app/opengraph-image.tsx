import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#12625C",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
          <span>Reno</span>
          <span style={{ color: "#E0823D" }}>dify</span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.05,
            marginTop: 30,
            maxWidth: 900,
          }}
        >
          <span>You found your ID.&nbsp;</span>
          <span style={{ color: "#E0823D" }}>Now find everyone else.</span>
        </div>
        <div style={{ fontSize: 30, marginTop: 28, color: "rgba(255,255,255,0.85)" }}>
          Singapore&apos;s renovation vendor directory
        </div>
      </div>
    ),
    size,
  );
}
