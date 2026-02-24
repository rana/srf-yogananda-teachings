# SRF Online Teachings Portal — Project Context

## Current State

**Phase:** Design complete. Ready to begin Phase 0a (Prove).

**What exists:** Comprehensive design documentation across eleven files — PRINCIPLES.md (11 immutable commitments with rationale), CONTEXT.md (this file), DESIGN.md (cross-cutting architecture, 19 sections) + three phase-scoped design files (DESIGN-phase0.md, DESIGN-phase1-4.md, DESIGN-phase5-plus.md — 56 sections total, DES-001 through DES-056), DECISIONS.md (navigational index with group summaries) + three phase-scoped ADR files (DECISIONS-core.md, DECISIONS-experience.md, DECISIONS-operations.md — 123 ADRs total, ADR-001 through ADR-123), ROADMAP.md (15 phases, 0a–14). Document architecture restructured 2026-02-23: PRINCIPLES.md extracted as always-loaded identity layer; DESIGN.md and DECISIONS.md split by phase for context-window efficiency. RAG Architecture Proposal merged into project documents (2026-02-23). 21 elmer proposals in `.elmer/proposals/` covering 10 topics (themes, features, policy, retrospectives) awaiting dedup and merge into canonical documents. Proposal management skills (`proposal-merge`, `dedup-proposals`, `theme-integrate`) created 2026-02-23. No code yet.

**What's next:** Phase 0a — Prove. Confirm edition + PDF source with SRF, then: repo setup, Neon + schema (pgvector + pg_search), PDF ingestion, human QA, hybrid search API (vector + BM25 via RRF), search UI, book reader, search quality evaluation (50-query golden set). Eight deliverables answering one question: does semantic search work over Yogananda's text? Phase 0b (Foundation) adds entity registry, enrichment prompt design, query intent taxonomy, golden suggestion set, Vercel deployment, AI librarian enhancements, homepage, and observability. See ROADMAP.md for deliverables. (ADR-113)

---

## Project Methodology

This portal is designed and implemented through AI-human collaboration. The human principal directs strategy, makes stakeholder decisions, and provides editorial judgment. The AI (Claude) serves as architect, implementer, and maintainer across sessions. The documentation volume — CLAUDE.md, PRINCIPLES.md, CONTEXT.md, DESIGN.md (+ phase files), DECISIONS.md, and ROADMAP.md — is intentional: it is the project's institutional memory, enabling continuity across AI context windows where no persistent memory exists. Phase-gated reading guidance in CLAUDE.md ensures each session loads only what the task requires.

Roles the AI cannot fill: editorial judgment on sacred text, theological review, SRF stakeholder decisions, community relationship management, and the inner orientation described in the Spiritual Design Principles below. These require human presence and spiritual sensitivity that architecture cannot substitute.

---

## Open Questions

### Tier 1: Blocks Phase 0a (resolve before coding begins)

**Technical**
- [ ] Which edition of Autobiography of a Yogi is the canonical page-number reference? (1946 first edition, 1998 13th edition, or current printing?) All portal citations depend on this. (ADR-034)
- [ ] Optimal chunk size for Yogananda's prose style (test 200, 300, 500 token chunks). (ADR-048)
- [ ] Optimal enrichment prompt structure: test unified enrichment prompt (ADR-115) against 30 actual passages spanning narrative, poetry, dialogue, and technical instruction. Validate consistency of experiential_depth, voice_register, and entity extraction.
- [ ] Edition variance policy: when multiple editions exist with textual variants, which edition is canonical? Single authoritative edition per book, or acknowledge variants? Affects content integrity hashing (ADR-039), citation page numbers, and the meaning of "verbatim." (ADR-001, ADR-034, ADR-039, ADR-007)
- [ ] Phase 0a parameter validation: should success criteria explicitly include evaluating and adjusting magic numbers (RRF k, chunk size, overlap, debounce, cache TTLs) based on first-contact data? (ADR-123)

