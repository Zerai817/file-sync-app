"use client";

import { useState, useCallback } from "react";
import { useFileSystemAccess } from "./useFileSystemAccess";
import { triggerDownload } from "@/lib/download";

interface SyncFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  downloadUrl: string;
}

interface SyncResult {
  syncedAt: string;
  files: SyncFile[];
  totalFiles: number;
}

export interface SyncStatus {
  status: string;
  fileCount: number;
  totalSize: number;
  lastSyncAt: string | null;
  currentDeviceId: string | null;
  devices: { id: string; name: string; deviceType: string; syncMode?: string; lastSyncAt?: string | null }[];
}

const OFFLINE_QUEUE_KEY = "syncflow-offline-queue";

interface QueuedUpload {
  id: string;
  file: { name: string; type: string; data: string };
  timestamp: string;
}

export function useSync() {
  const [syncing, setSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const { writeFileToFolder, folderHandle, supportsFileSystemAccess } = useFileSystemAccess();

  const getStatus = useCallback(async (): Promise<SyncStatus | null> => {
    try {
      const res = await fetch("/api/sync/status");
      if (!res.ok) return null;
      const data = await res.json();
      setLastSyncAt(data.lastSyncAt);
      return data;
    } catch {
      return null;
    }
  }, []);

  const downloadFile = useCallback(async (file: SyncFile): Promise<boolean> => {
    try {
      const res = await fetch(file.downloadUrl);
      if (!res.ok) return false;
      const blob = await res.blob();

      if (supportsFileSystemAccess && folderHandle) {
        return writeFileToFolder(file.originalName, blob);
      }

      triggerDownload(blob, file.originalName);
      return true;
    } catch {
      return false;
    }
  }, [supportsFileSystemAccess, folderHandle, writeFileToFolder]);

  const sync = useCallback(async (deviceId?: string): Promise<SyncResult | null> => {
    setSyncing(true);
    try {
      await processOfflineQueue();

      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });

      if (!res.ok) return null;

      const result: SyncResult = await res.json();
      setLastSyncAt(result.syncedAt);

      for (const file of result.files) {
        await downloadFile(file);
      }

      return result;
    } catch {
      return null;
    } finally {
      setSyncing(false);
    }
  }, [downloadFile]);

  const queueOfflineUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const queue = getOfflineQueue();
      queue.push({
        id: crypto.randomUUID(),
        file: {
          name: file.name,
          type: file.type,
          data: reader.result as string,
        },
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    };
    reader.readAsDataURL(file);
  }, []);

  const processOfflineQueue = useCallback(async () => {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;

    const remaining: QueuedUpload[] = [];

    for (const item of queue) {
      try {
        const res = await fetch(item.file.data);
        const blob = await res.blob();
        const formData = new FormData();
        formData.append("file", blob, item.file.name);

        const uploadRes = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) remaining.push(item);
      } catch {
        remaining.push(item);
      }
    }

    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
  }, []);

  return {
    syncing,
    lastSyncAt,
    sync,
    getStatus,
    downloadFile,
    queueOfflineUpload,
    processOfflineQueue,
    pendingUploads: getOfflineQueue().length,
  };
}

function getOfflineQueue(): QueuedUpload[] {
  try {
    const stored = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
