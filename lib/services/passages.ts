/**
 * Passage services — random passages for Today's Wisdom.
 *
 * Framework-agnostic (PRI-10). Receives a pg.Pool as dependency.
 */

import type pg from "pg";

export interface DailyPassage {
  id: string;
  content: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  chapterTitle: string;
  chapterNumber: number;
  pageNumber: number | null;
  language: string;
}

/**
 * Get a random passage suitable for "Today's Wisdom" display.
 * Selects from chunks that are substantial enough to be meaningful
 * (at least 80 characters) but not too long (under 600 characters).
 */
export async function getRandomPassage(
  pool: pg.Pool,
  language: string = "en",
): Promise<DailyPassage | null> {
  const { rows } = await pool.query(
    `SELECT
      bc.id,
      bc.content,
      bc.page_number,
      bc.language,
      b.id AS book_id,
      b.title AS book_title,
      b.author AS book_author,
      c.title AS chapter_title,
      c.chapter_number
    FROM book_chunks bc
    JOIN books b ON b.id = bc.book_id
    JOIN chapters c ON c.id = bc.chapter_id
    WHERE bc.language = $1
      AND length(bc.content) BETWEEN 80 AND 600
    ORDER BY random()
    LIMIT 1`,
    [language],
  );

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    content: row.content,
    bookId: row.book_id,
    bookTitle: row.book_title,
    bookAuthor: row.book_author,
    chapterTitle: row.chapter_title,
    chapterNumber: row.chapter_number,
    pageNumber: row.page_number,
    language: row.language,
  };
}
