"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  PanelLeft,
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
  const { t } = useTranslation();

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
    <div
      className={cn(
        "flex h-full flex-col bg-card border-r transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex h-16 items-center px-4 border-b",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">HabitsGoals</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("h-8 w-8", isCollapsed && "w-10 h-10")}
        >
          <PanelLeft className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const linkHref = item.href;
            const isActive =
              pathname === linkHref || pathname.startsWith(`${linkHref}/`);

            return (
              <Link key={item.href} href={linkHref}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start cursor-pointer",
                    isActive && "bg-secondary text-secondary-foreground",
                    isCollapsed ? "px-2 justify-center" : "px-4"
                  )}
                  title={isCollapsed ? item.name : undefined}
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
          <div className="mb-3 px-2">
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
            isCollapsed ? "px-2 justify-center" : "px-4"
          )}
          title={isCollapsed ? t("sidebar.logout", "Log out") : undefined}
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
          {!isCollapsed && t("sidebar.logout", "Log out")}
        </Button>
      </div>
    </div>
  );
}
