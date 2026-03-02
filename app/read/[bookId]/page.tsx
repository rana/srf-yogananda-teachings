import Link from "next/link";
import { notFound } from "next/navigation";
import pool from "@/lib/db";
import { getBooks, getChapters } from "@/lib/services/books";

export default async function BookPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const [books, chapters] = await Promise.all([
    getBooks(pool),
    getChapters(pool, bookId),
  ]);

  const book = books.find((b) => b.id === bookId);
  if (!book) notFound();

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[#1a2744]/50">
          <Link href="/read" className="hover:text-[#1a2744]/80">
            Books
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-[#1a2744]/80">{book.title}</span>
        </nav>

        <h1 className="mb-1 font-serif text-2xl text-[#1a2744] md:text-3xl">
          {book.title}
        </h1>
        <p className="mb-8 text-sm text-[#1a2744]/60">{book.author}</p>

        {chapters.length === 0 && (
          <p className="py-12 text-center text-[#1a2744]/50">
            No chapters available yet.
          </p>
        )}

        <ol className="space-y-1">
          {chapters.map((ch) => (
            <li key={ch.id}>
              <Link
                href={`/read/${bookId}/${ch.chapterNumber}`}
                className="flex items-baseline gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-white"
              >
                <span className="min-w-[2rem] text-right text-sm tabular-nums text-[#1a2744]/40">
                  {ch.chapterNumber}
                </span>
                <span className="font-serif text-[#1a2744]">{ch.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
