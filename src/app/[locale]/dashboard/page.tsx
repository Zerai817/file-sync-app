"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Files, HardDrive, Smartphone, RefreshCw } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { SyncButton, SyncStatusBadge, MobileNav } from "@/components/sync/SyncComponents";
import { useAuth } from "@/hooks/useAuth";
import { useSync, type SyncStatus } from "@/hooks/useSync";
import { formatFileSize } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { SyncOnOpen } from "@/components/sync/SyncOnOpen";

interface FileItem {
  id: string;
  originalName: string;
  sizeFormatted?: string;
  createdAt: string;
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <DashboardContent />
        <MobileNav />
      </DashboardLayout>
    </AuthGuard>
  );
}

function DashboardContent() {
  const t = useTranslations("dashboard");
  const { user } = useAuth();
  const { getStatus } = useSync();
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [recentFiles, setRecentFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    getStatus().then(setStatus);
    fetch("/api/files")
      .then((r) => r.json())
      .then((d) => setRecentFiles((d.files || []).slice(0, 5)))
      .catch(() => {});
  }, [getStatus]);

  const stats = [
    {
      label: t("totalFiles"),
      value: status?.fileCount ?? 0,
      icon: Files,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: t("totalSize"),
      value: formatFileSize(status?.totalSize ?? 0),
      icon: HardDrive,
      color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    },
    {
      label: t("connectedDevices"),
      value: status?.devices?.length ?? 0,
      icon: Smartphone,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <SyncOnOpen />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
          <p className="text-gray-500 mt-1">
            {t("welcome", { name: user?.name || user?.email || "User" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SyncStatusBadge />
          <SyncButton />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-xl font-semibold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{t("syncStatus")}</h2>
            <Badge variant="success">
              <RefreshCw className="h-3 w-3 me-1" />
              {status?.lastSyncAt
                ? `${t("lastSync")}: ${formatRelativeTime(status.lastSyncAt)}`
                : t("neverSynced")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="font-medium text-sm mb-1">{t("autoMode")}</h3>
              <p className="text-xs text-gray-500">{t("autoModeDesc")}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <h3 className="font-medium text-sm mb-1">{t("manualMode")}</h3>
              <p className="text-xs text-gray-500">{t("manualModeDesc")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {recentFiles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{t("recentFiles")}</h2>
              <Link href="/files" className="text-sm text-blue-600 hover:underline">
                {t("viewAll")}
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0"
                >
                  <span className="text-sm truncate">{file.originalName}</span>
                  <span className="text-xs text-gray-500">{file.sizeFormatted}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
