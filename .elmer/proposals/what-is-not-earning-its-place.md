<!-- elmer:archive
  id: what-is-not-earning-its-place
  topic: What is not earning it's place?
  archetype: explore-act
  model: opus
  status: approved
  archived: 2026-02-24 06:38 UTC
-->

# What's Not Earning Its Place — Analysis and Proposals

## Summary

This project suffers from overspecification without implementation. 123 ADRs, 56 design sections, 15 phases, and extensive document maintenance procedures have created a documentation burden exceeding many shipped products. The cognitive overhead of navigating this system may inhibit rather than enable development. Key elements not earning their place: premature optimization (Neptune graph database, Redis caching), over-architected subsystems (three-tier MCP corpus server), excessive identifier formalism (zero-padded ADR-NNN/DES-NNN), and speculative features without validated need (community curation, VLD delegation). The proposal focuses on radical simplification while preserving spiritual integrity.

## Analysis

### Documentation Weight vs. Value

**123 Architecture Decision Records** — Many ADRs address problems that don't exist yet:
- ADR-102/103: Analyzing and restructuring 18 phases before any code exists
- ADR-117: Neptune Analytics graph database for ~50K chunks (PostgreSQL handles this fine)
- ADR-120: Redis suggestion caching when pg_trgm delivers < 50ms locally
- ADR-087: Volunteer curation delegation for a portal with no content yet
- ADR-086: Community collections architecture with tiered visibility before basic search works

**56 Design Sections** — Speculative detail for unvalidated features:
- DES-011: Time-aware circadian color temperature (requires browser timezone → coordinates)
- DES-012: "Breath Between Chapters" transition pacing
- DES-014: Session closure moments with departure grace
- DES-029: The Quiet Index — browsable contemplative taxonomy
- DES-055: Concept/Word Graph separate from Knowledge Graph

**15-Phase Roadmap** — Phases 5–14 specify 10 years of features before Phase 0 proves search works:
- Phase 13: Optional authentication (year 3+) specified before basic search
- Phase 14: Community curation at scale before any community exists
- Phase 11: PWA and TTS polish before core reading experience

### Architectural Over-Engineering

**Three-Tier MCP Corpus Server (ADR-101)** — Development, internal editorial, and external distribution tiers for what should be a simple search interface. The complexity:
- Separate permission models per tier
- Token-based access control
- Distribution tracking
- All before a single book is searchable

**Multi-System Architecture** — Neon + Neptune + Redis + Contentful + ElastiCache:
- Neptune Analytics (Phase 4+) for graph operations PostgreSQL can handle
- Redis/ElastiCache for suggestions when PostgreSQL delivers sub-50ms
- Contentful CMS migration in Phase 9 requiring re-ingestion of all content

**Identifier Ceremony** — Zero-padded ADR-NNN and DES-NNN identifiers with strict formatting:
- Must reference as "ADR-001" not "ADR-1"
- DES identifiers numbered by document order
- Complex governance about when to use ADR vs DES headers
- More ceremony than many ISO standards

### Process Theater

**Document Maintenance Matrix** — 14 different "when X happens, update Y" rules:
- "When parameter tuned, annotate DESIGN.md section"
- "At phase boundaries, reconcile all documents"
- "Add *Section revised: [date]* at section's end"
- Git already tracks all changes

**Elmer Proposal Management** — Three custom skills for managing proposals:
- `/dedup-proposals` to find duplicates
- `/proposal-merge` to decompose into edits
- `/theme-integrate` for content themes
- 15 proposals already accumulated before any code exists

**Phase Gates and Success Criteria** — Elaborate go/no-go criteria between phases when there's no team, no velocity data, and no stakeholder timeline.

### Features Without Users

**Study Workspace (Phase 7)** — Notebooks, highlighting, citation manager:
- No evidence seekers want to study within the portal
- Competing with established tools (Obsidian, Notion, paper)
- Adds authentication complexity

**Community Features (Phase 14)** — Study circles, community collections:
- Assumes community formation that may never happen
- Requires moderation infrastructure
- Privacy and safety implications

**"What Is Humanity Seeking?" Dashboard** — Aggregate search analytics:
- Interesting to staff, not seekers
- Requires careful DELTA compliance
- Maintenance burden

### Multilingual Premature Abstraction

**Language Architecture from Day One** — Every table has language column:
- No translated content exists
- No timeline for translations
- Adds complexity to every query
- YSS collaboration uncertain

**Cross-Language Alignment** — Paragraph-level alignment infrastructure:
- Assumes translations preserve structure
- No confirmation this is true
- Complex versioning implications

## Proposed Changes

### 1. Collapse ADRs into Principles
- **What:** Replace 123 ADRs with ~12 core principles
- **Where:** New PRINCIPLES.md, archive DECISIONS.md
- **Why:** Reduces cognitive load by 90% while preserving all critical decisions
- **How:** Extract the actual decisions (not rationale), group by theme:
  - Sacred Text Fidelity
  - Global Equity
  - Direct Quotes Only
  - API-First Architecture
  - Accessibility Foundation
  - Calm Technology
  - 10-Year Horizon
  Each principle gets 2-3 paragraphs, not 2-3 pages.

### 2. Merge Design Sections by Concern
- **What:** Collapse 56 DES sections into ~8 design areas
- **Where:** Simplified DESIGN.md
- **Why:** Current numbering (DES-001 through DES-056) adds navigation overhead
- **How:** Group by implementation concern:
  - Search & Retrieval
  - Reading Experience
  - Content Pipeline
  - API Design
  - Frontend Architecture
  - Observability
  - Deployment
  Remove speculative features entirely.

