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
| Reranking | Cohere Rerank 3.5 (Milestone 2b+) (ADR-119) |
| Graph | Postgres-native + Python/NetworkX batch pipeline (Milestone 3b+) (ADR-117) |
| Cache | Redis/ElastiCache (suggestions, Milestone 2b+) (ADR-120) |
| Language detection | fastText (per-query, < 1ms) |
| CMS | Contentful (Arc 1+) |
| Auth | Auth0 (Milestone 7a+) |
| Edge/CDN | Cloudflare |
| Video | YouTube RSS + Data API v3, Vimeo (platform-agnostic) |
| IaC | Terraform |
| Migrations | dbmate (raw SQL) |
| Monitoring | Sentry, New Relic |
| Analytics | Amplitude (DELTA-compliant event allowlist) |

Business logic lives in `/lib/services/` (framework-agnostic TypeScript). A three-tier MCP server strategy (ADR-101) provides corpus access at development, editorial, and external distribution layers. The architecture is designed for a **10-year maintenance horizon**: data in PostgreSQL, migrations in raw SQL, dependencies treated as commitments.

## Roadmap

The project is planned across 7 thematic arcs, each delivering a coherent narrative increment. Consolidated from 15 capability-themed phases for stakeholder clarity and spiritual narrative coherence.

| Arc | Theme | Focus |
|-----|-------|-------|
| **1: Foundation** | Proving the Light | Ingest one book, prove semantic search works, deploy with AI librarian (Milestones 1a/1b) |
| **2: Presence** | The Living Library | All pages, reading experience, accessibility, design system, PWA (Milestones 2a/2b) |
| **3: Wisdom** | Expanding Understanding | Multi-book library, editorial operations, cross-book intelligence, full corpus (Milestones 3a–3d) |
| **4: Service** | Tools for Devotion | Study tools, PDF export, magazine, Contentful Custom Apps, GitLab |
| **5: Reach** | Every Seeker, Everywhere | Email, social, messaging, regional distribution, 10 languages (Milestones 5a/5b) |
| **6: Media** | All Paths to Truth | Video, audio, images, cross-media hub, Cosmic Chants |
| **7: Community** | Shared Journey | Optional accounts, events, study circles, VLD curation (Milestones 7a/7b) |

## Current Status

**Design complete. Ready to begin Milestone 1a (Prove) in Arc 1: Foundation.**

This repository contains comprehensive design documentation across thirteen files, produced using Claude Code. See CLAUDE.md for the full navigation guide.

- [PRINCIPLES.md](PRINCIPLES.md) — 11 immutable commitments that define the project, with rationale
- [CONTEXT.md](CONTEXT.md) — Project background, mission, stakeholders, theological constraints, SRF ecosystem
- [DESIGN.md](DESIGN.md) — Technical architecture split across four files by arc (DESIGN.md + DESIGN-arc1.md, DESIGN-arc2-3.md, DESIGN-arc4-plus.md)
- [DECISIONS.md](DECISIONS.md) — 118 Architecture Decision Records split across three files by concern (DECISIONS-core.md, DECISIONS-experience.md, DECISIONS-operations.md)
- [ROADMAP.md](ROADMAP.md) — 7 thematic arcs with milestones, deliverables, success criteria, and arc gates
