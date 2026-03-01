# SRF Online Teachings Portal — Architecture Decision Records (Operations)

> **Scope.** This file contains ADRs from the **Staff & Community**, **Brand & Communications**, **Operations & Engineering**, and **Governance** groups. These govern how the portal is built, operated, and evolved. For the navigational index and group summaries, see [DECISIONS.md](DECISIONS.md). For other ADR files, see the links in the index.
>
> **Living documents.** ADRs are mutable. Update them directly — add, revise, or replace content in place. When substantially revising an ADR, add `*Revised: [date], [reason]*` at the section's end. Git history serves as the full audit trail.

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
- "Seeking..." empathic entry point text (Milestone 5b — cultural adaptation per locale)
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
| **Theme tag review** | Milestone 3b | Passage displayed with full citation. Theme name and description visible. Similarity score and AI confidence shown (but not as primary decision input). Approve, reject, or adjust relevance weight. Keyboard shortcuts: `a` approve, `r` reject, `→` next. |
| **Daily passage curation** | Milestone 3b | 7-day lookahead calendar. Each day's passage shown with tone badge. Swap from pool. Flag inappropriate timing (e.g., a "challenging" passage on a holiday). |
| **Calendar event management** | Milestone 3b | Event list with dates. For each event, associated passages shown. Add/remove associations. Preview how the homepage will look on that date. |
| **Social media asset review** | Milestone 5a | Today's quote image at actual platform dimensions (1:1, 9:16, 16:9). Caption below with inline editing. Download per platform. Mark as "posted" per platform (tracking, not automation). Weekly lookahead view. |
| **Translation review** | Milestone 5b | Side-by-side: English source string and AI draft. UI context note ("this appears on the search button"). Approve, edit inline, or flag `[REVIEW]`. Batch view (40–100 strings per session). Progress indicator per locale. |
| **Ingestion QA review** | Milestone 3b+ | Flagged passages with Claude's suggestion and confidence. Accept correction, reject (keep original), or edit manually. Grouped by flag type (OCR error, formatting, truncation). |
| **Tone/accessibility spot-check** | Milestone 3b | Random sample of classified passages. "Does this feel `contemplative`? Is this `universal`-level accessibility?" Confirm or reclassify. |
| **Content preview** | Milestone 3b | "Preview as seeker" — see exactly what a theme page, daily passage, or editorial thread will look like before publication. |

#### Layer 4: Technical Operations Dashboard

**Who:** AE developers
**What:** Data-heavy dashboards, pipeline monitoring, bulk operations.
**Tooling decision:** PRO-016 evaluates Retool vs. portal `/admin` routes at Milestone 3d. Retool is one option; lightweight charting (Recharts) within the portal admin is another.

Scoped to the technical team, not content editors:

- **Search analytics:** Anonymized query trends, top searches by period, "no results" queries, zero-result rate
- **Pipeline health:** Embedding job status, webhook sync logs, error rates
- **Content audit:** Chunk counts per book, embedding coverage, orphaned records
- **Bulk operations:** One-off data migrations, mass re-tagging, embedding model migration status
- **System metrics:** API response times, database query performance, error aggregations

Whether this is Retool or a custom dashboard is deferred (PRO-016).

#### Layer 5: Impact View — Leadership Dashboard

**Who:** SRF leadership, philanthropist's foundation, board presentations
**What:** A read-only, narrative-quality view of the portal's global reach and content growth.

A single route in the admin portal (`/admin/impact`) or a standalone page. Auth0-protected with a read-only `leadership` role. Designed for beauty and clarity, not data density:

- **Map visualization:** Countries reached (anonymized Vercel geo data). Not a data grid — a warm-toned world map with gentle highlights.
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

### Milestone Placement

The editorial review portal is introduced incrementally, matching the content workflows that create demand for it:

| Milestone | Staff Experience Deliverables |
|---|---|
| **Milestone 3b** | Minimal editorial review portal: theme tag review queue, daily passage curation, calendar event management, content preview, tone/accessibility spot-check. Email digest for review notifications. Auth0 roles: `editor`, `reviewer`. |
| **Milestone 5a** | Social media asset review workflow added to the admin portal. |
| **Arc 4** | Contentful Custom Apps (sidebar panels). Full admin editorial workflow connecting Contentful authoring (available since Arc 1) with portal review queues. |
| **Milestone 5b** | Translation review UI added to admin portal. Auth0 role: `translator:{locale}`. Volunteer reviewer access with minimal permissions. |
| **Milestone 5b+** | Impact dashboard for leadership. |

### Alternatives Considered

| Approach | Why rejected |
|---|---|
| **Contentful + Retool only (current design)** | Underserves monastic editors and theological reviewers. Retool's visual language is incongruent with sacred content work. Translation reviewers have no interface at all. |
| **Everything in Contentful** | Contentful is excellent for content authoring but not designed for AI classification review workflows (approve/reject per passage at scale), social media asset visual review, or translation side-by-side comparison. Forcing these workflows into Contentful's content model would require awkward workarounds. |
| **Everything in Retool** | Retool can technically build any admin UI, but the result is always "an admin tool." For the AE developer, this is fine. For a monastic editor reviewing whether a passage about inner peace is correctly tagged — the experience matters. Retool's generic form builders and data grids don't support the focused, reverent interaction these workflows demand. |
| **Third-party editorial workflow tool (Jira, Asana, Monday)** | Introduces a new vendor with its own UX, its own authentication, its own learning curve. Doesn't integrate with portal data (passages, themes, embeddings). Adds cost. The editorial review workflows are specific to this portal's data model — generic project management tools would require extensive customization to be useful. |
| **Build the admin portal from Arc 1** | Premature. Arc 1 has a single book with a one-time ingestion QA process. The first real demand for review workflows comes in Milestone 3b (theme tagging at scale across multiple books). Building the portal earlier would be over-engineering. |

### Rationale

- **Staff should think about the teachings, not the technology.** The same principle that governs the seeker experience ("Calm Technology") should govern the staff experience. A monastic editor's tool should fade into the background, leaving focus on the passage and the decision.
- **Three distinct audiences need three distinct experiences.** A monastic editor, an AE developer, and a leadership stakeholder have different mental models, different technical comfort levels, and different goals. One tool cannot serve all three well.
- **Review workflows are the bottleneck.** The portal's most distinctive constraint — human review as mandatory gate — means the speed and quality of staff review directly determines how quickly new content reaches seekers. A cumbersome review process means fewer themes published, fewer passages curated, slower translation cycles. The review experience is a primary product concern, not an afterthought.
- **The calm design system already exists.** Building the admin portal in the same Next.js application, with the same design tokens, means zero incremental design cost. The portal's warm cream, Merriweather, and gold accents serve the staff experience as naturally as the seeker experience.
- **Auth0 already exists in the SRF stack.** Role-based access for the admin portal uses SRF's established identity provider. No new authentication system.
- **Incremental delivery.** Milestone 3b delivers only the review workflows needed for theme tagging (the first AI-proposal workflow at scale). Each subsequent milestone adds only the workflows demanded by its content features. The admin portal grows organically, never ahead of actual need.

### Consequences

- **Revises the DESIGN.md statement** "The portal never builds custom admin UIs for either use case." The portal now builds a purpose-built editorial review UI for non-technical staff. Contentful remains the content authoring tool. Retool remains the technical operations tool. The admin portal fills the gap between them.
- Milestone 3b gains a new deliverable: minimal editorial review portal
- Milestone 5a gains social media asset review in the admin portal
- Milestone 3b gains Contentful Custom Apps (sidebar panels)
- Milestone 5b gains translation review UI and volunteer reviewer access
- Auth0 role schema: `editor`, `reviewer`, `translator:{locale}`, `admin`, `leadership`
- Email digest infrastructure: scheduled serverless function for daily review summaries
- The admin portal shares the Next.js application, design system, and database — zero new infrastructure
- **Extends ADR-010** (Contentful as editorial source of truth — now one layer of five, not the whole story), **ADR-092** (social media — review workflow now specified), **ADR-078** (translation workflow — review UI now specified), and **ADR-032** (theme tagging — review workflow now specified)

---

---

## ADR-083: Study Workspace — Universal Teaching Tools Without Authentication

**Status:** Accepted
**Date:** 2026-02-20
**Deciders:** Architecture team
**Context:** ADR-001 (AI as librarian), ADR-066 (Lotus Bookmarks — localStorage pattern)

### Context

The former Talk Preparation Workspace decision designed the Talk Preparation Workspace as an Auth0-protected area for SRF monastics and meditation center leaders. But anyone who engages deeply with Yogananda's teachings benefits from the same capabilities: passage collection, teaching arc assembly, and export. Study circle leaders, yoga teachers, home meditators preparing personal devotional readings, parents selecting passages for their children, chaplains building comfort packages — these users need the same tools as monastics.

Authentication was only required because the former decision assumed server-side persistence of saved outlines. But the portal already solved persistence without accounts: Milestone 2b bookmarks (ADR-066) use localStorage. The same pattern works here.

| Approach | Pros | Cons |
|----------|------|------|
| **Auth-protected (former Talk Preparation Workspace)** | Server-side persistence, cross-device sync | Excludes lay users, requires account creation for a composition tool, delays availability to Milestone 7a+ |
| **localStorage-only, public** | Universal access, no account friction, ships with Arc 4 | No cross-device sync until Milestone 7a, data lost on browser clear |
| **Hybrid: localStorage default, optional server sync** | Best of both — universal access now, enhanced persistence for logged-in users later | Slightly more complex migration path |

### Decision

Rename "Talk Preparation Workspace" to **"Study Workspace."** Make it public at `/study` — no authentication required. All state persisted in localStorage. Export (PDF, presentation mode, plain text) works without accounts.

**Workflow** (unchanged from the former decision except for auth removal):

1. **Theme Exploration.** The user enters a theme or question. The system uses the existing search API to surface relevant passages across all books.
2. **Passage Collection.** Selected passages are added to a working collection stored in localStorage. Each item retains full citation (book, chapter, page). Notes can be attached per passage.
3. **Teaching Arc Assembly.** Collected passages are arranged into a narrative sequence. The user drags passages into sections (e.g., "Opening," "Core Teaching," "Practice," "Closing"). Section headings and personal notes are freeform text, clearly distinguished from Yogananda's words.
4. **Export.** The assembled outline exports as print PDF, presentation mode, or plain text.
5. **Persistence.** localStorage by default. Milestone 7a adds optional server sync for logged-in users (same migration pattern as bookmarks).

### Data Model

The server-side schema (for Milestone 7a sync) renames the former Talk Preparation tables:

```sql
CREATE TABLE study_outlines (
 id UUID PRIMARY KEY DEFAULT uuidv7(),
 user_id TEXT, -- nullable: null = localStorage-only, populated on Milestone 7a sync
 title TEXT NOT NULL,
 description TEXT,
 status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'archived')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE TABLE study_outline_sections (
 id UUID PRIMARY KEY DEFAULT uuidv7(),
 outline_id UUID NOT NULL REFERENCES study_outlines(id) ON DELETE CASCADE,
 title TEXT NOT NULL,
 speaker_notes TEXT, -- user's personal notes (NOT Yogananda's words)
 sort_order INTEGER NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now
);

CREATE TABLE study_outline_passages (
 id UUID PRIMARY KEY DEFAULT uuidv7(),
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
- **localStorage precedent.** Milestone 2b bookmarks (ADR-066) established the pattern: localStorage for persistence, optional server sync in Milestone 7a. The Study Workspace follows the same lifecycle.
- **No new content created.** The workspace assembles existing indexed passages. The user's own notes are clearly separated. This respects ADR-001.

### Consequences

- `/prepare` route → `/study` route throughout all documentation
- `robots.txt` no longer blocks `/study/` (it's a public feature, not a staff tool)
- ROADMAP Milestone 5a updated
- Milestone 7a server sync includes study outlines alongside bookmarks
- the former Talk Preparation Workspace decision status updated to "Superseded by ADR-083"

---

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
 id UUID PRIMARY KEY DEFAULT uuidv7(),
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

**Editorial integration:** Feedback appears in the editorial review portal (Milestone 3b) as a "Seeker Feedback" queue, alongside theme tag review and ingestion QA.

### Rationale

- **DELTA-compliant.** No user identification stored. No session tracking. No behavioral profiling. The feedback table stores content about the *portal*, not about the *seeker*.
- **Closes a dangerous blind spot.** Without feedback, citation errors persist undetected. Bad search results go unreported. The editorial team operates without qualitative signal.
- **Low implementation cost.** One table, one API route, one review queue panel. No new infrastructure.
- **Respects seeker agency.** The seeker chooses to communicate. No prompts, no pop-ups, no "How was your experience?" interruptions. The link is quiet and available.

### Consequences

- New `seeker_feedback` table in Milestone 3b migration
- New API route `POST /api/v1/feedback`
- Feedback review queue added to editorial portal (Milestone 3b)
- Footer gains `/feedback` link (Milestone 3b)
- Every passage display gains "Report a citation error" link (Milestone 3b)
- Search results page gains "I didn't find what I needed" option when results are sparse (Milestone 3b)

---

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
-- Future migration (NOT included in Arc 1 schema)
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

- **Respects current scope.** Zero Lessons code ships in any arc or milestone. No tables, no migrations, no UI. This ADR is a design note, not a deliverable.
- **Prevents architectural lock-in.** If every API route assumes all content is public (no access control middleware), adding Lessons later would require retrofitting every route. By acknowledging the pattern now, the API design naturally accommodates it.
- **Auth0 is already in the stack.** The Editorial Review Portal uses Auth0. Extending it to student/kriyaban authorization is an Auth0 configuration change, not a new identity system.
- **Acknowledges organizational reality.** SRF has expressed interest. The architecture should not be surprised by the request when it arrives.

### Consequences

- No implementation work in any current arc or milestone
- API service layer designed with access control hooks (even if all content is currently public)
- Auth0 tenant configured with extensible role/claim structure
- If Lessons integration is approved: new content tables, enrollment verification flow, restricted search results UI, and a dedicated Lessons reading experience would be scoped as a new arc or milestone
- **Explicit non-goals:** The portal never teaches Kriya Yoga techniques. Even with Lessons integration, technique instructions would remain outside the portal's scope. The portal might host the written Lessons (with proper authorization), but it does not replace the Lesson-by-mail experience or the guru-disciple relationship.

---

---

## ADR-086: Community Collections — Tiered Visibility Public Curation

- **Status:** Accepted
- **Date:** 2026-02-21
- **Relates to:** ADR-083 (Study Workspace), DES-026 (Editorial Reading Threads), ADR-032 (Tagging Pipeline), ADR-095 (DELTA), ADR-001 (Librarian Principle)

### Context

The Study Workspace (ADR-083) allows anyone to collect, arrange, and export passages — but collections remain private (localStorage or Milestone 7a server sync). Editorial Reading Threads (DES-026) are staff-curated passage sequences — but only staff can create them. There is no path for community members to share their curated arrangements of Yogananda's teachings with other seekers.

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

**Private** is the existing Study Workspace behavior (localStorage, Milestone 7a server sync). No change.

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
- `/study` — Study Workspace (existing). "Share" and "Submit for review" buttons added for collections stored server-side (Milestone 7a+).

### Attribution and Identity

- **Private and shared-link collections:** No attribution required. Curator may optionally set a display name.
- **Published and featured collections:** Display name required. No account linking, no profile pages, no follower counts. The display name appears once at the top of the collection: *"Curated by [name]."* No curator analytics, no submission history visible to other seekers.
- **Anonymous publication:** Curators may choose "A devotee" or "A seeker" as display name. Attribution exists for accountability (staff know who submitted), not for ego.

### Alternatives Considered

1. **Allow community curation without any review.** Rejected. Yogananda's teachings can be arranged misleadingly (cherry-picking quotes to support positions he'd disagree with). The theological integrity gate is non-negotiable.
2. **Require authentication for all sharing.** Rejected. Shared-link tier serves center leaders who need to share a reading plan with their study group immediately. Authentication adds friction for the lowest-risk tier.
3. **Community voting/ranking.** Rejected. Engagement metrics violate DELTA (ADR-095) and create engagement dynamics the portal explicitly avoids.
4. **Commenting on collections.** Rejected. The portal is not a social platform. Collections are curated arrangements, not discussion threads.

### Consequences

- Arc 4 adds shared-link export to Study Workspace (lightweight — just a URL with a hash)
- Milestone 7b adds the `/collections` gallery with published and featured tiers, and the admin portal review queue for community submissions
- Milestone 7b adds VLD pipeline, trusted submitter workflows, and scaled community curation (ADR-087)
- The admin portal (ADR-082) gains a new review queue type: community collection submissions
- Schema migration adds visibility, review, and attribution columns to `study_outlines`
- Multilingual collections follow the portal's multilingual strategy (ADR-075): a Spanish-speaking center leader curates from Spanish-edition passages; language column enables filtering
- **Extends ADR-083** (Study Workspace) with public visibility; **extends DES-026** (Editorial Reading Threads) with community sourcing; **mirrors ADR-032** (tagging pipeline) with the "community proposes, staff approves" pattern

---

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
 id UUID PRIMARY KEY DEFAULT uuidv7(),
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
- Milestone 7b deliverable (see ROADMAP.md)
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

---

## ADR-088: SRF Imagery Strategy in the Portal

- **Status:** Accepted
- **Date:** 2026-02-18

### Context

SRF has extraordinary imagery: the Encinitas hermitage cliffs, Lake Shrine gardens, the Pacific coastline, official portraits of Paramahansa Yogananda and the line of gurus. The portal must use this imagery with care — images should serve the reading experience, not compete with it. ADR-042 establishes guidelines for guru portraits. This ADR extends those guidelines to cover nature photography, homepage imagery, and the overall imagery philosophy.

### Decision

1. **The reading experience is text-only.** No images appear in the book reader column. Imagery would compete with Yogananda's words, and his words always win. The side panel may show video thumbnails (Arc 6) but never photographs.

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
- The About page (Milestone 2a) explains: "This is not an AI that speaks for the masters. It is a librarian that finds their words for you. Every passage you see is exactly as it was published."
- The `llms.txt` file (Milestone 2a) includes: "This portal uses AI as a librarian, not a content generator. All results are verbatim passages from SRF-published works."
- Stakeholder communications use "The Librarian" language when describing the AI search.
- The search results page may include a subtle footer: "Every passage shown is exactly as published by SRF."

*Revised: 2026-02-25, PRO-014 — expanded brand language from Yogananda-only to multi-author corpus while maintaining Yogananda-first emphasis.*

### Rationale

- **Trust-building with the SRF community.** Many SRF devotees are legitimately suspicious of AI involvement with sacred texts. "The Librarian" framing immediately communicates that the AI serves the text, not the other way around.
- **Differentiation.** No competitor offers this guarantee. Google synthesizes. ChatGPT paraphrases. This portal finds. The constraint becomes the value proposition.
- **Theological alignment.** In the guru-disciple tradition, a librarian who faithfully preserves and retrieves the guru's words is a service role. It doesn't claim authority; it facilitates access.

### Consequences

- About page copy includes "The Librarian" explanation (Milestone 2a)
- `llms.txt` includes librarian framing (Milestone 2a)
- No architectural changes — this is branding over an existing technical constraint
- Marketing materials and stakeholder presentations use this language

---

---

## ADR-090: "What Is Humanity Seeking?" as Strategic Communications Asset

**Status:** Accepted
**Date:** 2026-02-20
**Deciders:** Architecture team
**Context:** ADR-053 (Anonymized Search Intelligence), ROADMAP Milestone 7b (Annual Report)

### Context

ADR-053 designs anonymized search theme aggregation. designs a public-facing dashboard. Milestone 7b describes an annual curated narrative report. These are treated as features to build. But the concept — "What Is Humanity Seeking?" — has value beyond the portal itself. It could become the philanthropist's foundation's signature thought-leadership asset.

Imagine: an annual report titled *"What Is Humanity Seeking?"* based on anonymized search data from seekers worldwide. Distributed to consciousness research institutions, cited by journalists covering spirituality trends, referenced by interfaith organizations. The data is unique — no other source aggregates spiritual seeking patterns across languages and geographies with this level of intentionality.

### Decision

Treat "What Is Humanity Seeking?" as a **foundation-level communications strategy**, not just a Milestone 3d dashboard feature. The dashboard (Milestone 3d) and annual report (Milestone 7b) are technical implementations; the communications strategy should be socialized with the philanthropist's foundation earlier.

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
- Milestone 3d dashboard implementation unchanged
- Milestone 7b annual report implementation unchanged

---

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

Implement a **daily email** delivering a single verbatim passage from the guru author tier (Yogananda, Sri Yukteswar) with full author attribution and citation (PRO-014).

**Milestone 5a (non-personalized):** Same passage pool as Today's Wisdom — guru tier only (PRO-014: president and monastic tiers are not in the daily pool). One email per day. Subscriber provides email address and language. No account required.

**Milestone 7a (personalized):** Subscribers can optionally select theme preferences ("I'd like more passages about Peace and Healing"). Passages are filtered by theme from the `chunk_topics` join. This is an *explicit user choice*, never behavioral inference.

### Design

| Element | Specification |
|---------|--------------|
| Frequency | Daily, consistent time (configurable per timezone if feasible, otherwise fixed 6 AM EST) |
| Content | One verbatim passage + book/chapter/page citation + "Read in context" link to portal |
| Format | Minimal HTML email: Georgia serif (email-safe Merriweather equivalent), warm cream background (`#FAF8F5`), passage text, citation, portal link. No images. No announcements. No CTAs beyond "Read more." |
| Source | `daily_passages` pool (Milestone 3a expands this from *Sayings* and *Where There Is Light*) |
| Signup | Email address + language. Optional: theme preferences (Milestone 7a). No account required. |
| Unsubscribe | One-click. CAN-SPAM and GDPR compliant. |
| Provider | SendGrid — SRF's standard transactional email provider (Tech Stack Brief § Specialized Services). Open/click tracking must be disabled (DELTA compliance). See PRO-015 for AWS SES alternative analysis. |
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

