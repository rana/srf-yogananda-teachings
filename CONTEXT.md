# SRF Online Teachings Portal — Project Context

## Current State

**Phase:** Design complete. Ready to begin Phase 0 (Foundation).

**What exists:** Comprehensive design documentation — CONTEXT.md (this file), DESIGN.md (architecture), DECISIONS.md (123 ADRs), ROADMAP.md (18 phases, 0–17). No code yet.

**What's next:** Phase 0 — Foundation. Repo setup, Neon provisioning, Vercel/Sentry configuration, initial schema migration, stakeholder kickoff. Then Phase 1 — Prove the Search. See ROADMAP.md § Phase 0 and § Phase 1 for deliverables.

---

## Open Questions

### Technical (resolve during Phase 1)

- [ ] Which edition of Autobiography of a Yogi is the canonical page-number reference? (1946 first edition, 1998 13th edition, or current printing?) All portal citations depend on this. (Relates to ADR-069)
- [ ] Does SRF have recordings of their temple singing bowls and chimes for the Quiet Corner audio (Phase 2)? If not, what is the sourcing policy for sacred audio? (Relates to ADR-101)
- [ ] Optimal chunk size for Yogananda's prose style (test 200, 300, 500 token chunks). See ADR-115 for the formal chunking strategy specification.
- [ ] Multilingual embedding quality evaluation: when multilingual content is available (Phase 11), benchmark text-embedding-3-small against multilingual-optimized models (Cohere embed-v3, BGE-M3, multilingual-e5-large-instruct) using actual translated passages. Phase 1 English-only evaluation cannot assess cross-language retrieval quality. (ADR-120)
- [ ] Domain-adapted embeddings research: after Phase 11 corpus completion, evaluate fine-tuning a multilingual base model on Yogananda's corpus for world-class retrieval quality across all portal languages. Requires multilingual corpus and per-language evaluation suites as prerequisites. (ADR-120)
- [ ] Query expansion prompt engineering (test with diverse query types)
- [ ] Cross-book search vs. per-book search: should the default search span all books, or should seekers select a book first? The announcement implies cross-library search.
- [ ] "No results" experience: when the corpus doesn't contain relevant passages, what does the portal show? A gentle message? Suggested related topics?
- [ ] Zero-state search experience: when the seeker focuses the search bar but has not typed anything, what appears? Curated theme chips, sample questions, or nothing? This is an editorial statement about which teachings seekers encounter first — governance model needed. (ADR-121)
- [ ] Transliteration support for Indic script search suggestions: Hindi/Bengali seekers often type Romanized input (e.g., "samadhi" not "समाधि"). Should the suggestion system match across scripts? What about CJK substring matching? (ADR-121, Phase 11)
- [ ] Editorial governance of curated query suggestions: who authors and reviews the curated question forms (e.g., "How do I overcome fear?") shown in the suggestion dropdown? Same editorial review process as theme tagging, or a lighter-weight process? (ADR-121)
- [ ] Mobile search suggestion UX: on mobile, the OS keyboard already provides word suggestions, and a search autocomplete dropdown competes for screen space. Should the mobile suggestion experience differ from desktop (e.g., fewer suggestions, different trigger)? (ADR-121)
- [ ] Contentful free tier viability: 10,000 records and 2 locales may be insufficient at paragraph granularity. Evaluate whether a paid Contentful space is needed, or whether Phases 1–9 use Neon-only with Contentful deferred to production.
- [ ] Crisis query detection in search: when a seeker searches "I want to die," "how to end the pain," or similar acute-distress queries, the AI librarian would faithfully return passages about death and the soul's immortality — which, without context, could be read as affirming self-harm. Should the search intent classifier include a crisis detection layer that surfaces crisis resources *above* search results for certain query patterns? ADR-122 handles crisis resources on grief *content pages*, but search queries are the higher-risk surface. Requires coordination with the intent classification system (ADR-049 E1) and SRF input on theological framing. (Relates to ADR-122, ADR-049)
- [ ] Portal editorial voice guide: the portal's UI copy (error messages, empty states, loading text, ARIA labels, confirmation dialogs) collectively forms a verbal personality over 10 years of development. Should a micro-copywriting guide be created specifying tone, vocabulary, sentence length, and the use of "we" vs. passive voice — ensuring consistency as multiple developers write UI strings? Who reviews this guide — the same editorial team as theme tags, or a lighter-weight process? (Relates to ADR-124)
- [ ] Daily passage pool depth for Phase 1: with a single book (Autobiography of a Yogi), the Today's Wisdom pool may feel repetitive for daily visitors over months. What is the minimum pool size for a meaningful daily bibliomancy experience? Should Phase 1 include curated passages from the Autobiography specifically, or should the pool be artificially constrained until Phase 5 adds more books? (Relates to ADR-046)
- [ ] @YoganandaSRF YouTube channel ID (needed for RSS feed URL in Phase 2)
- [ ] YouTube playlist inventory (map existing playlists to portal categories, needed for Phase 2)
- [ ] The 500th-visit experience: the design is rich with first-visit patterns (threshold, tooltips, Start Here). But the daily visitor who has been coming for three years — what does the portal feel like for them? Physical libraries have a mature relationship with their regulars (the librarian recognizes you, the shelves are familiar, you have your favorite chair). What is the digital equivalent — without tracking, without personalization, without violating DELTA? The daily passage pool, seasonal curation, and circadian choreography address *content* freshness; this question is about *relational* maturity. (Relates to ADR-046, ADR-123, ADR-130)
- [ ] Portal sonic identity beyond the chime: the singing bowl chime (ADR-101) and ambient soundscapes (ADR-076) address the Quiet Corner and reader. But the portal's broader sonic palette is unspecified: the threshold? The Breath Between Chapters? Dwell activation? The default is silence — and that may be correct. But a considered sonic identity (even if 90% silence) would give the portal a dimension that purely visual design cannot. Should a sonic identity brief be created alongside the visual design tokens? (Relates to ADR-101, ADR-076, ADR-131)
- [ ] Contextual sharing and wrongful certainty: seekers will quote Yogananda out of context via the passage share feature. They will use the sharing tools to prooftext spiritual positions in arguments. The portal can't prevent this. But could the shared passage page (`/passage/[chunk-id]`) include context that gently resists decontextualization? Currently, the page shows "This passage appears in *[Book Title]*, Chapter [N]." Should it go further — e.g., a brief note about the chapter's topic, so the receiving person understands the teaching's home? What is the right balance between shareability and contextual integrity? (Relates to ADR-015, ADR-059, ADR-066)
- [ ] Negative space as a scholarly tool: the Reverse Bibliography (ADR-055) maps what Yogananda *explicitly* referenced. But equally interesting is what's *absent* from the corpus — topics that are adjacent to the teachings but never directly addressed, questions seekers ask (from anonymized search trends) that the corpus genuinely cannot answer. Is mapping the boundaries of the corpus — its shape, its silences — within the portal's scope as a scholarly feature? Or does this require a separate research initiative? (Relates to ADR-055, ADR-094)
- [ ] Community collection moderation at scale: if community curation (ADR-135) reaches thousands of submissions, the staff review queue becomes a bottleneck. Should there be a tiered moderation model — VLD moderators as first-pass reviewers, staff as final approvers? What is the right rejection feedback loop to maintain community goodwill? (Relates to ADR-135, ADR-136)

