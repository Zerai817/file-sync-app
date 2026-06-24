"use client";

import { useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Card, CardContent } from "@/components/ui/Card";

export function LoginPageContent() {
  const t = useTranslations("auth");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 mb-4">
            <RefreshCw className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("loginTitle")}</h1>
          <p className="text-gray-500 mt-2">{t("loginSubtitle")}</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <AuthForm mode="login" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function RegisterPageContent() {
  const t = useTranslations("auth");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 mb-4">
            <RefreshCw className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("registerTitle")}</h1>
          <p className="text-gray-500 mt-2">{t("registerSubtitle")}</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <AuthForm mode="register" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
