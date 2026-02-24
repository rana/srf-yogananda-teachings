<!-- elmer:archive
  id: word-graph-similar-to-knowledge-graph-graph-traversal-of
  topic: Word graph. Similar to knowledge graph. Graph traversal of SRF corpus by individual words. Allow filter for inclusion and/or exclusion.
  archetype: explore-act
  model: opus
  status: approved
  archived: 2026-02-24 02:02 UTC
-->

# Word Graph Enhancement Proposal

## Summary

Enhance the existing Knowledge Graph architecture with a fine-grained word-level graph that enables exploratory traversal of the SRF corpus through individual words and their relationships. This complements the conceptual/entity-focused knowledge graph with a linguistic lens, enabling seekers to discover teachings through vocabulary pathways they might not conceptually anticipate. The word graph reveals how Yogananda's distinctive vocabulary — words like "magnetism," "vibration," "attunement" — forms a linguistic web of spiritual teaching that transcends traditional concept boundaries.

## Analysis

The current architecture includes two graph structures:
1. **Knowledge Graph (DES-054)**: Entity-focused — Teachers, Concepts, Works, Techniques
2. **Concept/Word Graph (DES-055)**: Term-focused but still conceptual — samadhi, meditation, enlightenment

What's missing is the connective tissue between individual words in Yogananda's actual prose. Words like "magnetism," "vibration," "light," "darkness" carry spiritual significance beyond their dictionary meanings. A seeker encountering "magnetism" in one passage should be able to traverse to all uses of that word, then to words that co-occur with it, then to conceptually related words Yogananda uses in similar contexts.

The Concept/Word Graph (DES-055) focuses on canonical spiritual terminology. The proposed Word Graph captures *every significant word* in the corpus — creating a navigable linguistic landscape of Yogananda's vocabulary.

Evidence from examining the design:
- ADR-117 establishes Neptune Analytics for graph operations starting Phase 4
- DES-054 defines node and edge types but focuses on entities, not words
- DES-055 handles concepts/terms but only canonical spiritual vocabulary
- ADR-001 constrains to "direct quotes only" — word graph honors this by exploring Yogananda's actual word choices
- ADR-115 enrichment pipeline could be extended to extract word-level features
- ADR-116 entity registry normalizes concepts but not general vocabulary
- ADR-049 search suggestions use corpus-derived vocabulary (potential seed for word graph)
- Phase 0b.12 entity registry seed could be extended to include word-level vocabulary
- Phase 0b.9 already extracts distinctive terms from chunks for suggestions

The word graph would complement existing features:
- **Related Teachings (ADR-050)**: Currently chunk-to-chunk relations; word graph adds word-to-word
- **Terminology Bridge (ADR-051)**: Per-book vocabulary evolution; word graph tracks actual usage
- **Search Suggestions (ADR-049)**: Already extracting vocabulary; word graph makes it navigable
- **Graph Traversal (DES-003 Step 6)**: Currently concept-based; word graph adds linguistic expansion

## Seeker Value Propositions

The word graph enables three distinct seeker journeys not possible with concept-based navigation alone:

### 1. The Vocabulary Explorer
A seeker encounters the word "magnetism" in a passage about spiritual attraction. They click the word and discover:
- All 47 occurrences of "magnetism" across Yogananda's works
- Words that frequently appear with it: "divine," "spiritual," "attraction," "force"
- Related words by context: "vibration," "attunement," "resonance"
- The journey reveals how Yogananda uses scientific vocabulary to explain spiritual principles

### 2. The Language Learner
A seeker studying Sanskrit encounters "dharma" and wants to understand its semantic field:
- All passages containing "dharma"
- English words Yogananda uses when explaining dharma: "duty," "righteousness," "path"
- Sanskrit terms that co-occur: "karma," "artha," "moksha"
- The graph becomes a contextual Sanskrit-English bridge built from actual usage

### 3. The Pattern Seeker
A devoted reader notices Yogananda frequently uses light/darkness metaphors and wants to explore this pattern:
- Starting from "light" reveals: "darkness," "shadow," "illumination," "radiance"
- Co-occurrence patterns show which spiritual states associate with light vocabulary
- The graph reveals Yogananda's consistent metaphorical framework across all books

