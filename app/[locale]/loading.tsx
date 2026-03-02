/**
 * Locale loading state — M2a-8.
 *
 * Minimal, calm loading indicator. The portal waits (PRI-08).
 */

export default function Loading() {
  return (
    <main id="main-content" className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <p className="text-2xl text-srf-gold animate-pulse" aria-hidden="true">✦</p>
        <p className="sr-only">Loading...</p>
      </div>
    </main>
  );
}
