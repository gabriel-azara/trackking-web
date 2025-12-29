"use client";

import type React from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar className="hidden md:flex" />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Mobile Header */}
          <header className="md:hidden flex h-14 items-center gap-4 border-b bg-background px-6">
            <MobileNav />
            <div className="font-semibold text-lg">HabitsGoals</div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 md:p-6">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
