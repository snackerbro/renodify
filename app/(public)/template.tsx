"use client";

import { usePathname } from "next/navigation";

// Keying the wrapper by pathname forces a fresh DOM node on every navigation,
// so the CSS entrance animation reliably replays page-to-page (including
// list → detail routes like /events → /events/[slug]). Header/footer live in
// the layout and stay put.
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
