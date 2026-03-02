"use client";

/**
 * Today's Wisdom — hero passage display with "Show me another" (M1c-4).
 *
 * Server-renders the initial passage, then client-side fetches for refreshes.
 * No page reload on "Show me another" — just fetches a new random passage.
 */

import { useState, useCallback } from "react";
import Link from "next/link";
import type { DailyPassage } from "@/lib/services/passages";

interface Props {
  passage: DailyPassage | null;
}

export function TodaysWisdom({ passage: initial }: Props) {
  const [passage, setPassage] = useState(initial);
  const [loading, setLoading] = useState(false);

  const fetchAnother = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/passages/random");
      if (res.ok) {
        const json = await res.json();
        setPassage({
          id: json.data.id,
          content: json.data.content,
          bookId: json.data.citation.bookId,
          bookTitle: json.data.citation.book,
          bookAuthor: json.data.citation.author,
          chapterTitle: json.data.citation.chapter,
          chapterNumber: json.data.citation.chapterNumber,
          pageNumber: json.data.citation.page,
          language: json.data.language,
        });
      }
    } catch {
      // Silently fail — keep current passage
    } finally {
      setLoading(false);
    }
  }, []);

  if (!passage) {
    return (
      <div className="py-16 text-center text-[#1a2744]/40">
        <p className="font-serif text-lg italic">No passages available yet.</p>
      </div>
    );
  }

  return (
    <section aria-label="Today's Wisdom">
      <div className="py-8 md:py-12">
        {/* Passage */}
        <blockquote className="font-serif text-lg leading-relaxed text-[#1a2744] md:text-xl md:leading-relaxed">
          &ldquo;{passage.content.trim()}&rdquo;
        </blockquote>

        {/* Attribution (PRI-02) */}
        <footer className="mt-4 text-sm text-[#1a2744]/60">
          <cite className="not-italic">
            — {passage.bookAuthor},{" "}
            <Link
              href={`/read/${passage.bookId}/${passage.chapterNumber}`}
              className="underline decoration-[#dcbd23]/40 underline-offset-2 hover:text-[#1a2744]"
            >
              {passage.chapterTitle}
            </Link>
            {passage.pageNumber && `, p. ${passage.pageNumber}`}
          </cite>
        </footer>

        {/* Show me another */}
        <div className="mt-6">
          <button
            onClick={fetchAnother}
            disabled={loading}
            className="min-h-11 min-w-11 rounded px-3 py-1.5 text-sm text-[#1a2744]/50 transition-colors hover:text-[#1a2744] disabled:opacity-50"
            aria-label="Show another passage"
          >
            {loading ? "..." : "Show me another"}
          </button>
        </div>
      </div>
    </section>
  );
}
