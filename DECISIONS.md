# SRF Online Teachings Portal — Architecture Decision Records

Each decision is recorded with full context so future contributors understand not just *what* was decided but *why*, and what alternatives were considered.

### Index by Concern

**Foundational Constraints**
- ADR-001: Direct Quotes Only — No AI Synthesis
- ADR-002: Personalization with Restraint — DELTA-Aligned Feature Boundaries
- ADR-003: Accessibility as Phase 2 Foundation
- ADR-004: Architecture Longevity — 10-Year Design Horizon
- ADR-005: Claude AI Usage Policy — Permitted Roles, Prohibited Uses, and Expansion Roadmap
- ADR-006: Global Equity — Serving Earth's Underserved Seekers
- ADR-007: Curation as Interpretation — The Fidelity Boundary and Editorial Proximity Standard

**Architecture & Platform**
- ADR-008: Next.js + Vercel for Frontend
- ADR-009: Neon + pgvector for Vector Search
- ADR-010: Contentful as Editorial Source of Truth (Production)
- ADR-011: API-First Architecture for Platform Parity
- ADR-012: Progressive Web App as Mobile Intermediate Step
- ADR-013: Single-Database Architecture — No DynamoDB
- ADR-014: AWS Bedrock Claude with Model Tiering
- ADR-015: Phase 1 Uses Vercel, Not AWS Lambda/DynamoDB
- ADR-016: Infrastructure as Code from Phase 3 (Terraform)
- ADR-017: Terraform-Native Lambda
- ADR-018: CI-Agnostic Deployment Scripts
- ADR-019: Database Backup to S3
- ADR-020: Multi-Tenant Infrastructure Design
- ADR-021: Redundancy, Failover, and Regional Distribution Strategy
- ADR-022: Content-Addressable Passage Deep Links
- ADR-023: Search API Rate Limiting and Abuse Prevention
- ADR-024: Native Share API as Primary Mobile Sharing
- ADR-025: PDF Generation Strategy — Resource-Anchored Exports
- ADR-026: Low-Tech and Messaging Channel Strategy
- ADR-027: Language API Design — Locale Prefix on Pages, Query Parameter on API
- ADR-028: Remove book_store_links Table — Simplify Bookstore Links

**Content & Data Model**
- ADR-029: Autobiography of a Yogi as Phase 1 Focus
- ADR-030: Book Ingestion Priority — Life-Impact Over Scholarly Significance
- ADR-031: Teaching Topics — Curated Thematic Entry Points
- ADR-032: Teaching Topics Multi-Category Taxonomy and Semi-Automated Tagging Pipeline
- ADR-033: Exploration Theme Categories — Persons, Principles, Scriptures, Practices, Yoga Paths
- ADR-034: Edition-Aware Content Model
- ADR-035: Image Content Type — Photographs as First-Class Content
- ADR-036: People Library — Spiritual Figures as First-Class Entities
- ADR-037: Monastic & Presidential Lineage in the People Library
- ADR-038: Living Glossary — Spiritual Terminology as User-Facing Feature
- ADR-039: Content Integrity Verification
- ADR-040: Magazine Integration — Self-Realization Magazine as First-Class Content
- ADR-041: Phase 1 Bootstrap Ceremony
- ADR-042: Sacred Image Usage Guidelines
- ADR-043: Structured Spiritual Ontology — Machine-Readable Teaching Structure

**Search & AI**
- ADR-044: Hybrid Search (Vector + Full-Text)
- ADR-045: Claude API for AI Features
- ADR-046: Embedding Model Versioning and Migration
- ADR-047: Multilingual Embedding Quality Strategy
- ADR-048: Chunking Strategy Specification
- ADR-049: Search Suggestions — Corpus-Derived, Not Behavior-Derived
- ADR-050: Related Teachings — Pre-Computed Chunk Relations and Graph Traversal
- ADR-051: Terminology Bridge Per-Book Evolution Lifecycle
- ADR-052: Passage Resonance Signals — Content Intelligence Without Surveillance
- ADR-053: "What Is Humanity Seeking?" — Anonymized Search Intelligence

**Cross-Media**
- ADR-054: YouTube Integration via Hybrid RSS + API with ISR
- ADR-055: Video Transcript Time-Synced Architecture
- ADR-056: Platform-Agnostic Video Model and Documentary Integration
- ADR-057: Audio Library and Cross-Media Audio Search
- ADR-058: AI Audio Generation for Portal Audio Assets
- ADR-059: Chant Reader — Devotional Poetry with Deterministic Cross-Media Linking
- ADR-060: Unified Content Hub — Cross-Media Relations, Search, and Theming
- ADR-061: Knowledge Graph Visualization
- ADR-062: Knowledge Graph Cross-Media Evolution — All Content Types as Graph Nodes
- ADR-063: Digital Watermarking Strategy for SRF Images
- ADR-064: Multi-Size Image Serving and Download Options

**Seeker Experience**
- ADR-065: SRF-Derived Design System with Calm Technology Principles
- ADR-066: Lotus Bookmark — Account-Free Reading Bookmarks
- ADR-067: Non-Search Seeker Journeys — Equal Excellence for Every Path
- ADR-068: Passage Sharing as Organic Growth Mechanism
- ADR-069: Events and Sacred Places — Signpost, Not Destination
- ADR-070: Sacred Places — No Embedded Map, Street View Links Instead
- ADR-071: Crisis Resource Presence — Gentle Safety Net on Grief and Death Content
- ADR-072: Cognitive Accessibility — Reducing Complexity for All Seekers
- ADR-073: Screen Reader Emotional Quality — Warmth in Spoken Interface
- ADR-074: Micro-Copy as Ministry — Editorial Voice for UI Text

**Internationalization**
- ADR-075: Multi-Language Architecture — Three-Layer Localization
- ADR-076: CSS Logical Properties from Phase 2
- ADR-077: Hindi and Bengali in Locale Roadmap
- ADR-078: AI-Assisted Translation Workflow
- ADR-079: YSS Organizational Branding and Locale Strategy
- ADR-080: Sanskrit Display and Search Normalization Policy
- ADR-081: Machine-Readable Content and AI Citation Strategy

**Staff & Community**
- ADR-082: Staff Experience Architecture — Five-Layer Editorial System
- ADR-083: Study Workspace — Universal Teaching Tools Without Authentication
- ADR-084: DELTA-Compliant Seeker Feedback Mechanism
- ADR-085: Lessons Integration Readiness
- ADR-086: Community Collections — Tiered Visibility Public Curation
- ADR-087: VLD Editorial Delegation — Volunteer Curation Pipeline

**Brand & Communications**
- ADR-088: SRF Imagery Strategy in the Portal
- ADR-089: "The Librarian" — AI Search Brand Identity
- ADR-090: "What Is Humanity Seeking?" as Strategic Communications Asset
- ADR-091: Daily Email — Verbatim Passage Delivery
- ADR-092: Social Media Strategy — Portal-Generated Assets, Human Distribution

**Operations & Engineering**
- ADR-093: Engineering Standards for SRF Projects
- ADR-094: Testing Strategy
- ADR-095: Observability Strategy
- ADR-096: Design Tooling — Figma
- ADR-097: MCP Server Strategy — Development Tooling for AI Implementation
- ADR-100: AI Editorial Workflow Maturity — Trust Graduation and Feedback Loops
- ADR-101: MCP as Three-Tier Corpus Access Layer — Development, Internal, and External

**Governance**
- ADR-098: Documentation Architecture — Five-Document System with AI-First Navigation
- ADR-099: Global Privacy Compliance — DELTA as GDPR Superstructure
---

## ADR-001: Direct Quotes Only — No AI Synthesis

- **Status:** Accepted (FIRM — foundational requirement)
- **Date:** 2026-02-17

### Context

The Intelligent Query Tool could operate in two modes:

1. **Synthesis mode:** AI reads retrieved passages and generates a natural-language answer in its own words, citing sources.
2. **Librarian mode:** AI finds and ranks the most relevant passages but the user reads only Yogananda's verbatim text.

### Decision

**Librarian mode only.** The AI's role is strictly limited to:
- Expanding user queries into semantic search terms
- Ranking retrieved passages by relevance
- Identifying highlight boundaries within long passages

The AI **never**:
- Generates text that could be mistaken for Yogananda's words
- Paraphrases, summarizes, or synthesizes across passages
- Interprets meditation techniques or spiritual practices
- Answers questions not addressable from the corpus

### Rationale

- **Sacred text fidelity:** Yogananda's words are considered transmitted teachings from a realized master. Even subtle paraphrasing can distort meaning. "God-consciousness" and "cosmic consciousness" are not interchangeable in this tradition.
- **Hallucination risk:** LLMs generate plausible but incorrect statements. In a spiritual context, a hallucinated teaching could be spiritually harmful.
- **Trust:** Users can verify every result against the source text. There is nothing to hallucinate because the AI generates no content.
- **Theological alignment:** The DELTA framework principle of Agency — the AI facilitates access to the teachings, it does not become a teacher.
- **Simplicity:** The Librarian model is architecturally simpler, cheaper (fewer LLM tokens), and more reliable than synthesis.

### Consequences

- **Chunking quality is paramount.** Each chunk must be a coherent, self-contained passage suitable for display as a standalone quote.
- **The "Read in context" link is critical.** Every search result must deep-link to the full chapter view, positioned at that passage.
- **The "no results" case must be handled gracefully.** When the corpus doesn't address a query, the system must say so honestly rather than stretching to find something.
- **The AI's output format is constrained.** Query expansion returns a JSON array of terms. Passage ranking returns a JSON array of IDs. No prose output.
- **Consolidated in ADR-005:** The full Claude AI Usage Policy — permitted roles, prohibited uses, output format constraints, and expansion roadmap — is maintained in ADR-005.

---

## ADR-002: Personalization with Restraint — DELTA-Aligned Feature Boundaries

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Modern web platforms use personalization extensively: behavioral recommendations, activity tracking, engagement metrics, push notifications. These techniques are designed to maximize time-on-site and retention — goals that directly conflict with the Calm Technology principles and DELTA framework governing this portal.

However, some personalization is genuinely helpful. A seeker who bookmarks a passage about courage should be able to find it again. A reader in Japan should see the portal in Japanese. The question is: where is the line?

### Decision

Classify personalization features into three tiers:

**Build (genuinely helpful):**

| Feature | Rationale | Phase |
|---------|-----------|-------|
| Language preference | Fundamental accessibility. Stored in cookie or account. | 11 |
| Font size / reading preferences | Accessibility. Local storage, no account needed. | 4 |
| Bookmarks ("My Passages") | Lets seekers curate a personal anthology of passages that moved them. | 4 (localStorage), 15 (server sync) |
| Reading position | Saves your place in a book. Basic reader functionality. | 15 |

**Build with caution:**

| Feature | The Concern | Constraint |
|---------|-------------|------------|
| Search history | Could feel like surveillance | Opt-in only. User can clear at any time. Never surfaced publicly. Deletable. |
| Theme preference for daily passage | If based on behavioral inference, this is algorithmic curation | Implement as explicit user choice ("I'd like more passages about Peace") — never inferred from behavior |

**Do not build:**

| Feature | Why Not |
|---------|---------|
| Reading streaks / activity tracking | Violates DELTA Transcendence principle. Reduces spiritual practice to metrics. |
| "You've read X books this month" | Gamification in disguise |
| "Recommended for you" (behavioral) | Netflix model. Violates DELTA Agency principle. Antithetical to Calm Technology. |
| Social features (public profiles, shared highlights) | The portal is a private sanctuary, not a social network |
| Push notifications | Antithetical to Calm Technology. The portal waits; it does not interrupt. |
| Engagement dashboards for users | Optimizes for screen time, which the DELTA Embodiment principle discourages |

### Rationale

- **DELTA Agency:** Users must retain full control. No algorithmic manipulation. Explicit choices only.
- **DELTA Embodiment:** The portal should encourage logging off and practicing — not maximizing session length.
- **DELTA Transcendence:** Spiritual depth is not quantifiable. No metrics, leaderboards, or streaks.
- **Calm Technology:** Technology should require the smallest possible amount of attention. Personalization that demands ongoing interaction (maintaining streaks, checking notifications) violates this.
- **Practical:** Every personalization feature requires user accounts, data storage, privacy policies, and GDPR compliance. Minimizing personalization reduces operational complexity.

### Consequences

- Phase 15 (Optional User Accounts) remains the appropriate phase for bookmark/reading-position features
- The "personalized daily passage" in Phase 15 must use explicit theme preference, not behavioral inference
- The portal's anonymous experience (Phases 1–14) must be excellent without any personalization — personalization enhances but never gates the core experience

---

## ADR-003: Accessibility as Phase 2 Foundation

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The original roadmap placed accessibility in Phase 12 ("Calm Technology Polish & Accessibility"). This is too late. Retrofitting accessibility is expensive and error-prone; building it in from day one is nearly free if the right structural choices are made at the start.

SRF's audience includes elderly devotees, seekers in developing countries on low-end devices, and visually impaired users. The Gemini research document specifically notes visually impaired devotees who described the SRF app's screen reader support as "transformative." Accessibility is not a feature — it is a theological imperative per SRF's mission to serve "all of humanity" and the DELTA framework's Dignity principle.

| Approach | Cost | Risk |
|----------|------|------|
| **Phase 2 (build in)** | Low — semantic HTML, ARIA, keyboard nav are free if done from the start | None — this is best practice |
| **Phase 12 (retrofit)** | High — requires auditing and rewriting markup, fixing tab order, adding ARIA after the fact | Significant — inaccessible patterns get baked into components and propagated |

### Decision

Move **core accessibility** from Phase 12 to **Phase 2**. Phase 12 becomes the audit and polish phase (professional WCAG audit, native TTS, advanced reading mode), not the "add accessibility" phase.

**Phase 2 accessibility requirements:**

| Category | Requirements |
|----------|-------------|
| **Structure** | Semantic HTML (`<article>`, `<nav>`, `<main>`, `<header>`, `<footer>`). ARIA landmark regions. Strict heading hierarchy (`h1` → `h2` → `h3`). Skip-to-content link. |
| **Vision** | All text meets WCAG AA contrast ratios (4.5:1 body, 3:1 large). Alt text on all images. Text reflows at 200% zoom. Font size control (A-/A+). Respect `prefers-contrast: more`. No color-only meaning. |
| **Motor** | Full keyboard navigation. Visible focus indicators. 44x44px minimum touch targets. No hover-only interactions. No time-limited interactions (Quiet Corner timer is optional). |
| **Hearing** | Quiet Corner chime has visual equivalent (gentle brightness change + text). Request corrected YouTube captions from SRF. |
| **Cognitive** | Consistent navigation. No autoplay. No flashing. Clear UI language. Respect `prefers-reduced-motion`. Predictable behavior. |
| **Performance** | < 100KB initial load. Lazy-loaded images. `font-display: swap`. Progressive enhancement. |
| **Reading** | Basic reading mode: font size adjustment, line spacing control, dark mode toggle for evening reading. |

**Phase 12 (reframed as "Accessibility Audit & Polish"):**
- Professional WCAG 2.1 AA audit (automated + manual + real assistive technology users)
- Native TTS "Listen" button in the reader (Web Speech API)
- Advanced reading mode (sepia, custom fonts, reading ruler)
- Testing with VoiceOver, NVDA, JAWS, TalkBack
- Testing on low-end devices and slow networks
- Remediation of any audit findings

### Critical: Color Contrast Fix

The existing design tokens have contrast failures that must be corrected before any implementation:

| Combination | Current Ratio | Required | Fix |
|-------------|--------------|----------|-----|
| `--portal-text-muted` (#6B6B6B) on `--portal-bg` (#FAF8F5) | 4.1:1 | 4.5:1 | Darken to `#595959` (5.3:1) |
| `--portal-text-muted` (#6B6B6B) on `--portal-quote-bg` (#F9F6F1) | 3.9:1 | 4.5:1 | Same fix — `#595959` |
| `--srf-gold` (#DCBD23) as text on `--portal-bg` (#FAF8F5) | 2.4:1 | 3:1 (large) | Gold is for borders/accents only, never text on light backgrounds |

### Rationale

- **Theological:** SRF's mission is to serve all of humanity. "All" includes people with disabilities.
- **DELTA Dignity:** Treating users as inherently worthy means not excluding them through inaccessible design.
- **Practical:** Semantic HTML and keyboard navigation take no extra effort when done from the start. They take massive effort to retrofit.
- **Legal:** WCAG compliance is increasingly a legal requirement in the US (ADA), EU (European Accessibility Act), and other jurisdictions.
- **SRF precedent:** The SRF app already invested in screen reader support. The portal should meet or exceed that standard.

### Consequences

- Every component built in Phases 1–2 must pass basic accessibility checks (Lighthouse, axe DevTools)
- The design token `--portal-text-muted` must be corrected to `#595959` before implementation begins
- `--srf-gold` must never be used as text on light backgrounds
- Phase 12 scope shrinks (audit and polish, not build-from-scratch) but gains TTS and professional audit

---

## ADR-004: Architecture Longevity — 10-Year Design Horizon

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The teaching portal serves Yogananda's published works — content that is timeless. The portal itself should be designed for a decade of service. This doesn't mean nothing changes; it means nothing needs to be thrown away and rebuilt from scratch. Every component should be replaceable incrementally.

This ADR documents the longevity analysis and the specific design choices that protect the portal's long-term viability.

### Decision

Design for **graceful evolution** over a 10-year horizon. The architecture prioritizes durable formats and replaceable components.

#### Durability Tiers

**Tier 1 — Effectively Permanent (10+ years, no migration expected):**

| Component | Why It Lasts |
|-----------|-------------|
| PostgreSQL (Neon) | 35+ years old. Industry standard. Growing adoption. |
| SQL migrations (dbmate) | Raw SQL. No framework dependency. A 2026 migration runs in 2036. |
| The data model (books, chapters, chunks, themes, places) | The content is Yogananda's published works. The schema models reality. |
| REST + JSON APIs | HTTP is the internet's substrate. 20+ years dominant. |
| HTML + CSS | The web platform is permanent. Semantic HTML from 2026 renders in 2036. |
| Terraform HCL | Since 2014. Massive enterprise adoption. OpenTofu fork as insurance. |
| ADRs (DECISIONS.md) | Markdown in Git. The most durable artifact in the project. |
| WCAG accessibility standards | 2.1 stable since 2018. 3.0 is backwards-compatible. |

**Tier 2 — Stable, May Need Version Upgrades (5-7 years):**

| Component | Risk | Mitigation |
|-----------|------|------------|
| pgvector | Extension is PostgreSQL-native. Strong momentum. | Standard float arrays. No proprietary format. |
| Embedding models | AI model landscape evolving rapidly. | `embedding_model` column tracks which model generated each vector. Incremental re-embedding. (ADR-046) |
| next-intl | Popular i18n library for Next.js. | Locale JSON files are framework-agnostic. The files survive even if the library changes. |

**Tier 3 — Expect Replacement in 5-10 Years:**

| Component | Risk | Mitigation |
|-----------|------|------------|
| Next.js | JS framework churn cycle: 5-7 years. | Shared service layer (ADR-011). Business logic in `/lib/services/` has zero framework dependency. UI rewrite against same APIs. |
| Vercel | Platform risk. Pricing changes. Acquisition. | Next.js deploys to any Node.js host. Vercel-specific features (ISR, Edge) have equivalents elsewhere. |
| Contentful | CMS market volatility. Pricing increases. | Content synced to Neon. Search index doesn't depend on Contentful availability. Swap CMS, rebuild webhook sync. |
| Auth0 | Acquired by Okta. Pricing trajectory. | Standard OAuth 2.0 / OIDC. Any identity provider implements the same protocols. |
| Claude API | Anthropic's product direction. AI market evolution. | Stateless usage (query expansion, passage ranking). Prompts in service layer. Swap to any LLM. |
| Amplitude | Analytics tool churn. | DELTA allowlist = ~5 events. Trivial to migrate to any analytics tool. |
| Figma | Design tool competition. | Design tokens export to `tokens.json`. The tokens are the durable artifact. |

#### The Five Longevity Guarantees

1. **All data in PostgreSQL.** Nothing lives exclusively in a SaaS tool. Contentful syncs *to* Neon. Amplitude receives *from* the app. If any SaaS tool disappears, the data is in PostgreSQL.

2. **Business logic is framework-agnostic.** `/lib/services/` is pure TypeScript. No Next.js imports. No Vercel imports. A framework migration rewrites the UI layer (~40% of code), not the business logic (~60%).

3. **Raw SQL migrations.** dbmate migrations are `.sql` files that don't depend on an ORM version, a TypeScript compiler version, or a framework version. They outlive everything else in the codebase.

4. **Standard protocols, not proprietary integrations.** OAuth 2.0 for auth. REST + JSON for APIs. SQL for data. HTTP for communication. `hreflang` for i18n. Every integration uses industry standards, not vendor-specific SDKs, at the boundary layer.

5. **Decisions are documented.** ADRs capture *why* every choice was made. When a future team evaluates replacing a component, they understand the original constraints and can make an informed decision rather than guessing.

#### Content Export Capability

The portal can export its entire content graph at any time via standard PostgreSQL tools:

```bash
# Full data export
pg_dump --format=custom --no-owner portal_db > portal_export.dump

# Restore to any PostgreSQL instance
pg_restore --no-owner -d new_portal_db portal_export.dump
```

This is inherent in using PostgreSQL — not a feature to build, but a capability to document and protect. The export includes all books, chapters, chunks, embeddings, themes, places, passage cross-references, and subscriber data.

### Rationale

- **The content is permanent.** Yogananda's published works don't change. A portal that makes them accessible should outlive any single technology trend.
- **SRF institutional continuity.** SRF has existed since 1920. The portal should be designed for an organization that thinks in decades, not quarters.
- **Total cost of ownership.** A 10-year architecture that evolves incrementally costs far less than a 5-year architecture that requires a ground-up rewrite.
- **The service layer is the key insight.** Most web applications that "don't last" failed because business logic was embedded in a framework that became obsolete. The shared service layer (ADR-011) is the single most important longevity decision — it separates what endures (logic) from what changes (presentation).

### Consequences

- All architectural decisions are evaluated against a 10-year horizon, not just immediate needs
- The shared service layer convention (ADR-011) is treated as the project's most important structural rule
- Component replacement is expected and planned for — it's maintenance, not failure
- The search quality test suite (deliverable 1.11) serves as the acceptance gate for any AI model migration
- Future developers can replace any Tier 3 component without touching Tier 1 or Tier 2 components
- `pg_dump` export capability is documented as a deliberate architectural feature

---

## ADR-005: Claude AI Usage Policy — Permitted Roles, Prohibited Uses, and Expansion Roadmap

**Status:** Accepted | **Date:** 2026-02-18

### Context

Claude API is used throughout the portal in carefully constrained roles. The governing metaphor — "the AI is a librarian, not an oracle" (ADR-001) — is well-established, but the specific permitted uses, hard prohibitions, and future expansion opportunities were scattered across ADR-001, ADR-045, ADR-092, ADR-078, and ADR-032 with no single authoritative reference. This created two risks:

1. **Scope creep:** An engineer might add a chatbot or synthesis feature because "Claude can do it" without understanding the theological constraints.
2. **Scope fear:** An engineer might avoid a valuable Claude use case because the boundaries weren't clear.

This ADR consolidates the Claude AI policy into a single reference and establishes the roadmap for high-value expansions that stay within the librarian model.

### The Librarian Model

Claude's role in the portal follows one principle: **Claude helps seekers find Yogananda's words. Claude never speaks for Yogananda.**

Every permitted use falls into one of three categories:

| Category | What Claude Does | Output Format | Human Review Required? |
|----------|-----------------|---------------|----------------------|
| **Finding** | Locates the right passages for a seeker's need | JSON (IDs, terms, scores) | No — output is search infrastructure, not content |
| **Classifying** | Categorizes passages by theme, intent, accessibility, tone | JSON (labels, scores) | Yes — classification affects what users see |
| **Drafting** | Generates non-sacred text (UI strings, captions, alt text) | Draft text files | Yes — mandatory human review before publication |

### Hard Prohibitions (Theological, Non-Negotiable)

These prohibitions are absolute and permanent. No phase, feature, or stakeholder request overrides them.

Claude **never**:

1. **Generates text that could be mistaken for Yogananda's words.** Not even summaries, not even "in the style of." The portal displays only verbatim published text.
2. **Paraphrases, summarizes, or synthesizes across passages.** A seeker reads Yogananda's actual sentences, not Claude's interpretation of them.
3. **Translates Yogananda's published text.** Only official SRF/YSS human translations are served. Machine translation of sacred text is never acceptable — "inviolable constraint, not a cost optimization" (ADR-078).
4. **Interprets meditation techniques or spiritual practices.** The Kriya Yoga technique and SRF Lessons are explicitly out of scope. Claude must not explain, summarize, or advise on spiritual practices.
5. **Acts as a conversational agent or chatbot.** No dialogue, no follow-up questions, no "let me help you explore that further." The seeker interacts with the search bar, not with Claude.
6. **Answers questions directly.** Claude finds passages that answer questions. It does not formulate answers itself.
7. **Profiles or personalizes based on user behavior.** DELTA Agency principle — the AI facilitates access, it does not shape the experience based on behavioral data.

### Currently Permitted Uses

| # | Use Case | Phase | Category | ADR | Description |
|---|----------|-------|----------|-----|-------------|
| C1 | Query expansion | 1 | Finding | ADR-045 | Expands conceptual queries into semantic search terms. Returns JSON array of terms only. Optional — bypassed for simple keyword queries. |
| C2 | Passage ranking | 1 | Finding | ADR-045 | Given user's question + 20 candidate passages, selects and ranks the 5 most relevant. Returns JSON array of passage IDs only. |
| C3 | Highlight boundaries | 1 | Finding | ADR-045 | Identifies which sentences within a chunk best answer the query. Returns character offsets. |
| C4 | Theme classification | 4 | Classifying | ADR-032 | Classifies ambiguous passages into teaching topics. Optional — supplements embedding similarity for borderline cases. Mandatory human review before tags are served. |
| C5 | UI translation drafting | 9 | Drafting | ADR-078 | Translates UI chrome and portal-authored content (NOT Yogananda's text). Draft files undergo mandatory human review by fluent, SRF-aware reviewers. |
| C6 | Social caption drafting | 7 | Drafting | ADR-092 | Generates suggested captions for daily quote images. Human reviews and posts — never auto-post. |

### Approved Expansion: High-Value Claude Uses

The following use cases have been evaluated against the librarian model and approved for inclusion in the roadmap. Each stays within the Finding/Classifying/Drafting categories and respects all prohibitions.

#### E1: Search Intent Classification (Phase 1)

**Category:** Classifying | **Cost:** ~$0.002/query | **Human review:** No (search infrastructure)

Classify the seeker's query intent before search executes, routing to the optimal experience:

| Intent | Example | Response |
|--------|---------|----------|
| `topical` | "peace" | Redirect to `/themes/peace` if theme exists |
| `specific` | "Autobiography chapter 12" | Redirect to reader |
| `emotional` | "I'm scared", "my mother died" | Route to "Seeking..." empathic entry or theme-filtered search with compassionate framing |
| `definitional` | "what is samadhi" | Search with boost for passages where Yogananda *defines* the term |
| `situational` | "how to raise spiritual children" | Search with situation-theme boost |
| `browsing` | "show me something inspiring" | Route to Today's Wisdom / random passage |

**Implementation:** Lightweight classification call before the main search pipeline. Returns a JSON intent label + optional routing hint. Falls back to standard hybrid search if classification is uncertain.

**Why this matters:** The difference between a good search engine and a world-class one is understanding *what kind of answer the person needs*. A seeker typing "I'm scared" at 2 AM needs a different experience than one typing "fear Yogananda quotes."

#### E2: Spiritual Terminology Bridge (Phase 1)

**Category:** Finding | **Cost:** Included in query expansion | **Human review:** No

Enhance query expansion with tradition-aware vocabulary mapping. Seekers arrive with modern, clinical, or cross-tradition terms that don't appear in Yogananda's vocabulary:

| Seeker's Term | Yogananda's Vocabulary |
|---------------|----------------------|
| "mindfulness" | "concentration," "one-pointed attention," "interiorization" |
| "chakras" | "astral cerebrospinal centers," "spiritual eye" |
| "enlightenment" | "Self-realization," "cosmic consciousness," "God-union" |
| "anxiety" | "restlessness," "mental disturbance," "nervous agitation" |
| "therapy" | "self-healing," "mind cure," "affirmation" |
| "trauma" | "past suffering," "karmic burden," "mental wounds" |

**Implementation:** Extend the query expansion system prompt with a spiritual terminology mapping. Claude already does query expansion (C1) — this enriches it with Yogananda-specific vocabulary awareness. The mapping is maintained as a versioned JSON glossary at `/lib/data/spiritual-terms.json`, reviewed by SRF-aware editors.

**Per-book evolution (ADR-051):** The terminology bridge is a living glossary, not a static artifact. Each book ingestion triggers a vocabulary extraction step: Claude scans the new book's chunks and proposes additions to the bridge (new terms, new synonyms for existing mappings, book-specific usages). An SRF-aware editor reviews the diff and approves, modifies, or rejects each proposed addition before merge. The glossary carries source provenance — which book introduced which mapping — enabling source-aware query expansion. See ADR-051 for full lifecycle.

**Why this matters:** The portal serves Earth's population. Most seekers worldwide have never read Yogananda. They arrive with the vocabulary of their own tradition, their therapist, or their Google search. If the portal can only find passages using Yogananda's exact terminology, it fails the people who need it most.

#### E3: Passage Accessibility Rating (Phase 5)

**Category:** Classifying | **Cost:** ~$0.01/chunk (one-time at ingestion) | **Human review:** Spot-check

Rate each passage during ingestion on a newcomer-friendliness scale:

| Level | Label | Description | Example |
|-------|-------|-------------|---------|
| 1 | `universal` | No spiritual background needed | "Have courage. Whatever you are going through will pass." |
| 2 | `accessible` | Assumes general spiritual interest | "The soul is ever free; it is deathless, birthless, ever-existing." |
| 3 | `deep` | Assumes familiarity with Yogananda's framework | "In sabikalpa samadhi the devotee has attained realization of his oneness with Spirit, but cannot maintain cosmic consciousness except in the immobile trance state." |

**Implementation:** Stored as a `accessibility_level` column on `book_chunks`. Computed once at ingestion time by Claude (batch classification of all chunks). Spot-checked by human reviewers. Used to:
- Default homepage "Today's Wisdom" to level 1–2 passages (welcoming newcomers)
- Default theme pages to level 1–2, with "Show deeper teachings" option
- Help search ranking: when relevance scores are tied, prefer more accessible passages

**Why this matters:** This serves newcomers without tracking user behavior (DELTA-compliant). A first-time visitor encountering a passage about sabikalpa samadhi may feel the portal isn't for them. A passage about courage speaks to everyone. The portal should welcome before it deepens.

#### E4: Ingestion QA Assistant (Phase 1)

**Category:** Classifying | **Cost:** ~$0.05/book (one-time) | **Human review:** Yes — every flag reviewed

During the human QA step (Deliverable 1.3), Claude pre-screens ingested text and flags:

- Probable OCR errors ("Ood" → likely "God," "mediiation" → "meditation")
- Inconsistent formatting (straight quotes mixed with smart quotes, inconsistent dashes)
- Truncated passages (chunk ends mid-sentence, suggesting a chunking boundary error)
- Sanskrit diacritics that may have been mangled by PDF extraction
- Passages that appear to be headers, footnotes, or page artifacts rather than body text

**Implementation:** Batch job that processes all chunks for a book and outputs a QA report (JSON) with flagged chunks and suggested corrections. Humans make every decision — Claude reduces the review surface area.

**Why this matters:** The entire portal rests on text quality. OCR errors in spiritual terminology (e.g., "Kriya" misread as "Krlya") silently degrade search retrieval. Catching these before publication protects the foundation everything else is built on.

#### E5: Search Quality Evaluation Judge (Phase 1)

**Category:** Classifying | **Cost:** ~$0.10/evaluation run | **Human review:** No (CI infrastructure)

Automate the search quality evaluation (Deliverable 1.11) by using Claude as the evaluator:

- Given a benchmark query and the search results, does the expected passage appear in the top 5?
- Is the ranking reasonable? (A passage directly addressing the query should rank above a tangentially related one.)
- Are there false positives? (Passages that match keywords but are semantically irrelevant.)

**Implementation:** CI job that runs the 30 benchmark queries against the search API, passes results to Claude for evaluation, and reports a quality score. Threshold: ≥ 80% of queries return at least one relevant passage in the top 3. Runs on every PR that touches the search pipeline, embedding model, or chunking strategy.

**Why this matters:** Manual evaluation of 30 queries is feasible at launch but doesn't scale. As the corpus grows (Phase 5–7) and the search pipeline evolves, automated regression testing ensures quality doesn't silently degrade.

#### E6: Cross-Book Conceptual Threading (Phase 6)

**Category:** Classifying | **Cost:** ~$0.50/book pair (one-time) | **Human review:** Spot-check

Enhance `chunk_relations` (ADR-050) with conceptual understanding. Vector similarity finds passages about the same *topic*, but Claude can distinguish:

| Relation Type | Example | What It Enables |
|---------------|---------|-----------------|
| `same_topic` | Two passages about courage | Standard related teaching (already handled by embeddings) |
| `develops_further` | Autobiography mentions self-control briefly; Man's Eternal Quest has a full chapter | "Yogananda explores this idea at greater length in..." |
| `personal_story` | A teaching principle + an autobiographical illustration of it | "Yogananda shares a personal experience of this in..." |
| `practical_application` | A philosophical passage + a concrete technique or affirmation | "For a practical approach to this teaching, see..." |

**Implementation:** During chunk relation computation (Phase 6, Deliverable 6.1), for the top 10 most similar cross-book passages per chunk, Claude classifies the relation type. Stored as a `relation_type` column on `chunk_relations`. Used to diversify the "Continue the Thread" suggestions and add context labels in the side panel.

**Why this matters:** This is what a human librarian does that a search engine cannot. "If you liked this passage about courage, here's where he tells the story of his own test of courage" — that's a world-class reading experience. No physical book, no PDF, no ebook can do this.

#### E7: Photograph Alt Text (Phase 2)

**Category:** Drafting | **Cost:** ~$0.01 total (one-time, <20 images) | **Human review:** Yes

Generate reverential, descriptive alt text for the portal's Yogananda photographs (About page, footer, book covers):

- Rich descriptions for screen readers (not just "Photo of Yogananda" but "Paramahansa Yogananda seated in lotus position, eyes gently closed in meditation, wearing an ochre robe, circa 1935")
- Tone: warm, respectful, consistent with the portal's devotional register
- One-time batch at build time, reviewed by SRF editors

**Why this matters:** Direct accessibility improvement for visually impaired seekers. A portal that claims accessibility as a foundational principle should describe its sacred images with the same care it gives to its text.

#### E8: Daily Passage Tone Classification (Phase 5)

**Category:** Classifying | **Cost:** ~$0.01/chunk (one-time at ingestion) | **Human review:** Spot-check

Classify passages in the `daily_passages` pool by emotional tone:

| Tone | Description | Example Use |
|------|-------------|-------------|
| `consoling` | Comfort, reassurance, tenderness | Appropriate any day; especially valuable during difficult times |
| `joyful` | Celebration, bliss, divine joy | Lighter fare; good for variety |
| `challenging` | Direct, demanding, calls to action | Powerful but not ideal two days in a row |
| `contemplative` | Deep, meditative, philosophical | Rewards re-reading |
| `practical` | Concrete advice, technique-adjacent | Actionable |

**Implementation:** Stored as a `tone` column on `daily_passages`. The selection algorithm ensures tonal variety across the week (not three "challenging" passages in a row) without any user tracking. Pure editorial metadata.

**Why this matters:** Small refinement that makes the daily experience feel curated rather than random. No personalization, no tracking — just editorial intelligence applied at content level.

### Output Format Constraints

All Claude interactions follow strict output format rules:

| Category | Permitted Output | Prohibited Output |
|----------|-----------------|-------------------|
| **Finding** (C1, C2, C3, E1, E2) | JSON arrays (terms, IDs, offsets, labels) | Prose, explanations, natural language |
| **Classifying** (C4, E3, E4, E5, E6, E8) | JSON objects (labels, scores, flags) | Prose, explanations, natural language |
| **Drafting** (C5, C6, E7) | Draft text for human review | Text published without review |

Claude is never given Yogananda's text as context for generation. When Claude ranks passages (C2) or classifies them (C4, E3, E6), it reads the text to understand it — but its output is always a label, a score, or an ID, never modified text.

### Cost Profile

| Phase | Uses | Estimated Monthly Cost | Notes |
|-------|------|----------------------|-------|
| 1 | C1, C2, C3, E1, E2, E4, E5 | ~$10–20 | Query expansion + ranking per search; QA and eval are one-time |
| 2 | E7 | ~$0.01 (one-time) | Alt text batch |
| 4 | C4, E3, E8 | ~$5–15 (one-time per book) + monthly search | Classification batches at ingestion |
| 5 | E6 | ~$5–10 (one-time per book pair) | Cross-book threading batch |
| 7 | C6 | ~$1/month | Daily caption |
| 9 | C5 | ~$1–5 (one-time per language) | UI translation drafts |

Total ongoing cost remains modest (~$15–25/month) because most Claude uses are one-time batch jobs at ingestion, not per-request runtime calls. The librarian model is inherently cost-efficient: constrained output formats minimize tokens.

### Graceful Degradation

Every Claude integration has a fallback path:

| Use | Fallback | Quality Impact |
|-----|----------|---------------|
| Query expansion (C1, E2) | Direct keyword search (no expansion) | Lower recall for conceptual queries |
| Passage ranking (C2) | RRF-ranked results (no Claude re-rank) | Slightly less precise ranking |
| Intent classification (E1) | All queries → standard hybrid search | Functional but less intelligent routing |
| Theme classification (C4) | Embedding similarity only (no Claude refinement) | More borderline misclassifications |
| Accessibility rating (E3) | No rating; all passages treated equally | Newcomers may encounter advanced passages |
| QA assistant (E4) | Manual review without pre-screening | Higher reviewer burden |
| Eval judge (E5) | Manual evaluation of benchmark queries | Doesn't scale; skipped in CI |
| Cross-book threading (E6) | Embedding similarity without relation types | "Related" without "how it's related" |
| Alt text (E7) | Generic alt text ("Photograph of Paramahansa Yogananda") | Functional but not rich |
| Tone classification (E8) | Random selection without tonal variety | Occasional tonal clustering |

The portal works without Claude. Claude makes it *world-class*.

### Alternatives Considered

| Approach | Description | Why Rejected |
|----------|-------------|-------------|
| **No AI policy document** | Continue with scattered ADR references | Risk of scope creep or scope fear; no single reference for new engineers |
| **Chatbot mode alongside librarian mode** | Offer a conversational AI experience for seekers who prefer it | Violates ADR-001; hallucination risk with sacred text; contradicts DELTA Agency; creates a "teacher" the portal explicitly refuses to be |
| **Open-ended Claude use** | Allow any use case that doesn't violate the hard prohibitions | Too permissive; "not explicitly forbidden" is not the same as "aligned with the mission." Every use case should be evaluated against the librarian model. |
| **No Claude expansion** | Keep only C1–C6; don't add E1–E8 | Misses genuinely valuable uses (intent classification, terminology bridge, accessibility rating) that serve seekers within existing theological constraints |

### Consequences

- ADR-001 (Direct Quotes Only) and ADR-045 (Claude API for AI Features) remain the foundational references; this ADR consolidates and extends them
- The three-category model (Finding / Classifying / Drafting) provides a clear framework for evaluating future Claude use cases
- E1 (intent classification) and E2 (terminology bridge) are added to Phase 1 deliverables — they directly improve search quality at launch
- E3 (accessibility rating) and E8 (tone classification) are added to Phase 5 — they require multi-book content to be meaningful
- E4 (QA assistant) and E5 (eval judge) are added to Phase 1 — they improve quality foundations
- E6 (cross-book threading) is added to Phase 6 — it enhances the Related Teachings system
- E7 (alt text) is added to Phase 2 — it's an accessibility deliverable
- The spiritual terminology mapping (`/lib/data/spiritual-terms.json`) becomes a maintained artifact, reviewed by SRF-aware editors. ADR-051 defines the per-book evolution lifecycle.
- Every new Claude use case proposed in future phases should be evaluated against this ADR's three-category model and hard prohibitions
- **Extended ADRs:** ADR-001 (cross-reference to this policy), ADR-045 (cross-reference to expansion roadmap)

---

## ADR-006: Global Equity — Serving Earth's Underserved Seekers

**Status:** Accepted | **Date:** 2026-02-19

### Context

The portal's mission — making Yogananda's teachings "available freely throughout the world" — is not satisfied by building a fast website in English and translating it later. "The world" includes:

- A seeker in rural Bihar with a JioPhone on 2G, paying per megabyte
- An elderly devotee in São Paulo who shares a smartphone with her family
- A yoga practitioner in Lagos accessing the portal from a cybercafé
- A Bengali-speaking YSS member who has never used a website in their own language
- A visually impaired monk in Germany who navigates entirely by screen reader

ADR-003 established accessibility as a Phase 2 foundation. ADR-075 established multilingual architecture. ADR-012 established the PWA for offline reading. This ADR addresses the gaps between those decisions — the practical realities of serving seekers who are not well-served by the default assumptions of Western web development.

### Decision

Adopt the following design constraints and features as explicit commitments, not aspirational goals:

#### 1. Data Cost Awareness

In Sub-Saharan Africa, South Asia, and Southeast Asia, mobile data is not unlimited. Seekers pay per megabyte. A page that loads fast on 3G may still be too expensive if it costs 500KB per visit.

**Commitments:**
- Homepage initial payload: **< 50KB** (HTML + critical CSS + inline JS). The current 100KB JS budget (ADR-003) is an upper bound for the full app shell; the homepage must be lighter.
- **Text-only mode toggle** in the site footer and in reader settings. When enabled: no images, no decorative elements, no web fonts (system serif stack), no OG preview generation. Stored in `localStorage`. This is not a degraded experience — it is a *considered* experience for seekers who cannot afford decorative bytes.
- **Aggressive caching headers.** Book content changes rarely. Chapters served with `Cache-Control: public, max-age=31536000, immutable` (1 year) and content-hashed URLs. Repeat visits and chapter-to-chapter navigation cost zero data after first load.
- Print stylesheets load only when `@media print` matches — zero cost during normal browsing.

#### 2. Device Spectrum

Not all seekers have smartphones. KaiOS (JioPhone, Nokia feature phones) runs a basic browser with limited JavaScript support. Approximately 100M+ KaiOS devices are in active use, primarily in India — exactly the audience SRF/YSS serves.

**Commitments:**
- **Progressive enhancement is mandatory, not optional.** The reading experience (book text, chapter navigation, search form submission) must work with JavaScript disabled. Server-rendered HTML is the baseline. JavaScript enhances: "Show me another," infinite scroll, Quiet Corner timer, dwell mode.
- **Phase 3 testing adds a KaiOS emulator** to the CI matrix. Critical flows (search, read chapter, navigate) must pass.
- **Touch targets remain 44×44px minimum** (ADR-003), but form inputs and navigation links use **48px** minimum on pages likely accessed from feature phones (homepage, search results, book index).

#### 3. Shared Devices

In many families globally, one phone serves 3–5 people. The portal must not assume a device belongs to a single person.

**Commitments:**
- **No user accounts until Phase 15+** — the portal works fully without sign-in, which is already the design. This is correct for shared devices.
- **Bookmarks (ADR-066) use `localStorage`** — they disappear if the browser data is cleared. This is acceptable for Phase 4. Phase 15+ (user accounts) can optionally sync bookmarks, but the local-first design is correct for shared devices where privacy between users matters.
- **No "Welcome back" or personalization.** The portal greets every visit the same way. No reading history displayed on the homepage. No "Continue where you left off" (which would expose one family member's reading to another).

#### 4. Intermittent Connectivity as the Norm

The PWA (ADR-012) is Phase 12. For Phases 1–11, seekers with unreliable connections have no offline support. This is a long gap.

**Commitments:**
- **Phase 2: Service Worker for static assets only.** The app shell (HTML, CSS, JS, fonts) is cached by a minimal Service Worker. Book content is not cached offline until Phase 12, but the portal loads instantly on repeat visits even with no connectivity change.
- **Phase 4: Last-read chapter cached.** When a seeker reads a chapter, the chapter HTML is cached in the Service Worker. If connectivity drops, they can re-read that chapter. Not full offline support — just graceful handling of the most common offline scenario (re-reading what you just read).
- **Offline indicator.** When the Service Worker detects no connectivity, a subtle banner appears: *"You're reading offline. Search requires a connection."* Not an error state — a calm acknowledgment. Matches the portal's warm cream palette, not a red warning bar.

#### 5. Community and Group Reading

In India, Latin America, and many African communities, spiritual texts are read aloud in groups — satsang, study circles, family devotions. The portal's reader is designed for individual silent reading.

**Commitments:**
- **Presentation mode (Phase 8).** A "Present" button in the reader header. When activated: text enlarges to 24px+ (readable from 2–3 meters), all chrome hides (no header, no sidebar, no share icons), chapter navigation becomes swipe/arrow-key only, warm cream background fills the viewport. The device becomes a digital lectern.
- **This is not a separate feature — it is a CSS mode.** The same reader component, the same content, the same accessibility. `data-mode="present"` on the reader container triggers the enlarged, chrome-free layout.

#### 6. Cultural Consultation for Entry Points

The "Seeking..." empathic entry points and theme doors are currently written from an English-language, Western-spiritual perspective. "What happens after death?" is a natural question in one culture but may be phrased as "Where does the soul go?" or "What is the cycle of birth?" in another.

**Commitments:**
- **Phase 11 (multilingual launch) requires cultural consultation, not just translation.** For each Wave 1 language, SRF engages a native-speaking devotee (not a professional translator) to review the entry points and theme door labels for cultural resonance. The consultant answers: "Would a seeker in [country] phrase this question this way? What would feel more natural?"
- **The "Seeking..." prompts are editorial content, not UI chrome.** They live in Contentful (Phase 10+), not in `messages/{locale}.json`. Each locale has independently authored prompts, not translations of the English originals.
- **Query expansion (Claude API) handles the bridge.** Even if the entry point is culturally adapted, a seeker may still type their question in a culturally specific way. The terminology bridge (ADR-051) and Claude's query expansion handle the mapping from the seeker's phrasing to the passage corpus.

#### 7. Right-to-Left as a First-Class Layout

CSS logical properties (ADR-076) provide the technical foundation for RTL. But RTL is more than mirrored margins.

**Commitments:**
- **Phase 11 RTL languages (Arabic, Urdu — if added in Wave 3+) require a native RTL reader to review every page.** Not just CSS mirroring, but visual hierarchy, reading flow, and icon directionality (e.g., a "next chapter" arrow points left in RTL).
- **The share menu, dwell icon, and reader navigation all use `inline-start`/`inline-end` positioning** — already specified in their respective ADRs. This commitment makes the RTL audit a verification exercise, not a redesign.
- **Bidirectional text.** Yogananda quotes in Arabic translation may contain Sanskrit terms (samadhi, pranayama) in Latin script. The portal must handle `dir="auto"` on passage elements to allow mixed-direction text within a single paragraph.

#### 8. Font Loading Strategy for Global Scripts

Web fonts improve typography but add data cost. The current design uses Google Fonts (Merriweather, Lora, Open Sans). Non-Latin scripts require additional font files that can be large (CJK: 2–5MB per weight).

**Commitments:**
- **`font-display: swap` on all web fonts.** Text renders immediately in the system font stack; web fonts swap in when loaded. No invisible text, no layout shift, no blank screen while fonts download.
- **Unicode-range subsetting for non-Latin scripts.** Google Fonts provides automatic subsetting. Only the glyphs needed for the current page are downloaded. A Hindi page does not download Latin glyphs; a Japanese page does not download Devanagari glyphs.
- **Text-only mode (commitment 1) uses system fonts exclusively.** No web font downloads at all. This is the maximum data-saving option.
- **Critical text (passage content, citations) uses the system serif stack as fallback** — not a sans-serif default. `font-family: Merriweather, 'Noto Serif', Georgia, 'Times New Roman', serif` ensures the reading experience is typographically appropriate even before web fonts load.

### Rationale

These commitments exist because the portal's mission is theological, not commercial. "Freely throughout the world" is not a marketing tagline — it is a directive from Yogananda himself (*Autobiography of a Yogi*, Chapter 35: "Whenever anyone, anywhere, shall utter with reverence the name of Babaji, that devotee will instantly attract the Guru's spiritual blessing"). The teachings are for everyone. "Everyone" includes people the Western web industry routinely ignores.

Every commitment above costs nothing or near-nothing at implementation time if incorporated from the start. Retrofitting any of them later is expensive. This is the same argument that justified ADR-003 (accessibility) and ADR-075 (multilingual architecture) — the cheapest time to build for the world is now.

### Consequences

- Homepage payload budget tightened from 100KB to 50KB (HTML + critical CSS + inline JS)
- Text-only mode added to site footer and reader settings (Phase 2)
- Minimal Service Worker deployed in Phase 2 (static assets only), expanded in Phase 4 (last-read chapter)
- KaiOS emulator added to CI in Phase 3
- Presentation mode added to the reader in Phase 8
- Cultural consultation budget required for Phase 11 multilingual launch
- RTL design review by native reader required before any RTL language goes live
- `font-display: swap` and unicode-range subsetting are non-negotiable for all font loading
- **Extends ADR-003** (accessibility), **ADR-075** (multilingual), and **ADR-012** (PWA) with concrete global equity commitments

---

## ADR-007: Curation as Interpretation — The Fidelity Boundary and Editorial Proximity Standard

- **Status:** Accepted
- **Date:** 2026-02-21
- **Relates to:** ADR-001, ADR-092, ADR-032, ADR-005, DES-026, DES-028, ADR-083, ADR-049, ADR-071, ADR-086, DES-047, ADR-059

### Context

ADR-001 established the foundational constraint: the portal displays only Yogananda's verbatim words and never generates, paraphrases, or synthesizes content. This constraint is architecturally enforced (JSON-only AI output, human review gates, content integrity hashing) and has been consistently applied across all subsequent ADRs.

However, as the portal's feature surface has grown — editorial reading threads (DES-026), theme classification (ADR-032), daily passage selection, calendar-aware surfacing (DES-028), search suggestions with vocabulary bridging (ADR-049), community collections (ADR-086), the `/guide` page (DES-047), and chant metadata (ADR-059) — two gaps have emerged:

1. **Curation as interpretation.** Every act of selecting, ranking, grouping, or sequencing passages is an interpretive act, even when the passages themselves are verbatim. The design mitigates this per-feature but has never named the tension explicitly as an architectural principle. Without a named principle, each new feature re-invents its own fidelity boundary rather than inheriting a shared standard.

2. **Editorial proximity.** Multiple features place portal-authored prose (editorial notes, glossary definitions, search hints, crisis resources, social captions, magazine articles, chant instructions) within visual proximity of sacred text. Each feature's ADR specifies its own separation rules, but no unified standard governs the shared boundary between Yogananda's words and the portal's voice. This risks inconsistency as features accumulate.

### Decision

1. **Name the tension.** The portal formally recognizes that **curation is a form of interpretation** — selection, ranking, theming, and sequencing shape how seekers encounter the teachings, even when the text is unaltered. This is a permanent and productive tension, not a problem to eliminate. The discipline is to curate *honestly*: selecting without distorting, arranging without editorializing, surfacing without implying that the unsurfaced is less important.

2. **Establish curation mitigations as a named pattern.** All curatorial features must satisfy four conditions:
 - **Corpus-derived, not behavior-derived.** Curation algorithms draw from the text itself (embeddings, extracted vocabulary, editorial taxonomy), never from user engagement patterns.
 - **Human review at every gate.** No curatorial decision reaches seekers without human verification.
 - **Transparent framing.** The selection mechanism (a theme label, a date, a search query, a curator name) is visible to the seeker, not hidden behind an opaque algorithm.
 - **Context always available.** Every curated passage links to its full chapter context via "Read in context."

3. **Establish the Editorial Proximity Standard.** A cross-cutting section in DESIGN.md (§ Editorial Proximity Standard) defines unified visual and structural rules for how all non-Yogananda prose behaves when it appears near sacred text. The standard governs: visual typography (Merriweather for sacred text, Open Sans for editorial/functional prose), structural separation (`<article>`/`<section>` boundaries), attribution requirements, accessibility announcements, and a maximum editorial-to-sacred-text content ratio.

### Alternatives Considered

1. **Continue per-feature fidelity rules.** Each ADR already specifies its own boundary mechanisms. This works but creates drift risk as the feature count grows. A maintainer adding a new feature in year 5 would need to survey a dozen ADRs to understand the pattern, rather than inheriting a single standard.

2. **Prohibit all non-Yogananda prose near sacred text.** This would eliminate the proximity problem entirely but would also eliminate editorial reading threads, glossary definitions, the `/guide` page, and crisis resources — features that serve seekers by providing context without altering content.

3. **Create a runtime content-type enforcement layer.** A technical system that tags every rendered element as "sacred" or "editorial" and enforces separation rules via CSS/HTML validation. Architecturally sound but premature for Phase 1 — the standard should be a design principle first and a technical enforcement later if drift is observed.

### Consequences

- New subsection "Curation as Interpretation: The Fidelity Boundary" added to CONTEXT.md § Theological and Ethical Constraints. This elevates an implicit understanding to an explicit design principle.
- New cross-cutting section "Editorial Proximity Standard" added to DESIGN.md, governing all features that place portal prose near sacred text. Component developers implementing any governed feature (search results, reading threads, glossary, daily email, social media, magazine, `/guide`, crisis resources, study workspace, chant reader, community collections) must follow the standard.
- Three new open questions added to CONTEXT.md: edition variance policy, spiritual terminology bridge governance, and fidelity re-validation cadence.
- Future ADRs introducing features that curate or frame sacred text must reference this ADR and specify which Editorial Proximity Standard rules apply.
- The CLAUDE.md maintenance table should include "editorial proximity" alongside multilingual, accessibility, and DELTA as a cross-cutting concern.

---

## ADR-008: Next.js + Vercel for Frontend

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The SRF tech stack designates Next.js on Vercel as the standard frontend stack. The convocation site uses this. No alternative was seriously considered.

### Decision

Use **Next.js on Vercel** with **Tailwind CSS** for the frontend.

### Rationale

- SRF organizational standard
- SSG for book reader pages (fast, SEO-friendly, cacheable)
- API routes for search endpoints (serverless, no separate backend for Phase 1)
- ISR for content updates when Contentful is integrated
- Vercel edge caching for global performance

### Consequences

- Phase 1 can use Next.js API routes instead of AWS Lambda (simpler)
- Production may migrate search API routes to Lambda if needed for scale or separation

---

## ADR-009: Neon + pgvector for Vector Search

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The Intelligent Query Tool requires semantic (vector) search to find thematically relevant passages even when the user's wording differs from Yogananda's. Options evaluated:

| Option | Pros | Cons |
|--------|------|------|
| **Neon + pgvector** | Already in SRF stack; vector + FTS + relational in one DB; free tier available; no vendor sprawl | Not a purpose-built vector DB; HNSW index tuning required |
| **Pinecone** | Purpose-built vector search; managed; fast | New vendor; no relational data; no FTS; cost at scale; sync complexity |
| **Weaviate / Qdrant** | Strong vector search; hybrid search built-in | New vendor; operational overhead if self-hosted; overkill for corpus size |
| **Supabase** | Postgres + pgvector + auth + storage all-in-one | SRF chose Neon, not Supabase; diverges from established stack |

### Decision

Use **Neon PostgreSQL with the pgvector extension** for both relational data and vector search. Combine with Postgres full-text search (tsvector) for hybrid retrieval.

### Rationale

- Neon is already in the SRF tech stack (established by the AE team)
- Avoids introducing a new vendor for a corpus of this size (~10-50K chunks)
- Hybrid search (vector + FTS) in a single SQL query is architecturally simple
- The Neon MCP server is available for development workflows
- pgvector's HNSW index performs well at this scale
- Single database eliminates synchronization problems between stores

### Consequences

- Must enable the `vector` extension in Neon
- Must choose an embedding model whose dimensions align with the vector column
- Performance at very large scale (millions of chunks, many languages) may eventually require a dedicated vector service — but that is far beyond Phase 1 scope

---

## ADR-010: Contentful as Editorial Source of Truth (Production)

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Book text needs to live somewhere with editorial management: version control, review workflows, multi-language support, and a non-technical editing interface. The SRF tech stack designates Contentful as the standard headless CMS. The convocation site (convocation.yogananda.org) already proves this pattern works.

| Option | Pros | Cons |
|--------|------|------|
| **Contentful** | SRF standard; editorial workflow; locales; Rich Text AST is parseable for chunking; convocation site proves pattern | Free tier limited (10K records, 2 locales); cost at scale; not a search engine |
| **Neon only** | Simplest; no sync complexity; full control | No editorial UI (would need Retool); no version history; no localization workflow |
| **Sanity.io** | Excellent DX; real-time collaboration; generous free tier | Not in SRF stack; would diverge from organizational standard |
| **Strapi (self-hosted)** | Open-source; full control; no per-record pricing | Operational overhead; not in SRF stack; no edge CDN |

### Decision

Use **Contentful** as the editorial source of truth for production. Book text is authored and managed in Contentful, then synced to Neon (via webhooks) for search indexing. For Phases 1–9, books are ingested directly into Neon from PDFs, but the schema is designed to accommodate Contentful IDs for future integration.

### Rationale

- Aligns with SRF's established technology standard
- Demonstrates the pattern for stakeholders (reusable across all SRF properties)
- Content editors work in a familiar, managed environment
- Multi-language support via Contentful locales
- Separation of concerns: Contentful for authoring, Neon for searching

### Consequences

- Production requires a Contentful → Neon sync service (webhook-driven)
- The Neon schema includes `contentful_id` columns for linkage
- Phases 1–9 operate without Contentful (PDF → Neon direct) but the schema is designed for easy Contentful integration later
- Contentful pricing must be evaluated for the full corpus (may exceed free tier)

---

## ADR-011: API-First Architecture for Platform Parity

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The SRF already has a native mobile app (iOS/Android) with an eReader. While a dedicated teaching portal mobile app is not planned, the portal's API surface will likely be consumed by native apps eventually — either a standalone portal app, integration into the existing SRF app, or both.

Next.js encourages a pattern where business logic lives inside React Server Components. This is convenient for web development but creates a platform lock: Server Components are callable only by the Next.js rendering pipeline, not by a mobile app, a third-party integration, or a PWA Service Worker.

If business logic migrates into Server Components during Phases 1–14, extracting it later into a proper API layer is a significant refactoring effort. The cost of API-first discipline from day one is near zero; the cost of retrofitting is high.

### Decision

Adopt **API-first architecture** with a **shared service layer** from Phase 1. Every user-facing feature must have both a callable service function and a REST API endpoint.

#### 1. Shared Service Layer

All business logic lives in `/lib/services/` as plain TypeScript functions:

```
/lib/services/
 search.ts → findPassages(query, language, options)
 daily-passage.ts → getDailyPassage(date, language)
 themes.ts → getThemes(language), getThemePassages(slug, language, limit)
 books.ts → getBooks(language), getChapter(bookSlug, chapterNumber, language)
 quiet.ts → getAffirmation(language)
```

**Server Components** call service functions directly (in-process, no HTTP overhead).
**API routes** call the same service functions and return JSON.
**Mobile apps** (future) call the API routes.

This is a code organization rule, not a technology choice. The rule: **never put business logic in a Server Component or a Route Handler that doesn't delegate to a service function.**

#### 2. API Versioning

All API routes use a versioned prefix from Phase 1:

```
/api/v1/search
/api/v1/daily-passage
/api/v1/themes/[slug]/passages
/api/v1/books/[slug]/chapters/[number]
/api/v1/quiet
/api/v1/og/[chunk-id]
/api/v1/email/subscribe
```

When the API evolves, `/api/v2/` coexists with `/api/v1/`. The web frontend always uses the latest version. Mobile apps pin to the version they were built against. Old versions are deprecated with notice, not removed without warning.

#### 3. Authentication: Public by Default

**Phases 1–14: All API routes are public.** No authentication required. The portal's core mission is frictionless access to the teachings — adding "Sign in" contradicts this.

What auth would serve, and how it's handled without it:

| Need | Solution Without Auth |
|------|----------------------|
| Rate limiting | Vercel/Cloudflare edge rate limiting |
| Bookmarks, reading position | `localStorage` (ADR-066) — private, no server |
| Email subscription | Token-based confirm/unsubscribe (no user accounts) |
| Admin dashboards | Retool has its own auth |
| Content protection | Not needed — the mission is free access |

**Phase 15+ (if needed):** When optional accounts are introduced for cross-device sync, evaluate the lightest mechanism that serves the need (magic links, passkeys, or Auth0 if SSO with other SRF properties is required). Public search and reading remain unauthenticated regardless. Auth is additive middleware on specific protected endpoints — never a gate on reading or search.

#### 4. Cursor-Based Pagination

Every endpoint returning a list uses cursor-based pagination:

```json
{
 "results": [...],
 "cursor": "eyJpZCI6MTIzfQ",
 "hasMore": true
}
```

Not page-number pagination (`page=2&limit=10`), which is fragile when data changes between requests. Cursors are stable across inserts and deletes — essential for mobile infinite scroll and pull-to-refresh patterns.

#### 5. Cache-Control Headers

Explicit HTTP caching directives on every API response:

| Endpoint | Cache Strategy |
|----------|---------------|
| `/api/v1/daily-passage` | `max-age=3600` (1 hour — passage changes daily, but not every second) |
| `/api/v1/books/[slug]/chapters/[number]` | `max-age=86400, stale-while-revalidate=604800` (book text rarely changes) |
| `/api/v1/search` | `no-store` (query-dependent, not cacheable) |
| `/api/v1/themes/[slug]/passages` | `max-age=3600` (theme curation changes infrequently) |
| `/api/v1/quiet` | `max-age=300` (5 min — affirmation rotates but isn't time-critical) |

Mobile apps get intelligent caching for free. The web frontend benefits from the same headers.

#### 6. Deep Link Readiness

Passage URLs (`/passage/[chunk-id]`) are already designed for universal link interception. When a native app is registered:

- **iOS:** `apple-app-site-association` file at domain root maps `/passage/*` to the app
- **Android:** `assetlinks.json` at `/.well-known/` maps the same

The URL structure is decided now. The association files are added when the app launches.

### Rationale

- **Zero marginal cost.** Service layer extraction, API versioning, and cache headers are conventions, not infrastructure. They cost minutes to implement in Phase 1 and save weeks of refactoring later.
- **Multiple consumers are likely.** Even without a native app, the API may be consumed by: a PWA Service Worker (offline reading), the SRF mobile app team, a future admin dashboard, or third-party integrations (with SRF authorization).
- **SRF ecosystem alignment.** The existing SRF mobile app may want to incorporate portal search or daily passage features. A clean API makes this a simple integration rather than a rewrite.
- **Developer discipline is cheaper than developer heroics.** Establishing the pattern on day one (when the codebase is small) prevents the gradual drift that makes refactoring painful.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Build API later when mobile is planned** | Simpler codebase initially; YAGNI argument | Extracting logic from Server Components is expensive; API shape is influenced by existing code rather than consumer needs |
| **GraphQL instead of REST** | Single flexible endpoint; mobile apps request exactly what they need | Over-engineering for this corpus size; steeper learning curve; REST is simpler for SRF's team |
| **tRPC** | Type-safe API layer shared between Next.js client and server | Couples API to TypeScript consumers; not usable by native mobile apps or external integrations |

### Consequences

- Phase 1 API routes use `/api/v1/` prefix (update DESIGN.md)
- All features implemented via `/lib/services/` functions first, then exposed via Server Components and API routes
- API routes are public (no auth) through Phase 14; auth middleware added only if/when Phase 15 accounts are implemented
- List endpoints return cursor-based pagination
- Cache-Control headers on all API responses
- PWA readiness added to roadmap (Phase 12)
- Stakeholder question: does the portal get its own mobile app, or do features integrate into the existing SRF app?

---

## ADR-012: Progressive Web App as Mobile Intermediate Step

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Before native apps, a Progressive Web App (PWA) offers a lightweight mobile experience with offline capability, home screen installation, and (on Android) push notifications — without App Store approval, review cycles, or revenue sharing.

For the teaching portal specifically, offline reading is a natural use case: a seeker on a flight, in a rural area with poor connectivity, or simply wanting to read without internet distraction. The Quiet Corner meditation timer should work offline. These align with the Calm Technology principle — the technology fades into the background.

### Decision

Add **PWA readiness** as a Phase 12 deliverable. This includes:

| Feature | Implementation | Benefit |
|---------|---------------|---------|
| **Web App Manifest** | `manifest.json` with SRF branding, icons, theme colors | Installable on home screen (iOS + Android) |
| **Service Worker** | Cache book chapters, daily passage, Quiet Corner affirmation | Offline reading and meditation |
| **Offline indicator** | Subtle banner when offline: "You're reading offline. Search requires a connection." | Honest, not alarming |
| **Cache strategy** | Book text: cache-first (changes rarely). Search: network-only. Daily passage: stale-while-revalidate. | Fast reads, fresh search |

### Rationale

- **Natural fit for the content.** Books are static content — the ideal PWA caching target. A seeker can download a book chapter and read it anywhere.
- **Calm Technology alignment.** Offline reading removes the constant-connectivity expectation. The portal works in airplane mode, in a forest, on a train.
- **Low incremental cost.** Next.js supports Service Workers via `next-pwa` or `serwist`. The API-first architecture (ADR-011) and Cache-Control headers make the caching strategy straightforward.
- **No App Store dependency.** A PWA is deployed with the web app. Updates are instant. No review process, no 30% fee, no "minimum iOS version" constraints.
- **Does not preclude native apps.** A PWA and a native app can coexist. The PWA serves seekers who don't want to install an app. The native app (if built) serves seekers who prefer a native experience.

### Consequences

- Phase 12 includes PWA deliverables (manifest, Service Worker, offline caching)
- Offline mode only caches previously viewed content — it does not pre-download entire books (that's a future decision)
- Push notifications deferred — Android supports Web Push, but iOS support is limited and the daily email already serves the notification use case
- The existing SRF mobile app relationship must be clarified (stakeholder question) to avoid confusing seekers with two "apps"

---

## ADR-013: Single-Database Architecture — No DynamoDB

**Status:** Accepted

**Date:** 2026-02-20

### Context

SRF's established technology stack includes both Neon (serverless PostgreSQL) and DynamoDB. Other SRF properties use DynamoDB for high-throughput key-value patterns such as session storage and real-time counters. The question arose whether the teachings portal should also incorporate DynamoDB for consistency with the broader SRF ecosystem.

### Decision

The teachings portal uses **Neon PostgreSQL exclusively** as its database layer. DynamoDB is not used.

### Alternatives Considered

1. **DynamoDB for search query logging** — At ~1,000 searches/day (~73 MB/year), PostgreSQL handles this trivially. DynamoDB's write throughput advantage is irrelevant at this scale.
2. **DynamoDB for session storage** — The portal has no user sessions until Phase 15, and Auth0 handles session management. No application-level session store is needed.
3. **DynamoDB for rate limiting counters** — Cloudflare WAF handles edge-layer rate limiting. Application-layer limits use in-memory counters in Vercel Functions (acceptable for serverless, no shared state needed).
4. **DynamoDB for caching** — Cloudflare CDN and browser `Cache-Control` headers handle all caching needs. Adding a separate cache database adds complexity without measurable benefit.

### Rationale

- **The data model is fundamentally relational.** Books → chapters → chunks → topics with many-to-many relationships, cross-references, editorial threads, and chunk relations. This is PostgreSQL's strength. Shoehorning relational data into DynamoDB's key-value model would require denormalization and access pattern planning that adds complexity without benefit.
- **pgvector eliminates the separate vector store.** Embeddings, full-text search, and relational data coexist in a single database. Adding DynamoDB would mean splitting data across two stores with consistency challenges.
- **Single database simplifies operations.** One backup strategy (ADR-019), one connection configuration, one migration tool (dbmate), one monitoring target. Two databases means two of everything.
- **10-year architecture horizon (ADR-004).** Every dependency is a 10-year maintenance commitment. DynamoDB would add: AWS SDK dependency, IAM configuration, separate Terraform module, separate monitoring, separate backup strategy, and cross-database consistency logic — all for zero functional gain.
- **Scale profile doesn't warrant it.** The portal serves spiritual seekers, not e-commerce transactions. Peak load is modest. PostgreSQL with Neon's serverless autoscaling handles the portal's read-heavy, moderate-write workload comfortably.
- **SRF ecosystem alignment is about patterns, not tools.** The portal aligns with SRF's tech stack in framework (Next.js), hosting (Vercel), database vendor (Neon), identity (Auth0), and observability (Sentry, New Relic, Amplitude). Using the same vendor (Neon/PostgreSQL) for a different access pattern (relational + vector) is good engineering, not deviation.

### Consequences

- All data lives in Neon PostgreSQL: content, embeddings, search indexes, analytics, configuration
- Single backup target, single migration tool, single connection strategy
- Terraform infrastructure is simpler (no DynamoDB module, no IAM policies for cross-service access)
- If SRF's DynamoDB usage evolves to include a pattern the portal genuinely needs (e.g., real-time collaborative features in future phases), this decision can be revisited via a new ADR
- Developers familiar with SRF's DynamoDB patterns should note: the portal's data model is relational by nature, and the single-database approach is an intentional architectural strength

---

## ADR-014: AWS Bedrock Claude with Model Tiering

**Status:** Accepted

**Date:** 2026-02-20

### Context

The portal uses Claude for three distinct search tasks: intent classification, query expansion, and passage ranking (ADR-001, ADR-005). At scale (projected 10,000+ searches/day), API costs become a significant operational concern for a free portal funded by a philanthropist. Additionally, SRF's established technology stack is AWS-centric — the question arose whether to use the Anthropic API directly or AWS Bedrock as the Claude provider.

### Decision

1. **Use AWS Bedrock** as the Claude API provider instead of the direct Anthropic API.
2. **Use Claude Haiku** as the default model for all three search tasks (intent classification, query expansion, passage ranking).
3. **Benchmark Haiku vs Sonnet** during Phase 1 using a test set of ~50 curated queries. If Haiku passage ranking quality falls below acceptable thresholds, promote passage ranking to Sonnet while keeping intent classification and query expansion on Haiku.

### Model Tiering Strategy

**Per-search tasks (real-time, cost-sensitive):**

| Task | Model | Fallback | Quality Sensitivity | Volume |
|------|-------|----------|-------------------|--------|
| Intent classification | Haiku | None (skip on failure) | Low — simple categorization | Every search |
| Query expansion | Haiku | None (skip, use raw query) | Medium — vocabulary breadth | Every complex search |
| Passage ranking | Haiku (promote to Sonnet if benchmarks warrant) | Skip (use RRF scores) | High — determines result quality | Every search with candidates |

**Offline batch tasks (run once per content, quality over cost):**

| Task | Model | Rationale | Phase |
|------|-------|-----------|-------|
| Theme taxonomy classification | Opus | Classifying chunks across multi-category spiritual taxonomy requires deep comprehension of Yogananda's teachings | 5 |
| Ambiguous chunk classification | Opus | Edge cases near classification thresholds benefit from nuanced reasoning | 1+ (ingestion) |
| Reference extraction (scriptures, persons, places) | Opus | Identifying cross-tradition references (Bible, Bhagavad Gita, scientific texts) across Yogananda's writing requires broad knowledge | 7 |
| UI translation drafting | Opus | Devotional register in 8+ languages requires precise tone; human review follows (ADR-078) | 11 |
| Cross-book relationship mapping | Opus | Identifying thematic connections across the full library requires deep reading comprehension | 6–7 |

Batch tasks are configured via `CLAUDE_MODEL_BATCH` environment variable (defaults to Opus). Cost is negligible: ~$2–5 per full book processed, run once per content change.

### Cost Projection

**Per-search (recurring, scales with traffic):**

| Scenario | Per-search cost | Monthly at 10K/day |
|----------|-----------------|-------------------|
| All Haiku | ~$0.001 | ~$300 |
| Tiered (Haiku + Sonnet ranking) | ~$0.005 | ~$1,500 |
| All Sonnet | ~$0.01 | ~$3,000 |
| Opus ranking (rejected) | ~$0.025 | ~$7,500 |

**Offline batch (one-time per content, negligible ongoing cost):**

| Task | Cost per book | When |
|------|--------------|------|
| Theme classification (Opus) | ~$2–5 | Once per book ingestion |
| Reference extraction (Opus) | ~$1–3 | Once per book ingestion |
| UI translation drafting (Opus) | ~$0.50 per locale | Once per locale addition |

### Alternatives Considered

1. **Direct Anthropic API** — Simpler initial setup, day-one access to new model releases. Rejected because: SRF already has AWS billing, support contracts, and IAM infrastructure. A separate Anthropic contract adds vendor management overhead for zero functional gain. New model releases are irrelevant — the portal's librarian tasks are well-defined and stable.
2. **All Sonnet** — Higher baseline quality for ranking. Rejected because: 10x cost increase over Haiku at scale. The portal's ranking task is constrained (select and order passage IDs from 20 candidates) — not open-ended reasoning. Haiku is likely sufficient; benchmark first.
3. **Opus for intent classification** — Considered whether Opus's deeper reasoning would improve classification accuracy. Rejected because: intent classification is bounded enum categorization (~7 types). The input is a short user query, the output is structured JSON. Haiku reaches the quality ceiling for this task; additional model capability has nowhere to go.
4. **Opus for passage ranking** — Considered whether Opus would better understand subtle spiritual nuance when ordering passages (e.g., distinguishing "divine fulfillment" from "renunciation" for "I feel empty inside"). Rejected because: the ranker receives 20 pre-retrieved passages already filtered by vector similarity + FTS relevance. It selects the top 5 and outputs ordered passage IDs — a constrained selection task, not open-ended reasoning. The heavy semantic lifting is done by the hybrid search layer, the spiritual-terms.json vocabulary bridge, and well-crafted system prompts with explicit ranking criteria (spiritual depth, directness of address, emotional resonance). The quality difference between models narrows significantly when the task is structured, the output format is constrained, and the candidate pool is pre-filtered. At ~$7,500/month for ranking alone (10K searches/day), the cost is unjustifiable for a free portal when architecture already ensures relevant results. **Opus is appropriate for offline batch work** (editorial analysis, theme taxonomy construction, cross-book relationship mapping) — low-volume, high-reasoning tasks — but not per-search costs.
5. **OpenAI GPT models** — Could reduce vendor count (already using OpenAI for embeddings). Rejected because: Claude's instruction-following and constrained output format are well-suited to the librarian pattern. Switching LLM providers for cost reasons alone adds migration risk. ADR-001 established Claude; no reason to revisit.

### Rationale

- **AWS alignment.** SRF's stack is AWS-native (ADR-013 notes this). Bedrock means consolidated billing, VPC endpoints (API traffic stays off the public internet), IAM-based access control, and existing AWS support contracts. No separate Anthropic API key management.
- **Committed throughput pricing.** Bedrock offers provisioned throughput for predictable costs at scale — important for a free portal with no revenue to absorb cost spikes.
- **Operational simplicity.** One cloud provider for compute (Vercel deploys to AWS), database (Neon), and AI (Bedrock). Terraform manages Bedrock model access alongside other AWS resources.
- **Haiku-first is prudent.** The portal's Claude tasks are tightly constrained: classify intent (enum output), expand terms (JSON array output), rank passages (ordered ID list output). These are not open-ended generation tasks. Haiku handles structured, bounded tasks well.
- **Benchmark before promoting.** Rather than assuming Sonnet is needed for ranking, measure first. The Phase 1 test set provides empirical data. If Haiku ranks comparably, the portal saves ~$1,200/month at 10K searches/day.
- **10-year horizon (ADR-004).** AWS Bedrock is a managed service with AWS's long-term commitment. The portal's `/lib/services/claude.ts` abstracts the provider — switching from Bedrock to direct API (or vice versa) requires changing the SDK client, not the business logic.
- **Graceful degradation is provider-agnostic.** The four-level degradation cascade (DESIGN.md § Claude API Graceful Degradation) works identically regardless of whether Claude is accessed via Bedrock or direct API. Timeouts, errors, and budget caps trigger the same fallthrough.

### Consequences

- `/lib/services/claude.ts` uses `@aws-sdk/client-bedrock-runtime` instead of the Anthropic SDK
- `.env.example` changes: replace `ANTHROPIC_API_KEY` with `AWS_REGION` + IAM role (Bedrock access managed via IAM, not API keys)
- Terraform includes a Bedrock model access module
- Per-search model IDs configured via `CLAUDE_MODEL_CLASSIFY`, `CLAUDE_MODEL_EXPAND`, `CLAUDE_MODEL_RANK` (default: Haiku)
- Batch model ID configured via `CLAUDE_MODEL_BATCH` (default: Opus) — used by theme classification, reference extraction, translation drafting, and cross-book relationship mapping
- Phase 1 includes a ranking benchmark task: 50 curated queries, compare Haiku vs Sonnet ranking quality, decide promotion
- New model versions (e.g., Haiku 4.0) are available on Bedrock days/weeks after direct API release — acceptable for a portal that values stability over cutting-edge
- If Bedrock pricing or availability changes unfavorably, switching to direct Anthropic API requires only SDK client changes in `/lib/services/claude.ts` — business logic and degradation cascade are unaffected

---

## ADR-015: Phase 1 Uses Vercel, Not AWS Lambda/DynamoDB

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The SRF tech stack brief specifies AWS Lambda + API Gateway + DynamoDB for backend services. For Phase 1, focused on proving the AI search concept and delivering a working portal, this full stack introduces unnecessary complexity.

### Decision

Phase 1 uses **Next.js API routes** (running on Vercel) as the backend. No Lambda, no API Gateway, no DynamoDB. Neon PostgreSQL serves as the sole data store.

### Rationale

- Reduces Phase 1 to three services (Vercel, Neon, Claude API)
- Next.js API routes are functionally equivalent to Lambda for our needs
- Neon PostgreSQL handles everything DynamoDB would (and more, with pgvector)
- Faster iteration during the design and prototyping phase
- Production can migrate API routes to Lambda if separation of concerns is needed

### Consequences

- The Phase 1 architecture diverges from the full SRF standard stack
- Migration path to Lambda is straightforward (extract API route handlers into Lambda functions)
- Stakeholders should understand this is a deliberate simplification, not a rejection of the standard stack

---

## ADR-016: Infrastructure as Code from Phase 3 (Terraform)

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The SRF Tech Stack Brief mandates Infrastructure as Code as a core engineering principle:

> *"All infrastructure should be defined as Infrastructure-as-Code and deployable via a GitLab CI/CD pipeline"*
> — SRF Infrastructure Philosophy, Principle #4

The brief explicitly names **Terraform** as the IaC tool for "everything else" (i.e., everything not covered by Serverless Framework for AWS Lambda). Terraform is integrated into the SRF IDP (Internal Developer Platform), with state stored in the GitLab Terraform backend.

The portal's infrastructure (Neon, Vercel, Sentry, Auth0, New Relic, Cloudflare) falls squarely in Terraform's "everything else" category. Serverless Framework does not apply — the portal is Next.js on Vercel, not Lambda-based.

Additionally, AI-assisted development (Claude Code) makes Terraform authoring and maintenance practical even for small teams. Terraform's declarative HCL syntax is well within Claude Code's capabilities, reducing the traditional overhead of writing and evolving `.tf` files.

### Decision

Use **Terraform** for all infrastructure provisioning from Phase 3. The portal repo includes a `/terraform` directory with modules for each service.

#### Source Control and CI/CD

| Phase | SCM | CI/CD | Terraform State |
|-------|-----|-------|-----------------|
| **Phases 1–9** | GitHub | GitHub Actions | Terraform Cloud free tier or S3 backend |
| **Phase 10+ (production)** | GitLab (SRF standard) | GitLab CI/CD | GitLab Terraform backend (SRF standard) |

Phases 1–9 use GitHub for velocity and simplicity. Migration to GitLab aligns with the SRF IDP when the portal moves toward production readiness in Phase 10.

#### Terraform Module Structure

```
/terraform/
 main.tf — Provider configuration, backend
 variables.tf — Input variables (project name, environment, etc.)
 outputs.tf — Connection strings, URLs, DSNs

 /modules/
 /neon/
 main.tf — Neon project, database, roles, pgvector extension
 variables.tf
 outputs.tf — Connection string, branch IDs

 /vercel/
 main.tf — Vercel project, environment variables, domains
 variables.tf
 outputs.tf — Deployment URL

 /sentry/
 main.tf — Sentry project, DSN, alert rules
 variables.tf
 outputs.tf — DSN

 /auth0/
 main.tf — Auth0 tenant, application, API, actions
 variables.tf
 outputs.tf — Client ID, domain

 /cloudflare/
 main.tf — DNS records, WAF rules, bot protection
 variables.tf
 outputs.tf

 /newrelic/
 main.tf — Synthetics monitors, alert policies, dashboards
 variables.tf
 outputs.tf
```

#### Environment Management

The SRF standard defines four environments: dev, qa, stg, prod. Terraform workspaces or variable files manage per-environment configuration:

```
/terraform/
 /environments/
 dev.tfvars
 qa.tfvars
 stg.tfvars
 prod.tfvars
```

For Phases 1–9, only `dev` is needed. Additional environments are added as the portal moves toward production.

#### What Terraform Manages vs. What It Doesn't

| Managed by Terraform | Managed by Application Code |
|---------------------|-----------------------------|
| Neon project creation, roles, extensions | Database schema (dbmate SQL migrations) |
| Vercel project, env vars, domain bindings | `vercel.json` (build/routing config) |
| Sentry project, alert rules | `sentry.client.config.ts` (SDK config) |
| Auth0 tenant, app, API registration | Auth0 SDK configuration in Next.js |
| Cloudflare DNS, WAF rules | — |
| New Relic Synthetics, alert policies | `newrelic.js` (agent config) |
| GitHub/GitLab repo settings, branch protection | `.github/workflows/` or `.gitlab-ci.yml` |

The boundary: Terraform creates and configures the *services*. Application code configures *how the app uses those services*. Database schema is managed by dbmate migrations, not Terraform — schema changes require migration semantics (up/down), not declarative state.

#### CI/CD Pipeline (Phases 1–9 — GitHub Actions)

```yaml
# .github/workflows/terraform.yml
# Triggered on changes to /terraform/**

on:
 pull_request:
 paths: ['terraform/**']
 push:
 branches: [main]
 paths: ['terraform/**']

jobs:
 plan:
 # On PR: terraform plan, post diff as PR comment
 apply:
 # On merge to main: terraform apply (dev environment)
 # Production: manual approval gate
```

#### CI/CD Pipeline (Phase 10+ — GitLab CI)

```yaml
# .gitlab-ci.yml (aligned with SRF IDP)
stages:
 - validate
 - plan
 - apply

terraform:plan:
 stage: plan
 script:
 - terraform init
 - terraform plan -var-file=environments/${CI_ENVIRONMENT_NAME}.tfvars
 # Plan output stored as artifact

terraform:apply:
 stage: apply
 script:
 - terraform apply -auto-approve -var-file=environments/${CI_ENVIRONMENT_NAME}.tfvars
 when: manual # Production requires manual approval
 environment:
 name: $CI_ENVIRONMENT_NAME
```

### Rationale

- **SRF mandate.** The tech stack brief requires IaC via Terraform. Delivering infrastructure without Terraform deviates from SRF engineering standards and creates technical debt that must be resolved before production.
- **AI-assisted authoring.** Claude Code writes and maintains Terraform fluently. The traditional objection to IaC ("too much overhead for a small team") is largely neutralized when the AI handles `.tf` file generation, provider configuration, and module structure.
- **Reproducible environments.** `terraform apply` creates a complete environment from scratch. Disaster recovery, staging environment creation, and onboarding new developers all become simple operations.
- **Drift detection.** Terraform detects when infrastructure has been manually changed outside of code. This prevents the "someone changed a setting in the dashboard and nobody knows" problem.
- **Code review for infrastructure.** Infrastructure changes go through the same PR review process as application code. A change to an alert threshold or a DNS record is visible, reviewable, and auditable.
- **GitHub → GitLab migration path.** Starting with GitHub Actions for Phases 1–9 velocity, then migrating to GitLab CI for SRF IDP alignment, is a clean path. The Terraform code itself is SCM-agnostic — only the CI pipeline config changes.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Terraform from Phase 3 (chosen)** | SRF-aligned; reproducible environments; AI-assisted authoring | Upfront setup time; state backend needed |
| **Terraform deferred to Phase 10** | Simpler Phases 1–2; no state management overhead | Deviates from SRF standards; manual infrastructure creates undocumented state; harder to retrofit |
| **Pulumi (TypeScript)** | Same language as application; type-safe infrastructure | Not the SRF standard; not integrated into SRF IDP; smaller provider ecosystem |
| **Platform-native config only** | Simpler; no Terraform learning curve | Not reproducible; no drift detection; violates SRF IaC principle; each service configured independently |
| **AWS CDK** | Strong AWS integration | Portal is Vercel-based, not AWS-heavy; CDK is AWS-centric; not the SRF standard for non-Lambda infrastructure |

### Consequences

- Phase 3 includes `/terraform` directory with modules for Neon, Vercel, and Sentry
- Phases 1–9 use GitHub + GitHub Actions; Phase 10 migrates to GitLab + GitLab CI (SRF IDP)
- Terraform state stored in Terraform Cloud free tier (Phases 3–9) or GitLab Terraform backend (Phase 10+)
- All environment variables and service configuration defined in Terraform — no undocumented dashboard settings
- `.env.example` still maintained for local development (developers run the app locally without Terraform)
- Auth0, New Relic, and Cloudflare modules added as those services are introduced (Phases 5–6)
- Four-environment convention (dev/qa/stg/prod) adopted per SRF standard, with only `dev` active in Phase 3
- Stakeholder question: does SRF prefer the portal repo in GitLab from day one, or is GitHub acceptable for Phases 1–9 with a planned migration?

---

## ADR-017: Terraform-Native Lambda

**Status:** Accepted | **Date:** 2026-02-21

**Supersedes:** The former Lambda batch decision (AWS Lambda for Batch and Background Workloads)

### Context

The former Lambda batch decision introduced AWS Lambda + Serverless Framework v4 for batch and background workloads starting Phase 5. The decision was sound on the runtime choice (Lambda) but introduced three problems:

1. **Serverless Framework v4 licensing.** SF v4 moved to a paid license model in late 2024. The portal takes on a licensing dependency for a tool it barely needs (< 15 functions across all phases). The SRF Brief specifies SF v4 because most SRF microservices have dozens of Lambda functions — the portal does not.

2. **Dual IaC tooling.** The portal uses Terraform for all infrastructure (Neon, Vercel, Sentry, Cloudflare, S3). Adding SF v4 means two IaC tools, two deployment pipelines, two state management systems. This contradicts the 10-year simplicity principle (ADR-004).

3. **Phase 5 timing.** The former Lambda batch decision placed Lambda infrastructure setup in Phase 5 — already the roadmap's densest phase (multi-book ingestion, theme tagging, editorial review portal, daily passage curation). Meanwhile ADR-019 (database backup) needs Lambda in Phase 3, creating a timing gap that ADR-019 acknowledged awkwardly: "Lambda function added in Phase 3 or Phase 5 when Lambda infrastructure is first deployed."

A comparative analysis of the SRF Tech Stack Brief against the portal's architectural decisions (ADR-013, ADR-004) confirmed that the portal's batch workloads are modest, rare, and well-served by Lambda — but that the deployment tool and introduction timing should match the portal's actual complexity profile, not the SRF microservices pattern.

### Decision

1. **Keep Lambda as the batch processing runtime.** All batch, scheduled, and event-driven workloads run on AWS Lambda. This is unchanged from the former Lambda batch decision.

2. **Deploy Lambda via Terraform, not Serverless Framework v4.** Lambda functions, layers, IAM roles, and EventBridge schedules are managed by the same Terraform that manages all other portal infrastructure. One IaC tool. One deployment pipeline. One state backend.

3. **Use EventBridge Scheduler (not EventBridge Rules) for cron tasks.** EventBridge Scheduler is the purpose-built service for scheduled invocations, with built-in retry with exponential backoff, dead-letter queues, and one-time scheduling. All nightly/daily cron tasks use Scheduler.

4. **Provision Lambda infrastructure in Phase 3, not Phase 5.** Phase 3 ("Engineering Infrastructure") is where Terraform modules are provisioned. The backup Lambda function (ADR-019) deploys immediately. Subsequent phases add functions to already-working infrastructure.

5. **Replace `/serverless/` directory with `/lambda/`.** The directory name reflects the runtime, not a vendor tool.

### Directory Structure

```
/lambda/
 /handlers/
 backup.ts — pg_dump → S3 (Phase 3)
 ingest.ts — Book ingestion pipeline (Phase 5)
 relations.ts — Chunk relation computation (Phase 5)
 aggregate-themes.ts — Nightly search theme aggregation (Phase 7)
 send-email.ts — Daily passage email dispatch (Phase 9)
 generate-social.ts — Quote image generation (Phase 9)
 webhook-contentful.ts — Contentful sync (Phase 10)
 ingest-transcript.ts — YouTube transcript ingestion (Phase 13)
 compute-graph.ts — Knowledge graph positions (Phase 14)
 process-image.ts — Image tier generation (Phase 14)
 process-audio.ts — Audio transcription (Phase 14)
 /layers/
 shared/ — Shared deps (Neon client, Claude SDK)

/terraform/modules/
 /lambda/
 main.tf — Functions, layers, IAM roles, VPC config
 variables.tf
 outputs.tf
 /eventbridge/
 main.tf — Scheduler rules, event patterns
 variables.tf
```

Each Lambda handler is a thin wrapper that imports from `/lib/services/` — the framework-agnostic service layer (ADR-011). The business logic is identical whether invoked by Lambda, CLI, or a test harness.

### Phase-by-Phase Introduction

| Phase | Functions Added | Trigger |
|-------|----------------|---------|
| **3** | `backup` | EventBridge Scheduler (nightly) |
| **5** | `ingest`, `relations` | Manual invocation (CLI/admin portal → Lambda invoke) |
| **7** | `aggregate-themes` | EventBridge Scheduler (nightly) |
| **9** | `send-email`, `generate-social` | Scheduler (daily) / Manual |
| **10** | `webhook-contentful` | EventBridge Pipe (Contentful → Lambda) |
| **13** | `ingest-transcript` | Manual + Scheduler (batch) |
| **14** | `compute-graph`, `process-image`, `process-audio` | Scheduler (nightly) / Event-driven |

Infrastructure is provisioned once in Phase 3. Each subsequent phase adds functions to already-provisioned infrastructure.

### CLI Wrappers

`/scripts/` retains CLI wrappers that call the same `/lib/services/` functions:

```
/scripts/
 ingest.ts — CLI wrapper for local development/debugging
 backup.ts — CLI wrapper
 compute-relations.ts — CLI wrapper
 ...
```

A developer can run `pnpm run ingest --book autobiography` locally. Production runs the same logic via Lambda. The runtime is irrelevant; the business logic is identical.

### Rationale

- **Lambda is SCM-agnostic.** It works identically under GitHub Actions (Phases 1–9) and GitLab CI (Phase 10+). Unlike CI-based cron jobs, Lambda infrastructure doesn't change when the portal migrates from GitHub to GitLab. EventBridge schedules, IAM roles, and S3 buckets are untouched by an SCM migration.
- **The portal already has an AWS footprint.** S3 (backups, Phase 3), Bedrock (Claude API, Phase 1), CloudFront (media streaming, Phase 14), and EventBridge are all AWS services the portal uses regardless. Lambda is the natural compute layer for an AWS-invested project.
- **Terraform-native Lambda is sufficient at this scale.** The portal has < 15 Lambda functions across all phases. SF v4's ergonomics (local invocation, plugin ecosystem, per-function configuration) serve microservice architectures with dozens of functions. For < 15 functions, `aws_lambda_function` + `aws_lambda_layer_version` in Terraform are straightforward and eliminate a tool dependency.
- **One IaC tool, one deployment pipeline.** `terraform apply` already deploys Neon, Vercel, Sentry, Cloudflare, and S3. Adding Lambda to the same pipeline means no new deployment workflow. CI/CD gains no new steps — Lambda deploys alongside everything else.
- **Phase 3 resolves the ADR-019 timing gap.** The backup function deploys in Phase 3 where it belongs. No more "Phase 3 or Phase 5" ambiguity.
- **ADR-013 precedent.** The portal already diverges from SRF's DynamoDB pattern when the portal's needs don't match. The same principle applies: SRF ecosystem alignment is about patterns (Lambda for batch compute), not tools (SF v4 as the deployment mechanism).
- **10-year horizon (ADR-004).** Terraform is Tier 1 (effectively permanent). Serverless Framework v4 is not in any durability tier — it's a deployment tool with licensing risk and competitive pressure from SST, AWS SAM, and native Terraform. Eliminating it removes a 10-year maintenance liability.

### Alternatives Considered

1. **Keep the former Lambda batch decision unchanged (Lambda + SF v4 in Phase 5).** Rejected: introduces dual IaC tooling, SF v4 licensing dependency, and Phase 5 overload. The benefits of Lambda are preserved without the deployment tool overhead.

2. **Replace Lambda entirely with CI-scheduled scripts (GitHub Actions / GitLab CI).** Rejected: builds batch infrastructure on an SCM platform the portal is leaving at Phase 10. CI cron is ephemeral infrastructure — Lambda + EventBridge is durable infrastructure managed by Terraform.

3. **AWS SAM instead of Terraform-native Lambda.** Rejected: SAM is another CLI tool alongside Terraform. For < 15 functions, native Terraform resources are simpler.

4. **SST (open-source Serverless Framework alternative).** Considered but rejected: SST is well-designed but introduces another IaC paradigm. The portal should minimize tool surface area.

5. **AWS Step Functions for ingestion orchestration.** Deferred, not rejected. Book ingestion is a multi-step workflow (extract → chunk → embed → insert → relate → verify), but it runs ~12 times total across the portal's lifetime. A sequential script with progress logging is sufficient. If Phase 14's audio/video pipeline needs multi-step orchestration with failure recovery, Step Functions earns its place via a new ADR.

### Consequences

- The former Lambda batch decision is superseded. Its runtime decision (Lambda for batch) is preserved; its deployment tool (SF v4) and timing (Phase 5) are replaced.
- `/serverless/` directory becomes `/lambda/`. No `serverless.yml`. No SF v4 dependency.
- Terraform gains two modules: `/terraform/modules/lambda/` and `/terraform/modules/eventbridge/`.
- Phase 3 deliverable 3.2 gains Lambda infrastructure provisioning and the backup function.
- Phase 5 deliverable 5.11 simplifies: deploy ingestion and relation functions into already-provisioned infrastructure. No infrastructure setup in Phase 5.
- All downstream ADRs referencing Lambda batch infrastructure now reference ADR-017. The infrastructure is the same (Lambda + EventBridge); the deployment mechanism and timing differ.
- Developers familiar with SF v4 should note: Lambda invocation, monitoring, and IAM are identical. Only the deployment tool changes (Terraform instead of `serverless deploy`).
- **Extends ADR-016** (Terraform as sole IaC tool), **ADR-004** (10-year horizon — fewer tool dependencies), **ADR-018** (CI-agnostic scripts — `/scripts/` wrappers call same logic), **ADR-019** (backup timing resolved — Phase 3).
- **Deferred:** Step Functions for complex orchestration (evaluate at Phase 14 if audio/video pipeline complexity warrants it).

---

## ADR-018: CI-Agnostic Deployment Scripts

**Status:** Accepted | **Date:** 2026-02-19

### Context

The portal will migrate from GitHub Actions (Phases 1–9) to GitLab CI/CD (Phase 10+) per SRF IDP standards. Both CI systems call the same operations: run tests, apply Terraform, run migrations, deploy. If pipeline logic is embedded in CI-specific YAML (GitHub Actions workflow syntax vs. GitLab CI YAML syntax), the Phase 10 migration requires rewriting every pipeline step.

### Decision

Add a `scripts/` directory with CI-system-agnostic deployment scripts. Both GitHub Actions and GitLab CI call these scripts rather than embedding logic in workflow YAML.

#### Directory structure

```
/scripts/
 terraform-plan.sh — Run terraform plan for a given environment
 terraform-apply.sh — Run terraform apply for a given environment
 db-migrate.sh — Run dbmate migrations against a given database URL
 smoke-test.sh — Run smoke tests against a deployed environment
 search-quality.sh — Run the search quality evaluation suite
```

#### CI workflow pattern

GitHub Actions (Phases 1–9):
```yaml
steps:
 - run: ./scripts/terraform-plan.sh dev
 - run: ./scripts/db-migrate.sh $DATABASE_URL
 - run: ./scripts/smoke-test.sh $DEPLOYMENT_URL
```

GitLab CI (Phase 10+):
```yaml
script:
 - ./scripts/terraform-plan.sh dev
 - ./scripts/db-migrate.sh $DATABASE_URL
 - ./scripts/smoke-test.sh $DEPLOYMENT_URL
```

The CI config becomes a thin orchestration layer. The scripts contain the actual logic.

#### Multi-environment promotion pipeline

For Phase 10+ with four environments (dev/qa/stg/prod):

```
PR → dev (auto) → qa (manual gate) → stg (manual gate) → prod (manual gate)
```

Each promotion runs:
1. `terraform-apply.sh {env}` — apply infrastructure for target environment
2. `db-migrate.sh {env}` — run migrations against target environment's database
3. Vercel deployment to target environment's project
4. `smoke-test.sh {env}` — verify the deployment

Migration sequencing: Terraform apply runs *first* (in case it creates the database), then dbmate migrations (which depend on the database existing), then Vercel deploys the new code (which depends on the new schema).

### Rationale

- **Migration cost reduction.** The Phase 10 SCM migration becomes a CI config swap (rewrite `.github/workflows/*.yml` → `.gitlab-ci.yml`), not a logic rewrite. The scripts are identical.
- **Local reproducibility.** Developers can run `./scripts/db-migrate.sh` locally. CI parity with local execution prevents "works on my machine" issues.
- **Testability.** Scripts can be tested independently of the CI system. ShellCheck lint in CI catches script errors.

### Consequences

- `/scripts/` directory added to repo in Phase 1
- GitHub Actions workflows call scripts instead of inline commands
- Phase 10 GitLab migration rewrites CI config only, not deployment logic
- All scripts accept environment name as parameter, defaulting to `dev`
- **Extends ADR-016** (Terraform) with concrete deployment orchestration

---

## ADR-019: Database Backup to S3

**Status:** Accepted | **Date:** 2026-02-19

### Context

The portal's canonical content — book text, embeddings, theme tags, chunk relations, daily passages, calendar events — lives in Neon PostgreSQL. Neon provides point-in-time recovery (PITR), which protects against accidental data loss within Neon's retention window.

However, PITR doesn't protect against:
- Neon service-level incidents beyond their disaster recovery capability
- A catastrophic bad migration that corrupts data and isn't noticed within the PITR window
- The need to restore specific tables or rows without restoring the entire database
- A future vendor migration (if SRF moves away from Neon for any reason)

The 10-year architecture horizon (ADR-004) demands that the data survive any single vendor relationship. Neon may not exist in 10 years. The data must.

### Decision

Add a **nightly `pg_dump` to S3** as a Phase 3 deliverable, alongside the Terraform work.

#### Implementation

- **Lambda function** (using ADR-017 infrastructure) runs nightly via EventBridge cron
- `pg_dump --format=custom` (most flexible restore format)
- Uploaded to an encrypted S3 bucket (`aws:kms` server-side encryption)
- **Retention:** 90 days of daily backups, plus the 1st of each month retained for 1 year
- **Size estimate:** Phase 1 database (~2,000 chunks + embeddings) ≈ 50–100MB compressed. Full library (~50,000 chunks) ≈ 1–2GB compressed. S3 cost: < $1/month.

#### Terraform module

```
/terraform/modules/backup/
 main.tf — S3 bucket, Lambda function, EventBridge rule, IAM role
 variables.tf — Bucket name, retention policy, schedule
 outputs.tf — Bucket ARN
```

#### Restore procedure (documented in operational playbook)

1. Download backup from S3: `aws s3 cp s3://srf-portal-backups/{date}.dump ./`
2. Create a Neon branch for restore testing
3. `pg_restore --dbname=... {date}.dump`
4. Verify content integrity
5. If verified: promote restored branch to production (or merge specific tables)

### Rationale

- **Vendor independence.** The backup exists outside Neon's infrastructure. If Neon has a catastrophic failure or if SRF migrates to another PostgreSQL provider, the data is recoverable from S3.
- **Negligible cost.** S3 Standard-IA with lifecycle rules: < $1/month for the full library backup history.
- **Operational confidence.** Having an independent backup makes risky operations (embedding model migration per ADR-046, major re-ingestion) safer. Rollback is always possible.

### Consequences

- `/terraform/modules/backup/` added in Phase 3
- Lambda function for nightly pg_dump added in Phase 3 (or Phase 5 when Lambda infrastructure from ADR-017 is first deployed)
- S3 bucket created and managed by Terraform
- Restore procedure documented in operational playbook
- Quarterly restore drill: test restore from a random backup to a Neon branch, verify content integrity
- **Extends ADR-016** (Terraform) and **ADR-004** (10-year architecture)

---

## ADR-020: Multi-Tenant Infrastructure Design

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-017 (Lambda batch), ADR-018 (CI-agnostic scripts), ADR-019 (S3 backup)

### Context

The portal will operate across multiple environments (dev, staging, production) and will transition from GitHub to GitLab as SRF's Internal Developer Platform. SRF uses AWS as their cloud provider, Terraform for IaC, and has established patterns for multi-account AWS architectures. The architecture team has autonomous design authority for infrastructure decisions regarding GitLab CI/CD templates, AWS account structure, and Contentful space strategy.

### Decision

Design infrastructure for three isolated environments with promotion gates, using SRF's established tooling patterns.

### AWS Account Strategy

```
SRF AWS Organization
├── srf-teachings-dev — Development account
│ ├── Neon dev branch (or separate project)
│ ├── S3: srf-teachings-dev-assets
│ ├── Lambda: dev deployments
│ └── CloudFront: dev distribution
├── srf-teachings-staging — Staging / QA account
│ ├── Neon staging branch
│ ├── S3: srf-teachings-stg-assets
│ ├── Lambda: staging deployments
│ └── CloudFront: staging distribution
└── srf-teachings-prod — Production account
 ├── Neon production (primary)
 ├── S3: srf-teachings-prod-assets
 ├── Lambda: production deployments
 └── CloudFront: production distribution (global edge)
```

- **Account isolation.** Each environment in its own AWS account. IAM boundaries prevent dev from touching prod. SRF standard pattern.
- **Terraform workspaces.** One Terraform configuration, three workspaces (`dev`, `stg`, `prod`). Environment-specific values in `terraform/environments/{env}.tfvars`.
- **Neon branching.** Dev and staging use Neon branches (instant, free). Production uses the primary Neon project. Schema migrations promoted through branches before reaching production.

### GitLab CI/CD Strategy

```yaml
# .gitlab-ci.yml (Phase 10+)
stages:
 - validate
 - test
 - build
 - deploy-dev
 - deploy-staging
 - deploy-prod

deploy-prod:
 stage: deploy-prod
 when: manual # manual gate for production
 environment:
 name: production
 url: https://teachings.yogananda.org
 only:
 - main
 script:
 - ./scripts/deploy.sh prod
 - ./scripts/migrate.sh prod
 - ./scripts/verify.sh prod
```

- **CI-agnostic scripts.** All deployment logic lives in `/scripts/` (ADR-018). GitLab CI/CD calls the same scripts that GitHub Actions called. Migration is a YAML change, not a logic rewrite.
- **Manual production gate.** Production deployments always require manual approval. No automatic promotion from staging to production.
- **GitLab environments.** Each environment is a GitLab environment with its own URL, enabling GitLab's built-in deployment tracking.

### Contentful Space Strategy

```
Contentful Organization
├── SRF Teachings — Development — dev space (content modeling, testing)
├── SRF Teachings — Staging — staging space (content preview, QA)
└── SRF Teachings — Production — production space (published content)
```

- **Space-per-environment.** Each environment has its own Contentful space. Content is promoted via Contentful's environment aliasing or export/import.
- **Webhook isolation.** Each space's webhooks point to its corresponding environment's API. Dev webhooks trigger dev sync; prod webhooks trigger prod sync.
- **Content modeling in dev.** New content types are modeled in the dev space, tested in staging, then promoted to production. Contentful's migration CLI manages schema changes.

### Rationale

- **SRF standard patterns.** Multi-account AWS, Terraform workspaces, and GitLab CI/CD are established at SRF. This architecture doesn't invent — it applies.
- **Autonomous design authority.** The user confirmed autonomous decision-making for infrastructure. These decisions align with SRF's tech stack while optimizing for the portal's specific needs.
- **Blast radius containment.** A broken dev deployment can never affect production. Account-level isolation is the strongest boundary AWS offers.
- **Migration-ready from day one.** Because deployment scripts are CI-agnostic, the GitHub→GitLab migration at Phase 10 is a configuration change, not a re-architecture.

### Consequences

- Terraform configurations parameterized by environment from Phase 1
- AWS account creation requested through SRF's cloud team (or single-account with IAM isolation if multi-account is delayed)
- Contentful spaces created per environment (free tier supports one space; paid tier needed for multi-space)
- GitLab CI/CD templates prepared during Phase 9, activated at Phase 10
- Neon branching strategy documented in runbook
- **Fallback:** If multi-account AWS is operationally heavy for early phases, a single account with strict IAM policies and resource tagging provides 80% isolation. Migrate to multi-account when the team is ready.

---

## ADR-021: Redundancy, Failover, and Regional Distribution Strategy

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-017 (Lambda batch), ADR-019 (S3 backup), ADR-057 (audio library), ADR-020 (multi-tenant infrastructure)

### Context

The portal serves a global audience. Seekers in India, Latin America, Africa, and Southeast Asia are as important as those in North America and Europe. The architecture must balance global availability and latency against cost and operational complexity. The key question: which layers need multi-region redundancy, and which are adequately served by edge caching in front of a single-region origin?

### Decision

Adopt a **single-region origin with global edge distribution** strategy for Phases 1–9, expanding to **read replicas and cross-region asset replication** at Phase 10+ when traffic patterns justify it. No active-active multi-region. The portal is a reading and search tool, not a financial transaction system — the availability requirements are high but not extreme.

### Architecture by Layer

**Layer 1: Edge (global from day one)**

| Service | Distribution | Notes |
|---------|-------------|-------|
| Vercel Edge Network | 70+ PoPs worldwide | Static pages (ISR) cached at edge. HTML reaches seekers from the nearest PoP. |
| Cloudflare WAF | Global edge | DDoS protection and rate limiting before requests reach Vercel. |
| CloudFront | Global edge | Audio files, PDFs, and static assets cached at edge. Origin is S3 in the primary region. |

Edge caching means a seeker in Mumbai requesting a book chapter gets HTML from a Vercel PoP in Mumbai, a PDF from a CloudFront PoP in Mumbai, and only the search query itself routes to the single-region origin.

**Layer 2: Compute (single-region, Phases 1–9)**

| Service | Region | Failover |
|---------|--------|----------|
| Vercel Serverless Functions | `us-east-1` (or `ap-south-1` if Neon region is in Asia) | Vercel provides within-region redundancy. No cross-region failover. |
| AWS Lambda | Same region as Neon primary | Within-region redundancy (Lambda runs across multiple AZs automatically). |

**Layer 3: Database (single-region with HA, Phases 1–9)**

| Service | Strategy | Notes |
|---------|----------|-------|
| Neon PostgreSQL | Single-region primary with automatic AZ failover | Neon manages replication and failover within the region. If the primary compute goes down, Neon promotes a replica. |
| Neon read replicas (Phase 10+) | Add read replicas in EU and Asia-Pacific | Search queries and reader pages route to the nearest read replica. Write operations (ingestion, editorial review) route to the primary. |

**Layer 4: Storage (single-region with CDN, expanding at Phase 10+)**

| Service | Strategy | Notes |
|---------|----------|-------|
| S3 (primary) | Single-region | Audio files, PDFs, backups. CloudFront sits in front for global delivery. |
| S3 Cross-Region Replication (Phase 10+) | Replicate to a second region | Disaster recovery for assets. If primary region S3 is unavailable, CloudFront falls back to the replica bucket. |

### Failure Scenarios and Response

| Scenario | Impact | Recovery |
|----------|--------|----------|
| Vercel outage (regional) | Pages unavailable | Vercel's global load balancing routes to other regions. ISR-cached pages still served from edge. |
| Neon outage (regional) | Search and dynamic content unavailable. Static pages still served. | Neon's automatic AZ failover. If full region down: portal degrades to static content only (ISR pages, cached PDFs). |
| S3 outage (regional) | New PDF/audio requests fail. CloudFront serves cached copies. | CloudFront continues serving cached assets. At Phase 10+, cross-region replica takes over. |
| Lambda outage | Batch jobs fail (ingestion, backup, email) | Lambda retries automatically. Batch jobs are idempotent — safe to re-run. Email delayed, not lost. |
| CloudFront outage | Asset delivery degraded | Extremely rare (global service). Fallback: direct S3 URLs (slower, no edge caching). |

### Rationale

- **Cost-proportionate resilience.** Active-active multi-region would cost 3–5× more in infrastructure and add significant operational complexity. The portal's availability SLA does not justify this. "Search is down for 30 minutes while Neon fails over" is acceptable; "a seeker loses their reading progress" is not (but all reading state is client-side in `localStorage` anyway).
- **Edge caching covers the latency gap.** The majority of portal requests — page loads, PDFs, audio streams, static assets — are served from the edge. Only search queries and dynamic API calls reach the origin. For search, 200ms of additional latency to a cross-region origin is acceptable.
- **Neon read replicas are the right Phase 10+ investment.** When traffic justifies it, adding a read replica in `ap-south-1` (Mumbai) cuts search latency for the largest seeker population (India) in half. This is a Terraform change, not an architectural change.
- **Backup is separate from failover.** ADR-019 (nightly pg_dump to S3) provides data recovery. This ADR addresses service availability. They complement each other.

### Consequences

- Primary region selected based on Neon availability and SRF's AWS account structure (likely `us-east-1` or `us-west-2`)
- Vercel function region co-located with Neon primary
- Lambda functions deployed to the same region as Neon primary
- CloudFront distribution configured for all static assets from Phase 1
- Phase 10+: Terraform module for Neon read replicas, S3 CRR, and Vercel multi-region functions
- Health check endpoint (`/api/v1/health`) reports database connectivity, enabling uptime monitoring
- **Explicit non-goal:** No active-active multi-region. No global database write replication. No cross-region Lambda orchestration.

---

## ADR-022: Content-Addressable Passage Deep Links

**Status:** Accepted | **Date:** 2026-02-19

### Context

The current deep linking scheme uses `chapter + paragraph_index` to link to specific passages (e.g., `/books/autobiography/14#p7` for chapter 14, paragraph 7). This has a fragility problem: if a book is re-ingested with different chunking (corrected OCR, revised paragraph boundaries, different chunk sizes), the `paragraph_index` values may shift, breaking all previously shared links.

Shared passage links are permanent artifacts. A seeker shares a link to a Yogananda quote with a friend. That link appears in emails, WhatsApp messages, social media posts, browser bookmarks, and physical printouts (QR codes on passage PDFs). If a re-ingestion breaks the link, the seeker's friend arrives at the wrong passage — or worse, a 404. This violates the 10-year architecture principle (ADR-004).

### Decision

Add a **content hash** column to `book_chunks` that provides a stable, content-addressable identifier for each passage. Deep links use this hash as a fallback when `paragraph_index` no longer matches.

#### Schema addition

```sql
ALTER TABLE book_chunks ADD COLUMN content_hash TEXT GENERATED ALWAYS AS (
 encode(sha256(encode(left(content, 200), 'utf8')), 'hex')
) STORED;

CREATE INDEX idx_chunks_content_hash ON book_chunks(content_hash);
```

The hash is computed from the first 200 characters of the passage content. This is enough to uniquely identify a passage within a book (duplicate openings across chapters are astronomically rare in Yogananda's prose), while remaining stable across minor edits (trailing whitespace, typographic normalization).

#### Deep link resolution

```
1. Try exact match: book_slug + chapter_number + paragraph_index
2. If paragraph content doesn't match the OG-embedded content_hash:
 a. Search same chapter for matching content_hash
 b. Search same book for matching content_hash
3. If found: redirect to correct location (301)
4. If not found: show the chapter with a gentle message:
 "This passage may have moved. Here is the chapter it was in."
```

#### Share URL format

Current: `/books/autobiography/14#p7`
Enhanced: `/books/autobiography/14#p7?h=a3f2c8` (first 6 chars of content_hash)

The `h` parameter is used only for resolution fallback when the paragraph_index doesn't match. Normal navigation ignores it.

### Rationale

- **Link permanence.** Shared links survive re-ingestion, re-chunking, and content corrections. A 10-year-old shared URL still works.
- **Graceful degradation.** If the hash can't be resolved (passage genuinely removed), the seeker sees the chapter rather than an error. Content Availability Honesty principle.
- **Zero cost in the happy path.** When paragraph_index matches (99% of cases), the hash is never consulted. The resolution chain adds latency only when content has actually changed.
- **Minimal schema impact.** One generated column, one index. No migration complexity.

### Consequences

- `content_hash` column added to `book_chunks` table in the initial migration (Phase 1)
- Share URLs include the `h` parameter (short hash suffix)
- OG meta tags embed the content_hash for later verification
- Re-ingestion scripts log when paragraph_index shifts occur, enabling link audit
- **Extends ADR-004** (10-year architecture) and **ADR-068** (passage sharing)

---

## ADR-023: Search API Rate Limiting and Abuse Prevention

**Status:** Accepted | **Date:** 2026-02-19

### Context

The search API (`/api/v1/search`) calls the Claude API for query expansion and passage ranking. Each search costs approximately $0.01–0.02 in Claude API usage. The portal has no authentication until Phase 15+. All API routes are public.

A bot or bad actor could hammer the search endpoint and generate significant Claude API costs. At 100 requests/second, the portal would burn through $50–100/hour in Claude API charges. Even accidental abuse (a misbehaving scraper, a search indexer hitting the API) could spike costs.

The DESIGN.md security section mentions "Rate limiting on API routes" but doesn't specify the implementation.

### Decision

Implement rate limiting at two layers:

#### Layer 1: Cloudflare (edge — Phase 1)

Cloudflare's free tier includes basic rate limiting via WAF rules. Configure:

| Rule | Limit | Scope |
|------|-------|-------|
| Global API rate limit | 60 requests/minute per IP | All `/api/v1/*` routes |
| Search rate limit | 15 requests/minute per IP | `/api/v1/search` specifically |
| Burst protection | 5 requests/second per IP | All routes |

These limits are generous for human seekers (who search a few times per session) but block automated abuse.

#### Layer 2: Application (API route — Phase 1)

A lightweight in-memory rate limiter (e.g., `rate-limiter-flexible` with Vercel's edge runtime, or a simple sliding window counter in a Vercel KV store) as a defense-in-depth measure:

- **Claude API calls gated**: If the IP exceeds the search rate limit, the API falls back to database-only search (vector + FTS without Claude query expansion or re-ranking). The seeker still gets results — just without the AI refinement layer. This is graceful degradation, not a hard block.
- **Hard block threshold**: If an IP exceeds 200 requests/hour to any API endpoint, return `429 Too Many Requests` with a `Retry-After` header and a calm message: "Please wait a moment before searching again."

#### Claude API budget cap

Set a monthly spending cap via the Anthropic API dashboard. If the cap is reached, the search API silently falls back to database-only search for all users. The portal degrades gracefully — search still works, just without query expansion. This is the last line of defense against cost runaway.

### Rationale

- **Cost protection is a Phase 1 requirement**, not an afterthought. The Claude API is the only variable-cost component in the early phases. Unbounded cost exposure on a public, unauthenticated API is an unacceptable risk.
- **Graceful degradation over hard blocks.** A seeker who happens to search frequently (exploring themes, trying different queries) should never see an error page. They see slightly less refined results. The portal remains welcoming.
- **Two-layer defense.** Cloudflare catches the obvious abuse (bots, scrapers). The application layer catches the edge cases (distributed abuse, legitimate but excessive use).

### Consequences

- Cloudflare WAF rules configured in Phase 1 (added to Terraform Cloudflare module)
- Application-level rate limiter in the search API route
- Claude API monthly budget cap set via Anthropic dashboard
- Search gracefully degrades to database-only when rate-limited or budget-exceeded
- Monitoring: Sentry alert on rate limit triggers; New Relic dashboard for Claude API usage (Phase 7)
- **Extends** the security section of DESIGN.md with concrete implementation

---

## ADR-024: Native Share API as Primary Mobile Sharing

**Status:** Accepted | **Date:** 2026-02-19

### Context

The passage sharing design (ADR-068) provides a share menu with four options: copy link, email passage, save as image, save as PDF. This serves desktop seekers well. But in the Global South — India, Brazil, Nigeria, Indonesia — WhatsApp is the primary sharing mechanism for spiritual content. A seeker in Mumbai who wants to share a Yogananda quote with a friend opens WhatsApp, not email.

The Web Share API (`navigator.share`) surfaces the device's native sharing sheet, which includes WhatsApp, Telegram, Signal, SMS, and any other installed sharing apps. It is the most natural way to share on mobile, and it removes the portal's need to know which apps the seeker uses.

### Decision

Use `navigator.share` as the **primary** share action on mobile devices that support it. The custom share menu (copy link, email, save as image, save as PDF) is the fallback for desktop and unsupported browsers.

#### Behavior

```
Mobile (navigator.share supported):
 Tap share icon → native share sheet opens immediately
 Shares: passage text (truncated) + deep link URL
 "Save as image" and "Save as PDF" remain as separate actions in a "..." overflow menu

Mobile (navigator.share NOT supported):
 Tap share icon → custom share menu (copy link, email, save as image, save as PDF)

Desktop:
 Click share icon → custom share menu (always)
```

#### Share payload

```javascript
navigator.share({
 title: 'Paramahansa Yogananda — Autobiography of a Yogi',
 text: '"The soul is ever free; it is deathless, birthless..." — Chapter 26, p. 312',
 url: 'https://teachings.yogananda.org/books/autobiography/26#p7?h=a3f2c8'
});
```

### Rationale

- **Global South alignment.** WhatsApp has 2+ billion users, concentrated in exactly the regions the portal serves. `navigator.share` reaches WhatsApp without adding a WhatsApp-specific button or SDK.
- **Privacy by design.** No third-party sharing scripts. No social media tracking pixels. The browser handles the share natively. DELTA-compliant by architecture.
- **Reduced UI complexity.** On mobile, one tap opens the native sheet. No custom menu to build, maintain, or localize.
- **Future-proof.** New sharing apps appear; old ones fade. The native share sheet automatically reflects the user's installed apps. The portal doesn't need to keep a list of sharing targets.

### Consequences

- Share icon behavior branches on `navigator.share` support (feature detection, not device detection)
- "Save as image" and "Save as PDF" are separate from the share action (they generate files, not share intents)
- Desktop always shows the custom share menu
- Mobile shows the native sheet with an overflow menu for image/PDF generation
- **Amends ADR-068** (passage sharing) with mobile-first native sharing

---

## ADR-025: PDF Generation Strategy — Resource-Anchored Exports

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-006 (Global South delivery), ADR-083 (Study Workspace), ADR-057 (audio library)

### Context

The portal generates PDFs for multiple content types: full books, individual chapters, audio transcripts, video transcripts, talk outlines, and arbitrary passage collections. A coherent PDF strategy must address three concerns: (1) where PDF routes live in the API, (2) which PDFs are pre-rendered vs. dynamic, and (3) the generation technology.

### Decision

**Principle: PDF is a format of a resource, not a separate resource type.** When a resource supports PDF export, the PDF route is a `/pdf` sub-path of that resource — not a parallel namespace. This keeps the API navigable: if you know where a resource lives, you know where its PDF lives.

### API Surface

```
# ── Pre-rendered PDFs (GET, cacheable, served from S3 via CloudFront) ──

GET /api/v1/books/{slug}/pdf → Full book PDF
GET /api/v1/books/{slug}/chapters/{n}/pdf → Chapter PDF
GET /api/v1/audio/{slug}/transcript/pdf → Audio transcript PDF
GET /api/v1/videos/{id}/transcript/pdf → Video transcript PDF

# ── Dynamic PDFs (on-demand generation) ──

GET /api/v1/study/outlines/{id}/pdf → Study outline PDF
POST /api/v1/exports/pdf → Arbitrary content PDF
 Body: { "type": "passages", "ids": ["uuid", ...] }
 Body: { "type": "search", "query": "...", "language": "en" }
```

### Pre-rendered vs. Dynamic

| PDF Type | Strategy | Trigger | Cache |
|----------|----------|---------|-------|
| Full book | Pre-rendered, S3 + CloudFront | Generated at ingestion time. Regenerated on content update (Contentful webhook or re-ingestion). | Long-lived. CloudFront TTL: 30 days. Invalidated on content change. |
| Chapter | Pre-rendered, S3 + CloudFront | Same as book. | Same. |
| Audio transcript | Pre-rendered, S3 + CloudFront | Generated when transcript status reaches `approved`. Regenerated on transcript update. | Same. |
| Video transcript | Pre-rendered, S3 + CloudFront | Same as audio transcript. | Same. |
| Talk outline | Dynamic, Lambda | On-demand when preparer clicks "Export PDF." | Not cached (private, user-specific). |
| Passage collection | Dynamic, Lambda | On-demand when seeker clicks "Download as PDF." | Short-lived: 1 hour. Keyed by sorted passage IDs. |
| Search results | Dynamic, Lambda | On-demand. | Short-lived: 1 hour. Keyed by query + filters. |

### Transcript Sub-Resource Pattern

Audio and video transcripts are sub-resources that serve dual purpose — as JSON for the synchronized player, and as PDF for download:

```
GET /api/v1/audio/{slug}/transcript → JSON (timestamped segments for player)
GET /api/v1/audio/{slug}/transcript/pdf → PDF (formatted transcript for reading/printing)

GET /api/v1/videos/{id}/transcript → JSON (timestamped chunks for player)
GET /api/v1/videos/{id}/transcript/pdf → PDF (formatted transcript for reading/printing)
```

The `/transcript` endpoint is useful on its own — it's what the synchronized audio player and video player consume. The `/transcript/pdf` endpoint is a formatted view of the same data.

### Generation Technology

**`@react-pdf/renderer`** for all PDF generation. Rationale:

- Produces PDFs from React components — the PDF layout shares design tokens (Merriweather serif, SRF Gold accents, warm cream) with the web reader.
- Runs in Node.js (Lambda and Vercel Serverless Functions) without a headless browser.
- Lighter and faster than Puppeteer/Playwright approaches.
- The portal's PDFs are structurally simple (text + citations + headers) — no need for full browser rendering.

### PDF Design Treatment

All PDFs share a consistent visual language:

- **Cover page** (books only): Title, author, SRF/YSS logo, lotus watermark
- **Running header**: Content source (book title, recording title, "Search Results")
- **Running footer**: "From the SRF Online Teachings Portal — teachings.yogananda.org" + page number
- **Typography**: Merriweather serif for body, Open Sans for headers and metadata
- **Citations**: Every passage includes book/chapter/page or recording/timestamp
- **Page size**: A4 default (global standard). US Letter as `?pageSize=letter` query param.
- **File size display**: Download buttons show estimated file size (ADR-024 principle — honest about what the seeker is downloading, especially for Global South bandwidth constraints)
- **Accessibility**: PDF/UA tagged for screen reader compatibility. Language attribute set. Bookmarks for chapters/sections.

### Why Not `/api/v1/pdf/books/{slug}`

A separate `/pdf/` namespace creates a parallel hierarchy where every resource path is duplicated. This is harder to discover, harder to document, and means two places to maintain when routes change. By anchoring PDFs to their parent resource (`/books/{slug}/pdf`), the API remains navigable — a developer or seeker who knows the resource URL can append `/pdf` to get the downloadable version.

### The `POST /api/v1/exports/pdf` Exception

Pre-renderable PDFs are GET endpoints on their parent resources. But a seeker who selects 7 passages from a search wants a PDF of an *ad-hoc collection* that doesn't correspond to a single existing resource. `POST /api/v1/exports/pdf` handles this:

- POST because the request body can be complex (list of UUIDs, search query with filters)
- POST because it's a generation action, not retrieval of a pre-existing document
- The `type` field in the body disambiguates: `"passages"` (explicit IDs) vs. `"search"` (re-execute a query and format results)

### Rationale

- **Consistent pattern.** Every content type that supports PDF export does it the same way: `/{resource}/pdf`. No exceptions, no parallel namespaces.
- **Pre-rendering where possible.** Books and transcripts change rarely. Generating PDFs at ingestion time and serving from CloudFront means zero generation latency for the seeker and zero compute cost per download.
- **Dynamic where necessary.** Talk outlines and passage collections are unique per request. Lambda handles these on-demand with short-lived caching for popular search queries.
- **Shared design system.** `@react-pdf/renderer` with shared design tokens ensures every PDF — book, transcript, outline, passage collection — looks like it came from the same portal.

### Consequences

- Pre-rendered PDFs added to ingestion pipeline: book PDFs generated after book ingestion, transcript PDFs generated after transcript approval
- S3 bucket structure: `s3://srf-teachings-{env}-assets/pdf/books/{slug}.pdf`, `s3://srf-teachings-{env}-assets/pdf/books/{slug}/chapters/{n}.pdf`, `s3://srf-teachings-{env}-assets/pdf/audio/{slug}-transcript.pdf`, `s3://srf-teachings-{env}-assets/pdf/videos/{id}-transcript.pdf`
- Lambda function for dynamic PDF generation (`/lambda/pdf-generator/`)
- `@react-pdf/renderer` added as a dependency (or in a shared package if Lambda and Vercel both generate PDFs)
- CloudFront invalidation on content update (book re-ingestion, transcript edit)
- File size stored in metadata and displayed on download buttons
- Phase 8: Book and chapter PDFs (pre-rendered)
- Phase 8: Talk outline PDFs (dynamic)
- Phases 13–14: Audio and video transcript PDFs (pre-rendered)
- Future: Passage collection and search result PDFs (dynamic, Phase 15+ or as demand warrants)

---

## ADR-026: Low-Tech and Messaging Channel Strategy

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-011 (API-first), ADR-006 (Global South delivery), ADR-017 (Lambda batch), ADR-024 (native share), ADR-057 (audio library)

### Context

The portal's primary interface is a web application. This serves smartphone and desktop users well, but excludes seekers who access the internet primarily through:

- **Feature phones** (KaiOS, basic browsers) — ~1 billion devices globally, concentrated in India, Africa, Southeast Asia
- **Basic phones** (SMS-only, no browser) — ~3 billion people worldwide
- **Metered data** where even a 100KB page load is a considered expense
- **No personal device** — shared community phones, cybercafé access

The portal's mission is to make Yogananda's teachings freely accessible *worldwide*. "Worldwide" includes the seeker in rural Bihar who has a basic Nokia phone and intermittent SMS access. The API-first architecture (ADR-011) already enables non-web access channels — every passage, every search result is available via a JSON API. The question is: which channels should we build?

### Decision

Build a multi-channel access strategy that meets seekers where they are, using the messaging platforms they already use. Prioritize by reach and cost-effectiveness.

### Channel Assessment

| Channel | Reach | Cost Model | Richness | Implementation |
|---------|-------|-----------|----------|----------------|
| **WhatsApp Business API** | 2.7B users. Dominant in India, Brazil, Nigeria, Indonesia, Mexico | Per-conversation: $0.005–0.08 depending on region and initiation | Rich: text, images, audio clips, buttons, links | Lambda + WhatsApp Cloud API |
| **SMS (inbound + outbound)** | Universal. Every phone. No internet required. | Per-message: $0.002–0.04 depending on country and provider | 160 chars (Latin) / 70 chars (non-Latin). Multi-part available. | Lambda + Twilio or Africa's Talking |
| **Telegram Bot** | 800M users. Popular in Russia, Iran, Southeast Asia, parts of Africa | Free (no per-message cost) | Rich: text, images, audio, inline keyboards, formatting | Lambda + Telegram Bot API |
| **USSD** | Universal in Africa. Works on any phone. | Per-session: $0.01–0.05 | Menu-driven, 182 chars per screen, session-based | Requires telco partnership (Africa's Talking) |
| **IVR (Voice)** | Universal. Serves non-literate seekers. | Per-minute: $0.01–0.10 | Audio only. Could play Yogananda's voice recordings. | Lambda + Twilio Voice |

### Tier 1: WhatsApp (Highest Impact)

WhatsApp is the most impactful channel for the Global South. In India alone, WhatsApp has 500M+ users. A seeker can message the portal's WhatsApp number with a spiritual question and receive passages with full citations.

```
Seeker: "What does Yogananda say about overcoming fear?"

Portal: 📖 From *Autobiography of a Yogi*, Chapter 12, p. 98:

"Fearlessness means faith in God: faith in His
protection, His justice, His wisdom, His mercy,
His love, and His omnipresence."

— Paramahansa Yogananda

📖 1 more passage found. Reply MORE to see it.
🔗 Read the full chapter: teachings.yogananda.org/books/autobiography/12

Reply with any topic to search, or DAILY for today's wisdom.
```

**WhatsApp capabilities:**
- **Search queries.** Seeker sends a question or topic. Lambda queries the search API, formats top 1-2 results for WhatsApp's message format (1024 char limit per message, Markdown-like formatting).
- **Daily Wisdom opt-in.** Seeker sends "DAILY" to subscribe. Each morning, the same daily passage from the web portal is sent via WhatsApp. Opt-out: send "STOP."
- **Audio clips.** When a search matches an audio recording, send a brief audio clip (WhatsApp supports up to 16MB audio messages). "Listen to Yogananda speak about this topic."
- **Language selection.** Seeker sends "HINDI" or "ESPAÑOL" to switch language for UI messages. Content availability depends on translated corpus.
- **Share from portal.** On the web portal, `navigator.share` already surfaces WhatsApp as a sharing target. The shared link includes Open Graph metadata so the message renders with a passage preview.

**Implementation:**
```
Seeker (WhatsApp) → WhatsApp Cloud API webhook → API Gateway → Lambda
 │
 ├── Parse message intent (topic search, command, language switch)
 ├── Query /api/v1/search or /api/v1/daily-passage
 ├── Format response for WhatsApp (Markdown, citations, buttons)
 └── Send reply via WhatsApp Cloud API
```

### Tier 2: SMS (Widest Reach)

SMS reaches every phone on Earth. No app, no internet, no data plan. The seeker texts a topic keyword to a phone number and receives a Yogananda passage by SMS.

```
Seeker texts "FEAR" to +1-XXX-YYY-ZZZZ

Reply:
"Fearlessness means faith in God: faith in His
protection, His justice, His wisdom, His love."
— Yogananda, Autobiography of a Yogi, Ch.12, p.98
Reply FEAR2 for more. DAILY for daily wisdom.
```

**SMS constraints:**
- **160 characters** (Latin script) or **70 characters** (Unicode/non-Latin) per segment. Multi-part SMS is possible but more expensive and less reliable.
- **Short passages only.** Affirmations, aphorisms, and brief quotes from *Sayings of Paramahansa Yogananda* and *Scientific Healing Affirmations* fit well. Long narrative passages from *Autobiography* must be truncated with "..." and a citation.
- **No links** (feature phones can't open URLs). The passage must be self-contained.
- **Cost.** SMS costs vary widely: ~$0.002/message in India, ~$0.04/message in the US, ~$0.01–0.02/message in Africa. Monthly cost depends on volume. At 1,000 messages/day globally: ~$600–1,200/month.
- **Dedicated numbers.** Short codes (e.g., "text YOGANANDA to 12345") are expensive ($500–1,000/month in the US). Long codes or toll-free numbers are cheaper. Local numbers per country reduce inbound cost for seekers.

**SMS sharing from the portal:**
- `navigator.share` already includes SMS as a sharing target on smartphones
- The shared content should be the passage text + citation (not just a URL), since the recipient may be on a feature phone that can't open links
- Passage share format for SMS: `"{quote}" — Yogananda, {Book}, Ch.{N}, p.{P}`

**SMS inbound implementation:**
```
Seeker (SMS) → Twilio / Africa's Talking webhook → API Gateway → Lambda
 │
 ├── Parse keyword (topic, command)
 ├── Query /api/v1/search (limit=1, optimized for short passages)
 ├── Format for SMS (truncate to 160 chars, include citation)
 └── Send reply via SMS gateway
```

### Tier 3: Telegram Bot (Free, Rich)

Telegram is free to operate (no per-message cost) and offers rich formatting. Worth building because the marginal cost after WhatsApp is low — same Lambda function, different message formatting.

```
/search overcoming fear → Search and return passages
/daily → Subscribe to daily wisdom
/audio fear → Find audio recordings on this topic
/language hindi → Switch UI language
```

### Tier 4: USSD and IVR (Exploration)

USSD and voice are the deepest-reach channels but require telco partnerships and are operationally complex. Evaluate after WhatsApp and SMS prove demand.

**USSD concept (Africa):**
```
Dial *384*YOGA#
1. Search teachings
2. Today's wisdom
3. Listen to audio
4. Change language
```

**IVR concept:**
```
Call +1-XXX-YYY-ZZZZ
"Welcome to the teachings of Paramahansa Yogananda.
Press 1 to hear today's wisdom.
Press 2 to search by topic.
Press 3 to hear a recording of Yogananda's voice."
```

IVR is uniquely powerful because it serves non-literate seekers and allows playing Yogananda's actual voice recordings — a direct connection to the Master's teachings that no text channel can provide.

### Shared Architecture

All channels share the same backend:

```
 ┌──────────────┐
WhatsApp webhook ──→│ │
SMS webhook ───────→│ Lambda │──→ /api/v1/search
Telegram webhook ──→│ (channel │──→ /api/v1/daily-passage
USSD callback ────→│ router) │──→ /api/v1/audio
IVR webhook ──────→│ │──→ /api/v1/books
 └──────────────┘
 │
 Format response
 per channel constraints
 │
 ┌──────────────┐
 │ Send reply │
 │ via channel │
 │ API │
 └──────────────┘
```

The Lambda function:
1. Receives the webhook (channel-agnostic intent parsing)
2. Queries the same `/api/v1/` endpoints that the web portal uses
3. Formats the response for the channel's constraints (160 chars for SMS, 1024 chars for WhatsApp, Markdown for Telegram)
4. Sends the reply via the channel's API

**No new content infrastructure.** Every passage served via messaging channels is the same passage served on the web — same database, same search, same citations.

### Data Model

```sql
-- Messaging channel subscriptions (daily wisdom opt-in)
CREATE TABLE messaging_subscriptions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'sms', 'telegram')),
 channel_id TEXT NOT NULL, -- phone number or Telegram user ID
 subscription_type TEXT NOT NULL DEFAULT 'daily' CHECK (subscription_type IN ('daily')),
 language TEXT NOT NULL DEFAULT 'en',
 status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'unsubscribed')),
 subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now,
 unsubscribed_at TIMESTAMPTZ,
 UNIQUE (channel, channel_id, subscription_type)
);

-- Messaging interaction log (anonymized, for cost tracking and channel health)
-- NO personal data. NO message content. Just aggregate counts.
CREATE TABLE messaging_metrics (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 channel TEXT NOT NULL,
 interaction_type TEXT NOT NULL CHECK (interaction_type IN ('search', 'daily', 'subscribe', 'unsubscribe', 'audio')),
 country_code TEXT, -- from phone number prefix (not stored with identity)
 language TEXT NOT NULL DEFAULT 'en',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE INDEX idx_messaging_subs_channel ON messaging_subscriptions(channel, status);
CREATE INDEX idx_messaging_metrics_daily ON messaging_metrics(created_at, channel);
```

**DELTA compliance:** The `messaging_metrics` table stores interaction counts, not conversations. No message content is stored. No behavioral profiling. Country code is derived from phone number prefix for aggregate reporting only (e.g., "42% of SMS queries come from India"), never stored with identity.

### Cost Projection

| Channel | Monthly Cost (est. at 1,000 daily interactions) | Notes |
|---------|------------------------------------------------|-------|
| WhatsApp | $150–300 | Per-conversation pricing. User-initiated conversations are cheapest. |
| SMS | $600–1,200 | Varies wildly by country. India is cheap; US is expensive. |
| Telegram | $0 | Free API. Only Lambda compute cost. |
| USSD | Requires telco negotiation | Typically $0.01–0.05/session in Africa. |
| IVR | $300–600 | Per-minute voice pricing. Short interactions. |

### Rationale

- **The mission demands it.** "Freely accessible worldwide" cannot mean "freely accessible to people with smartphones and data plans." 3+ billion people have basic phones. If the portal only serves web browsers, it is not fulfilling its mission.
- **API-first makes it cheap.** The `/api/v1/` endpoints already exist. Each messaging channel is a Lambda function that reformats API responses. The content infrastructure cost is zero — only the delivery channel costs money.
- **WhatsApp is the highest-leverage investment.** 2.7 billion users, dominant in exactly the regions where the teachings are most sought (India, Latin America, Africa). A WhatsApp bot costs less per month than a single Contentful developer seat.
- **SMS is the deepest-reach investment.** No smartphone needed, no internet needed, no data plan needed. A seeker in a village with a basic phone can text "PEACE" and receive Yogananda's words. This is the most mission-aligned feature the portal could build.
- **Channels compose.** Each new channel is incremental — same Lambda, same API, different formatter. Adding Telegram after WhatsApp is a weekend of work, not a quarter of work.

### Consequences

- Phase 9: WhatsApp Business API integration (alongside daily email — shared infrastructure). Daily wisdom via WhatsApp. Search via WhatsApp.
- Phase 9: RSS feeds (machine syndication, complementary channel)
- Phase 16: SMS access gateway (requires cost evaluation per region, dedicated phone numbers)
- Phase 16: Telegram bot (low cost, incremental after WhatsApp)
- Future: USSD (requires telco partnership, evaluate in Phase 16)
- Future: IVR/Voice (evaluate after audio library exists, Phase 14+)
- `messaging_subscriptions` and `messaging_metrics` tables added to schema
- Lambda function for channel routing (`/lambda/functions/messaging/`)
- WhatsApp Business account registration (requires Meta business verification)
- SMS provider evaluation: Twilio (global), Africa's Talking (Africa-optimized), Gupshup (India-optimized)
- Passage formatting service in `/lib/services/format.ts` — formats a passage for different channel constraints (160 chars, 1024 chars, Markdown, plain text)
- **Extends** ADR-024 (native share) — SMS sharing from the portal now includes passage text, not just a URL
- **Extends** Phase 16.5 (SMS access gateway) — now part of a broader multi-channel strategy, not a standalone experiment
- **Replaces** the Phase 16.5 "exploration" framing with a committed delivery plan starting at Phase 9 (WhatsApp)

---

## ADR-027: Language API Design — Locale Prefix on Pages, Query Parameter on API

**Status:** Accepted | **Date:** 2026-02-20

### Context

The portal serves content in multiple languages (Phase 11+). Two independent systems need language awareness: the frontend pages (rendered by Next.js for seekers) and the API routes (consumed by the web frontend, mobile apps, WhatsApp bots, and future integrations). The question is how language is expressed in URLs.

Three approaches were considered:

| Approach | Frontend URL | API URL | Pros | Cons |
|----------|-------------|---------|------|------|
| **Locale prefix everywhere** | `/hi/themes/peace` | `/api/v1/hi/themes/peace/passages` | Consistent URL pattern | Conflates locale and API versioning; not every API endpoint is language-scoped (`/health`, passage-by-id); awkward for mobile apps that manage locale in their own state |
| **Query parameter everywhere** | `/themes/peace?language=hi` | `/api/v1/themes/peace/passages?language=hi` | Clean API contract; single endpoint surface | Loses SEO benefits for frontend pages; no `hreflang` linking; no `lang` attribute signal from URL |
| **Hybrid: prefix on pages, parameter on API** | `/hi/themes/peace` | `/api/v1/themes/peace/passages?language=hi` | SEO-friendly pages; clean API contract; each system uses the pattern natural to its consumers | Two patterns to understand (but each is standard in its domain) |

### Decision

Adopt the **hybrid approach**: locale path prefix on frontend pages, query parameter on API routes.

**Frontend pages:** `/{locale}/path` — standard Next.js i18n routing via `next-intl`.

```
/hi/themes/peace ← Hindi theme page
/hi/books/autobiography ← Hindi book page
/hi/search?q=... ← Hindi search
/hi/quiet ← Hindi Quiet Corner
/themes/peace ← English (default, no prefix)
```

**API routes:** `/api/v1/path?language={locale}` — language as query parameter.

```
/api/v1/themes/peace/passages?language=hi ← Hindi passages for theme
/api/v1/search?q=...&language=hi ← Hindi search
/api/v1/daily-passage?language=hi ← Hindi daily passage
/api/v1/passages/[chunk-id] ← Language inherent to chunk
/api/v1/passages/[chunk-id]?language=hi ← Cross-language: find Hindi equivalent via canonical_chunk_id
/api/v1/health ← No language parameter needed
```

**Server Components** call service functions with language as a function parameter: `findPassages(query, 'hi', options)`. The locale is extracted from the URL prefix by the Next.js middleware and passed down. The service layer never reads the URL — it receives language as a plain argument.

### Rationale

- **Language is a property of content, not a namespace for operations.** "Search" is the same operation regardless of language. The `?language=` parameter modifies what content is returned, not what operation is performed. This is the fundamental insight.
- **API consumers vary.** The web frontend handles locale via URL prefix (standard i18n SEO). A mobile app manages locale in its own state. A WhatsApp bot receives locale from the user's profile. A third-party scholar tool may request multiple languages in sequence. The API should serve all with a single, clean contract.
- **Not every endpoint is language-scoped.** `/api/v1/health`, `/api/v1/passages/[chunk-id]` (the passage already *is* in a language), `/api/v1/books` (returns all books with their `language` field) — forcing a locale prefix on these creates semantic confusion.
- **CDN caching works with query parameters.** Vercel and Cloudflare cache based on full URL including query string. `?language=hi` produces a distinct cache entry.
- **Versioning and locale are orthogonal.** `/api/v1/` is the version namespace. Locale is content filtering. Mixing them (`/api/v1/hi/`) conflates two independent axes of variation.
- **10-year horizon.** New languages are added by supporting a new `language` parameter value — no new route structure, no new endpoints. The API contract is stable across all future languages.

### Consequences

- Frontend i18n uses `next-intl` with URL-based locale prefixes from Phase 2 (consistent with ADR-075)
- All API endpoints accept an optional `language` query parameter (default: `en`)
- The `language` parameter triggers locale-first search and English fallback at the service layer (ADR-075)
- Mobile apps and other consumers pin to the API and pass language as a parameter
- Server Components extract locale from the URL prefix and pass it to service functions — business logic never reads URLs
- `hreflang` tags on frontend pages enable cross-locale SEO linking
- The OG meta tags on passage share URLs include the language, so shared links render in the correct locale
- **Extends ADR-075** (multi-language architecture) and **ADR-011** (API-first architecture)

---

## ADR-028: Remove book_store_links Table — Simplify Bookstore Links

**Status:** Accepted | **Date:** 2026-02-19

### Context

The original schema included a `book_store_links` table for per-language bookstore URLs (SRF Bookstore for English, YSS Bookstore for Hindi/Bengali, regional Amazon or publisher sites for others), with a fallback to the `books.bookstore_url` column.

### Decision

Remove the `book_store_links` table entirely. The `books.bookstore_url` column is sufficient — it points to the SRF Bookstore for all books. The portal is not an e-commerce gateway; directing seekers to the SRF Bookstore is the appropriate action for all languages in all foreseeable phases.

If per-language bookstore routing is genuinely needed in Phase 11 (YSS Bookstore for Hindi/Bengali editions), a simple lookup table or additional column can be added at that time — a trivial migration.

### Consequences

- One fewer table, one fewer foreign key relationship, one fewer fallback logic path
- `books.bookstore_url` is the single source for "Find this book" links
- Phase 11 deliverable 11.11 updated to reference `books.bookstore_url` instead of `book_store_links`
- Zero impact on any Phase 1–10 deliverable

---

## ADR-029: Autobiography of a Yogi as Phase 1 Focus

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The SRF corpus spans dozens of books and thousands of pages. Phase 1 needs a single book to prove the search pattern.

| Book | Pages | Why Consider | Why Not |
|------|-------|-------------|---------|
| **Autobiography of a Yogi** | ~500 | Most widely read; accessible; diverse topics; narrative style | Less scriptural commentary |
| The Second Coming of Christ | ~1,600 | Rich scriptural commentary; verse-by-verse structure tests chunking | Massive; OCR quality uncertain; 2 volumes |
| God Talks With Arjuna | ~1,200 | Dense philosophical content; tests semantic search depth | Similar concerns as above |

### Decision

Start with **Autobiography of a Yogi**.

### Rationale

- Most recognizable and accessible Yogananda work
- Moderate size (~500 pages, manageable for manual QA)
- Contains diverse topics (meditation, miracles, science, daily life, relationships, death) — good for testing search breadth
- Narrative prose style tests the chunking strategy differently than verse commentary
- Available in many translations (useful for future multi-language testing)

### Consequences

- The chunking strategy optimized for narrative prose may need adjustment for verse-by-verse commentary books (Second Coming, Bhagavad Gita) later
- Phase 1 demonstrates the concept on the most popular book, which is strategically useful for stakeholder presentations

---

## ADR-030: Book Ingestion Priority — Life-Impact Over Scholarly Significance

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The Roadmap (Phase 5) originally listed post-Phase 1 books in an order roughly corresponding to scholarly depth and corpus size: The Second Coming of Christ, God Talks With Arjuna, Man's Eternal Quest, The Divine Romance, etc. However, the question of what makes the portal *essential* for seekers shifts the optimization target from scholarly completeness to life-impact — which books most directly address the reasons people seek spiritual guidance?

| Ordering Criterion | Optimizes For | Risk |
|-------------------|---------------|------|
| **Scholarly significance** | Deep students, long-term corpus completeness | Multi-volume scriptural commentaries are massive (1,200–1,600 pages each) and require complex verse-aware chunking — delaying the availability of more accessible works |
| **Life-impact potential** | Newcomers, seekers in crisis, daily visitors, SEO discoverability | Smaller, topically organized books may have less depth per passage |

### Decision

Reorder book ingestion to prioritize **life-impact potential** — books that are topically organized, highly quotable, and directly address universal human struggles (fear, grief, health, relationships, purpose).

**Revised priority:**

| Priority | Book | Rationale |
|----------|------|-----------|
| 1 | *Autobiography of a Yogi* | Phase 1 focus (already decided, ADR-029) |
| 2 | *Where There Is Light* | Organized by life topic (hope, courage, healing, success). Directly powers thematic navigation. Maps to the "Doors of Entry" feature. |
| 3 | *Sayings of Paramahansa Yogananda* | Standalone aphorisms — naturally pre-chunked. Powers the "Today's Wisdom" daily passage feature. Lowest ingestion complexity. |
| 4 | *Scientific Healing Affirmations* | Directly addresses health, abundance, and peace. Powers "The Quiet Corner." Practical and actionable. |
| 5 | *Man's Eternal Quest* | Collected talks addressing every major life challenge. Rich, practical, accessible prose. |
| 6 | *The Divine Romance* | Collected talks on love, relationships, divine longing. Deeply poetic and practical. |
| 7 | *How You Can Talk With God* | Short, accessible, foundational. Good for newcomers. |
| 8 | *Metaphysical Meditations* | Affirmations and meditations. Supplements the Quiet Corner and daily passage features. |
| 9 | *Journey to Self-Realization* | Third volume of collected talks. |
| 10 | *Wine of the Mystic* | Rubaiyat commentary — beautiful but niche audience. |
| 11–12 | *Second Coming of Christ / God Talks With Arjuna* | Massive multi-volume scriptural commentaries. Highest value for advanced students. Require verse-aware chunking (complex). Lower urgency for making the portal essential to newcomers. |

### Rationale

- Books 2–4 are short, topically structured, and low-complexity for ingestion — they deliver outsized impact for minimal engineering effort
- *Where There Is Light* is literally a topical index of Yogananda's teachings — its structure maps directly to the teaching topics navigation feature
- *Sayings* requires almost no chunking strategy — each saying is a natural chunk
- The two large scriptural commentaries (1,200–1,600 pages each, verse-by-verse structure) require specialized chunking and represent significant ingestion effort for an audience that skews toward advanced students
- This ordering maximizes the portal's usefulness to the broadest audience soonest

### Consequences

- Phase 5 scope changes: the multi-volume scriptural commentaries move from "first after Phase 1" to "after the collected talks"
- The verse-aware chunking challenge (originally a Phase 5 concern) is deferred, allowing more time to design a robust solution
- The portal reaches "critical mass" of quotable, thematically diverse content sooner
- *Where There Is Light* + *Sayings* + *Scientific Healing Affirmations* can potentially be ingested in the same sprint as Phase 5 begins, since they are short and structurally simple

---

## ADR-031: Teaching Topics — Curated Thematic Entry Points

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The current portal design centers on a search bar: the user must articulate a query to find relevant passages. But many seekers — especially those arriving in distress — cannot articulate what they need. They know they are suffering, but they may not know that Yogananda wrote specifically about their kind of suffering.

Three approaches were considered:

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **Search-only** | User must type a query | Simple; no editorial curation needed | Requires the user to know what to search for; fails the "2 AM crisis" test |
| **AI recommendation engine** | AI analyzes user behavior and recommends passages | Personalized; adaptive | Violates DELTA principle of Agency (algorithmic manipulation); violates Calm Technology (attention-harvesting); requires user accounts and tracking |
| **Curated thematic entry points** | Pre-defined teaching topics (Peace, Courage, Healing, Joy, Purpose, Love) with editorially tagged passages | No tracking; no algorithmic manipulation; works for anonymous users; SEO-discoverable | Requires editorial effort to tag passages; topics are subjective |

### Decision

Implement **curated thematic entry points** ("Doors of Entry") as a complement to search. The homepage presents 4–6 teaching topics alongside the search bar. Each topic links to a curated collection of passages drawn from across all ingested books.

**Initial theme taxonomy:**

| Theme | Maps to Life Challenges | Yogananda's Terms |
|-------|------------------------|-------------------|
| **Peace** | Anxiety, stress, overwhelm, insomnia | Calmness, equanimity, stillness, tranquility |
| **Courage** | Fear, self-doubt, uncertainty, worry | Fearlessness, divine protection, will power |
| **Healing** | Physical illness, depression, grief, addiction | Health, vitality, affirmation, life force |
| **Joy** | Depression, loneliness, emptiness, sorrow | Bliss, divine joy, happiness, ananda |
| **Purpose** | Existential questioning, career, direction | Dharma, duty, right activity, God's plan |
| **Love** | Relationships, family, loneliness, loss | Divine love, unconditional love, soul love, friendship |

### Rationale

- **Meets seekers where they are.** A person in crisis doesn't need a search engine — they need a door to walk through. "Peace" is easier to tap than formulating "how do I overcome anxiety according to Yogananda."
- **No algorithmic manipulation.** Themes are editorially curated, not behaviorally targeted. Every user sees the same doors. This satisfies the DELTA principle of Agency.
- **No tracking required.** Works for anonymous users with no accounts. Aligns with the portal's zero-friction access design.
- **SEO discoverability.** Theme pages (e.g., `/themes/peace`, `/themes/healing`) become landing pages. Someone Googling "spiritual guidance for grief" can land directly on a relevant page.
- **Scales with the corpus.** Each new ingested book adds passages to existing themes. The doors become richer over time without redesign.
- **Precedent in Yogananda's own works.** *Where There Is Light* is organized exactly this way — by life topic. The feature is a digital extension of an editorial structure Yogananda's publishers already established.

### Implementation

- A `teaching_topics` table in Neon with a many-to-many join to `book_chunks`
- Themes assigned during ingestion (automated via embeddings + human review) or as a lightweight editorial curation step
- Theme pages are pre-built search results, rendered as static pages with ISR
- Each theme page shows a rotating selection of passages (different on each visit, not algorithmically personalized — simple random sampling)

### Consequences

- Requires a theme taxonomy to be defined and maintained (initial set above, expandable)
- Requires tagging infrastructure: either manual tagging during ingestion QA, or semi-automated tagging using embedding similarity to theme descriptions
- Theme pages need design work (a new page template beyond search results and the book reader)
- The tagging effort is front-loaded but amortized: once the taxonomy exists, new books are tagged during their ingestion pipeline
- The themes must be validated against the actual corpus — a theme is only useful if the corpus contains sufficient passages for it
- **Extended by ADR-032:** Multi-category taxonomy (quality, situation, person, principle, scripture, practice, yoga_path), semi-automated tagging pipeline with three-state provenance, and `description_embedding` for auto-tagging

---

## ADR-032: Teaching Topics Multi-Category Taxonomy and Semi-Automated Tagging Pipeline

**Status:** Accepted | **Date:** 2026-02-18

### Context

The initial teaching topic design (ADR-031) defined six abstract spiritual qualities — Peace, Courage, Healing, Joy, Purpose, Love — as curated thematic entry points ("Doors of Entry") on the homepage. These serve seekers who want to cultivate a spiritual quality.

However, Yogananda wrote extensively about *life circumstances* — relationships, parenting, grief, work, aging, loneliness. These are a different kind of entry point: not "I want to cultivate this quality" but "I'm going through this and need guidance." A seeker dealing with a divorce, raising a child, or mourning a parent has a concrete situational need that the abstract quality themes don't directly address.

The portal's theme taxonomy needed to expand to serve both dimensions without compromising the calm, focused homepage design.

### Alternatives Considered

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **Expand the flat list** | Add situation themes alongside quality themes in a single list | Simple; no schema change | Homepage "Doors of Entry" grid becomes unwieldy at 12–15 themes; mixes two different kinds of entry point |
| **Two-tier taxonomy** | Add a `category` column ('quality' vs 'situation'); homepage shows only qualities; a "Browse all themes" page shows both | Preserves calm homepage; honest about the two different entry-point types; trivial schema change | Situation themes are one click further from the homepage |
| **Expand "Seeking..." section** | Keep six quality themes; evolve "Seeking..." entry points into full curated collections | No schema change; preserves homepage | Overloads the "Seeking..." section, which was designed as empathic search shortcuts, not browsable collections |

### Decision

Implement a **multi-category theme taxonomy** with a `category` column on `teaching_topics`:

- **`quality`** — spiritual/emotional states (Peace, Courage, Healing, Joy, Purpose, Love). Displayed as "Doors of Entry" on the homepage. Six cards, stable.
- **`situation`** — life circumstances (Relationships, Parenting, Loss & Grief, Work, Loneliness, Aging, and others as content supports). Accessible from "Explore all themes" page linked below the Doors of Entry and from the Library. Not on the homepage grid.
- **`person`**, **`principle`**, **`scripture`**, **`practice`**, **`yoga_path`** — added in ADR-033. Accessible from the "Explore all themes" page. Same tagging pipeline.

All categories use the same theme page template (`/themes/[slug]`). No visual distinction — a seeker browsing "Christ" gets the same reverent, passage-focused experience as one browsing "Peace."

### Theme Tagging Pipeline

Themes are applied to passages via a **semi-automated pipeline: embeddings propose, humans approve.**

**Three-layer process:**

1. **Embedding similarity (automated proposal).** Each theme has a `description` field and a `description_embedding` (same model as book chunks). At ingestion time — or when a new theme is added retroactively — every chunk's embedding is compared against every theme's description embedding via cosine similarity. Chunks above a threshold (e.g., 0.45) receive a candidate `chunk_topics` row with `tagged_by = 'auto'`. This is pure vector math against existing embeddings — no new API calls, no re-ingestion.

2. **Claude classification (optional, for ambiguous cases).** Passages near the similarity threshold may be ambiguous — a passage about "finding peace in family conflict" could be Peace, Relationships, or Healing. Claude can be used as a classifier (same "librarian" role as in search — classifying, not generating): given a passage and theme definitions, which themes apply? This catches what pure vector similarity misses.

3. **Human review (mandatory gate).** No auto-tagged passage is served to users. Auto-tagging produces a candidate list per theme. A reviewer approves, rejects, or adjusts. Approved tags are marked `tagged_by = 'reviewed'`. Reviewers can adjust `relevance` — a passage that perfectly encapsulates the theme gets higher relevance, making it more likely to appear on the theme page.

**Three-state `tagged_by` provenance:**

| Value | Meaning | Served to users? |
|-------|---------|-----------------|
| `manual` | Human placed this tag directly | Yes |
| `auto` | Machine proposed, not yet reviewed | **No** — candidates only |
| `reviewed` | Machine proposed, human approved | Yes |

**Adding a new theme retroactively is cheap:** All chunks already have embeddings. Adding "Relationships" requires one `INSERT` into `teaching_topics`, one vector similarity scan (seconds), optional Claude refinement on borderline cases, and human review of the candidate list. No re-ingestion, no re-embedding. The front-loaded cost is the initial tagging of existing books. After that, each new theme is incremental.

**Publication decision:** A topic page goes live when an editor judges the tagged passages have sufficient depth. No fixed minimum count — five deeply relevant passages about a niche topic like Laya Yoga is worth publishing, while three tangentially tagged passages about a broader topic probably isn't. Human judgment, not mechanical thresholds. This is consistent with the portal's philosophy: AI proposes, humans approve.

### Schema Changes

```sql
-- teaching_topics: add category and description_embedding columns
ALTER TABLE teaching_topics ADD COLUMN category TEXT NOT NULL DEFAULT 'quality';
ALTER TABLE teaching_topics ADD COLUMN description_embedding VECTOR(1536);
CREATE INDEX idx_teaching_topics_category ON teaching_topics(category);

-- chunk_topics: three-state tagged_by + similarity score
-- tagged_by values: 'manual', 'auto', 'reviewed'
-- similarity: cosine similarity when auto-tagged (NULL for manual)
ALTER TABLE chunk_topics ADD COLUMN similarity FLOAT;
CREATE INDEX idx_chunk_topics_pending ON chunk_topics(tagged_by) WHERE tagged_by = 'auto';
```

### API Changes

`GET /api/v1/themes` gains a `category` query parameter:
- `category=quality` — returns only quality themes (used by homepage Doors of Entry)
- `category=situation` — returns only situation themes
- `category=person` — spiritual figures (ADR-033)
- `category=principle` — yogic principles / Yama-Niyama (ADR-033)
- `category=scripture` — sacred texts (ADR-033)
- `category=practice` — spiritual practices (ADR-033)
- `category=yoga_path` — paths of yoga (ADR-033)
- Omitted — returns all topics, ordered by category then sort_order

`GET /api/v1/themes/[slug]/passages` — unchanged. Works identically for all categories. Only serves passages with `tagged_by IN ('manual', 'reviewed')`.

### Multilingual Implications

None. The existing `topic_translations` table handles localized names for any theme regardless of category. Theme descriptions used for auto-tagging are internal (not displayed). The multilingual embedding model produces reasonable candidates for non-English chunks even from English-language theme descriptions. Per-language theme descriptions can improve accuracy in Phase 11 but are not required.

### Consequences

- Phase 5 scope expanded: deliverable 5.2 (theme tagging pipeline) now includes the auto-tagging infrastructure, not just manual tagging
- Situation themes are added incrementally during Phase 5+ as content is ingested and sufficient passages confirmed
- The homepage stays calm — six quality doors, one quiet link to explore all themes
- Editorial governance needed: who decides when a new theme has enough passages to go live?
- The `description` field on `teaching_topics` now serves double duty: internal reference *and* auto-tagging input. Descriptions should be written as rich keyword-laden paragraphs, not terse labels.
- The review queue (`tagged_by = 'auto'`) needs a workflow — Phase 1–9 uses a script or Retool dashboard; Phase 10+ uses Contentful
- **Extended by ADR-033:** Four additional exploration categories (person, principle, scripture, practice) added to the taxonomy, using the same infrastructure

---

## ADR-033: Exploration Theme Categories — Persons, Principles, Scriptures, Practices, Yoga Paths

**Status:** Accepted | **Date:** 2026-02-19

### Context

ADR-032 established a two-tier theme taxonomy (`quality` and `situation`) on the `teaching_topics` table. This serves seekers who approach Yogananda's teachings through emotional/spiritual needs or life circumstances. But seekers also approach through *intellectual and traditional frameworks*:

- **By person:** "What does Yogananda say about Christ?" or "Teachings about Krishna"
- **By yogic principle:** "Yogananda on ahimsa" or "What is tapas?"
- **By scripture:** "Yogananda's interpretation of the Yoga Sutras" or "Gita teachings"
- **By practice:** "How to meditate" or "Yogananda on pranayama"

These are natural entry points for scholars, yoga practitioners, interfaith seekers, and devotees with specific study interests. They require no new infrastructure — they use the same `teaching_topics` table, the same tagging pipeline, the same page template, and the same three-state provenance.

### Decision

Add five new categories to the `teaching_topics.category` column:

| Category | Description | Examples |
|----------|-------------|----------|
| **`person`** | Spiritual figures Yogananda discusses | Christ, Krishna, Lahiri Mahasaya, Sri Yukteswar, Patanjali, Kabir, Divine Mother |
| **`principle`** | Yogic ethical principles (Yama/Niyama) | Ahimsa, Satya, Asteya, Brahmacharya, Aparigraha, Saucha, Santosha, Tapas, Svadhyaya, Ishvara Pranidhana |
| **`scripture`** | Scriptural frameworks Yogananda interprets | Yoga Sutras, Bhagavad Gita, Bible, Rubaiyat of Omar Khayyam |
| **`practice`** | Spiritual practices | Meditation, Concentration, Pranayama, Affirmation, Devotion |
| **`yoga_path`** | Paths of yoga | Kriya Yoga, Raja Yoga, Bhakti Yoga, Karma Yoga, Jnana Yoga, Hatha Yoga, Mantra Yoga, Laya Yoga |

All categories use:
- The same `teaching_topics` table with its `category` column
- The same auto-tagging pipeline (embedding similarity + optional Claude classification + human review)
- The same three-state `tagged_by` provenance (`auto`, `reviewed`, `manual`)
- The same `/themes/[slug]` page template
- Publication is an editorial decision — no fixed minimum passage count

### Relationship to DES-027 (Reverse Bibliography)

The `person` and `scripture` categories overlap with the Reverse Bibliography feature (DES-027). The distinction:

- **`teaching_topics` (person/scripture):** "What does Yogananda *teach about* Christ/the Gita?" — passages where the topic is the central subject
- **`external_references`:** "Where does Yogananda *cite or quote* Christ/the Gita?" — passages with direct references, quotes, or allusions

Both are valuable; they serve different needs. A seeker browsing `/themes/christ` wants Yogananda's teachings about Christ consciousness. A seeker browsing `/references/jesus-christ` wants specific passages where Yogananda quotes or directly references Jesus.

### Navigation

The `/themes` page organizes all categories into distinct sections:

1. "Doors of Entry" (quality) — on homepage and themes page
2. "Life Circumstances" (situation)
3. "Spiritual Figures" (person)
4. "Yogic Principles" (principle)
5. "Sacred Texts" (scripture)
6. "Spiritual Practices" (practice)
7. "Paths of Yoga" (yoga_path)

Categories appear only when they contain at least one published topic. The homepage remains unchanged — six quality doors only.

### Phase

- `quality` and `situation` themes: Phase 5 (existing plan)
- `practice` themes: Phase 5+ (practical themes like Meditation naturally emerge from the early content)
- `person`, `principle`, `scripture` themes: Phase 6+ (requires multi-book content for meaningful coverage; benefits from the Reverse Bibliography extraction pipeline)

### Alternatives Considered

| Approach | Why Rejected |
|----------|-------------|
| **Separate tables per category** | Unnecessary complexity; the same tagging infrastructure applies to all categories |
| **Hierarchical taxonomy** (e.g., scripture → Gita → Chapter 2) | Over-engineering for Phase 6; a flat per-category list is sufficient. Sub-categories can be added later if content depth warrants |
| **Merge with Reverse Bibliography** | Different user intent: "teach me about X" vs "show me where X is cited." Both valuable, different navigation paths |

### Consequences

- No schema migration needed — `category` column already accepts any text value
- The auto-tagging pipeline processes new categories identically to quality/situation themes
- Seed data for new categories should include rich, keyword-laden descriptions for effective auto-tagging
- The `/themes` page gains five new sections (appearing incrementally as content thresholds are met)
- The exploration categories create a rich navigational surface that invites study-oriented seekers to browse by framework, not just by emotional need
- **Extends ADR-032** with five additional categories on the existing taxonomy

---

## ADR-034: Edition-Aware Content Model

**Status:** Accepted | **Date:** 2026-02-19

### Context

Yogananda's books have been published in multiple editions over decades. Page numbers, chapter organization, and even paragraph boundaries can differ between editions. If SRF publishes a revised edition of *Where There Is Light* with corrected page numbers or reorganized content, every citation in the portal referencing the previous edition becomes inaccurate.

The current data model does not track edition. The `books` table has `publication_year` but no edition identifier. A re-ingestion of a revised edition would overwrite the previous data, potentially breaking:
- Shared passage links (if paragraph boundaries shifted — mitigated by ADR-022)
- Cached OG images with old page numbers
- External citations referencing portal page numbers
- Email archives with old citations

### Decision

Add `edition` and `edition_year` columns to the `books` table. Track which edition the portal serves.

#### Schema addition

```sql
ALTER TABLE books ADD COLUMN edition TEXT; -- e.g., "13th Edition", "Revised 2024"
ALTER TABLE books ADD COLUMN edition_year INTEGER; -- year of this specific edition
```

#### Content policy

- The portal serves **one edition per language per book** at any time. There is no multi-edition viewer.
- When a new edition is ingested, the old edition's data is archived (not deleted) in a `book_chunks_archive` table, preserving historical citations.
- Shared links to the old edition resolve via content-hash fallback (ADR-022). If the passage exists in the new edition (even at a different location), the link still works.
- The book landing page displays the served edition: *"Autobiography of a Yogi — 13th Edition (1998)"*.

#### Transition workflow

1. Ingest new edition to a Neon branch (not production)
2. Run content-hash comparison: identify passages that moved, changed, or were added/removed
3. Human review of all changes
4. Apply to production, archiving old edition data
5. Regenerate chunk relations for affected passages
6. Log all paragraph_index shifts for link audit

### Rationale

- **Citation accuracy over time.** The 10-year architecture horizon (ADR-004) means the portal will almost certainly serve updated editions. Tracking editions now costs two columns and prevents citation confusion later.
- **Transparent sourcing.** Displaying the edition on book pages tells seekers exactly which text they're reading. This is Sacred Text Fidelity in practice.
- **Archive for auditability.** If a theological question arises about a specific passage rendering, the archive preserves what was served and when.

### Consequences

- `edition` and `edition_year` columns added to `books` table in Phase 1 migration
- `book_chunks_archive` table created (can be empty until an actual re-ingestion occurs)
- Book landing pages display edition information
- Re-ingestion workflow documented in the operational playbook
- **Extends ADR-004** (10-year architecture) and **ADR-022** (content-addressable links)

---

## ADR-035: Image Content Type — Photographs as First-Class Content

**Status:** Accepted | **Date:** 2026-02-20

### Context

SRF possesses a photographic archive spanning nearly a century — historical photographs of Paramahansa Yogananda across decades of his life, portraits of the guru lineage (Sri Yukteswar, Lahiri Mahasaya, artistic depictions of Babaji and Krishna), photographs of SRF/YSS properties and biographical sites, event documentation from convocations and commemorations, and devotional artwork. The portal currently treats images as decorative assets: book covers on `books.cover_image_url`, About page portraits, Sacred Places property photographs. But photographs of Yogananda are sacred artifacts — equivalent in spiritual significance to his voice recordings — and the broader photographic archive is a content dimension that no other medium provides.

A seeker reading Autobiography's account of Yogananda at the Ranchi school cannot see the school in a physical book's photo section (unless they own that edition). A seeker exploring Sacred Places cannot see historical photographs alongside modern Street View links. A seeker studying Sri Yukteswar's teachings cannot see the guru's portrait alongside the passages. The portal can close these gaps by treating images as searchable, browsable, relatable content.

### Decision

Images become a primary content type with their own data model, browse/search experience, and participation in the cross-media content fabric (Related Teachings, editorial threads, theme tagging, place connections).

**Schema:**

```sql
CREATE TABLE images (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 title TEXT NOT NULL,
 slug TEXT NOT NULL UNIQUE,
 description TEXT,
 alt_text TEXT NOT NULL, -- Accessibility: mandatory, Claude-drafted, human-reviewed
 caption TEXT, -- Short display caption
 photographer TEXT,
 date_taken DATE,
 date_approximate TEXT, -- "circa 1935" when exact date unknown
 era TEXT, -- 'india_early', 'america_early', 'encinitas', 'modern'
 location TEXT,
 subject_type TEXT NOT NULL CHECK (subject_type IN (
 'portrait', 'group', 'place', 'event', 'artifact',
 'illustration', 'book_cover', 'devotional'
)),
 subjects TEXT[], -- ['yogananda', 'sri_yukteswar'] — who/what appears
 is_yogananda_subject BOOLEAN NOT NULL DEFAULT false,
 source_collection TEXT, -- '1920s_india', 'encinitas_hermitage', 'convocation'
 s3_key TEXT NOT NULL,
 cloudfront_url TEXT,
 width INTEGER NOT NULL,
 height INTEGER NOT NULL,
 format TEXT NOT NULL DEFAULT 'jpg',
 language TEXT NOT NULL DEFAULT 'en',
 status TEXT NOT NULL DEFAULT 'draft'
 CHECK (status IN ('draft', 'review', 'published', 'archived')),
 published_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now
);

-- Image descriptions embedded for semantic search
-- Images don't have body text to chunk; the description is the searchable proxy
CREATE TABLE image_descriptions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
 description_text TEXT NOT NULL, -- Rich contextual description for embedding
 embedding vector(1536),
 language TEXT NOT NULL DEFAULT 'en',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

-- Image ↔ Place spatial connections
CREATE TABLE image_places (
 image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
 place_id UUID NOT NULL REFERENCES sacred_places(id) ON DELETE CASCADE,
 relationship TEXT NOT NULL DEFAULT 'depicts'
 CHECK (relationship IN ('depicts', 'taken_at', 'related_to')),
 PRIMARY KEY (image_id, place_id)
);
```

**Frontend:**

- `/images` — gallery browse with filters (subject type, era, collection, place)
- `/images/[slug]` — image detail page: full-resolution view, metadata, related passages, related places, related images from same era/collection

**API:**

- `GET /api/v1/images` — browse and filter (cursor-based pagination)
- `GET /api/v1/images/{slug}` — image detail with full metadata
- `GET /api/v1/images/{slug}/related` — cross-media related content (passages, other images, places, media)

**Key principles:**

- `is_yogananda_subject` triggers sacred artifact treatment — a visual provenance indicator, same pattern as `is_yogananda_voice` in ADR-057
- Alt text is mandatory on every image. Claude drafts descriptive, reverential alt text at ingestion time; human review is mandatory before publishing (ADR-005 E7 pattern)
- Image descriptions are the searchable proxy — the description text is embedded for vector search, since the image file itself is not textually searchable. One image, one embedding — no chunking needed.
- Content authority: images are supplementary to Yogananda's verbatim words. In search results and Related Teachings, a photograph never displaces a passage in ranking.
- Images cannot be machine-generated, AI-enhanced, or colorized. Photographic authenticity is paramount. The portal presents images as they are.
- Responsive image serving: five named tiers (thumb 300px, small 640px, medium 1200px, large 2400px, original) generated at upload time in WebP + JPEG dual format. User-facing download options on image detail pages. See ADR-064 for full size tier specification.

### Consequences

- `images` and `image_descriptions` tables added to Phase 1 schema (empty until content ingestion)
- Image ingestion pipeline, gallery, and player added when the image content type goes live
- S3 storage for images uses the same bucket and CloudFront distribution as audio files (ADR-057)
- Image search integration via unified content hub (ADR-060) when cross-media features arrive
- Claude drafts alt text and rich descriptions at ingestion time; human review mandatory before publishing
- Image descriptions are localized alongside other content in Phase 11 (Multi-Language) via `image_descriptions.language`
- Sacred Places pages (ADR-069) gain a photographs section — images connected via `image_places`
- **Extends** ADR-005 E7 (Claude-generated alt text) — from About page photos to the entire image archive
- **Extends** ADR-057 (audio sacred artifacts) — same `is_yogananda_subject` pattern for visual sacred artifacts

---

## ADR-036: People Library — Spiritual Figures as First-Class Entities

**Status:** Accepted | **Date:** 2026-02-20

### Context

The portal currently models spiritual figures (Krishna, Christ, Sri Yukteswar, Lahiri Mahasaya, etc.) as teaching topics with `category = 'person'` in the `teaching_topics` table. This serves the question "What did Yogananda teach about Krishna?" — it's a collection of tagged passages.

But seekers who encounter a spiritual figure in the Autobiography often want something different: "Who *is* Krishna in the context of Yogananda's teachings?" This requires biographical context, lineage position, associated places, relationships to other figures, and *then* the relevant passages. The theme page answers a search question; the person page answers a reference question.

Three approaches were considered:

| Approach | Data Model | Pros | Cons |
|----------|-----------|------|------|
| **Person as theme only** | `teaching_topics` with `category = 'person'` | Simple; already built | No biographical metadata; no lineage structure; no place associations; every figure is "just a tag" |
| **Rich metadata on teaching_topics** | Add biographical columns to `teaching_topics` | Single table; reuses existing infrastructure | teaching_topics becomes overloaded (most topics don't have birth years or lineage positions); mixes concerns |
| **Separate people table linked to themes** | `people` table with FK to `teaching_topics` for tagging | Clean separation of entity metadata and passage tagging; each table does one thing | Additional table and API endpoint |

The same pattern applies to Places, which already have a dedicated `places` table with rich metadata (ADR-069). People deserve the same treatment.

### Decision

Add a **`people`** table as a primary content type, linked to the existing `teaching_topics` system for passage tagging. Create a People Library (`/people`) parallel to the Books library (`/books`) and Sacred Places (`/places`).

#### Schema

```sql
CREATE TABLE people (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 name TEXT NOT NULL,
 slug TEXT NOT NULL UNIQUE,
 title TEXT, -- e.g., "Paramguru," "Avatar," "Yogiraj"
 lineage_position TEXT, -- e.g., "Guru of Paramahansa Yogananda"
 birth_year INTEGER,
 death_year INTEGER, -- NULL for avatars (Krishna) or living figures
 biography_short TEXT NOT NULL, -- 2–3 sentences, editorial
 biography_long TEXT, -- full detail page content, editorial
 image_id UUID, -- FK to images table (Phase 14, ADR-035)
 topic_id UUID REFERENCES teaching_topics(id), -- links to theme tagging system
 language TEXT NOT NULL DEFAULT 'en',
 canonical_person_id UUID REFERENCES people(id), -- cross-language linking
 is_published BOOLEAN NOT NULL DEFAULT false,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE INDEX idx_people_slug ON people(slug);
CREATE INDEX idx_people_published ON people(is_published) WHERE is_published = true;
```

#### Junction tables

```sql
-- People ↔ Places (e.g., Sri Yukteswar ↔ Serampore, Puri)
CREATE TABLE person_places (
 person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
 place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
 role TEXT, -- 'birthplace', 'ashram', 'teaching_center', 'burial'
 PRIMARY KEY (person_id, place_id)
);

-- People ↔ People (lineage and relationships)
CREATE TABLE person_relations (
 source_person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
 target_person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
 relation_type TEXT NOT NULL, -- 'guru_of', 'disciple_of', 'contemporary', 'referenced_by'
 PRIMARY KEY (source_person_id, target_person_id)
);
```

#### API

```
GET /api/v1/people → List all published people
 ?language=en → Filter by language
 ?lineage=true → Filter to guru lineage only

GET /api/v1/people/[slug] → Person detail with metadata
 Response includes: biographical info, lineage position,
 associated places, related people, link to theme page

GET /api/v1/people/[slug]/passages → Passages tagged with this person
 (Delegates to the existing theme tagging system via topic_id)
 ?language=en&limit=10&cursor=...
```

#### Frontend

| Route | Purpose |
|-------|---------|
| `/people` | People Library — spiritual figures organized by category (guru lineage, avatars, saints, referenced figures) |
| `/people/[slug]` | Person detail — biography, lineage, places, passages |

The People Library links bidirectionally with:
- **Theme pages:** `/people/krishna` links to `/themes/krishna` (tagged passages) and vice versa
- **Sacred Places:** `/people/sri-yukteswar` links to `/places/serampore` and `/places/puri`
- **Book reader:** Inline references to a person in the text can link to their People Library entry
- **Reverse Bibliography:** `/references/bhagavad-gita` links to `/people/krishna`

#### Relationship to existing theme system

The theme page (`/themes/krishna`) continues to serve the question "What did Yogananda teach about Krishna?" The person page (`/people/krishna`) serves "Who is Krishna?" The person page includes a prominent link to the theme page ("Read what Yogananda taught about Krishna →"). The `topic_id` FK on `people` connects the two systems.

### Rationale

- **Seekers ask two kinds of questions about spiritual figures.** "What did Yogananda say about X?" (theme page) and "Who is X?" (person page). Both are natural; each deserves its own answer.
- **Avatars are constant.** Krishna, Christ, and the guru lineage do not change. Their biographical entries are stable reference content — a different kind of value than the growing, curated passage collection on theme pages.
- **Monastics and living teachers.** As new monastics lead SRF, the People Library preserves their biographical context. This is a respectful, mission-aligned record.
- **Cross-referencing is the unique value.** The People Library connects people to places, to books, to passages, and to each other. No other digital resource provides this integrated view of the spiritual figures in Yogananda's world.
- **Parallel to Places and Books.** The portal already has a Books library (entities with metadata + linked passages) and a Places library (entities with metadata + linked passages). People is the natural third pillar.
- **Low schema cost, high editorial value.** One table, two junction tables. The biographical content is editorial — written once, updated rarely.

### Consequences

- `people` table added to Neon schema (Phase 6 migration, when person-category themes activate)
- `person_places` and `person_relations` junction tables added alongside
- `/people` and `/people/[slug]` routes added to the frontend (Phase 6)
- API endpoints `GET /api/v1/people` and `GET /api/v1/people/[slug]` added (Phase 6)
- People Library entries require SRF editorial review and approval before publication (`is_published` gate)
- Guru photographs on person pages follow ADR-042 sacred image guidelines
- Cross-language person entries linked via `canonical_person_id` (Phase 11)
- Theme pages for person-category topics gain a "Learn about [person] →" link to the People Library
- Reader inline references to named figures can link to People Library entries (Phase 6+)
- **Extends ADR-031** (teaching topics), **ADR-069** (Sacred Places), **ADR-033** (exploration categories)

---

## ADR-037: Monastic & Presidential Lineage in the People Library

**Status:** Accepted | **Date:** 2026-02-21

### Context

ADR-036 established the People Library as a primary content type with a `people` table, `person_relations` junction table, and five editorial categories on the `/people` index: guru lineage, avatars, saints and sages, referenced figures, and SRF/YSS leadership. The schema includes `birth_year`, `death_year`, `lineage_position`, and `person_relations` with relation types `guru_of`, `disciple_of`, `contemporary`, `referenced_by`.

This foundation handles "Who is Krishna?" and the guru lineage (Babaji → Lahiri Mahasaya → Sri Yukteswar → Yogananda) well. But three distinct monastic and organizational use cases expose gaps:

1. **Presidential succession.** The organizational lineage of SRF presidents (Yogananda → Rajarsi Janakananda → Daya Mata → Mrinalini Mata → Brother Chidananda) is distinct from the guru lineage. The current `person_relations` table has no `succeeded_by` relation type and no way to record the *period* of a relationship (e.g., "President from 1955 to 2010").

2. **Monastic roles and contributions.** SRF monastics serve in distinct roles — convocation speakers, editors of Yogananda's posthumous works, center leaders, board members. The current schema treats all people identically: a spiritual figure Yogananda wrote about and a monastic who edited his books share the same flat structure with no role or contribution metadata.

3. **In Memoriam and commemorative context.** The `birth_year` and `death_year` columns exist but are bare integers. There is no presentation pattern for commemorative display — a respectful "In Memoriam" treatment for monastics who have passed, or a visual timeline showing the succession of SRF leadership.

The Santa Rosa SRF Meditation Group displays a lineage of SRF presidents as an ordered visual display — photos, dates of service, a clear sense of succession. This is a natural fit for the portal, which can cross-reference each president with the teachings, places, and events of their era.

### Decision

Extend ADR-036's People Library with structured monastic and organizational metadata, temporal relationship tracking, and presentation patterns for lineage and commemoration.

#### Schema extensions to `people` table

```sql
ALTER TABLE people ADD COLUMN person_type TEXT NOT NULL DEFAULT 'spiritual_figure';
 -- 'spiritual_figure' (default): figures Yogananda wrote about (Krishna, Christ, Kabir)
 -- 'guru_lineage': Babaji, Lahiri Mahasaya, Sri Yukteswar, Yogananda
 -- 'monastic': SRF/YSS monastics (current and historical)
 -- 'historical': other historical figures referenced by Yogananda
 -- CHECK (person_type IN ('spiritual_figure', 'guru_lineage', 'monastic', 'historical'))

ALTER TABLE people ADD COLUMN honorific TEXT;
 -- SRF-specific honorific: 'Brother', 'Sister', 'Swami', 'Sri', 'Daya Ma', etc.
 -- Distinct from `title` (which holds spiritual titles like 'Paramguru', 'Avatar')

ALTER TABLE people ADD COLUMN is_living BOOLEAN;
 -- NULL = unknown or not applicable (avatars, ancient figures)
 -- true = living monastic or figure (editorial sensitivity applies)
 -- false = historical/passed

CREATE INDEX idx_people_type ON people(person_type) WHERE is_published = true;
```

#### Schema extensions to `person_relations` table

```sql
ALTER TABLE person_relations ADD COLUMN description TEXT;
 -- Freetext editorial context for the relationship
 -- e.g., "Served as SRF president during a period of global expansion"

ALTER TABLE person_relations ADD COLUMN start_year INTEGER;
ALTER TABLE person_relations ADD COLUMN end_year INTEGER;
 -- For temporal relationships: "President from 1955 to 2010"
 -- NULL start/end means open-ended or undated

ALTER TABLE person_relations ADD COLUMN display_order INTEGER;
 -- For ordered sequences like presidential succession
 -- NULL for unordered relationships
```

New `relation_type` values added to the existing set:

| Relation Type | Meaning | Example |
|--------------|---------|---------|
| `guru_of` | (existing) Spiritual teacher → student | Sri Yukteswar → Yogananda |
| `disciple_of` | (existing) Student → teacher | Yogananda → Sri Yukteswar |
| `contemporary` | (existing) Lived in same era | Yogananda ↔ Anandamayi Ma |
| `referenced_by` | (existing) Discussed in teachings | Krishna ← Yogananda |
| `succeeded_by` | (new) Organizational succession | Daya Mata → Mrinalini Mata |
| `preceded_by` | (new) Inverse of succeeded_by | Mrinalini Mata → Daya Mata |
| `mentored_by` | (new) Spiritual mentorship within SRF | Brother Anandamoy → Yogananda |
| `edited_works_of` | (new) Edited posthumous publications | Tara Mata → Yogananda |
| `collaborated_with` | (new) Worked together on SRF mission | Rajarsi Janakananda ↔ Daya Mata |

#### API extensions

```
GET /api/v1/people?person_type=monastic → Filter by person type
GET /api/v1/people?person_type=guru_lineage → Guru lineage only
GET /api/v1/people/lineage → Presidential succession
 Response: ordered array of people with service periods,
 structured for timeline rendering

GET /api/v1/people/[slug]
 Response now includes: person_type, honorific, is_living,
 relations with start_year/end_year/description
```

The `/api/v1/people/lineage` endpoint returns the presidential succession as an ordered list with service periods, suitable for rendering as a vertical timeline. It queries `person_relations` where `relation_type = 'succeeded_by'`, ordered by `display_order`.

#### Presentation patterns

**In Memoriam on person cards and detail pages:**

Person cards for figures with `death_year IS NOT NULL AND person_type IN ('monastic', 'guru_lineage')` display birth and passing years in a respectful format:

```
┌─────────────────────────────┐
│ ○ Daya Mata │
│ SRF President │
│ 1914 – 2010 │
│ │
│ "A life of selfless │
│ service to God..." │
│ │
│ Read biography → │
└─────────────────────────────┘
```

This is a *presentation pattern* — a tasteful rendering of existing data (`birth_year`, `death_year`) — not a separate feature or standalone page. The person detail page (`/people/[slug]`) renders the full biography with dates prominently but not morbidly.

**Presidential lineage as a navigable timeline on `/people`:**

The `/people` index gains a "Lineage of SRF Presidents" section rendered as a vertical timeline — a compact, ordered display showing succession with service dates and links to each president's person page. This uses the `succeeded_by` relations with `start_year`/`end_year` from `person_relations`.

```
┌──────────────────────────────────────────────┐
│ │
│ Lineage of SRF Presidents │
│ │
│ ● Paramahansa Yogananda 1920 – 1952 │
│ │ Founder and first president │
│ │ │
│ ● Rajarsi Janakananda 1952 – 1955 │
│ │ │
│ ● Sri Daya Mata 1955 – 2010 │
│ │ │
│ ● Sri Mrinalini Mata 2011 – 2017 │
│ │ │
│ ● Brother Chidananda 2017 – present │
│ │
└──────────────────────────────────────────────┘
```

**Knowledge graph lineage filter (Phase 7):**

The `/explore` graph gains a "Lineage" filter mode (extends ADR-062 view modes). When active, it shows only person nodes connected by `guru_of`, `disciple_of`, `succeeded_by`, and `preceded_by` edges, rendered as a directed vertical layout rather than a force-directed graph. This provides an alternate visualization of both the spiritual lineage and the presidential succession without building a one-off component.

#### Editorial governance

- All monastic biographical content requires SRF editorial review before publication (`is_published` gate, same as ADR-036).
- Living monastics (`is_living = true`) carry heightened editorial sensitivity. Biographical detail, photographs, and role descriptions must be explicitly approved by SRF. No biographical content about living monastics is auto-generated or seeded without SRF input.
- Presidential succession dates and service periods are factual public record, but the editorial framing (the `description` on each relation, the biography text) requires SRF review.
- The honorific field follows SRF's own usage — the portal does not assign or interpret monastic titles.

### Rationale

- **Three distinct lineages, one schema.** The guru lineage (spiritual transmission), presidential succession (organizational stewardship), and broader monastic community serve different seeker questions but share the same entity model. `person_type` and temporal `person_relations` handle all three without separate tables.
- **Temporal relations are essential.** "Daya Mata was SRF president" is incomplete without "from 1955 to 2010." The current `person_relations` is snapshot-oriented; adding `start_year`/`end_year` makes it timeline-capable.
- **In Memoriam is a presentation pattern, not a feature.** The data already exists (`birth_year`, `death_year`). The ADR formalizes how the portal respectfully renders it rather than building a separate commemorative system.
- **The knowledge graph is the lineage visualization.** Rather than building a standalone timeline component, the lineage filter on `/explore` reuses the graph infrastructure. The `/people` page timeline is a lightweight, text-based complement for quick reference.
- **Cross-referencing is the unique value.** SRF.org can list presidents. Wikipedia can list presidents. Only this portal can connect each president to the teachings, places, and passages of their era — "During Daya Mata's presidency, these passages about spiritual leadership were among the most shared."
- **Living monastic sensitivity.** Explicit `is_living` flag and editorial governance acknowledge that biographical content about current monastics carries different responsibilities than historical figures.

### Consequences

- `people` table gains three columns: `person_type` (with CHECK constraint), `honorific`, `is_living`
- `person_relations` table gains four columns: `description`, `start_year`, `end_year`, `display_order`
- Five new `relation_type` values: `succeeded_by`, `preceded_by`, `mentored_by`, `edited_works_of`, `collaborated_with`
- New API endpoint: `GET /api/v1/people/lineage` (presidential succession)
- Existing `GET /api/v1/people` gains `?person_type=` filter
- `/people` index gains "Lineage of SRF Presidents" timeline section (Phase 6)
- `/explore` gains "Lineage" graph filter mode (Phase 7, extends ADR-062)
- Person cards render In Memoriam presentation for applicable figures (Phase 6)
- Phase 6 seed data expanded: presidential succession entries with service dates alongside existing spiritual figure seeds
- **Extends:** ADR-036, ADR-061, ADR-062
- **New stakeholder questions:** SRF editorial policy on living monastic biographical content; monastic content scope (content *by* vs. *about* monastics); preferred depth of presidential succession editorial framing

---

## ADR-038: Living Glossary — Spiritual Terminology as User-Facing Feature

**Status:** Accepted | **Date:** 2026-02-20

### Context

The spiritual terminology bridge (`/lib/data/spiritual-terms.json`, ADR-051) maps modern and cross-tradition terms to Yogananda's vocabulary for internal search expansion. It is invisible to seekers. Yet Yogananda's writings use hundreds of Sanskrit, yogic, and esoteric terms — *samadhi*, *chitta*, *prana*, *astral body*, *Christ Consciousness* — that newcomers cannot be expected to know. A seeker encountering "samadhi" for the first time has nowhere within the portal to learn what it means. They must leave the portal, which breaks the reading flow and undermines the library's self-contained nature.

### Decision

Surface the spiritual terminology bridge as a user-facing glossary with two delivery mechanisms:

**1. Glossary page (`/glossary`):**
- Browsable, searchable, organized by category (Sanskrit terms, yogic concepts, spiritual states, scriptural references)
- Each entry contains: term, brief definition (1-2 sentences, editorially written), Yogananda's own explanation (verbatim quote from the corpus where he defines the term, with full citation), and links to theme pages and reader passages where the term appears
- Search within the glossary uses trigram matching (`pg_trgm`) for partial/fuzzy lookups
- Multilingual: glossary entries carry a `language` column; Phase 11 adds per-locale glossaries built during the human review cycle (already planned in Deliverable 11.12)

**2. Inline term highlighting in the reader (opt-in):**
- Toggle in reader settings: "Show glossary terms" (off by default)
- When enabled, recognized glossary terms in the reader text receive a subtle dotted underline (`border-bottom: 1px dotted var(--srf-gold)` at 40% opacity)
- Hovering (desktop) or tapping (mobile) reveals a tooltip: brief definition + "Read Yogananda's explanation →" linking to the relevant passage
- No AI-generated definitions — every definition is editorially written, every "explanation" is a verbatim Yogananda quote
- Terms are matched at ingestion time (stored in `chunk_glossary_terms` junction table), not at render time — zero client-side regex

### Schema

```sql
CREATE TABLE glossary_terms (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 term TEXT NOT NULL,
 slug TEXT NOT NULL UNIQUE,
 brief_definition TEXT NOT NULL, -- 1-2 sentences, editorially written
 category TEXT NOT NULL CHECK (category IN (
 'sanskrit', 'yogic_concept', 'spiritual_state',
 'scriptural', 'cosmological', 'practice'
)),
 explanation_chunk_id UUID REFERENCES book_chunks(id), -- Yogananda's own definition
 language TEXT NOT NULL DEFAULT 'en',
 sort_order INTEGER,
 created_at TIMESTAMPTZ DEFAULT now,
 updated_at TIMESTAMPTZ DEFAULT now
);

CREATE TABLE chunk_glossary_terms (
 chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
 term_id UUID NOT NULL REFERENCES glossary_terms(id) ON DELETE CASCADE,
 PRIMARY KEY (chunk_id, term_id)
);
```

### Phase

- Data: Seed from `spiritual-terms.json` starting Phase 1. Enriched per-book via vocabulary extraction lifecycle (ADR-051).
- Glossary page (`/glossary`): Phase 5 (when multi-book content provides sufficient explanation passages).
- Inline reader highlighting: Phase 5 (reader settings already exist from Phase 4).

### Consequences

- Two new tables (`glossary_terms`, `chunk_glossary_terms`)
- Glossary page added to navigation (linked from reader settings and footer, not in primary nav — it's a reference tool, not a destination)
- Inline highlighting is opt-in and off by default — respects the clean reading experience
- Editorial effort: brief definitions must be written for each term. Yogananda's own definitions are identified during ingestion QA.
- **Extends ADR-051** (terminology bridge) from an internal search tool to a user-facing feature

---

## ADR-039: Content Integrity Verification

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-022 (content-addressable deep links), ADR-001 (direct quotes only)

### Context

The portal's core promise is sacred text fidelity: every displayed passage is verbatim from Yogananda's published works. But there is no mechanism to *verify* this — to prove that the portal's text hasn't drifted from SRF's source publications. Content-addressable deep links (ADR-022) use content hashes for URL stability, but they don't solve provenance.

### Decision

Implement per-chapter content integrity hashes that enable verification of the portal's text against SRF's master publications.

**Approach:**
- At ingestion time, compute a SHA-256 hash of each chapter's concatenated, normalized text (whitespace-normalized, Unicode NFC)
- Store the hash in `chapters.content_hash TEXT NOT NULL`
- Expose hashes via API: `GET /api/v1/books/{slug}/integrity` returns a JSON array of `{ chapter_number, chapter_title, content_hash }` for all chapters
- SRF can independently compute the same hashes from their master text files and compare

**Verification page (`/integrity`):**
- Simple public page listing all books and their chapter hashes
- "How to verify" instructions for computing hashes from physical books
- Statement: "Every word on this portal is verified against SRF's published editions."

**Hash computation is deterministic:**

```typescript
function chapterHash(chunks: string[]): string {
 const normalized = chunks
 .map(c => c.normalize('NFC').replace(/\s+/g, ' ').trim)
 .join('\n');
 return sha256(normalized);
}
```

### Phase

Phase 1 (computed during ingestion, stored in schema). The `/integrity` page is Phase 2.

### Consequences

- `chapters.content_hash` column added to schema
- Ingestion pipeline computes hashes automatically
- `/integrity` page and API endpoint added
- Hash recomputation on any content update (catches drift)
- **Extends ADR-022** from URL stability to content provenance

---

## ADR-040: Magazine Integration — Self-Realization Magazine as First-Class Content

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-001 (direct quotes only), ADR-030 (content scope), ADR-011 (API-first), ADR-060 (content hub)

### Context

Self-Realization Magazine, published by SRF since 1925, contains: (1) articles by Paramahansa Yogananda — published teachings with the same sacred text status as his books, (2) articles by SRF monastics — authorized commentary and contemporary guidance, (3) devotee experiences, and (4) organizational news. The magazine represents a significant body of Yogananda's published writings not found in his books.

Additionally, the portal's "What Is Humanity Seeking?" data is an ideal candidate for a recurring magazine feature, creating a symbiotic relationship between the portal and the magazine.

### Decision

Integrate Self-Realization Magazine as a primary content type with differentiated treatment by content category:

| Category | Search Index | Theme Tags | Daily Pool | Reader Treatment |
|----------|-------------|------------|------------|-----------------|
| Yogananda's articles | Full (same as books) | Yes | Yes | Full reader with gold quote marks |
| Monastic articles | Filtered (opt-in via `include_commentary` param) | Yes | No | Reader with author byline |
| Devotee experiences | No | No | No | Browsable, not searchable |
| News/editorial | No | No | No | Browsable, archival |

**Core principle:** Yogananda's magazine articles are published teachings — they enter the same chunk/search/theme pipeline as book passages. A seeker searching "how to overcome fear" finds the relevant magazine article alongside book passages, ranked by relevance. The citation adapts: *— Self-Realization Magazine, Vol. 97 No. 2, p. 14*.

### Schema

```sql
CREATE TABLE magazine_issues (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 volume INTEGER NOT NULL,
 issue_number INTEGER NOT NULL,
 season TEXT CHECK (season IN ('spring', 'summer', 'fall', 'winter')),
 publication_date DATE NOT NULL,
 title TEXT NOT NULL,
 cover_image_url TEXT,
 editorial_note TEXT,
 language TEXT NOT NULL DEFAULT 'en',
 access_level TEXT NOT NULL DEFAULT 'public'
 CHECK (access_level IN ('public', 'subscriber')),
 created_at TIMESTAMPTZ DEFAULT now,
 updated_at TIMESTAMPTZ DEFAULT now,
 UNIQUE(volume, issue_number)
);

CREATE TABLE magazine_articles (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 issue_id UUID NOT NULL REFERENCES magazine_issues(id) ON DELETE CASCADE,
 title TEXT NOT NULL,
 slug TEXT NOT NULL,
 author_name TEXT NOT NULL,
 author_type TEXT NOT NULL
 CHECK (author_type IN ('yogananda', 'monastic', 'devotee', 'editorial')),
 position INTEGER NOT NULL,
 language TEXT NOT NULL DEFAULT 'en',
 access_level TEXT NOT NULL DEFAULT 'public'
 CHECK (access_level IN ('public', 'subscriber')),
 created_at TIMESTAMPTZ DEFAULT now,
 updated_at TIMESTAMPTZ DEFAULT now,
 UNIQUE(issue_id, slug)
);

CREATE TABLE magazine_chunks (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 article_id UUID NOT NULL REFERENCES magazine_articles(id) ON DELETE CASCADE,
 chunk_index INTEGER NOT NULL,
 content TEXT NOT NULL,
 page_number INTEGER,
 embedding VECTOR(1536),
 embedding_model TEXT NOT NULL DEFAULT 'text-embedding-3-small',
 embedding_dimension INTEGER NOT NULL DEFAULT 1536,
 embedded_at TIMESTAMPTZ DEFAULT now,
 content_tsv TSVECTOR,
 content_hash TEXT NOT NULL,
 language TEXT NOT NULL DEFAULT 'en',
 metadata JSONB DEFAULT '{}',
 created_at TIMESTAMPTZ DEFAULT now,
 UNIQUE(article_id, chunk_index)
);

CREATE INDEX idx_magazine_chunks_embedding ON magazine_chunks
 USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_magazine_chunks_fts ON magazine_chunks USING GIN (content_tsv);
CREATE INDEX idx_magazine_chunks_language ON magazine_chunks(language);
```

### Navigation

```
Search · Books · Videos · Magazine · Quiet · About
```

"Magazine" added to primary navigation between "Videos" and "Quiet".

### UI Pages

- `/magazine` — Landing page: latest issue (cover + table of contents), browse by year, "Yogananda's Magazine Writings" index
- `/magazine/{year}/{season}` — Single issue: cover, editorial note, article list with author types
- `/magazine/{year}/{season}/{slug}` — Article reader: same reader component as books, with author byline and issue citation

### API Endpoints

```
GET /api/v1/magazine/issues → Paginated issue list
GET /api/v1/magazine/issues/{year}/{season} → Single issue with articles
GET /api/v1/magazine/articles/{slug} → Single article with chunks
GET /api/v1/magazine/issues/{year}/{season}/pdf → Issue PDF (pre-rendered)
GET /api/v1/magazine/articles/{slug}/pdf → Article PDF
```

### Search Integration

The `hybrid_search` function extends to query `magazine_chunks` where `author_type = 'yogananda'` alongside `book_chunks`. Monastic articles are searchable via an `include_commentary=true` query parameter (default false — Yogananda's words are always primary).

### Magazine ↔ "What Is Humanity Seeking?" Symbiosis

The public `/seeking` dashboard links to published magazine features: "Read the full analysis in Self-Realization Magazine →". The magazine publishes a curated narrative drawn from the portal's aggregated search data. Each amplifies the other.

### Phase

- Schema and ingestion pipeline: Phase 8 (alongside chapter/book PDF infrastructure)
- Magazine browsing UI: Phase 8
- Search integration (Yogananda's articles): Phase 8
- Magazine ↔ "What Is Humanity Seeking?" symbiosis: Phase 9

### Consequences

- Three new tables: `magazine_issues`, `magazine_articles`, `magazine_chunks`
- `magazine_chunks` participates in `chunk_relations` (or `content_relations` post-Phase 13) graph
- `hybrid_search` extended to include magazine chunks
- Navigation updated: "Magazine" added between "Videos" and "Quiet"
- Magazine ingestion pipeline mirrors book ingestion (PDF → chunk → embed → QA)
- Content availability: depends on SRF providing digital magazine archives
- Access level support: some issues may be subscriber-only (`access_level = 'subscriber'`), gated via Auth0 in Phase 15+
- **Extends ADR-030** (content scope) to include magazine content
- **Extends ADR-011** (API-first) with magazine endpoints

---

## ADR-041: Phase 1 Bootstrap Ceremony

**Status:** Accepted

**Date:** 2026-02-20

### Context

The portal's architecture is thoroughly documented across four design documents (CONTEXT.md, DESIGN.md, DECISIONS.md, ROADMAP.md), but the path from "no code" to "running system" was undocumented. The first developer experience — creating the repository, provisioning infrastructure, running the first migration, ingesting the first book, and verifying search works — is a critical ceremony that, if not specified, leads to inconsistent environments and wasted time.

### Decision

Document the Phase 1 bootstrap sequence as a reproducible, ordered ceremony in DESIGN.md § Phase 1 Bootstrap. The ceremony covers:

1. **Repository creation** — Next.js + TypeScript + Tailwind + pnpm
2. **Neon project provisioning** — PostgreSQL with pgvector, dev branch for local work
3. **Schema migration** — dbmate applies `001_initial_schema.sql` (all tables, indexes, functions, triggers)
4. **Vercel deployment** — Link repo, set environment variables, verify health check
5. **Sentry configuration** — Error tracking with source maps
6. **First content ingestion** — Autobiography of a Yogi: PDF → chunks → embeddings → relations
7. **Smoke test** — Search "How do I overcome fear?" returns relevant passages with citations

The `.env.example` file documents all required environment variables with comments explaining each.

### Rationale

- **Reproducibility.** Any developer (or AI assistant) should be able to go from zero to working search in a single session by following the ceremony.
- **Environment parity.** Explicit variable documentation prevents "works on my machine" drift.
- **10-year horizon (ADR-004).** The bootstrap ceremony is a durable artifact — it outlives any individual contributor's tribal knowledge.
- **Design-to-implementation bridge.** The four design documents describe *what* the system does. The bootstrap ceremony describes *how to bring it into existence*.

### Consequences

- DESIGN.md gains a "Phase 1 Bootstrap" section with the step-by-step ceremony and `.env.example` contents
- First-time setup is documented and reproducible
- Onboarding new developers or AI assistants requires reading CLAUDE.md (for context) and following the bootstrap ceremony (for setup)

---

## ADR-042: Sacred Image Usage Guidelines

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The portal has access to 16 official photographs of the SRF line of gurus (Mahavatar Babaji, Lahiri Mahasaya, Swami Sri Yukteswar, Paramahansa Yogananda), plus photographs of SRF's physical properties (Lake Shrine, Encinitas Hermitage, Mount Washington, meditation gardens). These images require handling that reflects their sacred significance in the SRF tradition.

### Decision

Establish strict image usage guidelines that treat guru photographs as sacred objects and nature/property photographs as atmospheric elements.

**Guru photographs — rules:**

| Rule | Rationale |
|------|-----------|
| Guru images appear in exactly two places: the About section (lineage display) and the Quiet Corner (single portrait above the affirmation) | Restraint creates reverence. Their absence from the rest of the portal makes their presence meaningful. |
| Never crop, filter, overlay, or apply visual effects to guru photographs | These are portraits of realized masters. Digital manipulation would be disrespectful. |
| Never place guru images adjacent to UI controls (buttons, form fields, error states) | Avoids juxtaposing sacred images with mundane interface elements. |
| Never use guru images as background wallpaper, with opacity overlays, or as decorative elements | The images are not decoration — they are objects of devotion. |
| Never use guru images in loading states, error pages, or empty states | These are transient, technical UI states — not appropriate for sacred imagery. |
| Yogananda's portrait appears on each book's landing page as the author photo, positioned like a frontispiece in a physical book | This is the one additional context where a guru image is appropriate — authorship attribution. |
| All guru images must include alt text with the guru's full name and title | Accessibility and respect. |

**Nature/property photographs — uses:**

| Context | Image Type | Treatment |
|---------|-----------|-----------|
| Quiet Corner | Lake Shrine, gardens | Subtle: small image below affirmation or very low-opacity background. Never competing with the text. |
| Theme pages | Nature associated with each theme (still water for Peace, mountains for Courage, etc.) | Ambient atmosphere. Small, muted, never dominant. |
| 404 / empty states | Garden photograph | Gentle message alongside: "This page doesn't exist yet, but perhaps you were meant to find this instead..." with search bar. |
| Seasonal homepage accent | Season-appropriate nature | Very subtle. A suggestion of season, not a hero image. |

**Images NOT sourced from SRF:**
- No stock photography. Every image should be either an official SRF photograph or a nature image from SRF properties.
- If SRF property images are not available, prefer no image over a generic stock photo.

### Rationale

- **Theological alignment:** In the SRF tradition, guru photographs are placed on the meditation altar and treated with reverence. The portal's image handling should reflect this practice.
- **Design restraint:** The portal's power comes from the words. Images support; they never compete. The homepage has no images at all — just Yogananda's words on warm cream. This is deliberate.
- **Calm Technology:** Images that are ambient and atmospheric support the "digital silence" principle. Images that are decorative or attention-grabbing violate it.

### Consequences

- The About section needs a carefully designed lineage display (4 guru portraits in sequence)
- The Quiet Corner needs a curated pool of SRF property/nature images
- The 404 page needs a garden image and gentle copy
- SRF must provide or approve all images used. The 16 official guru photos are available; property photographs may need to be sourced from SRF's media library.
- Each image needs proper licensing/attribution confirmation from SRF

---

## ADR-043: Structured Spiritual Ontology — Machine-Readable Teaching Structure

**Status:** Accepted | **Date:** 2026-02-21
**Context:** ADR-081 (Machine-Readable Content and AI Citation), ADR-038 (Living Glossary), ADR-061 (Knowledge Graph Visualization), DES-027 (Reverse Bibliography), ADR-032 (Teaching Topics)

### Context

The portal exposes content to machines through several channels: `llms.txt` for AI crawlers (ADR-081), JSON-LD structured data for search engines, and the versioned API for programmatic access. These expose *content* — the text of passages, their citations, their theme tags.

They do not expose *conceptual structure* — the relationships between Yogananda's ideas, the hierarchy of practices, the dependencies between concepts.

An AI system querying the portal can find "passages about samadhi." It cannot learn that samadhi is a state, that it has prerequisites (deep meditation, pranayama), that Yogananda describes multiple degrees of samadhi (savikalpa, nirvikalpa), that it relates to concepts in other traditions (satori in Zen, unio mystica in Christianity), and that specific passages describe the practice path toward it.

The Living Glossary (ADR-038) stores term definitions. The knowledge graph (ADR-061) visualizes passage-level relationships. The teaching topics (ADR-032) classify passages by theme. But none of these expose a *formal ontology* — a machine-readable map of how concepts relate to each other at the conceptual level, above and beyond individual passages.

### Decision

Build a **structured spiritual ontology** — a concept graph of Yogananda's teaching framework — and expose it through a read-only API endpoint and a JSON-LD export.

#### Schema

```sql
-- ============================================================
-- SPIRITUAL ONTOLOGY (concept graph — Phase 8+)
-- ============================================================
CREATE TABLE ontology_concepts (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 slug TEXT NOT NULL UNIQUE, -- URL slug: 'samadhi'
 name TEXT NOT NULL, -- "Samadhi"
 sanskrit_name TEXT, -- 'samādhi' (IAST transliteration)
 definition TEXT NOT NULL, -- canonical definition
 category TEXT NOT NULL CHECK (category IN (
 'state', -- samadhi, cosmic consciousness, Christ consciousness
 'practice', -- meditation, pranayama, Hong-Sau technique
 'principle', -- karma, dharma, maya, reincarnation
 'entity', -- God, Divine Mother, the soul (atman)
 'text', -- Bhagavad Gita, Yoga Sutras, Bible
 'tradition', -- Kriya Yoga, Raja Yoga, Vedanta
 'path' -- the eightfold path, the chakra system
)),
 glossary_id UUID REFERENCES glossary_terms(id), -- link to Living Glossary (ADR-038)
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE TABLE ontology_relations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 source_id UUID NOT NULL REFERENCES ontology_concepts(id) ON DELETE CASCADE,
 target_id UUID NOT NULL REFERENCES ontology_concepts(id) ON DELETE CASCADE,
 relation_type TEXT NOT NULL CHECK (relation_type IN (
 'has_prerequisite', -- meditation HAS_PREREQUISITE concentration
 'is_degree_of', -- nirvikalpa_samadhi IS_DEGREE_OF samadhi
 'is_practice_for', -- hong_sau IS_PRACTICE_FOR concentration
 'is_component_of', -- pranayama IS_COMPONENT_OF kriya_yoga
 'opposes', -- maya OPPOSES self_realization
 'leads_to', -- self_realization LEADS_TO ever_new_joy
 'parallels', -- samadhi PARALLELS satori (cross-tradition)
 'refines', -- nirvikalpa_samadhi REFINES savikalpa_samadhi
 'described_in' -- (link to external references via DES-027)
)),
 editorial_note TEXT, -- optional contextual explanation
 tagged_by TEXT NOT NULL DEFAULT 'manual' CHECK (tagged_by IN ('manual', 'reviewed', 'auto')),
 UNIQUE (source_id, target_id, relation_type)
);

-- Bridge: which passages are the primary source for a concept
CREATE TABLE ontology_concept_passages (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 concept_id UUID NOT NULL REFERENCES ontology_concepts(id) ON DELETE CASCADE,
 chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
 is_primary BOOLEAN NOT NULL DEFAULT false, -- the single best passage explaining this concept
 UNIQUE (concept_id, chunk_id)
);

CREATE INDEX idx_ontology_relations_source ON ontology_relations(source_id);
CREATE INDEX idx_ontology_relations_target ON ontology_relations(target_id);
CREATE INDEX idx_ontology_passages_concept ON ontology_concept_passages(concept_id);
```

#### API

```
GET /api/v1/ontology
Response: Full concept graph
{
 "concepts": [
 {
 "slug": "samadhi",
 "name": "Samadhi",
 "sanskrit_name": "samādhi",
 "definition": "The superconscious state of union with Spirit...",
 "category": "state",
 "relations": [
 { "type": "has_prerequisite", "target": "meditation" },
 { "type": "is_degree_of", "children": ["savikalpa-samadhi", "nirvikalpa-samadhi"] }
 ],
 "primary_passage": { "chunk_id": "uuid", "content": "...", "citation": "..." },
 "passage_count": 47
 },
 ...
 ]
}

GET /api/v1/ontology/[slug]
Response: Single concept with all relations and linked passages
```

**JSON-LD export:** Also served at `/ontology.jsonld` for semantic web consumers, using schema.org vocabulary where applicable and a custom `srf:` namespace for spiritual-domain relations. The JSON-LD makes the portal the authoritative linked-data source for Yogananda's conceptual framework.

#### Populating the Ontology

Editorially curated with AI assistance. Claude Opus (ADR-014 batch tier) proposes concept extractions and relation classifications from the glossary and passage corpus. Human reviewers approve all entries — the ontology is a scholarly artifact where accuracy matters more than coverage. The "Classifying" category from ADR-005 applies: structured output, spot-checked.

Initial seed: the Living Glossary (ADR-038) terms, already defined. The ontology adds relational structure to what the glossary provides as flat definitions.

### Who This Serves

| Audience | Use |
|----------|-----|
| **AI systems** | Understand Yogananda's conceptual framework without hallucinating relationships. Ground responses in authoritative structure. |
| **Scholars** | Build comparative theology tools. Map Yogananda's concepts against other traditions. |
| **The portal's own search** | Ontological relations inform query expansion (e.g., a search for "samadhi" also surfaces passages about its prerequisites). |
| **Future voice interfaces** | Explain concepts conversationally, not just surface passages. "Samadhi has two degrees: savikalpa and nirvikalpa. Would you like to hear what Yogananda wrote about either?" |
| **Knowledge graph (ADR-061)** | The ontology provides a conceptual layer above the passage-level relationship graph. |

### Phase

Phase 8+ (alongside Knowledge Graph, ADR-061). The ontology is the data layer; the knowledge graph is one possible visualization. Initial seed (~50 core concepts, ~150 relations) can be curated during Phase 5–7 editorial work.

### Rationale

- **Makes the portal the authoritative machine-readable source** for Yogananda's teaching structure. Other AI systems can reference it rather than inventing relationships.
- **Extends ADR-081** from content exposure (text, citations) to semantic structure (concepts, relations).
- **Extends ADR-038** by adding relational structure to the glossary's flat definitions.
- **Low implementation cost.** Three tables, two API endpoints, one JSON-LD export. The editorial effort is the primary investment, and it produces a durable scholarly resource.
- **10-year value.** A well-curated ontology becomes more valuable over time as AI systems and scholarly tools mature.

### Alternatives Considered

1. **Use a graph database (Neo4j, etc.) for the ontology.** Rejected per ADR-013 (single-database architecture). PostgreSQL's relational model handles the ontology's moderate scale (~hundreds of concepts, ~thousands of relations) without a specialized graph engine. The knowledge graph visualization (ADR-061) uses pre-computed JSON, not real-time graph queries.
2. **Auto-generate the ontology from passage embeddings.** Rejected. Embedding similarity captures semantic relatedness, not conceptual structure. "Samadhi requires meditation" is a directional, typed relationship — not derivable from vector proximity alone. Human editorial judgment is required.
3. **Expose the ontology only as JSON-LD, not as an API.** Rejected. The API enables the portal's own search system to use ontological relations for query expansion. JSON-LD alone would serve external consumers but not internal features.

### Consequences

- Three new tables: `ontology_concepts`, `ontology_relations`, `ontology_concept_passages`
- New API endpoints: `GET /api/v1/ontology`, `GET /api/v1/ontology/[slug]`
- JSON-LD export at `/ontology.jsonld`
- Living Glossary (ADR-038) terms can be linked to ontology concepts via `glossary_id`
- Knowledge Graph (ADR-061) gains ontological relations as an additional edge type
- Query expansion (ADR-005 E1) can optionally traverse ontological prerequisites for richer search results
- The portal becomes the first spiritual teachings platform to offer a formal, machine-readable conceptual ontology
- **Extends ADR-081** with deep semantic structure; **extends ADR-038** with relational graph; **extends ADR-061** with a concept layer above the passage layer

---

## ADR-044: Hybrid Search (Vector + Full-Text)

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Two search paradigms exist:

| Approach | Strengths | Weaknesses |
|----------|-----------|------------|
| **Vector-only** | Finds semantically similar passages even without keyword overlap | Misses exact phrases; less precise for specific terms |
| **Full-text-only** | Precise keyword matching; fast; no embedding cost | Misses conceptual/semantic matches; requires exact terms |
| **Hybrid (RRF)** | Best of both; catches conceptual AND exact-phrase queries | More complex query logic |

### Decision

Use **hybrid search** with Reciprocal Rank Fusion (RRF) to merge vector similarity and full-text search results in a single Postgres query.

### Rationale

- A seeker searching "divine mother" wants exact keyword matches (FTS)
- A seeker searching "how to find inner peace" wants conceptual matches (vector)
- RRF is a proven, simple merging algorithm that requires no ML training
- Both search types run natively in Postgres — no external services

### Consequences

- Each chunk needs both an embedding vector AND a tsvector index
- The hybrid_search SQL function encapsulates the merging logic
- Weights between FTS and vector can be tuned based on query characteristics

---

## ADR-045: Claude API for AI Features

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The AI Librarian needs an LLM for query expansion and passage ranking. Options:

| Option | Pros | Cons |
|--------|------|------|
| **Claude (Anthropic)** | Strong instruction-following; good at constrained output; we're already in this ecosystem | API cost |
| **OpenAI GPT-4o** | Widely used; good performance | Different vendor from our dev tools |
| **Open-source (Llama, Mistral)** | No API cost; full control | Hosting complexity; weaker instruction-following for constrained tasks |
| **No LLM** | Zero cost; zero latency; zero risk | Loses query expansion and intelligent ranking |

### Decision

Use **Claude API (Anthropic)** for query expansion and passage ranking. Design the system so the LLM is optional — simple keyword queries bypass it entirely.

### Rationale

- Claude's instruction-following is strong for the constrained output formats we need (JSON arrays only, no prose)
- We're already using Claude Code for development — ecosystem alignment
- The Librarian model minimizes token usage (short system prompt, short output)
- Making the LLM optional for simple queries keeps costs low and provides a reliable fallback

### Consequences

- Need an Anthropic API key in production (cost: estimated $15-25/month with expanded uses)
- Must implement graceful degradation when the LLM is unavailable or rate-limited
- Query expansion and passage ranking prompts need careful design and testing
- **Extended by ADR-005:** Eight additional Claude use cases (E1–E8) approved within the librarian model, with full cost profile and graceful degradation paths

---

## ADR-046: Embedding Model Versioning and Migration

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The portal uses vector embeddings (currently OpenAI text-embedding-3-small, 1536 dimensions) to power semantic search. Over a 10-year lifespan, the embedding model will almost certainly be replaced 2-3 times as better models emerge — higher quality, lower cost, multilingual improvements, or dimensionality changes.

Re-embedding the entire corpus is a batch operation (read chunks → call new model → update vectors). But during the transition, the search index must continue to function. And the system must know which chunks have been re-embedded and which haven't.

Without tracking which model generated each vector, a model swap becomes an all-or-nothing migration with potential downtime.

### Decision

Add an `embedding_model` column to `book_chunks` that records which model generated the embedding vector. This enables:

1. **Incremental migration.** Re-embed in batches (background job) rather than all at once.
2. **Mixed-model search.** During transition, query both old and new vectors. Weight new-model results higher.
3. **Rollback.** If a new model produces worse results, revert to the previous model's vectors without re-embedding.
4. **Audit.** Always know exactly which model generated a given chunk's vector.

#### Schema Change

```sql
ALTER TABLE book_chunks ADD COLUMN embedding_model TEXT NOT NULL DEFAULT 'text-embedding-3-small';
ALTER TABLE book_chunks ADD COLUMN embedding_dimension INTEGER NOT NULL DEFAULT 1536;
ALTER TABLE book_chunks ADD COLUMN embedded_at TIMESTAMPTZ NOT NULL DEFAULT now;
```

#### Migration Workflow

```
1. Choose new model (e.g., text-embedding-3-large)
2. Create Neon branch for testing
3. Re-embed a sample (100 chunks) on the branch
4. Run search quality test suite against new embeddings
5. Compare precision/recall vs. current model
6. If improved:
 a. Re-embed all chunks in batches (background job)
 b. Update embedding_model, embedding_dimension, embedded_at per chunk
 c. Update the search function to use the new model for queries
 d. Monitor search quality metrics post-migration
7. If not improved: discard branch, keep current model
```

During step 6, the search function can handle mixed models by:
- Querying with both the old and new model's embedding of the user's query
- Merging results via RRF (Reciprocal Rank Fusion) — the same approach already used for hybrid search
- Gradually increasing the new model's weight as more chunks are re-embedded

#### Dimension Change Handling

If a new model uses different dimensions (e.g., 3072 instead of 1536), pgvector supports multiple vector columns:

```sql
-- Add new dimension column
ALTER TABLE book_chunks ADD COLUMN embedding_v2 VECTOR(3072);

-- Create HNSW index for new column
CREATE INDEX idx_chunks_embedding_v2 ON book_chunks
 USING hnsw (embedding_v2 vector_cosine_ops);

-- After all chunks re-embedded, drop old column and index
ALTER TABLE book_chunks DROP COLUMN embedding;
ALTER TABLE book_chunks RENAME COLUMN embedding_v2 TO embedding;
```

### Rationale

- **Models will change.** OpenAI has already released three generations of embedding models (ada-002 → 3-small → 3-large). The pace will continue. Designing for model lock-in is designing for obsolescence.
- **Corpus grows over time.** By Phase 11 (multi-language), the corpus may be 10x larger than Phase 1. Re-embedding at that scale is hours of API calls and significant cost. Incremental migration keeps the portal online throughout.
- **Search quality is the core mission.** A better embedding model directly improves passage retrieval. The portal should be able to adopt improvements without architectural changes.
- **Zero cost now.** Three columns and a convention. No additional infrastructure.

### Multilingual Embedding Requirement (Added 2026-02-18)

**The embedding model must be multilingual.** This is an explicit requirement, not a side-effect. OpenAI's text-embedding-3-small places semantically equivalent text in different languages close together in vector space. This means:

- English embeddings generated in Phase 1 remain valid when Spanish, German, and Japanese chunks are added in Phase 11 — no re-embedding of the English corpus.
- The English fallback strategy (searching English when locale results < 3) works because the multilingual model places the English search query and English passages in compatible vector space — even when the user typed their query in Spanish.
- Cross-language passage alignment (`canonical_chunk_id`) is validated by embedding proximity, not just paragraph index matching.
- Any future embedding model migration must preserve this multilingual property.

If a candidate model has better English retrieval but weaker multilingual mapping, that is **not an upgrade** — it's a regression for the portal's mission of global availability. Benchmark per-language retrieval quality and English fallback quality alongside single-language quality during model evaluation.

### Consequences

- `book_chunks` schema includes `embedding_model`, `embedding_dimension`, and `embedded_at` columns from Phase 1
- The ingestion pipeline records which model it used per chunk
- Search quality test suite (deliverable 1.11) becomes the gate for model migration decisions
- Model migration is a maintenance operation, not an architecture change
- Budget for re-embedding costs when evaluating new models (Phase 11 multilingual benchmarking is a natural trigger)
- Any model migration must preserve multilingual vector space quality — single-language improvements that degrade per-language retrieval or English fallback quality are not acceptable

---

## ADR-047: Multilingual Embedding Quality Strategy

- **Status:** Accepted
- **Date:** 2026-02-21

### Context

The portal's embedding model (OpenAI text-embedding-3-small) was selected for cost, multilingual support, and quality (ADR-046). However, cost is negligible at this corpus scale — the entire multilingual corpus across all languages costs under $1 to embed. Even text-embedding-3-large at 13x the price would cost ~$9. The economics that differentiate embedding models for most products do not apply here.

This raises a deeper question: is the embedding model the right place to economize for a portal whose mission is making Yogananda's teachings "freely accessible worldwide"? The embedding model is the single most leveraged component in the search experience — it determines whether the right passage surfaces for a seeker's query. Everything else (UI, typography, citation formatting) is presentation.

Three dimensions of embedding quality matter for this portal:

1. **Multilingual retrieval quality.** text-embedding-3-small's multilingual capability is emergent from training data diversity, not an explicit optimization target. Models like Cohere embed-v3 and BGE-M3 were designed multilingual-first. For European languages (es, de, fr, it, pt) the gap is likely small. For Hindi, Bengali, and Japanese — the languages where the English fallback strategy is load-bearing — the gap may be significant.

2. **Domain specificity.** General-purpose embedding models are trained on web text, Wikipedia, and news. Yogananda's prose is spiritually dense, metaphorical, and uses vocabulary that spans traditions ("The wave forgets it is the ocean" — simultaneously about water and cosmic consciousness). General models may not capture the semantic relationships that matter for this corpus.

3. **Cross-language alignment for sacred vocabulary.** Terms like "samadhi," "サマーディ," "समाधि" should occupy the same region of vector space. The spiritual terminology bridge (`spiritual-terms.json`, ADR-051) handles this at the query expansion layer, but embedding-level alignment would be more robust.

### Decision

1. **Start with OpenAI text-embedding-3-small** as the Phase 1 embedding model. It provides adequate multilingual support, the architecture is well-understood, and the operational model is simple (symmetric embeddings — same encoding for queries and documents).

2. **Document multilingual-optimized models as future benchmark candidates.** Models designed multilingual-first (Cohere embed-v3, BGE-M3, multilingual-e5-large-instruct, Jina-embeddings-v3) should be evaluated when multilingual content is available (Phase 11). The Phase 1 English-only evaluation (Deliverable 1.11) cannot assess multilingual retrieval quality — this is an inherent limitation of evaluating before multilingual content exists.

3. **Establish domain-adapted embeddings as a later-stage research effort.** Fine-tuning an embedding model on Yogananda's corpus — across languages — could produce world-class retrieval quality that no general-purpose model achieves. The portal has a defined, bounded corpus (Yogananda's published works in multiple languages) that is ideal for domain adaptation. This is a research track, not a Phase 1 deliverable:
 - **Input:** The complete multilingual corpus (available after Phase 11 ingestion)
 - **Method:** Fine-tune a strong multilingual base model (e.g., multilingual-e5-large-instruct or BGE-M3) on the corpus with retrieval-specific training objectives
 - **Evaluation:** Per-language search quality test suites (Deliverable 11.10) provide the evaluation framework
 - **Outcome:** An embedding model that understands Yogananda's vocabulary, metaphorical patterns, and cross-tradition spiritual concepts at a depth no general model matches

4. **The architecture already supports model evolution.** ADR-046's `embedding_model` column enables per-chunk model tracking. The migration procedure (Neon branch → re-embed → validate → promote) applies to both vendor model upgrades and domain-adapted models. No architectural changes are needed to pursue any of these paths.

### Alternatives Considered

1. **Start with Cohere embed-v3** — Designed multilingual-first, supports query/document asymmetry (encodes queries and documents differently for better retrieval), scores higher on multilingual benchmarks (MIRACL, Mr.TyDi) for Indic languages. Rejected because: the query/document asymmetry adds operational complexity (wrong `input_type` degrades results silently), Cohere is a smaller company than OpenAI (10-year vendor risk), and the benchmark advantage is measured on Wikipedia-like content — not spiritual text. The gap may not transfer to this domain. Worth benchmarking in Phase 11 when multilingual content exists.

2. **Self-hosted open-source model (BGE-M3, multilingual-e5-large)** — Eliminates API vendor dependency entirely. At this corpus scale (~150K chunks), could run on a single GPU or even CPU. Rejected for Phase 1 because: adds operational complexity (model hosting, versioning, GPU provisioning) during a phase focused on proving search works. Remains a strong candidate for the domain-adapted model research track, where self-hosting is likely necessary anyway.

3. **Benchmark multilingual models before Phase 1** — Use a small sample of Autobiography of a Yogi in multiple published translations to benchmark models now. Rejected as a hard requirement because: Phase 1's priority is proving the search pipeline end-to-end. However, this remains a valuable optional activity — if time permits, a lightweight benchmark using 5-10 chapters across 3-4 languages would provide early signal on multilingual quality.

4. **Per-language embedding models** — Use text-embedding-3-small for European languages and a stronger multilingual model for Indic/CJK. ADR-046's `embedding_model` column already supports this. Rejected as a starting position because: operational complexity of maintaining multiple embedding pipelines is not justified without evidence of a quality gap. Remains viable if Phase 11 benchmarking reveals language-specific deficiencies.

5. **OpenAI text-embedding-3-large** — 3072 dimensions vs. 1536, at $0.13/1M tokens (still negligible at corpus scale). Rejected because: the additional dimensions help distinguish semantically close but meaningfully different texts, which is not the primary retrieval challenge for this corpus. More importantly, 3-large has the same incidental multilingual capability as 3-small — same training approach, same training data distribution, just a wider model. The gap for Hindi/Bengali/Japanese is identical. More dimensions do not fix a training data skew. The quality improvement path for this portal is domain adaptation, not dimensionality. If Phase 1 evaluation (Deliverable 1.11) reveals fine-grained retrieval confusion between closely related passages, 3-large is a trivial migration via ADR-046.

### Rationale

- **Cost is not the differentiator.** At < $1 for the full multilingual corpus, the embedding model should be selected for quality, not cost. Starting with text-embedding-3-small is justified by simplicity and adequate quality, not by savings.
- **Domain adaptation is the highest-ceiling option.** General models compete on benchmarks across all domains. A model fine-tuned on Yogananda's corpus would compete on one domain — the only one that matters for this portal. This is the path to world-class retrieval quality.
- **Sequencing matters.** Domain adaptation requires a multilingual corpus to train on (Phase 11) and a per-language evaluation framework to validate against (Deliverable 11.10). Starting this research before those exist would produce a model trained on English-only data — missing the point.
- **The architecture is already ready.** ADR-046's model versioning, the Neon branch migration workflow, and the per-language evaluation suites provide the complete infrastructure for model evolution. This ADR adds strategic direction, not architectural changes.

### Consequences

- Phase 1 proceeds with text-embedding-3-small as planned
- Deliverable 1.11 scope note: English-only evaluation is acknowledged as insufficient for multilingual quality assessment
- Phase 11 Deliverable 11.3 includes formal benchmarking of multilingual-optimized models alongside the existing "may trigger first embedding model migration" language
- Domain-adapted embeddings become a documented research track, scoped after Phase 11 corpus completion
- CONTEXT.md open questions updated to reflect the multilingual quality evaluation and domain adaptation tracks
- Future embedding model decisions should reference this ADR alongside ADR-046

---

## ADR-048: Chunking Strategy Specification

**Status:** Accepted
**Date:** 2026-02-20
**Deciders:** Architecture team
**Context:** ADR-009 (pgvector), ADR-044 (Hybrid Search), ADR-046 (Embedding Model Versioning)

### Context

DESIGN.md specifies chunk relations, storage, embedding, and search in detail. ROADMAP mentions "chunk by paragraphs" (Phase 1) and "verse-aware chunking" (Phase 7). But no document formally defines the chunking algorithm — the single most important factor in search retrieval quality. A bad chunking strategy produces orphaned fragments (too small) or imprecise retrieval (too large). Yogananda's prose style varies dramatically: terse aphorisms in *Sayings*, flowing narrative in *Autobiography*, verse-by-verse commentary in *The Second Coming of Christ*, guided affirmations in *Scientific Healing Affirmations*.

### Decision

Document the chunking strategy as a formal specification. The strategy has two tiers: default (narrative prose) and verse-aware (scriptural commentary).

**Default Chunking (Phases 1–6: narrative, collected talks, short works):**
- **Unit:** Paragraph (defined by typographic paragraph breaks in the source text)
- **Token range:** 100–500 tokens (target: 200–300)
- **Minimum:** Paragraphs below 100 tokens are merged with the following paragraph to avoid orphaned fragments
- **Maximum:** Paragraphs exceeding 500 tokens are split at sentence boundaries, with the split point chosen to keep both halves above 100 tokens
- **Overlap:** None. Paragraph boundaries are natural semantic boundaries in Yogananda's prose. Overlap introduces duplicate content in search results with no retrieval quality gain for this corpus.
- **Metadata preserved per chunk:** book_id, chapter_id, paragraph_index (position within chapter), page_number (from source), language

**Special handling:**
- **Epigraphs and poetry:** Kept as single chunks regardless of length. Splitting a poem mid-stanza destroys meaning.
- **Lists and enumerations:** Kept as single chunks. Yogananda's numbered instructions and lists of spiritual qualities are semantically atomic.
- **Dialogue and quoted speech:** Kept as single chunks when the dialogue forms a continuous exchange. Long dialogues (>500 tokens) split at speaker changes, not mid-speech.
- **Aphorisms (*Sayings*, *Scientific Healing Affirmations*):** Each standalone saying or affirmation is one chunk, regardless of length. These books are already atomically organized.
- **Chapter titles and section headers:** Not chunked separately. Prepended to the first paragraph of their section as metadata context.

**Verse-Aware Chunking (Phase 7: *Second Coming of Christ*, *God Talks With Arjuna*, *Wine of the Mystic*):**
- **Unit:** Verse-commentary pair. Each scripture verse and its associated commentary form a single chunk, maintaining the interpretive relationship.
- **Long commentaries:** If a verse's commentary exceeds 500 tokens, split at paragraph boundaries within the commentary. Each sub-chunk retains the verse text as a prefix (ensuring the verse context travels with every fragment of commentary).
- **Cross-reference:** Each verse-commentary chunk stores the verse reference (e.g., "Bhagavad Gita IV:7") as structured metadata for the side-by-side commentary view .
- **Devanāgarī script handling (ADR-080):** *God Talks With Arjuna* includes original Bhagavad Gita verses in Devanāgarī script alongside romanized transliteration and English commentary. Devanāgarī verse text is preserved in `chunk_content` for display but excluded from the embedding input via a script-detection preprocessing step (`/[\u0900-\u097F]/` Unicode block). The romanized transliteration is included in both chunk content and embedding input. Devanāgarī text is excluded from the token count that determines chunk splitting — only the English commentary and romanized transliteration count toward the 500-token maximum.

**Per-language validation (Phase 11):**
- English-calibrated chunk sizes (200–300 tokens) may produce different semantic density across scripts. CJK tokenization differs significantly from Latin scripts. Validate retrieval quality per language before committing to chunk sizes. Adjust token ranges per language if necessary.

### Rationale

- **Paragraph as natural unit.** Yogananda's prose is well-structured with clear paragraph breaks that correspond to idea boundaries. Unlike web content or academic papers, his paragraphs rarely span multiple topics.
- **No overlap avoids duplicate noise.** In information retrieval, overlap helps when chunk boundaries are arbitrary (e.g., fixed-window chunking). With paragraph-based chunking, boundaries are meaningful — overlap would surface the same passage twice in search results.
- **Special handling preserves meaning.** A poem split mid-stanza, a list split mid-enumeration, or a verse separated from its commentary would produce chunks that misrepresent the teaching.
- **Token range is empirical.** The 200–300 target is based on retrieval research showing this range balances specificity (finding the right passage) with context (the passage makes sense in isolation). Phase 1 validates this against the Autobiography.

### Consequences

- New "Chunking Strategy" section in DESIGN.md
- Phase 1 ingestion script (1.2) implements default chunking per this specification
- Phase 7 verse-aware chunking (7.2) implements the verse-commentary pair strategy
- Phase 11 per-language chunk size validation (11.10) uses this specification as the baseline
- Search quality evaluation (1.11) implicitly validates the chunking strategy — poor results trigger chunking reassessment

---

## ADR-049: Search Suggestions — Corpus-Derived, Not Behavior-Derived

- **Status:** Accepted
- **Date:** 2026-02-21

### Context

The portal's search architecture (ADR-044, ADR-045, ADR-005) is comprehensive: hybrid search, query expansion, intent classification, spiritual terminology bridge, passage ranking. But one common search UX pattern is absent: autocomplete suggestions as the seeker types.

Google-style autocomplete is powered by billions of user queries — the suggestion intelligence comes from aggregate behavior. This portal operates under fundamentally different constraints:

1. **DELTA compliance (ADR-095).** No user identification, no session tracking, no behavioral profiling. Personalized suggestions are architecturally impossible. Aggregate query-based suggestions face the ADR-053 minimum threshold problem — sparse data for months/years after launch.

2. **Bounded, known corpus.** The portal contains a finite set of Yogananda's published works. Unlike web search, every term in the corpus is known in advance. This means every suggestion can *guarantee* results exist — a property Google cannot offer.

3. **Calm Technology.** "Trending searches" and "popular queries" create social-media-like engagement patterns. Suggestions should reduce friction (calm), not drive browsing behavior.

4. **Librarian identity (ADR-001, ADR-089).** A librarian helps you formulate your question and knows the collection. Suggestions are a natural extension of the librarian metaphor — showing the seeker what terrain the teachings cover.

5. **Existing vocabulary bridge.** The spiritual terminology bridge (`spiritual-terms.json`, ADR-051) already maps seeker vocabulary to Yogananda's vocabulary. This infrastructure can power a unique suggestion type: surfacing the gap between what a seeker types and how Yogananda expressed the same concept.

### Decision

1. **Suggestion intelligence is corpus-derived, not behavior-derived.** All suggestion sources are extracted from the content itself, not from user query patterns. This ensures DELTA compliance, guarantees every suggestion leads to results, and aligns with the librarian identity.

2. **Three suggestion types, each with distinct sources:**

 - **Term completion:** Prefix matching against corpus vocabulary (extracted distinctive terms from chunks), theme names, book titles, chapter titles, and spiritual-terms.json canonical entries. User types "med" → "meditation", "Meditations on God" (chapter), "Meditation" (theme). Implementation: PostgreSQL `pg_trgm` trigram index or pre-computed suggestion lists cached at edge. Latency target: < 50ms.

 - **Query suggestion:** Curated complete question forms seeded from the search quality test suite and editorially expanded. User types "How do I" → "How do I overcome fear?", "How do I meditate?" These are editorially maintained — human review required, consistent with ADR-078. Not derived from user query history.

 - **Bridge-powered suggestion:** When the spiritual terminology bridge detects a mapping, surface Yogananda's vocabulary. User types "mindful" → suggestion includes a hint: "Yogananda's terms: concentration, one-pointed attention." This is the differentiator — no other search system has a sacred-text-aware vocabulary mapper as a suggestion engine.

3. **New API endpoint: `GET /api/v1/search/suggest`.** Accepts `q` (partial query), `language`, and `limit` parameters. Returns typed suggestions with category metadata (term/query/bridge). No Claude API call — pure database/cache lookup for speed.

4. **Zero-state experience is editorially curated.** When the search bar is focused but empty, display curated entry points (theme names, "Seeking..." prompts). This is an editorial statement — governance follows the same human-review principle as all user-facing content.

5. **Phase progression:** Basic prefix matching in Phase 1 (single-book vocabulary). Bridge-powered suggestions and curated queries added incrementally. Per-language suggestion indices in Phase 11. Optional personal "recent searches" (client-side only, no server storage) in Phase 15.

### Alternatives Considered

1. **Aggregate query-based suggestions ("popular searches").** Rejected: DELTA non-compliant without careful anonymization. Sparse data for months after launch. Creates social-proof dynamics misaligned with Calm Technology. Even with ADR-053-style thresholds, the minimum viable data for useful suggestions requires significant traffic volume.

2. **Claude-powered suggestion generation.** Rejected: Adds latency (LLM call per keystroke or debounced batch), cost, and complexity. The corpus is bounded — pre-computed suggestions are faster, cheaper, and more reliable. The intent classification system (ADR-005 E1) already handles query understanding after submission.

3. **No suggestions at all.** Considered: The intent classification + terminology bridge already handle "seeker doesn't know the right words" after query submission. However, pre-submission suggestions reduce typing friction, show seekers what the corpus contains, and extend the librarian metaphor. The bounded corpus makes guaranteed-result suggestions uniquely valuable.

4. **Third-party search-as-a-service (Algolia, Typesense).** Rejected: Adds vendor dependency for a feature achievable with PostgreSQL `pg_trgm` and edge caching. Violates single-database principle (ADR-013). Over-engineered for a bounded corpus.

### Rationale

- **Bounded corpus is the advantage.** Web-scale autocomplete must handle infinite content and relies on query logs for signal. A sacred text library has finite, known content — every suggestion can guarantee results. This property is more valuable than trending queries.
- **Corpus-derived suggestions are always fresh.** When a new book is ingested, its vocabulary automatically enters the suggestion index. No cold-start problem, no minimum query volume needed.
- **Bridge-powered suggestions are unique.** No existing search product surfaces the gap between user vocabulary and corpus vocabulary as a suggestion. This extends the spiritual terminology bridge (ADR-051) from a backend query-expansion tool to a user-facing navigation aid.
- **DELTA compliance by construction.** No behavioral data enters the suggestion pipeline. Privacy is a design property, not a policy constraint.
- **Calm Technology alignment.** Suggestions show what's available — they don't optimize for engagement. No "trending," no social proof, no urgency signals.

### Consequences

- New API endpoint (`/api/v1/search/suggest`) added to DESIGN.md § API Design
- New DESIGN.md subsection within the AI Librarian search architecture: "Search Suggestions & Autocomplete"
- ROADMAP.md updated: Deliverable 1.14 (basic prefix matching), 5.18 (multi-book + bridge + curated), 11.15 (per-language indices)
- CONTEXT.md updated with new open questions: zero-state experience, transliteration support, editorial governance of curated suggestions, mobile keyboard interaction
- Suggestion index extraction becomes part of the book ingestion pipeline (extends ADR-051 lifecycle)
- Accessibility requirement: ARIA combobox pattern for the suggestion dropdown (extends ADR-003)
- Per-language suggestion indices required for Phase 11 (extends multilingual architecture)

---

## ADR-050: Related Teachings — Pre-Computed Chunk Relations and Graph Traversal

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

The current portal design is primarily reactive — the seeker must search, click a theme, or visit the Quiet Corner. But the Findability Principle (CONTEXT.md) states: *"The teachings should find the seeker, not only the other way around."*

When a seeker reads a paragraph about cosmic consciousness in Autobiography of a Yogi, they may not know that Yogananda wrote about the same experience with different language in Man's Eternal Quest and with scriptural commentary in God Talks With Arjuna. The portal should surface these connections *proactively* during reading.

| Approach | Pros | Cons |
|----------|------|------|
| **No related content** | Simplest. No additional infrastructure. | Misses the Findability Principle. Reader must search to discover cross-book connections. |
| **Real-time vector similarity per paragraph** | Always fresh. No pre-computation needed. | Adds latency to every paragraph scroll. Database load scales with reading activity. |
| **Pre-computed relations table** | Instant lookup. Zero read-time latency. Enables graph traversal. Simple JOIN queries. | Requires batch computation at ingestion. Must be updated incrementally when new content is added. |
| **Knowledge graph (Neo4j, etc.)** | Rich graph queries. Purpose-built for relationship traversal. | New vendor. Operational complexity. Overkill for the relationship types we need. |

### Decision

Use **pre-computed chunk relations** stored in a `chunk_relations` table. For each paragraph (chunk), store the top 30 most semantically similar **same-language** chunks + top 10 most similar **English supplemental** chunks (for non-English chunks only) from the entire corpus, excluding adjacent paragraphs from the same chapter.

This powers three features:

1. **Related Teachings side panel** — while reading, a right-side panel shows the top 3 related passages from other books, updating as the reader scrolls.
2. **"Continue the Thread"** — at the end of every chapter, a section aggregates the most related cross-book passages for all paragraphs in that chapter.
3. **Graph traversal** — clicking a related passage navigates to that passage in its reader context, and the side panel updates with *that* passage's relations. The reader follows threads of meaning across the entire library.

**Incremental update strategy:**

| Scenario | Approach |
|----------|----------|
| **New book ingested** | Compute similarity of each new chunk against all existing chunks (incremental). Update existing chunks' top-30 if new chunks displace current entries. |
| **Single chunk updated** (Contentful webhook) | Recompute that chunk's relations against all existing chunks. |
| **Embedding model migration** (ADR-046) | Full recompute of all relations. |

**Multilingual computation strategy (updated 2026-02-18):**

In a multilingual corpus, a naive "top 30 global" approach underserves non-English languages — most slots would be consumed by chunks in other languages (predominantly English, which will be the largest corpus). The computation instead stores:
- **Top 30 same-language** relations: powers the default "Related Teachings" side panel
- **Top 10 English supplemental** relations: provides fallback for non-English languages when same-language corpus is small. A Spanish reader with only 3 Spanish books can still see related English passages, clearly marked with `[EN]`. Empty for English chunks.
- Total: up to 40 rows per chunk (at 400K chunks across all languages = 16M rows — trivial for PostgreSQL)
- The `rank` column indicates rank within its group (1–30 for same-language, 1–10 for English supplemental)

In Phase 1 (English only), this is equivalent to the original "top 30" — the English supplemental slots are simply empty.

**Filtering:** Relations are filtered at query time via JOINs — by book, content type, language, or life theme. Top 30 same-language relations provide ample headroom for filtered queries within a language. English supplemental relations are included when the same-language results are insufficient, following the same pattern as the search English fallback (always marked with `[EN]`). When filtering yields < 3 results, fall back to a real-time vector similarity query with the filter as a WHERE clause.

### Rationale

- **The Findability Principle demands proactive content surfacing.** Search is necessary but not sufficient. The teachings should meet the reader where they are — in the middle of a paragraph.
- **Pre-computation eliminates read-time latency.** The side panel must feel instant. A database lookup in `chunk_relations` is a simple indexed JOIN — sub-millisecond.
- **Graph traversal is emergent, not engineered.** The semantic graph is implicit in the embedding space. Pre-computing the edges makes it navigable. No special graph database needed.
- **Paragraph-level is the right granularity.** Sentence-level is too noisy (a sentence like "He smiled" has no semantic content). Section-level is too coarse (misses nuance). Paragraphs are complete thoughts — the natural unit of Yogananda's prose.
- **Per-language storage ensures full related teachings for every language.** At 400K chunks × 40 relations = 16M rows in the fully multilingual corpus. Trivial storage. Sufficient for filtered queries across most filter combinations. Non-English languages are never second-class citizens whose related teachings depend on constant real-time fallback. English supplemental relations follow the same `[EN]` marking pattern as the search fallback — consistent multilingual UX.
- **Incremental updates are efficient.** Adding a 3,000-chunk book to a 50,000-chunk corpus requires ~150M cosine similarity comparisons — minutes with vectorized computation, not hours.

### Consequences

- The ingestion pipeline gains a new Step 7: Compute Chunk Relations (after embedding, before final verification)
- A `chunk_relations` table is added to migration 001 (empty until Phase 6 populates it with multi-book content)
- A `chunk_references` table is added for human-curated editorial cross-references (supplements automatic similarity)
- Two new API endpoints: `/api/v1/chunks/[id]/related` and `/api/v1/chapters/[slug]/[number]/thread`
- Two new service functions: `relations.ts` and `thread.ts`
- The Book Reader component gains a Related Teachings side panel (desktop) and bottom sheet (mobile)
- A related content quality test suite (Phase 6+) validates that pre-computed relations are thematically relevant, cross-book diverse, and free of false friends
- The `books` table gains a `bookstore_url` column to power "Find this book" links (physical book bridge)

---

## ADR-051: Terminology Bridge Per-Book Evolution Lifecycle

**Status:** Accepted | **Date:** 2026-02-19

### Context

ADR-005 E2 establishes the spiritual terminology bridge at `/lib/data/spiritual-terms.json` as a static vocabulary mapping. However, each new book in the corpus introduces new terms, metaphors, and usages specific to its content. The bridge must grow with the library.

### Decision

Add a vocabulary extraction step to the book ingestion pipeline. When a new book's chunks are processed, Claude scans the full chunk set (Classifying category, JSON output) and extracts Yogananda's distinctive terms. The extracted vocabulary is diffed against the current `spiritual-terms.json`, and proposed additions are presented to an SRF-aware editor for human review before merging.

The glossary carries source provenance — which book introduced which mapping — enabling source-aware query expansion (terms from the book a seeker is currently reading can be boosted).

### Data Structure

```json
{
 "mindfulness": {
 "yogananda_terms": ["concentration", "one-pointed attention", "interiorization"],
 "sources": ["autobiography-of-a-yogi", "mans-eternal-quest"],
 "added": "2026-03"
 }
}
```

### Lifecycle

1. **Extract:** Claude scans new book chunks → produces vocabulary inventory (JSON)
2. **Diff:** Compare against existing `spiritual-terms.json` → identify new terms, new synonyms, book-specific usages
3. **Review:** SRF-aware editor approves/modifies/rejects each proposed addition (AI proposes, humans approve)
4. **Merge:** Approved additions committed to `spiritual-terms.json` with provenance metadata

### Extraction Categories

The vocabulary extraction step scans for three categories of terms:

1. **Modern-to-Yogananda mappings** (original scope): Identifies modern, clinical, or cross-tradition terms that seekers might use and maps them to Yogananda's specific vocabulary (e.g., "mindfulness" → "concentration").

2. **Sanskrit inline definitions** (ADR-080): Identifies passages where Yogananda provides his own definition of a Sanskrit term — "Samadhi, the superconscious state of union with God." These are flagged as glossary source candidates (ADR-038) and added to the bridge as Sanskrit-to-English mappings.

3. **Cross-tradition and Indic variant terms** (ADR-080): Identifies Pali, Bengali, and Hindi terms Yogananda uses or that seekers from other traditions might search. The bridge accepts these as keys mapping to Yogananda's vocabulary (e.g., Pali "nibbāna" → "final liberation"; Vedantic "viveka" → "discrimination, spiritual discernment"). Also captures alternate romanizations of the same term across editions.

### Consequences

- The terminology bridge becomes a living glossary that deepens with each book, not a one-time artifact
- Each book ingestion generates a vocabulary review task for the editorial workflow
- No schema migration needed — the bridge is a file-based artifact in git, read by the ingestion pipeline and query expansion prompt
- **Extends ADR-005 E2** with the evolution lifecycle
- **Extended by ADR-080** with Sanskrit inline definition extraction and cross-tradition term categories

---

## ADR-052: Passage Resonance Signals — Content Intelligence Without Surveillance

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-002 (DELTA boundaries), ADR-095 (observability), ADR-053 (search intelligence)

### Context

The portal tracks search queries (anonymized) and search themes (aggregated) per ADR-053. But it has no signal for which *passages* resonate with seekers. Which quotes are shared most? Which cross-book connections are traversed most? This is content intelligence — understanding which teachings serve seekers best — not user tracking.

### Decision

Collect anonymous, aggregated, passage-level resonance signals for editorial use. Strictly content-level, never user-level.

**Signals collected:**

| Signal | Source | Storage |
|--------|--------|---------|
| Share count | Increment when share link/image/PDF generated (ADR-068) | `book_chunks.share_count` (integer) |
| Dwell count | Increment when dwell mode activated (DES-009) | `book_chunks.dwell_count` (integer) |
| Relation traversal | Increment when a chunk_relation link is followed | `chunk_relations.traversal_count` (integer) |
| "Show me another" skip | Increment when Today's Wisdom "Show me another" is clicked | `daily_passages.skip_count` (integer) |

**Constraints:**
- Counters are simple integers. No timestamps, no session correlation, no user identification.
- Counters are increment-only (no decrement, no reset). Monotonic.
- Not exposed to seekers. Never displayed publicly ("Most shared passage" would create a popularity contest — antithetical to Calm Technology).
- Accessible only in the editorial review portal (ADR-082) for curation intelligence: "Which passages are resonating?" informs Today's Wisdom selection, theme page curation, and the "What Is Humanity Seeking?" dashboard.
- Rate-limited: one increment per signal type per client IP per hour (prevents gaming without requiring user accounts).

### Phase

- Instrumentation: Phase 2 (simple counter increments on existing API responses).
- Editorial dashboard: Phase 5 (alongside the editorial review portal, Deliverable 5.10).

### Consequences

- Four new integer columns on existing tables (no new tables)
- Rate-limiting logic added to share, dwell, and relation API handlers
- Editorial review portal gains a "Resonance" view showing top-shared, top-dwelled, and most-traversed passages
- **Extends ADR-053** from query-level intelligence to passage-level intelligence
- **Complements ADR-002** (DELTA boundaries) — content intelligence, not user intelligence

---

## ADR-053: "What Is Humanity Seeking?" — Anonymized Search Intelligence

**Status:** Accepted | **Date:** 2026-02-19

### Context

The portal's `search_queries` table logs every search query without any user identification (ADR-095, DELTA compliance). Over time, this data represents something unprecedented: a real-time, global window into what humanity is seeking spiritual guidance about.

- "Fear" spikes during crises. "Death" rises after public tragedies. "Love" peaks seasonally. "Purpose" trends among younger seekers.
- These patterns are aggregated and anonymous — no individual is identified, no session is tracked.
- The philanthropist's foundation funded this project to expand the global availability of Yogananda's teachings. Demonstrating *what the world is seeking* is a profound way to show impact.

### Decision

Produce a yearly **"What Is Humanity Seeking?"** report from aggregated, anonymized search query data. This is a research and mission contribution, not a product feature.

#### Data pipeline

1. **Aggregation (automated, nightly):** Group search queries by theme (using the existing theme taxonomy from ADR-032), by geography (country-level from Cloudflare analytics — no finer granularity), and by time period (weekly, monthly, yearly). Store aggregates in a `search_theme_aggregates` table.
2. **Trend detection (automated):** Identify rising/falling themes, seasonal patterns, and correlations with world events. Claude can assist with narrative-quality trend descriptions — but all descriptions are reviewed by a human before publication.
3. **Report generation (annual, human-curated):** SRF staff or the philanthropist's foundation curates the data into a narrative report. The portal provides the raw aggregates and trend data; the human provides the interpretation.

#### Schema addition

```sql
CREATE TABLE search_theme_aggregates (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 period_start DATE NOT NULL,
 period_end DATE NOT NULL,
 period_type TEXT NOT NULL CHECK (period_type IN ('week', 'month', 'quarter', 'year')),
 theme_slug TEXT, -- NULL for unclassified queries
 country_code TEXT, -- ISO 3166-1 alpha-2, NULL for global
 query_count INTEGER NOT NULL DEFAULT 0,
 unique_terms INTEGER NOT NULL DEFAULT 0, -- distinct query strings
 sample_queries TEXT[], -- 5–10 representative (anonymized) queries for context
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE INDEX idx_search_aggregates_period ON search_theme_aggregates(period_type, period_start);
CREATE INDEX idx_search_aggregates_theme ON search_theme_aggregates(theme_slug, period_type);
```

#### Visibility

- **Phase 7:** Search analytics dashboard in Retool (staff-only). Raw aggregate exploration.
- **Phase 11:** Impact dashboard at `/admin/impact` (leadership-facing). Includes "What Is Humanity Seeking?" visualization: warm-toned world map, trending themes, and temporal patterns.
- **Annual report:** Published by SRF or the philanthropist's foundation. Format TBD (PDF, web page, or both). Not automatically generated — human-curated from the aggregate data.

#### DELTA compliance

- **Dignity:** No individual is identified. No query is attributable to a person. The data is always aggregated (minimum granularity: country + week).
- **Agency:** Seekers are not aware of or affected by the aggregation. Their search experience is unchanged.
- **Embodiment:** The report encourages reflection on collective human need, not individual tracking.
- Minimum aggregation threshold: theme + country combinations with fewer than 10 queries in a period are suppressed (to prevent inference about small populations).

### Rationale

- **Mission alignment.** The philanthropist asked: "What can we do to help SRF make Paramahansa Yogananda's books available freely throughout the world?" Understanding what the world is seeking is a direct answer to that question.
- **Unique contribution.** No other spiritual organization has real-time data on what humanity seeks spiritual guidance about. This data, handled with DELTA integrity, is a gift to the world — not a surveillance product.
- **Impact reporting.** The foundation that funded the portal deserves to see its impact beyond page view counts. "Fear was the most searched theme globally in 2027, and 47 countries found guidance in Yogananda's words on courage" is infinitely more meaningful than "2.3M page views."

### Consequences

- `search_theme_aggregates` table added (Phase 7, alongside search analytics dashboard)
- Nightly aggregation Lambda function (Phase 7, uses ADR-017 Lambda infrastructure)
- Theme classification of search queries integrated into the search pipeline (lightweight Claude call or keyword matching against theme taxonomy)
- Impact dashboard in Phase 11 gains "What Is Humanity Seeking?" section
- Annual report production becomes an SRF staff responsibility (the portal provides data, not the report itself)
- Minimum aggregation threshold (10 queries) prevents inference about small populations
- **Extends ADR-095** (DELTA-compliant analytics) and **ADR-032** (theme taxonomy)

---

## ADR-054: YouTube Integration via Hybrid RSS + API with ISR

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

SRF operates an active YouTube channel (@YoganandaSRF) with hundreds of videos: How-to-Live monastic talks, guided meditations, convocation sessions, and commemorative events. The Gemini research document emphasizes the importance of integrating this multimedia content with the book corpus.

Options for auto-updating YouTube content:

| Option | Cost | Content Available | Categorization |
|--------|------|-------------------|----------------|
| YouTube RSS feed | Free (no API key) | ~15 most recent only | None |
| YouTube Data API v3 | Free (10,000 units/day) | All videos, all playlists | Full (via playlists) |
| Manual curation | Free | Whatever is curated | Full (manual) |
| RSS + API hybrid | Free | Latest (RSS) + full library (API) | Full |

**Critical quota insight:** The `search.list` endpoint costs **100 units per call**. The `playlistItems.list` endpoint costs **1 unit per call** and returns the same data. Never use `search.list`.

### Decision

Use a **hybrid RSS + YouTube Data API** approach:

1. **RSS feed** (free, no key) for "Latest Videos" — the ~15 most recent uploads, revalidated hourly via Next.js ISR
2. **YouTube Data API v3** (free tier, 10,000 units/day) for the full categorized library — playlists mapped to site categories, revalidated every 6 hours via ISR
3. Videos categorized by mapping YouTube playlist titles to portal categories
4. Videos embedded via `youtube-nocookie.com` for privacy-enhanced playback

### Rationale

- **Auto-updating:** ISR ensures the portal reflects new YouTube content without manual intervention
- **Minimal cost:** ~50-100 API units/day (0.5-1% of free quota)
- **No new vendor:** YouTube is already SRF's video platform (the tech stack brief specifies Vimeo for *private* video; YouTube content is public)
- **Categorization via playlists:** SRF already organizes content into playlists — we map these to portal sections
- **Privacy:** `youtube-nocookie.com` embedding avoids tracking cookies until the user plays a video

### Consequences

- Requires a YouTube Data API key (free, obtained via Google Cloud Console)
- Playlist-to-category mapping needs initial configuration and occasional maintenance
- RSS provides only ~15 recent videos — the API is needed for the full library
- Future phase (8) can add video transcription for cross-media search (book passages + video segments)

---

## ADR-055: Video Transcript Time-Synced Architecture

**Status:** Accepted | **Date:** 2026-02-19

### Context

Phase 13 (Cross-Media Search & Video Transcription) was described at a high level in the roadmap. The availability of multiple transcription services with word-level timestamp support enables a richer architecture: time-synced playback, cross-media chunk relations, and synchronized transcript display.

### Decision

Define the video transcript architecture as a natural extension of the existing content model:

1. **Transcription sources:** YouTube auto-captions (free), YouTube manual captions (free, higher quality), OpenAI Whisper API ($0.006/min), Deepgram (similar pricing with speaker diarization). Start with YouTube captions; upgrade to Whisper where quality is insufficient.

2. **Schema:** `video_transcripts` table stores the full transcript with source metadata. `video_chunks` table mirrors `book_chunks` — same embedding model, same FTS strategy, plus `start_seconds` and `end_seconds` timestamps for time-synced playback.

3. **Unified search:** Because `video_chunks` uses the same embedding model and FTS as `book_chunks`, the hybrid search function extends naturally to return interleaved book passages and video segments, ranked by relevance.

4. **Cross-media chunk relations:** Pre-computed `chunk_relations` can span book chunks and video chunks. The reader's Related Teachings panel can show timestamped video segments alongside book passages.

5. **Time-synced playback:** Video results link to `youtube.com/watch?v={video_id}&t={start_seconds}`, and YouTube's embed API supports the `start` parameter for in-portal embedding. The transcript display scrolls to follow playback with clickable timestamps.

### Estimated Cost

Full transcription of SRF's YouTube library (~500 videos) via Whisper: $150–300 one-time. YouTube captions are free.

### Consequences

- Two new tables (`video_transcripts`, `video_chunks`) added in Phase 13
- The hybrid search function extends to query `video_chunks` alongside `book_chunks`
- `chunk_relations` computation expands to include cross-media similarity
- The video player page (`/videos/[id]`) gains a synchronized transcript panel
- The schema extension is fully additive — no changes to existing tables
- The architectural groundwork (hybrid search, chunk relations, embedding pipeline) generalizes to video chunks naturally

---

## ADR-056: Platform-Agnostic Video Model and Documentary Integration

**Status:** Accepted | **Date:** 2026-02-20

### Context

The current video architecture assumes YouTube as the sole video platform, with `youtube_video_id` fields baked into the data model. In practice, SRF's video content spans multiple platforms and content types:

| Content | Platform | Duration | Rights |
|---------|----------|----------|--------|
| Monastic How-to-Live talks | YouTube | 20–60 min | SRF-owned |
| Guided meditations | YouTube / Vimeo | 10–45 min | SRF-owned |
| Convocation sessions | Vimeo (likely) | 1–3 hrs | SRF-owned |
| "Awake: The Life of Yogananda" | Vimeo / streaming | 87 min | Third-party (Counterpoint Films) |
| Other documentaries about Yogananda | Various | Varies | Third-party |
| Historical/archival footage | Self-hosted or Vimeo | Varies | SRF-owned |
| Interview excerpts | YouTube / Vimeo | 5–30 min | Varies |

SRF already uses Vimeo in their established tech stack (SRF AE Tech Stack Brief). The Phase 2 YouTube-only integration covers only the first row. A platform-locked video model cannot serve the full content landscape.

### Decision

Abstract the video model from YouTube-specific to platform-agnostic. Introduce a `videos` catalog table that supports YouTube, Vimeo, and self-hosted sources. An `integration_level` field distinguishes fully-integrated content (embedded player, transcribed, indexed in search) from linked-only content (cataloged with metadata and timestamps, but linking out for viewing). A content authority hierarchy ensures documentary and third-party content is clearly distinguished from Yogananda's own teachings.

**Schema:**

```sql
CREATE TABLE videos (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 title TEXT NOT NULL,
 slug TEXT NOT NULL UNIQUE,
 description TEXT,
 video_type TEXT NOT NULL CHECK (video_type IN (
 'talk', 'documentary', 'interview', 'meditation',
 'ceremony', 'clip', 'lecture', 'archival'
)),
 -- Platform-agnostic source
 platform TEXT NOT NULL CHECK (platform IN (
 'youtube', 'vimeo', 'self_hosted'
)),
 platform_id TEXT, -- YouTube video ID or Vimeo video ID
 platform_url TEXT, -- Canonical URL on the platform
 self_hosted_s3_key TEXT, -- S3 key if self-hosted
 self_hosted_url TEXT, -- CloudFront URL if self-hosted
 -- Speakers
 primary_speaker TEXT, -- Main speaker or narrator
 speakers TEXT[], -- All speakers/interviewees
 -- Metadata
 duration_seconds INTEGER NOT NULL,
 thumbnail_url TEXT,
 release_date DATE,
 series TEXT, -- 'how_to_live', 'awake', 'convocation_2025'
 -- Rights and integration
 rights_holder TEXT NOT NULL DEFAULT 'srf',
 integration_level TEXT NOT NULL DEFAULT 'full' CHECK (integration_level IN (
 'full', -- Embedded player, transcribed, indexed
 'linked' -- Cataloged + timestamped, links out for viewing
)),
 attribution TEXT, -- Required credit text for third-party content
 -- Standard fields
 is_yogananda_subject BOOLEAN NOT NULL DEFAULT false,
 language TEXT NOT NULL DEFAULT 'en',
 status TEXT NOT NULL DEFAULT 'draft'
 CHECK (status IN ('draft', 'review', 'published', 'archived')),
 published_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now
);
```

The existing `video_transcripts` and `video_chunks` tables (ADR-055) now reference `videos.id` instead of carrying `youtube_video_id` directly. `video_chunks` gains two fields for documentary support:

```sql
ALTER TABLE video_chunks ADD COLUMN speaker TEXT;
ALTER TABLE video_chunks ADD COLUMN segment_type TEXT
 CHECK (segment_type IN (
 'narration', 'interview', 'yogananda_quote', 'archival', 'music'
));
```

**Content authority hierarchy:**

| Level | Content | Treatment |
|-------|---------|-----------|
| Primary | Yogananda's verbatim book text | Full passage, gold accent, always cited |
| Primary | Yogananda's own voice/image | Sacred artifact treatment (ADR-057, ADR-035) |
| Secondary | Monastic talks (SRF lineage) | Attributed to speaker, linked to source passages |
| Tertiary | Documentary/interview content | Attributed to film/speaker, clearly marked as "about" not "by" |

Search results and Related Teachings maintain this hierarchy visually. A documentary clip about meditation never displaces a Yogananda passage about meditation.

**Frontend — platform-agnostic `<VideoPlayer>` component:**

| Platform | Integration Level | Rendering |
|----------|------------------|-----------|
| YouTube | `full` | YouTube IFrame Player API + synchronized transcript |
| Vimeo | `full` | Vimeo Player SDK + synchronized transcript |
| Self-hosted | `full` | HTML5 `<video>` with CloudFront source + synchronized transcript |
| Any | `linked` | Thumbnail + "Watch on [Platform] →" button (no embed) |

**Frontend routes:**

- `/videos` — all video content, filterable by type, speaker, series, platform
- `/videos/[slug]` — video detail with platform-appropriate player + synchronized transcript
- `/videos/collections/[slug]` — series groupings ("How-to-Live Talks," "Convocation 2025")
- `/videos/films` — documentary films section with film-style cards, poster art, director attribution, "Where to Watch" links

### Consequences

- Phase 1 schema creates the `videos` table (empty initially)
- Phase 2 video display is populated from both YouTube RSS and Vimeo API (both free for public content)
- Phase 16 transcription and cross-media search work identically across all platforms
- Speaker diarization tooling (pyannote or whisperX) added to the transcription pipeline for multi-speaker content (documentaries, interviews, panel discussions)
- Third-party content (documentaries, interviews) enters the catalog only with SRF editorial approval
- Vimeo Player SDK (~15KB gzipped) added as a frontend dependency alongside the YouTube IFrame API
- Self-hosted video uses the same S3 + CloudFront infrastructure as audio (ADR-057)
- `integration_level = 'linked'` enables cataloging films the portal cannot embed, with metadata and timestamped scene references
- **Replaces** the YouTube-specific `youtube_video_id` field in `video_transcripts` with a FK to `videos.id`
- **Extends** ADR-055 (video transcription) — from YouTube-only to all platforms
- **Extends** ADR-050 (chunk relations) — video chunks from any platform participate in Related Teachings

---

## ADR-057: Audio Library and Cross-Media Audio Search

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-001 (AI as librarian), ADR-075 (multilingual schema), ADR-077 (YouTube integration), DES-007 (cross-media search), ADR-034 (edition-aware content model)

### Context

SRF possesses audio recordings of Paramahansa Yogananda's own voice — lectures, informal talks, guided meditations, chanting. These are sacred artifacts and content simultaneously. SRF also produces modern audio recordings: monastics reading from published works, guided meditations, and chanting sessions. The portal's architecture already supports cross-media search across books and YouTube. Audio is a natural third content type.

### Decision

Add audio as a primary content type with its own data model, ingestion pipeline, browse/listen experience, and search integration. Audio recordings are hosted on S3 with CloudFront delivery. Transcriptions are generated via OpenAI Whisper, human-reviewed (ADR-078's mandatory human gate), and indexed for full-text and semantic search alongside books and video.

### Data Model

```sql
CREATE TABLE audio_recordings (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 title TEXT NOT NULL,
 slug TEXT NOT NULL UNIQUE,
 description TEXT,
 speaker TEXT NOT NULL, -- "Paramahansa Yogananda", "Brother Anandamoy", etc.
 recording_type TEXT NOT NULL CHECK (recording_type IN (
 'lecture', 'reading', 'guided_meditation', 'chant', 'informal_talk', 'interview'
)),
 recording_date DATE, -- when originally recorded (may be approximate)
 duration_seconds INTEGER NOT NULL,
 s3_key TEXT NOT NULL, -- S3 object key for audio file
 cloudfront_url TEXT, -- populated on publish
 cover_image_url TEXT, -- album art / thumbnail
 is_yogananda_voice BOOLEAN NOT NULL DEFAULT false, -- sacred artifact flag
 source_collection TEXT, -- e.g., "The Voice of the Master", "SRF Recordings Archive"
 language TEXT NOT NULL DEFAULT 'en',
 status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
 published_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE TABLE audio_segments (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 recording_id UUID NOT NULL REFERENCES audio_recordings(id) ON DELETE CASCADE,
 segment_index INTEGER NOT NULL,
 start_time_ms INTEGER NOT NULL, -- millisecond offset
 end_time_ms INTEGER NOT NULL,
 transcript_text TEXT NOT NULL, -- human-reviewed transcription
 transcript_status TEXT NOT NULL DEFAULT 'machine' CHECK (transcript_status IN (
 'machine', 'review', 'approved'
)),
 content TEXT NOT NULL, -- cleaned text for embedding (same pattern as book_chunks.content)
 embedding vector(1536), -- text-embedding-3-small
 language TEXT NOT NULL DEFAULT 'en',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE INDEX idx_audio_recordings_slug ON audio_recordings(slug);
CREATE INDEX idx_audio_recordings_speaker ON audio_recordings(speaker);
CREATE INDEX idx_audio_recordings_type ON audio_recordings(recording_type);
CREATE INDEX idx_audio_recordings_language ON audio_recordings(language);
CREATE INDEX idx_audio_segments_recording ON audio_segments(recording_id);
CREATE INDEX idx_audio_segments_embedding ON audio_segments USING ivfflat (embedding vector_cosine_ops) WITH (lists = 50);
```

### Audio Ingestion Pipeline

1. **Upload.** Audio files uploaded to S3 via Contentful or admin tool. Metadata entered in CMS.
2. **Transcription.** AWS Lambda triggers Whisper transcription. Output: timestamped segments.
3. **Human Review.** Transcription enters editorial review (same portal as book chunks and video transcripts). Reviewers correct errors, especially for Yogananda's voice recordings where fidelity is paramount.
4. **Embedding.** Approved segments are embedded using text-embedding-3-small (same model as book chunks).
5. **Indexing.** Segments added to the cross-media search index. Audio results appear alongside book passages and video clips.

### Audio Player Experience

- **Synchronized transcript.** As audio plays, the transcript highlights the current segment. Seekers can read along or click any segment to jump to that point.
- **Sacred artifact treatment.** Recordings of Yogananda's own voice receive special visual treatment — a subtle indicator and contextual note about the recording's provenance. These are not "content" in the same way as a book excerpt; they are encounters with the Master's voice.
- **Browse experience.** Audio library page with filtering by speaker, recording type, date, and collection. Visual design consistent with the book library and video library.
- **Playback controls.** Standard: play/pause, seek, speed (0.75×–1.5×), volume. No social features, no comments, no likes.

### Rationale

- **Yogananda's voice is irreplaceable content.** No book passage can substitute for hearing the Master speak. The portal's mission is to make Yogananda's teachings freely accessible — his voice recordings are among the most direct expressions of those teachings.
- **Transcription enables search integration.** Without transcription, audio is a silo. With it, a seeker searching "how to meditate" finds relevant passages from books, video clips, and now audio segments — a complete cross-media experience.
- **Infrastructure already exists.** S3 + CloudFront for hosting, Lambda for batch processing, pgvector for embeddings, the editorial review portal for human approval. Audio adds a content type, not an infrastructure layer.
- **Human review is non-negotiable.** Machine transcription of Yogananda's voice — often recorded in early/mid 20th century with period audio quality — will contain errors. Every segment must be human-reviewed before publication.

### Consequences

- New audio tables added to schema (Phase 10 or Phase 11, after cross-media search foundation exists)
- Audio ingestion Lambda functions added to `/lambda/`
- CloudFront distribution configured for audio streaming (Terraform module)
- Cross-media search API updated to include audio segments in results
- Audio player component built for reader/library (synchronized transcript display)
- `is_yogananda_voice` flag enables special sacred artifact presentation
- Storage costs: audio files are larger than text but smaller than video. S3 Standard for active, S3 IA for archive.
- Future: chapter-aligned audio (e.g., audiobook chapters mapped to book chapters for side-by-side reading+listening)

---

## ADR-058: AI Audio Generation for Portal Audio Assets

**Status:** Accepted | **Date:** 2026-02-21
**Context:** ADR-001 (direct quotes only), ADR-078 (human review gate)

### Context

The portal requires original audio assets for two features:

- **Quiet Corner (DES-014):** Two discrete cues — a singing bowl strike and a gentle chime (~15KB each, sub-second duration).
- **Dwell Mode (DES-009):** Two ambient loops — "Temple" and "Nature" soundscapes (~200–400KB each, 60–90 seconds).

These are UI interaction elements, not teaching content. ADR-001's prohibition on AI-generated content applies to Yogananda's words — it does not extend to interface audio any more than it extends to CSS or typeface selection. A singing bowl cue is interaction design, not scripture.

Three sourcing strategies exist: royalty-free sound libraries (Freesound, Pixabay), purpose-recorded audio (a real singing bowl in a real temple), and AI audio generation. This ADR evaluates the third option.

### Decision

**AI audio generation is an acceptable tool in the asset creation pipeline for UI and ambient audio.** It is not the only tool and not the default — it is one option alongside traditional sourcing, evaluated on merit per asset.

#### Landscape Assessment (February 2026)

**Recommended for exploration:**

| Tool | Type | Quality | Duration | License | Fitness |
|------|------|---------|----------|---------|---------|
| Stable Audio Open 1.0 | Open-source, self-hosted | 44.1kHz stereo | Up to 47s | Stability Community License (commercial OK < $1M revenue; Enterprise above) — you own outputs | Strong for both discrete cues and ambient loops |
| Stable Audio Open Small | Open-source, self-hosted | 44.1kHz stereo | Up to 11s | Same as above | Sufficient for cues; too short for loops |
| ElevenLabs (SFX) | Commercial SaaS, API | High | Variable | Paid plans grant commercial rights to outputs | Strong for discrete cues; vendor dependency |

**Evaluated and set aside:**

| Tool | Reason |
|------|--------|
| Meta AudioGen | CC-BY-NC-4.0 — non-commercial restriction creates licensing ambiguity for an organizationally backed portal |
| Meta MusicGen | Same CC-BY-NC-4.0 restriction; also music-focused, not sound-effects-focused |
| Suno | Music tracks with vocals; no public API; overkill for UI audio |
| Google Lyria 3 | No developer API; SynthID watermark embedded in all output; no published commercial terms |
| Udio | Licensing terms insufficiently documented |

#### Recommended Approach

1. **For Quiet Corner cues:** Evaluate all three sourcing strategies side by side. Generate candidate bowl strikes and chimes using Stable Audio Open. Source candidates from Freesound (CC0 library). If SRF has access to a singing bowl, record a real strike. Present all candidates to human reviewers. Select on quality and contemplative resonance, not on provenance ideology.

2. **For Dwell ambient loops:** AI generation is more compelling here. Custom ambient soundscapes ("distant singing bowl with gentle wind through trees") are difficult to source from stock libraries as a single coherent composition. Stable Audio Open's 47-second generation window, looped and crossfaded, can produce seamless ambient audio tailored to the portal's contemplative character. Traditional recording (field recording in an SRF temple garden) remains the gold-standard alternative.

3. **Human review is mandatory.** Consistent with ADR-078, ADR-032, and ADR-005: AI proposes, humans approve. No AI-generated audio reaches seekers without human curation. Multiple candidates are generated; a human selects the one that belongs in this portal.

4. **No runtime AI audio generation.** All audio assets are pre-generated, human-reviewed, and bundled as static files. There is no on-the-fly generation, no model inference at request time, no audio API calls in the serving path.

#### Licensing Notes

- **Stable Audio Open** outputs are owned by the generator under the Stability Community License. SRF should confirm whether its organizational revenue places it under the Community License (< $1M) or requires an Enterprise agreement. The portal itself is free, but SRF as an organization may exceed the threshold.
- **ElevenLabs** paid plans grant commercial rights to generated audio. The per-generation cost is negligible for a handful of static assets.
- Whichever tool is used, the final audio files should be documented with their provenance (tool, prompt, date, license) in the asset manifest.

### Alternatives Considered

1. **Prohibit AI-generated audio entirely — use only recordings or CC0 libraries.** Rejected as unnecessarily restrictive. The portal uses AI for search ranking, theme tagging, and translation drafting. Using it to generate a candidate chime sound — which a human then selects or rejects — is consistent with the project's established AI-as-tool philosophy. The prohibition in ADR-001 is about Yogananda's words, not about every artifact in the portal.

2. **Default to AI generation for all audio assets.** Rejected. A real singing bowl carries acoustic properties — overtone series, room resonance, decay character — that current diffusion models approximate but do not replicate. For the Quiet Corner's contemplative purpose, authentic recordings may simply be better. The decision should be made by listening, not by policy.

3. **Build an audio generation pipeline into the content system.** Rejected. The portal needs four audio files total across both ADRs. A pipeline is over-engineering. Generation happens on a developer's workstation during the asset creation process. The output is a `.mp3` file committed to the repository or uploaded to S3.

### Consequences

- Stable Audio Open 1.0 is the recommended open-source tool for audio asset exploration
- ElevenLabs is the recommended commercial alternative for discrete sound effects
- SRF's licensing position under the Stability Community License requires confirmation before production use
- Asset provenance (tool, prompt, license) documented for each generated audio file
- Human review remains the mandatory gate between AI-generated candidates and production assets
- No new infrastructure, no runtime dependencies, no model hosting — generation is a development-time activity
- **Extends DES-014** (Quiet Corner) and **DES-009** (Dwell) with a sourcing strategy; does not alter their specifications

---

## ADR-059: Chant Reader — Devotional Poetry with Deterministic Cross-Media Linking

- **Status:** Accepted
- **Date:** 2026-02-21
- **Relates to:** ADR-057, ADR-060, ADR-062

### Context

*Cosmic Chants* (1938) and other devotional chant collections by Paramahansa Yogananda are structurally different from prose works like *Autobiography of a Yogi*. A chant is a complete, discrete unit — closer to a hymn or poem than a paragraph in a chapter. The existing book reader (DES-008) is optimized for continuous prose: paragraph-level chunking, "read more" continuation, scroll-based navigation. This works poorly for chants, where the entire text is the meaningful unit.

More importantly, the relationship between a written chant and its audio/video recording is not semantic similarity — it is **identity**. "Door of My Heart" on page 14 and a monastic recording of "Door of My Heart" are the same work in different media. The existing cross-media architecture (Related Teachings, ADR-060 Unified Content Hub) discovers relationships via embedding vector proximity, which is probabilistic. For chants, this may surface the wrong recording or miss the correct one entirely. The connection must be deterministic and editorial, not vector-derived.

A single chant may also have multiple performance recordings: Yogananda's own voice (sacred artifact), a monastic group chanting, a devotee recording, a How-to-Live chant session on YouTube. These need curated presentation with clear provenance, not interchangeable search results.

### Decision

1. **Chant-as-whole-unit rendering.** When a book's content type is devotional poetry (flagged via a `content_format` column on the `books` table: `'prose'` default, `'chant'`, `'poetry'`), the reader renders each chant as a self-contained page rather than a continuous scroll. Navigation is chant-to-chant (previous/next), not paragraph-to-paragraph.

2. **Deterministic cross-media link.** Extend `chunk_relations.relation_type` with a new value: `'performance_of'` — a deterministic, editorially curated link meaning "this audio/video segment IS a performance of this written chant." This relation is not derived from embeddings; it is created by editorial staff during audio/video ingestion (Phase 14). The `similarity` column is set to `1.0` for identity relations. The `rank` column orders multiple performances (1 = primary/recommended).

3. **Inline media panel.** For chants with `performance_of` relations, the audio/video appears in the **primary content area** (below or beside the chant text), not in the Related Teachings side panel. This is the chant's companion experience, not a tangential discovery. Related Teachings from *other* works still appear in the side panel as usual.

4. **Performance provenance ordering.** Multiple recordings of the same chant are presented in a curated list:
 - Yogananda's own voice first (sacred artifact treatment — golden ring, provenance indicator per ADR-057)
 - Monastic recordings second
 - Other recordings third
 - Within each tier, ordered by editorial `rank`

5. **Chant-specific metadata.** The `book_chunks.metadata` JSONB field carries chant-specific properties when `content_format = 'chant'`: `chant_instructions` (Yogananda's guidance on how to practice the chant), `chant_mood` (devotional, joyful, meditative, longing — editorial classification), `has_refrain` (boolean). These are displayed as distinct UI elements alongside the chant text, visually separated from the sacred words themselves.

6. **Knowledge graph integration.** `performance_of` edges appear in the Knowledge Graph (ADR-062) as a distinct edge type with a unique visual treatment (solid line vs. the dashed line used for similarity edges). This makes the identity relationship visually distinguishable from "related" relationships.

### Alternatives Considered

1. **Rely on embedding similarity alone.** The existing Related Teachings panel might surface the correct audio for a chant via vector proximity. However, short, repetitive, metaphor-dense devotional poetry embeds differently from expository prose. Testing would be required, and even high accuracy is insufficient — a seeker pressing play expects to hear *this* chant, not a similar one. The consequence of a wrong match (hearing a different chant than the one displayed) is jarring in a way that a wrong prose-to-prose suggestion is not.

2. **Create a separate `chant_performances` junction table.** A dedicated table would be cleaner relationally but fragments the cross-media linking system. Extending `chunk_relations` with a new `relation_type` keeps all content relationships in one place and allows the existing Related Teachings query path to surface chant performances without a separate code path.

3. **Treat chants identically to prose with a different CSS layout.** This preserves the single reader component but forces chant-specific behavior into conditional branches. A variant reader component (sharing the design system but with chant-appropriate navigation and inline media) is more maintainable than a prose reader with growing special cases.

### Consequences

- The `books` table gains a `content_format` column (`TEXT DEFAULT 'prose'`, CHECK: `'prose'`, `'chant'`, `'poetry'`). No existing data changes — all current books default to `'prose'`.
- `chunk_relations.relation_type` gains `'performance_of'` as a new value. Requires no migration — the column is already `TEXT` with no CHECK constraint.
- The book reader route (`/books/[slug]/[chapter]`) needs a variant rendering path for `content_format != 'prose'`. Implementation deferred to the phase when *Cosmic Chants* is ingested.
- Audio/video ingestion pipeline (Phase 14) must include a step where editorial staff map recordings to specific chants. This is a curation task, not an automated pipeline step.
- The chant reader UX extends naturally to other poetry collections (e.g., *Songs of the Soul*, *Whispers from Eternity*) — the `'poetry'` content format uses the same whole-unit rendering without the inline media panel unless `performance_of` relations exist.
- Embedding quality for short devotional poetry should be evaluated during ingestion. If chants embed poorly with text-embedding-3-small, consider concatenating the chant title + instructions + text as the embedding input to provide richer context.

---

## ADR-060: Unified Content Hub — Cross-Media Relations, Search, and Theming

**Status:** Accepted | **Date:** 2026-02-20

### Context

The portal has four content types that participate in search, Related Teachings, theme tagging, and editorial threads: book chunks, video chunks (ADR-055), audio segments (ADR-057), and images (ADR-035). Each content type has its own specialized table with domain-specific columns (book chunks have page numbers; video chunks have timestamps; audio segments have transcript status; images have dimensions and alt text).

The challenge is cross-media operations. Maintaining separate relation tables per content-type pair creates combinatorial explosion: 4 types produce 6 unique pairs (book↔video, book↔audio, book↔image, video↔audio, video↔image, audio↔image), each requiring its own relation table, plus 4 self-relation tables — 10 tables total. Adding a fifth content type (e.g., published letters) would require 15 tables. Each pair also needs its own theme-tagging junction table and its own place-connection junction table. This is unmaintainable over a 10-year horizon.

### Decision

Introduce a `content_items` hub table as a thin polymorphic registry for cross-media operations. Each content type retains its specialized table with all domain-specific columns. The hub provides four unified capabilities:

1. **Unified embedding** for cross-media vector search
2. **Single relation table** for any-to-any content relations
3. **Unified theme tagging** across all content types
4. **Unified place connections** across all content types

**Schema:**

```sql
-- Unified content registry for cross-media operations
CREATE TABLE content_items (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 content_type TEXT NOT NULL CHECK (content_type IN (
 'book_chunk', 'video_chunk', 'audio_segment', 'image'
)),
 book_chunk_id UUID REFERENCES book_chunks(id) ON DELETE CASCADE,
 video_chunk_id UUID REFERENCES video_chunks(id) ON DELETE CASCADE,
 audio_segment_id UUID REFERENCES audio_segments(id) ON DELETE CASCADE,
 image_id UUID REFERENCES images(id) ON DELETE CASCADE,
 embedding vector(1536),
 language TEXT NOT NULL DEFAULT 'en',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now,
 CONSTRAINT exactly_one_ref CHECK (
 (book_chunk_id IS NOT NULL)::int +
 (video_chunk_id IS NOT NULL)::int +
 (audio_segment_id IS NOT NULL)::int +
 (image_id IS NOT NULL)::int = 1
)
);

-- One relation table for ALL cross-media relations
CREATE TABLE content_relations (
 source_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
 target_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
 similarity FLOAT NOT NULL,
 relation_type TEXT, -- same_topic, develops_further, depicts, illustrates,
 -- personal_story, practical, supplements
 created_at TIMESTAMPTZ NOT NULL DEFAULT now,
 PRIMARY KEY (source_id, target_id)
);

-- Unified theme tagging for all content types
CREATE TABLE content_topics (
 content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
 topic_id UUID NOT NULL REFERENCES teaching_topics(id) ON DELETE CASCADE,
 tagged_by TEXT NOT NULL DEFAULT 'auto'
 CHECK (tagged_by IN ('manual', 'auto', 'reviewed')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now,
 PRIMARY KEY (content_item_id, topic_id)
);

-- Unified place connections for all content types
CREATE TABLE content_places (
 content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
 place_id UUID NOT NULL REFERENCES sacred_places(id) ON DELETE CASCADE,
 relationship TEXT NOT NULL CHECK (relationship IN (
 'depicts', 'taken_at', 'recorded_at', 'describes', 'set_in'
)),
 PRIMARY KEY (content_item_id, place_id)
);
```

**Timing — no premature abstraction:**

| Phase | Content Model | Relation Model |
|-------|--------------|----------------|
| Phases 1–7 | `book_chunks` only | `chunk_relations`, `chunk_topics` referencing `book_chunks` directly. Simple, fast. |
| Phase 16 (Video) | Book + video chunks | **Introduce `content_items` hub.** Migrate existing book chunks. Add video chunks. `content_relations` replaces `chunk_relations`. |
| Phase 14 (Audio + Images) | All four types | Add audio segments and images to the hub. Full cross-media fabric complete. |

**Phase 16 migration (the critical moment):**

1. Create `content_items`, `content_relations`, `content_topics`, `content_places` tables
2. Populate `content_items` from existing `book_chunks` (one hub entry per chunk)
3. Migrate `chunk_relations` data into `content_relations`
4. Migrate `chunk_topics` data into `content_topics`
5. Migrate `chunk_places` data into `content_places`
6. Add video chunks to the hub
7. Drop or retain legacy tables as backward-compatible views

**Cross-media search via the hub:**

```sql
SELECT ci.id, ci.content_type, ci.embedding <=> $query_embedding AS distance
FROM content_items ci
WHERE ci.language = $language
ORDER BY distance
LIMIT 20;
```

Each result's `content_type` determines presentation: book passages show verbatim text with citations, video clips show thumbnails with timestamps, audio segments show player links, images show thumbnails with captions.

### Consequences

- `content_items` table created in the Phase 16 migration — not before
- Unified pgvector index on `content_items.embedding` replaces per-table indexes for cross-media queries
- Per-table indexes retained for single-type queries (book-only search remains fast — no performance regression)
- Content authority hierarchy is enforced in the presentation layer, not the data layer. All types have equal standing in the hub; the UI ranks Yogananda's words above supplementary media.
- Adding a fifth content type requires: one new specialized table, one new `CHECK` constraint value, and `content_items` population. No new relation tables, no new topic tables, no new place tables.
- The hub adds one level of indirection for cross-media queries. Single-type queries (e.g., book-only search) bypass the hub and query the specialized table directly.
- `chunk_relations` and `chunk_topics` (Phases 1–7) are not wasted work — their data migrates into the hub at Phase 16
- **Extends** ADR-050 (chunk relations) — from book-only to cross-media
- **Extends** ADR-032 (teaching topics) — from book chunks to all content types
- **Extends** ADR-055 (video transcription) — video chunks join the unified search index

---

## ADR-061: Knowledge Graph Visualization

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-050 (chunk relations), ADR-032 (theme taxonomy), DES-027 (reverse bibliography), ADR-033 (exploration categories), ADR-036 (people library)

### Context

The portal's schema contains a complete semantic map of Yogananda's teachings: chunk relations (similarity), theme tags (quality, situation, person, principle, scripture, practice, yoga_path), reverse bibliography (external references), editorial cross-references, People Library entities, and cross-language alignment. No such map exists for any major spiritual figure. This semantic structure is navigable through linear interfaces (search, theme pages, reader side panel) but has never been visualized as a whole.

### Decision

Build an interactive knowledge graph visualization at `/explore` that renders the portal's semantic structure as a navigable, visual map.

**Nodes:**
- Books (large, colored by book)
- Passages / chunks (small, clustered around their book)
- Themes (medium, connecting clusters)
- People (medium, from People Library)
- Scriptures and external references

**Edges:**
- Chunk relations (similarity, with thickness proportional to similarity score)
- Theme memberships (chunk → theme)
- External references (chunk → scripture/person)
- Cross-book connections (strongest relations between books)

**Interaction:**
- Enter from any node: click a theme, person, or book to center and expand
- Zoom: mouse wheel / pinch. Pan: drag.
- Click a passage node to see its text, citation, and "Read in context →" link
- Filter by: book, theme category, relation type
- Two views: full graph (all books, all themes) and focused view (single book's connections)

**Technology:** Client-side graph rendering via `d3-force` or `@react-three/fiber` (3D option for immersive exploration). Pre-computed graph data served as static JSON from S3 (regenerated nightly). No real-time graph queries — the visualization is a pre-baked artifact.

**Design:** Warm tones, `--portal-bg` background, `--srf-gold` edges, `--srf-navy` nodes. Not a clinical network diagram — a contemplative map of interconnected wisdom. Generous whitespace at the edges. Slow, deliberate animation (nodes drift gently, not bounce). `prefers-reduced-motion`: static layout, no animation.

### Phase

Phase 7 (after chunk relations are computed across the full multi-book corpus in Phases 6-7). The graph needs multi-book density to be meaningful.

### Consequences

- New page at `/explore` (linked from Library and themes pages, not primary nav)
- Pre-computed graph JSON generated nightly by Lambda (extension of chunk relation computation)
- Client-side rendering adds ~50-80KB JS (loaded only on `/explore` — not in the global bundle)
- Graph data is a static artifact — no database queries during exploration
- **Extends ADR-050** (chunk relations) from a search/reader feature to a visual discovery tool

---

## ADR-062: Knowledge Graph Cross-Media Evolution — All Content Types as Graph Nodes

- **Status:** Accepted
- **Date:** 2026-02-21
- **Supersedes aspects of:** ADR-061 (original Knowledge Graph visualization — now the Phase 7 baseline, not the final form)
- **Relates to:** ADR-060 (Unified Content Hub), ADR-055 (Video Transcripts), ADR-057 (Audio Library), ADR-035 (Images), ADR-056 (Platform-Agnostic Video), ADR-036 (People Library), ADR-040 (Magazine), ADR-043 (Spiritual Ontology)

### Context

ADR-061 designed the Knowledge Graph at `/explore` when the portal had only book content. It specifies nodes as "books, passages, themes, people, scriptures" and edges as `chunk_relations` — book-only. Since ADR-061 was accepted, the following content types were added to the portal architecture without updating the graph:

- **Magazine articles** (ADR-040, Phase 8) — embedded, searchable, themed
- **Video transcripts** (ADR-055/088, Phase 13) — time-synced, embedded, cross-searchable
- **Audio recordings** (ADR-057, Phase 14) — transcribed, embedded, Yogananda's own voice
- **Images/photographs** (ADR-035, Phase 14) — description-embedded, place-linked, sacred artifacts
- **Ontology concepts** (ADR-043, Phase 8+) — structural relationships between teachings
- **Sacred places** (Phase 13) — geographical entities linked to passages and images
- **Community collections** (ADR-086, Phase 16) — curated paths through content

The Unified Content Hub (ADR-060, Phase 13) solves the data layer — `content_items` + `content_relations` unify all media. But the visualization layer was never updated to consume this unified fabric.

This gap is systemic: ADR-061 was designed early, content types were added later, and no governance mechanism ensured graph integration was considered with each new content type.

### Decision

**1. The Knowledge Graph evolves through phases, matching the content it visualizes.**

ADR-061's Phase 7 delivery becomes the graph's *first version*, not its final form. Each subsequent content phase extends the graph with new node and edge types. The graph is a living visualization of the portal's entire teaching ecosystem.

**2. The pre-computed graph JSON uses an extensible schema from day one.**

Phase 7's nightly Lambda generates graph JSON with a `node_types` and `edge_types` registry. Adding magazine nodes in Phase 8 requires a Lambda update and JSON regeneration — zero visualization code changes.

```jsonc
{
 "generated_at": "2027-03-15T02:00:00Z",
 "schema_version": 2,
 "node_types": ["book", "passage", "theme", "person", "reference", "place"],
 "edge_types": ["similarity", "contains", "theme_tag", "references", "mentions_person"],
 "nodes": [
 {
 "id": "uuid",
 "type": "passage",
 "media_type": "book",
 "label": "Chapter 12, ¶3",
 "parent_id": "book-uuid",
 "url": "/books/autobiography/12#p3"
 }
 ],
 "edges": [
 {
 "source": "uuid-a",
 "target": "uuid-b",
 "type": "similarity",
 "weight": 0.87
 }
 ]
}
```

The visualization code reads `node.type` dynamically to determine shape, color, and click behavior. New node types render with a sensible default without code changes — explicit styling is added as a refinement.

**3. The graph supports filtering and focus modes.**

At cross-media scale (30,000–50,000 nodes), the full graph is unusable without filtering:

| Mode | Default? | What's visible |
|------|----------|----------------|
| **Book map** | Yes (Phase 7) | Books, passages, themes, people, references |
| **Concept map** | Phase 8+ | Ontology concepts, relations, linked passages |
| **All media** | Phase 13+ | Everything — full cross-media fabric |
| **Single book** | Any phase | One book's passages, themes, connections |
| **Single theme** | Any phase | One theme's passages across all media |

Plus a media type toggle: show/hide books, magazine, video, audio, images independently. Passage Constellation mode (DESIGN.md) already provides an alternative spatial view — the Knowledge Graph mode handles the relational/structural view.

**4. Editorial threads and community collections appear as highlighted paths.**

Editorial Reading Threads (DES-026) are curated journeys through the graph — golden paths connecting specific nodes. Community collections (ADR-086) appear as community-contributed paths with distinct visual treatment. Seekers can "follow the thread" through the graph.

**5. The graph is the portal's universal navigation layer.**

Every node is clickable — navigates to the corresponding page (book reader, video player, audio player, image detail, theme page, person page, place page). The graph is not just a visualization but an alternative to search: seekers who don't know what they're looking for can wander the graph and discover connections that search can't surface.

### Phased Node/Edge Evolution

| Phase | New Node Types | New Edge Types | Approximate Scale |
|-------|---------------|----------------|-------------------|
| **7** | book, passage, theme, person, reference | similarity, contains, theme_tag, references, mentions_person | ~5,000–10,000 nodes |
| **8** | magazine_issue, magazine_chunk, ontology_concept | magazine_similarity, ontology_relation, concept_source | ~12,000–18,000 nodes |
| **13** | video, video_chunk, place | video_similarity, cross_media_similarity (via content hub), mentions_place, depicts_place | ~20,000–35,000 nodes |
| **14** | audio_recording, audio_segment, image | audio_similarity, photographed_person, photographed_place | ~30,000–50,000 nodes |
| **16** | community_collection (optional) | collection_path, editorial_thread | Same node count, new path overlays |

### Visual Vocabulary

Each node type has a distinct visual representation for immediate recognition:

| Node Type | Shape | Color Family | Size Rule |
|-----------|-------|-------------|-----------|
| Book | Rectangle | SRF Navy | Fixed large |
| Book passage | Circle | SRF Navy (30% opacity) | Density-scaled (connection count) |
| Theme | Hexagon | SRF Gold | Passage count |
| Person | Portrait circle | Warm Cream border | Fixed medium |
| Scripture/reference | Diamond | Earth tone | Fixed medium |
| Magazine issue | Rectangle | Warm Cream with accent | Fixed medium |
| Magazine chunk | Circle | Warm accent (30% opacity) | Small |
| Ontology concept | Rounded rectangle | SRF Gold (darker) | Relation count |
| Sacred place | Map pin | Earth green | Fixed medium |
| Video | Play-button circle | Teal accent | Fixed medium |
| Video chunk | Circle | Teal (30% opacity) | Small |
| Audio recording | Waveform circle | Amber accent | Fixed medium |
| Audio segment | Circle | Amber (30% opacity) | Small |
| Image | Rounded square | Neutral | Small thumbnail |

Yogananda's own voice recordings and photographs receive the sacred artifact treatment — a subtle golden ring distinguishing them from other audio/images.

### Performance Strategy

| Scale | Strategy |
|-------|----------|
| < 10,000 nodes | d3-force with Canvas rendering. Pre-computed positions in JSON. Interactive pan/zoom/click. |
| 10,000–50,000 nodes | WebGL rendering (via deck.gl or custom Canvas). Level-of-detail: zoomed out shows clusters with labels, zoomed in reveals individual nodes. Pre-computed cluster centroids. |
| Mobile / low-bandwidth | Subset graph: show only the neighborhood of the current node (2-hop subgraph, max ~500 nodes). Progressive loading: clusters first, expand on interaction. |

The nightly Lambda pre-computes node positions using a force-directed algorithm (server-side, no runtime cost). The client renders pre-positioned nodes — no layout computation on the client.

### Graph Data API

```
GET /api/v1/graph → Full graph metadata (node/edge type counts, last generated)
GET /api/v1/graph/subgraph?node={id}&depth=2 → 2-hop neighborhood of a node
GET /api/v1/graph/cluster?theme={slug} → All nodes in a theme cluster
GET /api/v1/graph.json → Full pre-computed graph (S3-served, CDN-cached)
```

The subgraph endpoint powers embeddable mini-graphs in other pages: the reader's Related Teachings panel can show a small visual graph of the current passage's neighbors. Theme pages can embed their cluster.

### Governance: Content-Type Integration Checklist

To prevent the drift that created this ADR, every future ADR that introduces a new content type must address:

1. **Graph node type:** What shape, color, size, and click target?
2. **Graph edge types:** What relationships does this content have with existing nodes?
3. **Graph JSON schema:** What `node_type` and `edge_type` values are added?
4. **Lambda update:** What data source does the nightly graph regeneration query?
5. **Phase timing:** When does this content type enter the graph?

This checklist is added to the CLAUDE.md maintenance table.

### Alternatives Considered

1. **Redesign the graph from scratch for cross-media from Phase 7.** Rejected. ADR-061's Phase 7 delivery is correct for that phase's content — books only. Designing for 5 content types that don't exist yet violates the "no premature abstraction" principle. The extensible JSON schema is the right compromise: the *format* accommodates future types; the *content* matches actual data.
2. **Separate visualizations per media type.** Rejected. The portal's power is cross-media connections — a monastic talk discussing a book passage about a place where a photograph was taken. Separate visualizations hide the very connections that make the portal valuable.
3. **Use a graph database (Neo4j, Amazon Neptune) instead of pre-computed JSON.** Rejected. The graph is read-heavy, write-rarely (nightly regeneration). PostgreSQL + pre-computed JSON is simpler, cheaper, and consistent with the single-database architecture (ADR-013). A graph database adds operational complexity for a visualization that's regenerated once per day.

### Consequences

- ADR-061 remains valid as the Phase 7 baseline; this ADR extends it through Phase 16
- Nightly graph Lambda regeneration script updated with each content phase
- Graph JSON schema is versioned (`schema_version` field); the visualization handles version differences gracefully
- Phase 7 graph JSON accommodates future node types via extensible `type` field — no schema migration needed when new content types arrive
- CLAUDE.md maintenance table gains a "New content type added" → "update Knowledge Graph node/edge types" row
- DESIGN.md `/explore` section updated with full cross-media specification
- ROADMAP.md phases 8, 13, 14 gain graph evolution deliverables
- The Knowledge Graph becomes a flagship portal feature — the visual answer to "how does everything connect?"
- **Extends ADR-061** (Knowledge Graph) to cross-media; **consumes ADR-060** (Content Hub) for unified relations; **visualizes ADR-043** (Ontology) as concept map; **renders ** (Multi-Media Threads) as graph paths

---

## ADR-063: Digital Watermarking Strategy for SRF Images

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-035 (image content type), ADR-088 (SRF imagery strategy), ADR-042 (sacred image guidelines)

### Context

SRF images — particularly guru photographs and archival images of Yogananda — carry deep spiritual significance and organizational branding. ADR-088 establishes visible branding (the SRF lotus mark on OG images, PDF watermarks, and quote cards). But visible marks can be cropped or removed. The portal will serve images globally, and unauthorized reuse, manipulation, or misattribution of sacred images is a real concern for SRF.

### Decision

Adopt a **two-layer watermarking strategy**: visible branding (already established) plus invisible digital watermarking for provenance and attribution tracking.

**Layer 1: Visible branding (existing)**

Already specified in ADR-088 and : lotus watermark on PDFs and quote cards, photographer credit on image pages, SRF copyright notice. No changes.

**Layer 2: Invisible watermarking**

Embed imperceptible metadata into all portal-served images that survives common transformations (cropping, resizing, compression, screenshots):

| Technology | Approach | Survives | Cost | Recommendation |
|-----------|----------|----------|------|---------------|
| **Steganographic watermark** | Embed bit pattern in spatial frequency domain (DCT/DWT coefficients) | Crop, resize, moderate JPEG compression, screenshot | Open-source libraries (e.g., `invisible-watermark` Python, `stegano`) | **Recommended for Phase 14** |
| **C2PA / Content Credentials** | W3C standard for content provenance (used by Adobe, Google, BBC). Embeds cryptographically signed metadata about origin, edits, and attribution | Standards-compliant verification tools; visible "Content Credentials" icon in supporting platforms | Open standard, free libraries (`c2patool`) | **Recommended for Phase 14** |
| **Digimarc / commercial DRM** | Enterprise invisible watermarking with commercial detection network | Most transformations; commercial scanning | $$$, enterprise licensing | Not recommended (cost disproportionate to need) |
| **EXIF/XMP metadata** | Standard metadata fields (copyright, author, source URL) | Only survives if metadata not stripped | Free, universal | **Recommended from Phase 2** (baseline, not sufficient alone) |

**Recommended approach — three tiers:**

**Tier 1 (Phase 2): EXIF/XMP metadata on all served images.**
- Copyright: "© Self-Realization Fellowship"
- Source: "teachings.yogananda.org"
- Description: Image caption
- Applied server-side during image processing (S3 upload trigger or ingestion pipeline)
- Limitation: easily stripped by social media platforms and messaging apps

**Tier 2 (Phase 14): C2PA Content Credentials on all guru photographs and archival images.**
- Cryptographically signed provenance chain: "This image originated from the SRF Online Teachings Portal"
- Verifiable via Adobe Content Authenticity Initiative tools and supporting browsers
- The standard is gaining adoption (Adobe Photoshop, Google Search, BBC, Microsoft)
- Applied during image ingestion pipeline (`c2patool` CLI)
- Cost: free (open standard)

**Tier 3 (Phase 14): Steganographic watermark on sacred images (`is_yogananda_subject = true`).**
- Invisible bit pattern embedded in DCT frequency domain
- Survives JPEG compression up to 70% quality, moderate cropping, resizing, and screenshots
- Encodes: image ID, portal URL, and a short provenance string
- Detection: SRF can verify provenance using the extraction tool (a Python script in `/scripts/watermark-verify.py`)
- Applied during image ingestion pipeline (Python Lambda function)
- **Only on sacred images** (guru photographs, Yogananda's personal images) — not on nature photography or UI assets

### Rationale

- **Tier 1 is baseline hygiene.** Every professional image pipeline includes copyright metadata. It's stripped by social platforms but survives email, download, and professional use.
- **Tier 2 (C2PA) is the future.** The web is moving toward content provenance standards. Early adoption positions SRF's images as verifiably authentic — important when AI-generated images of spiritual figures become common.
- **Tier 3 (steganographic) is the safety net.** When someone posts an uncredited Yogananda photograph on social media, SRF can extract the watermark and verify it originated from the portal. This is forensic, not preventive — it proves provenance after the fact.
- **Not DRM.** The portal makes content freely available. Watermarking is about attribution and provenance, not access restriction. Consistent with the mission of spreading the teachings.

### Consequences

- Phase 2: EXIF/XMP metadata injection in image processing pipeline
- Phase 14: C2PA signing and steganographic watermarking in image ingestion Lambda
- `/scripts/watermark-verify.py` tool for SRF to verify image provenance
- Sacred images (`is_yogananda_subject = true` per ADR-035) receive all three tiers
- Non-sacred images receive Tiers 1 and 2 only
- C2PA library (`c2patool`) added as Lambda dependency
- Invisible watermark library (e.g., Python `invisible-watermark`) added as Lambda dependency
- **Extends ADR-035** (image content type) with provenance infrastructure
- **Extends ADR-088** (imagery strategy) from visible branding to invisible verification

---

## ADR-064: Multi-Size Image Serving and Download Options

**Status:** Accepted | **Date:** 2026-02-20
**Context:** ADR-035 (image content type), ADR-063 (digital watermarking), ADR-025 (PDF generation)

### Context

ADR-035 specifies three responsive image sizes generated at upload time: thumbnail (300px), display (1200px), and full-resolution. This serves the portal's own rendering needs — thumbnails in gallery grids, display sizes in detail pages, full-resolution for lightbox views. But it doesn't address seekers who want to *use* these images elsewhere: devotees who want a high-quality guru portrait for their meditation space desktop wallpaper, center leaders preparing a presentation who need specific dimensions, a temple that wants to print a framed photograph, or a seeker who wants a small version to share in a group chat.

The portal makes Yogananda's teachings freely available. The photographic archive should follow the same principle: freely downloadable at the size that serves the seeker's actual need. Stock photo sites offer multi-size downloads as standard practice. Sacred images deserve at least the same courtesy.

### Decision

Extend ADR-035's responsive serving with **five named size tiers** and a **user-facing download interface** on image detail pages.

**Size tiers:**

| Tier | Name | Max dimension | Use case | Format |
|------|------|--------------|----------|--------|
| `thumb` | Thumbnail | 300px | Gallery grids, chat previews, quick reference | WebP + JPEG fallback |
| `small` | Small | 640px | Social media sharing, messaging apps, email | WebP + JPEG fallback |
| `medium` | Medium | 1200px | Blog posts, presentations, web use | WebP + JPEG fallback |
| `large` | Large | 2400px | Desktop wallpaper, high-DPI displays, large screens | WebP + JPEG fallback |
| `original` | Original | Source dimensions | Print, archival, professional use | Original format (JPEG/TIFF) |

All sizes are generated at ingestion time (not on-demand) to avoid compute overhead on download. The Lambda ingestion pipeline already processes each image for thumbnail and display sizes (ADR-035) — this extends it to produce all five tiers in a single pass using `sharp` (Node.js) or Pillow (Python Lambda).

**Storage layout:**

```
s3://srf-portal-images/
 {image-id}/
 original.jpg — Source file, untouched
 large.webp — 2400px max dimension
 large.jpg — 2400px JPEG fallback
 medium.webp — 1200px max dimension
 medium.jpg — 1200px JPEG fallback
 small.webp — 640px max dimension
 small.jpg — 640px JPEG fallback
 thumb.webp — 300px max dimension
 thumb.jpg — 300px JPEG fallback
```

**Schema extension to `images` table:**

```sql
-- Add size metadata columns (populated during ingestion)
ALTER TABLE images ADD COLUMN sizes JSONB NOT NULL DEFAULT '{}';
-- Example value:
-- {
-- "thumb": {"width": 300, "height": 200, "url": "/thumb.webp", "bytes": 18200},
-- "small": {"width": 640, "height": 427, "url": "/small.webp", "bytes": 42100},
-- "medium": {"width": 1200, "height": 800, "url": "/medium.webp", "bytes": 98500},
-- "large": {"width": 2400, "height": 1600, "url": "/large.webp", "bytes": 285000},
-- "original": {"width": 4000, "height": 2667, "url": "/original.jpg", "bytes": 1850000}
-- }
```

**API:**

```
GET /api/v1/images/{slug}
 → response includes `sizes` object with all available tiers, dimensions, and byte sizes

GET /api/v1/images/{slug}/download?size=medium&format=jpg
 → Returns a redirect (302) to the CloudFront URL for the requested size and format
 → Valid sizes: thumb, small, medium, large, original
 → Valid formats: webp, jpg (original tier returns source format)
 → Default: medium, webp
 → Response headers: Content-Disposition: attachment; filename="{slug}-{size}.{ext}"
```

**Frontend — download UI on `/images/[slug]`:**

The image detail page includes a "Download" section below the image viewer:

```
┌─────────────────────────────────────────────────┐
│ [Full image view with lightbox] │
│ │
│ Caption · Photographer · Era · Collection │
│ │
│ Download │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Small │ │ Medium │ │ Large │ │
│ │ 640×427 │ │ 1200×800 │ │ 2400×1600│ │
│ │ 42 KB │ │ 98 KB │ │ 285 KB │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│ ┌──────────┐ ┌──────────────────────┐ │
│ │ Original │ │ Format: WebP ▾ │ │
│ │ 4000×2667│ └──────────────────────┘ │
│ │ 1.8 MB │ │
│ └──────────┘ │
│ │
│ © Self-Realization Fellowship │
│ Free for personal and devotional use. │
│ Please credit: teachings.yogananda.org │
└─────────────────────────────────────────────────┘
```

- Each size tier is a button showing dimensions and file size
- A format toggle (WebP / JPEG) applies to all size buttons
- "Original" always downloads in the source format
- A brief attribution line appears below the download options — not a license wall, not a gate
- Sacred images (`is_yogananda_subject = true`) include a gentle note: "This sacred photograph is shared freely for devotional and educational purposes."

**Watermarking integration (ADR-063):**

- All generated sizes receive Tier 1 EXIF/XMP metadata (Phase 2)
- Sizes `medium`, `large`, and `original` receive Tier 2 C2PA Content Credentials (Phase 14)
- `original` size of sacred images additionally receives Tier 3 steganographic watermark (Phase 14)
- `thumb` and `small` are too small for reliable steganographic embedding — they receive EXIF/XMP and C2PA only

### Rationale

- **Five tiers cover real-world use cases.** Thumbnail for reference, small for messaging, medium for web/presentations, large for high-DPI displays and wallpapers, original for print. This eliminates the awkward "right-click save" workflow where seekers get whatever size the browser rendered.
- **Pre-generated, not on-demand.** On-demand resizing adds latency, compute cost, and cache complexity. The image archive is finite and grows slowly (curated by editors). Generating all sizes at ingestion is the simpler, more predictable approach for a 10-year horizon.
- **WebP + JPEG dual format.** WebP offers ~30% smaller files for the same quality. JPEG fallback for older browsers and systems that don't support WebP. The format toggle respects seeker choice.
- **Download endpoint with Content-Disposition.** A dedicated download endpoint (not just a direct image URL) allows proper filename formatting, download tracking via Amplitude (anonymous: `image_downloaded` event with size tier, no user identification), and future rate limiting if needed.
- **Attribution, not restriction.** The portal's mission is to spread the teachings freely. The attribution line is a gentle request, not a license gate. No click-through agreements, no watermark-over-face, no resolution limits behind sign-up walls.

### Consequences

- Image ingestion Lambda extended to produce 5 size tiers (was 3) in dual format (WebP + JPEG)
- S3 storage per image increases from ~3 files to ~9 files; acceptable given curated archive size
- `images.sizes` JSONB column added to Phase 14 migration
- New download API endpoint: `GET /api/v1/images/{slug}/download`
- Image detail page (`/images/[slug]`) gains download section with size selector
- Amplitude event: `image_downloaded` with properties `{size, format}` (no user identification — DELTA compliant, ADR-095)
- **Extends ADR-035** (image content type) from 3 responsive sizes to 5 named download tiers
- **Extends ADR-063** (digital watermarking) with per-tier watermarking rules

---

## ADR-065: SRF-Derived Design System with Calm Technology Principles

- **Status:** Accepted (updated with extracted design tokens)
- **Date:** 2026-02-17

### Context

Standard web design patterns (aggressive CTAs, gamification, notification badges, bright neon colors) conflict directly with SRF's theological commitment to "plain living and high thinking." Rather than inventing a new visual language, we extracted actual design tokens from live SRF properties to ensure brand consistency.

**Properties analyzed:**
- yogananda.org (Craft CMS — donate button, gold/navy palette, lotus icons)
- onlinemeditation.yogananda.org (WordPress/Astra — Merriweather + Lora fonts, form styling)
- convocation.yogananda.org (Next.js + Contentful — 7-locale setup)

### Decision

The portal adopts a **design system derived from existing SRF sites**, enhanced with Calm Technology constraints:

**Typography (from SRF Online Meditation Center):**
- **Merriweather** (300, 400, 700) — primary serif for book text and headings
- **Lora** (400) — secondary serif for chapter titles, decorative use
- **Open Sans** (400, 600) — sans-serif for UI chrome, navigation, labels

**Color palette (from yogananda.org + OMC):**
- SRF Gold `#dcbd23` — primary accent (donate button, lotus, CTAs)
- SRF Orange `#de6a10` — hover/active states
- SRF Navy `#1a2744` — headings, primary text (estimated from assets)
- Warm cream `#FAF8F5` — portal background (Calm Technology extension)
- Interactive blue `#0274be` — focus states, links

**Interaction patterns (from SRF donate button):**
- Gold border + gold text → orange fill on hover
- `transition: all 0.3s ease` for hover/focus states
- Pill-shaped CTA buttons (`border-radius: 50px`)

**Calm Technology constraints:**
- No gamification, no streaks, no badges, no leaderboards
- No aggressive notifications
- No decorative animations beyond subtle 0.3s transitions
- Generous whitespace treated as "digital silence"
- Warm backgrounds, never pure white

### Rationale

- **Brand consistency:** Same fonts and colors as existing SRF digital properties
- **Theological alignment:** Calm Technology principles match "plain living and high thinking"
- **Reusability:** These tokens can become a shared design system across all SRF properties
- **Familiarity:** Existing SRF devotees will recognize the visual language

### Consequences

- The design system should be documented as CSS custom properties (see DESIGN.md)
- WCAG contrast ratios must be validated — muted colors on warm cream backgrounds need careful checking
- The lotus icon SVG family from yogananda.org can be reused (with SRF's permission)
- A shared npm package could eventually serve these tokens to all SRF Next.js properties

---

## ADR-066: Lotus Bookmark — Account-Free Reading Bookmarks

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

The portal's design philosophy prioritizes immediate access without registration (Phase 15 introduces optional accounts). But readers still need a way to save their place across reading sessions. Without bookmarks, a reader must remember where they were — or re-search for a passage they found meaningful.

Browser bookmarks are too coarse (they save a URL, not a reading position). The portal needs a lightweight, private, account-free bookmarking system.

### Decision

Implement **Lotus Bookmarks** using `localStorage`:

1. **Bookmark a chapter:** A small lotus icon (SVG, `--srf-gold` at 50% opacity, 20px) appears in the reader header beside the chapter title. Clicking it fills the lotus to full opacity and stores the bookmark. Clicking again removes it. The lotus was chosen because it already exists in SRF's visual language and carries meaning: a lotus marks where light was found.

2. **Bookmark a passage:** In dwell mode (DES-009), a small lotus icon appears alongside the share icon. Clicking it bookmarks the specific paragraph.

3. **Bookmarks page (`/bookmarks`):** A simple page listing all bookmarked chapters and passages, organized by book. Each entry shows the book title, chapter title, and (for passage bookmarks) the first line of the passage with its citation. Clicking navigates to that position in the reader.

4. **Storage:** All bookmarks stored in `localStorage` under a portal-namespaced key (`srf-portal:bookmarks`). JSON structure:
 ```json
 {
 "chapters": [{"bookSlug": "...", "chapter": 14, "title": "...", "savedAt": "ISO"}],
 "passages": [{"chunkId": "...", "bookSlug": "...", "chapter": 14, "firstLine": "...", "savedAt": "ISO"}]
 }
 ```

5. **No server interaction, no accounts, no tracking.** Bookmarks exist only in the user's browser. Clearing browser data removes them. This is stated clearly on the bookmarks page.

6. **Phase 15 migration:** When optional accounts are introduced (Phase 15), bookmarks are synced to the server on login. `localStorage` bookmarks are offered for import. Until then, bookmarks are entirely client-side.

### Rationale

- Serves the 80%+ of users who will never create accounts
- The lotus icon is meaningful (not a generic bookmark/star) — it connects the interaction to SRF's visual and spiritual vocabulary
- `localStorage` is the simplest possible implementation — no database, no API, no auth
- The bookmarks page provides a personal reading dashboard without any personalization infrastructure
- Privacy: impossible to track what users bookmark (data never leaves the browser)

### Consequences

- The reader header gains a lotus bookmark icon
- The dwell mode UI (DES-009) gains a lotus bookmark icon alongside the share icon
- A `/bookmarks` page is added to the navigation (appears only when bookmarks exist, or always in footer)
- `localStorage` has a ~5MB limit per origin — sufficient for thousands of bookmarks
- Users on different browsers/devices will have separate bookmark collections until Phase 15 sync
- The bookmarks page is a client-only page (no SSR needed — reads directly from `localStorage` on mount)

---

## ADR-067: Non-Search Seeker Journeys — Equal Excellence for Every Path

- **Status:** Accepted
- **Date:** 2026-02-21

### Context

The portal's architecture centers on search — the AI librarian (ADR-001, ADR-089), embedding pipeline (ADR-009, ADR-046), query expansion (ADR-005), and passage ranking. This is justified: intelligent search is the portal's differentiator and the AI librarian is the core innovation.

But a significant population of seekers will never touch the search bar:

- **The Google arrival.** A seeker finds a chapter via search engine results, reads, and leaves. Their entry point is a chapter page, not the homepage.
- **The daily visitor.** Returns each morning for Today's Wisdom. Reads the passage, clicks "Show me another" once or twice, contemplates, leaves. Has never searched.
- **The Quiet Corner seeker.** Goes directly to `/quiet` in a moment of crisis. Sits with the affirmation. Leaves. May never visit another page.
- **The linear reader.** Opened Chapter 1, reads sequentially through the book. Uses Next Chapter. Doesn't explore cross-book connections.
- **The shared-link recipient.** Receives a `/passage/[chunk-id]` URL from a friend. Reads the passage. Their impression of the entire portal is formed by this single page.

Each of these paths should be as excellent as the search experience. "Excellent" does not mean adding features — it means ensuring that each path is complete, warm, and naturally invites deeper engagement without pressure.

### Decision

1. **The shared passage page (`/passage/[chunk-id]`) is the most important first-impression surface after the homepage.** It is mediated by *trust* — a friend sent this. The page should feel like receiving a gift, not visiting a website.

 Enhancements:
 - Above the passage: "A passage from the teachings of Paramahansa Yogananda" — framing context for seekers unfamiliar with the author.
 - Below the citation: "This passage appears in *[Book Title]*, Chapter [N]. Continue reading →" — framing the book as a world to enter, not a citation to note.
 - Below the book link: "Explore more teachings →" — linking to the homepage, not the library (the homepage's Today's Wisdom provides a second immediate encounter).
 - The warm cream background, decorative quote mark (DES-008), and generous whitespace ensure the page is visually the most beautiful thing the recipient sees in their social feed that day.

2. **The Google-arrival chapter page has a gentle context header.** When a seeker lands on `/books/[slug]/[chapter]` without navigating through the portal (referrer is external or empty), a subtle one-line context bar appears above the chapter title: "You're reading *[Book Title]* by Paramahansa Yogananda — [Chapter N] of [Total] — Start from the beginning →". Styled in `--portal-text-muted`, `--text-sm`. Dismissed on scroll. Not shown when navigating within the portal.

3. **The Quiet Corner is self-contained.** No navigation chrome competes with the affirmation. The header collapses to just the lotus mark (home link). The footer is suppressed. The page is almost entirely empty — the affirmation, the timer, and nothing else. This is already specified in DESIGN.md but is elevated here as an explicit design constraint: the Quiet Corner page must pass the "2 AM crisis test" — a person in distress should see nothing that adds to their cognitive load.

4. **The daily visitor's path optimizes for Today's Wisdom.** The homepage's information architecture already places Today's Wisdom first. This ADR adds: the "Show me another" interaction should feel *inexhaustible* — the seeker should never feel they've "used up" the passages. When the pool is thin (Phase 1, one book), "Show me another" should cycle through all available passages before repeating any. A simple client-side exclusion list (sessionStorage) prevents repeats within a visit.

5. **Each path naturally invites one step deeper — exactly one.** The shared passage page invites: continue reading the chapter. The chapter page (external arrival) invites: start from the beginning. The Quiet Corner invites: nothing during the timer, then a parting passage (DES-014). Today's Wisdom invites: "Show me another" or search. Never more than one invitation at a time. Never pressure.

### Alternatives Considered

1. **Optimize only for search (the differentiating feature).** Rejected: The portal's mission is to make the teachings "available freely throughout the world." Availability means every path to the teachings is excellent, not just the most technically sophisticated one.

2. **Add prompts to search from non-search pages.** Rejected: A shared passage recipient who sees "Try searching for more!" has been sold to, not served. The non-search paths should be complete in themselves, with organic connections to more content — not funnels into search.

3. **A/B test non-search page variants.** Rejected: DELTA-compliant analytics (ADR-095) exclude user-level behavioral profiling. The portal cannot A/B test. Design decisions are made through editorial judgment and qualitative feedback (ADR-084).

### Rationale

- **The shared passage page is the portal's ambassador.** More people may encounter the portal through a shared link than through the homepage. That page must represent the portal's best self.
- **The Quiet Corner is the portal's purest expression.** A page that is almost entirely empty, holding space for a single affirmation and a seeker in need — this is the portal at its most aligned with Yogananda's teaching about the power of stillness.
- **"One step deeper" respects the seeker's autonomy.** The DELTA Agency principle means the seeker controls their experience. Offering one natural invitation is service. Offering three is pressure. Offering none is neglect.
- **Daily visitors are the portal's most devoted seekers.** A person who returns every morning for Today's Wisdom has made the portal part of their spiritual practice. Their experience should reward this devotion with variety and depth, not repetition.

### Consequences

- Shared passage page (`/passage/[chunk-id]`) redesigned with framing context, book invitation, and homepage link
- Chapter page gains external-arrival context header (referrer detection, sessionStorage dismissal)
- Quiet Corner page explicitly constrained: suppressed footer, minimal header
- "Show me another" gains sessionStorage-based repeat prevention within a visit
- DESIGN.md § Passage Sharing, § The Quiet Corner, and § Book Reader updated
- New DESIGN.md subsection: "Non-Search Seeker Journeys"
- No schema changes, no new API endpoints
- QA requirement: test each of the five non-search paths end-to-end for warmth, completeness, and single-invitation principle

---

## ADR-068: Passage Sharing as Organic Growth Mechanism

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

When someone reads a passage that moves them, the most natural human response is to share it with someone they love. This is also the most organic growth mechanism for the portal — and it's perfectly aligned with SRF's mission of spreading the teachings.

| Approach | Mechanism | Alignment with Mission |
|----------|-----------|----------------------|
| **No sharing** | Portal is a closed library | Functional but misses the natural word-of-mouth vector |
| **Social media integration** | Share buttons for Twitter/Facebook/Instagram | Introduces third-party tracking; commercial platforms conflict with Calm Technology |
| **Clean link + OG card** | Generate a shareable URL with beautiful Open Graph metadata | No tracking; the shared content speaks for itself; recipient lands on the portal |
| **Image card generation** | Generate a downloadable image of the quote (Merriweather on warm cream with citation) | Shareable anywhere without platform dependency; beautiful; printable |

### Decision

Implement **clean link sharing with Open Graph cards** and **downloadable quote image generation** as a Phase 2 feature. Every passage — in search results, in the reader, on theme pages, and in the Quiet Corner — has a quiet "Share" affordance.

**Share link behavior:**
- Generates a URL like `/passage/[chunk-id]` that resolves to the passage in context (reader view, scrolled to the passage)
- Open Graph tags render a beautiful preview card when the link is pasted into any platform: the quote in Merriweather, warm cream background, citation, and the portal URL
- No tracking parameters, no UTM codes, no referral tracking

**Quote image behavior:**
- "Save as image" option generates a PNG: the passage text in Merriweather on warm cream, citation below, subtle SRF lotus mark, portal URL at bottom
- Suitable for sharing via messaging apps, printing, or using as a phone wallpaper
- Generated server-side (or client-side via canvas) — no external service needed

### Rationale

- **Mission-aligned:** The philanthropist's goal is to make the teachings available worldwide. Sharing is the most natural distribution mechanism.
- **No tracking:** Unlike social share buttons (which embed third-party scripts and tracking pixels), a clean URL with OG metadata involves zero tracking.
- **Beautiful and respectful:** The shared card presents the teaching with the same reverence as the portal itself — serif typography, warm colors, proper citation.
- **Printable:** The downloadable image can be printed, framed, or placed on a meditation altar — bridging digital and physical, honoring the DELTA Embodiment principle.
- **Low effort, high impact:** OG tags are standard Next.js metadata. Image generation is a single API route or client-side canvas operation.

### Consequences

- Need a `/passage/[chunk-id]` route that renders a single passage in a shareable view
- OG meta tags must be set per-passage (dynamic `<meta>` in Next.js `generateMetadata`)
- Image generation requires either a server-side rendering solution (e.g., `@vercel/og` or Satori) or client-side canvas
- The share affordance must be visually quiet — a small icon, never a row of social media logos

---

## ADR-069: Events and Sacred Places — Signpost, Not Destination

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Seekers who discover Yogananda's words on the portal will naturally ask: "Where can I experience this in person?" Two related needs emerge:

1. **Events.** SRF holds annual World Convocation (already its own site at `convocation.yogananda.org`), commemorations (Christmas meditation, Mahasamadhi, Janmashtami), and online meditation events. The portal should connect seekers to these gatherings without duplicating the convocation site or the Online Meditation Center.

2. **Sacred Places.** Yogananda's life touched specific places that hold deep significance: his birthplace in Gorakhpur, Sri Yukteswar's ashram in Serampore, Lake Shrine in Pacific Palisades, the Encinitas hermitage where the Autobiography was written. No travel site can cross-reference these places with the specific book passages that describe them. The teaching portal can.

Both serve the DELTA Embodiment principle: *put down the device and go somewhere.* The portal bridges digital reading to physical experience.

### Decision

Add two content sections to the portal:

#### Events — Lightweight Signpost

A simple section (on the About page initially, or a dedicated `/events` page) that links to SRF's existing event properties:

| Element | Content | Source |
|---------|---------|--------|
| **World Convocation** | Brief description + link to `convocation.yogananda.org` | Static text + external link |
| **Commemorations** | Christmas meditation, Mahasamadhi, Janmashtami, Founder's Day, etc. | Static list with approximate dates + links to SRF event pages |
| **Online events** | Link to Online Meditation Center live schedule | External link to `onlinemeditation.yogananda.org` |

This is a signpost, not a destination. The portal does not replicate event registration, schedules, or logistics.

#### Sacred Places — Contemplative Geography

A dedicated `/places` page presenting sites of biographical and spiritual significance, cross-referenced with book passages.

**Two categories of places:**

**SRF/YSS properties (official, current):**

| Place | Location | Significance |
|-------|----------|-------------|
| Mount Washington | Los Angeles, CA | International headquarters since 1925 |
| Lake Shrine | Pacific Palisades, CA | Gandhi World Peace Memorial, meditation gardens |
| Encinitas Temple & Retreat | Encinitas, CA | Hermitage where Yogananda wrote the Autobiography |
| Hollywood Temple | Hollywood, CA | Yogananda's first SRF temple |
| Other SRF temples | Various US locations | |
| Hidden Valley Ashram Center | Escondido, CA | Monastic retreat |
| YSS Dakshineswar Ashram | Kolkata, India | Near the Dakshineswar Kali Temple |
| YSS Ranchi Ashram | Ranchi, India | Yogananda's first school for boys (1918) |
| 500+ meditation centers worldwide | Various | Community meditation groups |

**Historical/biographical sites:**

| Place | Location | Significance in Autobiography |
|-------|----------|-------------------------------|
| Gorakhpur | Uttar Pradesh, India | Yogananda's birthplace (Chapter 1) |
| Serampore | West Bengal, India | Sri Yukteswar's ashram (many chapters) |
| Puri | Odisha, India | Sri Yukteswar's seaside ashram |
| Dakshineswar | Kolkata, India | Lahiri Mahasaya's lineage connection |
| Varanasi (Benares) | Uttar Pradesh, India | Lahiri Mahasaya's home |

**Each place includes:**
- Contemplative header image (SRF property photographs where available)
- Brief description of its significance in Yogananda's life and mission
- **Cross-reference to the book** — "Read about this place in Autobiography of a Yogi, Chapter X" with deep link to the reader
- Visiting information — address, hours, link to SRF/YSS site for details
- Simple map (Phase 12)

**The unique value:** The teaching portal is the only place that can cross-reference sacred places with the specific passages that describe them. When a seeker reads about Serampore in the Autobiography, the portal can show "Visit this place." When they browse the Sacred Places page, each entry links back to every passage that mentions it. The teachings and the places illuminate each other.

### Map Strategy

- **Phase 9:** No maps. Text descriptions with addresses and "Get Directions" links (opens user's native maps app).
- **Phase 12:** No embedded map library. Add **"See This Place" Street View links** (plain Google Maps URLs, no SDK) to place cards where coverage exists. Zero map dependencies, zero tile servers, zero maintenance. See ADR-070.
- **Future:** Dynamic center locator (if SRF provides data). If a center locator requires an embedded map, evaluate Leaflet + OpenStreetMap or Google Maps at that point — separate decision for a different page with different requirements.

### Rationale

- **DELTA Embodiment.** The portal should encourage seekers to visit, practice, and connect in person. A well-designed Sacred Places section makes the teachings tangible.
- **Unique cross-referencing.** No other site connects Yogananda's physical world to his written words with deep links into a book reader. This is the portal's distinctive contribution.
- **"What Next" Bridge.** Both Events and Sacred Places serve the portal's signpost function — pointing toward the broader SRF world without tracking conversions.
- **Signpost, not duplicate.** The convocation site handles event logistics. The Online Meditation Center handles live events. The portal links to both without replicating their functionality.
- **No embedded map — Street View links instead (ADR-070).** Zero dependencies, zero tracking, zero cost. Street View URLs give seekers a virtual visit to physical places without embedding any map SDK. "Get Directions" delegates navigation to the user's preferred maps app.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Full interactive map with all SRF centers** | Comprehensive; replaces "Find a meditation group" external link | Requires SRF center database (stakeholder dependency); high implementation complexity; duplicates functionality SRF may already have |
| **Google Maps embeds** | Familiar UX; Street View available | Google tracking scripts on page; API costs; contradicts privacy principles |
| **Leaflet + OpenStreetMap embedded map** | Open-source; no tracking; visual overview of all locations | Library dependency for ~20 pins; page works without it; "Get Directions" already opens real maps apps; not worth the maintenance on a 10-year horizon |
| **No places section — just external links** | Simplest implementation | Misses the unique cross-referencing opportunity; doesn't serve Embodiment principle |
| **Full convocation integration** | Seekers don't leave the portal | Duplicates `convocation.yogananda.org`; maintenance burden; SRF already invested in a separate convocation site |

### Consequences

- Phase 9 adds static Events section and initial Sacred Places page (SRF properties, no maps)
- Phase 12 adds biographical sites and "See This Place" Street View links (ADR-070) — no embedded map library
- Sacred Places content needs SRF/YSS review — biographical descriptions must be accurate and approved
- Cross-referencing places with book passages requires a `places` table and a `chunk_places` junction table (or place tags on chunks)
- Stakeholder question: can SRF provide or approve property photographs? (Already raised.)
- Stakeholder question: does SRF have a center location database (addresses, coordinates, hours) for an eventual center locator?
- The Events section is low-maintenance — updated annually or via Contentful in production

---

## ADR-070: Sacred Places — No Embedded Map, Street View Links Instead

- **Status:** Accepted
- **Date:** 2026-02-18
- **Supersedes:** Leaflet + OpenStreetMap portion of ADR-069

### Context

ADR-069 originally specified Leaflet + OpenStreetMap as the Phase 12 embedded map for the Sacred Places page. On re-evaluation, the embedded map adds a library dependency for a page that already communicates geography effectively through its card layout (grouped by category, each card showing city and country). The page works in Phase 5 without any map. "Get Directions" already delegates to the user's preferred maps app for navigation. The one thing no outbound link provided was a *virtual visit* — seeing what a place looks like before traveling there.

### Decision

Drop the embedded map library entirely. Instead, add **"See This Place"** links to place cards — plain Google Maps Street View URLs that open in a new tab.

**What this means:**
- No Leaflet dependency
- No OpenStreetMap tile server dependency
- No map JavaScript on the page
- No API keys for maps
- Zero map-related maintenance

**Street View links** are plain URLs with coordinates baked in. They require no SDK, no API key, and load no scripts on the portal itself. The user's browser navigates to Google Maps in a new tab — any tracking happens there, not on the portal.

**"Get Directions"** links continue to use `geo:` URIs (or platform-specific fallbacks) to open the user's native maps app.

**Street View availability:** Not all places have Street View coverage (particularly some biographical sites in India). The "See This Place" link is only shown for places where coverage exists. The `places` table already stores latitude/longitude; a `street_view_url` column (nullable) can hold the curated Street View URL for each place.

### Rationale

- **The page isn't a map feature — it's a cross-referencing feature.** The unique value is linking places to book passages, not rendering tiles. An embedded map is the least valuable component on the page.
- **Street View delivers the emotional preview.** Virtually standing outside Lake Shrine or the Encinitas hermitage is more compelling than a pin on a Leaflet map. It's the one map capability that matters for a "Contemplative Geography" page.
- **Zero dependencies > low dependencies.** Leaflet is lightweight and stable, but zero map libraries is lighter and more stable. On a 10-year project horizon (ADR-004), every dependency is a maintenance commitment.
- **Privacy preserved.** No Google SDK loaded on the portal. The Street View link is an outbound navigation, same as "Get Directions" or the external SRF property links.
- **Future flexibility.** If a dynamic center locator (500+ locations) is built later, the map library decision can be made for that page with that page's requirements. The Sacred Places page doesn't need to carry that dependency preemptively.

### Data Model Change

```sql
ALTER TABLE places ADD COLUMN street_view_url TEXT; -- nullable, only for places with coverage
```

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Leaflet + OpenStreetMap** (original ADR-069) | Visual overview of all locations; open-source | Library dependency for ~20 pins; page works without it; less compelling than Street View for virtual visits |
| **Google Maps embed** | Familiar UX; Street View inline | Google tracking scripts on page; API costs; contradicts privacy principles |
| **No map, no Street View** | Simplest possible | Misses the virtual visit opportunity that makes the page come alive |

### Consequences

- Leaflet and OpenStreetMap are removed from the project's dependency list
- The `places` table gains a nullable `street_view_url` column
- Phase 12 Sacred Places work is simpler: add biographical sites + Street View links + Reader ↔ Place cross-reference cards
- The future center locator (if built) makes its own map library decision independently
- CLAUDE.md tech stack table updated to remove the Maps row

---

## ADR-071: Crisis Resource Presence — Gentle Safety Net on Grief and Death Content

- **Status:** Accepted
- **Date:** 2026-02-21

### Context

The portal's grief and death content strategy targets seekers searching for "what happens after death," "spiritual comfort after loss," and "soul immortality." These are among the portal's highest-impact empathic entry points — they serve people in genuine pain. The SEO strategy deliberately positions the portal to rank for grief-related Yogananda queries.

This strategy will reach people who are actively suicidal. A person searching at 2 AM for "what happens after death" may not be grieving a loss — they may be considering ending their own life. Yogananda's passages about the immortality of the soul, the freedom of death, and the continuation of consciousness are truthful and beautiful. But presented without context to a person in crisis, they could be read as endorsement of self-harm — a reading that fundamentally contradicts Yogananda's teaching that human life is a sacred opportunity for spiritual growth.

The portal's "direct quotes only" principle (ADR-001) means it cannot add interpretive framing around passages. The Calm Technology principle means it cannot use aggressive modals or interstitials. The DELTA framework means it cannot identify or track vulnerable users. The question is: within these constraints, what is the portal's moral responsibility?

### Decision

1. **Display a non-intrusive crisis resource line on grief-adjacent content.** On the grief theme page (`/themes/grief`), on search results pages when the query matches grief/death intent patterns, and on the Quiet Corner page, display a single quiet line below the content area:

 > *If you or someone you know is in crisis, help is available.* [Crisis helpline link]

 Styled in `portal-text-muted`, smaller than body text, visually consistent with footer links — present but not competing with the teachings. No modal, no pop-up, no interstitial.

2. **Locale-appropriate crisis resources.** Each supported locale provides the appropriate helpline:
 - `en`: 988 Suicide and Crisis Lifeline (US), Samaritans 116 123 (UK/EU)
 - `es`: Teléfono de la Esperanza (Spain), local equivalents (Latin America)
 - `hi`/`bn`: iCall, Vandrevala Foundation, AASRA
 - `ja`: Inochi no Denwa
 - Other locales: IASP directory link as fallback

 Resource data stored in locale files (`messages/{locale}.json`) alongside other UI strings. Editorial review required for all crisis resource text (consistent with ADR-078).

3. **Intent detection is simple, not invasive.** The system does not analyze individual user behavior. Grief-adjacent content is identified by *content type* (grief theme page, death-related teaching topic), not by *user signals*. If a page is about death, it carries the resource line — regardless of who is reading or why.

4. **The Quiet Corner always carries the resource line.** The Quiet Corner is designed for the "2 AM unable to sleep" persona (DESIGN.md § The Quiet Corner). This is the portal's highest-vulnerability context. The crisis resource line is a permanent, subtle feature of the Quiet Corner page.

### Alternatives Considered

1. **No crisis resources at all.** Considered: The portal is a library, not a mental health service. Adding crisis resources could feel patronizing or out of place. However: the portal's SEO strategy *deliberately* targets people searching for comfort around death. Deliberately attracting vulnerable seekers while providing no safety net is a moral failure, not a design choice.

2. **Prominent crisis modal or banner.** Rejected: Violates Calm Technology. A modal on grief content would be alarming, would interrupt the contemplative experience, and would treat every seeker reading about death as a potential suicide risk — which is both inaccurate and disrespectful.

3. **AI-powered crisis detection.** Rejected: Violates DELTA (no behavioral profiling). Would require analyzing user intent beyond content classification. Architecturally incompatible with the portal's privacy commitments.

4. **Link only from the About page or FAQ.** Considered: Less intrusive but defeats the purpose. The person in crisis is not navigating to the About page. The resource must be where the vulnerability is — on the grief content itself.

### Rationale

- **Moral responsibility follows from intentional positioning.** The portal is not passively available — it actively seeks to rank for grief queries. This creates a duty of care that goes beyond what a generic library would bear.
- **The DELTA Dignity principle demands it.** "Users are seekers, not data points." Dignity includes acknowledging that some seekers are in danger and providing a path to help without surveillance or judgment.
- **Calm implementation is possible.** A single muted line below content is not an aggressive intervention. It is the digital equivalent of a crisis helpline card placed on the library counter — available to those who need it, invisible to those who don't.
- **Yogananda's teaching supports it.** Yogananda taught that human life is a precious opportunity for spiritual realization. Self-harm contradicts this teaching. Providing a crisis resource is consistent with the tradition's view of the sacredness of life.
- **Industry precedent exists.** Google displays crisis resources on suicide-related queries. YouTube shows them on self-harm content. The portal should meet this standard without adopting the surveillance mechanisms that accompany it on those platforms.

### Consequences

- New UI element: crisis resource line on grief theme page, grief-adjacent search results, and Quiet Corner
- Locale files extended with per-locale crisis helpline data
- CONTEXT.md § Spiritual Design Principles references this ADR
- CONTEXT.md § Open Questions (Stakeholder) includes crisis resource policy question for SRF input
- No schema changes, no API changes, no privacy implications
- Editorial review required for all crisis resource text before publication
- Annual review recommended: verify helpline numbers and URLs remain current

---

## ADR-072: Cognitive Accessibility — Reducing Complexity for All Seekers

- **Status:** Accepted
- **Date:** 2026-02-21

### Context

The portal's accessibility commitment (ADR-003) targets WCAG 2.1 AA compliance: vision, hearing, motor, and some cognitive requirements. This covers screen readers, keyboard navigation, color contrast, and reduced motion. But cognitive accessibility is a broader dimension:

- **Decision fatigue.** The homepage presents Today's Wisdom, a search bar, 6 thematic doors, 5 "Seeking..." links, and latest video thumbnails. For a first-time visitor in emotional distress, this quantity of choices may be overwhelming.

- **Gesture vocabulary.** The portal uses: click (navigate), long-press (Dwell), hover-wait (dwell icon reveal), keyboard shortcuts (12 keys), scroll (read), and "Show me another" (refresh). Each individually is intuitive. In aggregate, the gesture vocabulary is larger than most reading applications.

- **Reading complexity.** Yogananda's prose ranges from accessible affirmations to dense philosophical exposition. The portal treats all content equally in presentation.

These concerns apply not only to seekers with cognitive disabilities but also to non-native English speakers (before Phase 11 adds their language), elderly seekers, seekers under acute emotional stress, and seekers unfamiliar with web conventions.

### Decision

1. **Progressive homepage disclosure for first visits.** On the first visit (sessionStorage, extending DES-007's mechanism), the homepage after the lotus threshold shows a simplified state:
 - Today's Wisdom (full size, centered, with "Show me another")
 - The search bar ("What are you seeking?")
 - A single line: "Or explore a theme" — linking to the thematic doors section below

 The thematic doors, "Seeking..." entry points, and video section are present on the page but appear below the fold. The seeker discovers them by scrolling — at their own pace. Return visits within the session show the full homepage immediately.

 This is not "hiding content" — it's sequencing the first encounter to reduce cognitive load. The most important elements (a teaching + a search bar) appear first. Everything else is available but not competing for attention.

2. **Passage accessibility classification.** During ingestion, passages receive an editorial `accessibility_level` tag:
 - `accessible`: Short, clear, affirmation-like. Suitable for daily wisdom, newcomer paths, Quiet Corner.
 - `moderate`: Standard narrative prose. The bulk of the corpus.
 - `dense`: Philosophical, multi-clause, requires sustained attention. Commentary on scriptures, metaphysical analysis.

 This tag is used internally for pool selection (Today's Wisdom favors `accessible`; Quiet Corner uses only `accessible`; search returns all levels) — never displayed to the seeker. Not a quality judgment. Dense passages are not lesser teachings — they are teachings that reward deeper attention.

3. **Simplified reading mode.** An optional "Focus" toggle in the reader header (Phase 4, alongside Dwell) that reduces the reader to: reading column + Next Chapter. The Related Teachings side panel, keyboard shortcut overlay, dwell icon, and bookmark icon are suppressed. The toggle is stored in `localStorage`. This mode serves seekers who want to read a book linearly without the library-navigation features — and it naturally serves cognitive accessibility needs without labeling them.

4. **Consistent, minimal gesture vocabulary for core tasks.** The portal's essential experience (read, search, navigate) requires only: click, scroll, and type. All other gestures (long-press, hover-wait, keyboard shortcuts) are enhancements. The portal must be fully functional with only the three basic gestures. This is already approximately true but should be an explicit design constraint tested in QA.

### Alternatives Considered

1. **No cognitive accessibility considerations beyond WCAG 2.1 AA.** Rejected: WCAG AA covers minimum cognitive requirements (consistent navigation, error identification, reading level for labels). The portal's mission — serving seekers worldwide, including those in crisis — demands going further.

2. **A dedicated "simple mode" for the entire portal.** Rejected: Labeling creates stigma. "Focus" mode in the reader is a feature, not an accessibility accommodation. The progressive homepage disclosure applies to all first-time visitors, not a special subset.

3. **AI-powered reading level adaptation.** Rejected: Violates the "direct quotes only" principle (ADR-001). Yogananda's words cannot be simplified. The accessibility classification routes seekers to appropriate *passages*, not to modified text.

### Rationale

- **The seeker in crisis is the hardest cognitive accessibility case.** The "Seeking..." entry points target people in emotional distress. A person at 2 AM unable to sleep because of anxiety has reduced cognitive capacity. The homepage should require minimal cognitive effort to find comfort.
- **Progressive disclosure is standard UX, not accommodation.** Apple, Google, and most modern products sequence complexity. Showing everything at once is a design choice, not a necessity.
- **Focus mode serves multiple populations.** Linear readers, elderly seekers, seekers with cognitive disabilities, seekers on very small screens, and seekers who simply prefer simplicity all benefit from a reduced-chrome reading mode.
- **Accessibility classification improves Today's Wisdom quality.** The daily passage should be a standalone moment of inspiration. Dense philosophical prose — however profound — makes a poor homepage greeting for a first-time visitor.

### Consequences

- Homepage first-visit behavior extended (sessionStorage): simplified above-the-fold state
- New `accessibility_level` column on `book_chunks` (nullable enum: `accessible`, `moderate`, `dense`)
- Today's Wisdom pool favors `accessible` passages (soft bias, not hard filter)
- Quiet Corner pool restricted to `accessible` passages
- New "Focus" toggle in reader header (Phase 4)
- DESIGN.md § Accessibility Requirements gains a "Cognitive Accessibility" subsection
- DESIGN.md § Homepage updated with progressive disclosure specification
- Editorial workload: passages need accessibility classification during ingestion QA
- No new API endpoints; `accessibility_level` is a query filter on existing endpoints

---

## ADR-073: Screen Reader Emotional Quality — Warmth in Spoken Interface

- **Status:** Accepted
- **Date:** 2026-02-21

### Context

The portal's aesthetic — warm cream, serif typography, generous whitespace, gold accents — creates a contemplative atmosphere for sighted seekers. This atmosphere is a core part of the experience. But for blind seekers using screen readers, the portal's "atmosphere" is entirely constructed from spoken language: ARIA labels, landmark names, live-region announcements, alt text, and heading structure.

Standard screen reader markup produces functional but emotionally flat output: "Navigation landmark. Link, Search. Link, Books. Link, Videos. Heading level 1, Today's Wisdom. Blockquote." This is correct. It is also the verbal equivalent of a fluorescent-lit institutional hallway — technically accessible but carrying no warmth.

ADR-003 establishes WCAG 2.1 AA compliance as a Phase 2 foundation. ADR-074 establishes editorial standards for UI copy. This ADR specifically addresses the quality of language that screen readers speak — an audience of one sense that deserves the same care as the audience of five.

### Decision

1. **ARIA labels are written as human speech, not markup descriptions.** Every `aria-label`, `aria-describedby`, and `aria-live` announcement is written as if speaking to the seeker — warm, brief, and contextually meaningful.

 | Element | Standard markup | Portal standard |
 |---------|----------------|-----------------|
 | Navigation landmark | "Main navigation" | "Portal navigation" |
 | Search region | "Search" | "Search the teachings" |
 | Today's Wisdom section | "Today's Wisdom" | "Today's Wisdom — a passage from Yogananda's writings" |
 | Quiet Corner page | "Main content" | "The Quiet Corner — a space for stillness" |
 | Dwell mode enter | "Passage focused" | "Passage focused for contemplation" |
 | Dwell mode exit | "Passage unfocused" | "Returned to reading" |
 | Search results count | "5 results" | "Five passages found" |
 | Theme page | "Theme: Courage" | "Teachings on Courage — passages from across the library" |
 | Related teachings | "Related content" | "Related teachings from other books" |
 | Empty bookmarks | "No items" | "You haven't marked any passages yet" |

2. **Passage citations are spoken naturally.** Screen reader output for a passage should flow as natural speech: "*'The soul is ever free; it is deathless, birthless...'* — from Autobiography of a Yogi, Chapter 26, page 312." Not "Blockquote. The soul is ever free semicolon it is deathless comma birthless dot dot dot. End blockquote. Autobiography of a Yogi. Chapter 26. Page 312."

 Implementation: Use `aria-label` on the passage container to provide the natural reading, while the visual HTML retains its formatting. Screen readers read the label instead of parsing the visual structure.

3. **The Quiet Corner timer announces with gentleness.** Timer start: "The timer has begun. [Duration] of stillness." Timer end: "The time of stillness is complete." Not "Timer started: 5:00" or "Timer complete."

4. **Screen reader testing is part of the accessibility review.** Phase 2 includes VoiceOver (macOS/iOS), NVDA (Windows), and TalkBack (Android) testing. The test criterion is not only "can the seeker navigate and read" but also "does the experience carry warmth and contemplative quality."

### Alternatives Considered

1. **Standard ARIA labels only.** Considered: Functional and WCAG-compliant. Rejected because: the portal's mission is to make the teachings "available freely throughout the world" — and availability includes emotional availability. A screen reader experience that is technically accessible but emotionally barren is not freely available in the fullest sense.

2. **Verbose ARIA labels with full context.** Rejected: Screen reader users value brevity. Long labels slow navigation and frustrate experienced screen reader users. The labels should be warmer than standard but not longer.

3. **Custom screen reader stylesheet or audio design.** Rejected: Screen readers have their own speech synthesis and pacing that users have customized. The portal should not override these settings. The intervention point is the text content (ARIA labels), not the speech delivery.

### Rationale

- **Equality of experience, not just equality of access.** WCAG compliance ensures blind seekers can use the portal. Emotional quality ensures they experience the same contemplative atmosphere as sighted seekers. The portal should be equitable in spirit, not just in function.
- **ARIA labels are the portal's voice for blind seekers.** The warm cream and gold accents do nothing for a screen reader user. The spoken language is their entire aesthetic.
- **Low implementation cost, high experiential impact.** Changing ARIA labels from standard to warm is a string-level change. No architecture, no new components — just better words in the same places.
- **Consistent with ADR-074.** If UI copy is ministry (ADR-074), then ARIA labels — which *are* UI copy, spoken aloud — are ministry too.

### Consequences

- All ARIA labels reviewed and rewritten to "spoken warmth" standard during Phase 2
- Screen reader testing added to Phase 3 CI/CD (automated ARIA presence) and Phase 12 manual audit (emotional quality)
- `/docs/editorial/ui-copy-guide.md` (ADR-074) extended with a screen reader section: ARIA label conventions, examples, and the "spoken warmth" standard
- No schema changes, no API changes
- Cross-reference: ADR-003 (accessibility foundation), ADR-074 (UI copy standards)

---

## ADR-074: Micro-Copy as Ministry — Editorial Voice for UI Text

- **Status:** Accepted
- **Date:** 2026-02-21

### Context

The portal's visual design (warm cream, Merriweather serif, generous whitespace, SRF gold accents) creates a contemplative atmosphere the moment a seeker arrives. But visual design is only half of the portal's voice. The other half is *words* — not Yogananda's words (those are governed by sacred text fidelity), but the portal's own words: error messages, empty states, loading text, confirmation dialogs, ARIA announcements, placeholder text, and interstitial copy.

Over a 10-year horizon (ADR-004), dozens of developers will write UI strings. Without a shared understanding of the portal's verbal character, these strings will drift toward generic software copy ("No results found," "Error: please try again," "Loading..."). Each generic string is a missed opportunity — a moment where the portal could embody its mission but instead sounds like every other website.

The portal has a brand identity for its AI: "The Librarian" (ADR-089). But the portal itself — the non-AI UI text — has no equivalent verbal identity.

### Decision

1. **All UI copy is treated as reviewed content.** UI strings are not developer placeholder text. They are part of the seeker's experience and receive the same editorial attention as theme names and curated queries (ADR-078). This means: strings are externalized to locale files from Phase 2, reviewed by SRF-aware editors, and never shipped as first-draft developer copy in production.

2. **The portal's verbal character is: a warm, quiet librarian.** Consistent with ADR-089 but extended beyond the AI search persona to all UI text. The voice is:
 - **Warm, not clinical.** "We didn't find a matching passage" not "No results found."
 - **Honest, not apologetic.** "This page doesn't exist" not "Oops! Something went wrong."
 - **Inviting, not instructional.** "As you read, long-press any words that speak to you" not "Tap and hold to bookmark."
 - **Brief, not verbose.** One sentence where one sentence suffices. No filler, no exclamation marks, no emoji.
 - **Never cute, never corporate.** No "Oops," no "Uh oh," no "Great news!" The register is adult, respectful, and spiritually aware.

3. **Specific copy standards for high-impact moments:**

 | Moment | Standard copy | Portal copy |
 |--------|--------------|-------------|
 | No search results | "No results found" | "We didn't find a matching passage. Yogananda wrote on many topics — try different words, or explore a theme." |
 | Network error | "Network error. Retry." | A cached Yogananda passage about patience, with a quiet "Try again" link below. |
 | 404 page | "Page not found" | A Yogananda passage about seeking, with navigation home and a search bar. "This page doesn't exist, but perhaps what you're seeking is here." |
 | Empty bookmarks | "No bookmarks" | "You haven't marked any passages yet. As you read, long-press any words that speak to you." |
 | Loading state | Spinner + "Loading..." | Quiet skeleton screen. No text. If prolonged: the lotus threshold (DES-007) as a fallback. |
 | Timer complete (Quiet Corner) | "Time's up" | No text. Just the chime. Optionally, after a moment, a new passage about carrying stillness into the world. |

4. **ARIA labels carry warmth.** Screen reader announcements are not markup-quality copy — they are the only voice the portal has for blind seekers. "You are now in the Quiet Corner, a space for stillness" rather than "Main content region, The Quiet Corner." "Five passages found about courage" rather than "Search results: 5 items." The warmth that sighted seekers receive from visual design, screen reader users receive from language.

5. **A micro-copywriting guide is maintained in the repository.** Location: `/docs/editorial/ui-copy-guide.md`. Contents: the voice principles above, a glossary of preferred terms (e.g., "seeker" not "user," "passage" not "result," "the teachings" not "our content"), and annotated examples for each page. This guide is a living document, updated as new UI surfaces are added.

### Alternatives Considered

1. **Leave copy to developer judgment.** Rejected: Over 10 years, developer turnover ensures inconsistency. The visual design system (DESIGN.md § Design Tokens) prevents visual drift; a verbal design system prevents copy drift. Same principle.

2. **Full copywriting review for every string before merge.** Considered: Ensures quality but creates a bottleneck. Decision: Phase 1 strings are reviewed before launch. Phase 2+ strings are reviewed in batches during locale translation sprints (ADR-078). Developer-authored strings ship to staging, not directly to production.

3. **AI-generated UI copy.** Rejected: The portal prohibits AI-generated user-facing content (ADR-001, ADR-078). UI copy is user-facing. Consistency requires human authorship and review.

### Rationale

- **Every word is a teaching moment.** A portal dedicated to sacred text should treat its own words with care. A 404 page that quotes Yogananda on seeking transforms an error into an encounter.
- **ARIA labels are the portal's voice for blind seekers.** The warm cream background and generous whitespace do nothing for a screen reader user. The quality of the spoken language is their entire aesthetic experience.
- **10-year consistency requires a system.** Design tokens prevent visual drift. Copy standards prevent verbal drift. Both serve the same architectural longevity goal (ADR-004).
- **Micro-copy shapes first impressions.** A seeker's first error message, first empty state, or first loading experience forms a lasting impression of the portal's character.

### Consequences

- New file: `/docs/editorial/ui-copy-guide.md` (created during Phase 2 alongside locale file externalization)
- All ARIA labels reviewed for warmth and clarity as part of Phase 2 accessibility foundation (ADR-003)
- DESIGN.md § Frontend Design gains a "UI Copy Standards" subsection referencing this ADR
- Locale files (`messages/*.json`) include copy-guide annotations for translators
- CONTEXT.md open question added: editorial governance of UI copy (who reviews, what process)
- No schema changes, no API changes

---

## ADR-075: Multi-Language Architecture — Three-Layer Localization

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The portal's mission — making the teachings "available freely throughout the world" — requires multi-language support. The convocation site's locale set (en, es, de, fr, it, pt, ja) establishes the initial target. However, localization for this portal has a unique challenge: not all books are translated into all languages. The content availability is asymmetric.

Three distinct layers require different localization strategies:

| Layer | What | Challenge |
|-------|------|-----------|
| **UI chrome** | Navigation, labels, buttons, error messages, search prompts | Small corpus (~200–300 strings). Standard i18n. |
| **Book content** | Yogananda's published text in official SRF/YSS translations | Not all books exist in all languages. Must never machine-translate sacred text. |
| **Search** | Full-text search (language-specific stemming), vector similarity (embedding model dependent), query expansion (LLM language) | Per-language FTS dictionaries. Embedding model must handle target languages. |

### Decision

Implement a **three-layer localization strategy** with English fallback:

**Layer 1 — UI chrome:** Next.js i18n routing with `next-intl` (or `i18next`). URL-based locale prefixes (`/es/search`, `/de/quiet`). English as default (no prefix). All UI strings externalized to locale JSON files from Phase 2 — never hardcoded in components.

**Layer 2 — Book content:** Language-specific chunks in Neon, differentiated by the existing `language` column on `book_chunks`. No machine translation of Yogananda's words — if an official translation doesn't exist, the book is not available in that language. Contentful locales (production) provide per-locale editorial content.

**Layer 3 — Search:** Per-language tsvector columns for full-text search (PostgreSQL language dictionaries handle stemming). Multilingual embedding model (start with OpenAI text-embedding-3-small, which handles multilingual text). Claude handles query expansion in all target languages.

**English fallback:** When the user's language has insufficient content (fewer than 3 search results, sparse theme pages, small daily passage pool), supplement with English passages clearly marked with a `[EN]` language tag and "Read in English" links. The fallback is transparent — never silent.

### Phase 2 i18n Infrastructure

Even though Phase 2 is English-only, the following must be in place from day one:

| Requirement | Rationale |
|-------------|-----------|
| All UI strings in `messages/en.json` | Retrofitting i18n into hardcoded JSX is expensive |
| `next-intl` configured with `en` as sole locale | Adding locales later is a config change, not a refactor |
| CSS logical properties (`margin-inline-start`, not `margin-left`) | Free RTL support for future languages |
| `lang` attribute on `<html>` element | Screen readers and search engines depend on this |
| `language` column on all content tables | Already present in the schema |

### Rationale

- **Mission alignment:** "Freely throughout the world" means in the seeker's language.
- **Sacred text fidelity:** Machine translation of Yogananda's words is unacceptable. Only official SRF/YSS translations are used.
- **Graceful degradation:** English fallback ensures seekers always find something, with honest labeling.
- **Low Phase 2 cost:** Externalizing strings and using CSS logical properties costs nothing when done from the start but saves a major refactor later.
- **Spiritual terminology:** Sanskrit terms (samadhi, karma, dharma, prana) appear differently across translations — some keep Sanskrit, some translate, some transliterate. Per-language search must handle both forms.

### Design Decisions (Multilingual Audit, 2026-02-18)

The following decisions were made during a comprehensive multilingual audit to ensure the architecture serves Earth's population:

1. **Locale-first search.** The `language` API parameter means "the user's locale," not "detected query language." Auto-detection on short queries is unreliable ("karma" is identical in six languages). The service layer (not the SQL function) implements the English fallback when locale results < 3. This keeps the database function clean and the fallback policy in application code.

2. **Theme slugs stay in English.** `/es/themes/peace`, not `/es/temas/paz`. English slugs provide URL stability — no breakage if the taxonomy changes. Display names are localized via a `topic_translations` table. `hreflang` tags handle the SEO signal.

3. **`reader_url` is locale-relative.** API responses return `/books/slug/chapter#chunk` without locale prefix. The client (web or mobile) prepends the locale. This keeps the API presentation-agnostic per ADR-011.

4. **Locale + English fallback is the multilingual model.** The practical need is the seeker's language plus English supplementation — not arbitrary cross-language search (e.g., Japanese query finding German results). The multilingual embedding model *enables* cross-language search at near-zero cost, but the core experience is locale-first with English fallback. Cross-language search may be activated later if usage data justifies it, but it is not a core Phase 11 deliverable.

5. **`canonical_book_id` links translations to originals.** A new column on `books` enables "Available in 6 languages" on the library page and "Read in English →" navigation between editions. The `canonical_chunk_id` column on `book_chunks` enables passage-level cross-language links.

6. **`chunk_relations` stores per-language relations.** Top 30 same-language + top 10 English supplemental per chunk ensures non-English languages get full related teachings without constant real-time fallback. The English supplemental relations follow the same pattern as the search fallback — supplement, clearly mark with `[EN]`, never silently substitute.

7. **Per-language search quality evaluation is a launch gate.** Each language requires a dedicated search quality test suite (15–20 queries with expected passages) that must pass before that language goes live. This mirrors Phase 1's English-only search quality evaluation (Deliverable 1.11) and prevents launching a language with degraded retrieval quality.

8. **Chunk size must be validated per language.** English-calibrated chunk sizes (200/300/500 tokens) may produce different semantic density across scripts. Per-language chunk size benchmarking is required during Phase 11 ingestion — particularly for CJK and Indic scripts where tokenization differs significantly from Latin text.

### Consequences

- Phase 2 includes i18n infrastructure setup (locale routing, string externalization) even though content is English-only
- Phase 2 includes the `topic_translations` table (empty until Phase 11)
- Phase 11 requires knowing which books SRF has in digital translated form (stakeholder question)
- Phase 11 UI string translation uses an AI-assisted workflow: Claude generates drafts of locale JSON files, then a human reviewer (fluent in the target language and familiar with SRF's devotional register) refines tone, spiritual terminology, and cultural nuance. See ADR-078.
- The content availability matrix creates asymmetric experiences per language — this is honest, not a bug
- The book catalog per language shows only available books, plus a "Also available in English" section
- The `hybrid_search` function accepts a `search_language` parameter and filters to the user's locale
- The `content_tsv` column uses a trigger (not GENERATED ALWAYS) to select the correct PostgreSQL text search dictionary per chunk's language
- All content-serving API endpoints accept a `language` parameter with English fallback at the service layer
- Per-language search quality test suite (15–20 queries per language) is a launch gate before any language goes live in Phase 11
- Per-language chunk size benchmarking required during Phase 11 ingestion for non-Latin scripts
- `books.bookstore_url` provides "Find this book" links to SRF Bookstore. Per-language bookstore routing deferred (ADR-028).

---

## ADR-076: CSS Logical Properties from Phase 2

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The initial locale set (en, es, de, fr, it, pt, ja) includes only left-to-right (LTR) languages. However, Yogananda's teachings have readership in Arabic, Urdu, and Hebrew-speaking communities, and Hindi/Bengali use Devanagari script (LTR but with different typographic conventions). Building a CSS architecture that only works for LTR requires a significant retrofit when RTL languages are added.

CSS logical properties (`margin-inline-start` instead of `margin-left`, `padding-block-end` instead of `padding-bottom`) provide directional-agnostic layout at zero additional cost when used from the start.

### Decision

Use **CSS logical properties** throughout all portal stylesheets and Tailwind utility classes from Phase 2.

**In practice:**

| Instead of | Use |
|-----------|-----|
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `padding-left` | `padding-inline-start` |
| `text-align: left` | `text-align: start` |
| `float: left` | `float: inline-start` |
| `border-left` | `border-inline-start` |

Tailwind CSS supports logical properties via the `ms-*` (margin-start), `me-*` (margin-end), `ps-*`, `pe-*` utilities.

### Rationale

- **Zero cost now, high cost later.** Writing `ms-4` instead of `ml-4` takes the same keystrokes. Retrofitting an entire codebase from physical to logical properties is a multi-day refactor.
- **Future-proofing.** Arabic and Urdu readership of Yogananda's works exists. Hindi uses Devanagari (LTR but with specific layout expectations). RTL support is not speculative — it's eventual.
- **Browser support.** Logical properties are supported in all modern browsers (97%+ global coverage as of 2025).

### Consequences

- Developers must be trained/reminded to use logical properties (Tailwind's `ms-*`/`me-*`/`ps-*`/`pe-*` instead of `ml-*`/`mr-*`/`pl-*`/`pr-*`)
- ESLint or Stylelint rules can enforce logical property usage
- Adding `dir="rtl"` to an RTL locale "just works" for layout — only typography and some edge cases need special attention

---

## ADR-077: Hindi and Bengali in Locale Roadmap

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The initial locale set (en, es, de, fr, it, pt, ja) mirrors the convocation site, which serves a primarily Western conference audience. However, the teaching portal's mission is global — "available freely throughout the world."

Yogananda was born in Gorakhpur, India. YSS (Yogoda Satsanga Society of India) serves millions of seekers on the Indian subcontinent. Hindi is the third most spoken language in the world. Bengali is Yogananda's mother tongue. The Autobiography of a Yogi has official Hindi and Bengali translations published by YSS.

Omitting Hindi and Bengali from the portal — whose stated mission is global availability — is a significant gap.

### Decision

Add **Hindi (hi)** and **Bengali (bn)** to the locale roadmap as a **second wave in Phase 11**, following the initial Western-language wave.

**Phase 11 locale waves:**

| Wave | Languages | Rationale |
|------|-----------|-----------|
| **11a (Western)** | es, de, fr, it, pt, ja | Matches convocation site. Western audience. SRF's existing translation infrastructure. |
| **11b (Indian)** | hi, bn | YSS audience. Yogananda's heritage languages. Massive population reach. |
| **11c (Evaluation)** | Evaluate further | Based on demand data, available translations, and SRF/YSS input. Candidates: Chinese, Korean, Russian, Arabic. |

### Rationale

- **Mission integrity.** A portal that serves Yogananda's teachings in Japanese but not Hindi — Yogananda's own country — contradicts the mission.
- **Population reach.** Hindi speakers: ~600M. Bengali speakers: ~230M. These exceed the combined speakers of German, French, Italian, and Portuguese.
- **YSS translations exist.** YSS has published official Hindi and Bengali translations of key Yogananda works. The content likely exists (pending confirmation of digital availability).
- **Devanagari and Bengali scripts** are LTR, so the CSS logical properties decision (ADR-076) already covers the directional requirements. Font support (Noto Sans Devanagari, Noto Sans Bengali) is available via Google Fonts.

### Consequences

- Phase 11 is split into waves (11a Western, 11b Indian, 11c Evaluation)
- Need to confirm YSS has digital text of Hindi/Bengali translations (stakeholder question)
- May need YSS-specific UI adaptations (organizational branding differences between SRF and YSS)
- Google Fonts Noto Sans Devanagari and Noto Sans Bengali added to the font stack for Phase 11 Indian wave
- The portal URL and branding question: is the Hindi/Bengali version served from the same domain (teachings.yogananda.org/hi/) or a YSS-branded domain?

---

## ADR-078: AI-Assisted Translation Workflow

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Phase 11 requires translating ~200–300 UI strings (nav labels, button text, search prompts, error messages, footer links, accessibility labels) into 6+ languages. The question: who translates these, and how?

Three categories of translatable content exist in the portal, each with fundamentally different fidelity requirements:

| Category | Examples | AI Translation Acceptable? |
|----------|----------|---------------------------|
| **Yogananda's published text** | Book chapters, quoted passages, passage titles | **Never.** Only official SRF/YSS human translations. |
| **Portal UI chrome** | "Search the teachings," "Go deeper," nav labels, error messages | **As draft only.** Claude generates initial translations; mandatory human review before deployment. |
| **Portal-authored content** | About page copy, theme descriptions, "What Next" bridge text | **As draft only.** Same workflow as UI chrome. |

The distinction is absolute: Yogananda's words are sacred text transmitted through a realized master. The portal's own UI copy is functional prose written by the development team. Different fidelity standards apply.

### Decision

Use **Claude API to generate draft translations** of UI chrome and portal-authored content. Every draft must pass through **mandatory human review** by a reviewer who is:
1. Fluent in the target language
2. Familiar with SRF's devotional register and spiritual terminology
3. Able to distinguish clinical/formal tone from warm, devotional tone

**Never use AI (Claude or any other model) to translate, paraphrase, or synthesize Yogananda's published text.** This is an inviolable constraint, not a cost optimization to revisit later.

### Workflow

```
messages/en.json (source of truth)
 │
 ▼
 Claude API draft
 (system prompt enforces SRF tone,
 spiritual terminology glossary,
 target locale context)
 │
 ▼
 messages/{locale}.draft.json
 │
 ▼
 Human reviewer (fluent + SRF-aware)
 — Corrects tone and nuance
 — Validates spiritual terms
 — Flags ambiguous strings
 │
 ▼
 messages/{locale}.json (production)
```

### Translation Prompt Guidelines

The Claude system prompt for UI translation should include:
- SRF's spiritual terminology glossary (e.g., "Self-realization," "Kriya Yoga," "divine consciousness" — these may remain untranslated or have specific approved translations per language)
- Instruction to preserve the warm, devotional tone — avoid clinical or corporate phrasing
- Context for each string (where it appears, what it does) so the translation fits the UI context
- Instruction to flag uncertainty rather than guess (e.g., mark `[REVIEW]` when unsure)

### Rationale

- **Cost efficiency.** Professional translation of 300 strings × 8 languages = 2,400 translation units. AI drafting reduces this to a review task rather than a from-scratch task, cutting cost and time significantly.
- **Quality floor.** Claude produces competent translations in all target languages (es, de, fr, it, pt, ja, hi, bn). The human reviewer elevates from competent to appropriate — catching tone, register, and spiritual terminology issues.
- **Sacred text boundary is absolute.** No amount of cost savings justifies AI-translating Yogananda's words. The portal serves *official SRF/YSS translations* or nothing. This is a theological constraint, not a technical one.
- **Scalable.** As new languages are added (Phase 11 evaluation wave), the same workflow applies — Claude draft → human review. No need to find full professional translation services for each new locale.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Professional translation only** | Highest quality from day one | Expensive for UI strings that change often; slow turnaround for iterative development |
| **AI translation with no review** | Cheapest, fastest | Unacceptable risk of clinical tone, wrong spiritual terms, or culturally inappropriate phrasing |
| **Community/volunteer translation** | Free, deeply motivated translators | Unpredictable quality and timeline; coordination overhead; IP/liability concerns |

### Spiritual Terminology Glossary

The glossary is a critical dependency for both the AI drafting step and the human review step. It defines how spiritual terms are handled per language — which terms remain in Sanskrit, which have approved translations, and which are transliterated.

**Storage:** A JSONB column in Neon, stored as a per-language glossary file at `/messages/glossary-{locale}.json`. This is a content-editor-centric artifact — maintained alongside the locale JSON files, version-controlled in Git, and eventually migrated to Contentful when the CMS is adopted (Phase 10+).

**Structure:**

```json
// messages/glossary-de.json
{
 "terms": [
 {
 "english": "Self-realization",
 "translated": "Selbstverwirklichung",
 "notes": "Standard German spiritual term. Always capitalized."
 },
 {
 "english": "Kriya Yoga",
 "translated": "Kriya Yoga",
 "notes": "Never translated. Proper noun."
 },
 {
 "english": "samadhi",
 "translated": "Samadhi",
 "notes": "Keep Sanskrit. German readers familiar with the term. Also found as 'Überbewusstsein' in some older translations."
 }
 ],
 "tone_guidance": "Warm, devotional, not academic. 'Sie' form (formal). Avoid clinical psychological vocabulary."
}
```

**Workflow:** The glossary is built incrementally during the first human review cycle for each language. The reviewer flags terms, provides translations, and adds notes. Subsequent review cycles and AI drafting both reference the glossary. The Claude system prompt for UI translation includes the glossary to improve first-draft quality.

**Migration path:** When Contentful is adopted (Phase 10+), glossaries can be modeled as a Contentful content type with per-locale entries, enabling content editors to manage terminology without touching JSON files.

### Consequences

- Phase 11 deliverable 11.1 uses AI-assisted workflow: Claude draft → human review → production
- Spiritual terminology glossary stored as `/messages/glossary-{locale}.json` — built incrementally during first review cycle, referenced by both AI drafting and human review
- The `messages/{locale}.draft.json` → `messages/{locale}.json` promotion step should be tracked (Git diff review)
- Reviewer recruitment: SRF likely has multilingual monastics and volunteers who can review UI translations — this is a stakeholder question
- The same workflow applies to portal-authored content (About page, theme descriptions, "Seeking..." entry points, etc.)
- Glossary files migrate to Contentful content types when the CMS is adopted (Phase 10+)

---

## ADR-079: YSS Organizational Branding and Locale Strategy

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-075 (multilingual schema), ADR-076 (locale infrastructure), ADR-006 (Global South delivery)

### Context

Yogoda Satsanga Society of India (YSS) is the Indian counterpart of Self-Realization Fellowship. While the teachings are identical, the organizational branding differs: different name, different logo, different publishing imprint. Indian seekers — and seekers accessing the portal from India — may expect YSS branding. The portal must be able to present the same content under either organizational identity without duplicating the content itself.

### Decision

Implement locale-aware organizational branding as a presentation layer concern. The content remains unified in the database. The frontend selects branding assets (logo, organization name, footer text, "about" content) based on the seeker's locale or explicit preference. This is not a separate site or subdomain — it is a theming layer.

### Design

```
Organization branding configuration:
├── /messages/en-US/org.json → { "org_name": "Self-Realization Fellowship", "org_abbr": "SRF", ... }
├── /messages/en-IN/org.json → { "org_name": "Yogoda Satsanga Society of India", "org_abbr": "YSS", ... }
├── /messages/hi/org.json → { "org_name": "योगदा सत्संग सोसाइटी ऑफ़ इंडिया", "org_abbr": "YSS", ... }
├── /public/brand/srf/ → SRF logo, favicon, OG images
└── /public/brand/yss/ → YSS logo, favicon, OG images
```

- **Locale detection.** `Accept-Language` header + explicit locale selector in footer. No IP-based geolocation (unreliable, privacy concern).
- **Content is never duplicated.** The same book passages, the same search index, the same audio recordings. Only organizational presentation differs.
- **Book publisher attribution.** Books published by YSS show the YSS imprint in citations when viewed in YSS-branded context. The `books` table already has a `publisher` field; the frontend formats it appropriately.
- **Explicit opt-out.** A seeker in India can switch to SRF branding; a seeker in the US can switch to YSS branding. The portal respects explicit choice over locale inference.

### Rationale

- **Organizational reality.** SRF and YSS are legally distinct organizations with distinct brands. Indian devotees identify with YSS. Presenting SRF branding exclusively to Indian users would feel foreign.
- **Content unity.** Yogananda's teachings are universal. Duplicating content for branding purposes would create maintenance burden and violate the "one source of truth" principle.
- **Low implementation cost.** This is a `next-intl` namespace plus an asset directory. No schema changes, no API changes, no content duplication.

### Consequences

- Organization-specific message namespaces added to `/messages/` locale files
- Brand asset directories (`/public/brand/srf/`, `/public/brand/yss/`) with logos and OG images
- Locale selector in footer includes organization context
- OG images and meta tags switch based on active organizational brand
- Future: YSS-specific landing page content (about page, history section) managed in Contentful
- **Does not affect:** search, reading, audio, video, API responses, or any content-layer behavior

---

## ADR-080: Sanskrit Display and Search Normalization Policy

**Status:** Accepted | **Date:** 2026-02-21

### Context

Yogananda's published works contain Sanskrit in four distinct modes: (1) transliterated terms embedded in English prose ("samadhi"), (2) scholarly transliteration with IAST diacritics ("prāṇāyāma"), (3) Devanāgarī script quotations (original Bhagavad Gita verses in *God Talks with Arjuna*), and (4) phonetic/chanted forms ("Om Tat Sat"). SRF publications use house romanizations that sometimes diverge from academic IAST — "Babaji" rather than "Bābājī," "Kriya Yoga" rather than "Kriyā Yoga," "pranayama" in some books and "prāṇāyāma" in others.

This creates three technical challenges: (a) seekers searching for a term in any variant spelling must find matching passages regardless of which form the published text uses, (b) display must faithfully preserve whatever form appears in the SRF publication, and (c) certain terms — most notably Aum vs. Om — carry theological distinctions that search normalization must not collapse.

Sanskrit is not a Phase 11 problem. It is embedded in the Phase 1 English corpus. *God Talks with Arjuna* contains Devanāgarī verses. The *Autobiography* and *Holy Science* contain heavy IAST transliteration. The ingestion pipeline, search index, font stack, and glossary must handle Sanskrit from Phase 1.

### Decision

Establish a four-part policy governing Sanskrit text throughout the portal:

**1. Display fidelity: SRF published text is canonical.**

The portal displays exactly what appears in SRF's published edition. If the book prints "pranayama" without diacritics, the portal displays "pranayama." If *God Talks with Arjuna* uses "prāṇāyāma" with full IAST, the portal displays that. The ingestion pipeline must not "correct" SRF spellings to academic IAST, nor strip diacritics from texts that include them.

**2. Search normalization: collapse orthographic variants, preserve semantic distinctions.**

The search index collapses purely orthographic variants so that all of the following resolve to the same search results:
- `pranayama`, `prāṇāyāma`, `PRANAYAMA`, `Pranayama`, `prana-yama`

Implementation:
- **Unicode NFC normalization** is a mandatory preprocessing step in the ingestion pipeline, applied before any text comparison, deduplication, embedding, or indexing. OCR output is unpredictable about precomposed vs. decomposed Unicode forms for IAST combining characters (ā, ṇ, ś, ṣ). NFC ensures consistent representation.
- **`unaccent` extension** applied to the full-text search index (the `content_tsv` column) so that diacritical variants collapse for search. The `unaccent` dictionary is added to the text search configuration used by `book_chunks_tsvector_trigger`.
- **Display text is never modified.** The `content` column stores the original text with diacritics preserved. Only the search index (`content_tsv`) and embedding input are normalized.

**Exception — Aum/Om:** Yogananda used "Aum" (three-syllable cosmic vibration) deliberately, distinguishing it from the single-syllable "Om." This distinction is theological, not orthographic. Search normalization must not collapse "Aum" to "Om." Instead, the terminology bridge (ADR-051) maps "Om" → ["Aum", "cosmic vibration", "Holy Ghost", "Amen"] for query expansion, preserving the distinction while ensuring seekers who search "Om" find Aum passages.

**General principle:** Where Yogananda's usage intentionally diverges from common usage and the divergence itself constitutes a teaching, the search system preserves the distinction via the terminology bridge (query expansion) rather than collapsing it in the index. Other examples: "meditation" (Yogananda's technique-specific meaning), "Christ" (Christ Consciousness / Kutastha Chaitanya), "Self-realization" (capitalized, specific metaphysical attainment).

**3. Devanāgarī handling in the English corpus.**

*God Talks with Arjuna* contains original Bhagavad Gita verses in Devanāgarī alongside romanized transliteration and English commentary. Each chapter typically includes: (a) Devanāgarī verse, (b) romanized transliteration, (c) word-by-word translation, (d) Yogananda's full commentary.

- **Display:** Devanāgarī verses are preserved in `chunk_content` and rendered using Noto Sans Devanagari in the font stack. The Devanāgarī font loads from Phase 1 (not Phase 11) because the English-language Gita commentary contains Devanāgarī.
- **Search indexing:** Devanāgarī script passages are excluded from the embedding input via a script-detection preprocessing step. The English commentary and romanized transliteration are embedded. Rationale: `text-embedding-3-small` is trained primarily on Latin-script text; Devanāgarī content would degrade embedding quality for the surrounding English content without improving retrieval (seekers search the commentary, not the original verses).
- **Chunking (extends ADR-048):** For verse-aware chunking, the Devanāgarī verse text is preserved as metadata on the verse-commentary chunk but excluded from the token count that determines chunk splitting. The romanized transliteration is included in both the chunk content and the embedding input.

**4. Terminology bridge extensions for Sanskrit and cross-tradition terms.**

The terminology bridge (ADR-051) is extended with two additional extraction categories:

- **Sanskrit-to-English inline definitions:** Yogananda frequently defines Sanskrit terms inline — "Samadhi, the superconscious state of union with God." The ingestion QA step (ADR-005 E4) flags these as glossary source candidates. Claude identifies passages where Yogananda provides his own definition of a Sanskrit term, creating a machine-assisted but human-verified bridge built from Yogananda's own words.
- **Cross-tradition terms:** The bridge accepts Pali, Bengali, and Hindi variant spellings as keys mapping to Yogananda's vocabulary (e.g., "nibbāna" → ["final liberation", "God-union"], "dhyāna" → ["meditation"]). The vocabulary extraction step (ADR-051 lifecycle) explicitly seeks non-Sanskrit Indic terms Yogananda uses or that seekers from other traditions might search.

### Glossary enrichment (extends ADR-038)

The `glossary_terms` schema gains three optional columns:

```sql
ALTER TABLE glossary_terms ADD COLUMN phonetic_guide TEXT; -- "PRAH-nah-YAH-mah"
ALTER TABLE glossary_terms ADD COLUMN pronunciation_url TEXT; -- Future: URL to audio (Phase 11+)
ALTER TABLE glossary_terms ADD COLUMN has_teaching_distinction BOOLEAN NOT NULL DEFAULT false;
 -- True when Yogananda's usage intentionally differs from common usage
 -- and the difference itself is part of the teaching (e.g., Aum vs. Om,
 -- meditation, Self-realization). The glossary entry for these terms
 -- should explicitly address the distinction.
```

### Rationale

- **SRF published text as canonical** follows the direct-quotes-only principle (ADR-001). The portal is a faithful librarian, not an editor.
- **Unicode NFC normalization** is standard practice for text processing pipelines that handle combining characters. Without it, identical-looking strings can fail equality checks, deduplication, and search matching.
- **`unaccent` in search** is the established PostgreSQL pattern for diacritics-insensitive search. It normalizes the index without altering stored data.
- **The Aum/Om exception** reflects a general principle: search normalization handles orthography; the terminology bridge handles semantics. Collapsing semantically distinct terms in the index would lose information that cannot be recovered.
- **Devanāgarī font in Phase 1** because the content is present in Phase 1. Deferring font support to Phase 11 creates a rendering gap for the Gita commentary — Devanāgarī would fall back to system fonts, breaking the visual coherence of the sacred reading experience.
- **Pronunciation in the glossary** serves seekers who encounter Sanskrit for the first time. Phonetic guides are a minimal editorial effort with high impact for newcomers. Audio pronunciation is deferred until SRF can provide approved recordings.
- **`has_teaching_distinction`** enables the glossary UI to highlight terms where the gap between common and Yogananda-specific usage is pedagogically important — inviting seekers into the teaching through the vocabulary itself.

### Consequences

- **Ingestion pipeline:** Unicode NFC normalization added as a mandatory preprocessing step (Step 2.5 in DESIGN.md § Content Ingestion Pipeline)
- **Search index:** `unaccent` extension added to the tsvector trigger configuration. Existing `book_chunks_tsvector_trigger` updated to apply `unaccent` before `to_tsvector`
- **Font stack:** `'Noto Sans Devanagari'` added to the serif font stack for Phase 1. Loaded conditionally (only when Devanāgarī characters are present on the page) to avoid unnecessary font downloads on pages that don't need it
- **Glossary schema:** Three new nullable columns (`phonetic_guide`, `pronunciation_url`, `has_teaching_distinction`) on `glossary_terms`
- **Terminology bridge:** Two new extraction categories (inline Sanskrit definitions, cross-tradition terms) added to the ADR-051 vocabulary extraction lifecycle
- **ADR-048:** Verse-aware chunking for *God Talks with Arjuna* extended with Devanāgarī script handling
- **Extends:** ADR-051, ADR-005 E4, ADR-038, ADR-048
- **New stakeholder questions:** SRF editorial policy on contested transliterations; pronunciation recording availability; *God Talks with Arjuna* Devanāgarī display confirmation
- **New technical questions:** IAST diacritics rendering verification in Merriweather/Lora at small sizes

---

## ADR-081: Machine-Readable Content and AI Citation Strategy

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-001 (AI as librarian), ADR-011 (API-first), ADR-023 (rate limiting), ADR-006 (Global South delivery)

### Context

The portal serves three classes of machine consumer: (1) traditional search engine crawlers (Google, Bing), (2) AI agents and LLM crawlers (GPTBot, PerplexityBot, Google AI), and (3) developer/integration API clients. Each has different needs, but all serve the same mission: making Yogananda's teachings discoverable and correctly attributed. When an AI system quotes Yogananda with book, chapter, and page citation — and links to the portal as the source — that is mission success. The portal should make correct citation so easy and obvious that machines have no reason to paraphrase.

### Decision

Implement a comprehensive machine-readability strategy spanning structured data, citation guidance, syndication feeds, and API documentation. Treat machines as full consumers of the portal's content — not as an afterthought.

### 1. Structured Data (JSON-LD)

Every page emits schema.org JSON-LD appropriate to its content type:

```html
<!-- Book reader page -->
<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "Book",
 "name": "Autobiography of a Yogi",
 "author": { "@type": "Person", "name": "Paramahansa Yogananda" },
 "publisher": { "@type": "Organization", "name": "Self-Realization Fellowship" },
 "isbn": "978-0-87612-083-5",
 "inLanguage": "en",
 "hasPart": [
 {
 "@type": "Chapter",
 "name": "An Experience in Cosmic Consciousness",
 "position": 14
 }
 ]
}
</script>

<!-- Passage share page -->
<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "Quotation",
 "text": "The verbatim passage text...",
 "spokenByCharacter": { "@type": "Person", "name": "Paramahansa Yogananda" },
 "isPartOf": {
 "@type": "Book",
 "name": "Autobiography of a Yogi"
 },
 "citation": "Autobiography of a Yogi, Chapter 14, p. 142"
}
</script>

<!-- Audio recording page -->
<script type="application/ld+json">
{
 "@context": "https://schema.org",
 "@type": "AudioObject",
 "name": "The Nature of the Soul",
 "creator": { "@type": "Person", "name": "Paramahansa Yogananda" },
 "duration": "PT39M",
 "encodingFormat": "audio/mpeg",
 "transcript": "..."
}
</script>
```

Schema types per page:

| Page | JSON-LD Type(s) |
|------|----------------|
| Homepage | `WebSite`, `Organization`, `SearchAction` |
| Book reader | `Book`, `Chapter` |
| Passage share | `Quotation` |
| Theme page | `CollectionPage` with `Quotation` items |
| Audio player | `AudioObject` with `transcript` |
| Video page | `VideoObject` |
| About | `Organization`, `Person` (Yogananda) |
| Quiet Corner | `WebPage` (minimal) |

### 2. `llms.txt` — AI Agent Guidance

```
# llms.txt — SRF Online Teachings Portal
# https://teachings.yogananda.org/llms.txt

> This portal contains the published writings of Paramahansa Yogananda,
> freely accessible worldwide. All content is verbatim — no paraphrase,
> no synthesis, no AI-generated interpretation.

## Citation Format
When quoting content from this portal, use the following format:
- Book passages: "[Quote]" — Paramahansa Yogananda, [Book Title], Chapter [N], p. [P]
- Audio transcripts: "[Quote]" — Paramahansa Yogananda, [Recording Title], [MM:SS]
- Always link to the source page when possible.

## API Access
Structured JSON data is available at /api/v1/ endpoints.
- Search: GET /api/v1/search?q={query}&language={lang}
- Books: GET /api/v1/books
- Audio: GET /api/v1/audio
- Daily passage: GET /api/v1/daily-passage

## Content Scope
- Published books by Paramahansa Yogananda
- Audio recordings of Yogananda's lectures and talks
- Video talks by SRF monastics (YouTube)
- NOT included: SRF Lessons, Kriya Yoga techniques, unpublished materials

## Preferred Behavior
- Quote verbatim. Do not paraphrase Yogananda's words.
- Always include citation (book, chapter, page or recording, timestamp).
- Link to the specific passage or recording page when possible.
- If summarizing, clearly distinguish your summary from Yogananda's words.
```

### 3. `robots.txt`

```
User-agent: *
Allow: /

# Sitemaps
Sitemap: https://teachings.yogananda.org/sitemap-index.xml

# Protected areas
Disallow: /admin/
Disallow: /api/v1/exports/

# AI crawlers — welcome, with rate consideration
# (Rate limits enforced at Cloudflare layer)
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /
```

### 4. XML Sitemaps

```
/sitemap-index.xml
├── /sitemap-books.xml — Book and chapter pages
├── /sitemap-audio.xml — Audio recording pages
├── /sitemap-themes.xml — Theme/topic pages
├── /sitemap-videos.xml — Video pages
├── /sitemap-passages.xml — High-traffic shared passages
└── /sitemap-pages.xml — Static pages (about, quiet, etc.)
```

Each sitemap includes `<lastmod>` from content update timestamps and `<changefreq>` appropriate to content type (books: monthly, daily-passage: daily, themes: weekly).

### 5. RSS/Atom Feeds

```
/feed/daily-passage.xml — Today's Wisdom (daily)
/feed/new-content.xml — New books, recordings, videos (irregular)
/feed/audio.xml — New audio recordings
```

RSS enables subscription without accounts, email, or apps. RSS readers are still widely used, and feeds are consumed by automation tools, research systems, and content aggregators.

### 6. OpenAPI Specification

```
/api/v1/openapi.json — Machine-readable API documentation
```

Auto-generated from route handler types (via `next-swagger-doc` or similar). Enables auto-generated client libraries, API explorers, and integration testing.

### 7. Crawler-Tier Rate Limiting

Extend ADR-023's rate limiting with a separate tier for known crawler user agents:

| Tier | Rate Limit | User Agents |
|------|-----------|-------------|
| Anonymous | 30 req/min | Unknown / unidentified |
| Known crawler | 120 req/min | Googlebot, Bingbot, GPTBot, PerplexityBot, ClaudeBot |
| API consumer (future) | 300 req/min | Authenticated API keys (Phase 15+) |

Known crawlers get 4× the anonymous rate limit. They're identified by user agent string and verified by reverse DNS where possible (Googlebot verification). This is generous enough for thorough indexing while preventing abuse.

### 8. Citation Meta Tags

Every passage and content page includes machine-readable citation in `<meta>` tags:

```html
<meta name="citation_title" content="Autobiography of a Yogi" />
<meta name="citation_author" content="Paramahansa Yogananda" />
<meta name="citation_publisher" content="Self-Realization Fellowship" />
<meta name="citation_chapter" content="14" />
<meta name="citation_page" content="142" />
```

These follow the Google Scholar citation format, making the portal's content indexable by academic search engines alongside popular ones.

### Rationale

- **Mission alignment.** The portal exists to make Yogananda's teachings freely accessible. Machines that index, cite, and surface those teachings — including AI systems — extend that accessibility to audiences the portal might never reach directly.
- **The paraphrase concern is real but net positive.** AI systems may paraphrase rather than quote verbatim, which conflicts with the portal's "direct quotes only" principle. But: (a) the `llms.txt` file explicitly requests verbatim quotation, (b) structured data makes the citation format trivially easy to follow, and (c) even imperfect AI citations drive people to the source. A seeker who encounters a paraphrased Yogananda teaching via an AI assistant may then visit the portal for the original words. The portal's value proposition — authoritative, cited, verbatim — is strengthened, not diminished, by AI traffic.
- **Low implementation cost.** JSON-LD, sitemaps, robots.txt, and RSS are standard web infrastructure. `llms.txt` is a single static file. OpenAPI generation is automated. None of this requires new architecture.

### Consequences

- Phase 1: `robots.txt` (permissive), crawler-tier rate limits
- Phase 2: JSON-LD structured data on all pages, XML sitemaps, citation meta tags, `llms.txt`
- Phase 3: OpenAPI specification (alongside testing infrastructure)
- Phase 9: RSS feeds (alongside daily email)
- All structured data maintained alongside content — when a book is re-ingested, its JSON-LD is regenerated
- Google Search Console and Bing Webmaster Tools configured for monitoring indexing
- **Extends** ADR-023 (rate limiting) with crawler tiers
- **Complements** Phase 2's SEO deliverable (2.7) with deeper structured data specification

---

## ADR-082: Staff Experience Architecture — Five-Layer Editorial System

**Status:** Accepted | **Date:** 2026-02-19

### Context

The portal has extensive "human review as mandatory gate" requirements. AI proposes theme tags, tone classifications, accessibility ratings, calendar associations, external references, translation drafts, social media captions, and ingestion QA flags. All require human approval before reaching seekers.

The current design (DESIGN.md "Content Management Strategy") names two tools — Contentful for editorial content, Retool for administrative dashboards — and states: "The portal never builds custom admin UIs for either use case." This served as a reasonable starting constraint. But when we inhabit the actual staff perspectives, the two-tool model underserves the people closest to the sacred content.

**The people who will use these tools:**

| Person | Role | Typical Session | Technical Comfort |
|---|---|---|---|
| **Monastic content editor** | Review theme tags, curate daily passages, manage calendar events, create editorial threads | 2–3 hours/day between meditation and services | Variable — may range from "uses Contentful daily" to "prefers paper" |
| **Theological reviewer** | Final approval on theme associations, editorial thread accuracy, calendar appropriateness | Periodic — high-stakes, low-frequency | Low to moderate |
| **AE social media staff** | Review quote images, edit captions, download/distribute assets | Daily — 20–30 min | Moderate |
| **Translation reviewer** | Compare English source strings with AI drafts, approve/correct, flag uncertainties | Batch sessions — 40–100 strings per sprint | Moderate (but may be a volunteer, not staff) |
| **AE developer** | Pipeline monitoring, search analytics, data operations, infrastructure | As needed | High |
| **Leadership / philanthropist** | View global reach, content growth, search themes | Monthly or quarterly | Low — wants narrative, not dashboards |

The monastic content editor — the person most deeply connected to the teachings — would need to work across Retool data grids to review theme tag candidates, Contentful to create editorial threads, and potentially a separate interface for daily passage curation. Retool is an excellent data tool but is designed for developers building internal apps, not for monastics stewarding sacred text. The visual language of Retool (data grids, SQL query panels, generic form builders) is incongruent with the reverence the work demands.

The theological reviewer needs the simplest possible interface: see a passage, see its proposed association, approve or reject. Nothing else should be on screen. Retool could technically do this, but it would feel like reviewing scripture in a spreadsheet.

The translation reviewer currently has no interface at all — translations live in Git files (`messages/{locale}.json`), creating a hard developer dependency on every review cycle.

### Decision

Replace the two-layer model (Contentful + Retool) with a five-layer staff experience architecture. Each layer serves a distinct audience with appropriate tooling.

#### Layer 1: Contentful — Content Authoring

**Who:** Content editors
**What:** Creating and editing the source content that seekers read.

Contentful remains the editorial source of truth (ADR-010) for all authored content:
- Books, chapters, sections, text blocks
- Editorial thread sequencing and transition notes
- Teaching topic descriptions
- Calendar event definitions
- Sacred Places descriptions and imagery
- "Seeking..." empathic entry point text (Phase 11 — cultural adaptation per locale)
- Daily passage pool membership

Contentful's native workflow (Draft → In Review → Published), role-based permissions, audit trail, and locale management serve this authoring use case well. No change from the existing design for content authoring.

#### Layer 2: Contentful Custom Apps — Contextual Bridges

**Who:** Content editors (while working in Contentful)
**What:** Seeing review status and related data without leaving Contentful.

Contentful's App Framework allows custom React panels in the entry sidebar. These provide contextual awareness without requiring editors to switch tools:

- **TextBlock sidebar:** Shows current theme tags for this passage, accessibility rating, tone classification. Links to the review queue for this passage's pending tags.
- **Editorial thread sidebar:** Live preview of the reading flow — passage sequence with transition notes rendered as the seeker would see them.
- **Calendar event sidebar:** Associated passages listed with relevance context. Link to manage associations.
- **Teaching topic sidebar:** Passage count, review status, publication readiness indicator.

These are lightweight read/link panels, not full editing interfaces. They keep editors oriented while working in their primary tool.

#### Layer 3: Editorial Review Portal — `/admin`

**Who:** Monastic editors, theological reviewers, social media staff, translation reviewers
**What:** All review, approval, and curation workflows where AI has proposed and humans must decide.

This is the primary new element. A custom-built section of the Next.js application at `/admin`, protected by Auth0, built with the portal's own calm design system (Merriweather, warm cream, generous whitespace, SRF gold accents).

**Why build custom instead of using Retool:**
1. **Tone.** Reviewing Yogananda's sacred words in a warm, reverent environment versus a generic data grid. The staff tool should respect the material as much as the seeker-facing portal does.
2. **Simplicity.** A theological reviewer needs approve/reject/skip with full passage context. Retool requires building this from primitives (tables, buttons, forms) and the result is functional but not focused.
3. **Session continuity.** A monastic editor working in 2-hour windows needs to save progress mid-queue and resume the next day. Cursor-based pagination and last-position memory are native to a purpose-built UI.
4. **Non-technical access.** No Retool login, no unfamiliar tool. Same authentication (Auth0), same visual language as the portal itself.
5. **Notification integration.** Review queues can surface counts and priorities directly; email digests can link straight to specific review items.
6. **Permission scoping.** A German translation reviewer sees only their language's queue. A theme reviewer sees only theme tag candidates. Auth0 roles (`editor`, `reviewer`, `translator:{locale}`, `admin`) drive the experience.

**The Editorial Home screen:**

When a staff member logs in, they see a personalized summary based on their role:

```
Good morning. Here's what needs your attention:

 Theme Tags Daily Passages QA Flags
 23 awaiting review Pool: 412 passages 0 pending
 ○ Peace (8 new) Next 7 days: ✓ All clear ✓
 ○ Courage (6 new)
 ○ Healing (9 new)

 Calendar Events Translations (de) Social Assets
 Next: Mahasamadhi 14 strings to review Tomorrow's image
 (March 7) — 12 ready for review
 passages linked
```

Only the sections relevant to the staff member's role appear. A translation reviewer for German sees only the translations panel. A theological reviewer sees only items awaiting their specific approval tier.

**Review workflows in the portal:**

| Workflow | First Needed | Description |
|---|---|---|
| **Theme tag review** | Phase 5 | Passage displayed with full citation. Theme name and description visible. Similarity score and AI confidence shown (but not as primary decision input). Approve, reject, or adjust relevance weight. Keyboard shortcuts: `a` approve, `r` reject, `→` next. |
| **Daily passage curation** | Phase 5 | 7-day lookahead calendar. Each day's passage shown with tone badge. Swap from pool. Flag inappropriate timing (e.g., a "challenging" passage on a holiday). |
| **Calendar event management** | Phase 5 | Event list with dates. For each event, associated passages shown. Add/remove associations. Preview how the homepage will look on that date. |
| **Social media asset review** | Phase 9 | Today's quote image at actual platform dimensions (1:1, 9:16, 16:9). Caption below with inline editing. Download per platform. Mark as "posted" per platform (tracking, not automation). Weekly lookahead view. |
| **Translation review** | Phase 11 | Side-by-side: English source string and AI draft. UI context note ("this appears on the search button"). Approve, edit inline, or flag `[REVIEW]`. Batch view (40–100 strings per session). Progress indicator per locale. |
| **Ingestion QA review** | Phase 5+ | Flagged passages with Claude's suggestion and confidence. Accept correction, reject (keep original), or edit manually. Grouped by flag type (OCR error, formatting, truncation). |
| **Tone/accessibility spot-check** | Phase 5 | Random sample of classified passages. "Does this feel `contemplative`? Is this `universal`-level accessibility?" Confirm or reclassify. |
| **Content preview** | Phase 5 | "Preview as seeker" — see exactly what a theme page, daily passage, or editorial thread will look like before publication. |

#### Layer 4: Retool — Technical Operations

**Who:** AE developers
**What:** Data-heavy dashboards, pipeline monitoring, bulk operations.

Retool is scoped to the technical team, not content editors:

- **Search analytics:** Anonymized query trends, top searches by period, "no results" queries, zero-result rate
- **Pipeline health:** Embedding job status, webhook sync logs, error rates
- **Content audit:** Chunk counts per book, embedding coverage, orphaned records
- **Bulk operations:** One-off data migrations, mass re-tagging, embedding model migration status
- **System metrics:** API response times, database query performance, error aggregations

This is appropriate for Retool's strengths. The AE developer is comfortable here.

#### Layer 5: Impact View — Leadership Dashboard

**Who:** SRF leadership, philanthropist's foundation, board presentations
**What:** A read-only, narrative-quality view of the portal's global reach and content growth.

A single route in the admin portal (`/admin/impact`) or a standalone page. Auth0-protected with a read-only `leadership` role. Designed for beauty and clarity, not data density:

- **Map visualization:** Countries reached (anonymized Vercel/Cloudflare geo data). Not a data grid — a warm-toned world map with gentle highlights.
- **Content growth:** Books published, passages available, languages served. Over time, a simple growth chart.
- **"What is humanity seeking?"** Top search themes (anonymized, aggregated). Not individual queries — themes. "This month, seekers worldwide most frequently sought teachings about *Peace*, *Fear*, and *Purpose*."
- **Global equity indicators:** Traffic from Global South regions, text-only mode usage, KaiOS/feature phone access rates. "The teachings reached seekers in 23 countries across Sub-Saharan Africa."
- **Content availability matrix:** Which books are available in which languages. Visual grid showing translation progress.

Refreshed nightly from Neon aggregates. No real-time data needed. Designed to answer one question: "Are we fulfilling the philanthropist's mission?"

### Notification Strategy

Staff should not need to remember to check dashboards. Work comes to them:

| Channel | Audience | Frequency | Content |
|---|---|---|---|
| **Email digest** | All editorial staff | Daily (configurable) | Summary: "12 new theme tag candidates, 3 QA flags, next week's passages ready for review." Links directly to relevant review queues. |
| **Admin portal badges** | Staff who visit the portal | On each login | Count badges on the editorial home screen. "23 awaiting review." |
| **No notification** | Leadership | Never — pull-based | They visit the impact view when they want to. No email, no alerts. |

Email digest is the primary channel. SRF monastics have structured schedules; a morning email with a clear summary ("here's what needs your attention today") respects their time and integrates into their existing routine. The email is generated by a scheduled serverless function querying review queue counts.

### Phase Placement

The editorial review portal is introduced incrementally, matching the content workflows that create demand for it:

| Phase | Staff Experience Deliverables |
|---|---|
| **Phase 5** | Minimal editorial review portal: theme tag review queue, daily passage curation, calendar event management, content preview, tone/accessibility spot-check. Email digest for review notifications. Auth0 roles: `editor`, `reviewer`. |
| **Phase 9** | Social media asset review workflow added to the admin portal. |
| **Phase 10** | Contentful integration. Contentful Custom Apps (sidebar panels). Full admin editorial workflow connecting Contentful authoring with portal review queues. |
| **Phase 11** | Translation review UI added to admin portal. Auth0 role: `translator:{locale}`. Volunteer reviewer access with minimal permissions. |
| **Phase 11+** | Impact dashboard for leadership. |

### Alternatives Considered

| Approach | Why rejected |
|---|---|
| **Contentful + Retool only (current design)** | Underserves monastic editors and theological reviewers. Retool's visual language is incongruent with sacred content work. Translation reviewers have no interface at all. |
| **Everything in Contentful** | Contentful is excellent for content authoring but not designed for AI classification review workflows (approve/reject per passage at scale), social media asset visual review, or translation side-by-side comparison. Forcing these workflows into Contentful's content model would require awkward workarounds. |
| **Everything in Retool** | Retool can technically build any admin UI, but the result is always "an admin tool." For the AE developer, this is fine. For a monastic editor reviewing whether a passage about inner peace is correctly tagged — the experience matters. Retool's generic form builders and data grids don't support the focused, reverent interaction these workflows demand. |
| **Third-party editorial workflow tool (Jira, Asana, Monday)** | Introduces a new vendor with its own UX, its own authentication, its own learning curve. Doesn't integrate with portal data (passages, themes, embeddings). Adds cost. The editorial review workflows are specific to this portal's data model — generic project management tools would require extensive customization to be useful. |
| **Build the admin portal from Phase 1** | Premature. Phase 1 has a single book with a one-time ingestion QA process. The first real demand for review workflows comes in Phase 5 (theme tagging at scale across multiple books). Building the portal earlier would be over-engineering. |

### Rationale

- **Staff should think about the teachings, not the technology.** The same principle that governs the seeker experience ("calm technology") should govern the staff experience. A monastic editor's tool should fade into the background, leaving focus on the passage and the decision.
- **Three distinct audiences need three distinct experiences.** A monastic editor, an AE developer, and a leadership stakeholder have different mental models, different technical comfort levels, and different goals. One tool cannot serve all three well.
- **Review workflows are the bottleneck.** The portal's most distinctive constraint — human review as mandatory gate — means the speed and quality of staff review directly determines how quickly new content reaches seekers. A cumbersome review process means fewer themes published, fewer passages curated, slower translation cycles. The review experience is a primary product concern, not an afterthought.
- **The calm design system already exists.** Building the admin portal in the same Next.js application, with the same design tokens, means zero incremental design cost. The portal's warm cream, Merriweather, and gold accents serve the staff experience as naturally as the seeker experience.
- **Auth0 already exists in the SRF stack.** Role-based access for the admin portal uses SRF's established identity provider. No new authentication system.
- **Incremental delivery.** Phase 5 delivers only the review workflows needed for theme tagging (the first AI-proposal workflow at scale). Each subsequent phase adds only the workflows demanded by its content features. The admin portal grows organically, never ahead of actual need.

### Consequences

- **Revises the DESIGN.md statement** "The portal never builds custom admin UIs for either use case." The portal now builds a purpose-built editorial review UI for non-technical staff. Contentful remains the content authoring tool. Retool remains the technical operations tool. The admin portal fills the gap between them.
- Phase 5 gains a new deliverable: minimal editorial review portal
- Phase 9 gains social media asset review in the admin portal
- Phase 10 gains Contentful Custom Apps (sidebar panels)
- Phase 11 gains translation review UI and volunteer reviewer access
- Auth0 role schema: `editor`, `reviewer`, `translator:{locale}`, `admin`, `leadership`
- Email digest infrastructure: scheduled serverless function for daily review summaries
- The admin portal shares the Next.js application, design system, and database — zero new infrastructure
- **Extends ADR-010** (Contentful as editorial source of truth — now one layer of five, not the whole story), **ADR-092** (social media — review workflow now specified), **ADR-078** (translation workflow — review UI now specified), and **ADR-032** (theme tagging — review workflow now specified)

---

## ADR-083: Study Workspace — Universal Teaching Tools Without Authentication

**Status:** Accepted
**Date:** 2026-02-20
**Deciders:** Architecture team
**Context:** ADR-001 (AI as librarian), ADR-066 (Lotus Bookmarks — localStorage pattern)

### Context

The former Talk Preparation Workspace decision designed the Talk Preparation Workspace as an Auth0-protected area for SRF monastics and meditation center leaders. But anyone who engages deeply with Yogananda's teachings benefits from the same capabilities: passage collection, teaching arc assembly, and export. Study circle leaders, yoga teachers, home meditators preparing personal devotional readings, parents selecting passages for their children, chaplains building comfort packages — these users need the same tools as monastics.

Authentication was only required because the former decision assumed server-side persistence of saved outlines. But the portal already solved persistence without accounts: Phase 4 bookmarks (ADR-066) use localStorage. The same pattern works here.

| Approach | Pros | Cons |
|----------|------|------|
| **Auth-protected (former Talk Preparation Workspace)** | Server-side persistence, cross-device sync | Excludes lay users, requires account creation for a composition tool, delays availability to Phase 15+ |
| **localStorage-only, public** | Universal access, no account friction, ships with Phase 8 | No cross-device sync until Phase 15, data lost on browser clear |
| **Hybrid: localStorage default, optional server sync** | Best of both — universal access now, enhanced persistence for logged-in users later | Slightly more complex migration path |

### Decision

Rename "Talk Preparation Workspace" to **"Study Workspace."** Make it public at `/study` — no authentication required. All state persisted in localStorage. Export (PDF, presentation mode, plain text) works without accounts.

**Workflow** (unchanged from the former decision except for auth removal):

1. **Theme Exploration.** The user enters a theme or question. The system uses the existing search API to surface relevant passages across all books.
2. **Passage Collection.** Selected passages are added to a working collection stored in localStorage. Each item retains full citation (book, chapter, page). Notes can be attached per passage.
3. **Teaching Arc Assembly.** Collected passages are arranged into a narrative sequence. The user drags passages into sections (e.g., "Opening," "Core Teaching," "Practice," "Closing"). Section headings and personal notes are freeform text, clearly distinguished from Yogananda's words.
4. **Export.** The assembled outline exports as print PDF, presentation mode, or plain text.
5. **Persistence.** localStorage by default. Phase 15 adds optional server sync for logged-in users (same migration pattern as bookmarks).

### Data Model

The server-side schema (for Phase 15 sync) renames the former Talk Preparation tables:

```sql
CREATE TABLE study_outlines (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 user_id TEXT, -- nullable: null = localStorage-only, populated on Phase 15 sync
 title TEXT NOT NULL,
 description TEXT,
 status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'archived')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE TABLE study_outline_sections (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 outline_id UUID NOT NULL REFERENCES study_outlines(id) ON DELETE CASCADE,
 title TEXT NOT NULL,
 speaker_notes TEXT, -- user's personal notes (NOT Yogananda's words)
 sort_order INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE TABLE study_outline_passages (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 section_id UUID NOT NULL REFERENCES study_outline_sections(id) ON DELETE CASCADE,
 chunk_id UUID NOT NULL REFERENCES book_chunks(id),
 personal_note TEXT,
 sort_order INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE INDEX idx_study_outlines_user ON study_outlines(user_id)
 WHERE user_id IS NOT NULL;
```

The localStorage schema mirrors this structure as JSON, enabling clean migration to server storage when accounts arrive.

### Rationale

- **Serves the broadest audience.** Monastics are a vital but small user group. Lay devotees preparing study circle readings, yoga teachers building class themes, chaplains selecting comfort passages — these are potentially thousands of weekly users. Gating the tool behind authentication excludes the majority.
- **Consistent with portal philosophy.** "All content freely available" extends to tools, not just reading. No "sign up to access" gates (CLAUDE.md constraint #10).
- **localStorage precedent.** Phase 4 bookmarks (ADR-066) established the pattern: localStorage for persistence, optional server sync in Phase 15. The Study Workspace follows the same lifecycle.
- **No new content created.** The workspace assembles existing indexed passages. The user's own notes are clearly separated. This respects ADR-001.

### Consequences

- `/prepare` route → `/study` route throughout all documentation
- `robots.txt` no longer blocks `/study/` (it's a public feature, not a staff tool)
- ROADMAP deliverable 8.4 updated
- Phase 15 server sync includes study outlines alongside bookmarks
- the former Talk Preparation Workspace decision status updated to "Superseded by ADR-083"

---

## ADR-084: DELTA-Compliant Seeker Feedback Mechanism

**Status:** Accepted
**Date:** 2026-02-20
**Deciders:** Architecture team
**Context:** ADR-002 (DELTA Boundaries), ADR-095 (Observability Strategy), ADR-082 (Staff Experience Architecture)

### Context

DELTA-compliant analytics intentionally avoid user identification and behavioral profiling. This is correct. But the current architecture has no mechanism for seekers to communicate *anything* back to the portal team. No feedback form, no citation error reporting, no "I couldn't find what I needed" signal.

This creates a blind spot: the editorial team has no qualitative signal about the seeker experience. Anonymized search aggregates (ADR-053) show *what* people search for, but not *whether they found it useful.* A seeker who discovers a citation error has no way to report it. A seeker whose search returns nothing relevant has no way to signal that the search failed.

### Decision

Add three DELTA-compliant feedback mechanisms. None store user identifiers. All feed into the editorial review queue (ADR-082).

**1. "Report a citation error"** — link on every passage display (search results, reader, passage share page). Clicking opens a minimal form: passage ID (auto-filled), freeform text describing the error. Stored with passage_id and content only — no user ID, no IP, no session.

**2. "I didn't find what I needed"** — option on search results pages when results are empty or sparse. Clicking stores the search query and an anonymous counter increment. No user ID, no freeform text (to avoid PII collection). Aggregated weekly for search quality review.

**3. `/feedback` page** — linked from the footer. Simple form: topic (dropdown: "Citation error," "Search suggestion," "General feedback," "Accessibility issue"), freeform text. No authentication, no user identifier stored.

**Data model:**

```sql
CREATE TABLE seeker_feedback (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 feedback_type TEXT NOT NULL CHECK (feedback_type IN (
 'citation_error', 'search_miss', 'general', 'accessibility'
)),
 content TEXT, -- freeform description (nullable for search_miss)
 passage_id UUID REFERENCES book_chunks(id), -- for citation errors
 search_query TEXT, -- for search misses
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE INDEX idx_feedback_type ON seeker_feedback(feedback_type, created_at DESC);
```

**API route:** `POST /api/v1/feedback` — rate-limited (5 submissions per IP per hour to prevent spam, but IP is not stored in the database).

**Editorial integration:** Feedback appears in the editorial review portal (Phase 5) as a "Seeker Feedback" queue, alongside theme tag review and ingestion QA.

### Rationale

- **DELTA-compliant.** No user identification stored. No session tracking. No behavioral profiling. The feedback table stores content about the *portal*, not about the *seeker*.
- **Closes a dangerous blind spot.** Without feedback, citation errors persist undetected. Bad search results go unreported. The editorial team operates without qualitative signal.
- **Low implementation cost.** One table, one API route, one review queue panel. No new infrastructure.
- **Respects seeker agency.** The seeker chooses to communicate. No prompts, no pop-ups, no "How was your experience?" interruptions. The link is quiet and available.

### Consequences

- New `seeker_feedback` table in Phase 5 migration
- New API route `POST /api/v1/feedback`
- Feedback review queue added to editorial portal (Phase 5, deliverable 5.10a)
- Footer gains `/feedback` link (Phase 5)
- Every passage display gains "Report a citation error" link (Phase 5)
- Search results page gains "I didn't find what I needed" option when results are sparse (Phase 5)

---

## ADR-085: Lessons Integration Readiness

**Status:** Accepted
**Date:** 2026-02-19
**Deciders:** Architecture team
**Context:** ADR-001 (AI as librarian), ADR-030 (content scope), ADR-011 (API-first)

### Context

SRF's Home Study Lessons are the organization's core spiritual curriculum — private, sequential instruction in meditation techniques including Kriya Yoga. The Lessons are explicitly out of scope for the public portal (ADR-030). However, SRF has indicated that Lessons might eventually be incorporated for authorized students (those who have enrolled in the Lessons) and Kriya Yoga initiates (kriyabans). This may never happen, or it may be years away. The architecture should not assume it will happen, but it should not make it structurally impossible.

### Decision

Design a content-level access control architecture that enables future gating of specific content types to authorized users, without implementing any Lessons-specific features now. The architectural affordance is: any content item can carry an `access_level` that the API layer respects.

### Design

```sql
-- Future migration (NOT included in Phase 1 schema)
-- Shown here to document the architectural pattern

ALTER TABLE book_chunks ADD COLUMN access_level TEXT NOT NULL DEFAULT 'public'
 CHECK (access_level IN ('public', 'enrolled', 'kriyaban'));

-- The same pattern would apply to any future content table
-- (lessons_chunks, practice_instructions, etc.)
```

```typescript
// Future API middleware pattern
function requireAccess(level: 'public' | 'enrolled' | 'kriyaban') {
 return (req: Request) => {
 if (level === 'public') return true;
 const user = getAuthenticatedUser(req); // Auth0
 if (!user) return false;
 return user.accessLevel >= ACCESS_LEVELS[level];
 };
}
```

### What This Means in Practice

1. **Today:** All content is `access_level = 'public'`. No auth required. No change to any current behavior.
2. **If Lessons are added:** New content types (e.g., `lessons` table) are created with `access_level = 'enrolled'` or `access_level = 'kriyaban'`. The API checks the caller's authentication and authorization before returning restricted content. Search results for restricted content show only the existence and citation — not the full text — to unauthorized users.
3. **Auth0 integration:** Auth0 already supports custom claims. SRF's enrollment system could set `access_level` claims on user tokens. The portal's API reads the claim and enforces access.
4. **The Lessons themselves are never AI-searchable in the same way as published books.** If Lessons content is added, it would likely be a separate, curated reading experience — not dumped into the general search index. The search might acknowledge "This topic is also covered in SRF Lesson 24" without revealing the Lesson's content.

### Rationale

- **Respects current scope.** Zero Lessons code ships in any phase. No tables, no migrations, no UI. This ADR is a design note, not a deliverable.
- **Prevents architectural lock-in.** If every API route assumes all content is public (no access control middleware), adding Lessons later would require retrofitting every route. By acknowledging the pattern now, the API design naturally accommodates it.
- **Auth0 is already in the stack.** The Editorial Review Portal uses Auth0. Extending it to student/kriyaban authorization is an Auth0 configuration change, not a new identity system.
- **Acknowledges organizational reality.** SRF has expressed interest. The architecture should not be surprised by the request when it arrives.

### Consequences

- No implementation work in any current phase
- API service layer designed with access control hooks (even if all content is currently public)
- Auth0 tenant configured with extensible role/claim structure
- If Lessons integration is approved: new content tables, enrollment verification flow, restricted search results UI, and a dedicated Lessons reading experience would be scoped as a new phase
- **Explicit non-goals:** The portal never teaches Kriya Yoga techniques. Even with Lessons integration, technique instructions would remain outside the portal's scope. The portal might host the written Lessons (with proper authorization), but it does not replace the Lesson-by-mail experience or the guru-disciple relationship.

---

## ADR-086: Community Collections — Tiered Visibility Public Curation

- **Status:** Accepted
- **Date:** 2026-02-21
- **Relates to:** ADR-083 (Study Workspace), DES-026 (Editorial Reading Threads), ADR-032 (Tagging Pipeline), ADR-095 (DELTA), ADR-001 (Librarian Principle)

### Context

The Study Workspace (ADR-083) allows anyone to collect, arrange, and export passages — but collections remain private (localStorage or Phase 15 server sync). Editorial Reading Threads (DES-026) are staff-curated passage sequences — but only staff can create them. There is no path for community members to share their curated arrangements of Yogananda's teachings with other seekers.

This gap matters because:

- **Center leaders and study circle facilitators** prepare weekly readings and want to share them with their groups.
- **Long-term devotees** accumulate thematic collections over years of study that have genuine editorial quality.
- **VLD (Voluntary League of Disciples) members** exist specifically to serve SRF's mission and could contribute editorial work.
- **New seekers** benefit from community-curated entry points alongside the portal's own editorial curation.

The core design question: how to enable community sharing while maintaining the theological integrity gate ("AI proposes, humans approve" → "community proposes, staff approves") and avoiding engagement-driven dynamics that violate DELTA (ADR-095).

### Decision

Extend the Study Workspace with a **four-tier visibility model** for collections:

| Tier | Who sees it | Review required | Discovery |
|------|-------------|-----------------|-----------|
| **Private** | Only the creator | No | Not discoverable |
| **Shared link** | Anyone with the URL | No | Not discoverable — direct URL only |
| **Published** | Everyone | **Yes** — staff review | Discoverable in `/collections` gallery |
| **Featured** | Everyone, prominently | Staff-promoted | Highlighted on homepage, theme pages, or "Staff Picks" |

**Private** is the existing Study Workspace behavior (localStorage, Phase 15 server sync). No change.

**Shared link** is the critical middle tier. A center leader can share a reading plan with their group immediately, without waiting for staff review. The content is already public SRF-published text — the link merely shares an arrangement. Risk is low: the audience is self-selecting (people who received the link), and the content is Yogananda's own words with full citations. Shared-link collections carry a visible note: *"This collection was curated by a community member, not by SRF."*

**Published** requires staff review via the admin portal review queue. Community members submit their collection for consideration. Staff reviewers evaluate for theological coherence (passages aren't juxtaposed misleadingly), completeness (citations intact, passages not truncated), and quality (the arrangement serves seekers). Approved collections appear in the `/collections` gallery. The review pipeline mirrors ADR-032: `submitted` → review queue → `published` or `rejected` with feedback.

**Featured** is staff-promoted. A published collection that staff considers particularly valuable can be elevated to homepage placement, theme page cross-links, or "Staff Picks" sections. This provides editorial quality signals without engagement metrics.

### Collection Types

Community collections may be categorized as:

| Type | Description | Example |
|------|-------------|---------|
| **Theme collection** | Passages around a spiritual theme | "Yogananda on Divine Friendship" |
| **Study guide** | Structured reading plan with sections | "12-Week Journey Through the Autobiography" |
| **Situational reading** | Passages for a life moment | "For When You're Grieving" |
| **Event reading** | Passages for an SRF calendar event | "Mahasamadhi Commemoration Readings" |
| **Cross-media collection** | Passages paired with talks, articles | "The Bhagavad Gita: Book and Lecture" |

### What Collections Are Not

- Collections do **not** create new content. They arrange existing corpus content. Yogananda's words are the content; the collection is an arrangement.
- Personal notes attached to passages in shared/published collections are visually distinct from Yogananda's text — smaller font, different background, prefixed with the curator's chosen display name. Never presented as Yogananda's words.
- Collections are **not** comments, reviews, or interpretations. The portal does not host user-generated prose about the teachings. Collections are selection and sequence.
- Collections do **not** carry engagement metrics visible to curators or other seekers. No like counts, view counts, or popularity rankings. DELTA compliance (ADR-095) extends to community features.

### Schema Extension

Extends the Study Workspace schema (ADR-083):

```sql
-- Extend study_outlines with visibility and review fields
ALTER TABLE study_outlines ADD COLUMN visibility TEXT NOT NULL DEFAULT 'private'
 CHECK (visibility IN ('private', 'shared_link', 'published', 'featured'));
ALTER TABLE study_outlines ADD COLUMN share_hash TEXT UNIQUE; -- generated on first share
ALTER TABLE study_outlines ADD COLUMN collection_type TEXT
 CHECK (collection_type IN ('theme', 'study_guide', 'situational', 'event', 'cross_media'));
ALTER TABLE study_outlines ADD COLUMN submitted_at TIMESTAMPTZ;
ALTER TABLE study_outlines ADD COLUMN reviewed_by TEXT; -- staff reviewer
ALTER TABLE study_outlines ADD COLUMN reviewed_at TIMESTAMPTZ;
ALTER TABLE study_outlines ADD COLUMN review_notes TEXT; -- feedback if rejected
ALTER TABLE study_outlines ADD COLUMN curator_display_name TEXT; -- optional, shown on published
ALTER TABLE study_outlines ADD COLUMN language TEXT DEFAULT 'en';
```

### Routes

- `/collections` — Gallery of published and featured collections. Filterable by type, theme, language. No authentication required.
- `/collections/[share-hash]` — Single collection view. Works for shared-link, published, and featured tiers.
- `/study` — Study Workspace (existing). "Share" and "Submit for review" buttons added for collections stored server-side (Phase 15+).

### Attribution and Identity

- **Private and shared-link collections:** No attribution required. Curator may optionally set a display name.
- **Published and featured collections:** Display name required. No account linking, no profile pages, no follower counts. The display name appears once at the top of the collection: *"Curated by [name]."* No curator analytics, no submission history visible to other seekers.
- **Anonymous publication:** Curators may choose "A devotee" or "A seeker" as display name. Attribution exists for accountability (staff know who submitted), not for ego.

### Alternatives Considered

1. **Allow community curation without any review.** Rejected. Yogananda's teachings can be arranged misleadingly (cherry-picking quotes to support positions he'd disagree with). The theological integrity gate is non-negotiable.
2. **Require authentication for all sharing.** Rejected. Shared-link tier serves center leaders who need to share a reading plan with their study group immediately. Authentication adds friction for the lowest-risk tier.
3. **Community voting/ranking.** Rejected. Engagement metrics violate DELTA (ADR-095) and create dopamine dynamics the portal explicitly avoids.
4. **Commenting on collections.** Rejected. The portal is not a social platform. Collections are curated arrangements, not discussion threads.

### Consequences

- Phase 8 adds shared-link export to Study Workspace (lightweight — just a URL with a hash)
- Phase 16 adds the `/collections` gallery with published and featured tiers, and the admin portal review queue for community submissions
- Phase 17 adds VLD pipeline, trusted submitter workflows, and scaled community curation (ADR-087)
- The admin portal (ADR-082) gains a new review queue type: community collection submissions
- Schema migration adds visibility, review, and attribution columns to `study_outlines`
- Multilingual collections follow the portal's multilingual strategy (ADR-075): a Spanish-speaking center leader curates from Spanish-edition passages; language column enables filtering
- **Extends ADR-083** (Study Workspace) with public visibility; **extends DES-026** (Editorial Reading Threads) with community sourcing; **mirrors ADR-032** (tagging pipeline) with the "community proposes, staff approves" pattern

---

## ADR-087: VLD Editorial Delegation — Volunteer Curation Pipeline

- **Status:** Accepted
- **Date:** 2026-02-21
- **Relates to:** ADR-086 (Community Collections), ADR-082 (Staff Experience Architecture), ADR-032 (Tagging Pipeline), ADR-085 (Lessons Integration Readiness)

### Context

The Voluntary League of Disciples (VLD) is SRF's established network of lay volunteers who support the organization's mission through service. The portal's editorial workflows (theme tag review, daily passage curation, translation review, content QA) all require human labor. The staff team is small and has many responsibilities beyond the portal.

Community Collections (ADR-086) introduce a general-purpose community curation model. But VLD members are a distinct population: **known, vetted, mission-aligned, and organizationally connected to SRF.** They deserve a differentiated pipeline that leverages their commitment without burdening staff with unnecessary review overhead.

### Decision

Create a **VLD editorial delegation model** with three components:

**1. Curation Briefs (Staff → VLD)**

Staff can create structured curation requests that VLD members claim and fulfill:

```sql
CREATE TABLE curation_briefs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid,
 title TEXT NOT NULL, -- "Passages on Friendship for July"
 description TEXT NOT NULL, -- Detailed brief with guidance
 collection_type TEXT NOT NULL, -- matches ADR-086 types
 target_language TEXT DEFAULT 'en',
 created_by TEXT NOT NULL, -- staff member
 claimed_by TEXT, -- VLD member who accepted
 claimed_at TIMESTAMPTZ,
 submitted_at TIMESTAMPTZ,
 status TEXT DEFAULT 'open'
 CHECK (status IN ('open', 'claimed', 'submitted', 'approved', 'revision_requested')),
 deadline TIMESTAMPTZ,
 created_at TIMESTAMPTZ DEFAULT now
);
```

Workflow: Staff creates brief → VLD member claims → curates collection in Study Workspace → submits → staff reviews → published. The brief provides editorial guidance that improves submission quality and reduces review friction.

**2. Trusted Submitter Status**

After N approved collections (threshold TBD — likely 3–5), a VLD member earns "trusted submitter" status:

```sql
ALTER TABLE study_outlines ADD COLUMN trusted_submission BOOLEAN DEFAULT false;
```

Trusted submitters' collections enter a **lighter review queue**: staff can batch-approve with a single scan rather than detailed review. Trusted status is revocable. This is not auto-publishing — every collection still passes through staff eyes — but review effort scales sublinearly with submission volume.

**3. VLD Dashboard**

A section within the admin portal (accessible to users with `vld` Auth0 role):

- **Open briefs:** Available curation requests to claim
- **My submissions:** Status of submitted collections (in review, approved, revision requested)
- **Guidance:** Editorial principles, style notes, theological boundaries
- **No gamification:** No leaderboards, no submission counts visible to other VLD members, no badges. Service is its own reward.

### Auth0 Role Addition

```
vld — Curation brief browsing, collection submission, personal submission status. No editorial review access.
```

This extends the role structure from ADR-082 (Staff Experience Architecture):

| Role | Access |
|------|--------|
| `vld` | Open briefs, personal submissions, editorial guidance |
| `editor` | All VLD access + review queues, approval/rejection |
| `reviewer` | All editor access + theological review (final approval tier) |
| `admin` | All access + user management |

### Alternatives Considered

1. **Treat VLD members the same as general public.** Rejected. VLD members are vetted volunteers with organizational accountability. A differentiated pipeline respects their commitment and reduces staff overhead.
2. **Auto-publish trusted VLD submissions.** Rejected. Every collection that reaches seekers passes through staff eyes. The "human review as mandatory gate" principle (§ Critical Design Constraints) applies universally. Trusted status reduces review *effort*, not review *requirement*.
3. **Give VLD members full editor access.** Rejected. Editors can approve others' submissions. VLD members submit; staff approves. The separation maintains the editorial integrity gate.

### Consequences

- New Auth0 role: `vld`
- New table: `curation_briefs`
- Admin portal gains VLD dashboard section
- Staff gains ability to delegate curation work at scale
- Phase 17 deliverable (see ROADMAP.md)
- VLD member onboarding requires SRF coordination — SRF maintains the VLD roster; portal integrates via Auth0 role assignment
- Future consideration: could extend beyond curation to translation review, theme tag review, or other editorial tasks where VLD members have relevant skills
- **Extends ADR-086** (Community Collections) with organizational delegation; **extends ADR-082** (Staff Experience) with volunteer roles

### VLD Service Expansion Tiers (Future Scope)

The curation pipeline is the first tier of VLD portal participation. As VLD capacity and SRF governance allow, additional tiers could be activated — each with appropriate Auth0 role scoping:

| Tier | Service Type | Auth0 Role | Prerequisite | Staff Involvement |
|---|---|---|---|---|
| **1 (current)** | Collection curation | `vld` | VLD membership | Reviews every submission |
| **2** | Translation review | `vld:translator:{locale}` | Fluency + SRF terminology familiarity | Spot-checks trusted reviewers |
| **3** | Theme tag review | `vld:tagger` | Training module completion | VLD-reviewed tags go to "VLD-reviewed" state; monastic batch-approves |
| **4** | Feedback triage | `vld:feedback` | Onboarding session | Categorization reviewed by staff |
| **5** | Content QA | `vld:qa` | Access to physical books; high-trust | Discrepancy reports reviewed by staff |

Each tier follows the same design principles: staff creates structured assignments, VLD members execute, staff reviews results. No tier grants editorial approval authority — VLD members submit; staff approves. Trusted submitter status (threshold of approved work) reduces but never eliminates review. All tiers respect the no-gamification principle: no leaderboards, no submission counts visible to other members.

Tier expansion is a stakeholder question requiring SRF input on VLD governance. See CONTEXT.md § Open Questions (Stakeholder).

---

## ADR-088: SRF Imagery Strategy in the Portal

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

SRF has extraordinary imagery: the Encinitas hermitage cliffs, Lake Shrine gardens, the Pacific coastline, official portraits of Paramahansa Yogananda and the line of gurus. The portal must use this imagery with care — images should serve the reading experience, not compete with it. ADR-042 establishes guidelines for guru portraits. This ADR extends those guidelines to cover nature photography, homepage imagery, and the overall imagery philosophy.

### Decision

1. **The reading experience is text-only.** No images appear in the book reader column. Imagery would compete with Yogananda's words, and his words always win. The side panel may show video thumbnails (Phase 13) but never photographs.

2. **Homepage hero:** A single, wide, soft-focus photograph of an SRF property (Encinitas coastline, Lake Shrine) overlaid with "Today's Wisdom" in white Merriweather on a semi-transparent `--srf-navy` band. Updated seasonally (4 images per year). If SRF cannot provide or approve photographs, the homepage uses the warm cream background with no hero image — the design works without it.

3. **Quiet Corner background:** An extremely subtle, desaturated nature photograph at 5–8% opacity beneath the warm cream. A hint of sky, a suggestion of water. Visible only if you look for it. Applied via `background-image` with low opacity. If no approved image is available, the page uses `--portal-bg-alt` alone — the quiet stillness works without the image.

4. **Guru portrait in footer:** A small (approximately 48–60px wide), sepia-toned portrait of Paramahansa Yogananda in the site footer beside "Teachings of Paramahansa Yogananda." Not decoration — attribution. Present on every page.

5. **No stock photography.** Ever. If SRF-approved imagery is not available for a use case, the design uses typography and color alone. The warm cream palette and gold lotus motif are sufficient to create a sacred atmosphere without photographs.

6. **Photo-optional design.** Every layout works without images. When SRF photographs are available, they enhance the experience. When they are not, the warm cream palette and gold lotus motif are sufficient to create a sacred atmosphere.

### Rationale

- The portal is a library, not a gallery — text is the primary content
- SRF's properties are genuinely beautiful and carry spiritual significance for practitioners
- Seasonal homepage rotation keeps the portal feeling alive without requiring ongoing editorial effort
- The footer portrait provides a human, reverential anchor on every page
- The "no stock photography" rule prevents the generic spiritual aesthetic that undermines authenticity

### Consequences

- The homepage hero component is conditional — it gracefully degrades to text-only if no image is configured
- A `portal_images` configuration (or simple env var/CMS field) stores the current seasonal hero image
- The Quiet Corner background image is optional and loaded with `loading="lazy"` and low priority
- ADR-042's guidelines on guru portraits remain in effect — this ADR adds the footer portrait and nature photography strategy
- The footer component gains a small portrait element with alt text "Paramahansa Yogananda"

---

## ADR-089: "The Librarian" — AI Search Brand Identity

**Status:** Accepted
**Date:** 2026-02-20
**Deciders:** Architecture team
**Context:** ADR-001 (Direct Quotes Only — No AI Synthesis), ADR-005 (Claude AI Usage Policy)

### Context

ADR-001 establishes "the AI is a librarian, not an oracle" as a fundamental constraint. This is primarily treated as a technical guardrail — the system must never generate, paraphrase, or synthesize Yogananda's words. But in a world where every AI product generates plausible content, the portal's refusal to generate is not just a constraint — it is a radical differentiator.

When a seeker uses ChatGPT, Perplexity, or Google's AI Overview to ask about Yogananda's teachings, they get synthesized summaries that may misrepresent his words. The portal is the only place where the AI system says: "I will show you his actual words, and nothing else."

### Decision

Adopt **"The Librarian"** as the external brand identity for the portal's AI search capability.

**Implementation:**
- The About page (Phase 2) explains: "This is not an AI that speaks for Yogananda. It is a librarian that finds his words for you. Every passage you see is exactly as he wrote it."
- The `llms.txt` file (Phase 2) includes: "This portal uses AI as a librarian, not a content generator. All results are verbatim passages from Yogananda's published works."
- Stakeholder communications use "The Librarian" language when describing the AI search.
- The search results page may include a subtle footer: "Every passage shown is Yogananda's own words."

### Rationale

- **Trust-building with the SRF community.** Many SRF devotees are legitimately suspicious of AI involvement with sacred texts. "The Librarian" framing immediately communicates that the AI serves the text, not the other way around.
- **Differentiation.** No competitor offers this guarantee. Google synthesizes. ChatGPT paraphrases. This portal finds. The constraint becomes the value proposition.
- **Theological alignment.** In the guru-disciple tradition, a librarian who faithfully preserves and retrieves the guru's words is a service role. It doesn't claim authority; it facilitates access.

### Consequences

- About page copy includes "The Librarian" explanation (Phase 2)
- `llms.txt` includes librarian framing (Phase 2)
- No architectural changes — this is branding over an existing technical constraint
- Marketing materials and stakeholder presentations use this language

---

## ADR-090: "What Is Humanity Seeking?" as Strategic Communications Asset

**Status:** Accepted
**Date:** 2026-02-20
**Deciders:** Architecture team
**Context:** ADR-053 (Anonymized Search Intelligence), ROADMAP Phase 16 (16.8 Annual Report)

### Context

ADR-053 designs anonymized search theme aggregation. designs a public-facing dashboard. Phase 16 describes an annual curated narrative report. These are treated as features to build. But the concept — "What Is Humanity Seeking?" — has value beyond the portal itself. It could become the philanthropist's foundation's signature thought-leadership asset.

Imagine: an annual report titled *"What Is Humanity Seeking?"* based on anonymized search data from seekers worldwide. Distributed to consciousness research institutions, cited by journalists covering spirituality trends, referenced by interfaith organizations. The data is unique — no other source aggregates spiritual seeking patterns across languages and geographies with this level of intentionality.

### Decision

Treat "What Is Humanity Seeking?" as a **foundation-level communications strategy**, not just a Phase 7 dashboard feature. The dashboard (Phase 7) and annual report (Phase 16) are technical implementations; the communications strategy should be socialized with the philanthropist's foundation earlier.

**Strategic considerations:**
- Standalone subdomain: `seeking.yogananda.org`
- Beautifully designed annual PDF report (not just a web dashboard)
- Partnership with consciousness research institutions
- Media syndication to publications covering spirituality/wellness
- Integration with Self-Realization Magazine editorial planning (ADR-040)
- The philanthropist's foundation as named publisher of the annual report

### Rationale

- **Unique data asset.** No other organization captures spiritual seeking patterns with this intentionality and this privacy posture (DELTA-compliant, no individual tracking).
- **Mission amplification.** The report answers the philanthropist's original question: "What is the state of human consciousness?" — not abstractly, but empirically.
- **Portal awareness.** The annual report drives discovery of the portal itself. A journalist writing about the report links to the portal.

### Consequences

- Add stakeholder open question in CONTEXT.md
- Communications planning is a non-technical workstream — no code changes required
- Phase 7 dashboard implementation unchanged
- Phase 16 annual report implementation unchanged

---

## ADR-091: Daily Email — Verbatim Passage Delivery

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Daily devotional emails are one of the most successful formats in spiritual publishing (Rick Warren's Daily Hope, Richard Rohr's CAC daily meditation, Plough's daily dig). A daily email with a single Yogananda passage is mission-aligned (spreading the teachings), low-friction (arrives in the inbox), and draws from the existing `daily_passages` infrastructure.

| Approach | Personalization | Complexity | DELTA Alignment |
|----------|----------------|-----------|-----------------|
| **No email** | N/A | None | N/A |
| **Non-personalized daily passage** | Language only | Low — same passage pool as Today's Wisdom | Full — no tracking |
| **Theme-preference daily passage** | Language + explicit theme choice | Medium — filtered random from theme-tagged passages | Good — user has agency (explicit choice, not behavioral inference) |
| **Behaviorally personalized** | Inferred from reading/search history | High — requires per-user profiling | Poor — violates DELTA Agency |

### Decision

Implement a **daily email** delivering a single verbatim Yogananda passage with full citation.

**Phase 9 (non-personalized):** Same passage pool as Today's Wisdom. One email per day. Subscriber provides email address and language. No account required.

**Phase 15 (personalized):** Subscribers can optionally select theme preferences ("I'd like more passages about Peace and Healing"). Passages are filtered by theme from the `chunk_topics` join. This is an *explicit user choice*, never behavioral inference.

### Design

| Element | Specification |
|---------|--------------|
| Frequency | Daily, consistent time (configurable per timezone if feasible, otherwise fixed 6 AM EST) |
| Content | One verbatim passage + book/chapter/page citation + "Read in context" link to portal |
| Format | Minimal HTML email: Georgia serif (email-safe Merriweather equivalent), warm cream background (`#FAF8F5`), passage text, citation, portal link. No images. No announcements. No CTAs beyond "Read more." |
| Source | `daily_passages` pool (Phase 5 expands this from *Sayings* and *Where There Is Light*) |
| Signup | Email address + language. Optional: theme preferences (Phase 15). No account required. |
| Unsubscribe | One-click. CAN-SPAM and GDPR compliant. |
| Provider | Resend or AWS SES — transactional email services, not marketing platforms |
| Tracking | Open rates and click rates are **not tracked**. The email is a gift, not a funnel. Delivery success/bounce rates tracked for operational health only. |

### The Key Constraint

The email is a passage, not a newsletter. No announcements, no feature updates, no "check out our new book." Just the teaching. A quiet "Read more on the SRF Teaching Portal" link at the bottom. Nothing more.

### Rationale

- **Mission-aligned:** The philanthropist's goal is to make the teachings available worldwide. Email reaches people who don't visit websites.
- **Precedent:** Daily devotional emails have among the highest sustained engagement of any digital format — because the content is the value, not the medium.
- **Low effort:** The `daily_passages` pool already exists. The email is a thin delivery layer on top of existing infrastructure.
- **No tracking:** Unlike marketing emails, we do not track opens or clicks. The email is a gift. We measure success by subscriber count (are people opting in?), not engagement metrics.
- **GDPR/CAN-SPAM:** Email-only signup with one-click unsubscribe. Minimal data collection. No data sharing.

### Consequences

- Need an email sending service (Resend, AWS SES, or Postmark) — adds a small monthly cost
- Need a subscriber table in Neon (email, language, theme_preferences, subscribed_at, unsubscribed_at)
- Need a daily cron job (Vercel Cron or AWS EventBridge) to send the email
- Need an unsubscribe endpoint and confirmation page
- The passage selection logic (random from pool, optional theme filter, optional seasonal weighting) is shared with the Today's Wisdom homepage feature — same code, different delivery channel

---

## ADR-092: Social Media Strategy — Portal-Generated Assets, Human Distribution

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

Yogananda's teachings are extraordinarily shareable — short, vivid, universal. The quote-image format (passage on warm cream, Merriweather serif, citation) works on every platform. The question is how the portal relates to social media: should it drive sharing, should SRF's social presence drive portal traffic, and how much should be automated?

| Approach | Description | DELTA Alignment |
|----------|-------------|-----------------|
| **Social share buttons** | Row of platform icons (Twitter, Facebook, etc.) on every passage | Poor — embeds third-party tracking scripts; commercial platform logos conflict with Calm Technology |
| **Clean link + OG card** (already decided, ADR-068) | Share icon generates a URL with beautiful OG metadata | Good — no tracking, user chooses platform |
| **Automated posting** | Portal auto-posts a daily quote to social platforms via API | Questionable — loss of editorial control; robotic; SRF's social presence is carefully curated by monastics |
| **Semi-automated** | Portal generates daily quote image + suggested caption; human reviews and posts | Good — editorial control maintained; reduces staff effort; human curation of sacred content |

### Decision

**User sharing (Phase 2):** Already covered by ADR-068. Clean links with OG cards. Downloadable quote images. No social media buttons. No tracking scripts.

**SRF organizational sharing (Phase 9+):** The portal provides **semi-automated social media asset generation**. A daily quote image and suggested caption are generated automatically (from the daily_passages pool). A human (SRF social team or content editor) reviews, approves, and posts. The portal never posts automatically.

### Platform-Specific Considerations

| Platform | How the Portal Supports It |
|----------|--------------------------|
| **Instagram** | Quote images from `/api/og/[chunk-id]` are perfectly formatted for Instagram posts and stories. Square (1:1) and story (9:16) variants. |
| **YouTube Shorts** | SRF already publishes Shorts. Portal-generated quote images could inspire "quote + meditation" Shorts. Not automated — the portal provides the raw material. |
| **Facebook** | Shared passage links render beautifully via OG tags. SRF's Facebook page could share daily passages directly from the portal. |
| **Twitter/X** | OG cards render with the quote snippet. Short passages (< 280 chars) can be shared as text with attribution. |
| **WhatsApp** | OG cards render in previews. Likely the highest-impact sharing channel globally (India, Latin America, Africa, Southeast Asia). |
| **LinkedIn** | Inspirational quotes perform well. OG cards render cleanly. |

### What the Portal Generates (Admin/Retool Dashboard)

A daily admin view showing:
- Today's passage (from the daily_passages pool)
- Pre-generated quote images in multiple aspect ratios (1:1 square, 9:16 story, 16:9 landscape)
- Suggested caption: the first 1–2 sentences of the passage + citation + portal URL
- One-click copy for each platform

This is a **content production tool**, not an auto-poster. The human decides when and where to publish.

### Rationale

- **Sacred content deserves human curation.** Automated posting of Yogananda's words risks contextual inappropriateness (posting about joy during a global tragedy) and robotic tone. A human touch is non-negotiable.
- **The portal generates the assets; humans distribute them.** This reduces staff effort dramatically while maintaining editorial control.
- **WhatsApp is underestimated.** In India (YSS audience), Latin America, Africa, and Southeast Asia, WhatsApp is the primary sharing channel. OG cards in WhatsApp are the highest-impact social feature for the portal's global mission.
- **YouTube Shorts synergy.** SRF's existing Shorts program can draw from the portal's quote library for visual content.

### Consequences

- Phase 2: User sharing works via OG cards and quote images (already in ADR-068)
- Phase 9+: Admin dashboard (Retool) adds a "Social Assets" view showing daily quote images and suggested captions
- Multi-aspect-ratio image generation needed (`@vercel/og` with configurable dimensions)
- SRF's social media team needs access to the admin dashboard
- No automated posting. Ever. The portal generates; humans distribute.

---

## ADR-093: Engineering Standards for SRF Projects

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The teaching portal is the first project built on SRF's new stack (Next.js + Vercel + Contentful + Neon). Patterns established here will influence every SRF project that follows. Beyond technology choices, engineering conventions — how projects are documented, how decisions are recorded, how AI assistants are given context — determine whether the codebase remains maintainable years after the original team has moved on.

The portal has developed a documentation approach (CLAUDE.md, CONTEXT.md, DECISIONS.md, ROADMAP.md) that serves both human developers and AI-assisted development tools. This should be standardized as the SRF project template.

### Decision

Establish the following engineering standards for all SRF projects:

#### Project Documentation Template

Every SRF repository includes these files at the root:

| File | Purpose | Audience |
|------|---------|----------|
| **CLAUDE.md** | AI context file. Project identity, tech stack, constraints, current status. | AI assistants (Claude Code, Copilot, etc.) and human onboarding |
| **CONTEXT.md** | Mission, stakeholders, ethical constraints, organizational context. | Humans (product, leadership, new team members) and AI |
| **DECISIONS.md** | Architecture Decision Records with full rationale for every significant choice. | Future developers asking "why?" |
| **ROADMAP.md** | Phased plan with deliverables, success criteria, and open questions. | Project management, stakeholders, AI context |

#### Code Organization Conventions

| Convention | Rule |
|------------|------|
| **Service layer** | Business logic in `/lib/services/`. Never in Server Components or Route Handlers directly. (ADR-011) |
| **API versioning** | `/api/v1/` prefix on all routes. |
| **Structured logging** | JSON logs with consistent schema: `{ route, method, statusCode, durationMs, requestId }`. Implemented via a shared `lib/logger.ts`. |
| **String externalization** | All UI strings in `messages/{locale}.json`. No hardcoded strings in components. (ADR-075) |
| **CSS logical properties** | `ms-*`/`me-*` instead of `ml-*`/`mr-*`. `start`/`end` instead of `left`/`right`. (ADR-076) |
| **Accessibility baseline** | WCAG 2.1 AA. axe-core in CI. No merge with critical or serious violations. (ADR-003) |

#### Database Migration Convention

Numbered SQL migration files in `/migrations/`:

```
migrations/
 001_initial_schema.sql
 002_add_places_table.sql
 003_add_chunk_places.sql
```

Applied via **dbmate** (SQL-based, no ORM lock-in) or Drizzle ORM migrations. Every migration is reviewed in Git, tested against a Neon branch, and reversible.

#### Dependency Management

- **Renovate** (or Dependabot) configured on all repos for automated dependency update PRs
- Pin to specific versions (not ranges) for production dependencies
- Quarterly review of major version upgrades (especially Next.js)

### Rationale

- **Onboarding speed.** A new developer (or AI assistant) can understand any SRF project by reading four files. No tribal knowledge required.
- **Decision archaeology.** ADRs answer "why?" years later. Without them, teams revisit settled decisions, wasting time and risking regression.
- **AI context engineering.** CLAUDE.md is not just for Claude — it's a machine-readable project summary that benefits any LLM-assisted tool. As AI-assisted development becomes standard, projects with good context files get dramatically better AI contributions.
- **Consistency across projects.** SRF has multiple properties (convocation site, portal, future projects). Shared conventions mean developers can move between projects without relearning patterns.
- **Longevity.** The portal may be maintained for a decade. Conventions that seem like overhead now pay for themselves many times over as team members change.

### Consequences

- The teaching portal's documentation structure becomes the SRF template
- New SRF repos are initialized with CLAUDE.md, CONTEXT.md, DECISIONS.md, ROADMAP.md stubs
- The SRF AE team should review and adopt these standards for existing and new projects
- Migration tooling (dbmate or Drizzle) is chosen in Phase 1
- Renovate/Dependabot configured from the first commit

---

## ADR-094: Testing Strategy

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The portal serves sacred text. A bug that misattributes a quote, displays the wrong passage, or breaks search undermines the core mission of fidelity. Testing is not optional polish — it's a fidelity guarantee.

The SRF tech stack doesn't prescribe a testing framework. The portal needs a layered testing approach that covers components, services, API routes, end-to-end user flows, accessibility, search quality, and visual consistency.

### Decision

Adopt a **layered testing strategy** with specific tools for each layer:

| Layer | Tool | What It Tests | Phase |
|-------|------|---------------|-------|
| **Unit / Integration** | **Vitest** + React Testing Library | Service functions, API route handlers, component rendering, database queries | Phase 3 |
| **End-to-End** | **Playwright** | Full user flows: search → read → share → navigate. Cross-browser (Chrome, Firefox, Safari). | Phase 3 (core flows) |
| **Accessibility** | **axe-core** (CI) + Playwright a11y assertions | Automated WCAG checks on every page. Keyboard navigation flows. | Phase 2 (basic) / Phase 4 (CI) |
| **Search quality** | Custom Vitest suite | ~30 representative queries with expected passages. Precision/recall metrics. | Phase 1 (deliverable 1.11) |
| **Performance** | **Lighthouse CI** | Core Web Vitals thresholds: LCP < 2.5s, CLS < 0.1, INP < 200ms. | Phase 3 |
| **Visual** | **Storybook** | Component documentation, design token consistency, interactive component states | Phase 3 (design system) |
| **Visual regression** | Playwright screenshot comparison | Catch unintended visual changes to reading UI, passage cards, Quiet Corner | Phase 12 |

#### Tool Choices

**Vitest over Jest:** Faster execution, native ESM support, better Vite/Next.js integration. The JavaScript testing ecosystem is converging on Vitest.

**Playwright over Cypress:** Multi-browser support (Chrome, Firefox, WebKit/Safari), native accessibility snapshot API (`page.accessibility.snapshot`), more reliable in CI, better parallel execution. Playwright's test generator also speeds up writing E2E tests.

**Storybook deferred to Phase 3:** In Phases 1–2, the component count is small (~15-20 components). Storybook adds setup overhead without proportional value. When the Calm Technology design system arrives (Phase 12), Storybook becomes the documentation platform for reusable components across SRF properties.

**No MCP-based testing.** MCP servers are valuable for development workflows (Neon MCP for database operations), but test execution must be deterministic, automated, and reproducible. MCP doesn't add value to test pipelines.

#### Database Test Isolation

Each test run creates a **Neon branch**, runs integration tests against it, and deletes the branch afterward. This provides full database isolation without maintaining a separate test database, using Neon's instant branching capability.

```
CI pipeline:
 1. Create Neon branch from main
 2. Apply migrations to branch
 3. Seed test data
 4. Run Vitest integration tests against branch
 5. Run Playwright E2E tests against branch
 6. Delete branch (cleanup)
```

#### CI Pipeline

```
┌─────────────────────────────────────────┐
│ On every PR: │
│ │
│ 1. Lint (ESLint + Prettier) │
│ 2. Type check (tsc --noEmit) │
│ 3. Unit/integration tests (Vitest) │
│ 4. Accessibility audit (axe-core) │
│ 5. Build (next build) │
│ 6. E2E tests (Playwright) │
│ 7. Lighthouse CI (performance) │
│ 8. Search quality suite │
│ │
│ All must pass before merge. │
└─────────────────────────────────────────┘
```

### Rationale

- **Fidelity guarantee.** The search quality test suite is the most important test layer — it verifies that seekers find the right passages. A regression in search quality is a mission failure.
- **Accessibility as gate.** axe-core in CI means accessibility violations block merges, not just generate warnings. This enforces ADR-003.
- **Neon branching for test isolation.** Eliminates the "works on my machine" problem for database-dependent tests. Each PR gets a clean database.
- **Cross-browser E2E.** Seekers worldwide use diverse browsers. Playwright's multi-browser support catches rendering issues that single-browser testing misses.
- **Performance budgets.** Lighthouse CI prevents performance regressions. A portal that's slow on a mobile connection in rural India fails the global accessibility mission.

### Consequences

- Phase 3 includes Vitest, Playwright, axe-core, and Lighthouse CI setup (basic axe-core testing begins in Phase 2)
- CI pipeline runs all test layers on every PR
- Neon branches are created/deleted per test run (Neon free tier supports this)
- Storybook is introduced in Phase 3 alongside the design system foundations
- Search quality test suite is a Phase 1 deliverable (1.11) and grows as the corpus expands
- Visual regression testing begins in Phase 12 when the component library stabilizes

---

## ADR-095: Observability Strategy

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The SRF tech stack specifies New Relic (APM), Sentry (error tracking), and Amplitude (product analytics). The portal should use these tools, but with DELTA-compliant configuration — particularly Amplitude, which defaults to user-level behavioral tracking that violates the Agency and Dignity principles.

### Decision

Use the **SRF-standard observability stack** with portal-specific configuration:

| Layer | Tool | What It Measures |
|-------|------|-----------------|
| **Error tracking** | **Sentry** | Unhandled exceptions, API errors, client-side errors. Next.js source maps for readable stack traces. |
| **APM (performance)** | **New Relic** | API route latency, database query duration, external call timing (Claude API, OpenAI embeddings). Server-side distributed tracing. |
| **Synthetic monitoring** | **New Relic Synthetics** | Uptime checks on key routes (`/`, `/api/v1/search`, `/api/v1/health`, `/quiet`). Alerts on downtime. |
| **Product analytics** | **Amplitude** | *Only* appropriate metrics from CONTEXT.md. DELTA-compliant configuration (see below). |
| **Log aggregation** | **Vercel Logs → New Relic** | Structured JSON logs. Request ID correlation across services. |
| **Frontend performance** | **Vercel Analytics** | Core Web Vitals (LCP, CLS, INP). Edge function performance. Cold start monitoring. |

#### Health Check Endpoint

```
GET /api/v1/health

Response:
{
 "status": "ok",
 "version": "1.0.0",
 "database": "connected",
 "timestamp": "2026-02-17T12:00:00Z"
}
```

New Relic Synthetics pings this endpoint at regular intervals. Alert if non-200 for > 2 minutes.

#### Structured Logging

Every API route logs a consistent JSON structure via `/lib/logger.ts`:

```typescript
// Standard fields on every request
{
 requestId: string, // UUID, propagated across services
 route: string, // e.g., "/api/v1/search"
 method: string, // GET, POST
 statusCode: number,
 durationMs: number,
 language: string, // User's locale
 timestamp: string // ISO 8601
}

// Additional fields for search routes (anonymized)
{
 query: string, // The search query
 resultCount: number,
 searchMode: string, // "hybrid", "fts", "vector"
 expansionUsed: boolean // Whether Claude query expansion was invoked
}
```

No user identification. No IP addresses. No session IDs. Search queries are logged for aggregate trend analysis ("What is humanity seeking?"), not user tracking.

#### DELTA-Compliant Amplitude Configuration

Amplitude's defaults assume user-level behavioral tracking. The portal must explicitly disable:

| Amplitude Default | Portal Override | Reason |
|-------------------|----------------|--------|
| User identification | **Disabled** | Violates Dignity — seekers are not data points |
| Session tracking | **Disabled** | Violates Agency — optimizes for retention |
| Event sequencing | **Disabled** | Violates Agency — builds behavioral profiles |
| Autocapture (clicks, page views) | **Disabled** | Violates Agency — surveillance by default |

**What Amplitude tracks (allowlist):**

| Event | Properties | Purpose |
|-------|-----------|---------|
| `page_viewed` | `{ page_type, language, requested_language, country_code }` | Countries reached, languages served, unmet language demand |
| `passage_served` | `{ book_slug, language }` | Books/passages served count |
| `share_link_generated` | `{ format }` | Share link generation count |
| `center_locator_clicked` | `{}` | Did digital lead to physical? |
| `search_performed` | `{ language, result_count, zero_results }` | Search usage, zero-result rate (not query content — that's in server logs) |

Country code derived from Vercel/Cloudflare edge headers, not IP geolocation lookup. Anonymized at the edge. `requested_language` derived from `Accept-Language` header — measures the gap between what seekers want and what the portal serves. `zero_results` boolean flags searches returning no passages — the zero-result rate is the most actionable operational metric for search quality.

### Rationale

- **SRF stack alignment.** Using the established tools (New Relic, Sentry, Amplitude) means the SRF AE team can support the portal without learning new tools.
- **DELTA compliance requires active configuration.** Amplitude, New Relic, and Sentry all default to collecting more data than the DELTA framework permits. The allowlist approach — explicitly specifying what to track rather than what not to track — is the only safe pattern.
- **Structured logging is the foundation.** Good logs make every other observability tool more effective. A request ID that traces from Vercel edge → API route → Neon query → Claude API call makes debugging trivial.
- **Health check + Synthetics = uptime confidence.** A dedicated health endpoint is trivial to implement and provides the foundation for reliable uptime monitoring.

### Consequences

- Phase 1 includes Sentry setup, structured logging (`lib/logger.ts`), and health check endpoint
- New Relic integration in Phase 7 (depending on SRF providing New Relic account access)
- Amplitude configured with explicit allowlist — no autocapture, no user identification
- DELTA compliance review of all observability configuration before launch
- Vercel Analytics enabled from Phase 1 (free with Vercel deployment)

---

## ADR-096: Design Tooling — Figma

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The portal needs a design tool for screen mockups, component design, and eventually the Calm Technology design system (Phase 12). The SRF tech stack brief does not prescribe a design tool. Options range from free open-source tools to industry-standard paid platforms.

### Decision

Use **Figma** for design, starting with the **free Starter plan** in Phase 3, upgrading to **Professional** when the design system work begins in Phase 12.

#### Phase 3 (Free Starter Plan — $0)

- 3 Figma design files (sufficient for: homepage/search, reader/passage, Quiet Corner/About)
- Unlimited personal drafts
- Core screens designed and available for developer reference
- Design tokens (colors, typography, spacing) documented in Figma and exported to `tailwind.config.ts`

#### Phase 12+ (Professional Plan — $15/editor/month)

- Unlimited files
- Shared component library (Calm Technology design system)
- Design token synchronization via Figma Tokens plugin
- Branching for design exploration
- Team collaboration

#### Figma-to-Code Pipeline

```
Figma design tokens (colors, typography, spacing, radii)
 │
 ▼
 Figma Tokens plugin → exports tokens.json
 │
 ▼
 tailwind.config.ts consumes tokens
 │
 ▼
 Components use Tailwind classes
 │
 ▼
 Storybook documents the components (Phase 3+)
```

This ensures the design language stays synchronized between Figma and the codebase. A change to `--portal-gold` in Figma propagates to `tailwind.config.ts` and is automatically reflected in all components.

### Alternatives Considered

| Tool | Pros | Cons |
|--------|------|------|
| **Figma (chosen)** | Industry standard; excellent developer handoff; design tokens export; component variants; real-time collaboration; SRF team likely familiar | Paid for full team features ($15/editor/mo at Professional tier) |
| **Penpot** (open-source) | Free; self-hostable; no vendor lock-in; AGPL license | Smaller community; fewer plugins; less mature component/token system; higher setup overhead if self-hosted |
| **Sketch** | Mature; good design system features; native macOS performance | Mac only; no real-time collaboration; shrinking market share |
| **Adobe XD** | Adobe ecosystem integration | Being sunset by Adobe; not a viable long-term choice |
| **No design tool — code-first** | Zero cost; design in browser | Harder to explore layouts; no stakeholder preview; design decisions embedded in code |

### Rationale

- **Industry standard.** Figma is what most designers and frontend developers know. Hiring or onboarding someone who uses Figma is trivially easy.
- **Free tier covers Phase 3.** Three files and unlimited drafts is sufficient for Phase 3. No cost until the design system requires shared libraries.
- **Design token pipeline.** The Figma Tokens → Tailwind pipeline ensures design and code stay synchronized. This is critical when the Calm Technology design system is reused across SRF properties.
- **Stakeholder communication.** Figma prototypes allow SRF leadership and the philanthropist's foundation to preview the portal before code is written. This is especially valuable for the Calm Technology aesthetic, which is easier to evaluate visually than to describe in words.

### Consequences

- Phase 3: Figma free tier for core screen design
- Phase 12: Upgrade to Professional when Calm Technology design system begins
- Figma Tokens plugin configured to export to `tokens.json`
- `tailwind.config.ts` imports from `tokens.json` for design token synchronization
- Storybook (Phase 3+) references Figma component designs for visual parity

---

## ADR-097: MCP Server Strategy — Development Tooling for AI Implementation

**Status:** Accepted | **Date:** 2026-02-20

### Context

The portal is implemented by AI (Claude Code) with human oversight. MCP (Model Context Protocol) servers provide the AI with direct access to external services during development — querying databases, reading error logs, inspecting CMS content models — without leaving the coding context. The question is which MCP servers provide genuine value versus adding configuration overhead for marginal benefit.

The evaluation criteria:
1. **Frequency** — Is this queried during active development, or only during setup?
2. **Context value** — Does seeing this data improve code decisions in the moment?
3. **Alternative quality** — Is the CLI or dashboard already excellent?

### Decision

Three tiers of MCP server adoption, phased with the project:

**Essential (configure now):**

| MCP Server | Purpose | Why Essential |
|------------|---------|---------------|
| **Neon** | Database schema management, SQL execution, migration testing, branch-per-test isolation | The database is the center of everything. Used in virtually every development session. |
| **Sentry** | Error investigation — stack traces, breadcrumbs, affected routes, error frequency | When something breaks during development, seeing the full error context without switching tools is genuinely valuable. Eliminates context switching during debugging. |

**High value (add when the service is introduced):**

| MCP Server | Phase | Purpose | Why Valuable |
|------------|-------|---------|-------------|
| **Contentful** | Phase 12+ | Content model queries, entry management, webhook debugging | When Contentful becomes the editorial source of truth, the content model is tightly coupled to code. Prevents drift between what code expects and what CMS provides. |

**Evaluate (try, keep if useful):**

| MCP Server | Phase | Purpose | Assessment |
|------------|-------|---------|------------|
| **GitHub** | Phases 1–11 | Issue context, PR details, review comments | Modest benefit over `gh` CLI. Try it; drop if redundant. |
| **Vercel** | Phase 1+ | Deployment status, build logs, preview URLs | Useful for debugging deployment failures. The `vercel` CLI covers most of this. |
| **Cloudflare** | Phase 1+ | WAF analytics, rate limit monitoring, traffic patterns | Terraform handles declarative config; MCP useful only for real-time monitoring queries. |

**Not recommended (skip):**

| Service | Why Skip |
|---------|----------|
| **AWS** | Terraform manages infrastructure declaratively. Sentry catches errors. The gap — "what's in that S3 bucket?" — is too narrow. `aws` CLI through Bash handles rare ad-hoc queries. |
| **Figma** | Design tokens are exported once to `tokens.json` and consumed by Tailwind. The AI reads the local file; no interactive Figma queries needed. |
| **Amplitude** | Analytics code targets the SDK, not the query API. By the time analytics data matters (Phase 7+), queries are infrequent. Dashboard is adequate. |
| **New Relic** | APM data (slow queries, endpoint latency) is useful during the Phase 7 observability work, but that's a narrow window. Dashboards handle ongoing monitoring. |
| **Auth0** | Auth is configured once and rarely touched. When it breaks, the Auth0 CLI or dashboard is adequate for the low frequency of interaction. |

**Custom MCP server (Phase 1):**

The **SRF Corpus MCP** server (planned since the original design) gives the AI development-time access to the book corpus — "find all passages about meditation in Autobiography." This enables the AI to reference actual content when building search features, theme pages, and test fixtures.

### Consequences

- Sentry MCP added to project configuration at Phase 1 alongside existing Neon MCP
- Contentful MCP evaluated and added when Phase 12 Contentful migration begins
- GitHub MCP evaluated during Phase 1; kept or dropped based on actual utility versus `gh` CLI
- SRF Corpus MCP server built as a Phase 1 deliverable (custom, queries Neon directly)
- AWS MCP explicitly not adopted — Terraform + Sentry + `aws` CLI is sufficient
- MCP server configuration documented in CLAUDE.md for all future AI sessions
- This decision is revisited at Phase 10 (Contentful), Phase 13 (cross-media), and Phase 15 (user accounts) when new services enter the stack

---

## ADR-098: Documentation Architecture — Five-Document System with AI-First Navigation

- **Status:** Accepted
- **Date:** 2026-02-20

### Context

The project's documentation system is itself an architectural decision. The pre-code design phase produced nearly 1MB of structured documentation across five files. As the project transitions to implementation, the documentation system must serve three audiences: AI collaborators (primary, token-constrained), human developers (current and future), and non-technical stakeholders (SRF, the philanthropist's foundation).

Key tensions:
- **Completeness vs. navigability.** Thorough documentation ensures correct decisions; large documents are expensive to load into AI context windows.
- **Single source of truth vs. contextual relevance.** Centralizing information prevents drift; distributing it keeps related concerns together.
- **Design-phase authority vs. code-phase authority.** Documentation is the sole authority before code exists; after implementation, code and documentation must coexist without contradiction.

### Decision

Maintain a five-document system with explicit roles, a routing document (CLAUDE.md), and defined conventions for the documentation-to-code transition:

| Document | Role | Primary Audience |
|----------|------|-----------------|
| CLAUDE.md | AI routing, constraints, maintenance protocol | AI collaborators |
| CONTEXT.md | Project background, open questions, stakeholder context | All audiences |
| DESIGN.md | Technical architecture, data model, API, frontend design | Developers, AI |
| DECISIONS.md | Architecture Decision Records (immutable history) | Developers, AI |
| ROADMAP.md | Phased delivery plan with deliverables and success criteria | All audiences |

**Conventions:**

1. **CLAUDE.md as routing document.** The single most important file for AI collaboration. Establishes reading order, constraints, and maintenance protocol in ~90 lines — small enough to always fit in context.
2. **CONTEXT.md as open question registry.** All open questions (technical and stakeholder) are tracked here. Other documents cross-reference but do not duplicate the full question.
3. **DESIGN.md Table of Contents with phase-relevance markers.** Enables AI sessions to navigate to relevant sections without sequential scanning of 5,000+ lines.
4. **ROADMAP.md Table of Contents.** Phase-level navigation for quick orientation.
5. **DECISIONS.md Index by Concern.** ADRs grouped by domain (already established at ADR-009).
6. **Implemented-section annotations.** When a DESIGN.md section is fully implemented, annotate: `**Status: Implemented** — see [code path]`. Code becomes the source of truth; DESIGN.md retains architectural rationale.
7. **ADRs are immutable history.** Decisions are superseded (new ADR), withdrawn (with explanation), or removed (number retired) — never silently edited.
8. **Section-level change tracking.** When substantially revising a DESIGN.md section, add `*Section revised: [date], [reason or ADR]*` at the section's end. Document-level "Last updated" footers are not used — `git log` provides better granularity without maintenance burden.
9. **Expanded maintenance table in CLAUDE.md.** Covers open question lifecycle, cross-cutting concern changes, content type additions, and the documentation-to-code transition.

### Rationale

- The routing document (CLAUDE.md) is the single most impactful file for AI collaboration cost. A well-structured 90-line file saves thousands of tokens per session by directing attention to the right document and section.
- Phase-relevance markers in the DESIGN.md TOC allow AI sessions to skip irrelevant sections (e.g., Phase 11 multilingual details during Phase 1 work), reducing token consumption without losing information.
- The documentation-to-code transition protocol prevents the "two sources of truth" problem that invariably emerges when design documents survive into an implemented codebase.
- Centralizing open questions in CONTEXT.md prevents them from being forgotten in document interiors — a real risk at 967KB of total documentation.
- Making the documentation system itself an ADR ensures future contributors understand why the system is structured this way, and can evolve it deliberately rather than through drift.

### Consequences

- DESIGN.md and ROADMAP.md now carry navigable Tables of Contents
- DESIGN.md inline open questions are converted to cross-references to CONTEXT.md
- CLAUDE.md maintenance table is expanded from 6 rows to 12 rows
- CLAUDE.md gains a "Documentation–Code Transition" section
- Future documentation changes should follow the conventions established here
- This ADR should be superseded if the documentation system undergoes fundamental restructuring (e.g., splitting DESIGN.md into sub-documents as it grows beyond navigability)

---

## ADR-099: Global Privacy Compliance — DELTA as GDPR Superstructure

- **Status:** Accepted
- **Date:** 2026-02-21

### Context

The portal serves seekers worldwide, including the EU (GDPR), UK (UK GDPR), Germany (TTDSG/DSGVO), California (CCPA/CPRA), Brazil (LGPD), India (DPDPA), and Japan (APPI). Global privacy compliance is a legal necessity, but the DELTA framework and Calm Technology principles already produce an architecture that *substantively exceeds* most regulatory requirements — because the portal collects almost no personal data by design.

The remaining compliance work is primarily documentary (privacy policy, sub-processor inventory, retention policies, data subject rights documentation) rather than architectural. One architectural change is required: self-hosting Google Fonts to avoid IP transmission to Google servers (per LG München I, Case No. 3 O 17493/20).

### Decision

**1. Privacy policy and legal pages.** Add `/privacy` and `/legal` to the portal URL structure. The privacy policy must be human-readable (not legal boilerplate), written in the portal's contemplative voice, and translated alongside UI strings in Phase 11. Disclose: what data is collected, why, how long retained, who processes it, data subject rights, and sub-processor list. The privacy policy is a Phase 2 deliverable alongside the accessibility foundation.

**2. Self-hosted fonts.** Replace Google Fonts CDN imports with self-hosted font files served from Vercel's CDN. Download Merriweather, Lora, and Open Sans WOFF2 files, bundle in the application. This eliminates IP transmission to Google servers and improves performance (no DNS lookup to `fonts.googleapis.com`). Phase 2 deliverable.

**3. Cookie and localStorage disclosure.** The portal uses a language preference cookie (user-initiated) and `localStorage` for bookmarks, reader settings, study workspace, and first-visit detection. Under ePrivacy/TTDSG §25(2)(2), all serve user-initiated functionality and qualify as "strictly necessary" — no consent banner required. This determination is documented in the privacy policy. No cookie banner is added (cookie banners are antithetical to Calm Technology and unnecessary when all storage is functional).

**4. Email subscription: lawful basis, erasure, retention.**
- **Lawful basis:** Consent (GDPR Art. 6(1)(a)) via double opt-in. Documented on the subscription form and in the privacy policy.
- **Right to erasure:** The unsubscribe endpoint (`GET /api/v1/email/unsubscribe`) currently soft-deletes (sets `is_active = false`). Add a `DELETE /api/v1/email/subscriber` endpoint that performs hard deletion (removes the row entirely) to comply with GDPR Article 17. The unsubscribe confirmation page offers "Remove my data entirely" as an additional option.
- **Retention:** Unsubscribed email records (soft-deleted) are automatically purged 90 days after `unsubscribed_at`. Active subscriber data is retained for the duration of the subscription. Bounce/failure records are retained for 30 days for operational health monitoring.

**5. Seeker feedback PII mitigation.** The `/feedback` form includes a notice: "Please do not include personal information (name, email, location) in your feedback." Feedback entries are reviewed periodically for inadvertent PII, which is redacted by editorial staff. Feedback entries older than 2 years are eligible for archival aggregation (convert to anonymized statistics, delete raw text).

**6. Sub-processor inventory.** Maintain a documented inventory of all services that process data on the portal's behalf, with their roles, data touched, and geographic regions. Update when services are added or changed. Published as part of the privacy policy.

**7. `search_queries` table.** The table stores query text without user identifiers. Under GDPR recital 26, data that cannot identify a natural person is not personal data. The portal cannot match a data subject access request to their queries because no user identifiers are stored. This is documented in the privacy policy. The minimum aggregation threshold of 10 (ADR-053) prevents re-identification in the reporting layer.

**8. Rate limiting and IP processing.** Cloudflare processes IP addresses for WAF/rate-limiting purposes. The portal itself does not store IP addresses. This is disclosed in the privacy policy: "Our CDN provider processes IP addresses for security purposes. We do not store IP addresses."

**9. YouTube privacy-enhanced embeds.** The facade pattern (thumbnail → click to load from `youtube-nocookie.com`) ensures no Google connection occurs until the user actively clicks play. This is compliant with strict German GDPR interpretation and documented.

**10. Record of Processing Activities (ROPA).** Maintain a ROPA (GDPR Article 30) documenting all processing activities. For the portal's minimal data profile, this is a short document. Created in Phase 2, maintained as processing activities change.

**11. Phase 15 age consideration.** When user accounts are introduced (Phase 15), the signup flow must include minimum age verification. GDPR: 16 in most of EU (member state variation down to 13). COPPA: 13 in US. The email subscription (Phase 9) should include a minimum age statement: "You must be 16 or older to subscribe."

### DELTA ↔ GDPR Crosswalk

| DELTA Principle | GDPR Alignment | Portal Implementation |
|-----------------|---------------|----------------------|
| **Dignity** — seekers are not data points | Art. 5(1)(a) — fairness; Art. 5(1)(c) — data minimization | No user identification, no behavioral profiling, no data monetization |
| **Embodiment** — encourage practice over screen time | Art. 5(1)(b) — purpose limitation | No engagement metrics, no retention optimization, no session tracking |
| **Love** — compassion in all interactions | Art. 12 — transparent, intelligible communication | Privacy policy in contemplative voice, not legal boilerplate |
| **Transcendence** — no gamification | Art. 5(1)(c) — data minimization | No achievement data, no streaks, no leaderboards to store |
| **Agency** — users control their experience | Art. 7 — conditions for consent; Art. 17 — right to erasure | Double opt-in, one-click unsubscribe, hard deletion option, no dark patterns |

### Sub-Processor Inventory

| Service | GDPR Role | Data Touched | Region | DPA Required |
|---------|-----------|-------------|--------|-------------|
| **Neon** | Processor | All server-side data (books, themes, search queries, subscribers) | US (default); EU read replica Phase 10+ | Yes |
| **Vercel** | Processor | Request logs (transient), edge headers, static assets | Global edges, US origin | Yes |
| **Cloudflare** | Processor | Request metadata, IP for WAF (transient) | Global | Yes |
| **Amplitude** | Processor | Anonymized events with country_code | US | Yes |
| **Sentry** | Processor | Error stack traces, request context | US | Yes |
| **New Relic** | Processor | Performance metrics, log aggregation | US | Yes (Phase 7+) |
| **AWS Bedrock** | Processor | Search queries (transient, not stored by AWS) | `us-east-1` | Covered by AWS DPA |
| **OpenAI** | Processor | Corpus text at embedding time (one-time) | US | Yes |
| **Resend/SES** | Processor | Subscriber email addresses | US | Yes (Phase 9+) |
| **Auth0** | Processor | User accounts (if implemented) | US | Yes (Phase 15+) |
| **Contentful** | Processor | Editorial content (no personal data) | EU | Yes (Phase 10+) |

EU-US data transfers rely on the EU-US Data Privacy Framework (DPF) where services are certified, with Standard Contractual Clauses (SCCs) as fallback. The sub-processor inventory is reviewed when services are added or changed, and published as part of the privacy policy.

### Rationale

- **DELTA exceeds GDPR.** The portal's ethical framework produces stronger privacy protections than any single regulation requires. Compliance is a natural consequence, not an afterthought. The strongest compliance demonstration is: "We designed for human dignity first, and compliance followed."
- **Architectural changes are minimal.** Self-hosted fonts is the only code change. Everything else is documentation.
- **No cookie banner.** All client-side storage serves user-initiated functionality (strictly necessary under ePrivacy/TTDSG). Adding a consent banner to a portal with no tracking, no profiling, and no advertising cookies would be Calm Technology theater — noise without substance.
- **Global coverage.** The portal's data minimization posture satisfies GDPR, UK GDPR, CCPA/CPRA, LGPD, DPDPA, and APPI simultaneously. Regional differences matter at the margins (minimum age for consent, cross-border transfer mechanisms), not at the architectural level.

### Consequences

- `/privacy` and `/legal` pages added to URL structure (Phase 2)
- Self-hosted fonts replace Google Fonts CDN (Phase 2)
- Privacy policy drafted in contemplative voice, translated alongside UI strings (Phase 11)
- `DELETE /api/v1/email/subscriber` endpoint for hard deletion (Phase 9)
- 90-day automatic purge of soft-deleted subscriber records (Phase 9)
- Feedback form gains PII notice (Phase 5)
- ROPA document created (Phase 2)
- Sub-processor inventory maintained in DESIGN.md
- Minimum age statement on email subscription form (Phase 9)
- Phase 15 account signup includes age verification
- New open questions added to CONTEXT.md: data controller identity, minimum age policy, Indian DPDPA cross-border rules, Brazilian LGPD DPO requirement

*Section added: 2026-02-21, global privacy compliance exploration*

---

## ADR-100: AI Editorial Workflow Maturity — Trust Graduation and Feedback Loops

**Status:** Accepted | **Date:** 2026-02-21

### Context

DES-035 catalogs 25+ AI-assisted editorial workflows, all governed by the principle "AI proposes, humans approve." This principle is correct as a starting posture but incomplete as a 10-year operating model. The portal's monastic content editor has a 2–3 hour daily window for editorial work. As the corpus grows from 1 book (Phase 1) to 15+ books plus video, audio, images, magazine archives, and community submissions (Phase 14+), the total review volume grows multiplicatively — more content types × more workflows × more languages.

The current design implicitly assumes review demand will stay within human capacity. It won't. By Phase 7, the editorial team will be managing theme tag reviews, tone spot-checks, daily passage curation, translation reviews, feedback triage, social media approvals, reverse bibliography verification, and editorial thread curation. Without a governed mechanism for evolving the AI-human relationship over time, one of three things happens: (a) review queues grow unbounded, (b) reviewers rubber-stamp to keep pace, or (c) the team informally skips reviews for "trusted" workflows — losing the audit trail that makes the system trustworthy.

Additionally, DES-035 describes a stateless relationship between AI and editors. Each AI proposal starts fresh. When the theological reviewer consistently selects Option 2 over Option 1 for Christian contemplative pathways, or when a theme tag reviewer rejects "Joy" classifications for passages about sacrifice, that accumulated editorial judgment never flows back to improve the AI's proposals. Over a decade, this is a significant waste of editorial attention.

### Decision

#### 1. Three-Stage Workflow Maturity Model

Every AI-assisted workflow in DES-035 operates at one of three maturity stages. Stage transitions are governed, auditable, and reversible.

| Stage | AI Role | Human Role | Entry Criteria |
|---|---|---|---|
| **Full Review** | Proposes | Approves every item | Default for all new workflows |
| **Spot-Check** | Proposes and applies provisionally | Reviews random sample (10–20%) + all AI-flagged exceptions | ≥ 500 items reviewed at Full Review with ≥ 95% approval rate, ≥ 3 months of operation, theological reviewer sign-off |
| **Exception-Only** | Applies autonomously | Reviews only items where AI confidence < threshold or AI explicitly abstains | ≥ 2,000 items at Spot-Check with ≥ 98% sample-approval rate, ≥ 6 months at Spot-Check, no theological errors in audit period, portal coordinator sign-off |

**Stage transitions are per-workflow, per-language.** Theme tag classification may reach Spot-Check in English while remaining at Full Review in Hindi. Tone classification may reach Exception-Only while worldview pathway generation permanently stays at Full Review.

**Certain workflows never graduate beyond Full Review:**
- Worldview guide pathway generation (theological sensitivity)
- Life-phase pathway generation (theological sensitivity)
- Community collection pre-review (final approval is inherently human)
- Crisis language detection (safety-critical)

**Regression:** Any theological error, citation error affecting a published passage, or pattern of reviewer overrides (> 15% in a 30-day window) triggers automatic regression to the previous stage. The regression is logged, the prompt is reviewed, and re-graduation requires meeting the original criteria again.

#### 2. Feedback Loop Protocol

Reviewer corrections systematically refine AI proposals over time through three mechanisms:

**a. Override tracking.** Every reviewer action (approve, reject, edit, select alternative) is logged in an `ai_review_log` table with the workflow type, AI's proposal, reviewer's decision, and reviewer's rationale (optional free text). This table is internal — never exposed to seekers, never used for analytics.

**b. Prompt refinement cadence.** Quarterly, the portal coordinator reviews override patterns per workflow:
- Workflows with > 10% override rate: prompt revision required
- Workflows with consistent override patterns (e.g., "always rejects 'Joy' for passages about sacrifice"): add the pattern as a negative example in the prompt
- The refined prompt is versioned and the previous version archived

**c. Confidence calibration.** AI confidence scores are compared against actual approval rates. If the AI is consistently confident about proposals that get rejected, the confidence threshold for Spot-Check routing is raised. If the AI is consistently uncertain about proposals that get approved, the threshold is lowered. Calibration is reviewed quarterly alongside prompt refinement.

#### 3. AI Abstention Protocol

The AI can decline to propose when it recognizes insufficient signal. Abstention routes the item directly to human review without an AI pre-classification, avoiding the anchoring bias of a low-quality proposal.

Abstention triggers:
- Passage in a script the model cannot reliably process (e.g., Devanāgarī-heavy passages for tone classification)
- Fewer than 3 corpus passages available for a pathway generation slot
- Confidence score below a per-workflow floor (set during Full Review stage based on observed accuracy)
- Content that falls outside the model's training distribution (e.g., a community collection mixing prose and chant in a way the classifier hasn't seen)

When the AI abstains, the review queue item is marked `ai_abstained = true` with a brief explanation ("Insufficient corpus coverage for Sufi poetry pathway — only 2 relevant passages found"). The reviewer sees no AI proposal, only the raw content and the abstention reason. Abstention rates are tracked per workflow as a health metric.

#### 4. Cross-Workflow Consistency Checks

AI-assisted workflows operate on shared content but independently. A passage can be tagged "joyful" by tone classification, placed in a "Grief & Loss" guide pathway, and classified as "consoling" by the daily passage curator — each correct in context but potentially contradictory.

A nightly batch job runs consistency checks across workflow outputs:
- Tone classification vs. theme tag alignment (flag passages where tone and theme are semantically opposed)
- Guide pathway passage selection vs. accessibility rating (flag deep passages in newcomer pathways)
- Daily passage tone sequence vs. calendar events (flag challenging passages on consoling calendar dates)
- Theme tag vs. editorial thread placement (flag passages tagged "Peace" placed in a "Courage" thread)

Inconsistencies are surfaced in the editorial home screen as a low-priority review category. They are not errors — context legitimately changes meaning. But persistent inconsistencies suggest a classification problem worth investigating.

**Phase:** 5 (consistency checks). Quarterly cadence begins Phase 5. Maturity model governance begins Phase 5 for theme tag classification (first workflow to reach Full Review volume). Feedback loop protocol begins Phase 1 (override logging from the first AI-assisted search).

#### 5. Workflow Dependency Awareness

DES-035 workflows have implicit dependencies that affect consistency when upstream outputs change:

```
Ingestion QA ──► Theme Tag Classification ──► Worldview Pathway Generation
                                           ──► Daily Passage Pre-Curation
                 Tone Classification ──────► Daily Passage Pre-Curation
                 External Ref Extraction ──► Worldview Pathway Generation
                 Feedback Categorization ──► Content Correction (DES-034)
```

When an upstream workflow's output changes (e.g., an OCR correction alters passage text, or a theme tag is reclassified), downstream workflows that consumed the old output are flagged for re-evaluation. This is not automatic re-execution — it's a staleness signal in the editorial queue: "This passage's theme tags changed since it was included in the Christmas pathway. Review recommended."

### Rationale

- **"AI proposes, humans approve" remains the governing principle.** The maturity model doesn't replace it — it operationalizes it for a decade of growth. Full Review is the permanent default. Graduation is earned, governed, and reversible.
- **Editorial attention is the scarcest resource.** The monastic editor's 2–3 hour daily window is finite. The maturity model preserves that attention for the workflows that need it most, rather than spreading it uniformly across workflows of vastly different sensitivity.
- **Trust without audit is not trust.** Informal "we stopped reviewing tone tags because they're always right" is a liability. Governed stage transitions with documented criteria preserve institutional confidence across staff turnovers.
- **The AI should get better at its job.** A librarian's assistant who never learns from corrections is a poor assistant. The feedback loop doesn't change the model — it refines the prompts, thresholds, and routing rules that shape how the model is used.
- **Abstention is a feature, not a failure.** An AI that says "I can't help here" is more trustworthy than one that always produces an answer. The abstention protocol makes the AI's limitations visible rather than hidden behind low-confidence proposals.

### Consequences

- `ai_review_log` table added to schema (Phase 1 — logging begins with the first AI-assisted workflow)
- `ai_abstained` boolean column added to review queue items (Phase 1)
- Quarterly prompt refinement cadence added to operational playbook (Phase 5)
- Maturity stage tracked per workflow per language in `ai_workflow_config` table (Phase 5)
- Nightly consistency check batch job (Phase 5, runs alongside existing nightly jobs)
- Workflow dependency graph documented in DES-035 and maintained as workflows are added
- New open question: editorial capacity modeling — projected review hours per phase (added to CONTEXT.md)
- DES-035 updated with new subsections: Feedback Loop Protocol, AI Observes pattern, AI Abstains protocol, Workflow Dependency Graph, Unified Prompt Versioning

*Section added: 2026-02-21, DES-035 deep exploration*

---

## ADR-101: MCP as Three-Tier Corpus Access Layer — Development, Internal, and External

**Status:** Accepted | **Date:** 2026-02-21

### Context

ADR-097 established MCP (Model Context Protocol) servers as development tooling — tools for Claude Code to use while building the portal. The SRF Corpus MCP (DES-031) provides six development-time tools: `search_corpus`, `search_by_theme`, `search_references`, `get_vocabulary_bridge`, `get_book_metadata`, `get_theme_metadata`.

But MCP consumers extend well beyond the development AI. Three additional tiers of AI consumer already exist in the design:

1. **Internal editorial AI agents.** DES-035 catalogs 25+ AI-assisted workflows, all requiring corpus access. Theme tag proposal needs similar-passage retrieval. Guide pathway generation needs ontology traversal, reverse bibliography queries, and vocabulary bridge lookups. Translation review needs cross-language passage alignment. These workflows currently access the corpus through ad-hoc service layer calls — MCP would provide a canonical, auditable, consistent interface.

2. **Internal cross-property consumers.** The SRF mobile app (CONTEXT.md § Stakeholder question), Retool dashboards, the Impact Dashboard, and other SRF web properties are potential consumers. The API-first architecture (ADR-011) already serves HTTP clients; MCP serves AI-native clients using the same service layer.

3. **External AI assistants.** By 2027, seekers will ask ChatGPT, Claude, Gemini, and custom agents about Yogananda's teachings. Without structured access, these AIs fabricate from training data (violating ADR-001) or scrape and paraphrase the portal (violating fidelity). With production MCP, the AI receives verbatim, attributed quotes with portal URLs — the Findability Principle (CONTEXT.md § Mission) realized through the channel where seekers already are.

The API-first architecture (ADR-011) was designed so "the same response serves web, mobile, and any future consumer." MCP is the AI-native realization of that architectural foresight. The service layer in `/lib/services/` is the constant; MCP tools are thin wrappers, just as API routes are thin wrappers.

ADR-026 already envisions multi-channel distribution (WhatsApp, SMS, IVR). AI assistants are the most consequential new channel of 2027–2030. MCP is the protocol by which that channel accesses the portal.

### Decision

Evolve MCP from a single development tier into a three-tier corpus access layer, all wrapping the same service functions in `/lib/services/`.

#### Tier 1: Development (Phase 1 — current)

Unrestricted access for Claude Code during portal development. Existing tools from DES-031 plus additional tools as development needs arise.

| Tool | Service Function | Purpose |
|---|---|---|
| `search_corpus(query, limit)` | `search.ts` | Find passages by semantic query |
| `search_by_theme(slug)` | `themes.ts` | Theme-based retrieval |
| `search_references(source_name)` | `references.ts` | External reference lookup |
| `get_vocabulary_bridge(category)` | reads `spiritual-terms.json` | Terminology mapping |
| `get_book_metadata(slug)` | `books.ts` | Book information |
| `get_theme_metadata(slug)` | `themes.ts` | Theme information |

#### Tier 2: Internal (Phase 5+)

Authenticated service-to-service access for editorial AI agents, batch pipelines, admin portal AI features, and cross-property consumers (SRF app, Retool). Adds tools that internal AI workflows need:

| Tool | Service Function | Purpose | Phase |
|---|---|---|---|
| `get_chunk_with_context(chunk_id, window)` | `chunks.ts` | Passage + N surrounding chunks for QA, classification, review | 5 |
| `get_similar_passages(chunk_id, threshold, limit)` | `search.ts` | Embedding-based nearest neighbors (distinct from theme search) | 5 |
| `get_graph_neighborhood(node_id, depth, types[])` | `graph.ts` | Subgraph around any node, filtered by node/edge type | 7 |
| `find_concept_path(source_slug, target_slug)` | `graph.ts` | Shortest path in the ontology between two concepts | 8 |
| `get_glossary_terms_in_passage(chunk_id)` | `glossary.ts` | Glossary terms appearing in a passage (with definitions) | 5 |
| `get_passage_translations(canonical_chunk_id)` | `translations.ts` | All language variants of a passage | 11 |
| `get_content_coverage(theme_slug)` | `themes.ts` | Passage count, book distribution, tone distribution per theme | 5 |
| `verify_citation(book_slug, chapter, page)` | `citations.ts` | Confirm a quote exists in the corpus | 5 |
| `get_pending_reviews(queue_type, limit)` | `queue.ts` | Items awaiting human review | 5 |
| `get_search_trends(period, min_count)` | `analytics.ts` | Anonymized aggregated query themes (DELTA-compliant) | 7 |
| `get_cross_book_connections(chunk_id)` | `relations.ts` | Related passages from other books | 6 |
| `get_person_context(person_slug)` | `people.ts` | Biography, lineage, key mentioning passages | 6 |
| `get_daily_passage(language, exclude_id)` | `daily.ts` | Random passage from curated pool | 5 |

Internal tools use service-to-service authentication (API key or IAM role, not Auth0). No rate limiting beyond standard database connection limits.

#### Tier 3: External (Phase 9+)

Rate-limited, potentially registered access for third-party AI assistants. Exposes a subset of tools (no admin/editorial tools) with mandatory fidelity metadata on every response.

**Available tools:** `search_corpus`, `search_by_theme`, `get_book_metadata`, `get_theme_metadata`, `get_glossary_terms_in_passage`, `get_graph_neighborhood`, `find_concept_path`, `get_person_context`, `get_daily_passage`, `verify_citation`.

**Not available externally:** `get_pending_reviews`, `get_search_trends`, `get_content_coverage`, `get_similar_passages` (internal editorial tools), `get_passage_translations` (deferred until copyright posture is clear).

**Fidelity metadata envelope:** Every external MCP response wraps content in a fidelity contract:

```jsonc
{
  "passages": [
    {
      "text": "Verbatim passage text...",
      "citation": {
        "book": "Autobiography of a Yogi",
        "chapter": 12,
        "chapter_title": "Years in My Master's Hermitage",
        "page": 142
      },
      "context_url": "/books/autobiography-of-a-yogi/12#chunk-uuid",
      "themes": ["Peace", "Meditation"]
    }
  ],
  "fidelity": {
    "source": "Self-Realization Fellowship",
    "portal": "teachings.yogananda.org",
    "presentation": "verbatim_only",
    "paraphrase_permitted": false,
    "attribution_required": true,
    "attribution_format": "{book}, Chapter {chapter}, p. {page}",
    "context_url_purpose": "Full chapter context — present to the user alongside the quote"
  },
  "rate_limit": {
    "remaining": 85,
    "reset_at": "2027-05-15T12:00:00Z"
  }
}
```

The `fidelity` object is a moral signal, not a technical enforcement — analogous to Creative Commons metadata. Well-behaved AI consumers respect it; the portal cannot prevent violation. The `context_url` field ensures the seeker always has one click to reach the full, unmediated portal experience.

**Rate limiting:** External MCP uses the same Cloudflare + application-level tiering as the HTTP API (ADR-023). Registered consumers (those who agree to the fidelity contract) receive higher limits. Unregistered consumers receive the same limits as anonymous web crawlers (ADR-081).

**Access governance:** Three options, to be decided as a stakeholder question:
1. **Open** — any MCP client can connect (simplest, maximum reach)
2. **Registered** — MCP clients register and receive an API key (enables usage monitoring, fidelity contract agreement)
3. **Partner** — only AI providers who sign a fidelity agreement (most control, least reach)

The recommendation is option 2 (registered) — it balances reach with accountability, and the registration step is where the fidelity contract is acknowledged.

### The Knowledge Graph as MCP Surface

The Knowledge Graph (ADR-062) is the richest machine-readable representation of how the teachings relate to each other. Its MCP tools serve fundamentally different queries than text search:

| Query Type | Search API | Knowledge Graph MCP |
|---|---|---|
| "What did Yogananda say about fear?" | Ranked passages | — |
| "How does meditation relate to concentration in Yogananda's framework?" | — | `get_graph_neighborhood` → structural relationships |
| "What is the path from pranayama to samadhi?" | — | `find_concept_path` → ontological steps with passages at each |
| "Who is Lahiri Mahasaya?" | Passages mentioning him | `get_person_context` → biography + lineage + passages |
| "What themes cluster around grief in the teachings?" | Passages tagged grief | `get_graph_neighborhood("grief", 2, ["theme"])` → related themes and their connections |

These structural queries are the portal's unique offering — no other digital representation of Yogananda's teachings encodes relational structure. Making them available via MCP is what distinguishes the portal's MCP from a simple search API proxy.

### The Aggregate-from-Verbatim Problem

When an AI consumer retrieves multiple passages and must present them, it faces the tension the portal itself navigates (CONTEXT.md § Curation as Interpretation):

| Action | Fidelity Status |
|---|---|
| Present individual passages with citations | Faithful |
| Select "best" passages from results | Curation = interpretation (acceptable — the portal does this too) |
| Summarize: "Yogananda teaches that..." | **Violates ADR-001** |
| Group: "Three contexts — immortality, grief, purpose" | Gray zone — framing is new, quotes aren't |

The portal's position: **serve faithful data with clear fidelity signals, and accept that downstream presentation is outside the portal's jurisdiction.** This is analogous to a physical library: the librarian provides the books faithfully; what the reader does with them is theirs. The `fidelity` metadata and `context_url` provide the reader a path back to the unmediated source.

For internal consumers, the "AI proposes, humans approve" pattern (ADR-100) already governs how AI agents compose with verbatim content. The MCP tools make corpus access explicit and auditable — you can trace exactly which passages an agent retrieved and what it proposed.

### DELTA Implications

If a seeker's AI assistant tracks their queries and accesses the portal MCP on their behalf, the portal is *indirectly* enabling behavioral profiling — the AI knows the seeker asked about grief. The portal's position: the MCP response contains no user identifiers and carries no tracking. The DELTA framework governs the portal's own behavior, not third-party consumers. However, the fidelity metadata could include a DELTA-inspired signal: `"user_tracking_policy": "This content was served without user identification. Consuming applications are encouraged to respect seeker privacy."` — unenforceable but consistent with the portal's voice.

### Rationale

- **The service layer is the constant.** MCP tools are thin wrappers around `/lib/services/` functions, just as API routes are thin wrappers. One implementation, multiple access protocols. This is ADR-011's "any future consumer" principle applied to AI consumers specifically.
- **Internal AI workflows are the immediate value.** The 25+ editorial workflows in DES-035 are the first consumers beyond development. Formalizing their corpus access through MCP tools creates a canonical, auditable interface that supports ADR-100's maturity model — every AI proposal can be traced to the exact MCP queries that informed it.
- **External distribution is the strategic value.** AI assistants are the highest-reach distribution channel the portal hasn't designed for. The Findability Principle — "the teachings should find the seeker" — applies with singular force here: the seeker doesn't need to know the portal exists. Their AI assistant finds the teachings on their behalf.
- **The fidelity metadata is a moral signal.** The portal can't enforce how external AIs present content. But it can make the faithful path easy and the unfaithful path legible. Every response says "this is verbatim, attribution is required, here is the context URL." Well-designed AI systems will respect these signals.
- **The "signpost" principle amplifies, not diminishes.** When an AI serves a Yogananda quote with a portal URL, the seeker discovers the portal through the teachings — exactly the pattern the portal was designed to create. The AI is a signpost to the portal, which is a signpost to practice.

### Consequences

- DES-031 expanded from a summary table to a full three-tier MCP architecture specification
- Internal MCP tools added to development backlog: Phase 5 (editorial tools), Phase 6 (relation/people tools), Phase 7 (graph tools), Phase 8 (ontology tools)
- External MCP tools added as Phase 9 deliverable alongside WhatsApp, email, and social media distribution
- Fidelity metadata schema defined and included in every external response
- DES-035 updated to reference MCP tools as the canonical corpus access path for AI workflows
- New stakeholder questions added to CONTEXT.md: SRF's posture on external AI access, copyright implications, and sacred text in AI context
- Access governance model (open/registered/partner) deferred to stakeholder decision before Phase 9
- This decision supersedes the external-facing aspects of ADR-097 (which remains valid for the development tier). ADR-097's evaluation of third-party MCP servers (Sentry, Contentful, etc.) is unchanged.
- Knowledge Graph MCP tools (`get_graph_neighborhood`, `find_concept_path`) require the graph service layer (`/lib/services/graph.ts`) to support these query patterns — verify during Phase 7 graph implementation

*Section added: 2026-02-21, MCP three-tier exploration*

---
