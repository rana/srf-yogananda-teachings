## DES-055: Concept/Word Graph

The Concept/Word Graph is a specialized subgraph within the knowledge graph (DES-054) focused on vocabulary relationships — how Yogananda's terminology connects across traditions, Sanskrit sources, and progressive spiritual development. It powers word graph query expansion in the search pipeline (Milestone 3b+, Path C in DES-003) and the Concept Graph UI exploration (Arc 6).

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
Milestone 3b: Canonical Vocabulary Seed
 └── Extract from entity_registry + sanskrit_terms tables
 └── Claude generates initial edges from domain knowledge
 └── Human review validates all edges

Milestone 5a: Cross-Tradition Extraction
 └── Mine Yogananda's explicit cross-tradition statements from corpus
 └── "The Hindu scriptures teach that [...] is what Christ called [...]"
 └── Constrained to Yogananda's own explicit mappings only

Milestone 5a: Progression Chains
 └── Extract sequential development paths from teaching passages
 └── Validate against SRF pedagogical tradition

Milestone 5a: Co-occurrence Edges
 └── Statistical co-occurrence from chunk enrichment data
 └── Filtered: minimum 3 co-occurrences, mutual information > threshold
```

### Word Graph Query Expansion (Milestone 3b+)

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

**Governed by:** ADR-117 (Postgres-Native Graph Intelligence), ADR-116 (Entity Registry), ADR-001 (Librarian, Not Oracle)

---
