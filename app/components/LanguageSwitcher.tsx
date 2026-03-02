/**
 * Language switcher — M2a-9 (ADR-027).
 *
 * Minimal locale toggle. Shows current locale flag/code.
 * Switches between available locales.
 */

"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { locales, localeNames } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <select
      value={locale}
      onChange={(e) => switchLocale(e.target.value as Locale)}
      className="rounded border border-[#1a2744]/10 bg-transparent px-1.5 py-1 text-xs text-[#1a2744]/60 min-h-[44px] cursor-pointer focus:border-[#dcbd23] focus:outline-none"
      aria-label="Language"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeNames[loc]}
        </option>
      ))}
    </select>
  );
}
