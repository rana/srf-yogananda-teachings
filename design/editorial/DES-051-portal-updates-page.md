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
