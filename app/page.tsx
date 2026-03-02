/**
 * Homepage — M1c-4
 *
 * Today's Wisdom (random passage hero), search bar, Practice Bridge.
 * The portal speaks first — a passage, not a product pitch.
 */

import Link from "next/link";
import pool from "@/lib/db";
import { getRandomPassage } from "@/lib/services/passages";
import { SearchBar } from "@/app/components/SearchBar";
import { TodaysWisdom } from "@/app/components/TodaysWisdom";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const passage = await getRandomPassage(pool, "en");

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-16">
        {/* Today's Wisdom — hero position */}
        <TodaysWisdom passage={passage} />

        {/* Search */}
        <section className="mt-12">
          <SearchBar />
        </section>

        {/* Practice Bridge — quiet signpost (PRI-04) */}
        <section className="mt-16 text-center">
          <p className="text-sm text-[#1a2744]/50">
            Interested in learning meditation?{" "}
            <a
              href="https://yogananda.org/lessons"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a2744]/70 underline decoration-[#dcbd23]/40 underline-offset-2 hover:text-[#1a2744]"
            >
              SRF Lessons
            </a>
          </p>
        </section>

        {/* Minimal nav */}
        <nav className="mt-12 flex justify-center gap-6 text-sm text-[#1a2744]/50">
          <Link
            href="/read"
            className="hover:text-[#1a2744] transition-colors"
          >
            Books
          </Link>
          <Link
            href="/search"
            className="hover:text-[#1a2744] transition-colors"
          >
            Search
          </Link>
          <Link
            href="/about"
            className="hover:text-[#1a2744] transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </main>
  );
}
