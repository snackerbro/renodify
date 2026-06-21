import React from "react";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`rdf-logo${light ? " rdf-logo--light" : ""}`}>
      <svg
        className="rdf-logo__mark"
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
      >
        <rect width="32" height="32" rx="9" fill="var(--rdf-primary)" />
        <path
          d="M8 21V14l8-6 8 6v7"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M13 21v-4h6v4" stroke="var(--rdf-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="rdf-logo__word">
        Reno<b>dify</b>
      </span>
    </span>
  );
}

export default Logo;
