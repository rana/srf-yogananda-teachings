/**
 * Locale loading state — M2a-8.
 *
 * Minimal, calm loading indicator. The portal waits (PRI-08).
 */

import { SrfLotus } from "@/app/components/SrfLotus";

export default function Loading() {
  return (
    <main id="main-content" className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <SrfLotus size="lg" className="w-8 h-8 text-srf-gold animate-pulse" />
        <p className="sr-only">Loading...</p>
      </div>
    </main>
  );
}
