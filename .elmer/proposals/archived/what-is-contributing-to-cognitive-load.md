<!-- elmer:archive
  id: what-is-contributing-to-cognitive-load
  topic: What is contributing to cognitive load?
  archetype: explore-act
  model: opus
  status: approved
  archived: 2026-02-24 06:38 UTC
-->

# Cognitive Load Analysis — SRF Online Teachings Portal

## Summary

The project's cognitive load stems from three primary sources: excessive identifier proliferation (179+ ADRs/DES identifiers creating a complex mental map), parallel maintenance of design ambitions across five documents (requiring continuous reconciliation), and temporal uncertainty where 112+ pre-implementation decisions lack empirical grounding. The load manifests as navigation friction, decision paralysis about which document owns what information, and accumulating contradictions between idealized design and implementation reality.

## Analysis

### 1. Identifier System Overload

The project uses 179 identifiers (123 ADRs + 56 DES sections) as the primary navigation mechanism. Each requires:
- Mental mapping of number to concept (ADR-117 = Neptune Analytics)
- Domain categorization (11 ADR groups, unstructured DES)
- Cross-reference tracking (ADR-046 updated by ADR-118)
- Temporal awareness (which ADRs are amended/superseded)

Evidence from CLAUDE.md:
- "123 Architecture Decision Records (ADR-001 through ADR-123)"
- "56 sections in DESIGN.md (DES-001 through DES-056)"
- Cross-references require triple-digit zero-padding everywhere

The identifier system forces working memory to maintain a lookup table rather than a conceptual model. Finding "how does search work?" requires knowing ADR-044, ADR-114, ADR-118, ADR-119, DES-003, and their relationships.

### 2. Document Boundary Ambiguity

Five documents with overlapping concerns and unclear ownership boundaries:
- CONTEXT.md: "background, mission, stakeholders, constraints, current state, open questions"
- DESIGN.md: "architecture + 56 design sections"
- DECISIONS.md: "123 ADRs with full rationale"
- ROADMAP.md: "15 phases with deliverables"
- CLAUDE.md: "meta-documentation about documentation"

The same information appears in multiple places:
- Search architecture in ADR-044, ADR-114, ADR-118, ADR-119, AND DES-003
- Multilingual strategy in ADR-075, ADR-076, ADR-077, ADR-078, AND DES-017
- Phase 0 details in ADR-113, ADR-041, ROADMAP Phase 0a/0b, AND CONTEXT "Current State"

This creates update cascade problems — changing search approach requires edits to DECISIONS.md, DESIGN.md, potentially ROADMAP.md deliverables, and CONTEXT.md current state.

### 3. Pre-Implementation Over-Design

112 ADRs made before writing code (ADR-001 through ADR-112 existed before Phase 0a). These decisions lack empirical feedback:
- Chunking strategy (ADR-048) guesses at 100-500 token ranges
- RRF k-constant (default 60) is a "best pre-production guess"
- Neptune Analytics (ADR-117) chosen for Phase 4+ without testing if pgvector alone suffices

ADR-123 acknowledges this ("specific numeric values...are tunable defaults, not architectural commitments") but the cognitive load of tracking what's principle vs parameter across 123 decisions remains.

### 4. Phase Dependency Web

15 phases with complex interdependencies:
- Phase 0 split into 0a (Prove) and 0b (Foundation) creates ordering complexity
- Phase 4 (Operate) blocked on SRF staffing decisions
- Phase 9 (Contentful) triggers rework of all prior ingestion
- Parallel workstreams allowed but "feature activation" vs "infrastructure build" distinction unclear

The roadmap tries to be both sequential and parallel, creating cognitive overhead in understanding what can actually proceed when.

### 5. Open Questions Proliferation

71+ open questions across 4 tiers:
- Tier 1: Blocks Phase 0a (6 questions)
- Tier 2: Resolve During Phase 0 (11 questions)
- Tier 3: Resolve During Phases 0b-2 (18 questions)
- Tier 4: Requires SRF Input Before Phase 4 (36+ questions)

Questions range from fundamental ("Which edition of Autobiography?") to speculative ("Virtual pilgrimage tour URLs?"). The sheer volume creates analysis paralysis about what needs immediate resolution.

### 6. Maintenance Burden Documentation

CLAUDE.md's "Document Maintenance" table lists 11 scenarios requiring document updates:
- "New decision made" → update DECISIONS.md and domain index
- "Phase deliverable changed" → update ROADMAP.md
- "New technology adopted" → update DESIGN.md tech stack

Every change cascades through multiple documents. The maintenance instructions themselves add cognitive load — you must remember to check the maintenance table whenever making changes.

### 7. Language Precision Overhead

The documentation enforces extreme precision:
- "Always zero-pad to three digits" (ADR-017 not ADR-17)
- "use the prefix form: `ADR-017`, `DES-003`"
- Specific header formats for each identifier type
- Distinction between "Status: Implemented" vs architectural reference

This precision is valuable but creates continuous mental overhead during both reading and writing.

## Proposed Changes

### 1. Create a Unified Index File
**What:** Single `INDEX.md` with semantic navigation replacing identifier memorization
**Where:** Root directory, linked from README
**Why:** Reduces lookup overhead from 179 identifiers to ~20 semantic categories
**How:**
```markdown
# Portal Index

## Search & Retrieval
- Architecture: [DES-003](DESIGN.md#des-003)
- Embedding Model: [ADR-118](DECISIONS.md#adr-118)
- Full-text Search: [ADR-114](DECISIONS.md#adr-114)
- Pipeline Evolution: [ADR-119](DECISIONS.md#adr-119)

## Implementation Status
- Phase 0a (Prove): [Current](ROADMAP.md#phase-0a)
- Open Blockers: [6 issues](CONTEXT.md#tier-1)
```

