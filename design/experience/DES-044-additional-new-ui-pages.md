## DES-044: Additional New UI Pages

### DES-045: `/journeys` — Calendar Reading Journeys

Browse available time-bound reading experiences. Lists evergreen, seasonal, and annual journeys with descriptions, durations, and "Subscribe" buttons. Active seasonal journeys highlighted.

### ADR-061, ADR-062: `/explore` — Knowledge Graph Visualization

Interactive visual map of the entire teaching corpus — every content type, every relationship. The graph evolves through milestones, gaining new node and edge types as content types are added. See the consolidated `/explore` specification below for the full cross-media design.

### ADR-039: `/integrity` — Content Integrity Verification

Public page listing all books and their per-chapter content hashes. "How to verify" instructions. Statement of textual fidelity.

### ADR-038, ADR-049: `/vocabulary` — Yogananda's Language

The search suggestion system (ADR-049) maps modern terms ("mindfulness") to Yogananda's vocabulary ("concentration, one-pointed attention"). This mapping is currently a search optimization. The Vocabulary Bridge page inverts it into a *learning experience*.

**Purpose:** A dedicated page that presents Yogananda's vocabulary — not as definitions (the Glossary handles that, ADR-038), but as a *translation guide* between contemporary language and the master's specific usage. Over time, seekers stop searching for "mindfulness" and start searching for "concentration." The vocabulary bridge measures its own success by becoming unnecessary.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ Yogananda's Language │
│ │
│ Yogananda used language with precision — each word │
│ chosen to convey a specific spiritual reality. │
│ When he says "concentration," he means something │
│ deeper than the modern usage. │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ You might search for... Yogananda's word is... │
│ │
│ mindfulness concentration, one-pointed │
│ attention │
│ enlightenment Self-realization, cosmic │
│ consciousness │
│ energy prana, life force │
│ subconscious superconscious │
│ willpower dynamic will │
│ prayer scientific prayer, │
│ affirmation │
│ │
│ Each term links to → Glossary definition │
│ → Passages where Yogananda uses it │
│ → Related search │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Data source:** The terminology bridge mapping table already built for ADR-049 search suggestions. The vocabulary page is a human-readable view of the same data.

**Milestone:** 3b (alongside Glossary, ADR-038). Content is editorial — the mapping between modern and Yogananda-specific vocabulary requires human curation.

### DES-047: `/browse` — The Complete Index

A single, high-density text page listing every navigable content item in the portal, organized by category and subcategory. Designed text-first — not a degraded rich page, but a page whose primary form IS text. The card catalog that completes the librarian metaphor.

**Purpose:** Provide a bird's-eye view of the entire teaching corpus. Serve the pre-seeking browser who wants to see the shape of the teachings before committing to a path. Function as the portal's universal fallback — the best page for screen readers, feature phones, terminal browsers, offline caching, and SEO crawlers.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ Browse All Teachings │
│ │
│ BOOKS │
│ ───── │
│ Spiritual Classics │
│ Autobiography of a Yogi — 48 chapters │
│ Man's Eternal Quest — 57 talks │
│ The Divine Romance — 54 talks │
│ Scripture Commentary │
│ God Talks With Arjuna — Bhagavad Gita commentary │
│ The Second Coming of Christ — Gospel commentary │
│ Daily Practice │
│ Scientific Healing Affirmations │
│ Metaphysical Meditations │
│ │
│ THEMES │
│ ────── │
│ Qualities: Peace · Courage · Healing · Joy · Purpose · Love │
│ Life Situations: Loss & Grief · Relationships · Parenting │
│ · Work · Loneliness · Aging │
│ Spiritual Figures: Christ · Krishna · Sri Yukteswar · ... │
│ Yoga Paths: Kriya · Raja · Bhakti · Karma · Jnana · ... │
│ Practices: Meditation · Concentration · Pranayama · ... │
│ Principles: Ahimsa · Satya · Asteya · ... │
│ Scriptures: Yoga Sutras · Bhagavad Gita · Bible · Rubaiyat │
│ │
│ READING THREADS │
│ ──────────────── │
│ Yogananda on Fear — 8 passages from 4 books │
│ The Inner Science of Meditation — ... │
│ │
│ GLOSSARY (A–Z) │
│ ────────────── │
│ Astral body · Chakra · Dharma · Guru · Karma · ... │
│ │
│ PEOPLE │
│ ────── │
│ Sri Yukteswar · Lahiri Mahasaya · Krishna · Christ · ... │
│ │
│ REFERENCES │
│ ────────── │
│ Bhagavad Gita · Bible · Yoga Sutras · Kabir · Rumi · ... │
│ │
│ THE QUIET CORNER │
│ ──────────────── │
│ Contemplative · Practical · Devotional · Philosophical │
│ │
│ See these relationships visually → Knowledge Graph │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Data source:** Auto-generated from the database at build time (ISR). Zero editorial overhead. The page grows automatically as content is added across milestones.

**Performance:** < 20KB HTML. Zero JavaScript required. Zero images. Cacheable by Service Worker as a single offline artifact — the one page that remains fully useful with no network after initial load.

**Semantic structure:** `h2` for top-level categories (Books, Themes, etc.), `h3` for subcategories (Spiritual Classics, Scripture Commentary, etc.), links for individual items. This heading hierarchy makes the page ideal for screen reader navigation — VoiceOver/NVDA users browse by heading level. ARIA labels follow ADR-073 warm speech conventions: "Browse all teachings — a complete index of the portal's contents."

