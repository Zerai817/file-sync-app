"use client";

import { useCallback } from "react";
import { useRouter } from "@/i18n/navigation";

export function clearLocalSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("syncflow-device-id");
  localStorage.removeItem("syncflow-offline-queue");
  localStorage.removeItem("syncflow-folder-handle");
}

export function useLogout() {
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      clearLocalSession();
      router.push("/login");
      router.refresh();
    }
  }, [router]);

  return logout;
}
