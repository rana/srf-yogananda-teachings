# SRF Online Teachings Portal — Arc 4+ Design (Service through Community)

> **Scope.** This file contains the technical design sections relevant to **Arc 4: Service** through **Arc 7: Community** — cultural adaptation, email delivery, content management, magazine, dashboard, study circles, and image serving. For cross-cutting principles and navigation, see [DESIGN.md](DESIGN.md). For Arc 1, see [DESIGN-arc1.md](DESIGN-arc1.md). For Arcs 2–3, see [DESIGN-arc2-3.md](DESIGN-arc2-3.md).
>
> **Scope by milestone.** This file covers Milestone 3c, Milestone 3d, Arc 4, Milestone 5a, Milestone 5b, Arc 6, and Milestone 7b.
>
> **Parameter convention (ADR-123).** Specific numeric values in this document (cache TTLs, debounce timers, fusion parameters, chunk sizes, rate limits, color band boundaries, purge delays, revalidation intervals) are **tunable defaults**, not architectural commitments. They represent best pre-production guesses and should be implemented as named configuration constants in `/lib/config.ts`, not hardcoded literals. Milestone 1a.9 (search quality evaluation) and subsequent arc gates include parameter validation as deliverables. When a parameter is tuned based on evidence, annotate the section: `*Parameter tuned: [date], [old] → [new], [evidence].*` See ADR-123 for the full governance framework.

---

## DES-018: Cultural Design Considerations

Each supported locale carries cultural, typographic, and platform expectations that go beyond translation. This section documents what we know, what we need to validate, and what adaptations each culture may require. It is a living reference — updated as Milestone 5b implementation progresses and native-speaker reviewers provide input.

### English (en) — Default

- **Primary platforms:** Google, YouTube, Safari/Chrome, email
- **Script:** Latin. All design tokens calibrated for English.
- **Cultural notes:** The portal's warm cream + Merriweather + bibliomantic "Show me another" aesthetic was designed for English spiritual readers. This is the baseline.
- **Open question:** Which edition of *Autobiography of a Yogi* does the portal's pagination reference? SRF study groups worldwide reference specific page numbers. Edition clarity is needed. (ADR-034 provides the `edition` column.)

### Spanish (es) — Core

- **Primary platforms:** WhatsApp (dominant in Latin America), Google, YouTube, Instagram
- **Script:** Latin. Standard design tokens work. Spanish diacritics (á, é, ñ) render correctly in Merriweather.
- **Cultural notes:** Latin American spiritual culture favors warmth, emotional directness, and relational language. "Seeking..." entry points need cultural *adaptation*, not mechanical translation — e.g., "The heart to forgive" might become "Sanar el corazón" (healing the heart) or "Aprender a soltar" (learning to let go). WhatsApp integration (Milestone 5a, ADR-026) is high-priority for this audience.
- **Organizational:** SRF (not YSS) serves Latin America directly. Verify whether Latin American SRF centers have their own event calendars for the Events signpost.
- **Open question:** Does SRF have digital text of Spanish translations?

### German (de) — Core

- **Primary platforms:** Google, YouTube, WhatsApp (growing), email
- **Script:** Latin. Merriweather renders ä, ö, ü, ß correctly.
- **Cultural notes:** German compound words ("Selbstverwirklichung," "Gottverwirklichung," "Überbewusstsein") challenge search. Embedding model must place these near English equivalents — requires explicit testing. ADR-078 glossary specifies formal "Sie" register. German privacy expectations exceed GDPR minimums — the portal's no-tracking approach (ADR-095) is a strong cultural fit, but German seekers may still expect a privacy explanation page. Older SRF Deutschland translations may use different orthography ("Krija" vs "Kriya") — search must handle both.
- **Open question:** Does SRF Deutschland have digital text? Which translations?

### French (fr) — Core

- **Primary platforms:** Google, YouTube, WhatsApp (Francophone Africa), email
- **Script:** Latin. Standard diacritics (é, è, ê, ç) work in Merriweather.
- **Cultural notes:** Search must be diacritic-insensitive ("méditation" = "meditation"). Francophone Africa (~130M speakers) may be a larger audience than France itself — ADR-006 global equity features (KaiOS, text-only, 2G) are directly relevant. West African French has different spiritual idiom from European French; "Seeking..." entry points need validation with both.
- **Open question:** Do SRF French translations exist in digital form? Is there a distinct Francophone African SRF/YSS community?

