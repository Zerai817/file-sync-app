"use client";

import { useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { useSync } from "@/hooks/useSync";

export function MobileHeader() {
  const t = useTranslations("dashboard");
  const { sync, syncing } = useSync();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 md:hidden safe-top">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <RefreshCw className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-gray-900 dark:text-white">SyncFlow</span>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={() => sync()} loading={syncing}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
