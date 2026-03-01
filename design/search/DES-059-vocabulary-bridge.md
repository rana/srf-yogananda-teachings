## DES-059: Vocabulary Bridge

**Governing ADR:** ADR-129 (Vocabulary Bridge — Semantic Infrastructure for State-Aware Retrieval)

The Vocabulary Bridge is the semantic infrastructure that maps human states of being to Yogananda's corpus. It is not a synonym dictionary — it is a structured understanding of the distance between human suffering and the tradition's language for transformation.

### The Five Layers

**Layer 1: State Mappings** — The atomic unit. A human state of being, with its register and likely context, mapped to corpus territory.

```typescript
interface StateMapping {
  expression: string           // "I can't stop crying"
  register: Register           // 'fragmentary' | 'distress' | 'inquiry' | 'practice' | 'wonder'
  language: string             // 'en' | 'hi' | 'es' ...

  corpus_territory: {
    primary: string[]          // ["grief", "loss", "divine_love"]
    secondary: string[]        // ["the_soul", "immortality", "suffering"]
    avoid: string[]            // passages about discipline, will — wrong register for this state
  }

  yogananda_vocabulary: string[]  // terms Yogananda actually uses

  retrieval_intent: RetrievalIntent
  // 'meet_first'     — passage should acknowledge the state before pointing elsewhere
  // 'console'        — passage should offer comfort, not instruction
  // 'orient'         — passage should help the seeker understand their situation
  // 'invite'         — passage should open a door without pushing through it

  seed_passages: string[]     // chunk_ids of highest-quality passages for this state
                              // Opus-selected, traceable to source

  crisis_adjacent: boolean    // triggers safety interstitial if true

  editorial_notes: string     // derivation rationale
}
```

**Layer 2: Vocabulary Expansions** — Modern or secular terms and their relationship to Yogananda's actual vocabulary. Replaces the original flat `spiritual-terms.json` design.

```typescript
interface VocabularyExpansion {
  modern_term: string            // "anxiety"
  yogananda_terms: string[]      // ["fear", "restlessness of mind", "mental agitation",
                                 //  "worry", "lack of trust in God"]
  excluded_terms: string[]       // terms that seem related but Yogananda doesn't use this way

  semantic_note: string          // "Yogananda treats anxiety as a symptom of fear
                                 //  and disconnection from the divine"

  query_expansion: string[]      // terms to add to BM25 query when this term appears
  index_enrichment: string[]     // terms to add to chunk index when these concepts are present
  sources: string[]              // books that contribute this mapping (from per-book lifecycle)
}
```

**Layer 3: Register Bridges** — The same concept at different emotional registers requires different passages.

```typescript
interface RegisterBridge {
  concept: string               // "death"

  registers: {
    [register: string]: {
      context: string           // "asking philosophically"
      corpus_region: string[]   // themes, passages, books most relevant
      retrieval_intent: RetrievalIntent
      exemplar_query: string    // "what happens when we die"
    }
  }

  // death asked philosophically → cosmic consciousness, the soul's journey
  // death asked in grief → divine love, immortality, reunion
  // death asked in crisis → soul's indestructibility + crisis resources
  // death asked with wonder → astral worlds, higher planes, Yogananda's accounts
}
```

**Layer 4: Cross-Tradition Vocabulary** — Seekers from other traditions mapped to Yogananda's frame without erasing the difference.

```typescript
interface TraditionBridge {
  tradition: string             // "Christian" | "Buddhist" | "secular_therapeutic" |
                                // "Islamic_Sufi" | "Hindu_Vedantic" | "agnostic"

  their_term: string            // "God's grace"
  yogananda_frame: string[]     // "divine grace", "cosmic grace", "God's love"

  resonant_books: string[]      // books where Yogananda explicitly engages this tradition

  bridge_note: string           // how to present the connection honestly
}
```

**Layer 5: Language-Specific State Mappings** — Not translated English mappings. Authored fresh for each language and culture by Opus reading the corpus in that language's official translation.

