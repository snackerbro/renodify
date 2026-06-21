import React from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import type { Role } from "@/lib/types";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false, follow: true },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const defaultRole: Role = role === "vendor" ? "vendor" : "customer";
  return <AuthForm mode="register" defaultRole={defaultRole} />;
}