- Need SendGrid configured for transactional email (SRF standard) with open/click tracking disabled per DELTA — see PRO-015 for SES alternative
- Need a subscriber table in Neon (email, language, theme_preferences, subscribed_at, unsubscribed_at)
- Need a daily cron job (Vercel Cron or AWS EventBridge) to send the email
- Need an unsubscribe endpoint and confirmation page
- The passage selection logic (random from pool, optional theme filter, optional seasonal weighting) is shared with the Today's Wisdom homepage feature — same code, different delivery channel

*Revised: 2026-02-26, email provider aligned to SendGrid (SRF standard, Tech Stack Brief § Specialized Services), replacing original "Resend or SES" language. Open/click tracking must be disabled for DELTA compliance. PRO-015 documents the case for AWS SES as an alternative — for stakeholder review at Milestone 5a scoping.*

---

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

**User sharing (Milestone 2a):** Already covered by ADR-068. Clean links with OG cards. Downloadable quote images. No social media buttons. No tracking scripts.

**SRF organizational sharing (Milestone 5a+):** The portal provides **semi-automated social media asset generation**. A daily quote image and suggested caption are generated automatically (from the guru-tier daily_passages pool — Yogananda and Sri Yukteswar only per PRO-014). A human (SRF social team or content editor) reviews, approves, and posts. The portal never posts automatically.

### Platform-Specific Considerations

| Platform | How the Portal Supports It |
|----------|--------------------------|
| **Instagram** | Quote images from `/api/og/[chunk-id]` are perfectly formatted for Instagram posts and stories. Square (1:1) and story (9:16) variants. |
| **YouTube Shorts** | SRF already publishes Shorts. Portal-generated quote images could inspire "quote + meditation" Shorts. Not automated — the portal provides the raw material. |
| **Facebook** | Shared passage links render beautifully via OG tags. SRF's Facebook page could share daily passages directly from the portal. |
| **Twitter/X** | OG cards render with the quote snippet. Short passages (< 280 chars) can be shared as text with attribution. |
| **WhatsApp** | OG cards render in previews. Likely the highest-impact sharing channel globally (India, Latin America, Africa, Southeast Asia). |
| **LinkedIn** | Inspirational quotes perform well. OG cards render cleanly. |

### What the Portal Generates (Staff Dashboard)

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
- **YouTube Shorts synergy.** SRF's existing Shorts program can draw from the portal's passage catalog for visual content.

### Consequences

- Milestone 2a: User sharing works via OG cards and quote images (already in ADR-068)
- Milestone 5a+: Admin dashboard adds a "Social Assets" view showing daily quote images and suggested captions
- Multi-aspect-ratio image generation needed (`@vercel/og` with configurable dimensions)
- SRF's social media team needs access to the admin dashboard
- No automated posting. Ever. The portal generates; humans distribute.

---

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
- Migration tooling (dbmate or Drizzle) is chosen in Arc 1
- Renovate/Dependabot configured from the first commit

---

---

## ADR-094: Testing Strategy

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The portal serves sacred text. A bug that misattributes a quote, displays the wrong passage, or breaks search undermines the core mission of fidelity. Testing is not optional polish — it's a fidelity guarantee.

The SRF tech stack doesn't prescribe a testing framework. The portal needs a layered testing approach that covers components, services, API routes, end-to-end user flows, accessibility, search quality, and visual consistency.

### Decision

Adopt a **layered testing strategy** with specific tools for each layer:

| Layer | Tool | What It Tests | Milestone |
|-------|------|---------------|-----------|
| **Unit / Integration** | **Vitest** + React Testing Library | Service functions, API route handlers, component rendering, database queries | Milestone 2a |
| **End-to-End** | **Playwright** | Full user flows: search → read → share → navigate. Cross-browser (Chrome, Firefox, Safari). | Milestone 2a (core flows) |
| **Accessibility** | **axe-core** (CI) + Playwright a11y assertions | Automated WCAG checks on every page. Keyboard navigation flows. | Milestone 2a (basic) / Milestone 2b (CI) |
| **Search quality** | Custom Vitest suite | ~30 representative queries with expected passages. Precision/recall metrics. | Milestone 1a (deliverable 1a.8) |
| **Performance** | **Lighthouse CI** | Core Web Vitals thresholds: LCP < 2.5s, CLS < 0.1, INP < 200ms. | Milestone 2a |
| **Visual** | **Storybook** | Component documentation, design token consistency, interactive component states | Milestone 2a (design system) |
| **Visual regression** | Playwright screenshot comparison | Catch unintended visual changes to reading UI, passage cards, Quiet Corner | dissolved (evaluate when component library stabilizes) |

#### Tool Choices

**Vitest over Jest:** Faster execution, native ESM support, better Vite/Next.js integration. The JavaScript testing ecosystem is converging on Vitest.

**Playwright over Cypress:** Multi-browser support (Chrome, Firefox, WebKit/Safari), native accessibility snapshot API (`page.accessibility.snapshot`), more reliable in CI, better parallel execution. Playwright's test generator also speeds up writing E2E tests.

**Storybook deferred to Milestone 2a:** In Arc 1, the component count is small (~15-20 components). Storybook adds setup overhead without proportional value. When the Calm Technology design system matures, Storybook becomes the documentation platform for reusable components across SRF properties.

**No MCP-based testing.** MCP servers are valuable for development workflows (Neon MCP for database operations), but test execution must be deterministic, automated, and reproducible. MCP doesn't add value to test pipelines.

#### Database Test Isolation

Each test run creates a **Neon branch**, runs integration tests against it, and deletes the branch afterward. This provides full database isolation without maintaining a separate test database, using Neon's instant copy-on-write branching.

```
CI pipeline:
 1. Create Neon branch from production (TTL: 1 hour)
 2. Apply migrations to branch
 3. Seed test data
 4. Run Vitest integration tests against branch
 5. Run Playwright E2E tests against branch
 6. Delete branch (cleanup — TTL ensures deletion even if CI fails)
```

#### Preview Branches per PR

Beyond test isolation, create a **persistent preview branch** for each PR that needs database state. This enables Vercel preview deployments with their own database.

```
On PR open:
 1. Create Neon branch: pr-{number} (TTL: 7 days)
 2. Apply migrations to branch
 3. Seed with representative data
 4. Pass branch connection string to Vercel preview deployment

On PR close/merge:
 1. Delete preview branch (TTL auto-deletes if missed)
```

Scale tier supports 25 branches included + $1.50/month per additional branch (up to 5,000). With TTL auto-expiry, orphaned branches are impossible.

#### Schema Diff in CI

Neon's built-in schema diff compares branch schemas. Add as a CI step and GitHub Action:

```
On every PR with migration changes:
 1. Create Neon branch from production
 2. Apply migrations to branch
 3. Run: neonctl branches schema-diff --branch pr-{number} --compare-to production
 4. Post schema diff as PR comment (GitHub Action)
 5. Reviewer sees exact schema changes before approving
```

This catches migration drift, unintended column changes, and missing indexes before they reach production.

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
│ 9. Schema diff (if migrations changed) │
│ │
│ All must pass before merge. │
└─────────────────────────────────────────┘
```

### Rationale

- **Fidelity guarantee.** The search quality test suite is the most important test layer — it verifies that seekers find the right passages. A regression in search quality is a mission failure.
- **Accessibility as gate.** axe-core in CI means accessibility violations block merges, not just generate warnings. This enforces ADR-003.
- **Neon branching for test isolation.** Eliminates the "works on my machine" problem for database-dependent tests. Each PR gets a clean database. TTL auto-expiry ensures cleanup even when CI fails.
- **Preview branches per PR.** Vercel preview deployments get their own database state — reviewers see the full experience, not just code changes.
- **Schema diff as safety net.** Migrations are verified against production schema before merge. Catches unintended column changes, missing indexes, and migration drift.
- **Cross-browser E2E.** Seekers worldwide use diverse browsers. Playwright's multi-browser support catches rendering issues that single-browser testing misses.
- **Performance budgets.** Lighthouse CI prevents performance regressions. A portal that's slow on a mobile connection in rural India fails the global accessibility mission.

### Consequences

- Milestone 2a includes Vitest, Playwright, axe-core, and Lighthouse CI setup (basic axe-core testing begins in Milestone 2a)
- CI pipeline runs all test layers on every PR, including schema diff when migrations change
- Neon branches use TTL auto-expiry: 1 hour for test branches, 7 days for preview branches (ADR-124)
- Preview branches per PR enable database-backed Vercel preview deployments
- Neon Schema Diff GitHub Action posts migration diff as PR comment
- Storybook is introduced in Milestone 2a alongside the design system foundations
- Search quality test suite is a Milestone 1a deliverable (1a.8) and grows as the corpus expands
- Visual regression testing begins when the component library stabilizes

*Revised: 2026-02-25, added preview branches per PR, branch TTL auto-expiry, and schema diff in CI leveraging Neon Scale tier capabilities (ADR-124).*

---

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
| **APM (performance)** | **New Relic** | API route latency, database query duration, external call timing (Claude API, Voyage embeddings). Server-side distributed tracing. |
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

Country code derived from Vercel edge headers, not IP geolocation lookup. Anonymized at the edge. `requested_language` derived from `Accept-Language` header — measures the gap between what seekers want and what the portal serves. `zero_results` boolean flags searches returning no passages — the zero-result rate is the most actionable operational metric for search quality.

### Rationale

- **SRF stack alignment.** Using the established tools (New Relic, Sentry, Amplitude) means the SRF AE team can support the portal without learning new tools.
- **DELTA compliance requires active configuration.** Amplitude, New Relic, and Sentry all default to collecting more data than the DELTA framework permits. The allowlist approach — explicitly specifying what to track rather than what not to track — is the only safe pattern.
- **Structured logging is the foundation.** Good logs make every other observability tool more effective. A request ID that traces from Vercel edge → API route → Neon query → Claude API call makes debugging trivial.
- **Health check + Synthetics = uptime confidence.** A dedicated health endpoint is trivial to implement and provides the foundation for reliable uptime monitoring.

### Consequences

- Arc 1 includes Sentry setup, structured logging (`lib/logger.ts`), and health check endpoint
- New Relic integration in Milestone 3d (depending on SRF providing New Relic account access)
- Amplitude configured with explicit allowlist — no autocapture, no user identification
- DELTA compliance review of all observability configuration before launch
- Vercel Analytics enabled from Arc 1 (free with Vercel deployment)

---

---

## ADR-096: Design Tooling — Figma

- **Status:** Accepted
- **Date:** 2026-02-17

### Context

The portal needs a design tool for screen mockups, component design, and eventually the Calm Technology design system. The SRF tech stack brief does not prescribe a design tool. Options range from free open-source tools to industry-standard paid platforms.

### Decision

Use **Figma** for design, starting with the **free Starter plan** in Milestone 2a, upgrading to **Professional** when the design system work matures. During AI-led arcs (1–5), code is the design source of truth; Figma serves as a collaboration mirror. When human designers join, Figma becomes the upstream source.

#### Arcs 1–5: Code-First Design (AI-Led)

During AI-led development, the design token pipeline flows **code → Figma**:

```
DESIGN.md specs (source of truth)
 │
 ▼
 Claude generates components + tokens.json
 │
 ▼
 tailwind.config.ts consumes tokens
 │
 ▼
 Components rendered in browser + Storybook
 │
 ▼
 Figma updated from tokens.json (collaboration mirror)
```

Visual design emerges through code iteration: generate CSS/components, render in browser, evaluate, refine. The browser rendering — not a Figma file — is the design artifact. Figma files are maintained as a communication surface for SRF stakeholders and future designers, not as the authoritative design spec.

- No Figma files required for Milestone 1a (search validation)
- Milestone 1c / 2a: Figma documents core screens *after* they exist in code
- Storybook is the primary component reference during AI-led arcs

#### When Human Designers Join: Figma-First Design

When human designers join the project, the pipeline inverts to **Figma → code**:

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
 Storybook documents the components
```

This ensures the design language stays synchronized between Figma and the codebase. A change to `--portal-gold` in Figma propagates to `tailwind.config.ts` and is automatically reflected in all components.

#### Professional Plan ($15/editor/month) — when design system requires shared libraries

- Unlimited files
- Shared component library (Calm Technology design system)
- Design token synchronization via Figma Tokens plugin
- Branching for design exploration
- Team collaboration
- Multi-property reuse (portal, convocation site, future SRF projects)

### Alternatives Considered

| Tool | Pros | Cons |
|--------|------|------|
| **Figma (chosen)** | Industry standard; excellent developer handoff; design tokens export; component variants; real-time collaboration; SRF team likely familiar | Paid for full team features ($15/editor/mo at Professional tier) |
| **Penpot** (open-source) | Free; self-hostable; no vendor lock-in; AGPL license | Smaller community; fewer plugins; less mature component/token system; higher setup overhead if self-hosted |
| **Sketch** | Mature; good design system features; native macOS performance | Mac only; no real-time collaboration; shrinking market share |
| **Adobe XD** | Adobe ecosystem integration | Being sunset by Adobe; not a viable long-term choice |
| **No design tool — code-first** | Zero cost; design in browser; AI can iterate directly | Harder to explore layouts; no stakeholder preview without deployment; design decisions embedded in code |

### Rationale

- **Industry standard.** Figma is what most designers and frontend developers know. Hiring or onboarding someone who uses Figma is trivially easy.
- **Figma covers Milestone 2a.** Three files and unlimited drafts is sufficient for Milestone 2a. Upgrade to Professional when the design system requires shared libraries.
- **Design token pipeline.** The Figma Tokens → Tailwind pipeline ensures design and code stay synchronized. This is critical when the Calm Technology design system is reused across SRF properties.
- **Stakeholder communication.** Figma files allow SRF leadership and the philanthropist's foundation to preview the portal design. However, during AI-led phases, deployed prototypes and Storybook serve this purpose more effectively than static Figma mockups.
- **Code-first during AI-led arcs.** When the primary designer is an AI that generates code directly, the natural design artifact is the rendered browser output, not a visual design tool file. Figma's value increases when human designers need a native collaboration surface — not before.

### Consequences

