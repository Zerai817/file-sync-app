"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg p-2",
        "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        className
      )}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {resolvedTheme === "dark" ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}
