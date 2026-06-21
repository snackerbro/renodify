import React from "react";
import { ICONS } from "@/lib/icons";

export interface IconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
}

/**
 * Renders a Renodify line icon as inline SVG inside an <rdf-icon> element.
 * The custom element tag is intentional: the design-system CSS targets
 * `rdf-icon { color: … }` in many contexts, so matching that selector keeps
 * the icon colors faithful. SVG uses `currentColor`, so it inherits the
 * color the surrounding CSS sets on the element.
 */
export function Icon({ name, size = 24, strokeWidth = 2, className, color }: IconProps) {
  const inner = ICONS[name];
  if (!inner) return null;
  return React.createElement(
    "rdf-icon",
    {
      className,
      "aria-hidden": true,
      style: { display: "inline-flex", lineHeight: 0, color },
    },
    React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: { display: "block" },
      dangerouslySetInnerHTML: { __html: inner },
    }),
  );
}

export default Icon;
