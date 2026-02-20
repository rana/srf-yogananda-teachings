# SRF Online Teachings Portal — Technical Design

## Design Philosophy

This portal is a **digital library with an AI librarian**, not a chatbot or content generator. The AI finds and surfaces Yogananda's actual words — it never speaks for him. Every architectural decision flows from this principle.

---

## Architecture Overview

### Phase 1 Architecture (Minimal)

Three services. One database. One AI provider (via AWS Bedrock).

```
┌─────────────────────────────────────────────────────────────┐
│                        USERS                                 │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────┐                   │
│  │        Next.js on Vercel              │                   │
│  │                                       │                   │
│  │  • Search UI (query bar + results)    │                   │
│  │  • Book Reader (chapter navigation)   │                   │
│  │  • "Read in context" deep links       │                   │
│  └──────────┬──────────────┬─────────────┘                   │
│             │              │                                 │
│     /api/v1/search   /api/v1/books                              │
│     /api/v1/expand   /api/v1/chapters                           │
│             │              │                                 │
│             ▼              ▼                                 │
│  ┌─────────────────────────────────────┐                    │
│  │     Neon PostgreSQL + pgvector       │                    │
│  │                                      │                    │
│  │  • books, chapters (metadata)        │                    │
│  │  • book_chunks (text + embeddings)   │                    │
│  │  • Full-text search (tsvector)       │                    │
│  │  • Vector similarity (HNSW index)    │                    │
│  │  • search_queries (anonymized log)   │                    │
│  └─────────────────────────────────────┘                    │
│             │                                                │
│             ▼ (query expansion + passage ranking only)       │
│  ┌─────────────────────────────────────┐                    │
│  │     Claude via AWS Bedrock (ADR-110) │                    │
│  │                                      │                    │
│  │  • Expand user queries into          │                    │
│  │    semantic search terms  [Haiku]    │                    │
│  │  • Re-rank candidate passages [Haiku]│                    │
│  │  • Classify search intent [Haiku]    │                    │
│  │  • NEVER generate/paraphrase text    │                    │
│  └─────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘

One-time ingestion (offline script):

  PDF ──► marker (PDF→Markdown) ──► Chunking ──► Embeddings ──► Neon
```

### Production Architecture (Contentful Integration)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  EDITORIAL LAYER                SEARCH LAYER                      │
│  (Source of Truth)              (Derived Index)                    │
│                                                                   │
│  ┌──────────────────┐          ┌──────────────────────────┐      │
│  │    Contentful     │ webhook  │   Neon PostgreSQL         │      │
│  │                   │────────►│   + pgvector               │      │
│  │  Book             │  sync   │                            │      │
│  │  └─ Chapter       │ service │  book_chunks               │      │
│  │      └─ Section   │         │  (text + embeddings +      │      │
│  │          └─ Block │         │   Contentful entry IDs)    │      │
│  │                   │         │                            │      │
│  │  Locales:         │         │  Hybrid search:            │      │
│  │  en, es, de, fr,  │         │  vector + full-text        │      │
│  │  it, pt, ja       │         │                            │      │
│  └──────────────────┘          └──────────────────────────┘      │
│         │                                │                        │
│         │ (book text                     │ (search results)       │
│         │  for reader)                   │                        │
│         ▼                                ▼                        │
│  ┌──────────────────────────────────────────────────────┐        │
│  │              Next.js on Vercel                        │        │
│  │                                                       │        │
│  │  • Book Reader (SSG from Contentful at build time)    │        │
│  │  • Search UI (queries Neon via API routes)            │        │
│  │  • "Read in context" links to reader pages            │        │
│  └──────────────────────────────────────────────────────┘        │
│                        │                                          │
│                        ▼                                          │
│  ┌──────────────────────────────────────────────────────┐        │
│  │  Supporting Services                                  │        │
│  │                                                       │        │
│  │  • Claude API — query expansion + passage ranking     │        │
│  │  • Retool — admin panel (content review, analytics)   │        │
│  │  • Cloudflare — CDN, edge caching, security           │        │
│  └──────────────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────────────┘
```

**Key principle:** Contentful is where editors work. Neon is where search works. Next.js is where users work. Each system does what it's best at.

---

## The AI Librarian: Search Architecture

### Core Principle

The AI is a **librarian**, not an **oracle**. It finds Yogananda's words — it never speaks for him. All results shown to users are verbatim quotes from published works with precise citations.

### Search Flow

```
1. USER QUERY
   "How do I overcome fear?"
        │
        ▼
2. QUERY EXPANSION (Claude Haiku via Bedrock — optional, for complex queries)
   Claude expands the query into semantic search terms:
   ["fear", "courage", "anxiety", "fearlessness", "divine protection",
    "dread", "worry", "soul immortal", "overcome terror"]

   The LLM is given strict instructions:
   - Output ONLY a JSON array of search terms
   - Do not answer the question
   - Do not generate any teaching content
        │
        ▼
3. HYBRID SEARCH (Neon PostgreSQL)
   Two searches run in parallel, results merged:

   a) Vector similarity search (pgvector):
      - Embed the original query using the same embedding model
      - Find top 20 chunks by cosine similarity

   b) Full-text search (tsvector):
      - Search expanded terms against the FTS index
      - Find top 20 chunks by text relevance

   c) Reciprocal Rank Fusion (RRF):
      - Merge and re-rank results from both searches
      - Deduplicate, producing top 20 candidates
        │
        ▼
4. PASSAGE RANKING (Claude Haiku via Bedrock — optional refinement; promote to Sonnet if benchmarks warrant, ADR-110)
   Given the user's original question and 20 candidate passages,
   Claude selects and ranks the 5 most relevant.

   Claude is given strict instructions:
   - Return ONLY passage IDs in ranked order
   - Do not modify, summarize, or paraphrase any passage text
   - If no passages are relevant, return an empty list
        │
        ▼
5. RESULT PRESENTATION
   Display ranked passages as verbatim quotes:

   ┌──────────────────────────────────────────────┐
   │  "The soul is ever free; it is deathless,     │
   │   birthless, ever-existing..."                │
   │                                               │
   │   — Autobiography of a Yogi, Chapter 26       │
   │     Page 312                                  │
   │                          [Read in context →]  │
   └──────────────────────────────────────────────┘

   Each result includes:
   - The verbatim passage text (highlighted relevant portion)
   - Book title, chapter, page number
   - A deep link to the book reader positioned at that passage
```

### Search Intent Classification (ADR-049 E1)

Before query expansion, a lightweight Claude call classifies the seeker's intent:

```
User types: "I'm scared"
        │
        ▼
INTENT CLASSIFICATION (Claude Haiku via Bedrock — lightweight, ~$0.0005/query, ADR-110)
  Claude classifies the query:
  { "intent": "emotional", "route": "theme", "theme_slug": "courage" }

  Intent types:
    topical      → redirect to /themes/[slug] if theme exists
    specific     → redirect to reader (/books/[slug]/[chapter])
    emotional    → empathic entry: theme-filtered search with compassionate framing
    definitional → search with boost for passages where Yogananda defines the term
    situational  → search with situation-theme boost
    browsing     → route to Today's Wisdom / random passage
    search       → standard hybrid search (default fallback)

  Returns JSON only. Falls back to standard search if uncertain.
```

### Spiritual Terminology Bridge (ADR-049 E2)

The query expansion system prompt includes a tradition-aware vocabulary mapping maintained at `/lib/data/spiritual-terms.json`:

```
Seeker searches: "mindfulness meditation anxiety"
        │
        ▼
TERMINOLOGY BRIDGE (integrated into query expansion prompt)
  Maps cross-tradition and modern terms to Yogananda's vocabulary:
    "mindfulness"  → "concentration", "one-pointed attention", "interiorization"
    "anxiety"      → "restlessness", "mental disturbance", "nervous agitation"
    "meditation"   → "meditation" (direct match — also expands to "stillness", "going within")

  Expanded query:
  ["mindfulness", "concentration", "one-pointed attention", "interiorization",
   "anxiety", "restlessness", "mental disturbance", "meditation", "stillness",
   "going within", "calm", "peace of mind"]
```

The terminology mapping is a versioned JSON glossary reviewed by SRF-aware editors. It bridges the vocabulary gap between seekers who have never read Yogananda and the specific language of his published works.

#### Per-Book Evolution Lifecycle (ADR-052)

The terminology bridge is not a static artifact — it deepens with each book ingested. When a new book enters the pipeline, a dedicated Claude "Classifying" step extracts Yogananda's distinctive vocabulary from the new content and proposes updates to the bridge:

```
Book ingestion pipeline (new step after chunking, before embedding):
  1. VOCABULARY EXTRACTION
     Claude scans the book's full chunk set (Classifying category, JSON output)
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
  version: string;           // Schema version (e.g., "1.0")
  lastReviewed: string;      // ISO date of last human review
  terms: SpiritualTerm[];
}

interface SpiritualTerm {
  canonical: string;         // Yogananda's preferred term (e.g., "samadhi")
  alternates: string[];      // Cross-tradition equivalents (e.g., ["enlightenment", "cosmic consciousness"])
  modern: string[];          // Modern seeker vocabulary (e.g., ["spiritual awakening", "peak experience"])
  category: "sanskrit" | "yogic" | "christian" | "universal" | "scientific";
  books: string[];           // Book slugs where this term appears prominently
  notes?: string;            // Editorial note on Yogananda's specific usage
}
```

Phase 1 seeds this file with ~50 core terms from the Autobiography. Each subsequent book ingestion (ADR-052) triggers: vocabulary extraction → diff against existing terms → human review → merge. The file grows with the corpus.

### Search Without AI (Fallback / Simple Queries)

For straightforward keyword queries, the system can operate without any LLM calls:

```
User types: "divine mother"
  → Full-text search only (no query expansion needed)
  → Results ranked by Postgres ts_rank
  → No Claude API call required
  → Fast, free, reliable
```

The LLM is invoked only when the query is conceptual/semantic and benefits from expansion or re-ranking. This keeps costs low and latency minimal for simple searches.

### Claude API Graceful Degradation

When Claude (via AWS Bedrock, ADR-110) is unavailable (timeout, error, rate limit, or monthly budget cap), search degrades gracefully through four levels. No seeker ever sees an error — quality decreases silently.

| Level | Trigger | What Works | What Doesn't | User Impact |
|-------|---------|-----------|--------------|-------------|
| **Full** | Claude API healthy | Query expansion + passage ranking | — | Best results: conceptual queries understood, top 5 precisely ranked |
| **No ranking** | Passage ranking call fails | Query expansion, RRF ranking | Claude re-ranking | Slightly less precise ordering; top 5 from RRF scores |
| **No expansion** | Query expansion also fails | Raw query → hybrid search (vector + FTS) | Conceptual query broadening | Keyword-dependent; "How do I find peace?" works less well than "peace" |
| **Database only** | All Claude calls fail | Pure hybrid search | All AI enhancement | Still returns relevant verbatim passages via vector similarity + FTS |

**Implementation:** `/lib/services/search.ts` wraps each Claude call in a try-catch with a 5-second timeout. Failure at any level falls through to the next. Sentry captures each degradation event (`search.claude_degradation` with `level` tag) for monitoring. The search API response includes a `searchMode` field (`"full"`, `"no_ranking"`, `"no_expansion"`, `"database_only"`) for observability — not exposed in the seeker-facing UI.

---

## Data Model

### Neon PostgreSQL Schema

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;      -- pgvector
CREATE EXTENSION IF NOT EXISTS pg_trgm;     -- trigram similarity (fuzzy matching)

-- ============================================================
-- BOOKS
-- ============================================================
CREATE TABLE books (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    subtitle        TEXT,
    author          TEXT NOT NULL DEFAULT 'Paramahansa Yogananda',
    publication_year INTEGER,
    language        TEXT NOT NULL DEFAULT 'en',
    isbn            TEXT,
    source_url      TEXT,          -- PDF URL for Phase 1 ingestion
    contentful_id   TEXT,          -- Contentful entry ID (production)
    cover_image_url TEXT,
    bookstore_url   TEXT,          -- SRF Bookstore URL for "Find this book" link.
                                   -- Points to SRF Bookstore for all books. If per-language bookstore
                                   -- routing is needed in Phase 11 (YSS for Hindi/Bengali), add a simple
                                   -- lookup then — zero schema changes required now. (ADR-051)
    canonical_book_id UUID REFERENCES books(id), -- links translations to the original (English) edition;
                                                 -- NULL for originals. Enables "Available in 6 languages"
                                                 -- on library page and cross-language navigation.
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- BOOK STORE LINKS — REMOVED (ADR-051)
-- ============================================================
-- The book_store_links table was removed as over-designed for a portal
-- that is not an e-commerce gateway. The books.bookstore_url column
-- points to the SRF Bookstore. If per-language bookstore routing is
-- needed in Phase 11, a simple table or column can be added then.

-- ============================================================
-- CHAPTERS
-- ============================================================
CREATE TABLE chapters (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id         UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    chapter_number  INTEGER NOT NULL,
    title           TEXT,
    contentful_id   TEXT,          -- Contentful entry ID (production)
    sort_order      INTEGER NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chapters_book ON chapters(book_id, sort_order);

-- ============================================================
-- BOOK CHUNKS (the core search table)
-- ============================================================
CREATE TABLE book_chunks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id         UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    chapter_id      UUID REFERENCES chapters(id) ON DELETE SET NULL,

    -- The actual text (verbatim from the book)
    content         TEXT NOT NULL,

    -- Location metadata
    page_number     INTEGER,
    section_heading TEXT,
    paragraph_index INTEGER,       -- position within chapter

    -- Search infrastructure
    embedding       VECTOR(1536),  -- embedding vector (dimensionality matches model)
    embedding_model TEXT NOT NULL DEFAULT 'text-embedding-3-small',  -- which model generated this vector (ADR-032)
    embedding_dimension INTEGER NOT NULL DEFAULT 1536,               -- vector dimensions for this chunk
    embedded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),              -- when this chunk was last embedded
    content_tsv     TSVECTOR,      -- populated by trigger using language-appropriate dictionary
                                   -- (see tsvector_update trigger below)

    -- Contentful linkage (production)
    contentful_id   TEXT,          -- Contentful entry ID of source block

    -- Chunk context (for overlap / windowing)
    prev_chunk_id   UUID,          -- previous chunk for context continuity
    next_chunk_id   UUID,          -- next chunk for "read more"

    -- Cross-language alignment (Phase 11)
    canonical_chunk_id UUID REFERENCES book_chunks(id), -- links translated chunk to its English original;
                                                        -- NULL for originals. Enables "Read this in Spanish →".

    -- Metadata
    language        TEXT NOT NULL DEFAULT 'en',
    accessibility_level SMALLINT,      -- 1=universal, 2=accessible, 3=deep (ADR-049 E3)
                                       -- NULL until classified. Computed by Claude at ingestion, spot-checked by reviewer.
                                       -- Used for Today's Wisdom (prefer 1–2), theme pages (default 1–2, "Show deeper" shows all).
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vector similarity search (HNSW for fast approximate nearest neighbor)
CREATE INDEX idx_chunks_embedding ON book_chunks
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- Full-text search
CREATE INDEX idx_chunks_fts ON book_chunks USING GIN (content_tsv);

-- Trigram index for fuzzy/partial matching
CREATE INDEX idx_chunks_trgm ON book_chunks USING GIN (content gin_trgm_ops);

-- Lookup by book
CREATE INDEX idx_chunks_book ON book_chunks(book_id, chapter_id, paragraph_index);

-- Lookup by Contentful ID (for webhook-driven updates)
CREATE INDEX idx_chunks_contentful ON book_chunks(contentful_id) WHERE contentful_id IS NOT NULL;

-- Language-filtered search (critical for multilingual — ensures search
-- stays within the user's locale unless cross-language is requested)
CREATE INDEX idx_chunks_language ON book_chunks(language);

-- ============================================================
-- LANGUAGE-AWARE TSVECTOR TRIGGER
-- ============================================================
-- Uses each chunk's language column to select the correct PostgreSQL
-- text search dictionary (stemming, stop words). A GENERATED ALWAYS
-- column cannot reference another column as a regconfig, so we use
-- a trigger instead. Phase 1 has only 'english'; Phase 11 adds
-- 'spanish', 'german', 'french', 'italian', 'portuguese', etc.
-- Languages without a built-in PG dictionary (ja, hi, bn) use 'simple'.

CREATE OR REPLACE FUNCTION book_chunks_tsvector_trigger() RETURNS trigger AS $$
DECLARE
    pg_lang REGCONFIG;
BEGIN
    -- Map language codes to PostgreSQL text search configurations.
    -- Languages without a built-in dictionary use 'simple' (no stemming,
    -- but still tokenizes and enables FTS matching).
    pg_lang := CASE NEW.language
        WHEN 'en' THEN 'english'::regconfig
        WHEN 'es' THEN 'spanish'::regconfig
        WHEN 'de' THEN 'german'::regconfig
        WHEN 'fr' THEN 'french'::regconfig
        WHEN 'it' THEN 'italian'::regconfig
        WHEN 'pt' THEN 'portuguese'::regconfig
        ELSE 'simple'::regconfig  -- ja, hi, bn, and others
    END;
    NEW.content_tsv := to_tsvector(pg_lang, NEW.content);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_book_chunks_tsvector
    BEFORE INSERT OR UPDATE OF content, language ON book_chunks
    FOR EACH ROW EXECUTE FUNCTION book_chunks_tsvector_trigger();
```

> **Terminology note:** The database table `teaching_topics` is exposed as `themes` in the API (`/api/v1/themes`) and displayed as "Doors of Entry" in the seeker-facing UI. The related junction table `chunk_topics` links passages to themes. These terms all refer to the same concept: curated thematic groupings of Yogananda's teachings (e.g., Peace, Courage, Healing). See ADR-013 and ADR-048.

