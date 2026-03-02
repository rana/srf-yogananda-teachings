"use client";

/**
 * Lazy-loaded QuietCornerClient wrapper — defers timer/audio JS
 * to reduce First Load JS on the quiet page (PRI-07: <120KB budget).
 *
 * A centered skeleton prevents layout shift while the component loads.
 */

import dynamic from "next/dynamic";
import type { DailyPassage } from "@/lib/services/passages";

const QuietCornerClient = dynamic(
  () =>
    import("@/app/components/QuietCornerClient").then(
      (mod) => mod.QuietCornerClient,
    ),
  {
    ssr: false,
    loading: () => (
      <main
        id="main-content"
        className="flex min-h-screen flex-col items-center justify-center px-4"
      >
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-8 h-7 w-40 mx-auto animate-pulse rounded bg-srf-navy/10" />
          <div className="space-y-3">
            <div className="h-6 animate-pulse rounded bg-srf-navy/5" />
            <div className="h-6 animate-pulse rounded bg-srf-navy/5" />
            <div className="h-6 w-3/4 mx-auto animate-pulse rounded bg-srf-navy/5" />
          </div>
        </div>
      </main>
    ),
  },
);

interface Props {
  passage: DailyPassage | null;
}

export function LazyQuietCorner({ passage }: Props) {
  return <QuietCornerClient passage={passage} />;
}
