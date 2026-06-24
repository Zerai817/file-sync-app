"use client";

import { RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Button } from "@/components/ui/Button";
import { useSync } from "@/hooks/useSync";

export function MobileHeader() {
  const { sync, syncing } = useSync();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white/95 px-3 py-2 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 md:hidden safe-top">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
          <RefreshCw className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-gray-900 dark:text-white">SyncFlow</span>
      </div>
      <div className="flex items-center gap-0.5">
        <ThemeToggle className="h-11 w-11" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => sync()}
          loading={syncing}
          className="h-11 w-11 p-0 touch-manipulation"
          aria-label="Sync"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
        <LogoutButton iconOnly />
      </div>
    </header>
  );
}