```sql
-- ============================================================
-- LIFE THEMES (curated thematic entry points)
-- ============================================================
-- Multi-category theme taxonomy (ADR-048, ADR-058):
--   'quality'   — spiritual/emotional states: Peace, Courage, Healing, Joy, Purpose, Love
--                  Displayed as "Doors of Entry" on the homepage (6 cards).
--   'situation' — life circumstances: Relationships, Parenting, Loss & Grief, Work, etc.
--   'person'    — spiritual figures Yogananda discusses: Christ, Krishna, Lahiri Mahasaya, etc.
--   'principle' — yogic ethical principles: Ahimsa, Satya, Brahmacharya, Tapas, etc. (Yama/Niyama)
--   'scripture' — scriptural frameworks Yogananda interprets: Yoga Sutras, Bhagavad Gita, Bible
--   'practice'  — spiritual practices: Meditation, Concentration, Pranayama, Affirmation
--   'yoga_path' — yoga paths: Kriya, Raja, Bhakti, Karma, Jnana, Hatha, Mantra, Laya
--   Non-quality categories accessible from "Explore" pages and the Library.
--   Not shown on the homepage grid to preserve the calm six-door design.
CREATE TABLE teaching_topics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL UNIQUE,       -- English display name: "Peace", "Courage", "Relationships", etc.
    slug            TEXT NOT NULL UNIQUE,       -- URL slug: "peace", "relationships", etc. (always English for URL stability)
    category        TEXT NOT NULL DEFAULT 'quality',  -- 'quality', 'situation', 'person', 'principle',
                                                     -- 'scripture', 'practice', 'yoga_path' (ADR-048, ADR-058)
    description     TEXT,                       -- brief editorial description used for auto-tagging and internal reference
    description_embedding VECTOR(1536),         -- embedding of `description` for auto-tagging (same model as book_chunks)
    header_quote    TEXT,                       -- a Yogananda quote encapsulating this theme (displayed on theme page)
    header_citation TEXT,                       -- citation for the header quote
    sort_order      INTEGER NOT NULL DEFAULT 0, -- display order within category
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_teaching_topics_category ON teaching_topics(category);

-- ============================================================
-- LIFE THEME TRANSLATIONS (localized theme names and header quotes)
-- ============================================================
-- Slugs stay in English for URL stability (/es/themes/peace, not /es/temas/paz).
-- Display names and header quotes are localized per language.
-- Phase 2: table created (empty). Phase 11: populated via AI-assisted workflow (ADR-023).

CREATE TABLE topic_translations (
    theme_id        UUID NOT NULL REFERENCES teaching_topics(id) ON DELETE CASCADE,
    language        TEXT NOT NULL,              -- locale code: 'es', 'de', 'fr', etc.
    name            TEXT NOT NULL,              -- localized display name: "Paz", "Mut", "Paix"
    header_quote    TEXT,                       -- localized header quote (from official translation)
    header_citation TEXT,                       -- localized citation
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (theme_id, language)
);

-- ============================================================
-- CHUNK-THEME JOIN (many-to-many: passages belong to themes)
-- ============================================================
-- tagged_by values (three-state provenance):
--   'manual'   — human placed this tag directly (editorial curation)
--   'auto'     — machine proposed via embedding similarity, not yet reviewed
--   'reviewed' — machine proposed, human approved (distinguishes "human created" from "human verified")
-- Only 'manual' and 'reviewed' tags are served to users. 'auto' tags are candidates awaiting review.
CREATE TABLE chunk_topics (
    chunk_id        UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
    theme_id        UUID NOT NULL REFERENCES teaching_topics(id) ON DELETE CASCADE,
    relevance       FLOAT DEFAULT 1.0,         -- editorial relevance weight (1.0 = normal, higher = more relevant)
    tagged_by       TEXT NOT NULL DEFAULT 'manual',  -- 'manual', 'auto', or 'reviewed'
    similarity      FLOAT,                     -- cosine similarity score when tagged_by = 'auto' or 'reviewed' (NULL for manual)
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (chunk_id, theme_id)
);

CREATE INDEX idx_chunk_topics_theme ON chunk_topics(theme_id);
CREATE INDEX idx_chunk_topics_pending ON chunk_topics(tagged_by) WHERE tagged_by = 'auto';  -- fast lookup for review queue

-- ============================================================
-- DAILY PASSAGES (curated pool for "Today's Wisdom")
-- ============================================================
CREATE TABLE daily_passages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chunk_id        UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
    season_affinity TEXT[],                     -- optional: ['winter', 'renewal'] for seasonal weighting
    tone            TEXT,                       -- 'consoling', 'joyful', 'challenging', 'contemplative', 'practical' (ADR-049 E8)
                                               -- Classified by Claude at curation time, spot-checked by reviewer.
                                               -- Selection algorithm ensures tonal variety across the week.
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_daily_passages_active ON daily_passages(is_active) WHERE is_active = true;

-- ============================================================
-- AFFIRMATIONS (curated pool for "The Quiet Corner")
-- ============================================================
CREATE TABLE affirmations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content         TEXT NOT NULL,              -- the affirmation text (verbatim from source)
    book_title      TEXT NOT NULL,              -- source book
    page_number     INTEGER,
    section_heading TEXT,
    chunk_id        UUID REFERENCES book_chunks(id) ON DELETE SET NULL, -- link to full chunk if applicable
    language        TEXT NOT NULL DEFAULT 'en', -- required for Quiet Corner language filtering
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_affirmations_active ON affirmations(is_active) WHERE is_active = true;

-- ============================================================
-- INITIAL THEME DATA
-- ============================================================
-- Phase 1: six spiritual quality themes (displayed as "Doors of Entry" on homepage)
INSERT INTO teaching_topics (name, slug, category, sort_order, description) VALUES
    ('Peace',   'peace',   'quality', 1, 'Inner peace, calmness, stillness of mind, overcoming restlessness and anxiety, mental tranquility, equanimity in the face of difficulty'),
    ('Courage', 'courage', 'quality', 2, 'Overcoming fear, bravery, inner strength, perseverance through difficulty, spiritual fortitude, willpower'),
    ('Healing', 'healing', 'quality', 3, 'Physical healing, emotional healing, recovery from suffering, divine healing power, overcoming illness, spiritual wholeness'),
    ('Joy',     'joy',     'quality', 4, 'Divine joy, bliss, happiness, cheerfulness, overcoming sadness and depression, finding joy within, ever-new joy'),
    ('Purpose', 'purpose', 'quality', 5, 'Life purpose, meaning, dharma, vocation, finding direction, why am I here, fulfilling divine plan'),
    ('Love',    'love',    'quality', 6, 'Divine love, unconditional love, devotion, human love, expanding the heart, love for God, love for all beings');

-- Phase 5+: life situation themes (accessible from "Browse all themes" page, not on homepage grid)
-- These are added as content is ingested and sufficient passages are confirmed.
-- Minimum threshold: ~20 reviewed passages before a situation theme page goes live.
-- INSERT INTO teaching_topics (name, slug, category, sort_order, description) VALUES
--     ('Relationships',  'relationships',  'situation', 1, 'Marriage, friendship, family bonds, human love, companionship, interpersonal harmony, forgiveness between people, how to treat others, divine friendship'),
--     ('Parenting',      'parenting',      'situation', 2, 'Raising children, parenthood, guiding young souls, family life, teaching children spiritual values, a parent''s duty'),
--     ('Loss & Grief',   'loss-and-grief', 'situation', 3, 'Death of a loved one, bereavement, grief, consolation, the soul''s continuity, life after death, eternal life'),
--     ('Work',           'work',           'situation', 4, 'Livelihood, career, right activity, duty, service, karma yoga, finding meaning in work, balancing material and spiritual life'),
--     ('Loneliness',     'loneliness',     'situation', 5, 'Isolation, feeling alone, finding the inner companion, solitude vs loneliness, divine companionship, belonging'),
--     ('Aging',          'aging',          'situation', 6, 'Growing older, the body and the soul, vitality, wisdom of age, preparing for the afterlife, eternal youth of the spirit');

-- Phase 6+: exploration themes — persons, principles, scriptures, practices (ADR-058)
-- Same tagging pipeline as quality/situation themes. No fixed minimum — editorial judgment decides when a topic has enough depth to publish.
-- INSERT INTO teaching_topics (name, slug, category, sort_order, description) VALUES
--
--     -- SPIRITUAL FIGURES (category = 'person')
--     ('Christ',              'christ',              'person', 1, 'Jesus Christ, Christ Consciousness, the Second Coming, the teachings of Jesus, Yogananda''s interpretation of Christianity, the Christ of the East and West'),
--     ('Krishna',             'krishna',             'person', 2, 'Lord Krishna, the Bhagavad Gita''s speaker, divine cowherd, avatar, cosmic consciousness personified, the universal guru'),
--     ('Lahiri Mahasaya',     'lahiri-mahasaya',     'person', 3, 'Lahiri Mahasaya, Yogananda''s param-guru, Kriya Yoga master, the householder yogi, revival of ancient yoga science'),
--     ('Sri Yukteswar',       'sri-yukteswar',       'person', 4, 'Sri Yukteswar, Yogananda''s guru, Jnanavatar, wisdom incarnation, astrology and scripture, guru-disciple relationship'),
--     ('Patanjali',           'patanjali',           'person', 5, 'Patanjali, author of the Yoga Sutras, father of yoga philosophy, eight limbs, systematic yoga science'),
--     ('Kabir',               'kabir',               'person', 6, 'Kabir, mystic poet, weaver saint, union of Hindu and Muslim devotion, direct experience of God'),
--     ('Divine Mother',       'divine-mother',       'person', 7, 'Divine Mother, God as Mother, cosmic feminine, Kali, unconditional love of God, Yogananda''s devotion to the Mother aspect'),
--
--     -- YOGIC PRINCIPLES (category = 'principle') — Yama/Niyama from Patanjali's Yoga Sutras
--     ('Ahimsa',              'ahimsa',              'principle', 1, 'Non-violence, non-injury, compassion for all beings, harmlessness in thought word and deed, the first yama'),
--     ('Satya',               'satya',               'principle', 2, 'Truthfulness, honesty, integrity, living in truth, speaking truth, the second yama'),
--     ('Asteya',              'asteya',              'principle', 3, 'Non-stealing, non-covetousness, contentment with what one has, the third yama'),
--     ('Brahmacharya',        'brahmacharya',        'principle', 4, 'Self-control, moderation, conservation of vital energy, chastity, the fourth yama'),
--     ('Aparigraha',          'aparigraha',          'principle', 5, 'Non-attachment, non-possessiveness, simplicity, freedom from greed, the fifth yama'),
--     ('Saucha',              'saucha',              'principle', 6, 'Cleanliness, purity of body and mind, internal and external purification, the first niyama'),
--     ('Santosha',            'santosha',            'principle', 7, 'Contentment, acceptance, inner satisfaction, the second niyama'),
--     ('Tapas',               'tapas',               'principle', 8, 'Self-discipline, austerity, spiritual fire, perseverance, the third niyama'),
--     ('Svadhyaya',           'svadhyaya',           'principle', 9, 'Self-study, scriptural study, introspection, the fourth niyama'),
--     ('Ishvara Pranidhana',  'ishvara-pranidhana',  'principle', 10, 'Surrender to God, devotion, offering actions to the divine, the fifth niyama'),
--
--     -- SACRED TEXTS (category = 'scripture')
--     ('Yoga Sutras',         'yoga-sutras',         'scripture', 1, 'Patanjali''s Yoga Sutras, eight limbs of yoga, systematic yoga philosophy, samadhi, pratyahara, dharana, dhyana'),
--     ('Bhagavad Gita',       'bhagavad-gita',       'scripture', 2, 'The Bhagavad Gita, Krishna and Arjuna, battlefield of life, karma yoga, bhakti yoga, jnana yoga, God Talks With Arjuna'),
--     ('Bible',               'bible',               'scripture', 3, 'The Holy Bible, Old and New Testament, Christ''s teachings, Yogananda''s interpretation of Christianity, the Second Coming'),
--     ('Rubaiyat',            'rubaiyat',            'scripture', 4, 'Rubaiyat of Omar Khayyam, Wine of the Mystic, Yogananda''s spiritual interpretation, Persian poetry, divine intoxication'),
--
--     -- SPIRITUAL PRACTICES (category = 'practice')
--     ('Meditation',          'meditation',          'practice', 1, 'Meditation technique, how to meditate, stillness, concentration, going within, interiorization, daily practice'),
--     ('Concentration',       'concentration',       'practice', 2, 'One-pointed attention, focus, mental power, will, dharana, training the mind'),
--     ('Pranayama',           'pranayama',           'practice', 3, 'Breath control, life force, prana, vital energy, breathing exercises, energy control'),
--     ('Affirmation',         'affirmation',         'practice', 4, 'Affirmations, positive thinking, mental healing, thought power, Scientific Healing Affirmations, will and affirmation'),
--     ('Devotion',            'devotion',            'practice', 5, 'Bhakti, love for God, prayer, chanting, divine love, heart-centered practice, surrender'),
--
--     -- YOGA PATHS (category = 'yoga_path')
--     ('Kriya Yoga',          'kriya-yoga',          'yoga_path', 1, 'Kriya Yoga, the royal technique, spinal magnetization, life force control, Babaji''s yoga, Lahiri Mahasaya''s science'),
--     ('Raja Yoga',           'raja-yoga',           'yoga_path', 2, 'Raja Yoga, the royal path, Patanjali''s eightfold path, meditation and mental control, astanga yoga'),
--     ('Bhakti Yoga',         'bhakti-yoga',         'yoga_path', 3, 'Bhakti Yoga, the path of devotion, love for God, divine love, chanting, prayer, emotional surrender'),
--     ('Karma Yoga',          'karma-yoga',           'yoga_path', 4, 'Karma Yoga, the path of action, selfless service, right activity, nishkama karma, duty without attachment'),
--     ('Jnana Yoga',          'jnana-yoga',          'yoga_path', 5, 'Jnana Yoga, the path of wisdom, discrimination, viveka, intellectual understanding, Vedantic inquiry'),
--     ('Hatha Yoga',          'hatha-yoga',          'yoga_path', 6, 'Hatha Yoga, physical postures, asana, body as temple, health, Energization Exercises, physical purification'),
--     ('Mantra Yoga',         'mantra-yoga',         'yoga_path', 7, 'Mantra Yoga, sacred sound, repetition of God''s name, chanting, japa, AUM, vibratory consciousness'),
--     ('Laya Yoga',           'laya-yoga',           'yoga_path', 8, 'Laya Yoga, absorption, dissolution of ego, merging in the Infinite, kundalini, subtle energy centers');

-- ============================================================
-- THEME TAGGING PIPELINE (ADR-048)
-- ============================================================
-- Semi-automated: embeddings propose, humans approve.
--
-- Adding a new theme:
--   1. INSERT into teaching_topics with name, slug, category, description
--   2. Embed the description → store in description_embedding
--   3. Run cosine similarity: compare description_embedding against all book_chunks.embedding
--   4. Chunks above threshold (e.g., 0.45) get INSERT into chunk_topics with tagged_by='auto'
--   5. Optional: Claude classifies ambiguous chunks near the threshold (librarian role — classifying, not generating)
--   6. Human reviews candidate list, approves/rejects → tagged_by updated to 'reviewed' or row deleted
--   7. Topic page goes live when an editor decides the tagged passages have sufficient depth (no fixed minimum)
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
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_text      TEXT NOT NULL,
    query_expanded  TEXT[],        -- expanded search terms (if AI was used)
    results_count   INTEGER,
    search_mode     TEXT,          -- 'hybrid', 'fts_only', 'vector_only'
    language        TEXT DEFAULT 'en',
    duration_ms     INTEGER,       -- search latency
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
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
-- graph traversal across the library. (ADR-034)
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
    similarity      FLOAT NOT NULL,
    rank            INTEGER NOT NULL,   -- 1 = most similar, 2 = second, etc.
    relation_type   TEXT,               -- NULL (Phase 1–4), classified in Phase 6 (ADR-049 E6):
                                        -- 'same_topic'     — both passages address the same theme
                                        -- 'develops_further'— target develops the source idea at greater length
                                        -- 'personal_story' — target is a personal illustration of the source teaching
                                        -- 'practical'      — target is a practical application or affirmation
                                        -- Classified by Claude for top 10 cross-book relations per chunk. Spot-checked.
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
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

-- chunk_references table added in Phase 6 (Related Teachings & Reader Intelligence)
CREATE TABLE chunk_references (
    source_chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
    target_chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
    reference_type  TEXT NOT NULL DEFAULT 'mention',  -- 'mention', 'quote', 'scripture', 'continuation'
    note            TEXT,                              -- editorial note (e.g., "References Bhagavad Gita 2:47")
    created_by      TEXT NOT NULL DEFAULT 'editorial', -- 'editorial' or 'auto'
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (source_chunk_id, target_chunk_id)
);

CREATE INDEX idx_chunk_references_source ON chunk_references(source_chunk_id);
CREATE INDEX idx_chunk_references_target ON chunk_references(target_chunk_id);

-- ============================================================
-- HYBRID SEARCH FUNCTION
-- ============================================================
-- Combines vector similarity and full-text search using
-- Reciprocal Rank Fusion (RRF) for merged ranking.

CREATE OR REPLACE FUNCTION hybrid_search(
    query_text TEXT,
    query_embedding VECTOR(1536),
    match_count INTEGER DEFAULT 10,
    fts_weight FLOAT DEFAULT 0.3,
    vector_weight FLOAT DEFAULT 0.7,
    search_language TEXT DEFAULT 'en'  -- user's locale: filters chunks AND selects FTS dictionary
)
RETURNS TABLE (
    chunk_id UUID,
    content TEXT,
    book_title TEXT,
    chapter_title TEXT,
    chapter_number INTEGER,
    page_number INTEGER,
    section_heading TEXT,
    similarity_score FLOAT,
    fts_rank FLOAT,
    combined_score FLOAT
) AS $$
DECLARE
    pg_lang REGCONFIG;
BEGIN
    -- Map locale to PostgreSQL text search configuration
    -- (mirrors the tsvector trigger on book_chunks)
    pg_lang := CASE search_language
        WHEN 'en' THEN 'english'::regconfig
        WHEN 'es' THEN 'spanish'::regconfig
        WHEN 'de' THEN 'german'::regconfig
        WHEN 'fr' THEN 'french'::regconfig
        WHEN 'it' THEN 'italian'::regconfig
        WHEN 'pt' THEN 'portuguese'::regconfig
        ELSE 'simple'::regconfig
    END;

    RETURN QUERY
    WITH vector_results AS (
        SELECT
            bc.id,
            1 - (bc.embedding <=> query_embedding) AS score,
            ROW_NUMBER() OVER (ORDER BY bc.embedding <=> query_embedding) AS rn
        FROM book_chunks bc
        WHERE bc.embedding IS NOT NULL
          AND bc.language = search_language  -- stay in user's locale
        ORDER BY bc.embedding <=> query_embedding
        LIMIT match_count * 3
    ),
    fts_results AS (
        SELECT
            bc.id,
            ts_rank_cd(bc.content_tsv, websearch_to_tsquery(pg_lang, query_text)) AS score,
            ROW_NUMBER() OVER (
                ORDER BY ts_rank_cd(bc.content_tsv, websearch_to_tsquery(pg_lang, query_text)) DESC
            ) AS rn
        FROM book_chunks bc
        WHERE bc.content_tsv @@ websearch_to_tsquery(pg_lang, query_text)
          AND bc.language = search_language  -- stay in user's locale
        ORDER BY score DESC
        LIMIT match_count * 3
    ),
    combined AS (
        SELECT
            COALESCE(v.id, f.id) AS id,
            -- RRF formula: 1/(k+rank) where k=60 is standard
            COALESCE(vector_weight * (1.0 / (60 + v.rn)), 0) +
            COALESCE(fts_weight * (1.0 / (60 + f.rn)), 0) AS rrf_score,
            v.score AS vec_score,
            f.score AS fts_score
        FROM vector_results v
        FULL OUTER JOIN fts_results f ON v.id = f.id
        ORDER BY rrf_score DESC
        LIMIT match_count
    )
    SELECT
        c.id AS chunk_id,
        bc.content,
        b.title AS book_title,
        ch.title AS chapter_title,
        ch.chapter_number,
        bc.page_number,
        bc.section_heading,
        c.vec_score::FLOAT AS similarity_score,
        c.fts_score::FLOAT AS fts_rank,
        c.rrf_score::FLOAT AS combined_score
    FROM combined c
    JOIN book_chunks bc ON bc.id = c.id
    JOIN books b ON b.id = bc.book_id
    LEFT JOIN chapters ch ON ch.id = bc.chapter_id
    ORDER BY c.rrf_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Note: The English fallback strategy (ADR-020) is implemented at the
-- service layer, not in the SQL function. When search_language results
-- < 3, findPassages() calls hybrid_search a second time with
-- search_language='en' and merges the results, marking English
-- passages with an [EN] tag. This keeps the SQL function clean and
-- the fallback policy in application code where it belongs.
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
│   └── stores text as JSON AST
│       preserves bold, italic, footnotes, verse numbers
├── section (Reference → Section)
├── pageNumber (Integer)  — maps to physical book page
├── sortOrder (Integer)
└── metadata (JSON Object)  — flexible field for verse refs, etc.
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
    │   (matched by contentful_id)
    └── Log sync event
```

---

## Content Ingestion Pipeline

### Phase 1 Pipeline (PDF → Neon)

```
Step 1: Download PDF
        └── Autobiography of a Yogi from spiritmaji.com

Step 2: Convert PDF → Structured Markdown
        └── Using `marker` (open-source, Python)
            or manual extraction + cleanup
        └── Output: chapters as separate .md files
            with headings, paragraphs preserved

Step 3: Human Review / QA
        └── Verify OCR accuracy
        └── Correct spiritual terminology
        └── Ensure chapter/page boundaries are correct
        └── This step is NON-NEGOTIABLE for sacred texts

Step 4: Chunk by Natural Boundaries
        └── Split at paragraph level
        └── Each chunk = one coherent passage
        └── Retain: chapter number, page number, section heading
        └── Target chunk size: 200-500 tokens
            (large enough to be a meaningful quote,
             small enough for precise retrieval)
        └── Include 1-sentence overlap with adjacent chunks

Step 5: Generate Embeddings
        └── OpenAI text-embedding-3-small (1536 dimensions)
        └── Cost: ~$0.02 per 1M tokens
        └── Entire Autobiography of a Yogi: < $0.10

Step 6: Insert into Neon
        └── Populate books, chapters, book_chunks tables
        └── Verify: test searches return expected passages

Step 7: Compute Chunk Relations (ADR-034)
        └── For each new chunk, compute cosine similarity
            against all existing chunks
        └── Store top 30 most similar per chunk in chunk_relations
        └── Exclude adjacent paragraphs from same chapter
            (those are already "in context")
        └── Two modes:
            --full       Recompute all relations (after embedding
                         model migration per ADR-032)
            --incremental  Compute only for new/updated chunks
                           and update existing chunks' top-30
                           if new chunks displace current entries
        └── Similarity is symmetric (A→B = B→A), so each pair
            computed once, both directions updated
        └── For Autobiography (~2,000 chunks): ~4M pairs, minutes
        └── For full corpus (~50K chunks): batched, still tractable
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
        └── Generates embedding
        └── Upserts into Neon (matched by contentful_id)

Step 4: Update chunk relations (incremental)
        └── Recompute relations for the updated chunk
            against all existing chunks (1 × N_total)
        └── Update other chunks' top-30 if the updated
            chunk now scores higher than their current #30

Step 5: Search index and relations are always in sync
        with editorial source
```

