"use client";

/**
 * Share button — M2a-6 (DES-006).
 *
 * Uses Web Share API where available, falls back to clipboard copy.
 * Shares passage text with full citation (PRI-02: full attribution always).
 */

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

interface ShareButtonProps {
  /** Passage text for citation-based sharing (search results) */
  passage?: string;
  citation?: {
    author: string;
    book: string;
    chapter: string;
    chapterNumber: number;
    page?: number | null;
  };
  /** Simplified props for passage page sharing */
  url?: string;
  text?: string;
  title?: string;
}

export function ShareButton({ passage, citation, url, text, title }: ShareButtonProps) {
  const t = useTranslations("share");
  const [copied, setCopied] = useState(false);

  const shareText = passage && citation
    ? `"${passage}"\n\n— ${citation.author}, ${citation.book}, Ch. ${citation.chapterNumber}: ${citation.chapter}${citation.page ? `, p. ${citation.page}` : ""}`
    : text || "";

  const shareTitle = citation
    ? `${citation.book} — ${citation.chapter}`
    : title || "";

  const handleShare = useCallback(async () => {
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

    // Web Share API (mobile, supported browsers)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or API failed — fall through to clipboard
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  }, [shareText, shareTitle, url]);

  return (
    <button
      type="button"
      onClick={handleShare}
      data-no-print
      className="min-h-11 inline-flex items-center gap-1.5 rounded-lg border border-srf-navy/10 px-3 py-1.5 text-xs text-srf-navy/60 transition-colors hover:border-srf-gold/40 hover:text-srf-navy"
      aria-label={t("button")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path d="M13 4.5a2.5 2.5 0 1 1 .702 1.737L6.97 9.604a2.518 2.518 0 0 1 0 .799l6.732 3.365a2.5 2.5 0 1 1-.671 1.341l-6.732-3.365a2.5 2.5 0 1 1 0-3.482l6.732-3.365A2.52 2.52 0 0 1 13 4.5Z" />
      </svg>
      {copied ? t("copied") : t("button")}
    </button>
  );
}