**Multilingual:** Shows content filtered by seeker's language preference. When a book is available in multiple languages, indicates availability ("Also in: हिन्दी, Español"). Language filtering via the same `language` parameter used by all content APIs.

**Growth by milestone:**
| Milestone | Content shown |
|-----------|---------------|
| 2a | Books only (with chapter counts) |
| 3b | + Themes (all active categories), Glossary terms, Quiet Corner textures |
| 3c | + People, External References, Reading Threads |
| 3d+ | + Knowledge Graph link, Calendar Journeys |
| Arc 4+ | + Magazine archives, Ontology concepts |

**Milestone:** 2a (initial, books-only version). Grows automatically with each subsequent milestone.

### DES-048: `/guide` — The Spiritual Guide

A curated recommendation page organized by spiritual need. Where `/browse` answers "what's here?", `/guide` answers "where should I go?" Expands the homepage's 5 empathic entry points to 20–30+ organized pathways with editorial framing.

**Purpose:** Serve the seeker who has a specific need but doesn't know which book, theme, or reading thread addresses it. The reference librarian's recommendation list — not "what exists?" but "what should I read, given where I am?"

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ Where to Begin │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ IF YOU ARE NEW TO YOGANANDA'S TEACHINGS │
│ │
│ Start with Autobiography of a Yogi — Yogananda's │
│ own account of his spiritual journey. Then explore │
│ the theme of Joy for a taste of his practical wisdom. │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ IF YOU ARE EXPLORING MEDITATION │
│ │
│ The "Meditation" theme gathers Yogananda's most direct │
│ teachings on the practice. Scientific Healing │
│ Affirmations offers practical technique. The reading │
│ thread "The Inner Science of Meditation" traces the │
│ theme across four books. │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ IF YOU ARE DEALING WITH LOSS │
│ │
│ The Grief & Loss theme gathers Yogananda's most │
│ consoling words for the bereaved. The Quiet Corner │
│ offers a space for stillness. Chapter 43 of the │
│ Autobiography addresses what happens after death. │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ IF YOU ARE A STUDENT OF THE BHAGAVAD GITA │
│ │
│ God Talks With Arjuna is Yogananda's verse-by-verse │
│ commentary. The reverse bibliography shows every │
│ passage referencing the Gita. See Krishna in the │
│ Spiritual Figures. │
│ │
│ ... │
│ │
│ Browse the full index of all teachings → │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Editorial voice:** Framing text follows ADR-074 micro-copy standards. Never paraphrases Yogananda — only provides navigational context ("In this collection of talks, Yogananda addresses..."). Each section provides 2–3 specific recommendations (a book, a theme, a reading thread, a passage) with brief editorial framing.

**Provenance:** Same three-state model as editorial threads (DES-026). Claude can draft initial recommendation text (`auto`), but all user-facing content requires human review (`reviewed`) or human authorship (`manual`).

**Cultural adaptation:** Per-locale guide variants in Milestone 5b+ (stored in `messages/{locale}.json`). Different cultures have different spiritual entry points — an Indian seeker may start with karma and dharma; a Western seeker may start with meditation and self-improvement.

**Worldview adaptation:** Seekers arrive not only from different cultures and languages but from different epistemological starting points — and Yogananda's corpus speaks to many of them directly. A Christian contemplative finds *The Second Coming of Christ*. A Sufi or poetry lover finds *Wine of the Mystic*. A Buddhist meditator finds Yogananda's scientific descriptions of concentration and consciousness. A scholar of comparative religion finds the reverse bibliography (DES-027). An agnostic interested in the science of spirituality finds Yogananda's engagement with Einstein, physics, and the experimental method. The `/guide` page can serve these worldview entry points alongside need-based pathways, using the same editorial template — "If you come from a Christian contemplative tradition," "If you have a Buddhist meditation practice," "If you are interested in the intersection of science and spirituality." These are editorial content, not architectural changes. They surface affinities already present in the corpus rather than imposing an interfaith framing from outside. Whether to include worldview pathways is an SRF editorial decision — see CONTEXT.md § Open Questions (Stakeholder).

**Navigation:** Linked from site footer ("Where to begin"), from the "Start Here" newcomer path (Milestone 2a), and from `/browse` (bidirectional link). Each recommendation section links to the relevant destination page.

**Milestone:** 3b (requires theme system, glossary, and editorial infrastructure). Grows editorially through Milestone 3c+ as reading threads, people, and references become available.

#### Worldview Pathway Catalog

The `/guide` page organizes pathways into three groups: **need-based** (existing: "If you are dealing with loss," "If you are exploring meditation"), **worldview-based** ("If you come from a Christian contemplative tradition"), and **life-phase** ("If you are asking: 'Is this all there is?'"). All three use the same editorial template and three-state provenance. Worldview and life-phase pathways are AI-generated from corpus data (see DES-035 § Worldview Guide Pathway Generation) and require theological review before publication.

The following catalog defines each perspective, its corpus affinity points, the seed queries and resources Claude uses during generation, and representative bridge vocabulary. Each pathway is a self-contained `/guide` section — seekers may see one, several, or none depending on editorial decisions about which pathways meet SRF's pastoral standards.

**Ordering note:** The identifiers below are for reference only, not priority. Pathways are presented in no particular order on the `/guide` page — the editorial team determines grouping and sequence per locale. Different locales may foreground different pathways.

