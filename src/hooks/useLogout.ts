"use client";

import { useCallback, useState } from "react";
import { useLocale } from "next-intl";
import { useAuth } from "@/hooks/useAuth";

export function useLogout() {
  const locale = useLocale();
  const { logout: authLogout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    await authLogout();

    // Hard redirect — more reliable on iOS Safari than client router
    window.location.href = `/${locale}/login`;
  }, [locale, authLogout, loggingOut]);

  return { logout, loggingOut };
}
