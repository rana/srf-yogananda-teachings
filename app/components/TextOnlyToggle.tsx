"use client";

/**
 * Text-only mode toggle — M1c-13, M2a-11 (ADR-006 §1).
 *
 * Footer toggle. No images, no decorative elements, no web fonts.
 * Uses the unified reader preferences service (PRI-10).
 */

import { useState, useEffect, useCallback } from "react";
import { getPreference, setPreference } from "@/lib/services/preferences";

export function TextOnlyToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = getPreference("text-only-mode");
    if (stored) {
      setEnabled(true);
      document.documentElement.classList.add("text-only");
    }
  }, []);

  const toggle = useCallback(() => {
    const next = !enabled;
    setEnabled(next);
    setPreference("text-only-mode", next);
    if (next) {
      document.documentElement.classList.add("text-only");
    } else {
      document.documentElement.classList.remove("text-only");
    }
  }, [enabled]);

  return (
    <button
      onClick={toggle}
      className="min-h-11 min-w-11 rounded px-2 py-1 text-xs text-srf-navy/40 transition-colors hover:text-srf-navy/70"
      aria-pressed={enabled}
      aria-label={enabled ? "Disable text-only mode" : "Enable text-only mode"}
    >
      {enabled ? "Text-only: on" : "Text-only mode"}
    </button>
  );
}
