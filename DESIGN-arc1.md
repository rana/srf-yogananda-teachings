# SRF Online Teachings Portal — Arc 1 Design (Foundation)

> **Scope.** This file contains the technical design sections relevant to **Arc 1: Foundation** (Milestones 1a/1b) — proving the AI librarian concept and establishing the data foundation. For cross-cutting principles and navigation, see [DESIGN.md](DESIGN.md). For Arcs 2–3, see [DESIGN-arc2-3.md](DESIGN-arc2-3.md). For Arc 4+, see [DESIGN-arc4-plus.md](DESIGN-arc4-plus.md).
>
> **Parameter convention (ADR-123).** Specific numeric values in this document (cache TTLs, debounce timers, fusion parameters, chunk sizes, rate limits, color band boundaries, purge delays, revalidation intervals) are **tunable defaults**, not architectural commitments. They represent best pre-production guesses and should be implemented as named configuration constants in `/lib/config.ts`, not hardcoded literals. Milestone 1a.9 (search quality evaluation) and subsequent arc gates include parameter validation as deliverables. When a parameter is tuned based on evidence, annotate the section: `*Parameter tuned: [date], [old] → [new], [evidence].*` See ADR-123 for the full governance framework.

---

## DES-003: The AI Librarian: Search Architecture

### Core Principle

The AI is a **librarian**, not an **oracle**. It finds Yogananda's words — it never speaks for him. All results shown to users are verbatim quotes from published works with precise citations.

### ADR-089: Brand Identity

"The Librarian" is the portal's external brand identity for its AI search capability. In a world where every AI product synthesizes content, the portal's refusal to generate is a radical differentiator. The About page explains: *"This is not an AI that speaks for Yogananda. It is a librarian that finds his words for you. Every passage you see is exactly as he wrote it."* The `llms.txt` file includes this framing. Search results may include a subtle footer: *"Every passage shown is Yogananda's own words."*

### Search Flow

The search pipeline has evolved through three arc tiers. Milestones 1a–2a use a two-path retrieval core (vector + BM25). Milestone 2b+ adds HyDE and Cohere Rerank. Milestone 3b+ adds a third retrieval path via Postgres-native graph traversal (ADR-117).

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
5. HyDE — HYPOTHETICAL DOCUMENT EMBEDDING (Milestone 2b+, ADR-119)
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
6. MULTI-PATH PARALLEL RETRIEVAL (Neon PostgreSQL, Milestone 3b+ adds PATH C)

 PATH A — Dense Vector (pgvector, HNSW):
 - Embed the original query using Voyage voyage-3-large (ADR-118)
 - Find top 20 chunks by cosine similarity
 - If HyDE active: also search with HyDE embedding, merge via RRF

 PATH B — BM25 Keyword (pg_search/ParadeDB, ADR-114):
 - Search expanded terms against the BM25 index (ICU tokenizer)
 - BM25 scoring produces better relevance ranking than tsvector ts_rank
 - Find top 20 chunks by keyword relevance

 PATH C — Graph-Augmented Retrieval (Postgres, Milestone 3b+, ADR-117):
 - Identify entities/concepts in query via entity registry (ADR-116)
 - SQL traversal across extracted_relationships and concept_relations
 - Return top 20 chunks reachable within 2–3 hops
 - pgvector similarity applied to graph-retrieved candidates
 - Multi-step queries composed in /lib/services/graph.ts

 RECIPROCAL RANK FUSION (RRF):
 - Merge results from all active paths (A+B in Milestones 1a–3a; A+B+C in Milestone 3b+)
 - score = Σ 1/(k + rank_in_path) across all paths, k=60 *[Parameter — default: 60, evaluate: Milestone 1a.9 golden set at k=40/60/80]*
 - Deduplicate, producing top 20 candidates
 │
 ▼
7. RERANKING (Cohere Rerank 3.5, Milestone 2b+, ADR-119)
 Cross-encoder reranker sees query + passage together.
 Multilingual native. Replaces Claude Haiku passage ranking for precision.
 Selects and ranks top 5 from 20 candidates.

 Milestones 1a–2a fallback: Claude Haiku passage ranking (ADR-014).
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
 - Related teachings (Milestone 3a+, ADR-050) grouped by relationship type
```

**Milestone progression of the search pipeline:**

| Milestone | Retrieval Paths | Reranker | Enhancements |
|-----------|----------------|----------|-------------|
| 1a–2a | Vector (pgvector) + BM25 (pg_search) | Claude Haiku passage ranking | Basic query expansion, terminology bridge |
| 2b–3a | Vector + BM25 | Cohere Rerank 3.5 | HyDE, improved query expansion |
| 3b+ | Vector + BM25 + Graph (Postgres) | Cohere Rerank 3.5 | Three-path RRF, entity-aware retrieval |

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

Arc 1 seeds this file with ~50 core terms from the Autobiography. Each subsequent book ingestion (ADR-051) triggers: vocabulary extraction → diff against existing terms → human review → merge. The file grows with the corpus.

### Claude System Prompts (Draft — Refine During Arc 1)

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

*These prompts are starting points. Milestone 1a empirical testing (deliverable 1a.9, search quality evaluation) will refine wording, few-shot examples, and temperature settings. All prompts are maintained in `/lib/prompts/` as version-controlled TypeScript template literals.*

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
| **Full** | All services healthy | Query expansion + HyDE (Milestone 2b+) + multi-path retrieval + Cohere Rerank (Milestone 2b+) | — | Best results: conceptual queries understood, top 5 precisely ranked |
| **No rerank** | Cohere Rerank unavailable | Query expansion, HyDE, multi-path RRF | Cross-encoder reranking | Top 5 from RRF scores; slightly less precise ordering |
| **No HyDE** | HyDE generation fails | Query expansion, multi-path RRF, Cohere Rerank | Hypothetical document embedding | Marginal loss on literary/metaphorical queries |
| **No expansion** | Claude query expansion fails | Raw query → hybrid search (vector + BM25) | Conceptual query broadening | Keyword-dependent; "How do I find peace?" works less well than "peace" |
| **Database only** | All AI services fail | Pure hybrid search (pgvector + pg_search BM25) | All AI enhancement | Still returns relevant verbatim passages via vector similarity + BM25 |

**Implementation:** `/lib/services/search.ts` wraps each external service call in a try-catch with a 5-second timeout. Failure at any level falls through to the next. Sentry captures each degradation event (`search.degradation` with `level` and `service` tags) for monitoring. The search API response includes a `searchMode` field (`"full"`, `"no_rerank"`, `"no_hyde"`, `"no_expansion"`, `"database_only"`) for observability — not exposed in the seeker-facing UI.

### ADR-046: Embedding Model Migration Procedure

When the embedding model changes (e.g., from `voyage-3-large` to a successor, or to a per-language model for Milestone 5b), re-embedding the full corpus is required. The `embedding_model`, `embedding_dimension`, and `embedded_at` columns on `book_chunks` enable safe, auditable migration.

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
 Run the search quality evaluation test suite (deliverable 1a.9).
 Compare results against production baseline.
 Threshold: new model must match or exceed current ≥ 80% pass rate.

6. PROMOTE
 If validation passes: merge branch to production via Neon.
 If validation fails: delete branch, keep current model.

7. UPDATE CONFIG
 Update /lib/config.ts EMBEDDING_MODEL and EMBEDDING_DIMENSIONS.
 Update default values in schema for new chunks.
```

