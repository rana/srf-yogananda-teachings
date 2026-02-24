# SRF Online Teachings Portal

A world-class online teachings portal to make Paramahansa Yogananda's published books freely accessible worldwide, with AI-powered intelligent search. Funded by a philanthropist's endowment and built in collaboration with Self-Realization Fellowship's Audience Engagement team. Targeting late 2026 launch.

## The Mission

A British philanthropist asked SRF a simple question: *"What can we do to help make Paramahansa Yogananda's books available freely throughout the world?"* This portal is the answer.

"Available" means more than accessible — it means **findable at the moment of need.** A person unable to sleep at 2 AM because of anxiety doesn't know Yogananda wrote specifically about overcoming fear. Someone going through loss doesn't know there are passages on the eternal life of the soul. The portal bridges that gap: seekers describe what they're experiencing, and the portal finds Yogananda's own words that speak to it — verbatim, with full citations, never paraphrased or AI-generated.

## What It Does

- **Intelligent search across Yogananda's full library** — hybrid semantic + full-text search that understands conceptual queries ("How do I find inner peace?") and returns ranked verbatim passages with book, chapter, and page citations
- **Life-theme navigation ("Doors of Entry")** — curated thematic entry points (Peace, Courage, Healing, Joy, Purpose, Love) so seekers can explore without formulating a query
- **Today's Wisdom** — a different Yogananda passage on each visit, creating a living homepage
- **The Quiet Corner** — a micro-sanctuary with a single affirmation and optional gentle timer, for the moment of immediate need
- **Full book reader** — chapter-by-chapter reading with contemplative typography, Related Teachings cross-references across books, keyboard-first navigation, and contextual Quiet Corner for in-reader practice
- **Living Glossary** — user-facing spiritual terminology with inline reader highlighting and Yogananda's own definitions as verbatim passages
- **Editorial Reading Threads** — curated cross-book pathways ("Teachings in Conversation") connecting related passages across Yogananda's works
- **Sacred Places** — contemplative geography of SRF/YSS properties and biographical sites from Yogananda's life, cross-referenced with book passages
- **Self-Realization Magazine** — magazine archives as a primary content type, with Yogananda's articles fully searchable alongside book passages
- **"What Is Humanity Seeking?"** — a public-facing, contemplative dashboard visualizing anonymized global search themes ("Right now, the world is seeking peace...")
- **Study Workspace** — PDF export, presentation mode, and study guides for individual and group use
- **Calendar reading journeys** — structured multi-day experiences ("40 Days with Yogananda") delivered via daily email
- **Knowledge graph** — interactive visual map of the teaching corpus showing cross-book connections, themes, persons, and scriptures
- **The Spiritual Guide** — life-situation and worldview-sensitive entry pathways for seekers who don't know where to begin
- **Community collections** — public curation by Voluntary League of Devotees (VLD) members, with editorial review
- **Multi-language support** — architecture designed from day one to serve official SRF/YSS translations in all available languages
- **Cross-media search** (later phases) — video talks, audio recordings, and photographs searchable alongside book text through a unified content hub

## Design Principles

The portal is a **librarian, not an oracle** — it finds and ranks Yogananda's verbatim words but never generates, paraphrases, or synthesizes content. Every passage includes its citation. AI proposes, humans approve.

The design follows **Calm Technology** principles: no gamification, no dopamine loops, no aggressive notifications. Warm cream backgrounds, serif typography, generous whitespace. The portal encourages seekers to put down the device and practice — it is a **signpost to deeper SRF practice**, not a destination that captures screen time.

All content is freely accessible. No sign-up gates. No conversion tracking. No behavioral profiling. Analytics follow the DELTA faith-based AI ethics framework (Dignity, Embodiment, Love, Transcendence, Agency).

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js on Vercel |
| Database | Neon PostgreSQL + pgvector + pg_search/ParadeDB (hybrid vector + BM25 full-text search) |
| AI | Claude Haiku via AWS Bedrock (query expansion, passage ranking, intent classification — never content generation) |
| Embeddings | Voyage voyage-3-large (multilingual, 1024 dimensions) (ADR-118) |
| Reranking | Cohere Rerank 3.5 (Phase 2+) (ADR-119) |
| Graph | Postgres-native + Python/NetworkX batch pipeline (Phase 4+) (ADR-117) |
| Cache | Redis/ElastiCache (suggestions, Phase 2+) (ADR-120) |
| Language detection | fastText (per-query, < 1ms) |
| CMS | Contentful (Phase 9+) |
| Auth | Auth0 (Phase 13+) |
| Edge/CDN | Cloudflare |
| Video | YouTube RSS + Data API v3, Vimeo (platform-agnostic) |
| IaC | Terraform |
| Migrations | dbmate (raw SQL) |
| Monitoring | Sentry, New Relic |
| Analytics | Amplitude (DELTA-compliant event allowlist) |

