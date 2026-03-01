## DES-017: Multi-Language Strategy

(See ADR-075 for architectural rationale, ADR-076 for CSS logical properties, ADR-077 for core language set.)

### Three-Layer Localization

| Layer | What | Approach | Milestone |
|-------|------|----------|-----------|
| **UI chrome** | Nav, labels, buttons, errors, search prompts (~200–300 strings) | `next-intl` with locale JSON files. URL-based routing (`/es/...`, `/de/...`). AI-assisted workflow: Claude drafts → human review → production (ADR-078). | Infrastructure + hi/es translations in Milestone 2a. Remaining 7 languages in Milestone 5b. |
| **Book content** | Yogananda's published text in official translations | Language-specific chunks in Neon (`language` column). Contentful locales (available from Arc 1, activated in Milestone 5b). **Never machine-translate sacred text.** | 5b |
| **Search** | FTS, vector similarity, query expansion | Per-language BM25 index (pg_search, ADR-114). Multilingual embedding model (Voyage, ADR-118). Claude expands queries per language. | 5b |

### Milestone 2a — Bilingual Content and Bilingual UI

Arc 1 ingests content in English and Spanish (ADR-128 Tier 1; Hindi deferred from Arc 1 — authorized source unavailable outside India). **Milestone 2a delivers bilingual UI chrome** — Spanish UI strings translated via Claude draft → human review (ADR-078). A seeker reading Spanish content deserves Spanish navigation. The i18n infrastructure is in place from day one for all 10 core languages:

- All UI strings externalized to `messages/en.json` (never hardcoded in components)
- Spanish UI strings translated: `messages/es.json` (ADR-078 workflow). Hindi (`messages/hi.json`) added when content becomes available.
- Spiritual terminology glossary bootstrapped: `messages/glossary-es.json`. Hindi glossary added with Hindi content.
- String context file: `messages/en.context.json` — per-key description of where each string appears
- Translation script: `scripts/translate-ui.ts` — generates `{locale}.draft.json` from `en.json` + glossary + context
- `next-intl` configured with `en`, `es` locales (`hi` added when Hindi content available; remaining locales in Milestone 5b)
- CSS logical properties throughout (`ms-4` not `ml-4`, `text-align: start` not `text-align: left`)
- `lang` attribute set dynamically per locale on `<html>` element
- `language` column already present on `book_chunks`, `search_queries`, `email_subscribers`
- Playwright visual snapshots verify Hindi/Spanish UI renders correctly (ADR-080 typography, no truncation)

Adding new locales later is a configuration change, not a codebase refactor. Adding new UI strings triggers `scripts/translate-ui.ts` to generate drafts for review.

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

| Book | en | es | de | fr | it | pt | ja | th | hi | bn |
|------|----|----|----|----|----|----|----|----|----|----|
| Autobiography of a Yogi | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ? | ✓ | ✓ |
| Where There Is Light | ✓ | ✓ | ✓ | ✓ | ✓ | ? | ? | ? | ? | ? |
| Sayings | ✓ | ✓ | ? | ? | ? | ? | ? | ? | ? | ? |
| Man's Eternal Quest | ✓ | ✓ | ? | ? | ? | ? | ? | ? | ? | ? |
| Second Coming of Christ | ✓ | ? | ? | ? | ? | ? | ? | ? | ? | ? |

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

**Full-text search:** pg_search / ParadeDB BM25 indexes (ADR-114) handle per-language tokenization, stemming, and normalization via ICU analyzers.

> **Note:** pg_search BM25 indexes are configured per-language using ICU tokenization (defined in § Data Model). Each chunk's `language` column determines the appropriate analyzer at query time. No additional indexes are needed when new languages are added in Milestone 5b — only new content rows with the correct `language` value and the corresponding ICU analyzer configuration.

