"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { AuthGuard } from "@/components/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileUpload, FileUploadButton } from "@/components/files/FileUpload";
import { FileGrid } from "@/components/files/FileGrid";
import { MobileNav } from "@/components/sync/SyncComponents";

interface FileItem {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  sizeFormatted?: string;
  createdAt: string;
}

export default function FilesPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <FilesContent />
        <MobileNav />
      </DashboardLayout>
    </AuthGuard>
  );
}

function FilesContent() {
  const t = useTranslations("files");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/files");
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
        <FileUploadButton onUploadComplete={fetchFiles} />
      </div>

      <FileUpload onUploadComplete={fetchFiles} />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <FileGrid files={files} onDelete={() => {}} onRefresh={fetchFiles} />
      )}
    </div>
  );
}
