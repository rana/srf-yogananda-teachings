import Link from "next/link";
import { notFound } from "next/navigation";
import pool from "@/lib/db";
import { getChapterContent } from "@/lib/services/books";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ bookId: string; chapter: string }>;
}) {
  const { bookId, chapter } = await params;
  const chapterNumber = parseInt(chapter, 10);
  if (isNaN(chapterNumber) || chapterNumber < 1) notFound();

  const content = await getChapterContent(pool, bookId, chapterNumber);
  if (!content) notFound();

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="border-b border-[#dcbd23]/20 bg-white">
        <div className="mx-auto max-w-[38rem] px-4 py-4">
          <nav className="mb-2 text-sm text-[#1a2744]/50">
            <Link href="/read" className="hover:text-[#1a2744]/80">
              Books
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <Link
              href={`/read/${bookId}`}
              className="hover:text-[#1a2744]/80"
            >
              {content.book.title}
            </Link>
          </nav>
          <h1 className="font-serif text-xl text-[#1a2744] md:text-2xl">
            <span className="mr-2 text-[#1a2744]/40">
              {content.chapter.chapterNumber}.
            </span>
            {content.chapter.title}
          </h1>
          <p className="mt-1 text-sm text-[#1a2744]/50">
            {content.book.author}
          </p>
        </div>
      </header>

      {/* Content */}
      <article className="mx-auto max-w-[38rem] px-4 py-8 md:py-12">
        <div className="space-y-6">
          {content.paragraphs.map((para) => (
            <p
              key={para.id}
              className="font-serif text-base leading-[1.8] text-[#1a2744] md:text-[1.125rem] md:leading-[1.85]"
            >
              {para.content}
            </p>
          ))}
        </div>
      </article>

      {/* Chapter navigation */}
      <nav
        className="border-t border-[#1a2744]/10 bg-white"
        aria-label="Chapter navigation"
      >
        <div className="mx-auto flex max-w-[38rem] items-stretch">
          {content.prevChapter ? (
            <Link
              href={`/read/${bookId}/${content.prevChapter.chapterNumber}`}
              className="flex flex-1 flex-col px-4 py-4 text-left transition-colors hover:bg-[#FAF8F5] min-h-[44px]"
            >
              <span className="text-xs text-[#1a2744]/40">Previous</span>
              <span className="text-sm text-[#1a2744]">
                {content.prevChapter.chapterNumber}.{" "}
                {content.prevChapter.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          <div className="w-px bg-[#1a2744]/10" />

          {content.nextChapter ? (
            <Link
              href={`/read/${bookId}/${content.nextChapter.chapterNumber}`}
              className="flex flex-1 flex-col px-4 py-4 text-right transition-colors hover:bg-[#FAF8F5] min-h-[44px]"
            >
              <span className="text-xs text-[#1a2744]/40">Next</span>
              <span className="text-sm text-[#1a2744]">
                {content.nextChapter.chapterNumber}.{" "}
                {content.nextChapter.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </nav>
    </main>
  );
}
