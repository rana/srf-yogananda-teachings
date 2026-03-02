import Link from "next/link";
import pool from "@/lib/db";
import { getBooks } from "@/lib/services/books";

export default async function ReadPage() {
  const books = await getBooks(pool);

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <h1 className="mb-2 font-serif text-2xl text-[#1a2744] md:text-3xl">
          Read the Teachings
        </h1>
        <p className="mb-8 text-sm text-[#1a2744]/60">
          Paramahansa Yogananda&apos;s published works — freely accessible
          worldwide
        </p>

        {books.length === 0 && (
          <p className="py-12 text-center text-[#1a2744]/50">
            No books available yet.
          </p>
        )}

        <div className="space-y-4">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/read/${book.id}`}
              className="block rounded-lg border border-[#1a2744]/10 bg-white p-6 transition-colors hover:border-[#dcbd23]/40"
            >
              <h2 className="mb-1 font-serif text-lg text-[#1a2744] md:text-xl">
                {book.title}
              </h2>
              <p className="text-sm text-[#1a2744]/60">
                {book.author}
                {book.publicationYear && ` (${book.publicationYear})`}
              </p>
              {book.bookstoreUrl && (
                <p className="mt-2 text-xs text-[#dcbd23]">
                  Available at SRF Bookstore
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
