# SRF Online Teachings Portal — Project Context

## Current State

**Phase:** Design complete. Ready to begin Phase 0 (Foundation).

**What exists:** Comprehensive design documentation — CONTEXT.md (this file), DESIGN.md (architecture + 49 design sections DES-001 through DES-049), DECISIONS.md (101 ADRs, numbered 001–101, organized into 11 topical groups), ROADMAP.md (18 phases, 0–17). No code yet.

**What's next:** Phase 0 — Foundation. Repo setup, Neon provisioning, Vercel/Sentry configuration, initial schema migration, stakeholder kickoff. Then Phase 1 — Prove the Search. See ROADMAP.md § Phase 0 and § Phase 1 for deliverables.

---

## Open Questions

### Technical (resolve during Phase 1)

- [ ] Which edition of Autobiography of a Yogi is the canonical page-number reference? (1946 first edition, 1998 13th edition, or current printing?) All portal citations depend on this. (Relates to ADR-034)
- [ ] Does SRF have recordings of their temple singing bowls and chimes for the Quiet Corner audio (Phase 2)? If not, what is the sourcing policy for sacred audio?
- [ ] Optimal chunk size for Yogananda's prose style (test 200, 300, 500 token chunks). See ADR-048 for the formal chunking strategy specification.
- [ ] Multilingual embedding quality evaluation: when multilingual content is available (Phase 11), benchmark text-embedding-3-small against multilingual-optimized models (Cohere embed-v3, BGE-M3, multilingual-e5-large-instruct) using actual translated passages. Phase 1 English-only evaluation cannot assess cross-language retrieval quality. (ADR-047)
- [ ] Domain-adapted embeddings research: after Phase 11 corpus completion, evaluate fine-tuning a multilingual base model on Yogananda's corpus for world-class retrieval quality across all portal languages. Requires multilingual corpus and per-language evaluation suites as prerequisites. (ADR-047)
- [ ] Query expansion prompt engineering (test with diverse query types)
- [ ] Cross-book search vs. per-book search: should the default search span all books, or should seekers select a book first? The announcement implies cross-library search.
- [ ] "No results" experience: when the corpus doesn't contain relevant passages, what does the portal show? A gentle message? Suggested related topics?
- [ ] Zero-state search experience: when the seeker focuses the search bar but has not typed anything, what appears? Curated theme chips, sample questions, or nothing? This is an editorial statement about which teachings seekers encounter first — governance model needed. (ADR-049)
- [ ] Transliteration support for Indic script search suggestions: Hindi/Bengali seekers often type Romanized input (e.g., "samadhi" not "समाधि"). Should the suggestion system match across scripts? What about CJK substring matching? (ADR-049, Phase 11)
- [ ] Editorial governance of curated query suggestions: who authors and reviews the curated question forms (e.g., "How do I overcome fear?") shown in the suggestion dropdown? Same editorial review process as theme tagging, or a lighter-weight process? (ADR-049)
- [ ] Mobile search suggestion UX: on mobile, the OS keyboard already provides word suggestions, and a search autocomplete dropdown competes for screen space. Should the mobile suggestion experience differ from desktop (e.g., fewer suggestions, different trigger)? (ADR-049)
- [ ] Contentful free tier viability: 10,000 records and 2 locales may be insufficient at paragraph granularity. Evaluate whether a paid Contentful space is needed, or whether Phases 1–9 use Neon-only with Contentful deferred to production.
- [ ] Crisis query detection in search: when a seeker searches "I want to die," "how to end the pain," or similar acute-distress queries, the AI librarian would faithfully return passages about death and the soul's immortality — which, without context, could be read as affirming self-harm. Should the search intent classifier include a crisis detection layer that surfaces crisis resources *above* search results for certain query patterns? ADR-071 handles crisis resources on grief *content pages*, but search queries are the higher-risk surface. Requires coordination with the intent classification system (ADR-005 E1) and SRF input on theological framing. (Relates to ADR-071, ADR-005)
- [ ] Portal editorial voice guide: the portal's UI copy (error messages, empty states, loading text, ARIA labels, confirmation dialogs) collectively forms a verbal personality over 10 years of development. Should a micro-copywriting guide be created specifying tone, vocabulary, sentence length, and the use of "we" vs. passive voice — ensuring consistency as multiple developers write UI strings? Who reviews this guide — the same editorial team as theme tags, or a lighter-weight process? (Relates to ADR-074)
- [ ] Daily passage pool depth for Phase 1: with a single book (Autobiography of a Yogi), the Today's Wisdom pool may feel repetitive for daily visitors over months. What is the minimum pool size for a meaningful daily bibliomancy experience? Should Phase 1 include curated passages from the Autobiography specifically, or should the pool be artificially constrained until Phase 5 adds more books?
- [ ] @YoganandaSRF YouTube channel ID (needed for RSS feed URL in Phase 2)
- [ ] YouTube playlist inventory (map existing playlists to portal categories, needed for Phase 2)
- [ ] The 500th-visit experience: the design is rich with first-visit patterns (threshold, tooltips, Start Here). But the daily visitor who has been coming for three years — what does the portal feel like for them? Physical libraries have a mature relationship with their regulars (the librarian recognizes you, the shelves are familiar, you have your favorite chair). What is the digital equivalent — without tracking, without personalization, without violating DELTA? The daily passage pool, seasonal curation, and circadian choreography address *content* freshness; this question is about *relational* maturity. **Emerging answer: density, not recognition.** A library regular doesn't need the librarian to recognize them — what changes is the *efficiency of the space*: they know where the shelves are, they don't read the signs, they go directly to what interests them. The portal's equivalent is making the portal *denser for those who want density* without making it sparse for those who need space. Features already serving this: Focus mode (less), "Show deeper teachings" (more), `/browse` (maximum density), reader settings (personal tuning). The missing piece may be a voluntary seeker self-depth preference (see below) and a client-rendered "personal library" view that aggregates localStorage state — not recognition from the portal, but self-organized familiarity. (Relates to ADR-067, ADR-066, ADR-072)
- [ ] Portal sonic identity beyond the chime: the singing bowl chime and ambient soundscapes address the Quiet Corner and reader. But the portal's broader sonic palette is unspecified: the threshold? The Breath Between Chapters? Dwell activation? The default is silence — and that may be correct. But a considered sonic identity (even if 90% silence) would give the portal a dimension that purely visual design cannot. Should a sonic identity brief be created alongside the visual design tokens? (Relates to ADR-058)
- [ ] Contextual sharing and wrongful certainty: seekers will quote Yogananda out of context via the passage share feature. They will use the sharing tools to prooftext spiritual positions in arguments. The portal can't prevent this. But could the shared passage page (`/passage/[chunk-id]`) include context that gently resists decontextualization? Currently, the page shows "This passage appears in *[Book Title]*, Chapter [N]." Should it go further — e.g., a brief note about the chapter's topic, so the receiving person understands the teaching's home? What is the right balance between shareability and contextual integrity? (Relates to ADR-068, ADR-022)
- [ ] Negative space as a scholarly tool: the Reverse Bibliography (DES-027) maps what Yogananda *explicitly* referenced. But equally interesting is what's *absent* from the corpus — topics that are adjacent to the teachings but never directly addressed, questions seekers ask (from anonymized search trends) that the corpus genuinely cannot answer. Is mapping the boundaries of the corpus — its shape, its silences — within the portal's scope as a scholarly feature? Or does this require a separate research initiative? (Relates to DES-027)
- [ ] Community collection moderation at scale: if community curation (ADR-086) reaches thousands of submissions, the staff review queue becomes a bottleneck. Should there be a tiered moderation model — VLD moderators as first-pass reviewers, staff as final approvers? What is the right rejection feedback loop to maintain community goodwill? (Relates to ADR-086, ADR-087)
- [ ] Knowledge Graph accessibility: a visual, interactive, force-directed graph is one of the hardest UI patterns for WCAG 2.1 AA. Screen readers cannot traverse force-directed layouts. Keyboard navigation through thousands of nodes is impractical. What is the accessible alternative — a table view, a tree/outline view, or an entirely separate rendering mode that provides the same relational information? **Partially addressed:** `/browse` (DES-047) serves as the text-mode alternative to the graph — same content, hierarchical text format, ideal for screen readers. Remaining question: does `/browse` sufficiently cover the *relational* information (connections between items), or is an additional accessible view needed for the graph's edge data? (Relates to ADR-061, ADR-062, ADR-003, DES-047)
- [ ] Knowledge Graph mobile strategy: at cross-media scale (30,000–50,000 nodes), a force-directed graph on a 3G mobile connection in rural India is not viable. The 2-hop subgraph approach (max ~500 nodes) serves mobile, but is it sufficient for the "wandering exploration" experience the graph is meant to provide? Should mobile get a qualitatively different exploration UI? (Relates to ADR-062, ADR-006)
- [ ] Knowledge Graph as API: scholars and other SRF properties may want to query the teaching graph programmatically. The JSON-LD ontology export (ADR-043) serves concepts, and the graph JSON is publicly available, but should there be a formal graph query API (e.g., subgraph extraction, shortest-path between concepts)? What is the scholarly use case that justifies the API investment? (Relates to ADR-062, ADR-043)
- [ ] `/guide` visual design density: the portal's design language is warm cream, generous whitespace, serif typography. The `/browse` page has fundamentally different density requirements — maximum information, minimum ceremony. Should `/browse` adopt a slightly different style (tighter line-height, more compact spacing) while remaining within the design system, or should it maintain the same generous whitespace? What about `/guide` — does editorial framing require the full warm aesthetic, or benefit from the compact treatment? (Relates to DES-047)
- [ ] Chant text chunking and embedding quality: short, repetitive, metaphor-dense devotional poetry (e.g., *Cosmic Chants*) may embed poorly compared to expository prose using text-embedding-3-small. Should chant embeddings concatenate title + instructions + text for richer context? Does search quality for "find chants about divine love" need a different retrieval strategy than prose search? Evaluate during *Cosmic Chants* ingestion. (Relates to ADR-059, ADR-046)
- [ ] Chant structural metadata: does SRF annotate chants with musical/devotional structure (verses, refrains, call-and-response markers, raga associations)? If so, the chant reader should render this structure rather than treating the text as undifferentiated lines. If not, should the portal introduce structural markup, or preserve the book's original formatting? (Relates to ADR-059)
- [ ] Chant-to-recording catalog: does SRF maintain an existing mapping between specific chants and their audio/video recordings? If yes, the `performance_of` editorial linking (ADR-059) is a data import. If no, this is a curation task that must be scoped into Phase 14 editorial workload. (Relates to ADR-059, ADR-057)
- [ ] Edition variance policy: when multiple editions of a book exist with textual variants (e.g., 1946 first edition vs. current printing of *Autobiography of a Yogi*), which edition is canonical for the portal's verbatim text? Does the portal serve a single authoritative edition per book, or acknowledge variants? This affects content integrity hashing (ADR-039), citation page numbers, and the meaning of "verbatim." (Relates to ADR-001, ADR-034, ADR-039, ADR-007)
- [ ] Spiritual terminology bridge governance: the vocabulary mapping between modern/secular terms and Yogananda's terminology (ADR-049 "bridge-powered suggestions") is arguably the most theologically sensitive component in the search system — it asserts semantic equivalence between concepts (e.g., "mindfulness" → "concentration"). Who reviews and approves this mapping? Monastic theological review, the same editorial team as theme tags, or a dedicated process? How often is the bridge audited for accuracy? (Relates to ADR-049, ADR-005, ADR-007)
- [ ] Fidelity re-validation cadence: chunk boundaries, theme classifications, and highlight-boundary selections (ADR-005 C3) are set at ingestion time. As the corpus grows and search patterns evolve, these could become semantically stale — a chunk that was coherent in isolation may need different boundaries once related passages exist, or a theme tag may be too narrow. Is there a periodic re-validation process, or are ingestion-time decisions permanent? What triggers re-evaluation? (Relates to ADR-048, ADR-032, ADR-005, ADR-007)
- [ ] Unicode NFC normalization as mandatory ingestion step: IAST diacritical marks (ā, ṇ, ś, ṣ) can be represented as precomposed (NFC) or decomposed (NFD) Unicode. OCR output is unpredictable about which form it produces. NFC normalization must be applied before text comparison, deduplication, embedding, or indexing. Validate during Phase 1 ingestion of *Autobiography*. (ADR-080)
- [ ] Devanāgarī font timing: the Phase 1 English corpus contains Devanāgarī script in *God Talks with Arjuna* (original Bhagavad Gita verses). Noto Sans Devanagari is currently scheduled for Phase 11 (ROADMAP.md). ADR-080 moves it to Phase 1. Confirm during Gita ingestion whether Devanāgarī is also present in *The Holy Science*. (ADR-080, ADR-048)
- [ ] IAST diacritics rendering verification: Merriweather and Lora must render IAST combining characters (ā, ī, ū, ṛ, ṝ, ḷ, ṃ, ḥ, ñ, ṅ, ṭ, ḍ, ṇ, ś, ṣ) correctly at all font sizes, particularly `--text-sm` (15px). Include in Phase 2 design QA and accessibility audit. (ADR-080, ADR-003)
- [ ] Mixed-script embedding quality for Gita commentary: validate during *God Talks with Arjuna* ingestion that excluding Devanāgarī from the embedding input (while including romanized transliteration and English commentary) does not degrade retrieval quality for verse-specific queries like "Bhagavad Gita IV:7." (ADR-080, ADR-048, ADR-046)
- [ ] Presidential lineage timeline as graph filter vs. standalone component: the `/explore` knowledge graph gains a "Lineage" filter mode (ADR-037) that renders succession and guru lineage as a directed vertical layout. Is this sufficient for the lineage visualization, or should the `/people` page timeline be a richer standalone component with photographs, service period details, and editorial narrative? (ADR-037, ADR-061, ADR-062)
- [ ] Editorial queue health monitoring: as review queues grow across phases (theme tags, translations, community collections, social media, feedback, corrections, VLD submissions), what is the escalation path when backlogs exceed a monastic editor's 2–3 hour daily window for weeks? Should the admin portal include queue health indicators (oldest unreviewed item, items exceeding age thresholds, depth trends)? What is the age threshold per queue type — 48 hours for citation errors, 7 days for standard items? (Relates to ADR-082, DESIGN.md § Unified Review Queue Abstraction)
- [ ] Editorial pipeline observability: the portal has rich technical observability (Sentry, New Relic, Amplitude) but no observability for the editorial pipeline — average review time per item type, AI tag approval rate, translation review efficiency, queue throughput trends. These metrics would optimize the staff experience over time. Should they be built into the admin portal, or is Retool sufficient? (Relates to ADR-082, ADR-095)
- [ ] Admin portal accessibility: the seeker-facing portal has WCAG 2.1 AA from Phase 2. The admin portal serves monastic editors with variable technical comfort and potentially VLD members with disabilities. Should the same accessibility standards apply to `/admin`? (Relates to ADR-003, ADR-082)
- [ ] Editorial conflict resolution: when two reviewers disagree on a theme tag, tone classification, or collection approval (e.g., "this passage belongs under Joy, not Peace"), what is the resolution process? Escalate to theological reviewer? Tag with both? The admin portal needs a disagreement workflow. (Relates to ADR-032, ADR-082)
- [ ] Queue failure mode: if the content editor is unavailable for two weeks, do AI-proposed theme tags accumulate? Is there a backup reviewer? Does the daily passage system have enough runway to operate without curation attention? What is the minimum editorial coverage needed to keep the portal healthy? (Relates to ADR-082, ADR-032)
- [ ] Operational playbook timing: procedural documentation ("how to add a new book," "how to handle a translation batch," "how to onboard a new staff member to `/admin`") should be written alongside the editorial review portal in Phase 5. Should this live in `/docs/operational/playbook.md`, in the admin portal's help section, or both? (Relates to ADR-082, ADR-098)
- [ ] Cloudflare R2 vs S3 for media assets: Phase 14 introduces audio streaming (CloudFront + S3) and image galleries. Cloudflare R2 has zero egress fees (S3 egress can surprise at scale), is S3-API-compatible, and aligns with the existing Cloudflare edge layer. For a free portal serving audio globally over a 10-year horizon, egress costs matter. Evaluate R2 vs S3 during Phase 14 planning. (Relates to ADR-057, ADR-004)
- [ ] pgvector HNSW tuning strategy at multilingual scale: at Phase 11 (9 languages, ~400K chunks × 1536 dimensions), the HNSW index parameters (`m`, `ef_construction`, `ef_search`) directly affect recall and latency. If the corpus grows further (magazine archives, audio transcripts, video transcripts — potentially 200K+ additional chunks), index size and query latency become real considerations. Document the tuning strategy and the evaluation threshold that would trigger Neon compute scaling. (Relates to ADR-009, ADR-046, ADR-047)
- [ ] AI cost threshold for graceful degradation: the portal uses Claude Haiku for every search via Bedrock (~10,000 searches/day projected, ~$200-400/month at current pricing per ADR-014). AI pricing is the most volatile cost in the stack. No ADR specifies the cost threshold that triggers the fallback path (skip Claude, use raw RRF scores). The philanthropist's foundation should understand AI cost as a variable, not a fixed number. Document the degradation trigger and communicate to stakeholders. (Relates to ADR-014, ADR-004)
- [ ] GitLab migration plan: Phase 10 migrates from GitHub to GitLab per SRF's IDP. This is not just a repo move — it's CI/CD pipeline rewrite (GitHub Actions → GitLab CI), Terraform state backend migration (Terraform Cloud → GitLab Terraform backend), and developer workflow change. No ADR governs the migration plan. This deserves one before Phase 10 planning begins. (Relates to ADR-016, ADR-018, ADR-017)
- [ ] Neon vendor-specific operational features: ADR-004 and ADR-019 address data portability (pg_dump, S3 backups). But the portal's *operational* reliance on Neon-specific features — branching (testing, ADR-094), connection pooler (production), autoscaling (cost management) — is underspecified. Migrating to another PostgreSQL host (RDS, Supabase, self-hosted) works for data but loses these capabilities. The mitigations are straightforward (PgBouncer is generic, branching is a convenience, autoscaling has RDS equivalents) but should be explicitly documented in the 10-year horizon. (Relates to ADR-004, ADR-019, ADR-013)
- [ ] Cloudflare dependency depth: Cloudflare provides DNS, WAF, DDoS protection, bot management, CDN, and image optimization for the portal. Rate limiting (ADR-023), crawler policy (ADR-081), and caching strategy all depend on Cloudflare-specific features. An edge provider migration would be non-trivial. Is this within the 10-year risk tolerance, or should the Tier 3 replacement analysis in ADR-004 include Cloudflare? (Relates to ADR-004, ADR-023, ADR-081)
- [ ] SQS for email fan-out reliability: Phase 9 daily email dispatch fans out to all subscribers. ADR-017 routes this through EventBridge Scheduler → Lambda. For large subscriber lists, placing SQS between Lambda and the email API provides better retry semantics, dead-letter handling, and back-pressure management than direct Lambda → Resend/SES invocation. Evaluate during Phase 9 design. (Relates to ADR-091, ADR-017)
- [ ] Google Search Console as DELTA-compatible discoverability signal: Google Search Console provides query-level search impression data (what web queries lead to portal URLs) without any user tracking on the portal itself. Unlike Google Analytics, GSC measures the *web's* knowledge of the portal, not the *seeker's* behavior on it. Should GSC be evaluated for DELTA compliance and adopted alongside Amplitude? It would answer "is the portal discoverable?" — a question the SEO-friendly architecture (DES-047, semantic HTML, OG cards) is designed to enable but currently can't measure. No cookies, no client-side scripts, no user identification. (Relates to ADR-095, DES-047)
- [ ] AI cost alerting and degradation trigger: ADR-014 estimates ~$200-400/month for Claude Haiku search calls. No ADR specifies the cost threshold that triggers the graceful degradation fallback (skip Claude, use raw RRF scores), nor the alerting mechanism (CloudWatch billing alarm, New Relic custom metric, or manual monthly review). AI pricing is the most volatile line item in the operational budget. Define: (a) the monthly cost threshold that triggers investigation, (b) the threshold that triggers automatic degradation, (c) the alerting channel (Sentry? PagerDuty? Email to AE team?). Communicate to the philanthropist's foundation that AI cost is a variable, not a fixed number. (Relates to ADR-014, ADR-004, ADR-095)
- [ ] Observability stack cost trajectory: Amplitude, New Relic, Sentry, and Vercel Analytics all have free tiers that work for development and early production but may hit plan limits at scale. New Relic in particular can become expensive (per-host pricing, data ingest charges). Map the cost trajectory for year 1 → year 3 under projected traffic. If observability costs exceed the AI costs, the stack is wrong. Evaluate during Phase 7 observability buildout. (Relates to ADR-095, ADR-004)
- [ ] Phase 15 minimum age for user accounts: GDPR Art. 8 sets 16 as the default age of digital consent (member states may lower to 13). COPPA sets 13 in the US. When user accounts are introduced in Phase 15, the signup flow must include age verification. What minimum age does SRF want — the GDPR default of 16, or a member-state-specific approach? The email subscription (Phase 9) already requires 16. (Relates to ADR-099)
- [ ] `search_queries` long-term anonymization: the raw table retains individual query text indefinitely (~73 MB/year). While queries carry no user identifiers, sufficiently distinctive query text could theoretically be re-identifying. Should the raw table be periodically anonymized (e.g., aggregate and delete queries older than 2 years), or is the current design (no user identifiers, aggregation threshold of 10 in reporting) sufficient? (Relates to ADR-053, ADR-099)
- [ ] Operational dashboard cadence and ownership: the Phase 7 Retool dashboard and Phase 11 Impact Dashboard produce metrics, but neither specifies *who reviews them, how often, or what triggers action*. A dashboard that no one reviews weekly creates a false sense of monitoring. Define: (a) the portal coordinator's weekly review checklist (editorial queue depth, zero-result rate, AI cost, geographic performance), (b) the leadership review cadence (monthly? quarterly?), (c) the escalation path when a metric exceeds its threshold. (Relates to ADR-082, ADR-095, DESIGN.md § Standing Operational Metrics)
- [ ] Interaction modality detection: should the portal use `@media (hover: hover)` and `@media (pointer: fine/coarse)` alongside viewport breakpoints to select interaction patterns (dwell mode triggers, share menu style, glossary term reveal, touch target sizing)? This would serve tablet+keyboard users with desktop-class interactions and touchscreen desktop users with touch-class affordances — more accurate than viewport width alone. DES-049 proposes specific CSS media queries; validate during Phase 2 component development. (Relates to DES-049, DES-009, ADR-024, ADR-003)
- [ ] Smart display and casting use cases: Google Nest Hub, Amazon Echo Show, and Chromecast/AirPlay casting to TVs are natural surfaces for daily passage and group reading. The API-first architecture (ADR-011) and structured data (ADR-043) enable these as new API consumers. Should smart display integration be scoped as a future channel (alongside WhatsApp, SMS, IVR per ADR-026), or is this outside the portal's scope? For casting specifically: does Presentation mode (ADR-006 §5) need a companion `data-mode="cast"` CSS mode optimized for the 10-foot UI paradigm (large text, no hover, D-pad navigation)? (Relates to DES-049, ADR-006, ADR-026, ADR-011)
- [ ] Print stylesheet specification: seekers in the Global South may print chapters at cybercafés, and study groups may print passages for discussion. DES-049 proposes a baseline print stylesheet. Should the portal include a "Print this chapter" button in the reader UI, or rely on the browser's native print function? Should printed output include a QR code linking back to the digital chapter for the "read more" bridge? Does SRF want specific branding or copyright text on printed pages? (Relates to DES-049, ADR-006 §1, ADR-001)
- [ ] Seeker self-depth preference: the `accessibility_level` classification (ADR-005 E3) gates content by depth (universal/accessible/deep), but the seeker has no way to tell the portal "I don't need the newcomer experience." A voluntary reader-settings toggle — "Exploring" / "Studying" / "At home here" — stored in `localStorage` alongside font size and theme, would control: default content depth in Today's Wisdom and theme pages, glossary auto-highlight behavior, whether "Start Here" appears, and search suggestion vocabulary density. This is not tracked progression or gamification — it's a preference declaration, like choosing font size. Key design questions: (a) Is self-identification an act of agency (DELTA-aligned) or a form of self-categorization that the portal shouldn't invite? (b) Should the labels avoid any hierarchy — "Exploring" / "Studying" / "At home here" rather than "Beginner" / "Intermediate" / "Advanced"? (c) A seeker in spiritual crisis should be able to change this setting without feeling like regression. (Relates to ADR-005 E3, ADR-095, ADR-072, ADR-067)
- [ ] Personal library as localStorage aggregation: by Phase 8, `localStorage` holds bookmarks (ADR-066), reader settings, study outlines (ADR-083), focus mode preference, text-only mode, and "What's New" state. This is already a profile — the portal just doesn't acknowledge it. Should a client-rendered `/library/mine` page (or a tab on `/bookmarks`) gather all localStorage state into a unified view — bookmarked passages by book, study outlines, books visited, preferences summary? This page would make zero API calls (reads only from localStorage), include a clear note that everything is device-local, and provide the "personal library" feeling without any server-side personalization. The risk: does acknowledging the localStorage profile violate the spirit of "no personalization," or does it honor the seeker's agency by showing them their own choices? (Relates to ADR-066, ADR-083, ADR-095, ADR-067)
- [ ] localStorage export/import for cross-device portability: instead of requiring accounts for cross-device sync, the portal could offer "Save my library" (export all localStorage as a JSON file) and "Restore my library" (import). This covers ~80% of the sync use case without server infrastructure, Auth0, or GDPR implications. It may actually be *better* for shared devices (ADR-006 §3): a file that must be explicitly loaded is more private than an account that stays logged in. Key questions: (a) Is this sufficient, or does the Global South context (low tech literacy, shared devices, intermittent connectivity) require something simpler? (b) Should the export be encrypted for additional privacy? (c) Does this reduce the urgency of Phase 15 accounts, or does it complement them? (Relates to ADR-066, ADR-083, ADR-006 §3, Phase 15)
- [ ] Account timing and the anonymous-first theological stance: Phase 15 places optional accounts very late. The practical argument for earlier accounts is cross-device sync and personalized email (Phase 9). The philosophical argument against is that the portal's anonymous-by-default design is a theological statement — "you don't owe us your identity to receive these teachings." Moving accounts earlier risks introducing a "this would work better if you signed in" undertone to Phases 4–14, subtly shifting the portal from "everything is free" to "everything is free, but more is available if you register." If the export/import pattern (above) handles cross-device portability and the email subscription (Phase 9) uses token-based auth without full accounts, is there a compelling reason to move accounts earlier? Or should accounts arrive in Phase 15 precisely because they are for *community identity* (collections, curation attribution) rather than individual convenience? (Relates to ADR-066, ADR-083, ADR-099, Phase 15, Phase 9)
- [ ] The underserved middle seeker (6 months to 5 years): the portal serves discoverers well (accessibility defaults, Start Here, `/guide`) and will serve veterans well (Knowledge Graph, Related Teachings, Study Workspace, full vocabulary). The middle seeker — reading multiple books, possibly taking Lessons, regularly visiting — is architecturally underserved. They'd benefit from: seeing which books they've engaged with ("new to you" surfacing), a "my library" sense that reflects their accumulated relationship with the portal, and content-depth defaults that don't require the "Show deeper teachings" toggle every visit. The seeker self-depth preference and personal library page (above) address this. Are there other needs specific to this population? (Relates to ADR-067, ADR-005 E3, ADR-066)
- [ ] Study circle leader as distinct persona: DESIGN.md § Staff & Organizational Personas includes study circle leaders under External Personas, but their needs may be more developed than a single line captures. They have a *communal* relationship with the portal — preparing weekly satsanga readings, sharing passages with groups, presenting chapters. They are power users of the Study Workspace (ADR-083), community collections (ADR-086), Presentation mode (Phase 8), and Study Circle Sharing (DES-046). Should "I'm preparing for a group" be a recognizable mode or workflow in the Study Workspace, rather than something the leader assembles ad hoc from individual features? (Relates to ADR-083, ADR-086, DES-046)
- [ ] Editorial capacity modeling across phases: DES-035 catalogs 25+ AI-assisted workflows that all require human review. As the corpus grows from 1 book (Phase 1) to 15+ books plus cross-media content (Phase 14+), review volume grows multiplicatively — more content types × more workflows × more languages. ADR-100 establishes a workflow maturity model (Full Review → Spot-Check → Exception-Only), but the *capacity equation* remains unmodeled. What are the projected review hours per phase? At what phase does the monastic editor's 2–3 hour daily window become insufficient even with maturity graduation? When does the portal need a second editorial reviewer, and what is the minimum viable editorial team? Model this before Phase 5 planning — the maturity model's graduation pace depends on whether capacity is tight or generous. (Relates to ADR-100, ADR-082, DES-035)
- [ ] MCP as three-tier corpus access layer: the SRF Corpus MCP (ADR-097, DES-031) is currently framed as development tooling. But three additional tiers of AI consumer already exist in the design: (a) *internal editorial AI agents* — all 25+ DES-035 workflows need corpus access (theme tag proposal needs similar-passage retrieval, guide pathway generation needs ontology traversal, translation review needs cross-language passage alignment); (b) *internal cross-property consumers* — the SRF mobile app, other SRF web properties, the Retool dashboard; (c) *external AI assistants* — ChatGPT, Claude, Gemini, and custom agents answering seeker questions about Yogananda's teachings. The API-first architecture (ADR-011) was designed for "any future consumer" — MCP is the AI-native realization of that promise. Key questions: Should the MCP bifurcate into development, internal, and external tiers? What tools do internal AI workflows need beyond the six development tools (e.g., `get_graph_neighborhood`, `find_concept_path`, `get_passage_translations`, `verify_citation`)? Does the Knowledge Graph (ADR-062) need MCP-native traversal tools? What fidelity metadata should external MCP responses carry to enforce "verbatim only, attribution required"? What are the rate limiting and cost implications of a production-facing MCP? (Relates to ADR-097, ADR-101, ADR-011, ADR-062, ADR-001, ADR-026, DES-031, DES-035)
- [ ] MCP fidelity contract for external AI consumers: when external AI assistants retrieve verbatim passages via MCP and then present them to seekers, the portal can't control presentation. An AI might summarize across passages (violating ADR-001's spirit), drop citations, or juxtapose Yogananda's words with other traditions in ways SRF might find inappropriate. Should MCP responses carry structured fidelity metadata (`presentation: "verbatim_only"`, `paraphrase_permitted: false`, `attribution_required: true`)? This is unenforceable but signals intent — analogous to Creative Commons metadata. The alternative is position 1: serve faithful data and accept that downstream presentation is outside the portal's jurisdiction. (Relates to ADR-101, ADR-001, ADR-075)
- [ ] MCP copyright implications: "freely accessible on the portal" and "freely redistributable through any AI assistant worldwide" are different copyright postures. If an external MCP serves full passages that an AI presents in its own interface, is the AI a display of the portal or a redistribution of the content? This is a legal and stakeholder question, not a technical one. (Relates to ADR-101, ADR-081, ADR-099)

