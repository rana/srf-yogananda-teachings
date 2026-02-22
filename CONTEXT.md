# SRF Online Teachings Portal — Project Context

## Current State

**Phase:** Design complete. Ready to begin Phase 0 (Prove).

**What exists:** Comprehensive design documentation — CONTEXT.md (this file), DESIGN.md (architecture + 51 design sections DES-001 through DES-051), DECISIONS.md (105 ADRs, numbered 001–105, organized into 11 topical groups), ROADMAP.md (15 phases, 0–14). No code yet.

**What's next:** Phase 0 — Prove. Repo setup, Neon provisioning, Vercel/Sentry configuration, initial schema migration, stakeholder kickoff, then single-book search and AI librarian. See ROADMAP.md § Phase 0 for deliverables.

---

## Open Questions

### Technical (resolve during Phase 0)

- [ ] Which edition of Autobiography of a Yogi is the canonical page-number reference? (1946 first edition, 1998 13th edition, or current printing?) All portal citations depend on this. (Relates to ADR-034)
- [ ] Does SRF have recordings of their temple singing bowls and chimes for the Quiet Corner audio (Phase 1)? If not, what is the sourcing policy for sacred audio?
- [ ] Optimal chunk size for Yogananda's prose style (test 200, 300, 500 token chunks). See ADR-048 for the formal chunking strategy specification.
- [ ] Multilingual embedding quality evaluation: when multilingual content is available (Phase 10), benchmark text-embedding-3-small against multilingual-optimized models (Cohere embed-v3, BGE-M3, multilingual-e5-large-instruct) using actual translated passages. Phase 0 English-only evaluation cannot assess cross-language retrieval quality. (ADR-047)
- [ ] Domain-adapted embeddings research: after Phase 10 corpus completion, evaluate fine-tuning a multilingual base model on Yogananda's corpus for world-class retrieval quality across all portal languages. Requires multilingual corpus and per-language evaluation suites as prerequisites. (ADR-047)
- [ ] Query expansion prompt engineering (test with diverse query types)
- [ ] Transliteration support for Indic script search suggestions: Hindi/Bengali seekers often type Romanized input (e.g., "samadhi" not "समाधि"). Should the suggestion system match across scripts? What about CJK substring matching? (ADR-049, Phase 10)
- [ ] Editorial governance of curated query suggestions: who authors and reviews the curated question forms (e.g., "How do I overcome fear?") shown in the suggestion dropdown? Same editorial review process as theme tagging, or a lighter-weight process? (ADR-049)
- [ ] Mobile search suggestion UX: on mobile, the OS keyboard already provides word suggestions, and a search autocomplete dropdown competes for screen space. Should the mobile suggestion experience differ from desktop (e.g., fewer suggestions, different trigger)? (ADR-049)
- [ ] Crisis query detection in search: when a seeker searches "I want to die," "how to end the pain," or similar acute-distress queries, the AI librarian would faithfully return passages about death and the soul's immortality — which, without context, could be read as affirming self-harm. Should the search intent classifier include a crisis detection layer that surfaces crisis resources *above* search results for certain query patterns? ADR-071 handles crisis resources on grief *content pages*, but search queries are the higher-risk surface. Requires coordination with the intent classification system (ADR-005 E1) and SRF input on theological framing. (Relates to ADR-071, ADR-005)
- [ ] Should Presentation mode (currently Phase 7) be pulled to Phase 2 or 3? Group/communal reading (satsang, study circles, family devotions) is the primary mode of engagement with spiritual texts in Indian, African, and Latin American cultures. Presentation mode is described as "a CSS mode, not a separate feature" — implementation cost is low. Deferring community reading features to Phase 7+ while individual silent reading (the Western default) is the baseline for ~7 phases reproduces a cultural hierarchy. (Relates to ADR-006, ROADMAP Phase 7)
- [ ] Should the circadian content choreography use solar-position awareness (sunrise/sunset calculated from browser timezone) rather than fixed clock hours? Brahmamuhurta (3:30–5:30 AM) in Indian tradition is a time for meditation, not consolation. Helsinki at 2 AM in summer has daylight. A seeker's relationship to their hour differs by latitude and season. Browser timezone (via `Intl.DateTimeFormat().resolvedOptions().timeZone`) maps to approximate coordinates for deterministic solar calculation — no geolocation API, no IP lookup, DELTA-compliant. (Relates to DES-011, DES-028, ADR-095)
- [ ] @YoganandaSRF YouTube channel ID (needed for RSS feed URL in Phase 1)
- [ ] YouTube playlist inventory (map existing playlists to portal categories, needed for Phase 1)
- [ ] Chant text chunking and embedding quality: short, repetitive, metaphor-dense devotional poetry (e.g., *Cosmic Chants*) may embed poorly compared to expository prose using text-embedding-3-small. Should chant embeddings concatenate title + instructions + text for richer context? Does search quality for "find chants about divine love" need a different retrieval strategy than prose search? Evaluate during *Cosmic Chants* ingestion. (Relates to ADR-059, ADR-046)
- [ ] Chant-to-recording catalog: does SRF maintain an existing mapping between specific chants and their audio/video recordings? If yes, the `performance_of` editorial linking (ADR-059) is a data import. If no, this is a curation task that must be scoped into Phase 12 editorial workload. (Relates to ADR-059, ADR-057)
- [ ] Edition variance policy: when multiple editions of a book exist with textual variants (e.g., 1946 first edition vs. current printing of *Autobiography of a Yogi*), which edition is canonical for the portal's verbatim text? Does the portal serve a single authoritative edition per book, or acknowledge variants? This affects content integrity hashing (ADR-039), citation page numbers, and the meaning of "verbatim." (Relates to ADR-001, ADR-034, ADR-039, ADR-007)
- [ ] Devanāgarī font timing: the Phase 1 English corpus contains Devanāgarī script in *God Talks with Arjuna* (original Bhagavad Gita verses). Noto Sans Devanagari is currently scheduled for Phase 10 (ROADMAP.md). ADR-080 moves it to Phase 0. Confirm during Gita ingestion whether Devanāgarī is also present in *The Holy Science*. (ADR-080, ADR-048)
- [ ] IAST diacritics rendering verification: Merriweather and Lora must render IAST combining characters (ā, ī, ū, ṛ, ṝ, ḷ, ṃ, ḥ, ñ, ṅ, ṭ, ḍ, ṇ, ś, ṣ) correctly at all font sizes, particularly `--text-sm` (15px). Include in Phase 1 design QA and accessibility audit. (ADR-080, ADR-003)
- [ ] Mixed-script embedding quality for Gita commentary: validate during *God Talks with Arjuna* ingestion that excluding Devanāgarī from the embedding input (while including romanized transliteration and English commentary) does not degrade retrieval quality for verse-specific queries like "Bhagavad Gita IV:7." (ADR-080, ADR-048, ADR-046)
- [ ] Cloudflare R2 vs S3 for media assets: Phase 12 introduces audio streaming (CloudFront + S3) and image galleries. Cloudflare R2 has zero egress fees (S3 egress can surprise at scale), is S3-API-compatible, and aligns with the existing Cloudflare edge layer. For a free portal serving audio globally over a 10-year horizon, egress costs matter. Evaluate R2 vs S3 during Phase 12 planning. (Relates to ADR-057, ADR-004)
- [ ] pgvector HNSW tuning strategy at multilingual scale: at Phase 10 (9 languages, ~400K chunks × 1536 dimensions), the HNSW index parameters (`m`, `ef_construction`, `ef_search`) directly affect recall and latency. If the corpus grows further (magazine archives, audio transcripts, video transcripts — potentially 200K+ additional chunks), index size and query latency become real considerations. Document the tuning strategy and the evaluation threshold that would trigger Neon compute scaling. (Relates to ADR-009, ADR-046, ADR-047)
- [ ] GitLab migration plan: Phase 9 migrates from GitHub to GitLab per SRF's IDP. This is not just a repo move — it's CI/CD pipeline rewrite (GitHub Actions → GitLab CI), Terraform state backend migration (Terraform Cloud → GitLab Terraform backend), and developer workflow change. No ADR governs the migration plan. This deserves one before Phase 9 planning begins. (Relates to ADR-016, ADR-018, ADR-017)
- [ ] Abuse and misuse patterns: the portal's AI search (ADR-001, ADR-005, ADR-014) is constrained to return only verbatim quotes with citations — it cannot generate, paraphrase, or synthesize. This is a strong architectural defense against content fabrication. But adversarial usage patterns remain unaddressed: (a) extraction at scale — automated scraping of the full corpus via search API, circumventing the reading experience and the portal's contextual framing; (b) quote weaponization — using the portal to find passages that, stripped of context, could misrepresent Yogananda's teachings (e.g., passages about suffering cited to justify harm); (c) SEO parasitism — third-party sites embedding portal passages without attribution. Rate limiting (ADR-011) partially addresses (a). The citation requirement and stable URLs partially address (c) by making the portal the canonical source. But no design document addresses these patterns holistically. Should the portal include: rate limiting tiers for the search API, `rel=canonical` enforcement for passage URLs, a usage policy for the MCP external tier (ADR-101), or content integrity watermarking for text (analogous to image watermarking in ADR-063)? (Relates to ADR-001, ADR-011, ADR-101, ADR-063, ADR-081)

