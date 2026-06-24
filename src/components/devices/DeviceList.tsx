"use client";

import { useTranslations } from "next-intl";
import { Smartphone, Monitor, Trash2, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatRelativeTime } from "@/lib/utils";

interface Device {
  id: string;
  name: string;
  deviceType: string;
  syncMode: string;
  lastSyncAt: string | null;
}

interface DeviceListProps {
  devices: Device[];
  currentDeviceId: string | null;
  onUpdate: (id: string, updates: { name?: string; syncMode?: string }) => void;
  onRemove: (id: string) => void;
}

function DeviceIcon({ type }: { type: string }) {
  if (type === "desktop") return <Monitor className="h-5 w-5" />;
  return <Smartphone className="h-5 w-5" />;
}

export function DeviceList({ devices, currentDeviceId, onUpdate, onRemove }: DeviceListProps) {
  const t = useTranslations("devices");

  if (devices.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Smartphone className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium">{t("noDevices")}</h3>
        <p className="text-sm text-gray-500 mt-1">{t("noDevicesDesc")}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {devices.map((device) => (
        <Card key={device.id}>
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <DeviceIcon type={device.deviceType} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 dark:text-white">{device.name}</p>
                  {device.id === currentDeviceId && (
                    <Badge variant="info">{t("currentDevice")}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default">{t(device.deviceType as "ios" | "android" | "desktop")}</Badge>
                  <Badge variant={device.syncMode === "auto" ? "success" : "warning"}>
                    {t(device.syncMode as "auto" | "manual")}
                  </Badge>
                  {device.lastSyncAt && (
                    <span className="text-xs text-gray-500">
                      {t("lastSync")}: {formatRelativeTime(device.lastSyncAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const name = prompt(t("renameDevice"), device.name);
                  if (name) onUpdate(device.id, { name });
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm(t("removeConfirm"))) onRemove(device.id);
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