### Stakeholder (require SRF input)

- [ ] What is the relationship between this portal and the SRF/YSS app? Complementary or overlapping reader? Will the portal's search eventually power the app?
- [ ] Who will manage the editorial workflow — theme tagging, daily passage curation, text QA? Monastic order, AE team, or dedicated content editor?
- [ ] What does the philanthropist's foundation consider a successful outcome at 12 months? (Shapes analytics and reporting.)
- [ ] Can SRF provide center location data (addresses, coordinates, schedules) for an in-portal "Meditation Near Me" feature?
- [ ] What is SRF's copyright/licensing posture for the portal content? Read online only, or also downloadable/printable? What attribution is required? *All non-Lessons material is offered free of charge. The architecture supports both read-online and downloadable formats. SRF should determine specific licensing terms at their discretion.*
- [ ] About page content: does SRF have approved biography text for Yogananda and descriptions of the line of gurus, or do we draft for their review?
- [ ] Does SRF/YSS have **digital text** of official translated editions? If only printed books, OCR per language is a massive effort requiring fluent reviewers. (Critical for Phase 11 scoping.)
- [ ] Which books have official translations in which languages? (Content availability matrix — determines what each language's portal experience looks like.)
- [ ] Who reviews the AI-drafted UI translations (~200–300 strings)? Claude generates drafts (ADR-078), but human review is mandatory. Does SRF have multilingual monastics or volunteers who can review for spiritual register and tone?
- [ ] Should Hindi and Bengali be prioritized alongside the Western-language set? Yogananda's heritage, YSS's Indian audience (~millions), and the mission of global availability argue strongly for inclusion. (ADR-077)
- [ ] For Hindi/Bengali: same portal domain (`teachings.yogananda.org/hi/`) or YSS-branded domain? Organizational question with architectural implications.
- [ ] Do translated editions preserve paragraph structure? If yes, `canonical_chunk_id` alignment during ingestion is straightforward (match by chapter_number + paragraph_index). If translations reorganize content, alignment requires semantic matching. (Critical for Phase 11 cross-language linking.)
- [ ] Does the teaching portal get its own mobile app, or do portal features (search, daily passage, reader) integrate into the existing SRF/YSS app? The API-first architecture (ADR-011) supports either path.
- [ ] Is *Cosmic Chants* one canonical volume or a family of editions/compilations? Are there distinct collections (e.g., *Cosmic Chants* vs. devotional songs within other books) that need separate modeling? Should the SRF app's chant practice feature (if it exists) be linked from the portal as a "signpost"? (Relates to ADR-059)
- [ ] Does SRF prefer the portal repo in GitLab from day one (per SRF IDP standards), or is GitHub acceptable for Phases 1–9 with a planned Phase 10 migration? The Terraform code and CI/CD pipelines are SCM-agnostic; only the workflow files change.
- [ ] What Sentry and New Relic configurations does SRF use across their existing properties? Aligning observability tooling enables operational consistency.
- [ ] What are the content licensing terms for portal-served content — read-online only, or also downloadable/redistributable? Does the permissive `robots.txt` extend to AI training crawlers ingesting full book text? (Relates to ADR-081)
- [ ] Does the philanthropist's foundation want to publish "What Is Humanity Seeking?" as a standalone annual communications asset (report, subdomain, media syndication)? If so, communications planning should begin before the Phase 7 dashboard ships. (Relates to ADR-090)
- [ ] Can SRF provide recordings of Yogananda's own voice for an IVR/audio pilot during the Hindi/Bengali launch (Phase 11), rather than deferring all voice access to Phase 16? (Relates to ADR-026)
- [ ] What format should the annual "What Is Humanity Seeking?" impact report take — PDF, web page, or both? Published by SRF or the philanthropist's foundation? (Phase 7+; relates to ADR-090)
- [ ] Crisis resource policy: Should the portal display locale-appropriate crisis helpline information (e.g., 988 Suicide and Crisis Lifeline, local equivalents) alongside grief and death-related content? What is SRF's preferred approach to acknowledging that seekers in acute distress may reach the portal? (Relates to ADR-071)
- [ ] How does SRF frame the portal's impact for the philanthropist's foundation when the most meaningful outcomes are unmeasurable? The "What Is Humanity Seeking?" narrative (ADR-090) reframes the question — does the foundation find this framing sufficient, or do they require conventional reach metrics? (Relates to § Measuring Success)
- [ ] What is the inner orientation SRF envisions for the editorial team? The content editor, theological reviewer, and translation reviewer roles (§ Operational Staffing) carry spiritual responsibility — curating what seekers encounter. Does SRF see these as devotional service roles, professional positions, or both? This shapes workflow design and staffing criteria.
- [ ] Extreme-context access: the portal specifies 3G in rural India as a performance target, and ADR-006 addresses Global South delivery. But the *emotional* context of certain access scenarios carries design implications beyond bandwidth. A seeker in a hospital waiting room, a prison, a refugee camp, or a hospice has different needs than someone in a home office. The Quiet Corner partially addresses crisis moments. Are there even lighter-weight surfaces — perhaps a single-URL, <10KB experience — designed for environments where cognitive load, connectivity, and privacy are all severely constrained? Does SRF want the portal to be explicitly designed for institutional contexts (hospitals, prisons, chaplaincies)?
- [ ] Design intent preservation: the documentation captures architecture and decisions, but the *spirit* behind those decisions — why the haptic pattern mimics a singing bowl's decay, why the threshold is a breath and not a logo reveal, why the parting passages exist — is the hardest thing to maintain across staff turnover. In year 7, will a new developer understand the contemplative reasoning? Should a "Design Intent" companion document be created — not an ADR (which records *what* was decided) but a narrative that explains *why it feels the way it feels*? Who maintains it? (Relates to ADR-098, § Documentation–Code Transition in CLAUDE.md)
- [ ] Community curation governance: who within SRF reviews community-submitted collections (ADR-086)? The same editorial team as theme tags, or a separate community management role? What are the theological boundaries for collection approval — can passages be juxtaposed from different books, or must collections stay within a single work? What disclaimer text does SRF want on community-curated collections? (Relates to ADR-086)
- [ ] VLD portal roles: does SRF want VLD members to have portal accounts with a `vld` role for curation delegation (ADR-087)? If so, who manages VLD role assignment — SRF membership office, AE team, or monastic oversight? Can VLD curation service count toward VLD service hours? (Relates to ADR-087)
- [ ] Community collection attribution and ego: spiritual communities have tensions around recognition. Should published community collections carry curator names, or be anonymous by default? Does SRF prefer "Curated by [Name]" or "Curated by a devotee"? Is attribution important for accountability, or does it create unwanted ego dynamics? (Relates to ADR-086)
- [ ] Relationship between community curation and official SRF publications: SRF already publishes reading guides and study materials through its own channels. Does community curation complement or compete with official publications? Should community collections be visually distinct from staff-curated Editorial Reading Threads (DES-026)? (Relates to ADR-086, DES-026)
- [ ] `/guide` alignment with SRF reading recommendations: SRF may already publish recommended reading orders or topical reading guides through its own channels. The `/guide` page (DES-048) should align with, not compete with, SRF's pastoral voice. Does SRF have existing reading recommendation materials that should inform the `/guide` page content? Should `/guide` be reviewed by the same theological reviewers as editorial reading threads? (Relates to DES-048, DES-026)
- [ ] Young seekers and editorial voice: the portal will be visited by teenagers — a 14-year-old grieving a grandparent, a 17-year-old curious about meditation from a yoga class. The contemplative voice, slow pace, and absence of gamification naturally serve this population well. But should the editorial voice *acknowledge* their existence? The "Young Seeker" life-phase pathway in DES-048 frames the entry through a universal question ("What should I do with my life?") rather than an age label, and uses accessibility level 1 passages with `practical`/`joyful` tone. Does SRF want the portal to be explicitly welcoming to young seekers, or should the portal's agelessness be its mode of inclusion? Does the minimum-age question (Phase 15 accounts) need to be considered earlier for features like the Quiet Corner or Today's Wisdom that require no account? (Relates to DES-048, ADR-095)
- [ ] Worldview-sensitive `/guide` pathways: the `/guide` page currently organizes pathways by spiritual need ("If you are dealing with loss") and corpus entry point ("If you are a student of the Bhagavad Gita"). Seekers also arrive from different epistemological starting points — Christian contemplatives, Buddhist meditators, scholars of comparative religion, people interested in the science of consciousness. Yogananda himself engaged deeply with multiple traditions (*The Second Coming of Christ*, *Wine of the Mystic*, scientific framing of yoga). Should the `/guide` page include worldview-sensitive pathways (e.g., "If you come from a Christian contemplative tradition," "If you have a Buddhist meditation practice," "If you are interested in the intersection of science and spirituality")? These are editorial content decisions, not architectural changes — the existing DES-048 template supports them. Requires SRF input on whether acknowledging other traditions as valid starting points aligns with their pastoral voice, and whether such pathways should be reviewed by the same theological reviewers as editorial reading threads. (Relates to DES-048, ADR-033, DES-027, ADR-051)
- [ ] SRF editorial policy on contested transliterations: SRF publications use house romanizations that sometimes diverge from academic IAST — "Babaji" vs. "Bābājī," "Kriya Yoga" vs. "Kriyā Yoga." The portal follows SRF's published spellings for display (ADR-080). Does SRF confirm that their house style is the canonical form for all portal display text? Are there plans to standardize diacritics usage across future editions? (Relates to ADR-080, ADR-034)
- [ ] Sanskrit term pronunciation recordings: does SRF have, or want to create, approved audio pronunciation recordings for key Sanskrit terms used in Yogananda's writings (samadhi, pranayama, Kriya Yoga, Aum, etc.)? If monastic recordings are desirable, when would they be available? The glossary schema (ADR-038, ADR-080) reserves a `pronunciation_url` column for this purpose. (Relates to ADR-080, ADR-038)
- [ ] *God Talks with Arjuna* Devanāgarī content: confirm that the portal should display original Devanāgarī Bhagavad Gita verses alongside Yogananda's English commentary, and that these verses should be rendered (not omitted or replaced with romanization only). Does SRF have a preferred Devanāgarī typeface, or is Noto Sans Devanagari acceptable? (Relates to ADR-080, ADR-048)
- [ ] Monastic content scope — content *by* vs. *about*: the People Library preserves biographical context about monastics (ADR-036, ADR-037). But should the portal host content *by* monastics — convocation talks, published articles, editorial contributions? If so, this requires an `authored_by` or `presented_by` relation linking content to person entries, and raises questions about how monastic-authored content relates to Yogananda's verbatim teachings in search ranking and display hierarchy. (Relates to ADR-037, ADR-036, ADR-001)
- [ ] Living monastic editorial sensitivity: the People Library includes `is_living` tracking (ADR-037). What level of biographical detail does SRF approve for current monastics — name and role only, or full biography with service history? Are there specific monastics SRF wants featured at launch? Who reviews and updates monastic entries as roles change? (Relates to ADR-037, ADR-036)
- [ ] Presidential succession editorial framing: the portal can display factual succession data (names, service dates). Does SRF want editorial narrative accompanying each president's entry — a description of their contribution to the SRF mission? If so, does SRF provide this text, or does the portal team draft it for SRF review? (Relates to ADR-037)
- [ ] Portal coordinator role: who owns cross-queue editorial health — tracking content pipeline status, editorial backlog depth, VLD activity, and upcoming calendar events needing attention? Is this a monastic role, an AE team role, or a dedicated position? This role is critical by Phase 5 when editorial queues activate. (Relates to ADR-082, DESIGN.md § Staff & Organizational Personas)
- [ ] VLD coordinator role: who creates curation briefs for VLD members, monitors submission quality, manages trusted submitter status, and communicates with VLD volunteers? Is this the same person as the portal coordinator, or a separate role? (Relates to ADR-087)
- [ ] VLD service reporting: if portal curation counts toward VLD service hours, does SRF need a participation report from the portal? Does this conflict with the no-gamification principle (service counts visible to SRF administrators only, never to VLD members themselves)? (Relates to ADR-087, ADR-095)
- [ ] VLD expansion beyond curation: ADR-087 designs VLD participation for collection curation. Future tiers could include translation review, theme tag review, feedback triage, and content QA — each with appropriate Auth0 role scoping. Does SRF want to plan for this expansion, or should VLD participation remain limited to curation? (Relates to ADR-087, ADR-082)
- [ ] Existing SRF editorial voice guide: ADR-074 proposes a portal editorial voice guide for UI copy. Does SRF already have brand voice guidelines across its properties? The portal should extend them, not compete. (Relates to ADR-074)
- [ ] Existing VLD digital tooling: does SRF's existing VLD infrastructure (volunteer.yogananda.org) have digital tooling that the portal's VLD dashboard should integrate with, or is a separate portal-specific dashboard appropriate? (Relates to ADR-087)
- [ ] Monastic content editor's current digital workflow: do monastic editors currently use email, Slack, paper notes, or other tools for editorial coordination? Understanding existing workflows avoids forcing unfamiliar patterns. (Relates to ADR-082)
- [ ] Seasonal editorial calendar ownership: the portal's content needs vary by season (Christmas, Mahasamadhi, Convocation, Navratri) — each requiring curated passages, calendar event associations, and possibly themed collections. Does SRF have an annual editorial calendar? Who owns it? Should the admin portal include a "plan next month" view? (Relates to DES-028, ADR-082)
- [ ] Cross-property content correction coordination: when a text correction is made in one SRF property (bookstore, app, portal), how does it propagate to others? Is there a shared content source of truth, or does each property maintain its own? (Relates to ADR-034, ADR-039)
- [ ] Philanthropist's foundation operational visibility: does the foundation want insight into editorial pipeline health (queues running smoothly, content progressing through ingestion), or only impact metrics (countries reached, themes searched)? This shapes whether the Impact Dashboard needs an optional operational health tab. (Relates to ADR-090, ADR-082)
- [ ] Data controller identity for GDPR: who is the data controller — SRF, the philanthropist's foundation, or both? This determines who signs Data Processing Agreements with sub-processors, who responds to data subject access/erasure requests, and who appoints the Data Protection Officer (if required). If the foundation has any role in determining *what* data is collected or *how* it's processed, they could be a joint controller (GDPR Art. 26), requiring a joint controller agreement. (Relates to ADR-099)
- [ ] Does SRF already have Data Processing Agreements (DPAs) with shared vendors? Auth0, Neon, Vercel, Cloudflare, Sentry, New Relic, and Amplitude are used or planned across SRF properties. Existing DPAs may already cover the portal's needs. (Relates to ADR-099)
- [ ] India's DPDPA cross-border transfer provisions: the Digital Personal Data Protection Act (2023) applies to processing personal data of individuals in India. Cross-border transfer rules are still being finalized. The portal targets Indian seekers (Hindi, Bengali, YSS audience). Monitor DPDPA implementation rules as Phase 11 (Hindi/Bengali) approaches. (Relates to ADR-099, ADR-077)
- [ ] Brazil LGPD Data Protection Officer requirement: Brazil's LGPD requires a DPO equivalent (encarregado) for entities processing Brazilian personal data. The portal serves Portuguese-language content (Phase 11). Whether SRF needs an encarregado depends on the volume of Brazilian data subjects and whether existing SRF legal counsel covers this. (Relates to ADR-099)
- [ ] Does the SRF convocation site self-host Google Fonts? If SRF's existing new-standard properties already self-host fonts, this is a settled pattern. If they use Google Fonts CDN, the portal's self-hosted approach (ADR-099) should be proposed as the new standard. (Relates to ADR-099)
- [ ] Feature request governance: over a decade, feature requests will arrive from monastic leadership, AE team, seekers (via feedback), VLD members, and the philanthropist's foundation. What is the governance model for capturing, evaluating, approving/declining, and recording these requests? Should the admin portal include a lightweight feature request log, or is this handled outside the portal (e.g., GitLab issues, SRF internal processes)? (Relates to ADR-082, ADR-098)
- [ ] Editorial intent preservation across staff turnover: theme tag decisions, daily passage curation choices, collection featured promotions — these editorial decisions carry rationale that may not be obvious to a successor. Should editorial decisions carry brief notes ("Approved for Peace because of the stillness metaphor in paragraph 3")? Who would write and maintain these notes? (Relates to ADR-032, ADR-098, ADR-007)
- [ ] Does SRF want Yogananda's teachings accessible to external AI assistants (ChatGPT, Claude, Gemini) via MCP? By 2027, seekers will ask their AI assistant "What did Yogananda say about overcoming fear?" — with a production MCP server, the AI can return verbatim, attributed quotes instead of fabricating from training data. This is the Findability Principle realized through AI channels. But it raises questions: does SRF view external AI as a distribution channel (amplifying reach) or a risk to sacred text fidelity (loss of presentation control)? What presentation constraints should apply — must AI consumers quote verbatim, include full citations, link to the portal? Should MCP access be open, registered, or restricted to partners who agree to a fidelity contract? (Relates to ADR-101, ADR-001, ADR-026, ADR-081)
- [ ] MCP and the SRF mobile app: should the SRF/YSS mobile app access portal content via MCP tools rather than (or alongside) HTTP API routes? MCP provides a natural interface for the app's AI features — the same `search_corpus` and `get_graph_neighborhood` tools that serve editorial AI agents can power the app's search. This question intersects with the existing stakeholder question about portal-app relationship. (Relates to ADR-101, ADR-011)
- [ ] Sacred text in AI context: external AI assistants may juxtapose Yogananda's words with quotes from other traditions ("Here's what three spiritual teachers say about death..."). The portal can't control this. Does SRF view such juxtaposition as interfaith enrichment or as inappropriate decontextualization? This isn't a technical question, but it shapes whether the external MCP tier should exist at all. (Relates to ADR-101, ADR-001)

### Resolved Questions

1. **Embedding model for Phase 1:** OpenAI text-embedding-3-small (1536 dimensions, multilingual). Selected for adequate multilingual support, operational simplicity, and well-understood behavior. Cost is negligible at corpus scale (< $1 for full multilingual corpus). ADR-046 provides the migration procedure; ADR-047 establishes the multilingual quality evaluation strategy and domain-adapted embeddings as a later-stage research track. *(Resolved by ADR-046, ADR-047; multilingual benchmarking deferred to Phase 11 when translated content exists.)*
2. **AI provider:** Claude via AWS Bedrock with model tiering — Haiku for real-time search (query expansion, intent classification, passage ranking), Opus for offline batch tasks (theme tagging, vocabulary extraction, relation classification). *(Resolved by ADR-014.)*
3. **Single database vs. multi-database:** Single-database architecture (Neon only, no DynamoDB). Simplicity over ecosystem conformity. *(Resolved by ADR-013.)*
4. **Language URL convention:** Hybrid approach — locale path prefix on frontend pages (`/hi/books/...`), `language` query parameter on API routes (`/api/v1/search?language=hi`). *(Resolved by ADR-027.)*

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
| **YSS (Yogoda Satsanga Society of India)** | Hindi and Bengali translations of Yogananda's works. Indian subcontinent audience. Organizational branding considerations for Indian-language portal content. |

---

## Operational Staffing (Requires SRF Input)

The editorial review portal (ADR-082) provides tooling for content governance. But tooling without humans is empty. The following operational roles require dedicated staff time, and SRF must determine *who* fills each role before Phase 5 launches the editorial workflows.

| Role | Responsibility | Estimated Time | Phase Needed |
|------|---------------|----------------|--------------|
| **Content editor** | Theme tag review, daily passage curation, calendar event management | 2–3 hours/day | Phase 5 |
| **Theological reviewer** | Final approval on theme associations, editorial thread accuracy | Periodic (high-stakes, low-frequency) | Phase 5 |
| **On-call engineer** | Sentry alert response, infrastructure monitoring, Neon health | As needed (shared with AE team) | Phase 1 |
| **Book ingestion operator** | Run ingestion pipeline for new books, coordinate human QA | Per-book (1–2 days per ingestion cycle) | Phase 5 |
| **Portal coordinator** | Cross-queue editorial health, content pipeline status, VLD activity, calendar planning, feature request triage | Regular (weekly minimum) | Phase 5 |
| **Social media reviewer** | Review quote images and captions, distribute to platforms | 20–30 min/day | Phase 9 |
| **Translation reviewer** | Compare AI-drafted translations with English source, approve/correct | Batch sessions (per language sprint) | Phase 11 |
| **Impact report curator** | Curate "What Is Humanity Seeking?" data into narrative report | Annual | Phase 11+ |
| **VLD coordinator** | Create curation briefs, monitor VLD submission quality, manage trusted submitter status | Weekly | Phase 17 |

**Key question for SRF:** Does the monastic order, the AE team, a dedicated content editor, or some combination own these responsibilities? The answer shapes Phase 5's editorial workflow design. The portal coordinator and VLD coordinator roles are particularly important to staff early — they are the connective tissue between editorial content, technical operations, and volunteer service. See DESIGN.md § Staff & Organizational Personas for the complete persona survey.

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

Accessibility is therefore not a polish phase or a nice-to-have. It is a Phase 2 requirement:

- **WCAG 2.1 AA** conformance from the first commit
- Semantic HTML, ARIA landmarks, keyboard navigation, screen reader support
- Color contrast compliance (minimum 4.5:1 for text, 3:1 for large text)
- `prefers-reduced-motion` support for users with vestibular disorders
- Performance budgets that serve seekers on low-bandwidth mobile connections (India, Africa, Latin America)

Phase 12 exists for formal audit, advanced features (TTS, dark mode, high-contrast), and third-party testing — not for introducing accessibility after the fact. See ADR-003.

### Multilingual from the Foundation

The philanthropist's question was about making Yogananda's books "available freely throughout the world." The world speaks thousands of languages. Multilingual support is not a late-stage feature to be bolted on — it is a foundational architectural principle that shapes every design decision from Phase 1 onward.

**What this means in practice:**

- **Schema:** Every content table carries a `language` column from the first migration. Cross-language linking (`canonical_book_id`, `canonical_chunk_id`) is built into the data model, not retrofitted.
- **API:** Every content-serving endpoint accepts a `language` parameter. URL structure uses locale prefixes (`/es/search`, `/de/quiet`). Theme slugs stay in English for URL stability; display names are localized.
- **Search:** The embedding model is multilingual by explicit requirement — Phase 1 embeddings remain valid when Phase 11 adds new languages. The hybrid search function accepts `search_language` and uses language-appropriate PostgreSQL dictionaries. English fallback is implemented at the service layer.
- **UI:** All strings are externalized to locale files (`messages/*.json`) from Phase 2. CSS logical properties (`margin-inline-start` not `margin-left`) are used throughout, ensuring RTL languages work without refactoring. The `lang` attribute is set on `<html>`.
- **Content fidelity:** Only official SRF/YSS human translations are served. Machine translation of Yogananda's words is never acceptable (see Sacred Text Fidelity above). If an official translation does not exist, the book is unavailable in that language — the portal is honest about content availability.

Phase 1 launches in English only, but the architecture is locale-ready. Phase 11 activates multilingual content. The gap between "English only" and "multilingual" should require zero schema migrations, zero API changes, and zero search function rewrites — only content ingestion and UI string translation. If a design decision today would require rework to support a new language tomorrow, the design is wrong. (See ADR-075, ADR-076, ADR-077, ADR-078.)

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
- **Documentation is a permanent artifact.** CLAUDE.md, CONTEXT.md, DESIGN.md, DECISIONS.md, ROADMAP.md — these files are as important as the code. New maintainers in year 7 should understand every decision.

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
- Self-Realization Magazine archives (Yogananda's articles as searchable teachings, monastic articles as opt-in commentary — ADR-040)
- Other SRF/YSS publications

### Audio Recordings (Phase 14+)

SRF possesses audio recordings of Paramahansa Yogananda's own voice — lectures, informal talks, guided meditations, and chanting. These are sacred artifacts and content simultaneously. Yogananda's voice recordings are among the most direct expressions of his teachings; no book passage can substitute for hearing the Master speak. The portal will treat these with reverence in presentation and with full indexing for discoverability.

SRF also produces modern audio recordings: monastics reading from published works, guided meditations, and chanting sessions.

Audio recordings are a primary content type in the portal architecture (ADR-057), with their own data model, transcription pipeline (Whisper → human review), and search integration alongside books and video.

### Unreleased and Forthcoming Materials

SRF has indicated that additional unreleased materials exist — books, audio, and video. The architecture accommodates new content types gracefully, with no schema migrations required for standard additions to the book or audio catalog.

### Future Consideration: SRF Lessons

The SRF Home Study Lessons are the organization's core spiritual curriculum — sequential private instruction in meditation and Kriya Yoga. They are **explicitly out of scope** for the public portal. However, SRF has indicated they might eventually be incorporated for authorized students (those enrolled in the Lessons) and Kriya Yoga initiates (kriyabans). This may never happen, or may be years away. The architecture is designed so it is not structurally impossible (ADR-085), but no Lessons-specific code ships in any current phase.

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
