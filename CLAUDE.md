# SRF Online Teachings Portal — AI Context

## What This Project Is

A free, world-class online teachings portal for Self-Realization Fellowship (SRF) to make Paramahansa Yogananda's published books freely accessible worldwide, with an AI-powered intelligent search tool. Funded by a philanthropist. Launching late 2026.

## Read These Files (In Order)

1. **CONTEXT.md** — Project background, mission, stakeholders, theological constraints, current state, open questions
2. **DESIGN.md** — Technical architecture, data model, content pipeline, UI design tokens, API design, observability, testing
3. **DECISIONS.md** — Architecture Decision Records (ADRs 001–134, excluding removed ADR-010, withdrawn ADR-053, and superseded ADR-077) with full rationale for every major choice
4. **ROADMAP.md** — 17 phases (0–16) from foundation through community features, with deliverables, success criteria, and phase gates

## Ignore

- **scratch.md** — Personal scratchpad. Not project documentation. Do not read.

## Reference Documents (Background Research)

Located in `docs/reference/`:

- **overview-youtube.md** — Brother Chidananda's announcement of the portal (YouTube transcript)
- **SRF Teaching Portal Research & Design (Gemini 3 Pro).md** — Comprehensive theological, pedagogical, and technical analysis
- **SRF Tech Stack Brief-3.md** — SRF's established technology stack (AWS, Vercel, Contentful, Neon, Auth0, etc.)

## Critical Design Constraints

1. **Direct quotes only.** The AI is a librarian, not an oracle. It finds and ranks Yogananda's verbatim words — it NEVER generates, paraphrases, or synthesizes content. (ADR-003)
2. **Sacred text fidelity.** Every displayed passage must include book, chapter, and page citation. No orphaned quotes. AI translation of Yogananda's words is never acceptable — only official SRF/YSS translations. (ADR-020, ADR-023)
3. **Calm Technology.** No gamification, no aggressive notifications, no dopamine loops. Warm cream backgrounds, serif typography, generous whitespace.
4. **SRF Lessons are out of scope (with future readiness).** The private home-study lessons and Kriya Yoga techniques are explicitly excluded from this portal. The architecture supports future Lessons integration for authorized students via content-level access control (ADR-081), but no Lessons code ships in any current phase.
5. **API-first architecture.** All business logic in `/lib/services/`. API routes use `/api/v1/` prefix. All routes public (no auth until Phase 15+). Cursor-based pagination. (ADR-024)
6. **DELTA-compliant analytics.** No user identification, no session tracking, no behavioral profiling. Amplitude event allowlist only. (ADR-029)
7. **Multilingual from the foundation.** Every content table carries a `language` column from the first migration. Every content API accepts a `language` parameter. The embedding model is multilingual by explicit requirement. UI strings are externalized, CSS uses logical properties, and the schema includes cross-language linking. Phase 1 is English-only but the architecture is locale-ready — adding a new language should require zero schema migrations, zero API changes, and zero search rewrites. (ADR-020, ADR-021, ADR-022, ADR-023)
8. **Accessibility from Phase 2.** WCAG 2.1 AA from the first component. Semantic HTML, ARIA landmarks, keyboard navigation, screen reader support, 44×44px touch targets, `prefers-reduced-motion`. Performance budgets serve seekers on 3G in rural India (< 100KB JS, FCP < 1.5s). axe-core in CI — accessibility violations block merges. Phase 12 is the audit, not the introduction. (ADR-017)
9. **Human review as mandatory gate.** No user-facing content reaches seekers without human verification. Auto-tagged themes, AI-drafted translations, generated social assets — all require human approval before publication. AI proposes, humans approve. (ADR-023, ADR-048, ADR-049)
10. **Signpost, not destination.** The portal points toward deeper SRF practice (Lessons, centers, app, meditation) without tracking conversions or acting as a sales funnel. No engagement metrics that optimize for screen time. No "sign up to access" gates. All content freely available.
11. **Content availability honesty.** The portal is transparent about what it has. No machine-translated substitutes. English fallback always marked `[EN]`. No fabricated results. If a book isn't available in a language, it isn't listed. Honest about scope, not apologetic about it.
12. **10-year architecture horizon.** Data in PostgreSQL, business logic framework-agnostic in `/lib/services/`, migrations in raw SQL, dependencies treated as commitments. Every decision evaluated for a decade of maintainability, not just launch convenience. Single-database architecture (Neon only, no DynamoDB) — simplicity over ecosystem conformity. (ADR-033, ADR-109)