| ID | Perspective | Key Corpus Affinity | Primary Books | Seed Themes / References | Bridge Vocabulary |
|---|---|---|---|---|---|
| WP-01 | **Christian Contemplative** | Yogananda's 1,600-page Gospel commentary; extensive Bible engagement | *The Second Coming of Christ*, *Autobiography* | Christ (person), Bible (scripture) | prayer ↔ meditation, Holy Spirit ↔ AUM, Kingdom of Heaven ↔ Christ Consciousness |
| WP-02 | **Hindu / Vedantic Practitioner** | Gita commentary, yoga philosophy, Sanskrit terminology throughout | *God Talks With Arjuna*, *Autobiography* | Krishna (person), Bhagavad Gita (scripture), yoga_path themes | Home vocabulary — the bridge maps *outward*, helping practitioners discover which specific books and chapters address concepts they already know |
| WP-03 | **Buddhist / Zen Meditator** | Scientific meditation descriptions, consciousness states, concentration | *Autobiography* (meditation chapters), *Scientific Healing Affirmations* | Meditation, concentration, non-attachment (principles) | satori ↔ samadhi, nirvana ↔ moksha, sangha ↔ satsanga, dukkha ↔ maya |
| WP-04 | **Sufi / Poetry Lover** | Rubaiyat commentary, Kabir/Rumi references, devotional love | *Wine of the Mystic*, *Cosmic Chants* | Omar Khayyam, Kabir (references), Devotion (practice) | dhikr ↔ meditation/chanting, fana ↔ samadhi, the Beloved ↔ Divine Beloved |
| WP-05 | **Jewish / Contemplative Seeker** | Old Testament references, mystical unity, ethical teachings | *The Second Coming of Christ* (OT passages), *Man's Eternal Quest* | Bible (scripture — OT subset) | tikkun olam ↔ karma yoga, kavvanah ↔ concentration, devekut ↔ God-communion |
| WP-06 | **Science & Consciousness Explorer** | Yogananda's scientific framing of yoga, engagement with scientists | *Autobiography* (science chapters), *Man's Eternal Quest* | Einstein, Luther Burbank (references), scientific category in vocabulary bridge | consciousness ↔ cosmic consciousness, energy ↔ prana/life force, neuroplasticity ↔ will and habit |
| WP-07 | **Spiritual But Not Religious** | Universal human themes, no doctrinal prerequisites, empathic entry points | *Autobiography*, *Where There Is Light* | Quality themes (Peace, Joy, Purpose, Courage), Quiet Corner | No bridge needed — entry is through universal emotional language already present in theme names and empathic entry points |
| WP-08 | **Yoga Practitioner (Body to Spirit)** | Yoga philosophy beyond asana, pranayama, energy body | *Autobiography*, *God Talks With Arjuna* | yoga_path themes, pranayama/meditation (practices) | asana ↔ (Yogananda rarely discusses postures — this is itself a discovery), pranayama ↔ life force control, chakra ↔ astral centers |
| WP-09 | **Grief / Crisis Visitor** | Consolation, the soul's immortality, purpose of suffering | All books (cross-cutting) | Grief & Loss (situation), Quiet Corner, tone: `consoling` | No bridge needed — entry is through raw human need. The most interfaith pathway because grief has no tradition. |
| WP-10 | **Psychology / Self-Improvement Seeker** | Willpower, habit formation, concentration, practical life advice | *Man's Eternal Quest*, *Where There Is Light*, *Sayings* | situation themes (Work, Relationships), tone: `practical` | mindfulness ↔ concentration, self-actualization ↔ Self-realization, flow state ↔ superconsciousness |
| WP-11 | **Comparative Religion / Academic** | Cross-tradition references, the reverse bibliography as intellectual map | All books | Full reverse bibliography (DES-027), Knowledge Graph, principle themes | No bridge — vocabulary precision is valued; the glossary (ADR-038) and ontology (ADR-043) serve this population |
| WP-12 | **Parent / Family-Oriented Seeker** | Practical guidance on raising children, family life, relationships | *Man's Eternal Quest*, *Journey to Self-Realization* | Parenting, Relationships (situations), tone: `practical` | mindful parenting ↔ conscious child-rearing, values ↔ spiritual qualities |
| WP-13 | **Muslim / Sufi Seeker** | Yogananda's engagement with Islamic mysticism, Rubaiyat commentary, references to Sufi saints, universal God-consciousness | *Wine of the Mystic*, *Autobiography*, *Man's Eternal Quest* | Omar Khayyam, Kabir (references), Devotion (practice), cosmic consciousness | salat ↔ meditation/prayer, dhikr ↔ chanting/AUM, nafs ↔ ego, tawhid ↔ cosmic consciousness, the Beloved ↔ Divine Beloved |
| WP-14 | **Agnostic / Skeptical-but-Curious** | Yogananda's engagement with science, his insistence on verifiable experience over blind faith, experimental method in meditation | *Autobiography* (science chapters, "The Law of Miracles"), *Man's Eternal Quest* | Scientific vocabulary bridge, consciousness, practical technique | No tradition-specific bridge — entry is through questions: "Is consciousness more than the brain?", "Can meditation be verified?", "What did Yogananda mean by 'scientific' spirituality?" Distinct from WP-06 (Science Explorer) in that WP-14 does not assume interest in consciousness *per se* — it meets skepticism directly. |
| WP-15 | **Documentary Viewer ("Awake")** | Discovered Yogananda through the *Awake: The Life of Yogananda* documentary film; may have no prior spiritual reading practice; entry is visual/emotional, not textual | *Autobiography of a Yogi* (the source the film draws from), *Where There Is Light* (accessible entry point), *Man's Eternal Quest* | No tradition-specific themes — entry is biographical and emotional: Yogananda's life story, his journey to America, his legacy | film ↔ book, scenes ↔ chapters, biographical narrative ↔ spiritual autobiography. The pathway bridges from a passive viewing experience to active engagement with Yogananda's own words. "You saw his life on screen — now read it in his voice." The *Autobiography* is the natural first book. The documentary is third-party (Counterpoint Films, SRF-endorsed) and linked via its distribution URLs, not hosted on the portal. |

