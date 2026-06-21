import React from "react";
import Link from "next/link";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary" | "solid" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

interface StyleProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  iconLeft?: string;
  iconRight?: string;
  className?: string;
  children?: React.ReactNode;
}

function classes(variant: Variant, size: Size, block?: boolean, className?: string) {
  return [
    "rdf-btn",
    `rdf-btn--${variant}`,
    size !== "md" ? `rdf-btn--${size}` : "",
    block ? "rdf-btn--block" : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");
}

const iconSize = (size?: Size) => (size === "sm" ? 16 : size === "lg" ? 20 : 18);

export function Button({
  variant = "primary",
  size = "md",
  block,
  iconLeft,
  iconRight,
  className,
  children,
  ...rest
}: StyleProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes(variant, size, block, className)} {...rest}>
      {iconLeft && <Icon name={iconLeft} size={iconSize(size)} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize(size)} />}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  block,
  iconLeft,
  iconRight,
  className,
  children,
  href,
  ...rest
}: StyleProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >) {
  return (
    <Link href={href} className={classes(variant, size, block, className)} {...rest}>
      {iconLeft && <Icon name={iconLeft} size={iconSize(size)} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize(size)} />}
    </Link>
  );
}

export default Button;
