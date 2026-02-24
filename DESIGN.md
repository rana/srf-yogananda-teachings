# SRF Online Teachings Portal — Technical Design

> **Navigation guide.** The design is split across four files by phase scope. This root file contains cross-cutting principles and patterns. The **File** column shows where each section lives.
>
> **Parameter convention (ADR-123).** Specific numeric values in this document (cache TTLs, debounce timers, fusion parameters, chunk sizes, rate limits, color band boundaries, purge delays, revalidation intervals) are **tunable defaults**, not architectural commitments. They represent best pre-production guesses and should be implemented as named configuration constants in `/lib/config.ts`, not hardcoded literals. Phase 0a.8 (search quality evaluation) and subsequent phase gates include parameter validation as deliverables. When a parameter is tuned based on evidence, annotate the section: `*Parameter tuned: [date], [old] → [new], [evidence].*` See ADR-123 for the full governance framework.

| Section | Phase | File |
|---------|-------|------|
| [DES-001: Design Philosophy](#des-001-design-philosophy) | — | DESIGN.md |
| [DES-002: Architecture Overview](#des-002-architecture-overview) | 0, 9+ | DESIGN.md |
| [DES-003: The AI Librarian: Search Architecture](DESIGN-phase0.md#des-003-the-ai-librarian-search-architecture) | 0–1 | DESIGN-phase0.md |
| &emsp;[ADR-049: Search Suggestions & Autocomplete](DESIGN-phase0.md#adr-049-search-suggestions-autocomplete) | 0, 3, 10 | DESIGN-phase0.md |
| [DES-004: Data Model](DESIGN-phase0.md#des-004-data-model) | 0+ | DESIGN-phase0.md |
| [DES-005: Content Ingestion Pipeline](DESIGN-phase0.md#des-005-content-ingestion-pipeline) | 0, 9+ | DESIGN-phase0.md |
| [ADR-041: Phase 0 Bootstrap](DESIGN-phase0.md#adr-041-phase-0-bootstrap) | 0 | DESIGN-phase0.md |
| [DES-006: Frontend Design](DESIGN-phase1-4.md#des-006-frontend-design) | 1–11 | DESIGN-phase1-4.md |
| &emsp;[DES-007: Opening Moment — Portal Threshold](DESIGN-phase1-4.md#des-007-opening-moment--portal-threshold) | 1+ | DESIGN-phase1-4.md |
| &emsp;[DES-008: Reader Typography Refinements](DESIGN-phase1-4.md#des-008-reader-typography-refinements) | 2+ | DESIGN-phase1-4.md |
| &emsp;[DES-009: "Dwell" Interaction — Passage Contemplation Mode](DESIGN-phase1-4.md#des-009-dwell-interaction--passage-contemplation-mode) | 2+ | DESIGN-phase1-4.md |
| &emsp;[DES-010: Layered Passage Depth — "Go Deeper Within the Text"](DESIGN-phase1-4.md#des-010-layered-passage-depth--go-deeper-within-the-text) | 2+ | DESIGN-phase1-4.md |
| &emsp;[DES-011: Time-Aware Reading — Circadian Color Temperature](DESIGN-phase1-4.md#des-011-time-aware-reading--circadian-color-temperature) | 2+ | DESIGN-phase1-4.md |
| &emsp;[DES-012: "Breath Between Chapters" — Chapter Transition Pacing](DESIGN-phase1-4.md#des-012-breath-between-chapters--chapter-transition-pacing) | 2+ | DESIGN-phase1-4.md |
| &emsp;[DES-013: Keyboard-First Reading Navigation](DESIGN-phase1-4.md#des-013-keyboard-first-reading-navigation) | 2+ | DESIGN-phase1-4.md |
| &emsp;[DES-014: Session Closure Moments — Departure Grace](DESIGN-phase1-4.md#des-014-session-closure-moments--departure-grace) | 2+ | DESIGN-phase1-4.md |
| &emsp;[DES-015: Self-Revealing Navigation](DESIGN-phase1-4.md#des-015-self-revealing-navigation) | 1+ | DESIGN-phase1-4.md |
| &emsp;[DES-016: Lotus as Unified Visual Motif](DESIGN-phase1-4.md#des-016-lotus-as-unified-visual-motif) | 1+ | DESIGN-phase1-4.md |
| [DES-017: Multi-Language Strategy](DESIGN-phase1-4.md#des-017-multi-language-strategy) | 1 (infra), 10 (content) | DESIGN-phase1-4.md |
| [DES-018: Cultural Design Considerations](DESIGN-phase5-plus.md#des-018-cultural-design-considerations) | 10+ | DESIGN-phase5-plus.md |
| [DES-019: API Design (Next.js API Routes)](#des-019-api-design-nextjs-api-routes) | 0+ | DESIGN.md |
| [DES-020: Platform Parity (Mobile Readiness)](DESIGN-phase1-4.md#des-020-platform-parity-mobile-readiness) | 1+ | DESIGN-phase1-4.md |
| [DES-021: YouTube Video Section Architecture](DESIGN-phase1-4.md#des-021-youtube-video-section-architecture) | 1+ | DESIGN-phase1-4.md |
| [DES-022: Events Section](DESIGN-phase1-4.md#des-022-events-section) | 1+ | DESIGN-phase1-4.md |
| [DES-023: Sacred Places — Contemplative Geography](DESIGN-phase1-4.md#des-023-sacred-places-contemplative-geography) | 3+ | DESIGN-phase1-4.md |
| [DES-024: Security Considerations](#des-024-security-considerations) | 0+ | DESIGN.md |
| [DES-025: Accessibility Requirements (Phase 1 Foundation)](DESIGN-phase1-4.md#des-025-accessibility-requirements-phase-1-foundation) | 1+ | DESIGN-phase1-4.md |
| [DES-026: Editorial Reading Threads — "Teachings in Conversation"](#des-026-editorial-reading-threads-teachings-in-conversation) | — | DESIGN.md |
| [DES-027: Reverse Bibliography — "What Yogananda Read"](#des-027-reverse-bibliography-what-yogananda-read) | — | DESIGN.md |
| [DES-028: Calendar-Aware Content Surfacing](DESIGN-phase1-4.md#des-028-calendar-aware-content-surfacing) | 4+ | DESIGN-phase1-4.md |
| [ADR-048: Chunking Strategy](DESIGN-phase0.md#adr-048-chunking-strategy) | 0+ | DESIGN-phase0.md |
| &emsp;[Semantic Density Classification](DESIGN-phase0.md#semantic-density-classification) | 3+ | DESIGN-phase0.md |
| &emsp;[ADR-039 ext: Corpus Stylometric Fingerprint](DESIGN-phase0.md#adr-039-ext-corpus-stylometric-fingerprint) | 6+ | DESIGN-phase0.md |
| [DES-029: The Quiet Index — Browsable Contemplative Taxonomy](#des-029-the-quiet-index-browsable-contemplative-taxonomy) | — | DESIGN.md |
| [DES-030: Daily Email: Verbatim Passage Delivery](DESIGN-phase5-plus.md#des-030-daily-email-verbatim-passage-delivery) | 8+ | DESIGN-phase5-plus.md |
| [ADR-084: Seeker Feedback — DELTA-Compliant Signal Collection](#adr-084-seeker-feedback-delta-compliant-signal-collection) | — | DESIGN.md |
| [DES-031: MCP Server Strategy](DESIGN-phase0.md#des-031-mcp-server-strategy) | 0+ | DESIGN-phase0.md |
| [DES-032: Content Management Strategy](DESIGN-phase5-plus.md#des-032-content-management-strategy) | 9+ | DESIGN-phase5-plus.md |
| [ADR-082: Staff Experience Architecture](DESIGN-phase1-4.md#adr-082-staff-experience-architecture) | 4+ | DESIGN-phase1-4.md |
| [DES-033: Unified Review Queue Abstraction](#des-033-unified-review-queue-abstraction) | — | DESIGN.md |
| [DES-034: Content Lifecycle Management](#des-034-content-lifecycle-management) | — | DESIGN.md |
| [DES-035: AI-Assisted Editorial Workflows](#des-035-ai-assisted-editorial-workflows) | — | DESIGN.md |
| [DES-036: Migration, Evolution, and Longevity](#des-036-migration-evolution-and-longevity) | — | DESIGN.md |
| [ADR-007: Editorial Proximity Standard](#adr-007-editorial-proximity-standard) | — | DESIGN.md |
| [DES-037: Observability](#des-037-observability) | 0+ | DESIGN.md |
| [DES-038: Testing Strategy](#des-038-testing-strategy) | 0+ | DESIGN.md |
| [DES-039: Infrastructure and Deployment](DESIGN-phase0.md#des-039-infrastructure-and-deployment) | 0 | DESIGN-phase0.md |
| [DES-040: Design Tooling](DESIGN-phase1-4.md#des-040-design-tooling) | 1+ | DESIGN-phase1-4.md |
| [DES-041: Magazine Section Architecture](DESIGN-phase5-plus.md#des-041-magazine-section-architecture) | 6+ | DESIGN-phase5-plus.md |
| [DES-042: Glossary Architecture](DESIGN-phase1-4.md#des-042-glossary-architecture) | 4+ | DESIGN-phase1-4.md |
| [DES-043: "What Is Humanity Seeking?" Dashboard Architecture](DESIGN-phase5-plus.md#des-043-what-is-humanity-seeking-dashboard-architecture) | 6+ | DESIGN-phase5-plus.md |
| [DES-044: Additional New UI Pages](DESIGN-phase1-4.md#des-044-additional-new-ui-pages) | 1+ | DESIGN-phase1-4.md |
| &emsp;[DES-045: `/journeys` — Calendar Reading Journeys](DESIGN-phase1-4.md#des-045-journeys-calendar-reading-journeys) | 4+ | DESIGN-phase1-4.md |
| &emsp;[DES-046: Study Circle Sharing](DESIGN-phase5-plus.md#des-046-study-circle-sharing) | 14+ | DESIGN-phase5-plus.md |
| &emsp;[DES-047: `/browse` — The Complete Index](DESIGN-phase1-4.md#des-047-browse-the-complete-index) | 1+ | DESIGN-phase1-4.md |
| &emsp;[DES-048: `/guide` — The Spiritual Guide](DESIGN-phase1-4.md#des-048-guide-the-spiritual-guide) | 4+ | DESIGN-phase1-4.md |
| [DES-049: Responsive Design Strategy](DESIGN-phase1-4.md#des-049-responsive-design-strategy) | 1+ | DESIGN-phase1-4.md |
| [ADR-086, ADR-087: Community Collections — Public Curation](#adr-086-adr-087-community-collections-public-curation) | — | DESIGN.md |
| [ADR-035, ADR-063, ADR-064: Image Serving Architecture](DESIGN-phase5-plus.md#adr-035-adr-063-adr-064-image-serving-architecture) | 6+ | DESIGN-phase5-plus.md |
| [DES-050: Seeker & User Persona Index](#des-050-seeker--user-persona-index) | — | DESIGN.md |
| [DES-051: Portal Updates Page — "The Library Notice Board"](DESIGN-phase1-4.md#des-051-portal-updates-page-the-library-notice-board) | 4+ | DESIGN-phase1-4.md |
| [DES-052: Outbound Webhook Event System](DESIGN-phase1-4.md#des-052-outbound-webhook-event-system) | 4+ | DESIGN-phase1-4.md |
| [DES-053: Unified Content Pipeline Pattern](#des-053-unified-content-pipeline-pattern) | — | DESIGN.md |
| [DES-054: Knowledge Graph Ontology](DESIGN-phase0.md#des-054-knowledge-graph-ontology) | 0 (design), 4+ (batch) | DESIGN-phase0.md |
| [DES-055: Concept/Word Graph](DESIGN-phase1-4.md#des-055-conceptword-graph) | 4+ | DESIGN-phase1-4.md |
| [DES-056: Feature Catalog (RAG Architecture Proposal)](DESIGN-phase1-4.md#des-056-feature-catalog-rag-architecture-proposal) | 2–12+ | DESIGN-phase1-4.md |

---

## DES-001: Design Philosophy

This portal is a **digital library with an AI librarian**, not a chatbot or content generator. The AI finds and surfaces Yogananda's actual words — it never speaks for him. Every architectural decision flows from this principle.

---

## DES-002: Architecture Overview

### Phase 0a Architecture (Prove — Pure Hybrid Search + Contentful)

Two content stores. No AI in the search path — pure hybrid retrieval. Contentful is the editorial source of truth from Phase 0 (ADR-010). (ADR-113)

```
┌──────────────────────────────────────────────────────────────────┐
│ USERS │
│ │ │
│ ▼ │
│ ┌──────────────────────────────────────┐ │
│ │ Next.js (local dev) │ │
│ │ │ │
│ │ • Search UI (query bar + results) │ │
│ │ • Book Reader (chapter navigation) │ │
│ │ • "Read in context" deep links │ │
│ └──────────┬──────────────┬─────────────┘ │
│ │ │ │
│ /api/v1/search │ │
│ │ Book reader pages │
│ ▼ ▼ │
│ ┌────────────────────┐ ┌────────────────────────┐ │
│ │ Neon PostgreSQL │ │ Contentful │ │
│ │ + pgvector │ │ (editorial source) │ │
│ │ │ │ │ │
│ │ • book_chunks │ │ Book → Chapter │ │
│ │ (text + embeddings)│ │ → Section → TextBlock │ │
│ │ • BM25 (pg_search) │ │ │ │
│ │ • HNSW vector index │ │ Rich Text AST │ │
│ │ • RRF fusion │ │ per locale │ │
│ │ • search_queries │ │ │ │
│ └────────────────────┘ └────────────────────────┘ │
│ ▲ │ │
│ └──────── Batch sync ────────────┘ │
│ (chunk + embed + insert) │
└──────────────────────────────────────────────────────────────────┘

One-time ingestion:

 PDF ──► marker (PDF→Markdown) ──► Human QA ──► Contentful (import)
                                                    │
                                          Batch sync script
                                                    │
                                          Chunk ──► Embed ──► Neon

Phase 0a has NO Claude API calls in the search path.
Claude is used only offline: ingestion QA (ADR-005 E4),
enrichment (ADR-115), and search quality evaluation (ADR-005 E5).
```

### Phase 0b Architecture (Foundation — AI-Enhanced Search + Contentful Webhooks)

Phase 0b adds Claude Haiku to the search path: query expansion,
intent classification, and passage ranking. Deployed to Vercel.
Contentful webhook sync replaces batch sync. (ADR-113, ADR-010)

```
┌──────────────────────────────────────────────────────────────────┐
│ USERS │
│ │ │
│ ▼ │
│ ┌──────────────────────────────────────┐ │
│ │ Next.js on Vercel │ │
│ │ │ │
│ │ • Search UI (query bar + results) │ │
│ │ • Book Reader (SSG/ISR from │ │
│ │ Contentful Delivery API) │ │
│ │ • Homepage (Today's Wisdom) │ │
│ │ • "Read in context" deep links │ │
│ └──────────┬──────────────┬─────────────┘ │
│ │ │ │
│ /api/v1/search Book reader │
│ /api/v1/suggest (Contentful) │
│ /api/v1/expand │ │
│ ▼ ▼ │
│ ┌────────────────────┐ ┌────────────────────────┐ │
│ │ Neon PostgreSQL │ │ Contentful │ │
│ │ + pgvector │◄─── webhook ───│ (editorial source) │ │
│ │ │ sync │ │ │
│ │ • book_chunks │ service │ Book → Chapter │ │
│ │ • BM25 (pg_search) │ │ → Section → TextBlock │ │
│ │ • HNSW vector index │ │ │ │
│ │ • search_queries │ │ Locales: en │ │
│ └────────────────────┘ └────────────────────────┘ │
│ │ │
│ ▼ (query expansion + passage ranking only) │
│ ┌─────────────────────────────────────┐ │
│ │ Claude via AWS Bedrock (ADR-014) │ │
│ │ │ │
│ │ • Expand user queries into │ │
│ │ semantic search terms [Haiku] │ │
│ │ • Re-rank candidate passages [Haiku]│ │
│ │ • Classify search intent [Haiku] │ │
│ │ • NEVER generate/paraphrase text │ │
│ └─────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘

Contentful webhook sync (event-driven, Phase 0b+):

 Contentful publish ──► Webhook ──► Serverless fn ──► Chunk ──► Embed ──► Neon
```

### Production Architecture (Full Stack — Phase 9+)

```
┌──────────────────────────────────────────────────────────────────┐
│ │
│ EDITORIAL LAYER SEARCH LAYER │
│ (Source of Truth) (Derived Index) │
│ │
│ ┌──────────────────┐ ┌──────────────────────────┐ │
│ │ Contentful │ webhook │ Neon PostgreSQL │ │
│ │ │────────►│ + pgvector │ │
│ │ Book │ sync │ │ │
│ │ └─ Chapter │ service │ book_chunks │ │
│ │ └─ Section │ │ (text + embeddings + │ │
│ │ └─ Block │ │ Contentful entry IDs) │ │
│ │ │ │ │ │
│ │ Locales: │ │ Hybrid search: │ │
│ │ en, es, de, fr, │ │ vector + BM25 │ │
│ │ it, pt, ja │ │ │ │
│ └──────────────────┘ └──────────────────────────┘ │
│ │ │ │
│ │ (book text │ (search results) │
│ │ for reader) │ │
│ ▼ ▼ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Next.js on Vercel │ │
│ │ │ │
│ │ • Book Reader (SSG from Contentful at build time) │ │
│ │ • Search UI (queries Neon via API routes) │ │
│ │ • "Read in context" links to reader pages │ │
│ └──────────────────────────────────────────────────────┘ │
│ │ │
│ ▼ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Supporting Services │ │
│ │ │ │
│ │ • Claude API — query expansion + HyDE          │ │
│ │ • Cohere Rerank 3.5 — passage reranking (Ph 2+)│ │
│ │ • Graph batch pipeline — Python + NetworkX (4+) │ │
│ │ • Retool — admin panel (content review, analytics) │ │
│ │ • Cloudflare — CDN, edge caching, security │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

**Key principle (Phase 0+):** Contentful is where editors work. Neon is where search works. Next.js is where users work. Each system does what it's best at. Contentful is the editorial source of truth from Phase 0 (ADR-010). The production diagram above adds services that arrive in later phases (Cohere Rerank, graph pipeline, Retool, Cloudflare CDN) but the Contentful → Neon → Next.js architecture is established from Phase 0a.

---

## DES-019: API Design (Next.js API Routes)

All API routes use a versioned prefix (`/api/v1/`) from Phase 0 per ADR-011. Language is passed as a query parameter on API routes (`?language=hi`), not as a path prefix — language is a property of content, not a namespace for operations (ADR-027). Frontend pages use locale path prefixes (`/hi/themes/peace`) for SEO and `hreflang` linking. This enables mobile apps pinned to older API versions to coexist with the evolving web frontend. List endpoints use cursor-based pagination for mobile compatibility.

### Design Rationale

The API surface exists to make the teachings findable by machines — mobile apps, messaging bots, MCP consumers, Zapier workflows, and future integrations we can't predict (ADR-011). Every design choice serves the 10-year horizon (ADR-004): versioning provides room to evolve without breaking consumers, cursor-based pagination handles data changes gracefully across editions and re-ingestion, and the shared service layer (`/lib/services/`) ensures that the API is never a second-class citizen behind Server Components. The language-as-parameter convention (ADR-027) was chosen because language is a *content filter*, not an operation namespace — the same endpoint returns the same shape regardless of language, and mobile apps pinned to `/api/v1/` never need to know about locale path conventions. The contemplative error messages (ADR-074) apply here because the API is not only consumed by code — seekers see error states in the UI, and those states should carry the same care as the rest of the portal.

### API Conventions

**Field naming: `snake_case`.** All JSON response fields use `snake_case`, matching PostgreSQL column naming and providing consistency across the API surface. Examples: `chunk_id`, `book_title`, `page_number`, `reader_url`, `has_more`, `results_count`. TypeScript interfaces in `/lib/services/` use `camelCase` internally; the API route layer transforms at the boundary.

**Resource identifiers.** Resources use the identifier type natural to their domain:
- **Books** use slugs (human-readable, SEO-friendly): `/api/v1/books/autobiography-of-a-yogi`
- **Chapters** use numbers within their book: `/api/v1/books/{slug}/chapters/26`
- **Chunks (passages)** use UUIDs (stable across re-ingestion via content-hash fallback, ADR-022): `/api/v1/chunks/{uuid}`
- **Themes** use English slugs (stable across locales, ADR-027): `/api/v1/themes/peace`
- **People, places, glossary terms** use slugs: `/api/v1/people/sri-yukteswar`, `/api/v1/glossary/samadhi`

**Response envelope.** List endpoints follow one of two patterns:

*Paginated lists* (theme passages, books with sync, editorial threads, magazine articles):
```json
{
  "data": [...],
  "pagination": { "cursor": "opaque_value", "has_more": true },
  "meta": { "total_count": 47 }
}
```
When timestamp filtering is active (ADR-107), responses include `sync` metadata in `meta`:
```json
{
  "meta": {
    "sync": {
      "filtered_by": "updated_since",
      "since": "2026-03-01T00:00:00Z",
      "result_count": 3,
      "latest_timestamp": "2026-03-14T09:22:11Z"
    }
  }
}
```

*Complete collections* (themes list, books list, glossary) where the full set fits in one response:
```json
{
  "data": [...],
  "meta": { "total_count": 12 }
}
```

*Single resource* endpoints return the resource object directly (no `data` wrapper):
```json
{
  "id": "uuid",
  "title": "Autobiography of a Yogi",
  "slug": "autobiography-of-a-yogi",
  ...
}
```

**Search is intentionally unpaginated.** The search endpoint returns the best-ranked results (default 5, max 20) with no cursor or `has_more`. This is deliberate: the AI librarian returns the *most relevant* passages, not a paginated result set to browse. Pagination would imply browsing a corpus dump, which contradicts the librarian metaphor (ADR-001). If a seeker needs broader exploration, theme pages and the `/browse` index serve that purpose.

**`exclude` parameter.** Endpoints that support "show me another" behavior accept an `exclude` query parameter (a resource ID to omit from results). Used on `/api/v1/daily-passage` and `/api/v1/quiet` for repeat-free refresh without client-side deduplication.

### Error Response Contract

All API endpoints return errors in a consistent JSON format:

```typescript
interface ErrorResponse {
 error: string; // Machine-readable code (e.g., "RATE_LIMITED", "NOT_FOUND", "INVALID_PARAMETER")
 message: string; // Human-readable description (compassionate tone per DELTA Love principle)
 request_id: string; // UUID for Sentry correlation and support debugging
}
```

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_PARAMETER` | Missing required parameter, invalid cursor, malformed query |
| 404 | `NOT_FOUND` | Book, chapter, chunk, theme, or place does not exist |
| 429 | `RATE_LIMITED` | Rate limit exceeded. Response includes `Retry-After` header (seconds) |
| 500 | `INTERNAL_ERROR` | Unexpected failure. Logged to Sentry with `request_id` |

Error messages use the same compassionate, clear language as the rest of the portal. Example: `"We couldn't find that passage. It may have been moved when a new edition was added."` — never terse HTTP-speak.

### `GET /api/v1/search`

```
Query params:
 q (required) — user's search query
 language (optional) — default 'en'
 book_id (optional) — restrict to a specific book
 limit (optional) — default 5, max 20
 mode (optional) — 'hybrid' (default), 'fts', 'vector'

Response (intentionally unpaginated — see § API Conventions):
{
 "query": "How do I overcome fear?",
 "data": [
 {
 "chunk_id": "uuid",
 "content": "The soul is ever free; it is deathless...",
 "book_title": "Autobiography of a Yogi",
 "chapter_title": "The Law of Miracles",
 "chapter_number": 26,
 "page_number": 312,
 "section_heading": null,
 "score": 0.87,
 "reader_url": "/books/autobiography-of-a-yogi/26#chunk-uuid"
 },
 ...
 ],
 "meta": { "results_count": 5 }
}
```

### `GET /api/v1/daily-passage`

```
Query params:
 language (optional) — default 'en'

Response:
{
 "chunk_id": "uuid",
 "content": "Have courage. Whatever you are going through will pass...",
 "book_title": "Where There Is Light",
 "chapter_title": "Courage",
 "page_number": 42,
 "reader_url": "/books/where-there-is-light/3#chunk-uuid"
}

Implementation:
 SELECT bc.id, bc.content, b.title, ch.title, bc.page_number
 FROM daily_passages dp
 JOIN book_chunks bc ON bc.id = dp.chunk_id
 JOIN books b ON b.id = bc.book_id
 LEFT JOIN chapters ch ON ch.id = bc.chapter_id
 WHERE dp.is_active = true
 AND bc.language = :language -- filter to user's locale
 ORDER BY random
 LIMIT 1;

 English fallback: if no results for user's language, re-query with
 language='en' and mark response with "fallback_language": "en".

 Optional seasonal weighting: if current month maps to a season,
 prefer passages with matching season_affinity (60/40 weighted random).
```

### `GET /api/v1/themes`

```
Query params:
 language (optional) — default 'en'. Returns localized theme names
 from topic_translations if available;
 falls back to English name if no translation exists.
 category (optional) — 'quality', 'situation', 'person', 'principle',
 'scripture', 'practice', 'yoga_path', or omit for all. (ADR-032, ADR-033)
 Homepage "Doors of Entry" uses category=quality.
 "Explore all themes" page omits this parameter.

Response (complete collection — see § API Conventions):
{
 "data": [
 {
 "id": "uuid",
 "name": "Paz",
 "slug": "peace",
 "category": "quality",
 "header_quote": "Sé tan sencillo como puedas; te asombrará...",
 "header_citation": "Autobiografía de un Yogui, Capítulo 12"
 },
 ...
 ],
 "meta": { "total_count": 12 }
}

Implementation:
 SELECT lt.id, lt.slug, lt.category, lt.sort_order,
 COALESCE(ltt.name, lt.name) AS name,
 COALESCE(ltt.header_quote, lt.header_quote) AS header_quote,
 COALESCE(ltt.header_citation, lt.header_citation) AS header_citation
 FROM teaching_topics lt
 LEFT JOIN topic_translations ltt
 ON ltt.theme_id = lt.id AND ltt.language = :language
 WHERE (:category IS NULL OR lt.category = :category)
 ORDER BY lt.category, lt.sort_order;
```

### `GET /api/v1/themes/[slug]/passages`

```
Query params:
 language (optional) — default 'en'. Filters passages to user's locale.
 If fewer than 5 results, supplements with English
 passages marked with fallback_language.
 limit (optional) — default 8, max 20
 cursor (optional) — opaque cursor from previous response
 shuffle (optional) — if true, returns a random selection (default for first request)

Response (paginated list — see § API Conventions):
{
 "theme": "Peace",
 "data": [
 {
 "chunk_id": "uuid",
 "content": "The verbatim passage text...",
 "book_title": "Man's Eternal Quest",
 "chapter_title": "How to Have Courage",
 "page_number": 187,
 "reader_url": "/books/mans-eternal-quest/12#chunk-uuid"
 },
 ...
 ],
 "pagination": { "cursor": "eyJpZCI6MTIzfQ", "has_more": true },
 "meta": { "total_count": 47 }
}

Implementation:
 Default (no cursor): randomly samples from theme-tagged chunks.
 With cursor: returns next page in stable order.
 "Show more" uses cursor from previous response.
 No user-specific personalization.
 Only serves tags with tagged_by IN ('manual', 'reviewed') — never 'auto'.
```

### `GET /api/v1/quiet`

```
Query params:
 language (optional) — default 'en'
 exclude (optional) — affirmation ID to exclude (for "show me another")

Response:
{
 "affirmation_id": "uuid",
 "content": "I am submerged in eternal light...",
 "book_title": "Scientific Healing Affirmations",
 "page_number": 23,
 "section_heading": "Healing Affirmations"
}

Implementation:
 SELECT id, content, book_title, page_number, section_heading
 FROM affirmations
 WHERE is_active = true
 AND language = :language
 AND (:exclude IS NULL OR id != :exclude)
 ORDER BY random
 LIMIT 1;

 Fallback: if no affirmations in user's language, return English.
```

### `GET /api/v1/books`

```
Query params:
 language (optional) — default 'en'. Returns books available in user's locale.
 Phase 10: also returns an "also_available_in_english"
 section for untranslated works (per ADR-075).

Response (complete collection — see § API Conventions):
{
 "data": [
 {
 "id": "uuid",
 "title": "Autobiography of a Yogi",
 "subtitle": null,
 "author": "Paramahansa Yogananda",
 "publication_year": 1946,
 "cover_image_url": "...",
 "chapter_count": 48,
 "slug": "autobiography-of-a-yogi",
 "available_languages": ["en", "es", "de", "fr", "it", "pt", "ja", "th", "hi", "bn"]
 }
 ],
 "also_available_in_english": [...],
 "meta": { "total_count": 1 }
}

Implementation:
 Primary: SELECT ... FROM books WHERE language = :language
 Also available: SELECT ... FROM books b
 WHERE b.language = 'en'
 AND b.id NOT IN (
 SELECT canonical_book_id FROM books WHERE language = :language
 AND canonical_book_id IS NOT NULL
)
 available_languages: derived from books grouped by canonical_book_id
```

### `GET /api/v1/books/{slug}`

```
Response:
{
 "id": "uuid",
 "title": "Autobiography of a Yogi",
 "subtitle": null,
 "author": "Paramahansa Yogananda",
 "slug": "autobiography-of-a-yogi",
 "publication_year": 1946,
 "cover_image_url": "...",
 "description": "A spiritual classic...",
 "bookstore_url": "https://bookstore.yogananda.org/...",
 "available_languages": ["en", "es", "de", "fr", "it", "pt", "ja", "th", "hi", "bn"],
 "chapters": [
   { "number": 1, "title": "My Parents and Early Life" },
   { "number": 2, "title": "My Mother's Death and the Mystic Amulet" },
   ...
 ]
}

Cache-Control: max-age=86400, stale-while-revalidate=604800
```

### `GET /api/v1/books/[slug]/chapters/[number]`

```
Response:
{
 "book_title": "Autobiography of a Yogi",
 "chapter_number": 26,
 "chapter_title": "The Law of Miracles",
 "paragraphs": [
 {
 "chunk_id": "uuid",
 "content": "Full paragraph text...",
 "page_number": 310,
 "paragraph_index": 0
 },
 ...
 ],
 "prev_chapter": 25,
 "next_chapter": 27
}
```

### `GET /api/v1/chunks/[chunk-id]/related`

```
Query params:
 limit (optional) — default 3, max 20
 book_id (optional) — filter to a specific book
 language (optional) — filter to a specific language
 theme_id (optional) — filter to a specific teaching topic
 exclude_book_id (optional) — exclude a specific book (typically current book)

Response:
{
 "source_chunk_id": "uuid",
 "data": [
 {
 "chunk_id": "uuid",
 "content": "The verbatim passage text...",
 "book_title": "Man's Eternal Quest",
 "chapter_title": "How to Have Courage",
 "chapter_number": 12,
 "page_number": 201,
 "similarity": 0.89,
 "reader_url": "/books/mans-eternal-quest/12#chunk-uuid"
 },
 ...
 ],
 "meta": { "total_available": 27, "source": "precomputed" }
}

Implementation:
 1. Query chunk_relations WHERE source_chunk_id = :id
 ORDER BY rank, with optional JOINs for filtering
 2. If filtered results < limit, fall back to real-time
 vector similarity query with WHERE clauses
 3. Response includes "source" field indicating whether
 results are from precomputed table or realtime fallback

Cache-Control: max-age=86400, stale-while-revalidate=604800
 (relations are stable; only change when new content is ingested)
```

### `GET /api/v1/books/[slug]/chapters/[number]/thread`

```
Response:
{
 "book_title": "Autobiography of a Yogi",
 "chapter_number": 14,
 "chapter_title": "An Experience in Cosmic Consciousness",
 "data": [
 {
 "chunk_id": "uuid",
 "content": "The soul's nature is infinite bliss...",
 "book_title": "The Divine Romance",
 "chapter_title": "The Nature of the Soul",
 "page_number": 142,
 "max_similarity": 0.91,
 "reader_url": "/books/the-divine-romance/8#chunk-uuid"
 },
 ...
 ],
 "meta": { "themes": ["cosmic consciousness", "the soul", "meditation"] }
}

Implementation:
 1. Get all chunk_ids for the given chapter
 2. Query chunk_relations for all those source_chunk_ids
 3. Filter to other books only
 4. Aggregate by target_chunk_id, take MAX(similarity)
 5. Deduplicate, rank by max_similarity, take top 3
 6. Extract prominent themes from chunk_topics for intro text

Cache-Control: max-age=86400, stale-while-revalidate=604800
```

### Timestamp Filtering on List Endpoints (ADR-107)

All list endpoints that return content collections support optional `updated_since` and `created_since` query parameters for incremental sync. These enable automation consumers (Zapier, Lambda, partner integrations) to fetch only what changed since their last poll — reducing API calls by orders of magnitude for stable collections.

```
GET /api/v1/books?updated_since=2026-03-01T00:00:00Z
GET /api/v1/themes?created_since=2026-03-15T12:00:00Z&language=hi
GET /api/v1/audio?updated_since=2026-02-28T00:00:00Z
```

- `updated_since` — items where `updated_at > :timestamp` (new + modified)
- `created_since` — items where `created_at > :timestamp` (new only)
- Mutually exclusive — providing both returns 400
- Results ordered by filtered timestamp ascending (natural incremental sync order)

When active, responses include `sync` metadata within `meta` for the consumer's next call:

```json
{
  "data": [...],
  "pagination": { "cursor": "...", "has_more": true },
  "meta": {
    "sync": {
      "filtered_by": "updated_since",
      "since": "2026-03-01T00:00:00Z",
      "result_count": 3,
      "latest_timestamp": "2026-03-14T09:22:11Z"
    }
  }
}
```

See ADR-107 for the full endpoint coverage table, schema requirements (`updated_at` columns and triggers on all content tables), and phasing.

---

## DES-024: Security Considerations

| Concern | Approach |
|---------|----------|
| AI prompt injection | System prompts are server-side only. User input is treated as untrusted data, never concatenated into system prompts without sanitization. |
| Content scraping | Cloudflare bot protection. Rate limiting on API routes. Content served as rendered HTML (not bulk-downloadable JSON). |
| AI misuse | The AI cannot generate teaching content. If prompted to "ignore instructions," the constrained output format (passage IDs only) limits attack surface. |
| User privacy | No user accounts required. Search queries logged without any user identification. |
| Source attribution | Every displayed passage MUST include book, chapter, and page citation. No orphaned quotes. |

### ADR-023: Two-Layer Rate Limiting

| Layer | Tool | Limit | Behavior on Exceed |
|-------|------|-------|-------------------|
| **Outer (edge)** | Cloudflare WAF | 60 general requests/min per IP; 15 search requests/min per IP | HTTP 429 with `Retry-After` header. Request never reaches application. |
| **Inner (application)** | Custom middleware | 30 search req/min anonymous, 120 search req/min known crawlers (ADR-081) | Graceful degradation: search proceeds without Claude API calls (database-only hybrid search). Still returns results. |

The outer layer stops abuse before it reaches the application — the 15 search/min Cloudflare limit is stricter than the inner layer because it's a hard block (429), while the inner layer's 30/min threshold triggers graceful degradation (results still returned, just without AI enhancement). A seeker who exceeds the application-layer limit still gets search results — just without AI-enhanced query expansion and passage ranking.

### ADR-099: Sub-Processor Inventory

All services that process data on the portal's behalf, with their roles, data touched, and geographic regions. Maintained as part of the privacy policy (`/privacy`).

| Service | GDPR Role | Data Touched | Region | Phase |
|---------|-----------|-------------|--------|-------|
| **Neon** | Processor | All server-side data (books, themes, search queries, subscribers) | US (default); EU read replica Phase 9+ | 0+ |
| **Vercel** | Processor | Request logs (transient), edge headers, static assets | Global edges, US origin | 0+ |
| **Cloudflare** | Processor | Request metadata, IP for WAF (transient, not stored by portal) | Global | 0+ |
| **Amplitude** | Processor | Anonymized events with country_code (no user ID) | US | 6+ |
| **Sentry** | Processor | Error stack traces, request context | US | 0+ |
| **New Relic** | Processor | Performance metrics, log aggregation | US | 6+ |
| **AWS Bedrock** | Processor | Search queries (transient, not stored by AWS) | `us-east-1` | 0+ |
| **OpenAI** | Processor | Corpus text at embedding time (one-time, not retained) | US | 0+ |
| **Resend/SES** | Processor | Subscriber email addresses | US | 8+ |
| **Auth0** | Processor | User accounts (if implemented) | US | 13+ |
| **Contentful** | Processor | Editorial content (no personal data) | EU | 0+ |

EU-US data transfers rely on the EU-US Data Privacy Framework (DPF) where services are certified, with Standard Contractual Clauses (SCCs) as fallback. Review when services are added or changed.

*Section added: 2026-02-21, ADR-099*

---

## DES-026: Editorial Reading Threads — "Teachings in Conversation"

Curated reading paths that trace a single spiritual theme through multiple books as a coherent progression. These are not AI-generated content — they are editorially sequenced arrangements of existing passages, like a museum exhibit: same artworks, thoughtful arrangement.

### Concept

The `chunk_relations` table (ADR-050) connects passages by semantic similarity. Editorial threads add a curated layer: human-selected passages sequenced to flow from recognition → understanding → practice → transcendence.

**Example:** "Yogananda on Fear" — 8 passages from 4 books, editorially ordered to build a coherent contemplation.

**Example:** "The Path of Practice" (ADR-104) — a curated passage sequence tracing Yogananda's published arc from reading to practice: why meditate → what meditation is → what Kriya Yoga is → the lineage (Babaji, Lahiri Mahasaya, Sri Yukteswar, Yogananda) → the invitation to practice. All passages verbatim, all cited. The final entry signposts SRF's free Beginner's Meditation (`yogananda.org/a-beginners-meditation`) and the SRF Lessons (`yogananda.org/lessons`). This thread is the corpus-grounded version of what SRF's website provides through editorial copy — but here it is Yogananda's own voice making the invitation. Requires multi-book corpus (Phase 5+).

The "Seeking..." entry points already hint at this. Threads make the connection explicit and browsable.

### Schema

```sql
-- ============================================================
-- EDITORIAL THREADS (curated multi-book reading paths — Phase 5+)
-- ============================================================
CREATE TABLE editorial_threads (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 slug TEXT NOT NULL UNIQUE, -- URL slug: 'yogananda-on-fear'
 title TEXT NOT NULL, -- "Yogananda on Fear"
 description TEXT, -- Brief editorial introduction
 language TEXT NOT NULL DEFAULT 'en',
 is_published BOOLEAN NOT NULL DEFAULT false, -- human review gate
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE TABLE thread_passages (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 thread_id UUID NOT NULL REFERENCES editorial_threads(id) ON DELETE CASCADE,
 chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
 position INTEGER NOT NULL, -- ordering within the thread
 editorial_note TEXT, -- optional editorial transition/context
 UNIQUE (thread_id, position)
);
```

### Route

`/threads` — Index of all published threads.
`/threads/[slug]` — A single thread: sequential passages with editorial transitions, each passage linking to "Read in context" in the full reader.

### Design

- Warm, unhurried layout — passages presented one at a time with generous whitespace
- Each passage shows full citation (book, chapter, page) and "Read in context →" link
- Optional editorial notes between passages provide transitions (never paraphrasing Yogananda — only "In this next passage, written twenty years later, Yogananda returns to..." style framing)
- The thread is a reading experience, not a list — designed for contemplation, not scanning

---

## DES-027: Reverse Bibliography — "What Yogananda Read"

Yogananda frequently references the Bhagavad Gita, the Bible, Kabir, Mirabai, Rumi, Tagore, and scientific figures throughout his published works. A Claude "Classifying" pass extracts these external references and builds a reverse bibliography: a factual, read-only index of every external source Yogananda engages with.

### Implementation

At ingestion time (or as a batch pass over existing chunks), Claude Opus (ADR-014 batch tier) scans each chunk and extracts external references:

```
Claude input: chunk text
Claude output (JSON): [
 {"source": "Bhagavad Gita", "type": "scripture", "nature": "quote"},
 {"source": "Albert Einstein", "type": "person", "nature": "reference"}
]
```

This is a "Classifying" category use — JSON output, no prose. Spot-checked by reviewer.

### Schema

```sql
-- ============================================================
-- EXTERNAL REFERENCES (reverse bibliography — Phase 5+)
-- ============================================================
CREATE TABLE external_references (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT NOT NULL, -- "Bhagavad Gita", "Albert Einstein"
 slug TEXT NOT NULL UNIQUE, -- URL slug: 'bhagavad-gita'
 type TEXT NOT NULL, -- 'scripture', 'person', 'text', 'tradition'
 description TEXT, -- editorial description
 reference_count INTEGER NOT NULL DEFAULT 0, -- denormalized count
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE TABLE chunk_external_references (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
 reference_id UUID NOT NULL REFERENCES external_references(id) ON DELETE CASCADE,
 nature TEXT NOT NULL DEFAULT 'reference', -- 'quote', 'reference', 'discussion', 'allusion'
 tagged_by TEXT NOT NULL DEFAULT 'auto', -- 'auto', 'reviewed', 'manual'
 UNIQUE (chunk_id, reference_id)
);
```

### Route

`/references` — Index of all external sources Yogananda references, with passage counts.
`/references/[slug]` — All passages where Yogananda engages with that source.

**Example:** `/references/bhagavad-gita` — "Yogananda quotes the Bhagavad Gita 47 times across 6 books" with every passage displayed.

### Who This Serves

Scholars, interfaith seekers, and devotees who want to understand Yogananda's intellectual and spiritual lineage. It's data already in the text — surfaced, not generated.

**"Yogananda in Conversation" — the interfaith dimension.** The reverse bibliography is framed as a scholarly index, but it is also the portal's most natural interfaith bridge. Yogananda engaged with the Bible and the Bhagavad Gita, with Christ and Krishna, with Kabir and Rumi, with Einstein and Luther Burbank. The totality of these references forms a map of one tradition's deep engagement with many others — grounded entirely in verbatim text, not in editorial interpretation. For a Christian seeker, `/references/bible` answers "How does Yogananda engage with my scripture?" For a Sufi-inclined visitor, `/references/omar-khayyam` or `/references/kabir` does the same. For an agnostic, the full reference index shows the breadth of Yogananda's intellectual world. The reverse bibliography can carry a secondary editorial framing — "Yogananda in Conversation" — surfacing this cross-tradition engagement as a navigational pathway alongside its scholarly function. The data is identical; the framing acknowledges that these references serve worldview navigation, not just academic cataloging. See also DES-048 § Worldview adaptation and CONTEXT.md § Open Questions (Stakeholder: worldview-sensitive `/guide` pathways).

---

## DES-029: The Quiet Index — Browsable Contemplative Taxonomy

Phase 4 plans E3 (Passage Accessibility Rating) and E8 (Tone Classification). The Quiet Index combines these two planned classifications into a browsable dimension: passages organized by their contemplative texture.

### Passage Textures

| Texture | Description | Example |
|---------|-------------|---------|
| **Contemplative** | Pure devotion, prayer-like, reads as meditation | Passages that slow the reader into stillness |
| **Practical** | Instruction, technique, specific guidance | "Do this exercise for 15 minutes each morning..." |
| **Devotional** | Heart-centered, God-directed, personal yearning | "O Divine Mother, teach me to open the gate..." |
| **Philosophical** | Cosmological, metaphysical, intellectual argument | Discussions of consciousness, creation, maya |
| **Narrative** | Story, autobiography, personal experience | Episodes from Yogananda's life and encounters |

These textures emerge from combining E3 (accessibility level) and E8 (tone classification) — no new AI capability required.

### Route

`/quiet/browse/contemplative`, `/quiet/browse/practical`, `/quiet/browse/devotional` — each shows passages matching that texture, drawn from across all books.

The existing Quiet Corner (`/quiet`) remains the single-affirmation sanctuary. The Quiet Index lives under `/quiet/browse/` to avoid namespace collision with the Quiet Corner route while maintaining the contemplative URL family. `/quiet` = single affirmation sanctuary; `/quiet/browse/[texture]` = browsable contemplative taxonomy.

### Who This Serves

A seeker who arrives at 2 AM seeking comfort needs a different texture than one doing comparative theology research. The intent classifier (E1) handles this at search time; the Quiet Index makes it browsable. It answers the question: "I don't know what I'm searching for, but I know what I *need* right now."

---

## ADR-084: Seeker Feedback — DELTA-Compliant Signal Collection

The portal has no mechanism for seekers to communicate back without violating DELTA principles. Three feedback channels, none storing user identifiers:

### Feedback Types

| Channel | Location | What It Captures |
|---------|----------|-----------------|
| **"Report a citation error"** | Link on every passage (search, reader, share page) | Passage ID + freeform description |
| **"I didn't find what I needed"** | Search results page (empty or sparse results) | Search query + anonymous counter |
| **General feedback** | `/feedback` page (linked from footer) | Topic category + freeform text |

### Data Model

```sql
CREATE TABLE seeker_feedback (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 feedback_type TEXT NOT NULL CHECK (feedback_type IN (
 'citation_error', 'search_miss', 'general', 'accessibility'
)),
 content TEXT, -- freeform description (nullable for search_miss)
 passage_id UUID REFERENCES book_chunks(id), -- for citation errors
 search_query TEXT, -- for search misses
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE INDEX idx_feedback_type ON seeker_feedback(feedback_type, created_at DESC);
```

### API Route

`POST /api/v1/feedback` — rate-limited at 5 submissions per IP per hour (IP is used for rate limiting but not stored in the database).

### PII Mitigation (ADR-099)

The feedback form includes the notice: *"Please do not include personal information (name, email, location) in your feedback."* Feedback entries are reviewed periodically by editorial staff; inadvertent PII is redacted. Entries older than 2 years are eligible for archival aggregation (convert to anonymized statistics, delete raw text).

### Editorial Integration

Feedback appears in the editorial review portal (Phase 4) as a "Seeker Feedback" queue alongside theme tag review and ingestion QA. Citation error reports are highest priority — they directly affect the portal's fidelity guarantee.

---

## DES-033: Unified Review Queue Abstraction

Every content workflow in the portal follows a common pattern: **Request → Draft/Propose → Review → Approve/Revise → Publish → Monitor.** The admin portal handles this for specific content types (theme tags, translations, social media, community collections, feedback) but benefits from a unifying UI pattern that presents all pending work consistently.

### Editorial Home as Unified Queue

The editorial home screen (already designed above) aggregates all review queues. This section specifies the common metadata that enables unified treatment:

| Field | Description |
|---|---|
| **Source** | Who proposed this item: AI, community member, VLD member, seeker feedback, staff |
| **Priority** | Type-based default: citation errors > QA flags > theme tags > community collections > feature suggestions |
| **Age** | How long this item has been waiting for review |
| **Assignee** | Who claimed it (or unassigned) |
| **Session state** | Partially reviewed — resume where you left off |

This is a **UI pattern, not a new data model.** Each underlying content type keeps its own schema and review logic. The editorial home screen queries across all queues and presents a unified summary:

```
┌───────────────────────────────────────────────────────────────┐
│ SRF Teaching Portal — Editorial Home │
│ │
│ Good morning. Here's what needs your attention: │
│ │
│ ┌─────────────────────────┐ ┌─────────────────────────────┐ │
│ │ Theme Tags (23) │ │ Daily Passages (3 gaps) │ │
│ │ ○ Peace (8 new) │ │ Pool: 412 passages │ │
│ │ ○ Courage (6 new) │ │ Next 7 days: needs review │ │
│ └─────────────────────────┘ └─────────────────────────────┘ │
│ │
│ ┌─────────────────────────┐ ┌─────────────────────────────┐ │
│ │ Corrections (3) │ │ Community Submissions (5) │ │
│ │ ● 1 citation error │ │ 2 new, 3 in review │ │
│ │ (high priority) │ │ 1 VLD trusted │ │
│ └─────────────────────────┘ └─────────────────────────────┘ │
│ │
│ ┌─────────────────────────┐ ┌─────────────────────────────┐ │
│ │ Feedback (8) │ │ VLD Briefs (2) │ │
│ │ 1 citation report │ │ 1 open, 1 submitted │ │
│ │ 5 suggestions │ │ │ │
│ │ 2 uncategorized │ │ │ │
│ └─────────────────────────┘ └─────────────────────────────┘ │
│ │
│ Queue Health: │
│ Oldest unreviewed item: 4 days (Theme Tags → Healing) │
│ Items > 7 days: 0 │
└───────────────────────────────────────────────────────────────┘
```

### Queue Health Monitoring

Review queues grow with every phase. Without monitoring, backlogs can exceed a monastic editor's 2–3 hour daily window for weeks.

**Queue health indicators:**
- **Oldest unreviewed item** — displayed on editorial home screen
- **Items exceeding age threshold** — 7 days for standard items, 48 hours for citation errors
- **Queue depth trend** — growing, stable, or shrinking (rolling 14-day window)

**Escalation path:** If any queue exceeds its age threshold, the email digest (existing) highlights the overdue items. If a queue exceeds 2× the threshold, the portal coordinator receives a separate notification. This is operational awareness, not pressure — the goal is to surface backlogs before they compound.

**Service file:** `/lib/services/queue-health.ts` — cross-queue age queries, threshold checks, escalation triggers.

---

## DES-034: Content Lifecycle Management

The portal's content — book text, theme tags, translations, editorial threads, community collections — moves through a lifecycle from creation to publication to maintenance. This section specifies the human workflows and operational procedures that complement the technical architecture.

### Book Ingestion Workflow

**Phase 0a:** PDF → marker → Human QA → Contentful (import via Management API) → batch sync → chunk → embed → Neon.
**Phase 0b+:** Contentful authoring → webhook sync → Neon. Same QA and review steps apply.

#### Pre-Ingestion Planning

Before running the pipeline, the book ingestion operator completes a planning checklist:

1. **Edition confirmation:** Which edition? Page-number reference? (ADR-034)
2. **Structure assessment:** Narrative, collected talks, verse-commentary, chants, or poetry? (ADR-048, ADR-059)
3. **Chunking strategy selection:** Standard paragraph-based, verse-aware, or chant whole-unit?
4. **Special handling:** Devanāgarī content? IAST diacritics? Epigraphs? Poetry blocks? (ADR-080, ADR-048)
5. **Source quality:** PDF scan quality, OCR confidence expectation, known problem areas.

The admin portal surfaces this as a structured form (Phase 4+). For Phases 0–2, the checklist lives in the book's ingestion script configuration.

#### Pipeline Dashboard

After automated processing but before human QA, the operator sees a pipeline summary:

- Chunks generated: count, size distribution (histogram against 100–500 token target range)
- QA flags: count by type (OCR suspect, formatting, truncated, Sanskrit diacritics)
- Chapter status: per-chapter pass/flag count
- Glossary terms: newly identified terms for the Living Glossary
- Theme coverage: top 5 themes represented in the new content

**Service file:** `/lib/services/ingestion.ts` — pipeline status queries, per-book and per-chapter summaries.

#### Staged Publication

New book content is reviewable in a "preview" state before going live:

- **Phase 0a:** `books.is_published` and `chapters.is_published` boolean flags. Unpublished content is visible in the admin portal ("preview as seeker") but excluded from public search and reader routes.
- **Phase 0b+:** Contentful draft/published workflow provides this natively. The webhook sync only processes published entries. The Neon `is_published` flags remain as a cache of Contentful state.

The operator publishes chapter-by-chapter or the whole book at once. Publication triggers chunk relation computation for the new content.

#### Post-Ingestion Verification

After publication, a mini quality check:

1. Run 5–10 representative queries that should return passages from the new book
2. Verify cross-book relations are meaningful (spot-check 3–5 passages)
3. Confirm theme tags were generated and are in the review queue
4. Verify glossary terms were extracted and added to the suggestion index

This can be partially automated as a post-publication Lambda step that reports results to the admin portal.

### Content Correction Workflow

Errors will be found — by staff, by seekers (via feedback, ADR-084), or during re-reading.

#### Citation Error Fast Path

1. Seeker or staff reports incorrect page number, chapter, or book attribution
2. Report enters the QA queue at high priority (citation errors affect the portal's fidelity guarantee)
3. Reviewer verifies against physical book
4. Correction applied in Contentful (syncs to Neon via webhook)
5. Content hash updates. Chunk relations unaffected (text unchanged). Shared links remain stable.

#### Text Correction Path

1. OCR error or transcription mistake discovered
2. Staff corrects the text in the admin portal or Contentful
3. Embedding re-generated for the affected chunk (automated on save)
4. Chunk relations recomputed for that chunk (automated, incremental)
5. Theme tags for the chunk are re-evaluated (enter review queue if the correction changed meaning)

The admin portal presents this as a single "correct and reprocess" action, not a multi-step manual process.

**Service file:** `/lib/services/corrections.ts` — correction application, cascading reprocess triggers, correction audit log.

#### Chunk Boundary Revision

Rarely, a chunk boundary splits a thought badly. The operator may need to split or merge chunks.

This is a high-consequence operation affecting embeddings, relations, theme tags, bookmarks, and shared links. The admin portal requires:

1. Preview of the proposed boundary change with before/after views
2. Impact assessment: "This will affect 3 theme tags, 12 chunk relations, and 0 shared links"
3. Explicit confirmation before execution
4. Automatic cascade: re-embed, re-relate, re-queue affected theme tags for review
5. Content-hash resolution chain (ADR-022) ensures shared links degrade gracefully

### Content Retirement and Edition Updates

When SRF publishes a new edition of a book, the portal's text may become outdated. ADR-034 handles the technical architecture (edition tracking, archival). The human workflow:

1. **Decision:** SRF determines that a new edition should replace the portal's current text. This is a stakeholder decision, not a technical one.
2. **Planning:** Book ingestion operator assesses the scope: How different is the new edition? Page numbers only, or text changes? Full re-ingestion or targeted corrections?
3. **Execution:** Old edition archived (not deleted). New edition ingested through the standard pipeline. Chunk relations recomputed. Theme tags re-evaluated.
4. **Verification:** Shared links tested against the content-hash resolution chain. Bookmarks checked for graceful degradation. Search quality verified.
5. **Communication:** If shared links to specific passages changed, the portal's "passage may have moved" fallback (ADR-022) activates. No seeker-facing announcement needed — the resolution chain handles it silently.

### Operational Playbook

By year 3, the people operating the portal may be different from those who built it. The architectural documentation (this file, DECISIONS.md) captures *why* decisions were made. The **operational playbook** captures *how to do the work:*

- How to add a new book (pre-ingestion checklist through post-publication verification)
- How to handle a translation batch (reviewer onboarding, glossary setup, batch review, approval)
- How to review community collections (evaluation criteria, feedback templates, featured promotion)
- How to respond to a citation error (verification, correction, cascade)
- How to create a curation brief for VLD members (brief structure, editorial guidance, deadline setting)
- How to onboard a new staff member to the admin portal
- How to run the quarterly backup restore drill

**Location:** `/docs/operational/playbook.md` — created during Phase 4 when the editorial review portal ships. Updated as new workflows are added in subsequent phases. Referenced from the admin portal's help section.

---

## DES-035: AI-Assisted Editorial Workflows

The portal uses AI (Claude via AWS Bedrock) throughout the content pipeline. This section consolidates all AI-human collaboration patterns into a single reference. The governing principle is consistent: **AI proposes, humans approve.** Automated intelligence improves efficiency; human judgment ensures fidelity.

**Corpus access pattern:** All AI workflows access the teaching corpus through MCP tools (ADR-101, DES-031 Tier 2) rather than ad-hoc service layer calls. This provides a canonical, auditable interface — every AI proposal can be traced to the exact MCP queries that informed it. The MCP tools are thin wrappers around `/lib/services/` functions; the service layer is the source of truth. See DES-031 § Internal MCP use cases by consumer for the tool-to-workflow mapping.

### Existing AI-Assisted Workflows (Designed in Individual ADRs)

| Task | AI Role | Human Role | Phase | ADR |
|---|---|---|---|---|
| Theme tag classification | Proposes tags with confidence scores | Approves/rejects per passage | 4 | ADR-032 |
| Query expansion | Expands conceptual queries to search terms | Reviews spiritual-terms.json periodically | 0 | ADR-005 E2 |
| Ingestion QA | Flags probable OCR errors, formatting issues | Makes every correction decision | 0 | ADR-005 E4 |
| Tone classification | Classifies passage tone (consoling/joyful/challenging/contemplative/practical) | Spot-checks | 4 | ADR-005 E8 |
| Accessibility rating | Classifies passage depth (universal/accessible/deep) | Spot-checks | 4 | ADR-005 E3 |
| UI string translation | Drafts translations for all ~200–300 UI strings | Reviews every string before production | 10 | ADR-078 |
| Alt text generation | Generates reverential alt text for photographs | Reviews before publication | 1 | ADR-005 E7 |
| Social media captions | Generates caption text with citation | Reviews and edits before posting | 8 | ADR-092 |
| Relation type classification | Classifies cross-book relation types | Spot-checks | 5 | ADR-005 E6 |
| External reference extraction | Extracts Bible, Gita, Patanjali references from text | Three-state review (auto → reviewed → manual) | 5 | DES-027 |
| `/guide` page drafts (need-based) | Drafts recommendation text for seeker need pathways | Reviews before publication | 4 | DES-048 |
| `/guide` worldview pathways | Generates corpus-grounded guide sections for 12 worldview perspectives using seed queries, reverse bibliography, and vocabulary bridge | Theological review before publication | 4+ | DES-048, DES-027 |
| `/guide` life-phase pathways | Generates guide sections for 9 life-phase perspectives using tone filters, accessibility levels, situation themes, and characteristic questions as generation anchors | Editorial + theological review | 4+ | DES-048 |
| `/guide` practice pathway | Drafts the "If You Feel Drawn to Practice" pathway framing text, selecting corpus passages about the primacy of practice and Kriya Yoga's public description | Theological review before publication | 4 | DES-048, ADR-104 |
| Practice bridge candidate tagging | Proposes `practice_bridge: true` on passages where Yogananda explicitly invites the reader to practice | Human approval required for every tag | 4+ | ADR-104 |
| Search intent classification | Routes queries to optimal experience (theme/reader/empathic/search/practice) | Implicit — classification rules are human-authored | 0 | ADR-005 E1 |
| Search quality evaluation | Automated judge assessing search result relevance in CI | Sets expected-passage test suite | 0 | ADR-005 E5 |
| Portal update drafting | Reads deployment metadata and git history, drafts seeker-facing release note in portal voice (ADR-074) | Reviews and edits before publication | 4 | ADR-105 |

### Additional AI-Assisted Workflows

These workflows extend the existing pattern to additional editorial tasks. Each follows the same "AI proposes, humans approve" principle.

#### UI Copy Generation (Top-N Choices)

For every new UI string (error messages, empty states, ARIA labels, loading text, confirmation dialogs), Claude generates 3 ranked options following the portal editorial voice guide (ADR-074). The default is the top-ranked choice. Human editor can accept, select an alternative, or edit.

```
┌──────────────────────────────────────────────────────────────┐
│ New String: search.empty_state │
│ Context: Shown when search returns no results │
│ Tone: Warm, honest, not apologetic (ADR-074) │
│ │
│ ● Option 1 (recommended): │
│ "The teachings don't have a direct answer for that — │
│ but exploring related themes may help." │
│ │
│ ○ Option 2: │
│ "We didn't find teachings matching your search. Try │
│ different words, or explore a theme below." │
│ │
│ ○ Option 3: │
│ "No passages found for this search. The teachings may │
│ address this differently — try a related theme." │
│ │
│ [Accept Selected] [Edit] [Regenerate] │
└──────────────────────────────────────────────────────────────┘
```

**Phase:** 1 (when UI strings are first externalized to `messages/en.json`). The AI draft workflow becomes part of the locale file creation process for every subsequent phase. Consistent with ADR-074 editorial voice guide and ADR-078 translation workflow.

**Service file:** `/lib/services/copy.ts` — UI copy generation, option ranking, editorial voice prompt construction.

#### Daily Passage Pre-Curation

Claude reviews the next 14 days of daily passages and suggests adjustments:
- Calendar alignment: "March 7 is Mahasamadhi — the current random selection doesn't match. Here are 3 alternatives."
- Tonal variety: "The last 5 days are all contemplative — here's a joyful alternative for day 6."
- Content appropriateness: "This passage references meditation technique and may be too specialized for the homepage — flagged for review."
- Circadian fit: late-night passages should lean consoling, not challenging .

Human editor reviews Claude's suggestions alongside the current 14-day schedule, accepts/adjusts/ignores. This runs as a weekly scheduled task surfaced in the editorial home screen.

**Phase:** 4 (alongside daily passage curation workflow).

#### Calendar-Aware Content Suggestions

When a calendar event approaches (within 30 days), Claude scans the corpus for thematically related passages and suggests passage-event associations. For example, approaching Christmas meditation: Claude identifies passages about Christ, the Nativity, and universal spirituality from across the library. Human curator reviews, selects, and links.

**Phase:** 4 (alongside calendar event management, deliverable 4.8).

#### Community Collection Pre-Review

Before staff sees a community collection submission, Claude provides a preliminary assessment:

- Citation completeness: "All 12 passages have valid book/chapter/page citations ✓"
- Cross-corpus coverage: "Passages span 4 books ✓"
- Content integrity: "Personal notes are present and visually distinct from Yogananda's text ✓"
- Theological coherence flag: "Passage #7 appears to be about meditation technique, but the collection is themed 'Friendship.' Recommend staff verify."
- Decontextualization risk: "Passage #3 is about death and may read differently outside its chapter context — suggest staff check."

This does **not** auto-approve or auto-reject. It reduces the reviewer's cognitive load by pre-screening for common issues, allowing the human reviewer to focus on theological judgment.

**Phase:** 14 (alongside community collection gallery, deliverable 14.9).

#### Curation Brief Drafting

Staff describes a high-level need ("We need a collection about courage for autumn"), and Claude drafts a structured curation brief:

- Suggested title
- Description with editorial guidance
- Recommended source books (based on theme tag density)
- 3–5 seed passages as starting points

Staff edits and publishes the brief. VLD members see a well-structured assignment with concrete guidance, reducing the ambiguity that makes volunteer work difficult.

**Phase:** 14 (alongside VLD curation pipeline, deliverable 14.11).

#### Feedback Categorization

Seeker feedback (ADR-084) arrives as free text. Claude categorizes it before it enters the review queue:

| Category | Priority | Routing |
|---|---|---|
| Citation error | High | QA queue |
| Text error (OCR, formatting) | High | QA queue |
| Feature suggestion | Normal | Feature request log |
| Search quality complaint | Normal | Search quality review |
| Praise / gratitude | Low | Archive (morale visibility in editorial home) |
| Off-topic / spam | Low | Flag for dismissal |
| Crisis language | Immediate | Alert per ADR-071 protocol |

Human sees pre-categorized feedback with Claude's reasoning, adjusts categories as needed. The categorization itself is never shown to the seeker — it's an internal routing aid.

**Phase:** 4 (alongside seeker feedback mechanism, deliverable 4.17).

#### Ingestion Changelog Generation

After a new book is ingested, Claude generates a human-readable summary:

- "942 passages extracted across 48 chapters"
- "12 OCR flags awaiting review"
- "17 new glossary terms identified"
- "Top 5 themes: Meditation (142 passages), Self-Realization (89), Divine Love (76), Devotion (63), Yoga (51)"
- "Estimated review time: 2–3 hours for QA flags"

Staff gets a concise summary without querying the database. Displayed in the admin portal's pipeline dashboard.

**Phase:** 3 (alongside book ingestion workflow improvements).

#### Worldview Guide Pathway Generation (Corpus-Grounded)

Claude generates draft `/guide` pathway sections for each worldview perspective, grounded entirely in the SRF corpus. This is the most editorially sensitive AI-assisted workflow — it determines how seekers from different traditions encounter the teachings — and requires theological review, not just editorial review.

**Trigger:** On-demand from admin portal ("Generate guide pathways"), or after a new book ingestion introduces significant new cross-tradition content (e.g., *The Second Coming of Christ* creates the Christian pathway; *Wine of the Mystic* creates the Sufi/poetry pathway).

**Generation pipeline:**

1. Admin selects a perspective from the worldview catalog (see DES-048 § Worldview Pathway Catalog)
2. Claude Opus (batch tier, ADR-014) receives:
   - A perspective-specific prompt template (see below)
   - Corpus search results for that perspective's seed queries (via Neon, same queries as SRF Corpus MCP)
   - Reverse bibliography entries matching that perspective's tradition (DES-027)
   - Vocabulary bridge entries for that perspective's categories from `spiritual-terms.json`
   - Current theme taxonomy with passage counts
3. Claude outputs structured JSON:
   - Title and framing paragraph (navigational, never paraphrasing Yogananda — ADR-001)
   - 2–3 recommended resources per pathway (book, theme, reading thread, reference index, Quiet Corner)
   - Framing text for each recommendation
   - Bridge vocabulary highlights (3–5 terms mapping the perspective's vocabulary to Yogananda's)
   - 3–5 representative passage IDs selected from search results
   - For each recommendation slot: top-3 alternatives with reasoning, so the reviewer chooses
4. Output enters editorial review queue as `tagged_by = 'auto'`
5. Theological reviewer sees:
   - The generated pathway with all passages displayed inline
   - Claude's reasoning for each selection ("Selected because this passage directly addresses Christ Consciousness using language accessible to Christian readers")
   - Alternative options per slot
   - Accept / edit / reject controls
6. On approval (`tagged_by = 'reviewed'`), content is committed to `messages/{locale}.json` and deployed via normal release process

**Prompt template structure** (one per perspective, versioned in `/lib/data/guide-prompts/`):

```
You are generating a guide pathway for the SRF teachings portal.

PERSPECTIVE: {perspective_name}
DESCRIPTION: {perspective_description}

You have access to:
- CORPUS_RESULTS: Passages matching these queries: {seed_queries}
- REFERENCES: External sources Yogananda references from this tradition: {reference_data}
- BRIDGE_TERMS: Vocabulary mappings for this perspective: {bridge_entries}
- THEMES: Relevant theme pages with passage counts: {theme_data}
- BOOKS: Available books with descriptions: {book_data}

Generate a guide pathway section following these rules:
1. The title uses "If you..." phrasing: warm, inviting, never presumptuous
2. The framing paragraph (2-3 sentences) is navigational — it tells the seeker WHERE to go, not WHAT to think
3. Never paraphrase or summarize Yogananda's words — only point to where they live
4. Select 2-3 recommendations (a book, a theme, a reference index, a reading thread, the Quiet Corner)
5. For each recommendation, write one sentence of editorial framing
6. Identify 3-5 bridge terms that map this perspective's vocabulary to Yogananda's
7. Select 3-5 representative passages that would resonate with this perspective
8. For each recommendation slot, provide your top choice and 2 alternatives with brief reasoning

Output format: {json_schema}
```

**Development-time iteration:** During development, the SRF Corpus MCP server (ADR-097, DES-031) lets Claude Code test pathway generation interactively — "generate a guide pathway for Buddhist meditators" — and refine prompts until quality is high. The polished prompt templates are then deployed for the admin portal batch workflow.

**Life-phase pathway generation:** Uses the same pipeline with a different prompt template structure. Instead of tradition-specific seed queries and vocabulary bridges, life-phase prompts use:
- The characteristic question as the generation anchor ("Is this all there is?")
- Tone filters (`consoling`, `practical`, `contemplative`, etc.) to select passages matching the season's emotional register
- Accessibility level constraints (level 1 for youth pathways, level 2–3 for elder/approaching-end pathways)
- Situation theme associations as content sources (the Parenting theme feeds the Raising a Family pathway)
- Autobiography chapter mapping — which chapters in Yogananda's own life story speak to this season

Life-phase prompts are stored alongside worldview prompts in `/lib/data/guide-prompts/` with a `life-phase/` subdirectory.

**Regeneration after corpus growth:** When a new book is ingested (Phase 3+), the admin portal flags which worldview and life-phase pathways may benefit from regeneration based on the new book's theme density and reference profile. E.g., ingesting *The Second Coming of Christ* triggers a regeneration flag for the Christian contemplative pathway; ingesting *Scientific Healing Affirmations* triggers a flag for the Facing Illness life-phase pathway. Staff decides whether to regenerate, and regenerated drafts go through the same review pipeline.

**Phase:** 4+ (requires theme system, reverse bibliography, vocabulary bridge, editorial review infrastructure). Initial pathways generated for English; Phase 10 adds per-locale cultural adaptation of each pathway.

**Service file:** `/lib/services/guide-generation.ts` — prompt template loading, corpus query orchestration, structured output parsing, admin portal integration.

#### Impact Report Drafting

For the annual "What Is Humanity Seeking?" report (Phase 14, deliverable 14.8), Claude drafts narrative text from aggregated data:

- "In 2027, seekers from 142 countries searched the portal. The most common theme was 'peace' — reflecting a world seeking inner stillness."
- "Grief-related searches peaked in November, suggesting a seasonal pattern of reflection around holidays and year's end."
- "The fastest-growing theme was 'meditation' — up 40% from Q1 to Q4 — suggesting rising interest in practice, not just reading."

Human curator edits the draft into the final report. The data is real; the narrative framing is AI-drafted, human-approved.

**Phase:** 14 (alongside annual report, deliverable 14.8).

### AI Tone in the Admin Portal

The AI's voice in staff-facing interfaces should match the portal's contemplative character. Not performative enthusiasm ("AI has completed 23 tasks!") but quiet assistance:

- "Here are today's suggestions for your review."
- "This passage was flagged because the OCR confidence was low for the Sanskrit text."
- "Claude's recommendation: approve. Confidence: high. Reasoning: strong thematic alignment with 'Peace' across 3 similar passages already tagged."

The admin portal's AI-generated text follows the same editorial voice guide (ADR-074) as seeker-facing copy — warm, honest, not mechanical.

### Workflow Maturity Model (ADR-100)

The "AI proposes, humans approve" principle is the permanent default. But over a decade, as the corpus grows and editorial demands multiply, some workflows earn graduated trust through consistent accuracy. ADR-100 establishes a three-stage maturity model:

| Stage | Human Involvement | Graduation Criteria |
|---|---|---|
| **Full Review** | Approves every item | Default — no criteria needed |
| **Spot-Check** | Reviews 10–20% sample + flagged items | ≥ 500 items, ≥ 95% approval rate, ≥ 3 months, theological sign-off |
| **Exception-Only** | Reviews only AI-abstained or low-confidence items | ≥ 2,000 items at Spot-Check, ≥ 98% approval, ≥ 6 months, coordinator sign-off |

**Permanently Full Review workflows:** Worldview pathway generation, life-phase pathway generation, community collection approval, crisis language detection. These never graduate — the theological judgment required is irreducible.

Stage transitions are per-workflow, per-language, governed, auditable, and reversible. Any theological error or sustained override pattern (> 15% in 30 days) triggers automatic regression. See ADR-100 for full governance specification.

### Feedback Loop Protocol (ADR-100)

AI proposals improve over time through systematic feedback, not model fine-tuning:

**Override tracking.** Every reviewer action (approve, reject, edit, select alternative) is logged in `ai_review_log` with the workflow type, AI proposal, reviewer decision, and optional rationale. This table is internal — never exposed to seekers, never used for analytics.

**Prompt refinement cadence.** Quarterly, the portal coordinator reviews override patterns:
- Workflows with > 10% override rate → prompt revision required
- Consistent override patterns (e.g., "always rejects 'Joy' for passages about sacrifice") → pattern added as negative example in the prompt
- Refined prompts are versioned; previous versions archived in `/lib/data/prompt-archive/`

**Confidence calibration.** AI confidence scores are compared against actual approval rates quarterly. If the AI is consistently confident about rejected proposals, the routing threshold is raised. If consistently uncertain about approved proposals, the threshold is lowered.

**Service file:** `/lib/services/ai-review.ts` — override logging, quarterly report generation, confidence calibration queries.

### AI Observes — Passive Intelligence Pattern

"AI proposes, humans approve" is an active pattern — the AI generates, the human reviews. The portal also needs a complementary passive pattern: **"AI observes, humans are informed."** These are not proposals requiring approval. They are ambient awareness surfaced in the editorial home screen as low-priority informational items.

| Observation Type | Example | Cadence |
|---|---|---|
| **Theme diversity drift** | "The theme 'Peace' is now 60% dominated by passages from one book. Diversity has decreased since Phase 5." | Weekly |
| **Classification staleness** | "142 theme tags were classified > 18 months ago with prompt version 1.2. Current prompt is 2.1. Reclassification may improve accuracy." | Monthly |
| **Coverage gaps** | "No passages in the corpus address 'Forgiveness' from a practical perspective — only contemplative. This affects the Facing Guilt life-phase pathway." | After each book ingestion |
| **Cross-workflow inconsistency** | "Passage #247 is tagged 'joyful' by tone classification but selected for the Grief & Loss guide pathway." | Nightly batch |
| **Engagement signal anomalies** | "The 'Healing' theme page shows 3× higher passage-resonance signals than any other theme. The theme may benefit from subdivision." | Monthly |

Observations are **never actionable recommendations** — they state a condition. The editorial team decides whether the condition matters. Many observations will be dismissed. The AI doesn't need to know which.

**Phase:** 4 (alongside editorial home screen, which becomes the natural surface for observations).

**Service file:** `/lib/services/ai-observations.ts` — observation generation, staleness detection, diversity metrics, consistency checks.

### AI Abstains — Confidence-Aware Routing

Sometimes the right AI behavior is to decline. A low-confidence proposal can be worse than no proposal, because it anchors the reviewer's judgment rather than allowing them to form their own assessment of the content.

**Abstention triggers:**
- Passage in a script the model cannot reliably process (Devanāgarī-heavy content for tone classification)
- Fewer than 3 corpus passages available for a pathway generation slot
- Confidence score below a per-workflow floor (calibrated during Full Review stage)
- Content outside the model's observed distribution (e.g., chant-prose hybrid in a theme classifier trained on prose)

**Reviewer experience:** When the AI abstains, the queue item is marked `ai_abstained = true` with a brief explanation ("Insufficient corpus coverage for Sufi poetry pathway — only 2 relevant passages found"). The reviewer sees the raw content with no AI pre-classification. The abstention reason provides context without anchoring.

**Abstention rates** are tracked per workflow as a health metric. Rising abstention in a workflow signals either corpus gaps or prompt degradation — both worth investigating.

**Phase:** 0 (abstention capability ships with the first AI-assisted workflow; confidence floors are calibrated during Full Review operation).

### Workflow Dependency Graph

DES-035 workflows have implicit dependencies. When an upstream workflow's output changes, downstream consumers may need re-evaluation.

```
                    ┌──────────────┐
                    │ Ingestion QA │
                    └──────┬───────┘
                           │ text corrections invalidate downstream
                           ▼
              ┌────────────────────────┐
              │ Theme Tag Classification│──────────────┐
              └────────────┬───────────┘              │
                           │                          │
              ┌────────────▼───────────┐   ┌──────────▼──────────────┐
              │ Tone Classification    │   │ Worldview Pathway Gen.  │
              └────────────┬───────────┘   └──────────▲──────────────┘
                           │                          │
              ┌────────────▼───────────┐   ┌──────────┴──────────────┐
              │ Daily Passage Curation │   │ External Ref Extraction │
              └────────────────────────┘   └─────────────────────────┘

              ┌────────────────────────┐   ┌─────────────────────────┐
              │ Feedback Categorization│──►│ Content Correction      │
              └────────────────────────┘   │ (DES-034)               │
                                           └─────────────────────────┘
```

**Staleness signaling:** When an upstream workflow's output changes (OCR correction alters passage text, a theme tag is reclassified), downstream workflows that consumed the old output are flagged in the editorial queue: "This passage's theme tags changed since it was included in the Christmas pathway. Review recommended." This is not automatic re-execution — it is a staleness signal that the editor can act on or dismiss.

**Phase:** 4 (staleness signaling requires the editorial queue infrastructure).

### Unified Prompt Versioning

DES-035 § Worldview Guide Pathway Generation specifies versioned prompt templates in `/lib/data/guide-prompts/`. All other AI-assisted workflows also depend on system prompts that will evolve over time — but only the worldview pathway has explicit versioning.

**All AI-assisted workflow prompts** are versioned under a unified directory structure:

```
/lib/data/ai-prompts/
  theme-classification/
    v1.0.md          ← initial prompt
    v1.1.md          ← quarterly refinement (2027-Q2)
    CHANGELOG.md     ← override patterns that motivated each revision
  tone-classification/
    v1.0.md
  query-expansion/
    v1.0.md
  guide-prompts/
    worldview/
      christian-contemplative.md
      buddhist-meditator.md
      ...
    life-phase/
      young-seeker.md
      ...
  feedback-categorization/
    v1.0.md
  ingestion-qa/
    v1.0.md
  ...
```

Each prompt file includes:
- The system prompt text
- The input schema (what data the prompt receives)
- The output schema (what structure the prompt produces)
- Version date and author
- Override patterns from the previous version that motivated the revision (from `ai_review_log` quarterly analysis)

**Why this matters for a 10-year project:** When the theological reviewer who spent 3 years refining worldview prompts moves to a different role, the prompt files preserve *what* was refined. The `CHANGELOG.md` files preserve *why* — which override patterns, which edge cases, which editorial judgments shaped the current prompt. This is institutional memory that survives staff turnover.

The existing `/lib/data/guide-prompts/` directory is subsumed into the unified structure. The `/lib/data/spiritual-terms.json` vocabulary bridge remains a separate file consumed by multiple prompts.

**Phase:** 0 (directory structure created at repo setup; initial prompts for search intent classification and ingestion QA are the first entries).

*Section revised: 2026-02-21, ADR-100 deep exploration — added maturity model, feedback loops, AI Observes, AI Abstains, dependency graph, unified prompt versioning*

---

## DES-036: Migration, Evolution, and Longevity

The portal may be maintained for a decade. These architectural decisions ensure the codebase remains maintainable as teams change.

### Database Migrations

Numbered SQL migration files in `/migrations/`, applied via **dbmate** (SQL-based, no ORM lock-in):

```
migrations/
 001_initial_schema.sql
 002_add_places_table.sql
 003_add_chunk_places.sql
 004_add_email_subscribers.sql
```

Each migration is reviewed in Git, tested against a Neon branch, and reversible. Neon's branching capability allows safe migration testing: create a branch, apply the migration, verify, delete the branch (or merge to main).

**Why dbmate over Drizzle/Prisma Migrate:** SQL-based migrations have zero framework coupling. A future developer can read and understand raw SQL without knowing Drizzle's API. The migrations are the most long-lived artifact in the codebase — they should be in the most stable language.

### Dependency Management

- **Renovate** configured on the repo for automated dependency update PRs
- Production dependencies pinned to exact versions (not ranges)
- Quarterly review of major version upgrades (especially Next.js, which releases major versions annually)
- `package.json` engines field specifies minimum Node.js version

### Framework Exit Strategy

The shared service layer (ADR-011) is pure TypeScript with no Next.js dependency. If SRF ever migrates away from Next.js:
- `/lib/services/` — portable, zero framework dependency
- `/app/` (Server Components, Route Handlers) — framework-specific, would be rewritten
- `/migrations/` — portable, raw SQL
- Contentful webhook sync — portable, standard HTTP handler

The business logic (search, passage retrieval, theme queries) survives a framework change. Only the presentation layer is coupled.

### Data Portability

All content lives in Neon (PostgreSQL) — standard SQL, exportable via `pg_dump`. Embeddings in pgvector use standard float arrays. No vendor-specific data formats. Contentful content is exportable via their API. There is no vendor lock-in on content.

### Documentation as Longevity Tool

The ADR convention (DECISIONS.md) is the most undervalued longevity tool. When a future developer asks "why didn't we use GraphQL?" or "why not embed Google Maps?" — the answer is recorded with full context. This prevents teams from revisiting settled decisions and accidentally undoing architectural choices that had good reasons.

### ADR-004: 10-Year Horizon

The architecture is designed so that **nothing needs to be thrown away and rebuilt from scratch.** Every component can be replaced incrementally. The most valuable artifacts (data, logic, decisions) are in the most durable formats.

| Horizon | What Holds | What May Change |
|---------|-----------|-----------------|
| **3 years (2029)** | Everything. Minor dependency upgrades. | Library versions. |
| **5 years (2031)** | Core data model, service layer, migrations, ADRs. | Embedding model (swap via ADR-046). Possibly CMS or auth provider. |
| **7 years (2033)** | Database, APIs, Terraform, service functions. | Next.js may be superseded. UI layer rewrite against same APIs. |
| **10 years (2036)** | PostgreSQL schema, SQL migrations, service logic, ADRs. | UI framework, some SaaS integrations will have evolved. |

**The five longevity guarantees:**

1. **All data in PostgreSQL.** Nothing lives exclusively in a SaaS tool.
2. **Business logic is framework-agnostic.** `/lib/services/` is pure TypeScript.
3. **Raw SQL migrations.** dbmate `.sql` files don't depend on any framework version.
4. **Standard protocols at boundaries.** OAuth 2.0, REST + JSON, SQL, HTTP, `hreflang`.
5. **Decisions are documented.** ADRs capture *why* every choice was made.

### ADR-046: Embedding Model Migration

The `book_chunks` table includes `embedding_model`, `embedding_dimension`, and `embedded_at` columns to support incremental model migration:

```
Model swap workflow:
 1. Benchmark new model on Neon branch (sample of 100 chunks)
 2. Run search quality test suite against new embeddings
 3. If improved: re-embed all chunks in background batches
 4. During transition: query both old and new vectors, merge via RRF
 5. After completion: drop old vectors, update indexes
```

For dimension changes (e.g., 1536 → 3072), add a new vector column, build HNSW index, re-embed, then drop the old column. The search function handles both during transition.

### Content Export

The portal can export its entire content graph via standard PostgreSQL tools:

```bash
pg_dump --format=custom --no-owner portal_db > portal_export.dump
pg_restore --no-owner -d new_portal_db portal_export.dump
```

This is inherent in using PostgreSQL — not a feature to build, but a capability to document and protect. The export includes all books, chapters, chunks (with embeddings), themes, places, passage cross-references, and subscriber data.

---

## ADR-007: Editorial Proximity Standard

> **Phase:** — (cross-cutting, applies to all phases that place non-Yogananda prose near sacred text)

Multiple features place portal-authored prose within visual proximity of Yogananda's verbatim text: editorial reading threads (DES-026), glossary definitions, search suggestion hints (ADR-049), crisis resource text (ADR-071), social media captions (ADR-092), magazine articles, the `/guide` page (DES-047), and chant instructions metadata (ADR-059). Each feature has its own ADR, but no single standard governs the shared boundary. This section establishes one.

### The Principle

Yogananda's verbatim words and portal-authored prose occupy **distinct visual and structural layers**. A seeker should never need to wonder whether they are reading Yogananda or the portal. The distinction must be evident to sighted users, screen reader users, and users of any assistive technology.

### Visual Rules

| Element | Treatment |
|---------|-----------|
| **Yogananda's verbatim text** | Merriweather serif, standard body size, warm cream background. The default. |
| **Citations** (book, chapter, page) | Lora italic, smaller size, SRF Navy. Visually subordinate, never omitted. |
| **Editorial prose** (thread notes, glossary definitions, `/guide` introductions, magazine articles) | Open Sans, slightly smaller size, left border accent (SRF Gold, 2px). Clearly portal voice. |
| **Functional prose** (search hints, UI chrome, empty states, ARIA labels) | Open Sans, system-appropriate size. No border accent — it is part of the interface, not content. |
| **Crisis resources** | Open Sans, muted tone, bottom-positioned. Present but never competing with the passage. |
| **User-authored notes** (study workspace) | Distinct background tint, user's own font choice where supported, labeled "Your note." Never adjacent to sacred text without a visual separator. |

### Structural Rules

1. **Sacred text is never inline with editorial prose.** Passages and editorial notes occupy separate `<article>` or `<section>` elements. Screen readers announce them as distinct regions.
2. **Attribution is structural, not decorative.** Citations are in `<cite>` elements, linked to the source. They are not CSS flourishes that disappear on mobile.
3. **Editorial notes identify their author class.** Thread notes carry "Portal editorial" attribution. Magazine articles carry author bylines. Community collections carry "Curated by [name/anonymous]." Yogananda's text carries no attribution beyond the citation — it needs no introduction.
4. **Glossary definitions link to source passages.** Every definition of a spiritual term must cite at least one passage where Yogananda himself defines or uses the term. Definitions are *derived from* the corpus, not *imposed on* it.
5. **Social media captions never paraphrase.** Captions provide context ("From Chapter 26 of Autobiography of a Yogi") or an editorial framing question ("What does it mean to be still?") — never a restatement of what Yogananda said. The quote image contains the verbatim text; the caption exists in a separate field.
6. **Maximum editorial proximity ratio.** On any page where editorial prose appears alongside sacred text, the sacred text must be the dominant visual element. Editorial framing should not exceed approximately one-third of the visible content area when a passage is displayed.

### Accessibility Implications

- Screen readers must announce the transition between sacred text and editorial prose. Use `aria-label` or `role="note"` on editorial elements.
- The visual distinction (serif vs. sans-serif, border accent) must have a non-visual equivalent. Color alone is insufficient (WCAG 1.4.1).
- Focus order places the sacred text first in the reading sequence. Editorial framing follows, not precedes.

### Features Governed

| Feature | Sacred Text | Adjacent Prose | Boundary Mechanism |
|---------|------------|----------------|-------------------|
| Search results | Verbatim passage + highlight | None (UI chrome only) | N/A — pure sacred text |
| Editorial reading threads (DES-026) | Verbatim passages | Transition notes between passages | Left-border accent, "Portal editorial" label |
| Glossary (ADR-005 E2) | Linked source passages | Term definitions | Definition in Open Sans; passage quotes in Merriweather |
| Daily email | Verbatim passage | Citation + "Read in context" link | Email template structure |
| Social media (ADR-092) | Quote image (verbatim) | Caption (separate field) | Image/text separation, human review |
| Magazine articles | Embedded block quotes | Monastic commentary | Block quote with citation, author byline on article |
| `/guide` page (DES-047) | Linked passages | Editorial introductions | Section headers + visual separation |
| Crisis resources (ADR-071) | Passage about death/suffering | Helpline information | Bottom-positioned, muted treatment |
| Study workspace (ADR-083) | Collected passages | User's personal notes | Distinct background tint, "Your note" label |
| Chant reader (ADR-059) | Chant text | Practice instructions, mood classification | Instructions in metadata panel; text in main area |
| Community collections (ADR-086) | Curated passages | Curator's description | "Curated by [name]" label, Open Sans for description |

*Section added: 2026-02-21, ADR-007*

---

## DES-037: Observability

The portal uses the SRF-standard observability stack with DELTA-compliant configuration. See ADR-095.

### Tool Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| **Error tracking** | Sentry | Unhandled exceptions, API errors, client-side errors. Next.js source maps. |
| **APM** | New Relic | API route latency, database query duration, Claude API/OpenAI call timing. Distributed tracing. |
| **Synthetic monitoring** | New Relic Synthetics | Uptime checks: `/`, `/api/v1/search`, `/api/v1/health`, `/quiet`. |
| **Product analytics** | Amplitude | DELTA-compliant: event counts only. No user identification, no session tracking, no autocapture. |
| **Log aggregation** | Vercel Logs → New Relic | Structured JSON logs with request ID correlation. |
| **Frontend performance** | Vercel Analytics | Core Web Vitals (LCP, CLS, INP). Cold start monitoring. |

### Health Check Endpoint

```
GET /api/v1/health

Response:
{
 "status": "ok",
 "version": "1.0.0",
 "database": "connected",
 "timestamp": "2026-02-17T12:00:00Z"
}
```

### Structured Logging (`/lib/logger.ts`)

Every API route logs a consistent JSON structure:

```typescript
interface RequestLog {
 requestId: string; // UUID, propagated across services
 route: string; // e.g., "/api/v1/search"
 method: string; // GET, POST
 statusCode: number;
 durationMs: number;
 language: string; // User's locale
 timestamp: string; // ISO 8601
}

// Additional fields for search routes (anonymized)
interface SearchLog extends RequestLog {
 query: string; // The search query
 resultCount: number;
 searchMode: string; // "hybrid", "fts", "vector"
 expansionUsed: boolean; // Whether Claude query expansion was invoked
}
```

No user identification. No IP addresses. No session IDs.

### DELTA-Compliant Amplitude Configuration

| Amplitude Feature | Setting | Reason |
|-------------------|---------|--------|
| User identification | **Disabled** | Seekers are not data points (Dignity) |
| Session tracking | **Disabled** | Optimizes for retention (violates Agency) |
| Event sequencing | **Disabled** | Builds behavioral profiles (violates Agency) |
| Autocapture | **Disabled** | Surveillance by default (violates Dignity) |

**Amplitude event allowlist:**

| Event | Properties | Metric It Supports |
|-------|-----------|-------------------|
| `page_viewed` | `{ page_type, language, requested_language, country_code }` | Countries reached, languages served, unmet language demand |
| `passage_served` | `{ book_slug, language }` | Books/passages served |
| `share_link_generated` | `{ format }` | Share link generation count |
| `center_locator_clicked` | `{}` | Digital → physical bridge |
| `search_performed` | `{ language, result_count, zero_results }` | Search usage volume, zero-result rate |

**`requested_language` rationale:** The `page_viewed` event carries `language` (the locale actually served) and `requested_language` (the seeker's `Accept-Language` header preference). The delta between requested and served is a direct measure of unmet language demand — e.g., how many seekers per week arrive wanting Hindi but receive English. This signal is impossible to backfill and directly informs Phase 10 language prioritization. When `requested_language === language`, the property adds no information and can be elided in analysis.

**`zero_results` rationale:** The `search_performed` event's `zero_results` boolean tracks searches that return no passages. The zero-result rate is the portal's single most actionable operational metric: a rising rate signals corpus gaps, query expansion failures, or search pipeline regressions. The Phase 6 Retool dashboard (deliverable 6.4) should surface zero-result rate trend and the most common zero-result queries as top-level indicators.

### Standing Operational Metrics

Beyond the Amplitude event allowlist and APM tooling, the following derived metrics should be computed and surfaced in the Phase 6 Retool dashboard for ongoing operational awareness:

| Metric | Source | Refresh | Dashboard |
|--------|--------|---------|-----------|
| Zero-result rate (% of searches returning 0 passages) | `search_performed` events | Daily | Retool (staff) |
| Most common zero-result queries (top 20) | `search_queries` table | Daily | Retool (staff) |
| Search degradation mode distribution | Structured logs (`searchMode` field) | Daily | Retool (staff) |
| AI cost (Claude Haiku calls × per-call cost) | AWS Bedrock billing / CloudWatch | Daily | Retool (staff) |
| Unmet language demand (requested ≠ served) | `page_viewed` events | Weekly | Retool (staff) + Impact Dashboard (Phase 10) |
| Content availability matrix (books × languages) | `books` + `book_chunks` tables | On content change | Impact Dashboard |
| Editorial queue depth by type | `review_queue` tables | Real-time | Admin portal pipeline dashboard |
| Geographic Core Web Vitals (per target region) | New Relic Synthetics | Continuous | New Relic |

*Section added: 2026-02-21, analytics exploration*

---

## DES-038: Testing Strategy

Testing is a fidelity guarantee, not optional polish. A bug that misattributes a quote or breaks search undermines the core mission. See ADR-094.

### Test Layers

| Layer | Tool | What It Tests | Phase |
|-------|------|---------------|-------|
| **Unit / Integration** | Vitest + React Testing Library | Service functions, API route handlers, component rendering | Phase 1 |
| **End-to-End** | Playwright | Full user flows: search → read → share → navigate. Cross-browser. | Phase 1 |
| **Accessibility** | axe-core (CI) + Playwright a11y | Automated WCAG checks. Keyboard navigation flows. | Phase 1 |
| **Search quality** | Custom Vitest suite | ~30 queries with expected passages. Precision/recall. | Phase 1 |
| **Related content quality** | Custom Vitest suite | Pre-computed relations are thematically relevant, cross-book diverse, no false friends. | Phase 5 |
| **Performance** | Lighthouse CI | LCP < 2.5s, CLS < 0.1, INP < 200ms | Phase 1 |
| **Visual** | Storybook | Component documentation, design token consistency | Phase 1 |
| **Visual regression** | Playwright screenshot comparison | Catch unintended visual changes | Phase 11 |

### Database Test Isolation via Neon Branching

```
CI pipeline:
 1. Create Neon branch from main
 2. Apply migrations to branch
 3. Seed test data
 4. Run Vitest integration tests against branch
 5. Run Playwright E2E tests against branch
 6. Delete branch (cleanup)
```

Each test run gets a fully isolated database. No shared test database. No cleanup scripts. Neon's instant branching makes this practical.

### CI Pipeline

```
On every PR:
 1. Lint (ESLint + Prettier)
 2. Type check (tsc --noEmit)
 3. Unit / integration tests (Vitest)
 4. Accessibility audit (axe-core)
 5. Build (next build)
 6. E2E tests (Playwright)
 7. Lighthouse CI (performance)
 8. Search quality suite

All must pass before merge.
```

### Key E2E Test Scenarios (Phase 1)

| Scenario | Flow |
|----------|------|
| **Search and read** | Homepage → type query → view results → click "Read in context" → verify passage highlighted in reader |
| **Today's Wisdom** | Homepage → verify passage displayed → click "Show me another" → verify new passage |
| **Quiet Corner** | Navigate to `/quiet` → verify affirmation → start timer → verify completion |
| **Share passage** | Search → click share icon → verify URL copied → navigate to share URL → verify OG meta tags |
| **Keyboard navigation** | Tab through homepage → search → navigate results → read in context — all via keyboard |
| **Theme browsing** | Homepage → click theme door → verify themed passages → click "Read in context" |
| **Related teachings** | Read a chapter → verify side panel shows related passages from other books → click a related passage → verify navigation to new context → verify side panel updates (graph traversal) |
| **Continue the Thread** | Read to end of chapter → verify "Continue the Thread" section shows cross-book passages → click one → verify navigation |
| **Seeking entry points** | Homepage → scroll to "Seeking..." → click entry point → verify search results page with relevant passages |

### Related Content Quality Evaluation (Phase 5+)

Mirrors the search quality evaluation (deliverable 0a.8) but for the pre-computed `chunk_relations`. The teaching portal is focused on quality teaching — bad relations undermine trust as much as bad search results.

**Test suite:**

| Criterion | Test | Threshold |
|-----------|------|-----------|
| **Thematic relevance** | For N representative paragraphs across diverse topics, human-judge the top 3 related passages. Score: relevant / partially relevant / irrelevant. | ≥ 80% relevant or partially relevant |
| **No self-referential results** | Relations must not include adjacent paragraphs from the same chapter (those are already "in context"). | Zero violations |
| **Cross-book diversity** | When ≥ 2 books are available, top 3 relations should span ≥ 2 books. | ≥ 70% of test cases |
| **No false friends** | Superficially similar text with unrelated meaning (e.g., "light" as illumination vs. "light" as weight) must not appear in top 3. | Zero critical false friends |
| **Filtered query quality** | When filtering by book, the returned relations must still be thematically relevant (not just the best-available from a poor match set). | ≥ 70% relevant |
| **Realtime fallback quality** | When pre-computed results are insufficient (< 3 after filtering), the realtime vector fallback returns comparable quality. | Within 10% of precomputed quality |

**Test data:** A curated set of ~50 representative paragraphs from across the ingested corpus, spanning topics: meditation, fear, love, death, science, daily life, guru-disciple relationship, and scriptural commentary. Each paragraph has human-judged "expected related" passages and "should not appear" passages.

**Regression gate:** This suite runs as part of the CI pipeline after any content re-ingestion or embedding model change. Quality must not degrade below thresholds.

---

## ADR-086, ADR-087: Community Collections — Public Curation

The Study Workspace (ADR-083) enables personal passage collection. Community Collections extend this with a publish path: personal → shared → reviewed → public.

### Four-Tier Visibility

| Tier | Audience | Review | Phase |
|------|----------|--------|-------|
| **Private** | Creator only | None | 7 (existing Study Workspace) |
| **Shared link** | Anyone with URL | None | 7 |
| **Published** | Everyone (gallery) | Staff review required | 14 |
| **Featured** | Everyone (prominent) | Staff-promoted | 14 |

**Shared link** is the workhorse for study circles: a center leader curates a reading plan in the Study Workspace, clicks "Share," and gets a URL to send via WhatsApp or email. No account required. No staff review needed — the content is already-public SRF text. The page carries a note: *"This collection was curated by a community member, not by SRF."*

**Published** collections enter a staff review queue in the admin portal (extending ADR-082). Review evaluates theological coherence, citation completeness, and curation quality. The pipeline mirrors ADR-032: `submitted` → review → `published` or `rejected` with feedback.

### Collection Types

| Type | Description | Example |
|------|-------------|---------|
| `theme` | Passages around a spiritual theme | "Yogananda on Divine Friendship" |
| `study_guide` | Structured reading plan with sections | "12-Week Autobiography Journey" |
| `situational` | Passages for a life moment | "For When You're Grieving" |
| `event` | Passages for an SRF calendar event | "Mahasamadhi Readings" |
| `cross_media` | Passages paired with talks/articles | "The Gita: Book and Lecture" |

### Schema Extension (extends ADR-083 tables)

```sql
ALTER TABLE study_outlines ADD COLUMN visibility TEXT NOT NULL DEFAULT 'private'
 CHECK (visibility IN ('private', 'shared_link', 'published', 'featured'));
ALTER TABLE study_outlines ADD COLUMN share_hash TEXT UNIQUE;
ALTER TABLE study_outlines ADD COLUMN collection_type TEXT
 CHECK (collection_type IN ('theme', 'study_guide', 'situational', 'event', 'cross_media'));
ALTER TABLE study_outlines ADD COLUMN submitted_at TIMESTAMPTZ;
ALTER TABLE study_outlines ADD COLUMN reviewed_by TEXT;
ALTER TABLE study_outlines ADD COLUMN reviewed_at TIMESTAMPTZ;
ALTER TABLE study_outlines ADD COLUMN review_notes TEXT;
ALTER TABLE study_outlines ADD COLUMN curator_display_name TEXT;
ALTER TABLE study_outlines ADD COLUMN language TEXT DEFAULT 'en';
```

### Routes

| Route | Purpose | Auth |
|-------|---------|------|
| `/collections` | Gallery of published/featured collections. Filter by type, theme, language. | Public |
| `/collections/[share-hash]` | Single collection view (shared-link, published, or featured) | Public |
| `/study` | Study Workspace (existing). "Share" and "Submit" buttons for server-synced collections. | Public (Phase 13 for server sync) |

### Gallery Page (`/collections`)

The gallery presents published community collections with filtering:

- **Filter by type:** theme, study guide, situational, event, cross-media
- **Filter by language:** follows portal's multilingual strategy
- **Sort by:** newest, type, book (alphabetical)
- **No engagement metrics.** No view counts, no likes, no popularity rankings. DELTA compliance (ADR-095) extends to community features. Quality is signaled through the "Featured" tier (staff-promoted), not community voting.

### Admin Portal Review Queue (extends ADR-082)

Community collection submissions appear in the admin portal alongside theme tag review and other editorial queues:

- Display: collection title, curator name, passage count, collection type
- Preview: full collection view with all passages and personal notes
- Actions: Approve, Reject (with feedback), Request Revision
- Keyboard-driven: same patterns as theme tag review (`a` approve, `r` reject, `→` next)

### ADR-087: VLD Curation Pipeline

VLD members access a dedicated section in the admin portal (Auth0 role: `vld`):

```sql
CREATE TABLE curation_briefs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 title TEXT NOT NULL,
 description TEXT NOT NULL,
 collection_type TEXT NOT NULL,
 target_language TEXT DEFAULT 'en',
 created_by TEXT NOT NULL,
 claimed_by TEXT,
 claimed_at TIMESTAMPTZ,
 submitted_at TIMESTAMPTZ,
 status TEXT DEFAULT 'open'
 CHECK (status IN ('open', 'claimed', 'submitted', 'approved', 'revision_requested')),
 deadline TIMESTAMPTZ,
 created_at TIMESTAMPTZ DEFAULT now
);
```

**Workflow:** Staff creates brief ("We need a collection on friendship for July") → VLD member claims → curates in Study Workspace → submits → staff reviews → published.

**Trusted submitter status:** After a threshold of approved collections (TBD, likely 3–5), VLD members' submissions enter a lighter review queue (batch-approve). Not auto-publishing — every collection passes through staff eyes — but review effort scales sublinearly.

### Content Integrity

- Collections arrange existing corpus content. No new content is created.
- Personal notes are visually distinct: smaller font, different background, prefixed with curator name. Never presented as Yogananda's words.
- Shared and published collections retain full citations (book, chapter, page) on every passage.
- The portal does not host user-generated prose, commentary, or interpretation. Collections are selection and sequence.

### Service File

`/lib/services/collections.ts` — collection queries, visibility management, share hash generation, submission pipeline, gallery filtering.

---

## DES-050: Seeker & User Persona Index

A consolidated reference to every persona type defined across the portal's design documents. This section does not duplicate persona details — it indexes them so that any developer, designer, or editorial staff member can find who the portal serves and where the design commitments for each persona live.

### Design Philosophy

The portal's personas are **need-based, not demographic**. A 16-year-old in career crisis and a 45-year-old career-changer both enter through the same life-phase pathway. A Christian contemplative in Atlanta and a Hindu practitioner in Kolkata both find Yogananda's words, but through different worldview entry points. Age, income, education, and geography are treated as *constraints to design around* (performance budgets, accessibility, cultural adaptation), never as audience segments to target.

**The portal intentionally does not design for passive consumption.** There is no algorithmic feed, no infinite scroll, no "recommended for you" engine, no engagement optimization. Every interaction is seeker-initiated. This is not a limitation — it is the Calm Technology principle (CLAUDE.md constraint #3) applied to the entire product. The portal is a library, not a feed. Seekers come with intent; the portal meets that intent and then lets go. (Relates to ADR-095 DELTA-compliant analytics, ADR-071 Quiet Corner.)

### Seeker Personas (External)

| Persona | Entry Pattern | Primary Section | Key ADRs |
|---|---|---|---|
| **The curious reader** | Homepage → themes / search / browse | DES-048 seeker archetypes | ADR-051 |
| **The person in need** | "Seeking..." empathic entry → Quiet Corner / theme page | DES-006, DES-011 | ADR-071 |
| **The meditation seeker** | Homepage → `/guide` → practice pathways | DES-048 | ADR-104 |
| **The shared-link recipient** | `/passage/[id]` via friend's message | ADR-067 (#1) | — |
| **The Google arrival** | `/books/[slug]/[chapter]` from external search | ADR-067 (#2) | — |
| **The daily visitor** | Homepage → Today's Wisdom → contemplate → leave | ADR-067 (#3) | DES-028 |
| **The Quiet Corner seeker** | `/quiet` directly, often in crisis | ADR-067 (#4) | ADR-071 |
| **The linear reader** | Chapter 1 → 2 → ... → N | ADR-067 (#5) | ADR-072 |
| **The devoted practitioner** | Search for half-remembered passages, cross-book study | ADR-067 (#6) | ADR-104 |
| **The scholar** | Citation-driven, cross-referencing, export-oriented | ADR-067 (#7) | ADR-043, ADR-061 |
| **The study circle leader** | Find → collect → arrange → share → present | ADR-082 external personas | ADR-006 §5, ADR-086 |
| **The crisis seeker** | 2 AM, acute distress, grief, suicidal ideation | DES-011 (Quiet Corner) | ADR-071 |
| **The Global South seeker** | Rural Bihar, 2G, JioPhone, paying per MB | ADR-006 (Global Equity) | ADR-003 |

### Worldview Pathways (14 entry points)

Seekers arrive from different epistemological and tradition-based starting points. Each worldview pathway (WP-01 through WP-14) is an editorially curated reading path that meets the seeker where they are. Full catalog in DES-048.

| ID | Worldview | Primary Corpus | Status |
|---|---|---|---|
| WP-01 | Christian Contemplative | *The Second Coming of Christ* | Approved |
| WP-02 | Hindu/Vedantic Practitioner | *God Talks With Arjuna* | Approved |
| WP-03 | Buddhist/Zen Meditator | *Autobiography* meditation chapters | Approved |
| WP-04 | Sufi/Poetry Lover | *Wine of the Mystic* | Approved |
| WP-05 | Jewish/Contemplative | *The Second Coming of Christ* (OT) | Approved |
| WP-06 | Science & Consciousness Explorer | *Autobiography* science chapters | Approved |
| WP-07 | Spiritual But Not Religious | *Autobiography*, *Where There Is Light* | Approved |
| WP-08 | Yoga Practitioner (Body to Spirit) | *Autobiography*, *God Talks With Arjuna* | Approved |
| WP-09 | Grief/Crisis Visitor | Cross-cutting | Approved |
| WP-10 | Psychology/Self-Improvement | *Man's Eternal Quest* | Approved |
| WP-11 | Comparative Religion/Academic | All books + Knowledge Graph | Approved |
| WP-12 | Parent/Family-Oriented | *Man's Eternal Quest*, *Journey to Self-Realization* | Approved |
| WP-13 | Muslim/Sufi Seeker | *Wine of the Mystic*, *Autobiography* | Requires SRF approval |
| WP-14 | Agnostic/Skeptical-but-Curious | *Autobiography* science chapters | Requires SRF approval |

### Life-Phase Pathways (9 temporal states)

Seekers are also in a season of life that shapes what they need. Each life-phase pathway (LP-01 through LP-09) uses a universal question, not an age label, as its entry point. Full catalog in DES-048.

| ID | Life Phase | Entry Question | Tone |
|---|---|---|---|
| LP-01 | Young Seeker | "What should I do with my life?" | Practical, joyful |
| LP-02 | Building a Life | "How do I balance inner and outer?" | Practical |
| LP-03 | Raising a Family | "How do I raise children wisely?" | Practical |
| LP-04 | The Middle Passage | "Is this all there is?" | Contemplative, challenging |
| LP-05 | The Caregiver | "Where do I find strength?" | Consoling, practical |
| LP-06 | Facing Illness | "How do I heal or accept?" | Consoling, practical |
| LP-07 | The Second Half | "How do I grow old with grace?" | Contemplative, consoling |
| LP-08 | Approaching the End | "What awaits me?" | Consoling, contemplative |
| LP-09 | New to Spiritual Practice | "I want to begin, don't know how" | Practical, joyful |

### Situational Themes (8 life circumstances)

Cross-cutting life situations that any seeker may navigate, independent of age or worldview. Implemented as editorial theme groupings in ADR-032.

Work | Relationships | Parenting | Health/Wellness | Loss & Grief | Aging | Facing Illness | Purpose

### Staff & Operational Personas (Internal)

Full profiles in ADR-082. Summary index:

| Persona | Type | Phase Active |
|---|---|---|
| Monastic content editor | Core staff | Phase 4+ |
| Theological reviewer | Core staff | Phase 4+ |
| AE social media staff | Core staff | Phase 6+ |
| Translation reviewer | Core staff (or volunteer) | Phase 10+ |
| AE developer | Core staff | Phase 0+ |
| Leadership (monastic) | Core staff | Phase 4+ |
| Portal coordinator | Operational (unstaffed) | Phase 4+ |
| Book ingestion operator | Operational (unstaffed) | Phase 1+ |
| VLD coordinator | Operational (unstaffed) | Phase 8+ |

### Volunteer Personas

| Persona | Phase Active |
|---|---|
| VLD curation volunteer | Phase 8+ |
| VLD translation volunteer | Phase 10+ |
| VLD theme tag reviewer | Phase 8+ |
| VLD feedback triager | Phase 8+ |
| VLD content QA reviewer | Phase 8+ |

### External Personas

| Persona | Primary Need |
|---|---|
| Philanthropist's foundation | Pre-formatted impact reports |
| Study circle leader | Find → collect → arrange → share → present (see ADR-082 expanded profile) |
| Institutional intermediary | Chaplain, therapist, hospice worker accessing on behalf of others (see CONTEXT.md open question) |

### Non-English Seeker Journeys

Three brief empathy narratives for how non-English seekers may discover and use the portal. These are not design specifications — they are grounding artifacts that keep the team oriented toward real human experiences when making UX decisions.

**Priya, Varanasi (Hindi).** Priya is 34, a schoolteacher. Her grandmother kept a Hindi copy of *Autobiography of a Yogi* by the prayer altar — she called Yogananda "Yogananda ji" and read from it during evening prayers. Priya never read it herself. After her grandmother's death, she searches on her phone: "योगानन्द जी मृत्यु के बाद" (Yogananda ji, after death). She finds the portal through Google. She arrives at the Hindi locale, sees the YSS branding she recognizes from her grandmother's prayer room, and finds a passage about the soul's immortality in the same words her grandmother read aloud. She doesn't search again for three weeks. Then she returns for "योगानन्द जी ध्यान कैसे करें" (how to meditate). The Practice Bridge links her to YSS's free beginner meditation page. She has never heard of SRF. The portal does not need her to.

**Carlos, São Paulo (Portuguese).** Carlos is 22, a university student studying philosophy. He finds Yogananda through a yoga studio's Instagram post that links to a portal passage about willpower. He reads in Portuguese, explores the "Purpose" theme, and finds passages from *Man's Eternal Quest*. He doesn't know what SRF or YSS is. He uses the citation export to reference a passage in his philosophy paper on Eastern and Western concepts of will. Six months later, he discovers the Knowledge Graph and spends an afternoon following connections between Yogananda's references to Patanjali, the Gita, and Western science. He still has no interest in meditation. The portal does not try to make him interested.

**Amara, Lagos (English, but not from the Western spiritual tradition).** Amara is 40, a hospital nurse and devout Christian. A colleague shared a portal link to a passage about courage during suffering. Amara is suspicious — is this a Hindu thing that conflicts with her faith? She sees the passage is from a book by "Paramahansa Yogananda" and doesn't know who that is. She reads the passage and finds it moving. The WP-01 (Christian Contemplative) worldview pathway surfaces Yogananda's commentary on the Gospels. She is surprised. She reads one chapter of *The Second Coming of Christ* on her phone during a night shift break, on a hospital Wi-Fi connection that drops every few minutes. The portal's progressive loading means she never loses her place. She never clicks "Learn about meditation." She comes back to read the next chapter the following week. The portal's <100KB JS budget means her data cost is negligible on her Nigerian mobile plan.

### Locale-Specific Cultural Adaptation

The same seeker archetype requires cultural adaptation across locales — not just language translation but emotional register, platform habits, and trust signals. Full cultural notes per language in DES-018. Summary of key design differentiators:

| Locale | Key Adaptation | Platform Priority |
|---|---|---|
| Spanish (es) | Emotional warmth, relational tone | WhatsApp |
| French (fr) | Diacritic-insensitive search, Francophone Africa vs European French | — |
| German (de) | Compound word search, privacy expectations exceed GDPR | — |
| Portuguese (pt) | Brazilian vs European variants, university/intellectual framing | WhatsApp |
| Japanese (ja) | CJK tokenization, omikuji framing, *ma* aesthetic, LINE (not WhatsApp) | LINE |
| Thai (th) | No word boundaries (search tokenization), Buddhist context, gold/lotus aesthetics | LINE |
| Hindi (hi) | YSS branding, mobile-first, text-only mode essential, *sādhak* terminology | WhatsApp |
| Bengali (bn) | YSS branding, lyrical editorial register, Tagore's aesthetic influence | WhatsApp |

### Open Persona Questions

These questions are tracked in CONTEXT.md § Open Questions (Stakeholder) and require SRF input:

1. **Young seekers** — should the editorial voice acknowledge teenagers explicitly, or is agelessness the mode of inclusion? (Line 76)
2. **WP-13 and WP-14** — Muslim/Sufi and Agnostic/Skeptical worldview pathways require SRF editorial approval. (Line 77)
3. **Institutional intermediaries** — chaplains, therapists, hospice workers accessing on behalf of others. (Line 69)
4. **Operational role assignment** — portal coordinator, book ingestion operator, VLD coordinator. (Line 85–86)
5. **"Who *shouldn't* use this portal?"** — The seeker searching for Kriya technique instructions should be redirected to SRF Lessons, not shown Autobiography excerpts that might be misinterpreted as instruction. The Practice Bridge (ADR-104) addresses this, but the persona of "the seeker who needs what we don't offer" could be more explicitly designed for.
6. **Abuse and misuse patterns** — Automated corpus extraction, quote weaponization, SEO parasitism. (CONTEXT.md technical open question)

*Section added: 2026-02-21, persona consolidation survey*

---

## DES-053: Unified Content Pipeline Pattern

Content enters the portal through five media-type-specific pipelines: books (DES-005), magazine articles (ADR-040), video transcripts (ADR-055), audio transcripts (ADR-057), and images (ADR-035). Each is specified independently, but all follow a shared seven-stage pattern. This section names the pattern explicitly, so that Phase 12+ implementations and future content types inherit the structure rather than re-inventing it.

### The Seven Stages

```
Source → Normalize → Chunk → Embed → QA → Index → Relate
```

| Stage | What Happens | Governing Decisions |
|---|---|---|
| **1. Source** | Raw content acquired: PDF scan, Contentful entry, YouTube caption, audio file, image file. Format varies by media type. | ADR-029 (book priority), ADR-040 (magazine), ADR-055 (video), ADR-057 (audio), ADR-035 (images) |
| **2. Normalize** | Convert to a uniform text representation. PDFs → structured text with page/paragraph boundaries. Captions → timestamped transcript. Audio → Whisper transcription. Images → editorial description text (images are not directly searchable). | DES-005 (book normalization), ADR-055 (caption → transcript), ADR-057 (audio → Whisper) |
| **3. Chunk** | Segment normalized text into retrieval units. Books use paragraph-based chunking (ADR-048). Transcripts use speaker-turn or timestamp-window chunking. Image descriptions are single-chunk. | ADR-048 (chunking strategy) — book-specific but principles apply cross-media |
| **4. Embed** | Generate vector embeddings for each chunk. Same embedding model across all content types (ADR-046). `embedding_model` column tracks the model version. Multilingual benchmarking applies (ADR-047). | ADR-046, ADR-047 |
| **5. QA** | Mandatory human review gate. Every chunk's text, citation, and metadata are verified before the content reaches seekers. AI-assisted (Claude flags anomalies), human-approved. Review enters the unified review queue (DES-033). | ADR-001 (verbatim fidelity), ADR-078 (human review mandatory), DES-033 (review queue) |
| **6. Index** | Approved chunks enter the search index: BM25 index (pg_search) automatically updated on INSERT, vector embeddings available for similarity queries, content surfaced in browse pages and theme listings. | ADR-044 (hybrid search), ADR-114 (pg_search BM25), DES-019 (API endpoints) |
| **7. Relate** | Pre-compute cross-content relationships: chunk-to-chunk similarity (ADR-050), theme membership (ADR-032), cross-media relations (ADR-060), Knowledge Graph edges (ADR-062). Relations are computed after indexing, not during — they're a derived layer. | ADR-050, ADR-060, ADR-062 |

### Media-Type Variations

The stages are shared; the implementations differ:

| Media Type | Source Format | Chunking Unit | Special QA | Relation Types |
|---|---|---|---|---|
| **Books** | Contentful Rich Text (imported from PDF or digital text) | Paragraph (ADR-048) | Page number verification, edition alignment | chunk_relations, theme_membership |
| **Magazine** | Contentful entry or PDF | Article section | Author attribution verification | chunk_relations, theme_membership, issue_membership |
| **Video** | YouTube caption / Whisper | Speaker turn + timestamp window | Timestamp accuracy, speaker diarization | chunk_relations, cross_media (video ↔ book) |
| **Audio** | Whisper transcription | Speaker turn + timestamp window | Sacred artifact flag for Yogananda's voice | chunk_relations, cross_media (audio ↔ book), performance_of (chant) |
| **Images** | Editorial description | Single chunk (description text) | Alt text review, sacred image guidelines (ADR-042) | depicts_person, depicts_place, related_passage |

### When to use this pattern

Any new content type entering the portal in future phases (e.g., letters, unpublished manuscripts, study guides) should follow this seven-stage pattern. The implementation checklist for a new content type:

1. Define source format and normalization process
2. Choose chunking strategy (or declare single-chunk if the unit is atomic)
3. Verify embedding model handles the content type adequately (or benchmark alternatives per ADR-047)
4. Add a QA review queue type to DES-033
5. Update the search index to include the new content type (DES-019 API, ADR-044 hybrid search)
6. Define relation types and update the Knowledge Graph node/edge types (ADR-062)
7. Update this section's Media-Type Variations table

### Not a premature abstraction

Phases 0–6 implement each pipeline independently — books, magazine, then video/audio/images. The unified content hub (ADR-060) arrives in Phase 12 as a deliberate migration. This section documents the *pattern* shared across independent implementations, not a shared codebase. If a shared `ContentPipeline` base class emerges naturally during Phase 12, it should be extracted from working code, not designed in advance.

*Section added: 2026-02-22, ADR-060, ADR-112*

---

## Open Questions

See CONTEXT.md § Open Questions for the consolidated list. Technical and stakeholder questions live there so they're visible at session start and move to "Resolved" as work progresses. Architectural questions that arise during implementation should be added to CONTEXT.md and, if they require a decision, captured as an ADR in DECISIONS.md.

---
