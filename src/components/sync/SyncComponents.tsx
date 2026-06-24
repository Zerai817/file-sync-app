"use client";

import { useTranslations } from "next-intl";
import { RefreshCw, FolderOpen } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useSync } from "@/hooks/useSync";
import { useFileSystemAccess } from "@/hooks/useFileSystemAccess";

export function SyncButton({ deviceId }: { deviceId?: string }) {
  const t = useTranslations("dashboard");
  const { sync, syncing } = useSync();

  return (
    <Button onClick={() => sync(deviceId)} loading={syncing} size="lg">
      <RefreshCw className="h-5 w-5" />
      {syncing ? t("syncing") : t("quickSync")}
    </Button>
  );
}

export function SyncStatusBadge() {
  const { deviceInfo } = useFileSystemAccess();
  const t = useTranslations("dashboard");

  if (!deviceInfo) return null;

  return (
    <Badge variant={deviceInfo.syncMode === "auto" ? "success" : "warning"}>
      {deviceInfo.syncMode === "auto" ? t("autoMode") : t("manualMode")}
    </Badge>
  );
}

export function FolderPicker() {
  const t = useTranslations("settings");
  const tSync = useTranslations("sync");
  const { selectFolder, folderName, supportsFileSystemAccess } = useFileSystemAccess();

  if (!supportsFileSystemAccess) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
          {t("noFolderAccess")}
        </p>
        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
          {t("noFolderAccessDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {folderName ? (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FolderOpen className="h-4 w-4" />
          <span>{folderName}</span>
        </div>
      ) : (
        <p className="text-sm text-gray-500">{tSync("folderPermission")}</p>
      )}
      <Button variant="secondary" size="sm" onClick={selectFolder}>
        <FolderOpen className="h-4 w-4" />
        {folderName ? t("changeFolder") : t("selectFolder")}
      </Button>
    </div>
  );
}

export function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", label: t("dashboard") },
    { href: "/files", label: t("files") },
    { href: "/devices", label: t("devices") },
    { href: "/settings", label: t("settings") },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 flex border-t border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95 md:hidden safe-bottom">
      {items.map(({ href, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 py-3 text-center text-xs font-medium ${
              active ? "text-blue-600" : "text-gray-500"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
