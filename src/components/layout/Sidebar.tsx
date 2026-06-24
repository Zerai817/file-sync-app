"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  LayoutDashboard,
  Files,
  Smartphone,
  Settings,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSync } from "@/hooks/useSync";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/auth/LogoutButton";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { href: "/files", icon: Files, key: "files" },
  { href: "/devices", icon: Smartphone, key: "devices" },
  { href: "/settings", icon: Settings, key: "settings" },
] as const;

export function Sidebar() {
  const t = useTranslations("nav");
  const tDash = useTranslations("dashboard");
  const pathname = usePathname();
  const { sync, syncing } = useSync();

  return (
    <aside className="flex h-full w-64 flex-col border-e border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <RefreshCw className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">SyncFlow</span>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, icon: Icon, key }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
            >
              <Icon className="h-5 w-5" />
              {t(key)}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 p-4 dark:border-gray-800 space-y-2">
        <Button
          className="w-full"
          onClick={() => sync()}
          loading={syncing}
          size="sm"
        >
          <RefreshCw className="h-4 w-4" />
          {syncing ? tDash("syncing") : tDash("quickSync")}
        </Button>
        <LogoutButton fullWidth className="justify-start px-3" />
      </div>
    </aside>
  );
}
