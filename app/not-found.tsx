/**
 * Global 404 page — M2a-8.
 *
 * Catches requests outside locale prefixes.
 * Uses plain HTML (no next-intl context available).
 */

import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <main id="main-content" className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-5xl text-[#dcbd23]" aria-hidden="true">✦</p>
      <h1 className="mb-3 font-display text-xl text-[#1a2744]">
        This page could not be found
      </h1>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-[#1a2744]/50">
        The path you followed may have changed. The teachings await you at any
        of these places:
      </p>
      <nav className="flex flex-wrap justify-center gap-3" aria-label="Helpful links">
        <Link
          href="/en"
          className="min-h-11 inline-flex items-center rounded-lg border border-[#dcbd23]/30 px-4 py-2 text-sm text-[#1a2744] transition-colors hover:bg-white hover:border-[#dcbd23]"
        >
          Home
        </Link>
        <Link
          href="/en/search"
          className="min-h-11 inline-flex items-center rounded-lg border border-[#1a2744]/15 px-4 py-2 text-sm text-[#1a2744]/70 transition-colors hover:bg-white hover:text-[#1a2744]"
        >
          Search
        </Link>
        <Link
          href="/en/books"
          className="min-h-11 inline-flex items-center rounded-lg border border-[#1a2744]/15 px-4 py-2 text-sm text-[#1a2744]/70 transition-colors hover:bg-white hover:text-[#1a2744]"
        >
          Books
        </Link>
      </nav>
    </main>
  );
}