**Cost estimate for full corpus re-embedding:** < $15 for Voyage voyage-3-large at 50K chunks (~25M tokens). The operational cost is primarily developer time for validation, not API spend. At significant volume, evaluate AWS Marketplace SageMaker model packages for Voyage to reduce per-call costs.

**Multilingual embedding quality (ADR-047, ADR-118).** Voyage voyage-3-large is multilingual-first by design: 1024 dimensions, 26 languages, unified cross-lingual embedding space, 32K token input window. For European languages (es, de, fr, it, pt) and major Asian languages (ja, zh, ko, hi), this provides strong baseline retrieval. For CJK-heavy corpora, benchmark Voyage `voyage-multilingual-2` as an alternative — it may excel on languages with fundamentally different morphology. Milestone 5b includes formal benchmarking with actual translated passages across Voyage voyage-3-large, Cohere embed-v3, and BGE-M3.

**Domain-adapted embeddings (ADR-047, later-stage research).** The highest-ceiling path to world-class retrieval: fine-tune a multilingual base model on Yogananda's published corpus across languages. A domain-adapted model would understand spiritual vocabulary, metaphorical patterns, and cross-tradition concepts at a depth no general model matches. Prerequisites: multilingual corpus (Milestone 5b ingestion) and per-language evaluation suites (Milestone 5b). The same migration procedure above applies — the architecture imposes no constraints on model provenance.

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

**2. Query suggestion.** Curated complete question forms seeded from the search quality evaluation test suite (~30 queries, Deliverable 1a.9) and editorially expanded as the corpus grows. These are not derived from user query history — they are maintained in `/lib/data/curated-queries.json`, reviewed by SRF-aware editors (ADR-078), and versioned in git. Examples: "How do I overcome fear?", "What is the purpose of life?", "How do I meditate?" Editorial governance: same human-review gate as all user-facing content.

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
- The search placeholder remains "What are you seeking?" (Deliverable 1a.7)

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

#### Multilingual Suggestions (Milestone 5b)

Per-language suggestion indices are required. Each language gets:
- Its own extracted corpus vocabulary (from language-specific chunks)
- Localized theme names (from `topic_translations`)
- Localized curated queries (from `messages/{locale}.json`)
- Language-specific `pg_trgm` or edge-cached index

**Transliteration challenge:** Hindi/Bengali seekers often type Romanized input (e.g., "samadhi" not "समाधि"). CJK languages have no word boundaries, making prefix matching fundamentally different. Thai script also lacks word boundaries and requires ICU segmentation. The suggestion system must handle both native script and Romanized input for Indic and Thai languages. This is an open design question — see CONTEXT.md.

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

#### Milestone Progression

| Milestone | Suggestion Capability | Source |
|-----------|----------------------|--------|
| 1a | Basic prefix matching on single-book vocabulary + chapter titles | Corpus extraction from Autobiography, pre-computed |
| 3a | Multi-book vocabulary + theme names + bridge-powered suggestions + curated queries | Expanded corpus + spiritual-terms.json + editorial |
| 5b | Per-language suggestion indices + transliteration support | Language-specific indices |
| 7a | Optional personal "recent searches" (client-side `localStorage` only, no server storage) | On-device only |

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
CREATE EXTENSION IF NOT EXISTS vector;              -- pgvector (dense vector search)
CREATE EXTENSION IF NOT EXISTS pg_search;           -- ParadeDB BM25 full-text search (ADR-114)
CREATE EXTENSION IF NOT EXISTS pg_trgm;             -- trigram similarity (fuzzy matching, suggestion fallback)
CREATE EXTENSION IF NOT EXISTS unaccent;            -- diacritics-insensitive search (ADR-080)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;  -- query performance monitoring (ADR-124)

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
 source_url TEXT, -- PDF URL for Arc 1 ingestion
 contentful_id TEXT, -- Contentful entry ID (production)
 cover_image_url TEXT,
 bookstore_url TEXT, -- SRF Bookstore URL for "Find this book" link.
 -- Points to SRF Bookstore for all books. If per-language bookstore
 -- routing is needed at Milestone 5b (YSS for Hindi/Bengali), add a
 -- simple lookup table — zero schema changes required now.
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

 -- Cross-language alignment (Milestone 5b)
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
 centrality_score REAL,  -- PageRank from graph batch (Milestone 3b+, ADR-117)
 community_id TEXT,      -- community detection cluster (Milestone 3b+, ADR-117)
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

-- Milestone 5b: Chinese (Jieba) and Japanese (Lindera) partial indexes
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
-- languages. CJK-specific indexes (Jieba, Lindera) added in Milestone 5b.
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
-- Milestone 2a: table created (empty). Milestone 5b: populated via AI-assisted workflow (ADR-078).

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
-- Arc 1: six spiritual quality themes (displayed as "Doors of Entry" on homepage)
INSERT INTO teaching_topics (name, slug, category, sort_order, description) VALUES
 ('Peace', 'peace', 'quality', 1, 'Inner peace, calmness, stillness of mind, overcoming restlessness and anxiety, mental tranquility, equanimity in the face of difficulty'),
 ('Courage', 'courage', 'quality', 2, 'Overcoming fear, bravery, inner strength, perseverance through difficulty, spiritual fortitude, willpower'),
 ('Healing', 'healing', 'quality', 3, 'Physical healing, emotional healing, recovery from suffering, divine healing power, overcoming illness, spiritual wholeness'),
 ('Joy', 'joy', 'quality', 4, 'Divine joy, bliss, happiness, cheerfulness, overcoming sadness and depression, finding joy within, ever-new joy'),
 ('Purpose', 'purpose', 'quality', 5, 'Life purpose, meaning, dharma, vocation, finding direction, why am I here, fulfilling divine plan'),
 ('Love', 'love', 'quality', 6, 'Divine love, unconditional love, devotion, human love, expanding the heart, love for God, love for all beings');

