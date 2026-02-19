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
- ADR-059: Sharing Formats — Email, PDF, and Download

**Reader Experience**
- ADR-036: Book Reader Typography
- ADR-037: Reader Typography Refinements
- ADR-038: "Dwell" — Passage Contemplation Mode
- ADR-039: Circadian Color Temperature
- ADR-040: "Breath Between Chapters"
- ADR-041: Lotus Bookmarks
- ADR-042: Keyboard-First Reading Navigation
- ADR-046: "Show Me Another" — Infinite Wisdom
- ADR-060: Dwell Discoverability — Hover-to-Reveal Activation Button
- ADR-062: Related Teachings — Reading Focus Detection and Progressive Loading
- ADR-063: Reading Session — Proactive Chapter Caching and Prefetch

**Visual Identity**
- ADR-008: SRF-Derived Design System
- ADR-043: Opening Moment — Portal Threshold
- ADR-044: Lotus as Unified Visual Motif
- ADR-045: SRF Imagery Strategy

**Architecture & Infrastructure**
- ADR-004: Next.js + Vercel for Frontend
- ADR-009: Phase 1 Uses Vercel, Not AWS Lambda
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

**Ethics & Internationalization**
- ADR-014: Personalization with Restraint — DELTA Boundaries
- ADR-017: Accessibility as Phase 2 Foundation
- ADR-020: Multi-Language Architecture
- ADR-021: CSS Logical Properties
- ADR-022: Hindi and Bengali in Locale Roadmap
- ADR-023: AI-Assisted Translation Workflow
- ADR-061: Global Equity — Serving Earth's Underserved Seekers

**Staff & Editorial Workflows**
- ADR-064: Staff Experience Architecture — Five-Layer Editorial System

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

Use **Contentful** as the editorial source of truth for production. Book text is authored and managed in Contentful, then synced to Neon (via webhooks) for search indexing. For Phases 1–7, books are ingested directly into Neon from PDFs, but the schema is designed to accommodate Contentful IDs for future integration.

### Rationale

- Aligns with SRF's established technology standard
- Demonstrates the pattern for stakeholders (reusable across all SRF properties)
- Content editors work in a familiar, managed environment
- Multi-language support via Contentful locales
- Separation of concerns: Contentful for authoring, Neon for searching

### Consequences

- Production requires a Contentful → Neon sync service (webhook-driven)
- The Neon schema includes `contentful_id` columns for linkage
- Phases 1–7 operate without Contentful (PDF → Neon direct) but the schema is designed for easy Contentful integration later
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

The Roadmap (Phase 4) originally listed post-Phase 1 books in an order roughly corresponding to scholarly depth and corpus size: The Second Coming of Christ, God Talks With Arjuna, Man's Eternal Quest, The Divine Romance, etc. However, the question of what makes the portal *essential* for seekers shifts the optimization target from scholarly completeness to life-impact — which books most directly address the reasons people seek spiritual guidance?

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

- Phase 4 scope changes: the multi-volume scriptural commentaries move from "first after Phase 1" to "after the collected talks"
- The verse-aware chunking challenge (originally a Phase 4 concern) is deferred, allowing more time to design a robust solution
- The portal reaches "critical mass" of quotable, thematically diverse content sooner
- *Where There Is Light* + *Sayings* + *Scientific Healing Affirmations* can potentially be ingested in the same sprint as Phase 4 begins, since they are short and structurally simple

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
| Language preference | Fundamental accessibility. Stored in cookie or account. | 6 |
| Font size / reading preferences | Accessibility. Local storage, no account needed. | 7 |
| Bookmarks ("My Passages") | Lets seekers curate a personal anthology of passages that moved them. | 9 |
| Reading position | Saves your place in a book. Basic reader functionality. | 9 |

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

- Phase 12 (Optional User Accounts) remains the appropriate phase for bookmark/reading-position features
- The "personalized daily passage" in Phase 12 must use explicit theme preference, not behavioral inference
- The portal's anonymous experience (Phases 1–11) must be excellent without any personalization — personalization enhances but never gates the core experience

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

The original roadmap placed accessibility in Phase 10 ("Calm Technology Polish & Accessibility"). This is too late. Retrofitting accessibility is expensive and error-prone; building it in from day one is nearly free if the right structural choices are made at the start.

SRF's audience includes elderly devotees, seekers in developing countries on low-end devices, and visually impaired users. The Gemini research document specifically notes visually impaired devotees who described the SRF app's screen reader support as "transformative." Accessibility is not a feature — it is a theological imperative per SRF's mission to serve "all of humanity" and the DELTA framework's Dignity principle.

| Approach | Cost | Risk |
|----------|------|------|
| **Phase 2 (build in)** | Low — semantic HTML, ARIA, keyboard nav are free if done from the start | None — this is best practice |
| **Phase 10 (retrofit)** | High — requires auditing and rewriting markup, fixing tab order, adding ARIA after the fact | Significant — inaccessible patterns get baked into components and propagated |

### Decision

Move **core accessibility** from Phase 10 to **Phase 2**. Phase 10 becomes the audit and polish phase (professional WCAG audit, native TTS, advanced reading mode), not the "add accessibility" phase.

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

**Phase 10 (reframed as "Accessibility Audit & Polish"):**
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
- Phase 10 scope shrinks (audit and polish, not build-from-scratch) but gains TTS and professional audit

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

**Phase 7 (non-personalized):** Same passage pool as Today's Wisdom. One email per day. Subscriber provides email address and language. No account required.

**Phase 12 (personalized):** Subscribers can optionally select theme preferences ("I'd like more passages about Peace and Healing"). Passages are filtered by theme from the `chunk_topics` join. This is an *explicit user choice*, never behavioral inference.

### Design

