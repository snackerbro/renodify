import React from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rdf-site">
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