### Italian (it) — Core

- **Primary platforms:** Google, YouTube, WhatsApp, email
- **Script:** Latin. Standard Merriweather rendering.
- **Cultural notes:** Warm cream aesthetic and serif typography align well with Italian book culture. Few Italian SRF centers — Events signpost may feel sparse. Spiritual terminology glossary (ADR-078) is critical — Italian translations may handle Sanskrit terms differently than English.
- **Open question:** Digital text availability from SRF Italian publications.

### Portuguese (pt) — Core

- **Primary platforms:** WhatsApp (dominant in Brazil), Google, YouTube, Instagram
- **Script:** Latin. Merriweather renders Portuguese diacritics (ã, õ, ç) correctly.
- **Cultural notes:** Brazilian Portuguese and European Portuguese differ in vocabulary, spelling, and idiom. May need `pt-BR` and `pt-PT` as distinct locales or, at minimum, distinct "Seeking..." entry points. Brazil has one of the world's largest yoga communities. WhatsApp integration is not optional for this audience. ADR-006 equity features relevant for Brazil's connectivity inequality.
- **Open question:** Do SRF Brazilian Portuguese translations exist? Is there a Brazilian SRF organizational structure distinct from Portuguese?

### Japanese (ja) — Core

- **Primary platforms:** LINE (not WhatsApp), Google, YouTube, Twitter/X
- **Script:** CJK (Hiragana, Katakana, Kanji). Requires Noto Serif JP / Noto Sans JP font loading.
- **Typography:** 38rem line width holds ~30–35 CJK characters per line (within optimal 25–40 range). Line height should tighten from 1.8 to 1.6–1.7. Drop capitals are a Western convention — omit for Japanese. Per-language chunk size validation critical (CJK tokenization differs significantly).
- **Cultural notes:** "Show me another" may need reframing. The cultural analogue to bibliomancy is omikuji (temple fortune slips), where the expectation is a single, definitive message — not unlimited refreshes. Consider framing as "別の教えを読む" (read a different teaching) rather than inviting endless cycling. Japanese social sharing prefers very short, aphoristic content — optimal shareable unit may be one sentence, not a full paragraph. LINE share support needed alongside WhatsApp (ADR-026). Honorific suffixes required for master names ("パラマハンサ・ヨガナンダ師"). Japanese *ma* (negative space) philosophy and wabi-sabi aesthetic could inform the Quiet Corner's presentation differently from the English version — stillness as active aesthetic principle, not merely absence of clutter. "Seeker" (*tanbōsha*, 探訪者) implies outsider status — "practitioner" or "reader" might feel more respectful in Japanese. Per-locale editorial review should determine the appropriate term.
- **Open question:** Does SRF/YSS have digital Japanese translations? What is the Japanese SRF community structure?

### Thai (th) — Core

- **Primary platforms:** LINE (dominant), Facebook, Google, YouTube
- **Script:** Thai (LTR, but no word boundaries). Requires Noto Serif Thai / Noto Sans Thai font loading.
- **Typography:** Thai script has no whitespace between words — word segmentation is a significant challenge for search tokenization. PostgreSQL ICU tokenization handles Thai, but search quality must be explicitly benchmarked. Line height should be increased vs Latin to accommodate Thai's tall character cells (ascenders for tone marks, descenders for vowels below the baseline). Drop capitals are a Western convention — omit for Thai. Per-language chunk size validation is critical due to different token economies.
- **Cultural notes:** Thailand has a strong SRF/YSS presence. Thai Buddhist culture has existing meditation traditions (Theravada vipassana) that overlap with and differ from Yogananda's teachings — the portal should respect this context. Thai spiritual aesthetics favor gold, lotus imagery, and ornate visual treatments (similar to Hindi locale considerations). "Seeker" terminology needs cultural validation — Thai Buddhist vocabulary (*phū sǣngha tham*, ผู้แสวงธรรม) carries connotations from Theravada tradition. Official Thai translations of Yogananda's works exist.
- **Organizational:** Verify SRF/YSS Thailand organizational structure and branding requirements. Thai locale may need YSS-style branding rather than SRF.
- **Open question:** Which Yogananda works have official Thai translations? Does SRF/YSS Thailand have digital text? Thai word segmentation quality for search needs benchmarking.