- Milestone 1a: No Figma files. Design validation happens through search functionality, not visual design.
- Milestone 1c / 2a: Figma documents core screens after they are built in code. Code → Figma direction.
- When human designers are active, Figma becomes upstream. Figma → code direction.
- Upgrade to Professional when Calm Technology design system requires shared libraries.
- Figma Tokens plugin configured for bidirectional synchronization with `tokens.json`.
- `tailwind.config.ts` imports from `tokens.json` for design token synchronization.
- Storybook (Milestone 1c+) is the primary component reference during AI-led arcs.

*Revised: 2026-02-23, dual-direction token flow for AI-led vs. designer-led phases.*

### Visual Design Language Enhancement Proposal — Disposition (2026-02-23)

A proposal to incorporate spiritual eye (kutastha) symbolism into the portal's visual design language was evaluated. The portal's existing palette (navy, gold, cream) already maps to Yogananda's description of the spiritual eye (deep blue field, golden ring, white star). The symbolism is universal in Yogananda's teachings — not esoteric knowledge for advanced practitioners, but the aspiration of all seekers.

| Proposal Item | Disposition | Location |
|---------------|------------|----------|
| Enhanced color system (Meditation Mode tokens) | **Adopted** — functional token names, spiritual origin in comments | DESIGN.md color palette, DES-011 extension |
| Sacred Space Boundaries | **Adopted** | DESIGN.md Calm Technology UI Rules |
| Responsive Aura System | **Adopted** — localStorage-only, DELTA-compliant | DESIGN.md Reader Accessibility section |
| Meditation Mode visual theme | **Adopted** — as DES-011 extension with 4th toggle state | DESIGN.md DES-011 |
| Golden-ratio type scale | **Evaluate** — noted for Milestone 2a design QA comparison | DESIGN.md Typography |
| Animated Lotus-Eye Hybrid | **Deferred** — conflicts with Calm Technology rules (no decorative animation). DES-007 opening moment is sufficient. |
| Dawn/Dusk color temperature | **Already designed** — DES-011 is more sophisticated (solar-position aware, locale-sensitive). No action. |
| Sacred Geometry components | **Deferred** — no current functional need. Revisit if loading states or progress indicators need design. |
| Figma component library | **Deferred** — code-first during AI-led phases. Figma mirrors code, not the reverse. |
| Typography hierarchy (golden ratio) | **Evaluate** — Milestone 2a design QA (see above) |

---

---

## ADR-097: MCP Server Strategy — Development Tooling for AI Implementation

**Status:** Accepted (external-facing tiers expanded by ADR-101: Three-Tier Corpus Access Layer) | **Date:** 2026-02-20

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

| MCP Server | Milestone | Purpose | Why Valuable |
|------------|-----------|---------|-------------|
| **Contentful** | Milestone 1c+ | Content model queries, entry management, webhook debugging | Contentful is the editorial source of truth from Arc 1 (ADR-010). The content model is tightly coupled to code from the start. Prevents drift between what code expects and what CMS provides. |

**Evaluate (try, keep if useful):**

| MCP Server | Milestone | Purpose | Assessment |
|------------|-----------|---------|------------|
| **GitHub** | Arc 1+ | Issue context, PR details, review comments | Modest benefit over `gh` CLI. Try it; drop if redundant. |
| **Vercel** | Arc 1+ | Deployment status, build logs, preview URLs | Useful for debugging deployment failures. The `vercel` CLI covers most of this. |
| ~~**Cloudflare**~~ | — | Removed from portal stack (PRO-017). If SRF routes domain through Cloudflare, evaluate Cloudflare MCP at that point. | — |

**Not recommended (skip):**

| Service | Why Skip |
|---------|----------|
| **AWS** | Terraform manages infrastructure declaratively. Sentry catches errors. The gap — "what's in that S3 bucket?" — is too narrow. `aws` CLI through Bash handles rare ad-hoc queries. |
| **Figma** | Design tokens are exported once to `tokens.json` and consumed by Tailwind. The AI reads the local file; no interactive Figma queries needed. |
| **Amplitude** | Analytics code targets the SDK, not the query API. By the time analytics data matters (Milestone 3d+), queries are infrequent. Dashboard is adequate. |
| **New Relic** | APM data (slow queries, endpoint latency) is useful during the Milestone 3d observability work, but that's a narrow window. Dashboards handle ongoing monitoring. |
| **Auth0** | Auth is configured once and rarely touched. When it breaks, the Auth0 CLI or dashboard is adequate for the low frequency of interaction. |

**Custom MCP server (unscheduled):**

The **SRF Corpus MCP** server architecture (ADR-101, DES-031) gives the AI development-time access to the book corpus — "find all passages about meditation in Autobiography." All three tiers were moved to Unscheduled Features (2026-02-24) to focus on core delivery. The architecture is preserved in DESIGN-arc1.md § DES-031.

### Consequences

- Sentry MCP added to project configuration at Arc 1 alongside existing Neon MCP
- Contentful MCP evaluated and added at Milestone 1c when Contentful webhook sync activates
- GitHub MCP evaluated during Arc 1; kept or dropped based on actual utility versus `gh` CLI
- SRF Corpus MCP server moved to Unscheduled Features (2026-02-24). Architecture preserved in DES-031.
- AWS MCP explicitly not adopted — Terraform + Sentry + `aws` CLI is sufficient
- MCP server configuration documented in CLAUDE.md for all future AI sessions
- This decision is revisited at Arc 6 (cross-media) and Milestone 7a (user accounts) when new services enter the stack

*Revised: 2026-02-24, Contentful MCP confirmed for Milestone 1c. SRF Corpus MCP descheduled.*

---

---

## ADR-098: Documentation Architecture — Thirteen-Document System with Arc/Milestone-Gated Loading

- **Status:** Accepted
- **Date:** 2026-02-20

### Context

The project's documentation system is itself an architectural decision. The pre-code design phase produced nearly 1MB of structured documentation across five files. As the project transitions to implementation, the documentation system must serve three audiences: AI collaborators (primary, token-constrained), human developers (current and future), and non-technical stakeholders (SRF, the philanthropist's foundation).

Key tensions:
- **Completeness vs. navigability.** Thorough documentation ensures correct decisions; large documents are expensive to load into AI context windows.
- **Single source of truth vs. contextual relevance.** Centralizing information prevents drift; distributing it keeps related concerns together.
- **Design-phase authority vs. code-phase authority.** Documentation is the sole authority before code exists; after implementation, code and documentation must coexist without contradiction.
- **Maturity honesty.** In a pre-code project, all ADRs carry `Status: Accepted`, but a foundational principle (ADR-001) and a speculative Milestone 7b feature (ADR-087) are not equally "decided." The documentation system must honestly reflect the maturity of each record without discarding the thorough thinking that produced it.

### Decision

Maintain a thirteen-document system with explicit roles, a routing document (CLAUDE.md), defined conventions for the documentation-to-code transition, and a three-tier maturity model for intellectual work:

| Document | Role | Primary Audience |
|----------|------|-----------------|
| CLAUDE.md | AI routing, compressed principles, maintenance protocol | AI collaborators |
| PRINCIPLES.md | 12 immutable commitments with expanded rationale | All audiences |
| CONTEXT.md | Project background, open questions, stakeholder context | All audiences |
| DESIGN.md | Cross-cutting architecture, API, observability, testing, personas | Developers, AI |
| DESIGN-arc1.md | Search, data model, ingestion, chunking, MCP, infrastructure (Arc 1) | Developers, AI |
| DESIGN-arc2-3.md | Frontend, accessibility, video, events, staff tools (Arcs 2–3) | Developers, AI |
| DESIGN-arc4-plus.md | Cultural design, email, CMS, magazine, dashboard, community (Arc 4+) | Developers, AI |
| DECISIONS.md | ADR navigational index with group summaries | Developers, AI |
| DECISIONS-core.md | ADR bodies: Foundational, Architecture, Content, Search | Developers, AI |
| DECISIONS-experience.md | ADR bodies: Cross-Media, Seeker Experience, Internationalization | Developers, AI |
| DECISIONS-operations.md | ADR bodies: Staff, Brand, Operations, Governance | Developers, AI |
| PROPOSALS.md | Proposal registry: PRO-NNN identifiers, graduation protocol, scheduling lifecycle | All audiences |
| ROADMAP.md | Phased delivery plan with deliverables and success criteria | All audiences |

**Three-tier maturity model:**

| Tier | Home | Identifier | Maturity |
|------|------|-----------|----------|
| Explorations | `.elmer/proposals/` | Slug filenames | Raw, unvetted AI ideation. Not project documents. |
| Proposals | PROPOSALS.md | PRO-NNN | Curated, thoughtful. Awaiting validation, scheduling, or adoption. |
| Decisions & Design | DECISIONS-*.md, DESIGN-*.md | ADR-NNN, DES-NNN | Validated through implementation or foundational principle. |

**ADR maturity classification:**

ADRs carry a maturity marker in their Status field reflecting honest confidence level:

| Maturity | Meaning | Status Field |
|----------|---------|-------------|
| Foundational | Defines project identity. Change requires full deliberation. | `Accepted (Foundational)` |
| Active | Governing current or imminent implementation. | `Accepted` |
| Provisional | Thorough architectural direction for future arcs/milestones. May be revised, suspended, or omitted as the project evolves. | `Accepted (Provisional — Arc N+ / Milestone N+)` |
| Suspended | Was active or provisional, moved to unscheduled. Reasoning preserved in ADR body; scheduling lifecycle in PROPOSALS.md. | `Suspended → PRO-NNN` |
| Implemented | Validated through code. Code is authoritative; ADR retains rationale. | `Implemented — see [code path]` |

**Conventions:**

1. **CLAUDE.md as routing document.** The single most important file for AI collaboration. Establishes reading order, constraints, and maintenance protocol in ~90 lines — small enough to always fit in context.
2. **CONTEXT.md as open question registry.** All open questions (technical and stakeholder) are tracked here. Other documents cross-reference but do not duplicate the full question.
3. **DESIGN.md Table of Contents with arc/milestone-relevance markers.** Enables AI sessions to navigate to relevant sections without sequential scanning of 5,000+ lines.
4. **ROADMAP.md Table of Contents.** Arc/milestone-level navigation for quick orientation.
5. **DECISIONS.md Index by Concern.** ADRs grouped by domain (already established at ADR-009).
6. **Implemented-section annotations.** When a DESIGN.md section is fully implemented, annotate: `**Status: Implemented** — see [code path]`. Code becomes the source of truth; DESIGN.md retains architectural rationale.
7. **ADRs are mutable living documents.** Update them directly — add, revise, or replace content in place. Do not create superseding ADRs or use withdrawal ceremony. When substantially revising, add `*Revised: [date], [reason]*` at the section's end. Git history serves as the full audit trail.
8. **Section-level change tracking.** When substantially revising a DESIGN.md section, add `*Section revised: [date], [reason or ADR]*` at the section's end.
9. **Expanded maintenance table in CLAUDE.md.** Covers open question lifecycle, cross-cutting concern changes, content type additions, and the documentation-to-code transition.
10. **PROPOSALS.md as proposal registry.** PRO-NNN identifiers are permanent — never renamed or reassigned. Proposals graduate to ADR/DES/milestone deliverables through the graduation protocol. ADRs may be suspended to PRO-NNN entries. Both directions preserve full cross-references.

### Rationale

- The routing document (CLAUDE.md) is the single most impactful file for AI collaboration cost. A well-structured 90-line file saves thousands of tokens per session by directing attention to the right document and section.
- Arc/milestone-relevance markers in the DESIGN.md TOC allow AI sessions to skip irrelevant sections (e.g., Milestone 5b multilingual details during Arc 1 work), reducing token consumption without losing information.
- The documentation-to-code transition protocol prevents the "two sources of truth" problem that invariably emerges when design documents survive into an implemented codebase.
- Centralizing open questions in CONTEXT.md prevents them from being forgotten in document interiors — a real risk at 967KB of total documentation.
- Making the documentation system itself an ADR ensures future contributors understand why the system is structured this way, and can evolve it deliberately rather than through drift.
- PROPOSALS.md gives curated proposals first-class citizenship without overcommitting them as "decisions." PRO-NNN identifiers provide stable cross-references throughout the evaluation lifecycle. The three-tier maturity model (explorations → proposals → decisions) honestly reflects confidence levels without discarding the thorough thinking at any tier.
- ADR maturity classification acknowledges that a foundational principle and a speculative Milestone 7b feature are not equally "decided," even though both received thorough analysis. Provisional ADRs represent real architectural thinking — they are not dismissed, but they are honestly distinguished from implementation-tested decisions.

### Consequences

- DESIGN.md and ROADMAP.md now carry navigable Tables of Contents
- DESIGN.md inline open questions are converted to cross-references to CONTEXT.md
- CLAUDE.md maintenance table is expanded to cover proposal lifecycle
- CLAUDE.md gains a "Documentation–Code Transition" section
- PROPOSALS.md carries the graduation protocol (moved from ROADMAP.md § Unscheduled Features)
- ROADMAP.md § Unscheduled Features retains a compact summary table of Validated and Deferred items referencing PRO-NNN
- Future documentation changes should follow the conventions established here
- This ADR should be revised if the documentation system undergoes further restructuring

*Revised: 2026-02-23, document architecture restructured from 5 to 12 documents — PRINCIPLES.md extracted as always-loaded identity layer; DESIGN.md split by arc into 4 files (root + arc1 + arc2-3 + arc4-plus); DECISIONS.md split into navigational index + 3 scoped body files (core, experience, operations); CLAUDE.md updated with arc-gated reading guidance.*

*Revised: 2026-02-24, document architecture expanded from 12 to 13 documents — PROPOSALS.md added as proposal registry with PRO-NNN identifiers and graduation protocol. Three-tier maturity model (explorations → proposals → decisions) introduced. ADR maturity classification added (Foundational, Active, Provisional, Suspended, Implemented). Convention 7 updated from "immutable history" to "mutable living documents" to match CLAUDE.md. Graduation protocol moved from ROADMAP.md § Unscheduled Features to PROPOSALS.md.*

---

---

## ADR-099: Global Privacy Compliance — DELTA as Primary Framework

- **Status:** Accepted
- **Date:** 2026-02-21

### Context

The portal's privacy architecture derives from DELTA — the faith-based AI ethics framework — not from any single regulation. DELTA's principles (Dignity, Embodiment, Love, Transcendence, Agency) produced an architecture that collects almost no personal data by design. Regulatory compliance follows naturally.

The portal serves seekers worldwide. The majority by population will be in India (DPDPA), Brazil (LGPD), and other non-EU jurisdictions — not Europe. GDPR (EU/EEA), UK GDPR, CCPA/CPRA (California), APPI (Japan), and TTDSG/DSGVO (Germany) also apply. DELTA produces protections that substantively exceed all of these frameworks because the portal's minimal-data architecture was designed for human dignity, not compliance.

The remaining compliance work is primarily documentary (privacy policy, sub-processor inventory, retention policies, data subject rights documentation) rather than architectural. One architectural change is required: self-hosting Google Fonts to avoid IP transmission to Google servers (per LG München I, Case No. 3 O 17493/20).

### Decision

**1. Privacy policy and legal pages.** Add `/privacy` and `/legal` to the portal URL structure. The privacy policy must be human-readable (not legal boilerplate), written in the portal's contemplative voice, and translated alongside UI strings in Milestone 5b. Disclose: what data is collected, why, how long retained, who processes it, data subject rights, and sub-processor list. The privacy policy is a Milestone 2a deliverable alongside the accessibility foundation.

**2. Self-hosted fonts.** Replace Google Fonts CDN imports with self-hosted font files served from Vercel's CDN. Download Merriweather, Lora, and Open Sans WOFF2 files, bundle in the application. This eliminates IP transmission to Google servers and improves performance (no DNS lookup to `fonts.googleapis.com`). Milestone 2a deliverable.

**3. Cookie and localStorage disclosure.** The portal uses a language preference cookie (user-initiated) and `localStorage` for bookmarks, reader settings, study workspace, and first-visit detection. Under ePrivacy/TTDSG §25(2)(2), all serve user-initiated functionality and qualify as "strictly necessary" — no consent banner required. This determination is documented in the privacy policy. No cookie banner is added (cookie banners are antithetical to Calm Technology and unnecessary when all storage is functional).

**4. Email subscription: lawful basis, erasure, retention.**
- **Lawful basis:** Consent (GDPR Art. 6(1)(a)) via double opt-in. Documented on the subscription form and in the privacy policy.
- **Right to erasure:** The unsubscribe endpoint (`GET /api/v1/email/unsubscribe`) currently soft-deletes (sets `is_active = false`). Add a `DELETE /api/v1/email/subscriber` endpoint that performs hard deletion (removes the row entirely) to comply with GDPR Article 17. The unsubscribe confirmation page offers "Remove my data entirely" as an additional option.
- **Retention:** Unsubscribed email records (soft-deleted) are automatically purged 90 days after `unsubscribed_at`. Active subscriber data is retained for the duration of the subscription. Bounce/failure records are retained for 30 days for operational health monitoring.

**5. Seeker feedback PII mitigation.** The `/feedback` form includes a notice: "Please do not include personal information (name, email, location) in your feedback." Feedback entries are reviewed periodically for inadvertent PII, which is redacted by editorial staff. Feedback entries older than 2 years are eligible for archival aggregation (convert to anonymized statistics, delete raw text).

**6. Sub-processor inventory.** Maintain a documented inventory of all services that process data on the portal's behalf, with their roles, data touched, and geographic regions. Update when services are added or changed. Published as part of the privacy policy.

**7. `search_queries` table.** The table stores query text without user identifiers. Under GDPR recital 26, data that cannot identify a natural person is not personal data. The portal cannot match a data subject access request to their queries because no user identifiers are stored. This is documented in the privacy policy. The minimum aggregation threshold of 10 (ADR-053) prevents re-identification in the reporting layer.

**8. Rate limiting and IP processing.** Vercel processes IP addresses for Firewall/rate-limiting purposes at the edge. The portal itself does not store IP addresses. This is disclosed in the privacy policy: "Our hosting provider processes IP addresses for security purposes. We do not store IP addresses."

