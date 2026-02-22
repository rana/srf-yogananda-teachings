# SRF Online Teachings Portal — AI Context

## What This Project Is

A free, world-class online teachings portal for Self-Realization Fellowship (SRF) to make Paramahansa Yogananda's published books freely accessible worldwide, with an AI-powered intelligent search tool. Funded by a philanthropist. Launching late 2026.

## Read These Files (In Order)

1. **CONTEXT.md** — Project background, mission, stakeholders, theological constraints, current state, open questions
2. **DESIGN.md** — Technical architecture, data model, content pipeline, UI design tokens, API design, observability, testing
3. **DECISIONS.md** — 100 Architecture Decision Records (ADR-001 through ADR-100) organized into 11 topical groups, with full rationale for every major choice
4. **ROADMAP.md** — 18 phases (0–17) from foundation through community curation at scale, with deliverables, success criteria, and phase gates

## Ignore

- **scratch.md** — Personal scratchpad. Not project documentation. Do not read.

## Reference Documents (Background Research)

Located in `docs/reference/`:

- **overview-youtube.md** — Brother Chidananda's announcement of the portal (YouTube transcript)
- **SRF Teaching Portal Research & Design (Gemini 3 Pro).md** — Comprehensive theological, pedagogical, and technical analysis
- **SRF Tech Stack Brief-3.md** — SRF's established technology stack (AWS, Vercel, Contentful, Neon, Auth0, etc.)

## Critical Design Constraints

1. **Direct quotes only.** The AI is a librarian, not an oracle. It finds and ranks Yogananda's verbatim words — it NEVER generates, paraphrases, or synthesizes content. (ADR-001)
2. **Sacred text fidelity.** Every displayed passage must include book, chapter, and page citation. No orphaned quotes. AI translation of Yogananda's words is never acceptable — only official SRF/YSS translations. (ADR-075, ADR-078)
3. **Calm Technology.** No gamification, no aggressive notifications, no dopamine loops. Warm cream backgrounds, serif typography, generous whitespace.
4. **SRF Lessons are out of scope (with future readiness).** The private home-study lessons and Kriya Yoga techniques are explicitly excluded from this portal. The architecture supports future Lessons integration for authorized students via content-level access control (ADR-085), but no Lessons code ships in any current phase.
5. **API-first architecture.** All business logic in `/lib/services/`. API routes use `/api/v1/` prefix. All routes public (no auth until Phase 15+). Cursor-based pagination. (ADR-011)
6. **DELTA-compliant analytics.** No user identification, no session tracking, no behavioral profiling. Amplitude event allowlist only. (ADR-095)
7. **Multilingual from the foundation.** Every content table carries a `language` column from the first migration. Every content API accepts a `language` parameter. The embedding model is multilingual by explicit requirement. UI strings are externalized, CSS uses logical properties, and the schema includes cross-language linking. Phase 1 is English-only but the architecture is locale-ready — adding a new language should require zero schema migrations, zero API changes, and zero search rewrites. (ADR-075, ADR-076, ADR-077, ADR-078)
8. **Accessibility from Phase 2.** WCAG 2.1 AA from the first component. Semantic HTML, ARIA landmarks, keyboard navigation, screen reader support, 44×44px touch targets, `prefers-reduced-motion`. Performance budgets serve seekers on 3G in rural India (< 100KB JS, FCP < 1.5s). axe-core in CI — accessibility violations block merges. Phase 12 is the audit, not the introduction. (ADR-003)
9. **Global Equity.** One product, complete at every level — Bihar to San Francisco, neither a compromised version of the other. Performance budgets, device diversity, progressive enhancement, and data-cost awareness serve this commitment. When a feature proposal seems to conflict, the response is "and how does the base experience work?" — not "we can't do that." (ADR-006)
10. **Human review as mandatory gate.** No user-facing content reaches seekers without human verification. Auto-tagged themes, AI-drafted translations, generated social assets — all require human approval before publication. AI proposes, humans approve. (ADR-078, ADR-032, ADR-005)
11. **Signpost, not destination.** The portal points toward deeper SRF practice (Lessons, centers, app, meditation) without tracking conversions or acting as a sales funnel. No engagement metrics that optimize for screen time. No "sign up to access" gates. All content freely available.
12. **Content availability honesty.** The portal is transparent about what it has. No machine-translated substitutes. English fallback always marked `[EN]`. No fabricated results. If a book isn't available in a language, it isn't listed. Honest about scope, not apologetic about it.
13. **10-year architecture horizon.** Data in PostgreSQL, business logic framework-agnostic in `/lib/services/`, migrations in raw SQL, dependencies treated as commitments. Every decision evaluated for a decade of maintainability, not just launch convenience. Single-database architecture (Neon only, no DynamoDB) — simplicity over ecosystem conformity. (ADR-004, ADR-013)

## Quick Reference

**Core stack:** Next.js on Vercel, Neon PostgreSQL + pgvector, Claude Haiku via AWS Bedrock (librarian — never generates content; ADR-014), OpenAI text-embedding-3-small, Contentful (Phase 10+), dbmate migrations, Terraform IaC. See DESIGN.md for the full tech stack.

