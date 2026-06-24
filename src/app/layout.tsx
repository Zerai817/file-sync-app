import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SyncFlow - Personal File Sync",
  description: "Cross-platform personal file synchronization across iOS, Android, and Desktop",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
