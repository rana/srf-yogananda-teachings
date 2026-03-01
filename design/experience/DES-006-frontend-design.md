## DES-006: Frontend Design

### Pages

| Route | Purpose | Data Source | Rendering | Indexed |
|-------|---------|------------|-----------|---------|
| `/` | Home — Today's Wisdom, search bar, thematic doors, "Seeking..." entry points, latest video | Neon (daily passages) + YouTube RSS | ISR (5 min) | Yes |
| `/search?q=...` | Search results — ranked verbatim quotes | Neon (hybrid search) | SSR | Yes (via `SearchAction`) |
| `/themes/[slug]` | Topic page — curated passages for a theme, person, principle, or practice | Neon (topic-tagged chunks) | ISR (1 hr) | Yes |
| `/quiet` | The Quiet Corner — single affirmation, timer, stillness | Neon (affirmations pool) | ISR (1 hr) | Yes |
| `/books` | Books — book catalog with editorial descriptions | Contentful (SSG/ISR) | ISR (24 hr) | Yes |
| `/books/[slug]` | Book landing page with cover, description, chapter list | Contentful (SSG/ISR) | ISR (24 hr) | Yes |
| `/bookmarks` | Lotus Bookmarks — saved chapters and passages (client-only, `localStorage`) | `localStorage` (no server) | CSR | No (`noindex`) |
| `/books/[slug]/[chapter]` | Chapter reader | Contentful (SSG/ISR) | ISR (7 days) | Yes |
| `/books/[slug]/[chapter]#chunk-[id]` | Deep link to specific passage | Same as above, scrolled to passage | ISR (7 days) | Yes (canonical: passage page) |
| `/passage/[chunk-id]` | Single passage shareable view (OG + Twitter Card optimized) | Neon | ISR (7 days) | Yes |
| `/about` | About SRF, Yogananda, the line of gurus, "Go Deeper" links | Static (ISR) | ISR (7 days) | Yes |
| `/events` | Gatherings & Events — convocation, commemorations, online events, retreats | Static (ISR) | ISR (24 hr) | Yes |
| `/places` | Sacred Places — SRF/YSS properties and biographical sites | Neon `places` table (ISR) | ISR (7 days) | Yes |
| `/places/[slug]` | Individual place detail with book cross-references | Neon `places` + `chunk_places` (ISR) | ISR (7 days) | Yes |
| `/videos` | Videos — categorized by playlist | YouTube API (ISR) | ISR (1 hr) | Yes |
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

**"Explore all themes" link:** Below the six doors, a quiet text link ("Explore all themes →") leads to `/themes`, which organizes all theme categories into distinct sections. This page is also linked from Books. (ADR-032, ADR-033)

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

### Books (`/books`) and Book Landing Page (`/books/[slug]`)

This page is how seekers browse and discover books. Even with a single book in Milestone 2a, the page should feel like the entrance to a real library — warm, unhurried, and honest about what's inside.

#### Books (`/books`)

```
┌──────────────────────────────────────────────────────────────┐
│ │
│ Books │
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
- **The SRF Bookstore link** is a natural signpost: seekers can explore the full catalog of physical books while the digital collection grows.
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

**Milestone 3a growth:** As Wave 2a–2d books are ingested, the books page naturally fills out. The layout scales from 1 book to 15+ without redesign. Books are ordered by ingestion priority (ADR-030), which mirrors life-impact ordering.

**Milestone 5b multi-language:** The books page shows books available in the user's language, plus an "Also available in English" section for untranslated works (per ADR-075 content availability matrix).

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
GET /api/v1/passages/[passage-id]/related
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
- The **side panel** belongs to the reading experience. Cross-book exploration is available but never intrudes on the linear reading experience.
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
- **Hindi print support (Arc 1):** Print stylesheet is locale-aware from Arc 1. Hindi pages use `font-family: 'Noto Serif Devanagari'` at 12pt (scaled from Latin 11pt for optical equivalence). Drop capitals omitted for Devanāgarī. Line length adjusted for 40–50 aksharas per line.
- **Additional non-Latin font support (Milestone 5b):** Font-family falls back per script: Noto Serif JP for Japanese, Noto Serif Thai for Thai, Noto Serif Bengali for Bengali. CJK text at 10.5pt (equivalent optical size to 11pt Latin). Define per-locale `@media print` font stacks alongside the web font stacks.

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

**API:** No new endpoints. Uses existing `/api/v1/passages/[passage-id]/related` and chunk neighbor queries. The "context" layer is fetched from the chapter data already loaded in the reader.

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
- **Hindi script support (Arc 1):** Satori requires explicit font files for non-Latin characters — it does not fall back to system fonts. A Hindi quote image will render as empty boxes unless the build bundles Noto Serif Devanagari font subsets. The OG image route selects font based on the passage's `language` column. Font map for Arc 1: `hi` → Noto Serif Devanagari; `en`, `es` → Merriweather. **Additional scripts (Milestone 5b):** `ja` → Noto Serif JP, `bn` → Noto Serif Bengali, `th` → Noto Serif Thai. All Latin-script languages use Merriweather.

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

**Secondary navigation architecture (ADR-130):** Persistent secondary nav populated progressively as features arrive. The nav grows with the portal — nothing is hidden, but nothing appears before it exists:

| Milestone | Secondary Nav Items |
|-----------|-------------------|
| 1c | `Books` `About` |
| 2a | + `The Four Doors` (PRO-018) `Guide` |
| When audio arrives | + `Listen` (PRO-021 — Yogananda's voice, not Arc 6 media) |
| 3a+ | + `Places` (DES-023) |

The secondary nav is never the primary surface. It serves seekers who arrive with intent to explore a specific content type. The primary surface is the recognition-first multi-lens homepage (PRO-019, ADR-130).

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
| Homepage | "Teachings of Paramahansa Yogananda — Free Online Teachings" | Portal overview |
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

 /* === Non-Latin Script Fonts (ADR-077, ADR-080, ADR-128) === */
 /* Devanagari loaded from Arc 1 — Hindi Autobiography (full text),
 God Talks with Arjuna (Gita verses), Holy Science (Sanskrit verses).
 Hindi locale (/hi/): eager preload. English pages: conditional.
 Milestone 5b adds Thai and Bengali font stacks. */
 --font-devanagari-reading: 'Noto Serif Devanagari', 'Noto Sans Devanagari', serif;
 --font-devanagari-ui: 'Noto Sans Devanagari', 'Noto Serif Devanagari', sans-serif;
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

 /* === Hindi/Devanāgarī Font Scale Overrides (ADR-080, ADR-128) === */
 /* Devanāgarī glyphs are optically smaller than Latin at the same
    point size due to shirorekha and complex conjuncts. ~11% increase. */
 --text-base-hi: 1.25rem;  /* 20px — Hindi body text */
 --leading-relaxed-hi: 1.9; /* Hindi reading — extra vertical for shirorekha + matras */

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
| Devanāgarī verses (Gita, Holy Science) | Noto Sans Devanagari | 400 | `--text-base` (18px) | `--leading-relaxed` (1.8) |
| Hindi body text (reading) | Noto Serif Devanagari | 400 | `--text-base-hi` (20px) | `--leading-relaxed-hi` (1.9) |
| Hindi UI chrome (nav, buttons) | Noto Sans Devanagari | 400/600 | `--text-sm` (15px) | `--leading-normal` (1.6) |
| Hindi headings | Noto Serif Devanagari | 700 | `--text-2xl` (32px) | `--leading-tight` (1.3) |

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
