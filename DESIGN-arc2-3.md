# SRF Online Teachings Portal — Arcs 2–3 Design (Presence + Wisdom)

> **Scope.** This file contains the technical design sections relevant to **Arc 2: Presence** (Milestones 2a/2b) and **Arc 3: Wisdom** (Milestones 3a–3d) — building the frontend, adding content types, multilingual infrastructure, and operational tooling. For cross-cutting principles and navigation, see [DESIGN.md](DESIGN.md). For Arc 1, see [DESIGN-arc1.md](DESIGN-arc1.md). For Arc 4+, see [DESIGN-arc4-plus.md](DESIGN-arc4-plus.md).
>
> **Parameter convention (ADR-123).** Specific numeric values in this document (cache TTLs, debounce timers, fusion parameters, chunk sizes, rate limits, color band boundaries, purge delays, revalidation intervals) are **tunable defaults**, not architectural commitments. They represent best pre-production guesses and should be implemented as named configuration constants in `/lib/config.ts`, not hardcoded literals. Milestone 1a.9 (search quality evaluation) and subsequent arc gates include parameter validation as deliverables. When a parameter is tuned based on evidence, annotate the section: `*Parameter tuned: [date], [old] → [new], [evidence].*` See ADR-123 for the full governance framework.

---

## DES-006: Frontend Design

### Pages

| Route | Purpose | Data Source | Rendering | Indexed |
|-------|---------|------------|-----------|---------|
| `/` | Home — Today's Wisdom, search bar, thematic doors, "Seeking..." entry points, latest video | Neon (daily passages) + YouTube RSS | ISR (5 min) | Yes |
| `/search?q=...` | Search results — ranked verbatim quotes | Neon (hybrid search) | SSR | Yes (via `SearchAction`) |
| `/themes/[slug]` | Topic page — curated passages for a theme, person, principle, or practice | Neon (topic-tagged chunks) | ISR (1 hr) | Yes |
| `/quiet` | The Quiet Corner — single affirmation, timer, stillness | Neon (affirmations pool) | ISR (1 hr) | Yes |
| `/books` | The Library — book catalog with editorial descriptions | Contentful (SSG/ISR) | ISR (24 hr) | Yes |
| `/books/[slug]` | Book landing page with cover, description, chapter list | Contentful (SSG/ISR) | ISR (24 hr) | Yes |
| `/bookmarks` | Lotus Bookmarks — saved chapters and passages (client-only, `localStorage`) | `localStorage` (no server) | CSR | No (`noindex`) |
| `/books/[slug]/[chapter]` | Chapter reader | Contentful (SSG/ISR) | ISR (7 days) | Yes |
| `/books/[slug]/[chapter]#chunk-[id]` | Deep link to specific passage | Same as above, scrolled to passage | ISR (7 days) | Yes (canonical: passage page) |
| `/passage/[chunk-id]` | Single passage shareable view (OG + Twitter Card optimized) | Neon | ISR (7 days) | Yes |
| `/about` | About SRF, Yogananda, the line of gurus, "Go Deeper" links | Static (ISR) | ISR (7 days) | Yes |
| `/events` | Gatherings & Events — convocation, commemorations, online events, retreats | Static (ISR) | ISR (24 hr) | Yes |
| `/places` | Sacred Places — SRF/YSS properties and biographical sites | Neon `places` table (ISR) | ISR (7 days) | Yes |
| `/places/[slug]` | Individual place detail with book cross-references | Neon `places` + `chunk_places` (ISR) | ISR (7 days) | Yes |
| `/videos` | Video library — categorized by playlist | YouTube API (ISR) | ISR (1 hr) | Yes |
| `/videos/[category]` | Filtered view (e.g., How-to-Live, Meditations) | YouTube API (ISR) | ISR (1 hr) | Yes |
| `/study` | Study Workspace — passage collection, teaching arc assembly, export (Arc 4, ADR-083) | `localStorage` (no server) | CSR | No (`noindex`) |
| `/collections` | Community Collections gallery — published/featured curated passage collections (Milestone 7b, ADR-086) | Neon (`study_outlines` where visibility = published/featured) | ISR (1 hr) | Yes |
| `/collections/[share-hash]` | Single community collection view (Arc 4 shared-link, Milestone 7b published) | Neon (`study_outlines` + `study_outline_sections` + `study_outline_passages`) | ISR (24 hr) | Yes |
| `/feedback` | Seeker feedback — citation errors, search suggestions, general feedback (Milestone 3b, ADR-084) | Neon (`seeker_feedback`) | SSR | No (`noindex`) |
| `/privacy` | Privacy policy — what data is collected, why, how long, sub-processors, data subject rights (Milestone 2a, ADR-099) | Static (ISR) | ISR (30 days) | Yes |
| `/legal` | Legal information — terms of use, copyright, content licensing (Milestone 2a, ADR-099) | Static (ISR) | ISR (30 days) | Yes |
| `/browse` | Complete content index — all navigable content by category (Milestone 2a, DES-047) | Neon (ISR) | ISR (24 hr) | Yes |
| `/updates` | Portal updates — new books, features, languages (Milestone 5a+, ADR-105) | Neon `portal_updates` | ISR (1 hr) | Yes |

**Rendering key:** ISR = Incremental Static Regeneration (server-rendered, cached at CDN, revalidated on schedule). SSR = Server-Side Rendered (fresh on every request). CSR = Client-Side Rendered (JavaScript only, no server HTML). All ISR and SSR pages deliver complete HTML with JSON-LD, OG tags, Twitter Card tags, and full content to crawlers — no content page depends on client-side data fetching. Content negotiation (ADR-081 §11): all ISR/SSR routes also respond with structured JSON when the `Accept: application/json` header is sent. See ADR-081 §15 for the full rendering strategy rationale.

### Search Results Component

```
┌──────────────────────────────────────────────────────────┐
│ 🔍 How do I overcome fear? [Search] │
├──────────────────────────────────────────────────────────┤
│ │
│ 5 passages found across 2 books │
│ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ │ │
│ │ "The soul is ever free; it is deathless, │ │
│ │ birthless, ever-existing, ever-conscious, │ │
│ │ ever-new Bliss. When by meditation you │ │
│ │ realize this truth, fear will have no hold │ │
│ │ on you." │ │
│ │ │ │
│ │ Autobiography of a Yogi · Chapter 26 · p. 312 │ │
│ │ Read in context → │ │
│ │ │ │
│ └────────────────────────────────────────────────────┘ │
│ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ │ │
│ │ "Fear is the greatest enemy of man. It robs him │ │
│ │ of his true nature, of his joy, of his power │ │
│ │ to act wisely." │ │
│ │ │ │
│ │ Man's Eternal Quest · "Removing the Mask" · p. 87│ │
│ │ Read in context → │ │
│ │ │ │
│ └────────────────────────────────────────────────────┘ │
│ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ ... │ │
│ └────────────────────────────────────────────────────┘ │
│ │
└──────────────────────────────────────────────────────────┘
```

### DES-007: Opening Moment — Portal Threshold

On the **first visit** per browser session, the homepage presents a brief threshold before content appears:

1. Warm cream background with a small SRF lotus SVG (~40px, `--srf-gold` at 30% opacity) centered on the screen.
2. After 800ms, the lotus fades to 0% over 400ms as homepage content gently fades in.
3. Total: ~1.2 seconds. No text. No logo. No "loading..." message. Just a breath.

**Constraints:**
- **First visit only** per session (`sessionStorage`). Returning to homepage within the same session shows content immediately.
- **`prefers-reduced-motion`:** Entire threshold skipped. Content appears instantly.
- **Direct deep links:** Only applies to `/`. Navigation to `/books/...`, `/search?...`, etc. is never delayed.
- **Slow connections:** If content hasn't loaded when the threshold ends, the lotus remains visible until ready — replacing what would otherwise be a white flash or skeleton screen. A technical necessity becomes a contemplative gesture.

### Homepage: "The Living Library"

