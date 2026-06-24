"use client";

import { useEffect, useRef } from "react";
import { useSync } from "@/hooks/useSync";
import { useDevices } from "@/hooks/useDevices";

export function SyncOnOpen() {
  const { sync, processOfflineQueue } = useSync();
  const { currentDeviceId, registerDevice } = useDevices();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function init() {
      if (!localStorage.getItem("syncflow-device-id")) {
        try {
          await registerDevice();
        } catch {
          // User may not be authenticated yet
        }
      }
      await processOfflineQueue();
      await sync(currentDeviceId || undefined);
    }

    init();
  }, [sync, processOfflineQueue, registerDevice, currentDeviceId]);

  return null;
}
