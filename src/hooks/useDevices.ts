"use client";

import { useState, useEffect, useCallback } from "react";
import { detectDevice, getDefaultDeviceName, DeviceType } from "@/lib/device-detect";

interface Device {
  id: string;
  name: string;
  deviceType: string;
  syncMode: string;
  lastSyncAt: string | null;
  createdAt: string;
}

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    try {
      const res = await fetch("/api/user/devices");
      if (res.ok) {
        const data = await res.json();
        setDevices(data.devices);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    const stored = localStorage.getItem("syncflow-device-id");
    if (stored) setCurrentDeviceId(stored);
  }, [fetchDevices]);

  const registerDevice = useCallback(async (customName?: string) => {
    const info = detectDevice();
    const name = customName || getDefaultDeviceName(info.deviceType);

    const res = await fetch("/api/devices/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        deviceType: info.deviceType,
        syncMode: info.syncMode,
        userAgent: navigator.userAgent,
      }),
    });

    if (!res.ok) throw new Error("Failed to register device");

    const data = await res.json();
    localStorage.setItem("syncflow-device-id", data.device.id);
    setCurrentDeviceId(data.device.id);
    await fetchDevices();
    return data.device;
  }, [fetchDevices]);

  const updateDevice = useCallback(
    async (id: string, updates: { name?: string; syncMode?: string }) => {
      const res = await fetch(`/api/devices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update device");
      await fetchDevices();
    },
    [fetchDevices]
  );

  const removeDevice = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/devices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove device");
      if (currentDeviceId === id) {
        localStorage.removeItem("syncflow-device-id");
        setCurrentDeviceId(null);
      }
      await fetchDevices();
    },
    [fetchDevices, currentDeviceId]
  );

  return {
    devices,
    loading,
    currentDeviceId,
    registerDevice,
    updateDevice,
    removeDevice,
    refreshDevices: fetchDevices,
  };
}

export function getDeviceTypeLabel(type: string): DeviceType {
  if (type === "ios" || type === "android" || type === "desktop") return type;
  return "desktop";
}
