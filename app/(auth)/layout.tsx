import React from "react";
import Link from "next/link";
import { Logo } from "@/components/site/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rdf-site">
      <div className="container">
        <div className="auth__topbar">
          <Link href="/" aria-label="Renodify home">
            <Logo />
          </Link>
        </div>
      </div>
      <div className="auth">
        <div className="auth__grid">{children}</div>
      </div>
    </div>
  );
}
