"use client";

import { useEffect } from "react";
import { BASE_PATH } from "@/lib/constants";

export default function ServiceWorkerRegister(): null {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(`${BASE_PATH}/sw.js`, { scope: `${BASE_PATH}/` })
        .catch((error: unknown) => {
          console.error("SW registration failed:", error);
        });
    }
  }, []);

  return null;
}
