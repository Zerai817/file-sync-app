"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  FileText,
  Image,
  Film,
  Music,
  Archive,
  Download,
  Trash2,
  Grid3X3,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { triggerDownload } from "@/lib/download";

interface FileItem {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  sizeFormatted?: string;
  createdAt: string;
}

interface FileGridProps {
  files: FileItem[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.startsWith("video/")) return Film;
  if (mimeType.startsWith("audio/")) return Music;
  if (mimeType.includes("zip") || mimeType.includes("archive")) return Archive;
  return FileText;
}

export function FileGrid({ files, onDelete, onRefresh }: FileGridProps) {
  const t = useTranslations("files");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDownload = async (file: FileItem) => {
    const res = await fetch(`/api/files/${file.id}`);
    if (!res.ok) return;
    const blob = await res.blob();
    triggerDownload(blob, file.originalName);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    setDeleting(id);
    try {
      await fetch(`/api/files/${id}`, { method: "DELETE" });
      onRefresh();
    } finally {
      setDeleting(null);
    }
  };

  if (files.length === 0) {
    return (
      <Card className="p-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t("noFiles")}</h3>
        <p className="text-sm text-gray-500 mt-1">{t("noFilesDesc")}</p>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-end gap-2 mb-4">
        <Button
          variant={view === "grid" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setView("grid")}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={view === "list" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setView("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => {
            const Icon = getFileIcon(file.mimeType);
            return (
              <Card key={file.id} className="p-4 group hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 mb-3">
                    <Icon className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate w-full">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{file.sizeFormatted}</p>
                  <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(file)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(file.id)}
                      loading={deleting === file.id}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-4 py-3 text-start font-medium text-gray-500">{t("fileName")}</th>
                  <th className="px-4 py-3 text-start font-medium text-gray-500">{t("fileSize")}</th>
                  <th className="px-4 py-3 text-start font-medium text-gray-500 hidden sm:table-cell">
                    {t("fileDate")}
                  </th>
                  <th className="px-4 py-3 text-end font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => {
                  const Icon = getFileIcon(file.mimeType);
                  return (
                    <tr
                      key={file.id}
                      className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{file.originalName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{file.sizeFormatted}</td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleDownload(file)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(file.id)}
                            loading={deleting === file.id}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
