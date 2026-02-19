# SRF Online Teachings Portal — AI Context

## What This Project Is

A free, world-class online teachings portal for Self-Realization Fellowship (SRF) to make Paramahansa Yogananda's published books freely accessible worldwide, with an AI-powered intelligent search tool. Funded by a philanthropist. Launching late 2026.

## Read These Files (In Order)

1. **CONTEXT.md** — Project background, mission, stakeholders, theological constraints, SRF ecosystem
2. **DESIGN.md** — Technical architecture, data model, content pipeline, UI design tokens, YouTube integration, API design, observability, testing, design tooling
3. **DECISIONS.md** — Architecture Decision Records (ADRs 001–064, excluding removed ADR-010) with full rationale for every major choice
4. **ROADMAP.md** — 13 phases from foundation through community features, with deliverables and success criteria

## Reference Documents (Background Research)

- **overview-youtube.md** — Brother Chidananda's announcement of the portal (YouTube transcript)
- **SRF Teaching Portal Research & Design (Gemini 3 Pro).md** — Comprehensive theological, pedagogical, and technical analysis
- **SRF Tech Stack Brief-3.md** — SRF's established technology stack (AWS, Vercel, Contentful, Neon, Auth0, etc.)

## Critical Design Constraints

1. **Direct quotes only.** The AI is a librarian, not an oracle. It finds and ranks Yogananda's verbatim words — it NEVER generates, paraphrases, or synthesizes content. (ADR-003)
2. **Sacred text fidelity.** Every displayed passage must include book, chapter, and page citation. No orphaned quotes. AI translation of Yogananda's words is never acceptable — only official SRF/YSS translations. (ADR-020, ADR-023)
3. **Calm Technology.** No gamification, no aggressive notifications, no dopamine loops. Warm cream backgrounds, serif typography, generous whitespace.
4. **SRF Lessons are out of scope.** The private home-study lessons and Kriya Yoga techniques are explicitly excluded from this portal.
5. **API-first architecture.** All business logic in `/lib/services/`. API routes use `/api/v1/` prefix. All routes public (no auth until Phase 12+). Cursor-based pagination. (ADR-024)
6. **DELTA-compliant analytics.** No user identification, no session tracking, no behavioral profiling. Amplitude event allowlist only. (ADR-029)
7. **Multilingual from the foundation.** Every content table carries a `language` column from the first migration. Every content API accepts a `language` parameter. The embedding model is multilingual by explicit requirement. UI strings are externalized, CSS uses logical properties, and the schema includes cross-language linking. Phase 1 is English-only but the architecture is locale-ready — adding a new language should require zero schema migrations, zero API changes, and zero search rewrites. (ADR-020, ADR-021, ADR-022, ADR-023)
8. **Accessibility from Phase 2.** WCAG 2.1 AA from the first component. Semantic HTML, ARIA landmarks, keyboard navigation, screen reader support, 44×44px touch targets, `prefers-reduced-motion`. Performance budgets serve seekers on 3G in rural India (< 100KB JS, FCP < 1.5s). axe-core in CI — accessibility violations block merges. Phase 10 is the audit, not the introduction. (ADR-017)
9. **Human review as mandatory gate.** No user-facing content reaches seekers without human verification. Auto-tagged themes, AI-drafted translations, generated social assets — all require human approval before publication. AI proposes, humans approve. (ADR-023, ADR-048, ADR-049)
10. **Signpost, not destination.** The portal points toward deeper SRF practice (Lessons, centers, app, meditation) without tracking conversions or acting as a sales funnel. No engagement metrics that optimize for screen time. No "sign up to access" gates. All content freely available.
11. **Content availability honesty.** The portal is transparent about what it has. No machine-translated substitutes. English fallback always marked `[EN]`. No fabricated results. If a book isn't available in a language, it isn't listed. Honest about scope, not apologetic about it.
12. **10-year architecture horizon.** Data in PostgreSQL, business logic framework-agnostic in `/lib/services/`, migrations in raw SQL, dependencies treated as commitments. Every decision evaluated for a decade of maintainability, not just launch convenience. (ADR-033)

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js on Vercel |
| Database | Neon PostgreSQL + pgvector (vector + full-text hybrid search) |
| AI (librarian) | Claude API — Finding: query expansion, passage ranking, intent classification, terminology bridge. Classifying: theme tags, accessibility level, tone, relation types, ingestion QA, search eval. Drafting: UI translations, social captions, alt text. Never generates or paraphrases Yogananda's words. (ADR-003, ADR-049) |
| Embeddings | OpenAI text-embedding-3-small |
| Video | YouTube RSS (free) + YouTube Data API v3 |
| CMS (production) | Contentful (editorial source of truth → webhook sync → Neon search index) + Custom Apps (sidebar panels) |
| Staff tools | Editorial Review Portal (`/admin`, Auth0-protected, calm design system) for review/approval workflows. Retool for AE technical operations. (ADR-064) |
| Testing | Vitest + Playwright + axe-core + Lighthouse CI |
| Error tracking | Sentry |
| APM | New Relic (Phase 6) |
| Analytics | Amplitude (DELTA-compliant, Phase 6) + Vercel Analytics |
| IaC | Terraform (SRF standard) |
| Migrations | dbmate (SQL-based) |
| Design | Figma (free tier → Professional at Phase 10) |
| Maps (Phase 10) | No embedded map — Street View outbound links (ADR-047) |
| SCM | GitHub (Phases 1–7) → GitLab (Phase 8+, SRF IDP) |
| CI/CD | GitHub Actions (Phases 1–7) → GitLab CI (Phase 8+) |
| Fonts | Google Fonts: Merriweather, Lora, Open Sans |
| Colors | SRF Gold #dcbd23, SRF Orange #de6a10, SRF Navy #1a2744, SRF Blue #0274be (focus states), Warm Cream #FAF8F5 |

