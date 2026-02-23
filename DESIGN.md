# SRF Online Teachings Portal — Technical Design

> **Navigation guide.** 56 sections organized by concern. The **Phase** column indicates when each section becomes relevant to implementation. Sections marked "—" are cross-cutting principles.
>
> **Parameter convention (ADR-123).** Specific numeric values in this document (cache TTLs, debounce timers, fusion parameters, chunk sizes, rate limits, color band boundaries, purge delays, revalidation intervals) are **tunable defaults**, not architectural commitments. They represent best pre-production guesses and should be implemented as named configuration constants in `/lib/config.ts`, not hardcoded literals. Phase 0a.8 (search quality evaluation) and subsequent phase gates include parameter validation as deliverables. When a parameter is tuned based on evidence, annotate the section: `*Parameter tuned: [date], [old] → [new], [evidence].*` See ADR-123 for the full governance framework.

| Section | Phase |
|---------|-------|
| [DES-001: Design Philosophy](#des-001-design-philosophy) | — |
| [DES-002: Architecture Overview](#des-002-architecture-overview) | 0, 9+ |
| [DES-003: The AI Librarian: Search Architecture](#des-003-the-ai-librarian-search-architecture) | 0–1 |
| &emsp;[ADR-049: Search Suggestions & Autocomplete](#adr-049-search-suggestions-autocomplete) | 0, 3, 10 |
| [DES-004: Data Model](#des-004-data-model) | 0+ |
| [DES-005: Content Ingestion Pipeline](#des-005-content-ingestion-pipeline) | 0, 9+ |
| [ADR-041: Phase 0 Bootstrap](#adr-041-phase-0-bootstrap) | 0 |
| [DES-006: Frontend Design](#des-006-frontend-design) | 1–11 |
| [DES-017: Multi-Language Strategy](#des-017-multi-language-strategy) | 1 (infra), 10 (content) |
| [DES-018: Cultural Design Considerations](#des-018-cultural-design-considerations) | 10+ |
| [DES-019: API Design (Next.js API Routes)](#des-019-api-design-nextjs-api-routes) | 0+ |
| [DES-020: Platform Parity (Mobile Readiness)](#des-020-platform-parity-mobile-readiness) | 1+ |
| [DES-021: YouTube Video Section Architecture](#des-021-youtube-video-section-architecture) | 1+ |
| [DES-022: Events Section](#des-022-events-section) | 1+ |
| [DES-023: Sacred Places — Contemplative Geography](#des-023-sacred-places-contemplative-geography) | 3+ |
| [DES-024: Security Considerations](#des-024-security-considerations) | 0+ |
| [DES-025: Accessibility Requirements (Phase 1 Foundation)](#des-025-accessibility-requirements-phase-1-foundation) | 1+ |
| [DES-026: Editorial Reading Threads — "Teachings in Conversation"](#des-026-editorial-reading-threads-teachings-in-conversation) | — |
| [DES-027: Reverse Bibliography — "What Yogananda Read"](#des-027-reverse-bibliography-what-yogananda-read) | — |
| [DES-028: Calendar-Aware Content Surfacing](#des-028-calendar-aware-content-surfacing) | 4+ |
| [ADR-048: Chunking Strategy](#adr-048-chunking-strategy) | 0+ |
| &emsp;[Semantic Density Classification](#semantic-density-classification) | 3+ |
| &emsp;[ADR-039 ext: Corpus Stylometric Fingerprint](#adr-039-ext-corpus-stylometric-fingerprint) | 6+ |
| [DES-029: The Quiet Index — Browsable Contemplative Taxonomy](#des-029-the-quiet-index-browsable-contemplative-taxonomy) | — |
| [DES-030: Daily Email: Verbatim Passage Delivery](#des-030-daily-email-verbatim-passage-delivery) | 8+ |
| [ADR-084: Seeker Feedback — DELTA-Compliant Signal Collection](#adr-084-seeker-feedback-delta-compliant-signal-collection) | — |
| [DES-031: MCP Server Strategy](#des-031-mcp-server-strategy) | 0+ |
| [DES-032: Content Management Strategy](#des-032-content-management-strategy) | 9+ |
| [ADR-082: Staff Experience Architecture](#adr-082-staff-experience-architecture) | 4+ |
| [DES-033: Unified Review Queue Abstraction](#des-033-unified-review-queue-abstraction) | — |
| [DES-034: Content Lifecycle Management](#des-034-content-lifecycle-management) | — |
| [DES-035: AI-Assisted Editorial Workflows](#des-035-ai-assisted-editorial-workflows) | — |
| [DES-036: Migration, Evolution, and Longevity](#des-036-migration-evolution-and-longevity) | — |
| [ADR-007: Editorial Proximity Standard](#adr-007-editorial-proximity-standard) | — |
| [DES-037: Observability](#des-037-observability) | 0+ |
| [DES-038: Testing Strategy](#des-038-testing-strategy) | 0+ |
| [DES-039: Infrastructure and Deployment](#des-039-infrastructure-and-deployment) | 0 |
| [DES-040: Design Tooling](#des-040-design-tooling) | 1+ |
| [DES-041: Magazine Section Architecture](#des-041-magazine-section-architecture) | 6+ |
| [DES-042: Glossary Architecture](#des-042-glossary-architecture) | 4+ |
| [DES-043: "What Is Humanity Seeking?" Dashboard Architecture](#des-043-what-is-humanity-seeking-dashboard-architecture) | 6+ |
| [DES-044: Additional New UI Pages](#des-044-additional-new-ui-pages) | 1+ |
| &emsp;[DES-045: `/journeys` — Calendar Reading Journeys](#des-045-journeys-calendar-reading-journeys) | 4+ |
| &emsp;[DES-046: Study Circle Sharing](#des-046-study-circle-sharing) | 14+ |
| &emsp;[DES-047: `/browse` — The Complete Index](#des-047-browse-the-complete-index) | 1+ |
| &emsp;[DES-048: `/guide` — The Spiritual Guide](#des-048-guide-the-spiritual-guide) | 4+ |
| [DES-049: Responsive Design Strategy](#des-049-responsive-design-strategy) | 1+ |
| [ADR-086, ADR-087: Community Collections — Public Curation](#adr-086-adr-087-community-collections-public-curation) | — |
| [ADR-035, ADR-063, ADR-064: Image Serving Architecture](#adr-035-adr-063-adr-064-image-serving-architecture) | 6+ |
| [DES-050: Seeker & User Persona Index](#des-050-seeker--user-persona-index) | — |
| [DES-051: Portal Updates Page — "The Library Notice Board"](#des-051-portal-updates-page-the-library-notice-board) | 4+ |
| [DES-052: Outbound Webhook Event System](#des-052-outbound-webhook-event-system) | 4+ |
| [DES-053: Unified Content Pipeline Pattern](#des-053-unified-content-pipeline-pattern) | — |
| [DES-054: Knowledge Graph Ontology](#des-054-knowledge-graph-ontology) | 0 (design), 4+ (Neptune) |
| [DES-055: Concept/Word Graph](#des-055-conceptword-graph) | 4+ |
| [DES-056: Feature Catalog (RAG Architecture Proposal)](#des-056-feature-catalog-rag-architecture-proposal) | 2–12+ |

---

## DES-001: Design Philosophy

This portal is a **digital library with an AI librarian**, not a chatbot or content generator. The AI finds and surfaces Yogananda's actual words — it never speaks for him. Every architectural decision flows from this principle.

---

## DES-002: Architecture Overview

### Phase 0a Architecture (Prove — Pure Hybrid Search)

Two services. One database. No AI in the search path — pure hybrid retrieval. (ADR-113)

```
┌─────────────────────────────────────────────────────────────┐
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
│ /api/v1/search /api/v1/books │
│ │ /api/v1/chapters │
│ │ │ │
│ ▼ ▼ │
│ ┌─────────────────────────────────────┐ │
│ │ Neon PostgreSQL + pgvector │ │
│ │ │ │
│ │ • books, chapters (metadata) │ │
│ │ • book_chunks (text + embeddings) │ │
│ │ • Full-text search (pg_search BM25) │ │
│ │ • Vector similarity (HNSW index) │ │
│ │ • RRF fusion (vector + BM25) │ │
│ │ • search_queries (anonymized log) │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

Phase 0a has NO Claude API calls in the search path.
Claude is used only offline: ingestion QA (ADR-005 E4),
enrichment (ADR-115), and search quality evaluation (ADR-005 E5).
```

### Phase 0b Architecture (Foundation — AI-Enhanced Search)

Phase 0b adds Claude Haiku to the search path: query expansion,
intent classification, and passage ranking. Deployed to Vercel. (ADR-113)

```
┌─────────────────────────────────────────────────────────────┐
│ USERS │
│ │ │
│ ▼ │
│ ┌──────────────────────────────────────┐ │
│ │ Next.js on Vercel │ │
│ │ │ │
│ │ • Search UI (query bar + results) │ │
│ │ • Book Reader (chapter navigation) │ │
│ │ • Homepage (Today's Wisdom) │ │
│ │ • "Read in context" deep links │ │
│ └──────────┬──────────────┬─────────────┘ │
│ │ │ │
│ /api/v1/search /api/v1/books │
│ /api/v1/suggest /api/v1/chapters │
│ /api/v1/expand │
│ │ │ │
│ ▼ ▼ │
│ ┌─────────────────────────────────────┐ │
│ │ Neon PostgreSQL + pgvector │ │
│ │ │ │
│ │ • books, chapters (metadata) │ │
│ │ • book_chunks (text + embeddings) │ │
│ │ • Full-text search (pg_search BM25) │ │
│ │ • Vector similarity (HNSW index) │ │
│ │ • search_queries (anonymized log) │ │
│ └─────────────────────────────────────┘ │
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
└─────────────────────────────────────────────────────────────┘

One-time ingestion (offline script):

 PDF ──► marker (PDF→Markdown) ──► Chunking ──► Enrichment ──► Embeddings ──► Neon
```

### Production Architecture (Contentful Integration — Phase 9+)

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
│ │ • Neptune Analytics — graph queries (Phase 4+)  │ │
│ │ • Retool — admin panel (content review, analytics) │ │
│ │ • Cloudflare — CDN, edge caching, security │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

**Key principle (Phase 9+):** Contentful is where editors work. Neon is where search works. Next.js is where users work. Each system does what it's best at. Phases 0–8 use PDF-ingested content in Neon directly; Contentful becomes the editorial source of truth when adopted in Phase 9.

---

## DES-003: The AI Librarian: Search Architecture

### Core Principle

The AI is a **librarian**, not an **oracle**. It finds Yogananda's words — it never speaks for him. All results shown to users are verbatim quotes from published works with precise citations.

### ADR-089: Brand Identity

"The Librarian" is the portal's external brand identity for its AI search capability. In a world where every AI product synthesizes content, the portal's refusal to generate is a radical differentiator. The About page explains: *"This is not an AI that speaks for Yogananda. It is a librarian that finds his words for you. Every passage you see is exactly as he wrote it."* The `llms.txt` file includes this framing. Search results may include a subtle footer: *"Every passage shown is Yogananda's own words."*

### Search Flow

The search pipeline has evolved through three phase tiers. Phase 0–1 uses a two-path retrieval core (vector + BM25). Phase 2+ adds HyDE and Cohere Rerank. Phase 4+ adds a third retrieval path via Neptune graph traversal.

```
1. USER QUERY
 "How do I overcome fear?"
 │
 ▼
2. LANGUAGE DETECTION (fastText — per-query, < 1ms)
 Detect query language → route to language-appropriate indexes.
 Short queries (< 3 words) use session language or Accept-Language header as tiebreaker.
 │
 ▼
3. INTENT CLASSIFICATION (Claude Haiku via Bedrock — lightweight, ADR-014)
 Classify intent: topical / specific / emotional / definitional / situational / browsing / search.
 Route non-search intents to theme pages, reader, or daily passage.
 Falls back to standard search if uncertain.
 │
 ▼
4. QUERY EXPANSION (Claude Haiku via Bedrock — optional, for complex queries)
 a) Terminology Bridge (ADR-005 E2):
    Map cross-tradition and modern terms to Yogananda's vocabulary
    "mindfulness" → "concentration", "one-pointed attention"

 b) Claude expands the query into semantic search terms:
    ["fear", "courage", "anxiety", "fearlessness", "divine protection",
     "dread", "worry", "soul immortal", "overcome terror"]

    Strict instructions:
    - Output ONLY a JSON array of search terms
    - Do not answer the question
    - Do not generate any teaching content
 │
 ▼
5. HyDE — HYPOTHETICAL DOCUMENT EMBEDDING (Phase 2+, ADR-119)
 Claude generates a hypothetical passage that would answer the query,
 written in Yogananda's register. This generated passage is an
 intermediate embedding artifact only — it is never stored, displayed,
 or accessible to seekers. It improves retrieval quality without
 generating any user-facing content. ADR-001 is not violated.
 The passage is embedded and searched in document-space (asymmetric:
 query-type embedding for original query, document-type embedding
 for HyDE passage — per Voyage ADR-118).
 High lift on literary/spiritual corpora where seeker vocabulary
 diverges from corpus vocabulary.
 │
 ▼
6. MULTI-PATH PARALLEL RETRIEVAL (Neon PostgreSQL + Neptune Phase 4+)

 PATH A — Dense Vector (pgvector, HNSW):
 - Embed the original query using Voyage voyage-3-large (ADR-118)
 - Find top 20 chunks by cosine similarity
 - If HyDE active: also search with HyDE embedding, merge via RRF

 PATH B — BM25 Keyword (pg_search/ParadeDB, ADR-114):
 - Search expanded terms against the BM25 index (ICU tokenizer)
 - BM25 scoring produces better relevance ranking than tsvector ts_rank
 - Find top 20 chunks by keyword relevance

 PATH C — Graph Traversal (Neptune Analytics, Phase 4+, ADR-117):
 - Identify entities/concepts in query via entity registry (ADR-116)
 - Traverse knowledge graph: concept → related teachings → chunks
 - Return top 20 chunks reachable within 2–3 hops
 - Voyage embeddings on Neptune nodes enable combined
   traversal + similarity in a single openCypher query

 RECIPROCAL RANK FUSION (RRF):
 - Merge results from all active paths (A+B in Phase 0–3; A+B+C in Phase 4+)
 - score = Σ 1/(k + rank_in_path) across all paths, k=60 *[Parameter — default: 60, evaluate: Phase 0a.8 golden set at k=40/60/80]*
 - Deduplicate, producing top 20 candidates
 │
 ▼
7. RERANKING (Cohere Rerank 3.5, Phase 2+, ADR-119)
 Cross-encoder reranker sees query + passage together.
 Multilingual native. Replaces Claude Haiku passage ranking for precision.
 Selects and ranks top 5 from 20 candidates.

 Phase 0–1 fallback: Claude Haiku passage ranking (ADR-014).
 │
 ▼
8. CONTEXT EXPANSION
 For each top-5 result, fetch surrounding chunks for
 "read in context" display. Attach enrichment metadata:
 book, chapter, page, experiential depth, voice register.
 │
 ▼
9. RESULT PRESENTATION
 Display ranked passages as verbatim quotes:

 ┌──────────────────────────────────────────────┐
 │ "The soul is ever free; it is deathless, │
 │ birthless, ever-existing..." │
 │ │
 │ — Autobiography of a Yogi, Chapter 26 │
 │ Page 312 │
 │ [Read in context →] │
 └──────────────────────────────────────────────┘

 Each result includes:
 - The verbatim passage text (highlighted relevant portion)
 - Book title, chapter, page number
 - A deep link to the book reader positioned at that passage
 - Related teachings (Phase 3+, ADR-050) grouped by relationship type
```

**Phase progression of the search pipeline:**

| Phase | Retrieval Paths | Reranker | Enhancements |
|-------|----------------|----------|-------------|
| 0–1 | Vector (pgvector) + BM25 (pg_search) | Claude Haiku passage ranking | Basic query expansion, terminology bridge |
| 2–3 | Vector + BM25 | Cohere Rerank 3.5 | HyDE, improved query expansion |
| 4+ | Vector + BM25 + GraphRAG (Neptune) | Cohere Rerank 3.5 | Three-path RRF, entity-aware retrieval |

### Search Intent Classification (ADR-005 E1)

Before query expansion, a lightweight Claude call classifies the seeker's intent:

```
User types: "I'm scared"
 │
 ▼
INTENT CLASSIFICATION (Claude Haiku via Bedrock — lightweight, ~$0.0005/query, ADR-014)
 Claude classifies the query:
 { "intent": "emotional", "route": "theme", "theme_slug": "courage" }

 Intent types:
 topical → redirect to /themes/[slug] if theme exists
 specific → redirect to reader (/books/[slug]/[chapter])
 emotional → empathic entry: theme-filtered search with compassionate framing
 definitional → search with boost for passages where Yogananda defines the term
 situational → search with situation-theme boost
 browsing → route to Today's Wisdom / random passage
 search → standard hybrid search (default fallback)

 Returns JSON only. Falls back to standard search if uncertain.
```

### Spiritual Terminology Bridge (ADR-005 E2)

The query expansion system prompt includes a tradition-aware vocabulary mapping maintained at `/lib/data/spiritual-terms.json`:

```
Seeker searches: "mindfulness meditation anxiety"
 │
 ▼
TERMINOLOGY BRIDGE (integrated into query expansion prompt)
 Maps cross-tradition and modern terms to Yogananda's vocabulary:
 "mindfulness" → "concentration", "one-pointed attention", "interiorization"
 "anxiety" → "restlessness", "mental disturbance", "nervous agitation"
 "meditation" → "meditation" (direct match — also expands to "stillness", "going within")

 Expanded query:
 ["mindfulness", "concentration", "one-pointed attention", "interiorization",
 "anxiety", "restlessness", "mental disturbance", "meditation", "stillness",
 "going within", "calm", "peace of mind"]
```

The terminology mapping is a versioned JSON glossary reviewed by SRF-aware editors. It bridges the vocabulary gap between seekers who have never read Yogananda and the specific language of his published works.

#### ADR-051: Per-Book Evolution Lifecycle

The terminology bridge is not a static artifact — it deepens with each book ingested. When a new book enters the pipeline, a dedicated Claude "Classifying" step extracts Yogananda's distinctive vocabulary from the new content and proposes updates to the bridge:

```
Book ingestion pipeline (new step after chunking, before embedding):
 1. VOCABULARY EXTRACTION
 Claude Opus scans the book's full chunk set (Classifying category, JSON output; ADR-014 batch tier)
 → Extracts distinctive terms, phrases, and metaphors specific to this book
 → Output: vocabulary inventory for the new book

 2. DIFF AGAINST EXISTING BRIDGE
 Compare extracted terms against current spiritual-terms.json
 → Identify new terms not yet in the bridge
 → Identify new synonyms for existing modern-term mappings
 → Identify book-specific usages of existing terms

 3. HUMAN REVIEW
 The diff is presented to an SRF-aware editor
 → Editor approves, modifies, or rejects each proposed addition
 → Consistent with "AI proposes, humans approve" constraint

 4. MERGE AND VERSION
 Approved additions merge into spiritual-terms.json
 → Committed with provenance: which book prompted the update
 → Bridge grows richer with each new book — never shrinks
```

**Data structure with provenance:**

```json
{
 "mindfulness": {
 "yogananda_terms": ["concentration", "one-pointed attention", "interiorization"],
 "sources": ["autobiography-of-a-yogi", "mans-eternal-quest"],
 "added": "2026-03"
 },
 "trauma": {
 "yogananda_terms": ["past suffering", "karmic burden", "mental wounds"],
 "sources": ["where-there-is-light"],
 "added": "2026-06"
 }
}
```

Provenance tracking enables source-aware expansion: when a seeker is reading *Man's Eternal Quest*, expansion terms sourced from that book can be boosted in relevance. The bridge file remains a single versioned JSON artifact in git — no schema migration required.

#### Schema: `/lib/data/spiritual-terms.json`

```typescript
interface SpiritualTermsFile {
 version: string; // Schema version (e.g., "1.0")
 lastReviewed: string; // ISO date of last human review
 terms: SpiritualTerm[];
}

interface SpiritualTerm {
 canonical: string; // Yogananda's preferred term (e.g., "samadhi")
 alternates: string[]; // Cross-tradition equivalents (e.g., ["enlightenment", "cosmic consciousness"])
 modern: string[]; // Modern seeker vocabulary (e.g., ["spiritual awakening", "peak experience"])
 category: "sanskrit" | "yogic" | "christian" | "universal" | "scientific";
 books: string[]; // Book slugs where this term appears prominently
 notes?: string; // Editorial note on Yogananda's specific usage
}
```

Phase 0 seeds this file with ~50 core terms from the Autobiography. Each subsequent book ingestion (ADR-051) triggers: vocabulary extraction → diff against existing terms → human review → merge. The file grows with the corpus.

### Claude System Prompts (Draft — Refine During Phase 0)

These are the initial system prompts for the three Claude API calls in the search pipeline. All prompts enforce the "librarian, not oracle" constraint: Claude processes queries and selects passages but never generates teaching content.

#### Query Expansion Prompt

```
You are a search query expansion assistant for a library of Paramahansa Yogananda's published books.

Given a seeker's query, generate a JSON array of 8-15 semantically related search terms that would help find relevant passages in Yogananda's writings. Include:
- Direct synonyms and related concepts
- Yogananda's specific vocabulary (e.g., "Self-realization", "cosmic consciousness", "Kriya Yoga")
- Cross-tradition equivalents (e.g., "mindfulness" → "concentration", "one-pointed attention")
- Emotional resonances (e.g., "scared" → "fear", "courage", "divine protection")

RULES:
- Output ONLY a valid JSON array of strings. No explanation, no prose.
- Do NOT answer the seeker's question.
- Do NOT generate any teaching content or quotes.
- Do NOT paraphrase Yogananda's words.
- If the query is already a specific term (e.g., "samadhi"), return a small array of closely related terms.

Spiritual terminology mappings are provided below for reference:
{terminology_bridge_json}

Query: "{user_query}"
```

#### Intent Classification Prompt

```
You classify spiritual search queries for a library of Paramahansa Yogananda's published books.

Given a seeker's query, classify its intent and return a JSON object.

Intent types:
- "topical": Seeker wants information on a theme (route to theme page if exists)
- "specific": Seeker wants a specific passage, chapter, or book
- "emotional": Seeker is expressing a feeling or seeking comfort
- "definitional": Seeker wants Yogananda's definition of a concept
- "situational": Seeker describes a life situation
- "browsing": Seeker wants to explore without a specific target
- "search": General search (default fallback)

RULES:
- Output ONLY a valid JSON object: {"intent": "...", "route": "...", "theme_slug": "..."}
- "route" is one of: "theme", "reader", "search", "daily"
- "theme_slug" is only present when route is "theme" and a matching theme exists
- If uncertain, default to {"intent": "search", "route": "search"}
- Do NOT answer the query. Do NOT generate any content.

Available theme slugs: {theme_slugs_json}

Query: "{user_query}"
```

#### Passage Ranking Prompt

```
You are a passage relevance judge for a library of Paramahansa Yogananda's published books.

Given a seeker's query and a list of candidate passages (each with an ID), select and rank the 5 most relevant passages.

Relevance criteria:
- The passage directly addresses the seeker's question or emotional state
- The passage contains Yogananda's most authoritative teaching on the topic
- Prefer passages that are complete thoughts (not fragment mid-sentence)
- Prefer passages that would be meaningful to a seeker reading them in isolation

RULES:
- Output ONLY a valid JSON array of passage IDs in ranked order (most relevant first).
- Return at most 5 IDs. Return fewer if fewer are relevant.
- If NO passages are relevant to the query, return an empty array: []
- Do NOT modify, summarize, or paraphrase any passage text.
- Do NOT generate any teaching content.
- Judge based on the passage text provided — do not infer or assume content.

Query: "{user_query}"

Candidate passages:
{passages_json}
```

*These prompts are starting points. Phase 0a empirical testing (deliverable 0a.8, search quality evaluation) will refine wording, few-shot examples, and temperature settings. All prompts are maintained in `/lib/prompts/` as version-controlled TypeScript template literals.*

### Search Without AI (Fallback / Simple Queries)

For straightforward keyword queries, the system can operate without any LLM calls:

```
User types: "divine mother"
 → Full-text search only (no query expansion needed)
 → Results ranked by pg_search BM25 score (ADR-114)
 → No Claude API call required
 → Fast, free, reliable
```

The LLM is invoked only when the query is conceptual/semantic and benefits from expansion or re-ranking. This keeps costs low and latency minimal for simple searches.

### Claude API Graceful Degradation

When Claude (via AWS Bedrock, ADR-014) is unavailable (timeout, error, rate limit, or monthly budget cap), search degrades gracefully through four levels. No seeker ever sees an error — quality decreases silently.

| Level | Trigger | What Works | What Doesn't | User Impact |
|-------|---------|-----------|--------------|-------------|
| **Full** | All services healthy | Query expansion + HyDE (Phase 2+) + multi-path retrieval + Cohere Rerank (Phase 2+) | — | Best results: conceptual queries understood, top 5 precisely ranked |
| **No rerank** | Cohere Rerank unavailable | Query expansion, HyDE, multi-path RRF | Cross-encoder reranking | Top 5 from RRF scores; slightly less precise ordering |
| **No HyDE** | HyDE generation fails | Query expansion, multi-path RRF, Cohere Rerank | Hypothetical document embedding | Marginal loss on literary/metaphorical queries |
| **No expansion** | Claude query expansion fails | Raw query → hybrid search (vector + BM25) | Conceptual query broadening | Keyword-dependent; "How do I find peace?" works less well than "peace" |
| **Database only** | All AI services fail | Pure hybrid search (pgvector + pg_search BM25) | All AI enhancement | Still returns relevant verbatim passages via vector similarity + BM25 |

**Implementation:** `/lib/services/search.ts` wraps each external service call in a try-catch with a 5-second timeout. Failure at any level falls through to the next. Sentry captures each degradation event (`search.degradation` with `level` and `service` tags) for monitoring. The search API response includes a `searchMode` field (`"full"`, `"no_rerank"`, `"no_hyde"`, `"no_expansion"`, `"database_only"`) for observability — not exposed in the seeker-facing UI.

### ADR-046: Embedding Model Migration Procedure

When the embedding model changes (e.g., from `voyage-3-large` to a successor, or to a per-language model for Phase 10), re-embedding the full corpus is required. The `embedding_model`, `embedding_dimension`, and `embedded_at` columns on `book_chunks` enable safe, auditable migration.

**Procedure:**

```
1. CREATE NEON BRANCH
 Branch from production. All re-embedding work happens on the branch.
 Production search continues uninterrupted.

2. RE-EMBED ALL CHUNKS (on branch)
 Lambda batch job (ADR-017, ADR-014 batch tier):
 - Read all chunks where embedding_model != new_model
 - Generate new embeddings in batches of 100
 - Use Voyage asymmetric encoding: document input type for chunks
 - UPDATE embedding, embedding_model, embedding_dimension, embedded_at
 - Log progress to CloudWatch

 Estimated cost: Voyage voyage-3-large ~$0.06 per 1M tokens
 Estimated time: ~50K chunks ≈ 15-30 minutes at API rate limits

3. REBUILD HNSW INDEX (on branch)
 DROP INDEX idx_chunks_embedding;
 CREATE INDEX idx_chunks_embedding ON book_chunks
 USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
 -- If dimension changed, ALTER TABLE first:
 -- ALTER TABLE book_chunks ALTER COLUMN embedding TYPE VECTOR(new_dim);

4. RECOMPUTE CHUNK RELATIONS (on branch)
 Re-run the chunk_relations batch job (ADR-050).
 New embeddings produce different similarity scores.

5. VALIDATE (on branch)
 Run the search quality evaluation test suite (deliverable 0a.8).
 Compare results against production baseline.
 Threshold: new model must match or exceed current ≥ 80% pass rate.

6. PROMOTE
 If validation passes: merge branch to production via Neon.
 If validation fails: delete branch, keep current model.

7. UPDATE CONFIG
 Update .env EMBEDDING_MODEL and EMBEDDING_DIMENSION.
 Update default values in schema for new chunks.
```

**Cost estimate for full corpus re-embedding:** < $15 for Voyage voyage-3-large at 50K chunks (~25M tokens). The operational cost is primarily developer time for validation, not API spend. At significant volume, evaluate AWS Marketplace SageMaker model packages for Voyage to reduce per-call costs.

**Multilingual embedding quality (ADR-047, ADR-118).** Voyage voyage-3-large is multilingual-first by design: 1024 dimensions, 26 languages, unified cross-lingual embedding space, 32K token input window. For European languages (es, de, fr, it, pt) and major Asian languages (ja, zh, ko, hi), this provides strong baseline retrieval. For CJK-heavy corpora, benchmark Voyage `voyage-multilingual-2` as an alternative — it may excel on languages with fundamentally different morphology. Phase 10 includes formal benchmarking with actual translated passages (Deliverable 10.3) across Voyage voyage-3-large, Cohere embed-v3, and BGE-M3.

**Domain-adapted embeddings (ADR-047, later-stage research).** The highest-ceiling path to world-class retrieval: fine-tune a multilingual base model on Yogananda's published corpus across languages. A domain-adapted model would understand spiritual vocabulary, metaphorical patterns, and cross-tradition concepts at a depth no general model matches. Prerequisites: multilingual corpus (Phase 10 ingestion) and per-language evaluation suites (Deliverable 10.10). The same migration procedure above applies — the architecture imposes no constraints on model provenance.

### ADR-049: Search Suggestions & Autocomplete

The search architecture above handles what happens *after* a query is submitted. This section covers what happens *as the seeker types* — autocomplete suggestions that reduce friction, show what the corpus contains, and extend the librarian metaphor.

**Core principle:** Suggestion intelligence is corpus-derived, not behavior-derived. All suggestions are extracted from the content itself, not from user query patterns. This ensures DELTA compliance (ADR-095), guarantees every suggestion leads to results, and aligns with the Calm Technology principle — suggestions show what's available, not what's popular.

#### Suggestion Types

Three distinct suggestion types, each with different sources and behavior:

```
Seeker types: "med"
 │
 ▼
TERM COMPLETION (PostgreSQL pg_trgm — < 50ms)
 Prefix match against suggestion index:
 ┌─────────────────────────────────────────────────┐
 │ 🔤 meditation (theme) │
 │ 📖 Meditations on God (chapter) │
 │ 📖 Meditation Promises Richest Results (chapter) │
 │ 🔤 medical intuition (corpus) │
 └─────────────────────────────────────────────────┘

Seeker types: "How do I"
 │
 ▼
QUERY SUGGESTION (curated, editorially maintained)
 Match against curated question templates:
 ┌─────────────────────────────────────────────────┐
 │ ❓ How do I overcome fear? (curated) │
 │ ❓ How do I meditate? (curated) │
 │ ❓ How do I find peace? (curated) │
 └─────────────────────────────────────────────────┘

Seeker types: "mindful"
 │
 ▼
BRIDGE-POWERED SUGGESTION (spiritual-terms.json)
 Terminology bridge detects a mapping:
 ┌─────────────────────────────────────────────────┐
 │ 🔤 mindfulness (corpus) │
 │ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ │
 │ Yogananda's terms: concentration, │
 │ one-pointed attention, interiorization │
 └─────────────────────────────────────────────────┘
```

**1. Term completion.** Prefix matching against a pre-computed suggestion index. Sources: distinctive terms extracted from corpus chunks during ingestion, theme names (`teaching_topics.name`), book titles, chapter titles, and `spiritual-terms.json` canonical entries. Implementation: PostgreSQL `pg_trgm` trigram index for fuzzy prefix matching, or pre-computed trie exported as static JSON and cached at edge (Vercel Edge Config or CDN). Latency target: < 50ms — no database round-trip on the hot path if edge-cached.

**2. Query suggestion.** Curated complete question forms seeded from the search quality evaluation test suite (~30 queries, Deliverable 0a.8) and editorially expanded as the corpus grows. These are not derived from user query history — they are maintained in `/lib/data/curated-queries.json`, reviewed by SRF-aware editors (ADR-078), and versioned in git. Examples: "How do I overcome fear?", "What is the purpose of life?", "How do I meditate?" Editorial governance: same human-review gate as all user-facing content.

**3. Bridge-powered suggestion.** When the prefix matches a key in `spiritual-terms.json`, the response includes a `bridge_hint` showing Yogananda's vocabulary for that concept. This is the differentiator — no other search product surfaces the gap between user vocabulary and corpus vocabulary as a real-time suggestion. The seeker learns that "mindfulness" maps to "concentration" and "one-pointed attention" *before* submitting the query, setting expectations for what the results will contain.

#### API Specification

```
GET /api/v1/search/suggest?q=med&language=en&limit=7

Response:
{
 "suggestions": [
 { "text": "meditation", "type": "term", "category": "theme" },
 { "text": "Meditations on God", "type": "term", "category": "chapter" },
 { "text": "How do I meditate?", "type": "query", "category": "curated" },
 { "text": "medical intuition", "type": "term", "category": "corpus" }
 ],
 "bridge_hint": null
}
```

When the bridge activates:

```
GET /api/v1/search/suggest?q=mindful&language=en&limit=7

{
 "suggestions": [
 { "text": "mindfulness", "type": "term", "category": "corpus" }
 ],
 "bridge_hint": {
 "seeker_term": "mindfulness",
 "yogananda_terms": ["concentration", "one-pointed attention", "interiorization"],
 "source_books": ["autobiography-of-a-yogi", "mans-eternal-quest"]
 }
}
```

No Claude API call in the suggestion path — pure database/cache lookup. Zero cost per suggestion request.

#### Zero-State Experience

When the search bar receives focus but the seeker has typed nothing, display curated entry points rather than an empty dropdown:

- Theme names as suggestion chips ("Peace", "Courage", "Grief & Loss")
- One or two curated question prompts ("How do I overcome fear?", "What is the purpose of life?")
- The search placeholder remains "What are you seeking?" (Deliverable 0a.6)

Zero-state content is editorially governed — it shapes which teachings seekers encounter first. Human review required (ADR-078).

#### Suggestion Index Construction

The suggestion index is built during book ingestion (extending the ADR-051 lifecycle):

```
Book ingestion pipeline (new step after vocabulary extraction):
 5. SUGGESTION INDEX EXTRACTION
 From the book's chunks, extract:
 → Distinctive terms (nouns, proper nouns, spiritual vocabulary)
 → Chapter titles
 → Book-specific phrases
 Filter: remove stopwords, common English words, terms with < 2 occurrences
 Output: per-book vocabulary contribution to the suggestion index

 Merge into suggestion_dictionary table or static JSON export.
 Index grows with each book — never shrinks.
```

#### Multilingual Suggestions (Phase 10)

Per-language suggestion indices are required. Each language gets:
- Its own extracted corpus vocabulary (from language-specific chunks)
- Localized theme names (from `topic_translations`)
- Localized curated queries (from `messages/{locale}.json`)
- Language-specific `pg_trgm` or edge-cached index

**Transliteration challenge:** Hindi/Bengali seekers often type Romanized input (e.g., "samadhi" not "समाधि"). CJK languages have no word boundaries, making prefix matching fundamentally different. The suggestion system must handle both native script and Romanized input for Indic languages. This is an open design question — see CONTEXT.md.

**Sparse-language graceful handling:** If a language has few books, its suggestion index will be thin. When suggestions are sparse, the response should be honest (fewer suggestions, not padded with irrelevant terms) rather than falling back to English suggestions unprompted.

#### Accessibility

The suggestion dropdown implements the ARIA combobox pattern (WAI-ARIA 1.2):
- `role="combobox"` on the search input
- `role="listbox"` on the suggestion dropdown
- `role="option"` on each suggestion
- `aria-activedescendant` tracks keyboard-selected suggestion
- Arrow keys navigate suggestions, `Enter` selects, `Escape` dismisses
- Screen reader announces suggestion count on open ("7 suggestions available")
- Screen reader announces each suggestion as arrow keys navigate
- Bridge hints announced as supplementary text
- High contrast mode: suggestion categories distinguished by prefix text, not color alone

#### Phase Progression

| Phase | Suggestion Capability | Source |
|-------|----------------------|--------|
| 0 | Basic prefix matching on single-book vocabulary + chapter titles | Corpus extraction from Autobiography, pre-computed |
| 3 | Multi-book vocabulary + theme names + bridge-powered suggestions + curated queries | Expanded corpus + spiritual-terms.json + editorial |
| 10 | Per-language suggestion indices + transliteration support | Language-specific indices |
| 13 | Optional personal "recent searches" (client-side `localStorage` only, no server storage) | On-device only |

#### Interaction with Intent Classification

Suggestions and intent classification (ADR-005 E1) are complementary, not redundant:
- **Suggestions** operate *before* query submission (as-you-type, < 50ms, no LLM)
- **Intent classification** operates *after* query submission (routes the final query, uses Claude Haiku)

When a seeker selects a suggestion, intent classification still runs on the selected text. The suggestion narrows the query; intent classification routes it. A seeker who selects "meditation" (term suggestion) gets routed to the meditation theme page by intent classification. A seeker who selects "How do I meditate?" (curated query) gets routed to search with appropriate expansion.

---

## DES-004: Data Model

### Neon PostgreSQL Schema

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;    -- pgvector (dense vector search)
CREATE EXTENSION IF NOT EXISTS pg_search; -- ParadeDB BM25 full-text search (ADR-114)
CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- trigram similarity (fuzzy matching, suggestion fallback)
CREATE EXTENSION IF NOT EXISTS unaccent;  -- diacritics-insensitive search (ADR-080)

-- ============================================================
-- BOOKS
-- ============================================================
CREATE TABLE books (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 title TEXT NOT NULL,
 subtitle TEXT,
 author TEXT NOT NULL DEFAULT 'Paramahansa Yogananda',
 publication_year INTEGER,
 language TEXT NOT NULL DEFAULT 'en',
 isbn TEXT,
 source_url TEXT, -- PDF URL for Phase 0 ingestion
 contentful_id TEXT, -- Contentful entry ID (production)
 cover_image_url TEXT,
 bookstore_url TEXT, -- SRF Bookstore URL for "Find this book" link.
 -- Points to SRF Bookstore for all books. If per-language bookstore
 -- routing is needed in Phase 10 (YSS for Hindi/Bengali), add a simple
 -- lookup then — zero schema changes required now. (ADR-028)
 edition TEXT, -- e.g., "13th Edition", "Revised 2024" (ADR-034)
 edition_year INTEGER, -- year of this specific edition (ADR-034)
 canonical_book_id UUID REFERENCES books(id), -- links translations to the original (English) edition;
 -- NULL for originals. Enables "Available in 6 languages"
 -- on library page and cross-language navigation.
 content_format TEXT NOT NULL DEFAULT 'prose' -- 'prose' (default), 'chant', 'poetry' (ADR-059).
 CHECK (content_format IN ('prose', 'chant', 'poetry')),
 -- Controls reader rendering: prose = continuous scroll,
 -- chant/poetry = whole-unit pages with chant-to-chant nav.
 -- Chant format enables inline media panel for
 -- performance_of relations (deterministic audio/video links).
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now
);

-- ============================================================
-- BOOK CHUNKS ARCHIVE (edition transitions — ADR-034)
-- ============================================================
-- When SRF publishes a revised edition, old edition data is archived here
-- (not deleted) to preserve historical citations and audit trail.
CREATE TABLE book_chunks_archive (
 id UUID PRIMARY KEY,
 book_id UUID NOT NULL REFERENCES books(id),
 chapter_id UUID REFERENCES chapters(id),
 content TEXT NOT NULL,
 page_number INTEGER,
 section_heading TEXT,
 paragraph_index INTEGER,
 embedding VECTOR(1024), -- matches current model dimension (ADR-118)
 embedding_model TEXT NOT NULL,
 content_hash TEXT,
 language TEXT NOT NULL DEFAULT 'en',
 edition TEXT, -- edition this chunk belonged to
 archived_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 original_created_at TIMESTAMPTZ NOT NULL
);

-- ============================================================
-- BOOK STORE LINKS — REMOVED (ADR-028)
-- ============================================================
-- The book_store_links table was removed as over-designed for a portal
-- that is not an e-commerce gateway. The books.bookstore_url column
-- points to the SRF Bookstore. If per-language bookstore routing is
-- needed in Phase 10, a simple table or column can be added then.

-- ============================================================
-- CHAPTERS
-- ============================================================
CREATE TABLE chapters (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
 chapter_number INTEGER NOT NULL,
 title TEXT,
 contentful_id TEXT, -- Contentful entry ID (production)
 sort_order INTEGER NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE INDEX idx_chapters_book ON chapters(book_id, sort_order);

-- ============================================================
-- BOOK CHUNKS (the core search table)
-- ============================================================
CREATE TABLE book_chunks (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
 chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,

 -- The actual text (verbatim from the book)
 content TEXT NOT NULL,

 -- Location metadata
 page_number INTEGER,
 section_heading TEXT,
 paragraph_index INTEGER, -- position within chapter

 -- Search infrastructure
 embedding VECTOR(1024), -- Voyage voyage-3-large embedding vector (ADR-118)
 embedding_model TEXT NOT NULL DEFAULT 'voyage-3-large', -- which model generated this vector (ADR-046)
 embedding_dimension INTEGER NOT NULL DEFAULT 1024, -- vector dimensions for this chunk
 embedded_at TIMESTAMPTZ NOT NULL DEFAULT now(), -- when this chunk was last embedded
 script TEXT, -- latin|cjk|arabic|cyrillic|devanagari — routes BM25 index (ADR-114)
 language_confidence REAL, -- fastText detection confidence

 -- Contentful linkage (production)
 contentful_id TEXT, -- Contentful entry ID of source block

 -- Chunk context (for overlap / windowing)
 prev_chunk_id UUID, -- previous chunk for context continuity
 next_chunk_id UUID, -- next chunk for "read more"

 -- Cross-language alignment (Phase 10)
 canonical_chunk_id UUID REFERENCES book_chunks(id), -- links translated chunk to its English original;
 -- NULL for originals. Enables "Read this in Spanish →".

 -- Unified enrichment output (ADR-115)
 summary TEXT, -- "This passage is primarily about..." — in chunk's detected language
 summary_en TEXT, -- English translation for cross-lingual UI (async, non-English only)
 topics TEXT[], -- canonical topic labels for thematic indexing
 entities JSONB, -- typed entity extraction, validated against entity_registry (ADR-116)
 domain TEXT, -- philosophy|narrative|technique|devotional|poetry
 experiential_depth SMALLINT, -- 1-7: ordinary waking → nirvikalpa samadhi (ADR-115)
 emotional_quality TEXT[], -- consoling|inspiring|instructional|devotional|demanding|celebratory
 voice_register TEXT, -- intimate|cosmic|instructional|devotional|philosophical|humorous
 cross_references JSONB, -- explicit refs to other works, teachers, scriptures
 semantic_density TEXT, -- high|medium|low (ADR-048)

 -- Metadata
 language TEXT NOT NULL DEFAULT 'en',
 accessibility_level SMALLINT, -- 1=universal, 2=accessible, 3=deep (ADR-005 E3)
 -- NULL until classified. Computed by Claude at ingestion, spot-checked by reviewer.
 -- Used for Today's Wisdom (prefer 1–2), theme pages (default 1–2, "Show deeper" shows all).
 neptune_node_id TEXT, -- graph linkage (Phase 4+, ADR-117)
 metadata JSONB DEFAULT '{}',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

-- Vector similarity search (HNSW for fast approximate nearest neighbor)
CREATE INDEX idx_chunks_embedding ON book_chunks
 USING hnsw (embedding vector_cosine_ops)
 WITH (m = 16, ef_construction = 64);

-- BM25 full-text search (pg_search / ParadeDB — ADR-114)
-- Primary: ICU tokenizer covers ~90% of languages
CREATE INDEX chunks_bm25_icu ON book_chunks
 USING bm25 (id, content, summary, topics)
 WITH (
  key_field = 'id',
  text_fields = '{
   "content": {"tokenizer": {"type": "icu"}, "record": "position"},
   "summary": {"tokenizer": {"type": "icu"}},
   "topics":  {"tokenizer": {"type": "icu"}}
  }'
 );

-- Phase 10: Chinese (Jieba) and Japanese (Lindera) partial indexes
-- CREATE INDEX chunks_bm25_zh ON book_chunks USING bm25 (id, content)
--  WITH (key_field = 'id', text_fields = '{"content": {"tokenizer": {"type": "jieba"}}}')
--  WHERE script = 'cjk' AND language LIKE 'zh%';
-- CREATE INDEX chunks_bm25_ja ON book_chunks USING bm25 (id, content)
--  WITH (key_field = 'id', text_fields = '{"content": {"tokenizer": {"type": "lindera"}}}')
--  WHERE script = 'cjk' AND language = 'ja';

-- Trigram index for fuzzy/partial matching (suggestion fallback, ADR-120)
CREATE INDEX idx_chunks_trgm ON book_chunks USING GIN (content gin_trgm_ops);

-- Enrichment metadata indexes
CREATE INDEX idx_chunks_domain ON book_chunks(domain);
CREATE INDEX idx_chunks_depth ON book_chunks(experiential_depth);
CREATE INDEX idx_chunks_topics ON book_chunks USING GIN(topics);
CREATE INDEX idx_chunks_quality ON book_chunks USING GIN(emotional_quality);

-- Lookup by book
CREATE INDEX idx_chunks_book ON book_chunks(book_id, chapter_id, paragraph_index);

-- Lookup by Contentful ID (for webhook-driven updates)
CREATE INDEX idx_chunks_contentful ON book_chunks(contentful_id) WHERE contentful_id IS NOT NULL;

-- Language-filtered search (critical for multilingual — ensures search
-- stays within the user's locale unless cross-language is requested)
CREATE INDEX idx_chunks_language ON book_chunks(language);

-- ============================================================
-- FULL-TEXT SEARCH NOTE (ADR-114)
-- ============================================================
-- pg_search / ParadeDB BM25 replaces tsvector for all full-text search.
-- The BM25 index (chunks_bm25_icu above) handles tokenization, stemming,
-- and relevance ranking internally. No tsvector column or trigger needed.
-- ICU tokenizer handles diacritics (ā→a, ṇ→n, ś→s, etc.) and most
-- languages. CJK-specific indexes (Jieba, Lindera) added in Phase 10.
-- The unaccent extension is still loaded for pg_trgm fuzzy matching.
```

> **Terminology note:** The database table `teaching_topics` is exposed as `themes` in the API (`/api/v1/themes`) and displayed as "Doors of Entry" in the seeker-facing UI. The related junction table `chunk_topics` links passages to themes. These terms all refer to the same concept: curated thematic groupings of Yogananda's teachings (e.g., Peace, Courage, Healing). See ADR-031 and ADR-032.

```sql
-- ============================================================
-- LIFE THEMES (curated thematic entry points)
-- ============================================================
-- Multi-category theme taxonomy (ADR-032, ADR-033):
-- 'quality' — spiritual/emotional states: Peace, Courage, Healing, Joy, Purpose, Love
-- Displayed as "Doors of Entry" on the homepage (6 cards).
-- 'situation' — life circumstances: Relationships, Parenting, Loss & Grief, Work, etc.
-- 'person' — spiritual figures Yogananda discusses: Christ, Krishna, Lahiri Mahasaya, etc.
-- 'principle' — yogic ethical principles: Ahimsa, Satya, Brahmacharya, Tapas, etc. (Yama/Niyama)
-- 'scripture' — scriptural frameworks Yogananda interprets: Yoga Sutras, Bhagavad Gita, Bible
-- 'practice' — spiritual practices: Meditation, Concentration, Pranayama, Affirmation
-- 'yoga_path' — yoga paths: Kriya, Raja, Bhakti, Karma, Jnana, Hatha, Mantra, Laya
-- Non-quality categories accessible from "Explore" pages and the Library.
-- Not shown on the homepage grid to preserve the calm six-door design.
CREATE TABLE teaching_topics (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT NOT NULL UNIQUE, -- English display name: "Peace", "Courage", "Relationships", etc.
 slug TEXT NOT NULL UNIQUE, -- URL slug: "peace", "relationships", etc. (always English for URL stability)
 category TEXT NOT NULL DEFAULT 'quality', -- 'quality', 'situation', 'person', 'principle',
 -- 'scripture', 'practice', 'yoga_path' (ADR-032, ADR-033)
 description TEXT, -- brief editorial description used for auto-tagging and internal reference
 description_embedding VECTOR(1024), -- embedding of `description` for auto-tagging (same model as book_chunks, ADR-118)
 header_quote TEXT, -- a Yogananda quote encapsulating this theme (displayed on theme page)
 header_citation TEXT, -- citation for the header quote
 sort_order INTEGER NOT NULL DEFAULT 0, -- display order within category
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE INDEX idx_teaching_topics_category ON teaching_topics(category);

-- ============================================================
-- LIFE THEME TRANSLATIONS (localized theme names and header quotes)
-- ============================================================
-- Slugs stay in English for URL stability (/es/themes/peace, not /es/temas/paz).
-- Display names and header quotes are localized per language.
-- Phase 1: table created (empty). Phase 10: populated via AI-assisted workflow (ADR-078).

CREATE TABLE topic_translations (
 theme_id UUID NOT NULL REFERENCES teaching_topics(id) ON DELETE CASCADE,
 language TEXT NOT NULL, -- locale code: 'es', 'de', 'fr', etc.
 name TEXT NOT NULL, -- localized display name: "Paz", "Mut", "Paix"
 header_quote TEXT, -- localized header quote (from official translation)
 header_citation TEXT, -- localized citation
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 PRIMARY KEY (theme_id, language)
);

-- ============================================================
-- CHUNK-THEME JOIN (many-to-many: passages belong to themes)
-- ============================================================
-- tagged_by values (three-state provenance):
-- 'manual' — human placed this tag directly (editorial curation)
-- 'auto' — machine proposed via embedding similarity, not yet reviewed
-- 'reviewed' — machine proposed, human approved (distinguishes "human created" from "human verified")
-- Only 'manual' and 'reviewed' tags are served to users. 'auto' tags are candidates awaiting review.
CREATE TABLE chunk_topics (
 chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
 theme_id UUID NOT NULL REFERENCES teaching_topics(id) ON DELETE CASCADE,
 relevance FLOAT DEFAULT 1.0, -- editorial relevance weight (1.0 = normal, higher = more relevant)
 tagged_by TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'auto', or 'reviewed'
 similarity FLOAT, -- cosine similarity score when tagged_by = 'auto' or 'reviewed' (NULL for manual)
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 PRIMARY KEY (chunk_id, theme_id)
);

CREATE INDEX idx_chunk_topics_theme ON chunk_topics(theme_id);
CREATE INDEX idx_chunk_topics_pending ON chunk_topics(tagged_by) WHERE tagged_by = 'auto'; -- fast lookup for review queue

-- ============================================================
-- DAILY PASSAGES (curated pool for "Today's Wisdom")
-- ============================================================
CREATE TABLE daily_passages (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
 season_affinity TEXT[], -- optional: ['winter', 'renewal'] for seasonal weighting
 tone TEXT, -- 'consoling', 'joyful', 'challenging', 'contemplative', 'practical' (ADR-005 E8)
 -- Classified by Claude at curation time, spot-checked by reviewer.
 -- Selection algorithm ensures tonal variety across the week.
 is_active BOOLEAN NOT NULL DEFAULT true,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE INDEX idx_daily_passages_active ON daily_passages(is_active) WHERE is_active = true;

-- ============================================================
-- AFFIRMATIONS (curated pool for "The Quiet Corner")
-- ============================================================
CREATE TABLE affirmations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 content TEXT NOT NULL, -- the affirmation text (verbatim from source)
 book_title TEXT NOT NULL, -- source book
 page_number INTEGER,
 section_heading TEXT,
 chunk_id UUID REFERENCES book_chunks(id) ON DELETE SET NULL, -- link to full chunk if applicable
 language TEXT NOT NULL DEFAULT 'en', -- required for Quiet Corner language filtering
 is_active BOOLEAN NOT NULL DEFAULT true,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE INDEX idx_affirmations_active ON affirmations(is_active) WHERE is_active = true;

-- ============================================================
-- INITIAL THEME DATA
-- ============================================================
-- Phase 0: six spiritual quality themes (displayed as "Doors of Entry" on homepage)
INSERT INTO teaching_topics (name, slug, category, sort_order, description) VALUES
 ('Peace', 'peace', 'quality', 1, 'Inner peace, calmness, stillness of mind, overcoming restlessness and anxiety, mental tranquility, equanimity in the face of difficulty'),
 ('Courage', 'courage', 'quality', 2, 'Overcoming fear, bravery, inner strength, perseverance through difficulty, spiritual fortitude, willpower'),
 ('Healing', 'healing', 'quality', 3, 'Physical healing, emotional healing, recovery from suffering, divine healing power, overcoming illness, spiritual wholeness'),
 ('Joy', 'joy', 'quality', 4, 'Divine joy, bliss, happiness, cheerfulness, overcoming sadness and depression, finding joy within, ever-new joy'),
 ('Purpose', 'purpose', 'quality', 5, 'Life purpose, meaning, dharma, vocation, finding direction, why am I here, fulfilling divine plan'),
 ('Love', 'love', 'quality', 6, 'Divine love, unconditional love, devotion, human love, expanding the heart, love for God, love for all beings');

-- Phase 3+: life situation themes (accessible from "Browse all themes" page, not on homepage grid)
-- These are added as content is ingested and sufficient passages are confirmed.
-- Minimum threshold: ~20 reviewed passages before a situation theme page goes live.
-- INSERT INTO teaching_topics (name, slug, category, sort_order, description) VALUES
-- ('Relationships', 'relationships', 'situation', 1, 'Marriage, friendship, family bonds, human love, companionship, interpersonal harmony, forgiveness between people, how to treat others, divine friendship'),
-- ('Parenting', 'parenting', 'situation', 2, 'Raising children, parenthood, guiding young souls, family life, teaching children spiritual values, a parent''s duty'),
-- ('Loss & Grief', 'loss-and-grief', 'situation', 3, 'Death of a loved one, bereavement, grief, consolation, the soul''s continuity, life after death, eternal life'),
-- ('Work', 'work', 'situation', 4, 'Livelihood, career, right activity, duty, service, karma yoga, finding meaning in work, balancing material and spiritual life'),
-- ('Loneliness', 'loneliness', 'situation', 5, 'Isolation, feeling alone, finding the inner companion, solitude vs loneliness, divine companionship, belonging'),
-- ('Aging', 'aging', 'situation', 6, 'Growing older, the body and the soul, vitality, wisdom of age, preparing for the afterlife, eternal youth of the spirit');

-- Phase 5+: exploration themes — persons, principles, scriptures, practices (ADR-033)
-- Same tagging pipeline as quality/situation themes. No fixed minimum — editorial judgment decides when a topic has enough depth to publish.
-- INSERT INTO teaching_topics (name, slug, category, sort_order, description) VALUES
--
-- -- SPIRITUAL FIGURES (category = 'person')
-- ('Christ', 'christ', 'person', 1, 'Jesus Christ, Christ Consciousness, the Second Coming, the teachings of Jesus, Yogananda''s interpretation of Christianity, the Christ of the East and West'),
-- ('Krishna', 'krishna', 'person', 2, 'Lord Krishna, the Bhagavad Gita''s speaker, divine cowherd, avatar, cosmic consciousness personified, the universal guru'),
-- ('Lahiri Mahasaya', 'lahiri-mahasaya', 'person', 3, 'Lahiri Mahasaya, Yogananda''s param-guru, Kriya Yoga master, the householder yogi, revival of ancient yoga science'),
-- ('Sri Yukteswar', 'sri-yukteswar', 'person', 4, 'Sri Yukteswar, Yogananda''s guru, Jnanavatar, wisdom incarnation, astrology and scripture, guru-disciple relationship'),
-- ('Patanjali', 'patanjali', 'person', 5, 'Patanjali, author of the Yoga Sutras, father of yoga philosophy, eight limbs, systematic yoga science'),
-- ('Kabir', 'kabir', 'person', 6, 'Kabir, mystic poet, weaver saint, union of Hindu and Muslim devotion, direct experience of God'),
-- ('Divine Mother', 'divine-mother', 'person', 7, 'Divine Mother, God as Mother, cosmic feminine, Kali, unconditional love of God, Yogananda''s devotion to the Mother aspect'),
--
-- -- YOGIC PRINCIPLES (category = 'principle') — Yama/Niyama from Patanjali's Yoga Sutras
-- ('Ahimsa', 'ahimsa', 'principle', 1, 'Non-violence, non-injury, compassion for all beings, harmlessness in thought word and deed, the first yama'),
-- ('Satya', 'satya', 'principle', 2, 'Truthfulness, honesty, integrity, living in truth, speaking truth, the second yama'),
-- ('Asteya', 'asteya', 'principle', 3, 'Non-stealing, non-covetousness, contentment with what one has, the third yama'),
-- ('Brahmacharya', 'brahmacharya', 'principle', 4, 'Self-control, moderation, conservation of vital energy, chastity, the fourth yama'),
-- ('Aparigraha', 'aparigraha', 'principle', 5, 'Non-attachment, non-possessiveness, simplicity, freedom from greed, the fifth yama'),
-- ('Saucha', 'saucha', 'principle', 6, 'Cleanliness, purity of body and mind, internal and external purification, the first niyama'),
-- ('Santosha', 'santosha', 'principle', 7, 'Contentment, acceptance, inner satisfaction, the second niyama'),
-- ('Tapas', 'tapas', 'principle', 8, 'Self-discipline, austerity, spiritual fire, perseverance, the third niyama'),
-- ('Svadhyaya', 'svadhyaya', 'principle', 9, 'Self-study, scriptural study, introspection, the fourth niyama'),
-- ('Ishvara Pranidhana', 'ishvara-pranidhana', 'principle', 10, 'Surrender to God, devotion, offering actions to the divine, the fifth niyama'),
--
-- -- SACRED TEXTS (category = 'scripture')
-- ('Yoga Sutras', 'yoga-sutras', 'scripture', 1, 'Patanjali''s Yoga Sutras, eight limbs of yoga, systematic yoga philosophy, samadhi, pratyahara, dharana, dhyana'),
-- ('Bhagavad Gita', 'bhagavad-gita', 'scripture', 2, 'The Bhagavad Gita, Krishna and Arjuna, battlefield of life, karma yoga, bhakti yoga, jnana yoga, God Talks With Arjuna'),
-- ('Bible', 'bible', 'scripture', 3, 'The Holy Bible, Old and New Testament, Christ''s teachings, Yogananda''s interpretation of Christianity, the Second Coming'),
-- ('Rubaiyat', 'rubaiyat', 'scripture', 4, 'Rubaiyat of Omar Khayyam, Wine of the Mystic, Yogananda''s spiritual interpretation, Persian poetry, divine intoxication'),
--
-- -- SPIRITUAL PRACTICES (category = 'practice')
-- ('Meditation', 'meditation', 'practice', 1, 'Meditation technique, how to meditate, stillness, concentration, going within, interiorization, daily practice'),
-- ('Concentration', 'concentration', 'practice', 2, 'One-pointed attention, focus, mental power, will, dharana, training the mind'),
-- ('Pranayama', 'pranayama', 'practice', 3, 'Breath control, life force, prana, vital energy, breathing exercises, energy control'),
-- ('Affirmation', 'affirmation', 'practice', 4, 'Affirmations, positive thinking, mental healing, thought power, Scientific Healing Affirmations, will and affirmation'),
-- ('Devotion', 'devotion', 'practice', 5, 'Bhakti, love for God, prayer, chanting, divine love, heart-centered practice, surrender'),
--
-- -- YOGA PATHS (category = 'yoga_path')
-- ('Kriya Yoga', 'kriya-yoga', 'yoga_path', 1, 'Kriya Yoga, the royal technique, spinal magnetization, life force control, Babaji''s yoga, Lahiri Mahasaya''s science'),
-- ('Raja Yoga', 'raja-yoga', 'yoga_path', 2, 'Raja Yoga, the royal path, Patanjali''s eightfold path, meditation and mental control, astanga yoga'),
-- ('Bhakti Yoga', 'bhakti-yoga', 'yoga_path', 3, 'Bhakti Yoga, the path of devotion, love for God, divine love, chanting, prayer, emotional surrender'),
-- ('Karma Yoga', 'karma-yoga', 'yoga_path', 4, 'Karma Yoga, the path of action, selfless service, right activity, nishkama karma, duty without attachment'),
-- ('Jnana Yoga', 'jnana-yoga', 'yoga_path', 5, 'Jnana Yoga, the path of wisdom, discrimination, viveka, intellectual understanding, Vedantic inquiry'),
-- ('Hatha Yoga', 'hatha-yoga', 'yoga_path', 6, 'Hatha Yoga, physical postures, asana, body as temple, health, Energization Exercises, physical purification'),
-- ('Mantra Yoga', 'mantra-yoga', 'yoga_path', 7, 'Mantra Yoga, sacred sound, repetition of God''s name, chanting, japa, AUM, vibratory consciousness'),
-- ('Laya Yoga', 'laya-yoga', 'yoga_path', 8, 'Laya Yoga, absorption, dissolution of ego, merging in the Infinite, kundalini, subtle energy centers');

-- ============================================================
-- THEME TAGGING PIPELINE (ADR-032)
-- ============================================================
-- Semi-automated: embeddings propose, humans approve.
--
-- Adding a new theme:
-- 1. INSERT into teaching_topics with name, slug, category, description
-- 2. Embed the description → store in description_embedding
-- 3. Run cosine similarity: compare description_embedding against all book_chunks.embedding
-- 4. Chunks above threshold (e.g., 0.45) get INSERT into chunk_topics with tagged_by='auto'
-- 5. Optional: Claude Opus classifies ambiguous chunks near the threshold (ADR-014 batch tier — classifying, not generating)
-- 6. Human reviews candidate list, approves/rejects → tagged_by updated to 'reviewed' or row deleted
-- 7. Topic page goes live when an editor decides the tagged passages have sufficient depth (no fixed minimum)
--
-- Auto-tagging is cheap: pure vector math against existing embeddings. No re-ingestion.
-- Adding a new theme retroactively requires zero re-embedding — only a similarity scan + human review.
--
-- Multilingual: the multilingual embedding model places semantically equivalent text
-- in different languages close in vector space, so English theme descriptions produce
-- reasonable candidates for non-English chunks. Per-language descriptions improve accuracy
-- for languages with different spiritual vocabulary.

-- ============================================================
-- SEARCH QUERY LOG (anonymized, for understanding seeker needs)
-- ============================================================
CREATE TABLE search_queries (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 query_text TEXT NOT NULL,
 query_expanded TEXT[], -- expanded search terms (if AI was used)
 results_count INTEGER,
 search_mode TEXT, -- 'hybrid', 'fts_only', 'vector_only'
 language TEXT DEFAULT 'en',
 duration_ms INTEGER, -- search latency
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

-- No user identification stored. Queries are anonymized.
-- Time-series index for analytics.
CREATE INDEX idx_queries_time ON search_queries(created_at DESC);

-- No retention policy needed. At ~1,000 searches/day, the raw table
-- grows ~73 MB/year — trivially manageable for Neon over a 10-year horizon.
-- If retention ever becomes necessary, a simple aggregation can be added then.

-- ============================================================
-- CHUNK RELATIONS (pre-computed semantic similarity between passages)
-- ============================================================
-- Powers the "Related Teachings" side panel in the reader,
-- "Continue the Thread" end-of-chapter suggestions, and
-- graph traversal across the library. (ADR-050)
--
-- Pre-computed at ingestion time. For each chunk, store the
-- top 30 most similar chunks (excluding adjacent paragraphs
-- from the same chapter — those are already "in context").
--
-- Top 30 provides headroom for filtered queries (by book,
-- language, content type). If filtering yields < 3 results,
-- fall back to a real-time vector similarity query.

CREATE TABLE chunk_relations (
 source_chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
 target_chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
 similarity FLOAT NOT NULL,
 rank INTEGER NOT NULL, -- 1 = most similar, 2 = second, etc.
 relation_type TEXT, -- NULL (Phase 0–2), classified in Phase 5 (ADR-005 E6):
 -- 'same_topic' — both passages address the same theme
 -- 'develops_further'— target develops the source idea at greater length
 -- 'personal_story' — target is a personal illustration of the source teaching
 -- 'practical' — target is a practical application or affirmation
 -- 'performance_of' — target audio/video is a performance of source chant
 -- (deterministic editorial link, not vector-derived;
 -- similarity=1.0, rank orders multiple performances;
 -- ADR-059)
 -- Classified by Claude for top 10 cross-book relations per chunk. Spot-checked.
 -- performance_of relations are editorially curated, not AI-classified.
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 PRIMARY KEY (source_chunk_id, target_chunk_id)
);

-- Fast lookup: "what's related to what I'm reading?"
CREATE INDEX idx_chunk_relations_source ON chunk_relations(source_chunk_id, rank);

-- Reverse lookup: "what passages consider this chunk related?"
CREATE INDEX idx_chunk_relations_target ON chunk_relations(target_chunk_id);

-- ============================================================
-- CHUNK REFERENCES (editorial cross-references within text)
-- ============================================================
-- Human-curated cross-references for explicit mentions:
-- "As my guru Sri Yukteswar taught..." → link to that passage.
-- Supplements the automatic embedding-based relations above.

-- chunk_references table added in Phase 5 (Related Teachings & Reader Intelligence)
CREATE TABLE chunk_references (
 source_chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
 target_chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
 reference_type TEXT NOT NULL DEFAULT 'mention', -- 'mention', 'quote', 'scripture', 'continuation'
 note TEXT, -- editorial note (e.g., "References Bhagavad Gita 2:47")
 created_by TEXT NOT NULL DEFAULT 'editorial', -- 'editorial' or 'auto'
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 PRIMARY KEY (source_chunk_id, target_chunk_id)
);

CREATE INDEX idx_chunk_references_source ON chunk_references(source_chunk_id);
CREATE INDEX idx_chunk_references_target ON chunk_references(target_chunk_id);

-- ============================================================
-- HYBRID SEARCH: RRF over pgvector + pg_search BM25 (ADR-044, ADR-114)
-- ============================================================
-- Combines dense vector similarity (pgvector) and BM25 keyword
-- relevance (pg_search/ParadeDB) using Reciprocal Rank Fusion.
-- Phase 4+ adds PATH C (Neptune GraphRAG) as a third source
-- merged at the application layer before reranking (ADR-119).

-- Example hybrid query (implemented in /lib/services/search.ts):
--
-- WITH vector_results AS (
--   SELECT id, content, book_id,
--     1 - (embedding <=> $query_embedding) AS score,
--     ROW_NUMBER() OVER (ORDER BY embedding <=> $query_embedding) AS rank
--   FROM book_chunks
--   WHERE language = $language
--   ORDER BY embedding <=> $query_embedding
--   LIMIT 50
-- ),
-- keyword_results AS (
--   SELECT id, content, book_id,
--     paradedb.score(id) AS score,
--     ROW_NUMBER() OVER (ORDER BY paradedb.score(id) DESC) AS rank
--   FROM book_chunks
--   WHERE id @@@ paradedb.match('content', $expanded_query)
--     AND language = $language
--   LIMIT 50
-- ),
-- rrf AS (
--   SELECT
--     COALESCE(v.id, k.id) AS id,
--     (COALESCE(1.0 / (60 + v.rank), 0) +
--      COALESCE(1.0 / (60 + k.rank), 0)) AS rrf_score
--   FROM vector_results v
--   FULL OUTER JOIN keyword_results k ON v.id = k.id
-- )
-- SELECT id, rrf_score FROM rrf ORDER BY rrf_score DESC LIMIT $match_count;

-- Note: The English fallback strategy (ADR-075) is implemented at the
-- service layer, not in the SQL function. When search_language results
-- < 3, findPassages calls hybrid_search a second time with
-- search_language='en' and merges the results, marking English
-- passages with an [EN] tag. This keeps the SQL function clean and
-- the fallback policy in application code where it belongs.

-- ============================================================
-- ENTITY REGISTRY (canonical entity resolution — ADR-116)
-- ============================================================
-- Built before first book ingestion. All enrichment entity extraction
-- validates against this registry. Feeds suggestion system (ADR-049,
-- ADR-120 Tiers 2 and 4) and knowledge graph nodes (ADR-117).
CREATE TABLE entity_registry (
 id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 canonical_name  TEXT NOT NULL,
 entity_type     TEXT NOT NULL,     -- Teacher|DivineName|Work|Technique|SanskritTerm|Concept|Place|ExperientialState
 aliases         TEXT[],            -- all known surface forms
 language        CHAR(5),
 definition      TEXT,
 srf_definition  TEXT,              -- Yogananda's specific definition if distinct
 neptune_node_id TEXT,              -- graph linkage (Phase 4+)
 created_at      TIMESTAMPTZ DEFAULT now(),
 UNIQUE(canonical_name, entity_type)
);

CREATE INDEX entity_aliases_idx ON entity_registry USING gin(aliases);

-- ============================================================
-- SANSKRIT NORMALIZATION (ADR-116, extends ADR-080)
-- ============================================================
-- Handles transliteration variants: "samadhi" = "Samaadhi" = "samahdi".
-- All variant forms loaded into suggestion system for fuzzy matching.
CREATE TABLE sanskrit_terms (
 id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 canonical_form  TEXT NOT NULL,     -- "samadhi"
 display_form    TEXT NOT NULL,     -- "Samadhi"
 devanagari      TEXT,              -- "समाधि"
 iast_form       TEXT,              -- "samādhi"
 common_variants TEXT[],            -- ["Samaadhi", "samahdi"]
 srf_definition  TEXT,
 domain          TEXT,              -- philosophy|practice|state|quality
 depth_level     INT,               -- if experiential state: 1-7 (ADR-115)
 weight          INT DEFAULT 100    -- suggestion ranking weight
);

-- ============================================================
-- SUGGESTION DICTIONARY (ADR-049, ADR-120)
-- ============================================================
-- Pre-computed suggestion vocabulary derived from corpus enrichment.
-- Six-tier hierarchy. No click_through tracking (DELTA compliance).
CREATE TABLE suggestion_dictionary (
 id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 suggestion      TEXT NOT NULL,
 display_text    TEXT,              -- formatted display (e.g., "Samadhi — superconscious state")
 suggestion_type TEXT NOT NULL,     -- scoped_query|entity|concept|sanskrit|learned_query|term
 language        CHAR(5) NOT NULL,
 script          TEXT NOT NULL,     -- latin|cjk|arabic|cyrillic|devanagari
 latin_form      TEXT,              -- transliteration for non-latin terms
 corpus_frequency INT DEFAULT 0,
 query_frequency  INT DEFAULT 0,   -- from anonymized, aggregated query log (ADR-053).
                                    -- DELTA note: this is aggregated "what the world searches for"
                                    -- (cf. ADR-090), not individual behavioral profiling.
                                    -- Acceptable under DELTA because no per-user attribution exists.
 editorial_boost  REAL DEFAULT 0,  -- 0.0–1.0, set by editors for promoted suggestions
 weight          REAL GENERATED ALWAYS AS (
  (corpus_frequency * 0.3) + (query_frequency * 0.5) + (editorial_boost * 0.2)
 ) STORED,                          -- weights sum to 1.0: corpus 30%, query 50%, editorial 20%
 entity_id       UUID REFERENCES entity_registry(id),
 book_id         UUID REFERENCES books(id),
 updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX suggestion_trgm_idx ON suggestion_dictionary USING gin(suggestion gin_trgm_ops);
CREATE INDEX suggestion_language_idx ON suggestion_dictionary(language, suggestion);
CREATE INDEX suggestion_weight_idx ON suggestion_dictionary(language, weight DESC);

-- ============================================================
-- EXTRACTED RELATIONSHIPS (audit trail for graph construction — ADR-115, ADR-117)
-- ============================================================
-- Every relationship triple extracted by the enrichment pipeline
-- is logged here. Loaded to Neptune in Phase 4+.
CREATE TABLE extracted_relationships (
 id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 chunk_id        UUID REFERENCES book_chunks(id),
 subject_entity  TEXT,
 relationship    TEXT,              -- TEACHES|INTERPRETS|DESCRIBES_STATE|MENTIONS|etc.
 object_entity   TEXT,
 confidence      REAL,
 loaded_to_graph BOOLEAN DEFAULT FALSE,
 created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- USER PROFILES (opt-in authenticated experience — ADR-121)
-- ============================================================
-- Account never required for core functionality. DELTA core
-- commitments preserved: no behavioral profiling, no gamification,
-- no engagement optimization. No profile_embedding column.
CREATE TABLE user_profiles (
 id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 auth0_id            TEXT UNIQUE NOT NULL,
 preferred_language  CHAR(5),
 tradition_background TEXT,         -- optional, user-provided
 practice_level      TEXT,          -- optional, user-provided
 created_at          TIMESTAMPTZ DEFAULT now()
);
```

### Contentful Content Model (Production)

```
Content Type: Book
├── title (Short Text, required, localized)
├── subtitle (Short Text, localized)
├── author (Short Text, default: "Paramahansa Yogananda")
├── publicationYear (Integer)
├── isbn (Short Text)
├── coverImage (Media, localized)
├── language (Short Text, default: "en")
├── chapters (References, many → Chapter)
└── slug (Short Text, unique, for URL generation)

Content Type: Chapter
├── title (Short Text, required, localized)
├── chapterNumber (Integer, required)
├── book (Reference → Book)
├── sections (References, many → Section)
└── sortOrder (Integer)

Content Type: Section
├── heading (Short Text, localized)
├── chapter (Reference → Chapter)
├── blocks (References, many → TextBlock)
└── sortOrder (Integer)

Content Type: TextBlock
├── content (Rich Text, required, localized)
│ └── stores text as JSON AST
│ preserves bold, italic, footnotes, verse numbers
├── section (Reference → Section)
├── pageNumber (Integer) — maps to physical book page
├── sortOrder (Integer)
└── metadata (JSON Object) — flexible field for verse refs, etc.
```

**Webhook pipeline (production):**
```
Contentful publish event
 │
 ▼
Webhook → Serverless Function (Lambda or Vercel Function)
 │
 ├── Fetch updated TextBlock from Contentful API
 ├── Extract plain text from Rich Text JSON AST
 ├── Generate embedding via OpenAI API
 ├── Upsert into Neon book_chunks table
 │ (matched by contentful_id)
 └── Log sync event
```

---

## DES-005: Content Ingestion Pipeline

### Phase 0 Pipeline (PDF → Neon)

```
Step 1: Download PDF
 └── Autobiography of a Yogi from spiritmaji.com

Step 2: Convert PDF → Structured Markdown
 └── Using `marker` (open-source, Python)
 or manual extraction + cleanup
 └── Output: chapters as separate .md files
 with headings, paragraphs preserved

Step 2.5: Unicode NFC Normalization (ADR-080)
 └── Apply Unicode NFC normalization to all extracted text
 └── IAST diacritical marks (ā, ṇ, ś, ṣ) have precomposed
 and decomposed representations — OCR output is
 unpredictable about which form it produces
 └── NFC ensures identical-looking strings are byte-identical
 └── Must run BEFORE any text comparison, deduplication,
 embedding, or indexing
 └── Also: detect Devanāgarī script blocks (/[\u0900-\u097F]/)
 in God Talks with Arjuna — flag for display preservation
 but exclude from embedding input

Step 3: Human Review / QA
 └── Verify OCR accuracy
 └── Correct spiritual terminology
 └── Ensure chapter/page boundaries are correct
 └── Flag Sanskrit diacritics that may have been mangled
 by PDF extraction (ADR-005 E4, ADR-080)
 └── This step is NON-NEGOTIABLE for sacred texts

Step 4: Chunk by Natural Boundaries
 └── Split at paragraph level
 └── Each chunk = one coherent passage
 └── Retain: chapter number, page number, section heading
 └── Target chunk size: 200-500 tokens
 (large enough to be a meaningful quote,
 small enough for precise retrieval)
 └── Include 1-sentence overlap with adjacent chunks
 Overlap algorithm: Take the last sentence of the preceding
 chunk and prepend it to the current chunk. Sentence boundary
 detection: split on /(?<=[.!?])\s+(?=[A-Z""])/ with special
 handling for abbreviations (Mr., Dr., St.) and Sanskrit terms
 containing periods. If the preceding chunk has no clear
 sentence boundary (e.g., verse fragments), use no overlap.
 The overlap text is included in the embedding but marked in
 metadata (overlap_chars count) so it can be excluded from
 display when the chunk is shown as a standalone quote.

Step 5: Language Detection (per-chunk, fastText)
 └── Detect primary language of each chunk
 └── Detect script (Latin, Devanagari, CJK, etc.)
 └── Assign language_confidence score
 └── Phase 0: English-only, but column populated for future use

Step 6: Entity Resolution (ADR-116)
 └── Resolve names, places, Sanskrit terms against entity_registry
 └── Match aliases: "Master" = "Guruji" = "Paramahansa Yogananda"
 └── Sanskrit normalization: "samadhi" = "Samaadhi" = "samahdi"
 └── Unknown entities flagged for human review queue
 └── Entity registry must be seeded BEFORE first book ingestion

Step 7: Unified Enrichment (single Claude pass per chunk, ADR-115)
 └── Claude generates structured JSON output:
     summary, topics, entities (typed), domain classification,
     experiential_depth (1–7), emotional_quality, voice_register,
     cross_references, extracted_relationships
 └── Entities validated against entity_registry (Step 6)
 └── Confidence < 0.7 flagged for human review queue
 └── Enrichment output stored as structured Postgres columns
 └── Replaces separate classification passes (E3–E8)

Step 8: Generate Embeddings
 └── Voyage voyage-3-large (1024 dimensions, ADR-118)
 └── Asymmetric encoding: document input type for chunks
 └── Cost: ~$0.06 per 1M tokens
 └── Entire Autobiography of a Yogi: < $0.30

Step 9: Insert into Neon
 └── Populate books, chapters, book_chunks tables
 └── BM25 index (pg_search) automatically updated on INSERT
 └── Verify: test searches return expected passages

Step 10: Compute Chunk Relations (ADR-050)
 └── For each new chunk, compute cosine similarity
 against all existing chunks
 └── Store top 30 most similar per chunk in chunk_relations
 └── Exclude adjacent paragraphs from same chapter
 (those are already "in context")
 └── Two modes:
 --full Recompute all relations (after embedding
 model migration per ADR-046)
 --incremental Compute only for new/updated chunks
 and update existing chunks' top-30
 if new chunks displace current entries
 └── Similarity is symmetric (A→B = B→A), so each pair
 computed once, both directions updated
 └── For Autobiography (~2,000 chunks): ~4M pairs, minutes
 └── For full corpus (~50K chunks): batched, still tractable

Step 11: Update Suggestion Dictionary (ADR-049, ADR-120)
 └── Extract distinctive terms from the book's chunks
 └── Add to suggestion_dictionary table with source attribution
 └── Sanskrit terms get inline definitions from sanskrit_terms table
 └── Suggestion index grows with each book — never shrinks

Step 12: Graph Load (Phase 4+, ADR-117)
 └── Create/update Neptune nodes: Teacher, Work, Chunk
 └── Create edges from extracted_relationships (Step 7)
 └── Attach Voyage embeddings to chunk nodes
 └── Run nightly graph algorithms: PageRank, community detection
```

### Production Pipeline (Contentful → Neon)

```
Step 1: Content editors enter/import book text into Contentful
 └── Using the Book → Chapter → Section → TextBlock model
 └── Rich Text fields preserve formatting
 └── Localized versions entered per locale

Step 2: On publish, Contentful webhook fires

Step 3: Sync service receives webhook
 └── Fetches the updated TextBlock
 └── Extracts plain text from Rich Text AST
 └── Language detection (fastText) + entity resolution (ADR-116)
 └── Unified enrichment pass (Claude, ADR-115)
 └── Generates embedding (Voyage voyage-3-large, ADR-118)
 └── Upserts into Neon (matched by contentful_id)

Step 4: Update chunk relations (incremental)
 └── Recompute relations for the updated chunk
 against all existing chunks (1 × N_total)
 └── Update other chunks' top-30 if the updated
 chunk now scores higher than their current #30

Step 5: Update suggestion dictionary
 └── Re-extract terms from updated chunk
 └── Merge into suggestion_dictionary

Step 6: Update graph (Phase 4+, ADR-117)
 └── Update Neptune node for the chunk
 └── Refresh extracted relationships as graph edges
 └── Nightly algorithm run picks up changes

Step 7: Search index, relations, suggestions, and graph
 are always in sync with editorial source
```

---

## ADR-041: Phase 0 Bootstrap

The path from "no code" to "running search" — the ceremony that transforms design documents into a working system.

### Environment Setup

```
1. Repository
 └── pnpm create next-app@latest srf-teachings --typescript --tailwind --app
 └── pnpm add @neondatabase/serverless @anthropic-ai/sdk voyageai
 └── Copy .env.example → .env.local (see below)

2. Neon Project
 └── Create project in Neon Console (or via MCP)
 └── Enable pgvector extension
 └── Note: connection string (pooled), direct connection string
 └── Create dev branch for local development

3. Database Schema
 └── pnpm add -D dbmate
 └── dbmate up (runs /migrations/001_initial_schema.sql)
 └── Verify: tables, indexes, BM25 index (pg_search), entity_registry

4. Vercel Project
 └── Link repo → Vercel
 └── Set environment variables (see below)
 └── First deploy: verify /api/v1/health returns OK

5. Sentry Project
 └── Create project in Sentry
 └── Configure NEXT_PUBLIC_SENTRY_DSN
 └── Verify error capture with test exception

6. First Content
 └── Run ingestion script (deliverable 0a.3)
 └── Verify: pnpm run ingest -- --book autobiography
 └── Check: book_chunks populated, embeddings present
 └── Run: pnpm run relations -- --full
 └── Smoke test: search "How do I overcome fear?" returns results
```

### Environment Variables (`.env.example`)

```env
# Neon PostgreSQL
DATABASE_URL= # Pooled connection string (for serverless)
DATABASE_URL_DIRECT= # Direct connection string (for dbmate migrations)

# AI Services (ADR-014)
AWS_REGION=us-east-1 # Bedrock region
CLAUDE_MODEL_CLASSIFY=anthropic.claude-3-5-haiku-20241022-v1:0 # Intent classification
CLAUDE_MODEL_EXPAND=anthropic.claude-3-5-haiku-20241022-v1:0 # Query expansion
CLAUDE_MODEL_RANK=anthropic.claude-3-5-haiku-20241022-v1:0 # Passage ranking (promote to Sonnet if benchmarks warrant)
CLAUDE_MODEL_BATCH=anthropic.claude-opus-4-6-v1 # Offline batch: theme tagging, reference extraction, translation drafting
VOYAGE_API_KEY= # Voyage voyage-3-large for embeddings (ADR-118)

# Observability
NEXT_PUBLIC_SENTRY_DSN= # Sentry error tracking
SENTRY_AUTH_TOKEN= # Source map uploads

# Vercel (set in Vercel dashboard, not .env)
# VERCEL_URL — auto-set by Vercel
```

---

## DES-006: Frontend Design

### Pages

| Route | Purpose | Data Source | Rendering | Indexed |
|-------|---------|------------|-----------|---------|
| `/` | Home — Today's Wisdom, search bar, thematic doors, "Seeking..." entry points, latest video | Neon (daily passages) + YouTube RSS | ISR (5 min) | Yes |
| `/search?q=...` | Search results — ranked verbatim quotes | Neon (hybrid search) | SSR | Yes (via `SearchAction`) |
| `/themes/[slug]` | Topic page — curated passages for a theme, person, principle, or practice | Neon (topic-tagged chunks) | ISR (1 hr) | Yes |
| `/quiet` | The Quiet Corner — single affirmation, timer, stillness | Neon (affirmations pool) | ISR (1 hr) | Yes |
| `/books` | The Library — book catalog with editorial descriptions | Contentful (SSG) or Neon (Phase 0) | ISR (24 hr) | Yes |
| `/books/[slug]` | Book landing page with cover, description, chapter list | Contentful (SSG) or Neon (Phase 0) | ISR (24 hr) | Yes |
| `/bookmarks` | Lotus Bookmarks — saved chapters and passages (client-only, `localStorage`) | `localStorage` (no server) | CSR | No (`noindex`) |
| `/books/[slug]/[chapter]` | Chapter reader | Contentful (SSG) or Neon (Phase 0) | ISR (7 days) | Yes |
| `/books/[slug]/[chapter]#chunk-[id]` | Deep link to specific passage | Same as above, scrolled to passage | ISR (7 days) | Yes (canonical: passage page) |
| `/passage/[chunk-id]` | Single passage shareable view (OG + Twitter Card optimized) | Neon | ISR (7 days) | Yes |
| `/about` | About SRF, Yogananda, the line of gurus, "Go Deeper" links | Static (ISR) | ISR (7 days) | Yes |
| `/events` | Gatherings & Events — convocation, commemorations, online events, retreats | Static (ISR) | ISR (24 hr) | Yes |
| `/places` | Sacred Places — SRF/YSS properties and biographical sites | Neon `places` table (ISR) | ISR (7 days) | Yes |
| `/places/[slug]` | Individual place detail with book cross-references | Neon `places` + `chunk_places` (ISR) | ISR (7 days) | Yes |
| `/videos` | Video library — categorized by playlist | YouTube API (ISR) | ISR (1 hr) | Yes |
| `/videos/[category]` | Filtered view (e.g., How-to-Live, Meditations) | YouTube API (ISR) | ISR (1 hr) | Yes |
| `/study` | Study Workspace — passage collection, teaching arc assembly, export (Phase 7, ADR-083) | `localStorage` (no server) | CSR | No (`noindex`) |
| `/collections` | Community Collections gallery — published/featured curated passage collections (Phase 14, ADR-086) | Neon (`study_outlines` where visibility = published/featured) | ISR (1 hr) | Yes |
| `/collections/[share-hash]` | Single community collection view (Phase 7 shared-link, Phase 14 published) | Neon (`study_outlines` + `study_outline_sections` + `study_outline_passages`) | ISR (24 hr) | Yes |
| `/feedback` | Seeker feedback — citation errors, search suggestions, general feedback (Phase 4, ADR-084) | Neon (`seeker_feedback`) | SSR | No (`noindex`) |
| `/privacy` | Privacy policy — what data is collected, why, how long, sub-processors, data subject rights (Phase 1, ADR-099) | Static (ISR) | ISR (30 days) | Yes |
| `/legal` | Legal information — terms of use, copyright, content licensing (Phase 1, ADR-099) | Static (ISR) | ISR (30 days) | Yes |
| `/browse` | Complete content index — all navigable content by category (Phase 1, DES-047) | Neon (ISR) | ISR (24 hr) | Yes |
| `/updates` | Portal updates — new books, features, languages (Phase 8+, ADR-105) | Neon `portal_updates` | ISR (1 hr) | Yes |

**Rendering key:** ISR = Incremental Static Regeneration (server-rendered, cached at CDN, revalidated on schedule). SSR = Server-Side Rendered (fresh on every request). CSR = Client-Side Rendered (JavaScript only, no server HTML). All ISR and SSR pages deliver complete HTML with JSON-LD, OG tags, Twitter Card tags, and full content to crawlers — no content page depends on client-side data fetching. Content negotiation (ADR-081 §11): all ISR/SSR routes also respond with structured JSON when the `Accept: application/json` header is sent. See ADR-081 §15 for the full rendering strategy rationale.

### Search Results Component

```
┌──────────────────────────────────────────────────────────┐
│ 🔍 How do I overcome fear? [Search] │
├──────────────────────────────────────────────────────────┤
│ │
│ 5 passages found across 2 books │
│ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ │ │
│ │ "The soul is ever free; it is deathless, │ │
│ │ birthless, ever-existing, ever-conscious, │ │
│ │ ever-new Bliss. When by meditation you │ │
│ │ realize this truth, fear will have no hold │ │
│ │ on you." │ │
│ │ │ │
│ │ Autobiography of a Yogi · Chapter 26 · p. 312 │ │
│ │ Read in context → │ │
│ │ │ │
│ └────────────────────────────────────────────────────┘ │
│ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ │ │
│ │ "Fear is the greatest enemy of man. It robs him │ │
│ │ of his true nature, of his joy, of his power │ │
│ │ to act wisely." │ │
│ │ │ │
│ │ Man's Eternal Quest · "Removing the Mask" · p. 87│ │
│ │ Read in context → │ │
│ │ │ │
│ └────────────────────────────────────────────────────┘ │
│ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ ... │ │
│ └────────────────────────────────────────────────────┘ │
│ │
└──────────────────────────────────────────────────────────┘
```

### DES-007: Opening Moment — Portal Threshold

On the **first visit** per browser session, the homepage presents a brief threshold before content appears:

1. Warm cream background with a small SRF lotus SVG (~40px, `--srf-gold` at 30% opacity) centered on the screen.
2. After 800ms, the lotus fades to 0% over 400ms as homepage content gently fades in.
3. Total: ~1.2 seconds. No text. No logo. No "loading..." message. Just a breath.

**Constraints:**
- **First visit only** per session (`sessionStorage`). Returning to homepage within the same session shows content immediately.
- **`prefers-reduced-motion`:** Entire threshold skipped. Content appears instantly.
- **Direct deep links:** Only applies to `/`. Navigation to `/books/...`, `/search?...`, etc. is never delayed.
- **Slow connections:** If content hasn't loaded when the threshold ends, the lotus remains visible until ready — replacing what would otherwise be a white flash or skeleton screen. A technical necessity becomes a contemplative gesture.

### Homepage: "The Living Library"

The homepage should feel like opening a sacred book — not a SaaS dashboard, not a landing page with a hero banner. Its purpose is threefold: offer a moment of stillness (Today's Wisdom), invite exploration (thematic doors), and provide a tool for the deliberate seeker (search).

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ │
│ │
│ "Have courage. Whatever you are going through │
│ will pass. Trust in God's plan for you." │
│ │
│ — Where There Is Light, p. 42 │
│ │
│ Show me another │
│ │
│ ─────────────────────────────────────────────────────────── │
│ │
│ What are you seeking? │
│ [________________________________] [Search] │
│ │
│ ─────────────────────────────────────────────────────────── │
│ │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Peace │ │ Courage │ │ Healing │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Joy │ │ Purpose │ │ Love │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│ │
│ ─────────────────────────────────────────────────────────── │
│ │
│ Seeking... │
│ │
│ · Peace in a restless mind │
│ · Comfort after loss │
│ · Purpose and direction │
│ · Courage through fear │
│ · The heart to forgive │
│ │
│ ─────────────────────────────────────────────────────────── │
│ │
│ Latest from @YoganandaSRF │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ ▶ thumb │ │ ▶ thumb │ │ ▶ thumb │ View all → │
│ │ title │ │ title │ │ title │ │
│ └─────────┘ └─────────┘ └─────────┘ │
│ │
└──────────────────────────────────────────────────────────────┘
```

#### Today's Wisdom

A single Yogananda passage displayed prominently on every visit. The passage changes on each page load.

**Source material (priority order):**
1. *Sayings of Paramahansa Yogananda* — standalone aphorisms, naturally quotable
2. *Where There Is Light* — topically organized excerpts
3. *Metaphysical Meditations* — affirmations and meditations
4. Curated selections from any ingested book (editorial)

**Behavior:**
- On page load, select a random passage from the `daily_passages` pool (see Data Model)
- "Show me another" link fetches a different random passage (client-side fetch to `/api/v1/daily-passage?exclude=[current-chunk-id]`). The same passage is never shown twice in a row.
- The passage gently cross-fades (300ms) to the new one — no page reload, no spinner. With `prefers-reduced-motion`: instant swap.
- There is no limit on how many times a reader can click "Show me another." The pool is the entire `daily_passages` table. This is bibliomancy — the ancient practice of opening a sacred text to a random page for guidance, in digital form.
- "Show me another" is a text link in Merriweather 300 with `--srf-gold` underline on hover. Not a button. Not a card. Just words — an invitation.
- No personalization, no tracking, no cookies — pure randomness
- Optional seasonal weighting: passages can be tagged with seasonal affinity (e.g., "renewal" passages weighted higher in January, "light" passages in December) — but this is editorial curation, not algorithmic

**Seasonal curation (optional, editorial):**

| Season | Affinity Tags | Examples |
|--------|--------------|---------|
| New Year (Jan) | renewal, willpower, beginnings | Teachings on new habits, determination |
| Spring (Mar–May) | growth, awakening, joy | Teachings on spiritual blossoming |
| Summer (Jun–Aug) | energy, vitality, abundance | Teachings on divine energy, prosperity |
| Autumn (Sep–Nov) | gratitude, harvest, introspection | Teachings on thankfulness, self-examination |
| Winter (Dec–Feb) | light, peace, inner warmth | Teachings on the inner light, stillness |

Seasonal weighting is a soft bias (e.g., 60% seasonal / 40% general), never a hard filter. A passage about courage can appear in any season.

**Circadian content choreography :**

The portal shifts visual warmth by time of day (DES-011). It also shifts *content* warmth. The passage pool carries a `time_affinity` tag — the same circadian bands as DES-011's color temperature:

| Band | Hours | Character | Passage affinity |
|------|-------|-----------|-----------------|
| Dawn | 5:00–8:59 | Awakening | Vitality, new beginnings, divine energy, Energization |
| Morning | 9:00–11:59 | Clarity | Willpower, concentration, right action, purpose |
| Afternoon | 12:00–16:59 | Steadiness | Perseverance, equanimity, courage, service |
| Evening | 17:00–20:59 | Softening | Gratitude, love, devotion, peace |
| Night | 21:00–4:59 | Consolation | The eternal soul, fearlessness, God's presence, comfort |

The 2 AM seeker — the person the "Seeking..." entry points are designed for — encounters passages about comfort and the eternal nature of consciousness, not about willpower and new habits. Zero tracking, zero profiling. The client sends `time_band` computed from `new Date.getHours`; the server selects from an affinity-weighted pool (60% time-matched / 40% general, same ratio as seasonal). Passages with no `time_affinity` (NULL) are eligible in all bands. Both seasonal and circadian affinities can apply simultaneously — they compose naturally as weighted random selection.

**Solar-position awareness (locale-sensitive circadian UX):**

The fixed-clock-hour bands above assume a single global relationship between "2 AM" and the human experience. They don't hold everywhere:

- **Brahmamuhurta (3:30–5:30 AM)** in Indian tradition is the auspicious pre-dawn period for meditation — a seeker awake at 4 AM in Kolkata is likely practicing, not unable to sleep from anxiety. "Consolation" at this hour misreads the cultural context.
- **Summer in Helsinki:** 2 AM has twilight. The emotional register of "Night" doesn't match the sky.
- **Equatorial regions:** Sunrise and sunset barely shift across the year. Fixed bands work better than at high latitudes.

The solution uses three signals already present on every request — none requiring new data collection:

1. **Browser timezone** — `Intl.DateTimeFormat().resolvedOptions().timeZone` gives the IANA zone name (e.g., `Asia/Kolkata`, `America/Chicago`). Client-side, no permission.
2. **Locale path prefix** — `/hi/` implies India, `/de/` implies Germany. The URL the seeker already chose.
3. **`navigator.language` country code** — `hi-IN`, `de-DE`. Already in the browser, client-side.

Timezone alone has a north-south accuracy problem: `America/Chicago` spans from Texas (26°N) to North Dakota (49°N) — a 1.5-hour summer sunrise spread. Adding country narrows this significantly. Timezone + country → centroid latitude is accurate to ±200km for most combinations, giving sunrise accuracy within ±15 minutes. For single-timezone countries (India, Japan, Germany), the accuracy is even better.

**Accepted inaccuracy:** For large multi-timezone countries (US, Russia, Brazil), the centroid latitude of a timezone+country combination still has ±30–45 minute sunrise uncertainty. This is acceptable because the bands are 1.5–3 hours wide and selection is probabilistic (60/40 weighted). A seeker at a band boundary might receive a passage from the adjacent band — which is still a reasonable passage for that hour. The design accepts this inaccuracy to remain DELTA-compliant. No geolocation API, no IP-derived location, no permission prompt.

**Latitude derivation:**

```
Client computes:
  1. timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
     (e.g., "Asia/Kolkata", "America/Chicago")
  2. country = navigator.language country code OR locale path prefix
     (e.g., "IN", "US", "DE")
  3. latitude = lookup(timezone, country)
     (static table, ~3KB — maps timezone+country pairs to centroid latitudes)
  4. sunrise, sunset = suncalc(latitude, timezoneLongitude, today)
     (deterministic solar calculation, ~2KB)
  5. time_band = classify(currentHour, sunrise, sunset, locale)
```

**Accuracy by key locale:**

| Locale | Timezone | Country | Centroid lat | Sunrise accuracy | Notes |
|--------|----------|---------|-------------|-----------------|-------|
| Hindi | `Asia/Kolkata` | IN | ~22°N | ±30 min | Single timezone covers all India; brahmamuhurta override makes solar precision less critical |
| Bengali | `Asia/Kolkata` | IN | ~22°N | ±30 min | Same as Hindi |
| Japanese | `Asia/Tokyo` | JP | ~36°N | ±20 min | Single timezone; north-south extent moderate |
| German | `Europe/Berlin` | DE | ~51°N | ±15 min | Small country; high accuracy |
| Spanish (Latin Am) | varies | varies | varies | ±30–45 min | Multiple timezones across Latin America; good enough |
| US English | varies | US | varies | ±45 min | Large timezone spans; widest inaccuracy but bands are forgiving |

**Classification with locale profiles:**

| Condition | Band | Character |
|-----------|------|-----------|
| 1.5h before sunrise → sunrise | `dawn` | Awakening (or brahmamuhurta in Indian locales) |
| sunrise → solar noon - 1h | `morning` | Clarity, purpose |
| solar noon - 1h → sunset - 2h | `afternoon` | Steadiness, perseverance |
| sunset - 2h → sunset + 1.5h | `evening` | Softening, gratitude |
| sunset + 1.5h → 1.5h before sunrise | `night` | Consolation, the eternal soul |

**Indian locale override:** For `hi` and `bn` locales, 3:30–5:30 AM maps to a `brahmamuhurta` band (regardless of solar position) — passages emphasize meditation practice, divine energy, and dawn consciousness rather than consolation. The API gains an optional `brahmamuhurta` time_band value; the server selects from a meditation-practice-weighted pool. This band coexists with `dawn` — it covers the pre-dawn period that `dawn` would otherwise absorb.

**Fallback:** If timezone is unavailable (rare), fall back to the fixed clock-hour bands above. The fixed bands remain the correct default for environments where timezone data is missing.

**Implementation cost:** ~5KB client-side (timezone+country → latitude table ~3KB + suncalc ~2KB). The client computes `time_band` and sends it as a query parameter — the server never sees timezone, country, or coordinates. No new database columns. No server-side location processing. The server receives only a band name (`dawn`, `night`, `brahmamuhurta`, etc.) — the same opacity as the current fixed-clock design.

**Phase:** Solar-aware circadian ships alongside the circadian color temperature in Phase 11. Indian locale brahmamuhurta override ships in Phase 10b with the Hindi/Bengali launch.

**API:**

```
GET /api/v1/daily-passage
 Query params:
 language (optional) — default 'en'
 exclude (optional) — chunk ID to exclude (prevents repeat on "Show me another")
 time_band (optional) — circadian band: 'dawn', 'morning', 'afternoon', 'evening', 'night', 'brahmamuhurta' (Indian locales, 3:30–5:30 AM)

 Response:
 {
 "chunk_id": "uuid",
 "content": "Have courage. Whatever you are going through will pass...",
 "book_title": "Where There Is Light",
 "page_number": 42,
 "chapter_title": "Courage",
 "reader_url": "/books/where-there-is-light/3#chunk-uuid"
 }
```

#### Thematic Doors ("Doors of Entry")

Six **quality** theme cards displayed below the search bar. Each links to `/themes/[slug]`. Only themes with `category = 'quality'` appear here — the homepage grid stays calm and stable. (ADR-032)

**Card design:**
- Minimal: theme name in Merriweather Light, centered on a warm cream card
- Subtle `--srf-gold` border on hover
- No icons, no images, no descriptions — the single word is the invitation
- Cards use `--portal-quote-bg` background, transitioning to `--srf-gold` left border on hover

**"Explore all themes" link:** Below the six doors, a quiet text link ("Explore all themes →") leads to `/themes`, which organizes all theme categories into distinct sections. This page is also linked from the Library. (ADR-032, ADR-033)

**Exploration categories on `/themes`:**

| Category | Section Heading | Examples | Phase |
|----------|----------------|----------|-------|
| `quality` | "Doors of Entry" | Peace, Courage, Healing, Joy, Purpose, Love | 4 |
| `situation` | "Life Circumstances" | Relationships, Parenting, Loss & Grief, Work | 4+ |
| `person` | "Spiritual Figures" | Christ, Krishna, Lahiri Mahasaya, Sri Yukteswar, Patanjali, Kabir | 5+ |
| `principle` | "Yogic Principles" | Ahimsa (Non-violence), Satya (Truthfulness), Tapas (Self-discipline), etc. | 5+ |
| `scripture` | "Sacred Texts" | Yoga Sutras of Patanjali, Bhagavad Gita, Bible, Rubaiyat of Omar Khayyam | 5+ |
| `practice` | "Spiritual Practices" | Meditation, Concentration, Pranayama, Affirmation, Energization | 4+ |
| `yoga_path` | "Paths of Yoga" | Kriya Yoga, Raja Yoga, Bhakti Yoga, Karma Yoga, Jnana Yoga, Hatha Yoga, Mantra Yoga | 5+ |

**Kriya Yoga theme page scope note (ADR-104):** The Kriya Yoga theme page (`/themes/kriya-yoga`) shows Yogananda's *published descriptions* of Kriya Yoga and its place in the yoga tradition — not technique instruction. An editorial note at the top of the page, styled as a quiet `--portal-text-muted` block: "Yogananda's published descriptions of Kriya Yoga and its place in the yoga tradition. Formal instruction in Kriya Yoga is available through the SRF Lessons → yogananda.org/lessons." This note is editorial content in `messages/{locale}.json`, SRF-reviewed. The note appears only on the Kriya Yoga theme page, not on other `yoga_path` themes. Below the note, the standard theme page layout: tagged passages, "Read in context" links, "Show more" — same as every other theme.

Each category is a calm, distinct section on the `/themes` page — not a tabbed interface, just vertical sections with clear headings. Categories appear only when they contain at least one published topic. A topic goes live when an editor judges the tagged passages have sufficient depth — no fixed minimum count. Five deeply relevant passages about Laya Yoga is worth publishing; three tangentially tagged passages about a new topic probably isn't. Human judgment, not mechanical thresholds. The six quality themes remain the sole presence on the homepage.

**Theme page (`/themes/[slug]`):**
- Same layout for all categories — no visual distinction between a quality theme and a person or principle
- Displays 5–8 passages from across all books, tagged with that theme
- Each visit shows a different random selection from the tagged pool
- Passages presented in the same format as search results (verbatim quote, citation, "Read in context")
- A "Show more" button loads additional passages
- No pagination — infinite gentle scroll, loading 5 more at a time
- Header: theme name + a brief Yogananda quote that encapsulates the theme (editorially chosen)
- Only passages with `tagged_by IN ('manual', 'reviewed')` are displayed — never unreviewed auto-tags

#### Practice Bridge Tag (ADR-104)

An editorial annotation — `practice_bridge: true` — on passages where Yogananda explicitly invites the reader to move from reading to practice. Not every mention of meditation or Kriya Yoga — only passages where the author's intent is clearly "do this, don't just read about it."

**Tagging:** Human-tagged, same three-state pipeline as theme tags (ADR-032). Auto-classification may propose candidates; humans make every decision.

**Display:** On tagged passages in the reader, search results, and theme pages, a quiet contextual note appears below the citation:

```
Yogananda taught specific meditation techniques through
Self-Realization Fellowship.
Begin with a free meditation → yogananda.org/meditate
Learn about the SRF Lessons → yogananda.org/lessons
```

Styled in `--portal-text-muted`, Merriweather 300, `--text-sm` — the same visual weight as the "Find this book" bookstore link. Not a modal, not a card, not a CTA. A signpost, not a funnel. Present on every occurrence of the tagged passage across the portal.

**Content:** The note text is editorial content in `messages/{locale}.json` — localized in Phase 10+, SRF-reviewed in all locales. The external URLs (`yogananda.org/meditate`, `yogananda.org/lessons`) are constants, not per-locale (SRF's site handles its own locale routing).

**Schema addition:**

```sql
ALTER TABLE book_chunks ADD COLUMN practice_bridge BOOLEAN NOT NULL DEFAULT false;
```

**Phase:** 4+ (alongside the theme tagging pipeline). Initial tagging pass during multi-book corpus expansion (Phase 3–4).

#### "Seeking..." (Empathic Entry Points)

Below the thematic doors, a section for the 2 AM visitor — the person who isn't browsing, but in need. This is the most empathetic expression of the Findability Principle: meeting the seeker *in their moment* with zero friction between their need and Yogananda's words.

Framed through aspiration, not suffering. "Seeking" aligns with the search bar's "What are you seeking?" and reframes each human situation as a positive movement toward something, not away from something.

**Entry points (curated, not generated):**

| Entry Point | Maps to Search Query |
|-------------|---------------------|
| "Peace in a restless mind" | `"peace calm mind anxiety restlessness stillness"` |
| "Comfort after loss" | `"death soul eternal life comfort grief immortality"` |
| "Purpose and direction" | `"purpose meaning life divine plan destiny"` |
| "Courage through fear" | `"courage fear fearlessness soul protection bravery"` |
| "The heart to forgive" | `"forgiveness love peace resentment compassion"` |

**Design:**
- Presented as quiet, human-readable text links — not buttons, not cards
- Clicking executes a pre-built search query (same as search results page)
- Style: `--portal-text-muted`, Merriweather Light, gentle `--srf-gold` underline on hover
- The section heading "Seeking..." is in Merriweather Light, not bold — it's an invitation, not a label
- Editorially curated: the portal team can add, remove, or refine entry points based on anonymized search trends (from `search_queries` table)
- **Cultural adaptation (Phase 10):** The "Seeking..." entry points are deeply English-idiomatic ("The heart to forgive," "Peace in a restless mind"). These need cultural adaptation, not mechanical translation. Treat them as **editorial content per locale** — each language's reviewer may rephrase, reorder, or replace entry points to match cultural expression. Include these in the ADR-078 human review scope alongside UI strings.
- Mobile: full-width, stacked list
- This section is below the fold — a deliberate choice. The above-the-fold experience (Today's Wisdom + search bar) is for all visitors; this section is for the ones who scroll because they need more

**Grief elevated to primary theme :** "Comfort after loss" is the entry point; grief/loss also becomes a dedicated theme page (`/themes/grief`) in Phase 4 with deep, curated content on the immortality of the soul, reunion after death, the purpose of suffering, and direct consolation. Grief is arguably the most common reason someone turns to spiritual literature — the portal should be the definitive resource for seekers Googling "what happens after death Yogananda."

**DELTA alignment:** No behavioral profiling. The entry points are the same for every visitor. They are informed by aggregated search trends ("What is humanity seeking?"), not individual tracking.

### The Library (`/books`) and Book Landing Page (`/books/[slug]`)

The library is how seekers browse and discover books. Even with a single book in Phase 1, the page should feel like the entrance to a real library — warm, unhurried, and honest about what's inside.

#### The Library (`/books`)

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ The Library │
│ │
│ The published teachings of Paramahansa Yogananda, │
│ freely available for seekers everywhere. │
│ │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ │ │
│ │ [cover] Autobiography of a Yogi │ │
│ │ Paramahansa Yogananda · 1946 │ │
│ │ │ │
│ │ "A remarkable account of a spiritual │ │
│ │ quest that has inspired millions..." │ │
│ │ │ │
│ │ 48 chapters │ │
│ │ │ │
│ │ Begin reading → · Find this book → │ │
│ │ │ │
│ └────────────────────────────────────────────────────────┘ │
│ │
│ ─── 🪷 ─── │
│ │
│ More books are being added to the library. │
│ Explore all of Yogananda's published works at the │
│ SRF Bookstore → │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Design principles:**
- **Warm, not empty.** Even with one book, the page should feel intentional — not like a placeholder or a broken catalog.
- **Honest about scope.** "More books are being added" is truthful and forward-looking. No fixed promises, no dates.
- **The SRF Bookstore link** is a natural signpost: seekers can explore the full catalog of physical books while the digital library grows.
- **Each book entry is a generous card** — not a cramped grid item. Whitespace, the cover image (if available from SRF), and a brief editorial description give each book the space it deserves.
- **No "empty state" design needed in Phase 1** — there will always be at least one book.

**Book card contents:**
- Cover image (if available; graceful fallback to a warm cream card with title in Merriweather)
- Title (Merriweather 700, `--srf-navy`)
- Author · publication year (Open Sans 400, `--portal-text-muted`)
- Brief editorial description (2–3 sentences, Merriweather 300 — not AI-generated, written by the editorial team or drawn from SRF's existing book descriptions)
- Chapter count
- "Begin reading →" link to chapter 1
- "Find this book →" link to SRF Bookstore

**Phase 3 growth:** As Wave 2a–2d books are ingested, the library page naturally fills out. The layout scales from 1 book to 15+ without redesign. Books are ordered by ingestion priority (ADR-030), which mirrors life-impact ordering.

**Phase 10 multi-language:** The library shows books available in the user's language, plus an "Also available in English" section for untranslated works (per ADR-075 content availability matrix).

**API:** `GET /api/v1/books` (already defined). Returns all books with metadata, chapter count, and slugs.

#### Book Landing Page (`/books/[slug]`)

The landing page for each individual book — the table of contents.

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ [cover image, centered, generous size] │
│ │
│ Autobiography of a Yogi │
│ Paramahansa Yogananda · First published 1946 │
│ │
│ "This book will change the lives of millions. │
│ It will be my messenger when I am gone." │
│ — Paramahansa Yogananda │
│ │
│ A spiritual classic that has introduced millions to │
│ the teachings of meditation and the science of yoga. │
│ │
│ Begin reading → · Find this book → │
│ │
│ ─── 🪷 ─── │
│ │
│ Chapters │
│ │
│ 1. My Parents and Early Life │
│ 2. My Mother's Death and the Mystic Amulet │
│ 3. The Saint with Two Bodies (Swami Pranabananda) │
│ 4. My Interrupted Flight Toward the Himalaya │
│ ... │
│ 48. At Encinitas in California │
│ │
│ ─── 🪷 ─── │
│ │
│ About this book │
│ [longer editorial description, publication history] │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Chapter list design:**
- Each chapter is a link: chapter number + title
- Style: Merriweather 400, `--portal-text`, with `--srf-gold` number. Subtle hover underline.
- Chapter numbers in `--srf-gold` create a visual rhythm down the page (1, 2, 3...) without heavy styling.
- Clicking any chapter navigates to `/books/[slug]/[chapter]`
- Lotus bookmark indicator: if the reader has bookmarked a chapter (ADR-066), a small filled lotus appears beside it

**Book metadata:**
- Cover image (centered, max 300px wide, with subtle `--portal-quote-bg` background card behind it if the image has a white background)
- Title in Merriweather 700, `--srf-navy`, `--text-2xl`
- Author + publication year in Open Sans 400, `--portal-text-muted`
- An optional featured quote about or from the book (Merriweather 300, italic)
- Editorial description (2–4 sentences)
- "Begin reading →" link to chapter 1
- "Find this book →" link to SRF Bookstore

**API:** `GET /api/v1/books/{slug}` returns book metadata with chapter index. The book landing page can also be SSG'd from the database at build time.

### Book Reader (`/books/[slug]/[chapter]`)

The reader is the portal's primary experience — where seekers spend the most time. It must feel like reading a physical book, not scrolling a web page.

#### Reading Typography

The single most important typographic decision: **line length**. Optimal for extended reading is 65–75 characters per line. The reader enforces `max-width: 38rem` (~608px) on the text column regardless of screen width. Wide screens get wider margins — not wider text.

```
┌──────────────────────────────────────┬──────────────────────┐
│ 96px margin │ │
│ ┌──────────────────────────────┐ │ Related Teachings │
│ │ │ │ │
│ │ Chapter 14: An Experience │ │ ┌────────────────┐ │
│ │ in Cosmic Consciousness │ │ │ "The experience │ │
│ │ │ │ │ of samadhi..." │ │
│ │ "My body became immovably │ │ │ │ │
│ │ rooted; breath was drawn │ │ │ — Man's Eternal│ │
│ │ out of my lungs as if by │ │ │ Quest, p.201 │ │
│ │ some huge magnet. Soul │ │ │ Read this → │ │
│ │ and mind instantly lost │ │ └────────────────┘ │
│ │ their physical bondage..." │ │ │
│ │ │ │ ┌────────────────┐ │
│ │ — p. 184 │ │ │ "When the soul │ │
│ │ │ │ │ ascends to..." │ │
│ │ [next paragraph...] │ │ │ │ │
│ │ │ │ │ — God Talks │ │
│ └──────────────────────────────┘ │ │ Vol.1, p.87 │ │
│ 96px margin │ │ Read this → │ │
│ │ └────────────────┘ │
│ │ │
│ │ ┌────────────────┐ │
│ │ │ ▶ "Meditation │ │
│ │ │ & the Soul" │ │
│ │ │ (4:32) │ │
│ │ └────────────────┘ │
│ │ │
│ │ Explore all → │
└──────────────────────────────────────┴──────────────────────┘
```

**Typography rules for the reader:**

| Property | Value | Rationale |
|----------|-------|-----------|
| Max text width | `38rem` (~65-75 chars) | Optimal reading line length. **CJK note (Phase 10):** 38rem holds ~30–35 CJK characters per line — within the traditional optimal range for Japanese (25–40 chars/line). Line height should tighten from 1.8 to 1.6–1.7 for CJK text. Validate with actual translated content before launch. |
| Font | Merriweather 400 | Serif for extended reading |
| Size | `--text-base` (18px) | Comfortable for long reading sessions |
| Line height | `--leading-relaxed` (1.8) | Spacious for contemplation |
| Paragraph spacing | `--space-6` (1.5rem) | Clear paragraph separation |
| Chapter title | Lora 400 at `--text-xl` | Distinct from body, not competing |
| Page numbers | `--portal-text-muted`, inline margin notation | Present but unobtrusive |

#### ADR-050: Related Teachings Side Panel

The right side panel displays passages from *other books* that are semantically related to the paragraph the seeker is currently reading. It updates quietly as the reader settles on each paragraph.

**Reading focus detection — the "settled paragraph" model:**
- Intersection Observer watches all paragraphs within a **focus zone** (upper-middle 45% of the viewport, `rootMargin: "-20% 0px -35% 0px"` — biased toward where readers' eyes naturally rest)
- Each visible paragraph gets a **prominence score**: `intersectionRatio × elementHeight` — favors the paragraph the reader is immersed in, not a one-liner passing through
- A **1.2-second debounce** prevents updates during active scrolling. Only when scrolling stops for 1.2s does the highest-prominence paragraph become the "settled paragraph" *[Parameter — default: 1200ms, evaluate: Phase 2 user testing]*
- If the settled paragraph changes, the side panel crossfades (300ms) to the new relations
- **Source indication:** the side panel header shows the first ~40 characters of the settled paragraph (*"Related to: 'My body became immovably...'"*) — closing the feedback loop without adding any chrome to the main text column

**Dwell mode as manual override (DES-009):**
- When dwell activates, the settled paragraph algorithm is bypassed — the dwelled paragraph becomes the explicit focus
- Side panel updates **immediately** (no 1.2s debounce)
- When dwell exits, the settled paragraph algorithm resumes

**Behavior:**
- Shows top 3 related passages (from `chunk_relations` table, filtered to exclude current book's adjacent chapters)
- "Explore all" expands to show more related passages with filter controls
- Clicking a related passage navigates to that passage in its reader context — the side panel then updates with *that* passage's relations (enabling graph traversal)
- Cross-book diversity: when possible, show relations from different books, not 3 results from the same book

**Filters (in "Explore all" expanded view):**
- By book (dropdown of all available books)
- By content type: Books / Videos (once transcripts exist, Phase 12)
- By language (when multi-language content available, Phase 10)
- By topic (Peace, Courage, Christ, Meditation, Yoga Sutras, etc.)

**Data source and loading strategy :**

Pre-computed `chunk_relations` table. If filtering yields < 3 results from the pre-computed top 30, fall back to a real-time vector similarity query with the filter as a WHERE clause.

Loading varies by connection quality (screen width determines presentation, data budget determines loading — two independent axes):

| | Wide screen (≥ 1024px) | Narrow screen (< 1024px) |
|---|---|---|
| **Good connection** | Side panel visible. Batch prefetch all chapter relations on load (`GET /api/v1/books/[slug]/chapters/[number]/relations`, ~30–50KB). All subsequent updates are local cache lookups — zero network during reading. | Pill visible. Same batch prefetch — tap shows pre-loaded results instantly. |
| **Slow/metered (3G)** | Side panel visible. Loads on-demand when settled paragraph changes (not prefetched). | Pill visible. Tap triggers single API call for current paragraph. |
| **Save-Data / text-only / 2G** | No panel. "Continue the Thread" at chapter end only (part of page render, zero extra cost). | No pill. "Continue the Thread" only. |

Detection uses `navigator.connection` (Network Information API) where available, with viewport width as the independent presentation axis.

**API:**

```
GET /api/v1/chunks/[chunk-id]/related
 Query params:
 limit (optional) — default 3, max 20
 book_id (optional) — filter to a specific book
 language (optional) — filter to a specific language
 theme_id (optional) — filter to a specific teaching topic
 exclude_book_id (optional) — exclude current book (default behavior)

 Response:
 {
 "source_chunk_id": "uuid",
 "related": [
 {
 "chunk_id": "uuid",
 "content": "The verbatim passage text...",
 "book_title": "Man's Eternal Quest",
 "chapter_title": "How to Have Courage",
 "page_number": 201,
 "similarity": 0.89,
 "reader_url": "/books/mans-eternal-quest/12#chunk-uuid"
 },
 ...
 ],
 "total_available": 27,
 "source": "precomputed" // or "realtime" if fallback was used
 }
```

**Narrow screens (< 1024px):** The side panel collapses. A subtle floating pill at the bottom-right of the screen reads "Related Teachings". Tapping it opens a bottom sheet with the related passages (instant if batch-prefetched, single API call if on-demand tier). The reader text is never obscured or compressed to accommodate the panel. The pill does not animate or bounce when the settled paragraph changes — it quietly has the right content when the seeker reaches for it.

**Graph traversal:** When the reader navigates to a related passage via the side panel, the URL changes (browser history entry), the reader scrolls to the new passage in its chapter context, and the side panel updates with that passage's relations. The reader has effectively "traveled one hop" through the semantic graph. The back button returns to the previous passage. This creates an open-ended exploration experience — a reader can follow threads of meaning across the entire library.

#### End of Chapter — Next Chapter as Primary Invitation

The end of a chapter belongs to the **book**. The reader is on a journey through Yogananda's narrative. The primary invitation is always the next chapter — never a cross-book detour.

```
 [final paragraph of the chapter]

 — p. 184

 ────────────────────────────────────

 Chapter 15 →
 An Experience in Cosmic
 Consciousness

 ────────────────────────────────────
```

Clean. Centered. The next chapter is the only call to action in the reading column. No cross-book suggestions competing for attention. The reader continues the *book*.

#### "Continue the Thread" — Side Panel Placement

"Continue the Thread" lives in the Related Teachings side panel (or bottom sheet on narrow screens), not inline in the reading column. As the reader reaches the final paragraphs of a chapter, the side panel naturally shows per-paragraph relations. Below those, a "Continue the Thread" section aggregates the chapter's strongest cross-book connections:

```
┌──────────────────────┐
│ Related Teachings │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│ "My body became..." │
│ │
│ [3 related passages] │
│ │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│ Continue the Thread │
│ │
│ These themes — │
│ cosmic consciousness,│
│ the eternal soul — │
│ appear across the │
│ library: │
│ │
│ ┌────────────────┐ │
│ │"The soul's │ │
│ │ nature is │ │
│ │ infinite..." │ │
│ │ — The Divine │ │
│ │ Romance p.142│ │
│ └────────────────┘ │
│ + 2 more │
│ │
└──────────────────────┘
```

This separation means:
- The **reading column** belongs to the book. Next chapter is always primary.
- The **side panel** belongs to the library. Cross-book exploration is available but never intrudes on the linear reading experience.
- The reader chooses when to explore. "Continue the Thread" is a gift, not an interruption.

**Exception — no-panel tiers (Save-Data, 2G, text-only mode):** "Continue the Thread" appears inline at chapter end, *below* the Next Chapter invitation. This is the sole cross-book connection for these seekers, and it's part of the page render (zero extra network cost). Next Chapter is still primary, with "Continue the Thread" as a quiet secondary section beneath it.

**Behavior:**
- Aggregates the top related passages from *other books* across all paragraphs in the current chapter
- Deduplicated: if 5 paragraphs in this chapter all relate to the same passage in Man's Eternal Quest, show it once (with highest similarity)
- Shows up to 3 cross-book suggestions
- Pre-computed at build time or heavily cached (ISR)
- The introductory text ("These themes — ...") is generated from the chapter's most prominent theme tags, not by an LLM

**Implementation:** Query `chunk_relations` for all chunks in the current chapter, aggregate by target, deduplicate, rank by max similarity, filter to other books, take top 3. This data is included in the batch prefetch response (`/api/v1/books/[slug]/chapters/[number]/relations`) for batch-tier connections.

#### Physical Book Bridge

Every passage in the reader, search results, and shared passage pages includes a quiet "Find this book" link alongside "Read in context." This links to the SRF Bookstore page for the physical book.

- Supports DELTA's Embodiment principle (the physical book is the ultimate embodied reading experience)
- Not a sales pitch — a signpost, same as the "Go Deeper" links
- Style: small text link in `--portal-text-muted`, positioned near the citation

```
— Autobiography of a Yogi, Chapter 14, p. 184
 Read in context → · Find this book →
```

"Find this book" opens the SRF Bookstore URL in a new tab. The URL is stored per book in the `books` table (`bookstore_url TEXT`).

#### Print Stylesheet

A `@media print` stylesheet ensures passages and chapters print beautifully:

- Remove navigation, footer, side panel
- Full-width text at optimal reading width
- Merriweather at 11pt
- Citation below each passage
- Portal URL in small footer: `teachings.yogananda.org`
- Page breaks between chapters (for full chapter printing)
- No background colors (saves ink, respects user paper)
- **Non-Latin font support (Phase 10):** Print stylesheet must be locale-aware. Font-family falls back per script: Noto Serif JP for Japanese, Noto Serif Devanagari for Hindi, Noto Serif Bengali for Bengali. CJK text at 10.5pt (equivalent optical size to 11pt Latin). Define per-locale `@media print` font stacks alongside the web font stacks.

#### ADR-059: Chant Reader Variant

When `books.content_format` is `'chant'` or `'poetry'`, the reader route (`/books/[slug]/[chapter]`) renders a variant optimized for devotional poetry rather than continuous prose.

**Structural differences from the prose reader:**

| Aspect | Prose Reader | Chant Reader |
|--------|-------------|-------------|
| Unit of display | Paragraph stream (continuous scroll) | Whole chant (one per page) |
| Navigation | Scroll + prev/next chapter | Prev/next chant (discrete pages) |
| Related Teachings | Side panel (3 related passages) | Side panel (same) + **inline media panel** for `performance_of` relations |
| Drop capitals | Yes (chapter opening) | No (chant text rendered as poetry with preserved line breaks) |
| Chunk context | `prev_chunk_id`/`next_chunk_id` for "read more" | Each chunk is self-contained; prev/next for chant-to-chant nav only |

**Inline media panel:**

When a chant has `performance_of` relations in `chunk_relations`, audio/video recordings appear in the primary content area below the chant text — not in the side panel. This is the chant's companion experience, not a tangential discovery.

```
┌──────────────────────────────────────┬──────────────────────┐
│ 96px margin │ │
│ ┌──────────────────────────────┐ │ Related Teachings │
│ │ │ │ │
│ │ Door of My Heart │ │ ┌────────────────┐ │
│ │ │ │ │ "God is the │ │
│ │ "Door of my heart, open │ │ │ fountain of │ │
│ │ wide I keep for Thee. │ │ │ all melody..." │ │
│ │ Wilt Thou come, │ │ │ │ │
│ │ wilt Thou come? │ │ │ — God Talks │ │
│ │ Just for once come │ │ │ Vol.2, p.41 │ │
│ │ to me..." │ │ └────────────────┘ │
│ │ │ │ │
│ │ — Cosmic Chants, p. 14 │ │ Explore all → │
│ │ │ │ │
│ │ ┌────────────────────────┐ │ │ │
│ │ │ 🔊 Paramahansa Yogananda│ │ │ │
│ │ │ ◉ Sacred recording │ │ │ │
│ │ │ ▶ ━━━━━━━━━━━ 3:42 │ │ │ │
│ │ ├────────────────────────┤ │ │ │
│ │ │ 🔊 SRF Monastics │ │ │ │
│ │ │ ▶ ━━━━━━━━━━━ 4:15 │ │ │ │
│ │ ├────────────────────────┤ │ │ │
│ │ │ ▶ How-to-Live Chant │ │ │ │
│ │ │ Session (YouTube) │ │ │ │
│ │ └────────────────────────┘ │ │ │
│ │ │ │ │
│ │ ← Previous chant Next → │ │ │
│ └──────────────────────────────┘ │ │
└──────────────────────────────────────┴──────────────────────┘
```

**Performance provenance ordering:** Yogananda's own voice first (sacred artifact golden ring per ADR-057), monastic recordings second, other recordings third. Within each tier, ordered by editorial `rank` in `chunk_relations`.

**Chant metadata display:** When `book_chunks.metadata` contains chant-specific fields (`chant_instructions`, `chant_mood`, `has_refrain`), these render as distinct UI elements:
- **Instructions** appear above the chant text in a quieter typographic treatment (Open Sans, `--text-sm`, `--portal-text-muted`) — visually distinct from the sacred words themselves
- **Mood** contributes to search filtering and daily passage tone matching, but does not display as a label in the reader

**Poetry format (`content_format = 'poetry'`):** Uses the same whole-unit rendering and discrete navigation as `'chant'`, but without the inline media panel (unless `performance_of` relations exist). Suitable for *Songs of the Soul*, *Whispers from Eternity*, and similar collections.

*Section added: 2026-02-21, ADR-059*

#### DES-008: Reader Typography Refinements

The reader's typographic details signal care and reverence for the words. These are the micro-details that distinguish a sacred text presentation from a blog post:

**Drop capitals:** Each chapter opens with a drop capital — Merriweather 700, `--srf-navy`, spanning 3 lines. Uses CSS `::first-letter`. A tradition from illuminated manuscripts signaling "something begins here." **Language-conditional (Phase 10):** Drop capitals are enabled for Latin-script languages only. CSS `::first-letter` behaves unpredictably with CJK and Indic scripts, and the illuminated-manuscript tradition is Western. For Japanese, Hindi, and Bengali, substitute a culturally appropriate chapter-opening treatment: generous whitespace with a subtle `--srf-gold` rule above the first paragraph.

**Decorative opening quotation marks:** Every displayed Yogananda passage (search results, quote cards, shared passages) uses a large decorative opening quote mark — Merriweather 700, 48px, `--srf-gold` at 40% opacity, positioned as a hanging element above-left. This visual language instantly says: *these are his words*.

**Optical margin alignment:** CSS `hanging-punctuation: first last` where supported (progressive enhancement). Quotation marks and hyphens hang slightly into the margin, making the text block appear perfectly aligned.

**Page texture:** A CSS-only paper texture on the reader background — an inline SVG noise pattern blended with `--portal-bg` via `background-blend-mode: multiply`. Zero network cost. The faintest sense of materiality:

```css
.reader-surface {
 background-color: var(--portal-bg);
 background-image: url("data:image/svg+xml,..."); /* tiny inline SVG noise */
 background-blend-mode: multiply;
}
```

**Chapter epigraph treatment:** Epigraphs (Bhagavad Gita verses, Biblical passages, Yogananda's poetry at chapter openings) are: centered, Merriweather 300 at `--text-sm`, `--portal-text-muted`, with generous whitespace above and below. Source attribution in small caps. A moment of stillness before the prose begins.

**Typographic details:** Applied during ingestion, not render time:
- True em dashes (—) with hair spaces
- Typographic curly quotes (" " ' ')
- Ellipses as single glyphs (…)
- Small caps for abbreviations

**Citation formatting:** Every passage citation uses an em dash:
```
— Autobiography of a Yogi, Chapter 12, p. 147
```
Open Sans 400, `--portal-text-muted`. Small, precise, always present. Never omitted.

#### DES-009: "Dwell" Interaction — Passage Contemplation Mode

When reading a physical book, a profound passage stops you mid-page. The reader needs a way to dwell *within* the reading experience — not leave it.

**Trigger:** Long-press (mobile, 500ms). Desktop: click the hover-revealed dwell icon. Keyboard: `d` key on focused paragraph. Double-click was considered and rejected — it conflicts with the universal word-selection behavior in every browser.

**Discoverability :** On desktop, hovering over a paragraph for 1.5 seconds reveals a small dwell activation icon at the paragraph's inline-start margin — a 12px circle in `--srf-gold` at 40% opacity. Clicking the icon enters dwell mode. Moving the cursor away fades the icon out. On first visit, a one-time tooltip appears: *"Hover over any passage to focus on it for contemplation."*

**Related Teachings connection :** When dwell activates, the Related Teachings side panel immediately updates to show relations for the dwelled paragraph — bypassing the normal settled-paragraph debounce. Dwell serves a dual purpose: contemplative focus *and* explicit Related Teachings selection.

**Effect:**
1. Surrounding text dims to 15% opacity over 600ms
2. The selected passage remains fully vivid
3. Background warms slightly to `--portal-quote-bg`
4. Share icon and citation appear quietly below the passage
5. Lotus bookmark icon (ADR-066) appears alongside the share icon

**Exit:** Tap/click anywhere else, or press `Escape`. Everything returns to normal over 300ms.

**No modal, no popup, no overlay.** The passage simply *comes forward* in its existing position. This mirrors what happens naturally in physical reading: your eyes narrow focus, the world around the words softens.

```
┌──────────────────────────────────────┐
│ │
│ [dimmed text at 15% opacity] │
│ [dimmed text at 15% opacity] │
│ │
│ "Soul and mind instantly lost their │ ← Full opacity, warm bg
│ physical bondage and streamed out │
│ like a fluid piercing light from │
│ my every pore..." │
│ │
│ — p. 184 🪷 📎 │ ← Bookmark + Share
│ │
│ [dimmed text at 15% opacity] │
│ [dimmed text at 15% opacity] │
│ │
└──────────────────────────────────────┘
```

**Haptic feedback :** On mobile, a single gentle haptic pulse confirms dwell activation: `navigator.vibrate(10)` — a 10ms tap, barely perceptible, confirming through the sense already engaged. Suppressed when `prefers-reduced-motion: reduce` is active. Progressive enhancement: devices without Vibration API support get visual feedback only.

**Accessibility:**
- `Escape` exits dwell mode
- Screen readers announce "Passage focused for contemplation" / "Returned to reading" (ADR-073)
- `prefers-reduced-motion`: transitions are instant (0ms), dimming still occurs, haptic feedback suppressed

#### DES-010: Layered Passage Depth — "Go Deeper Within the Text"

A passage about concentration means something different on the first reading versus the twentieth. The Related Teachings side panel (ADR-050) shows passages from *other books*. Layered Passage Depth shows depth *within* the same passage's context — what surrounds it, what echoes it across the library.

**Trigger:** On any passage in the reader (including search results and theme pages), a quiet "Go deeper" text link (Merriweather 300, `--portal-text-muted`, `--srf-gold` underline on hover) appears below the citation. Distinct from the site-wide "Go Deeper" SRF ecosystem links — this is textual depth, not organizational.

**Three layers — all verbatim Yogananda, editorially curated:**

| Layer | Label | What it shows | Source |
|-------|-------|---------------|--------|
| **The teaching** | *(default — always visible)* | The passage itself | Current chunk |
| **The context** | "In context" | Adjacent passages from the same chapter — what Yogananda said before and after. The argument, the narrative, the build-up. | Neighboring chunks by `paragraph_index` in same chapter |
| **The web** | "Across the library" | Related passages from *other books* where Yogananda expressed the same idea differently — to different audiences, at different points in his life. | `chunk_relations` table (ADR-050) + `composition_era` metadata |

**Behavior:**
- Clicking "Go deeper" expands a section below the passage (not a modal, not a new page)
- Context layer shows ±2 paragraphs around the current passage, with the current passage highlighted
- Web layer shows up to 5 cross-book relations, sorted by similarity, each with full citation
- When `composition_era` metadata is available, the web layer includes the era: *"Written in the 1940s"* — showing how the teaching evolved
- Layers can be toggled independently (both open, one open, neither)
- `Escape` collapses all layers
- On narrow screens: layers expand inline below the passage (no side panel interaction)

**Who this serves:** The seeker who has already encountered a passage and wants to understand it more deeply — without leaving the reading flow. This is what a scholar does manually over years. The portal's relationship graph already contains this data; the experience makes it browsable from within the reading.

**API:** No new endpoints. Uses existing `/api/v1/chunks/[chunk-id]/related` and chunk neighbor queries. The "context" layer is fetched from the chapter data already loaded in the reader.

**Phase:** Phase 5 (alongside editorial reading threads, DES-026). Requires Related Teachings (ADR-050, Phase 2) and chapter data already in the reader.

---

#### DES-011: Time-Aware Reading — Circadian Color Temperature

The portal subtly shifts its warmth based on the time of day. **On by default, opt-out via a toggle.**

| Band | Hours | Background | Character |
|------|-------|------------|-----------|
| Morning | 5:00–9:59 | `#FDFBF8` (cooler cream) | Crisp, like morning light |
| Midday | 10:00–15:59 | `#FAF8F5` (standard) | The baseline palette |
| Evening | 16:00–20:59 | `#F7F2EC` (warmer cream) | Golden hour warmth |
| Night | 21:00–4:59 | `--srf-navy` bg, cream text | Restful, low-light |

**Implementation:** A small client-side script (~20 lines) runs once on page load, sets `data-time-band` attribute on `<html>`. CSS custom properties apply the appropriate palette. No polling, no intervals. Computed entirely from `new Date.getHours` — no data sent to server, no tracking. DELTA-compliant by design.

**Toggle:** Sun/moon icon in reader header and site settings. Cycles: Auto (default) → Light (always midday) → Dark (always night). Stored in `localStorage`.

**Interaction with OS preferences:** If `prefers-color-scheme: dark` is active, it overrides time-banding — the user's OS preference is always respected.

#### DES-012: "Breath Between Chapters" — Chapter Transition Pacing

When navigating between chapters via prev/next (not deep links):

1. A **1.2-second pause** — only the chapter title (Lora 400, `--text-xl`) centered on warm cream. No other elements visible.
2. Chapter text **fades in** over 400ms.
3. **`prefers-reduced-motion`:** Skipped entirely. Instant load.
4. **Deep links and search results:** Skip the breath — immediate content access.

No loading spinner is ever shown. This is silence, not waiting.

#### ADR-066: Lotus Bookmark — Account-Free Reading Bookmarks

A lightweight, private bookmarking system using `localStorage`:

**Chapter bookmark:** Small lotus icon (SVG, `--srf-gold` at 50% opacity, 20px) in the reader header beside the chapter title. Click to fill (bookmark), click again to remove. The lotus was chosen because it carries meaning: *a lotus marks where light was found*.

**Passage bookmark:** In dwell mode, a lotus icon appears alongside the share icon. Bookmarks the specific paragraph.

**Bookmarks page (`/bookmarks`):** Lists all bookmarked chapters and passages organized by book. Each entry shows book title, chapter title, and (for passages) the first line with citation. Clicking navigates to that position.

**Storage:** `localStorage` under `srf-portal:bookmarks`. No server, no accounts, no tracking. Clearing browser data removes bookmarks. This is stated clearly on the bookmarks page.

**Phase 13 migration:** When optional accounts arrive, `localStorage` bookmarks are offered for import and server sync.

#### DES-013: Keyboard-First Reading Navigation

All shortcuts are single-key (no modifier), active only when no input/textarea is focused:

| Key | Action |
|-----|--------|
| `→` or `Space` | Next chapter (with breath transition) |
| `←` | Previous chapter |
| `j` | Scroll to next paragraph (focus ring visible) |
| `k` | Scroll to previous paragraph |
| `d` | Enter dwell mode on focused paragraph |
| `Escape` | Exit dwell mode, close any open panel |
| `b` | Toggle lotus bookmark on current chapter/passage |
| `r` | Toggle related teachings panel |
| `t` | Jump to table of contents |
| `/` | Focus search bar |
| `?` | Show keyboard shortcut help overlay |

**Discoverability:** A `?` icon in the reader footer opens a shortcut reference. Also shown once on first visit (stored in `localStorage`).

**`Space` for next chapter** only activates when the reader has scrolled to the bottom of the current chapter — otherwise, native scroll behavior is preserved.

#### Reader Accessibility

- `aria-current="page"` on the active paragraph (for "Read in context" deep links)
- Keyboard navigation: full vim-style shortcuts (see above, DES-013)
- Skip link: "Skip to chapter text" at page top
- Each paragraph is an `<article>` with `role="article"` and `aria-label` including page number
- Font size adjustable via `Ctrl`+`+`/`-` (browser native) — no custom control until Phase 11
- `prefers-reduced-motion`: side panel updates without animation, dwell transitions instant, breath between chapters skipped, opening moment skipped
- Dwell mode: screen reader announcements on enter/exit
- All keyboard shortcuts suppressed when input elements have focus

### The Quiet Corner (`/quiet`)

A single-purpose page designed for the moment of crisis. When someone arrives at 2 AM unable to sleep because of anxiety, they don't need a search engine — they need a hand to hold.

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ │
│ │
│ │
│ │
│ "I am submerged in eternal light. │
│ It permeates every particle of my being. │
│ I am living in that light." │
│ │
│ — Scientific Healing Affirmations │
│ │
│ │
│ │
│ ○ 1 min ○ 5 min ○ 15 min │
│ │
│ [ Begin ] │
│ │
│ │
│ │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Design:**
- Maximum whitespace. The page is mostly empty — "digital silence."
- A single affirmation from Yogananda, in Merriweather Light, centered vertically and horizontally
- Source citation below in muted text
- Optional gentle timer: 1, 5, or 15 minutes. When started, the affirmation remains on screen, the page dims slightly, and a soft chime sounds at the end. No progress bar, no countdown — just stillness, then a chime.
- "Begin" button in the understated gold-border style. After starting, the button and timer options fade away, leaving only the affirmation.
- A new affirmation loads on each visit
- Background color: slightly warmer than the rest of the portal (`--portal-bg-alt`)

**Source material:**
- *Scientific Healing Affirmations* — healing, peace, vitality, abundance affirmations
- *Metaphysical Meditations* — spiritual affirmations and meditations
- Curated affirmation-length passages from other books (editorial)

**Timer completion (DES-014):** After the chime, 3 seconds of continued stillness. Then the affirmation gently crossfades (300ms) to a parting passage — one specifically about returning to the world from meditation. This transforms the timer's end from "session over" to "now begin." Parting passages are editorially curated (see § Session Closure Moments).

**Constraints:**
- No tracking. No history. No "sessions completed." No streaks.
- No ambient sound loops or background music (the user brings their own silence)
- No account required
- The timer is purely client-side (a simple `setTimeout` + Web Audio API chime)
- Accessible: the chime has a visual equivalent (gentle screen flash) for hearing-impaired users and a haptic equivalent — a slow resonance pattern `navigator.vibrate([10, 50, 8, 70, 5, 100, 3])` mimicking a singing bowl's decay, reaching seekers whose eyes are closed and phone is on silent. Suppressed when `prefers-reduced-motion` is active.

### About Section (`/about`)

The About page serves first-time visitors who don't know Yogananda or SRF. It is the front door for the uninitiated and the natural bridge from the portal to SRF's broader mission.

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ About This Portal │
│ │
│ This portal makes the published teachings of │
│ Paramahansa Yogananda freely available to seekers │
│ worldwide. It was made possible by a philanthropic │
│ endowment dedicated to expanding access to these │
│ sacred writings. │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ Paramahansa Yogananda (1893–1952) │
│ │
│ ┌───────────┐ Paramahansa Yogananda is the author of │
│ │ │ Autobiography of a Yogi and founder of │
│ │ [photo] │ Self-Realization Fellowship. He brought │
│ │ │ India's ancient science of meditation │
│ └───────────┘ to the West in 1920... │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ The Line of Gurus │
│ │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │Babaji│ │Lahiri│ │ Sri │ │Yoga- │ │
│ │ │ │Maha- │ │Yuktes│ │nanda │ │
│ │ │ │ saya │ │ war │ │ │ │
│ └──────┘ └──────┘ └──────┘ └──────┘ │
│ Mahavatar Lahiri Swami Paramahansa │
│ Babaji Mahasaya Sri Yogananda │
│ Yukteswar │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ Self-Realization Fellowship │
│ Founded 1920 · Los Angeles, California │
│ [Brief description of SRF's mission and aims and ideals] │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ Go Deeper │
│ │
│ Yogananda's published books are an invitation to │
│ practice. If these teachings resonate with you, the │
│ natural next step is to experience them directly │
│ through meditation. │
│ │
│ → Begin today: A Beginner's Meditation │
│ Free instruction from SRF — you can practice │
│ right now. (yogananda.org/a-beginners-meditation) │
│ │
│ → The SRF Lessons │
│ A 9-month home-study course in meditation and │
│ spiritual living, including three foundational │
│ techniques. The path to Kriya Yoga initiation. │
│ (yogananda.org/lessons) │
│ │
│ → Find a meditation group near you │
│ → Guided meditations with SRF monastics │
│ → Online meditation events │
│ → Kirtan & devotional chanting │
│ → Visit an SRF temple or retreat │
│ → SRF Bookstore │
│ → Self-Realization Magazine │
│ │
│ 💬 "Read a little. Meditate more. │
│ Think of God all the time." │
│ — Paramahansa Yogananda │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Content sections:**

| Section | Content | Image |
|---------|---------|-------|
| **Introduction** | What this portal is, the philanthropic origin, what "free access" means | None |
| **Paramahansa Yogananda** | Brief biography (3–4 paragraphs). Born in India, came to America in 1920, wrote Autobiography of a Yogi, established SRF. | Official portrait — positioned like a book frontispiece |
| **The Line of Gurus** | The four gurus in sequence: Babaji, Lahiri Mahasaya, Sri Yukteswar, Yogananda. One sentence each. | Official portrait for each guru, displayed in chronological sequence |
| **Self-Realization Fellowship** | SRF's mission, aims and ideals, global presence. Non-promotional — informational. | None (or a single photo of Mount Washington headquarters) |
| **Go Deeper** | Enriched Practice Bridge section (ADR-104). 2–3 paragraphs of SRF-approved text: the portal's books are an invitation to practice; SRF's free Beginner's Meditation as an immediate starting point; the SRF Lessons as the formal path (9-month home-study course, three foundational techniques, path to Kriya Yoga initiation); a representative verbatim Yogananda passage about the primacy of practice (with citation). Then the signpost links: center locator, guided meditations with SRF monastics, Online Meditation Center, kirtan and devotional chanting, bookstore, temples and retreats, Self-Realization Magazine (where practitioners share their experiences with meditation and the teachings). Guided meditations and kirtan complement the Quiet Corner's silence — seekers who want instruction or devotional experience are pointed to SRF's existing resources. All framing text reviewed and approved by SRF. The free path is foregrounded: Beginner's Meditation appears before Lessons. | None |

The "Go Deeper" section is the most important part of this page. It is the natural bridge from reading to practice — the moment when the portal fulfills DELTA's Embodiment principle by pointing the seeker back to their physical, spiritual life. The enriched version (ADR-104) replaces the previous single-link signpost with substantive guidance: what the path of practice looks like, where to begin for free, and where formal instruction leads. This makes the signpost commensurate with what it points toward — without becoming a funnel. The tone matches SRF's own invitational voice on yogananda.org: warm, unhurried, never urgent.

### Navigation Structure

**Header (persistent, all pages):**

```
┌──────────────────────────────────────────────────────────────┐
│ ☸ SRF Teaching Portal Search Books Videos Magazine Quiet About│
└──────────────────────────────────────────────────────────────┘
```

- ☸ = SRF lotus mark (small, links to homepage)
- Primary nav: Search, Books, Videos, Magazine, Quiet Corner, About
- Mobile: collapses to hamburger menu
- No notification badges. No user avatar. No bell icon. The nav is purely navigational.

**Footer (persistent, all pages):**

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ SRF Resources │
│ · yogananda.org · SRF Lessons │
│ · Online Meditation Center · SRF Bookstore │
│ · Find a Center Near You · Request Free Literature │
│ · SRF/YSS App — study, meditation │
│ & inspiration · @YoganandaSRF (YouTube) │
│ │
│ ─────────────────────────────────────────────────────────── │
│ │
│ The teachings of Paramahansa Yogananda, │
│ made freely available to seekers worldwide. │
│ │
│ © Self-Realization Fellowship │
│ │
└──────────────────────────────────────────────────────────────┘
```

All external links open in new tabs and are clearly marked as external. The footer is the signpost — it appears on every page, gently reminding the seeker that this portal is one part of a larger spiritual ecosystem.

### Passage Sharing

Every passage throughout the portal — search results, reader, theme pages, Quiet Corner, Today's Wisdom — includes a quiet share affordance.

**Share link:**
- URL format: `/passage/[chunk-id]`
- Canonical domain (aspirational): `teachings.yogananda.org`
- The page renders the single passage with full citation, "Read in context" link, and the portal's warm cream design
- Open Graph meta tags generate a beautiful preview card when pasted into any platform:

```html
<!-- Open Graph tags -->
<meta property="og:title" content="Paramahansa Yogananda" />
<meta property="og:description" content="The soul is ever free; it is deathless, birthless..." />
<meta property="og:image" content="/api/v1/og/[chunk-id]" /> <!-- generated image, min 1200×630px -->
<meta property="og:url" content="https://teachings.yogananda.org/passage/[chunk-id]" />
<meta property="og:site_name" content="SRF Teaching Portal" />

<!-- Twitter/X Card tags (also used by Bluesky, Mastodon) -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Paramahansa Yogananda" />
<meta name="twitter:description" content="The soul is ever free; it is deathless, birthless..." />
<meta name="twitter:image" content="https://teachings.yogananda.org/api/v1/og/[chunk-id]" />
<meta name="twitter:image:alt" content="A passage from Autobiography of a Yogi by Paramahansa Yogananda" />

<!-- Canonical URL (ADR-081 §9) -->
<link rel="canonical" href="https://teachings.yogananda.org/passage/[chunk-id]" />

<!-- Machine content optimization (ADR-081 §12) -->
<meta name="robots" content="max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
```

**Quote image generation:**
- API route: `GET /api/v1/og/[chunk-id]`
- Uses `@vercel/og` (Satori) to render a PNG: passage text in Merriweather on warm cream, citation below, subtle SRF lotus mark, portal URL at bottom
- Same image used for OG cards and "Save as image" download
- Suitable for messaging apps, social media, printing, phone wallpaper
- **Non-Latin script support (Phase 10):** Satori requires explicit font files for non-Latin characters — it does not fall back to system fonts. A Japanese or Hindi quote image will render as empty boxes unless the build bundles Noto font subsets for each active script. The OG image route must select the correct font based on the passage's `language` column. Font map: `ja` → Noto Serif JP, `hi` → Noto Serif Devanagari, `bn` → Noto Serif Bengali. All Latin-script languages use Merriweather.

**Email sharing :**
- "Email this passage" opens the seeker's email client via `mailto:` link
- Subject: `"{First 8 words}..." — Paramahansa Yogananda`
- Body: passage text, citation, `Read in context: https://teachings.yogananda.org/passage/{chunk-id}`
- No server-side email infrastructure needed — the seeker's own email client handles sending
- Chapter/book email: sends a link to the chapter, not the full text

**PDF generation :**
- Passage PDF: single A4 page — Merriweather 14pt, warm cream background, citation, lotus watermark (8% opacity, bottom-right), portal URL
- Chapter PDF (Phase 7): cover page, running headers, page numbers, drop capitals, lotus watermark on first page
- Book PDF (Phase 7): title page, table of contents, all chapters, colophon
- API: `GET /api/v1/books/{slug}/pdf` (full book), `GET /api/v1/books/{slug}/chapters/{n}/pdf` (chapter), `POST /api/v1/exports/pdf` with `{ "type": "passages", "ids": ["{chunk-id}"] }` (single passage). See ADR-025 — PDFs are sub-paths of their parent resource, not a parallel `/pdf/` namespace.

**Share menu:**

```
 ┌─────────────────────────┐
 │ Copy link │
 │ Email this passage │
 │ Save as image │
 │ Save as PDF │
 └─────────────────────────┘
```

**Share UI element:**
- A small, quiet share icon (link/chain icon, not social media logos)
- On click: opens share menu (above)
- No row of social media buttons. No third-party tracking scripts. The seeker chooses the medium.

### ADR-074: UI Copy Standards — Micro-Copy as Ministry

Every word the portal speaks — beyond Yogananda's own — is part of the seeker's experience. UI copy (error messages, empty states, loading text, ARIA labels, placeholders) is treated as reviewed content, not developer placeholder text.

**The portal's verbal character: a warm, quiet librarian.** Consistent with ADR-089 but extended beyond the AI search persona to all UI text.

| Principle | Example: Standard | Example: Portal |
|-----------|------------------|-----------------|
| Warm, not clinical | "No results found" | "We didn't find a matching passage. Yogananda wrote on many topics — try different words, or explore a theme." |
| Honest, not apologetic | "Oops! Something went wrong." | "This page doesn't exist, but perhaps what you're seeking is here." + search bar |
| Inviting, not instructional | "Tap and hold to bookmark." | "As you read, long-press any words that speak to you." |
| Brief, not verbose | One sentence where one sentence suffices | No filler, no exclamation marks, no emoji |
| Never cute, never corporate | "Oops," "Uh oh," "Great news!" | Adult, respectful, spiritually aware register |

**High-impact moments:**

| Moment | Portal copy |
|--------|-------------|
| No search results | "We didn't find a matching passage. Yogananda wrote on many topics — try different words, or explore a theme." |
| Network error | A cached Yogananda passage about patience, with a quiet "Try again" link below |
| 404 page | A Yogananda passage about seeking, with navigation home and a search bar |
| Empty bookmarks | "You haven't marked any passages yet. As you read, long-press any words that speak to you." |
| Loading state | Quiet skeleton screen. No text. If prolonged: the lotus threshold (DES-007) as fallback |
| Timer complete (Quiet Corner) | No text. Just the chime. Then, after a moment, a parting passage (DES-014) |

**Preferred vocabulary:** "seeker" not "user." "Passage" not "result." "The teachings" not "our content." "Explore" not "browse." "Mark" not "bookmark" (as a verb).

**ARIA labels carry warmth (ADR-073).** Screen reader announcements are not markup — they are the only voice the portal has for blind seekers. "You are now in the Quiet Corner, a space for stillness" not "Main content region, The Quiet Corner." "Five passages found about courage" not "Search results: 5 items." See § Screen Reader Emotional Quality under Accessibility for full specification.

**Maintained in:** `/docs/editorial/ui-copy-guide.md` — voice principles, vocabulary glossary, and annotated examples per page. Created during Phase 1 alongside locale file externalization.

### DES-014: Session Closure Moments — Departure Grace

The portal has an opening gesture (DES-007, Portal Threshold). It also has closing gestures — not `beforeunload` interceptions, but content that naturally occupies the space at the end of a reading session. The portal's last word, in every path, is Yogananda's.

**"Parting word" content block at natural session endpoints.** A brief Yogananda passage about carrying the teachings into daily life. Styled in `--portal-text-muted`, Merriweather 300, centered, with generous whitespace above. Not a card, not a callout — just words.

| Location | Content character |
|----------|-------------------|
| End of chapter (below "Next Chapter →" link) | Practice — "Take these words into your day" |
| Quiet Corner timer completion (after chime + 3s stillness) | Returning — "Carry this stillness with you" |
| Bottom of search results (below last result) | Encouragement — "The teachings are always here" |
| Bottom of theme page (below last passage) | Exploration — "There is always more to discover" |

**Parting passage pool:** Editorially curated, 10–20 short passages (one or two sentences). Stored in `daily_passages` with `usage = 'parting'`, rotated randomly. Examples from Yogananda's works: "Make your life a divine garden." / "Be a fountain of peace to all." / "Live each moment completely, and the future will take care of itself."

**The Quiet Corner departure is special.** After the chime and 3 seconds of stillness, the affirmation crossfades (300ms) to a parting passage about returning to the world. This transforms the timer's end from "session over" to "now begin."

**Practice note after parting passage (ADR-104):** Below the Quiet Corner's parting passage — after a generous whitespace gap — a two-line practice signpost:
- Line 1: `If you'd like to deepen your meditation practice → yogananda.org/meditate`
- Line 2: `Experience a guided meditation with SRF monastics → yogananda.org/meditate`

The second line serves seekers who tried silence and want instruction — SRF's guided meditations are complementary to the Quiet Corner's unguided stillness. Styled in `--portal-text-muted`, `--text-sm`, Merriweather 300 — quieter than the parting passage itself. This is the moment of maximum receptivity: the seeker has just experienced stillness and may be most open to understanding that deeper practice exists. Two lines maximum — never a card, never promotional. Both links open in new tabs. Content is in `messages/{locale}.json` for Phase 10+ localization.

**Design constraint:** The parting word appears *below* primary navigation (e.g., below "Next Chapter →"). Seekers continuing to the next chapter never scroll down to it. It exists only for the seeker who has finished for now.

### ADR-067: Non-Search Seeker Journeys

The portal is equally excellent for seekers who never touch the search bar. Seven non-search paths, each with specific design standards:

**1. The shared-link recipient** (`/passage/[chunk-id]`) — the portal's ambassador page, mediated by trust (a friend sent this).
- Above the passage: "A passage from the teachings of Paramahansa Yogananda" — context for unfamiliar seekers
- Below the citation: "This passage appears in *[Book Title]*, Chapter [N]. Continue reading →" — the book as a world to enter
- Below the book link: "Explore more teachings →" — linking to the homepage (Today's Wisdom as a second encounter)
- The page should be the most beautiful thing the recipient sees in their social feed that day

**2. The Google arrival** (`/books/[slug]/[chapter]` from external referrer) — gentle context without interruption.
- A subtle one-line context bar above the chapter title: "You're reading *[Book Title]* by Paramahansa Yogananda — Chapter [N] of [Total] — Start from the beginning →"
- Styled in `--portal-text-muted`, `--text-sm`. Dismissed on scroll. Not shown when navigating within the portal.

**3. The daily visitor** (homepage → Today's Wisdom → "Show me another" → contemplate → leave).
- "Show me another" feels inexhaustible. SessionStorage-based exclusion list prevents repeats within a visit — the seeker cycles through all available passages before any repetition.
- Phase 0 pool depth is an open question (see CONTEXT.md).

**4. The Quiet Corner seeker** (`/quiet` directly, often in crisis).
- Self-contained: header collapses to lotus mark only, footer suppressed. Minimal cognitive load.
- Must pass the "2 AM crisis test" — nothing on the page adds to distress.

**5. The linear reader** (Chapter 1 → Chapter 2 → ... → Chapter N, via "Next Chapter").
- The reading column belongs to the book. Cross-book features (Related Teachings, graph traversal) are in the side panel, never inline.
- Optional Focus mode (ADR-072) reduces the reader to: reading column + Next Chapter. Everything else suppressed.

**6. The devoted practitioner** (returns daily or weekly, uses search to find half-remembered passages, builds collections, compares across books).
- This is the portal's highest-frequency user — someone who has practiced Kriya Yoga or studied Yogananda's writings for years and uses the portal as a study companion, not for discovery.
- Advanced search supports their recall pattern: partial-phrase matching, book-scoped search, cross-book comparison via Related Teachings.
- Personal collections (Phase 12) and study circle sharing (Phase 14) serve this seeker directly. Until then, browser bookmarks and the reading history (sessionStorage) provide lightweight persistence.
- The Practice Bridge signposts (ADR-104) are confirmations for this seeker, not introductions — they already know the path. The signpost tone acknowledges this.

**7. The scholar** (citation-driven, cross-referencing, export-oriented).
- Academic researchers, seminary students, comparative religion faculty, digital humanities scholars who need Yogananda's words in citable form.
- Stable canonical URLs for every passage (`/passage/[chunk-id]`) serve as persistent citations.
- Citation export (Chicago, MLA, BibTeX) from the passage detail view (Phase 6 knowledge graph features the cross-reference layer that makes this natural).
- The Knowledge Graph `/explore` view (ADR-043, ADR-061, ADR-062) is this seeker's primary discovery tool — they navigate by relationship, not by theme or emotion.
- This path is how Yogananda's teachings enter university syllabi, interfaith anthologies, and peer-reviewed scholarship. The portal's bibliographic integrity directly serves this.

**Single-invitation principle:** Each path invites exactly one step deeper — never more. The shared passage → continue reading the chapter. The external chapter arrival → start from the beginning. The Quiet Corner → nothing during timer, then a parting passage. Today's Wisdom → "Show me another" or search. The devoted practitioner → deeper into the book they're studying. The scholar → the citation they can use.

**Honest absence principle:** When the portal cannot help — no results for a search query, a book unavailable in the seeker's language, a topic outside the corpus — it says so clearly and offers the closest alternative. The "no results" page is not an error state; it is a moment of honesty. It may surface the "Seeking..." empathic entry points, suggest broader theme exploration, or acknowledge that the query falls outside published works. It never fabricates relevance. (Relates to CLAUDE.md constraint #12 — content availability honesty.)

### DES-015: Self-Revealing Navigation

The portal teaches its own navigation through the experience of using it — not through tooltips, onboarding tours, or help overlays (though these remain as fallbacks).

**Content-as-instruction for Dwell mode:** The most evocative passage in a chapter's first screen receives a subtly warmer background on first visit — not full Dwell mode, but a hint that paragraphs can be focused. The seeker's natural curiosity discovers Dwell through exploration. The tooltip appears as fallback if not discovered within two chapter visits.

**Contextual teaching for themes:** When a seeker's first search returns results, result cards include a quiet link: "This passage also appears in the theme: **Courage** →" — teaching that themes exist through a result the seeker already cares about. Shown on first search only (sessionStorage).

**Keyboard shortcuts taught in context:** When a keyboard-using seeker reaches the end of a chapter, a one-time hint appears: "Press → for next chapter." Not a full shortcut reference — just the one shortcut relevant now. Subsequent shortcuts are introduced one at a time in context. The `?` overlay remains available.

**The terminology bridge teaches itself:** The suggestion dropdown showing "Yogananda's terms: concentration, one-pointed attention" below a "mindfulness" query teaches the vocabulary gap concept through a single well-designed moment — no explanation of "terminology bridge" needed.

**Fallback guarantee:** Every self-revealing pattern has a conventional fallback (tooltip, overlay, explicit link) for seekers who don't discover the organic path.

### Image Usage Guidelines

(See ADR-042 for full rationale, ADR-088 for portal imagery strategy.)

**Core principle: The reading experience is text-only.** No images appear in the book reader column. Imagery would compete with Yogananda's words, and his words always win. The portal's design is photo-optional — every layout works without images. (ADR-088)

**Guru photographs:**

| Context | Usage | Notes |
|---------|-------|-------|
| About page — lineage display | All four guru portraits in sequence | Primary location for guru images |
| About page — Yogananda bio | Yogananda portrait as author photo | Frontispiece positioning |
| Quiet Corner | Single small Yogananda portrait above affirmation | Liturgically appropriate — devotees meditate with guru's image |
| Book landing pages | Yogananda portrait as author photo | One per book, not per chapter |
| Site footer | Small sepia-toned portrait (~48-60px) beside "Teachings of Paramahansa Yogananda" | Attribution, not decoration. Present on every page. (ADR-088) |
| Everywhere else | **No guru images** | Restraint creates reverence |

**Nature/property photographs from SRF:**

| Context | Image Type | Treatment |
|---------|-----------|-----------|
| Homepage hero | Wide, soft-focus SRF property (Encinitas, Lake Shrine) | Today's Wisdom overlaid in white Merriweather on semi-transparent `--srf-navy` band. Updated seasonally (4 images/year). Graceful degradation to text-only if no image. (ADR-088) |
| Quiet Corner background | Desaturated nature at 5–8% opacity beneath warm cream | A hint of sky, a suggestion of water. Applied via `background-image` with low opacity. Optional — `--portal-bg-alt` alone is sufficient. (ADR-088) |
| Theme pages | Nature per theme (still water → Peace, mountains → Courage) | Ambient, never dominant. Muted. |
| 404 page | SRF garden photograph | Gentle error with: "This page doesn't exist, but perhaps you were meant to find this instead..." + search bar |

**Rules:**
- Never crop, filter, or apply effects to guru photographs
- Never use guru images adjacent to UI controls or in error/loading states
- **Never use stock photography.** SRF images or no images. The warm cream palette and gold lotus motif are sufficient to create a sacred atmosphere without photographs. (ADR-088)
- All images require alt text with full name/title (guru photos) or descriptive text (nature)
- The portal is designed to work beautifully with or without photographs — every layout functions without images

### SEO and Discoverability

The portal's mission is to reach the world. Without SEO, it serves only people who already know it exists.

**Per-page meta tags:**

| Page Type | Title Pattern | Description |
|-----------|--------------|-------------|
| Homepage | "Teachings of Paramahansa Yogananda — Free Online Library" | Portal overview |
| Theme page | "Yogananda on [Theme] — Verbatim Passages" | Theme-specific, includes life challenge keywords |
| Book page | "[Book Title] by Paramahansa Yogananda — Read Free Online" | Book-specific |
| Chapter page | "[Chapter Title] — [Book Title]" | Chapter-specific |
| Shared passage | Quote snippet (first 120 chars) + citation | Passage-specific, OG-optimized |
| Quiet Corner | "A Moment of Stillness — Yogananda Affirmation" | Calm, inviting |

**Structured data (JSON-LD):**
- `Book` schema for each book landing page
- `Article` schema for each chapter
- `WebSite` schema with `SearchAction` for the search bar
- `Organization` schema for SRF

**Sitemap:**
- Auto-generated from Neon data: all books, chapters, theme pages, and high-traffic shared passages
- Submitted to Google Search Console

**Key SEO opportunities:**
- Theme pages are the primary SEO entry point. Someone Googling "spiritual guidance for anxiety" or "Yogananda on fear" should land on `/themes/courage` or a search result.
- Shared passage URLs (`/passage/[id]`) accumulate inbound links naturally as people share quotes.
- Book chapter pages are long-form, unique content that search engines favor.

### Design System: SRF Design Tokens (Extracted from Live SRF Sites)

The following tokens are derived from analysis of yogananda.org, convocation.yogananda.org, onlinemeditation.yogananda.org, and associated SRF properties. The teaching portal inherits these to maintain brand consistency while applying Calm Technology principles.

#### Color Palette

```css
:root {
 /* === Brand Colors (extracted from yogananda.org) === */
 --srf-gold: #dcbd23; /* Donate button, lotus accent, primary CTA border */
 --srf-orange: #de6a10; /* Hover states, warm accent, X/social icon */
 --srf-navy: #1a2744; /* Logo wordmark, primary headings, nav text (estimated from assets) */
 --srf-white: #ffffff; /* Backgrounds, button text on dark */

 /* === Secondary Colors (from Online Meditation Center) === */
 --srf-orange-warm: #f7882f; /* OMC form submit buttons, warm CTA variant */
 --srf-gold-light: #ffcf6f; /* OMC focus ring, light gold accent */
 --srf-blue: #0274be; /* Interactive focus states, input focus border */
 --srf-slate: #6b7a8f; /* Button hover variant, muted secondary */

 /* === Neutral Scale === */
 --srf-gray-900: #4c4c4c; /* Dark body text, checkbox borders */
 --srf-gray-500: #808088; /* Secondary UI elements */
 --srf-gray-300: #cccccc; /* Borders, dividers, input borders */
 --srf-black: #000000; /* High-contrast text */

 /* === Teaching Portal Extensions (Calm Technology) === */
 --portal-bg: #FAF8F5; /* Warm cream — softer than pure white */
 --portal-bg-alt: #F5F0EB; /* Slightly warmer for alternating sections */
 --portal-quote-bg: #F9F6F1; /* Quote card background — warm, papery */
 --portal-text: #2C2C2C; /* Primary reading text — softer than black */
 --portal-text-muted: #595959; /* Citations, metadata, secondary text (corrected from #6B6B6B for WCAG AA contrast on cream) */

 /* === Time-Aware Reading Bands (DES-011) — defined in Phase 11 === */
 /* --portal-bg-morning, --portal-bg-evening, --portal-bg-night, --portal-text-night
 are introduced when circadian color temperature is implemented. */

 /* === Semantic Colors === */
 --color-error: #d32f2f; /* Errors (refined from raw "red") */
 --color-error-bg: rgba(242, 38, 19, 0.1); /* Error background (softened) */
 --color-success: #2e7d32; /* Success states */

 /* === Lotus Icon Color System (from SVG assets on yogananda.org) === */
 /* SRF uses a family of lotus icons in these accent colors: */
 --lotus-orange: #de6a10; /* lotus-1, lotus-10, lotus-13 */
 --lotus-yellow: #dcbd23; /* lotus-5, lotus-6 */
 --lotus-blue: #0274be; /* lotus-7 */
 --lotus-green: #4a7c59; /* lotus-5, lotus-6, lotus-7, lotus-12, lotus-13, lotus-14 (estimated) */
 --lotus-black: #1a2744; /* lotus-1, lotus-10, lotus-11, lotus-14 */
 /* Each color has _light and _dark background variants */
}
```

#### Typography

```css
:root {
 /* === Font Families (extracted from SRF Online Meditation Center) === */
 --font-serif: 'Merriweather', Georgia, 'Times New Roman', serif;
 --font-serif-alt: 'Lora', Georgia, serif;
 --font-sans: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

 /* === Indic Script Fonts (ADR-080) === */
 /* Noto Sans Devanagari loaded from Phase 0 — God Talks with Arjuna
 contains original Bhagavad Gita verses in Devanāgarī script.
 Loaded conditionally: only on pages containing Devanāgarī characters.
 Phase 10 adds Noto Sans Bengali for Bengali content. */
 --font-devanagari: 'Noto Sans Devanagari', 'Noto Serif Devanagari', sans-serif;
 --font-bengali: 'Noto Sans Bengali', sans-serif; /* Phase 10 */

 /* === Font Scale === */
 --text-xs: 0.75rem; /* 12px — labels, fine print */
 --text-sm: 0.9375rem; /* 15px — captions, metadata */
 --text-base: 1.125rem; /* 18px — body text, standard reading */
 --text-lg: 1.375rem; /* 22px — large body, form inputs */
 --text-xl: 1.75rem; /* 28px — section headings */
 --text-2xl: 2rem; /* 32px — page headings */

 /* === Font Weights (Merriweather supports 300, 400, 700) === */
 --font-light: 300; /* Elegant headings, pull quotes */
 --font-regular: 400; /* Body text */
 --font-semibold: 600; /* CTA text (Open Sans) */
 --font-bold: 700; /* Strong emphasis, section headings */

 /* === Line Heights === */
 --leading-tight: 1.3; /* Headings */
 --leading-normal: 1.6; /* Body text — generous for readability */
 --leading-relaxed: 1.8; /* Book text — spacious for contemplation */

 /* === Letter Spacing === */
 --tracking-wide: 0.125em; /* Uppercase labels, CTAs (from donate button: 2px at 18px) */
}
```

**Typography assignment:**

| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|-------------|
| Book text (reading) | Merriweather | 400 | `--text-base` (18px) | `--leading-relaxed` (1.8) |
| Quoted passages (search results) | Merriweather | 300 (light) | `--text-base` | `--leading-relaxed` |
| Page headings | Merriweather | 700 | `--text-2xl` (32px) | `--leading-tight` (1.3) |
| Section headings | Merriweather | 700 | `--text-xl` (28px) | `--leading-tight` |
| UI chrome (nav, buttons, labels) | Open Sans | 400/600 | `--text-sm` (15px) | `--leading-normal` (1.6) |
| Citations below quotes | Open Sans | 400 | `--text-sm` | `--leading-normal` |
| Chapter titles in reader | Lora | 400 | `--text-xl` | `--leading-tight` |
| Devanāgarī verses (Gita) | Noto Sans Devanagari | 400 | `--text-base` (18px) | `--leading-relaxed` (1.8) |

**IAST diacritics note (ADR-080):** Merriweather and Lora must render IAST combining characters (ā, ī, ū, ṛ, ṃ, ḥ, ñ, ṅ, ṭ, ḍ, ṇ, ś, ṣ) correctly at all sizes. Verify during Phase 1 design QA — particularly at `--text-sm` (15px) where combining marks are most likely to collide or render incorrectly.

#### Spacing, Borders, and Radii

```css
:root {
 /* === Spacing Scale (derived from SRF site patterns) === */
 --space-1: 0.25rem; /* 4px */
 --space-2: 0.5rem; /* 8px */
 --space-3: 0.75rem; /* 12px — button padding-y */
 --space-4: 1rem; /* 16px — input padding */
 --space-5: 1.25rem; /* 20px — text block margin */
 --space-6: 1.5rem; /* 24px */
 --space-8: 2rem; /* 32px — section spacing */
 --space-10: 2.5rem; /* 40px — heading margin, large gaps */
 --space-12: 3rem; /* 48px */
 --space-16: 4rem; /* 64px — page section separators */
 --space-20: 5rem; /* 80px — hero spacing */

 /* === Borders (from SRF donate button, OMC forms) === */
 --border-thin: 1px solid;
 --border-standard: 1.5px solid; /* SRF donate button */
 --border-medium: 2px solid; /* OMC submit buttons, focus rings */

 /* === Border Radius === */
 --radius-sm: 3px; /* Subtle rounding */
 --radius-md: 5px; /* Form inputs (from OMC) */
 --radius-lg: 8px; /* Cards */
 --radius-pill: 50px; /* CTA buttons (from OMC submit) */

 /* === Transitions === */
 --transition-standard: all 0.3s ease; /* From SRF donate button */
}
```

#### Responsive Breakpoints

```css
/* Derived from yogananda.org and OMC Elementor config */
--bp-mobile: 639px; /* max-width: mobile */
--bp-tablet: 768px; /* min-width: tablet */
--bp-desktop: 1024px; /* min-width: desktop (JS nav breakpoint) */
--bp-wide: 1280px; /* min-width: wide desktop */
--bp-max-content: 1440px; /* max content width */
```

#### Calm Technology UI Rules

| Rule | Implementation |
|------|---------------|
| Background | `--portal-bg` (#FAF8F5) warm cream — never pure white |
| Quoted passages | `--portal-quote-bg` on cards with subtle `--srf-gold` left border |
| Headings | `--srf-navy` color, Merriweather bold |
| Body text | `--portal-text` (#2C2C2C) — softer than black |
| Links | `--srf-blue` (#0274be) with underline on hover |
| CTA buttons | `--srf-gold` border, gold text, orange on hover (matches donate pattern) |
| Whitespace | Generous. `--space-16` between major sections. `--space-8` between passages. |
| Quotation marks | Typographic curly quotes (\u201c \u201d) not straight (" ") |
| Citations | `--portal-text-muted` in `--font-sans` at `--text-sm` below each quote |
| Animations | Only `--transition-standard` (0.3s ease) on hover/focus. No decorative animation. |
| Loading states | Quiet skeleton screens using `--portal-bg-alt`. No spinners with messages. |
| Lotus icons | Use SRF's existing lotus SVG family as section markers and decorative elements |
| Decorative quote marks | Large Merriweather 700, 48px, `--srf-gold` at 40% opacity on all Yogananda passages (DES-008) |
| Drop capitals | Merriweather 700, `--srf-navy`, 3-line span at chapter starts (DES-008) |
| Section dividers | Small lotus SVG (16px, `--srf-gold` at 25%) instead of `<hr>` (DES-016) |
| Time-aware background | Shifts warmth by time of day — opt-out, on by default (DES-011) |

#### DES-016: Lotus as Unified Visual Motif

A **single simplified lotus design** (geometric, 3-petal, SVG) serves as the portal's unified visual motif. The same design everywhere:

| Use | Size | Color | Opacity |
|-----|------|-------|---------|
| Section divider (replaces `<hr>`) | ~16px | `--srf-gold` | 25% |
| Bookmark icon in reader (ADR-066) | 20px | `--srf-gold` | 50% / 100% |
| Favicon | 16/32px | `--srf-gold` | 100% |
| Opening threshold (DES-007) | ~40px | `--srf-gold` | 30% |
| Quote card accent (optional) | 12px | `--srf-gold` | 20% |

**Design principles:**
- **One design.** Not multiple variants. The same SVG at different sizes and opacities.
- **Never heavy.** Always subtle — low opacity, small scale. Felt, not stared at.
- **Geometric, not photographic.** A minimal line drawing. Must work at 12px.
- **Gold only.** Always `--srf-gold`. No multi-color lotus icons in the portal.
- **Consistency creates recognition, which creates meaning.**

The SVG is defined once as a reusable component, parameterized for size, color, and opacity via CSS custom properties.

#### Self-Hosted Fonts (ADR-099)

Fonts are self-hosted from Vercel's CDN — not loaded from Google Fonts CDN. This eliminates IP transmission to Google servers (required by LG München I, Case No. 3 O 17493/20 for German GDPR compliance) and improves performance (no DNS lookup to `fonts.googleapis.com`).

Download WOFF2 files for Merriweather (300, 400, 700), Lora (400), and Open Sans (400, 600). Place in `/public/fonts/`. Reference via `@font-face` declarations in global CSS:

```css
@font-face {
  font-family: 'Merriweather';
  src: url('/fonts/merriweather-v30-latin-300.woff2') format('woff2');
  font-weight: 300;
  font-display: swap;
}
/* ... additional weights and families */
```

`font-display: swap` preserves the same FOUT behavior as the previous Google Fonts `display=swap` parameter.

*Section revised: 2026-02-21, ADR-099 (self-hosted fonts for GDPR compliance)*

---

## DES-017: Multi-Language Strategy

(See ADR-075 for architectural rationale, ADR-076 for CSS logical properties, ADR-077 for Hindi/Bengali.)

### Three-Layer Localization

| Layer | What | Approach | Phase |
|-------|------|----------|-------|
| **UI chrome** | Nav, labels, buttons, errors, search prompts (~200–300 strings) | `next-intl` with locale JSON files. URL-based routing (`/es/...`, `/de/...`). AI-assisted workflow: Claude drafts → human review → production (ADR-078). | Infrastructure in Phase 1. Translations in Phase 10. |
| **Book content** | Yogananda's published text in official translations | Language-specific chunks in Neon (`language` column). Contentful locales in production. **Never machine-translate sacred text.** | Phase 10 |
| **Search** | FTS, vector similarity, query expansion | Per-language BM25 index (pg_search, ADR-114). Multilingual embedding model (Voyage, ADR-118). Claude expands queries per language. | Phase 10 |

### Phase 1 — English Only, i18n-Ready

Content is English only. But the i18n infrastructure is in place from day one:

- All UI strings externalized to `messages/en.json` (never hardcoded in components)
- `next-intl` configured with `en` as sole locale
- CSS logical properties throughout (`ms-4` not `ml-4`, `text-align: start` not `text-align: left`)
- `lang="en"` on `<html>` element
- `language` column already present on `book_chunks`, `search_queries`, `email_subscribers`

Adding new locales later is a configuration change, not a codebase refactor.

### URL Structure

```
/ → English (default, no prefix)
/es/ → Spanish
/de/search?q=Angst → German search
/ja/quiet → Japanese Quiet Corner
/hi/themes/peace → Hindi theme page
```

Locale detection on first visit: `Accept-Language` header → redirect to best match → user override via language selector → preference stored in cookie (no account needed).

### Content Availability Matrix

Not all books are translated into all languages. This creates asymmetric experiences:

| Book | en | es | de | fr | it | pt | ja | hi | bn |
|------|----|----|----|----|----|----|----|----|-----|
| Autobiography of a Yogi | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Where There Is Light | ✓ | ✓ | ✓ | ✓ | ✓ | ? | ? | ? | ? |
| Sayings | ✓ | ✓ | ? | ? | ? | ? | ? | ? | ? |
| Man's Eternal Quest | ✓ | ✓ | ? | ? | ? | ? | ? | ? | ? |
| Second Coming of Christ | ✓ | ? | ? | ? | ? | ? | ? | ? | ? |

*(This matrix must be verified with SRF/YSS — it is a critical stakeholder question.)*

**Query pattern:** The content availability matrix is derived from the `books` table via `canonical_book_id`:

```sql
-- Which languages is a given book available in?
SELECT DISTINCT b.language
FROM books b
WHERE b.canonical_book_id = :canonical_id OR b.id = :canonical_id;

-- Full matrix: all books × all languages
SELECT
 COALESCE(b_en.title, b.title) AS title,
 b.language,
 b.id AS book_id
FROM books b
LEFT JOIN books b_en ON b.canonical_book_id = b_en.id
ORDER BY COALESCE(b_en.title, b.title), b.language;
```

This is a derived view, not a separate table. The `books` table with `canonical_book_id` is the single source of truth for content availability.

**Consequence:** The book catalog, search index depth, theme page richness, and daily passage pool all vary by language. This asymmetry is honest and transparent, not hidden.

### English Fallback Hierarchy

When the user's language has insufficient content, supplement with English — always clearly marked.

| Feature | Fallback Behavior |
|---------|-------------------|
| **Search results** | Search user's language first. If fewer than 3 results, also search English. English results marked with `[EN]` tag and "Read in English →" link. |
| **Today's Wisdom** | Draw from user's language pool. If pool < 20 passages, supplement with English (marked). |
| **Theme pages** | Show passages in user's language. If fewer than 5, supplement with English (marked). |
| **Quiet Corner** | Show affirmation in user's language. If none available, show English. |
| **Book reader** | No fallback — if book isn't translated, it's not in the catalog for that language. Show link: "Read in English →" |
| **Book catalog** | Show books available in user's language + a "Also available in English" section for remaining books. |
| **Daily email** | Send in subscriber's language. If passage pool too small, send English with language note. |

**Fallback display design:**

```
"The soul is ever free; it is deathless, birthless..."

— Autobiography of a Yogi, Chapter 26, p. 312 [EN]
 Read in English →
```

The `[EN]` tag is a small, muted language indicator. It is honest, not apologetic.

### Language-Specific Search

**Full-text search:** PostgreSQL language dictionaries handle stemming, stop words, and normalization per language.

> **Note:** The `content_tsv` column and its language-aware trigger (defined in § Data Model) already handle per-language full-text search. The trigger maps each chunk's `language` code to the appropriate PostgreSQL dictionary at insert/update time. No additional column or index is needed when new languages are added in Phase 10 — only new content rows with the correct `language` value.

**Vector search:** The embedding model **must be multilingual** — this is an explicit requirement, not an accident. OpenAI's text-embedding-3-small handles multilingual text and places semantically equivalent passages in different languages close together in vector space. This means English embeddings generated in Phase 0 remain valid when Spanish, German, and Japanese chunks are added in Phase 10 — no re-embedding of the English corpus. Any future embedding model migration (ADR-046) must preserve this multilingual property. Benchmark per-language retrieval quality with actual translated passages in Phase 10 (Deliverable 10.10). Switch to per-language models only if multilingual quality is insufficient — but note that per-language models sacrifice the English fallback's vector search quality and cross-language passage alignment.

**Query expansion:** Claude handles all target languages. The expansion prompt includes the target language:

```
Expand this {language} search query into semantic search terms in {language}: "{query}"
```

### Spiritual Terminology Across Languages

Yogananda uses Sanskrit terms throughout: *samadhi*, *karma*, *dharma*, *prana*, *guru*. Different translations handle these differently — some keep the Sanskrit, some translate, some transliterate. The search index must handle both forms.

**Example:** A German seeker searching "Samadhi" should find passages whether the German translation uses "Samadhi" or "Überbewusstsein" (superconsciousness).

**Approach:** The query expansion step (Claude) naturally handles this — it can expand "Samadhi" into both the Sanskrit term and the language-specific translation. For FTS, the trigram index (`pg_trgm`) already catches partial matches across transliterations.

### Locale-First Search Policy

The `language` API parameter means **the user's locale**, not the detected query language. Auto-detection on short queries (2–5 words) is unreliable — "karma" is the same word in six languages, "peace" gets typed by Spanish users who know the English word.

**Policy:**
1. Search the user's locale language first (via `hybrid_search` with `search_language` parameter)
2. If fewer than 3 results, supplement with English (service layer calls `hybrid_search` again with `search_language='en'`)
3. English fallback results are marked with `[EN]` tag and "Read in English →" link

This policy is implemented in `search.ts` at the service layer, not in the SQL function. The `hybrid_search` function is a single-language primitive; the service function composes the multilingual behavior.

### Cross-Language Features

The multilingual architecture serves two practical use cases, not arbitrary cross-language search:

1. **User's locale + English fallback.** A seeker reads and searches in their language. When content is insufficient (< 3 search results, sparse theme pages), English supplements it — clearly marked with `[EN]` tags. This is the primary multilingual experience. Arbitrary cross-language search (e.g., querying in Japanese, finding German results) solves a problem few seekers have — the real need is locale + English.

2. **Cross-language passage alignment.** When the same book exists in multiple translations, the `canonical_chunk_id` column on `book_chunks` links a translated chunk to its English original. This enables "Read this passage in Spanish →" navigation between editions. Alignment is done during ingestion by matching (canonical_book_id, chapter_number, paragraph_index). Edge cases (translator's notes, merged paragraphs) are resolved in the human QA step.

**Cross-language search as optional future feature:** The multilingual embedding model places semantically equivalent text in different languages close together in vector space. If usage data (Phase 10 analytics) reveals demand for searching across all languages simultaneously, this can be enabled by calling `hybrid_search` without the `language` filter. But this is not a core Phase 10 deliverable — locale + English fallback covers the practical need.

### Chunk Relations in a Multilingual Corpus

The `chunk_relations` table stores pre-computed semantic similarity. In a multilingual corpus, a naive "top 30 global" approach would leave non-English languages underserved — most of the 30 slots would be consumed by chunks in other languages (predominantly English, which will be the largest corpus).

**Computation strategy (Phase 10):**
- For each chunk, store **top 30 same-language** relations + **top 10 English supplemental** relations (best from English corpus when the chunk is non-English; empty for English chunks)
- Total: up to 40 rows per chunk (at 400K chunks across all languages = 16M rows — trivial for PostgreSQL)
- Same-language relations power the default "Related Teachings" side panel
- English supplemental relations provide fallback when the same-language corpus is small — a Spanish reader with only 3 Spanish books can still see related English passages in the side panel, clearly marked with `[EN]`
- The `rank` column indicates rank within its group (1–30 for same-language, 1–10 for English supplemental)
- Query pattern: `JOIN book_chunks target ON target.id = cr.target_chunk_id WHERE target.language = :lang` for same-language; add `OR target.language = 'en'` to include English supplemental
- Fallback: when filtered results < 3 (rare with this strategy), fall back to real-time vector similarity with a WHERE clause

This ensures every language gets full related teachings, not an afterthought. English supplemental relations are the multilingual equivalent of the search fallback strategy — same pattern, same `[EN]` marking.

### Language Selector

A globe icon in the header navigation, opening a simple dropdown of available languages. Each language displayed in its own script:

```
English
Español
Deutsch
Français
Italiano
Português
日本語
हिन्दी (Phase 10 Indian wave)
বাংলা (Phase 10 Indian wave)
```

Selection stored in a cookie. Available on every page. Not gated by account.

### Font Stack for Non-Latin Scripts

| Language | Script | Font |
|----------|--------|------|
| Japanese | CJK | Noto Serif JP (reading), Noto Sans JP (UI) |
| Hindi | Devanagari | Noto Serif Devanagari (reading), Noto Sans Devanagari (UI) |
| Bengali | Bengali | Noto Serif Bengali (reading), Noto Sans Bengali (UI) |
| All Latin | Latin | Merriweather / Lora / Open Sans (existing stack) |

All non-Latin fonts loaded conditionally — only when the user selects that locale, not on every page load.

### Per-Language SEO

| Requirement | Implementation |
|-------------|---------------|
| `hreflang` tags | Every page includes `<link rel="alternate" hreflang="es" href="/es/...">` for all available locales. |
| Per-language sitemap | Separate sitemap per locale, submitted to Google Search Console. |
| Localized meta tags | Page titles and descriptions translated per locale. |
| JSON-LD language | `inLanguage` field on Book and Article schemas matches the page locale. |

### Resolved Design Decisions

1. **Locale-first search:** The `language` API parameter means the user's locale, not the detected query language. No auto-detection of query language. English fallback implemented at service layer.
2. **Theme slugs stay in English** for URL stability (`/es/themes/peace`, not `/es/temas/paz`). Display names localized via `topic_translations` table.
3. **Embedding model must be multilingual.** Explicit requirement (not accident). Ensures Phase 0 embeddings remain valid when Phase 10 adds new languages.
4. **`reader_url` is locale-relative.** API returns `/books/slug/chapter#chunk`. Client prepends locale prefix. API stays presentation-agnostic.
5. **`chunk_relations` store per-language.** Top 30 same-language + top 10 English supplemental per chunk. Ensures non-English languages get full related teachings with English fallback.
6. **Locale + English fallback is the multilingual model.** Arbitrary cross-language search (e.g., Japanese query finding German results) is deferred as optional — the practical need is the user's language plus English fallback, not N×N language combinations. The multilingual embedding model enables cross-language search at near-zero cost if usage data later justifies it.
7. **Chunk size must be validated per language (Phase 10).** Token economies differ across scripts — a 300-token chunk in Japanese may hold less semantic content than 300 English tokens. Per-language chunk size benchmarking is required before ingesting non-English content. At minimum, validate that English-calibrated chunk sizes produce acceptable retrieval quality in all target languages.

### Open Questions (Require SRF Input)

> **Central registry:** CONTEXT.md § Open Questions. The Phase 10 questions below are tracked there with the full stakeholder list.

- Digital text availability of official translations (highest-impact Phase 10 question)
- Translation reviewer staffing
- YSS portal branding for Hindi/Bengali locales
- Whether translated editions preserve paragraph structure (affects `canonical_chunk_id` alignment)

---

## DES-018: Cultural Design Considerations

Each supported locale carries cultural, typographic, and platform expectations that go beyond translation. This section documents what we know, what we need to validate, and what adaptations each culture may require. It is a living reference — updated as Phase 10 implementation progresses and native-speaker reviewers provide input.

### English (en) — Default

- **Primary platforms:** Google, YouTube, Safari/Chrome, email
- **Script:** Latin. All design tokens calibrated for English.
- **Cultural notes:** The portal's warm cream + Merriweather + bibliomantic "Show me another" aesthetic was designed for English spiritual readers. This is the baseline.
- **Open question:** Which edition of *Autobiography of a Yogi* does the portal's pagination reference? SRF study groups worldwide reference specific page numbers. Edition clarity is needed. (ADR-034 provides the `edition` column.)

### Spanish (es) — Wave 11a

- **Primary platforms:** WhatsApp (dominant in Latin America), Google, YouTube, Instagram
- **Script:** Latin. Standard design tokens work. Spanish diacritics (á, é, ñ) render correctly in Merriweather.
- **Cultural notes:** Latin American spiritual culture favors warmth, emotional directness, and relational language. "Seeking..." entry points need cultural *adaptation*, not mechanical translation — e.g., "The heart to forgive" might become "Sanar el corazón" (healing the heart) or "Aprender a soltar" (learning to let go). WhatsApp integration (Phase 8, ADR-026) is high-priority for this audience.
- **Organizational:** SRF (not YSS) serves Latin America directly. Verify whether Latin American SRF centers have their own event calendars for the Events signpost.
- **Open question:** Does SRF have digital text of Spanish translations?

### German (de) — Wave 11a

- **Primary platforms:** Google, YouTube, WhatsApp (growing), email
- **Script:** Latin. Merriweather renders ä, ö, ü, ß correctly.
- **Cultural notes:** German compound words ("Selbstverwirklichung," "Gottverwirklichung," "Überbewusstsein") challenge search. Embedding model must place these near English equivalents — requires explicit testing. ADR-078 glossary specifies formal "Sie" register. German privacy expectations exceed GDPR minimums — the portal's no-tracking approach (ADR-095) is a strong cultural fit, but German seekers may still expect a privacy explanation page. Older SRF Deutschland translations may use different orthography ("Krija" vs "Kriya") — search must handle both.
- **Open question:** Does SRF Deutschland have digital text? Which translations?

### French (fr) — Wave 11a

- **Primary platforms:** Google, YouTube, WhatsApp (Francophone Africa), email
- **Script:** Latin. Standard diacritics (é, è, ê, ç) work in Merriweather.
- **Cultural notes:** Search must be diacritic-insensitive ("méditation" = "meditation"). Francophone Africa (~130M speakers) may be a larger audience than France itself — ADR-006 global equity features (KaiOS, text-only, 2G) are directly relevant. West African French has different spiritual idiom from European French; "Seeking..." entry points need validation with both.
- **Open question:** Do SRF French translations exist in digital form? Is there a distinct Francophone African SRF/YSS community?

### Italian (it) — Wave 11a

- **Primary platforms:** Google, YouTube, WhatsApp, email
- **Script:** Latin. Standard Merriweather rendering.
- **Cultural notes:** Warm cream aesthetic and serif typography align well with Italian book culture. Few Italian SRF centers — Events signpost may feel sparse. Spiritual terminology glossary (ADR-078) is critical — Italian translations may handle Sanskrit terms differently than English.
- **Open question:** Digital text availability from SRF Italian publications.

### Portuguese (pt) — Wave 11a

- **Primary platforms:** WhatsApp (dominant in Brazil), Google, YouTube, Instagram
- **Script:** Latin. Merriweather renders Portuguese diacritics (ã, õ, ç) correctly.
- **Cultural notes:** Brazilian Portuguese and European Portuguese differ in vocabulary, spelling, and idiom. May need `pt-BR` and `pt-PT` as distinct locales or, at minimum, distinct "Seeking..." entry points. Brazil has one of the world's largest yoga communities. WhatsApp integration is not optional for this audience. ADR-006 equity features relevant for Brazil's connectivity inequality.
- **Open question:** Do SRF Brazilian Portuguese translations exist? Is there a Brazilian SRF organizational structure distinct from Portuguese?

### Japanese (ja) — Wave 11a

- **Primary platforms:** LINE (not WhatsApp), Google, YouTube, Twitter/X
- **Script:** CJK (Hiragana, Katakana, Kanji). Requires Noto Serif JP / Noto Sans JP font loading.
- **Typography:** 38rem line width holds ~30–35 CJK characters per line (within optimal 25–40 range). Line height should tighten from 1.8 to 1.6–1.7. Drop capitals are a Western convention — omit for Japanese. Per-language chunk size validation critical (CJK tokenization differs significantly).
- **Cultural notes:** "Show me another" may need reframing. The cultural analogue to bibliomancy is omikuji (temple fortune slips), where the expectation is a single, definitive message — not unlimited refreshes. Consider framing as "別の教えを読む" (read a different teaching) rather than inviting endless cycling. Japanese social sharing prefers very short, aphoristic content — optimal shareable unit may be one sentence, not a full paragraph. LINE share support needed alongside WhatsApp (ADR-026). Honorific suffixes required for master names ("パラマハンサ・ヨガナンダ師"). Japanese *ma* (negative space) philosophy and wabi-sabi aesthetic could inform the Quiet Corner's presentation differently from the English version — stillness as active aesthetic principle, not merely absence of clutter. "Seeker" (*tanbōsha*, 探訪者) implies outsider status — "practitioner" or "reader" might feel more respectful in Japanese. Per-locale editorial review should determine the appropriate term.
- **Open question:** Does SRF/YSS have digital Japanese translations? What is the Japanese SRF community structure?

### Hindi (hi) — Wave 11b

- **Primary platforms:** WhatsApp (dominant), Google, YouTube, JioPhone/KaiOS
- **Script:** Devanagari (LTR). Requires Noto Serif Devanagari font loading. Base font size may need 10–15% increase vs Latin for equivalent readability.
- **Cultural notes:** Hindi-speaking seekers know Yogananda through YSS, not SRF. Portal branding must feature YSS prominently for `/hi/` locale (ADR-079). The warm cream aesthetic works but may feel understated compared to Hindi spiritual print traditions (which tend toward more ornate visual treatment). India's device landscape is mobile-first and low-bandwidth — ADR-006 equity features (KaiOS, text-only mode, 2G optimization) are essential, not optional. Test performance specifically on JioPhone with Jio 4G in Uttar Pradesh/Bihar/Bengal network conditions.
- **Visual design open question:** Should the Hindi locale carry more visual warmth — deeper gold, more ornamental dividers, more generous use of Devanāgarī calligraphy — to align with Indian spiritual aesthetics? The current "understated" framing should not assume Western minimalism is the universal expression of reverence. YSS-connected Indian designers should participate in this decision, not just review it. (Cross-cultural principle 6)
- **Typography conventions:** Drop capitals are a Western book convention — omit for Devanāgarī. Decorative opening quotation marks need script-appropriate glyphs. The 65-75 character optimal line length is calibrated for Latin script; Devanāgarī requires per-script validation.
- **"Seeker" terminology:** In Hindi/Sanskrit, *sādhak* (साधक, practitioner) or *jijñāsu* (जिज्ञासु, one who desires to know) carry different connotations than "seeker" — a *sādhak* is actively practicing, not seeking. Per-locale editorial review should determine the culturally appropriate term. (Relates to ADR-074)
- **Organizational:** YSS branding, YSS bookstore links, YSS event calendar. Portal URL question: `teachings.yogananda.org/hi/` or a YSS-branded domain? YSS representatives are co-equal design stakeholders for the Hindi locale — see CONTEXT.md § Stakeholders.
- **Open question:** Does YSS have digital text of Hindi translations? What is YSS's digital infrastructure and approval process?

### Bengali (bn) — Wave 11b

- **Primary platforms:** WhatsApp, Google, YouTube, Facebook
- **Script:** Bengali script (LTR). Requires Noto Serif Bengali font loading. Bengali conjuncts and vowel signs require careful font rendering. Base font size may need increase vs Latin.
- **Cultural notes:** Bengali is Yogananda's mother tongue — including it sends a powerful signal about mission integrity. Bengali devotional culture has strong existing practices (daily meditation, Durga Puja season) and literary traditions (Rabindranath Tagore's influence on spiritual aesthetics). The Quiet Corner and parting passages may benefit from a more lyrical editorial framing in Bengali — not translation of English framing, but Bengali-authored devotional register. Bengali OCR accuracy is lower than Hindi if digital text is unavailable.
- **Typography conventions:** Drop capitals are a Western convention — omit for Bengali script. Bengali conjuncts require careful font rendering validation. Decorative quotation marks need script-appropriate glyphs.
- **Organizational:** Same YSS branding considerations as Hindi. YSS representatives are co-equal design stakeholders for the Bengali locale.
- **Open question:** Does YSS have digital Bengali text? Bengali script rendering quality validation needed.

### Future Evaluation Candidates (Wave 11c)

- **Chinese (zh):** WeChat ecosystem (not WhatsApp). Simplified vs Traditional Chinese. Great Firewall considerations for mainland China hosting. Strong yoga community in urban China.
- **Korean (ko):** KakaoTalk (not WhatsApp). Naver search (not Google-dominant). Korean Hangul is phonetic — different search characteristics.
- **Russian (ru):** VK (VKontakte) social platform. Cyrillic script. Russian yoga community is substantial.
- **Arabic (ar):** RTL layout (CSS logical properties ready per ADR-076). Complex typography (ligatures, contextual forms). Cultural sensitivity: yoga is sometimes viewed with suspicion in some Arabic-speaking communities. Requires careful framing.

### Cross-Cultural Design Principles

1. **Adapt, don't just translate.** "Seeking..." entry points, "Show me another" framing, and tone guidance are editorial content per locale, not mechanical translations.
2. **Platform-aware distribution.** WhatsApp for Latin America, India, Africa. LINE for Japan. WeChat for China. KakaoTalk for Korea. The portal's messaging strategy must be locale-aware.
3. **Script-aware typography.** Font size, line height, drop capitals, and line width all vary by script family. Design tokens should be locale-overridable.
4. **Branding-aware identity.** SRF branding for Western locales. YSS branding for Indian locales. The portal's visual identity adapts to the organization the seeker knows.
5. **The portal assumes literacy.** In countries with significant functional illiteracy (India, Brazil, Sub-Saharan Africa), the TTS "Listen" button (Phase 11) is a critical accessibility feature. For Hindi and Bengali locales specifically, audio-first entry points should be prioritized earlier than the general TTS schedule. Yogananda's own voice recordings are the most direct form of the teachings. Consider an audio-first pilot alongside the Hindi/Bengali text launch (Phase 10b) rather than deferring all audio to Phase 12. Yogananda's tradition includes kirtan (singing/chanting) and oral storytelling — inherently oral modes that the portal's text-first approach underserves.
6. **What feels sacred is culturally specific.** The emotional register of the portal — what feels contemplative, welcoming, sacred — is not universal. The warm cream + Merriweather + bibliomantic aesthetic resonates with Western spiritual bookstore sensibility. Hindi spiritual print traditions carry more ornate visual warmth (deeper gold, ornamental dividers, generous Devanāgarī calligraphy). Bengali devotional culture values poetic beauty and literary refinement (Tagore's influence). Japanese *ma* (negative space) philosophy could genuinely inform the Quiet Corner differently. Bhakti traditions express devotion through fervent intensity, not only through stillness. Per-locale adaptation addresses emotional resonance, not just typography and platform preferences. Each locale's visual and editorial adaptation is a *translation of emotional register*, not just a typographic adjustment.
7. **Unsupported language arrival is a design surface, not an error state.** A seeker arriving from Japan, Korea, Russia, or an Arabic-speaking country will encounter a portal that doesn't yet speak their language. This moment must be designed, not defaulted. The response: (a) detect the browser's `Accept-Language` header; (b) if the language is in the future roadmap (Wave 11c candidates), display a brief, warm message in that language: "We are working to bring Yogananda's teachings to [language]. For now, the portal is available in [list of current languages]." This message is a static string in `messages/{locale}.json`, not a dynamic translation. (c) If the language is not on any roadmap, display the English welcome with no false promise. (d) Never auto-redirect — let the seeker choose. (e) The `[EN]` fallback marker (CLAUDE.md constraint #12) is always visible when English content is shown to a non-English browser locale. This principle extends to in-portal moments: when a seeker navigates to a book page that isn't yet available in their language, the page shows the English version with a clear `[EN]` marker and, if the translation is in progress, a note: "This book is being prepared in [language]." Honest about scope, not apologetic about it.

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
 requestId: string; // UUID for Sentry correlation and support debugging
}
```

| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_PARAMETER` | Missing required parameter, invalid cursor, malformed query |
| 404 | `NOT_FOUND` | Book, chapter, chunk, theme, or place does not exist |
| 429 | `RATE_LIMITED` | Rate limit exceeded. Response includes `Retry-After` header (seconds) |
| 500 | `INTERNAL_ERROR` | Unexpected failure. Logged to Sentry with `requestId` |

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
 "available_languages": ["en", "es", "de", "fr", "it", "pt", "ja"]
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
 "available_languages": ["en", "es", "de", "fr", "it", "pt", "ja"],
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

## DES-020: Platform Parity (Mobile Readiness)

The portal is a web application, but its API surface will likely be consumed by native mobile apps eventually — either a standalone portal app, integration into the existing SRF mobile app, or both. ADR-011 establishes the architectural conventions that make this possible at zero Phase 0 cost.

### Shared Service Layer

All business logic lives in `/lib/services/` as plain TypeScript functions. Server Components and API routes both call these functions — never the other way around.

```
/lib/services/
 search.ts → findPassages(query, language, options)
 daily-passage.ts → getDailyPassage(date, language)
 themes.ts → getThemes(language), getThemePassages(slug, language, cursor, limit)
 books.ts → getBooks(language), getBook(slug), getChapter(bookSlug, chapterNumber, language)
 quiet.ts → getAffirmation(language)
 relations.ts → getRelatedChunks(chunkId, filters, limit)
 thread.ts → getChapterThread(bookSlug, chapterNumber)
 glossary.ts → getGlossaryTerms(language, category), getTermBySlug(slug, language)
 audio.ts → getRecordings(cursor, limit, filters), getRecording(slug)
 videos.ts → getVideos(cursor, limit, filters), getVideo(slug)
 magazine.ts → getIssues(cursor, limit, filters), getIssue(slug), getArticles(cursor, limit, filters), getArticle(slug)
 seeking.ts → getSeekingDashboard, getThemeTrends(period)
 journeys.ts → getJourneys(language), getJourney(slug)
 resonance.ts → getResonanceSignals(type, limit)
```

**The rule:** Never put business logic in a Server Component or Route Handler that doesn't delegate to a service function. If a Server Component needs data, it calls a service function directly (in-process). If a mobile app needs the same data, it calls the API route, which calls the same service function.

### Database Connection Strategy

```typescript
// /lib/db.ts — Neon serverless connection
import { neon } from '@neondatabase/serverless';

// For Vercel Functions (edge and serverless):
// - @neondatabase/serverless uses HTTP-based queries (no persistent connections)
// - Each function invocation creates a lightweight client, no pool management needed
// - Neon's built-in connection pooler (PgBouncer-compatible) handles concurrency server-side
//
// For Lambda batch workloads (Phase 1+, ADR-017):
// - Use Neon's pooled connection string (port 5432 → pooler endpoint)
// - Connection limit: Neon free tier allows 100 concurrent connections;
// paid tier scales with compute size
// - Batch scripts should use connection pooling via pg Pool with max: 5
//
// For local development:
// - Direct connection to Neon dev branch (non-pooled endpoint)
// - dbmate uses direct connection string for migrations

const sql = neon(process.env.DATABASE_URL!);
export { sql };
```

### API Conventions

| Convention | Rule | Rationale |
|------------|------|-----------|
| **Versioning** | All routes prefixed `/api/v1/`. Never break v1 after mobile apps ship. | Mobile apps can't force-update users. |
| **Auth** | All routes public (no auth) through Phase 12. Auth added only if/when Phase 13 accounts are implemented. | Frictionless access is the mission. Auth is additive, never a gate on reading or search. |
| **Pagination** | Cursor-based: `{ results, cursor, hasMore }`. No page-number pagination. | Stable across data changes; mobile infinite scroll. |
| **Cache headers** | Explicit `Cache-Control` on every response. Book text: long-lived. Search: no-store. Daily passage: 1 hour. | Mobile apps cache intelligently without custom logic. |
| **Response shape** | Presentation-agnostic JSON. No HTML in responses. No assumptions about rendering. | Same response serves web, mobile, and any future consumer. |
| **`reader_url` convention** | All `reader_url` fields are locale-relative paths (e.g., `/books/autobiography-of-a-yogi/26#chunk-uuid`). The client prepends the locale prefix (e.g., `/es`). The API never embeds locale into URLs — that's a presentation concern. | Keeps the API locale-agnostic; web and mobile clients handle routing differently. |
| **Language parameter** | All content-serving endpoints accept `language` (optional, default `'en'`). The parameter means "the user's locale," not "detected query language." The service layer handles English fallback when locale results are insufficient (ADR-075). | Locale-first search: trust the user's language choice. |

### Cache-Control Strategy

| Endpoint | Header | Rationale |
|----------|--------|-----------|
| `/api/v1/books/[slug]/chapters/[number]` | `max-age=86400, stale-while-revalidate=604800` | Book text is effectively immutable |
| `/api/v1/daily-passage` | `max-age=3600` | Changes daily, not every second |
| `/api/v1/themes/[slug]/passages` | `max-age=3600` | Theme curation changes infrequently |
| `/api/v1/quiet` | `max-age=300` | Affirmation rotates but isn't time-critical |
| `/api/v1/search` | `no-store` | Query-dependent, not cacheable |
| `/api/v1/themes` | `max-age=86400` | Theme list rarely changes |
| `/api/v1/books` | `max-age=86400` | Book catalog rarely changes |
| `/api/v1/books/{slug}` | `max-age=86400, stale-while-revalidate=604800` | Book metadata is effectively immutable |
| `/api/v1/chunks/[id]/related` | `max-age=86400, stale-while-revalidate=604800` | Relations stable; only change on new content ingestion |
| `/api/v1/books/[slug]/chapters/[number]/thread` | `max-age=86400, stale-while-revalidate=604800` | Same as related — changes only on new content |
| `/api/v1/magazine/issues` | `max-age=86400` | Issue catalog changes rarely |
| `/api/v1/magazine/issues/{slug}` | `max-age=86400, stale-while-revalidate=604800` | Issue metadata is effectively immutable |
| `/api/v1/magazine/articles` | `max-age=86400` | Article catalog changes rarely |
| `/api/v1/magazine/articles/{slug}` | `max-age=86400, stale-while-revalidate=604800` | Article text is effectively immutable |
| `/api/v1/audio` | `max-age=86400` | Audio catalog changes infrequently |
| `/api/v1/audio/{slug}` | `max-age=86400, stale-while-revalidate=604800` | Audio metadata is effectively immutable |
| `/api/v1/videos` | `max-age=86400` | Video catalog changes infrequently |
| `/api/v1/videos/{slug}` | `max-age=86400, stale-while-revalidate=604800` | Video metadata is effectively immutable |
| `/api/v1/glossary` | `max-age=86400` | Glossary changes infrequently |
| `/api/v1/seeking` | `max-age=86400` | Aggregated nightly, not real-time |

### Cache Invalidation Strategy

| Trigger | Mechanism | Scope |
|---------|-----------|-------|
| Content correction (Phase 9+) | Contentful webhook → sync service → Cloudflare Purge API | Purge by `Cache-Tag` (e.g., `book:autobiography`, `chapter:autobiography-1`) |
| Daily passage rotation | TTL-based (`max-age=3600`) | No explicit invalidation — 1-hour cache is acceptable for daily content |
| Theme tag changes | Manual Cloudflare purge via API or dashboard | Theme pages and related API responses |
| New book ingestion | Automated purge of `/books` catalog and search index | Book catalog, search results |
| Static assets (JS/CSS) | Content-hashed filenames (`main.abc123.js`) | Infinite cache, new deploy = new hash |
| Emergency content fix | Cloudflare "Purge Everything" via API | Last resort — clears entire CDN cache |

**Implementation:** Each API response includes a `Cache-Tag` header with resource identifiers. The sync service (Phase 9+) calls the Cloudflare Purge API with matching tags after each Contentful publish event. For Phases 0–8 (no Contentful), cache invalidation is manual via Cloudflare dashboard — acceptable given the low frequency of content changes.

### Deep Link Readiness

Passage URLs (`/passage/[chunk-id]`) are designed for universal link interception:

| Platform | File | Location |
|----------|------|----------|
| iOS | `apple-app-site-association` | Domain root (`/.well-known/`) |
| Android | `assetlinks.json` | `/.well-known/` |

These files are added when a native app launches. The URL structure that makes them work is established now.

### PWA Readiness (Phase 11)

Before native apps, a Progressive Web App provides offline reading, home screen installation, and a lighter footprint. See ADR-012.

| Component | Implementation |
|-----------|---------------|
| **Web App Manifest** | `manifest.json` with SRF branding (SRF Gold theme color, portal icon, `standalone` display) |
| **Service Worker** | Cache-first for book chapters, stale-while-revalidate for daily passage, network-only for search |
| **Offline indicator** | Subtle banner: "You're reading offline. Search requires a connection." |
| **Installable** | Meets PWA installability criteria (manifest + Service Worker + HTTPS) |

Offline reading aligns with the Calm Technology principle — a seeker can download a book chapter and read it on a flight, in a forest, or in a place with no connectivity. The technology fades into the background.

---

## DES-021: YouTube Video Section Architecture

### Design Principle

The video section auto-updates from the @YoganandaSRF YouTube channel without manual intervention. SRF's YouTube repository contains hundreds of How-to-Live monastic talks, guided meditations, convocation sessions, and commemorative events. The portal surfaces this content in an organized, searchable way.

### Data Strategy: Hybrid RSS + YouTube API

```
┌─────────────────────────────────────────────────────────────┐
│ │
│ "Latest Videos" section (homepage + /videos) │
│ ┌─────────────────────────────────────┐ │
│ │ YouTube RSS Feed │ │
│ │ (no API key, no quota, free) │ │
│ │ │ │
│ │ URL: youtube.com/feeds/videos.xml │ │
│ │ ?channel_id=CHANNEL_ID │ │
│ │ │ │
│ │ Returns: ~15 most recent videos │ │
│ │ Fields: title, videoId, thumbnail, │ │
│ │ description, published, │ │
│ │ view count │ │
│ │ │ │
│ │ ISR revalidate: 1 hour │ │
│ └─────────────────────────────────────┘ │
│ │
│ "Full Video Library" (categorized by playlist) │
│ ┌─────────────────────────────────────┐ │
│ │ YouTube Data API v3 │ │
│ │ (API key, 10,000 units/day free) │ │
│ │ │ │
│ │ 1. channels.list (1 unit) │ │
│ │ → get uploads playlist ID │ │
│ │ │ │
│ │ 2. playlists.list (1 unit/page) │ │
│ │ → get all channel playlists │ │
│ │ → map to site categories │ │
│ │ │ │
│ │ 3. playlistItems.list (1 unit/page) │ │
│ │ → get videos per playlist │ │
│ │ → up to 50 per page │ │
│ │ │ │
│ │ 4. videos.list (1 unit per 50) │ │
│ │ → full metadata: duration, │ │
│ │ views, thumbnails, tags │ │
│ │ │ │
│ │ ISR revalidate: 6 hours │ │
│ └─────────────────────────────────────┘ │
│ │
│ NEVER use search.list — costs 100 units per call. │
│ Use playlistItems.list instead (1 unit per call). │
│ │
│ Estimated daily quota usage: ~50-100 units (of 10,000) │
│ │
└─────────────────────────────────────────────────────────────┘
```

### Video Categorization

SRF organizes YouTube content into playlists. We map these to portal categories:

```typescript
// Configuration: YouTube playlist → portal category
const PLAYLIST_CATEGORIES = {
 // Map SRF YouTube playlist titles to portal categories
 'How-to-Live Inspirational Talks': { slug: 'how-to-live', label: 'How-to-Live Talks' },
 'Guided Meditations': { slug: 'meditations', label: 'Guided Meditations' },
 'World Convocation': { slug: 'convocation', label: 'Convocation Sessions' },
 'Mahasamadhi Commemorations': { slug: 'commemorations', label: 'Commemorations' },
 'SRF Lessons Introduction': { slug: 'introduction', label: 'Introduction to the Teachings' },
 // Unmapped playlists appear under "More Videos"
};
```

### ISR Revalidation Schedule

| Content | Revalidation | Rationale |
|---------|-------------|-----------|
| Latest videos (RSS) | 1 hour | Free, catches new uploads promptly |
| Channel info | 24 hours | Rarely changes |
| Playlist list | 6 hours | New playlists are infrequent |
| Playlist videos | 6 hours | Videos may be added to playlists |
| Video details (duration, views) | 6 hours | View counts change but freshness is non-critical |

### API Routes

#### `GET /api/v1/videos/latest`

```
Source: YouTube RSS feed (free, no API key)
ISR: revalidate every 1 hour

Response:
{
 "videos": [
 {
 "videoId": "PiywKdIdQik",
 "title": "2026 New Year Message from Brother Chidananda",
 "published": "2026-01-01T00:00:00Z",
 "thumbnail": "https://i.ytimg.com/vi/PiywKdIdQik/hqdefault.jpg",
 "description": "...",
 "viewCount": "45230"
 },
 ...
 ]
}
```

#### `GET /api/v1/videos/library`

```
Source: YouTube Data API v3 (API key required)
ISR: revalidate every 6 hours

Response:
{
 "categories": [
 {
 "slug": "how-to-live",
 "label": "How-to-Live Talks",
 "playlistId": "PLxxxxxx",
 "videoCount": 47,
 "videos": [
 {
 "videoId": "KYxMO7svgPQ",
 "title": "The Art of Introspection for God-Realization",
 "published": "2024-08-15T00:00:00Z",
 "thumbnail": "https://i.ytimg.com/vi/KYxMO7svgPQ/maxresdefault.jpg",
 "duration": "PT1H12M34S",
 "viewCount": "125000",
 "description": "..."
 },
 ...
 ]
 },
 ...
 ]
}
```

### Video Page Layout

```
┌──────────────────────────────────────────────────────────────┐
│ Videos from @YoganandaSRF │
│ │
│ Latest │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ ▶ thumb │ │ ▶ thumb │ │ ▶ thumb │ │ ▶ thumb │ → │
│ │ title │ │ title │ │ title │ │ title │ │
│ │ 2d ago │ │ 1w ago │ │ 2w ago │ │ 3w ago │ │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
│ │
│ ────────────────────────────────────────────────────── │
│ │
│ How-to-Live Talks View all → │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ ▶ thumb │ │ ▶ thumb │ │ ▶ thumb │ │
│ │ title │ │ title │ │ title │ │
│ │ 1h 12m │ │ 55m │ │ 1h 3m │ │
│ │ 125K │ │ 89K │ │ 67K │ │
│ └─────────┘ └─────────┘ └─────────┘ │
│ │
│ Guided Meditations View all → │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ ... │ │ ... │ │ ... │ │
│ └─────────┘ └─────────┘ └─────────┘ │
│ │
└──────────────────────────────────────────────────────────────┘
```

### Video Embedding

Videos play via YouTube's embedded player (no Vimeo needed for public YouTube content):

```html
<iframe
 src="https://www.youtube-nocookie.com/embed/{videoId}"
 title="{video title}"
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
 allowfullscreen
 loading="lazy"
></iframe>
```

Using `youtube-nocookie.com` for privacy-enhanced mode (no tracking cookies until play).

### ADR-055: Future: Video-to-Book Cross-Reference (Phase 10)

When monastic talks are transcribed, the transcripts become a new content type alongside book chunks, enabling unified cross-media search and time-synced playback.

#### Transcript Sources

| Source | Timestamps | Quality | Cost |
|--------|-----------|---------|------|
| **YouTube auto-captions** | Word-level (~0.1s accuracy) | Good for clear English speech | Free (YouTube Data API `captions.download`) |
| **YouTube manual captions** | Word-level | Highest (SRF-uploaded) | Free |
| **OpenAI Whisper API** | Word-level (`timestamp_granularities` param) | Excellent for monastic talks | $0.006/min (~$0.36 per 60-min talk) |
| **Deepgram** | Word-level + paragraph-level | Excellent, with speaker diarization | Similar to Whisper |

**Recommended approach:** Start with YouTube's own captions (free, already in the data pipeline). Use Whisper as the quality upgrade for talks where YouTube captions are insufficient. Estimated one-time cost for SRF's full YouTube library (~500 videos): $150–300.

#### Schema Extension

```sql
-- ============================================================
-- VIDEO TRANSCRIPTS (Phase 12)
-- ============================================================
CREATE TABLE video_transcripts (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 video_id TEXT NOT NULL, -- YouTube video ID
 video_title TEXT, -- cached from YouTube API
 language TEXT NOT NULL DEFAULT 'en',
 transcript_full TEXT NOT NULL, -- complete transcript text
 source TEXT NOT NULL DEFAULT 'youtube', -- 'youtube', 'whisper', 'deepgram', 'manual'
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

-- ============================================================
-- VIDEO CHUNKS (time-synced, embeddable, searchable — Phase 12)
-- ============================================================
-- Same chunking strategy as book_chunks. Each chunk carries start/end
-- timestamps enabling direct links to the exact video playback moment.
CREATE TABLE video_chunks (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 transcript_id UUID NOT NULL REFERENCES video_transcripts(id) ON DELETE CASCADE,
 content TEXT NOT NULL, -- chunk text (same strategy as book_chunks)
 start_seconds FLOAT NOT NULL, -- timestamp where this chunk begins in the video
 end_seconds FLOAT NOT NULL, -- timestamp where this chunk ends
 embedding VECTOR(1024), -- same embedding model as book_chunks (Voyage voyage-3-large, ADR-118)
 -- BM25 search via pg_search index (same FTS strategy as book_chunks, ADR-114)
 language TEXT NOT NULL DEFAULT 'en',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE INDEX idx_video_chunks_embedding ON video_chunks
 USING hnsw (embedding vector_cosine_ops);
-- BM25 index for video_chunks created via pg_search (same pattern as chunks_bm25_icu)
```

#### Cross-Media Search Architecture

Because `video_chunks` uses the same embedding model and FTS strategy as `book_chunks`, unified search is natural:

```
Search query: "overcoming fear"
 │
 ▼
 HYBRID SEARCH (extended)
 ├── book_chunks → ranked verbatim book passages with citations
 └── video_chunks → ranked video segments with timestamps
 │
 ▼
 UNIFIED RRF RANKING
 Results interleave book passages and video segments by relevance
 │
 ▼
 RESULT PRESENTATION
 ┌──────────────────────────────────────────────┐
 │ Book result: │
 │ "The soul is ever free..." — AoY, Ch. 12 │
 │ [Read in context →] │
 ├──────────────────────────────────────────────┤
 │ Video result: │
 │ Brother Chidananda on overcoming fear │
 │ "How-to-Live Talk" (12:34–13:15) │
 │ [Watch at 12:34 →] │
 └──────────────────────────────────────────────┘
```

Video results link to `https://youtube.com/watch?v={video_id}&t={start_seconds}` — dropping the seeker into the exact moment. YouTube's embed API also supports `start` parameters for in-portal embedding.

#### Cross-Media Chunk Relations

Pre-computed `chunk_relations` can span book chunks and video chunks. When a seeker reads a passage in *Autobiography of a Yogi*, the Related Teachings panel can show: *"Brother Chidananda discusses this teaching in a 2023 How-to-Live talk (12:34)"* — with a direct link to that timestamp. This is the feature that makes the portal's cross-media intelligence unique.

#### Synchronized Transcript Display

The video player page (`/videos/[slug]`) shows a synchronized transcript panel alongside the embedded player:

- Transcript text scrolls to follow playback position
- Each paragraph is clickable — clicking jumps the video to that timestamp
- Book passages referenced in the talk appear as margin cards linking to the reader
- The transcript is searchable within the page (browser find or custom search)

---

## DES-022: Events Section

The portal connects seekers to SRF's gatherings without duplicating existing event properties. This is a signpost, not a destination. See ADR-069.

### Content

| Element | Content | Source | Update Frequency |
|---------|---------|--------|-----------------|
| **World Convocation** | SRF's annual gathering of seekers from around the world, offered free of charge. Held each August in Los Angeles and simultaneously online, Convocation includes classes on Yogananda's teachings, group meditations, devotional chanting (kirtan), pilgrimage tours to sacred SRF sites, and fellowship with monastics and seekers worldwide. Anyone may attend — no membership required. Hero image, next year's dates. | Static text + link to `convocation.yogananda.org` | Annual |
| **Commemorations** | Christmas meditation, Mahasamadhi (March 7), Janmashtami, Founder's Day, etc. | Static list with dates and links to SRF event pages | Annual |
| **Online events** | "Join a live meditation" — SRF's Online Meditation Center offers live group meditations, guided meditations led by SRF monastics, and devotional chanting sessions from the convenience of home. | Link to `onlinemeditation.yogananda.org` | Static |
| **Retreats** | "Experience a retreat" | Link to SRF retreat information | Static |
| **Monastic visits** | SRF monastics visit meditation centers worldwide throughout the year for classes, meditations, and fellowship. | Link to SRF events page (`yogananda.org/events`) | Static |
| **Youth & young adult programs** | SRF offers dedicated programs for young seekers. | Link to SRF youth/young adult pages (`yogananda.org/events`) | Static |

### Page Design

Located at `/events` (dedicated page — consistent with the routes table in § Frontend Design § Pages and the nav structure).

```
┌─────────────────────────────────────────────┐
│ Gatherings & Events │
│ │
│ ┌─────────────────────────────────────┐ │
│ │ 🌅 World Convocation 2027 │ │
│ │ │ │
│ │ SRF's annual gathering of seekers │ │
│ │ from around the world — free and │ │
│ │ open to all. Classes, meditations, │ │
│ │ kirtan, pilgrimage tours to sacred │ │
│ │ SRF sites, and fellowship with │ │
│ │ monastics. In Los Angeles & online. │ │
│ │ │ │
│ │ Register free → convocation.yoga.. │ │
│ │ Explore the sacred places → /places │ │
│ └─────────────────────────────────────┘ │
│ │
│ Upcoming Commemorations │
│ ───────────────────────── │
│ March 7 · Mahasamadhi of │
│ Paramahansa Yogananda │
│ August · Janmashtami │
│ December · Christmas Meditation │
│ │
│ ┌──────────────────┐ ┌──────────────────┐ │
│ │ Join a Live │ │ Experience a │ │
│ │ Meditation → │ │ Retreat → │ │
│ └──────────────────┘ └──────────────────┘ │
│ │
│ ┌──────────────────┐ ┌──────────────────┐ │
│ │ Monastic Visits │ │ Youth & Young │ │
│ │ Worldwide → │ │ Adult Programs → │ │
│ └──────────────────┘ └──────────────────┘ │
└─────────────────────────────────────────────┘
```

### Implementation

- **Phase 8:** Static content. MDX or hardcoded in a Next.js page. No CMS needed.
- **Production:** Contentful entry type `event` with fields: `title`, `date`, `description`, `externalUrl`, `image`. Editors update annually.
- **No dynamic event data.** The portal does not fetch from SRF's event systems. It links to them.
- **Lightweight calendar awareness (Phase 8):** The Convocation hero card displays the next Convocation date. Since Convocation is always in August, a simple date comparison promotes the card from "annual event" to "upcoming event" when the current date is within a configurable window (e.g., April–August). During this window, the card's description adds "Registration is open" with link. Outside the window: "Held each August." This is not the full DES-028 calendar-aware surfacing system — it's a single date check on a static page. Commemorations can use similar lightweight date proximity when full DES-028 ships (Phase 4+).

---

## DES-023: Sacred Places — Contemplative Geography

A dedicated `/places` page presenting sites of biographical and spiritual significance, cross-referenced with book passages. See ADR-069.

### Data Model

```sql
-- Sacred places (SRF properties + biographical sites)
CREATE TABLE places (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT NOT NULL,
 slug TEXT NOT NULL UNIQUE,
 category TEXT NOT NULL CHECK (category IN ('srf_property', 'yss_property', 'biographical')),
 description TEXT NOT NULL,
 significance TEXT, -- Spiritual/historical significance
 address TEXT,
 city TEXT NOT NULL,
 region TEXT, -- State/province
 country TEXT NOT NULL,
 latitude DECIMAL(10, 7),
 longitude DECIMAL(10, 7),
 image_url TEXT, -- Contemplative header image
 visiting_info TEXT, -- Hours, access notes
 external_url TEXT, -- Link to SRF/YSS property page
 virtual_tour_url TEXT, -- SRF virtual pilgrimage tour URL (nullable; SRF offers tours of Mother Center, Lake Shrine, Hollywood Temple, Encinitas)
 is_active BOOLEAN NOT NULL DEFAULT true,
 display_order INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

-- Junction: which book passages mention which places
CREATE TABLE chunk_places (
 chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
 place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
 context_note TEXT, -- e.g., "Yogananda describes arriving at this ashram"
 PRIMARY KEY (chunk_id, place_id)
);

CREATE INDEX idx_chunk_places_place ON chunk_places(place_id);
CREATE INDEX idx_chunk_places_chunk ON chunk_places(chunk_id);
```

### Page Design

```
┌──────────────────────────────────────────────────┐
│ Sacred Places │
│ Where the teachings come alive │
│ │
│ ── SRF & YSS Centers ────────────────────────── │
│ │
│ ┌────────────────────────────────────────────┐ │
│ │ [contemplative photo] │ │
│ │ │ │
│ │ Lake Shrine │ │
│ │ Pacific Palisades, California │ │
│ │ │ │
│ │ A ten-acre sanctuary on Sunset Boulevard, │ │
│ │ home to the Gandhi World Peace Memorial │ │
│ │ and spring-fed lake surrounded by │ │
│ │ meditation gardens. │ │
│ │ │ │
│ │ 📖 Read about Lake Shrine → │ │
│ │ Autobiography, Chapter 49 │ │
│ │ │ │
│ │ Visit → srf.org/lake-shrine │ │
│ │ Take a Virtual Tour → │ │
│ │ Get Directions → │ │
│ │ See This Place (Street View) → │ │
│ └────────────────────────────────────────────┘ │
│ │
│ ┌────────────────────────────────────────────┐ │
│ │ [contemplative photo] │ │
│ │ │ │
│ │ Encinitas Retreat │ │
│ │ Encinitas, California │ │
│ │ │ │
│ │ The ocean-facing hermitage where │ │
│ │ Yogananda wrote much of the │ │
│ │ Autobiography of a Yogi. │ │
│ │ │ │
│ │ 📖 Read in context → │ │
│ │ Autobiography, Chapter 37 │ │
│ │ │ │
│ │ Visit → srf.org/encinitas │ │
│ │ Get Directions → │ │
│ │ See This Place (Street View) → │ │
│ └────────────────────────────────────────────┘ │
│ │
│ ── In the Footsteps of Yogananda ────────────── │
│ │
│ ┌────────────────────────────────────────────┐ │
│ │ Gorakhpur, India │ │
│ │ Yogananda's birthplace │ │
│ │ │ │
│ │ "I find my earliest memories │ │
│ │ centering around the family home │ │
│ │ in Gorakhpur..." │ │
│ │ — Autobiography of a Yogi, Chapter 1 │ │
│ │ │ │
│ │ 📖 Read Chapter 1 → │ │
│ └────────────────────────────────────────────┘ │
│ │
│ ┌────────────────────────────────────────────┐ │
│ │ Ranchi, India │ │
│ │ Yogoda Satsanga Brahmacharya Vidyalaya │ │
│ │ │ │
│ │ "A school for boys where yoga was │ │
│ │ taught along with standard │ │
│ │ educational subjects." │ │
│ │ — Autobiography of a Yogi, Chapter 27 │ │
│ │ │ │
│ │ 📖 Read Chapter 27 → │ │
│ └────────────────────────────────────────────┘ │
│ │
│ ┌────────────────────────────────────────────┐ │
│ │ Serampore, India │ │
│ │ Sri Yukteswar's ashram │ │
│ │ │ │
│ │ "The hermitage... is a two-storied │ │
│ │ building with a courtyard..." │ │
│ │ — Autobiography of a Yogi, Chapter 12 │ │
│ │ │ │
│ │ 📖 Read Chapter 12 → │ │
│ └────────────────────────────────────────────┘ │
│ │
│ [Phase 11: Street View links on place cards] │
│ │
│ ── Find a Meditation Group Near You ─────────── │
│ External link → yogananda.org/center-locator │
└──────────────────────────────────────────────────┘
```

### The Book Cross-Reference

The unique value of Sacred Places on the teaching portal: each place links to the passages that describe it, and passages in the reader can link back to the place.

**Reader → Place:** When reading a chapter that mentions a significant location, a subtle card appears in the margin or below the passage:

```
┌──────────────────────────────┐
│ 📍 This passage describes │
│ Serampore, India │
│ View in Sacred Places → │
└──────────────────────────────┘
```

**Place → Reader:** Each Sacred Places entry lists passages with deep links:

```
Referenced in:
 • Autobiography of a Yogi, Chapter 12 — "My years with Sri Yukteswar"
 • Autobiography of a Yogi, Chapter 21 — "We visit Kashmir"
 • Autobiography of a Yogi, Chapter 42 — "Last days with my guru"
```

### Place Links Strategy (Phase 11)

No embedded map library. Each place card links out to external maps services — zero map dependencies, zero tile servers, zero maintenance. See ADR-070.

| Link | Implementation | Rationale |
|------|---------------|-----------|
| **"Get Directions"** | `geo:` URI or Apple/Google Maps link (opens native maps app) | Delegates navigation to the user's preferred app |
| **"Take a Virtual Tour"** | SRF virtual pilgrimage tour URL (opens in new tab). Available for Mother Center, Lake Shrine, Hollywood Temple, Encinitas. Uses `virtual_tour_url` column — only displayed when non-null. | SRF's narrated virtual tours are warmer and richer than Street View; preferred when available. Requires SRF to confirm canonical tour URLs (see CONTEXT.md Q110). |
| **"See This Place"** | Google Maps Street View URL (opens in new tab) | Fallback virtual visit for places without SRF tours. No tracking scripts on the portal. |
| **Visit** | SRF/YSS property page URL | e.g., "Visit → srf.org/lake-shrine" |

**Street View URL format:** `https://www.google.com/maps/@{lat},{lng},3a,75y,0h,90t/data=!3m6!1e1!3m4!1s...` — a plain link, no JavaScript, no API key. Only included for places where Street View coverage exists.

### API

```
GET /api/v1/places
Response:
{
 "places": [
 {
 "id": "uuid",
 "name": "Lake Shrine",
 "slug": "lake-shrine",
 "category": "srf_property",
 "city": "Pacific Palisades",
 "country": "US",
 "latitude": 34.0423,
 "longitude": -118.5248,
 "image_url": "...",
 "passage_count": 3
 },
 ...
 ]
}

GET /api/v1/places/[slug]
Response:
{
 "place": {
 "id": "uuid",
 "name": "Lake Shrine",
 "slug": "lake-shrine",
 "category": "srf_property",
 "description": "A ten-acre sanctuary...",
 "significance": "...",
 "address": "17190 Sunset Blvd",
 "city": "Pacific Palisades",
 "region": "California",
 "country": "US",
 "latitude": 34.0423,
 "longitude": -118.5248,
 "image_url": "...",
 "visiting_info": "Open Tuesday–Saturday, 9am–4:30pm",
 "external_url": "https://lakeshrine.org",
 "virtual_tour_url": "https://yogananda.org/...",
 "passages": [
 {
 "chunk_id": "uuid",
 "content": "The verbatim passage...",
 "book_title": "Autobiography of a Yogi",
 "chapter_title": "...",
 "chapter_number": 49,
 "page_number": 512,
 "context_note": "Yogananda describes the dedication of Lake Shrine",
 "reader_url": "/books/autobiography-of-a-yogi/49#chunk-uuid"
 }
 ]
 }
}
```

### Phasing

| Phase | Scope |
|-------|-------|
| **Phase 8** | Static Sacred Places page with SRF/YSS properties. Text + images + external links + "Get Directions." "Take a Virtual Tour" links for properties with SRF virtual pilgrimage tours (Mother Center, Lake Shrine, Hollywood Temple, Encinitas). Cross-references with Autobiography passages. Convocation cross-link on LA-area SRF property cards: "This site is part of the annual SRF World Convocation pilgrimage. Learn more → convocation.yogananda.org." No maps. |
| **Phase 11** | Add biographical sites (Gorakhpur, Serampore, Puri, Varanasi, Dakshineswar). "See This Place" Street View links on place cards (ADR-070). Reader ↔ Place cross-reference cards. **Indian biographical site note:** Google Street View coverage in rural India (Gorakhpur, Serampore, Ranchi) is patchy or absent. Where Street View is unavailable, commissioned photography or editorial descriptions should be the primary experience, with maps as secondary. Query YSS for photographic archives of these sites (see CONTEXT.md § Open Questions). "Get Directions" for Indian sites serves a pilgrimage context more than a driving-directions context — consider "Visit this place" framing for Indian biographical sites. |
| **Future** | Dynamic center locator (if SRF provides data). Multi-language place descriptions (Phase 10). |

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
| **Contentful** | Processor | Editorial content (no personal data) | EU | 9+ |

EU-US data transfers rely on the EU-US Data Privacy Framework (DPF) where services are certified, with Standard Contractual Clauses (SCCs) as fallback. Review when services are added or changed.

*Section added: 2026-02-21, ADR-099*

---

## DES-025: Accessibility Requirements (Phase 1 Foundation)

Accessibility is not a polish phase — it is a theological requirement. The DELTA Dignity principle demands that every seeker, regardless of ability, can access the teachings. Building on an inaccessible foundation creates exponentially more remediation work later.

(See ADR-003 for full rationale.)

### WCAG 2.1 AA Compliance Target

The portal targets WCAG 2.1 Level AA conformance from Phase 1. Level AAA criteria are adopted where achievable without significant trade-offs (e.g., 7:1 contrast for body text is met by our existing token choices).

### Requirements by Category

#### Vision — Blindness and Screen Readers

| Requirement | Implementation |
|-------------|---------------|
| Semantic HTML | All pages use proper heading hierarchy (`h1`→`h2`→`h3`), `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`. No heading level skips. |
| ARIA landmarks | `role="search"` on search form, `role="banner"` on header, `role="contentinfo"` on footer, `aria-label` on all navigation regions. |
| Image alt text | All guru photographs: full name and title (e.g., "Paramahansa Yogananda, founder of Self-Realization Fellowship"). All nature images: descriptive text. Decorative images: `alt=""`. |
| Search results | Each result is an `<article>` with `aria-label` describing the passage source. "Read in context" links include `aria-label="Read this passage in context in [Book Title], Chapter [N]"`. |
| Today's Wisdom | "Show me another" button has `aria-live="polite"` region so new passage is announced. |
| Quiet Corner timer | Timer state announced via `aria-live="assertive"` when chime sounds. Visual-only chime has text equivalent: "Your meditation time is complete." |
| Book reader | Chapter navigation via `<nav aria-label="Chapter navigation">`. Table of contents as ordered list. Current chapter indicated with `aria-current="page"`. |
| Quote sharing | Share button labeled `aria-label="Copy link to this passage"`. "Link copied" confirmation announced via `aria-live="polite"`. |
| Skip navigation | "Skip to main content" link as first focusable element on every page. |

#### Vision — Low Vision and Magnification

| Requirement | Implementation |
|-------------|---------------|
| Text scaling | All text uses `rem` units. Layout does not break at 200% browser zoom. |
| Minimum text size | Body text: 18px (`--text-base`). No text smaller than 12px (`--text-xs`) and that only for non-essential labels. |
| Reflow | Content reflows to single column at narrow widths. No horizontal scrolling at 320px viewport width (WCAG 1.4.10). |
| Focus indicators | All interactive elements show a visible focus ring: `outline: 2px solid var(--srf-blue); outline-offset: 2px;`. Never `outline: none` without a replacement. |
| Target size | All clickable targets minimum 44×44px (WCAG 2.5.5 Level AAA, adopted as policy). |

#### Vision — Color Blindness

| Requirement | Implementation |
|-------------|---------------|
| Color contrast | All text meets WCAG AA minimums: 4.5:1 for normal text, 3:1 for large text (≥18pt or ≥14pt bold). |
| `--portal-text-muted` | Set to `#595959` (5.3:1 on `--portal-bg`). Corrected from original `#6B6B6B` which failed at 4.1:1. |
| `--srf-gold` | `#DCBD23` must NOT be used as text on light backgrounds (2.4:1 ratio). Use only as borders, backgrounds, or decorative accents. Gold text is permitted only on `--srf-navy` backgrounds (8.2:1). |
| Information not by color alone | Search result relevance, theme distinctions, and all status indicators use shape, text, or icons in addition to color. |

#### Hearing

| Requirement | Implementation |
|-------------|---------------|
| Video captions | YouTube embeds always load with captions enabled (`&cc_load_policy=1` parameter). Rely on YouTube's auto-captions and SRF's uploaded captions. |
| Quiet Corner chime | The timer completion chime has a visual equivalent: a gentle, full-screen pulse animation (`@media (prefers-reduced-motion: no-preference)`) or a text message ("Your time is complete") for users with `prefers-reduced-motion: reduce`. |
| Audio content | Any future audio features (Phase 11 TTS, Phase 12 audio clips) must provide text transcripts. |

#### Motor and Mobility

| Requirement | Implementation |
|-------------|---------------|
| Full keyboard navigation | All interactive elements reachable and operable via keyboard. Logical tab order following visual layout. |
| No keyboard traps | Modal dialogs (if any) trap focus correctly and release on close. No focus traps elsewhere. |
| Quiet Corner timer | Operable entirely by keyboard: arrow keys to select duration, Enter/Space to start, Escape to cancel. |
| No time-dependent interactions | No UI elements that require fast action. The Quiet Corner timer is opt-in and user-controlled. |
| Touch targets | Minimum 44×44px for all touch targets on mobile. Adequate spacing between adjacent targets. |

#### Cognitive and Neurological

| Requirement | Implementation |
|-------------|---------------|
| `prefers-reduced-motion` | All animations and transitions respect `@media (prefers-reduced-motion: reduce)`. When active: no hover animations, no page transitions, timer chime is text-only. |
| `prefers-color-scheme` | Support `dark` scheme in Phase 11 (Reading mode). Phase 1 uses light theme only but CSS architecture supports future dark mode via custom properties. |
| `prefers-contrast` | When `more`, increase border widths and ensure all text exceeds 7:1 contrast. |
| Clear language | All UI copy at 8th-grade reading level or below. Error messages are specific and actionable ("No passages found for this search. Try different words." not "Error 404"). |
| Consistent navigation | Header and footer identical on every page. No layout shifts between pages. |
| Reading mode | Phase 1: clean reader with generous whitespace. Phase 11: adjustable font size, sepia/dark mode. |

#### ADR-072: Cognitive Accessibility — Beyond WCAG Minimums

WCAG 2.1 AA covers minimum cognitive requirements (consistent navigation, error identification, reading level for labels). The portal's mission — serving seekers worldwide, including those in crisis — demands going further.

| Requirement | Implementation |
|-------------|---------------|
| Progressive homepage disclosure | First visit (sessionStorage) shows simplified above-the-fold: Today's Wisdom + search bar + "Or explore a theme" link. Thematic doors, "Seeking..." entries, and videos are below the fold. Return visits show the full homepage. |
| Passage accessibility classification | Passages tagged during ingestion QA: `accessible` (short, clear, affirmation-like), `moderate` (standard prose), `dense` (philosophical, multi-clause). Used internally for pool selection — never displayed. Today's Wisdom favors `accessible`; Quiet Corner uses only `accessible`. |
| Simplified reading mode ("Focus") | Optional toggle in reader header (Phase 2). Reduces reader to: reading column + Next Chapter. Related Teachings panel, keyboard shortcuts, dwell icon, and bookmark icon suppressed. Stored in `localStorage`. |
| Minimal gesture vocabulary for core tasks | The portal's essential experience (read, search, navigate) requires only: click, scroll, type. All other gestures (long-press, hover-wait, keyboard shortcuts) are enhancements. Explicitly tested in QA. |
| Decision fatigue reduction | Non-search pages follow the single-invitation principle (ADR-067): each endpoint invites exactly one step deeper, never more. |

#### ADR-073: Screen Reader Emotional Quality

The warm cream background and gold accents do nothing for blind seekers. The spoken language of ARIA labels is their entire aesthetic. Standard markup produces functional but emotionally flat output. The portal's screen reader voice carries the same warmth as its visual design.

| Element | Standard markup | Portal standard |
|---------|----------------|-----------------|
| Search region | "Search" | "Search the teachings" |
| Today's Wisdom section | "Today's Wisdom" | "Today's Wisdom — a passage from Yogananda's writings" |
| Quiet Corner page | "Main content" | "The Quiet Corner — a space for stillness" |
| Dwell mode enter | "Passage focused" | "Passage focused for contemplation" |
| Dwell mode exit | "Passage unfocused" | "Returned to reading" |
| Search results count | "5 results" | "Five passages found" |
| Theme page | "Theme: Courage" | "Teachings on Courage — passages from across the library" |
| Empty bookmarks | "No items" | "You haven't marked any passages yet" |
| Timer start | "Timer started: 5:00" | "The timer has begun. Five minutes of stillness." |
| Timer end | "Timer complete" | "The time of stillness is complete." |

**Passage citations read naturally.** Screen reader output flows as speech: "'The soul is ever free; it is deathless, birthless...' — from Autobiography of a Yogi, Chapter 26, page 312." Uses `aria-label` on passage containers for natural reading while visual HTML retains its formatting.

**Testing criterion:** Phase 1 screen reader testing (VoiceOver, NVDA, TalkBack) evaluates not only "can the seeker navigate and read" but also "does the experience carry warmth and contemplative quality."

#### Performance as Accessibility (Global Equity Principle)

| Requirement | Implementation |
|-------------|---------------|
| Initial page load | < 100KB JavaScript for the full app shell (compressed). Homepage stricter: < 50KB initial payload (HTML + critical CSS + inline JS) per ADR-006. Target: First Contentful Paint < 1.5s on 3G. |
| Core Web Vitals | LCP < 2.5s, FID < 100ms, CLS < 0.1. |
| Progressive enhancement | Core reading and search functionality works without JavaScript (server-rendered HTML). JS enhances: "Show me another", infinite scroll, timer. |
| Low-bandwidth support | All images lazy-loaded. Responsive images via `srcset`. No autoplay video. Homepage functional as text-only. `/browse` page (DES-047) designed text-first as < 20KB offline-cacheable portal index — the universal fallback for 2G, feature phones, and screen readers. |
| Offline resilience | Phase 1: service worker caches the Quiet Corner page and current reading position. Full PWA in Phase 11 (ADR-012). |

### Accessibility Testing Strategy

| Method | When | Tool |
|--------|------|------|
| Automated audit | Every build (CI) | axe-core via `@axe-core/react` or Lighthouse CI |
| Manual keyboard testing | Every new component | Developer checklist |
| Screen reader testing | Before each phase release | VoiceOver (macOS), NVDA (Windows) |
| Color contrast validation | Design token changes | Chrome DevTools, WebAIM Contrast Checker |
| Real-user testing | Phase 11 | Engage accessibility testers (consider SRF community members with disabilities) |

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

## DES-028: Calendar-Aware Content Surfacing

The `daily_passages` pool already supports optional seasonal weighting. Calendar-aware surfacing extends this with explicit date-to-passage associations, connecting the portal's daily experience to moments that carry spiritual significance.

### Calendar Events

| Category | Examples | Passage Source |
|----------|----------|---------------|
| **Yogananda's life** | Birth anniversary (Jan 5), Mahasamadhi (Mar 7), Arrival in America (Sep 19) | Editorially curated passages about each event |
| **Indian festivals** | Makar Sankranti, Diwali, Janmashtami, Navaratri, Durga Puja | Passages on light/darkness, divine love, Krishna, Divine Mother |
| **Christian (Western)** | Christmas (Dec 25), Easter (Western date) | Yogananda wrote extensively about Christ — rich corpus |
| **Christian (Orthodox)** | Christmas (Jan 7), Easter (Orthodox date) | Same corpus, different calendar dates |
| **Buddhist** | Vesak, Dharma Day | Passages on meditation, consciousness, non-attachment |
| **Interfaith / contemplative** | Jewish High Holy Days (if Yogananda references), Sufi observances | Passages where Yogananda engages with other traditions |
| **Universal observances** | International Day of Peace, World Meditation Day | Passages on peace, meditation |

**Taxonomy note:** The previous four-category scheme (`yogananda_life`, `hindu`, `christian`, `universal`) was reductive — "Hindu" collapsed dozens of distinct traditions (Shaivism, Vaishnavism, Shakta) and excluded observances from traditions the worldview pathways (DES-048) explicitly address. The expanded taxonomy uses `indian_festival` (acknowledging the cultural rather than sectarian framing), distinguishes Western and Orthodox Christian dates, and adds `buddhist` and `interfaith` categories. Whether to include Buddhist, Jewish, or Islamic observances is an editorial scope question for SRF — see CONTEXT.md § Open Questions (Stakeholder).

### Schema

```sql
-- ============================================================
-- CALENDAR EVENTS (date-to-passage associations — Phase 4+)
-- ============================================================
CREATE TABLE calendar_events (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT NOT NULL, -- "Mahasamadhi Anniversary"
 description TEXT, -- brief context
 month INTEGER NOT NULL, -- 1–12
 day INTEGER NOT NULL, -- 1–31
 category TEXT NOT NULL, -- 'yogananda_life', 'indian_festival', 'christian_western', 'christian_orthodox', 'buddhist', 'interfaith', 'universal'
 is_active BOOLEAN NOT NULL DEFAULT true,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE TABLE calendar_event_passages (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 event_id UUID NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
 chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
 position INTEGER, -- optional ordering
 UNIQUE (event_id, chunk_id)
);
```

### Integration

When today matches a calendar event, the homepage "Today's Wisdom" draws from the calendar pool instead of (or in addition to) the general daily pool. The calendar event name appears as a subtle subtitle below the passage: *"On this day in 1920, Yogananda arrived in Boston."*

This aligns with "Signpost, not destination" — the portal meets seekers where they already are (their calendar, their holidays) and connects them to Yogananda's perspective on those moments.

---

## ADR-048: Chunking Strategy

The chunking algorithm is the single most important factor in search retrieval quality. Yogananda's prose style varies dramatically across books, requiring a nuanced strategy.

### Default Chunking (Phases 0–5: narrative, collected talks, short works)

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Unit** | Paragraph (typographic paragraph breaks in source text) | Yogananda's paragraphs correspond to idea boundaries |
| **Token range** | 100–500 tokens (target: 200–300) | Balances specificity with context |
| **Minimum** | 100 tokens — paragraphs below this are merged with the following paragraph | Prevents orphaned fragments |
| **Maximum** | 500 tokens — split at sentence boundaries, keeping both halves above 100 tokens | Prevents imprecise retrieval |
| **Overlap** | None | Paragraph boundaries are natural semantic boundaries; overlap introduces duplicate search results |

**Metadata preserved per chunk:** `book_id`, `chapter_id`, `paragraph_index` (position within chapter), `page_number` (from source), `language`.

### Special Handling

| Content Type | Strategy | Rationale |
|-------------|----------|-----------|
| **Epigraphs and poetry** | Single chunk regardless of length | Splitting a poem mid-stanza destroys meaning |
| **Lists and enumerations** | Single chunk | Yogananda's numbered instructions are semantically atomic |
| **Dialogue and quoted speech** | Single chunk for continuous exchanges; split at speaker changes if >500 tokens | Preserves conversational flow |
| **Aphorisms (*Sayings*, *Scientific Healing Affirmations*)** | One chunk per standalone saying/affirmation regardless of length | These books are already atomically organized |
| **Chapter titles and section headers** | Not chunked separately — prepended to first paragraph as metadata context | Headers are context, not content |

### Verse-Aware Chunking (Phase 6: *Second Coming of Christ*, *God Talks With Arjuna*, *Wine of the Mystic*)

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Unit** | Verse-commentary pair | Maintains the interpretive relationship |
| **Long commentaries** | Split at paragraph boundaries within commentary; each sub-chunk retains verse text as prefix | Verse context travels with every fragment |
| **Cross-reference** | Verse reference stored as structured metadata (e.g., "Bhagavad Gita IV:7") | Enables side-by-side commentary view |

### Per-Language Validation (Phase 10)

English-calibrated chunk sizes (200–300 tokens) may produce different semantic density across scripts. CJK tokenization differs significantly from Latin scripts; Devanagari and Bengali have different word-boundary characteristics. Validate retrieval quality per language before committing to chunk sizes. Adjust token ranges per language if necessary. See ROADMAP deliverable 10.10 for the formal validation requirement.

### Semantic Density Classification

Not all passages carry equal semantic weight per token. Some sentences condense an entire teaching into ten words ("The soul is ever free"). Others are narrative connective tissue ("We traveled by train to Puri"). Semantic density — meaning per word — is a useful signal for multiple portal features.

**Classification:** A `semantic_density` score per chunk, computed during ingestion:

| Score | Label | Description | Example |
|-------|-------|-------------|---------|
| `high` | Aphoristic | Maximum meaning per token. Standalone truth. Dwell-worthy. | *"The soul is ever free; it is deathless, birthless..."* |
| `medium` | Expository | Standard teaching prose. Develops an idea across sentences. | *"When you practice meditation regularly, the mind..."* |
| `low` | Narrative | Story, transition, biographical detail. Context, not teaching. | *"We arrived at the station in the early morning..."* |

**How computed:** Claude Opus (ADR-014 batch tier, "Classifying" category from ADR-005) classifies each chunk during ingestion. Not a numeric score — a three-level enum. Spot-checked by reviewer.

**Column:** `ALTER TABLE book_chunks ADD COLUMN semantic_density TEXT CHECK (semantic_density IN ('high', 'medium', 'low'));`

**Where it's used:**

| Feature | How density helps |
|---------|-------------------|
| Today's Wisdom | Favors `high` density passages — aphorisms, standalone truths |
| Quiet Corner | Uses only `high` density passages — affirmations must stand alone |
| "The Essential Yogananda" | A curated view of the ~200 highest-density passages across the entire library. Not a new page initially — a filter on the `/themes` or `/explore` page. The 200 passages that pack the most teaching per word. |
| Self-Revealing Navigation (DES-015) | The "most evocative passage" selected for the warm-background hint on first visit is the highest-density passage in the chapter's first screen |
| Search result ranking | Density as a tiebreaker when relevance scores are close — prefer aphoristic passages that stand alone over narrative context |

**Phase:** Populated during Phase 3 ingestion (when Claude batch processing is available). Retroactively applied to Phase 0 content.

### ADR-039 ext: Corpus Stylometric Fingerprint

Content Integrity Verification (ADR-039) uses per-chapter content hashes to verify text hasn't been altered. A stylometric fingerprint adds a deeper layer: not just "this text hasn't been changed" but "this text is consistent with the verified patterns of Yogananda's writing."

**What the fingerprint captures:**

| Dimension | Signal |
|-----------|--------|
| **Sentence length distribution** | Mean, median, and standard deviation of words per sentence, per book |
| **Vocabulary frequency** | The characteristic vocabulary profile — frequency of spiritual terms, pronouns, imperative forms |
| **Metaphor recurrence** | Yogananda's distinctive metaphors: ocean/wave, lotus, light/darkness, divine mother. Frequency and distribution. |
| **Rhetorical mode ratio** | Declarative vs. imperative vs. interrogative sentences across the corpus |
| **Passage structure** | Average paragraph length, dialogue-to-exposition ratio, quotation density |

**How computed:** A batch analysis script run once after full corpus ingestion. Outputs a JSON fingerprint file per book and one for the aggregate corpus. Stored alongside content hashes on the `/integrity` page.

**Who this serves:**
- **Content integrity.** In a world of AI-generated spiritual content, the ability to verify "this passage is consistent with Yogananda's writing style" is a unique trust signal.
- **Scholars.** Stylometric analysis is a recognized methodology in textual scholarship. Making the portal's fingerprint public invites scholarly engagement.
- **AI systems consuming portal content (ADR-081).** The fingerprint helps AI systems distinguish authentic Yogananda passages from AI-generated imitations.

**What this is not:** Not a plagiarism detector. Not a tool for verifying external claims about Yogananda's authorship. It is a statistical profile of the authenticated corpus — a reference point, not a judge.

**Phase:** Phase 6+ (requires substantial corpus ingestion). Published on the `/integrity` page alongside content hashes.

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

## DES-030: Daily Email: Verbatim Passage Delivery

(See ADR-091 for full rationale.)

A daily email delivering a single Yogananda passage — verbatim, with citation and a link to read in context. The email is the portal reaching out to meet the seeker, rather than waiting for the seeker to visit.

### Phase 8: Non-Personalized Daily Email

All subscribers receive the same passage each day. The passage is selected from the `daily_passages` pool with optional seasonal weighting.

### Phase 13: Theme-Preference Email

Logged-in subscribers choose preferred themes (Peace, Courage, etc.). The daily email selects from theme-tagged passages matching their preferences.

### Subscriber Data Model

```sql
-- ============================================================
-- EMAIL SUBSCRIBERS (for Daily Wisdom email)
-- ============================================================
CREATE TABLE email_subscribers (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 email TEXT NOT NULL UNIQUE,
 language TEXT NOT NULL DEFAULT 'en',
 is_confirmed BOOLEAN NOT NULL DEFAULT false, -- double opt-in
 is_active BOOLEAN NOT NULL DEFAULT true, -- can unsubscribe
 confirm_token TEXT, -- for double opt-in confirmation
 unsubscribe_token TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
 theme_preferences TEXT[], -- Phase 13: ['peace', 'courage']
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 confirmed_at TIMESTAMPTZ,
 unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_subscribers_active ON email_subscribers(is_active, is_confirmed)
 WHERE is_active = true AND is_confirmed = true;
```

### Email Design

```
┌──────────────────────────────────────────────────┐
│ │
│ ☸ SRF Teaching Portal │
│ │
│ ──────────────────────────────────────────── │
│ │
│ Today's Wisdom │
│ │
│ "Have courage. Whatever you are going through │
│ will pass. Trust in God's plan for you. │
│ Through your difficulties you will gain │
│ the strength you need." │
│ │
│ — Where There Is Light, p. 42 │
│ │
│ [ Read in context → ] │
│ │
│ ──────────────────────────────────────────── │
│ │
│ The teachings of Paramahansa Yogananda, │
│ made freely available to seekers worldwide. │
│ │
│ yogananda.org · SRF Teaching Portal │
│ │
│ Unsubscribe │
│ │
└──────────────────────────────────────────────────┘
```

**Design constraints:**
- Plain HTML email (no JavaScript, no web fonts — fallback to Georgia/serif)
- **Non-Latin script support (Phase 10):** HTML email font rendering is unreliable across clients (Gmail, Apple Mail, Outlook). Non-Latin scripts (CJK, Devanagari, Bengali) must use system font stacks, not web fonts. Define per-locale email font stacks and test across the top 5 email clients per target market. Passage text must render correctly in the subscriber's language without depending on downloadable fonts.
- Warm cream background (`#FAF8F5`), navy text (`#1A2744`)
- Single passage, single CTA ("Read in context"), no other links except footer
- Unsubscribe link uses `unsubscribe_token` — one-click, no login required
- `List-Unsubscribe` header for email client support
- No tracking pixels. No open-rate tracking. No click tracking.

### API Routes

```
POST /api/v1/email/subscribe
 Body: { "email": "seeker@example.com", "language": "en" }
 → Sends double opt-in confirmation email
 → Returns { "status": "confirmation_sent" }

GET /api/v1/email/confirm?token=xxx
 → Sets is_confirmed = true, confirmed_at = now
 → Redirects to portal with "You're subscribed" message

GET /api/v1/email/unsubscribe?token=xxx
 → Sets is_active = false, unsubscribed_at = now
 → Shows "You've been unsubscribed" page with re-subscribe option
```

### Email Sending Infrastructure

| Component | Service | Notes |
|-----------|---------|-------|
| Email delivery | Resend (free tier: 100 emails/day) or AWS SES (~$0.10 per 1,000) | Resend for early Phase 8; SES for scale |
| Cron trigger | Vercel Cron Jobs (free tier: 1/day) or AWS EventBridge | Daily at 5:00 AM UTC |
| Template | Server-rendered HTML string (no template engine needed) | Keep simple — one passage, one link |
| Daily passage selection | Same logic as `/api/v1/daily-passage` but with a fixed daily seed | All subscribers receive the same passage on the same day |

**Daily seed logic:** Use the current date as a deterministic seed to select the day's passage, ensuring all emails contain the same quote and the portal homepage can display "Today's email featured this passage" if desired.

### Email Data Retention and Erasure (ADR-099)

**Lawful basis:** Consent (GDPR Art. 6(1)(a)) via double opt-in. Stated on the subscription form and in `/privacy`.

**Retention policy:**
- **Active subscribers:** Email retained for the duration of the subscription.
- **Unsubscribed (soft-deleted):** `is_active = false`, `unsubscribed_at` set. Row automatically purged 90 days after `unsubscribed_at`.
- **Bounce/failure records:** Retained for 30 days for operational health, then purged.

**Right to erasure:** In addition to the existing unsubscribe endpoint, a hard-deletion endpoint removes the subscriber row entirely:

```
DELETE /api/v1/email/subscriber?token=xxx
 → Deletes row from email_subscribers
 → Shows "Your data has been removed" confirmation
```

The unsubscribe confirmation page offers both options: "Stay unsubscribed (data removed in 90 days)" and "Remove my data now."

**Minimum age:** The subscription form includes the statement: "You must be 16 or older to subscribe." (GDPR Art. 8; adjusted per member state where applicable.)

*Section added: 2026-02-21, ADR-099*

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

## DES-031: MCP Server Strategy

MCP (Model Context Protocol) serves three tiers of AI consumer, all wrapping the same `/lib/services/` functions. MCP tools are the AI-native complement to HTTP API routes — one service layer, two access protocols. (ADR-097 governs third-party MCP servers; ADR-101 governs the portal's own MCP tiers.)

### Third-Party MCP Servers (ADR-097)

| MCP Server | Use Case | Availability |
|------------|----------|-------------|
| **Neon MCP** | Database schema management, SQL execution, migrations during development | Available now |
| **Sentry MCP** | Error investigation — stack traces, breadcrumbs, affected routes | Phase 0 |
| **Contentful MCP** | Content model design, entry management during development | Phase 9+ (evaluate) |

See ADR-097 for the full evaluation framework (essential, high-value, evaluate, not recommended).

### SRF Corpus MCP — Three-Tier Architecture (ADR-101)

```
Seeker (browser) → API Route → Service Layer → Neon
AI agent (MCP)   → MCP Tool  → Service Layer → Neon
Claude Code (dev) → MCP Tool → Service Layer → Neon
```

The service layer doesn't care who's calling. The access protocol and metadata envelope differ by tier.

#### Tier 1: Development (Phase 0)

Unrestricted access for Claude Code during portal development. Also used for iterating on guide pathway generation prompts (DES-035 § Worldview Guide Pathway Generation, DES-048 § Worldview Pathway Catalog) — developer tests "generate a guide pathway for Buddhist meditators" interactively, refining prompt templates before deploying to the admin portal batch workflow.

| Tool | Service Function | Purpose |
|---|---|---|
| `search_corpus(query, limit)` | `search.ts` | Find passages by semantic query |
| `search_by_theme(slug)` | `themes.ts` | Theme-based retrieval |
| `search_references(source_name)` | `references.ts` | External reference lookup |
| `get_vocabulary_bridge(category)` | reads `spiritual-terms.json` | Terminology mapping |
| `get_book_metadata(slug)` | `books.ts` | Book information |
| `get_theme_metadata(slug)` | `themes.ts` | Theme information |

#### Tier 2: Internal (Phase 4+)

Authenticated service-to-service access for editorial AI agents, batch pipelines, admin portal AI features, and cross-property consumers (SRF app, Retool). Adds tools that DES-035 AI workflows need for corpus-grounded proposals. Authentication via API key or IAM role (not Auth0).

| Tool | Service Function | Purpose | Phase |
|---|---|---|---|
| `get_chunk_with_context(chunk_id, window)` | `chunks.ts` | Passage + N surrounding chunks (for QA, classification, review) | 4 |
| `get_similar_passages(chunk_id, threshold, limit)` | `search.ts` | Embedding-based nearest neighbors (distinct from theme search) | 4 |
| `get_glossary_terms_in_passage(chunk_id)` | `glossary.ts` | Glossary terms in a passage with definitions | 4 |
| `get_content_coverage(theme_slug)` | `themes.ts` | Passage count, book distribution, tone distribution per theme | 4 |
| `verify_citation(book_slug, chapter, page)` | `citations.ts` | Confirm a quote exists in the corpus | 4 |
| `get_pending_reviews(queue_type, limit)` | `queue.ts` | Items awaiting human review in a specific queue | 4 |
| `get_daily_passage(language, exclude_id)` | `daily.ts` | Random passage from curated pool | 4 |
| `get_cross_book_connections(chunk_id)` | `relations.ts` | Related passages from other books | 5 |
| `get_person_context(person_slug)` | `people.ts` | Biography, lineage position, key mentioning passages | 5 |
| `get_graph_neighborhood(node_id, depth, types[])` | `graph.ts` | Subgraph around any node, filtered by node/edge type | 6 |
| `get_search_trends(period, min_count)` | `analytics.ts` | Anonymized aggregated query themes (DELTA-compliant) | 6 |
| `find_concept_path(source_slug, target_slug)` | `graph.ts` | Shortest ontological path between two concepts | 7 |
| `get_passage_translations(canonical_chunk_id)` | `translations.ts` | All language variants of a passage | 10 |

**Internal MCP use cases by consumer:**

| Consumer | Primary Tools | Phase |
|---|---|---|
| Theme tag proposal AI | `get_similar_passages`, `get_content_coverage`, `get_graph_neighborhood` | 4, 6 |
| Guide pathway generation AI | `search_corpus`, `search_references`, `get_vocabulary_bridge`, `find_concept_path` | 4, 7 |
| Ingestion QA AI | `get_chunk_with_context`, `verify_citation` | 4 |
| Translation review AI | `get_passage_translations`, `get_glossary_terms_in_passage` | 10 |
| Reading thread drafting AI | `get_cross_book_connections`, `get_graph_neighborhood`, `find_concept_path` | 5, 6, 7 |
| Social media caption AI | `search_corpus`, `get_book_metadata`, `get_theme_metadata` | 8 |
| Impact narrative AI | `get_search_trends`, `get_graph_neighborhood` | 6 |
| SRF mobile app | `search_corpus`, `get_daily_passage`, `get_graph_neighborhood`, `get_person_context` | TBD (stakeholder) |
| Admin portal AI features | `get_pending_reviews`, `get_content_coverage`, `get_search_trends` | 4, 6 |

#### Tier 3: External (Phase 8+)

Rate-limited access for third-party AI assistants (ChatGPT, Claude, Gemini, custom agents). Exposes a content-serving subset (no admin/editorial tools). Every response wrapped in fidelity metadata.

**Available tools:** `search_corpus`, `search_by_theme`, `get_book_metadata`, `get_theme_metadata`, `get_glossary_terms_in_passage`, `get_graph_neighborhood`, `find_concept_path`, `get_person_context`, `get_daily_passage`, `verify_citation`.

**Not available externally:** `get_pending_reviews`, `get_search_trends`, `get_content_coverage`, `get_similar_passages`, `get_chunk_with_context`, `get_passage_translations`.

**Fidelity metadata envelope:**

```jsonc
{
  "passages": [
    {
      "text": "Verbatim passage text...",
      "citation": {
        "book": "Autobiography of a Yogi",
        "chapter": 12,
        "chapter_title": "Years in My Master's Hermitage",
        "page": 142
      },
      "context_url": "/books/autobiography-of-a-yogi/12#chunk-uuid",
      "themes": ["Peace", "Meditation"]
    }
  ],
  "fidelity": {
    "source": "Self-Realization Fellowship",
    "portal": "teachings.yogananda.org",
    "presentation": "verbatim_only",
    "paraphrase_permitted": false,
    "attribution_required": true,
    "attribution_format": "{book}, Chapter {chapter}, p. {page}",
    "context_url_purpose": "Full chapter context — present to user alongside quote"
  }
}
```

The `fidelity` object is a moral signal, not a technical enforcement — analogous to Creative Commons metadata. The `context_url` ensures seekers always have one click to the full, unmediated portal.

**Rate limiting:** Same Cloudflare + application-level tiering as HTTP API (ADR-023). Registered consumers (fidelity contract acknowledged) receive higher limits. Unregistered consumers receive anonymous web crawler limits (ADR-081).

**Access governance:** Stakeholder decision (CONTEXT.md). Recommendation: registered access — clients receive an API key upon acknowledging the fidelity contract, balancing reach with accountability.

### Knowledge Graph as MCP Surface

The Knowledge Graph (ADR-062) answers structural queries that text search cannot:

| Query Type | Tool | What It Returns |
|---|---|---|
| "How does meditation relate to concentration?" | `get_graph_neighborhood("meditation", 2, ["theme", "concept"])` | Structural relationships between concepts |
| "What is the path from pranayama to samadhi?" | `find_concept_path("pranayama", "samadhi")` | Ontological steps with a representative passage at each |
| "Who is Lahiri Mahasaya?" | `get_person_context("lahiri-mahasaya")` | Biography, lineage position, key passages |
| "What themes cluster around grief?" | `get_graph_neighborhood("grief", 2, ["theme"])` | Related themes and their connection types |

These structural queries are the portal's unique offering via MCP — no other digital representation of Yogananda's teachings encodes relational structure. The graph API (`/api/v1/graph/subgraph`) serves the web client; MCP tools serve AI consumers needing the same relational data in a different access pattern.

### MCP Tool Interface Contract

All MCP tools across all three tiers follow a shared interface contract. This ensures consistency for AI consumers that may graduate from Tier 1 (development) to Tier 2 (internal) or encounter Tier 3 (external) — the tool naming and response shape remain predictable.

**Naming convention:** `snake_case` verbs: `search_corpus`, `get_book_metadata`, `verify_citation`. Prefix indicates action: `search_*` (query-based retrieval), `get_*` (ID-based lookup), `verify_*` (boolean validation), `find_*` (graph traversal).

**Parameter naming:** `snake_case`, matching the API response convention (ADR-110). Common parameters: `language` (ISO 639-1, default `'en'`), `limit` (positive integer), `chunk_id` / `book_slug` / `theme_slug` (resource identifier matching the type conventions in ADR-110).

**Response shape:** MCP tools return the same shape as their corresponding HTTP API endpoints (when one exists), plus tier-specific metadata:

```jsonc
{
  // For Tier 3 only: fidelity metadata envelope wraps the response
  "fidelity": { ... },
  // The response body matches the HTTP API equivalent
  "data": [...],
  "meta": { ... }
}
```

Tier 1 and Tier 2 tools return raw service-layer output (matching the HTTP API shape). Tier 3 tools wrap the output in the fidelity envelope. This means a tool like `search_corpus` returns the same `data` array as `GET /api/v1/search`, with identical field names and structure.

**Error shape:** MCP tools return errors using the same `error` / `message` / `request_id` structure as the HTTP API error contract (DES-019). The compassionate error messaging applies equally — an AI consumer's end user may see these messages.

### MCP Service File

`/lib/mcp/` directory:
- `server.ts` — MCP server setup, tier routing, authentication
- `tools/corpus.ts` — search, theme, reference, vocabulary bridge tools
- `tools/editorial.ts` — internal editorial tools (Tier 2 only)
- `tools/graph.ts` — Knowledge Graph traversal tools
- `tools/people.ts` — People Library tools
- `tools/fidelity.ts` — fidelity metadata envelope wrapper (Tier 3)

All tools delegate to `/lib/services/` — zero business logic in the MCP layer.

---

## DES-032: Content Management Strategy

Content flows through a five-layer staff experience architecture (ADR-082). Each layer serves a distinct audience with appropriate tooling:

| Layer | Tool | Who | What |
|---|---|---|---|
| **Content Authoring** | Contentful | Content editors | Creating/editing book text, editorial threads, theme descriptions, calendar events |
| **Contextual Bridges** | Contentful Custom Apps | Content editors (in Contentful) | Sidebar panels showing review status, related data, previews |
| **Editorial Review** | Admin Portal (`/admin`) | Monastic editors, theological reviewers, social media staff, translation reviewers | All review/approval/curation workflows where AI has proposed and humans must decide |
| **Technical Operations** | Retool | AE developers | Search analytics, pipeline monitoring, bulk data operations |
| **Impact Reporting** | Impact Dashboard (`/admin/impact`) | Leadership, philanthropist's foundation | Global reach, content growth, search themes — narrative quality, read-only |

### Content Flow by Type

| Content Type | Phases 0–2 | Phases 3–8 | Production (Phase 9+) | Why |
|---|---|---|---|---|
| **Book text, chapters** | PDF ingestion script → Neon | Same | Contentful (editorial source of truth) → webhook sync → Neon | Editorial workflow with drafts, review, publish, locale variants |
| **Theme tag review** | — | Admin portal review queue | Admin portal (bridged via Contentful sidebar) | AI proposes, humans approve — needs focused review UI |
| **Daily passage curation** | Script-populated in Neon | Admin portal curation view | Contentful entries → sync → Neon + admin portal for curation | Content editors curate via the tool that best fits the task |
| **Calendar events** | — | Admin portal management | Contentful entries + admin portal for passage associations | Event definitions in Contentful; passage associations in admin portal |
| **Social media assets** | — | Admin portal asset review | Admin portal asset review | Visual review + caption editing + per-platform download |
| **Translation review** | — | — | Admin portal side-by-side review | Non-technical reviewers (possibly volunteers) need a focused UI, not Git |
| **Sacred Places** | — | Static MDX or hardcoded | Contentful entries → sync → Neon | Editorial content with images |
| **Search analytics** | — | Retool dashboard | Retool dashboard | Data-heavy, technical audience |
| **Pipeline monitoring** | — | Retool dashboard | Retool dashboard | Technical operations |
| **Impact reporting** | — | — | Admin portal `/admin/impact` | Beautiful, narrative, read-only — for leadership |

### Contentful → Neon Sync

The webhook sync service (Phase 9, deliverable 9.3) is the primary coupling point. When Contentful's content model evolves, the sync function must be updated. This is the main maintenance surface in production.

```
Contentful (editorial) ──webhook──→ Serverless function ──→ Neon (search index)
 │
 ├─ Extract text
 ├─ Chunk into paragraphs
 ├─ Generate embeddings
 └─ Upsert into book_chunks
```

---

## ADR-082: Staff Experience Architecture

The portal's "human review as mandatory gate" principle creates significant staff-facing workflow requirements. Theme tags, tone classifications, accessibility ratings, calendar associations, translation drafts, social media assets, and ingestion QA flags all require human approval. The staff experience is a primary product concern — the speed and quality of editorial review directly determines how quickly new content reaches seekers.

### Guiding Principle

**Staff should think about the teachings, not the technology.** The same calm technology philosophy that governs the seeker experience applies to the staff experience. A monastic editor reviewing whether a passage about inner peace is correctly tagged should work in an environment that respects the material — not a generic data grid.

### Staff & Organizational Personas

The portal is maintained by a broader organizational ecosystem than just "staff." Each persona has different schedules, technical comfort, and workflow needs. The admin portal, editorial tools, and operational procedures must serve all of them.

#### Core Staff Personas

| Persona | Schedule | Technical Comfort | Primary Tool | Key Need |
|---|---|---|---|---|
| **Monastic content editor** | 2–3 hour windows between meditation and services | Variable | Admin portal + Contentful | Session resume; complete meaningful work in 30 minutes; warm UI that feels like service, not administration |
| **Theological reviewer** | Periodic, high-stakes | Low to moderate | Admin portal (review queue only) | "Preview as seeker" with full chapter context; ability to defer decisions without blocking the queue; persistent theological notes across sessions |
| **AE social media staff** | Daily, 20–30 min | Moderate | Admin portal (asset inbox) | Weekly lookahead with batch-approve; platform-specific captions; assets ready to post, not raw material to assemble |
| **Translation reviewer** | Batch sessions, 40–100 strings | Moderate (may be volunteer) | Admin portal (translation review) | Screenshot context for each string; tone guidance; ability to suggest alternatives without outright rejecting |
| **AE developer** | As needed | High | Retool + Neon console | Clear runbooks; Sentry/New Relic dashboards separated from other SRF properties; infrastructure-as-code matching SRF Terraform patterns |
| **Leadership (monastic)** | Monthly or quarterly | Low | Impact dashboard (read-only) | Ability to express editorial priorities ("emphasize courage this quarter") without entering the admin system; pre-formatted reports for the philanthropist's foundation |

#### Operational Personas (Not Yet Staffed)

| Persona | Schedule | Technical Comfort | Primary Tool | Key Need |
|---|---|---|---|---|
| **Portal coordinator** | Regular | Moderate | Admin portal (pipeline dashboard) | Cross-queue visibility: content pipeline status (books in queue/ingestion/QA/published), editorial queue health (backlog depth across all review types), VLD activity, upcoming calendar events. Not Jira — purpose-built for editorial state. |
| **Book ingestion operator** | Per-book (1–2 days per cycle) | Moderate to high | Ingestion CLI + admin portal | Guided ingestion workflow: upload source → automated processing → flagged review → human QA → approve-and-publish. Side-by-side source PDF and extracted text. Per-chapter re-run capability. |
| **VLD coordinator** | Weekly | Moderate | Admin portal (VLD section) | Creates curation briefs, monitors submission quality, manages trusted submitter status, communicates with VLD members. May be the portal coordinator or a separate role. |

#### Volunteer Personas

| Persona | Schedule | Technical Comfort | Primary Tool | Key Need |
|---|---|---|---|---|
| **VLD curation volunteer** | Flexible, service-oriented | Variable (possibly low) | Admin portal (VLD dashboard) + Study Workspace | Clear, self-contained tasks with completion criteria; session save-and-resume; warm onboarding framing work as devotional service; constructive feedback on submissions |
| **VLD translation volunteer** | Batch sessions | Variable | Admin portal (translation review) | Embedded glossary sidebar; "I'm not sure" flag without blocking progress; pairing with experienced reviewer for first batch |
| **VLD theme tag reviewer** | Short sessions | Variable | Admin portal (theme review) | Training examples for each theme; side-by-side passage + theme descriptions; "escalate to monastic reviewer" option |
| **VLD feedback triager** | Flexible | Variable | Admin portal (feedback queue) | Pre-categorized feedback with AI reasoning; confirm/reclassify; flag items for staff |
| **VLD content QA reviewer** | Per-assignment | Moderate | Admin portal (QA review) | Compare portal text against physical book; report discrepancies. Requires access to physical books (many VLD members own them). |

#### External Personas

| Persona | Schedule | Technical Comfort | Primary Tool | Key Need |
|---|---|---|---|---|
| **Philanthropist's foundation** | Quarterly or annually | Low | Impact report (PDF/web) | Pre-formatted, narrative impact report they can share with their board. Generated from Impact Dashboard data, curated into a story. No work required. |
| **Study circle leader** | Weekly preparation | Moderate | Study Workspace + community collections | Find → collect → arrange → share → present. Power user of community collections and shared links. Weekly satsanga preparation is the primary use case. |

**Study circle leader — expanded profile:** This is the portal's most demanding external power user and the primary driver for Phase 12 (Study Workspace) and Phase 14 (Community Curation) features. The weekly satsanga preparation workflow is: (1) identify a theme or topic for the week, (2) search and browse for relevant passages across multiple books, (3) collect passages into an ordered sequence that builds understanding, (4) add brief contextual notes for group discussion, (5) share the collection with group members via link, (6) present during satsanga using Presentation mode (ADR-006 §5). Until Phase 12, this seeker uses browser bookmarks, manual note-taking, and shared passage links — functional but friction-heavy. The study circle leader also serves as an informal portal evangelist, introducing the portal to group members who may become daily visitors, devoted practitioners, or Quiet Corner seekers. In Indian and Latin American contexts, the study circle leader may be the primary interface between the portal and seekers who are less digitally literate — they project the portal on a shared screen or read passages aloud. Presentation mode's early delivery (consider pulling to Phase 2–3 per CONTEXT.md technical open question) directly serves this population.

**Staffing open question:** Several operational personas (portal coordinator, book ingestion operator, VLD coordinator) are not yet assigned. SRF must determine whether these are monastic roles, AE team roles, or dedicated positions before Phase 4 begins. See CONTEXT.md § Open Questions (Stakeholder).

### The Editorial Review Portal (`/admin`)

A custom-built section of the Next.js application, protected by Auth0, built with the portal's own design system.

#### Auth0 Roles

| Role | Access |
|---|---|
| `editor` | Theme tag review, daily passage curation, calendar event management, content preview, ingestion QA |
| `reviewer` | Theological review queue (final approval tier) |
| `translator:{locale}` | Translation review for a specific language only |
| `social` | Social media asset review and download |
| `updates` | Portal update note review and publication (ADR-105) |
| `admin` | All editorial functions + user management |
| `leadership` | Impact dashboard (read-only) |

#### Editorial Home Screen

When a staff member logs in, they see a personalized summary filtered by their role:

```
┌─────────────────────────────────────────────────────────────┐
│ SRF Teaching Portal — Editorial Home │
│ │
│ Good morning. Here's what needs your attention: │
│ │
│ ┌────────────────────────┐ ┌────────────────────────────┐ │
│ │ Theme Tags │ │ Daily Passages │ │
│ │ 23 awaiting review │ │ Pool: 412 passages │ │
│ │ ○ Peace (8 new) │ │ Next 7 days: ✓ │ │
│ │ ○ Courage (6 new) │ │ │ │
│ │ ○ Healing (9 new) │ │ │ │
│ └────────────────────────┘ └────────────────────────────┘ │
│ │
│ ┌────────────────────────┐ ┌────────────────────────────┐ │
│ │ QA Flags │ │ Calendar Events │ │
│ │ 0 pending │ │ Next: Mahasamadhi (Mar 7) │ │
│ │ All clear ✓ │ │ 12 passages linked │ │
│ └────────────────────────┘ └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Review Workflows

**Theme tag review** (Phase 4):
```
┌─────────────────────────────────────────────────────────────┐
│ Theme: Peace — Review Candidates (8 of 23) │
│ │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ "Be as simple as you can be; you will be astonished ││
│ │ to see how uncomplicated and happy your life can ││
│ │ become." ││
│ │ ││
│ │ — Autobiography of a Yogi, Ch. 12, p. 118 ││
│ │ ││
│ │ Similarity: 0.72 │ AI confidence: High ││
│ │ ││
│ │ [a] Approve [r] Reject [▾] Adjust relevance ││
│ └─────────────────────────────────────────────────────────┘│
│ │
│ Progress: ████████░░░░░░░░ 8/23 reviewed │
│ Session: resumed from yesterday │
└─────────────────────────────────────────────────────────────┘
```

Keyboard-driven: `a` approve, `r` reject, `→` next, `←` previous. Session position saved — resume where you left off tomorrow.

**Social media asset review** (Phase 8):
```
┌─────────────────────────────────────────────────────────────┐
│ Tomorrow's Passage — Review │
│ │
│ ┌──────────┐ ┌──────────┐ ┌────────────────────┐ │
│ │ │ │ │ │ │ │
│ │ 1:1 │ │ 9:16 │ │ 16:9 │ │
│ │ Square │ │ Story │ │ Landscape │ │
│ │ │ │ │ │ │ │
│ └──────────┘ └──────────┘ └────────────────────┘ │
│ │
│ Caption: │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ "Be as simple as you can be..." ││
│ │ — Paramahansa Yogananda, Autobiography of a Yogi ││
│ │ Read more: teachings.yogananda.org/passage/abc123 ││
│ │ [Edit] ││
│ └─────────────────────────────────────────────────────────┘│
│ │
│ Download: [Instagram] [Facebook] [Story] [Landscape] │
│ Mark posted: □ Instagram □ Facebook □ Twitter │
└─────────────────────────────────────────────────────────────┘
```

**Translation review** (Phase 10):
```
┌─────────────────────────────────────────────────────────────┐
│ German Translation Review — 14 strings remaining │
│ │
│ ┌──────────────────────┬──────────────────────────────────┐│
│ │ English (source) │ German (AI draft) ││
│ ├──────────────────────┼──────────────────────────────────┤│
│ │ "What are you │ "Wonach suchen Sie?" ││
│ │ seeking?" │ ││
│ │ │ Context: Search bar placeholder ││
│ │ │ ││
│ │ │ [✓ Approve] [Edit] [Flag] ││
│ └──────────────────────┴──────────────────────────────────┘│
│ │
│ Progress: ████████████░░░░ 26/40 reviewed │
└─────────────────────────────────────────────────────────────┘
```

**Portal update review** (Phase 4):
```
┌─────────────────────────────────────────────────────────────┐
│ Portal Update — Review                     AI-drafted       │
│                                                             │
│ Season: Spring 2027                                         │
│ Triggered by: deploy v3.2.0 (2027-04-15)                   │
│                                                             │
│ Title:                                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ The Library has grown                        [Edit]     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Summary:                                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Three new books join the collection: Man's Eternal      │ │
│ │ Quest, The Divine Romance, and Journey to               │ │
│ │ Self-Realization.                             [Edit]     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Category: new_content                                       │
│                                                             │
│ [✓ Approve & Publish] [Edit] [Discard]                      │
└─────────────────────────────────────────────────────────────┘
```

### Contentful Custom Apps (Sidebar Panels)

Lightweight React panels that appear in Contentful's entry editor sidebar, keeping editors contextually aware:

| Panel | Appears On | Shows |
|---|---|---|
| **Theme tags** | TextBlock entries | Current tags for this passage, pending review count, link to review queue |
| **Thread preview** | Editorial thread entries | Live reading flow preview — passages in sequence with transition notes |
| **Calendar passages** | Calendar event entries | Associated passages with relevance context, link to manage associations |
| **Topic readiness** | Teaching topic entries | Passage count, review status, publication readiness indicator |

### Notification Strategy

| Channel | Audience | Frequency | Content |
|---|---|---|---|
| **Email digest** | All editorial staff | Daily (configurable) | "12 new theme tag candidates, 3 QA flags, next week's passages ready for review." Direct links to review queues. |
| **Portal badges** | Staff who visit `/admin` | On each login | Count badges on editorial home screen |
| **No notification** | Leadership | Pull-based | They visit `/admin/impact` when they choose |

Email digest is the primary channel. Generated by a scheduled serverless function querying review queue counts from Neon.

### Technical Implementation

The admin portal is **not a separate application.** It is a route group within the existing Next.js app:

```
/app/
 admin/
 layout.tsx ← Auth0 protection, admin nav, calm design shell
 page.tsx ← Editorial home (role-filtered summary)
 themes/
 [slug]/page.tsx ← Theme tag review queue
 passages/
 page.tsx ← Daily passage curation
 calendar/
 page.tsx ← Calendar event management
 social/
 page.tsx ← Social media asset review
 translations/
 [locale]/page.tsx ← Translation review (per language)
 qa/
 page.tsx ← Ingestion QA review
 impact/
 page.tsx ← Leadership impact dashboard
 preview/
 themes/[slug]/page.tsx ← "Preview as seeker" for themes
 passages/page.tsx ← Preview daily passage selection
```

Business logic lives in `/lib/services/` (consistent with ADR-011). The admin routes are thin presentation layers over:
- `/lib/services/review.ts` — review queue queries, approval/rejection
- `/lib/services/curation.ts` — daily passage selection, calendar management
- `/lib/services/social.ts` — asset generation, caption management
- `/lib/services/updates.ts` — portal update draft generation, review, publication (ADR-105)
- `/lib/services/translation.ts` — translation review, locale progress tracking
- `/lib/services/impact.ts` — aggregated metrics for leadership dashboard
- `/lib/services/collections.ts` — community collections, visibility management, submission pipeline (ADR-086)
- `/lib/services/graph.ts` — knowledge graph queries, subgraph extraction, cluster resolution (ADR-062)
- `/lib/mcp/` — MCP server (three-tier corpus access layer, ADR-101): `server.ts` (tier routing, auth), `tools/corpus.ts`, `tools/editorial.ts`, `tools/graph.ts`, `tools/people.ts`, `tools/fidelity.ts` (external envelope wrapper). All tools delegate to `/lib/services/` — zero business logic in the MCP layer.

### Phase Delivery

| Phase | Staff Experience Work |
|---|---|
| **Phase 4** | Minimal admin portal: editorial home, theme tag review, daily passage curation, calendar event management, content preview, tone/accessibility spot-check, portal update review (ADR-105). Auth0 integration. Email digest. |
| **Phase 8** | Social media asset review added. |
| **Phase 9** | Contentful Custom Apps (sidebar panels). Full editorial workflow bridging Contentful authoring and portal review queues. |
| **Phase 10** | Translation review UI. Volunteer reviewer access with scoped permissions (`translator:{locale}`). |
| **Phase 10+** | Impact dashboard for leadership. |
| **Phase 14** | VLD dashboard, curation briefs, trusted submitter workflow. VLD expansion to translation, theme tag, feedback, and QA tiers (as VLD capacity and SRF governance allow). |

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

**Phase 0–8:** PDF → marker → chunk → embed → Claude QA flags → human review → publish.
**Phase 9+:** Contentful authoring → webhook sync → Neon. Same QA and review steps apply.

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

- **Phases 0–8:** `books.is_published` and `chapters.is_published` boolean flags. Unpublished content is visible in the admin portal ("preview as seeker") but excluded from public search and reader routes.
- **Phase 9+:** Contentful draft/published workflow provides this natively. The webhook sync only processes published entries.

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
4. Correction applied in Neon (Phases 0–8) or Contentful (Phase 9+)
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

## DES-039: Infrastructure and Deployment

All infrastructure is defined as code per SRF engineering standards. See ADR-016.

### Terraform Module Layout

```
/terraform/
 main.tf — Provider configuration, backend
 variables.tf — Input variables (project name, environment)
 outputs.tf — Connection strings, URLs, DSNs

 /modules/
 /neon/ — Neon project, database, roles, pgvector
 /vercel/ — Vercel project, env vars, domains
 /sentry/ — Sentry project, DSN, alert rules
 /cloudflare/ — DNS records, WAF rules, bot protection
 /newrelic/ — Synthetics monitors, alert policies

 /environments/
 dev.tfvars — Phase 1 (only active environment)
 qa.tfvars — Phase 9+
 stg.tfvars — Phase 9+
 prod.tfvars — Phase 9+
```

### Boundary: Terraform vs. Application Code

| Managed by Terraform | Managed by Application Code |
|---------------------|-----------------------------|
| Service creation (Neon project, Vercel project, Sentry project) | Database schema (dbmate SQL migrations) |
| Environment variables, secrets | `vercel.json`, `sentry.client.config.ts`, `newrelic.js` |
| DNS records, domain bindings | Application routing (`next.config.js`) |
| Alert rules, Synthetics monitors | Structured logging (`lib/logger.ts`) |
| Auth provider (Phase 13+, if needed) | Auth SDK integration in Next.js |
| Repo settings, branch protection | CI/CD workflow files |

### Source Control and CI/CD

| Phase | SCM | CI/CD | Terraform State |
|-------|-----|-------|-----------------|
| **Phases 0–8** | GitHub | GitHub Actions | Terraform Cloud (free tier) |
| **Phase 9+** | GitLab (SRF IDP) | GitLab CI/CD | GitLab Terraform backend |

#### Phase 1 CI/CD Pipeline (GitHub Actions)

```
On every PR:
 1. Lint + type check
 2. Vitest (unit/integration)
 3. axe-core (accessibility)
 4. next build
 5. Playwright (E2E)
 6. Lighthouse CI (performance)
 7. Search quality suite
 8. terraform plan (if /terraform/ changed)

On merge to main:
 1. All of the above
 2. terraform apply (dev)
 3. Vercel production deployment
```

Infrastructure changes (`/terraform/**`) trigger `terraform plan` on PR and `terraform apply` on merge. Application changes trigger the full test suite and Vercel deployment. Both can trigger in the same PR.

### Environment Variables

All environment variables documented in `.env.example` and provisioned via Terraform:

```bash
# .env.example — Local development reference
# These are set by Terraform in deployed environments.

# Neon
DATABASE_URL= # Terraform output: module.neon.connection_string
NEON_PROJECT_ID= # Terraform output: module.neon.project_id

# AI
ANTHROPIC_API_KEY= # Set manually (secret)
OPENAI_API_KEY= # Set manually (secret)

# Sentry
NEXT_PUBLIC_SENTRY_DSN= # Terraform output: module.sentry.dsn
SENTRY_AUTH_TOKEN= # Set manually (secret)

# Auth (Phase 13+, if needed — no auth variables required for Phases 0–12)

# YouTube
YOUTUBE_API_KEY= # Set manually (secret)

# Email (Phase 8)
RESEND_API_KEY= # Set manually (secret)

# Amplitude (Phase 6)
NEXT_PUBLIC_AMPLITUDE_KEY= # Terraform output: module.amplitude.api_key

# New Relic (Phase 6)
NEW_RELIC_LICENSE_KEY= # Set manually (secret)
```

Secrets (API keys, tokens) are never in Terraform state. They are set via Vercel's encrypted environment variables (provisioned by Terraform as empty placeholders, then populated manually or via a secrets manager).

### Local Development

Developers run the app locally without Terraform:

1. Clone repo
2. `pnpm install`
3. Copy `.env.example` → `.env.local`, fill in values
4. `pnpm db:migrate` (applies dbmate migrations to a Neon dev branch)
5. `pnpm dev` (starts Next.js dev server)

Terraform manages deployed environments. Local development uses direct Neon connection strings and local config files.

---

## DES-040: Design Tooling

The portal uses Figma for design, with a token export pipeline to Tailwind CSS. See ADR-096.

### Phase 1: Figma Free Tier

Three design files covering the core screens:

| File | Screens |
|------|---------|
| **Portal — Home & Search** | Homepage (Today's Wisdom, search bar, theme doors, videos), search results, passage share view |
| **Portal — Reader & Content** | Book reader, chapter navigation, Sacred Places, Events, About |
| **Portal — Quiet & Utility** | Quiet Corner, error states, email subscription flow, language selector |

### Design Token Pipeline

```
Figma design tokens (via Figma Tokens plugin)
 │
 ▼
 tokens.json (committed to repo)
 │
 ▼
 tailwind.config.ts imports tokens
 │
 ▼
 Components use Tailwind classes
 │
 ▼
 Storybook documents components (Phase 1+)
```

Changes to design tokens in Figma propagate to `tokens.json`, which updates `tailwind.config.ts`, which is reflected in all components. The design language stays synchronized between design and code.

### Phase 11: Calm Technology Design System

When the shared component library begins (Phase 11), Figma Professional ($15/editor/month) enables:
- Shared component library with variants
- Design system documentation alongside Storybook
- Branching for design exploration
- Multi-property reuse (portal, convocation site, future SRF projects)

---

## DES-041: Magazine Section Architecture

Self-Realization Magazine (published since 1925) is a primary content type alongside books, audio, and video. Yogananda's magazine articles enter the full search/theme/daily-passage pipeline. Monastic articles are searchable via opt-in filter. See ADR-040.

### Magazine API Endpoints

```
GET /api/v1/magazine/issues              → Paginated issue list (cursor-based)
 ?language=en                            — Filter by language
 ?updated_since=...                      — Incremental sync (ADR-107)
 ?created_since=...                      — Incremental sync (ADR-107)
GET /api/v1/magazine/issues/{slug}       → Single issue (metadata + article summaries)
GET /api/v1/magazine/issues/{slug}/pdf   → Issue PDF (pre-rendered, S3 + CloudFront)

GET /api/v1/magazine/articles            → Paginated article list (cursor-based)
 ?issue_id={uuid}                        — Filter to a single issue
 ?author_type=yogananda                  — Filter by author type
 ?language=en                            — Filter by language
 ?updated_since=...                      — Incremental sync (ADR-107)
 ?created_since=...                      — Incremental sync (ADR-107)
GET /api/v1/magazine/articles/{slug}     → Single article with chunks
GET /api/v1/magazine/articles/{slug}/pdf → Article PDF (pre-rendered)
```

Issue slugs are single-segment, computed from year + season (e.g., `2025-spring`, `1925-winter`). Article slugs are globally unique (enforced by `UNIQUE(slug)` on `magazine_articles`). See ADR-108.

### Magazine Page Layout

```
/magazine → Magazine landing
├── Latest Issue (cover, TOC, featured article)
├── Browse by Year (accordion → issue covers)
└── Yogananda's Magazine Writings (searchable index, chronological + by theme)

/magazine/{issue-slug} → Single issue view (e.g., /magazine/2025-spring)
├── Cover image + editorial note
├── Article list with author types (gold marks for Yogananda, neutral for others)
└── "Read full issue PDF →" download

/magazine/{issue-slug}/{article-slug} → Article reader (same reader component as books)
├── Author byline below title
├── Issue citation in reader header
└── "In this issue" sidebar (replaces Related Teachings when browsing within an issue)
```

### Search Integration

The `hybrid_search` function queries `magazine_chunks` alongside `book_chunks`. Only `author_type = 'yogananda'` articles are included by default. The `include_commentary=true` parameter extends search to monastic articles. Citations adapt: *— Self-Realization Magazine, Vol. 97 No. 2, p. 14*.

---

## DES-042: Glossary Architecture

The spiritual terminology bridge (`/lib/data/spiritual-terms.json`, ADR-051) is surfaced as a user-facing glossary. See ADR-038. Sanskrit display and search normalization policy in ADR-080.

### ADR-080: Glossary Schema Extensions

The `glossary_terms` table (defined in ADR-038) gains three optional columns for Sanskrit and spiritual terminology support:

- **`phonetic_guide`** — Simplified pronunciation guide (e.g., "PRAH-nah-YAH-mah" for prāṇāyāma). Editorially written, based on standard Sanskrit phonology. Ships with Phase 4 glossary.
- **`pronunciation_url`** — URL to an SRF-approved audio pronunciation recording. Nullable; populated when SRF provides recordings (Phase 10+). Stakeholder question pending.
- **`has_teaching_distinction`** — Boolean flag for terms where Yogananda's usage intentionally differs from common usage and the difference itself is part of the teaching (e.g., Aum vs. Om, "meditation," "Self-realization"). When true, the glossary UI highlights the distinction as pedagogically significant.

### Glossary API Endpoints

```
GET /api/v1/glossary → All glossary terms (paginated, cursor-based)
 ?language=en — Filter by language
 ?category=sanskrit — Filter by category
 ?q=samadhi — Search within glossary (trigram fuzzy)
 ?has_teaching_distinction=true — Filter to terms with teaching distinctions

GET /api/v1/glossary/{slug} → Single term with definition, Yogananda's explanation passage,
 phonetic guide, and pronunciation URL (if available)
```

### Glossary Page Layout

```
/glossary → Glossary landing
├── Search bar ("Find a term...")
├── Category filter (Sanskrit, Yogic Concepts, Spiritual States, Scriptural, Cosmological, Practice)
├── Alphabetical term list
│ ├── Term + phonetic guide (if available) + brief definition (1-2 sentences)
│ ├── 🔊 Pronunciation (if audio available — Phase 10+)
│ ├── "Yogananda's explanation →" link to source passage
│ ├── ⚡ Teaching distinction callout (if has_teaching_distinction)
│ │ └── "Yogananda's usage differs from common usage..." with explanation
│ └── Related theme links
└── Inline reader integration (opt-in via reader settings: "Show glossary terms")
 └── Dotted underline on recognized terms → tooltip with definition
```

---

## DES-043: "What Is Humanity Seeking?" Dashboard Architecture

A public-facing, contemplative visualization of anonymized search intelligence.

### Seeking API Endpoints

```
GET /api/v1/seeking → Dashboard data (aggregated, nightly)
 Response: { top_themes[], geographic_summary[], seasonal_rhythm[], common_questions[] }

GET /api/v1/seeking/themes → Theme trends over time
 ?period=month|quarter|year
```

### Seeking Dashboard Layout

```
/seeking → Public dashboard (contemplative, not analytical)
├── "Right now, the world is seeking..." — Top 3-5 themes, warm text emphasis
├── Geographic view — Warm-toned world map, soft regional highlights
├── Seasonal rhythm — Year-view of theme ebb and flow
├── The questions — Most common question-form queries (anonymized, clustered)
└── "Read the full analysis in Self-Realization Magazine →" (when available)
```

---

## DES-044: Additional New UI Pages

### DES-045: `/journeys` — Calendar Reading Journeys

Browse available time-bound reading experiences. Lists evergreen, seasonal, and annual journeys with descriptions, durations, and "Subscribe" buttons. Active seasonal journeys highlighted.

### ADR-061, ADR-062: `/explore` — Knowledge Graph Visualization

Interactive visual map of the entire teaching corpus — every content type, every relationship. The graph evolves through phases, gaining new node and edge types as content types are added. See the consolidated `/explore` specification below for the full cross-media design.

### ADR-039: `/integrity` — Content Integrity Verification

Public page listing all books and their per-chapter content hashes. "How to verify" instructions. Statement of textual fidelity.

### DES-046: Study Circle Sharing

**Route:** `/study/[book-slug]/[chapter]/share/[hash]`

Pre-rendered, shareable page with key passages, discussion prompts, and cross-book connections. < 30KB HTML. Optimized for WhatsApp/SMS preview.

### ADR-038, ADR-049: `/vocabulary` — Yogananda's Language

The search suggestion system (ADR-049) maps modern terms ("mindfulness") to Yogananda's vocabulary ("concentration, one-pointed attention"). This mapping is currently a search optimization. The Vocabulary Bridge page inverts it into a *learning experience*.

**Purpose:** A dedicated page that presents Yogananda's vocabulary — not as definitions (the Glossary handles that, ADR-038), but as a *translation guide* between contemporary language and the master's specific usage. Over time, seekers stop searching for "mindfulness" and start searching for "concentration." The vocabulary bridge measures its own success by becoming unnecessary.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ Yogananda's Language │
│ │
│ Yogananda used language with precision — each word │
│ chosen to convey a specific spiritual reality. │
│ When he says "concentration," he means something │
│ deeper than the modern usage. │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ You might search for... Yogananda's word is... │
│ │
│ mindfulness concentration, one-pointed │
│ attention │
│ enlightenment Self-realization, cosmic │
│ consciousness │
│ energy prana, life force │
│ subconscious superconscious │
│ willpower dynamic will │
│ prayer scientific prayer, │
│ affirmation │
│ │
│ Each term links to → Glossary definition │
│ → Passages where Yogananda uses it │
│ → Related search │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Data source:** The terminology bridge mapping table already built for ADR-049 search suggestions. The vocabulary page is a human-readable view of the same data.

**Phase:** Phase 4 (alongside Glossary, ADR-038). Content is editorial — the mapping between modern and Yogananda-specific vocabulary requires human curation.

### DES-047: `/browse` — The Complete Index

A single, high-density text page listing every navigable content item in the portal, organized by category and subcategory. Designed text-first — not a degraded rich page, but a page whose primary form IS text. The card catalog that completes the librarian metaphor.

**Purpose:** Provide a bird's-eye view of the entire teaching corpus. Serve the pre-seeking browser who wants to see the shape of the teachings before committing to a path. Function as the portal's universal fallback — the best page for screen readers, feature phones, terminal browsers, offline caching, and SEO crawlers.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ Browse All Teachings │
│ │
│ BOOKS │
│ ───── │
│ Spiritual Classics │
│ Autobiography of a Yogi — 48 chapters │
│ Man's Eternal Quest — 57 talks │
│ The Divine Romance — 54 talks │
│ Scripture Commentary │
│ God Talks With Arjuna — Bhagavad Gita commentary │
│ The Second Coming of Christ — Gospel commentary │
│ Daily Practice │
│ Scientific Healing Affirmations │
│ Metaphysical Meditations │
│ │
│ THEMES │
│ ────── │
│ Qualities: Peace · Courage · Healing · Joy · Purpose · Love │
│ Life Situations: Loss & Grief · Relationships · Parenting │
│ · Work · Loneliness · Aging │
│ Spiritual Figures: Christ · Krishna · Sri Yukteswar · ... │
│ Yoga Paths: Kriya · Raja · Bhakti · Karma · Jnana · ... │
│ Practices: Meditation · Concentration · Pranayama · ... │
│ Principles: Ahimsa · Satya · Asteya · ... │
│ Scriptures: Yoga Sutras · Bhagavad Gita · Bible · Rubaiyat │
│ │
│ READING THREADS │
│ ──────────────── │
│ Yogananda on Fear — 8 passages from 4 books │
│ The Inner Science of Meditation — ... │
│ │
│ GLOSSARY (A–Z) │
│ ────────────── │
│ Astral body · Chakra · Dharma · Guru · Karma · ... │
│ │
│ PEOPLE │
│ ────── │
│ Sri Yukteswar · Lahiri Mahasaya · Krishna · Christ · ... │
│ │
│ REFERENCES │
│ ────────── │
│ Bhagavad Gita · Bible · Yoga Sutras · Kabir · Rumi · ... │
│ │
│ THE QUIET CORNER │
│ ──────────────── │
│ Contemplative · Practical · Devotional · Philosophical │
│ │
│ See these relationships visually → Knowledge Graph │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Data source:** Auto-generated from the database at build time (ISR). Zero editorial overhead. The page grows automatically as content is added across phases.

**Performance:** < 20KB HTML. Zero JavaScript required. Zero images. Cacheable by Service Worker as a single offline artifact — the one page that remains fully useful with no network after initial load.

**Semantic structure:** `h2` for top-level categories (Books, Themes, etc.), `h3` for subcategories (Spiritual Classics, Scripture Commentary, etc.), links for individual items. This heading hierarchy makes the page ideal for screen reader navigation — VoiceOver/NVDA users browse by heading level. ARIA labels follow ADR-073 warm speech conventions: "Browse all teachings — a complete index of the portal's contents."

**Multilingual:** Shows content filtered by seeker's language preference. When a book is available in multiple languages, indicates availability ("Also in: हिन्दी, Español"). Language filtering via the same `language` parameter used by all content APIs.

**Phased growth:**
| Phase | Content shown |
|-------|---------------|
| 1 | Books only (with chapter counts) |
| 4 | + Themes (all active categories), Glossary terms, Quiet Corner textures |
| 5 | + People, External References, Reading Threads |
| 6+ | + Knowledge Graph link, Calendar Journeys |
| 7+ | + Magazine archives, Ontology concepts |

**Phase:** Phase 1 (initial, books-only version). Grows automatically with each subsequent phase.

### DES-048: `/guide` — The Spiritual Guide

A curated recommendation page organized by spiritual need. Where `/browse` answers "what's here?", `/guide` answers "where should I go?" Expands the homepage's 5 empathic entry points to 20–30+ organized pathways with editorial framing.

**Purpose:** Serve the seeker who has a specific need but doesn't know which book, theme, or reading thread addresses it. The reference librarian's recommendation list — not "what exists?" but "what should I read, given where I am?"

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ Where to Begin │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ IF YOU ARE NEW TO YOGANANDA'S TEACHINGS │
│ │
│ Start with Autobiography of a Yogi — Yogananda's │
│ own account of his spiritual journey. Then explore │
│ the theme of Joy for a taste of his practical wisdom. │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ IF YOU ARE EXPLORING MEDITATION │
│ │
│ The "Meditation" theme gathers Yogananda's most direct │
│ teachings on the practice. Scientific Healing │
│ Affirmations offers practical technique. The reading │
│ thread "The Inner Science of Meditation" traces the │
│ theme across four books. │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ IF YOU ARE DEALING WITH LOSS │
│ │
│ The Grief & Loss theme gathers Yogananda's most │
│ consoling words for the bereaved. The Quiet Corner │
│ offers a space for stillness. Chapter 43 of the │
│ Autobiography addresses what happens after death. │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ IF YOU ARE A STUDENT OF THE BHAGAVAD GITA │
│ │
│ God Talks With Arjuna is Yogananda's verse-by-verse │
│ commentary. The reverse bibliography shows every │
│ passage referencing the Gita. See Krishna in the │
│ People Library. │
│ │
│ ... │
│ │
│ Browse the full index of all teachings → │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Editorial voice:** Framing text follows ADR-074 micro-copy standards. Never paraphrases Yogananda — only provides navigational context ("In this collection of talks, Yogananda addresses..."). Each section provides 2–3 specific recommendations (a book, a theme, a reading thread, a passage) with brief editorial framing.

**Provenance:** Same three-state model as editorial threads (DES-026). Claude can draft initial recommendation text (`auto`), but all user-facing content requires human review (`reviewed`) or human authorship (`manual`).

**Cultural adaptation:** Per-locale guide variants in Phase 10+ (stored in `messages/{locale}.json`). Different cultures have different spiritual entry points — an Indian seeker may start with karma and dharma; a Western seeker may start with meditation and self-improvement.

**Worldview adaptation:** Seekers arrive not only from different cultures and languages but from different epistemological starting points — and Yogananda's corpus speaks to many of them directly. A Christian contemplative finds *The Second Coming of Christ*. A Sufi or poetry lover finds *Wine of the Mystic*. A Buddhist meditator finds Yogananda's scientific descriptions of concentration and consciousness. A scholar of comparative religion finds the reverse bibliography (DES-027). An agnostic interested in the science of spirituality finds Yogananda's engagement with Einstein, physics, and the experimental method. The `/guide` page can serve these worldview entry points alongside need-based pathways, using the same editorial template — "If you come from a Christian contemplative tradition," "If you have a Buddhist meditation practice," "If you are interested in the intersection of science and spirituality." These are editorial content, not architectural changes. They surface affinities already present in the corpus rather than imposing an interfaith framing from outside. Whether to include worldview pathways is an SRF editorial decision — see CONTEXT.md § Open Questions (Stakeholder).

**Navigation:** Linked from site footer ("Where to begin"), from the "Start Here" newcomer path (Phase 1.13), and from `/browse` (bidirectional link). Each recommendation section links to the relevant destination page.

**Phase:** Phase 4 (requires theme system, glossary, and editorial infrastructure). Grows editorially through Phase 5+ as reading threads, people, and references become available.

#### Worldview Pathway Catalog

The `/guide` page organizes pathways into three groups: **need-based** (existing: "If you are dealing with loss," "If you are exploring meditation"), **worldview-based** ("If you come from a Christian contemplative tradition"), and **life-phase** ("If you are asking: 'Is this all there is?'"). All three use the same editorial template and three-state provenance. Worldview and life-phase pathways are AI-generated from corpus data (see DES-035 § Worldview Guide Pathway Generation) and require theological review before publication.

The following catalog defines each perspective, its corpus affinity points, the seed queries and resources Claude uses during generation, and representative bridge vocabulary. Each pathway is a self-contained `/guide` section — seekers may see one, several, or none depending on editorial decisions about which pathways meet SRF's pastoral standards.

**Ordering note:** The identifiers below are for reference only, not priority. Pathways are presented in no particular order on the `/guide` page — the editorial team determines grouping and sequence per locale. Different locales may foreground different pathways.

| ID | Perspective | Key Corpus Affinity | Primary Books | Seed Themes / References | Bridge Vocabulary |
|---|---|---|---|---|---|
| WP-01 | **Christian Contemplative** | Yogananda's 1,600-page Gospel commentary; extensive Bible engagement | *The Second Coming of Christ*, *Autobiography* | Christ (person), Bible (scripture) | prayer ↔ meditation, Holy Spirit ↔ AUM, Kingdom of Heaven ↔ Christ Consciousness |
| WP-02 | **Hindu / Vedantic Practitioner** | Gita commentary, yoga philosophy, Sanskrit terminology throughout | *God Talks With Arjuna*, *Autobiography* | Krishna (person), Bhagavad Gita (scripture), yoga_path themes | Home vocabulary — the bridge maps *outward*, helping practitioners discover which specific books and chapters address concepts they already know |
| WP-03 | **Buddhist / Zen Meditator** | Scientific meditation descriptions, consciousness states, concentration | *Autobiography* (meditation chapters), *Scientific Healing Affirmations* | Meditation, concentration, non-attachment (principles) | satori ↔ samadhi, nirvana ↔ moksha, sangha ↔ satsanga, dukkha ↔ maya |
| WP-04 | **Sufi / Poetry Lover** | Rubaiyat commentary, Kabir/Rumi references, devotional love | *Wine of the Mystic*, *Cosmic Chants* | Omar Khayyam, Kabir (references), Devotion (practice) | dhikr ↔ meditation/chanting, fana ↔ samadhi, the Beloved ↔ Divine Beloved |
| WP-05 | **Jewish / Contemplative Seeker** | Old Testament references, mystical unity, ethical teachings | *The Second Coming of Christ* (OT passages), *Man's Eternal Quest* | Bible (scripture — OT subset) | tikkun olam ↔ karma yoga, kavvanah ↔ concentration, devekut ↔ God-communion |
| WP-06 | **Science & Consciousness Explorer** | Yogananda's scientific framing of yoga, engagement with scientists | *Autobiography* (science chapters), *Man's Eternal Quest* | Einstein, Luther Burbank (references), scientific category in vocabulary bridge | consciousness ↔ cosmic consciousness, energy ↔ prana/life force, neuroplasticity ↔ will and habit |
| WP-07 | **Spiritual But Not Religious** | Universal human themes, no doctrinal prerequisites, empathic entry points | *Autobiography*, *Where There Is Light* | Quality themes (Peace, Joy, Purpose, Courage), Quiet Corner | No bridge needed — entry is through universal emotional language already present in theme names and empathic entry points |
| WP-08 | **Yoga Practitioner (Body to Spirit)** | Yoga philosophy beyond asana, pranayama, energy body | *Autobiography*, *God Talks With Arjuna* | yoga_path themes, pranayama/meditation (practices) | asana ↔ (Yogananda rarely discusses postures — this is itself a discovery), pranayama ↔ life force control, chakra ↔ astral centers |
| WP-09 | **Grief / Crisis Visitor** | Consolation, the soul's immortality, purpose of suffering | All books (cross-cutting) | Grief & Loss (situation), Quiet Corner, tone: `consoling` | No bridge needed — entry is through raw human need. The most interfaith pathway because grief has no tradition. |
| WP-10 | **Psychology / Self-Improvement Seeker** | Willpower, habit formation, concentration, practical life advice | *Man's Eternal Quest*, *Where There Is Light*, *Sayings* | situation themes (Work, Relationships), tone: `practical` | mindfulness ↔ concentration, self-actualization ↔ Self-realization, flow state ↔ superconsciousness |
| WP-11 | **Comparative Religion / Academic** | Cross-tradition references, the reverse bibliography as intellectual map | All books | Full reverse bibliography (DES-027), Knowledge Graph, principle themes | No bridge — vocabulary precision is valued; the glossary (ADR-038) and ontology (ADR-043) serve this population |
| WP-12 | **Parent / Family-Oriented Seeker** | Practical guidance on raising children, family life, relationships | *Man's Eternal Quest*, *Journey to Self-Realization* | Parenting, Relationships (situations), tone: `practical` | mindful parenting ↔ conscious child-rearing, values ↔ spiritual qualities |
| WP-13 | **Muslim / Sufi Seeker** | Yogananda's engagement with Islamic mysticism, Rubaiyat commentary, references to Sufi saints, universal God-consciousness | *Wine of the Mystic*, *Autobiography*, *Man's Eternal Quest* | Omar Khayyam, Kabir (references), Devotion (practice), cosmic consciousness | salat ↔ meditation/prayer, dhikr ↔ chanting/AUM, nafs ↔ ego, tawhid ↔ cosmic consciousness, the Beloved ↔ Divine Beloved |
| WP-14 | **Agnostic / Skeptical-but-Curious** | Yogananda's engagement with science, his insistence on verifiable experience over blind faith, experimental method in meditation | *Autobiography* (science chapters, "The Law of Miracles"), *Man's Eternal Quest* | Scientific vocabulary bridge, consciousness, practical technique | No tradition-specific bridge — entry is through questions: "Is consciousness more than the brain?", "Can meditation be verified?", "What did Yogananda mean by 'scientific' spirituality?" Distinct from WP-06 (Science Explorer) in that WP-14 does not assume interest in consciousness *per se* — it meets skepticism directly. |
| WP-15 | **Documentary Viewer ("Awake")** | Discovered Yogananda through the *Awake: The Life of Yogananda* documentary film; may have no prior spiritual reading practice; entry is visual/emotional, not textual | *Autobiography of a Yogi* (the source the film draws from), *Where There Is Light* (accessible entry point), *Man's Eternal Quest* | No tradition-specific themes — entry is biographical and emotional: Yogananda's life story, his journey to America, his legacy | film ↔ book, scenes ↔ chapters, biographical narrative ↔ spiritual autobiography. The pathway bridges from a passive viewing experience to active engagement with Yogananda's own words. "You saw his life on screen — now read it in his voice." The *Autobiography* is the natural first book. The documentary is third-party (Counterpoint Films, SRF-endorsed) and linked via its distribution URLs, not hosted on the portal. |

**Generation priority:** Pathways WP-01, WP-03, WP-06, WP-07, WP-09 have the strongest corpus affinity and address the largest seeker populations. Generate and review these first. WP-02, WP-04, WP-08, WP-13 have deep corpus support but smaller initial English-language audiences (WP-02 becomes high-priority for Hindi/Bengali locales). WP-05, WP-10, WP-11, WP-12, WP-14 require multi-book corpus (Phase 3+) for meaningful content. WP-15 (Documentary Viewer) requires only the *Autobiography* and is high-priority for the film's existing audience — many seekers discover Yogananda through the documentary before encountering his books. Whether to include WP-13 (Muslim/Sufi) and WP-14 (Agnostic) requires SRF editorial approval. Whether to include WP-15 requires confirming SRF's posture toward the *Awake* documentary as an endorsed entry point (see CONTEXT.md § Open Questions).

**What is NOT a worldview pathway:** A pathway that would require the portal to adopt a theological position. "If you believe all religions are one" is a claim; "If you come from a Christian contemplative tradition" is a starting point. The pathways acknowledge where the seeker is, then point to where Yogananda's words are. They do not assert what Yogananda "would say to a Buddhist" — they show where he actually wrote about the themes that tradition cares about.

**Pathway structure** (same template for all):

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ IF YOU COME FROM A CHRISTIAN CONTEMPLATIVE TRADITION │
│ │
│ Yogananda devoted much of his life to exploring the │
│ unity between Christ's teachings and India's ancient │
│ yoga science. His writings engage deeply with the │
│ Gospels, the nature of Christ Consciousness, and the │
│ practice of communion with God. │
│ │
│ → The Second Coming of Christ │
│ Yogananda's verse-by-verse commentary on the │
│ Gospels — 1,600 pages exploring the inner meaning │
│ of Christ's words. │
│ │
│ → Christ — theme page │
│ Passages about Jesus from across all books. │
│ │
│ → Bible — reverse bibliography │
│ Every Biblical reference in Yogananda's works. │
│ │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│ │
│ You may also recognize: │
│ prayer → Yogananda calls it "meditation" │
│ Holy Spirit → he writes of "AUM, the cosmic │
│ vibration" │
│ │
│ 💬 "I... perceive the voice of God, a great │
│ harmony... the voice of Aum or Amen, the │
│ great cosmic sound." │
│ — Autobiography of a Yogi, Ch. 14, p. 161 │
│ │
└──────────────────────────────────────────────────────────────┘
```

**"You may also recognize" section:** A small vocabulary bridge at the bottom of each worldview pathway, showing 2–3 terms from the seeker's tradition and Yogananda's equivalent. Not a glossary — a moment of recognition: "Oh, he's talking about the same thing." This data comes from the `spiritual-terms.json` vocabulary bridge, filtered by the perspective's categories. For perspectives where no bridge is needed (SBNR, grief, comparative religion), this section is omitted.

**Representative passage:** Each pathway includes one representative Yogananda passage (verbatim, with full citation) selected by Claude from the corpus search results as the single most resonant quote for that perspective. The reviewer may substitute a different passage. This gives the seeker an immediate taste of what they'll find.

#### Life-Phase Pathway Catalog

The `/guide` page's third group: pathways organized by **where you are in the arc of a life**. Where worldview pathways ask "where are you coming from?", life-phase pathways ask "where are you *in your life right now*?"

This dimension is distinct from situation themes (ADR-032). Situation themes describe circumstances — "parenting," "work," "aging." Life-phase pathways describe temporal identity and characteristic questions. "Parenting" is a circumstance that could arise at 22 or 42; "I'm building a life and trying to balance purpose with responsibility" is a season. The passage selection, tone, and accessibility level all shift with the season.

The Autobiography is a special asset here: it is literally a life-phase narrative. Yogananda's childhood chapters speak to young seekers; his years of searching speak to those in transition; his mission-building years speak to those building a life; his later chapters speak to those approaching the end. An editorial reading thread (DES-026) tracing "The Autobiography as a Life Journey" could map chapters to seasons — the portal's only book that *is* a life story.

| # | Life Phase | Characteristic Question | Key Corpus Affinity | Situation Themes | Tone Filter | Accessibility |
|---|---|---|---|---|---|---|
| 1 | **Young Seeker (13–22)** | "What should I do with my life?" | *Autobiography* youth chapters (1–12), *Where There Is Light*, willpower/concentration passages | — | `practical`, `joyful` | Level 1 (universal) |
| 2 | **Building a Life (22–35)** | "How do I balance the inner and the outer?" | *Man's Eternal Quest*, *Where There Is Light*, *Sayings*, karma yoga passages | Work, Relationships | `practical` | Level 1–2 |
| 3 | **Raising a Family** | "How do I raise my children wisely?" | Parenting passages across books, education teachings, duty to family | Parenting, Relationships | `practical` | Level 1–2 |
| 4 | **The Middle Passage (40–55)** | "Is this all there is?" | *Journey to Self-Realization*, Purpose theme, deepening practice, second-half-of-life passages | Work, Purpose | `contemplative`, `challenging` | Level 2–3 |
| 5 | **The Caregiver** | "Where do I find strength to keep going?" | Divine protection, patience, selfless love, inner reserves, service as spiritual practice | Health/Wellness, Relationships | `consoling`, `practical` | Level 1–2 |
| 6 | **Facing Illness** | "How do I heal — or accept?" | *Scientific Healing Affirmations* (entire book), healing theme, the body and the soul, willpower | Health/Wellness, Healing (quality) | `consoling`, `practical` | Level 1–2 |
| 7 | **The Second Half (55+)** | "How do I grow old with grace?" | Aging theme, wisdom of experience, the soul's eternal youth, deepening practice with time | Aging | `contemplative`, `consoling` | Level 2–3 |
| 8 | **Approaching the End** | "What awaits me?" | Soul's immortality, afterlife passages, fearlessness of death, the transition, the astral world | Loss & Grief, Aging | `consoling`, `contemplative` | Level 2–3 |
| 9 | **New to Spiritual Practice** | "I want to begin but don't know how." | *Autobiography* as entry narrative, meditation descriptions, the Quiet Corner, Joy and Peace themes | — | `practical`, `joyful` | Level 1 (universal) |

**Relationship to situation themes:** Life-phase pathways *compose* existing situation themes into temporal context. The Parenting situation theme page shows all passages about raising children. The "Raising a Family" life-phase pathway says: "You are in a season of family — here is the Parenting theme, here is how Yogananda balanced family duty with spiritual life, here is the Relationships theme for the marriage that sustains the family, and here is the Quiet Corner for the parent who has five minutes of silence."

**The characteristic question:** Each life-phase pathway opens with the question that defines its season — not as a heading, but as the emotional entry point. This replaces the worldview pathway's "If you come from..." framing with "If you are asking..." framing:

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ IF YOU ARE ASKING: "IS THIS ALL THERE IS?" │
│ │
│ The middle of life often brings a quiet reckoning — │
│ the sense that outward success hasn't answered the │
│ inner question. Yogananda wrote extensively about │
│ this turning point: the moment when the soul's │
│ deeper purpose begins to assert itself. │
│ │
│ → Journey to Self-Realization │
│ Talks from Yogananda's later years, when his │
│ own teaching had deepened into direct, practical │
│ wisdom about the soul's journey. │
│ │
│ → Purpose — theme page │
│ Passages on meaning, dharma, and the divine plan │
│ from across all books. │
│ │
│ → "Yogananda on the Two Halves of Life" │
│ An editorial reading thread tracing the arc from │
│ worldly achievement to spiritual deepening. │
│ │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│ │
│ Others in this season have found: │
│ · The Quiet Corner — 5 minutes of stillness │
│ · "Comfort after loss" — if part of the │
│ reckoning involves grief │
│ │
│ 💬 "You must not let your life run in the │
│ ordinary way; do something that nobody else │
│ has done, something that will dazzle the │
│ world." │
│ — The Divine Romance, Ch. 37, p. 440 │
│ │
└──────────────────────────────────────────────────────────────┘
```

**"Others in this season have found" section:** The life-phase equivalent of the worldview pathway's "You may also recognize." Instead of vocabulary bridges (which map across traditions), life-phase pathways offer lateral connections — other portal features that serve this season. The Quiet Corner for the exhausted parent. The Grief theme for the midlife seeker whose reckoning includes loss. The Knowledge Graph for the retired seeker with time to explore. These are editorially curated, not algorithmically generated.

**Age sensitivity:** The pathways use seasons and questions, not age ranges, in the seeker-facing UI. The age ranges in the catalog above are editorial guidance for corpus selection, not display labels. "If you are asking: 'What should I do with my life?'" serves a 16-year-old and a 45-year-old in career transition equally. The content Claude selects may differ (younger-skewing tone for the Youth pathway, deeper teachings for the Middle Passage), but the question is universal.

**The Young Seeker consideration:** The portal will be visited by teenagers — a 14-year-old grieving a grandparent, a 17-year-old curious about meditation from a yoga class. The portal's contemplative voice, slow pace, and absence of gamification actually *serve* this population well — it's the opposite of every other digital experience in their life. But the editorial voice should acknowledge their existence without being patronizing. Passages at accessibility level 1 with `practical` or `joyful` tone naturally serve younger readers. See CONTEXT.md § Open Questions for the editorial sensitivity question.

**Youth & young adult signpost on LP-1:** The Young Seeker pathway should include a quiet signpost to SRF's dedicated youth and young adult programs: "SRF offers programs designed for young seekers — classes, events, and fellowship with others your age. Learn more → yogananda.org." This connects Yogananda's written words (what the portal delivers) with the living community (what SRF offers). The signpost appears after the pathway's content recommendations, not before — the portal's gift is the teachings themselves; the community signpost is the natural next step for a young person who resonates. Same visual weight as the Practice Bridge note: `--portal-text-muted`, Merriweather 300. SRF URL for youth programs is a stakeholder question (CONTEXT.md Q112).

**Generation:** Life-phase pathways use the same AI-assisted generation pipeline as worldview pathways (DES-035 § Worldview Guide Pathway Generation). The prompt template differs: instead of tradition-specific seed queries and vocabulary bridges, life-phase prompts use tone filters, accessibility levels, situation theme associations, and the characteristic question as the generation anchor. Claude searches for passages that *answer the question of this season* and selects resources that serve the seeker's temporal context.

**Generation priority:** Pathways 1, 4, 6, 8 address the most acute life-phase needs and have the strongest emotional urgency. Pathway 9 (New to Spiritual Practice) overlaps with the existing "If you are new to Yogananda's teachings" need-based pathway and may not need a separate life-phase version. Pathways 2, 3, 5, 7 have broader corpus support but less acute urgency.

#### Practice Pathway: "If You Feel Drawn to Practice" (ADR-104)

The culminating pathway — the one every other pathway eventually leads to. Every worldview pathway, every life-phase pathway, every need-based pathway eventually arrives at the same question: "I've been reading, and I want to practice. How do I begin?"

This pathway is distinct from the others because it bridges *from the portal to SRF's institutional path*. Where other pathways point inward (to books, themes, threads, the Quiet Corner), this one points both inward and outward — to the portal's resources for understanding and to SRF's resources for doing.

**Structure:**

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   IF YOU FEEL DRAWN TO PRACTICE                              │
│                                                              │
│   Yogananda wrote that reading about God is not enough —     │
│   the deepest response to the teachings is to practice.      │
│   His published works describe a path from curiosity         │
│   to meditation to the deepest communion with God.           │
│                                                              │
│   → Start now: A Beginner's Meditation                       │
│     Free instruction from SRF — you can practice             │
│     today, right now.                                        │
│     → yogananda.org/a-beginners-meditation                   │
│                                                              │
│   → The Quiet Corner                                         │
│     A moment of stillness on this portal — one               │
│     affirmation, a gentle timer, silence.                    │
│                                                              │
│   → Meditate with others                                     │
│     Find a meditation group near you, or join                │
│     a live session at the Online Meditation Center.          │
│     → yogananda.org (center locator)                         │
│     → onlinemeditation.yogananda.org                         │
│                                                              │
│   → Autobiography of a Yogi, Chapter 26                      │
│     "The Science of Kriya Yoga" — Yogananda's public         │
│     account of the technique's ancient lineage               │
│     and purpose.                                             │
│                                                              │
│   → Kriya Yoga — theme page                                  │
│     Passages about Kriya Yoga from across all                │
│     published books.                                         │
│                                                              │
│   → The SRF Lessons                                          │
│     A 9-month home-study course in meditation and            │
│     spiritual living, including preparation for              │
│     Kriya Yoga initiation.                                   │
│     → yogananda.org/lessons                                  │
│                                                              │
│   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─            │
│                                                              │
│   Others have shared their experiences with                  │
│   meditation and the teachings in                            │
│   Self-Realization Magazine.                                 │
│   → yogananda.org/self-realization-magazine                  │
│                                                              │
│   💬 "You do not have to struggle to reach God,              │
│      but you do have to struggle to tear away the            │
│      self-created veil that hides Him from you."             │
│      — Man's Eternal Quest, p. 119                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**What makes this pathway different from LP-9 ("New to Spiritual Practice"):** LP-9 serves the newcomer who has never meditated — its resources are introductory. The Practice pathway serves the seeker who has been *reading Yogananda's teachings on the portal* and feels drawn to formal practice. The two overlap in some resources (the Quiet Corner, the Beginner's Meditation) but differ in editorial framing and depth: the Practice pathway includes Autobiography Ch. 26, the Kriya Yoga theme page, and the SRF Lessons — none of which appear in LP-9.

**Progression mirrors SRF's own site:** Begin free (Beginner's Meditation) → taste stillness (Quiet Corner) → meditate with others (center locator, Online Meditation Center — honoring Yogananda's emphasis on satsanga) → understand the path (Autobiography Ch. 26, Kriya theme) → commit when ready (SRF Lessons). The free resources appear first. The addition of group meditation acknowledges that Yogananda consistently emphasized spiritual fellowship (satsanga) as integral to the path — the practice pathway should not present meditation as exclusively solitary.

**Editorial voice:** Navigational, never promotional. "Yogananda wrote that reading about God is not enough" is a factual description of his published position. The framing text never says "you should enroll" — it says "here is the path, if you want it."

**Provenance:** Same three-state model as all pathways. Claude drafts initial text; theological reviewer approves.

**Phase:** 4 (with the rest of `/guide`). Requires the Kriya Yoga theme page (Phase 5+) for the theme link; until then, the link points to Autobiography Ch. 26 only.

---

## DES-049: Responsive Design Strategy

The portal's breakpoints (DES-015) define four viewport tiers. This section consolidates the responsive behavior of every major component into a single reference, ensuring consistent layout decisions across the codebase. It also addresses interaction modality, orientation, and print — dimensions that viewport width alone does not capture.

### Breakpoint Behavior Matrix

| Component | Mobile (≤639px) | Tablet (640–1023px) | Desktop (≥1024px) | Wide (≥1280px) |
|-----------|----------------|--------------------|--------------------|----------------|
| **Navigation** | Hamburger menu | Hamburger menu (≤768px) or condensed horizontal nav (>768px) | Full horizontal nav | Full horizontal nav |
| **Search results** | Full-width stacked cards | Full-width stacked cards, wider citation line | Two-column card grid or single-column with side metadata | Two-column with side metadata |
| **Book reader** | Single column, full-width text | Single column with wider margins; landscape: consider two-column (see Orientation below) | Single column with generous margins, Related Teachings side panel visible | Reader centered at `--bp-max-content`, side panel always visible |
| **Quiet Corner** | Centered vertical layout, affirmation fills viewport | Centered with more breathing room; timer controls inline | Horizontal layout option: affirmation left, timer right | Same as desktop, max-width constrained |
| **Today's Wisdom** | Stacked: passage card, then theme chips below | Passage card with theme chips inline | Passage card with theme chips and "Show me another" inline | Same as desktop |
| **Theme pages** | Single-column passage list | Two-column passage card grid | Two-column grid with theme description sidebar | Three-column grid at `--bp-wide` |
| **Knowledge Graph** | 2-hop subgraph, max ~500 nodes, touch-optimized (ADR-062) | Full graph with cluster-first loading | Full graph, hover tooltips | Full graph at native resolution |
| **Presentation mode** | Text 24px+, full viewport, swipe navigation | Text 28px+, full viewport | Text 32px+, arrow-key navigation | Text 36px+, centered reading column |

### Interaction Modality Detection

Viewport width is an unreliable proxy for interaction capability. A tablet with a keyboard case behaves like a desktop; a touchscreen laptop behaves like a tablet. The portal uses CSS media features for interaction-dependent behavior:

```css
/* Hover-dependent interactions (dwell icon reveal, tooltip previews) */
@media (hover: hover) and (pointer: fine) {
  /* Desktop-class: show hover affordances */
}

/* Touch-primary interactions (long-press dwell, native share) */
@media (hover: none) and (pointer: coarse) {
  /* Touch-class: show touch affordances, enlarge tap targets */
}

/* Hybrid devices (touchscreen laptops) — favor touch affordances */
@media (hover: hover) and (pointer: coarse) {
  /* Show both hover and touch affordances */
}
```

**Component implications:**
- **Dwell mode:** Hover-icon trigger for `(hover: hover) and (pointer: fine)`. Long-press for `(pointer: coarse)`. Both available on hybrid devices. (Extends DES-009)
- **Share menu:** `navigator.share` (native sheet) for `(pointer: coarse)`. Custom share menu for `(pointer: fine)`. (Extends ADR-024)
- **Glossary terms:** Hover tooltip for `(hover: hover)`. Tap-to-reveal for `(hover: none)`. (Extends DES-042)
- **Touch targets:** 44×44px minimum always. 48px minimum on `(pointer: coarse)` for key navigation and form inputs. (ADR-003, ADR-006 §2)

### Orientation Handling

The portal does not lock orientation. Layout adapts:

| Context | Portrait | Landscape |
|---------|----------|-----------|
| **Phone reader** | Single column, full width | Single column with wider margins. Text line length capped at `--bp-max-content` equivalent (prevents excessively long lines). |
| **Tablet reader** | Single column with generous margins | Two-column option: chapter text left, Related Teachings / footnotes right. Opt-in via reader settings (stored in `localStorage`). |
| **Presentation mode** | Vertical: passage centered | Landscape preferred for group reading. Text fills viewport width with proportionally larger font. |
| **Quiet Corner** | Vertical: affirmation above timer | Horizontal: affirmation left, timer right. More spacious for meditation posture with device propped landscape. |
| **Knowledge Graph** | Taller viewport, more vertical spread | Wider viewport, more horizontal spread. Graph physics adapts. |

### Print Stylesheet

Book content is the most likely print target — seekers in the Global South may print chapters at cybercafés, and study groups may print passages for discussion. Print stylesheets load only when `@media print` matches (zero cost during normal browsing, per ADR-006 §1).

```css
@media print {
  /* Typography */
  body { font-family: 'Merriweather', Georgia, serif; font-size: 12pt; line-height: 1.6; color: #000; }

  /* Layout: single column, no chrome */
  nav, footer, .share-menu, .dwell-icon, .search-bar,
  .related-teachings, .theme-chips { display: none; }

  /* Citations: always visible, never truncated */
  .citation { font-size: 10pt; font-style: italic; }

  /* Page headers/footers */
  @page { margin: 2cm; }
  @page :first { margin-top: 3cm; } /* extra top margin for chapter title */

  /* Attribution */
  .print-footer::after {
    content: "From teachings.yogananda.org — Paramahansa Yogananda's published teachings, freely available worldwide.";
    display: block; font-size: 9pt; margin-top: 2em; color: #595959;
  }

  /* URL display for links */
  a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 9pt; }

  /* Page breaks: never inside a passage, always before chapter titles */
  .passage-card { break-inside: avoid; }
  h2 { break-before: page; }
}
```

### Tablet as First-Class Reading Surface

Tablets are arguably the ideal form factor for sustained book reading — larger than a phone, more portable than a laptop, usable in bed, in a garden, or at a study group. The portal treats tablet as a distinct experience tier, not an interpolation between mobile and desktop:

- **Reader margins** are wider than mobile (the text should not feel cramped) but narrower than desktop (no wasted whitespace on a 10" screen). Target: 48px margins at 768px width, scaling to 64px at 1023px.
- **Related Teachings** panel: bottom sheet on portrait tablet (matches mobile pattern). Side panel on landscape tablet (matches desktop pattern). The orientation transition is the natural breakpoint, not the viewport width.
- **Two-column reader in landscape** is an opt-in setting (reader settings popover), not a default. Some seekers prefer single-column regardless of viewport. Stored in `localStorage`.
- **Touch targets** remain 44×44px minimum (not enlarged to 48px like feature-phone pages) — tablet touch precision is closer to desktop than to a 4" phone screen.

### Automatic Low-Bandwidth Suggestion

ADR-006 §1 specifies a text-only mode toggle. DES-049 extends this with an automatic suggestion:

When `navigator.connection.effectiveType` reports `'2g'` or `'slow-2g'`, the portal displays a one-time suggestion banner (not a modal): *"Your connection appears slow. Switch to text-only mode for a faster experience?"* with Accept / Dismiss. Dismissed preference stored in `sessionStorage` (resets per session, allowing re-suggestion if conditions change). The banner uses the portal's warm cream palette, not an alert style. Never forced — always a suggestion.

### Future Considerations

- **Foldable devices:** Samsung Galaxy Fold, Pixel Fold present a "phone when folded, tablet when open" form factor. The portal's responsive breakpoints handle this naturally (viewport width changes on fold/unfold), but the fold crease bisecting two-column layouts is a concern. Monitor CSS `env(fold-left)` / `env(fold-right)` proposals (CSS Viewport Segments specification). No action needed until foldable market share warrants testing.
- **Smart displays:** Google Nest Hub, Amazon Echo Show — natural surfaces for "Show me today's wisdom." The API-first architecture (ADR-011) and structured data (ADR-043 JSON-LD) enable this without portal-side changes. A smart display integration would be a new API consumer, not a new responsive breakpoint.
- **TV / casting:** Presentation mode (ADR-006 §5) is designed as a "digital lectern." A phone casting to a TV via Chromecast or AirPlay is the most natural home-satsang implementation. The 10-foot UI paradigm (large text, no hover, D-pad navigation) differs from all current breakpoints. If demand emerges, a `data-mode="cast"` CSS mode alongside `data-mode="present"` could serve this with minimal code.

---

### ADR-043, ADR-061, ADR-062: `/explore` — Knowledge Graph and Passage Constellation

Interactive visual map of the entire teaching corpus. Three visualization modes, evolving across phases. The graph is the portal's universal navigation layer — every node is clickable, navigating to the corresponding page.

**Mode 1: Knowledge Graph** (ADR-061, ADR-062) — Node-edge visualization showing relationships between all content types: passages, themes, people, places, concepts, and every media format. Pre-computed graph JSON, client-side rendering. Evolves from book-only (Phase 6) to full cross-media (Phase 12+).

**Mode 2: Passage Constellation** — A 2D spatial exploration where passages are positioned by semantic similarity, derived from embedding vectors reduced to two dimensions (UMAP or t-SNE, pre-computed at build time).

**Mode 3: Concept Map** (ADR-043) — The ontology layer: spiritual concepts and their structural relationships (prerequisite, component, leads_to). Available from Phase 7+.

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ Explore the Teachings │
│ │
│ [Graph] [Constellation] [Concepts] │
│ │
│ Filter: [Books] [Magazine] [Video] [Audio] [Images] │
│ Focus: [All] [Single book ▾] [Theme ▾] [Person ▾] │
│ │
│ 📖──────📖 │
│ / │ \ \ 🎥 │
│ ⬡ ⬡ ⬡ 📖───────│ │
│ / \ / \ │ \ │ │
│ 📖 📖 📖 📖 ◇───🔊 │
│ │ │ │ │ │
│ ◆ 👤──────📍────📷 │
│ │
│ 📖 Book passage ⬡ Theme ◆ Concept │
│ 🎥 Video clip 🔊 Audio 📷 Image │
│ 👤 Person 📍 Place ◇ Reference │
│ │
└──────────────────────────────────────────────────────────────┘
```

#### ADR-062: Knowledge Graph Node Types

| Node Type | Shape | Color | Size | Click Target | Phase |
|-----------|-------|-------|------|-------------|-------|
| Book | Rectangle | SRF Navy | Large (fixed) | `/books/[slug]` | 6 |
| Book passage | Circle | SRF Navy (30%) | Small (density-scaled) | `/books/[slug]/[ch]#p[n]` | 6 |
| Theme | Hexagon | SRF Gold | Medium (passage count) | `/themes/[slug]` | 6 |
| Person | Portrait circle | Warm Cream border | Medium (fixed) | `/people/[slug]` | 6 |
| Scripture/reference | Diamond | Earth tone | Medium (fixed) | `/references/[slug]` | 6 |
| Magazine issue | Rectangle | Warm accent | Medium (fixed) | `/magazine/[issue-slug]` | 7 |
| Magazine chunk | Circle | Warm accent (30%) | Small | `/magazine/[issue-slug]/[article-slug]` | 7 |
| Ontology concept | Rounded rectangle | SRF Gold (dark) | Medium (relation count) | `/ontology/[slug]` | 7+ |
| Sacred place | Map pin | Earth green | Medium (fixed) | `/places/[slug]` | 12 |
| Video | Play-button circle | Teal accent | Medium (fixed) | `/videos/[slug]` | 12 |
| Video chunk | Circle | Teal (30%) | Small | `/videos/[slug]?t=[ms]` | 12 |
| Audio recording | Waveform circle | Amber accent | Medium (fixed) | `/audio/[slug]` | 12 |
| Audio segment | Circle | Amber (30%) | Small | `/audio/[slug]?t=[ms]` | 12 |
| Image | Rounded square | Neutral | Small (thumbnail) | `/images/[slug]` | 12 |

Yogananda's own voice recordings and photographs receive the sacred artifact treatment — a subtle golden ring distinguishing them from other audio/images (`is_yogananda_voice`, `is_yogananda_subject` flags).

#### ADR-062: Knowledge Graph Edge Types

| Edge | Source → Target | Width/Opacity | Phase |
|------|----------------|---------------|-------|
| Semantic similarity | Any content ↔ any content | Proportional to score | 6 (books), 12 (cross-media) |
| Contains | Book/issue/video/recording → chunk/segment | Thin, fixed | 6+ |
| Theme membership | Content → theme | Medium, fixed | 6 |
| References scripture | Passage → external reference | Medium, dashed | 6 |
| Mentions person | Passage → person | Medium, fixed | 6 |
| Succeeded by | Person → person | Golden, directional | 6 |
| Preceded by | Person → person | Golden, directional | 6 |
| Mentions place | Content → sacred place | Medium, fixed | 12 |
| Depicted at | Image → sacred place | Medium, fixed | 12 |
| Photographed | Image → person | Medium, fixed | 12 |
| Ontological relation | Concept → concept | Labeled (prerequisite, component, etc.) | 7+ |
| Primary source | Passage → ontology concept | Thin, dashed | 7+ |
| Editorial thread | Content → content (sequence) | Golden, directional | 6 (books), 12 (cross-media) |
| Community collection | Content → content (curated) | Silver, directional | 14 |

#### Graph View Modes and Filtering

| Mode | Default phase | What's visible |
|------|--------------|----------------|
| **Book map** | 6 (default) | Books, passages, themes, people, references |
| **Concept map** | 7+ | Ontology concepts, relations, linked passages |
| **All media** | 12+ (new default) | Everything — full cross-media fabric |
| **Single book** | Any | One book's passages, themes, connections |
| **Single theme** | Any | One theme's passages across all media |
| **Single person** | Any | One person's passages, images, videos, places |
| **Lineage** | 6+ | Person nodes only, connected by guru/succession edges, vertical directed layout (ADR-037) |

Media type toggles: show/hide books, magazine, video, audio, images independently. The filter bar appears at the top of the graph view.

#### Phased Graph Evolution

| Phase | Additions | Approximate Node Count |
|-------|-----------|----------------------|
| **6** | Books, passages, themes, people, references. Editorial thread paths. | ~5,000–10,000 |
| **7** | + Magazine issues/chunks, ontology concepts. Constellation mode. | ~12,000–18,000 |
| **12** | + Videos/chunks, sacred places. Content hub cross-media edges. + Audio recordings/segments, images. Sacred artifact styling. | ~20,000–50,000 |
| **14** | + Community collection paths, editorial multi-media threads. | Same nodes, new paths |

#### Performance Strategy

| Scale | Rendering | Layout |
|-------|-----------|--------|
| < 10,000 nodes | d3-force with Canvas | Pre-computed positions in JSON (nightly Lambda, ADR-017) |
| 10,000–50,000 nodes | WebGL (deck.gl or custom) | Level-of-detail: clusters when zoomed out, nodes when zoomed in |
| Mobile / low-bandwidth | Subset graph: 2-hop neighborhood of current node, max ~500 nodes | Progressive loading: clusters first, expand on interaction |

The nightly Lambda pre-computes positions server-side. The client renders — no layout computation at runtime.

#### Pre-Computed Graph JSON Schema

```jsonc
{
 "generated_at": "2027-03-15T02:00:00Z",
 "schema_version": 2,
 "node_types": ["book", "passage", "theme", "person", "reference"],
 "edge_types": ["similarity", "contains", "theme_tag", "references", "mentions_person", "performance_of"],
 "nodes": [
 {
 "id": "uuid",
 "type": "passage",
 "media_type": "book",
 "label": "Chapter 12, ¶3",
 "parent_id": "book-uuid",
 "url": "/books/autobiography/12#p3",
 "x": 0.0, "y": 0.0
 }
 ],
 "edges": [
 { "source": "uuid-a", "target": "uuid-b", "type": "similarity", "weight": 0.87 }
 ],
 "paths": [
 { "id": "thread-uuid", "type": "editorial", "label": "Divine Friendship", "node_ids": ["a", "b", "c"] }
 ]
}
```

New content types extend `node_types` and `edge_types` arrays — the visualization code renders unknown types with sensible defaults. Schema version increments when structural changes occur.

#### Graph Data API

```
GET /api/v1/graph → Graph metadata (node/edge type counts, last generated)
GET /api/v1/graph/subgraph?node={id}&depth=2 → 2-hop neighborhood (for embeddable mini-graphs)
GET /api/v1/graph/cluster?theme={slug} → All nodes in a theme cluster
GET /api/v1/graph.json → Full pre-computed graph (S3-served, CDN-cached)
```

The subgraph endpoint powers embeddable mini-graphs in other pages: the reader's Related Teachings panel can show a small visual graph of the current passage's neighbors.

**Service file:** `/lib/services/graph.ts` — graph queries, subgraph extraction, cluster resolution.

#### Constellation Mode

- Each dot represents a content item. Color-coded by media type (book passages by book palette, video by teal, audio by amber, images by neutral)
- Dense clusters become visually apparent — 40 passages about "divine love" form a neighborhood
- Outlier passages sit in the sparse space between clusters — often the most interesting discoveries
- Hover reveals the first line + citation. Click navigates to the content page.
- Zoom, pan, pinch. Cluster labels appear when zoomed out (dominant theme tag).
- No lines, no arrows. Points of light on warm cream. Spatial layout reveals relationships that lists hide.

**Implementation:** UMAP dimensionality reduction from 1536-dim embeddings to 2D. Pre-computed nightly. Static JSON (~500KB for ~10,000 items). Canvas or WebGL rendering.

**Phase:** Phase 7+ (constellation). Phase 6 delivers Knowledge Graph mode only.

Linked from Library and themes pages (not primary nav).

### ADR-043: `/ontology` — Spiritual Concept Map

A human-readable view of the structured spiritual ontology (ADR-043). Presents Yogananda's conceptual framework as a navigable map: states, practices, principles, and their relationships.

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ Yogananda's Teaching Structure │
│ │
│ A map of how the teachings connect. │
│ │
│ Samadhi │
│ The superconscious state of union with Spirit. │
│ │
│ Requires: meditation → concentration → pranayama │
│ Degrees: savikalpa samadhi · nirvikalpa samadhi │
│ Parallels: satori (Zen) · unio mystica (Christian) │
│ Passages: 47 across 6 books │
│ │
│ "In the initial states of God-contact (savikalpa │
│ samadhi) the devotee's consciousness merges..." │
│ — Autobiography of a Yogi, Chapter 26, p. 312 │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Phase:** Phase 7+ (alongside ontology data model, ADR-043).

### ADR-083 ext: Personal Taxonomy in Study Workspace

The portal's themes (Peace, Courage, Healing) are universal. But seekers have *personal* names for their states. The Study Workspace (ADR-083) can accommodate this.

**Extension:** Within the Study Workspace, collections can be given seeker-defined names that aren't drawn from the portal's theme vocabulary. "The conversation I keep replaying." "What I need before sleep." "For Mom." The portal provides no vocabulary for these — the seeker's own words become the organizing principle.

- All client-side, all private, all deletable (consistent with ADR-083 localStorage pattern)
- The portal's taxonomy is canonical and editorial; the seeker's taxonomy is intimate and uncurated
- Personal collection names are never sent to the server, never appear in analytics, never inform the portal's theme system
- Phase 13 server sync preserves personal names if the seeker opts in

This transforms the Study Workspace from a composition tool into a personal spiritual workspace — a private space for organizing the teachings around one's own life, not the portal's categories.

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

## ADR-035, ADR-063, ADR-064: Image Serving Architecture

Images are stored in S3 and served via CloudFront. At ingestion, the Lambda pipeline generates five named size tiers in dual format (WebP + JPEG):

| Tier | Max dimension | Use case |
|------|--------------|----------|
| `thumb` | 300px | Gallery grids, chat previews |
| `small` | 640px | Social sharing, messaging |
| `medium` | 1200px | Web use, presentations |
| `large` | 2400px | Wallpapers, high-DPI displays |
| `original` | Source | Print, archival |

**Storage:** `s3://srf-portal-images/{image-id}/{tier}.{format}`

**Download endpoint:** `GET /api/v1/images/{slug}/download?size=medium&format=webp` — returns 302 redirect to CloudFront URL with `Content-Disposition: attachment`.

**Watermarking per tier (ADR-063):**
- All tiers: EXIF/XMP metadata (Phase 1)
- `medium`, `large`, `original`: C2PA Content Credentials (Phase 12)
- `original` of sacred images: steganographic watermark (Phase 12)

**Service file:** `/lib/services/images.ts` — image queries, size resolution, download URL generation.

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

## DES-051: Portal Updates Page — "The Library Notice Board"

A dedicated `/updates` page presenting seeker-facing release notes in the portal's contemplative editorial voice (ADR-074). Linked from the site footer. Governed by ADR-105.

### Data Model

```sql
-- Portal updates (seeker-facing changelog)
CREATE TABLE portal_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,                          -- seeker-facing title (e.g., "The Library has grown")
  summary TEXT NOT NULL,                        -- 1–2 sentence summary for RSS and /updates listing
  body TEXT,                                    -- full update text (Markdown)
  category TEXT NOT NULL CHECK (category IN (
    'new_content',                              -- new books, audio, video added
    'new_language',                             -- new language activated
    'new_feature',                              -- major new page or capability
    'improvement'                               -- seeker-noticeable UX improvement
  )),
  language TEXT NOT NULL DEFAULT 'en',          -- i18n from the start
  published_at TIMESTAMPTZ,                    -- NULL = draft, non-NULL = published
  season_label TEXT NOT NULL,                   -- "Winter 2026", "Spring 2027" — editorial, not computed
  drafted_by TEXT NOT NULL DEFAULT 'auto',      -- 'auto' (AI-drafted) or 'manual' (human-written)
  reviewed_by TEXT,                             -- editor who approved for publication
  deployment_ref TEXT,                          -- git tag or deployment ID that triggered the draft
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_portal_updates_published ON portal_updates(published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX idx_portal_updates_language ON portal_updates(language);
```

### API

```
GET /api/v1/updates
  ?language=en            -- default: en
  ?cursor=<uuid>          -- cursor-based pagination
  ?limit=20               -- default: 20

Response: {
  updates: [{ id, title, summary, body, category, season_label, published_at }],
  cursor: <next_cursor>
}
```

### Page Design

Located at `/updates` — linked from site footer as "What's new in the portal."

```
┌─────────────────────────────────────────────┐
│ What's New in the Portal                    │
│                                             │
│ Spring 2027                                 │
│ ─────────────────────────                   │
│                                             │
│ The Library has grown                       │
│ Three new books join the collection:        │
│ Man's Eternal Quest, The Divine Romance,    │
│ and Journey to Self-Realization.            │
│                                             │
│ The teachings are now connected             │
│ Explore how Yogananda's ideas flow across   │
│ books — the Related Teachings panel shows   │
│ connections as you read.                    │
│                                             │
│ Winter 2026                                 │
│ ─────────────────────────                   │
│                                             │
│ The portal opens                            │
│ Autobiography of a Yogi — free to the       │
│ world. Search Yogananda's words, read       │
│ chapter by chapter, find a quiet moment     │
│ in the Quiet Corner.                        │
│                                             │
│             ─── ◊ ───                       │
│                                             │
│ RSS: /feed/updates.xml                      │
└─────────────────────────────────────────────┘
```

### Typography and Layout

- **Heading:** "What's New in the Portal" — Merriweather 400, `--text-xl`, `--srf-navy`
- **Season headings:** Merriweather 400 italic, `--text-lg`, `--srf-navy`, with gold rule beneath
- **Update titles:** Merriweather 400, `--text-base`, `--srf-navy`
- **Update body:** Lora 400, `--text-sm`, `--text-body`
- **Max width:** `38rem` (same as reader — this is a reading page)
- **Generous whitespace** between seasons and between updates — each update breathes
- **No dates on individual updates** — seasonal grouping provides temporal context without SaaS-like timestamp precision
- **Lotus divider** between seasons (same `◊` pattern as reader chapter dividers)

### Editorial Workflow

1. **Trigger:** Deployment to production, or portal coordinator identifies a seeker-visible change
2. **AI drafts:** Claude reads deployment metadata (git tag, commit messages since last update) and drafts a seeker-facing summary following ADR-105 voice standards. Draft enters the `updates` review queue in the editorial portal (DES-033)
3. **Human review:** Portal coordinator or content editor reviews, edits for voice consistency, and publishes. Same keyboard-driven workflow as other review queues
4. **Publication:** Update appears on `/updates` page and in `/feed/updates.xml` RSS feed

**Frequency:** Not every deployment generates an update. Only seeker-visible changes warrant a notice. The portal coordinator exercises editorial judgment about what rises to the level of a seeker-facing update. Internal infrastructure changes, bug fixes, and performance improvements are omitted.

### RSS Feed

`/feed/updates.xml` — RSS 2.0, alongside existing content feeds planned in Phase 8 (deliverable 8.6). Each item includes title, summary, category, and portal link.

### Phase Delivery

| Phase | What Ships |
|-------|-----------|
| **Phase 4** | `/updates` page, `portal_updates` table, AI draft pipeline, review queue. First entries cover Phases 0–4 retrospectively. |
| **Phase 8** | `/feed/updates.xml` RSS feed alongside other RSS feeds. |
| **Phase 10+** | Multilingual update notes via ADR-078 translation workflow. |

### Accessibility

- Semantic HTML heading hierarchy: `<h1>` page title, `<h2>` season headings, `<h3>` update titles
- Clean, text-first layout — ideal for screen readers (heading-level navigation)
- RSS feed provides alternative access channel
- ARIA label: "What's new in the portal — a record of how the library has grown"

*Section added: 2026-02-22, ADR-105*

---

## DES-052: Outbound Webhook Event System

The portal publishes content lifecycle events to registered HTTP subscribers via a lightweight outbound webhook system (ADR-106). This decouples content pipelines from distribution channels — new consumers (Zapier workflows, internal bots, partner integrations) subscribe to events without modifying content code.

### Architecture

```
Content Lifecycle (book published, passage rotated, asset approved)
      │
      ▼
┌─────────────────────┐
│ Event Emitter        │  Fires event to webhook_deliveries table
│ (in content service) │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Delivery Worker      │  Vercel cron (Phase 8) or Lambda (Phase 10+)
│ (background job)     │  Reads pending deliveries, POSTs to subscribers
└────────┬────────────┘
         │
    ┌────┴────┬──────────┬──────────────┐
    ▼         ▼          ▼              ▼
 Zapier    Slack Bot   RSS Regen    CDN Pre-warm
```

### Event Catalog Summary

| Event | Trigger | Key Consumers |
|-------|---------|---------------|
| `daily_passage.rotated` | Midnight UTC | Zapier → email, WhatsApp broadcast |
| `content.published` | New book/chapter/audio/video | Sitemap regen, CRM update, RSS regen |
| `content.updated` | Content correction | CDN cache purge, RSS regen |
| `social_asset.approved` | Staff approves quote image | Social scheduling tools |
| `portal_update.published` | New portal changelog entry | Internal Slack, RSS regen |

Full catalog, envelope format, delivery semantics, and schema in ADR-106.

### Admin UI (Phase 8, editorial portal)

- Subscriber list with event subscriptions and active/suspended status
- Delivery log (30-day rolling) with success/failure and response codes
- "Test" button per subscriber to verify connectivity
- Suspend/Resume controls for failing endpoints

### DELTA Compliance

Events describe content lifecycle only — never seeker behavior. No PII in any payload. The `email.dispatched` event reports `subscriber_count` (aggregate), not individual addresses.

*Section added: 2026-02-22, ADR-106*

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
| **Books** | PDF → structured text | Paragraph (ADR-048) | Page number verification, edition alignment | chunk_relations, theme_membership |
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

## DES-054: Knowledge Graph Ontology

The knowledge graph captures the relationships between teachings, teachers, concepts, and experiences that make Yogananda's corpus a web of interconnected wisdom rather than a flat document collection. The graph ontology is designed in Phase 0; Neptune Analytics hosts the graph starting in Phase 4 (ADR-117).

### Node Types

| Node Type | Description | Primary Key Source | Phase |
|-----------|-------------|-------------------|-------|
| **Teacher** | Yogananda, his line of gurus, other teachers he references | `entity_registry` (type = 'person') | 4 |
| **DivineName** | God, Divine Mother, Christ, Krishna, Cosmic Consciousness | `entity_registry` (type = 'divine_name') | 4 |
| **Work** | Published books, collections, individual poems/chants | `books` table | 4 |
| **Technique** | Kriya Yoga (public description only), Hong-Sau, Energization | `entity_registry` (type = 'technique') | 4 |
| **SanskritTerm** | Samadhi, maya, karma, dharma — with canonical forms | `sanskrit_terms` table | 4 |
| **Concept** | Abstract teachings: divine love, self-realization, willpower | `entity_registry` (type = 'concept') | 4 |
| **Scripture** | Bhagavad Gita, Bible, Rubaiyat — works Yogananda comments on | `entity_registry` (type = 'scripture') | 6 |
| **ExperientialState** | States of consciousness (waking → nirvikalpa samadhi) | `entity_registry` (type = 'state') | 4 |
| **Place** | Ranchi, Encinitas, Dakshineswar — biographical/spiritual places | `places` table | 4 |
| **Chunk** | Individual text passages from the corpus | `book_chunks` table | 4 |

All node types carry a `neptune_node_id` that maps back to the source Postgres row. Chunk nodes carry Voyage embeddings (ADR-118) enabling combined traversal + similarity queries in a single openCypher statement.

### Edge Types

| Edge Type | From → To | Description | Phase |
|-----------|-----------|-------------|-------|
| **LINEAGE** | Teacher → Teacher | Guru-disciple relationship | 4 |
| **AUTHORED** | Teacher → Work | Authorship attribution | 4 |
| **TEACHES** | Chunk → Concept | Passage teaches or discusses a concept | 4 |
| **MENTIONS** | Chunk → SanskritTerm | Sanskrit term appears in passage | 4 |
| **REFERENCES** | Chunk → Scripture | Passage quotes or comments on scripture | 6 |
| **DESCRIBES_STATE** | Chunk → ExperientialState | Passage describes a state of consciousness | 4 |
| **LOCATED_AT** | Teacher → Place | Biographical association | 4 |
| **NEXT / PREV** | Chunk → Chunk | Sequential reading order within a book | 4 |
| **RELATED_CONCEPT** | Concept → Concept | Conceptual relationship (broader/narrower) | 4 |
| **CROSS_TRADITION** | Concept → Concept | Yogananda's explicit cross-tradition mapping | 6 |
| **TECHNIQUE_FOR** | Technique → ExperientialState | Practice leads toward state | 4 |

### Graph Algorithms (Nightly Batch)

Three algorithms run nightly on the full graph and feed suggestion weights and retrieval confidence:

1. **PageRank** — Identifies the most-connected, highest-authority passages and concepts. Feeds the "canonical teaching" signal in Related Teachings (ADR-050).
2. **Community Detection** — Groups densely connected nodes into teaching clusters. Feeds thematic browsing and the Quiet Index (DES-029).
3. **Betweenness Centrality** — Finds bridge passages that connect otherwise separate teaching domains. These are the passages that link, say, meditation technique to devotional practice. Surfaced in Reading Arc suggestions (Phase 8+).

### GraphRAG Query Pattern

```
// Example: Find teachings related to "meditation" within 2 hops
MATCH (c:Concept {canonical: 'meditation'})<-[:TEACHES]-(chunk:Chunk)
WITH chunk, c
OPTIONAL MATCH (chunk)-[:RELATED_CONCEPT]->(related:Concept)
WITH chunk, collect(DISTINCT related.canonical) AS related_concepts
WHERE neptune.algo.vectors.cosine(chunk.embedding, $query_embedding) > 0.7
RETURN chunk.chunk_id, chunk.content_preview, related_concepts,
       neptune.algo.vectors.cosine(chunk.embedding, $query_embedding) AS similarity
ORDER BY similarity DESC
LIMIT 20
```

This query combines graph traversal (concept → chunk) with vector similarity (Voyage embedding cosine) in a single openCypher statement — the core value proposition of Neptune Analytics over pure Postgres graph approaches.

**Governed by:** ADR-117 (Neptune Analytics), ADR-116 (Entity Registry), ADR-050 (Related Teachings)

*Section added: 2026-02-23, ADR-117*

---

## DES-055: Concept/Word Graph

The Concept/Word Graph is a specialized subgraph within the knowledge graph (DES-054) focused on vocabulary relationships — how Yogananda's terminology connects across traditions, Sanskrit sources, and progressive spiritual development. It powers word graph query expansion in the search pipeline (Phase 4+, Path C in DES-003) and the Concept Graph UI exploration (Phase 12).

### Term Node Schema

Each term in the concept graph is a node with:

```
{
  canonical: "samadhi",            // Canonical form
  display: "Samādhi",              // Display form with diacritics
  devanagari: "समाधि",             // Devanagari script (if Sanskrit)
  iast: "samādhi",                 // IAST transliteration
  type: "sanskrit_term",           // Node type
  domain: "consciousness",         // Domain classification
  depth_level: 6,                  // Experiential depth (1–7)
  definition_srf: "...",           // SRF-specific definition
  embedding: [...]                 // Voyage voyage-3-large embedding
}
```

### Edge Types (Concept-Specific)

| Edge Type | Description | Example |
|-----------|-------------|---------|
| **SYNONYM_OF** | Same concept, different term | samadhi ↔ cosmic consciousness |
| **BROADER_THAN** | Hierarchical: broader concept | meditation → concentration |
| **CROSS_TRADITION_EQUIVALENT** | Yogananda's explicit mapping | kundalini ↔ Holy Ghost |
| **SRF_INTERPRETS_AS** | SRF-specific interpretation | baptism → spiritual awakening |
| **TRANSLITERATION_OF** | Same word, different script | samadhi ↔ समाधि |
| **CO_OCCURS_WITH** | Frequently appear together in passages | devotion ↔ meditation |
| **PROGRESSION_TO** | Sequential development | concentration → meditation → samadhi |
| **PRACTICE_LEADS_TO** | Practice produces state | Kriya Yoga → spiritual perception |

### Construction Process

```
Phase 4: Canonical Vocabulary Seed
 └── Extract from entity_registry + sanskrit_terms tables
 └── Claude generates initial edges from domain knowledge
 └── Human review validates all edges

Phase 8: Cross-Tradition Extraction
 └── Mine Yogananda's explicit cross-tradition statements from corpus
 └── "The Hindu scriptures teach that [...] is what Christ called [...]"
 └── Constrained to Yogananda's own explicit mappings only

Phase 8: Progression Chains
 └── Extract sequential development paths from teaching passages
 └── Validate against SRF pedagogical tradition

Phase 8: Co-occurrence Edges
 └── Statistical co-occurrence from chunk enrichment data
 └── Filtered: minimum 3 co-occurrences, mutual information > threshold
```

### Word Graph Query Expansion (Phase 4+)

When the search pipeline reaches the graph traversal step (DES-003, Step 6, Path C), the concept graph enables vocabulary-aware expansion:

```
Seeker searches: "how to achieve enlightenment"
 │
 ▼
Entity resolution: "enlightenment" → Concept node
 │
 ▼
Graph traversal (1–2 hops):
 SYNONYM_OF: "Self-realization", "cosmic consciousness"
 PROGRESSION_TO: "meditation" → "samadhi"
 CROSS_TRADITION: "nirvana" (Buddhism), "salvation" (Christianity)
 │
 ▼
Expanded retrieval includes passages mentioning any of these terms
```

### Scope Constraint

Cross-tradition mappings are limited to Yogananda's own explicit mappings. The portal does not extend theological interpretation beyond what appears in the published corpus. If Yogananda wrote that kundalini is "what the Christians call the Holy Ghost," that mapping exists. If he did not make a specific mapping, it does not exist in the graph — regardless of how obvious it might seem to a scholar. The librarian finds; the librarian does not interpret.

**Governed by:** ADR-117 (Neptune Analytics), ADR-116 (Entity Registry), ADR-001 (Librarian, Not Oracle)

*Section added: 2026-02-23, ADR-117*

---

## DES-056: Feature Catalog (RAG Architecture Proposal)

This section catalogs the features proposed in the RAG Architecture Proposal (`docs/reference/RAG_Architecture_Proposal.md`) that were accepted for integration into the project. Each feature has a phase assignment, governing ADRs, and key dependencies. The reference document contains the full design exploration; this catalog tracks what was adopted and when it ships.

### Accepted for Design Integration

These features are actively designed into the architecture and have governing ADRs:

| Feature | Phase | Governing ADRs | Key Dependencies |
|---------|-------|----------------|------------------|
| **Related Teachings — Categorized** | 3 (similarity), 4+ (graph-categorized) | ADR-050, ADR-117 | Chunk relations (Phase 0), Neptune (Phase 4) |
| **Contemplative Companion** | 6+ | ADR-050, ADR-115, ADR-117 | Enrichment metadata (experiential_depth, voice_register), knowledge graph |
| **Scripture-in-Dialogue** | 6 | ADR-117, ADR-116 | Scripture nodes in knowledge graph, verse-level chunking for Gita/Bible commentaries |
| **Reading Arc** | 8 | ADR-117, ADR-115 | Graph algorithms (PageRank, betweenness centrality), experiential depth progression |
| **Living Commentary** | 6 | ADR-050, ADR-115 | Cross-reference extraction in enrichment pipeline, inline reference cards |

**Related Teachings — Categorized:** When a seeker reads a passage, the side panel shows not just *that* other passages are related but *why*. Five relationship categories: Same Concept, Deeper in This Theme, Another Teacher's Expression, Parallel Tradition, Technique for This State. Phase 3 uses embedding similarity to approximate categories. Phase 4+ uses graph traversal for true categorization.

**Contemplative Companion:** A depth-aware reading mode that, given a passage, surfaces the contemplative arc: preparatory teachings → the passage itself → deeper explorations → related practices. Uses experiential_depth (1–7 scale) and voice_register enrichment metadata to build the arc. Not a chatbot — a curated pathway through existing content.

**Scripture-in-Dialogue:** For Yogananda's scriptural commentaries (God Talks with Arjuna, The Second Coming of Christ), presents the original scripture verse alongside Yogananda's interpretation, with CROSS_TRADITION_EQUIVALENT edges linking parallel verses across traditions. Navigation follows the scripture's structure, not the book's page order.

**Reading Arc:** Multi-session guided paths through the corpus, constructed from graph analysis. A seeker interested in "meditation" receives a progressive sequence from introductory passages through advanced teachings, following the PROGRESSION_TO edges and experiential_depth ordering. Paths are computed, not editorially curated — but editorial review approves before publication.

**Living Commentary:** Yogananda's commentaries are dense with internal cross-references ("as I explained in Chapter X"). The enrichment pipeline extracts these references; Living Commentary makes them navigable. Inline reference cards show a verbatim preview of the referenced passage without leaving the current reading position.

### Deferred with Phase Assignment

These features are documented and phase-assigned but not yet actively designed:

| Feature | Phase | Key Dependency | Notes |
|---------|-------|---------------|-------|
| **Knowledge Graph Exploration UI** | 12 | DES-054, Neptune | react-force-graph-3d, interactive 3D visualization |
| **Concept/Word Graph Exploration UI** | 12 | DES-055, Neptune | D3 + WebGL progressive enhancement |
| **Lineage Voice Comparator** | 8 | ADR-117, ADR-115 | Compare how Yogananda and his gurus discuss the same concept |
| **Evolution of a Teaching** | 8 | ADR-117, temporal metadata | How Yogananda's expression of a concept evolved across books over decades |
| **Cosmic Chants as Portal** | 9 | ADR-117, chant content | If chants are in corpus scope: verse-by-verse with Yogananda's explanations |
| **Passage Genealogy** | 8 | ADR-117, cross-reference extraction | The lineage of thought behind each passage — what influenced it |
| **Semantic Drift Detection** | 8 | ADR-115, temporal metadata | Staff tool: detect when the same term shifts meaning across books |
| **Consciousness Cartography** | 12+ | DES-054, DES-055, Neptune | Stretch goal: visual map of consciousness states and their relationships |

### Explicitly Omitted

| Feature | Reason | See |
|---------|--------|-----|
| **Healing Architecture** | Creating a structured condition-to-practice graph risks health claims positioning. Scientific Healing Affirmations is searchable as a book; no structured healing graph. | Annotated in reference document |
| **Inter-Tradition Bridge** (beyond corpus) | The portal surfaces Yogananda's own explicit cross-tradition mappings. Extending beyond his words is theological interpretation, violating ADR-001. | Annotated in reference document |

*Section added: 2026-02-23, RAG Architecture Proposal merge*

---

## Open Questions

See CONTEXT.md § Open Questions for the consolidated list. Technical and stakeholder questions live there so they're visible at session start and move to "Resolved" as work progresses. Architectural questions that arise during implementation should be added to CONTEXT.md and, if they require a decision, captured as an ADR in DECISIONS.md.

---
