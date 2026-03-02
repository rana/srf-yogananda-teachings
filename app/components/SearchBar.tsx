"use client";

/**
 * Search bar component — M1c-4 (ADR-130).
 *
 * "What did Yogananda say about...?" — recognition-first prompt.
 * Navigates to /search?q=... on submit.
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
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
    <form onSubmit={handleSubmit} role="search" aria-label="Search the teachings">
      <label htmlFor="search-input" className="sr-only">
        Search the teachings
      </label>
      <div className="flex gap-2">
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What did Yogananda say about...?"
          className="min-h-11 flex-1 rounded-lg border border-[#1a2744]/15 bg-white px-4 py-2.5 text-[#1a2744] placeholder:text-[#1a2744]/35 focus:border-[#dcbd23]/60 focus:outline-none focus:ring-1 focus:ring-[#dcbd23]/30"
          maxLength={500}
        />
        <button
          type="submit"
          className="min-h-11 min-w-11 rounded-lg bg-[#1a2744] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1a2744]/90"
          aria-label="Search"
        >
          Search
        </button>
      </div>
    </form>
  );
}
