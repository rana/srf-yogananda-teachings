# SRF Online Teachings Portal — Roadmap

> **At a glance.** 15 phases (0–14) from proving the search through community curation at scale, plus supporting sections.

| Phase | Name | Focus |
|-------|------|-------|
| [0](#phase-0-prove) | Prove | Foundation, single-book search, AI librarian |
| [1](#phase-1-build) | Build | All pages, engineering infrastructure, accessibility |
| [2](#phase-2-read) | Read | Dwell, bookmarks, keyboard nav, typography |
| [3](#phase-3-grow) | Grow | Multi-book corpus, cross-book search |
| [4](#phase-4-operate) | Operate | Theme tagging, editorial portal, staffing |
| [5](#phase-5-connect) | Connect | Related Teachings, chunk relations, graph traversal |
| [6](#phase-6-complete) | Complete | Final books, observability, Knowledge Graph |
| [7](#phase-7-empower) | Empower | Study Workspace, PDF export, staff tools |
| [8](#phase-8-distribute) | Distribute | Email, social, WhatsApp, RSS, webhooks, MCP |
| [9](#phase-9-integrate) | Integrate | Contentful CMS, GitLab, regional distribution |
| [10](#phase-10-translate) | Translate | 9 languages, translation workflow |
| [11](#phase-11-polish) | Polish | WCAG audit, design system, PWA, TTS |
| [12](#phase-12-multimedia) | Multimedia | Video, audio, images, cross-media hub |
| [13](#phase-13-personalize) | Personalize | Optional auth, sync, personalized email |
| [14](#phase-14-community) | Community | Events, study circles, VLD curation |
| — | [Future: SRF Lessons](#future-consideration-srf-lessons-integration) | Not scheduled |
| — | [PWA-First Strategy](#pwa-first-strategy-no-native-app) | No native app rationale |
| — | [Phase Gates](#phase-gates) | Go/no-go criteria between phases |
| — | [Cost Trajectory](#cost-trajectory) | Infrastructure cost projections |
| — | [Dependencies and Risks](#dependencies-and-risks) | Risk register and cross-phase dependencies |

---

## Phasing Philosophy

Each phase delivers a working, demonstrable increment organized around a single capability theme. 15 phases total (0–14). Phase 0 proves that semantic search works. Phase 1 builds the complete portal with engineering infrastructure alongside it (CI/CD, testing, Terraform — not deferred to a later phase). Phase 2 refines the contemplative reader. Phases 3–4 decompose the multi-book expansion: Phase 3 (Grow) expands the corpus independently of organizational decisions, while Phase 4 (Operate) establishes editorial operations once SRF staffing is confirmed — this split makes the most critical organizational dependency visible as its own phase gate. Phases 5–6 build cross-book intelligence and complete the library. Phases 7–8 extend reach through tools and distribution channels. Phases 9–11 add Contentful CMS, multi-language support, and accessibility polish. Phase 12 delivers cross-media intelligence across video, audio, and images in one coherent phase. Phase 13 adds optional user accounts. Phase 14 combines community events and curation at scale.

---

## Phase Sizing Analysis

*Section added: 2026-02-21, greenfield phase review. Proposal C adopted 2026-02-21 (ADR-103).*

The original 18-phase roadmap had an asymmetric deliverable distribution. Five structural observations led to three resequencing proposals. Proposal C was adopted, reorganizing around 15 capability themes. The observations that motivated the restructuring:

1. **Phase 2 spanned three workstreams** — page build-out, content delivery infrastructure, and foundational concerns. Now merged with engineering infrastructure into Phase 1 (Build).
2. **Engineering infrastructure arrived after the portal was built** — CI/CD, testing, Terraform shipped in old Phase 3, after 20 portal deliverables. Now co-delivered in Phase 1 (Build).
3. **Phase 5 was the riskiest phase** — 23 deliverables mixing content expansion, editorial operations, and SRF staffing dependencies. Now decomposed into Phase 3 (Grow) and Phase 4 (Operate).
4. **The Contentful migration at Phase 10 carries rework cost** — observation preserved; timing unchanged pending stakeholder input.
5. **The Knowledge Graph is built incrementally** — graph data model ships in Phase 6 (Complete); visualization grows as content types are added.

### Open Questions (from original analysis)

1. **Calendar timeline.** What is the assumed team size and velocity?
2. **Parallel workstreams.** Phase 3 (Grow) book ingestion is independent of Phase 4 (Operate) editorial work. Which phases have parallelizable workstreams?
3. **Minimum lovable product.** Which phase constitutes "launched" — publicly available to seekers?
4. **Critical path through SRF decisions.** Five phases are gated by stakeholder decisions with no committed timelines.
5. **Phase 4 staffing gate failure mode.** If SRF hasn't identified editorial staff by Phase 4, is there an autonomous degraded mode?
6. **Rework cost quantification.** Every book ingested before Phase 9 gets ingested twice (PDF pipeline, then Contentful).
7. **Editorial capacity curve.** At what phase does the monastic editor's 2–3 hour daily window become insufficient?

See CONTEXT.md § Open Questions for the consolidated list. See ADR-102 (analysis) and ADR-103 (adoption).

---

## Phase 0: Prove

**Goal:** Provision the development environment, resolve blocking questions, and prove that semantic search across Yogananda's text returns high-quality, relevant, verbatim passages with accurate citations. Deliver a working vertical slice: ingest → search → read.

*Phase 0 is the first encounter between this design and a real seeker. Every decision made here will be tested by someone in need. Build accordingly.*

**Focus book:** Autobiography of a Yogi

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 0.1 | **Repository + development environment** | Create Next.js + TypeScript + Tailwind + pnpm repository. Configure ESLint, Prettier, `.env.example`. Establish `/lib/services/`, `/app/api/v1/`, `/migrations/`, `/terraform/`, `/scripts/`, `/messages/` directory structure. (ADR-041) |
| 0.2 | **Neon project provisioning** | Create Neon project with pgvector extension enabled. Create dev branch for local development. Note pooled and direct connection strings. Verify connectivity from local environment. |
| 0.3 | **Vercel project + Sentry project** | Link repository to Vercel. Configure environment variables. Deploy stub `/api/v1/health` endpoint. Create Sentry project, configure DSN, verify error capture. (ADR-095) |
| 0.4 | **Initial schema migration** | Write `001_initial_schema.sql` covering all search tables (books, chapters, book_chunks, teaching_topics, chunk_topics, daily_passages, affirmations, chunk_relations, search_queries, search_theme_aggregates, chapter_study_notes, book_chunks_archive). All content tables include `updated_at` column with auto-set trigger and composite `(updated_at, id)` index for timestamp-filtered pagination (ADR-107). Run via dbmate. Verify tables, indexes, hybrid_search function, and tsvector trigger. |
| 0.5 | **Stakeholder kickoff** | Confirm with SRF AE team: GitHub acceptable for Phases 0–8? Confirm PDF source for Autobiography. Confirm portal domain (`teachings.yogananda.org` or alternative). |
| 0.6 | **Edition confirmation** | Confirm with SRF which edition of Autobiography of a Yogi is the canonical page-number reference (1946 first edition, 1998 13th edition, or current printing). All portal citations depend on this. (ADR-034) |
| 0.7 | **Neon database + schema** | PostgreSQL with pgvector enabled. Tables: books (with `bookstore_url`, `edition`, `edition_year` per ADR-034), chapters, book_chunks (with `embedding_model` versioning per ADR-046, `content_hash` for stable deep links per ADR-022), teaching_topics (with `category` and `description_embedding` per ADR-032), chunk_topics (three-state `tagged_by` per ADR-032), daily_passages, affirmations, chunk_relations, search_theme_aggregates (ADR-053), chapter_study_notes, book_chunks_archive (ADR-034). Hybrid search function. dbmate configured with `/migrations/` directory. Initial schema as migration 001. (ADR-093, ADR-050, ADR-032, ADR-022, ADR-053, ADR-034) |
| 0.8 | **PDF ingestion script** | Download Autobiography PDF → convert with marker → chunk by paragraphs → generate embeddings → insert into Neon. Chunking follows the formal strategy in DESIGN.md § Chunking Strategy (ADR-048): paragraph-based, 100–500 token range, special handling for epigraphs and poetry. Typographic normalization applied during ingestion (smart quotes, proper dashes, ellipsis glyphs). Compute SHA-256 per chapter during ingestion and store in `chapters.content_hash` (ADR-039) — the `/integrity` page and verification API ship in Phase 1, but hashes are computed here so the data exists from day one. |
| 0.9 | **Human QA of ingested text** | Claude pre-screens ingested text flagging probable OCR errors, formatting inconsistencies, truncated passages, and mangled Sanskrit diacritics (ADR-005 E4). Human reviewers make all decisions — Claude reduces the review surface area. Review mechanism for Phases 0–2 is lightweight (Retool view or CLI pager over ingested chunks) — the full editorial review portal ships in Phase 4. |
| 0.10 | **Shared service layer + API conventions** | All business logic in `/lib/services/` (not in Server Components). API routes use `/api/v1/` prefix, accept both cookie and Bearer token auth, return cursor-based pagination on list endpoints, include Cache-Control headers. (ADR-011) |
| 0.11 | **Search API** | Next.js API route (`/api/v1/search`) implementing hybrid search (vector + FTS + RRF). Returns ranked verbatim passages with citations. Search intent classification routes seekers to the optimal experience (theme page, reader, empathic entry, or standard search). (ADR-011, ADR-005 E1) |
| 0.12 | **Query expansion + spiritual terminology bridge** | Claude API integration for expanding conceptual queries into semantic search terms. Includes tradition-aware vocabulary mapping (`/lib/data/spiritual-terms.json`) that bridges modern/cross-tradition terms to Yogananda's vocabulary. Per-book evolution lifecycle: each book ingestion triggers vocabulary extraction → diff → human review → merge (ADR-051). Optional — bypassed for simple keyword queries. (ADR-005 E2, ADR-051) |
| 0.13 | **Search UI** | Search results page: ranked verbatim quoted passages with book/chapter/page citations. "Read in context" deep links. |
| 0.14 | **Basic book reader** | Chapter-by-chapter reading view with deep-link anchors, optimal line length (65–75 chars / `max-width: 38rem`), prev/next chapter navigation, "Find this book" SRF Bookstore links, basic reader accessibility (skip links, semantic HTML). |
| 0.15 | **Minimal homepage** | Today's Wisdom (random passage on each visit), "Show me another" link (new random passage, no page reload). Search bar with prompt "What are you seeking?" Styled with SRF design tokens. Cross-fade animation added in Phase 1. |
| 0.16 | **Observability foundation** | Sentry error tracking with Next.js source maps. Structured logging via `/lib/logger.ts` (JSON, request ID correlation). Health check endpoint (`/api/v1/health`). Vercel Analytics for Core Web Vitals. (ADR-095) |
| 0.17 | **Search quality evaluation** | Test suite of ~30 representative queries with expected passages. Claude serves as automated evaluation judge in CI — given a query and results, assesses whether expected passages appear and ranking is reasonable. Threshold: ≥ 80% of queries return at least one relevant passage in top 3. Runs on every PR touching search pipeline. Scope note: this evaluation is English-only and cannot assess multilingual retrieval quality — multilingual embedding model benchmarking is deferred to Phase 10 when translated content exists (ADR-047). (ADR-005 E5) |
| 0.18 | **Search API rate limiting** | Two-layer rate limiting: Cloudflare WAF rules (15 searches/min per IP) + application-level limiter. Crawler-tier rate limits: known bots (Googlebot, GPTBot, PerplexityBot, ClaudeBot) get 120 req/min vs. 30 req/min anonymous (ADR-081). Rate-limited searches fall back to database-only (no Claude API call) — graceful degradation. Claude API monthly budget cap as cost protection. `/scripts/` directory with CI-agnostic deployment scripts. Permissive `robots.txt` (allow all, block `/admin/`). (ADR-023, ADR-018, ADR-081) |
| 0.19 | **Custom SRF Corpus MCP server** | Development-time MCP server allowing Claude Code to search the book corpus during development (e.g., "find all passages about meditation in Autobiography"). Connects to Neon, exposes search and chunk-retrieval tools. Registered in `.claude/` config. (ADR-097) |
| 0.20 | **Search suggestions — basic prefix matching** | `GET /api/v1/search/suggest` endpoint returning term completions from single-book vocabulary: distinctive terms extracted from Autobiography chunks during ingestion, chapter titles, book title. PostgreSQL `pg_trgm` trigram index for fuzzy prefix matching. Zero-state experience: curated theme names as suggestion chips when search bar is focused but empty. Curated query suggestions seeded from search quality test suite (~30 queries). ARIA combobox pattern for accessibility. Latency target: < 50ms. No Claude API call in suggestion path. (ADR-049) |
| 0.21 | **Cultural design consultation** | Identify at least one YSS-connected consultant (designer, devotee, or monastic) who participates in design reviews from Phase 0. Cultural consultation is a posture maintained throughout all phases, not a Phase 10 deliverable. This consultant reviews visual design tokens, editorial voice, "Seeking..." entry points, and the `/guide` worldview pathways for cultural sensitivity. Does not require full-time commitment — periodic review sessions. (See CONTEXT.md § Spiritual Design Principles, ADR-006, ADR-077) |

### Technology

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Next.js on Vercel (free tier) | $0 |
| Database | Neon PostgreSQL + pgvector (free tier) | $0 |
| AI | Claude API (query expansion, intent classification, terminology bridge, passage ranking, ingestion QA, search eval) | ~$15-25/mo |
| Embeddings | OpenAI text-embedding-3-small | ~$0.10 one-time |
| PDF processing | marker (open-source Python) | $0 |
| Fonts | Google Fonts (Merriweather, Lora, Open Sans) | $0 |
| Error tracking | Sentry (free tier: 5K errors/mo) | $0 |
| Migrations | dbmate (open-source) | $0 |
| Analytics | Vercel Analytics (free tier) | $0 |
| SCM | GitHub (Phases 0–8) → GitLab (Phase 9+, SRF IDP) | $0 |
| CI/CD | GitHub Actions (Phases 0–8) → GitLab CI (Phase 9+) | $0 |

### Success Criteria

- `pnpm dev` starts a working Next.js application locally
- `/api/v1/health` returns `200 OK` on both local and Vercel
- `dbmate status` shows migration 001 applied
- Sentry test error appears in dashboard
- `.env.example` documents all required environment variables
- A seeker can type "How do I overcome fear?" and receive 3–5 relevant, verbatim Yogananda quotes with accurate book/chapter/page citations
- "Read in context" links navigate to the correct passage in the reader
- Simple keyword searches ("divine mother") work without any LLM involvement
- Search latency < 2 seconds for hybrid queries
- Zero AI-generated content appears in any user-facing result
- The homepage displays a different Yogananda passage on each visit ("Today's Wisdom")
- "Show me another" loads a new random passage without page reload
- The book reader enforces 65–75 character line length
- "Find this book" links are present on every passage and link to the SRF Bookstore
- Search quality evaluation passes: ≥ 80% of test queries return at least one relevant passage in the top 3 results
- Sentry captures errors, structured logging works with request ID correlation

### Open Questions to Resolve

See CONTEXT.md § Open Questions for the consolidated list of technical and stakeholder questions. Questions live there so they're visible at session start and move to "Resolved" as work progresses.

---

## Phase 1: Build

**Goal:** Build every page, establish the SRF visual identity, deliver a complete portal experience that a stakeholder can navigate end-to-end, and establish the testing pipeline, infrastructure-as-code, and component library that enable confident, automated development for all subsequent phases. Engineering infrastructure is built alongside the portal, not after it.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 1.1 | **Full homepage — "The Living Library"** | Placeholder thematic doors (linked to pre-built search queries until Phase 4 populates the theme system), "Seeking..." empathic entry points, latest YouTube videos section using RSS feed + YouTube Data API (categorized playlists, ISR revalidation), and "Show me another" cross-fade upgrade. |
| 1.2 | **The Library and Book Landing** | `/books` page ("The Library") listing available books with cover images, editorial descriptions, chapter counts, and SRF Bookstore links. `/books/[slug]` book landing page with cover, metadata, featured quote, editorial description, and full chapter list. Warm, unhurried design even with a single book — honest "More books are being added" note with SRF Bookstore signpost. |
| 1.3 | **The Quiet Corner** | Single-page micro-sanctuary (`/quiet`): random affirmation from curated pool (circadian-aware selection), optional gentle timer (1/5/15 min), chime at completion with haptic singing bowl pattern. Timer completion flow: chime → 3s stillness → crossfade to parting passage (DES-014). Self-contained page: header collapses to lotus mark only, footer suppressed. No tracking, no accounts. Initially sourced from Autobiography's most contemplative passages. Restricted to `accessible` passages (ADR-072). |
| 1.4 | **About page** | `/about`: Yogananda biography, line of gurus (with official portraits), SRF overview, "Go Deeper" links to SRF Lessons, center locator, Online Meditation Center, bookstore, app. |
| 1.5 | **Navigation and footer** | Persistent header nav (Search, Books, Videos, Quiet Corner, About). Footer with SRF ecosystem links and small Yogananda portrait (ADR-088) on every page. External links to yogananda.org, SRF Lessons, Online Meditation Center, SRF Bookstore, center locator, app, YouTube. Unified lotus SVG motif as section dividers and favicon (DES-016). |
| 1.6 | **Passage sharing** | Every passage gets a quiet share icon. Mobile: `navigator.share` opens the native share sheet (surfaces WhatsApp, Telegram, SMS, etc.) — "Save as image" and "Save as PDF" in overflow menu. Desktop: custom share menu (copy link, email passage, save as image, save as PDF). Generates `/passage/[id]` URL with OG meta tags and content-hash parameter for stable deep links (ADR-022). Quote image generation via `@vercel/og`. PDF: single-page, Merriweather, warm cream, lotus watermark, A4. File size displayed on all downloads ("Download PDF (2.1 MB)"). No social media buttons or tracking scripts. (ADR-068, ADR-022, ADR-024) |
| 1.7 | **SEO and machine access foundations** | Comprehensive machine-readability layer per ADR-081. **Structured data:** JSON-LD per page type — `Book` with `ReadAction` (free read in SERPs), `Chapter`, `Quotation` with `SpeakableSpecification` (voice assistant read-aloud), `BreadcrumbList` (on all deep pages), `WebSite` + `SearchAction`, `Organization` + `Person` with `sameAs` (Wikidata, Wikipedia, yogananda.org for Knowledge Panel association), `AudioObject`, `VideoObject`. **Meta tags:** Google Scholar citation tags on passage pages. Twitter Card tags (`summary_large_image` on content pages, `summary` on utility pages). `<meta name="robots" content="max-image-preview:large, max-snippet:-1, max-video-preview:-1">` on all content pages (Google Discover eligibility). **Canonical URLs:** `<link rel="canonical">` on every page per ADR-081 §9. **Sitemaps:** Per-content-type XML sitemaps (`/sitemap-books.xml`, `/sitemap-themes.xml`, etc.) with `<lastmod>` and `<changefreq>`. **Machine files:** `llms.txt` with AI citation guidance; `llms-full.txt` with corpus metadata inventory (passage-level content deferred to Phase 8+); `indexnow-key.txt` for IndexNow domain verification; `/.well-known/security.txt` (RFC 9116). **Content negotiation:** `Accept: application/json` on page routes returns structured JSON with fidelity metadata (ADR-081 §11). **IndexNow:** Pings fired on content changes (book ingestion, daily passage rotation). **Feeds:** RSS auto-discovery `<link rel="alternate">` tags in `<head>` (feed content in Phase 8). **Rendering:** All content pages ISR/SSR with complete server-rendered HTML; client-only pages (`/bookmarks`, `/study`, `/feedback`) are `noindex`. OG quote images generated at minimum 1200×630px. Google Search Console + Bing Webmaster Tools setup. (ADR-081) |
| 1.8 | **Accessibility foundation** | WCAG 2.1 AA from day one. Semantic HTML, ARIA landmarks, keyboard navigation, skip links, focus indicators, screen reader testing, color contrast compliance, `prefers-reduced-motion` support, 44×44px touch targets. Automated a11y testing in CI via axe-core. Claude-generated reverential alt text for all Yogananda photographs (About page, footer, book covers), reviewed by SRF editors. ARIA labels written as warm speech (ADR-073). Progressive homepage disclosure for first visits (ADR-072). (ADR-003, ADR-005 E7, ADR-072, ADR-073) |
| 1.9 | **i18n infrastructure** | All UI strings externalized to `messages/en.json`. `next-intl` configured with `en` as sole locale. CSS logical properties throughout (`ms-*` not `ml-*`). `lang` attribute on `<html>`. No hardcoded strings in components. `topic_translations` table created (empty until Phase 10). `content_tsv` trigger uses language-appropriate PostgreSQL dictionary. All content-serving API endpoints accept `language` parameter. English-only content, but the architecture is locale-ready. UI copy follows micro-copy standards (ADR-074): "seeker" not "user," warm error messages, contemplative ARIA labels. (ADR-075, ADR-076, ADR-074) |
| 1.10 | **Print stylesheet** | `@media print` stylesheet for reader and passage pages. Remove navigation, footer, side panel. Full-width text at optimal reading width. Merriweather at 11pt. Citation below each passage. Portal URL in small footer. Page breaks between chapters. No background colors. |
| 1.11 | **Text-only mode** | Toggle in site footer and reader settings. Disables images, decorative elements, web fonts (system serif stack). Stored in `localStorage`. Serves seekers on metered data connections. Not a degraded experience — a considered one. (ADR-006) |
| 1.12 | **Minimal Service Worker** | Cache app shell (HTML, CSS, JS, fonts) for instant repeat visits. No offline content yet — just static asset caching. Offline indicator banner: "You're reading offline. Search requires a connection." (ADR-006) |
| 1.13 | **"Start Here" — Newcomer path** | Editorially curated starting points on homepage (below Today's Wisdom) and library page. Three entry paths: the curious reader, the person in need, the meditation seeker. Warm cream card, Merriweather Light, quiet and inviting. Content in `messages/en.json` (i18n-ready). **Per-locale cultural adaptation in Phase 10:** Entry paths are editorial content in locale files, not hardcoded. The three English archetypes (curious reader, person in need, meditation seeker) are Western spiritual archetypes. Phase 10 cultural consultants should author locale-specific entry paths — e.g., Hindi locale may foreground the devotee (already committed, seeking deeper practice) and the family (communal engagement). Japanese locale may add the student (academic/comparative religion interest). |
| 1.14 | **Quiet Corner audio cues** | Two discrete audio files: singing bowl strike at timer start (~15KB), gentle chime at timer end (~15KB). Web Audio API, fixed 15% volume. Static assets bundled in app shell. Not ambient loops — just two moments of sound marking the boundaries of contemplative pause. |
| 1.15 | **Content integrity hashes** | SHA-256 per chapter computed at ingestion time, stored in `chapters.content_hash`. `/integrity` page listing all books and chapter hashes with verification instructions. API endpoint: `GET /api/v1/books/{slug}/integrity`. (ADR-039) |
| 1.16 | **EXIF/XMP metadata on served images** | All portal-served images carry Copyright ("© Self-Realization Fellowship"), Source ("teachings.yogananda.org"), and Description metadata. Applied server-side during image processing. Baseline provenance layer. (ADR-063 Tier 1) |
| 1.17 | **Language-aware URL conventions** | Implement the hybrid language routing design: locale path prefix on frontend pages (`/{locale}/books/...`, default English omits prefix), `language` query parameter on API routes (`/api/v1/search?language=hi`). `next-intl` middleware detects locale from URL, `Accept-Language` header, or stored preference. Theme slugs remain in English for URL stability; display names localized via `topic_translations`. Each system uses the pattern natural to its consumers — SEO-friendly pages, clean API contract. (ADR-027) |
| 1.18 | **`/browse` — The Complete Index (initial)** | High-density text page listing all navigable content, organized by category. Phase 1 version: books only (by editorial category, with chapter counts). Designed text-first — semantic HTML heading hierarchy, zero JavaScript, zero images, < 20KB. Auto-generated from database at build time (ISR). Cacheable by Service Worker as offline artifact. Ideal screen reader experience (heading-level navigation). ARIA label: "Browse all teachings — a complete index of the portal's contents." Linked from site footer ("Browse all teachings"). Grows automatically as content types are added in later phases. (DES-047) |
| 1.19 | **Self-hosted fonts** | Replace Google Fonts CDN with self-hosted WOFF2 files in `/public/fonts/`. Eliminates IP transmission to Google servers (German GDPR compliance, LG München I). Improves performance (no external DNS lookup). `@font-face` with `font-display: swap`. (ADR-099) |
| 1.20 | **Privacy policy and legal pages** | `/privacy` page: human-readable privacy policy in contemplative voice — what data is collected, why, retention periods, sub-processors, data subject rights. `/legal` page: terms of use, copyright, content licensing. Linked from footer on every page. Record of Processing Activities (ROPA) document created. (ADR-099) |
| 1.21 | **Testing infrastructure** | Vitest + React Testing Library for unit/integration tests. Playwright for E2E tests (core user flows: search, read, share, Quiet Corner). axe-core in CI for accessibility. Lighthouse CI for performance budgets. Neon branch-per-test-run isolation. (ADR-094) |
| 1.22 | **Terraform infrastructure + Lambda + database backup** | `/terraform` directory with modules for Neon (project, database, pgvector), Vercel (project, env vars), Sentry (project, DSN), Lambda (IAM roles, layers, VPC config), EventBridge Scheduler, and backup (S3 bucket + Lambda pg_dump via EventBridge Scheduler, nightly, 90-day retention). Lambda infrastructure provisioned here — subsequent phases add functions to already-working infrastructure. GitHub Actions pipeline calls CI-agnostic `/scripts/` (ADR-018): `terraform plan` on PR, `terraform apply` on merge. State in Terraform Cloud free tier. `.env.example` for local development. Quarterly restore drill: test restore from random backup to Neon branch. (ADR-016, ADR-018, ADR-019, ADR-017) |
| 1.23 | **Figma core screens** | Three Figma files (free tier): Home & Search, Reader & Content, Quiet & Utility. Design tokens exported to `tokens.json` → consumed by `tailwind.config.ts`. (ADR-096) |
| 1.24 | **Storybook component library** | Storybook setup documenting all portal components. Design token visualization. Interactive component states. Foundation for Calm Technology design system. |
| 1.25 | **KaiOS emulator in CI** | Add KaiOS browser emulator to the testing matrix. Critical flows (search, read chapter, navigate) must pass on feature phone browsers. (ADR-006) |
| 1.26 | **OpenAPI specification** | Auto-generated `/api/v1/openapi.json` from route handler types. Machine-readable API documentation. Enables auto-generated client libraries and API explorers. (ADR-081) |
| 1.27 | **Timestamp filtering on book endpoints** | `updated_since` and `created_since` query parameters on `GET /api/v1/books` and `GET /api/v1/books/[slug]/chapters`. Response includes `sync` metadata with `latest_timestamp` for incremental sync consumers (Zapier, Lambda, partner integrations). Builds on Phase 0 `updated_at` columns and triggers. (ADR-107) |

### Success Criteria

- All pages exist and are navigable: homepage, search, reader, library, book landing, Quiet Corner, about, passage share, browse
- Homepage has all sections: Today's Wisdom with cross-fade "Show me another", thematic doors, "Seeking..." entry points, YouTube videos
- The Quiet Corner displays an affirmation with a working gentle timer and chime
- About page shows Yogananda biography, line of gurus, "Go Deeper" links
- Passage sharing generates working OG preview cards
- Share menu offers: copy link, email passage, save as image, save as PDF
- Passage PDF generates clean A4 page with warm cream background, Merriweather type, lotus watermark, citation
- SEO structured data validates via Google's Rich Results Test
- All pages pass axe-core: zero critical or serious violations
- No hardcoded UI strings — all in `messages/en.json`
- The portal's visual design is recognizably SRF (Merriweather type, gold accents, warm palette, lotus motif)
- The video section displays recent @YoganandaSRF uploads and categorized playlists without manual intervention
- Print stylesheet works cleanly for reader and passage pages
- Text-only mode toggle works: disables images, decorative elements, web fonts
- Service Worker caches static assets; offline indicator displays when connectivity drops
- "Start Here" section appears on homepage and library page with three entry paths
- Quiet Corner singing bowl plays on timer start, chime on timer end
- Content integrity hashes computed and displayed on `/integrity` page
- Homepage initial payload < 50KB (HTML + critical CSS + inline JS)
- Fonts loaded from `/public/fonts/` — zero requests to `fonts.googleapis.com`
- `/privacy` page exists and discloses all data collection, retention, and sub-processors
- `/legal` page exists with terms of use and copyright information
- CI pipeline runs all test layers (lint, type check, unit, integration, E2E, a11y, Lighthouse) on every PR — all must pass before merge
- `terraform apply` creates a complete development environment from scratch
- Storybook documents all portal components with interactive states
- KaiOS emulator passes critical flows (search, read, navigate)
- `GET /api/v1/books?updated_since=...` returns only recently modified books; response includes `sync.latest_timestamp`

---

## Phase 2: Read

**Goal:** Add the contemplative reader interactions that distinguish the portal from a standard web reader — dwell mode, keyboard navigation, bookmarks, typography refinements, and offline support.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 2.1 | **"Dwell" passage contemplation mode** | Long-press (mobile, 500ms) or click hover-revealed dwell icon (desktop) on any paragraph dims surrounding text to 15% opacity, passage remains vivid, share/bookmark icons appear. `Escape` exits. Screen reader announcements on enter/exit (warm language per ADR-073). `prefers-reduced-motion`: instant transitions, dimming still occurs, haptic suppressed. Desktop: hover over paragraph for 1.5s reveals a small dwell activation icon at inline-start margin (12px circle, `--srf-gold` at 40% opacity). Self-revealing discovery: most evocative passage on first chapter visit has subtly warmer background as hint (DES-015); tooltip as fallback. Mobile: gentle 10ms haptic pulse confirms dwell activation. Dwell also updates Related Teachings side panel immediately. (DES-009, DES-015) |
| 2.2 | **Keyboard-first reading navigation** | Single-key shortcuts: `j`/`k` paragraphs, `d` dwell, `b` bookmark, `r` related, `s` settings, `→`/`←` chapters, `t` table of contents, `/` search bar, `?` help overlay. Suppressed when input focused. `Space` for next chapter only at bottom of page. (DES-013) |
| 2.3 | **Lotus bookmarks** | localStorage-based bookmarks. Lotus icon (SVG, `--srf-gold`) in reader header for chapter bookmarks and in dwell mode for passage bookmarks. `/bookmarks` page listing all bookmarked chapters and passages by book. No server interaction, no accounts, no tracking. Phase 13 migration to server sync when accounts arrive. (ADR-066) |
| 2.4 | **Reader typography refinements** | Drop capitals at chapter starts (Merriweather 700, `--srf-navy`, 3-line `::first-letter`), decorative opening quotation marks on displayed passages (Merriweather 700, 48px, `--srf-gold` at 40% opacity), chapter epigraph treatment (centered, Merriweather 300, muted, generous whitespace), CSS-only paper texture (inline SVG noise pattern), optical margin alignment (`hanging-punctuation` progressive enhancement), citation formatting with em dashes. (DES-008) |
| 2.5 | **Reading time estimate + scroll position + reader settings** | Chapter reading time estimate below chapter title (~X min, disappears on scroll). Scroll position indicator (2px `--srf-gold` at 30% opacity, top of viewport — spatial awareness, not progress tracking). Consolidated reader settings popover: text size (A-/A/A+), color theme (auto/light/dark), line spacing (compact/normal/relaxed). All persisted in `localStorage`. No percentage, no countdown, no completion tracking. |
| 2.6 | **Last-read chapter caching** | Service Worker caches the most recently read chapter HTML. If connectivity drops, the seeker can re-read that chapter offline. Graceful, not full offline support. (ADR-006) |
| 2.7 | **Contextual Quiet Corner** | "Pause with this" icon in dwell mode. Clicking transitions the passage into a mini Quiet Corner: reader chrome fades, passage becomes the affirmation, timer options appear (1/5/15 min). Singing bowl at start, chime at end. On completion, passage offered for bookmarking. CSS mode (`data-mode="quiet"`), not a separate page. |
| 2.8 | **Focus reading mode** | Optional "Focus" toggle in reader header. Reduces reader to: reading column + Next Chapter. Related Teachings panel, keyboard shortcut overlay, dwell icon, and bookmark icon suppressed. Stored in `localStorage`. Serves linear readers, seekers with cognitive needs, and small screens. (ADR-072) |
| 2.9 | **Session closure moments** | Parting-word content blocks at natural session endpoints: below last chapter paragraph (above Next Chapter), bottom of search results, bottom of theme pages. Editorially curated pool of 10–20 short Yogananda passages. Styled in `--portal-text-muted`, Merriweather 300, centered. (DES-014) |
| 2.10 | **Non-search journey polish** | Shared passage page (`/passage/[chunk-id]`) gets framing context and book invitation. External-arrival chapter header for Google traffic. "Show me another" sessionStorage-based repeat prevention. (ADR-067) |
| 2.11 | **Prerender hints (Speculation Rules)** | `<script type="speculationrules">` on reader and navigation pages. Prerender next chapter from reader, chapter 1 from book landing, top search result from search page. Prefetch previous chapter and adjacent navigation targets. Progressive enhancement — ignored by unsupported browsers. Single prerender per page. `data-prerender` attribute on most-likely navigation link, `data-prefetch` on next 2–3 targets. (ADR-081 §13) |

### Success Criteria

- "Dwell" interaction works: long-press (mobile) / hover-revealed icon click (desktop) dims surrounding text, shows share/bookmark icons. Related Teachings side panel updates immediately on dwell. (DES-009)
- Full keyboard navigation: `j`/`k` paragraphs, `d` dwell, `b` bookmark, `→`/`←` chapters, `?` help overlay (DES-013)
- Lotus bookmarks work via `localStorage` — bookmark chapters and passages without an account, view on `/bookmarks` page (ADR-066)
- Drop capitals appear at chapter starts, decorative gold quotation marks on displayed passages, chapter epigraphs styled distinctly (DES-008)
- Reading time estimate displayed below chapter title, scroll position indicator works
- Reader settings (text size, color theme, line spacing) persist in localStorage
- Last-read chapter available offline via Service Worker cache
- Focus mode toggle reduces reader to reading + Next Chapter only (ADR-072)
- Parting-word passages appear at natural session endpoints (chapter end, search bottom, theme bottom) (DES-014)
- Shared passage page (`/passage/[chunk-id]`) includes framing context and book invitation (ADR-067)
- Dwell mode triggers haptic confirmation on mobile
- Speculation Rules active: next chapter prerenders from reader page (verified in Chrome DevTools → Application → Speculative loads)

---

## Phase 3: Grow

**Goal:** Ingest high-impact books to reach critical mass of quotable, thematically diverse content. Expand cross-book search and content pools. This phase can proceed independently of SRF editorial staffing decisions.

**Book ingestion priority** (per ADR-030 — life-impact ordering):

| Wave | Books | Rationale |
|------|-------|-----------|
| **First** | *Where There Is Light*, *Sayings of Paramahansa Yogananda*, *Scientific Healing Affirmations* | Short, topically structured, low chunking complexity. Directly power Today's Wisdom, Doors of Entry, and Quiet Corner. |
| **Second** | *Man's Eternal Quest*, *The Divine Romance* | Collected talks — rich, practical, accessible. Moderate chunking complexity. |
| **Third** | *How You Can Talk With God*, *Metaphysical Meditations*, *Journey to Self-Realization* | Short works and third volume of collected talks. |
| **Fourth** | *Wine of the Mystic*, *The Second Coming of Christ* (2 vols), *God Talks With Arjuna* (2 vols) | Niche or massive multi-volume works requiring verse-aware chunking. |

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 3.1 | **Ingest first-wave books** | *Where There Is Light*, *Sayings of Paramahansa Yogananda*, *Scientific Healing Affirmations*. Short, topically organized, low-complexity. Claude classifies passage accessibility level (universal/accessible/deep) at ingestion time — spot-checked by reviewer. (ADR-005 E3) |
| 3.2 | **Expand Today's Wisdom pool** | Populate `daily_passages` from *Sayings* (entire book is standalone quotes) and *Where There Is Light*. Add optional seasonal affinity tags and circadian `time_affinity` tags (dawn/morning/afternoon/evening/night). Claude classifies tone (consoling/joyful/challenging/contemplative/practical) per passage — selection algorithm ensures tonal variety across the week. Default to accessibility level 1–2 passages for newcomer-friendly homepage. Circadian weighting ensures 2 AM visitors encounter consolation, not productivity. (ADR-005 E8, E3) |
| 3.3 | **Expand Quiet Corner pool** | Populate `affirmations` from *Scientific Healing Affirmations* and *Metaphysical Meditations*. |
| 3.4 | **Cross-book search** | Search spans all books by default. Optional book filter. Results show which books address a topic. |
| 3.5 | **Expanded book catalog** | The Library (`/books`) and book landing pages (`/books/[slug]`) established in Phase 1 now display the full multi-book catalog. Book cards show cross-book search availability. Sort/filter by theme or publication year. |
| 3.6 | **Deploy batch Lambda functions** | Deploy book ingestion and chunk relation computation Lambda functions into Phase 1's already-provisioned Lambda infrastructure (`/lambda/handlers/`). Replace manual scripts that would exceed Vercel timeouts. CLI wrappers in `/scripts/` for local development. (ADR-017) |
| 3.7 | **Passage resonance instrumentation** | Anonymous, aggregated counters: share count, dwell count, relation traversal count per passage. Skip count per daily passage. Simple integers, no timestamps, no session correlation. Rate-limited (1 increment per IP per hour). Editorial "Resonance" view in admin portal showing top-resonating passages. (ADR-052) |
| 3.8 | **"What's New in the Library" indicator** | Subtle `--srf-gold` dot (6px) beside "Books" in navigation when new books exist since last Library visit. On the Library page, new books show a "New" label. `localStorage`-based, disappears after seeker visits Library. No tracking. |
| 3.9 | **Search suggestions — multi-book + bridge + curated** | Expand suggestion index across all ingested books. Activate bridge-powered suggestions: when prefix matches a `spiritual-terms.json` key, response includes Yogananda's vocabulary for that concept (e.g., "mindful" → "concentration, one-pointed attention"). Add theme names from `teaching_topics` to suggestion index. Expand curated query suggestions editorially. Suggestion index extraction becomes a standard step in the book ingestion pipeline (ADR-051 lifecycle extension). `/lib/data/curated-queries.json` maintained by SRF-aware editors. (ADR-049) |
| 3.10 | **`/browse` grows — themes, glossary, Quiet textures** | Auto-generated `/browse` page expands to include active teaching topics (all categories), glossary terms (A–Z), and Quiet Corner texture categories. Still zero editorial overhead — all sections generated from database queries at build time. (DES-047) |

### Success Criteria

- First-wave books ingested with correct chunking and citations
- Cross-book search returns results from multiple books for thematic queries
- Today's Wisdom draws from expanded pool with tonal variety
- Quiet Corner draws from *Scientific Healing Affirmations* content
- Lambda batch functions deploy and execute successfully
- Search suggestions include multi-book vocabulary and bridge terms

---

## Phase 4: Operate

**Goal:** Establish editorial operations, build the theme navigation system, and deliver the staff tooling that transforms the portal from a technical project into a running content operation. This phase requires SRF editorial staffing decisions.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 4.1 | **Teaching topic tagging pipeline** | Semi-automated: embed theme descriptions → cosine similarity against all chunks → candidates above threshold get `tagged_by='auto'` → optional Claude classification for ambiguous cases → mandatory human review → `tagged_by='reviewed'`. Three-state provenance: `manual`, `auto`, `reviewed`. Only `manual` and `reviewed` tags served to users. Initial pass: six quality themes (Peace, Courage, Healing, Joy, Purpose, Love) plus **Grief & Loss as the first situation theme** — elevated as a primary empathic entry point because grief is arguably the most common reason someone turns to spiritual literature. Add remaining situation themes (Relationships, Parenting, Work, etc.) and practice themes (Meditation, Concentration, Affirmation, etc.) incrementally — editorial judgment decides when a topic has enough depth to publish (no fixed minimum count). (ADR-032, ADR-033) |
| 4.2 | **Doors of Entry + Explore all themes** | Activate `/themes/[slug]` pages with curated passages from across all books. Each visit shows a different random selection. Homepage shows six quality-theme doors; "Explore all themes →" links to `/themes` index page with sections for quality, situation, and practice themes. Replace Phase 1 placeholder doors with live theme navigation. Person, principle, and scripture categories added in Phase 5 when multi-book content enables meaningful coverage. (ADR-032, ADR-033) |
| 4.3 | **Calendar-aware content surfacing** | `calendar_events` and `calendar_event_passages` tables. Editorially curated date-to-passage associations for Yogananda's life events, Hindu/Christian calendar, and universal observances. Homepage "Today's Wisdom" draws from the calendar pool when a relevant date falls. (DES-028) |
| 4.4 | **The Quiet Index** | Combine E3 (accessibility rating) and E8 (tone classification) into browsable routes: `/quiet/contemplative`, `/quiet/practical`, `/quiet/devotional`, `/quiet/philosophical`, `/quiet/narrative`. Extends the Quiet Corner with texture-based passage browsing. (DES-028) |
| 4.5a | **Editorial review portal — foundation and theme review** | Auth0-protected `/admin` route group built with the portal's calm design system. Auth0 roles: `editor`, `reviewer`. Editorial home screen with role-filtered summary. Theme tag review queue (keyboard-driven: `a` approve, `r` reject, `→` next). Ingestion QA review (flagged passages with Claude suggestions). Content preview ("preview as seeker" for theme pages). Session continuity (resume where you left off). (ADR-082) |
| 4.5b | **Editorial review portal — curation workflows** | Daily passage curation with 7-day lookahead and tone badge display. Calendar event ↔ passage association management. Tone/accessibility spot-check workflow. Content preview for daily passages. Email digest for daily review notifications via scheduled serverless function. (ADR-082) |
| 4.6 | **Early impact view** | Lightweight, DELTA-compliant mission reporting in the admin portal: countries reached (Cloudflare/Vercel analytics), anonymized search themes ("What is humanity seeking?"), content served (passages, books), languages available. Not engagement tracking — mission reporting. Answers: "Are the teachings reaching the world?" Visible to `editor`, `reviewer`, and `leadership` roles. (ADR-053) |
| 4.7 | **Living Glossary** | `/glossary` page: browsable, searchable spiritual terminology. Each entry: term, brief definition (editorial), Yogananda's own explanation (verbatim passage with citation), related themes. Inline reader highlighting (opt-in toggle in reader settings): dotted underline on recognized terms, tooltip with definition. Seeded from `spiritual-terms.json`, enriched per-book via ADR-051 lifecycle. (ADR-038) |
| 4.8 | **Practice bridge after search** | Contextual practice signpost below search results when intent classifier detects practice-oriented queries (meditation, healing, Kriya). Links to SRF Lessons, Quiet Corner, center locator. Editorial text in `messages/en.json`. Signpost, not funnel — no click tracking. |
| 4.9 | **Seeker feedback mechanism** | "Report a citation error" link on every passage. "I didn't find what I needed" option on empty/sparse search results. `/feedback` page linked from footer. `seeker_feedback` table. All DELTA-compliant — no user identifiers stored. Feedback review queue added to editorial portal. (ADR-084) |
| 4.10 | **`/guide` — The Spiritual Guide** | Editorially curated recommendation page organized by seeker context: "If you are new to Yogananda's teachings," "If you are exploring meditation," "If you are dealing with loss," etc. 20–30 pathways, each with 2–3 specific recommendations and brief editorial framing (never paraphrasing Yogananda). Three-state provenance: Claude drafts initial text (`auto`), human review required (`reviewed`/`manual`). Linked from footer ("Where to begin") and "Start Here" newcomer path. Cultural adaptation deferred to Phase 10. (DES-047, ADR-074) |
| 4.11 | **Operational playbook** | `/docs/operational/playbook.md` documenting procedural knowledge: how to add a new book (pre-ingestion checklist through post-publication verification), how to handle a citation error, how to create a curation brief, how to onboard a new staff member to `/admin`. Written alongside the editorial portal it documents. Updated as new workflows are added in subsequent phases. Referenced from the admin portal's help section. |
| 4.12 | **Queue health monitoring** | Editorial home screen includes queue health indicators: oldest unreviewed item per queue, items exceeding age thresholds (48 hours for citation errors, 7 days for standard items), queue depth trend (14-day rolling window). Email digest highlights overdue items. Portal coordinator receives separate notification if any queue exceeds 2× its age threshold. `/lib/services/queue-health.ts`. |
| 4.13 | **Internal MCP tools — editorial tier** | Extend the SRF Corpus MCP (Phase 0 development tier) with Tier 2 internal tools: `get_chunk_with_context`, `get_similar_passages`, `get_glossary_terms_in_passage`, `get_content_coverage`, `verify_citation`, `get_pending_reviews`, `get_daily_passage`. Service-to-service authentication (API key). All DES-035 AI workflows access the corpus through these MCP tools — canonical, auditable interface for every AI proposal. `/lib/mcp/tools/editorial.ts`. (ADR-101, DES-031) |
| 4.14 | **Portal updates page + AI draft pipeline** | `/updates` page ("The Library Notice Board") with `portal_updates` table. AI drafts seeker-facing release notes from deployment metadata in portal voice (ADR-074); human review mandatory before publication. `updates` review queue in editorial portal. Retrospective entries for Phases 0–4. Footer link: "What's new in the portal." (ADR-105, DES-051) |

### Key Challenges

- **Theme tagging quality:** Semi-automated tagging (embeddings) must be validated by human reviewers. A bad theme assignment (a passage about death tagged as "Joy") would undermine trust. Only `manual` and `reviewed` tags are served to users — never unreviewed `auto` tags. (ADR-032)
- **Theme taxonomy expansion:** Multi-category taxonomy: six quality themes on the homepage (stable); situation, practice, person, principle, scripture, and yoga_path categories added incrementally. No fixed minimum passage count — editorial judgment decides when a topic has enough depth to publish. (ADR-032, ADR-033)
- **Editorial staffing gate:** Phase 4 requires SRF to have identified a portal coordinator, content editor, and theological reviewer. The editorial review portal provides tooling — the organizational question of *who* uses it requires SRF input.

### Success Criteria

- Teaching topic tagging pipeline produces accurate theme assignments validated by human review
- Doors of Entry pages show curated passages from multiple books, refreshing on each visit
- Editorial review portal operational with Auth0 authentication and role-filtered views
- Theme tag review queue supports keyboard-driven workflow (approve/reject/next)
- Daily passage curation 7-day lookahead functional
- Queue health indicators visible on editorial home screen
- `/glossary` page displays at least 50 terms with definitions and linked passages
- `/guide` page offers 20+ curated pathways with editorial framing
- `/updates` page displays retrospective entries for Phases 0–4, reviewed and published by portal coordinator

---

## Phase 5: Connect

**Goal:** Launch the Related Teachings system — pre-computed chunk relations, reader side panel, "Continue the Thread" end-of-chapter suggestions, and graph traversal across the library. This is the feature that makes the portal irreplaceable: no physical book, PDF, or ebook can surface cross-book connections while you read. (ADR-050)

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 5.1 | **Chunk relation computation** | Batch job to compute `chunk_relations` for all ingested books. Incremental mode for new books, full mode for embedding model changes. Excludes same-chapter adjacent paragraphs. Stores top 30 per chunk. For top 10 cross-book relations per chunk, Claude classifies the relation type (`same_topic`, `develops_further`, `personal_story`, `practical`) — enables contextual labels like "Yogananda explores this idea at greater length in..." in the side panel. Spot-checked by reviewer. (ADR-050, ADR-005 E6) |
| 5.2 | **Related content API** | `/api/v1/chunks/[id]/related` (per-paragraph, on-demand tier) and `/api/v1/books/[slug]/chapters/[number]/relations` (batch prefetch — all paragraph relations for an entire chapter in one response, ~30–50KB). `/api/v1/books/[slug]/chapters/[number]/thread` (chapter-level aggregation for "Continue the Thread"). All chapter sub-resources consolidated under `/books/[slug]/chapters/[number]/` (ADR-109). Filter support: by book, language, theme, content type. Realtime vector fallback when pre-computed results are sparse. **Batch prefetch API is a core Phase 5 deliverable, not deferred as optimization** — it enables the reading session (5.10) and instant side panel updates. (ADR-050) |
| 5.3 | **Improved reader with Related Teachings** | Related Teachings side panel powered by pre-computed `chunk_relations`. Settled paragraph model: Intersection Observer with focus zone root margin, prominence scoring, 1.2s debounce — side panel updates quietly as reader settles. Source indication in side panel header ("Related to: 'My body became...'"). Dwell mode as manual override (immediate update, no debounce). Two-axis progressive enhancement: screen width determines presentation (side panel ≥ 1024px, pill + bottom sheet < 1024px); data budget determines loading (batch prefetch / on-demand / none). "Continue the Thread" in side panel below per-paragraph relations (not inline in reading column). Next Chapter is the primary end-of-chapter invitation. Graph traversal navigation branded as **"Following the Thread"** in user-facing UI — the portal's most distinctive feature, named to communicate its contemplative nature. (ADR-050) |
| 5.4 | **Editorial cross-references** | `chunk_references` table for human-curated cross-references (explicit mentions like "As my guru Sri Yukteswar taught..." → link to that passage). Supplements automatic embedding-based relations. |
| 5.5 | **Related content quality evaluation** | Test suite of ~50 representative paragraphs with human-judged expected relations. Validates thematic relevance, cross-book diversity, no false friends. Regression gate for content re-ingestion and embedding model changes. |
| 5.6 | **Ephemeral reading highlights** | Double-tap (mobile) / double-click (desktop) on any paragraph adds a subtle gold left-border highlight. Session-only — in-memory, not stored. At chapter end, if highlights exist, a gentle prompt offers to convert them to lotus bookmarks. Keyboard shortcut: `h`. No storage, no analytics. |
| 5.7 | **Editorial reading threads** | `editorial_threads` and `thread_passages` tables. Curated multi-book reading paths: human-selected passages sequenced to trace a spiritual theme as a coherent progression. `/threads` index and `/threads/[slug]` reading experience. Optional editorial transition notes between passages. `is_published` human review gate. (DES-026) |
| 5.8 | **Reverse bibliography** | `external_references` and `chunk_external_references` tables. Claude extracts external source references (Bhagavad Gita, Bible, Patanjali, Kabir, Einstein, etc.) from each chunk at ingestion time. `/references` index and `/references/[slug]` pages showing every passage where Yogananda engages with that source. Three-state `tagged_by` provenance. (DES-027) |
| 5.9 | **Exploration theme categories** | Activate `person`, `principle`, and `scripture` theme categories. Seed themes: Christ, Krishna, Lahiri Mahasaya, Sri Yukteswar, Patanjali, Divine Mother (person); 10 Yama/Niyama principles (principle); Yoga Sutras, Bhagavad Gita, Bible, Rubaiyat (scripture). Same tagging pipeline as quality/situation themes. `/themes` page gains new sections. (ADR-033) |
| 5.10 | **Reading session — proactive chapter caching** | Service Worker detects sequential chapter reading (2+ chapters from same book). Proactively caches next 2 chapters (HTML + relations data for batch tier). LRU eviction: current + 2 ahead + 2 behind. Offline chapter transitions serve from cache with offline banner. Uncached chapters show gentle redirect to nearest cached chapter. No reading history stored — ephemeral SW state only. |
| 5.11 | **Calendar reading journey schema** | Extend `editorial_threads` with journey columns: `journey_type` (evergreen/seasonal/annual), `journey_duration_days`, `journey_start_month`, `journey_start_day`. Foundation for time-bound reading experiences delivered via daily email in Phase 8. (DES-045) |
| 5.12 | **People Library — spiritual figures and monastics as entities** | `people` table with biographical metadata (name, slug, role, era, description, image) and monastic/lineage extensions: `person_type` enum (`spiritual_figure`, `guru_lineage`, `monastic`, `historical`), `honorific`, `is_living`. `person_relations` extended with `start_year`, `end_year`, `description`, `display_order` for temporal relationships. New relation types: `succeeded_by`, `preceded_by`, `mentored_by`, `edited_works_of`, `collaborated_with`. `chunk_people` junction table linking passages to persons mentioned or quoted. Person pages at `/people/[slug]` showing biography, In Memoriam presentation (birth–passing years for applicable figures), all referencing passages, and cross-links to themes and external references. `/people` index gains "Lineage of SRF Presidents" vertical timeline section using `succeeded_by` relations with service dates. `/api/v1/people/lineage` endpoint for presidential succession. Seed entities: Sri Yukteswar, Lahiri Mahasaya, Krishna, Christ, Divine Mother, Babaji, Anandamayi Ma, plus presidential succession entries (Yogananda, Rajarsi Janakananda, Daya Mata, Mrinalini Mata, Brother Chidananda) with service periods. Same three-state tagging pipeline as themes (auto → reviewed → manual). Linked from exploration theme categories (person type). (ADR-036, ADR-037) |
| 5.13 | **`/browse` grows — people, references, threads** | Auto-generated `/browse` page expands to include People library entries, External References (reverse bibliography), and Editorial Reading Threads. All auto-generated from database. `/browse` now covers the full content space and serves as the text-mode alternative to the Knowledge Graph (ADR-061). Bidirectional link between `/browse` and `/explore`. (DES-047) |
| 5.14 | **Internal MCP tools — relations and people** | Extend Tier 2 MCP with Phase 5 tools: `get_cross_book_connections(chunk_id)` and `get_person_context(person_slug)`. Enables reading thread drafting AI and editorial workflows that need cross-book relational context and People Library data. (ADR-101, DES-031) |

### Key Challenges

- **Related content quality:** Pre-computed chunk relations must be thematically relevant, cross-book diverse, and free of "false friends" (superficially similar text with unrelated meaning). The quality test suite (5.5) is the regression gate.
- **Relation computation at scale:** As the corpus grows from ~2K chunks (Phase 0) to ~50K (all books), incremental relation updates must remain efficient. Each new book triggers O(N_new × N_existing) comparisons — manageable with vectorized computation but must be monitored.

---

## Phase 6: Complete

**Goal:** Ingest the remaining book waves to complete the full Yogananda library. Add production observability.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 6.1 | **Ingest second- and third-wave books** | Collected talks (*Man's Eternal Quest*, *The Divine Romance*) and shorter works (*How You Can Talk With God*, *Metaphysical Meditations*, *Journey to Self-Realization*). Standard chunking. Incremental chunk relation computation for each new book. |
| 6.2 | **Verse-aware chunking** | Adapt chunking strategy for verse-by-verse commentary structure. Required before fourth-wave ingestion. |
| 6.3 | **Ingest fourth-wave books** | *The Second Coming of Christ* (2 vols), *God Talks With Arjuna* (2 vols), *Wine of the Mystic*. |
| 6.4 | **Search analytics + "What Is Humanity Seeking?" public dashboard** | Retool admin panel showing anonymized query trends. Nightly Lambda aggregation job populates `search_theme_aggregates` table — search queries classified by theme, geography (country-level), and time period. Minimum aggregation threshold: suppress theme + country combinations with < 10 queries. **Public-facing `/seeking` dashboard:** contemplative visualization of top themes, geographic view (warm-toned world map), seasonal rhythm, and common questions. Warm tones, Merriweather typography — not a SaaS dashboard. Linked from footer and About page. **Note:** "What Is Humanity Seeking?" is also a strategic communications asset for the philanthropist's foundation (ADR-090) — communications planning (standalone subdomain, annual report, media syndication) may begin before this dashboard ships. (ADR-053, ADR-090) |
| 6.5 | **Amplitude analytics (DELTA-compliant)** | Amplitude configured with explicit event allowlist. No user identification, no session tracking, no autocapture. Events: `page_viewed` (with `requested_language` for unmet language demand), `passage_served`, `share_link_generated`, `center_locator_clicked`, `search_performed` (with `zero_results` flag). See DESIGN.md § DES-037 for full property schema and Standing Operational Metrics. (ADR-095) |
| 6.6 | **New Relic APM integration** | New Relic agent for API route performance, database query timing, Claude API call monitoring. Synthetic uptime checks on key endpoints. (ADR-095) |
| 6.7 | **Edge latency audit + standing geographic monitors** | Measure portal latency from Global South regions (India, Brazil, Nigeria) via New Relic Synthetics or WebPageTest. Verify Vercel and Cloudflare serve from nearby edge PoPs. Validate per-region Core Web Vitals. Remediate if FCP exceeds 1.5s on 3G from target regions. **Standing monitors:** After initial audit, convert New Relic Synthetic checks into permanent monitors running from target regions on a recurring schedule (e.g., every 15 minutes from Mumbai, São Paulo, Lagos). Alert if FCP degrades past 1.5s sustained over 24 hours. Geographic performance is a direct measure of the Global Equity principle (ADR-006) — a dependency update or infrastructure change that degrades Bihar but not San Francisco should be caught immediately, not at the next quarterly review. |
| 6.8 | **Side-by-side commentary view** | Split-pane reader for verse-commentary books (*Second Coming of Christ*, *God Talks With Arjuna*, *Wine of the Mystic*). Wide screens: scripture verse pinned left, commentary scrolls right. Narrow screens: verse as highlighted block above commentary. Verse navigation: up/down arrows cycle through verses. Depends on verse-aware chunking (6.2). |
| 6.9 | **Knowledge graph visualization** | Interactive visual map of the teaching corpus at `/explore`. Phase 6 nodes: books, passages, themes, persons, scriptures. Edges: chunk relations, theme memberships, external references. Client-side rendering (`d3-force` with Canvas) from pre-computed graph JSON (nightly Lambda, served from S3). **Extensible JSON schema** with `schema_version`, `node_types`, and `edge_types` arrays — designed to accommodate magazine, video, audio, and image nodes in later phases without visualization code changes (ADR-062). **Lineage filter mode:** shows only person nodes connected by `guru_of`, `disciple_of`, `succeeded_by`, `preceded_by` edges, rendered as a directed vertical layout — visualizes both the spiritual lineage and presidential succession (ADR-037). Warm tones, contemplative animation, `prefers-reduced-motion` static layout. ~50-80KB JS, loaded only on `/explore`. Graph Data API: `GET /api/v1/graph`, `/graph/subgraph`, `/graph/cluster`, `/graph.json`. Linked from Library and themes pages. (ADR-061, ADR-062, ADR-037) |
| 6.10 | **Knowledge Graph MCP tools** | Extend internal MCP (Tier 2) with graph traversal tools: `get_graph_neighborhood(node_id, depth, types[])` and `get_search_trends(period, min_count)`. Wraps `/lib/services/graph.ts` and `/lib/services/analytics.ts`. Enables editorial AI workflows to use structural graph queries — theme tag proposals with graph context, impact narrative generation from search trend clusters. `/lib/mcp/tools/graph.ts`. (ADR-101, DES-031) |

### Key Challenges

- **Verse-aware chunking** for the scriptural commentaries (fourth wave) requires a different strategy than narrative or collected-talk books. The verse-commentary structure needs special handling to preserve the verse → commentary relationship in search results and the reader.

---

## Phase 7: Empower

**Goal:** Empower monastics, center leaders, and study circles with export and preparation tools that transform portal content into formats for group study, satsangs, and talks.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 7.1 | **Chapter and book PDF downloads** | Pre-rendered PDF generation for chapters and full books using `@react-pdf/renderer`. Book-like typographic treatment: cover page, table of contents, running headers, page numbers, Merriweather serif, lotus watermark on first page. A4 default, US Letter as option. Generated at ingestion time, served from S3 via CloudFront. Invalidated on content update. Resource-anchored routes: `GET /api/v1/books/{slug}/pdf`, `GET /api/v1/books/{slug}/chapters/{n}/pdf`. Dynamic passage/search PDFs via `POST /api/v1/exports/pdf`. File size displayed on download buttons. (ADR-025) |
| 7.2 | **Presentation mode** | "Present" button in reader header. Enlarges text to 24px+, hides all chrome, swipe/arrow-key chapter navigation only. Warm cream fills viewport. For group reading, satsang, study circles. A CSS mode (`data-mode="present"`), not a separate feature. **Timing consideration:** Group/communal reading (satsang, study circles, family devotions) is the primary mode of engagement with spiritual texts in Indian, African, and Latin American cultures. Presentation mode is described as "a CSS mode, not a separate feature" — implementation cost is low. Consider pulling this deliverable to Phase 2 or 3 to avoid ~7 phases where individual silent reading (the Western default) is the only available mode. See CONTEXT.md § Open Questions (Technical). (ADR-006) |
| 7.3 | **Study guide view** | "Study Guide" button in reader header. `/books/[slug]/[chapter]/study` route. Generated from existing data: key themes in the chapter, notable passages (highest Related Teachings density), cross-book connections as discussion prompts. Optional editorial content via `chapter_study_notes` table (discussion questions, context notes, practice suggestions). Print-friendly layout. "Start presenting" button transitions to presentation mode. For satsang leaders, study circles, and monastics preparing readings. |
| 7.4 | **Study Workspace** | Public `/study` route for anyone engaging deeply with the teachings — monastics, study circle leaders, yoga teachers, home meditators, chaplains, parents. Theme-driven passage discovery (uses existing search API), passage collection with full citations, teaching arc assembly (drag passages into sections like "Opening," "Core Teaching," "Practice," "Closing"), speaker/study notes separated from Yogananda's words. All state in localStorage (no account required). Export: print PDF, presentation mode, plain text. Optional server sync in Phase 13. (ADR-083) |
| 7.5 | **Study circle sharing** | "Share with your circle" button on Study Guide view. Generates a shareable URL (`/study/[book-slug]/[chapter]/share/[hash]`) with key passages, discussion prompts, and cross-book connections. < 30KB HTML, edge-cached, optimized for WhatsApp/SMS preview and OG cards. No authentication, no tracking. (DES-046) |
| 7.6 | **Magazine integration** | `magazine_issues`, `magazine_articles`, `magazine_chunks` tables. Magazine ingestion pipeline (PDF → chunk → embed → QA, mirroring book ingestion). Yogananda's articles enter full search/theme pipeline. Monastic articles searchable via `include_commentary` filter. `/magazine` landing, `/magazine/{year}/{season}` issue view, `/magazine/{year}/{season}/{slug}` article reader. "Magazine" added to primary navigation. API: `GET /api/v1/magazine/issues`, `/issues/{year}/{season}`, `/articles/{slug}`. Pre-rendered issue and article PDFs via `@react-pdf/renderer`. (ADR-040) |
| 7.7 | **Shared-link collections** | "Share" button in Study Workspace generates a shareable URL (`/collections/[share-hash]`) for any collection. No account required — works with localStorage collections via a one-time server upload at share time. < 30KB HTML, edge-cached. Visible note: *"This collection was curated by a community member, not by SRF."* No staff review needed for shared-link tier — content is already-public SRF text. Lays the foundation for community curation in Phase 14. (ADR-086) |
| 7.8 | **Knowledge graph evolution: magazine + constellation + concepts** | Add magazine_issue and magazine_chunk nodes to the Knowledge Graph. Add ontology_concept nodes and ontological relation edges. Add Passage Constellation mode (UMAP 2D reduction of embeddings). Update nightly graph Lambda to query `magazine_chunks` and `ontology_concepts`. Magazine passages cluster near related book passages. Concept map mode available. (ADR-062, ADR-043) |

### Success Criteria

- Chapter and book PDF downloads produce valid, accessible PDFs with correct typography and citations
- Presentation mode fills viewport with readable text, no chrome visible, arrow-key navigation works
- Study guide view renders key themes, notable passages, and cross-book connections for every chapter
- Study Workspace allows any visitor to collect, sequence, and export passages without authentication (ADR-083)
- Shared-link collections generate stable URLs that render correctly with full citations and community disclaimer
- Magazine articles by Yogananda appear in search results alongside book passages
- Knowledge graph shows magazine nodes clustered near related book passages; Passage Constellation renders all embedded content

---

## Phase 8: Distribute

**Goal:** Extend the portal's reach beyond direct visitors through daily email, social media assets, events signposting, Sacred Places, and messaging channels.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 8.1 | **Daily email — non-personalized** | Email subscriber infrastructure (double opt-in, unsubscribe). Daily verbatim passage email via Resend or AWS SES. All subscribers receive the same passage. No tracking pixels, no open-rate tracking. (ADR-091) |
| 8.2 | **Social media asset generation** | Portal generates shareable quote images in multiple aspect ratios (1:1, 9:16, 16:9) via `/api/v1/og/[chunk-id]?format=...`. Admin Retool panel for reviewing and approving generated assets. Human distribution — never auto-post. (ADR-092) |
| 8.3 | **Events section** | Static events page linking to World Convocation (`convocation.yogananda.org`) with enriched description (free, in-person + online, classes, meditations, kirtan, pilgrimage tours, monastic fellowship), commemorations (Mahasamadhi, Janmashtami, Christmas meditation), Online Meditation Center (live group meditations, guided meditations, devotional chanting), retreats, monastic visits worldwide, and youth/young adult programs. Convocation entry cross-links to Sacred Places ("Explore the sacred places → /places"). Signpost, not destination. (ADR-069) |
| 8.4 | **Sacred Places — SRF/YSS properties** | Dedicated `/places` page with SRF/YSS centers and temples. Contemplative descriptions, property photographs, "Get Directions" links, "Take a Virtual Tour" links for properties with SRF virtual pilgrimage tours (Mother Center, Lake Shrine, Hollywood Temple, Encinitas), Convocation cross-link on LA-area properties, and cross-references to Autobiography passages via `chunk_places` junction table. No maps. (ADR-069) |
| 8.5 | **Social media asset review workflow** | Add social media review to the editorial review portal: today's quote image at actual platform dimensions (1:1, 9:16, 16:9), caption with inline editing, per-platform download, weekly lookahead. "Mark as posted" tracking per platform (not automation). (ADR-082, ADR-092) |
| 8.6 | **RSS feeds** | `/feed/daily-passage.xml` (daily), `/feed/new-content.xml` (new books/recordings/videos), `/feed/audio.xml` (new audio), `/feed/updates.xml` (portal feature updates, ADR-105). Machine syndication alongside human email delivery. (ADR-081, ADR-105) |
| 8.7 | **WhatsApp Business API integration** | WhatsApp bot for spiritual search: seeker sends a question, receives 1-2 relevant passages with full citations. Daily Wisdom opt-in (send "DAILY"). Audio clip delivery when search matches a recording. Language selection. Lambda + WhatsApp Cloud API. Meta business verification. Shared messaging Lambda with channel-specific formatters. (ADR-026) |
| 8.8 | **Calendar reading journeys** | `/journeys` page listing available time-bound reading experiences. Initial journeys: "40 Days with Yogananda" (evergreen), seasonal journeys for Christmas and Navratri. Daily email service gains journey-aware delivery: subscribers receive one journey passage per day for the journey's duration. Uses `editorial_threads` journey columns (Phase 5 schema). (DES-045) |
| 8.9 | **Magazine ↔ "What Is Humanity Seeking?" symbiosis** | `/seeking` dashboard links to published magazine features. Magazine editorial workflow for curating search theme data into narrative features. Each amplifies the other: portal provides data, magazine provides storytelling. (ADR-040) |
| 8.10 | **External MCP server (Tier 3)** | Production-facing MCP server for third-party AI assistants (ChatGPT, Claude, Gemini, custom agents). Exposes content-serving tools (`search_corpus`, `search_by_theme`, `get_graph_neighborhood`, `find_concept_path`, `get_person_context`, `get_daily_passage`, `verify_citation`, plus metadata tools). Every response wrapped in fidelity metadata envelope (`presentation: "verbatim_only"`, `attribution_required: true`, `context_url` linking to portal). Rate-limited via Cloudflare + application tier (ADR-023). Registered access model — clients acknowledge fidelity contract to receive API key. `/lib/mcp/tools/fidelity.ts` wraps responses. Stakeholder prerequisite: SRF approval of external AI access posture (CONTEXT.md). (ADR-101, DES-031) |
| 8.11 | **Outbound webhook event system** | `webhook_subscribers` and `webhook_deliveries` tables. Delivery engine (Vercel cron or Lambda) with exponential backoff retry (5 attempts), HMAC-SHA256 signature verification. Initial events: `daily_passage.rotated`, `content.published`, `content.updated`, `social_asset.approved`, `portal_update.published`. Admin UI in editorial portal: subscriber management, delivery log, test button, suspend/resume. Enables SRF Zapier workflows to consume portal events for email campaigns, CRM updates, Slack notifications, and CDN cache purges. (ADR-106, DES-052) |
| 8.12 | **Timestamp filtering on all list endpoints** | `updated_since` and `created_since` parameters on remaining content list endpoints (`/api/v1/themes`, `/api/v1/audio`, `/api/v1/videos`, `/api/v1/images`, `/api/v1/people`, `/api/v1/collections`). Complements webhooks for reconciliation and backfill. (ADR-107) |

### Success Criteria

- Daily email delivers to 100% of confirmed subscribers with correct passage and citation
- Social media quote images render correctly in all three aspect ratios (1:1, 9:16, 16:9)
- Events section links resolve to live SRF event pages; Convocation entry includes enriched description and cross-link to Sacred Places
- Sacred Places page displays at least 5 SRF/YSS properties with cross-referenced book passages and virtual tour links where available
- WhatsApp bot returns relevant passages for test queries within 5 seconds
- RSS feeds validate against RSS 2.0 / Atom specification; `/feed/updates.xml` includes portal update entries
- Outbound webhooks deliver `daily_passage.rotated` test event to a registered subscriber within 30 seconds of passage rotation; delivery log shows successful delivery
- Webhook admin UI displays subscriber list, delivery log, and test button; suspended subscribers show alert
- `GET /api/v1/themes?updated_since=...` returns only recently modified themes; `sync.latest_timestamp` is present in response
- External MCP returns verbatim passages with correct fidelity metadata for test queries; rate limiting enforced

---

## Phase 9: Integrate

**Goal:** Migrate from PDF-ingested content to Contentful as the editorial source of truth. Establish the Contentful → Neon sync pipeline. Migrate to SRF's GitLab IDP.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 9.1 | **Contentful content model** | Book → Chapter → Section → TextBlock content types configured in Contentful. |
| 9.2 | **Content import to Contentful** | Import the QA'd book text into Contentful entries (possibly from the clean Neon data). |
| 9.3 | **Webhook sync service** | Contentful publish webhook → serverless function → extract text → embed → upsert Neon → incremental chunk relation update (ADR-050). |
| 9.4 | **Reader migration to Contentful** | Book reader pages generated via SSG from Contentful API (ISR for updates). |
| 9.5 | **Admin editorial workflow** | Full editorial bridge between Contentful authoring and portal review queues. Content editors update text in Contentful and see changes reflected in both reader and search. Review workflows in the admin portal link back to Contentful entries for editing. (ADR-082) |
| 9.6 | **Contentful Custom Apps** | Sidebar panels built with Contentful's App Framework: theme tag status on TextBlock entries, thread preview on editorial thread entries, calendar passage associations on calendar event entries, topic readiness indicators on teaching topic entries. Contextual bridges that keep editors oriented without leaving Contentful. (ADR-082) |
| 9.7 | **GitLab migration** | Migrate repo from GitHub to GitLab (SRF IDP). Migrate CI/CD from GitHub Actions to GitLab CI. Migrate Terraform state from Terraform Cloud to GitLab Terraform backend. Set up four standard environments (dev/qa/stg/prod) per SRF convention. (ADR-016) |
| 9.8 | **Terraform expansion** | Add Terraform modules for Contentful (space, content model, webhooks) and Cloudflare (DNS, WAF). Full environment replication via `terraform workspace`. |
| 9.9 | **Regional distribution expansion** | Neon read replicas in EU and Asia-Pacific for search query latency. S3 Cross-Region Replication for audio/PDF asset disaster recovery. Vercel multi-region function configuration. Terraform modules for all regional resources. (ADR-021) |

### Key Challenge

Contentful free tier (10,000 records, 2 locales). At paragraph granularity, a large book like The Second Coming (~10,000+ paragraphs across 2 volumes) could approach this limit for a single book. Evaluation needed:
- Can we use section-level granularity in Contentful (fewer entries) while maintaining paragraph-level chunks in Neon?
- Is a paid Contentful space necessary?

### Success Criteria

- Contentful → Neon webhook sync produces identical search results to pre-migration PDF-ingested content
- Reader pages render from Contentful SSG with no visible regressions from PDF-ingested versions
- GitLab CI/CD pipeline deploys successfully to all four environments (dev/qa/stg/prod)
- Terraform `plan` for full environment shows zero drift from deployed infrastructure

---

## Phase 10: Translate

**Goal:** Serve book content and search in multiple languages. Activate the i18n infrastructure built in Phase 1 with real translated content.

(See ADR-075, ADR-076, ADR-077 for architectural rationale.)

*Note: Phase 1 builds the i18n infrastructure (externalized strings, locale routing, CSS logical properties). This phase activates it with translated content and UI translations.*

### Language Waves

| Wave | Languages | Rationale |
|------|-----------|-----------|
| **Western** | es, de, fr, it, pt, ja | Matches convocation site. SRF's existing translation infrastructure. Known publication history. |
| **Indian** | hi, bn | YSS audience. Yogananda's heritage languages. Massive population reach (~830M speakers). |
| **Evaluation** | Evaluate based on demand, translations, SRF/YSS input | Candidates: zh (Chinese), ko (Korean), ru (Russian), ar (Arabic — requires RTL). |

**Sequencing tension:** The Western/Indian wave split is a resourcing decision — SRF's existing translation infrastructure supports the Western wave more readily. It is not an assertion that Western languages are higher priority than Yogananda's heritage languages. ADR-077 documents this tension explicitly. The gap between 10a and 10b should be minimized; ideally the waves are parallelized if resources permit. See CONTEXT.md § Open Questions (Stakeholder) for the co-launch question.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 10.1 | **UI translations (Western wave)** | AI-assisted translation of all UI strings (`messages/*.json`) into es, de, fr, it, pt, ja: Claude drafts → human review by fluent, SRF-aware reviewer → production (ADR-078). Language selector in header. Locale cookie persistence. |
| 10.2 | **Localized book content (Western wave)** | Ingest officially translated book text into Neon with language-specific chunks. Contentful locale variants in production. Content availability matrix determines which books appear per language. |
| 10.3 | **Per-language search** | Language-specific tsvector columns with appropriate Postgres dictionaries. Multilingual embedding model benchmarking — benchmark text-embedding-3-small against multilingual-optimized models (Cohere embed-v3, BGE-M3, multilingual-e5-large-instruct) using actual translated passages. May trigger first embedding model migration via ADR-046 workflow. Language-aware `hybrid_search` function. (ADR-047) |
| 10.4 | **English fallback** | When user's language has insufficient results, supplement with clearly marked English passages. `[EN]` tag on fallback content. "Read in English →" links. |
| 10.5 | **Per-language SEO** | `hreflang` tags on every page. Per-locale sitemaps. Localized meta tags and page titles. JSON-LD `inLanguage` field. |
| 10.6 | **Non-Latin font support** | Conditional loading of Noto Serif JP / Noto Sans JP (Japanese). Indian wave adds Noto Serif Devanagari, Noto Serif Bengali. |
| 10.7 | **UI translations + content (Indian wave)** | Hindi and Bengali UI translations (same AI-assisted workflow as 10.1). Ingest YSS-published translations. Devanagari and Bengali font loading. YSS bookstore URL routing for Hindi/Bengali book pages ("Find this book" links to YSS bookstore, not SRF bookstore). Brahmamuhurta circadian override for `hi`/`bn` locales (3:30–5:30 AM → meditation practice passages, not consolation — see DESIGN.md § Circadian content choreography). YSS representatives participate as co-equal design stakeholders for visual design, editorial voice, and cultural adaptation decisions. |
| 10.8 | **Cross-language passage alignment** | Link translated chunks to their English originals via `canonical_chunk_id`. Enables "Read this passage in Spanish →" navigation between editions. Alignment done during ingestion by matching (canonical_book_id, chapter_number, paragraph_index); edge cases resolved in human QA. |
| 10.9 | **Language-aware chunk relations** | Recompute `chunk_relations` with per-language strategy: top 30 same-language + top 10 English supplemental relations per non-English chunk. Ensures non-English languages get full related teachings without constant real-time fallback. English supplemental relations are marked with `[EN]` in the UI, consistent with the search fallback pattern. |
| 10.10 | **Per-language search quality evaluation** | Dedicated search quality test suite per language (15–20 queries with expected passages from that language's corpus). Must pass before that language goes live. Mirrors Phase 0's English-only evaluation (Deliverable 0.17). Includes per-language chunk size validation — English-calibrated chunk sizes may need adjustment for CJK and Indic scripts. |
| 10.11 | **Per-language performance budget validation** | Validate the 50KB homepage budget and FCP < 1.5s constraint for each new language. Hindi/Bengali pages with Devanagari font files (even with unicode-range subsetting) may exceed English-calibrated budgets. Remediate with per-language font subsetting, conditional loading, or text-only-mode defaults for high-cost scripts. |
| 10.12 | **Per-language presentation adaptations** | Language-conditional reader typography (drop capitals for Latin scripts only; CJK line-height adjustment to 1.6–1.7). Non-Latin font support for OG quote images (`@vercel/og` requires explicit font files per script). Non-Latin print stylesheet font stacks. Non-Latin email font stacks (system fonts, not web fonts — tested across top email clients per market). Cultural adaptation of "Seeking..." entry points (editorial, not mechanical translation). Per-language bookstore links via `books.bookstore_url` column (if per-language routing is needed, add a simple lookup table then — ADR-028). Spiritual terminology glossary per locale (`/messages/glossary-{locale}.json`) built incrementally during first human review cycle (ADR-078). |
| 10.13 | **Translation review UI** | Add translation review workflow to the editorial review portal: side-by-side English source and AI draft display, UI context notes ("this appears on the search button"), inline editing, `[REVIEW]` flagging, batch view (40–100 strings per session), progress indicator per locale. Auth0 role `translator:{locale}` for scoped volunteer reviewer access — German reviewer sees only German queue. (ADR-082, ADR-078) |
| 10.14 | **Impact dashboard** | Leadership-facing read-only view at `/admin/impact`: countries reached (warm-toned world map), content growth over time, "What is humanity seeking?" (anonymized search themes), Global South accessibility indicators, content availability matrix by language (books × languages grid showing published/in-pipeline/unavailable status — serves as both an executive reporting artifact and a strategic planning tool for translation prioritization). Unmet language demand summary (aggregated from `requested_language ≠ language` signals in `page_viewed` events — "N seekers per week arrive wanting Hindi"). Auth0 role `leadership`. Refreshed nightly from Neon aggregates. Pre-formatted export for the philanthropist's foundation annual report. (ADR-082, ADR-090) |
| 10.15 | **Per-language search suggestions** | Per-language suggestion indices: each language gets its own extracted corpus vocabulary, localized theme names (from `topic_translations`), and localized curated queries (from `messages/{locale}.json`). Transliteration support for Indic languages — Hindi/Bengali seekers typing Romanized input (e.g., "samadhi") must match suggestions in both Roman and native script. CJK suggestion strategy (substring matching rather than prefix matching for languages without word boundaries). Sparse-language handling: honest fewer suggestions rather than English fallback padding. (ADR-049) |

### Key Challenges

- **Content availability asymmetry:** Not all books exist in all languages. The portal must gracefully handle sparse content per locale — honest about what's missing, not pretending it doesn't exist.
- **Embedding model selection:** Does OpenAI text-embedding-3-small produce acceptable retrieval quality for all target languages — especially Hindi, Bengali, and Japanese where its multilingual capability is incidental, not optimized? Benchmark against multilingual-first models (Cohere embed-v3, BGE-M3) with actual translated passages. Fallback: per-language models or domain-adapted embeddings fine-tuned on Yogananda's multilingual corpus (ADR-047).
- **Per-language chunk size validation:** English-calibrated chunk sizes (200/300/500 tokens) may produce different semantic density across scripts — CJK and Indic tokenization differs significantly. Validate retrieval quality per language before committing to chunk sizes.
- **Spiritual terminology:** Sanskrit terms (samadhi, karma, dharma, prana) are handled differently across translations. Search must find passages regardless of whether the translation keeps the Sanskrit or uses a local equivalent. The spiritual terminology glossary (`/messages/glossary-{locale}.json`) is a critical dependency.
- **Digital text availability:** The single highest-impact dependency. If SRF/YSS only has printed translations, per-language OCR with fluent reviewers is required — a major effort.
- **UI translation quality:** "What are you seeking?" must sound inviting in Japanese, not clinical. Professional human translation required — not machine translation. The "Seeking..." entry points need cultural adaptation, not mechanical translation.
- **Non-Latin presentation:** OG images, print stylesheets, email templates, and reader typography all need per-script adaptations. Drop capitals are Western; CJK line-height differs; email clients don't support web fonts for non-Latin scripts.
- **YSS branding:** Hindi/Bengali content may need YSS branding rather than SRF branding. Organizational question with design implications. (Deferred for now.)

### Success Criteria

- At least one non-English language live with search returning relevant localized results
- Per-language search quality evaluation passes (≥ 80% of 15–20 test queries return relevant passage in top 3)
- English fallback passages clearly marked with `[EN]` tag; no unlabeled cross-language mixing
- UI strings reviewed and approved by fluent human reviewer for each live language
- Per-language homepage payload remains < 50KB (validated including non-Latin font subsetting)
- `hreflang` tags render correctly for all live locales; per-locale sitemaps submitted

---

## Phase 11: Polish

**Goal:** Elevate the UI to a world-class "digital sanctuary" experience. Conduct formal accessibility audit. Implement the contemplative reader features deferred from earlier phases.

*Note: Core accessibility (semantic HTML, ARIA, keyboard nav, color contrast, screen reader support) is built from Phase 1, not introduced here. This phase adds advanced features, formal audit, the shared design system, and reader polish (circadian reading, chapter transitions, opening moment).*

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 11.1 | **Calm Technology design system** | Shared component library (npm package) implementing SRF's visual language. Reusable across properties. Accessibility baked into every component. |
| 11.2 | **Formal WCAG 2.1 AA audit** | Third-party accessibility audit. Remediate any gaps. Real-user testing with assistive technology users. Pursue WCAG 2.1 AAA for reading content where achievable. |
| 11.3 | **Reading mode** | Distraction-free reading view. Adjustable font size. Sepia/dark mode for evening reading (`prefers-color-scheme` support). High-contrast mode (`prefers-contrast` support). |
| 11.4 | **Time-aware reading — circadian color temperature** | Subtly shifts background warmth by time of day: morning (cooler cream), midday (standard), evening (warmer cream), night (optional `--srf-navy` dark mode). Opt-out via sun/moon toggle, preference in `localStorage`. `prefers-color-scheme: dark` always respected as override. Entirely client-side, DELTA-compliant. (DES-011) |
| 11.5 | **"Breath Between Chapters"** | 1.2-second pause showing only chapter title on prev/next navigation. Chapter text fades in over 400ms. Skipped for direct URL navigation, deep links, and `prefers-reduced-motion`. (DES-012) |
| 11.6 | **Opening moment — portal threshold** | First visit per session: warm cream background with small lotus SVG (40px, `--srf-gold` at 30%), fades after 800ms as homepage content appears. Total ~1.2s. Skipped for `prefers-reduced-motion`, deep links, and repeat visits within session. (DES-007) |
| 11.7 | **Visual regression testing** | Playwright screenshot comparison for reader, passage cards, Quiet Corner, search results. Catches unintended visual changes on every PR. |
| 11.8 | **Text-to-Speech** | Native TTS integration for the book reader. Synchronized highlighting of spoken text. |
| 11.9 | **Responsive design polish** | Implement DES-049 responsive strategy across all components. Tablet-specific reader layout (two-column landscape option). Interaction modality detection (`hover`, `pointer` media queries). Print stylesheet. Automatic low-bandwidth suggestion. Touch-friendly search and reading on mobile. Orientation-adaptive layouts for reader, Quiet Corner, and Presentation mode. |
| 11.10 | **Progressive Web App** | Web App Manifest with SRF branding. Service Worker for offline book reading and Quiet Corner. Cache-first for chapters, stale-while-revalidate for daily passage, network-only for search. Installable on mobile home screens. Offline indicator: "You're reading offline. Search requires a connection." (ADR-012) |
| 11.11 | **Sacred Places — biographical sites and Street View** | Add biographical/historical sites (Gorakhpur, Serampore, Puri, Varanasi, Dakshineswar). "See This Place" Street View links on place cards (ADR-070). Reader ↔ Place cross-reference cards: margin cards in the reader linking to places, and place pages listing all referencing passages with deep links. (ADR-069, ADR-070) |
| 11.12 | **Audio-visual ambiance toggle** | Optional ambient audio in reader and Quiet Corner. Off by default, always. Three options: Off / Temple (singing bowl + distant wind) / Nature (birdsong + gentle stream). Two ~200–400KB audio loops on S3. Fixed at ~15% volume. Fades in over 3s. Pauses on tab blur. Disabled in text-only mode. Stored in `localStorage`. Not meditation music — the sound of a quiet temple reading room. |

### Success Criteria

- Third-party WCAG 2.1 AA audit passes with zero critical or serious violations remaining
- PWA installs on mobile home screens (iOS Safari, Android Chrome) and serves cached chapters offline
- Circadian color temperature shifts are visually correct at all four time bands; `prefers-color-scheme: dark` override works
- `prefers-reduced-motion` disables all animations (opening moment, breath between chapters, cross-fades)
- Keyboard-only navigation completes full reader flow without mouse
- Lighthouse accessibility score ≥ 95 on all page types

---

## Phase 12: Multimedia

**Goal:** Deliver cross-media intelligence across video, audio, and images in one coherent phase. Build the platform-agnostic video catalog, transcribe monastic talks, introduce the audio library and image gallery, enable cross-media search across all content types, establish the unified content hub, and activate YSS organizational branding.

*Note: Basic YouTube video display (RSS + API, categorized playlists) is delivered in Phase 1. This phase adds video transcription, the platform-agnostic video catalog, audio recordings, photographs, cross-media search, the unified content hub, and YSS branding.*

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 12.1 | **Platform-agnostic video catalog** | `videos` table with `platform` (youtube/vimeo/self_hosted), `platform_id`, `platform_url`, `self_hosted_s3_key`. `integration_level` (full/linked) distinguishes SRF-owned content from third-party (e.g., *Awake: The Life of Yogananda*). `video_type` supports talk, documentary, interview, meditation, ceremony, clip, lecture, archival. `rights_holder` and `attribution` fields for third-party content. Content authority hierarchy: Yogananda's words (primary) → monastic talks (secondary) → documentary/third-party (tertiary). Platform-agnostic `<VideoPlayer>` component renders YouTube, Vimeo, or self-hosted via `<video>`. `/videos`, `/videos/[slug]`, `/videos/collections/[slug]`, `/videos/films` routes. (ADR-056) |
| 12.2 | **YouTube transcript ingestion** | `video_transcripts` and `video_chunks` tables (with `speaker` and `segment_type` columns for speaker diarization — ADR-056). Start with YouTube auto/manual captions (free); upgrade to Whisper API ($0.006/min) where quality is insufficient. Chunk and embed transcripts into Neon using the same embedding model and FTS strategy as book chunks. Word-level timestamps on every chunk enable time-synced playback. Estimated one-time cost for full SRF YouTube library (~500 videos): $150–300 via Whisper. (ADR-055) |
| 12.3 | **Cross-media search** | Extend `hybrid_search` to query `video_chunks` alongside `book_chunks`. Results interleave book passages and timestamped video segments, ranked by unified RRF. Video results link to `youtube.com/watch?v={id}&t={start_seconds}`. (ADR-055) |
| 12.4 | **Cross-media chunk relations** | Pre-computed `chunk_relations` span book chunks and video chunks. The reader's Related Teachings panel shows timestamped video segments alongside book passages: *"Brother Chidananda discusses this teaching (12:34)"*. (ADR-050, ADR-055) |
| 12.5 | **Synchronized transcript display** | Video player page (`/videos/[slug]`) with synchronized transcript panel: text scrolls to follow playback, each paragraph is clickable (jumps to timestamp), book passages referenced in the talk appear as margin cards linking to the reader. (ADR-055) |
| 12.6 | **Video player with book links** | When a monastic mentions a book, the video player sidebar links directly to those books in the reader. Related Teachings panel in the video player shows book passages related to the current video segment. |
| 12.7 | **"Wisdom bites"** | Admin tool (Retool) to clip 2-5 minute segments from talks. Serve as daily inspiration on the homepage. |
| 12.8 | **Unified content hub** | Migrate from per-media-type relation tables to the polymorphic `content_items` registry linking book_chunks, video_chunks, audio_segments, and images. `content_relations` replaces pairwise tables with a single cross-media relation store. `content_topics` and `content_places` provide unified theming and spatial connections across all media. Phases 0–6 use `chunk_relations` directly — this phase introduces the hub as a deliberate migration, not premature abstraction. (ADR-060) |
| 12.9 | **Knowledge graph evolution: video + places + cross-media** | Add video, video_chunk, and sacred_place nodes to the Knowledge Graph. Add cross-media similarity edges (book ↔ video) via content hub. Add mentions_place and depicts_place edges. "All media" becomes the default graph view mode. Update nightly graph Lambda to consume `content_items` and `content_relations`. Level-of-detail rendering (WebGL) for 20,000–35,000 node scale. (ADR-062) |
| 12.10 | **Audio library — ingestion pipeline** | Audio recordings uploaded to S3. Lambda triggers Whisper transcription. Human review of transcripts (mandatory gate — ADR-078). Approved segments embedded and indexed. CloudFront distribution for streaming. Special handling for Yogananda's own voice recordings (`is_yogananda_voice` flag). (ADR-057) |
| 12.11 | **Audio library — browse and player** | `/audio` browse page: filter by speaker, recording type, date, collection. `/audio/[slug]` player: synchronized transcript (text highlights current segment, click to jump), standard playback controls (play/pause, seek, 0.75×–1.5× speed, volume). Sacred artifact treatment for Yogananda's voice — visual provenance indicator. No social features. (ADR-057) |
| 12.12 | **Audio cross-media search** | Extend `hybrid_search` to query `audio_segments` alongside `book_chunks` and `video_chunks`. Audio results interleave with books and video, ranked by unified RRF. Audio results link to `/audio/[slug]?t={start_ms}`. (ADR-057) |
| 12.13 | **Image ingestion pipeline** | `images` table with `subject_type` (portrait, group, place, event, artifact, illustration, book_cover, devotional), `is_yogananda_subject` sacred artifact flag. `image_descriptions` table with embedded description text as searchable proxy for vector search (images themselves are not directly searchable — their editorial descriptions are). `image_places` junction table for spatial connections. S3 storage + CloudFront delivery. Sacred artifact treatment for Yogananda photographs: visual provenance indicator, reverential caption style, no casual cropping. Human review mandatory for all descriptions and alt text. (ADR-035) |
| 12.14 | **Image gallery and detail pages** | `/images` browse page: filter by subject type, era, collection, place. `/images/[slug]` detail page: full-resolution image, description, alt text, photographer credit, related places, related book passages (via content hub). Image search results appear alongside books, video, and audio in cross-media search — ranked by description embedding similarity. (ADR-035) |
| 12.15 | **Multi-media editorial threads** | `thread_items` table replaces `thread_passages` (introduced in Phase 5) with polymorphic content references supporting book_chunk, video_chunk, audio_segment, and image types. Three continuation modes: single-media (auto-generated, same type as current content), cross-media exploration (auto-generated, all types), editorial multi-media threads (human-curated reading paths combining all media). Migration path: existing `thread_passages` rows migrated to `thread_items` with `item_type='book_chunk'`. |
| 12.16 | **YSS organizational branding** | Locale-aware branding layer: organization name, logo, footer text, OG images selected by seeker's locale or explicit preference. Content remains unified — only presentation differs. `next-intl` namespace per organization (`/messages/{locale}/org.json`). Brand asset directories (`/public/brand/srf/`, `/public/brand/yss/`). (ADR-079) |
| 12.17 | **Transcript PDFs** | Pre-rendered PDF transcripts for audio recordings and video talks. Generated when transcript reaches `approved` status. Resource-anchored routes: `GET /api/v1/audio/{slug}/transcript/pdf`, `GET /api/v1/videos/{slug}/transcript/pdf`. Served from S3 via CloudFront. Same `@react-pdf/renderer` pipeline as book PDFs. (ADR-025) |
| 12.18 | **Digital watermarking (Tiers 2 & 3)** | C2PA Content Credentials on all guru photographs and archival images (cryptographically signed provenance chain). Steganographic watermark on sacred images (`is_yogananda_subject = true`) — invisible bit pattern in DCT frequency domain encoding image ID and portal URL. Verification script: `/scripts/watermark-verify.py`. Both applied during image ingestion Lambda. (ADR-063) |
| 12.19 | **Multi-size image downloads** | Five named size tiers (thumb 300px, small 640px, medium 1200px, large 2400px, original) generated at ingestion in WebP + JPEG dual format. Download endpoint: `GET /api/v1/images/{slug}/download?size=medium&format=webp`. Image detail page gains download section with size selector, dimensions, and file sizes. Attribution line (not a gate). Per-tier watermarking rules integrated with ADR-063. (ADR-064) |
| 12.20 | **Knowledge graph evolution: audio + images** | Add audio_recording, audio_segment, and image nodes to the Knowledge Graph. Add photographed_person and photographed_place edges. Sacred artifact styling (golden ring) for Yogananda's own voice recordings and photographs. Full cross-media constellation (all embedded content types in UMAP view). Graph reaches 30,000–50,000 node scale. (ADR-062) |
| 12.21 | **Chant reader and deterministic cross-media linking** | Chant reader variant for `content_format = 'chant'` books (*Cosmic Chants*, *Songs of the Soul*): whole-unit rendering (one chant per page), chant-to-chant navigation, inline media panel for `performance_of` relations. Editorial mapping of audio/video recordings to specific chants during ingestion. `performance_of` edge type in `chunk_relations` (deterministic, not vector-derived). Poetry variant (`content_format = 'poetry'`) for *Whispers from Eternity* and similar collections. `performance_of` edges added to Knowledge Graph with distinct visual treatment. (ADR-059) |

### Success Criteria

- Cross-media search returns interleaved book passages, video segments, and audio segments for test queries
- Synchronized transcript scrolls in sync with video and audio playback; click-to-jump works within 1-second accuracy
- Video and audio chunks appear in Related Teachings panel alongside book passages
- Unified content hub migration preserves all existing `chunk_relations` data with zero loss
- Audio player streams recordings with synchronized transcript highlighting
- Yogananda's own voice recordings display sacred artifact treatment (visual provenance indicator)
- Image gallery renders all five size tiers; WebP served to supporting browsers, JPEG fallback works
- Knowledge graph displays all five content types (book, magazine, video, audio, image) with distinct node styling; sacred artifact golden ring visible on Yogananda's voice recordings and photographs
- YSS branding activates correctly for Hindi/Bengali locales (logo, footer text, OG images)
- C2PA Content Credentials verify successfully on watermarked guru photographs
- Chant reader renders whole-unit chants with inline audio/video panel; `performance_of` links are deterministic and editorially verified

---

## Phase 13: Personalize

**Goal:** Allow seekers to create accounts for personal study features, without requiring registration for basic access.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 13.1 | **Optional authentication** | Evaluate lightest mechanism for cross-device sync: magic links, passkeys, or Auth0 (if SSO with other SRF properties is required). Sign-in is never required for reading or search. |
| 13.2 | **Bookmarks and highlights** | Save favorite passages from search results or the reader. Migrate Phase 2 localStorage bookmarks to server sync on login. |
| 13.3 | **Reading progress** | Track reading position per book. Cross-device sync. |
| 13.4 | **Search history** | Personal search history (opt-in, private). |
| 13.5 | **Personalized daily passage** | Personalized daily quote based on reading history and interests. (Note: the anonymous, non-personalized "Today's Wisdom" is delivered in Phase 0. This adds account-based personalization.) |
| 13.6 | **Personalized daily email** | Logged-in subscribers choose preferred themes. Daily email selects from theme-tagged passages matching preferences. Extends the non-personalized daily email from Phase 8. (ADR-091) |

### Success Criteria

- Sign-in works via chosen mechanism (magic links, passkeys, or Auth0) without requiring registration for reading/search
- Phase 2 localStorage bookmarks migrate to server sync on first login with zero data loss
- Reading progress syncs across devices within 30 seconds
- Personalized daily email selects passages matching subscriber's chosen themes

---

## Phase 14: Community

**Goal:** Bridge the solitary study experience with the global SRF community. Build events, messaging channels, center discovery, community curation, and VLD-powered editorial scaling.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 14.1 | **Event calendar** | Time-zone-adjusted display of global SRF events (meditations, convocation, commemorations). |
| 14.2 | **Local center discovery ("Meditation Near Me")** | Geo-located finder for physical SRF temples, centers, and meditation groups. Map + list view. Requires center data from SRF. (Note: Phase 1 includes an external link to SRF's existing center locator in the About page and footer. This phase builds a native in-portal experience.) |
| 14.3 | **Live event integration** | Deep links to Zoom/YouTube Live for online meditation events. |
| 14.4 | **Online meditation resources** | Curated links and schedule for SRF's Online Meditation Center. Time-zone-adjusted display of upcoming live meditations. |
| 14.5 | **SMS access gateway** | Two-way SMS teaching access via Twilio (global), Africa's Talking (Africa), or Gupshup (India). Seeker texts a topic keyword (e.g., "FEAR") to a phone number and receives a Yogananda passage by SMS. Daily Wisdom subscription (text "DAILY"). No smartphone needed, no data plan needed. Serves the 3+ billion people with basic phones. Passages truncated to 160 chars with citation. Dedicated phone numbers per region. Same messaging Lambda as WhatsApp, different formatter. Cost evaluation per region required before launch. (ADR-026) |
| 14.6 | **Telegram bot** | Telegram bot for search, daily wisdom, and audio content. Free to operate (no per-message cost). Rich formatting (Markdown), inline keyboards, audio clip delivery. Same messaging Lambda, Telegram-specific formatter. (ADR-026) |
| 14.7 | **USSD and IVR exploration** | Evaluate USSD menu-based access for Africa (telco partnership via Africa's Talking) and IVR voice access for non-literate seekers. IVR could play Yogananda's own voice recordings — a direct connection no text channel can provide. Requires telco partnerships and cost analysis. (ADR-026) |
| 14.8 | **"What Is Humanity Seeking?" annual report** | *(Public dashboard moved to Phase 6.)* First annual curated narrative report from `search_theme_aggregates` data. Published in Self-Realization Magazine (ADR-040) and/or by the philanthropist's foundation. Human-curated with data visualizations: rising/falling themes, geographic patterns, seasonal trends, correlation with world events. Not auto-generated — the portal provides the data, humans provide the interpretation. Complements the live `/seeking` dashboard with deeper editorial analysis. |
| 14.9 | **Community Collections gallery** | `/collections` gallery page displaying published and featured community collections. Filterable by type (theme, study guide, situational, event, cross-media), language, and book. Admin portal review queue for community submissions (extends ADR-082). Staff can approve, reject with feedback, or request revision. Featured collections promoted to homepage and theme pages. Visual distinction from staff-curated Editorial Reading Threads (DES-026). Builds on Phase 7 shared-link foundation. (ADR-086) |
| 14.10 | **VLD dashboard** | Admin portal section for VLD members (Auth0 role: `vld`). Browse open curation briefs, claim assignments, track submission status, access editorial guidance. No gamification — no leaderboards, no submission counts visible to other members. Service is its own reward. (ADR-087) |
| 14.11 | **Curation briefs** | Staff-authored structured curation requests. `curation_briefs` table with title, description, collection type, target language, deadline. VLD members claim and fulfill briefs via the Study Workspace. Staff reviews completed briefs through the existing admin portal review queue. (ADR-087) |
| 14.12 | **Trusted submitter status** | After a threshold of approved collections (TBD, likely 3–5), VLD members earn trusted submitter status. Trusted submissions enter a lighter review queue — staff can batch-approve with a scan rather than detailed review. Not auto-publishing — every collection passes through staff eyes. Trusted status is revocable. (ADR-087) |
| 14.13 | **Collection remixing** | "Use as starting point" button on published collections. Creates a copy in the seeker's Study Workspace for personal modification. Attribution chain preserved: "Based on [original curator]'s collection." Remixed collections go through the same review pipeline if submitted for publication. |
| 14.14 | **Multilingual community collections** | Extend community curation to non-English languages. Spanish-speaking center leaders curate from Spanish-edition passages. Language-specific gallery filtering. Curation briefs can target specific languages. Requires Phase 10 multilingual content as prerequisite. |
| 14.15 | **Community collection analytics (DELTA-compliant)** | Anonymized, aggregated insights for staff editorial decisions: which collection types are most submitted, which themes have gaps, which curation briefs attract the most claims. No individual curator analytics. No seeker-facing metrics. Staff-only dashboard in admin portal. (ADR-095) |

### Success Criteria

- Event calendar displays correctly across time zones for at least 3 global regions
- SMS gateway delivers passages for keyword queries in at least 2 regions (India, US or Africa)
- Telegram bot responds to search queries with formatted passages and citations
- Local center discovery returns nearest SRF centers with correct location data
- Community Collections gallery displays published collections with filtering by type and language
- Admin portal review queue processes community submissions with approve/reject/revise workflow
- VLD members can browse, claim, and fulfill curation briefs through the admin portal
- Trusted submitter pipeline reduces average staff review time per submission
- At least one non-English community collection is published through the multilingual pipeline
- Collection remixing preserves attribution chain and passes through review pipeline
- DELTA-compliant analytics inform staff editorial strategy without exposing individual curator activity

---

## Future Consideration: SRF Lessons Integration

The SRF Home Study Lessons — the organization's core spiritual curriculum — are explicitly out of scope for the public portal. However, they may eventually be incorporated for authorized students and kriyabans. The architecture is designed so this is not structurally impossible (ADR-085):

- **Content-level access control.** Any content item can carry an `access_level` (`public`, `enrolled`, `kriyaban`). The API layer respects this via Auth0 custom claims. No implementation work in any current phase.
- **If activated,** Lessons would be a separate, curated reading experience — not mixed into the general search index. Search might acknowledge "This topic is also covered in SRF Lesson 24" without revealing content.
- **The portal never teaches Kriya Yoga techniques.** Even with Lessons integration, technique instructions remain outside scope.
- **Timeline:** Unknown. May never happen, or may be years away. The architecture is ready; the decision is SRF's.

---

## PWA-First Strategy (No Native App)

A native mobile app is not planned. The rationale:

1. **The PWA (Phase 11) covers the use case.** Offline reading, home screen installation, and full search — all via the browser. For reading and searching Yogananda's teachings, a PWA is functionally equivalent to a native app for the vast majority of seekers.
2. **SRF already has a native app.** The SRF/YSS app (iOS/Android) has an eReader for the private Lessons. A second SRF reading app would create organizational confusion.
3. **The API-first architecture keeps the option open.** If a native app is ever warranted, it consumes the same `/api/v1/` endpoints. Zero backend changes needed.
4. **Phase 11 is the evaluation point.** After the PWA ships, measure: Are seekers installing it? What are the limitations? Does SRF want portal features inside the existing app?

If a native app is warranted post-Phase 11, React Native or Capacitor wrapping the existing codebase is the likely path. The calm design system and API layer already exist.

---

## Phase Gates

Each phase has prerequisites that must be satisfied before work begins. Hard prerequisites block the phase entirely; soft prerequisites improve quality but aren't strictly required.

| Phase | Hard Prerequisites | Soft Prerequisites |
|-------|---|---|
| **0 (Prove)** | — | SRF AE team availability for kickoff |
| **1 (Build)** | Phase 0 complete, PDF source confirmed | Embedding model benchmarks started |
| **2 (Read)** | Phase 1 complete | — |
| **3 (Grow)** | Phase 2 complete | — |
| **4 (Operate)** | Phase 3 complete, editorial governance decided, portal coordinator identified | Theme taxonomy reviewed by theological advisor |
| **5 (Connect)** | Phase 4 theme tagging populated | Phase 4 editorial review portal operational |
| **6 (Complete)** | Phase 5 chunk relations computed | — |
| **7 (Empower)** | Phase 3 multi-book corpus available | Phase 6 observability operational |
| **8 (Distribute)** | Phase 4 editorial workflows operational | Phase 7 PDF generation available |
| **9 (Integrate)** | Contentful contract signed, content model approved | Phase 6 complete, GitLab access provisioned |
| **10 (Translate)** | Phase 9 Contentful operational, embedding model benchmarked for multilingual, translation reviewers identified | Phase 1 i18n infrastructure validated against multilingual test cases |
| **11 (Polish)** | Phase 10 at least one non-English language live | Third-party accessibility auditor engaged |
| **12 (Multimedia)** | Phase 6 complete (unified search operational) | Phase 11 PWA evaluation complete, audio/image source material available from SRF |
| **13 (Personalize)** | Phase 12 complete, SRF decision on user accounts | Auth0 configuration aligned with SRF identity standards |
| **14 (Community)** | Phase 13 account infrastructure (if applicable), VLD roster available from SRF | Regional SMS partner contracts negotiated |

**Critical decision gates** (require SRF input before the phase begins):
- **Phase 4 (Operate):** Who owns editorial governance? Who is the portal coordinator? (See CONTEXT.md § Operational Staffing)
- **Phase 9 (Integrate):** Contentful tier and content model granularity
- **Phase 10 (Translate):** YSS branding strategy for Hindi/Bengali locales
- **Phase 13 (Personalize):** Whether to implement user accounts at all
- **Phase 14 (Community):** VLD role assignment process, VLD coordinator identified, community curation governance model

---

## Cost Trajectory

| Phase | Estimated Monthly Cost | Notes |
|-------|----------------------|-------|
| Phases 0–2 | ~$5-10 | Neon free, Vercel free, minimal Claude API usage, one-time embedding cost. S3 backup < $1/mo. |
| Phases 3–5 | ~$10-20 | More embedding generation for multi-book corpus and chunk relations. Lambda for batch ingestion (pennies per invocation). |
| Phases 6–8 | ~$20-40 | Full library embedded, daily email service (SES ~$0.10/1000), S3 for PDFs and images, Lambda for scheduled jobs. WhatsApp Business API: +$150-300/mo at scale. |
| Phase 9 | ~$50-100+ | Contentful paid tier likely needed, Lambda functions for Contentful webhooks. |
| Phase 10+ | Requires evaluation | Multi-language embeddings, increased storage, higher API traffic. |
| Phase 12 | +$30-80 | Audio hosting on S3 + CloudFront streaming. Whisper transcription one-time cost (~$0.006/min). Audio file storage scales with archive size. |
| Phase 14 | +$600-1,250 | SMS gateway costs vary by region (India: ~$0.002/msg, US: ~$0.04/msg). Telegram bot: free. USSD/IVR: requires telco negotiation. Community collections gallery and VLD dashboard: negligible incremental cost (existing infrastructure). |

---

## Dependencies and Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **PDF OCR quality** | Corrupted text → bad search results | Human QA step (0.9) is mandatory. Budget review time. SRF has original text for production use. |
| **Contentful free tier limits** | Cannot model full corpus at paragraph level | Evaluate hybrid: section-level in Contentful, paragraph-level in Neon only |
| **Embedding model quality** | Poor retrieval for Yogananda's vocabulary | Benchmark multiple models (Phase 0 task). Yogananda uses precise, sometimes archaic spiritual terminology. |
| **Chunk size sensitivity** | Too small = orphaned fragments. Too large = imprecise retrieval. | Empirical testing in Phase 0 with diverse query types. |
| **Stakeholder expectation** | "AI search" may imply a chatbot | Clear communication: this is a librarian, not an oracle. No synthesis. |
| **SEO discoverability** | Portal serves only people who already know it exists | Deliberate SEO strategy from Phase 1: structured data, theme pages as entry points, meta tags, sitemap. |
| **Portal/app overlap** | Building a duplicate reader alongside the SRF/YSS app | Clarify relationship with SRF AE team early. Portal may complement (search + public reading) rather than replace (private Lessons reading) the app. |
| **Editorial governance** | No defined process for theme tagging, daily passage curation, content QA | Establish editorial roles and workflows before Phase 4. Determine whether monastic order, AE team, or dedicated editor owns this. The editorial review portal (ADR-082, deliverables 4.5a/4.5b) provides the tooling; the organizational question of *who* uses it requires SRF input. |
| **Copyright/licensing ambiguity** | Unclear terms for free access (read-only vs. downloadable vs. printable) | Resolve with SRF legal before launch. Display clear attribution on every page. |
| **Global South accessibility** | Many seekers access via mobile on limited bandwidth (India, Africa, Latin America) | Mobile-first design. Performance budgets (< 100KB initial load). Low-bandwidth text-only mode. Consider PWA for offline access of bookmarked passages. |
| **"What next" gap** | Seeker is moved by a passage but portal offers no path to practice | "Go Deeper" section in About, footer ecosystem links, and Quiet Corner all point toward SRF Lessons, local centers, and online meditation. Not a sales funnel — a signpost. |
| **Search API abuse** | Public, unauthenticated search API with Claude API cost per query | Two-layer rate limiting (Cloudflare + application) from Phase 0. Claude API monthly budget cap. Graceful degradation to database-only search when rate-limited. (ADR-023) |
| **Operational staffing** | Editorial review portal provides tooling, but who uses it? Theme tagging, daily passage curation, translation review, and content QA require dedicated staff time. | Establish editorial roles before Phase 4. Key roles to fill: portal coordinator (cross-queue health), content editor, theological reviewer, book ingestion operator. VLD coordinator needed by Phase 14. Operational playbook (deliverable 4.11) documents procedures so year-3 staff can operate without the builders. See CONTEXT.md § Operational Staffing. |
| **Editorial queue backlog** | Review queues grow with every phase. If the monastic editor is unavailable for weeks, AI-proposed tags accumulate and daily passage curation has no attention. | Queue health monitoring (deliverable 4.12) with age thresholds and escalation to portal coordinator. Email digest highlights overdue items. Minimum editorial coverage model: determine how many review hours/week each phase requires. |
| **Database disaster recovery** | Canonical content (book text, embeddings, theme tags, chunk relations) lives only in Neon. Loss beyond PITR window requires expensive re-ingestion. | Nightly pg_dump to S3 (Phase 1, ADR-019). 90-day retention + monthly archives for 1 year. Quarterly restore drill. |
| **Edition changes** | SRF publishes revised editions; page numbers and paragraph boundaries change. All portal citations become inaccurate. | Edition tracking in data model (ADR-034). Content-addressable deep links survive re-ingestion (ADR-022). Old edition archived, not deleted. |
| **Shared passage link permanence** | Re-ingestion with different chunking breaks shared links in emails, WhatsApp messages, bookmarks. | Content-hash deep links (ADR-022). Resolution chain: exact match → content-hash in same chapter → content-hash in same book → graceful "passage may have moved" fallback. |

---