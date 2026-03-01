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