The homepage should feel like opening a sacred book — not a SaaS dashboard, not a landing page with a hero banner. Its purpose is threefold: offer a moment of stillness (Today's Wisdom), invite exploration (thematic doors), and provide a tool for the deliberate seeker (search).

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ │
│ │
│ "Have courage. Whatever you are going through │
│ will pass. Trust in God's plan for you." │
│ │
│ — Where There Is Light, p. 42 │
│ │
│ Show me another │
│ │
│ ─────────────────────────────────────────────────────────── │
│ │
│ What are you seeking? │
│ [________________________________] [Search] │
│ │
│ ─────────────────────────────────────────────────────────── │
│ │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Peace │ │ Courage │ │ Healing │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Joy │ │ Purpose │ │ Love │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│ │
│ ─────────────────────────────────────────────────────────── │
│ │
│ Seeking... │
│ │
│ · Peace in a restless mind │
│ · Comfort after loss │
│ · Purpose and direction │
│ · Courage through fear │
│ · The heart to forgive │
│ │
│ ─────────────────────────────────────────────────────────── │
│ │
│ Latest from @YoganandaSRF │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ ▶ thumb │ │ ▶ thumb │ │ ▶ thumb │ View all → │
│ │ title │ │ title │ │ title │ │
│ └─────────┘ └─────────┘ └─────────┘ │
│ │
└──────────────────────────────────────────────────────────────┘
```

#### Today's Wisdom

A single Yogananda passage displayed prominently on every visit. The passage changes on each page load.

**Source material (priority order):**
1. *Sayings of Paramahansa Yogananda* — standalone aphorisms, naturally quotable
2. *Where There Is Light* — topically organized excerpts
3. *Metaphysical Meditations* — affirmations and meditations
4. Curated selections from any ingested book (editorial)

**Behavior:**
- On page load, select a random passage from the `daily_passages` pool (see Data Model)
- "Show me another" link fetches a different random passage (client-side fetch to `/api/v1/daily-passage?exclude=[current-chunk-id]`). The same passage is never shown twice in a row.
- The passage gently cross-fades (300ms) to the new one — no page reload, no spinner. With `prefers-reduced-motion`: instant swap.
- There is no limit on how many times a reader can click "Show me another." The pool is the entire `daily_passages` table. This is bibliomancy — the ancient practice of opening a sacred text to a random page for guidance, in digital form.
- "Show me another" is a text link in Merriweather 300 with `--srf-gold` underline on hover. Not a button. Not a card. Just words — an invitation.
- No personalization, no tracking, no cookies — pure randomness
- Optional seasonal weighting: passages can be tagged with seasonal affinity (e.g., "renewal" passages weighted higher in January, "light" passages in December) — but this is editorial curation, not algorithmic

**Seasonal curation (optional, editorial):**

| Season | Affinity Tags | Examples |
|--------|--------------|---------|
| New Year (Jan) | renewal, willpower, beginnings | Teachings on new habits, determination |
| Spring (Mar–May) | growth, awakening, joy | Teachings on spiritual blossoming |
| Summer (Jun–Aug) | energy, vitality, abundance | Teachings on divine energy, prosperity |
| Autumn (Sep–Nov) | gratitude, harvest, introspection | Teachings on thankfulness, self-examination |
| Winter (Dec–Feb) | light, peace, inner warmth | Teachings on the inner light, stillness |

Seasonal weighting is a soft bias (e.g., 60% seasonal / 40% general), never a hard filter. A passage about courage can appear in any season.

**Circadian content choreography :**

The portal shifts visual warmth by time of day (DES-011). It also shifts *content* warmth. The passage pool carries a `time_affinity` tag — the same circadian bands as DES-011's color temperature:

| Band | Hours | Character | Passage affinity |
|------|-------|-----------|-----------------|
| Dawn | 5:00–8:59 | Awakening | Vitality, new beginnings, divine energy, Energization |
| Morning | 9:00–11:59 | Clarity | Willpower, concentration, right action, purpose |
| Afternoon | 12:00–16:59 | Steadiness | Perseverance, equanimity, courage, service |
| Evening | 17:00–20:59 | Softening | Gratitude, love, devotion, peace |
| Night | 21:00–4:59 | Consolation | The eternal soul, fearlessness, God's presence, comfort |

The 2 AM seeker — the person the "Seeking..." entry points are designed for — encounters passages about comfort and the eternal nature of consciousness, not about willpower and new habits. Zero tracking, zero profiling. The client sends `time_band` computed from `new Date.getHours`; the server selects from an affinity-weighted pool (60% time-matched / 40% general, same ratio as seasonal). Passages with no `time_affinity` (NULL) are eligible in all bands. Both seasonal and circadian affinities can apply simultaneously — they compose naturally as weighted random selection.

**Solar-position awareness (locale-sensitive circadian UX):**

The fixed-clock-hour bands above assume a single global relationship between "2 AM" and the human experience. They don't hold everywhere:

- **Brahmamuhurta (3:30–5:30 AM)** in Indian tradition is the auspicious pre-dawn period for meditation — a seeker awake at 4 AM in Kolkata is likely practicing, not unable to sleep from anxiety. "Consolation" at this hour misreads the cultural context.
- **Summer in Helsinki:** 2 AM has twilight. The emotional register of "Night" doesn't match the sky.
- **Equatorial regions:** Sunrise and sunset barely shift across the year. Fixed bands work better than at high latitudes.

The solution uses three signals already present on every request — none requiring new data collection:

1. **Browser timezone** — `Intl.DateTimeFormat().resolvedOptions().timeZone` gives the IANA zone name (e.g., `Asia/Kolkata`, `America/Chicago`). Client-side, no permission.
2. **Locale path prefix** — `/hi/` implies India, `/de/` implies Germany. The URL the seeker already chose.
3. **`navigator.language` country code** — `hi-IN`, `de-DE`. Already in the browser, client-side.

Timezone alone has a north-south accuracy problem: `America/Chicago` spans from Texas (26°N) to North Dakota (49°N) — a 1.5-hour summer sunrise spread. Adding country narrows this significantly. Timezone + country → centroid latitude is accurate to ±200km for most combinations, giving sunrise accuracy within ±15 minutes. For single-timezone countries (India, Japan, Germany), the accuracy is even better.

**Accepted inaccuracy:** For large multi-timezone countries (US, Russia, Brazil), the centroid latitude of a timezone+country combination still has ±30–45 minute sunrise uncertainty. This is acceptable because the bands are 1.5–3 hours wide and selection is probabilistic (60/40 weighted). A seeker at a band boundary might receive a passage from the adjacent band — which is still a reasonable passage for that hour. The design accepts this inaccuracy to remain DELTA-compliant. No geolocation API, no IP-derived location, no permission prompt.

**Latitude derivation:**

```
Client computes:
  1. timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
     (e.g., "Asia/Kolkata", "America/Chicago")
  2. country = navigator.language country code OR locale path prefix
     (e.g., "IN", "US", "DE")
  3. latitude = lookup(timezone, country)
     (static table, ~3KB — maps timezone+country pairs to centroid latitudes)
  4. sunrise, sunset = suncalc(latitude, timezoneLongitude, today)
     (deterministic solar calculation, ~2KB)
  5. time_band = classify(currentHour, sunrise, sunset, locale)
```

**Accuracy by key locale:**

| Locale | Timezone | Country | Centroid lat | Sunrise accuracy | Notes |
|--------|----------|---------|-------------|-----------------|-------|
| Hindi | `Asia/Kolkata` | IN | ~22°N | ±30 min | Single timezone covers all India; brahmamuhurta override makes solar precision less critical |
| Bengali | `Asia/Kolkata` | IN | ~22°N | ±30 min | Same as Hindi |
| Thai | `Asia/Bangkok` | TH | ~14°N | ±20 min | Single timezone; tropical latitude means consistent sunrise times year-round |
| Japanese | `Asia/Tokyo` | JP | ~36°N | ±20 min | Single timezone; north-south extent moderate |
| German | `Europe/Berlin` | DE | ~51°N | ±15 min | Small country; high accuracy |
| Spanish (Latin Am) | varies | varies | varies | ±30–45 min | Multiple timezones across Latin America; good enough |
| US English | varies | US | varies | ±45 min | Large timezone spans; widest inaccuracy but bands are forgiving |

**Classification with locale profiles:**

| Condition | Band | Character |
|-----------|------|-----------|
| 1.5h before sunrise → sunrise | `dawn` | Awakening (or brahmamuhurta in Indian locales) |
| sunrise → solar noon - 1h | `morning` | Clarity, purpose |
| solar noon - 1h → sunset - 2h | `afternoon` | Steadiness, perseverance |
| sunset - 2h → sunset + 1.5h | `evening` | Softening, gratitude |
| sunset + 1.5h → 1.5h before sunrise | `night` | Consolation, the eternal soul |

**Indian locale override:** For `hi` and `bn` locales, 3:30–5:30 AM maps to a `brahmamuhurta` band (regardless of solar position) — passages emphasize meditation practice, divine energy, and dawn consciousness rather than consolation. The API gains an optional `brahmamuhurta` time_band value; the server selects from a meditation-practice-weighted pool. This band coexists with `dawn` — it covers the pre-dawn period that `dawn` would otherwise absorb.

**Fallback:** If timezone is unavailable (rare), fall back to the fixed clock-hour bands above. The fixed bands remain the correct default for environments where timezone data is missing.

**Implementation cost:** ~5KB client-side (timezone+country → latitude table ~3KB + suncalc ~2KB). The client computes `time_band` and sends it as a query parameter — the server never sees timezone, country, or coordinates. No new database columns. No server-side location processing. The server receives only a band name (`dawn`, `night`, `brahmamuhurta`, etc.) — the same opacity as the current fixed-clock design.

**Milestone:** Solar-aware circadian ships alongside the circadian color temperature (distributed across arcs as capabilities mature). Indian locale brahmamuhurta override ships in Milestone 5b with the Hindi/Bengali launch.

**API:**

```
GET /api/v1/daily-passage
 Query params:
 language (optional) — default 'en'
 exclude (optional) — chunk ID to exclude (prevents repeat on "Show me another")
 time_band (optional) — circadian band: 'dawn', 'morning', 'afternoon', 'evening', 'night', 'brahmamuhurta' (Indian locales, 3:30–5:30 AM)

 Response:
 {
 "chunk_id": "uuid",
 "content": "Have courage. Whatever you are going through will pass...",
 "book_title": "Where There Is Light",
 "page_number": 42,
 "chapter_title": "Courage",
 "reader_url": "/books/where-there-is-light/3#chunk-uuid"
 }
```

#### Thematic Doors ("Doors of Entry")

Six **quality** theme cards displayed below the search bar. Each links to `/themes/[slug]`. Only themes with `category = 'quality'` appear here — the homepage grid stays calm and stable. (ADR-032)

**Card design:**
- Minimal: theme name in Merriweather Light, centered on a warm cream card
- Subtle `--srf-gold` border on hover
- No icons, no images, no descriptions — the single word is the invitation
- Cards use `--portal-quote-bg` background, transitioning to `--srf-gold` left border on hover

**"Explore all themes" link:** Below the six doors, a quiet text link ("Explore all themes →") leads to `/themes`, which organizes all theme categories into distinct sections. This page is also linked from the Library. (ADR-032, ADR-033)

**Exploration categories on `/themes`:**

| Category | Section Heading | Examples | Milestone |
|----------|----------------|----------|-----------|
| `quality` | "Doors of Entry" | Peace, Courage, Healing, Joy, Purpose, Love | 3b |
| `situation` | "Life Circumstances" | Relationships, Parenting, Loss & Grief, Work | 3b+ |
| `person` | "Spiritual Figures" | Christ, Krishna, Lahiri Mahasaya, Sri Yukteswar, Patanjali, Kabir | 3c+ |
| `principle` | "Yogic Principles" | Ahimsa (Non-violence), Satya (Truthfulness), Tapas (Self-discipline), etc. | 3c+ |
| `scripture` | "Sacred Texts" | Yoga Sutras of Patanjali, Bhagavad Gita, Bible, Rubaiyat of Omar Khayyam | 3c+ |
| `practice` | "Spiritual Practices" | Meditation, Concentration, Pranayama, Affirmation, Energization | 3b+ |
| `yoga_path` | "Paths of Yoga" | Kriya Yoga, Raja Yoga, Bhakti Yoga, Karma Yoga, Jnana Yoga, Hatha Yoga, Mantra Yoga | 3c+ |

**Kriya Yoga theme page scope note (ADR-104):** The Kriya Yoga theme page (`/themes/kriya-yoga`) shows Yogananda's *published descriptions* of Kriya Yoga and its place in the yoga tradition — not technique instruction. An editorial note at the top of the page, styled as a quiet `--portal-text-muted` block: "Yogananda's published descriptions of Kriya Yoga and its place in the yoga tradition. Formal instruction in Kriya Yoga is available through the SRF Lessons → yogananda.org/lessons." This note is editorial content in `messages/{locale}.json`, SRF-reviewed. The note appears only on the Kriya Yoga theme page, not on other `yoga_path` themes. Below the note, the standard theme page layout: tagged passages, "Read in context" links, "Show more" — same as every other theme.

Each category is a calm, distinct section on the `/themes` page — not a tabbed interface, just vertical sections with clear headings. Categories appear only when they contain at least one published topic. A topic goes live when an editor judges the tagged passages have sufficient depth — no fixed minimum count. Five deeply relevant passages about Laya Yoga is worth publishing; three tangentially tagged passages about a new topic probably isn't. Human judgment, not mechanical thresholds. The six quality themes remain the sole presence on the homepage.

**Theme page (`/themes/[slug]`):**
- Same layout for all categories — no visual distinction between a quality theme and a person or principle
- Displays 5–8 passages from across all books, tagged with that theme
- Each visit shows a different random selection from the tagged pool
- Passages presented in the same format as search results (verbatim quote, citation, "Read in context")
- A "Show more" button loads additional passages
- No pagination — infinite gentle scroll, loading 5 more at a time
- Header: theme name + a brief Yogananda quote that encapsulates the theme (editorially chosen)
- Only passages with `tagged_by IN ('manual', 'reviewed')` are displayed — never unreviewed auto-tags

#### Practice Bridge Tag (ADR-104)

An editorial annotation — `practice_bridge: true` — on passages where Yogananda explicitly invites the reader to move from reading to practice. Not every mention of meditation or Kriya Yoga — only passages where the author's intent is clearly "do this, don't just read about it."

**Tagging:** Human-tagged, same three-state pipeline as theme tags (ADR-032). Auto-classification may propose candidates; humans make every decision.

**Display:** On tagged passages in the reader, search results, and theme pages, a quiet contextual note appears below the citation:

```
Yogananda taught specific meditation techniques through
Self-Realization Fellowship.
Begin with a free meditation → yogananda.org/meditate
Learn about the SRF Lessons → yogananda.org/lessons
```

Styled in `--portal-text-muted`, Merriweather 300, `--text-sm` — the same visual weight as the "Find this book" bookstore link. Not a modal, not a card, not a CTA. A signpost, not a funnel. Present on every occurrence of the tagged passage across the portal.

**Content:** The note text is editorial content in `messages/{locale}.json` — localized in Milestone 5b+, SRF-reviewed in all locales. The external URLs (`yogananda.org/meditate`, `yogananda.org/lessons`) are constants, not per-locale (SRF's site handles its own locale routing).

**Schema addition:**

```sql
ALTER TABLE book_chunks ADD COLUMN practice_bridge BOOLEAN NOT NULL DEFAULT false;
```

**Milestone:** 3b+ (alongside the theme tagging pipeline). Initial tagging pass during multi-book corpus expansion (Milestones 3a–3b).

#### "Seeking..." (Empathic Entry Points)

Below the thematic doors, a section for the 2 AM visitor — the person who isn't browsing, but in need. This is the most empathetic expression of the Findability Principle: meeting the seeker *in their moment* with zero friction between their need and Yogananda's words.

Framed through aspiration, not suffering. "Seeking" aligns with the search bar's "What are you seeking?" and reframes each human situation as a positive movement toward something, not away from something.

**Entry points (curated, not generated):**

| Entry Point | Maps to Search Query |
|-------------|---------------------|
| "Peace in a restless mind" | `"peace calm mind anxiety restlessness stillness"` |
| "Comfort after loss" | `"death soul eternal life comfort grief immortality"` |
| "Purpose and direction" | `"purpose meaning life divine plan destiny"` |
| "Courage through fear" | `"courage fear fearlessness soul protection bravery"` |
| "The heart to forgive" | `"forgiveness love peace resentment compassion"` |

**Design:**
- Presented as quiet, human-readable text links — not buttons, not cards
- Clicking executes a pre-built search query (same as search results page)
- Style: `--portal-text-muted`, Merriweather Light, gentle `--srf-gold` underline on hover
- The section heading "Seeking..." is in Merriweather Light, not bold — it's an invitation, not a label
- Editorially curated: the portal team can add, remove, or refine entry points based on anonymized search trends (from `search_queries` table)
- **Cultural adaptation (Milestone 5b):** The "Seeking..." entry points are deeply English-idiomatic ("The heart to forgive," "Peace in a restless mind"). These need cultural adaptation, not mechanical translation. Treat them as **editorial content per locale** — each language's reviewer may rephrase, reorder, or replace entry points to match cultural expression. Include these in the ADR-078 human review scope alongside UI strings.
- Mobile: full-width, stacked list
- This section is below the fold — a deliberate choice. The above-the-fold experience (Today's Wisdom + search bar) is for all visitors; this section is for the ones who scroll because they need more

**Grief elevated to primary theme :** "Comfort after loss" is the entry point; grief/loss also becomes a dedicated theme page (`/themes/grief`) in Milestone 3b with deep, curated content on the immortality of the soul, reunion after death, the purpose of suffering, and direct consolation. Grief is arguably the most common reason someone turns to spiritual literature — the portal should be the definitive resource for seekers Googling "what happens after death Yogananda."

**DELTA alignment:** No behavioral profiling. The entry points are the same for every visitor. They are informed by aggregated search trends ("What is humanity seeking?"), not individual tracking.

### The Library (`/books`) and Book Landing Page (`/books/[slug]`)

The library is how seekers browse and discover books. Even with a single book in Milestone 2a, the page should feel like the entrance to a real library — warm, unhurried, and honest about what's inside.

#### The Library (`/books`)

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ The Library │
│ │
│ The published teachings of Paramahansa Yogananda, │
│ freely available for seekers everywhere. │
│ │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ │ │
│ │ [cover] Autobiography of a Yogi │ │
│ │ Paramahansa Yogananda · 1946 │ │
│ │ │ │
│ │ "A remarkable account of a spiritual │ │
│ │ quest that has inspired millions..." │ │
│ │ │ │
│ │ 48 chapters │ │
│ │ │ │
│ │ Begin reading → · Find this book → │ │
│ │ │ │
│ └────────────────────────────────────────────────────────┘ │
│ │
│ ─── 🪷 ─── │
│ │
│ More books are being added to the library. │
│ Explore all of Yogananda's published works at the │
│ SRF Bookstore → │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Design principles:**
- **Warm, not empty.** Even with one book, the page should feel intentional — not like a placeholder or a broken catalog.
- **Honest about scope.** "More books are being added" is truthful and forward-looking. No fixed promises, no dates.
- **The SRF Bookstore link** is a natural signpost: seekers can explore the full catalog of physical books while the digital library grows.
- **Each book entry is a generous card** — not a cramped grid item. Whitespace, the cover image (if available from SRF), and a brief editorial description give each book the space it deserves.
- **No "empty state" design needed in Milestone 2a** — there will always be at least one book.

**Book card contents:**
- Cover image (if available; graceful fallback to a warm cream card with title in Merriweather)
- Title (Merriweather 700, `--srf-navy`)
- Author · publication year (Open Sans 400, `--portal-text-muted`)
- Brief editorial description (2–3 sentences, Merriweather 300 — not AI-generated, written by the editorial team or drawn from SRF's existing book descriptions)
- Chapter count
- "Begin reading →" link to chapter 1
- "Find this book →" link to SRF Bookstore

**Milestone 3a growth:** As Wave 2a–2d books are ingested, the library page naturally fills out. The layout scales from 1 book to 15+ without redesign. Books are ordered by ingestion priority (ADR-030), which mirrors life-impact ordering.

**Milestone 5b multi-language:** The library shows books available in the user's language, plus an "Also available in English" section for untranslated works (per ADR-075 content availability matrix).

**API:** `GET /api/v1/books` (already defined). Returns all books with metadata, chapter count, and slugs.

#### Book Landing Page (`/books/[slug]`)

The landing page for each individual book — the table of contents.

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ [cover image, centered, generous size] │
│ │
│ Autobiography of a Yogi │
│ Paramahansa Yogananda · First published 1946 │
│ │
│ "This book will change the lives of millions. │
│ It will be my messenger when I am gone." │
│ — Paramahansa Yogananda │
│ │
│ A spiritual classic that has introduced millions to │
│ the teachings of meditation and the science of yoga. │
│ │
│ Begin reading → · Find this book → │
│ │
│ ─── 🪷 ─── │
│ │
│ Chapters │
│ │
│ 1. My Parents and Early Life │
│ 2. My Mother's Death and the Mystic Amulet │
│ 3. The Saint with Two Bodies (Swami Pranabananda) │
│ 4. My Interrupted Flight Toward the Himalaya │
│ ... │
│ 48. At Encinitas in California │
│ │
│ ─── 🪷 ─── │
│ │
│ About this book │
│ [longer editorial description, publication history] │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Chapter list design:**
- Each chapter is a link: chapter number + title
- Style: Merriweather 400, `--portal-text`, with `--srf-gold` number. Subtle hover underline.
- Chapter numbers in `--srf-gold` create a visual rhythm down the page (1, 2, 3...) without heavy styling.
- Clicking any chapter navigates to `/books/[slug]/[chapter]`
- Lotus bookmark indicator: if the reader has bookmarked a chapter (ADR-066), a small filled lotus appears beside it

**Book metadata:**
- Cover image (centered, max 300px wide, with subtle `--portal-quote-bg` background card behind it if the image has a white background)
- Title in Merriweather 700, `--srf-navy`, `--text-2xl`
- Author + publication year in Open Sans 400, `--portal-text-muted`
- An optional featured quote about or from the book (Merriweather 300, italic)
- Editorial description (2–4 sentences)
- "Begin reading →" link to chapter 1
- "Find this book →" link to SRF Bookstore

**API:** `GET /api/v1/books/{slug}` returns book metadata with chapter index. The book landing page can also be SSG'd from the database at build time.

### Book Reader (`/books/[slug]/[chapter]`)

The reader is the portal's primary experience — where seekers spend the most time. It must feel like reading a physical book, not scrolling a web page.

#### Reading Typography

The single most important typographic decision: **line length**. Optimal for extended reading is 65–75 characters per line. The reader enforces `max-width: 38rem` (~608px) on the text column regardless of screen width. Wide screens get wider margins — not wider text.

```
┌──────────────────────────────────────┬──────────────────────┐
│ 96px margin │ │
│ ┌──────────────────────────────┐ │ Related Teachings │
│ │ │ │ │
│ │ Chapter 14: An Experience │ │ ┌────────────────┐ │
│ │ in Cosmic Consciousness │ │ │ "The experience │ │
│ │ │ │ │ of samadhi..." │ │
│ │ "My body became immovably │ │ │ │ │
│ │ rooted; breath was drawn │ │ │ — Man's Eternal│ │
│ │ out of my lungs as if by │ │ │ Quest, p.201 │ │
│ │ some huge magnet. Soul │ │ │ Read this → │ │
│ │ and mind instantly lost │ │ └────────────────┘ │
│ │ their physical bondage..." │ │ │
│ │ │ │ ┌────────────────┐ │
│ │ — p. 184 │ │ │ "When the soul │ │
│ │ │ │ │ ascends to..." │ │
│ │ [next paragraph...] │ │ │ │ │
│ │ │ │ │ — God Talks │ │
│ └──────────────────────────────┘ │ │ Vol.1, p.87 │ │
│ 96px margin │ │ Read this → │ │
│ │ └────────────────┘ │
│ │ │
│ │ ┌────────────────┐ │
│ │ │ ▶ "Meditation │ │
│ │ │ & the Soul" │ │
│ │ │ (4:32) │ │
│ │ └────────────────┘ │
│ │ │
│ │ Explore all → │
└──────────────────────────────────────┴──────────────────────┘
```

**Typography rules for the reader:**

| Property | Value | Rationale |
|----------|-------|-----------|
| Max text width | `38rem` (~65-75 chars) | Optimal reading line length. **CJK note (Milestone 5b):** 38rem holds ~30–35 CJK characters per line — within the traditional optimal range for Japanese (25–40 chars/line). Line height should tighten from 1.8 to 1.6–1.7 for CJK text. Validate with actual translated content before launch. |
| Font | Merriweather 400 | Serif for extended reading |
| Size | `--text-base` (18px) | Comfortable for long reading sessions |
| Line height | `--leading-relaxed` (1.8) | Spacious for contemplation |
| Paragraph spacing | `--space-6` (1.5rem) | Clear paragraph separation |
| Chapter title | Lora 400 at `--text-xl` | Distinct from body, not competing |
| Page numbers | `--portal-text-muted`, inline margin notation | Present but unobtrusive |

#### ADR-050: Related Teachings Side Panel

The right side panel displays passages from *other books* that are semantically related to the paragraph the seeker is currently reading. It updates quietly as the reader settles on each paragraph.

**Reading focus detection — the "settled paragraph" model:**
- Intersection Observer watches all paragraphs within a **focus zone** (upper-middle 45% of the viewport, `rootMargin: "-20% 0px -35% 0px"` — biased toward where readers' eyes naturally rest)
- Each visible paragraph gets a **prominence score**: `intersectionRatio × elementHeight` — favors the paragraph the reader is immersed in, not a one-liner passing through
- A **1.2-second debounce** prevents updates during active scrolling. Only when scrolling stops for 1.2s does the highest-prominence paragraph become the "settled paragraph" *[Parameter — default: 1200ms, evaluate: Milestone 2b user testing]*
- If the settled paragraph changes, the side panel crossfades (300ms) to the new relations
- **Source indication:** the side panel header shows the first ~40 characters of the settled paragraph (*"Related to: 'My body became immovably...'"*) — closing the feedback loop without adding any chrome to the main text column

**Dwell mode as manual override (DES-009):**
- When dwell activates, the settled paragraph algorithm is bypassed — the dwelled paragraph becomes the explicit focus
- Side panel updates **immediately** (no 1.2s debounce)
- When dwell exits, the settled paragraph algorithm resumes

**Behavior:**
- Shows top 3 related passages (from `chunk_relations` table, filtered to exclude current book's adjacent chapters)
- "Explore all" expands to show more related passages with filter controls
- Clicking a related passage navigates to that passage in its reader context — the side panel then updates with *that* passage's relations (enabling graph traversal)
- Cross-book diversity: when possible, show relations from different books, not 3 results from the same book

**Filters (in "Explore all" expanded view):**
- By book (dropdown of all available books)
- By content type: Books / Videos (once transcripts exist, Arc 6)
- By language (when multi-language content available, Milestone 5b)
- By topic (Peace, Courage, Christ, Meditation, Yoga Sutras, etc.)

**Data source and loading strategy :**

Pre-computed `chunk_relations` table. If filtering yields < 3 results from the pre-computed top 30, fall back to a real-time vector similarity query with the filter as a WHERE clause.

Loading varies by connection quality (screen width determines presentation, data budget determines loading — two independent axes):

| | Wide screen (≥ 1024px) | Narrow screen (< 1024px) |
|---|---|---|
| **Good connection** | Side panel visible. Batch prefetch all chapter relations on load (`GET /api/v1/books/[slug]/chapters/[number]/relations`, ~30–50KB). All subsequent updates are local cache lookups — zero network during reading. | Pill visible. Same batch prefetch — tap shows pre-loaded results instantly. |
| **Slow/metered (3G)** | Side panel visible. Loads on-demand when settled paragraph changes (not prefetched). | Pill visible. Tap triggers single API call for current paragraph. |
| **Save-Data / text-only / 2G** | No panel. "Continue the Thread" at chapter end only (part of page render, zero extra cost). | No pill. "Continue the Thread" only. |

Detection uses `navigator.connection` (Network Information API) where available, with viewport width as the independent presentation axis.

**API:**

```
GET /api/v1/chunks/[chunk-id]/related
 Query params:
 limit (optional) — default 3, max 20
 book_id (optional) — filter to a specific book
 language (optional) — filter to a specific language
 theme_id (optional) — filter to a specific teaching topic
 exclude_book_id (optional) — exclude current book (default behavior)

 Response:
 {
 "source_chunk_id": "uuid",
 "related": [
 {
 "chunk_id": "uuid",
 "content": "The verbatim passage text...",
 "book_title": "Man's Eternal Quest",
 "chapter_title": "How to Have Courage",
 "page_number": 201,
 "similarity": 0.89,
 "reader_url": "/books/mans-eternal-quest/12#chunk-uuid"
 },
 ...
 ],
 "total_available": 27,
 "source": "precomputed" // or "realtime" if fallback was used
 }
```

**Narrow screens (< 1024px):** The side panel collapses. A subtle floating pill at the bottom-right of the screen reads "Related Teachings". Tapping it opens a bottom sheet with the related passages (instant if batch-prefetched, single API call if on-demand tier). The reader text is never obscured or compressed to accommodate the panel. The pill does not animate or bounce when the settled paragraph changes — it quietly has the right content when the seeker reaches for it.

**Graph traversal:** When the reader navigates to a related passage via the side panel, the URL changes (browser history entry), the reader scrolls to the new passage in its chapter context, and the side panel updates with that passage's relations. The reader has effectively "traveled one hop" through the semantic graph. The back button returns to the previous passage. This creates an open-ended exploration experience — a reader can follow threads of meaning across the entire library.

#### End of Chapter — Next Chapter as Primary Invitation

The end of a chapter belongs to the **book**. The reader is on a journey through Yogananda's narrative. The primary invitation is always the next chapter — never a cross-book detour.

```
 [final paragraph of the chapter]

 — p. 184

 ────────────────────────────────────

 Chapter 15 →
 An Experience in Cosmic
 Consciousness

 ────────────────────────────────────
```

Clean. Centered. The next chapter is the only call to action in the reading column. No cross-book suggestions competing for attention. The reader continues the *book*.

#### "Continue the Thread" — Side Panel Placement

"Continue the Thread" lives in the Related Teachings side panel (or bottom sheet on narrow screens), not inline in the reading column. As the reader reaches the final paragraphs of a chapter, the side panel naturally shows per-paragraph relations. Below those, a "Continue the Thread" section aggregates the chapter's strongest cross-book connections:

```
┌──────────────────────┐
│ Related Teachings │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│ "My body became..." │
│ │
│ [3 related passages] │
│ │
│ ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ │
│ Continue the Thread │
│ │
│ These themes — │
│ cosmic consciousness,│
│ the eternal soul — │
│ appear across the │
│ library: │
│ │
│ ┌────────────────┐ │
│ │"The soul's │ │
│ │ nature is │ │
│ │ infinite..." │ │
│ │ — The Divine │ │
│ │ Romance p.142│ │
│ └────────────────┘ │
│ + 2 more │
│ │
└──────────────────────┘
```

This separation means:
- The **reading column** belongs to the book. Next chapter is always primary.
- The **side panel** belongs to the library. Cross-book exploration is available but never intrudes on the linear reading experience.
- The reader chooses when to explore. "Continue the Thread" is a gift, not an interruption.

**Exception — no-panel tiers (Save-Data, 2G, text-only mode):** "Continue the Thread" appears inline at chapter end, *below* the Next Chapter invitation. This is the sole cross-book connection for these seekers, and it's part of the page render (zero extra network cost). Next Chapter is still primary, with "Continue the Thread" as a quiet secondary section beneath it.

**Behavior:**
- Aggregates the top related passages from *other books* across all paragraphs in the current chapter
- Deduplicated: if 5 paragraphs in this chapter all relate to the same passage in Man's Eternal Quest, show it once (with highest similarity)
- Shows up to 3 cross-book suggestions
- Pre-computed at build time or heavily cached (ISR)
- The introductory text ("These themes — ...") is generated from the chapter's most prominent theme tags, not by an LLM

**Implementation:** Query `chunk_relations` for all chunks in the current chapter, aggregate by target, deduplicate, rank by max similarity, filter to other books, take top 3. This data is included in the batch prefetch response (`/api/v1/books/[slug]/chapters/[number]/relations`) for batch-tier connections.

#### Physical Book Bridge

Every passage in the reader, search results, and shared passage pages includes a quiet "Find this book" link alongside "Read in context." This links to the SRF Bookstore page for the physical book.

- Supports DELTA's Embodiment principle (the physical book is the ultimate embodied reading experience)
- Not a sales pitch — a signpost, same as the "Go Deeper" links
- Style: small text link in `--portal-text-muted`, positioned near the citation

```
— Autobiography of a Yogi, Chapter 14, p. 184
 Read in context → · Find this book →
```

"Find this book" opens the SRF Bookstore URL in a new tab. The URL is stored per book in the `books` table (`bookstore_url TEXT`).

#### Print Stylesheet

A `@media print` stylesheet ensures passages and chapters print beautifully:

- Remove navigation, footer, side panel
- Full-width text at optimal reading width
- Merriweather at 11pt
- Citation below each passage
- Portal URL in small footer: `teachings.yogananda.org`
- Page breaks between chapters (for full chapter printing)
- No background colors (saves ink, respects user paper)
- **Non-Latin font support (Milestone 5b):** Print stylesheet must be locale-aware. Font-family falls back per script: Noto Serif JP for Japanese, Noto Serif Thai for Thai, Noto Serif Devanagari for Hindi, Noto Serif Bengali for Bengali. CJK text at 10.5pt (equivalent optical size to 11pt Latin). Define per-locale `@media print` font stacks alongside the web font stacks.

#### ADR-059: Chant Reader Variant

When `books.content_format` is `'chant'` or `'poetry'`, the reader route (`/books/[slug]/[chapter]`) renders a variant optimized for devotional poetry rather than continuous prose.

**Structural differences from the prose reader:**

| Aspect | Prose Reader | Chant Reader |
|--------|-------------|-------------|
| Unit of display | Paragraph stream (continuous scroll) | Whole chant (one per page) |
| Navigation | Scroll + prev/next chapter | Prev/next chant (discrete pages) |
| Related Teachings | Side panel (3 related passages) | Side panel (same) + **inline media panel** for `performance_of` relations |
| Drop capitals | Yes (chapter opening) | No (chant text rendered as poetry with preserved line breaks) |
| Chunk context | `prev_chunk_id`/`next_chunk_id` for "read more" | Each chunk is self-contained; prev/next for chant-to-chant nav only |

**Inline media panel:**

When a chant has `performance_of` relations in `chunk_relations`, audio/video recordings appear in the primary content area below the chant text — not in the side panel. This is the chant's companion experience, not a tangential discovery.

```
┌──────────────────────────────────────┬──────────────────────┐
│ 96px margin │ │
│ ┌──────────────────────────────┐ │ Related Teachings │
│ │ │ │ │
│ │ Door of My Heart │ │ ┌────────────────┐ │
│ │ │ │ │ "God is the │ │
│ │ "Door of my heart, open │ │ │ fountain of │ │
│ │ wide I keep for Thee. │ │ │ all melody..." │ │
│ │ Wilt Thou come, │ │ │ │ │
│ │ wilt Thou come? │ │ │ — God Talks │ │
│ │ Just for once come │ │ │ Vol.2, p.41 │ │
│ │ to me..." │ │ └────────────────┘ │
│ │ │ │ │
│ │ — Cosmic Chants, p. 14 │ │ Explore all → │
│ │ │ │ │
│ │ ┌────────────────────────┐ │ │ │
│ │ │ 🔊 Paramahansa Yogananda│ │ │ │
│ │ │ ◉ Sacred recording │ │ │ │
│ │ │ ▶ ━━━━━━━━━━━ 3:42 │ │ │ │
│ │ ├────────────────────────┤ │ │ │
│ │ │ 🔊 SRF Monastics │ │ │ │
│ │ │ ▶ ━━━━━━━━━━━ 4:15 │ │ │ │
│ │ ├────────────────────────┤ │ │ │
│ │ │ ▶ How-to-Live Chant │ │ │ │
│ │ │ Session (YouTube) │ │ │ │
│ │ └────────────────────────┘ │ │ │
│ │ │ │ │
│ │ ← Previous chant Next → │ │ │
│ └──────────────────────────────┘ │ │
└──────────────────────────────────────┴──────────────────────┘
```

**Performance provenance ordering:** Yogananda's own voice first (sacred artifact golden ring per ADR-057), monastic recordings second, other recordings third. Within each tier, ordered by editorial `rank` in `chunk_relations`.

**Chant metadata display:** When `book_chunks.metadata` contains chant-specific fields (`chant_instructions`, `chant_mood`, `has_refrain`), these render as distinct UI elements:
- **Instructions** appear above the chant text in a quieter typographic treatment (Open Sans, `--text-sm`, `--portal-text-muted`) — visually distinct from the sacred words themselves
- **Mood** contributes to search filtering and daily passage tone matching, but does not display as a label in the reader

**Poetry format (`content_format = 'poetry'`):** Uses the same whole-unit rendering and discrete navigation as `'chant'`, but without the inline media panel (unless `performance_of` relations exist). Suitable for *Songs of the Soul*, *Whispers from Eternity*, and similar collections.

*Section added: 2026-02-21, ADR-059*

### DES-008: Reader Typography Refinements

The reader's typographic details signal care and reverence for the words. These are the micro-details that distinguish a sacred text presentation from a blog post:

**Drop capitals:** Each chapter opens with a drop capital — Merriweather 700, `--srf-navy`, spanning 3 lines. Uses CSS `::first-letter`. A tradition from illuminated manuscripts signaling "something begins here." **Language-conditional (Milestone 5b):** Drop capitals are enabled for Latin-script languages only. CSS `::first-letter` behaves unpredictably with CJK and Indic scripts, and the illuminated-manuscript tradition is Western. For Japanese, Hindi, and Bengali, substitute a culturally appropriate chapter-opening treatment: generous whitespace with a subtle `--srf-gold` rule above the first paragraph.

**Decorative opening quotation marks:** Every displayed Yogananda passage (search results, quote cards, shared passages) uses a large decorative opening quote mark — Merriweather 700, 48px, `--srf-gold` at 40% opacity, positioned as a hanging element above-left. This visual language instantly says: *these are his words*.

**Optical margin alignment:** CSS `hanging-punctuation: first last` where supported (progressive enhancement). Quotation marks and hyphens hang slightly into the margin, making the text block appear perfectly aligned.

**Page texture:** A CSS-only paper texture on the reader background — an inline SVG noise pattern blended with `--portal-bg` via `background-blend-mode: multiply`. Zero network cost. The faintest sense of materiality:

```css
.reader-surface {
 background-color: var(--portal-bg);
 background-image: url("data:image/svg+xml,..."); /* tiny inline SVG noise */
 background-blend-mode: multiply;
}
```

**Chapter epigraph treatment:** Epigraphs (Bhagavad Gita verses, Biblical passages, Yogananda's poetry at chapter openings) are: centered, Merriweather 300 at `--text-sm`, `--portal-text-muted`, with generous whitespace above and below. Source attribution in small caps. A moment of stillness before the prose begins.

**Typographic details:** Applied during ingestion, not render time:
- True em dashes (—) with hair spaces
- Typographic curly quotes (" " ' ')
- Ellipses as single glyphs (…)
- Small caps for abbreviations

**Citation formatting:** Every passage citation uses an em dash:
```
— Autobiography of a Yogi, Chapter 12, p. 147
```
Open Sans 400, `--portal-text-muted`. Small, precise, always present. Never omitted.

### DES-009: "Dwell" Interaction — Passage Contemplation Mode

When reading a physical book, a profound passage stops you mid-page. The reader needs a way to dwell *within* the reading experience — not leave it.

**Trigger:** Long-press (mobile, 500ms). Desktop: click the hover-revealed dwell icon. Keyboard: `d` key on focused paragraph. Double-click was considered and rejected — it conflicts with the universal word-selection behavior in every browser.

**Discoverability :** On desktop, hovering over a paragraph for 1.5 seconds reveals a small dwell activation icon at the paragraph's inline-start margin — a 12px circle in `--srf-gold` at 40% opacity. Clicking the icon enters dwell mode. Moving the cursor away fades the icon out. On first visit, a one-time tooltip appears: *"Hover over any passage to focus on it for contemplation."*

**Related Teachings connection :** When dwell activates, the Related Teachings side panel immediately updates to show relations for the dwelled paragraph — bypassing the normal settled-paragraph debounce. Dwell serves a dual purpose: contemplative focus *and* explicit Related Teachings selection.

**Effect:**
1. Surrounding text dims to 15% opacity over 600ms
2. The selected passage remains fully vivid
3. Background warms slightly to `--portal-quote-bg`
4. Share icon and citation appear quietly below the passage
5. Lotus bookmark icon (ADR-066) appears alongside the share icon

**Exit:** Tap/click anywhere else, or press `Escape`. Everything returns to normal over 300ms.

**No modal, no popup, no overlay.** The passage simply *comes forward* in its existing position. This mirrors what happens naturally in physical reading: your eyes narrow focus, the world around the words softens.

```
┌──────────────────────────────────────┐
│ │
│ [dimmed text at 15% opacity] │
│ [dimmed text at 15% opacity] │
│ │
│ "Soul and mind instantly lost their │ ← Full opacity, warm bg
│ physical bondage and streamed out │
│ like a fluid piercing light from │
│ my every pore..." │
│ │
│ — p. 184 🪷 📎 │ ← Bookmark + Share
│ │
│ [dimmed text at 15% opacity] │
│ [dimmed text at 15% opacity] │
│ │
└──────────────────────────────────────┘
```

**Haptic feedback :** On mobile, a single gentle haptic pulse confirms dwell activation: `navigator.vibrate(10)` — a 10ms tap, barely perceptible, confirming through the sense already engaged. Suppressed when `prefers-reduced-motion: reduce` is active. Progressive enhancement: devices without Vibration API support get visual feedback only.

**Accessibility:**
- `Escape` exits dwell mode
- Screen readers announce "Passage focused for contemplation" / "Returned to reading" (ADR-073)
- `prefers-reduced-motion`: transitions are instant (0ms), dimming still occurs, haptic feedback suppressed

### DES-010: Layered Passage Depth — "Go Deeper Within the Text"

A passage about concentration means something different on the first reading versus the twentieth. The Related Teachings side panel (ADR-050) shows passages from *other books*. Layered Passage Depth shows depth *within* the same passage's context — what surrounds it, what echoes it across the library.

**Trigger:** On any passage in the reader (including search results and theme pages), a quiet "Go deeper" text link (Merriweather 300, `--portal-text-muted`, `--srf-gold` underline on hover) appears below the citation. Distinct from the site-wide "Go Deeper" SRF ecosystem links — this is textual depth, not organizational.

**Three layers — all verbatim Yogananda, editorially curated:**

| Layer | Label | What it shows | Source |
|-------|-------|---------------|--------|
| **The teaching** | *(default — always visible)* | The passage itself | Current chunk |
| **The context** | "In context" | Adjacent passages from the same chapter — what Yogananda said before and after. The argument, the narrative, the build-up. | Neighboring chunks by `paragraph_index` in same chapter |
| **The web** | "Across the library" | Related passages from *other books* where Yogananda expressed the same idea differently — to different audiences, at different points in his life. | `chunk_relations` table (ADR-050) + `composition_era` metadata |

**Behavior:**
- Clicking "Go deeper" expands a section below the passage (not a modal, not a new page)
- Context layer shows ±2 paragraphs around the current passage, with the current passage highlighted
- Web layer shows up to 5 cross-book relations, sorted by similarity, each with full citation
- When `composition_era` metadata is available, the web layer includes the era: *"Written in the 1940s"* — showing how the teaching evolved
- Layers can be toggled independently (both open, one open, neither)
- `Escape` collapses all layers
- On narrow screens: layers expand inline below the passage (no side panel interaction)

**Who this serves:** The seeker who has already encountered a passage and wants to understand it more deeply — without leaving the reading flow. This is what a scholar does manually over years. The portal's relationship graph already contains this data; the experience makes it browsable from within the reading.

**API:** No new endpoints. Uses existing `/api/v1/chunks/[chunk-id]/related` and chunk neighbor queries. The "context" layer is fetched from the chapter data already loaded in the reader.

**Milestone:** 3c (alongside editorial reading threads, DES-026). Requires Related Teachings (ADR-050, Milestone 2b) and chapter data already in the reader.

---

### DES-011: Time-Aware Reading — Circadian Color Temperature

The portal subtly shifts its warmth based on the time of day. **On by default, opt-out via a toggle.**

| Band | Hours | Background | Character |
|------|-------|------------|-----------|
| Morning | 5:00–9:59 | `#FDFBF8` (cooler cream) | Crisp, like morning light |
| Midday | 10:00–15:59 | `#FAF8F5` (standard) | The baseline palette |
| Evening | 16:00–20:59 | `#F7F2EC` (warmer cream) | Golden hour warmth |
| Night | 21:00–4:59 | `--srf-navy` bg, cream text | Restful, low-light |

**Implementation:** A small client-side script (~20 lines) runs once on page load, sets `data-time-band` attribute on `<html>`. CSS custom properties apply the appropriate palette. No polling, no intervals. Computed entirely from `new Date.getHours` — no data sent to server, no tracking. DELTA-compliant by design.

**Toggle:** Sun/moon icon in reader header and site settings. Cycles: Auto (default) → Light (always midday) → Dark (always night). Stored in `localStorage`.

**Interaction with OS preferences:** If `prefers-color-scheme: dark` is active, it overrides time-banding — the user's OS preference is always respected.

**Meditation Mode (Quiet Corner + deep reading):** The Night band's `--srf-navy` palette extends into a dedicated meditation visual theme for `/quiet` and an optional reader mode. Deeper than the standard Night band:

| Property | Night Band | Meditation Mode |
|----------|-----------|-----------------|
| Background | `--srf-navy` | `--portal-bg-deep` (#0a1633) — darker, stiller |
| Contrast | Standard cream text | Reduced contrast for gentle viewing — `#d4cfc7` text |
| Accents | Standard `--srf-gold` | Golden text highlights on key phrases (editorial, `--srf-gold` at 60%) |
| Interactive elements | Standard | Subtle star-point highlights — `--srf-white` at 8% on focus/hover |

Meditation Mode activates automatically on `/quiet`. In the book reader, it is available as a fourth toggle state: Auto → Light → Dark → **Meditate**. Stored in `localStorage`. The deeper palette creates a visual environment that supports contemplation — like reading by candlelight rather than under fluorescent light.

*Adopted from Visual Design Language Enhancement proposal (2026-02-23). The deep blue field echoes Yogananda's description of the spiritual eye's infinite blue — the color of deep meditation.*

### DES-012: "Breath Between Chapters" — Chapter Transition Pacing

When navigating between chapters via prev/next (not deep links):

1. A **1.2-second pause** — only the chapter title (Lora 400, `--text-xl`) centered on warm cream. No other elements visible.
2. Chapter text **fades in** over 400ms.
3. **`prefers-reduced-motion`:** Skipped entirely. Instant load.
4. **Deep links and search results:** Skip the breath — immediate content access.

No loading spinner is ever shown. This is silence, not waiting.

#### ADR-066: Lotus Bookmark — Account-Free Reading Bookmarks

A lightweight, private bookmarking system using `localStorage`:

**Chapter bookmark:** Small lotus icon (SVG, `--srf-gold` at 50% opacity, 20px) in the reader header beside the chapter title. Click to fill (bookmark), click again to remove. The lotus was chosen because it carries meaning: *a lotus marks where light was found*.

**Passage bookmark:** In dwell mode, a lotus icon appears alongside the share icon. Bookmarks the specific paragraph.

**Bookmarks page (`/bookmarks`):** Lists all bookmarked chapters and passages organized by book. Each entry shows book title, chapter title, and (for passages) the first line with citation. Clicking navigates to that position.

**Storage:** `localStorage` under `srf-portal:bookmarks`. No server, no accounts, no tracking. Clearing browser data removes bookmarks. This is stated clearly on the bookmarks page.

**Milestone 7a migration:** When optional accounts arrive, `localStorage` bookmarks are offered for import and server sync.

### DES-013: Keyboard-First Reading Navigation

All shortcuts are single-key (no modifier), active only when no input/textarea is focused:

| Key | Action |
|-----|--------|
| `→` or `Space` | Next chapter (with breath transition) |
| `←` | Previous chapter |
| `j` | Scroll to next paragraph (focus ring visible) |
| `k` | Scroll to previous paragraph |
| `d` | Enter dwell mode on focused paragraph |
| `Escape` | Exit dwell mode, close any open panel |
| `b` | Toggle lotus bookmark on current chapter/passage |
| `r` | Toggle related teachings panel |
| `t` | Jump to table of contents |
| `/` | Focus search bar |
| `?` | Show keyboard shortcut help overlay |

**Discoverability:** A `?` icon in the reader footer opens a shortcut reference. Also shown once on first visit (stored in `localStorage`).

**`Space` for next chapter** only activates when the reader has scrolled to the bottom of the current chapter — otherwise, native scroll behavior is preserved.

#### Reader Accessibility

- `aria-current="page"` on the active paragraph (for "Read in context" deep links)
- Keyboard navigation: full vim-style shortcuts (see above, DES-013)
- Skip link: "Skip to chapter text" at page top
- Each paragraph is an `<article>` with `role="article"` and `aria-label` including page number
- Font size adjustable via `Ctrl`+`+`/`-` (browser native) — no custom control until the Calm Technology design system ships (distributed across arcs)
- `prefers-reduced-motion`: side panel updates without animation, dwell transitions instant, breath between chapters skipped, opening moment skipped
- Dwell mode: screen reader announcements on enter/exit
- All keyboard shortcuts suppressed when input elements have focus

#### Responsive Aura — Visual Warmth from Reading State

The reader responds to the seeker's engagement with subtle visual warmth. All state is `localStorage`-only — structurally identical to lotus bookmarks (ADR-066). No server transmission, no tracking, no profiling.

| Interaction | Visual Response | Opacity | Storage |
|-------------|----------------|---------|---------|
| Passage hover | Subtle `--srf-gold` left border fades in | 15% → 40% | None (CSS `:hover`) |
| Lotus-bookmarked passage | Persistent soft golden glow on left border | 30% | `localStorage` (`srf-portal:bookmarks`) |
| Recently read chapter (in book TOC) | Faint warm tint on chapter row | 8% `--srf-gold` bg | `localStorage` (`srf-portal:reading-state`) |

**Design intent:** The portal subtly acknowledges where the seeker has been — like a well-loved book that falls open to familiar pages. The visual signals are whisper-quiet: a seeker who doesn't notice them loses nothing; a seeker who does feels recognized.

**Constraints:**
- All effects at ≤ 40% opacity. Felt, not seen.
- `prefers-reduced-motion`: hover transitions instant, static states preserved.
- Reading state stored under `srf-portal:reading-state` — chapter IDs only, no timestamps, no duration, no scroll position. Clearing browser data removes all state.
- Milestone 7a migration: when optional accounts arrive, reading state is offered for import alongside bookmarks.

*Adopted from Visual Design Language Enhancement proposal (2026-02-23). Inspired by spiritual eye symbolism — the golden ring of awareness that deepens with attention.*

### The Quiet Corner (`/quiet`)

A single-purpose page designed for the moment of crisis. When someone arrives at 2 AM unable to sleep because of anxiety, they don't need a search engine — they need a hand to hold.

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ │
│ │
│ │
│ │
│ "I am submerged in eternal light. │
│ It permeates every particle of my being. │
│ I am living in that light." │
│ │
│ — Scientific Healing Affirmations │
│ │
│ │
│ │
│ ○ 1 min ○ 5 min ○ 15 min │
│ │
│ [ Begin ] │
│ │
│ │
│ │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Design:**
- Maximum whitespace. The page is mostly empty — "digital silence."
- A single affirmation from Yogananda, in Merriweather Light, centered vertically and horizontally
- Source citation below in muted text
- Optional gentle timer: 1, 5, or 15 minutes. When started, the affirmation remains on screen, the page dims slightly, and a soft chime sounds at the end. No progress bar, no countdown — just stillness, then a chime.
- "Begin" button in the understated gold-border style. After starting, the button and timer options fade away, leaving only the affirmation.
- A new affirmation loads on each visit
- Background color: slightly warmer than the rest of the portal (`--portal-bg-alt`)

**Source material:**
- *Scientific Healing Affirmations* — healing, peace, vitality, abundance affirmations
- *Metaphysical Meditations* — spiritual affirmations and meditations
- Curated affirmation-length passages from other books (editorial)

**Timer completion (DES-014):** After the chime, 3 seconds of continued stillness. Then the affirmation gently crossfades (300ms) to a parting passage — one specifically about returning to the world from meditation. This transforms the timer's end from "session over" to "now begin." Parting passages are editorially curated (see § Session Closure Moments).

**Constraints:**
- No tracking. No history. No "sessions completed." No streaks.
- No ambient sound loops or background music (the user brings their own silence)
- No account required
- The timer is purely client-side (a simple `setTimeout` + Web Audio API chime)
- Accessible: the chime has a visual equivalent (gentle screen flash) for hearing-impaired users and a haptic equivalent — a slow resonance pattern `navigator.vibrate([10, 50, 8, 70, 5, 100, 3])` mimicking a singing bowl's decay, reaching seekers whose eyes are closed and phone is on silent. Suppressed when `prefers-reduced-motion` is active.

### About Section (`/about`)

The About page serves first-time visitors who don't know Yogananda or SRF. It is the front door for the uninitiated and the natural bridge from the portal to SRF's broader mission.

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ About This Portal │
│ │
│ This portal makes the published teachings of │
│ Paramahansa Yogananda freely available to seekers │
│ worldwide. It was made possible by a philanthropic │
│ endowment dedicated to expanding access to these │
│ sacred writings. │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ Paramahansa Yogananda (1893–1952) │
│ │
│ ┌───────────┐ Paramahansa Yogananda is the author of │
│ │ │ Autobiography of a Yogi and founder of │
│ │ [photo] │ Self-Realization Fellowship. He brought │
│ │ │ India's ancient science of meditation │
│ └───────────┘ to the West in 1920... │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ The Line of Gurus │
│ │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │Babaji│ │Lahiri│ │ Sri │ │Yoga- │ │
│ │ │ │Maha- │ │Yuktes│ │nanda │ │
│ │ │ │ saya │ │ war │ │ │ │
│ └──────┘ └──────┘ └──────┘ └──────┘ │
│ Mahavatar Lahiri Swami Paramahansa │
│ Babaji Mahasaya Sri Yogananda │
│ Yukteswar │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ Self-Realization Fellowship │
│ Founded 1920 · Los Angeles, California │
│ [Brief description of SRF's mission and aims and ideals] │
│ │
│ ───────────────────────────────────────────────────────── │
│ │
│ Go Deeper │
│ │
│ Yogananda's published books are an invitation to │
│ practice. If these teachings resonate with you, the │
│ natural next step is to experience them directly │
│ through meditation. │
│ │
│ → Begin today: A Beginner's Meditation │
│ Free instruction from SRF — you can practice │
│ right now. (yogananda.org/a-beginners-meditation) │
│ │
│ → The SRF Lessons │
│ A 9-month home-study course in meditation and │
│ spiritual living, including three foundational │
│ techniques. The path to Kriya Yoga initiation. │
│ (yogananda.org/lessons) │
│ │
│ → Find a meditation group near you │
│ → Guided meditations with SRF monastics │
│ → Online meditation events │
│ → Kirtan & devotional chanting │
│ → Visit an SRF temple or retreat │
│ → SRF Bookstore │
│ → Self-Realization Magazine │
│ │
│ 💬 "Read a little. Meditate more. │
│ Think of God all the time." │
│ — Paramahansa Yogananda │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Content sections:**

| Section | Content | Image |
|---------|---------|-------|
| **Introduction** | What this portal is, the philanthropic origin, what "free access" means | None |
| **Paramahansa Yogananda** | Brief biography (3–4 paragraphs). Born in India, came to America in 1920, wrote Autobiography of a Yogi, established SRF. | Official portrait — positioned like a book frontispiece |
| **The Line of Gurus** | The four gurus in sequence: Babaji, Lahiri Mahasaya, Sri Yukteswar, Yogananda. One sentence each. | Official portrait for each guru, displayed in chronological sequence |
| **Self-Realization Fellowship** | SRF's mission, aims and ideals, global presence. Non-promotional — informational. | None (or a single photo of Mount Washington headquarters) |
| **Go Deeper** | Enriched Practice Bridge section (ADR-104). 2–3 paragraphs of SRF-approved text: the portal's books are an invitation to practice; SRF's free Beginner's Meditation as an immediate starting point; the SRF Lessons as the formal path (9-month home-study course, three foundational techniques, path to Kriya Yoga initiation); a representative verbatim Yogananda passage about the primacy of practice (with citation). Then the signpost links: center locator, guided meditations with SRF monastics, Online Meditation Center, kirtan and devotional chanting, bookstore, temples and retreats, Self-Realization Magazine (where practitioners share their experiences with meditation and the teachings). Guided meditations and kirtan complement the Quiet Corner's silence — seekers who want instruction or devotional experience are pointed to SRF's existing resources. All framing text reviewed and approved by SRF. The free path is foregrounded: Beginner's Meditation appears before Lessons. | None |

The "Go Deeper" section is the most important part of this page. It is the natural bridge from reading to practice — the moment when the portal fulfills DELTA's Embodiment principle by pointing the seeker back to their physical, spiritual life. The enriched version (ADR-104) replaces the previous single-link signpost with substantive guidance: what the path of practice looks like, where to begin for free, and where formal instruction leads. This makes the signpost commensurate with what it points toward — without becoming a funnel. The tone matches SRF's own invitational voice on yogananda.org: warm, unhurried, never urgent.

### Navigation Structure

**Header (persistent, all pages):**

```
┌──────────────────────────────────────────────────────────────┐
│ ☸ SRF Teaching Portal Search Books Videos Magazine Quiet About│
└──────────────────────────────────────────────────────────────┘
```

- ☸ = SRF lotus mark (small, links to homepage)
- Primary nav: Search, Books, Videos, Magazine, Quiet Corner, About
- Mobile: collapses to hamburger menu
- No notification badges. No user avatar. No bell icon. The nav is purely navigational.

**Footer (persistent, all pages):**

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ SRF Resources │
│ · yogananda.org · SRF Lessons │
│ · Online Meditation Center · SRF Bookstore │
│ · Find a Center Near You · Request Free Literature │
│ · SRF/YSS App — study, meditation │
│ & inspiration · @YoganandaSRF (YouTube) │
│ │
│ ─────────────────────────────────────────────────────────── │
│ │
│ The teachings of Paramahansa Yogananda, │
│ made freely available to seekers worldwide. │
│ │
│ © Self-Realization Fellowship │
│ │
└──────────────────────────────────────────────────────────────┘
```

All external links open in new tabs and are clearly marked as external. The footer is the signpost — it appears on every page, gently reminding the seeker that this portal is one part of a larger spiritual ecosystem.

### Passage Sharing

Every passage throughout the portal — search results, reader, theme pages, Quiet Corner, Today's Wisdom — includes a quiet share affordance.

**Share link:**
- URL format: `/passage/[chunk-id]`
- Canonical domain (aspirational): `teachings.yogananda.org`
- The page renders the single passage with full citation, "Read in context" link, and the portal's warm cream design
- Open Graph meta tags generate a beautiful preview card when pasted into any platform:

```html
<!-- Open Graph tags -->
<meta property="og:title" content="Paramahansa Yogananda" />
<meta property="og:description" content="The soul is ever free; it is deathless, birthless..." />
<meta property="og:image" content="/api/v1/og/[chunk-id]" /> <!-- generated image, min 1200×630px -->
<meta property="og:url" content="https://teachings.yogananda.org/passage/[chunk-id]" />
<meta property="og:site_name" content="SRF Teaching Portal" />

<!-- Twitter/X Card tags (also used by Bluesky, Mastodon) -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Paramahansa Yogananda" />
<meta name="twitter:description" content="The soul is ever free; it is deathless, birthless..." />
<meta name="twitter:image" content="https://teachings.yogananda.org/api/v1/og/[chunk-id]" />
<meta name="twitter:image:alt" content="A passage from Autobiography of a Yogi by Paramahansa Yogananda" />

<!-- Canonical URL (ADR-081 §9) -->
<link rel="canonical" href="https://teachings.yogananda.org/passage/[chunk-id]" />

<!-- Machine content optimization (ADR-081 §12) -->
<meta name="robots" content="max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
```

**Quote image generation:**
- API route: `GET /api/v1/og/[chunk-id]`
- Uses `@vercel/og` (Satori) to render a PNG: passage text in Merriweather on warm cream, citation below, subtle SRF lotus mark, portal URL at bottom
- Same image used for OG cards and "Save as image" download
- Suitable for messaging apps, social media, printing, phone wallpaper
- **Non-Latin script support (Milestone 5b):** Satori requires explicit font files for non-Latin characters — it does not fall back to system fonts. A Japanese or Hindi quote image will render as empty boxes unless the build bundles Noto font subsets for each active script. The OG image route must select the correct font based on the passage's `language` column. Font map: `ja` → Noto Serif JP, `hi` → Noto Serif Devanagari, `bn` → Noto Serif Bengali. All Latin-script languages use Merriweather.

**Email sharing :**
- "Email this passage" opens the seeker's email client via `mailto:` link
- Subject: `"{First 8 words}..." — Paramahansa Yogananda`
- Body: passage text, citation, `Read in context: https://teachings.yogananda.org/passage/{chunk-id}`
- No server-side email infrastructure needed — the seeker's own email client handles sending
- Chapter/book email: sends a link to the chapter, not the full text

**PDF generation :**
- Passage PDF: single A4 page — Merriweather 14pt, warm cream background, citation, lotus watermark (8% opacity, bottom-right), portal URL
- Chapter PDF (Arc 4): cover page, running headers, page numbers, drop capitals, lotus watermark on first page
- Book PDF (Arc 4): title page, table of contents, all chapters, colophon
- API: `GET /api/v1/books/{slug}/pdf` (full book), `GET /api/v1/books/{slug}/chapters/{n}/pdf` (chapter), `POST /api/v1/exports/pdf` with `{ "type": "passages", "ids": ["{chunk-id}"] }` (single passage). See ADR-025 — PDFs are sub-paths of their parent resource, not a parallel `/pdf/` namespace.

**Share menu:**

```
 ┌─────────────────────────┐
 │ Copy link │
 │ Email this passage │
 │ Save as image │
 │ Save as PDF │
 └─────────────────────────┘
```

**Share UI element:**
- A small, quiet share icon (link/chain icon, not social media logos)
- On click: opens share menu (above)
- No row of social media buttons. No third-party tracking scripts. The seeker chooses the medium.

### ADR-074: UI Copy Standards — Micro-Copy as Ministry

Every word the portal speaks — beyond Yogananda's own — is part of the seeker's experience. UI copy (error messages, empty states, loading text, ARIA labels, placeholders) is treated as reviewed content, not developer placeholder text.

**The portal's verbal character: a warm, quiet librarian.** Consistent with ADR-089 but extended beyond the AI search persona to all UI text.

| Principle | Example: Standard | Example: Portal |
|-----------|------------------|-----------------|
| Warm, not clinical | "No results found" | "We didn't find a matching passage. Yogananda wrote on many topics — try different words, or explore a theme." |
| Honest, not apologetic | "Oops! Something went wrong." | "This page doesn't exist, but perhaps what you're seeking is here." + search bar |
| Inviting, not instructional | "Tap and hold to bookmark." | "As you read, long-press any words that speak to you." |
| Brief, not verbose | One sentence where one sentence suffices | No filler, no exclamation marks, no emoji |
| Never cute, never corporate | "Oops," "Uh oh," "Great news!" | Adult, respectful, spiritually aware register |

**High-impact moments:**

| Moment | Portal copy |
|--------|-------------|
| No search results | "We didn't find a matching passage. Yogananda wrote on many topics — try different words, or explore a theme." |
| Network error | A cached Yogananda passage about patience, with a quiet "Try again" link below |
| 404 page | A Yogananda passage about seeking, with navigation home and a search bar |
| Empty bookmarks | "You haven't marked any passages yet. As you read, long-press any words that speak to you." |
| Loading state | Quiet skeleton screen. No text. If prolonged: the lotus threshold (DES-007) as fallback |
| Timer complete (Quiet Corner) | No text. Just the chime. Then, after a moment, a parting passage (DES-014) |

**Preferred vocabulary:** "seeker" not "user." "Passage" not "result." "The teachings" not "our content." "Explore" not "browse." "Mark" not "bookmark" (as a verb).

**ARIA labels carry warmth (ADR-073).** Screen reader announcements are not markup — they are the only voice the portal has for blind seekers. "You are now in the Quiet Corner, a space for stillness" not "Main content region, The Quiet Corner." "Five passages found about courage" not "Search results: 5 items." See § Screen Reader Emotional Quality under Accessibility for full specification.

**Maintained in:** `/docs/editorial/ui-copy-guide.md` — voice principles, vocabulary glossary, and annotated examples per page. Created during Milestone 2a alongside locale file externalization.

### DES-014: Session Closure Moments — Departure Grace

The portal has an opening gesture (DES-007, Portal Threshold). It also has closing gestures — not `beforeunload` interceptions, but content that naturally occupies the space at the end of a reading session. The portal's last word, in every path, is Yogananda's.

**"Parting word" content block at natural session endpoints.** A brief Yogananda passage about carrying the teachings into daily life. Styled in `--portal-text-muted`, Merriweather 300, centered, with generous whitespace above. Not a card, not a callout — just words.

| Location | Content character |
|----------|-------------------|
| End of chapter (below "Next Chapter →" link) | Practice — "Take these words into your day" |
| Quiet Corner timer completion (after chime + 3s stillness) | Returning — "Carry this stillness with you" |
| Bottom of search results (below last result) | Encouragement — "The teachings are always here" |
| Bottom of theme page (below last passage) | Exploration — "There is always more to discover" |

**Parting passage pool:** Editorially curated, 10–20 short passages (one or two sentences). Stored in `daily_passages` with `usage = 'parting'`, rotated randomly. Examples from Yogananda's works: "Make your life a divine garden." / "Be a fountain of peace to all." / "Live each moment completely, and the future will take care of itself."

**The Quiet Corner departure is special.** After the chime and 3 seconds of stillness, the affirmation crossfades (300ms) to a parting passage about returning to the world. This transforms the timer's end from "session over" to "now begin."

**Practice note after parting passage (ADR-104):** Below the Quiet Corner's parting passage — after a generous whitespace gap — a two-line practice signpost:
- Line 1: `If you'd like to deepen your meditation practice → yogananda.org/meditate`
- Line 2: `Experience a guided meditation with SRF monastics → yogananda.org/meditate`

The second line serves seekers who tried silence and want instruction — SRF's guided meditations are complementary to the Quiet Corner's unguided stillness. Styled in `--portal-text-muted`, `--text-sm`, Merriweather 300 — quieter than the parting passage itself. This is the moment of maximum receptivity: the seeker has just experienced stillness and may be most open to understanding that deeper practice exists. Two lines maximum — never a card, never promotional. Both links open in new tabs. Content is in `messages/{locale}.json` for Milestone 5b+ localization.

**Design constraint:** The parting word appears *below* primary navigation (e.g., below "Next Chapter →"). Seekers continuing to the next chapter never scroll down to it. It exists only for the seeker who has finished for now.

### ADR-067: Non-Search Seeker Journeys

The portal is equally excellent for seekers who never touch the search bar. Seven non-search paths, each with specific design standards:

**1. The shared-link recipient** (`/passage/[chunk-id]`) — the portal's ambassador page, mediated by trust (a friend sent this).
- Above the passage: "A passage from the teachings of Paramahansa Yogananda" — context for unfamiliar seekers
- Below the citation: "This passage appears in *[Book Title]*, Chapter [N]. Continue reading →" — the book as a world to enter
- Below the book link: "Explore more teachings →" — linking to the homepage (Today's Wisdom as a second encounter)
- The page should be the most beautiful thing the recipient sees in their social feed that day

**2. The Google arrival** (`/books/[slug]/[chapter]` from external referrer) — gentle context without interruption.
- A subtle one-line context bar above the chapter title: "You're reading *[Book Title]* by Paramahansa Yogananda — Chapter [N] of [Total] — Start from the beginning →"
- Styled in `--portal-text-muted`, `--text-sm`. Dismissed on scroll. Not shown when navigating within the portal.

**3. The daily visitor** (homepage → Today's Wisdom → "Show me another" → contemplate → leave).
- "Show me another" feels inexhaustible. SessionStorage-based exclusion list prevents repeats within a visit — the seeker cycles through all available passages before any repetition.
- Arc 1 pool depth is an open question (see CONTEXT.md).

**4. The Quiet Corner seeker** (`/quiet` directly, often in crisis).
- Self-contained: header collapses to lotus mark only, footer suppressed. Minimal cognitive load.
- Must pass the "2 AM crisis test" — nothing on the page adds to distress.

**5. The linear reader** (Chapter 1 → Chapter 2 → ... → Chapter N, via "Next Chapter").
- The reading column belongs to the book. Cross-book features (Related Teachings, graph traversal) are in the side panel, never inline.
- Optional Focus mode (ADR-072) reduces the reader to: reading column + Next Chapter. Everything else suppressed.

**6. The devoted practitioner** (returns daily or weekly, uses search to find half-remembered passages, builds collections, compares across books).
- This is the portal's highest-frequency seeker — someone who has practiced Kriya Yoga or studied Yogananda's writings for years and uses the portal as a study companion, not for discovery.
- Advanced search supports their recall pattern: partial-phrase matching, book-scoped search, cross-book comparison via Related Teachings.
- Personal collections (Arc 6) and study circle sharing (Milestone 7b) serve this seeker directly. Until then, browser bookmarks and the reading history (sessionStorage) provide lightweight persistence.
- The Practice Bridge signposts (ADR-104) are confirmations for this seeker, not introductions — they already know the path. The signpost tone acknowledges this.

**7. The scholar** (citation-driven, cross-referencing, export-oriented).
- Academic researchers, seminary students, comparative religion faculty, digital humanities scholars who need Yogananda's words in citable form.
- Stable canonical URLs for every passage (`/passage/[chunk-id]`) serve as persistent citations.
- Citation export (Chicago, MLA, BibTeX) from the passage detail view (Milestone 3d knowledge graph features the cross-reference layer that makes this natural).
- The Knowledge Graph `/explore` view (ADR-043, ADR-061, ADR-062) is this seeker's primary discovery tool — they navigate by relationship, not by theme or emotion.
- This path is how Yogananda's teachings enter university syllabi, interfaith anthologies, and peer-reviewed scholarship. The portal's bibliographic integrity directly serves this.

**Single-invitation principle:** Each path invites exactly one step deeper — never more. The shared passage → continue reading the chapter. The external chapter arrival → start from the beginning. The Quiet Corner → nothing during timer, then a parting passage. Today's Wisdom → "Show me another" or search. The devoted practitioner → deeper into the book they're studying. The scholar → the citation they can use.

**Honest absence principle:** When the portal cannot help — no results for a search query, a book unavailable in the seeker's language, a topic outside the corpus — it says so clearly and offers the closest alternative. The "no results" page is not an error state; it is a moment of honesty. It may surface the "Seeking..." empathic entry points, suggest broader theme exploration, or acknowledge that the query falls outside published works. It never fabricates relevance. (Relates to CLAUDE.md constraint #12 — content availability honesty.)

### DES-015: Self-Revealing Navigation

The portal teaches its own navigation through the experience of using it — not through tooltips, onboarding tours, or help overlays (though these remain as fallbacks).

**Content-as-instruction for Dwell mode:** The most evocative passage in a chapter's first screen receives a subtly warmer background on first visit — not full Dwell mode, but a hint that paragraphs can be focused. The seeker's natural curiosity discovers Dwell through exploration. The tooltip appears as fallback if not discovered within two chapter visits.

**Contextual teaching for themes:** When a seeker's first search returns results, result cards include a quiet link: "This passage also appears in the theme: **Courage** →" — teaching that themes exist through a result the seeker already cares about. Shown on first search only (sessionStorage).

**Keyboard shortcuts taught in context:** When a keyboard-using seeker reaches the end of a chapter, a one-time hint appears: "Press → for next chapter." Not a full shortcut reference — just the one shortcut relevant now. Subsequent shortcuts are introduced one at a time in context. The `?` overlay remains available.

**The terminology bridge teaches itself:** The suggestion dropdown showing "Yogananda's terms: concentration, one-pointed attention" below a "mindfulness" query teaches the vocabulary gap concept through a single well-designed moment — no explanation of "terminology bridge" needed.

**Fallback guarantee:** Every self-revealing pattern has a conventional fallback (tooltip, overlay, explicit link) for seekers who don't discover the organic path.

### Image Usage Guidelines

(See ADR-042 for full rationale, ADR-088 for portal imagery strategy.)

**Core principle: The reading experience is text-only.** No images appear in the book reader column. Imagery would compete with Yogananda's words, and his words always win. The portal's design is photo-optional — every layout works without images. (ADR-088)

**Guru photographs:**

| Context | Usage | Notes |
|---------|-------|-------|
| About page — lineage display | All four guru portraits in sequence | Primary location for guru images |
| About page — Yogananda bio | Yogananda portrait as author photo | Frontispiece positioning |
| Quiet Corner | Single small Yogananda portrait above affirmation | Liturgically appropriate — devotees meditate with guru's image |
| Book landing pages | Yogananda portrait as author photo | One per book, not per chapter |
| Site footer | Small sepia-toned portrait (~48-60px) beside "Teachings of Paramahansa Yogananda" | Attribution, not decoration. Present on every page. (ADR-088) |
| Everywhere else | **No guru images** | Restraint creates reverence |

**Nature/property photographs from SRF:**

| Context | Image Type | Treatment |
|---------|-----------|-----------|
| Homepage hero | Wide, soft-focus SRF property (Encinitas, Lake Shrine) | Today's Wisdom overlaid in white Merriweather on semi-transparent `--srf-navy` band. Updated seasonally (4 images/year). Graceful degradation to text-only if no image. (ADR-088) |
| Quiet Corner background | Desaturated nature at 5–8% opacity beneath warm cream | A hint of sky, a suggestion of water. Applied via `background-image` with low opacity. Optional — `--portal-bg-alt` alone is sufficient. (ADR-088) |
| Theme pages | Nature per theme (still water → Peace, mountains → Courage) | Ambient, never dominant. Muted. |
| 404 page | SRF garden photograph | Gentle error with: "This page doesn't exist, but perhaps you were meant to find this instead..." + search bar |

**Rules:**
- Never crop, filter, or apply effects to guru photographs
- Never use guru images adjacent to UI controls or in error/loading states
- **Never use stock photography.** SRF images or no images. The warm cream palette and gold lotus motif are sufficient to create a sacred atmosphere without photographs. (ADR-088)
- All images require alt text with full name/title (guru photos) or descriptive text (nature)
- The portal is designed to work beautifully with or without photographs — every layout functions without images

### SEO and Discoverability

The portal's mission is to reach the world. Without SEO, it serves only people who already know it exists.

**Per-page meta tags:**

| Page Type | Title Pattern | Description |
|-----------|--------------|-------------|
| Homepage | "Teachings of Paramahansa Yogananda — Free Online Library" | Portal overview |
| Theme page | "Yogananda on [Theme] — Verbatim Passages" | Theme-specific, includes life challenge keywords |
| Book page | "[Book Title] by Paramahansa Yogananda — Read Free Online" | Book-specific |
| Chapter page | "[Chapter Title] — [Book Title]" | Chapter-specific |
| Shared passage | Quote snippet (first 120 chars) + citation | Passage-specific, OG-optimized |
| Quiet Corner | "A Moment of Stillness — Yogananda Affirmation" | Calm, inviting |

**Structured data (JSON-LD):**
- `Book` schema for each book landing page
- `Article` schema for each chapter
- `WebSite` schema with `SearchAction` for the search bar
- `Organization` schema for SRF

**Sitemap:**
- Auto-generated from Neon data: all books, chapters, theme pages, and high-traffic shared passages
- Submitted to Google Search Console

**Key SEO opportunities:**
- Theme pages are the primary SEO entry point. Someone Googling "spiritual guidance for anxiety" or "Yogananda on fear" should land on `/themes/courage` or a search result.
- Shared passage URLs (`/passage/[id]`) accumulate inbound links naturally as people share quotes.
- Book chapter pages are long-form, unique content that search engines favor.

### Design System: SRF Design Tokens (Extracted from Live SRF Sites)

The following tokens are derived from analysis of yogananda.org, convocation.yogananda.org, onlinemeditation.yogananda.org, and associated SRF properties. The teaching portal inherits these to maintain brand consistency while applying Calm Technology principles.

#### Color Palette

```css
:root {
 /* === Brand Colors (extracted from yogananda.org) === */
 --srf-gold: #dcbd23; /* Donate button, lotus accent, primary CTA border */
 --srf-orange: #de6a10; /* Hover states, warm accent, X/social icon */
 --srf-navy: #1a2744; /* Logo wordmark, primary headings, nav text (estimated from assets) */
 --srf-white: #ffffff; /* Backgrounds, button text on dark */

 /* === Secondary Colors (from Online Meditation Center) === */
 --srf-orange-warm: #f7882f; /* OMC form submit buttons, warm CTA variant */
 --srf-gold-light: #ffcf6f; /* OMC focus ring, light gold accent */
 --srf-blue: #0274be; /* Interactive focus states, input focus border */
 --srf-slate: #6b7a8f; /* Button hover variant, muted secondary */

 /* === Neutral Scale === */
 --srf-gray-900: #4c4c4c; /* Dark body text, checkbox borders */
 --srf-gray-500: #808088; /* Secondary UI elements */
 --srf-gray-300: #cccccc; /* Borders, dividers, input borders */
 --srf-black: #000000; /* High-contrast text */

 /* === Teaching Portal Extensions (Calm Technology) === */
 --portal-bg: #FAF8F5; /* Warm cream — softer than pure white */
 --portal-bg-alt: #F5F0EB; /* Slightly warmer for alternating sections */
 --portal-quote-bg: #F9F6F1; /* Quote card background — warm, papery */
 --portal-text: #2C2C2C; /* Primary reading text — softer than black */
 --portal-text-muted: #595959; /* Citations, metadata, secondary text (corrected from #6B6B6B for WCAG AA contrast on cream) */

 /* === Time-Aware Reading Bands (DES-011) — defined when circadian color temperature ships === */
 /* --portal-bg-morning, --portal-bg-evening, --portal-bg-night, --portal-text-night
 are introduced when circadian color temperature is implemented. */

 /* === Meditation Mode (DES-011 extension) === */
 --portal-bg-deep: #0a1633; /* Deeper than navy — the blue field of the spiritual eye */
 --portal-text-meditate: #d4cfc7; /* Reduced contrast cream for contemplative reading */

 /* === Semantic Colors === */
 --color-error: #d32f2f; /* Errors (refined from raw "red") */
 --color-error-bg: rgba(242, 38, 19, 0.1); /* Error background (softened) */
 --color-success: #2e7d32; /* Success states */

 /* === Lotus Icon Color System (from SVG assets on yogananda.org) === */
 /* SRF uses a family of lotus icons in these accent colors: */
 --lotus-orange: #de6a10; /* lotus-1, lotus-10, lotus-13 */
 --lotus-yellow: #dcbd23; /* lotus-5, lotus-6 */
 --lotus-blue: #0274be; /* lotus-7 */
 --lotus-green: #4a7c59; /* lotus-5, lotus-6, lotus-7, lotus-12, lotus-13, lotus-14 (estimated) */
 --lotus-black: #1a2744; /* lotus-1, lotus-10, lotus-11, lotus-14 */
 /* Each color has _light and _dark background variants */
}
```

#### Typography

```css
:root {
 /* === Font Families (extracted from SRF Online Meditation Center) === */
 --font-serif: 'Merriweather', Georgia, 'Times New Roman', serif;
 --font-serif-alt: 'Lora', Georgia, serif;
 --font-sans: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

 /* === Non-Latin Script Fonts (ADR-077, ADR-080) === */
 /* Noto Sans Devanagari loaded from Arc 1 — God Talks with Arjuna
 contains original Bhagavad Gita verses in Devanāgarī script.
 Loaded conditionally: only on pages containing Devanāgarī characters.
 Milestone 5b adds Thai and Bengali font stacks. */
 --font-devanagari: 'Noto Sans Devanagari', 'Noto Serif Devanagari', sans-serif;
 --font-thai: 'Noto Sans Thai', 'Noto Serif Thai', sans-serif; /* Milestone 5b */
 --font-bengali: 'Noto Sans Bengali', sans-serif; /* Milestone 5b */

 /* === Font Scale === */
 /* Current scale: manually tuned for readability at each level.
    Evaluate golden-ratio alternative (1.618 ratio) during Milestone 2a design QA:
    base 1.125rem → 1.819rem → 2.943rem → 4.761rem.
    The golden ratio produces naturally harmonious proportions that echo
    sacred geometry — but only adopt if it serves readability. The current
    scale may already be superior for screen reading. (ADR-123: parameter.) */
 --text-xs: 0.75rem; /* 12px — labels, fine print */
 --text-sm: 0.9375rem; /* 15px — captions, metadata */
 --text-base: 1.125rem; /* 18px — body text, standard reading */
 --text-lg: 1.375rem; /* 22px — large body, form inputs */
 --text-xl: 1.75rem; /* 28px — section headings */
 --text-2xl: 2rem; /* 32px — page headings */

 /* === Font Weights (Merriweather supports 300, 400, 700) === */
 --font-light: 300; /* Elegant headings, pull quotes */
 --font-regular: 400; /* Body text */
 --font-semibold: 600; /* CTA text (Open Sans) */
 --font-bold: 700; /* Strong emphasis, section headings */

 /* === Line Heights === */
 --leading-tight: 1.3; /* Headings */
 --leading-normal: 1.6; /* Body text — generous for readability */
 --leading-relaxed: 1.8; /* Book text — spacious for contemplation */

 /* === Letter Spacing === */
 --tracking-wide: 0.125em; /* Uppercase labels, CTAs (from donate button: 2px at 18px) */
}
```

**Typography assignment:**

| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|-------------|
| Book text (reading) | Merriweather | 400 | `--text-base` (18px) | `--leading-relaxed` (1.8) |
| Quoted passages (search results) | Merriweather | 300 (light) | `--text-base` | `--leading-relaxed` |
| Page headings | Merriweather | 700 | `--text-2xl` (32px) | `--leading-tight` (1.3) |
| Section headings | Merriweather | 700 | `--text-xl` (28px) | `--leading-tight` |
| UI chrome (nav, buttons, labels) | Open Sans | 400/600 | `--text-sm` (15px) | `--leading-normal` (1.6) |
| Citations below quotes | Open Sans | 400 | `--text-sm` | `--leading-normal` |
| Chapter titles in reader | Lora | 400 | `--text-xl` | `--leading-tight` |
| Devanāgarī verses (Gita) | Noto Sans Devanagari | 400 | `--text-base` (18px) | `--leading-relaxed` (1.8) |

**IAST diacritics note (ADR-080):** Merriweather and Lora must render IAST combining characters (ā, ī, ū, ṛ, ṃ, ḥ, ñ, ṅ, ṭ, ḍ, ṇ, ś, ṣ) correctly at all sizes. Verify during Milestone 2a design QA — particularly at `--text-sm` (15px) where combining marks are most likely to collide or render incorrectly.

#### Spacing, Borders, and Radii

```css
:root {
 /* === Spacing Scale (derived from SRF site patterns) === */
 --space-1: 0.25rem; /* 4px */
 --space-2: 0.5rem; /* 8px */
 --space-3: 0.75rem; /* 12px — button padding-y */
 --space-4: 1rem; /* 16px — input padding */
 --space-5: 1.25rem; /* 20px — text block margin */
 --space-6: 1.5rem; /* 24px */
 --space-8: 2rem; /* 32px — section spacing */
 --space-10: 2.5rem; /* 40px — heading margin, large gaps */
 --space-12: 3rem; /* 48px */
 --space-16: 4rem; /* 64px — page section separators */
 --space-20: 5rem; /* 80px — hero spacing */

 /* === Borders (from SRF donate button, OMC forms) === */
 --border-thin: 1px solid;
 --border-standard: 1.5px solid; /* SRF donate button */
 --border-medium: 2px solid; /* OMC submit buttons, focus rings */

 /* === Border Radius === */
 --radius-sm: 3px; /* Subtle rounding */
 --radius-md: 5px; /* Form inputs (from OMC) */
 --radius-lg: 8px; /* Cards */
 --radius-pill: 50px; /* CTA buttons (from OMC submit) */

 /* === Transitions === */
 --transition-standard: all 0.3s ease; /* From SRF donate button */
}
```

#### Responsive Breakpoints

```css
/* Derived from yogananda.org and OMC Elementor config */
--bp-mobile: 639px; /* max-width: mobile */
--bp-tablet: 768px; /* min-width: tablet */
--bp-desktop: 1024px; /* min-width: desktop (JS nav breakpoint) */
--bp-wide: 1280px; /* min-width: wide desktop */
--bp-max-content: 1440px; /* max content width */
```

#### Calm Technology UI Rules

| Rule | Implementation |
|------|---------------|
| Background | `--portal-bg` (#FAF8F5) warm cream — never pure white |
| Quoted passages | `--portal-quote-bg` on cards with subtle `--srf-gold` left border |
| Headings | `--srf-navy` color, Merriweather bold |
| Body text | `--portal-text` (#2C2C2C) — softer than black |
| Links | `--srf-blue` (#0274be) with underline on hover |
| CTA buttons | `--srf-gold` border, gold text, orange on hover (matches donate pattern) |
| Whitespace | Generous. `--space-16` between major sections. `--space-8` between passages. |
| Quotation marks | Typographic curly quotes (\u201c \u201d) not straight (" ") |
| Citations | `--portal-text-muted` in `--font-sans` at `--text-sm` below each quote |
| Animations | Only `--transition-standard` (0.3s ease) on hover/focus. No decorative animation. |
| Loading states | Quiet skeleton screens using `--portal-bg-alt`. No spinners with messages. |
| Lotus icons | Use SRF's existing lotus SVG family as section markers and decorative elements |
| Decorative quote marks | Large Merriweather 700, 48px, `--srf-gold` at 40% opacity on all Yogananda passages (DES-008) |
| Drop capitals | Merriweather 700, `--srf-navy`, 3-line span at chapter starts (DES-008) |
| Section dividers | Small lotus SVG (16px, `--srf-gold` at 25%) instead of `<hr>` (DES-016) |
| Time-aware background | Shifts warmth by time of day — opt-out, on by default (DES-011) |
| Sacred space boundaries | Scripture quotes, guru passages, meditation instructions: soft inset shadow, thin `--srf-gold` top border (1px), `--portal-quote-bg` background, `--leading-relaxed` (1.8em) paragraph spacing. Creates a reverent visual container for holy words — felt as warmth, not as decoration. |

### DES-016: Lotus as Unified Visual Motif

A **single simplified lotus design** (geometric, 3-petal, SVG) serves as the portal's unified visual motif. The same design everywhere:

| Use | Size | Color | Opacity |
|-----|------|-------|---------|
| Section divider (replaces `<hr>`) | ~16px | `--srf-gold` | 25% |
| Bookmark icon in reader (ADR-066) | 20px | `--srf-gold` | 50% / 100% |
| Favicon | 16/32px | `--srf-gold` | 100% |
| Opening threshold (DES-007) | ~40px | `--srf-gold` | 30% |
| Quote card accent (optional) | 12px | `--srf-gold` | 20% |

**Design principles:**
- **One design.** Not multiple variants. The same SVG at different sizes and opacities.
- **Never heavy.** Always subtle — low opacity, small scale. Felt, not stared at.
- **Geometric, not photographic.** A minimal line drawing. Must work at 12px.
- **Gold only.** Always `--srf-gold`. No multi-color lotus icons in the portal.
- **Consistency creates recognition, which creates meaning.**

The SVG is defined once as a reusable component, parameterized for size, color, and opacity via CSS custom properties.

#### Self-Hosted Fonts (ADR-099)

Fonts are self-hosted from Vercel's CDN — not loaded from Google Fonts CDN. This eliminates IP transmission to Google servers (required by LG München I, Case No. 3 O 17493/20 for German GDPR compliance) and improves performance (no DNS lookup to `fonts.googleapis.com`).

Download WOFF2 files for Merriweather (300, 400, 700), Lora (400), and Open Sans (400, 600). Place in `/public/fonts/`. Reference via `@font-face` declarations in global CSS:

```css
@font-face {
  font-family: 'Merriweather';
  src: url('/fonts/merriweather-v30-latin-300.woff2') format('woff2');
  font-weight: 300;
  font-display: swap;
}
/* ... additional weights and families */
```

`font-display: swap` preserves the same FOUT behavior as the previous Google Fonts `display=swap` parameter.

*Section revised: 2026-02-21, ADR-099 (self-hosted fonts for GDPR compliance)*

---

## DES-017: Multi-Language Strategy

(See ADR-075 for architectural rationale, ADR-076 for CSS logical properties, ADR-077 for core language set.)

### Three-Layer Localization

| Layer | What | Approach | Milestone |
|-------|------|----------|-----------|
| **UI chrome** | Nav, labels, buttons, errors, search prompts (~200–300 strings) | `next-intl` with locale JSON files. URL-based routing (`/es/...`, `/de/...`). AI-assisted workflow: Claude drafts → human review → production (ADR-078). | Infrastructure in Milestone 2a. Translations in Milestone 5b. |
| **Book content** | Yogananda's published text in official translations | Language-specific chunks in Neon (`language` column). Contentful locales (available from Arc 1, activated in Milestone 5b). **Never machine-translate sacred text.** | 5b |
| **Search** | FTS, vector similarity, query expansion | Per-language BM25 index (pg_search, ADR-114). Multilingual embedding model (Voyage, ADR-118). Claude expands queries per language. | 5b |

### Milestone 2a — English Only, i18n-Ready

Content is English only. But the i18n infrastructure is in place from day one:

- All UI strings externalized to `messages/en.json` (never hardcoded in components)
- `next-intl` configured with `en` as sole locale
- CSS logical properties throughout (`ms-4` not `ml-4`, `text-align: start` not `text-align: left`)
- `lang="en"` on `<html>` element
- `language` column already present on `book_chunks`, `search_queries`, `email_subscribers`

Adding new locales later is a configuration change, not a codebase refactor.

### URL Structure

```
/ → English (default, no prefix)
/es/ → Spanish
/de/search?q=Angst → German search
/ja/quiet → Japanese Quiet Corner
/hi/themes/peace → Hindi theme page
```

Locale detection on first visit: `Accept-Language` header → redirect to best match → user override via language selector → preference stored in cookie (no account needed).

### Content Availability Matrix

Not all books are translated into all languages. This creates asymmetric experiences:

| Book | en | es | de | fr | it | pt | ja | th | hi | bn |
|------|----|----|----|----|----|----|----|----|----|----|
| Autobiography of a Yogi | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ? | ✓ | ✓ |
| Where There Is Light | ✓ | ✓ | ✓ | ✓ | ✓ | ? | ? | ? | ? | ? |
| Sayings | ✓ | ✓ | ? | ? | ? | ? | ? | ? | ? | ? |
| Man's Eternal Quest | ✓ | ✓ | ? | ? | ? | ? | ? | ? | ? | ? |
| Second Coming of Christ | ✓ | ? | ? | ? | ? | ? | ? | ? | ? | ? |

*(This matrix must be verified with SRF/YSS — it is a critical stakeholder question.)*

**Query pattern:** The content availability matrix is derived from the `books` table via `canonical_book_id`:

```sql
-- Which languages is a given book available in?
SELECT DISTINCT b.language
FROM books b
WHERE b.canonical_book_id = :canonical_id OR b.id = :canonical_id;

-- Full matrix: all books × all languages
SELECT
 COALESCE(b_en.title, b.title) AS title,
 b.language,
 b.id AS book_id
FROM books b
LEFT JOIN books b_en ON b.canonical_book_id = b_en.id
ORDER BY COALESCE(b_en.title, b.title), b.language;
```

This is a derived view, not a separate table. The `books` table with `canonical_book_id` is the single source of truth for content availability.

**Consequence:** The book catalog, search index depth, theme page richness, and daily passage pool all vary by language. This asymmetry is honest and transparent, not hidden.

### English Fallback Hierarchy

When the user's language has insufficient content, supplement with English — always clearly marked.

| Feature | Fallback Behavior |
|---------|-------------------|
| **Search results** | Search user's language first. If fewer than 3 results, also search English. English results marked with `[EN]` tag and "Read in English →" link. |
| **Today's Wisdom** | Draw from user's language pool. If pool < 20 passages, supplement with English (marked). |
| **Theme pages** | Show passages in user's language. If fewer than 5, supplement with English (marked). |
| **Quiet Corner** | Show affirmation in user's language. If none available, show English. |
| **Book reader** | No fallback — if book isn't translated, it's not in the catalog for that language. Show link: "Read in English →" |
| **Book catalog** | Show books available in user's language + a "Also available in English" section for remaining books. |
| **Daily email** | Send in subscriber's language. If passage pool too small, send English with language note. |

**Fallback display design:**

```
"The soul is ever free; it is deathless, birthless..."

— Autobiography of a Yogi, Chapter 26, p. 312 [EN]
 Read in English →
```

The `[EN]` tag is a small, muted language indicator. It is honest, not apologetic.

### Language-Specific Search

**Full-text search:** pg_search / ParadeDB BM25 indexes (ADR-114) handle per-language tokenization, stemming, and normalization via ICU analyzers.

> **Note:** pg_search BM25 indexes are configured per-language using ICU tokenization (defined in § Data Model). Each chunk's `language` column determines the appropriate analyzer at query time. No additional indexes are needed when new languages are added in Milestone 5b — only new content rows with the correct `language` value and the corresponding ICU analyzer configuration.

**Vector search:** The embedding model **must be multilingual** — this is an explicit requirement, not an accident. Voyage voyage-3-large (ADR-118) supports 26 languages and places semantically equivalent passages in different languages close together in the unified cross-lingual embedding space. This means English embeddings generated in Arc 1 remain valid when Spanish, German, and Japanese chunks are added in Milestone 5b — no re-embedding of the English corpus. Any future embedding model migration (ADR-046) must preserve this multilingual property. Benchmark per-language retrieval quality with actual translated passages in Milestone 5b. Switch to per-language models only if multilingual quality is insufficient — but note that per-language models sacrifice the English fallback's vector search quality and cross-language passage alignment.

**Query expansion:** Claude handles all target languages. The expansion prompt includes the target language:

```
Expand this {language} search query into semantic search terms in {language}: "{query}"
```

### Spiritual Terminology Across Languages

Yogananda uses Sanskrit terms throughout: *samadhi*, *karma*, *dharma*, *prana*, *guru*. Different translations handle these differently — some keep the Sanskrit, some translate, some transliterate. The search index must handle both forms.

**Example:** A German seeker searching "Samadhi" should find passages whether the German translation uses "Samadhi" or "Überbewusstsein" (superconsciousness).

**Approach:** The query expansion step (Claude) naturally handles this — it can expand "Samadhi" into both the Sanskrit term and the language-specific translation. For FTS, the trigram index (`pg_trgm`) already catches partial matches across transliterations.

### Locale-First Search Policy

The `language` API parameter means **the user's locale**, not the detected query language. Auto-detection on short queries (2–5 words) is unreliable — "karma" is the same word in six languages, "peace" gets typed by Spanish users who know the English word.

**Policy:**
1. Search the user's locale language first (via `hybrid_search` with `search_language` parameter)
2. If fewer than 3 results, supplement with English (service layer calls `hybrid_search` again with `search_language='en'`)
3. English fallback results are marked with `[EN]` tag and "Read in English →" link

This policy is implemented in `search.ts` at the service layer, not in the SQL function. The `hybrid_search` function is a single-language primitive; the service function composes the multilingual behavior.

### Cross-Language Features

The multilingual architecture serves two practical use cases, not arbitrary cross-language search:

1. **User's locale + English fallback.** A seeker reads and searches in their language. When content is insufficient (< 3 search results, sparse theme pages), English supplements it — clearly marked with `[EN]` tags. This is the primary multilingual experience. Arbitrary cross-language search (e.g., querying in Japanese, finding German results) solves a problem few seekers have — the real need is locale + English.

2. **Cross-language passage alignment.** When the same book exists in multiple translations, the `canonical_chunk_id` column on `book_chunks` links a translated chunk to its English original. This enables "Read this passage in Spanish →" navigation between editions. Alignment is done during ingestion by matching (canonical_book_id, chapter_number, paragraph_index). Edge cases (translator's notes, merged paragraphs) are resolved in the human QA step.

**Cross-language search as optional future feature:** The multilingual embedding model places semantically equivalent text in different languages close together in vector space. If usage data (Milestone 5b analytics) reveals demand for searching across all languages simultaneously, this can be enabled by calling `hybrid_search` without the `language` filter. But this is not a core Milestone 5b deliverable — locale + English fallback covers the practical need.

### Chunk Relations in a Multilingual Corpus

The `chunk_relations` table stores pre-computed semantic similarity. In a multilingual corpus, a naive "top 30 global" approach would leave non-English languages underserved — most of the 30 slots would be consumed by chunks in other languages (predominantly English, which will be the largest corpus).

**Computation strategy (Milestone 5b):**
- For each chunk, store **top 30 same-language** relations + **top 10 English supplemental** relations (best from English corpus when the chunk is non-English; empty for English chunks)
- Total: up to 40 rows per chunk (at 400K chunks across all languages = 16M rows — trivial for PostgreSQL)
- Same-language relations power the default "Related Teachings" side panel
- English supplemental relations provide fallback when the same-language corpus is small — a Spanish reader with only 3 Spanish books can still see related English passages in the side panel, clearly marked with `[EN]`
- The `rank` column indicates rank within its group (1–30 for same-language, 1–10 for English supplemental)
- Query pattern: `JOIN book_chunks target ON target.id = cr.target_chunk_id WHERE target.language = :lang` for same-language; add `OR target.language = 'en'` to include English supplemental
- Fallback: when filtered results < 3 (rare with this strategy), fall back to real-time vector similarity with a WHERE clause

This ensures every language gets full related teachings, not an afterthought. English supplemental relations are the multilingual equivalent of the search fallback strategy — same pattern, same `[EN]` marking.

### Language Selector

A globe icon in the header navigation, opening a simple dropdown of available languages. Each language displayed in its own script:

```
English
Español
Deutsch
Français
Italiano
Português
日本語
ไทย
हिन्दी
বাংলা
```

Selection stored in a cookie. Available on every page. Not gated by account.

### Font Stack for Non-Latin Scripts

| Language | Script | Font |
|----------|--------|------|
| Japanese | CJK | Noto Serif JP (reading), Noto Sans JP (UI) |
| Thai | Thai | Noto Serif Thai (reading), Noto Sans Thai (UI) |
| Hindi | Devanagari | Noto Serif Devanagari (reading), Noto Sans Devanagari (UI) |
| Bengali | Bengali | Noto Serif Bengali (reading), Noto Sans Bengali (UI) |
| All Latin | Latin | Merriweather / Lora / Open Sans (existing stack) |

All non-Latin fonts loaded conditionally — only when the user selects that locale, not on every page load.

### Per-Language SEO

| Requirement | Implementation |
|-------------|---------------|
| `hreflang` tags | Every page includes `<link rel="alternate" hreflang="es" href="/es/...">` for all available locales. |
| Per-language sitemap | Separate sitemap per locale, submitted to Google Search Console. |
| Localized meta tags | Page titles and descriptions translated per locale. |
| JSON-LD language | `inLanguage` field on Book and Article schemas matches the page locale. |

### Resolved Design Decisions

1. **Locale-first search:** The `language` API parameter means the user's locale, not the detected query language. No auto-detection of query language. English fallback implemented at service layer.
2. **Theme slugs stay in English** for URL stability (`/es/themes/peace`, not `/es/temas/paz`). Display names localized via `topic_translations` table.
3. **Embedding model must be multilingual.** Explicit requirement (not accident). Ensures Arc 1 embeddings remain valid when Milestone 5b adds new languages.
4. **`reader_url` is locale-relative.** API returns `/books/slug/chapter#chunk`. Client prepends locale prefix. API stays presentation-agnostic.
5. **`chunk_relations` store per-language.** Top 30 same-language + top 10 English supplemental per chunk. Ensures non-English languages get full related teachings with English fallback.
6. **Locale + English fallback is the multilingual model.** Arbitrary cross-language search (e.g., Japanese query finding German results) is deferred as optional — the practical need is the user's language plus English fallback, not N×N language combinations. The multilingual embedding model enables cross-language search at near-zero cost if usage data later justifies it.
7. **Chunk size must be validated per language (Milestone 5b).** Token economies differ across scripts — a 300-token chunk in Japanese may hold less semantic content than 300 English tokens. Per-language chunk size benchmarking is required before ingesting non-English content. At minimum, validate that English-calibrated chunk sizes produce acceptable retrieval quality in all target languages.

### Open Questions (Require SRF Input)

> **Central registry:** CONTEXT.md § Open Questions. The Milestone 5b questions below are tracked there with the full stakeholder list.

- Digital text availability of official translations for all 9 non-English core languages (highest-impact Milestone 5b question)
- Translation reviewer staffing per language
- YSS portal branding for Hindi/Bengali/Thai locales
- Whether translated editions preserve paragraph structure (affects `canonical_chunk_id` alignment)
- Thai word-boundary handling for search tokenization (Thai script has no whitespace between words)

---

## DES-020: Platform Parity (Mobile Readiness)

The portal is a web application, but its API surface will likely be consumed by native mobile apps eventually — either a standalone portal app, integration into the existing SRF mobile app, or both. ADR-011 establishes the architectural conventions that make this possible at zero Arc 1 cost.

### Shared Service Layer

All business logic lives in `/lib/services/` as plain TypeScript functions. Server Components and API routes both call these functions — never the other way around.

```
/lib/services/
 search.ts → findPassages(query, language, options)
 daily-passage.ts → getDailyPassage(date, language)
 themes.ts → getThemes(language), getThemePassages(slug, language, cursor, limit)
 books.ts → getBooks(language), getBook(slug), getChapter(bookSlug, chapterNumber, language)
 quiet.ts → getAffirmation(language)
 relations.ts → getRelatedChunks(chunkId, filters, limit)
 thread.ts → getChapterThread(bookSlug, chapterNumber)
 glossary.ts → getGlossaryTerms(language, category), getTermBySlug(slug, language)
 audio.ts → getRecordings(cursor, limit, filters), getRecording(slug)
 videos.ts → getVideos(cursor, limit, filters), getVideo(slug)
 magazine.ts → getIssues(cursor, limit, filters), getIssue(slug), getArticles(cursor, limit, filters), getArticle(slug)
 seeking.ts → getSeekingDashboard, getThemeTrends(period)
 journeys.ts → getJourneys(language), getJourney(slug)
 resonance.ts → getResonanceSignals(type, limit)
```

**The rule:** Never put business logic in a Server Component or Route Handler that doesn't delegate to a service function. If a Server Component needs data, it calls a service function directly (in-process). If a mobile app needs the same data, it calls the API route, which calls the same service function.

### Database Connection Strategy

```typescript
// /lib/db.ts — Neon serverless connection
import { neon } from '@neondatabase/serverless';

// For Vercel Functions (edge and serverless):
// - @neondatabase/serverless uses HTTP-based queries (no persistent connections)
// - HTTP mode limit: 64MB request/response (irrelevant for API queries; batch ingestion uses Pool)
// - Each function invocation creates a lightweight client, no pool management needed
// - Neon's built-in connection pooler (PgBouncer-compatible) handles concurrency server-side
// - Wrap queries in async-retry with exponential backoff for transient connection drops
//   (config: DB_RETRY_COUNT, DB_RETRY_FACTOR, DB_RETRY_MIN_TIMEOUT_MS in /lib/config.ts)
//
// For Lambda batch workloads (Milestone 3a+, ADR-017):
// - Use Neon's pooled connection string (port 5432 → pooler endpoint)
// - Connection limit scales with compute size (up to 4,000 at 9+ CU)
// - Scale tier: autoscaling up to 16 CU, protected branches, 30-day PITR
// - Batch scripts should use connection pooling via pg Pool with max: 5
//
// For local development:
// - Direct connection to Neon dev branch (non-pooled endpoint)
// - dbmate uses direct connection string for migrations

const sql = neon(process.env.NEON_DATABASE_URL!);
export { sql };
```

### API Conventions

| Convention | Rule | Rationale |
|------------|------|-----------|
| **Versioning** | All routes prefixed `/api/v1/`. Never break v1 after mobile apps ship. | Mobile apps can't force-update users. |
| **Auth** | All routes public (no auth) through Arc 6. Auth added only if/when Milestone 7a accounts are implemented. | Frictionless access is the mission. Auth is additive, never a gate on reading or search. |
| **Pagination** | Cursor-based: `{ results, cursor, hasMore }`. No page-number pagination. | Stable across data changes; mobile infinite scroll. |
| **Cache headers** | Explicit `Cache-Control` on every response. Book text: long-lived. Search: no-store. Daily passage: 1 hour. | Mobile apps cache intelligently without custom logic. |
| **Response shape** | Presentation-agnostic JSON. No HTML in responses. No assumptions about rendering. | Same response serves web, mobile, and any future consumer. |
| **`reader_url` convention** | All `reader_url` fields are locale-relative paths (e.g., `/books/autobiography-of-a-yogi/26#chunk-uuid`). The client prepends the locale prefix (e.g., `/es`). The API never embeds locale into URLs — that's a presentation concern. | Keeps the API locale-agnostic; web and mobile clients handle routing differently. |
| **Language parameter** | All content-serving endpoints accept `language` (optional, default `'en'`). The parameter means "the user's locale," not "detected query language." The service layer handles English fallback when locale results are insufficient (ADR-075). | Locale-first search: trust the user's language choice. |

### Cache-Control Strategy

| Endpoint | Header | Rationale |
|----------|--------|-----------|
| `/api/v1/books/[slug]/chapters/[number]` | `max-age=86400, stale-while-revalidate=604800` | Book text is effectively immutable |
| `/api/v1/daily-passage` | `max-age=3600` | Changes daily, not every second |
| `/api/v1/themes/[slug]/passages` | `max-age=3600` | Theme curation changes infrequently |
| `/api/v1/quiet` | `max-age=300` | Affirmation rotates but isn't time-critical |
| `/api/v1/search` | `no-store` | Query-dependent, not cacheable |
| `/api/v1/themes` | `max-age=86400` | Theme list rarely changes |
| `/api/v1/books` | `max-age=86400` | Book catalog rarely changes |
| `/api/v1/books/{slug}` | `max-age=86400, stale-while-revalidate=604800` | Book metadata is effectively immutable |
| `/api/v1/chunks/[id]/related` | `max-age=86400, stale-while-revalidate=604800` | Relations stable; only change on new content ingestion |
| `/api/v1/books/[slug]/chapters/[number]/thread` | `max-age=86400, stale-while-revalidate=604800` | Same as related — changes only on new content |
| `/api/v1/magazine/issues` | `max-age=86400` | Issue catalog changes rarely |
| `/api/v1/magazine/issues/{slug}` | `max-age=86400, stale-while-revalidate=604800` | Issue metadata is effectively immutable |
| `/api/v1/magazine/articles` | `max-age=86400` | Article catalog changes rarely |
| `/api/v1/magazine/articles/{slug}` | `max-age=86400, stale-while-revalidate=604800` | Article text is effectively immutable |
| `/api/v1/audio` | `max-age=86400` | Audio catalog changes infrequently |
| `/api/v1/audio/{slug}` | `max-age=86400, stale-while-revalidate=604800` | Audio metadata is effectively immutable |
| `/api/v1/videos` | `max-age=86400` | Video catalog changes infrequently |
| `/api/v1/videos/{slug}` | `max-age=86400, stale-while-revalidate=604800` | Video metadata is effectively immutable |
| `/api/v1/glossary` | `max-age=86400` | Glossary changes infrequently |
| `/api/v1/seeking` | `max-age=86400` | Aggregated nightly, not real-time |

### Cache Invalidation Strategy

| Trigger | Mechanism | Scope |
|---------|-----------|-------|
| Content correction (Milestone 1b+) | Contentful webhook → sync service → Cloudflare Purge API | Purge by `Cache-Tag` (e.g., `book:autobiography`, `chapter:autobiography-1`) |
| Daily passage rotation | TTL-based (`max-age=3600`) | No explicit invalidation — 1-hour cache is acceptable for daily content |
| Theme tag changes | Manual Cloudflare purge via API or dashboard | Theme pages and related API responses |
| New book ingestion | Automated purge of `/books` catalog and search index | Book catalog, search results |
| Static assets (JS/CSS) | Content-hashed filenames (`main.abc123.js`) | Infinite cache, new deploy = new hash |
| Emergency content fix | Cloudflare "Purge Everything" via API | Last resort — clears entire CDN cache |

**Implementation:** Each API response includes a `Cache-Tag` header with resource identifiers. The webhook sync service (Milestone 1b+) calls the Cloudflare Purge API with matching tags after each Contentful publish event. For Milestone 1a (batch sync, no webhooks), cache invalidation is manual — acceptable given the low frequency of content changes during initial ingestion.

### Deep Link Readiness

Passage URLs (`/passage/[chunk-id]`) are designed for universal link interception:

| Platform | File | Location |
|----------|------|----------|
| iOS | `apple-app-site-association` | Domain root (`/.well-known/`) |
| Android | `assetlinks.json` | `/.well-known/` |

These files are added when a native app launches. The URL structure that makes them work is established now.

### PWA Readiness (Distributed Across Arcs)

Before native apps, a Progressive Web App provides offline reading, home screen installation, and a lighter footprint. See ADR-012.

| Component | Implementation |
|-----------|---------------|
| **Web App Manifest** | `manifest.json` with SRF branding (SRF Gold theme color, portal icon, `standalone` display) |
| **Service Worker** | Cache-first for book chapters, stale-while-revalidate for daily passage, network-only for search |
| **Offline indicator** | Subtle banner: "You're reading offline. Search requires a connection." |
| **Installable** | Meets PWA installability criteria (manifest + Service Worker + HTTPS) |

Offline reading aligns with the Calm Technology principle — a seeker can download a book chapter and read it on a flight, in a forest, or in a place with no connectivity. The technology fades into the background.

---

## DES-021: YouTube Video Section Architecture

### Design Principle

The video section auto-updates from the @YoganandaSRF YouTube channel without manual intervention. SRF's YouTube repository contains hundreds of How-to-Live monastic talks, guided meditations, convocation sessions, and commemorative events. The portal surfaces this content in an organized, searchable way.

### Data Strategy: Hybrid RSS + YouTube API

```
┌─────────────────────────────────────────────────────────────┐
│ │
│ "Latest Videos" section (homepage + /videos) │
│ ┌─────────────────────────────────────┐ │
│ │ YouTube RSS Feed │ │
│ │ (no API key, no quota, free) │ │
│ │ │ │
│ │ URL: youtube.com/feeds/videos.xml │ │
│ │ ?channel_id=CHANNEL_ID │ │
│ │ │ │
│ │ Returns: ~15 most recent videos │ │
│ │ Fields: title, videoId, thumbnail, │ │
│ │ description, published, │ │
│ │ view count │ │
│ │ │ │
│ │ ISR revalidate: 1 hour │ │
│ └─────────────────────────────────────┘ │
│ │
│ "Full Video Library" (categorized by playlist) │
│ ┌─────────────────────────────────────┐ │
│ │ YouTube Data API v3 │ │
│ │ (API key, 10,000 units/day free) │ │
│ │ │ │
│ │ 1. channels.list (1 unit) │ │
│ │ → get uploads playlist ID │ │
│ │ │ │
│ │ 2. playlists.list (1 unit/page) │ │
│ │ → get all channel playlists │ │
│ │ → map to site categories │ │
│ │ │ │
│ │ 3. playlistItems.list (1 unit/page) │ │
│ │ → get videos per playlist │ │
│ │ → up to 50 per page │ │
│ │ │ │
│ │ 4. videos.list (1 unit per 50) │ │
│ │ → full metadata: duration, │ │
│ │ views, thumbnails, tags │ │
│ │ │ │
│ │ ISR revalidate: 6 hours │ │
│ └─────────────────────────────────────┘ │
│ │
│ NEVER use search.list — costs 100 units per call. │
│ Use playlistItems.list instead (1 unit per call). │
│ │
│ Estimated daily quota usage: ~50-100 units (of 10,000) │
│ │
└─────────────────────────────────────────────────────────────┘
```

### Video Categorization

SRF organizes YouTube content into playlists. We map these to portal categories:

```typescript
// Configuration: YouTube playlist → portal category
const PLAYLIST_CATEGORIES = {
 // Map SRF YouTube playlist titles to portal categories
 'How-to-Live Inspirational Talks': { slug: 'how-to-live', label: 'How-to-Live Talks' },
 'Guided Meditations': { slug: 'meditations', label: 'Guided Meditations' },
 'World Convocation': { slug: 'convocation', label: 'Convocation Sessions' },
 'Mahasamadhi Commemorations': { slug: 'commemorations', label: 'Commemorations' },
 'SRF Lessons Introduction': { slug: 'introduction', label: 'Introduction to the Teachings' },
 // Unmapped playlists appear under "More Videos"
};
```

### ISR Revalidation Schedule

| Content | Revalidation | Rationale |
|---------|-------------|-----------|
| Latest videos (RSS) | 1 hour | Free, catches new uploads promptly |
| Channel info | 24 hours | Rarely changes |
| Playlist list | 6 hours | New playlists are infrequent |
| Playlist videos | 6 hours | Videos may be added to playlists |
| Video details (duration, views) | 6 hours | View counts change but freshness is non-critical |

### API Routes

#### `GET /api/v1/videos/latest`

```
Source: YouTube RSS feed (free, no API key)
ISR: revalidate every 1 hour

Response:
{
 "videos": [
 {
 "videoId": "PiywKdIdQik",
 "title": "2026 New Year Message from Brother Chidananda",
 "published": "2026-01-01T00:00:00Z",
 "thumbnail": "https://i.ytimg.com/vi/PiywKdIdQik/hqdefault.jpg",
 "description": "...",
 "viewCount": "45230"
 },
 ...
 ]
}
```

#### `GET /api/v1/videos/library`

```
Source: YouTube Data API v3 (API key required)
ISR: revalidate every 6 hours

Response:
{
 "categories": [
 {
 "slug": "how-to-live",
 "label": "How-to-Live Talks",
 "playlistId": "PLxxxxxx",
 "videoCount": 47,
 "videos": [
 {
 "videoId": "KYxMO7svgPQ",
 "title": "The Art of Introspection for God-Realization",
 "published": "2024-08-15T00:00:00Z",
 "thumbnail": "https://i.ytimg.com/vi/KYxMO7svgPQ/maxresdefault.jpg",
 "duration": "PT1H12M34S",
 "viewCount": "125000",
 "description": "..."
 },
 ...
 ]
 },
 ...
 ]
}
```

### Video Page Layout

```
┌──────────────────────────────────────────────────────────────┐
│ Videos from @YoganandaSRF │
│ │
│ Latest │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ ▶ thumb │ │ ▶ thumb │ │ ▶ thumb │ │ ▶ thumb │ → │
│ │ title │ │ title │ │ title │ │ title │ │
│ │ 2d ago │ │ 1w ago │ │ 2w ago │ │ 3w ago │ │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
│ │
│ ────────────────────────────────────────────────────── │
│ │
│ How-to-Live Talks View all → │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ ▶ thumb │ │ ▶ thumb │ │ ▶ thumb │ │
│ │ title │ │ title │ │ title │ │
│ │ 1h 12m │ │ 55m │ │ 1h 3m │ │
│ │ 125K │ │ 89K │ │ 67K │ │
│ └─────────┘ └─────────┘ └─────────┘ │
│ │
│ Guided Meditations View all → │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ ... │ │ ... │ │ ... │ │
│ └─────────┘ └─────────┘ └─────────┘ │
│ │
└──────────────────────────────────────────────────────────────┘
```

### Video Embedding

Videos play via YouTube's embedded player (no Vimeo needed for public YouTube content):

```html
<iframe
 src="https://www.youtube-nocookie.com/embed/{videoId}"
 title="{video title}"
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
 allowfullscreen
 loading="lazy"
></iframe>
```

Using `youtube-nocookie.com` for privacy-enhanced mode (no tracking cookies until play).

### ADR-055: Future: Video-to-Book Cross-Reference (Milestone 5b)

When monastic talks are transcribed, the transcripts become a new content type alongside book chunks, enabling unified cross-media search and time-synced playback.

#### Transcript Sources

| Source | Timestamps | Quality | Cost |
|--------|-----------|---------|------|
| **YouTube auto-captions** | Word-level (~0.1s accuracy) | Good for clear English speech | Free (YouTube Data API `captions.download`) |
| **YouTube manual captions** | Word-level | Highest (SRF-uploaded) | Free |
| **OpenAI Whisper API** | Word-level (`timestamp_granularities` param) | Excellent for monastic talks | $0.006/min (~$0.36 per 60-min talk) |
| **Deepgram** | Word-level + paragraph-level | Excellent, with speaker diarization | Similar to Whisper |

**Recommended approach:** Start with YouTube's own captions (free, already in the data pipeline). Use Whisper as the quality upgrade for talks where YouTube captions are insufficient. Estimated one-time cost for SRF's full YouTube library (~500 videos): $150–300.

#### Schema Extension

```sql
-- ============================================================
-- VIDEO TRANSCRIPTS (Arc 6)
-- ============================================================
CREATE TABLE video_transcripts (
 id UUID PRIMARY KEY DEFAULT uuidv7(),
 video_id TEXT NOT NULL, -- YouTube video ID
 video_title TEXT, -- cached from YouTube API
 language TEXT NOT NULL DEFAULT 'en',
 transcript_full TEXT NOT NULL, -- complete transcript text
 source TEXT NOT NULL DEFAULT 'youtube', -- 'youtube', 'whisper', 'deepgram', 'manual'
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

-- ============================================================
-- VIDEO CHUNKS (time-synced, embeddable, searchable — Arc 6)
-- ============================================================
-- Same chunking strategy as book_chunks. Each chunk carries start/end
-- timestamps enabling direct links to the exact video playback moment.
CREATE TABLE video_chunks (
 id UUID PRIMARY KEY DEFAULT uuidv7(),
 transcript_id UUID NOT NULL REFERENCES video_transcripts(id) ON DELETE CASCADE,
 content TEXT NOT NULL, -- chunk text (same strategy as book_chunks)
 start_seconds FLOAT NOT NULL, -- timestamp where this chunk begins in the video
 end_seconds FLOAT NOT NULL, -- timestamp where this chunk ends
 embedding VECTOR(1024), -- same embedding model as book_chunks (Voyage voyage-3-large, ADR-118)
 -- BM25 search via pg_search index (same FTS strategy as book_chunks, ADR-114)
 language TEXT NOT NULL DEFAULT 'en',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE INDEX idx_video_chunks_embedding ON video_chunks
 USING hnsw (embedding vector_cosine_ops);
-- BM25 index for video_chunks created via pg_search (same pattern as chunks_bm25_icu)
```

#### Cross-Media Search Architecture

Because `video_chunks` uses the same embedding model and FTS strategy as `book_chunks`, unified search is natural:

```
Search query: "overcoming fear"
 │
 ▼
 HYBRID SEARCH (extended)
 ├── book_chunks → ranked verbatim book passages with citations
 └── video_chunks → ranked video segments with timestamps
 │
 ▼
 UNIFIED RRF RANKING
 Results interleave book passages and video segments by relevance
 │
 ▼
 RESULT PRESENTATION
 ┌──────────────────────────────────────────────┐
 │ Book result: │
 │ "The soul is ever free..." — AoY, Ch. 12 │
 │ [Read in context →] │
 ├──────────────────────────────────────────────┤
 │ Video result: │
 │ Brother Chidananda on overcoming fear │
 │ "How-to-Live Talk" (12:34–13:15) │
 │ [Watch at 12:34 →] │
 └──────────────────────────────────────────────┘
```

Video results link to `https://youtube.com/watch?v={video_id}&t={start_seconds}` — dropping the seeker into the exact moment. YouTube's embed API also supports `start` parameters for in-portal embedding.

#### Cross-Media Chunk Relations

Pre-computed `chunk_relations` can span book chunks and video chunks. When a seeker reads a passage in *Autobiography of a Yogi*, the Related Teachings panel can show: *"Brother Chidananda discusses this teaching in a 2023 How-to-Live talk (12:34)"* — with a direct link to that timestamp. This is the feature that makes the portal's cross-media intelligence unique.

#### Synchronized Transcript Display

The video player page (`/videos/[slug]`) shows a synchronized transcript panel alongside the embedded player:

- Transcript text scrolls to follow playback position
- Each paragraph is clickable — clicking jumps the video to that timestamp
- Book passages referenced in the talk appear as margin cards linking to the reader
- The transcript is searchable within the page (browser find or custom search)

---

## DES-022: Events Section

The portal connects seekers to SRF's gatherings without duplicating existing event properties. This is a signpost, not a destination. See ADR-069.

### Content

| Element | Content | Source | Update Frequency |
|---------|---------|--------|-----------------|
| **World Convocation** | SRF's annual gathering of seekers from around the world, offered free of charge. Held each August in Los Angeles and simultaneously online, Convocation includes classes on Yogananda's teachings, group meditations, devotional chanting (kirtan), pilgrimage tours to sacred SRF sites, and fellowship with monastics and seekers worldwide. Anyone may attend — no membership required. Hero image, next year's dates. | Static text + link to `convocation.yogananda.org` | Annual |
| **Commemorations** | Christmas meditation, Mahasamadhi (March 7), Janmashtami, Founder's Day, etc. | Static list with dates and links to SRF event pages | Annual |
| **Online events** | "Join a live meditation" — SRF's Online Meditation Center offers live group meditations, guided meditations led by SRF monastics, and devotional chanting sessions from the convenience of home. | Link to `onlinemeditation.yogananda.org` | Static |
| **Retreats** | "Experience a retreat" | Link to SRF retreat information | Static |
| **Monastic visits** | SRF monastics visit meditation centers worldwide throughout the year for classes, meditations, and fellowship. | Link to SRF events page (`yogananda.org/events`) | Static |
| **Youth & young adult programs** | SRF offers dedicated programs for young seekers. | Link to SRF youth/young adult pages (`yogananda.org/events`) | Static |

### Page Design

Located at `/events` (dedicated page — consistent with the routes table in § Frontend Design § Pages and the nav structure).

```
┌─────────────────────────────────────────────┐
│ Gatherings & Events │
│ │
│ ┌─────────────────────────────────────┐ │
│ │ 🌅 World Convocation 2027 │ │
│ │ │ │
│ │ SRF's annual gathering of seekers │ │
│ │ from around the world — free and │ │
│ │ open to all. Classes, meditations, │ │
│ │ kirtan, pilgrimage tours to sacred │ │
│ │ SRF sites, and fellowship with │ │
│ │ monastics. In Los Angeles & online. │ │
│ │ │ │
│ │ Register free → convocation.yoga.. │ │
│ │ Explore the sacred places → /places │ │
│ └─────────────────────────────────────┘ │
│ │
│ Upcoming Commemorations │
│ ───────────────────────── │
│ March 7 · Mahasamadhi of │
│ Paramahansa Yogananda │
│ August · Janmashtami │
│ December · Christmas Meditation │
│ │
│ ┌──────────────────┐ ┌──────────────────┐ │
│ │ Join a Live │ │ Experience a │ │
│ │ Meditation → │ │ Retreat → │ │
│ └──────────────────┘ └──────────────────┘ │
│ │
│ ┌──────────────────┐ ┌──────────────────┐ │
│ │ Monastic Visits │ │ Youth & Young │ │
│ │ Worldwide → │ │ Adult Programs → │ │
│ └──────────────────┘ └──────────────────┘ │
└─────────────────────────────────────────────┘
```

### Implementation

- **Milestone 5a:** Static content. MDX or hardcoded in a Next.js page. No CMS needed.
- **Production:** Contentful entry type `event` with fields: `title`, `date`, `description`, `externalUrl`, `image`. Editors update annually.
- **No dynamic event data.** The portal does not fetch from SRF's event systems. It links to them.
- **Lightweight calendar awareness (Milestone 5a):** The Convocation hero card displays the next Convocation date. Since Convocation is always in August, a simple date comparison promotes the card from "annual event" to "upcoming event" when the current date is within a configurable window (e.g., April–August). During this window, the card's description adds "Registration is open" with link. Outside the window: "Held each August." This is not the full DES-028 calendar-aware surfacing system — it's a single date check on a static page. Commemorations can use similar lightweight date proximity when full DES-028 ships (Milestone 3b+).

---

## DES-023: Sacred Places — Contemplative Geography

A dedicated `/places` page presenting sites of biographical and spiritual significance, cross-referenced with book passages. See ADR-069.

### Data Model

```sql
-- Sacred places (SRF properties + biographical sites)
CREATE TABLE places (
 id UUID PRIMARY KEY DEFAULT uuidv7(),
 name TEXT NOT NULL,
 slug TEXT NOT NULL UNIQUE,
 category TEXT NOT NULL CHECK (category IN ('srf_property', 'yss_property', 'biographical')),
 description TEXT NOT NULL,
 significance TEXT, -- Spiritual/historical significance
 address TEXT,
 city TEXT NOT NULL,
 region TEXT, -- State/province
 country TEXT NOT NULL,
 latitude DECIMAL(10, 7),
 longitude DECIMAL(10, 7),
 image_url TEXT, -- Contemplative header image
 visiting_info TEXT, -- Hours, access notes
 external_url TEXT, -- Link to SRF/YSS property page
 virtual_tour_url TEXT, -- SRF virtual pilgrimage tour URL (nullable; SRF offers tours of Mother Center, Lake Shrine, Hollywood Temple, Encinitas)
 is_active BOOLEAN NOT NULL DEFAULT true,
 display_order INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

-- Junction: which book passages mention which places
CREATE TABLE chunk_places (
 chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
 place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
 context_note TEXT, -- e.g., "Yogananda describes arriving at this ashram"
 PRIMARY KEY (chunk_id, place_id)
);

CREATE INDEX idx_chunk_places_place ON chunk_places(place_id);
CREATE INDEX idx_chunk_places_chunk ON chunk_places(chunk_id);
```

### Page Design

```
┌──────────────────────────────────────────────────┐
│ Sacred Places │
│ Where the teachings come alive │
│ │
│ ── SRF & YSS Centers ────────────────────────── │
│ │
│ ┌────────────────────────────────────────────┐ │
│ │ [contemplative photo] │ │
│ │ │ │
│ │ Lake Shrine │ │
│ │ Pacific Palisades, California │ │
│ │ │ │
│ │ A ten-acre sanctuary on Sunset Boulevard, │ │
│ │ home to the Gandhi World Peace Memorial │ │
│ │ and spring-fed lake surrounded by │ │
│ │ meditation gardens. │ │
│ │ │ │
│ │ 📖 Read about Lake Shrine → │ │
│ │ Autobiography, Chapter 49 │ │
│ │ │ │
│ │ Visit → srf.org/lake-shrine │ │
│ │ Take a Virtual Tour → │ │
│ │ Get Directions → │ │
│ │ See This Place (Street View) → │ │
│ └────────────────────────────────────────────┘ │
│ │
│ ┌────────────────────────────────────────────┐ │
│ │ [contemplative photo] │ │
│ │ │ │
│ │ Encinitas Retreat │ │
│ │ Encinitas, California │ │
│ │ │ │
│ │ The ocean-facing hermitage where │ │
│ │ Yogananda wrote much of the │ │
│ │ Autobiography of a Yogi. │ │
│ │ │ │
│ │ 📖 Read in context → │ │
│ │ Autobiography, Chapter 37 │ │
│ │ │ │
│ │ Visit → srf.org/encinitas │ │
│ │ Get Directions → │ │
│ │ See This Place (Street View) → │ │
│ └────────────────────────────────────────────┘ │
│ │
│ ── In the Footsteps of Yogananda ────────────── │
│ │
│ ┌────────────────────────────────────────────┐ │
│ │ Gorakhpur, India │ │
│ │ Yogananda's birthplace │ │
│ │ │ │
│ │ "I find my earliest memories │ │
│ │ centering around the family home │ │
│ │ in Gorakhpur..." │ │
│ │ — Autobiography of a Yogi, Chapter 1 │ │
│ │ │ │
│ │ 📖 Read Chapter 1 → │ │
│ └────────────────────────────────────────────┘ │
│ │
│ ┌────────────────────────────────────────────┐ │
│ │ Ranchi, India │ │
│ │ Yogoda Satsanga Brahmacharya Vidyalaya │ │
│ │ │ │
│ │ "A school for boys where yoga was │ │
│ │ taught along with standard │ │
│ │ educational subjects." │ │
│ │ — Autobiography of a Yogi, Chapter 27 │ │
│ │ │ │
│ │ 📖 Read Chapter 27 → │ │
│ └────────────────────────────────────────────┘ │
│ │
│ ┌────────────────────────────────────────────┐ │
│ │ Serampore, India │ │
│ │ Sri Yukteswar's ashram │ │
│ │ │ │
│ │ "The hermitage... is a two-storied │ │
│ │ building with a courtyard..." │ │
│ │ — Autobiography of a Yogi, Chapter 12 │ │
│ │ │ │
│ │ 📖 Read Chapter 12 → │ │
│ └────────────────────────────────────────────┘ │
│ │
│ [Future: Street View links on place cards]   │
│ │
│ ── Find a Meditation Group Near You ─────────── │
│ External link → yogananda.org/center-locator │
└──────────────────────────────────────────────────┘
```

### The Book Cross-Reference

The unique value of Sacred Places on the teaching portal: each place links to the passages that describe it, and passages in the reader can link back to the place.

**Reader → Place:** When reading a chapter that mentions a significant location, a subtle card appears in the margin or below the passage:

```
┌──────────────────────────────┐
│ 📍 This passage describes │
│ Serampore, India │
│ View in Sacred Places → │
└──────────────────────────────┘
```

**Place → Reader:** Each Sacred Places entry lists passages with deep links:

```
Referenced in:
 • Autobiography of a Yogi, Chapter 12 — "My years with Sri Yukteswar"
 • Autobiography of a Yogi, Chapter 21 — "We visit Kashmir"
 • Autobiography of a Yogi, Chapter 42 — "Last days with my guru"
```

### Place Links Strategy (Distributed Across Arcs)

No embedded map library. Each place card links out to external maps services — zero map dependencies, zero tile servers, zero maintenance. See ADR-070.

| Link | Implementation | Rationale |
|------|---------------|-----------|
| **"Get Directions"** | `geo:` URI or Apple/Google Maps link (opens native maps app) | Delegates navigation to the user's preferred app |
| **"Take a Virtual Tour"** | SRF virtual pilgrimage tour URL (opens in new tab). Available for Mother Center, Lake Shrine, Hollywood Temple, Encinitas. Uses `virtual_tour_url` column — only displayed when non-null. | SRF's narrated virtual tours are warmer and richer than Street View; preferred when available. Requires SRF to confirm canonical tour URLs (see CONTEXT.md Q110). |
| **"See This Place"** | Google Maps Street View URL (opens in new tab) | Fallback virtual visit for places without SRF tours. No tracking scripts on the portal. |
| **Visit** | SRF/YSS property page URL | e.g., "Visit → srf.org/lake-shrine" |

**Street View URL format:** `https://www.google.com/maps/@{lat},{lng},3a,75y,0h,90t/data=!3m6!1e1!3m4!1s...` — a plain link, no JavaScript, no API key. Only included for places where Street View coverage exists.

### API

```
GET /api/v1/places
Response:
{
 "places": [
 {
 "id": "uuid",
 "name": "Lake Shrine",
 "slug": "lake-shrine",
 "category": "srf_property",
 "city": "Pacific Palisades",
 "country": "US",
 "latitude": 34.0423,
 "longitude": -118.5248,
 "image_url": "...",
 "passage_count": 3
 },
 ...
 ]
}

GET /api/v1/places/[slug]
Response:
{
 "place": {
 "id": "uuid",
 "name": "Lake Shrine",
 "slug": "lake-shrine",
 "category": "srf_property",
 "description": "A ten-acre sanctuary...",
 "significance": "...",
 "address": "17190 Sunset Blvd",
 "city": "Pacific Palisades",
 "region": "California",
 "country": "US",
 "latitude": 34.0423,
 "longitude": -118.5248,
 "image_url": "...",
 "visiting_info": "Open Tuesday–Saturday, 9am–4:30pm",
 "external_url": "https://lakeshrine.org",
 "virtual_tour_url": "https://yogananda.org/...",
 "passages": [
 {
 "chunk_id": "uuid",
 "content": "The verbatim passage...",
 "book_title": "Autobiography of a Yogi",
 "chapter_title": "...",
 "chapter_number": 49,
 "page_number": 512,
 "context_note": "Yogananda describes the dedication of Lake Shrine",
 "reader_url": "/books/autobiography-of-a-yogi/49#chunk-uuid"
 }
 ]
 }
}
```

### Phasing

| Milestone | Scope |
|-----------|-------|
| **5a** | Static Sacred Places page with SRF/YSS properties. Text + images + external links + "Get Directions." "Take a Virtual Tour" links for properties with SRF virtual pilgrimage tours (Mother Center, Lake Shrine, Hollywood Temple, Encinitas). Cross-references with Autobiography passages. Convocation cross-link on LA-area SRF property cards: "This site is part of the annual SRF World Convocation pilgrimage. Learn more → convocation.yogananda.org." No maps. |
| **Distributed** | Add biographical sites (Gorakhpur, Serampore, Puri, Varanasi, Dakshineswar). "See This Place" Street View links on place cards (ADR-070). Reader ↔ Place cross-reference cards. **Indian biographical site note:** Google Street View coverage in rural India (Gorakhpur, Serampore, Ranchi) is patchy or absent. Where Street View is unavailable, commissioned photography or editorial descriptions should be the primary experience, with maps as secondary. Query YSS for photographic archives of these sites (see CONTEXT.md § Open Questions). "Get Directions" for Indian sites serves a pilgrimage context more than a driving-directions context — consider "Visit this place" framing for Indian biographical sites. |
| **Future** | Dynamic center locator (if SRF provides data). Multi-language place descriptions (Milestone 5b). |

---

## DES-025: Accessibility Requirements (Milestone 2a Foundation)

Accessibility is not a polish step — it is a theological requirement. The DELTA Dignity principle demands that every seeker, regardless of ability, can access the teachings. Building on an inaccessible foundation creates exponentially more remediation work later.

(See ADR-003 for full rationale.)

### WCAG 2.1 AA Compliance Target

The portal targets WCAG 2.1 Level AA conformance from Milestone 2a. Level AAA criteria are adopted where achievable without significant trade-offs (e.g., 7:1 contrast for body text is met by our existing token choices).

### Requirements by Category

#### Vision — Blindness and Screen Readers

| Requirement | Implementation |
|-------------|---------------|
| Semantic HTML | All pages use proper heading hierarchy (`h1`→`h2`→`h3`), `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`. No heading level skips. |
| ARIA landmarks | `role="search"` on search form, `role="banner"` on header, `role="contentinfo"` on footer, `aria-label` on all navigation regions. |
| Image alt text | All guru photographs: full name and title (e.g., "Paramahansa Yogananda, founder of Self-Realization Fellowship"). All nature images: descriptive text. Decorative images: `alt=""`. |
| Search results | Each result is an `<article>` with `aria-label` describing the passage source. "Read in context" links include `aria-label="Read this passage in context in [Book Title], Chapter [N]"`. |
| Today's Wisdom | "Show me another" button has `aria-live="polite"` region so new passage is announced. |
| Quiet Corner timer | Timer state announced via `aria-live="assertive"` when chime sounds. Visual-only chime has text equivalent: "Your meditation time is complete." |
| Book reader | Chapter navigation via `<nav aria-label="Chapter navigation">`. Table of contents as ordered list. Current chapter indicated with `aria-current="page"`. |
| Quote sharing | Share button labeled `aria-label="Copy link to this passage"`. "Link copied" confirmation announced via `aria-live="polite"`. |
| Skip navigation | "Skip to main content" link as first focusable element on every page. |

#### Vision — Low Vision and Magnification

| Requirement | Implementation |
|-------------|---------------|
| Text scaling | All text uses `rem` units. Layout does not break at 200% browser zoom. |
| Minimum text size | Body text: 18px (`--text-base`). No text smaller than 12px (`--text-xs`) and that only for non-essential labels. |
| Reflow | Content reflows to single column at narrow widths. No horizontal scrolling at 320px viewport width (WCAG 1.4.10). |
| Focus indicators | All interactive elements show a visible focus ring: `outline: 2px solid var(--srf-blue); outline-offset: 2px;`. Never `outline: none` without a replacement. |
| Target size | All clickable targets minimum 44×44px (WCAG 2.5.5 Level AAA, adopted as policy). |

#### Vision — Color Blindness

| Requirement | Implementation |
|-------------|---------------|
| Color contrast | All text meets WCAG AA minimums: 4.5:1 for normal text, 3:1 for large text (≥18pt or ≥14pt bold). |
| `--portal-text-muted` | Set to `#595959` (5.3:1 on `--portal-bg`). Corrected from original `#6B6B6B` which failed at 4.1:1. |
| `--srf-gold` | `#DCBD23` must NOT be used as text on light backgrounds (2.4:1 ratio). Use only as borders, backgrounds, or decorative accents. Gold text is permitted only on `--srf-navy` backgrounds (8.2:1). |
| Information not by color alone | Search result relevance, theme distinctions, and all status indicators use shape, text, or icons in addition to color. |

#### Hearing

| Requirement | Implementation |
|-------------|---------------|
| Video captions | YouTube embeds always load with captions enabled (`&cc_load_policy=1` parameter). Rely on YouTube's auto-captions and SRF's uploaded captions. |
| Quiet Corner chime | The timer completion chime has a visual equivalent: a gentle, full-screen pulse animation (`@media (prefers-reduced-motion: no-preference)`) or a text message ("Your time is complete") for users with `prefers-reduced-motion: reduce`. |
| Audio content | Any future audio features (text-to-speech, Arc 6 audio clips) must provide text transcripts. |

#### Motor and Mobility

| Requirement | Implementation |
|-------------|---------------|
| Full keyboard navigation | All interactive elements reachable and operable via keyboard. Logical tab order following visual layout. |
| No keyboard traps | Modal dialogs (if any) trap focus correctly and release on close. No focus traps elsewhere. |
| Quiet Corner timer | Operable entirely by keyboard: arrow keys to select duration, Enter/Space to start, Escape to cancel. |
| No time-dependent interactions | No UI elements that require fast action. The Quiet Corner timer is opt-in and user-controlled. |
| Touch targets | Minimum 44×44px for all touch targets on mobile. Adequate spacing between adjacent targets. |

#### Cognitive and Neurological

| Requirement | Implementation |
|-------------|---------------|
| `prefers-reduced-motion` | All animations and transitions respect `@media (prefers-reduced-motion: reduce)`. When active: no hover animations, no page transitions, timer chime is text-only. |
| `prefers-color-scheme` | Support `dark` scheme when the Calm Technology design system ships. Milestone 2a uses light theme only but CSS architecture supports future dark mode via custom properties. |
| `prefers-contrast` | When `more`, increase border widths and ensure all text exceeds 7:1 contrast. |
| Clear language | All UI copy at 8th-grade reading level or below. Error messages are specific and actionable ("No passages found for this search. Try different words." not "Error 404"). |
| Consistent navigation | Header and footer identical on every page. No layout shifts between pages. |
| Reading mode | Milestone 2a: clean reader with generous whitespace. Calm technology design system: adjustable font size, sepia/dark mode. |

#### ADR-072: Cognitive Accessibility — Beyond WCAG Minimums

WCAG 2.1 AA covers minimum cognitive requirements (consistent navigation, error identification, reading level for labels). The portal's mission — serving seekers worldwide, including those in crisis — demands going further.

| Requirement | Implementation |
|-------------|---------------|
| Progressive homepage disclosure | First visit (sessionStorage) shows simplified above-the-fold: Today's Wisdom + search bar + "Or explore a theme" link. Thematic doors, "Seeking..." entries, and videos are below the fold. Return visits show the full homepage. |
| Passage accessibility classification | Passages tagged during ingestion QA: `accessible` (short, clear, affirmation-like), `moderate` (standard prose), `dense` (philosophical, multi-clause). Used internally for pool selection — never displayed. Today's Wisdom favors `accessible`; Quiet Corner uses only `accessible`. |
| Simplified reading mode ("Focus") | Optional toggle in reader header (Milestone 2b). Reduces reader to: reading column + Next Chapter. Related Teachings panel, keyboard shortcuts, dwell icon, and bookmark icon suppressed. Stored in `localStorage`. |
| Minimal gesture vocabulary for core tasks | The portal's essential experience (read, search, navigate) requires only: click, scroll, type. All other gestures (long-press, hover-wait, keyboard shortcuts) are enhancements. Explicitly tested in QA. |
| Decision fatigue reduction | Non-search pages follow the single-invitation principle (ADR-067): each endpoint invites exactly one step deeper, never more. |

#### ADR-073: Screen Reader Emotional Quality

The warm cream background and gold accents do nothing for blind seekers. The spoken language of ARIA labels is their entire aesthetic. Standard markup produces functional but emotionally flat output. The portal's screen reader voice carries the same warmth as its visual design.

| Element | Standard markup | Portal standard |
|---------|----------------|-----------------|
| Search region | "Search" | "Search the teachings" |
| Today's Wisdom section | "Today's Wisdom" | "Today's Wisdom — a passage from Yogananda's writings" |
| Quiet Corner page | "Main content" | "The Quiet Corner — a space for stillness" |
| Dwell mode enter | "Passage focused" | "Passage focused for contemplation" |
| Dwell mode exit | "Passage unfocused" | "Returned to reading" |
| Search results count | "5 results" | "Five passages found" |
| Theme page | "Theme: Courage" | "Teachings on Courage — passages from across the library" |
| Empty bookmarks | "No items" | "You haven't marked any passages yet" |
| Timer start | "Timer started: 5:00" | "The timer has begun. Five minutes of stillness." |
| Timer end | "Timer complete" | "The time of stillness is complete." |

**Passage citations read naturally.** Screen reader output flows as speech: "'The soul is ever free; it is deathless, birthless...' — from Autobiography of a Yogi, Chapter 26, page 312." Uses `aria-label` on passage containers for natural reading while visual HTML retains its formatting.

**Testing criterion:** Milestone 2a screen reader testing (VoiceOver, NVDA, TalkBack) evaluates not only "can the seeker navigate and read" but also "does the experience carry warmth and contemplative quality."

#### Performance as Accessibility (Global Equity Principle)

| Requirement | Implementation |
|-------------|---------------|
| Initial page load | < 100KB JavaScript for the full app shell (compressed). Homepage stricter: < 50KB initial payload (HTML + critical CSS + inline JS) per ADR-006. Target: First Contentful Paint < 1.5s on 3G. |
| Core Web Vitals | LCP < 2.5s, FID < 100ms, CLS < 0.1. |
| Progressive enhancement | Core reading and search functionality works without JavaScript (server-rendered HTML). JS enhances: "Show me another", infinite scroll, timer. |
| Low-bandwidth support | All images lazy-loaded. Responsive images via `srcset`. No autoplay video. Homepage functional as text-only. `/browse` page (DES-047) designed text-first as < 20KB offline-cacheable portal index — the universal fallback for 2G, feature phones, and screen readers. |
| Offline resilience | Milestone 2a: service worker caches the Quiet Corner page and current reading position. Full PWA when progressive web app readiness ships (ADR-012). |

### Accessibility Testing Strategy

| Method | When | Tool |
|--------|------|------|
| Automated audit | Every build (CI) | axe-core via `@axe-core/react` or Lighthouse CI |
| Manual keyboard testing | Every new component | Developer checklist |
| Screen reader testing | Before each milestone release | VoiceOver (macOS), NVDA (Windows) |
| Color contrast validation | Design token changes | Chrome DevTools, WebAIM Contrast Checker |
| Real-user testing | When Calm Technology design system ships | Engage accessibility testers (consider SRF community members with disabilities) |

---

## DES-028: Calendar-Aware Content Surfacing

The `daily_passages` pool already supports optional seasonal weighting. Calendar-aware surfacing extends this with explicit date-to-passage associations, connecting the portal's daily experience to moments that carry spiritual significance.

### Calendar Events

| Category | Examples | Passage Source |
|----------|----------|---------------|
| **Yogananda's life** | Birth anniversary (Jan 5), Mahasamadhi (Mar 7), Arrival in America (Sep 19) | Editorially curated passages about each event |
| **Indian festivals** | Makar Sankranti, Diwali, Janmashtami, Navaratri, Durga Puja | Passages on light/darkness, divine love, Krishna, Divine Mother |
| **Christian (Western)** | Christmas (Dec 25), Easter (Western date) | Yogananda wrote extensively about Christ — rich corpus |
| **Christian (Orthodox)** | Christmas (Jan 7), Easter (Orthodox date) | Same corpus, different calendar dates |
| **Buddhist** | Vesak, Dharma Day | Passages on meditation, consciousness, non-attachment |
| **Interfaith / contemplative** | Jewish High Holy Days (if Yogananda references), Sufi observances | Passages where Yogananda engages with other traditions |
| **Universal observances** | International Day of Peace, World Meditation Day | Passages on peace, meditation |

**Taxonomy note:** The previous four-category scheme (`yogananda_life`, `hindu`, `christian`, `universal`) was reductive — "Hindu" collapsed dozens of distinct traditions (Shaivism, Vaishnavism, Shakta) and excluded observances from traditions the worldview pathways (DES-048) explicitly address. The expanded taxonomy uses `indian_festival` (acknowledging the cultural rather than sectarian framing), distinguishes Western and Orthodox Christian dates, and adds `buddhist` and `interfaith` categories. Whether to include Buddhist, Jewish, or Islamic observances is an editorial scope question for SRF — see CONTEXT.md § Open Questions (Stakeholder).

### Schema

```sql
-- ============================================================
-- CALENDAR EVENTS (date-to-passage associations — Milestone 3b+)
-- ============================================================
CREATE TABLE calendar_events (
 id UUID PRIMARY KEY DEFAULT uuidv7(),
 name TEXT NOT NULL, -- "Mahasamadhi Anniversary"
 description TEXT, -- brief context
 month INTEGER NOT NULL, -- 1–12
 day INTEGER NOT NULL, -- 1–31
 category TEXT NOT NULL, -- 'yogananda_life', 'indian_festival', 'christian_western', 'christian_orthodox', 'buddhist', 'interfaith', 'universal'
 is_active BOOLEAN NOT NULL DEFAULT true,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE TABLE calendar_event_passages (
 id UUID PRIMARY KEY DEFAULT uuidv7(),
 event_id UUID NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
 chunk_id UUID NOT NULL REFERENCES book_chunks(id) ON DELETE CASCADE,
 position INTEGER, -- optional ordering
 UNIQUE (event_id, chunk_id)
);
```

### Integration

When today matches a calendar event, the homepage "Today's Wisdom" draws from the calendar pool instead of (or in addition to) the general daily pool. The calendar event name appears as a subtle subtitle below the passage: *"On this day in 1920, Yogananda arrived in Boston."*

This aligns with "Signpost, not destination" — the portal meets seekers where they already are (their calendar, their holidays) and connects them to Yogananda's perspective on those moments.

---

## ADR-082: Staff Experience Architecture — Five-Layer Editorial System

The portal's "human review as mandatory gate" principle creates significant staff-facing workflow requirements. Theme tags, tone classifications, accessibility ratings, calendar associations, translation drafts, social media assets, and ingestion QA flags all require human approval. The staff experience is a primary product concern — the speed and quality of editorial review directly determines how quickly new content reaches seekers.

### Guiding Principle

**Staff should think about the teachings, not the technology.** The same Calm Technology philosophy that governs the seeker experience applies to the staff experience. A monastic editor reviewing whether a passage about inner peace is correctly tagged should work in an environment that respects the material — not a generic data grid.

### Staff & Organizational Personas

The portal is maintained by a broader organizational ecosystem than just "staff." Each persona has different schedules, technical comfort, and workflow needs. The admin portal, editorial tools, and operational procedures must serve all of them.

#### Core Staff Personas

| Persona | Schedule | Technical Comfort | Primary Tool | Key Need |
|---|---|---|---|---|
| **Monastic content editor** | 2–3 hour windows between meditation and services | Variable | Admin portal + Contentful | Session resume; complete meaningful work in 30 minutes; warm UI that feels like service, not administration |
| **Theological reviewer** | Periodic, high-stakes | Low to moderate | Admin portal (review queue only) | "Preview as seeker" with full chapter context; ability to defer decisions without blocking the queue; persistent theological notes across sessions |
| **AE social media staff** | Daily, 20–30 min | Moderate | Admin portal (asset inbox) | Weekly lookahead with batch-approve; platform-specific captions; assets ready to post, not raw material to assemble |
| **Translation reviewer** | Batch sessions, 40–100 strings | Moderate (may be volunteer) | Admin portal (translation review) | Screenshot context for each string; tone guidance; ability to suggest alternatives without outright rejecting |
| **AE developer** | As needed | High | Retool + Neon console | Clear runbooks; Sentry/New Relic dashboards separated from other SRF properties; infrastructure-as-code matching SRF Terraform patterns |
| **Leadership (monastic)** | Monthly or quarterly | Low | Impact dashboard (read-only) | Ability to express editorial priorities ("emphasize courage this quarter") without entering the admin system; pre-formatted reports for the philanthropist's foundation |

#### Operational Personas (Not Yet Staffed)

| Persona | Schedule | Technical Comfort | Primary Tool | Key Need |
|---|---|---|---|---|
| **Portal coordinator** | Regular | Moderate | Admin portal (pipeline dashboard) | Cross-queue visibility: content pipeline status (books in queue/ingestion/QA/published), editorial queue health (backlog depth across all review types), VLD activity, upcoming calendar events. Not Jira — purpose-built for editorial state. |
| **Book ingestion operator** | Per-book (1–2 days per cycle) | Moderate to high | Ingestion CLI + admin portal | Guided ingestion workflow: upload source → automated processing → flagged review → human QA → approve-and-publish. Side-by-side source PDF and extracted text. Per-chapter re-run capability. |
| **VLD coordinator** | Weekly | Moderate | Admin portal (VLD section) | Creates curation briefs, monitors submission quality, manages trusted submitter status, communicates with VLD members. May be the portal coordinator or a separate role. |

#### Volunteer Personas

| Persona | Schedule | Technical Comfort | Primary Tool | Key Need |
|---|---|---|---|---|
| **VLD curation volunteer** | Flexible, service-oriented | Variable (possibly low) | Admin portal (VLD dashboard) + Study Workspace | Clear, self-contained tasks with completion criteria; session save-and-resume; warm onboarding framing work as devotional service; constructive feedback on submissions |
| **VLD translation volunteer** | Batch sessions | Variable | Admin portal (translation review) | Embedded glossary sidebar; "I'm not sure" flag without blocking progress; pairing with experienced reviewer for first batch |
| **VLD theme tag reviewer** | Short sessions | Variable | Admin portal (theme review) | Training examples for each theme; side-by-side passage + theme descriptions; "escalate to monastic reviewer" option |
| **VLD feedback triager** | Flexible | Variable | Admin portal (feedback queue) | Pre-categorized feedback with AI reasoning; confirm/reclassify; flag items for staff |
| **VLD content QA reviewer** | Per-assignment | Moderate | Admin portal (QA review) | Compare portal text against physical book; report discrepancies. Requires access to physical books (many VLD members own them). |

#### External Personas

| Persona | Schedule | Technical Comfort | Primary Tool | Key Need |
|---|---|---|---|---|
| **Philanthropist's foundation** | Quarterly or annually | Low | Impact report (PDF/web) | Pre-formatted, narrative impact report they can share with their board. Generated from Impact Dashboard data, curated into a story. No work required. |
| **Study circle leader** | Weekly preparation | Moderate | Study Workspace + community collections | Find → collect → arrange → share → present. Power seeker of community collections and shared links. Weekly satsanga preparation is the primary use case. |

**Study circle leader — expanded profile:** This is the portal's most demanding external seeker and the primary driver for Arc 6 (Study Workspace) and Milestone 7b (Community Curation) features. The weekly satsanga preparation workflow is: (1) identify a theme or topic for the week, (2) search and browse for relevant passages across multiple books, (3) collect passages into an ordered sequence that builds understanding, (4) add brief contextual notes for group discussion, (5) share the collection with group members via link, (6) present during satsanga using Presentation mode (ADR-006 §5). Until Arc 6, this seeker uses browser bookmarks, manual note-taking, and shared passage links — functional but friction-heavy. The study circle leader also serves as an informal portal evangelist, introducing the portal to group members who may become daily visitors, devoted practitioners, or Quiet Corner seekers. In Indian and Latin American contexts, the study circle leader may be the primary interface between the portal and seekers who are less digitally literate — they project the portal on a shared screen or read passages aloud. Presentation mode's early delivery (consider pulling to Milestones 2b–3a per CONTEXT.md technical open question) directly serves this population.

**Staffing open question:** Several operational personas (portal coordinator, book ingestion operator, VLD coordinator) are not yet assigned. SRF must determine whether these are monastic roles, AE team roles, or dedicated positions before Milestone 3b begins. See CONTEXT.md § Open Questions (Stakeholder).

### The Editorial Review Portal (`/admin`)

A custom-built section of the Next.js application, protected by Auth0, built with the portal's own design system.

#### Auth0 Roles

| Role | Access |
|---|---|
| `editor` | Theme tag review, daily passage curation, calendar event management, content preview, ingestion QA |
| `reviewer` | Theological review queue (final approval tier) |
| `translator:{locale}` | Translation review for a specific language only |
| `social` | Social media asset review and download |
| `updates` | Portal update note review and publication (ADR-105) |
| `admin` | All editorial functions + user management |
| `leadership` | Impact dashboard (read-only) |

#### Editorial Home Screen

When a staff member logs in, they see a personalized summary filtered by their role:

```
┌─────────────────────────────────────────────────────────────┐
│ SRF Teaching Portal — Editorial Home │
│ │
│ Good morning. Here's what needs your attention: │
│ │
│ ┌────────────────────────┐ ┌────────────────────────────┐ │
│ │ Theme Tags │ │ Daily Passages │ │
│ │ 23 awaiting review │ │ Pool: 412 passages │ │
│ │ ○ Peace (8 new) │ │ Next 7 days: ✓ │ │
│ │ ○ Courage (6 new) │ │ │ │
│ │ ○ Healing (9 new) │ │ │ │
│ └────────────────────────┘ └────────────────────────────┘ │
│ │
│ ┌────────────────────────┐ ┌────────────────────────────┐ │
│ │ QA Flags │ │ Calendar Events │ │
│ │ 0 pending │ │ Next: Mahasamadhi (Mar 7) │ │
│ │ All clear ✓ │ │ 12 passages linked │ │
│ └────────────────────────┘ └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Review Workflows

**Theme tag review** (Milestone 3b):
```
┌─────────────────────────────────────────────────────────────┐
│ Theme: Peace — Review Candidates (8 of 23) │
│ │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ "Be as simple as you can be; you will be astonished ││
│ │ to see how uncomplicated and happy your life can ││
│ │ become." ││
│ │ ││
│ │ — Autobiography of a Yogi, Ch. 12, p. 118 ││
│ │ ││
│ │ Similarity: 0.72 │ AI confidence: High ││
│ │ ││
│ │ [a] Approve [r] Reject [▾] Adjust relevance ││
│ └─────────────────────────────────────────────────────────┘│
│ │
│ Progress: ████████░░░░░░░░ 8/23 reviewed │
│ Session: resumed from yesterday │
└─────────────────────────────────────────────────────────────┘
```

Keyboard-driven: `a` approve, `r` reject, `→` next, `←` previous. Session position saved — resume where you left off tomorrow.

**Social media asset review** (Milestone 5a):
```
┌─────────────────────────────────────────────────────────────┐
│ Tomorrow's Passage — Review │
│ │
│ ┌──────────┐ ┌──────────┐ ┌────────────────────┐ │
│ │ │ │ │ │ │ │
│ │ 1:1 │ │ 9:16 │ │ 16:9 │ │
│ │ Square │ │ Story │ │ Landscape │ │
│ │ │ │ │ │ │ │
│ └──────────┘ └──────────┘ └────────────────────┘ │
│ │
│ Caption: │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ "Be as simple as you can be..." ││
│ │ — Paramahansa Yogananda, Autobiography of a Yogi ││
│ │ Read more: teachings.yogananda.org/passage/abc123 ││
│ │ [Edit] ││
│ └─────────────────────────────────────────────────────────┘│
│ │
│ Download: [Instagram] [Facebook] [Story] [Landscape] │
│ Mark posted: □ Instagram □ Facebook □ Twitter │
└─────────────────────────────────────────────────────────────┘
```

**Translation review** (Milestone 5b):
```
┌─────────────────────────────────────────────────────────────┐
│ German Translation Review — 14 strings remaining │
│ │
│ ┌──────────────────────┬──────────────────────────────────┐│
│ │ English (source) │ German (AI draft) ││
│ ├──────────────────────┼──────────────────────────────────┤│
│ │ "What are you │ "Wonach suchen Sie?" ││
│ │ seeking?" │ ││
│ │ │ Context: Search bar placeholder ││
│ │ │ ││
│ │ │ [✓ Approve] [Edit] [Flag] ││
│ └──────────────────────┴──────────────────────────────────┘│
│ │
│ Progress: ████████████░░░░ 26/40 reviewed │
└─────────────────────────────────────────────────────────────┘
```

**Portal update review** (Milestone 3b):
```
┌─────────────────────────────────────────────────────────────┐
│ Portal Update — Review                     AI-drafted       │
│                                                             │
│ Season: Spring 2027                                         │
│ Triggered by: deploy v3.2.0 (2027-04-15)                   │
│                                                             │
│ Title:                                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ The Library has grown                        [Edit]     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Summary:                                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Three new books join the collection: Man's Eternal      │ │
│ │ Quest, The Divine Romance, and Journey to               │ │
│ │ Self-Realization.                             [Edit]     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Category: new_content                                       │
│                                                             │
│ [✓ Approve & Publish] [Edit] [Discard]                      │
└─────────────────────────────────────────────────────────────┘
```

### Contentful Custom Apps (Sidebar Panels)

Lightweight React panels that appear in Contentful's entry editor sidebar, keeping editors contextually aware:

| Panel | Appears On | Shows |
|---|---|---|
| **Theme tags** | TextBlock entries | Current tags for this passage, pending review count, link to review queue |
| **Thread preview** | Editorial thread entries | Live reading flow preview — passages in sequence with transition notes |
| **Calendar passages** | Calendar event entries | Associated passages with relevance context, link to manage associations |
| **Topic readiness** | Teaching topic entries | Passage count, review status, publication readiness indicator |

### Notification Strategy

| Channel | Audience | Frequency | Content |
|---|---|---|---|
| **Email digest** | All editorial staff | Daily (configurable) | "12 new theme tag candidates, 3 QA flags, next week's passages ready for review." Direct links to review queues. |
| **Portal badges** | Staff who visit `/admin` | On each login | Count badges on editorial home screen |
| **No notification** | Leadership | Pull-based | They visit `/admin/impact` when they choose |

Email digest is the primary channel. Generated by a scheduled serverless function querying review queue counts from Neon.

### Technical Implementation

The admin portal is **not a separate application.** It is a route group within the existing Next.js app:

```
/app/
 admin/
 layout.tsx ← Auth0 protection, admin nav, calm design shell
 page.tsx ← Editorial home (role-filtered summary)
 themes/
 [slug]/page.tsx ← Theme tag review queue
 passages/
 page.tsx ← Daily passage curation
 calendar/
 page.tsx ← Calendar event management
 social/
 page.tsx ← Social media asset review
 translations/
 [locale]/page.tsx ← Translation review (per language)
 qa/
 page.tsx ← Ingestion QA review
 impact/
 page.tsx ← Leadership impact dashboard
 preview/
 themes/[slug]/page.tsx ← "Preview as seeker" for themes
 passages/page.tsx ← Preview daily passage selection
```

Business logic lives in `/lib/services/` (consistent with ADR-011). The admin routes are thin presentation layers over:
- `/lib/services/review.ts` — review queue queries, approval/rejection
- `/lib/services/curation.ts` — daily passage selection, calendar management
- `/lib/services/social.ts` — asset generation, caption management
- `/lib/services/updates.ts` — portal update draft generation, review, publication (ADR-105)
- `/lib/services/translation.ts` — translation review, locale progress tracking
- `/lib/services/impact.ts` — aggregated metrics for leadership dashboard
- `/lib/services/collections.ts` — community collections, visibility management, submission pipeline (ADR-086)
- `/lib/services/graph.ts` — knowledge graph queries, subgraph extraction, cluster resolution (ADR-062)
- `/lib/mcp/` — MCP server (three-tier corpus access layer, ADR-101): `server.ts` (tier routing, auth), `tools/corpus.ts`, `tools/editorial.ts`, `tools/graph.ts`, `tools/people.ts`, `tools/fidelity.ts` (external envelope wrapper). All tools delegate to `/lib/services/` — zero business logic in the MCP layer.

### Milestone Delivery

| Milestone | Staff Experience Work |
|---|---|
| **3b** | Minimal admin portal: editorial home, theme tag review, daily passage curation, calendar event management, content preview, tone/accessibility spot-check, portal update review (ADR-105). Auth0 integration. Email digest. |
| **5a** | Social media asset review added. |
| **3b** | Contentful Custom Apps (sidebar panels). Full editorial workflow bridging Contentful authoring and portal review queues. (Contentful available from Arc 1; Custom Apps ship with editorial portal.) |
| **5b** | Translation review UI. Volunteer reviewer access with scoped permissions (`translator:{locale}`). |
| **5b+** | Impact dashboard for leadership. |
| **7b** | VLD dashboard, curation briefs, trusted submitter workflow. VLD expansion to translation, theme tag, feedback, and QA tiers (as VLD capacity and SRF governance allow). |

---

## DES-040: Design Tooling

The portal uses a **code-first design process** during AI-led arcs, with Figma as a collaboration mirror. See ADR-096.

### Arcs 1–5: Code-First (AI-Led)

Design emerges through code iteration: generate CSS/components from DESIGN.md tokens, render in browser and Storybook, evaluate, refine. The browser rendering is the design artifact.

```
DESIGN.md specs (source of truth)
 │
 ▼
 Claude generates components + tokens.json
 │
 ▼
 tailwind.config.ts imports tokens
 │
 ▼
 Components rendered in browser + Storybook (Milestone 1b+)
 │
 ▼
 Figma updated from tokens.json (collaboration mirror, Milestone 2a)
```

Three Figma design files document the core screens *after* they exist in code:

| File | Screens |
|------|---------|
| **Portal — Home & Search** | Homepage (Today's Wisdom, search bar, theme doors, videos), search results, passage share view |
| **Portal — Reader & Content** | Book reader, chapter navigation, Sacred Places, Events, About |
| **Portal — Quiet & Utility** | Quiet Corner, error states, email subscription flow, language selector |

### Human Designers Active: Figma-First

When human designers join, the pipeline inverts. Figma becomes the upstream source:

```
Figma design tokens (via Figma Tokens plugin)
 │
 ▼
 tokens.json (committed to repo)
 │
 ▼
 tailwind.config.ts imports tokens
 │
 ▼
 Components use Tailwind classes
 │
 ▼
 Storybook documents components
```

Changes to design tokens in Figma propagate to `tokens.json`, which updates `tailwind.config.ts`, which is reflected in all components. The design language stays synchronized between design and code.

### Calm Technology Design System

When the shared component library begins, Figma Professional ($15/editor/month) enables:
- Shared component library with variants
- Design system documentation alongside Storybook
- Branching for design exploration
- Multi-property reuse (portal, convocation site, future SRF projects)

*Section revised: 2026-02-23, code-first design process for AI-led arcs (ADR-096 revision).*

---

## DES-042: Glossary Architecture

The spiritual terminology bridge (`/lib/data/spiritual-terms.json`, ADR-051) is surfaced as a user-facing glossary. See ADR-038. Sanskrit display and search normalization policy in ADR-080.

### ADR-080: Glossary Schema Extensions

The `glossary_terms` table (defined in ADR-038) gains three optional columns for Sanskrit and spiritual terminology support:

- **`phonetic_guide`** — Simplified pronunciation guide (e.g., "PRAH-nah-YAH-mah" for prāṇāyāma). Editorially written, based on standard Sanskrit phonology. Ships with Milestone 3b glossary.
- **`pronunciation_url`** — URL to an SRF-approved audio pronunciation recording. Nullable; populated when SRF provides recordings (Milestone 5b+). Stakeholder question pending.
- **`has_teaching_distinction`** — Boolean flag for terms where Yogananda's usage intentionally differs from common usage and the difference itself is part of the teaching (e.g., Aum vs. Om, "meditation," "Self-realization"). When true, the glossary UI highlights the distinction as pedagogically significant.

### Glossary API Endpoints

```
GET /api/v1/glossary → All glossary terms (paginated, cursor-based)
 ?language=en — Filter by language
 ?category=sanskrit — Filter by category
 ?q=samadhi — Search within glossary (trigram fuzzy)
 ?has_teaching_distinction=true — Filter to terms with teaching distinctions

GET /api/v1/glossary/{slug} → Single term with definition, Yogananda's explanation passage,
 phonetic guide, and pronunciation URL (if available)
```

### Glossary Page Layout

```
/glossary → Glossary landing
├── Search bar ("Find a term...")
├── Category filter (Sanskrit, Yogic Concepts, Spiritual States, Scriptural, Cosmological, Practice)
├── Alphabetical term list
│ ├── Term + phonetic guide (if available) + brief definition (1-2 sentences)
│ ├── 🔊 Pronunciation (if audio available — Milestone 5b+)
│ ├── "Yogananda's explanation →" link to source passage
│ ├── ⚡ Teaching distinction callout (if has_teaching_distinction)
│ │ └── "Yogananda's usage differs from common usage..." with explanation
│ └── Related theme links
└── Inline reader integration (opt-in via reader settings: "Show glossary terms")
 └── Dotted underline on recognized terms → tooltip with definition
```

---

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
│ People Library. │
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

**Global Equity (ADR-006).** The exploration view is HTML-first — sub-theme groupings are semantic `<section>` elements with heading hierarchy, not JavaScript-dependent interactive widgets. The full exploration renders without JavaScript. Progressive enhancement adds expand/collapse for passage groups, smooth scroll to sections, and keyboard-driven group navigation (DES-013). Performance budget: exploration response renders within the existing FCP < 1.5s target; passage groups beyond the first two are lazy-loaded to keep initial payload under the 50KB homepage budget for the exploration entry point.

**Screen reader experience (ADR-073).** Each sub-theme group is an ARIA landmark region with a descriptive label. The "Across the Library" section provides an audio-friendly summary of corpus distribution — the screen reader user hears the library's breadth before diving into individual passages. "Terms You May Encounter" links each term to the glossary with `aria-describedby` for inline definitions.

**Multilingual (ADR-075).** Exploration works in any language the corpus supports. If the seeker's locale has fewer passages on a topic, the exploration is honest about coverage: "The library holds 3 passages on this theme in Hindi. The English collection holds 17." The seeker can toggle to English or explore what's available — never a degraded or empty experience.

**`/guide` page integration.** The exploration input appears after the curated pathways, as a natural deepening. The curated pathways serve seekers who arrive with a general need ("I'm dealing with loss"); the exploration serves seekers who arrive with a specific curiosity ("What did Yogananda teach about the astral body?"). The page flow: (1) need-based pathways, (2) worldview pathways, (3) life-phase pathways, (4) Practice pathway, (5) a transition — "Or explore the library yourself" — with an input field and suggested starting points. The exploration input is not a search bar (the header already has one); it's positioned and styled as a continuation of the guide — the librarian saying "those were my recommendations; now tell me what *you're* looking for." Visually: same warm background, same typography, no chrome that suggests a different mode.

**Technique boundary (ADR-104, Principle 3).** Queries about meditation technique — Kriya Yoga, Hong-Sau, AUM meditation, Energization Exercises — receive Practice Bridge behavior, not exploration results. The same search intent classification (ADR-005 E1) that governs the search endpoint governs the exploration endpoint. When the classifier detects a technique query, the exploration response includes the Practice pathway content (see § Practice Pathway above) instead of passage groupings. The seeker sees Yogananda's *published descriptions* of the practice path, the Quiet Corner, and the SRF Lessons link — never technique instruction, never a collection of passages that could be assembled into a how-to guide. This is the exploration's only editorial override: one class of query gets redirected to the pastoral response rather than the library's holdings.

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

**Milestone:** 3b (requires enrichment pipeline operational, theme taxonomy populated, chunk relations computed). The exploration degrades gracefully before full enrichment: with only search and basic theme tags (Milestone 1b), the exploration returns a flat list grouped by book — still useful, just less structured. Full sub-theme grouping arrives when the enrichment pipeline (ADR-115) is operational.

---

## DES-049: Responsive Design Strategy

The portal's breakpoints (DES-015) define four viewport tiers. This section consolidates the responsive behavior of every major component into a single reference, ensuring consistent layout decisions across the codebase. It also addresses interaction modality, orientation, and print — dimensions that viewport width alone does not capture.

### Breakpoint Behavior Matrix

| Component | Mobile (≤639px) | Tablet (640–1023px) | Desktop (≥1024px) | Wide (≥1280px) |
|-----------|----------------|--------------------|--------------------|----------------|
| **Navigation** | Hamburger menu | Hamburger menu (≤768px) or condensed horizontal nav (>768px) | Full horizontal nav | Full horizontal nav |
| **Search results** | Full-width stacked cards | Full-width stacked cards, wider citation line | Two-column card grid or single-column with side metadata | Two-column with side metadata |
| **Book reader** | Single column, full-width text | Single column with wider margins; landscape: consider two-column (see Orientation below) | Single column with generous margins, Related Teachings side panel visible | Reader centered at `--bp-max-content`, side panel always visible |
| **Quiet Corner** | Centered vertical layout, affirmation fills viewport | Centered with more breathing room; timer controls inline | Horizontal layout option: affirmation left, timer right | Same as desktop, max-width constrained |
| **Today's Wisdom** | Stacked: passage card, then theme chips below | Passage card with theme chips inline | Passage card with theme chips and "Show me another" inline | Same as desktop |
| **Theme pages** | Single-column passage list | Two-column passage card grid | Two-column grid with theme description sidebar | Three-column grid at `--bp-wide` |
| **Knowledge Graph** | 2-hop subgraph, max ~500 nodes, touch-optimized (ADR-062) | Full graph with cluster-first loading | Full graph, hover tooltips | Full graph at native resolution |
| **Presentation mode** | Text 24px+, full viewport, swipe navigation | Text 28px+, full viewport | Text 32px+, arrow-key navigation | Text 36px+, centered reading column |

### Interaction Modality Detection

Viewport width is an unreliable proxy for interaction capability. A tablet with a keyboard case behaves like a desktop; a touchscreen laptop behaves like a tablet. The portal uses CSS media features for interaction-dependent behavior:

```css
/* Hover-dependent interactions (dwell icon reveal, tooltip previews) */
@media (hover: hover) and (pointer: fine) {
  /* Desktop-class: show hover affordances */
}

/* Touch-primary interactions (long-press dwell, native share) */
@media (hover: none) and (pointer: coarse) {
  /* Touch-class: show touch affordances, enlarge tap targets */
}

/* Hybrid devices (touchscreen laptops) — favor touch affordances */
@media (hover: hover) and (pointer: coarse) {
  /* Show both hover and touch affordances */
}
```

**Component implications:**
- **Dwell mode:** Hover-icon trigger for `(hover: hover) and (pointer: fine)`. Long-press for `(pointer: coarse)`. Both available on hybrid devices. (Extends DES-009)
- **Share menu:** `navigator.share` (native sheet) for `(pointer: coarse)`. Custom share menu for `(pointer: fine)`. (Extends ADR-024)
- **Glossary terms:** Hover tooltip for `(hover: hover)`. Tap-to-reveal for `(hover: none)`. (Extends DES-042)
- **Touch targets:** 44×44px minimum always. 48px minimum on `(pointer: coarse)` for key navigation and form inputs. (ADR-003, ADR-006 §2)

### Orientation Handling

The portal does not lock orientation. Layout adapts:

| Context | Portrait | Landscape |
|---------|----------|-----------|
| **Phone reader** | Single column, full width | Single column with wider margins. Text line length capped at `--bp-max-content` equivalent (prevents excessively long lines). |
| **Tablet reader** | Single column with generous margins | Two-column option: chapter text left, Related Teachings / footnotes right. Opt-in via reader settings (stored in `localStorage`). |
| **Presentation mode** | Vertical: passage centered | Landscape preferred for group reading. Text fills viewport width with proportionally larger font. |
| **Quiet Corner** | Vertical: affirmation above timer | Horizontal: affirmation left, timer right. More spacious for meditation posture with device propped landscape. |
| **Knowledge Graph** | Taller viewport, more vertical spread | Wider viewport, more horizontal spread. Graph physics adapts. |

### Print Stylesheet

Book content is the most likely print target — seekers in the Global South may print chapters at cybercafés, and study groups may print passages for discussion. Print stylesheets load only when `@media print` matches (zero cost during normal browsing, per ADR-006 §1).

```css
@media print {
  /* Typography */
  body { font-family: 'Merriweather', Georgia, serif; font-size: 12pt; line-height: 1.6; color: #000; }

  /* Layout: single column, no chrome */
  nav, footer, .share-menu, .dwell-icon, .search-bar,
  .related-teachings, .theme-chips { display: none; }

  /* Citations: always visible, never truncated */
  .citation { font-size: 10pt; font-style: italic; }

  /* Page headers/footers */
  @page { margin: 2cm; }
  @page :first { margin-top: 3cm; } /* extra top margin for chapter title */

  /* Attribution */
  .print-footer::after {
    content: "From teachings.yogananda.org — Paramahansa Yogananda's published teachings, freely available worldwide.";
    display: block; font-size: 9pt; margin-top: 2em; color: #595959;
  }

  /* URL display for links */
  a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 9pt; }

  /* Page breaks: never inside a passage, always before chapter titles */
  .passage-card { break-inside: avoid; }
  h2 { break-before: page; }
}
```

### Tablet as First-Class Reading Surface

Tablets are arguably the ideal form factor for sustained book reading — larger than a phone, more portable than a laptop, usable in bed, in a garden, or at a study group. The portal treats tablet as a distinct experience tier, not an interpolation between mobile and desktop:

- **Reader margins** are wider than mobile (the text should not feel cramped) but narrower than desktop (no wasted whitespace on a 10" screen). Target: 48px margins at 768px width, scaling to 64px at 1023px.
- **Related Teachings** panel: bottom sheet on portrait tablet (matches mobile pattern). Side panel on landscape tablet (matches desktop pattern). The orientation transition is the natural breakpoint, not the viewport width.
- **Two-column reader in landscape** is an opt-in setting (reader settings popover), not a default. Some seekers prefer single-column regardless of viewport. Stored in `localStorage`.
- **Touch targets** remain 44×44px minimum (not enlarged to 48px like feature-phone pages) — tablet touch precision is closer to desktop than to a 4" phone screen.

### Automatic Low-Bandwidth Suggestion

ADR-006 §1 specifies a text-only mode toggle. DES-049 extends this with an automatic suggestion:

When `navigator.connection.effectiveType` reports `'2g'` or `'slow-2g'`, the portal displays a one-time suggestion banner (not a modal): *"Your connection appears slow. Switch to text-only mode for a faster experience?"* with Accept / Dismiss. Dismissed preference stored in `sessionStorage` (resets per session, allowing re-suggestion if conditions change). The banner uses the portal's warm cream palette, not an alert style. Never forced — always a suggestion.

### Future Considerations

- **Foldable devices:** Samsung Galaxy Fold, Pixel Fold present a "phone when folded, tablet when open" form factor. The portal's responsive breakpoints handle this naturally (viewport width changes on fold/unfold), but the fold crease bisecting two-column layouts is a concern. Monitor CSS `env(fold-left)` / `env(fold-right)` proposals (CSS Viewport Segments specification). No action needed until foldable market share warrants testing.
- **Smart displays:** Google Nest Hub, Amazon Echo Show — natural surfaces for "Show me today's wisdom." The API-first architecture (ADR-011) and structured data (ADR-043 JSON-LD) enable this without portal-side changes. A smart display integration would be a new API consumer, not a new responsive breakpoint.
- **TV / casting:** Presentation mode (ADR-006 §5) is designed as a "digital lectern." A phone casting to a TV via Chromecast or AirPlay is the most natural home-satsang implementation. The 10-foot UI paradigm (large text, no hover, D-pad navigation) differs from all current breakpoints. If demand emerges, a `data-mode="cast"` CSS mode alongside `data-mode="present"` could serve this with minimal code.

---

### ADR-043, ADR-061, ADR-062: `/explore` — Knowledge Graph and Passage Constellation

Interactive visual map of the entire teaching corpus. Three visualization modes, evolving across milestones. The graph is the portal's universal navigation layer — every node is clickable, navigating to the corresponding page.

**Mode 1: Knowledge Graph** (ADR-061, ADR-062) — Node-edge visualization showing relationships between all content types: passages, themes, people, places, concepts, and every media format. Pre-computed graph JSON, client-side rendering. Evolves from book-only (Milestone 3d) to full cross-media (Arc 6+).

**Mode 2: Passage Constellation** — A 2D spatial exploration where passages are positioned by semantic similarity, derived from embedding vectors reduced to two dimensions (UMAP or t-SNE, pre-computed at build time).

**Mode 3: Concept Map** (ADR-043) — The ontology layer: spiritual concepts and their structural relationships (prerequisite, component, leads_to). Available from Arc 4+.

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ Explore the Teachings │
│ │
│ [Graph] [Constellation] [Concepts] │
│ │
│ Filter: [Books] [Magazine] [Video] [Audio] [Images] │
│ Focus: [All] [Single book ▾] [Theme ▾] [Person ▾] │
│ │
│ 📖──────📖 │
│ / │ \ \ 🎥 │
│ ⬡ ⬡ ⬡ 📖───────│ │
│ / \ / \ │ \ │ │
│ 📖 📖 📖 📖 ◇───🔊 │
│ │ │ │ │ │
│ ◆ 👤──────📍────📷 │
│ │
│ 📖 Book passage ⬡ Theme ◆ Concept │
│ 🎥 Video clip 🔊 Audio 📷 Image │
│ 👤 Person 📍 Place ◇ Reference │
│ │
└──────────────────────────────────────────────────────────────┘
```

#### ADR-062: Knowledge Graph Node Types

| Node Type | Shape | Color | Size | Click Target | Milestone |
|-----------|-------|-------|------|-------------|-----------|
| Book | Rectangle | SRF Navy | Large (fixed) | `/books/[slug]` | 3d |
| Book passage | Circle | SRF Navy (30%) | Small (density-scaled) | `/books/[slug]/[ch]#p[n]` | 3d |
| Theme | Hexagon | SRF Gold | Medium (passage count) | `/themes/[slug]` | 3d |
| Person | Portrait circle | Warm Cream border | Medium (fixed) | `/people/[slug]` | 3d |
| Scripture/reference | Diamond | Earth tone | Medium (fixed) | `/references/[slug]` | 3d |
| Magazine issue | Rectangle | Warm accent | Medium (fixed) | `/magazine/[issue-slug]` | Arc 4 |
| Magazine chunk | Circle | Warm accent (30%) | Small | `/magazine/[issue-slug]/[article-slug]` | Arc 4 |
| Ontology concept | Rounded rectangle | SRF Gold (dark) | Medium (relation count) | `/ontology/[slug]` | Arc 4+ |
| Sacred place | Map pin | Earth green | Medium (fixed) | `/places/[slug]` | Arc 6 |
| Video | Play-button circle | Teal accent | Medium (fixed) | `/videos/[slug]` | Arc 6 |
| Video chunk | Circle | Teal (30%) | Small | `/videos/[slug]?t=[ms]` | Arc 6 |
| Audio recording | Waveform circle | Amber accent | Medium (fixed) | `/audio/[slug]` | Arc 6 |
| Audio segment | Circle | Amber (30%) | Small | `/audio/[slug]?t=[ms]` | Arc 6 |
| Image | Rounded square | Neutral | Small (thumbnail) | `/images/[slug]` | Arc 6 |

Yogananda's own voice recordings and photographs receive the sacred artifact treatment — a subtle golden ring distinguishing them from other audio/images (`is_yogananda_voice`, `is_yogananda_subject` flags).

#### ADR-062: Knowledge Graph Edge Types

| Edge | Source → Target | Width/Opacity | Milestone |
|------|----------------|---------------|-----------|
| Semantic similarity | Any content ↔ any content | Proportional to score | 3d (books), Arc 6 (cross-media) |
| Contains | Book/issue/video/recording → chunk/segment | Thin, fixed | 3d+ |
| Theme membership | Content → theme | Medium, fixed | 3d |
| References scripture | Passage → external reference | Medium, dashed | 3d |
| Mentions person | Passage → person | Medium, fixed | 3d |
| Succeeded by | Person → person | Golden, directional | 3d |
| Preceded by | Person → person | Golden, directional | 3d |
| Mentions place | Content → sacred place | Medium, fixed | Arc 6 |
| Depicted at | Image → sacred place | Medium, fixed | Arc 6 |
| Photographed | Image → person | Medium, fixed | Arc 6 |
| Ontological relation | Concept → concept | Labeled (prerequisite, component, etc.) | Arc 4+ |
| Primary source | Passage → ontology concept | Thin, dashed | Arc 4+ |
| Editorial thread | Content → content (sequence) | Golden, directional | 3d (books), Arc 6 (cross-media) |
| Community collection | Content → content (curated) | Silver, directional | 7b |

#### Graph View Modes and Filtering

| Mode | Default milestone | What's visible |
|------|-------------------|----------------|
| **Book map** | 3d (default) | Books, passages, themes, people, references |
| **Concept map** | Arc 4+ | Ontology concepts, relations, linked passages |
| **All media** | Arc 6+ (new default) | Everything — full cross-media fabric |
| **Single book** | Any | One book's passages, themes, connections |
| **Single theme** | Any | One theme's passages across all media |
| **Single person** | Any | One person's passages, images, videos, places |
| **Lineage** | 3d+ | Person nodes only, connected by guru/succession edges, vertical directed layout (ADR-037) |

Media type toggles: show/hide books, magazine, video, audio, images independently. The filter bar appears at the top of the graph view.

#### Graph Evolution by Milestone

| Milestone | Additions | Approximate Node Count |
|-----------|-----------|----------------------|
| **3d** | Books, passages, themes, people, references. Editorial thread paths. | ~5,000–10,000 |
| **Arc 4** | + Magazine issues/chunks, ontology concepts. Constellation mode. | ~12,000–18,000 |
| **Arc 6** | + Videos/chunks, sacred places. Content hub cross-media edges. + Audio recordings/segments, images. Sacred artifact styling. | ~20,000–50,000 |
| **7b** | + Community collection paths, editorial multi-media threads. | Same nodes, new paths |

#### Performance Strategy

| Scale | Rendering | Layout |
|-------|-----------|--------|
| < 10,000 nodes | d3-force with Canvas | Pre-computed positions in JSON (nightly Lambda, ADR-017) |
| 10,000–50,000 nodes | WebGL (deck.gl or custom) | Level-of-detail: clusters when zoomed out, nodes when zoomed in |
| Mobile / low-bandwidth | Subset graph: 2-hop neighborhood of current node, max ~500 nodes | Progressive loading: clusters first, expand on interaction |

The nightly Lambda pre-computes positions server-side. The client renders — no layout computation at runtime.

#### Pre-Computed Graph JSON Schema

```jsonc
{
 "generated_at": "2027-03-15T02:00:00Z",
 "schema_version": 2,
 "node_types": ["book", "passage", "theme", "person", "reference"],
 "edge_types": ["similarity", "contains", "theme_tag", "references", "mentions_person", "performance_of"],
 "nodes": [
 {
 "id": "uuid",
 "type": "passage",
 "media_type": "book",
 "label": "Chapter 12, ¶3",
 "parent_id": "book-uuid",
 "url": "/books/autobiography/12#p3",
 "x": 0.0, "y": 0.0
 }
 ],
 "edges": [
 { "source": "uuid-a", "target": "uuid-b", "type": "similarity", "weight": 0.87 }
 ],
 "paths": [
 { "id": "thread-uuid", "type": "editorial", "label": "Divine Friendship", "node_ids": ["a", "b", "c"] }
 ]
}
```

New content types extend `node_types` and `edge_types` arrays — the visualization code renders unknown types with sensible defaults. Schema version increments when structural changes occur.

#### Graph Data API

```
GET /api/v1/graph → Graph metadata (node/edge type counts, last generated)
GET /api/v1/graph/subgraph?node={id}&depth=2 → 2-hop neighborhood (for embeddable mini-graphs)
GET /api/v1/graph/cluster?theme={slug} → All nodes in a theme cluster
GET /api/v1/graph.json → Full pre-computed graph (S3-served, CDN-cached)
```

The subgraph endpoint powers embeddable mini-graphs in other pages: the reader's Related Teachings panel can show a small visual graph of the current passage's neighbors.

**Service file:** `/lib/services/graph.ts` — graph queries, subgraph extraction, cluster resolution.

#### Constellation Mode

- Each dot represents a content item. Color-coded by media type (book passages by book palette, video by teal, audio by amber, images by neutral)
- Dense clusters become visually apparent — 40 passages about "divine love" form a neighborhood
- Outlier passages sit in the sparse space between clusters — often the most interesting discoveries
- Hover reveals the first line + citation. Click navigates to the content page.
- Zoom, pan, pinch. Cluster labels appear when zoomed out (dominant theme tag).
- No lines, no arrows. Points of light on warm cream. Spatial layout reveals relationships that lists hide.

**Implementation:** UMAP dimensionality reduction from 1024-dim embeddings (ADR-118) to 2D. Pre-computed nightly. Static JSON (~500KB for ~10,000 items). Canvas or WebGL rendering.

**Milestone:** Arc 4+ (constellation). Milestone 3d delivers Knowledge Graph mode only.

Linked from Library and themes pages (not primary nav).

### ADR-043: `/ontology` — Spiritual Concept Map

A human-readable view of the structured spiritual ontology (ADR-043). Presents Yogananda's conceptual framework as a navigable map: states, practices, principles, and their relationships.

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ Yogananda's Teaching Structure │
│ │
│ A map of how the teachings connect. │
│ │
│ Samadhi │
│ The superconscious state of union with Spirit. │
│ │
│ Requires: meditation → concentration → pranayama │
│ Degrees: savikalpa samadhi · nirvikalpa samadhi │
│ Parallels: satori (Zen) · unio mystica (Christian) │
│ Passages: 47 across 6 books │
│ │
│ "In the initial states of God-contact (savikalpa │
│ samadhi) the devotee's consciousness merges..." │
│ — Autobiography of a Yogi, Chapter 26, p. 312 │
│ │
└──────────────────────────────────────────────────────────────┘
```

**Milestone:** Arc 4+ (alongside ontology data model, ADR-043).

### ADR-083 ext: Personal Taxonomy in Study Workspace

The portal's themes (Peace, Courage, Healing) are universal. But seekers have *personal* names for their states. The Study Workspace (ADR-083) can accommodate this.

**Extension:** Within the Study Workspace, collections can be given seeker-defined names that aren't drawn from the portal's theme vocabulary. "The conversation I keep replaying." "What I need before sleep." "For Mom." The portal provides no vocabulary for these — the seeker's own words become the organizing principle.

- All client-side, all private, all deletable (consistent with ADR-083 localStorage pattern)
- The portal's taxonomy is canonical and editorial; the seeker's taxonomy is intimate and uncurated
- Personal collection names are never sent to the server, never appear in analytics, never inform the portal's theme system
- Milestone 7a server sync preserves personal names if the seeker opts in

This transforms the Study Workspace from a composition tool into a personal spiritual workspace — a private space for organizing the teachings around one's own life, not the portal's categories.

---

## DES-051: Portal Updates Page — "The Library Notice Board"

A dedicated `/updates` page presenting seeker-facing release notes in the portal's contemplative editorial voice (ADR-074). Linked from the site footer. Governed by ADR-105.

### Data Model

```sql
-- Portal updates (seeker-facing changelog)
CREATE TABLE portal_updates (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  title TEXT NOT NULL,                          -- seeker-facing title (e.g., "The Library has grown")
  summary TEXT NOT NULL,                        -- 1–2 sentence summary for RSS and /updates listing
  body TEXT,                                    -- full update text (Markdown)
  category TEXT NOT NULL CHECK (category IN (
    'new_content',                              -- new books, audio, video added
    'new_language',                             -- new language activated
    'new_feature',                              -- major new page or capability
    'improvement'                               -- seeker-noticeable UX improvement
  )),
  language TEXT NOT NULL DEFAULT 'en',          -- i18n from the start
  published_at TIMESTAMPTZ,                    -- NULL = draft, non-NULL = published
  season_label TEXT NOT NULL,                   -- "Winter 2026", "Spring 2027" — editorial, not computed
  drafted_by TEXT NOT NULL DEFAULT 'auto',      -- 'auto' (AI-drafted) or 'manual' (human-written)
  reviewed_by TEXT,                             -- editor who approved for publication
  deployment_ref TEXT,                          -- git tag or deployment ID that triggered the draft
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_portal_updates_published ON portal_updates(published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX idx_portal_updates_language ON portal_updates(language);
```

### API

```
GET /api/v1/updates
  ?language=en            -- default: en
  ?cursor=<uuid>          -- cursor-based pagination
  ?limit=20               -- default: 20

Response: {
  updates: [{ id, title, summary, body, category, season_label, published_at }],
  cursor: <next_cursor>
}
```

### Page Design

Located at `/updates` — linked from site footer as "What's new in the portal."

```
┌─────────────────────────────────────────────┐
│ What's New in the Portal                    │
│                                             │
│ Spring 2027                                 │
│ ─────────────────────────                   │
│                                             │
│ The Library has grown                       │
│ Three new books join the collection:        │
│ Man's Eternal Quest, The Divine Romance,    │
│ and Journey to Self-Realization.            │
│                                             │
│ The teachings are now connected             │
│ Explore how Yogananda's ideas flow across   │
│ books — the Related Teachings panel shows   │
│ connections as you read.                    │
│                                             │
│ Winter 2026                                 │
│ ─────────────────────────                   │
│                                             │
│ The portal opens                            │
│ Autobiography of a Yogi — free to the       │
│ world. Search Yogananda's words, read       │
│ chapter by chapter, find a quiet moment     │
│ in the Quiet Corner.                        │
│                                             │
│             ─── ◊ ───                       │
│                                             │
│ RSS: /feed/updates.xml                      │
└─────────────────────────────────────────────┘
```

### Typography and Layout

- **Heading:** "What's New in the Portal" — Merriweather 400, `--text-xl`, `--srf-navy`
- **Season headings:** Merriweather 400 italic, `--text-lg`, `--srf-navy`, with gold rule beneath
- **Update titles:** Merriweather 400, `--text-base`, `--srf-navy`
- **Update body:** Lora 400, `--text-sm`, `--text-body`
- **Max width:** `38rem` (same as reader — this is a reading page)
- **Generous whitespace** between seasons and between updates — each update breathes
- **No dates on individual updates** — seasonal grouping provides temporal context without SaaS-like timestamp precision
- **Lotus divider** between seasons (same `◊` pattern as reader chapter dividers)

### Editorial Workflow

1. **Trigger:** Deployment to production, or portal coordinator identifies a seeker-visible change
2. **AI drafts:** Claude reads deployment metadata (git tag, commit messages since last update) and drafts a seeker-facing summary following ADR-105 voice standards. Draft enters the `updates` review queue in the editorial portal (DES-033)
3. **Human review:** Portal coordinator or content editor reviews, edits for voice consistency, and publishes. Same keyboard-driven workflow as other review queues
4. **Publication:** Update appears on `/updates` page and in `/feed/updates.xml` RSS feed

**Frequency:** Not every deployment generates an update. Only seeker-visible changes warrant a notice. The portal coordinator exercises editorial judgment about what rises to the level of a seeker-facing update. Internal infrastructure changes, bug fixes, and performance improvements are omitted.

### RSS Feed

`/feed/updates.xml` — RSS 2.0, alongside existing content feeds planned in Milestone 5a. Each item includes title, summary, category, and portal link.

### Milestone Delivery

| Milestone | What Ships |
|-----------|-----------|
| **3b** | `/updates` page, `portal_updates` table, AI draft pipeline, review queue. First entries cover Arcs 1–3 retrospectively. |
| **5a** | `/feed/updates.xml` RSS feed alongside other RSS feeds. |
| **5b+** | Multilingual update notes via ADR-078 translation workflow. |

### Accessibility

- Semantic HTML heading hierarchy: `<h1>` page title, `<h2>` season headings, `<h3>` update titles
- Clean, text-first layout — ideal for screen readers (heading-level navigation)
- RSS feed provides alternative access channel
- ARIA label: "What's new in the portal — a record of how the library has grown"

*Section added: 2026-02-22, ADR-105*

---

## DES-052: Outbound Webhook Event System

The portal publishes content lifecycle events to registered HTTP subscribers via a lightweight outbound webhook system (ADR-106). This decouples content pipelines from distribution channels — new consumers (Zapier workflows, internal bots, partner integrations) subscribe to events without modifying content code.

### Architecture

```
Content Lifecycle (book published, passage rotated, asset approved)
      │
      ▼
┌─────────────────────┐
│ Event Emitter        │  Fires event to webhook_deliveries table
│ (in content service) │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Delivery Worker      │  Vercel cron (Milestone 5a) or Lambda (Milestone 5b+)
│ (background job)     │  Reads pending deliveries, POSTs to subscribers
└────────┬────────────┘
         │
    ┌────┴────┬──────────┬──────────────┐
    ▼         ▼          ▼              ▼
 Zapier    Slack Bot   RSS Regen    CDN Pre-warm
```

### Event Catalog Summary

| Event | Trigger | Key Consumers |
|-------|---------|---------------|
| `daily_passage.rotated` | Midnight UTC | Zapier → email, WhatsApp broadcast |
| `content.published` | New book/chapter/audio/video | Sitemap regen, CRM update, RSS regen |
| `content.updated` | Content correction | CDN cache purge, RSS regen |
| `social_asset.approved` | Staff approves quote image | Social scheduling tools |
| `portal_update.published` | New portal changelog entry | Internal Slack, RSS regen |

Full catalog, envelope format, delivery semantics, and schema in ADR-106.

### Admin UI (Milestone 5a, editorial portal)

- Subscriber list with event subscriptions and active/suspended status
- Delivery log (30-day rolling) with success/failure and response codes
- "Test" button per subscriber to verify connectivity
- Suspend/Resume controls for failing endpoints

### DELTA Compliance

Events describe content lifecycle only — never seeker behavior. No PII in any payload. The `email.dispatched` event reports `subscriber_count` (aggregate), not individual addresses.

*Section added: 2026-02-22, ADR-106*

---

## DES-055: Concept/Word Graph

The Concept/Word Graph is a specialized subgraph within the knowledge graph (DES-054) focused on vocabulary relationships — how Yogananda's terminology connects across traditions, Sanskrit sources, and progressive spiritual development. It powers word graph query expansion in the search pipeline (Milestone 3b+, Path C in DES-003) and the Concept Graph UI exploration (Arc 6).

### Term Node Schema

Each term in the concept graph is a node with:

```
{
  canonical: "samadhi",            // Canonical form
  display: "Samādhi",              // Display form with diacritics
  devanagari: "समाधि",             // Devanagari script (if Sanskrit)
  iast: "samādhi",                 // IAST transliteration
  type: "sanskrit_term",           // Node type
  domain: "consciousness",         // Domain classification
  depth_level: 6,                  // Experiential depth (1–7)
  definition_srf: "...",           // SRF-specific definition
  embedding: [...]                 // Voyage voyage-3-large embedding
}
```

### Edge Types (Concept-Specific)

| Edge Type | Description | Example |
|-----------|-------------|---------|
| **SYNONYM_OF** | Same concept, different term | samadhi ↔ cosmic consciousness |
| **BROADER_THAN** | Hierarchical: broader concept | meditation → concentration |
| **CROSS_TRADITION_EQUIVALENT** | Yogananda's explicit mapping | kundalini ↔ Holy Ghost |
| **SRF_INTERPRETS_AS** | SRF-specific interpretation | baptism → spiritual awakening |
| **TRANSLITERATION_OF** | Same word, different script | samadhi ↔ समाधि |
| **CO_OCCURS_WITH** | Frequently appear together in passages | devotion ↔ meditation |
| **PROGRESSION_TO** | Sequential development | concentration → meditation → samadhi |
| **PRACTICE_LEADS_TO** | Practice produces state | Kriya Yoga → spiritual perception |

### Construction Process

```
Milestone 3b: Canonical Vocabulary Seed
 └── Extract from entity_registry + sanskrit_terms tables
 └── Claude generates initial edges from domain knowledge
 └── Human review validates all edges

Milestone 5a: Cross-Tradition Extraction
 └── Mine Yogananda's explicit cross-tradition statements from corpus
 └── "The Hindu scriptures teach that [...] is what Christ called [...]"
 └── Constrained to Yogananda's own explicit mappings only

Milestone 5a: Progression Chains
 └── Extract sequential development paths from teaching passages
 └── Validate against SRF pedagogical tradition

Milestone 5a: Co-occurrence Edges
 └── Statistical co-occurrence from chunk enrichment data
 └── Filtered: minimum 3 co-occurrences, mutual information > threshold
```

### Word Graph Query Expansion (Milestone 3b+)

When the search pipeline reaches the graph traversal step (DES-003, Step 6, Path C), the concept graph enables vocabulary-aware expansion:

```
Seeker searches: "how to achieve enlightenment"
 │
 ▼
Entity resolution: "enlightenment" → Concept node
 │
 ▼
Graph traversal (1–2 hops):
 SYNONYM_OF: "Self-realization", "cosmic consciousness"
 PROGRESSION_TO: "meditation" → "samadhi"
 CROSS_TRADITION: "nirvana" (Buddhism), "salvation" (Christianity)
 │
 ▼
Expanded retrieval includes passages mentioning any of these terms
```

### Scope Constraint

Cross-tradition mappings are limited to Yogananda's own explicit mappings. The portal does not extend theological interpretation beyond what appears in the published corpus. If Yogananda wrote that kundalini is "what the Christians call the Holy Ghost," that mapping exists. If he did not make a specific mapping, it does not exist in the graph — regardless of how obvious it might seem to a scholar. The librarian finds; the librarian does not interpret.

**Governed by:** ADR-117 (Postgres-Native Graph Intelligence), ADR-116 (Entity Registry), ADR-001 (Librarian, Not Oracle)

*Section added: 2026-02-23, ADR-117. Revised: 2026-02-23, Neptune removed — Postgres-native implementation.*

---

## DES-056: Feature Catalog (RAG Architecture Proposal)

This section catalogs the features proposed in the RAG Architecture Proposal (`docs/reference/RAG_Architecture_Proposal.md`) that were accepted for integration into the project. Each feature has a milestone assignment, governing ADRs, and key dependencies. The reference document contains the full design exploration; this catalog tracks what was adopted and when it ships.

### Accepted for Design Integration

These features are actively designed into the architecture and have governing ADRs:

| Feature | Milestone | Governing ADRs | Key Dependencies |
|---------|-----------|----------------|------------------|
| **Related Teachings — Categorized** | 3a (similarity), 3b+ (graph-categorized) | ADR-050, ADR-117 | Chunk relations (Arc 1), graph batch pipeline (Milestone 3b) |
| **Contemplative Companion** | 3d+ | ADR-050, ADR-115, ADR-117 | Enrichment metadata (experiential_depth, voice_register), knowledge graph |
| **Scripture-in-Dialogue** | 3d | ADR-117, ADR-116 | Scripture nodes in knowledge graph, verse-level chunking for Gita/Bible commentaries |
| **Reading Arc** | 5a | ADR-117, ADR-115 | Graph algorithms (PageRank, betweenness centrality), experiential depth progression |
| **Living Commentary** | 3d | ADR-050, ADR-115 | Cross-reference extraction in enrichment pipeline, inline reference cards |

**Related Teachings — Categorized:** When a seeker reads a passage, the side panel shows not just *that* other passages are related but *why*. Five relationship categories: Same Concept, Deeper in This Theme, Another Teacher's Expression, Parallel Tradition, Technique for This State. Milestone 3a uses embedding similarity to approximate categories. Milestone 3b+ uses graph traversal for true categorization.

**Contemplative Companion:** A depth-aware reading mode that, given a passage, surfaces the contemplative arc: preparatory teachings → the passage itself → deeper explorations → related practices. Uses experiential_depth (1–7 scale) and voice_register enrichment metadata to build the arc. Not a chatbot — a curated pathway through existing content.

**Scripture-in-Dialogue:** For Yogananda's scriptural commentaries (God Talks with Arjuna, The Second Coming of Christ), presents the original scripture verse alongside Yogananda's interpretation, with CROSS_TRADITION_EQUIVALENT edges linking parallel verses across traditions. Navigation follows the scripture's structure, not the book's page order.

**Reading Arc:** Multi-session guided paths through the corpus, constructed from graph analysis. A seeker interested in "meditation" receives a progressive sequence from introductory passages through advanced teachings, following the PROGRESSION_TO edges and experiential_depth ordering. Paths are computed, not editorially curated — but editorial review approves before publication.

**Living Commentary:** Yogananda's commentaries are dense with internal cross-references ("as I explained in Chapter X"). The enrichment pipeline extracts these references; Living Commentary makes them navigable. Inline reference cards show a verbatim preview of the referenced passage without leaving the current reading position.

### Deferred with Milestone Assignment

These features are documented and milestone-assigned but not yet actively designed. Features without a milestone assignment belong in ROADMAP.md § Unscheduled Features instead.

| Feature | Milestone | Key Dependency | Notes |
|---------|-----------|---------------|-------|
| **Knowledge Graph Exploration UI** | Arc 6 | DES-054, graph batch | react-force-graph-3d, interactive 3D visualization |
| **Concept/Word Graph Exploration UI** | Arc 6 | DES-055, graph batch | D3 + WebGL progressive enhancement |
| **Lineage Voice Comparator** | 5a | ADR-117, ADR-115 | Compare how Yogananda and his gurus discuss the same concept |
| **Evolution of a Teaching** | 5a | ADR-117, temporal metadata | How Yogananda's expression of a concept evolved across books over decades |
| **Cosmic Chants as Portal** | Distributed | ADR-117, chant content | If chants are in corpus scope: verse-by-verse with Yogananda's explanations |
| **Passage Genealogy** | 5a | ADR-117, cross-reference extraction | The lineage of thought behind each passage — what influenced it |
| **Semantic Drift Detection** | 5a | ADR-115, temporal metadata | Staff tool: detect when the same term shifts meaning across books |
| **Consciousness Cartography** | Arc 6+ | DES-054, DES-055, graph batch | Stretch goal: visual map of consciousness states and their relationships |

### Explicitly Omitted

| Feature | Reason | See |
|---------|--------|-----|
| **Healing Architecture** | Creating a structured condition-to-practice graph risks health claims positioning. Scientific Healing Affirmations is searchable as a book; no structured healing graph. | Annotated in reference document |
| **Inter-Tradition Bridge** (beyond corpus) | The portal surfaces Yogananda's own explicit cross-tradition mappings. Extending beyond his words is theological interpretation, violating ADR-001. | Annotated in reference document |

*Section added: 2026-02-23, RAG Architecture Proposal merge*

---
