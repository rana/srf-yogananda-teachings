/**
 * The Quiet Corner — M2a-3 (ADR-072).
 *
 * Single-page micro-sanctuary: random affirmation,
 * optional gentle timer (1/5/15 min), chime at completion.
 * No tracking, no accounts.
 * Header collapses to lotus mark only, footer suppressed.
 */

import { setRequestLocale } from "next-intl/server";
import { LazyQuietCorner } from "@/app/components/LazyQuietCorner";
import pool from "@/lib/db";
import { getReflectionPassage } from "@/lib/services/passages";

export default async function QuietCornerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const passage = await getReflectionPassage(pool, locale === "es" ? "es" : "en");

  return <LazyQuietCorner passage={passage} />;
}