-- Milestone 3a+: life situation themes (accessible from "Browse all themes" page, not on homepage grid)
-- These are added as content is ingested and sufficient passages are confirmed.
-- Minimum threshold: ~20 reviewed passages before a situation theme page goes live.
-- INSERT INTO teaching_topics (name, slug, category, sort_order, description) VALUES
-- ('Relationships', 'relationships', 'situation', 1, 'Marriage, friendship, family bonds, human love, companionship, interpersonal harmony, forgiveness between people, how to treat others, divine friendship'),
-- ('Parenting', 'parenting', 'situation', 2, 'Raising children, parenthood, guiding young souls, family life, teaching children spiritual values, a parent''s duty'),
-- ('Loss & Grief', 'loss-and-grief', 'situation', 3, 'Death of a loved one, bereavement, grief, consolation, the soul''s continuity, life after death, eternal life'),
-- ('Work', 'work', 'situation', 4, 'Livelihood, career, right activity, duty, service, karma yoga, finding meaning in work, balancing material and spiritual life'),
-- ('Loneliness', 'loneliness', 'situation', 5, 'Isolation, feeling alone, finding the inner companion, solitude vs loneliness, divine companionship, belonging'),
-- ('Aging', 'aging', 'situation', 6, 'Growing older, the body and the soul, vitality, wisdom of age, preparing for the afterlife, eternal youth of the spirit');

-- Milestone 3c+: exploration themes — persons, principles, scriptures, practices (ADR-033)
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
 relation_type TEXT, -- NULL (Milestones 1a–2b), classified in Milestone 3c (ADR-005 E6):
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

