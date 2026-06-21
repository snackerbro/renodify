// Domain helpers for vendor claim verification.

/** Normalised hostname from a URL (lowercased, no leading www). */
export function hostFromUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const h = new URL(url.includes("://") ? url : `https://${url}`).hostname.toLowerCase();
    return h.startsWith("www.") ? h.slice(4) : h;
  } catch {
    return null;
  }
}

/** Domain portion of an email address (lowercased). */
export function domainFromEmail(email?: string | null): string | null {
  if (!email || !email.includes("@")) return null;
  return email.split("@").pop()!.trim().toLowerCase();
}

/**
 * Does an email domain authorise claiming a vendor whose site is `vendorHost`?
 * Exact match, or one is a subdomain of the other (e.g. mail.acme.com ~ acme.com).
 */
export function emailMatchesVendorDomain(
  email: string | null | undefined,
  vendorWebsite: string | null | undefined,
): boolean {
  const e = domainFromEmail(email);
  const v = hostFromUrl(vendorWebsite);
  if (!e || !v) return false;
  return e === v || e.endsWith(`.${v}`) || v.endsWith(`.${e}`);
}
