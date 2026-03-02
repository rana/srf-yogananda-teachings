/**
 * Dynamic sitemap — M2a-7 (ADR-110).
 *
 * Generates a sitemap from the database at request time.
 * Includes all books, chapters, and static pages for each locale.
 */

import type { MetadataRoute } from "next";
import pool from "@/lib/db";
import { getBooks, getChapters } from "@/lib/services/books";
import { locales } from "@/i18n/config";

const BASE_URL = "https://teachings.yogananda.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages per locale
  const staticPages = [
    "",
    "/search",
    "/books",
    "/about",
    "/quiet",
    "/browse",
    "/privacy",
    "/legal",
    "/integrity",
  ];

  for (const locale of locales) {
    const prefix = locale === "en" ? "" : `/${locale}`;
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}${prefix}${page}`,
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1.0 : page === "/search" ? 0.9 : 0.7,
      });
    }
  }

  // Dynamic book + chapter pages
  const books = await getBooks(pool);
  for (const book of books) {
    const chapters = await getChapters(pool, book.id);
    const locale = book.language === "en" ? "" : `/${book.language}`;

    // Book landing page
    entries.push({
      url: `${BASE_URL}${locale}/books/${book.id}`,
      changeFrequency: "monthly",
      priority: 0.8,
    });

    // Chapter pages
    for (const ch of chapters) {
      entries.push({
        url: `${BASE_URL}${locale}/books/${book.id}/${ch.chapterNumber}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
