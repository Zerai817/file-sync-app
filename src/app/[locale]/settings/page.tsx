"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FolderPicker, MobileNav } from "@/components/sync/SyncComponents";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, Globe } from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
];

export default function SettingsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <SettingsContent />
        <MobileNav />
      </DashboardLayout>
    </AuthGuard>
  );
}

function SettingsContent() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const { user, refreshUser } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [name, setName] = useState(user?.name || "");
  const [syncMode, setSyncMode] = useState(user?.syncMode || "auto");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, syncMode }),
      });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = async (newLocale: string) => {
    await fetch("/api/user/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: newLocale }),
    });
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">{t("profile")}</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label={t("displayName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input label="Email" value={user?.email || ""} disabled />
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 mb-3">{t("logoutAccount")}</p>
            <LogoutButton variant="danger" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t("language")}
          </h2>
          <p className="text-sm text-gray-500">{t("languageDesc")}</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {languages.map(({ code, label }) => (
              <Button
                key={code}
                variant={locale === code ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleLanguageChange(code)}
              >
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">{t("sync")}</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">{t("syncMode")}</p>
            <p className="text-xs text-gray-500 mb-3">{t("syncModeDesc")}</p>
            <div className="flex gap-2">
              <Button
                variant={syncMode === "auto" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setSyncMode("auto")}
              >
                Auto
              </Button>
              <Button
                variant={syncMode === "manual" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setSyncMode("manual")}
              >
                Manual
              </Button>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">{t("folder")}</p>
            <p className="text-xs text-gray-500 mb-3">{t("folderDesc")}</p>
            <FolderPicker />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">{t("theme")}</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-500">
            {resolvedTheme === "dark" ? t("darkMode") : "Light mode"} active
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={theme === "light" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setTheme("light")}
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-4 w-4" />
              {t("darkMode")}
            </Button>
            <Button
              variant={theme === "system" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setTheme("system")}
            >
              System
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} loading={saving}>
          {t("saveSettings")}
        </Button>
        {saved && <span className="text-sm text-green-600">{t("settingsSaved")}</span>}
      </div>
    </div>
  );
}
