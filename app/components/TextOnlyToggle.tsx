"use client";

/**
 * Text-only mode toggle — M1c-13 (ADR-006 §1).
 *
 * Footer toggle. No images, no decorative elements, no web fonts.
 * Stored in localStorage. Milestone 2a-11 extends with reader integration.
 */

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "srf-text-only";

export function TextOnlyToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setEnabled(true);
      document.documentElement.classList.add("text-only");
    }
  }, []);

  const toggle = useCallback(() => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(STORAGE_KEY, String(next));
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