```typescript
interface LanguageStateMapping extends StateMapping {
  cultural_context: string      // "In Indian context, this expression often follows
                                //  family rupture or public shame"

  platform_context: string      // "Common entry expression on WhatsApp shares in this locale"
}
```

### Schema

```sql
CREATE TABLE vocabulary_bridge (
  id                   UUID PRIMARY KEY DEFAULT uuidv7(),
  layer                TEXT NOT NULL CHECK (layer IN (
                         'state_mapping', 'vocabulary_expansion',
                         'register_bridge', 'tradition_bridge'
                       )),
  language             TEXT NOT NULL DEFAULT 'en',

  -- The human expression
  expression           TEXT NOT NULL,
  register             TEXT,

  -- The corpus territory
  primary_territory    TEXT[],   -- theme slugs
  secondary_territory  TEXT[],
  avoid_territory      TEXT[],

  -- Retrieval guidance
  retrieval_intent     TEXT CHECK (retrieval_intent IN (
                         'meet_first', 'console', 'orient', 'invite'
                       )),
  yogananda_vocabulary TEXT[],
  query_expansion      TEXT[],   -- added to BM25 query at query-time
  index_enrichment     TEXT[],   -- added to chunk index at index-time

  -- Manually/Opus-selected anchors
  seed_passage_ids     UUID[],   -- chunk_ids, Opus-selected with source citations

  -- Safety
  crisis_adjacent      BOOLEAN DEFAULT false,

  -- Generation provenance
  source_passages      UUID[],   -- chunks this entry was derived from
  confidence           REAL,     -- Opus confidence score (0-1)
  derivation_note      TEXT,     -- "found 23 passages using 'fear' and 'divine protection' in proximity"

  -- Provenance
  generated_by         TEXT NOT NULL DEFAULT 'opus',
  reviewed_by          TEXT,
  status               TEXT DEFAULT 'active'
                       CHECK (status IN ('draft', 'active', 'reviewed', 'archived')),

  -- Metadata
  editorial_notes      TEXT,
  cultural_context     TEXT,
  tradition            TEXT,     -- for Layer 4 entries
  last_evaluated       DATE,
  zero_result_trigger  BOOLEAN DEFAULT false,  -- was this added because of zero-result analysis?

  created_at           TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now()
);

-- Seed passages — Opus-curated anchors per state
CREATE TABLE bridge_seed_passages (
  id              UUID PRIMARY KEY DEFAULT uuidv7(),
  bridge_id       UUID NOT NULL REFERENCES vocabulary_bridge(id),
  chunk_id        UUID NOT NULL REFERENCES book_chunks(id),
  selection_note  TEXT,     -- why this passage was chosen (traceable to source)
  position        INTEGER,  -- ordering within the state's seed set
  selected_by     TEXT NOT NULL DEFAULT 'opus',
  selected_at     TIMESTAMPTZ DEFAULT now()
);

-- Zero-result feedback loop — the bridge's growth signal
CREATE TABLE bridge_gaps (
  id              UUID PRIMARY KEY DEFAULT uuidv7(),
  query           TEXT NOT NULL,
  language        TEXT NOT NULL,
  result_count    INTEGER NOT NULL,
  query_date      DATE NOT NULL,
  reviewed        BOOLEAN DEFAULT false,
  resulted_in_bridge_id UUID REFERENCES vocabulary_bridge(id),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_bridge_layer_language ON vocabulary_bridge(layer, language);
CREATE INDEX idx_bridge_expression ON vocabulary_bridge(expression);
CREATE INDEX idx_bridge_crisis ON vocabulary_bridge(crisis_adjacent) WHERE crisis_adjacent = true;
CREATE INDEX idx_bridge_gaps_unreviewed ON bridge_gaps(reviewed, query_date) WHERE reviewed = false;
```

### Query-Time Flow

