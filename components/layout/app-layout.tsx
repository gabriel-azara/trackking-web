"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Sidebar } from "./sidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar className="w-64 hidden md:flex" />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
