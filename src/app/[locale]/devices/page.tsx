"use client";

import { useTranslations } from "next-intl";
import { AuthGuard } from "@/components/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DeviceList } from "@/components/devices/DeviceList";
import { MobileNav } from "@/components/sync/SyncComponents";
import { Button } from "@/components/ui/Button";
import { useDevices } from "@/hooks/useDevices";
import { Smartphone } from "lucide-react";

export default function DevicesPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <DevicesContent />
        <MobileNav />
      </DashboardLayout>
    </AuthGuard>
  );
}

function DevicesContent() {
  const t = useTranslations("devices");
  const { devices, loading, currentDeviceId, registerDevice, updateDevice, removeDevice } =
    useDevices();

  const handleRegister = async () => {
    try {
      await registerDevice();
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
          <p className="text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        {!currentDeviceId && (
          <Button onClick={handleRegister}>
            <Smartphone className="h-4 w-4" />
            {t("addDevice")}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <DeviceList
          devices={devices}
          currentDeviceId={currentDeviceId}
          onUpdate={updateDevice}
          onRemove={removeDevice}
        />
      )}
    </div>
  );
}
