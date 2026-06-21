import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Vendor } from "@/lib/types";
import { Rating } from "@/components/ds/Rating";
import { Badge } from "@/components/ds/Badge";
import { Icon } from "@/components/ds/Icon";
import { ButtonLink } from "@/components/ds/Button";
import { DEFAULT_COVER_URL } from "@/lib/constants";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const href = `/vendor/${vendor.slug}`;
  const monogram = vendor.name.slice(0, 1).toUpperCase();
  return (
    <article className="rdf-vendor">
      <Link href={href} className="rdf-vendor__media" aria-label={vendor.name}>
        <Image
          src={vendor.coverUrl || DEFAULT_COVER_URL}
          alt=""
          width={480}
          height={300}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <span className="rdf-vendor__media-badges">
          {vendor.deal && <Badge variant="deal">{vendor.deal}</Badge>}
          {vendor.unclaimed && <Badge variant="neutral">Unclaimed</Badge>}
        </span>
      </Link>
      <div className="rdf-vendor__body">
        <div className="rdf-vendor__head">
          <span className="rdf-vendor__logo">
            {vendor.logoUrl ? <Image src={vendor.logoUrl} alt="" width={46} height={46} /> : monogram}
          </span>
          <span className="rdf-vendor__title">
            <Link href={href} className="rdf-vendor__name" style={{ color: "inherit" }}>
              {vendor.name}
            </Link>
            <span className="rdf-vendor__cat">
              {vendor.category} · {vendor.areas.join(", ")}
            </span>
          </span>
        </div>

        {vendor.reviewCount > 0 && (
          <div className="rdf-vendor__meta">
            <Rating value={vendor.ratingAvg} count={vendor.reviewCount} size={14} />
          </div>
        )}

        {(vendor.yearsInBusiness > 0 || vendor.responseRate || vendor.priceFrom) && (
          <div className="rdf-vendor__meta">
            {vendor.yearsInBusiness > 0 && (
              <span className="rdf-vendor__meta-item">
                <Icon name="building" size={15} /> {vendor.yearsInBusiness} yrs
              </span>
            )}
            {typeof vendor.responseRate === "number" && (
              <span className="rdf-vendor__meta-item">
                <Icon name="message" size={15} /> {vendor.responseRate}% reply
              </span>
            )}
            {vendor.priceFrom && (
              <span className="rdf-vendor__meta-item">
                <Icon name="tag" size={15} /> from {vendor.priceFrom}
              </span>
            )}
          </div>
        )}

        <div className="rdf-vendor__tags">
          {vendor.propertyTypes.map((p) => (
            <Badge key={p} variant="property">
              {p}
            </Badge>
          ))}
          <Badge variant="verified-pending">Verification pending</Badge>
        </div>

        <div className="rdf-vendor__footer">
          <ButtonLink href={href} variant="secondary" size="sm">
            View profile
          </ButtonLink>
          <ButtonLink href={`/get-quotes?vendor=${vendor.slug}`} variant="primary" size="sm">
            Get quote
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

export default VendorCard;