### 2. Consolidate Overlapping Sections
**What:** Merge related ADRs and DES sections that describe the same system
**Where:** DECISIONS.md and DESIGN.md
**Why:** Reduces cross-reference overhead and update cascades
**How:**
- Combine ADR-044, 114, 118, 119 into "ADR-044: Search Architecture Evolution"
- Move implementation details from ADRs to DESIGN.md
- Keep only architectural rationale in DECISIONS.md

### 3. Defer Speculative Decisions
**What:** Move Phase 4+ decisions to a `FUTURE.md` parking lot
**Where:** New `docs/future/` directory
**Why:** Reduces mental model size by ~40% for Phase 0-3 implementers
**How:**
- Extract ADRs 54-87 (Cross-Media, most Internationalization)
- Park Phase 4+ architectural speculation
- Reference but don't inline future decisions

### 4. Simplify Phase Structure
**What:** Flatten phases into three horizons: Now (0-1), Next (2-4), Future (5+)
**Where:** ROADMAP.md restructure
**Why:** Reduces dependency tracking overhead
**How:**
- "Now": What we're actively building
- "Next": What we'll build with current team/resources
- "Future": What requires organizational decisions

### 5. Create Decision Log Pattern
**What:** Replace ADR updates with append-only decision log
**Where:** New `DECISIONS_LOG.md`
**Why:** Eliminates the "which ADR do I update?" question
**How:**
```markdown
## 2024-03-15: Search Implementation
- Changed: RRF k-constant 60 → 40
- Evidence: Phase 0a testing showed better recall
- Amends: ADR-119 parameter
```

### 6. Reduce Open Questions
**What:** Archive questions not needed for current phase
**Where:** Move Tier 3-4 to `docs/future-questions.md`
**Why:** 71 questions create analysis paralysis; Phase 0 needs only 6
**How:**
- Keep only Phase 0a blockers visible
- Archive everything else with "revisit at Phase X" labels
- Add questions as phases approach, not speculatively

### 7. Simplify Maintenance Rules
**What:** Single update location per concern
**Where:** Revise CLAUDE.md maintenance table
**Why:** Reduces update cascade complexity
**How:**
- Search changes → DESIGN.md only
- Phase status → CONTEXT.md "Current State" only
- New decisions → append to DECISIONS_LOG.md
- Delete cross-update requirements

## Open Questions

### Discovered During Analysis

1. **Why maintain both ADR and DES identifiers?** They serve similar purposes but create double the cognitive overhead. Could DES sections simply use descriptive headers?

2. **Is Claude the primary maintainer?** The documentation assumes "AI context windows" as the reader, but creates human-hostile navigation patterns. Who is the actual audience?

3. **What's the empirical feedback loop?** With 112 decisions before code, how do we know which assumptions are wrong? Where's the mechanism for learning?

4. **Why specify Sanskrit normalization before having Sanskrit content?** ADR-116 defines canonical entity registry, but Phase 0 has only English Autobiography text.

5. **Should parameter tuning be centralized?** ADR-123 acknowledges parameters need tuning, but they're scattered across 50+ sections. Why not a single `parameters.ts` with all defaults?

## What's Not Being Asked

### The Documentation-First Trap

The project has spent months creating 300+ pages of documentation before writing code. This creates several unexamined risks:

1. **Commitment bias** — Having written ADR-117 (Neptune Analytics), there's psychological resistance to discovering pgvector alone suffices.

2. **Documentation maintenance becomes the work** — More effort goes into keeping documents consistent than building features.

3. **Specification illusion** — The detail level (SHA-256 hashing, RRF k-constants) creates false confidence that implementation is just typing.

### Anthropic Design Artifacts

The documentation style strongly reflects AI assistance patterns:
- Extreme enumeration (123 ADRs, 56 DES sections)
- Dense cross-referencing with precise identifiers
- Parallel maintenance of overlapping content
- "Living document" philosophy requiring constant updates

This isn't necessarily bad, but it's unexamined. The documentation architecture itself could be an ADR: "Why five documents? Why 123 decisions? Why zero-padded identifiers?"

### The Missing Layer

Between high-level mission ("make teachings available freely") and low-level implementation (RRF k=60), there's no middle layer of stable architectural principles. Everything is either philosophical or parametric, with no pragmatic core that remains stable across phases.

Consider creating 5-7 architectural principles that are neither theological nor numeric:
- "Search returns verbatim quotes only"
- "Every feature works without JavaScript"
- "Content lives in PostgreSQL"
- "No user tracking"

These would reduce cognitive load more than 123 specific decisions.

### Phase 0 Reality Check

The current Phase 0a has 8 deliverables. The 0a.8 "Search quality evaluation" depends on all prior steps working. But there's no earlier validation milestone. Consider adding 0a.4.5: "Manual verification: one query returns one valid passage" before building the full pipeline.

### Documentation Audience Paradox

CLAUDE.md says "documentation volume is intentional — it serves as institutional memory across AI context windows." But AI context windows don't need zero-padded identifiers, maintenance tables, or cross-reference precision. This suggests the documentation serves an imagined audience that doesn't match its actual users (Claude, developers, stakeholders).