| Element | Specification |
|---------|--------------|
| Frequency | Daily, consistent time (configurable per timezone if feasible, otherwise fixed 6 AM EST) |
| Content | One verbatim passage + book/chapter/page citation + "Read in context" link to portal |
| Format | Minimal HTML email: Georgia serif (email-safe Merriweather equivalent), warm cream background (`#FAF8F5`), passage text, citation, portal link. No images. No announcements. No CTAs beyond "Read more." |
| Source | `daily_passages` pool (Phase 4 expands this from *Sayings* and *Where There Is Light*) |
| Signup | Email address + language. Optional: theme preferences (Phase 12). No account required. |
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

**SRF organizational sharing (Phase 7+):** The portal provides **semi-automated social media asset generation**. A daily quote image and suggested caption are generated automatically (from the daily_passages pool). A human (SRF social team or content editor) reviews, approves, and posts. The portal never posts automatically.

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
- Phase 7+: Admin dashboard (Retool) adds a "Social Assets" view showing daily quote images and suggested captions
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

4. **Locale + English fallback is the multilingual model.** The practical need is the seeker's language plus English supplementation — not arbitrary cross-language search (e.g., Japanese query finding German results). The multilingual embedding model *enables* cross-language search at near-zero cost, but the core experience is locale-first with English fallback. Cross-language search may be activated later if usage data justifies it, but it is not a core Phase 9 deliverable.

5. **`canonical_book_id` links translations to originals.** A new column on `books` enables "Available in 6 languages" on the library page and "Read in English →" navigation between editions. The `canonical_chunk_id` column on `book_chunks` enables passage-level cross-language links.

6. **`chunk_relations` stores per-language relations.** Top 30 same-language + top 10 English supplemental per chunk ensures non-English languages get first-class related teachings without constant real-time fallback. The English supplemental relations follow the same pattern as the search fallback — supplement, clearly mark with `[EN]`, never silently substitute.

7. **Per-language search quality evaluation is a launch gate.** Each language requires a dedicated search quality test suite (15–20 queries with expected passages) that must pass before that language goes live. This mirrors Phase 1's English-only search quality evaluation (Deliverable 1.11) and prevents launching a language with degraded retrieval quality.

8. **Chunk size must be validated per language.** English-calibrated chunk sizes (200/300/500 tokens) may produce different semantic density across scripts. Per-language chunk size benchmarking is required during Phase 9 ingestion — particularly for CJK and Indic scripts where tokenization differs significantly from Latin text.

### Consequences

