import React from "react";
import Link from "next/link";
import { Icon } from "./Icon";

interface ChipProps {
  active?: boolean;
  icon?: string;
  count?: number | string;
  caret?: boolean;
  children: React.ReactNode;
  className?: string;
}

function ChipInner({ icon, count, caret, children }: ChipProps) {
  return (
    <>
      {icon && <Icon name={icon} size={16} />}
      {children}
      {count !== undefined && <span className="rdf-chip__count">{count}</span>}
      {caret && <Icon name="chevronDown" size={14} />}
    </>
  );
}

function chipClass(active?: boolean, className?: string) {
  return `rdf-chip${active ? " rdf-chip--active" : ""}${className ? ` ${className}` : ""}`;
}

export function FilterChip({
  active,
  icon,
  count,
  caret,
  children,
  className,
  ...rest
}: ChipProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={chipClass(active, className)}
      aria-pressed={active}
      {...rest}
    >
      <ChipInner active={active} icon={icon} count={count} caret={caret}>
        {children}
      </ChipInner>
    </button>
  );
}

export function ChipLink({
  active,
  icon,
  count,
  caret,
  children,
  className,
  href,
  ...rest
}: ChipProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >) {
  return (
    <Link href={href} className={chipClass(active, className)} aria-pressed={active} {...rest}>
      <ChipInner active={active} icon={icon} count={count} caret={caret}>
        {children}
      </ChipInner>
    </Link>
  );
}

export default FilterChip;
