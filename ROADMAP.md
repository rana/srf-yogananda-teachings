# SRF Online Teachings Portal — Roadmap

> **At a glance.** 15 phases (0a–14) from proving the search through community curation at scale, plus supporting sections. Phase 0 is split into 0a (Prove) and 0b (Foundation) per ADR-113.

| Phase | Name | Focus |
|-------|------|-------|
| [0a](#phase-0a-prove) | Prove | Ingest one book, prove semantic search works |
| [0b](#phase-0b-foundation) | Foundation | Deployment, observability, AI librarian, homepage |
| [1](#phase-1-build) | Build | All pages, engineering infrastructure, accessibility |
| [2](#phase-2-read) | Read | Dwell, bookmarks, keyboard nav, typography, presentation mode, low-bandwidth detection |
| [3](#phase-3-grow) | Grow | Multi-book corpus, cross-book search |
| [4](#phase-4-operate) | Operate | Theme tagging, editorial portal, staffing, graph batch pipeline |
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
| — | [Unscheduled Features](#unscheduled-features) | Ideas not yet assigned to a phase |
| — | [PWA-First Strategy](#pwa-first-strategy-no-native-app) | No native app rationale |
| — | [Phase Gates](#phase-gates) | Go/no-go criteria between phases |
| — | [Cost Trajectory](#cost-trajectory) | Infrastructure cost projections |
| — | [Dependencies and Risks](#dependencies-and-risks) | Risk register and cross-phase dependencies |

---

## Phasing Philosophy

Each phase delivers a working, demonstrable increment organized around a single capability theme. 15 phases total (0a–14). Phase 0 is split into 0a (Prove) and 0b (Foundation) per ADR-113. Phase 0a proves that semantic search works. Phase 1 builds the complete portal with engineering infrastructure alongside it (CI/CD, testing, Terraform — not deferred to a later phase). Phase 2 refines the contemplative reader. Phases 3–4 decompose the multi-book expansion: Phase 3 (Grow) expands the corpus independently of organizational decisions, while Phase 4 (Operate) establishes editorial operations once SRF staffing is confirmed — this split makes the most critical organizational dependency visible as its own phase gate. Phases 5–6 build cross-book intelligence and complete the library. Phases 7–8 extend reach through tools and distribution channels. Phases 9–11 add Contentful CMS, multi-language support, and accessibility polish. Phase 12 delivers cross-media intelligence across video, audio, and images in one coherent phase. Phase 13 adds optional user accounts. Phase 14 combines community events and curation at scale.

**Parallel workstreams and feature-flag activation (ADR-123):** Phases are *capability themes*, not strictly sequential gates. Where deliverables within a phase have no technical dependency on another phase's organizational prerequisites, they proceed in parallel. Specifically: Phase 5 algorithmic computation proceeds alongside Phase 4 editorial tooling; Phase 9 infrastructure (GitLab, Terraform) proceeds independently of Contentful contract; Phase 10 language waves run in parallel where resources permit; Phase 13 localStorage features proceed independently of the SRF account decision. Organizational dependencies (editorial staffing, Contentful contract, account policy) gate *feature activation*, not *infrastructure build*. The pattern: build on schedule, activate via feature flags when the organization is ready.

**Unscheduled features:** Not every idea belongs in a phase immediately. Features that emerge from proposals, stakeholder conversations, or development experience but aren't ready for phase assignment live in the [Unscheduled Features](#unscheduled-features) section below. They are reviewed at every phase boundary and either graduate to a phase, remain unscheduled, or are explicitly omitted. The backlog does not grow forever — omission with rationale is a valid outcome.

---

## Phase Sizing Analysis

Restructured from 18 to 15 capability-themed phases (ADR-102, ADR-103; 2026-02-21). Document architecture split by phase for context-window efficiency (ADR-098; 2026-02-23). Remaining open questions from the restructuring are consolidated in CONTEXT.md § Open Questions.

---

## Phase 0a: Prove

**Goal:** Answer the existential question: does semantic search across Yogananda's text return high-quality, relevant, verbatim passages with accurate citations? Deliver the minimum vertical slice: ingest → search → read. Everything else waits until this works.

*Phase 0a is deliberately small. The design is 112 ADRs deep — the risk is no longer under-design but over-design without empirical contact. Ship this, learn from it, then build the foundation.* (ADR-113)

**Focus book:** Autobiography of a Yogi

### Prerequisites (conversations, not code)

These are blocking conversations that must happen before ingestion begins:

1. **Edition confirmation:** Confirm with SRF which edition of Autobiography of a Yogi is the canonical page-number reference (1946 first edition, 1998 13th edition, or current printing). All portal citations depend on this. (ADR-034)
2. **PDF source confirmation:** Confirm PDF source for Autobiography with SRF AE team.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 0a.1 | **Repository + development environment** | Create Next.js + TypeScript + Tailwind + pnpm repository. Configure ESLint, Prettier, `.env.example`. Establish `/lib/services/`, `/app/api/v1/`, `/migrations/`, `/terraform/`, `/scripts/`, `/messages/` directory structure. (ADR-041) |
| 0a.2 | **Neon project + initial schema** | Create Neon project with pgvector, pg_search, pg_trgm, and unaccent extensions enabled. Create dev branch for local development. Write `001_initial_schema.sql` covering all search tables (books, chapters, book_chunks, entity_registry, sanskrit_terms, suggestion_dictionary, teaching_topics, chunk_topics, daily_passages, affirmations, chunk_relations, extracted_relationships, search_queries, search_theme_aggregates, chapter_study_notes, book_chunks_archive). All content tables include `updated_at` column with auto-set trigger and composite `(updated_at, id)` index for timestamp-filtered pagination (ADR-107). Tables include full column specification: books (with `bookstore_url`, `edition`, `edition_year` per ADR-034), book_chunks (with `embedding_model` versioning per ADR-046, `content_hash` for stable deep links per ADR-022, enrichment columns per ADR-115), teaching_topics (with `category` and `description_embedding` per ADR-032), chunk_topics (three-state `tagged_by` per ADR-032). BM25 index via pg_search (ADR-114). Run via dbmate. Verify tables, indexes, BM25 index, and entity_registry. (ADR-093, ADR-050, ADR-032, ADR-022, ADR-053, ADR-034, ADR-114, ADR-115, ADR-116) |
| 0a.3 | **PDF ingestion script** | Download Autobiography PDF → convert with marker → chunk by paragraphs → generate embeddings → insert into Neon. Chunking follows the formal strategy in DESIGN.md § Chunking Strategy (ADR-048): paragraph-based, 100–500 token range, special handling for epigraphs and poetry. Typographic normalization applied during ingestion (smart quotes, proper dashes, ellipsis glyphs). Compute SHA-256 per chapter during ingestion and store in `chapters.content_hash` (ADR-039) — the `/integrity` page and verification API ship in Phase 1, but hashes are computed here so the data exists from day one. |
| 0a.4 | **Human QA of ingested text** | Claude pre-screens ingested text flagging probable OCR errors, formatting inconsistencies, truncated passages, and mangled Sanskrit diacritics (ADR-005 E4). Human reviewers make all decisions — Claude reduces the review surface area. Review mechanism for Phases 0–2 is lightweight (Retool view or CLI pager over ingested chunks) — the full editorial review portal ships in Phase 4. |
| 0a.5 | **Search API** | Next.js API route (`/api/v1/search`) implementing hybrid search (vector + FTS + RRF). Returns ranked verbatim passages with citations. No query expansion or intent classification yet — pure hybrid search. Claude-based enhancements added in Phase 0b. (ADR-011, ADR-044) |
| 0a.6 | **Search UI** | Search results page: ranked verbatim quoted passages with book/chapter/page citations. "Read in context" deep links. Search bar with prompt "What are you seeking?" |
| 0a.7 | **Basic book reader** | Chapter-by-chapter reading view with deep-link anchors, optimal line length (65–75 chars / `max-width: 38rem`), prev/next chapter navigation, "Find this book" SRF Bookstore links, basic reader accessibility (skip links, semantic HTML). |
| 0a.8 | **Search quality evaluation** | Test suite of ~50 representative queries with expected passages (golden retrieval set). Claude serves as automated evaluation judge — given a query and results, assesses whether expected passages appear and ranking is reasonable. Threshold: ≥ 80% of queries return at least one relevant passage in top 3. Scope note: this evaluation is English-only and cannot assess multilingual retrieval quality — multilingual embedding model benchmarking is deferred to Phase 10 when translated content exists (ADR-047). (ADR-005 E5) |

### Technology

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Next.js (local dev; Vercel in 0b) | $0 |
| Database | Neon PostgreSQL + pgvector + pg_search (free tier) | $0 |
| Embeddings | Voyage voyage-3-large (1024d, ADR-118) | ~$0.30 one-time |
| Enrichment | Claude via AWS Bedrock (batch, ADR-115) | ~$5-10 one-time |
| PDF processing | marker (open-source Python) | $0 |
| Language detection | fastText (open-source) | $0 |
| Migrations | dbmate (open-source) | $0 |
| SCM | GitHub | $0 |

### Success Criteria

- `pnpm dev` starts a working Next.js application locally
- `dbmate status` shows migration 001 applied
- A seeker can type "How do I overcome fear?" and receive 3–5 relevant, verbatim Yogananda quotes with accurate book/chapter/page citations
- "Read in context" links navigate to the correct passage in the reader
- Simple keyword searches ("divine mother") work without any LLM involvement
- Search latency < 2 seconds for hybrid queries
- Zero AI-generated content appears in any user-facing result
- The book reader enforces 65–75 character line length
- "Find this book" links are present on every passage and link to the SRF Bookstore
- Search quality evaluation passes: ≥ 80% of test queries return at least one relevant passage in the top 3 results

### What If Search Quality Fails?

If the ≥ 80% threshold is not met, the following contingencies apply before proceeding to Phase 0b:

1. **Chunking adjustment.** Yogananda's prose is long-form and metaphorical. Test 200, 300, and 500 token chunk sizes. Evaluate paragraph-boundary vs. sliding-window chunking.
2. **Embedding model swap.** Benchmark against Cohere embed-v3, BGE-M3, or multilingual-e5-large-instruct using the same test suite. The `embedding_model` column on `book_chunks` supports migration (ADR-046).
3. **Manual curation bridge.** Tag the 30 test queries with expected passages manually. Use these as a curated fallback while improving automated retrieval. The portal can launch with curated results for common queries and automated results for long-tail.
4. **Hybrid weighting tuning.** Adjust the RRF k-constant and the relative weight of vector vs. FTS results.

---

## Phase 0b: Foundation

**Goal:** Deploy to Vercel, add the AI librarian layer (query expansion, intent classification, passage ranking), build the homepage, establish observability, and provision the development-time MCP server. Phase 0b transforms the working local proof into a deployed, observable, AI-enhanced portal.

*Phase 0b depends on Phase 0a's search quality evaluation passing. If the core search doesn't work, everything built here is premature.* (ADR-113)

**Focus book:** Autobiography of a Yogi

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 0b.1 | **Vercel project + Sentry project** | Link repository to Vercel. Configure environment variables. Deploy stub `/api/v1/health` endpoint. Create Sentry project, configure DSN, verify error capture. (ADR-095) |
| 0b.2 | **Shared service layer + API conventions** | All business logic in `/lib/services/` (not in Server Components). API routes use `/api/v1/` prefix, accept both cookie and Bearer token auth, return cursor-based pagination on list endpoints, include Cache-Control headers. (ADR-011) |
| 0b.3 | **Query expansion + spiritual terminology bridge** | Claude API integration for expanding conceptual queries into semantic search terms. Includes tradition-aware vocabulary mapping (`/lib/data/spiritual-terms.json`) that bridges modern/cross-tradition terms to Yogananda's vocabulary. Per-book evolution lifecycle: each book ingestion triggers vocabulary extraction → diff → human review → merge (ADR-051). Optional — bypassed for simple keyword queries. (ADR-005 E2, ADR-051) |
| 0b.4 | **Search intent classification + passage ranking** | Search intent classification routes seekers to the optimal experience (theme page, reader, empathic entry, or standard search). Claude passage ranking selects and ranks top 5 from the hybrid search candidates. Both gracefully degrade to unranked hybrid results when Claude is unavailable. (ADR-005 E1, ADR-014) |
| 0b.5 | **Minimal homepage** | Today's Wisdom (random passage on each visit), "Show me another" link (new random passage, no page reload). Search bar with prompt "What are you seeking?" Styled with SRF design tokens. Cross-fade animation added in Phase 1. |
| 0b.6 | **Observability foundation** | Sentry error tracking with Next.js source maps. Structured logging via `/lib/logger.ts` (JSON, request ID correlation). Health check endpoint (`/api/v1/health`). Vercel Analytics for Core Web Vitals. (ADR-095) |
| 0b.7 | **Search API rate limiting** | Two-layer rate limiting: Cloudflare WAF rules (15 searches/min per IP) + application-level limiter. Crawler-tier rate limits: known bots (Googlebot, GPTBot, PerplexityBot, ClaudeBot) get 120 req/min vs. 30 req/min anonymous (ADR-081). Rate-limited searches fall back to database-only (no Claude API call) — graceful degradation. Claude API monthly budget cap as cost protection. `/scripts/` directory with CI-agnostic deployment scripts. Permissive `robots.txt` (allow all, block `/admin/`). (ADR-023, ADR-018, ADR-081) |
| 0b.8 | **Custom SRF Corpus MCP server** | Development-time MCP server allowing Claude Code to search the book corpus during development (e.g., "find all passages about meditation in Autobiography"). Connects to Neon, exposes search and chunk-retrieval tools. Registered in `.claude/` config. (ADR-097) |
| 0b.9 | **Search suggestions — basic prefix matching** | `GET /api/v1/search/suggest` endpoint returning term completions from single-book vocabulary: distinctive terms extracted from Autobiography chunks during ingestion, chapter titles, book title. PostgreSQL `pg_trgm` trigram index for fuzzy prefix matching. Zero-state experience: curated theme names as suggestion chips when search bar is focused but empty. Curated query suggestions seeded from search quality test suite (~30 queries). ARIA combobox pattern for accessibility. Latency target: < 50ms. No Claude API call in suggestion path. (ADR-049) |
| 0b.10 | **Cultural design consultation** | Identify at least one YSS-connected consultant (designer, devotee, or monastic) who participates in design reviews from Phase 0. Cultural consultation is a posture maintained throughout all phases, not a Phase 10 deliverable. This consultant reviews visual design tokens, editorial voice, "Seeking..." entry points, and the `/guide` worldview pathways for cultural sensitivity. Does not require full-time commitment — periodic review sessions. (See CONTEXT.md § Spiritual Design Principles, ADR-006, ADR-077) |
| 0b.11 | **Crisis query detection and interstitial** | Add `crisis` intent category to search intent classification (Deliverable 0b.4). When a query is classified as crisis-intent, display a calm, non-alarmist interstitial above search results with locale-appropriate crisis helpline information. Search results are not suppressed — the interstitial is additive. Conservative threshold: false positives are acceptable, false negatives are the failure mode to minimize. Crisis resource list (helplines, language, presentation) requires SRF review before going live. Sentry event `search.crisis_intent` for monitoring. (ADR-122, ADR-071, ADR-005 E1) |
| 0b.12 | **Entity registry seed** | Claude generates initial canonical vocabulary for `entity_registry` and `sanskrit_terms` tables from domain knowledge. Covers teachers, divine names, techniques, Sanskrit terms, and key concepts appearing in the Autobiography. Human review validates all entries before ingestion begins. Entity registry must be populated BEFORE first book ingestion so enrichment can resolve against it. (ADR-116) |
| 0b.13 | **Enrichment prompt design sprint** | Design and test the unified enrichment prompt (ADR-115) against 20–30 actual passages spanning all document types present in the Autobiography (narrative, poetry, dialogue, technical meditation instruction). Validate that enrichment output is consistent and useful. Iterate prompt until enrichment quality meets editorial expectations. |
| 0b.14 | **Query intent taxonomy** | Define 5 example queries per intent category (topical, specific, emotional, definitional, situational, browsing, search). Validate that intent classification routes correctly for all 35+ test queries. Forms the basis of the search quality evaluation golden set. |
| 0b.15 | **Golden suggestion set** | Hand-write 300 high-quality suggestions spanning all six tiers (ADR-049): scoped queries ("Yogananda on meditation"), named entities, domain concept phrases, Sanskrit terms with definitions, potential learned queries, and single terms. Used to seed `suggestion_dictionary` and evaluate suggestion quality. |

### Technology

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Next.js on Vercel (free tier) | $0 |
| Database | Neon PostgreSQL + pgvector + pg_search (free tier) | $0 |
| AI | Claude API (query expansion, intent classification, terminology bridge, passage ranking, enrichment, ingestion QA, search eval) | ~$15-25/mo |
| Embeddings | Voyage voyage-3-large (ADR-118) | ~$0.30 one-time |
| PDF processing | marker (open-source Python) | $0 |
| Language detection | fastText (open-source) | $0 |
| Fonts | Google Fonts (Merriweather, Lora, Open Sans) | $0 |
| Error tracking | Sentry (free tier: 5K errors/mo) | $0 |
| Migrations | dbmate (open-source) | $0 |
| Analytics | Vercel Analytics (free tier) | $0 |
| SCM | GitHub (Phases 0–8) → GitLab (Phase 9+, SRF IDP) | $0 |
| CI/CD | GitHub Actions (Phases 0–8) → GitLab CI (Phase 9+) | $0 |

### Success Criteria

- `/api/v1/health` returns `200 OK` on both local and Vercel
- Sentry test error appears in dashboard
- `.env.example` documents all required environment variables
- Query expansion improves search quality: conceptual queries ("How do I find inner peace?") return more relevant results than pure hybrid search
- The homepage displays a different Yogananda passage on each visit ("Today's Wisdom")
- "Show me another" loads a new random passage without page reload
- Sentry captures errors, structured logging works with request ID correlation
- Search suggestions return results in < 50ms

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
| 2.12 | **HyDE search enhancement** | Implement Hypothetical Document Embedding (ADR-119): Claude generates a hypothetical passage answering the query in Yogananda's register, embedded via Voyage asymmetric encoding (document input type), searched in document-space. Evaluate lift on literary/spiritual queries vs. standard vector search. Feature-flagged for A/B evaluation against golden retrieval set. |
| 2.13 | **Cohere Rerank integration** | Replace Claude Haiku passage ranking with Cohere Rerank 3.5 cross-encoder (ADR-119). Multilingual native. Benchmark precision against Claude Haiku ranking using golden retrieval set. Graceful degradation: falls back to RRF scores if Cohere is unavailable. |
| 2.14 | **Redis suggestion cache** (when latency warrants) | ElastiCache Redis for sub-millisecond autocomplete (ADR-120). Language-namespaced sorted sets. Six-tier suggestion hierarchy from `suggestion_dictionary`. pg_trgm continues as fallback. Deploy when suggestion latency or volume exceeds pg_trgm comfort zone. Architecture is Redis-shaped from Phase 0. |
| 2.15 | **Presentation mode** | "Present" button in reader header. Enlarges text to 24px+, hides all chrome, swipe/arrow-key chapter navigation only. Warm cream fills viewport. For group reading, satsang, study circles, family devotions. A CSS mode (`data-mode="present"`), not a separate feature. Pulled from Phase 7 because communal reading is the primary mode of engagement with spiritual texts in Indian, African, and Latin American cultures — deferring it reproduced a Western individual-reading default as the baseline for ~7 phases. (ADR-006) |
| 2.16 | **Automatic low-bandwidth detection** | When `navigator.connection.effectiveType` reports `2g` or `slow-2g`, display a gentle banner: "Your connection is slow. Switch to text-only mode?" One-tap enable, dismiss to keep images. Persists in `localStorage`. Seekers on fast connections never see it. Progressive enhancement — ignored when API unavailable. Complements the manual text-only footer toggle. (ADR-006) |

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
- Presentation mode fills viewport with readable text, no chrome visible, arrow-key navigation works (ADR-006)
- Low-bandwidth detection banner appears when `navigator.connection.effectiveType` reports 2g; one-tap enables text-only mode (ADR-006)

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

**Goal:** Establish editorial operations, build the theme navigation system, and deliver the staff tooling that transforms the portal from a technical project into a running content operation.

**Feature-flag activation pattern (ADR-123):** Phase 4 infrastructure ships on schedule regardless of SRF editorial staffing status. All editorial queues, review workflows, and curation tools are built and deployed behind feature flags. When SRF identifies editorial staff, queues activate via environment configuration — no code changes, no redeployment. The AE team can serve as lightweight interim editors until monastics are assigned. This decouples the build timeline from organizational readiness. (See Phase Sizing Analysis § Open Question 5.)

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
| 4.15 | **Graph intelligence batch pipeline** | Python + NetworkX/igraph batch job loads full graph from Postgres tables (entity_registry, extracted_relationships, concept_relations). Runs PageRank, community detection, and betweenness centrality. Writes results to centrality_score, community_id, bridge_score columns on entity and chunk rows. Scheduled as Lambda or Vercel cron (nightly). Community detection outputs inform theme tagging proposals. (ADR-117, DES-054) |
| 4.16 | **Three-path retrieval activation** | Activate Path C (graph-augmented retrieval) in the search pipeline: entity recognition in queries via entity_registry → SQL traversal across extracted_relationships → pgvector similarity ranking → merge with Path A (vector) and Path B (BM25) via RRF. Search pipeline evolves from two-path to three-path. Monitor retrieval quality: Path C must improve relevance on entity-rich queries without degrading keyword queries. (ADR-117, ADR-119, DES-003) |

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

**Parallel workstream note:** Chunk relation computation (5.1), the related content API (5.2), and the quality evaluation suite (5.5) are purely algorithmic — they depend on the multi-book corpus (Phase 3), not on Phase 4's editorial portal. These deliverables can proceed in parallel with Phase 4. Human quality review of relations (5.5) is validated via the test suite; editorial portal integration enhances but does not gate the computation. (ADR-123)

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
| 6.9 | **Scripture-in-Dialogue** | For Yogananda's scriptural commentaries (*God Talks with Arjuna*, *The Second Coming of Christ*): verse-level Scripture entities in entity_registry, CROSS_TRADITION_EQUIVALENT relationships in extracted_relationships between Gita and Gospel verses where Yogananda draws explicit parallels. Dual-commentary navigation: original verse pinned alongside Yogananda's interpretation. Extends the side-by-side commentary view (6.8) with graph-powered cross-tradition linking. (ADR-117, DES-056) |
| 6.10 | **Living Commentary** | Enrichment pipeline extracts internal cross-references from Yogananda's commentaries ("as I explained in Chapter X"). Cross-references become navigable inline reference cards: verbatim preview of the referenced passage without leaving the current reading position. Hypertext-ified cross-references transform dense commentaries into a connected web of teachings. (ADR-115, ADR-050, DES-056) |
| 6.11 | **Knowledge graph visualization** | Interactive visual map of the teaching corpus at `/explore`. Phase 6 nodes: books, passages, themes, persons, scriptures. Edges: chunk relations, theme memberships, external references. Client-side rendering (`d3-force` with Canvas) from pre-computed graph JSON (nightly Lambda, served from S3). **Extensible JSON schema** with `schema_version`, `node_types`, and `edge_types` arrays — designed to accommodate magazine, video, audio, and image nodes in later phases without visualization code changes (ADR-062). **Lineage filter mode:** shows only person nodes connected by `guru_of`, `disciple_of`, `succeeded_by`, `preceded_by` edges, rendered as a directed vertical layout — visualizes both the spiritual lineage and presidential succession (ADR-037). Warm tones, contemplative animation, `prefers-reduced-motion` static layout. ~50-80KB JS, loaded only on `/explore`. Graph Data API: `GET /api/v1/graph`, `/graph/subgraph`, `/graph/cluster`, `/graph.json`. Linked from Library and themes pages. (ADR-061, ADR-062, ADR-037) |
| 6.12 | **Knowledge Graph MCP tools** | Extend internal MCP (Tier 2) with graph traversal tools: `get_graph_neighborhood(node_id, depth, types[])` and `get_search_trends(period, min_count)`. Wraps `/lib/services/graph.ts` and `/lib/services/analytics.ts`. Enables editorial AI workflows to use structural graph queries — theme tag proposals with graph context, impact narrative generation from search trend clusters. `/lib/mcp/tools/graph.ts`. (ADR-101, DES-031) |

### Key Challenges

- **Verse-aware chunking** for the scriptural commentaries (fourth wave) requires a different strategy than narrative or collected-talk books. The verse-commentary structure needs special handling to preserve the verse → commentary relationship in search results and the reader.

---

## Phase 7: Empower

**Goal:** Empower monastics, center leaders, and study circles with export and preparation tools.

Transform portal content into formats for group study, satsangs, and talks. The Study Workspace becomes a central tool for anyone engaging deeply with the teachings — collecting passages, assembling teaching arcs, and exporting for use. Magazine integration brings monastic articles into the search pipeline.

- Chapter and book PDF downloads via `@react-pdf/renderer`, served from S3 (ADR-025)
- Study guide view with key themes, notable passages, and cross-book connections per chapter
- Study Workspace: theme-driven passage discovery, collection, teaching arc assembly, all in localStorage (ADR-083)
- Study circle sharing: shareable URLs with key passages and discussion prompts (DES-046)
- Magazine integration: `magazine_issues/articles/chunks` tables, full search pipeline (ADR-040)
- Shared-link collections: shareable collection URLs, community disclaimer, foundation for Phase 14 (ADR-086)
- Knowledge graph evolution: magazine nodes, ontology concepts, Passage Constellation mode (ADR-062, ADR-043)

**Success criteria:** PDFs render with correct typography and citations. Study Workspace allows passage collection, sequencing, and export without authentication. Magazine articles appear in search results alongside book passages.

---

## Phase 8: Distribute

**Goal:** Extend reach beyond direct visitors through daily email, social media, messaging channels, and MCP distribution.

The portal becomes a distribution platform — daily email, social media quote images, WhatsApp, RSS, and calendar reading journeys bring teachings to seekers where they already are. The external MCP server (Tier 3) makes the corpus accessible to third-party AI assistants. Graph intelligence features leverage the Postgres-native graph batch pipeline (ADR-117) to surface deep connections across the lineage. Events and Sacred Places sections signpost toward SRF community.

- Daily email: non-personalized, double opt-in, no tracking pixels (ADR-091)
- Social media asset generation: quote images in multiple aspect ratios with admin review (ADR-092)
- Events section and Sacred Places (SRF/YSS properties) with Autobiography cross-references (ADR-069)
- WhatsApp Business API integration for spiritual search and Daily Wisdom (ADR-026)
- RSS feeds: daily passage, new content, audio, portal updates (ADR-081, ADR-105)
- Calendar reading journeys: "40 Days with Yogananda," seasonal journeys (DES-045)
- External MCP server (Tier 3) with fidelity metadata envelope and registered access (ADR-101, DES-031)
- Outbound webhook event system with HMAC-SHA256 signatures (ADR-106, DES-052)
- Graph intelligence: Lineage Voice Comparator, Evolution of a Teaching, Passage Genealogy, Semantic Drift Detection (ADR-117, ADR-115, DES-056)
- Concept/Word Graph full construction with cross-tradition extraction (DES-055)

**Success criteria:** Daily email delivers to 100% of confirmed subscribers. External MCP returns verbatim passages with correct fidelity metadata. WhatsApp bot returns relevant passages within 5 seconds.

---

## Phase 9: Integrate

**Goal:** Migrate to Contentful as editorial source of truth and GitLab as SRF's IDP.

The PDF-ingested content migrates to Contentful's structured authoring environment. A webhook sync pipeline keeps Neon search data current as editors update text. The portal joins SRF's GitLab-based development infrastructure with four standard environments. Regional distribution (Neon read replicas in EU and Asia-Pacific) reduces search latency globally.

- Contentful content model: Book → Chapter → Section → TextBlock
- Content import and webhook sync service: Contentful publish → embed → upsert Neon (ADR-050)
- Reader migration to Contentful SSG/ISR
- Admin editorial workflow bridging Contentful authoring and portal review queues (ADR-082)
- Contentful Custom Apps: sidebar panels for theme tags, thread preview, calendar associations (ADR-082)
- GitLab migration: repo, CI/CD, Terraform state, four environments (ADR-016)
- Regional distribution: Neon read replicas, S3 cross-region replication (ADR-021)
- Cosmic Chants as Portal (if in scope): verse-by-verse chant presentation (DES-056)

**Key challenge:** Contentful free tier (10,000 records, 2 locales) may require section-level granularity or a paid space for large books.

**Success criteria:** Contentful → Neon sync produces identical search results to pre-migration content. GitLab CI/CD deploys to all four environments. Terraform plan shows zero drift.

---

## Phase 10: Translate

**Goal:** Serve content and search in multiple languages, activating Phase 1's i18n infrastructure. (ADR-075, ADR-076, ADR-077)

Two parallel language waves — Western (es, de, fr, it, pt, ja) and Indian (hi, bn) — launch simultaneously where resourcing permits. Per-language search quality evaluation ensures no language goes live with degraded retrieval. YSS co-equal design stakeholder participation for Hindi/Bengali cultural adaptation. The impact dashboard provides leadership visibility into global reach and unmet demand. The sequencing commitment (ADR-077): both waves are planned as parallel workstreams; Yogananda's heritage languages (830M speakers) do not wait behind European languages by default.

- AI-assisted UI translations with mandatory human review per locale (ADR-078)
- Localized book content ingestion with content availability matrix
- Per-language search: language-specific tsvector, multilingual embedding benchmarking (ADR-047)
- English fallback passages clearly marked `[EN]`; "Read in English →" links
- Cross-language passage alignment via `canonical_chunk_id`
- Per-language presentation adaptations: non-Latin fonts, CJK line-height, cultural "Seeking..." entry points
- Translation review UI with side-by-side English source and AI draft (ADR-082, ADR-078)
- Impact dashboard at `/admin/impact`: countries, content growth, "What is humanity seeking?" (ADR-090)
- Per-language search suggestions with transliteration support for Indic languages (ADR-049)

**Success criteria:** At least one non-English language live with ≥ 80% search quality on 15–20 test queries. English fallback passages clearly marked `[EN]`. Per-language homepage payload < 50KB including font subsetting.

---

## Phase 11: Polish

**Goal:** Elevate UI to "digital sanctuary" quality. Formal WCAG audit. Contemplative reader features.

Core accessibility has been built since Phase 1 — this phase adds advanced features, formal third-party audit, and the shared Calm Technology design system. Contemplative reader features (circadian color temperature, "Breath Between Chapters," opening moment) create the reading atmosphere. PWA enables offline reading and home screen installation.

- Calm Technology design system as shared npm package
- Formal WCAG 2.1 AA third-party audit with real-user assistive technology testing
- Reading mode: adjustable font, sepia/dark mode, high-contrast (`prefers-color-scheme`, `prefers-contrast`)
- Circadian color temperature and "Breath Between Chapters" transitions (DES-011, DES-012)
- Opening moment — portal threshold: lotus SVG fade on first session visit (DES-007)
- Progressive Web App: offline book reading, home screen installable (ADR-012)
- Sacred Places expansion: biographical sites, Street View links (ADR-069, ADR-070)
- Audio-visual ambiance toggle: temple or nature sounds, off by default
- Responsive design polish: tablet layout, print stylesheet, touch-friendly (DES-049)
- Visual regression testing via Playwright screenshots

**Success criteria:** WCAG 2.1 AA audit passes with zero critical violations. PWA installs on mobile and serves cached chapters offline. `prefers-reduced-motion` disables all animations.

---

## Phase 12: Multimedia

**Goal:** Cross-media intelligence across video, audio, and images in one unified phase.

The portal becomes a true multimedia platform. Video transcription (YouTube → Whisper) and audio ingestion create searchable, time-synced text for all recordings. Cross-media search interleaves book passages, video segments, and audio clips ranked by unified RRF. The unified content hub (`content_items` + `content_relations`) replaces per-media relation tables. YSS organizational branding activates for Hindi/Bengali locales. The Knowledge Graph reaches 30,000–50,000 nodes across all five content types. Basic YouTube video display (RSS + API) is delivered in Phase 1; this phase adds transcription, audio, images, and cross-media intelligence.

- Platform-agnostic video catalog with speaker diarization and content authority hierarchy (ADR-056)
- YouTube transcript ingestion via Whisper with time-synced playback (ADR-055)
- Audio library: S3 ingestion, Whisper transcription, browse/player with synchronized transcript (ADR-057)
- Image ingestion with sacred artifact treatment for Yogananda photographs (ADR-035)
- Cross-media search and cross-media chunk relations across all content types (ADR-050, ADR-055)
- Unified content hub: polymorphic `content_items` registry across all media types (ADR-060)
- Multi-media editorial threads: polymorphic `thread_items` replacing `thread_passages`
- YSS locale-aware organizational branding (ADR-079)
- Chant reader and deterministic `performance_of` cross-media linking (ADR-059)
- Digital watermarking: C2PA Content Credentials on sacred images (ADR-063)
- Multi-size image downloads in WebP + JPEG (ADR-064)
- Knowledge Graph: all five content types, 3D WebGL visualization, Consciousness Cartography stretch goal (ADR-061, ADR-062, DES-054)
- Concept/Word Graph exploration UI (DES-055)

**Success criteria:** Cross-media search returns interleaved book, video, and audio results. Synchronized transcript scrolls with playback. Knowledge graph displays all five content types with sacred artifact golden ring. YSS branding activates for Hindi/Bengali locales.

---

## Phase 13: Personalize

**Goal:** Optional accounts for personal study features. Anonymous access remains the default.

The DELTA-Relaxed Authenticated Experience (ADR-121) introduces a two-tier model: anonymous is default with full DELTA compliance; authenticated is opt-in for cross-device sync of bookmarks, reading progress, and personal collections. No behavioral profiling. Account deletion always available.

- Optional authentication: magic links, passkeys, or Auth0 — sign-in never required for reading/search (ADR-121)
- Bookmarks and highlights with localStorage → server migration on login
- Reading progress sync across devices
- Personal search history (opt-in, private)
- Personalized daily passage and email based on chosen themes (ADR-091)

**Success criteria:** Sign-in works without requiring registration for reading/search. localStorage bookmarks migrate to server on first login with zero data loss. Reading progress syncs across devices within 30 seconds.

---

## Phase 14: Community

**Goal:** Bridge solitary study with the global SRF community.

Events, center discovery, and messaging channels (SMS, Telegram) bring the portal to seekers who can't browse freely — basic phones, no data plans, non-literate populations. Community curation via VLD members scales editorial capacity. The Community Collections gallery publishes member-curated collections with staff review. The annual "What Is Humanity Seeking?" narrative report transforms portal data into a communications asset.

- Event calendar with time-zone adjustment, live event integration, Online Meditation Center links
- Local center discovery ("Meditation Near Me") with SRF center data
- SMS access gateway via Twilio/Africa's Talking/Gupshup — serves 3+ billion basic phone users (ADR-026)
- Telegram bot for search, daily wisdom, and audio delivery (ADR-026)
- USSD and IVR exploration for non-literate seekers (ADR-026)
- "What Is Humanity Seeking?" annual curated narrative report (ADR-040)
- Community Collections gallery with admin review queue (ADR-086)
- VLD dashboard: curation briefs, claim assignments, trusted submitter status (ADR-087)
- Collection remixing with attribution chains
- Multilingual community collections extending Phase 10 content
- DELTA-compliant community analytics for staff editorial decisions (ADR-095)

**Success criteria:** SMS gateway delivers passages in at least 2 regions. Community Collections gallery displays published collections with filtering. VLD members can browse, claim, and fulfill curation briefs.

---

## Unscheduled Features

> Features and ideas not assigned to a phase. Reviewed at every phase boundary
> during the retrospective. Items graduate to phases or are explicitly omitted
> with rationale. This section is institutional memory — not a promise.

### Validated — Awaiting Scheduling

Architecturally sound, principle-checked, has governing references. Needs a scheduling decision.

| Feature | Source | Governing Refs | Dependencies | Notes |
|---------|--------|----------------|--------------|-------|
| **SRF Lessons Integration** | Stakeholder vision | ADR-085, ADR-121 | Auth0 custom claims, `access_level` content model | Not scheduled. SRF's decision. Architecture ready (content-level access control, separate reading experience, technique instructions always out of scope). May never happen. |

### Proposed — Awaiting Evaluation

Idea captured. Not yet checked against principles and architecture. May be adopted, may be omitted.

| Feature | Source | Proposal | Principle Risk | Notes |
|---------|--------|----------|----------------|-------|
| *(Populated from `.elmer/proposals/` after `/dedup-proposals`)* | | | | |

### Deferred from Development

Was in scope for a phase, cut during implementation. Re-evaluate at the next phase boundary.

| Feature | Original Phase | Cut Reason | Re-evaluate At | Notes |
|---------|----------------|------------|----------------|-------|
| *(Populated during development)* | | | | |

### Graduation Protocol

- **At every phase boundary:** review unscheduled features during retrospective. Deferred items get first priority — they were already scoped once.
- **Proposed → Validated:** requires principle-check (does it violate any of the 11 principles?) and architectural review (does it fit the existing design, or does it need new ADRs?).
- **Validated → Phase assignment:** stakeholder decision. Add to the target phase's deliverable table.
- **Any tier → Omitted:** add to DES-056 § Explicitly Omitted with rationale.
- **AI proposes, human approves.** The AI may recommend graduation or omission; the human principal decides.

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
| **0a (Prove)** | Edition confirmed, PDF source confirmed | — |
| **0b (Foundation)** | Phase 0a search quality evaluation passes | SRF AE team availability for kickoff |
| **1 (Build)** | Phase 0b complete | Embedding model benchmarks started |
| **2 (Read)** | Phase 1 complete | — |
| **3 (Grow)** | Phase 2 complete | — |
| **4 (Operate)** | Phase 3 complete | Theme taxonomy reviewed by theological advisor. Editorial governance decided and portal coordinator identified are *activation* prerequisites (feature-flag pattern, ADR-123), not *build* prerequisites. Infrastructure ships on schedule; queues activate when staffed. |
| **5 (Connect)** | Phase 3 multi-book corpus available | Phase 4 editorial review portal operational. Algorithmic deliverables (5.1–5.4, 5.6) can proceed in parallel with Phase 4. |
| **6 (Complete)** | Phase 5 chunk relations computed | — |
| **7 (Empower)** | Phase 3 multi-book corpus available | Phase 6 observability operational |
| **8 (Distribute)** | Phase 4 editorial workflows operational | Phase 7 PDF generation available |
| **9 (Integrate)** | Phase 6 complete | Contentful contract signed (required for 9.1–9.6 only; infrastructure deliverables 9.7–9.10 proceed independently). GitLab access provisioned. (ADR-123) |
| **10 (Translate)** | Embedding model benchmarked for multilingual (research begins Phase 1–2), translation reviewers identified | Phase 9 Contentful operational (enhances but does not gate translation work — PDF pipeline remains functional). Phase 1 i18n infrastructure validated. (ADR-123) |
| **11 (Polish)** | Phase 10 at least one non-English language live | Third-party accessibility auditor engaged |
| **12 (Multimedia)** | Phase 6 complete (unified search operational) | Phase 11 PWA evaluation complete, audio/image source material available from SRF |
| **13 (Personalize)** | Phase 12 complete | SRF decision on user accounts (required for server-sync features 13.5–13.6 only; localStorage-based features 13.2–13.4 proceed independently). Auth0 configuration aligned with SRF identity standards. (ADR-123) |
| **14 (Community)** | Phase 13 account infrastructure (if applicable), VLD roster available from SRF | Regional SMS partner contracts negotiated |

**Critical decision gates** (require SRF input before the phase begins):
- **Phase 4 (Operate):** Who owns editorial governance? Who is the portal coordinator? (See CONTEXT.md § Operational Staffing)
- **Phase 9 (Integrate):** Contentful tier and content model granularity
- **Phase 10 (Translate):** YSS branding strategy for Hindi/Bengali locales
- **Phase 13 (Personalize):** Whether to implement user accounts at all
- **Phase 14 (Community):** VLD role assignment process, VLD coordinator identified, community curation governance model

**Unscheduled feature review:** Every phase gate includes a triage of ROADMAP.md § Unscheduled Features. Deferred-from-development items are evaluated first; validated items are considered for the upcoming phase; proposed items are principle-checked if relevant to the next phase's capability theme.

---

## Cost Trajectory

| Phase | Estimated Monthly Cost | Notes |
|-------|----------------------|-------|
| Phase 0a | ~$0-1 | Neon free, local dev only, one-time embedding cost (~$0.10). |
| Phases 0b–2 | ~$5-10 | Vercel free, minimal Claude API usage. S3 backup < $1/mo. |
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