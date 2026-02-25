# SRF Online Teachings Portal — AI Context

## What This Project Is

A free, world-class online teachings portal for Self-Realization Fellowship (SRF) to make Paramahansa Yogananda's published books freely accessible worldwide, with an AI-powered intelligent search tool. Funded by a philanthropist. Launching late 2026.

**AI-human collaboration.** This project is architected, implemented, and maintained by AI (Claude) under human direction. The human principal directs strategy, stakeholder decisions, and editorial judgment; the AI serves as architect, implementer, and maintainer. The documentation volume is intentional — it serves as institutional memory across AI context windows. See CONTEXT.md § Project Methodology for the full collaboration model.

## Read These Files

1. **PRINCIPLES.md** — The 11 immutable commitments that define the project, with rationale. Always load this.
2. **CONTEXT.md** — Project background, mission, stakeholders, theological constraints, current state, open questions
3. **DESIGN.md** — Cross-cutting architecture, API design, observability, testing, personas, editorial patterns
4. **DESIGN-arc1.md** — Search architecture, data model, ingestion pipeline, chunking, MCP, infrastructure
5. **DESIGN-arc2-3.md** — Frontend, accessibility, video, events, places, multilingual infra, glossary, staff tools
6. **DESIGN-arc4-plus.md** — Cultural design, email, CMS, magazine, dashboard, study circles, image serving
7. **DECISIONS.md** — Index and navigational summaries for 118 ADRs across 11 topical groups. ADR bodies split into three files:
   - **DECISIONS-core.md** — Foundational, Architecture, Content, Search (ADR-001–053, 114–121). Arc 1+.
   - **DECISIONS-experience.md** — Cross-Media, Seeker Experience, Internationalization (ADR-054–081, 104, 122). Arc 2+.
   - **DECISIONS-operations.md** — Staff, Brand, Operations, Governance (ADR-082–101, 105–113, 123). Arc 3+.
8. **ROADMAP.md** — 7 arcs from foundation through community curation at scale, with milestones, deliverables, success criteria, and arc gates
9. **PROPOSALS.md** — Proposal registry with PRO-NNN identifiers, graduation protocol, and scheduling lifecycle. Curated proposals awaiting validation, scheduling, or adoption. Also handles ADR/DES suspension lifecycle.

**Arc-gated reading.** Do not read front-to-back. Load what the task requires:
- **Always:** This file (CLAUDE.md) + PRINCIPLES.md + CONTEXT.md § Current State + ROADMAP.md § current arc/milestone
- **When implementing Arc 1 (Foundation — Milestones 1a/1b):** DESIGN.md (root) + DESIGN-arc1.md + DECISIONS-core.md (ADRs referenced by those sections)
- **When implementing Arc 2 (Presence — Milestones 2a/2b):** DESIGN.md (root) + DESIGN-arc2-3.md + DECISIONS-core.md + DECISIONS-experience.md
- **When implementing Arc 3 (Wisdom — Milestones 3a–3d):** DESIGN.md (root) + DESIGN-arc2-3.md + DECISIONS-core.md + DECISIONS-experience.md
- **When implementing Arc 4+:** DESIGN.md (root) + DESIGN-arc4-plus.md + all DECISIONS files as needed
- **When making decisions:** DECISIONS.md index to locate the relevant group, then load the appropriate body file
- **When evaluating proposals or at arc boundaries:** PROPOSALS.md
- **Not needed for Arc 1:** DESIGN-arc2-3.md, DESIGN-arc4-plus.md, DECISIONS-experience.md, DECISIONS-operations.md, PROPOSALS.md (unless a PRO-NNN is cross-referenced)

## Ignore

- **scratch.md** — Personal scratchpad. Not project documentation. Do not read.

## Reference Documents (Background Research)

Located in `docs/reference/`:

- **overview-youtube.md** — Brother Chidananda's announcement of the portal (YouTube transcript)
- **SRF Teaching Portal Research & Design (Gemini 3 Pro).md** — Comprehensive theological, pedagogical, and technical analysis
- **SRF Tech Stack Brief-3.md** — SRF's established technology stack (AWS, Vercel, Contentful, Neon, Auth0, etc.)
- **RAG_Architecture_Proposal.md** — Comprehensive RAG architecture and feature proposal (Claude Web, Feb 2026). Merge-reviewed: ADR-114–121 and DES-054–056 adopted; Features 10–11 omitted/constrained; stack divergences annotated.

## Principles (Code-Affecting)

