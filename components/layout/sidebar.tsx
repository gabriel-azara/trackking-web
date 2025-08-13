"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Target, TrendingUp, CheckSquare, BarChart3, Settings, Menu, X, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Hábitos",
    href: "/habits",
    icon: Target,
  },
  {
    name: "Metas",
    href: "/goals",
    icon: TrendingUp,
  },
  {
    name: "Tarefas",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Relatórios",
    href: "/reports",
    icon: BarChart3,
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { userProfile, signOut } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn("flex h-full flex-col bg-card border-r", className)}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && <span className="font-bold text-lg">HabitsGoals</span>}
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-secondary text-secondary-foreground",
                    isCollapsed && "px-2",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                  {!isCollapsed && item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Profile & Sign Out */}
      <div className="border-t p-3">
        {!isCollapsed && userProfile && (
          <div className="mb-3">
            <p className="text-sm font-medium truncate">{userProfile.name || "Usuário"}</p>
            <p className="text-xs text-muted-foreground truncate">{userProfile.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={signOut}
          className={cn("w-full justify-start text-muted-foreground", isCollapsed && "px-2")}
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Sair"}
        </Button>
      </div>
    </div>
  )
}
