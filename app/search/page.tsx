"use client";

import { useState, useCallback } from "react";

interface Citation {
  bookId: string;
  book: string;
  author: string;
  chapter: string;
  chapterNumber: number;
  page: number | null;
}

interface SearchResult {
  id: string;
  content: string;
  citation: Citation;
  score: number;
  sources: string[];
}

interface SearchMeta {
  query: string;
  mode: string;
  language: string;
  totalResults: number;
  durationMs: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [meta, setMeta] = useState<SearchMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;

      setLoading(true);
      setSearched(true);
      try {
        const res = await fetch(
          `/api/v1/search?q=${encodeURIComponent(query.trim())}`,
        );
        const data = await res.json();
        setResults(data.data || []);
        setMeta(data.meta || null);
      } catch {
        setResults([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    },
    [query],
  );

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Search header */}
      <div className="border-b border-[#dcbd23]/20 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
          <h1 className="mb-2 font-serif text-2xl text-[#1a2744] md:text-3xl">
            Search the Teachings
          </h1>
          <p className="mb-6 text-sm text-[#1a2744]/60">
            Verbatim passages from Paramahansa Yogananda&apos;s published works
          </p>

          <form onSubmit={handleSearch}>
            <div className="flex gap-2">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What did Yogananda say about..."
                className="flex-1 rounded-lg border border-[#1a2744]/20 bg-white px-4 py-3 text-[#1a2744] placeholder:text-[#1a2744]/40 focus:border-[#dcbd23] focus:outline-none focus:ring-1 focus:ring-[#dcbd23]"
                aria-label="Search query"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="rounded-lg bg-[#1a2744] px-6 py-3 text-white transition-colors hover:bg-[#1a2744]/90 disabled:opacity-50 min-w-[44px] min-h-[44px]"
              >
                {loading ? "..." : "Search"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-3xl px-4 py-6">
        {meta && (
          <p className="mb-4 text-sm text-[#1a2744]/50">
            {meta.totalResults} result{meta.totalResults !== 1 ? "s" : ""} in{" "}
            {meta.durationMs}ms ({meta.mode})
          </p>
        )}

        {searched && !loading && results.length === 0 && (
          <p className="py-12 text-center text-[#1a2744]/50">
            No passages found. Try different words.
          </p>
        )}

        <div className="space-y-4">
          {results.map((result) => (
            <article
              key={result.id}
              className="rounded-lg border border-[#1a2744]/10 bg-white p-4 md:p-6"
            >
              <blockquote className="mb-3 font-serif text-base leading-relaxed text-[#1a2744] md:text-lg md:leading-relaxed">
                &ldquo;{result.content}&rdquo;
              </blockquote>
              <footer className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#1a2744]/60">
                <span className="font-medium text-[#1a2744]/80">
                  {result.citation.author}
                </span>
                <span aria-hidden="true">&middot;</span>
                <span>{result.citation.book}</span>
                <span aria-hidden="true">&middot;</span>
                <span>Ch. {result.citation.chapterNumber}: {result.citation.chapter}</span>
                {result.citation.page && (
                  <>
                    <span aria-hidden="true">&middot;</span>
                    <span>p. {result.citation.page}</span>
                  </>
                )}
                <span aria-hidden="true">&middot;</span>
                <a
                  href={`/read/${result.citation.bookId}/${result.citation.chapterNumber}`}
                  className="text-[#dcbd23] hover:text-[#1a2744] transition-colors min-h-11 inline-flex items-center"
                >
                  Read in context
                </a>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
