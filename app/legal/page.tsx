/**
 * Legal stub page — M1c-12 (ADR-081 §3a).
 *
 * Minimal copyright notice. Full legal page in Milestone 2a-20.
 */

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <h1 className="mb-6 font-serif text-2xl text-[#1a2744] md:text-3xl">
          Legal
        </h1>

        <section className="space-y-4 text-sm leading-relaxed text-[#1a2744]/80">
          <h2 className="text-lg font-medium text-[#1a2744]">Copyright</h2>
          <p>
            All content on this portal is the verbatim published work of
            Paramahansa Yogananda and other Self-Realization Fellowship (SRF)
            authors. Content is &copy; Self-Realization Fellowship. All rights
            reserved.
          </p>
          <p>
            This portal makes Yogananda&apos;s published teachings freely
            accessible for reading and personal study. Reproduction,
            redistribution, or commercial use of any content requires written
            permission from Self-Realization Fellowship.
          </p>

          <h2 className="mt-8 text-lg font-medium text-[#1a2744]">
            No AI-Generated Content
          </h2>
          <p>
            No content displayed on this portal is generated, paraphrased, or
            synthesized by artificial intelligence. The search system retrieves
            and ranks verbatim published passages — it never generates text.
          </p>

          <h2 className="mt-8 text-lg font-medium text-[#1a2744]">Contact</h2>
          <p>
            Self-Realization Fellowship
            <br />
            <a
              href="https://yogananda.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#dcbd23] hover:text-[#1a2744]"
            >
              yogananda.org
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
