"use client";

/**
 * Search bar component — M2a-1 (ADR-130).
 *
 * "What did Yogananda say about...?" — recognition-first prompt.
 * Navigates to /search?q=... on submit.
 */

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function SearchBar() {
  const t = useTranslations("home");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    },
    [query, router],
  );

  return (
    <form onSubmit={handleSubmit} role="search" aria-label={t("searchPrompt")}>
      <label htmlFor="search-input" className="sr-only">
        {t("searchPrompt")}
      </label>
      <div className="flex gap-2">
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPrompt")}
          className="min-h-11 flex-1 rounded-lg border border-srf-navy/15 bg-white px-4 py-2.5 text-srf-navy placeholder:text-srf-navy/35 focus:border-srf-gold/60 focus:outline-none focus:ring-1 focus:ring-srf-gold/30"
          maxLength={500}
        />
        <button
          type="submit"
          className="min-h-11 min-w-11 rounded-lg bg-srf-navy px-4 py-2.5 text-sm font-sans font-semibold text-white transition-colors hover:bg-srf-navy/90"
          aria-label={t("searchButton")}
        >
          {t("searchButton")}
        </button>
      </div>
    </form>
  );
}
