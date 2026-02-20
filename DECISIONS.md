# SRF Online Teachings Portal — Architecture Decision Records

Each decision is recorded with full context so future contributors understand not just *what* was decided but *why*, and what alternatives were considered.

### Index by Concern

**Search & AI**
- ADR-001: Neon + pgvector for Vector Search
- ADR-003: Direct Quotes Only — No AI Synthesis
- ADR-006: Hybrid Search (Vector + Full-Text)
- ADR-007: Claude API for AI Features
- ADR-032: Embedding Model Versioning and Migration
- ADR-034: Related Teachings — Pre-Computed Chunk Relations
- ADR-049: Claude AI Usage Policy — Permitted Roles and Prohibited Uses
- ADR-052: Terminology Bridge Per-Book Evolution Lifecycle
- ADR-068: "What Is Humanity Seeking?" — Anonymized Search Intelligence
- ADR-094: "What Is Humanity Seeking?" — Public-Facing Dashboard
- ADR-097: Passage Resonance Signals — Content Intelligence Without Surveillance
- ADR-098: Knowledge Graph Visualization

**Content Strategy**
- ADR-002: Contentful as Editorial Source of Truth
- ADR-005: Autobiography of a Yogi as Phase 1 Focus
- ADR-012: Book Ingestion Priority — Life-Impact Ordering
- ADR-013: Teaching Topics — Curated Thematic Entry Points
- ADR-015: Passage Sharing as Organic Growth
- ADR-016: Sacred Image Usage Guidelines
- ADR-018: Daily Email — Verbatim Passage Delivery
- ADR-019: Social Media Strategy
- ADR-026: Events and Sacred Places
- ADR-035: "Seeking..." — Empathic Entry Points
- ADR-048: Teaching Topics — Semi-Automated Tagging Pipeline
- ADR-054: Editorial Reading Threads — "Teachings in Conversation"
- ADR-055: Reverse Bibliography — "What Yogananda Read"
- ADR-056: Calendar-Aware Content Surfacing and Quiet Index
- ADR-058: Exploration Theme Categories — Persons, Principles, Scriptures, Practices
- ADR-059: Sharing Formats — Email, PDF, and Download
- ADR-069: Edition-Aware Content Model
- ADR-086: Image Content Type — Photographs as First-Class Content
- ADR-092: People Library — Spiritual Figures as First-Class Entities
- ADR-093: Living Glossary — Spiritual Terminology as User-Facing Feature
- ADR-096: "Start Here" — Newcomer Path
- ADR-100: Calendar Reading Journeys — Structured Multi-Day Experiences
- ADR-103: Content Integrity Verification
- ADR-104: "What's New in the Library" Indicator
- ADR-105: Magazine Integration — Self-Realization Magazine as First-Class Content
- ADR-114: Grief and Loss as Primary Empathic Entry Point
- ADR-118: "Teachings Through Time" — Temporal Dimension of the Corpus

**Reader Experience**
- ADR-036: Book Reader Typography
- ADR-037: Reader Typography Refinements
- ADR-038: "Dwell" — Passage Contemplation Mode
- ADR-039: Circadian Color Temperature
- ADR-040: "Breath Between Chapters"
- ADR-041: Lotus Bookmarks
- ADR-042: Keyboard-First Reading Navigation
- ADR-046: "Show Me Another" — Infinite Wisdom
- ADR-050: Reading Time Estimate, Scroll Position, Reader Settings
- ADR-060: Dwell Discoverability — Hover-to-Reveal Activation Button
- ADR-062: Related Teachings — Reading Focus Detection and Progressive Loading
- ADR-063: Reading Session — Proactive Chapter Caching and Prefetch
- ADR-073: Ephemeral Reading Highlights
- ADR-074: Side-by-Side Commentary View
- ADR-117: "Following the Thread" — Named Graph Traversal Experience
- ADR-075: Study Guide View for Group Reading
- ADR-076: Audio-Visual Ambiance Toggle
- ADR-095: Contextual Quiet Corner — Practice Bridge in the Reader
- ADR-101: Quiet Corner Audio from Phase 2

**Visual Identity**
- ADR-008: SRF-Derived Design System
- ADR-043: Opening Moment — Portal Threshold
- ADR-044: Lotus as Unified Visual Motif
- ADR-045: SRF Imagery Strategy

**Architecture & Infrastructure**
- ADR-004: Next.js + Vercel for Frontend
- ADR-009: Phase 1 Uses Vercel, Not AWS Lambda
- ADR-010: Removed — Original Scope Eliminated
- ADR-011: YouTube Integration via Hybrid RSS + API
- ADR-024: API-First Architecture
- ADR-025: Progressive Web App
- ADR-027: Engineering Standards for SRF Projects
- ADR-028: Testing Strategy
- ADR-029: Observability Strategy
- ADR-030: Design Tooling — Figma
- ADR-031: Infrastructure as Code (Terraform)
- ADR-033: Architecture Longevity — 10-Year Horizon
- ADR-047: Street View Links (No Embedded Maps)
- ADR-051: Bookstore URL Simplification
- ADR-065: AWS Lambda for Batch and Background Workloads
- ADR-066: Content-Addressable Passage Deep Links
- ADR-067: Search API Rate Limiting and Abuse Prevention
- ADR-070: CI-Agnostic Deployment Scripts
- ADR-071: Native Share API as Primary Mobile Sharing
- ADR-072: Database Backup to S3
- ADR-080: Multi-Tenant Infrastructure Design
- ADR-082: Redundancy, Failover, and Regional Distribution Strategy
- ADR-083: PDF Generation Strategy — Resource-Anchored Exports
- ADR-090: MCP Server Strategy — Development Tooling for AI Implementation
- ADR-091: Language API Design — Locale Prefix on Pages, Query Parameter on API
- ADR-108: Phase 1 Bootstrap Ceremony
- ADR-109: Single-Database Architecture — No DynamoDB
- ADR-110: AWS Bedrock Claude with Model Tiering
- ADR-115: Chunking Strategy Specification

**Ethics & Internationalization**
- ADR-014: Personalization with Restraint — DELTA Boundaries
- ADR-017: Accessibility as Phase 2 Foundation
- ADR-020: Multi-Language Architecture
- ADR-021: CSS Logical Properties
- ADR-022: Hindi and Bengali in Locale Roadmap
- ADR-023: AI-Assisted Translation Workflow
- ADR-061: Global Equity — Serving Earth's Underserved Seekers
- ADR-079: YSS Organizational Branding and Locale Strategy
- ADR-084: Machine-Readable Content and AI Citation Strategy
- ADR-085: Low-Tech and Messaging Channel Strategy
- ADR-102: Practice Bridge After Search

**Cross-Media**
- ADR-057: Video Transcript Time-Synced Architecture
- ADR-078: Audio Library and Cross-Media Audio Search
- ADR-087: Unified Content Hub — Cross-Media Relations, Search, and Theming
- ADR-088: Platform-Agnostic Video Model and Documentary Integration
- ADR-089: Multi-Media Editorial Threads and Continue the Thread

**Staff & Editorial Workflows**
- ADR-064: Staff Experience Architecture — Five-Layer Editorial System
- ADR-077: ~~Talk Preparation Workspace~~ → Superseded by ADR-111
- ADR-099: Study Circle Sharing
- ADR-111: Study Workspace — Universal Teaching Tools Without Authentication
- ADR-116: DELTA-Compliant Seeker Feedback Mechanism

**Image & Media Provenance**
- ADR-106: Digital Watermarking Strategy for SRF Images
- ADR-107: Multi-Size Image Serving and Download Options

**Brand & Communications**
- ADR-112: "The Librarian" — AI Search Brand Identity
- ADR-113: "What Is Humanity Seeking?" as Strategic Communications Asset

**Documentation & Process**
- ADR-119: Documentation Architecture — Five-Document System with AI-First Navigation

**Community & Future Readiness**
- ADR-081: Lessons Integration Readiness

**Withdrawn**
- ~~ADR-053: Search Query Retention and Aggregation Strategy~~ (deliberately withdrawn — raw table is sufficient)

---

## ADR-001: Neon + pgvector for Vector Search

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The Intelligent Query Tool requires semantic (vector) search to find thematically relevant passages even when the user's wording differs from Yogananda's. Options evaluated:

| Option | Pros | Cons |
|--------|------|------|
| **Neon + pgvector** | Already in SRF stack; vector + FTS + relational in one DB; free tier available; no vendor sprawl | Not a purpose-built vector DB; HNSW index tuning required |
| **Pinecone** | Purpose-built vector search; managed; fast | New vendor; no relational data; no FTS; cost at scale; sync complexity |
| **Weaviate / Qdrant** | Strong vector search; hybrid search built-in | New vendor; operational overhead if self-hosted; overkill for corpus size |
| **Supabase** | Postgres + pgvector + auth + storage all-in-one | SRF chose Neon, not Supabase; diverges from established stack |

### Decision

Use **Neon PostgreSQL with the pgvector extension** for both relational data and vector search. Combine with Postgres full-text search (tsvector) for hybrid retrieval.

### Rationale

- Neon is already in the SRF tech stack (established by the AE team)
- Avoids introducing a new vendor for a corpus of this size (~10-50K chunks)
- Hybrid search (vector + FTS) in a single SQL query is architecturally simple
- The Neon MCP server is available for development workflows
- pgvector's HNSW index performs well at this scale
- Single database eliminates synchronization problems between stores

### Consequences

- Must enable the `vector` extension in Neon
- Must choose an embedding model whose dimensions align with the vector column
- Performance at very large scale (millions of chunks, many languages) may eventually require a dedicated vector service — but that is far beyond Phase 1 scope

---

## ADR-002: Contentful as Editorial Source of Truth (Production)

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Book text needs to live somewhere with editorial management: version control, review workflows, multi-language support, and a non-technical editing interface. The SRF tech stack designates Contentful as the standard headless CMS. The convocation site (convocation.yogananda.org) already proves this pattern works.

| Option | Pros | Cons |
|--------|------|------|
| **Contentful** | SRF standard; editorial workflow; locales; Rich Text AST is parseable for chunking; convocation site proves pattern | Free tier limited (10K records, 2 locales); cost at scale; not a search engine |
| **Neon only** | Simplest; no sync complexity; full control | No editorial UI (would need Retool); no version history; no localization workflow |
| **Sanity.io** | Excellent DX; real-time collaboration; generous free tier | Not in SRF stack; would diverge from organizational standard |
| **Strapi (self-hosted)** | Open-source; full control; no per-record pricing | Operational overhead; not in SRF stack; no edge CDN |

### Decision

Use **Contentful** as the editorial source of truth for production. Book text is authored and managed in Contentful, then synced to Neon (via webhooks) for search indexing. For Phases 1–9, books are ingested directly into Neon from PDFs, but the schema is designed to accommodate Contentful IDs for future integration.

### Rationale

- Aligns with SRF's established technology standard
- Demonstrates the pattern for stakeholders (reusable across all SRF properties)
- Content editors work in a familiar, managed environment
- Multi-language support via Contentful locales
- Separation of concerns: Contentful for authoring, Neon for searching

### Consequences

- Production requires a Contentful → Neon sync service (webhook-driven)
- The Neon schema includes `contentful_id` columns for linkage
- Phases 1–9 operate without Contentful (PDF → Neon direct) but the schema is designed for easy Contentful integration later
- Contentful pricing must be evaluated for the full corpus (may exceed free tier)

---

## ADR-003: Direct Quotes Only — No AI Synthesis

- **Status:** Accepted (FIRM — foundational requirement)
- **Date:** 2026-02-17

### Context

The Intelligent Query Tool could operate in two modes:

1. **Synthesis mode:** AI reads retrieved passages and generates a natural-language answer in its own words, citing sources.
2. **Librarian mode:** AI finds and ranks the most relevant passages but the user reads only Yogananda's verbatim text.

### Decision

**Librarian mode only.** The AI's role is strictly limited to:
- Expanding user queries into semantic search terms
- Ranking retrieved passages by relevance
- Identifying highlight boundaries within long passages

The AI **never**:
- Generates text that could be mistaken for Yogananda's words
- Paraphrases, summarizes, or synthesizes across passages
- Interprets meditation techniques or spiritual practices
- Answers questions not addressable from the corpus

### Rationale

- **Sacred text fidelity:** Yogananda's words are considered transmitted teachings from a realized master. Even subtle paraphrasing can distort meaning. "God-consciousness" and "cosmic consciousness" are not interchangeable in this tradition.
- **Hallucination risk:** LLMs generate plausible but incorrect statements. In a spiritual context, a hallucinated teaching could be spiritually harmful.
- **Trust:** Users can verify every result against the source text. There is nothing to hallucinate because the AI generates no content.
- **Theological alignment:** The DELTA framework principle of Agency — the AI facilitates access to the teachings, it does not become a teacher.
- **Simplicity:** The Librarian model is architecturally simpler, cheaper (fewer LLM tokens), and more reliable than synthesis.

### Consequences

- **Chunking quality is paramount.** Each chunk must be a coherent, self-contained passage suitable for display as a standalone quote.
- **The "Read in context" link is critical.** Every search result must deep-link to the full chapter view, positioned at that passage.
- **The "no results" case must be handled gracefully.** When the corpus doesn't address a query, the system must say so honestly rather than stretching to find something.
- **The AI's output format is constrained.** Query expansion returns a JSON array of terms. Passage ranking returns a JSON array of IDs. No prose output.
- **Consolidated in ADR-049:** The full Claude AI Usage Policy — permitted roles, prohibited uses, output format constraints, and expansion roadmap — is maintained in ADR-049.

---

## ADR-004: Next.js + Vercel for Frontend

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The SRF tech stack designates Next.js on Vercel as the standard frontend stack. The convocation site uses this. No alternative was seriously considered.

### Decision

Use **Next.js on Vercel** with **Tailwind CSS** for the frontend.

### Rationale

- SRF organizational standard
- SSG for book reader pages (fast, SEO-friendly, cacheable)
- API routes for search endpoints (serverless, no separate backend for Phase 1)
- ISR for content updates when Contentful is integrated
- Vercel edge caching for global performance

### Consequences

- Phase 1 can use Next.js API routes instead of AWS Lambda (simpler)
- Production may migrate search API routes to Lambda if needed for scale or separation

---

## ADR-005: Autobiography of a Yogi as Phase 1 Focus

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The SRF corpus spans dozens of books and thousands of pages. Phase 1 needs a single book to prove the search pattern.

| Book | Pages | Why Consider | Why Not |
|------|-------|-------------|---------|
| **Autobiography of a Yogi** | ~500 | Most widely read; accessible; diverse topics; narrative style | Less scriptural commentary |
| The Second Coming of Christ | ~1,600 | Rich scriptural commentary; verse-by-verse structure tests chunking | Massive; OCR quality uncertain; 2 volumes |
| God Talks With Arjuna | ~1,200 | Dense philosophical content; tests semantic search depth | Similar concerns as above |

### Decision

Start with **Autobiography of a Yogi**.

### Rationale

- Most recognizable and accessible Yogananda work
- Moderate size (~500 pages, manageable for manual QA)
- Contains diverse topics (meditation, miracles, science, daily life, relationships, death) — good for testing search breadth
- Narrative prose style tests the chunking strategy differently than verse commentary
- Available in many translations (useful for future multi-language testing)

### Consequences

- The chunking strategy optimized for narrative prose may need adjustment for verse-by-verse commentary books (Second Coming, Bhagavad Gita) later
- Phase 1 demonstrates the concept on the most popular book, which is strategically useful for stakeholder presentations

---

## ADR-006: Hybrid Search (Vector + Full-Text)

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Two search paradigms exist:

| Approach | Strengths | Weaknesses |
|----------|-----------|------------|
| **Vector-only** | Finds semantically similar passages even without keyword overlap | Misses exact phrases; less precise for specific terms |
| **Full-text-only** | Precise keyword matching; fast; no embedding cost | Misses conceptual/semantic matches; requires exact terms |
| **Hybrid (RRF)** | Best of both; catches conceptual AND exact-phrase queries | More complex query logic |

### Decision

Use **hybrid search** with Reciprocal Rank Fusion (RRF) to merge vector similarity and full-text search results in a single Postgres query.

### Rationale

- A seeker searching "divine mother" wants exact keyword matches (FTS)
- A seeker searching "how to find inner peace" wants conceptual matches (vector)
- RRF is a proven, simple merging algorithm that requires no ML training
- Both search types run natively in Postgres — no external services

### Consequences

- Each chunk needs both an embedding vector AND a tsvector index
- The hybrid_search SQL function encapsulates the merging logic
- Weights between FTS and vector can be tuned based on query characteristics

---

## ADR-007: Claude API for AI Features

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The AI Librarian needs an LLM for query expansion and passage ranking. Options:

| Option | Pros | Cons |
|--------|------|------|
| **Claude (Anthropic)** | Strong instruction-following; good at constrained output; we're already in this ecosystem | API cost |
| **OpenAI GPT-4o** | Widely used; good performance | Different vendor from our dev tools |
| **Open-source (Llama, Mistral)** | No API cost; full control | Hosting complexity; weaker instruction-following for constrained tasks |
| **No LLM** | Zero cost; zero latency; zero risk | Loses query expansion and intelligent ranking |

### Decision

Use **Claude API (Anthropic)** for query expansion and passage ranking. Design the system so the LLM is optional — simple keyword queries bypass it entirely.

### Rationale

- Claude's instruction-following is strong for the constrained output formats we need (JSON arrays only, no prose)
- We're already using Claude Code for development — ecosystem alignment
- The Librarian model minimizes token usage (short system prompt, short output)
- Making the LLM optional for simple queries keeps costs low and provides a reliable fallback

### Consequences

- Need an Anthropic API key in production (cost: estimated $15-25/month with expanded uses)
- Must implement graceful degradation when the LLM is unavailable or rate-limited
- Query expansion and passage ranking prompts need careful design and testing
- **Extended by ADR-049:** Eight additional Claude use cases (E1–E8) approved within the librarian model, with full cost profile and graceful degradation paths

---

## ADR-008: SRF-Derived Design System with Calm Technology Principles

- **Status:** Accepted (updated with extracted design tokens)
- **Date:** 2026-02-17

### Context

Standard web design patterns (aggressive CTAs, gamification, notification badges, bright neon colors) conflict directly with SRF's theological commitment to "plain living and high thinking." Rather than inventing a new visual language, we extracted actual design tokens from live SRF properties to ensure brand consistency.

**Properties analyzed:**
- yogananda.org (Craft CMS — donate button, gold/navy palette, lotus icons)
- onlinemeditation.yogananda.org (WordPress/Astra — Merriweather + Lora fonts, form styling)
- convocation.yogananda.org (Next.js + Contentful — 7-locale setup)

### Decision

The portal adopts a **design system derived from existing SRF sites**, enhanced with Calm Technology constraints:

**Typography (from SRF Online Meditation Center):**
- **Merriweather** (300, 400, 700) — primary serif for book text and headings
- **Lora** (400) — secondary serif for chapter titles, decorative use
- **Open Sans** (400, 600) — sans-serif for UI chrome, navigation, labels

**Color palette (from yogananda.org + OMC):**
- SRF Gold `#dcbd23` — primary accent (donate button, lotus, CTAs)
- SRF Orange `#de6a10` — hover/active states
- SRF Navy `#1a2744` — headings, primary text (estimated from assets)
- Warm cream `#FAF8F5` — portal background (Calm Technology extension)
- Interactive blue `#0274be` — focus states, links

**Interaction patterns (from SRF donate button):**
- Gold border + gold text → orange fill on hover
- `transition: all 0.3s ease` for hover/focus states
- Pill-shaped CTA buttons (`border-radius: 50px`)

**Calm Technology constraints:**
- No gamification, no streaks, no badges, no leaderboards
- No aggressive notifications
- No decorative animations beyond subtle 0.3s transitions
- Generous whitespace treated as "digital silence"
- Warm backgrounds, never pure white

### Rationale

- **Brand consistency:** Same fonts and colors as existing SRF digital properties
- **Theological alignment:** Calm Technology principles match "plain living and high thinking"
- **Reusability:** These tokens can become a shared design system across all SRF properties
- **Familiarity:** Existing SRF devotees will recognize the visual language

### Consequences

- The design system should be documented as CSS custom properties (see DESIGN.md)
- WCAG contrast ratios must be validated — muted colors on warm cream backgrounds need careful checking
- The lotus icon SVG family from yogananda.org can be reused (with SRF's permission)
- A shared npm package could eventually serve these tokens to all SRF Next.js properties

---

## ADR-011: YouTube Integration via Hybrid RSS + API with ISR

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

SRF operates an active YouTube channel (@YoganandaSRF) with hundreds of videos: How-to-Live monastic talks, guided meditations, convocation sessions, and commemorative events. The Gemini research document emphasizes the importance of integrating this multimedia content with the book corpus.

Options for auto-updating YouTube content:

| Option | Cost | Content Available | Categorization |
|--------|------|-------------------|----------------|
| YouTube RSS feed | Free (no API key) | ~15 most recent only | None |
| YouTube Data API v3 | Free (10,000 units/day) | All videos, all playlists | Full (via playlists) |
| Manual curation | Free | Whatever is curated | Full (manual) |
| RSS + API hybrid | Free | Latest (RSS) + full library (API) | Full |

**Critical quota insight:** The `search.list` endpoint costs **100 units per call**. The `playlistItems.list` endpoint costs **1 unit per call** and returns the same data. Never use `search.list`.

### Decision

Use a **hybrid RSS + YouTube Data API** approach:

1. **RSS feed** (free, no key) for "Latest Videos" — the ~15 most recent uploads, revalidated hourly via Next.js ISR
2. **YouTube Data API v3** (free tier, 10,000 units/day) for the full categorized library — playlists mapped to site categories, revalidated every 6 hours via ISR
3. Videos categorized by mapping YouTube playlist titles to portal categories
4. Videos embedded via `youtube-nocookie.com` for privacy-enhanced playback

### Rationale

- **Auto-updating:** ISR ensures the portal reflects new YouTube content without manual intervention
- **Minimal cost:** ~50-100 API units/day (0.5-1% of free quota)
- **No new vendor:** YouTube is already SRF's video platform (the tech stack brief specifies Vimeo for *private* video; YouTube content is public)
- **Categorization via playlists:** SRF already organizes content into playlists — we map these to portal sections
- **Privacy:** `youtube-nocookie.com` embedding avoids tracking cookies until the user plays a video

### Consequences

- Requires a YouTube Data API key (free, obtained via Google Cloud Console)
- Playlist-to-category mapping needs initial configuration and occasional maintenance
- RSS provides only ~15 recent videos — the API is needed for the full library
- Future phase (8) can add video transcription for cross-media search (book passages + video segments)

---

## ADR-010: Removed — Original Scope Eliminated

**Status:** Removed

**Date:** 2026-02-19

This ADR number was allocated during early design exploration and subsequently removed when its scope was eliminated from the project. The number is retired to maintain a stable, sequential ADR numbering scheme. It was not superseded or withdrawn — the topic it addressed was removed from the project scope entirely.

---

## ADR-009: Phase 1 Uses Vercel, Not AWS Lambda/DynamoDB

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The SRF tech stack brief specifies AWS Lambda + API Gateway + DynamoDB for backend services. For Phase 1, focused on proving the AI search concept and delivering a working portal, this full stack introduces unnecessary complexity.

### Decision

Phase 1 uses **Next.js API routes** (running on Vercel) as the backend. No Lambda, no API Gateway, no DynamoDB. Neon PostgreSQL serves as the sole data store.

### Rationale

- Reduces Phase 1 to three services (Vercel, Neon, Claude API)
- Next.js API routes are functionally equivalent to Lambda for our needs
- Neon PostgreSQL handles everything DynamoDB would (and more, with pgvector)
- Faster iteration during the design and prototyping phase
- Production can migrate API routes to Lambda if separation of concerns is needed

### Consequences

- The Phase 1 architecture diverges from the full SRF standard stack
- Migration path to Lambda is straightforward (extract API route handlers into Lambda functions)
- Stakeholders should understand this is a deliberate simplification, not a rejection of the standard stack

---

## ADR-012: Book Ingestion Priority — Life-Impact Over Scholarly Significance

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The Roadmap (Phase 5) originally listed post-Phase 1 books in an order roughly corresponding to scholarly depth and corpus size: The Second Coming of Christ, God Talks With Arjuna, Man's Eternal Quest, The Divine Romance, etc. However, the question of what makes the portal *essential* for seekers shifts the optimization target from scholarly completeness to life-impact — which books most directly address the reasons people seek spiritual guidance?

| Ordering Criterion | Optimizes For | Risk |
|-------------------|---------------|------|
| **Scholarly significance** | Deep students, long-term corpus completeness | Multi-volume scriptural commentaries are massive (1,200–1,600 pages each) and require complex verse-aware chunking — delaying the availability of more accessible works |
| **Life-impact potential** | Newcomers, seekers in crisis, daily visitors, SEO discoverability | Smaller, topically organized books may have less depth per passage |

### Decision

Reorder book ingestion to prioritize **life-impact potential** — books that are topically organized, highly quotable, and directly address universal human struggles (fear, grief, health, relationships, purpose).

**Revised priority:**

| Priority | Book | Rationale |
|----------|------|-----------|
| 1 | *Autobiography of a Yogi* | Phase 1 focus (already decided, ADR-005) |
| 2 | *Where There Is Light* | Organized by life topic (hope, courage, healing, success). Directly powers thematic navigation. Maps to the "Doors of Entry" feature. |
| 3 | *Sayings of Paramahansa Yogananda* | Standalone aphorisms — naturally pre-chunked. Powers the "Today's Wisdom" daily passage feature. Lowest ingestion complexity. |
| 4 | *Scientific Healing Affirmations* | Directly addresses health, abundance, and peace. Powers "The Quiet Corner." Practical and actionable. |
| 5 | *Man's Eternal Quest* | Collected talks addressing every major life challenge. Rich, practical, accessible prose. |
| 6 | *The Divine Romance* | Collected talks on love, relationships, divine longing. Deeply poetic and practical. |
| 7 | *How You Can Talk With God* | Short, accessible, foundational. Good for newcomers. |
| 8 | *Metaphysical Meditations* | Affirmations and meditations. Supplements the Quiet Corner and daily passage features. |
| 9 | *Journey to Self-Realization* | Third volume of collected talks. |
| 10 | *Wine of the Mystic* | Rubaiyat commentary — beautiful but niche audience. |
| 11–12 | *Second Coming of Christ / God Talks With Arjuna* | Massive multi-volume scriptural commentaries. Highest value for advanced students. Require verse-aware chunking (complex). Lower urgency for making the portal essential to newcomers. |

### Rationale

- Books 2–4 are short, topically structured, and low-complexity for ingestion — they deliver outsized impact for minimal engineering effort
- *Where There Is Light* is literally a topical index of Yogananda's teachings — its structure maps directly to the teaching topics navigation feature
- *Sayings* requires almost no chunking strategy — each saying is a natural chunk
- The two large scriptural commentaries (1,200–1,600 pages each, verse-by-verse structure) require specialized chunking and represent significant ingestion effort for an audience that skews toward advanced students
- This ordering maximizes the portal's usefulness to the broadest audience soonest

### Consequences

- Phase 5 scope changes: the multi-volume scriptural commentaries move from "first after Phase 1" to "after the collected talks"
- The verse-aware chunking challenge (originally a Phase 5 concern) is deferred, allowing more time to design a robust solution
- The portal reaches "critical mass" of quotable, thematically diverse content sooner
- *Where There Is Light* + *Sayings* + *Scientific Healing Affirmations* can potentially be ingested in the same sprint as Phase 5 begins, since they are short and structurally simple

---

## ADR-013: Teaching Topics — Curated Thematic Entry Points

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The current portal design centers on a search bar: the user must articulate a query to find relevant passages. But many seekers — especially those arriving in distress — cannot articulate what they need. They know they are suffering, but they may not know that Yogananda wrote specifically about their kind of suffering.

Three approaches were considered:

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **Search-only** | User must type a query | Simple; no editorial curation needed | Requires the user to know what to search for; fails the "2 AM crisis" test |
| **AI recommendation engine** | AI analyzes user behavior and recommends passages | Personalized; adaptive | Violates DELTA principle of Agency (algorithmic manipulation); violates Calm Technology (attention-harvesting); requires user accounts and tracking |
| **Curated thematic entry points** | Pre-defined teaching topics (Peace, Courage, Healing, Joy, Purpose, Love) with editorially tagged passages | No tracking; no algorithmic manipulation; works for anonymous users; SEO-discoverable | Requires editorial effort to tag passages; topics are subjective |

### Decision

Implement **curated thematic entry points** ("Doors of Entry") as a complement to search. The homepage presents 4–6 teaching topics alongside the search bar. Each topic links to a curated collection of passages drawn from across all ingested books.

**Initial theme taxonomy:**

| Theme | Maps to Life Challenges | Yogananda's Terms |
|-------|------------------------|-------------------|
| **Peace** | Anxiety, stress, overwhelm, insomnia | Calmness, equanimity, stillness, tranquility |
| **Courage** | Fear, self-doubt, uncertainty, worry | Fearlessness, divine protection, will power |
| **Healing** | Physical illness, depression, grief, addiction | Health, vitality, affirmation, life force |
| **Joy** | Depression, loneliness, emptiness, sorrow | Bliss, divine joy, happiness, ananda |
| **Purpose** | Existential questioning, career, direction | Dharma, duty, right activity, God's plan |
| **Love** | Relationships, family, loneliness, loss | Divine love, unconditional love, soul love, friendship |

### Rationale

- **Meets seekers where they are.** A person in crisis doesn't need a search engine — they need a door to walk through. "Peace" is easier to tap than formulating "how do I overcome anxiety according to Yogananda."
- **No algorithmic manipulation.** Themes are editorially curated, not behaviorally targeted. Every user sees the same doors. This satisfies the DELTA principle of Agency.
- **No tracking required.** Works for anonymous users with no accounts. Aligns with the portal's zero-friction access design.
- **SEO discoverability.** Theme pages (e.g., `/themes/peace`, `/themes/healing`) become landing pages. Someone Googling "spiritual guidance for grief" can land directly on a relevant page.
- **Scales with the corpus.** Each new ingested book adds passages to existing themes. The doors become richer over time without redesign.
- **Precedent in Yogananda's own works.** *Where There Is Light* is organized exactly this way — by life topic. The feature is a digital extension of an editorial structure Yogananda's publishers already established.

### Implementation

- A `teaching_topics` table in Neon with a many-to-many join to `book_chunks`
- Themes assigned during ingestion (automated via embeddings + human review) or as a lightweight editorial curation step
- Theme pages are pre-built search results, rendered as static pages with ISR
- Each theme page shows a rotating selection of passages (different on each visit, not algorithmically personalized — simple random sampling)

### Consequences

- Requires a theme taxonomy to be defined and maintained (initial set above, expandable)
- Requires tagging infrastructure: either manual tagging during ingestion QA, or semi-automated tagging using embedding similarity to theme descriptions
- Theme pages need design work (a new page template beyond search results and the book reader)
- The tagging effort is front-loaded but amortized: once the taxonomy exists, new books are tagged during their ingestion pipeline
- The themes must be validated against the actual corpus — a theme is only useful if the corpus contains sufficient passages for it
- **Extended by ADR-048:** Multi-category taxonomy (quality, situation, person, principle, scripture, practice, yoga_path), semi-automated tagging pipeline with three-state provenance, and `description_embedding` for auto-tagging

---

## ADR-014: Personalization with Restraint — DELTA-Aligned Feature Boundaries

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Modern web platforms use personalization extensively: behavioral recommendations, activity tracking, engagement metrics, push notifications. These techniques are designed to maximize time-on-site and retention — goals that directly conflict with the Calm Technology principles and DELTA framework governing this portal.

However, some personalization is genuinely helpful. A seeker who bookmarks a passage about courage should be able to find it again. A reader in Japan should see the portal in Japanese. The question is: where is the line?

### Decision

Classify personalization features into three tiers:

**Build (genuinely helpful):**

| Feature | Rationale | Phase |
|---------|-----------|-------|
| Language preference | Fundamental accessibility. Stored in cookie or account. | 11 |
| Font size / reading preferences | Accessibility. Local storage, no account needed. | 4 |
| Bookmarks ("My Passages") | Lets seekers curate a personal anthology of passages that moved them. | 4 (localStorage), 15 (server sync) |
| Reading position | Saves your place in a book. Basic reader functionality. | 15 |

**Build with caution:**

| Feature | The Concern | Constraint |
|---------|-------------|------------|
| Search history | Could feel like surveillance | Opt-in only. User can clear at any time. Never surfaced publicly. Deletable. |
| Theme preference for daily passage | If based on behavioral inference, this is algorithmic curation | Implement as explicit user choice ("I'd like more passages about Peace") — never inferred from behavior |

**Do not build:**

| Feature | Why Not |
|---------|---------|
| Reading streaks / activity tracking | Violates DELTA Transcendence principle. Reduces spiritual practice to metrics. |
| "You've read X books this month" | Gamification in disguise |
| "Recommended for you" (behavioral) | Netflix model. Violates DELTA Agency principle. Antithetical to Calm Technology. |
| Social features (public profiles, shared highlights) | The portal is a private sanctuary, not a social network |
| Push notifications | Antithetical to Calm Technology. The portal waits; it does not interrupt. |
| Engagement dashboards for users | Optimizes for screen time, which the DELTA Embodiment principle discourages |

### Rationale

- **DELTA Agency:** Users must retain full control. No algorithmic manipulation. Explicit choices only.
- **DELTA Embodiment:** The portal should encourage logging off and practicing — not maximizing session length.
- **DELTA Transcendence:** Spiritual depth is not quantifiable. No metrics, leaderboards, or streaks.
- **Calm Technology:** Technology should require the smallest possible amount of attention. Personalization that demands ongoing interaction (maintaining streaks, checking notifications) violates this.
- **Practical:** Every personalization feature requires user accounts, data storage, privacy policies, and GDPR compliance. Minimizing personalization reduces operational complexity.

### Consequences

- Phase 15 (Optional User Accounts) remains the appropriate phase for bookmark/reading-position features
- The "personalized daily passage" in Phase 15 must use explicit theme preference, not behavioral inference
- The portal's anonymous experience (Phases 1–14) must be excellent without any personalization — personalization enhances but never gates the core experience

---

## ADR-015: Passage Sharing as Organic Growth Mechanism

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

When someone reads a passage that moves them, the most natural human response is to share it with someone they love. This is also the most organic growth mechanism for the portal — and it's perfectly aligned with SRF's mission of spreading the teachings.

| Approach | Mechanism | Alignment with Mission |
|----------|-----------|----------------------|
| **No sharing** | Portal is a closed library | Functional but misses the natural word-of-mouth vector |
| **Social media integration** | Share buttons for Twitter/Facebook/Instagram | Introduces third-party tracking; commercial platforms conflict with Calm Technology |
| **Clean link + OG card** | Generate a shareable URL with beautiful Open Graph metadata | No tracking; the shared content speaks for itself; recipient lands on the portal |
| **Image card generation** | Generate a downloadable image of the quote (Merriweather on warm cream with citation) | Shareable anywhere without platform dependency; beautiful; printable |

### Decision

Implement **clean link sharing with Open Graph cards** and **downloadable quote image generation** as a Phase 2 feature. Every passage — in search results, in the reader, on theme pages, and in the Quiet Corner — has a quiet "Share" affordance.

**Share link behavior:**
- Generates a URL like `/passage/[chunk-id]` that resolves to the passage in context (reader view, scrolled to the passage)
- Open Graph tags render a beautiful preview card when the link is pasted into any platform: the quote in Merriweather, warm cream background, citation, and the portal URL
- No tracking parameters, no UTM codes, no referral tracking

**Quote image behavior:**
- "Save as image" option generates a PNG: the passage text in Merriweather on warm cream, citation below, subtle SRF lotus mark, portal URL at bottom
- Suitable for sharing via messaging apps, printing, or using as a phone wallpaper
- Generated server-side (or client-side via canvas) — no external service needed

### Rationale

- **Mission-aligned:** The philanthropist's goal is to make the teachings available worldwide. Sharing is the most natural distribution mechanism.
- **No tracking:** Unlike social share buttons (which embed third-party scripts and tracking pixels), a clean URL with OG metadata involves zero tracking.
- **Beautiful and respectful:** The shared card presents the teaching with the same reverence as the portal itself — serif typography, warm colors, proper citation.
- **Printable:** The downloadable image can be printed, framed, or placed on a meditation altar — bridging digital and physical, honoring the DELTA Embodiment principle.
- **Low effort, high impact:** OG tags are standard Next.js metadata. Image generation is a single API route or client-side canvas operation.

### Consequences

- Need a `/passage/[chunk-id]` route that renders a single passage in a shareable view
- OG meta tags must be set per-passage (dynamic `<meta>` in Next.js `generateMetadata`)
- Image generation requires either a server-side rendering solution (e.g., `@vercel/og` or Satori) or client-side canvas
- The share affordance must be visually quiet — a small icon, never a row of social media logos

---

## ADR-016: Sacred Image Usage Guidelines

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The portal has access to 16 official photographs of the SRF line of gurus (Mahavatar Babaji, Lahiri Mahasaya, Swami Sri Yukteswar, Paramahansa Yogananda), plus photographs of SRF's physical properties (Lake Shrine, Encinitas Hermitage, Mount Washington, meditation gardens). These images require handling that reflects their sacred significance in the SRF tradition.

### Decision

Establish strict image usage guidelines that treat guru photographs as sacred objects and nature/property photographs as atmospheric elements.

**Guru photographs — rules:**

| Rule | Rationale |
|------|-----------|
| Guru images appear in exactly two places: the About section (lineage display) and the Quiet Corner (single portrait above the affirmation) | Restraint creates reverence. Their absence from the rest of the portal makes their presence meaningful. |
| Never crop, filter, overlay, or apply visual effects to guru photographs | These are portraits of realized masters. Digital manipulation would be disrespectful. |
| Never place guru images adjacent to UI controls (buttons, form fields, error states) | Avoids juxtaposing sacred images with mundane interface elements. |
| Never use guru images as background wallpaper, with opacity overlays, or as decorative elements | The images are not decoration — they are objects of devotion. |
| Never use guru images in loading states, error pages, or empty states | These are transient, technical UI states — not appropriate for sacred imagery. |
| Yogananda's portrait appears on each book's landing page as the author photo, positioned like a frontispiece in a physical book | This is the one additional context where a guru image is appropriate — authorship attribution. |
| All guru images must include alt text with the guru's full name and title | Accessibility and respect. |

**Nature/property photographs — uses:**

| Context | Image Type | Treatment |
|---------|-----------|-----------|
| Quiet Corner | Lake Shrine, gardens | Subtle: small image below affirmation or very low-opacity background. Never competing with the text. |
| Theme pages | Nature associated with each theme (still water for Peace, mountains for Courage, etc.) | Ambient atmosphere. Small, muted, never dominant. |
| 404 / empty states | Garden photograph | Gentle message alongside: "This page doesn't exist yet, but perhaps you were meant to find this instead..." with search bar. |
| Seasonal homepage accent | Season-appropriate nature | Very subtle. A suggestion of season, not a hero image. |

**Images NOT sourced from SRF:**
- No stock photography. Every image should be either an official SRF photograph or a nature image from SRF properties.
- If SRF property images are not available, prefer no image over a generic stock photo.

### Rationale

- **Theological alignment:** In the SRF tradition, guru photographs are placed on the meditation altar and treated with reverence. The portal's image handling should reflect this practice.
- **Design restraint:** The portal's power comes from the words. Images support; they never compete. The homepage has no images at all — just Yogananda's words on warm cream. This is deliberate.
- **Calm Technology:** Images that are ambient and atmospheric support the "digital silence" principle. Images that are decorative or attention-grabbing violate it.

### Consequences

- The About section needs a carefully designed lineage display (4 guru portraits in sequence)
- The Quiet Corner needs a curated pool of SRF property/nature images
- The 404 page needs a garden image and gentle copy
- SRF must provide or approve all images used. The 16 official guru photos are available; property photographs may need to be sourced from SRF's media library.
- Each image needs proper licensing/attribution confirmation from SRF

---

## ADR-017: Accessibility as Phase 2 Foundation

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The original roadmap placed accessibility in Phase 12 ("Calm Technology Polish & Accessibility"). This is too late. Retrofitting accessibility is expensive and error-prone; building it in from day one is nearly free if the right structural choices are made at the start.

SRF's audience includes elderly devotees, seekers in developing countries on low-end devices, and visually impaired users. The Gemini research document specifically notes visually impaired devotees who described the SRF app's screen reader support as "transformative." Accessibility is not a feature — it is a theological imperative per SRF's mission to serve "all of humanity" and the DELTA framework's Dignity principle.

| Approach | Cost | Risk |
|----------|------|------|
| **Phase 2 (build in)** | Low — semantic HTML, ARIA, keyboard nav are free if done from the start | None — this is best practice |
| **Phase 12 (retrofit)** | High — requires auditing and rewriting markup, fixing tab order, adding ARIA after the fact | Significant — inaccessible patterns get baked into components and propagated |

### Decision

Move **core accessibility** from Phase 12 to **Phase 2**. Phase 12 becomes the audit and polish phase (professional WCAG audit, native TTS, advanced reading mode), not the "add accessibility" phase.

**Phase 2 accessibility requirements:**

| Category | Requirements |
|----------|-------------|
| **Structure** | Semantic HTML (`<article>`, `<nav>`, `<main>`, `<header>`, `<footer>`). ARIA landmark regions. Strict heading hierarchy (`h1` → `h2` → `h3`). Skip-to-content link. |
| **Vision** | All text meets WCAG AA contrast ratios (4.5:1 body, 3:1 large). Alt text on all images. Text reflows at 200% zoom. Font size control (A-/A+). Respect `prefers-contrast: more`. No color-only meaning. |
| **Motor** | Full keyboard navigation. Visible focus indicators. 44x44px minimum touch targets. No hover-only interactions. No time-limited interactions (Quiet Corner timer is optional). |
| **Hearing** | Quiet Corner chime has visual equivalent (gentle brightness change + text). Request corrected YouTube captions from SRF. |
| **Cognitive** | Consistent navigation. No autoplay. No flashing. Clear UI language. Respect `prefers-reduced-motion`. Predictable behavior. |
| **Performance** | < 100KB initial load. Lazy-loaded images. `font-display: swap`. Progressive enhancement. |
| **Reading** | Basic reading mode: font size adjustment, line spacing control, dark mode toggle for evening reading. |

**Phase 12 (reframed as "Accessibility Audit & Polish"):**
- Professional WCAG 2.1 AA audit (automated + manual + real assistive technology users)
- Native TTS "Listen" button in the reader (Web Speech API)
- Advanced reading mode (sepia, custom fonts, reading ruler)
- Testing with VoiceOver, NVDA, JAWS, TalkBack
- Testing on low-end devices and slow networks
- Remediation of any audit findings

### Critical: Color Contrast Fix

The existing design tokens have contrast failures that must be corrected before any implementation:

| Combination | Current Ratio | Required | Fix |
|-------------|--------------|----------|-----|
| `--portal-text-muted` (#6B6B6B) on `--portal-bg` (#FAF8F5) | 4.1:1 | 4.5:1 | Darken to `#595959` (5.3:1) |
| `--portal-text-muted` (#6B6B6B) on `--portal-quote-bg` (#F9F6F1) | 3.9:1 | 4.5:1 | Same fix — `#595959` |
| `--srf-gold` (#DCBD23) as text on `--portal-bg` (#FAF8F5) | 2.4:1 | 3:1 (large) | Gold is for borders/accents only, never text on light backgrounds |

### Rationale

- **Theological:** SRF's mission is to serve all of humanity. "All" includes people with disabilities.
- **DELTA Dignity:** Treating users as inherently worthy means not excluding them through inaccessible design.
- **Practical:** Semantic HTML and keyboard navigation take no extra effort when done from the start. They take massive effort to retrofit.
- **Legal:** WCAG compliance is increasingly a legal requirement in the US (ADA), EU (European Accessibility Act), and other jurisdictions.
- **SRF precedent:** The SRF app already invested in screen reader support. The portal should meet or exceed that standard.

### Consequences

- Every component built in Phases 1–2 must pass basic accessibility checks (Lighthouse, axe DevTools)
- The design token `--portal-text-muted` must be corrected to `#595959` before implementation begins
- `--srf-gold` must never be used as text on light backgrounds
- Phase 12 scope shrinks (audit and polish, not build-from-scratch) but gains TTS and professional audit

---

## ADR-018: Daily Email — Verbatim Passage Delivery

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Daily devotional emails are one of the most successful formats in spiritual publishing (Rick Warren's Daily Hope, Richard Rohr's CAC daily meditation, Plough's daily dig). A daily email with a single Yogananda passage is mission-aligned (spreading the teachings), low-friction (arrives in the inbox), and draws from the existing `daily_passages` infrastructure.

| Approach | Personalization | Complexity | DELTA Alignment |
|----------|----------------|-----------|-----------------|
| **No email** | N/A | None | N/A |
| **Non-personalized daily passage** | Language only | Low — same passage pool as Today's Wisdom | Full — no tracking |
| **Theme-preference daily passage** | Language + explicit theme choice | Medium — filtered random from theme-tagged passages | Good — user has agency (explicit choice, not behavioral inference) |
| **Behaviorally personalized** | Inferred from reading/search history | High — requires per-user profiling | Poor — violates DELTA Agency |

### Decision

Implement a **daily email** delivering a single verbatim Yogananda passage with full citation.

**Phase 9 (non-personalized):** Same passage pool as Today's Wisdom. One email per day. Subscriber provides email address and language. No account required.

**Phase 15 (personalized):** Subscribers can optionally select theme preferences ("I'd like more passages about Peace and Healing"). Passages are filtered by theme from the `chunk_topics` join. This is an *explicit user choice*, never behavioral inference.

### Design

| Element | Specification |
|---------|--------------|
| Frequency | Daily, consistent time (configurable per timezone if feasible, otherwise fixed 6 AM EST) |
| Content | One verbatim passage + book/chapter/page citation + "Read in context" link to portal |
| Format | Minimal HTML email: Georgia serif (email-safe Merriweather equivalent), warm cream background (`#FAF8F5`), passage text, citation, portal link. No images. No announcements. No CTAs beyond "Read more." |
| Source | `daily_passages` pool (Phase 5 expands this from *Sayings* and *Where There Is Light*) |
| Signup | Email address + language. Optional: theme preferences (Phase 15). No account required. |
| Unsubscribe | One-click. CAN-SPAM and GDPR compliant. |
| Provider | Resend or AWS SES — transactional email services, not marketing platforms |
| Tracking | Open rates and click rates are **not tracked**. The email is a gift, not a funnel. Delivery success/bounce rates tracked for operational health only. |

### The Key Constraint

The email is a passage, not a newsletter. No announcements, no feature updates, no "check out our new book." Just the teaching. A quiet "Read more on the SRF Teaching Portal" link at the bottom. Nothing more.

### Rationale

- **Mission-aligned:** The philanthropist's goal is to make the teachings available worldwide. Email reaches people who don't visit websites.
- **Precedent:** Daily devotional emails have among the highest sustained engagement of any digital format — because the content is the value, not the medium.
- **Low effort:** The `daily_passages` pool already exists. The email is a thin delivery layer on top of existing infrastructure.
- **No tracking:** Unlike marketing emails, we do not track opens or clicks. The email is a gift. We measure success by subscriber count (are people opting in?), not engagement metrics.
- **GDPR/CAN-SPAM:** Email-only signup with one-click unsubscribe. Minimal data collection. No data sharing.

### Consequences

- Need an email sending service (Resend, AWS SES, or Postmark) — adds a small monthly cost
- Need a subscriber table in Neon (email, language, theme_preferences, subscribed_at, unsubscribed_at)
- Need a daily cron job (Vercel Cron or AWS EventBridge) to send the email
- Need an unsubscribe endpoint and confirmation page
- The passage selection logic (random from pool, optional theme filter, optional seasonal weighting) is shared with the Today's Wisdom homepage feature — same code, different delivery channel

---

## ADR-019: Social Media Strategy — Portal-Generated Assets, Human Distribution

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Yogananda's teachings are extraordinarily shareable — short, vivid, universal. The quote-image format (passage on warm cream, Merriweather serif, citation) works on every platform. The question is how the portal relates to social media: should it drive sharing, should SRF's social presence drive portal traffic, and how much should be automated?

| Approach | Description | DELTA Alignment |
|----------|-------------|-----------------|
| **Social share buttons** | Row of platform icons (Twitter, Facebook, etc.) on every passage | Poor — embeds third-party tracking scripts; commercial platform logos conflict with Calm Technology |
| **Clean link + OG card** (already decided, ADR-015) | Share icon generates a URL with beautiful OG metadata | Good — no tracking, user chooses platform |
| **Automated posting** | Portal auto-posts a daily quote to social platforms via API | Questionable — loss of editorial control; robotic; SRF's social presence is carefully curated by monastics |
| **Semi-automated** | Portal generates daily quote image + suggested caption; human reviews and posts | Good — editorial control maintained; reduces staff effort; human curation of sacred content |

### Decision

**User sharing (Phase 2):** Already covered by ADR-015. Clean links with OG cards. Downloadable quote images. No social media buttons. No tracking scripts.

**SRF organizational sharing (Phase 9+):** The portal provides **semi-automated social media asset generation**. A daily quote image and suggested caption are generated automatically (from the daily_passages pool). A human (SRF social team or content editor) reviews, approves, and posts. The portal never posts automatically.

### Platform-Specific Considerations

| Platform | How the Portal Supports It |
|----------|--------------------------|
| **Instagram** | Quote images from `/api/og/[chunk-id]` are perfectly formatted for Instagram posts and stories. Square (1:1) and story (9:16) variants. |
| **YouTube Shorts** | SRF already publishes Shorts. Portal-generated quote images could inspire "quote + meditation" Shorts. Not automated — the portal provides the raw material. |
| **Facebook** | Shared passage links render beautifully via OG tags. SRF's Facebook page could share daily passages directly from the portal. |
| **Twitter/X** | OG cards render with the quote snippet. Short passages (< 280 chars) can be shared as text with attribution. |
| **WhatsApp** | OG cards render in previews. Likely the highest-impact sharing channel globally (India, Latin America, Africa, Southeast Asia). |
| **LinkedIn** | Inspirational quotes perform well. OG cards render cleanly. |

### What the Portal Generates (Admin/Retool Dashboard)

A daily admin view showing:
- Today's passage (from the daily_passages pool)
- Pre-generated quote images in multiple aspect ratios (1:1 square, 9:16 story, 16:9 landscape)
- Suggested caption: the first 1–2 sentences of the passage + citation + portal URL
- One-click copy for each platform

This is a **content production tool**, not an auto-poster. The human decides when and where to publish.

### Rationale

- **Sacred content deserves human curation.** Automated posting of Yogananda's words risks contextual inappropriateness (posting about joy during a global tragedy) and robotic tone. A human touch is non-negotiable.
- **The portal generates the assets; humans distribute them.** This reduces staff effort dramatically while maintaining editorial control.
- **WhatsApp is underestimated.** In India (YSS audience), Latin America, Africa, and Southeast Asia, WhatsApp is the primary sharing channel. OG cards in WhatsApp are the highest-impact social feature for the portal's global mission.
- **YouTube Shorts synergy.** SRF's existing Shorts program can draw from the portal's quote library for visual content.

### Consequences

- Phase 2: User sharing works via OG cards and quote images (already in ADR-015)
- Phase 9+: Admin dashboard (Retool) adds a "Social Assets" view showing daily quote images and suggested captions
- Multi-aspect-ratio image generation needed (`@vercel/og` with configurable dimensions)
- SRF's social media team needs access to the admin dashboard
- No automated posting. Ever. The portal generates; humans distribute.

---

## ADR-020: Multi-Language Architecture — Three-Layer Localization

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The portal's mission — making the teachings "available freely throughout the world" — requires multi-language support. The convocation site's locale set (en, es, de, fr, it, pt, ja) establishes the initial target. However, localization for this portal has a unique challenge: not all books are translated into all languages. The content availability is asymmetric.

Three distinct layers require different localization strategies:

| Layer | What | Challenge |
|-------|------|-----------|
| **UI chrome** | Navigation, labels, buttons, error messages, search prompts | Small corpus (~200–300 strings). Standard i18n. |
| **Book content** | Yogananda's published text in official SRF/YSS translations | Not all books exist in all languages. Must never machine-translate sacred text. |
| **Search** | Full-text search (language-specific stemming), vector similarity (embedding model dependent), query expansion (LLM language) | Per-language FTS dictionaries. Embedding model must handle target languages. |

### Decision

Implement a **three-layer localization strategy** with English fallback:

**Layer 1 — UI chrome:** Next.js i18n routing with `next-intl` (or `i18next`). URL-based locale prefixes (`/es/search`, `/de/quiet`). English as default (no prefix). All UI strings externalized to locale JSON files from Phase 2 — never hardcoded in components.

**Layer 2 — Book content:** Language-specific chunks in Neon, differentiated by the existing `language` column on `book_chunks`. No machine translation of Yogananda's words — if an official translation doesn't exist, the book is not available in that language. Contentful locales (production) provide per-locale editorial content.

**Layer 3 — Search:** Per-language tsvector columns for full-text search (PostgreSQL language dictionaries handle stemming). Multilingual embedding model (start with OpenAI text-embedding-3-small, which handles multilingual text). Claude handles query expansion in all target languages.

**English fallback:** When the user's language has insufficient content (fewer than 3 search results, sparse theme pages, small daily passage pool), supplement with English passages clearly marked with a `[EN]` language tag and "Read in English" links. The fallback is transparent — never silent.

### Phase 2 i18n Infrastructure

Even though Phase 2 is English-only, the following must be in place from day one:

| Requirement | Rationale |
|-------------|-----------|
| All UI strings in `messages/en.json` | Retrofitting i18n into hardcoded JSX is expensive |
| `next-intl` configured with `en` as sole locale | Adding locales later is a config change, not a refactor |
| CSS logical properties (`margin-inline-start`, not `margin-left`) | Free RTL support for future languages |
| `lang` attribute on `<html>` element | Screen readers and search engines depend on this |
| `language` column on all content tables | Already present in the schema |

### Rationale

- **Mission alignment:** "Freely throughout the world" means in the seeker's language.
- **Sacred text fidelity:** Machine translation of Yogananda's words is unacceptable. Only official SRF/YSS translations are used.
- **Graceful degradation:** English fallback ensures seekers always find something, with honest labeling.
- **Low Phase 2 cost:** Externalizing strings and using CSS logical properties costs nothing when done from the start but saves a major refactor later.
- **Spiritual terminology:** Sanskrit terms (samadhi, karma, dharma, prana) appear differently across translations — some keep Sanskrit, some translate, some transliterate. Per-language search must handle both forms.

### Design Decisions (Multilingual Audit, 2026-02-18)

The following decisions were made during a comprehensive multilingual audit to ensure the architecture serves Earth's population:

1. **Locale-first search.** The `language` API parameter means "the user's locale," not "detected query language." Auto-detection on short queries is unreliable ("karma" is identical in six languages). The service layer (not the SQL function) implements the English fallback when locale results < 3. This keeps the database function clean and the fallback policy in application code.

2. **Theme slugs stay in English.** `/es/themes/peace`, not `/es/temas/paz`. English slugs provide URL stability — no breakage if the taxonomy changes. Display names are localized via a `topic_translations` table. `hreflang` tags handle the SEO signal.

3. **`reader_url` is locale-relative.** API responses return `/books/slug/chapter#chunk` without locale prefix. The client (web or mobile) prepends the locale. This keeps the API presentation-agnostic per ADR-024.

4. **Locale + English fallback is the multilingual model.** The practical need is the seeker's language plus English supplementation — not arbitrary cross-language search (e.g., Japanese query finding German results). The multilingual embedding model *enables* cross-language search at near-zero cost, but the core experience is locale-first with English fallback. Cross-language search may be activated later if usage data justifies it, but it is not a core Phase 11 deliverable.

5. **`canonical_book_id` links translations to originals.** A new column on `books` enables "Available in 6 languages" on the library page and "Read in English →" navigation between editions. The `canonical_chunk_id` column on `book_chunks` enables passage-level cross-language links.

6. **`chunk_relations` stores per-language relations.** Top 30 same-language + top 10 English supplemental per chunk ensures non-English languages get first-class related teachings without constant real-time fallback. The English supplemental relations follow the same pattern as the search fallback — supplement, clearly mark with `[EN]`, never silently substitute.

7. **Per-language search quality evaluation is a launch gate.** Each language requires a dedicated search quality test suite (15–20 queries with expected passages) that must pass before that language goes live. This mirrors Phase 1's English-only search quality evaluation (Deliverable 1.11) and prevents launching a language with degraded retrieval quality.

8. **Chunk size must be validated per language.** English-calibrated chunk sizes (200/300/500 tokens) may produce different semantic density across scripts. Per-language chunk size benchmarking is required during Phase 11 ingestion — particularly for CJK and Indic scripts where tokenization differs significantly from Latin text.

### Consequences

- Phase 2 includes i18n infrastructure setup (locale routing, string externalization) even though content is English-only
- Phase 2 includes the `topic_translations` table (empty until Phase 11)
- Phase 11 requires knowing which books SRF has in digital translated form (stakeholder question)
- Phase 11 UI string translation uses an AI-assisted workflow: Claude generates drafts of locale JSON files, then a human reviewer (fluent in the target language and familiar with SRF's devotional register) refines tone, spiritual terminology, and cultural nuance. See ADR-023.
- The content availability matrix creates asymmetric experiences per language — this is honest, not a bug
- The book catalog per language shows only available books, plus a "Also available in English" section
- The `hybrid_search` function accepts a `search_language` parameter and filters to the user's locale
- The `content_tsv` column uses a trigger (not GENERATED ALWAYS) to select the correct PostgreSQL text search dictionary per chunk's language
- All content-serving API endpoints accept a `language` parameter with English fallback at the service layer
- Per-language search quality test suite (15–20 queries per language) is a launch gate before any language goes live in Phase 11
- Per-language chunk size benchmarking required during Phase 11 ingestion for non-Latin scripts
- `books.bookstore_url` provides "Find this book" links to SRF Bookstore. Per-language bookstore routing deferred (ADR-051).

---

## ADR-021: CSS Logical Properties from Phase 2

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The initial locale set (en, es, de, fr, it, pt, ja) includes only left-to-right (LTR) languages. However, Yogananda's teachings have readership in Arabic, Urdu, and Hebrew-speaking communities, and Hindi/Bengali use Devanagari script (LTR but with different typographic conventions). Building a CSS architecture that only works for LTR requires a significant retrofit when RTL languages are added.

CSS logical properties (`margin-inline-start` instead of `margin-left`, `padding-block-end` instead of `padding-bottom`) provide directional-agnostic layout at zero additional cost when used from the start.

### Decision

Use **CSS logical properties** throughout all portal stylesheets and Tailwind utility classes from Phase 2.

**In practice:**

| Instead of | Use |
|-----------|-----|
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `padding-left` | `padding-inline-start` |
| `text-align: left` | `text-align: start` |
| `float: left` | `float: inline-start` |
| `border-left` | `border-inline-start` |

Tailwind CSS supports logical properties via the `ms-*` (margin-start), `me-*` (margin-end), `ps-*`, `pe-*` utilities.

### Rationale

- **Zero cost now, high cost later.** Writing `ms-4` instead of `ml-4` takes the same keystrokes. Retrofitting an entire codebase from physical to logical properties is a multi-day refactor.
- **Future-proofing.** Arabic and Urdu readership of Yogananda's works exists. Hindi uses Devanagari (LTR but with specific layout expectations). RTL support is not speculative — it's eventual.
- **Browser support.** Logical properties are supported in all modern browsers (97%+ global coverage as of 2025).

### Consequences

- Developers must be trained/reminded to use logical properties (Tailwind's `ms-*`/`me-*`/`ps-*`/`pe-*` instead of `ml-*`/`mr-*`/`pl-*`/`pr-*`)
- ESLint or Stylelint rules can enforce logical property usage
- Adding `dir="rtl"` to an RTL locale "just works" for layout — only typography and some edge cases need special attention

---

## ADR-022: Hindi and Bengali in Locale Roadmap

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The initial locale set (en, es, de, fr, it, pt, ja) mirrors the convocation site, which serves a primarily Western conference audience. However, the teaching portal's mission is global — "available freely throughout the world."

Yogananda was born in Gorakhpur, India. YSS (Yogoda Satsanga Society of India) serves millions of seekers on the Indian subcontinent. Hindi is the third most spoken language in the world. Bengali is Yogananda's mother tongue. The Autobiography of a Yogi has official Hindi and Bengali translations published by YSS.

Omitting Hindi and Bengali from the portal — whose stated mission is global availability — is a significant gap.

### Decision

Add **Hindi (hi)** and **Bengali (bn)** to the locale roadmap as a **second wave in Phase 11**, following the initial Western-language wave.

**Phase 11 locale waves:**

| Wave | Languages | Rationale |
|------|-----------|-----------|
| **11a (Western)** | es, de, fr, it, pt, ja | Matches convocation site. Western audience. SRF's existing translation infrastructure. |
| **11b (Indian)** | hi, bn | YSS audience. Yogananda's heritage languages. Massive population reach. |
| **11c (Evaluation)** | Evaluate further | Based on demand data, available translations, and SRF/YSS input. Candidates: Chinese, Korean, Russian, Arabic. |

### Rationale

- **Mission integrity.** A portal that serves Yogananda's teachings in Japanese but not Hindi — Yogananda's own country — contradicts the mission.
- **Population reach.** Hindi speakers: ~600M. Bengali speakers: ~230M. These exceed the combined speakers of German, French, Italian, and Portuguese.
- **YSS translations exist.** YSS has published official Hindi and Bengali translations of key Yogananda works. The content likely exists (pending confirmation of digital availability).
- **Devanagari and Bengali scripts** are LTR, so the CSS logical properties decision (ADR-021) already covers the directional requirements. Font support (Noto Sans Devanagari, Noto Sans Bengali) is available via Google Fonts.

### Consequences

- Phase 11 is split into waves (11a Western, 11b Indian, 11c Evaluation)
- Need to confirm YSS has digital text of Hindi/Bengali translations (stakeholder question)
- May need YSS-specific UI adaptations (organizational branding differences between SRF and YSS)
- Google Fonts Noto Sans Devanagari and Noto Sans Bengali added to the font stack for Phase 11 Indian wave
- The portal URL and branding question: is the Hindi/Bengali version served from the same domain (teachings.yogananda.org/hi/) or a YSS-branded domain?

---

## ADR-023: AI-Assisted Translation Workflow

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Phase 11 requires translating ~200–300 UI strings (nav labels, button text, search prompts, error messages, footer links, accessibility labels) into 6+ languages. The question: who translates these, and how?

Three categories of translatable content exist in the portal, each with fundamentally different fidelity requirements:

| Category | Examples | AI Translation Acceptable? |
|----------|----------|---------------------------|
| **Yogananda's published text** | Book chapters, quoted passages, passage titles | **Never.** Only official SRF/YSS human translations. |
| **Portal UI chrome** | "Search the teachings," "Go deeper," nav labels, error messages | **As draft only.** Claude generates initial translations; mandatory human review before deployment. |
| **Portal-authored content** | About page copy, theme descriptions, "What Next" bridge text | **As draft only.** Same workflow as UI chrome. |

The distinction is absolute: Yogananda's words are sacred text transmitted through a realized master. The portal's own UI copy is functional prose written by the development team. Different fidelity standards apply.

### Decision

Use **Claude API to generate draft translations** of UI chrome and portal-authored content. Every draft must pass through **mandatory human review** by a reviewer who is:
1. Fluent in the target language
2. Familiar with SRF's devotional register and spiritual terminology
3. Able to distinguish clinical/formal tone from warm, devotional tone

**Never use AI (Claude or any other model) to translate, paraphrase, or synthesize Yogananda's published text.** This is an inviolable constraint, not a cost optimization to revisit later.

### Workflow

```
messages/en.json (source of truth)
        │
        ▼
  Claude API draft
  (system prompt enforces SRF tone,
   spiritual terminology glossary,
   target locale context)
        │
        ▼
  messages/{locale}.draft.json
        │
        ▼
  Human reviewer (fluent + SRF-aware)
  — Corrects tone and nuance
  — Validates spiritual terms
  — Flags ambiguous strings
        │
        ▼
  messages/{locale}.json (production)
```

### Translation Prompt Guidelines

The Claude system prompt for UI translation should include:
- SRF's spiritual terminology glossary (e.g., "Self-realization," "Kriya Yoga," "divine consciousness" — these may remain untranslated or have specific approved translations per language)
- Instruction to preserve the warm, devotional tone — avoid clinical or corporate phrasing
- Context for each string (where it appears, what it does) so the translation fits the UI context
- Instruction to flag uncertainty rather than guess (e.g., mark `[REVIEW]` when unsure)

### Rationale

- **Cost efficiency.** Professional translation of 300 strings × 8 languages = 2,400 translation units. AI drafting reduces this to a review task rather than a from-scratch task, cutting cost and time significantly.
- **Quality floor.** Claude produces competent translations in all target languages (es, de, fr, it, pt, ja, hi, bn). The human reviewer elevates from competent to appropriate — catching tone, register, and spiritual terminology issues.
- **Sacred text boundary is absolute.** No amount of cost savings justifies AI-translating Yogananda's words. The portal serves *official SRF/YSS translations* or nothing. This is a theological constraint, not a technical one.
- **Scalable.** As new languages are added (Phase 11 evaluation wave), the same workflow applies — Claude draft → human review. No need to find full professional translation services for each new locale.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Professional translation only** | Highest quality from day one | Expensive for UI strings that change often; slow turnaround for iterative development |
| **AI translation with no review** | Cheapest, fastest | Unacceptable risk of clinical tone, wrong spiritual terms, or culturally inappropriate phrasing |
| **Community/volunteer translation** | Free, deeply motivated translators | Unpredictable quality and timeline; coordination overhead; IP/liability concerns |

### Spiritual Terminology Glossary

The glossary is a critical dependency for both the AI drafting step and the human review step. It defines how spiritual terms are handled per language — which terms remain in Sanskrit, which have approved translations, and which are transliterated.

**Storage:** A JSONB column in Neon, stored as a per-language glossary file at `/messages/glossary-{locale}.json`. This is a content-editor-centric artifact — maintained alongside the locale JSON files, version-controlled in Git, and eventually migrated to Contentful when the CMS is adopted (Phase 10+).

**Structure:**

```json
// messages/glossary-de.json
{
  "terms": [
    {
      "english": "Self-realization",
      "translated": "Selbstverwirklichung",
      "notes": "Standard German spiritual term. Always capitalized."
    },
    {
      "english": "Kriya Yoga",
      "translated": "Kriya Yoga",
      "notes": "Never translated. Proper noun."
    },
    {
      "english": "samadhi",
      "translated": "Samadhi",
      "notes": "Keep Sanskrit. German readers familiar with the term. Also found as 'Überbewusstsein' in some older translations."
    }
  ],
  "tone_guidance": "Warm, devotional, not academic. 'Sie' form (formal). Avoid clinical psychological vocabulary."
}
```

**Workflow:** The glossary is built incrementally during the first human review cycle for each language. The reviewer flags terms, provides translations, and adds notes. Subsequent review cycles and AI drafting both reference the glossary. The Claude system prompt for UI translation includes the glossary to improve first-draft quality.

**Migration path:** When Contentful is adopted (Phase 10+), glossaries can be modeled as a Contentful content type with per-locale entries, enabling content editors to manage terminology without touching JSON files.

### Consequences

- Phase 11 deliverable 11.1 uses AI-assisted workflow: Claude draft → human review → production
- Spiritual terminology glossary stored as `/messages/glossary-{locale}.json` — built incrementally during first review cycle, referenced by both AI drafting and human review
- The `messages/{locale}.draft.json` → `messages/{locale}.json` promotion step should be tracked (Git diff review)
- Reviewer recruitment: SRF likely has multilingual monastics and volunteers who can review UI translations — this is a stakeholder question
- The same workflow applies to portal-authored content (About page, theme descriptions, "Seeking..." entry points, etc.)
- Glossary files migrate to Contentful content types when the CMS is adopted (Phase 10+)

---

## ADR-024: API-First Architecture for Platform Parity

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The SRF already has a native mobile app (iOS/Android) with an eReader. While a dedicated teaching portal mobile app is not planned, the portal's API surface will likely be consumed by native apps eventually — either a standalone portal app, integration into the existing SRF app, or both.

Next.js encourages a pattern where business logic lives inside React Server Components. This is convenient for web development but creates a platform lock: Server Components are callable only by the Next.js rendering pipeline, not by a mobile app, a third-party integration, or a PWA Service Worker.

If business logic migrates into Server Components during Phases 1–14, extracting it later into a proper API layer is a significant refactoring effort. The cost of API-first discipline from day one is near zero; the cost of retrofitting is high.

### Decision

Adopt **API-first architecture** with a **shared service layer** from Phase 1. Every user-facing feature must have both a callable service function and a REST API endpoint.

#### 1. Shared Service Layer

All business logic lives in `/lib/services/` as plain TypeScript functions:

```
/lib/services/
  search.ts          → findPassages(query, language, options)
  daily-passage.ts   → getDailyPassage(date, language)
  themes.ts          → getThemes(language), getThemePassages(slug, language, limit)
  books.ts           → getBooks(language), getChapter(bookSlug, chapterNumber, language)
  quiet.ts           → getAffirmation(language)
```

**Server Components** call service functions directly (in-process, no HTTP overhead).
**API routes** call the same service functions and return JSON.
**Mobile apps** (future) call the API routes.

This is a code organization rule, not a technology choice. The rule: **never put business logic in a Server Component or a Route Handler that doesn't delegate to a service function.**

#### 2. API Versioning

All API routes use a versioned prefix from Phase 1:

```
/api/v1/search
/api/v1/daily-passage
/api/v1/themes/[slug]/passages
/api/v1/books/[slug]/chapters/[number]
/api/v1/quiet
/api/v1/og/[chunk-id]
/api/v1/email/subscribe
```

When the API evolves, `/api/v2/` coexists with `/api/v1/`. The web frontend always uses the latest version. Mobile apps pin to the version they were built against. Old versions are deprecated with notice, not removed without warning.

#### 3. Authentication: Public by Default

**Phases 1–14: All API routes are public.** No authentication required. The portal's core mission is frictionless access to the teachings — adding "Sign in" contradicts this.

What auth would serve, and how it's handled without it:

| Need | Solution Without Auth |
|------|----------------------|
| Rate limiting | Vercel/Cloudflare edge rate limiting |
| Bookmarks, reading position | `localStorage` (ADR-041) — private, no server |
| Email subscription | Token-based confirm/unsubscribe (no user accounts) |
| Admin dashboards | Retool has its own auth |
| Content protection | Not needed — the mission is free access |

**Phase 15+ (if needed):** When optional accounts are introduced for cross-device sync, evaluate the lightest mechanism that serves the need (magic links, passkeys, or Auth0 if SSO with other SRF properties is required). Public search and reading remain unauthenticated regardless. Auth is additive middleware on specific protected endpoints — never a gate on reading or search.

#### 4. Cursor-Based Pagination

Every endpoint returning a list uses cursor-based pagination:

```json
{
  "results": [...],
  "cursor": "eyJpZCI6MTIzfQ",
  "hasMore": true
}
```

Not page-number pagination (`page=2&limit=10`), which is fragile when data changes between requests. Cursors are stable across inserts and deletes — essential for mobile infinite scroll and pull-to-refresh patterns.

#### 5. Cache-Control Headers

Explicit HTTP caching directives on every API response:

| Endpoint | Cache Strategy |
|----------|---------------|
| `/api/v1/daily-passage` | `max-age=3600` (1 hour — passage changes daily, but not every second) |
| `/api/v1/books/[slug]/chapters/[number]` | `max-age=86400, stale-while-revalidate=604800` (book text rarely changes) |
| `/api/v1/search` | `no-store` (query-dependent, not cacheable) |
| `/api/v1/themes/[slug]/passages` | `max-age=3600` (theme curation changes infrequently) |
| `/api/v1/quiet` | `max-age=300` (5 min — affirmation rotates but isn't time-critical) |

Mobile apps get intelligent caching for free. The web frontend benefits from the same headers.

#### 6. Deep Link Readiness

Passage URLs (`/passage/[chunk-id]`) are already designed for universal link interception. When a native app is registered:

- **iOS:** `apple-app-site-association` file at domain root maps `/passage/*` to the app
- **Android:** `assetlinks.json` at `/.well-known/` maps the same

The URL structure is decided now. The association files are added when the app launches.

### Rationale

- **Zero marginal cost.** Service layer extraction, API versioning, and cache headers are conventions, not infrastructure. They cost minutes to implement in Phase 1 and save weeks of refactoring later.
- **Multiple consumers are likely.** Even without a native app, the API may be consumed by: a PWA Service Worker (offline reading), the SRF mobile app team, a future admin dashboard, or third-party integrations (with SRF authorization).
- **SRF ecosystem alignment.** The existing SRF mobile app may want to incorporate portal search or daily passage features. A clean API makes this a simple integration rather than a rewrite.
- **Developer discipline is cheaper than developer heroics.** Establishing the pattern on day one (when the codebase is small) prevents the gradual drift that makes refactoring painful.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Build API later when mobile is planned** | Simpler codebase initially; YAGNI argument | Extracting logic from Server Components is expensive; API shape is influenced by existing code rather than consumer needs |
| **GraphQL instead of REST** | Single flexible endpoint; mobile apps request exactly what they need | Over-engineering for this corpus size; steeper learning curve; REST is simpler for SRF's team |
| **tRPC** | Type-safe API layer shared between Next.js client and server | Couples API to TypeScript consumers; not usable by native mobile apps or external integrations |

### Consequences

- Phase 1 API routes use `/api/v1/` prefix (update DESIGN.md)
- All features implemented via `/lib/services/` functions first, then exposed via Server Components and API routes
- API routes are public (no auth) through Phase 14; auth middleware added only if/when Phase 15 accounts are implemented
- List endpoints return cursor-based pagination
- Cache-Control headers on all API responses
- PWA readiness added to roadmap (Phase 12)
- Stakeholder question: does the portal get its own mobile app, or do features integrate into the existing SRF app?

---

## ADR-025: Progressive Web App as Mobile Intermediate Step

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Before native apps, a Progressive Web App (PWA) offers a lightweight mobile experience with offline capability, home screen installation, and (on Android) push notifications — without App Store approval, review cycles, or revenue sharing.

For the teaching portal specifically, offline reading is a natural use case: a seeker on a flight, in a rural area with poor connectivity, or simply wanting to read without internet distraction. The Quiet Corner meditation timer should work offline. These align with the Calm Technology principle — the technology fades into the background.

### Decision

Add **PWA readiness** as a Phase 12 deliverable. This includes:

| Feature | Implementation | Benefit |
|---------|---------------|---------|
| **Web App Manifest** | `manifest.json` with SRF branding, icons, theme colors | Installable on home screen (iOS + Android) |
| **Service Worker** | Cache book chapters, daily passage, Quiet Corner affirmation | Offline reading and meditation |
| **Offline indicator** | Subtle banner when offline: "You're reading offline. Search requires a connection." | Honest, not alarming |
| **Cache strategy** | Book text: cache-first (changes rarely). Search: network-only. Daily passage: stale-while-revalidate. | Fast reads, fresh search |

### Rationale

- **Natural fit for the content.** Books are static content — the ideal PWA caching target. A seeker can download a book chapter and read it anywhere.
- **Calm Technology alignment.** Offline reading removes the constant-connectivity expectation. The portal works in airplane mode, in a forest, on a train.
- **Low incremental cost.** Next.js supports Service Workers via `next-pwa` or `serwist`. The API-first architecture (ADR-024) and Cache-Control headers make the caching strategy straightforward.
- **No App Store dependency.** A PWA is deployed with the web app. Updates are instant. No review process, no 30% fee, no "minimum iOS version" constraints.
- **Does not preclude native apps.** A PWA and a native app can coexist. The PWA serves seekers who don't want to install an app. The native app (if built) serves seekers who prefer a native experience.

### Consequences

- Phase 12 includes PWA deliverables (manifest, Service Worker, offline caching)
- Offline mode only caches previously viewed content — it does not pre-download entire books (that's a future decision)
- Push notifications deferred — Android supports Web Push, but iOS support is limited and the daily email already serves the notification use case
- The existing SRF mobile app relationship must be clarified (stakeholder question) to avoid confusing seekers with two "apps"

---

## ADR-026: Events and Sacred Places — Signpost, Not Destination

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Seekers who discover Yogananda's words on the portal will naturally ask: "Where can I experience this in person?" Two related needs emerge:

1. **Events.** SRF holds annual World Convocation (already its own site at `convocation.yogananda.org`), commemorations (Christmas meditation, Mahasamadhi, Janmashtami), and online meditation events. The portal should connect seekers to these gatherings without duplicating the convocation site or the Online Meditation Center.

2. **Sacred Places.** Yogananda's life touched specific places that hold deep significance: his birthplace in Gorakhpur, Sri Yukteswar's ashram in Serampore, Lake Shrine in Pacific Palisades, the Encinitas hermitage where the Autobiography was written. No travel site can cross-reference these places with the specific book passages that describe them. The teaching portal can.

Both serve the DELTA Embodiment principle: *put down the device and go somewhere.* The portal bridges digital reading to physical experience.

### Decision

Add two content sections to the portal:

#### Events — Lightweight Signpost

A simple section (on the About page initially, or a dedicated `/events` page) that links to SRF's existing event properties:

| Element | Content | Source |
|---------|---------|--------|
| **World Convocation** | Brief description + link to `convocation.yogananda.org` | Static text + external link |
| **Commemorations** | Christmas meditation, Mahasamadhi, Janmashtami, Founder's Day, etc. | Static list with approximate dates + links to SRF event pages |
| **Online events** | Link to Online Meditation Center live schedule | External link to `onlinemeditation.yogananda.org` |

This is a signpost, not a destination. The portal does not replicate event registration, schedules, or logistics.

#### Sacred Places — Contemplative Geography

A dedicated `/places` page presenting sites of biographical and spiritual significance, cross-referenced with book passages.

**Two categories of places:**

**SRF/YSS properties (official, current):**

| Place | Location | Significance |
|-------|----------|-------------|
| Mount Washington | Los Angeles, CA | International headquarters since 1925 |
| Lake Shrine | Pacific Palisades, CA | Gandhi World Peace Memorial, meditation gardens |
| Encinitas Temple & Retreat | Encinitas, CA | Hermitage where Yogananda wrote the Autobiography |
| Hollywood Temple | Hollywood, CA | Yogananda's first SRF temple |
| Other SRF temples | Various US locations | |
| Hidden Valley Ashram Center | Escondido, CA | Monastic retreat |
| YSS Dakshineswar Ashram | Kolkata, India | Near the Dakshineswar Kali Temple |
| YSS Ranchi Ashram | Ranchi, India | Yogananda's first school for boys (1918) |
| 500+ meditation centers worldwide | Various | Community meditation groups |

**Historical/biographical sites:**

| Place | Location | Significance in Autobiography |
|-------|----------|-------------------------------|
| Gorakhpur | Uttar Pradesh, India | Yogananda's birthplace (Chapter 1) |
| Serampore | West Bengal, India | Sri Yukteswar's ashram (many chapters) |
| Puri | Odisha, India | Sri Yukteswar's seaside ashram |
| Dakshineswar | Kolkata, India | Lahiri Mahasaya's lineage connection |
| Varanasi (Benares) | Uttar Pradesh, India | Lahiri Mahasaya's home |

**Each place includes:**
- Contemplative header image (SRF property photographs where available)
- Brief description of its significance in Yogananda's life and mission
- **Cross-reference to the book** — "Read about this place in Autobiography of a Yogi, Chapter X" with deep link to the reader
- Visiting information — address, hours, link to SRF/YSS site for details
- Simple map (Phase 12)

**The unique value:** The teaching portal is the only place that can cross-reference sacred places with the specific passages that describe them. When a seeker reads about Serampore in the Autobiography, the portal can show "Visit this place." When they browse the Sacred Places page, each entry links back to every passage that mentions it. The teachings and the places illuminate each other.

### Map Strategy

- **Phase 9:** No maps. Text descriptions with addresses and "Get Directions" links (opens user's native maps app).
- **Phase 12:** No embedded map library. Add **"See This Place" Street View links** (plain Google Maps URLs, no SDK) to place cards where coverage exists. Zero map dependencies, zero tile servers, zero maintenance. See ADR-047.
- **Future:** Dynamic center locator (if SRF provides data). If a center locator requires an embedded map, evaluate Leaflet + OpenStreetMap or Google Maps at that point — separate decision for a different page with different requirements.

### Rationale

- **DELTA Embodiment.** The portal should encourage seekers to visit, practice, and connect in person. A well-designed Sacred Places section makes the teachings tangible.
- **Unique cross-referencing.** No other site connects Yogananda's physical world to his written words with deep links into a book reader. This is the portal's distinctive contribution.
- **"What Next" Bridge.** Both Events and Sacred Places serve the portal's signpost function — pointing toward the broader SRF world without tracking conversions.
- **Signpost, not duplicate.** The convocation site handles event logistics. The Online Meditation Center handles live events. The portal links to both without replicating their functionality.
- **No embedded map — Street View links instead (ADR-047).** Zero dependencies, zero tracking, zero cost. Street View URLs give seekers a virtual visit to physical places without embedding any map SDK. "Get Directions" delegates navigation to the user's preferred maps app.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Full interactive map with all SRF centers** | Comprehensive; replaces "Find a meditation group" external link | Requires SRF center database (stakeholder dependency); high implementation complexity; duplicates functionality SRF may already have |
| **Google Maps embeds** | Familiar UX; Street View available | Google tracking scripts on page; API costs; contradicts privacy principles |
| **Leaflet + OpenStreetMap embedded map** | Open-source; no tracking; visual overview of all locations | Library dependency for ~20 pins; page works without it; "Get Directions" already opens real maps apps; not worth the maintenance on a 10-year horizon |
| **No places section — just external links** | Simplest implementation | Misses the unique cross-referencing opportunity; doesn't serve Embodiment principle |
| **Full convocation integration** | Seekers don't leave the portal | Duplicates `convocation.yogananda.org`; maintenance burden; SRF already invested in a separate convocation site |

### Consequences

- Phase 9 adds static Events section and initial Sacred Places page (SRF properties, no maps)
- Phase 12 adds biographical sites and "See This Place" Street View links (ADR-047) — no embedded map library
- Sacred Places content needs SRF/YSS review — biographical descriptions must be accurate and approved
- Cross-referencing places with book passages requires a `places` table and a `chunk_places` junction table (or place tags on chunks)
- Stakeholder question: can SRF provide or approve property photographs? (Already raised.)
- Stakeholder question: does SRF have a center location database (addresses, coordinates, hours) for an eventual center locator?
- The Events section is low-maintenance — updated annually or via Contentful in production

---

## ADR-027: Engineering Standards for SRF Projects

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The teaching portal is the first project built on SRF's new stack (Next.js + Vercel + Contentful + Neon). Patterns established here will influence every SRF project that follows. Beyond technology choices, engineering conventions — how projects are documented, how decisions are recorded, how AI assistants are given context — determine whether the codebase remains maintainable years after the original team has moved on.

The portal has developed a documentation approach (CLAUDE.md, CONTEXT.md, DECISIONS.md, ROADMAP.md) that serves both human developers and AI-assisted development tools. This should be standardized as the SRF project template.

### Decision

Establish the following engineering standards for all SRF projects:

#### Project Documentation Template

Every SRF repository includes these files at the root:

| File | Purpose | Audience |
|------|---------|----------|
| **CLAUDE.md** | AI context file. Project identity, tech stack, constraints, current status. | AI assistants (Claude Code, Copilot, etc.) and human onboarding |
| **CONTEXT.md** | Mission, stakeholders, ethical constraints, organizational context. | Humans (product, leadership, new team members) and AI |
| **DECISIONS.md** | Architecture Decision Records with full rationale for every significant choice. | Future developers asking "why?" |
| **ROADMAP.md** | Phased plan with deliverables, success criteria, and open questions. | Project management, stakeholders, AI context |

#### Code Organization Conventions

| Convention | Rule |
|------------|------|
| **Service layer** | Business logic in `/lib/services/`. Never in Server Components or Route Handlers directly. (ADR-024) |
| **API versioning** | `/api/v1/` prefix on all routes. |
| **Structured logging** | JSON logs with consistent schema: `{ route, method, statusCode, durationMs, requestId }`. Implemented via a shared `lib/logger.ts`. |
| **String externalization** | All UI strings in `messages/{locale}.json`. No hardcoded strings in components. (ADR-020) |
| **CSS logical properties** | `ms-*`/`me-*` instead of `ml-*`/`mr-*`. `start`/`end` instead of `left`/`right`. (ADR-021) |
| **Accessibility baseline** | WCAG 2.1 AA. axe-core in CI. No merge with critical or serious violations. (ADR-017) |

#### Database Migration Convention

Numbered SQL migration files in `/migrations/`:

```
migrations/
  001_initial_schema.sql
  002_add_places_table.sql
  003_add_chunk_places.sql
```

Applied via **dbmate** (SQL-based, no ORM lock-in) or Drizzle ORM migrations. Every migration is reviewed in Git, tested against a Neon branch, and reversible.

#### Dependency Management

- **Renovate** (or Dependabot) configured on all repos for automated dependency update PRs
- Pin to specific versions (not ranges) for production dependencies
- Quarterly review of major version upgrades (especially Next.js)

### Rationale

- **Onboarding speed.** A new developer (or AI assistant) can understand any SRF project by reading four files. No tribal knowledge required.
- **Decision archaeology.** ADRs answer "why?" years later. Without them, teams revisit settled decisions, wasting time and risking regression.
- **AI context engineering.** CLAUDE.md is not just for Claude — it's a machine-readable project summary that benefits any LLM-assisted tool. As AI-assisted development becomes standard, projects with good context files get dramatically better AI contributions.
- **Consistency across projects.** SRF has multiple properties (convocation site, portal, future projects). Shared conventions mean developers can move between projects without relearning patterns.
- **Longevity.** The portal may be maintained for a decade. Conventions that seem like overhead now pay for themselves many times over as team members change.

### Consequences

- The teaching portal's documentation structure becomes the SRF template
- New SRF repos are initialized with CLAUDE.md, CONTEXT.md, DECISIONS.md, ROADMAP.md stubs
- The SRF AE team should review and adopt these standards for existing and new projects
- Migration tooling (dbmate or Drizzle) is chosen in Phase 1
- Renovate/Dependabot configured from the first commit

---

## ADR-028: Testing Strategy

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The portal serves sacred text. A bug that misattributes a quote, displays the wrong passage, or breaks search undermines the core mission of fidelity. Testing is not optional polish — it's a fidelity guarantee.

The SRF tech stack doesn't prescribe a testing framework. The portal needs a layered testing approach that covers components, services, API routes, end-to-end user flows, accessibility, search quality, and visual consistency.

### Decision

Adopt a **layered testing strategy** with specific tools for each layer:

| Layer | Tool | What It Tests | Phase |
|-------|------|---------------|-------|
| **Unit / Integration** | **Vitest** + React Testing Library | Service functions, API route handlers, component rendering, database queries | Phase 3 |
| **End-to-End** | **Playwright** | Full user flows: search → read → share → navigate. Cross-browser (Chrome, Firefox, Safari). | Phase 3 (core flows) |
| **Accessibility** | **axe-core** (CI) + Playwright a11y assertions | Automated WCAG checks on every page. Keyboard navigation flows. | Phase 2 (basic) / Phase 4 (CI) |
| **Search quality** | Custom Vitest suite | ~30 representative queries with expected passages. Precision/recall metrics. | Phase 1 (deliverable 1.11) |
| **Performance** | **Lighthouse CI** | Core Web Vitals thresholds: LCP < 2.5s, CLS < 0.1, INP < 200ms. | Phase 3 |
| **Visual** | **Storybook** | Component documentation, design token consistency, interactive component states | Phase 3 (design system) |
| **Visual regression** | Playwright screenshot comparison | Catch unintended visual changes to reading UI, passage cards, Quiet Corner | Phase 12 |

#### Tool Choices

**Vitest over Jest:** Faster execution, native ESM support, better Vite/Next.js integration. The JavaScript testing ecosystem is converging on Vitest.

**Playwright over Cypress:** Multi-browser support (Chrome, Firefox, WebKit/Safari), native accessibility snapshot API (`page.accessibility.snapshot()`), more reliable in CI, better parallel execution. Playwright's test generator also speeds up writing E2E tests.

**Storybook deferred to Phase 3:** In Phases 1–2, the component count is small (~15-20 components). Storybook adds setup overhead without proportional value. When the Calm Technology design system arrives (Phase 12), Storybook becomes the documentation platform for reusable components across SRF properties.

**No MCP-based testing.** MCP servers are valuable for development workflows (Neon MCP for database operations), but test execution must be deterministic, automated, and reproducible. MCP doesn't add value to test pipelines.

#### Database Test Isolation

Each test run creates a **Neon branch**, runs integration tests against it, and deletes the branch afterward. This provides full database isolation without maintaining a separate test database, using Neon's instant branching capability.

```
CI pipeline:
  1. Create Neon branch from main
  2. Apply migrations to branch
  3. Seed test data
  4. Run Vitest integration tests against branch
  5. Run Playwright E2E tests against branch
  6. Delete branch (cleanup)
```

#### CI Pipeline

```
┌─────────────────────────────────────────┐
│  On every PR:                           │
│                                         │
│  1. Lint (ESLint + Prettier)            │
│  2. Type check (tsc --noEmit)           │
│  3. Unit/integration tests (Vitest)     │
│  4. Accessibility audit (axe-core)      │
│  5. Build (next build)                  │
│  6. E2E tests (Playwright)             │
│  7. Lighthouse CI (performance)         │
│  8. Search quality suite                │
│                                         │
│  All must pass before merge.            │
└─────────────────────────────────────────┘
```

### Rationale

- **Fidelity guarantee.** The search quality test suite is the most important test layer — it verifies that seekers find the right passages. A regression in search quality is a mission failure.
- **Accessibility as gate.** axe-core in CI means accessibility violations block merges, not just generate warnings. This enforces ADR-017.
- **Neon branching for test isolation.** Eliminates the "works on my machine" problem for database-dependent tests. Each PR gets a clean database.
- **Cross-browser E2E.** Seekers worldwide use diverse browsers. Playwright's multi-browser support catches rendering issues that single-browser testing misses.
- **Performance budgets.** Lighthouse CI prevents performance regressions. A portal that's slow on a mobile connection in rural India fails the global accessibility mission.

### Consequences

- Phase 3 includes Vitest, Playwright, axe-core, and Lighthouse CI setup (basic axe-core testing begins in Phase 2)
- CI pipeline runs all test layers on every PR
- Neon branches are created/deleted per test run (Neon free tier supports this)
- Storybook is introduced in Phase 3 alongside the design system foundations
- Search quality test suite is a Phase 1 deliverable (1.11) and grows as the corpus expands
- Visual regression testing begins in Phase 12 when the component library stabilizes

---

## ADR-029: Observability Strategy

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The SRF tech stack specifies New Relic (APM), Sentry (error tracking), and Amplitude (product analytics). The portal should use these tools, but with DELTA-compliant configuration — particularly Amplitude, which defaults to user-level behavioral tracking that violates the Agency and Dignity principles.

### Decision

Use the **SRF-standard observability stack** with portal-specific configuration:

| Layer | Tool | What It Measures |
|-------|------|-----------------|
| **Error tracking** | **Sentry** | Unhandled exceptions, API errors, client-side errors. Next.js source maps for readable stack traces. |
| **APM (performance)** | **New Relic** | API route latency, database query duration, external call timing (Claude API, OpenAI embeddings). Server-side distributed tracing. |
| **Synthetic monitoring** | **New Relic Synthetics** | Uptime checks on key routes (`/`, `/api/v1/search`, `/api/v1/health`, `/quiet`). Alerts on downtime. |
| **Product analytics** | **Amplitude** | *Only* appropriate metrics from CONTEXT.md. DELTA-compliant configuration (see below). |
| **Log aggregation** | **Vercel Logs → New Relic** | Structured JSON logs. Request ID correlation across services. |
| **Frontend performance** | **Vercel Analytics** | Core Web Vitals (LCP, CLS, INP). Edge function performance. Cold start monitoring. |

#### Health Check Endpoint

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

New Relic Synthetics pings this endpoint at regular intervals. Alert if non-200 for > 2 minutes.

#### Structured Logging

Every API route logs a consistent JSON structure via `/lib/logger.ts`:

```typescript
// Standard fields on every request
{
  requestId: string,        // UUID, propagated across services
  route: string,            // e.g., "/api/v1/search"
  method: string,           // GET, POST
  statusCode: number,
  durationMs: number,
  language: string,         // User's locale
  timestamp: string         // ISO 8601
}

// Additional fields for search routes (anonymized)
{
  query: string,            // The search query
  resultCount: number,
  searchMode: string,       // "hybrid", "fts", "vector"
  expansionUsed: boolean    // Whether Claude query expansion was invoked
}
```

No user identification. No IP addresses. No session IDs. Search queries are logged for aggregate trend analysis ("What is humanity seeking?"), not user tracking.

#### DELTA-Compliant Amplitude Configuration

Amplitude's defaults assume user-level behavioral tracking. The portal must explicitly disable:

| Amplitude Default | Portal Override | Reason |
|-------------------|----------------|--------|
| User identification | **Disabled** | Violates Dignity — seekers are not data points |
| Session tracking | **Disabled** | Violates Agency — optimizes for retention |
| Event sequencing | **Disabled** | Violates Agency — builds behavioral profiles |
| Autocapture (clicks, page views) | **Disabled** | Violates Agency — surveillance by default |

**What Amplitude tracks (allowlist):**

| Event | Properties | Purpose |
|-------|-----------|---------|
| `page_viewed` | `{ page_type, language, country_code }` | Countries reached, languages served |
| `passage_served` | `{ book_slug, language }` | Books/passages served count |
| `share_link_generated` | `{ format }` | Share link generation count |
| `center_locator_clicked` | `{}` | Did digital lead to physical? |
| `search_performed` | `{ language, result_count }` | Search usage (not query content — that's in server logs) |

Country code derived from Vercel/Cloudflare edge headers, not IP geolocation lookup. Anonymized at the edge.

### Rationale

- **SRF stack alignment.** Using the established tools (New Relic, Sentry, Amplitude) means the SRF AE team can support the portal without learning new tools.
- **DELTA compliance requires active configuration.** Amplitude, New Relic, and Sentry all default to collecting more data than the DELTA framework permits. The allowlist approach — explicitly specifying what to track rather than what not to track — is the only safe pattern.
- **Structured logging is the foundation.** Good logs make every other observability tool more effective. A request ID that traces from Vercel edge → API route → Neon query → Claude API call makes debugging trivial.
- **Health check + Synthetics = uptime confidence.** A dedicated health endpoint is trivial to implement and provides the foundation for reliable uptime monitoring.

### Consequences

- Phase 1 includes Sentry setup, structured logging (`lib/logger.ts`), and health check endpoint
- New Relic integration in Phase 7 (depending on SRF providing New Relic account access)
- Amplitude configured with explicit allowlist — no autocapture, no user identification
- DELTA compliance review of all observability configuration before launch
- Vercel Analytics enabled from Phase 1 (free with Vercel deployment)

---

## ADR-030: Design Tooling — Figma

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The portal needs a design tool for screen mockups, component design, and eventually the Calm Technology design system (Phase 12). The SRF tech stack brief does not prescribe a design tool. Options range from free open-source tools to industry-standard paid platforms.

### Decision

Use **Figma** for design, starting with the **free Starter plan** in Phase 3, upgrading to **Professional** when the design system work begins in Phase 12.

#### Phase 3 (Free Starter Plan — $0)

- 3 Figma design files (sufficient for: homepage/search, reader/passage, Quiet Corner/About)
- Unlimited personal drafts
- Core screens designed and available for developer reference
- Design tokens (colors, typography, spacing) documented in Figma and exported to `tailwind.config.ts`

#### Phase 12+ (Professional Plan — $15/editor/month)

- Unlimited files
- Shared component library (Calm Technology design system)
- Design token synchronization via Figma Tokens plugin
- Branching for design exploration
- Team collaboration

#### Figma-to-Code Pipeline

```
Figma design tokens (colors, typography, spacing, radii)
        │
        ▼
  Figma Tokens plugin → exports tokens.json
        │
        ▼
  tailwind.config.ts consumes tokens
        │
        ▼
  Components use Tailwind classes
        │
        ▼
  Storybook documents the components (Phase 3+)
```

This ensures the design language stays synchronized between Figma and the codebase. A change to `--portal-gold` in Figma propagates to `tailwind.config.ts` and is automatically reflected in all components.

### Alternatives Considered

| Tool | Pros | Cons |
|--------|------|------|
| **Figma (chosen)** | Industry standard; excellent developer handoff; design tokens export; component variants; real-time collaboration; SRF team likely familiar | Paid for full team features ($15/editor/mo at Professional tier) |
| **Penpot** (open-source) | Free; self-hostable; no vendor lock-in; AGPL license | Smaller community; fewer plugins; less mature component/token system; higher setup overhead if self-hosted |
| **Sketch** | Mature; good design system features; native macOS performance | Mac only; no real-time collaboration; shrinking market share |
| **Adobe XD** | Adobe ecosystem integration | Being sunset by Adobe; not a viable long-term choice |
| **No design tool — code-first** | Zero cost; design in browser | Harder to explore layouts; no stakeholder preview; design decisions embedded in code |

### Rationale

- **Industry standard.** Figma is what most designers and frontend developers know. Hiring or onboarding someone who uses Figma is trivially easy.
- **Free tier covers Phase 3.** Three files and unlimited drafts is sufficient for Phase 3. No cost until the design system requires shared libraries.
- **Design token pipeline.** The Figma Tokens → Tailwind pipeline ensures design and code stay synchronized. This is critical when the Calm Technology design system is reused across SRF properties.
- **Stakeholder communication.** Figma prototypes allow SRF leadership and the philanthropist's foundation to preview the portal before code is written. This is especially valuable for the Calm Technology aesthetic, which is easier to evaluate visually than to describe in words.

### Consequences

- Phase 3: Figma free tier for core screen design
- Phase 12: Upgrade to Professional when Calm Technology design system begins
- Figma Tokens plugin configured to export to `tokens.json`
- `tailwind.config.ts` imports from `tokens.json` for design token synchronization
- Storybook (Phase 3+) references Figma component designs for visual parity

---

## ADR-031: Infrastructure as Code from Phase 3 (Terraform)

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The SRF Tech Stack Brief mandates Infrastructure as Code as a core engineering principle:

> *"All infrastructure should be defined as Infrastructure-as-Code and deployable via a GitLab CI/CD pipeline"*
> — SRF Infrastructure Philosophy, Principle #4

The brief explicitly names **Terraform** as the IaC tool for "everything else" (i.e., everything not covered by Serverless Framework for AWS Lambda). Terraform is integrated into the SRF IDP (Internal Developer Platform), with state stored in the GitLab Terraform backend.

The portal's infrastructure (Neon, Vercel, Sentry, Auth0, New Relic, Cloudflare) falls squarely in Terraform's "everything else" category. Serverless Framework does not apply — the portal is Next.js on Vercel, not Lambda-based.

Additionally, AI-assisted development (Claude Code) makes Terraform authoring and maintenance practical even for small teams. Terraform's declarative HCL syntax is well within Claude Code's capabilities, reducing the traditional overhead of writing and evolving `.tf` files.

### Decision

Use **Terraform** for all infrastructure provisioning from Phase 3. The portal repo includes a `/terraform` directory with modules for each service.

#### Source Control and CI/CD

| Phase | SCM | CI/CD | Terraform State |
|-------|-----|-------|-----------------|
| **Phases 1–9** | GitHub | GitHub Actions | Terraform Cloud free tier or S3 backend |
| **Phase 10+ (production)** | GitLab (SRF standard) | GitLab CI/CD | GitLab Terraform backend (SRF standard) |

Phases 1–9 use GitHub for velocity and simplicity. Migration to GitLab aligns with the SRF IDP when the portal moves toward production readiness in Phase 10.

#### Terraform Module Structure

```
/terraform/
  main.tf                    — Provider configuration, backend
  variables.tf               — Input variables (project name, environment, etc.)
  outputs.tf                 — Connection strings, URLs, DSNs

  /modules/
    /neon/
      main.tf                — Neon project, database, roles, pgvector extension
      variables.tf
      outputs.tf             — Connection string, branch IDs

    /vercel/
      main.tf                — Vercel project, environment variables, domains
      variables.tf
      outputs.tf             — Deployment URL

    /sentry/
      main.tf                — Sentry project, DSN, alert rules
      variables.tf
      outputs.tf             — DSN

    /auth0/
      main.tf                — Auth0 tenant, application, API, actions
      variables.tf
      outputs.tf             — Client ID, domain

    /cloudflare/
      main.tf                — DNS records, WAF rules, bot protection
      variables.tf
      outputs.tf

    /newrelic/
      main.tf                — Synthetics monitors, alert policies, dashboards
      variables.tf
      outputs.tf
```

#### Environment Management

The SRF standard defines four environments: dev, qa, stg, prod. Terraform workspaces or variable files manage per-environment configuration:

```
/terraform/
  /environments/
    dev.tfvars
    qa.tfvars
    stg.tfvars
    prod.tfvars
```

For Phases 1–9, only `dev` is needed. Additional environments are added as the portal moves toward production.

#### What Terraform Manages vs. What It Doesn't

| Managed by Terraform | Managed by Application Code |
|---------------------|-----------------------------|
| Neon project creation, roles, extensions | Database schema (dbmate SQL migrations) |
| Vercel project, env vars, domain bindings | `vercel.json` (build/routing config) |
| Sentry project, alert rules | `sentry.client.config.ts` (SDK config) |
| Auth0 tenant, app, API registration | Auth0 SDK configuration in Next.js |
| Cloudflare DNS, WAF rules | — |
| New Relic Synthetics, alert policies | `newrelic.js` (agent config) |
| GitHub/GitLab repo settings, branch protection | `.github/workflows/` or `.gitlab-ci.yml` |

The boundary: Terraform creates and configures the *services*. Application code configures *how the app uses those services*. Database schema is managed by dbmate migrations, not Terraform — schema changes require migration semantics (up/down), not declarative state.

#### CI/CD Pipeline (Phases 1–9 — GitHub Actions)

```yaml
# .github/workflows/terraform.yml
# Triggered on changes to /terraform/**

on:
  pull_request:
    paths: ['terraform/**']
  push:
    branches: [main]
    paths: ['terraform/**']

jobs:
  plan:
    # On PR: terraform plan, post diff as PR comment
  apply:
    # On merge to main: terraform apply (dev environment)
    # Production: manual approval gate
```

#### CI/CD Pipeline (Phase 10+ — GitLab CI)

```yaml
# .gitlab-ci.yml (aligned with SRF IDP)
stages:
  - validate
  - plan
  - apply

terraform:plan:
  stage: plan
  script:
    - terraform init
    - terraform plan -var-file=environments/${CI_ENVIRONMENT_NAME}.tfvars
  # Plan output stored as artifact

terraform:apply:
  stage: apply
  script:
    - terraform apply -auto-approve -var-file=environments/${CI_ENVIRONMENT_NAME}.tfvars
  when: manual  # Production requires manual approval
  environment:
    name: $CI_ENVIRONMENT_NAME
```

### Rationale

- **SRF mandate.** The tech stack brief requires IaC via Terraform. Delivering infrastructure without Terraform deviates from SRF engineering standards and creates technical debt that must be resolved before production.
- **AI-assisted authoring.** Claude Code writes and maintains Terraform fluently. The traditional objection to IaC ("too much overhead for a small team") is largely neutralized when the AI handles `.tf` file generation, provider configuration, and module structure.
- **Reproducible environments.** `terraform apply` creates a complete environment from scratch. Disaster recovery, staging environment creation, and onboarding new developers all become simple operations.
- **Drift detection.** Terraform detects when infrastructure has been manually changed outside of code. This prevents the "someone changed a setting in the dashboard and nobody knows" problem.
- **Code review for infrastructure.** Infrastructure changes go through the same PR review process as application code. A change to an alert threshold or a DNS record is visible, reviewable, and auditable.
- **GitHub → GitLab migration path.** Starting with GitHub Actions for Phases 1–9 velocity, then migrating to GitLab CI for SRF IDP alignment, is a clean path. The Terraform code itself is SCM-agnostic — only the CI pipeline config changes.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Terraform from Phase 3 (chosen)** | SRF-aligned; reproducible environments; AI-assisted authoring | Upfront setup time; state backend needed |
| **Terraform deferred to Phase 10** | Simpler Phases 1–2; no state management overhead | Deviates from SRF standards; manual infrastructure creates undocumented state; harder to retrofit |
| **Pulumi (TypeScript)** | Same language as application; type-safe infrastructure | Not the SRF standard; not integrated into SRF IDP; smaller provider ecosystem |
| **Platform-native config only** | Simpler; no Terraform learning curve | Not reproducible; no drift detection; violates SRF IaC principle; each service configured independently |
| **AWS CDK** | Strong AWS integration | Portal is Vercel-based, not AWS-heavy; CDK is AWS-centric; not the SRF standard for non-Lambda infrastructure |

### Consequences

- Phase 3 includes `/terraform` directory with modules for Neon, Vercel, and Sentry
- Phases 1–9 use GitHub + GitHub Actions; Phase 10 migrates to GitLab + GitLab CI (SRF IDP)
- Terraform state stored in Terraform Cloud free tier (Phases 3–9) or GitLab Terraform backend (Phase 10+)
- All environment variables and service configuration defined in Terraform — no undocumented dashboard settings
- `.env.example` still maintained for local development (developers run the app locally without Terraform)
- Auth0, New Relic, and Cloudflare modules added as those services are introduced (Phases 5–6)
- Four-environment convention (dev/qa/stg/prod) adopted per SRF standard, with only `dev` active in Phase 3
- Stakeholder question: does SRF prefer the portal repo in GitLab from day one, or is GitHub acceptable for Phases 1–9 with a planned migration?

---

## ADR-032: Embedding Model Versioning and Migration

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The portal uses vector embeddings (currently OpenAI text-embedding-3-small, 1536 dimensions) to power semantic search. Over a 10-year lifespan, the embedding model will almost certainly be replaced 2-3 times as better models emerge — higher quality, lower cost, multilingual improvements, or dimensionality changes.

Re-embedding the entire corpus is a batch operation (read chunks → call new model → update vectors). But during the transition, the search index must continue to function. And the system must know which chunks have been re-embedded and which haven't.

Without tracking which model generated each vector, a model swap becomes an all-or-nothing migration with potential downtime.

### Decision

Add an `embedding_model` column to `book_chunks` that records which model generated the embedding vector. This enables:

1. **Incremental migration.** Re-embed in batches (background job) rather than all at once.
2. **Mixed-model search.** During transition, query both old and new vectors. Weight new-model results higher.
3. **Rollback.** If a new model produces worse results, revert to the previous model's vectors without re-embedding.
4. **Audit.** Always know exactly which model generated a given chunk's vector.

#### Schema Change

```sql
ALTER TABLE book_chunks ADD COLUMN embedding_model TEXT NOT NULL DEFAULT 'text-embedding-3-small';
ALTER TABLE book_chunks ADD COLUMN embedding_dimension INTEGER NOT NULL DEFAULT 1536;
ALTER TABLE book_chunks ADD COLUMN embedded_at TIMESTAMPTZ NOT NULL DEFAULT now();
```

#### Migration Workflow

```
1. Choose new model (e.g., text-embedding-3-large)
2. Create Neon branch for testing
3. Re-embed a sample (100 chunks) on the branch
4. Run search quality test suite against new embeddings
5. Compare precision/recall vs. current model
6. If improved:
   a. Re-embed all chunks in batches (background job)
   b. Update embedding_model, embedding_dimension, embedded_at per chunk
   c. Update the search function to use the new model for queries
   d. Monitor search quality metrics post-migration
7. If not improved: discard branch, keep current model
```

During step 6, the search function can handle mixed models by:
- Querying with both the old and new model's embedding of the user's query
- Merging results via RRF (Reciprocal Rank Fusion) — the same approach already used for hybrid search
- Gradually increasing the new model's weight as more chunks are re-embedded

#### Dimension Change Handling

If a new model uses different dimensions (e.g., 3072 instead of 1536), pgvector supports multiple vector columns:

```sql
-- Add new dimension column
ALTER TABLE book_chunks ADD COLUMN embedding_v2 VECTOR(3072);

-- Create HNSW index for new column
CREATE INDEX idx_chunks_embedding_v2 ON book_chunks
    USING hnsw (embedding_v2 vector_cosine_ops);

-- After all chunks re-embedded, drop old column and index
ALTER TABLE book_chunks DROP COLUMN embedding;
ALTER TABLE book_chunks RENAME COLUMN embedding_v2 TO embedding;
```

### Rationale

- **Models will change.** OpenAI has already released three generations of embedding models (ada-002 → 3-small → 3-large). The pace will continue. Designing for model lock-in is designing for obsolescence.
- **Corpus grows over time.** By Phase 11 (multi-language), the corpus may be 10x larger than Phase 1. Re-embedding at that scale is hours of API calls and significant cost. Incremental migration keeps the portal online throughout.
- **Search quality is the core mission.** A better embedding model directly improves passage retrieval. The portal should be able to adopt improvements without architectural changes.
- **Zero cost now.** Three columns and a convention. No additional infrastructure.

### Multilingual Embedding Requirement (Added 2026-02-18)

**The embedding model must be multilingual.** This is an explicit requirement, not a side-effect. OpenAI's text-embedding-3-small places semantically equivalent text in different languages close together in vector space. This means:

- English embeddings generated in Phase 1 remain valid when Spanish, German, and Japanese chunks are added in Phase 11 — no re-embedding of the English corpus.
- The English fallback strategy (searching English when locale results < 3) works because the multilingual model places the English search query and English passages in compatible vector space — even when the user typed their query in Spanish.
- Cross-language passage alignment (`canonical_chunk_id`) is validated by embedding proximity, not just paragraph index matching.
- Any future embedding model migration must preserve this multilingual property.

If a candidate model has better English retrieval but weaker multilingual mapping, that is **not an upgrade** — it's a regression for the portal's mission of global availability. Benchmark per-language retrieval quality and English fallback quality alongside single-language quality during model evaluation.

### Consequences

- `book_chunks` schema includes `embedding_model`, `embedding_dimension`, and `embedded_at` columns from Phase 1
- The ingestion pipeline records which model it used per chunk
- Search quality test suite (deliverable 1.11) becomes the gate for model migration decisions
- Model migration is a maintenance operation, not an architecture change
- Budget for re-embedding costs when evaluating new models (Phase 11 multilingual benchmarking is a natural trigger)
- Any model migration must preserve multilingual vector space quality — single-language improvements that degrade per-language retrieval or English fallback quality are not acceptable

---

## ADR-033: Architecture Longevity — 10-Year Design Horizon

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The teaching portal serves Yogananda's published works — content that is timeless. The portal itself should be designed for a decade of service. This doesn't mean nothing changes; it means nothing needs to be thrown away and rebuilt from scratch. Every component should be replaceable incrementally.

This ADR documents the longevity analysis and the specific design choices that protect the portal's long-term viability.

### Decision

Design for **graceful evolution** over a 10-year horizon. The architecture prioritizes durable formats and replaceable components.

#### Durability Tiers

**Tier 1 — Effectively Permanent (10+ years, no migration expected):**

| Component | Why It Lasts |
|-----------|-------------|
| PostgreSQL (Neon) | 35+ years old. Industry standard. Growing adoption. |
| SQL migrations (dbmate) | Raw SQL. No framework dependency. A 2026 migration runs in 2036. |
| The data model (books, chapters, chunks, themes, places) | The content is Yogananda's published works. The schema models reality. |
| REST + JSON APIs | HTTP is the internet's substrate. 20+ years dominant. |
| HTML + CSS | The web platform is permanent. Semantic HTML from 2026 renders in 2036. |
| Terraform HCL | Since 2014. Massive enterprise adoption. OpenTofu fork as insurance. |
| ADRs (DECISIONS.md) | Markdown in Git. The most durable artifact in the project. |
| WCAG accessibility standards | 2.1 stable since 2018. 3.0 is backwards-compatible. |

**Tier 2 — Stable, May Need Version Upgrades (5-7 years):**

| Component | Risk | Mitigation |
|-----------|------|------------|
| pgvector | Extension is PostgreSQL-native. Strong momentum. | Standard float arrays. No proprietary format. |
| Embedding models | AI model landscape evolving rapidly. | `embedding_model` column tracks which model generated each vector. Incremental re-embedding. (ADR-032) |
| next-intl | Popular i18n library for Next.js. | Locale JSON files are framework-agnostic. The files survive even if the library changes. |

**Tier 3 — Expect Replacement in 5-10 Years:**

| Component | Risk | Mitigation |
|-----------|------|------------|
| Next.js | JS framework churn cycle: 5-7 years. | Shared service layer (ADR-024). Business logic in `/lib/services/` has zero framework dependency. UI rewrite against same APIs. |
| Vercel | Platform risk. Pricing changes. Acquisition. | Next.js deploys to any Node.js host. Vercel-specific features (ISR, Edge) have equivalents elsewhere. |
| Contentful | CMS market volatility. Pricing increases. | Content synced to Neon. Search index doesn't depend on Contentful availability. Swap CMS, rebuild webhook sync. |
| Auth0 | Acquired by Okta. Pricing trajectory. | Standard OAuth 2.0 / OIDC. Any identity provider implements the same protocols. |
| Claude API | Anthropic's product direction. AI market evolution. | Stateless usage (query expansion, passage ranking). Prompts in service layer. Swap to any LLM. |
| Amplitude | Analytics tool churn. | DELTA allowlist = ~5 events. Trivial to migrate to any analytics tool. |
| Figma | Design tool competition. | Design tokens export to `tokens.json`. The tokens are the durable artifact. |

#### The Five Longevity Guarantees

1. **All data in PostgreSQL.** Nothing lives exclusively in a SaaS tool. Contentful syncs *to* Neon. Amplitude receives *from* the app. If any SaaS tool disappears, the data is in PostgreSQL.

2. **Business logic is framework-agnostic.** `/lib/services/` is pure TypeScript. No Next.js imports. No Vercel imports. A framework migration rewrites the UI layer (~40% of code), not the business logic (~60%).

3. **Raw SQL migrations.** dbmate migrations are `.sql` files that don't depend on an ORM version, a TypeScript compiler version, or a framework version. They outlive everything else in the codebase.

4. **Standard protocols, not proprietary integrations.** OAuth 2.0 for auth. REST + JSON for APIs. SQL for data. HTTP for communication. `hreflang` for i18n. Every integration uses industry standards, not vendor-specific SDKs, at the boundary layer.

5. **Decisions are documented.** ADRs capture *why* every choice was made. When a future team evaluates replacing a component, they understand the original constraints and can make an informed decision rather than guessing.

#### Content Export Capability

The portal can export its entire content graph at any time via standard PostgreSQL tools:

```bash
# Full data export
pg_dump --format=custom --no-owner portal_db > portal_export.dump

# Restore to any PostgreSQL instance
pg_restore --no-owner -d new_portal_db portal_export.dump
```

This is inherent in using PostgreSQL — not a feature to build, but a capability to document and protect. The export includes all books, chapters, chunks, embeddings, themes, places, passage cross-references, and subscriber data.

### Rationale

- **The content is permanent.** Yogananda's published works don't change. A portal that makes them accessible should outlive any single technology trend.
- **SRF institutional continuity.** SRF has existed since 1920. The portal should be designed for an organization that thinks in decades, not quarters.
- **Total cost of ownership.** A 10-year architecture that evolves incrementally costs far less than a 5-year architecture that requires a ground-up rewrite.
- **The service layer is the key insight.** Most web applications that "don't last" failed because business logic was embedded in a framework that became obsolete. The shared service layer (ADR-024) is the single most important longevity decision — it separates what endures (logic) from what changes (presentation).

### Consequences

- All architectural decisions are evaluated against a 10-year horizon, not just immediate needs
- The shared service layer convention (ADR-024) is treated as the project's most important structural rule
- Component replacement is expected and planned for — it's maintenance, not failure
- The search quality test suite (deliverable 1.11) serves as the acceptance gate for any AI model migration
- Future developers can replace any Tier 3 component without touching Tier 1 or Tier 2 components
- `pg_dump` export capability is documented as a deliberate architectural feature

---

## ADR-034: Related Teachings — Pre-Computed Chunk Relations and Graph Traversal

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

The current portal design is primarily reactive — the seeker must search, click a theme, or visit the Quiet Corner. But the Findability Principle (CONTEXT.md) states: *"The teachings should find the seeker, not only the other way around."*

When a seeker reads a paragraph about cosmic consciousness in Autobiography of a Yogi, they may not know that Yogananda wrote about the same experience with different language in Man's Eternal Quest and with scriptural commentary in God Talks With Arjuna. The portal should surface these connections *proactively* during reading.

| Approach | Pros | Cons |
|----------|------|------|
| **No related content** | Simplest. No additional infrastructure. | Misses the Findability Principle. Reader must search to discover cross-book connections. |
| **Real-time vector similarity per paragraph** | Always fresh. No pre-computation needed. | Adds latency to every paragraph scroll. Database load scales with reading activity. |
| **Pre-computed relations table** | Instant lookup. Zero read-time latency. Enables graph traversal. Simple JOIN queries. | Requires batch computation at ingestion. Must be updated incrementally when new content is added. |
| **Knowledge graph (Neo4j, etc.)** | Rich graph queries. Purpose-built for relationship traversal. | New vendor. Operational complexity. Overkill for the relationship types we need. |

### Decision

Use **pre-computed chunk relations** stored in a `chunk_relations` table. For each paragraph (chunk), store the top 30 most semantically similar **same-language** chunks + top 10 most similar **English supplemental** chunks (for non-English chunks only) from the entire corpus, excluding adjacent paragraphs from the same chapter.

This powers three features:

1. **Related Teachings side panel** — while reading, a right-side panel shows the top 3 related passages from other books, updating as the reader scrolls.
2. **"Continue the Thread"** — at the end of every chapter, a section aggregates the most related cross-book passages for all paragraphs in that chapter.
3. **Graph traversal** — clicking a related passage navigates to that passage in its reader context, and the side panel updates with *that* passage's relations. The reader follows threads of meaning across the entire library.

**Incremental update strategy:**

| Scenario | Approach |
|----------|----------|
| **New book ingested** | Compute similarity of each new chunk against all existing chunks (incremental). Update existing chunks' top-30 if new chunks displace current entries. |
| **Single chunk updated** (Contentful webhook) | Recompute that chunk's relations against all existing chunks. |
| **Embedding model migration** (ADR-032) | Full recompute of all relations. |

**Multilingual computation strategy (updated 2026-02-18):**

In a multilingual corpus, a naive "top 30 global" approach underserves non-English languages — most slots would be consumed by chunks in other languages (predominantly English, which will be the largest corpus). The computation instead stores:
- **Top 30 same-language** relations: powers the default "Related Teachings" side panel
- **Top 10 English supplemental** relations: provides fallback for non-English languages when same-language corpus is small. A Spanish reader with only 3 Spanish books can still see related English passages, clearly marked with `[EN]`. Empty for English chunks.
- Total: up to 40 rows per chunk (at 400K chunks across all languages = 16M rows — trivial for PostgreSQL)
- The `rank` column indicates rank within its group (1–30 for same-language, 1–10 for English supplemental)

In Phase 1 (English only), this is equivalent to the original "top 30" — the English supplemental slots are simply empty.

**Filtering:** Relations are filtered at query time via JOINs — by book, content type, language, or life theme. Top 30 same-language relations provide ample headroom for filtered queries within a language. English supplemental relations are included when the same-language results are insufficient, following the same pattern as the search English fallback (always marked with `[EN]`). When filtering yields < 3 results, fall back to a real-time vector similarity query with the filter as a WHERE clause.

### Rationale

- **The Findability Principle demands proactive content surfacing.** Search is necessary but not sufficient. The teachings should meet the reader where they are — in the middle of a paragraph.
- **Pre-computation eliminates read-time latency.** The side panel must feel instant. A database lookup in `chunk_relations` is a simple indexed JOIN — sub-millisecond.
- **Graph traversal is emergent, not engineered.** The semantic graph is implicit in the embedding space. Pre-computing the edges makes it navigable. No special graph database needed.
- **Paragraph-level is the right granularity.** Sentence-level is too noisy (a sentence like "He smiled" has no semantic content). Section-level is too coarse (misses nuance). Paragraphs are complete thoughts — the natural unit of Yogananda's prose.
- **Per-language storage ensures first-class related teachings for every language.** At 400K chunks × 40 relations = 16M rows in the fully multilingual corpus. Trivial storage. Sufficient for filtered queries across most filter combinations. Non-English languages are never second-class citizens whose related teachings depend on constant real-time fallback. English supplemental relations follow the same `[EN]` marking pattern as the search fallback — consistent multilingual UX.
- **Incremental updates are efficient.** Adding a 3,000-chunk book to a 50,000-chunk corpus requires ~150M cosine similarity comparisons — minutes with vectorized computation, not hours.

### Consequences

- The ingestion pipeline gains a new Step 7: Compute Chunk Relations (after embedding, before final verification)
- A `chunk_relations` table is added to migration 001 (empty until Phase 6 populates it with multi-book content)
- A `chunk_references` table is added for human-curated editorial cross-references (supplements automatic similarity)
- Two new API endpoints: `/api/v1/chunks/[id]/related` and `/api/v1/chapters/[slug]/[number]/thread`
- Two new service functions: `relations.ts` and `thread.ts`
- The Book Reader component gains a Related Teachings side panel (desktop) and bottom sheet (mobile)
- A related content quality test suite (Phase 6+) validates that pre-computed relations are thematically relevant, cross-book diverse, and free of false friends
- The `books` table gains a `bookstore_url` column to power "Find this book" links (physical book bridge)

---

## ADR-035: "Seeking..." — Empathic Entry Points on the Homepage

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

The homepage's thematic doors (Peace, Courage, Healing, Joy, Purpose, Love) are *abstract* entry points. They work for a browser who wants to explore. But the 2 AM visitor — the person who can't sleep because of anxiety, or who just lost a parent — needs something more specific.

The Findability Principle says: *"A person at 2 AM, unable to sleep because of anxiety, doesn't know that Yogananda wrote specifically about overcoming fear."* The portal must bridge the gap between a person's immediate situation and the relevant teachings.

| Approach | Pros | Cons |
|----------|------|------|
| **Chatbot / conversational AI** | Most empathetic. Natural language understanding. | Violates ADR-003 (no AI synthesis). Creates expectation of AI-generated advice. |
| **Negative framing ("I'm struggling with...")** | Meets the seeker in their pain. Direct. Honest. | Frames the experience through suffering. Contradicts Calm Technology's positive orientation. |
| **Positive framing ("Seeking...")** | Reframes from pain to aspiration. Aligns with "What are you seeking?" search bar. | Still curated — may not cover every situation. |
| **No empathic entry points** | Simplest. Relies on search bar and themes. | Misses the most vulnerable visitors. Zero-friction discovery requires no formulation of a search query. |

### Decision

Add a **"Seeking..."** section to the homepage below the thematic doors. Each entry point is a curated, positively-framed human situation that maps to a pre-built search query.

**Entry points:**

| Display Text | Pre-built Search Query |
|-------------|----------------------|
| "Peace in a restless mind" | `"peace calm mind anxiety restlessness stillness"` |
| "Comfort after loss" | `"death soul eternal life comfort grief immortality"` |
| "Purpose and direction" | `"purpose meaning life divine plan destiny"` |
| "Courage through fear" | `"courage fear fearlessness soul protection bravery"` |
| "The heart to forgive" | `"forgiveness love peace resentment compassion"` |

### Rationale

- **The Findability Principle's highest expression.** The portal doesn't just wait for a query — it names the human situation and offers a path to the teachings.
- **Positive framing aligns with the tradition.** Yogananda's teachings are fundamentally about what you *can* become, not what you're suffering from. "Seeking courage through fear" is aspirational; "I'm afraid of something" is diagnostic.
- **Zero friction.** Clicking an entry point executes a search immediately. The visitor doesn't need to formulate a query. They don't need to know that Yogananda wrote about fear — they just need to recognize their own situation.
- **Editorially curated.** Entry points can be refined over time based on anonymized search trends from the `search_queries` table ("What is humanity seeking?").
- **DELTA-compliant.** Entry points are the same for every visitor. No behavioral profiling. No personalization.
- **Grief elevated to full theme (ADR-114).** "Comfort after loss" is the entry point; ADR-114 ensures grief/loss also becomes a primary theme page (`/themes/grief`) with deep, dedicated content. Grief is arguably the most common reason someone turns to spiritual literature.

### Consequences

- The homepage wireframe adds a "Seeking..." section between the thematic doors and the YouTube videos
- Entry points are below the fold — a deliberate choice. The above-the-fold experience is for all visitors; this section is for those who scroll because they need more
- The entry points are stored as configuration (or in a `seeking_entries` table) so they can be editorially updated without code changes
- The pre-built search queries must be tested against the search quality evaluation suite to ensure they return relevant, high-quality results

---

## ADR-036: Book Reader Typography — Optimal Line Length and Print Stylesheet

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

The book reader is the portal's primary experience — where seekers spend the most time. Typography research consistently shows that optimal reading line length for extended prose is 65–75 characters per line. Lines longer than 80 characters cause readers to lose their place when moving to the next line; lines shorter than 45 characters break the reading rhythm.

The current design specifies Merriweather at 18px with 1.8 line height, but does not constrain line length. On wide screens, this could result in 120+ character lines — fatally degrading the reading experience.

### Decision

1. **Enforce `max-width: 38rem` (~608px, ~65-75 characters in Merriweather 18px) on the reader text column.** Wide screens get wider margins (and space for the Related Teachings side panel), not wider text.

2. **Provide a `@media print` stylesheet** for the reader and passage pages:
   - Remove navigation, footer, side panel
   - Full-width text at optimal reading width
   - Merriweather at 11pt
   - Citation below each passage
   - Portal URL in small footer
   - Page breaks between chapters
   - No background colors (saves ink)

3. **Include a "Find this book" link** on every passage, linking to the SRF Bookstore page for the physical book. This supports DELTA's Embodiment principle.

### Rationale

- **Line length is the single most important typographic decision for readability.** More important than font choice, font size, or color. Getting this wrong would undermine the "world-class reading experience" goal.
- **Print support respects embodiment.** A printed passage can go on a nightstand, in a journal, on a wall. The print stylesheet is a near-zero-cost addition with high DELTA alignment.
- **The physical book bridge is a signpost, not a sales pitch.** It supports the portal's role as a gateway to deeper engagement with the teachings.

### Consequences

- The reader component enforces `max-width: 38rem` on the text column
- A print stylesheet is included in the global CSS
- The `books` table gains a `bookstore_url` column for the SRF Bookstore URL per book
- The reader header includes prev/next chapter navigation alongside "Find this book"

---

## ADR-037: Reader Typography Refinements — Drop Capitals, Decorative Quotation Marks, Page Texture

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

The reader's typographic foundation (Merriweather 18px, 1.8 line height, 38rem max-width per ADR-036) establishes optimal readability. But readability is the floor, not the ceiling. The reading experience should feel like encountering a well-made physical book — one where every typographic detail signals care and reverence for the words.

Physical sacred texts distinguish themselves through visual craft: drop capitals in illuminated manuscripts, proper typographic punctuation, the texture of fine paper, the special treatment of epigraphs and citations. These details cost little to implement but create a cumulative sense of quality that readers feel even if they can't name.

### Decision

Implement the following typography refinements in the book reader:

1. **Drop capitals** at the start of each chapter — Merriweather 700, `--srf-navy`, spanning 3 lines. Uses CSS `::first-letter` pseudo-element. A tradition from illuminated manuscripts signaling "something begins here."

2. **Decorative opening quotation marks** on displayed Yogananda passages (search results, quote cards, shared passages) — Merriweather 700, 48px, `--srf-gold` at 40% opacity, positioned as a hanging element above-left of the passage. Visually distinguishes *his words* from all other text on the page.

3. **Optical margin alignment** — CSS `hanging-punctuation: first last` where supported (Safari, progressive enhancement). Quotation marks and hyphens hang slightly into the margin, making the text block appear perfectly aligned.

4. **CSS-only paper texture** on the reader background — an inline SVG noise pattern blended with `--portal-bg` via `background-blend-mode: multiply`. Not a bitmap. Zero network cost. The faintest sense of materiality, like the difference between a painted wall and a plastered one.

5. **Chapter epigraph treatment** — Many of Yogananda's chapters begin with verses from the Bhagavad Gita, the Bible, or his own poetry. Epigraphs are: centered, Merriweather 300 at `--text-sm` (15px), `--portal-text-muted`, with more generous whitespace above and below than any other element. Source attribution in small caps. This creates a moment of stillness before the prose begins.

6. **Typographic details throughout** — True em dashes (—) with hair spaces, typographic curly quotes (" " ' '), ellipses as single glyphs (…), small caps for abbreviations. Applied during ingestion (not at render time).

7. **Citation formatting** — Every passage citation uses an em dash (not a hyphen): `— Autobiography of a Yogi, Chapter 12, p. 147`. Open Sans 400, `--portal-text-muted`. Small, precise, always present.

### Rationale

- These are the micro-details that distinguish a sacred text presentation from a blog post
- Each refinement is CSS-only or build-time text processing — no runtime cost
- Drop capitals are universally recognized as "the start of something important"
- The decorative quotation marks create an instant visual language: oversized gold quote mark = *Yogananda's words*
- Paper texture adds warmth without performance penalty (inline SVG, no network request)
- Epigraph treatment respects the multi-tradition sources Yogananda drew from

### Consequences

- The ingestion pipeline (1.2) must apply typographic normalization (smart quotes, proper dashes, ellipsis glyphs)
- The reader component uses `::first-letter` for drop capitals (well-supported across browsers)
- `hanging-punctuation` is progressive enhancement — graceful degradation in unsupported browsers
- Passage display components (search results, quote cards, shared passages) include the decorative quotation mark element
- The paper texture SVG is defined once in global CSS, not per-component

---

## ADR-038: "Dwell" Interaction — Passage Contemplation Mode

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

When reading a physical book, a profound passage stops you mid-page. Your eyes narrow focus. The world around the words softens. This is the natural "dwell" moment — the reader pauses to absorb, re-read, contemplate.

Digital reading lacks this affordance. There is no way to signal "this passage matters to me right now" without leaving the reading flow (copying, highlighting, bookmarking — all pull you out of the text). The reader needs a way to dwell *within* the reading experience.

### Decision

Implement a **"Dwell" interaction** in the book reader:

1. **Trigger:** Long-press (mobile, 500ms) on any paragraph. Desktop: click the hover-revealed dwell icon (ADR-060). Keyboard: `d` key on focused paragraph (ADR-042).
2. **Effect:** Surrounding text dims to 15% opacity over 600ms. The selected passage remains fully vivid. The background warms slightly to `--portal-quote-bg`. The share icon and citation appear quietly below the passage.
3. **Exit:** Tap/click anywhere outside the passage, or press `Escape`. Everything gently returns to normal over 300ms.
4. **No modal, no popup, no overlay.** The passage simply *comes forward* in its existing position.
5. **Accessibility:** `Escape` exits dwell mode. Screen readers announce "Passage focused for contemplation" and "Returned to reading" on enter/exit. The dimmed text retains its DOM position and structure — only `opacity` changes.
6. **`prefers-reduced-motion`:** Transitions are instant (0ms) instead of animated. Dimming still occurs (it's not motion, it's opacity).
7. **Keyboard:** `d` key enters dwell mode on the currently focused paragraph (per ADR-042).

### Rationale

- Mirrors a natural physical reading behavior
- Keeps the reader *in* the text rather than pulling them out to a separate UI
- The share/citation appearing in dwell mode creates a natural moment for sharing or noting
- No new UI elements appear on the page by default — the interaction is discoverable but not intrusive
- Fully reversible — no state is changed, nothing is saved

### Consequences

- Each paragraph in the reader must be focusable and respond to long-press (mobile) and the hover-revealed dwell icon (desktop, ADR-060)
- The dwell state is purely visual (CSS transitions on `opacity` and `background-color`) — no server interaction
- The Related Teachings side panel remains visible during dwell mode and **immediately updates** to show relations for the dwelled paragraph — bypassing the settled paragraph debounce (ADR-062). Dwell is the manual override for Related Teachings focus.
- No analytics. Dwell mode is a private contemplative moment. Tracking it — even anonymously — contradicts the spirit of the feature and the DELTA framework

---

## ADR-039: Time-Aware Reading — Circadian Color Temperature

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

Reading at 9 PM should feel as comfortable as reading at 9 AM, but screens emit the same cold brightness at every hour. Research on circadian-responsive design shows that warmer color temperatures in the evening reduce eye strain and support the body's natural melatonin production.

The portal already uses warm cream (`--portal-bg: #FAF8F5`) instead of pure white. We can extend this warmth to respond to the time of day — not as a medical feature, but as a subtle atmospheric shift that makes reading feel *right* regardless of when it happens.

### Decision

Implement **Time-Aware Reading** as an **opt-out** feature (on by default):

1. **Four time bands** based on the user's local time (computed client-side via `new Date().getHours()`):

   | Band | Hours | Background | Character |
   |------|-------|------------|-----------|
   | Morning | 5:00–9:59 | Slightly cooler cream (`#FDFBF8`) | Crisp, like morning light through a window |
   | Midday | 10:00–15:59 | Standard warm cream (`#FAF8F5`) | The baseline palette |
   | Evening | 16:00–20:59 | Warmer cream (`#F7F2EC`) | Settling in, golden hour warmth |
   | Night | 21:00–4:59 | Option for dark mode: `--srf-navy` bg with cream text | Restful, low-light reading |

2. **Implementation:** CSS custom properties are updated via a small client-side script that runs once on page load and sets a `data-time-band` attribute on `<html>`. CSS rules apply the appropriate palette per band. No polling, no intervals — the band is set once per page load.

3. **Night mode behavior:** The night band applies a dark theme (`--srf-navy` background, `--portal-bg` text, gold accents become more luminous). This is *not* the same as `prefers-color-scheme: dark` (which the portal respects separately). Night mode is time-triggered; dark mode is OS-triggered. If `prefers-color-scheme: dark` is active, the night palette takes precedence over all time bands.

4. **Opt-out:** A small sun/moon icon in the reader header and in site settings. Clicking it cycles through: Auto (default) → Light (always midday palette) → Dark (always night palette). The preference is stored in `localStorage` — no server, no tracking.

5. **Transitions:** When navigating between pages at a time-band boundary, the shift is instantaneous (no cross-fade between bands). The palette differences are subtle enough that transitions are unnecessary.

6. **Privacy:** Entirely client-side. No time data sent to the server. No analytics on which time band is active. DELTA-compliant by design.

### Rationale

- The warmth shifts are subtle enough that most users will never consciously notice — they'll just notice that reading feels comfortable at any hour
- Opt-out (not opt-in) because the default should be the best experience, with an escape hatch for those who prefer consistency
- `localStorage` for preference keeps it simple: no accounts, no server state, no cookies
- Four bands (not continuous) avoids complexity — the palette doesn't drift mid-session
- Night mode as opt-in within the time system acknowledges that some users read in bright rooms at midnight

### Consequences

- The CSS custom property system gains time-band variants for background and text colors
- A small client-side script (~20 lines) runs on page load to set the `data-time-band` attribute
- The time-band preference (`auto`/`light`/`dark`) is stored in `localStorage` under a portal-namespaced key
- The reader header gains a small time-band toggle icon (sun/moon)
- The `prefers-color-scheme: dark` media query is handled as a separate concern — if active, it overrides time-banding to ensure the user's OS preference is always respected
- Phase 12 Reading Mode (10.3) builds on this foundation — sepia mode, font size adjustment, and high-contrast mode complement the time bands

---

## ADR-040: "Breath Between Chapters" — Chapter Transition Pacing

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

In a physical book, turning to a new chapter is a natural pause. The reader's hands move, the page turns, there's a brief moment of anticipation before the new chapter title appears. This pause is part of the reading rhythm — a breath between movements.

In digital reading, chapter transitions are instantaneous: click → content appears. The speed is technically superior but experientially flat. It treats chapters as pages in a document rather than movements in a composition.

### Decision

When navigating between chapters in the book reader:

1. **A 1.2-second pause** — the screen shows only the chapter title (Lora 400, `--text-xl`) centered on the warm cream background. No other elements are visible during this moment.
2. **The chapter text fades in** over 400ms after the pause.
3. **`prefers-reduced-motion`:** The pause is skipped entirely. The chapter loads instantly with no fade. The experience is functionally identical to a standard page navigation.
4. **Direct URL navigation** (deep links, search result clicks) skips the breath — it applies only to sequential prev/next chapter navigation within the reader.
5. **Keyboard shortcut:** The `→` key triggers next chapter and includes the breath. `Enter` on a deep link does not.

### Rationale

- The breath mirrors the physical experience of turning to a new chapter
- 1.2 seconds is long enough to register as intentional, short enough not to feel sluggish
- Only applying to sequential navigation means seekers arriving from search or shared links get immediate access to content
- Full `prefers-reduced-motion` respect ensures no accessibility impact

### Consequences

- The reader component manages a `transitioning` state during chapter navigation
- The chapter title serves as a visual anchor during the transition (already rendered as part of the chapter page)
- No loading spinner is ever shown during this pause — it is silence, not waiting
- The transition timing is defined as a CSS custom property (`--reader-chapter-breath: 1.2s`) for easy adjustment during design review

---

## ADR-041: Lotus Bookmark — Account-Free Reading Bookmarks

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

The portal's design philosophy prioritizes immediate access without registration (Phase 15 introduces optional accounts). But readers still need a way to save their place across reading sessions. Without bookmarks, a reader must remember where they were — or re-search for a passage they found meaningful.

Browser bookmarks are too coarse (they save a URL, not a reading position). The portal needs a lightweight, private, account-free bookmarking system.

### Decision

Implement **Lotus Bookmarks** using `localStorage`:

1. **Bookmark a chapter:** A small lotus icon (SVG, `--srf-gold` at 50% opacity, 20px) appears in the reader header beside the chapter title. Clicking it fills the lotus to full opacity and stores the bookmark. Clicking again removes it. The lotus was chosen because it already exists in SRF's visual language and carries meaning: a lotus marks where light was found.

2. **Bookmark a passage:** In dwell mode (ADR-038), a small lotus icon appears alongside the share icon. Clicking it bookmarks the specific paragraph.

3. **Bookmarks page (`/bookmarks`):** A simple page listing all bookmarked chapters and passages, organized by book. Each entry shows the book title, chapter title, and (for passage bookmarks) the first line of the passage with its citation. Clicking navigates to that position in the reader.

4. **Storage:** All bookmarks stored in `localStorage` under a portal-namespaced key (`srf-portal:bookmarks`). JSON structure:
   ```json
   {
     "chapters": [{"bookSlug": "...", "chapter": 14, "title": "...", "savedAt": "ISO"}],
     "passages": [{"chunkId": "...", "bookSlug": "...", "chapter": 14, "firstLine": "...", "savedAt": "ISO"}]
   }
   ```

5. **No server interaction, no accounts, no tracking.** Bookmarks exist only in the user's browser. Clearing browser data removes them. This is stated clearly on the bookmarks page.

6. **Phase 15 migration:** When optional accounts are introduced (Phase 15), bookmarks are synced to the server on login. `localStorage` bookmarks are offered for import. Until then, bookmarks are entirely client-side.

### Rationale

- Serves the 80%+ of users who will never create accounts
- The lotus icon is meaningful (not a generic bookmark/star) — it connects the interaction to SRF's visual and spiritual vocabulary
- `localStorage` is the simplest possible implementation — no database, no API, no auth
- The bookmarks page provides a personal reading dashboard without any personalization infrastructure
- Privacy: impossible to track what users bookmark (data never leaves the browser)

### Consequences

- The reader header gains a lotus bookmark icon
- The dwell mode UI (ADR-038) gains a lotus bookmark icon alongside the share icon
- A `/bookmarks` page is added to the navigation (appears only when bookmarks exist, or always in footer)
- `localStorage` has a ~5MB limit per origin — sufficient for thousands of bookmarks
- Users on different browsers/devices will have separate bookmark collections until Phase 15 sync
- The bookmarks page is a client-only page (no SSR needed — reads directly from `localStorage` on mount)

---

## ADR-042: Keyboard-First Reading Navigation

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

The reader already defines basic keyboard accessibility (ADR-017, DESIGN.md): `j`/`k` to move between paragraphs, `r` to open related teachings. But a world-class reading experience should make keyboard navigation feel native and fluid — not just accessible, but *preferred* by power users.

Vim-inspired navigation (single-key bindings without modifiers) is the gold standard for keyboard-driven reading in tools like Notion, Gmail, GitHub, and every terminal application.

### Decision

Implement the following keyboard shortcuts in the book reader. All shortcuts are single-key (no modifier) and active only when no input/textarea is focused:

| Key | Action |
|-----|--------|
| `→` or `Space` | Next chapter (with breath transition per ADR-040) |
| `←` | Previous chapter |
| `j` | Scroll to next paragraph (focus ring visible) |
| `k` | Scroll to previous paragraph |
| `d` | Enter dwell mode on focused paragraph (ADR-038) |
| `Escape` | Exit dwell mode, close any open panel |
| `b` | Toggle lotus bookmark on current chapter or focused passage |
| `r` | Toggle related teachings panel (desktop) or bottom sheet (mobile) |
| `t` | Jump to table of contents |
| `/` | Focus search bar in navigation |
| `?` | Show keyboard shortcut help overlay |

**Discoverability:** A small `?` icon in the reader footer opens a keyboard shortcut reference overlay. The overlay is also shown on first visit (once, stored in `localStorage`).

**Conflict avoidance:** All shortcuts are suppressed when an `<input>`, `<textarea>`, or `[contenteditable]` element has focus. The `Space` key for next chapter is suppressed when the page is scrollable and the user has not reached the chapter end (standard scroll behavior takes precedence).

### Rationale

- Vim-style single-key bindings are the most efficient navigation pattern for keyboard users
- Every key binding corresponds to a concept the user already understands (d = dwell, b = bookmark, r = related)
- The `?` help overlay is the universal convention for keyboard shortcuts (GitHub, Gmail, Notion all use it)
- No modifier keys means fewer keystrokes and fewer RSI triggers for heavy readers

### Consequences

- A keyboard event listener is added to the reader page (not globally)
- The shortcut help overlay is a lightweight component shown on `?` keypress
- The `j`/`k` navigation updates `aria-activedescendant` or applies a visible focus ring to the current paragraph
- `Space` for next chapter only activates when the reader has scrolled to the bottom of the current chapter content — otherwise, native scroll behavior is preserved
- Screen readers are not affected by these shortcuts (they use their own key bindings)

---

## ADR-043: Opening Moment — Portal Threshold

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

Every physical sacred space has a threshold — a doorway, a garden path, a moment of silence before you enter. Websites have no equivalent. The page loads, content appears, and you're immediately in the middle of information.

For a portal dedicated to sacred teachings, the first moment should signal that this is a different kind of place. Not a splash screen (those are self-serving), not a loading animation (those are about the system, not the user). A *threshold* — a brief pause that belongs to the visitor.

### Decision

On the **first visit** to the portal (per browser session):

1. The warm cream background appears with a small SRF lotus SVG (approximately 40px, `--srf-gold` at 30% opacity) centered on the screen.
2. After 800ms, the lotus fades to 0% opacity over 400ms as the homepage content gently fades in.
3. The total duration is ~1.2 seconds. No text. No logo. No "loading..." message. Just a breath.

**Constraints:**
- **First visit only** per session — stored in `sessionStorage`. Returning to the homepage within the same session shows content immediately.
- **`prefers-reduced-motion`:** The entire threshold is skipped. Homepage content appears instantly.
- **Slow connections:** If the page content has already loaded during the threshold pause, the fade-in is immediate. If the content is still loading after the threshold, the lotus remains visible until content is ready (replacing what would otherwise be a blank white page or a loading spinner).
- **Direct deep links:** Only applies to the homepage (`/`). Navigation to `/books/...`, `/search?...`, etc. is never delayed.

### Rationale

- A threshold creates the emotional transition from "I'm on the internet" to "I've arrived somewhere intentional"
- 1.2 seconds is imperceptible as a delay but perceptible as a *moment*
- Session-scoped means it happens once, then gets out of the way
- The lotus is already the portal's primary visual motif (ADR-044) — it appears here at its most quiet
- Using it as a graceful loading state (instead of a white flash or skeleton screen) turns a technical necessity into a contemplative gesture

### Consequences

- A thin client-side component wraps the homepage layout, checking `sessionStorage` for the threshold flag
- The lotus SVG is inlined (no network request)
- The threshold is not a route or a separate page — it's a CSS/JS animation layer over the homepage
- If content loads in < 800ms (likely on fast connections with ISR), the threshold adds ~400ms of perceived delay. This is an intentional trade-off: contemplative pacing over maximum speed, *once per session*

---

## ADR-044: Lotus as Unified Visual Motif

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

SRF's visual identity uses lotus imagery extensively — in the logo, as decorative elements on yogananda.org, in the lotus icon family (14 variants with orange, gold, blue, green, and navy colors). The lotus carries profound spiritual meaning: it grows from mud through water to bloom above the surface, symbolizing the soul's journey through the material world to divine realization.

The portal needs a visual identity element that is distinctly SRF, carries spiritual meaning, and can serve multiple UI roles without becoming cluttered.

### Decision

Use a **single simplified lotus design** (geometric, 3-petal, SVG) as the portal's unified visual motif. The same design appears everywhere:

| Use | Size | Color | Opacity |
|-----|------|-------|---------|
| **Section divider** (replaces `<hr>`) | ~16px | `--srf-gold` | 25% |
| **Bookmark icon** in reader (ADR-041) | 20px | `--srf-gold` | 50% (unfilled), 100% (filled) |
| **Favicon** | 16/32px | `--srf-gold` on transparent | 100% |
| **Opening threshold** (ADR-043) | ~40px | `--srf-gold` | 30% |
| **Quote card accent** (optional) | 12px | `--srf-gold` | 20% |

**Design principles:**
- **One design.** Not multiple lotus variants. The same SVG at different sizes and opacities.
- **Never heavy.** The lotus is always subtle — low opacity, small scale. It's felt, not stared at.
- **Geometric, not photographic.** A minimal line drawing, not a photograph or detailed illustration. It should work at 12px.
- **Gold only.** The lotus is always in `--srf-gold`. No multi-color lotus icons in the portal (those belong to yogananda.org).

### Rationale

- One design used consistently creates recognition, which creates meaning
- Low opacity prevents the motif from competing with the text
- A section divider that is a lotus (instead of a horizontal rule) carries spiritual meaning in a functional role
- The favicon immediately identifies the portal in browser tabs

### Consequences

- A single SVG lotus is designed (or derived from SRF's existing lotus family) and included as an inline SVG component
- The SVG is parameterized for size, color, and opacity via CSS custom properties
- Section dividers throughout the portal use the lotus instead of `<hr>` tags
- The favicon is generated from the same SVG

---

## ADR-045: SRF Imagery Strategy in the Portal

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

SRF has extraordinary imagery: the Encinitas hermitage cliffs, Lake Shrine gardens, the Pacific coastline, official portraits of Paramahansa Yogananda and the line of gurus. The portal must use this imagery with care — images should serve the reading experience, not compete with it. ADR-016 establishes guidelines for guru portraits. This ADR extends those guidelines to cover nature photography, homepage imagery, and the overall imagery philosophy.

### Decision

1. **The reading experience is text-only.** No images appear in the book reader column. Imagery would compete with Yogananda's words, and his words always win. The side panel may show video thumbnails (Phase 13) but never photographs.

2. **Homepage hero:** A single, wide, soft-focus photograph of an SRF property (Encinitas coastline, Lake Shrine) overlaid with "Today's Wisdom" in white Merriweather on a semi-transparent `--srf-navy` band. Updated seasonally (4 images per year). If SRF cannot provide or approve photographs, the homepage uses the warm cream background with no hero image — the design works without it.

3. **Quiet Corner background:** An extremely subtle, desaturated nature photograph at 5–8% opacity beneath the warm cream. A hint of sky, a suggestion of water. Visible only if you look for it. Applied via `background-image` with low opacity. If no approved image is available, the page uses `--portal-bg-alt` alone — the quiet stillness works without the image.

4. **Guru portrait in footer:** A small (approximately 48–60px wide), sepia-toned portrait of Paramahansa Yogananda in the site footer beside "Teachings of Paramahansa Yogananda." Not decoration — attribution. Present on every page.

5. **No stock photography.** Ever. If SRF-approved imagery is not available for a use case, the design uses typography and color alone. The warm cream palette and gold lotus motif are sufficient to create a sacred atmosphere without photographs.

6. **Photo-optional design.** Every layout works without images. When SRF photographs are available, they enhance the experience. When they are not, the warm cream palette and gold lotus motif are sufficient to create a sacred atmosphere.

### Rationale

- The portal is a library, not a gallery — text is the primary content
- SRF's properties are genuinely beautiful and carry spiritual significance for practitioners
- Seasonal homepage rotation keeps the portal feeling alive without requiring ongoing editorial effort
- The footer portrait provides a human, reverential anchor on every page
- The "no stock photography" rule prevents the generic spiritual aesthetic that undermines authenticity

### Consequences

- The homepage hero component is conditional — it gracefully degrades to text-only if no image is configured
- A `portal_images` configuration (or simple env var/CMS field) stores the current seasonal hero image
- The Quiet Corner background image is optional and loaded with `loading="lazy"` and low priority
- ADR-016's guidelines on guru portraits remain in effect — this ADR adds the footer portrait and nature photography strategy
- The footer component gains a small portrait element with alt text "Paramahansa Yogananda"

---

## ADR-046: "Show Me Another" — Infinite Wisdom on the Homepage

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

The homepage already features "Today's Wisdom" — a random passage displayed on each visit. But a single passage is a single chance. If it doesn't resonate, the moment passes. Readers of physical Yogananda books often practice *bibliomancy* — opening to a random page for guidance. This ancient practice deserves a digital equivalent.

### Decision

Below the "Today's Wisdom" passage on the homepage, display a single text link: **"Show me another"** — in Merriweather 300 with a subtle `--srf-gold` underline on hover. No button. No card. Just words.

**Behavior:**
1. Clicking "Show me another" fetches a new random passage from the `daily_passages` pool via the existing `/api/v1/daily-passage` endpoint (called with a `?random=true` parameter or similar).
2. The current passage gently cross-fades (300ms) to the new one. The citation updates. No page reload. No spinner.
3. The same passage is never shown twice in a row (the API excludes the current chunk ID).
4. There is no limit on how many times a reader can click "Show me another." The pool is the entire `daily_passages` table.
5. **`prefers-reduced-motion`:** The cross-fade is replaced with an instant swap.

**Implementation:** Client-side `fetch` to the daily-passage API, DOM update, CSS cross-fade transition. No complex state management needed.

### Rationale

- Bibliomancy is a beloved practice among readers of spiritual texts — this is its digital form
- A single text link (not a button) maintains the Calm Technology aesthetic — it's an invitation, not a feature
- Client-side fetch with cross-fade keeps the interaction instant and fluid
- The "Show me another" link could become the reason people return daily — it's the simplest possible engagement mechanism, and the most honest one

### Consequences

- The `/api/v1/daily-passage` endpoint gains a `?exclude=[chunk-id]` query parameter to avoid repeating the current passage
- The homepage "Today's Wisdom" section includes a client-side component for the cross-fade interaction
- The `daily_passages` pool should contain at minimum 100 passages to keep the experience feeling fresh (even at 5 clicks per visit, a visitor would need 20 visits to see a repeat)
- Analytics: optionally track anonymous `passage_refreshed` event count (DELTA-compliant aggregate — no content, no user ID)

---

## ADR-047: Sacred Places — No Embedded Map, Street View Links Instead

- **Status:** Accepted
- **Date:** 2026-02-18
- **Supersedes:** Leaflet + OpenStreetMap portion of ADR-026

### Context

ADR-026 originally specified Leaflet + OpenStreetMap as the Phase 12 embedded map for the Sacred Places page. On re-evaluation, the embedded map adds a library dependency for a page that already communicates geography effectively through its card layout (grouped by category, each card showing city and country). The page works in Phase 5 without any map. "Get Directions" already delegates to the user's preferred maps app for navigation. The one thing no outbound link provided was a *virtual visit* — seeing what a place looks like before traveling there.

### Decision

Drop the embedded map library entirely. Instead, add **"See This Place"** links to place cards — plain Google Maps Street View URLs that open in a new tab.

**What this means:**
- No Leaflet dependency
- No OpenStreetMap tile server dependency
- No map JavaScript on the page
- No API keys for maps
- Zero map-related maintenance

**Street View links** are plain URLs with coordinates baked in. They require no SDK, no API key, and load no scripts on the portal itself. The user's browser navigates to Google Maps in a new tab — any tracking happens there, not on the portal.

**"Get Directions"** links continue to use `geo:` URIs (or platform-specific fallbacks) to open the user's native maps app.

**Street View availability:** Not all places have Street View coverage (particularly some biographical sites in India). The "See This Place" link is only shown for places where coverage exists. The `places` table already stores latitude/longitude; a `street_view_url` column (nullable) can hold the curated Street View URL for each place.

### Rationale

- **The page isn't a map feature — it's a cross-referencing feature.** The unique value is linking places to book passages, not rendering tiles. An embedded map is the least valuable component on the page.
- **Street View delivers the emotional preview.** Virtually standing outside Lake Shrine or the Encinitas hermitage is more compelling than a pin on a Leaflet map. It's the one map capability that matters for a "Contemplative Geography" page.
- **Zero dependencies > low dependencies.** Leaflet is lightweight and stable, but zero map libraries is lighter and more stable. On a 10-year project horizon (ADR-033), every dependency is a maintenance commitment.
- **Privacy preserved.** No Google SDK loaded on the portal. The Street View link is an outbound navigation, same as "Get Directions" or the external SRF property links.
- **Future flexibility.** If a dynamic center locator (500+ locations) is built later, the map library decision can be made for that page with that page's requirements. The Sacred Places page doesn't need to carry that dependency preemptively.

### Data Model Change

```sql
ALTER TABLE places ADD COLUMN street_view_url TEXT;  -- nullable, only for places with coverage
```

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Leaflet + OpenStreetMap** (original ADR-026) | Visual overview of all locations; open-source | Library dependency for ~20 pins; page works without it; less compelling than Street View for virtual visits |
| **Google Maps embed** | Familiar UX; Street View inline | Google tracking scripts on page; API costs; contradicts privacy principles |
| **No map, no Street View** | Simplest possible | Misses the virtual visit opportunity that makes the page come alive |

### Consequences

- Leaflet and OpenStreetMap are removed from the project's dependency list
- The `places` table gains a nullable `street_view_url` column
- Phase 12 Sacred Places work is simpler: add biographical sites + Street View links + Reader ↔ Place cross-reference cards
- The future center locator (if built) makes its own map library decision independently
- CLAUDE.md tech stack table updated to remove the Maps row

---

## ADR-048: Teaching Topics Multi-Category Taxonomy and Semi-Automated Tagging Pipeline

**Status:** Accepted | **Date:** 2026-02-18

### Context

The initial teaching topic design (ADR-013) defined six abstract spiritual qualities — Peace, Courage, Healing, Joy, Purpose, Love — as curated thematic entry points ("Doors of Entry") on the homepage. These serve seekers who want to cultivate a spiritual quality.

However, Yogananda wrote extensively about *life circumstances* — relationships, parenting, grief, work, aging, loneliness. These are a different kind of entry point: not "I want to cultivate this quality" but "I'm going through this and need guidance." A seeker dealing with a divorce, raising a child, or mourning a parent has a concrete situational need that the abstract quality themes don't directly address.

The portal's theme taxonomy needed to expand to serve both dimensions without compromising the calm, focused homepage design.

### Alternatives Considered

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **Expand the flat list** | Add situation themes alongside quality themes in a single list | Simple; no schema change | Homepage "Doors of Entry" grid becomes unwieldy at 12–15 themes; mixes two different kinds of entry point |
| **Two-tier taxonomy** | Add a `category` column ('quality' vs 'situation'); homepage shows only qualities; a "Browse all themes" page shows both | Preserves calm homepage; honest about the two different entry-point types; trivial schema change | Situation themes are one click further from the homepage |
| **Expand "Seeking..." section** | Keep six quality themes; evolve "Seeking..." entry points into full curated collections | No schema change; preserves homepage | Overloads the "Seeking..." section, which was designed as empathic search shortcuts, not browsable collections |

### Decision

Implement a **multi-category theme taxonomy** with a `category` column on `teaching_topics`:

- **`quality`** — spiritual/emotional states (Peace, Courage, Healing, Joy, Purpose, Love). Displayed as "Doors of Entry" on the homepage. Six cards, stable.
- **`situation`** — life circumstances (Relationships, Parenting, Loss & Grief, Work, Loneliness, Aging, and others as content supports). Accessible from "Explore all themes" page linked below the Doors of Entry and from the Library. Not on the homepage grid.
- **`person`**, **`principle`**, **`scripture`**, **`practice`**, **`yoga_path`** — added in ADR-058. Accessible from the "Explore all themes" page. Same tagging pipeline.

All categories use the same theme page template (`/themes/[slug]`). No visual distinction — a seeker browsing "Christ" gets the same reverent, passage-focused experience as one browsing "Peace."

### Theme Tagging Pipeline

Themes are applied to passages via a **semi-automated pipeline: embeddings propose, humans approve.**

**Three-layer process:**

1. **Embedding similarity (automated proposal).** Each theme has a `description` field and a `description_embedding` (same model as book chunks). At ingestion time — or when a new theme is added retroactively — every chunk's embedding is compared against every theme's description embedding via cosine similarity. Chunks above a threshold (e.g., 0.45) receive a candidate `chunk_topics` row with `tagged_by = 'auto'`. This is pure vector math against existing embeddings — no new API calls, no re-ingestion.

2. **Claude classification (optional, for ambiguous cases).** Passages near the similarity threshold may be ambiguous — a passage about "finding peace in family conflict" could be Peace, Relationships, or Healing. Claude can be used as a classifier (same "librarian" role as in search — classifying, not generating): given a passage and theme definitions, which themes apply? This catches what pure vector similarity misses.

3. **Human review (mandatory gate).** No auto-tagged passage is served to users. Auto-tagging produces a candidate list per theme. A reviewer approves, rejects, or adjusts. Approved tags are marked `tagged_by = 'reviewed'`. Reviewers can adjust `relevance` — a passage that perfectly encapsulates the theme gets higher relevance, making it more likely to appear on the theme page.

**Three-state `tagged_by` provenance:**

| Value | Meaning | Served to users? |
|-------|---------|-----------------|
| `manual` | Human placed this tag directly | Yes |
| `auto` | Machine proposed, not yet reviewed | **No** — candidates only |
| `reviewed` | Machine proposed, human approved | Yes |

**Adding a new theme retroactively is cheap:** All chunks already have embeddings. Adding "Relationships" requires one `INSERT` into `teaching_topics`, one vector similarity scan (seconds), optional Claude refinement on borderline cases, and human review of the candidate list. No re-ingestion, no re-embedding. The front-loaded cost is the initial tagging of existing books. After that, each new theme is incremental.

**Publication decision:** A topic page goes live when an editor judges the tagged passages have sufficient depth. No fixed minimum count — five deeply relevant passages about a niche topic like Laya Yoga is worth publishing, while three tangentially tagged passages about a broader topic probably isn't. Human judgment, not mechanical thresholds. This is consistent with the portal's philosophy: AI proposes, humans approve.

### Schema Changes

```sql
-- teaching_topics: add category and description_embedding columns
ALTER TABLE teaching_topics ADD COLUMN category TEXT NOT NULL DEFAULT 'quality';
ALTER TABLE teaching_topics ADD COLUMN description_embedding VECTOR(1536);
CREATE INDEX idx_teaching_topics_category ON teaching_topics(category);

-- chunk_topics: three-state tagged_by + similarity score
-- tagged_by values: 'manual', 'auto', 'reviewed'
-- similarity: cosine similarity when auto-tagged (NULL for manual)
ALTER TABLE chunk_topics ADD COLUMN similarity FLOAT;
CREATE INDEX idx_chunk_topics_pending ON chunk_topics(tagged_by) WHERE tagged_by = 'auto';
```

### API Changes

`GET /api/v1/themes` gains a `category` query parameter:
- `category=quality` — returns only quality themes (used by homepage Doors of Entry)
- `category=situation` — returns only situation themes
- `category=person` — spiritual figures (ADR-058)
- `category=principle` — yogic principles / Yama-Niyama (ADR-058)
- `category=scripture` — sacred texts (ADR-058)
- `category=practice` — spiritual practices (ADR-058)
- `category=yoga_path` — paths of yoga (ADR-058)
- Omitted — returns all topics, ordered by category then sort_order

`GET /api/v1/themes/[slug]/passages` — unchanged. Works identically for all categories. Only serves passages with `tagged_by IN ('manual', 'reviewed')`.

### Multilingual Implications

None. The existing `topic_translations` table handles localized names for any theme regardless of category. Theme descriptions used for auto-tagging are internal (not displayed). The multilingual embedding model produces reasonable candidates for non-English chunks even from English-language theme descriptions. Per-language theme descriptions can improve accuracy in Phase 11 but are not required.

### Consequences

- Phase 5 scope expanded: deliverable 5.2 (theme tagging pipeline) now includes the auto-tagging infrastructure, not just manual tagging
- Situation themes are added incrementally during Phase 5+ as content is ingested and sufficient passages confirmed
- The homepage stays calm — six quality doors, one quiet link to explore all themes
- Editorial governance needed: who decides when a new theme has enough passages to go live?
- The `description` field on `teaching_topics` now serves double duty: internal reference *and* auto-tagging input. Descriptions should be written as rich keyword-laden paragraphs, not terse labels.
- The review queue (`tagged_by = 'auto'`) needs a workflow — Phase 1–9 uses a script or Retool dashboard; Phase 10+ uses Contentful
- **Extended by ADR-058:** Four additional exploration categories (person, principle, scripture, practice) added to the taxonomy, using the same infrastructure

---

## ADR-049: Claude AI Usage Policy — Permitted Roles, Prohibited Uses, and Expansion Roadmap

**Status:** Accepted | **Date:** 2026-02-18

### Context

Claude API is used throughout the portal in carefully constrained roles. The governing metaphor — "the AI is a librarian, not an oracle" (ADR-003) — is well-established, but the specific permitted uses, hard prohibitions, and future expansion opportunities were scattered across ADR-003, ADR-007, ADR-019, ADR-023, and ADR-048 with no single authoritative reference. This created two risks:

1. **Scope creep:** An engineer might add a chatbot or synthesis feature because "Claude can do it" without understanding the theological constraints.
2. **Scope fear:** An engineer might avoid a valuable Claude use case because the boundaries weren't clear.

This ADR consolidates the Claude AI policy into a single reference and establishes the roadmap for high-value expansions that stay within the librarian model.

### The Librarian Model

Claude's role in the portal follows one principle: **Claude helps seekers find Yogananda's words. Claude never speaks for Yogananda.**

Every permitted use falls into one of three categories:

| Category | What Claude Does | Output Format | Human Review Required? |
|----------|-----------------|---------------|----------------------|
| **Finding** | Locates the right passages for a seeker's need | JSON (IDs, terms, scores) | No — output is search infrastructure, not content |
| **Classifying** | Categorizes passages by theme, intent, accessibility, tone | JSON (labels, scores) | Yes — classification affects what users see |
| **Drafting** | Generates non-sacred text (UI strings, captions, alt text) | Draft text files | Yes — mandatory human review before publication |

### Hard Prohibitions (Theological, Non-Negotiable)

These prohibitions are absolute and permanent. No phase, feature, or stakeholder request overrides them.

Claude **never**:

1. **Generates text that could be mistaken for Yogananda's words.** Not even summaries, not even "in the style of." The portal displays only verbatim published text.
2. **Paraphrases, summarizes, or synthesizes across passages.** A seeker reads Yogananda's actual sentences, not Claude's interpretation of them.
3. **Translates Yogananda's published text.** Only official SRF/YSS human translations are served. Machine translation of sacred text is never acceptable — "inviolable constraint, not a cost optimization" (ADR-023).
4. **Interprets meditation techniques or spiritual practices.** The Kriya Yoga technique and SRF Lessons are explicitly out of scope. Claude must not explain, summarize, or advise on spiritual practices.
5. **Acts as a conversational agent or chatbot.** No dialogue, no follow-up questions, no "let me help you explore that further." The seeker interacts with the search bar, not with Claude.
6. **Answers questions directly.** Claude finds passages that answer questions. It does not formulate answers itself.
7. **Profiles or personalizes based on user behavior.** DELTA Agency principle — the AI facilitates access, it does not shape the experience based on behavioral data.

### Currently Permitted Uses

| # | Use Case | Phase | Category | ADR | Description |
|---|----------|-------|----------|-----|-------------|
| C1 | Query expansion | 1 | Finding | ADR-007 | Expands conceptual queries into semantic search terms. Returns JSON array of terms only. Optional — bypassed for simple keyword queries. |
| C2 | Passage ranking | 1 | Finding | ADR-007 | Given user's question + 20 candidate passages, selects and ranks the 5 most relevant. Returns JSON array of passage IDs only. |
| C3 | Highlight boundaries | 1 | Finding | ADR-007 | Identifies which sentences within a chunk best answer the query. Returns character offsets. |
| C4 | Theme classification | 4 | Classifying | ADR-048 | Classifies ambiguous passages into teaching topics. Optional — supplements embedding similarity for borderline cases. Mandatory human review before tags are served. |
| C5 | UI translation drafting | 9 | Drafting | ADR-023 | Translates UI chrome and portal-authored content (NOT Yogananda's text). Draft files undergo mandatory human review by fluent, SRF-aware reviewers. |
| C6 | Social caption drafting | 7 | Drafting | ADR-019 | Generates suggested captions for daily quote images. Human reviews and posts — never auto-post. |

### Approved Expansion: High-Value Claude Uses

The following use cases have been evaluated against the librarian model and approved for inclusion in the roadmap. Each stays within the Finding/Classifying/Drafting categories and respects all prohibitions.

#### E1: Search Intent Classification (Phase 1)

**Category:** Classifying | **Cost:** ~$0.002/query | **Human review:** No (search infrastructure)

Classify the seeker's query intent before search executes, routing to the optimal experience:

| Intent | Example | Response |
|--------|---------|----------|
| `topical` | "peace" | Redirect to `/themes/peace` if theme exists |
| `specific` | "Autobiography chapter 12" | Redirect to reader |
| `emotional` | "I'm scared", "my mother died" | Route to "Seeking..." empathic entry or theme-filtered search with compassionate framing |
| `definitional` | "what is samadhi" | Search with boost for passages where Yogananda *defines* the term |
| `situational` | "how to raise spiritual children" | Search with situation-theme boost |
| `browsing` | "show me something inspiring" | Route to Today's Wisdom / random passage |

**Implementation:** Lightweight classification call before the main search pipeline. Returns a JSON intent label + optional routing hint. Falls back to standard hybrid search if classification is uncertain.

**Why this matters:** The difference between a good search engine and a world-class one is understanding *what kind of answer the person needs*. A seeker typing "I'm scared" at 2 AM needs a different experience than one typing "fear Yogananda quotes."

#### E2: Spiritual Terminology Bridge (Phase 1)

**Category:** Finding | **Cost:** Included in query expansion | **Human review:** No

Enhance query expansion with tradition-aware vocabulary mapping. Seekers arrive with modern, clinical, or cross-tradition terms that don't appear in Yogananda's vocabulary:

| Seeker's Term | Yogananda's Vocabulary |
|---------------|----------------------|
| "mindfulness" | "concentration," "one-pointed attention," "interiorization" |
| "chakras" | "astral cerebrospinal centers," "spiritual eye" |
| "enlightenment" | "Self-realization," "cosmic consciousness," "God-union" |
| "anxiety" | "restlessness," "mental disturbance," "nervous agitation" |
| "therapy" | "self-healing," "mind cure," "affirmation" |
| "trauma" | "past suffering," "karmic burden," "mental wounds" |

**Implementation:** Extend the query expansion system prompt with a spiritual terminology mapping. Claude already does query expansion (C1) — this enriches it with Yogananda-specific vocabulary awareness. The mapping is maintained as a versioned JSON glossary at `/lib/data/spiritual-terms.json`, reviewed by SRF-aware editors.

**Per-book evolution (ADR-052):** The terminology bridge is a living glossary, not a static artifact. Each book ingestion triggers a vocabulary extraction step: Claude scans the new book's chunks and proposes additions to the bridge (new terms, new synonyms for existing mappings, book-specific usages). An SRF-aware editor reviews the diff and approves, modifies, or rejects each proposed addition before merge. The glossary carries source provenance — which book introduced which mapping — enabling source-aware query expansion. See ADR-052 for full lifecycle.

**Why this matters:** The portal serves Earth's population. Most seekers worldwide have never read Yogananda. They arrive with the vocabulary of their own tradition, their therapist, or their Google search. If the portal can only find passages using Yogananda's exact terminology, it fails the people who need it most.

#### E3: Passage Accessibility Rating (Phase 5)

**Category:** Classifying | **Cost:** ~$0.01/chunk (one-time at ingestion) | **Human review:** Spot-check

Rate each passage during ingestion on a newcomer-friendliness scale:

| Level | Label | Description | Example |
|-------|-------|-------------|---------|
| 1 | `universal` | No spiritual background needed | "Have courage. Whatever you are going through will pass." |
| 2 | `accessible` | Assumes general spiritual interest | "The soul is ever free; it is deathless, birthless, ever-existing." |
| 3 | `deep` | Assumes familiarity with Yogananda's framework | "In sabikalpa samadhi the devotee has attained realization of his oneness with Spirit, but cannot maintain cosmic consciousness except in the immobile trance state." |

**Implementation:** Stored as a `accessibility_level` column on `book_chunks`. Computed once at ingestion time by Claude (batch classification of all chunks). Spot-checked by human reviewers. Used to:
- Default homepage "Today's Wisdom" to level 1–2 passages (welcoming newcomers)
- Default theme pages to level 1–2, with "Show deeper teachings" option
- Help search ranking: when relevance scores are tied, prefer more accessible passages

**Why this matters:** This serves newcomers without tracking user behavior (DELTA-compliant). A first-time visitor encountering a passage about sabikalpa samadhi may feel the portal isn't for them. A passage about courage speaks to everyone. The portal should welcome before it deepens.

#### E4: Ingestion QA Assistant (Phase 1)

**Category:** Classifying | **Cost:** ~$0.05/book (one-time) | **Human review:** Yes — every flag reviewed

During the human QA step (Deliverable 1.3), Claude pre-screens ingested text and flags:

- Probable OCR errors ("Ood" → likely "God," "mediiation" → "meditation")
- Inconsistent formatting (straight quotes mixed with smart quotes, inconsistent dashes)
- Truncated passages (chunk ends mid-sentence, suggesting a chunking boundary error)
- Sanskrit diacritics that may have been mangled by PDF extraction
- Passages that appear to be headers, footnotes, or page artifacts rather than body text

**Implementation:** Batch job that processes all chunks for a book and outputs a QA report (JSON) with flagged chunks and suggested corrections. Humans make every decision — Claude reduces the review surface area.

**Why this matters:** The entire portal rests on text quality. OCR errors in spiritual terminology (e.g., "Kriya" misread as "Krlya") silently degrade search retrieval. Catching these before publication protects the foundation everything else is built on.

#### E5: Search Quality Evaluation Judge (Phase 1)

**Category:** Classifying | **Cost:** ~$0.10/evaluation run | **Human review:** No (CI infrastructure)

Automate the search quality evaluation (Deliverable 1.11) by using Claude as the evaluator:

- Given a benchmark query and the search results, does the expected passage appear in the top 5?
- Is the ranking reasonable? (A passage directly addressing the query should rank above a tangentially related one.)
- Are there false positives? (Passages that match keywords but are semantically irrelevant.)

**Implementation:** CI job that runs the 30 benchmark queries against the search API, passes results to Claude for evaluation, and reports a quality score. Threshold: ≥ 80% of queries return at least one relevant passage in the top 3. Runs on every PR that touches the search pipeline, embedding model, or chunking strategy.

**Why this matters:** Manual evaluation of 30 queries is feasible at launch but doesn't scale. As the corpus grows (Phase 5–7) and the search pipeline evolves, automated regression testing ensures quality doesn't silently degrade.

#### E6: Cross-Book Conceptual Threading (Phase 6)

**Category:** Classifying | **Cost:** ~$0.50/book pair (one-time) | **Human review:** Spot-check

Enhance `chunk_relations` (ADR-034) with conceptual understanding. Vector similarity finds passages about the same *topic*, but Claude can distinguish:

| Relation Type | Example | What It Enables |
|---------------|---------|-----------------|
| `same_topic` | Two passages about courage | Standard related teaching (already handled by embeddings) |
| `develops_further` | Autobiography mentions self-control briefly; Man's Eternal Quest has a full chapter | "Yogananda explores this idea at greater length in..." |
| `personal_story` | A teaching principle + an autobiographical illustration of it | "Yogananda shares a personal experience of this in..." |
| `practical_application` | A philosophical passage + a concrete technique or affirmation | "For a practical approach to this teaching, see..." |

**Implementation:** During chunk relation computation (Phase 6, Deliverable 6.1), for the top 10 most similar cross-book passages per chunk, Claude classifies the relation type. Stored as a `relation_type` column on `chunk_relations`. Used to diversify the "Continue the Thread" suggestions and add context labels in the side panel.

**Why this matters:** This is what a human librarian does that a search engine cannot. "If you liked this passage about courage, here's where he tells the story of his own test of courage" — that's a world-class reading experience. No physical book, no PDF, no ebook can do this.

#### E7: Photograph Alt Text (Phase 2)

**Category:** Drafting | **Cost:** ~$0.01 total (one-time, <20 images) | **Human review:** Yes

Generate reverential, descriptive alt text for the portal's Yogananda photographs (About page, footer, book covers):

- Rich descriptions for screen readers (not just "Photo of Yogananda" but "Paramahansa Yogananda seated in lotus position, eyes gently closed in meditation, wearing an ochre robe, circa 1935")
- Tone: warm, respectful, consistent with the portal's devotional register
- One-time batch at build time, reviewed by SRF editors

**Why this matters:** Direct accessibility improvement for visually impaired seekers. A portal that claims accessibility as a foundational principle should describe its sacred images with the same care it gives to its text.

#### E8: Daily Passage Tone Classification (Phase 5)

**Category:** Classifying | **Cost:** ~$0.01/chunk (one-time at ingestion) | **Human review:** Spot-check

Classify passages in the `daily_passages` pool by emotional tone:

| Tone | Description | Example Use |
|------|-------------|-------------|
| `consoling` | Comfort, reassurance, tenderness | Appropriate any day; especially valuable during difficult times |
| `joyful` | Celebration, bliss, divine joy | Lighter fare; good for variety |
| `challenging` | Direct, demanding, calls to action | Powerful but not ideal two days in a row |
| `contemplative` | Deep, meditative, philosophical | Rewards re-reading |
| `practical` | Concrete advice, technique-adjacent | Actionable |

**Implementation:** Stored as a `tone` column on `daily_passages`. The selection algorithm ensures tonal variety across the week (not three "challenging" passages in a row) without any user tracking. Pure editorial metadata.

**Why this matters:** Small refinement that makes the daily experience feel curated rather than random. No personalization, no tracking — just editorial intelligence applied at content level.

### Output Format Constraints

All Claude interactions follow strict output format rules:

| Category | Permitted Output | Prohibited Output |
|----------|-----------------|-------------------|
| **Finding** (C1, C2, C3, E1, E2) | JSON arrays (terms, IDs, offsets, labels) | Prose, explanations, natural language |
| **Classifying** (C4, E3, E4, E5, E6, E8) | JSON objects (labels, scores, flags) | Prose, explanations, natural language |
| **Drafting** (C5, C6, E7) | Draft text for human review | Text published without review |

Claude is never given Yogananda's text as context for generation. When Claude ranks passages (C2) or classifies them (C4, E3, E6), it reads the text to understand it — but its output is always a label, a score, or an ID, never modified text.

### Cost Profile

| Phase | Uses | Estimated Monthly Cost | Notes |
|-------|------|----------------------|-------|
| 1 | C1, C2, C3, E1, E2, E4, E5 | ~$10–20 | Query expansion + ranking per search; QA and eval are one-time |
| 2 | E7 | ~$0.01 (one-time) | Alt text batch |
| 4 | C4, E3, E8 | ~$5–15 (one-time per book) + monthly search | Classification batches at ingestion |
| 5 | E6 | ~$5–10 (one-time per book pair) | Cross-book threading batch |
| 7 | C6 | ~$1/month | Daily caption |
| 9 | C5 | ~$1–5 (one-time per language) | UI translation drafts |

Total ongoing cost remains modest (~$15–25/month) because most Claude uses are one-time batch jobs at ingestion, not per-request runtime calls. The librarian model is inherently cost-efficient: constrained output formats minimize tokens.

### Graceful Degradation

Every Claude integration has a fallback path:

| Use | Fallback | Quality Impact |
|-----|----------|---------------|
| Query expansion (C1, E2) | Direct keyword search (no expansion) | Lower recall for conceptual queries |
| Passage ranking (C2) | RRF-ranked results (no Claude re-rank) | Slightly less precise ranking |
| Intent classification (E1) | All queries → standard hybrid search | Functional but less intelligent routing |
| Theme classification (C4) | Embedding similarity only (no Claude refinement) | More borderline misclassifications |
| Accessibility rating (E3) | No rating; all passages treated equally | Newcomers may encounter advanced passages |
| QA assistant (E4) | Manual review without pre-screening | Higher reviewer burden |
| Eval judge (E5) | Manual evaluation of benchmark queries | Doesn't scale; skipped in CI |
| Cross-book threading (E6) | Embedding similarity without relation types | "Related" without "how it's related" |
| Alt text (E7) | Generic alt text ("Photograph of Paramahansa Yogananda") | Functional but not rich |
| Tone classification (E8) | Random selection without tonal variety | Occasional tonal clustering |

The portal works without Claude. Claude makes it *world-class*.

### Alternatives Considered

| Approach | Description | Why Rejected |
|----------|-------------|-------------|
| **No AI policy document** | Continue with scattered ADR references | Risk of scope creep or scope fear; no single reference for new engineers |
| **Chatbot mode alongside librarian mode** | Offer a conversational AI experience for seekers who prefer it | Violates ADR-003; hallucination risk with sacred text; contradicts DELTA Agency; creates a "teacher" the portal explicitly refuses to be |
| **Open-ended Claude use** | Allow any use case that doesn't violate the hard prohibitions | Too permissive; "not explicitly forbidden" is not the same as "aligned with the mission." Every use case should be evaluated against the librarian model. |
| **No Claude expansion** | Keep only C1–C6; don't add E1–E8 | Misses genuinely valuable uses (intent classification, terminology bridge, accessibility rating) that serve seekers within existing theological constraints |

### Consequences

- ADR-003 (Direct Quotes Only) and ADR-007 (Claude API for AI Features) remain the foundational references; this ADR consolidates and extends them
- The three-category model (Finding / Classifying / Drafting) provides a clear framework for evaluating future Claude use cases
- E1 (intent classification) and E2 (terminology bridge) are added to Phase 1 deliverables — they directly improve search quality at launch
- E3 (accessibility rating) and E8 (tone classification) are added to Phase 5 — they require multi-book content to be meaningful
- E4 (QA assistant) and E5 (eval judge) are added to Phase 1 — they improve quality foundations
- E6 (cross-book threading) is added to Phase 6 — it enhances the Related Teachings system
- E7 (alt text) is added to Phase 2 — it's an accessibility deliverable
- The spiritual terminology mapping (`/lib/data/spiritual-terms.json`) becomes a maintained artifact, reviewed by SRF-aware editors. ADR-052 defines the per-book evolution lifecycle.
- Every new Claude use case proposed in future phases should be evaluated against this ADR's three-category model and hard prohibitions
- **Extended ADRs:** ADR-003 (cross-reference to this policy), ADR-007 (cross-reference to expansion roadmap)

---

## ADR-050: Reading Time Estimate and Scroll Position Indicator

**Status:** Accepted | **Date:** 2026-02-18

### Context

A survey of world-class reading experiences (Kindle, Apple Books, Medium, Standard Ebooks, Bible Gateway, YouVersion, Readwise Reader, iA Writer) reveals a universal pattern: spatial awareness without completion pressure. Readers need to know *where they are* (like a physical bookmark between pages) but should not be pressured to *finish* (like a progress bar urging completion).

The portal's longest chapters (*The Second Coming of Christ*, *God Talks With Arjuna*) can exceed 30 pages. Without any spatial indicator, the reader has no sense of whether they're near the beginning, middle, or end. This is disorienting, especially on a phone where physical page count offers no cues.

The tension: the portal's Calm Technology principle (no gamification, no dopamine loops) prohibits completion tracking, reading streaks, "X minutes remaining" countdowns, or any feature that frames contemplative reading as a task to finish. But the practical need for spatial awareness is real.

### Decision

**Three features. Three prohibitions.**

#### 1. Chapter Reading Time Estimate

A subtle, one-time estimate displayed below the chapter title:

```
Chapter 12: The Heart of a Disciple
~8 min · 1,640 words
```

- Calculated from word count at **200 WPM** (deliberate contemplative pace, not skimming)
- Styled in `--portal-text-muted`, Lora or Open Sans (not the body serif), small size
- **Disappears** as the seeker scrolls into the chapter text — it set the expectation, then gets out of the way
- Not shown on passage pages, search results, or shared quotes — only the full chapter reader
- Computed at build time from chunk word counts — zero runtime cost

**Why 200 WPM:** Research puts average reading speed at 200–250 WPM. Using 200 slightly overestimates the time, which is the right error direction — "I have a few extra minutes" feels better than "this is taking longer than promised." For Yogananda's prose, which rewards rereading and reflection, 200 WPM also accounts for natural pauses.

#### 2. Scroll Position Indicator

A 2px line at the very top of the viewport. `--srf-gold` at 30% opacity. Width proportional to scroll position within the chapter.

- Answers **"where am I?"** — spatial awareness, like a physical bookmark between pages
- **Not a percentage.** No number. No "X minutes remaining." No label.
- The visual language is a **position**, not **progress**. Progress implies a task to complete. Position implies a place within a space.
- `prefers-reduced-motion`: static position marker instead of animated width change
- **Hidden when Dwell mode is active** — Dwell is about one passage, not the chapter
- `--srf-gold` at 30% opacity ensures it's felt, not stared at — consistent with the lotus motif opacity strategy (ADR-044)

#### 3. Consolidated Reader Settings Panel

Reader controls currently defined across multiple ADRs (font size in ADR-017, circadian toggle in ADR-039, bookmarks in ADR-041) are consolidated into a single, quiet settings popover accessible from the reader header:

```
┌───────────────────────────┐
│  Reading                   │
│                            │
│  Text Size    A−   A   A+  │
│  Theme     ☀ Auto  🌙     │
│  Spacing    ─   ═   ≡     │
│                            │
└───────────────────────────┘
```

- Three controls: text size (three steps), color theme (auto/light/dark per ADR-039), line spacing (compact/normal/relaxed)
- `localStorage` persistence — no accounts, no server, no tracking
- Keyboard-accessible: `s` opens settings (added to ADR-042 key map)
- Closed by clicking outside, pressing `Escape`, or pressing `s` again
- Not a sidebar — a small popover from the reader header. Appears, is used, disappears.

#### What We Explicitly Do NOT Build

| Feature | Why Not |
|---------|---------|
| "X minutes remaining" countdown | Creates urgency; frames reading as a task |
| Percentage complete ("73%") | Creates completion pressure |
| Reading speed tracking | Surveillance; violates DELTA Agency |
| Chapter completion checkmarks | Gamification; violates Calm Technology |
| "You read X chapters this week" streaks | Gamification; violates Calm Technology |
| "You read faster than X% of users" | Competition; antithetical to spiritual reading |
| Reading goals ("read 3 chapters/week") | YouVersion does this — we deliberately do not |

### Rationale

- **Standard Ebooks, Bible Gateway, Kindle** all show that spatial awareness serves readers of long-form text without requiring gamification
- **Medium's progress bar** works because articles are short (5–15 minutes); for book chapters it would create task pressure
- **YouVersion's reading streaks** demonstrate the gamification trap — the most popular Bible app uses engagement patterns that contradict contemplative reading. Our portal makes the opposite choice.
- **Readwise Reader's keyboard-first design** validates our keyboard navigation (ADR-042) as a world-class feature, not a niche one
- **iA Writer's philosophy** ("web design is 95% typography") aligns with our approach — the reading experience *is* the typography

### Consequences

- Reader component gains: chapter reading time element (build-time computed), scroll position indicator (client-side), settings popover
- `book_chunks` metadata can store per-chapter word count for reading time calculation (or computed at build time from chunk content)
- ADR-042 keyboard map gains `s` for settings
- Phase 4 deliverable scope: reader settings consolidation
- The scroll position indicator uses `IntersectionObserver` or `scroll` event with `requestAnimationFrame` — standard performance-safe approaches
- The three prohibitions (no countdown, no percentage, no streaks) should be added to the Calm Technology constraint for permanence

---

## ADR-051: Remove book_store_links Table — Simplify Bookstore Links

**Status:** Accepted | **Date:** 2026-02-19

### Context

The original schema included a `book_store_links` table for per-language bookstore URLs (SRF Bookstore for English, YSS Bookstore for Hindi/Bengali, regional Amazon or publisher sites for others), with a fallback to the `books.bookstore_url` column.

### Decision

Remove the `book_store_links` table entirely. The `books.bookstore_url` column is sufficient — it points to the SRF Bookstore for all books. The portal is not an e-commerce gateway; directing seekers to the SRF Bookstore is the appropriate action for all languages in all foreseeable phases.

If per-language bookstore routing is genuinely needed in Phase 11 (YSS Bookstore for Hindi/Bengali editions), a simple lookup table or additional column can be added at that time — a trivial migration.

### Consequences

- One fewer table, one fewer foreign key relationship, one fewer fallback logic path
- `books.bookstore_url` is the single source for "Find this book" links
- Phase 11 deliverable 11.11 updated to reference `books.bookstore_url` instead of `book_store_links`
- Zero impact on any Phase 1–10 deliverable

---

## ADR-052: Terminology Bridge Per-Book Evolution Lifecycle

**Status:** Accepted | **Date:** 2026-02-19

### Context

ADR-049 E2 establishes the spiritual terminology bridge at `/lib/data/spiritual-terms.json` as a static vocabulary mapping. However, each new book in the corpus introduces new terms, metaphors, and usages specific to its content. The bridge must grow with the library.

### Decision

Add a vocabulary extraction step to the book ingestion pipeline. When a new book's chunks are processed, Claude scans the full chunk set (Classifying category, JSON output) and extracts Yogananda's distinctive terms. The extracted vocabulary is diffed against the current `spiritual-terms.json`, and proposed additions are presented to an SRF-aware editor for human review before merging.

The glossary carries source provenance — which book introduced which mapping — enabling source-aware query expansion (terms from the book a seeker is currently reading can be boosted).

### Data Structure

```json
{
  "mindfulness": {
    "yogananda_terms": ["concentration", "one-pointed attention", "interiorization"],
    "sources": ["autobiography-of-a-yogi", "mans-eternal-quest"],
    "added": "2026-03"
  }
}
```

### Lifecycle

1. **Extract:** Claude scans new book chunks → produces vocabulary inventory (JSON)
2. **Diff:** Compare against existing `spiritual-terms.json` → identify new terms, new synonyms, book-specific usages
3. **Review:** SRF-aware editor approves/modifies/rejects each proposed addition (AI proposes, humans approve)
4. **Merge:** Approved additions committed to `spiritual-terms.json` with provenance metadata

### Consequences

- The terminology bridge becomes a living glossary that deepens with each book, not a one-time artifact
- Each book ingestion generates a vocabulary review task for the editorial workflow
- No schema migration needed — the bridge is a file-based artifact in git, read by the ingestion pipeline and query expansion prompt
- **Extends ADR-049 E2** with the evolution lifecycle

---

## ADR-053: ~~Search Query Retention and Aggregation Strategy~~ (Withdrawn)

**Status:** Withdrawn | **Date:** 2026-02-19

Withdrawn as over-engineering. At ~1,000 searches/day, the raw `search_queries` table grows ~73 MB/year — trivially manageable for Neon over a 10-year horizon (~730 MB total). No retention policy, aggregation table, or cron job needed. If retention becomes necessary in year 5+, it's a trivial addition. Keep the raw table as-is — human-readable verbatim text, no hashing, no compression, no complexity.

---

## ADR-054: Editorial Reading Threads — "Teachings in Conversation"

**Status:** Accepted | **Date:** 2026-02-19

### Context

The `chunk_relations` table (ADR-034) connects passages by semantic similarity. But algorithmic similarity is not the same as editorial curation. A human editor can arrange passages into a coherent progression — recognition → understanding → practice → transcendence — that no embedding model can produce.

The "Seeking..." entry points on the homepage already hint at this. Threads make the connection explicit and browsable.

### Decision

Add editorially curated reading threads as a first-class content type. Each thread is a human-selected, human-sequenced arrangement of existing passages from across multiple books, tracing a single spiritual theme as a coherent reading experience.

Threads are not AI-generated content. They are curated paths through existing verbatim passages — the same artworks in a thoughtful arrangement. Optional editorial notes between passages provide transitions ("In this next passage, written twenty years later, Yogananda returns to...") without ever paraphrasing Yogananda's words.

### Schema

- `editorial_threads` table: slug, title, description, language, `is_published` (human review gate)
- `thread_passages` table: references `book_chunks`, ordered by `position`, with optional `editorial_note`

### Route

- `/threads` — Index of all published threads
- `/threads/[slug]` — A single thread presented as a contemplative reading experience

### Phase

Phase 6 (Related Teachings & Reader Intelligence) — editorial threads complement the algorithmic chunk relations with human curation.

### Consequences

- Two new tables in the schema (`editorial_threads`, `thread_passages`)
- Editorial workflow: threads must be created and curated by a human editor
- `is_published` flag ensures no thread reaches seekers without review
- The `/threads` route becomes a new navigation entry point alongside search, themes, and the library
- Editorial notes are the only non-Yogananda prose on the portal besides UI chrome — they must be held to a consistent editorial voice

---

## ADR-055: Reverse Bibliography — "What Yogananda Read"

**Status:** Accepted | **Date:** 2026-02-19

### Context

Yogananda's published works contain hundreds of references to external sources: the Bhagavad Gita, the Bible, the Yoga Sutras of Patanjali, Kabir, Mirabai, Rumi, Tagore, Einstein, and many others. This data is already in the text but not surfaced as a navigable dimension.

### Decision

Add a reverse bibliography as a browsable content type. A Claude "Classifying" pass at ingestion time extracts external references from each chunk, identifying the source and the nature of the reference (direct quote, discussion, allusion). Human spot-check required.

This serves scholars, interfaith seekers, and devotees who want to understand Yogananda's intellectual and spiritual lineage. It's factual extraction, not generation — consistent with the librarian model.

### Schema

- `external_references` table: name, slug, type (`scripture`, `person`, `text`, `tradition`), description, denormalized count
- `chunk_external_references` junction table: links chunks to references with `nature` (quote/reference/discussion/allusion) and `tagged_by` (auto/reviewed/manual) provenance

### Route

- `/references` — Index of all external sources with passage counts
- `/references/[slug]` — All passages where Yogananda engages with that source

### Claude Integration

Category: **Classifying** | Output: JSON array of `{source, type, nature}` | Human review: Spot-check

### Phase

Phase 6 (Related Teachings & Reader Intelligence) — the reverse bibliography is a natural companion to chunk relations and editorial threads.

### Consequences

- Two new tables in the schema (`external_references`, `chunk_external_references`)
- Ingestion pipeline gains an external reference extraction step
- The three-state `tagged_by` provenance (consistent with ADR-048) ensures unreviewed auto-extractions can be filtered
- Enriches the portal's navigational surface: seekers can browse by source, not just by theme or book
- **Extends ADR-049** with a new Classifying use case (E9: External Reference Extraction)

---

## ADR-056: Calendar-Aware Content Surfacing and Quiet Index

**Status:** Accepted | **Date:** 2026-02-19

### Context

The `daily_passages` pool supports optional seasonal weighting, but the connection between specific calendar dates and Yogananda's teachings is not explicitly modeled. Separately, Phase 5 plans E3 (Passage Accessibility Rating) and E8 (Tone Classification), but these classifications are not yet combined into a browsable dimension.

### Decision

**Calendar-aware surfacing:** Add explicit date-to-passage associations for spiritually significant dates. When today matches a calendar event, the homepage "Today's Wisdom" draws from the calendar pool. The event name appears as a subtle subtitle below the passage.

Calendar categories:
- Yogananda's life events (birth, mahasamadhi, arrival in America)
- Hindu/Indian calendar (Makar Sankranti, Diwali, Janmashtami)
- Christian calendar (Christmas, Easter — Yogananda wrote extensively about Christ)
- Universal observances (International Day of Peace, World Meditation Day)

**The Quiet Index:** Combine E3 and E8 into a browsable contemplative taxonomy: passages organized by texture (contemplative, practical, devotional, philosophical, narrative). Extends the Quiet Corner (`/quiet`) with texture-based browsing: `/quiet/contemplative`, `/quiet/practical`, `/quiet/devotional`.

### Schema

- `calendar_events` table: name, description, month, day, category, `is_active`
- `calendar_event_passages` junction table: links events to chunks

(The Quiet Index requires no new schema — it uses E3 and E8 classifications already stored on `book_chunks` or `chunk_topics`.)

### Phase

- Calendar-aware surfacing: Phase 5 (when multi-book content enables meaningful calendar coverage)
- Quiet Index browsing: Phase 5 (after E3 and E8 classifications are applied)

### DELTA Alignment

Calendar events are the same for every visitor — no personalization, no behavioral tracking. The calendar pool is editorially curated, not algorithmically selected. The Quiet Index serves seekers who know what they need emotionally but not what they're searching for intellectually.

### Consequences

- Two new tables for calendar events
- The homepage "Today's Wisdom" gains calendar awareness without replacing the general daily pool
- The Quiet Index adds texture-based browsing routes under `/quiet/`
- Editorial governance needed: who maintains the calendar events and passage associations?
- Aligns with "Signpost, not destination" — meeting seekers at their cultural calendar

---

## ADR-057: Video Transcript Time-Synced Architecture

**Status:** Accepted | **Date:** 2026-02-19

### Context

Phase 13 (Cross-Media Search & Video Transcription) was described at a high level in the roadmap. The availability of multiple transcription services with word-level timestamp support enables a richer architecture: time-synced playback, cross-media chunk relations, and synchronized transcript display.

### Decision

Define the video transcript architecture as a natural extension of the existing content model:

1. **Transcription sources:** YouTube auto-captions (free), YouTube manual captions (free, higher quality), OpenAI Whisper API ($0.006/min), Deepgram (similar pricing with speaker diarization). Start with YouTube captions; upgrade to Whisper where quality is insufficient.

2. **Schema:** `video_transcripts` table stores the full transcript with source metadata. `video_chunks` table mirrors `book_chunks` — same embedding model, same FTS strategy, plus `start_seconds` and `end_seconds` timestamps for time-synced playback.

3. **Unified search:** Because `video_chunks` uses the same embedding model and FTS as `book_chunks`, the hybrid search function extends naturally to return interleaved book passages and video segments, ranked by relevance.

4. **Cross-media chunk relations:** Pre-computed `chunk_relations` can span book chunks and video chunks. The reader's Related Teachings panel can show timestamped video segments alongside book passages.

5. **Time-synced playback:** Video results link to `youtube.com/watch?v={video_id}&t={start_seconds}`, and YouTube's embed API supports the `start` parameter for in-portal embedding. The transcript display scrolls to follow playback with clickable timestamps.

### Estimated Cost

Full transcription of SRF's YouTube library (~500 videos) via Whisper: $150–300 one-time. YouTube captions are free.

### Consequences

- Two new tables (`video_transcripts`, `video_chunks`) added in Phase 13
- The hybrid search function extends to query `video_chunks` alongside `book_chunks`
- `chunk_relations` computation expands to include cross-media similarity
- The video player page (`/videos/[id]`) gains a synchronized transcript panel
- The schema extension is fully additive — no changes to existing tables
- The architectural groundwork (hybrid search, chunk relations, embedding pipeline) generalizes to video chunks naturally

---

## ADR-058: Exploration Theme Categories — Persons, Principles, Scriptures, Practices, Yoga Paths

**Status:** Accepted | **Date:** 2026-02-19

### Context

ADR-048 established a two-tier theme taxonomy (`quality` and `situation`) on the `teaching_topics` table. This serves seekers who approach Yogananda's teachings through emotional/spiritual needs or life circumstances. But seekers also approach through *intellectual and traditional frameworks*:

- **By person:** "What does Yogananda say about Christ?" or "Teachings about Krishna"
- **By yogic principle:** "Yogananda on ahimsa" or "What is tapas?"
- **By scripture:** "Yogananda's interpretation of the Yoga Sutras" or "Gita teachings"
- **By practice:** "How to meditate" or "Yogananda on pranayama"

These are natural entry points for scholars, yoga practitioners, interfaith seekers, and devotees with specific study interests. They require no new infrastructure — they use the same `teaching_topics` table, the same tagging pipeline, the same page template, and the same three-state provenance.

### Decision

Add five new categories to the `teaching_topics.category` column:

| Category | Description | Examples |
|----------|-------------|----------|
| **`person`** | Spiritual figures Yogananda discusses | Christ, Krishna, Lahiri Mahasaya, Sri Yukteswar, Patanjali, Kabir, Divine Mother |
| **`principle`** | Yogic ethical principles (Yama/Niyama) | Ahimsa, Satya, Asteya, Brahmacharya, Aparigraha, Saucha, Santosha, Tapas, Svadhyaya, Ishvara Pranidhana |
| **`scripture`** | Scriptural frameworks Yogananda interprets | Yoga Sutras, Bhagavad Gita, Bible, Rubaiyat of Omar Khayyam |
| **`practice`** | Spiritual practices | Meditation, Concentration, Pranayama, Affirmation, Devotion |
| **`yoga_path`** | Paths of yoga | Kriya Yoga, Raja Yoga, Bhakti Yoga, Karma Yoga, Jnana Yoga, Hatha Yoga, Mantra Yoga, Laya Yoga |

All categories use:
- The same `teaching_topics` table with its `category` column
- The same auto-tagging pipeline (embedding similarity + optional Claude classification + human review)
- The same three-state `tagged_by` provenance (`auto`, `reviewed`, `manual`)
- The same `/themes/[slug]` page template
- Publication is an editorial decision — no fixed minimum passage count

### Relationship to ADR-055 (Reverse Bibliography)

The `person` and `scripture` categories overlap with the Reverse Bibliography feature (ADR-055). The distinction:

- **`teaching_topics` (person/scripture):** "What does Yogananda *teach about* Christ/the Gita?" — passages where the topic is the central subject
- **`external_references`:** "Where does Yogananda *cite or quote* Christ/the Gita?" — passages with direct references, quotes, or allusions

Both are valuable; they serve different needs. A seeker browsing `/themes/christ` wants Yogananda's teachings about Christ consciousness. A seeker browsing `/references/jesus-christ` wants specific passages where Yogananda quotes or directly references Jesus.

### Navigation

The `/themes` page organizes all categories into distinct sections:

1. "Doors of Entry" (quality) — on homepage and themes page
2. "Life Circumstances" (situation)
3. "Spiritual Figures" (person)
4. "Yogic Principles" (principle)
5. "Sacred Texts" (scripture)
6. "Spiritual Practices" (practice)
7. "Paths of Yoga" (yoga_path)

Categories appear only when they contain at least one published topic. The homepage remains unchanged — six quality doors only.

### Phase

- `quality` and `situation` themes: Phase 5 (existing plan)
- `practice` themes: Phase 5+ (practical themes like Meditation naturally emerge from the early content)
- `person`, `principle`, `scripture` themes: Phase 6+ (requires multi-book content for meaningful coverage; benefits from the Reverse Bibliography extraction pipeline)

### Alternatives Considered

| Approach | Why Rejected |
|----------|-------------|
| **Separate tables per category** | Unnecessary complexity; the same tagging infrastructure applies to all categories |
| **Hierarchical taxonomy** (e.g., scripture → Gita → Chapter 2) | Over-engineering for Phase 6; a flat per-category list is sufficient. Sub-categories can be added later if content depth warrants |
| **Merge with Reverse Bibliography** | Different user intent: "teach me about X" vs "show me where X is cited." Both valuable, different navigation paths |

### Consequences

- No schema migration needed — `category` column already accepts any text value
- The auto-tagging pipeline processes new categories identically to quality/situation themes
- Seed data for new categories should include rich, keyword-laden descriptions for effective auto-tagging
- The `/themes` page gains five new sections (appearing incrementally as content thresholds are met)
- The exploration categories create a rich navigational surface that invites study-oriented seekers to browse by framework, not just by emotional need
- **Extends ADR-048** with five additional categories on the existing taxonomy

---

## ADR-059: Sharing Formats — Email, PDF, and Download

**Status:** Accepted | **Date:** 2026-02-19

### Context

ADR-015 established passage sharing via clean URLs with OG cards and downloadable quote images. ADR-019 covered SRF organizational social media assets. But neither ADR addresses the full spectrum of how a seeker might want to share or keep a teaching:

| Scenario | What the seeker wants | Current coverage |
|----------|----------------------|-----------------|
| Text a friend a quote | Copy link, paste into messaging app | ADR-015 (OG card) ✓ |
| Email a passage to someone | Pre-formatted email with passage, citation, and link | Not specified |
| Email a chapter or book section | Longer content, either as link or attachment | Not specified |
| Save a passage as PDF | Printable, archival, suitable for framing or altar | Not specified |
| Save a chapter/book as PDF | Book-like reading experience offline | Not specified |
| Download a quote image | PNG for messaging, wallpaper, printing | ADR-015 (quote image) ✓ |
| Share to social media | User shares link, platform renders OG card | ADR-015 + ADR-019 ✓ |

The portal domain is aspirationally `teachings.yogananda.org`. All URL references in this ADR use that domain as the canonical base.

### Decision

Extend ADR-015 with **email sharing** and **PDF generation** at three content scopes: passage, chapter, and book.

#### Email Sharing

**Passage email (Phase 2):**

The share menu includes "Email this passage." This opens the seeker's email client via a `mailto:` link with pre-populated fields:

| Field | Content |
|-------|---------|
| Subject | `"{First 8 words}..." — Paramahansa Yogananda` |
| Body (plain text) | Full passage text, followed by blank line, citation (book, chapter, page), blank line, `Read in context: https://teachings.yogananda.org/passage/{chunk-id}` |

No server-side email infrastructure needed. The seeker's own email client handles sending. This works on every device, every email client, every operating system.

**Chapter/book email (Phase 2):**

For longer content, email sharing sends a link rather than the full text:

| Field | Content |
|-------|---------|
| Subject | `"{Chapter Title}" from {Book Title} — Paramahansa Yogananda` |
| Body | `Read "{Chapter Title}" from {Book Title} by Paramahansa Yogananda:` followed by `https://teachings.yogananda.org/books/{slug}/{chapter}` |

The email is an invitation to read, not a delivery of the full text. This respects inbox size constraints and ensures the seeker visits the portal for the canonical reading experience.

**Design constraints:**
- No tracking parameters in any URL (no UTM codes, no referral IDs)
- The `mailto:` approach requires zero backend infrastructure, zero API keys, zero cost
- Works offline (the link is constructed client-side from known passage data)

#### PDF Generation

**Passage PDF (Phase 2):**

A single-page PDF containing:
- Passage text in Merriweather serif, 14pt
- Citation (book, chapter, page) in Open Sans, 10pt, below the passage
- Warm cream background (`#FAF8F5`)
- SRF lotus watermark: bottom-right, 8% opacity, 48px — present but never dominant
- Portal URL at bottom center in Open Sans Light, 9pt: `teachings.yogananda.org`
- Page size: A4 (international standard — not US Letter)

Suitable for printing, framing, placing on a meditation altar, or keeping as a digital artifact. The lotus watermark establishes provenance (like a publisher's colophon) without being intrusive.

**Chapter PDF (Phase 8):**

A multi-page PDF with book-like typographic treatment:
- Cover page: book title, "by Paramahansa Yogananda," chapter title, SRF lotus centered at bottom
- Chapter text in Merriweather, proper paragraph spacing, drop capitals on chapter opening (Latin scripts only)
- Running header: book title (left) and chapter title (right) in Open Sans, 8pt
- Page numbers centered at bottom
- Lotus watermark on first page only (8% opacity)
- Portal URL on final page: `teachings.yogananda.org`
- A4 page size

**Book PDF (Phase 8):**

The full book as PDF:
- Title page with book title, author, SRF lotus
- Table of contents with page numbers
- All chapters with consistent typography
- Same running headers, page numbers, and watermark treatment as chapter PDFs
- Colophon on final page: `This digital edition is provided freely by Self-Realization Fellowship. teachings.yogananda.org`

**Technical approach:**
- Server-side PDF generation via `@react-pdf/renderer` or `pdf-lib` (both run in Node.js)
- API route: `GET /api/v1/pdf/passage/{chunk-id}`, `GET /api/v1/pdf/chapter/{book-slug}/{chapter}`, `GET /api/v1/pdf/book/{book-slug}`
- Response: `Content-Type: application/pdf` with `Content-Disposition: attachment; filename="{meaningful-name}.pdf"`
- PDF filenames are human-readable: `yogananda-autobiography-ch1.pdf`, not `download.pdf`
- Chapter and book PDFs are cached (content changes rarely) — regenerated only on content update
- Passage PDFs are generated on demand (lightweight, single page)

#### SRF Lotus Branding

The lotus mark in shared content follows the same principle as a publisher's colophon or a photo watermark:

| Context | Lotus treatment |
|---------|----------------|
| Quote image (ADR-015) | Small lotus, bottom-right, 15% opacity |
| Passage PDF | Small lotus, bottom-right, 8% opacity |
| Chapter/book PDF cover | Centered lotus below title, full opacity, 64px |
| Chapter/book PDF pages | First page only, bottom-right, 8% opacity |
| Email | No lotus (plain text; HTML email lotus would be unreliable across clients) |

The lotus is never larger than the text it accompanies. It whispers provenance; it doesn't shout branding.

#### Share Menu

The share affordance on every passage expands to reveal:

```
  ┌─────────────────────────┐
  │  Copy link              │
  │  Email this passage     │
  │  Save as image          │
  │  Save as PDF            │
  └─────────────────────────┘
```

On chapter/book pages, the share menu adds:

```
  ┌─────────────────────────┐
  │  Copy link              │
  │  Email this chapter     │
  │  Download chapter PDF   │
  │  Download book PDF      │
  └─────────────────────────┘
```

The menu is a quiet dropdown — no social media logos, no platform-specific buttons. The seeker chooses the medium; the portal doesn't suggest platforms.

### Rationale

- **`mailto:` is universal.** Works on every device, every OS, every email client. No SendGrid, no SES, no API keys. The seeker's own infrastructure handles delivery.
- **PDF bridges digital and physical.** A printed passage on warm cream paper, placed beside a meditation altar, serves the DELTA Embodiment principle. A PDF of a full book serves seekers without reliable internet.
- **A4 is global.** US Letter (8.5×11") is used almost exclusively in the US and Canada. The rest of the world uses A4. For a portal serving Earth, A4 is the correct default.
- **Lotus as colophon, not brand.** The watermark says "this came from somewhere trustworthy" without saying "look at our logo." It mirrors how physical SRF books carry the lotus on the spine — present, dignified, never shouting.
- **Phase 2 / Phase 8 split.** Passage-level sharing (email + image + PDF) is simple and high-value — Phase 2. Chapter and book PDFs require proper typographic layout and caching infrastructure — Phase 8 (alongside the daily email and social assets in Phase 9).

### Consequences

- Phase 2 adds email and PDF options to the existing share menu
- Phase 8 adds chapter/book PDF generation with caching
- The `/api/v1/pdf/` routes need rate limiting (PDF generation is CPU-intensive)
- PDF font embedding requires bundling Merriweather and Open Sans font files server-side (Google Fonts license permits this)
- Non-Latin script PDFs (Phase 11) require per-locale font bundles (Noto Sans Devanagari, Noto Sans Bengali, Noto Sans CJK) — same constraint as OG images
- The warm cream background in PDFs uses CMYK values for print fidelity, not just RGB hex
- **Extends ADR-015** with email and PDF formats; **complements ADR-019** by giving seekers direct sharing tools alongside SRF's organizational assets

---

## ADR-060: Dwell Discoverability — Hover-to-Reveal Activation Button

**Status:** Accepted | **Date:** 2026-02-19

### Context

ADR-038 established the Dwell interaction: double-click (desktop) or long-press (mobile, 500ms) enters contemplation mode. The keyboard shortcut `d` (ADR-042) provides a third path for power users. The interaction is elegant, but it has a discoverability problem: **nothing on the page suggests that dwell mode exists.** A first-time reader has no affordance to discover it.

An alternative proposal — triggering dwell via 5-second mouse hover over a paragraph — was considered and rejected:

| Concern | Problem with hover trigger |
|---------|---------------------------|
| Accidental activation | Readers park their cursor while reading. 5 seconds passes quickly during contemplation. |
| No mobile equivalent | Hover doesn't exist on touch devices, requiring two completely different mental models. |
| Cursor awareness burden | The seeker must track where their cursor is, which is the opposite of the unselfconscious reading state dwell mode creates. |
| Conflicts with natural behavior | People naturally hover over text they're reading. The trigger would fire precisely when the reader is absorbed — interrupting the state it's trying to create. |

### Decision

Use **hover to reveal a dwell activation button**, not to trigger dwell directly.

**Desktop behavior:**

1. When the cursor hovers over a paragraph for **1.5 seconds**, a small dwell icon fades in (200ms) at the paragraph's inline-start margin (left margin in LTR, right in RTL)
2. The icon is a small open circle (12px, `--srf-gold` at 40% opacity) — evoking a lotus bud or meditation dot without being literal
3. Clicking the icon enters dwell mode for that paragraph (same effect as double-click per ADR-038)
4. Moving the cursor away from the paragraph fades the icon out (150ms)
5. The icon does not appear if the cursor is merely passing through (the 1.5s threshold filters transit)

**Mobile behavior (unchanged):**

Long-press (500ms) triggers dwell directly, as per ADR-038. No hover-reveal on touch devices — the long-press is the standard "do something more with this element" gesture on mobile and needs no additional affordance.

**Keyboard behavior (unchanged):**

`d` enters dwell mode on the focused paragraph, per ADR-042.

**First-visit hint (Phase 4):**

On the seeker's first visit to the book reader, a subtle one-time tooltip appears near the first paragraph: *"Hover over any passage to focus on it for contemplation."* Dismissed on any interaction. Stored in `localStorage` so it appears only once. This tooltip is the primary discoverability mechanism; the hover icon is the reinforcement for desktop users who explore with their cursor.

### Rationale

- **Hover reveals; click activates.** This preserves the intentionality of the original design (you can't accidentally enter dwell mode) while adding a visual hint that something is possible.
- **1.5 seconds filters transit.** A cursor passing over a paragraph while scrolling or moving to another element does not trigger the icon. Only a lingering cursor — suggesting the reader is engaged with that paragraph — reveals the affordance.
- **The icon is ambient, not intrusive.** At 40% opacity and 12px, it's smaller and quieter than a typical UI button. It doesn't compete with the text. It's a whisper of possibility, not a call to action.
- **CSS logical properties.** The icon appears at `margin-inline-start`, supporting both LTR and RTL layouts without conditional logic (per ADR-021).
- **No analytics.** The hover-reveal itself is not tracked. Whether the seeker notices the icon, ignores it, or uses it is private — consistent with ADR-038's principle that dwell is a contemplative moment, not a measurable engagement metric.

### Implementation

```
Paragraph hover state (CSS + JS):

  [paragraph]                    [dwell icon]
  ┌─────────────────────────┐
  │                         │
  ○ "In the beginning was   │    ← Icon appears at inline-start
  │  the Word, and the Word │      margin after 1.5s hover
  │  was with God..."       │
  │                         │
  └─────────────────────────┘

  The ○ icon:
  - 12px circle, --srf-gold at 40% opacity
  - Fades in over 200ms
  - On click → enters dwell mode (ADR-038)
  - On cursor leave → fades out over 150ms
  - prefers-reduced-motion: instant show/hide (no fade)
```

**Accessibility:**
- The dwell icon is `role="button"` with `aria-label="Focus on this passage for contemplation"`
- Screen readers can navigate to it via tab (it receives focus when visible)
- The icon is not in the tab order by default (only appears on hover) — screen reader users use the `d` keyboard shortcut instead
- `prefers-reduced-motion`: fade transitions are instant (0ms), icon still appears/disappears

### Consequences

- Each paragraph in the reader gains a hover listener with a 1.5s debounce
- A small absolutely-positioned icon element is added to each paragraph's container (hidden by default, shown on hover timeout)
- The first-visit tooltip requires a `localStorage` flag (`portal:dwell-hint-shown`)
- The hover-reveal is desktop-only — touch devices rely on long-press discoverability (which is a platform convention)
- **Amends ADR-038** by adding a discoverability layer; all other ADR-038 behavior remains unchanged

---

## ADR-061: Global Equity — Serving Earth's Underserved Seekers

**Status:** Accepted | **Date:** 2026-02-19

### Context

The portal's mission — making Yogananda's teachings "available freely throughout the world" — is not satisfied by building a fast website in English and translating it later. "The world" includes:

- A seeker in rural Bihar with a JioPhone on 2G, paying per megabyte
- An elderly devotee in São Paulo who shares a smartphone with her family
- A yoga practitioner in Lagos accessing the portal from a cybercafé
- A Bengali-speaking YSS member who has never used a website in their own language
- A visually impaired monk in Germany who navigates entirely by screen reader

ADR-017 established accessibility as a Phase 2 foundation. ADR-020 established multilingual architecture. ADR-025 established the PWA for offline reading. This ADR addresses the gaps between those decisions — the practical realities of serving seekers who are not well-served by the default assumptions of Western web development.

### Decision

Adopt the following design constraints and features as explicit commitments, not aspirational goals:

#### 1. Data Cost Awareness

In Sub-Saharan Africa, South Asia, and Southeast Asia, mobile data is not unlimited. Seekers pay per megabyte. A page that loads fast on 3G may still be too expensive if it costs 500KB per visit.

**Commitments:**
- Homepage initial payload: **< 50KB** (HTML + critical CSS + inline JS). The current 100KB JS budget (ADR-017) is an upper bound for the full app shell; the homepage must be lighter.
- **Text-only mode toggle** in the site footer and in reader settings. When enabled: no images, no decorative elements, no web fonts (system serif stack), no OG preview generation. Stored in `localStorage`. This is not a degraded experience — it is a *considered* experience for seekers who cannot afford decorative bytes.
- **Aggressive caching headers.** Book content changes rarely. Chapters served with `Cache-Control: public, max-age=31536000, immutable` (1 year) and content-hashed URLs. Repeat visits and chapter-to-chapter navigation cost zero data after first load.
- Print stylesheets load only when `@media print` matches — zero cost during normal browsing.

#### 2. Device Spectrum

Not all seekers have smartphones. KaiOS (JioPhone, Nokia feature phones) runs a basic browser with limited JavaScript support. Approximately 100M+ KaiOS devices are in active use, primarily in India — exactly the audience SRF/YSS serves.

**Commitments:**
- **Progressive enhancement is mandatory, not optional.** The reading experience (book text, chapter navigation, search form submission) must work with JavaScript disabled. Server-rendered HTML is the baseline. JavaScript enhances: "Show me another," infinite scroll, Quiet Corner timer, dwell mode.
- **Phase 3 testing adds a KaiOS emulator** to the CI matrix. Critical flows (search, read chapter, navigate) must pass.
- **Touch targets remain 44×44px minimum** (ADR-017), but form inputs and navigation links use **48px** minimum on pages likely accessed from feature phones (homepage, search results, book index).

#### 3. Shared Devices

In many families globally, one phone serves 3–5 people. The portal must not assume a device belongs to a single person.

**Commitments:**
- **No user accounts until Phase 15+** — the portal works fully without sign-in, which is already the design. This is correct for shared devices.
- **Bookmarks (ADR-041) use `localStorage`** — they disappear if the browser data is cleared. This is acceptable for Phase 4. Phase 15+ (user accounts) can optionally sync bookmarks, but the local-first design is correct for shared devices where privacy between users matters.
- **No "Welcome back" or personalization.** The portal greets every visit the same way. No reading history displayed on the homepage. No "Continue where you left off" (which would expose one family member's reading to another).

#### 4. Intermittent Connectivity as the Norm

The PWA (ADR-025) is Phase 12. For Phases 1–11, seekers with unreliable connections have no offline support. This is a long gap.

**Commitments:**
- **Phase 2: Service Worker for static assets only.** The app shell (HTML, CSS, JS, fonts) is cached by a minimal Service Worker. Book content is not cached offline until Phase 12, but the portal loads instantly on repeat visits even with no connectivity change.
- **Phase 4: Last-read chapter cached.** When a seeker reads a chapter, the chapter HTML is cached in the Service Worker. If connectivity drops, they can re-read that chapter. Not full offline support — just graceful handling of the most common offline scenario (re-reading what you just read).
- **Offline indicator.** When the Service Worker detects no connectivity, a subtle banner appears: *"You're reading offline. Search requires a connection."* Not an error state — a calm acknowledgment. Matches the portal's warm cream palette, not a red warning bar.

#### 5. Community and Group Reading

In India, Latin America, and many African communities, spiritual texts are read aloud in groups — satsang, study circles, family devotions. The portal's reader is designed for individual silent reading.

**Commitments:**
- **Presentation mode (Phase 8).** A "Present" button in the reader header. When activated: text enlarges to 24px+ (readable from 2–3 meters), all chrome hides (no header, no sidebar, no share icons), chapter navigation becomes swipe/arrow-key only, warm cream background fills the viewport. The device becomes a digital lectern.
- **This is not a separate feature — it is a CSS mode.** The same reader component, the same content, the same accessibility. `data-mode="present"` on the reader container triggers the enlarged, chrome-free layout.

#### 6. Cultural Consultation for Entry Points

The "Seeking..." empathic entry points (ADR-035) and theme doors are currently written from an English-language, Western-spiritual perspective. "What happens after death?" is a natural question in one culture but may be phrased as "Where does the soul go?" or "What is the cycle of birth?" in another.

**Commitments:**
- **Phase 11 (multilingual launch) requires cultural consultation, not just translation.** For each Wave 1 language, SRF engages a native-speaking devotee (not a professional translator) to review the entry points and theme door labels for cultural resonance. The consultant answers: "Would a seeker in [country] phrase this question this way? What would feel more natural?"
- **The "Seeking..." prompts are editorial content, not UI chrome.** They live in Contentful (Phase 10+), not in `messages/{locale}.json`. Each locale has independently authored prompts, not translations of the English originals.
- **Query expansion (Claude API) handles the bridge.** Even if the entry point is culturally adapted, a seeker may still type their question in a culturally specific way. The terminology bridge (ADR-052) and Claude's query expansion handle the mapping from the seeker's phrasing to the passage corpus.

#### 7. Right-to-Left as a First-Class Layout

CSS logical properties (ADR-021) provide the technical foundation for RTL. But RTL is more than mirrored margins.

**Commitments:**
- **Phase 11 RTL languages (Arabic, Urdu — if added in Wave 3+) require a native RTL reader to review every page.** Not just CSS mirroring, but visual hierarchy, reading flow, and icon directionality (e.g., a "next chapter" arrow points left in RTL).
- **The share menu, dwell icon (ADR-060), and reader navigation all use `inline-start`/`inline-end` positioning** — already specified in their respective ADRs. This commitment makes the RTL audit a verification exercise, not a redesign.
- **Bidirectional text.** Yogananda quotes in Arabic translation may contain Sanskrit terms (samadhi, pranayama) in Latin script. The portal must handle `dir="auto"` on passage elements to allow mixed-direction text within a single paragraph.

#### 8. Font Loading Strategy for Global Scripts

Web fonts improve typography but add data cost. The current design uses Google Fonts (Merriweather, Lora, Open Sans). Non-Latin scripts require additional font files that can be large (CJK: 2–5MB per weight).

**Commitments:**
- **`font-display: swap` on all web fonts.** Text renders immediately in the system font stack; web fonts swap in when loaded. No invisible text, no layout shift, no blank screen while fonts download.
- **Unicode-range subsetting for non-Latin scripts.** Google Fonts provides automatic subsetting. Only the glyphs needed for the current page are downloaded. A Hindi page does not download Latin glyphs; a Japanese page does not download Devanagari glyphs.
- **Text-only mode (commitment 1) uses system fonts exclusively.** No web font downloads at all. This is the maximum data-saving option.
- **Critical text (passage content, citations) uses the system serif stack as fallback** — not a sans-serif default. `font-family: Merriweather, 'Noto Serif', Georgia, 'Times New Roman', serif` ensures the reading experience is typographically appropriate even before web fonts load.

### Rationale

These commitments exist because the portal's mission is theological, not commercial. "Freely throughout the world" is not a marketing tagline — it is a directive from Yogananda himself (*Autobiography of a Yogi*, Chapter 35: "Whenever anyone, anywhere, shall utter with reverence the name of Babaji, that devotee will instantly attract the Guru's spiritual blessing"). The teachings are for everyone. "Everyone" includes people the Western web industry routinely ignores.

Every commitment above costs nothing or near-nothing at implementation time if incorporated from the start. Retrofitting any of them later is expensive. This is the same argument that justified ADR-017 (accessibility) and ADR-020 (multilingual architecture) — the cheapest time to build for the world is now.

### Consequences

- Homepage payload budget tightened from 100KB to 50KB (HTML + critical CSS + inline JS)
- Text-only mode added to site footer and reader settings (Phase 2)
- Minimal Service Worker deployed in Phase 2 (static assets only), expanded in Phase 4 (last-read chapter)
- KaiOS emulator added to CI in Phase 3
- Presentation mode added to the reader in Phase 8
- Cultural consultation budget required for Phase 11 multilingual launch
- RTL design review by native reader required before any RTL language goes live
- `font-display: swap` and unicode-range subsetting are non-negotiable for all font loading
- **Extends ADR-017** (accessibility), **ADR-020** (multilingual), and **ADR-025** (PWA) with concrete global equity commitments

---

## ADR-062: Related Teachings — Reading Focus Detection and Progressive Loading

**Status:** Accepted | **Date:** 2026-02-19

### Context

ADR-034 established pre-computed chunk relations and the Related Teachings side panel. The design specified that the panel "updates when a new paragraph enters the viewport center (Intersection Observer)." This is underspecified in three ways:

1. **How does the reader determine which paragraph the seeker is reading?** Viewport center is a naive proxy. Short paragraphs pass through the center in a fraction of a scroll. Fast scrolling generates rapid focus changes. The side panel would thrash.

2. **Can the seeker manually control the side panel focus?** The automatic model handles most cases, but sometimes a seeker wants to see what's related to a *specific* paragraph without guessing whether the algorithm has selected it.

3. **How does the feature degrade for seekers on small screens or metered connections?** The side panel generates network requests as the reader scrolls. For a seeker paying per megabyte, speculative loading of content they might never read is a real cost.

### Decision

#### Part 1: The Settled Paragraph Model

The side panel does not chase the scroll. It waits for the reader to settle, then identifies the most prominent paragraph.

**Detection algorithm:**

1. **Intersection Observer** watches all paragraph elements with multiple thresholds (`[0, 0.25, 0.5, 0.75, 1.0]`) and a biased root margin that defines a "focus zone" in the upper-middle of the viewport:

```
Viewport:
┌──────────────────────────┐
│ 20% dead zone (top)      │  ← Text entering viewport.
│                          │    Reader hasn't focused here yet.
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                          │
│ 45% FOCUS ZONE           │  ← Where the reader's eyes are.
│                          │    Intersection Observer active here.
│                          │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│ 35% dead zone (bottom)   │  ← Text the reader has already read
│                          │    or hasn't scrolled to yet.
└──────────────────────────┘

rootMargin: "-20% 0px -35% 0px"
```

The bottom dead zone is larger than the top because readers' eyes rest in the upper portion of the content area — you read downward. Text below the focus zone is upcoming; text above is already read.

2. **Prominence scoring.** On each intersection change, compute a prominence score for each visible paragraph:

```
prominence = intersectionRatio × elementHeight
```

A paragraph that is 80% visible and 200px tall scores higher than one 100% visible but only 30px tall. This naturally favors the paragraph the reader is immersed in, not a one-liner passing through.

3. **1.2-second debounce.** The side panel does not update immediately. A timer starts when the prominence leader changes. If the reader scrolls again before 1.2 seconds, the timer resets. Only when 1.2 seconds pass with no scroll does the highest-prominence paragraph become the "settled paragraph."

4. **Update on change only.** If the settled paragraph is the same as the current side panel source, nothing happens. If it's different, the side panel content crossfades (300ms) to the new paragraph's relations.

**Why this works:**

| Scenario | Behavior |
|----------|----------|
| Fast scrolling (scanning) | Side panel stays on whatever it was showing. Zero flicker, zero wasted API calls. |
| Slow reading | After 1.2s of stillness, side panel quietly updates to match the dominant paragraph. Reader never notices the transition. |
| Short paragraph (aphorism) | If centered with generous whitespace, `intersectionRatio` is 1.0 — it wins prominence despite small height. If between two large paragraphs, the larger one wins — correct, since the reader is more likely engaged with the substantial text. |
| Long paragraph (narrative) | Occupies the focus zone for a long time. Side panel locks and doesn't change until reader scrolls past. |

#### Part 2: Source Indication

The side panel header shows the first few words of the settled paragraph that is driving the current relations:

```
┌──────────────────────┐
│  Related Teachings    │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│  "My body became     │  ← Source indication (muted, small)
│   immovably..."      │
│                      │
│  ┌────────────────┐  │
│  │ "The secret    │  │  ← Related passage 1
│  │  within the    │  │
```

This closes the feedback loop. The reader can see *which* paragraph is driving the relations without any visual noise added to the main text column. The reading column remains inviolate — no highlight, no border, no injected chrome alongside Yogananda's words.

#### Part 3: Dwell Mode as Manual Override

When dwell mode activates (via hover-revealed icon, long-press, or `d` key — per ADR-038 and ADR-060), the settled paragraph algorithm is bypassed. The dwelled paragraph becomes the explicit focus:

- Side panel updates **immediately** (no 1.2s debounce) to show the dwelled paragraph's relations
- The source indication updates to show the dwelled passage
- This is the manual control — when the seeker says "this paragraph," the side panel listens

When dwell exits, the settled paragraph algorithm resumes from the current viewport state.

Dwell mode thus serves a dual purpose: contemplative focus (dimmed surrounding text) **and** explicit Related Teachings selection. These are the same impulse — *"this passage matters, what else is like it?"* — expressed through two UI surfaces.

#### Part 4: Two-Axis Progressive Enhancement

Screen width and data budget are independent axes. A phone in California has a small screen but unlimited data. A desktop in Kolkata may have a large screen but metered data.

**Axis 1 — Screen width determines presentation:**

| Width | UI surface |
|-------|-----------|
| ≥ 1024px | Side panel visible beside reading column |
| < 1024px | No side panel — no room. Floating pill + bottom sheet on demand. |

The reading column's `max-width: 38rem` (~608px) is inviolate. On screens < 1024px, there is no room for both the reading column and a side panel without crushing the text below optimal reading width. The pill is the correct UI for narrow screens regardless of connection quality.

**Axis 2 — Data budget determines loading strategy:**

| Signal | Strategy |
|--------|----------|
| `Save-Data` header active, text-only mode (ADR-061), or `effectiveType` is `2g`/`slow-2g` | **No loading.** No side panel, no pill. "Continue the Thread" at chapter end is the sole cross-book connection (part of the page render, zero extra cost). |
| `effectiveType` is `3g` or detection unavailable on mobile | **On-demand.** Pill visible but empty. Tap triggers a single API call for the current settled paragraph's relations. Seeker pays only for what they explicitly request. |
| All other connections (including unlimited mobile plans) | **Batch prefetch.** One API call on chapter load fetches relations for every paragraph in the chapter. All subsequent side panel updates are local cache lookups — zero network during reading. |

**Crossing the axes:**

| | Wide screen (≥ 1024px) | Narrow screen (< 1024px) |
|---|---|---|
| **Batch prefetch** | Side panel visible, auto-updates from local cache as reader scrolls | Pill visible, tap shows pre-loaded results instantly (already in memory) |
| **On-demand** | Side panel visible, loads on settled paragraph change only (not prefetched) | Pill visible, tap triggers single API call |
| **No loading** | No panel. "Continue the Thread" at chapter end only. | No pill. "Continue the Thread" at chapter end only. |

**Detection logic:**

```javascript
function getLoadingStrategy(): 'batch' | 'demand' | 'none' {
  if (textOnlyMode || navigator.connection?.saveData) return 'none';
  const ect = navigator.connection?.effectiveType;
  if (ect === '2g' || ect === 'slow-2g') return 'none';
  if (isMobileViewport && ect === '3g') return 'demand';
  return 'batch';
}
```

`navigator.connection` (Network Information API) is available in Chrome and Android browsers — the platforms where metered connections are most common. Unsupported browsers default to `batch` on wide screens, `demand` on narrow screens.

#### Part 5: Batch Prefetch API

A new endpoint fetches all relations for a chapter in one request:

```
GET /api/v1/chapters/[slug]/[number]/relations

Response:
{
  "chapter": "An Experience in Cosmic Consciousness",
  "relations": {
    "chunk-id-1": [
      { "chunk_id": "...", "content": "...", "book_title": "...",
        "similarity": 0.89, "reader_url": "/books/..." },
      ...
    ],
    "chunk-id-2": [ ... ],
    ...
  },
  "chunk_count": 28,
  "total_relations": 84
}
```

For a 30-paragraph chapter with 3 relations each: ~30–50KB. Loaded after the chapter text renders (non-blocking `requestIdleCallback` or `setTimeout`). Cached by the Service Worker — repeat visits to the same chapter cost zero.

**Client-side cache:** Relations are stored in a session-level `Map<string, RelatedPassage[]>`. When the settled paragraph changes, the side panel reads from this map (instant) rather than making an API call. A reader who scrolls down and back up never re-fetches.

### Alternatives Considered

| Approach | Why rejected |
|----------|-------------|
| **Viewport center (original design)** | Underspecified. Short paragraphs pass through too fast. No debounce means side panel thrashes during scrolling. |
| **Mouse position tracking** | Surveillance-adjacent. Fails for keyboard and touch users. Conflicts with calm technology principles. |
| **Paragraph click to select focus** | Requires conscious action for every paragraph. The beauty of the side panel is that it works without the reader doing anything — dwell mode provides the explicit selection path. |
| **Per-paragraph API calls** | 15–20 HTTP requests per chapter. More connection overhead, latency variance, and data cost than a single batch prefetch. |
| **Single tier model (same behavior for all)** | Ignores the reality that a JioPhone on 2G in rural Bihar and an iPad on Wi-Fi in Berlin have fundamentally different constraints. Progressive enhancement respects both seekers. |

### Rationale

- **The settled paragraph model mirrors natural reading.** You read, you pause, the world around the text quietly responds. The 1.2s debounce ensures the side panel only moves when the reader has genuinely settled — never during active scrolling.
- **Source indication closes the feedback loop.** Without it, the side panel updates feel mysterious — "why did it change?" The source snippet makes the connection visible without adding chrome to the main text.
- **Dwell is the manual override.** No need for a separate "select paragraph" gesture. Dwell already means "this paragraph matters" — updating the side panel is a natural consequence, not a separate feature.
- **Two-axis progressive enhancement respects reality.** Screen size and data budget are independent constraints. A seeker in California with unlimited mobile data gets instant tap results from prefetched data (small screen, large budget). A seeker in Kolkata on a desktop with metered data gets a side panel that loads on demand (large screen, small budget). Each seeker gets the best experience their constraints allow.
- **Batch prefetch is better for everyone who can afford it.** Fewer HTTP requests, instant side panel updates, works partially offline, cacheable by Service Worker. The 30–50KB cost is paid once per chapter and amortized across all paragraphs.

### Consequences

- The per-chunk `/api/v1/chunks/[id]/related` endpoint remains (used by on-demand tier and filters). The new `/api/v1/chapters/[slug]/[number]/relations` endpoint is added for batch prefetch.
- A new service function `chapterRelations.ts` aggregates per-chunk relations into a chapter-level response
- The reader component adds: Intersection Observer with focus zone root margin, prominence scoring, 1.2s debounce timer, session-level relation cache (`Map`)
- The side panel header gains a source indication snippet (first ~40 characters of the settled paragraph, truncated with ellipsis)
- Dwell mode bypasses the settled paragraph algorithm and updates the side panel immediately
- The reader component detects loading strategy via `navigator.connection` and viewport width, selects presentation (panel vs. pill) and loading (batch vs. demand vs. none) independently
- **Amends ADR-034** with reading focus detection, progressive loading strategy, and batch prefetch API
- **Connects to ADR-038** (dwell as manual override), **ADR-061** (global equity tiers), and **ADR-063** (reading session proactive caching)

---

## ADR-063: Reading Session — Proactive Chapter Caching and Prefetch

**Status:** Accepted | **Date:** 2026-02-19

### Context

The portal's offline story has three phases:
- Phase 2: Service Worker caches static assets (app shell, fonts, CSS)
- Phase 4: Last-read chapter cached (ADR-061)
- Phase 12: Full PWA with explicit download and offline reading

Between Phase 4 and Phase 12, there is a gap. A seeker reading chapter 14 of the Autobiography on a bus in São Paulo loses connectivity mid-chapter. The current chapter is cached (Phase 4), but chapter 15 isn't. The reading session ends — not because the seeker chose to stop, but because the infrastructure failed them.

This ADR closes that gap with **proactive caching** — the Service Worker observes sequential reading and fetches ahead, so that connectivity loss during a reading session doesn't interrupt the experience.

Separately, ADR-062 established that batch prefetch of chapter relations is the optimal loading strategy for good connections. This ADR integrates that prefetch into the reading session, so the Related Teachings side panel also works across cached chapters without network.

### Decision

Implement a **reading session** concept: a purely client-side, untracked observation by the Service Worker that the seeker is reading sequentially, triggering proactive caching of upcoming chapters.

#### Detection

The Service Worker observes `fetch` events for chapter page URLs. It maintains a small in-memory structure (not persisted to storage — lost on SW restart, which is fine):

```
readingState = {
  bookSlug: 'autobiography',
  lastChapter: 14,
  chaptersFetched: [12, 13, 14],  // sequential pattern
  sessionActive: true
}
```

**Session activation:** After two sequential chapter fetches from the same book (e.g., chapter 13 then chapter 14), the Service Worker considers a reading session active.

**Session deactivation:** If the seeker navigates to a non-reader page (search, homepage, different book) or no chapter fetch occurs for 30 minutes, the session is considered over. The cached chapters remain (useful if the seeker returns) but no further proactive fetching occurs.

#### Proactive caching

When a reading session is active and a new chapter is fetched:

1. **Cache the current chapter** (already happening via Phase 4 last-read caching)
2. **Proactively fetch the next 2 chapters** via `requestIdleCallback` or `setTimeout(0)` — non-blocking, after the current page has rendered
3. **Proactively fetch the relations data** for the next 2 chapters (`/api/v1/chapters/[slug]/[number]/relations`) — only if the seeker is on the batch prefetch tier (ADR-062)

```
Reader fetches Chapter 14
  └── SW caches Chapter 14 HTML + relations
  └── SW proactively fetches:
      ├── Chapter 15 HTML
      ├── Chapter 15 relations (batch prefetch tier only)
      ├── Chapter 16 HTML
      └── Chapter 16 relations (batch prefetch tier only)

Reader later navigates to Chapter 15
  └── Served from cache (instant)
  └── Side panel relations served from cache (instant)
  └── SW proactively fetches Chapter 17 + relations
```

The reader experiences instant chapter transitions. If connectivity drops between chapter 14 and 15, both 15 and 16 are already cached — the seeker can keep reading.

#### Cache budget

| Item | Size per chapter | Chapters cached | Total |
|------|-----------------|----------------|-------|
| Chapter HTML | ~20–50KB | Current + 2 ahead + 2 behind = 5 | ~100–250KB |
| Chapter relations | ~30–50KB | Same 5 chapters | ~150–250KB |
| **Total** | | | **~250–500KB** |

Well within Service Worker cache limits (typically 50MB+). Negligible compared to a single high-resolution image.

**Eviction strategy:** Keep the current chapter, 2 ahead, and 2 behind (for back-navigation). When a new chapter is fetched, evict the oldest chapter outside this window. When a new book session starts, evict the previous book's chapters.

#### What is NOT stored

- No reading history. The SW cache is functionally identical to browser cache — it does not constitute a record of what the seeker read.
- No timestamps of when chapters were accessed.
- No chapter-completion signals.
- No `localStorage` or `IndexedDB` entries about reading patterns.
- The in-memory `readingState` object exists only in the Service Worker's runtime — it is not persisted and is lost when the SW restarts.

A family member using the same device would see no evidence of what was previously read (consistent with ADR-061's shared device principle). The cached chapters are indistinguishable from normal browser cache.

#### Connectivity loss behavior

When the Service Worker intercepts a chapter fetch and the network is unavailable:

- **Chapter is cached:** Serve from cache. The offline banner (ADR-061) appears: *"You're reading offline. Search requires a connection."* Reading continues normally.
- **Chapter is NOT cached:** Show a gentle message in the reader: *"This chapter isn't available offline. You can continue reading from [last cached chapter]."* with a link to the nearest cached chapter. Not an error page — a calm redirect.
- **Relations are cached:** Side panel works from cache. No indication that it's offline — the experience is identical.
- **Relations are NOT cached:** Side panel shows "Continue the Thread" from the chapter-level aggregation (part of the page HTML) but no per-paragraph relations. On narrow screens, the pill doesn't appear.

#### Integration with batch prefetch (ADR-062)

The reading session and batch prefetch are complementary:

- **Batch prefetch** (ADR-062) loads relations for the *current* chapter on chapter load — one API call, all paragraphs covered.
- **Reading session** (this ADR) proactively caches relations for the *next 2* chapters — so when the reader arrives, the batch data is already local.

Together, the reader on a good connection never waits for relations data. The side panel updates from local cache for the current chapter and for the next two chapters. The only moment relations aren't pre-loaded is when the reader first opens a book — from chapter 2 onward, everything is cached ahead.

For the on-demand tier (slow connections): the reading session still caches chapter HTML ahead (this is just page content, not relations data). The pill loads relations on-tap when the seeker gets there. For the no-loading tier: only chapter HTML is cached ahead. No relations data.

| Tier | Chapter HTML cached ahead | Relations cached ahead |
|------|--------------------------|----------------------|
| Batch prefetch (good connection) | Yes, 2 chapters ahead | Yes, 2 chapters ahead |
| On-demand (slow connection) | Yes, 2 chapters ahead | No — on-tap when seeker arrives |
| No loading (Save-Data / 2G) | No proactive caching — only the current chapter (Phase 4 baseline) | No |

#### Phase placement

- **Phase 4:** Last-read chapter caching (ADR-061). The Service Worker infrastructure exists.
- **Phase 6:** Reading session detection + proactive chapter HTML caching. Also: batch prefetch API (`/api/v1/chapters/[slug]/[number]/relations`) built as a core Phase 6 deliverable alongside the Related Teachings system — not deferred as an optimization.
- **Phase 6+:** Proactive relations caching (depends on batch prefetch API existing).
- **Phase 12:** Full PWA — explicit "Download this book for offline reading" becomes available. The reading session remains as the *implicit* complement to the *explicit* download feature.

### Alternatives Considered

| Approach | Why rejected |
|----------|-------------|
| **Full book download on first chapter access** | Too aggressive — a seeker opening chapter 1 may not read the whole book. Caching all 48 chapters of the Autobiography (~1–2MB) on first touch is wasteful, especially on metered connections. |
| **User-initiated "Download for offline"** | Correct for Phase 12 (PWA), but requires UI, user decision, and storage consent. The reading session is invisible — it just works. Both features coexist: implicit proactive caching (this ADR) and explicit download (Phase 12). |
| **No proactive caching** | Acceptable but suboptimal. Connectivity drops during reading sessions are common on buses, trains, and in areas with spotty coverage. Two chapters of read-ahead covers most brief connectivity gaps. |
| **Prefetch more than 2 chapters** | Diminishing returns. Two chapters ahead covers ~30–60 minutes of reading. A connectivity gap longer than that is not a brief interruption — the seeker has likely stopped reading. The cache budget stays small. |

### Rationale

- **Invisible resilience.** The seeker never knows the caching is happening. They never configure it, never approve it, never see a download progress bar. They just notice that chapter transitions are instant and that reading continues even when the train enters a tunnel. The technology fades into the background — exactly what calm technology means.
- **Privacy by architecture.** No reading history is stored. The SW's in-memory state is ephemeral. The cache is indistinguishable from normal browser caching. A shared device reveals nothing.
- **Complementary to explicit offline.** Phase 12 adds "Download this book." The reading session is the implicit counterpart — it handles the common case (brief connectivity loss during a session) without requiring user action. Both features serve different needs and coexist.
- **Batch prefetch integration.** Building the batch prefetch API as a Phase 6 deliverable (not an optimization) means the reading session can cache relations data ahead, making the Related Teachings side panel work across cached chapters. The alternative — per-paragraph API calls that can't be proactively cached — would leave the side panel broken during offline chapter transitions.

### Consequences

- The Service Worker gains reading session detection logic (~50 lines of JS)
- A chapter cache with LRU eviction is added to the SW (Cache API, ~30 lines)
- The batch prefetch API (`/api/v1/chapters/[slug]/[number]/relations`) is built in Phase 6 as a core deliverable, not deferred
- The reader component's offline behavior is specified: cached chapters serve normally, uncached chapters show a gentle redirect to the nearest cached chapter
- Phase 12's explicit download feature builds on the same caching infrastructure — the download action simply pre-fills the cache for all chapters in a book, using the same cache keys the reading session uses
- **Extends ADR-025** (PWA), **ADR-061** (global equity / Service Worker), and **ADR-062** (batch prefetch integration)

---

## ADR-064: Staff Experience Architecture — Five-Layer Editorial System

**Status:** Accepted | **Date:** 2026-02-19

### Context

The portal has extensive "human review as mandatory gate" requirements. AI proposes theme tags, tone classifications, accessibility ratings, calendar associations, external references, translation drafts, social media captions, and ingestion QA flags. All require human approval before reaching seekers.

The current design (DESIGN.md "Content Management Strategy") names two tools — Contentful for editorial content, Retool for administrative dashboards — and states: "The portal never builds custom admin UIs for either use case." This served as a reasonable starting constraint. But when we inhabit the actual staff perspectives, the two-tool model underserves the people closest to the sacred content.

**The people who will use these tools:**

| Person | Role | Typical Session | Technical Comfort |
|---|---|---|---|
| **Monastic content editor** | Review theme tags, curate daily passages, manage calendar events, create editorial threads | 2–3 hours/day between meditation and services | Variable — may range from "uses Contentful daily" to "prefers paper" |
| **Theological reviewer** | Final approval on theme associations, editorial thread accuracy, calendar appropriateness | Periodic — high-stakes, low-frequency | Low to moderate |
| **AE social media staff** | Review quote images, edit captions, download/distribute assets | Daily — 20–30 min | Moderate |
| **Translation reviewer** | Compare English source strings with AI drafts, approve/correct, flag uncertainties | Batch sessions — 40–100 strings per sprint | Moderate (but may be a volunteer, not staff) |
| **AE developer** | Pipeline monitoring, search analytics, data operations, infrastructure | As needed | High |
| **Leadership / philanthropist** | View global reach, content growth, search themes | Monthly or quarterly | Low — wants narrative, not dashboards |

The monastic content editor — the person most deeply connected to the teachings — would need to work across Retool data grids to review theme tag candidates, Contentful to create editorial threads, and potentially a separate interface for daily passage curation. Retool is an excellent data tool but is designed for developers building internal apps, not for monastics stewarding sacred text. The visual language of Retool (data grids, SQL query panels, generic form builders) is incongruent with the reverence the work demands.

The theological reviewer needs the simplest possible interface: see a passage, see its proposed association, approve or reject. Nothing else should be on screen. Retool could technically do this, but it would feel like reviewing scripture in a spreadsheet.

The translation reviewer currently has no interface at all — translations live in Git files (`messages/{locale}.json`), creating a hard developer dependency on every review cycle.

### Decision

Replace the two-layer model (Contentful + Retool) with a five-layer staff experience architecture. Each layer serves a distinct audience with appropriate tooling.

#### Layer 1: Contentful — Content Authoring

**Who:** Content editors
**What:** Creating and editing the source content that seekers read.

Contentful remains the editorial source of truth (ADR-002) for all authored content:
- Books, chapters, sections, text blocks
- Editorial thread sequencing and transition notes
- Teaching topic descriptions
- Calendar event definitions
- Sacred Places descriptions and imagery
- "Seeking..." empathic entry point text (Phase 11 — cultural adaptation per locale)
- Daily passage pool membership

Contentful's native workflow (Draft → In Review → Published), role-based permissions, audit trail, and locale management serve this authoring use case well. No change from the existing design for content authoring.

#### Layer 2: Contentful Custom Apps — Contextual Bridges

**Who:** Content editors (while working in Contentful)
**What:** Seeing review status and related data without leaving Contentful.

Contentful's App Framework allows custom React panels in the entry sidebar. These provide contextual awareness without requiring editors to switch tools:

- **TextBlock sidebar:** Shows current theme tags for this passage, accessibility rating, tone classification. Links to the review queue for this passage's pending tags.
- **Editorial thread sidebar:** Live preview of the reading flow — passage sequence with transition notes rendered as the seeker would see them.
- **Calendar event sidebar:** Associated passages listed with relevance context. Link to manage associations.
- **Teaching topic sidebar:** Passage count, review status, publication readiness indicator.

These are lightweight read/link panels, not full editing interfaces. They keep editors oriented while working in their primary tool.

#### Layer 3: Editorial Review Portal — `/admin`

**Who:** Monastic editors, theological reviewers, social media staff, translation reviewers
**What:** All review, approval, and curation workflows where AI has proposed and humans must decide.

This is the primary new element. A custom-built section of the Next.js application at `/admin`, protected by Auth0, built with the portal's own calm design system (Merriweather, warm cream, generous whitespace, SRF gold accents).

**Why build custom instead of using Retool:**
1. **Tone.** Reviewing Yogananda's sacred words in a warm, reverent environment versus a generic data grid. The staff tool should respect the material as much as the seeker-facing portal does.
2. **Simplicity.** A theological reviewer needs approve/reject/skip with full passage context. Retool requires building this from primitives (tables, buttons, forms) and the result is functional but not focused.
3. **Session continuity.** A monastic editor working in 2-hour windows needs to save progress mid-queue and resume the next day. Cursor-based pagination and last-position memory are native to a purpose-built UI.
4. **Non-technical access.** No Retool login, no unfamiliar tool. Same authentication (Auth0), same visual language as the portal itself.
5. **Notification integration.** Review queues can surface counts and priorities directly; email digests can link straight to specific review items.
6. **Permission scoping.** A German translation reviewer sees only their language's queue. A theme reviewer sees only theme tag candidates. Auth0 roles (`editor`, `reviewer`, `translator:{locale}`, `admin`) drive the experience.

**The Editorial Home screen:**

When a staff member logs in, they see a personalized summary based on their role:

```
Good morning. Here's what needs your attention:

  Theme Tags              Daily Passages         QA Flags
  23 awaiting review      Pool: 412 passages     0 pending
  ○ Peace (8 new)         Next 7 days: ✓         All clear ✓
  ○ Courage (6 new)
  ○ Healing (9 new)

  Calendar Events         Translations (de)      Social Assets
  Next: Mahasamadhi       14 strings to review   Tomorrow's image
  (March 7) — 12                                 ready for review
  passages linked
```

Only the sections relevant to the staff member's role appear. A translation reviewer for German sees only the translations panel. A theological reviewer sees only items awaiting their specific approval tier.

**Review workflows in the portal:**

| Workflow | First Needed | Description |
|---|---|---|
| **Theme tag review** | Phase 5 | Passage displayed with full citation. Theme name and description visible. Similarity score and AI confidence shown (but not as primary decision input). Approve, reject, or adjust relevance weight. Keyboard shortcuts: `a` approve, `r` reject, `→` next. |
| **Daily passage curation** | Phase 5 | 7-day lookahead calendar. Each day's passage shown with tone badge. Swap from pool. Flag inappropriate timing (e.g., a "challenging" passage on a holiday). |
| **Calendar event management** | Phase 5 | Event list with dates. For each event, associated passages shown. Add/remove associations. Preview how the homepage will look on that date. |
| **Social media asset review** | Phase 9 | Today's quote image at actual platform dimensions (1:1, 9:16, 16:9). Caption below with inline editing. Download per platform. Mark as "posted" per platform (tracking, not automation). Weekly lookahead view. |
| **Translation review** | Phase 11 | Side-by-side: English source string and AI draft. UI context note ("this appears on the search button"). Approve, edit inline, or flag `[REVIEW]`. Batch view (40–100 strings per session). Progress indicator per locale. |
| **Ingestion QA review** | Phase 5+ | Flagged passages with Claude's suggestion and confidence. Accept correction, reject (keep original), or edit manually. Grouped by flag type (OCR error, formatting, truncation). |
| **Tone/accessibility spot-check** | Phase 5 | Random sample of classified passages. "Does this feel `contemplative`? Is this `universal`-level accessibility?" Confirm or reclassify. |
| **Content preview** | Phase 5 | "Preview as seeker" — see exactly what a theme page, daily passage, or editorial thread will look like before publication. |

#### Layer 4: Retool — Technical Operations

**Who:** AE developers
**What:** Data-heavy dashboards, pipeline monitoring, bulk operations.

Retool is scoped to the technical team, not content editors:

- **Search analytics:** Anonymized query trends, top searches by period, "no results" queries, zero-result rate
- **Pipeline health:** Embedding job status, webhook sync logs, error rates
- **Content audit:** Chunk counts per book, embedding coverage, orphaned records
- **Bulk operations:** One-off data migrations, mass re-tagging, embedding model migration status
- **System metrics:** API response times, database query performance, error aggregations

This is appropriate for Retool's strengths. The AE developer is comfortable here.

#### Layer 5: Impact View — Leadership Dashboard

**Who:** SRF leadership, philanthropist's foundation, board presentations
**What:** A read-only, narrative-quality view of the portal's global reach and content growth.

A single route in the admin portal (`/admin/impact`) or a standalone page. Auth0-protected with a read-only `leadership` role. Designed for beauty and clarity, not data density:

- **Map visualization:** Countries reached (anonymized Vercel/Cloudflare geo data). Not a data grid — a warm-toned world map with gentle highlights.
- **Content growth:** Books published, passages available, languages served. Over time, a simple growth chart.
- **"What is humanity seeking?"** Top search themes (anonymized, aggregated). Not individual queries — themes. "This month, seekers worldwide most frequently sought teachings about *Peace*, *Fear*, and *Purpose*."
- **Global equity indicators:** Traffic from Global South regions, text-only mode usage, KaiOS/feature phone access rates. "The teachings reached seekers in 23 countries across Sub-Saharan Africa."
- **Content availability matrix:** Which books are available in which languages. Visual grid showing translation progress.

Refreshed nightly from Neon aggregates. No real-time data needed. Designed to answer one question: "Are we fulfilling the philanthropist's mission?"

### Notification Strategy

Staff should not need to remember to check dashboards. Work comes to them:

| Channel | Audience | Frequency | Content |
|---|---|---|---|
| **Email digest** | All editorial staff | Daily (configurable) | Summary: "12 new theme tag candidates, 3 QA flags, next week's passages ready for review." Links directly to relevant review queues. |
| **Admin portal badges** | Staff who visit the portal | On each login | Count badges on the editorial home screen. "23 awaiting review." |
| **No notification** | Leadership | Never — pull-based | They visit the impact view when they want to. No email, no alerts. |

Email digest is the primary channel. SRF monastics have structured schedules; a morning email with a clear summary ("here's what needs your attention today") respects their time and integrates into their existing routine. The email is generated by a scheduled serverless function querying review queue counts.

### Phase Placement

The editorial review portal is introduced incrementally, matching the content workflows that create demand for it:

| Phase | Staff Experience Deliverables |
|---|---|
| **Phase 5** | Minimal editorial review portal: theme tag review queue, daily passage curation, calendar event management, content preview, tone/accessibility spot-check. Email digest for review notifications. Auth0 roles: `editor`, `reviewer`. |
| **Phase 9** | Social media asset review workflow added to the admin portal. |
| **Phase 10** | Contentful integration. Contentful Custom Apps (sidebar panels). Full admin editorial workflow connecting Contentful authoring with portal review queues. |
| **Phase 11** | Translation review UI added to admin portal. Auth0 role: `translator:{locale}`. Volunteer reviewer access with minimal permissions. |
| **Phase 11+** | Impact dashboard for leadership. |

### Alternatives Considered

| Approach | Why rejected |
|---|---|
| **Contentful + Retool only (current design)** | Underserves monastic editors and theological reviewers. Retool's visual language is incongruent with sacred content work. Translation reviewers have no interface at all. |
| **Everything in Contentful** | Contentful is excellent for content authoring but not designed for AI classification review workflows (approve/reject per passage at scale), social media asset visual review, or translation side-by-side comparison. Forcing these workflows into Contentful's content model would require awkward workarounds. |
| **Everything in Retool** | Retool can technically build any admin UI, but the result is always "an admin tool." For the AE developer, this is fine. For a monastic editor reviewing whether a passage about inner peace is correctly tagged — the experience matters. Retool's generic form builders and data grids don't support the focused, reverent interaction these workflows demand. |
| **Third-party editorial workflow tool (Jira, Asana, Monday)** | Introduces a new vendor with its own UX, its own authentication, its own learning curve. Doesn't integrate with portal data (passages, themes, embeddings). Adds cost. The editorial review workflows are specific to this portal's data model — generic project management tools would require extensive customization to be useful. |
| **Build the admin portal from Phase 1** | Premature. Phase 1 has a single book with a one-time ingestion QA process. The first real demand for review workflows comes in Phase 5 (theme tagging at scale across multiple books). Building the portal earlier would be over-engineering. |

### Rationale

- **Staff should think about the teachings, not the technology.** The same principle that governs the seeker experience ("calm technology") should govern the staff experience. A monastic editor's tool should fade into the background, leaving focus on the passage and the decision.
- **Three distinct audiences need three distinct experiences.** A monastic editor, an AE developer, and a leadership stakeholder have different mental models, different technical comfort levels, and different goals. One tool cannot serve all three well.
- **Review workflows are the bottleneck.** The portal's most distinctive constraint — human review as mandatory gate — means the speed and quality of staff review directly determines how quickly new content reaches seekers. A cumbersome review process means fewer themes published, fewer passages curated, slower translation cycles. The review experience is a first-class product concern, not an afterthought.
- **The calm design system already exists.** Building the admin portal in the same Next.js application, with the same design tokens, means zero incremental design cost. The portal's warm cream, Merriweather, and gold accents serve the staff experience as naturally as the seeker experience.
- **Auth0 already exists in the SRF stack.** Role-based access for the admin portal uses SRF's established identity provider. No new authentication system.
- **Incremental delivery.** Phase 5 delivers only the review workflows needed for theme tagging (the first AI-proposal workflow at scale). Each subsequent phase adds only the workflows demanded by its content features. The admin portal grows organically, never ahead of actual need.

### Consequences

- **Revises the DESIGN.md statement** "The portal never builds custom admin UIs for either use case." The portal now builds a purpose-built editorial review UI for non-technical staff. Contentful remains the content authoring tool. Retool remains the technical operations tool. The admin portal fills the gap between them.
- Phase 5 gains a new deliverable: minimal editorial review portal
- Phase 9 gains social media asset review in the admin portal
- Phase 10 gains Contentful Custom Apps (sidebar panels)
- Phase 11 gains translation review UI and volunteer reviewer access
- Auth0 role schema: `editor`, `reviewer`, `translator:{locale}`, `admin`, `leadership`
- Email digest infrastructure: scheduled serverless function for daily review summaries
- The admin portal shares the Next.js application, design system, and database — zero new infrastructure
- **Extends ADR-002** (Contentful as editorial source of truth — now one layer of five, not the whole story), **ADR-019** (social media — review workflow now specified), **ADR-023** (translation workflow — review UI now specified), and **ADR-048** (theme tagging — review workflow now specified)

---

## ADR-065: AWS Lambda for Batch and Background Workloads

**Status:** Accepted | **Date:** 2026-02-19

### Context

The portal's current architecture routes all server-side logic through Next.js API routes on Vercel. This works well for request/response workloads (search, reader, API calls) but is unsuitable for batch operations that exceed Vercel's function timeout limits (10s hobby, 60s Pro, 300s Enterprise):

- **Embedding generation** for a full book (~500–2,000 chunks × embedding API call) can take 5–30 minutes.
- **Chunk relation computation** for a new book requires O(N_new × N_existing) vector comparisons — manageable but long-running.
- **Daily email dispatch** (Phase 9) sends the same passage to all subscribers — a fan-out operation.
- **Social media asset generation** (Phase 9) renders quote images at multiple aspect ratios.
- **Contentful webhook processing** (Phase 10) extracts text → embeds → upserts Neon → updates chunk relations.
- **YouTube transcript ingestion** (Phase 13) downloads and processes transcripts for potentially hundreds of videos.

SRF's established tech stack (SRF Tech Stack Brief) uses AWS Lambda + Serverless Framework v4 for all backend compute. The portal currently deviates from this pattern because Phases 1–4 have no batch workloads. As the portal grows, aligning batch processing with SRF's standard infrastructure pattern reduces operational divergence.

### Decision

Add AWS Lambda functions for batch and background workloads, using **Serverless Framework v4** per SRF's IDP standard. Next.js API routes continue to handle all request/response workloads. Lambda handles everything that is scheduled, event-driven, or long-running.

#### Directory structure

```
/serverless/
  serverless.yml              — Serverless Framework config
  /functions/
    /ingest/                  — Book ingestion: PDF → chunks → embeddings → Neon
    /relations/               — Chunk relation computation (incremental + full)
    /email/                   — Daily passage email dispatch (Phase 9)
    /social/                  — Quote image generation (Phase 9)
    /webhook/                 — Contentful webhook consumer (Phase 10)
    /transcript/              — YouTube transcript ingestion (Phase 13)
  /layers/
    /shared/                  — Shared dependencies (Neon client, Claude SDK, etc.)
```

#### Invocation patterns

| Workload | Trigger | Phase |
|----------|---------|-------|
| Book ingestion | Manual invocation (CLI or Retool button) | Phase 5 |
| Chunk relation computation | Triggered after ingestion completes (Step Functions or EventBridge) | Phase 6 |
| Daily email | EventBridge cron (daily at configurable time) | Phase 9 |
| Social media generation | Manual invocation (Retool or admin portal) | Phase 9 |
| Contentful webhook | EventBridge (webhook → SNS → Lambda) | Phase 10 |
| YouTube transcript | Manual invocation + EventBridge for batch scheduling | Phase 13 |

#### What stays in Next.js API routes

All request/response APIs: search, reader, related teachings, bookmarks, health check, OG image generation. These are fast (< 5s), user-facing, and benefit from Vercel's edge network.

#### What moves to Lambda

All batch, scheduled, or event-driven workloads. These are slow (seconds to minutes), staff-initiated or automated, and benefit from Lambda's 15-minute timeout and independent scaling.

### Rationale

- **Timeout alignment.** Lambda functions run up to 15 minutes. Vercel functions time out at 60–300s. Book ingestion and relation computation exceed Vercel limits.
- **SRF standard compliance.** The SRF Tech Stack Brief mandates Lambda + Serverless Framework for backend compute. Aligning batch processing with this standard reduces the gap between the portal and SRF's IDP.
- **Cost efficiency.** Lambda charges per 100ms of execution. Batch jobs that run for a few minutes per month cost pennies. No idle compute.
- **Separation of concerns.** User-facing request/response stays on Vercel (fast, edge-cached). Staff/system-facing batch processing runs on Lambda (long-running, independently scalable). Neither affects the other.
- **Phase 10 readiness.** When the portal migrates to GitLab (Phase 10), the Serverless Framework deployment integrates directly into GitLab CI/CD per SRF's established pipeline pattern.

### Consequences

- `/serverless/` directory added to repo alongside `/terraform/`
- Terraform gains a module for Lambda infrastructure (IAM roles, VPC config if needed for Neon private networking)
- CI/CD pipeline gains `serverless deploy` step for Lambda changes
- Phase 5+ batch workloads run on Lambda instead of manual scripts or timeout-constrained API routes
- Lambda functions share the same `/lib/services/` business logic as Next.js — framework-agnostic service layer pays off here
- **Extends ADR-031** (Terraform), aligns with SRF Tech Stack Brief

---

## ADR-066: Content-Addressable Passage Deep Links

**Status:** Accepted | **Date:** 2026-02-19

### Context

The current deep linking scheme uses `chapter + paragraph_index` to link to specific passages (e.g., `/books/autobiography/14#p7` for chapter 14, paragraph 7). This has a fragility problem: if a book is re-ingested with different chunking (corrected OCR, revised paragraph boundaries, different chunk sizes), the `paragraph_index` values may shift, breaking all previously shared links.

Shared passage links are permanent artifacts. A seeker shares a link to a Yogananda quote with a friend. That link appears in emails, WhatsApp messages, social media posts, browser bookmarks, and physical printouts (QR codes on passage PDFs). If a re-ingestion breaks the link, the seeker's friend arrives at the wrong passage — or worse, a 404. This violates the 10-year architecture principle (ADR-033).

### Decision

Add a **content hash** column to `book_chunks` that provides a stable, content-addressable identifier for each passage. Deep links use this hash as a fallback when `paragraph_index` no longer matches.

#### Schema addition

```sql
ALTER TABLE book_chunks ADD COLUMN content_hash TEXT GENERATED ALWAYS AS (
    encode(sha256(encode(left(content, 200), 'utf8')), 'hex')
) STORED;

CREATE INDEX idx_chunks_content_hash ON book_chunks(content_hash);
```

The hash is computed from the first 200 characters of the passage content. This is enough to uniquely identify a passage within a book (duplicate openings across chapters are astronomically rare in Yogananda's prose), while remaining stable across minor edits (trailing whitespace, typographic normalization).

#### Deep link resolution

```
1. Try exact match: book_slug + chapter_number + paragraph_index
2. If paragraph content doesn't match the OG-embedded content_hash:
   a. Search same chapter for matching content_hash
   b. Search same book for matching content_hash
3. If found: redirect to correct location (301)
4. If not found: show the chapter with a gentle message:
   "This passage may have moved. Here is the chapter it was in."
```

#### Share URL format

Current: `/books/autobiography/14#p7`
Enhanced: `/books/autobiography/14#p7?h=a3f2c8` (first 6 chars of content_hash)

The `h` parameter is used only for resolution fallback when the paragraph_index doesn't match. Normal navigation ignores it.

### Rationale

- **Link permanence.** Shared links survive re-ingestion, re-chunking, and content corrections. A 10-year-old shared URL still works.
- **Graceful degradation.** If the hash can't be resolved (passage genuinely removed), the seeker sees the chapter rather than an error. Content Availability Honesty principle.
- **Zero cost in the happy path.** When paragraph_index matches (99% of cases), the hash is never consulted. The resolution chain adds latency only when content has actually changed.
- **Minimal schema impact.** One generated column, one index. No migration complexity.

### Consequences

- `content_hash` column added to `book_chunks` table in the initial migration (Phase 1)
- Share URLs include the `h` parameter (short hash suffix)
- OG meta tags embed the content_hash for later verification
- Re-ingestion scripts log when paragraph_index shifts occur, enabling link audit
- **Extends ADR-033** (10-year architecture) and **ADR-015** (passage sharing)

---

## ADR-067: Search API Rate Limiting and Abuse Prevention

**Status:** Accepted | **Date:** 2026-02-19

### Context

The search API (`/api/v1/search`) calls the Claude API for query expansion and passage ranking. Each search costs approximately $0.01–0.02 in Claude API usage. The portal has no authentication until Phase 15+. All API routes are public.

A bot or bad actor could hammer the search endpoint and generate significant Claude API costs. At 100 requests/second, the portal would burn through $50–100/hour in Claude API charges. Even accidental abuse (a misbehaving scraper, a search indexer hitting the API) could spike costs.

The DESIGN.md security section mentions "Rate limiting on API routes" but doesn't specify the implementation.

### Decision

Implement rate limiting at two layers:

#### Layer 1: Cloudflare (edge — Phase 1)

Cloudflare's free tier includes basic rate limiting via WAF rules. Configure:

| Rule | Limit | Scope |
|------|-------|-------|
| Global API rate limit | 60 requests/minute per IP | All `/api/v1/*` routes |
| Search rate limit | 15 requests/minute per IP | `/api/v1/search` specifically |
| Burst protection | 5 requests/second per IP | All routes |

These limits are generous for human seekers (who search a few times per session) but block automated abuse.

#### Layer 2: Application (API route — Phase 1)

A lightweight in-memory rate limiter (e.g., `rate-limiter-flexible` with Vercel's edge runtime, or a simple sliding window counter in a Vercel KV store) as a defense-in-depth measure:

- **Claude API calls gated**: If the IP exceeds the search rate limit, the API falls back to database-only search (vector + FTS without Claude query expansion or re-ranking). The seeker still gets results — just without the AI refinement layer. This is graceful degradation, not a hard block.
- **Hard block threshold**: If an IP exceeds 200 requests/hour to any API endpoint, return `429 Too Many Requests` with a `Retry-After` header and a calm message: "Please wait a moment before searching again."

#### Claude API budget cap

Set a monthly spending cap via the Anthropic API dashboard. If the cap is reached, the search API silently falls back to database-only search for all users. The portal degrades gracefully — search still works, just without query expansion. This is the last line of defense against cost runaway.

### Rationale

- **Cost protection is a Phase 1 requirement**, not an afterthought. The Claude API is the only variable-cost component in the early phases. Unbounded cost exposure on a public, unauthenticated API is an unacceptable risk.
- **Graceful degradation over hard blocks.** A seeker who happens to search frequently (exploring themes, trying different queries) should never see an error page. They see slightly less refined results. The portal remains welcoming.
- **Two-layer defense.** Cloudflare catches the obvious abuse (bots, scrapers). The application layer catches the edge cases (distributed abuse, legitimate but excessive use).

### Consequences

- Cloudflare WAF rules configured in Phase 1 (added to Terraform Cloudflare module)
- Application-level rate limiter in the search API route
- Claude API monthly budget cap set via Anthropic dashboard
- Search gracefully degrades to database-only when rate-limited or budget-exceeded
- Monitoring: Sentry alert on rate limit triggers; New Relic dashboard for Claude API usage (Phase 7)
- **Extends** the security section of DESIGN.md with concrete implementation

---

## ADR-068: "What Is Humanity Seeking?" — Anonymized Search Intelligence

**Status:** Accepted | **Date:** 2026-02-19

### Context

The portal's `search_queries` table logs every search query without any user identification (ADR-029, DELTA compliance). Over time, this data represents something unprecedented: a real-time, global window into what humanity is seeking spiritual guidance about.

- "Fear" spikes during crises. "Death" rises after public tragedies. "Love" peaks seasonally. "Purpose" trends among younger seekers.
- These patterns are aggregated and anonymous — no individual is identified, no session is tracked.
- The philanthropist's foundation funded this project to expand the global availability of Yogananda's teachings. Demonstrating *what the world is seeking* is a profound way to show impact.

### Decision

Produce a yearly **"What Is Humanity Seeking?"** report from aggregated, anonymized search query data. This is a research and mission contribution, not a product feature.

#### Data pipeline

1. **Aggregation (automated, nightly):** Group search queries by theme (using the existing theme taxonomy from ADR-048), by geography (country-level from Cloudflare analytics — no finer granularity), and by time period (weekly, monthly, yearly). Store aggregates in a `search_theme_aggregates` table.
2. **Trend detection (automated):** Identify rising/falling themes, seasonal patterns, and correlations with world events. Claude can assist with narrative-quality trend descriptions — but all descriptions are reviewed by a human before publication.
3. **Report generation (annual, human-curated):** SRF staff or the philanthropist's foundation curates the data into a narrative report. The portal provides the raw aggregates and trend data; the human provides the interpretation.

#### Schema addition

```sql
CREATE TABLE search_theme_aggregates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_start    DATE NOT NULL,
    period_end      DATE NOT NULL,
    period_type     TEXT NOT NULL CHECK (period_type IN ('week', 'month', 'quarter', 'year')),
    theme_slug      TEXT,                          -- NULL for unclassified queries
    country_code    TEXT,                          -- ISO 3166-1 alpha-2, NULL for global
    query_count     INTEGER NOT NULL DEFAULT 0,
    unique_terms    INTEGER NOT NULL DEFAULT 0,     -- distinct query strings
    sample_queries  TEXT[],                         -- 5–10 representative (anonymized) queries for context
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_search_aggregates_period ON search_theme_aggregates(period_type, period_start);
CREATE INDEX idx_search_aggregates_theme ON search_theme_aggregates(theme_slug, period_type);
```

#### Visibility

- **Phase 7:** Search analytics dashboard in Retool (staff-only). Raw aggregate exploration.
- **Phase 11:** Impact dashboard at `/admin/impact` (leadership-facing). Includes "What Is Humanity Seeking?" visualization: warm-toned world map, trending themes, and temporal patterns.
- **Annual report:** Published by SRF or the philanthropist's foundation. Format TBD (PDF, web page, or both). Not automatically generated — human-curated from the aggregate data.

#### DELTA compliance

- **Dignity:** No individual is identified. No query is attributable to a person. The data is always aggregated (minimum granularity: country + week).
- **Agency:** Seekers are not aware of or affected by the aggregation. Their search experience is unchanged.
- **Embodiment:** The report encourages reflection on collective human need, not individual tracking.
- Minimum aggregation threshold: theme + country combinations with fewer than 10 queries in a period are suppressed (to prevent inference about small populations).

### Rationale

- **Mission alignment.** The philanthropist asked: "What can we do to help SRF make Paramahansa Yogananda's books available freely throughout the world?" Understanding what the world is seeking is a direct answer to that question.
- **Unique contribution.** No other spiritual organization has real-time data on what humanity seeks spiritual guidance about. This data, handled with DELTA integrity, is a gift to the world — not a surveillance product.
- **Impact reporting.** The foundation that funded the portal deserves to see its impact beyond page view counts. "Fear was the most searched theme globally in 2027, and 47 countries found guidance in Yogananda's words on courage" is infinitely more meaningful than "2.3M page views."

### Consequences

- `search_theme_aggregates` table added (Phase 7, alongside search analytics dashboard)
- Nightly aggregation Lambda function (Phase 7, uses ADR-065 Lambda infrastructure)
- Theme classification of search queries integrated into the search pipeline (lightweight Claude call or keyword matching against theme taxonomy)
- Impact dashboard in Phase 11 gains "What Is Humanity Seeking?" section
- Annual report production becomes an SRF staff responsibility (the portal provides data, not the report itself)
- Minimum aggregation threshold (10 queries) prevents inference about small populations
- **Extends ADR-029** (DELTA-compliant analytics) and **ADR-048** (theme taxonomy)

---

## ADR-069: Edition-Aware Content Model

**Status:** Accepted | **Date:** 2026-02-19

### Context

Yogananda's books have been published in multiple editions over decades. Page numbers, chapter organization, and even paragraph boundaries can differ between editions. If SRF publishes a revised edition of *Where There Is Light* with corrected page numbers or reorganized content, every citation in the portal referencing the previous edition becomes inaccurate.

The current data model does not track edition. The `books` table has `publication_year` but no edition identifier. A re-ingestion of a revised edition would overwrite the previous data, potentially breaking:
- Shared passage links (if paragraph boundaries shifted — mitigated by ADR-066)
- Cached OG images with old page numbers
- External citations referencing portal page numbers
- Email archives with old citations

### Decision

Add `edition` and `edition_year` columns to the `books` table. Track which edition the portal serves.

#### Schema addition

```sql
ALTER TABLE books ADD COLUMN edition TEXT;       -- e.g., "13th Edition", "Revised 2024"
ALTER TABLE books ADD COLUMN edition_year INTEGER; -- year of this specific edition
```

#### Content policy

- The portal serves **one edition per language per book** at any time. There is no multi-edition viewer.
- When a new edition is ingested, the old edition's data is archived (not deleted) in a `book_chunks_archive` table, preserving historical citations.
- Shared links to the old edition resolve via content-hash fallback (ADR-066). If the passage exists in the new edition (even at a different location), the link still works.
- The book landing page displays the served edition: *"Autobiography of a Yogi — 13th Edition (1998)"*.

#### Transition workflow

1. Ingest new edition to a Neon branch (not production)
2. Run content-hash comparison: identify passages that moved, changed, or were added/removed
3. Human review of all changes
4. Apply to production, archiving old edition data
5. Regenerate chunk relations for affected passages
6. Log all paragraph_index shifts for link audit

### Rationale

- **Citation accuracy over time.** The 10-year architecture horizon (ADR-033) means the portal will almost certainly serve updated editions. Tracking editions now costs two columns and prevents citation confusion later.
- **Transparent sourcing.** Displaying the edition on book pages tells seekers exactly which text they're reading. This is Sacred Text Fidelity in practice.
- **Archive for auditability.** If a theological question arises about a specific passage rendering, the archive preserves what was served and when.

### Consequences

- `edition` and `edition_year` columns added to `books` table in Phase 1 migration
- `book_chunks_archive` table created (can be empty until an actual re-ingestion occurs)
- Book landing pages display edition information
- Re-ingestion workflow documented in the operational playbook
- **Extends ADR-033** (10-year architecture) and **ADR-066** (content-addressable links)

---

## ADR-070: CI-Agnostic Deployment Scripts

**Status:** Accepted | **Date:** 2026-02-19

### Context

The portal will migrate from GitHub Actions (Phases 1–9) to GitLab CI/CD (Phase 10+) per SRF IDP standards. Both CI systems call the same operations: run tests, apply Terraform, run migrations, deploy. If pipeline logic is embedded in CI-specific YAML (GitHub Actions workflow syntax vs. GitLab CI YAML syntax), the Phase 10 migration requires rewriting every pipeline step.

### Decision

Add a `scripts/` directory with CI-system-agnostic deployment scripts. Both GitHub Actions and GitLab CI call these scripts rather than embedding logic in workflow YAML.

#### Directory structure

```
/scripts/
  terraform-plan.sh          — Run terraform plan for a given environment
  terraform-apply.sh         — Run terraform apply for a given environment
  db-migrate.sh              — Run dbmate migrations against a given database URL
  smoke-test.sh              — Run smoke tests against a deployed environment
  search-quality.sh          — Run the search quality evaluation suite
```

#### CI workflow pattern

GitHub Actions (Phases 1–9):
```yaml
steps:
  - run: ./scripts/terraform-plan.sh dev
  - run: ./scripts/db-migrate.sh $DATABASE_URL
  - run: ./scripts/smoke-test.sh $DEPLOYMENT_URL
```

GitLab CI (Phase 10+):
```yaml
script:
  - ./scripts/terraform-plan.sh dev
  - ./scripts/db-migrate.sh $DATABASE_URL
  - ./scripts/smoke-test.sh $DEPLOYMENT_URL
```

The CI config becomes a thin orchestration layer. The scripts contain the actual logic.

#### Multi-environment promotion pipeline

For Phase 10+ with four environments (dev/qa/stg/prod):

```
PR → dev (auto) → qa (manual gate) → stg (manual gate) → prod (manual gate)
```

Each promotion runs:
1. `terraform-apply.sh {env}` — apply infrastructure for target environment
2. `db-migrate.sh {env}` — run migrations against target environment's database
3. Vercel deployment to target environment's project
4. `smoke-test.sh {env}` — verify the deployment

Migration sequencing: Terraform apply runs *first* (in case it creates the database), then dbmate migrations (which depend on the database existing), then Vercel deploys the new code (which depends on the new schema).

### Rationale

- **Migration cost reduction.** The Phase 10 SCM migration becomes a CI config swap (rewrite `.github/workflows/*.yml` → `.gitlab-ci.yml`), not a logic rewrite. The scripts are identical.
- **Local reproducibility.** Developers can run `./scripts/db-migrate.sh` locally. CI parity with local execution prevents "works on my machine" issues.
- **Testability.** Scripts can be tested independently of the CI system. ShellCheck lint in CI catches script errors.

### Consequences

- `/scripts/` directory added to repo in Phase 1
- GitHub Actions workflows call scripts instead of inline commands
- Phase 10 GitLab migration rewrites CI config only, not deployment logic
- All scripts accept environment name as parameter, defaulting to `dev`
- **Extends ADR-031** (Terraform) with concrete deployment orchestration

---

## ADR-071: Native Share API as Primary Mobile Sharing

**Status:** Accepted | **Date:** 2026-02-19

### Context

The passage sharing design (ADR-015) provides a share menu with four options: copy link, email passage, save as image, save as PDF. This serves desktop seekers well. But in the Global South — India, Brazil, Nigeria, Indonesia — WhatsApp is the primary sharing mechanism for spiritual content. A seeker in Mumbai who wants to share a Yogananda quote with a friend opens WhatsApp, not email.

The Web Share API (`navigator.share()`) surfaces the device's native sharing sheet, which includes WhatsApp, Telegram, Signal, SMS, and any other installed sharing apps. It is the most natural way to share on mobile, and it removes the portal's need to know which apps the seeker uses.

### Decision

Use `navigator.share()` as the **primary** share action on mobile devices that support it. The custom share menu (copy link, email, save as image, save as PDF) is the fallback for desktop and unsupported browsers.

#### Behavior

```
Mobile (navigator.share supported):
  Tap share icon → native share sheet opens immediately
  Shares: passage text (truncated) + deep link URL
  "Save as image" and "Save as PDF" remain as separate actions in a "..." overflow menu

Mobile (navigator.share NOT supported):
  Tap share icon → custom share menu (copy link, email, save as image, save as PDF)

Desktop:
  Click share icon → custom share menu (always)
```

#### Share payload

```javascript
navigator.share({
  title: 'Paramahansa Yogananda — Autobiography of a Yogi',
  text: '"The soul is ever free; it is deathless, birthless..." — Chapter 26, p. 312',
  url: 'https://teachings.yogananda.org/books/autobiography/26#p7?h=a3f2c8'
});
```

### Rationale

- **Global South alignment.** WhatsApp has 2+ billion users, concentrated in exactly the regions the portal serves. `navigator.share()` reaches WhatsApp without adding a WhatsApp-specific button or SDK.
- **Privacy by design.** No third-party sharing scripts. No social media tracking pixels. The browser handles the share natively. DELTA-compliant by architecture.
- **Reduced UI complexity.** On mobile, one tap opens the native sheet. No custom menu to build, maintain, or localize.
- **Future-proof.** New sharing apps appear; old ones fade. The native share sheet automatically reflects the user's installed apps. The portal doesn't need to keep a list of sharing targets.

### Consequences

- Share icon behavior branches on `navigator.share` support (feature detection, not device detection)
- "Save as image" and "Save as PDF" are separate from the share action (they generate files, not share intents)
- Desktop always shows the custom share menu
- Mobile shows the native sheet with an overflow menu for image/PDF generation
- **Amends ADR-015** (passage sharing) with mobile-first native sharing

---

## ADR-072: Database Backup to S3

**Status:** Accepted | **Date:** 2026-02-19

### Context

The portal's canonical content — book text, embeddings, theme tags, chunk relations, daily passages, calendar events — lives in Neon PostgreSQL. Neon provides point-in-time recovery (PITR), which protects against accidental data loss within Neon's retention window.

However, PITR doesn't protect against:
- Neon service-level incidents beyond their disaster recovery capability
- A catastrophic bad migration that corrupts data and isn't noticed within the PITR window
- The need to restore specific tables or rows without restoring the entire database
- A future vendor migration (if SRF moves away from Neon for any reason)

The 10-year architecture horizon (ADR-033) demands that the data survive any single vendor relationship. Neon may not exist in 10 years. The data must.

### Decision

Add a **nightly `pg_dump` to S3** as a Phase 3 deliverable, alongside the Terraform work.

#### Implementation

- **Lambda function** (using ADR-065 infrastructure) runs nightly via EventBridge cron
- `pg_dump --format=custom` (most flexible restore format)
- Uploaded to an encrypted S3 bucket (`aws:kms` server-side encryption)
- **Retention:** 90 days of daily backups, plus the 1st of each month retained for 1 year
- **Size estimate:** Phase 1 database (~2,000 chunks + embeddings) ≈ 50–100MB compressed. Full library (~50,000 chunks) ≈ 1–2GB compressed. S3 cost: < $1/month.

#### Terraform module

```
/terraform/modules/backup/
  main.tf         — S3 bucket, Lambda function, EventBridge rule, IAM role
  variables.tf    — Bucket name, retention policy, schedule
  outputs.tf      — Bucket ARN
```

#### Restore procedure (documented in operational playbook)

1. Download backup from S3: `aws s3 cp s3://srf-portal-backups/{date}.dump ./`
2. Create a Neon branch for restore testing
3. `pg_restore --dbname=... {date}.dump`
4. Verify content integrity
5. If verified: promote restored branch to production (or merge specific tables)

### Rationale

- **Vendor independence.** The backup exists outside Neon's infrastructure. If Neon has a catastrophic failure or if SRF migrates to another PostgreSQL provider, the data is recoverable from S3.
- **Negligible cost.** S3 Standard-IA with lifecycle rules: < $1/month for the full library backup history.
- **Operational confidence.** Having an independent backup makes risky operations (embedding model migration per ADR-032, major re-ingestion) safer. Rollback is always possible.

### Consequences

- `/terraform/modules/backup/` added in Phase 3
- Lambda function for nightly pg_dump added in Phase 3 (or Phase 5 when Lambda infrastructure from ADR-065 is first deployed)
- S3 bucket created and managed by Terraform
- Restore procedure documented in operational playbook
- Quarterly restore drill: test restore from a random backup to a Neon branch, verify content integrity
- **Extends ADR-031** (Terraform) and **ADR-033** (10-year architecture)

---

## ADR-073: Ephemeral Reading Highlights

**Status:** Accepted | **Date:** 2026-02-19

### Context

Readers naturally mark passages that strike them as they read. Physical books have underlines and dog-ears. The portal has lotus bookmarks (ADR-041) for permanent saves. But bookmarks are a commitment — adding every passage that resonates during a long chapter reading session clutters the bookmarks page and dilutes its value.

There is a middle ground: **ephemeral highlights** that persist for the reading session only, allowing seekers to mark passages that resonate, then decide at the chapter boundary which (if any) to permanently bookmark.

### Decision

Add ephemeral paragraph highlights to the reader. These are session-only visual markers — in-memory state, not persisted to `localStorage` or any storage.

#### Interaction

- **Activate:** Double-tap (mobile) or double-click (desktop) on any paragraph. A subtle gold left-border appears (2px, `--srf-gold` at 60% opacity). The paragraph is "highlighted."
- **Deactivate:** Double-tap/double-click again removes the highlight.
- **End of chapter prompt:** When the seeker navigates to the next chapter (or closes the tab), if they have any highlighted passages, a gentle bottom sheet appears:

  ```
  You paused on 3 passages in this chapter.
  Would you like to bookmark any of them?

  [Show passages]     [Continue reading]
  ```

  "Show passages" reveals the highlighted excerpts with individual lotus bookmark icons. "Continue reading" dismisses without saving. Both actions clear the highlights.

#### Technical implementation

- Highlights stored in a `Set<string>` in the reader component state (React `useState` or `useRef`). No `localStorage`, no `IndexedDB`, no server calls.
- Cleared on chapter navigation, page close, or explicit dismissal.
- No analytics. Highlighting is a private reading moment.
- `prefers-reduced-motion`: gold border appears instantly (no transition).

### Rationale

- **Respects the contemplative reading mode.** Seekers can engage with passages without the friction of deciding "Is this worth bookmarking?" in the moment. The decision is deferred to the chapter boundary.
- **Zero privacy footprint.** Nothing is stored. A shared device reveals no trace of highlights. Consistent with ADR-061 (shared device principle).
- **Complements bookmarks, doesn't replace them.** Bookmarks are permanent and intentional. Highlights are ephemeral and spontaneous. Different gestures (single tap vs. double-tap) prevent confusion.

### Consequences

- Ephemeral highlights added to the reader in Phase 6 (alongside the Related Teachings side panel, as both enhance the reading experience)
- Double-tap/double-click gesture added to reader paragraph interaction model
- End-of-chapter highlight review prompt added to chapter transition flow
- No storage, no analytics, no server interaction
- Keyboard shortcut: `h` to highlight the currently focused paragraph (extends ADR-042)
- **Extends ADR-041** (bookmarks) and **ADR-042** (keyboard navigation)

---

## ADR-074: Side-by-Side Commentary View

**Status:** Accepted | **Date:** 2026-02-19

### Context

Two of Yogananda's major works are verse-by-verse commentaries on sacred scriptures:
- *The Second Coming of Christ* (commentary on the New Testament)
- *God Talks With Arjuna* (commentary on the Bhagavad Gita)

These books have a distinctive structure: each section presents a scripture verse, followed by Yogananda's commentary on that verse. Readers of these works naturally want to see the verse and commentary together, and often want to compare Yogananda's interpretation of adjacent verses.

Phase 7 introduces verse-aware chunking (deliverable 7.2) to handle this structure. This ADR specifies the reader UI for verse-commentary content.

### Decision

Add a **split-pane reader view** for verse-commentary books. This is a reader mode, not a separate page.

#### Layout (≥ 1024px screens)

```
┌──────────────────────────────┬──────────────────────────────┐
│  Scripture Verse               │  Yogananda's Commentary       │
│                                │                                │
│  "For the Spirit searcheth     │  "The all-knowing Spirit       │
│   all things, yea, the deep    │   reveals to the devotee       │
│   things of God."              │   who meditates deeply the     │
│                                │   truth behind all things..."  │
│   — 1 Corinthians 2:10         │                                │
│                                │   — The Second Coming of       │
│                                │     Christ, Vol. 1, p. 234     │
└──────────────────────────────┴──────────────────────────────┘
```

- Left pane: scripture verse (Lora italic, slightly muted, fixed position while scrolling through commentary)
- Right pane: Yogananda's commentary (Merriweather, standard reader typography)
- Verse navigation: up/down arrows cycle through verses; both panes update

#### Layout (< 1024px screens)

Sequential layout — verse appears as a highlighted block above the commentary, scrolling naturally:

```
┌────────────────────────────────────┐
│  ┌──────────────────────────────┐  │
│  │  "For the Spirit searcheth   │  │
│  │   all things..."             │  │
│  │   — 1 Corinthians 2:10      │  │
│  └──────────────────────────────┘  │
│                                     │
│  "The all-knowing Spirit reveals    │
│   to the devotee who meditates     │
│   deeply the truth behind all      │
│   things..."                        │
│                                     │
│  — The Second Coming of Christ,     │
│    Vol. 1, p. 234                  │
└────────────────────────────────────┘
```

#### Data model support

The verse-aware chunking (Phase 7) already produces `book_chunks` with `section_heading` (the verse reference) and `metadata` JSONB (which can carry `verse_text`, `verse_reference`, and `is_commentary: true`). No additional schema changes.

### Rationale

- **Faithful to the book's structure.** These commentaries are designed to be read verse-by-verse. A linear rendering that mixes verses and commentary into a single stream obscures the verse → commentary relationship.
- **Reader expectations.** Seekers studying *The Second Coming of Christ* typically reference specific verses. The split-pane view makes verse-hopping natural.
- **Reusable for Wine of the Mystic.** Omar Khayyam quatrains + Yogananda's mystical commentary follow the same verse → commentary structure.

### Consequences

- Split-pane reader mode activated automatically for books with `is_verse_commentary: true` metadata
- Verse-aware chunking (Phase 7) produces the necessary data structure
- Reader component gains a `VersePaneReader` variant alongside the standard `ChapterReader`
- Related Teachings side panel still works — it attaches to the commentary pane on wide screens, or appears below the commentary on narrow screens
- Keyboard navigation: `v` toggles between verse and commentary focus; `j`/`k` navigate verses (extends ADR-042)
- **Depends on** Phase 7 (verse-aware chunking). **Extends ADR-036** (reader design) and **ADR-042** (keyboard navigation)

---

## ADR-075: Study Guide View for Group Reading

**Status:** Accepted | **Date:** 2026-02-19

### Context

In India, Latin America, and many communities worldwide, Yogananda's teachings are studied in groups — satsang, study circles, family reading sessions. Phase 8 adds presentation mode (enlarged text, hidden chrome) for group reading. But group study needs more than large text — it needs discussion structure.

The portal already has the data to support study guides: theme tags, Related Teachings (cross-book connections), ephemeral highlights, and reader typography. A "Study Guide" view reorganizes this existing data into a format useful for a satsang leader preparing a group reading session.

### Decision

Add a **Study Guide view** for each chapter, accessible via a "Study Guide" button in the reader header (alongside the existing "Present" button).

#### Content (generated from existing data — no new editorial input required)

1. **Key themes in this chapter** — theme tags that appear on passages in this chapter, grouped by category (quality, situation, practice)
2. **Notable passages** — passages with the highest Related Teachings density (most cross-book connections), suggesting they are thematic anchor points
3. **Cross-book connections** — "Continue the Thread" content, presented as discussion prompts: "Yogananda explores [theme] further in [book], [chapter]. How does this compare?"
4. **Discussion questions** — Not AI-generated. Editorially curated, optional. Stored in a `chapter_study_notes` table. Empty until editors add them. The study guide works without them.

#### Schema addition

```sql
CREATE TABLE chapter_study_notes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id      UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    note_type       TEXT NOT NULL CHECK (note_type IN ('discussion_question', 'context_note', 'practice_suggestion')),
    content         TEXT NOT NULL,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    language        TEXT NOT NULL DEFAULT 'en',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### URL and interaction

- URL: `/books/[slug]/[chapter]/study` (study guide for a specific chapter)
- Print-friendly layout by default (study guides are often printed for group use)
- "Start presenting" button transitions from study guide to presentation mode at the first passage

### Rationale

- **Serves community reading.** ADR-061 recognized group reading as a Global South norm. Presentation mode addresses the *display* need; the study guide addresses the *preparation* need.
- **Zero editorial cost at launch.** The study guide is 100% generated from existing data (theme tags, relations, notable passages). Editorial discussion questions are optional enhancements added over time.
- **Leverages existing investment.** Theme tagging (Phase 5), Related Teachings (Phase 6), and presentation mode (Phase 8) are already built. The study guide is a reorganization view, not a new data system.

### Consequences

- `/books/[slug]/[chapter]/study` route added in Phase 8 (alongside presentation mode)
- `chapter_study_notes` table added (empty until editorial content is available)
- Study guide generates from existing data: theme tags, chunk relations, passage accessibility levels
- Print stylesheet for study guide pages
- **Extends ADR-061** (group reading) and **ADR-036** (reader design)

---

## ADR-076: Audio-Visual Ambiance Toggle

**Status:** Accepted | **Date:** 2026-02-19

### Context

The Quiet Corner offers a timer and chime for micro-meditation. The reader's circadian color temperature (ADR-039) subtly shifts background warmth by time of day. Both features serve the principle that the portal should feel like a contemplative space, not a commercial website.

An optional ambient audio mode — not music, but the subtle environmental sounds of a quiet temple reading room — could deepen this contemplative quality. A distant singing bowl. Gentle wind through trees. The ambiance of a sacred space.

This must be completely opt-in, off by default, and never imposed. It serves seekers who read in noisy environments and want to create a pocket of calm, or seekers who find that ambient sound helps them settle into contemplative reading.

### Decision

Add an optional ambient audio toggle to the reader settings popover and the Quiet Corner.

#### Implementation

- **Off by default.** Always. Stored in `localStorage`.
- **Three options:** Off / Temple (singing bowl + distant wind, ~60-second loop) / Nature (birdsong + gentle stream, ~90-second loop)
- **Audio files:** Two short ambient loops, hosted on S3, streamed via `<audio>` element with `loop` attribute. Total size: ~200–400KB each (AAC, low bitrate — ambiance doesn't need high fidelity).
- **Volume:** Fixed at ~15% of system volume. Not adjustable in the portal. This is background, not foreground.
- **Behavior:** Fades in over 3 seconds on activation. Fades out on page navigation. Resumes on new page load if still enabled. Pauses if browser tab loses focus.
- **Text-only mode (ADR-061):** Ambient audio is disabled in text-only mode. Data cost respect.

### Rationale

- **Aligned with calm technology.** Not Spotify. Not a meditation app. The sound of a place where people read sacred texts. The technology fades into the background.
- **Completely opt-in.** No seeker ever hears ambient audio without choosing it. No autoplay. No popups asking "Enable ambient sound?"
- **Low cost.** Two 200KB audio files on S3. Negligible bandwidth.

### Consequences

- Ambient audio toggle added to reader settings popover (Phase 12, alongside circadian reading and other reader polish)
- Ambient audio toggle added to Quiet Corner settings
- Two audio files commissioned or sourced (royalty-free ambient recordings)
- `localStorage` preference key: `portal-ambiance` (`off` | `temple` | `nature`)
- Disabled in text-only mode
- **Extends ADR-039** (circadian reading) and the calm technology principles

---

## ADR-077: Talk Preparation Workspace

**Status:** Superseded by ADR-111
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-003 (AI as librarian), ADR-035 (Doors of Entry), ADR-046 (social assets), ADR-075 (Study Guide View)

> **Note:** This ADR has been superseded by ADR-111 (Study Workspace). The core concept (passage collection, teaching arc assembly, export) is preserved, but the workspace is now public (no authentication required), uses localStorage for persistence, and serves all users — not just monastics and center leaders. See ADR-111 for the current design.

### Context

SRF monastics and meditation center leaders regularly give lectures and guided readings that draw on Yogananda's teachings. Today they prepare manually — searching books, copying passages, assembling notes. The portal already indexes every passage and clusters them by theme. A dedicated workspace can accelerate preparation without altering any published content.

### Decision

Build a Talk Preparation Workspace as a staff/auth-protected area (`/prepare`) that supports theme-driven passage discovery, passage collection, teaching arc assembly, and optional presentation mode export. The workspace is a composition tool — it does not create new content; it assembles existing indexed passages into teaching outlines.

### Workflow

1. **Theme Exploration.** The preparer enters a theme or question ("How does Yogananda describe divine love?"). The system uses the existing search API — query expansion, passage ranking — to surface relevant passages across all books.
2. **Passage Collection.** Selected passages are added to a working collection (persisted per-user via Auth0 identity). Each item retains full citation (book, chapter, page). Notes can be attached per passage.
3. **Teaching Arc Assembly.** Collected passages are arranged into a narrative sequence. The preparer drags passages into sections (e.g., "Opening," "Core Teaching," "Practice," "Closing"). Section headings and personal speaking notes are freeform text, clearly distinguished from Yogananda's words.
4. **Export.** The assembled outline exports as:
   - **Print PDF** — formatted outline with full citations, preparer's notes, and passage text.
   - **Presentation mode** — full-screen sequential display of passages (extends Phase 8's presentation mode from ADR-046).
   - **Plain text** — copy-pasteable outline for personal files.
5. **Persistence.** Saved outlines are private to the authenticated user. No sharing mechanism in initial release (sharing introduces editorial review questions that require SRF guidance).

### Data Model

```sql
CREATE TABLE talk_outlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,             -- Auth0 sub
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE talk_outline_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outline_id UUID NOT NULL REFERENCES talk_outlines(id) ON DELETE CASCADE,
    title TEXT NOT NULL,                -- e.g., "Opening", "Core Teaching"
    speaker_notes TEXT,                 -- preparer's personal notes (NOT Yogananda's words)
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE talk_outline_passages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES talk_outline_sections(id) ON DELETE CASCADE,
    chunk_id UUID NOT NULL REFERENCES book_chunks(id),
    personal_note TEXT,                 -- preparer's annotation
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_talk_outlines_user ON talk_outlines(user_id);
```

### Rationale

- **Serves an underserved persona.** The portal was conceived for individual seekers. Monastics and center leaders are a high-impact audience who prepare teachings weekly. A dedicated workspace makes the portal indispensable to SRF's teaching mission.
- **No new content created.** The workspace assembles existing indexed passages. The preparer's own speaking notes are clearly separated. This respects ADR-003 — the AI finds, the human curates.
- **Leverages existing infrastructure.** Theme exploration uses the search API. Passage collection references `book_chunks`. No new ingestion pipeline needed.
- **Auth-protected from day one.** Unlike the public portal, talk preparation requires Auth0 authentication. This is consistent with the Editorial Review Portal (ADR-064) and doesn't conflict with Phase 15's public user accounts.

### Consequences

- New protected route `/prepare` with Auth0 guard (same mechanism as `/admin`)
- Talk preparation tables added to schema (Phase 8 or Phase 10, after presentation mode exists)
- Export to PDF reuses the PDF generation from Phase 8 chapter downloads
- Presentation mode extended to accept talk outlines as input (not just single chapters)
- Future: sharing outlines between authenticated staff (requires SRF editorial guidance)
- Future: AI-suggested passage ordering ("Given these 8 passages on divine love, here's one possible teaching arc") — always as suggestion, never auto-applied

---

## ADR-078: Audio Library and Cross-Media Audio Search

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-003 (AI as librarian), ADR-020 (multilingual schema), ADR-022 (YouTube integration), ADR-043 (cross-media search), ADR-069 (edition-aware content model)

### Context

SRF possesses audio recordings of Paramahansa Yogananda's own voice — lectures, informal talks, guided meditations, chanting. These are sacred artifacts and content simultaneously. SRF also produces modern audio recordings: monastics reading from published works, guided meditations, and chanting sessions. The portal's architecture already supports cross-media search across books and YouTube. Audio is a natural third content type.

### Decision

Add audio as a first-class content type with its own data model, ingestion pipeline, browse/listen experience, and search integration. Audio recordings are hosted on S3 with CloudFront delivery. Transcriptions are generated via OpenAI Whisper, human-reviewed (ADR-023's mandatory human gate), and indexed for full-text and semantic search alongside books and video.

### Data Model

```sql
CREATE TABLE audio_recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    speaker TEXT NOT NULL,              -- "Paramahansa Yogananda", "Brother Anandamoy", etc.
    recording_type TEXT NOT NULL CHECK (recording_type IN (
        'lecture', 'reading', 'guided_meditation', 'chant', 'informal_talk', 'interview'
    )),
    recording_date DATE,                -- when originally recorded (may be approximate)
    duration_seconds INTEGER NOT NULL,
    s3_key TEXT NOT NULL,               -- S3 object key for audio file
    cloudfront_url TEXT,                -- populated on publish
    cover_image_url TEXT,               -- album art / thumbnail
    is_yogananda_voice BOOLEAN NOT NULL DEFAULT false,  -- sacred artifact flag
    source_collection TEXT,             -- e.g., "The Voice of the Master", "SRF Recordings Archive"
    language TEXT NOT NULL DEFAULT 'en',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audio_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recording_id UUID NOT NULL REFERENCES audio_recordings(id) ON DELETE CASCADE,
    segment_index INTEGER NOT NULL,
    start_time_ms INTEGER NOT NULL,     -- millisecond offset
    end_time_ms INTEGER NOT NULL,
    transcript_text TEXT NOT NULL,       -- human-reviewed transcription
    transcript_status TEXT NOT NULL DEFAULT 'machine' CHECK (transcript_status IN (
        'machine', 'review', 'approved'
    )),
    content TEXT NOT NULL,              -- cleaned text for embedding (same pattern as book_chunks.content)
    embedding vector(1536),             -- text-embedding-3-small
    language TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audio_recordings_slug ON audio_recordings(slug);
CREATE INDEX idx_audio_recordings_speaker ON audio_recordings(speaker);
CREATE INDEX idx_audio_recordings_type ON audio_recordings(recording_type);
CREATE INDEX idx_audio_recordings_language ON audio_recordings(language);
CREATE INDEX idx_audio_segments_recording ON audio_segments(recording_id);
CREATE INDEX idx_audio_segments_embedding ON audio_segments USING ivfflat (embedding vector_cosine_ops) WITH (lists = 50);
```

### Audio Ingestion Pipeline

1. **Upload.** Audio files uploaded to S3 via Contentful or admin tool. Metadata entered in CMS.
2. **Transcription.** AWS Lambda triggers Whisper transcription. Output: timestamped segments.
3. **Human Review.** Transcription enters editorial review (same portal as book chunks and video transcripts). Reviewers correct errors, especially for Yogananda's voice recordings where fidelity is paramount.
4. **Embedding.** Approved segments are embedded using text-embedding-3-small (same model as book chunks).
5. **Indexing.** Segments added to the cross-media search index. Audio results appear alongside book passages and video clips.

### Audio Player Experience

- **Synchronized transcript.** As audio plays, the transcript highlights the current segment. Seekers can read along or click any segment to jump to that point.
- **Sacred artifact treatment.** Recordings of Yogananda's own voice receive special visual treatment — a subtle indicator and contextual note about the recording's provenance. These are not "content" in the same way as a book excerpt; they are encounters with the Master's voice.
- **Browse experience.** Audio library page with filtering by speaker, recording type, date, and collection. Visual design consistent with the book library and video library.
- **Playback controls.** Standard: play/pause, seek, speed (0.75×–1.5×), volume. No social features, no comments, no likes.

### Rationale

- **Yogananda's voice is irreplaceable content.** No book passage can substitute for hearing the Master speak. The portal's mission is to make Yogananda's teachings freely accessible — his voice recordings are among the most direct expressions of those teachings.
- **Transcription enables search integration.** Without transcription, audio is a silo. With it, a seeker searching "how to meditate" finds relevant passages from books, video clips, and now audio segments — a complete cross-media experience.
- **Infrastructure already exists.** S3 + CloudFront for hosting, Lambda for batch processing, pgvector for embeddings, the editorial review portal for human approval. Audio adds a content type, not an infrastructure layer.
- **Human review is non-negotiable.** Machine transcription of Yogananda's voice — often recorded in early/mid 20th century with period audio quality — will contain errors. Every segment must be human-reviewed before publication.

### Consequences

- New audio tables added to schema (Phase 10 or Phase 11, after cross-media search foundation exists)
- Audio ingestion Lambda functions added to `/serverless/`
- CloudFront distribution configured for audio streaming (Terraform module)
- Cross-media search API updated to include audio segments in results
- Audio player component built for reader/library (synchronized transcript display)
- `is_yogananda_voice` flag enables special sacred artifact presentation
- Storage costs: audio files are larger than text but smaller than video. S3 Standard for active, S3 IA for archive.
- Future: chapter-aligned audio (e.g., audiobook chapters mapped to book chapters for side-by-side reading+listening)

---

## ADR-079: YSS Organizational Branding and Locale Strategy

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-020 (multilingual schema), ADR-021 (locale infrastructure), ADR-061 (Global South delivery)

### Context

Yogoda Satsanga Society of India (YSS) is the Indian counterpart of Self-Realization Fellowship. While the teachings are identical, the organizational branding differs: different name, different logo, different publishing imprint. Indian seekers — and seekers accessing the portal from India — may expect YSS branding. The portal must be able to present the same content under either organizational identity without duplicating the content itself.

### Decision

Implement locale-aware organizational branding as a presentation layer concern. The content remains unified in the database. The frontend selects branding assets (logo, organization name, footer text, "about" content) based on the seeker's locale or explicit preference. This is not a separate site or subdomain — it is a theming layer.

### Design

```
Organization branding configuration:
├── /messages/en-US/org.json      → { "org_name": "Self-Realization Fellowship", "org_abbr": "SRF", ... }
├── /messages/en-IN/org.json      → { "org_name": "Yogoda Satsanga Society of India", "org_abbr": "YSS", ... }
├── /messages/hi/org.json         → { "org_name": "योगदा सत्संग सोसाइटी ऑफ़ इंडिया", "org_abbr": "YSS", ... }
├── /public/brand/srf/            → SRF logo, favicon, OG images
└── /public/brand/yss/            → YSS logo, favicon, OG images
```

- **Locale detection.** `Accept-Language` header + explicit locale selector in footer. No IP-based geolocation (unreliable, privacy concern).
- **Content is never duplicated.** The same book passages, the same search index, the same audio recordings. Only organizational presentation differs.
- **Book publisher attribution.** Books published by YSS show the YSS imprint in citations when viewed in YSS-branded context. The `books` table already has a `publisher` field; the frontend formats it appropriately.
- **Explicit opt-out.** A seeker in India can switch to SRF branding; a seeker in the US can switch to YSS branding. The portal respects explicit choice over locale inference.

### Rationale

- **Organizational reality.** SRF and YSS are legally distinct organizations with distinct brands. Indian devotees identify with YSS. Presenting SRF branding exclusively to Indian users would feel foreign.
- **Content unity.** Yogananda's teachings are universal. Duplicating content for branding purposes would create maintenance burden and violate the "one source of truth" principle.
- **Low implementation cost.** This is a `next-intl` namespace plus an asset directory. No schema changes, no API changes, no content duplication.

### Consequences

- Organization-specific message namespaces added to `/messages/` locale files
- Brand asset directories (`/public/brand/srf/`, `/public/brand/yss/`) with logos and OG images
- Locale selector in footer includes organization context
- OG images and meta tags switch based on active organizational brand
- Future: YSS-specific landing page content (about page, history section) managed in Contentful
- **Does not affect:** search, reading, audio, video, API responses, or any content-layer behavior

---

## ADR-080: Multi-Tenant Infrastructure Design

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-065 (Lambda batch), ADR-070 (CI-agnostic scripts), ADR-072 (S3 backup)

### Context

The portal will operate across multiple environments (dev, staging, production) and will transition from GitHub to GitLab as SRF's Internal Developer Platform. SRF uses AWS as their cloud provider, Terraform for IaC, and has established patterns for multi-account AWS architectures. The architecture team has autonomous design authority for infrastructure decisions regarding GitLab CI/CD templates, AWS account structure, and Contentful space strategy.

### Decision

Design infrastructure for three isolated environments with promotion gates, using SRF's established tooling patterns.

### AWS Account Strategy

```
SRF AWS Organization
├── srf-teachings-dev        — Development account
│   ├── Neon dev branch (or separate project)
│   ├── S3: srf-teachings-dev-assets
│   ├── Lambda: dev deployments
│   └── CloudFront: dev distribution
├── srf-teachings-staging    — Staging / QA account
│   ├── Neon staging branch
│   ├── S3: srf-teachings-stg-assets
│   ├── Lambda: staging deployments
│   └── CloudFront: staging distribution
└── srf-teachings-prod       — Production account
    ├── Neon production (primary)
    ├── S3: srf-teachings-prod-assets
    ├── Lambda: production deployments
    └── CloudFront: production distribution (global edge)
```

- **Account isolation.** Each environment in its own AWS account. IAM boundaries prevent dev from touching prod. SRF standard pattern.
- **Terraform workspaces.** One Terraform configuration, three workspaces (`dev`, `stg`, `prod`). Environment-specific values in `terraform/environments/{env}.tfvars`.
- **Neon branching.** Dev and staging use Neon branches (instant, free). Production uses the primary Neon project. Schema migrations promoted through branches before reaching production.

### GitLab CI/CD Strategy

```yaml
# .gitlab-ci.yml (Phase 10+)
stages:
  - validate
  - test
  - build
  - deploy-dev
  - deploy-staging
  - deploy-prod

deploy-prod:
  stage: deploy-prod
  when: manual                    # manual gate for production
  environment:
    name: production
    url: https://teachings.yogananda.org
  only:
    - main
  script:
    - ./scripts/deploy.sh prod
    - ./scripts/migrate.sh prod
    - ./scripts/verify.sh prod
```

- **CI-agnostic scripts.** All deployment logic lives in `/scripts/` (ADR-070). GitLab CI/CD calls the same scripts that GitHub Actions called. Migration is a YAML change, not a logic rewrite.
- **Manual production gate.** Production deployments always require manual approval. No automatic promotion from staging to production.
- **GitLab environments.** Each environment is a GitLab environment with its own URL, enabling GitLab's built-in deployment tracking.

### Contentful Space Strategy

```
Contentful Organization
├── SRF Teachings — Development     — dev space (content modeling, testing)
├── SRF Teachings — Staging         — staging space (content preview, QA)
└── SRF Teachings — Production      — production space (published content)
```

- **Space-per-environment.** Each environment has its own Contentful space. Content is promoted via Contentful's environment aliasing or export/import.
- **Webhook isolation.** Each space's webhooks point to its corresponding environment's API. Dev webhooks trigger dev sync; prod webhooks trigger prod sync.
- **Content modeling in dev.** New content types are modeled in the dev space, tested in staging, then promoted to production. Contentful's migration CLI manages schema changes.

### Rationale

- **SRF standard patterns.** Multi-account AWS, Terraform workspaces, and GitLab CI/CD are established at SRF. This architecture doesn't invent — it applies.
- **Autonomous design authority.** The user confirmed autonomous decision-making for infrastructure. These decisions align with SRF's tech stack while optimizing for the portal's specific needs.
- **Blast radius containment.** A broken dev deployment can never affect production. Account-level isolation is the strongest boundary AWS offers.
- **Migration-ready from day one.** Because deployment scripts are CI-agnostic, the GitHub→GitLab migration at Phase 10 is a configuration change, not a re-architecture.

### Consequences

- Terraform configurations parameterized by environment from Phase 1
- AWS account creation requested through SRF's cloud team (or single-account with IAM isolation if multi-account is delayed)
- Contentful spaces created per environment (free tier supports one space; paid tier needed for multi-space)
- GitLab CI/CD templates prepared during Phase 9, activated at Phase 10
- Neon branching strategy documented in runbook
- **Fallback:** If multi-account AWS is operationally heavy for early phases, a single account with strict IAM policies and resource tagging provides 80% isolation. Migrate to multi-account when the team is ready.

---

## ADR-081: Lessons Integration Readiness

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-003 (AI as librarian), ADR-012 (content scope), ADR-024 (API-first)

### Context

SRF's Home Study Lessons are the organization's core spiritual curriculum — private, sequential instruction in meditation techniques including Kriya Yoga. The Lessons are explicitly out of scope for the public portal (ADR-012). However, SRF has indicated that Lessons might eventually be incorporated for authorized students (those who have enrolled in the Lessons) and Kriya Yoga initiates (kriyabans). This may never happen, or it may be years away. The architecture should not assume it will happen, but it should not make it structurally impossible.

### Decision

Design a content-level access control architecture that enables future gating of specific content types to authorized users, without implementing any Lessons-specific features now. The architectural affordance is: any content item can carry an `access_level` that the API layer respects.

### Design

```sql
-- Future migration (NOT included in Phase 1 schema)
-- Shown here to document the architectural pattern

ALTER TABLE book_chunks ADD COLUMN access_level TEXT NOT NULL DEFAULT 'public'
    CHECK (access_level IN ('public', 'enrolled', 'kriyaban'));

-- The same pattern would apply to any future content table
-- (lessons_chunks, practice_instructions, etc.)
```

```typescript
// Future API middleware pattern
function requireAccess(level: 'public' | 'enrolled' | 'kriyaban') {
  return (req: Request) => {
    if (level === 'public') return true;
    const user = getAuthenticatedUser(req); // Auth0
    if (!user) return false;
    return user.accessLevel >= ACCESS_LEVELS[level];
  };
}
```

### What This Means in Practice

1. **Today:** All content is `access_level = 'public'`. No auth required. No change to any current behavior.
2. **If Lessons are added:** New content types (e.g., `lessons` table) are created with `access_level = 'enrolled'` or `access_level = 'kriyaban'`. The API checks the caller's authentication and authorization before returning restricted content. Search results for restricted content show only the existence and citation — not the full text — to unauthorized users.
3. **Auth0 integration:** Auth0 already supports custom claims. SRF's enrollment system could set `access_level` claims on user tokens. The portal's API reads the claim and enforces access.
4. **The Lessons themselves are never AI-searchable in the same way as published books.** If Lessons content is added, it would likely be a separate, curated reading experience — not dumped into the general search index. The search might acknowledge "This topic is also covered in SRF Lesson 24" without revealing the Lesson's content.

### Rationale

- **Respects current scope.** Zero Lessons code ships in any phase. No tables, no migrations, no UI. This ADR is a design note, not a deliverable.
- **Prevents architectural lock-in.** If every API route assumes all content is public (no access control middleware), adding Lessons later would require retrofitting every route. By acknowledging the pattern now, the API design naturally accommodates it.
- **Auth0 is already in the stack.** The Editorial Review Portal uses Auth0. Extending it to student/kriyaban authorization is an Auth0 configuration change, not a new identity system.
- **Acknowledges organizational reality.** SRF has expressed interest. The architecture should not be surprised by the request when it arrives.

### Consequences

- No implementation work in any current phase
- API service layer designed with access control hooks (even if all content is currently public)
- Auth0 tenant configured with extensible role/claim structure
- If Lessons integration is approved: new content tables, enrollment verification flow, restricted search results UI, and a dedicated Lessons reading experience would be scoped as a new phase
- **Explicit non-goals:** The portal never teaches Kriya Yoga techniques. Even with Lessons integration, technique instructions would remain outside the portal's scope. The portal might host the written Lessons (with proper authorization), but it does not replace the Lesson-by-mail experience or the guru-disciple relationship.

---

## ADR-082: Redundancy, Failover, and Regional Distribution Strategy

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-065 (Lambda batch), ADR-072 (S3 backup), ADR-078 (audio library), ADR-080 (multi-tenant infrastructure)

### Context

The portal serves a global audience. Seekers in India, Latin America, Africa, and Southeast Asia are as important as those in North America and Europe. The architecture must balance global availability and latency against cost and operational complexity. The key question: which layers need multi-region redundancy, and which are adequately served by edge caching in front of a single-region origin?

### Decision

Adopt a **single-region origin with global edge distribution** strategy for Phases 1–9, expanding to **read replicas and cross-region asset replication** at Phase 10+ when traffic patterns justify it. No active-active multi-region. The portal is a reading and search tool, not a financial transaction system — the availability requirements are high but not extreme.

### Architecture by Layer

**Layer 1: Edge (global from day one)**

| Service | Distribution | Notes |
|---------|-------------|-------|
| Vercel Edge Network | 70+ PoPs worldwide | Static pages (ISR) cached at edge. HTML reaches seekers from the nearest PoP. |
| Cloudflare WAF | Global edge | DDoS protection and rate limiting before requests reach Vercel. |
| CloudFront | Global edge | Audio files, PDFs, and static assets cached at edge. Origin is S3 in the primary region. |

Edge caching means a seeker in Mumbai requesting a book chapter gets HTML from a Vercel PoP in Mumbai, a PDF from a CloudFront PoP in Mumbai, and only the search query itself routes to the single-region origin.

**Layer 2: Compute (single-region, Phases 1–9)**

| Service | Region | Failover |
|---------|--------|----------|
| Vercel Serverless Functions | `us-east-1` (or `ap-south-1` if Neon region is in Asia) | Vercel provides within-region redundancy. No cross-region failover. |
| AWS Lambda | Same region as Neon primary | Within-region redundancy (Lambda runs across multiple AZs automatically). |

**Layer 3: Database (single-region with HA, Phases 1–9)**

| Service | Strategy | Notes |
|---------|----------|-------|
| Neon PostgreSQL | Single-region primary with automatic AZ failover | Neon manages replication and failover within the region. If the primary compute goes down, Neon promotes a replica. |
| Neon read replicas (Phase 10+) | Add read replicas in EU and Asia-Pacific | Search queries and reader pages route to the nearest read replica. Write operations (ingestion, editorial review) route to the primary. |

**Layer 4: Storage (single-region with CDN, expanding at Phase 10+)**

| Service | Strategy | Notes |
|---------|----------|-------|
| S3 (primary) | Single-region | Audio files, PDFs, backups. CloudFront sits in front for global delivery. |
| S3 Cross-Region Replication (Phase 10+) | Replicate to a second region | Disaster recovery for assets. If primary region S3 is unavailable, CloudFront falls back to the replica bucket. |

### Failure Scenarios and Response

| Scenario | Impact | Recovery |
|----------|--------|----------|
| Vercel outage (regional) | Pages unavailable | Vercel's global load balancing routes to other regions. ISR-cached pages still served from edge. |
| Neon outage (regional) | Search and dynamic content unavailable. Static pages still served. | Neon's automatic AZ failover. If full region down: portal degrades to static content only (ISR pages, cached PDFs). |
| S3 outage (regional) | New PDF/audio requests fail. CloudFront serves cached copies. | CloudFront continues serving cached assets. At Phase 10+, cross-region replica takes over. |
| Lambda outage | Batch jobs fail (ingestion, backup, email) | Lambda retries automatically. Batch jobs are idempotent — safe to re-run. Email delayed, not lost. |
| CloudFront outage | Asset delivery degraded | Extremely rare (global service). Fallback: direct S3 URLs (slower, no edge caching). |

### Rationale

- **Cost-proportionate resilience.** Active-active multi-region would cost 3–5× more in infrastructure and add significant operational complexity. The portal's availability SLA does not justify this. "Search is down for 30 minutes while Neon fails over" is acceptable; "a seeker loses their reading progress" is not (but all reading state is client-side in `localStorage` anyway).
- **Edge caching covers the latency gap.** The majority of portal requests — page loads, PDFs, audio streams, static assets — are served from the edge. Only search queries and dynamic API calls reach the origin. For search, 200ms of additional latency to a cross-region origin is acceptable.
- **Neon read replicas are the right Phase 10+ investment.** When traffic justifies it, adding a read replica in `ap-south-1` (Mumbai) cuts search latency for the largest seeker population (India) in half. This is a Terraform change, not an architectural change.
- **Backup is separate from failover.** ADR-072 (nightly pg_dump to S3) provides data recovery. This ADR addresses service availability. They complement each other.

### Consequences

- Primary region selected based on Neon availability and SRF's AWS account structure (likely `us-east-1` or `us-west-2`)
- Vercel function region co-located with Neon primary
- Lambda functions deployed to the same region as Neon primary
- CloudFront distribution configured for all static assets from Phase 1
- Phase 10+: Terraform module for Neon read replicas, S3 CRR, and Vercel multi-region functions
- Health check endpoint (`/api/v1/health`) reports database connectivity, enabling uptime monitoring
- **Explicit non-goal:** No active-active multi-region. No global database write replication. No cross-region Lambda orchestration.

---

## ADR-083: PDF Generation Strategy — Resource-Anchored Exports

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-059 (chapter PDF downloads), ADR-061 (Global South delivery), ADR-111 (Study Workspace, formerly ADR-077), ADR-078 (audio library)

### Context

The portal generates PDFs for multiple content types: full books, individual chapters, audio transcripts, video transcripts, talk outlines, and arbitrary passage collections. A coherent PDF strategy must address three concerns: (1) where PDF routes live in the API, (2) which PDFs are pre-rendered vs. dynamic, and (3) the generation technology.

### Decision

**Principle: PDF is a format of a resource, not a separate resource type.** When a resource supports PDF export, the PDF route is a `/pdf` sub-path of that resource — not a parallel namespace. This keeps the API navigable: if you know where a resource lives, you know where its PDF lives.

### API Surface

```
# ── Pre-rendered PDFs (GET, cacheable, served from S3 via CloudFront) ──

GET /api/v1/books/{slug}/pdf                    → Full book PDF
GET /api/v1/books/{slug}/chapters/{n}/pdf       → Chapter PDF
GET /api/v1/audio/{slug}/transcript/pdf         → Audio transcript PDF
GET /api/v1/videos/{id}/transcript/pdf          → Video transcript PDF

# ── Dynamic PDFs (on-demand generation) ──

GET  /api/v1/study/outlines/{id}/pdf            → Study outline PDF
POST /api/v1/exports/pdf                        → Arbitrary content PDF
     Body: { "type": "passages", "ids": ["uuid", ...] }
     Body: { "type": "search", "query": "...", "language": "en" }
```

### Pre-rendered vs. Dynamic

| PDF Type | Strategy | Trigger | Cache |
|----------|----------|---------|-------|
| Full book | Pre-rendered, S3 + CloudFront | Generated at ingestion time. Regenerated on content update (Contentful webhook or re-ingestion). | Long-lived. CloudFront TTL: 30 days. Invalidated on content change. |
| Chapter | Pre-rendered, S3 + CloudFront | Same as book. | Same. |
| Audio transcript | Pre-rendered, S3 + CloudFront | Generated when transcript status reaches `approved`. Regenerated on transcript update. | Same. |
| Video transcript | Pre-rendered, S3 + CloudFront | Same as audio transcript. | Same. |
| Talk outline | Dynamic, Lambda | On-demand when preparer clicks "Export PDF." | Not cached (private, user-specific). |
| Passage collection | Dynamic, Lambda | On-demand when seeker clicks "Download as PDF." | Short-lived: 1 hour. Keyed by sorted passage IDs. |
| Search results | Dynamic, Lambda | On-demand. | Short-lived: 1 hour. Keyed by query + filters. |

### Transcript Sub-Resource Pattern

Audio and video transcripts are sub-resources that serve dual purpose — as JSON for the synchronized player, and as PDF for download:

```
GET /api/v1/audio/{slug}/transcript             → JSON (timestamped segments for player)
GET /api/v1/audio/{slug}/transcript/pdf         → PDF (formatted transcript for reading/printing)

GET /api/v1/videos/{id}/transcript              → JSON (timestamped chunks for player)
GET /api/v1/videos/{id}/transcript/pdf          → PDF (formatted transcript for reading/printing)
```

The `/transcript` endpoint is useful on its own — it's what the synchronized audio player and video player consume. The `/transcript/pdf` endpoint is a formatted view of the same data.

### Generation Technology

**`@react-pdf/renderer`** for all PDF generation. Rationale:

- Produces PDFs from React components — the PDF layout shares design tokens (Merriweather serif, SRF Gold accents, warm cream) with the web reader.
- Runs in Node.js (Lambda and Vercel Serverless Functions) without a headless browser.
- Lighter and faster than Puppeteer/Playwright approaches.
- The portal's PDFs are structurally simple (text + citations + headers) — no need for full browser rendering.

### PDF Design Treatment

All PDFs share a consistent visual language:

- **Cover page** (books only): Title, author, SRF/YSS logo, lotus watermark
- **Running header**: Content source (book title, recording title, "Search Results")
- **Running footer**: "From the SRF Online Teachings Portal — teachings.yogananda.org" + page number
- **Typography**: Merriweather serif for body, Open Sans for headers and metadata
- **Citations**: Every passage includes book/chapter/page or recording/timestamp
- **Page size**: A4 default (global standard). US Letter as `?pageSize=letter` query param.
- **File size display**: Download buttons show estimated file size (ADR-071 principle — honest about what the seeker is downloading, especially for Global South bandwidth constraints)
- **Accessibility**: PDF/UA tagged for screen reader compatibility. Language attribute set. Bookmarks for chapters/sections.

### Why Not `/api/v1/pdf/books/{slug}`

A separate `/pdf/` namespace creates a parallel hierarchy where every resource path is duplicated. This is harder to discover, harder to document, and means two places to maintain when routes change. By anchoring PDFs to their parent resource (`/books/{slug}/pdf`), the API remains navigable — a developer or seeker who knows the resource URL can append `/pdf` to get the downloadable version.

### The `POST /api/v1/exports/pdf` Exception

Pre-renderable PDFs are GET endpoints on their parent resources. But a seeker who selects 7 passages from a search wants a PDF of an *ad-hoc collection* that doesn't correspond to a single existing resource. `POST /api/v1/exports/pdf` handles this:

- POST because the request body can be complex (list of UUIDs, search query with filters)
- POST because it's a generation action, not retrieval of a pre-existing document
- The `type` field in the body disambiguates: `"passages"` (explicit IDs) vs. `"search"` (re-execute a query and format results)

### Rationale

- **Consistent pattern.** Every content type that supports PDF export does it the same way: `/{resource}/pdf`. No exceptions, no parallel namespaces.
- **Pre-rendering where possible.** Books and transcripts change rarely. Generating PDFs at ingestion time and serving from CloudFront means zero generation latency for the seeker and zero compute cost per download.
- **Dynamic where necessary.** Talk outlines and passage collections are unique per request. Lambda handles these on-demand with short-lived caching for popular search queries.
- **Shared design system.** `@react-pdf/renderer` with shared design tokens ensures every PDF — book, transcript, outline, passage collection — looks like it came from the same portal.

### Consequences

- Pre-rendered PDFs added to ingestion pipeline: book PDFs generated after book ingestion, transcript PDFs generated after transcript approval
- S3 bucket structure: `s3://srf-teachings-{env}-assets/pdf/books/{slug}.pdf`, `s3://srf-teachings-{env}-assets/pdf/books/{slug}/chapters/{n}.pdf`, `s3://srf-teachings-{env}-assets/pdf/audio/{slug}-transcript.pdf`, `s3://srf-teachings-{env}-assets/pdf/videos/{id}-transcript.pdf`
- Lambda function for dynamic PDF generation (`/serverless/pdf-generator/`)
- `@react-pdf/renderer` added as a dependency (or in a shared package if Lambda and Vercel both generate PDFs)
- CloudFront invalidation on content update (book re-ingestion, transcript edit)
- File size stored in metadata and displayed on download buttons
- Phase 8: Book and chapter PDFs (pre-rendered)
- Phase 8: Talk outline PDFs (dynamic)
- Phases 13–14: Audio and video transcript PDFs (pre-rendered)
- Future: Passage collection and search result PDFs (dynamic, Phase 15+ or as demand warrants)

---

## ADR-084: Machine-Readable Content and AI Citation Strategy

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-003 (AI as librarian), ADR-024 (API-first), ADR-067 (rate limiting), ADR-061 (Global South delivery)

### Context

The portal serves three classes of machine consumer: (1) traditional search engine crawlers (Google, Bing), (2) AI agents and LLM crawlers (GPTBot, PerplexityBot, Google AI), and (3) developer/integration API clients. Each has different needs, but all serve the same mission: making Yogananda's teachings discoverable and correctly attributed. When an AI system quotes Yogananda with book, chapter, and page citation — and links to the portal as the source — that is mission success. The portal should make correct citation so easy and obvious that machines have no reason to paraphrase.

### Decision

Implement a comprehensive machine-readability strategy spanning structured data, citation guidance, syndication feeds, and API documentation. Treat machines as first-class consumers of the portal's content — not as an afterthought.

### 1. Structured Data (JSON-LD)

Every page emits schema.org JSON-LD appropriate to its content type:

```html
<!-- Book reader page -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "Autobiography of a Yogi",
  "author": { "@type": "Person", "name": "Paramahansa Yogananda" },
  "publisher": { "@type": "Organization", "name": "Self-Realization Fellowship" },
  "isbn": "978-0-87612-083-5",
  "inLanguage": "en",
  "hasPart": [
    {
      "@type": "Chapter",
      "name": "An Experience in Cosmic Consciousness",
      "position": 14
    }
  ]
}
</script>

<!-- Passage share page -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Quotation",
  "text": "The verbatim passage text...",
  "spokenByCharacter": { "@type": "Person", "name": "Paramahansa Yogananda" },
  "isPartOf": {
    "@type": "Book",
    "name": "Autobiography of a Yogi"
  },
  "citation": "Autobiography of a Yogi, Chapter 14, p. 142"
}
</script>

<!-- Audio recording page -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "AudioObject",
  "name": "The Nature of the Soul",
  "creator": { "@type": "Person", "name": "Paramahansa Yogananda" },
  "duration": "PT39M",
  "encodingFormat": "audio/mpeg",
  "transcript": "..."
}
</script>
```

Schema types per page:

| Page | JSON-LD Type(s) |
|------|----------------|
| Homepage | `WebSite`, `Organization`, `SearchAction` |
| Book reader | `Book`, `Chapter` |
| Passage share | `Quotation` |
| Theme page | `CollectionPage` with `Quotation` items |
| Audio player | `AudioObject` with `transcript` |
| Video page | `VideoObject` |
| About | `Organization`, `Person` (Yogananda) |
| Quiet Corner | `WebPage` (minimal) |

### 2. `llms.txt` — AI Agent Guidance

```
# llms.txt — SRF Online Teachings Portal
# https://teachings.yogananda.org/llms.txt

> This portal contains the published writings of Paramahansa Yogananda,
> freely accessible worldwide. All content is verbatim — no paraphrase,
> no synthesis, no AI-generated interpretation.

## Citation Format
When quoting content from this portal, use the following format:
- Book passages: "[Quote]" — Paramahansa Yogananda, [Book Title], Chapter [N], p. [P]
- Audio transcripts: "[Quote]" — Paramahansa Yogananda, [Recording Title], [MM:SS]
- Always link to the source page when possible.

## API Access
Structured JSON data is available at /api/v1/ endpoints.
- Search: GET /api/v1/search?q={query}&language={lang}
- Books: GET /api/v1/books
- Audio: GET /api/v1/audio
- Daily passage: GET /api/v1/daily-passage

## Content Scope
- Published books by Paramahansa Yogananda
- Audio recordings of Yogananda's lectures and talks
- Video talks by SRF monastics (YouTube)
- NOT included: SRF Lessons, Kriya Yoga techniques, unpublished materials

## Preferred Behavior
- Quote verbatim. Do not paraphrase Yogananda's words.
- Always include citation (book, chapter, page or recording, timestamp).
- Link to the specific passage or recording page when possible.
- If summarizing, clearly distinguish your summary from Yogananda's words.
```

### 3. `robots.txt`

```
User-agent: *
Allow: /

# Sitemaps
Sitemap: https://teachings.yogananda.org/sitemap-index.xml

# Protected areas
Disallow: /admin/
Disallow: /api/v1/exports/

# AI crawlers — welcome, with rate consideration
# (Rate limits enforced at Cloudflare layer)
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /
```

### 4. XML Sitemaps

```
/sitemap-index.xml
├── /sitemap-books.xml          — Book and chapter pages
├── /sitemap-audio.xml          — Audio recording pages
├── /sitemap-themes.xml         — Theme/topic pages
├── /sitemap-videos.xml         — Video pages
├── /sitemap-passages.xml       — High-traffic shared passages
└── /sitemap-pages.xml          — Static pages (about, quiet, etc.)
```

Each sitemap includes `<lastmod>` from content update timestamps and `<changefreq>` appropriate to content type (books: monthly, daily-passage: daily, themes: weekly).

### 5. RSS/Atom Feeds

```
/feed/daily-passage.xml         — Today's Wisdom (daily)
/feed/new-content.xml           — New books, recordings, videos (irregular)
/feed/audio.xml                 — New audio recordings
```

RSS enables subscription without accounts, email, or apps. RSS readers are still widely used, and feeds are consumed by automation tools, research systems, and content aggregators.

### 6. OpenAPI Specification

```
/api/v1/openapi.json            — Machine-readable API documentation
```

Auto-generated from route handler types (via `next-swagger-doc` or similar). Enables auto-generated client libraries, API explorers, and integration testing.

### 7. Crawler-Tier Rate Limiting

Extend ADR-067's rate limiting with a separate tier for known crawler user agents:

| Tier | Rate Limit | User Agents |
|------|-----------|-------------|
| Anonymous | 30 req/min | Unknown / unidentified |
| Known crawler | 120 req/min | Googlebot, Bingbot, GPTBot, PerplexityBot, ClaudeBot |
| API consumer (future) | 300 req/min | Authenticated API keys (Phase 15+) |

Known crawlers get 4× the anonymous rate limit. They're identified by user agent string and verified by reverse DNS where possible (Googlebot verification). This is generous enough for thorough indexing while preventing abuse.

### 8. Citation Meta Tags

Every passage and content page includes machine-readable citation in `<meta>` tags:

```html
<meta name="citation_title" content="Autobiography of a Yogi" />
<meta name="citation_author" content="Paramahansa Yogananda" />
<meta name="citation_publisher" content="Self-Realization Fellowship" />
<meta name="citation_chapter" content="14" />
<meta name="citation_page" content="142" />
```

These follow the Google Scholar citation format, making the portal's content indexable by academic search engines alongside popular ones.

### Rationale

- **Mission alignment.** The portal exists to make Yogananda's teachings freely accessible. Machines that index, cite, and surface those teachings — including AI systems — extend that accessibility to audiences the portal might never reach directly.
- **The paraphrase concern is real but net positive.** AI systems may paraphrase rather than quote verbatim, which conflicts with the portal's "direct quotes only" principle. But: (a) the `llms.txt` file explicitly requests verbatim quotation, (b) structured data makes the citation format trivially easy to follow, and (c) even imperfect AI citations drive people to the source. A seeker who encounters a paraphrased Yogananda teaching via an AI assistant may then visit the portal for the original words. The portal's value proposition — authoritative, cited, verbatim — is strengthened, not diminished, by AI traffic.
- **Low implementation cost.** JSON-LD, sitemaps, robots.txt, and RSS are standard web infrastructure. `llms.txt` is a single static file. OpenAPI generation is automated. None of this requires new architecture.

### Consequences

- Phase 1: `robots.txt` (permissive), crawler-tier rate limits
- Phase 2: JSON-LD structured data on all pages, XML sitemaps, citation meta tags, `llms.txt`
- Phase 3: OpenAPI specification (alongside testing infrastructure)
- Phase 9: RSS feeds (alongside daily email)
- All structured data maintained alongside content — when a book is re-ingested, its JSON-LD is regenerated
- Google Search Console and Bing Webmaster Tools configured for monitoring indexing
- **Extends** ADR-067 (rate limiting) with crawler tiers
- **Complements** Phase 2's SEO deliverable (2.7) with deeper structured data specification

---

## ADR-085: Low-Tech and Messaging Channel Strategy

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-024 (API-first), ADR-061 (Global South delivery), ADR-065 (Lambda batch), ADR-071 (native share), ADR-078 (audio library)

### Context

The portal's primary interface is a web application. This serves smartphone and desktop users well, but excludes seekers who access the internet primarily through:

- **Feature phones** (KaiOS, basic browsers) — ~1 billion devices globally, concentrated in India, Africa, Southeast Asia
- **Basic phones** (SMS-only, no browser) — ~3 billion people worldwide
- **Metered data** where even a 100KB page load is a considered expense
- **No personal device** — shared community phones, cybercafé access

The portal's mission is to make Yogananda's teachings freely accessible *worldwide*. "Worldwide" includes the seeker in rural Bihar who has a basic Nokia phone and intermittent SMS access. The API-first architecture (ADR-024) already enables non-web access channels — every passage, every search result is available via a JSON API. The question is: which channels should we build?

### Decision

Build a multi-channel access strategy that meets seekers where they are, using the messaging platforms they already use. Prioritize by reach and cost-effectiveness.

### Channel Assessment

| Channel | Reach | Cost Model | Richness | Implementation |
|---------|-------|-----------|----------|----------------|
| **WhatsApp Business API** | 2.7B users. Dominant in India, Brazil, Nigeria, Indonesia, Mexico | Per-conversation: $0.005–0.08 depending on region and initiation | Rich: text, images, audio clips, buttons, links | Lambda + WhatsApp Cloud API |
| **SMS (inbound + outbound)** | Universal. Every phone. No internet required. | Per-message: $0.002–0.04 depending on country and provider | 160 chars (Latin) / 70 chars (non-Latin). Multi-part available. | Lambda + Twilio or Africa's Talking |
| **Telegram Bot** | 800M users. Popular in Russia, Iran, Southeast Asia, parts of Africa | Free (no per-message cost) | Rich: text, images, audio, inline keyboards, formatting | Lambda + Telegram Bot API |
| **USSD** | Universal in Africa. Works on any phone. | Per-session: $0.01–0.05 | Menu-driven, 182 chars per screen, session-based | Requires telco partnership (Africa's Talking) |
| **IVR (Voice)** | Universal. Serves non-literate seekers. | Per-minute: $0.01–0.10 | Audio only. Could play Yogananda's voice recordings. | Lambda + Twilio Voice |

### Tier 1: WhatsApp (Highest Impact)

WhatsApp is the most impactful channel for the Global South. In India alone, WhatsApp has 500M+ users. A seeker can message the portal's WhatsApp number with a spiritual question and receive passages with full citations.

```
Seeker: "What does Yogananda say about overcoming fear?"

Portal: 📖 From *Autobiography of a Yogi*, Chapter 12, p. 98:

"Fearlessness means faith in God: faith in His
protection, His justice, His wisdom, His mercy,
His love, and His omnipresence."

— Paramahansa Yogananda

📖 1 more passage found. Reply MORE to see it.
🔗 Read the full chapter: teachings.yogananda.org/books/autobiography/12

Reply with any topic to search, or DAILY for today's wisdom.
```

**WhatsApp capabilities:**
- **Search queries.** Seeker sends a question or topic. Lambda queries the search API, formats top 1-2 results for WhatsApp's message format (1024 char limit per message, Markdown-like formatting).
- **Daily Wisdom opt-in.** Seeker sends "DAILY" to subscribe. Each morning, the same daily passage from the web portal is sent via WhatsApp. Opt-out: send "STOP."
- **Audio clips.** When a search matches an audio recording, send a brief audio clip (WhatsApp supports up to 16MB audio messages). "Listen to Yogananda speak about this topic."
- **Language selection.** Seeker sends "HINDI" or "ESPAÑOL" to switch language for UI messages. Content availability depends on translated corpus.
- **Share from portal.** On the web portal, `navigator.share()` already surfaces WhatsApp as a sharing target. The shared link includes Open Graph metadata so the message renders with a passage preview.

**Implementation:**
```
Seeker (WhatsApp) → WhatsApp Cloud API webhook → API Gateway → Lambda
    │
    ├── Parse message intent (topic search, command, language switch)
    ├── Query /api/v1/search or /api/v1/daily-passage
    ├── Format response for WhatsApp (Markdown, citations, buttons)
    └── Send reply via WhatsApp Cloud API
```

### Tier 2: SMS (Widest Reach)

SMS reaches every phone on Earth. No app, no internet, no data plan. The seeker texts a topic keyword to a phone number and receives a Yogananda passage by SMS.

```
Seeker texts "FEAR" to +1-XXX-YYY-ZZZZ

Reply:
"Fearlessness means faith in God: faith in His
protection, His justice, His wisdom, His love."
— Yogananda, Autobiography of a Yogi, Ch.12, p.98
Reply FEAR2 for more. DAILY for daily wisdom.
```

**SMS constraints:**
- **160 characters** (Latin script) or **70 characters** (Unicode/non-Latin) per segment. Multi-part SMS is possible but more expensive and less reliable.
- **Short passages only.** Affirmations, aphorisms, and brief quotes from *Sayings of Paramahansa Yogananda* and *Scientific Healing Affirmations* fit well. Long narrative passages from *Autobiography* must be truncated with "..." and a citation.
- **No links** (feature phones can't open URLs). The passage must be self-contained.
- **Cost.** SMS costs vary widely: ~$0.002/message in India, ~$0.04/message in the US, ~$0.01–0.02/message in Africa. Monthly cost depends on volume. At 1,000 messages/day globally: ~$600–1,200/month.
- **Dedicated numbers.** Short codes (e.g., "text YOGANANDA to 12345") are expensive ($500–1,000/month in the US). Long codes or toll-free numbers are cheaper. Local numbers per country reduce inbound cost for seekers.

**SMS sharing from the portal:**
- `navigator.share()` already includes SMS as a sharing target on smartphones
- The shared content should be the passage text + citation (not just a URL), since the recipient may be on a feature phone that can't open links
- Passage share format for SMS: `"{quote}" — Yogananda, {Book}, Ch.{N}, p.{P}`

**SMS inbound implementation:**
```
Seeker (SMS) → Twilio / Africa's Talking webhook → API Gateway → Lambda
    │
    ├── Parse keyword (topic, command)
    ├── Query /api/v1/search (limit=1, optimized for short passages)
    ├── Format for SMS (truncate to 160 chars, include citation)
    └── Send reply via SMS gateway
```

### Tier 3: Telegram Bot (Free, Rich)

Telegram is free to operate (no per-message cost) and offers rich formatting. Worth building because the marginal cost after WhatsApp is low — same Lambda function, different message formatting.

```
/search overcoming fear     → Search and return passages
/daily                      → Subscribe to daily wisdom
/audio fear                 → Find audio recordings on this topic
/language hindi             → Switch UI language
```

### Tier 4: USSD and IVR (Exploration)

USSD and voice are the deepest-reach channels but require telco partnerships and are operationally complex. Evaluate after WhatsApp and SMS prove demand.

**USSD concept (Africa):**
```
Dial *384*YOGA#
1. Search teachings
2. Today's wisdom
3. Listen to audio
4. Change language
```

**IVR concept:**
```
Call +1-XXX-YYY-ZZZZ
"Welcome to the teachings of Paramahansa Yogananda.
Press 1 to hear today's wisdom.
Press 2 to search by topic.
Press 3 to hear a recording of Yogananda's voice."
```

IVR is uniquely powerful because it serves non-literate seekers and allows playing Yogananda's actual voice recordings — a direct connection to the Master's teachings that no text channel can provide.

### Shared Architecture

All channels share the same backend:

```
                    ┌──────────────┐
WhatsApp webhook ──→│              │
SMS webhook ───────→│   Lambda     │──→ /api/v1/search
Telegram webhook ──→│  (channel    │──→ /api/v1/daily-passage
USSD callback ────→│   router)    │──→ /api/v1/audio
IVR webhook ──────→│              │──→ /api/v1/books
                    └──────────────┘
                         │
                    Format response
                    per channel constraints
                         │
                    ┌──────────────┐
                    │  Send reply  │
                    │  via channel │
                    │  API         │
                    └──────────────┘
```

The Lambda function:
1. Receives the webhook (channel-agnostic intent parsing)
2. Queries the same `/api/v1/` endpoints that the web portal uses
3. Formats the response for the channel's constraints (160 chars for SMS, 1024 chars for WhatsApp, Markdown for Telegram)
4. Sends the reply via the channel's API

**No new content infrastructure.** Every passage served via messaging channels is the same passage served on the web — same database, same search, same citations.

### Data Model

```sql
-- Messaging channel subscriptions (daily wisdom opt-in)
CREATE TABLE messaging_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'sms', 'telegram')),
    channel_id TEXT NOT NULL,           -- phone number or Telegram user ID
    subscription_type TEXT NOT NULL DEFAULT 'daily' CHECK (subscription_type IN ('daily')),
    language TEXT NOT NULL DEFAULT 'en',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'unsubscribed')),
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    unsubscribed_at TIMESTAMPTZ,
    UNIQUE (channel, channel_id, subscription_type)
);

-- Messaging interaction log (anonymized, for cost tracking and channel health)
-- NO personal data. NO message content. Just aggregate counts.
CREATE TABLE messaging_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel TEXT NOT NULL,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('search', 'daily', 'subscribe', 'unsubscribe', 'audio')),
    country_code TEXT,                  -- from phone number prefix (not stored with identity)
    language TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messaging_subs_channel ON messaging_subscriptions(channel, status);
CREATE INDEX idx_messaging_metrics_daily ON messaging_metrics(created_at, channel);
```

**DELTA compliance:** The `messaging_metrics` table stores interaction counts, not conversations. No message content is stored. No behavioral profiling. Country code is derived from phone number prefix for aggregate reporting only (e.g., "42% of SMS queries come from India"), never stored with identity.

### Cost Projection

| Channel | Monthly Cost (est. at 1,000 daily interactions) | Notes |
|---------|------------------------------------------------|-------|
| WhatsApp | $150–300 | Per-conversation pricing. User-initiated conversations are cheapest. |
| SMS | $600–1,200 | Varies wildly by country. India is cheap; US is expensive. |
| Telegram | $0 | Free API. Only Lambda compute cost. |
| USSD | Requires telco negotiation | Typically $0.01–0.05/session in Africa. |
| IVR | $300–600 | Per-minute voice pricing. Short interactions. |

### Rationale

- **The mission demands it.** "Freely accessible worldwide" cannot mean "freely accessible to people with smartphones and data plans." 3+ billion people have basic phones. If the portal only serves web browsers, it is not fulfilling its mission.
- **API-first makes it cheap.** The `/api/v1/` endpoints already exist. Each messaging channel is a Lambda function that reformats API responses. The content infrastructure cost is zero — only the delivery channel costs money.
- **WhatsApp is the highest-leverage investment.** 2.7 billion users, dominant in exactly the regions where the teachings are most sought (India, Latin America, Africa). A WhatsApp bot costs less per month than a single Contentful developer seat.
- **SMS is the deepest-reach investment.** No smartphone needed, no internet needed, no data plan needed. A seeker in a village with a basic phone can text "PEACE" and receive Yogananda's words. This is the most mission-aligned feature the portal could build.
- **Channels compose.** Each new channel is incremental — same Lambda, same API, different formatter. Adding Telegram after WhatsApp is a weekend of work, not a quarter of work.

### Consequences

- Phase 9: WhatsApp Business API integration (alongside daily email — shared infrastructure). Daily wisdom via WhatsApp. Search via WhatsApp.
- Phase 9: RSS feeds (machine syndication, complementary channel)
- Phase 16: SMS access gateway (requires cost evaluation per region, dedicated phone numbers)
- Phase 16: Telegram bot (low cost, incremental after WhatsApp)
- Future: USSD (requires telco partnership, evaluate in Phase 16)
- Future: IVR/Voice (evaluate after audio library exists, Phase 14+)
- `messaging_subscriptions` and `messaging_metrics` tables added to schema
- Lambda function for channel routing (`/serverless/functions/messaging/`)
- WhatsApp Business account registration (requires Meta business verification)
- SMS provider evaluation: Twilio (global), Africa's Talking (Africa-optimized), Gupshup (India-optimized)
- Passage formatting service in `/lib/services/format.ts` — formats a passage for different channel constraints (160 chars, 1024 chars, Markdown, plain text)
- **Extends** ADR-071 (native share) — SMS sharing from the portal now includes passage text, not just a URL
- **Extends** Phase 16.5 (SMS access gateway) — now part of a broader multi-channel strategy, not a standalone experiment
- **Replaces** the Phase 16.5 "exploration" framing with a committed delivery plan starting at Phase 9 (WhatsApp)

---

## ADR-086: Image Content Type — Photographs as First-Class Content

### Context

SRF possesses a photographic archive spanning nearly a century — historical photographs of Paramahansa Yogananda across decades of his life, portraits of the guru lineage (Sri Yukteswar, Lahiri Mahasaya, artistic depictions of Babaji and Krishna), photographs of SRF/YSS properties and biographical sites, event documentation from convocations and commemorations, and devotional artwork. The portal currently treats images as decorative assets: book covers on `books.cover_image_url`, About page portraits, Sacred Places property photographs. But photographs of Yogananda are sacred artifacts — equivalent in spiritual significance to his voice recordings — and the broader photographic archive is a content dimension that no other medium provides.

A seeker reading Autobiography's account of Yogananda at the Ranchi school cannot see the school in a physical book's photo section (unless they own that edition). A seeker exploring Sacred Places cannot see historical photographs alongside modern Street View links. A seeker studying Sri Yukteswar's teachings cannot see the guru's portrait alongside the passages. The portal can close these gaps by treating images as searchable, browsable, relatable content.

### Decision

Images become a first-class content type with their own data model, browse/search experience, and participation in the cross-media content fabric (Related Teachings, editorial threads, theme tagging, place connections).

**Schema:**

```sql
CREATE TABLE images (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               TEXT NOT NULL,
    slug                TEXT NOT NULL UNIQUE,
    description         TEXT,
    alt_text            TEXT NOT NULL,             -- Accessibility: mandatory, Claude-drafted, human-reviewed
    caption             TEXT,                      -- Short display caption
    photographer        TEXT,
    date_taken          DATE,
    date_approximate    TEXT,                      -- "circa 1935" when exact date unknown
    era                 TEXT,                      -- 'india_early', 'america_early', 'encinitas', 'modern'
    location            TEXT,
    subject_type        TEXT NOT NULL CHECK (subject_type IN (
        'portrait', 'group', 'place', 'event', 'artifact',
        'illustration', 'book_cover', 'devotional'
    )),
    subjects            TEXT[],                    -- ['yogananda', 'sri_yukteswar'] — who/what appears
    is_yogananda_subject BOOLEAN NOT NULL DEFAULT false,
    source_collection   TEXT,                      -- '1920s_india', 'encinitas_hermitage', 'convocation'
    s3_key              TEXT NOT NULL,
    cloudfront_url      TEXT,
    width               INTEGER NOT NULL,
    height              INTEGER NOT NULL,
    format              TEXT NOT NULL DEFAULT 'jpg',
    language            TEXT NOT NULL DEFAULT 'en',
    status              TEXT NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft', 'review', 'published', 'archived')),
    published_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Image descriptions embedded for semantic search
-- Images don't have body text to chunk; the description is the searchable proxy
CREATE TABLE image_descriptions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_id            UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
    description_text    TEXT NOT NULL,              -- Rich contextual description for embedding
    embedding           vector(1536),
    language            TEXT NOT NULL DEFAULT 'en',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Image ↔ Place spatial connections
CREATE TABLE image_places (
    image_id            UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
    place_id            UUID NOT NULL REFERENCES sacred_places(id) ON DELETE CASCADE,
    relationship        TEXT NOT NULL DEFAULT 'depicts'
                        CHECK (relationship IN ('depicts', 'taken_at', 'related_to')),
    PRIMARY KEY (image_id, place_id)
);
```

**Frontend:**

- `/images` — gallery browse with filters (subject type, era, collection, place)
- `/images/[slug]` — image detail page: full-resolution view, metadata, related passages, related places, related images from same era/collection

**API:**

- `GET /api/v1/images` — browse and filter (cursor-based pagination)
- `GET /api/v1/images/{slug}` — image detail with full metadata
- `GET /api/v1/images/{slug}/related` — cross-media related content (passages, other images, places, media)

**Key principles:**

- `is_yogananda_subject` triggers sacred artifact treatment — a visual provenance indicator, same pattern as `is_yogananda_voice` in ADR-078
- Alt text is mandatory on every image. Claude drafts descriptive, reverential alt text at ingestion time; human review is mandatory before publishing (ADR-049 E7 pattern)
- Image descriptions are the searchable proxy — the description text is embedded for vector search, since the image file itself is not textually searchable. One image, one embedding — no chunking needed.
- Content authority: images are supplementary to Yogananda's verbatim words. In search results and Related Teachings, a photograph never displaces a passage in ranking.
- Images cannot be machine-generated, AI-enhanced, or colorized. Photographic authenticity is paramount. The portal presents images as they are.
- Responsive image serving: five named tiers (thumb 300px, small 640px, medium 1200px, large 2400px, original) generated at upload time in WebP + JPEG dual format. User-facing download options on image detail pages. See ADR-107 for full size tier specification.

### Consequences

- `images` and `image_descriptions` tables added to Phase 1 schema (empty until content ingestion)
- Image ingestion pipeline, gallery, and player added when the image content type goes live
- S3 storage for images uses the same bucket and CloudFront distribution as audio files (ADR-078)
- Image search integration via unified content hub (ADR-087) when cross-media features arrive
- Claude drafts alt text and rich descriptions at ingestion time; human review mandatory before publishing
- Image descriptions are localized alongside other content in Phase 11 (Multi-Language) via `image_descriptions.language`
- Sacred Places pages (ADR-026) gain a photographs section — images connected via `image_places`
- **Extends** ADR-049 E7 (Claude-generated alt text) — from About page photos to the entire image archive
- **Extends** ADR-078 (audio sacred artifacts) — same `is_yogananda_subject` pattern for visual sacred artifacts

---

## ADR-087: Unified Content Hub — Cross-Media Relations, Search, and Theming

### Context

The portal has four content types that participate in search, Related Teachings, theme tagging, and editorial threads: book chunks, video chunks (ADR-057), audio segments (ADR-078), and images (ADR-086). Each content type has its own specialized table with domain-specific columns (book chunks have page numbers; video chunks have timestamps; audio segments have transcript status; images have dimensions and alt text).

The challenge is cross-media operations. Maintaining separate relation tables per content-type pair creates combinatorial explosion: 4 types produce 6 unique pairs (book↔video, book↔audio, book↔image, video↔audio, video↔image, audio↔image), each requiring its own relation table, plus 4 self-relation tables — 10 tables total. Adding a fifth content type (e.g., published letters) would require 15 tables. Each pair also needs its own theme-tagging junction table and its own place-connection junction table. This is unmaintainable over a 10-year horizon.

### Decision

Introduce a `content_items` hub table as a thin polymorphic registry for cross-media operations. Each content type retains its specialized table with all domain-specific columns. The hub provides four unified capabilities:

1. **Unified embedding** for cross-media vector search
2. **Single relation table** for any-to-any content relations
3. **Unified theme tagging** across all content types
4. **Unified place connections** across all content types

**Schema:**

```sql
-- Unified content registry for cross-media operations
CREATE TABLE content_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type        TEXT NOT NULL CHECK (content_type IN (
        'book_chunk', 'video_chunk', 'audio_segment', 'image'
    )),
    book_chunk_id       UUID REFERENCES book_chunks(id) ON DELETE CASCADE,
    video_chunk_id      UUID REFERENCES video_chunks(id) ON DELETE CASCADE,
    audio_segment_id    UUID REFERENCES audio_segments(id) ON DELETE CASCADE,
    image_id            UUID REFERENCES images(id) ON DELETE CASCADE,
    embedding           vector(1536),
    language            TEXT NOT NULL DEFAULT 'en',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT exactly_one_ref CHECK (
        (book_chunk_id IS NOT NULL)::int +
        (video_chunk_id IS NOT NULL)::int +
        (audio_segment_id IS NOT NULL)::int +
        (image_id IS NOT NULL)::int = 1
    )
);

-- One relation table for ALL cross-media relations
CREATE TABLE content_relations (
    source_id           UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    target_id           UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    similarity          FLOAT NOT NULL,
    relation_type       TEXT,           -- same_topic, develops_further, depicts, illustrates,
                                        -- personal_story, practical, supplements
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (source_id, target_id)
);

-- Unified theme tagging for all content types
CREATE TABLE content_topics (
    content_item_id     UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    topic_id            UUID NOT NULL REFERENCES teaching_topics(id) ON DELETE CASCADE,
    tagged_by           TEXT NOT NULL DEFAULT 'auto'
                        CHECK (tagged_by IN ('manual', 'auto', 'reviewed')),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (content_item_id, topic_id)
);

-- Unified place connections for all content types
CREATE TABLE content_places (
    content_item_id     UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    place_id            UUID NOT NULL REFERENCES sacred_places(id) ON DELETE CASCADE,
    relationship        TEXT NOT NULL CHECK (relationship IN (
        'depicts', 'taken_at', 'recorded_at', 'describes', 'set_in'
    )),
    PRIMARY KEY (content_item_id, place_id)
);
```

**Timing — no premature abstraction:**

| Phase | Content Model | Relation Model |
|-------|--------------|----------------|
| Phases 1–7 | `book_chunks` only | `chunk_relations`, `chunk_topics` referencing `book_chunks` directly. Simple, fast. |
| Phase 16 (Video) | Book + video chunks | **Introduce `content_items` hub.** Migrate existing book chunks. Add video chunks. `content_relations` replaces `chunk_relations`. |
| Phase 14 (Audio + Images) | All four types | Add audio segments and images to the hub. Full cross-media fabric complete. |

**Phase 16 migration (the critical moment):**

1. Create `content_items`, `content_relations`, `content_topics`, `content_places` tables
2. Populate `content_items` from existing `book_chunks` (one hub entry per chunk)
3. Migrate `chunk_relations` data into `content_relations`
4. Migrate `chunk_topics` data into `content_topics`
5. Migrate `chunk_places` data into `content_places`
6. Add video chunks to the hub
7. Drop or retain legacy tables as backward-compatible views

**Cross-media search via the hub:**

```sql
SELECT ci.id, ci.content_type, ci.embedding <=> $query_embedding AS distance
FROM content_items ci
WHERE ci.language = $language
ORDER BY distance
LIMIT 20;
```

Each result's `content_type` determines presentation: book passages show verbatim text with citations, video clips show thumbnails with timestamps, audio segments show player links, images show thumbnails with captions.

### Consequences

- `content_items` table created in the Phase 16 migration — not before
- Unified pgvector index on `content_items.embedding` replaces per-table indexes for cross-media queries
- Per-table indexes retained for single-type queries (book-only search remains fast — no performance regression)
- Content authority hierarchy is enforced in the presentation layer, not the data layer. All types have equal standing in the hub; the UI ranks Yogananda's words above supplementary media.
- Adding a fifth content type requires: one new specialized table, one new `CHECK` constraint value, and `content_items` population. No new relation tables, no new topic tables, no new place tables.
- The hub adds one level of indirection for cross-media queries. Single-type queries (e.g., book-only search) bypass the hub and query the specialized table directly.
- `chunk_relations` and `chunk_topics` (Phases 1–7) are not wasted work — their data migrates into the hub at Phase 16
- **Extends** ADR-034 (chunk relations) — from book-only to cross-media
- **Extends** ADR-048 (teaching topics) — from book chunks to all content types
- **Extends** ADR-057 (video transcription) — video chunks join the unified search index

---

## ADR-088: Platform-Agnostic Video Model and Documentary Integration

### Context

The current video architecture assumes YouTube as the sole video platform, with `youtube_video_id` fields baked into the data model. In practice, SRF's video content spans multiple platforms and content types:

| Content | Platform | Duration | Rights |
|---------|----------|----------|--------|
| Monastic How-to-Live talks | YouTube | 20–60 min | SRF-owned |
| Guided meditations | YouTube / Vimeo | 10–45 min | SRF-owned |
| Convocation sessions | Vimeo (likely) | 1–3 hrs | SRF-owned |
| "Awake: The Life of Yogananda" | Vimeo / streaming | 87 min | Third-party (Counterpoint Films) |
| Other documentaries about Yogananda | Various | Varies | Third-party |
| Historical/archival footage | Self-hosted or Vimeo | Varies | SRF-owned |
| Interview excerpts | YouTube / Vimeo | 5–30 min | Varies |

SRF already uses Vimeo in their established tech stack (SRF AE Tech Stack Brief). The Phase 2 YouTube-only integration covers only the first row. A platform-locked video model cannot serve the full content landscape.

### Decision

Abstract the video model from YouTube-specific to platform-agnostic. Introduce a `videos` catalog table that supports YouTube, Vimeo, and self-hosted sources. An `integration_level` field distinguishes fully-integrated content (embedded player, transcribed, indexed in search) from linked-only content (cataloged with metadata and timestamps, but linking out for viewing). A content authority hierarchy ensures documentary and third-party content is clearly distinguished from Yogananda's own teachings.

**Schema:**

```sql
CREATE TABLE videos (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               TEXT NOT NULL,
    slug                TEXT NOT NULL UNIQUE,
    description         TEXT,
    video_type          TEXT NOT NULL CHECK (video_type IN (
        'talk', 'documentary', 'interview', 'meditation',
        'ceremony', 'clip', 'lecture', 'archival'
    )),
    -- Platform-agnostic source
    platform            TEXT NOT NULL CHECK (platform IN (
        'youtube', 'vimeo', 'self_hosted'
    )),
    platform_id         TEXT,                      -- YouTube video ID or Vimeo video ID
    platform_url        TEXT,                      -- Canonical URL on the platform
    self_hosted_s3_key  TEXT,                      -- S3 key if self-hosted
    self_hosted_url     TEXT,                      -- CloudFront URL if self-hosted
    -- Speakers
    primary_speaker     TEXT,                      -- Main speaker or narrator
    speakers            TEXT[],                    -- All speakers/interviewees
    -- Metadata
    duration_seconds    INTEGER NOT NULL,
    thumbnail_url       TEXT,
    release_date        DATE,
    series              TEXT,                      -- 'how_to_live', 'awake', 'convocation_2025'
    -- Rights and integration
    rights_holder       TEXT NOT NULL DEFAULT 'srf',
    integration_level   TEXT NOT NULL DEFAULT 'full' CHECK (integration_level IN (
        'full',                                    -- Embedded player, transcribed, indexed
        'linked'                                   -- Cataloged + timestamped, links out for viewing
    )),
    attribution         TEXT,                      -- Required credit text for third-party content
    -- Standard fields
    is_yogananda_subject BOOLEAN NOT NULL DEFAULT false,
    language            TEXT NOT NULL DEFAULT 'en',
    status              TEXT NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft', 'review', 'published', 'archived')),
    published_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

The existing `video_transcripts` and `video_chunks` tables (ADR-057) now reference `videos.id` instead of carrying `youtube_video_id` directly. `video_chunks` gains two fields for documentary support:

```sql
ALTER TABLE video_chunks ADD COLUMN speaker TEXT;
ALTER TABLE video_chunks ADD COLUMN segment_type TEXT
    CHECK (segment_type IN (
        'narration', 'interview', 'yogananda_quote', 'archival', 'music'
    ));
```

**Content authority hierarchy:**

| Level | Content | Treatment |
|-------|---------|-----------|
| Primary | Yogananda's verbatim book text | Full passage, gold accent, always cited |
| Primary | Yogananda's own voice/image | Sacred artifact treatment (ADR-078, ADR-086) |
| Secondary | Monastic talks (SRF lineage) | Attributed to speaker, linked to source passages |
| Tertiary | Documentary/interview content | Attributed to film/speaker, clearly marked as "about" not "by" |

Search results and Related Teachings maintain this hierarchy visually. A documentary clip about meditation never displaces a Yogananda passage about meditation.

**Frontend — platform-agnostic `<VideoPlayer>` component:**

| Platform | Integration Level | Rendering |
|----------|------------------|-----------|
| YouTube | `full` | YouTube IFrame Player API + synchronized transcript |
| Vimeo | `full` | Vimeo Player SDK + synchronized transcript |
| Self-hosted | `full` | HTML5 `<video>` with CloudFront source + synchronized transcript |
| Any | `linked` | Thumbnail + "Watch on [Platform] →" button (no embed) |

**Frontend routes:**

- `/videos` — all video content, filterable by type, speaker, series, platform
- `/videos/[slug]` — video detail with platform-appropriate player + synchronized transcript
- `/videos/collections/[slug]` — series groupings ("How-to-Live Talks," "Convocation 2025")
- `/videos/films` — documentary films section with film-style cards, poster art, director attribution, "Where to Watch" links

### Consequences

- Phase 1 schema creates the `videos` table (empty initially)
- Phase 2 video display is populated from both YouTube RSS and Vimeo API (both free for public content)
- Phase 16 transcription and cross-media search work identically across all platforms
- Speaker diarization tooling (pyannote or whisperX) added to the transcription pipeline for multi-speaker content (documentaries, interviews, panel discussions)
- Third-party content (documentaries, interviews) enters the catalog only with SRF editorial approval
- Vimeo Player SDK (~15KB gzipped) added as a frontend dependency alongside the YouTube IFrame API
- Self-hosted video uses the same S3 + CloudFront infrastructure as audio (ADR-078)
- `integration_level = 'linked'` enables cataloging films the portal cannot embed, with metadata and timestamped scene references
- **Replaces** the YouTube-specific `youtube_video_id` field in `video_transcripts` with a FK to `videos.id`
- **Extends** ADR-057 (video transcription) — from YouTube-only to all platforms
- **Extends** ADR-034 (chunk relations) — video chunks from any platform participate in Related Teachings

---

## ADR-089: Multi-Media Editorial Threads and Continue the Thread

### Context

Editorial threads (`editorial_threads` + `thread_passages`, ADR-054) are currently designed as sequences of book passages — curated reading paths through Yogananda's text. A thread titled "The Nature of the Soul" links seven passages from four books into a coherent progression.

With four content types now participating in the content fabric (books, video, audio, images), threads limited to book passages miss the multi-dimensional potential. A thread titled "Yogananda's Journey to America" could interleave:

1. 📖 Passage from Autobiography — receiving the vision to go to America
2. 📷 Photograph — Yogananda aboard the ship, 1920
3. 📖 Passage — arriving in Boston, the Congress of Religions
4. 🎥 Video clip — Brother Chidananda describing the early American years
5. 📷 Photograph — the first SRF center in Los Angeles
6. 🔊 Audio — Yogananda speaking about his mission in America

No physical book can provide this multi-sensory exploration. No video can provide the depth of written text alongside the immediacy of a photograph. The portal's unique strength is combining all media into coherent journeys.

Separately, "Continue the Thread" at the end of each content page currently shows only related book passages. With cross-media content available, it should surface related items across all media types.

### Decision

Generalize `thread_passages` to `thread_items` supporting all content types via the unified content hub (ADR-087). Implement three modes of content continuation:

**Mode 1 — Single-media continuation** (auto-generated from `content_relations`):
- End of an audio recording: "More recordings from this collection"
- Bottom of an image detail: "More photographs from this era"
- End of a video: "Related talks on this topic"
- End of a book chapter: "Yogananda also explores this in..." (current behavior, preserved)

**Mode 2 — Cross-media exploration** (auto-generated, mixed types):
- End of any content page: show the top related item from each *other* media type
- End of a book chapter: one related video clip, one photograph, one audio segment
- The seeker picks the medium that draws them

**Mode 3 — Editorial multi-media threads** (human-curated):
- Sequences of items from any content type, with editorial transition notes between items
- Published at `/threads/[slug]`
- Human-curated with `is_published` gate
- Same editorial review workflow as other content (AI proposes order, humans decide)

**Schema:**

```sql
-- Replaces thread_passages (generalized for all media types)
CREATE TABLE thread_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id           UUID NOT NULL REFERENCES editorial_threads(id) ON DELETE CASCADE,
    item_type           TEXT NOT NULL CHECK (item_type IN (
        'book_chunk', 'video_chunk', 'audio_segment', 'image'
    )),
    book_chunk_id       UUID REFERENCES book_chunks(id),
    video_chunk_id      UUID REFERENCES video_chunks(id),
    audio_segment_id    UUID REFERENCES audio_segments(id),
    image_id            UUID REFERENCES images(id),
    editorial_note      TEXT,                      -- Transition text between items
    sort_order          INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT exactly_one_item CHECK (
        (book_chunk_id IS NOT NULL)::int +
        (video_chunk_id IS NOT NULL)::int +
        (audio_segment_id IS NOT NULL)::int +
        (image_id IS NOT NULL)::int = 1
    )
);
```

The `editorial_threads` table itself stays unchanged (title, slug, description, is_published, language, etc.).

**Content authority in threads:**

- Editorial transition notes are clearly distinguished from Yogananda's words (different typography, muted color, italicized)
- Mixed-media threads maintain the authority hierarchy: book passages display with full passage treatment; media items display as supplementary cards
- Thread authors cannot edit or paraphrase Yogananda's text — they select existing passages and arrange them
- Third-party content (documentary clips) in threads shows attribution and rights holder

**Frontend:**

- `/threads` index and `/threads/[slug]` reading experience support mixed media items
- Thread items render according to their type: passages show verbatim text, images show responsive thumbnails, video/audio show playback cards with platform-appropriate controls
- Mode 1 and Mode 2 appear as "Continue exploring..." sections at the bottom of every content page
- Mode 3 (editorial threads) appears as curated collections, browsable by theme

### Consequences

- `thread_items` replaces `thread_passages` in the Phase 7 migration (when editorial threads are introduced)
- Initially, Phase 7 `thread_items` will contain only `book_chunk` references — same as the current `thread_passages` design, no over-engineering
- Phase 16+ enables video, audio, and image items in threads as those content types join the content hub
- Modes 1 and 2 (auto-generated) require `content_relations` (ADR-087), available from Phase 16
- Before Phase 16, "Continue the Thread" shows only book passages (current behavior preserved)
- Editorial review portal (ADR-064) gains a thread editor with drag-and-drop support for mixed media items, preview of the full multi-media thread, and platform-appropriate media previews
- Thread items inherit the content's theme tags via `content_topics`, enabling "threads about peace" or "threads about courage" browsing
- **Replaces** ADR-054's `thread_passages` table with the more general `thread_items` table (backward-compatible — existing `book_chunk` references work identically)
- **Extends** ADR-034 (chunk relations) — "Continue the Thread" becomes cross-media when the content hub arrives
- **Extends** ADR-062 (Related Teachings side panel) — the panel now includes all media types, with content authority hierarchy determining visual treatment

---

## ADR-090: MCP Server Strategy — Development Tooling for AI Implementation

### Context

The portal is implemented by AI (Claude Code) with human oversight. MCP (Model Context Protocol) servers provide the AI with direct access to external services during development — querying databases, reading error logs, inspecting CMS content models — without leaving the coding context. The question is which MCP servers provide genuine value versus adding configuration overhead for marginal benefit.

The evaluation criteria:
1. **Frequency** — Is this queried during active development, or only during setup?
2. **Context value** — Does seeing this data improve code decisions in the moment?
3. **Alternative quality** — Is the CLI or dashboard already excellent?

### Decision

Three tiers of MCP server adoption, phased with the project:

**Essential (configure now):**

| MCP Server | Purpose | Why Essential |
|------------|---------|---------------|
| **Neon** | Database schema management, SQL execution, migration testing, branch-per-test isolation | The database is the center of everything. Used in virtually every development session. |
| **Sentry** | Error investigation — stack traces, breadcrumbs, affected routes, error frequency | When something breaks during development, seeing the full error context without switching tools is genuinely valuable. Eliminates context switching during debugging. |

**High value (add when the service is introduced):**

| MCP Server | Phase | Purpose | Why Valuable |
|------------|-------|---------|-------------|
| **Contentful** | Phase 12+ | Content model queries, entry management, webhook debugging | When Contentful becomes the editorial source of truth, the content model is tightly coupled to code. Prevents drift between what code expects and what CMS provides. |

**Evaluate (try, keep if useful):**

| MCP Server | Phase | Purpose | Assessment |
|------------|-------|---------|------------|
| **GitHub** | Phases 1–11 | Issue context, PR details, review comments | Modest benefit over `gh` CLI. Try it; drop if redundant. |
| **Vercel** | Phase 1+ | Deployment status, build logs, preview URLs | Useful for debugging deployment failures. The `vercel` CLI covers most of this. |
| **Cloudflare** | Phase 1+ | WAF analytics, rate limit monitoring, traffic patterns | Terraform handles declarative config; MCP useful only for real-time monitoring queries. |

**Not recommended (skip):**

| Service | Why Skip |
|---------|----------|
| **AWS** | Terraform manages infrastructure declaratively. Sentry catches errors. The gap — "what's in that S3 bucket?" — is too narrow. `aws` CLI through Bash handles rare ad-hoc queries. |
| **Figma** | Design tokens are exported once to `tokens.json` and consumed by Tailwind. The AI reads the local file; no interactive Figma queries needed. |
| **Amplitude** | Analytics code targets the SDK, not the query API. By the time analytics data matters (Phase 7+), queries are infrequent. Dashboard is adequate. |
| **New Relic** | APM data (slow queries, endpoint latency) is useful during the Phase 7 observability work, but that's a narrow window. Dashboards handle ongoing monitoring. |
| **Auth0** | Auth is configured once and rarely touched. When it breaks, the Auth0 CLI or dashboard is adequate for the low frequency of interaction. |

**Custom MCP server (Phase 1):**

The **SRF Corpus MCP** server (planned since the original design) gives the AI development-time access to the book corpus — "find all passages about meditation in Autobiography." This enables the AI to reference actual content when building search features, theme pages, and test fixtures.

### Consequences

- Sentry MCP added to project configuration at Phase 1 alongside existing Neon MCP
- Contentful MCP evaluated and added when Phase 12 Contentful migration begins
- GitHub MCP evaluated during Phase 1; kept or dropped based on actual utility versus `gh` CLI
- SRF Corpus MCP server built as a Phase 1 deliverable (custom, queries Neon directly)
- AWS MCP explicitly not adopted — Terraform + Sentry + `aws` CLI is sufficient
- MCP server configuration documented in CLAUDE.md for all future AI sessions
- This decision is revisited at Phase 10 (Contentful), Phase 13 (cross-media), and Phase 15 (user accounts) when new services enter the stack

---

## ADR-091: Language API Design — Locale Prefix on Pages, Query Parameter on API

**Status:** Accepted | **Date:** 2026-02-20

### Context

The portal serves content in multiple languages (Phase 11+). Two independent systems need language awareness: the frontend pages (rendered by Next.js for seekers) and the API routes (consumed by the web frontend, mobile apps, WhatsApp bots, and future integrations). The question is how language is expressed in URLs.

Three approaches were considered:

| Approach | Frontend URL | API URL | Pros | Cons |
|----------|-------------|---------|------|------|
| **Locale prefix everywhere** | `/hi/themes/peace` | `/api/v1/hi/themes/peace/passages` | Consistent URL pattern | Conflates locale and API versioning; not every API endpoint is language-scoped (`/health`, passage-by-id); awkward for mobile apps that manage locale in their own state |
| **Query parameter everywhere** | `/themes/peace?language=hi` | `/api/v1/themes/peace/passages?language=hi` | Clean API contract; single endpoint surface | Loses SEO benefits for frontend pages; no `hreflang` linking; no `lang` attribute signal from URL |
| **Hybrid: prefix on pages, parameter on API** | `/hi/themes/peace` | `/api/v1/themes/peace/passages?language=hi` | SEO-friendly pages; clean API contract; each system uses the pattern natural to its consumers | Two patterns to understand (but each is standard in its domain) |

### Decision

Adopt the **hybrid approach**: locale path prefix on frontend pages, query parameter on API routes.

**Frontend pages:** `/{locale}/path` — standard Next.js i18n routing via `next-intl`.

```
/hi/themes/peace          ← Hindi theme page
/hi/books/autobiography   ← Hindi book page
/hi/search?q=...          ← Hindi search
/hi/quiet                 ← Hindi Quiet Corner
/themes/peace             ← English (default, no prefix)
```

**API routes:** `/api/v1/path?language={locale}` — language as query parameter.

```
/api/v1/themes/peace/passages?language=hi     ← Hindi passages for theme
/api/v1/search?q=...&language=hi              ← Hindi search
/api/v1/daily-passage?language=hi             ← Hindi daily passage
/api/v1/passages/[chunk-id]                   ← Language inherent to chunk
/api/v1/passages/[chunk-id]?language=hi       ← Cross-language: find Hindi equivalent via canonical_chunk_id
/api/v1/health                                ← No language parameter needed
```

**Server Components** call service functions with language as a function parameter: `findPassages(query, 'hi', options)`. The locale is extracted from the URL prefix by the Next.js middleware and passed down. The service layer never reads the URL — it receives language as a plain argument.

### Rationale

- **Language is a property of content, not a namespace for operations.** "Search" is the same operation regardless of language. The `?language=` parameter modifies what content is returned, not what operation is performed. This is the fundamental insight.
- **API consumers vary.** The web frontend handles locale via URL prefix (standard i18n SEO). A mobile app manages locale in its own state. A WhatsApp bot receives locale from the user's profile. A third-party scholar tool may request multiple languages in sequence. The API should serve all with a single, clean contract.
- **Not every endpoint is language-scoped.** `/api/v1/health`, `/api/v1/passages/[chunk-id]` (the passage already *is* in a language), `/api/v1/books` (returns all books with their `language` field) — forcing a locale prefix on these creates semantic confusion.
- **CDN caching works with query parameters.** Vercel and Cloudflare cache based on full URL including query string. `?language=hi` produces a distinct cache entry.
- **Versioning and locale are orthogonal.** `/api/v1/` is the version namespace. Locale is content filtering. Mixing them (`/api/v1/hi/`) conflates two independent axes of variation.
- **10-year horizon.** New languages are added by supporting a new `language` parameter value — no new route structure, no new endpoints. The API contract is stable across all future languages.

### Consequences

- Frontend i18n uses `next-intl` with URL-based locale prefixes from Phase 2 (consistent with ADR-020)
- All API endpoints accept an optional `language` query parameter (default: `en`)
- The `language` parameter triggers locale-first search and English fallback at the service layer (ADR-020)
- Mobile apps and other consumers pin to the API and pass language as a parameter
- Server Components extract locale from the URL prefix and pass it to service functions — business logic never reads URLs
- `hreflang` tags on frontend pages enable cross-locale SEO linking
- The OG meta tags on passage share URLs include the language, so shared links render in the correct locale
- **Extends ADR-020** (multi-language architecture) and **ADR-024** (API-first architecture)

---

## ADR-092: People Library — Spiritual Figures as First-Class Entities

**Status:** Accepted | **Date:** 2026-02-20

### Context

The portal currently models spiritual figures (Krishna, Christ, Sri Yukteswar, Lahiri Mahasaya, etc.) as teaching topics with `category = 'person'` in the `teaching_topics` table. This serves the question "What did Yogananda teach about Krishna?" — it's a collection of tagged passages.

But seekers who encounter a spiritual figure in the Autobiography often want something different: "Who *is* Krishna in the context of Yogananda's teachings?" This requires biographical context, lineage position, associated places, relationships to other figures, and *then* the relevant passages. The theme page answers a search question; the person page answers a reference question.

Three approaches were considered:

| Approach | Data Model | Pros | Cons |
|----------|-----------|------|------|
| **Person as theme only** | `teaching_topics` with `category = 'person'` | Simple; already built | No biographical metadata; no lineage structure; no place associations; every figure is "just a tag" |
| **Rich metadata on teaching_topics** | Add biographical columns to `teaching_topics` | Single table; reuses existing infrastructure | teaching_topics becomes overloaded (most topics don't have birth years or lineage positions); mixes concerns |
| **Separate people table linked to themes** | `people` table with FK to `teaching_topics` for tagging | Clean separation of entity metadata and passage tagging; each table does one thing | Additional table and API endpoint |

The same pattern applies to Places, which already have a dedicated `places` table with rich metadata (ADR-026). People deserve the same treatment.

### Decision

Add a **`people`** table as a first-class content type, linked to the existing `teaching_topics` system for passage tagging. Create a People Library (`/people`) parallel to the Books library (`/books`) and Sacred Places (`/places`).

#### Schema

```sql
CREATE TABLE people (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    title           TEXT,                       -- e.g., "Paramguru," "Avatar," "Yogiraj"
    lineage_position TEXT,                      -- e.g., "Guru of Paramahansa Yogananda"
    birth_year      INTEGER,
    death_year      INTEGER,                    -- NULL for avatars (Krishna) or living figures
    biography_short TEXT NOT NULL,              -- 2–3 sentences, editorial
    biography_long  TEXT,                       -- full detail page content, editorial
    image_id        UUID,                       -- FK to images table (Phase 14, ADR-086)
    topic_id        UUID REFERENCES teaching_topics(id), -- links to theme tagging system
    language        TEXT NOT NULL DEFAULT 'en',
    canonical_person_id UUID REFERENCES people(id), -- cross-language linking
    is_published    BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_people_slug ON people(slug);
CREATE INDEX idx_people_published ON people(is_published) WHERE is_published = true;
```

#### Junction tables

```sql
-- People ↔ Places (e.g., Sri Yukteswar ↔ Serampore, Puri)
CREATE TABLE person_places (
    person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    place_id  UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    role      TEXT,           -- 'birthplace', 'ashram', 'teaching_center', 'burial'
    PRIMARY KEY (person_id, place_id)
);

-- People ↔ People (lineage and relationships)
CREATE TABLE person_relations (
    source_person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    target_person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    relation_type    TEXT NOT NULL, -- 'guru_of', 'disciple_of', 'contemporary', 'referenced_by'
    PRIMARY KEY (source_person_id, target_person_id)
);
```

#### API

```
GET /api/v1/people                          → List all published people
    ?language=en                            → Filter by language
    ?lineage=true                           → Filter to guru lineage only

GET /api/v1/people/[slug]                   → Person detail with metadata
    Response includes: biographical info, lineage position,
    associated places, related people, link to theme page

GET /api/v1/people/[slug]/passages          → Passages tagged with this person
    (Delegates to the existing theme tagging system via topic_id)
    ?language=en&limit=10&cursor=...
```

#### Frontend

| Route | Purpose |
|-------|---------|
| `/people` | People Library — spiritual figures organized by category (guru lineage, avatars, saints, referenced figures) |
| `/people/[slug]` | Person detail — biography, lineage, places, passages |

The People Library links bidirectionally with:
- **Theme pages:** `/people/krishna` links to `/themes/krishna` (tagged passages) and vice versa
- **Sacred Places:** `/people/sri-yukteswar` links to `/places/serampore` and `/places/puri`
- **Book reader:** Inline references to a person in the text can link to their People Library entry
- **Reverse Bibliography:** `/references/bhagavad-gita` links to `/people/krishna`

#### Relationship to existing theme system

The theme page (`/themes/krishna`) continues to serve the question "What did Yogananda teach about Krishna?" The person page (`/people/krishna`) serves "Who is Krishna?" The person page includes a prominent link to the theme page ("Read what Yogananda taught about Krishna →"). The `topic_id` FK on `people` connects the two systems.

### Rationale

- **Seekers ask two kinds of questions about spiritual figures.** "What did Yogananda say about X?" (theme page) and "Who is X?" (person page). Both are natural; each deserves its own answer.
- **Avatars are constant.** Krishna, Christ, and the guru lineage do not change. Their biographical entries are stable reference content — a different kind of value than the growing, curated passage collection on theme pages.
- **Monastics and living teachers.** As new monastics lead SRF, the People Library preserves their biographical context. This is a respectful, mission-aligned record.
- **Cross-referencing is the unique value.** The People Library connects people to places, to books, to passages, and to each other. No other digital resource provides this integrated view of the spiritual figures in Yogananda's world.
- **Parallel to Places and Books.** The portal already has a Books library (entities with metadata + linked passages) and a Places library (entities with metadata + linked passages). People is the natural third pillar.
- **Low schema cost, high editorial value.** One table, two junction tables. The biographical content is editorial — written once, updated rarely.

### Consequences

- `people` table added to Neon schema (Phase 6 migration, when person-category themes activate)
- `person_places` and `person_relations` junction tables added alongside
- `/people` and `/people/[slug]` routes added to the frontend (Phase 6)
- API endpoints `GET /api/v1/people` and `GET /api/v1/people/[slug]` added (Phase 6)
- People Library entries require SRF editorial review and approval before publication (`is_published` gate)
- Guru photographs on person pages follow ADR-016 sacred image guidelines
- Cross-language person entries linked via `canonical_person_id` (Phase 11)
- Theme pages for person-category topics gain a "Learn about [person] →" link to the People Library
- Reader inline references to named figures can link to People Library entries (Phase 6+)
- **Extends ADR-013** (teaching topics), **ADR-026** (Sacred Places), **ADR-058** (exploration categories)

---

## ADR-093: Living Glossary — Spiritual Terminology as User-Facing Feature

**Status:** Accepted | **Date:** 2026-02-20

### Context

The spiritual terminology bridge (`/lib/data/spiritual-terms.json`, ADR-052) maps modern and cross-tradition terms to Yogananda's vocabulary for internal search expansion. It is invisible to seekers. Yet Yogananda's writings use hundreds of Sanskrit, yogic, and esoteric terms — *samadhi*, *chitta*, *prana*, *astral body*, *Christ Consciousness* — that newcomers cannot be expected to know. A seeker encountering "samadhi" for the first time has nowhere within the portal to learn what it means. They must leave the portal, which breaks the reading flow and undermines the library's self-contained nature.

### Decision

Surface the spiritual terminology bridge as a user-facing glossary with two delivery mechanisms:

**1. Glossary page (`/glossary`):**
- Browsable, searchable, organized by category (Sanskrit terms, yogic concepts, spiritual states, scriptural references)
- Each entry contains: term, brief definition (1-2 sentences, editorially written), Yogananda's own explanation (verbatim quote from the corpus where he defines the term, with full citation), and links to theme pages and reader passages where the term appears
- Search within the glossary uses trigram matching (`pg_trgm`) for partial/fuzzy lookups
- Multilingual: glossary entries carry a `language` column; Phase 11 adds per-locale glossaries built during the human review cycle (already planned in Deliverable 11.12)

**2. Inline term highlighting in the reader (opt-in):**
- Toggle in reader settings: "Show glossary terms" (off by default)
- When enabled, recognized glossary terms in the reader text receive a subtle dotted underline (`border-bottom: 1px dotted var(--srf-gold)` at 40% opacity)
- Hovering (desktop) or tapping (mobile) reveals a tooltip: brief definition + "Read Yogananda's explanation →" linking to the relevant passage
- No AI-generated definitions — every definition is editorially written, every "explanation" is a verbatim Yogananda quote
- Terms are matched at ingestion time (stored in `chunk_glossary_terms` junction table), not at render time — zero client-side regex

### Schema

```sql
CREATE TABLE glossary_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    term TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    brief_definition TEXT NOT NULL,  -- 1-2 sentences, editorially written
    category TEXT NOT NULL CHECK (category IN (
        'sanskrit', 'yogic_concept', 'spiritual_state',
        'scriptural', 'cosmological', 'practice'
    )),
    explanation_chunk_id UUID REFERENCES book_chunks(id),  -- Yogananda's own definition
    language TEXT NOT NULL DEFAULT 'en',
    sort_order INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE chunk_glossary_terms (
    chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
    term_id UUID NOT NULL REFERENCES glossary_terms(id) ON DELETE CASCADE,
    PRIMARY KEY (chunk_id, term_id)
);
```

### Phase

- Data: Seed from `spiritual-terms.json` starting Phase 1. Enriched per-book via vocabulary extraction lifecycle (ADR-052).
- Glossary page (`/glossary`): Phase 5 (when multi-book content provides sufficient explanation passages).
- Inline reader highlighting: Phase 5 (reader settings already exist from Phase 4).

### Consequences

- Two new tables (`glossary_terms`, `chunk_glossary_terms`)
- Glossary page added to navigation (linked from reader settings and footer, not in primary nav — it's a reference tool, not a destination)
- Inline highlighting is opt-in and off by default — respects the clean reading experience
- Editorial effort: brief definitions must be written for each term. Yogananda's own definitions are identified during ingestion QA.
- **Extends ADR-052** (terminology bridge) from an internal search tool to a user-facing feature

---

## ADR-094: "What Is Humanity Seeking?" — Public-Facing Dashboard

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-068 (search intelligence), ADR-029 (observability), ADR-014 (DELTA boundaries)

### Context

ADR-068 established anonymized search theme aggregation in `search_theme_aggregates`, with a nightly Lambda job classifying queries by theme, geography, and time period. The "What Is Humanity Seeking?" annual report was deferred to Phase 16 (Deliverable 16.8) as a human-curated PDF. This dramatically undervalues the concept.

The aggregated data — what the world is searching for spiritually, in real time, across 100+ countries — is one of the most profound data products conceivable. It makes the invisible visible: the collective spiritual yearning of humanity.

### Decision

Create a public-facing dashboard at `/seeking` that visualizes the portal's anonymized search intelligence. Move from Phase 16 annual report to Phase 7 live dashboard.

**Dashboard sections:**

1. **"Right now, the world is seeking..."** — The top 3-5 search themes this month, displayed as warm-toned text with gentle emphasis on the leading theme. Updated nightly from aggregates.

2. **Geographic view** — A warm-toned world map with soft regional highlights showing where seekers are and what they're seeking. Country-level only. Regions with < 10 queries suppressed (existing ADR-068 threshold). Not a heatmap — a contemplative visualization.

3. **Seasonal rhythm** — A year-view showing how themes ebb and flow across months. "In December, the world seeks peace. In spring, purpose rises." Requires 12 months of data to populate.

4. **The questions** — The most common question-form queries, anonymized and lightly clustered: "How do I forgive?", "What happens after death?", "How to meditate?" Displayed as contemplative text, not a ranked list.

**Magazine symbiosis:** The dashboard includes a "Read the full analysis in Self-Realization Magazine →" link when a curated magazine feature is available. The portal provides the data; the magazine provides the storytelling.

### Design Constraints

- **DELTA-compliant.** All data is aggregated, anonymized, and subject to ADR-068's minimum thresholds. No individual identification possible.
- **Calm Technology.** The dashboard is contemplative, not analytical. Warm tones, generous whitespace, Merriweather typography. Not a SaaS analytics dashboard.
- **Not real-time.** Updated nightly from the Lambda aggregation job. No live counters, no streaming updates.
- **No vanity metrics.** No "total searches" counter, no "users served" number. The dashboard answers "What is humanity seeking?" not "How popular is the portal?"

### Phase

- Phase 7 (when the search analytics dashboard and theme aggregation ship). Deliverable 7.4 expanded to include the public-facing `/seeking` page alongside the admin Retool panel.
- Magazine symbiosis: Phase 9+ (when distribution channels are active).

### Consequences

- `/seeking` added to the portal (not in primary nav — linked from footer and About page)
- Nightly Lambda aggregation job (already planned in Phase 7) produces data consumed by both the admin panel and the public dashboard
- The dashboard requires geographic aggregation and theme trend computation — extensions to the existing `search_theme_aggregates` table
- Editorial involvement: the "questions" section may need curation to avoid surfacing sensitive queries
- **Amends ADR-068** by adding a public consumption layer alongside the admin-only analytics
- **Moves Deliverable 16.8** from Phase 16 to Phase 7 (live dashboard) + Phase 9 (magazine symbiosis)

---

## ADR-095: Contextual Quiet Corner — Practice Bridge in the Reader

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-038 (dwell mode), ADR-041 (lotus bookmarks), DELTA Embodiment principle

### Context

The Quiet Corner (`/quiet`) is a standalone page — a micro-sanctuary for crisis moments. Dwell mode (ADR-038) creates a contemplative reading state. But there is no bridge between these: when a reader dwells on a profound passage about healing or peace, the portal offers no way to transition from reading to practice within the same experience.

### Decision

Add a **"Pause with this"** interaction in dwell mode that transitions the current passage into a contextual Quiet Corner experience without leaving the reader.

**Trigger:** In dwell mode, alongside the share and bookmark icons, a small timer icon appears (lotus with a circle, 16px, `--srf-gold` at 50% opacity). Clicking it enters the contextual Quiet Corner.

**Effect:**
1. All reader chrome fades (header, sidebar, navigation) over 600ms
2. The passage remains centered and vivid — it becomes the affirmation
3. Timer options appear below the passage: 1 min · 5 min · 15 min
4. On timer start, timer options fade, leaving only the passage on warm cream
5. Singing bowl audio cue at start, gentle chime at end (see ADR-101)
6. When the timer completes (or the seeker taps anywhere), the reader chrome returns over 300ms
7. The passage is offered for bookmarking if not already bookmarked

**This is not a new page or route.** It's a CSS mode on the existing reader (`data-mode="quiet"`) — the same passage, the same component, the same accessibility. The URL does not change. Browser history is not affected.

### Accessibility

- `Escape` exits the contextual Quiet Corner (same as exiting dwell mode)
- Screen reader: "Passage meditation mode. Timer options: 1 minute, 5 minutes, 15 minutes."
- `prefers-reduced-motion`: transitions instant, dimming still occurs
- Timer completion: visual flash equivalent for hearing-impaired seekers (same as standalone Quiet Corner)

### Phase

Phase 4 (alongside dwell mode in Deliverable 4.1). Requires the Quiet Corner audio (ADR-101) to be available from Phase 2.

### Consequences

- Dwell mode gains a third icon alongside share and bookmark
- The reader component gains a `data-mode="quiet"` CSS state
- Timer logic reuses the standalone Quiet Corner implementation (shared component)
- The contextual Quiet Corner does not track or store session data
- **Extends ADR-038** (dwell mode) with a practice bridge; **extends the Quiet Corner** from a standalone page to a reading mode

---

## ADR-096: "Start Here" — Newcomer Path

**Status:** Accepted | **Date:** 2026-02-20

### Context

The portal assumes seekers will search, browse themes, or go directly to the reader. But someone who has never read Yogananda — and millions haven't — faces an unmarked starting line. The Library lists books. The About page tells them who Yogananda was. Neither answers: "Where should I begin?"

### Decision

Add editorially curated "Start Here" sections on the homepage and library page, offering three entry paths based on the seeker's disposition:

**Homepage — below Today's Wisdom, above thematic doors:**

```
New to Yogananda?

→ Start with Chapter 14: "An Experience in Cosmic Consciousness"
  — Yogananda's account of his first direct experience of the infinite. 15 min read.

→ Or browse by what you need right now
  [Peace]  [Courage]  [Healing]  [Joy]  [Purpose]  [Love]
```

**Library page — above the book grid:**

```
Where to Begin

The curious reader     →  Autobiography of a Yogi (his life story)
The person in need     →  Where There Is Light (organized by life topic)
The meditation seeker  →  How You Can Talk With God (practical and foundational)
```

**Design:**
- Warm cream card with Merriweather Light typography. Quiet, inviting — not a tutorial or onboarding flow.
- Content is editorial, not AI-generated. Lives in `messages/en.json` initially; in Contentful per locale from Phase 10+.
- Each locale gets independently authored "Start Here" content (not translated from English) to ensure cultural resonance (consistent with ADR-061's cultural consultation commitment).

### Phase

Phase 2 (it's editorial content on existing pages, no new infrastructure).

### Consequences

- Homepage and library page gain a "Start Here" section
- Content externalized in locale files (i18n-ready from day one)
- Phase 11: per-locale cultural adaptation of entry paths
- No tracking of which path is chosen — DELTA-compliant
- **Complements ADR-013** (thematic doors) and **ADR-035** (empathic entry points) with a third navigation strategy: guided entry for newcomers

---

## ADR-097: Passage Resonance Signals — Content Intelligence Without Surveillance

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-014 (DELTA boundaries), ADR-029 (observability), ADR-068 (search intelligence)

### Context

The portal tracks search queries (anonymized) and search themes (aggregated) per ADR-068. But it has no signal for which *passages* resonate with seekers. Which quotes are shared most? Which cross-book connections are traversed most? This is content intelligence — understanding which teachings serve seekers best — not user tracking.

### Decision

Collect anonymous, aggregated, passage-level resonance signals for editorial use. Strictly content-level, never user-level.

**Signals collected:**

| Signal | Source | Storage |
|--------|--------|---------|
| Share count | Increment when share link/image/PDF generated (ADR-015) | `book_chunks.share_count` (integer) |
| Dwell count | Increment when dwell mode activated (ADR-038) | `book_chunks.dwell_count` (integer) |
| Relation traversal | Increment when a chunk_relation link is followed | `chunk_relations.traversal_count` (integer) |
| "Show me another" skip | Increment when Today's Wisdom "Show me another" is clicked | `daily_passages.skip_count` (integer) |

**Constraints:**
- Counters are simple integers. No timestamps, no session correlation, no user identification.
- Counters are increment-only (no decrement, no reset). Monotonic.
- Not exposed to seekers. Never displayed publicly ("Most shared passage" would create a popularity contest — antithetical to Calm Technology).
- Accessible only in the editorial review portal (ADR-064) for curation intelligence: "Which passages are resonating?" informs Today's Wisdom selection, theme page curation, and the "What Is Humanity Seeking?" dashboard.
- Rate-limited: one increment per signal type per client IP per hour (prevents gaming without requiring user accounts).

### Phase

- Instrumentation: Phase 2 (simple counter increments on existing API responses).
- Editorial dashboard: Phase 5 (alongside the editorial review portal, Deliverable 5.10).

### Consequences

- Four new integer columns on existing tables (no new tables)
- Rate-limiting logic added to share, dwell, and relation API handlers
- Editorial review portal gains a "Resonance" view showing top-shared, top-dwelled, and most-traversed passages
- **Extends ADR-068** from query-level intelligence to passage-level intelligence
- **Complements ADR-014** (DELTA boundaries) — content intelligence, not user intelligence

---

## ADR-098: Knowledge Graph Visualization

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-034 (chunk relations), ADR-048 (theme taxonomy), ADR-055 (reverse bibliography), ADR-058 (exploration categories), ADR-092 (people library)

### Context

The portal's schema contains a complete semantic map of Yogananda's teachings: chunk relations (similarity), theme tags (quality, situation, person, principle, scripture, practice, yoga_path), reverse bibliography (external references), editorial cross-references, People Library entities, and cross-language alignment. No such map exists for any major spiritual figure. This semantic structure is navigable through linear interfaces (search, theme pages, reader side panel) but has never been visualized as a whole.

### Decision

Build an interactive knowledge graph visualization at `/explore` that renders the portal's semantic structure as a navigable, visual map.

**Nodes:**
- Books (large, colored by book)
- Passages / chunks (small, clustered around their book)
- Themes (medium, connecting clusters)
- People (medium, from People Library)
- Scriptures and external references

**Edges:**
- Chunk relations (similarity, with thickness proportional to similarity score)
- Theme memberships (chunk → theme)
- External references (chunk → scripture/person)
- Cross-book connections (strongest relations between books)

**Interaction:**
- Enter from any node: click a theme, person, or book to center and expand
- Zoom: mouse wheel / pinch. Pan: drag.
- Click a passage node to see its text, citation, and "Read in context →" link
- Filter by: book, theme category, relation type
- Two views: full graph (all books, all themes) and focused view (single book's connections)

**Technology:** Client-side graph rendering via `d3-force` or `@react-three/fiber` (3D option for immersive exploration). Pre-computed graph data served as static JSON from S3 (regenerated nightly). No real-time graph queries — the visualization is a pre-baked artifact.

**Design:** Warm tones, `--portal-bg` background, `--srf-gold` edges, `--srf-navy` nodes. Not a clinical network diagram — a contemplative map of interconnected wisdom. Generous whitespace at the edges. Slow, deliberate animation (nodes drift gently, not bounce). `prefers-reduced-motion`: static layout, no animation.

### Phase

Phase 7 (after chunk relations are computed across the full multi-book corpus in Phases 6-7). The graph needs multi-book density to be meaningful.

### Consequences

- New page at `/explore` (linked from Library and themes pages, not primary nav)
- Pre-computed graph JSON generated nightly by Lambda (extension of chunk relation computation)
- Client-side rendering adds ~50-80KB JS (loaded only on `/explore` — not in the global bundle)
- Graph data is a static artifact — no database queries during exploration
- **Extends ADR-034** (chunk relations) from a search/reader feature to a visual discovery tool

---

## ADR-099: Study Circle Sharing

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-075 (study guide view), ADR-111 (Study Workspace, formerly ADR-077), ADR-061 (Global South delivery)

### Context

Study circles (satsanga groups) are a core SRF community practice — groups of devotees meeting weekly to study Yogananda's teachings together. The Study Workspace (ADR-111, Phase 8) serves all users. But lay study groups communicating via WhatsApp and SMS need a different sharing mechanism. In India, Latin America, and many African communities, these groups rely on messaging channels.

### Decision

Add a **"Share with your circle"** feature to the Study Guide view (ADR-075, Phase 8) that generates a shareable, self-contained page optimized for group communication channels.

**From the Study Guide view**, a "Share with your circle" button generates a unique URL:

```
/study/[book-slug]/[chapter]/share/[hash]
```

**The shared page contains:**
- Chapter title and book citation
- Key passages (the 3-5 highest-relation-density paragraphs)
- Discussion prompts from `chapter_study_notes` (if available)
- Cross-book connections as "Also read..." suggestions
- "Open in the portal →" link for the full chapter

**Design constraints:**
- The page is public, no authentication required
- Pre-rendered at share time, served from edge cache (content-hashed URL)
- Lightweight: < 30KB HTML (optimized for WhatsApp preview and low-bandwidth sharing)
- OG card: chapter title + first key passage + portal branding
- No tracking. No analytics on the shared page. The share count on the source chapter increments (ADR-097) but the shared page itself is anonymous.

### Phase

Phase 8 (alongside Study Guide view, Deliverable 8.3).

### Consequences

- Study Guide view gains a "Share with your circle" button
- New route: `/study/[book-slug]/[chapter]/share/[hash]`
- Shared pages are static HTML, edge-cached, lightweight
- WhatsApp link preview works cleanly (OG card with chapter title and passage)
- **Extends ADR-075** (study guide) from a solo preparation tool to a community sharing feature
- **Serves ADR-061** (Global South) by optimizing for the communication channels study groups actually use

---

## ADR-100: Calendar Reading Journeys — Structured Multi-Day Experiences

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-054 (editorial threads), ADR-056 (calendar-aware surfacing), ADR-018 (daily email)

### Context

Calendar-aware content surfacing (ADR-056) handles individual daily passages for specific dates. Editorial threads (ADR-054) handle curated multi-passage reading paths. Neither supports *time-bound journeys* — a structured reading experience spanning days or weeks, delivered one passage per day.

### Decision

Introduce **reading journeys** as a time-bound variant of editorial threads. A reading journey is a sequence of daily passages, editorially curated, with a defined start date and duration.

**Examples:**
- **"40 Days with Yogananda"** — Foundational teachings, one per day, building from accessible to deep
- **"Christmas with Yogananda"** — 12 days of passages on Christ Consciousness from *The Second Coming of Christ*
- **"Navratri Contemplations"** — 9 passages on the Divine Mother
- **"New Year, New Resolve"** — 7 days of teachings on willpower and fresh beginnings

**Schema extension to `editorial_threads`:**

```sql
ALTER TABLE editorial_threads ADD COLUMN journey_type TEXT
    CHECK (journey_type IN ('evergreen', 'seasonal', 'annual'));
ALTER TABLE editorial_threads ADD COLUMN journey_duration_days INTEGER;
ALTER TABLE editorial_threads ADD COLUMN journey_start_month INTEGER;  -- 1-12
ALTER TABLE editorial_threads ADD COLUMN journey_start_day INTEGER;    -- 1-31
```

- `journey_type = NULL` means a standard editorial thread (no time-binding)
- `journey_type = 'evergreen'` means available year-round (seeker picks start date)
- `journey_type = 'seasonal'` means tied to a specific calendar window
- `journey_type = 'annual'` means recurs annually on a fixed date

**Delivery:** Via the daily email (Phase 9). A seeker can subscribe to a journey; they receive one passage per day for the journey's duration instead of (or alongside) the standard daily passage. No app, no login required — email is the delivery mechanism.

**Browse:** `/journeys` page lists available journeys with descriptions, durations, and "Subscribe" buttons. Active seasonal journeys are highlighted.

### Phase

- Schema extension: Phase 6 (when editorial threads ship)
- Browse page + email delivery: Phase 9 (when daily email ships)
- Initial journeys: curated during Phase 9 from the existing multi-book corpus

### Consequences

- `editorial_threads` table extended with journey columns (no new tables)
- `/journeys` page added to the portal
- Daily email service gains journey-aware delivery logic
- Editorial effort: each journey is a curated reading path — requires editorial investment
- **Extends ADR-054** (editorial threads) with time-bound delivery
- **Extends ADR-018** (daily email) with journey subscriptions

---

## ADR-101: Quiet Corner Audio from Phase 2

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-076 (audio-visual ambiance), DELTA Embodiment principle

### Context

ADR-076 established ambient audio in the reader and Quiet Corner as a Phase 12 feature — off by default, three options (Off / Temple / Nature), two ~200–400KB audio loops. But the Quiet Corner's core purpose — a micro-sanctuary for someone in crisis — would be transformed by two specific sounds: a singing bowl strike when the timer begins, and a gentle chime when it ends. These are not ambient loops; they are discrete audio cues that mark the boundaries of a contemplative pause.

### Decision

**Move two discrete audio cues to Phase 2** (the Quiet Corner's delivery phase), leaving ambient audio loops in Phase 12:

| Audio | File | Size | Purpose |
|-------|------|------|---------|
| Singing bowl strike | `bowl.mp3` | ~15KB | Marks the beginning of the contemplative pause |
| Gentle chime | `chime.mp3` | ~15KB | Marks the end of the timer |

**Behavior:**
- Singing bowl plays when the seeker taps "Begin" (timer start)
- Chime plays when the timer completes
- Both at fixed ~15% volume (matching ADR-076's volume level)
- Both via Web Audio API (same as the existing chime specification in DESIGN.md)
- Both respect `prefers-reduced-motion` (visual flash equivalent already specified)
- No ambient loops, no continuous audio — just two moments of sound

**Storage:** Bundled as static assets (30KB total). Not on S3 — they're small enough to include in the app shell.

### Phase

Phase 2 (Deliverable 2.3, the Quiet Corner).

### Consequences

- Two small audio files added to static assets
- The Quiet Corner gains auditory boundaries from launch
- ADR-076's full ambient audio system remains Phase 12 — this ADR only moves the two discrete cues
- The contextual Quiet Corner (ADR-095) inherits these audio cues
- **Amends ADR-076** by extracting two discrete audio cues to Phase 2 while leaving ambient loops in Phase 12

---

## ADR-102: Practice Bridge After Search

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-003 (AI as librarian), ADR-049 E1 (search intent classification), DELTA Embodiment principle

### Context

When a seeker searches "How do I meditate?" the portal returns Yogananda's verbatim passages about meditation — correct per ADR-003. But the seeker's next question is: "OK, but *how do I actually start?*" The portal provides the teaching but not the bridge to practice. The "Go Deeper" links exist on the About page and footer, but they are not contextual to the search query.

### Decision

Add a **contextual practice signpost** on search results when the search intent classifier (ADR-049 E1) detects a practice-oriented query. The signpost appears below the search results, not above or alongside them — Yogananda's words always come first.

**Signpost examples:**

| Detected intent | Signpost text |
|----------------|---------------|
| Meditation practice | "Yogananda taught a specific science of meditation. To begin a practice: SRF Lessons →" |
| Healing / affirmation | "Yogananda developed a system of healing affirmations. Explore them in the Quiet Corner →" |
| Finding a community | "Yogananda encouraged group meditation. Find a meditation group near you →" |
| Kriya Yoga | "Kriya Yoga is taught through SRF's Home Study Lessons. Learn more →" |

**Design:**
- Below search results, separated by generous whitespace
- Warm cream card with subtle `--srf-gold` left border
- Open Sans, `--portal-text-muted` — understated, not promotional
- External links open in new tabs
- The signpost is **never** shown when the query doesn't match a practice intent — it is not a persistent element

**Constraints:**
- This is a signpost, not a funnel. No tracking of click-through. No conversion metrics. No A/B testing.
- The signpost text is editorial, not AI-generated. Stored in `messages/en.json`.
- Only practice-related intents trigger signposts — not all searches.

### Phase

Phase 5 (when search intent classification is mature and multi-book content provides sufficient results).

### Consequences

- Search results page gains a conditional signpost section
- Search intent classifier (ADR-049 E1) extended with practice-intent detection
- Signpost text externalized for i18n
- **Extends ADR-003** by connecting the librarian's results to the reader's next step
- **Serves DELTA's Embodiment principle** — the portal encourages the seeker to move from reading to practice

---

## ADR-103: Content Integrity Verification

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-066 (content-addressable deep links), ADR-003 (direct quotes only)

### Context

The portal's core promise is sacred text fidelity: every displayed passage is verbatim from Yogananda's published works. But there is no mechanism to *verify* this — to prove that the portal's text hasn't drifted from SRF's source publications. Content-addressable deep links (ADR-066) use content hashes for URL stability, but they don't solve provenance.

### Decision

Implement per-chapter content integrity hashes that enable verification of the portal's text against SRF's master publications.

**Approach:**
- At ingestion time, compute a SHA-256 hash of each chapter's concatenated, normalized text (whitespace-normalized, Unicode NFC)
- Store the hash in `chapters.content_hash TEXT NOT NULL`
- Expose hashes via API: `GET /api/v1/books/{slug}/integrity` returns a JSON array of `{ chapter_number, chapter_title, content_hash }` for all chapters
- SRF can independently compute the same hashes from their master text files and compare

**Verification page (`/integrity`):**
- Simple public page listing all books and their chapter hashes
- "How to verify" instructions for computing hashes from physical books
- Statement: "Every word on this portal is verified against SRF's published editions."

**Hash computation is deterministic:**

```typescript
function chapterHash(chunks: string[]): string {
  const normalized = chunks
    .map(c => c.normalize('NFC').replace(/\s+/g, ' ').trim())
    .join('\n');
  return sha256(normalized);
}
```

### Phase

Phase 1 (computed during ingestion, stored in schema). The `/integrity` page is Phase 2.

### Consequences

- `chapters.content_hash` column added to schema
- Ingestion pipeline computes hashes automatically
- `/integrity` page and API endpoint added
- Hash recomputation on any content update (catches drift)
- **Extends ADR-066** from URL stability to content provenance

---

## ADR-104: "What's New in the Library" Indicator

**Status:** Accepted | **Date:** 2026-02-20

### Context

When new books are ingested (Phase 5+), returning visitors have no way to discover the addition without manually checking the Library page. The portal needs a subtle mechanism to surface new content without violating Calm Technology principles (no notifications, no badges, no attention-seeking).

### Decision

A minimal **"New" indicator** on the Library page and navigation item when new books have been added since the seeker's last visit.

**Mechanism:**
- The portal sets a `localStorage` timestamp (`portal:last-library-visit`) when the seeker visits the Library page
- On subsequent visits to any page, the navigation compares the latest book's `created_at` against the stored timestamp
- If a new book exists: a small `--srf-gold` dot (6px) appears beside "Books" in the navigation
- On visiting the Library page: the dot disappears, timestamp updates
- On the Library page itself: new books display a subtle "New" label (Open Sans, `--srf-gold`, `--text-xs`)

**Constraints:**
- The dot is the only indicator. No badge count, no popup, no animation.
- No server interaction — purely client-side comparison
- New visitors (no localStorage) see no indicator (everything is "new" to them)
- The indicator disappears permanently after the seeker visits the Library

### Phase

Phase 5 (when the first new books are added beyond Phase 1's Autobiography).

### Consequences

- Navigation component checks localStorage timestamp against book catalog
- Library page sets timestamp on visit
- Minimal, calm, and respectful of attention
- No tracking of "was the new book noticed" — not measurable, by design

---

## ADR-105: Magazine Integration — Self-Realization Magazine as First-Class Content

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-003 (direct quotes only), ADR-012 (content scope), ADR-024 (API-first), ADR-087 (content hub)

### Context

Self-Realization Magazine, published by SRF since 1925, contains: (1) articles by Paramahansa Yogananda — published teachings with the same sacred text status as his books, (2) articles by SRF monastics — authorized commentary and contemporary guidance, (3) devotee experiences, and (4) organizational news. The magazine represents a significant body of Yogananda's published writings not found in his books.

Additionally, the portal's "What Is Humanity Seeking?" data (ADR-094) is an ideal candidate for a recurring magazine feature, creating a symbiotic relationship between the portal and the magazine.

### Decision

Integrate Self-Realization Magazine as a first-class content type with differentiated treatment by content category:

| Category | Search Index | Theme Tags | Daily Pool | Reader Treatment |
|----------|-------------|------------|------------|-----------------|
| Yogananda's articles | Full (same as books) | Yes | Yes | Full reader with gold quote marks |
| Monastic articles | Filtered (opt-in via `include_commentary` param) | Yes | No | Reader with author byline |
| Devotee experiences | No | No | No | Browsable, not searchable |
| News/editorial | No | No | No | Browsable, archival |

**Core principle:** Yogananda's magazine articles are published teachings — they enter the same chunk/search/theme pipeline as book passages. A seeker searching "how to overcome fear" finds the relevant magazine article alongside book passages, ranked by relevance. The citation adapts: *— Self-Realization Magazine, Vol. 97 No. 2, p. 14*.

### Schema

```sql
CREATE TABLE magazine_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volume INTEGER NOT NULL,
    issue_number INTEGER NOT NULL,
    season TEXT CHECK (season IN ('spring', 'summer', 'fall', 'winter')),
    publication_date DATE NOT NULL,
    title TEXT NOT NULL,
    cover_image_url TEXT,
    editorial_note TEXT,
    language TEXT NOT NULL DEFAULT 'en',
    access_level TEXT NOT NULL DEFAULT 'public'
        CHECK (access_level IN ('public', 'subscriber')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(volume, issue_number)
);

CREATE TABLE magazine_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES magazine_issues(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_type TEXT NOT NULL
        CHECK (author_type IN ('yogananda', 'monastic', 'devotee', 'editorial')),
    position INTEGER NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    access_level TEXT NOT NULL DEFAULT 'public'
        CHECK (access_level IN ('public', 'subscriber')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(issue_id, slug)
);

CREATE TABLE magazine_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES magazine_articles(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    page_number INTEGER,
    embedding VECTOR(1536),
    embedding_model TEXT NOT NULL DEFAULT 'text-embedding-3-small',
    embedding_dimension INTEGER NOT NULL DEFAULT 1536,
    embedded_at TIMESTAMPTZ DEFAULT now(),
    content_tsv TSVECTOR,
    content_hash TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(article_id, chunk_index)
);

CREATE INDEX idx_magazine_chunks_embedding ON magazine_chunks
    USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_magazine_chunks_fts ON magazine_chunks USING GIN (content_tsv);
CREATE INDEX idx_magazine_chunks_language ON magazine_chunks(language);
```

### Navigation

```
Search · Books · Videos · Magazine · Quiet · About
```

"Magazine" added to primary navigation between "Videos" and "Quiet".

### UI Pages

- `/magazine` — Landing page: latest issue (cover + table of contents), browse by year, "Yogananda's Magazine Writings" index
- `/magazine/{year}/{season}` — Single issue: cover, editorial note, article list with author types
- `/magazine/{year}/{season}/{slug}` — Article reader: same reader component as books, with author byline and issue citation

### API Endpoints

```
GET /api/v1/magazine/issues                          → Paginated issue list
GET /api/v1/magazine/issues/{year}/{season}          → Single issue with articles
GET /api/v1/magazine/articles/{slug}                 → Single article with chunks
GET /api/v1/magazine/issues/{year}/{season}/pdf      → Issue PDF (pre-rendered)
GET /api/v1/magazine/articles/{slug}/pdf             → Article PDF
```

### Search Integration

The `hybrid_search` function extends to query `magazine_chunks` where `author_type = 'yogananda'` alongside `book_chunks`. Monastic articles are searchable via an `include_commentary=true` query parameter (default false — Yogananda's words are always primary).

### Magazine ↔ "What Is Humanity Seeking?" Symbiosis

The public `/seeking` dashboard (ADR-094) links to published magazine features: "Read the full analysis in Self-Realization Magazine →". The magazine publishes a curated narrative drawn from the portal's aggregated search data. Each amplifies the other.

### Phase

- Schema and ingestion pipeline: Phase 8 (alongside chapter/book PDF infrastructure)
- Magazine browsing UI: Phase 8
- Search integration (Yogananda's articles): Phase 8
- Magazine ↔ "What Is Humanity Seeking?" symbiosis: Phase 9

### Consequences

- Three new tables: `magazine_issues`, `magazine_articles`, `magazine_chunks`
- `magazine_chunks` participates in `chunk_relations` (or `content_relations` post-Phase 13) graph
- `hybrid_search` extended to include magazine chunks
- Navigation updated: "Magazine" added between "Videos" and "Quiet"
- Magazine ingestion pipeline mirrors book ingestion (PDF → chunk → embed → QA)
- Content availability: depends on SRF providing digital magazine archives
- Access level support: some issues may be subscriber-only (`access_level = 'subscriber'`), gated via Auth0 in Phase 15+
- **Extends ADR-012** (content scope) to include magazine content
- **Extends ADR-024** (API-first) with magazine endpoints

---

## ADR-106: Digital Watermarking Strategy for SRF Images

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-086 (image content type), ADR-045 (SRF imagery strategy), ADR-016 (sacred image guidelines)

### Context

SRF images — particularly guru photographs and archival images of Yogananda — carry deep spiritual significance and organizational branding. ADR-045 establishes visible branding (the SRF lotus mark on OG images, PDF watermarks, and quote cards). But visible marks can be cropped or removed. The portal will serve images globally, and unauthorized reuse, manipulation, or misattribution of sacred images is a real concern for SRF.

### Decision

Adopt a **two-layer watermarking strategy**: visible branding (already established) plus invisible digital watermarking for provenance and attribution tracking.

**Layer 1: Visible branding (existing)**

Already specified in ADR-045 and ADR-059: lotus watermark on PDFs and quote cards, photographer credit on image pages, SRF copyright notice. No changes.

**Layer 2: Invisible watermarking**

Embed imperceptible metadata into all portal-served images that survives common transformations (cropping, resizing, compression, screenshots):

| Technology | Approach | Survives | Cost | Recommendation |
|-----------|----------|----------|------|---------------|
| **Steganographic watermark** | Embed bit pattern in spatial frequency domain (DCT/DWT coefficients) | Crop, resize, moderate JPEG compression, screenshot | Open-source libraries (e.g., `invisible-watermark` Python, `stegano`) | **Recommended for Phase 14** |
| **C2PA / Content Credentials** | W3C standard for content provenance (used by Adobe, Google, BBC). Embeds cryptographically signed metadata about origin, edits, and attribution | Standards-compliant verification tools; visible "Content Credentials" icon in supporting platforms | Open standard, free libraries (`c2patool`) | **Recommended for Phase 14** |
| **Digimarc / commercial DRM** | Enterprise invisible watermarking with commercial detection network | Most transformations; commercial scanning | $$$, enterprise licensing | Not recommended (cost disproportionate to need) |
| **EXIF/XMP metadata** | Standard metadata fields (copyright, author, source URL) | Only survives if metadata not stripped | Free, universal | **Recommended from Phase 2** (baseline, not sufficient alone) |

**Recommended approach — three tiers:**

**Tier 1 (Phase 2): EXIF/XMP metadata on all served images.**
- Copyright: "© Self-Realization Fellowship"
- Source: "teachings.yogananda.org"
- Description: Image caption
- Applied server-side during image processing (S3 upload trigger or ingestion pipeline)
- Limitation: easily stripped by social media platforms and messaging apps

**Tier 2 (Phase 14): C2PA Content Credentials on all guru photographs and archival images.**
- Cryptographically signed provenance chain: "This image originated from the SRF Online Teachings Portal"
- Verifiable via Adobe Content Authenticity Initiative tools and supporting browsers
- The standard is gaining adoption (Adobe Photoshop, Google Search, BBC, Microsoft)
- Applied during image ingestion pipeline (`c2patool` CLI)
- Cost: free (open standard)

**Tier 3 (Phase 14): Steganographic watermark on sacred images (`is_yogananda_subject = true`).**
- Invisible bit pattern embedded in DCT frequency domain
- Survives JPEG compression up to 70% quality, moderate cropping, resizing, and screenshots
- Encodes: image ID, portal URL, and a short provenance string
- Detection: SRF can verify provenance using the extraction tool (a Python script in `/scripts/watermark-verify.py`)
- Applied during image ingestion pipeline (Python Lambda function)
- **Only on sacred images** (guru photographs, Yogananda's personal images) — not on nature photography or UI assets

### Rationale

- **Tier 1 is baseline hygiene.** Every professional image pipeline includes copyright metadata. It's stripped by social platforms but survives email, download, and professional use.
- **Tier 2 (C2PA) is the future.** The web is moving toward content provenance standards. Early adoption positions SRF's images as verifiably authentic — important when AI-generated images of spiritual figures become common.
- **Tier 3 (steganographic) is the safety net.** When someone posts an uncredited Yogananda photograph on social media, SRF can extract the watermark and verify it originated from the portal. This is forensic, not preventive — it proves provenance after the fact.
- **Not DRM.** The portal makes content freely available. Watermarking is about attribution and provenance, not access restriction. Consistent with the mission of spreading the teachings.

### Consequences

- Phase 2: EXIF/XMP metadata injection in image processing pipeline
- Phase 14: C2PA signing and steganographic watermarking in image ingestion Lambda
- `/scripts/watermark-verify.py` tool for SRF to verify image provenance
- Sacred images (`is_yogananda_subject = true` per ADR-086) receive all three tiers
- Non-sacred images receive Tiers 1 and 2 only
- C2PA library (`c2patool`) added as Lambda dependency
- Invisible watermark library (e.g., Python `invisible-watermark`) added as Lambda dependency
- **Extends ADR-086** (image content type) with provenance infrastructure
- **Extends ADR-045** (imagery strategy) from visible branding to invisible verification

---

## ADR-107: Multi-Size Image Serving and Download Options

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-086 (image content type), ADR-106 (digital watermarking), ADR-059 (sharing formats), ADR-083 (PDF generation)

### Context

ADR-086 specifies three responsive image sizes generated at upload time: thumbnail (300px), display (1200px), and full-resolution. This serves the portal's own rendering needs — thumbnails in gallery grids, display sizes in detail pages, full-resolution for lightbox views. But it doesn't address seekers who want to *use* these images elsewhere: devotees who want a high-quality guru portrait for their meditation space desktop wallpaper, center leaders preparing a presentation who need specific dimensions, a temple that wants to print a framed photograph, or a seeker who wants a small version to share in a group chat.

The portal makes Yogananda's teachings freely available. The photographic archive should follow the same principle: freely downloadable at the size that serves the seeker's actual need. Stock photo sites offer multi-size downloads as standard practice. Sacred images deserve at least the same courtesy.

### Decision

Extend ADR-086's responsive serving with **five named size tiers** and a **user-facing download interface** on image detail pages.

**Size tiers:**

| Tier | Name | Max dimension | Use case | Format |
|------|------|--------------|----------|--------|
| `thumb` | Thumbnail | 300px | Gallery grids, chat previews, quick reference | WebP + JPEG fallback |
| `small` | Small | 640px | Social media sharing, messaging apps, email | WebP + JPEG fallback |
| `medium` | Medium | 1200px | Blog posts, presentations, web use | WebP + JPEG fallback |
| `large` | Large | 2400px | Desktop wallpaper, high-DPI displays, large screens | WebP + JPEG fallback |
| `original` | Original | Source dimensions | Print, archival, professional use | Original format (JPEG/TIFF) |

All sizes are generated at ingestion time (not on-demand) to avoid compute overhead on download. The Lambda ingestion pipeline already processes each image for thumbnail and display sizes (ADR-086) — this extends it to produce all five tiers in a single pass using `sharp` (Node.js) or Pillow (Python Lambda).

**Storage layout:**

```
s3://srf-portal-images/
  {image-id}/
    original.jpg          — Source file, untouched
    large.webp            — 2400px max dimension
    large.jpg             — 2400px JPEG fallback
    medium.webp           — 1200px max dimension
    medium.jpg            — 1200px JPEG fallback
    small.webp            — 640px max dimension
    small.jpg             — 640px JPEG fallback
    thumb.webp            — 300px max dimension
    thumb.jpg             — 300px JPEG fallback
```

**Schema extension to `images` table:**

```sql
-- Add size metadata columns (populated during ingestion)
ALTER TABLE images ADD COLUMN sizes JSONB NOT NULL DEFAULT '{}';
-- Example value:
-- {
--   "thumb":    {"width": 300, "height": 200, "url": "/thumb.webp", "bytes": 18200},
--   "small":    {"width": 640, "height": 427, "url": "/small.webp", "bytes": 42100},
--   "medium":   {"width": 1200, "height": 800, "url": "/medium.webp", "bytes": 98500},
--   "large":    {"width": 2400, "height": 1600, "url": "/large.webp", "bytes": 285000},
--   "original": {"width": 4000, "height": 2667, "url": "/original.jpg", "bytes": 1850000}
-- }
```

**API:**

```
GET /api/v1/images/{slug}
  → response includes `sizes` object with all available tiers, dimensions, and byte sizes

GET /api/v1/images/{slug}/download?size=medium&format=jpg
  → Returns a redirect (302) to the CloudFront URL for the requested size and format
  → Valid sizes: thumb, small, medium, large, original
  → Valid formats: webp, jpg (original tier returns source format)
  → Default: medium, webp
  → Response headers: Content-Disposition: attachment; filename="{slug}-{size}.{ext}"
```

**Frontend — download UI on `/images/[slug]`:**

The image detail page includes a "Download" section below the image viewer:

```
┌─────────────────────────────────────────────────┐
│  [Full image view with lightbox]                │
│                                                  │
│  Caption · Photographer · Era · Collection       │
│                                                  │
│  Download                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  Small   │ │  Medium  │ │  Large   │        │
│  │ 640×427  │ │ 1200×800 │ │ 2400×1600│        │
│  │  42 KB   │ │  98 KB   │ │  285 KB  │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│  ┌──────────┐ ┌──────────────────────┐          │
│  │ Original │ │  Format: WebP ▾      │          │
│  │ 4000×2667│ └──────────────────────┘          │
│  │  1.8 MB  │                                    │
│  └──────────┘                                    │
│                                                  │
│  © Self-Realization Fellowship                   │
│  Free for personal and devotional use.           │
│  Please credit: teachings.yogananda.org          │
└─────────────────────────────────────────────────┘
```

- Each size tier is a button showing dimensions and file size
- A format toggle (WebP / JPEG) applies to all size buttons
- "Original" always downloads in the source format
- A brief attribution line appears below the download options — not a license wall, not a gate
- Sacred images (`is_yogananda_subject = true`) include a gentle note: "This sacred photograph is shared freely for devotional and educational purposes."

**Watermarking integration (ADR-106):**

- All generated sizes receive Tier 1 EXIF/XMP metadata (Phase 2)
- Sizes `medium`, `large`, and `original` receive Tier 2 C2PA Content Credentials (Phase 14)
- `original` size of sacred images additionally receives Tier 3 steganographic watermark (Phase 14)
- `thumb` and `small` are too small for reliable steganographic embedding — they receive EXIF/XMP and C2PA only

### Rationale

- **Five tiers cover real-world use cases.** Thumbnail for reference, small for messaging, medium for web/presentations, large for high-DPI displays and wallpapers, original for print. This eliminates the awkward "right-click save" workflow where seekers get whatever size the browser rendered.
- **Pre-generated, not on-demand.** On-demand resizing adds latency, compute cost, and cache complexity. The image archive is finite and grows slowly (curated by editors). Generating all sizes at ingestion is the simpler, more predictable approach for a 10-year horizon.
- **WebP + JPEG dual format.** WebP offers ~30% smaller files for the same quality. JPEG fallback for older browsers and systems that don't support WebP. The format toggle respects seeker choice.
- **Download endpoint with Content-Disposition.** A dedicated download endpoint (not just a direct image URL) allows proper filename formatting, download tracking via Amplitude (anonymous: `image_downloaded` event with size tier, no user identification), and future rate limiting if needed.
- **Attribution, not restriction.** The portal's mission is to spread the teachings freely. The attribution line is a gentle request, not a license gate. No click-through agreements, no watermark-over-face, no resolution limits behind sign-up walls.

### Consequences

- Image ingestion Lambda extended to produce 5 size tiers (was 3) in dual format (WebP + JPEG)
- S3 storage per image increases from ~3 files to ~9 files; acceptable given curated archive size
- `images.sizes` JSONB column added to Phase 14 migration
- New download API endpoint: `GET /api/v1/images/{slug}/download`
- Image detail page (`/images/[slug]`) gains download section with size selector
- Amplitude event: `image_downloaded` with properties `{size, format}` (no user identification — DELTA compliant, ADR-029)
- **Extends ADR-086** (image content type) from 3 responsive sizes to 5 named download tiers
- **Extends ADR-106** (digital watermarking) with per-tier watermarking rules

---

## ADR-108: Phase 1 Bootstrap Ceremony

**Status:** Accepted

**Date:** 2026-02-20

### Context

The portal's architecture is thoroughly documented across four design documents (CONTEXT.md, DESIGN.md, DECISIONS.md, ROADMAP.md), but the path from "no code" to "running system" was undocumented. The first developer experience — creating the repository, provisioning infrastructure, running the first migration, ingesting the first book, and verifying search works — is a critical ceremony that, if not specified, leads to inconsistent environments and wasted time.

### Decision

Document the Phase 1 bootstrap sequence as a reproducible, ordered ceremony in DESIGN.md § Phase 1 Bootstrap. The ceremony covers:

1. **Repository creation** — Next.js + TypeScript + Tailwind + pnpm
2. **Neon project provisioning** — PostgreSQL with pgvector, dev branch for local work
3. **Schema migration** — dbmate applies `001_initial_schema.sql` (all tables, indexes, functions, triggers)
4. **Vercel deployment** — Link repo, set environment variables, verify health check
5. **Sentry configuration** — Error tracking with source maps
6. **First content ingestion** — Autobiography of a Yogi: PDF → chunks → embeddings → relations
7. **Smoke test** — Search "How do I overcome fear?" returns relevant passages with citations

The `.env.example` file documents all required environment variables with comments explaining each.

### Rationale

- **Reproducibility.** Any developer (or AI assistant) should be able to go from zero to working search in a single session by following the ceremony.
- **Environment parity.** Explicit variable documentation prevents "works on my machine" drift.
- **10-year horizon (ADR-033).** The bootstrap ceremony is a durable artifact — it outlives any individual contributor's tribal knowledge.
- **Design-to-implementation bridge.** The four design documents describe *what* the system does. The bootstrap ceremony describes *how to bring it into existence*.

### Consequences

- DESIGN.md gains a "Phase 1 Bootstrap" section with the step-by-step ceremony and `.env.example` contents
- First-time setup is documented and reproducible
- Onboarding new developers or AI assistants requires reading CLAUDE.md (for context) and following the bootstrap ceremony (for setup)

---

## ADR-109: Single-Database Architecture — No DynamoDB

**Status:** Accepted

**Date:** 2026-02-20

### Context

SRF's established technology stack includes both Neon (serverless PostgreSQL) and DynamoDB. Other SRF properties use DynamoDB for high-throughput key-value patterns such as session storage and real-time counters. The question arose whether the teachings portal should also incorporate DynamoDB for consistency with the broader SRF ecosystem.

### Decision

The teachings portal uses **Neon PostgreSQL exclusively** as its database layer. DynamoDB is not used.

### Alternatives Considered

1. **DynamoDB for search query logging** — At ~1,000 searches/day (~73 MB/year), PostgreSQL handles this trivially. DynamoDB's write throughput advantage is irrelevant at this scale.
2. **DynamoDB for session storage** — The portal has no user sessions until Phase 15, and Auth0 handles session management. No application-level session store is needed.
3. **DynamoDB for rate limiting counters** — Cloudflare WAF handles edge-layer rate limiting. Application-layer limits use in-memory counters in Vercel Functions (acceptable for serverless, no shared state needed).
4. **DynamoDB for caching** — Cloudflare CDN and browser `Cache-Control` headers handle all caching needs. Adding a separate cache database adds complexity without measurable benefit.

### Rationale

- **The data model is fundamentally relational.** Books → chapters → chunks → topics with many-to-many relationships, cross-references, editorial threads, and chunk relations. This is PostgreSQL's strength. Shoehorning relational data into DynamoDB's key-value model would require denormalization and access pattern planning that adds complexity without benefit.
- **pgvector eliminates the separate vector store.** Embeddings, full-text search, and relational data coexist in a single database. Adding DynamoDB would mean splitting data across two stores with consistency challenges.
- **Single database simplifies operations.** One backup strategy (ADR-072), one connection configuration, one migration tool (dbmate), one monitoring target. Two databases means two of everything.
- **10-year architecture horizon (ADR-033).** Every dependency is a 10-year maintenance commitment. DynamoDB would add: AWS SDK dependency, IAM configuration, separate Terraform module, separate monitoring, separate backup strategy, and cross-database consistency logic — all for zero functional gain.
- **Scale profile doesn't warrant it.** The portal serves spiritual seekers, not e-commerce transactions. Peak load is modest. PostgreSQL with Neon's serverless autoscaling handles the portal's read-heavy, moderate-write workload comfortably.
- **SRF ecosystem alignment is about patterns, not tools.** The portal aligns with SRF's tech stack in framework (Next.js), hosting (Vercel), database vendor (Neon), identity (Auth0), and observability (Sentry, New Relic, Amplitude). Using the same vendor (Neon/PostgreSQL) for a different access pattern (relational + vector) is good engineering, not deviation.

### Consequences

- All data lives in Neon PostgreSQL: content, embeddings, search indexes, analytics, configuration
- Single backup target, single migration tool, single connection strategy
- Terraform infrastructure is simpler (no DynamoDB module, no IAM policies for cross-service access)
- If SRF's DynamoDB usage evolves to include a pattern the portal genuinely needs (e.g., real-time collaborative features in future phases), this decision can be revisited via a new ADR
- Developers familiar with SRF's DynamoDB patterns should note: the portal's data model is relational by nature, and the single-database approach is an intentional architectural strength

---

## ADR-110: AWS Bedrock Claude with Model Tiering

**Status:** Accepted

**Date:** 2026-02-20

### Context

The portal uses Claude for three distinct search tasks: intent classification, query expansion, and passage ranking (ADR-003, ADR-049). At scale (projected 10,000+ searches/day), API costs become a significant operational concern for a free portal funded by a philanthropist. Additionally, SRF's established technology stack is AWS-centric — the question arose whether to use the Anthropic API directly or AWS Bedrock as the Claude provider.

### Decision

1. **Use AWS Bedrock** as the Claude API provider instead of the direct Anthropic API.
2. **Use Claude Haiku** as the default model for all three search tasks (intent classification, query expansion, passage ranking).
3. **Benchmark Haiku vs Sonnet** during Phase 1 using a test set of ~50 curated queries. If Haiku passage ranking quality falls below acceptable thresholds, promote passage ranking to Sonnet while keeping intent classification and query expansion on Haiku.

### Model Tiering Strategy

**Per-search tasks (real-time, cost-sensitive):**

| Task | Model | Fallback | Quality Sensitivity | Volume |
|------|-------|----------|-------------------|--------|
| Intent classification | Haiku | None (skip on failure) | Low — simple categorization | Every search |
| Query expansion | Haiku | None (skip, use raw query) | Medium — vocabulary breadth | Every complex search |
| Passage ranking | Haiku (promote to Sonnet if benchmarks warrant) | Skip (use RRF scores) | High — determines result quality | Every search with candidates |

**Offline batch tasks (run once per content, quality over cost):**

| Task | Model | Rationale | Phase |
|------|-------|-----------|-------|
| Theme taxonomy classification | Opus | Classifying chunks across multi-category spiritual taxonomy requires deep comprehension of Yogananda's teachings | 5 |
| Ambiguous chunk classification | Opus | Edge cases near classification thresholds benefit from nuanced reasoning | 1+ (ingestion) |
| Reference extraction (scriptures, persons, places) | Opus | Identifying cross-tradition references (Bible, Bhagavad Gita, scientific texts) across Yogananda's writing requires broad knowledge | 7 |
| UI translation drafting | Opus | Devotional register in 8+ languages requires precise tone; human review follows (ADR-023) | 11 |
| Cross-book relationship mapping | Opus | Identifying thematic connections across the full library requires deep reading comprehension | 6–7 |

Batch tasks are configured via `CLAUDE_MODEL_BATCH` environment variable (defaults to Opus). Cost is negligible: ~$2–5 per full book processed, run once per content change.

### Cost Projection

**Per-search (recurring, scales with traffic):**

| Scenario | Per-search cost | Monthly at 10K/day |
|----------|-----------------|-------------------|
| All Haiku | ~$0.001 | ~$300 |
| Tiered (Haiku + Sonnet ranking) | ~$0.005 | ~$1,500 |
| All Sonnet | ~$0.01 | ~$3,000 |
| Opus ranking (rejected) | ~$0.025 | ~$7,500 |

**Offline batch (one-time per content, negligible ongoing cost):**

| Task | Cost per book | When |
|------|--------------|------|
| Theme classification (Opus) | ~$2–5 | Once per book ingestion |
| Reference extraction (Opus) | ~$1–3 | Once per book ingestion |
| UI translation drafting (Opus) | ~$0.50 per locale | Once per locale addition |

### Alternatives Considered

1. **Direct Anthropic API** — Simpler initial setup, day-one access to new model releases. Rejected because: SRF already has AWS billing, support contracts, and IAM infrastructure. A separate Anthropic contract adds vendor management overhead for zero functional gain. New model releases are irrelevant — the portal's librarian tasks are well-defined and stable.
2. **All Sonnet** — Higher baseline quality for ranking. Rejected because: 10x cost increase over Haiku at scale. The portal's ranking task is constrained (select and order passage IDs from 20 candidates) — not open-ended reasoning. Haiku is likely sufficient; benchmark first.
3. **Opus for intent classification** — Considered whether Opus's deeper reasoning would improve classification accuracy. Rejected because: intent classification is bounded enum categorization (~7 types). The input is a short user query, the output is structured JSON. Haiku reaches the quality ceiling for this task; additional model capability has nowhere to go.
4. **Opus for passage ranking** — Considered whether Opus would better understand subtle spiritual nuance when ordering passages (e.g., distinguishing "divine fulfillment" from "renunciation" for "I feel empty inside"). Rejected because: the ranker receives 20 pre-retrieved passages already filtered by vector similarity + FTS relevance. It selects the top 5 and outputs ordered passage IDs — a constrained selection task, not open-ended reasoning. The heavy semantic lifting is done by the hybrid search layer, the spiritual-terms.json vocabulary bridge, and well-crafted system prompts with explicit ranking criteria (spiritual depth, directness of address, emotional resonance). The quality difference between models narrows significantly when the task is structured, the output format is constrained, and the candidate pool is pre-filtered. At ~$7,500/month for ranking alone (10K searches/day), the cost is unjustifiable for a free portal when architecture already ensures relevant results. **Opus is appropriate for offline batch work** (editorial analysis, theme taxonomy construction, cross-book relationship mapping) — low-volume, high-reasoning tasks — but not per-search costs.
5. **OpenAI GPT models** — Could reduce vendor count (already using OpenAI for embeddings). Rejected because: Claude's instruction-following and constrained output format are well-suited to the librarian pattern. Switching LLM providers for cost reasons alone adds migration risk. ADR-003 established Claude; no reason to revisit.

### Rationale

- **AWS alignment.** SRF's stack is AWS-native (ADR-109 notes this). Bedrock means consolidated billing, VPC endpoints (API traffic stays off the public internet), IAM-based access control, and existing AWS support contracts. No separate Anthropic API key management.
- **Committed throughput pricing.** Bedrock offers provisioned throughput for predictable costs at scale — important for a free portal with no revenue to absorb cost spikes.
- **Operational simplicity.** One cloud provider for compute (Vercel deploys to AWS), database (Neon), and AI (Bedrock). Terraform manages Bedrock model access alongside other AWS resources.
- **Haiku-first is prudent.** The portal's Claude tasks are tightly constrained: classify intent (enum output), expand terms (JSON array output), rank passages (ordered ID list output). These are not open-ended generation tasks. Haiku handles structured, bounded tasks well.
- **Benchmark before promoting.** Rather than assuming Sonnet is needed for ranking, measure first. The Phase 1 test set provides empirical data. If Haiku ranks comparably, the portal saves ~$1,200/month at 10K searches/day.
- **10-year horizon (ADR-033).** AWS Bedrock is a managed service with AWS's long-term commitment. The portal's `/lib/services/claude.ts` abstracts the provider — switching from Bedrock to direct API (or vice versa) requires changing the SDK client, not the business logic.
- **Graceful degradation is provider-agnostic.** The four-level degradation cascade (DESIGN.md § Claude API Graceful Degradation) works identically regardless of whether Claude is accessed via Bedrock or direct API. Timeouts, errors, and budget caps trigger the same fallthrough.

### Consequences

- `/lib/services/claude.ts` uses `@aws-sdk/client-bedrock-runtime` instead of the Anthropic SDK
- `.env.example` changes: replace `ANTHROPIC_API_KEY` with `AWS_REGION` + IAM role (Bedrock access managed via IAM, not API keys)
- Terraform includes a Bedrock model access module
- Per-search model IDs configured via `CLAUDE_MODEL_CLASSIFY`, `CLAUDE_MODEL_EXPAND`, `CLAUDE_MODEL_RANK` (default: Haiku)
- Batch model ID configured via `CLAUDE_MODEL_BATCH` (default: Opus) — used by theme classification, reference extraction, translation drafting, and cross-book relationship mapping
- Phase 1 includes a ranking benchmark task: 50 curated queries, compare Haiku vs Sonnet ranking quality, decide promotion
- New model versions (e.g., Haiku 4.0) are available on Bedrock days/weeks after direct API release — acceptable for a portal that values stability over cutting-edge
- If Bedrock pricing or availability changes unfavorably, switching to direct Anthropic API requires only SDK client changes in `/lib/services/claude.ts` — business logic and degradation cascade are unaffected

---

## ADR-111: Study Workspace — Universal Teaching Tools Without Authentication

**Status:** Accepted (supersedes ADR-077)
**Date:** 2026-02-20
**Deciders:** Architecture team
**Context:** ADR-077 (Talk Preparation Workspace — now superseded), ADR-003 (AI as librarian), ADR-041 (Lotus Bookmarks — localStorage pattern), ADR-075 (Study Guide View)

### Context

ADR-077 designed the Talk Preparation Workspace as an Auth0-protected area for SRF monastics and meditation center leaders. But anyone who engages deeply with Yogananda's teachings benefits from the same capabilities: passage collection, teaching arc assembly, and export. Study circle leaders, yoga teachers, home meditators preparing personal devotional readings, parents selecting passages for their children, chaplains building comfort packages — these users need the same tools as monastics.

Authentication was only required because ADR-077 assumed server-side persistence of saved outlines. But the portal already solved persistence without accounts: Phase 4 bookmarks (ADR-041) use localStorage. The same pattern works here.

| Approach | Pros | Cons |
|----------|------|------|
| **Auth-protected (ADR-077)** | Server-side persistence, cross-device sync | Excludes lay users, requires account creation for a composition tool, delays availability to Phase 15+ |
| **localStorage-only, public** | Universal access, no account friction, ships with Phase 8 | No cross-device sync until Phase 15, data lost on browser clear |
| **Hybrid: localStorage default, optional server sync** | Best of both — universal access now, enhanced persistence for logged-in users later | Slightly more complex migration path |

### Decision

Rename "Talk Preparation Workspace" to **"Study Workspace."** Make it public at `/study` — no authentication required. All state persisted in localStorage. Export (PDF, presentation mode, plain text) works without accounts.

**Workflow** (unchanged from ADR-077 except for auth removal):

1. **Theme Exploration.** The user enters a theme or question. The system uses the existing search API to surface relevant passages across all books.
2. **Passage Collection.** Selected passages are added to a working collection stored in localStorage. Each item retains full citation (book, chapter, page). Notes can be attached per passage.
3. **Teaching Arc Assembly.** Collected passages are arranged into a narrative sequence. The user drags passages into sections (e.g., "Opening," "Core Teaching," "Practice," "Closing"). Section headings and personal notes are freeform text, clearly distinguished from Yogananda's words.
4. **Export.** The assembled outline exports as print PDF, presentation mode, or plain text.
5. **Persistence.** localStorage by default. Phase 15 adds optional server sync for logged-in users (same migration pattern as bookmarks).

### Data Model

The server-side schema (for Phase 15 sync) renames the ADR-077 tables:

```sql
CREATE TABLE study_outlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,                         -- nullable: null = localStorage-only, populated on Phase 15 sync
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE study_outline_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outline_id UUID NOT NULL REFERENCES study_outlines(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    speaker_notes TEXT,                   -- user's personal notes (NOT Yogananda's words)
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE study_outline_passages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES study_outline_sections(id) ON DELETE CASCADE,
    chunk_id UUID NOT NULL REFERENCES book_chunks(id),
    personal_note TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_study_outlines_user ON study_outlines(user_id)
    WHERE user_id IS NOT NULL;
```

The localStorage schema mirrors this structure as JSON, enabling clean migration to server storage when accounts arrive.

### Rationale

- **Serves the broadest audience.** Monastics are a vital but small user group. Lay devotees preparing study circle readings, yoga teachers building class themes, chaplains selecting comfort passages — these are potentially thousands of weekly users. Gating the tool behind authentication excludes the majority.
- **Consistent with portal philosophy.** "All content freely available" extends to tools, not just reading. No "sign up to access" gates (CLAUDE.md constraint #10).
- **localStorage precedent.** Phase 4 bookmarks (ADR-041) established the pattern: localStorage for persistence, optional server sync in Phase 15. The Study Workspace follows the same lifecycle.
- **No new content created.** The workspace assembles existing indexed passages. The user's own notes are clearly separated. This respects ADR-003.

### Consequences

- `/prepare` route → `/study` route throughout all documentation
- `robots.txt` no longer blocks `/study/` (it's a public feature, not a staff tool)
- ROADMAP deliverable 8.4 updated
- Phase 15 server sync includes study outlines alongside bookmarks
- ADR-077 status updated to "Superseded by ADR-111"

---

## ADR-112: "The Librarian" — AI Search Brand Identity

**Status:** Accepted
**Date:** 2026-02-20
**Deciders:** Architecture team
**Context:** ADR-003 (Direct Quotes Only — No AI Synthesis), ADR-049 (Claude AI Usage Policy)

### Context

ADR-003 establishes "the AI is a librarian, not an oracle" as a fundamental constraint. This is primarily treated as a technical guardrail — the system must never generate, paraphrase, or synthesize Yogananda's words. But in a world where every AI product generates plausible content, the portal's refusal to generate is not just a constraint — it is a radical differentiator.

When a seeker uses ChatGPT, Perplexity, or Google's AI Overview to ask about Yogananda's teachings, they get synthesized summaries that may misrepresent his words. The portal is the only place where the AI system says: "I will show you his actual words, and nothing else."

### Decision

Adopt **"The Librarian"** as the external brand identity for the portal's AI search capability.

**Implementation:**
- The About page (Phase 2) explains: "This is not an AI that speaks for Yogananda. It is a librarian that finds his words for you. Every passage you see is exactly as he wrote it."
- The `llms.txt` file (Phase 2) includes: "This portal uses AI as a librarian, not a content generator. All results are verbatim passages from Yogananda's published works."
- Stakeholder communications use "The Librarian" language when describing the AI search.
- The search results page may include a subtle footer: "Every passage shown is Yogananda's own words."

### Rationale

- **Trust-building with the SRF community.** Many SRF devotees are legitimately suspicious of AI involvement with sacred texts. "The Librarian" framing immediately communicates that the AI serves the text, not the other way around.
- **Differentiation.** No competitor offers this guarantee. Google synthesizes. ChatGPT paraphrases. This portal finds. The constraint becomes the value proposition.
- **Theological alignment.** In the guru-disciple tradition, a librarian who faithfully preserves and retrieves the guru's words is a service role. It doesn't claim authority; it facilitates access.

### Consequences

- About page copy includes "The Librarian" explanation (Phase 2)
- `llms.txt` includes librarian framing (Phase 2)
- No architectural changes — this is branding over an existing technical constraint
- Marketing materials and stakeholder presentations use this language

---

## ADR-113: "What Is Humanity Seeking?" as Strategic Communications Asset

**Status:** Accepted
**Date:** 2026-02-20
**Deciders:** Architecture team
**Context:** ADR-068 (Anonymized Search Intelligence), ADR-094 (Public-Facing Dashboard), ROADMAP Phase 16 (16.8 Annual Report)

### Context

ADR-068 designs anonymized search theme aggregation. ADR-094 designs a public-facing dashboard. Phase 16 describes an annual curated narrative report. These are treated as features to build. But the concept — "What Is Humanity Seeking?" — has value beyond the portal itself. It could become the philanthropist's foundation's signature thought-leadership asset.

Imagine: an annual report titled *"What Is Humanity Seeking?"* based on anonymized search data from seekers worldwide. Distributed to consciousness research institutions, cited by journalists covering spirituality trends, referenced by interfaith organizations. The data is unique — no other source aggregates spiritual seeking patterns across languages and geographies with this level of intentionality.

### Decision

Treat "What Is Humanity Seeking?" as a **foundation-level communications strategy**, not just a Phase 7 dashboard feature. The dashboard (Phase 7) and annual report (Phase 16) are technical implementations; the communications strategy should be socialized with the philanthropist's foundation earlier.

**Strategic considerations:**
- Standalone subdomain: `seeking.yogananda.org`
- Beautifully designed annual PDF report (not just a web dashboard)
- Partnership with consciousness research institutions
- Media syndication to publications covering spirituality/wellness
- Integration with Self-Realization Magazine editorial planning (ADR-105)
- The philanthropist's foundation as named publisher of the annual report

### Rationale

- **Unique data asset.** No other organization captures spiritual seeking patterns with this intentionality and this privacy posture (DELTA-compliant, no individual tracking).
- **Mission amplification.** The report answers the philanthropist's original question: "What is the state of human consciousness?" — not abstractly, but empirically.
- **Portal awareness.** The annual report drives discovery of the portal itself. A journalist writing about the report links to the portal.

### Consequences

- Add stakeholder open question in CONTEXT.md
- Communications planning is a non-technical workstream — no code changes required
- Phase 7 dashboard implementation unchanged
- Phase 16 annual report implementation unchanged

---

## ADR-114: Grief and Loss as Primary Empathic Entry Point

**Status:** Accepted
**Date:** 2026-02-20
**Deciders:** Architecture team
**Context:** ADR-035 ("Seeking..." Empathic Entry Points), ADR-048 (Teaching Topics — Semi-Automated Tagging Pipeline), ADR-058 (Exploration Theme Categories)

### Context

ADR-035's "Seeking..." entry points include "Comfort after loss," and the six quality themes (Peace, Courage, Healing, Joy, Purpose, Love) are prominent. But grief — the experience of losing someone — is arguably the single most common reason a person turns to spiritual literature for the first time. Someone who has just lost a parent, a spouse, a child searches not for "peace" or "healing" in the abstract, but for answers to primal questions: Is the soul immortal? Will I see them again? Why do we suffer? How do I go on?

Yogananda wrote extensively about death, the afterlife, the immortal soul, and consolation for the bereaved. This is among the richest veins in the corpus. A seeker Googling "what happens after death Yogananda" or "Yogananda on death of a loved one" should find the portal as the definitive resource.

### Decision

Elevate grief and loss to a **primary situation theme** with a dedicated theme page (`/themes/grief`). This is not a replacement for the "Comfort after loss" entry point in ADR-035 — that entry point remains as a zero-friction doorway from the homepage. The theme page provides the deeper, richer experience.

**Theme page content:**
- Passages on the immortality of the soul
- Passages on reunion after death
- Passages on the purpose of suffering
- Passages offering direct consolation
- Cross-references to the Quiet Corner (contemplative pause)
- "Go Deeper" signpost to SRF meditation resources

**SEO strategy:**
- Target queries: "Yogananda on death," "what happens after death Yogananda," "spiritual comfort after losing someone," "soul immortality Yogananda"
- JSON-LD structured data on the theme page
- The theme page as a primary SEO entry point (same strategy as other themes, but with higher search volume potential)

### Rationale

- **Meets the highest-need seeker.** The person in deepest pain deserves the richest experience, not just a search results page.
- **SEO high-impact.** Grief-related spiritual queries have significant search volume and low competition from authoritative sources. The portal can own this space.
- **Corpus strength.** Yogananda's writing on death and the afterlife is among his most powerful and distinctive. This theme showcases the corpus at its best.
- **Mission alignment.** "Signpost, not destination" — the grief theme page naturally points toward meditation, the Quiet Corner, and SRF's community resources as paths through grief.

### Consequences

- Phase 5 theme taxonomy adds "Grief & Loss" as a situation theme alongside Peace, Courage, etc.
- Theme tagging pipeline (ADR-048) includes grief-related terms in the embedding similarity search
- SEO strategy (Phase 2) targets grief-related spiritual queries
- The "Comfort after loss" entry point in ADR-035 links to `/themes/grief` rather than a generic search query once the theme page exists

---

## ADR-115: Chunking Strategy Specification

**Status:** Accepted
**Date:** 2026-02-20
**Deciders:** Architecture team
**Context:** ADR-001 (pgvector), ADR-006 (Hybrid Search), ADR-032 (Embedding Model Versioning), ADR-074 (Side-by-Side Commentary View)

### Context

DESIGN.md specifies chunk relations, storage, embedding, and search in detail. ROADMAP mentions "chunk by paragraphs" (Phase 1) and "verse-aware chunking" (Phase 7). But no document formally defines the chunking algorithm — the single most important factor in search retrieval quality. A bad chunking strategy produces orphaned fragments (too small) or imprecise retrieval (too large). Yogananda's prose style varies dramatically: terse aphorisms in *Sayings*, flowing narrative in *Autobiography*, verse-by-verse commentary in *The Second Coming of Christ*, guided affirmations in *Scientific Healing Affirmations*.

### Decision

Document the chunking strategy as a formal specification. The strategy has two tiers: default (narrative prose) and verse-aware (scriptural commentary).

**Default Chunking (Phases 1–6: narrative, collected talks, short works):**
- **Unit:** Paragraph (defined by typographic paragraph breaks in the source text)
- **Token range:** 100–500 tokens (target: 200–300)
- **Minimum:** Paragraphs below 100 tokens are merged with the following paragraph to avoid orphaned fragments
- **Maximum:** Paragraphs exceeding 500 tokens are split at sentence boundaries, with the split point chosen to keep both halves above 100 tokens
- **Overlap:** None. Paragraph boundaries are natural semantic boundaries in Yogananda's prose. Overlap introduces duplicate content in search results with no retrieval quality gain for this corpus.
- **Metadata preserved per chunk:** book_id, chapter_id, paragraph_index (position within chapter), page_number (from source), language

**Special handling:**
- **Epigraphs and poetry:** Kept as single chunks regardless of length. Splitting a poem mid-stanza destroys meaning.
- **Lists and enumerations:** Kept as single chunks. Yogananda's numbered instructions and lists of spiritual qualities are semantically atomic.
- **Dialogue and quoted speech:** Kept as single chunks when the dialogue forms a continuous exchange. Long dialogues (>500 tokens) split at speaker changes, not mid-speech.
- **Aphorisms (*Sayings*, *Scientific Healing Affirmations*):** Each standalone saying or affirmation is one chunk, regardless of length. These books are already atomically organized.
- **Chapter titles and section headers:** Not chunked separately. Prepended to the first paragraph of their section as metadata context.

**Verse-Aware Chunking (Phase 7: *Second Coming of Christ*, *God Talks With Arjuna*, *Wine of the Mystic*):**
- **Unit:** Verse-commentary pair. Each scripture verse and its associated commentary form a single chunk, maintaining the interpretive relationship.
- **Long commentaries:** If a verse's commentary exceeds 500 tokens, split at paragraph boundaries within the commentary. Each sub-chunk retains the verse text as a prefix (ensuring the verse context travels with every fragment of commentary).
- **Cross-reference:** Each verse-commentary chunk stores the verse reference (e.g., "Bhagavad Gita IV:7") as structured metadata for the side-by-side commentary view (ADR-074).

**Per-language validation (Phase 11):**
- English-calibrated chunk sizes (200–300 tokens) may produce different semantic density across scripts. CJK tokenization differs significantly from Latin scripts. Validate retrieval quality per language before committing to chunk sizes. Adjust token ranges per language if necessary.

### Rationale

- **Paragraph as natural unit.** Yogananda's prose is well-structured with clear paragraph breaks that correspond to idea boundaries. Unlike web content or academic papers, his paragraphs rarely span multiple topics.
- **No overlap avoids duplicate noise.** In information retrieval, overlap helps when chunk boundaries are arbitrary (e.g., fixed-window chunking). With paragraph-based chunking, boundaries are meaningful — overlap would surface the same passage twice in search results.
- **Special handling preserves meaning.** A poem split mid-stanza, a list split mid-enumeration, or a verse separated from its commentary would produce chunks that misrepresent the teaching.
- **Token range is empirical.** The 200–300 target is based on retrieval research showing this range balances specificity (finding the right passage) with context (the passage makes sense in isolation). Phase 1 validates this against the Autobiography.

### Consequences

- New "Chunking Strategy" section in DESIGN.md
- Phase 1 ingestion script (1.2) implements default chunking per this specification
- Phase 7 verse-aware chunking (7.2) implements the verse-commentary pair strategy
- Phase 11 per-language chunk size validation (11.10) uses this specification as the baseline
- Search quality evaluation (1.11) implicitly validates the chunking strategy — poor results trigger chunking reassessment

---

## ADR-116: DELTA-Compliant Seeker Feedback Mechanism

**Status:** Accepted
**Date:** 2026-02-20
**Deciders:** Architecture team
**Context:** ADR-014 (DELTA Boundaries), ADR-029 (Observability Strategy), ADR-064 (Staff Experience Architecture)

### Context

DELTA-compliant analytics intentionally avoid user identification and behavioral profiling. This is correct. But the current architecture has no mechanism for seekers to communicate *anything* back to the portal team. No feedback form, no citation error reporting, no "I couldn't find what I needed" signal.

This creates a blind spot: the editorial team has no qualitative signal about the seeker experience. Anonymized search aggregates (ADR-068) show *what* people search for, but not *whether they found it useful.* A seeker who discovers a citation error has no way to report it. A seeker whose search returns nothing relevant has no way to signal that the search failed.

### Decision

Add three DELTA-compliant feedback mechanisms. None store user identifiers. All feed into the editorial review queue (ADR-064).

**1. "Report a citation error"** — link on every passage display (search results, reader, passage share page). Clicking opens a minimal form: passage ID (auto-filled), freeform text describing the error. Stored with passage_id and content only — no user ID, no IP, no session.

**2. "I didn't find what I needed"** — option on search results pages when results are empty or sparse. Clicking stores the search query and an anonymous counter increment. No user ID, no freeform text (to avoid PII collection). Aggregated weekly for search quality review.

**3. `/feedback` page** — linked from the footer. Simple form: topic (dropdown: "Citation error," "Search suggestion," "General feedback," "Accessibility issue"), freeform text. No authentication, no user identifier stored.

**Data model:**

```sql
CREATE TABLE seeker_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_type TEXT NOT NULL CHECK (feedback_type IN (
        'citation_error', 'search_miss', 'general', 'accessibility'
    )),
    content TEXT,                          -- freeform description (nullable for search_miss)
    passage_id UUID REFERENCES book_chunks(id),  -- for citation errors
    search_query TEXT,                     -- for search misses
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_feedback_type ON seeker_feedback(feedback_type, created_at DESC);
```

**API route:** `POST /api/v1/feedback` — rate-limited (5 submissions per IP per hour to prevent spam, but IP is not stored in the database).

**Editorial integration:** Feedback appears in the editorial review portal (Phase 5) as a "Seeker Feedback" queue, alongside theme tag review and ingestion QA.

### Rationale

- **DELTA-compliant.** No user identification stored. No session tracking. No behavioral profiling. The feedback table stores content about the *portal*, not about the *seeker*.
- **Closes a dangerous blind spot.** Without feedback, citation errors persist undetected. Bad search results go unreported. The editorial team operates without qualitative signal.
- **Low implementation cost.** One table, one API route, one review queue panel. No new infrastructure.
- **Respects seeker agency.** The seeker chooses to communicate. No prompts, no pop-ups, no "How was your experience?" interruptions. The link is quiet and available.

### Consequences

- New `seeker_feedback` table in Phase 5 migration
- New API route `POST /api/v1/feedback`
- Feedback review queue added to editorial portal (Phase 5, deliverable 5.10a)
- Footer gains `/feedback` link (Phase 5)
- Every passage display gains "Report a citation error" link (Phase 5)
- Search results page gains "I didn't find what I needed" option when results are sparse (Phase 5)

---

## ADR-117: "Following the Thread" — Named Graph Traversal Experience

**Status:** Accepted
**Date:** 2026-02-20
**Deciders:** Architecture team
**Context:** ADR-034 (Related Teachings — Pre-Computed Chunk Relations), ADR-062 (Reading Focus Detection), ADR-054 (Editorial Reading Threads)

### Context

Phase 6 enables the portal's most distinctive capability: graph traversal across the teaching corpus. A reader in one book sees related passages from other books in the side panel. Clicking one navigates to the new context, where the side panel updates again — revealing new connections. The reader follows a chain of meaning across the entire library, guided by semantic relationships that no physical book can surface.

This experience is described technically in DESIGN.md and ROADMAP.md but has no user-facing name. In the UI, it appears as "Related Teachings" with clickable links. But the *experience* of following connections across books is the portal's killer feature — the answer to "why build this instead of just putting PDFs online?" It deserves a name that communicates its nature to seekers.

### Decision

Name the graph traversal experience **"Following the Thread."**

**Usage:**
- In the Related Teachings side panel: "Follow the Thread →" link on related passages
- In the reader's keyboard shortcut help overlay: `r` = "Related / Follow the Thread"
- In marketing materials and the About page: "Following the Thread — discover how Yogananda's teachings connect across books"
- In editorial reading threads (ADR-054): the curated threads are explicitly named instances of this concept

**Name rationale:** "Thread" echoes multiple contemplative traditions:
- The Sufi concept of the "thread of connection" between teachings
- Ariadne's thread — a guide through the labyrinth
- The common English metaphor of "following a thread of thought"
- The Sanskrit *sutra* (literally "thread") — the thread on which teachings are strung

The name is evocative without being culturally exclusive.

### Consequences

- UI copy update in Phase 6 (Related Teachings side panel, keyboard help)
- About page references "Following the Thread" (Phase 2 copy, updated in Phase 6)
- Marketing materials use this language
- No architectural changes — this is naming over an existing capability
- Editorial reading threads (ADR-054) are positioned as curated instances of "Following the Thread"

---

## ADR-118: "Teachings Through Time" — Temporal Dimension of the Corpus

**Status:** Accepted
**Date:** 2026-02-20
**Deciders:** Architecture team
**Context:** ADR-069 (Edition-Aware Content Model), ADR-048 (Teaching Topics), ADR-034 (Related Teachings)

### Context

The portal organizes teachings across multiple dimensions: spatial (books, chapters, passages), thematic (teaching topics, "Seeking..." entry points), relational (chunk relations, reverse bibliography, people library), and contemplative (Quiet Corner, textures, reading threads). But it lacks a **temporal dimension**.

Yogananda wrote over 30+ years — from his earliest American lectures in the 1920s through his final works in the early 1950s. His expression of key concepts evolved. Early writings on meditation emphasize technique and discipline; later writings emphasize surrender and grace. His understanding of Christ deepened over decades of writing *The Second Coming of Christ.* The collected talks span his entire American ministry.

The edition tracking (ADR-069) handles publication metadata. But the intellectual evolution — how Yogananda's language and emphasis on a topic changed over time — is an untapped dimension that would be genuinely unique. No physical book, no competitor, and no existing resource offers a chronological view of how Yogananda's teaching on a specific topic developed across his lifetime.

### Decision

Add temporal metadata to chapters and expose a "Teachings Through Time" view on theme pages.

**Schema additions** (nullable — populated where datable, left null where uncertain):

```sql
ALTER TABLE chapters ADD COLUMN composition_year INTEGER;
ALTER TABLE chapters ADD COLUMN composition_era TEXT CHECK (composition_era IN (
    'early_american_1920s',   -- 1920–1929: Early American lectures, establishing the mission
    'established_1930s',      -- 1930–1939: SRF established, Encinitas, writing Autobiography
    'mature_1940s',           -- 1940–1952: Peak writing, Second Coming, God Talks With Arjuna
    'posthumous'              -- Compiled/edited after 1952 from earlier material
));
```

**Dating sources:**
- *Autobiography of a Yogi*: Written 1944–1946, revised through 1952
- *Man's Eternal Quest* / *The Divine Romance* / *Journey to Self-Realization*: Individual talks dated (lecture dates in SRF archives)
- *The Second Coming of Christ*: Written over 20+ years (1930s–1950s), compiled posthumously
- *Sayings*, *Where There Is Light*: Compiled from dated and undated sources
- *Scientific Healing Affirmations*: First edition 1924, revised through 1940s

**Theme page UI:** On any theme page (`/themes/[slug]`), a "Through Time" toggle shows passages arranged chronologically by `composition_year` or `composition_era`. This reveals how Yogananda's expression of a concept evolved. Default view remains the standard relevance-ranked display; chronological is an opt-in exploration mode.

**Phase:** Populate temporal metadata during ingestion (Phase 5 for collected talks where dates are known, Phase 7 for the full corpus). Expose "Teachings Through Time" UI in Phase 6 or 7, alongside the knowledge graph visualization (ADR-098).

### Rationale

- **Genuinely unique.** No other Yogananda resource offers a temporal view of his teaching evolution. The portal becomes irreplaceable for scholars, monastics preparing talks, and serious students tracing how a concept deepened over time.
- **Low implementation cost.** Two nullable columns, populated opportunistically during ingestion. The theme page UI is a view toggle, not a new page.
- **Enriches existing features.** Theme pages, the knowledge graph, and editorial reading threads all gain a temporal axis. "Following the Thread" (ADR-117) becomes richer when the reader can see not just *related* passages but *earlier* and *later* expressions of the same idea.
- **Scholarly value.** Yogananda scholars would cite the portal's chronological view. Academic citation drives long-term discoverability and authority.

### Consequences

- Migration adds `composition_year` and `composition_era` columns to `chapters` table
- Ingestion pipeline includes date metadata where available (collected talks have lecture dates; narrative books have composition periods)
- Theme pages gain optional "Through Time" chronological view toggle
- Knowledge graph (ADR-098) can use temporal data as an axis
- Null-safe: theme pages work normally when temporal data is absent — the toggle only appears when sufficient dated content exists for that theme

---

## ADR-119: Documentation Architecture — Five-Document System with AI-First Navigation

- **Status:** Accepted
- **Date:** 2026-02-20

### Context

The project's documentation system is itself an architectural decision. The pre-code design phase produced nearly 1MB of structured documentation across five files. As the project transitions to implementation, the documentation system must serve three audiences: AI collaborators (primary, token-constrained), human developers (current and future), and non-technical stakeholders (SRF, the philanthropist's foundation).

Key tensions:
- **Completeness vs. navigability.** Thorough documentation ensures correct decisions; large documents are expensive to load into AI context windows.
- **Single source of truth vs. contextual relevance.** Centralizing information prevents drift; distributing it keeps related concerns together.
- **Design-phase authority vs. code-phase authority.** Documentation is the sole authority before code exists; after implementation, code and documentation must coexist without contradiction.

### Decision

Maintain a five-document system with explicit roles, a routing document (CLAUDE.md), and defined conventions for the documentation-to-code transition:

| Document | Role | Primary Audience |
|----------|------|-----------------|
| CLAUDE.md | AI routing, constraints, maintenance protocol | AI collaborators |
| CONTEXT.md | Project background, open questions, stakeholder context | All audiences |
| DESIGN.md | Technical architecture, data model, API, frontend design | Developers, AI |
| DECISIONS.md | Architecture Decision Records (immutable history) | Developers, AI |
| ROADMAP.md | Phased delivery plan with deliverables and success criteria | All audiences |

**Conventions:**

1. **CLAUDE.md as routing document.** The single most important file for AI collaboration. Establishes reading order, constraints, and maintenance protocol in ~90 lines — small enough to always fit in context.
2. **CONTEXT.md as open question registry.** All open questions (technical and stakeholder) are tracked here. Other documents cross-reference but do not duplicate the full question.
3. **DESIGN.md Table of Contents with phase-relevance markers.** Enables AI sessions to navigate to relevant sections without sequential scanning of 5,000+ lines.
4. **ROADMAP.md Table of Contents.** Phase-level navigation for quick orientation.
5. **DECISIONS.md Index by Concern.** ADRs grouped by domain (already established at ADR-001).
6. **Implemented-section annotations.** When a DESIGN.md section is fully implemented, annotate: `**Status: Implemented** — see [code path]`. Code becomes the source of truth; DESIGN.md retains architectural rationale.
7. **ADRs are immutable history.** Decisions are superseded (new ADR), withdrawn (with explanation), or removed (number retired) — never silently edited.
8. **All documents carry a `Last updated` footer.** Updated on any modification.
9. **Section-level change tracking.** When substantially revising a DESIGN.md section, add `*Section revised: [date], [reason or ADR]*` at the section's end.
10. **Expanded maintenance table in CLAUDE.md.** Covers open question lifecycle, cross-cutting concern changes, content type additions, and the documentation-to-code transition.

### Rationale

- The routing document (CLAUDE.md) is the single most impactful file for AI collaboration cost. A well-structured 90-line file saves thousands of tokens per session by directing attention to the right document and section.
- Phase-relevance markers in the DESIGN.md TOC allow AI sessions to skip irrelevant sections (e.g., Phase 11 multilingual details during Phase 1 work), reducing token consumption without losing information.
- The documentation-to-code transition protocol prevents the "two sources of truth" problem that invariably emerges when design documents survive into an implemented codebase.
- Centralizing open questions in CONTEXT.md prevents them from being forgotten in document interiors — a real risk at 967KB of total documentation.
- Making the documentation system itself an ADR ensures future contributors understand why the system is structured this way, and can evolve it deliberately rather than through drift.

### Consequences

- DESIGN.md and ROADMAP.md now carry navigable Tables of Contents
- DESIGN.md inline open questions are converted to cross-references to CONTEXT.md
- CLAUDE.md maintenance table is expanded from 6 rows to 12 rows
- CLAUDE.md gains a "Documentation–Code Transition" section
- Future documentation changes should follow the conventions established here
- This ADR should be superseded if the documentation system undergoes fundamental restructuring (e.g., splitting DESIGN.md into sub-documents as it grows beyond navigability)

---

*Last updated: 2026-02-20*
