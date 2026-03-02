/**
 * Passage detail page — M2a-6 (ADR-022, ADR-068).
 *
 * Single passage with full citation, OG meta tags for rich
 * link previews, and share functionality. The shareable URL
 * for every passage displayed in search results.
 */

import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import pool from "@/lib/db";
import { getPassage } from "@/lib/services/books";
import { ShareButton } from "@/app/components/ShareButton";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const passage = await getPassage(pool, id);
  if (!passage) return {};

  const truncated =
    passage.content.length > 160
      ? passage.content.slice(0, 157) + "..."
      : passage.content;

  const citation = `${passage.bookAuthor}, ${passage.bookTitle}, Ch. ${passage.chapterNumber}`;

  return {
    title: `"${truncated}" — ${passage.bookAuthor}`,
    description: `${truncated} — ${citation}`,
    openGraph: {
      type: "article",
      title: `"${truncated}"`,
      description: citation,
      siteName: "SRF Teachings Portal",
    },
    twitter: {
      card: "summary_large_image",
      title: `"${truncated}"`,
      description: citation,
    },
  };
}

export default async function PassagePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const passage = await getPassage(pool, id);
  if (!passage) notFound();

  const passageUrl = `https://teachings.yogananda.org/${locale}/passage/${id}`;
  const citation = `${passage.bookAuthor}, ${passage.bookTitle}, Ch. ${passage.chapterNumber}: ${passage.chapterTitle}${passage.pageNumber ? `, p. ${passage.pageNumber}` : ""}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quotation",
    text: passage.content,
    author: { "@type": "Person", name: passage.bookAuthor },
    isPartOf: {
      "@type": "Book",
      name: passage.bookTitle,
      author: { "@type": "Person", name: passage.bookAuthor },
    },
    copyrightHolder: {
      "@type": "Organization",
      name: "Self-Realization Fellowship",
    },
  };

  return (
    <main id="main-content" className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[38rem] px-4 py-8 md:py-16">
        {/* The passage */}
        <blockquote className="mb-6 border-l-2 border-srf-gold/40 pl-6 text-lg leading-relaxed text-srf-navy md:text-xl md:leading-relaxed">
          &ldquo;{passage.content}&rdquo;
        </blockquote>

        {/* Citation */}
        <p className="mb-8 text-sm text-srf-navy/60">&mdash; {citation}</p>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/books/${passage.bookId}/${passage.chapterNumber}`}
            className="inline-flex min-h-11 items-center rounded-lg border border-srf-navy/15 px-4 py-2 text-sm text-srf-navy transition-colors hover:bg-white"
          >
            Read in context
          </Link>
          <ShareButton
            url={passageUrl}
            text={`"${passage.content.slice(0, 100)}..." — ${passage.bookAuthor}`}
            title={passage.bookTitle}
          />
        </div>

        {/* Copyright notice */}
        <p className="mt-12 text-xs text-srf-navy/30">
          All content is the verbatim published work of{" "}
          {passage.bookAuthor} and is copyrighted by Self-Realization
          Fellowship. Made freely accessible for reading and personal study.
        </p>
      </div>
    </main>
  );
}
