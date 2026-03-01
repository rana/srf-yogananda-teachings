## DES-031: MCP Server Strategy

MCP (Model Context Protocol) serves two fundamentally different purposes in this project, distinguished by audience and lifecycle:

1. **Platform MCP servers** — Claude's tools for operating infrastructure during development. These are third-party MCP servers connected to Claude Code. They manage platforms, not portal content.
2. **SRF Corpus MCP server** — The portal's own MCP interface for AI consumers (internal and external). Wraps `/lib/services/` functions. Serves content, not infrastructure.

Both ultimately wrap service layers, but they serve different audiences, have different security models, and follow different lifecycles.

### Platform MCP Servers (ADR-097) — AI Operator Tools

These are Claude's operational interface during development. They are the Operations layer of the Three-Layer Neon Management Model (DES-039).

| MCP Server | Use Case | Availability | Role |
|------------|----------|-------------|------|
| **Neon MCP** (`@neondatabase/mcp-server-neon`) | Branch creation, SQL execution, schema diffs, migration safety (`prepare_database_migration`/`complete_database_migration`/`compare_database_schema`), connection string retrieval, Time Travel queries | Available now | **Primary operations interface** — replaces Console for verification, experimentation, and development workflows. See DES-039 § Three-Layer Neon Management Model. |
| **Sentry MCP** | Error investigation — stack traces, breadcrumbs, affected routes | Arc 1 | Debugging and incident response |
| **Contentful MCP** | Content model design, entry management during development | Milestone 1c (evaluate) | CMS operations |

See ADR-097 for the full evaluation framework (essential, high-value, evaluate, not recommended).

### SRF Corpus MCP — Three-Tier Architecture (ADR-101)

**Status: Unscheduled.** All three SRF Corpus MCP tiers moved to ROADMAP.md § Unscheduled Features (2026-02-24). The architecture below is preserved as design reference for when scheduling is decided. Platform MCP servers (Neon, Sentry, Contentful) remain on schedule — they are separate from this.

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

Authenticated service-to-service access for editorial AI agents, batch pipelines, admin portal AI features, and cross-property consumers (SRF app, staff dashboard per PRO-016). Adds tools that DES-035 AI workflows need for corpus-grounded proposals. Authentication via API key or IAM role (not Auth0).

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

**Rate limiting:** Same Vercel Firewall + application-level tiering as HTTP API (ADR-023). Registered consumers (fidelity contract acknowledged) receive higher limits. Unregistered consumers receive anonymous web crawler limits (ADR-081).

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
- `tools/people.ts` — Spiritual Figures tools
- `tools/fidelity.ts` — fidelity metadata envelope wrapper (Tier 3)

All tools delegate to `/lib/services/` — zero business logic in the MCP layer.

---