**9. YouTube privacy-enhanced embeds.** The facade pattern (thumbnail → click to load from `youtube-nocookie.com`) ensures no Google connection occurs until the user actively clicks play. This is compliant with strict German GDPR interpretation and documented.

**10. Record of Processing Activities (ROPA).** Maintain a ROPA (GDPR Article 30) documenting all processing activities. For the portal's minimal data profile, this is a short document. Created in Milestone 2a, maintained as processing activities change.

**11. Milestone 7a age consideration.** When user accounts are introduced (Milestone 7a), the signup flow must include minimum age verification. GDPR: 16 in most of EU (member state variation down to 13). COPPA: 13 in US. The email subscription (Milestone 5a) should include a minimum age statement: "You must be 16 or older to subscribe."

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
| **Neon** | Processor | All server-side data (books, themes, search queries, subscribers) | US (default); EU read replica distributed | Yes |
| **Vercel** | Processor | Request logs (transient), edge headers, static assets | Global edges, US origin | Yes |
| **Vercel** (Firewall) | Processor | Request metadata, IP for rate limiting (transient) | Global (Vercel edge) | Yes |
| **Amplitude** | Processor | Anonymized events with country_code | US | Yes |
| **Sentry** | Processor | Error stack traces, request context | US | Yes |
| **New Relic** | Processor | Performance metrics, log aggregation | US | Yes (Milestone 3d+) |
| **AWS Bedrock** | Processor | Search queries (transient, not stored by AWS) | `us-west-2` | Covered by AWS DPA |
| **Voyage AI** | Processor | Corpus text at embedding time (one-time; ADR-118) | US | Yes |
| **SendGrid** | Processor | Subscriber email addresses | US | Yes (Milestone 5a+) |
| **Auth0** | Processor | User accounts (if implemented) | US | Yes (Milestone 7a+) |
| **Contentful** | Processor | Editorial content (no personal data) | EU | Yes (Arc 1+) |

EU-US data transfers rely on the EU-US Data Privacy Framework (DPF) where services are certified, with Standard Contractual Clauses (SCCs) as fallback. The sub-processor inventory is reviewed when services are added or changed, and published as part of the privacy policy.

### Rationale

- **DELTA exceeds GDPR.** The portal's ethical framework produces stronger privacy protections than any single regulation requires. Compliance is a natural consequence, not an afterthought. The strongest compliance demonstration is: "We designed for human dignity first, and compliance followed."
- **Architectural changes are minimal.** Self-hosted fonts is the only code change. Everything else is documentation.
- **No cookie banner.** All client-side storage serves user-initiated functionality (strictly necessary under ePrivacy/TTDSG). Adding a consent banner to a portal with no tracking, no profiling, and no advertising cookies would be Calm Technology theater — noise without substance.
- **Global coverage.** The portal's data minimization posture satisfies GDPR, UK GDPR, CCPA/CPRA, LGPD, DPDPA, and APPI simultaneously. Regional differences matter at the margins (minimum age for consent, cross-border transfer mechanisms), not at the architectural level.

### Consequences

- `/privacy` and `/legal` pages added to URL structure (Milestone 2a)
- Self-hosted fonts replace Google Fonts CDN (Milestone 2a)
- Privacy policy drafted in contemplative voice, translated alongside UI strings (Milestone 5b)
- `DELETE /api/v1/email/subscriber` endpoint for hard deletion (Milestone 5a)
- 90-day automatic purge of soft-deleted subscriber records (Milestone 5a)
- Feedback form gains PII notice (Milestone 3b)
- ROPA document created (Milestone 2a)
- Sub-processor inventory maintained in DESIGN.md
- Minimum age statement on email subscription form (Milestone 5a)
- Milestone 7a account signup includes age verification
- New open questions added to CONTEXT.md: data controller identity, minimum age policy, Indian DPDPA cross-border rules, Brazilian LGPD DPO requirement

*Section added: 2026-02-21, global privacy compliance exploration*

---

---

## ADR-100: AI Editorial Workflow Maturity — Trust Graduation and Feedback Loops

**Status:** Accepted | **Date:** 2026-02-21

### Context

DES-035 catalogs 25+ AI-assisted editorial workflows, all governed by the principle "AI proposes, humans approve." This principle is correct as a starting posture but incomplete as a 10-year operating model. The portal's monastic content editor has a 2–3 hour daily window for editorial work. As the corpus grows from 1 book (Arc 1) to 15+ books plus video, audio, images, magazine archives, and community submissions (Milestone 7b+), the total review volume grows multiplicatively — more content types × more workflows × more languages.

The current design implicitly assumes review demand will stay within human capacity. It won't. By Milestone 3d, the editorial team will be managing theme tag reviews, tone spot-checks, daily passage curation, translation reviews, feedback triage, social media approvals, reverse bibliography verification, and editorial thread curation. Without a governed mechanism for evolving the AI-human relationship over time, one of three things happens: (a) review queues grow unbounded, (b) reviewers rubber-stamp to keep pace, or (c) the team informally skips reviews for "trusted" workflows — losing the audit trail that makes the system trustworthy.

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

**Milestone:** 3b (consistency checks). Quarterly cadence begins Milestone 3b. Maturity model governance begins Milestone 3b for theme tag classification (first workflow to reach Full Review volume). Feedback loop protocol begins Arc 1 (override logging from the first AI-assisted search).

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

- `ai_review_log` table added to schema (Arc 1 — logging begins with the first AI-assisted workflow)
- `ai_abstained` boolean column added to review queue items (Arc 1)
- Quarterly prompt refinement cadence added to operational playbook (Milestone 3b)
- Maturity stage tracked per workflow per language in `ai_workflow_config` table (Milestone 3b)
- Nightly consistency check batch job (Milestone 3c, runs alongside existing nightly jobs)
- Workflow dependency graph documented in DES-035 and maintained as workflows are added
- New open question: editorial capacity modeling — projected review hours per milestone (added to CONTEXT.md)
- DES-035 updated with new subsections: Feedback Loop Protocol, AI Observes pattern, AI Abstains protocol, Workflow Dependency Graph, Unified Prompt Versioning

*Section added: 2026-02-21, DES-035 deep exploration*

---

---

## ADR-101: MCP as Three-Tier Corpus Access Layer — Development, Internal, and External

**Status:** Accepted (all tiers unscheduled → PRO-001; architecture preserved as design reference) | **Date:** 2026-02-21

### Context

ADR-097 established MCP (Model Context Protocol) servers as development tooling — tools for Claude Code to use while building the portal. The SRF Corpus MCP (DES-031) provides six development-time tools: `search_corpus`, `search_by_theme`, `search_references`, `get_vocabulary_bridge`, `get_book_metadata`, `get_theme_metadata`.

But MCP consumers extend well beyond the development AI. Three additional tiers of AI consumer already exist in the design:

1. **Internal editorial AI agents.** DES-035 catalogs 25+ AI-assisted workflows, all requiring corpus access. Theme tag proposal needs similar-passage retrieval. Guide pathway generation needs ontology traversal, reverse bibliography queries, and vocabulary bridge lookups. Translation review needs cross-language passage alignment. These workflows currently access the corpus through ad-hoc service layer calls — MCP would provide a canonical, auditable, consistent interface.

2. **Internal cross-property consumers.** The SRF mobile app (CONTEXT.md § Stakeholder question), staff dashboards (PRO-016), the Impact Dashboard, and other SRF web properties are potential consumers. The API-first architecture (ADR-011) already serves HTTP clients; MCP serves AI-native clients using the same service layer.

3. **External AI assistants.** By 2027, seekers will ask ChatGPT, Claude, Gemini, and custom agents about Yogananda's teachings. Without structured access, these AIs fabricate from training data (violating ADR-001) or scrape and paraphrase the portal (violating fidelity). With production MCP, the AI receives verbatim, attributed quotes with portal URLs — the Findability Principle (CONTEXT.md § Mission) realized through the channel where seekers already are.

The API-first architecture (ADR-011) was designed so "the same response serves web, mobile, and any future consumer." MCP is the AI-native realization of that architectural foresight. The service layer in `/lib/services/` is the constant; MCP tools are thin wrappers, just as API routes are thin wrappers.

ADR-026 already envisions multi-channel distribution (WhatsApp, SMS, IVR). AI assistants are the most consequential new channel of 2027–2030. MCP is the protocol by which that channel accesses the portal.

### Decision

Evolve MCP from a single development tier into a three-tier corpus access layer, all wrapping the same service functions in `/lib/services/`.

#### Tier 1: Development (Arc 1 — current)

Unrestricted access for Claude Code during portal development. Existing tools from DES-031 plus additional tools as development needs arise.

| Tool | Service Function | Purpose |
|---|---|---|
| `search_corpus(query, limit)` | `search.ts` | Find passages by semantic query |
| `search_by_theme(slug)` | `themes.ts` | Theme-based retrieval |
| `search_references(source_name)` | `references.ts` | External reference lookup |
| `get_vocabulary_bridge(category)` | reads `spiritual-terms.json` | Terminology mapping |
| `get_book_metadata(slug)` | `books.ts` | Book information |
| `get_theme_metadata(slug)` | `themes.ts` | Theme information |

#### Tier 2: Internal (Milestone 3c+)

Authenticated service-to-service access for editorial AI agents, batch pipelines, admin portal AI features, and cross-property consumers (SRF app, staff dashboard per PRO-016). Adds tools that internal AI workflows need:

| Tool | Service Function | Purpose | Milestone |
|---|---|---|---|
| `get_chunk_with_context(chunk_id, window)` | `chunks.ts` | Passage + N surrounding chunks for QA, classification, review | 3c |
| `get_similar_passages(chunk_id, threshold, limit)` | `search.ts` | Embedding-based nearest neighbors (distinct from theme search) | 3c |
| `get_graph_neighborhood(node_id, depth, types[])` | `graph.ts` | Subgraph around any node, filtered by node/edge type | Arc 4 |
| `find_concept_path(source_slug, target_slug)` | `graph.ts` | Shortest path in the ontology between two concepts | 5a |
| `get_glossary_terms_in_passage(chunk_id)` | `glossary.ts` | Glossary terms appearing in a passage (with definitions) | 3c |
| `get_passage_translations(canonical_chunk_id)` | `translations.ts` | All language variants of a passage | dissolved |
| `get_content_coverage(theme_slug)` | `themes.ts` | Passage count, book distribution, tone distribution per theme | 3c |
| `verify_citation(book_slug, chapter, page)` | `citations.ts` | Confirm a quote exists in the corpus | 3c |
| `get_pending_reviews(queue_type, limit)` | `queue.ts` | Items awaiting human review | 3c |
| `get_search_trends(period, min_count)` | `analytics.ts` | Anonymized aggregated query themes (DELTA-compliant) | Arc 4 |
| `get_cross_book_connections(chunk_id)` | `relations.ts` | Related passages from other books | 3d |
| `get_person_context(person_slug)` | `people.ts` | Biography, lineage, key mentioning passages | 3d |
| `get_daily_passage(language, exclude_id)` | `daily.ts` | Random passage from curated pool | 3c |

Internal tools use service-to-service authentication (API key or IAM role, not Auth0). No rate limiting beyond standard database connection limits.

#### Tier 3: External (Milestone 5a+)

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

**Rate limiting:** External MCP uses the same Vercel Firewall + application-level tiering as the HTTP API (ADR-023). Registered consumers (those who agree to the fidelity contract) receive higher limits. Unregistered consumers receive the same limits as anonymous web crawlers (ADR-081).

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
- All three tiers moved to ROADMAP.md § Unscheduled Features (2026-02-24) to focus on core delivery
- Architecture preserved in DESIGN-arc1.md § DES-031 as design reference for future scheduling
- Fidelity metadata schema defined and included in every external response (when scheduled)
- DES-035 editorial AI workflows access the corpus through `/lib/services/` directly until MCP tiers are scheduled
- New stakeholder questions added to CONTEXT.md: SRF's posture on external AI access, copyright implications, and sacred text in AI context
- Access governance model (open/registered/partner) deferred to stakeholder decision
- This decision supersedes the external-facing aspects of ADR-097 (which remains valid for the development tier). ADR-097's evaluation of third-party MCP servers (Sentry, Contentful, etc.) is unchanged.
- Knowledge Graph MCP tools (`get_graph_neighborhood`, `find_concept_path`) require the graph service layer (`/lib/services/graph.ts`) to support these query patterns — verify when scheduling

*Section added: 2026-02-21, MCP three-tier exploration*
*Revised: 2026-02-24, all three tiers moved to Unscheduled Features. Architecture preserved as design reference.*

---

## ADR-105: Portal Updates — Seeker-Facing Changelog

- **Status:** Accepted
- **Date:** 2026-02-22

### Context