---

## Phase 1 Bootstrap (ADR-108)

The path from "no code" to "running search" — the ceremony that transforms design documents into a working system.

### Environment Setup

```
1. Repository
   └── pnpm create next-app@latest srf-teachings --typescript --tailwind --app
   └── pnpm add @neondatabase/serverless @anthropic-ai/sdk openai
   └── Copy .env.example → .env.local (see below)

2. Neon Project
   └── Create project in Neon Console (or via MCP)
   └── Enable pgvector extension
   └── Note: connection string (pooled), direct connection string
   └── Create dev branch for local development

3. Database Schema
   └── pnpm add -D dbmate
   └── dbmate up  (runs /migrations/001_initial_schema.sql)
   └── Verify: tables, indexes, hybrid_search function, tsvector trigger

4. Vercel Project
   └── Link repo → Vercel
   └── Set environment variables (see below)
   └── First deploy: verify /api/v1/health returns OK

5. Sentry Project
   └── Create project in Sentry
   └── Configure NEXT_PUBLIC_SENTRY_DSN
   └── Verify error capture with test exception

6. First Content
   └── Run ingestion script (deliverable 1.2)
   └── Verify: pnpm run ingest -- --book autobiography
   └── Check: book_chunks populated, embeddings present
   └── Run: pnpm run relations -- --full
   └── Smoke test: search "How do I overcome fear?" returns results
```

### Environment Variables (`.env.example`)

```env
# Neon PostgreSQL
DATABASE_URL=              # Pooled connection string (for serverless)
DATABASE_URL_DIRECT=       # Direct connection string (for dbmate migrations)

# AI Services (ADR-110)
AWS_REGION=us-east-1       # Bedrock region
CLAUDE_MODEL_CLASSIFY=anthropic.claude-3-5-haiku-20241022-v1:0   # Intent classification
CLAUDE_MODEL_EXPAND=anthropic.claude-3-5-haiku-20241022-v1:0     # Query expansion
CLAUDE_MODEL_RANK=anthropic.claude-3-5-haiku-20241022-v1:0       # Passage ranking (promote to Sonnet if benchmarks warrant)
OPENAI_API_KEY=            # text-embedding-3-small for embeddings

# Observability
NEXT_PUBLIC_SENTRY_DSN=    # Sentry error tracking
SENTRY_AUTH_TOKEN=         # Source map uploads

# Vercel (set in Vercel dashboard, not .env)
# VERCEL_URL — auto-set by Vercel
```

---

## Frontend Design

### Pages

| Route | Purpose | Data Source |
|-------|---------|------------|
| `/` | Home — Today's Wisdom, search bar, thematic doors, "Seeking..." entry points, latest video | Neon (daily passages) + YouTube RSS |
| `/search?q=...` | Search results — ranked verbatim quotes | Neon (hybrid search) |
| `/themes/[slug]` | Topic page — curated passages for a theme, person, principle, or practice | Neon (topic-tagged chunks) |
| `/quiet` | The Quiet Corner — single affirmation, timer, stillness | Neon (affirmations pool) |
| `/books` | The Library — book catalog with editorial descriptions | Contentful (SSG) or Neon (Phase 1) |
| `/books/[slug]` | Book landing page with cover, description, chapter list | Contentful (SSG) or Neon (Phase 1) |
| `/bookmarks` | Lotus Bookmarks — saved chapters and passages (client-only, `localStorage`) | `localStorage` (no server) |
| `/books/[slug]/[chapter]` | Chapter reader | Contentful (SSG) or Neon (Phase 1) |
| `/books/[slug]/[chapter]#chunk-[id]` | Deep link to specific passage | Same as above, scrolled to passage |
| `/passage/[chunk-id]` | Single passage shareable view (Open Graph optimized) | Neon |
| `/about` | About SRF, Yogananda, the line of gurus, "Go Deeper" links | Static (ISR) |
| `/events` | Gatherings & Events — convocation, commemorations, online events, retreats | Static (ISR) |
| `/places` | Sacred Places — SRF/YSS properties and biographical sites | Neon `places` table (ISR) |
| `/places/[slug]` | Individual place detail with book cross-references | Neon `places` + `chunk_places` (ISR) |
| `/videos` | Video library — categorized by playlist | YouTube API (ISR) |
| `/videos/[category]` | Filtered view (e.g., How-to-Live, Meditations) | YouTube API (ISR) |

### Search Results Component

```
┌──────────────────────────────────────────────────────────┐
│  🔍  How do I overcome fear?                    [Search] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  5 passages found across 2 books                         │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │                                                    │  │
│  │  "The soul is ever free; it is deathless,          │  │
│  │   birthless, ever-existing, ever-conscious,        │  │
│  │   ever-new Bliss. When by meditation you           │  │
│  │   realize this truth, fear will have no hold       │  │
│  │   on you."                                         │  │
│  │                                                    │  │
│  │  Autobiography of a Yogi · Chapter 26 · p. 312    │  │
│  │                               Read in context →   │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │                                                    │  │
│  │  "Fear is the greatest enemy of man. It robs him   │  │
│  │   of his true nature, of his joy, of his power     │  │
│  │   to act wisely."                                  │  │
│  │                                                    │  │
│  │  Man's Eternal Quest · "Removing the Mask" · p. 87│  │
│  │                               Read in context →   │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  ...                                               │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Opening Moment — Portal Threshold (ADR-043)

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
│                                                               │
│                                                               │
│                                                               │
│          "Have courage. Whatever you are going through        │
│           will pass. Trust in God's plan for you."            │
│                                                               │
│          — Where There Is Light, p. 42                        │
│                                                               │
│                                    Show me another            │
│                                                               │
│  ─────────────────────────────────────────────────────────── │
│                                                               │
│                    What are you seeking?                       │
│             [________________________________] [Search]       │
│                                                               │
│  ─────────────────────────────────────────────────────────── │
│                                                               │
│         ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│         │  Peace   │  │ Courage  │  │ Healing  │            │
│         └──────────┘  └──────────┘  └──────────┘            │
│         ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│         │   Joy    │  │ Purpose  │  │   Love   │            │
│         └──────────┘  └──────────┘  └──────────┘            │
│                                                               │
│  ─────────────────────────────────────────────────────────── │
│                                                               │
│   Seeking...                                                  │
│                                                               │
│   · Peace in a restless mind                                  │
│   · Comfort after loss                                        │
│   · Purpose and direction                                     │
│   · Courage through fear                                      │
│   · The heart to forgive                                      │
│                                                               │
│  ─────────────────────────────────────────────────────────── │
│                                                               │
│   Latest from @YoganandaSRF                                   │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│   │ ▶ thumb │  │ ▶ thumb │  │ ▶ thumb │      View all →     │
│   │ title   │  │ title   │  │ title   │                     │
│   └─────────┘  └─────────┘  └─────────┘                     │
│                                                               │
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
- "Show me another" link fetches a different random passage (client-side fetch to `/api/v1/daily-passage?exclude=[current-chunk-id]`). The same passage is never shown twice in a row. (ADR-046)
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

**API:**

```
GET /api/v1/daily-passage
  Query params:
    language  (optional)  — default 'en'
    exclude   (optional)  — chunk ID to exclude (prevents repeat on "Show me another")

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

Six **quality** theme cards displayed below the search bar. Each links to `/themes/[slug]`. Only themes with `category = 'quality'` appear here — the homepage grid stays calm and stable. (ADR-048)

**Card design:**
- Minimal: theme name in Merriweather Light, centered on a warm cream card
- Subtle `--srf-gold` border on hover
- No icons, no images, no descriptions — the single word is the invitation
- Cards use `--portal-quote-bg` background, transitioning to `--srf-gold` left border on hover

