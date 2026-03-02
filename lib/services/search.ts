/**
 * Hybrid search service: vector + FTS + RRF (ADR-044, ADR-114).
 *
 * Framework-agnostic (PRI-10). Receives a pg.Pool as dependency.
 * No AI in the search path — pure hybrid search is the primary mode (ADR-119).
 */

import type pg from "pg";
import { RRF_K, SEARCH_RESULTS_LIMIT } from "@/lib/config";

// ── Types ────────────────────────────────────────────────────────

export interface SearchResult {
  id: string;
  content: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  chapterTitle: string;
  chapterNumber: number;
  pageNumber: number | null;
  sectionHeading: string | null;
  language: string;
  /** RRF combined score */
  score: number;
  /** Which search paths contributed to this result */
  sources: ("vector" | "fts")[];
}

export interface SearchOptions {
  query: string;
  language?: string;
  limit?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  mode: "hybrid" | "fts_only" | "vector_only";
  totalResults: number;
  durationMs: number;
  /** When results come from a different language than requested */
  fallbackLanguage?: string;
}

// ── Embedding ────────────────────────────────────────────────────

const VOYAGE_API_URL = "https://api.voyageai.com/v1/embeddings";
const EMBEDDING_MODEL = "voyage-3-large";

async function getQueryEmbedding(
  query: string,
): Promise<number[] | null> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(VOYAGE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: [query],
        input_type: "query",
      }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      data: { embedding: number[] }[];
    };
    return data.data[0].embedding;
  } catch {
    return null;
  }
}

// ── Search ───────────────────────────────────────────────────────

/**
 * Hybrid search: vector similarity + full-text search + RRF fusion.
 *
 * When embeddings are available: full hybrid (vector + FTS + RRF).
 * When embeddings unavailable: FTS-only mode (still returns ranked results).
 */
export async function search(
  pool: pg.Pool,
  options: SearchOptions,
): Promise<SearchResponse> {
  const start = Date.now();
  const { query, language = "en", limit = SEARCH_RESULTS_LIMIT } = options;
  const fetchCount = limit * 3; // Over-fetch for RRF fusion

  // Attempt to get query embedding for vector search
  const queryEmbedding = await getQueryEmbedding(query);
  const hasVectorSearch = queryEmbedding !== null;

  let mode: SearchResponse["mode"];
  let results: SearchResult[];

  if (hasVectorSearch) {
    // Full hybrid: vector + FTS + RRF
    mode = "hybrid";
    results = await hybridSearch(
      pool,
      query,
      queryEmbedding,
      language,
      fetchCount,
      limit,
    );
  } else {
    // FTS-only fallback
    mode = "fts_only";
    results = await ftsOnlySearch(pool, query, language, limit);
  }

  // Cross-language fallback: if non-English search returns no results,
  // fall back to English results (M1b-3, ADR-077)
  let fallbackLanguage: string | undefined;
  if (results.length === 0 && language !== "en") {
    fallbackLanguage = "en";
    if (hasVectorSearch) {
      results = await hybridSearch(
        pool,
        query,
        queryEmbedding,
        "en",
        fetchCount,
        limit,
      );
    } else {
      results = await ftsOnlySearch(pool, query, "en", limit);
    }
  }

  const durationMs = Date.now() - start;

  // Log query (anonymized, ADR-053)
  logQuery(pool, query, language, results.length, mode, durationMs).catch(
    () => {},
  );

  return {
    results,
    query,
    mode,
    totalResults: results.length,
    durationMs,
    fallbackLanguage,
  };
}

