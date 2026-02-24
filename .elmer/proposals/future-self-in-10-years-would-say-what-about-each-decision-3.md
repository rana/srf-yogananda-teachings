<!-- elmer:archive
  id: future-self-in-10-years-would-say-what-about-each-decision
  topic: Future self in 10 years would say what about each decision? What if anything would I wish I had done differently in 10 years?
  archetype: explore-act
  model: opus
  status: approved
  archived: 2026-02-24 07:31 UTC
-->

## Summary

A 10-year retrospective analysis of the SRF Online Teachings Portal's architecture decisions, examining which principles and technical choices will prove timeless versus which may feel overengineered, misaligned, or regrettable. The analysis reveals three categories of decisions: those that will age gracefully (sacred text fidelity, accessibility-first, calm technology), those that may feel excessive in hindsight (112 ADRs, phase complexity, documentation volume), and critical blind spots around community agency, cultural representation, and the tension between preservation and evolution.

## Analysis

### What Will Age Gracefully

Looking back from 2036, certain decisions will feel prescient:

**Sacred Text Fidelity (ADR-001, Principle 2)** — The absolute commitment to verbatim quotes with no AI paraphrasing will prove to be the single most important decision. By 2036, after numerous AI-generated religious content scandals, this restraint will look wise. The "librarian not oracle" model avoided the trap that caught many spiritual platforms.

**Accessibility from Phase 1 (ADR-003, Principle 6)** — Building accessibility in from the start rather than retrofitting will have saved years of technical debt. The elderly devotees who formed much of SRF's base in 2026 are now 10 years older. The portal's early commitment to screen readers and keyboard navigation serves them perfectly.

**10-Year Design Horizon (ADR-004, Principle 10)** — The framework-agnostic service layer and raw SQL migrations will have survived at least one major UI framework migration. Next.js might be gone, but `/lib/services/` lives on. The decision to use standard protocols at every boundary means partner integrations still work.

**Global Equity (Principle 4)** — The progressive enhancement approach and 2G support aged beautifully. While Silicon Valley moved to AR/VR interfaces, billions of seekers still access the portal on basic devices. The text-only mode serves climate-conscious users reducing digital consumption.

**DELTA Privacy Framework (ADR-095, Principle 7)** — Going beyond GDPR to build on theological principles created a privacy stance that survived multiple regulatory changes. The decision to never track individual users looks prophetic after the 2030s privacy awakening.

### What Will Feel Overengineered

**123 ADRs** — The sheer volume of documented decisions will feel excessive. Many ADRs address hypothetical scenarios that never materialized. The distinction between principles and parameters (ADR-123) helps, but 80% of these decisions could have been deferred until they were actually needed.

**15-Phase Roadmap** — The granular phasing will seem overthought. In practice, phases blurred together, parallel workstreams emerged, and organizational realities forced different sequencing. A simpler "Foundation → Growth → Maturity" arc would have been sufficient.

**Documentation Volume** — 11 documents totaling hundreds of pages for a project with no code yet. The phase-gated reading guidance helps, but the documentation-to-implementation ratio is extreme. Future self would keep PRINCIPLES.md and CONTEXT.md, merge the rest into a single DESIGN.md.

**Graph Intelligence Complexity** — The Knowledge Graph with PageRank, community detection, and betweenness centrality (ADR-117) feels like technical enthusiasm. Simple tags and categories would have served 95% of use cases. The graph adds complexity without proportional value.

**Three-Tier MCP Architecture** — The development/internal/external MCP server tiers (ADR-101) seem overwrought. In practice, a simple read-only API with rate limiting would have sufficed.

### Critical Blind Spots

**Community Agency Undervalued** — The portal is designed as a one-way transmission system. Phase 14's community curation feels like an afterthought. By 2036, the most valuable aspect might be seeker-generated connections and interpretations. The architecture doesn't truly embrace community wisdom.

**Cultural Colonialism in Design** — Despite mentions of YSS and cultural consultation, the entire architecture is Western. English-first, Latin-script-optimized, individual-reading-focused. Hindi/Bengali in Phase 10 (after European languages!) reveals the unconscious hierarchy. Future self would involve non-Western designers from day one as co-architects, not reviewers.

**Mobile-First Blindness** — The architecture assumes desktop-first with mobile adaptation. By 2036, mobile is the only platform for most global users. Every decision should have started from mobile constraints.

**AI Evolution Naivety** — The strict "no synthesis" rule assumes AI remains untrustworthy. By 2036, AI systems might be more faithful to source material than human interpreters. The absolutist stance prevents beneficial evolution.

**Monolithic PostgreSQL** — Keeping everything in one database seems clean but creates a single point of failure. Vector search, full-text search, relational data, and graph computation in one system is operationally risky.

## Proposed Changes

### Immediate Simplifications

**What:** Reduce documentation to three files
**Where:** Merge all design docs into streamlined PRINCIPLES.md, DESIGN.md, CONTEXT.md
**Why:** Current 11-document system is overwhelming
**How:** Keep principles sacred, merge all design/decisions into unified narrative, maintain context as living state document

