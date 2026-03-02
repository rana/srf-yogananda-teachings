/**
 * Search API — /api/v1/search
 *
 * Hybrid search: vector + FTS + RRF (ADR-044).
 * Returns ranked verbatim passages with citations (PRI-01, PRI-02).
 * No query expansion or intent classification — pure hybrid search (ADR-119).
 *
 * Query params:
 *   q         — search query (required)
 *   language  — language filter (default: "en")
 *   limit     — max results (default: 20, max: 50)
 */

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { search, type SearchResponse } from "@/lib/services/search";
import { SEARCH_RESULTS_LIMIT } from "@/lib/config";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get("q");
  const language = params.get("language") || "en";
  const limitParam = params.get("limit");
  const limit = limitParam
    ? Math.min(Math.max(1, parseInt(limitParam, 10) || SEARCH_RESULTS_LIMIT), 50)
    : SEARCH_RESULTS_LIMIT;

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 },
    );
  }

  if (query.length > 500) {
    return NextResponse.json(
      { error: "Query too long (max 500 characters)" },
      { status: 400 },
    );
  }

  try {
    const response: SearchResponse = await search(pool, {
      query: query.trim(),
      language,
      limit,
    });

    // API response shape per DES-019 § API Conventions (ADR-110)
    return NextResponse.json({
      data: response.results.map((r) => ({
        id: r.id,
        content: r.content,
        citation: {
          bookId: r.bookId,
          book: r.bookTitle,
          author: r.bookAuthor,
          chapter: r.chapterTitle,
          chapterNumber: r.chapterNumber,
          page: r.pageNumber,
        },
        language: r.language,
        score: r.score,
        sources: r.sources,
      })),
      meta: {
        query: response.query,
        mode: response.mode,
        language,
        totalResults: response.totalResults,
        durationMs: response.durationMs,
        ...(response.fallbackLanguage && {
          fallbackLanguage: response.fallbackLanguage,
        }),
      },
    });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 },
    );
  }
}
