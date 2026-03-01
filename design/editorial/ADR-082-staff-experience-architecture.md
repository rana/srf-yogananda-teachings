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
| **AE developer** | As needed | High | Staff dashboard (PRO-016) + Neon console | Clear runbooks; Sentry/New Relic dashboards separated from other SRF properties; infrastructure-as-code matching SRF Terraform patterns |
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

---
