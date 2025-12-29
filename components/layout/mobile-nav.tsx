"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Target,
  TrendingUp,
  CheckSquare,
  BarChart3,
  Settings,
  Menu,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "@/app/i18n/client";

export function MobileNav() {
  const pathname = usePathname();
  const { userProfile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">HabitsGoals</span>
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start cursor-pointer mb-2",
                        isActive && "bg-secondary text-secondary-foreground"
                      )}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          <div className="border-t p-4">
            {userProfile && (
              <div className="mb-4">
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
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="w-full justify-start text-muted-foreground"
            >
              <LogOut className="mr-3 h-4 w-4" />
              {t("sidebar.logout", "Log out")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
