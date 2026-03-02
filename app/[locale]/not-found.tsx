/**
 * 404 page — M2a-8.
 *
 * Warm, helpful not-found page with navigation options.
 * "Honest absence as invitation, never a dead end" (PRI-02).
 */

import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <main id="main-content" className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-5xl text-srf-gold" aria-hidden="true">✦</p>
      <h1 className="mb-3 font-display text-xl text-srf-navy">
        This page could not be found
      </h1>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-srf-navy/50">
        The path you followed may have changed. The teachings await you at any
        of these places:
      </p>
      <nav className="flex flex-wrap justify-center gap-3" aria-label="Helpful links">
        <Link
          href="/"
          className="min-h-11 inline-flex items-center rounded-lg border border-srf-gold/30 px-4 py-2 text-sm text-srf-navy transition-colors hover:bg-white hover:border-srf-gold"
        >
          Home
        </Link>
        <Link
          href="/search"
          className="min-h-11 inline-flex items-center rounded-lg border border-srf-navy/15 px-4 py-2 text-sm text-srf-navy/70 transition-colors hover:bg-white hover:text-srf-navy"
        >
          Search
        </Link>
        <Link
          href="/books"
          className="min-h-11 inline-flex items-center rounded-lg border border-srf-navy/15 px-4 py-2 text-sm text-srf-navy/70 transition-colors hover:bg-white hover:text-srf-navy"
        >
          Books
        </Link>
      </nav>
    </main>
  );
}