## Proposed Changes

### 1. Word Graph Data Model Extension

**What:** Add word-level node type and occurrence edges to the Knowledge Graph
**Where:** Extend DES-054 Knowledge Graph Ontology, new migration for Phase 4
**Why:** Enables word-based navigation that reveals unexpected connections in Yogananda's teachings
**How:**
```sql
-- New node type in entity_registry or dedicated table
CREATE TABLE word_nodes (
    word_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_form TEXT NOT NULL UNIQUE,  -- lowercase, stemmed
    display_forms TEXT[],                  -- actual forms found in text
    part_of_speech TEXT,                   -- noun, verb, adjective
    is_sanskrit BOOLEAN DEFAULT FALSE,
    is_spiritual_term BOOLEAN DEFAULT FALSE,
    frequency INTEGER DEFAULT 0,           -- total occurrences
    idf_score FLOAT,                      -- inverse document frequency
    embedding vector(1024),               -- word embedding
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Word occurrences with context
CREATE TABLE word_occurrences (
    occurrence_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word_id UUID REFERENCES word_nodes(word_id),
    chunk_id UUID REFERENCES book_chunks(chunk_id),
    position_in_chunk INTEGER,            -- word position
    sentence_context TEXT,                -- containing sentence
    grammatical_role TEXT,                -- subject, object, modifier
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Word-to-word relationships
CREATE TABLE word_edges (
    edge_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_word_id UUID REFERENCES word_nodes(word_id),
    to_word_id UUID REFERENCES word_nodes(word_id),
    edge_type TEXT NOT NULL,              -- co_occurs, follows, modifies, etc
    weight FLOAT DEFAULT 1.0,
    context_patterns JSONB,               -- patterns of co-occurrence
    UNIQUE(from_word_id, to_word_id, edge_type)
);
```

### 2. Word Graph Construction Pipeline

**What:** Build the word graph during content ingestion
**Where:** Extend DES-005 Content Ingestion Pipeline with new stage after "Chunk"
**Why:** Automated construction ensures consistency and captures linguistic patterns
**How:**
- Stage 3.5: "Lexical Analysis" — between Chunk and Embed stages
- Extract significant words (filter stopwords, apply frequency thresholds)
- Build co-occurrence matrix within sliding windows (5-10 words)
- Compute PMI (Pointwise Mutual Information) for word associations
- Generate word embeddings separate from chunk embeddings
- Store both token-level and type-level relationships

### 3. Word Graph Traversal API

**What:** New API endpoints for word-based exploration
**Where:** `/app/api/v1/words/` following DES-019 conventions
**Why:** Enable both programmatic access and UI features
**How:**
```typescript
// /api/v1/words/graph
GET /api/v1/words/graph/{word}
  ?depth=2                    // traversal depth
  ?edge_types=co_occurs,synonyms
  ?min_frequency=5           // filter rare words
  ?include_sanskrit=true
  ?language=en

Response: {
  root: { word, frequency, is_spiritual_term },
  nodes: [{ word, frequency, distance_from_root }],
  edges: [{ from, to, type, weight }],
  meta: { total_nodes, total_edges, traversal_depth }
}

// /api/v1/words/occurrences
GET /api/v1/words/occurrences/{word}
  ?include_context=true
  ?group_by=book
  ?cursor=<uuid>
  ?limit=20

// /api/v1/words/similar
GET /api/v1/words/similar/{word}
  ?method=embedding         // or 'co_occurrence'
  ?limit=20
```

### 4. Inclusion/Exclusion Filter System

**What:** Advanced filtering for word graph queries
**Where:** Extend word graph API with filter parameters, new service in `/lib/services/wordGraph.ts`
**Why:** Seekers need to focus exploration (e.g., "only Sanskrit terms" or "exclude common words")
**How:**
```typescript
interface WordGraphFilter {
  include?: {
    partOfSpeech?: string[];      // ['noun', 'verb']
    isSanskrit?: boolean;
    isSpiritualTerm?: boolean;
    minFrequency?: number;
    books?: string[];              // only words from specific books
    themes?: string[];             // only words in themed passages
  };
  exclude?: {
    words?: string[];              // explicit exclusion list
    commonWords?: boolean;         // exclude top 1000 most common
    partOfSpeech?: string[];
    maxFrequency?: number;         // exclude overly common words
  };
}
```

