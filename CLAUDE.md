# SRF Online Teachings Portal — AI Context

## What This Project Is

A free, world-class online teachings portal for Self-Realization Fellowship (SRF) to make Paramahansa Yogananda's published books freely accessible worldwide, with an AI-powered intelligent search tool. Funded by a philanthropist. Launching late 2026.

**AI-human collaboration.** This project is architected, implemented, and maintained by AI (Claude) under human direction. The human principal directs strategy, stakeholder decisions, and editorial judgment; the AI serves as architect, implementer, and maintainer. The documentation volume is intentional — it serves as institutional memory across AI context windows. See CONTEXT.md § Project Methodology for the full collaboration model.

## Read These Files (In Order)

1. **CONTEXT.md** — Project background, mission, stakeholders, theological constraints, current state, open questions
2. **DESIGN.md** — Technical architecture, data model, content pipeline, UI design tokens, API design, observability, testing
3. **DECISIONS.md** — 123 Architecture Decision Records (ADR-001 through ADR-123) organized into 11 topical groups, with full rationale for every major choice
4. **ROADMAP.md** — 15 phases (0–14) from foundation through community curation at scale, with deliverables, success criteria, and phase gates

## Ignore

- **scratch.md** — Personal scratchpad. Not project documentation. Do not read.

## Reference Documents (Background Research)

Located in `docs/reference/`:

- **overview-youtube.md** — Brother Chidananda's announcement of the portal (YouTube transcript)
- **SRF Teaching Portal Research & Design (Gemini 3 Pro).md** — Comprehensive theological, pedagogical, and technical analysis
- **SRF Tech Stack Brief-3.md** — SRF's established technology stack (AWS, Vercel, Contentful, Neon, Auth0, etc.)
- **RAG_Architecture_Proposal.md** — Comprehensive RAG architecture and feature proposal (Claude Web, Feb 2026). Merge-reviewed: ADR-114–121 and DES-054–056 adopted; Features 10–11 omitted/constrained; stack divergences annotated.

## Critical Design Constraints (Code-Affecting)

These constraints directly affect code generation. For the full set of theological, ethical, and design principles (Calm Technology, Global Equity, Signpost-not-Destination, Human Review Gate, Content Honesty, Lessons Scope), read CONTEXT.md § Theological and Ethical Constraints.

1. **Direct quotes only.** The AI is a librarian, not an oracle. It finds and ranks Yogananda's verbatim words — it NEVER generates, paraphrases, or synthesizes content. (ADR-001)
2. **Sacred text fidelity.** Every displayed passage must include book, chapter, and page citation. No orphaned quotes. AI translation of Yogananda's words is never acceptable — only official SRF/YSS translations. (ADR-075, ADR-078)
3. **API-first architecture.** All business logic in `/lib/services/`. API routes use `/api/v1/` prefix. All routes public (no auth until Phase 13+). Cursor-based pagination. (ADR-011)
4. **DELTA-compliant analytics.** No user identification, no session tracking, no behavioral profiling. Amplitude event allowlist only. (ADR-095)
5. **Multilingual from the foundation.** Every content table carries a `language` column from the first migration. Every content API accepts a `language` parameter. UI strings externalized, CSS uses logical properties, schema includes cross-language linking. Adding a new language should require zero schema migrations, zero API changes, and zero search rewrites. (ADR-075, ADR-076, ADR-077, ADR-078)
6. **Accessibility from Phase 1.** WCAG 2.1 AA from the first component. Semantic HTML, ARIA landmarks, keyboard navigation, screen reader support, 44×44px touch targets, `prefers-reduced-motion`. Performance budgets: < 100KB JS, FCP < 1.5s. axe-core in CI — accessibility violations block merges. (ADR-003)
7. **Parameters as named constants.** Specific numeric values throughout the documents (chunk sizes, rate limits, thresholds) are tunable defaults, not architectural commitments. Implement them as named constants in `/lib/config.ts`. (ADR-123)

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

**DES-NNN** (Design Sections) — 56 sections in DESIGN.md (DES-001 through DES-056), numbered by document order. Sections without an ADR governance reference get DES identifiers. Sections governed by active ADRs use `## ADR-NNN: Title` headers instead. Header format: `## DES-NNN: Title`, `### DES-NNN: Title`, or `#### DES-NNN: Title` (level reflects nesting depth).

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

Five documents. Keep them accurate as you work — drift compounds across sessions. (ADR-098)

| When this happens... | ...update these documents |
|----------------------|--------------------------|
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
