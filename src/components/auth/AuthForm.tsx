"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const t = useTranslations("auth");
  const { login, register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, name || undefined);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <Input
          label={t("name")}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      )}
      <Input
        label={t("email")}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        label={t("password")}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        error={error || undefined}
      />
      {mode === "login" && (
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            {t("forgotPassword")}
          </Link>
        </div>
      )}
      {mode === "register" && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("passwordHint")}</p>
      )}
      <Button type="submit" className="w-full" loading={loading}>
        {mode === "login" ? t("login") : t("register")}
      </Button>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        {mode === "login" ? t("noAccount") : t("hasAccount")}{" "}
        <Link
          href={mode === "login" ? "/register" : "/login"}
          className="text-blue-600 hover:underline"
        >
          {mode === "login" ? t("signUp") : t("signIn")}
        </Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("resetFailed"));
      setMessage(t("resetEmailSent"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("resetFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">{t("forgotPasswordDesc")}</p>
      <Input
        label={t("email")}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        error={error || undefined}
      />
      {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
      <Button type="submit" className="w-full" loading={loading}>
        {t("sendResetLink")}
      </Button>
      <p className="text-center text-sm">
        <Link href="/login" className="text-blue-600 hover:underline">
          {t("backToLogin")}
        </Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    if (password.length < 8) {
      setError(t("passwordHint"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("resetFailed"));
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("resetFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-red-500">{t("invalidResetLink")}</p>
        <Link href="/forgot-password" className="text-blue-600 hover:underline text-sm">
          {t("requestNewLink")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">{t("resetPasswordDesc")}</p>
      <Input
        label={t("newPassword")}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        autoComplete="new-password"
      />
      <Input
        label={t("confirmPassword")}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        minLength={8}
        autoComplete="new-password"
        error={error || undefined}
      />
      <Button type="submit" className="w-full" loading={loading}>
        {t("resetPassword")}
      </Button>
    </form>
  );
}
