"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLogout } from "@/hooks/useLogout";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
  fullWidth?: boolean;
  iconOnly?: boolean;
}

export function LogoutButton({
  variant = "ghost",
  className,
  fullWidth,
  iconOnly,
}: LogoutButtonProps) {
  const t = useTranslations("common");
  const { logout, loggingOut } = useLogout();

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={() => logout()}
        disabled={loggingOut}
        aria-label={t("logout")}
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-lg",
          "text-gray-600 hover:bg-gray-100 active:bg-gray-200",
          "dark:text-gray-400 dark:hover:bg-gray-800 dark:active:bg-gray-700",
          "transition-colors touch-manipulation",
          loggingOut && "opacity-50 pointer-events-none",
          className
        )}
      >
        <LogOut className="h-5 w-5" />
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      onClick={() => logout()}
      loading={loggingOut}
      className={cn(fullWidth && "w-full", "min-h-[44px] touch-manipulation", className)}
    >
      <LogOut className="h-4 w-4" />
      {t("logout")}
    </Button>
  );
}
