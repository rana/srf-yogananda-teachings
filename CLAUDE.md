# SRF Online Teachings Portal — AI Context

## What This Project Is

A free, world-class online teachings portal for Self-Realization Fellowship (SRF) to make Paramahansa Yogananda's published books freely accessible worldwide, with an AI-powered intelligent search tool. Funded by a philanthropist. Launching late 2026.

## Read These Files (In Order)

1. **CONTEXT.md** — Project background, mission, stakeholders, theological constraints, SRF ecosystem
2. **DESIGN.md** — Technical architecture, data model, content pipeline, UI design tokens, YouTube integration, API design, observability, testing, design tooling
3. **DECISIONS.md** — Architecture Decision Records (ADRs 001–090, excluding removed ADR-010) with full rationale for every major choice
4. **ROADMAP.md** — 16 phases from foundation through community features, with deliverables and success criteria

## Reference Documents (Background Research)

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
12. **10-year architecture horizon.** Data in PostgreSQL, business logic framework-agnostic in `/lib/services/`, migrations in raw SQL, dependencies treated as commitments. Every decision evaluated for a decade of maintainability, not just launch convenience. (ADR-033)

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js on Vercel |
| Database | Neon PostgreSQL + pgvector (vector + full-text hybrid search) |
| AI (librarian) | Claude API — Finding: query expansion, passage ranking, intent classification, terminology bridge. Classifying: theme tags, accessibility level, tone, relation types, ingestion QA, search eval. Drafting: UI translations, social captions, alt text. Never generates or paraphrases Yogananda's words. (ADR-003, ADR-049) |
| Embeddings | OpenAI text-embedding-3-small |
| Video | YouTube RSS (free) + YouTube Data API v3 |
| Audio hosting | S3 + CloudFront (streaming, Phase 14 — ADR-078) |
| Audio transcription | OpenAI Whisper via Lambda → human review (ADR-078) |
| CMS (production) | Contentful (editorial source of truth → webhook sync → Neon search index) + Custom Apps (sidebar panels) |
| Staff tools | Editorial Review Portal (`/admin`, Auth0-protected, calm design system) for review/approval workflows. Retool for AE technical operations. (ADR-064) |
| Testing | Vitest + Playwright + axe-core + Lighthouse CI |
| Error tracking | Sentry |
| APM | New Relic (Phase 7) |
| Analytics | Amplitude (DELTA-compliant, Phase 7) + Vercel Analytics |
| Batch compute | AWS Lambda + Serverless Framework v4 (book ingestion, backup, email, webhooks — ADR-065) |
| Backup | S3 (nightly pg_dump, 90-day retention — ADR-072) |
| PDF generation | `@react-pdf/renderer` — pre-rendered (S3/CloudFront) for books/transcripts, dynamic (Lambda) for outlines/passages (ADR-083) |
| Redundancy | Single-region origin + global edge (Phases 1–9), Neon read replicas + S3 CRR (Phase 10+ — ADR-082) |
| Machine access | JSON-LD, `llms.txt`, XML sitemaps, RSS feeds, OpenAPI spec, crawler-tier rate limits (ADR-084) |
| Messaging channels | WhatsApp Business API (Phase 9), SMS gateway (Phase 16), Telegram bot (Phase 16) — all via shared messaging Lambda (ADR-085) |
| Images | S3 + CloudFront, `image_descriptions` embedded for vector search, sacred artifact treatment for Yogananda photographs (ADR-086) |
| Cross-media | Unified content hub (`content_items`) for cross-media search, relations, theming, place connections. Introduced at Phase 13. Phases 1–7 use `chunk_relations` directly. (ADR-087) |
| Video platforms | YouTube + Vimeo + self-hosted. Platform-agnostic `videos` table with `integration_level` (full/linked). Documentary support with speaker diarization. (ADR-088) |
| IaC | Terraform (SRF standard) |
| Migrations | dbmate (SQL-based) |
| Design | Figma (free tier → Professional at Phase 12) |
| Maps (Phase 12) | No embedded map — Street View outbound links (ADR-047) |
| SCM | GitHub (Phases 1–9) → GitLab (Phase 10+, SRF IDP) |
| CI/CD | GitHub Actions (Phases 1–9) → GitLab CI (Phase 10+) |
| Fonts | Google Fonts: Merriweather, Lora, Open Sans |
| Colors | SRF Gold #dcbd23, SRF Orange #de6a10, SRF Navy #1a2744, SRF Blue #0274be (focus states), Warm Cream #FAF8F5 |

## Code Organization