**Generation priority:** Pathways WP-01, WP-03, WP-06, WP-07, WP-09 have the strongest corpus affinity and address the largest seeker populations. Generate and review these first. WP-02, WP-04, WP-08, WP-13 have deep corpus support but smaller initial English-language audiences (WP-02 becomes high-priority for Hindi/Bengali locales). WP-05, WP-10, WP-11, WP-12, WP-14 require multi-book corpus (Milestone 3a+) for meaningful content. WP-15 (Documentary Viewer) requires only the *Autobiography* and is high-priority for the film's existing audience — many seekers discover Yogananda through the documentary before encountering his books. Whether to include WP-13 (Muslim/Sufi) and WP-14 (Agnostic) requires SRF editorial approval. Whether to include WP-15 requires confirming SRF's posture toward the *Awake* documentary as an endorsed entry point (see CONTEXT.md § Open Questions).

**What is NOT a worldview pathway:** A pathway that would require the portal to adopt a theological position. "If you believe all religions are one" is a claim; "If you come from a Christian contemplative tradition" is a starting point. The pathways acknowledge where the seeker is, then point to where Yogananda's words are. They do not assert what Yogananda "would say to a Buddhist" — they show where he actually wrote about the themes that tradition cares about.

**Pathway structure** (same template for all):

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ IF YOU COME FROM A CHRISTIAN CONTEMPLATIVE TRADITION │
│ │
│ Yogananda devoted much of his life to exploring the │
│ unity between Christ's teachings and India's ancient │
│ yoga science. His writings engage deeply with the │
│ Gospels, the nature of Christ Consciousness, and the │
│ practice of communion with God. │
│ │
│ → The Second Coming of Christ │
│ Yogananda's verse-by-verse commentary on the │
│ Gospels — 1,600 pages exploring the inner meaning │
│ of Christ's words. │
│ │
│ → Christ — theme page │
│ Passages about Jesus from across all books. │
│ │
│ → Bible — reverse bibliography │
│ Every Biblical reference in Yogananda's works. │
│ │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│ │
│ You may also recognize: │
│ prayer → Yogananda calls it "meditation" │
│ Holy Spirit → he writes of "AUM, the cosmic │
│ vibration" │
│ │
│ 💬 "I... perceive the voice of God, a great │
│ harmony... the voice of Aum or Amen, the │
│ great cosmic sound." │
│ — Autobiography of a Yogi, Ch. 14, p. 161 │
│ │
└──────────────────────────────────────────────────────────────┘
```

**"You may also recognize" section:** A small vocabulary bridge at the bottom of each worldview pathway, showing 2–3 terms from the seeker's tradition and Yogananda's equivalent. Not a glossary — a moment of recognition: "Oh, he's talking about the same thing." This data comes from the `spiritual-terms.json` vocabulary bridge, filtered by the perspective's categories. For perspectives where no bridge is needed (SBNR, grief, comparative religion), this section is omitted.

**Representative passage:** Each pathway includes one representative Yogananda passage (verbatim, with full citation) selected by Claude from the corpus search results as the single most resonant quote for that perspective. The reviewer may substitute a different passage. This gives the seeker an immediate taste of what they'll find.

#### Life-Phase Pathway Catalog

The `/guide` page's third group: pathways organized by **where you are in the arc of a life**. Where worldview pathways ask "where are you coming from?", life-phase pathways ask "where are you *in your life right now*?"

This dimension is distinct from situation themes (ADR-032). Situation themes describe circumstances — "parenting," "work," "aging." Life-phase pathways describe temporal identity and characteristic questions. "Parenting" is a circumstance that could arise at 22 or 42; "I'm building a life and trying to balance purpose with responsibility" is a season. The passage selection, tone, and accessibility level all shift with the season.

The Autobiography is a special asset here: it is literally a life-phase narrative. Yogananda's childhood chapters speak to young seekers; his years of searching speak to those in transition; his mission-building years speak to those building a life; his later chapters speak to those approaching the end. An editorial reading thread (DES-026) tracing "The Autobiography as a Life Journey" could map chapters to seasons — the portal's only book that *is* a life story.

| # | Life Phase | Characteristic Question | Key Corpus Affinity | Situation Themes | Tone Filter | Accessibility |
|---|---|---|---|---|---|---|
| 1 | **Young Seeker (13–22)** | "What should I do with my life?" | *Autobiography* youth chapters (1–12), *Where There Is Light*, willpower/concentration passages | — | `practical`, `joyful` | Level 1 (universal) |
| 2 | **Building a Life (22–35)** | "How do I balance the inner and the outer?" | *Man's Eternal Quest*, *Where There Is Light*, *Sayings*, karma yoga passages | Work, Relationships | `practical` | Level 1–2 |
| 3 | **Raising a Family** | "How do I raise my children wisely?" | Parenting passages across books, education teachings, duty to family | Parenting, Relationships | `practical` | Level 1–2 |
| 4 | **The Middle Passage (40–55)** | "Is this all there is?" | *Journey to Self-Realization*, Purpose theme, deepening practice, second-half-of-life passages | Work, Purpose | `contemplative`, `challenging` | Level 2–3 |
| 5 | **The Caregiver** | "Where do I find strength to keep going?" | Divine protection, patience, selfless love, inner reserves, service as spiritual practice | Health/Wellness, Relationships | `consoling`, `practical` | Level 1–2 |
| 6 | **Facing Illness** | "How do I heal — or accept?" | *Scientific Healing Affirmations* (entire book), healing theme, the body and the soul, willpower | Health/Wellness, Healing (quality) | `consoling`, `practical` | Level 1–2 |
| 7 | **The Second Half (55+)** | "How do I grow old with grace?" | Aging theme, wisdom of experience, the soul's eternal youth, deepening practice with time | Aging | `contemplative`, `consoling` | Level 2–3 |
| 8 | **Approaching the End** | "What awaits me?" | Soul's immortality, afterlife passages, fearlessness of death, the transition, the astral world | Loss & Grief, Aging | `consoling`, `contemplative` | Level 2–3 |
| 9 | **New to Spiritual Practice** | "I want to begin but don't know how." | *Autobiography* as entry narrative, meditation descriptions, the Quiet Corner, Joy and Peace themes | — | `practical`, `joyful` | Level 1 (universal) |

**Relationship to situation themes:** Life-phase pathways *compose* existing situation themes into temporal context. The Parenting situation theme page shows all passages about raising children. The "Raising a Family" life-phase pathway says: "You are in a season of family — here is the Parenting theme, here is how Yogananda balanced family duty with spiritual life, here is the Relationships theme for the marriage that sustains the family, and here is the Quiet Corner for the parent who has five minutes of silence."

**The characteristic question:** Each life-phase pathway opens with the question that defines its season — not as a heading, but as the emotional entry point. This replaces the worldview pathway's "If you come from..." framing with "If you are asking..." framing:

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ IF YOU ARE ASKING: "IS THIS ALL THERE IS?" │
│ │
│ The middle of life often brings a quiet reckoning — │
│ the sense that outward success hasn't answered the │
│ inner question. Yogananda wrote extensively about │
│ this turning point: the moment when the soul's │
│ deeper purpose begins to assert itself. │
│ │
│ → Journey to Self-Realization │
│ Talks from Yogananda's later years, when his │
│ own teaching had deepened into direct, practical │
│ wisdom about the soul's journey. │
│ │
│ → Purpose — theme page │
│ Passages on meaning, dharma, and the divine plan │
│ from across all books. │
│ │
│ → "Yogananda on the Two Halves of Life" │
│ An editorial reading thread tracing the arc from │
│ worldly achievement to spiritual deepening. │
│ │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│ │
│ Others in this season have found: │
│ · The Quiet Corner — 5 minutes of stillness │
│ · "Comfort after loss" — if part of the │
│ reckoning involves grief │
│ │
│ 💬 "You must not let your life run in the │
│ ordinary way; do something that nobody else │
│ has done, something that will dazzle the │
│ world." │
│ — The Divine Romance, Ch. 37, p. 440 │
│ │
└──────────────────────────────────────────────────────────────┘
```

