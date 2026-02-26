# SRF Online Teachings Portal — Proposals

> **Purpose.** Registry and staging area for feature proposals, theme ideas, and architectural suggestions. Each curated proposal gets a permanent PRO-NNN identifier. Proposals graduate to ADR/DES sections or milestone deliverables through the graduation protocol. PRO-NNN identifiers persist as historical markers even after adoption — they are never renamed or reassigned.

> **Loading guidance.** Load this file when evaluating proposals, at arc boundaries, or when a PRO-NNN is cross-referenced. Not needed during implementation unless a specific PRO is referenced.

> **Relationship to explorations.** Raw exploration files in `.elmer/proposals/` are unvetted AI ideation — they are not project documents. The `/dedup-proposals` skill consolidates explorations into curated PRO-NNN entries in this file. See § Intake Protocol.

## Index

| PRO | Title | Type | Status | Governing Refs | Origin |
|-----|-------|------|--------|----------------|--------|
| PRO-001 | SRF Corpus MCP — Three-Tier Architecture | Feature | Validated | ADR-101, DES-031, ADR-097 | ADR-101 (descheduled 2026-02-24) |
| PRO-002 | SRF Lessons Integration | Feature | Validated | ADR-085, ADR-121 | Stakeholder vision |
| PRO-003 | Text-to-Speech for Passages | Feature | Proposed | ADR-003, ADR-073, ADR-015 | Accessibility vision |
| PRO-004 | Audio-Visual Ambiance Toggle | Enhancement | Proposed | ADR-065 | Unscheduled feature |
| PRO-005 | Neon Auth as Auth0 Alternative | Enhancement | Proposed | ADR-124 | Neon platform audit 2026-02-25 |
| PRO-006 | pg_cron for In-Database Scheduling | Enhancement | Proposed | ADR-124, ADR-017 | Neon platform audit 2026-02-25 |
| PRO-007 | Logical Replication for Analytics CDC | Feature | Proposed | ADR-124, ADR-095 | Neon platform audit 2026-02-25 |
| PRO-008 | Time Travel Queries for Production Debugging | Enhancement | Proposed | ADR-019, ADR-124 | Neon platform audit 2026-02-25 |
| PRO-009 | Scientific-Spiritual Bridge Themes | Theme | Proposed | ADR-032, ADR-051, DES-048, DES-054 | Dedup 2026-02-25 (3 explorations) |
| PRO-010 | Word-Level Graph Navigation | Feature | Proposed | DES-055, ADR-117, ADR-116 | Dedup 2026-02-25 |
| PRO-011 | Proactive Editorial AI Agent | Enhancement | Proposed | ADR-082, ADR-005, DES-052 | Dedup 2026-02-25 |
| PRO-012 | Copyright and Legal Framework | Policy | Validated | ADR-081, ADR-099, ADR-003 | Dedup 2026-02-25 (2 explorations) |
| PRO-013 | Internal Autonomous Agent Archetypes | Feature | Proposed | ADR-101, ADR-005, ADR-082, DES-031, DES-048 | Exploration 2026-02-25 |

---

## Proposal Bodies

### PRO-001: SRF Corpus MCP — Three-Tier Architecture

**Status:** Validated — Awaiting Scheduling
**Type:** Feature
**Governing Refs:** ADR-101, DES-031, ADR-097, ADR-011
**Dependencies:** Tier 1 requires `/lib/services/` operational. Tier 2 requires Milestone 3b editorial portal. Tier 3 requires corpus complete (Milestone 3d+).
**Scheduling Notes:** Descheduled 2026-02-24 to focus on core delivery. Three tiers: Development (Claude Code corpus search), Internal (editorial AI workflows), External (third-party AI assistants with fidelity metadata). Service layer wrapping — no new business logic. Full architecture preserved in DESIGN-arc1.md § DES-031.
**Re-evaluate At:** Arc 3 boundary
**Decision Required From:** Architecture (self-assessment at arc boundary)

### PRO-002: SRF Lessons Integration