**What:** Compress roadmap to 5 macro-phases
**Where:** ROADMAP.md
**Why:** 15 phases create false precision
**How:** Foundation (search works) → Content (multi-book) → Experience (reader polish) → Scale (languages) → Community (participation)

**What:** Defer graph intelligence entirely
**Where:** Remove from Phase 4-6, make optional future enhancement
**Why:** Complexity without proven value
**How:** Use simple tagging and PostgreSQL full-text search for "related" features

### Architectural Corrections

**What:** Mobile-first responsive design
**Where:** Every component specification
**Why:** Mobile is primary, not secondary
**How:** Design every feature for 360px width first, enhance upward

**What:** Separate vector search infrastructure
**Where:** Move pgvector to dedicated service
**Why:** Operational isolation, independent scaling
**How:** Pinecone or Weaviate for vectors, PostgreSQL for relational only

**What:** Community participation from Phase 1
**Where:** Add simple annotation/collection features early
**Why:** Community wisdom should grow with the portal
**How:** Anonymous passage annotations, shared reading lists, themed collections

### Cultural Reframing

**What:** Hindi/Bengali as co-primary languages
**Where:** Phase 1 data model, URL structure, design system
**Why:** Yogananda's heritage deserves first-class treatment
**How:** Trilingual schema from day one, Devanagari typography in base design system

**What:** Replace Western archetypes in entry paths
**Where:** "Start Here" section, worldview pathways
**Why:** "Curious reader" and "person in need" are Western spiritual categories
**How:** Research actual seeker archetypes in Indian, African, Latin American contexts

**What:** Communal reading as primary mode
**Where:** Reader features, sharing mechanisms
**Why:** Individual silent reading is Western; most cultures read spiritually in groups
**How:** Presentation mode in Phase 1, group annotation features, family accounts

### Governance Evolution

**What:** Living architecture over frozen decisions
**Where:** Replace ADR system with living design document
**Why:** 123 immutable decisions create rigidity
**How:** Principles are sacred, everything else is iterative documentation

**What:** Parameter extraction
**Where:** Create `/config/parameters.ts` on day one
**Why:** Prevent magic numbers throughout codebase
**How:** Every numeric value (cache TTL, rate limit, chunk size) in central config

**What:** Feature flags from Phase 0
**Where:** Infrastructure layer
**Why:** Enable partial rollouts and A/B testing
**How:** Simple boolean flags in environment variables initially, feature flag service later

## Open Questions

### The Preservation Paradox

How do you build a 10-year system in an industry with 2-year cycles? The portal tries to solve this with durability tiers, but the real question is: should spiritual teachings be preserved in digital form at all, or does the medium fundamentally alter the message?

### The Authority Question

Who has the authority to make technical decisions about sacred text presentation? The current structure assumes technical and spiritual concerns are separable. They aren't. Every rendering choice is theological.

### The Community Tension

Is the portal a library (preserved, curated, authoritative) or a garden (growing, evolving, community-tended)? The architecture assumes library but the seekers might want garden.

### The Scale Trap

The portal assumes global scale from day one. What if staying small and focused would serve seekers better? Not every spiritual resource needs to be universal.

### The Measurement Void

By rejecting engagement metrics, how do you know if the portal serves its purpose? "What Is Humanity Seeking?" is poetic but not actionable. Some measurement is necessary for stewarding donor funds.

## What's Not Being Asked

### Why Digital At All?

The assumption that Yogananda's teachings need a digital portal is unexamined. Books worked for 100 years. What specific problem does digitization solve that justifies this complexity?

### Whose Portal Is This?

The philanthropist funds it, SRF owns the content, AI builds it, seekers use it. Who is the actual client? The architecture tries to serve everyone and might serve no one deeply.

### What About Other Lineages?

Yogananda has multiple legitimate lineage holders beyond SRF. The portal's SRF exclusivity might fragment rather than unite his teachings. The 10-year view would show this as a missed opportunity for reconciliation.

### The Succession Problem

What happens when the current SRF leadership changes? The portal assumes institutional continuity that might not exist. Religious organizations have schisms. The architecture doesn't account for this.

### The AI Dependency

Despite claims of replaceability, the portal is deeply dependent on Claude for design and maintenance. What happens when Anthropic's priorities change? The "AI maintains the portal" model has no fallback.

### The Cultural Export

The portal exports Indian spiritual teachings through American technology infrastructure to a global audience. This neo-colonial pattern is unacknowledged. By 2036, this might be the most problematic aspect.

### The Generation Gap

The portal is designed for current devotees (elderly, patient, contemplative). What about their children who expect TikTok-speed discovery? The "calm technology" might be alienating to young seekers.

### The Money Question

"Munificent" funding sounds infinite but isn't. What's the sustainability model? The 10-year horizon assumes continued philanthropy. That's naive. Where's the endowment structure?

### The Obsolescence Curve

By the time this launches (late 2026), will anyone still want hierarchical navigation and search boxes? Conversational AI interfaces might make the entire UX paradigm obsolete on arrival.

### The Sacred/Secular Boundary

The portal treats Yogananda's words as sacred text requiring absolute fidelity, but builds on secular technology stacks with their own values embedded. This boundary is false. The medium shapes the message in ways the architecture doesn't acknowledge.