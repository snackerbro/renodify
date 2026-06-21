import React from "react";
import { Icon } from "./Icon";

type BadgeVariant = "verified" | "verified-pending" | "deal" | "property" | "neutral";

const ICON_FOR: Partial<Record<BadgeVariant, string>> = {
  verified: "shieldCheck",
  "verified-pending": "shield",
  deal: "tag",
};

export function Badge({
  variant = "neutral",
  children,
  icon,
}: {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: string;
}) {
  const ic = icon ?? ICON_FOR[variant];
  return (
    <span className={`rdf-badge rdf-badge--${variant}`}>
      {ic && <Icon name={ic} size={13} />}
      {children}
    </span>
  );
}

/** The reserved-slot verification state shown everywhere until the programme launches. */
export function VerifiedPendingBadge() {
  return <Badge variant="verified-pending">Verification pending</Badge>;
}

export default Badge;