- Phase 2 includes i18n infrastructure setup (locale routing, string externalization) even though content is English-only
- Phase 2 includes the `topic_translations` table (empty until Phase 9)
- Phase 9 requires knowing which books SRF has in digital translated form (stakeholder question)
- Phase 9 UI string translation uses an AI-assisted workflow: Claude generates drafts of locale JSON files, then a human reviewer (fluent in the target language and familiar with SRF's devotional register) refines tone, spiritual terminology, and cultural nuance. See ADR-023.
- The content availability matrix creates asymmetric experiences per language — this is honest, not a bug
- The book catalog per language shows only available books, plus a "Also available in English" section
- The `hybrid_search` function accepts a `search_language` parameter and filters to the user's locale
- The `content_tsv` column uses a trigger (not GENERATED ALWAYS) to select the correct PostgreSQL text search dictionary per chunk's language
- All content-serving API endpoints accept a `language` parameter with English fallback at the service layer
- Per-language search quality test suite (15–20 queries per language) is a launch gate before any language goes live in Phase 9
- Per-language chunk size benchmarking required during Phase 9 ingestion for non-Latin scripts
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

Add **Hindi (hi)** and **Bengali (bn)** to the locale roadmap as a **second wave in Phase 9**, following the initial Western-language wave.

**Phase 9 locale waves:**

| Wave | Languages | Rationale |
|------|-----------|-----------|
| **6a** | es, de, fr, it, pt, ja | Matches convocation site. Western audience. SRF's existing translation infrastructure. |
| **6b** | hi, bn | YSS audience. Yogananda's heritage languages. Massive population reach. |
| **6c** | Evaluate further | Based on demand data, available translations, and SRF/YSS input. Candidates: Chinese, Korean, Russian, Arabic. |

### Rationale

- **Mission integrity.** A portal that serves Yogananda's teachings in Japanese but not Hindi — Yogananda's own country — contradicts the mission.
- **Population reach.** Hindi speakers: ~600M. Bengali speakers: ~230M. These exceed the combined speakers of German, French, Italian, and Portuguese.
- **YSS translations exist.** YSS has published official Hindi and Bengali translations of key Yogananda works. The content likely exists (pending confirmation of digital availability).
- **Devanagari and Bengali scripts** are LTR, so the CSS logical properties decision (ADR-021) already covers the directional requirements. Font support (Noto Sans Devanagari, Noto Sans Bengali) is available via Google Fonts.

### Consequences

- Phase 9 is split into waves (9a Western, 9b Indian, 9c evaluation)
- Need to confirm YSS has digital text of Hindi/Bengali translations (stakeholder question)
- May need YSS-specific UI adaptations (organizational branding differences between SRF and YSS)
- Google Fonts Noto Sans Devanagari and Noto Sans Bengali added to the font stack for Phase 9 Indian wave
- The portal URL and branding question: is the Hindi/Bengali version served from the same domain (teachings.yogananda.org/hi/) or a YSS-branded domain?

---

## ADR-023: AI-Assisted Translation Workflow

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Phase 9 requires translating ~200–300 UI strings (nav labels, button text, search prompts, error messages, footer links, accessibility labels) into 6+ languages. The question: who translates these, and how?

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
- **Scalable.** As new languages are added (Phase 9 evaluation wave), the same workflow applies — Claude draft → human review. No need to find full professional translation services for each new locale.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Professional translation only** | Highest quality from day one | Expensive for UI strings that change often; slow turnaround for iterative development |
| **AI translation with no review** | Cheapest, fastest | Unacceptable risk of clinical tone, wrong spiritual terms, or culturally inappropriate phrasing |
| **Community/volunteer translation** | Free, deeply motivated translators | Unpredictable quality and timeline; coordination overhead; IP/liability concerns |

### Spiritual Terminology Glossary

The glossary is a critical dependency for both the AI drafting step and the human review step. It defines how spiritual terms are handled per language — which terms remain in Sanskrit, which have approved translations, and which are transliterated.

**Storage:** A JSONB column in Neon, stored as a per-language glossary file at `/messages/glossary-{locale}.json`. This is a content-editor-centric artifact — maintained alongside the locale JSON files, version-controlled in Git, and eventually migrated to Contentful when the CMS is adopted (Phase 8+).

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

**Migration path:** When Contentful is adopted (Phase 8+), glossaries can be modeled as a Contentful content type with per-locale entries, enabling content editors to manage terminology without touching JSON files.

### Consequences

- Phase 9 deliverable 9.1 uses AI-assisted workflow: Claude draft → human review → production
- Spiritual terminology glossary stored as `/messages/glossary-{locale}.json` — built incrementally during first review cycle, referenced by both AI drafting and human review
- The `messages/{locale}.draft.json` → `messages/{locale}.json` promotion step should be tracked (Git diff review)
- Reviewer recruitment: SRF likely has multilingual monastics and volunteers who can review UI translations — this is a stakeholder question
- The same workflow applies to portal-authored content (About page, theme descriptions, "Seeking..." entry points, etc.)
- Glossary files migrate to Contentful content types when the CMS is adopted (Phase 8+)

---

## ADR-024: API-First Architecture for Platform Parity

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The SRF already has a native mobile app (iOS/Android) with an eReader. While a dedicated teaching portal mobile app is not planned, the portal's API surface will likely be consumed by native apps eventually — either a standalone portal app, integration into the existing SRF app, or both.

Next.js encourages a pattern where business logic lives inside React Server Components. This is convenient for web development but creates a platform lock: Server Components are callable only by the Next.js rendering pipeline, not by a mobile app, a third-party integration, or a PWA Service Worker.

If business logic migrates into Server Components during Phases 1–11, extracting it later into a proper API layer is a significant refactoring effort. The cost of API-first discipline from day one is near zero; the cost of retrofitting is high.

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

**Phases 1–11: All API routes are public.** No authentication required. The portal's core mission is frictionless access to the teachings — adding "Sign in" contradicts this.

What auth would serve, and how it's handled without it:

| Need | Solution Without Auth |
|------|----------------------|
| Rate limiting | Vercel/Cloudflare edge rate limiting |
| Bookmarks, reading position | `localStorage` (ADR-041) — private, no server |
| Email subscription | Token-based confirm/unsubscribe (no user accounts) |
| Admin dashboards | Retool has its own auth |
| Content protection | Not needed — the mission is free access |

**Phase 12+ (if needed):** When optional accounts are introduced for cross-device sync, evaluate the lightest mechanism that serves the need (magic links, passkeys, or Auth0 if SSO with other SRF properties is required). Public search and reading remain unauthenticated regardless. Auth is additive middleware on specific protected endpoints — never a gate on reading or search.

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
- API routes are public (no auth) through Phase 11; auth middleware added only if/when Phase 12 accounts are implemented
- List endpoints return cursor-based pagination
- Cache-Control headers on all API responses
- PWA readiness added to roadmap (Phase 10)
- Stakeholder question: does the portal get its own mobile app, or do features integrate into the existing SRF app?

---

## ADR-025: Progressive Web App as Mobile Intermediate Step

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Before native apps, a Progressive Web App (PWA) offers a lightweight mobile experience with offline capability, home screen installation, and (on Android) push notifications — without App Store approval, review cycles, or revenue sharing.

For the teaching portal specifically, offline reading is a natural use case: a seeker on a flight, in a rural area with poor connectivity, or simply wanting to read without internet distraction. The Quiet Corner meditation timer should work offline. These align with the Calm Technology principle — the technology fades into the background.

### Decision

Add **PWA readiness** as a Phase 10 deliverable. This includes:

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

- Phase 10 includes PWA deliverables (manifest, Service Worker, offline caching)
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
- Simple map (Phase 10)

**The unique value:** The teaching portal is the only place that can cross-reference sacred places with the specific passages that describe them. When a seeker reads about Serampore in the Autobiography, the portal can show "Visit this place." When they browse the Sacred Places page, each entry links back to every passage that mentions it. The teachings and the places illuminate each other.

### Map Strategy

- **Phase 7:** No maps. Text descriptions with addresses and "Get Directions" links (opens user's native maps app).
- **Phase 10:** No embedded map library. Add **"See This Place" Street View links** (plain Google Maps URLs, no SDK) to place cards where coverage exists. Zero map dependencies, zero tile servers, zero maintenance. See ADR-047.
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

- Phase 7 adds static Events section and initial Sacred Places page (SRF properties, no maps)
- Phase 10 adds biographical sites and "See This Place" Street View links (ADR-047) — no embedded map library
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
| **Accessibility** | **axe-core** (CI) + Playwright a11y assertions | Automated WCAG checks on every page. Keyboard navigation flows. | Phase 2 (basic) / Phase 3 (CI) |
| **Search quality** | Custom Vitest suite | ~30 representative queries with expected passages. Precision/recall metrics. | Phase 1 (deliverable 1.11) |
| **Performance** | **Lighthouse CI** | Core Web Vitals thresholds: LCP < 2.5s, CLS < 0.1, INP < 200ms. | Phase 3 |
| **Visual** | **Storybook** | Component documentation, design token consistency, interactive component states | Phase 3 (design system) |
| **Visual regression** | Playwright screenshot comparison | Catch unintended visual changes to reading UI, passage cards, Quiet Corner | Phase 10 |

#### Tool Choices

**Vitest over Jest:** Faster execution, native ESM support, better Vite/Next.js integration. The JavaScript testing ecosystem is converging on Vitest.

**Playwright over Cypress:** Multi-browser support (Chrome, Firefox, WebKit/Safari), native accessibility snapshot API (`page.accessibility.snapshot()`), more reliable in CI, better parallel execution. Playwright's test generator also speeds up writing E2E tests.

**Storybook deferred to Phase 3:** In Phases 1–2, the component count is small (~15-20 components). Storybook adds setup overhead without proportional value. When the Calm Technology design system arrives (Phase 10), Storybook becomes the documentation platform for reusable components across SRF properties.

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
- Visual regression testing begins in Phase 10 when the component library stabilizes

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
- New Relic integration in Phase 6 (depending on SRF providing New Relic account access)
- Amplitude configured with explicit allowlist — no autocapture, no user identification
- DELTA compliance review of all observability configuration before launch
- Vercel Analytics enabled from Phase 1 (free with Vercel deployment)

---

## ADR-030: Design Tooling — Figma

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The portal needs a design tool for screen mockups, component design, and eventually the Calm Technology design system (Phase 10). The SRF tech stack brief does not prescribe a design tool. Options range from free open-source tools to industry-standard paid platforms.

### Decision

Use **Figma** for design, starting with the **free Starter plan** in Phase 3, upgrading to **Professional** when the design system work begins in Phase 10.

#### Phase 3 (Free Starter Plan — $0)

- 3 Figma design files (sufficient for: homepage/search, reader/passage, Quiet Corner/About)
- Unlimited personal drafts
- Core screens designed and available for developer reference
- Design tokens (colors, typography, spacing) documented in Figma and exported to `tailwind.config.ts`

#### Phase 10+ (Professional Plan — $15/editor/month)

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
- Phase 10: Upgrade to Professional when Calm Technology design system begins
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
| **Phases 1–7** | GitHub | GitHub Actions | Terraform Cloud free tier or S3 backend |
| **Phase 8+ (production)** | GitLab (SRF standard) | GitLab CI/CD | GitLab Terraform backend (SRF standard) |

Phases 1–7 use GitHub for velocity and simplicity. Migration to GitLab aligns with the SRF IDP when the portal moves toward production readiness in Phase 8.

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

For Phases 1–7, only `dev` is needed. Additional environments are added as the portal moves toward production.

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

#### CI/CD Pipeline (Phases 1–7 — GitHub Actions)

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

#### CI/CD Pipeline (Phase 8+ — GitLab CI)

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
- **GitHub → GitLab migration path.** Starting with GitHub Actions for Phases 1–7 velocity, then migrating to GitLab CI for SRF IDP alignment, is a clean path. The Terraform code itself is SCM-agnostic — only the CI pipeline config changes.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Terraform from Phase 3 (chosen)** | SRF-aligned; reproducible environments; AI-assisted authoring | Upfront setup time; state backend needed |
| **Terraform deferred to Phase 8** | Simpler Phases 1–2; no state management overhead | Deviates from SRF standards; manual infrastructure creates undocumented state; harder to retrofit |
| **Pulumi (TypeScript)** | Same language as application; type-safe infrastructure | Not the SRF standard; not integrated into SRF IDP; smaller provider ecosystem |
| **Platform-native config only** | Simpler; no Terraform learning curve | Not reproducible; no drift detection; violates SRF IaC principle; each service configured independently |
| **AWS CDK** | Strong AWS integration | Portal is Vercel-based, not AWS-heavy; CDK is AWS-centric; not the SRF standard for non-Lambda infrastructure |

### Consequences

- Phase 3 includes `/terraform` directory with modules for Neon, Vercel, and Sentry
- Phases 1–7 use GitHub + GitHub Actions; Phase 8 migrates to GitLab + GitLab CI (SRF IDP)
- Terraform state stored in Terraform Cloud free tier (Phases 3–7) or GitLab Terraform backend (Phase 8+)
- All environment variables and service configuration defined in Terraform — no undocumented dashboard settings
- `.env.example` still maintained for local development (developers run the app locally without Terraform)
- Auth0, New Relic, and Cloudflare modules added as those services are introduced (Phases 4–5)
- Four-environment convention (dev/qa/stg/prod) adopted per SRF standard, with only `dev` active in Phase 3
- Stakeholder question: does SRF prefer the portal repo in GitLab from day one, or is GitHub acceptable for Phases 1–7 with a planned migration?

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
- **Corpus grows over time.** By Phase 9 (multi-language), the corpus may be 10x larger than Phase 1. Re-embedding at that scale is hours of API calls and significant cost. Incremental migration keeps the portal online throughout.
- **Search quality is the core mission.** A better embedding model directly improves passage retrieval. The portal should be able to adopt improvements without architectural changes.
- **Zero cost now.** Three columns and a convention. No additional infrastructure.

### Multilingual Embedding Requirement (Added 2026-02-18)

**The embedding model must be multilingual.** This is an explicit requirement, not a side-effect. OpenAI's text-embedding-3-small places semantically equivalent text in different languages close together in vector space. This means:

- English embeddings generated in Phase 1 remain valid when Spanish, German, and Japanese chunks are added in Phase 9 — no re-embedding of the English corpus.
- The English fallback strategy (searching English when locale results < 3) works because the multilingual model places the English search query and English passages in compatible vector space — even when the user typed their query in Spanish.
- Cross-language passage alignment (`canonical_chunk_id`) is validated by embedding proximity, not just paragraph index matching.
- Any future embedding model migration must preserve this multilingual property.

If a candidate model has better English retrieval but weaker multilingual mapping, that is **not an upgrade** — it's a regression for the portal's mission of global availability. Benchmark per-language retrieval quality and English fallback quality alongside single-language quality during model evaluation.

### Consequences

- `book_chunks` schema includes `embedding_model`, `embedding_dimension`, and `embedded_at` columns from Phase 1
- The ingestion pipeline records which model it used per chunk
- Search quality test suite (deliverable 1.11) becomes the gate for model migration decisions
- Model migration is a maintenance operation, not an architecture change
- Budget for re-embedding costs when evaluating new models (Phase 9 multilingual benchmarking is a natural trigger)
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
- A `chunk_relations` table is added to migration 001 (empty until Phase 5 populates it with multi-book content)
- A `chunk_references` table is added for human-curated editorial cross-references (supplements automatic similarity)
- Two new API endpoints: `/api/v1/chunks/[id]/related` and `/api/v1/chapters/[slug]/[number]/thread`
- Two new service functions: `relations.ts` and `thread.ts`
- The Book Reader component gains a Related Teachings side panel (desktop) and bottom sheet (mobile)
- A related content quality test suite (Phase 5+) validates that pre-computed relations are thematically relevant, cross-book diverse, and free of false friends
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
- Phase 10 Reading Mode (10.3) builds on this foundation — sepia mode, font size adjustment, and high-contrast mode complement the time bands

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

The portal's design philosophy prioritizes immediate access without registration (Phase 12 introduces optional accounts). But readers still need a way to save their place across reading sessions. Without bookmarks, a reader must remember where they were — or re-search for a passage they found meaningful.

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

6. **Phase 12 migration:** When optional accounts are introduced (Phase 12), bookmarks are synced to the server on login. `localStorage` bookmarks are offered for import. Until then, bookmarks are entirely client-side.

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
- Users on different browsers/devices will have separate bookmark collections until Phase 12 sync
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

1. **The reading experience is text-only.** No images appear in the book reader column. Imagery would compete with Yogananda's words, and his words always win. The side panel may show video thumbnails (Phase 11) but never photographs.

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

ADR-026 originally specified Leaflet + OpenStreetMap as the Phase 10 embedded map for the Sacred Places page. On re-evaluation, the embedded map adds a library dependency for a page that already communicates geography effectively through its card layout (grouped by category, each card showing city and country). The page works in Phase 4 without any map. "Get Directions" already delegates to the user's preferred maps app for navigation. The one thing no outbound link provided was a *virtual visit* — seeing what a place looks like before traveling there.

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
- Phase 10 Sacred Places work is simpler: add biographical sites + Street View links + Reader ↔ Place cross-reference cards
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

None. The existing `topic_translations` table handles localized names for any theme regardless of category. Theme descriptions used for auto-tagging are internal (not displayed). The multilingual embedding model produces reasonable candidates for non-English chunks even from English-language theme descriptions. Per-language theme descriptions can improve accuracy in Phase 9 but are not required.

### Consequences

- Phase 4 scope expanded: deliverable 4.2 (theme tagging pipeline) now includes the auto-tagging infrastructure, not just manual tagging
- Situation themes are added incrementally during Phase 4+ as content is ingested and sufficient passages confirmed
- The homepage stays calm — six quality doors, one quiet link to explore all themes
- Editorial governance needed: who decides when a new theme has enough passages to go live?
- The `description` field on `teaching_topics` now serves double duty: internal reference *and* auto-tagging input. Descriptions should be written as rich keyword-laden paragraphs, not terse labels.
- The review queue (`tagged_by = 'auto'`) needs a workflow — Phase 1–7 uses a script or Retool dashboard; Phase 8+ uses Contentful
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

#### E3: Passage Accessibility Rating (Phase 4)

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

**Why this matters:** Manual evaluation of 30 queries is feasible at launch but doesn't scale. As the corpus grows (Phase 4–6) and the search pipeline evolves, automated regression testing ensures quality doesn't silently degrade.

#### E6: Cross-Book Conceptual Threading (Phase 5)

**Category:** Classifying | **Cost:** ~$0.50/book pair (one-time) | **Human review:** Spot-check

Enhance `chunk_relations` (ADR-034) with conceptual understanding. Vector similarity finds passages about the same *topic*, but Claude can distinguish:

| Relation Type | Example | What It Enables |
|---------------|---------|-----------------|
| `same_topic` | Two passages about courage | Standard related teaching (already handled by embeddings) |
| `develops_further` | Autobiography mentions self-control briefly; Man's Eternal Quest has a full chapter | "Yogananda explores this idea at greater length in..." |
| `personal_story` | A teaching principle + an autobiographical illustration of it | "Yogananda shares a personal experience of this in..." |
| `practical_application` | A philosophical passage + a concrete technique or affirmation | "For a practical approach to this teaching, see..." |

**Implementation:** During chunk relation computation (Phase 5, Deliverable 5.1), for the top 10 most similar cross-book passages per chunk, Claude classifies the relation type. Stored as a `relation_type` column on `chunk_relations`. Used to diversify the "Continue the Thread" suggestions and add context labels in the side panel.

**Why this matters:** This is what a human librarian does that a search engine cannot. "If you liked this passage about courage, here's where he tells the story of his own test of courage" — that's a world-class reading experience. No physical book, no PDF, no ebook can do this.

#### E7: Photograph Alt Text (Phase 2)

**Category:** Drafting | **Cost:** ~$0.01 total (one-time, <20 images) | **Human review:** Yes

Generate reverential, descriptive alt text for the portal's Yogananda photographs (About page, footer, book covers):

- Rich descriptions for screen readers (not just "Photo of Yogananda" but "Paramahansa Yogananda seated in lotus position, eyes gently closed in meditation, wearing an ochre robe, circa 1935")
- Tone: warm, respectful, consistent with the portal's devotional register
- One-time batch at build time, reviewed by SRF editors

**Why this matters:** Direct accessibility improvement for visually impaired seekers. A portal that claims accessibility as a foundational principle should describe its sacred images with the same care it gives to its text.

#### E8: Daily Passage Tone Classification (Phase 4)

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
- E3 (accessibility rating) and E8 (tone classification) are added to Phase 4 — they require multi-book content to be meaningful
- E4 (QA assistant) and E5 (eval judge) are added to Phase 1 — they improve quality foundations
- E6 (cross-book threading) is added to Phase 5 — it enhances the Related Teachings system
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
- Phase 3 deliverable scope: reader settings consolidation
- The scroll position indicator uses `IntersectionObserver` or `scroll` event with `requestAnimationFrame` — standard performance-safe approaches
- The three prohibitions (no countdown, no percentage, no streaks) should be added to the Calm Technology constraint for permanence

---

## ADR-051: Remove book_store_links Table — Simplify Bookstore Links

**Status:** Accepted | **Date:** 2026-02-19

### Context

The original schema included a `book_store_links` table for per-language bookstore URLs (SRF Bookstore for English, YSS Bookstore for Hindi/Bengali, regional Amazon or publisher sites for others), with a fallback to the `books.bookstore_url` column.

### Decision

Remove the `book_store_links` table entirely. The `books.bookstore_url` column is sufficient — it points to the SRF Bookstore for all books. The portal is not an e-commerce gateway; directing seekers to the SRF Bookstore is the appropriate action for all languages in all foreseeable phases.

If per-language bookstore routing is genuinely needed in Phase 9 (YSS Bookstore for Hindi/Bengali editions), a simple lookup table or additional column can be added at that time — a trivial migration.

### Consequences

- One fewer table, one fewer foreign key relationship, one fewer fallback logic path
- `books.bookstore_url` is the single source for "Find this book" links
- Phase 9 deliverable 9.11 updated to reference `books.bookstore_url` instead of `book_store_links`
- Zero impact on any Phase 1–8 deliverable

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

Phase 5 (Related Teachings & Reader Intelligence) — editorial threads complement the algorithmic chunk relations with human curation.

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

Phase 5 (Related Teachings & Reader Intelligence) — the reverse bibliography is a natural companion to chunk relations and editorial threads.

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

The `daily_passages` pool supports optional seasonal weighting, but the connection between specific calendar dates and Yogananda's teachings is not explicitly modeled. Separately, Phase 4 plans E3 (Passage Accessibility Rating) and E8 (Tone Classification), but these classifications are not yet combined into a browsable dimension.

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

- Calendar-aware surfacing: Phase 4 (when multi-book content enables meaningful calendar coverage)
- Quiet Index browsing: Phase 4 (after E3 and E8 classifications are applied)

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

Phase 11 (Cross-Media Search & Video Transcription) was described at a high level in the roadmap. The availability of multiple transcription services with word-level timestamp support enables a richer architecture: time-synced playback, cross-media chunk relations, and synchronized transcript display.

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

- Two new tables (`video_transcripts`, `video_chunks`) added in Phase 11
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

- `quality` and `situation` themes: Phase 4 (existing plan)
- `practice` themes: Phase 4+ (practical themes like Meditation naturally emerge from the early content)
- `person`, `principle`, `scripture` themes: Phase 5+ (requires multi-book content for meaningful coverage; benefits from the Reverse Bibliography extraction pipeline)

### Alternatives Considered

| Approach | Why Rejected |
|----------|-------------|
| **Separate tables per category** | Unnecessary complexity; the same tagging infrastructure applies to all categories |
| **Hierarchical taxonomy** (e.g., scripture → Gita → Chapter 2) | Over-engineering for Phase 5; a flat per-category list is sufficient. Sub-categories can be added later if content depth warrants |
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

**Chapter PDF (Phase 7):**

A multi-page PDF with book-like typographic treatment:
- Cover page: book title, "by Paramahansa Yogananda," chapter title, SRF lotus centered at bottom
- Chapter text in Merriweather, proper paragraph spacing, drop capitals on chapter opening (Latin scripts only)
- Running header: book title (left) and chapter title (right) in Open Sans, 8pt
- Page numbers centered at bottom
- Lotus watermark on first page only (8% opacity)
- Portal URL on final page: `teachings.yogananda.org`
- A4 page size

**Book PDF (Phase 7):**

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
- **Phase 2 / Phase 7 split.** Passage-level sharing (email + image + PDF) is simple and high-value — Phase 2. Chapter and book PDFs require proper typographic layout and caching infrastructure — Phase 7, alongside the daily email and social assets.

### Consequences

- Phase 2 adds email and PDF options to the existing share menu
- Phase 7 adds chapter/book PDF generation with caching
- The `/api/v1/pdf/` routes need rate limiting (PDF generation is CPU-intensive)
- PDF font embedding requires bundling Merriweather and Open Sans font files server-side (Google Fonts license permits this)
- Non-Latin script PDFs (Phase 9) require per-locale font bundles (Noto Sans Devanagari, Noto Sans Bengali, Noto Sans CJK) — same constraint as OG images
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

**First-visit hint (Phase 3):**

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
- **No user accounts until Phase 12+** — the portal works fully without sign-in, which is already the design. This is correct for shared devices.
- **Bookmarks (ADR-041) use `localStorage`** — they disappear if the browser data is cleared. This is acceptable for Phase 3. Phase 12+ (user accounts) can optionally sync bookmarks, but the local-first design is correct for shared devices where privacy between users matters.
- **No "Welcome back" or personalization.** The portal greets every visit the same way. No reading history displayed on the homepage. No "Continue where you left off" (which would expose one family member's reading to another).

#### 4. Intermittent Connectivity as the Norm

The PWA (ADR-025) is Phase 10. For Phases 1–9, seekers with unreliable connections have no offline support. This is a long gap.

**Commitments:**
- **Phase 2: Service Worker for static assets only.** The app shell (HTML, CSS, JS, fonts) is cached by a minimal Service Worker. Book content is not cached offline until Phase 10, but the portal loads instantly on repeat visits even with no connectivity change.
- **Phase 3: Last-read chapter cached.** When a seeker reads a chapter, the chapter HTML is cached in the Service Worker. If connectivity drops, they can re-read that chapter. Not full offline support — just graceful handling of the most common offline scenario (re-reading what you just read).
- **Offline indicator.** When the Service Worker detects no connectivity, a subtle banner appears: *"You're reading offline. Search requires a connection."* Not an error state — a calm acknowledgment. Matches the portal's warm cream palette, not a red warning bar.

#### 5. Community and Group Reading

In India, Latin America, and many African communities, spiritual texts are read aloud in groups — satsang, study circles, family devotions. The portal's reader is designed for individual silent reading.

**Commitments:**
- **Presentation mode (Phase 7).** A "Present" button in the reader header. When activated: text enlarges to 24px+ (readable from 2–3 meters), all chrome hides (no header, no sidebar, no share icons), chapter navigation becomes swipe/arrow-key only, warm cream background fills the viewport. The device becomes a digital lectern.
- **This is not a separate feature — it is a CSS mode.** The same reader component, the same content, the same accessibility. `data-mode="present"` on the reader container triggers the enlarged, chrome-free layout.

#### 6. Cultural Consultation for Entry Points

The "Seeking..." empathic entry points (ADR-035) and theme doors are currently written from an English-language, Western-spiritual perspective. "What happens after death?" is a natural question in one culture but may be phrased as "Where does the soul go?" or "What is the cycle of birth?" in another.

**Commitments:**
- **Phase 9 (multilingual launch) requires cultural consultation, not just translation.** For each Wave 1 language, SRF engages a native-speaking devotee (not a professional translator) to review the entry points and theme door labels for cultural resonance. The consultant answers: "Would a seeker in [country] phrase this question this way? What would feel more natural?"
- **The "Seeking..." prompts are editorial content, not UI chrome.** They live in Contentful (Phase 8+), not in `messages/{locale}.json`. Each locale has independently authored prompts, not translations of the English originals.
- **Query expansion (Claude API) handles the bridge.** Even if the entry point is culturally adapted, a seeker may still type their question in a culturally specific way. The terminology bridge (ADR-052) and Claude's query expansion handle the mapping from the seeker's phrasing to the passage corpus.

#### 7. Right-to-Left as a First-Class Layout

CSS logical properties (ADR-021) provide the technical foundation for RTL. But RTL is more than mirrored margins.

**Commitments:**
- **Phase 9 RTL languages (Arabic, Urdu — if added in Wave 3+) require a native RTL reader to review every page.** Not just CSS mirroring, but visual hierarchy, reading flow, and icon directionality (e.g., a "next chapter" arrow points left in RTL).
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
- Minimal Service Worker deployed in Phase 2 (static assets only), expanded in Phase 3 (last-read chapter)
- KaiOS emulator added to CI in Phase 3
- Presentation mode added to the reader in Phase 7
- Cultural consultation budget required for Phase 9 multilingual launch
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
- Phase 3: Last-read chapter cached (ADR-061)
- Phase 10: Full PWA with explicit download and offline reading

Between Phase 3 and Phase 10, there is a gap. A seeker reading chapter 14 of the Autobiography on a bus in São Paulo loses connectivity mid-chapter. The current chapter is cached (Phase 3), but chapter 15 isn't. The reading session ends — not because the seeker chose to stop, but because the infrastructure failed them.

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

1. **Cache the current chapter** (already happening via Phase 3 last-read caching)
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
| No loading (Save-Data / 2G) | No proactive caching — only the current chapter (Phase 3 baseline) | No |

#### Phase placement

- **Phase 3:** Last-read chapter caching (ADR-061). The Service Worker infrastructure exists.
- **Phase 5:** Reading session detection + proactive chapter HTML caching. Also: batch prefetch API (`/api/v1/chapters/[slug]/[number]/relations`) built as a core Phase 5 deliverable alongside the Related Teachings system — not deferred as an optimization.
- **Phase 5+:** Proactive relations caching (depends on batch prefetch API existing).
- **Phase 10:** Full PWA — explicit "Download this book for offline reading" becomes available. The reading session remains as the *implicit* complement to the *explicit* download feature.

### Alternatives Considered

| Approach | Why rejected |
|----------|-------------|
| **Full book download on first chapter access** | Too aggressive — a seeker opening chapter 1 may not read the whole book. Caching all 48 chapters of the Autobiography (~1–2MB) on first touch is wasteful, especially on metered connections. |
| **User-initiated "Download for offline"** | Correct for Phase 10 (PWA), but requires UI, user decision, and storage consent. The reading session is invisible — it just works. Both features coexist: implicit proactive caching (this ADR) and explicit download (Phase 10). |
| **No proactive caching** | Acceptable but suboptimal. Connectivity drops during reading sessions are common on buses, trains, and in areas with spotty coverage. Two chapters of read-ahead covers most brief connectivity gaps. |
| **Prefetch more than 2 chapters** | Diminishing returns. Two chapters ahead covers ~30–60 minutes of reading. A connectivity gap longer than that is not a brief interruption — the seeker has likely stopped reading. The cache budget stays small. |

### Rationale

- **Invisible resilience.** The seeker never knows the caching is happening. They never configure it, never approve it, never see a download progress bar. They just notice that chapter transitions are instant and that reading continues even when the train enters a tunnel. The technology fades into the background — exactly what calm technology means.
- **Privacy by architecture.** No reading history is stored. The SW's in-memory state is ephemeral. The cache is indistinguishable from normal browser caching. A shared device reveals nothing.
- **Complementary to explicit offline.** Phase 10 adds "Download this book." The reading session is the implicit counterpart — it handles the common case (brief connectivity loss during a session) without requiring user action. Both features serve different needs and coexist.
- **Batch prefetch integration.** Building the batch prefetch API as a Phase 5 deliverable (not an optimization) means the reading session can cache relations data ahead, making the Related Teachings side panel work across cached chapters. The alternative — per-paragraph API calls that can't be proactively cached — would leave the side panel broken during offline chapter transitions.

### Consequences

- The Service Worker gains reading session detection logic (~50 lines of JS)
- A chapter cache with LRU eviction is added to the SW (Cache API, ~30 lines)
- The batch prefetch API (`/api/v1/chapters/[slug]/[number]/relations`) is built in Phase 5 as a core deliverable, not deferred
- The reader component's offline behavior is specified: cached chapters serve normally, uncached chapters show a gentle redirect to the nearest cached chapter
- Phase 10's explicit download feature builds on the same caching infrastructure — the download action simply pre-fills the cache for all chapters in a book, using the same cache keys the reading session uses
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
- "Seeking..." empathic entry point text (Phase 9 — cultural adaptation per locale)
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
| **Theme tag review** | Phase 4 | Passage displayed with full citation. Theme name and description visible. Similarity score and AI confidence shown (but not as primary decision input). Approve, reject, or adjust relevance weight. Keyboard shortcuts: `a` approve, `r` reject, `→` next. |
| **Daily passage curation** | Phase 4 | 7-day lookahead calendar. Each day's passage shown with tone badge. Swap from pool. Flag inappropriate timing (e.g., a "challenging" passage on a holiday). |
| **Calendar event management** | Phase 4 | Event list with dates. For each event, associated passages shown. Add/remove associations. Preview how the homepage will look on that date. |
| **Social media asset review** | Phase 7 | Today's quote image at actual platform dimensions (1:1, 9:16, 16:9). Caption below with inline editing. Download per platform. Mark as "posted" per platform (tracking, not automation). Weekly lookahead view. |
| **Translation review** | Phase 9 | Side-by-side: English source string and AI draft. UI context note ("this appears on the search button"). Approve, edit inline, or flag `[REVIEW]`. Batch view (40–100 strings per session). Progress indicator per locale. |
| **Ingestion QA review** | Phase 4+ | Flagged passages with Claude's suggestion and confidence. Accept correction, reject (keep original), or edit manually. Grouped by flag type (OCR error, formatting, truncation). |
| **Tone/accessibility spot-check** | Phase 4 | Random sample of classified passages. "Does this feel `contemplative`? Is this `universal`-level accessibility?" Confirm or reclassify. |
| **Content preview** | Phase 4 | "Preview as seeker" — see exactly what a theme page, daily passage, or editorial thread will look like before publication. |

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
| **Phase 4** | Minimal editorial review portal: theme tag review queue, daily passage curation, calendar event management, content preview, tone/accessibility spot-check. Email digest for review notifications. Auth0 roles: `editor`, `reviewer`. |
| **Phase 7** | Social media asset review workflow added to the admin portal. |
| **Phase 8** | Contentful integration. Contentful Custom Apps (sidebar panels). Full admin editorial workflow connecting Contentful authoring with portal review queues. |
| **Phase 9** | Translation review UI added to admin portal. Auth0 role: `translator:{locale}`. Volunteer reviewer access with minimal permissions. |
| **Phase 9+** | Impact dashboard for leadership. |

### Alternatives Considered

| Approach | Why rejected |
|---|---|
| **Contentful + Retool only (current design)** | Underserves monastic editors and theological reviewers. Retool's visual language is incongruent with sacred content work. Translation reviewers have no interface at all. |
| **Everything in Contentful** | Contentful is excellent for content authoring but not designed for AI classification review workflows (approve/reject per passage at scale), social media asset visual review, or translation side-by-side comparison. Forcing these workflows into Contentful's content model would require awkward workarounds. |
| **Everything in Retool** | Retool can technically build any admin UI, but the result is always "an admin tool." For the AE developer, this is fine. For a monastic editor reviewing whether a passage about inner peace is correctly tagged — the experience matters. Retool's generic form builders and data grids don't support the focused, reverent interaction these workflows demand. |
| **Third-party editorial workflow tool (Jira, Asana, Monday)** | Introduces a new vendor with its own UX, its own authentication, its own learning curve. Doesn't integrate with portal data (passages, themes, embeddings). Adds cost. The editorial review workflows are specific to this portal's data model — generic project management tools would require extensive customization to be useful. |
| **Build the admin portal from Phase 1** | Premature. Phase 1 has a single book with a one-time ingestion QA process. The first real demand for review workflows comes in Phase 4 (theme tagging at scale across multiple books). Building the portal earlier would be over-engineering. |

### Rationale

- **Staff should think about the teachings, not the technology.** The same principle that governs the seeker experience ("calm technology") should govern the staff experience. A monastic editor's tool should fade into the background, leaving focus on the passage and the decision.
- **Three distinct audiences need three distinct experiences.** A monastic editor, an AE developer, and a leadership stakeholder have different mental models, different technical comfort levels, and different goals. One tool cannot serve all three well.
- **Review workflows are the bottleneck.** The portal's most distinctive constraint — human review as mandatory gate — means the speed and quality of staff review directly determines how quickly new content reaches seekers. A cumbersome review process means fewer themes published, fewer passages curated, slower translation cycles. The review experience is a first-class product concern, not an afterthought.
- **The calm design system already exists.** Building the admin portal in the same Next.js application, with the same design tokens, means zero incremental design cost. The portal's warm cream, Merriweather, and gold accents serve the staff experience as naturally as the seeker experience.
- **Auth0 already exists in the SRF stack.** Role-based access for the admin portal uses SRF's established identity provider. No new authentication system.
- **Incremental delivery.** Phase 4 delivers only the review workflows needed for theme tagging (the first AI-proposal workflow at scale). Each subsequent phase adds only the workflows demanded by its content features. The admin portal grows organically, never ahead of actual need.

### Consequences

- **Revises the DESIGN.md statement** "The portal never builds custom admin UIs for either use case." The portal now builds a purpose-built editorial review UI for non-technical staff. Contentful remains the content authoring tool. Retool remains the technical operations tool. The admin portal fills the gap between them.
- Phase 4 gains a new deliverable: minimal editorial review portal
- Phase 7 gains social media asset review in the admin portal
- Phase 8 gains Contentful Custom Apps (sidebar panels)
- Phase 9 gains translation review UI and volunteer reviewer access
- Auth0 role schema: `editor`, `reviewer`, `translator:{locale}`, `admin`, `leadership`
- Email digest infrastructure: scheduled serverless function for daily review summaries
- The admin portal shares the Next.js application, design system, and database — zero new infrastructure
- **Extends ADR-002** (Contentful as editorial source of truth — now one layer of five, not the whole story), **ADR-019** (social media — review workflow now specified), **ADR-023** (translation workflow — review UI now specified), and **ADR-048** (theme tagging — review workflow now specified)

*Last updated: 2026-02-19*
