export function clearLocalSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("syncflow-device-id");
  localStorage.removeItem("syncflow-offline-queue");
  localStorage.removeItem("syncflow-folder-handle");
}