**"Explore all themes" link:** Below the six doors, a quiet text link ("Explore all themes →") leads to `/themes`, which organizes all theme categories into distinct sections. This page is also linked from the Library. (ADR-048, ADR-058)

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
- **Cultural adaptation (Phase 11):** The "Seeking..." entry points are deeply English-idiomatic ("The heart to forgive," "Peace in a restless mind"). These need cultural adaptation, not mechanical translation. Treat them as **editorial content per locale** — each language's reviewer may rephrase, reorder, or replace entry points to match cultural expression. Include these in the ADR-023 human review scope alongside UI strings.
- Mobile: full-width, stacked list
- This section is below the fold — a deliberate choice. The above-the-fold experience (Today's Wisdom + search bar) is for all visitors; this section is for the ones who scroll because they need more

**DELTA alignment:** No behavioral profiling. The entry points are the same for every visitor. They are informed by aggregated search trends ("What is humanity seeking?"), not individual tracking.

### The Library (`/books`) and Book Landing Page (`/books/[slug]`)

The library is how seekers browse and discover books. Even with a single book in Phase 2, the page should feel like the entrance to a real library — warm, unhurried, and honest about what's inside.

#### The Library (`/books`)

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│   The Library                                                 │
│                                                               │
│   The published teachings of Paramahansa Yogananda,           │
│   freely available for seekers everywhere.                    │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │   [cover]   Autobiography of a Yogi                    │  │
│  │             Paramahansa Yogananda · 1946                │  │
│  │                                                        │  │
│  │             "A remarkable account of a spiritual        │  │
│  │              quest that has inspired millions..."       │  │
│  │                                                        │  │
│  │             48 chapters                                 │  │
│  │                                                        │  │
│  │             Begin reading →   ·   Find this book →     │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ─── 🪷 ───                                                  │
│                                                               │
│   More books are being added to the library.                  │
│   Explore all of Yogananda's published works at the           │
│   SRF Bookstore →                                             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Design principles:**
- **Warm, not empty.** Even with one book, the page should feel intentional — not like a placeholder or a broken catalog.
- **Honest about scope.** "More books are being added" is truthful and forward-looking. No fixed promises, no dates.
- **The SRF Bookstore link** is a natural signpost: seekers can explore the full catalog of physical books while the digital library grows.
- **Each book entry is a generous card** — not a cramped grid item. Whitespace, the cover image (if available from SRF), and a brief editorial description give each book the space it deserves.
- **No "empty state" design needed in Phase 2** — there will always be at least one book.

**Book card contents:**
- Cover image (if available; graceful fallback to a warm cream card with title in Merriweather)
- Title (Merriweather 700, `--srf-navy`)
- Author · publication year (Open Sans 400, `--portal-text-muted`)
- Brief editorial description (2–3 sentences, Merriweather 300 — not AI-generated, written by the editorial team or drawn from SRF's existing book descriptions)
- Chapter count
- "Begin reading →" link to chapter 1
- "Find this book →" link to SRF Bookstore

**Phase 5 growth:** As Wave 2a–2d books are ingested, the library page naturally fills out. The layout scales from 1 book to 15+ without redesign. Books are ordered by ingestion priority (ADR-012), which mirrors life-impact ordering.

**Phase 11 multi-language:** The library shows books available in the user's language, plus an "Also available in English" section for untranslated works (per ADR-020 content availability matrix).

**API:** `GET /api/v1/books` (already defined). Returns all books with metadata, chapter count, and slugs.

#### Book Landing Page (`/books/[slug]`)

The landing page for each individual book — the table of contents.

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│   [cover image, centered, generous size]                      │
│                                                               │
│   Autobiography of a Yogi                                     │
│   Paramahansa Yogananda · First published 1946                │
│                                                               │
│   "This book will change the lives of millions.               │
│    It will be my messenger when I am gone."                   │
│    — Paramahansa Yogananda                                    │
│                                                               │
│   A spiritual classic that has introduced millions to         │
│   the teachings of meditation and the science of yoga.        │
│                                                               │
│   Begin reading →   ·   Find this book →                     │
│                                                               │
│  ─── 🪷 ───                                                  │
│                                                               │
│   Chapters                                                    │
│                                                               │
│    1. My Parents and Early Life                               │
│    2. My Mother's Death and the Mystic Amulet                │
│    3. The Saint with Two Bodies (Swami Pranabananda)          │
│    4. My Interrupted Flight Toward the Himalaya              │
│    ...                                                        │
│   48. At Encinitas in California                              │
│                                                               │
│  ─── 🪷 ───                                                  │
│                                                               │
│   About this book                                             │
│   [longer editorial description, publication history]         │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Chapter list design:**
- Each chapter is a link: chapter number + title
- Style: Merriweather 400, `--portal-text`, with `--srf-gold` number. Subtle hover underline.
- Chapter numbers in `--srf-gold` create a visual rhythm down the page (1, 2, 3...) without heavy styling.
- Clicking any chapter navigates to `/books/[slug]/[chapter]`
- Lotus bookmark indicator: if the reader has bookmarked a chapter (ADR-041), a small filled lotus appears beside it

**Book metadata:**
- Cover image (centered, max 300px wide, with subtle `--portal-quote-bg` background card behind it if the image has a white background)
- Title in Merriweather 700, `--srf-navy`, `--text-2xl`
- Author + publication year in Open Sans 400, `--portal-text-muted`
- An optional featured quote about or from the book (Merriweather 300, italic)
- Editorial description (2–4 sentences)
- "Begin reading →" link to chapter 1
- "Find this book →" link to SRF Bookstore

**API:** Chapters are served by a new endpoint or the existing `GET /api/v1/books` extended with a `?include=chapters` parameter. The book landing page can also be SSG'd from the database at build time.

### Book Reader (`/books/[slug]/[chapter]`)

The reader is the portal's primary experience — where seekers spend the most time. It must feel like reading a physical book, not scrolling a web page.

#### Reading Typography

The single most important typographic decision: **line length**. Optimal for extended reading is 65–75 characters per line. The reader enforces `max-width: 38rem` (~608px) on the text column regardless of screen width. Wide screens get wider margins — not wider text.

```
┌──────────────────────────────────────┬──────────────────────┐
│           96px margin                 │                      │
│  ┌──────────────────────────────┐    │  Related Teachings   │
│  │                              │    │                      │
│  │  Chapter 14: An Experience   │    │  ┌────────────────┐ │
│  │  in Cosmic Consciousness     │    │  │ "The experience │ │
│  │                              │    │  │  of samadhi..." │ │
│  │  "My body became immovably   │    │  │                 │ │
│  │   rooted; breath was drawn   │    │  │  — Man's Eternal│ │
│  │   out of my lungs as if by   │    │  │    Quest, p.201 │ │
│  │   some huge magnet. Soul     │    │  │  Read this →    │ │
│  │   and mind instantly lost    │    │  └────────────────┘ │
│  │   their physical bondage..." │    │                      │
│  │                              │    │  ┌────────────────┐ │
│  │   — p. 184                   │    │  │ "When the soul  │ │
│  │                              │    │  │  ascends to..." │ │
│  │  [next paragraph...]         │    │  │                 │ │
│  │                              │    │  │  — God Talks    │ │
│  └──────────────────────────────┘    │  │    Vol.1, p.87  │ │
│           96px margin                 │  │  Read this →    │ │
│                                       │  └────────────────┘ │
│                                       │                      │
│                                       │  ┌────────────────┐ │
│                                       │  │ ▶ "Meditation   │ │
│                                       │  │   & the Soul"   │ │
│                                       │  │   (4:32)        │ │
│                                       │  └────────────────┘ │
│                                       │                      │
│                                       │  Explore all →       │
└──────────────────────────────────────┴──────────────────────┘
```

**Typography rules for the reader:**

| Property | Value | Rationale |
|----------|-------|-----------|
| Max text width | `38rem` (~65-75 chars) | Optimal reading line length. **CJK note (Phase 11):** 38rem holds ~30–35 CJK characters per line — within the traditional optimal range for Japanese (25–40 chars/line). Line height should tighten from 1.8 to 1.6–1.7 for CJK text. Validate with actual translated content before launch. |
| Font | Merriweather 400 | Serif for extended reading |
| Size | `--text-base` (18px) | Comfortable for long reading sessions |
| Line height | `--leading-relaxed` (1.8) | Spacious for contemplation |
| Paragraph spacing | `--space-6` (1.5rem) | Clear paragraph separation |
| Chapter title | Lora 400 at `--text-xl` | Distinct from body, not competing |
| Page numbers | `--portal-text-muted`, inline margin notation | Present but unobtrusive |

#### Related Teachings Side Panel (ADR-034)

The right side panel displays passages from *other books* that are semantically related to the paragraph the seeker is currently reading. It updates quietly as the reader settles on each paragraph.

**Reading focus detection (ADR-062) — the "settled paragraph" model:**
- Intersection Observer watches all paragraphs within a **focus zone** (upper-middle 45% of the viewport, `rootMargin: "-20% 0px -35% 0px"` — biased toward where readers' eyes naturally rest)
- Each visible paragraph gets a **prominence score**: `intersectionRatio × elementHeight` — favors the paragraph the reader is immersed in, not a one-liner passing through
- A **1.2-second debounce** prevents updates during active scrolling. Only when scrolling stops for 1.2s does the highest-prominence paragraph become the "settled paragraph"
- If the settled paragraph changes, the side panel crossfades (300ms) to the new relations
- **Source indication:** the side panel header shows the first ~40 characters of the settled paragraph (*"Related to: 'My body became immovably...'"*) — closing the feedback loop without adding any chrome to the main text column

**Dwell mode as manual override (ADR-038, ADR-062):**
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
- By content type: Books / Videos (once transcripts exist, Phase 13)
- By language (when multi-language content available, Phase 11)
- By topic (Peace, Courage, Christ, Meditation, Yoga Sutras, etc.)

**Data source and loading strategy (ADR-062):**

Pre-computed `chunk_relations` table. If filtering yields < 3 results from the pre-computed top 30, fall back to a real-time vector similarity query with the filter as a WHERE clause.

Loading varies by connection quality (screen width determines presentation, data budget determines loading — two independent axes):

| | Wide screen (≥ 1024px) | Narrow screen (< 1024px) |
|---|---|---|
| **Good connection** | Side panel visible. Batch prefetch all chapter relations on load (`GET /api/v1/chapters/[slug]/[number]/relations`, ~30–50KB). All subsequent updates are local cache lookups — zero network during reading. | Pill visible. Same batch prefetch — tap shows pre-loaded results instantly. |
| **Slow/metered (3G)** | Side panel visible. Loads on-demand when settled paragraph changes (not prefetched). | Pill visible. Tap triggers single API call for current paragraph. |
| **Save-Data / text-only / 2G** | No panel. "Continue the Thread" at chapter end only (part of page render, zero extra cost). | No pill. "Continue the Thread" only. |

Detection uses `navigator.connection` (Network Information API) where available, with viewport width as the independent presentation axis.

**API:**

```
GET /api/v1/chunks/[chunk-id]/related
  Query params:
    limit      (optional) — default 3, max 20
    book_id    (optional) — filter to a specific book
    language   (optional) — filter to a specific language
    theme_id   (optional) — filter to a specific teaching topic
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
    "source": "precomputed"  // or "realtime" if fallback was used
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
│  Related Teachings    │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│  "My body became..."  │
│                      │
│  [3 related passages] │
│                      │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│  Continue the Thread  │
│                      │
│  These themes —       │
│  cosmic consciousness,│
│  the eternal soul —   │
│  appear across the    │
│  library:             │
│                      │
│  ┌────────────────┐  │
│  │"The soul's     │  │
│  │ nature is      │  │
│  │ infinite..."   │  │
│  │ — The Divine   │  │
│  │   Romance p.142│  │
│  └────────────────┘  │
│  + 2 more             │
│                      │
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

**Implementation:** Query `chunk_relations` for all chunks in the current chapter, aggregate by target, deduplicate, rank by max similarity, filter to other books, take top 3. This data is included in the batch prefetch response (`/api/v1/chapters/[slug]/[number]/relations`) for batch-tier connections.

#### Physical Book Bridge

Every passage in the reader, search results, and shared passage pages includes a quiet "Find this book" link alongside "Read in context." This links to the SRF Bookstore page for the physical book.

- Supports DELTA's Embodiment principle (the physical book is the ultimate embodied reading experience)
- Not a sales pitch — a signpost, same as the "Go Deeper" links
- Style: small text link in `--portal-text-muted`, positioned near the citation

```
— Autobiography of a Yogi, Chapter 14, p. 184
                        Read in context →  ·  Find this book →
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
- **Non-Latin font support (Phase 11):** Print stylesheet must be locale-aware. Font-family falls back per script: Noto Serif JP for Japanese, Noto Serif Devanagari for Hindi, Noto Serif Bengali for Bengali. CJK text at 10.5pt (equivalent optical size to 11pt Latin). Define per-locale `@media print` font stacks alongside the web font stacks.

#### Reader Typography Refinements (ADR-037)

The reader's typographic details signal care and reverence for the words. These are the micro-details that distinguish a sacred text presentation from a blog post:

**Drop capitals:** Each chapter opens with a drop capital — Merriweather 700, `--srf-navy`, spanning 3 lines. Uses CSS `::first-letter`. A tradition from illuminated manuscripts signaling "something begins here." **Language-conditional (Phase 11):** Drop capitals are enabled for Latin-script languages only. CSS `::first-letter` behaves unpredictably with CJK and Indic scripts, and the illuminated-manuscript tradition is Western. For Japanese, Hindi, and Bengali, substitute a culturally appropriate chapter-opening treatment: generous whitespace with a subtle `--srf-gold` rule above the first paragraph.

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

#### "Dwell" Interaction — Passage Contemplation Mode (ADR-038)

When reading a physical book, a profound passage stops you mid-page. The reader needs a way to dwell *within* the reading experience — not leave it.

**Trigger:** Long-press (mobile, 500ms). Desktop: click the hover-revealed dwell icon (ADR-060). Keyboard: `d` key on focused paragraph. Double-click was considered and rejected — it conflicts with the universal word-selection behavior in every browser.

**Discoverability (ADR-060):** On desktop, hovering over a paragraph for 1.5 seconds reveals a small dwell activation icon at the paragraph's inline-start margin — a 12px circle in `--srf-gold` at 40% opacity. Clicking the icon enters dwell mode. Moving the cursor away fades the icon out. On first visit, a one-time tooltip appears: *"Hover over any passage to focus on it for contemplation."*

**Related Teachings connection (ADR-062):** When dwell activates, the Related Teachings side panel immediately updates to show relations for the dwelled paragraph — bypassing the normal settled-paragraph debounce. Dwell serves a dual purpose: contemplative focus *and* explicit Related Teachings selection.

**Effect:**
1. Surrounding text dims to 15% opacity over 600ms
2. The selected passage remains fully vivid
3. Background warms slightly to `--portal-quote-bg`
4. Share icon and citation appear quietly below the passage
5. Lotus bookmark icon (ADR-041) appears alongside the share icon

**Exit:** Tap/click anywhere else, or press `Escape`. Everything returns to normal over 300ms.

**No modal, no popup, no overlay.** The passage simply *comes forward* in its existing position. This mirrors what happens naturally in physical reading: your eyes narrow focus, the world around the words softens.

```
┌──────────────────────────────────────┐
│                                       │
│  [dimmed text at 15% opacity]         │
│  [dimmed text at 15% opacity]         │
│                                       │
│  "Soul and mind instantly lost their  │  ← Full opacity, warm bg
│   physical bondage and streamed out   │
│   like a fluid piercing light from    │
│   my every pore..."                   │
│                                       │
│   — p. 184        🪷 📎              │  ← Bookmark + Share
│                                       │
│  [dimmed text at 15% opacity]         │
│  [dimmed text at 15% opacity]         │
│                                       │
└──────────────────────────────────────┘
```

**Accessibility:**
- `Escape` exits dwell mode
- Screen readers announce "Passage focused for contemplation" / "Returned to reading"
- `prefers-reduced-motion`: transitions are instant (0ms), dimming still occurs

#### Time-Aware Reading — Circadian Color Temperature (ADR-039)

The portal subtly shifts its warmth based on the time of day. **On by default, opt-out via a toggle.**

| Band | Hours | Background | Character |
|------|-------|------------|-----------|
| Morning | 5:00–9:59 | `#FDFBF8` (cooler cream) | Crisp, like morning light |
| Midday | 10:00–15:59 | `#FAF8F5` (standard) | The baseline palette |
| Evening | 16:00–20:59 | `#F7F2EC` (warmer cream) | Golden hour warmth |
| Night | 21:00–4:59 | `--srf-navy` bg, cream text | Restful, low-light |

**Implementation:** A small client-side script (~20 lines) runs once on page load, sets `data-time-band` attribute on `<html>`. CSS custom properties apply the appropriate palette. No polling, no intervals. Computed entirely from `new Date().getHours()` — no data sent to server, no tracking. DELTA-compliant by design.

**Toggle:** Sun/moon icon in reader header and site settings. Cycles: Auto (default) → Light (always midday) → Dark (always night). Stored in `localStorage`.

**Interaction with OS preferences:** If `prefers-color-scheme: dark` is active, it overrides time-banding — the user's OS preference is always respected.

#### "Breath Between Chapters" — Chapter Transition Pacing (ADR-040)

When navigating between chapters via prev/next (not deep links):

1. A **1.2-second pause** — only the chapter title (Lora 400, `--text-xl`) centered on warm cream. No other elements visible.
2. Chapter text **fades in** over 400ms.
3. **`prefers-reduced-motion`:** Skipped entirely. Instant load.
4. **Deep links and search results:** Skip the breath — immediate content access.

No loading spinner is ever shown. This is silence, not waiting.

#### Lotus Bookmark — Account-Free Reading Bookmarks (ADR-041)

A lightweight, private bookmarking system using `localStorage`:

**Chapter bookmark:** Small lotus icon (SVG, `--srf-gold` at 50% opacity, 20px) in the reader header beside the chapter title. Click to fill (bookmark), click again to remove. The lotus was chosen because it carries meaning: *a lotus marks where light was found*.

**Passage bookmark:** In dwell mode, a lotus icon appears alongside the share icon. Bookmarks the specific paragraph.

**Bookmarks page (`/bookmarks`):** Lists all bookmarked chapters and passages organized by book. Each entry shows book title, chapter title, and (for passages) the first line with citation. Clicking navigates to that position.

**Storage:** `localStorage` under `srf-portal:bookmarks`. No server, no accounts, no tracking. Clearing browser data removes bookmarks. This is stated clearly on the bookmarks page.

**Phase 15 migration:** When optional accounts arrive, `localStorage` bookmarks are offered for import and server sync.

#### Keyboard-First Reading Navigation (ADR-042)

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
- Keyboard navigation: full vim-style shortcuts (see above, ADR-042)
- Skip link: "Skip to chapter text" at page top
- Each paragraph is an `<article>` with `role="article"` and `aria-label` including page number
- Font size adjustable via `Ctrl`+`+`/`-` (browser native) — no custom control until Phase 12
- `prefers-reduced-motion`: side panel updates without animation, dwell transitions instant, breath between chapters skipped, opening moment skipped
- Dwell mode: screen reader announcements on enter/exit
- All keyboard shortcuts suppressed when input elements have focus

### The Quiet Corner (`/quiet`)

A single-purpose page designed for the moment of crisis. When someone arrives at 2 AM unable to sleep because of anxiety, they don't need a search engine — they need a hand to hold.

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│                                                               │
│                                                               │
│                                                               │
│                                                               │
│         "I am submerged in eternal light.                     │
│          It permeates every particle of my being.             │
│          I am living in that light."                          │
│                                                               │
│         — Scientific Healing Affirmations                     │
│                                                               │
│                                                               │
│                                                               │
│              ○ 1 min    ○ 5 min    ○ 15 min                  │
│                                                               │
│                      [ Begin ]                                │
│                                                               │
│                                                               │
│                                                               │
│                                                               │
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

**Constraints:**
- No tracking. No history. No "sessions completed." No streaks.
- No ambient sound loops or background music (the user brings their own silence)
- No account required
- The timer is purely client-side (a simple `setTimeout` + Web Audio API chime)
- Accessible: the chime has a visual equivalent (gentle screen flash) for hearing-impaired users

### About Section (`/about`)

The About page serves first-time visitors who don't know Yogananda or SRF. It is the front door for the uninitiated and the natural bridge from the portal to SRF's broader mission.

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│   About This Portal                                           │
│                                                               │
│   This portal makes the published teachings of                │
│   Paramahansa Yogananda freely available to seekers           │
│   worldwide. It was made possible by a philanthropic          │
│   endowment dedicated to expanding access to these            │
│   sacred writings.                                            │
│                                                               │
│   ─────────────────────────────────────────────────────────  │
│                                                               │
│   Paramahansa Yogananda (1893–1952)                           │
│                                                               │
│   ┌───────────┐  Paramahansa Yogananda is the author of      │
│   │           │  Autobiography of a Yogi and founder of       │
│   │  [photo]  │  Self-Realization Fellowship. He brought      │
│   │           │  India's ancient science of meditation        │
│   └───────────┘  to the West in 1920...                      │
│                                                               │
│   ─────────────────────────────────────────────────────────  │
│                                                               │
│   The Line of Gurus                                           │
│                                                               │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                   │
│   │Babaji│  │Lahiri│  │ Sri  │  │Yoga- │                    │
│   │      │  │Maha- │  │Yuktes│  │nanda │                    │
│   │      │  │ saya │  │ war  │  │      │                    │
│   └──────┘  └──────┘  └──────┘  └──────┘                   │
│   Mahavatar  Lahiri     Swami    Paramahansa                  │
│   Babaji     Mahasaya   Sri      Yogananda                    │
│                         Yukteswar                             │
│                                                               │
│   ─────────────────────────────────────────────────────────  │
│                                                               │
│   Self-Realization Fellowship                                 │
│   Founded 1920 · Los Angeles, California                      │
│   [Brief description of SRF's mission and aims and ideals]   │
│                                                               │
│   ─────────────────────────────────────────────────────────  │
│                                                               │
│   Go Deeper                                                   │
│                                                               │
│   → SRF Lessons (home-study meditation program)               │
│   → Find a meditation group near you                          │
│   → Online meditation events                                  │
│   → Visit an SRF temple or retreat                            │
│   → SRF Bookstore                                             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Content sections:**

| Section | Content | Image |
|---------|---------|-------|
| **Introduction** | What this portal is, the philanthropic origin, what "free access" means | None |
| **Paramahansa Yogananda** | Brief biography (3–4 paragraphs). Born in India, came to America in 1920, wrote Autobiography of a Yogi, established SRF. | Official portrait — positioned like a book frontispiece |
| **The Line of Gurus** | The four gurus in sequence: Babaji, Lahiri Mahasaya, Sri Yukteswar, Yogananda. One sentence each. | Official portrait for each guru, displayed in chronological sequence |
| **Self-Realization Fellowship** | SRF's mission, aims and ideals, global presence. Non-promotional — informational. | None (or a single photo of Mount Washington headquarters) |
| **Go Deeper** | Links to SRF Lessons, center locator, Online Meditation Center, bookstore, temples and retreats. The answer to "I've read these passages and want more." | None |

The "Go Deeper" section is the most important part of this page. It is the natural bridge from reading to practice — the moment when the portal fulfills DELTA's Embodiment principle by pointing the seeker back to their physical, spiritual life.

### Navigation Structure

**Header (persistent, all pages):**

```
┌──────────────────────────────────────────────────────────────┐
│  ☸ SRF Teaching Portal    Search  Books  Videos  Magazine  Quiet  About│
└──────────────────────────────────────────────────────────────┘
```

- ☸ = SRF lotus mark (small, links to homepage)
- Primary nav: Search, Books, Videos, Magazine, Quiet Corner, About
- Mobile: collapses to hamburger menu
- No notification badges. No user avatar. No bell icon. The nav is purely navigational.

**Footer (persistent, all pages):**

```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  SRF Resources                                                │
│  · yogananda.org            · SRF Lessons                     │
│  · Online Meditation Center · SRF Bookstore                   │
│  · Find a Center Near You   · SRF/YSS App                    │
│  · @YoganandaSRF (YouTube)                                    │
│                                                               │
│  ─────────────────────────────────────────────────────────── │
│                                                               │
│  The teachings of Paramahansa Yogananda,                      │
│  made freely available to seekers worldwide.                  │
│                                                               │
│  © Self-Realization Fellowship                                │
│                                                               │
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
<meta property="og:title" content="Paramahansa Yogananda" />
<meta property="og:description" content="The soul is ever free; it is deathless, birthless..." />
<meta property="og:image" content="/api/v1/og/[chunk-id]" />  <!-- generated image -->
<meta property="og:url" content="https://teachings.yogananda.org/passage/[chunk-id]" />
<meta property="og:site_name" content="SRF Teaching Portal" />
```

**Quote image generation:**
- API route: `GET /api/v1/og/[chunk-id]`
- Uses `@vercel/og` (Satori) to render a PNG: passage text in Merriweather on warm cream, citation below, subtle SRF lotus mark, portal URL at bottom
- Same image used for OG cards and "Save as image" download
- Suitable for messaging apps, social media, printing, phone wallpaper
- **Non-Latin script support (Phase 11):** Satori requires explicit font files for non-Latin characters — it does not fall back to system fonts. A Japanese or Hindi quote image will render as empty boxes unless the build bundles Noto font subsets for each active script. The OG image route must select the correct font based on the passage's `language` column. Font map: `ja` → Noto Serif JP, `hi` → Noto Serif Devanagari, `bn` → Noto Serif Bengali. All Latin-script languages use Merriweather.

**Email sharing (ADR-059):**
- "Email this passage" opens the seeker's email client via `mailto:` link
- Subject: `"{First 8 words}..." — Paramahansa Yogananda`
- Body: passage text, citation, `Read in context: https://teachings.yogananda.org/passage/{chunk-id}`
- No server-side email infrastructure needed — the seeker's own email client handles sending
- Chapter/book email: sends a link to the chapter, not the full text

**PDF generation (ADR-059):**
- Passage PDF: single A4 page — Merriweather 14pt, warm cream background, citation, lotus watermark (8% opacity, bottom-right), portal URL
- Chapter PDF (Phase 8): cover page, running headers, page numbers, drop capitals, lotus watermark on first page
- Book PDF (Phase 8): title page, table of contents, all chapters, colophon
- API: `GET /api/v1/pdf/passage/{chunk-id}`, `GET /api/v1/pdf/chapter/{book-slug}/{chapter}`, `GET /api/v1/pdf/book/{book-slug}`

**Share menu:**

```
  ┌─────────────────────────┐
  │  Copy link              │
  │  Email this passage     │
  │  Save as image          │
  │  Save as PDF            │
  └─────────────────────────┘
```

**Share UI element:**
- A small, quiet share icon (link/chain icon, not social media logos)
- On click: opens share menu (above)
- No row of social media buttons. No third-party tracking scripts. The seeker chooses the medium.

### Image Usage Guidelines

(See ADR-016 for full rationale, ADR-045 for portal imagery strategy.)

**Core principle: The reading experience is text-only.** No images appear in the book reader column. Imagery would compete with Yogananda's words, and his words always win. The portal's design is photo-optional — every layout works without images. (ADR-045)

**Guru photographs:**

| Context | Usage | Notes |
|---------|-------|-------|
| About page — lineage display | All four guru portraits in sequence | Primary location for guru images |
| About page — Yogananda bio | Yogananda portrait as author photo | Frontispiece positioning |
| Quiet Corner | Single small Yogananda portrait above affirmation | Liturgically appropriate — devotees meditate with guru's image |
| Book landing pages | Yogananda portrait as author photo | One per book, not per chapter |
| Site footer | Small sepia-toned portrait (~48-60px) beside "Teachings of Paramahansa Yogananda" | Attribution, not decoration. Present on every page. (ADR-045) |
| Everywhere else | **No guru images** | Restraint creates reverence |

**Nature/property photographs from SRF:**

| Context | Image Type | Treatment |
|---------|-----------|-----------|
| Homepage hero | Wide, soft-focus SRF property (Encinitas, Lake Shrine) | Today's Wisdom overlaid in white Merriweather on semi-transparent `--srf-navy` band. Updated seasonally (4 images/year). Graceful degradation to text-only if no image. (ADR-045) |
| Quiet Corner background | Desaturated nature at 5–8% opacity beneath warm cream | A hint of sky, a suggestion of water. Applied via `background-image` with low opacity. Optional — `--portal-bg-alt` alone is sufficient. (ADR-045) |
| Theme pages | Nature per theme (still water → Peace, mountains → Courage) | Ambient, never dominant. Muted. |
| 404 page | SRF garden photograph | Gentle error with: "This page doesn't exist, but perhaps you were meant to find this instead..." + search bar |

**Rules:**
- Never crop, filter, or apply effects to guru photographs
- Never use guru images adjacent to UI controls or in error/loading states
- **Never use stock photography.** SRF images or no images. The warm cream palette and gold lotus motif are sufficient to create a sacred atmosphere without photographs. (ADR-045)
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
  --srf-gold:           #dcbd23;  /* Donate button, lotus accent, primary CTA border */
  --srf-orange:         #de6a10;  /* Hover states, warm accent, X/social icon */
  --srf-navy:           #1a2744;  /* Logo wordmark, primary headings, nav text (estimated from assets) */
  --srf-white:          #ffffff;  /* Backgrounds, button text on dark */

  /* === Secondary Colors (from Online Meditation Center) === */
  --srf-orange-warm:    #f7882f;  /* OMC form submit buttons, warm CTA variant */
  --srf-gold-light:     #ffcf6f;  /* OMC focus ring, light gold accent */
  --srf-blue:           #0274be;  /* Interactive focus states, input focus border */
  --srf-slate:          #6b7a8f;  /* Button hover variant, muted secondary */

  /* === Neutral Scale === */
  --srf-gray-900:       #4c4c4c;  /* Dark body text, checkbox borders */
  --srf-gray-500:       #808088;  /* Secondary UI elements */
  --srf-gray-300:       #cccccc;  /* Borders, dividers, input borders */
  --srf-black:          #000000;  /* High-contrast text */

  /* === Teaching Portal Extensions (Calm Technology) === */
  --portal-bg:          #FAF8F5;  /* Warm cream — softer than pure white */
  --portal-bg-alt:      #F5F0EB;  /* Slightly warmer for alternating sections */
  --portal-quote-bg:    #F9F6F1;  /* Quote card background — warm, papery */
  --portal-text:        #2C2C2C;  /* Primary reading text — softer than black */
  --portal-text-muted:  #595959;  /* Citations, metadata, secondary text (corrected from #6B6B6B for WCAG AA contrast on cream) */

  /* === Time-Aware Reading Bands (ADR-039) — defined in Phase 12 === */
  /* --portal-bg-morning, --portal-bg-evening, --portal-bg-night, --portal-text-night
     are introduced when circadian color temperature is implemented. */

  /* === Semantic Colors === */
  --color-error:        #d32f2f;  /* Errors (refined from raw "red") */
  --color-error-bg:     rgba(242, 38, 19, 0.1);  /* Error background (softened) */
  --color-success:      #2e7d32;  /* Success states */

  /* === Lotus Icon Color System (from SVG assets on yogananda.org) === */
  /* SRF uses a family of lotus icons in these accent colors: */
  --lotus-orange:       #de6a10;  /* lotus-1, lotus-10, lotus-13 */
  --lotus-yellow:       #dcbd23;  /* lotus-5, lotus-6 */
  --lotus-blue:         #0274be;  /* lotus-7 */
  --lotus-green:        #4a7c59;  /* lotus-5, lotus-6, lotus-7, lotus-12, lotus-13, lotus-14 (estimated) */
  --lotus-black:        #1a2744;  /* lotus-1, lotus-10, lotus-11, lotus-14 */
  /* Each color has _light and _dark background variants */
}
```

#### Typography

```css
:root {
  /* === Font Families (extracted from SRF Online Meditation Center) === */
  --font-serif:         'Merriweather', Georgia, 'Times New Roman', serif;
  --font-serif-alt:     'Lora', Georgia, serif;
  --font-sans:          'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* === Font Scale === */
  --text-xs:            0.75rem;   /* 12px — labels, fine print */
  --text-sm:            0.9375rem; /* 15px — captions, metadata */
  --text-base:          1.125rem;  /* 18px — body text, standard reading */
  --text-lg:            1.375rem;  /* 22px — large body, form inputs */
  --text-xl:            1.75rem;   /* 28px — section headings */
  --text-2xl:           2rem;      /* 32px — page headings */

  /* === Font Weights (Merriweather supports 300, 400, 700) === */
  --font-light:         300;       /* Elegant headings, pull quotes */
  --font-regular:       400;       /* Body text */
  --font-semibold:      600;       /* CTA text (Open Sans) */
  --font-bold:          700;       /* Strong emphasis, section headings */

  /* === Line Heights === */
  --leading-tight:      1.3;       /* Headings */
  --leading-normal:     1.6;       /* Body text — generous for readability */
  --leading-relaxed:    1.8;       /* Book text — spacious for contemplation */

  /* === Letter Spacing === */
  --tracking-wide:      0.125em;   /* Uppercase labels, CTAs (from donate button: 2px at 18px) */
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

#### Spacing, Borders, and Radii

```css
:root {
  /* === Spacing Scale (derived from SRF site patterns) === */
  --space-1:   0.25rem;   /* 4px */
  --space-2:   0.5rem;    /* 8px */
  --space-3:   0.75rem;   /* 12px — button padding-y */
  --space-4:   1rem;      /* 16px — input padding */
  --space-5:   1.25rem;   /* 20px — text block margin */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px — section spacing */
  --space-10:  2.5rem;    /* 40px — heading margin, large gaps */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px — page section separators */
  --space-20:  5rem;      /* 80px — hero spacing */

  /* === Borders (from SRF donate button, OMC forms) === */
  --border-thin:      1px solid;
  --border-standard:  1.5px solid;  /* SRF donate button */
  --border-medium:    2px solid;    /* OMC submit buttons, focus rings */

  /* === Border Radius === */
  --radius-sm:   3px;     /* Subtle rounding */
  --radius-md:   5px;     /* Form inputs (from OMC) */
  --radius-lg:   8px;     /* Cards */
  --radius-pill: 50px;    /* CTA buttons (from OMC submit) */

  /* === Transitions === */
  --transition-standard: all 0.3s ease;  /* From SRF donate button */
}
```

#### Responsive Breakpoints

```css
/* Derived from yogananda.org and OMC Elementor config */
--bp-mobile:          639px;    /* max-width: mobile */
--bp-tablet:          768px;    /* min-width: tablet */
--bp-desktop:         1024px;   /* min-width: desktop (JS nav breakpoint) */
--bp-wide:            1280px;   /* min-width: wide desktop */
--bp-max-content:     1440px;   /* max content width */
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
| Decorative quote marks | Large Merriweather 700, 48px, `--srf-gold` at 40% opacity on all Yogananda passages (ADR-037) |
| Drop capitals | Merriweather 700, `--srf-navy`, 3-line span at chapter starts (ADR-037) |
| Section dividers | Small lotus SVG (16px, `--srf-gold` at 25%) instead of `<hr>` (ADR-044) |
| Time-aware background | Shifts warmth by time of day — opt-out, on by default (ADR-039) |

#### Lotus as Unified Visual Motif (ADR-044)

A **single simplified lotus design** (geometric, 3-petal, SVG) serves as the portal's unified visual motif. The same design everywhere:

| Use | Size | Color | Opacity |
|-----|------|-------|---------|
| Section divider (replaces `<hr>`) | ~16px | `--srf-gold` | 25% |
| Bookmark icon in reader (ADR-041) | 20px | `--srf-gold` | 50% / 100% |
| Favicon | 16/32px | `--srf-gold` | 100% |
| Opening threshold (ADR-043) | ~40px | `--srf-gold` | 30% |
| Quote card accent (optional) | 12px | `--srf-gold` | 20% |

**Design principles:**
- **One design.** Not multiple variants. The same SVG at different sizes and opacities.
- **Never heavy.** Always subtle — low opacity, small scale. Felt, not stared at.
- **Geometric, not photographic.** A minimal line drawing. Must work at 12px.
- **Gold only.** Always `--srf-gold`. No multi-color lotus icons in the portal.
- **Consistency creates recognition, which creates meaning.**

The SVG is defined once as a reusable component, parameterized for size, color, and opacity via CSS custom properties.

#### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400&family=Merriweather:wght@300;400;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
```

---

## Multi-Language Strategy

(See ADR-020 for architectural rationale, ADR-021 for CSS logical properties, ADR-022 for Hindi/Bengali.)

### Three-Layer Localization

| Layer | What | Approach | Phase |
|-------|------|----------|-------|
| **UI chrome** | Nav, labels, buttons, errors, search prompts (~200–300 strings) | `next-intl` with locale JSON files. URL-based routing (`/es/...`, `/de/...`). AI-assisted workflow: Claude drafts → human review → production (ADR-023). | Infrastructure in Phase 2. Translations in Phase 11. |
| **Book content** | Yogananda's published text in official translations | Language-specific chunks in Neon (`language` column). Contentful locales in production. **Never machine-translate sacred text.** | Phase 11 |
| **Search** | FTS, vector similarity, query expansion | Per-language tsvector. Multilingual embedding model. Claude expands queries per language. | Phase 11 |

### Phase 2 — English Only, i18n-Ready

Content is English only. But the i18n infrastructure is in place from day one:

- All UI strings externalized to `messages/en.json` (never hardcoded in components)
- `next-intl` configured with `en` as sole locale
- CSS logical properties throughout (`ms-4` not `ml-4`, `text-align: start` not `text-align: left`)
- `lang="en"` on `<html>` element
- `language` column already present on `book_chunks`, `search_queries`, `email_subscribers`

Adding new locales later is a configuration change, not a codebase refactor.

### URL Structure

```
/                     → English (default, no prefix)
/es/                  → Spanish
/de/search?q=Angst    → German search
/ja/quiet             → Japanese Quiet Corner
/hi/themes/peace      → Hindi theme page
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

— Autobiography of a Yogi, Chapter 26, p. 312  [EN]
                                  Read in English →
```

The `[EN]` tag is a small, muted language indicator. It is honest, not apologetic.

### Language-Specific Search

**Full-text search:** PostgreSQL language dictionaries handle stemming, stop words, and normalization per language.

> **Note:** The `content_tsv` column and its language-aware trigger (defined in § Data Model) already handle per-language full-text search. The trigger maps each chunk's `language` code to the appropriate PostgreSQL dictionary at insert/update time. No additional column or index is needed when new languages are added in Phase 11 — only new content rows with the correct `language` value.

**Vector search:** The embedding model **must be multilingual** — this is an explicit requirement, not an accident. OpenAI's text-embedding-3-small handles multilingual text and places semantically equivalent passages in different languages close together in vector space. This means English embeddings generated in Phase 1 remain valid when Spanish, German, and Japanese chunks are added in Phase 11 — no re-embedding of the English corpus. Any future embedding model migration (ADR-032) must preserve this multilingual property. Benchmark per-language retrieval quality with actual translated passages in Phase 11 (Deliverable 9.10). Switch to per-language models only if multilingual quality is insufficient — but note that per-language models sacrifice the English fallback's vector search quality and cross-language passage alignment.

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

**Cross-language search as optional future feature:** The multilingual embedding model places semantically equivalent text in different languages close together in vector space. If usage data (Phase 11 analytics) reveals demand for searching across all languages simultaneously, this can be enabled by calling `hybrid_search` without the `language` filter. But this is not a core Phase 11 deliverable — locale + English fallback covers the practical need.

### Chunk Relations in a Multilingual Corpus

The `chunk_relations` table stores pre-computed semantic similarity. In a multilingual corpus, a naive "top 30 global" approach would leave non-English languages underserved — most of the 30 slots would be consumed by chunks in other languages (predominantly English, which will be the largest corpus).

**Computation strategy (Phase 11):**
- For each chunk, store **top 30 same-language** relations + **top 10 English supplemental** relations (best from English corpus when the chunk is non-English; empty for English chunks)
- Total: up to 40 rows per chunk (at 400K chunks across all languages = 16M rows — trivial for PostgreSQL)
- Same-language relations power the default "Related Teachings" side panel
- English supplemental relations provide fallback when the same-language corpus is small — a Spanish reader with only 3 Spanish books can still see related English passages in the side panel, clearly marked with `[EN]`
- The `rank` column indicates rank within its group (1–30 for same-language, 1–10 for English supplemental)
- Query pattern: `JOIN book_chunks target ON target.id = cr.target_chunk_id WHERE target.language = :lang` for same-language; add `OR target.language = 'en'` to include English supplemental
- Fallback: when filtered results < 3 (rare with this strategy), fall back to real-time vector similarity with a WHERE clause

This ensures every language gets first-class related teachings, not an afterthought. English supplemental relations are the multilingual equivalent of the search fallback strategy — same pattern, same `[EN]` marking.

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
हिन्दी (Phase 11 Indian wave)
বাংলা (Phase 11 Indian wave)
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
3. **Embedding model must be multilingual.** Explicit requirement (not accident). Ensures Phase 1 embeddings remain valid when Phase 11 adds new languages.
4. **`reader_url` is locale-relative.** API returns `/books/slug/chapter#chunk`. Client prepends locale prefix. API stays presentation-agnostic.
5. **`chunk_relations` store per-language.** Top 30 same-language + top 10 English supplemental per chunk. Ensures non-English languages get first-class related teachings with English fallback.
6. **Locale + English fallback is the multilingual model.** Arbitrary cross-language search (e.g., Japanese query finding German results) is deferred as optional — the practical need is the user's language plus English fallback, not N×N language combinations. The multilingual embedding model enables cross-language search at near-zero cost if usage data later justifies it.
7. **Chunk size must be validated per language (Phase 11).** Token economies differ across scripts — a 300-token chunk in Japanese may hold less semantic content than 300 English tokens. Per-language chunk size benchmarking is required before ingesting non-English content. At minimum, validate that English-calibrated chunk sizes produce acceptable retrieval quality in all target languages.

### Open Questions (Require SRF Input)

1. **Does SRF/YSS have digital text of official translations?** If yes, the ingestion pipeline is straightforward. If only printed books exist, OCR/scanning per language is a massive effort requiring fluent reviewers. This is the single highest-impact question for Phase 11 planning.
2. **Who reviews the AI-drafted UI translations?** Claude drafts locale JSON files (ADR-023), but human review is mandatory — someone fluent in the target language and familiar with SRF's devotional register. SRF may have multilingual monastics or volunteers who can serve as reviewers.
3. **Portal branding for YSS languages (Hindi/Bengali):** Same domain (`teachings.yogananda.org/hi/`) or a YSS-branded domain? This is an SRF/YSS organizational question.
4. **Do translated editions preserve paragraph structure?** If yes, `canonical_chunk_id` alignment during ingestion is straightforward (match by chapter_number + paragraph_index). If translations reorganize content, alignment requires semantic matching — still feasible but requires more QA effort.

---

## Cultural Design Considerations

Each supported locale carries cultural, typographic, and platform expectations that go beyond translation. This section documents what we know, what we need to validate, and what adaptations each culture may require. It is a living reference — updated as Phase 11 implementation progresses and native-speaker reviewers provide input.

### English (en) — Default

- **Primary platforms:** Google, YouTube, Safari/Chrome, email
- **Script:** Latin. All design tokens calibrated for English.
- **Cultural notes:** The portal's warm cream + Merriweather + bibliomantic "Show me another" aesthetic was designed for English spiritual readers. This is the baseline.
- **Open question:** Which edition of *Autobiography of a Yogi* does the portal's pagination reference? SRF study groups worldwide reference specific page numbers. Edition clarity is needed. (ADR-069 provides the `edition` column.)

### Spanish (es) — Wave 11a

- **Primary platforms:** WhatsApp (dominant in Latin America), Google, YouTube, Instagram
- **Script:** Latin. Standard design tokens work. Spanish diacritics (á, é, ñ) render correctly in Merriweather.
- **Cultural notes:** Latin American spiritual culture favors warmth, emotional directness, and relational language. "Seeking..." entry points need cultural *adaptation*, not mechanical translation — e.g., "The heart to forgive" might become "Sanar el corazón" (healing the heart) or "Aprender a soltar" (learning to let go). WhatsApp integration (Phase 9, ADR-085) is high-priority for this audience.
- **Organizational:** SRF (not YSS) serves Latin America directly. Verify whether Latin American SRF centers have their own event calendars for the Events signpost.
- **Open question:** Does SRF have digital text of Spanish translations?

### German (de) — Wave 11a

- **Primary platforms:** Google, YouTube, WhatsApp (growing), email
- **Script:** Latin. Merriweather renders ä, ö, ü, ß correctly.
- **Cultural notes:** German compound words ("Selbstverwirklichung," "Gottverwirklichung," "Überbewusstsein") challenge search. Embedding model must place these near English equivalents — requires explicit testing. ADR-023 glossary specifies formal "Sie" register. German privacy expectations exceed GDPR minimums — the portal's no-tracking approach (ADR-029) is a strong cultural fit, but German seekers may still expect a privacy explanation page. Older SRF Deutschland translations may use different orthography ("Krija" vs "Kriya") — search must handle both.
- **Open question:** Does SRF Deutschland have digital text? Which translations?

### French (fr) — Wave 11a

- **Primary platforms:** Google, YouTube, WhatsApp (Francophone Africa), email
- **Script:** Latin. Standard diacritics (é, è, ê, ç) work in Merriweather.
- **Cultural notes:** Search must be diacritic-insensitive ("méditation" = "meditation"). Francophone Africa (~130M speakers) may be a larger audience than France itself — ADR-061 global equity features (KaiOS, text-only, 2G) are directly relevant. West African French has different spiritual idiom from European French; "Seeking..." entry points need validation with both.
- **Open question:** Do SRF French translations exist in digital form? Is there a distinct Francophone African SRF/YSS community?

### Italian (it) — Wave 11a

- **Primary platforms:** Google, YouTube, WhatsApp, email
- **Script:** Latin. Standard Merriweather rendering.
- **Cultural notes:** Warm cream aesthetic and serif typography align well with Italian book culture. Few Italian SRF centers — Events signpost may feel sparse. Spiritual terminology glossary (ADR-023) is critical — Italian translations may handle Sanskrit terms differently than English.
- **Open question:** Digital text availability from SRF Italian publications.

### Portuguese (pt) — Wave 11a

- **Primary platforms:** WhatsApp (dominant in Brazil), Google, YouTube, Instagram
- **Script:** Latin. Merriweather renders Portuguese diacritics (ã, õ, ç) correctly.
- **Cultural notes:** Brazilian Portuguese and European Portuguese differ in vocabulary, spelling, and idiom. May need `pt-BR` and `pt-PT` as distinct locales or, at minimum, distinct "Seeking..." entry points. Brazil has one of the world's largest yoga communities. WhatsApp integration is not optional for this audience. ADR-061 equity features relevant for Brazil's connectivity inequality.
- **Open question:** Do SRF Brazilian Portuguese translations exist? Is there a Brazilian SRF organizational structure distinct from Portuguese?

### Japanese (ja) — Wave 11a

- **Primary platforms:** LINE (not WhatsApp), Google, YouTube, Twitter/X
- **Script:** CJK (Hiragana, Katakana, Kanji). Requires Noto Serif JP / Noto Sans JP font loading.
- **Typography:** 38rem line width holds ~30–35 CJK characters per line (within optimal 25–40 range). Line height should tighten from 1.8 to 1.6–1.7. Drop capitals are a Western convention — omit for Japanese. Per-language chunk size validation critical (CJK tokenization differs significantly).
- **Cultural notes:** "Show me another" may need reframing. The cultural analogue to bibliomancy is omikuji (temple fortune slips), where the expectation is a single, definitive message — not unlimited refreshes. Consider framing as "別の教えを読む" (read a different teaching) rather than inviting endless cycling. Japanese social sharing prefers very short, aphoristic content — optimal shareable unit may be one sentence, not a full paragraph. LINE share support needed alongside WhatsApp (ADR-085). Honorific suffixes required for master names ("パラマハンサ・ヨガナンダ師").
- **Open question:** Does SRF/YSS have digital Japanese translations? What is the Japanese SRF community structure?

### Hindi (hi) — Wave 11b

- **Primary platforms:** WhatsApp (dominant), Google, YouTube, JioPhone/KaiOS
- **Script:** Devanagari (LTR). Requires Noto Serif Devanagari font loading. Base font size may need 10–15% increase vs Latin for equivalent readability.
- **Cultural notes:** Hindi-speaking seekers know Yogananda through YSS, not SRF. Portal branding must feature YSS prominently for `/hi/` locale (ADR-079). The warm cream aesthetic works but may feel understated compared to Hindi spiritual print traditions (which tend toward more ornate visual treatment). India's device landscape is mobile-first and low-bandwidth — ADR-061 equity features (KaiOS, text-only mode, 2G optimization) are essential, not optional. Test performance specifically on JioPhone with Jio 4G in Uttar Pradesh/Bihar/Bengal network conditions.
- **Organizational:** YSS branding, YSS bookstore links, YSS event calendar. Portal URL question: `teachings.yogananda.org/hi/` or a YSS-branded domain?
- **Open question:** Does YSS have digital text of Hindi translations? What is YSS's digital infrastructure and approval process?

### Bengali (bn) — Wave 11b

- **Primary platforms:** WhatsApp, Google, YouTube, Facebook
- **Script:** Bengali script (LTR). Requires Noto Serif Bengali font loading. Bengali conjuncts and vowel signs require careful font rendering. Base font size may need increase vs Latin.
- **Cultural notes:** Bengali is Yogananda's mother tongue — including it sends a powerful signal about mission integrity. Bengali devotional culture has strong existing practices (daily meditation, Durga Puja season) and literary traditions (Rabindranath Tagore's influence on spiritual aesthetics). The Quiet Corner could connect to Bengali devotional sensibility — perhaps a more poetic framing. Bengali OCR accuracy is lower than Hindi if digital text is unavailable.
- **Organizational:** Same YSS branding considerations as Hindi.
- **Open question:** Does YSS have digital Bengali text? Bengali script rendering quality validation needed.

### Future Evaluation Candidates (Wave 11c)

- **Chinese (zh):** WeChat ecosystem (not WhatsApp). Simplified vs Traditional Chinese. Great Firewall considerations for mainland China hosting. Strong yoga community in urban China.
- **Korean (ko):** KakaoTalk (not WhatsApp). Naver search (not Google-dominant). Korean Hangul is phonetic — different search characteristics.
- **Russian (ru):** VK (VKontakte) social platform. Cyrillic script. Russian yoga community is substantial.
- **Arabic (ar):** RTL layout (CSS logical properties ready per ADR-021). Complex typography (ligatures, contextual forms). Cultural sensitivity: yoga is sometimes viewed with suspicion in some Arabic-speaking communities. Requires careful framing.

### Cross-Cultural Design Principles

1. **Adapt, don't just translate.** "Seeking..." entry points, "Show me another" framing, and tone guidance are editorial content per locale, not mechanical translations.
2. **Platform-aware distribution.** WhatsApp for Latin America, India, Africa. LINE for Japan. WeChat for China. KakaoTalk for Korea. The portal's messaging strategy must be locale-aware.
3. **Script-aware typography.** Font size, line height, drop capitals, and line width all vary by script family. Design tokens should be locale-overridable.
4. **Branding-aware identity.** SRF branding for Western locales. YSS branding for Indian locales. The portal's visual identity adapts to the organization the seeker knows.
5. **The portal assumes literacy.** In countries with significant functional illiteracy (India, Brazil, Sub-Saharan Africa), the TTS "Listen" button (Phase 12) is a critical accessibility feature. Consider prioritizing audio-first experiences for Hindi and Bengali locales.

---

## API Design (Next.js API Routes)

All API routes use a versioned prefix (`/api/v1/`) from Phase 1 per ADR-024. Language is passed as a query parameter on API routes (`?language=hi`), not as a path prefix — language is a property of content, not a namespace for operations (ADR-091). Frontend pages use locale path prefixes (`/hi/themes/peace`) for SEO and `hreflang` linking. This enables mobile apps pinned to older API versions to coexist with the evolving web frontend. List endpoints use cursor-based pagination for mobile compatibility.

### Error Response Contract

All API endpoints return errors in a consistent JSON format:

```typescript
interface ErrorResponse {
  error: string;        // Machine-readable code (e.g., "RATE_LIMITED", "NOT_FOUND", "INVALID_PARAMETER")
  message: string;      // Human-readable description (compassionate tone per DELTA Love principle)
  requestId: string;    // UUID for Sentry correlation and support debugging
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
  q          (required)  — user's search query
  language   (optional)  — default 'en'
  book_id    (optional)  — restrict to a specific book
  limit      (optional)  — default 5, max 20
  mode       (optional)  — 'hybrid' (default), 'fts', 'vector'

Response:
{
  "query": "How do I overcome fear?",
  "results_count": 5,
  "results": [
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
  ]
}
```

### `GET /api/v1/daily-passage`

```
Query params:
  language   (optional)  — default 'en'

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
    AND bc.language = :language             -- filter to user's locale
  ORDER BY random()
  LIMIT 1;

  English fallback: if no results for user's language, re-query with
  language='en' and mark response with "fallback_language": "en".

  Optional seasonal weighting: if current month maps to a season,
  prefer passages with matching season_affinity (60/40 weighted random).
```

### `GET /api/v1/themes`

```
Query params:
  language   (optional)  — default 'en'. Returns localized theme names
                           from topic_translations if available;
                           falls back to English name if no translation exists.
  category   (optional)  — 'quality', 'situation', 'person', 'principle',
                           'scripture', 'practice', 'yoga_path', or omit for all. (ADR-048, ADR-058)
                           Homepage "Doors of Entry" uses category=quality.
                           "Explore all themes" page omits this parameter.

Response:
{
  "themes": [
    {
      "id": "uuid",
      "name": "Paz",
      "slug": "peace",
      "category": "quality",
      "header_quote": "Sé tan sencillo como puedas; te asombrará...",
      "header_citation": "Autobiografía de un Yogui, Capítulo 12"
    },
    ...
  ]
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
  language   (optional)  — default 'en'. Filters passages to user's locale.
                           If fewer than 5 results, supplements with English
                           passages marked with fallback_language.
  limit      (optional)  — default 8, max 20
  cursor     (optional)  — opaque cursor from previous response
  shuffle    (optional)  — if true, returns a random selection (default for first request)

Response:
{
  "theme": "Peace",
  "passages_count": 47,
  "results": [
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
  "cursor": "eyJpZCI6MTIzfQ",
  "hasMore": true
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
  language   (optional)  — default 'en'

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
  ORDER BY random()
  LIMIT 1;

  Fallback: if no affirmations in user's language, return English.
```

### `GET /api/v1/books`

```
Query params:
  language   (optional)  — default 'en'. Returns books available in user's locale.
                           Phase 11: also returns an "also_available_in_english"
                           section for untranslated works (per ADR-020).

Response:
{
  "books": [
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
  "also_available_in_english": [...]
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
  limit           (optional) — default 3, max 20
  book_id         (optional) — filter to a specific book
  language        (optional) — filter to a specific language
  theme_id        (optional) — filter to a specific teaching topic
  exclude_book_id (optional) — exclude a specific book (typically current book)

Response:
{
  "source_chunk_id": "uuid",
  "related": [
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
  "total_available": 27,
  "source": "precomputed"
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

### `GET /api/v1/chapters/[book-slug]/[number]/thread`

```
Response:
{
  "book_title": "Autobiography of a Yogi",
  "chapter_number": 14,
  "chapter_title": "An Experience in Cosmic Consciousness",
  "thread": [
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
  "themes": ["cosmic consciousness", "the soul", "meditation"]
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

---

## Platform Parity (Mobile Readiness)

The portal is a web application, but its API surface will likely be consumed by native mobile apps eventually — either a standalone portal app, integration into the existing SRF mobile app, or both. ADR-024 establishes the architectural conventions that make this possible at zero Phase 1 cost.

### Shared Service Layer

All business logic lives in `/lib/services/` as plain TypeScript functions. Server Components and API routes both call these functions — never the other way around.

```
/lib/services/
  search.ts          → findPassages(query, language, options)
  daily-passage.ts   → getDailyPassage(date, language)
  themes.ts          → getThemes(language), getThemePassages(slug, language, cursor, limit)
  books.ts           → getBooks(language), getChapter(bookSlug, chapterNumber, language)
  quiet.ts           → getAffirmation(language)
  relations.ts       → getRelatedChunks(chunkId, filters, limit)
  thread.ts          → getChapterThread(bookSlug, chapterNumber)
  glossary.ts        → getGlossaryTerms(language, category), getTermBySlug(slug, language)
  magazine.ts        → getIssues(cursor, limit), getIssue(year, season), getArticle(slug)
  seeking.ts         → getSeekingDashboard(), getThemeTrends(period)
  journeys.ts        → getJourneys(language), getJourney(slug)
  resonance.ts       → getResonanceSignals(type, limit)
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
// For Lambda batch workloads (Phase 5+):
// - Use Neon's pooled connection string (port 5432 → pooler endpoint)
// - Connection limit: Neon free tier allows 100 concurrent connections;
//   paid tier scales with compute size
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
| **Auth** | All routes public (no auth) through Phase 14. Auth added only if/when Phase 15 accounts are implemented. | Frictionless access is the mission. Auth is additive, never a gate on reading or search. |
| **Pagination** | Cursor-based: `{ results, cursor, hasMore }`. No page-number pagination. | Stable across data changes; mobile infinite scroll. |
| **Cache headers** | Explicit `Cache-Control` on every response. Book text: long-lived. Search: no-store. Daily passage: 1 hour. | Mobile apps cache intelligently without custom logic. |
| **Response shape** | Presentation-agnostic JSON. No HTML in responses. No assumptions about rendering. | Same response serves web, mobile, and any future consumer. |
| **`reader_url` convention** | All `reader_url` fields are locale-relative paths (e.g., `/books/autobiography-of-a-yogi/26#chunk-uuid`). The client prepends the locale prefix (e.g., `/es`). The API never embeds locale into URLs — that's a presentation concern. | Keeps the API locale-agnostic; web and mobile clients handle routing differently. |
| **Language parameter** | All content-serving endpoints accept `language` (optional, default `'en'`). The parameter means "the user's locale," not "detected query language." The service layer handles English fallback when locale results are insufficient (ADR-020). | Locale-first search: trust the user's language choice. |

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
| `/api/v1/chunks/[id]/related` | `max-age=86400, stale-while-revalidate=604800` | Relations stable; only change on new content ingestion |
| `/api/v1/chapters/[slug]/[number]/thread` | `max-age=86400, stale-while-revalidate=604800` | Same as related — changes only on new content |
| `/api/v1/magazine/issues` | `max-age=86400` | Issue catalog changes rarely |
| `/api/v1/magazine/articles/{slug}` | `max-age=86400, stale-while-revalidate=604800` | Article text is effectively immutable |
| `/api/v1/glossary` | `max-age=86400` | Glossary changes infrequently |
| `/api/v1/seeking` | `max-age=86400` | Aggregated nightly, not real-time |

### Cache Invalidation Strategy

| Trigger | Mechanism | Scope |
|---------|-----------|-------|
| Content correction (Phase 10+) | Contentful webhook → sync service → Cloudflare Purge API | Purge by `Cache-Tag` (e.g., `book:autobiography`, `chapter:autobiography-1`) |
| Daily passage rotation | TTL-based (`max-age=3600`) | No explicit invalidation — 1-hour cache is acceptable for daily content |
| Theme tag changes | Manual Cloudflare purge via API or dashboard | Theme pages and related API responses |
| New book ingestion | Automated purge of `/books` catalog and search index | Book catalog, search results |
| Static assets (JS/CSS) | Content-hashed filenames (`main.abc123.js`) | Infinite cache, new deploy = new hash |
| Emergency content fix | Cloudflare "Purge Everything" via API | Last resort — clears entire CDN cache |

**Implementation:** Each API response includes a `Cache-Tag` header with resource identifiers. The sync service (Phase 10+) calls the Cloudflare Purge API with matching tags after each Contentful publish event. For Phases 1–9 (no Contentful), cache invalidation is manual via Cloudflare dashboard — acceptable given the low frequency of content changes.

### Deep Link Readiness

Passage URLs (`/passage/[chunk-id]`) are designed for universal link interception:

| Platform | File | Location |
|----------|------|----------|
| iOS | `apple-app-site-association` | Domain root (`/.well-known/`) |
| Android | `assetlinks.json` | `/.well-known/` |

These files are added when a native app launches. The URL structure that makes them work is established now.

### PWA Readiness (Phase 12)

Before native apps, a Progressive Web App provides offline reading, home screen installation, and a lighter footprint. See ADR-025.

| Component | Implementation |
|-----------|---------------|
| **Web App Manifest** | `manifest.json` with SRF branding (SRF Gold theme color, portal icon, `standalone` display) |
| **Service Worker** | Cache-first for book chapters, stale-while-revalidate for daily passage, network-only for search |
| **Offline indicator** | Subtle banner: "You're reading offline. Search requires a connection." |
| **Installable** | Meets PWA installability criteria (manifest + Service Worker + HTTPS) |

Offline reading aligns with the Calm Technology principle — a seeker can download a book chapter and read it on a flight, in a forest, or in a place with no connectivity. The technology fades into the background.

---

## YouTube Video Section Architecture

### Design Principle

The video section auto-updates from the @YoganandaSRF YouTube channel without manual intervention. SRF's YouTube repository contains hundreds of How-to-Live monastic talks, guided meditations, convocation sessions, and commemorative events. The portal surfaces this content in an organized, searchable way.

### Data Strategy: Hybrid RSS + YouTube API

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  "Latest Videos" section (homepage + /videos)                │
│  ┌─────────────────────────────────────┐                    │
│  │  YouTube RSS Feed                    │                    │
│  │  (no API key, no quota, free)        │                    │
│  │                                      │                    │
│  │  URL: youtube.com/feeds/videos.xml   │                    │
│  │       ?channel_id=CHANNEL_ID         │                    │
│  │                                      │                    │
│  │  Returns: ~15 most recent videos     │                    │
│  │  Fields: title, videoId, thumbnail,  │                    │
│  │          description, published,     │                    │
│  │          view count                  │                    │
│  │                                      │                    │
│  │  ISR revalidate: 1 hour             │                    │
│  └─────────────────────────────────────┘                    │
│                                                              │
│  "Full Video Library" (categorized by playlist)              │
│  ┌─────────────────────────────────────┐                    │
│  │  YouTube Data API v3                 │                    │
│  │  (API key, 10,000 units/day free)    │                    │
│  │                                      │                    │
│  │  1. channels.list (1 unit)           │                    │
│  │     → get uploads playlist ID        │                    │
│  │                                      │                    │
│  │  2. playlists.list (1 unit/page)     │                    │
│  │     → get all channel playlists      │                    │
│  │     → map to site categories         │                    │
│  │                                      │                    │
│  │  3. playlistItems.list (1 unit/page) │                    │
│  │     → get videos per playlist        │                    │
│  │     → up to 50 per page              │                    │
│  │                                      │                    │
│  │  4. videos.list (1 unit per 50)      │                    │
│  │     → full metadata: duration,       │                    │
│  │       views, thumbnails, tags        │                    │
│  │                                      │                    │
│  │  ISR revalidate: 6 hours            │                    │
│  └─────────────────────────────────────┘                    │
│                                                              │
│  NEVER use search.list — costs 100 units per call.          │
│  Use playlistItems.list instead (1 unit per call).           │
│                                                              │
│  Estimated daily quota usage: ~50-100 units (of 10,000)      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Video Categorization

SRF organizes YouTube content into playlists. We map these to portal categories:

```typescript
// Configuration: YouTube playlist → portal category
const PLAYLIST_CATEGORIES = {
  // Map SRF YouTube playlist titles to portal categories
  'How-to-Live Inspirational Talks':  { slug: 'how-to-live',   label: 'How-to-Live Talks' },
  'Guided Meditations':               { slug: 'meditations',    label: 'Guided Meditations' },
  'World Convocation':                { slug: 'convocation',    label: 'Convocation Sessions' },
  'Mahasamadhi Commemorations':       { slug: 'commemorations', label: 'Commemorations' },
  'SRF Lessons Introduction':         { slug: 'introduction',   label: 'Introduction to the Teachings' },
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
│  Videos from @YoganandaSRF                                    │
│                                                               │
│  Latest                                                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ ▶ thumb │  │ ▶ thumb │  │ ▶ thumb │  │ ▶ thumb │  →     │
│  │ title   │  │ title   │  │ title   │  │ title   │        │
│  │ 2d ago  │  │ 1w ago  │  │ 2w ago  │  │ 3w ago  │        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
│                                                               │
│  ──────────────────────────────────────────────────────       │
│                                                               │
│  How-to-Live Talks                          View all →        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │
│  │ ▶ thumb │  │ ▶ thumb │  │ ▶ thumb │                      │
│  │ title   │  │ title   │  │ title   │                      │
│  │ 1h 12m  │  │ 55m     │  │ 1h 3m   │                      │
│  │ 125K    │  │ 89K     │  │ 67K     │                      │
│  └─────────┘  └─────────┘  └─────────┘                      │
│                                                               │
│  Guided Meditations                         View all →        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │
│  │ ...     │  │ ...     │  │ ...     │                      │
│  └─────────┘  └─────────┘  └─────────┘                      │
│                                                               │
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

### Future: Video-to-Book Cross-Reference (Phase 11) — ADR-057

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
-- VIDEO TRANSCRIPTS (Phase 13)
-- ============================================================
CREATE TABLE video_transcripts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id        TEXT NOT NULL,                 -- YouTube video ID
    video_title     TEXT,                          -- cached from YouTube API
    language        TEXT NOT NULL DEFAULT 'en',
    transcript_full TEXT NOT NULL,                  -- complete transcript text
    source          TEXT NOT NULL DEFAULT 'youtube', -- 'youtube', 'whisper', 'deepgram', 'manual'
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- VIDEO CHUNKS (time-synced, embeddable, searchable — Phase 13)
-- ============================================================
-- Same chunking strategy as book_chunks. Each chunk carries start/end
-- timestamps enabling direct links to the exact video playback moment.
CREATE TABLE video_chunks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transcript_id   UUID NOT NULL REFERENCES video_transcripts(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,                  -- chunk text (same strategy as book_chunks)
    start_seconds   FLOAT NOT NULL,                 -- timestamp where this chunk begins in the video
    end_seconds     FLOAT NOT NULL,                 -- timestamp where this chunk ends
    embedding       VECTOR(1536),                   -- same embedding model as book_chunks
    content_tsv     TSVECTOR,                       -- same FTS strategy as book_chunks
    language        TEXT NOT NULL DEFAULT 'en',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_video_chunks_embedding ON video_chunks
    USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_video_chunks_tsv ON video_chunks USING gin(content_tsv);
```

#### Cross-Media Search Architecture

Because `video_chunks` uses the same embedding model and FTS strategy as `book_chunks`, unified search is natural:

```
Search query: "overcoming fear"
        │
        ▼
  HYBRID SEARCH (extended)
  ├── book_chunks  → ranked verbatim book passages with citations
  └── video_chunks → ranked video segments with timestamps
        │
        ▼
  UNIFIED RRF RANKING
  Results interleave book passages and video segments by relevance
        │
        ▼
  RESULT PRESENTATION
  ┌──────────────────────────────────────────────┐
  │  Book result:                                 │
  │  "The soul is ever free..." — AoY, Ch. 12    │
  │                          [Read in context →]  │
  ├──────────────────────────────────────────────┤
  │  Video result:                                │
  │  Brother Chidananda on overcoming fear        │
  │  "How-to-Live Talk" (12:34–13:15)            │
  │                      [Watch at 12:34 →]       │
  └──────────────────────────────────────────────┘
```

Video results link to `https://youtube.com/watch?v={video_id}&t={start_seconds}` — dropping the seeker into the exact moment. YouTube's embed API also supports `start` parameters for in-portal embedding.

#### Cross-Media Chunk Relations

Pre-computed `chunk_relations` can span book chunks and video chunks. When a seeker reads a passage in *Autobiography of a Yogi*, the Related Teachings panel can show: *"Brother Chidananda discusses this teaching in a 2023 How-to-Live talk (12:34)"* — with a direct link to that timestamp. This is the feature that makes the portal's cross-media intelligence unique.

#### Synchronized Transcript Display

The video player page (`/videos/[id]`) shows a synchronized transcript panel alongside the embedded player:

- Transcript text scrolls to follow playback position
- Each paragraph is clickable — clicking jumps the video to that timestamp
- Book passages referenced in the talk appear as margin cards linking to the reader
- The transcript is searchable within the page (browser find or custom search)

---

## Events Section

The portal connects seekers to SRF's gatherings without duplicating existing event properties. This is a signpost, not a destination. See ADR-026.

### Content

| Element | Content | Source | Update Frequency |
|---------|---------|--------|-----------------|
| **World Convocation** | Brief description, dates, hero image | Static text + link to `convocation.yogananda.org` | Annual |
| **Commemorations** | Christmas meditation, Mahasamadhi (March 7), Janmashtami, Founder's Day, etc. | Static list with dates and links to SRF event pages | Annual |
| **Online events** | "Join a live meditation" | Link to `onlinemeditation.yogananda.org` | Static |
| **Retreats** | "Experience a retreat" | Link to SRF retreat information | Static |

### Page Design

Located at `/events` or as a section on the About page (TBD based on content volume).

```
┌─────────────────────────────────────────────┐
│           Gatherings & Events               │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  🌅  World Convocation 2026         │    │
│  │  Annual gathering of seekers from   │    │
│  │  around the world.                  │    │
│  │  Learn more → convocation.yogananda │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Upcoming Commemorations                    │
│  ─────────────────────────                  │
│  March 7 · Mahasamadhi of                   │
│            Paramahansa Yogananda            │
│  August  · Janmashtami                      │
│  December · Christmas Meditation            │
│                                             │
│  ┌──────────────────┐ ┌──────────────────┐  │
│  │ Join a Live      │ │ Experience a     │  │
│  │ Meditation →     │ │ Retreat →        │  │
│  └──────────────────┘ └──────────────────┘  │
└─────────────────────────────────────────────┘
```

### Implementation

- **Phase 9:** Static content. MDX or hardcoded in a Next.js page. No CMS needed.
- **Production:** Contentful entry type `event` with fields: `title`, `date`, `description`, `externalUrl`, `image`. Editors update annually.
- **No dynamic event data.** The portal does not fetch from SRF's event systems. It links to them.

---

## Sacred Places — Contemplative Geography

A dedicated `/places` page presenting sites of biographical and spiritual significance, cross-referenced with book passages. See ADR-026.

### Data Model

```sql
-- Sacred places (SRF properties + biographical sites)
CREATE TABLE places (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    category        TEXT NOT NULL CHECK (category IN ('srf_property', 'yss_property', 'biographical')),
    description     TEXT NOT NULL,
    significance    TEXT,              -- Spiritual/historical significance
    address         TEXT,
    city            TEXT NOT NULL,
    region          TEXT,              -- State/province
    country         TEXT NOT NULL,
    latitude        DECIMAL(10, 7),
    longitude       DECIMAL(10, 7),
    image_url       TEXT,              -- Contemplative header image
    visiting_info   TEXT,              -- Hours, access notes
    external_url    TEXT,              -- Link to SRF/YSS property page
    is_active       BOOLEAN NOT NULL DEFAULT true,
    display_order   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Junction: which book passages mention which places
CREATE TABLE chunk_places (
    chunk_id        UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
    place_id        UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    context_note    TEXT,              -- e.g., "Yogananda describes arriving at this ashram"
    PRIMARY KEY (chunk_id, place_id)
);

CREATE INDEX idx_chunk_places_place ON chunk_places(place_id);
CREATE INDEX idx_chunk_places_chunk ON chunk_places(chunk_id);
```

### Page Design

```
┌──────────────────────────────────────────────────┐
│              Sacred Places                        │
│  Where the teachings come alive                   │
│                                                   │
│  ── SRF & YSS Centers ──────────────────────────  │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │  [contemplative photo]                     │   │
│  │                                            │   │
│  │  Lake Shrine                               │   │
│  │  Pacific Palisades, California             │   │
│  │                                            │   │
│  │  A ten-acre sanctuary on Sunset Boulevard, │   │
│  │  home to the Gandhi World Peace Memorial   │   │
│  │  and spring-fed lake surrounded by         │   │
│  │  meditation gardens.                       │   │
│  │                                            │   │
│  │  📖 Read about Lake Shrine →               │   │
│  │     Autobiography, Chapter 49              │   │
│  │                                            │   │
│  │  Visit → srf.org/lake-shrine               │   │
│  │  Get Directions →                          │   │
│  │  See This Place (Street View) →            │   │
│  └────────────────────────────────────────────┘   │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │  [contemplative photo]                     │   │
│  │                                            │   │
│  │  Encinitas Retreat                         │   │
│  │  Encinitas, California                     │   │
│  │                                            │   │
│  │  The ocean-facing hermitage where          │   │
│  │  Yogananda wrote much of the               │   │
│  │  Autobiography of a Yogi.                  │   │
│  │                                            │   │
│  │  📖 Read in context →                      │   │
│  │     Autobiography, Chapter 37              │   │
│  │                                            │   │
│  │  Visit → srf.org/encinitas                 │   │
│  │  Get Directions →                          │   │
│  │  See This Place (Street View) →            │   │
│  └────────────────────────────────────────────┘   │
│                                                   │
│  ── In the Footsteps of Yogananda ──────────────  │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │  Gorakhpur, India                          │   │
│  │  Yogananda's birthplace                    │   │
│  │                                            │   │
│  │  "I find my earliest memories             │   │
│  │   centering around the family home         │   │
│  │   in Gorakhpur..."                         │   │
│  │  — Autobiography of a Yogi, Chapter 1      │   │
│  │                                            │   │
│  │  📖 Read Chapter 1 →                       │   │
│  └────────────────────────────────────────────┘   │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │  Serampore, India                          │   │
│  │  Sri Yukteswar's ashram                    │   │
│  │                                            │   │
│  │  "Theثابت hermitage... is a two-storied   │   │
│  │   building with a courtyard..."            │   │
│  │  — Autobiography of a Yogi, Chapter 12     │   │
│  │                                            │   │
│  │  📖 Read Chapter 12 →                      │   │
│  └────────────────────────────────────────────┘   │
│                                                   │
│  [Phase 12: Street View links on place cards]       │
│                                                   │
│  ── Find a Meditation Group Near You ───────────  │
│  External link → yogananda.org/center-locator     │
└──────────────────────────────────────────────────┘
```

### The Book Cross-Reference

The unique value of Sacred Places on the teaching portal: each place links to the passages that describe it, and passages in the reader can link back to the place.

**Reader → Place:** When reading a chapter that mentions a significant location, a subtle card appears in the margin or below the passage:

```
┌──────────────────────────────┐
│  📍 This passage describes   │
│     Serampore, India         │
│     View in Sacred Places →  │
└──────────────────────────────┘
```

**Place → Reader:** Each Sacred Places entry lists passages with deep links:

```
Referenced in:
  • Autobiography of a Yogi, Chapter 12 — "My years with Sri Yukteswar"
  • Autobiography of a Yogi, Chapter 21 — "We visit Kashmir"
  • Autobiography of a Yogi, Chapter 42 — "Last days with my guru"
```

### Place Links Strategy (Phase 12)

No embedded map library. Each place card links out to external maps services — zero map dependencies, zero tile servers, zero maintenance. See ADR-047.

| Link | Implementation | Rationale |
|------|---------------|-----------|
| **"Get Directions"** | `geo:` URI or Apple/Google Maps link (opens native maps app) | Delegates navigation to the user's preferred app |
| **"See This Place"** | Google Maps Street View URL (opens in new tab) | Virtual visit without embedding Google SDK — no tracking scripts on the portal |
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
| **Phase 9** | Static Sacred Places page with SRF/YSS properties. Text + images + external links + "Get Directions." Cross-references with Autobiography passages. No maps. |
| **Phase 12** | Add biographical sites (Gorakhpur, Serampore, Puri, Varanasi). "See This Place" Street View links on place cards (ADR-047). Reader ↔ Place cross-reference cards. |
| **Future** | Dynamic center locator (if SRF provides data). Multi-language place descriptions (Phase 11). |

---

## Security Considerations

| Concern | Approach |
|---------|----------|
| AI prompt injection | System prompts are server-side only. User input is treated as untrusted data, never concatenated into system prompts without sanitization. |
| Content scraping | Cloudflare bot protection. Rate limiting on API routes. Content served as rendered HTML (not bulk-downloadable JSON). |
| AI misuse | The AI cannot generate teaching content. If prompted to "ignore instructions," the constrained output format (passage IDs only) limits attack surface. |
| User privacy | No user accounts required. Search queries logged without any user identification. |
| Source attribution | Every displayed passage MUST include book, chapter, and page citation. No orphaned quotes. |

### Two-Layer Rate Limiting (ADR-067)

| Layer | Tool | Limit | Behavior on Exceed |
|-------|------|-------|-------------------|
| **Outer (edge)** | Cloudflare WAF | 15 search requests/min per IP | HTTP 429 with `Retry-After` header. Request never reaches application. |
| **Inner (application)** | Custom middleware | 30 req/min anonymous, 120 req/min known crawlers (ADR-084) | Graceful degradation: search proceeds without Claude API calls (database-only hybrid search). Still returns results. |

The outer layer stops abuse before it reaches the application. The inner layer provides finer-grained control and graceful degradation rather than hard blocks. A seeker who exceeds the application-layer limit still gets search results — just without AI-enhanced query expansion and passage ranking.

---

## Accessibility Requirements (Phase 2 Foundation)

Accessibility is not a polish phase — it is a theological requirement. The DELTA Dignity principle demands that every seeker, regardless of ability, can access the teachings. Building on an inaccessible foundation creates exponentially more remediation work later.

(See ADR-017 for full rationale.)

### WCAG 2.1 AA Compliance Target

The portal targets WCAG 2.1 Level AA conformance from Phase 2. Level AAA criteria are adopted where achievable without significant trade-offs (e.g., 7:1 contrast for body text is met by our existing token choices).

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
| Audio content | Any future audio features (Phase 12 TTS, Phase 14 audio clips) must provide text transcripts. |

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
| `prefers-color-scheme` | Support `dark` scheme in Phase 12 (Reading mode). Phase 2 uses light theme only but CSS architecture supports future dark mode via custom properties. |
| `prefers-contrast` | When `more`, increase border widths and ensure all text exceeds 7:1 contrast. |
| Clear language | All UI copy at 8th-grade reading level or below. Error messages are specific and actionable ("No passages found for this search. Try different words." not "Error 404"). |
| Consistent navigation | Header and footer identical on every page. No layout shifts between pages. |
| Reading mode | Phase 2: clean reader with generous whitespace. Phase 12: adjustable font size, sepia/dark mode. |

#### Performance as Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Initial page load | < 100KB JavaScript (compressed). Target: First Contentful Paint < 1.5s on 3G. |
| Core Web Vitals | LCP < 2.5s, FID < 100ms, CLS < 0.1. |
| Progressive enhancement | Core reading and search functionality works without JavaScript (server-rendered HTML). JS enhances: "Show me another", infinite scroll, timer. |
| Low-bandwidth support | All images lazy-loaded. Responsive images via `srcset`. No autoplay video. Homepage functional as text-only. |
| Offline resilience | Phase 2: service worker caches the Quiet Corner page and current reading position. Full PWA in Phase 12 (ADR-025). |

### Accessibility Testing Strategy

| Method | When | Tool |
|--------|------|------|
| Automated audit | Every build (CI) | axe-core via `@axe-core/react` or Lighthouse CI |
| Manual keyboard testing | Every new component | Developer checklist |
| Screen reader testing | Before each phase release | VoiceOver (macOS), NVDA (Windows) |
| Color contrast validation | Design token changes | Chrome DevTools, WebAIM Contrast Checker |
| Real-user testing | Phase 12 | Engage accessibility testers (consider SRF community members with disabilities) |

---

## Editorial Reading Threads — "Teachings in Conversation" (ADR-054)

Curated reading paths that trace a single spiritual theme through multiple books as a coherent progression. These are not AI-generated content — they are editorially sequenced arrangements of existing passages, like a museum exhibit: same artworks, thoughtful arrangement.

### Concept

The `chunk_relations` table (ADR-034) connects passages by semantic similarity. Editorial threads add a curated layer: human-selected passages sequenced to flow from recognition → understanding → practice → transcendence.

**Example:** "Yogananda on Fear" — 8 passages from 4 books, editorially ordered to build a coherent contemplation.

The "Seeking..." entry points already hint at this. Threads make the connection explicit and browsable.

### Schema

```sql
-- ============================================================
-- EDITORIAL THREADS (curated multi-book reading paths — Phase 6+)
-- ============================================================
CREATE TABLE editorial_threads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            TEXT NOT NULL UNIQUE,           -- URL slug: 'yogananda-on-fear'
    title           TEXT NOT NULL,                   -- "Yogananda on Fear"
    description     TEXT,                            -- Brief editorial introduction
    language        TEXT NOT NULL DEFAULT 'en',
    is_published    BOOLEAN NOT NULL DEFAULT false,  -- human review gate
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE thread_passages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id       UUID NOT NULL REFERENCES editorial_threads(id) ON DELETE CASCADE,
    chunk_id        UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
    position        INTEGER NOT NULL,               -- ordering within the thread
    editorial_note  TEXT,                            -- optional editorial transition/context
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

## Reverse Bibliography — "What Yogananda Read" (ADR-055)

Yogananda frequently references the Bhagavad Gita, the Bible, Kabir, Mirabai, Rumi, Tagore, and scientific figures throughout his published works. A Claude "Classifying" pass extracts these external references and builds a reverse bibliography: a factual, read-only index of every external source Yogananda engages with.

### Implementation

At ingestion time (or as a batch pass over existing chunks), Claude scans each chunk and extracts external references:

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
-- EXTERNAL REFERENCES (reverse bibliography — Phase 6+)
-- ============================================================
CREATE TABLE external_references (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,                   -- "Bhagavad Gita", "Albert Einstein"
    slug            TEXT NOT NULL UNIQUE,             -- URL slug: 'bhagavad-gita'
    type            TEXT NOT NULL,                    -- 'scripture', 'person', 'text', 'tradition'
    description     TEXT,                             -- editorial description
    reference_count INTEGER NOT NULL DEFAULT 0,       -- denormalized count
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chunk_external_references (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chunk_id        UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
    reference_id    UUID NOT NULL REFERENCES external_references(id) ON DELETE CASCADE,
    nature          TEXT NOT NULL DEFAULT 'reference', -- 'quote', 'reference', 'discussion', 'allusion'
    tagged_by       TEXT NOT NULL DEFAULT 'auto',      -- 'auto', 'reviewed', 'manual'
    UNIQUE (chunk_id, reference_id)
);
```

### Route

`/references` — Index of all external sources Yogananda references, with passage counts.
`/references/[slug]` — All passages where Yogananda engages with that source.

**Example:** `/references/bhagavad-gita` — "Yogananda quotes the Bhagavad Gita 47 times across 6 books" with every passage displayed.

### Who This Serves

Scholars, interfaith seekers, and devotees who want to understand Yogananda's intellectual and spiritual lineage. It's data already in the text — surfaced, not generated.

---

## Calendar-Aware Content Surfacing (ADR-056)

The `daily_passages` pool already supports optional seasonal weighting. Calendar-aware surfacing extends this with explicit date-to-passage associations, connecting the portal's daily experience to moments that carry spiritual significance.

### Calendar Events

| Category | Examples | Passage Source |
|----------|----------|---------------|
| **Yogananda's life** | Birth anniversary (Jan 5), Mahasamadhi (Mar 7), Arrival in America (Sep 19) | Editorially curated passages about each event |
| **Hindu/Indian calendar** | Makar Sankranti, Diwali, Janmashtami | Passages on light/darkness, divine love, Krishna |
| **Christian calendar** | Christmas, Easter | Yogananda wrote extensively about Christ — rich corpus |
| **Universal observances** | International Day of Peace, World Meditation Day | Passages on peace, meditation |

### Schema

```sql
-- ============================================================
-- CALENDAR EVENTS (date-to-passage associations — Phase 5+)
-- ============================================================
CREATE TABLE calendar_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,                     -- "Mahasamadhi Anniversary"
    description     TEXT,                               -- brief context
    month           INTEGER NOT NULL,                   -- 1–12
    day             INTEGER NOT NULL,                   -- 1–31
    category        TEXT NOT NULL,                       -- 'yogananda_life', 'hindu', 'christian', 'universal'
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE calendar_event_passages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
    chunk_id        UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
    position        INTEGER,                            -- optional ordering
    UNIQUE (event_id, chunk_id)
);
```

### Integration

When today matches a calendar event, the homepage "Today's Wisdom" draws from the calendar pool instead of (or in addition to) the general daily pool. The calendar event name appears as a subtle subtitle below the passage: *"On this day in 1920, Yogananda arrived in Boston."*

This aligns with "Signpost, not destination" — the portal meets seekers where they already are (their calendar, their holidays) and connects them to Yogananda's perspective on those moments.

---

## The Quiet Index — Browsable Contemplative Taxonomy (ADR-056)

Phase 5 plans E3 (Passage Accessibility Rating) and E8 (Tone Classification). The Quiet Index combines these two planned classifications into a browsable dimension: passages organized by their contemplative texture.

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

`/quiet/contemplative`, `/quiet/practical`, `/quiet/devotional` — each shows passages matching that texture, drawn from across all books.

The existing Quiet Corner (`/quiet`) remains the single-affirmation sanctuary. The Quiet Index extends it with a browsable taxonomy for seekers who want a specific texture of reading.

### Who This Serves

A seeker who arrives at 2 AM seeking comfort needs a different texture than one doing comparative theology research. The intent classifier (E1) handles this at search time; the Quiet Index makes it browsable. It answers the question: "I don't know what I'm searching for, but I know what I *need* right now."

---

## Daily Email: Verbatim Passage Delivery

(See ADR-018 for full rationale.)

A daily email delivering a single Yogananda passage — verbatim, with citation and a link to read in context. The email is the portal reaching out to meet the seeker, rather than waiting for the seeker to visit.

### Phase 9: Non-Personalized Daily Email

All subscribers receive the same passage each day. The passage is selected from the `daily_passages` pool with optional seasonal weighting.

### Phase 15: Theme-Preference Email

Logged-in subscribers choose preferred themes (Peace, Courage, etc.). The daily email selects from theme-tagged passages matching their preferences.

### Subscriber Data Model

```sql
-- ============================================================
-- EMAIL SUBSCRIBERS (for Daily Wisdom email)
-- ============================================================
CREATE TABLE email_subscribers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT NOT NULL UNIQUE,
    language        TEXT NOT NULL DEFAULT 'en',
    is_confirmed    BOOLEAN NOT NULL DEFAULT false,   -- double opt-in
    is_active       BOOLEAN NOT NULL DEFAULT true,     -- can unsubscribe
    confirm_token   TEXT,                              -- for double opt-in confirmation
    unsubscribe_token TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
    theme_preferences TEXT[],                          -- Phase 15: ['peace', 'courage']
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    confirmed_at    TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_subscribers_active ON email_subscribers(is_active, is_confirmed)
    WHERE is_active = true AND is_confirmed = true;
```

### Email Design

```
┌──────────────────────────────────────────────────┐
│                                                    │
│  ☸ SRF Teaching Portal                            │
│                                                    │
│  ────────────────────────────────────────────     │
│                                                    │
│  Today's Wisdom                                    │
│                                                    │
│  "Have courage. Whatever you are going through     │
│   will pass. Trust in God's plan for you.          │
│   Through your difficulties you will gain          │
│   the strength you need."                          │
│                                                    │
│  — Where There Is Light, p. 42                     │
│                                                    │
│            [ Read in context → ]                   │
│                                                    │
│  ────────────────────────────────────────────     │
│                                                    │
│  The teachings of Paramahansa Yogananda,           │
│  made freely available to seekers worldwide.       │
│                                                    │
│  yogananda.org · SRF Teaching Portal               │
│                                                    │
│  Unsubscribe                                       │
│                                                    │
└──────────────────────────────────────────────────┘
```

**Design constraints:**
- Plain HTML email (no JavaScript, no web fonts — fallback to Georgia/serif)
- **Non-Latin script support (Phase 11):** HTML email font rendering is unreliable across clients (Gmail, Apple Mail, Outlook). Non-Latin scripts (CJK, Devanagari, Bengali) must use system font stacks, not web fonts. Define per-locale email font stacks and test across the top 5 email clients per target market. Passage text must render correctly in the subscriber's language without depending on downloadable fonts.
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
  → Sets is_confirmed = true, confirmed_at = now()
  → Redirects to portal with "You're subscribed" message

GET /api/v1/email/unsubscribe?token=xxx
  → Sets is_active = false, unsubscribed_at = now()
  → Shows "You've been unsubscribed" page with re-subscribe option
```

### Email Sending Infrastructure

| Component | Service | Notes |
|-----------|---------|-------|
| Email delivery | Resend (free tier: 100 emails/day) or AWS SES (~$0.10 per 1,000) | Resend for early Phase 9; SES for scale |
| Cron trigger | Vercel Cron Jobs (free tier: 1/day) or AWS EventBridge | Daily at 5:00 AM UTC |
| Template | Server-rendered HTML string (no template engine needed) | Keep simple — one passage, one link |
| Daily passage selection | Same logic as `/api/v1/daily-passage` but with a fixed daily seed | All subscribers receive the same passage on the same day |

**Daily seed logic:** Use the current date as a deterministic seed to select the day's passage, ensuring all emails contain the same quote and the portal homepage can display "Today's email featured this passage" if desired.

---

## MCP Server Strategy

| MCP Server | Use Case | Availability |
|------------|----------|-------------|
| **Neon MCP** | Database schema management, SQL execution, migrations during development | Available now |
| **Contentful MCP** | Content model design, entry management during development | To be investigated |
| **Custom: SRF Corpus MCP** | Allow Claude Code to search the book corpus during development (e.g., "find all passages about meditation in Autobiography") | Build as part of Phase 1 |

---

## Content Management Strategy

Content flows through a five-layer staff experience architecture (ADR-064). Each layer serves a distinct audience with appropriate tooling:

| Layer | Tool | Who | What |
|---|---|---|---|
| **Content Authoring** | Contentful | Content editors | Creating/editing book text, editorial threads, theme descriptions, calendar events |
| **Contextual Bridges** | Contentful Custom Apps | Content editors (in Contentful) | Sidebar panels showing review status, related data, previews |
| **Editorial Review** | Admin Portal (`/admin`) | Monastic editors, theological reviewers, social media staff, translation reviewers | All review/approval/curation workflows where AI has proposed and humans must decide |
| **Technical Operations** | Retool | AE developers | Search analytics, pipeline monitoring, bulk data operations |
| **Impact Reporting** | Impact Dashboard (`/admin/impact`) | Leadership, philanthropist's foundation | Global reach, content growth, search themes — narrative quality, read-only |

### Content Flow by Type

| Content Type | Phases 1–4 | Phases 5–9 | Production (Phase 10+) | Why |
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

The webhook sync service (Phase 10, deliverable 10.3) is the primary coupling point. When Contentful's content model evolves, the sync function must be updated. This is the main maintenance surface in production.

```
Contentful (editorial) ──webhook──→ Serverless function ──→ Neon (search index)
                                    │
                                    ├─ Extract text
                                    ├─ Chunk into paragraphs
                                    ├─ Generate embeddings
                                    └─ Upsert into book_chunks
```

---

## Staff Experience Architecture (ADR-064)

The portal's "human review as mandatory gate" principle creates significant staff-facing workflow requirements. Theme tags, tone classifications, accessibility ratings, calendar associations, translation drafts, social media assets, and ingestion QA flags all require human approval. The staff experience is a first-class product concern — the speed and quality of editorial review directly determines how quickly new content reaches seekers.

### Guiding Principle

**Staff should think about the teachings, not the technology.** The same calm technology philosophy that governs the seeker experience applies to the staff experience. A monastic editor reviewing whether a passage about inner peace is correctly tagged should work in an environment that respects the material — not a generic data grid.

### Staff Personas

| Persona | Schedule | Technical Comfort | Primary Tool |
|---|---|---|---|
| **Monastic content editor** | 2–3 hour windows between meditation and services | Variable | Admin portal + Contentful |
| **Theological reviewer** | Periodic, high-stakes | Low to moderate | Admin portal (review queue only) |
| **AE social media staff** | Daily, 20–30 min | Moderate | Admin portal (asset inbox) |
| **Translation reviewer** | Batch sessions, 40–100 strings | Moderate (may be volunteer) | Admin portal (translation review) |
| **AE developer** | As needed | High | Retool + Neon console |
| **Leadership** | Monthly or quarterly | Low | Impact dashboard (read-only) |

### The Editorial Review Portal (`/admin`)

A custom-built section of the Next.js application, protected by Auth0, built with the portal's own design system.

#### Auth0 Roles

| Role | Access |
|---|---|
| `editor` | Theme tag review, daily passage curation, calendar event management, content preview, ingestion QA |
| `reviewer` | Theological review queue (final approval tier) |
| `translator:{locale}` | Translation review for a specific language only |
| `social` | Social media asset review and download |
| `admin` | All editorial functions + user management |
| `leadership` | Impact dashboard (read-only) |

#### Editorial Home Screen

When a staff member logs in, they see a personalized summary filtered by their role:

```
┌─────────────────────────────────────────────────────────────┐
│  SRF Teaching Portal — Editorial Home                       │
│                                                             │
│  Good morning. Here's what needs your attention:            │
│                                                             │
│  ┌────────────────────────┐  ┌────────────────────────────┐ │
│  │ Theme Tags             │  │ Daily Passages             │ │
│  │ 23 awaiting review     │  │ Pool: 412 passages         │ │
│  │ ○ Peace (8 new)        │  │ Next 7 days: ✓             │ │
│  │ ○ Courage (6 new)      │  │                            │ │
│  │ ○ Healing (9 new)      │  │                            │ │
│  └────────────────────────┘  └────────────────────────────┘ │
│                                                             │
│  ┌────────────────────────┐  ┌────────────────────────────┐ │
│  │ QA Flags               │  │ Calendar Events            │ │
│  │ 0 pending              │  │ Next: Mahasamadhi (Mar 7)  │ │
│  │ All clear ✓            │  │ 12 passages linked         │ │
│  └────────────────────────┘  └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Review Workflows

**Theme tag review** (Phase 5):
```
┌─────────────────────────────────────────────────────────────┐
│  Theme: Peace — Review Candidates (8 of 23)                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ "Be as simple as you can be; you will be astonished     ││
│  │  to see how uncomplicated and happy your life can       ││
│  │  become."                                               ││
│  │                                                         ││
│  │  — Autobiography of a Yogi, Ch. 12, p. 118             ││
│  │                                                         ││
│  │  Similarity: 0.72  │  AI confidence: High               ││
│  │                                                         ││
│  │  [a] Approve   [r] Reject   [▾] Adjust relevance       ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Progress: ████████░░░░░░░░ 8/23 reviewed                  │
│  Session: resumed from yesterday                            │
└─────────────────────────────────────────────────────────────┘
```

Keyboard-driven: `a` approve, `r` reject, `→` next, `←` previous. Session position saved — resume where you left off tomorrow.

**Social media asset review** (Phase 9):
```
┌─────────────────────────────────────────────────────────────┐
│  Tomorrow's Passage — Review                                │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌────────────────────┐          │
│  │          │ │          │ │                    │          │
│  │   1:1    │ │   9:16   │ │       16:9        │          │
│  │  Square  │ │  Story   │ │     Landscape     │          │
│  │          │ │          │ │                    │          │
│  └──────────┘ └──────────┘ └────────────────────┘          │
│                                                             │
│  Caption:                                                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ "Be as simple as you can be..."                         ││
│  │ — Paramahansa Yogananda, Autobiography of a Yogi       ││
│  │ Read more: teachings.yogananda.org/passage/abc123       ││
│  │                                           [Edit]        ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Download: [Instagram] [Facebook] [Story] [Landscape]       │
│  Mark posted: □ Instagram  □ Facebook  □ Twitter            │
└─────────────────────────────────────────────────────────────┘
```

**Translation review** (Phase 11):
```
┌─────────────────────────────────────────────────────────────┐
│  German Translation Review — 14 strings remaining           │
│                                                             │
│  ┌──────────────────────┬──────────────────────────────────┐│
│  │ English (source)     │ German (AI draft)                ││
│  ├──────────────────────┼──────────────────────────────────┤│
│  │ "What are you        │ "Wonach suchen Sie?"             ││
│  │  seeking?"           │                                  ││
│  │                      │ Context: Search bar placeholder  ││
│  │                      │                                  ││
│  │                      │ [✓ Approve] [Edit] [Flag]        ││
│  └──────────────────────┴──────────────────────────────────┘│
│                                                             │
│  Progress: ████████████░░░░ 26/40 reviewed                  │
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
    layout.tsx          ← Auth0 protection, admin nav, calm design shell
    page.tsx            ← Editorial home (role-filtered summary)
    themes/
      [slug]/page.tsx   ← Theme tag review queue
    passages/
      page.tsx          ← Daily passage curation
    calendar/
      page.tsx          ← Calendar event management
    social/
      page.tsx          ← Social media asset review
    translations/
      [locale]/page.tsx ← Translation review (per language)
    qa/
      page.tsx          ← Ingestion QA review
    impact/
      page.tsx          ← Leadership impact dashboard
    preview/
      themes/[slug]/page.tsx   ← "Preview as seeker" for themes
      passages/page.tsx        ← Preview daily passage selection
```

Business logic lives in `/lib/services/` (consistent with ADR-024). The admin routes are thin presentation layers over:
- `/lib/services/review.ts` — review queue queries, approval/rejection
- `/lib/services/curation.ts` — daily passage selection, calendar management
- `/lib/services/social.ts` — asset generation, caption management
- `/lib/services/translation.ts` — translation review, locale progress tracking
- `/lib/services/impact.ts` — aggregated metrics for leadership dashboard

### Phase Delivery

| Phase | Staff Experience Work |
|---|---|
| **Phase 5** | Minimal admin portal: editorial home, theme tag review, daily passage curation, calendar event management, content preview, tone/accessibility spot-check. Auth0 integration. Email digest. |
| **Phase 9** | Social media asset review added. |
| **Phase 10** | Contentful Custom Apps (sidebar panels). Full editorial workflow bridging Contentful authoring and portal review queues. |
| **Phase 11** | Translation review UI. Volunteer reviewer access with scoped permissions (`translator:{locale}`). |
| **Phase 11+** | Impact dashboard for leadership. |

---

## Migration, Evolution, and Longevity

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

The shared service layer (ADR-024) is pure TypeScript with no Next.js dependency. If SRF ever migrates away from Next.js:
- `/lib/services/` — portable, zero framework dependency
- `/app/` (Server Components, Route Handlers) — framework-specific, would be rewritten
- `/migrations/` — portable, raw SQL
- Contentful webhook sync — portable, standard HTTP handler

The business logic (search, passage retrieval, theme queries) survives a framework change. Only the presentation layer is coupled.

### Data Portability

All content lives in Neon (PostgreSQL) — standard SQL, exportable via `pg_dump`. Embeddings in pgvector use standard float arrays. No vendor-specific data formats. Contentful content is exportable via their API. There is no vendor lock-in on content.

### Documentation as Longevity Tool

The ADR convention (DECISIONS.md) is the most undervalued longevity tool. When a future developer asks "why didn't we use GraphQL?" or "why not embed Google Maps?" — the answer is recorded with full context. This prevents teams from revisiting settled decisions and accidentally undoing architectural choices that had good reasons.

### 10-Year Horizon (ADR-033)

The architecture is designed so that **nothing needs to be thrown away and rebuilt from scratch.** Every component can be replaced incrementally. The most valuable artifacts (data, logic, decisions) are in the most durable formats.

| Horizon | What Holds | What May Change |
|---------|-----------|-----------------|
| **3 years (2029)** | Everything. Minor dependency upgrades. | Library versions. |
| **5 years (2031)** | Core data model, service layer, migrations, ADRs. | Embedding model (swap via ADR-032). Possibly CMS or auth provider. |
| **7 years (2033)** | Database, APIs, Terraform, service functions. | Next.js may be superseded. UI layer rewrite against same APIs. |
| **10 years (2036)** | PostgreSQL schema, SQL migrations, service logic, ADRs. | UI framework, some SaaS integrations will have evolved. |

**The five longevity guarantees:**

1. **All data in PostgreSQL.** Nothing lives exclusively in a SaaS tool.
2. **Business logic is framework-agnostic.** `/lib/services/` is pure TypeScript.
3. **Raw SQL migrations.** dbmate `.sql` files don't depend on any framework version.
4. **Standard protocols at boundaries.** OAuth 2.0, REST + JSON, SQL, HTTP, `hreflang`.
5. **Decisions are documented.** ADRs capture *why* every choice was made.

### Embedding Model Migration (ADR-032)

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

## Observability

The portal uses the SRF-standard observability stack with DELTA-compliant configuration. See ADR-029.

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
  requestId: string;        // UUID, propagated across services
  route: string;            // e.g., "/api/v1/search"
  method: string;           // GET, POST
  statusCode: number;
  durationMs: number;
  language: string;         // User's locale
  timestamp: string;        // ISO 8601
}

// Additional fields for search routes (anonymized)
interface SearchLog extends RequestLog {
  query: string;            // The search query
  resultCount: number;
  searchMode: string;       // "hybrid", "fts", "vector"
  expansionUsed: boolean;   // Whether Claude query expansion was invoked
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
| `page_viewed` | `{ page_type, language, country_code }` | Countries reached, languages served |
| `passage_served` | `{ book_slug, language }` | Books/passages served |
| `share_link_generated` | `{ format }` | Share link generation count |
| `center_locator_clicked` | `{}` | Digital → physical bridge |
| `search_performed` | `{ language, result_count }` | Search usage volume |

---

## Testing Strategy

Testing is a fidelity guarantee, not optional polish. A bug that misattributes a quote or breaks search undermines the core mission. See ADR-028.

### Test Layers

| Layer | Tool | What It Tests | Phase |
|-------|------|---------------|-------|
| **Unit / Integration** | Vitest + React Testing Library | Service functions, API route handlers, component rendering | Phase 3 |
| **End-to-End** | Playwright | Full user flows: search → read → share → navigate. Cross-browser. | Phase 3 |
| **Accessibility** | axe-core (CI) + Playwright a11y | Automated WCAG checks. Keyboard navigation flows. | Phase 3 |
| **Search quality** | Custom Vitest suite | ~30 queries with expected passages. Precision/recall. | Phase 3 |
| **Related content quality** | Custom Vitest suite | Pre-computed relations are thematically relevant, cross-book diverse, no false friends. | Phase 6 |
| **Performance** | Lighthouse CI | LCP < 2.5s, CLS < 0.1, INP < 200ms | Phase 3 |
| **Visual** | Storybook | Component documentation, design token consistency | Phase 3 |
| **Visual regression** | Playwright screenshot comparison | Catch unintended visual changes | Phase 12 |

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

### Key E2E Test Scenarios (Phase 3)

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

### Related Content Quality Evaluation (Phase 6+)

Mirrors the search quality evaluation (deliverable 1.11) but for the pre-computed `chunk_relations`. The teaching portal is focused on quality teaching — bad relations undermine trust as much as bad search results.

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

## Infrastructure and Deployment

All infrastructure is defined as code per SRF engineering standards. See ADR-031.

### Terraform Module Layout

```
/terraform/
  main.tf                    — Provider configuration, backend
  variables.tf               — Input variables (project name, environment)
  outputs.tf                 — Connection strings, URLs, DSNs

  /modules/
    /neon/                   — Neon project, database, roles, pgvector
    /vercel/                 — Vercel project, env vars, domains
    /sentry/                 — Sentry project, DSN, alert rules
    /cloudflare/             — DNS records, WAF rules, bot protection
    /newrelic/               — Synthetics monitors, alert policies

  /environments/
    dev.tfvars               — Phase 3 (only active environment)
    qa.tfvars                — Phase 10+
    stg.tfvars               — Phase 10+
    prod.tfvars              — Phase 10+
```

### Boundary: Terraform vs. Application Code

| Managed by Terraform | Managed by Application Code |
|---------------------|-----------------------------|
| Service creation (Neon project, Vercel project, Sentry project) | Database schema (dbmate SQL migrations) |
| Environment variables, secrets | `vercel.json`, `sentry.client.config.ts`, `newrelic.js` |
| DNS records, domain bindings | Application routing (`next.config.js`) |
| Alert rules, Synthetics monitors | Structured logging (`lib/logger.ts`) |
| Auth provider (Phase 15+, if needed) | Auth SDK integration in Next.js |
| Repo settings, branch protection | CI/CD workflow files |

### Source Control and CI/CD

| Phase | SCM | CI/CD | Terraform State |
|-------|-----|-------|-----------------|
| **Phases 1–9** | GitHub | GitHub Actions | Terraform Cloud (free tier) |
| **Phase 10+** | GitLab (SRF IDP) | GitLab CI/CD | GitLab Terraform backend |

#### Phase 3 CI/CD Pipeline (GitHub Actions)

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
DATABASE_URL=              # Terraform output: module.neon.connection_string
NEON_PROJECT_ID=           # Terraform output: module.neon.project_id

# AI
ANTHROPIC_API_KEY=         # Set manually (secret)
OPENAI_API_KEY=            # Set manually (secret)

# Sentry
NEXT_PUBLIC_SENTRY_DSN=    # Terraform output: module.sentry.dsn
SENTRY_AUTH_TOKEN=         # Set manually (secret)

# Auth (Phase 15+, if needed — no auth variables required for Phases 1–14)

# YouTube
YOUTUBE_API_KEY=           # Set manually (secret)

# Email (Phase 9)
RESEND_API_KEY=            # Set manually (secret)

# Amplitude (Phase 7)
NEXT_PUBLIC_AMPLITUDE_KEY= # Terraform output: module.amplitude.api_key

# New Relic (Phase 7)
NEW_RELIC_LICENSE_KEY=     # Set manually (secret)
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

## Design Tooling

The portal uses Figma for design, with a token export pipeline to Tailwind CSS. See ADR-030.

### Phase 3: Figma Free Tier

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
  Storybook documents components (Phase 3+)
```

Changes to design tokens in Figma propagate to `tokens.json`, which updates `tailwind.config.ts`, which is reflected in all components. The design language stays synchronized between design and code.

### Phase 12: Calm Technology Design System

When the shared component library begins (Phase 12), Figma Professional ($15/editor/month) enables:
- Shared component library with variants
- Design system documentation alongside Storybook
- Branching for design exploration
- Multi-property reuse (portal, convocation site, future SRF projects)

---

## Magazine Section Architecture

Self-Realization Magazine (published since 1925) is a first-class content type alongside books, audio, and video. Yogananda's magazine articles enter the full search/theme/daily-passage pipeline. Monastic articles are searchable via opt-in filter. See ADR-105.

### Magazine API Endpoints

```
GET /api/v1/magazine/issues                          → Paginated issue list (cursor-based)
GET /api/v1/magazine/issues/{year}/{season}          → Single issue with articles
GET /api/v1/magazine/articles/{slug}                 → Single article with chunks
GET /api/v1/magazine/issues/{year}/{season}/pdf      → Issue PDF (pre-rendered, S3 + CloudFront)
GET /api/v1/magazine/articles/{slug}/pdf             → Article PDF (pre-rendered)
```

### Magazine Page Layout

```
/magazine                           → Magazine landing
├── Latest Issue (cover, TOC, featured article)
├── Browse by Year (accordion → issue covers)
└── Yogananda's Magazine Writings (searchable index, chronological + by theme)

/magazine/{year}/{season}           → Single issue view
├── Cover image + editorial note
├── Article list with author types (gold marks for Yogananda, neutral for others)
└── "Read full issue PDF →" download

/magazine/{year}/{season}/{slug}    → Article reader (same reader component as books)
├── Author byline below title
├── Issue citation in reader header
└── "In this issue" sidebar (replaces Related Teachings when browsing within an issue)
```

### Search Integration

The `hybrid_search` function queries `magazine_chunks` alongside `book_chunks`. Only `author_type = 'yogananda'` articles are included by default. The `include_commentary=true` parameter extends search to monastic articles. Citations adapt: *— Self-Realization Magazine, Vol. 97 No. 2, p. 14*.

---

## Glossary Architecture

The spiritual terminology bridge (`/lib/data/spiritual-terms.json`, ADR-052) is surfaced as a user-facing glossary. See ADR-093.

### Glossary API Endpoints

```
GET /api/v1/glossary                     → All glossary terms (paginated, cursor-based)
    ?language=en                         — Filter by language
    ?category=sanskrit                   — Filter by category
    ?q=samadhi                           — Search within glossary (trigram fuzzy)

GET /api/v1/glossary/{slug}              → Single term with definition and Yogananda's explanation passage
```

### Glossary Page Layout

```
/glossary                               → Glossary landing
├── Search bar ("Find a term...")
├── Category filter (Sanskrit, Yogic Concepts, Spiritual States, Scriptural, Cosmological, Practice)
├── Alphabetical term list
│   ├── Term + brief definition (1-2 sentences)
│   ├── "Yogananda's explanation →" link to source passage
│   └── Related theme links
└── Inline reader integration (opt-in via reader settings: "Show glossary terms")
    └── Dotted underline on recognized terms → tooltip with definition
```

---

## "What Is Humanity Seeking?" Dashboard Architecture

A public-facing, contemplative visualization of anonymized search intelligence. See ADR-094.

### Seeking API Endpoints

```
GET /api/v1/seeking                      → Dashboard data (aggregated, nightly)
    Response: { top_themes[], geographic_summary[], seasonal_rhythm[], common_questions[] }

GET /api/v1/seeking/themes               → Theme trends over time
    ?period=month|quarter|year
```

### Seeking Dashboard Layout

```
/seeking                                → Public dashboard (contemplative, not analytical)
├── "Right now, the world is seeking..." — Top 3-5 themes, warm text emphasis
├── Geographic view — Warm-toned world map, soft regional highlights
├── Seasonal rhythm — Year-view of theme ebb and flow
├── The questions — Most common question-form queries (anonymized, clustered)
└── "Read the full analysis in Self-Realization Magazine →" (when available)
```

---

## Additional New UI Pages

### `/journeys` — Calendar Reading Journeys (ADR-100)

Browse available time-bound reading experiences. Lists evergreen, seasonal, and annual journeys with descriptions, durations, and "Subscribe" buttons. Active seasonal journeys highlighted.

### `/explore` — Knowledge Graph Visualization (ADR-098)

Interactive visual map of the teaching corpus. Pre-computed graph JSON, client-side rendering. Linked from Library and themes pages (not primary nav).

### `/integrity` — Content Integrity Verification (ADR-103)

Public page listing all books and their per-chapter content hashes. "How to verify" instructions. Statement of textual fidelity.

### `/study/[book-slug]/[chapter]/share/[hash]` — Study Circle Sharing (ADR-099)

Pre-rendered, shareable page with key passages, discussion prompts, and cross-book connections. < 30KB HTML. Optimized for WhatsApp/SMS preview.

---

## Image Serving Architecture (ADR-086, ADR-106, ADR-107)

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

**Watermarking per tier (ADR-106):**
- All tiers: EXIF/XMP metadata (Phase 2)
- `medium`, `large`, `original`: C2PA Content Credentials (Phase 14)
- `original` of sacred images: steganographic watermark (Phase 14)

**Service file:** `/lib/services/images.ts` — image queries, size resolution, download URL generation.

---

## Open Questions

See CONTEXT.md § Open Questions for the consolidated list. Technical and stakeholder questions live there so they're visible at session start and move to "Resolved" as work progresses. Architectural questions that arise during implementation should be added to CONTEXT.md and, if they require a decision, captured as an ADR in DECISIONS.md.

---

*Last updated: 2026-02-20*
