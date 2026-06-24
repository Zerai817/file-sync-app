"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLogout } from "@/hooks/useLogout";
import { Button } from "@/components/ui/Button";

interface LogoutButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
  fullWidth?: boolean;
}

export function LogoutButton({ variant = "ghost", className, fullWidth }: LogoutButtonProps) {
  const t = useTranslations("common");
  const logout = useLogout();

  return (
    <Button
      variant={variant}
      onClick={() => logout()}
      className={fullWidth ? `w-full ${className || ""}` : className}
    >
      <LogOut className="h-4 w-4" />
      {t("logout")}
    </Button>
  );
}
