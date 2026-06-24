export type DeviceType = "ios" | "android" | "desktop";
export type SyncMode = "auto" | "manual";

export interface DeviceInfo {
  deviceType: DeviceType;
  syncMode: SyncMode;
  supportsFileSystemAccess: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
}

export function detectDevice(userAgent?: string): DeviceInfo {
  const ua = userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "");

  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const isDesktop = !isIOS && !isAndroid;

  const supportsFileSystemAccess =
    typeof window !== "undefined" &&
    "showDirectoryPicker" in window &&
    !isIOS;

  let deviceType: DeviceType = "desktop";
  if (isIOS) deviceType = "ios";
  else if (isAndroid) deviceType = "android";

  const syncMode: SyncMode = supportsFileSystemAccess ? "auto" : "manual";

  return {
    deviceType,
    syncMode,
    supportsFileSystemAccess,
    isIOS,
    isAndroid,
    isDesktop,
  };
}

export function getDefaultDeviceName(deviceType: DeviceType): string {
  switch (deviceType) {
    case "ios":
      return "iPhone / iPad";
    case "android":
      return "Android Device";
    default:
      return "Desktop";
  }
}

export function getDeviceIcon(deviceType: DeviceType): string {
  switch (deviceType) {
    case "ios":
      return "smartphone";
    case "android":
      return "smartphone";
    default:
      return "monitor";
  }
}