### 5. Word Graph UI Components

**What:** Interactive word exploration interface
**Where:** New components in `/app/components/wordGraph/`, new page at `/explore/words`
**Why:** Visual exploration reveals patterns not visible in search results
**How:**
- **Word Cloud View**: Size by frequency, color by spiritual significance
- **Graph Visualization**: D3 force-directed graph, progressive disclosure
- **Word Journey**: Click word → see occurrences → click related word → continue
- **Filter Panel**: Visual controls for inclusion/exclusion rules
- **Context Panel**: Show passages containing selected word

### 6. Integration with Existing Search

**What:** Augment search with word graph expansion
**Where:** Modify DES-003 Step 6 (Graph Traversal) to include word graph
**Why:** Improves recall for vocabulary-based queries
**How:**
- When query contains non-concept words, traverse word graph for related terms
- Weight expansions by PMI scores and edge types
- Example: "vibration" → "frequency", "resonance", "attunement" (via co-occurrence)

### 7. Word-Concept Bridge

**What:** Connect word nodes to concept nodes
**Where:** New edge type REPRESENTS in DES-054, computed during enrichment
**Why:** Bridges linguistic and conceptual navigation
**How:**
- During enrichment (ADR-115), identify words that represent concepts
- Create REPRESENTS edges: word_node → concept_node
- Enables traversal: "magnetism" (word) → "spiritual magnetism" (concept) → related teachings

### 8. Multilingual Word Mapping

**What:** Cross-language word relationships
**Where:** Extend word_nodes with language column, add TRANSLATION_OF edges
**Why:** Supports ADR-075 multilingual foundation
**How:**
- Each word_node has a language field
- TRANSLATION_OF edges connect equivalent words across languages
- Enable filter: "Show Hindi words that co-occur with [English word]"

### 9. Performance Optimization Strategy

**What:** Pre-computed aggregations and materialized views for common traversals
**Where:** New tables and scheduled jobs in Phase 4 infrastructure
**Why:** Word-level graph could have millions of edges; real-time traversal needs optimization
**How:**
- Materialized view of top co-occurrences per word
- Pre-computed subgraphs for high-frequency spiritual terms
- Cached traversal results with 24-hour TTL
- Progressive loading: fetch 1-hop immediately, 2+ hops on demand

### 10. Phased Implementation Strategy

**What:** Incremental rollout aligned with existing roadmap phases
**Where:** Phases 0b, 4, 8, and 12
**Why:** Reduces implementation risk and aligns with graph infrastructure availability
**How:**

**Phase 0b (Foundation) — Vocabulary Extraction:**
- Extend deliverable 0b.9 (search suggestions) to persist full vocabulary
- Add `word_nodes` table alongside entity registry
- Extract word co-occurrences during chunk enrichment
- Store but don't expose word graph data yet

**Phase 4 (Operate) — Neptune Integration:**
- Migrate word nodes to Neptune Analytics alongside Knowledge Graph
- Build word-to-word edges from co-occurrence data
- Add word graph traversal to search pipeline (Path C extension)
- Internal-only UI for testing word traversal

**Phase 8 (Distribute) — Public Word Graph API:**
- Release `/api/v1/words/` endpoints
- Add word graph expansion to search quality evaluation
- MCP server extension for word-based corpus queries

**Phase 12 (Multimedia) — Visual Word Graph:**
- Interactive D3 visualization at `/explore/words`
- Word cloud and graph navigation UI
- Cross-media word usage (words in video transcripts, audio, etc.)

### 11. ADR Addition for Word Graph