**"Others in this season have found" section:** The life-phase equivalent of the worldview pathway's "You may also recognize." Instead of vocabulary bridges (which map across traditions), life-phase pathways offer lateral connections — other portal features that serve this season. The Quiet Corner for the exhausted parent. The Grief theme for the midlife seeker whose reckoning includes loss. The Knowledge Graph for the retired seeker with time to explore. These are editorially curated, not algorithmically generated.

**Age sensitivity:** The pathways use seasons and questions, not age ranges, in the seeker-facing UI. The age ranges in the catalog above are editorial guidance for corpus selection, not display labels. "If you are asking: 'What should I do with my life?'" serves a 16-year-old and a 45-year-old in career transition equally. The content Claude selects may differ (younger-skewing tone for the Youth pathway, deeper teachings for the Middle Passage), but the question is universal.

**The Young Seeker consideration:** The portal will be visited by teenagers — a 14-year-old grieving a grandparent, a 17-year-old curious about meditation from a yoga class. The portal's contemplative voice, slow pace, and absence of gamification actually *serve* this population well — it's the opposite of every other digital experience in their life. But the editorial voice should acknowledge their existence without being patronizing. Passages at accessibility level 1 with `practical` or `joyful` tone naturally serve younger readers. See CONTEXT.md § Open Questions for the editorial sensitivity question.

**Youth & young adult signpost on LP-1:** The Young Seeker pathway should include a quiet signpost to SRF's dedicated youth and young adult programs: "SRF offers programs designed for young seekers — classes, events, and fellowship with others your age. Learn more → yogananda.org." This connects Yogananda's written words (what the portal delivers) with the living community (what SRF offers). The signpost appears after the pathway's content recommendations, not before — the portal's gift is the teachings themselves; the community signpost is the natural next step for a young person who resonates. Same visual weight as the Practice Bridge note: `--portal-text-muted`, Merriweather 300. SRF URL for youth programs is a stakeholder question (CONTEXT.md Q112).