Eleven principles define the project's identity and directly constrain code generation. Changing any of these changes what the project is — they require full deliberation to modify. PRINCIPLES.md has the expanded rationale for each. Additional theological and ethical context (Content Honesty, Lessons Scope, Human Review Gate) is in CONTEXT.md § Theological and Ethical Constraints.

1. **Direct quotes only.** The AI is a librarian, not an oracle. It finds and ranks Yogananda's verbatim words — it NEVER generates, paraphrases, or synthesizes content. (ADR-001, ADR-005)
2. **Sacred text fidelity.** Every displayed passage must include book, chapter, and page citation. No orphaned quotes. AI translation of Yogananda's words is never acceptable — only official SRF/YSS translations. (ADR-075, ADR-078)
3. **Signpost, not destination.** The portal leads seekers toward practice — it never substitutes for it. Practice Bridge routes technique queries to SRF Lessons information. Crisis query detection provides safety interstitials. The AI never interprets meditation techniques or spiritual practices. (ADR-104, ADR-122, ADR-069)
4. **Global Equity.** A seeker in rural Bihar on 2G and a seeker in San Francisco on fiber both get the complete experience. Progressive enhancement: HTML is the foundation, CSS enriches, JavaScript enhances. No feature gating behind connectivity. Performance budgets enforce this. (ADR-006)
5. **Calm Technology.** No push notifications, no autoplay, no engagement tracking, no gamification, no reading streaks, no time-pressure UI. The portal waits; it does not interrupt. Technology requires the smallest possible amount of attention. (ADR-065, ADR-002)
6. **Accessibility from Milestone 2a.** WCAG 2.1 AA from the first component. Semantic HTML, ARIA landmarks, keyboard navigation, screen reader support, 44×44px touch targets, `prefers-reduced-motion`. Performance budgets: < 100KB JS, FCP < 1.5s. axe-core in CI — accessibility violations block merges. (ADR-003)
7. **DELTA-compliant analytics.** No user identification, no session tracking, no behavioral profiling. Amplitude event allowlist only. (ADR-095, ADR-099)
8. **Multilingual from the foundation.** Every content table carries a `language` column from the first migration. Every content API accepts a `language` parameter. UI strings externalized, CSS uses logical properties, schema includes cross-language linking. Adding a new language should require zero schema migrations, zero API changes, and zero search rewrites. (ADR-075, ADR-076, ADR-077, ADR-078)
9. **API-first architecture.** All business logic in `/lib/services/`. API routes use `/api/v1/` prefix. All routes public (no auth until Milestone 7a+). Cursor-based pagination. (ADR-011)
10. **10-year design horizon.** `/lib/services/` has zero framework imports — business logic survives a UI rewrite. Raw SQL migrations outlive every ORM. Standard protocols (REST, OAuth, SQL, HTTP) at every boundary. Tier 2 components (Next.js, Vercel, Contentful) are replaceable without touching Tier 1 (PostgreSQL, SQL, HTML). (ADR-004)
11. **Parameters as named constants.** Specific numeric values throughout the documents (chunk sizes, rate limits, thresholds) are tunable defaults, not architectural commitments. Implement them as named constants in `/lib/config.ts`. (ADR-123)

## Quick Reference

**Core stack:** Next.js on Vercel, Neon PostgreSQL + pgvector + pg_search/ParadeDB, Contentful (Arc 1+, editorial source of truth; ADR-010), Claude Haiku via AWS Bedrock (librarian — never generates content; ADR-014), Voyage voyage-3-large (embeddings, ADR-118), Cohere Rerank 3.5 (Milestone 2b+, ADR-119), Python + NetworkX graph batch pipeline (Milestone 3b+, ADR-117), Redis/ElastiCache (suggestions, Milestone 2b+, ADR-120), fastText (language detection), dbmate migrations, Terraform IaC. See DESIGN.md for the full tech stack.

**Code layout:**
```
/lib/services/ — Business logic (framework-agnostic TypeScript)
/lib/mcp/ — MCP server (unscheduled; ADR-101)
/lib/logger.ts — Structured JSON logging
/app/ — Next.js Server Components + Route Handlers
/app/api/v1/ — Versioned API routes
/migrations/ — Numbered SQL migrations (dbmate)
/terraform/ — Infrastructure as Code
/lambda/ — AWS Lambda handlers (Milestone 2a+, ADR-017)
/messages/ — Locale JSON files (next-intl)
/scripts/ — CI-agnostic deployment scripts
/docs/reference/ — Background research (not active project docs)
/docs/operational/ — Operational playbook (Milestone 3b+: procedures for editorial, ingestion, VLD)
```

