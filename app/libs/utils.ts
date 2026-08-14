import { useEffect, useState } from "react";

export function usePhone() {
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const checkIsPhone = () => setIsPhone(window.innerWidth <= 1024);
    checkIsPhone();

    window.addEventListener("resize", checkIsPhone);
    return () => window.removeEventListener("resize", checkIsPhone);
  }, []);

  return isPhone;
}

export function getStorageItem({
  key,
  defaultValue = "",
}: {
  key: string;
  defaultValue?: string;
}) {
  if (typeof window === "undefined") {
    return defaultValue;
  }
  return localStorage.getItem(key) ?? defaultValue;
}

export function getActiveIds() {
  const workspaceId = getStorageItem({ key: "operon_active_workspace_id", defaultValue: "" });
  const environmentId = getStorageItem({ key: "operon_active_environment_id", defaultValue: "" });
  return { workspaceId, environmentId };
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