**Generation:** Life-phase pathways use the same AI-assisted generation pipeline as worldview pathways (DES-035 § Worldview Guide Pathway Generation). The prompt template differs: instead of tradition-specific seed queries and vocabulary bridges, life-phase prompts use tone filters, accessibility levels, situation theme associations, and the characteristic question as the generation anchor. Claude searches for passages that *answer the question of this season* and selects resources that serve the seeker's temporal context.

**Generation priority:** Pathways 1, 4, 6, 8 address the most acute life-phase needs and have the strongest emotional urgency. Pathway 9 (New to Spiritual Practice) overlaps with the existing "If you are new to Yogananda's teachings" need-based pathway and may not need a separate life-phase version. Pathways 2, 3, 5, 7 have broader corpus support but less acute urgency.

#### Practice Pathway: "If You Feel Drawn to Practice" (ADR-104)

The culminating pathway — the one every other pathway eventually leads to. Every worldview pathway, every life-phase pathway, every need-based pathway eventually arrives at the same question: "I've been reading, and I want to practice. How do I begin?"

This pathway is distinct from the others because it bridges *from the portal to SRF's institutional path*. Where other pathways point inward (to books, themes, threads, the Quiet Corner), this one points both inward and outward — to the portal's resources for understanding and to SRF's resources for doing.

