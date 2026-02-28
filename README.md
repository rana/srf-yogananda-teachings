# SRF Online Teachings Portal

A world-class online teachings portal to make Paramahansa Yogananda's published books freely accessible worldwide, with AI-powered intelligent search. Funded by a philanthropist's endowment and built in collaboration with Self-Realization Fellowship's Audience Engagement team. Targeting late 2026 launch.

## The Mission

A British philanthropist asked SRF a simple question: *"What can we do to help make Paramahansa Yogananda's books available freely throughout the world?"* This portal is the answer.

"Available" means more than accessible — it means **findable at the moment of need.** A person unable to sleep at 2 AM because of anxiety doesn't know Yogananda wrote specifically about overcoming fear. Someone going through loss doesn't know there are passages on the eternal life of the soul. The portal bridges that gap: seekers describe what they're experiencing, and the portal finds Yogananda's own words that speak to it — verbatim, with full citations, never paraphrased or AI-generated.

## Arc 1: What We're Proving First

The first arc answers one question: **does semantic search work over Yogananda's text?**

- **Intelligent search** — hybrid semantic + BM25 full-text search that understands conceptual queries ("How do I find inner peace?") and returns ranked verbatim passages with book, chapter, and page citations
- **Book reader** — chapter-by-chapter reading with contemplative typography served from Contentful
- **Search quality evaluation** — 50-query golden set proving retrieval relevance before anything else is built

One book (*Autobiography of a Yogi*). One search API. One reader. If the search returns passages that speak to what seekers are experiencing, everything else follows.

## The Full Vision

Each arc builds on the last. The full portal includes:

- **Life-theme navigation ("Doors of Entry")** — curated thematic entry points (Peace, Courage, Healing, Joy, Purpose, Love) so seekers can explore without formulating a query
- **Today's Wisdom** — a different Yogananda passage on each visit, creating a living homepage
- **The Quiet Corner** — a micro-sanctuary with a single affirmation and optional gentle timer, for the moment of immediate need
- **Full reading experience** — Related Teachings cross-references across books, keyboard-first navigation, contextual Quiet Corner, and contemplative design system
- **Living Glossary** — spiritual terminology with inline reader highlighting and Yogananda's own definitions as verbatim passages
- **Editorial Reading Threads** — curated cross-book pathways ("Teachings in Conversation") connecting related passages across Yogananda's works
- **Sacred Places** — contemplative geography of SRF/YSS properties and biographical sites, cross-referenced with book passages
- **Self-Realization Magazine** — magazine archives fully searchable alongside book passages
- **"What Is Humanity Seeking?"** — contemplative dashboard visualizing anonymized global search themes
- **Study Workspace** — PDF export, presentation mode, and study guides for individual and group use
- **Knowledge graph** — interactive visual map of the teaching corpus showing cross-book connections, themes, persons, and scriptures
- **Multi-language support** — 10 languages, architecture designed from day one to serve official SRF/YSS translations
- **Cross-media search** — video talks, audio recordings, and photographs searchable alongside book text
- **Community collections** — public curation by Voluntary League of Devotees (VLD) members, with editorial review

## Design Principles

The portal is a **librarian, not an oracle** — it finds and ranks Yogananda's verbatim words but never generates, paraphrases, or synthesizes content. Every passage includes its citation. AI proposes, humans approve.

The design follows **Calm Technology** principles: no gamification, no dopamine loops, no aggressive notifications. Warm cream backgrounds, serif typography, generous whitespace. The portal encourages seekers to put down the device and practice — it is a **signpost to deeper SRF practice**, not a destination that captures screen time.

All content is freely accessible. No sign-up gates. No conversion tracking. No behavioral profiling. Analytics follow the DELTA faith-based AI ethics framework (Dignity, Embodiment, Love, Transcendence, Agency).

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js on Vercel |
| Database | Neon PostgreSQL 18 + pgvector + pg_search/ParadeDB (hybrid vector + BM25 full-text search) |
| AI | Claude Haiku via AWS Bedrock (query expansion, passage ranking, intent classification — never content generation) |
| Embeddings | Voyage voyage-3-large (multilingual, 1024 dimensions) (ADR-118) |
| Reranking | Cohere Rerank 3.5 (Milestone 2b+) (ADR-119) |
| Graph | Postgres-native + Python/NetworkX batch pipeline (Milestone 3b+) (ADR-117) |
| Suggestions | Static JSON at CDN edge (Arc 1) + pg_trgm fuzzy fallback; Vercel KV if needed (Milestone 2b+) (ADR-120) |
| Language detection | fastText (per-query, < 1ms) |
| CMS | Contentful (Arc 1+) |
| Auth | Auth0 (Milestone 7a+) |
| Edge/CDN | Vercel (native CDN, Firewall, DDoS) |
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

## How This Project Works

This portal is designed and implemented through AI-human collaboration using [Claude Code](https://claude.ai/code). The human principal directs strategy, stakeholder decisions, and editorial judgment; the AI serves as architect, implementer, and maintainer. The documentation volume is intentional — it serves as institutional memory across AI context windows. See [CONTEXT.md](CONTEXT.md) for the full methodology.

## Documentation

- [PRINCIPLES.md](PRINCIPLES.md) — 12 immutable commitments that define the project
- [CONTEXT.md](CONTEXT.md) — Project background, mission, stakeholders, theological constraints
- [DESIGN.md](DESIGN.md) — Technical architecture across four files by arc scope
- [DECISIONS.md](DECISIONS.md) — 123 Architecture Decision Records across three files by concern
- [PROPOSALS.md](PROPOSALS.md) — Proposal registry for features awaiting scheduling
- [ROADMAP.md](ROADMAP.md) — 7 arcs with milestones, deliverables, and arc gates