### Stakeholder (require SRF input)

- [ ] What is the relationship between this portal and the SRF/YSS app? Complementary or overlapping reader? Will the portal's search eventually power the app?
- [ ] Who will manage the editorial workflow — theme tagging, daily passage curation, text QA? Monastic order, AE team, or dedicated content editor?
- [ ] What does the philanthropist's foundation consider a successful outcome at 12 months? (Shapes analytics and reporting.)
- [ ] Can SRF provide center location data (addresses, coordinates, schedules) for an in-portal "Meditation Near Me" feature?
- [ ] What is SRF's copyright/licensing posture for the portal content? Read online only, or also downloadable/printable? What attribution is required? *All non-Lessons material is offered free of charge. The architecture supports both read-online and downloadable formats. SRF should determine specific licensing terms at their discretion.*
- [ ] About page content: does SRF have approved biography text for Yogananda and descriptions of the line of gurus, or do we draft for their review?
- [ ] Does SRF/YSS have **digital text** of official translated editions? If only printed books, OCR per language is a massive effort requiring fluent reviewers. (Critical for Phase 11 scoping.)
- [ ] Which books have official translations in which languages? (Content availability matrix — determines what each language's portal experience looks like.)
- [ ] Who reviews the AI-drafted UI translations (~200–300 strings)? Claude generates drafts (ADR-023), but human review is mandatory. Does SRF have multilingual monastics or volunteers who can review for spiritual register and tone?
- [ ] Should Hindi and Bengali be prioritized alongside the Western-language set? Yogananda's heritage, YSS's Indian audience (~millions), and the mission of global availability argue strongly for inclusion. (ADR-022)
- [ ] For Hindi/Bengali: same portal domain (`teachings.yogananda.org/hi/`) or YSS-branded domain? Organizational question with architectural implications.
- [ ] Do translated editions preserve paragraph structure? If yes, `canonical_chunk_id` alignment during ingestion is straightforward (match by chapter_number + paragraph_index). If translations reorganize content, alignment requires semantic matching. (Critical for Phase 11 cross-language linking.)
- [ ] Does the teaching portal get its own mobile app, or do portal features (search, daily passage, reader) integrate into the existing SRF/YSS app? The API-first architecture (ADR-024) supports either path.
- [ ] Does SRF prefer the portal repo in GitLab from day one (per SRF IDP standards), or is GitHub acceptable for Phases 1–9 with a planned Phase 10 migration? The Terraform code and CI/CD pipelines are SCM-agnostic; only the workflow files change.
- [ ] What Sentry and New Relic configurations does SRF use across their existing properties? Aligning observability tooling enables operational consistency.
- [ ] What are the content licensing terms for portal-served content — read-online only, or also downloadable/redistributable? Does the permissive `robots.txt` extend to AI training crawlers ingesting full book text? (Relates to ADR-084)
- [ ] Does the philanthropist's foundation want to publish "What Is Humanity Seeking?" as a standalone annual communications asset (report, subdomain, media syndication)? If so, communications planning should begin before the Phase 7 dashboard ships. (Relates to ADR-113)
- [ ] Can SRF provide recordings of Yogananda's own voice for an IVR/audio pilot during the Hindi/Bengali launch (Phase 11), rather than deferring all voice access to Phase 16? (Relates to ADR-085)
- [ ] What format should the annual "What Is Humanity Seeking?" impact report take — PDF, web page, or both? Published by SRF or the philanthropist's foundation? (Phase 7+; relates to ADR-113)
- [ ] Crisis resource policy: Should the portal display locale-appropriate crisis helpline information (e.g., 988 Suicide and Crisis Lifeline, local equivalents) alongside grief and death-related content? What is SRF's preferred approach to acknowledging that seekers in acute distress may reach the portal? (Relates to ADR-122)
- [ ] How does SRF frame the portal's impact for the philanthropist's foundation when the most meaningful outcomes are unmeasurable? The "What Is Humanity Seeking?" narrative (ADR-113) reframes the question — does the foundation find this framing sufficient, or do they require conventional reach metrics? (Relates to § Measuring Success)
- [ ] What is the inner orientation SRF envisions for the editorial team? The content editor, theological reviewer, and translation reviewer roles (§ Operational Staffing) carry spiritual responsibility — curating what seekers encounter. Does SRF see these as devotional service roles, professional positions, or both? This shapes workflow design and staffing criteria.
- [ ] Extreme-context access: the portal specifies 3G in rural India as a performance target, and ADR-061 addresses Global South delivery. But the *emotional* context of certain access scenarios carries design implications beyond bandwidth. A seeker in a hospital waiting room, a prison, a refugee camp, or a hospice has different needs than someone in a home office. The Quiet Corner partially addresses crisis moments. Are there even lighter-weight surfaces — perhaps a single-URL, <10KB experience — designed for environments where cognitive load, connectivity, and privacy are all severely constrained? Does SRF want the portal to be explicitly designed for institutional contexts (hospitals, prisons, chaplaincies)?
- [ ] Design intent preservation: the documentation captures architecture and decisions, but the *spirit* behind those decisions — why the haptic pattern mimics a singing bowl's decay, why the threshold is a breath and not a logo reveal, why the parting passages exist — is the hardest thing to maintain across staff turnover. In year 7, will a new developer understand the contemplative reasoning? Should a "Design Intent" companion document be created — not an ADR (which records *what* was decided) but a narrative that explains *why it feels the way it feels*? Who maintains it? (Relates to ADR-119, § Documentation–Code Transition in CLAUDE.md)
- [ ] Community curation governance: who within SRF reviews community-submitted collections (ADR-135)? The same editorial team as theme tags, or a separate community management role? What are the theological boundaries for collection approval — can passages be juxtaposed from different books, or must collections stay within a single work? What disclaimer text does SRF want on community-curated collections? (Relates to ADR-135)
- [ ] VLD portal roles: does SRF want VLD members to have portal accounts with a `vld` role for curation delegation (ADR-136)? If so, who manages VLD role assignment — SRF membership office, AE team, or monastic oversight? Can VLD curation service count toward VLD service hours? (Relates to ADR-136)
- [ ] Community collection attribution and ego: spiritual communities have tensions around recognition. Should published community collections carry curator names, or be anonymous by default? Does SRF prefer "Curated by [Name]" or "Curated by a devotee"? Is attribution important for accountability, or does it create unwanted ego dynamics? (Relates to ADR-135)
- [ ] Relationship between community curation and official SRF publications: SRF already publishes reading guides and study materials through its own channels. Does community curation complement or compete with official publications? Should community collections be visually distinct from staff-curated Editorial Reading Threads (ADR-054)? (Relates to ADR-135, ADR-054)

### Resolved Questions

1. **Embedding model for Phase 1:** OpenAI text-embedding-3-small (1536 dimensions, multilingual). Selected for adequate multilingual support, operational simplicity, and well-understood behavior. Cost is negligible at corpus scale (< $1 for full multilingual corpus). ADR-032 provides the migration procedure; ADR-120 establishes the multilingual quality evaluation strategy and domain-adapted embeddings as a later-stage research track. *(Resolved by ADR-032, ADR-120; multilingual benchmarking deferred to Phase 11 when translated content exists.)*
2. **AI provider:** Claude via AWS Bedrock with model tiering — Haiku for real-time search (query expansion, intent classification, passage ranking), Opus for offline batch tasks (theme tagging, vocabulary extraction, relation classification). *(Resolved by ADR-110.)*
3. **Single database vs. multi-database:** Single-database architecture (Neon only, no DynamoDB). Simplicity over ecosystem conformity. *(Resolved by ADR-109.)*
4. **Language URL convention:** Hybrid approach — locale path prefix on frontend pages (`/hi/books/...`), `language` query parameter on API routes (`/api/v1/search?language=hi`). *(Resolved by ADR-091.)*

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

### In Scope

- **Free access** to Yogananda's published books and SRF/YSS publications
- **Multi-language support** (English + all translated languages). Initial target: es, de, fr, it, pt, ja (matching convocation site), then hi, bn (Yogananda's heritage languages, YSS audience). See ADR-020, ADR-022.
- **Intelligent Query Tool** — users ask questions and search across the entire library of books to find specific answers (e.g., "How do I deal with fear?")
- **Life-theme navigation** — curated thematic entry points (Peace, Courage, Healing, Joy, Purpose, Love) so seekers can explore without needing to formulate a search query
- **Today's Wisdom** — a different Yogananda passage on each visit, creating a living, dynamic homepage
- **The Quiet Corner** — a micro-sanctuary page with a single affirmation and optional gentle timer, for the moment of immediate need
- **Audio/video content** — integration with SRF's YouTube repository of monastic How-to-Live talks
- **Events section** — lightweight signpost linking to World Convocation, commemorations, Online Meditation Center, and retreats (not a duplicate of existing event sites)
- **Sacred Places** — contemplative geography of SRF/YSS properties and biographical sites from Yogananda's life, cross-referenced with book passages. "See This Place" via Google Street View links; "Get Directions" via native maps. No embedded map library (ADR-047).
- Additional features to be announced by SRF

### Explicitly Out of Scope

- **SRF Lessons** — the progressive home-study program is reserved and private. This portal does not include Lesson content, Kriya Yoga technique instruction, or any materials requiring the Lessons Pledge. (Note: the architecture is designed to accommodate future Lessons integration for authorized students if SRF decides to pursue this — see ADR-081 and the "Future Consideration: SRF Lessons" section under Content Scope. No Lessons code ships in any current phase.)

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
| **YSS (Yogoda Satsanga Society of India)** | Hindi and Bengali translations of Yogananda's works. Indian subcontinent audience. Organizational branding considerations for Indian-language portal content. |

---

## Operational Staffing (Requires SRF Input)

The editorial review portal (ADR-064) provides tooling for content governance. But tooling without humans is empty. The following operational roles require dedicated staff time, and SRF must determine *who* fills each role before Phase 5 launches the editorial workflows.

| Role | Responsibility | Estimated Time | Phase Needed |
|------|---------------|----------------|--------------|
| **Content editor** | Theme tag review, daily passage curation, calendar event management | 2–3 hours/day | Phase 5 |
| **Theological reviewer** | Final approval on theme associations, editorial thread accuracy | Periodic (high-stakes, low-frequency) | Phase 5 |
| **On-call engineer** | Sentry alert response, infrastructure monitoring, Neon health | As needed (shared with AE team) | Phase 1 |
| **Book ingestion operator** | Run ingestion pipeline for new books, coordinate human QA | Per-book (1–2 days per ingestion cycle) | Phase 5 |
| **Social media reviewer** | Review quote images and captions, distribute to platforms | 20–30 min/day | Phase 9 |
| **Translation reviewer** | Compare AI-drafted translations with English source, approve/correct | Batch sessions (per language sprint) | Phase 11 |
| **Impact report curator** | Curate "What Is Humanity Seeking?" data into narrative report | Annual | Phase 11+ |

**Key question for SRF:** Does the monastic order, the AE team, a dedicated content editor, or some combination own these responsibilities? The answer shapes Phase 5's editorial workflow design.

---

## Theological and Ethical Constraints

### Sacred Text Fidelity

Yogananda's published works are considered sacred teachings transmitted through a realized master. The portal must maintain absolute fidelity to the original text. AI features must **never** generate content that could be mistaken for Yogananda's words, paraphrase his teachings, or interpret meditation techniques.

**Multi-language fidelity:** The portal serves only official SRF/YSS translations. Machine translation of Yogananda's words is never acceptable — even slight paraphrasing can distort spiritual meaning. If an official translation does not exist for a language, the book is not available in that language. The portal is honest about content availability rather than substituting machine-generated translations. English fallback content is clearly marked. (See ADR-020.)

### DELTA Framework (Faith-Based AI Ethics)

| Principle | Portal Implication |
|-----------|-------------------|
| **Dignity** | User data never sold or used for advertising. Users are seekers, not data points. |
| **Embodiment** | The portal should encourage users to put down the device and practice — meditate, do the Energization Exercises, attend a local temple. |
| **Love** | UI copy, error messages, and AI responses must reflect compassion. |
| **Transcendence** | No gamification (leaderboards, streaks, badges). Spiritual depth is not quantifiable. |
| **Agency** | Users control their experience. No algorithmic manipulation or coercive retention tactics. |

### Accessibility as Theological Imperative

The DELTA Dignity principle and the project's mission — making the teachings "available freely throughout the world" — demand that the portal be accessible to all seekers regardless of physical ability. A portal that excludes blind, deaf, or motor-impaired seekers contradicts its own purpose.

Accessibility is therefore not a polish phase or a nice-to-have. It is a Phase 2 requirement:

- **WCAG 2.1 AA** conformance from the first commit
- Semantic HTML, ARIA landmarks, keyboard navigation, screen reader support
- Color contrast compliance (minimum 4.5:1 for text, 3:1 for large text)
- `prefers-reduced-motion` support for users with vestibular disorders
- Performance budgets that serve seekers on low-bandwidth mobile connections (India, Africa, Latin America)

Phase 12 exists for formal audit, advanced features (TTS, dark mode, high-contrast), and third-party testing — not for introducing accessibility after the fact. See ADR-017.

### Multilingual from the Foundation

The philanthropist's question was about making Yogananda's books "available freely throughout the world." The world speaks thousands of languages. Multilingual support is not a late-stage feature to be bolted on — it is a foundational architectural principle that shapes every design decision from Phase 1 onward.

**What this means in practice:**

- **Schema:** Every content table carries a `language` column from the first migration. Cross-language linking (`canonical_book_id`, `canonical_chunk_id`) is built into the data model, not retrofitted.
- **API:** Every content-serving endpoint accepts a `language` parameter. URL structure uses locale prefixes (`/es/search`, `/de/quiet`). Theme slugs stay in English for URL stability; display names are localized.
- **Search:** The embedding model is multilingual by explicit requirement — Phase 1 embeddings remain valid when Phase 11 adds new languages. The hybrid search function accepts `search_language` and uses language-appropriate PostgreSQL dictionaries. English fallback is implemented at the service layer.
- **UI:** All strings are externalized to locale files (`messages/*.json`) from Phase 2. CSS logical properties (`margin-inline-start` not `margin-left`) are used throughout, ensuring RTL languages work without refactoring. The `lang` attribute is set on `<html>`.
- **Content fidelity:** Only official SRF/YSS human translations are served. Machine translation of Yogananda's words is never acceptable (see Sacred Text Fidelity above). If an official translation does not exist, the book is unavailable in that language — the portal is honest about content availability.

Phase 1 launches in English only, but the architecture is locale-ready. Phase 11 activates multilingual content. The gap between "English only" and "multilingual" should require zero schema migrations, zero API changes, and zero search function rewrites — only content ingestion and UI string translation. If a design decision today would require rework to support a new language tomorrow, the design is wrong. (See ADR-020, ADR-021, ADR-022, ADR-023.)

### Calm Technology Principles

The portal must embody "plain living and high thinking":
- Clean, minimal interfaces with generous whitespace ("digital silence")
- Earth tones: warm woods, sky blues, muted greens — no neon, no high-contrast commercial CTAs
- No aggressive notifications, no dopamine loops, no attention-harvesting
- Serif typography for book text, evoking the experience of reading a physical book
- Meditation modes should fade the technology into the background

### Human Review as Mandatory Gate

No user-facing content reaches seekers without human verification. This principle governs every content workflow in the portal:

- **Theme tags:** Auto-classified tags (`tagged_by = 'auto'`) are never served to users. Only `manual` and `reviewed` tags appear on theme pages. (ADR-048)
- **Translations:** Claude drafts UI translations; mandatory human review by fluent, SRF-aware reviewers before production. (ADR-023)
- **Social media:** The portal generates quote images and suggested captions; humans review and post. Never auto-post. (ADR-019)
- **Ingestion QA:** Claude flags probable OCR errors; humans make every correction decision. (ADR-049 E4)
- **Accessibility ratings and tone classifications:** Claude classifies at ingestion; humans spot-check. (ADR-049 E3, E8)

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

- When search returns no results, the portal says so honestly rather than stretching to find something. (ADR-003)
- When a book is not available in a language, it is simply not listed — no machine translation substitute. (ADR-020)
- When English fallback content supplements a seeker's language, it is always clearly marked with an `[EN]` tag — never silently substituted. (ADR-020)
- The Library page shows what exists, not what's promised. "More books are being added" is truthful and forward-looking. No fixed promises, no dates.
- Content availability per language is asymmetric — some languages have more books than others. This asymmetry is visible and honest, not hidden.

### 10-Year Architecture Horizon

This portal is designed for a decade of service, not a sprint to launch. Every architectural decision is evaluated against a 10-year maintenance horizon. (ADR-033)

What this means in practice:
- **Data lives in PostgreSQL.** The relational model, the embeddings, the search index — all in a single durable database. No vendor-specific data formats that require migration when a service sunsets.
- **Business logic is framework-agnostic.** All logic in `/lib/services/`, pure TypeScript. The Next.js layer is a presentation shell. If Next.js is replaced in year 5, the services survive.
- **Migrations are raw SQL.** dbmate, not an ORM's migration generator. SQL is readable, debuggable, and will outlive any ORM.
- **Dependencies are commitments.** Every npm package, every API integration, every SaaS tool is a maintenance obligation for 10 years. Choose fewer, more durable dependencies.
- **Components are tiered by replaceability.** Tier 1 (permanent): PostgreSQL, the service layer, the data model. Tier 2 (stable): Next.js, Vercel, Contentful. Tier 3 (replaceable): specific npm packages, Claude model versions, embedding model versions.
- **Documentation is a permanent artifact.** CLAUDE.md, CONTEXT.md, DESIGN.md, DECISIONS.md, ROADMAP.md — these files are as important as the code. New maintainers in year 7 should understand every decision.

### Spiritual Design Principles

The constraints above are architectural and ethical. This section names something subtler: the inner orientation that shapes how those constraints are applied. Architecture can be correct and still miss the mark. These principles address the quality of attention the portal brings to the seeker's experience.

**The portal's deepest purpose is to become unnecessary.** Yogananda's tradition holds that the direct experience of God — through meditation — supersedes all scripture. The portal exists in the domain the teachings themselves say is secondary to practice. This is not a contradiction; it is a creative tension the design must hold honestly. The portal should create openings for stillness, not just deliver text. The Quiet Corner, the "Breath Between Chapters," the Dwell mode, and the practice bridges (ADR-095, ADR-102) all serve this: moments where the portal gently suggests that the next step is not another passage, but silence.

**Joy is a design value alongside compassion.** The empathic entry points (ADR-035, ADR-114) rightly meet seekers in suffering — grief, fear, anxiety, loss. But Yogananda's teachings are also profoundly joyful. "Ever-new Joy" is perhaps his most characteristic phrase. The portal should carry this quality: moments of unexpected beauty, delight in the teachings, warmth that is not merely calming but alive. Today's Wisdom, "Show Me Another," the opening threshold — these are opportunities for joy, not just serenity.

**Editorial stewardship is a sacred act.** The people who select the daily passage, review theme tags, curate the "Seeking..." entry points, and approve translations are performing a form of spiritual service. They stand between the source text and the seeker's screen. The operational staffing table (§ Operational Staffing) identifies the roles; this principle names what those roles carry. The architecture can provide tools and workflows, but the inner quality of the people using them matters. This is a question for SRF, not for the codebase — but the architecture should honor it by making editorial work contemplative rather than transactional.

**Crisis-adjacent content carries responsibility.** The portal will reach people in acute distress. The grief entry point (ADR-114) targets seekers searching "what happens after death" and "spiritual comfort after loss." Some of these seekers may be in active danger. Yogananda's passages about the immortality of the soul and the freedom of death are truthful, but without context could be read in unintended ways. The portal's response is not to withhold the teachings but to quietly, non-intrusively provide crisis resources alongside content that touches on death, suffering, and despair. Not a modal, not a gate — a gentle presence. (ADR-122)

**The unmeasurable encounter is the highest success.** The metrics section (§ Measuring Success) carefully avoids engagement metrics. But the portal's highest impact will be in encounters that no analytics system can capture: the person who found exactly the right words at 2 AM, the seeker in rural India who read about meditation and sat quietly for the first time, the grieving parent who felt less alone. These encounters are the mission fulfilled. The "What Is Humanity Seeking?" dashboard (ADR-094, ADR-113) is the portal's best answer to the measurement problem — shifting the narrative from "how many users" to "what is the world asking." That reframing is itself a teaching about what matters.

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

The teaching portal should use these technologies wherever possible, introducing new tools only when the established stack cannot meet a requirement (e.g., pgvector for vector search, Claude via AWS Bedrock for AI features — ADR-110).

---

## Content Scope

### Phase 1 Focus Book

**Autobiography of a Yogi** by Paramahansa Yogananda — the most widely read and accessible of Yogananda's works. Available in multiple editions and translations.

### Broader Corpus (Phase 5+)

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
- Self-Realization Magazine archives (Yogananda's articles as searchable teachings, monastic articles as opt-in commentary — ADR-105)
- Other SRF/YSS publications

### Audio Recordings (Phase 14+)

SRF possesses audio recordings of Paramahansa Yogananda's own voice — lectures, informal talks, guided meditations, and chanting. These are sacred artifacts and content simultaneously. Yogananda's voice recordings are among the most direct expressions of his teachings; no book passage can substitute for hearing the Master speak. The portal will treat these with reverence in presentation and with full indexing for discoverability.

SRF also produces modern audio recordings: monastics reading from published works, guided meditations, and chanting sessions.

Audio recordings are a first-class content type in the portal architecture (ADR-078), with their own data model, transcription pipeline (Whisper → human review), and search integration alongside books and video.

### Unreleased and Forthcoming Materials

SRF has indicated that additional unreleased materials exist — books, audio, and video. The architecture accommodates new content types gracefully, with no schema migrations required for standard additions to the book or audio catalog.

### Future Consideration: SRF Lessons

The SRF Home Study Lessons are the organization's core spiritual curriculum — sequential private instruction in meditation and Kriya Yoga. They are **explicitly out of scope** for the public portal. However, SRF has indicated they might eventually be incorporated for authorized students (those enrolled in the Lessons) and Kriya Yoga initiates (kriyabans). This may never happen, or may be years away. The architecture is designed so it is not structurally impossible (ADR-081), but no Lessons-specific code ships in any current phase.

### Phase 1 Content Sources

For Phase 1 development, PDFs are available at https://spiritmaji.com/. These are unofficial scans and would be replaced with authoritative SRF-provided digital text for production.

---

## Key Terminology

| Term | Meaning |
|------|---------|
| **SRF** | Self-Realization Fellowship, founded 1920 by Paramahansa Yogananda |
| **YSS** | Yogoda Satsanga Society of India (SRF's sister organization) |
| **Kriya Yoga** | Sacred meditation technique — NOT to be discussed or documented in this portal |
| **Satsanga** | Spiritual fellowship; gathering of truth-seekers |
| **AE** | Audience Engagement (SRF's digital/technology team) |
| **IDP** | Internal Developer Platform (SRF's standardized project templates in GitLab) |
| **Convocation** | Annual SRF World Convocation gathering |
| **How-to-Live Talks** | Inspirational talks by SRF monastics, many available on YouTube |

---

*Last updated: 2026-02-21*
