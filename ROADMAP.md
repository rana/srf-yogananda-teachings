# SRF Online Teachings Portal — Roadmap

## Phasing Philosophy

Each phase delivers a working, demonstrable increment. The first three phases decompose what was originally a single monolithic "Phase 1" into focused deliverables: prove the search works, build the complete portal experience, then add engineering infrastructure and reader interactions. Phases 4–7 decompose multi-book expansion into focused stages: core content growth, reader intelligence, library completion, and outreach. This ensures the highest-risk feature (AI-powered search) is validated before investing in polish.

---

## Phase 1: Prove the Search (Single Book)

**Goal:** Prove that semantic search across Yogananda's text returns high-quality, relevant, verbatim passages with accurate citations. Deliver a working vertical slice: ingest → search → read.

**Focus book:** Autobiography of a Yogi

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 1.1 | **Neon database + schema** | PostgreSQL with pgvector enabled. Tables: books (with `bookstore_url`), chapters, book_chunks (with `embedding_model` versioning per ADR-032), teaching_topics (with `category` and `description_embedding` per ADR-048), chunk_topics (three-state `tagged_by` per ADR-048), daily_passages, affirmations, chunk_relations. Hybrid search function. dbmate configured with `/migrations/` directory. Initial schema as migration 001. (ADR-027, ADR-034, ADR-048) |
| 1.2 | **PDF ingestion script** | Download Autobiography PDF → convert with marker → chunk by paragraphs → generate embeddings → insert into Neon. Typographic normalization applied during ingestion (smart quotes, proper dashes, ellipsis glyphs). |
| 1.3 | **Human QA of ingested text** | Claude pre-screens ingested text flagging probable OCR errors, formatting inconsistencies, truncated passages, and mangled Sanskrit diacritics (ADR-049 E4). Human reviewers make all decisions — Claude reduces the review surface area. |
| 1.4 | **Shared service layer + API conventions** | All business logic in `/lib/services/` (not in Server Components). API routes use `/api/v1/` prefix, accept both cookie and Bearer token auth, return cursor-based pagination on list endpoints, include Cache-Control headers. (ADR-024) |
| 1.5 | **Search API** | Next.js API route (`/api/v1/search`) implementing hybrid search (vector + FTS + RRF). Returns ranked verbatim passages with citations. Search intent classification routes seekers to the optimal experience (theme page, reader, empathic entry, or standard search). (ADR-024, ADR-049 E1) |
| 1.6 | **Query expansion + spiritual terminology bridge** | Claude API integration for expanding conceptual queries into semantic search terms. Includes tradition-aware vocabulary mapping (`/lib/data/spiritual-terms.json`) that bridges modern/cross-tradition terms to Yogananda's vocabulary. Per-book evolution lifecycle: each book ingestion triggers vocabulary extraction → diff → human review → merge (ADR-052). Optional — bypassed for simple keyword queries. (ADR-049 E2, ADR-052) |
| 1.7 | **Search UI** | Search results page: ranked verbatim quoted passages with book/chapter/page citations. "Read in context" deep links. |
| 1.8 | **Basic book reader** | Chapter-by-chapter reading view with deep-link anchors, optimal line length (65–75 chars / `max-width: 38rem`), prev/next chapter navigation, "Find this book" SRF Bookstore links, basic reader accessibility (skip links, semantic HTML). (ADR-036) |
| 1.9 | **Minimal homepage** | Today's Wisdom (random passage on each visit), "Show me another" link (new random passage, no page reload). Search bar with prompt "What are you seeking?" Styled with SRF design tokens. Cross-fade animation added in Phase 2. |
| 1.10 | **Observability foundation** | Sentry error tracking with Next.js source maps. Structured logging via `/lib/logger.ts` (JSON, request ID correlation). Health check endpoint (`/api/v1/health`). Vercel Analytics for Core Web Vitals. (ADR-029) |
| 1.11 | **Search quality evaluation** | Test suite of ~30 representative queries with expected passages. Claude serves as automated evaluation judge in CI — given a query and results, assesses whether expected passages appear and ranking is reasonable. Threshold: ≥ 80% of queries return at least one relevant passage in top 3. Runs on every PR touching search pipeline. (ADR-049 E5) |

### Technology

| Component | Service | Cost |
|-----------|---------|------|
| Frontend | Next.js on Vercel (free tier) | $0 |
| Database | Neon PostgreSQL + pgvector (free tier) | $0 |
| AI | Claude API (query expansion, intent classification, terminology bridge, passage ranking, ingestion QA, search eval) | ~$15-25/mo |
| Embeddings | OpenAI text-embedding-3-small | ~$0.10 one-time |
| PDF processing | marker (open-source Python) | $0 |
| Fonts | Google Fonts (Merriweather, Lora, Open Sans) | $0 |
| Error tracking | Sentry (free tier: 5K errors/mo) | $0 |
| Migrations | dbmate (open-source) | $0 |
| Analytics | Vercel Analytics (free tier) | $0 |
| SCM | GitHub (Phases 1–7) → GitLab (Phase 8+, SRF IDP) | $0 |
| CI/CD | GitHub Actions (Phases 1–7) → GitLab CI (Phase 8+) | $0 |

### Success Criteria

- A seeker can type "How do I overcome fear?" and receive 3–5 relevant, verbatim Yogananda quotes with accurate book/chapter/page citations
- "Read in context" links navigate to the correct passage in the reader
- Simple keyword searches ("divine mother") work without any LLM involvement
- Search latency < 2 seconds for hybrid queries
- Zero AI-generated content appears in any user-facing result
- The homepage displays a different Yogananda passage on each visit ("Today's Wisdom")
- "Show me another" loads a new random passage without page reload
- The book reader enforces 65–75 character line length
- "Find this book" links are present on every passage and link to the SRF Bookstore
- Search quality evaluation passes: ≥ 80% of test queries return at least one relevant passage in the top 3 results
- Sentry captures errors, structured logging works with request ID correlation

### Open Questions to Resolve

**Technical:**
- [ ] Optimal chunk size for Yogananda's prose style (test 200, 300, 500 token chunks)
- [ ] Embedding model benchmarking (text-embedding-3-small vs. 3-large vs. Cohere)
- [ ] Query expansion prompt engineering (test with diverse query types)
- [ ] @YoganandaSRF channel ID (needed for RSS feed URL in Phase 2)
- [ ] YouTube playlist inventory (map existing playlists to portal categories, needed for Phase 2)