### Stakeholder (require SRF input)

- [ ] What is the relationship between this portal and the SRF/YSS app? Complementary or overlapping reader? Will the portal's search eventually power the app?
- [ ] Who will manage the editorial workflow — theme tagging, daily passage curation, text QA? Monastic order, AE team, or dedicated content editor?
- [ ] What does the philanthropist's foundation consider a successful outcome at 12 months? (Shapes analytics and reporting.)
- [ ] Can SRF provide center location data (addresses, coordinates, schedules) for an in-portal "Meditation Near Me" feature?
- [ ] What is SRF's copyright/licensing posture for the portal content? Read online only, or also downloadable/printable? What attribution is required? *All non-Lessons material is offered free of charge. The architecture supports both read-online and downloadable formats. SRF should determine specific licensing terms at their discretion.*
- [ ] About page content: does SRF have approved biography text for Yogananda and descriptions of the line of gurus, or do we draft for their review?
- [ ] Does SRF/YSS have **digital text** of official translated editions? If only printed books, OCR per language is a massive effort requiring fluent reviewers. (Critical for Phase 10 scoping.)
- [ ] Which books have official translations in which languages? (Content availability matrix — determines what each language's portal experience looks like.)
- [ ] Who reviews the AI-drafted UI translations (~200–300 strings)? Claude generates drafts (ADR-078), but human review is mandatory. Does SRF have multilingual monastics or volunteers who can review for spiritual register and tone?
- [ ] Should Hindi and Bengali be co-launched with the Western-language set in Phase 10, or does the 10a/10b split remain? The current sequencing places Yogananda's heritage languages (~830M speakers) after European languages — practical given SRF's existing translation infrastructure, but at tension with the mission of global availability. If resource constraints require phased rollout, the rationale should be explicitly documented as a resourcing decision rather than natural ordering. (ADR-077)
- [ ] Should YSS have co-equal or advisory authority over Hindi/Bengali design decisions? This affects visual design, editorial voice, cultural adaptation, and the branding decision (ADR-079). Co-equal means YSS participates in design from Phase 0; advisory means YSS reviews completed designs. (Relates to ADR-077, ADR-079)
- [ ] Does YSS have photographic archives of Yogananda's Indian biographical sites (Gorakhpur birthplace, Serampore college, Ranchi YSS schools, Dakshineswar)? These would be primary content for Sacred Places in the Hindi/Bengali locales, where Google Street View coverage is patchy or absent. (Relates to DES-023, ADR-069)
- [ ] Does SRF/YSS have pastoral care resources (center contacts, counselors) that could complement helpline numbers in locales where mental health helplines are underserved or culturally stigmatized? Rural Indian seekers may contact a pandit or elder before calling a helpline. Crisis resource data in `messages/{locale}.json` should support multiple resource types, not only helplines. (Relates to ADR-071)
- [ ] For Hindi/Bengali: same portal domain (`teachings.yogananda.org/hi/`) or YSS-branded domain? Organizational question with architectural implications.
- [ ] Do translated editions preserve paragraph structure? If yes, `canonical_chunk_id` alignment during ingestion is straightforward (match by chapter_number + paragraph_index). If translations reorganize content, alignment requires semantic matching. (Critical for Phase 10 cross-language linking.)
- [ ] Does the teaching portal get its own mobile app, or do portal features (search, daily passage, reader) integrate into the existing SRF/YSS app? The API-first architecture (ADR-011) supports either path.
- [ ] Is *Cosmic Chants* one canonical volume or a family of editions/compilations? Are there distinct collections (e.g., *Cosmic Chants* vs. devotional songs within other books) that need separate modeling? Should the SRF app's chant practice feature (if it exists) be linked from the portal as a "signpost"? (Relates to ADR-059)
- [ ] Does SRF prefer the portal repo in GitLab from day one (per SRF IDP standards), or is GitHub acceptable for Phases 0–8 with a planned Phase 9 migration? The Terraform code and CI/CD pipelines are SCM-agnostic; only the workflow files change.
- [ ] What Sentry and New Relic configurations does SRF use across their existing properties? Aligning observability tooling enables operational consistency.
- [ ] What are the content licensing terms for portal-served content — read-online only, or also downloadable/redistributable? Does the permissive `robots.txt` extend to AI training crawlers ingesting full book text? (Relates to ADR-081)
- [ ] Does the philanthropist's foundation want to publish "What Is Humanity Seeking?" as a standalone annual communications asset (report, subdomain, media syndication)? If so, communications planning should begin before the Phase 6 dashboard ships. (Relates to ADR-090)
- [ ] Can SRF provide recordings of Yogananda's own voice for an audio-first pilot during the Hindi/Bengali launch (Phase 10b)? For populations where voice and oral transmission are the primary medium — and where Yogananda's tradition includes kirtan and storytelling — deferring all audio access to Phase 12 creates a cultural equity gap. An audio-first Hindi/Bengali pilot alongside the text launch would serve seekers for whom reading is secondary and oral tradition is primary. This is not just a nice-to-have — it is a cultural equity issue. (Relates to ADR-026, ADR-057, ADR-006)
- [ ] What format should the annual "What Is Humanity Seeking?" impact report take — PDF, web page, or both? Published by SRF or the philanthropist's foundation? (Phase 6+; relates to ADR-090)
- [ ] Crisis resource policy: Should the portal display locale-appropriate crisis helpline information (e.g., 988 Suicide and Crisis Lifeline, local equivalents) alongside grief and death-related content? What is SRF's preferred approach to acknowledging that seekers in acute distress may reach the portal? (Relates to ADR-071)
- [ ] How does SRF frame the portal's impact for the philanthropist's foundation when the most meaningful outcomes are unmeasurable? The "What Is Humanity Seeking?" narrative (ADR-090) reframes the question — does the foundation find this framing sufficient, or do they require conventional reach metrics? (Relates to § Measuring Success)
- [ ] What is the inner orientation SRF envisions for the editorial team? The content editor, theological reviewer, and translation reviewer roles (§ Operational Staffing) carry spiritual responsibility — curating what seekers encounter. Does SRF see these as devotional service roles, professional positions, or both? This shapes workflow design and staffing criteria.
- [ ] Extreme-context access and institutional intermediaries: the portal specifies 3G in rural India as a performance target, and ADR-006 addresses Global South delivery. But the *emotional* context of certain access scenarios carries design implications beyond bandwidth. A seeker in a hospital waiting room, a prison, a refugee camp, or a hospice has different needs than someone in a home office. The Quiet Corner partially addresses crisis moments. Are there even lighter-weight surfaces — perhaps a single-URL, <10KB experience — designed for environments where cognitive load, connectivity, and privacy are all severely constrained? Does SRF want the portal to be explicitly designed for institutional contexts (hospitals, prisons, chaplaincies)? **Institutional intermediary persona:** In these contexts, the user is often not the seeker themselves but an intermediary — a hospital chaplain, a prison volunteer, a hospice worker, a therapist, a refugee camp educator — accessing the portal *on behalf of* someone who cannot browse freely. Their constraints differ from individual seekers: shared/supervised devices, time-limited sessions (15 minutes with a patient, not an hour of personal study), content that must be appropriate without screening (no accidental exposure to grief content when visiting for courage content), possibly offline needs (no Wi-Fi in a hospice room), and the need to quickly find and present a specific passage rather than explore. This persona is also the portal's most likely bridge to populations who will never use the portal directly. If SRF affirms institutional access as in-scope, this persona needs design attention by Phase 4 (when editorial and operational tools activate). (Relates to ADR-006, ADR-071, DES-011, ADR-067)
- [ ] Design intent preservation: the documentation captures architecture and decisions, but the *spirit* behind those decisions — why the haptic pattern mimics a singing bowl's decay, why the threshold is a breath and not a logo reveal, why the parting passages exist — is the hardest thing to maintain across staff turnover. In year 7, will a new developer understand the contemplative reasoning? Should a "Design Intent" companion document be created — not an ADR (which records *what* was decided) but a narrative that explains *why it feels the way it feels*? Who maintains it? (Relates to ADR-098, § Documentation–Code Transition in CLAUDE.md)
- [ ] Community curation governance: who within SRF reviews community-submitted collections (ADR-086)? The same editorial team as theme tags, or a separate community management role? What are the theological boundaries for collection approval — can passages be juxtaposed from different books, or must collections stay within a single work? What disclaimer text does SRF want on community-curated collections? (Relates to ADR-086)
- [ ] VLD portal roles: does SRF want VLD members to have portal accounts with a `vld` role for curation delegation (ADR-087)? If so, who manages VLD role assignment — SRF membership office, AE team, or monastic oversight? Can VLD curation service count toward VLD service hours? (Relates to ADR-087)
- [ ] Community collection attribution and ego: spiritual communities have tensions around recognition. Should published community collections carry curator names, or be anonymous by default? Does SRF prefer "Curated by [Name]" or "Curated by a devotee"? Is attribution important for accountability, or does it create unwanted ego dynamics? (Relates to ADR-086)
- [ ] Relationship between community curation and official SRF publications: SRF already publishes reading guides and study materials through its own channels. Does community curation complement or compete with official publications? Should community collections be visually distinct from staff-curated Editorial Reading Threads (DES-026)? (Relates to ADR-086, DES-026)
- [ ] `/guide` alignment with SRF reading recommendations: SRF may already publish recommended reading orders or topical reading guides through its own channels. The `/guide` page (DES-048) should align with, not compete with, SRF's pastoral voice. Does SRF have existing reading recommendation materials that should inform the `/guide` page content? Should `/guide` be reviewed by the same theological reviewers as editorial reading threads? (Relates to DES-048, DES-026)
- [ ] Young seekers and editorial voice: the portal will be visited by teenagers — a 14-year-old grieving a grandparent, a 17-year-old curious about meditation from a yoga class. The contemplative voice, slow pace, and absence of gamification naturally serve this population well. But should the editorial voice *acknowledge* their existence? The "Young Seeker" life-phase pathway in DES-048 frames the entry through a universal question ("What should I do with my life?") rather than an age label, and uses accessibility level 1 passages with `practical`/`joyful` tone. Does SRF want the portal to be explicitly welcoming to young seekers, or should the portal's agelessness be its mode of inclusion? Does the minimum-age question (Phase 13 accounts) need to be considered earlier for features like the Quiet Corner or Today's Wisdom that require no account? (Relates to DES-048, ADR-095)
- [ ] Should worldview pathways include Muslim/Sufi (WP-13), agnostic/skeptical (WP-14), and potentially African spiritual entry points? Yogananda's corpus engages directly with Islamic mysticism (*Wine of the Mystic*), scientific skepticism (*Autobiography* science chapters), and universal consciousness themes. WP-13 and WP-14 have been added to the pathway catalog in DES-048 but require SRF editorial approval. (Relates to DES-048)
- [ ] Worldview-sensitive `/guide` pathways: the `/guide` page currently organizes pathways by spiritual need ("If you are dealing with loss") and corpus entry point ("If you are a student of the Bhagavad Gita"). Seekers also arrive from different epistemological starting points — Christian contemplatives, Buddhist meditators, scholars of comparative religion, people interested in the science of consciousness. Yogananda himself engaged deeply with multiple traditions (*The Second Coming of Christ*, *Wine of the Mystic*, scientific framing of yoga). Should the `/guide` page include worldview-sensitive pathways (e.g., "If you come from a Christian contemplative tradition," "If you have a Buddhist meditation practice," "If you are interested in the intersection of science and spirituality")? These are editorial content decisions, not architectural changes — the existing DES-048 template supports them. Requires SRF input on whether acknowledging other traditions as valid starting points aligns with their pastoral voice, and whether such pathways should be reviewed by the same theological reviewers as editorial reading threads. (Relates to DES-048, ADR-033, DES-027, ADR-051)
- [ ] SRF editorial policy on contested transliterations: SRF publications use house romanizations that sometimes diverge from academic IAST — "Babaji" vs. "Bābājī," "Kriya Yoga" vs. "Kriyā Yoga." The portal follows SRF's published spellings for display (ADR-080). Does SRF confirm that their house style is the canonical form for all portal display text? Are there plans to standardize diacritics usage across future editions? (Relates to ADR-080, ADR-034)
- [ ] Sanskrit term pronunciation recordings: does SRF have, or want to create, approved audio pronunciation recordings for key Sanskrit terms used in Yogananda's writings (samadhi, pranayama, Kriya Yoga, Aum, etc.)? If monastic recordings are desirable, when would they be available? The glossary schema (ADR-038, ADR-080) reserves a `pronunciation_url` column for this purpose. (Relates to ADR-080, ADR-038)
- [ ] *God Talks with Arjuna* Devanāgarī content: confirm that the portal should display original Devanāgarī Bhagavad Gita verses alongside Yogananda's English commentary, and that these verses should be rendered (not omitted or replaced with romanization only). Does SRF have a preferred Devanāgarī typeface, or is Noto Sans Devanagari acceptable? (Relates to ADR-080, ADR-048)
- [ ] Monastic content scope — content *by* vs. *about*: the People Library preserves biographical context about monastics (ADR-036, ADR-037). But should the portal host content *by* monastics — convocation talks, published articles, editorial contributions? If so, this requires an `authored_by` or `presented_by` relation linking content to person entries, and raises questions about how monastic-authored content relates to Yogananda's verbatim teachings in search ranking and display hierarchy. (Relates to ADR-037, ADR-036, ADR-001)
- [ ] Living monastic editorial sensitivity: the People Library includes `is_living` tracking (ADR-037). What level of biographical detail does SRF approve for current monastics — name and role only, or full biography with service history? Are there specific monastics SRF wants featured at launch? Who reviews and updates monastic entries as roles change? (Relates to ADR-037, ADR-036)
- [ ] Presidential succession editorial framing: the portal can display factual succession data (names, service dates). Does SRF want editorial narrative accompanying each president's entry — a description of their contribution to the SRF mission? If so, does SRF provide this text, or does the portal team draft it for SRF review? (Relates to ADR-037)
- [ ] Portal coordinator role: who owns cross-queue editorial health — tracking content pipeline status, editorial backlog depth, VLD activity, and upcoming calendar events needing attention? Is this a monastic role, an AE team role, or a dedicated position? This role is critical by Phase 4 when editorial queues activate. (Relates to ADR-082, DESIGN.md § Staff & Organizational Personas)
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
- [ ] India's DPDPA cross-border transfer provisions: the Digital Personal Data Protection Act (2023) applies to processing personal data of individuals in India. Cross-border transfer rules are still being finalized. The portal targets Indian seekers (Hindi, Bengali, YSS audience). Monitor DPDPA implementation rules as Phase 10 (Hindi/Bengali) approaches. (Relates to ADR-099, ADR-077)
- [ ] Brazil LGPD Data Protection Officer requirement: Brazil's LGPD requires a DPO equivalent (encarregado) for entities processing Brazilian personal data. The portal serves Portuguese-language content (Phase 10). Whether SRF needs an encarregado depends on the volume of Brazilian data subjects and whether existing SRF legal counsel covers this. (Relates to ADR-099)
- [ ] Does the SRF convocation site self-host Google Fonts? If SRF's existing new-standard properties already self-host fonts, this is a settled pattern. If they use Google Fonts CDN, the portal's self-hosted approach (ADR-099) should be proposed as the new standard. (Relates to ADR-099)
- [ ] Feature request governance: over a decade, feature requests will arrive from monastic leadership, AE team, seekers (via feedback), VLD members, and the philanthropist's foundation. What is the governance model for capturing, evaluating, approving/declining, and recording these requests? Should the admin portal include a lightweight feature request log, or is this handled outside the portal (e.g., GitLab issues, SRF internal processes)? (Relates to ADR-082, ADR-098)
- [ ] Editorial intent preservation across staff turnover: theme tag decisions, daily passage curation choices, collection featured promotions — these editorial decisions carry rationale that may not be obvious to a successor. Should editorial decisions carry brief notes ("Approved for Peace because of the stillness metaphor in paragraph 3")? Who would write and maintain these notes? (Relates to ADR-032, ADR-098, ADR-007)
- [ ] Does SRF want Yogananda's teachings accessible to external AI assistants (ChatGPT, Claude, Gemini) via MCP? By 2027, seekers will ask their AI assistant "What did Yogananda say about overcoming fear?" — with a production MCP server, the AI can return verbatim, attributed quotes instead of fabricating from training data. This is the Findability Principle realized through AI channels. But it raises questions: does SRF view external AI as a distribution channel (amplifying reach) or a risk to sacred text fidelity (loss of presentation control)? What presentation constraints should apply — must AI consumers quote verbatim, include full citations, link to the portal? Should MCP access be open, registered, or restricted to partners who agree to a fidelity contract? (Relates to ADR-101, ADR-001, ADR-026, ADR-081)
- [ ] MCP and the SRF mobile app: should the SRF/YSS mobile app access portal content via MCP tools rather than (or alongside) HTTP API routes? MCP provides a natural interface for the app's AI features — the same `search_corpus` and `get_graph_neighborhood` tools that serve editorial AI agents can power the app's search. This question intersects with the existing stakeholder question about portal-app relationship. (Relates to ADR-101, ADR-011)
- [ ] Sacred text in AI context: external AI assistants may juxtapose Yogananda's words with quotes from other traditions ("Here's what three spiritual teachers say about death..."). The portal can't control this. Does SRF view such juxtaposition as interfaith enrichment or as inappropriate decontextualization? This isn't a technical question, but it shapes whether the external MCP tier should exist at all. (Relates to ADR-101, ADR-001)
- [ ] MCP copyright implications: "freely accessible on the portal" and "freely redistributable through any AI assistant worldwide" are different copyright postures. If an external MCP serves full passages that an AI presents in its own interface, is the AI a display of the portal or a redistribution of the content? This is a legal and stakeholder question, not a technical one. (Relates to ADR-101, ADR-081, ADR-099)

- [ ] Practice Bridge and public Kriya/Lessons overview: does SRF want the portal's About page "Go Deeper" section to include a substantive description of the SRF Lessons program and the path to Kriya Yoga initiation, or should it remain as external links only? SRF's own website (`yogananda.org/lessons`, `/kriya-yoga-path-of-meditation`, `/a-beginners-meditation`) provides extensive public descriptions of the Lessons and Kriya Yoga. The portal's enriched "Go Deeper" section would complement this with Yogananda's own published words about the importance of practice, plus links to SRF's enrollment and free beginner resources. Does SRF prefer the portal link to their existing pages, or host a complementary `/about/lessons` page with SRF-approved text? (Relates to ADR-104)
- [ ] Canonical SRF enrollment URL: confirm that `yogananda.org/lessons` is the preferred destination for all portal "Learn about SRF Lessons" links. Is there a direct enrollment URL SRF prefers, or should the portal always link to the informational landing page and let SRF handle the enrollment flow? (Relates to ADR-104)
- [ ] Practice Bridge editorial tone: the Practice Bridge contextual note on tagged passages reads "Yogananda taught specific meditation techniques through Self-Realization Fellowship." Does SRF have preferred language for this note, or should the portal draft it for SRF review? The note must be modest (a signpost, not a call to action) and consistent with SRF's own invitational tone on yogananda.org. (Relates to ADR-104)
- [ ] Virtual pilgrimage tour URLs: SRF offers virtual pilgrimage tours of Mother Center, Lake Shrine, Hollywood Temple, and Encinitas Ashram Center. Does SRF want the portal's Sacred Places entries to link to these tours ("Take a Virtual Tour →")? If so, what are the canonical URLs for each property's tour? Are tours available year-round or only during Convocation? (Relates to ADR-069, DES-023)
- [ ] Youth and young adult program signposts: SRF has dedicated programs for youth and young adults. Should the portal's Young Seeker life-phase pathway (LP-1) and events section signpost these programs? Does SRF have preferred URLs for youth/young adult program pages? (Relates to DES-048, DES-022)
- [ ] "Awake" documentary as entry point: the *Awake: The Life of Yogananda* documentary (Counterpoint Films, SRF-endorsed) is many seekers' first encounter with Yogananda. Should the portal acknowledge this with a worldview pathway (WP-15) bridging from film to books? Does SRF view the documentary as an endorsed entry point to be actively signposted? (Relates to DES-048)
- [ ] SRF newsletter/blog signpost: SRF publishes a newsletter and blog with "Wisdom and Inspiration" articles. The portal's daily email (ADR-091) is specifically "a passage, not a newsletter." Should the portal link to SRF's newsletter or blog as an additional signpost, or would this blur the distinction? (Relates to ADR-091, DES-016)
- [ ] Portal updates page posture: does SRF want the portal to visibly acknowledge its own evolution (a `/updates` page listing new books, features, and languages), or should the portal feel timeless — as if the library has always existed? Release notes are transparency; timelessness is atmosphere. Both are valid. If SRF prefers the notice board approach, should the voice center on the teachings ("The teachings are now available in Hindi") or on the portal ("We've added Hindi support")? ADR-105 proposes the former. (Relates to ADR-105, ADR-074)

### Resolved Questions

1. **Embedding model for Phase 0:** OpenAI text-embedding-3-small (1536 dimensions, multilingual). Selected for adequate multilingual support, operational simplicity, and well-understood behavior. Cost is negligible at corpus scale (< $1 for full multilingual corpus). ADR-046 provides the migration procedure; ADR-047 establishes the multilingual quality evaluation strategy and domain-adapted embeddings as a later-stage research track. *(Resolved by ADR-046, ADR-047; multilingual benchmarking deferred to Phase 10 when translated content exists.)*
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