### Hindi (hi) — Core

- **Primary platforms:** WhatsApp (dominant), Google, YouTube, JioPhone/KaiOS
- **Script:** Devanagari (LTR). Requires Noto Serif Devanagari font loading. Base font size may need 10–15% increase vs Latin for equivalent readability.
- **Cultural notes:** Hindi-speaking seekers know Yogananda through YSS, not SRF. Portal branding must feature YSS prominently for `/hi/` locale (ADR-079). The warm cream aesthetic works but may feel understated compared to Hindi spiritual print traditions (which tend toward more ornate visual treatment). India's device landscape is mobile-first and low-bandwidth — ADR-006 equity features (KaiOS, text-only mode, 2G optimization) are essential, not optional. Test performance specifically on JioPhone with Jio 4G in Uttar Pradesh/Bihar/Bengal network conditions.
- **Visual design open question:** Should the Hindi locale carry more visual warmth — deeper gold, more ornamental dividers, more generous use of Devanāgarī calligraphy — to align with Indian spiritual aesthetics? The current "understated" framing should not assume Western minimalism is the universal expression of reverence. YSS-connected Indian designers should participate in this decision, not just review it. (Cross-cultural principle 6)
- **Typography conventions:** Drop capitals are a Western book convention — omit for Devanāgarī. Decorative opening quotation marks need script-appropriate glyphs. The 65-75 character optimal line length is calibrated for Latin script; Devanāgarī requires per-script validation.
- **"Seeker" terminology:** In Hindi/Sanskrit, *sādhak* (साधक, practitioner) or *jijñāsu* (जिज्ञासु, one who desires to know) carry different connotations than "seeker" — a *sādhak* is actively practicing, not seeking. Per-locale editorial review should determine the culturally appropriate term. (Relates to ADR-074)
- **Organizational:** YSS branding, YSS bookstore links, YSS event calendar. Portal URL question: `teachings.yogananda.org/hi/` or a YSS-branded domain? YSS representatives are co-equal design stakeholders for the Hindi locale — see CONTEXT.md § Stakeholders.
- **Open question:** Does YSS have digital text of Hindi translations? What is YSS's digital infrastructure and approval process?

### Bengali (bn) — Core

- **Primary platforms:** WhatsApp, Google, YouTube, Facebook
- **Script:** Bengali script (LTR). Requires Noto Serif Bengali font loading. Bengali conjuncts and vowel signs require careful font rendering. Base font size may need increase vs Latin.
- **Cultural notes:** Bengali is Yogananda's mother tongue — including it sends a powerful signal about mission integrity. Bengali devotional culture has strong existing practices (daily meditation, Durga Puja season) and literary traditions (Rabindranath Tagore's influence on spiritual aesthetics). The Quiet Corner and parting passages may benefit from a more lyrical editorial framing in Bengali — not translation of English framing, but Bengali-authored devotional register. Bengali OCR accuracy is lower than Hindi if digital text is unavailable.
- **Typography conventions:** Drop capitals are a Western convention — omit for Bengali script. Bengali conjuncts require careful font rendering validation. Decorative quotation marks need script-appropriate glyphs.
- **Organizational:** Same YSS branding considerations as Hindi. YSS representatives are co-equal design stakeholders for the Bengali locale.
- **Open question:** Does YSS have digital Bengali text? Bengali script rendering quality validation needed.

### Future Evaluation Candidates

- **Chinese (zh):** WeChat ecosystem (not WhatsApp). Simplified vs Traditional Chinese. Great Firewall considerations for mainland China hosting. Strong yoga community in urban China.
- **Korean (ko):** KakaoTalk (not WhatsApp). Naver search (not Google-dominant). Korean Hangul is phonetic — different search characteristics.
- **Russian (ru):** VK (VKontakte) social platform. Cyrillic script. Russian yoga community is substantial.
- **Arabic (ar):** RTL layout (CSS logical properties ready per ADR-076). Complex typography (ligatures, contextual forms). Cultural sensitivity: yoga is sometimes viewed with suspicion in some Arabic-speaking communities. Requires careful framing.

