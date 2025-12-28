"use client";

import { AppLayout } from "@/components/layout/app-layout";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  return <AppLayout>{children}</AppLayout>;
}
