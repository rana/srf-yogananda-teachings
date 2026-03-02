/**
 * Suggestions service unit tests — M2a-21.
 *
 * Tests the fuzzy search suggestion service with mock pg.Pool.
 */

import { describe, it, expect, vi } from "vitest";
import { getSuggestions } from "../suggestions";

function mockPool(queryResponses: Record<string, unknown>[][]) {
  let callIndex = 0;
  return {
    query: vi.fn().mockImplementation(() => {
      const rows = queryResponses[callIndex] || [];
      callIndex++;
      return Promise.resolve({ rows });
    }),
  } as unknown as import("pg").Pool;
}

describe("getSuggestions", () => {
  it("returns chapter title matches", async () => {
    const pool = mockPool([
      [{ title: "My Parents and Early Life" }],
    ]);

    const results = await getSuggestions(pool, "Parents");
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      text: "My Parents and Early Life",
      type: "chapter",
    });
  });

  it("uses ILIKE for prefix matching", async () => {
    const pool = mockPool([[]]);
    await getSuggestions(pool, "yo", "en");
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("ILIKE"),
      ["en", "%yo%", 5],
    );
  });

  it("tries trigram similarity for 3+ char prefixes", async () => {
    const pool = mockPool([
      [], // No ILIKE matches
      [{ title: "The Tiger Swami", sim: 0.25 }], // Trigram match
    ]);

    const results = await getSuggestions(pool, "tgr", "en");
    expect(results).toHaveLength(1);
    expect(results[0].text).toBe("The Tiger Swami");
    // Should have made 2 queries (ILIKE + trigram)
    expect(pool.query).toHaveBeenCalledTimes(2);
  });

  it("skips trigram for short prefixes", async () => {
    const pool = mockPool([[]]);
    await getSuggestions(pool, "yo");
    // Only 1 query (ILIKE), no trigram
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it("respects the limit parameter", async () => {
    const pool = mockPool([
      [
        { title: "Chapter 1" },
        { title: "Chapter 2" },
        { title: "Chapter 3" },
      ],
    ]);

    const results = await getSuggestions(pool, "Ch", "en", 2);
    // Should only return up to limit
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it("defaults to English language", async () => {
    const pool = mockPool([[]]);
    await getSuggestions(pool, "test");
    expect(pool.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining(["en"]),
    );
  });
});
