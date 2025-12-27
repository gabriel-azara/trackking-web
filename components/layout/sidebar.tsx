"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Target,
  TrendingUp,
  CheckSquare,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "@/app/i18n/client";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { userProfile, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const params = useParams();
  const lng = params.lng as string;
  const { t } = useTranslation(lng);

  const navigation = [
    {
      name: t("sidebar.dashboard", "Dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t("sidebar.habits", "Habits"),
      href: "/habits",
      icon: Target,
    },
    {
      name: t("sidebar.goals", "Goals"),
      href: "/goals",
      icon: TrendingUp,
    },
    {
      name: t("sidebar.tasks", "Tasks"),
      href: "/tasks",
      icon: CheckSquare,
    },
    {
      name: t("sidebar.reports", "Reports"),
      href: "/reports",
      icon: BarChart3,
    },
    {
      name: t("sidebar.settings", "Settings"),
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className={cn("flex h-full flex-col bg-card border-r", className)}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg">HabitsGoals</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const linkHref = `/${lng}${item.href}`;
            // Check if pathname matches the link href (handling potential trailing slash or sub-paths if strict)
            // Or simply strict match for now
            const isActive =
              pathname === linkHref || pathname.startsWith(`${linkHref}/`);

            return (
              <Link key={item.href} href={linkHref}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start cursor-pointer",
                    isActive && "bg-secondary  text-secondary-foreground",
                    isCollapsed && "px-2"
                  )}
                >
                  <item.icon
                    className={cn("h-4 w-4", !isCollapsed && "mr-3")}
                  />
                  {!isCollapsed && item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Profile & Sign Out */}
      <div className="border-t p-3">
        {!isCollapsed && userProfile && (
          <div className="mb-3">
            <p className="text-sm font-medium truncate">
              {userProfile.name || "Usuário"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userProfile.email}
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={signOut}
          className={cn(
            "w-full justify-start text-muted-foreground",
            isCollapsed && "px-2"
          )}
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
          {!isCollapsed && t("sidebar.logout", "Log out")}
        </Button>
      </div>
    </div>
  );
}
