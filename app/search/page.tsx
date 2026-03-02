"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CrisisInterstitial } from "@/app/components/CrisisInterstitial";
import type { CrisisInfo } from "@/lib/services/crisis";

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
  language: string;
  score: number;
  sources: string[];
}

interface SearchMeta {
  query: string;
  mode: string;
  language: string;
  totalResults: number;
  durationMs: number;
  fallbackLanguage?: string;
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchSkeleton() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <div className="border-b border-[#dcbd23]/20 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
          <h1 className="mb-2 font-serif text-2xl text-[#1a2744] md:text-3xl">
            Search the Teachings
          </h1>
        </div>
      </div>
    </main>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [language, setLanguage] = useState("en");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [meta, setMeta] = useState<SearchMeta | null>(null);
  const [crisis, setCrisis] = useState<CrisisInfo>({ detected: false });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(
    async (q: string, lang: string) => {
      if (!q.trim()) return;

      setLoading(true);
      setSearched(true);

      // Crisis detection (M1c-9) — client-side check
      try {
        const crisisRes = await fetch(
          `/api/v1/search/crisis?q=${encodeURIComponent(q.trim())}&language=${lang}`,
        );
        if (crisisRes.ok) {
          const crisisData = await crisisRes.json();
          setCrisis(crisisData);
        }
      } catch {
        setCrisis({ detected: false });
      }

      try {
        const res = await fetch(
          `/api/v1/search?q=${encodeURIComponent(q.trim())}&language=${lang}`,
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
    [],
  );

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      doSearch(query, language);
    },
    [query, language, doSearch],
  );

  // Auto-search from URL params (e.g., from homepage search bar)
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && !searched) {
      setQuery(q);
      doSearch(q, language);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
                placeholder={
                  language === "es"
                    ? "¿Qué dijo Yogananda sobre...?"
                    : "What did Yogananda say about..."
                }
                className="flex-1 rounded-lg border border-[#1a2744]/20 bg-white px-4 py-3 text-[#1a2744] placeholder:text-[#1a2744]/40 focus:border-[#dcbd23] focus:outline-none focus:ring-1 focus:ring-[#dcbd23]"
                aria-label="Search query"
              />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-lg border border-[#1a2744]/20 bg-white px-3 py-3 text-sm text-[#1a2744] focus:border-[#dcbd23] focus:outline-none focus:ring-1 focus:ring-[#dcbd23] min-w-11 min-h-11"
                aria-label="Language"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
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
        {/* Crisis interstitial — above results, never suppresses them */}
        <CrisisInterstitial crisis={crisis} />

        {meta && (
          <div className="mb-4">
            <p className="text-sm text-[#1a2744]/50">
              {meta.totalResults} result{meta.totalResults !== 1 ? "s" : ""} in{" "}
              {meta.durationMs}ms ({meta.mode})
            </p>
            {meta.fallbackLanguage && (
              <p className="mt-1 text-sm text-[#dcbd23]">
                No results in {language === "es" ? "Spanish" : language}.
                Showing English results.
              </p>
            )}
          </div>
        )}

        {searched && !loading && results.length === 0 && (
          <p className="py-12 text-center text-[#1a2744]/50">
            No passages found. Try different words.
          </p>
        )}

        <div className="space-y-4">
          {results.map((result) => {
            const isFallback =
              meta?.fallbackLanguage && result.language !== language;
            return (
              <article
                key={result.id}
                className="rounded-lg border border-[#1a2744]/10 bg-white p-4 md:p-6"
              >
                <blockquote className="mb-3 font-serif text-base leading-relaxed text-[#1a2744] md:text-lg md:leading-relaxed">
                  &ldquo;{result.content}&rdquo;
                </blockquote>
                <footer className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#1a2744]/60">
                  {isFallback && (
                    <span className="rounded bg-[#1a2744]/10 px-1.5 py-0.5 text-xs font-medium text-[#1a2744]/70">
                      [EN]
                    </span>
                  )}
                  <span className="font-medium text-[#1a2744]/80">
                    {result.citation.author}
                  </span>
                  <span aria-hidden="true">&middot;</span>
                  <span>{result.citation.book}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span>
                    Ch. {result.citation.chapterNumber}:{" "}
                    {result.citation.chapter}
                  </span>
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
            );
          })}
        </div>
      </div>
    </main>
  );
}