**What:** New ADR-124 documenting word graph design decisions
**Where:** DECISIONS.md, Search & AI section
**Why:** Significant architectural addition needs governance
**How:**
```markdown
## ADR-124: Word-Level Graph Architecture

The portal implements a word-level graph alongside the concept-level knowledge graph,
enabling linguistic exploration of Yogananda's vocabulary.

**Decision:** Implement word graph as Neptune Analytics subgraph with PostgreSQL
materialized views for high-frequency queries. Phased rollout: vocabulary extraction
(Phase 0b), Neptune integration (Phase 4), public API (Phase 8), visualization (Phase 12).

**Rationale:**
- Seekers often remember specific words, not concepts
- Yogananda's unique vocabulary usage reveals teaching patterns
- Cross-language word mapping supports multilingual from foundation (ADR-075)
- Statistical co-occurrence reveals implicit conceptual relationships
- Builds on existing vocabulary extraction for search suggestions (ADR-049)

**Constraints:**
- Only tracks spiritually significant words (frequency + PMI thresholds)
- No interpretation beyond statistical co-occurrence
- Honors ADR-001: explores actual words used, never generates
- Performance optimization via materialized views for common queries
- DELTA-compliant: no behavioral tracking, only corpus analysis

**Consequences:**
- word_nodes table added to schema (Phase 0b)
- Word occurrence extraction during enrichment pipeline (ADR-115)
- Neptune Analytics hosts word graph starting Phase 4
- New API surface: /api/v1/words/* endpoints
- Additional graph algorithms: PMI calculation, significance scoring
```

## Open Questions

### Technical
- Optimal co-occurrence window size for spiritual texts (5, 10, or sentence-level?)
- Should function words (the, and, of) be included with very low weight or excluded entirely?
- Performance impact of word-level graph on Neptune Analytics (millions of edges)?
- Should word embeddings use same model (Voyage) or specialized word2vec?

### Editorial
- Threshold for "spiritual significance" — manual curation or statistical detection?
- Should modern spellings be normalized to Yogananda's era spelling?
- How to handle words Yogananda coined or used uniquely?

### User Experience
- Default traversal depth for UI (2 hops? 3 hops?)
- Should word graph be available in Phase 4 or wait for Phase 8?
- Mobile-appropriate visualization for word graphs?

## What's Not Being Asked

### Linguistic Assumptions
The proposal assumes English-centric linguistic analysis initially. But Yogananda's works include Sanskrit, Bengali, and Hindi terms that don't follow English grammatical patterns. Should the word graph use language-specific NLP models from the start?

### Semantic Drift
Words like "wonderful" had different connotations in the 1940s than today. Should the word graph include temporal metadata to show how Yogananda's vocabulary evolved across his writing period (1920s-1950s)?

### Sacred Word Treatment
Some words in spiritual texts carry initiatory or sacred significance. Should certain Sanskrit terms be marked as "approach with reverence" in the UI, similar to how ADR-104 treats Kriya Yoga?

### Graph Complexity Management
With millions of word occurrences, the full graph may be too dense for useful visualization. Should we pre-compute "significance subgraphs" for common exploration patterns?

### Pedagogical Ordering
The word graph could reveal the order in which Yogananda introduces vocabulary to readers. Should we track "first occurrence" and build pedagogical pathways ("learn these words before those")?

### Statistical vs. Spiritual Significance
PMI and frequency metrics capture statistical relationships, but spiritual significance might be orthogonal. A word used once in a pivotal passage might matter more than a word used hundreds of times casually. Should we incorporate passage importance (via PageRank from ADR-117) into word significance scoring?

### Vocabulary as Initiation
Traditional spiritual texts often use progressive vocabulary disclosure as a form of initiation — simpler words for beginners, technical terms for advanced practitioners. Should the word graph respect this pedagogical hierarchy or make all vocabulary equally accessible?

### Distinction from Full-Text Search
The word graph is not just "search for a word" — that already exists via full-text search. The word graph reveals *relationships between words* that full-text search cannot:
- Co-occurrence patterns (what words appear together)
- Substitution patterns (what words Yogananda uses interchangeably)
- Contextual neighborhoods (words that share semantic contexts)
- Evolution patterns (how vocabulary changes across books/time)

Full-text search answers "where is this word?" The word graph answers "how does this word connect to everything else?"

### Computational Linguistics vs. Spiritual Interpretation
The word graph uses statistical methods (PMI, co-occurrence, embeddings) to find patterns. But in spiritual texts, statistical significance may not equal spiritual significance. Should the portal explicitly mark this distinction — "These connections are statistical, not theological"?