**Vector search:** The embedding model **must be multilingual** — this is an explicit requirement, not an accident. Voyage voyage-3-large (ADR-118) supports 26 languages and places semantically equivalent passages in different languages close together in the unified cross-lingual embedding space. This means Arc 1 embeddings (en/es) remain valid when Hindi, German, Japanese, and other chunks are added in Milestone 5b — no re-embedding of the existing corpus. Any future embedding model migration (ADR-046) must preserve this multilingual property. Benchmark per-language retrieval quality with actual translated passages in Milestone 5b. Switch to per-language models only if multilingual quality is insufficient — but note that per-language models sacrifice the English fallback's vector search quality and cross-language passage alignment.

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

**Cross-language search as optional future feature:** The multilingual embedding model places semantically equivalent text in different languages close together in vector space. If usage data (Milestone 5b analytics) reveals demand for searching across all languages simultaneously, this can be enabled by calling `hybrid_search` without the `language` filter. But this is not a core Milestone 5b deliverable — locale + English fallback covers the practical need.

### Chunk Relations in a Multilingual Corpus

The `chunk_relations` table stores pre-computed semantic similarity. In a multilingual corpus, a naive "top 30 global" approach would leave non-English languages underserved — most of the 30 slots would be consumed by chunks in other languages (predominantly English, which will be the largest corpus).

**Computation strategy (Milestone 5b):**
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
ไทย
हिन्दी
বাংলা
```

Selection stored in a cookie. Available on every page. Not gated by account.

### Font Stack for Non-Latin Scripts

| Language | Script | Font |
|----------|--------|------|
| Japanese | CJK | Noto Serif JP (reading), Noto Sans JP (UI) |
| Thai | Thai | Noto Serif Thai (reading), Noto Sans Thai (UI) |
| Hindi | Devanagari | Noto Serif Devanagari (reading), Noto Sans Devanagari (UI) |
| Bengali | Bengali | Noto Serif Bengali (reading), Noto Sans Bengali (UI) |
| All Latin | Latin | Merriweather / Lora / Open Sans (existing stack) |

Non-Latin font loading strategy: Hindi locale (`/hi/`) eagerly preloads Noto Serif Devanagari (reading) and Noto Sans Devanagari (UI) in `<head>`. English pages load Noto Sans Devanagari conditionally (only when Devanāgarī characters are present — Gita verses, Holy Science verses). All other non-Latin fonts loaded conditionally when the user selects that locale.

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
3. **Embedding model must be multilingual.** Explicit requirement (not accident). Ensures Arc 1 embeddings remain valid when Milestone 5b adds new languages.
4. **`reader_url` is locale-relative.** API returns `/books/slug/chapter#chunk`. Client prepends locale prefix. API stays presentation-agnostic.
5. **`chunk_relations` store per-language.** Top 30 same-language + top 10 English supplemental per chunk. Ensures non-English languages get full related teachings with English fallback.
6. **Locale + English fallback is the multilingual model.** Arbitrary cross-language search (e.g., Japanese query finding German results) is deferred as optional — the practical need is the user's language plus English fallback, not N×N language combinations. The multilingual embedding model enables cross-language search at near-zero cost if usage data later justifies it.
7. **Chunk size must be validated per language (Milestone 5b).** Token economies differ across scripts — a 300-token chunk in Japanese may hold less semantic content than 300 English tokens. Per-language chunk size benchmarking is required before ingesting non-English content. At minimum, validate that English-calibrated chunk sizes produce acceptable retrieval quality in all target languages.

### Open Questions (Require SRF Input)

> **Central registry:** CONTEXT.md § Open Questions. The Milestone 5b questions below are tracked there with the full stakeholder list.

- Digital text availability of official translations for the remaining 7 non-English core languages beyond Hindi and Spanish (highest-impact Milestone 5b question; Hindi and Spanish already sourced for Arc 1)
- Translation reviewer staffing per language
- YSS portal branding for Hindi/Bengali/Thai locales
- Whether translated editions preserve paragraph structure (affects `canonical_chunk_id` alignment)
- Thai word-boundary handling for search tokenization (Thai script has no whitespace between words)

---
