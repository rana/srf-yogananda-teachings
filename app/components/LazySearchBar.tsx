"use client";

/**
 * Lazy-loaded SearchBar wrapper — defers SearchBar JS to reduce
 * First Load JS on the homepage (PRI-07: <120KB budget).
 *
 * The search bar is below the fold; a dimension-matched skeleton
 * prevents layout shift while the component loads.
 */

import dynamic from "next/dynamic";

const SearchBar = dynamic(
  () => import("@/app/components/SearchBar").then((mod) => mod.SearchBar),
  {
    ssr: false,
    loading: () => (
      <form role="search" aria-hidden="true">
        <div className="flex gap-2">
          <div className="min-h-11 flex-1 rounded-lg border border-srf-navy/15 bg-white px-4 py-2.5" />
          <div className="min-h-11 w-20 rounded-lg bg-srf-navy/10" />
        </div>
      </form>
    ),
  },
);

export function LazySearchBar() {
  return <SearchBar />;
}