**Design tokens:** Merriweather + Lora + Open Sans. SRF Gold `#dcbd23`, SRF Navy `#1a2744`, Warm Cream `#FAF8F5`. Full palette in DESIGN.md § Visual Identity.

**MCP servers:** Neon (now), Sentry (Arc 1), Contentful (Milestone 1b+), SRF Corpus (unscheduled — see ROADMAP.md § Unscheduled Features; ADR-101). Details in DESIGN-arc1.md § MCP Server Strategy.

## Identifier Conventions

**ADR-NNN** (Architecture Decision Records) — 118 records organized into 11 topical groups (some numbers retired). DECISIONS.md is the navigational index with group summaries; ADR bodies are in DECISIONS-core.md, DECISIONS-experience.md, and DECISIONS-operations.md. New ADRs append after ADR-123 in the appropriate body file. Header format: `## ADR-NNN: Title`. ADR-123 establishes the **Principle vs. Parameter** classification — specific numeric values throughout the documents are tunable defaults, not architectural commitments. Implement them as named constants in `/lib/config.ts`.

**ADR maturity classification.** ADRs carry a maturity marker in their Status field (see ADR-098):
- **Foundational** — Defines project identity. Change requires full deliberation. (`Accepted (Foundational)`)
- **Active** — Governing current or imminent implementation. (`Accepted`)
- **Provisional** — Thorough direction for future arcs. May be revised or suspended. (`Accepted (Provisional — Arc N+)`)
- **Suspended** — Moved to PROPOSALS.md. Reasoning preserved in ADR body. (`Suspended → PRO-NNN`)
- **Implemented** — Validated through code. (`Implemented — see [code path]`)

**DES-NNN** (Design Sections) — 56 sections (DES-001 through DES-056) split across four files: DESIGN.md (cross-cutting), DESIGN-arc1.md, DESIGN-arc2-3.md, DESIGN-arc4-plus.md. The navigation table in DESIGN.md shows which file contains each section. Sections without an ADR governance reference get DES identifiers. Sections governed by active ADRs use `## ADR-NNN: Title` headers instead.

**PRO-NNN** (Proposals) — Curated proposals in PROPOSALS.md. PRO-NNN identifiers are permanent — never renamed or reassigned. When a proposal is adopted, the PRO entry gets `Status: Adopted → [ADR/DES/Milestone refs]`. When an ADR is suspended, a PRO entry is created and the ADR gets `Status: Suspended → PRO-NNN`. New PROs append after the current max. Header format: `### PRO-NNN: Title`.

When referencing identifiers in prose, use the prefix form: `ADR-017`, `DES-003`, `PRO-001`. Always zero-pad to three digits.

**Dual-homed sections.** Some ADRs have sections in both DECISIONS.md and a DESIGN file (e.g., ADR-048 appears in both DECISIONS.md and DESIGN-arc1.md). Rule: DECISIONS.md carries the decision rationale and alternatives analysis; the DESIGN file carries the implementation specification. When implementing, follow the DESIGN file; when understanding *why*, read DECISIONS.md.

## Project Skills

Six custom skills in `.claude/skills/`:

**Review skills** (read-only analysis, no file changes):
- **seeker-ux** — Reading and seeker experience review. Evaluates the reader's journey for accessibility, helpfulness, and spiritual uplift.
- **mission-align** — SRF mission alignment check. Assesses whether features and decisions serve the portal's spiritual purpose.
- **cultural-lens** — Cultural sensitivity review. Evaluates assumptions about language, geography, religion, and access.

**Proposal management skills** (edit project documents with approval):
- **dedup-proposals** — Consolidate raw explorations from `.elmer/proposals/` into curated PRO-NNN entries in PROPOSALS.md. Without arguments: scans all explorations, reports variant clusters. With a PRO-NNN or filename: finds related explorations and synthesizes them.
- **proposal-merge** — Graduate a PRO-NNN proposal into precise edits across DECISIONS.md, DESIGN.md, ROADMAP.md, and CONTEXT.md. Assigns ADR/DES identifiers, detects conflicts, updates PRO status, presents full plan for approval before executing.
- **theme-integrate** — Integrate a new content theme into taxonomy, terminology bridge, enrichment pipeline, knowledge graph, and worldview pathways. Generates all integration artifacts from a PRO-NNN proposal or free-text description.

