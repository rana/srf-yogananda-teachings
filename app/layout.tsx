/**
 * Root layout — M2a-9, M2a-19 (ADR-075, ADR-099).
 *
 * Locale-agnostic shell. Sets up fonts, global CSS, JSON-LD,
 * and utilities that work across all locales.
 * Header and Footer are in the [locale] layout (locale-aware).
 */

import type { Viewport } from "next";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/app/components/ServiceWorkerRegistration";
import { LowBandwidthBanner } from "@/app/components/LowBandwidthBanner";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} dir="ltr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "SRF Teachings Portal",
                url: "https://teachings.yogananda.org",
                description:
                  "Paramahansa Yogananda's published teachings — freely accessible worldwide",
                copyrightHolder: {
                  "@type": "Organization",
                  name: "Self-Realization Fellowship",
                  url: "https://yogananda.org",
                },
                publisher: {
                  "@type": "Organization",
                  name: "Self-Realization Fellowship",
                  url: "https://yogananda.org",
                },
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate:
                      "https://teachings.yogananda.org/en/search?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Self-Realization Fellowship",
                url: "https://yogananda.org",
                sameAs: [
                  "https://www.wikidata.org/wiki/Q1075365",
                  "https://en.wikipedia.org/wiki/Self-Realization_Fellowship",
                  "https://www.youtube.com/@YoganandaSRF",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Paramahansa Yogananda",
                url: "https://yogananda.org/paramahansa-yogananda",
                sameAs: [
                  "https://www.wikidata.org/wiki/Q131814",
                  "https://en.wikipedia.org/wiki/Paramahansa_Yogananda",
                ],
                birthDate: "1893-01-05",
                deathDate: "1952-03-07",
                birthPlace: {
                  "@type": "Place",
                  name: "Gorakhpur, India",
                },
                description:
                  "Indian Hindu monk, yogi, and guru who introduced millions of westerners to the teachings of meditation and Kriya Yoga through his organization Self-Realization Fellowship.",
              },
            ]),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col font-serif text-srf-navy bg-warm-cream">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-srf-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <LowBandwidthBanner />
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
