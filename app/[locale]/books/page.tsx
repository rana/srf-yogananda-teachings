/**
 * Books catalog — M2a-2.
 *
 * Lists available books with cover images, editorial descriptions,
 * chapter counts, and SRF Bookstore links.
 * Warm, unhurried design even with few books.
 */

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import pool from "@/lib/db";
import { getBooks, getChapters } from "@/lib/services/books";
import { localeNames } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

export default async function BooksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("books");
  const books = await getBooks(pool);

  // Get chapter counts for each book
  const booksWithChapters = await Promise.all(
    books.map(async (book) => {
      const chapters = await getChapters(pool, book.id);
      return { ...book, chapterCount: chapters.length };
    }),
  );

  return (
    <main id="main-content" className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <h1 className="mb-2 font-display text-2xl text-srf-navy md:text-3xl">
          {t("heading")}
        </h1>
        <p className="mb-8 text-sm text-srf-navy/60">
          {t("subtitle")}
        </p>

        {booksWithChapters.length === 0 ? (
          <p className="py-12 text-center text-srf-navy/50">
            {t("noBooks")}
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {booksWithChapters.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.id}`}
                  className="block rounded-lg border border-srf-navy/10 bg-white p-6 transition-colors hover:border-srf-gold/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="mb-1 font-display text-lg text-srf-navy md:text-xl">
                        {book.title}
                      </h2>
                      <p className="text-sm text-srf-navy/60">
                        {book.author}
                        {book.publicationYear && ` (${book.publicationYear})`}
                      </p>
                      <p className="mt-1 text-xs text-srf-navy/40">
                        {book.chapterCount} chapters
                      </p>
                    </div>
                    <span className="shrink-0 rounded bg-srf-navy/5 px-2 py-0.5 text-xs text-srf-navy/60">
                      {localeNames[book.language as Locale] || book.language}
                    </span>
                  </div>
                  {book.bookstoreUrl && (
                    <p className="mt-2 text-xs text-srf-gold">
                      {t("bookstoreLink")}
                    </p>
                  )}
                </Link>
              ))}
            </div>

            {/* Honest "more coming" note */}
            <p className="mt-8 text-center text-sm text-srf-navy/40 italic">
              {t("moreComingSoon")}
            </p>

            {/* SRF Bookstore signpost */}
            <p className="mt-4 text-center text-sm">
              <a
                href="https://bookstore.yogananda.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-srf-navy/50 underline decoration-srf-gold/40 underline-offset-2 hover:text-srf-navy"
              >
                {t("bookstoreSignpost")}
              </a>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
