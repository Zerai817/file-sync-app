"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useSync } from "@/hooks/useSync";

interface FileUploadProps {
  onUploadComplete?: () => void;
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const t = useTranslations("files");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { queueOfflineUpload } = useSync();

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        if (!navigator.onLine) {
          queueOfflineUpload(file);
          onUploadComplete?.();
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        onUploadComplete?.();
      } catch {
        if (!navigator.onLine) {
          queueOfflineUpload(file);
          onUploadComplete?.();
        }
      } finally {
        setUploading(false);
      }
    },
    [onUploadComplete, queueOfflineUpload]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files).forEach(uploadFile);
    },
    [uploadFile]
  );

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 border-dashed p-8 text-center transition-colors",
        dragging
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
          : "border-gray-300 dark:border-gray-700"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="*/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t("dragDrop")}</p>
      <Button
        type="button"
        variant="secondary"
        onClick={() => inputRef.current?.click()}
        loading={uploading}
      >
        {t("uploadFiles")}
      </Button>
    </div>
  );
}

export function FileUploadButton({ onUploadComplete }: FileUploadProps) {
  const t = useTranslations("files");
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      await fetch("/api/files/upload", { method: "POST", body: formData });
    }
    setUploading(false);
    onUploadComplete?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="*/*"
        className="hidden"
        onChange={handleChange}
      />
      <Button onClick={() => inputRef.current?.click()} loading={uploading} size="sm">
        <Upload className="h-4 w-4" />
        {t("upload")}
      </Button>
    </>
  );
}
