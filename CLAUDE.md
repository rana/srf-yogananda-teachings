# SRF Online Teachings Portal — AI Context

## What This Project Is

A free, world-class online teachings portal for Self-Realization Fellowship (SRF) to make Paramahansa Yogananda's published books freely accessible worldwide, with an AI-powered intelligent search tool. Funded by a philanthropist. Launching late 2026.

**AI-human collaboration.** This project is architected, implemented, and maintained by AI (Claude) under human direction. The human principal directs strategy, stakeholder decisions, and editorial judgment; the AI serves as architect, implementer, and maintainer. The documentation volume is intentional — it serves as institutional memory across AI context windows. See CONTEXT.md § Project Methodology for the full collaboration model.

## Read These Files

1. **PRINCIPLES.md** — The 11 immutable commitments that define the project, with rationale. Always load this.
2. **CONTEXT.md** — Project background, mission, stakeholders, theological constraints, current state, open questions
3. **DESIGN.md** — Cross-cutting architecture, API design, observability, testing, personas, editorial patterns
4. **DESIGN-phase0.md** — Search architecture, data model, ingestion pipeline, chunking, MCP, infrastructure
5. **DESIGN-phase1-4.md** — Frontend, accessibility, video, events, places, multilingual infra, glossary, staff tools
6. **DESIGN-phase5-plus.md** — Cultural design, email, CMS, magazine, dashboard, study circles, image serving
7. **DECISIONS.md** — 123 Architecture Decision Records (ADR-001 through ADR-123) organized into 11 topical groups with navigational summaries. Read the index + group summaries first; load full ADRs on demand.
8. **ROADMAP.md** — 15 phases (0–14) from foundation through community curation at scale, with deliverables, success criteria, and phase gates

**Phase-gated reading.** Do not read front-to-back. Load what the task requires:
- **Always:** This file (CLAUDE.md) + PRINCIPLES.md + CONTEXT.md § Current State + ROADMAP.md § current phase
- **When implementing Phase 0:** DESIGN.md (root) + DESIGN-phase0.md + DECISIONS.md ADRs referenced by those sections
- **When implementing Phases 1–4:** DESIGN.md (root) + DESIGN-phase1-4.md + relevant ADRs
- **When implementing Phase 5+:** DESIGN.md (root) + DESIGN-phase5-plus.md + relevant ADRs
- **When making decisions:** The relevant ADR group from the DECISIONS.md index (Foundational, Architecture, Content, Search, etc.)
- **Not needed for Phase 0:** DESIGN-phase1-4.md, DESIGN-phase5-plus.md, Cross-Media ADRs (054–064), Staff & Community ADRs (082–087), Brand & Communications ADRs (088–092, 105)

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

1. **Direct quotes only.** The AI is a librarian, not an oracle. It finds and ranks Yogananda's verbatim words — it NEVER generates, paraphrases, or synthesizes content. (ADR-001)
2. **Sacred text fidelity.** Every displayed passage must include book, chapter, and page citation. No orphaned quotes. AI translation of Yogananda's words is never acceptable — only official SRF/YSS translations. (ADR-075, ADR-078)
3. **Signpost, not destination.** The portal leads seekers toward practice — it never substitutes for it. Practice Bridge routes technique queries to SRF Lessons information. Crisis query detection provides safety interstitials. The AI never interprets meditation techniques or spiritual practices. (ADR-104, ADR-122)
4. **Global Equity.** A seeker in rural Bihar on 2G and a seeker in San Francisco on fiber both get the complete experience. Progressive enhancement: HTML is the foundation, CSS enriches, JavaScript enhances. No feature gating behind connectivity. Performance budgets enforce this. (ADR-006)
5. **Calm Technology.** No push notifications, no autoplay, no engagement tracking, no gamification, no reading streaks, no time-pressure UI. The portal waits; it does not interrupt. Technology requires the smallest possible amount of attention. (ADR-065, ADR-002)
6. **Accessibility from Phase 1.** WCAG 2.1 AA from the first component. Semantic HTML, ARIA landmarks, keyboard navigation, screen reader support, 44×44px touch targets, `prefers-reduced-motion`. Performance budgets: < 100KB JS, FCP < 1.5s. axe-core in CI — accessibility violations block merges. (ADR-003)
7. **DELTA-compliant analytics.** No user identification, no session tracking, no behavioral profiling. Amplitude event allowlist only. (ADR-095)
8. **Multilingual from the foundation.** Every content table carries a `language` column from the first migration. Every content API accepts a `language` parameter. UI strings externalized, CSS uses logical properties, schema includes cross-language linking. Adding a new language should require zero schema migrations, zero API changes, and zero search rewrites. (ADR-075, ADR-076, ADR-077, ADR-078)
9. **API-first architecture.** All business logic in `/lib/services/`. API routes use `/api/v1/` prefix. All routes public (no auth until Phase 13+). Cursor-based pagination. (ADR-011)
10. **10-year design horizon.** `/lib/services/` has zero framework imports — business logic survives a UI rewrite. Raw SQL migrations outlive every ORM. Standard protocols (REST, OAuth, SQL, HTTP) at every boundary. Every Tier 3 component (Next.js, Vercel, Contentful, Auth0) is replaceable without touching Tier 1 (PostgreSQL, SQL, HTML). (ADR-004)
11. **Parameters as named constants.** Specific numeric values throughout the documents (chunk sizes, rate limits, thresholds) are tunable defaults, not architectural commitments. Implement them as named constants in `/lib/config.ts`. (ADR-123)