## Quick Reference

**Core stack:** Next.js on Vercel, Neon PostgreSQL + pgvector, Claude Haiku via AWS Bedrock (librarian — never generates content; ADR-110), OpenAI text-embedding-3-small, Contentful (Phase 10+), dbmate migrations, Terraform IaC. See DESIGN.md for the full tech stack.

**Code layout:**
```
/lib/services/    — Business logic (framework-agnostic TypeScript)
/lib/logger.ts    — Structured JSON logging
/app/             — Next.js Server Components + Route Handlers
/app/api/v1/      — Versioned API routes
/migrations/      — Numbered SQL migrations (dbmate)
/terraform/       — Infrastructure as Code
/serverless/      — AWS Lambda functions (Phase 5+)
/messages/        — Locale JSON files (next-intl)
/scripts/         — CI-agnostic deployment scripts
/docs/reference/  — Background research (not active project docs)
```

**Design tokens:** Merriweather + Lora + Open Sans. SRF Gold `#dcbd23`, SRF Navy `#1a2744`, Warm Cream `#FAF8F5`. Full palette in DESIGN.md § Visual Identity.

**MCP servers:** Neon (now), Sentry (Phase 1), Contentful (Phase 10+), SRF Corpus (custom, Phase 1). Details in DESIGN.md § MCP Server Strategy.

## Document Maintenance

Six documents. Keep them accurate as you work — drift compounds across sessions. (ADR-119)

| When this happens... | ...update these documents |
|----------------------|--------------------------|
| New decision made | Add ADR to DECISIONS.md and update the domain index at top of file |
| Open question resolved | Move from "Open Questions" to "Resolved Questions" in CONTEXT.md |
| Open question added | Add to CONTEXT.md § Open Questions (Technical or Stakeholder). Cross-reference from relevant DESIGN.md section if applicable. |
| Phase deliverable changed | Update ROADMAP.md deliverable table and success criteria |
| Phase status changes | Update "Current State" section in CONTEXT.md |
| New technology adopted | Update DESIGN.md tech stack table |
| Code directory added | Update DESIGN.md code organization section |
| Cross-cutting concern changed (multilingual, accessibility, DELTA) | Update CONTEXT.md principle statement, affected DESIGN.md sections, and relevant ADRs |
| New content type added | DESIGN.md § Data Model + relevant API section, ROADMAP.md phase deliverables, new ADR |
| Design section fully implemented | Add `**Status: Implemented** — see [code path]` at top of DESIGN.md section |
| Reference document added or obsoleted | Update this file's § Reference Documents list |

Always update the `Last updated` footer on any modified document.

## Documentation–Code Transition

Once implementation begins, DESIGN.md sections transition from "authoritative spec" to "architectural reference":

1. **Before code exists:** DESIGN.md is the source of truth. Follow it precisely.
2. **When a section is implemented:** Add `**Status: Implemented** — see [code path]` at the top. Code becomes the source of truth for implementation details; DESIGN.md remains the architectural rationale.
3. **When implementation diverges from design:** Update DESIGN.md to reflect the actual decision. DESIGN.md is a living document, not a historical artifact.
4. **Section-level change tracking:** When substantially revising a section, add `*Section revised: [date], [reason or ADR]*` at the section's end.

DECISIONS.md is the exception — ADRs are immutable history. Decisions are superseded (new ADR), withdrawn (with explanation), or removed (number retired). Never silently edited.
