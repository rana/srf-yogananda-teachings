/**
 * Books API — /api/v1/books
 *
 * Lists all books. /api/v1/books?language={code} filters by language.
 * /api/v1/books?id={bookId} returns chapters.
 */

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getBooks, getChapters } from "@/lib/services/books";

export async function GET(request: NextRequest) {
  const bookId = request.nextUrl.searchParams.get("id");
  const language = request.nextUrl.searchParams.get("language") || undefined;

  try {
    if (bookId) {
      const chapters = await getChapters(pool, bookId);
      return NextResponse.json({ data: chapters });
    }

    const books = await getBooks(pool, language);
    return NextResponse.json({ data: books });
  } catch (err) {
    console.error("Books API error:", err);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}
