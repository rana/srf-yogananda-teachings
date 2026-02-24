---
name: theme-integrate
description: Integrate a new content theme into the portal's taxonomy, terminology bridge, enrichment pipeline, knowledge graph, and worldview pathways. Produces all integration artifacts from a theme proposal or free-text description. Use when adding thematic entry points for seekers.
argument-hint: "<theme-proposal.md or free-text theme description>"
---

Read CONTEXT.md and the following DESIGN.md sections to ground in current theme infrastructure:
- DES-004 § Data Model (teaching_topics, entity_registry tables)
- ADR-031, ADR-032, ADR-033 in DECISIONS.md (theme taxonomy, multi-category, exploration categories)
- ADR-051 in DECISIONS.md (Terminology Bridge)
- ADR-115 in DECISIONS.md (Unified Enrichment Pipeline)
- ADR-122 in DECISIONS.md (Crisis Query Detection)
- DES-048 in DESIGN.md (Worldview Pathways)
- DES-054 in DESIGN.md (Knowledge Graph Ontology)

Also read `/lib/data/spiritual-terms.json` if it exists yet (may not in pre-code phase).

## Theme Integration

**Input:** Either a proposal file from `.elmer/proposals/` or a free-text theme description in `$ARGUMENTS`. If a file, read it fully. If free-text, use it as the theme definition.

### Step 1: Theme Analysis

Identify from the input:
- **Theme name(s):** What the seeker-facing label should be
- **Theme category:** Which ADR-033 category (principle, practice, quality, situation, scripture, person)
- **Target seekers:** Who arrives at this theme and from what state of mind
- **Yogananda vocabulary:** Terms Yogananda used for this topic
- **Modern vocabulary:** Terms seekers might use that don't appear in the corpus
- **Crisis adjacency:** Whether this theme touches grief, death, despair, or self-harm (triggers ADR-122 integration)
- **Phase relevance:** Which books contain the richest material for this theme

### Step 2: Check Existing Taxonomy

Before generating new artifacts, check for overlap with existing themes:
- Read the full list of teaching_topics from ADR-031/032
- Check entity_registry categories from ADR-033
- Check worldview pathways from DES-048

Report overlaps:
- **Subsumes:** New theme fully covered by existing theme → recommend against adding
- **Overlaps:** Partial coverage → recommend cross-linking
- **Adjacent:** Related but distinct → proceed with cross-reference edges
- **Novel:** No existing coverage → proceed fully

### Step 3: Generate Integration Artifacts

Produce these artifacts, each as a reviewable block:

**Artifact 1: Teaching Topics SQL**
Following ADR-032 multi-category taxonomy pattern:
```sql
INSERT INTO teaching_topics (slug, name, category, description, sort_order) VALUES
  ('[slug]', '[Display Name]', '[category]', '[Description for embedding similarity]', [N]);
```
- Generate embeddings description text optimized for semantic similarity matching
- Assign sort_order relative to existing themes

**Artifact 2: Terminology Bridge Entries**
Following ADR-051 pattern. Map modern/colloquial terms to Yogananda's vocabulary:
```json
{
  "[modern_term]": {
    "yogananda_terms": ["[term1]", "[term2]"],
    "sources": ["[book-slug]"],
    "category": "[theme-slug]"
  }
}
```
- Minimum 5 mappings per theme
- Include informal/colloquial terms seekers actually search for
- Each mapping must cite at least one source book

**Artifact 3: Enrichment Schema Extension**
Following ADR-115 unified enrichment pattern. New fields for the enrichment prompt:
```typescript
// Addition to ChunkEnrichment interface
[field_name]: string[] | boolean | number; // [description]
```
- Only add fields that are genuinely distinct from existing enrichment dimensions
- Each field must have clear extraction criteria for the enrichment prompt

**Artifact 4: Crisis Detection Patterns** (only if theme is crisis-adjacent)
Following ADR-122 pattern. New query patterns that should trigger safety interstitial:
```
Patterns: ["pattern1", "pattern2", ...]
```
- Be specific — avoid patterns that would false-positive on normal spiritual inquiry
- Err on the side of sensitivity for genuine distress signals

**Artifact 5: Knowledge Graph Edges**
Following DES-054 ontology. New concept nodes and relationships:
```
(:[NodeType] {name: "[concept]"}) -[:[EDGE_TYPE]]-> (:[NodeType] {name: "[concept]"})
```
- Use existing edge types from DES-054 where possible
- Only propose new edge types if existing ones don't capture the relationship
- Connect to existing graph nodes, don't create isolated subgraphs

**Artifact 6: Worldview Pathway**
Following DES-048 pattern. A new pathway entry for `/guide`:
```
Pathway: [Name]
Entry text: [2-3 sentences meeting the seeker in their current framework]
Suggested passages: [3-5 starting points from the corpus]
Progression: [How the pathway deepens]
```

**Artifact 7: Calendar/Seasonal Associations** (if applicable)
Following DES-028 calendar-aware surfacing. When this theme has natural seasonal or calendar resonance:
```
Associations: [season/date → theme connection rationale]
```

### Step 4: Present All Artifacts

Present each artifact as a numbered, reviewable block. The user can:
- Approve all
- Approve selectively (by number)
- Edit specific artifacts before approval
- Preview how any artifact integrates with existing content

### Step 5: Execute

On approval, write changes to the appropriate locations:

1. **DECISIONS.md** — Amend ADR-032 taxonomy list, ADR-051 bridge entries, ADR-115 enrichment fields, ADR-122 patterns (if applicable)
2. **DESIGN.md** — Amend DES-048 worldview pathways, DES-054 graph edges, DES-028 calendar associations (if applicable)
3. **ROADMAP.md** — Add theme to the appropriate phase deliverables (usually Phase 1 for taxonomy, Phase 4 for graph edges)
4. **CONTEXT.md** — Add any unresolved editorial/stakeholder questions from the theme proposal as open questions

Add revision notes to each amended section: `*Theme added: [theme-name], [date]*`

### Step 6: Report

After execution, report:
- Artifacts written (count and location)
- Cross-references wired
- Open questions added to CONTEXT.md
- Deferred items (artifacts that depend on future phases)

---

## Quality Standards

- **Seeker-first naming.** Theme names should use the language seekers use, not the language architects use. "Finding Your Worth" not "Self-Worth Identity Taxonomy Node."
- **Yogananda's vocabulary is authoritative.** Modern terms are bridges *to* his words, not replacements.
- **Crisis sensitivity is non-negotiable.** If the theme touches suffering, death, or despair in any way, Artifact 4 is mandatory even if the proposal didn't address it.
- **Minimal graph additions.** Don't create concept nodes for things that are better served by the terminology bridge. Graph nodes are for structural relationships; vocabulary mappings are for search expansion.
- **Match existing density.** Read adjacent theme entries in each target. Match their level of detail. Don't over-specify a theme that sits next to three-line entries.

## Output Management

Present all artifacts before writing. Segment into groups of up to 7 artifacts per theme.

If the theme naturally decomposes into sub-themes (e.g., "self-worth" + "abundance" + "scientific view"), ask the user whether to integrate as one compound theme or as separate themes with cross-links.

After each approved group of artifacts is written, proceed immediately to present the next group. Continue until all artifacts for the theme are processed. State the total count when complete.
