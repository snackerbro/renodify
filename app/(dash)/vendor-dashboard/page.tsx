import React from "react";
import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/services/account";
import { getVendorById } from "@/lib/services/catalog";
import { listEnquiriesForVendor } from "@/lib/services/enquiries";
import { getSubscriptionForVendor } from "@/lib/services/subscriptions";
import { VendorDashboard } from "@/components/dashboard/VendorDashboard";
import { SAMPLE_VENDORS } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "Vendor dashboard",
  robots: { index: false, follow: false },
};

export default async function VendorDashboardPage() {
  const profile = await getCurrentProfile();

  // Resolve the vendor record for the signed-in vendor, else fall back to a
  // demo vendor so the dashboard is explorable before auth/DB are configured.
  let vendor = null;
  if (profile?.vendorId) vendor = await getVendorById(profile.vendorId);
  const demoMode = !vendor;
  if (!vendor) vendor = SAMPLE_VENDORS[0];

  const [enquiries, subscription] = await Promise.all([
    listEnquiriesForVendor(vendor.id),
    getSubscriptionForVendor(vendor.id),
  ]);

  return (
    <VendorDashboard
      vendor={vendor}
      enquiries={enquiries}
      subscription={subscription}
      demoMode={demoMode}
    />
  );
}