## Code Organization

```
/lib/services/       — Business logic (pure TypeScript, no framework dependency)
/lib/logger.ts       — Structured JSON logging
/app/                — Next.js Server Components + Route Handlers
/app/api/v1/         — Versioned API routes
/app/admin/          — Editorial review portal (Auth0-protected, Phase 4+)
/messages/           — Locale JSON files (next-intl)
/migrations/         — Numbered SQL migrations (dbmate)
/terraform/          — Infrastructure as Code (Neon, Vercel, Sentry modules)
/tokens.json         — Figma design tokens → tailwind.config.ts
```

## Current Status

**Phase: Design complete. Ready to begin Phase 1 implementation.**

The project has 13 phases. The original monolithic Phase 1 has been decomposed into three focused phases, and the original monolithic Phase 4 has been decomposed into four focused phases:

- **Phase 1 — Prove the Search** (11 deliverables): Schema, ingestion, search API, search UI, basic reader, minimal homepage, observability, search quality evaluation
- **Phase 2 — The Complete Portal** (10 deliverables): Full homepage, library, Quiet Corner, about, nav/footer, sharing, SEO, accessibility, i18n infrastructure, print
- **Phase 3 — Engineering Foundation** (8 deliverables): Testing infrastructure, Terraform, Figma, dwell mode, keyboard nav, bookmarks, Storybook, typography refinements
- **Phase 4 — Multi-Book Expansion & Themes** (10 deliverables): First-wave books, theme tagging, Doors of Entry, Today's Wisdom expansion, cross-book search, editorial review portal
- **Phase 5 — Related Teachings & Reader Intelligence** (5 deliverables): Chunk relations, related content API, reader side panel, editorial cross-references
- **Phase 6 — Completing the Library & Observability** (6 deliverables): Remaining book waves, verse-aware chunking, Amplitude, New Relic
- **Phase 7 — Outreach & Content Distribution** (7 deliverables): Daily email, social media assets, events, Sacred Places, chapter/book PDF downloads, presentation mode, social media review workflow
- **Phases 8–13**: Contentful, multi-language, accessibility audit & polish, cross-media search, user accounts, community

## Available MCP Servers

- **Neon MCP** — database operations (available now, use for schema setup)