**Stakeholder questions (require SRF input):**
- [ ] What is the relationship between this portal and the SRF/YSS app? Complementary or overlapping reader? Will the portal's search eventually power the app?
- [ ] Who will manage the editorial workflow — theme tagging, daily passage curation, text QA? Monastic order, AE team, or dedicated content editor?
- [ ] What does the philanthropist's foundation consider a successful outcome at 12 months? (Shapes analytics and reporting.)
- [ ] Can SRF provide center location data (addresses, coordinates, schedules) for an in-portal "Meditation Near Me" feature?
- [ ] What is SRF's copyright/licensing posture for the portal content? Read online only, or also downloadable/printable? What attribution is required?
- [ ] About page content: does SRF have approved biography text for Yogananda and descriptions of the line of gurus, or do we draft for their review?
- [ ] Does SRF/YSS have **digital text** of official translated editions? If only printed books, OCR per language is a massive effort requiring fluent reviewers. (Critical for Phase 9 scoping.)
- [ ] Which books have official translations in which languages? (Content availability matrix — determines what each language's portal experience looks like.)
- [ ] Who reviews the AI-drafted UI translations (~200–300 strings)? Claude generates drafts (ADR-023), but human review is mandatory. Does SRF have multilingual monastics or volunteers who can review for spiritual register and tone?
- [ ] Should Hindi and Bengali be prioritized alongside the Western-language set? Yogananda's heritage, YSS's Indian audience (~millions), and the mission of global availability argue strongly for inclusion. (ADR-022)
- [ ] For Hindi/Bengali: same portal domain (`teachings.yogananda.org/hi/`) or YSS-branded domain? Organizational question with architectural implications.
- [ ] Does the teaching portal get its own mobile app, or do portal features (search, daily passage, reader) integrate into the existing SRF/YSS app? The API-first architecture (ADR-024) supports either path.
- [ ] Does SRF prefer the portal repo in GitLab from day one (per SRF IDP standards), or is GitHub acceptable for Phases 1–7 with a planned Phase 8 migration? The Terraform code and CI/CD pipelines are SCM-agnostic; only the workflow files change.

---

## Phase 2: The Complete Portal

**Goal:** Build every page, establish the SRF visual identity, and deliver a complete portal experience that a stakeholder can navigate end-to-end.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 2.1 | **Full homepage — "The Living Library"** | Placeholder thematic doors (linked to pre-built search queries until Phase 4 populates the theme system), "Seeking..." empathic entry points (ADR-035), latest YouTube videos section using RSS feed + YouTube Data API (categorized playlists, ISR revalidation), and "Show me another" cross-fade upgrade (ADR-046). |
| 2.2 | **The Library and Book Landing** | `/books` page ("The Library") listing available books with cover images, editorial descriptions, chapter counts, and SRF Bookstore links. `/books/[slug]` book landing page with cover, metadata, featured quote, editorial description, and full chapter list. Warm, unhurried design even with a single book — honest "More books are being added" note with SRF Bookstore signpost. |
| 2.3 | **The Quiet Corner** | Single-page micro-sanctuary (`/quiet`): random affirmation from curated pool, optional gentle timer (1/5/15 min), chime at completion. No tracking, no accounts. Initially sourced from Autobiography's most contemplative passages. |
| 2.4 | **About page** | `/about`: Yogananda biography, line of gurus (with official portraits), SRF overview, "Go Deeper" links to SRF Lessons, center locator, Online Meditation Center, bookstore, app. |
| 2.5 | **Navigation and footer** | Persistent header nav (Search, Books, Videos, Quiet Corner, About). Footer with SRF ecosystem links and small Yogananda portrait (ADR-045) on every page. External links to yogananda.org, SRF Lessons, Online Meditation Center, SRF Bookstore, center locator, app, YouTube. Unified lotus SVG motif as section dividers and favicon (ADR-044). |
| 2.6 | **Passage sharing** | Every passage gets a quiet share icon. Generates `/passage/[id]` URL with OG meta tags for beautiful preview cards. Quote image generation via `@vercel/og` for download/sharing. Share menu: copy link, email passage (`mailto:` with pre-populated subject/body/URL), save as image, save as PDF (single-page, Merriweather, warm cream, lotus watermark, A4). No social media buttons or tracking scripts. (ADR-015, ADR-059) |
| 2.7 | **SEO foundations** | JSON-LD structured data (Book, WebSite, Organization schemas). Dynamic meta tags per page. Sitemap generation. Google Search Console setup. Theme pages as SEO entry points. |
| 2.8 | **Accessibility foundation** | WCAG 2.1 AA from day one. Semantic HTML, ARIA landmarks, keyboard navigation, skip links, focus indicators, screen reader testing, color contrast compliance, `prefers-reduced-motion` support, 44×44px touch targets. Automated a11y testing in CI via axe-core. Claude-generated reverential alt text for all Yogananda photographs (About page, footer, book covers), reviewed by SRF editors. (ADR-017, ADR-049 E7) |
| 2.9 | **i18n infrastructure** | All UI strings externalized to `messages/en.json`. `next-intl` configured with `en` as sole locale. CSS logical properties throughout (`ms-*` not `ml-*`). `lang` attribute on `<html>`. No hardcoded strings in components. `topic_translations` table created (empty until Phase 9). `content_tsv` trigger uses language-appropriate PostgreSQL dictionary. All content-serving API endpoints accept `language` parameter. English-only content, but the architecture is locale-ready. (ADR-020, ADR-021) |
| 2.10 | **Print stylesheet** | `@media print` stylesheet for reader and passage pages. Remove navigation, footer, side panel. Full-width text at optimal reading width. Merriweather at 11pt. Citation below each passage. Portal URL in small footer. Page breaks between chapters. No background colors. |
| 2.11 | **Text-only mode** | Toggle in site footer and reader settings. Disables images, decorative elements, web fonts (system serif stack). Stored in `localStorage`. Serves seekers on metered data connections. Not a degraded experience — a considered one. (ADR-061) |
| 2.12 | **Minimal Service Worker** | Cache app shell (HTML, CSS, JS, fonts) for instant repeat visits. No offline content yet — just static asset caching. Offline indicator banner: "You're reading offline. Search requires a connection." (ADR-061) |

### Success Criteria

- All pages exist and are navigable: homepage, search, reader, library, book landing, Quiet Corner, about, passage share
- Homepage has all sections: Today's Wisdom with cross-fade "Show me another", thematic doors, "Seeking..." entry points, YouTube videos
- The Quiet Corner displays an affirmation with a working gentle timer and chime
- About page shows Yogananda biography, line of gurus, "Go Deeper" links
- Passage sharing generates working OG preview cards
- Share menu offers: copy link, email passage, save as image, save as PDF
- Passage PDF generates clean A4 page with warm cream background, Merriweather type, lotus watermark, citation
- SEO structured data validates via Google's Rich Results Test
- All pages pass axe-core: zero critical or serious violations
- No hardcoded UI strings — all in `messages/en.json`
- The portal's visual design is recognizably SRF (Merriweather type, gold accents, warm palette, lotus motif)
- The video section displays recent @YoganandaSRF uploads and categorized playlists without manual intervention
- Print stylesheet works cleanly for reader and passage pages
- Text-only mode toggle works: disables images, decorative elements, web fonts
- Service Worker caches static assets; offline indicator displays when connectivity drops
- Homepage initial payload < 50KB (HTML + critical CSS + inline JS)

---

## Phase 3: Engineering Foundation

**Goal:** Establish testing infrastructure, infrastructure-as-code, design tooling, reader typography refinements, and the reader interactions that distinguish the portal from a standard web reader.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 3.1 | **Testing infrastructure** | Vitest + React Testing Library for unit/integration tests. Playwright for E2E tests (core user flows: search, read, share, Quiet Corner). axe-core in CI for accessibility. Lighthouse CI for performance budgets. Neon branch-per-test-run isolation. (ADR-028) |
| 3.2 | **Terraform infrastructure** | `/terraform` directory with modules for Neon (project, database, pgvector), Vercel (project, env vars), and Sentry (project, DSN). GitHub Actions pipeline: `terraform plan` on PR, `terraform apply` on merge. State in Terraform Cloud free tier. `.env.example` for local development. (ADR-031) |
| 3.3 | **Figma core screens** | Three Figma files (free tier): Home & Search, Reader & Content, Quiet & Utility. Design tokens exported to `tokens.json` → consumed by `tailwind.config.ts`. (ADR-030) |
| 3.4 | **"Dwell" passage contemplation mode** | Long-press (mobile, 500ms) or click hover-revealed dwell icon (desktop) on any paragraph dims surrounding text to 15% opacity, passage remains vivid, share/bookmark icons appear. `Escape` exits. Screen reader announcements on enter/exit. `prefers-reduced-motion`: instant transitions, dimming still occurs. Desktop: hover over paragraph for 1.5s reveals a small dwell activation icon at inline-start margin (12px circle, `--srf-gold` at 40% opacity). First-visit tooltip: "Hover over any passage to focus on it for contemplation." Dwell also updates Related Teachings side panel immediately (ADR-062). (ADR-038, ADR-060) |
| 3.5 | **Keyboard-first reading navigation** | Single-key shortcuts: `j`/`k` paragraphs, `d` dwell, `b` bookmark, `r` related, `s` settings, `→`/`←` chapters, `t` table of contents, `/` search bar, `?` help overlay. Suppressed when input focused. `Space` for next chapter only at bottom of page. (ADR-042, ADR-050) |
| 3.6 | **Lotus bookmarks** | localStorage-based bookmarks. Lotus icon (SVG, `--srf-gold`) in reader header for chapter bookmarks and in dwell mode for passage bookmarks. `/bookmarks` page listing all bookmarked chapters and passages by book. No server interaction, no accounts, no tracking. Phase 12 migration to server sync when accounts arrive. (ADR-041) |
| 3.7 | **Storybook component library** | Storybook setup documenting all portal components. Design token visualization. Interactive component states. Foundation for Calm Technology design system. |
| 3.8 | **Reader typography refinements** | Drop capitals at chapter starts (Merriweather 700, `--srf-navy`, 3-line `::first-letter`), decorative opening quotation marks on displayed passages (Merriweather 700, 48px, `--srf-gold` at 40% opacity), chapter epigraph treatment (centered, Merriweather 300, muted, generous whitespace), CSS-only paper texture (inline SVG noise pattern), optical margin alignment (`hanging-punctuation` progressive enhancement), citation formatting with em dashes. (ADR-037) |
| 3.9 | **Reading time estimate + scroll position + reader settings** | Chapter reading time estimate below chapter title (~X min, disappears on scroll). Scroll position indicator (2px `--srf-gold` at 30% opacity, top of viewport — spatial awareness, not progress tracking). Consolidated reader settings popover: text size (A-/A/A+), color theme (auto/light/dark), line spacing (compact/normal/relaxed). All persisted in `localStorage`. No percentage, no countdown, no completion tracking. (ADR-050) |
| 3.10 | **Last-read chapter caching** | Service Worker caches the most recently read chapter HTML. If connectivity drops, the seeker can re-read that chapter offline. Graceful, not full offline support. (ADR-061) |
| 3.11 | **KaiOS emulator in CI** | Add KaiOS browser emulator to the testing matrix. Critical flows (search, read chapter, navigate) must pass on feature phone browsers. (ADR-061) |

### Success Criteria

- CI pipeline runs all test layers (lint, type check, unit, integration, E2E, a11y, Lighthouse) on every PR — all must pass before merge
- `terraform apply` creates a complete development environment from scratch
- "Dwell" interaction works: long-press (mobile) / hover-revealed icon click (desktop) dims surrounding text, shows share/bookmark icons. Related Teachings side panel updates immediately on dwell. (ADR-038, ADR-060, ADR-062)
- Full keyboard navigation: `j`/`k` paragraphs, `d` dwell, `b` bookmark, `→`/`←` chapters, `?` help overlay (ADR-042)
- Lotus bookmarks work via `localStorage` — bookmark chapters and passages without an account, view on `/bookmarks` page (ADR-041)
- Storybook documents all portal components with interactive states
- Drop capitals appear at chapter starts, decorative gold quotation marks on displayed passages, chapter epigraphs styled distinctly (ADR-037)
- KaiOS emulator passes critical flows (search, read, navigate)

---

## Phase 4: Multi-Book Expansion & Themes

**Goal:** Ingest high-impact books to reach critical mass of quotable, thematically diverse content. Activate the teaching topics navigation ("Doors of Entry") with cross-book thematic tagging.

**Book ingestion priority** (per ADR-012 — life-impact ordering):

| Wave | Books | Rationale |
|------|-------|-----------|
| **First** | *Where There Is Light*, *Sayings of Paramahansa Yogananda*, *Scientific Healing Affirmations* | Short, topically structured, low chunking complexity. Directly power Today's Wisdom, Doors of Entry, and Quiet Corner. |
| **Second** | *Man's Eternal Quest*, *The Divine Romance* | Collected talks — rich, practical, accessible. Moderate chunking complexity. |
| **Third** | *How You Can Talk With God*, *Metaphysical Meditations*, *Journey to Self-Realization* | Short works and third volume of collected talks. |
| **Fourth** | *Wine of the Mystic*, *The Second Coming of Christ* (2 vols), *God Talks With Arjuna* (2 vols) | Niche or massive multi-volume works requiring verse-aware chunking. |

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 4.1 | **Ingest first-wave books** | *Where There Is Light*, *Sayings of Paramahansa Yogananda*, *Scientific Healing Affirmations*. Short, topically organized, low-complexity. Claude classifies passage accessibility level (universal/accessible/deep) at ingestion time — spot-checked by reviewer. (ADR-049 E3) |
| 4.2 | **Teaching topic tagging pipeline** | Semi-automated: embed theme descriptions → cosine similarity against all chunks → candidates above threshold get `tagged_by='auto'` → optional Claude classification for ambiguous cases → mandatory human review → `tagged_by='reviewed'`. Three-state provenance: `manual`, `auto`, `reviewed`. Only `manual` and `reviewed` tags served to users. Initial pass: six quality themes (Peace, Courage, Healing, Joy, Purpose, Love). Add situation themes (Relationships, Parenting, Loss & Grief, Work, etc.) and practice themes (Meditation, Concentration, Affirmation, etc.) incrementally — editorial judgment decides when a topic has enough depth to publish (no fixed minimum count). (ADR-048, ADR-058) |
| 4.3 | **Doors of Entry + Explore all themes** | Activate `/themes/[slug]` pages with curated passages from across all books. Each visit shows a different random selection. Homepage shows six quality-theme doors; "Explore all themes →" links to `/themes` index page with sections for quality, situation, and practice themes. Replace Phase 2 placeholder doors with live theme navigation. Person, principle, and scripture categories added in Phase 5 when multi-book content enables meaningful coverage. (ADR-048, ADR-058) |
| 4.4 | **Expand Today's Wisdom pool** | Populate `daily_passages` from *Sayings* (entire book is standalone quotes) and *Where There Is Light*. Add optional seasonal affinity tags. Claude classifies tone (consoling/joyful/challenging/contemplative/practical) per passage — selection algorithm ensures tonal variety across the week. Default to accessibility level 1–2 passages for newcomer-friendly homepage. (ADR-049 E8, E3) |
| 4.5 | **Expand Quiet Corner pool** | Populate `affirmations` from *Scientific Healing Affirmations* and *Metaphysical Meditations*. |
| 4.6 | **Cross-book search** | Search spans all books by default. Optional book filter. Results show which books address a topic. |
| 4.7 | **Expanded book catalog** | The Library (`/books`) and book landing pages (`/books/[slug]`) established in Phase 2 now display the full multi-book catalog. Book cards show cross-book search availability. Sort/filter by theme or publication year. |
| 4.8 | **Calendar-aware content surfacing** | `calendar_events` and `calendar_event_passages` tables. Editorially curated date-to-passage associations for Yogananda's life events, Hindu/Christian calendar, and universal observances. Homepage "Today's Wisdom" draws from the calendar pool when a relevant date falls. (ADR-056) |
| 4.9 | **The Quiet Index** | Combine E3 (accessibility rating) and E8 (tone classification) into browsable routes: `/quiet/contemplative`, `/quiet/practical`, `/quiet/devotional`, `/quiet/philosophical`, `/quiet/narrative`. Extends the Quiet Corner with texture-based passage browsing. (ADR-056) |
| 4.10 | **Editorial review portal (minimal)** | Auth0-protected `/admin` route group built with the portal's calm design system. Editorial home screen with role-filtered summary. Theme tag review queue (keyboard-driven: `a` approve, `r` reject, `→` next). Daily passage curation with 7-day lookahead. Calendar event ↔ passage association management. Content preview ("preview as seeker" for themes and daily passages). Tone/accessibility spot-check workflow. Session continuity (resume where you left off). Auth0 roles: `editor`, `reviewer`. Email digest for daily review notifications via scheduled serverless function. (ADR-064) |

### Key Challenges

- **Theme tagging quality:** Semi-automated tagging (embeddings) must be validated by human reviewers. A bad theme assignment (a passage about death tagged as "Joy") would undermine trust. Only `manual` and `reviewed` tags are served to users — never unreviewed `auto` tags. (ADR-048)
- **Theme taxonomy expansion:** Multi-category taxonomy: six quality themes on the homepage (stable); situation, practice, person, principle, scripture, and yoga_path categories added incrementally. No fixed minimum passage count — editorial judgment decides when a topic has enough depth to publish. (ADR-048, ADR-058)
- **Editorial review portal scope:** Phase 4 delivers the minimal admin portal. Avoid over-engineering — build only the review workflows demanded by Phase 4 content features (theme tags, daily passages, calendar events). Social media, translation, and impact views come in later phases as those features create demand. (ADR-064)

---

## Phase 5: Related Teachings & Reader Intelligence

**Goal:** Launch the Related Teachings system — pre-computed chunk relations, reader side panel, "Continue the Thread" end-of-chapter suggestions, and graph traversal across the library. This is the feature that makes the portal irreplaceable: no physical book, PDF, or ebook can surface cross-book connections while you read. (ADR-034)

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 5.1 | **Chunk relation computation** | Batch job to compute `chunk_relations` for all ingested books. Incremental mode for new books, full mode for embedding model changes. Excludes same-chapter adjacent paragraphs. Stores top 30 per chunk. For top 10 cross-book relations per chunk, Claude classifies the relation type (`same_topic`, `develops_further`, `personal_story`, `practical`) — enables contextual labels like "Yogananda explores this idea at greater length in..." in the side panel. Spot-checked by reviewer. (ADR-034, ADR-049 E6) |
| 5.2 | **Related content API** | `/api/v1/chunks/[id]/related` (per-paragraph, on-demand tier) and `/api/v1/chapters/[slug]/[number]/relations` (batch prefetch — all paragraph relations for an entire chapter in one response, ~30–50KB). `/api/v1/chapters/[slug]/[number]/thread` (chapter-level aggregation for "Continue the Thread"). Filter support: by book, language, theme, content type. Realtime vector fallback when pre-computed results are sparse. **Batch prefetch API is a core Phase 5 deliverable, not deferred as optimization** — it enables the reading session (5.9) and instant side panel updates. (ADR-034, ADR-062) |
| 5.3 | **Improved reader with Related Teachings** | Related Teachings side panel powered by pre-computed `chunk_relations`. Settled paragraph model: Intersection Observer with focus zone root margin, prominence scoring, 1.2s debounce — side panel updates quietly as reader settles. Source indication in side panel header ("Related to: 'My body became...'"). Dwell mode as manual override (immediate update, no debounce). Two-axis progressive enhancement: screen width determines presentation (side panel ≥ 1024px, pill + bottom sheet < 1024px); data budget determines loading (batch prefetch / on-demand / none). "Continue the Thread" in side panel below per-paragraph relations (not inline in reading column). Next Chapter is the primary end-of-chapter invitation. Graph traversal navigation. (ADR-034, ADR-062) |
| 5.4 | **Editorial cross-references** | `chunk_references` table for human-curated cross-references (explicit mentions like "As my guru Sri Yukteswar taught..." → link to that passage). Supplements automatic embedding-based relations. |
| 5.5 | **Related content quality evaluation** | Test suite of ~50 representative paragraphs with human-judged expected relations. Validates thematic relevance, cross-book diversity, no false friends. Regression gate for content re-ingestion and embedding model changes. |
| 5.6 | **Editorial reading threads** | `editorial_threads` and `thread_passages` tables. Curated multi-book reading paths: human-selected passages sequenced to trace a spiritual theme as a coherent progression. `/threads` index and `/threads/[slug]` reading experience. Optional editorial transition notes between passages. `is_published` human review gate. (ADR-054) |
| 5.7 | **Reverse bibliography** | `external_references` and `chunk_external_references` tables. Claude extracts external source references (Bhagavad Gita, Bible, Patanjali, Kabir, Einstein, etc.) from each chunk at ingestion time. `/references` index and `/references/[slug]` pages showing every passage where Yogananda engages with that source. Three-state `tagged_by` provenance. (ADR-055) |
| 5.8 | **Exploration theme categories** | Activate `person`, `principle`, and `scripture` theme categories. Seed themes: Christ, Krishna, Lahiri Mahasaya, Sri Yukteswar, Patanjali, Divine Mother (person); 10 Yama/Niyama principles (principle); Yoga Sutras, Bhagavad Gita, Bible, Rubaiyat (scripture). Same tagging pipeline as quality/situation themes. `/themes` page gains new sections. (ADR-058) |
| 5.9 | **Reading session — proactive chapter caching** | Service Worker detects sequential chapter reading (2+ chapters from same book). Proactively caches next 2 chapters (HTML + relations data for batch tier). LRU eviction: current + 2 ahead + 2 behind. Offline chapter transitions serve from cache with offline banner. Uncached chapters show gentle redirect to nearest cached chapter. No reading history stored — ephemeral SW state only. (ADR-063) |

### Key Challenges

- **Related content quality:** Pre-computed chunk relations must be thematically relevant, cross-book diverse, and free of "false friends" (superficially similar text with unrelated meaning). The quality test suite (5.5) is the regression gate.
- **Relation computation at scale:** As the corpus grows from ~2K chunks (Phase 1) to ~50K (all books), incremental relation updates must remain efficient. Each new book triggers O(N_new × N_existing) comparisons — manageable with vectorized computation but must be monitored.

---

## Phase 6: Completing the Library & Observability

**Goal:** Ingest the remaining book waves to complete the full Yogananda library. Add production observability.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 6.1 | **Ingest second- and third-wave books** | Collected talks (*Man's Eternal Quest*, *The Divine Romance*) and shorter works (*How You Can Talk With God*, *Metaphysical Meditations*, *Journey to Self-Realization*). Standard chunking. Incremental chunk relation computation for each new book. |
| 6.2 | **Verse-aware chunking** | Adapt chunking strategy for verse-by-verse commentary structure. Required before fourth-wave ingestion. |
| 6.3 | **Ingest fourth-wave books** | *The Second Coming of Christ* (2 vols), *God Talks With Arjuna* (2 vols), *Wine of the Mystic*. |
| 6.4 | **Search analytics dashboard** | Retool admin panel showing anonymized query trends ("What is humanity searching for?"). Simple queries against the raw `search_queries` table — no aggregation infrastructure needed at this scale. |
| 6.5 | **Amplitude analytics (DELTA-compliant)** | Amplitude configured with explicit event allowlist. No user identification, no session tracking, no autocapture. Events: `page_viewed`, `passage_served`, `share_link_generated`, `center_locator_clicked`, `search_performed`. (ADR-029) |
| 6.6 | **New Relic APM integration** | New Relic agent for API route performance, database query timing, Claude API call monitoring. Synthetic uptime checks on key endpoints. (ADR-029) |

### Key Challenges

- **Verse-aware chunking** for the scriptural commentaries (fourth wave) requires a different strategy than narrative or collected-talk books. The verse-commentary structure needs special handling to preserve the verse → commentary relationship in search results and the reader.

---

## Phase 7: Outreach & Content Distribution

**Goal:** Extend the portal's reach beyond direct visitors through daily email, social media assets, events signposting, and the Sacred Places page.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 7.1 | **Daily email — non-personalized** | Email subscriber infrastructure (double opt-in, unsubscribe). Daily verbatim passage email via Resend or AWS SES. All subscribers receive the same passage. No tracking pixels, no open-rate tracking. (ADR-018) |
| 7.2 | **Social media asset generation** | Portal generates shareable quote images in multiple aspect ratios (1:1, 9:16, 16:9) via `/api/v1/og/[chunk-id]?format=...`. Admin Retool panel for reviewing and approving generated assets. Human distribution — never auto-post. (ADR-019) |
| 7.3 | **Events section** | Static events page or About page section linking to World Convocation (`convocation.yogananda.org`), commemorations (Mahasamadhi, Janmashtami, Christmas meditation), Online Meditation Center, and retreats. Signpost, not destination. (ADR-026) |
| 7.4 | **Sacred Places — SRF/YSS properties** | Dedicated `/places` page with SRF/YSS centers and temples. Contemplative descriptions, property photographs, "Get Directions" links, and cross-references to Autobiography passages via `chunk_places` junction table. No maps. (ADR-026) |
| 7.5 | **Chapter and book PDF downloads** | Server-side PDF generation for chapters and full books. Book-like typographic treatment: cover page, table of contents, running headers, page numbers, Merriweather serif, lotus watermark on first page. A4 page size. Cached (regenerated only on content update). API: `GET /api/v1/pdf/chapter/{book-slug}/{chapter}`, `GET /api/v1/pdf/book/{book-slug}`. (ADR-059) |
| 7.6 | **Presentation mode** | "Present" button in reader header. Enlarges text to 24px+, hides all chrome, swipe/arrow-key chapter navigation only. Warm cream fills viewport. For group reading, satsang, study circles. A CSS mode (`data-mode="present"`), not a separate feature. (ADR-061) |
| 7.7 | **Social media asset review workflow** | Add social media review to the editorial review portal: today's quote image at actual platform dimensions (1:1, 9:16, 16:9), caption with inline editing, per-platform download, weekly lookahead. "Mark as posted" tracking per platform (not automation). (ADR-064, ADR-019) |

---

## Phase 8: Contentful Integration

**Goal:** Migrate from PDF-ingested content to Contentful as the editorial source of truth. Establish the Contentful → Neon sync pipeline. Migrate to SRF's GitLab IDP.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 8.1 | **Contentful content model** | Book → Chapter → Section → TextBlock content types configured in Contentful. |
| 8.2 | **Content import to Contentful** | Import the QA'd book text into Contentful entries (possibly from the clean Neon data). |
| 8.3 | **Webhook sync service** | Contentful publish webhook → serverless function → extract text → embed → upsert Neon → incremental chunk relation update (ADR-034). |
| 8.4 | **Reader migration to Contentful** | Book reader pages generated via SSG from Contentful API (ISR for updates). |
| 8.5 | **Admin editorial workflow** | Full editorial bridge between Contentful authoring and portal review queues. Content editors update text in Contentful and see changes reflected in both reader and search. Review workflows in the admin portal link back to Contentful entries for editing. (ADR-064) |
| 8.6 | **Contentful Custom Apps** | Sidebar panels built with Contentful's App Framework: theme tag status on TextBlock entries, thread preview on editorial thread entries, calendar passage associations on calendar event entries, topic readiness indicators on teaching topic entries. Contextual bridges that keep editors oriented without leaving Contentful. (ADR-064) |
| 8.7 | **GitLab migration** | Migrate repo from GitHub to GitLab (SRF IDP). Migrate CI/CD from GitHub Actions to GitLab CI. Migrate Terraform state from Terraform Cloud to GitLab Terraform backend. Set up four standard environments (dev/qa/stg/prod) per SRF convention. (ADR-031) |
| 8.8 | **Terraform expansion** | Add Terraform modules for Contentful (space, content model, webhooks) and Cloudflare (DNS, WAF). Full environment replication via `terraform workspace`. |

### Key Challenge

Contentful free tier (10,000 records, 2 locales). At paragraph granularity, a large book like The Second Coming (~10,000+ paragraphs across 2 volumes) could approach this limit for a single book. Evaluation needed:
- Can we use section-level granularity in Contentful (fewer entries) while maintaining paragraph-level chunks in Neon?
- Is a paid Contentful space necessary?

---

## Phase 9: Multi-Language Support

**Goal:** Serve book content and search in multiple languages. Activate the i18n infrastructure built in Phase 2 with real translated content.

(See ADR-020, ADR-021, ADR-022 for architectural rationale.)

*Note: Phase 2 builds the i18n infrastructure (externalized strings, locale routing, CSS logical properties). This phase activates it with translated content and UI translations.*

### Language Waves

| Wave | Languages | Rationale |
|------|-----------|-----------|
| **Western** | es, de, fr, it, pt, ja | Matches convocation site. SRF's existing translation infrastructure. Known publication history. |
| **Indian** | hi, bn | YSS audience. Yogananda's heritage languages. Massive population reach (~830M speakers). |
| **Evaluation** | Evaluate based on demand, translations, SRF/YSS input | Candidates: zh (Chinese), ko (Korean), ru (Russian), ar (Arabic — requires RTL). |

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 9.1 | **UI translations (Western wave)** | AI-assisted translation of all UI strings (`messages/*.json`) into es, de, fr, it, pt, ja: Claude drafts → human review by fluent, SRF-aware reviewer → production (ADR-023). Language selector in header. Locale cookie persistence. |
| 9.2 | **Localized book content (Western wave)** | Ingest officially translated book text into Neon with language-specific chunks. Contentful locale variants in production. Content availability matrix determines which books appear per language. |
| 9.3 | **Per-language search** | Language-specific tsvector columns with appropriate Postgres dictionaries. Multilingual embedding model benchmarking — may trigger first embedding model migration via ADR-032 workflow. Language-aware `hybrid_search` function. |
| 9.4 | **English fallback** | When user's language has insufficient results, supplement with clearly marked English passages. `[EN]` tag on fallback content. "Read in English →" links. |
| 9.5 | **Per-language SEO** | `hreflang` tags on every page. Per-locale sitemaps. Localized meta tags and page titles. JSON-LD `inLanguage` field. |
| 9.6 | **Non-Latin font support** | Conditional loading of Noto Serif JP / Noto Sans JP (Japanese). Indian wave adds Noto Serif Devanagari, Noto Serif Bengali. |
| 9.7 | **UI translations + content (Indian wave)** | Hindi and Bengali UI translations (same AI-assisted workflow as 9.1). Ingest YSS-published translations. Devanagari and Bengali font loading. |
| 9.8 | **Cross-language passage alignment** | Link translated chunks to their English originals via `canonical_chunk_id`. Enables "Read this passage in Spanish →" navigation between editions. Alignment done during ingestion by matching (canonical_book_id, chapter_number, paragraph_index); edge cases resolved in human QA. |
| 9.9 | **Language-aware chunk relations** | Recompute `chunk_relations` with per-language strategy: top 30 same-language + top 10 English supplemental relations per non-English chunk. Ensures non-English languages get first-class related teachings without constant real-time fallback. English supplemental relations are marked with `[EN]` in the UI, consistent with the search fallback pattern. |
| 9.10 | **Per-language search quality evaluation** | Dedicated search quality test suite per language (15–20 queries with expected passages from that language's corpus). Must pass before that language goes live. Mirrors Phase 1's English-only evaluation (Deliverable 1.11). Includes per-language chunk size validation — English-calibrated chunk sizes may need adjustment for CJK and Indic scripts. |
| 9.11 | **Per-language presentation adaptations** | Language-conditional reader typography (drop capitals for Latin scripts only; CJK line-height adjustment to 1.6–1.7). Non-Latin font support for OG quote images (`@vercel/og` requires explicit font files per script). Non-Latin print stylesheet font stacks. Non-Latin email font stacks (system fonts, not web fonts — tested across top email clients per market). Cultural adaptation of "Seeking..." entry points (editorial, not mechanical translation). Per-language bookstore links via `books.bookstore_url` column (if per-language routing is needed, add a simple lookup table then — ADR-051). Spiritual terminology glossary per locale (`/messages/glossary-{locale}.json`) built incrementally during first human review cycle (ADR-023). |
| 9.12 | **Translation review UI** | Add translation review workflow to the editorial review portal: side-by-side English source and AI draft display, UI context notes ("this appears on the search button"), inline editing, `[REVIEW]` flagging, batch view (40–100 strings per session), progress indicator per locale. Auth0 role `translator:{locale}` for scoped volunteer reviewer access — German reviewer sees only German queue. (ADR-064, ADR-023) |
| 9.13 | **Impact dashboard** | Leadership-facing read-only view at `/admin/impact`: countries reached (warm-toned world map), content growth over time, "What is humanity seeking?" (anonymized search themes), Global South accessibility indicators, content availability matrix by language. Auth0 role `leadership`. Refreshed nightly from Neon aggregates. (ADR-064) |

### Key Challenges

- **Content availability asymmetry:** Not all books exist in all languages. The portal must gracefully handle sparse content per locale — honest about what's missing, not pretending it doesn't exist.
- **Embedding model selection:** Does OpenAI text-embedding-3-small produce acceptable retrieval quality for all target languages? Benchmark with actual translated passages. Fallback: per-language models (higher quality, more operational complexity).
- **Per-language chunk size validation:** English-calibrated chunk sizes (200/300/500 tokens) may produce different semantic density across scripts — CJK and Indic tokenization differs significantly. Validate retrieval quality per language before committing to chunk sizes.
- **Spiritual terminology:** Sanskrit terms (samadhi, karma, dharma, prana) are handled differently across translations. Search must find passages regardless of whether the translation keeps the Sanskrit or uses a local equivalent. The spiritual terminology glossary (`/messages/glossary-{locale}.json`) is a critical dependency.
- **Digital text availability:** The single highest-impact dependency. If SRF/YSS only has printed translations, per-language OCR with fluent reviewers is required — a major effort.
- **UI translation quality:** "What are you seeking?" must sound inviting in Japanese, not clinical. Professional human translation required — not machine translation. The "Seeking..." entry points need cultural adaptation, not mechanical translation.
- **Non-Latin presentation:** OG images, print stylesheets, email templates, and reader typography all need per-script adaptations. Drop capitals are Western; CJK line-height differs; email clients don't support web fonts for non-Latin scripts.
- **YSS branding:** Hindi/Bengali content may need YSS branding rather than SRF branding. Organizational question with design implications. (Deferred for now.)

---

## Phase 10: Accessibility Audit & Calm Technology Polish

**Goal:** Elevate the UI to a world-class "digital sanctuary" experience. Conduct formal accessibility audit. Implement the contemplative reader features deferred from earlier phases.

*Note: Core accessibility (semantic HTML, ARIA, keyboard nav, color contrast, screen reader support) is built from Phase 2, not introduced here. This phase adds advanced features, formal audit, the shared design system, and reader polish (circadian reading, chapter transitions, opening moment).*

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 10.1 | **Calm Technology design system** | Shared component library (npm package) implementing SRF's visual language. Reusable across properties. Accessibility baked into every component. |
| 10.2 | **Formal WCAG 2.1 AA audit** | Third-party accessibility audit. Remediate any gaps. Real-user testing with assistive technology users. Pursue WCAG 2.1 AAA for reading content where achievable. |
| 10.3 | **Reading mode** | Distraction-free reading view. Adjustable font size. Sepia/dark mode for evening reading (`prefers-color-scheme` support). High-contrast mode (`prefers-contrast` support). |
| 10.4 | **Time-aware reading — circadian color temperature** | Subtly shifts background warmth by time of day: morning (cooler cream), midday (standard), evening (warmer cream), night (optional `--srf-navy` dark mode). Opt-out via sun/moon toggle, preference in `localStorage`. `prefers-color-scheme: dark` always respected as override. Entirely client-side, DELTA-compliant. (ADR-039) |
| 10.5 | **"Breath Between Chapters"** | 1.2-second pause showing only chapter title on prev/next navigation. Chapter text fades in over 400ms. Skipped for direct URL navigation, deep links, and `prefers-reduced-motion`. (ADR-040) |
| 10.6 | **Opening moment — portal threshold** | First visit per session: warm cream background with small lotus SVG (40px, `--srf-gold` at 30%), fades after 800ms as homepage content appears. Total ~1.2s. Skipped for `prefers-reduced-motion`, deep links, and repeat visits within session. (ADR-043) |
| 10.7 | **Visual regression testing** | Playwright screenshot comparison for reader, passage cards, Quiet Corner, search results. Catches unintended visual changes on every PR. |
| 10.8 | **Text-to-Speech** | Native TTS integration for the book reader. Synchronized highlighting of spoken text. |
| 10.9 | **Responsive design polish** | Optimize for mobile, tablet, and desktop. Touch-friendly search and reading on mobile. Low-bandwidth mode for Global South accessibility. |
| 10.10 | **Progressive Web App** | Web App Manifest with SRF branding. Service Worker for offline book reading and Quiet Corner. Cache-first for chapters, stale-while-revalidate for daily passage, network-only for search. Installable on mobile home screens. Offline indicator: "You're reading offline. Search requires a connection." (ADR-025) |
| 10.11 | **Sacred Places — biographical sites and Street View** | Add biographical/historical sites (Gorakhpur, Serampore, Puri, Varanasi, Dakshineswar). "See This Place" Street View links on place cards (ADR-047). Reader ↔ Place cross-reference cards: margin cards in the reader linking to places, and place pages listing all referencing passages with deep links. (ADR-026, ADR-047) |

---

## Phase 11: Cross-Media Search & Video Transcription

**Goal:** Transcribe monastic talks and make them searchable alongside books — enabling a unified search across all SRF content (text + video).

*Note: Basic YouTube video display (RSS + API, categorized playlists) is delivered in Phase 2. This phase adds deep cross-media intelligence.*

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 11.1 | **YouTube transcript ingestion** | `video_transcripts` and `video_chunks` tables. Start with YouTube auto/manual captions (free); upgrade to Whisper API ($0.006/min) where quality is insufficient. Chunk and embed transcripts into Neon using the same embedding model and FTS strategy as book chunks. Word-level timestamps on every chunk enable time-synced playback. Estimated one-time cost for full SRF YouTube library (~500 videos): $150–300 via Whisper. (ADR-057) |
| 11.2 | **Cross-media search** | Extend `hybrid_search` to query `video_chunks` alongside `book_chunks`. Results interleave book passages and timestamped video segments, ranked by unified RRF. Video results link to `youtube.com/watch?v={id}&t={start_seconds}`. (ADR-057) |
| 11.3 | **Cross-media chunk relations** | Pre-computed `chunk_relations` span book chunks and video chunks. The reader's Related Teachings panel shows timestamped video segments alongside book passages: *"Brother Chidananda discusses this teaching (12:34)"*. (ADR-034, ADR-057) |
| 11.4 | **Synchronized transcript display** | Video player page (`/videos/[id]`) with synchronized transcript panel: text scrolls to follow playback, each paragraph is clickable (jumps to timestamp), book passages referenced in the talk appear as margin cards linking to the reader. (ADR-057) |
| 11.5 | **Video player with book links** | When a monastic mentions a book, the video player sidebar links directly to those books in the reader. Related Teachings panel in the video player shows book passages related to the current video segment. |
| 11.6 | **"Wisdom bites"** | Admin tool (Retool) to clip 2-5 minute segments from talks. Serve as daily inspiration on the homepage. |

---

## Phase 12: Optional User Accounts & Personalization

**Goal:** Allow seekers to create accounts for personal study features, without requiring registration for basic access.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 12.1 | **Optional authentication** | Evaluate lightest mechanism for cross-device sync: magic links, passkeys, or Auth0 (if SSO with other SRF properties is required). Sign-in is never required for reading or search. |
| 12.2 | **Bookmarks and highlights** | Save favorite passages from search results or the reader. Migrate Phase 3 localStorage bookmarks to server sync on login. |
| 12.3 | **Reading progress** | Track reading position per book. Cross-device sync. |
| 12.4 | **Search history** | Personal search history (opt-in, private). |
| 12.5 | **Personalized daily passage** | Personalized daily quote based on reading history and interests. (Note: the anonymous, non-personalized "Today's Wisdom" is delivered in Phase 1. This adds account-based personalization.) |
| 12.6 | **Personalized daily email** | Logged-in subscribers choose preferred themes. Daily email selects from theme-tagged passages matching preferences. Extends the non-personalized daily email from Phase 7. (ADR-018) |

---

## Phase 13: Community & Events

**Goal:** Bridge the solitary study experience with the global SRF community.

### Deliverables

| # | Deliverable | Description |
|---|-------------|-------------|
| 13.1 | **Event calendar** | Time-zone-adjusted display of global SRF events (meditations, convocation, commemorations). |
| 13.2 | **Local center discovery ("Meditation Near Me")** | Geo-located finder for physical SRF temples, centers, and meditation groups. Map + list view. Requires center data from SRF. (Note: Phase 2 includes an external link to SRF's existing center locator in the About page and footer. This phase builds a native in-portal experience.) |
| 13.3 | **Live event integration** | Deep links to Zoom/YouTube Live for online meditation events. |
| 13.4 | **Online meditation resources** | Curated links and schedule for SRF's Online Meditation Center. Time-zone-adjusted display of upcoming live meditations. |

---

## Cost Trajectory

| Phase | Estimated Monthly Cost | Notes |
|-------|----------------------|-------|
| Phases 1–3 | ~$5-10 | Neon free, Vercel free, minimal Claude API usage, one-time embedding cost |
| Phases 4–5 | ~$10-15 | More embedding generation for multi-book corpus and chunk relations |
| Phases 6–7 | ~$15-30 | Full library embedded, daily email service costs |
| Phase 8 | ~$50-100+ | Contentful paid tier likely needed, Lambda functions |
| Phase 9+ | Requires evaluation | Multi-language embeddings, increased storage, higher API traffic |

---

## Dependencies and Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **PDF OCR quality** | Corrupted text → bad search results | Human QA step (1.3) is mandatory. Budget review time. SRF has original text for production use. |
| **Contentful free tier limits** | Cannot model full corpus at paragraph level | Evaluate hybrid: section-level in Contentful, paragraph-level in Neon only |
| **Embedding model quality** | Poor retrieval for Yogananda's vocabulary | Benchmark multiple models (Phase 1 task). Yogananda uses precise, sometimes archaic spiritual terminology. |
| **Chunk size sensitivity** | Too small = orphaned fragments. Too large = imprecise retrieval. | Empirical testing in Phase 1 with diverse query types. |
| **Stakeholder expectation** | "AI search" may imply a chatbot | Clear communication: this is a librarian, not an oracle. No synthesis. |
| **SEO discoverability** | Portal serves only people who already know it exists | Deliberate SEO strategy from Phase 2: structured data, theme pages as entry points, meta tags, sitemap. |
| **Portal/app overlap** | Building a duplicate reader alongside the SRF/YSS app | Clarify relationship with SRF AE team early. Portal may complement (search + public reading) rather than replace (private Lessons reading) the app. |
| **Editorial governance** | No defined process for theme tagging, daily passage curation, content QA | Establish editorial roles and workflows before Phase 4. Determine whether monastic order, AE team, or dedicated editor owns this. The editorial review portal (ADR-064, deliverable 4.10) provides the tooling; the organizational question of *who* uses it requires SRF input. |
| **Copyright/licensing ambiguity** | Unclear terms for free access (read-only vs. downloadable vs. printable) | Resolve with SRF legal before launch. Display clear attribution on every page. |
| **Global South accessibility** | Many seekers access via mobile on limited bandwidth (India, Africa, Latin America) | Mobile-first design. Performance budgets (< 100KB initial load). Low-bandwidth text-only mode. Consider PWA for offline access of bookmarked passages. |
| **"What next" gap** | Seeker is moved by a passage but portal offers no path to practice | "Go Deeper" section in About, footer ecosystem links, and Quiet Corner all point toward SRF Lessons, local centers, and online meditation. Not a sales funnel — a signpost. |

---

*Last updated: 2026-02-19*