**Status:** Validated — Awaiting Scheduling
**Type:** Feature
**Governing Refs:** ADR-085, ADR-121
**Dependencies:** Auth0 custom claims, `access_level` content model
**Scheduling Notes:** Not scheduled. SRF's decision. Architecture ready (content-level access control, separate reading experience, technique instructions always out of scope). May never happen.
**Re-evaluate At:** Stakeholder request
**Decision Required From:** SRF leadership

### PRO-003: Text-to-Speech for Passages

**Status:** Proposed
**Type:** Feature
**Governing Refs:** ADR-003, ADR-073, ADR-015
**Dependencies:** Passage display infrastructure (Milestone 2a). Screen reader emotional quality standards (ADR-073) inform voice selection criteria. ADR-015 (Verbatim Media Fidelity) constrains implementation options.
**Scheduling Notes:** Listed in ROADMAP.md § Unscheduled Features. Per ADR-015 (Verbatim Media Fidelity), portal-initiated TTS of Yogananda's words must use human-recorded narration (monastic or SRF-approved reader). Synthetic text-to-speech is not permitted for sacred text — synthetic voice imposes machine prosody on a realized master's teachings. User-controlled assistive technology (browser screen readers, OS-level TTS) is always permitted and unaffected by this policy. The primary investment path is human-narrated audio by monastics as first-class content (paragraph-level playback, gender-choice narration per language), reaching an estimated 771 million illiterate adults (UNESCO 2022). Synthetic TTS may serve non-sacred portal content only (navigation, UI feedback). The monastic narration path requires content production investment; evaluate feasibility and SRF willingness at Arc 2 boundary.
**Re-evaluate At:** Arc 2 boundary
**Decision Required From:** Architecture + accessibility review + SRF editorial (narration approval)
**Related Explorations:** `book-read-to-me-mode-toggle-displayed-next-to-book-text.md` (archived)

### PRO-004: Audio-Visual Ambiance Toggle

**Status:** Proposed
**Type:** Enhancement
**Governing Refs:** ADR-065
**Dependencies:** None architectural. Content dependency: curated ambient audio assets.
**Scheduling Notes:** Listed in ROADMAP.md § Unscheduled Features. Optional temple bells or nature sounds during reading. Must respect Calm Technology principles — never autoplay, never default-on, never attention-seeking. Evaluated and deferred as non-essential to the core reading experience. Risk of trivializing the portal's contemplative register if poorly executed.
**Re-evaluate At:** Post-Arc 3 (after core experience is mature)
**Decision Required From:** Editorial + UX review

### PRO-005: Neon Auth as Auth0 Alternative

**Status:** Proposed
**Type:** Enhancement
**Governing Refs:** ADR-124
**Dependencies:** Milestone 7a (accounts). No auth until then.
**Scheduling Notes:** The portal architecture uses Auth0 for optional authentication (Milestone 7a+). Neon Auth (managed Better Auth) is now GA with 60K MAU free (Scale tier), branch-aware auth state, and native Row-Level Security integration. Branch-aware auth means PR preview deployments get isolated auth environments automatically — no Auth0 tenant management needed for previews. Evaluate when Milestone 7a scoping begins.
**Re-evaluate At:** Milestone 7a scoping
**Decision Required From:** Architecture

### PRO-006: pg_cron for In-Database Scheduling

**Status:** Proposed
**Type:** Enhancement
**Governing Refs:** ADR-124, ADR-017
**Dependencies:** Always-on production compute (production autosuspend ≥ 300s per ADR-124). `pg_cron` only fires when compute is active.
**Scheduling Notes:** Several operations could benefit from in-database scheduling: stale suggestion cache cleanup, embedding deprecation (90-day window per ADR-046), `pg_stat_statements` periodic snapshots to a metrics table, daily passage rotation. Currently these require external cron (Lambda via EventBridge or Vercel Cron Jobs). `pg_cron` runs inside Postgres — simpler, no cold starts, no infrastructure. Trade-off: couples scheduling to the database; Lambda/Vercel cron is more portable. Evaluate when production compute is always-on.
**Re-evaluate At:** Milestone 3a (when Lambda infrastructure ships, ADR-017)
**Decision Required From:** Architecture

### PRO-007: Logical Replication for Analytics CDC

