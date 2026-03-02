"use client";

/**
 * Low-bandwidth detection banner — M1c-15, M2a-11 (ADR-006 §1, DES-049).
 *
 * When navigator.connection.effectiveType reports 2g/slow-2g,
 * display gentle banner suggesting text-only mode.
 * Progressive enhancement — no-op on browsers without the API.
 * Uses the unified reader preferences service (PRI-10).
 */

import { useState, useEffect, useCallback } from "react";
import { getPreference, setPreference } from "@/lib/services/preferences";

const DISMISSED_KEY = "srf-lowbw-dismissed";

export function LowBandwidthBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem(DISMISSED_KEY)) return;
    // Don't show if text-only already enabled
    if (getPreference("text-only-mode")) return;

    // Check connection API (progressive enhancement)
    const conn = (navigator as Navigator & {
      connection?: { effectiveType?: string };
    }).connection;

    if (conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") {
      setShow(true);
    }
  }, []);

  const enableTextOnly = useCallback(() => {
    setPreference("text-only-mode", true);
    document.documentElement.classList.add("text-only");
    setShow(false);
  }, []);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(DISMISSED_KEY, "true");
    setShow(false);
  }, []);

  if (!show) return null;

  return (
    <div
      role="status"
      data-no-print
      className="low-bandwidth-banner border-b border-srf-gold/20 bg-srf-gold/5 px-4 py-3 text-center text-sm text-srf-navy/70"
    >
      <p>
        Slow connection detected.{" "}
        <button
          onClick={enableTextOnly}
          className="min-h-11 min-w-11 rounded px-1.5 font-medium text-srf-navy underline decoration-srf-gold/40 underline-offset-2"
        >
          Enable text-only mode
        </button>{" "}
        for a faster experience.{" "}
        <button
          onClick={dismiss}
          className="min-h-11 min-w-11 rounded px-1.5 text-srf-navy/40 hover:text-srf-navy/70"
          aria-label="Dismiss"
        >
          Dismiss
        </button>
      </p>
    </div>
  );
}