Business logic lives in `/lib/services/` (framework-agnostic TypeScript). A three-tier MCP server strategy (ADR-101) provides corpus access at development, editorial, and external distribution layers. The architecture is designed for a **10-year maintenance horizon**: data in PostgreSQL, migrations in raw SQL, dependencies treated as commitments.

## Phasing

The project is planned across 15 capability-themed phases (0a–14), each delivering a single coherent capability. Reorganized from the original 18-phase plan via ADR-103 — merging small phases, splitting oversized ones, and aligning engineering infrastructure with the phases that need it.

| Phase | Name | Focus |
|-------|------|-------|
| **0a** | Prove | Single-book search proof — repo setup, Neon provisioning, PDF ingestion, *Autobiography of a Yogi*, hybrid search API + UI, basic reader, search quality evaluation (ADR-113) |
| **0b** | Foundation | Deploy + AI librarian layer — Vercel/Sentry config, query expansion, intent classification, passage ranking, homepage, observability, MCP server (ADR-113) |
| **1** | Build | Complete portal + engineering — all pages, SRF visual identity, accessibility, i18n infrastructure, testing, Terraform, Storybook |
| **2** | Read | Reader experience — dwell contemplation mode, keyboard nav, bookmarks, typography, offline caching |
| **3** | Grow | Multi-book corpus — first-wave books, cross-book search, Today's Wisdom pool, batch Lambda |
| **4** | Operate | Editorial operations — theme tagging, Doors of Entry, editorial review portal, glossary, practice bridge, operational playbook |
| **5** | Connect | Related Teachings — cross-book connections, reader side panel, editorial threads |
| **6** | Complete | Full library — remaining books, verse-aware chunking, observability, "What Is Humanity Seeking?" dashboard, knowledge graph |
| **7** | Empower | Reader export & staff tools — PDF downloads, presentation mode, study guides, magazine integration, study circle sharing |
| **8** | Distribute | Distribution & outreach — daily email, social media assets, Sacred Places, RSS, WhatsApp, calendar reading journeys |
| **9** | Integrate | Contentful integration — CMS as editorial source of truth, GitLab migration |
| **10** | Translate | Multi-language — official SRF/YSS translations in 8+ languages |
| **11** | Polish | Accessibility audit & polish — formal WCAG audit, PWA, Calm Technology design system |
| **12** | Multimedia | Cross-media — video catalog, transcription, audio library, photograph gallery, YSS branding |
| **13** | Personalize | User accounts — optional sign-in for bookmarks sync, reading progress, personalized daily passage |
| **14** | Community | Community & events — event calendar, center discovery, community curation, SMS/Telegram access |

## Current Status

**Design complete. Ready to begin Phase 0a (Prove).**

This repository contains comprehensive design documentation across twelve files, produced using Claude Code. See CLAUDE.md for the full navigation guide.

- [PRINCIPLES.md](PRINCIPLES.md) — 11 immutable commitments that define the project, with rationale
- [CONTEXT.md](CONTEXT.md) — Project background, mission, stakeholders, theological constraints, SRF ecosystem
- [DESIGN.md](DESIGN.md) — Technical architecture split across four files by phase (DESIGN.md + DESIGN-phase0.md, DESIGN-phase1-4.md, DESIGN-phase5-plus.md)
- [DECISIONS.md](DECISIONS.md) — 123 Architecture Decision Records split across three files by concern (DECISIONS-core.md, DECISIONS-experience.md, DECISIONS-operations.md)
- [ROADMAP.md](ROADMAP.md) — 15 phases (0a–14) with deliverables, success criteria, and phase gates