## Quick Reference

**Core stack:** Next.js on Vercel, Neon PostgreSQL + pgvector + pg_search/ParadeDB, Claude Haiku via AWS Bedrock (librarian — never generates content; ADR-014), Voyage voyage-3-large (embeddings, ADR-118), Cohere Rerank 3.5 (Phase 2+, ADR-119), Python + NetworkX graph batch pipeline (Phase 4+, ADR-117), Redis/ElastiCache (suggestions, Phase 2+, ADR-120), fastText (language detection), Contentful (Phase 9+), dbmate migrations, Terraform IaC. See DESIGN.md for the full tech stack.

**Code layout:**
```
/lib/services/ — Business logic (framework-agnostic TypeScript)
/lib/mcp/ — MCP server (three-tier corpus access layer, ADR-101)
/lib/logger.ts — Structured JSON logging
/app/ — Next.js Server Components + Route Handlers
/app/api/v1/ — Versioned API routes
/migrations/ — Numbered SQL migrations (dbmate)
/terraform/ — Infrastructure as Code
/lambda/ — AWS Lambda handlers (Phase 1+, ADR-017)
/messages/ — Locale JSON files (next-intl)
/scripts/ — CI-agnostic deployment scripts
/docs/reference/ — Background research (not active project docs)
/docs/operational/ — Operational playbook (Phase 4+: procedures for editorial, ingestion, VLD)
```

**Design tokens:** Merriweather + Lora + Open Sans. SRF Gold `#dcbd23`, SRF Navy `#1a2744`, Warm Cream `#FAF8F5`. Full palette in DESIGN.md § Visual Identity.

**MCP servers:** Neon (now), Sentry (Phase 0), Contentful (Phase 9+), SRF Corpus (custom three-tier: development Phase 0, internal editorial Phase 4, external distribution Phase 8; ADR-101). Details in DESIGN.md § MCP Server Strategy.

## Identifier Conventions

**ADR-NNN** (Architecture Decision Records) — 123 decisions in DECISIONS.md (ADR-001 through ADR-123), organized into 11 topical groups: Foundational Constraints, Architecture & Platform, Content & Data Model, Search & AI, Cross-Media, Seeker Experience, Internationalization, Staff & Community, Brand & Communications, Operations & Engineering, Governance. New ADRs append after ADR-123. Header format: `## ADR-NNN: Title`. ADR-123 establishes the **Principle vs. Parameter** classification — specific numeric values throughout the documents are tunable defaults, not architectural commitments. Implement them as named constants in `/lib/config.ts`.

**DES-NNN** (Design Sections) — 56 sections (DES-001 through DES-056) split across four files: DESIGN.md (cross-cutting), DESIGN-phase0.md, DESIGN-phase1-4.md, DESIGN-phase5-plus.md. The navigation table in DESIGN.md shows which file contains each section. Sections without an ADR governance reference get DES identifiers. Sections governed by active ADRs use `## ADR-NNN: Title` headers instead.

When referencing identifiers in prose, use the prefix form: `ADR-017`, `DES-003`. Always zero-pad to three digits.