Over a 10-year lifespan, the portal will evolve through multiple arcs — adding books, languages, features, and content types. Seekers who visited in Milestone 3a and return in Milestone 5a would not know that WhatsApp search, Sacred Places, reading journeys, or the Knowledge Graph exist unless they stumble upon them. Existing mechanisms cover content additions (deliverable 3a.8's "What's New in the Library" gold dot for new books; Milestone 5a RSS feed `/feed/new-content.xml` for new books/recordings/videos) but nothing communicates *capability* changes to seekers.

The daily email (ADR-091) explicitly excludes announcements: "The email is a passage, not a newsletter. No announcements, no feature updates." This is correct — the email channel must remain pure. But the portal itself should offer a quiet, opt-in way for seekers to learn what has changed.

| Approach | Description | Fit |
|----------|-------------|-----|
| **Homepage banner** | "New! Knowledge Graph" | Poor — violates Calm Technology; attention-grabbing |
| **Email announcements** | Feature updates in daily email | Poor — ADR-091 explicitly forbids this |
| **Push notifications** | Browser notifications for new features | Poor — aggressive; antithetical to DELTA |
| **Dedicated `/updates` page** | Quiet page linked from footer, written in portal voice | Good — opt-in, transparent, contemplative |
| **RSS feed extension** | Add portal updates to existing RSS infrastructure | Good — machine-readable, no UI overhead |

### Decision

**A `/updates` page — "The Library Notice Board" — linked from the site footer.** Portal updates are written in the portal's contemplative editorial voice (ADR-074), centered on the teachings rather than the technology. AI drafts update notes from deployment metadata and git history; human review is mandatory before publication (consistent with the "AI proposes, humans approve" principle). The page maintains a seasonal archive of all portal changes.

### Guiding Metaphor

A library notice board, not a SaaS changelog. The notice board says "The poetry wing is now open" — not "Version 2.0: Poetry Module Deployed."

### Voice Standards

| SaaS Voice (wrong) | Portal Voice (right) |
|---------------------|---------------------|
| "New Feature: Knowledge Graph!" | "The teachings are now connected — explore how Yogananda's ideas flow across books" |
| "We added WhatsApp support" | "You can now ask Yogananda's books a question from WhatsApp" |
| "Dark mode is here" | "The reader now adjusts to evening light" |
| "v3.2: Bug fixes and performance" | *(omit — seekers don't need this)* |
| "9 new languages!" | "The teachings are now available in Hindi, Bengali, Thai, and six more languages" |

### Content Categories

| Category | Include? | Rationale |
|----------|----------|-----------|
| New books added to the library | Yes | Directly serves mission — "the library has grown" |
| New languages added | Yes | "The teachings are now available in Hindi" |
| New content types (audio, video) | Yes | "You can now hear Yogananda's voice" |
| Major new pages (Sacred Places, Knowledge Graph, Quiet Corner textures) | Yes | New ways to explore the teachings |
| Seeker-noticeable UX improvements | Selectively | Only when meaningful — "The reader now remembers where you left off" |
| Bug fixes, performance | No | Developer concerns, not seeker concerns |
| Infrastructure changes (regional distribution, environment promotion) | No | Internal, invisible |
| Security patches | No | Standard maintenance |

### Automation Pipeline

```
Git tags / deploy events
    → AI reads commit history since last release
    → AI drafts seeker-facing summary in portal voice (ADR-074)
    → Draft enters editorial review queue (ADR-082, DES-033)
    → Portal coordinator or content editor reviews and approves
    → Published to /updates page and RSS feed
```

**AI role:** Category C (drafting) per ADR-005 taxonomy — same pattern as social media captions (ADR-092) and UI string translation (ADR-078). Claude reads developer-facing deployment metadata and produces seeker-facing prose. Human review is mandatory.

### Archive Format

Updates are organized by season, not version number — consistent with the portal's calendar awareness (DES-028) and contemplative sensibility:

```
Spring 2027
  The Library has grown — three new books join the collection
  The teachings are now connected across books

Winter 2026
  The portal opens — Autobiography of a Yogi, free to the world
```

Over a decade, this archive becomes a narrative of the portal's growth — the philanthropist's offering unfolding over time.

### DELTA Compliance

| DELTA Principle | How Updates Page Complies |
|-----------------|--------------------------|
| **Dignity** | Transparently shows what's available — never "you're missing out" |
| **Embodiment** | Never optimizes for return visits. No "come back to see what's new" |
| **Love** | Warm language centered on the teachings, not the technology |
| **Transcendence** | No gamification — no "X features added this quarter!" counts |
| **Agency** | Seekers discover updates at their own pace. No push notifications |

### Placement

- **Primary:** `/updates` page linked from site footer ("What's new in the portal")
- **RSS:** `/feed/updates.xml` alongside existing content feeds (Milestone 5a)
- **About page:** Brief "Recent additions" summary on the About page (optional, editorial judgment)
- **Not:** Homepage banners, daily email, push notifications, or nav-bar badges

### Multilingual (Milestone 5b+)

Update notes follow the same translation workflow as other editorial content (ADR-078): AI drafts translation, human reviewer approves. A Hindi-speaking seeker learns about the Hindi launch in Hindi.

### Rationale

- **Content Availability Honesty** (CONTEXT.md) already commits the portal to transparency about what it has. This extends that honesty to capabilities.
- **The philanthropist's foundation** (ADR-090) benefits from a public record of portal growth — the `/updates` archive complements the "What Is Humanity Seeking?" dashboard as evidence of stewardship.
- **Returning seekers** deserve to know what's changed. A contemplative notice board respects their attention without demanding it.
- **10-year horizon** (ADR-004): over a decade, the changelog becomes a narrative artifact — meaningful in its own right.

### Consequences

- New DES-051 in DESIGN.md specifying the `/updates` page design, data model, and editorial workflow
- New deliverable in Milestone 3b (when the editorial portal activates — first milestone with human review capability)
- New AI workflow in DES-035 for update note drafting
- New review queue type (`updates`) in the editorial portal (DES-033)
- RSS feed extension in Milestone 5a
- Portal coordinator role gains update review responsibility
- `portal_updates` table added to schema

- **Relates to:** ADR-074 (editorial voice), ADR-082 (editorial portal), ADR-091 (daily email — boundary: updates stay out of email), ADR-092 (social media — parallel "AI drafts, human approves" pattern), ADR-095 (DELTA analytics), ADR-090 (philanthropist communications), DES-033 (unified review queue), DES-035 (AI workflows)

---

---

## ADR-106: Outbound Webhook Events — Push-Based Content Syndication

**Status:** Accepted
**Date:** 2026-02-22
**Deciders:** Architecture team
**Context:** ADR-011 (API-first), ADR-081 (machine readability), ADR-023 (rate limiting), ADR-026 (messaging channels), ADR-091 (daily email), ADR-092 (social media), ADR-105 (portal updates)

### Context

The portal publishes content through multiple channels: web, daily email, RSS feeds, WhatsApp, SMS, social media, and the external MCP server. Every outbound channel currently must either poll the API for changes or be hard-wired into the content lifecycle code. This creates two problems:

1. **Polling is wasteful and laggy.** SRF's existing Zapier workflows (connected to SendGrid, Constant Contact, MS Dynamics, and other systems per the SRF Tech Stack Brief) would need to poll portal API endpoints at regular intervals to detect changes. Zapier's polling triggers check every 1–15 minutes depending on plan tier. For a daily passage that changes at midnight UTC, this means up to 15 minutes of unnecessary delay — and thousands of wasted requests across all Zapier workflows per day.

2. **Tight coupling.** Without a generic event system, each new distribution channel requires modifying the content lifecycle code. Adding a WhatsApp notification when a new book is published means editing the book ingestion pipeline. This scales poorly as channels multiply.

A lightweight outbound webhook system lets the portal **push** content lifecycle events to registered consumers — SRF's Zapier, internal systems, future partner integrations, and the portal's own subsystems — without modifying content pipelines.

### Decision

Implement an outbound webhook event system that publishes content lifecycle events to registered subscribers via HTTP POST. Events follow a standardized envelope format. Webhook registration is admin-only (no self-service until Milestone 7a+).

### Event Catalog

| Event | Fires When | Payload Summary |
|-------|-----------|-----------------|
| `daily_passage.rotated` | Daily passage changes (midnight UTC) | `chunk_id`, passage text, citation, `reader_url` |
| `content.published` | New book, chapter, audio recording, or video is published | `content_type`, `content_id`, title, `language` |
| `content.updated` | Existing content corrected (text, metadata, citations) | `content_type`, `content_id`, `changed_fields[]` |
| `theme.published` | New teaching theme approved and published | `theme_slug`, theme name, `category` |
| `collection.published` | Community collection approved by staff (ADR-086) | `collection_id`, title, `passage_count` |
| `social_asset.approved` | Social media quote image approved for distribution (ADR-092) | `chunk_id`, `asset_urls{}` (by aspect ratio), caption |
| `portal_update.published` | New portal update published (ADR-105) | `update_id`, title, summary, category |
| `search_index.rebuilt` | Search index recomputed (re-embedding, migration) | `affected_books[]`, `chunk_count` |
| `email.dispatched` | Daily email sent to subscribers (ADR-091) | `chunk_id`, `subscriber_count` (no PII) |
| `journey.step` | Calendar journey advances to next day's passage (DES-045) | `journey_slug`, `day_number`, `chunk_id` |

Events that involve content include enough data for the subscriber to act without a follow-up API call (e.g., the `daily_passage.rotated` event includes the passage text and citation, so Zapier can format an email without querying `/api/v1/daily-passage`). This reduces round-trips for automation consumers.

### Webhook Envelope

```json
{
  "event": "daily_passage.rotated",
  "event_id": "evt_01H...",
  "timestamp": "2026-03-15T00:00:12Z",
  "portal_version": "v1",
  "data": {
    "chunk_id": "uuid",
    "content": "The soul is ever free...",
    "book_title": "Autobiography of a Yogi",
    "chapter_number": 14,
    "page_number": 142,
    "reader_url": "/books/autobiography-of-a-yogi/14#chunk-uuid"
  }
}
```

Every envelope includes:
- `event` — machine-readable event type from the catalog
- `event_id` — unique UUID for idempotency (subscribers can deduplicate)
- `timestamp` — ISO 8601 UTC when the event occurred
- `portal_version` — `v1` (incremented if envelope schema changes)
- `data` — event-specific payload

### Delivery Semantics

- **At-least-once delivery.** Failed deliveries (non-2xx response or timeout) retry with exponential backoff: 1 min, 5 min, 30 min, 2 hours, 12 hours. After 5 failures, the webhook is marked `suspended` and an alert fires in Sentry.
- **Timeout:** 10 seconds per delivery attempt. Subscribers must respond quickly (accept and process asynchronously).
- **Signature verification:** Each delivery includes an `X-Portal-Signature` header — HMAC-SHA256 of the raw body using the subscriber's secret key. Subscribers should verify to prevent spoofing.
- **Ordering:** Events are delivered in approximate chronological order but not guaranteed. Subscribers should use `timestamp` for ordering, not delivery order.
- **No fan-out queuing in Milestone 5a.** Initial implementation fires webhooks synchronously from a background job (Vercel cron or Lambda). If subscriber count grows beyond ~20, migrate to SQS fan-out (Milestone 5b+).

### Schema

```sql
CREATE TABLE webhook_subscribers (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  name TEXT NOT NULL,                      -- "SRF Zapier — Daily Email", "Internal Slack Bot"
  url TEXT NOT NULL,                       -- Delivery URL (HTTPS required)
  secret TEXT NOT NULL,                    -- HMAC signing secret
  events TEXT[] NOT NULL,                  -- Subscribed event types, e.g. '{daily_passage.rotated,content.published}'
  is_active BOOLEAN DEFAULT true,
  suspended_at TIMESTAMPTZ,               -- Set after 5 consecutive failures
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by TEXT NOT NULL                 -- Admin who registered (email or role identifier)
);

CREATE TABLE webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  subscriber_id UUID NOT NULL REFERENCES webhook_subscribers(id),
  event_id TEXT NOT NULL,                  -- From envelope
  event_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'delivered', 'failed', 'suspended')),
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  response_status INTEGER,                -- HTTP status from subscriber
  response_body TEXT,                      -- First 1KB of response (for debugging)
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_deliveries_pending ON webhook_deliveries(status, created_at)
  WHERE status IN ('pending', 'failed');
CREATE INDEX idx_deliveries_subscriber ON webhook_deliveries(subscriber_id, created_at DESC);
```

### Webhook Use Cases by Consumer

**SRF Internal (Zapier / Lambda)**
- Daily passage → SendGrid/Constant Contact email campaigns
- Daily passage → WhatsApp broadcast to subscribed seekers (ADR-026)
- New content → MS Dynamics CRM update (donor/stakeholder communications)
- Social asset approved → Buffer/Hootsuite scheduling queue
- Portal update → internal Slack/Teams notification for AE team
- Content correction → trigger CDN cache purge via Vercel API
- Search index rebuilt → trigger integration test suite

**Editorial / Staff**
- Content published → notify editorial staff via email/Slack (independent of admin portal)
- Collection submitted → alert review queue (staff who aren't in the admin portal all day)
- Seeker feedback spike → alert if feedback count exceeds threshold (potential issue)
- Journey step → daily operational confirmation that journey emails dispatched correctly

**Community / External (Milestone 7a+)**
- Daily passage → third-party spiritual apps that want to display "Today's Wisdom"
- Content published → meditation center websites that embed a "Latest from Yogananda" widget
- Theme published → partner sites that curate topical Yogananda content

**Portal Internal Subsystems**
- Content published → incremental sitemap regeneration (SEO)
- Content updated → RSS feed regeneration (instead of polling the database on a cron)
- Content published → pre-warm CDN cache for new pages
- Social asset approved → auto-post to RSS (machine syndication of social assets)

### Admin Interface

Webhook subscribers are managed via the editorial admin portal (established Milestone 3b; subscriber management added Milestone 5a, extending ADR-082). The interface shows:
- Registered subscribers with event subscriptions
- Delivery log (last 30 days) with success/failure status
- "Test" button to send a test event to a subscriber
- "Suspend/Resume" controls for failing subscribers

No self-service registration. All subscribers are provisioned by SRF staff. Milestone 7a+ may introduce self-service registration with API key auth for external consumers.

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **Polling only (no webhooks)** | Simplest to build | Wasteful, laggy, scales poorly with consumers, tight coupling |
| **AWS EventBridge** | Managed, scalable, native AWS | Adds infrastructure dependency, overkill for <20 subscribers, harder to debug |
| **AWS SNS** | Managed pub/sub, HTTP subscriptions built-in | Subscription confirmation flow is awkward for Zapier, less control over retry logic |
| **Custom webhook system** | Full control, simple to understand, matches portal's "boring technology" ethos | Must build retry logic, monitoring, admin UI |

The custom webhook system wins because:
- The portal has <20 expected subscribers for several years
- Zapier consumes standard HTTP POST natively (no adapters needed)
- The retry logic is ~50 lines of code in a cron job
- Full observability via the existing Sentry + structured logging stack
- No new AWS service to provision, monitor, or pay for

### DELTA Compliance

Webhook payloads never contain seeker data. Events describe *content* lifecycle (a passage was published, a theme was added) — never *user* behavior (a seeker searched, a seeker read). The `email.dispatched` event includes `subscriber_count` (aggregate) but no individual subscriber data. The `seeker_feedback` system (ADR-084) does not fire webhook events — feedback is internal-only.

### Delivery Schedule

| Milestone | What Ships |
|-----------|-----------|
| **Milestone 5a** | Webhook schema, subscriber management, delivery engine. Initial events: `daily_passage.rotated`, `content.published`, `content.updated`, `social_asset.approved`, `portal_update.published`. Admin UI in editorial portal. |
| **Milestone 1c+** | Contentful webhook *inbound* (deliverable 1c.8) triggers portal webhook *outbound* events (`content.published`, `content.updated`). |
| **Milestone 5b+** | Additional events as channels mature: `journey.step`, `email.dispatched`. SQS fan-out if subscriber count exceeds ~20. |
| **Milestone 7a+** | Self-service webhook registration with API key auth for external consumers. |

### Consequences

- New `webhook_subscribers` and `webhook_deliveries` tables in Milestone 5a migration
- New background job for webhook delivery and retry (Vercel cron or Lambda)
- DESIGN.md § DES-052 documents the webhook event system
- ROADMAP.md Milestone 5a gains webhook deliverable
- ADR-081 § RSS section updated: RSS feeds regenerate via webhook event rather than polling cron
- SRF's existing Zapier workflows can subscribe to portal events from Milestone 5a launch
- Future messaging channels (ADR-026) can subscribe to `daily_passage.rotated` instead of polling

*Section added: 2026-02-22, outbound webhook event system*

---

---

## ADR-107: Timestamp Filtering on List Endpoints — Incremental Sync for Automation Consumers

**Status:** Accepted
**Date:** 2026-02-22
**Deciders:** Architecture team
**Context:** ADR-011 (API-first), ADR-106 (outbound webhooks), ADR-081 (machine readability), ADR-023 (rate limiting)

### Context

Outbound webhooks (ADR-106) solve the "push" problem — subscribers learn about new content immediately. But webhooks are not perfectly reliable. A subscriber might miss events during downtime, a Zapier workflow might be paused and resumed, or a new consumer might need to backfill historical changes. The standard REST solution is timestamp-based filtering: "give me everything that changed since my last sync."

Current list endpoints (`/api/v1/books`, `/api/v1/themes`, `/api/v1/passages`, etc.) return full collections with cursor-based pagination but no way to filter by recency. A Zapier polling trigger that wants "new books since yesterday" must fetch the entire book list and compare against its internal state. This is wasteful for the consumer and the portal's rate limits.

### Decision

Add `updated_since` and `created_since` query parameters to all list endpoints that return content collections. These parameters accept ISO 8601 timestamps and filter results to items modified or created after the specified time.

### Parameter Specification

```
GET /api/v1/books?updated_since=2026-03-01T00:00:00Z
GET /api/v1/themes?created_since=2026-03-15T12:00:00Z
GET /api/v1/audio?updated_since=2026-02-28T00:00:00Z&language=hi
```

| Parameter | Type | Behavior |
|-----------|------|----------|
| `updated_since` | ISO 8601 timestamp | Returns items where `updated_at > :timestamp` (includes both newly created and modified items) |
| `created_since` | ISO 8601 timestamp | Returns items where `created_at > :timestamp` (only newly created items, excludes updates to existing items) |

Both parameters:
- Are optional — omitting them returns the full collection (existing behavior unchanged)
- Compose with existing parameters (`language`, `book_id`, `category`, cursor pagination)
- Use strict greater-than (`>`) comparison, not greater-than-or-equal, to avoid re-fetching the boundary item
- Return results ordered by the filtered timestamp ascending (oldest first), which is the natural order for incremental sync

If both `updated_since` and `created_since` are provided, the API returns a 400 error — they represent different sync strategies and combining them is ambiguous.

### Affected Endpoints

| Endpoint | `updated_since` | `created_since` | Notes |
|----------|:---:|:---:|-------|
| `GET /api/v1/books` | Yes | Yes | |
| `GET /api/v1/books/[slug]/chapters` | Yes | Yes | |
| `GET /api/v1/themes` | Yes | Yes | |
| `GET /api/v1/themes/[slug]/passages` | Yes | Yes | |
| `GET /api/v1/audio` | Yes | Yes | |
| `GET /api/v1/videos` | Yes | Yes | |
| `GET /api/v1/images` | Yes | Yes | |
| `GET /api/v1/people` | Yes | Yes | |
| `GET /api/v1/ontology` | Yes | No | Ontology terms are rarely updated; `created_since` suffices via `updated_since` |
| `GET /api/v1/magazine/issues` | Yes | Yes | |
| `GET /api/v1/magazine/articles` | Yes | Yes | |
| `GET /api/v1/collections` | Yes | Yes | Community collections (ADR-086) |

Not affected:
- `GET /api/v1/search` — query-driven, not collection-based
- `GET /api/v1/daily-passage` — returns a single item, not a collection
- `GET /api/v1/affirmations` — returns a single affirmation
- `GET /api/v1/health` — operational, not content
- `GET /api/v1/graph/*` — pre-computed, served from CDN
- `GET /api/v1/search/suggest` — autocomplete, not a syncable collection

### Schema Requirement

All content tables must have both `created_at` and `updated_at` columns with indexes. The existing schema already includes `created_at` on most tables. This ADR requires:

1. **`updated_at` column** on all content tables that don't already have it.
2. **Database trigger** to automatically set `updated_at = now()` on every UPDATE.
3. **Composite index** on `(updated_at, id)` for efficient cursor pagination with timestamp filtering.

```sql
-- Example trigger (applied to all content tables)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Composite index for timestamp-filtered pagination
CREATE INDEX idx_books_updated_at ON books(updated_at, id);
CREATE INDEX idx_book_chunks_updated_at ON book_chunks(updated_at, id);
CREATE INDEX idx_teaching_topics_updated_at ON teaching_topics(updated_at, id);
```

### Response Metadata

When timestamp filtering is active, the response includes sync metadata:

```json
{
  "results": [...],
  "sync": {
    "filtered_by": "updated_since",
    "since": "2026-03-01T00:00:00Z",
    "result_count": 3,
    "latest_timestamp": "2026-03-14T09:22:11Z"
  },
  "pagination": {
    "next_cursor": "..."
  }
}
```

The `latest_timestamp` field tells the consumer what value to use for their next `updated_since` call — enabling reliable incremental sync without clock drift issues.

### Zapier Integration Pattern

Zapier's polling trigger model works naturally with `created_since`:

1. Zapier stores the `latest_timestamp` from the previous poll
2. On each poll interval, Zapier calls `GET /api/v1/books?created_since={latest_timestamp}`
3. If results are returned, Zapier triggers the workflow and updates its stored timestamp
4. If no results, Zapier does nothing

This turns Zapier from "fetch everything and deduplicate" to "fetch only what's new" — reducing API calls by orders of magnitude for stable content collections.

### Relationship to Webhooks (ADR-106)

Webhooks and timestamp filtering serve complementary purposes:

| Scenario | Best Tool |
|----------|-----------|
| Real-time notification when content changes | Webhooks (ADR-106) |
| Catching up after missed webhooks or downtime | `updated_since` filtering |
| Initial backfill when a new consumer connects | `created_since` filtering |
| Zapier polling trigger (no webhook support) | `created_since` filtering |
| Verifying webhook data against source of truth | `updated_since` filtering |

A robust integration uses both: webhooks for real-time events, timestamp filtering for reconciliation.

### Delivery Schedule

| Milestone | What Ships |
|-----------|-----------|
| **Arc 1** | `updated_at` columns and triggers on all content tables in the initial schema migration. No API filtering yet. |
| **Milestone 2a** | `updated_since` and `created_since` parameters on `GET /api/v1/books` and `GET /api/v1/books/[slug]/chapters`. |
| **Milestone 3b** | Timestamp filtering on theme endpoints (`/api/v1/themes`, `/api/v1/themes/[slug]/passages`). |
| **Milestone 3c+** | Timestamp filtering on all remaining list endpoints as they ship. |

### Consequences

- Arc 1 schema migration adds `updated_at` columns and triggers to all content tables
- All list endpoints gain optional `updated_since` and `created_since` parameters as they ship
- Response envelope gains `sync` metadata when timestamp filtering is active
- OpenAPI spec (ADR-081) documents the filtering parameters on each endpoint
- Zapier polling triggers become efficient from Milestone 2a
- Combined with ADR-106, the portal supports both push (webhooks) and pull (timestamp filtering) sync strategies

*Section added: 2026-02-22, timestamp filtering for incremental sync*

---

---

## ADR-108: Magazine API Rationalization — Flat Resources, Single-Segment Slugs

**Status:** Accepted
**Date:** 2026-02-22
**Deciders:** Architecture team
**Context:** ADR-040 (magazine content type), ADR-011 (API-first), ADR-107 (timestamp filtering), DES-041 (magazine section architecture)

### Context

ADR-040 defined five magazine API endpoints using a two-segment composite identifier (`{year}/{season}`) for issues and only a single-article lookup endpoint for articles. ADR-107 later added a flat `GET /api/v1/magazine/articles` endpoint with timestamp filtering, but DES-041's endpoint list didn't include it. This created three problems:

1. **DES-041 and ADR-107 disagreed** on whether a flat articles list endpoint existed.
2. **The `{year}/{season}` composite identifier** is unusual in APIs — it breaks conventions around path parameter counting, complicates OpenAPI specs, and requires two-segment parsing where every other resource in the portal uses a single slug.
3. **The `UNIQUE(issue_id, slug)` constraint** on `magazine_articles` meant article slugs were only unique within an issue, but `GET /api/v1/magazine/articles/{slug}` assumed global uniqueness. The schema didn't enforce what the API required.

Additionally, the single-issue endpoint returned articles inline, while the flat articles endpoint (if it existed) would provide the same data through a different path. No clear boundary between the two.

### Decision

Rationalize the magazine API into flat, independently addressable resources with single-segment identifiers. No nested sub-collection routes.

**Endpoints after rationalization:**

```
GET /api/v1/magazine/issues              — Paginated issue list
GET /api/v1/magazine/issues/{slug}       — Single issue (metadata + article summaries)
GET /api/v1/magazine/issues/{slug}/pdf   — Issue PDF

GET /api/v1/magazine/articles            — Paginated article list, filterable
GET /api/v1/magazine/articles/{slug}     — Single article with chunks
GET /api/v1/magazine/articles/{slug}/pdf — Article PDF
```

**Key changes:**

1. **Single-segment issue slugs.** `{year}/{season}` → `{slug}` (e.g., `2025-spring`). A `slug TEXT NOT NULL UNIQUE` column is added to `magazine_issues`. The slug is computed from year + season during ingestion.

2. **Flat articles list is a first-class endpoint.** `GET /api/v1/magazine/articles` supports `?issue_id=`, `?author_type=`, `?language=`, and the ADR-107 timestamp filters. This serves three use cases from one endpoint: the "Yogananda's Magazine Writings" index on the landing page (`?author_type=yogananda`), issue-scoped article browsing (`?issue_id={uuid}`), and incremental sync (`?updated_since=`).

3. **Globally unique article slugs.** The `UNIQUE(issue_id, slug)` constraint on `magazine_articles` is replaced with `UNIQUE(slug)`. The ingestion pipeline must generate globally unique slugs (e.g., by prefixing with issue slug if needed). This makes `GET /api/v1/magazine/articles/{slug}` unambiguous.

4. **No nested sub-collection route.** `GET /api/v1/magazine/issues/{slug}/articles` does not exist. The flat articles endpoint with `?issue_id=` filter replaces it. Rationale: query-parameter filtering composes (add `&author_type=yogananda` freely), avoids duplicate cache keys and code paths, and matches the pattern of every other filterable list in the portal.

5. **Single-issue response includes article summaries, not full articles.** `GET /api/v1/magazine/issues/{slug}` returns issue metadata plus a summary array (title, slug, author_name, author_type, position) — enough for the issue page to render its table of contents. Full article data (chunks, pagination) comes from the articles endpoint.

### Alternatives Considered

**Nested route (`GET /api/v1/magazine/issues/{slug}/articles`):** More discoverable for clients navigating from issue to articles. Rejected because: (a) articles are independently addressable resources that participate in search, have their own reader pages, and have their own PDFs — they aren't purely subordinate to issues; (b) the flat endpoint with `?issue_id=` serves the same need without a second code path; (c) the portal's consumers (Next.js frontend, Zapier) work better with flat + filters than link traversal.

**Keep `{year}/{season}` composite identifier:** Human-readable and maps naturally to the magazine's publishing model. Rejected because: (a) every other resource in the API uses a single path parameter; (b) composite identifiers complicate middleware, OpenAPI specs, and client libraries; (c) the slug `2025-spring` is equally readable as a single segment.

### Schema Changes

```sql
-- magazine_issues gains a slug column
ALTER TABLE magazine_issues ADD COLUMN slug TEXT NOT NULL UNIQUE;
-- e.g., '2025-spring', '1925-winter'

-- magazine_articles: slug becomes globally unique
ALTER TABLE magazine_articles DROP CONSTRAINT magazine_articles_issue_id_slug_key;
ALTER TABLE magazine_articles ADD CONSTRAINT magazine_articles_slug_key UNIQUE (slug);
```

### Consequences

- DES-041 and ADR-107 are now consistent — both reference the same set of magazine endpoints
- `magazine_issues` schema gains a `slug` column; `magazine_articles` slug constraint changes from `UNIQUE(issue_id, slug)` to `UNIQUE(slug)`
- Frontend page routes updated: `/magazine/{issue-slug}` and `/magazine/{issue-slug}/{article-slug}`
- Knowledge graph click targets updated to single-segment URLs
- Service layer signature changes: `getIssue(slug)` replaces `getIssue(year, season)`; `getArticles(cursor, limit, filters)` added
- Cache table gains entries for `/api/v1/magazine/issues/{slug}` and `/api/v1/magazine/articles`
- Ingestion pipeline must generate globally unique article slugs

*Section added: 2026-02-22, magazine API rationalization*

---

---

## ADR-109: Cross-API Route Rationalization — Consistent Identifiers, Consolidated Namespaces, Complete CRUD

**Status:** Accepted
**Date:** 2026-02-22
**Deciders:** Architecture team
**Context:** ADR-025 (PDF routes), ADR-050 (chunk relations), ADR-055 (video integration), ADR-057 (audio), ADR-108 (magazine API rationalization)

### Context

A cross-API review after ADR-108 (magazine rationalization) revealed five inconsistencies that accumulated as different content types were designed in separate ADRs:

1. **Chapter sub-resources split across two URL namespaces.** Chapter content lives at `/api/v1/books/[slug]/chapters/[number]`, but thread and relations endpoints broke out to a top-level `/api/v1/chapters/[slug]/[number]/`. Same resource, two URL patterns.

2. **Video endpoints use `{id}` while every other resource uses `{slug}`.** The `videos` table has `slug TEXT NOT NULL UNIQUE`, but ADR-025 and ADR-055 defined transcript endpoints as `/api/v1/videos/{id}/transcript`. Audio uses `{slug}` for the identical pattern.

3. **DESIGN.md still references a rejected PDF namespace.** The sharing section (DES-018) uses `/api/v1/pdf/passage/{chunk-id}`, `/api/v1/pdf/chapter/{book-slug}/{chapter}`, `/api/v1/pdf/book/{book-slug}` — a parallel namespace that ADR-025 explicitly rejected under "Why Not `/api/v1/pdf/books/{slug}`".

4. **Audio and video lack single-resource detail endpoints.** Every other content type (books, images, people, glossary, ontology, places, magazine issues/articles) has a `GET /resource/{slug}` detail endpoint. Audio and video only had list + transcript sub-resources.

5. **Books lack a single-resource detail endpoint.** `GET /api/v1/books` (list) and `GET /api/v1/books/[slug]/chapters/[number]` (chapter content) exist, but no `GET /api/v1/books/{slug}` for book metadata with chapter index. The book landing page (`/books/[slug]`) needs this data.

### Decision

Apply five targeted fixes to bring the entire API surface into consistency.

**1. Consolidate chapter sub-resources under `/books/[slug]/chapters/[number]/`.**

```
GET /api/v1/books/[slug]/chapters/[number]            — chapter content
GET /api/v1/books/[slug]/chapters/[number]/pdf         — chapter PDF
GET /api/v1/books/[slug]/chapters/[number]/thread      — reading thread
GET /api/v1/books/[slug]/chapters/[number]/relations   — batch relation prefetch
```

The top-level `/api/v1/chapters/` namespace is eliminated. Chapters are subordinate to books — they're not independently addressable. A developer who discovers `/books/autobiography/chapters/3` can append `/thread` or `/relations` without learning a second URL pattern.

**2. Video endpoints use `{slug}`, not `{id}`.**

```
GET /api/v1/videos/{slug}                  — video detail (NEW)
GET /api/v1/videos/{slug}/transcript       — transcript JSON
GET /api/v1/videos/{slug}/transcript/pdf   — transcript PDF
```

Matches audio (`/api/v1/audio/{slug}/transcript`) and every other resource in the API. The `videos` table already has `slug TEXT NOT NULL UNIQUE`.

**3. DESIGN.md PDF references corrected to match ADR-025.**

The sharing section's `/api/v1/pdf/passage/{chunk-id}` references are replaced with resource-anchored routes per ADR-025's established pattern. Single-passage PDFs use `POST /api/v1/exports/pdf` with a single-item body.

**4. Audio and video gain detail endpoints.**

```
GET /api/v1/audio/{slug}    — recording metadata (speaker, duration, type, etc.)
GET /api/v1/videos/{slug}   — video metadata (platform, speakers, duration, etc.)
```

Both schemas have rich metadata that the frontend detail pages need. These follow the same pattern as `GET /api/v1/images/{slug}`, `GET /api/v1/people/[slug]`, etc.

**5. Books gain a detail endpoint.**

```
GET /api/v1/books/{slug}    — book metadata + chapter index
```

Returns title, author, description, cover image, publication year, bookstore URL, available languages, and chapter list (number + title). Serves the book landing page (`/books/[slug]`). Eliminates the tentative note about "a new endpoint or `?include=chapters`" in the book landing page design.

### Not Changed

- **`/api/v1/videos/latest` and `/api/v1/videos/catalog`** remain as-is. These are Milestone 2b YouTube-proxy convenience endpoints. When videos become database-backed in Arc 6, the main `GET /api/v1/videos` endpoint with query parameters supersedes them. Premature to rationalize a transitional design.

- **Nested routes where nesting is correct.** `/books/[slug]/chapters/[number]`, `/themes/[slug]/passages`, `/people/[slug]/passages`, `/images/{slug}/related` — these nest a subordinate or relationship resource under its parent. The nesting is appropriate and stays.

### Consequences

- The top-level `/api/v1/chapters/` namespace no longer exists — all chapter sub-resources live under `/api/v1/books/[slug]/chapters/[number]/`
- All video endpoints use `{slug}`, consistent with every other resource
- DESIGN.md § DES-018 sharing section uses ADR-025-compliant PDF routes
- Three new detail endpoints: `GET /api/v1/books/{slug}`, `GET /api/v1/audio/{slug}`, `GET /api/v1/videos/{slug}`
- Cache table gains entries for all new detail endpoints
- Service layer gains `getBook(slug)`, `getRecording(slug)`, `getVideo(slug)` functions
- ROADMAP.md Milestone 3c deliverable updated to use consolidated chapter URLs

*Section added: 2026-02-22, cross-API route rationalization*

---

---

## ADR-110: API Response Conventions — Envelope, Naming, and Identifier Standards

**Status:** Accepted | **Date:** 2026-02-22

**Relates to:** ADR-011, ADR-027, ADR-107, ADR-109, DES-019

### Context

DES-019 specifies individual API endpoints with inline response examples. As the endpoint count grew from Arc 1's initial set (~8 endpoints) through cross-media expansion (Arc 6: ~30+ endpoints), three categories of response convention accumulated implicitly without being declared:

1. **Field naming.** Some response examples used `snake_case` (matching PostgreSQL column names), others appeared to use `camelCase` (matching TypeScript conventions). The `hasMore` field in pagination sat alongside `book_title` and `results_count` — a silent inconsistency.

2. **Response envelopes.** List endpoints used inconsistent top-level keys: search returned `{ results: [...] }`, themes returned `{ themes: [...] }`, related returned `{ related: [...] }`. Pagination fields (`cursor`, `hasMore`) were mixed into the top level of some responses but absent from others. Sync metadata (ADR-107) added another top-level key. A mobile developer consuming three endpoints would learn three different shapes.

3. **Resource identifiers.** Books use slugs, chunks use UUIDs, chapters use numbers — each defensible individually, but the pattern was unstated. A developer couldn't predict whether a new endpoint would use slugs or UUIDs without reading the example.

Without explicit conventions, each new endpoint or milestone adds entropy. A 10-year API surface (ADR-004) requires declared standards, not emergent patterns.

### Decision

#### 1. Field naming: `snake_case`

All JSON response fields use `snake_case`. This aligns with PostgreSQL column naming (the source of truth for most response fields) and avoids ambiguity. The service layer (`/lib/services/`) uses TypeScript `camelCase` internally; the API route layer transforms at the boundary via a standard serialization utility.

**Rationale:** `camelCase` is conventional in JavaScript ecosystems, but `snake_case` eliminates the mental translation between database columns and API fields — important for a small team maintaining both layers. PostgreSQL is the 10-year commitment (ADR-004); JavaScript framework conventions may change.

#### 2. Response envelope: `data` / `pagination` / `meta`

Three response shapes, consistently applied:

**Paginated lists** (any endpoint returning a subset of a larger collection):
```json
{
  "data": [...],
  "pagination": { "cursor": "opaque_value", "has_more": true },
  "meta": { "total_count": 47 }
}
```

**Complete collections** (full set fits in one response):
```json
{
  "data": [...],
  "meta": { "total_count": 12 }
}
```

**Single resources** (no wrapper — the object *is* the response):
```json
{
  "id": "uuid",
  "title": "Autobiography of a Yogi",
  ...
}
```

Top-level context fields (e.g., `query` on search, `theme` on theme passages, `source_chunk_id` on related passages) remain at the top level alongside `data`. Sync metadata (ADR-107) nests under `meta.sync`. Endpoint-specific metadata (e.g., `source: "precomputed"` on related passages) nests under `meta`.

**Rationale:** The `data`/`pagination`/`meta` pattern is well-established (JSON:API, Stripe, many public APIs). It separates *what you asked for* (`data`) from *how to get more* (`pagination`) from *information about the response* (`meta`). Mobile developers can write a single pagination handler for all paginated endpoints.

#### 3. Resource identifiers: three types, declared

| Identifier Type | Used For | Why |
|---|---|---|
| **Slug** (kebab-case string) | Books, themes, people, places, glossary terms, audio, video, magazine articles | Human-readable, SEO-friendly, stable across editions. Theme slugs are English regardless of locale (ADR-027). |
| **UUID** | Chunks (passages), relations, internal entities | Stable across re-ingestion via content-hash fallback (ADR-022). Not human-readable by design — passages are addressed by their content, not their name. |
| **Number** (within parent) | Chapters within a book, paragraphs within a chapter | Natural ordering. Always nested under a parent slug: `/books/{slug}/chapters/{number}`. |

New endpoints must use the identifier type matching their resource category.

#### 4. Search is intentionally unpaginated

The search endpoint returns ranked results (default 5, max 20) with no `pagination` block. This is deliberate: the AI librarian returns the *best* answers, not a corpus to browse. Pagination would imply exhaustive result sets, contradicting the librarian model (ADR-001). Seekers wanting broader exploration use theme pages, the `/browse` index, or the Knowledge Graph.

#### 5. `exclude` parameter for refresh behavior

Endpoints supporting "show me another" (random single-item responses) accept an `exclude` query parameter — the ID of the item to omit. Prevents repeat-on-refresh without client-side deduplication. Applied to: `/api/v1/daily-passage`, `/api/v1/affirmations`.

### Alternatives Considered

1. **`camelCase` for JSON fields.** Conventional in JavaScript but creates a translation layer between PostgreSQL columns and API responses. For a small team with a single database, matching the database is simpler.

2. **Resource-specific top-level keys (`books`, `themes`, `related`).** More semantically descriptive but forces clients to know the key name per endpoint. `data` is generic and predictable.

3. **HAL or JSON:API full compliance.** These standards add hypermedia links (`_links`, `relationships`) that the portal doesn't need — the API is consumed by known clients, not discovered dynamically.

### Consequences

- DES-019 response examples updated to use the `data`/`pagination`/`meta` envelope and `snake_case` fields.
- All future endpoint specifications must follow these conventions.
- Existing endpoint examples in DESIGN.md that predate this ADR have been retroactively updated.
- A `serializeResponse()` utility in `/lib/services/` handles `camelCase` → `snake_case` transformation at the API boundary.
- Mobile app developers can write generic pagination and error handling against a predictable response shape.

---

---

## ADR-111: Search Result Presentation — Ranking, Display, and Intentional Non-Pagination

**Status:** Accepted | **Date:** 2026-02-22

**Relates to:** ADR-001, ADR-005, ADR-044, ADR-050, ADR-110, DES-019

### Context

The portal's search architecture is distributed across multiple ADRs: hybrid search mechanics (ADR-044), Claude's role in ranking (ADR-005 C2), related teachings (ADR-050), search suggestions (ADR-049), and API conventions (ADR-110). But no single ADR addresses how search results are *presented* to seekers — the ranking signals, display format, deduplication rules, and the deliberate absence of pagination. These decisions are architectural (they shape the seeker's primary interaction) and should be governed, not left to implementation.

### Decision

#### 1. Ranking signal hierarchy

Search results are ranked by a composite score combining multiple signals. The hierarchy (highest to lowest weight):

| Signal | Source | Weight | Notes |
|---|---|---|---|
| **Semantic relevance** | Vector similarity (cosine distance) | Primary | The passage's meaning matches the query's intent |
| **Lexical relevance** | Full-text search rank (ParadeDB BM25 `paradedb.score()`, ADR-114) | Secondary | Exact term matches, especially for proper nouns and Sanskrit terms |
| **Claude passage ranking** | Claude Haiku (ADR-005 C2) | Tertiary (re-ranker) | Re-ranks the top candidates from hybrid retrieval based on query intent |
| **Accessibility level** | `accessibility_level` column (ADR-005 E3) | Tie-breaker | When two passages are equally relevant, the more accessible passage ranks higher |
| **Tone appropriateness** | `tone` column (ADR-005 E4) | Tie-breaker | When the query implies emotional need (grief, fear), consoling passages rank higher |

| **Author tier** | `books.author_tier` column (PRO-014) | Tie-breaker | Guru tier ranks above president at equivalent relevance; president above monastic. Reflects author role hierarchy. |

**Not used as ranking signals:** Passage length, book popularity, recency, seeker behavior, click-through rates. The portal never uses engagement metrics to shape results (ADR-095, ADR-002).

#### 2. Display format per result

Each search result displays:
- **Passage text** — the verbatim chunk content. No AI-generated summary, no truncation below 200 characters.
- **Author name** — full author name on ALL passages across ALL author tiers (PRO-014). Always "Paramahansa Yogananda", "Swami Sri Yukteswar", "Sri Daya Mata", etc. — never shortened. Displayed in search results, passage display, daily wisdom, social media cards, and all other citation contexts.
- **Citation** — author name, book title, chapter title, page number. Always present. Never omitted for brevity.
- **"Read in context" link** — deep link to the reader at the passage's location. This link is the critical bridge between the librarian's finding and the seeker's reading (ADR-001).
- **Relevance score** — not displayed to seekers. Used internally for debugging and search quality evaluation.

*Revised: 2026-02-25, PRO-014 — added author name to citation display. Full author name on all passages, all tiers.*

**Not displayed:** Themes, accessibility level, tone classification. These are infrastructure signals, not seeker-facing metadata.

#### 3. Deduplication

When the same passage appears in multiple editions or as both a book chunk and a magazine article chunk:
- **Same content, different editions:** Display once. Use the preferred edition (highest `edition_year`). The archived edition's passage does not appear.
- **Same content, different content types (book vs. magazine):** Display the book passage. The magazine attribution appears only if the seeker is browsing the magazine section.
- **Near-duplicate passages** (same teaching in different books, different wording): Display both. Yogananda deliberately taught the same principles in different contexts — these are not duplicates, they are complementary perspectives.

#### 4. Result count rationale

Default 5 results, maximum 20 per request. No pagination.

- **5 as default:** The librarian metaphor — "Here are the five most relevant passages" — matches how a human librarian responds. Presenting 50 results would imply a search engine, not a librarian.
- **20 as maximum:** A seeker who explicitly requests more (via `limit` parameter or future "Show more" button) can see up to 20. Beyond 20, the relevance tail drops below usefulness for most queries.
- **No pagination:** The librarian does not say "here are results 21–40." If a seeker wants broader exploration, the portal offers theme pages (`/themes/{slug}`), the browse index (`/browse`), and the Knowledge Graph — purpose-built for exploration, not search result pagination.

#### 5. Empty results behavior

When search returns zero results:
- Display a warm message: *"I couldn't find teachings on that topic. You might explore related themes below, or try different words."*
- Suggest 2–3 related themes based on query term similarity to theme names.
- Never display "No results found" without guidance.
- Log the zero-result query for search quality evaluation (anonymized, ADR-095).

#### 6. Search quality evaluation integration

The presentation decisions above are validated by the search quality test suite (ROADMAP deliverable 1a.8):
- Each test query has expected passages that should appear in the top 3 results.
- Accessibility boosting is validated: for empathic queries ("dealing with grief"), consoling/accessible passages should rank higher.
- Deduplication is validated: edition variants should not appear as separate results.
- Empty results guidance is validated: intentionally obscure queries should produce helpful suggestions, not empty pages.

### Alternatives Considered

1. **Display themes and accessibility level on results.** Provides more context but risks visual clutter on a calm interface. Theme information is available by clicking "Read in context."

2. **Paginated search.** Conventional but contradicts the librarian model. The portal is not a search engine — it is a finding aid.

3. **AI-generated result summaries.** Would provide quick scanning but violates ADR-001 (no AI synthesis of Yogananda's words). The passage text *is* the summary.

### Consequences

- DES-019 search endpoint documentation updated to reference this ADR for presentation logic.
- The search quality test suite (deliverable 1a.8) must validate ranking, deduplication, accessibility boosting, and empty-result behavior.
- Future content types entering search (video transcripts, audio transcripts, magazine articles) must follow the same ranking hierarchy and deduplication rules. Cross-media result interleaving rules will be specified when those content types are integrated (Arc 6).
- The "5 results" default is a design decision, not a technical constraint. It may be adjusted based on Milestone 1a search quality evaluation — but the adjustment should be governed (update this ADR), not ad hoc.

---

---

## ADR-112: Content Versioning Strategy — Editions, Translations, and Archive Policy

**Status:** Accepted | **Date:** 2026-02-22

**Relates to:** ADR-022, ADR-034, ADR-039, ADR-046, ADR-078, DES-004, DES-034

### Context

The portal manages content that changes over time in several distinct ways:

1. **Book editions.** SRF periodically publishes revised editions. The 13th edition of *Autobiography of a Yogi* (1998) differs from the 1946 first edition in pagination, paragraph structure, and minor editorial corrections. ADR-034 established edition-aware modeling; ADR-022 established content-hash deep links. But neither addresses the *lifecycle*: when a new edition arrives, what happens to the old one?

2. **Translation updates.** SRF/YSS may update official translations — correcting a passage, improving fluency, or aligning with a new English edition. ADR-078 governs the translation workflow. But when a Spanish translation is updated, what happens to the prior version? Is it replaced or archived?

3. **Magazine content.** Back-issue articles are generally immutable. But SRF might request corrections (typos, factual errors in biographical articles) or re-categorize content. ADR-040 doesn't address post-publication changes.

4. **Embedding model migration.** ADR-046 specifies that chunks carry an `embedding_model` field, enabling parallel models during migration. But the versioning of the embeddings themselves (before and after migration) lacks a lifecycle policy.

5. **AI-classified metadata.** Theme tags, tone classifications, accessibility levels — all AI-proposed, human-reviewed. If the AI model improves (or the prompt changes), should existing classifications be re-evaluated? ADR-100 addresses the maturity model but not the re-evaluation lifecycle.

Without a unified versioning strategy, the portal risks data loss (old editions overwritten), broken links (shared URLs pointing to removed content), and silent inconsistency (some translations updated, others stale).

### Decision

#### 1. Editions: archive, never delete

When a new edition of a book is ingested:
- The new edition's book record is created with a new `id`, linking to the same `canonical_book_id` as the prior edition.
- The prior edition's `is_current_edition` flag is set to `false`. Its chunks, embeddings, and relations remain in the database.
- The prior edition is no longer surfaced in search results, theme pages, or daily passage selection. It is not indexed for new queries.
- Deep links to prior-edition passages continue to resolve via content-hash fallback (ADR-022). The resolution chain: exact chunk ID → content-hash match in current edition → content-hash match in archived edition → graceful "passage may have moved" fallback.
- The `/books/{slug}` page shows the current edition. A "Previous editions" note (if applicable) links to an edition history page showing which edition the seeker is reading. This is informational, not navigational — seekers don't browse old editions.
- The prior edition's PDF (if generated) is removed from active distribution but retained in S3 archive.

**Never delete a chunk that has ever been shared.** Shared links, email quotes, WhatsApp messages, and bookmarks all reference chunk IDs. Deleting chunks breaks trust.

#### 2. Translation updates: version, don't replace

When a translation is updated:
- A new `book` record is created for the updated translation, with a new `id` and the same `canonical_book_id`.
- The prior translation version follows the same archive-not-delete pattern as editions.
- `canonical_chunk_id` alignment is re-computed for the new translation.
- If the translation is a minor correction (typo fix, punctuation), the prior translation may be updated in place *only if* no chunks have been shared via external links. If any chunks have been shared, the archive-not-delete pattern applies.
- Translation `version` is tracked: `edition_year` + `translation_revision` (e.g., "2024 Spanish, revision 2").

#### 3. Magazine content: immutable with errata

Published magazine articles are treated as immutable historical documents.
- **Typo corrections:** Applied in place (no versioning for trivial errors). The `updated_at` timestamp reflects the change. No shared-link concern for character-level typos.
- **Substantive corrections** (factual errors, misattributions): An `errata` note is appended to the article metadata, visible on the article page. The original text is not altered — the erratum is additive. Example: *"Note: The original article attributed this statement to Brother Anandamoy. It was spoken by Brother Premamoy. Corrected 2026-09-15."*
- **Re-categorization** (e.g., changing `author_type`): Metadata change only, applied directly. No content versioning needed.

#### 4. Embedding model migration: parallel, then converge

Per ADR-046, embedding migration follows a parallel-run strategy:
- New embeddings are computed alongside old embeddings. Both stored, distinguished by `embedding_model` column.
- Search queries run against both embedding sets during the migration window. Results are merged and ranked.
- Once search quality evaluation confirms the new model meets or exceeds the old (per-language, per ADR-047), the old embeddings are marked `deprecated`.
- Deprecated embeddings are retained for 90 days (matching the PITR window), then deleted. The `embedding_model` column value is preserved on chunks as a historical record.

#### 5. AI-classified metadata: re-evaluation cadence

When a significant AI model upgrade or prompt revision occurs:
- Existing classifications are *not* automatically re-evaluated. The current classifications were human-reviewed and represent editorial decisions.
- A re-evaluation *may* be triggered by the portal coordinator if: (a) the new model is substantially better (demonstrated on a test set), (b) the editorial team has capacity, and (c) the re-evaluated classifications go through the same review pipeline as initial classifications (same maturity stage per ADR-100).
- Re-evaluation is opt-in, per-workflow, per-language. It is never mandatory.

### Alternatives Considered

1. **Replace editions in place.** Simpler but breaks shared links and loses the audit trail. Unacceptable for a 10-year platform where passages have been quoted in emails, printed, and shared.

2. **Expose all editions equally in search.** Would clutter results with near-duplicate passages from different editions. The deduplication rule (ADR-111) shows the current edition; the archive exists for link resolution, not discovery.

3. **Version magazine articles like editions.** Excessive for content that changes rarely and minimally. The errata pattern is simpler and more honest.

4. **Auto-re-evaluate all AI classifications on model change.** Would overwhelm the editorial team and disrespect prior human review decisions. Classifications represent editorial judgment, not just AI output.

### Consequences

- The `books` table's `is_current_edition` flag becomes the governing field for search indexing and content surfacing.
- Deep link resolution (ADR-022) now has a defined fallback chain that includes archived editions.
- Translation updates create new book records, not in-place modifications — consistent with the edition model.
- Magazine articles gain an `errata` metadata field (nullable JSON array) in the schema.
- Embedding migration has a defined lifecycle: parallel → converge → deprecate → delete (90 days).
- AI re-evaluation is explicitly opt-in — preventing scope creep when models improve.
- DESIGN.md § DES-034 (Content Lifecycle Management) should reference this ADR for versioning policy.

---

---

## ADR-113: Prove Before Foundation (Arc 1 Milestone Split)

- **Status:** Accepted
- **Date:** 2026-02-22

### Context

Arc 1 ("Prove") had accumulated 21 deliverables — a mix of the core existential question ("does semantic search work over Yogananda's text?") and production foundation work (Vercel deployment, Sentry, observability, query expansion, rate limiting, MCP server, homepage, cultural consultation). The arc was structured as a single unit gated only by SRF availability.

The risk: 21 deliverables is a product, not a proof. The most consequential question — whether hybrid vector + FTS search produces quality results over Yogananda's specific prose — was buried among infrastructure tasks. If search quality fails, everything else built in Arc 1 is premature.

Additionally, 120+ ADRs and 57 design sections existed with zero lines of code. The design was comprehensive and ready for implementation, but the gap between design and empirical contact was widening.

### Decision

Split Arc 1 into three milestones:

**Milestone 1a: Prove** (8 deliverables)
Answer one question: does semantic search over Yogananda's text return relevant, accurately cited, verbatim passages? English only. Minimal vertical slice: repo → Contentful content model → schema → ingest → search → read → evaluate. No deployment, no AI enhancements, no homepage, no observability beyond what's needed locally. Claude validates autonomously — no human QA gate.

**Milestone 1b: Bilingual** (3 deliverables)
Extend the proven English pipeline to Spanish. Spanish ingestion, cross-language search validation, and bilingual search evaluation. Proves the multilingual architecture before production deployment. Hindi deferred to Milestone 5b (authorized source unavailable outside India).

**Milestone 1c: Deploy** (16 deliverables)
Deploy to Vercel, add Claude-based query expansion and intent classification, build the homepage, establish observability, add rate limiting and search suggestions, seed the entity registry and enrichment pipeline, and establish the query intent taxonomy. This milestone transforms the proven bilingual prototype into a deployed, AI-enhanced portal.

Milestone 1a has two conversation prerequisites (edition confirmation, PDF source) but no engineering dependencies. Milestone 1b is gated on Milestone 1a's search quality evaluation passing (≥ 80% threshold). Milestone 1c is gated on Milestone 1b's bilingual search evaluation.

### Rationale

- **Empirical contact first.** The design is ready. The highest-value action is contact with the actual corpus — Yogananda's long-form, metaphor-dense, sometimes archaic spiritual prose. No amount of design iteration substitutes for running embeddings against real text.
- **Fail fast on the existential question.** If chunking, embedding, or hybrid search produce poor results on this specific corpus, the project needs to know immediately — not after building a homepage and observability stack.
- **Prove multilingual before deploying.** Spanish is Tier 1 activated in Arc 1 (ADR-128). Validating bilingual search quality before production deployment avoids shipping a monolingual portal that requires re-architecture for multilingual support.
- **Reduce Arc 1 scope creep.** 21 deliverables labeled "Prove" set an implicit expectation that all 21 must complete before declaring Arc 1 done. The three-milestone split makes each proof explicit and small.
- **Contingency planning.** Milestone 1a includes a "What If Search Quality Fails?" section with four concrete fallbacks (chunking adjustment, embedding model swap, manual curation bridge, hybrid weighting tuning). This contingency was absent from the original single-milestone structure.

### Alternatives Considered

1. **Keep Arc 1 as a single milestone, just start building.** Viable but risks building the homepage and observability before knowing if search works. The split costs nothing — it's a reframing, not a structural change.

2. **Move Milestone 1c deliverables into Milestone 2a.** Considered, but Milestone 2a ("Build") already has its own scope (all pages, engineering infrastructure, accessibility). Milestone 1c is genuinely "foundation" work that should precede Milestone 2a.

3. **Even smaller Milestone 1a (5 deliverables — no reader, no eval).** The reader and evaluation are both essential to declaring search "proven." Without the reader, "Read in context" links can't be tested. Without the evaluation, the quality threshold is subjective.

4. **Two milestones (Prove + Deploy) without a separate Bilingual milestone.** Would either delay Spanish to post-deploy (violating Global-First) or bundle bilingual validation into the proof milestone (blurring the English-only existential question).

### Consequences

- Milestone 1a can begin immediately once edition and PDF source are confirmed — no SRF AE team availability needed.
- Milestone 1b is gated on Milestone 1a's search quality evaluation. If the evaluation fails, Milestone 1b is deferred until contingency measures resolve the quality gap.
- Milestone 1c is gated on Milestone 1b's bilingual search evaluation.
- Milestone 2a's hard prerequisite changes from "Arc 1 complete" to "Milestone 1c complete."
- The Gates table in ROADMAP.md is updated to reflect the three-milestone split.
- References to Arc 1 deliverable numbers in other documents (DESIGN.md, CONTEXT.md) should use the 1a/1b/1c numbering.

*Revised: 2026-02-28, expanded from two milestones (1a/1b) to three (1a/1b/1c). Milestone 1b (Bilingual — originally Trilingual, Hindi deferred) inserted; old Milestone 1b (Deploy) becomes Milestone 1c. Human QA gate removed — Claude validates autonomously.*

---

---

## ADR-123: Principle vs. Parameter — Decision Classification and Governance Flexibility

- **Status:** Accepted
- **Date:** 2026-02-23

### Context

After a comprehensive review of the project's 120 ADRs, 57 design sections, and 7-arc roadmap, a structural pattern emerged: the documents frequently conflate *principles* (immutable commitments that define the project's identity) with *parameters* (tunable defaults that should adapt to real data). Both are recorded at the same authority level in DECISIONS.md and DESIGN.md, which creates a ratchet effect — every mechanism decision accumulates the weight of a principle decision, and relaxing any parameter *feels* like violating a principle even when it doesn't.

This matters because: (1) no code exists yet; (2) many specific values (cache TTLs, debounce timers, chunk sizes, rate limits, fusion parameters) are pre-production guesses that need validation against real data; (3) the 10-year horizon (ADR-004) demands that future maintainers can tune operational parameters without navigating the full ADR governance process.

### Decision

Classify every decision and design specification into one of two categories:

**Principles** — Immutable commitments. Changing these changes the project's identity. Require full ADR-level deliberation to modify.

Examples:
- Direct quotes only, no AI synthesis (ADR-001)
- Human review as mandatory gate (ADR-005, ADR-032, ADR-078)
- DELTA-compliant analytics (ADR-095)
- Sacred text fidelity (ADR-075)
- Global-First (ADR-006)
- Calm Technology (ADR-065)
- Signpost, not destination (ADR-104)
- 10-year architecture horizon (ADR-004)
- API-first architecture (ADR-011)
- Accessibility from first deployment (ADR-003)
- Multilingual from the foundation (ADR-075)

**Parameters** — Tunable defaults. Ship with the documented value. Adjust based on evidence. Changes are configuration updates, not architectural decisions. Document the current value, the rationale for the default, and the evaluation trigger (what data would prompt reconsideration).

Examples:
- RRF fusion k=60 (DES-003) — tune after Milestone 1a.8 search quality evaluation
- Dwell debounce 1200ms (DES-009) — tune after Milestone 2b user testing
- Chunk size 200–300 tokens (ADR-048) — tune per language after ingestion
- Chunk overlap: none (ADR-048) — evaluate 10% overlap in Milestone 1a.8
- Rate limits: 15 req/min search, 200 req/hr hard block (ADR-023) — adjust based on observed traffic
- Email purge delay: 90 days (DES-030) — adjust based on legal review
- Cache TTLs: 5min/1hr/24hr (DES-020) — adjust based on cache hit rate data
- ISR revalidation intervals (DES-006) — adjust based on Vercel Analytics metrics
- Circadian color band boundaries (DES-011) — adjust after Milestone 2b user feedback
- Quiet Index texture count: 5 (DES-029) — adjust after Milestone 3b usage data

### Implementation

1. **Annotation convention:** Parameters in DESIGN.md are annotated with `*[Parameter — default: {value}, evaluate: {trigger}]*` inline after the value. This signals to implementers that the value should be a configuration constant, not a hardcoded literal.

2. **Configuration constants:** All parameters are implemented as named constants in `/lib/config.ts` (or environment variables for deployment-specific values), never as magic numbers in application code.

3. **Evaluation log:** When a parameter is tuned based on data, add a brief note to the relevant DESIGN.md section: `*Parameter tuned: [date], [old] → [new], [evidence].*`

4. **Milestone gate integration:** Milestone 1a.8 (search quality evaluation) and Milestone 2b success criteria explicitly include parameter validation as deliverables. Parameters marked "evaluate: Milestone 1a.8" are reviewed during that gate.

### Rationale

- **Reduces governance friction.** Future maintainers can adjust a cache TTL without feeling they're violating an architectural decision.
- **Makes assumptions explicit.** Every parameter documents what would trigger reconsideration — a form of intellectual honesty about what we don't yet know.
- **Preserves architectural integrity.** Principles remain firm. The distinction *protects* principles by preventing parameter-level fatigue from eroding respect for the governance process.
- **Serves the 10-year horizon.** In year 7, a new developer can identify what's tunable vs. what's sacred without reading 120+ ADRs.

### Consequences

- All existing magic numbers in DESIGN.md to be annotated with the parameter convention during Arc 1 implementation
- `/lib/config.ts` created as the canonical location for runtime parameters
- Milestone 1a.8 success criteria updated to include parameter validation
- Future ADRs specify whether each specific value is a principle or parameter
- CLAUDE.md updated to reference this classification in the document maintenance guidance

---

---

## ADR-124: Neon Platform Governance — PostgreSQL Version, Tier, Compute, Branching, Extensions, and Observability

- **Status:** Accepted
- **Date:** 2026-02-25

### Context

The portal uses Neon Serverless Postgres as its single database (ADR-013). Prior to this decision, Neon-specific platform capabilities were referenced throughout the documentation without a central governance ADR. Compute configuration, tier selection, branching strategy, extension management, and database observability were implicit or distributed across ADR-009, ADR-019, ADR-094, and DESIGN-arc1.md.

A comprehensive audit of Neon's feature catalog against our design documents revealed:

1. **Tier-gated features.** Several capabilities critical to production readiness (30-day PITR, protected branches, OpenTelemetry export, configurable autosuspend) are only available on paid tiers.
2. **Missing extensions.** `pg_stat_statements` (query performance) was not in the first migration despite clear Arc 1 value.
3. **No compute governance.** No ADR specified compute sizing per environment, autosuspend policy, or scaling strategy.
4. **No branch lifecycle policy.** Branch naming, TTL auto-expiry, and the distinction between persistent and ephemeral branches were undocumented.
5. **No database observability.** The observability strategy (ADR-095) covered application monitoring but not database-level metrics.

### Decision

Establish **Neon Scale tier with PostgreSQL 18** as the project's database platform from Milestone 1a, with explicit governance for PostgreSQL version, compute, branching, extensions, and observability.

#### PostgreSQL Version: 18

| Option | Pros | Cons |
|--------|------|------|
| **PostgreSQL 18** (chosen) | Upstream stable since Sept 2025; UUIDv7, skip scan, virtual generated columns, parallel GIN builds, `casefold()`, Unicode 16.0.0; avoids future major version upgrade; patches through ~2030 (ADR-004) | Neon designates as "preview" (Feb 2026); async I/O disabled on Neon (`io_method = 'sync'`) |
| PostgreSQL 17 | Neon "stable" designation; fully validated platform features | Older; requires major version upgrade later; misses UUIDv7, skip scan, virtual columns; patches through ~2029 |

**Why PG18:** The portal launches late 2026. Neon will almost certainly exit PG18 preview well before launch — PG18 has been upstream stable for 5 months (since Sept 25, 2025). Starting on PG18 avoids a future major version upgrade. The 10-year design horizon (ADR-004) favors the newer major version.

**PG18 features leveraged:**

| Feature | Arc | Benefit |
|---------|-----|---------|
| `uuidv7()` | 1+ | Time-ordered UUIDs for all content tables. Better B-tree index locality than `gen_random_uuid()`. Natural chronological ordering without separate timestamp indexes. |
| Skip scan on B-tree indexes | 1+ | Composite `(updated_at, id)` indexes (ADR-107) become usable for id-only queries. |
| Parallel GIN index creation | 1+ | Speeds pg_search/ParadeDB BM25 index builds during ingestion. |
| Enhanced `RETURNING` (OLD/NEW) | 1+ | Simplifies ingestion pipeline upsert logic and `book_chunks_archive` pattern. |
| `EXPLAIN ANALYZE` with BUFFERS | 1+ | Included by default, complementing pg_stat_statements observability (this ADR). |
| Data checksums by default | 1+ | Enabled automatically for new Neon projects. |
| Unicode 16.0.0 | 1+ | Improved case mapping for Sanskrit/Hindi diacritics (ADR-080). |
| Virtual generated columns | 1c+ | Compute values at read time without storage overhead. Evaluate for normalized search text. |
| `casefold()` | 1c+ | Unicode-aware case-insensitive matching. Evaluate for Sanskrit term normalization. |
| `COPY REJECT_LIMIT` | 1a.4 | Error-tolerant bulk ingestion. Evaluate for PDF import pipeline. |
| `WITHOUT OVERLAPS` temporal constraints | 2a+ | Evaluate for daily passage scheduling, event scheduling. |
| `array_sort()` / `array_reverse()` | 2a+ | Tag array processing for teaching topics and entity aliases. |
| Async I/O | Neon-gated | Neon runs `io_method = 'sync'` during preview. Benefit arrives when Neon enables it — no code changes needed. |

**Schema convention — UUIDv7:** All table primary keys use `DEFAULT uuidv7()` instead of `gen_random_uuid()`. UUIDv7 embeds a millisecond-precision timestamp, providing natural chronological ordering and significantly better B-tree index locality (reduced page splitting on INSERT). The embedded timestamp is not sensitive — all content tables already carry explicit `created_at`/`updated_at` columns.

**Terraform parameter:** Neon project specifies `postgres_version = "18"` explicitly. Never rely on Neon's default version.

**Verification gate (Deliverable 1a.2):** After `terraform apply`, verify all 5 required extensions (pgvector, pg_search, pg_trgm, unaccent, pg_stat_statements) install correctly on Neon PG18. If any extension fails, fallback: recreate on PG17 with no code changes required (only Terraform `postgres_version` parameter changes).

#### Tier Selection: Scale

| Capability | Free | Launch | **Scale** (chosen) |
|-----------|------|--------|-------------------|
| PITR window | 6 hours | 7 days | **30 days** |
| Protected branches | — | 2 | **5** |
| Monitoring retention | 1 day | 3 days | **14 days** |
| OpenTelemetry export | — | — | **Included** |
| Max compute (autoscaling) | 2 CU | 16 CU | **16 CU** |
| Max compute (fixed) | 2 CU | 16 CU | **56 CU** |
| Branches included | 10 | 10 | **25** |
| Snapshots | 1 | 10 | **10** |
| IP Allow | — | — | **Included** |
| SOC 2 / ISO 27001 | — | — | **Included** |
| SLA | — | — | **Included** |

**Why Scale over Launch:** The 30-day PITR window, OpenTelemetry export, 14-day monitoring retention, and compliance certifications are worth the incremental cost for a production portal serving sacred content. The SLA provides operational confidence. Cost: ~$20/month baseline (autoscaling from 0.25 CU, pay only for active compute hours).

#### Compute Configuration by Environment

| Environment | Min CU | Max CU | Autosuspend | Protected | Notes |
|-------------|--------|--------|-------------|-----------|-------|
| **Production** | 0.5 | 4 | 300s (5 min) | Yes | Never scales to zero instantly; avoids cold-start on first seeker query |
| **Staging** | 0.25 | 2 | 60s | No | Lower baseline; faster suspend for cost efficiency |
| **Dev** | 0.25 | 2 | 0s (immediate) | No | Scales to zero when idle; developer pays nothing overnight |
| **CI test branches** | 0.25 | 1 | 0s | No | Ephemeral; auto-deleted via TTL |
| **PR preview branches** | 0.25 | 1 | 60s | No | Persists for PR lifetime; TTL: 7 days |

*Parameter — default values above, evaluate: Milestone 1c traffic patterns (ADR-123).*

#### Branch Lifecycle Policy

| Branch Type | Naming | TTL | Created By | Deleted By |
|-------------|--------|-----|------------|------------|
| **Production** | `production` | Permanent | Terraform | Never (protected) |
| **Staging** | `staging` | Permanent | Terraform | Never |
| **Dev** | `dev` | Permanent | Terraform | Manual |
| **CI test** | `ci-{run_id}` | 1 hour | GitHub Actions | Auto (TTL) or CI cleanup step |
| **PR preview** | `pr-{number}` | 7 days | GitHub Actions | Auto (TTL) or on PR close |
| **Migration test** | `migrate-{date}` | 2 hours | Manual / CI | Auto (TTL) |
| **Restore test** | `restore-{date}` | 24 hours | Manual | Auto (TTL) |

All ephemeral branches use TTL to guarantee cleanup. The 25-branch included allocation (Scale tier) comfortably handles typical concurrent PR + CI usage. Additional branches at $1.50/month each if needed.

#### Extension Governance

Extensions enabled in the first migration (`001_initial_schema.sql`):

| Extension | Purpose | Arc | Governing ADR |
|-----------|---------|-----|---------------|
| `vector` (pgvector) | Dense vector search (HNSW) | 1+ | ADR-009 |
| `pg_search` (ParadeDB) | BM25 full-text search | 1+ | ADR-114 |
| `pg_trgm` | Trigram fuzzy matching for suggestions | 1+ | ADR-049 |
| `unaccent` | Diacritics-insensitive search | 1+ | ADR-080 |
| `pg_stat_statements` | Query performance monitoring | 1+ | This ADR |

**Future extensions** (evaluate at arc boundaries):

| Extension | Purpose | Evaluate At | Notes |
|-----------|---------|-------------|-------|
| `pg_tiktoken` | Token counting for chunk pipeline | Milestone 1c | Deferred — uses OpenAI tokenizer (cl100k_base), not Voyage/Claude tokenizers. Evaluate when Anthropic/Bedrock provides accurate token counting. |
| `pg_cron` | In-database scheduled jobs | Milestone 2a | Only useful with always-on compute; may replace some Lambda cron jobs |
| `pgrag` | RAG utilities | Milestone 1c | Evaluate whether it simplifies the retrieval pipeline |

**Extension addition policy:** New extensions require an ADR amendment or new ADR referencing this governance section. Extensions must be tested on a migration branch before production.

#### Database Observability

**Built-in monitoring (Scale tier, 14-day retention):**
- RAM, CPU, connection count, deadlocks, rows (insert/update/delete), replication delay, local file cache hit rate, working set size

**pg_stat_statements (installed from Milestone 1a):**
- Top queries by frequency and average duration
- Query plan changes after index modifications
- Performance regression detection after migrations
- **Caveat:** Stats reset on compute suspend/restart. For production (300s autosuspend), this is acceptable — most sessions are long enough to accumulate meaningful data.

**OpenTelemetry export (Scale tier, Milestone 2a+):**
- Export database metrics and Postgres logs to the observability stack (Sentry, New Relic, or Grafana)
- Complements application-level observability (ADR-095) with database-level visibility
- Enables alerts on: connection pool saturation, cache miss rate spikes, replication lag, query duration regressions

### Multi-Region Readiness

Neon is the portal's database provider for the long term. The project plans to grow with Neon as its multi-region capabilities mature.

**Current state (2026-02):** Neon read replicas are same-region only. The portal uses a single-region origin in `us-west-2` with global edge distribution via Vercel CDN. Pure hybrid search (ADR-119) achieves search p95 < 500ms from any continent without multi-region database infrastructure (see ADR-021 § Regional Latency Targets).

**When Neon ships cross-region read replicas:**
- Activate replicas in `ap-south-1` (Mumbai) and `eu-central-1` (Frankfurt) via Terraform
- Route search API read queries to the nearest replica; writes to the primary
- Expected improvement: South Asia search latency drops from ~300ms to ~150ms
- This is a Terraform configuration change — no application code changes

**Why Neon, long-term:** Neon's Scale tier, PostgreSQL 18, branching workflow, pgvector + pg_search extension ecosystem, scale-to-zero economics, and developer velocity are the right fit for this project. The single-database architecture (ADR-013) depends on PostgreSQL's extension ecosystem — pgvector, pg_search/ParadeDB, pg_trgm, unaccent, pg_stat_statements — which Neon supports fully. No alternative database (Turso, Aurora DSQL, PlanetScale) provides equivalent single-database hybrid search capability. See ADR-021 § Alternatives Evaluated for the Turso evaluation.

### Rationale

- **Production readiness from day one.** Scale tier's 30-day PITR, protected branches, and SLA provide the safety net appropriate for a portal serving sacred content.
- **Cost-proportionate.** ~$20/month baseline for Scale tier is negligible for a philanthropist-funded project. Compute autoscaling means costs track actual usage.
- **Observability completeness.** Application monitoring (ADR-095) without database monitoring is like monitoring a car's dashboard but not the engine. `pg_stat_statements` + OTLP export close this gap.
- **Branch discipline.** TTL auto-expiry eliminates orphaned branches — a common operational headache. Named conventions make branches discoverable in the Neon Console.
- **Extension discipline.** Centralizing extension governance prevents sprawl and ensures every extension has a documented purpose and governing ADR.

*Revised: 2026-02-28, added Multi-Region Readiness section. Neon is the long-term database provider; activate cross-region read replicas when available.*

#### API Key Scoping Policy

Neon offers three API key types (Personal, Organization, Project-scoped). The portal uses scoped keys to enforce least privilege across management contexts.

| Context | Key Type | GitHub Secret Name | Scope | Rationale |
|---------|----------|-------------------|-------|-----------|
| **Terraform** (`terraform.yml`) | Organization API key | `NEON_API_KEY` | All org projects | Terraform creates/deletes projects — requires org-level access |
| **CI branch ops** (`neon-branch.yml`, `neon-cleanup.yml`) | Project-scoped key | `NEON_PROJECT_API_KEY` | Single project | Can create/delete branches; cannot delete the project |
| **Claude Code / MCP** (development) | Project-scoped key | local `.env` | Single project | Interactive operations; least privilege for exploratory work |

**Key lifecycle:** Organization key created once during bootstrap (manual, store in password manager + GitHub secret). Project-scoped keys created after `terraform apply` provisions the Neon project — either via Neon Console or `neonctl api-keys create --project-id`. Secret token displayed only once; store immediately. Revocation is immediate and permanent.

**Limitation:** Neon does not offer granular RBAC within a key scope. A project-scoped key can perform all operations on that project except deletion. No finer-grained permissions are available (e.g., "branches only" or "read-only"). This is acceptable for the portal's single-project architecture.

#### Terraform Provider Governance

The Terraform provider for Neon (`kislerdm/neon`) is **community-maintained** — not officially supported by Neon. This has operational implications:

- **Pin the provider version** in `versions.tf` with a pessimistic constraint (e.g., `~> 0.6.0`). Never use unconstrained versions.
- **Review `terraform plan` on provider upgrades.** Provider schema changes can cause unintended resource replacements (destroy + recreate). Never auto-upgrade the Neon provider in CI.
- **`dependabot.yml` covers provider updates.** Dependabot creates PRs for provider version bumps. These PRs trigger `terraform.yml`, producing a plan diff. Always review before merge.
- **Monitor for breaking changes.** Track the provider's GitHub releases for deprecation notices.
- **Fallback:** If the community provider becomes unmaintained, the Neon REST API can be called directly from CI scripts (`neonctl` or `curl`). Terraform manages persistent state (project, protected branches); ephemeral operations already use the API layer (see DES-039 § Three-Layer Neon Management Model).

### Consequences

- Neon project created as PostgreSQL 18, Scale tier from Milestone 1a (`postgres_version = "18"` in Terraform)
- All table primary keys use `uuidv7()` — schema convention for time-ordered UUIDs
- Production branch protected; compute configuration applied per environment
- 5 extensions verified on PG18 in first migration (vector, pg_search, pg_trgm, unaccent, pg_stat_statements)
- Branch naming convention and TTL policy enforced in CI scripts
- `pg_stat_statements` data informs search query optimization from Milestone 1a
- OpenTelemetry export configured during Milestone 2a observability setup
- Snapshot schedule configured during Milestone 1a.2 via Neon API (ADR-019)
- API keys scoped per context: org key for Terraform, project-scoped keys for CI and development
- Terraform provider version pinned; upgrades reviewed via `terraform plan` in PR
- **Extends ADR-009** (pgvector), **ADR-019** (backup), **ADR-094** (testing), **ADR-095** (observability)
- DESIGN-arc1.md § DES-004 schema updated to include all 5 extensions and `uuidv7()` convention
- DESIGN-arc1.md § DES-039 updated with Three-Layer Neon Management Model (Infrastructure / Operations / Data)
- ROADMAP.md cost model updated to reflect Scale tier pricing

*Revised: 2026-02-25, added PostgreSQL 18 version selection, UUIDv7 schema convention, and PG18 feature survey. 2026-02-26, added API key scoping policy, Terraform provider governance, and three-layer management model reference.*