**Proposal management workflow:** `/dedup-proposals` → `/proposal-merge <PRO-NNN>` or `/theme-integrate <PRO-NNN>` → run `coherence` skill to verify cross-document integrity.

**Explorations vs. proposals.** Raw files in `.elmer/proposals/` are unvetted AI explorations — not project documents. They feed into `/dedup-proposals`, which curates them into PRO-NNN entries in PROPOSALS.md. Do not reference `.elmer/` explorations in project documents; reference PRO-NNN identifiers instead.

## Document Maintenance

Thirteen documents (CLAUDE.md, PRINCIPLES.md, CONTEXT.md, DESIGN.md + 3 arc files, DECISIONS.md index + 3 body files, PROPOSALS.md, ROADMAP.md). Keep them accurate as you work — drift compounds across sessions. (ADR-098)

| When this happens... | ...update these documents |
|----------------------|--------------------------|
| Principle added or revised | Update PRINCIPLES.md (expanded rationale) and CLAUDE.md § Principles (compressed form) |
| New decision made | Add ADR to the appropriate DECISIONS body file (core/experience/operations) and update the DECISIONS.md index |
| Open question resolved | Move from "Open Questions" to "Resolved Questions" in CONTEXT.md |
| Open question added | Add to CONTEXT.md § Open Questions (appropriate tier). Cross-reference from relevant DESIGN.md section if applicable. |
| Arc/milestone deliverable changed | Update ROADMAP.md deliverable table/bullets and success criteria |
| Arc/milestone status changes | Update "Current State" section in CONTEXT.md |
| New technology adopted | Update DESIGN.md tech stack table |
| New content type added | DESIGN.md § Data Model + API section, ROADMAP.md arc/milestone, new ADR. Also: Knowledge Graph node/edge types, ADR-062 checklist, DES-053 media-type variations. |
| New API endpoint added | Follow DES-019 § API Conventions (ADR-110). Paginated lists: `data`/`pagination`/`meta`; complete collections: `data`/`meta`; single resources: object directly. |
| Exploration ready for curation | Run `/dedup-proposals` to consolidate `.elmer/proposals/` explorations into PRO-NNN entries in PROPOSALS.md. |
| Proposal approved for merge | Run `/proposal-merge <PRO-NNN>` or `/theme-integrate <PRO-NNN>`. Skill handles ADR/DES creation and updates PRO status to Adopted. |
| Design section fully implemented | Add `**Status: Implemented** — see [code path]` at top of DESIGN.md section. Update governing ADR status if applicable. |
| Parameter tuned (ADR-123) | Annotate DESIGN.md section: `*Parameter tuned: [date], [old] → [new], [evidence].*` Update `/lib/config.ts`. |
| Feature idea without an arc | Add PRO-NNN entry to PROPOSALS.md (Status: Proposed). Cross-reference governing ADRs if known. |
| Feature cut from an arc during development | Create PRO-NNN entry in PROPOSALS.md (Status: Suspended or Deferred) with original arc/milestone, cut reason, and re-evaluation target. Update ROADMAP.md § Unscheduled Features summary table. |
| ADR suspended (moved to unscheduled) | Create PRO-NNN in PROPOSALS.md (Status: Suspended from ADR-NNN). Update ADR status to `Suspended → PRO-NNN`. ADR body stays in DECISIONS file. Update ROADMAP.md § Unscheduled Features summary table. |

At arc boundaries, reconcile all documents for consistency — personas, roles, workflows, directories, and cross-cutting concerns.

## Documentation–Code Transition

Once implementation begins, DESIGN.md sections transition from "authoritative spec" to "architectural reference":

1. **Before code exists:** DESIGN.md is the source of truth. Follow it precisely.
2. **When a section is implemented:** Add `**Status: Implemented** — see [code path]` at the top. Code becomes the source of truth for implementation details; DESIGN.md remains the architectural rationale.
3. **When implementation diverges from design:** Update DESIGN.md to reflect the actual decision. DESIGN.md is a living document, not a historical artifact.
4. **Section-level change tracking:** When substantially revising a section, add `*Section revised: [date], [reason or ADR]*` at the section's end.

ADRs (in DECISIONS-core.md, DECISIONS-experience.md, DECISIONS-operations.md) are mutable living documents. Update them directly — add, revise, or replace content in place. Do not create superseding ADRs or use withdrawal ceremony. ADR numbers and ordering may be restructured for readability. When substantially revising an ADR, add `*Revised: [date], [reason]*` at the section's end. Git history serves as the full audit trail.
