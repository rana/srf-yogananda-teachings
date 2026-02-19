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
- **Full book reader** — chapter-by-chapter reading with contemplative typography, Related Teachings cross-references across books, and keyboard-first navigation
- **Multi-language support** — architecture designed from day one to serve official SRF/YSS translations in all available languages
- **Cross-media search** (later phases) — monastic How-to-Live talks from YouTube, transcribed and searchable alongside book text

## Design Principles

The portal is a **librarian, not an oracle** — it finds and ranks Yogananda's verbatim words but never generates, paraphrases, or synthesizes content. Every passage includes its citation. AI proposes, humans approve.

The design follows **Calm Technology** principles: no gamification, no dopamine loops, no aggressive notifications. Warm cream backgrounds, serif typography, generous whitespace. The portal encourages seekers to put down the device and practice — it is a **signpost to deeper SRF practice**, not a destination that captures screen time.

All content is freely accessible. No sign-up gates. No conversion tracking. No behavioral profiling. Analytics follow the DELTA faith-based AI ethics framework (Dignity, Embodiment, Love, Transcendence, Agency).

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js on Vercel |
| Database | Neon PostgreSQL + pgvector (hybrid vector + full-text search) |
| AI | Claude API (query expansion, passage ranking, intent classification — never content generation) |
| Embeddings | OpenAI text-embedding-3-small (multilingual) |
| CMS | Contentful (Phase 8+) |
| Video | YouTube RSS + Data API v3 |

Business logic lives in `/lib/services/` (framework-agnostic TypeScript). The architecture is designed for a **10-year maintenance horizon**: data in PostgreSQL, migrations in raw SQL, dependencies treated as commitments.

## Phasing

The project is planned across 13 phases, each delivering a working increment:

| Phase | Focus |
|-------|-------|
| **1** | Prove the search — single book (*Autobiography of a Yogi*), search API + UI, basic reader |
| **2** | Complete portal — all pages, SRF visual identity, accessibility, i18n infrastructure, sharing |
| **3** | Engineering foundation — testing, Terraform, Figma, reader interactions (dwell mode, bookmarks, keyboard nav) |
| **4** | Multi-book expansion — first-wave books, theme tagging, editorial review portal |
| **5** | Related Teachings — cross-book connections, reader side panel, reading threads |
| **6** | Full library — remaining books, verse-aware chunking, production observability |
| **7** | Outreach — daily email, social media assets, Sacred Places, PDF downloads |
| **8** | Contentful integration — CMS as editorial source of truth, GitLab migration |
| **9** | Multi-language — official translations in 8+ languages |
| **10** | Accessibility audit — formal WCAG audit, PWA, design system, contemplative polish |
| **11** | Cross-media search — video transcription, unified book + video search |
| **12** | User accounts — optional sign-in for bookmarks, reading progress, personalized daily passage |
| **13** | Community — event calendar, meditation center discovery |

## Current Status

**Design complete. Ready to begin Phase 1 implementation.**

This repository contains comprehensive design documentation produced using Claude Code:

- [CONTEXT.md](CONTEXT.md) — Project background, mission, stakeholders, theological constraints, SRF ecosystem
- [DESIGN.md](DESIGN.md) — Technical architecture, data model, content pipeline, UI design tokens, API design
- [DECISIONS.md](DECISIONS.md) — 63 Architecture Decision Records with full rationale
- [ROADMAP.md](ROADMAP.md) — 13 phases with deliverables and success criteria
