"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[100dvh] bg-gray-50 dark:bg-gray-950">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto pb-safe">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
