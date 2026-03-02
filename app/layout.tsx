import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/app/components/Footer";
import { ServiceWorkerRegistration } from "@/app/components/ServiceWorkerRegistration";
import { LowBandwidthBanner } from "@/app/components/LowBandwidthBanner";

export const metadata: Metadata = {
  title: "SRF Teachings Portal",
  description: "Paramahansa Yogananda's published teachings — freely accessible worldwide",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            }),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <LowBandwidthBanner />
        <div className="flex-1">{children}</div>
        <Footer />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