**Status:** Proposed
**Type:** Feature
**Governing Refs:** ADR-124, ADR-095, ADR-099
**Dependencies:** Scale tier (already selected). Analytics destination (ClickHouse, Snowflake, or similar).
**Scheduling Notes:** Neon supports outbound logical replication to analytics platforms (ClickHouse via PeerDB, Kafka, Snowflake, Fivetran, etc.). If SRF wants analytics beyond DELTA-compliant Amplitude events — e.g., content engagement patterns, search quality trends over time, corpus health metrics — logical replication provides real-time CDC without application-layer ETL. Must remain DELTA-compliant: replicate content and aggregate metrics only, never user-identifying data.
**Re-evaluate At:** Arc 3 boundary (when editorial operations generate analytics needs)
**Decision Required From:** Architecture + DELTA compliance review

### PRO-008: Time Travel Queries for Production Debugging

**Status:** Proposed
**Type:** Enhancement
**Governing Refs:** ADR-019, ADR-124
**Dependencies:** Scale tier (30-day PITR window). Already available.
**Scheduling Notes:** Neon Time Travel Queries allow read-only SQL against any historical database state within the PITR window. Uses ephemeral 0.5 CU computes that auto-delete after 30s idle. Use cases: "what did this chunk's embedding look like before re-ingestion?", "when did this theme tag change?", "what was the search_queries table 2 hours ago?". No restore needed — just reads. Already available on Scale tier; needs documentation in the operational playbook and awareness among developers. Consider adding to Milestone 1a operational setup as a development workflow tool.
**Re-evaluate At:** Milestone 1a implementation (available now)
**Decision Required From:** Architecture (self-assessment)

### PRO-009: Scientific-Spiritual Bridge Themes

