/**
 * Site footer — M2a-5 (ADR-088).
 *
 * SRF ecosystem links, text-only toggle, copyright.
 * Locale-aware via next-intl.
 */

"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TextOnlyToggle } from "./TextOnlyToggle";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t border-[#1a2744]/10 bg-[#FAF8F5]">
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Navigation links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#1a2744]/50">
          <Link href="/" className="hover:text-[#1a2744] transition-colors">
            {nav("home")}
          </Link>
          <Link href="/books" className="hover:text-[#1a2744] transition-colors">
            {nav("books")}
          </Link>
          <Link href="/search" className="hover:text-[#1a2744] transition-colors">
            {nav("search")}
          </Link>
          <Link href="/quiet" className="hover:text-[#1a2744] transition-colors">
            {nav("quiet")}
          </Link>
          <Link href="/browse" className="hover:text-[#1a2744] transition-colors">
            {t("browseAll")}
          </Link>
          <Link href="/privacy" className="hover:text-[#1a2744] transition-colors">
            {nav("privacy")}
          </Link>
          <Link href="/legal" className="hover:text-[#1a2744] transition-colors">
            {nav("legal")}
          </Link>
        </nav>

        {/* External SRF links */}
        <nav className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#1a2744]/40">
          <a
            href="https://yogananda.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1a2744]/60 transition-colors"
          >
            {t("yoganandaOrg")}
          </a>
          <a
            href="https://yogananda.org/lessons"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1a2744]/60 transition-colors"
          >
            {t("lessons")}
          </a>
          <a
            href="https://bookstore.yogananda.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1a2744]/60 transition-colors"
          >
            {t("bookstore")}
          </a>
          <a
            href="https://www.youtube.com/@YoganandaSRF"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1a2744]/60 transition-colors"
          >
            YouTube
          </a>
        </nav>

        {/* Bottom row */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-[#1a2744]/30">{t("copyright")}</p>
          <TextOnlyToggle />
        </div>
      </div>
    </footer>
  );
}
