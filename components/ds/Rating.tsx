import React from "react";
import { ICONS } from "@/lib/icons";

export function Rating({
  value,
  count,
  showValue = true,
  size = 16,
}: {
  value: number;
  count?: number;
  showValue?: boolean;
  size?: number;
}) {
  const stars = [0, 1, 2, 3, 4].map((i) => i < Math.round(value));
  return (
    <span className="rdf-rating">
      <span className="rdf-rating__stars" aria-hidden>
        {stars.map((filled, i) => (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
            className={filled ? undefined : "rdf-rating__star--empty"}
            dangerouslySetInnerHTML={{ __html: ICONS.star }}
          />
        ))}
      </span>
      {showValue && <span className="rdf-rating__value">{value.toFixed(1)}</span>}
      {typeof count === "number" && (
        <span className="rdf-rating__count">({count})</span>
      )}
    </span>
  );
}

export default Rating;
