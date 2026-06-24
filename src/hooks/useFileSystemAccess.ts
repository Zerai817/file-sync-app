"use client";

import { useState, useCallback, useEffect } from "react";
import { detectDevice, DeviceInfo } from "@/lib/device-detect";
import { triggerDownload } from "@/lib/download";

export { triggerDownload };

const FOLDER_HANDLE_KEY = "syncflow-folder-handle";

interface StoredFolderInfo {
  name: string;
  selectedAt: string;
}

export function useFileSystemAccess() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [folderHandle, setFolderHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [folderName, setFolderName] = useState<string | null>(null);

  useEffect(() => {
    setDeviceInfo(detectDevice());
    const stored = localStorage.getItem(FOLDER_HANDLE_KEY);
    if (stored) {
      try {
        const info: StoredFolderInfo = JSON.parse(stored);
        setFolderName(info.name);
      } catch {
        localStorage.removeItem(FOLDER_HANDLE_KEY);
      }
    }
  }, []);

  const selectFolder = useCallback(async (): Promise<boolean> => {
    if (!deviceInfo?.supportsFileSystemAccess) return false;

    try {
      const handle = await window.showDirectoryPicker({ mode: "readwrite" });
      setFolderHandle(handle);
      setFolderName(handle.name);
      localStorage.setItem(
        FOLDER_HANDLE_KEY,
        JSON.stringify({ name: handle.name, selectedAt: new Date().toISOString() })
      );
      return true;
    } catch {
      return false;
    }
  }, [deviceInfo]);

  const writeFileToFolder = useCallback(
    async (filename: string, blob: Blob): Promise<boolean> => {
      if (!folderHandle) return false;

      try {
        const permission = await folderHandle.requestPermission({ mode: "readwrite" });
        if (permission !== "granted") return false;

        const fileHandle = await folderHandle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return true;
      } catch (err) {
        console.error("Write to folder failed:", err);
        return false;
      }
    },
    [folderHandle]
  );

  const restoreFolderHandle = useCallback(async (): Promise<FileSystemDirectoryHandle | null> => {
    if (!deviceInfo?.supportsFileSystemAccess) return null;

    try {
      const handles = await navigator.storage.getDirectory?.();
      void handles;
    } catch {
      // IndexedDB handle persistence not universally available
    }

    return folderHandle;
  }, [deviceInfo, folderHandle]);

  return {
    deviceInfo,
    folderHandle,
    folderName,
    selectFolder,
    writeFileToFolder,
    restoreFolderHandle,
    supportsFileSystemAccess: deviceInfo?.supportsFileSystemAccess ?? false,
  };
}
