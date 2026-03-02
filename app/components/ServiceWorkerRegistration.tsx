"use client";

/**
 * Service Worker registration — M1c-14.
 *
 * Registers sw.js on mount. Renders nothing.
 */

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silent fail — service worker is enhancement, not requirement
      });
    }
  }, []);

  return null;
}