**Structure:**

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   IF YOU FEEL DRAWN TO PRACTICE                              │
│                                                              │
│   Yogananda wrote that reading about God is not enough —     │
│   the deepest response to the teachings is to practice.      │
│   His published works describe a path from curiosity         │
│   to meditation to the deepest communion with God.           │
│                                                              │
│   → Start now: A Beginner's Meditation                       │
│     Free instruction from SRF — you can practice             │
│     today, right now.                                        │
│     → yogananda.org/a-beginners-meditation                   │
│                                                              │
│   → The Quiet Corner                                         │
│     A moment of stillness on this portal — one               │
│     affirmation, a gentle timer, silence.                    │
│                                                              │
│   → Meditate with others                                     │
│     Find a meditation group near you, or join                │
│     a live session at the Online Meditation Center.          │
│     → yogananda.org (center locator)                         │
│     → onlinemeditation.yogananda.org                         │
│                                                              │
│   → Autobiography of a Yogi, Chapter 26                      │
│     "The Science of Kriya Yoga" — Yogananda's public         │
│     account of the technique's ancient lineage               │
│     and purpose.                                             │
│                                                              │
│   → Kriya Yoga — theme page                                  │
│     Passages about Kriya Yoga from across all                │
│     published books.                                         │
│                                                              │
│   → The SRF Lessons                                          │
│     A 9-month home-study course in meditation and            │
│     spiritual living, including preparation for              │
│     Kriya Yoga initiation.                                   │
│     → yogananda.org/lessons                                  │
│                                                              │
│   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─            │
│                                                              │
│   Others have shared their experiences with                  │
│   meditation and the teachings in                            │
│   Self-Realization Magazine.                                 │
│   → yogananda.org/self-realization-magazine                  │
│                                                              │
│   💬 "You do not have to struggle to reach God,              │
│      but you do have to struggle to tear away the            │
│      self-created veil that hides Him from you."             │
│      — Man's Eternal Quest, p. 119                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**What makes this pathway different from LP-9 ("New to Spiritual Practice"):** LP-9 serves the newcomer who has never meditated — its resources are introductory. The Practice pathway serves the seeker who has been *reading Yogananda's teachings on the portal* and feels drawn to formal practice. The two overlap in some resources (the Quiet Corner, the Beginner's Meditation) but differ in editorial framing and depth: the Practice pathway includes Autobiography Ch. 26, the Kriya Yoga theme page, and the SRF Lessons — none of which appear in LP-9.

**Progression mirrors SRF's own site:** Begin free (Beginner's Meditation) → taste stillness (Quiet Corner) → meditate with others (center locator, Online Meditation Center — honoring Yogananda's emphasis on satsanga) → understand the path (Autobiography Ch. 26, Kriya theme) → commit when ready (SRF Lessons). The free resources appear first. The addition of group meditation acknowledges that Yogananda consistently emphasized spiritual fellowship (satsanga) as integral to the path — the practice pathway should not present meditation as exclusively solitary.

**Editorial voice:** Navigational, never promotional. "Yogananda wrote that reading about God is not enough" is a factual description of his published position. The framing text never says "you should enroll" — it says "here is the path, if you want it."

**Provenance:** Same three-state model as all pathways. Claude drafts initial text; theological reviewer approves.

**Milestone:** 3b (with the rest of `/guide`). Requires the Kriya Yoga theme page (Milestone 3c+) for the theme link; until then, the link points to Autobiography Ch. 26 only.

#### Thematic Corpus Exploration — "Explore a Theme in Depth"

The curated pathways above answer "where should I go?" for common starting points. Thematic Corpus Exploration answers a different question: **"show me everything this library holds on a topic I choose."** This is the interactive, query-driven dimension of `/guide` — the reference librarian who spreads every relevant book across the reading table, organized by the library's own catalog.

**Seeker experience:** A seeker enters a question ("What does Yogananda teach about forgiveness?") or selects from editorially suggested starting points. The system returns an organized landscape — not a ranked list of passages, but a structured view of the library's holdings on that topic:

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   THE LIBRARY'S HOLDINGS ON: FORGIVENESS                     │
│                                                              │
│   Here is what the library holds on this theme.              │
│   These groupings reflect the library's indexing.            │
│                                                              │
│   ───────────────────────────────────────────────────────    │
│                                                              │
│   FORGIVENESS AS DIVINE QUALITY                              │
│                                                              │
│   💬 "If you forgive those that wrong you, the              │
│      electricity of forgiveness... will burn out their       │
│      wrong."                                                 │
│      — Where There Is Light, p. 83                           │
│      [Read in context →]                                     │
│                                                              │
│   + 4 more passages in this grouping                         │
│                                                              │
│   ───────────────────────────────────────────────────────    │
│                                                              │
│   FORGIVING OTHERS                                           │
│                                                              │
│   💬 "There is no sense in your suffering because            │
│      somebody else has done wrong."                          │
│      — Man's Eternal Quest, Ch. 14, p. 187                   │
│      [Read in context →]                                     │
│                                                              │
│   + 3 more passages in this grouping                         │
│                                                              │
│   ───────────────────────────────────────────────────────    │
│                                                              │
│   ACROSS THE LIBRARY                                         │
│                                                              │
│   Found in 4 books: Man's Eternal Quest (7 passages),        │
│   Where There Is Light (5), Journey to Self-Realization (3), │
│   Autobiography of a Yogi (2)                                │
│                                                              │
│   ───────────────────────────────────────────────────────    │
│                                                              │
│   TERMS YOU MAY ENCOUNTER                                    │
│                                                              │
│   karma — The law of cause and effect → glossary             │
│   maya — Cosmic delusion → glossary                          │
│                                                              │
│   ───────────────────────────────────────────────────────    │
│                                                              │
│   RELATED THEMES                                             │
│                                                              │
│   Compassion · Unconditional Love · Letting Go               │
│                                                              │
│   ───────────────────────────────────────────────────────    │
│                                                              │
│   Was this helpful? [Yes] [I expected something different]   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**How it works (pre-computed organization — no real-time AI interpretation):**

1. Seeker enters a question or selects a theme
2. Hybrid search (existing infrastructure, DES-003) retrieves relevant passages
3. Results are grouped by their **pre-computed sub-theme tags** (ADR-115 unified enrichment, reviewed per ADR-100)
4. Within groups, passages are ordered by search relevance score, annotated with pre-computed tone and experiential depth
5. Cross-book connections shown via pre-computed chunk relations (ADR-050)
6. Glossary terms surfaced from pre-computed entity references (ADR-116)
7. Related themes suggested from the theme taxonomy, connected to the found passages (ADR-032)

All organization uses index-time enrichment data computed under the editorial review pipeline (ADR-100). The query-time system **selects and arranges** — it does not classify, cluster, or interpret. Sub-theme grouping uses two strategies: (1) **exact taxonomy match** — passages tagged with a sub-theme of the queried topic are grouped under that sub-theme heading; (2) **dimensional combination** — when no exact sub-theme exists, passages are grouped by combinations of pre-computed dimensions (tone, voice register, experiential depth, book). A query about "Yogananda's humor" may not match a taxonomy entry, but passages with `tone: joyful` + `voice_register: conversational` form a natural grouping. The enrichment dimensions (ADR-115) are building blocks, not finished rooms — they combine at query time to serve questions the taxonomy didn't anticipate. If neither strategy produces meaningful groupings, passages appear in a single ungrouped list — honest about the library's current indexing depth rather than fabricating structure.

**Relationship to search.** Search (DES-003, `/api/v1/search`) answers "find me a passage." Thematic exploration answers "show me the landscape." Search returns a ranked list — best first, intentionally unpaginated (ADR-111). Thematic exploration returns a structured overview — organized by sub-theme, annotated with context, designed for study rather than lookup. The seeker arrives at thematic exploration from the `/guide` page, from a theme page's "Explore in depth" link, or from a search result's "See more on this topic" affordance.

**Relationship to theme pages.** Theme pages (`/themes/{slug}`) show all passages tagged with a single curated theme. Thematic exploration is broader — a seeker's question may span multiple themes, and the exploration surfaces that cross-theme structure. "Forgiveness" might pull passages tagged under Compassion, Karma, and Divine Love as well as Forgiveness itself. The theme page is a known destination; the exploration is a discovery tool.

**No account required.** Consistent with the portal's anonymous experience through Arc 6 (ADR-002, ADR-121). Individual passages found during exploration can be saved via Lotus Bookmarks (ADR-066). The exploration itself is stateless — the seeker can re-enter the same question anytime.

**Contextual feedback.** When a passage feels inappropriate for a given exploration context, seekers can flag via the DELTA-compliant feedback mechanism (ADR-084). Feedback is categorized (see DES-035 § Feedback Categorization) and routed to editorial staff. Over time, patterns in contextual feedback may inform a new enrichment dimension — audience suitability — but this is a future consideration (see CONTEXT.md § Open Questions), not a Milestone 3b requirement.

**Global-First (ADR-006).** The exploration view is HTML-first — sub-theme groupings are semantic `<section>` elements with heading hierarchy, not JavaScript-dependent interactive widgets. The full exploration renders without JavaScript. Progressive enhancement adds expand/collapse for passage groups, smooth scroll to sections, and keyboard-driven group navigation (DES-013). Performance budget: exploration response renders within the existing FCP < 1.5s target; passage groups beyond the first two are lazy-loaded to keep initial payload under the 50KB homepage budget for the exploration entry point.

**Screen reader experience (ADR-073).** Each sub-theme group is an ARIA landmark region with a descriptive label. The "Across the Library" section provides an audio-friendly summary of corpus distribution — the screen reader user hears the library's breadth before diving into individual passages. "Terms You May Encounter" links each term to the glossary with `aria-describedby` for inline definitions.

**Multilingual (ADR-075).** Exploration works in any language the corpus supports. If the seeker's locale has fewer passages on a topic, the exploration is honest about coverage: "The library holds 3 passages on this theme in Hindi. The English collection holds 17." The seeker can toggle to English or explore what's available — never a degraded or empty experience.

**`/guide` page integration.** The exploration input appears after the curated pathways, as a natural deepening. The curated pathways serve seekers who arrive with a general need ("I'm dealing with loss"); the exploration serves seekers who arrive with a specific curiosity ("What did Yogananda teach about the astral body?"). The page flow: (1) need-based pathways, (2) worldview pathways, (3) life-phase pathways, (4) Practice pathway, (5) a transition — "Or explore the library yourself" — with an input field and suggested starting points. The exploration input is not a search bar (the header already has one); it's positioned and styled as a continuation of the guide — the librarian saying "those were my recommendations; now tell me what *you're* looking for." Visually: same warm background, same typography, no chrome that suggests a different mode.

**Technique boundary (ADR-104, PRI-04).** Queries about meditation technique — Kriya Yoga, Hong-Sau, AUM meditation, Energization Exercises — receive Practice Bridge behavior, not exploration results. The same search intent classification (ADR-005 E1) that governs the search endpoint governs the exploration endpoint. When the classifier detects a technique query, the exploration response includes the Practice pathway content (see § Practice Pathway above) instead of passage groupings. The seeker sees Yogananda's *published descriptions* of the practice path, the Quiet Corner, and the SRF Lessons link — never technique instruction, never a collection of passages that could be assembled into a how-to guide. This is the exploration's only editorial override: one class of query gets redirected to the pastoral response rather than the library's holdings.

**Suggested starting points.** The `/guide` page offers 10–15 editorially curated exploration starting points below the curated pathways — high-interest topics that demonstrate the exploration capability: "Meditation," "The Nature of God," "Overcoming Fear," "Death and the Afterlife," "Finding Your Purpose." These are not pathways (no editorial framing text) — they are direct links into thematic exploration. Curated by editorial staff, refreshed quarterly.

**API endpoint:**

```
GET /api/v1/guide/explore

Query params:
  q (required) — seeker's question or theme
  language (optional) — default 'en'
  limit_per_group (optional) — default 3, max 10

Response:
{
  "query": "What does Yogananda teach about forgiveness?",
  "groups": [
    {
      "sub_theme": "Forgiveness as Divine Quality",
      "sub_theme_slug": "forgiveness-divine-quality",
      "passages": [
        {
          "chunk_id": "uuid",
          "content": "If you forgive those that wrong you...",
          "book_title": "Where There Is Light",
          "chapter_title": "Forgiveness",
          "page_number": 83,
          "tone": "consoling",
          "experiential_depth": 2,
          "reader_url": "/books/where-there-is-light/5#chunk-uuid"
        }
      ],
      "total_in_group": 5
    }
  ],
  "distribution": {
    "books": [
      { "title": "Man's Eternal Quest", "count": 7 },
      { "title": "Where There Is Light", "count": 5 }
    ],
    "total_passages": 17
  },
  "glossary_terms": [
    { "term": "karma", "slug": "karma", "brief": "The law of cause and effect" }
  ],
  "related_themes": [
    { "name": "Compassion", "slug": "compassion" },
    { "name": "Unconditional Love", "slug": "unconditional-love" }
  ],
  "meta": { "language": "en" }
}
```

**Service layer:** `/lib/services/guide-exploration.ts` — orchestrates hybrid search, enrichment data assembly, sub-theme grouping from pre-computed tags, glossary term extraction, related theme identification, response formatting. Uses existing services: `search.ts`, `themes.ts`, `glossary.ts`, `relations.ts`. No AI calls at query time.

**MCP access (DES-031 Tier 2).** The same service functions power the MCP `search_corpus` and `get_content_coverage` tools. Internal consumers (editorial staff, development) access the exploration capability through MCP; public seekers access it through the API endpoint. Same data, same organization, same pre-computed enrichment.

**Caching.** Exploration responses are deterministic for a given query + language (same pre-computed enrichment, same groupings). This makes them highly cacheable. The API route sets `Cache-Control: public, s-maxage=300, stale-while-revalidate=600` — a 5-minute edge cache with 10-minute stale-while-revalidate. When the enrichment pipeline re-processes passages (e.g., after a new book ingestion), a cache-busting revalidation is triggered via the existing Contentful webhook → cache purge flow. Suggested starting points (editorially curated) are cached at ISR build time with 24-hour revalidation. At global scale, this means the first seeker exploring "peace" generates the database queries; the next 1,000 seekers in the same 5-minute window are served from edge cache. No AI API cost at any point.

**Milestone:** 3b (requires enrichment pipeline operational, theme taxonomy populated, chunk relations computed). The exploration degrades gracefully before full enrichment: with only search and basic theme tags (Milestone 1c), the exploration returns a flat list grouped by book — still useful, just less structured. Full sub-theme grouping arrives when the enrichment pipeline (ADR-115) is operational.

---
