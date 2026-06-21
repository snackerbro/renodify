import React from "react";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { Icon } from "@/components/ds/Icon";

export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link href={`/category/${category.slug}`} className="rdf-tile">
      <span className="rdf-tile__icon">
        <Icon name={category.icon} size={24} />
      </span>
      <span className="rdf-tile__label">{category.label}</span>
      {typeof category.vendorCount === "number" && (
        <span className="rdf-tile__count">
          {category.vendorCount} {category.vendorCount === 1 ? "vendor" : "vendors"}
        </span>
      )}
    </Link>
  );
}

export default CategoryTile;