## Project Skills

Six custom skills in `.claude/skills/`:

**Review skills** (read-only analysis, no file changes):
- **seeker-ux** — Reading and seeker experience review. Evaluates the reader's journey for accessibility, helpfulness, and spiritual uplift.
- **mission-align** — SRF mission alignment check. Assesses whether features and decisions serve the portal's spiritual purpose.
- **cultural-lens** — Cultural sensitivity review. Evaluates assumptions about language, geography, religion, and access.

**Proposal management skills** (edit project documents with approval):
- **proposal-merge** — Decompose an elmer proposal into precise edits across DECISIONS.md, DESIGN.md, ROADMAP.md, and CONTEXT.md. Assigns ADR/DES identifiers, detects conflicts, presents full plan for approval before executing.
- **dedup-proposals** — Deduplicate and synthesize overlapping elmer proposals. Without arguments: scans all proposals, reports variant clusters. With a filename: finds related explorations of the same topic and synthesizes them into one document preserving all unique ideas.
- **theme-integrate** — Integrate a new content theme into taxonomy, terminology bridge, enrichment pipeline, knowledge graph, and worldview pathways. Generates all integration artifacts from a proposal or free-text description.

**Proposal management workflow:** `/dedup-proposals` → `/proposal-merge <file>` or `/theme-integrate <file>` → run `coherence` skill to verify cross-document integrity.

## Document Maintenance

Eight documents (CLAUDE.md, PRINCIPLES.md, CONTEXT.md, DESIGN.md + 3 phase files, DECISIONS.md, ROADMAP.md). Keep them accurate as you work — drift compounds across sessions. (ADR-098)

| When this happens... | ...update these documents |
|----------------------|--------------------------|
| Principle added or revised | Update PRINCIPLES.md (expanded rationale) and CLAUDE.md § Principles (compressed form) |
| New decision made | Add ADR to DECISIONS.md and update the domain index at top of file |
| Open question resolved | Move from "Open Questions" to "Resolved Questions" in CONTEXT.md |
| Open question added | Add to CONTEXT.md § Open Questions (appropriate tier). Cross-reference from relevant DESIGN.md section if applicable. |
| Phase deliverable changed | Update ROADMAP.md deliverable table/bullets and success criteria |
| Phase status changes | Update "Current State" section in CONTEXT.md |
| New technology adopted | Update DESIGN.md tech stack table |
| New content type added | DESIGN.md § Data Model + API section, ROADMAP.md phase, new ADR. Also: Knowledge Graph node/edge types, ADR-062 checklist, DES-053 media-type variations. |
| New API endpoint added | Follow DES-019 § API Conventions (ADR-110). Paginated lists: `data`/`pagination`/`meta`; complete collections: `data`/`meta`; single resources: object directly. |
| Elmer proposal approved for merge | Use `/dedup-proposals` first if variants exist, then `/proposal-merge <file>` or `/theme-integrate <file>`. Skill handles all document updates. |
| Design section fully implemented | Add `**Status: Implemented** — see [code path]` at top of DESIGN.md section |
| Parameter tuned (ADR-123) | Annotate DESIGN.md section: `*Parameter tuned: [date], [old] → [new], [evidence].*` Update `/lib/config.ts`. |

At phase boundaries, reconcile all documents for consistency — personas, roles, workflows, directories, and cross-cutting concerns.

## Documentation–Code Transition

Once implementation begins, DESIGN.md sections transition from "authoritative spec" to "architectural reference":

1. **Before code exists:** DESIGN.md is the source of truth. Follow it precisely.
2. **When a section is implemented:** Add `**Status: Implemented** — see [code path]` at the top. Code becomes the source of truth for implementation details; DESIGN.md remains the architectural rationale.
3. **When implementation diverges from design:** Update DESIGN.md to reflect the actual decision. DESIGN.md is a living document, not a historical artifact.
4. **Section-level change tracking:** When substantially revising a section, add `*Section revised: [date], [reason or ADR]*` at the section's end.

DECISIONS.md ADRs are mutable living documents. Update them directly — add, revise, or replace content in place. Do not create superseding ADRs or use withdrawal ceremony. ADR numbers and ordering may be restructured for readability. When substantially revising an ADR, add `*Revised: [date], [reason]*` at the section's end. Git history serves as the full audit trail.