**Status:** Proposed
**Type:** Theme
**Governing Refs:** ADR-032, ADR-051, ADR-033, DES-048, DES-054, ADR-115
**Dependencies:** Teaching topics taxonomy (ADR-032) and terminology bridge (ADR-051) operational. Enrichment pipeline (ADR-115) running.
**Scheduling Notes:** Consolidates three explorations proposing thematic entry points for currently under-served seeker populations. Three themes: (1) **Cosmic Life** — Yogananda's teachings on extraterrestrial life, astral worlds, and cosmic consciousness. Maps "extraterrestrial" → "astral beings," "alien life" → "cosmic consciousness." (2) **Self-Worth, Abundance, and Prosperity Consciousness** — teachings on divine supply, worthiness, and overcoming scarcity mentality. Serves seekers arriving from self-help, entrepreneurial, or therapeutic contexts. (3) **Vibration, AUM, and Scientific Parallels** — bridges quantum physics vocabulary to Yogananda's vibration teachings. Maps "quantum field" → "cosmic vibration," "wave-particle duality" → "maya." All three require terminology bridge entries, enrichment pipeline markers, and knowledge graph edges. Each independently reaches new seeker populations. Graduation path: `/theme-integrate` for each theme.
**Re-evaluate At:** Arc 2 boundary (when taxonomy and enrichment pipeline are validated)
**Decision Required From:** Editorial + theological review (do these themes accurately represent Yogananda's teachings?)
**Source Explorations:** `theme-for-extra-solar-life-in-the-cosmos-what-do-the-gurus-2.md`, `theme-self-worth-abundance-scientific-view.md`, `vibration-aum-holy-ghost-quantum-physics-overlap-for-2.md`

### PRO-010: Word-Level Graph Navigation

**Status:** Proposed
**Type:** Feature
**Governing Refs:** DES-055, ADR-117, ADR-116, ADR-049, ADR-050
**Dependencies:** Knowledge graph infrastructure (ADR-117) and entity registry (ADR-116) operational. Concept/Word Graph (DES-055) is the parent design section.
**Scheduling Notes:** Enhances DES-055 with fine-grained word-level graph enabling linguistic exploration of Yogananda's vocabulary through co-occurrence, synonymy, and contextual relationships. Word nodes with PMI-weighted co-occurrence edges let seekers traverse from "magnetism" to "attunement" to "vibration" through the corpus's actual usage patterns. Complements the entity-focused knowledge graph (DES-054) with a linguistic lens. Builds on existing Postgres-native graph infrastructure (ADR-117) — no additional database technology needed.
**Re-evaluate At:** Milestone 3c (when cross-book intelligence ships)
**Decision Required From:** Architecture
**Source Explorations:** `word-graph-similar-to-knowledge-graph-graph-traversal-of.md`

### PRO-011: Proactive Editorial AI Agent

**Status:** Proposed
**Type:** Enhancement
**Governing Refs:** ADR-082, ADR-005, ADR-106, DES-052
**Dependencies:** Editorial portal (Milestone 3b), outbound webhook infrastructure (DES-052), Lambda infrastructure (ADR-017).
**Scheduling Notes:** Transforms the Milestone 3b editorial workflow from pull-based (editors visit queues) to push-based (AI generates proposals delivered via email/Teams/Slack with one-click approval). Claude autonomously generates theme tag suggestions, daily passage selections, editorial thread drafts, and calendar content recommendations. Each suggestion includes context and rationale. Maintains the sacred human review gate (ADR-005) — AI proposes, humans approve. Reduces editorial cognitive load while preserving fidelity controls. Requires Lambda-based agent service and multi-channel delivery infrastructure.
**Re-evaluate At:** Milestone 3b (when editorial portal ships)
**Decision Required From:** Architecture + editorial workflow review
**Source Explorations:** `proactive-ai-agent-further-ai-automation-of-editorial.md`

### PRO-012: Copyright and Legal Framework

**Status:** Validated — Milestone 1b Prerequisite
**Type:** Policy
**Governing Refs:** ADR-081, ADR-099, ADR-003, ADR-001
**Dependencies:** None architectural. Requires SRF legal counsel review before implementation.
**Scheduling Notes:** Milestone 1b prerequisite — the copyright communication layer must ship before public deployment. The portal's full crawlability posture (ADR-081, CONTEXT.md Resolved Question #15) requires explicit, multi-layered copyright communication so openness is paired with clear terms. Two concerns: (1) **Copyright communication** — establish multi-layered messaging (legal pages, JSON endpoints, HTTP headers, `llms.txt` copyright section, `ai.txt` permissions file) that signals SRF retains all rights while welcoming citation and reference. Treat "freely available" as a theological stance, not legal status. The library model: freely accessible for reading, reference, and citation while remaining under copyright. (2) **Legal liability audit** — 12 categories of risk identified: copyright authorization, content licensing, accessibility compliance, crisis resource liability, AI system transparency, volunteer agreements, international data handling, terms of service, and more. Pre-implementation legal review recommended for categories 1–4 (copyright, licensing, accessibility, crisis). Remaining categories can be addressed incrementally. Principle-check: the portal's generous accessibility posture aligns with SRF's mission of making teachings available worldwide — copyright retention and open access are not contradictory. Validated 2026-02-25: architectural review confirms alignment with ADR-081 full crawlability, Global Equity (Principle 4), and accessibility (Principle 6). The No Content Gating policy (ADR-081 §3a) establishes that content gating is architecturally prohibited, making the copyright communication layer the correct mechanism for rights assertion — not technology walls.
**Re-evaluate At:** Milestone 1b (before public deployment)
**Decision Required From:** SRF legal counsel + architecture
**Source Explorations:** `clarify-copyright-stance-srf-makes-it-feel-available-to-all.md`, `what-are-the-legal-liabilities-if-any.md`

*Validated: 2026-02-25, architectural review and principle-check passed. Full crawlability confirmed as mission-aligned.*

### PRO-013: Internal Autonomous Agent Archetypes

**Status:** Proposed
**Type:** Feature
**Governing Refs:** ADR-101, ADR-005, ADR-082, ADR-100, DES-031, DES-035, DES-048
**Dependencies:** Tier 2 MCP server (PRO-001) operational. `/lib/services/` layer complete for target content types. Editorial review infrastructure (Milestone 3b) for agent-proposed content.
**Scheduling Notes:** The MCP Corpus server (PRO-001, ADR-101, DES-031) is designed as portal infrastructure, but SRF's internal stakeholders extend beyond the portal team. The same corpus access layer can serve autonomous AI agents working on behalf of monastics, correspondence staff, magazine editors, center leaders, and operational systems. Nine agent archetypes identified alongside the public-facing thematic exploration (now DES-048 § Thematic Corpus Exploration):

**Agent archetypes by trust profile:**

| # | Agent | Stakeholder | Trust Profile | Key MCP Tools |
|---|---|---|---|---|
| 1 | **Devotee Correspondence** | Monastics, correspondence staff | Research (read-only, user-directed) | `search_corpus`, `get_glossary_terms_in_passage`, `verify_citation`, crisis detection |
| 2 | **Magazine Editorial** | Self-Realization Magazine staff | Research + editorial | `search_corpus`, `verify_citation`, `get_content_coverage`, `get_similar_passages`, publication history |
| 3 | **Content Integrity Watchdog** | Operates autonomously, alerts editors | Operational (alert-driven, defensive) | `verify_citation` (bulk), `get_chunk_with_context`, content hash verification |
| 4 | **Translation QA** | Translation reviewers | Operational (supports reviewer) | `get_passage_translations`, `get_glossary_terms_in_passage`, `verify_citation` |
| 5 | **Center Leader Support** | SRF center/group leaders worldwide | Research (read-only, restricted tool set) | `search_corpus`, `search_by_theme`, `get_daily_passage`, calendar-aware surfacing |
| 6 | **Seeker Trend Intelligence** | SRF leadership, communications | Intelligence (aggregated, DELTA-compliant) | `get_search_trends`, `get_content_coverage`, `search_corpus` |
| 7 | **Social Media Calendar** | Social media staff | Editorial (ADR-100 trust graduation) | `search_corpus`, `search_by_theme`, `get_daily_passage`, `get_content_coverage` |
| 8 | **Knowledge Graph Curator** | Operates autonomously, reviewed by theological reviewers | Intelligence (proposes graph edges) | `get_graph_neighborhood`, `find_concept_path`, `get_similar_passages` |
| 9 | **Corpus Onboarding** | New SRF staff, new monastics, VLD volunteers | Research (read-only, guided) | `search_corpus`, `search_by_theme`, `get_person_context`, `find_concept_path` |

**Governing principle:** Every agent is a librarian — finds, verifies, contextualizes, and surfaces the Master's words. No agent generates, interprets, or teaches (ADR-001, ADR-005). AI proposes, humans approve for all editorial agents (ADR-100). Research agents require no review queue — the user exercises full judgment.

**One Librarian, many modes.** The 9 archetypes above are not 9 separate systems — they are *modes* of a single Corpus Librarian (ADR-089) with role-scoped access. The underlying capability is identical: search the corpus, verify citations, surface cross-references, respect the technique boundary. What varies is the access role (which MCP tools are available), the delivery channel (admin portal, email, Slack, API), and the interaction pattern (user-directed research, push-based proposals, autonomous monitoring). Architecturally, this is one service layer with role-based API scoping — not nine deployments.

**Architectural implication:** Tier 2 MCP (DES-031) needs role-scoped access rather than monolithic internal access. Four trust profiles: Research (full corpus read, no write), Editorial (corpus + analytics, proposes to review queues), Operational (corpus + integrity, alert/quarantine capability), Intelligence (corpus + aggregated analytics, proposes structural changes). Not a new tier — internal role differentiation within Tier 2.

**New capabilities implied:**
- `detect_crisis_indicators(text)` as reusable internal MCP tool (currently search-path only, ADR-122)
- `publication_history` resource tracking which passages have been used in which channels (prevents repetition across email, social, magazine)
- `center_leader` Auth0 role (extending VLD role system, ADR-087) for authenticated institutional access by center/group leaders worldwide. Not "internal" in the headquarters sense — distributed institutional access with restricted tool set (no editorial tools, no analytics).

**Technique boundary (Principle 3, ADR-104).** Every agent respects the technique boundary. The Correspondence Agent never suggests passages that teach Kriya Yoga, Hong-Sau, AUM meditation, or Energization Exercises — only passages that *describe* the practice path publicly. The same intent classification (ADR-005 E1) that governs search governs all agent outputs. When a correspondent's letter asks about technique, the agent surfaces the Practice Bridge response (ADR-104), not a collection of passages.

**Watchdog quarantine model.** Content hash mismatches (ADR-039) are Principle 1 violations — the portal may be serving words that aren't Yogananda's. The Watchdog's response model:

| Severity | Trigger | Watchdog Action | Human Action |
|---|---|---|---|
| **Critical** | Content hash mismatch, text altered | Soft quarantine: set `quarantine_flag = true` on affected chunks (search query filters on this flag, suppressing from results). Alert via Sentry + editorial notification. Passage remains accessible via direct URL but invisible in search and exploration. | Restore original text and clear flag, or confirm the edit was intentional and recompute hash. |
| **High** | Stylometric anomaly, embedding drift > threshold | Alert only. Flag for review queue. | Investigate — may indicate ingestion error or model degradation. |
| **Medium** | Missing citation, incomplete metadata | Alert only. Add to QA queue. | Fix citation in Contentful, re-sync. |
| **Low** | Classification staleness, coverage gap | Observation (DES-035 passive intelligence). | Acknowledge or dismiss. |

Soft quarantine is a safety mechanism, not editorial judgment — the Watchdog never decides whether content is *good*, only whether it matches its verified source. The `quarantine_flag` column on `book_chunks` is a boolean default `false`, indexed, checked in every search and exploration query's WHERE clause. Quarantine events are logged to `content_quarantine_log` (chunk_id, reason, quarantined_at, resolved_at, resolved_by).

**Agent composition.** Agents communicate through the existing webhook event system (DES-052, ADR-106). Agent events extend the portal event taxonomy:

| Event | Agent | Consumers |
|---|---|---|
| `agent.integrity_alert` | Watchdog | All agents (pause proposals for affected passages), editorial staff |
| `agent.trend_shift` | Trend Intelligence | Social Calendar (timely passage selection), editorial staff |
| `agent.passage_used` | Social Calendar, Magazine, Daily Email | Publication History resource (deduplication) |
| `agent.graph_proposal` | Graph Curator | Watchdog (verify proposed edges don't reference quarantined content) |

The Watchdog is a cross-cutting monitor: when it fires `agent.integrity_alert`, all other agents must check whether their pending proposals reference affected passages. This is defensive — prevents a corrupted passage from propagating through editorial channels before human review.

**Relationship to PRO-011:** PRO-011 (Proactive Editorial AI Agent) describes one pattern — push-based editorial proposals. PRO-013 subsumes PRO-011 as the "Editorial" trust profile and adds Research, Operational, and Intelligence profiles.

**Agent persona:** Compassion and humility combined with effectiveness. The portal's contemplative register (ADR-074) extends to internal agent interactions — warm, honest, not mechanical. Not gamified enthusiasm. "Here are today's suggestions for your review." The Librarian brand (ADR-089) applies to all AI in SRF's ecosystem. For monastic users — the Librarian's primary internal audience — the agent should never feel like a productivity tool. It should feel like a quiet assistant in a temple library. Effectiveness should not outpace contemplation: fewer deeply relevant passages with invitation to go deeper, rather than comprehensive dumps. The default `limit` for internal research mode should be low (5), expandable on request — matching the Calm Technology principle (ADR-065) that technology requires the smallest possible amount of attention.

**Cross-property potential.** The MCP Corpus server (DES-031) is designed for the teachings portal, but SRF's other digital properties — yogananda.org, the Online Meditation Center, the SRF app, the convocation site — also reference Yogananda's teachings. If the Tier 2 MCP server ships as a standalone service (wrapping `/lib/services/`), it could power corpus-grounded features across all SRF web properties: accurate quote-finding for yogananda.org articles, passage suggestions for Online Meditation Center guided readings, and verified citations for any SRF publication. The service layer's framework-agnostic design (Principle 10) supports this — no Next.js dependency in the business logic.

**Re-evaluate At:** Arc 3 boundary (when Tier 2 MCP scheduling is re-evaluated per PRO-001)
**Decision Required From:** Architecture + SRF stakeholder input on organizational needs

---

## Graduation Protocol

Proposals move through tiers based on evaluation and stakeholder decisions. The AI may recommend graduation or omission; the human principal decides.

### Status Lifecycle

```
Exploration (.elmer/proposals/)
  → /dedup-proposals → PRO-NNN (this file, Status: Proposed)
    → principle-check + architectural review → Status: Validated
      → stakeholder scheduling decision → Status: Adopted → [ADR/DES/Milestone refs]
    → omission decision → Status: Omitted — [reason]

ADR-NNN (DECISIONS-*.md, Status: Provisional or Active)
  → suspension decision → PRO-NNN (this file, Status: Suspended from ADR-NNN)
    → ADR body preserved in DECISIONS-*.md with Status: Suspended → PRO-NNN
    → re-evaluation at arc boundary may restore to Active
```

### Tier Definitions

- **Proposed:** Curated from explorations by `/dedup-proposals`. Thorough thinking captured but not yet checked against principles and architecture. May be adopted, refined, or omitted.
- **Validated:** Principle-checked and architecturally reviewed. Has governing ADR/DES references. Awaiting a scheduling decision.
- **Adopted:** Graduated to ADR/DES sections or milestone deliverables. PRO entry preserved with cross-references to adopted identifiers.
- **Suspended:** Was an active or provisional ADR/DES, moved to unscheduled. Architectural reasoning preserved in the original ADR/DES body; scheduling lifecycle managed here.
- **Omitted:** Evaluated and explicitly excluded. Rationale preserved for institutional memory. Cross-reference DES-056 § Explicitly Omitted if applicable.

### Arc Boundary Review

At every arc boundary:

1. **Deferred/Suspended items first.** They were already scoped — re-evaluate before new proposals.
2. **Validated items.** Consider for the upcoming arc. Stakeholder decision required.
3. **Proposed items.** Principle-check any relevant to the next arc's narrative theme.
4. **Proposed → Validated:** Requires principle-check (does it violate any of the 11 principles?) and architectural review (does it fit the existing design, or does it need new ADRs?).
5. **Validated → Adopted:** Stakeholder decision. Add deliverables to the target arc's section in ROADMAP.md. Create ADR/DES sections as needed.
6. **Any tier → Omitted:** Record rationale in the PRO entry. Add to DES-056 § Explicitly Omitted if the feature was publicly visible.

### Proposal Types

Different types graduate through different paths:

| Type | Graduates To | Skill |
|------|-------------|-------|
| Feature | ADR + DES section + milestone deliverables | `/proposal-merge` |
| Theme | Taxonomy entries, terminology bridge, enrichment pipeline | `/theme-integrate` |
| Policy | ADR amendment or new ADR | `/proposal-merge` |
| Enhancement | Milestone deliverable (may not need new ADR) | `/proposal-merge` |

---

## Intake Protocol

### From Explorations

Raw explorations in `.elmer/proposals/` are unvetted AI ideation. They enter this registry through `/dedup-proposals`:

1. `/dedup-proposals` scans `.elmer/proposals/`, clusters by topic similarity
2. Each consolidated cluster becomes a PRO-NNN entry with `Status: Proposed`
3. Original exploration files are preserved in `.elmer/proposals/` (or archived to `.elmer/proposals/archived/`) as historical artifacts
4. PRO entries carry curated summaries and scheduling metadata, not raw exploration prose

### From ADR/DES Suspension

When an existing ADR or DES section is suspended (moved to unscheduled):

1. Create a PRO-NNN entry with `Status: Suspended from ADR-NNN` (or DES-NNN)
2. Update the ADR/DES status to `Suspended → PRO-NNN`
3. The ADR/DES body stays in its original file — the reasoning is valuable. Only the status changes.
4. The PRO entry handles the scheduling lifecycle: re-evaluation timing, dependencies, stakeholder decisions.

---

## Omitted Proposals

*(Populated as proposals are evaluated and excluded. Each entry preserves the rationale for the omission so the reasoning is available to future sessions without archaeology.)*
