/**
 * Chapter reader — M2a-2 (ADR-006, DES-006).
 *
 * Reading column at 38rem max-width for 65-75 char line length.
 * Print citation for @media print.
 */

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound, redirect } from "next/navigation";
import pool from "@/lib/db";
import { getChapterContent, getEquivalentBook } from "@/lib/services/books";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; bookId: string; chapter: string }>;
}): Promise<Metadata> {
  const { locale, bookId, chapter } = await params;
  const chapterNumber = parseInt(chapter, 10);
  if (isNaN(chapterNumber) || chapterNumber < 1) return {};
  const content = await getChapterContent(pool, bookId, chapterNumber);
  if (!content) return {};
  const prefix = locale === "en" ? "" : `/${locale}`;
  const base = `https://teachings.yogananda.org${prefix}/books/${bookId}`;

  // rel="prev"/"next" for sequential chapter navigation (M2a-7)
  const other: Record<string, string> = {};
  if (content.prevChapter) {
    other["prev"] = `${base}/${content.prevChapter.chapterNumber}`;
  }
  if (content.nextChapter) {
    other["next"] = `${base}/${content.nextChapter.chapterNumber}`;
  }

  return {
    title: `${content.chapter.title} — ${content.book.title}`,
    description: `Chapter ${content.chapter.chapterNumber} of ${content.book.title} by ${content.book.author}`,
    alternates: {
      canonical: `${prefix}/books/${bookId}/${chapter}`,
    },
    other,
  };
}

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

  // Cross-language redirect: if book language doesn't match locale,
  // redirect to the equivalent book's same chapter (PRI-06)
  if (content.book.language !== locale) {
    const equivalent = await getEquivalentBook(pool, bookId, locale);
    if (equivalent) {
      redirect(`/${locale}/books/${equivalent.id}/${chapterNumber}`);
    }
    // No equivalent — show this content (ADR-077 cross-language fallback)
  }

  const bookUrl = `https://teachings.yogananda.org/${locale}/books/${bookId}`;
  const chapterUrl = `${bookUrl}/${chapterNumber}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Chapter",
      name: content.chapter.title,
      position: content.chapter.chapterNumber,
      url: chapterUrl,
      isPartOf: {
        "@type": "Book",
        name: content.book.title,
        author: { "@type": "Person", name: content.book.author },
        url: bookUrl,
      },
      copyrightHolder: {
        "@type": "Organization",
        name: "Self-Realization Fellowship",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Books",
          item: `https://teachings.yogananda.org/${locale}/books`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: content.book.title,
          item: bookUrl,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: content.chapter.title,
          item: chapterUrl,
        },
      ],
    },
  ];

  return (
    <main id="main-content" className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              rel="prev"
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
              rel="next"
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