async function hybridSearch(
  pool: pg.Pool,
  query: string,
  queryEmbedding: number[],
  language: string,
  fetchCount: number,
  limit: number,
): Promise<SearchResult[]> {
  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  // RRF over vector + FTS (ADR-044, DES-004 § Hybrid Search)
  const { rows } = await pool.query(
    `
    WITH vector_results AS (
      SELECT bc.id,
        1 - (bc.embedding <=> $1::vector) AS similarity,
        ROW_NUMBER() OVER (ORDER BY bc.embedding <=> $1::vector) AS rank
      FROM book_chunks bc
      WHERE bc.language = $2
        AND bc.embedding IS NOT NULL
      ORDER BY bc.embedding <=> $1::vector
      LIMIT $3
    ),
    fts_results AS (
      SELECT bc.id,
        ts_rank_cd(bc.search_vector, plainto_tsquery('simple', $4)) AS fts_score,
        ROW_NUMBER() OVER (ORDER BY ts_rank_cd(bc.search_vector, plainto_tsquery('simple', $4)) DESC) AS rank
      FROM book_chunks bc
      WHERE bc.language = $2
        AND bc.search_vector @@ plainto_tsquery('simple', $4)
      ORDER BY fts_score DESC
      LIMIT $3
    ),
    rrf AS (
      SELECT
        COALESCE(v.id, f.id) AS id,
        (COALESCE(1.0 / ($5 + v.rank), 0) +
         COALESCE(1.0 / ($5 + f.rank), 0)) AS rrf_score,
        v.id IS NOT NULL AS from_vector,
        f.id IS NOT NULL AS from_fts
      FROM vector_results v
      FULL OUTER JOIN fts_results f ON v.id = f.id
    )
    SELECT
      rrf.id,
      rrf.rrf_score,
      rrf.from_vector,
      rrf.from_fts,
      bc.content,
      bc.page_number,
      bc.section_heading,
      bc.language,
      b.id AS book_id,
      b.title AS book_title,
      b.author AS book_author,
      c.title AS chapter_title,
      c.chapter_number
    FROM rrf
    JOIN book_chunks bc ON bc.id = rrf.id
    JOIN books b ON b.id = bc.book_id
    JOIN chapters c ON c.id = bc.chapter_id
    ORDER BY rrf.rrf_score DESC
    LIMIT $6
    `,
    [embeddingStr, language, fetchCount, query, RRF_K, limit],
  );

  return rows.map((row) => ({
    id: row.id,
    content: row.content,
    bookId: row.book_id,
    bookTitle: row.book_title,
    bookAuthor: row.book_author,
    chapterTitle: row.chapter_title,
    chapterNumber: row.chapter_number,
    pageNumber: row.page_number,
    sectionHeading: row.section_heading,
    language: row.language,
    score: parseFloat(row.rrf_score),
    sources: [
      ...(row.from_vector ? (["vector"] as const) : []),
      ...(row.from_fts ? (["fts"] as const) : []),
    ],
  }));
}

async function ftsOnlySearch(
  pool: pg.Pool,
  query: string,
  language: string,
  limit: number,
): Promise<SearchResult[]> {
  const { rows } = await pool.query(
    `
    SELECT
      bc.id,
      bc.content,
      bc.page_number,
      bc.section_heading,
      bc.language,
      b.id AS book_id,
      b.title AS book_title,
      b.author AS book_author,
      c.title AS chapter_title,
      c.chapter_number,
      ts_rank_cd(bc.search_vector, plainto_tsquery('simple', $1)) AS score
    FROM book_chunks bc
    JOIN books b ON b.id = bc.book_id
    JOIN chapters c ON c.id = bc.chapter_id
    WHERE bc.language = $2
      AND bc.search_vector @@ plainto_tsquery('simple', $1)
    ORDER BY score DESC
    LIMIT $3
    `,
    [query, language, limit],
  );

  return rows.map((row) => ({
    id: row.id,
    content: row.content,
    bookId: row.book_id,
    bookTitle: row.book_title,
    bookAuthor: row.book_author,
    chapterTitle: row.chapter_title,
    chapterNumber: row.chapter_number,
    pageNumber: row.page_number,
    sectionHeading: row.section_heading,
    language: row.language,
    score: parseFloat(row.score),
    sources: ["fts"] as ("vector" | "fts")[],
  }));
}

// ── Query Logging (ADR-053) ──────────────────────────────────────

async function logQuery(
  pool: pg.Pool,
  query: string,
  language: string,
  resultsCount: number,
  mode: string,
  durationMs: number,
): Promise<void> {
  await pool.query(
    `INSERT INTO search_queries (query_text, results_count, search_mode, language, duration_ms)
     VALUES ($1, $2, $3, $4, $5)`,
    [query, resultsCount, mode, language, durationMs],
  );
}
