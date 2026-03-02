/**
 * Book service unit tests — M2a-21.
 *
 * Tests the service layer with a mock pg.Pool.
 * Verifies SQL parameterization and response mapping.
 */

import { describe, it, expect, vi } from "vitest";
import { getBooks, getChapters } from "../books";

function mockPool(rows: Record<string, unknown>[]) {
  return { query: vi.fn().mockResolvedValue({ rows }) } as unknown as import("pg").Pool;
}

describe("getBooks", () => {
  it("returns all books when no language filter", async () => {
    const pool = mockPool([
      {
        id: "book-1",
        title: "Autobiography of a Yogi",
        author: "Paramahansa Yogananda",
        language: "en",
        publication_year: 1946,
        cover_image_url: null,
        bookstore_url: null,
      },
    ]);

    const books = await getBooks(pool);
    expect(books).toHaveLength(1);
    expect(books[0].title).toBe("Autobiography of a Yogi");
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("FROM books"),
      [],
    );
  });

  it("filters by language", async () => {
    const pool = mockPool([]);
    await getBooks(pool, "es");
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("language = $1"),
      ["es"],
    );
  });

  it("filters by updated_since", async () => {
    const pool = mockPool([]);
    await getBooks(pool, undefined, { updatedSince: "2026-01-01T00:00:00Z" });
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("updated_at > $1"),
      ["2026-01-01T00:00:00Z"],
    );
  });

  it("combines language + timestamp filters", async () => {
    const pool = mockPool([]);
    await getBooks(pool, "en", {
      updatedSince: "2026-01-01T00:00:00Z",
      createdSince: "2025-06-01T00:00:00Z",
    });
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("language = $1"),
      expect.arrayContaining(["en", "2026-01-01T00:00:00Z", "2025-06-01T00:00:00Z"]),
    );
  });
});

describe("getChapters", () => {
  it("returns chapters for a book", async () => {
    const pool = mockPool([
      {
        id: "ch-1",
        book_id: "book-1",
        chapter_number: 1,
        title: "My Parents and Early Life",
        sort_order: 1,
      },
    ]);

    const chapters = await getChapters(pool, "book-1");
    expect(chapters).toHaveLength(1);
    expect(chapters[0].title).toBe("My Parents and Early Life");
    expect(chapters[0].bookId).toBe("book-1");
  });

  it("applies timestamp filters", async () => {
    const pool = mockPool([]);
    await getChapters(pool, "book-1", { updatedSince: "2026-03-01T00:00:00Z" });
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("updated_at > $2"),
      ["book-1", "2026-03-01T00:00:00Z"],
    );
  });
});
