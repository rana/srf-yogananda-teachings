# SRF Online Teachings Portal — Principles

Eleven principles define the project's identity. They are immutable commitments — changing any of these changes what the project is. Each requires full deliberation to modify.

CLAUDE.md carries the compressed, code-affecting form of each principle. This document adds the *why*: enough rationale to prevent well-intentioned erosion across sessions. For the full alternatives-considered analysis, see the referenced ADRs in DECISIONS.md.

---

## 1. Direct Quotes Only

**The AI is a librarian, not an oracle.** It finds and ranks Yogananda's verbatim words — it never generates, paraphrases, or synthesizes content. (ADR-001, ADR-005)

Yogananda's words are considered transmitted teachings from a realized master. Even subtle paraphrasing can distort meaning — "God-consciousness" and "cosmic consciousness" are not interchangeable in this tradition. The librarian model eliminates hallucination risk entirely: there is nothing to hallucinate because the AI generates no content.

Every Claude interaction returns structured data (JSON arrays of IDs, terms, scores, labels), never prose. Claude reads passages to understand them for ranking and classification, but its output is always a label, a score, or an ID — never modified text. The three permitted categories are Finding (locating passages), Classifying (labeling passages), and Drafting (non-sacred text like UI strings, always with human review). ADR-005 is the single authoritative reference for what Claude may and may not do.

The consequence that matters most: chunking quality is paramount. Each chunk must be a coherent, self-contained passage suitable for display as a standalone quote, because the AI cannot fix a poorly chunked passage — it can only retrieve it.

---

## 2. Sacred Text Fidelity

**Every displayed passage must include book, chapter, and page citation.** No orphaned quotes. AI translation of Yogananda's words is never acceptable — only official SRF/YSS translations. (ADR-075, ADR-078)

When an official translation doesn't exist for a language, the book is simply unavailable in that language — the portal is honest about asymmetry rather than hiding it behind machine translation. This is an "inviolable constraint, not a cost optimization" (ADR-078). The reason is theological: these are sacred texts where precision of language carries spiritual weight. A machine translation of "Self-realization" might produce a phrase that means something entirely different in the target tradition.

Content integrity verification (ADR-039) ensures that published text has not been modified, truncated, or corrupted. Every passage carries provenance: which book, which edition, which chapter, which page. The "Read in context" deep link is architecturally critical — every search result must link to the full chapter, positioned at the passage, so seekers can always verify the surrounding context.

---

## 3. Signpost, Not Destination

**The portal leads seekers toward practice — it never substitutes for it.** Practice Bridge routes technique queries to SRF Lessons information. Crisis query detection provides safety interstitials. The AI never interprets meditation techniques or spiritual practices. (ADR-104, ADR-122, ADR-069)

Yogananda's most consistent teaching across all his books is that reading is insufficient — practice is everything. A portal that faithfully presents his books but offers no coherent bridge from reading to practice paradoxically underserves the seeker it has already moved. The Practice Bridge is the response: editorial surfaces that gently guide seekers from reading toward understanding the path of formal practice, using Yogananda's own published descriptions.