```
/lib/services/       — Business logic (pure TypeScript, no framework dependency)
/lib/logger.ts       — Structured JSON logging
/app/                — Next.js Server Components + Route Handlers
/app/api/v1/         — Versioned API routes
/app/admin/          — Editorial review portal (Auth0-protected, Phase 5+)
/app/prepare/        — Talk Preparation Workspace (Auth0-protected, Phase 8+)
/app/audio/          — Audio library and player (Phase 14+)
/app/images/         — Image gallery and detail pages (Phase 14+)
/messages/           — Locale JSON files (next-intl)
/migrations/         — Numbered SQL migrations (dbmate)
/terraform/          — Infrastructure as Code (Neon, Vercel, Sentry, backup modules)
/serverless/         — AWS Lambda functions (batch ingestion, backup, email — ADR-065)
/scripts/            — CI-agnostic deployment scripts (ADR-070)
/tokens.json         — Figma design tokens → tailwind.config.ts
```

## Current Status

**Phase: Design complete. Ready to begin Phase 1 implementation.**

The project has 16 phases. Three monolithic phases have been decomposed into focused pairs: Phase 3 splits into engineering infrastructure (3) and reader experience (4); Phase 7 splits into reader export & staff tools (8) and distribution & outreach (9); Phase 11 splits into video intelligence & content hub (13) and audio, images & branding (14).

- **Phase 1 — Prove the Search** (12 deliverables): Schema (with edition tracking, content-hash deep links), ingestion, search API, search UI, basic reader, minimal homepage, observability, search quality evaluation, rate limiting (with crawler tiers + robots.txt — ADR-084)
- **Phase 2 — The Complete Portal** (12 deliverables): Full homepage, library, Quiet Corner, about, nav/footer, sharing (native share API + file size display), SEO + machine access (JSON-LD, llms.txt, sitemaps — ADR-084), accessibility, i18n infrastructure, print, text-only mode, service worker
- **Phase 3 — Engineering Infrastructure** (6 deliverables): Testing infrastructure, Terraform + S3 backup + CI-agnostic scripts, Figma, Storybook, KaiOS CI, OpenAPI spec (ADR-084)
- **Phase 4 — Reader Experience** (6 deliverables): Dwell mode, keyboard nav, bookmarks, typography refinements, reading time + scroll + settings, last-read chapter caching
- **Phase 5 — Multi-Book Expansion & Themes** (12 deliverables): First-wave books, theme tagging, Doors of Entry, Today's Wisdom expansion, cross-book search, editorial review portal, Lambda for batch workloads, early impact view
- **Phase 6 — Related Teachings & Reader Intelligence** (10 deliverables): Chunk relations, related content API, reader side panel, editorial cross-references, ephemeral reading highlights, editorial threads, reverse bibliography, exploration themes, proactive caching
- **Phase 7 — Completing the Library & Observability** (8 deliverables): Remaining book waves, verse-aware chunking, Amplitude, New Relic, edge latency audit, side-by-side commentary view, search theme aggregation
- **Phase 8 — Reader Export & Staff Tools** (4 deliverables): Chapter/book PDF downloads, presentation mode, study guide view, Talk Preparation Workspace (ADR-077)
- **Phase 9 — Distribution & Outreach** (7 deliverables): Daily email, social media assets, events, Sacred Places, social media review workflow, RSS feeds, WhatsApp Business API (ADR-085)
- **Phase 10 — Contentful Integration** (9 deliverables): Contentful CMS migration, webhook sync, GitLab migration, Terraform expansion, regional distribution (ADR-080, ADR-082)
- **Phase 11 — Multi-Language Support** (14 deliverables): Western + Indian language waves, per-language search, cross-language alignment, per-language perf budgets, translation review UI, impact dashboard
- **Phase 12 — Accessibility Audit & Polish** (12 deliverables): Calm Technology design system, formal WCAG audit, circadian reading, breath between chapters, opening moment, PWA, ambiance toggle, Sacred Places biographical sites
- **Phase 13 — Video Intelligence & Content Hub** (8 deliverables): Platform-agnostic video catalog (ADR-088), YouTube transcript ingestion, cross-media search (books + video), unified content hub migration (ADR-087)
- **Phase 14 — Audio, Images & Branding** (8 deliverables): Audio library (ADR-078), image ingestion + gallery (ADR-086), multi-media editorial threads (ADR-089), YSS branding, transcript PDFs
- **Phase 15 — User Accounts & Personalization** (6 deliverables): Optional auth, bookmarks sync, reading progress, personalized daily passage + email
- **Phase 16 — Community & Events** (8 deliverables): Event calendar, center discovery, SMS gateway, Telegram bot, USSD/IVR exploration, annual "What Is Humanity Seeking?" report (ADR-085)

## Available MCP Servers (ADR-090)

- **Neon MCP** — database operations, schema management, migration testing (available now, essential)
- **Sentry MCP** — error investigation, stack traces, breadcrumbs (add at Phase 1, essential)
- **Contentful MCP** — content model queries, entry management (add at Phase 10+, high value)
- **SRF Corpus MCP** — search the book corpus during development (custom, build in Phase 1)
- See DESIGN.md § MCP Server Strategy for full evaluation of all services