**Code layout:**
```
/lib/services/ — Business logic (framework-agnostic TypeScript)
/lib/mcp/ — MCP server (three-tier corpus access layer, ADR-101)
/lib/logger.ts — Structured JSON logging
/app/ — Next.js Server Components + Route Handlers
/app/api/v1/ — Versioned API routes
/migrations/ — Numbered SQL migrations (dbmate)
/terraform/ — Infrastructure as Code
/lambda/ — AWS Lambda handlers (Phase 3+, ADR-017)
/messages/ — Locale JSON files (next-intl)
/scripts/ — CI-agnostic deployment scripts
/docs/reference/ — Background research (not active project docs)
/docs/operational/ — Operational playbook (Phase 5+: procedures for editorial, ingestion, VLD)
```

**Design tokens:** Merriweather + Lora + Open Sans. SRF Gold `#dcbd23`, SRF Navy `#1a2744`, Warm Cream `#FAF8F5`. Full palette in DESIGN.md § Visual Identity.

**MCP servers:** Neon (now), Sentry (Phase 1), Contentful (Phase 10+), SRF Corpus (custom three-tier: development Phase 1, internal editorial Phase 5, external distribution Phase 9; ADR-101). Details in DESIGN.md § MCP Server Strategy.

## Identifier Conventions

**ADR-NNN** (Architecture Decision Records) — 101 decisions in DECISIONS.md (ADR-001 through ADR-101), organized into 11 topical groups: Foundational Constraints, Architecture & Platform, Content & Data Model, Search & AI, Cross-Media, Seeker Experience, Internationalization, Staff & Community, Brand & Communications, Operations & Engineering, Governance. New ADRs append after ADR-101. Header format: `## ADR-NNN: Title`.

**DES-NNN** (Design Sections) — 49 sections in DESIGN.md (DES-001 through DES-049), numbered by document order. Sections without an ADR governance reference get DES identifiers. Sections governed by active ADRs use `## ADR-NNN: Title` headers instead. Header format: `## DES-NNN: Title`, `### DES-NNN: Title`, or `#### DES-NNN: Title` (level reflects nesting depth).

When referencing identifiers in prose, use the prefix form: `ADR-017`, `DES-003`. Always zero-pad to three digits.

## Document Maintenance

Five documents. Keep them accurate as you work — drift compounds across sessions. (ADR-098)

| When this happens... | ...update these documents |
|----------------------|--------------------------|
| New decision made | Add ADR to DECISIONS.md and update the domain index at top of file |
| Open question resolved | Move from "Open Questions" to "Resolved Questions" in CONTEXT.md |
| Open question added | Add to CONTEXT.md § Open Questions (Technical or Stakeholder). Cross-reference from relevant DESIGN.md section if applicable. |
| Phase deliverable changed | Update ROADMAP.md deliverable table and success criteria |
| Phase status changes | Update "Current State" section in CONTEXT.md |
| New technology adopted | Update DESIGN.md tech stack table |
| Code directory added | Update DESIGN.md code organization section |
| Cross-cutting concern changed (multilingual, accessibility, DELTA, editorial proximity) | Update CONTEXT.md principle statement, affected DESIGN.md sections, and relevant ADRs |
| New content type added | DESIGN.md § Data Model + relevant API section, ROADMAP.md phase deliverables, new ADR. **Also:** update DESIGN.md § Knowledge Graph node/edge types, add graph evolution deliverable to relevant ROADMAP phase, and address the ADR-062 content-type integration checklist (node shape/color, edge types, JSON schema, Lambda update, phase timing). |
| New staff/organizational role identified | Update DESIGN.md § Staff & Organizational Personas, CONTEXT.md § Operational Staffing. If the role needs Auth0 access, update DESIGN.md § Auth0 Roles. |
| New AI-assisted workflow added | Update DESIGN.md § AI-Assisted Editorial Workflows. Ensure the workflow follows the "AI proposes, humans approve" pattern. |
| New editorial review queue type | Update DESIGN.md § Unified Review Queue Abstraction, add to Phase Delivery table, update operational playbook. |
| Design section fully implemented | Add `**Status: Implemented** — see [code path]` at top of DESIGN.md section |
| Reference document added or obsoleted | Update this file's § Reference Documents list |

## Documentation–Code Transition

Once implementation begins, DESIGN.md sections transition from "authoritative spec" to "architectural reference":

1. **Before code exists:** DESIGN.md is the source of truth. Follow it precisely.
2. **When a section is implemented:** Add `**Status: Implemented** — see [code path]` at the top. Code becomes the source of truth for implementation details; DESIGN.md remains the architectural rationale.
3. **When implementation diverges from design:** Update DESIGN.md to reflect the actual decision. DESIGN.md is a living document, not a historical artifact.
4. **Section-level change tracking:** When substantially revising a section, add `*Section revised: [date], [reason or ADR]*` at the section's end.

DECISIONS.md ADR content is immutable once accepted. Decisions are superseded (new ADR) or withdrawn (with explanation). ADR numbers and ordering may be restructured for readability, but the substance of each decision is never silently changed.

*Last updated: 2026-02-21*
