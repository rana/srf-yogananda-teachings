/**
 * Site footer — M1c-4.
 *
 * Minimal nav + text-only toggle + copyright.
 */

import Link from "next/link";
import { TextOnlyToggle } from "./TextOnlyToggle";

export function Footer() {
  return (
    <footer className="border-t border-[#1a2744]/10 bg-[#FAF8F5]">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <nav className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#1a2744]/50">
          <Link href="/" className="hover:text-[#1a2744] transition-colors">
            Home
          </Link>
          <Link href="/read" className="hover:text-[#1a2744] transition-colors">
            Books
          </Link>
          <Link href="/search" className="hover:text-[#1a2744] transition-colors">
            Search
          </Link>
          <Link href="/legal" className="hover:text-[#1a2744] transition-colors">
            Legal
          </Link>
          <a
            href="https://yogananda.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1a2744] transition-colors"
          >
            yogananda.org
          </a>
          <a
            href="https://bookstore.yogananda.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1a2744] transition-colors"
          >
            SRF Bookstore
          </a>
        </nav>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-[#1a2744]/30">
            &copy; Self-Realization Fellowship
          </p>
          <TextOnlyToggle />
        </div>
      </div>
    </footer>
  );
}