```
Seeker query: "I feel empty inside"

1. Language detection: 'en'
2. Bridge lookup (in-memory, microseconds):
   - Direct match: "empty" → state_mapping (register: distress)
   - Vocabulary expansion: "empty" → ["void", "spiritual emptiness",
                                       "restlessness of the soul"]
3. Query expansion:
   Before: "I feel empty inside"
   After (BM25): "I feel empty inside OR void OR restless soul OR longing for God"
4. Retrieval intent: 'meet_first' + 'console'
5. Retrieval filters:
   - primary_territory: ["the_soul", "divine_love", "longing_for_God"]
   - avoid_territory: ["discipline", "will", "technique"] -- wrong register
6. Ranking modifier: seed passages for this state get +0.2 to final score
7. Result: passages that acknowledge the ache before pointing toward fullness
```

*Parameter: seed passage boost factor (+0.2) is a tunable default per ADR-123.*

### Index-Time Enrichment Integration

The Bridge feeds the unified enrichment pipeline (ADR-115). When a chunk is enriched at ingestion:

1. Opus reads the chunk and generates enrichment fields (existing ADR-115 flow)
2. Additionally: Opus maps the chunk to bridge territories — which human states does this passage address? What retrieval intent would be appropriate?
3. The enrichment output includes: `bridge_territories[]`, `emotional_register`, `retrieval_intent_hints[]`
4. These fields are written to the chunk's index entry, enabling the hybrid search layer to use bridge-derived signals without a runtime bridge lookup for basic territory matching

### Opus Generation Pipeline

```
Per book ingestion:
1. Opus reads all extracted chapters
2. Layer 2 generation: extracts Yogananda's distinctive vocabulary
   (three extraction categories: modern-to-Yogananda, Sanskrit inline, cross-tradition)
3. Layer 1 generation: maps human states to passages
   - Generates from human experience inward, not tradition outward
   - "What do people actually feel? Which of those does this book address?"
4. Layer 3 generation: identifies concepts that carry different meaning
   at different emotional registers
5. Every entry includes: source_passages[], confidence, derivation_note
6. Entries are INSERT'd to vocabulary_bridge table
7. Crisis-adjacent entries flagged for human review

Per language activation (Milestone 1b for Spanish):
1. Opus reads the official translation
2. Layer 5 generation: fresh state mappings for the language/culture
   - NOT translations of English mappings
   - "What does a Spanish-speaking person in distress actually type?"
3. Layer 2 generation: vocabulary expansions from the translation's actual terms
```

### The Bridge Is Never Finished

Three growth sources:
1. **Zero-result analysis.** Every query returning zero or one results is logged to `bridge_gaps`. Periodic review identifies patterns — what are seekers searching for that the bridge doesn't cover?
2. **Per-book ingestion.** Each new book generates new vocabulary expansions and state mappings. *The Second Coming of Christ* adds Christian vocabulary; *Scientific Healing Affirmations* adds a different register entirely.
3. **Search quality evaluation.** DES-058's Dark Night query category tests whether the bridge is meeting seekers in distress. Failures generate bridge improvement candidates.

### What the Bridge Is Not

The bridge does not generate passages. It does not interpret Yogananda. It does not tell the retrieval system what a passage means — it tells the retrieval system where to look when a human expresses something the corpus addresses in different words. An imperfect bridge mapping produces suboptimal search results, not fabricated teachings. This distinction matters for a portal committed to no AI-generated content reaching seekers (Principle 1).

### Phasing

| Layer | Milestone | Notes |
|-------|-----------|-------|
| Layer 1 (State Mappings) | 1a | English only. Opus-generated from Autobiography corpus. |
| Layer 2 (Vocabulary Expansions) | 1a | Subsumes `spiritual-terms.json`. Opus-generated per book. |
| Layer 5 (Spanish States) | 1b | Fresh Opus generation from Spanish Autobiography. |
| Layer 3 (Register Bridges) | 1c | Enables meaningful Four Doors entry. |
| Layer 4 (Tradition Bridges) | 3b+ | Needs multi-book corpus for tradition coverage. |

*Section added: 2026-03-01. Governs ADR-129.*