### 3. Start with PostgreSQL Only
- **What:** Remove Neptune, Redis, ElastiCache from Phases 0–6
- **Where:** DESIGN.md § Architecture, ROADMAP.md Phase 4
- **Why:** PostgreSQL handles 50K chunks, sub-50ms suggestions, and basic graph operations
- **How:**
  - Use PostgreSQL recursive CTEs for graph traversal
  - pg_trgm for suggestion indexing
  - Materialized views for aggregates
  - Add external systems only when PostgreSQL demonstrably fails

### 4. Single-Tier MCP Server
- **What:** Replace three-tier corpus MCP with simple search interface
- **Where:** `/lib/mcp/` implementation, ADR-101
- **Why:** Development tooling shouldn't be more complex than the product
- **How:** One MCP server with two functions:
  - search(query, limit)
  - get_chunk(id)
  No tokens, no tiers, no distribution tracking.

### 5. Eliminate Process Documents
- **What:** Remove formal document maintenance procedures
- **Where:** CLAUDE.md § Document Maintenance
- **Why:** Git tracks changes; formal procedures add burden without value
- **How:**
  - Let documents evolve naturally
  - Trust git history
  - Update what needs updating when it needs it
  - Remove "Status: Implemented" annotations

### 6. Focus Phases 0–3 Only
- **What:** Archive Phases 4–14 as "future considerations"
- **Where:** ROADMAP.md
- **Why:** 10-year roadmap before proving core value
- **How:** Document structure:
  - Phase 0a: Prove search works
  - Phase 0b: Deploy and enhance
  - Phase 1: Complete portal
  - Phase 2: Reading refinements
  - Phase 3: Multi-book corpus
  - Future: One-page vision document

### 7. Remove Premature Abstractions
- **What:** Delete infrastructure for non-existent requirements
- **Where:** Throughout codebase
- **Why:** YAGNI (You Aren't Gonna Need It)
- **How:** Remove:
  - Language columns until translations exist
  - Edition versioning until multiple editions exist
  - Community features until community exists
  - Study workspace until users request it
  - Crisis detection until legal review complete

### 8. Simplify Identifier Scheme
- **What:** Use natural identifiers
- **Where:** All documentation
- **Why:** "ADR-001" vs "ADR-1" is pure ceremony
- **How:**
  - Reference decisions by name, not number
  - If numbering needed, use simple integers
  - No zero-padding
  - No strict formatting rules

### 9. Inline Critical Constraints
- **What:** Move the 7 "Critical Design Constraints" to README
- **Where:** README.md at repository root
- **Why:** These are the only rules that affect every coding session
- **How:** Clear section at top of README:
  ```markdown
  ## Core Constraints (Read Before Coding)
  1. Direct quotes only — no AI synthesis
  2. Every passage needs book/chapter/page citation
  3. API-first: business logic in /lib/services/
  4. No user tracking (DELTA compliance)
  5. Accessibility from day one (WCAG 2.1 AA)
  ```

### 10. Archive Proposal Backlog
- **What:** Move 15 elmer proposals to future-ideas/
- **Where:** `.elmer/proposals/` → `docs/future-ideas/`
- **Why:** Proposals accumulating before implementation creates debt
- **How:**
  - Keep proposals that directly improve Phase 0
  - Archive everything else
  - Revisit after Phase 1 ships

## Open Questions

1. **Why 123 ADRs before any code?** This level of specification suggests either analysis paralysis or a waterfall methodology disguised as agile. Which is it?

2. **Who validates these decisions?** Many ADRs make assumptions about SRF preferences without stakeholder confirmation. Has SRF reviewed even 10% of these?

3. **What's the actual team size?** The roadmap assumes parallel workstreams but never states team composition. Is this a solo developer project?

4. **Why optimize for AI context windows?** The stated reason for extensive documentation is "AI context windows" — but this creates more context than any AI can hold.

5. **Where's the user research?** Features like Study Workspace and Community Collections assume user needs without evidence. Has anyone asked seekers what they want?

## What's Not Being Asked

### Implementation Reality
No one is asking whether a single developer (or AI) can maintain this level of architectural complexity. The documentation describes an architecture suitable for a team of 20, not 1–2.

### Spiritual Purpose Drift
The portal's mission is making Yogananda's teachings findable in moments of need. Many features (dashboard analytics, community curation, study workspace) serve institutional needs, not seeker needs. The question not asked: does each feature make the teachings more findable for someone suffering at 2 AM?

### Documentation as Procrastination
Creating 123 ADRs might feel like progress, but it's not shipping value. The unasked question: is perfect documentation preventing good-enough implementation?

### Stack Lock-In
Committing to Neon + Neptune + Redis + Contentful + Vercel + Auth0 before proving core value creates vendor lock-in. The unasked question: what if the philanthropist's funding ends after Phase 2?

### Maintenance Burden
Every abstraction, every tool, every process document must be maintained for 10 years. The unasked question: who maintains this after the initial AI/developer moves on?

### False Precision
Specifying "100–500 token chunks" and "RRF k-constant tuning" before ingesting a single book is false precision. The unasked question: why not start simple and refine based on actual usage?

### The Cost of Formality
Zero-padded identifiers, strict header formats, and process documents create cognitive overhead. The unasked question: does this formality improve outcomes or just create bureaucracy?

### Build vs. Buy Blindness
Custom building features that existing tools solve better (study notebooks, community features). The unasked question: should the portal focus on unique value (findability) and integrate with existing tools for everything else?