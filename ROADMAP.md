# SRF Online Teachings Portal — Roadmap

> **At a glance.** 7 thematic arcs from proving the search through community curation at scale. Each arc has internal milestones with explicit gates.

| Arc | Theme | Milestones | Focus |
|-----|-------|------------|-------|
| [1: Foundation](#arc-1-foundation--proving-the-light) | Proving the Light | [1a: Prove](#milestone-1a-prove), [1b: Trilingual](#milestone-1b-trilingual), [1c: Deploy](#milestone-1c-deploy) | Prove English search, validate Hindi/Spanish multilingual search, deploy with observability |
| [2: Presence](#arc-2-presence--the-living-library) | The Living Library | [2a: Build](#milestone-2a-build), [2b: Refine](#milestone-2b-refine) | All pages, reading experience, accessibility, design system, PWA |
| [3: Wisdom](#arc-3-wisdom--expanding-understanding) | Expanding Understanding | [3a: Corpus](#milestone-3a-corpus), [3b: Editorial](#milestone-3b-editorial), [3c: Intelligence](#milestone-3c-intelligence), [3d: Complete](#milestone-3d-complete) | Multi-book catalog, editorial operations, cross-book intelligence, full corpus |
| [4: Service](#arc-4-service--tools-for-devotion) | Tools for Devotion | — | Study tools, PDF export, magazine, Contentful Custom Apps, multi-environment |
| [5: Reach](#arc-5-reach--every-seeker-everywhere) | Every Seeker, Everywhere | [5a: Distribution](#milestone-5a-distribution), [5b: Languages](#milestone-5b-languages) | Email, social, messaging, regional distribution, 10 languages |
| [6: Media](#arc-6-media--all-paths-to-truth) | All Paths to Truth | — | Video, audio, images, cross-media hub, Cosmic Chants |
| [7: Community](#arc-7-community--shared-journey) | Shared Journey | [7a: Personal](#milestone-7a-personal), [7b: Together](#milestone-7b-together) | Optional accounts, events, study circles, VLD curation |
| — | | [Unscheduled Features](#unscheduled-features) | Ideas not yet assigned to an arc |
| — | | [PWA-First Strategy](#pwa-first-strategy-no-native-app) | No native app rationale |
| — | | [Arc Gates](#arc-gates) | Go/no-go criteria between milestones |
| — | | [Cost Trajectory](#cost-trajectory) | Infrastructure cost projections |
| — | | [Dependencies and Risks](#dependencies-and-risks) | Risk register and cross-arc dependencies |

---

## Arc Philosophy

Each arc delivers a working, demonstrable increment organized around a spiritual narrative theme. 7 arcs total, with internal milestones. **Arc ordering follows the reachable population metric (ADR-128): when milestones are architecturally independent, the one serving more people ships first.** This produces a breadth-first roadmap — languages and content before polish and tools.

Arc 1 (Foundation) proves that search works on English text first (1a: Prove), validates multilingual search across Hindi and Spanish (1b: Trilingual), then deploys the observable portal with infrastructure, suggestions, and enrichment pipeline (1c: Deploy) — serving ~1.25 billion reachable people. Arc 2 (Presence) builds every page and refines the contemplative reader, including the Calm Technology design system and PWA. Arc 3 (Wisdom) is the largest arc — it decomposes the multi-book expansion across four milestones: Corpus expands the library independently of organizational decisions, Editorial establishes operations once SRF staffing is confirmed, Intelligence builds cross-book connections, and Complete finishes the full corpus. The editorial staffing gate within Arc 3 makes the most critical organizational dependency visible without hiding it behind an arc boundary. Arc 4 (Service) delivers study tools, staff infrastructure, and activates multi-environment promotion (dev/staging/prod). Arc 5 (Reach) extends distribution channels and activates remaining multilingual support. Arc 6 (Media) delivers cross-media intelligence. Arc 7 (Community) adds optional accounts and bridges solitary study with the global SRF community.

**Roadmap reordering (ADR-128).** The original roadmap ordered milestones depth-first: perfect the English experience, then expand to other languages. ADR-128 reorders breadth-first: languages move before reader polish, corpus expansion moves before reader refinement. Within Arc 1, this produces a three-milestone sequence: prove search in English first (1a), validate multilingual search in Hindi/Spanish (1b), then deploy infrastructure (1c). The detailed reordering is governed by the reachable population metric — see ADR-128 for the application protocol and worked examples. Key changes: Hindi and Spanish ingestion in Arc 1; corpus expansion (more books) before reader refinement (dwell mode, bookmarks); remaining languages before study tools. See the milestone-level details within each arc for the current execution sequence.

**Execution reordering (ADR-128).** The arc numbering below reflects *narrative themes*, but the **execution sequence** is reordered by reachable population. Architecturally independent milestones ship in this order:

| Execution Order | Milestone | What | People Served |
|----------------|-----------|------|---------------|
| 1 | **1a: Prove** | English search proof — ingest, search, read | ~390M |
| 2 | **1b: Trilingual** | Hindi + Spanish search proof | ~1.25B |
| 3 | **1c: Deploy** | Infrastructure, Vercel, homepage, observability, enrichment | ~1.25B |
| 4 | **2a: Build** | All pages, i18n infrastructure, accessibility | ~1.25B |
| 5 | **3a: Corpus** | Ingest high-impact books (en + hi/es translations as available) | ~1.25B × more content |
| 6 | **5b: Languages** | Activate remaining 7 languages (Tiers 2–3) | **~3B** |
| 7 | **2b: Refine** | Reader polish (dwell, bookmarks, typography) — now benefits all 10 languages | ~3B |
| 8 | **3b: Editorial** | Theme tagging, editorial portal, guide | ~3B |
| 9 | **3c: Intelligence** | Related Teachings, cross-book connections | ~3B |
| 10 | **3d: Complete** | Remaining books, verse-aware chunking, observability | ~3B |
| 11 | **5a: Distribution** | Email, WhatsApp, RSS, social media | ~3B+ |
| 12 | **4: Service** | Study tools, PDF, magazine, Contentful Custom Apps | ~3B |
| 13 | **6: Media** | Video, audio, images, cross-media search | ~3B |
| 14 | **7: Community** | Accounts, events, study circles | ~3B |

Key reordering moves: English search proof (1a) before trilingual validation (1b) before infrastructure deployment (1c); corpus expansion (3a) before reader polish (2b); remaining languages (5b) before reader polish (2b) and study tools (4). Every polish and tool investment after 5b benefits all 10 languages instead of just English. Arc numbers are thematic groups (what kind of work), not temporal sequences (when it ships) — the execution order table above is the definitive schedule. Note: 1b and parts of 1c can proceed in parallel — Terraform/Contentful webhooks don't depend on the trilingual proof.

**Parallel workstreams and feature-flag activation (ADR-123):** Arcs are *narrative themes*, not strictly sequential gates. Where deliverables within an arc have no technical dependency on another arc's organizational prerequisites, they proceed in parallel. Specifically: Milestone 3c algorithmic computation proceeds alongside Milestone 3b editorial tooling; Arc 4 multi-environment activation proceeds independently of other Arc 4 deliverables; Milestone 5b language waves run in parallel where resources permit; Milestone 7a localStorage features proceed independently of the SRF account decision. Organizational dependencies (editorial staffing, account policy) gate *feature activation*, not *infrastructure build*. The pattern: build on schedule, activate via feature flags when the organization is ready.

**Unscheduled features:** Not every idea belongs in an arc immediately. Features that emerge from proposals, stakeholder conversations, or development experience but aren't ready for arc assignment are managed in **PROPOSALS.md** with PRO-NNN identifiers and summarized in the [Unscheduled Features](#unscheduled-features) section below. They are reviewed at every arc boundary and either graduate to an arc, remain unscheduled, or are explicitly omitted. The backlog does not grow forever — omission with rationale is a valid outcome. See PROPOSALS.md § Graduation Protocol for the full lifecycle.

---

## Arc Sizing Analysis

7 thematic arcs, each delivering a single coherent capability. Remaining open questions from arc planning are consolidated in CONTEXT.md § Open Questions.

---

## Arc 1: Foundation — Proving the Light

### Milestone 1a: Prove

**Goal:** Answer the existential question: does pure hybrid search (vector + BM25 + RRF) across Yogananda's English text return high-quality, relevant, verbatim passages with accurate citations? Deliver the minimum vertical slice: ingest → search → read, in English only. Everything else waits until this works. Pure hybrid search — with no AI services in the search path — is the **primary search mode** for the portal, not a stepping stone to AI-enhanced search. (ADR-119)

*Milestone 1a is deliberately small — English only, no Terraform, no trilingual. The design is 120+ ADRs deep — the risk is no longer under-design but over-design without empirical contact. Prove that search works on one language first, then validate multilingual in 1b and deploy in 1c.* (ADR-113)

**Focus book:** Autobiography of a Yogi — **English** only (Hindi and Spanish in Milestone 1b)

**Build methodology:** Claude executes all deliverables autonomously. No human-in-the-loop gates. The human principal reviews at their discretion, not as a blocking step. This applies to the development methodology — PRINCIPLES.md § "Human Review as Mandatory Gate" governs the production portal's content governance, not the build process.

### Prerequisites (conversations, not code)

These are blocking conversations that must happen before ingestion begins:

1. **~~Edition confirmation:~~** *(Resolved 2026-02-24.)* Use edition indicated in PDF source (spiritmaji.com). Configure as parameter per ADR-123 for later adjustment when SRF confirms canonical edition.
2. **~~PDF source confirmation:~~** *(Resolved 2026-02-24.)* spiritmaji.com PDF accepted for Arc 1 proof. Non-PDF digital text will replace before launch.
3. **~~English ebook extraction:~~** *(Resolved 2026-02-26.)* Amazon Cloud Reader ebook (ASIN B00JW44IAI) extracted via `scripts/book-ingest/` pipeline — Playwright capture + Claude Vision OCR. 522 pages, 49 chapters, 94,584 words at 5.0/5.0 confidence. Ready for Contentful import. See `scripts/book-ingest/DESIGN.md`.
4. **~~Hindi and Spanish source confirmation:~~** *(Resolved 2026-02-28.)* Purchase from Amazon for Arc 1 proof. Hindi: [YSS Hindi edition](https://www.amazon.com/Autobiography-HINDI-Hindi-Paramahansa-Yogananda/dp/9389432472). Spanish: [SRF Spanish edition](https://www.amazon.com/Autobiografia-Autobiography-Self-Realization-Fellowship-Spanish/dp/0876120982). SRF/YSS-provided digital text will replace before launch.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 1a.1 | **Repository + development environment** | Create Next.js + TypeScript + Tailwind + pnpm repository. Configure ESLint, Prettier, `.env.example`. Establish `/lib/services/`, `/app/api/v1/`, `/migrations/`, `/scripts/`, `/messages/` directory structure. **Mobile-first CSS convention:** Tailwind mobile-first breakpoints (`px-4 md:px-8`, not the reverse). Viewport meta tag in root layout. All components built mobile-first and enhanced upward — this costs nothing at project start and is expensive to retrofit (Principle 7, ADR-006). No Terraform, no `bootstrap.sh`, no CI pipeline yet — those are Milestone 1c concerns. (ADR-041) |
| 1a.2 | **Neon project + initial schema** | Neon project created via Neon MCP (not Terraform — Terraform formalization in 1c.1). **PostgreSQL 18**. **MCP-driven verification:** Claude verifies via Neon MCP: project exists with correct PG version and Scale tier (`list_projects`), all 5 extensions install on PG18 (`run_sql` → `SELECT extname FROM pg_extension`), retrieves connection strings for `.env.local` (`get_connection_string`). Fallback: PG17, no code changes. Create dev branch for local development. Write `001_initial_schema.sql` covering all search tables (books, chapters, book_chunks, entity_registry, sanskrit_terms, suggestion_dictionary, teaching_topics, chunk_topics, daily_passages, affirmations, chunk_relations, extracted_relationships, search_queries, search_theme_aggregates, chapter_study_notes, book_chunks_archive). All primary keys use `DEFAULT uuidv7()` for time-ordered UUIDs (ADR-124 § UUIDv7 convention). All content tables include `updated_at` column with auto-set trigger and composite `(updated_at, id)` index for timestamp-filtered pagination (ADR-107). Tables include full column specification: books (with `bookstore_url`, `edition`, `edition_year` per ADR-034), book_chunks (with `embedding_model` versioning per ADR-046, `content_hash` for stable deep links per ADR-022, enrichment columns per ADR-115), teaching_topics (with `category` and `description_embedding` per ADR-032), chunk_topics (three-state `tagged_by` per ADR-032). BM25 index via pg_search (ADR-114). Run via dbmate. Verify tables, indexes, BM25 index, and entity_registry via MCP `run_sql`. Time Travel queries available immediately for development debugging (PRO-008). (ADR-093, ADR-050, ADR-032, ADR-022, ADR-053, ADR-034, ADR-114, ADR-115, ADR-116, ADR-124) |
| 1a.3 | **Contentful space + content model** | Create Contentful space. Configure content types: Book → Chapter → Section → TextBlock per DESIGN-arc1.md § Contentful Content Model. Enable **English locale only** (Hindi/Spanish locales added in Milestone 1b). Configure Contentful Personal Access Token in `.env`. Verify content model by creating a test Book entry. Contentful is the editorial source of truth from Arc 1 (ADR-010). |
| 1a.4 | **English Contentful import + Neon sync** | English text already extracted via `scripts/book-ingest/` pipeline (522 pages, 49 chapters, `book.json` ready — see `scripts/book-ingest/DESIGN.md`). Remaining work: build Contentful import script (`book.json` → Contentful Management API: Book → Chapter → Section → TextBlock entries). Typographic normalization applied during extraction (smart quotes, proper dashes, ellipsis glyphs). Compute SHA-256 per chapter and store in `chapters.content_hash` (ADR-039). Resolve 2 critical text gaps (pages 188, 216) via physical book. **Branch-isolated Neon ingestion:** Create `ingest-{timestamp}` branch from dev via Neon MCP (`create_branch`). Batch sync from Contentful to the ingestion branch: read TextBlocks from Delivery API → chunk by paragraphs (ADR-048: paragraph-based, 100–500 token range, special handling for epigraphs and poetry) → generate embeddings via Voyage voyage-3-large → insert with `contentful_id` linkage. Verify chunk counts, embedding dimensions, and citation integrity on the branch (`run_sql`). If verification passes, apply to dev branch. If not, delete branch, iterate. Note: 1a ingestion produces plain chunks without entity resolution or enrichment metadata — those are Milestone 1c concerns (1c.12 entity registry, 1c.13 enrichment prompts). Re-enrichment of 1a chunks happens after 1c.12/1c.13 are complete. |
| 1a.5 | **Search API** | Next.js API route (`/api/v1/search`) implementing hybrid search (vector + FTS + RRF). Returns ranked verbatim passages with citations. No query expansion or intent classification yet — pure hybrid search. (ADR-011, ADR-044) |
| 1a.6 | **Search UI** | Search results page: ranked verbatim quoted passages with book/chapter/page citations. "Read in context" deep links. Search bar with prompt "What are you seeking?" Mobile-first responsive layout: full-width stacked cards on small viewports, 44×44px minimum touch targets on all interactive elements. Usable on a 320px-wide screen — the majority of the Hindi/Spanish audience (ADR-128) is mobile-first. (ADR-006) |
| 1a.7 | **Basic book reader** | Chapter-by-chapter reading view serving content from Contentful Delivery API. Deep-link anchors, optimal line length (English: 65–75 chars / `max-width: 38rem` on desktop, responsive fluid width on mobile), prev/next chapter navigation with 44×44px touch targets, "Find this book" SRF Bookstore links, basic reader accessibility (skip links, semantic HTML). Reading column must be comfortable on a 320px phone screen — not a scaled-down desktop layout. (ADR-006) |
| 1a.8 | **Search quality evaluation (English)** | Test suite of ~58 English queries with expected passages (golden retrieval set). Six difficulty categories: **Direct** (~10 queries, baseline ~95%), **Conceptual** (~12 queries, baseline ~85%), **Emotional** (~12 queries, baseline ~70%), **Metaphorical** (~8 queries, baseline ~65%), **Technique-boundary** (~8 queries, must correctly route to Practice Bridge, baseline 100%), **Adversarial** (~8 queries — off-topic, misspelled, multi-intent, prompt-injection — must route to no-results or degrade gracefully). Claude drafts the query set after corpus ingestion (1a.4), evaluates results, and judges quality autonomously. Metrics: Recall@3 per category (primary gate), MRR@10 (diagnostic). Per-category breakdowns reveal WHERE search needs improvement. Threshold: ≥ 80% Recall@3 overall. Golden set data in `/data/eval/golden-set-en.json`, evaluation script in `/scripts/eval/search-quality.ts`. Full methodology: DES-058. (ADR-005 E5) |

### Technology

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Next.js (local dev; Vercel in 1c) | $0 |
| CMS | Contentful | $0 |
| Database | Neon PostgreSQL 18 + pgvector + pg_search (Scale tier) | ~$20/mo |
| Embeddings | Voyage voyage-3-large (1024d, ADR-118) | ~$0.30 one-time |
| Migrations | dbmate (open-source) | $0 |
| SCM | GitHub | $0 |

### Success Criteria

- `pnpm dev` starts a working Next.js application locally
- `dbmate status` shows migration 001 applied
- Contentful space contains English Autobiography content (Book, Chapters, Sections, TextBlocks)
- A seeker can type "How do I overcome fear?" and receive relevant, verbatim Yogananda quotes with accurate book/chapter/page citations
- "Read in context" links navigate to the correct passage in the reader
- Simple keyword searches ("divine mother") work without any LLM involvement
- Search latency < 2 seconds for hybrid queries
- Zero AI-generated content appears in any user-facing result
- The book reader enforces 65–75 character line length on desktop and comfortable reading width on mobile (320px viewport usable)
- Search UI and reader are usable on a mobile phone: touch targets ≥ 44×44px, no horizontal scrolling, text readable without zooming
- "Find this book" links are present on every passage and link to the SRF Bookstore
- Search quality evaluation passes: ≥ 80% of English test queries return at least one relevant passage in the top 3 results
- Per-category evaluation breakdowns available for all six difficulty categories

### What If Search Quality Fails?

If the ≥ 80% threshold is not met, the following contingencies apply before proceeding to Milestone 1b:

1. **Chunking adjustment.** Yogananda's prose is long-form and metaphorical. Test 200, 300, and 500 token chunk sizes. Evaluate paragraph-boundary vs. sliding-window chunking.
2. **Embedding model swap.** Benchmark against Cohere embed-v3, BGE-M3, or multilingual-e5-large-instruct using the same test suite. The `embedding_model` column on `book_chunks` supports migration (ADR-046).
3. **Manual curation bridge.** Tag the 30 test queries with expected passages manually. Use these as a curated fallback while improving automated retrieval. The portal can launch with curated results for common queries and automated results for long-tail.
4. **Hybrid weighting tuning.** Adjust the RRF k-constant and the relative weight of vector vs. FTS results.
5. **Per-category analysis.** Use the six difficulty categories to target improvements: if Emotional queries fail but Direct queries pass, the terminology bridge (1c.4) may be the fix rather than embedding model changes.

---

### Milestone 1b: Trilingual

**Goal:** Does multilingual search work in Hindi and Spanish? Validate ADR-128's breadth-first bet. Contentful already exists from 1a — add Hindi/Spanish locales and content.

*Milestone 1b depends on Milestone 1a's English search quality evaluation passing. If search doesn't work in English, multilingual search is premature.* (ADR-113)

**Focus book:** Autobiography of a Yogi — **Hindi and Spanish** editions (ADR-128 Tier 1)

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 1b.1 | **Hindi and Spanish Autobiography ingestion** | Reuses existing `scripts/book-ingest/` pipeline: add BookConfig entries for Hindi/Spanish editions, purchase ebooks, run capture → extract → assemble → validate. Hindi tests Devanagari OCR accuracy (Claude Vision on Devanagari text). Import to Contentful Hindi/Spanish locales (add locales to existing Contentful space from 1a.3) → Neon sync → chunk → embed with Voyage voyage-3-large (natively multilingual). Create `canonical_book_id` cross-language link between the three editions. Validate: Hindi queries return Hindi passages, Spanish queries return Spanish passages, cross-language fallback works (English results shown when target language has no match, clearly marked `[EN]`). Font loading: Noto Serif Devanagari (reading) + Noto Sans Devanagari (UI) for Hindi, eagerly preloaded on `/hi/` locale (ADR-080). (ADR-077, ADR-128) |
| 1b.2 | **Trilingual search quality evaluation** | ~15 Hindi + ~15 Spanish queries with expected passages. Same six difficulty categories as 1a.8 (weighted toward Direct and Conceptual given smaller corpus). Claude drafts the query set, evaluates results, and judges quality autonomously. Per-category breakdowns per language. Threshold: ≥ 80% Recall@3 per language. Golden set data in `/data/eval/golden-set-{hi,es}.json`. Full methodology: DES-058. (ADR-005 E5, ADR-128, ADR-077) |
| 1b.3 | **Devanagari typography QA** | Verify faithful Devanagari rendering across the Hindi *Autobiography*. Conjunct characters (jodakshar: क्ष, त्र, ज्ञ, श्र) render correctly at all font sizes. Matras (vowel signs: ि, ी, ु, ू, े, ै, ो, ौ) do not collide with consonants. Halant/virama (्) renders correctly for consonant clusters. Nukta characters (फ़, ज़, ख़) preserved from source. Hindi body text at 20px (`--text-base-hi`) with 1.9 line height. Optimal line length: 40–50 aksharas. Drop capitals omitted. Print stylesheet renders Noto Serif Devanagari at 12pt. `@vercel/og` quote images render Hindi passages with bundled Noto Serif Devanagari font. (ADR-080) |
| 1b.4 | **Cross-language fallback verification** | English `[EN]` marking when target language has no match. Hindi/Spanish font loading verified. `canonical_book_id` linking between editions. Spanish line length (65–75 chars, same as English). Hindi line length (40–50 aksharas, adjusted `max-width`). Reader view works for all three languages. |

### Success Criteria

- Hindi *Autobiography* ingested with correct citations and `language: 'hi'`
- Spanish *Autobiography* ingested with correct citations and `language: 'es'`
- Hindi search queries return Hindi passages; Spanish queries return Spanish passages
- Trilingual search quality evaluation passes: ≥ 80% per language (hi, es)
- Per-category evaluation breakdowns available for Hindi and Spanish
- Cross-language fallback: English results shown (marked `[EN]`) when target language has no match
- Noto Serif Devanagari (reading) and Noto Sans Devanagari (UI) load correctly for Hindi content
- Hindi body text renders at 20px with 1.9 line height; optimal line length 40–50 aksharas
- Devanagari conjuncts, matras, halant, and nukta characters render correctly at all font sizes
- Hindi passage quote images (`@vercel/og`) render Devanagari without empty boxes
- Hindi print stylesheet uses Noto Serif Devanagari at 12pt

---

### Milestone 1c: Deploy

**Goal:** Build proper infrastructure (Terraform, CI/CD), deploy to Vercel, add homepage, observability, and all enhancement features. Pure hybrid search (vector + BM25 + RRF) is the primary search mode — no AI services in the search hot path. Milestone 1c transforms the working local proof into a deployed, observable portal.

*Milestone 1c depends on Milestone 1b's trilingual search quality evaluation passing. If multilingual search doesn't work, deploying is premature.* (ADR-113)

*AI-enhanced search (query expansion, Claude passage ranking, Cohere reranking) is deferred to Milestone 2b, conditional on 1a/1b evaluation. If pure hybrid search meets quality targets comfortably (≥ 90% of test queries return relevant passages in top 3), AI enhancements may not be needed. See ADR-119.*

**Focus book:** Autobiography of a Yogi (English, Hindi, Spanish)

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 1c.1 | **Infrastructure bootstrap + Terraform** | Create `scripts/bootstrap.sh` — idempotent bootstrap script that automates S3 bucket, DynamoDB table, OIDC provider, IAM role creation via AWS CLI, prompts for Neon org key and Sentry token, configures Vercel CLI, and sets all GitHub secrets via `gh secret set` (ADR-020). Create `terraform/bootstrap/trust-policy.json` for IAM OIDC trust policy. Establish `/terraform/`, `.github/workflows/` directory structure. Write Terraform modules and run first `terraform apply` — formalizes existing Neon project, creates Sentry project, and AWS core resources (OIDC provider, IAM roles, S3 bucket, Budget alarm). Vercel module enabled. Lambda module disabled until Milestone 2a (DES-039 § Progressive Module Activation). CI pipeline (`ci.yml` + `terraform.yml`) operational. Enable Neon branch protection on production branch. Create project-scoped API key for CI (ADR-124 § API Key Scoping). Configure automated Neon snapshots: daily at 03:00 UTC, weekly Sunday, monthly 1st — via Neon API (ADR-019 Layer 2). (ADR-016, ADR-020, ADR-041) |
| 1c.2 | **Vercel project + Sentry project** | Link repository to Vercel. Configure environment variables. Deploy stub `/api/v1/health` endpoint. Create Sentry project, configure DSN, verify error capture. (ADR-095) |
| 1c.3 | **Shared service layer + API conventions** | All business logic in `/lib/services/` (not in Server Components). API routes use `/api/v1/` prefix, accept both cookie and Bearer token auth, return cursor-based pagination on list endpoints, include Cache-Control headers. (ADR-011) |
| 1c.4 | **Spiritual terminology bridge (index-time)** | Tradition-aware vocabulary mapping (`/lib/data/spiritual-terms.json`) that bridges modern/cross-tradition terms to Yogananda's vocabulary. Applied at index time during enrichment (ADR-115) — maps "mindfulness" → "concentration" in the BM25 index so seekers find passages without query-time AI. Per-book evolution lifecycle: each book ingestion triggers vocabulary extraction → diff → merge. Claude performs extraction and diffing autonomously (ADR-051). **Query-time expansion via Claude deferred to Milestone 2b** (conditional on 1a evaluation, ADR-119). (ADR-051) |
| 1c.5 | **Minimal homepage** | Today's Wisdom (random passage on each visit), "Show me another" link (new random passage, no page reload). Search bar with prompt "What are you seeking?" Styled with SRF design tokens. Cross-fade animation added in Milestone 2a. |
| 1c.6 | **Observability foundation** | Sentry error tracking with Next.js source maps. Structured logging via `/lib/logger.ts` (JSON, request ID correlation). Health check endpoint (`/api/v1/health`). Vercel Analytics for Core Web Vitals. (ADR-095) |
| 1c.7 | **Search API rate limiting** | Two-layer rate limiting: Vercel Firewall rules (15 searches/min per IP) + application-level limiter. Crawler-tier rate limits: known bots (Googlebot, GPTBot, PerplexityBot, ClaudeBot) get 120 req/min vs. 30 req/min anonymous (ADR-081). Pure hybrid search is the primary mode — no AI services in the hot path, no degradation cascade needed. CI-agnostic deployment scripts in `/scripts/` (ADR-018). Permissive `robots.txt` (allow all, block `/admin/`). (ADR-023, ADR-018, ADR-081) |
| 1c.8 | **Contentful webhook sync service** | Event-driven sync replacing Milestone 1a batch script: Contentful publish → Vercel Function → extract plain text from Rich Text AST → chunk → enrich → embed → upsert Neon (matched by `contentful_id`). Handles create, update, and unpublish events. Logs sync events for monitoring. (ADR-010, DES-005) |
| 1c.9 | **Search suggestions — static JSON + pg_trgm fuzzy fallback** | Three-tier suggestion architecture (ADR-120). **Tier A:** Pre-computed static JSON prefix files at Vercel CDN edge — trilingual vocabulary (en/hi/es) from the Autobiography, chapter titles, zero-state chips per language. Client-side prefix filtering. < 10ms globally. Hindi Devanāgarī suggestions served via Unicode first-character prefix files (`/public/suggestions/hi/स.json`) alongside Latin two-character files for Romanized input (`/public/suggestions/hi/sa.json`). **Tier B:** `GET /api/v1/search/suggest` pg_trgm fuzzy fallback endpoint for misspellings and transliterated input (queries both `suggestion` and `latin_form` columns). Async merge into dropdown when prefix results are sparse. Edge-cached. **Debounce:** Adaptive — fire immediately on first keystroke, 100ms debounce on subsequent, 200ms on 2G. ARIA combobox pattern. Mobile: max 5 suggestions, 44×44px touch targets. No Claude API call in suggestion path. (ADR-049, ADR-120) |
| 1c.10 | **Cultural design consultation** | Claude performs cultural sensitivity review using cultural-lens skill — evaluating visual design tokens, editorial voice, "Seeking..." entry points, and the `/guide` worldview pathways. Identifies culturally sensitive areas (Hindu devotional imagery, Sanskrit terminology, meditation instruction framing) and proposes adjustments. YSS-connected consultation (designer, devotee, or monastic) is invited but not a blocking gate. Cultural consultation is a posture maintained throughout all arcs. (See CONTEXT.md § Spiritual Design Principles, ADR-006, ADR-077) |
| 1c.11 | **Crisis query detection and interstitial** | Heuristic keyword-based crisis detection against a curated keyword list (`/lib/data/crisis-terms.json`). When a query matches crisis patterns, display a calm, non-alarmist interstitial above search results with locale-appropriate crisis helpline information. Search results are not suppressed — the interstitial is additive. Conservative threshold: false positives are acceptable, false negatives are the failure mode to minimize. Sentry event `search.crisis_intent` for monitoring. If Claude intent classification is activated in Milestone 2b, it replaces or augments the heuristic. (ADR-122, ADR-071) |
| 1c.12 | **Entity registry seed** | Claude generates initial canonical vocabulary for `entity_registry` and `sanskrit_terms` tables from domain knowledge. Covers teachers, divine names, techniques, Sanskrit terms, and key concepts appearing in the Autobiography. Claude self-validates all entries against the extracted Autobiography text. Entity registry must be populated BEFORE re-enrichment of 1a chunks. (ADR-116) |
| 1c.13 | **Enrichment prompt design sprint** | Design and test the unified enrichment prompt (ADR-115) against 20–30 actual passages spanning all document types present in the Autobiography (narrative, poetry, dialogue, technical meditation instruction). Validate that enrichment output is consistent and useful. Claude designs, tests against passages, and iterates autonomously. |
| 1c.14 | **Query intent taxonomy** | Define 5 example queries per intent category (topical, specific, emotional, definitional, situational, browsing, search). Validate that intent classification routes correctly for all 35+ test queries. Forms the basis of the search quality evaluation golden set. |
| 1c.15 | **Golden suggestion set** | Hand-write 300 high-quality suggestions spanning all six tiers (ADR-049): scoped queries ("Yogananda on meditation"), named entities, domain concept phrases, Sanskrit terms with definitions, potential learned queries, and single terms. Used to seed `suggestion_dictionary` and evaluate suggestion quality. |
| 1c.16 | **Copyright communication layer** | Multi-layered copyright assertion for the fully crawlable portal. `/llms.txt` with copyright section. `/ai.txt` machine-parseable AI permissions file (`Allow-Training: yes`, `Attribution-Required: yes`, `Allow-Derivative-Works: no`). `X-Copyright` and `X-Attribution-Required` response headers on all content routes (middleware in `/lib/middleware/copyright-headers.ts`). JSON-LD `copyrightHolder` field on all content pages. Stub `/legal` page with copyright notice (full legal page in Milestone 2a.20). `/api/v1/copyright` machine-readable endpoint. Final licensing terms (CC-BY-NC vs. all-rights-reserved with permissions) deferred to SRF legal counsel review. Ships before public deployment. (ADR-081 §3a, §3b; PRO-012) |
| 1c.17 | **Text-only mode** | Toggle in site footer. When enabled: no images, no decorative elements, no web fonts (system serif stack). Stored in `localStorage`. Not a degraded experience — a considered one for seekers on metered data. Milestone 1c is the first production deployment; seekers paying per megabyte need this from day one. Milestone 2a.11 extends with reader settings integration and design system polish. (ADR-006 §1) |
| 1c.18 | **Minimal Service Worker** | Cache app shell (HTML, CSS, JS, fonts) for instant repeat visits. Offline indicator banner: "You're reading offline. Search requires a connection." Warm cream palette, not a red warning. ~50 lines of code. Milestone 2a.12 extends with enhanced caching strategy. (ADR-006 §4) |
| 1c.19 | **Low-bandwidth detection** | When `navigator.connection.effectiveType` reports `2g` or `slow-2g`, display a gentle banner: "Your connection appears slow. Switch to text-only mode for a faster experience?" Accept / Dismiss. Dismissed preference in `sessionStorage`. Progressive enhancement — no-op on browsers without the API. The rural Bihar seeker on 2G shouldn't wait until Milestone 2b for the portal to notice their connection is slow. (ADR-006 §1, DES-049) |

Search intent classification + passage ranking stays **deferred to Milestone 2b** (conditional on 1a/1b evaluation, ADR-119). Pure hybrid search is the primary search mode. Crisis query detection (1c.11) uses heuristic keyword matching rather than Claude intent classification.

*Deliverables 1c.17–1c.19 added 2026-02-28: applying ADR-128's reachable population logic to device readiness. Milestone 1c is the first production deployment — mobile-first seekers (~70% of Hindi/Spanish audience) need text-only mode, cached assets, and low-bandwidth awareness from the moment they can reach the portal. Previously scheduled for Milestone 2a/2b; moved forward because the cost is near-zero and the gap violates Global-First (Principle 5).*

### Technology

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Next.js on Vercel (Pro tier) | ~$20/mo |
| Database | Neon PostgreSQL 18 + pgvector + pg_search (Scale tier, ADR-124) | ~$20/mo |
| AI | Claude API (index-time enrichment, search eval — not in search hot path, ADR-119) | ~$5-10/mo |
| Embeddings | Voyage voyage-3-large (ADR-118) | ~$0.30 one-time |
| Language detection | fastText (open-source) | $0 |
| Fonts | Google Fonts (Merriweather, Lora, Open Sans) | $0 |
| Error tracking | Sentry (Team tier) | ~$26/mo |
| Migrations | dbmate (open-source) | $0 |
| Analytics | Vercel Analytics (included with Pro) | $0 |
| SCM | GitHub | $0 |
| CI/CD | GitHub Actions | $0 |
| IaC State | S3 + DynamoDB (state backend) | ~$0 |

### Success Criteria

- `terraform apply` completes successfully (Neon project formalized, Sentry project, AWS core resources, Vercel project)
- `terraform plan` shows no drift after apply
- CI pipeline (`ci.yml` + `terraform.yml`) runs green on a test PR
- `/api/v1/health` returns `200 OK` on both local and Vercel
- Sentry test error appears in dashboard
- `.env.example` documents all required environment variables
- Pure hybrid search handles conceptual queries ("How do I find inner peace?") via index-time terminology bridge mappings — no AI services needed in the search path
- Search p95 < 500ms from any continent (ADR-021 § Regional Latency Targets)
- The homepage displays a different Yogananda passage on each visit ("Today's Wisdom")
- "Show me another" loads a new random passage without page reload
- Sentry captures errors, structured logging works with request ID correlation
- Search suggestions return results in < 10ms for prefix matches (CDN-served static JSON) and < 80ms for fuzzy fallback (pg_trgm)
- Adaptive debounce tested on real devices: immediate on first keystroke, configurable interval on subsequent keystrokes, extended on slow connections
- `/llms.txt` serves citation guidance with copyright section; `/ai.txt` serves machine-parseable AI permissions
- `X-Copyright` response header present on all content API responses
- `/api/v1/copyright` returns structured copyright metadata
- Text-only mode toggle works: disables images, decorative elements, web fonts when activated from footer
- Service Worker caches app shell; offline indicator displays when connectivity drops
- Low-bandwidth detection banner appears on 2G connections; one-tap enables text-only mode
- All pages usable on a 320px mobile viewport: no horizontal scrolling, touch targets ≥ 44×44px, text readable without zooming

### Open Questions to Resolve

See CONTEXT.md § Open Questions for the consolidated list of technical and stakeholder questions. Questions live there so they're visible at session start and move to "Resolved" as work progresses.

---

## Arc 2: Presence — The Living Library

### Milestone 2a: Build

**Goal:** Build every page, establish the SRF visual identity, deliver a complete portal experience that a stakeholder can navigate end-to-end, and establish the testing pipeline, infrastructure-as-code, and component library that enable confident, automated development for all subsequent arcs. Engineering infrastructure is built alongside the portal, not after it.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 2a.1 | **Full homepage — "The Living Library"** | Placeholder thematic doors (linked to pre-built search queries until Milestone 3b populates the theme system), "Seeking..." empathic entry points, latest YouTube videos section using RSS feed + YouTube Data API (categorized playlists, ISR revalidation), and "Show me another" cross-fade upgrade. |
| 2a.2 | **Books and Book Landing** | `/books` page ("Books") listing available books with cover images, editorial descriptions, chapter counts, and SRF Bookstore links. `/books/[slug]` book landing page with cover, metadata, featured quote, editorial description, and full chapter list. Warm, unhurried design even with a single book — honest "More books are being added" note with SRF Bookstore signpost. |
| 2a.3 | **The Quiet Corner** | Single-page micro-sanctuary (`/quiet`): random affirmation from curated pool (circadian-aware selection), optional gentle timer (1/5/15 min), chime at completion with haptic singing bowl pattern. Timer completion flow: chime → 3s stillness → crossfade to parting passage (DES-014). Self-contained page: header collapses to lotus mark only, footer suppressed. No tracking, no accounts. Initially sourced from Autobiography's most contemplative passages. Restricted to `accessible` passages (ADR-072). |
| 2a.4 | **About page** | `/about`: Yogananda biography, line of gurus (with official portraits), SRF overview, "Go Deeper" links to SRF Lessons, center locator, Online Meditation Center, bookstore, app. |
| 2a.5 | **Navigation and footer** | Persistent header nav (Search, Books, Videos, Quiet Corner, About). Footer with SRF ecosystem links and small Yogananda portrait (ADR-088) on every page. External links to yogananda.org, SRF Lessons, Online Meditation Center, SRF Bookstore, center locator, app, YouTube. Unified lotus SVG motif as section dividers and favicon (DES-016). |
| 2a.6 | **Passage sharing** | Every passage gets a quiet share icon. Mobile: `navigator.share` opens the native share sheet (surfaces WhatsApp, Telegram, SMS, etc.) — "Save as image" and "Save as PDF" in overflow menu. Desktop: custom share menu (copy link, email passage, save as image, save as PDF). Generates `/passage/[id]` URL with OG meta tags and content-hash parameter for stable deep links (ADR-022). Quote image generation via `@vercel/og`. PDF: single-page, Merriweather, warm cream, lotus watermark, A4. File size displayed on all downloads ("Download PDF (2.1 MB)"). No social media buttons or tracking scripts. (ADR-068, ADR-022, ADR-024) |
| 2a.7 | **SEO and machine access foundations** | Comprehensive machine-readability layer per ADR-081. **Structured data:** JSON-LD per page type — `Book` with `ReadAction` (free read in SERPs), `Chapter`, `Quotation` with `SpeakableSpecification` (voice assistant read-aloud), `BreadcrumbList` (on all deep pages), `WebSite` + `SearchAction`, `Organization` + `Person` with `sameAs` (Wikidata, Wikipedia, yogananda.org for Knowledge Panel association), `AudioObject`, `VideoObject`. **Meta tags:** Google Scholar citation tags on passage pages. Twitter Card tags (`summary_large_image` on content pages, `summary` on utility pages). `<meta name="robots" content="max-image-preview:large, max-snippet:-1, max-video-preview:-1">` on all content pages (Google Discover eligibility). **Canonical URLs:** `<link rel="canonical">` on every page per ADR-081 §9. **Sitemaps:** Per-content-type XML sitemaps (`/sitemap-books.xml`, `/sitemap-themes.xml`, etc.) with `<lastmod>` and `<changefreq>`. **Machine files:** `llms.txt` with AI citation guidance; `llms-full.txt` with corpus metadata inventory (passage-level content deferred to Milestone 5a+); `indexnow-key.txt` for IndexNow domain verification; `/.well-known/security.txt` (RFC 9116). **Content negotiation:** `Accept: application/json` on page routes returns structured JSON with fidelity metadata (ADR-081 §11). **IndexNow:** Pings fired on content changes (book ingestion, daily passage rotation). **Feeds:** RSS auto-discovery `<link rel="alternate">` tags in `<head>` (feed content in Milestone 5a). **Rendering:** All content pages ISR/SSR with complete server-rendered HTML; client-only pages (`/bookmarks`, `/study`, `/feedback`) are `noindex`. OG quote images generated at minimum 1200×630px. Google Search Console + Bing Webmaster Tools setup. (ADR-081) |
| 2a.8 | **Accessibility foundation** | WCAG 2.1 AA from day one. Semantic HTML, ARIA landmarks, keyboard navigation, skip links, focus indicators, screen reader testing, color contrast compliance, `prefers-reduced-motion` support, 44×44px touch targets. Automated a11y testing in CI via axe-core. Claude-generated reverential alt text for all Yogananda photographs (About page, footer, book covers), reviewed by SRF editors. ARIA labels written as warm speech (ADR-073). Progressive homepage disclosure for first visits (ADR-072). (ADR-003, ADR-005 E7, ADR-072, ADR-073) |
| 2a.9 | **i18n infrastructure + trilingual UI** | All UI strings externalized to `messages/en.json`. **Hindi and Spanish UI strings translated** via Claude draft → human review workflow (ADR-078): spiritual terminology glossaries (`glossary-hi.json`, `glossary-es.json`) bootstrapped from existing SRF/YSS published terminology; `scripts/translate-ui.ts` generates `{locale}.draft.json` from `en.json` + glossary + string context (`en.context.json`); human reviewer approves into production `{locale}.json`. `next-intl` configured with `en`, `hi`, `es` locales. CSS logical properties throughout (`ms-*` not `ml-*`). `lang` attribute on `<html>`. No hardcoded strings in components. `topic_translations` table created (empty until Milestone 5b). pg_search BM25 indexes configured with language-appropriate ICU tokenization (ADR-114). All content-serving API endpoints accept `language` parameter. Arc 1 content and UI chrome are trilingual (en/hi/es); architecture supports adding remaining 7 core languages with zero rework. UI copy follows micro-copy standards (ADR-074): "seeker" not "user," warm error messages, contemplative ARIA labels. Playwright visual snapshots verify Hindi/Spanish UI renders correctly — no truncation, correct Devanāgarī typography per ADR-080, Spanish string length accommodated. (ADR-075, ADR-076, ADR-074, ADR-078, ADR-128) |
| 2a.10 | **Print stylesheet** | `@media print` stylesheet for reader and passage pages. Remove navigation, footer, side panel. Full-width text at optimal reading width. English/Spanish: Merriweather at 11pt. Hindi: Noto Serif Devanagari at 12pt (scaled for optical equivalence), drop capitals omitted, 40–50 aksharas line length (ADR-080). Citation below each passage. Portal URL in small footer. Page breaks between chapters. No background colors. |
| 2a.11 | **Text-only mode — design system integration** | Foundation established in 1c.17 (footer toggle, `localStorage`, disables images/fonts/decorative). 2a extends: integrate into reader settings popover, apply Calm Technology design system styling, ensure toggle works consistently across all new 2a pages (Quiet Corner, About, Books, passage share). Verify text-only mode respects all component states added in 2a. (ADR-006) |
| 2a.12 | **Service Worker — enhanced caching** | Foundation established in 1c.18 (app shell caching, offline indicator). 2a extends: cache strategy for all new 2a pages, font caching for self-hosted WOFF2 files (2a.19), integration with text-only mode (skip font caching when text-only enabled). Verify offline indicator works across all navigation patterns. (ADR-006) |
| 2a.13 | **"Start Here" — Newcomer path** | Editorially curated starting points on homepage (below Today's Wisdom) and books page. Three entry paths: the curious reader, the person in need, the meditation seeker. Warm cream card, Merriweather Light, quiet and inviting. Content in `messages/en.json` (i18n-ready). **Per-locale cultural adaptation in Milestone 5b:** Entry paths are editorial content in locale files, not hardcoded. The three English archetypes (curious reader, person in need, meditation seeker) are Western spiritual archetypes. Milestone 5b cultural consultants should author locale-specific entry paths — e.g., Hindi locale may foreground the devotee (already committed, seeking deeper practice) and the family (communal engagement). Japanese locale may add the student (academic/comparative religion interest). |
| 2a.14 | **Quiet Corner audio cues** | Two discrete audio files: singing bowl strike at timer start (~15KB), gentle chime at timer end (~15KB). Web Audio API, fixed 15% volume. Static assets bundled in app shell. Not ambient loops — just two moments of sound marking the boundaries of contemplative pause. |
| 2a.15 | **Content integrity hashes** | SHA-256 per chapter computed at ingestion time, stored in `chapters.content_hash`. `/integrity` page listing all books and chapter hashes with verification instructions. API endpoint: `GET /api/v1/books/{slug}/integrity`. (ADR-039) |
| 2a.16 | **EXIF/XMP metadata on served images** | All portal-served images carry Copyright ("© Self-Realization Fellowship"), Source ("teachings.yogananda.org"), and Description metadata. Applied server-side during image processing. Baseline provenance layer. (ADR-063 Tier 1) |
| 2a.17 | **Language-aware URL conventions** | Implement the hybrid language routing design: locale path prefix on frontend pages (`/{locale}/books/...`, default English omits prefix), `language` query parameter on API routes (`/api/v1/search?language=hi`). `next-intl` middleware detects locale from URL, `Accept-Language` header, or stored preference. Theme slugs remain in English for URL stability; display names localized via `topic_translations`. Each system uses the pattern natural to its consumers — SEO-friendly pages, clean API contract. (ADR-027) |
| 2a.18 | **`/browse` — The Complete Index (initial)** | High-density text page listing all navigable content, organized by category. Milestone 2a version: books only (by editorial category, with chapter counts). Designed text-first — semantic HTML heading hierarchy, zero JavaScript, zero images, < 20KB. Auto-generated from database at build time (ISR). Cacheable by Service Worker as offline artifact. Ideal screen reader experience (heading-level navigation). ARIA label: "Browse all teachings — a complete index of the portal's contents." Linked from site footer ("Browse all teachings"). Grows automatically as content types are added in later arcs. (DES-047) |
| 2a.19 | **Self-hosted fonts** | Replace Google Fonts CDN with self-hosted WOFF2 files in `/public/fonts/`. Eliminates IP transmission to Google servers (German GDPR compliance, LG München I). Improves performance (no external DNS lookup). `@font-face` with `font-display: swap`. (ADR-099) |
| 2a.20 | **Privacy policy and legal pages** | `/privacy` page: human-readable privacy policy in contemplative voice — what data is collected, why, retention periods, sub-processors, data subject rights. `/legal` page: terms of use, copyright, content licensing. Linked from footer on every page. Record of Processing Activities (ROPA) document created. (ADR-099) |
| 2a.21 | **Testing infrastructure** | Vitest + React Testing Library for unit/integration tests. Playwright for E2E tests (core user flows: search, read, share, Quiet Corner). axe-core in CI for accessibility. Lighthouse CI for performance budgets. Neon branch-per-test-run isolation. (ADR-094) |
| 2a.22 | **Terraform infrastructure + Lambda + database backup** | `/terraform` directory with modules for Neon (project, database, pgvector, branch protection, compute config per ADR-124), Vercel (project, env vars), Sentry (project, DSN), Lambda (IAM roles, layers, VPC config), EventBridge Scheduler, and backup (S3 bucket + Lambda pg_dump via EventBridge Scheduler, nightly, 90-day retention). Neon Snapshots schedule configured (daily/weekly/monthly). Lambda infrastructure provisioned here — subsequent arcs add functions to already-working infrastructure. GitHub Actions pipeline calls CI-agnostic `/scripts/` (ADR-018): `terraform plan` on PR, `terraform apply` on merge. State in S3 + DynamoDB (ADR-016). `.env.example` for local development. Quarterly restore drill: test restore from random backup to Neon branch. OpenTelemetry export configured for database observability. (ADR-016, ADR-018, ADR-019, ADR-017, ADR-124) |
| 2a.23 | **Figma core screens** | Three Figma files: Home & Search, Reader & Content, Quiet & Utility. Design tokens exported to `tokens.json` → consumed by `tailwind.config.ts`. (ADR-096) |
| 2a.24 | **Storybook component library** | Storybook setup documenting all portal components. Design token visualization. Interactive component states. Foundation for Calm Technology design system. |
| 2a.25 | **KaiOS emulator in CI** | Add KaiOS browser emulator to the testing matrix. Critical flows (search, read chapter, navigate) must pass on feature phone browsers. (ADR-006) |
| 2a.26 | **OpenAPI specification** | Auto-generated `/api/v1/openapi.json` from route handler types. Machine-readable API documentation. Enables auto-generated client libraries and API explorers. (ADR-081) |
| 2a.27 | **Timestamp filtering on book endpoints** | `updated_since` and `created_since` query parameters on `GET /api/v1/books` and `GET /api/v1/books/[slug]/chapters`. Response includes `sync` metadata with `latest_timestamp` for incremental sync consumers (Zapier, Lambda, partner integrations). Builds on Arc 1 `updated_at` columns and triggers. (ADR-107) |

### Success Criteria

- All pages exist and are navigable: homepage, search, reader, books, book landing, Quiet Corner, about, passage share, browse
- Homepage has all sections: Today's Wisdom with cross-fade "Show me another", thematic doors, "Seeking..." entry points, YouTube videos
- The Quiet Corner displays an affirmation with a working gentle timer and chime
- About page shows Yogananda biography, line of gurus, "Go Deeper" links
- Passage sharing generates working OG preview cards
- Share menu offers: copy link, email passage, save as image, save as PDF
- Passage PDF generates clean A4 page with warm cream background, Merriweather type, lotus watermark, citation
- SEO structured data validates via Google's Rich Results Test
- All pages pass axe-core: zero critical or serious violations
- No hardcoded UI strings — all in `messages/en.json`
- Hindi and Spanish UI strings (`messages/hi.json`, `messages/es.json`) translated via Claude draft → human review and deployed to production
- Hindi UI renders at 20px / 1.9 line-height with Noto Serif Devanagari — no truncation, no layout overflow (ADR-080)
- Spanish UI strings accommodate ~20% length expansion — no truncation in nav, buttons, or labels
- Playwright visual snapshots pass for all three locales (en, hi, es)
- Spiritual terminology glossaries (`glossary-hi.json`, `glossary-es.json`) committed and referenced by translation script
- The portal's visual design is recognizably SRF (Merriweather type, gold accents, warm palette, lotus motif)
- The video section displays recent @YoganandaSRF uploads and categorized playlists without manual intervention
- Print stylesheet works cleanly for reader and passage pages
- Text-only mode (established in 1c.17) integrated into reader settings popover and consistent across all 2a pages
- Service Worker (established in 1c.18) enhanced with caching for all 2a pages and self-hosted fonts
- "Start Here" section appears on homepage and books page with three entry paths
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

- Opening moment — portal threshold: lotus SVG fade on first session visit (DES-007)

---

### Milestone 2b: Refine

**Goal:** Add the contemplative reader interactions that distinguish the portal from a standard web reader — dwell mode, keyboard navigation, bookmarks, typography refinements, and offline support.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 2b.1 | **"Dwell" passage contemplation mode** | Long-press (mobile, 500ms) or click hover-revealed dwell icon (desktop) on any paragraph dims surrounding text to 15% opacity, passage remains vivid, share/bookmark icons appear. `Escape` exits. Screen reader announcements on enter/exit (warm language per ADR-073). `prefers-reduced-motion`: instant transitions, dimming still occurs, haptic suppressed. Desktop: hover over paragraph for 1.5s reveals a small dwell activation icon at inline-start margin (12px circle, `--srf-gold` at 40% opacity). Self-revealing discovery: most evocative passage on first chapter visit has subtly warmer background as hint (DES-015); tooltip as fallback. Mobile: gentle 10ms haptic pulse confirms dwell activation. Dwell also updates Related Teachings side panel immediately. (DES-009, DES-015) |
| 2b.2 | **Keyboard-first reading navigation** | Single-key shortcuts: `j`/`k` paragraphs, `d` dwell, `b` bookmark, `r` related, `s` settings, `→`/`←` chapters, `t` table of contents, `/` search bar, `?` help overlay. Suppressed when input focused. `Space` for next chapter only at bottom of page. (DES-013) |
| 2b.3 | **Lotus bookmarks** | localStorage-based bookmarks. Lotus icon (SVG, `--srf-gold`) in reader header for chapter bookmarks and in dwell mode for passage bookmarks. `/bookmarks` page listing all bookmarked chapters and passages by book. No server interaction, no accounts, no tracking. Milestone 7a migration to server sync when accounts arrive. (ADR-066) |
| 2b.4 | **Reader typography refinements** | Drop capitals at chapter starts (Merriweather 700, `--srf-navy`, 3-line `::first-letter`), decorative opening quotation marks on displayed passages (Merriweather 700, 48px, `--srf-gold` at 40% opacity), chapter epigraph treatment (centered, Merriweather 300, muted, generous whitespace), CSS-only paper texture (inline SVG noise pattern), optical margin alignment (`hanging-punctuation` progressive enhancement), citation formatting with em dashes. (DES-008) |
| 2b.5 | **Reading time estimate + scroll position + reader settings** | Chapter reading time estimate below chapter title (~X min, disappears on scroll). Scroll position indicator (2px `--srf-gold` at 30% opacity, top of viewport — spatial awareness, not progress tracking). Consolidated reader settings popover: text size (A-/A/A+), color theme (auto/light/dark), line spacing (compact/normal/relaxed). All persisted in `localStorage`. No percentage, no countdown, no completion tracking. |
| 2b.6 | **Last-read chapter caching** | Service Worker caches the most recently read chapter HTML. If connectivity drops, the seeker can re-read that chapter offline. Graceful, not full offline support. (ADR-006) |
| 2b.7 | **Contextual Quiet Corner** | "Pause with this" icon in dwell mode. Clicking transitions the passage into a mini Quiet Corner: reader chrome fades, passage becomes the affirmation, timer options appear (1/5/15 min). Singing bowl at start, chime at end. On completion, passage offered for bookmarking. CSS mode (`data-mode="quiet"`), not a separate page. |
| 2b.8 | **Focus reading mode** | Optional "Focus" toggle in reader header. Reduces reader to: reading column + Next Chapter. Related Teachings panel, keyboard shortcut overlay, dwell icon, and bookmark icon suppressed. Stored in `localStorage`. Serves linear readers, seekers with cognitive needs, and small screens. (ADR-072) |
| 2b.9 | **Session closure moments** | Parting-word content blocks at natural session endpoints: below last chapter paragraph (above Next Chapter), bottom of search results, bottom of theme pages. Editorially curated pool of 10–20 short Yogananda passages. Styled in `--portal-text-muted`, Merriweather 300, centered. (DES-014) |
| 2b.10 | **Non-search journey polish** | Shared passage page (`/passage/[chunk-id]`) gets framing context and book invitation. External-arrival chapter header for Google traffic. "Show me another" sessionStorage-based repeat prevention. (ADR-067) |
| 2b.11 | **Prerender hints (Speculation Rules)** | `<script type="speculationrules">` on reader and navigation pages. Prerender next chapter from reader, chapter 1 from book landing, top search result from search page. Prefetch previous chapter and adjacent navigation targets. Progressive enhancement — ignored by unsupported browsers. Single prerender per page. `data-prerender` attribute on most-likely navigation link, `data-prefetch` on next 2–3 targets. (ADR-081 §13) |
| 2b.12 | **HyDE search enhancement** | Implement Hypothetical Document Embedding (ADR-119): Claude generates a hypothetical passage answering the query in Yogananda's register, embedded via Voyage asymmetric encoding (document input type), searched in document-space. Evaluate lift on literary/spiritual queries vs. standard vector search. Feature-flagged for A/B evaluation against golden retrieval set. |
| 2b.13 | **Cohere Rerank integration** | Replace Claude Haiku passage ranking with Cohere Rerank 3.5 cross-encoder (ADR-119). Multilingual native. Benchmark precision against Claude Haiku ranking using golden retrieval set. Graceful degradation: falls back to RRF scores if Cohere is unavailable. |
| 2b.14 | **Vercel KV suggestion cache** (if migration trigger reached) | Tier C of ADR-120: Vercel KV (Upstash Redis) for sub-10ms server-side prefix search. Language-namespaced sorted sets. Activated only when concrete trigger thresholds are sustained for 7 days: suggestion p95 > 30ms, or dictionary > 50K entries/language, or learned queries need real-time freshness. Static JSON (Tier A) + pg_trgm (Tier B) continue as foundation. May never be needed — static JSON achieves < 10ms globally for the portal's dictionary size. |
| 2b.15 | **Presentation mode** | "Present" button in reader header. Enlarges text to 24px+, hides all chrome, swipe/arrow-key chapter navigation only. Warm cream fills viewport. For group reading, satsang, study circles, family devotions. A CSS mode (`data-mode="present"`), not a separate feature. Pulled from Arc 4 because communal reading is the primary mode of engagement with spiritual texts in Indian, African, and Latin American cultures — deferring it reproduced a Western individual-reading default as the baseline for ~7 arcs. (ADR-006) |
| 2b.16 | **Low-bandwidth detection — extended adaptation** | Foundation established in 1c.19 (2G/slow-2G banner with text-only mode suggestion). 2b extends: adaptive image quality reduction on slow connections (serve lower-resolution book covers, compress OG images), adaptive debounce extension on search suggestions, `localStorage` persistence upgrade (1c uses `sessionStorage`). Complements 1c.19 — seekers already get the core protection from first deployment. (ADR-006) |

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
- Low-bandwidth detection (established in 1c.19) extended with adaptive image quality and `localStorage` persistence upgrade (ADR-006)

**Additional deliverables (stretch goals — not in the numbered deliverable table but expected by arc gate):**
- Calm Technology design system as shared npm package
- Formal WCAG 2.1 AA third-party audit with real-user assistive technology testing
- Reading mode: adjustable font, sepia/dark mode, high-contrast (`prefers-color-scheme`, `prefers-contrast`)
- Circadian color temperature and "Breath Between Chapters" transitions (DES-011, DES-012)
- Progressive Web App: offline book reading, home screen installable (ADR-012)
- Responsive design polish: tablet layout, print stylesheet, touch-friendly (DES-049)
- Visual regression testing via Playwright screenshots

**Additional success criteria:** WCAG 2.1 AA audit passes with zero critical violations. PWA installs on mobile and serves cached chapters offline. `prefers-reduced-motion` disables all animations.

---

## Arc 3: Wisdom — Expanding Understanding

### Milestone 3a: Corpus

**Goal:** Ingest high-impact books to reach critical mass of quotable, thematically diverse content. Expand cross-book search and content pools. This milestone can proceed independently of SRF editorial staffing decisions.

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
| 3a.1 | **Ingest first-wave books** | *Where There Is Light*, *Sayings of Paramahansa Yogananda*, *Scientific Healing Affirmations*. Short, topically organized, low-complexity. Claude classifies passage accessibility level (universal/accessible/deep) at ingestion time — spot-checked by reviewer. (ADR-005 E3) |
| 3a.2 | **Expand Today's Wisdom pool** | Populate `daily_passages` from *Sayings* (entire book is standalone quotes) and *Where There Is Light*. Add optional seasonal affinity tags and circadian `time_affinity` tags (dawn/morning/afternoon/evening/night). Claude classifies tone (consoling/joyful/challenging/contemplative/practical) per passage — selection algorithm ensures tonal variety across the week. Default to accessibility level 1–2 passages for newcomer-friendly homepage. Circadian weighting ensures 2 AM visitors encounter consolation, not productivity. (ADR-005 E8, E3) |
| 3a.3 | **Expand Quiet Corner pool** | Populate `affirmations` from *Scientific Healing Affirmations* and *Metaphysical Meditations*. |
| 3a.4 | **Cross-book search** | Search spans all books by default. Optional book filter. Results show which books address a topic. |
| 3a.5 | **Expanded book catalog** | Books (`/books`) and book landing pages (`/books/[slug]`) established in Milestone 2a now display the full multi-book catalog. Book cards show cross-book search availability. Sort/filter by theme or publication year. |
| 3a.6 | **Deploy batch Lambda functions** | Lambda infrastructure already provisioned in Milestone 2a.22. Deploy book ingestion and chunk relation computation Lambda functions (`/lambda/handlers/`). Replace manual scripts that would exceed Vercel timeouts. CLI wrappers in `/scripts/` for local development. (ADR-016, ADR-017) |
| 3a.7 | **Passage resonance instrumentation** | Anonymous, aggregated counters: share count, dwell count, relation traversal count per passage. Skip count per daily passage. Simple integers, no timestamps, no session correlation. Rate-limited (1 increment per IP per hour). Editorial "Resonance" view in admin portal showing top-resonating passages. (ADR-052) |
| 3a.8 | **"What's New in Books" indicator** | Subtle `--srf-gold` dot (6px) beside "Books" in navigation when new books exist since last Books visit. On the Books page, new books show a "New" label. `localStorage`-based, disappears after seeker visits Books. No tracking. |
| 3a.9 | **Search suggestions — multi-book + bridge + curated** | Expand suggestion index across all ingested books — each ingestion updates `suggestion_dictionary` and triggers static JSON rebuild (ADR-120 Tier A). Activate bridge-powered suggestions: when prefix matches a `spiritual-terms.json` key, response includes Yogananda's vocabulary for that concept (e.g., "mindful" → "concentration, one-pointed attention"). Bridge hints continue into search results page. Add theme names from `teaching_topics` to suggestion index. Expand curated query suggestions editorially. `/lib/data/curated-queries.json` maintained by SRF-aware editors. (ADR-049, ADR-120) |
| 3a.10 | **`/browse` grows — themes, glossary, Quiet textures** | Auto-generated `/browse` page expands to include active teaching topics (all categories), glossary terms (A–Z), and Quiet Corner texture categories. Still zero editorial overhead — all sections generated from database queries at build time. (DES-047) |

### Success Criteria

- First-wave books ingested with correct chunking and citations
- Cross-book search returns results from multiple books for thematic queries
- Today's Wisdom draws from expanded pool with tonal variety
- Quiet Corner draws from *Scientific Healing Affirmations* content
- Lambda batch functions deploy and execute successfully
- Search suggestions include multi-book vocabulary and bridge terms

---

### Milestone 3b: Editorial

**Goal:** Establish editorial operations, build the theme navigation system, and deliver the staff tooling that transforms the portal from a technical project into a running content operation.

**Feature-flag activation pattern (ADR-123):** Milestone 3b infrastructure ships on schedule regardless of SRF editorial staffing status. All editorial queues, review workflows, and curation tools are built and deployed behind feature flags. When SRF identifies editorial staff, queues activate via environment configuration — no code changes, no redeployment. The AE team can serve as lightweight interim editors until monastics are assigned. This decouples the build timeline from organizational readiness. (See Arc Sizing Analysis.)

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 3b.1 | **Teaching topic tagging pipeline** | Semi-automated: embed theme descriptions → cosine similarity against all chunks → candidates above threshold get `tagged_by='auto'` → optional Claude classification for ambiguous cases → mandatory human review → `tagged_by='reviewed'`. Three-state provenance: `manual`, `auto`, `reviewed`. Only `manual` and `reviewed` tags served to users. Initial pass: six quality themes (Peace, Courage, Healing, Joy, Purpose, Love) plus **Grief & Loss as the first situation theme** — elevated as a primary empathic entry point because grief is arguably the most common reason someone turns to spiritual literature. Add remaining situation themes (Relationships, Parenting, Work, etc.) and practice themes (Meditation, Concentration, Affirmation, etc.) incrementally — editorial judgment decides when a topic has enough depth to publish (no fixed minimum count). (ADR-032, ADR-033) |
| 3b.2 | **Doors of Entry + Explore all themes** | Activate `/themes/[slug]` pages with curated passages from across all books. Each visit shows a different random selection. Homepage shows six quality-theme doors; "Explore all themes →" links to `/themes` index page with sections for quality, situation, and practice themes. Replace Milestone 2a placeholder doors with live theme navigation. Person, principle, and scripture categories added in Milestone 3c when multi-book content enables meaningful coverage. (ADR-032, ADR-033) |
| 3b.3 | **Calendar-aware content surfacing** | `calendar_events` and `calendar_event_passages` tables. Editorially curated date-to-passage associations for Yogananda's life events, Hindu/Christian calendar, and universal observances. Homepage "Today's Wisdom" draws from the calendar pool when a relevant date falls. (DES-028) |
| 3b.4 | **The Quiet Index** | Combine E3 (accessibility rating) and E8 (tone classification) into browsable routes: `/quiet/contemplative`, `/quiet/practical`, `/quiet/devotional`, `/quiet/philosophical`, `/quiet/narrative`. Extends the Quiet Corner with texture-based passage browsing. (DES-028) |
| 3b.5a | **Editorial review portal — foundation and theme review** | Auth0-protected `/admin` route group built with the portal's calm design system. Auth0 roles: `editor`, `reviewer`. Editorial home screen with role-filtered summary. Theme tag review queue (keyboard-driven: `a` approve, `r` reject, `→` next). Ingestion QA review (flagged passages with Claude suggestions). Content preview ("preview as seeker" for theme pages). Session continuity (resume where you left off). (ADR-082) |
| 3b.5b | **Editorial review portal — curation workflows** | Daily passage curation with 7-day lookahead and tone badge display. Calendar event ↔ passage association management. Tone/accessibility spot-check workflow. Content preview for daily passages. Email digest for daily review notifications via scheduled serverless function. (ADR-082) |
| 3b.6 | **Early impact view** | Lightweight, DELTA-compliant mission reporting in the admin portal: countries reached (Vercel Analytics geo data), anonymized search themes ("What is humanity seeking?"), content served (passages, books), languages available. Not engagement tracking — mission reporting. Answers: "Are the teachings reaching the world?" Visible to `editor`, `reviewer`, and `leadership` roles. (ADR-053) |
| 3b.7 | **Living Glossary** | `/glossary` page: browsable, searchable spiritual terminology. Each entry: term, brief definition (editorial), Yogananda's own explanation (verbatim passage with citation), related themes. Inline reader highlighting (opt-in toggle in reader settings): dotted underline on recognized terms, tooltip with definition. Seeded from `spiritual-terms.json`, enriched per-book via ADR-051 lifecycle. (ADR-038) |
| 3b.8 | **Practice bridge after search** | Contextual practice signpost below search results when intent classifier detects practice-oriented queries (meditation, healing, Kriya). Links to SRF Lessons, Quiet Corner, center locator. Editorial text in `messages/en.json`. Signpost, not funnel — no click tracking. |
| 3b.9 | **Seeker feedback mechanism** | "Report a citation error" link on every passage. "I didn't find what I needed" option on empty/sparse search results. `/feedback` page linked from footer. `seeker_feedback` table. All DELTA-compliant — no user identifiers stored. Feedback review queue added to editorial portal. (ADR-084) |
| 3b.10 | **`/guide` — The Spiritual Guide** | Editorially curated recommendation page organized by seeker context: "If you are new to Yogananda's teachings," "If you are exploring meditation," "If you are dealing with loss," etc. 20–30 pathways, each with 2–3 specific recommendations and brief editorial framing (never paraphrasing Yogananda). Three-state provenance: Claude drafts initial text (`auto`), human review required (`reviewed`/`manual`). Linked from footer ("Where to begin") and "Start Here" newcomer path. Cultural adaptation deferred to Milestone 5b. (DES-047, ADR-074) |
| 3b.11 | **Operational playbook** | `/docs/operational/playbook.md` documenting procedural knowledge: how to add a new book (pre-ingestion checklist through post-publication verification), how to handle a citation error, how to create a curation brief, how to onboard a new staff member to `/admin`. Written alongside the editorial portal it documents. Updated as new workflows are added in subsequent arcs. Referenced from the admin portal's help section. |
| 3b.12 | **Queue health monitoring** | Editorial home screen includes queue health indicators: oldest unreviewed item per queue, items exceeding age thresholds (48 hours for citation errors, 7 days for standard items), queue depth trend (14-day rolling window). Email digest highlights overdue items. Portal coordinator receives separate notification if any queue exceeds 2× its age threshold. `/lib/services/queue-health.ts`. |
| 3b.13 | **Portal updates page + AI draft pipeline** | `/updates` page ("The Library Notice Board") with `portal_updates` table. AI drafts seeker-facing release notes from deployment metadata in portal voice (ADR-074); human review mandatory before publication. `updates` review queue in editorial portal. Retrospective entries for Milestones 1a–3b. Footer link: "What's new in the portal." (ADR-105, DES-051) |
| 3b.14 | **Graph intelligence batch pipeline** | Python + NetworkX/igraph batch job loads full graph from Postgres tables (entity_registry, extracted_relationships, concept_relations). Runs PageRank, community detection, and betweenness centrality. Writes results to centrality_score, community_id, bridge_score columns on entity and chunk rows. Scheduled as Lambda or Vercel cron (nightly). Community detection outputs inform theme tagging proposals. (ADR-117, DES-054) |
| 3b.15 | **Three-path retrieval activation** | Activate Path C (graph-augmented retrieval) in the search pipeline: entity recognition in queries via entity_registry → SQL traversal across extracted_relationships → pgvector similarity ranking → merge with Path A (vector) and Path B (BM25) via RRF. Search pipeline evolves from two-path to three-path. Monitor retrieval quality: Path C must improve relevance on entity-rich queries without degrading keyword queries. (ADR-117, ADR-119, DES-003) |

### Key Challenges

- **Theme tagging quality:** Semi-automated tagging (embeddings) must be validated by human reviewers. A bad theme assignment (a passage about death tagged as "Joy") would undermine trust. Only `manual` and `reviewed` tags are served to users — never unreviewed `auto` tags. (ADR-032)
- **Theme taxonomy expansion:** Multi-category taxonomy: six quality themes on the homepage (stable); situation, practice, person, principle, scripture, and yoga_path categories added incrementally. No fixed minimum passage count — editorial judgment decides when a topic has enough depth to publish. (ADR-032, ADR-033)
- **Editorial staffing gate:** Milestone 3b requires SRF to have identified a portal coordinator, content editor, and theological reviewer. The editorial review portal provides tooling — the organizational question of *who* uses it requires SRF input.

### Success Criteria

- Teaching topic tagging pipeline produces accurate theme assignments validated by human review
- Doors of Entry pages show curated passages from multiple books, refreshing on each visit
- Editorial review portal operational with Auth0 authentication and role-filtered views
- Theme tag review queue supports keyboard-driven workflow (approve/reject/next)
- Daily passage curation 7-day lookahead functional
- Queue health indicators visible on editorial home screen
- `/glossary` page displays at least 50 terms with definitions and linked passages
- `/guide` page offers 20+ curated pathways with editorial framing
- `/updates` page displays retrospective entries for Milestones 1a–3b, reviewed and published by portal coordinator

---

### Milestone 3c: Intelligence

**Goal:** Launch the Related Teachings system — pre-computed chunk relations, reader side panel, "Continue the Thread" end-of-chapter suggestions, and graph traversal across the library. This is the feature that makes the portal irreplaceable: no physical book, PDF, or ebook can surface cross-book connections while you read. (ADR-050)

**Parallel workstream note:** Chunk relation computation (3c.1), the related content API (3c.2), and the quality evaluation suite (3c.5) are purely algorithmic — they depend on the multi-book corpus (Milestone 3a), not on Milestone 3b's editorial portal. These deliverables can proceed in parallel with Milestone 3b. Human quality review of relations (3c.5) is validated via the test suite; editorial portal integration enhances but does not gate the computation. (ADR-123)

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 3c.1 | **Chunk relation computation** | Batch job to compute `chunk_relations` for all ingested books. Incremental mode for new books, full mode for embedding model changes. Excludes same-chapter adjacent paragraphs. Stores top 30 per chunk. For top 10 cross-book relations per chunk, Claude classifies the relation type (`same_topic`, `develops_further`, `personal_story`, `practical`) — enables contextual labels like "Yogananda explores this idea at greater length in..." in the side panel. Spot-checked by reviewer. (ADR-050, ADR-005 E6) |
| 3c.2 | **Related content API** | `/api/v1/passages/[id]/related` (per-paragraph, on-demand tier) and `/api/v1/books/[slug]/chapters/[number]/relations` (batch prefetch — all paragraph relations for an entire chapter in one response, ~30–50KB). `/api/v1/books/[slug]/chapters/[number]/thread` (chapter-level aggregation for "Continue the Thread"). All chapter sub-resources consolidated under `/books/[slug]/chapters/[number]/` (ADR-109). Filter support: by book, language, theme, content type. Realtime vector fallback when pre-computed results are sparse. **Batch prefetch API is a core Milestone 3c deliverable, not deferred as optimization** — it enables the reading session (3c.10) and instant side panel updates. (ADR-050) |
| 3c.3 | **Improved reader with Related Teachings** | Related Teachings side panel powered by pre-computed `chunk_relations`. Settled paragraph model: Intersection Observer with focus zone root margin, prominence scoring, 1.2s debounce — side panel updates quietly as reader settles. Source indication in side panel header ("Related to: 'My body became...'"). Dwell mode as manual override (immediate update, no debounce). Two-axis progressive enhancement: screen width determines presentation (side panel ≥ 1024px, pill + bottom sheet < 1024px); data budget determines loading (batch prefetch / on-demand / none). "Continue the Thread" in side panel below per-paragraph relations (not inline in reading column). Next Chapter is the primary end-of-chapter invitation. Graph traversal navigation branded as **"Following the Thread"** in user-facing UI — the portal's most distinctive feature, named to communicate its contemplative nature. (ADR-050) |
| 3c.4 | **Editorial cross-references** | `chunk_references` table for human-curated cross-references (explicit mentions like "As my guru Sri Yukteswar taught..." → link to that passage). Supplements automatic embedding-based relations. |
| 3c.5 | **Related content quality evaluation** | Test suite of ~50 representative paragraphs with human-judged expected relations. Validates thematic relevance, cross-book diversity, no false friends. Regression gate for content re-ingestion and embedding model changes. |
| 3c.6 | **Ephemeral reading highlights** | Double-tap (mobile) / double-click (desktop) on any paragraph adds a subtle gold left-border highlight. Session-only — in-memory, not stored. At chapter end, if highlights exist, a gentle prompt offers to convert them to lotus bookmarks. Keyboard shortcut: `h`. No storage, no analytics. |
| 3c.7 | **Editorial reading threads** | `editorial_threads` and `thread_passages` tables. Curated multi-book reading paths: human-selected passages sequenced to trace a spiritual theme as a coherent progression. `/threads` index and `/threads/[slug]` reading experience. Optional editorial transition notes between passages. `is_published` human review gate. (DES-026) |
| 3c.8 | **Reverse bibliography** | `external_references` and `chunk_external_references` tables. Claude extracts external source references (Bhagavad Gita, Bible, Patanjali, Kabir, Einstein, etc.) from each chunk at ingestion time. `/references` index and `/references/[slug]` pages showing every passage where Yogananda engages with that source. Three-state `tagged_by` provenance. (DES-027) |
| 3c.9 | **Exploration theme categories** | Activate `person`, `principle`, and `scripture` theme categories. Seed themes: Christ, Krishna, Lahiri Mahasaya, Sri Yukteswar, Patanjali, Divine Mother (person); 10 Yama/Niyama principles (principle); Yoga Sutras, Bhagavad Gita, Bible, Rubaiyat (scripture). Same tagging pipeline as quality/situation themes. `/themes` page gains new sections. (ADR-033) |
| 3c.10 | **Reading session — proactive chapter caching** | Service Worker detects sequential chapter reading (2+ chapters from same book). Proactively caches next 2 chapters (HTML + relations data for batch tier). LRU eviction: current + 2 ahead + 2 behind. Offline chapter transitions serve from cache with offline banner. Uncached chapters show gentle redirect to nearest cached chapter. No reading history stored — ephemeral SW state only. |
| 3c.11 | **Calendar reading journey schema** | Extend `editorial_threads` with journey columns: `journey_type` (evergreen/seasonal/annual), `journey_duration_days`, `journey_start_month`, `journey_start_day`. Foundation for time-bound reading experiences delivered via daily email in Milestone 5a. (DES-045) |
| 3c.12 | **Spiritual Figures — monastics, gurus, and historical figures as entities** | `people` table with biographical metadata (name, slug, role, era, description, image) and monastic/lineage extensions: `person_type` enum (`spiritual_figure`, `guru_lineage`, `monastic`, `historical`), `honorific`, `is_living`. `person_relations` extended with `start_year`, `end_year`, `description`, `display_order` for temporal relationships. New relation types: `succeeded_by`, `preceded_by`, `mentored_by`, `edited_works_of`, `collaborated_with`. `chunk_people` junction table linking passages to persons mentioned or quoted. Person pages at `/people/[slug]` showing biography, In Memoriam presentation (birth–passing years for applicable figures), all referencing passages, and cross-links to themes and external references. `/people` index gains "Lineage of SRF Presidents" vertical timeline section using `succeeded_by` relations with service dates. `/api/v1/people/lineage` endpoint for presidential succession. Seed entities: Sri Yukteswar, Lahiri Mahasaya, Krishna, Christ, Divine Mother, Babaji, Anandamayi Ma, plus presidential succession entries (Yogananda, Rajarsi Janakananda, Daya Mata, Mrinalini Mata, Brother Chidananda) with service periods. Same three-state tagging pipeline as themes (auto → reviewed → manual). Linked from exploration theme categories (person type). (ADR-036, ADR-037) |
| 3c.13 | **`/browse` grows — people, references, threads** | Auto-generated `/browse` page expands to include Spiritual Figures entries, External References (reverse bibliography), and Editorial Reading Threads. All auto-generated from database. `/browse` now covers the full content space and serves as the text-mode alternative to the Knowledge Graph (ADR-061). Bidirectional link between `/browse` and `/explore`. (DES-047) |

### Key Challenges

- **Related content quality:** Pre-computed chunk relations must be thematically relevant, cross-book diverse, and free of "false friends" (superficially similar text with unrelated meaning). The quality test suite (3c.5) is the regression gate.
- **Relation computation at scale:** As the corpus grows from ~2K chunks (Arc 1) to ~50K (all books), incremental relation updates must remain efficient. Each new book triggers O(N_new × N_existing) comparisons — manageable with vectorized computation but must be monitored.

---

### Milestone 3d: Complete

**Goal:** Ingest the remaining book waves to complete the full Yogananda library. Add production observability.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 3d.1 | **Ingest second- and third-wave books** | Collected talks (*Man's Eternal Quest*, *The Divine Romance*) and shorter works (*How You Can Talk With God*, *Metaphysical Meditations*, *Journey to Self-Realization*). Standard chunking. Incremental chunk relation computation for each new book. |
| 3d.2 | **Verse-aware chunking** | Adapt chunking strategy for verse-by-verse commentary structure. Required before fourth-wave ingestion. |
| 3d.3 | **Ingest fourth-wave books** | *The Second Coming of Christ* (2 vols), *God Talks With Arjuna* (2 vols), *Wine of the Mystic*. |
| 3d.4 | **Search analytics + "What Is Humanity Seeking?" public dashboard** | Staff dashboard (PRO-016) showing anonymized query trends. Nightly Lambda aggregation job populates `search_theme_aggregates` table — search queries classified by theme, geography (country-level), and time period. Minimum aggregation threshold: suppress theme + country combinations with < 10 queries. **Public-facing `/seeking` dashboard:** contemplative visualization of top themes, geographic view (warm-toned world map), seasonal rhythm, and common questions. Warm tones, Merriweather typography — not a SaaS dashboard. Linked from footer and About page. **Note:** "What Is Humanity Seeking?" is also a strategic communications asset for the philanthropist's foundation (ADR-090) — communications planning (standalone subdomain, annual report, media syndication) may begin before this dashboard ships. (ADR-053, ADR-090) |
| 3d.5 | **Amplitude analytics (DELTA-compliant)** | Amplitude configured with explicit event allowlist. No user identification, no session tracking, no autocapture. Events: `page_viewed` (with `requested_language` for unmet language demand), `passage_served`, `share_link_generated`, `center_locator_clicked`, `search_performed` (with `zero_results` flag). See DESIGN.md § DES-037 for full property schema and Standing Operational Metrics. (ADR-095) |
| 3d.6 | **New Relic APM integration** | New Relic agent for API route performance, database query timing, Claude API call monitoring. Synthetic uptime checks on key endpoints. (ADR-095) |
| 3d.7 | **Edge latency audit + standing geographic monitors** | Measure portal latency from Global South regions (India, Brazil, Nigeria) via New Relic Synthetics or WebPageTest. Verify Vercel serves from nearby edge PoPs. Validate per-region Core Web Vitals. Remediate if FCP exceeds 1.5s on 3G from target regions. **Standing monitors:** After initial audit, convert New Relic Synthetic checks into permanent monitors running from target regions on a recurring schedule (e.g., every 15 minutes from Mumbai, São Paulo, Lagos). Alert if FCP degrades past 1.5s sustained over 24 hours. Geographic performance is a direct measure of the Global-First principle (ADR-006) — a dependency update or infrastructure change that degrades Bihar but not Los Angeles should be caught immediately, not at the next quarterly review. |
| 3d.8 | **Side-by-side commentary view** | Split-pane reader for verse-commentary books (*Second Coming of Christ*, *God Talks With Arjuna*, *Wine of the Mystic*). Wide screens: scripture verse pinned left, commentary scrolls right. Narrow screens: verse as highlighted block above commentary. Verse navigation: up/down arrows cycle through verses. Depends on verse-aware chunking (3d.2). |
| 3d.9 | **Scripture-in-Dialogue** | For Yogananda's scriptural commentaries (*God Talks with Arjuna*, *The Second Coming of Christ*): verse-level Scripture entities in entity_registry, CROSS_TRADITION_EQUIVALENT relationships in extracted_relationships between Gita and Gospel verses where Yogananda draws explicit parallels. Dual-commentary navigation: original verse pinned alongside Yogananda's interpretation. Extends the side-by-side commentary view (3d.8) with graph-powered cross-tradition linking. (ADR-117, DES-056) |
| 3d.10 | **Living Commentary** | Enrichment pipeline extracts internal cross-references from Yogananda's commentaries ("as I explained in Chapter X"). Cross-references become navigable inline reference cards: verbatim preview of the referenced passage without leaving the current reading position. Hypertext-ified cross-references transform dense commentaries into a connected web of teachings. (ADR-115, ADR-050, DES-056) |
| 3d.11 | **Knowledge graph visualization** | Interactive visual map of the teaching corpus at `/explore`. Milestone 3d nodes: books, passages, themes, persons, scriptures. Edges: chunk relations, theme memberships, external references. Client-side rendering (`d3-force` with Canvas) from pre-computed graph JSON (nightly Lambda, served from S3). **Extensible JSON schema** with `schema_version`, `node_types`, and `edge_types` arrays — designed to accommodate magazine, video, audio, and image nodes in later arcs without visualization code changes (ADR-062). **Lineage filter mode:** shows only person nodes connected by `guru_of`, `disciple_of`, `succeeded_by`, `preceded_by` edges, rendered as a directed vertical layout — visualizes both the spiritual lineage and presidential succession (ADR-037). Warm tones, contemplative animation, `prefers-reduced-motion` static layout. ~50-80KB JS, loaded only on `/explore`. Graph Data API: `GET /api/v1/graph`, `/graph/subgraph`, `/graph/cluster`, `/graph.json`. Linked from Books and themes pages. (ADR-061, ADR-062, ADR-037) |

### Key Challenges

- **Verse-aware chunking** for the scriptural commentaries (fourth wave) requires a different strategy than narrative or collected-talk books. The verse-commentary structure needs special handling to preserve the verse → commentary relationship in search results and the reader.

### Success Criteria

- All published Yogananda books ingested and searchable — search quality evaluation passes (≥ 80%) across the full corpus
- Side-by-side commentary view renders verse-commentary books correctly on both wide and narrow screens
- Scripture-in-Dialogue cross-tradition linking surfaces explicit parallels Yogananda draws between Gita and Gospel verses
- `/seeking` public dashboard displays anonymized search themes, geographic view, and seasonal rhythm
- Amplitude events fire on the allowlist only — no autocapture, no user identification, no session tracking
- New Relic APM reports API route performance, database query timing, and Claude API call latency
- Standing geographic monitors confirm FCP < 1.5s from Mumbai, São Paulo, and Lagos
- `/explore` knowledge graph visualization renders books, passages, themes, persons, and scriptures with navigable edges

---

## Arc 4: Service — Tools for Devotion

**Goal:** Empower monastics, center leaders, and study circles with export and preparation tools.

Transform portal content into formats for group study, satsangs, and talks. The Study Workspace becomes a central tool for anyone engaging deeply with the teachings — collecting passages, assembling teaching arcs, and exporting for use. Magazine integration brings monastic articles into the search pipeline.

- Chapter and book PDF downloads via `@react-pdf/renderer`, served from S3 (ADR-025)
- Study guide view with key themes, notable passages, and cross-book connections per chapter
- Study Workspace: theme-driven passage discovery, collection, teaching arc assembly, all in localStorage (ADR-083)
- Study circle sharing: shareable URLs with key passages and discussion prompts (DES-046)
- Magazine integration: `magazine_issues/articles/chunks` tables, full search pipeline (ADR-040)
- Shared-link collections: shareable collection URLs, community disclaimer, foundation for Milestone 7b (ADR-086)
- Knowledge graph evolution: magazine nodes, ontology concepts, Passage Constellation mode (ADR-062, ADR-043)

- Contentful Custom Apps: sidebar panels for theme tags, thread preview, calendar associations (ADR-082)
- Admin editorial workflow bridging Contentful authoring and portal review queues (ADR-082)
- Multi-environment activation: `scripts/create-env.sh` and `scripts/destroy-env.sh` for disposable environments. Branch=environment principle — one Neon project (branches), one Vercel project (branch deployments), one Sentry project (environment tags). Promotion pipeline with manual gates (ADR-016, ADR-020)

**Success criteria:** PDFs render with correct typography and citations. Study Workspace allows passage collection, sequencing, and export without authentication. Magazine articles appear in search results alongside book passages. CI/CD deploys to all three environments (dev/staging/prod) with manual production gate. Terraform plan shows zero drift. Contentful Custom Apps surface review status in editor sidebar.

---

## Arc 5: Reach — Every Seeker, Everywhere

### Milestone 5a: Distribution

**Goal:** Extend reach beyond direct visitors through daily email, social media, messaging channels, and webhooks.

The portal becomes a distribution platform — daily email, social media quote images, WhatsApp, RSS, and calendar reading journeys bring teachings to seekers where they already are. Graph intelligence features leverage the Postgres-native graph batch pipeline (ADR-117) to surface deep connections across the lineage. Events and Sacred Places sections signpost toward SRF community.

- Daily email: non-personalized, double opt-in, no tracking pixels (ADR-091)
- Social media asset generation: quote images in multiple aspect ratios with admin review (ADR-092)
- Events section and Sacred Places (SRF/YSS properties) with Autobiography cross-references (ADR-069)
- WhatsApp Business API integration for spiritual search and Daily Wisdom (ADR-026)
- RSS feeds: daily passage, new content, audio, portal updates (ADR-081, ADR-105)
- Calendar reading journeys: "40 Days with Yogananda," seasonal journeys (DES-045)
- Outbound webhook event system with HMAC-SHA256 signatures (ADR-106, DES-052)
- Graph intelligence: Lineage Voice Comparator, Evolution of a Teaching, Passage Genealogy, Semantic Drift Detection (ADR-117, ADR-115, DES-056)
- Concept/Word Graph full construction with cross-tradition extraction (DES-055)

**Success criteria:** Daily email delivers to 100% of confirmed subscribers. WhatsApp bot returns relevant passages within 5 seconds.

- Sacred Places expansion: biographical sites, Street View links (ADR-069, ADR-070)
- Regional distribution: Neon read replicas in EU and Asia-Pacific, S3 cross-region replication (ADR-021). Key challenge: regional Neon read replicas require connection routing logic.

---

### Milestone 5b: Languages

**Goal:** Serve content and search in the remaining 7 core languages (Tiers 2–3), activating Milestone 2a's i18n infrastructure. Hindi and Spanish (Tier 1) are already live from Arc 1 — both content and UI chrome. (ADR-075, ADR-076, ADR-077, ADR-128)

The core language set (ADR-077) defines 10 languages ordered by reachable population (ADR-128). **Tier 1 (Hindi, Spanish) fully activated in Arc 1** — trilingual content (Milestone 1a) and trilingual UI chrome (Milestone 2a). This milestone activates Tier 2 (Portuguese, Bengali) and Tier 3 (German, Japanese, French, Italian, Thai). Languages ship independently as they clear the readiness gate: *Autobiography* ingested + UI strings translated + human reviewer confirmed + per-language search quality evaluation passes. Per-language search quality evaluation ensures no language goes live with degraded retrieval. YSS co-equal design stakeholder participation for Hindi/Bengali cultural adaptation. SRF/YSS Thailand community input for Thai locale. The impact dashboard provides leadership visibility into global reach and unmet demand.

**Note (ADR-128):** This milestone is a candidate for reordering — the reachable population metric suggests remaining languages should ship before reader refinement (current 2b) and before study tools (current Arc 4). The full milestone reordering across arcs is pending. See ADR-128 § Consequences and ROADMAP.md § Arc Philosophy for the reordering principle.

- AI-assisted UI translations for remaining 7 languages with mandatory human review per locale (ADR-078) — same workflow proven in Milestone 2a for Hindi/Spanish
- Localized book content ingestion with content availability matrix
- Per-language search: pg_search BM25 indexes with ICU tokenization (Jieba for zh, Lindera for ja), multilingual embedding benchmarking (ADR-047, ADR-114)
- English fallback passages clearly marked `[EN]`; "Read in English →" links
- Cross-language passage alignment via `canonical_chunk_id`
- Per-language presentation adaptations: non-Latin fonts, CJK line-height, Thai word-boundary handling, cultural "Seeking..." entry points
- Translation review UI with side-by-side English source and AI draft (ADR-082, ADR-078)
- Impact dashboard at `/admin/impact`: countries, content growth, "What is humanity seeking?" (ADR-090)
- Per-language search suggestions for remaining 7 languages with transliteration support; CJK tokenization strategies for Japanese; Thai word-boundary handling (ADR-049). Hindi/Spanish suggestion indices already live from Arc 1.

**Success criteria:** At least 3 additional languages (Tier 2–3) live with ≥ 80% search quality on 15–20 test queries per language. English fallback passages clearly marked `[EN]`. Per-language homepage payload < 50KB including font subsetting. (Hindi and Spanish already live from Arc 1.)

---

## Arc 6: Media — All Paths to Truth

**Goal:** Cross-media intelligence across video, audio, and images in one unified arc.

The portal becomes a true multimedia platform. Video transcription (YouTube → Whisper) and audio ingestion create searchable, time-synced text for all recordings. Cross-media search interleaves book passages, video segments, and audio clips ranked by unified RRF. The unified content hub (`content_items` + `content_relations`) replaces per-media relation tables. YSS organizational branding activates for Hindi/Bengali locales. The Knowledge Graph reaches 30,000–50,000 nodes across all five content types. Basic YouTube video display (RSS + API) is delivered in Milestone 2a; this arc adds transcription, audio, images, and cross-media intelligence.

- Platform-agnostic video catalog with speaker diarization and content authority hierarchy (ADR-056)
- YouTube transcript ingestion via Whisper with time-synced playback (ADR-055)
- Audio: S3 ingestion, Whisper transcription, browse/player with synchronized transcript (ADR-057)
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

- Cosmic Chants as Portal (if in scope): verse-by-verse chant presentation (DES-056)

**Success criteria:** Cross-media search returns interleaved book, video, and audio results. Synchronized transcript scrolls with playback. Knowledge graph displays all five content types with sacred artifact golden ring. YSS branding activates for Hindi, Bengali, and Thai locales.

---

## Arc 7: Community — Shared Journey

### Milestone 7a: Personal

**Goal:** Optional accounts for personal study features. Anonymous access remains the default.

The DELTA-Relaxed Authenticated Experience (ADR-121) introduces a two-tier model: anonymous is default with full DELTA compliance; authenticated is opt-in for cross-device sync of bookmarks, reading progress, and personal collections. No behavioral profiling. Account deletion always available.

- Optional authentication: magic links, passkeys, or Auth0 — sign-in never required for reading/search (ADR-121)
- Bookmarks and highlights with localStorage → server migration on login
- Reading progress sync across devices
- Personal search history (opt-in, private)
- Personalized daily passage and email based on chosen themes (ADR-091)

**Success criteria:** Sign-in works without requiring registration for reading/search. localStorage bookmarks migrate to server on first login with zero data loss. Reading progress syncs across devices within 30 seconds.

---

### Milestone 7b: Together

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
- Multilingual community collections extending Milestone 5b content
- DELTA-compliant community analytics for staff editorial decisions (ADR-095)

**Success criteria:** SMS gateway delivers passages in at least 2 regions. Community Collections gallery displays published collections with filtering. VLD members can browse, claim, and fulfill curation briefs.

---

## Unscheduled Features

> Summary view of proposals not yet assigned to an arc. Full proposal details, graduation protocol, and lifecycle management are in **PROPOSALS.md**. This table is reviewed at every arc boundary during the retrospective.

### Validated — Awaiting Scheduling

| PRO | Feature | Governing Refs | Re-evaluate At |
|-----|---------|----------------|----------------|
| PRO-001 | SRF Corpus MCP — Three-Tier Architecture | ADR-101, DES-031 | Arc 3 boundary |
| PRO-002 | SRF Lessons Integration | ADR-085, ADR-121 | Stakeholder request |

### Deferred / Suspended

| PRO | Feature | Original Milestone | Re-evaluate At |
|-----|---------|----------------|----------------|
| *(Populated during development)* | | | |

### Proposed — Awaiting Evaluation

| PRO | Feature | Type |
|-----|---------|------|
| PRO-003 | Text-to-Speech (TTS) for passages | Feature |
| PRO-004 | Audio-visual ambiance toggle (temple/nature sounds) | Enhancement |
| PRO-005 | Neon Auth as Auth0 Alternative | Enhancement |
| PRO-006 | pg_cron for In-Database Scheduling | Enhancement |
| PRO-007 | Logical Replication for Analytics CDC | Feature |
| PRO-008 | Time Travel Queries for Production Debugging | Enhancement |
| PRO-009 | Scientific-Spiritual Bridge Themes (cosmic life, abundance, vibration/AUM) | Theme |
| PRO-010 | Word-Level Graph Navigation | Feature |
| PRO-011 | Proactive Editorial AI Agent | Enhancement |
| PRO-013 | Internal Autonomous Agent Archetypes | Feature |
| PRO-015 | AWS SES as SendGrid Alternative for Email Delivery | Enhancement |

*PRO-012 (Copyright and Legal Framework) has been validated and scheduled as Milestone 1c.16. See deliverable table above.*
*PRO-014 (Multi-Author Sacred Text Expansion) has been adopted. Document cascade merged 2026-02-25.*

---

## PWA-First Strategy (No Native App)

A native mobile app is not planned. The rationale:

1. **The PWA (Milestone 2b) covers the use case.** Offline reading, home screen installation, and full search — all via the browser. For reading and searching Yogananda's teachings, a PWA is functionally equivalent to a native app for the vast majority of seekers.
2. **SRF already has a native app.** The SRF/YSS app (iOS/Android) has an eReader for the private Lessons. A second SRF reading app would create organizational confusion.
3. **The API-first architecture keeps the option open.** If a native app is ever warranted, it consumes the same `/api/v1/` endpoints. Zero backend changes needed.
4. **Milestone 2b is the evaluation point.** After the PWA ships, measure: Are seekers installing it? What are the limitations? Does SRF want portal features inside the existing app?

If a native app is warranted post-Arc 2, React Native or Capacitor wrapping the existing codebase is the likely path. The calm design system and API layer already exist.

---

## Arc Gates

Each milestone has prerequisites that must be satisfied before work begins. Hard prerequisites block the milestone entirely; soft prerequisites improve quality but aren't strictly required.

| Milestone | Hard Prerequisites | Soft Prerequisites |
|-----------|---|---|
| **1a (Prove)** | ~~Edition confirmed, PDF source confirmed~~ *(Resolved 2026-02-24)*. ~~English ebook extraction~~ *(Resolved 2026-02-26)* | — |
| **1b (Trilingual)** | Milestone 1a English search quality evaluation passes (≥ 80%) | Hindi/Spanish ebooks purchased |
| **1c (Deploy)** | Milestone 1b trilingual search quality evaluation passes (≥ 80% per language) | SRF AE team availability for kickoff |
| **2a (Build)** | Milestone 1c complete | Embedding model benchmarks started |
| **2b (Refine)** | Milestone 2a complete | — |
| **3a (Corpus)** | Milestone 2b complete | — |
| **3b (Editorial)** | Milestone 3a complete | Theme taxonomy reviewed by theological advisor. Editorial governance decided and portal coordinator identified are *activation* prerequisites (feature-flag pattern, ADR-123), not *build* prerequisites. Infrastructure ships on schedule; queues activate when staffed. |
| **3c (Intelligence)** | Milestone 3a multi-book corpus available | Milestone 3b editorial review portal operational. Algorithmic deliverables (3c.1–3c.4, 3c.6) can proceed in parallel with Milestone 3b. |
| **3d (Complete)** | Milestone 3c chunk relations computed | — |
| **Arc 4 (Service)** | Milestone 3a multi-book corpus available | Milestone 3d observability operational. Multi-environment AWS accounts provisioned (or IAM isolation confirmed). Contentful Custom Apps scope defined. (ADR-123) |
| **5a (Distribution)** | Milestone 3b editorial workflows operational | Arc 4 PDF generation available |
| **5b (Languages)** | Embedding model benchmarked for multilingual (research begins Milestones 2a–2b), translation reviewers identified, digital text availability confirmed for core languages | Milestone 2a i18n infrastructure validated. Contentful locales activated for target languages. Third-party accessibility auditor engaged. (ADR-077, ADR-123) |
| **Arc 6 (Media)** | Milestone 3d complete (unified search operational) | Milestone 2b PWA evaluation complete, audio/image source material available from SRF |
| **7a (Personal)** | Arc 6 complete | SRF decision on user accounts (required for server-sync features only; localStorage-based features proceed independently). Auth0 configuration aligned with SRF identity standards. (ADR-123) |
| **7b (Together)** | Milestone 7a account infrastructure (if applicable), VLD roster available from SRF | Regional SMS partner contracts negotiated |

**Critical decision gates** (require SRF input before the arc/milestone begins):
- **Milestone 3b (Editorial):** Who owns editorial governance? Who is the portal coordinator? (See CONTEXT.md § Operational Staffing)
- **Arc 4 (Service):** Multi-environment AWS account structure (multi-account vs. IAM isolation)
- **Milestone 5b (Languages):** YSS branding strategy for Bengali/Thai locales, digital text availability for the remaining 7 non-English core languages (Hindi and Spanish already ingested in Milestones 1b–1c)
- **Milestone 7a (Personal):** Whether to implement user accounts at all
- **Milestone 7b (Together):** VLD role assignment process, VLD coordinator identified, community curation governance model

**Unscheduled feature review:** Every arc gate includes a triage of PROPOSALS.md. Deferred/suspended items (PRO-NNN) are evaluated first; validated items are considered for the upcoming arc; proposed items are principle-checked if relevant to the next arc's narrative theme. See PROPOSALS.md § Arc Boundary Review.

---

## Cost Trajectory

| Arc / Milestone | Estimated Monthly Cost | Notes |
|-----------------|----------------------|-------|
| Milestones 1a–1b (Prove + Trilingual) | ~$20-30 | Neon Scale tier (~$20/mo baseline), local dev only, one-time embedding cost (~$0.30 en, ~$0.60 hi+es). |
| Milestones 1c–2b (Deploy through Refine) | ~$80-100 | Neon Scale (~$20), Vercel Pro (~$20), Sentry Team (~$26), Claude API (~$15-25). S3 backup < $1/mo. |
| Arc 3 (Wisdom) | ~$80-120 (base) + ~$10-20 (incremental) | Base infrastructure continues from Milestones 1b–2b. Incremental: more embedding generation for multi-book corpus and chunk relations. Lambda for batch ingestion (pennies per invocation). |
| Arc 4 + Milestone 5a (Service + Distribution) | ~$20-50 | Full library embedded, daily email service (SendGrid ~$20/mo Essentials tier; pending PRO-015 SES evaluation), S3 for PDFs and images, Lambda for scheduled jobs. WhatsApp Business API: +$150-300/mo at scale. Multi-environment promotion (staging + prod), regional Neon read replicas. Contentful paid tier may be needed by Milestone 3a (multi-book) — evaluate then. |
| Milestone 5b+ (Languages) | Requires evaluation | Multi-language embeddings, increased storage, higher API traffic. |
| Arc 6 (Media) | +$30-80 | Audio hosting on S3 + CloudFront streaming. Whisper transcription one-time cost (~$0.006/min). Audio file storage scales with archive size. |
| Milestone 7b (Together) | +$600-1,250 | SMS gateway costs vary by region (India: ~$0.002/msg, US: ~$0.04/msg). Telegram bot: free. USSD/IVR: requires telco negotiation. Community collections gallery and VLD dashboard: negligible incremental cost (existing infrastructure). |

---

## Dependencies and Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **OCR quality** | Corrupted text → bad search results | Claude validates autonomously during ingestion (5.0/5.0 confidence achieved for English). Physical book recovery for edge cases (2 pages). SRF provides non-PDF digital text before launch. |
| **Contentful capacity** | Full corpus at paragraph level may require tier evaluation | One book (~3K TextBlocks) fits comfortably. Evaluate capacity needs at Milestone 3a (multi-book). Hybrid option: section-level in Contentful, paragraph-level in Neon only. |
| **Embedding model quality** | Poor retrieval for Yogananda's vocabulary | Benchmark multiple models (Arc 1 task). Yogananda uses precise, sometimes archaic spiritual terminology. |
| **Chunk size sensitivity** | Too small = orphaned fragments. Too large = imprecise retrieval. | Empirical testing in Arc 1 with diverse query types. |
| **Stakeholder expectation** | "AI search" may imply a chatbot | Clear communication: this is a librarian, not an oracle. No synthesis. |
| **SEO discoverability** | Portal serves only people who already know it exists | Deliberate SEO strategy from Milestone 2a: structured data, theme pages as entry points, meta tags, sitemap. |
| **Portal/app overlap** | Building a duplicate reader alongside the SRF/YSS app | Clarify relationship with SRF AE team early. Portal may complement (search + public reading) rather than replace (private Lessons reading) the app. |
| **Editorial governance** | No defined process for theme tagging, daily passage curation, content QA | Establish editorial roles and workflows before Milestone 3b. Determine whether monastic order, AE team, or dedicated editor owns this. The editorial review portal (ADR-082, deliverables 3b.5a/3b.5b) provides the tooling; the organizational question of *who* uses it requires SRF input. |
| **Copyright/licensing ambiguity** | Unclear terms for free access (read-only vs. downloadable vs. printable) | Resolved: full crawlability with copyright retention. Content gating architecturally prohibited (ADR-081 §3a). Copyright communicated via multi-layered metadata: `llms.txt` copyright section, `ai.txt` permissions file, `X-Copyright` headers, JSON-LD, `/legal` page. Copyright communication layer ships as Milestone 1c.16. Final licensing terms (CC-BY-NC vs. all-rights-reserved with permissions) require SRF legal counsel review before Milestone 1c deployment (PRO-012). |
| **Global South accessibility** | Many seekers access via mobile on limited bandwidth (India, Africa, Latin America) | Mobile-first design. Performance budgets (< 100KB initial load). Low-bandwidth text-only mode. Consider PWA for offline access of bookmarked passages. |
| **"What next" gap** | Seeker is moved by a passage but portal offers no path to practice | "Go Deeper" section in About, footer ecosystem links, and Quiet Corner all point toward SRF Lessons, local centers, and online meditation. Not a sales funnel — a signpost. |
| **Search API abuse** | Public, unauthenticated search API with Claude API cost per query | Two-layer rate limiting (Vercel Firewall + application) from Arc 1. Claude API monthly budget cap. Graceful degradation to database-only search when rate-limited. (ADR-023) |
| **Operational staffing** | Editorial review portal provides tooling, but who uses it? Theme tagging, daily passage curation, translation review, and content QA require dedicated staff time. | Establish editorial roles before Milestone 3b. Key roles to fill: portal coordinator (cross-queue health), content editor, theological reviewer, book ingestion operator. VLD coordinator needed by Milestone 7b. Operational playbook (deliverable 3b.11) documents procedures so year-3 staff can operate without the builders. See CONTEXT.md § Operational Staffing. |
| **Editorial queue backlog** | Review queues grow with every arc. If the monastic editor is unavailable for weeks, AI-proposed tags accumulate and daily passage curation has no attention. | Queue health monitoring (deliverable 3b.12) with age thresholds and escalation to portal coordinator. Email digest highlights overdue items. Minimum editorial coverage model: determine how many review hours/week each arc requires. |
| **Database disaster recovery** | Canonical content (book text, embeddings, theme tags, chunk relations) lives only in Neon. | Three-layer recovery: 30-day PITR (Scale tier), automated Neon Snapshots, nightly pg_dump to S3 (ADR-019, ADR-124). Time Travel Queries for pre-restore verification. Quarterly restore drill. |
| **Edition changes** | SRF publishes revised editions; page numbers and paragraph boundaries change. All portal citations become inaccurate. | Edition tracking in data model (ADR-034). Content-addressable deep links survive re-ingestion (ADR-022). Old edition archived, not deleted. |
| **Shared passage link permanence** | Re-ingestion with different chunking breaks shared links in emails, WhatsApp messages, bookmarks. | Content-hash deep links (ADR-022). Resolution chain: exact match → content-hash in same chapter → content-hash in same book → graceful "passage may have moved" fallback. |

---