### Cross-Cultural Design Principles

1. **Adapt, don't just translate.** "Seeking..." entry points, "Show me another" framing, and tone guidance are editorial content per locale, not mechanical translations.
2. **Platform-aware distribution.** WhatsApp for Latin America, India, Africa. LINE for Japan. WeChat for China. KakaoTalk for Korea. The portal's messaging strategy must be locale-aware.
3. **Script-aware typography.** Font size, line height, drop capitals, and line width all vary by script family. Design tokens should be locale-overridable.
4. **Branding-aware identity.** SRF branding for Western locales. YSS branding for Indian locales. The portal's visual identity adapts to the organization the seeker knows.
5. **The portal assumes literacy.** In countries with significant functional illiteracy (India, Brazil, Sub-Saharan Africa, Thailand), the TTS "Listen" button is a critical accessibility feature (capability distributed across arcs). For Hindi, Bengali, and Thai locales specifically, audio-first entry points should be prioritized earlier than the general TTS schedule. Yogananda's own voice recordings are the most direct form of the teachings. Consider an audio-first pilot alongside the Hindi/Bengali/Thai text launch (Milestone 5b) rather than deferring all audio to Arc 6. Yogananda's tradition includes kirtan (singing/chanting) and oral storytelling — inherently oral modes that the portal's text-first approach underserves.
6. **What feels sacred is culturally specific.** The emotional register of the portal — what feels contemplative, welcoming, sacred — is not universal. The warm cream + Merriweather + bibliomantic aesthetic resonates with Western spiritual bookstore sensibility. Hindi spiritual print traditions carry more ornate visual warmth (deeper gold, ornamental dividers, generous Devanāgarī calligraphy). Bengali devotional culture values poetic beauty and literary refinement (Tagore's influence). Japanese *ma* (negative space) philosophy could genuinely inform the Quiet Corner differently. Bhakti traditions express devotion through fervent intensity, not only through stillness. Per-locale adaptation addresses emotional resonance, not just typography and platform preferences. Each locale's visual and editorial adaptation is a *translation of emotional register*, not just a typographic adjustment.
7. **Unsupported language arrival is a design surface, not an error state.** A seeker arriving from Korea, Russia, or an Arabic-speaking country will encounter a portal that doesn't yet speak their language. This moment must be designed, not defaulted. The response: (a) detect the browser's `Accept-Language` header; (b) if the language is an evaluation candidate, display a brief, warm message in that language: "We are working to bring Yogananda's teachings to [language]. For now, the portal is available in [list of current languages]." This message is a static string in `messages/{locale}.json`, not a dynamic translation. (c) If the language is not on any roadmap, display the English welcome with no false promise. (d) Never auto-redirect — let the seeker choose. (e) The `[EN]` fallback marker (CLAUDE.md constraint #12) is always visible when English content is shown to a non-English browser locale. This principle extends to in-portal moments: when a seeker navigates to a book page that isn't yet available in their language, the page shows the English version with a clear `[EN]` marker and, if the translation is in progress, a note: "This book is being prepared in [language]." Honest about scope, not apologetic about it.

---

## DES-030: Daily Email: Verbatim Passage Delivery

(See ADR-091 for full rationale.)

A daily email delivering a single Yogananda passage — verbatim, with citation and a link to read in context. The email is the portal reaching out to meet the seeker, rather than waiting for the seeker to visit.

### Milestone 5a: Non-Personalized Daily Email

All subscribers receive the same passage each day. The passage is selected from the `daily_passages` pool with optional seasonal weighting.

### Milestone 7a: Theme-Preference Email

Logged-in subscribers choose preferred themes (Peace, Courage, etc.). The daily email selects from theme-tagged passages matching their preferences.

### Subscriber Data Model

```sql
-- ============================================================
-- EMAIL SUBSCRIBERS (for Daily Wisdom email)
-- ============================================================
CREATE TABLE email_subscribers (
 id UUID PRIMARY KEY DEFAULT uuidv7(),
 email TEXT NOT NULL UNIQUE,
 language TEXT NOT NULL DEFAULT 'en',
 is_confirmed BOOLEAN NOT NULL DEFAULT false, -- double opt-in
 is_active BOOLEAN NOT NULL DEFAULT true, -- can unsubscribe
 confirm_token TEXT, -- for double opt-in confirmation
 unsubscribe_token TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
 theme_preferences TEXT[], -- Milestone 7a: ['peace', 'courage']
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 confirmed_at TIMESTAMPTZ,
 unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_subscribers_active ON email_subscribers(is_active, is_confirmed)
 WHERE is_active = true AND is_confirmed = true;
```

### Email Design

```
┌──────────────────────────────────────────────────┐
│ │
│ ☸ SRF Teaching Portal │
│ │
│ ──────────────────────────────────────────── │
│ │
│ Today's Wisdom │
│ │
│ "Have courage. Whatever you are going through │
│ will pass. Trust in God's plan for you. │
│ Through your difficulties you will gain │
│ the strength you need." │
│ │
│ — Where There Is Light, p. 42 │
│ │
│ [ Read in context → ] │
│ │
│ ──────────────────────────────────────────── │
│ │
│ The teachings of Paramahansa Yogananda, │
│ made freely available to seekers worldwide. │
│ │
│ yogananda.org · SRF Teaching Portal │
│ │
│ Unsubscribe │
│ │
└──────────────────────────────────────────────────┘
```

**Design constraints:**
- Plain HTML email (no JavaScript, no web fonts — fallback to Georgia/serif)
- **Non-Latin script support (Milestone 5b):** HTML email font rendering is unreliable across clients (Gmail, Apple Mail, Outlook). Non-Latin scripts (CJK, Thai, Devanagari, Bengali) must use system font stacks, not web fonts. Define per-locale email font stacks and test across the top 5 email clients per target market. Passage text must render correctly in the subscriber's language without depending on downloadable fonts.
- Warm cream background (`#FAF8F5`), navy text (`#1A2744`)
- Single passage, single CTA ("Read in context"), no other links except footer
- Unsubscribe link uses `unsubscribe_token` — one-click, no login required
- `List-Unsubscribe` header for email client support
- No tracking pixels. No open-rate tracking. No click tracking.

### API Routes

```
POST /api/v1/email/subscribe
 Body: { "email": "seeker@example.com", "language": "en" }
 → Sends double opt-in confirmation email
 → Returns { "status": "confirmation_sent" }

GET /api/v1/email/confirm?token=xxx
 → Sets is_confirmed = true, confirmed_at = now
 → Redirects to portal with "You're subscribed" message

GET /api/v1/email/unsubscribe?token=xxx
 → Sets is_active = false, unsubscribed_at = now
 → Shows "You've been unsubscribed" page with re-subscribe option
```

### Email Sending Infrastructure

| Component | Service | Notes |
|-----------|---------|-------|
| Email delivery | SendGrid (SRF standard) | SRF's established transactional email provider. Disable open/click tracking for DELTA compliance. See PRO-015 for AWS SES alternative. |
| Cron trigger | Vercel Cron Jobs (Pro: 10/day) or AWS EventBridge | Daily at 5:00 AM UTC |
| Template | Server-rendered HTML string (no template engine needed) | Keep simple — one passage, one link |
| Daily passage selection | Same logic as `/api/v1/daily-passage` but with a fixed daily seed | All subscribers receive the same passage on the same day |

**Daily seed logic:** Use the current date as a deterministic seed to select the day's passage, ensuring all emails contain the same quote and the portal homepage can display "Today's email featured this passage" if desired.

### Email Data Retention and Erasure (ADR-099)

**Lawful basis:** Consent (GDPR Art. 6(1)(a)) via double opt-in. Stated on the subscription form and in `/privacy`.

**Retention policy:**
- **Active subscribers:** Email retained for the duration of the subscription.
- **Unsubscribed (soft-deleted):** `is_active = false`, `unsubscribed_at` set. Row automatically purged 90 days after `unsubscribed_at`.
- **Bounce/failure records:** Retained for 30 days for operational health, then purged.

**Right to erasure:** In addition to the existing unsubscribe endpoint, a hard-deletion endpoint removes the subscriber row entirely:

```
DELETE /api/v1/email/subscriber?token=xxx
 → Deletes row from email_subscribers
 → Shows "Your data has been removed" confirmation
```

The unsubscribe confirmation page offers both options: "Stay unsubscribed (data removed in 90 days)" and "Remove my data now."

**Minimum age:** The subscription form includes the statement: "You must be 16 or older to subscribe." (GDPR Art. 8; adjusted per member state where applicable.)

*Section added: 2026-02-21, ADR-099*

---

## DES-032: Content Management Strategy

Content flows through a five-layer staff experience architecture (ADR-082). Each layer serves a distinct audience with appropriate tooling:

| Layer | Tool | Who | What |
|---|---|---|---|
| **Content Authoring** | Contentful | Content editors | Creating/editing book text, editorial threads, theme descriptions, calendar events |
| **Contextual Bridges** | Contentful Custom Apps | Content editors (in Contentful) | Sidebar panels showing review status, related data, previews |
| **Editorial Review** | Admin Portal (`/admin`) | Monastic editors, theological reviewers, social media staff, translation reviewers | All review/approval/curation workflows where AI has proposed and humans must decide |
| **Technical Operations** | Retool | AE developers | Search analytics, pipeline monitoring, bulk data operations |
| **Impact Reporting** | Impact Dashboard (`/admin/impact`) | Leadership, philanthropist's foundation | Global reach, content growth, search themes — narrative quality, read-only |

### Content Flow by Type

| Content Type | Arc 1 | Milestones 2a–3a | Milestone 3b+ (Editorial Portal) | Why |
|---|---|---|---|---|
| **Book text, chapters** | PDF → Contentful (import) → batch sync → Neon | Contentful → webhook sync → Neon | Same + Contentful Custom Apps sidebar | Editorial source of truth from Arc 1 (ADR-010). Webhook sync replaces batch in Milestone 1b. |
| **Theme tag review** | — | — | Admin portal review queue (bridged via Contentful sidebar) | AI proposes, humans approve — needs focused review UI |
| **Daily passage curation** | Script-populated in Neon | Same | Admin portal curation view + Contentful entries | Content editors curate via the tool that best fits the task |
| **Calendar events** | — | — | Contentful entries + admin portal for passage associations | Event definitions in Contentful; passage associations in admin portal |
| **Social media assets** | — | — | Admin portal asset review | Visual review + caption editing + per-platform download |
| **Translation review** | — | — | Admin portal side-by-side review (Milestone 5b) | Non-technical reviewers (possibly volunteers) need a focused UI, not Git |
| **Sacred Places** | — | Static MDX or hardcoded | Contentful entries → sync → Neon | Editorial content with images |
| **Search analytics** | — | Retool dashboard | Retool dashboard | Data-heavy, technical audience |
| **Pipeline monitoring** | — | Retool dashboard | Retool dashboard | Technical operations |
| **Impact reporting** | — | — | Admin portal `/admin/impact` (Milestone 5b+) | Beautiful, narrative, read-only — for leadership |

### Contentful → Neon Sync

The sync service is the primary coupling point between Contentful and Neon. Milestone 1a uses a batch sync script; Milestone 1b+ uses webhook-driven sync on Vercel. When Contentful's content model evolves, the sync function must be updated. This is the main maintenance surface in production.

```
Contentful (editorial) ──webhook──→ Serverless function ──→ Neon (search index)
 │
 ├─ Extract text
 ├─ Chunk into paragraphs
 ├─ Generate embeddings
 └─ Upsert into book_chunks
```

---

## DES-041: Magazine Section Architecture

Self-Realization Magazine (published since 1925) is a primary content type alongside books, audio, and video. Yogananda's magazine articles enter the full search/theme/daily-passage pipeline. Monastic articles are searchable via opt-in filter. See ADR-040.

### Magazine API Endpoints

```
GET /api/v1/magazine/issues              → Paginated issue list (cursor-based)
 ?language=en                            — Filter by language
 ?updated_since=...                      — Incremental sync (ADR-107)
 ?created_since=...                      — Incremental sync (ADR-107)
GET /api/v1/magazine/issues/{slug}       → Single issue (metadata + article summaries)
GET /api/v1/magazine/issues/{slug}/pdf   → Issue PDF (pre-rendered, S3 + CloudFront)

GET /api/v1/magazine/articles            → Paginated article list (cursor-based)
 ?issue_id={uuid}                        — Filter to a single issue
 ?author_type=yogananda                  — Filter by author type
 ?language=en                            — Filter by language
 ?updated_since=...                      — Incremental sync (ADR-107)
 ?created_since=...                      — Incremental sync (ADR-107)
GET /api/v1/magazine/articles/{slug}     → Single article with chunks
GET /api/v1/magazine/articles/{slug}/pdf → Article PDF (pre-rendered)
```

Issue slugs are single-segment, computed from year + season (e.g., `2025-spring`, `1925-winter`). Article slugs are globally unique (enforced by `UNIQUE(slug)` on `magazine_articles`). See ADR-108.

### Magazine Page Layout

```
/magazine → Magazine landing
├── Latest Issue (cover, TOC, featured article)
├── Browse by Year (accordion → issue covers)
└── Yogananda's Magazine Writings (searchable index, chronological + by theme)

/magazine/{issue-slug} → Single issue view (e.g., /magazine/2025-spring)
├── Cover image + editorial note
├── Article list with author types (gold marks for Yogananda, neutral for others)
└── "Read full issue PDF →" download

/magazine/{issue-slug}/{article-slug} → Article reader (same reader component as books)
├── Author byline below title
├── Issue citation in reader header
└── "In this issue" sidebar (replaces Related Teachings when browsing within an issue)
```

### Search Integration

The `hybrid_search` function queries `magazine_chunks` alongside `book_chunks`. Only `author_type = 'yogananda'` articles are included by default. The `include_commentary=true` parameter extends search to monastic articles. Citations adapt: *— Self-Realization Magazine, Vol. 97 No. 2, p. 14*.

---

## DES-043: "What Is Humanity Seeking?" Dashboard Architecture

A public-facing, contemplative visualization of anonymized search intelligence.

### Seeking API Endpoints

```
GET /api/v1/seeking → Dashboard data (aggregated, nightly)
 Response: { top_themes[], geographic_summary[], seasonal_rhythm[], common_questions[] }

GET /api/v1/seeking/themes → Theme trends over time
 ?period=month|quarter|year
```

### Seeking Dashboard Layout

```
/seeking → Public dashboard (contemplative, not analytical)
├── "Right now, the world is seeking..." — Top 3-5 themes, warm text emphasis
├── Geographic view — Warm-toned world map, soft regional highlights
├── Seasonal rhythm — Year-view of theme ebb and flow
├── The questions — Most common question-form queries (anonymized, clustered)
└── "Read the full analysis in Self-Realization Magazine →" (when available)
```

---

## DES-046: Study Circle Sharing

**Route:** `/study/[book-slug]/[chapter]/share/[hash]`

Pre-rendered, shareable page with key passages, discussion prompts, and cross-book connections. < 30KB HTML. Optimized for WhatsApp/SMS preview.

---

## ADR-035, ADR-063, ADR-064: Image Serving Architecture

Images are stored in S3 and served via CloudFront. At ingestion, the Lambda pipeline generates five named size tiers in dual format (WebP + JPEG):

| Tier | Max dimension | Use case |
|------|--------------|----------|
| `thumb` | 300px | Gallery grids, chat previews |
| `small` | 640px | Social sharing, messaging |
| `medium` | 1200px | Web use, presentations |
| `large` | 2400px | Wallpapers, high-DPI displays |
| `original` | Source | Print, archival |

**Storage:** `s3://srf-portal-images/{image-id}/{tier}.{format}`

**Download endpoint:** `GET /api/v1/images/{slug}/download?size=medium&format=webp` — returns 302 redirect to CloudFront URL with `Content-Disposition: attachment`.

**Watermarking per tier (ADR-063):**
- All tiers: EXIF/XMP metadata (Milestone 2a)
- `medium`, `large`, `original`: C2PA Content Credentials (Arc 6)
- `original` of sacred images: steganographic watermark (Arc 6)

**Service file:** `/lib/services/images.ts` — image queries, size resolution, download URL generation.

---
