import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";

/** Public site wrapper: sticky header, content, footer, and mobile tab bar. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rdf-site">
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default SiteShell;
