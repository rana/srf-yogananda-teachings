/**
 * Search service unit tests — M2a-21.
 *
 * Tests the hybrid search service with mock pg.Pool.
 * Mocks Voyage API for embedding generation.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { search } from "../search";

// Mock fetch for Voyage API calls
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function mockPool(rows: Record<string, unknown>[]) {
  return {
    query: vi.fn().mockResolvedValue({ rows }),
  } as unknown as import("pg").Pool;
}

const sampleRow = {
  id: "chunk-1",
  rrf_score: "0.85",
  from_vector: true,
  from_fts: true,
  content: "God is approachable.",
  page_number: 98,
  section_heading: null,
  language: "en",
  book_id: "book-1",
  book_title: "Autobiography of a Yogi",
  book_author: "Paramahansa Yogananda",
  chapter_title: "Years in My Master's Hermitage",
  chapter_number: 12,
};

describe("search", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: Voyage API not available (no API key)
    delete process.env.VOYAGE_API_KEY;
  });

  it("returns FTS-only results when VOYAGE_API_KEY is not set", async () => {
    const pool = mockPool([{ ...sampleRow, score: "0.5" }]);

    const result = await search(pool, { query: "God" });

    expect(result.mode).toBe("fts_only");
    expect(result.results).toHaveLength(1);
    expect(result.results[0].content).toBe("God is approachable.");
    expect(result.results[0].bookTitle).toBe("Autobiography of a Yogi");
    expect(result.results[0].chapterNumber).toBe(12);
  });

  it("returns empty results for no matches", async () => {
    const pool = mockPool([]);

    const result = await search(pool, { query: "xyznonexistent" });

    expect(result.results).toHaveLength(0);
    expect(result.totalResults).toBe(0);
  });

  it("includes duration in response", async () => {
    const pool = mockPool([]);

    const result = await search(pool, { query: "test" });

    expect(result.durationMs).toBeGreaterThanOrEqual(0);
    expect(typeof result.durationMs).toBe("number");
  });

  it("falls back to English when non-English search returns no results", async () => {
    let callCount = 0;
    const pool = {
      query: vi.fn().mockImplementation(() => {
        callCount++;
        // First call (Spanish): no results. Second call (English): results.
        // Third call: query logging
        if (callCount === 1) return { rows: [] };
        if (callCount === 2) return { rows: [{ ...sampleRow, score: "0.5" }] };
        return { rows: [] };
      }),
    } as unknown as import("pg").Pool;

    const result = await search(pool, { query: "Dios", language: "es" });

    expect(result.fallbackLanguage).toBe("en");
    expect(result.results).toHaveLength(1);
  });

  it("does not fallback when English search returns no results", async () => {
    const pool = mockPool([]);

    const result = await search(pool, { query: "nonexistent", language: "en" });

    expect(result.fallbackLanguage).toBeUndefined();
  });

  it("uses hybrid mode when Voyage API is available", async () => {
    process.env.VOYAGE_API_KEY = "test-key";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: [{ embedding: new Array(1024).fill(0.1) }],
        }),
    });

    const pool = mockPool([sampleRow]);

    const result = await search(pool, { query: "meditation" });

    expect(result.mode).toBe("hybrid");
    expect(result.results).toHaveLength(1);
    expect(result.results[0].sources).toContain("vector");
    expect(result.results[0].sources).toContain("fts");
  });

  it("falls back to FTS when Voyage API fails", async () => {
    process.env.VOYAGE_API_KEY = "test-key";
    mockFetch.mockResolvedValueOnce({ ok: false });

    const pool = mockPool([{ ...sampleRow, score: "0.5" }]);

    const result = await search(pool, { query: "meditation" });

    expect(result.mode).toBe("fts_only");
  });

  it("respects the limit parameter", async () => {
    const pool = mockPool([{ ...sampleRow, score: "0.5" }]);

    const result = await search(pool, { query: "test", limit: 5 });

    // Verify limit was passed to the query
    expect(pool.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([5]),
    );
  });
});