Three distinctions separate the Practice Bridge from a sales funnel: (1) the portal provides information, never optimizes for action — no "Enroll Now" button, no conversion tracking; (2) the free practice path (SRF's free Beginner's Meditation, the portal's Quiet Corner) is foregrounded equally with the paid Lessons path; (3) Yogananda himself made this invitation publicly — surfacing it is more faithful to the source material than omitting it.

The technique boundary is absolute: the portal never teaches Kriya Yoga, Hong-Sau, AUM meditation, or the Energization Exercises. It shows what Yogananda *wrote publicly about* these practices. ADR-085 governs future Lessons content access; ADR-104 governs public descriptions.

---

## 4. Global Equity

**A seeker in rural Bihar on 2G and a seeker in San Francisco on fiber both get the complete experience.** Progressive enhancement: HTML is the foundation, CSS enriches, JavaScript enhances. No feature gating behind connectivity. (ADR-006)

"Throughout the world" is not metaphor — it is an engineering requirement. The world includes seekers paying per megabyte on JioPhones, elderly devotees sharing a family smartphone, practitioners in cybercafes, and monks navigating by screen reader. Every one of them has a full claim on the beauty and depth of the portal. Neither experience is a compromised version of the other.

The commitments are specific: homepage initial payload under 50KB; text-only mode toggle (no images, no web fonts, no decorative elements — a *considered* experience, not a degraded one); aggressive caching so repeat visits cost zero data; progressive enhancement so the reading experience works with JavaScript disabled; Milestone 2a KaiOS emulator in CI; 48px touch targets on pages likely accessed from feature phones; no "Welcome back" personalization that would expose one family member's reading to another on shared devices.

When a feature proposal seems to conflict with this principle, the response is not "we can't do that" but "and how does the base experience work?" Global Equity does not constrain ambition. It demands that ambition serve everyone.

---

## 5. Calm Technology

**No push notifications, no autoplay, no engagement tracking, no gamification, no reading streaks, no time-pressure UI.** The portal waits; it does not interrupt. Technology requires the smallest possible amount of attention. (ADR-065, ADR-002)

Standard web patterns — aggressive CTAs, notification badges, engagement dashboards, "You've read X books this month" — are designed to maximize time-on-site. These goals directly conflict with the DELTA Embodiment principle: the portal should encourage logging off and practicing, not maximizing session length. Spiritual depth is not quantifiable. No metrics, leaderboards, or streaks.

The design system is derived from existing SRF properties (yogananda.org, the Online Meditation Center, the convocation site), enhanced with Calm Technology constraints: generous whitespace as "digital silence," warm backgrounds (never pure white), no decorative animations beyond subtle 0.3s transitions, pill-shaped buttons from SRF's established interaction patterns. The portal's visual language should feel like entering a library, not a marketplace.

Personalization features are classified into three tiers (ADR-002): build (language preference, font size, bookmarks — genuinely helpful); build with caution (search history — opt-in only, user-clearable, never inferred); never build (reading streaks, behavioral recommendations, social features, push notifications, engagement dashboards). The portal's anonymous experience through Arc 6 must be excellent without any personalization.

---

## 6. Accessibility from Milestone 2a

**WCAG 2.1 AA from the first component.** Semantic HTML, ARIA landmarks, keyboard navigation, screen reader support, 44x44px touch targets, `prefers-reduced-motion`. Performance budgets: < 100KB JS, FCP < 1.5s. axe-core in CI — accessibility violations block merges. (ADR-003)

SRF's mission is to serve "all of humanity." "All" includes people with disabilities. This is a theological imperative, not a compliance exercise. SRF's existing app already invested in screen reader support — the portal must meet or exceed that standard.

Retrofitting accessibility is expensive and error-prone; building it in from day one is nearly free. Semantic HTML, keyboard navigation, and ARIA landmarks cost nothing if done from the start. They cost massive effort to retrofit after inaccessible patterns get baked into components and propagated. Later milestones handle audit and polish (professional WCAG audit, TTS, advanced reading mode) — accessibility is not a late-stage addition.

Screen reader quality goes beyond mere compliance. ADR-073 specifies that the spoken interface should carry the same warmth as the visual one — not just "Bookmark button" but a voice that conveys the portal's devotional register. ADR-072 addresses cognitive accessibility: consistent navigation, no autoplay, clear language, predictable behavior.

---

## 7. DELTA-Compliant Analytics

**No user identification, no session tracking, no behavioral profiling.** Amplitude event allowlist only. (ADR-095, ADR-099)

The DELTA framework (Dignity, Embodiment, Love, Transcendence, Agency) produces privacy protections that exceed any single regulation. The crosswalk is documented in ADR-099: DELTA Dignity maps to GDPR Art. 5(1)(a) fairness; DELTA Embodiment maps to Art. 5(1)(b) purpose limitation. Ethics came first; legal compliance follows naturally from the theological framework.

The portal collects approximately five event types: page view (anonymized), search query (anonymized, no user association), book opened, chapter read, Quiet Corner timer started. No user identification, no session stitching, no behavioral profiles, no cross-device tracking. The measurement question "Is this portal succeeding?" is answered not by engagement metrics but by "What Is Humanity Seeking?" — aggregated, anonymized search trends that reveal what the world is asking.

The consequence for code: never install analytics that track users. Never add session IDs. Never correlate events across visits. Every analytics call goes through the event allowlist. If an event isn't on the list, it doesn't fire.

---

## 8. Multilingual from the Foundation

**Every content table carries a `language` column from the first migration.** Every content API accepts a `language` parameter. UI strings externalized, CSS uses logical properties, schema includes cross-language linking. Adding a new language should require zero schema migrations, zero API changes, and zero search rewrites. (ADR-075, ADR-076, ADR-077, ADR-078)

The multilingual commitment shapes technical decisions made long before any translation exists. Voyage voyage-3-large was selected as the embedding model specifically for its multilingual capability (26 languages, unified cross-lingual embedding space) — even though Arc 1 is English only. pg_search uses ICU tokenization that handles Latin, Cyrillic, Arabic, Thai, and Devanagari from day one. CSS logical properties (`margin-inline-start` not `margin-left`) are required from Milestone 2a so RTL languages work without layout redesign.

The three-layer localization strategy: Layer 1 is UI chrome (~200-300 strings, externalized in JSON via next-intl); Layer 2 is portal-authored content (theme descriptions, entry points, editorial reading threads — authored per locale, not translated); Layer 3 is Yogananda's published text (only official SRF/YSS translations, never machine-translated). Each layer has different authoring authority and different translation workflows.

---

## 9. API-First Architecture

**All business logic in `/lib/services/`.** API routes use `/api/v1/` prefix. All routes public (no auth until Milestone 7a+). Cursor-based pagination. (ADR-011)

Next.js encourages embedding business logic in React Server Components. This is convenient but creates platform lock: Server Components are callable only by the Next.js rendering pipeline, not by mobile apps, third-party integrations, or PWA Service Workers. If business logic migrates into Server Components during Arcs 1–6, extracting it later is a significant refactoring effort. The cost of API-first discipline from day one is near zero; the cost of retrofitting is high.

The shared service layer (`/lib/services/`) is pure TypeScript with zero framework imports. A framework migration rewrites the UI layer (~40% of code), not the business logic (~60%). This is the single most important structural rule for the project's longevity (ADR-004). Every user-facing feature has both a callable service function and a REST API endpoint. Server Components call service functions directly; external consumers call REST endpoints. Both hit the same logic.

---

## 10. 10-Year Design Horizon

**Every component is designed for graceful evolution over a decade.** `/lib/services/` has zero framework imports — business logic survives a UI rewrite. Raw SQL migrations outlive every ORM. Standard protocols (REST, OAuth, SQL, HTTP) at every boundary. Every Tier 3 component is replaceable without touching Tier 1. (ADR-004)

The teaching portal serves Yogananda's published works — content that is timeless. The portal itself should be designed for an organization that thinks in decades, not quarters. SRF has existed since 1920. Component replacement is expected and planned for — it's maintenance, not failure.

Three durability tiers: Tier 1 (effectively permanent, 10+ years) — PostgreSQL, the service layer, the data model, SQL migrations, REST + JSON APIs, HTML + CSS, Terraform HCL, WCAG standards. Tier 2 (stable, 5-7 years) — Next.js, Vercel, Contentful (editorial source of truth from Arc 1; ADR-010). Tier 3 (replaceable) — specific npm packages, Claude model versions, embedding model versions, Auth0, Amplitude. The five longevity guarantees: all data in PostgreSQL; business logic is framework-agnostic; raw SQL migrations; standard protocols at boundaries; decisions are documented.

The search quality test suite (50-query golden set) serves as the acceptance gate for any AI model migration — you can swap embedding models or LLM providers and verify the system still works.

---

## 11. Parameters as Named Constants

**Specific numeric values (chunk sizes, rate limits, thresholds) are tunable defaults, not architectural commitments.** Implement them as named constants in `/lib/config.ts`. (ADR-123)

This principle protects the other ten. Without it, every operational parameter accumulates the governance weight of a principle. An engineer who needs to change a cache TTL from 5 minutes to 15 minutes should not feel they are violating an architectural decision. The distinction *preserves* the authority of actual principles by preventing parameter-level fatigue from eroding respect for the governance process.

Every parameter documents three things: its current value, the rationale for the default, and the evaluation trigger (what data would prompt reconsideration). When tuned based on evidence, the change is annotated in DESIGN.md: `*Parameter tuned: [date], [old] -> [new], [evidence].*` Milestone 1a.8 (search quality evaluation) and Milestone 2b success criteria explicitly include parameter validation as deliverables.

In year 7, a new developer can identify what's tunable versus what's sacred without reading the full DECISIONS.md archive.
