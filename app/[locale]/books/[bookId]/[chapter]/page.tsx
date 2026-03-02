/**
 * Chapter reader — M2a-2 (ADR-006, DES-006).
 *
 * Reading column at 38rem max-width for 65-75 char line length.
 * Print citation for @media print.
 */

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import pool from "@/lib/db";
import { getChapterContent } from "@/lib/services/books";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ locale: string; bookId: string; chapter: string }>;
}) {
  const { locale, bookId, chapter } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reader");

  const chapterNumber = parseInt(chapter, 10);
  if (isNaN(chapterNumber) || chapterNumber < 1) notFound();

  const content = await getChapterContent(pool, bookId, chapterNumber);
  if (!content) notFound();

  return (
    <main id="main-content" className="min-h-screen">
      {/* Reader header */}
      <header className="border-b border-srf-gold/20 bg-white">
        <div className="mx-auto max-w-[38rem] px-4 py-4">
          <nav className="mb-2 text-sm text-srf-navy/50" aria-label="Breadcrumb">
            <Link href="/books" className="hover:text-srf-navy/80">
              {t("breadcrumbBooks")}
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href={`/books/${bookId}`} className="hover:text-srf-navy/80">
              {content.book.title}
            </Link>
          </nav>
          <h1 className="font-display text-xl text-srf-navy md:text-2xl">
            <span className="me-2 text-srf-navy/40">
              {content.chapter.chapterNumber}.
            </span>
            {content.chapter.title}
          </h1>
          <p className="mt-1 text-sm text-srf-navy/50">
            {content.book.author}
          </p>
        </div>
      </header>

      {/* Reading content */}
      <article className="mx-auto max-w-[38rem] px-4 py-8 md:py-12">
        <div className="space-y-6">
          {content.paragraphs.map((para, i) => (
            <p
              key={para.id}
              id={`p-${i}`}
              className="text-base leading-[1.8] text-srf-navy md:text-[1.125rem] md:leading-[1.85]"
            >
              {para.content}
            </p>
          ))}
        </div>

        {/* Print-only citation */}
        <div className="print-citation">
          {content.book.author}, <em>{content.book.title}</em>,
          Chapter {content.chapter.chapterNumber}: {content.chapter.title}.
          © Self-Realization Fellowship. teachings.yogananda.org
        </div>
      </article>

      {/* Chapter navigation */}
      <nav
        className="border-t border-srf-navy/10 bg-white"
        aria-label="Chapter navigation"
      >
        <div className="mx-auto flex max-w-[38rem] items-stretch">
          {content.prevChapter ? (
            <Link
              href={`/books/${bookId}/${content.prevChapter.chapterNumber}`}
              className="flex flex-1 flex-col px-4 py-4 text-start transition-colors hover:bg-warm-cream min-h-[44px]"
            >
              <span className="text-xs text-srf-navy/40">{t("previous")}</span>
              <span className="text-sm text-srf-navy">
                {content.prevChapter.chapterNumber}. {content.prevChapter.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          <div className="w-px bg-srf-navy/10" />

          {content.nextChapter ? (
            <Link
              href={`/books/${bookId}/${content.nextChapter.chapterNumber}`}
              className="flex flex-1 flex-col px-4 py-4 text-end transition-colors hover:bg-warm-cream min-h-[44px]"
            >
              <span className="text-xs text-srf-navy/40">{t("next")}</span>
              <span className="text-sm text-srf-navy">
                {content.nextChapter.chapterNumber}. {content.nextChapter.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </nav>
    </main>
  );
}