**Stakeholder**
- [ ] Which books have official translations in which languages? (Content availability matrix — determines what each language's portal experience looks like.) (ADR-075, ADR-077)
- [ ] *God Talks with Arjuna* Devanāgarī content: confirm display of original Devanāgarī Bhagavad Gita verses alongside English commentary. Does SRF have a preferred Devanāgarī typeface, or is Noto Sans Devanagari acceptable? (ADR-080, ADR-048)

### Tier 2: Resolve During Phase 0 (not 0a-specific)

**Technical**
- [ ] fastText vs. alternative language detection for short queries containing Sanskrit terms. Evaluate during Phase 0 search quality testing.
- [ ] Devanāgarī font timing: Phase 1 English corpus contains Devanāgarī in *God Talks with Arjuna*. ADR-080 moves Noto Sans Devanagari to Phase 0. Confirm whether *The Holy Science* also contains Devanāgarī. (ADR-080, ADR-048)
- [ ] Abuse and misuse patterns: extraction at scale, quote weaponization, SEO parasitism. Should the portal include rate limiting tiers, `rel=canonical` enforcement, MCP usage policy, or text watermarking? (ADR-001, ADR-011, ADR-101, ADR-063, ADR-081)

**Stakeholder**
- [ ] Copyright/licensing posture: read-online only, or also downloadable/printable? What attribution is required? (ADR-081)
- [ ] Existing SRF editorial voice guide: does SRF already have brand voice guidelines? The portal should extend them. (ADR-074)
- [ ] SRF editorial policy on contested transliterations: does SRF confirm house style (e.g., "Babaji" vs. "Bābājī") as canonical for all portal display text? (ADR-080, ADR-034)
- [ ] Cross-property content correction coordination: shared content source of truth, or each property maintains its own? (ADR-034, ADR-039)
- [ ] Data controller identity for GDPR: SRF, the foundation, or both? Determines DPA responsibility. (ADR-099)
- [ ] Existing Data Processing Agreements with shared vendors (Auth0, Neon, Vercel, Cloudflare, Sentry, Amplitude). (ADR-099)
- [ ] Self-hosting Google Fonts: does the convocation site already self-host? (ADR-099)
- [ ] What Sentry and New Relic configurations does SRF use across existing properties? (Operational alignment)
- [ ] Young seekers and editorial voice: should the portal explicitly welcome young seekers, or is agelessness the mode of inclusion? (DES-048, ADR-095)
- [ ] Design intent preservation across staff turnover: should a companion document explain *why the portal feels the way it feels*? (ADR-098)
- [ ] Portal updates page posture: visible evolution (`/updates` page) or timeless atmosphere? (ADR-105, ADR-074)
- [ ] Visual design language: should the portal feel timeless or contemporary? The spiritual eye symbolism (navy=infinite blue, gold=divine ring, cream=star-white) is already latent in the palette — how explicitly should it be acknowledged in design documentation and token naming? (DES-006, DES-011)

### Tier 3: Resolve During Phases 0b–2

**Technical**
- [ ] Query expansion prompt engineering (test with diverse query types). (Phase 0b)
- [ ] AWS Bedrock abstraction: thin `/lib/services/claude.ts` supporting both Bedrock and direct Anthropic API for 10-year optionality? (ADR-014, ADR-004)
- [ ] Content-addressable passage deep links: should resolution chain include a semantic/normalized hash tier between exact match and fuzzy search? (ADR-022, ADR-034)
- [ ] IAST diacritics rendering verification: Merriweather and Lora at all font sizes, particularly 15px. Include in Phase 1 design QA. (ADR-080, ADR-003)
- [ ] Circadian content choreography: solar-position awareness vs. fixed clock hours? Browser timezone maps to coordinates for DELTA-compliant calculation. (DES-011, DES-028, ADR-095)
- [ ] Mobile search suggestion UX: fewer suggestions, different trigger on mobile? (ADR-049)

**Stakeholder**
- [ ] SRF temple singing bowl recordings for Quiet Corner audio. (Phase 1)
- [ ] @YoganandaSRF YouTube channel ID and playlist inventory. (Phase 1)
- [ ] About page content: approved biography text for Yogananda and line of gurus? (Phase 1)
- [ ] Who reviews AI-drafted UI translations (~200–300 strings)? (ADR-078)
- [ ] Pastoral care resources: center contacts, counselors for locales where helplines are underserved? (ADR-071)
- [ ] Crisis resource policy: display locale-appropriate helpline information alongside grief content? (ADR-071)
- [ ] Philanthropist success metrics at 12 months. (Shapes analytics/reporting)
- [ ] Editorial governance of curated query suggestions. Same review process as theme tagging? (ADR-049)
- [ ] `/guide` alignment with SRF reading recommendations. (DES-048, DES-026)
- [ ] Worldview pathways: include Muslim/Sufi, agnostic/skeptical entry points? (DES-048)
- [ ] Worldview-sensitive `/guide` pathways: Christian contemplative, Buddhist, science-of-consciousness starting points? (DES-048, ADR-033, DES-027)
- [ ] Practice Bridge: portal-hosted `/about/lessons` page or external links only? (ADR-104)
- [ ] Canonical SRF enrollment URL for all "Learn about SRF Lessons" links. (ADR-104)
- [ ] Practice Bridge editorial tone: SRF-preferred language for contextual note? (ADR-104)
- [ ] SRF newsletter/blog signpost: link to SRF newsletter, or maintain distinction from daily email? (ADR-091, DES-016)
- [ ] Youth and young adult program signposts. (DES-048, DES-022)
- [ ] "Awake" documentary as endorsed entry point / worldview pathway? (DES-048)

### Tier 4: Requires SRF Input Before Phase 4

**Strategic** (from Phase Sizing Analysis, ADR-102)
- [ ] Calendar timeline: what is the assumed team size and velocity? (ADR-102)
- [ ] Minimum lovable product: which phase constitutes "launched" — publicly available to seekers? (ADR-102)
- [ ] Editorial capacity curve: at what phase does the monastic editor's 2–3 hour daily window become insufficient? (ADR-082, ADR-102)

**Technical**
- [ ] Sacred Places fallback hierarchy: ranked array of external links per place rather than Google Street View only? (DES-023, ADR-070)
- [ ] Chant text chunking and embedding quality: evaluate during *Cosmic Chants* ingestion. (ADR-059, ADR-046)

**Stakeholder**
- [ ] Portal-app relationship: complementary or overlapping reader? Will portal search power the app?
- [ ] Hindi/Bengali co-launch timing: Phase 10 or 10a/10b split? Heritage languages after European languages requires explicit rationale. (ADR-077)
- [ ] YSS co-equal or advisory authority over Hindi/Bengali design decisions. (ADR-077, ADR-079)
- [ ] Translated editions: do they preserve paragraph structure? (Critical for cross-language alignment)
- [ ] *Cosmic Chants* canonical volume or family of editions? (ADR-059)
- [ ] Monastic content scope: content *by* vs. *about* monastics. (ADR-036, ADR-037, ADR-001)
- [ ] Living monastic editorial sensitivity: biographical detail level for current monastics. (ADR-037)
- [ ] Presidential succession editorial framing: factual data only, or editorial narrative? (ADR-037)
- [ ] Portal coordinator role ownership: monastic, AE team, or dedicated position? Critical by Phase 4. (ADR-082)
- [ ] Inner orientation for editorial team: devotional service, professional positions, or both?
- [ ] Monastic content editor's current digital workflow. (ADR-082)
- [ ] Seasonal editorial calendar ownership. (DES-028, ADR-082)
- [ ] Feature request governance model over a decade. (ADR-082, ADR-098)
- [ ] Editorial intent preservation: should editorial decisions carry brief rationale notes? (ADR-032, ADR-098, ADR-007)
- [ ] Virtual pilgrimage tour URLs and availability. (ADR-069, DES-023)

### Phase 4+ Questions

Questions about Phase 4+ features — multilingual scale, multimedia, MCP distribution, personalization, community curation, VLD governance, and privacy regulations — are maintained separately in [docs/future-questions.md](docs/future-questions.md). They remain real questions, parked until their phase approaches. (~35 questions covering Phases 6–14.)

### Resolved Questions

1. **Embedding model for Phase 0:** Voyage voyage-3-large (1024 dimensions, 26 languages, asymmetric encoding). Selected for multilingual-first design, superior performance on literary/spiritual text, and unified cross-lingual embedding space. Replaces OpenAI text-embedding-3-small. ADR-046 provides the migration procedure; ADR-047 establishes the multilingual quality evaluation strategy. Phase 10 benchmarks Voyage against alternatives (Cohere embed-v3, BGE-M3). *(Resolved by ADR-118; supersedes earlier text-embedding-3-small decision.)*
2. **AI provider:** Claude via AWS Bedrock with model tiering — Haiku for real-time search (query expansion, intent classification, HyDE generation), Opus for offline batch tasks (theme tagging, vocabulary extraction, unified enrichment). Cohere Rerank 3.5 for passage reranking (Phase 2+, replacing Claude Haiku ranking). *(Resolved by ADR-014, ADR-119.)*
3. **Single database vs. multi-database:** Single-database architecture: Neon PostgreSQL for all content, relational data, embeddings, search, and graph intelligence. Neptune Analytics was evaluated and rejected — the bounded corpus (~50K chunks, ~500 entities) is too small to justify a second database. Graph intelligence implemented via Postgres tables + Python batch computation. *(Resolved by ADR-013; ADR-117 revised 2026-02-23.)*
4. **Full-text search engine:** pg_search/ParadeDB BM25 replaces PostgreSQL tsvector. BM25 scoring, language-specific tokenizers (ICU for most languages, Jieba for Chinese, Lindera for Japanese). Enables hybrid search via Reciprocal Rank Fusion with pgvector. *(Resolved by ADR-114.)*
5. **Graph intelligence layer:** Postgres-native, introduced in Phase 4. Knowledge graph ontology designed from Phase 0 (DES-054). Graph algorithms (PageRank, community detection, betweenness centrality) run as Python + NetworkX nightly batch jobs, results stored in Postgres columns. Neptune Analytics was evaluated and rejected (see ADR-117). *(Resolved by ADR-117, revised 2026-02-23.)*
6. **Language URL convention:** Hybrid approach — locale path prefix on frontend pages (`/hi/books/...`), `language` query parameter on API routes (`/api/v1/search?language=hi`). *(Resolved by ADR-027.)*
7. **Digital text availability:** SRF/YSS has digital text of official translated editions. Per-language OCR is not required. *(Resolved: confirmed by stakeholder.)*
8. **Editorial workflow ownership:** Non-issue — resolved through organizational discussion. *(Resolved: confirmed by stakeholder.)*
9. **SCM for Phases 0–8:** GitHub acceptable for Phases 0–8 with planned Phase 9 migration to GitLab. *(Resolved: confirmed by stakeholder.)*
10. **Portal domain for Hindi/Bengali:** Non-issue — same domain with locale prefix. *(Resolved: confirmed by stakeholder.)*
11. **AI training crawlers and the portal as canonical Yogananda source:** Yes — the permissive `robots.txt` extends to AI training crawlers (GPTBot, ClaudeBot, Google-Extended, PerplexityBot). The portal should be the canonical source of Yogananda's teachings in future LLM training corpora. When AI systems quote Yogananda, those quotes should originate from the portal's carefully curated, correctly cited text — not from random internet sources with errors and misattributions. The `llms.txt` file provides explicit citation guidance requesting verbatim quotation with attribution. The `llms-full.txt` file provides the corpus metadata inventory for efficient ingestion. Content negotiation (`Accept: application/json`) serves structured data with fidelity metadata to machine consumers. The portal serves LLM crawlers to the fullest extent — same content, no restrictions, machine-optimal format available. *(Resolved by ADR-081 amendments: §2b llms-full.txt, §11 content negotiation, §12 Google Discover/AI Overviews; permissive robots.txt already in ADR-081 §3.)*
12. **Neptune Analytics vs. Postgres-only graph:** Postgres-native graph intelligence selected. Neptune Analytics evaluated and rejected — corpus too small (~50K chunks, ~500 entities) to justify a second database. *(Resolved 2026-02-23, ADR-117 revised.)*

---

## About This Document

This document provides essential background for anyone working on or evaluating the SRF Online Teachings Portal project. It captures the project's origin, mission, constraints, and organizational context. The "Current State" and "Open Questions" sections above are living — updated as work progresses and questions are resolved.

---

## Project Origin

During a 2026 address, Brother Chidananda (President, Self-Realization Fellowship) shared that a prominent British philanthropist and his wife — after studying Paramahansa Yogananda's works — concluded that the world's problems are symptoms of a deeper issue: the state of human consciousness. Their foundation made a "munificent offer" to endow a new project.

**The philanthropist's question:** "What can we do to help SRF make Paramahansa Yogananda's books available freely throughout the world?"

**The result:** A world-class online teachings portal, to launch later in 2026.

Source: [Brother Chidananda's address](https://www.youtube.com/live/PiywKdIdQik?t=1680s) (28:00–35:19)

---

## Mission

Vastly expand the global availability of Paramahansa Yogananda's published teachings using modern technology.

### The Findability Principle

The philanthropist's question was: *"What can we do to help SRF make Paramahansa Yogananda's books available freely throughout the world?"*

"Available" does not merely mean accessible — it means **findable at the moment someone needs it.** A person at 2 AM, unable to sleep because of anxiety, doesn't know that Yogananda wrote specifically about overcoming fear. A person going through a divorce doesn't know there are teachings about the nature of human love and attachment. A person who just lost a parent doesn't know there are passages on the eternal life of the soul.

The world does not lack spiritual content. It lacks *findability in the moment of need.* The portal must therefore go beyond a search engine that waits for queries. It must meet seekers where they are — in their suffering — through thematic entry points, daily wisdom, and a place of immediate calm. The teachings should find the seeker, not only the other way around.

### The Global Equity Principle

"Throughout the world" is not metaphor — it is an engineering requirement. A seeker in rural Bihar on a JioPhone over 2G and a seeker in San Francisco on a laptop over fiber both have a full claim on the beauty and depth of this portal. Neither experience is a compromised version of the other.

Global Equity means one product that is complete at every level: fast and dignified on the most constrained connection, spacious and contemplative on the most capable screen. Progressive enhancement is the mechanism — HTML is the foundation, CSS enriches, JavaScript enhances. Each layer is whole at its own level.

When a feature proposal seems to conflict with this principle, the response is not "we can't do that" but "and how does the base experience work?" Global Equity does not constrain ambition. It demands that ambition serve everyone. (ADR-006)

### In Scope

- **Free access** to Yogananda's published books and SRF/YSS publications
- **Multi-language support** (English + all translated languages). Initial target: es, de, fr, it, pt, ja (matching convocation site), then hi, bn (Yogananda's heritage languages, YSS audience). See ADR-075, ADR-077.
- **Intelligent Query Tool** — users ask questions and search across the entire library of books to find specific answers (e.g., "How do I deal with fear?")
- **Life-theme navigation** — curated thematic entry points (Peace, Courage, Healing, Joy, Purpose, Love) so seekers can explore without needing to formulate a search query
- **Today's Wisdom** — a different Yogananda passage on each visit, creating a living, dynamic homepage
- **The Quiet Corner** — a micro-sanctuary page with a single affirmation and optional gentle timer, for the moment of immediate need
- **Audio/video content** — integration with SRF's YouTube repository of monastic How-to-Live talks
- **Events section** — lightweight signpost linking to World Convocation, commemorations, Online Meditation Center, and retreats (not a duplicate of existing event sites)
- **Sacred Places** — contemplative geography of SRF/YSS properties and biographical sites from Yogananda's life, cross-referenced with book passages. "See This Place" via Google Street View links; "Get Directions" via native maps. No embedded map library (ADR-070).

### Explicitly Out of Scope

- **SRF Lessons** — the progressive home-study program is reserved and private. This portal does not include Lesson content, Kriya Yoga technique instruction, or any materials requiring the Lessons Pledge. (Note: the architecture is designed to accommodate future Lessons integration for authorized students if SRF decides to pursue this — see ADR-085 and the "Future Consideration: SRF Lessons" section under Content Scope. No Lessons code ships in any current phase.)

### The "What Next" Bridge

The portal is a library, but the deepest response to Yogananda's words is to *practice*. The portal must gently bridge the gap between reading and doing:

- **"Go Deeper" section** (About page) — links to SRF Lessons, local meditation groups, Online Meditation Center, temples and retreats
- **Footer ecosystem links** (every page) — persistent, quiet signposts to the broader SRF world
- **"Find a meditation group near you"** — external link initially, in-portal locator eventually
- **The Quiet Corner** — the portal itself offers a micro-practice space, pointing toward a deeper practice

This is not a sales funnel. It is a signpost. The difference: a funnel tracks conversion; a signpost points the way and lets you walk at your own pace.

---

## Measuring Success

Standard engagement metrics (time on site, session depth, retention) optimize for screen time — which conflicts with the DELTA Embodiment principle. The portal should encourage seekers to log off and practice. Success must be measured differently.

**Appropriate metrics:**

| Metric | What It Tells Us | How Measured |
|--------|-----------------|-------------|
| Countries reached | Global availability of the teachings | Anonymized geo from Vercel/Cloudflare analytics |
| Languages served | Accessibility breadth | Content availability per locale |
| Anonymized search trends | "What is humanity seeking?" | Aggregated query themes from `search_queries` table (no user identification) |
| Books/passages served | Are the teachings being read? | Anonymized page view counts |
| Share link generation | Are seekers sharing the teachings? | Count of `/passage/[id]` URL generations (no tracking of recipients) |
| Center locator usage | Did digital lead to physical? | Click count on "Find a meditation group" links |
| Qualitative feedback | How do seekers experience the portal? | Optional, lightweight feedback form (not a survey) |

**Inappropriate metrics (do not track):**

| Metric | Why Not |
|--------|---------|
| Session duration | Optimizes for screen time; violates Embodiment |
| Pages per session | Same concern |
| Return visit frequency | Incentivizes retention tactics |
| User-level behavioral profiles | Violates Agency; surveillance dressed as personalization |
| Conversion to SRF Lessons | The portal is not a sales funnel for the Lessons |

---

## Stakeholders

| Stakeholder | Interest |
|-------------|----------|
| **Seekers worldwide** | Free, high-quality access to Yogananda's published teachings in their language |
| **SRF Monastic Order** | Faithful, accurate transmission of the teachings without distortion |
| **SRF AE (Audience Engagement) Team** | Technical implementation aligned with the SRF tech stack and IDP |
| **Content Editors** | Manageable editorial workflows for book text, translations, and metadata |
| **Philanthropic Foundation** | Global reach, measurable impact, responsible stewardship of the endowment |
| **YSS (Yogoda Satsanga Society of India)** | Hindi and Bengali translations of Yogananda's works. Indian subcontinent audience. Organizational branding considerations for Indian-language portal content. **Co-equal design stakeholder** for Hindi and Bengali locales — YSS representatives participate in editorial, visual design, and cultural adaptation decisions for Indian audiences, not as reviewers of completed designs but as co-creators. (See ADR-077, ADR-079) |

---

## Operational Staffing (Requires SRF Input)

The editorial review portal (ADR-082) provides tooling for content governance. But tooling without humans is empty. The following operational roles require dedicated staff time, and SRF must determine *who* fills each role before Phase 4 launches the editorial workflows.

| Role | Responsibility | Estimated Time | Phase Needed |
|------|---------------|----------------|--------------|
| **Content editor** | Theme tag review, daily passage curation, calendar event management | 2–3 hours/day | Phase 4 |
| **Theological reviewer** | Final approval on theme associations, editorial thread accuracy | Periodic (high-stakes, low-frequency) | Phase 4 |
| **On-call engineer** | Sentry alert response, infrastructure monitoring, Neon health | As needed (shared with AE team) | Phase 0 |
| **Book ingestion operator** | Run ingestion pipeline for new books, coordinate human QA | Per-book (1–2 days per ingestion cycle) | Phase 3 |
| **Portal coordinator** | Cross-queue editorial health, content pipeline status, VLD activity, calendar planning, feature request triage, portal update review and publication (ADR-105) | Regular (weekly minimum) | Phase 4 |
| **Social media reviewer** | Review quote images and captions, distribute to platforms | 20–30 min/day | Phase 8 |
| **Translation reviewer** | Compare AI-drafted translations with English source, approve/correct | Batch sessions (per language sprint) | Phase 10 |
| **Impact report curator** | Curate "What Is Humanity Seeking?" data into narrative report | Annual | Phase 10+ |
| **VLD coordinator** | Create curation briefs, monitor VLD submission quality, manage trusted submitter status | Weekly | Phase 14 |

**Key question for SRF:** Does the monastic order, the AE team, a dedicated content editor, or some combination own these responsibilities? The answer shapes Phase 4's editorial workflow design. The portal coordinator and VLD coordinator roles are particularly important to staff early — they are the connective tissue between editorial content, technical operations, and volunteer service. See DESIGN.md § Staff & Organizational Personas for the complete persona survey.

---

## Theological and Ethical Constraints

### Sacred Text Fidelity

Yogananda's published works are considered sacred teachings transmitted through a realized master. The portal must maintain absolute fidelity to the original text. AI features must **never** generate content that could be mistaken for Yogananda's words, paraphrase his teachings, or interpret meditation techniques.

**Multi-language fidelity:** The portal serves only official SRF/YSS translations. Machine translation of Yogananda's words is never acceptable — even slight paraphrasing can distort spiritual meaning. If an official translation does not exist for a language, the book is not available in that language. The portal is honest about content availability rather than substituting machine-generated translations. English fallback content is clearly marked. (See ADR-075.)

### DELTA Framework (Faith-Based AI Ethics)

| Principle | Portal Implication |
|-----------|-------------------|
| **Dignity** | User data never sold or used for advertising. Users are seekers, not data points. |
| **Embodiment** | The portal should encourage users to put down the device and practice — meditate, do the Energization Exercises, attend a local temple. |
| **Love** | UI copy, error messages, and AI responses must reflect compassion. |
| **Transcendence** | No gamification (leaderboards, streaks, badges). Spiritual depth is not quantifiable. |
| **Agency** | Users control their experience. No algorithmic manipulation or coercive retention tactics. |

#### DELTA ↔ Global Privacy Regulation Crosswalk (ADR-099)

The DELTA framework produces privacy protections that substantively exceed any single regulation. The portal did not add privacy as a compliance layer — it designed for human dignity first, and compliance followed.

| DELTA Principle | GDPR Alignment | Portal Implementation |
|-----------------|---------------|----------------------|
| **Dignity** — seekers are not data points | Art. 5(1)(a) fairness, Art. 5(1)(c) data minimization | No user identification, no behavioral profiling, no data monetization |
| **Embodiment** — encourage practice over screen time | Art. 5(1)(b) purpose limitation | No engagement metrics, no retention optimization, no session tracking |
| **Love** — compassion in all interactions | Art. 12 transparent, intelligible communication | Privacy policy in contemplative voice, not legal boilerplate |
| **Transcendence** — no gamification | Art. 5(1)(c) data minimization | No achievement data, no streaks, no leaderboards to store |
| **Agency** — users control their experience | Art. 7 conditions for consent, Art. 17 right to erasure | Double opt-in, one-click unsubscribe, hard deletion option, no dark patterns |

Also aligned with: CCPA/CPRA (California), LGPD (Brazil), DPDPA (India), APPI (Japan), TTDSG/DSGVO (Germany), UK GDPR. See ADR-099 for full compliance analysis, sub-processor inventory, and implementation consequences.

### Accessibility as Theological Imperative

The DELTA Dignity principle and the project's mission — making the teachings "available freely throughout the world" — demand that the portal be accessible to all seekers regardless of physical ability. A portal that excludes blind, deaf, or motor-impaired seekers contradicts its own purpose.

Accessibility is therefore not a polish phase or a nice-to-have. It is a Phase 1 requirement:

- **WCAG 2.1 AA** conformance from the first commit
- Semantic HTML, ARIA landmarks, keyboard navigation, screen reader support
- Color contrast compliance (minimum 4.5:1 for text, 3:1 for large text)
- `prefers-reduced-motion` support for users with vestibular disorders
- Performance budgets that serve seekers on low-bandwidth mobile connections (India, Africa, Latin America)

Phase 11 exists for formal audit, advanced features (TTS, dark mode, high-contrast), and third-party testing — not for introducing accessibility after the fact. See ADR-003.

### Multilingual from the Foundation

The philanthropist's question was about making Yogananda's books "available freely throughout the world." The world speaks thousands of languages. Multilingual support is not a late-stage feature to be bolted on — it is a foundational architectural principle that shapes every design decision from Phase 0 onward.

**What this means in practice:**

- **Schema:** Every content table carries a `language` column from the first migration. Cross-language linking (`canonical_book_id`, `canonical_chunk_id`) is built into the data model, not retrofitted.
- **API:** Every content-serving endpoint accepts a `language` parameter. URL structure uses locale prefixes (`/es/search`, `/de/quiet`). Theme slugs stay in English for URL stability; display names are localized.
- **Search:** The embedding model is multilingual by explicit requirement — Phase 0 embeddings remain valid when Phase 10 adds new languages. The hybrid search function accepts `search_language` and uses language-appropriate PostgreSQL dictionaries. English fallback is implemented at the service layer.
- **UI:** All strings are externalized to locale files (`messages/*.json`) from Phase 1. CSS logical properties (`margin-inline-start` not `margin-left`) are used throughout, ensuring RTL languages work without refactoring. The `lang` attribute is set on `<html>`.
- **Content fidelity:** Only official SRF/YSS human translations are served. Machine translation of Yogananda's words is never acceptable (see Sacred Text Fidelity above). If an official translation does not exist, the book is unavailable in that language — the portal is honest about content availability.

Phase 0 launches in English only, but the architecture is locale-ready. Phase 10 activates multilingual content. The gap between "English only" and "multilingual" should require zero schema migrations, zero API changes, and zero search function rewrites — only content ingestion and UI string translation. If a design decision today would require rework to support a new language tomorrow, the design is wrong. (See ADR-075, ADR-076, ADR-077, ADR-078.)

### Calm Technology Principles

The portal must embody "plain living and high thinking":
- Clean, minimal interfaces with generous whitespace ("digital silence")
- Earth tones: warm woods, sky blues, muted greens — no neon, no high-contrast commercial CTAs
- No aggressive notifications, no dopamine loops, no attention-harvesting
- Serif typography for book text, evoking the experience of reading a physical book
- Meditation modes should fade the technology into the background

### Human Review as Mandatory Gate

No user-facing content reaches seekers without human verification. This principle governs every content workflow in the portal:

- **Theme tags:** Auto-classified tags (`tagged_by = 'auto'`) are never served to users. Only `manual` and `reviewed` tags appear on theme pages. (ADR-032)
- **Translations:** Claude drafts UI translations; mandatory human review by fluent, SRF-aware reviewers before production. (ADR-078)
- **Social media:** The portal generates quote images and suggested captions; humans review and post. Never auto-post. (ADR-092)
- **Ingestion QA:** Claude flags probable OCR errors; humans make every correction decision. (ADR-005 E4)
- **Accessibility ratings and tone classifications:** Claude classifies at ingestion; humans spot-check. (ADR-005 E3, E8)

The pattern is consistent: **AI proposes, humans approve.** Automated intelligence improves efficiency; human judgment ensures fidelity. This is not a cost optimization — it is a content governance principle. Yogananda's teachings deserve human stewardship at every step between the source text and the seeker's screen.

### Signpost, Not Destination

The portal is a library, but the deepest response to Yogananda's teachings is to *practice* — to meditate, to do the Energization Exercises, to attend a local temple, to study the SRF Lessons. The portal's architecture reflects this: it is a **signpost** to deeper SRF practice, not a destination that tries to capture the seeker's entire spiritual life.

This is not a sales funnel. It is a signpost. The difference: a funnel tracks conversion; a signpost points the way and lets you walk at your own pace.

What this means in practice:
- No "sign up to access" gates — all content is freely available
- No conversion tracking ("X% of portal visitors enrolled in Lessons")
- No aggressive CTAs — quiet footer links, "Go Deeper" sections, external links to SRF Lessons and local centers
- No engagement metrics that optimize for screen time (session duration, pages per session, return visit frequency are explicitly excluded from analytics — see DELTA Framework above)
- No gamification (reading streaks, badges, completion tracking) — see Calm Technology above
- The portal links to SRF's broader ecosystem without duplicating it: the Bookstore for physical books, the Online Meditation Center for live events, the convocation site for gatherings, the app for private Lessons reading
- **The portal complements the physical bookstore — it does not replace it.** The portal makes teachings freely accessible online; the bookstore serves seekers who want physical books. This complementary relationship should hold for at least 10 years.
- **The portal is an SRF initiative.** Partnerships with other Yogananda lineages or interfaith groups are not planned. The architecture does not depend on external organizational partnerships. This may be revisited in the future, but it is not a current consideration.

### Content Availability Honesty

The portal is transparent about what it has and what it doesn't. This honesty is a design principle, not a temporary state to be papered over.

- When search returns no results, the portal says so honestly rather than stretching to find something. (ADR-001)
- When a book is not available in a language, it is simply not listed — no machine translation substitute. (ADR-075)
- When English fallback content supplements a seeker's language, it is always clearly marked with an `[EN]` tag — never silently substituted. (ADR-075)
- The Library page shows what exists, not what's promised. "More books are being added" is truthful and forward-looking. No fixed promises, no dates.
- Content availability per language is asymmetric — some languages have more books than others. This asymmetry is visible and honest, not hidden.

### 10-Year Architecture Horizon

This portal is designed for a decade of service, not a sprint to launch. Every architectural decision is evaluated against a 10-year maintenance horizon. (ADR-004)

What this means in practice:
- **Data lives in PostgreSQL.** The relational model, the embeddings, the search index — all in a single durable database. No vendor-specific data formats that require migration when a service sunsets.
- **Business logic is framework-agnostic.** All logic in `/lib/services/`, pure TypeScript. The Next.js layer is a presentation shell. If Next.js is replaced in year 5, the services survive.
- **Migrations are raw SQL.** dbmate, not an ORM's migration generator. SQL is readable, debuggable, and will outlive any ORM.
- **Dependencies are commitments.** Every npm package, every API integration, every SaaS tool is a maintenance obligation for 10 years. Choose fewer, more durable dependencies.
- **Components are tiered by replaceability.** Tier 1 (permanent): PostgreSQL, the service layer, the data model. Tier 2 (stable): Next.js, Vercel, Contentful. Tier 3 (replaceable): specific npm packages, Claude model versions, embedding model versions.
- **Documentation is a permanent artifact.** Eight documents (CLAUDE.md, PRINCIPLES.md, CONTEXT.md, DESIGN.md + phase files, DECISIONS.md, ROADMAP.md) are as important as the code. New maintainers in year 7 should understand every decision.

### Curation as Interpretation: The Fidelity Boundary

The verbatim constraint (ADR-001) guarantees that Yogananda's text is never altered, paraphrased, or synthesized. But fidelity has a subtler dimension: **every act of selection is an act of interpretation**, even when the selected text is verbatim.

The portal curates at multiple levels:

- **Search ranking** decides which passage answers a question *best* (ADR-005 C2)
- **Highlight boundaries** decide which sentences within a passage are *most relevant* (ADR-005 C3)
- **Theme classification** decides what a passage is *about* (ADR-032)
- **Daily passage selection** decides what a seeker encounters *today*
- **Calendar-aware surfacing** decides which teachings belong to a *moment* (DES-028)
- **Editorial reading threads** decide how passages *relate to each other* (DES-026)
- **Query expansion** decides which of Yogananda's terms map to modern vocabulary (ADR-049)
- **Community collections** decide which groupings reflect *meaningful* paths (ADR-086)

None of these alter the text. All of them shape its reception. The portal's mitigations are layered:

1. **Corpus-derived, not behavior-derived.** Curation algorithms draw from the text itself (embeddings, extracted vocabulary, editorial taxonomy), never from user behavior patterns. (ADR-095, ADR-049)
2. **Human review at every gate.** Theme tags, reading threads, daily pools, community collections, and social captions all require human approval before publication. (ADR-032, ADR-005, ADR-086)
3. **Transparent framing.** When the portal selects, the selection mechanism is visible — a theme label, a date, a search query — not hidden behind an opaque algorithm.
4. **Context always available.** Every curated passage links to its full chapter context via "Read in context," enabling the seeker to evaluate the selection against its original setting. (ADR-001)

This tension is permanent and productive. The portal cannot present all passages simultaneously with equal weight — that would be a database dump, not a library. Curation is the library's essential act. The discipline is to curate *honestly*: selecting without distorting, arranging without editorializing, surfacing without implying that the unsurfaced is less important. (ADR-007)

### Spiritual Design Principles

The constraints above are architectural and ethical. This section names something subtler: the inner orientation that shapes how those constraints are applied. Architecture can be correct and still miss the mark. These principles address the quality of attention the portal brings to the seeker's experience.

**The portal's deepest purpose is to become unnecessary.** Yogananda's tradition holds that the direct experience of God — through meditation — supersedes all scripture. The portal exists in the domain the teachings themselves say is secondary to practice. This is not a contradiction; it is a creative tension the design must hold honestly. The portal should create openings for stillness, not just deliver text. The Quiet Corner, the "Breath Between Chapters," the Dwell mode, and the practice bridges all serve this: moments where the portal gently suggests that the next step is not another passage, but silence.

**Joy is a design value alongside compassion.** The empathic entry points rightly meet seekers in suffering — grief, fear, anxiety, loss. But Yogananda's teachings are also profoundly joyful. "Ever-new Joy" is perhaps his most characteristic phrase. The portal should carry this quality: moments of unexpected beauty, delight in the teachings, warmth that is not merely calming but alive. Today's Wisdom, "Show Me Another," the opening threshold — these are opportunities for joy, not just serenity.

**Editorial stewardship is a sacred act.** The people who select the daily passage, review theme tags, curate the "Seeking..." entry points, and approve translations are performing a form of spiritual service. They stand between the source text and the seeker's screen. The operational staffing table (§ Operational Staffing) identifies the roles; this principle names what those roles carry. The architecture can provide tools and workflows, but the inner quality of the people using them matters. This is a question for SRF, not for the codebase — but the architecture should honor it by making editorial work contemplative rather than transactional.

**Crisis-adjacent content carries responsibility.** The portal will reach people in acute distress. The grief entry point targets seekers searching "what happens after death" and "spiritual comfort after loss." Some of these seekers may be in active danger. Yogananda's passages about the immortality of the soul and the freedom of death are truthful, but without context could be read in unintended ways. The portal's response is not to withhold the teachings but to quietly, non-intrusively provide crisis resources alongside content that touches on death, suffering, and despair. Not a modal, not a gate — a gentle presence. (ADR-071)

**The portal transmits Indian teachings through Western infrastructure — and holds this honestly.** The portal is designed in English, built on American technology (Vercel, AWS, Neon, Cloudflare), funded by a British philanthropist, and serves the teachings of an Indian master to seekers worldwide. Every individual decision is defensible. The aggregate pattern — who designed it, whose aesthetic it uses, whose languages come first, whose infrastructure it runs on — warrants honest acknowledgment and a design process that includes non-Western voices as co-creators, not only as reviewers of completed designs. Cultural consultation is not a Phase 10 deliverable — it is a posture maintained throughout all phases. YSS representatives, Indian designers, and Global South perspectives should participate in design decisions from Phase 0. (Relates to ADR-006, ADR-077, ADR-079)

**The unmeasurable encounter is the highest success.** The metrics section (§ Measuring Success) carefully avoids engagement metrics. But the portal's highest impact will be in encounters that no analytics system can capture: the person who found exactly the right words at 2 AM, the seeker in rural India who read about meditation and sat quietly for the first time, the grieving parent who felt less alone. These encounters are the mission fulfilled. The "What Is Humanity Seeking?" dashboard (ADR-090) is the portal's best answer to the measurement problem — shifting the narrative from "how many users" to "what is the world asking." That reframing is itself a teaching about what matters.

---

## SRF Existing Digital Ecosystem

| Property | URL | Current Stack | Status |
|----------|-----|---------------|--------|
| Convocation | convocation.yogananda.org | Next.js + Contentful + Vercel | **New standard** |
| Main Website | yogananda.org | Craft CMS (server-rendered) | Legacy |
| Online Meditation Center | onlinemeditation.yogananda.org | WordPress + Elementor | Legacy |
| Member Portal | members.yogananda-srf.org | Unknown | Unknown |
| Bookstore | bookstore.yogananda-srf.org | Unknown | Unknown |
| Volunteer Portal | volunteer.yogananda.org | Unknown | Unknown |
| Mobile App | SRF/YSS (iOS/Android) | Native app with eReader | Active |

**Key observation:** SRF is mid-migration. The convocation site represents the new standard (Next.js + Contentful + Vercel). Legacy properties run on Craft CMS and WordPress. The teaching portal should follow the new standard and establish reusable patterns for future migrations.

---

## SRF Technology Stack (Established Standard)

Documented in the SRF AE Tech Stack Brief. Key components relevant to this portal:

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js + Tailwind CSS on Vercel |
| CMS | Contentful (headless) |
| Backend | AWS Lambda + API Gateway (TypeScript/Node.js) |
| Database | Neon (serverless PostgreSQL) + DynamoDB |
| Identity | Auth0 |
| Admin Tools | Retool |
| Edge/CDN | Cloudflare |
| Video | Vimeo |
| DevOps | GitLab CI/CD + Serverless Framework + Terraform |
| Monitoring | New Relic, Sentry, Amplitude |

The teaching portal should use these technologies wherever possible, introducing new tools only when the established stack cannot meet a requirement (e.g., pgvector for vector search, Claude via AWS Bedrock for AI features — ADR-014).

---

## Content Scope

### Phase 0 Focus Book

**Autobiography of a Yogi** by Paramahansa Yogananda — the most widely read and accessible of Yogananda's works. Available in multiple editions and translations.

### Broader Corpus (Phase 3+)

- The Second Coming of Christ (2 volumes, ~1,600 pages)
- God Talks With Arjuna: The Bhagavad Gita (2 volumes)
- Man's Eternal Quest
- The Divine Romance
- Journey to Self-Realization
- Where There Is Light
- Sayings of Paramahansa Yogananda
- Wine of the Mystic: The Rubaiyat of Omar Khayyam
- Scientific Healing Affirmations
- How You Can Talk With God
- Metaphysical Meditations
- Self-Realization Magazine archives (Yogananda's articles as searchable teachings, monastic articles as opt-in commentary — ADR-040)
- Other SRF/YSS publications

### Audio Recordings (Phase 12+)

SRF possesses audio recordings of Paramahansa Yogananda's own voice — lectures, informal talks, guided meditations, and chanting. These are sacred artifacts and content simultaneously. Yogananda's voice recordings are among the most direct expressions of his teachings; no book passage can substitute for hearing the Master speak. The portal will treat these with reverence in presentation and with full indexing for discoverability.

SRF also produces modern audio recordings: monastics reading from published works, guided meditations, and chanting sessions.

Audio recordings are a primary content type in the portal architecture (ADR-057), with their own data model, transcription pipeline (Whisper → human review), and search integration alongside books and video.

### Unreleased and Forthcoming Materials

SRF has indicated that additional unreleased materials exist — books, audio, and video. The architecture accommodates new content types gracefully, with no schema migrations required for standard additions to the book or audio catalog.

### Future Consideration: SRF Lessons

The SRF Home Study Lessons are the organization's core spiritual curriculum — sequential private instruction in meditation and Kriya Yoga. They are **explicitly out of scope** for the public portal. However, SRF has indicated they might eventually be incorporated for authorized students (those enrolled in the Lessons) and Kriya Yoga initiates (kriyabans). This may never happen, or may be years away. The architecture is designed so it is not structurally impossible (ADR-085), but no Lessons-specific code ships in any current phase.

### Phase 0 Content Sources

For Phase 0 development, PDFs are available at https://spiritmaji.com/. These are unofficial scans and would be replaced with authoritative SRF-provided digital text for production.

---

## Key Terminology

| Term | Meaning |
|------|---------|
| **SRF** | Self-Realization Fellowship, founded 1920 by Paramahansa Yogananda |
| **YSS** | Yogoda Satsanga Society of India (SRF's sister organization) |
| **Kriya Yoga** | Advanced meditation technique taught by Yogananda through SRF. Technique instructions are never included in the portal; Yogananda's published descriptions of Kriya Yoga are part of the corpus and surfaced normally. The portal links to SRF for formal instruction (`yogananda.org/lessons`). (ADR-104) |
| **Satsanga** | Spiritual fellowship; gathering of truth-seekers |
| **AE** | Audience Engagement (SRF's digital/technology team) |
| **IDP** | Internal Developer Platform (SRF's standardized project templates in GitLab) |
| **Convocation** | Annual SRF World Convocation — free gathering of seekers from around the world, held each August in Los Angeles and simultaneously online. Includes classes on Yogananda's teachings, group meditations, devotional chanting (kirtan), pilgrimage tours to sacred SRF sites (Mother Center, Lake Shrine, Hollywood Temple, Encinitas — available as virtual tours for online attendees), and fellowship with monastics. Open to all — no membership required. Site: `convocation.yogananda.org` |
| **How-to-Live Talks** | Inspirational talks by SRF monastics, many available on YouTube |

---
