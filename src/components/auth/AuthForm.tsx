"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
      {mode === "register" && (
        <p className="text-xs text-gray-500">{t("passwordHint")}</p>
      )}
      <Button type="submit" className="w-full" loading={loading}>
        {mode === "login" ? t("login") : t("register")}
      </Button>
      <p className="text-center text-sm text-gray-500">
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