-- chunk_references table added in Milestone 3c (Related Teachings & Reader Intelligence)
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
-- Milestone 3b+ adds PATH C (graph-augmented retrieval via Postgres) as a third source
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
-- ADR-120 Tiers 2 and 4) and graph intelligence (ADR-117).
CREATE TABLE entity_registry (
 id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 canonical_name  TEXT NOT NULL,
 entity_type     TEXT NOT NULL,     -- Teacher|DivineName|Work|Technique|SanskritTerm|Concept|Place|ExperientialState
 aliases         TEXT[],            -- all known surface forms
 language        CHAR(5),
 definition      TEXT,
 srf_definition  TEXT,              -- Yogananda's specific definition if distinct
 centrality_score REAL,             -- PageRank from graph batch (Milestone 3b+, ADR-117)
 community_id   TEXT,               -- community detection cluster (Milestone 3b+, ADR-117)
 bridge_score   REAL,               -- betweenness centrality (Milestone 3b+, ADR-117)
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
-- EXTRACTED RELATIONSHIPS (graph intelligence — ADR-115, ADR-117)
-- ============================================================
-- Every relationship triple extracted by the enrichment pipeline.
-- Queried directly by graph-augmented retrieval (PATH C, Milestone 3b+).
-- Graph algorithm batch job reads from this table nightly.
CREATE TABLE extracted_relationships (
 id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 chunk_id        UUID REFERENCES book_chunks(id),
 subject_entity  TEXT,
 relationship    TEXT,              -- TEACHES|INTERPRETS|DESCRIBES_STATE|MENTIONS|etc.
 object_entity   TEXT,
 confidence      REAL,
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

### Contentful Content Model (Arc 1+)

Created in Milestone 1a as part of Contentful space setup. The content model is the editorial source of truth from the first milestone (ADR-010).

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

**Milestone 1a sync (batch script):**
```
Contentful import complete (all TextBlocks published)
 │
 ▼
Batch sync script (run locally or via CI)
 │
 ├── Fetch all TextBlocks from Contentful Delivery API
 ├── Extract plain text from Rich Text JSON AST
 ├── Chunk by paragraph boundaries (ADR-048)
 ├── Unified enrichment pass (Claude, ADR-115)
 ├── Generate embedding via Voyage voyage-3-large (ADR-118)
 ├── Upsert into Neon book_chunks table
 │ (matched by contentful_id)
 └── Log sync event
```

**Milestone 1b+ sync (webhook-driven):**
```
Contentful publish event
 │
 ▼
Webhook → Vercel Function
 │
 ├── Fetch updated TextBlock from Contentful API
 ├── Extract plain text from Rich Text JSON AST
 ├── Chunk, enrich, generate embedding
 ├── Upsert into Neon book_chunks table
 │ (matched by contentful_id)
 └── Log sync event
```

---

## DES-005: Content Ingestion Pipeline

### Arc 1 Pipeline (PDF → Contentful → Neon)

Contentful is the editorial source of truth from Arc 1 (ADR-010). The ingestion pipeline imports processed text into Contentful, then syncs to Neon for search indexing. Pre-launch, SRF will provide non-PDF digital text that goes directly into Contentful.

```
Step 1: Download PDF
 └── Autobiography of a Yogi from spiritmaji.com
 └── Pre-launch: SRF provides digital text (non-PDF) — goes
     directly to Step 3.5 (Contentful import)

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

Step 3.5: Import into Contentful (ADR-010)
 └── Import reviewed text into Contentful via Management API
 └── Create Book → Chapter → Section → TextBlock entries
 └── Map chapter/page boundaries to content model structure
 └── Rich Text AST preserves formatting (bold, italic,
     footnotes, verse numbers, poetry line breaks)
 └── Each TextBlock carries pageNumber for citation
 └── Verify import: spot-check 10% of TextBlocks against
     source markdown for formatting fidelity
 └── Contentful is now the editorial source of truth —
     all subsequent corrections happen here

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
 └── Arc 1: English-only, but column populated for future use

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

Step 9: Insert into Neon (sync from Contentful)
 └── Populate books, chapters, book_chunks tables
 └── Each book_chunk row carries contentful_id linking to
     the source TextBlock in Contentful
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

Step 12: Graph Metrics (Milestone 3b+, ADR-117 — nightly batch, not per-ingestion)
 └── Nightly Python + NetworkX job loads full graph from Postgres
 └── Runs PageRank, community detection, betweenness centrality
 └── Writes results to centrality_score, community_id, bridge_score columns
 └── extracted_relationships (Step 7) feed graph structure automatically
```

### Webhook Sync Pipeline (Contentful → Neon, Milestone 1b+)

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

Step 6: Graph updates (Milestone 3b+, ADR-117)
 └── extracted_relationships updated in Postgres (Step 3)
 └── Nightly batch job recomputes graph metrics automatically

Step 7: Search index, relations, suggestions, and graph
 are always in sync with editorial source
```

---

## ADR-041: Arc 1 Bootstrap

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
 └── Run ingestion script (deliverable 1a.4)
 └── Verify: pnpm run ingest -- --book autobiography
 └── Check: book_chunks populated, embeddings present
 └── Run: pnpm run relations -- --full
 └── Smoke test: search "How do I overcome fear?" returns results
```

### Environment Variables

See DES-039 § Environment Configuration for the canonical `.env.example`, named constants (`/lib/config.ts`), CI-only secrets, and developer tooling configuration. That section is the single source of truth for all environment variables.

**Milestone 1a minimum viable `.env.local`** (the subset needed before Contentful is connected):

```bash
NEON_DATABASE_URL=               # From Neon Console → Connection Details (pooled)
NEON_DATABASE_URL_DIRECT=        # From Neon Console → Connection Details (direct)
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=               # IAM user with Bedrock inference permissions
AWS_SECRET_ACCESS_KEY=           # Paired with above
VOYAGE_API_KEY=                  # From Voyage AI dashboard
NEXT_PUBLIC_SENTRY_DSN=          # From Sentry → Project Settings → Client Keys
SENTRY_AUTH_TOKEN=               # From Sentry → Settings → Auth Tokens
```

---

## ADR-048: Chunking Strategy

The chunking algorithm is the single most important factor in search retrieval quality. Yogananda's prose style varies dramatically across books, requiring a nuanced strategy.

### Default Chunking (Milestones 1a–3c: narrative, collected talks, short works)

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

### Verse-Aware Chunking (Milestone 3d: *Second Coming of Christ*, *God Talks With Arjuna*, *Wine of the Mystic*)

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Unit** | Verse-commentary pair | Maintains the interpretive relationship |
| **Long commentaries** | Split at paragraph boundaries within commentary; each sub-chunk retains verse text as prefix | Verse context travels with every fragment |
| **Cross-reference** | Verse reference stored as structured metadata (e.g., "Bhagavad Gita IV:7") | Enables side-by-side commentary view |

### Per-Language Validation (Milestone 5b)

English-calibrated chunk sizes (200–300 tokens) may produce different semantic density across scripts. CJK tokenization differs significantly from Latin scripts; Devanagari and Bengali have different word-boundary characteristics. Validate retrieval quality per language before committing to chunk sizes. Adjust token ranges per language if necessary. See ROADMAP Milestone 5b for the formal validation requirement.

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

**Milestone:** Populated during Milestone 3a ingestion (when Claude batch processing is available). Retroactively applied to Arc 1 content.

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

**Milestone:** Milestone 3d+ (requires substantial corpus ingestion). Published on the `/integrity` page alongside content hashes.

---

## DES-031: MCP Server Strategy

MCP (Model Context Protocol) serves three tiers of AI consumer, all wrapping the same `/lib/services/` functions. MCP tools are the AI-native complement to HTTP API routes — one service layer, two access protocols. (ADR-097 governs third-party MCP servers; ADR-101 governs the portal's own MCP tiers.)

### Third-Party MCP Servers (ADR-097)

| MCP Server | Use Case | Availability |
|------------|----------|-------------|
| **Neon MCP** | Database schema management, SQL execution, migrations during development | Available now |
| **Sentry MCP** | Error investigation — stack traces, breadcrumbs, affected routes | Arc 1 |
| **Contentful MCP** | Content model design, entry management during development | Milestone 1b (evaluate) |

See ADR-097 for the full evaluation framework (essential, high-value, evaluate, not recommended).

### SRF Corpus MCP — Three-Tier Architecture (ADR-101)

**Status: Unscheduled.** All three SRF Corpus MCP tiers moved to ROADMAP.md § Unscheduled Features (2026-02-24). The architecture below is preserved as design reference for when scheduling is decided. Third-party MCP servers (Neon, Sentry, Contentful) remain on schedule.

```
Seeker (browser) → API Route → Service Layer → Neon
AI agent (MCP)   → MCP Tool  → Service Layer → Neon
Claude Code (dev) → MCP Tool → Service Layer → Neon
```

The service layer doesn't care who's calling. The access protocol and metadata envelope differ by tier.

#### Tier 1: Development (Arc 1)

Unrestricted access for Claude Code during portal development. Also used for iterating on guide pathway generation prompts (DES-035 § Worldview Guide Pathway Generation, DES-048 § Worldview Pathway Catalog) — developer tests "generate a guide pathway for Buddhist meditators" interactively, refining prompt templates before deploying to the admin portal batch workflow.

| Tool | Service Function | Purpose |
|---|---|---|
| `search_corpus(query, limit)` | `search.ts` | Find passages by semantic query |
| `search_by_theme(slug)` | `themes.ts` | Theme-based retrieval |
| `search_references(source_name)` | `references.ts` | External reference lookup |
| `get_vocabulary_bridge(category)` | reads `spiritual-terms.json` | Terminology mapping |
| `get_book_metadata(slug)` | `books.ts` | Book information |
| `get_theme_metadata(slug)` | `themes.ts` | Theme information |

#### Tier 2: Internal (Milestone 3b+)

Authenticated service-to-service access for editorial AI agents, batch pipelines, admin portal AI features, and cross-property consumers (SRF app, Retool). Adds tools that DES-035 AI workflows need for corpus-grounded proposals. Authentication via API key or IAM role (not Auth0).

| Tool | Service Function | Purpose | Milestone |
|---|---|---|---|
| `get_chunk_with_context(chunk_id, window)` | `chunks.ts` | Passage + N surrounding chunks (for QA, classification, review) | 3b |
| `get_similar_passages(chunk_id, threshold, limit)` | `search.ts` | Embedding-based nearest neighbors (distinct from theme search) | 3b |
| `get_glossary_terms_in_passage(chunk_id)` | `glossary.ts` | Glossary terms in a passage with definitions | 3b |
| `get_content_coverage(theme_slug)` | `themes.ts` | Passage count, book distribution, tone distribution per theme | 3b |
| `verify_citation(book_slug, chapter, page)` | `citations.ts` | Confirm a quote exists in the corpus | 3b |
| `get_pending_reviews(queue_type, limit)` | `queue.ts` | Items awaiting human review in a specific queue | 3b |
| `get_daily_passage(language, exclude_id)` | `daily.ts` | Random passage from curated pool | 3b |
| `get_cross_book_connections(chunk_id)` | `relations.ts` | Related passages from other books | 3c |
| `get_person_context(person_slug)` | `people.ts` | Biography, lineage position, key mentioning passages | 3c |
| `get_graph_neighborhood(node_id, depth, types[])` | `graph.ts` | Subgraph around any node, filtered by node/edge type | 3d |
| `get_search_trends(period, min_count)` | `analytics.ts` | Anonymized aggregated query themes (DELTA-compliant) | 3d |
| `find_concept_path(source_slug, target_slug)` | `graph.ts` | Shortest ontological path between two concepts | Arc 4 |
| `get_passage_translations(canonical_chunk_id)` | `translations.ts` | All language variants of a passage | 5b |

**Internal MCP use cases by consumer:**

| Consumer | Primary Tools | Milestone |
|---|---|---|
| Theme tag proposal AI | `get_similar_passages`, `get_content_coverage`, `get_graph_neighborhood` | 3b, 3d |
| Guide pathway generation AI | `search_corpus`, `search_references`, `get_vocabulary_bridge`, `find_concept_path` | 3b, Arc 4 |
| Ingestion QA AI | `get_chunk_with_context`, `verify_citation` | 3b |
| Translation review AI | `get_passage_translations`, `get_glossary_terms_in_passage` | 5b |
| Reading thread drafting AI | `get_cross_book_connections`, `get_graph_neighborhood`, `find_concept_path` | 3c, 3d, Arc 4 |
| Social media caption AI | `search_corpus`, `get_book_metadata`, `get_theme_metadata` | 5a |
| Impact narrative AI | `get_search_trends`, `get_graph_neighborhood` | 3d |
| SRF mobile app | `search_corpus`, `get_daily_passage`, `get_graph_neighborhood`, `get_person_context` | TBD (stakeholder) |
| Admin portal AI features | `get_pending_reviews`, `get_content_coverage`, `get_search_trends` | 4, 6 |

#### Tier 3: External (Milestone 5a+)

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

## DES-039: Infrastructure and Deployment

All infrastructure is defined as code per SRF engineering standards from Milestone 1a. See ADR-016.

### Bootstrap: Greenfield Provisioning

The portal starts greenfield — no existing infrastructure to import. Terraform creates all resources from scratch on first `terraform apply`. Any Neon projects or Vercel projects created during design exploration (e.g., via MCP) should be deleted before bootstrap to avoid naming conflicts.

**One-time manual bootstrap** (before first `terraform apply`):
1. Create Terraform Cloud organization + workspace (see ADR-016 § Terraform State)
2. Create AWS IAM OIDC Identity Provider + IAM Role (see ADR-016 § OIDC Federation)
3. Populate GitHub secrets (see CONTEXT.md § Bootstrap Credentials Checklist)
4. Run `terraform init` to connect workspace to TFC backend

After bootstrap, all infrastructure changes flow through PRs → `terraform plan` → merge → `terraform apply`.

### Terraform Module Layout

```
/terraform/
 main.tf — Provider configuration, TFC backend
 variables.tf — Input variables (project name, environment)
 outputs.tf — Connection strings, URLs, DSNs
 versions.tf — required_providers with version constraints

 /modules/
 /neon/ — Neon project, database, roles, pgvector, pg_search
 /vercel/ — Vercel project, env vars
 /sentry/ — Sentry project, DSN, alert rules
 /aws/ — IAM OIDC provider, Lambda role, S3 buckets, Budgets alarm
 /cloudflare/ — DNS records, WAF rules (deferred until custom domain)
 /newrelic/ — Synthetics monitors, alert policies (Milestone 3d)

 /environments/
 dev.tfvars — Milestone 1a (only active environment)
 staging.tfvars — Arc 4+
 prod.tfvars — Arc 4+
```

#### Progressive Module Activation

Modules are activated via feature-flag variables in `dev.tfvars`. This avoids commenting out modules or maintaining separate Terraform configurations per milestone.

| Variable | 1a | 1b | 3a | 4+ |
|----------|----|----|----|----|
| `enable_neon` | `true` | `true` | `true` | `true` |
| `enable_sentry` | `true` | `true` | `true` | `true` |
| `enable_aws_core` | `true` | `true` | `true` | `true` |
| `enable_vercel` | `false` | `true` | `true` | `true` |
| `enable_lambda` | `false` | `false` | `true` | `true` |
| `enable_cloudflare` | `false` | `false` | `false` | when domain assigned |
| `enable_newrelic` | `false` | `false` | `false` | 3d |

Each module is conditionally included via `count = var.enable_<module> ? 1 : 0`. The first `terraform apply` in Milestone 1a creates Neon project, Sentry project, and AWS core resources (OIDC provider, IAM roles, S3 bucket, Budget alarm). Milestone 1b adds Vercel. Milestone 3a adds Lambda. Clean, incremental, auditable.

### Boundary: Terraform vs. Application Code

| Managed by Terraform | Managed by Application Code |
|---------------------|-----------------------------|
| Service creation (Neon project, Vercel project, Sentry project) | Database schema + extensions (dbmate SQL migrations — `CREATE EXTENSION IF NOT EXISTS pgvector`, etc.) |
| Environment variables, secrets placeholders | `vercel.json`, `sentry.client.config.ts`, `newrelic.js` |
| AWS IAM roles, S3 buckets, Budgets alarm | Lambda handler code (`/lambda/`) |
| — | GitHub settings (manual), CI workflows (`.github/workflows/`) |
| DNS records, domain bindings (when active) | Application routing (`next.config.js`) |
| Alert rules, Synthetics monitors | Structured logging (`lib/logger.ts`) |

### Source Control and CI/CD

| Phase | SCM | CI/CD | Terraform State |
|-------|-----|-------|-----------------|
| **Primary (all arcs)** | GitHub | GitHub Actions | Terraform Cloud (free tier) |
| **If SRF requires migration** | GitLab (SRF IDP) | GitLab CI/CD | GitLab Terraform backend |

#### CI/CD Pipeline (GitHub Actions)

```
On every PR:
 1. Lint + type check
 2. Vitest (unit/integration)
 3. axe-core (accessibility)
 4. next build
 5. Playwright (E2E)
 6. Lighthouse CI (performance)
 7. Search quality suite
 8. terraform fmt -check + terraform validate (if /terraform/ changed)
 9. terraform plan (if /terraform/ changed) — posted as PR comment

On merge to main:
 1. All of the above
 2. terraform apply (dev)
```

Infrastructure changes (`/terraform/**`) trigger `terraform fmt -check`, `terraform validate`, `terraform plan` on PR, and `terraform apply` on merge. Application changes trigger the full test suite. Both can trigger in the same PR.

#### Workflow File Structure

```
.github/
 workflows/
   ci.yml              — [1a] App CI: lint, type check, test, build, a11y, Lighthouse, search quality
   terraform.yml        — [1a] Infra CI: fmt, validate, plan (PR), apply (merge to main)
   neon-branch.yml      — [1b] Neon branch lifecycle: create on PR open, delete on PR close
   neon-cleanup.yml     — [1b] Nightly: delete orphaned Neon preview branches
 dependabot.yml         — [1a] Automated provider + dependency update PRs
```

Milestone 1a creates `ci.yml`, `terraform.yml`, and `dependabot.yml`. The Neon branch workflows (`neon-branch.yml`, `neon-cleanup.yml`) are added in 1b when preview deployments become active (Vercel enabled).

**`ci.yml`** runs on all PRs and pushes to main. No AWS credentials needed — pure app testing.

**`terraform.yml`** runs only when `/terraform/**` changes. Uses OIDC federation (`AWS_ROLE_ARN`) for AWS auth. Provider tokens (`NEON_API_KEY`, `VERCEL_TOKEN`, `SENTRY_AUTH_TOKEN`) as GitHub secrets. Posts `terraform plan` output as PR comment. On merge to main, `terraform apply` runs via TFC CLI-driven workflow (TFC auto-apply enabled for dev workspace — no manual confirmation needed).

**`neon-branch.yml`** runs on PR lifecycle events. Uses `NEON_API_KEY` secret. Creates a Neon branch on PR open, deletes on PR close.

**`neon-cleanup.yml`** runs on `schedule: cron('0 3 * * *')`. Calls `/scripts/neon-branch-cleanup.sh`. Catches orphans.

**`dependabot.yml`** covers two ecosystems: `terraform` (provider updates for `/terraform/`) and `npm` (dependency updates). Provider update PRs automatically trigger `terraform.yml`, producing a plan diff for review.

#### Vercel Deployment Strategy

Vercel auto-deploys on git push via its native GitHub integration. Terraform manages the Vercel *project* (settings, environment variables, domain bindings) but does not trigger deployments. This keeps the Terraform boundary clean ("Terraform creates services; app code triggers deployments") and avoids race conditions between Terraform-triggered and git-triggered deploys.

For Arc 4+ multi-environment promotion (dev → staging → prod), deployment switches to Vercel CLI invoked from CI scripts (ADR-018), with Vercel's git integration disabled. This gives explicit control over which environment receives which build.

#### Neon Branch-per-PR

Preview deployments use Neon's branching for database isolation:

| Branch Type | Lifecycle | TTL | Cleanup |
|-------------|-----------|-----|---------|
| **Production** (`main`) | Permanent | — | — |
| **Preview** (per PR) | Created on PR open | 7 days after last commit | GitHub Action on PR close + nightly cleanup script |
| **CI test** (per run) | Created at test start | Deleted at test end | GitHub Action post-step |

TTL enforcement: a GitHub Action runs on PR close (`types: [closed]`) to delete the associated Neon branch via Neon API. A nightly cleanup script (`/scripts/neon-branch-cleanup.sh`) catches orphans — branches older than 7 days with no open PR. Both use the `NEON_API_KEY` secret.

#### Cost Alerting

Terraform provisions an AWS Budget alarm at 80% and 100% of monthly target ($100 for Arcs 1–3, adjusted as services scale). The alarm sends email to the human principal. Neon and Vercel cost alerts are configured manually in their dashboards (no Terraform provider support for spend alerts).

### Environment Configuration

The portal has three distinct configuration layers — application environment variables, named constants, and developer tooling — each with a clear owner and location. ADR-041 and all other sections reference this canonical definition.

#### 1. Application Environment Variables (`.env.example`)

Values that vary per environment or contain secrets. The `.env.example` file is the local development reference. Deployed environments receive these via Terraform outputs and Vercel encrypted env vars.

```bash
# .env.example — Application environment variables
# Copy to .env.local for local development.
# In deployed environments, Terraform outputs and Vercel secrets populate these.

# ── Neon PostgreSQL ─────────────────────────────────────────────
NEON_DATABASE_URL=               # [terraform] Pooled connection (serverless functions)
NEON_DATABASE_URL_DIRECT=        # [terraform] Direct connection (dbmate migrations, scripts)
NEON_PROJECT_ID=                 # [terraform] Neon API calls

# ── AWS (Bedrock inference from Vercel) ─────────────────────────
AWS_REGION=us-west-2             # [terraform] Bedrock, Lambda, S3
AWS_ACCESS_KEY_ID=               # [terraform] IAM user: portal-app-bedrock (Bedrock inference only)
AWS_SECRET_ACCESS_KEY=           # [terraform] Paired with above — keys in TFC-encrypted state

# ── AI ──────────────────────────────────────────────────────────
VOYAGE_API_KEY=                  # [secret] Voyage voyage-3-large embeddings (ADR-118)

# ── Contentful ──────────────────────────────────────────────────
CONTENTFUL_SPACE_ID=             # [terraform] Space identifier
CONTENTFUL_ACCESS_TOKEN=         # [secret] Delivery API (read-only)
CONTENTFUL_MANAGEMENT_TOKEN=     # [secret] Management API — ingestion scripts only

# ── Observability ───────────────────────────────────────────────
NEXT_PUBLIC_SENTRY_DSN=          # [terraform] Sentry error tracking (bundled into client JS)
SENTRY_AUTH_TOKEN=               # [secret] Source map uploads

# ── Future milestones (commented until needed) ──────────────────
# YOUTUBE_API_KEY=               # [secret] Arc 2+ — video integration
# RESEND_API_KEY=                # [secret] Milestone 5a — email
# NEXT_PUBLIC_AMPLITUDE_KEY=     # [terraform] Milestone 3d — analytics
# NEW_RELIC_LICENSE_KEY=         # [secret] Milestone 3d — observability
```

**Tag legend:** `[terraform]` = set by Terraform output in deployed environments (fill manually for local dev). `[secret]` = set manually everywhere, never in Terraform state.

**Credential distribution pattern.** Terraform's AWS module creates the `portal-app-bedrock` IAM user and generates access keys (`aws_iam_access_key`). Terraform's Vercel module reads those outputs and sets them as `vercel_project_environment_variable` resources. Result: a single `terraform apply` creates the IAM user AND distributes its credentials to Vercel — the human never sees or handles the raw secret key. The secret key exists in TFC-encrypted state (acceptable; TFC state is access-controlled). For secrets that Terraform doesn't create (Voyage API key, Contentful tokens), Terraform provisions empty Vercel env var placeholders, and the human populates them in the Vercel dashboard.

**AWS authentication by context:**

| Context | Auth mechanism | Credentials |
|---|---|---|
| **Vercel functions → Bedrock** | IAM user (`portal-app-bedrock`) | `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` as Vercel env vars |
| **Lambda → Bedrock/S3** | IAM execution role (attached by Terraform) | No env vars needed — role is automatic |
| **GitHub Actions → AWS** | OIDC federation (ADR-016) | `AWS_ROLE_ARN` secret, no stored keys |
| **Local dev → Bedrock** | IAM user or named profile | `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` in `.env.local`, or `AWS_PROFILE=srf-dev` |

The Vercel IAM user (`portal-app-bedrock`) has Bedrock inference permissions only: `bedrock:InvokeModel*` and `bedrock:Converse*`, scoped to the configured model ARNs in `us-west-2`. This covers both the legacy `InvokeModel` API and the newer unified `Converse` API (plus their streaming variants), allowing the `@anthropic-ai/bedrock-sdk` to use either without IAM failures. It cannot access S3, Lambda, or any other AWS service. Terraform creates this user; credentials are rotated quarterly via manual key rotation (create new key → update Vercel env var → delete old key). Automated rotation deferred to Milestone 3d operational maturity. This is separate from the CI OIDC role (which has broader permissions for Terraform apply, S3 backups, Lambda deployment).

**Future optimization: Vercel runtime OIDC.** If Vercel supports OIDC federation for serverless function → AWS auth (as it does for deployment contexts), `portal-app-bedrock` can be replaced with an IAM role + Vercel trust policy — eliminating stored credentials entirely. Same zero-key security model as GitHub Actions OIDC. Evaluate at Milestone 3d operational maturity review.

**`ANTHROPIC_API_KEY` is removed from `.env.example`.** The application code uses `@anthropic-ai/bedrock-sdk` (not `@anthropic-ai/sdk`) for all Claude calls, routing through Bedrock in every environment including local dev. One code path, one auth mechanism. If a developer cannot access Bedrock (e.g., no AWS account yet during initial scaffold), the search pipeline gracefully degrades — search works without Claude-powered query expansion, returning BM25 + vector results only.

**What is NOT in `.env.example`:**
- Model IDs, chunk sizes, search parameters → `/lib/config.ts` (see below)
- CI-only secrets (NEON_API_KEY, VERCEL_TOKEN, AWS_ROLE_ARN) → GitHub Secrets only (see CONTEXT.md § Bootstrap Credentials Checklist)
- Claude Code developer tooling → developer shell profile (see below)

#### 2. Named Constants (`/lib/config.ts` — ADR-123)

Tunable parameters that are not secrets and do not vary between environments. These are the "magic numbers" that ADR-123 requires as named constants. They change via code PRs, not env var updates.

```typescript
// /lib/config.ts — Named constants per ADR-123
// These are tunable defaults, not architectural commitments.
// Change via PR with evidence. Annotate: date, old → new, reason.

// ── AI Model Selection (ADR-014) ───────────────────────────────
export const BEDROCK_REGION = 'us-west-2';

// Real-time models (search pipeline — latency-sensitive)
export const CLAUDE_MODEL_CLASSIFY = 'anthropic.claude-3-5-haiku-20241022-v1:0';
export const CLAUDE_MODEL_EXPAND   = 'anthropic.claude-3-5-haiku-20241022-v1:0';
export const CLAUDE_MODEL_RANK     = 'anthropic.claude-3-5-haiku-20241022-v1:0';

// Batch models (offline — quality-sensitive)
export const CLAUDE_MODEL_BATCH    = 'anthropic.claude-opus-4-6-v1';

// ── Embedding (ADR-118) ────────────────────────────────────────
export const EMBEDDING_MODEL      = 'voyage-3-large';
export const EMBEDDING_DIMENSIONS = 1024;
export const EMBEDDING_INPUT_TYPE_QUERY    = 'query';
export const EMBEDDING_INPUT_TYPE_DOCUMENT = 'document';

// ── Chunking (ADR-048) ────────────────────────────────────────
export const CHUNK_SIZE_TOKENS    = 1000;
export const CHUNK_OVERLAP_TOKENS = 200;

// ── Search (ADR-044, ADR-119) ──────────────────────────────────
export const RRF_K = 60;
export const SEARCH_RESULTS_DEFAULT = 10;
export const SEARCH_RESULTS_MAX     = 50;
export const SEARCH_DEBOUNCE_MS     = 300;

// ── Rate Limiting (ADR-023) ────────────────────────────────────
export const RATE_LIMIT_SEARCH_RPM = 30;
export const RATE_LIMIT_API_RPM    = 60;

// ── Cache TTLs ─────────────────────────────────────────────────
export const CACHE_TTL_SEARCH_SECONDS     = 300;
export const CACHE_TTL_SUGGESTIONS_SECONDS = 3600;
```

Model IDs are parameters, not secrets — they don't need env var indirection. When a model is upgraded, the change is a code PR with a `terraform plan`-equivalent diff: visible, reviewable, and auditable.

#### 3. CI-Only Secrets (GitHub Secrets)

Never in `.env.local` or `.env.example`. Used only by GitHub Actions and Terraform. Documented in CONTEXT.md § Bootstrap Credentials Checklist.

| Secret | Used by | Purpose |
|---|---|---|
| `TF_API_TOKEN` | Terraform | Terraform Cloud authentication |
| `AWS_ROLE_ARN` | GitHub Actions OIDC | Assume IAM role for AWS operations |
| `NEON_API_KEY` | Terraform, branch cleanup script | Neon provider + branch management |
| `VERCEL_TOKEN` | Terraform | Vercel provider |
| `VERCEL_ORG_ID` | Terraform | Scope Vercel operations |
| `SENTRY_ORG` | Terraform | Scope Sentry operations |

#### 4. Developer Tooling (Claude Code + MCP)

The AI developer (Claude Code) needs its own configuration, separate from the application. These are set in the developer's shell profile or session, not in `.env.example`.

```bash
# Claude Code — route through AWS Bedrock (same account as app)
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-west-2
export AWS_PROFILE=srf-dev           # or AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY

# Claude Code — Bedrock bearer token (alternative to IAM credentials)
# export AWS_BEARER_TOKEN_BEDROCK=   # If using bearer token auth instead of IAM

# Claude Code — experimental features
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

# MCP servers (configured in .claude/settings.json, not env vars)
# Neon MCP: uses NEON_API_KEY from env or settings
# Sentry MCP: uses SENTRY_AUTH_TOKEN from env or settings
```

**Why separate from `.env.example`:** Claude Code env vars configure the *development tool*, not the application. They route the AI developer through the project's AWS account (same billing, same permissions). A human developer using VS Code wouldn't need these; an AI developer using Claude Code does. The application code never reads `CLAUDE_CODE_USE_BEDROCK` — only the Claude Code CLI does.

**AWS authentication for local development:** The developer (human or AI) authenticates to AWS via an IAM user with an `srf-dev` profile, or via `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`. This is separate from the OIDC federation used by GitHub Actions. The IAM user needs Bedrock inference permissions (`bedrock:InvokeModel*`, `bedrock:Converse*`) for the configured region.

### Local Development

Developers run the app locally without Terraform:

1. Clone repo
2. `pnpm install`
3. Copy `.env.example` → `.env.local`, fill in values (see § Environment Variables above)
4. `pnpm db:migrate` (applies dbmate migrations to a Neon dev branch)
5. `pnpm dev` (starts Next.js dev server)

Terraform manages deployed environments. Local development uses direct Neon connection strings and local config files.

*Section revised: 2026-02-25, consolidated environment configuration into single source of truth. Three layers: .env.example (secrets + per-environment), /lib/config.ts (named constants per ADR-123), developer tooling (Claude Code). Region updated to us-west-2 per human directive. Naming standardized: NEON_DATABASE_URL, CONTENTFUL_ACCESS_TOKEN. Updated: CI workflow file structure (ci.yml + terraform.yml + neon-branch.yml + neon-cleanup.yml + dependabot.yml), progressive module activation via feature flags, secret rotation clarified (manual until 3d), Terraform boundary corrected (GitHub settings manual, not Terraform-managed).*

---

## DES-054: Knowledge Graph Ontology

The knowledge graph captures the relationships between teachings, teachers, concepts, and experiences that make Yogananda's corpus a web of interconnected wisdom rather than a flat document collection. The graph ontology is designed in Arc 1; graph intelligence becomes active in Milestone 3b via Postgres tables + Python batch computation (ADR-117).

### Node Types

| Node Type | Description | Primary Key Source | Milestone |
|-----------|-------------|-------------------|-----------|
| **Teacher** | Yogananda, his line of gurus, other teachers he references | `entity_registry` (type = 'person') | 3b |
| **DivineName** | God, Divine Mother, Christ, Krishna, Cosmic Consciousness | `entity_registry` (type = 'divine_name') | 3b |
| **Work** | Published books, collections, individual poems/chants | `books` table | 3b |
| **Technique** | Kriya Yoga (public description only), Hong-Sau, Energization | `entity_registry` (type = 'technique') | 3b |
| **SanskritTerm** | Samadhi, maya, karma, dharma — with canonical forms | `sanskrit_terms` table | 3b |
| **Concept** | Abstract teachings: divine love, self-realization, willpower | `entity_registry` (type = 'concept') | 3b |
| **Scripture** | Bhagavad Gita, Bible, Rubaiyat — works Yogananda comments on | `entity_registry` (type = 'scripture') | 3d |
| **ExperientialState** | States of consciousness (waking → nirvikalpa samadhi) | `entity_registry` (type = 'state') | 3b |
| **Place** | Ranchi, Encinitas, Dakshineswar — biographical/spiritual places | `places` table | 3b |
| **Chunk** | Individual text passages from the corpus | `book_chunks` table | 3b |

All node types correspond to rows in Postgres tables (`entity_registry`, `books`, `book_chunks`, `places`, `sanskrit_terms`). Graph algorithm results (centrality_score, community_id, bridge_score) are stored as columns on the source rows. Chunk embeddings (ADR-118) are used by pgvector for similarity ranking after graph traversal retrieves candidates.

### Edge Types

| Edge Type | From → To | Description | Milestone |
|-----------|-----------|-------------|-----------|
| **LINEAGE** | Teacher → Teacher | Guru-disciple relationship | 3b |
| **AUTHORED** | Teacher → Work | Authorship attribution | 3b |
| **TEACHES** | Chunk → Concept | Passage teaches or discusses a concept | 3b |
| **MENTIONS** | Chunk → SanskritTerm | Sanskrit term appears in passage | 3b |
| **REFERENCES** | Chunk → Scripture | Passage quotes or comments on scripture | 3d |
| **DESCRIBES_STATE** | Chunk → ExperientialState | Passage describes a state of consciousness | 3b |
| **LOCATED_AT** | Teacher → Place | Biographical association | 3b |
| **NEXT / PREV** | Chunk → Chunk | Sequential reading order within a book | 3b |
| **RELATED_CONCEPT** | Concept → Concept | Conceptual relationship (broader/narrower) | 3b |
| **CROSS_TRADITION** | Concept → Concept | Yogananda's explicit cross-tradition mapping | 3d |
| **TECHNIQUE_FOR** | Technique → ExperientialState | Practice leads toward state | 3b |

### Graph Algorithms (Nightly Batch)

Three algorithms run nightly on the full graph and feed suggestion weights and retrieval confidence:

1. **PageRank** — Identifies the most-connected, highest-authority passages and concepts. Feeds the "canonical teaching" signal in Related Teachings (ADR-050).
2. **Community Detection** — Groups densely connected nodes into teaching clusters. Feeds thematic browsing and the Quiet Index (DES-029).
3. **Betweenness Centrality** — Finds bridge passages that connect otherwise separate teaching domains. These are the passages that link, say, meditation technique to devotional practice. Surfaced in Reading Arc suggestions (Milestone 5a+).

### Graph-Augmented Retrieval Query Pattern

Graph-augmented retrieval (PATH C) uses multi-step SQL queries composed in `/lib/services/graph.ts`:

```sql
-- Step 1: Entity resolution — identify concepts in the query
SELECT id, canonical_name, entity_type
FROM entity_registry
WHERE canonical_name = $concept OR $concept = ANY(aliases);

-- Step 2: Graph traversal — find chunks within 2–3 hops
WITH direct_chunks AS (
  SELECT DISTINCT er.chunk_id
  FROM extracted_relationships er
  WHERE er.subject_entity = $canonical_name
     OR er.object_entity = $canonical_name
),
two_hop_chunks AS (
  SELECT DISTINCT er2.chunk_id
  FROM extracted_relationships er1
  JOIN extracted_relationships er2
    ON er1.object_entity = er2.subject_entity
  WHERE er1.subject_entity = $canonical_name
    AND er1.chunk_id != er2.chunk_id
)
SELECT chunk_id FROM direct_chunks
UNION
SELECT chunk_id FROM two_hop_chunks;

-- Step 3: Vector similarity ranking on graph-retrieved candidates
SELECT bc.id, bc.content, bc.book_id,
       1 - (bc.embedding <=> $query_embedding) AS similarity
FROM book_chunks bc
WHERE bc.id = ANY($graph_chunk_ids)
  AND bc.language = $language
ORDER BY similarity DESC
LIMIT 20;
```

This three-step pattern replaces the single openCypher query that Neptune Analytics would have provided. The trade-off is 2-3 SQL round-trips instead of one declarative query — adding ~10-20ms latency, negligible in a pipeline already at 200-400ms. The advantage is: all data in one system, debuggable with standard SQL, no cross-system synchronization.

**Governed by:** ADR-117 (Postgres-Native Graph Intelligence), ADR-116 (Entity Registry), ADR-050 (Related Teachings)

*Section added: 2026-02-23, ADR-117. Revised: 2026-02-23, Neptune removed — Postgres-native implementation.*

---
