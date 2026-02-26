# SRF Online Teachings Portal — Proposals

> **Purpose.** Registry and staging area for feature proposals, theme ideas, and architectural suggestions. Each curated proposal gets a permanent PRO-NNN identifier. Proposals graduate to ADR/DES sections or milestone deliverables through the graduation protocol. PRO-NNN identifiers persist as historical markers even after adoption — they are never renamed or reassigned.

> **Loading guidance.** Load this file when evaluating proposals, at arc boundaries, or when a PRO-NNN is cross-referenced. Not needed during implementation unless a specific PRO is referenced.

> **Relationship to explorations.** Raw exploration files in `.elmer/proposals/` are unvetted AI ideation — they are not project documents. The `/dedup-proposals` skill consolidates explorations into curated PRO-NNN entries in this file. See § Intake Protocol.

## Index

| PRO | Title | Type | Status | Governing Refs | Origin |
|-----|-------|------|--------|----------------|--------|
| PRO-001 | SRF Corpus MCP — Three-Tier Architecture | Feature | Validated | ADR-101, DES-031, ADR-097, ADR-011 | ADR-101 (descheduled 2026-02-24) |
| PRO-002 | SRF Lessons Integration | Feature | Validated | ADR-085, ADR-121 | Stakeholder vision |
| PRO-003 | Text-to-Speech for Passages | Feature | Proposed | ADR-003, ADR-073, ADR-015 | Accessibility vision |
| PRO-004 | Audio-Visual Ambiance Toggle | Enhancement | Proposed | ADR-065 | Unscheduled feature |
| PRO-005 | Neon Auth as Auth0 Alternative | Enhancement | Proposed | ADR-124 | Neon platform audit 2026-02-25 |
| PRO-006 | pg_cron for In-Database Scheduling | Enhancement | Proposed | ADR-124, ADR-017 | Neon platform audit 2026-02-25 |
| PRO-007 | Logical Replication for Analytics CDC | Feature | Proposed | ADR-124, ADR-095, ADR-099 | Neon platform audit 2026-02-25 |
| PRO-008 | Time Travel Queries for Production Debugging | Enhancement | Proposed | ADR-019, ADR-124 | Neon platform audit 2026-02-25 |
| PRO-009 | Scientific-Spiritual Bridge Themes | Theme | Proposed | ADR-032, ADR-051, ADR-033, DES-048, DES-054, ADR-115 | Dedup 2026-02-25 (3 explorations) |
| PRO-010 | Word-Level Graph Navigation | Feature | Proposed | DES-055, ADR-117, ADR-116, ADR-049, ADR-050 | Dedup 2026-02-25 |
| PRO-011 | Proactive Editorial AI Agent | Enhancement | Proposed (subsumed by PRO-013 if adopted) | ADR-082, ADR-005, ADR-106, DES-052 | Dedup 2026-02-25 |
| PRO-012 | Copyright and Legal Framework | Policy | Validated | ADR-081, ADR-099, ADR-003, ADR-001 | Dedup 2026-02-25 (2 explorations) |
| PRO-013 | Internal Autonomous Agent Archetypes | Feature | Proposed | ADR-101, ADR-005, ADR-082, ADR-100, DES-031, DES-035, DES-048 | Exploration 2026-02-25 |
| PRO-014 | Multi-Author Sacred Text Expansion | Policy | Adopted | ADR-001, ADR-005, ADR-007, ADR-030, ADR-034, ADR-040, ADR-048, ADR-051, ADR-078, ADR-089, ADR-091, ADR-092, ADR-111, PRINCIPLES.md §1–2, CONTEXT.md § Mission | Exploration 2026-02-25 |
| PRO-015 | AWS SES as SendGrid Alternative for Email Delivery | Enhancement | Proposed | ADR-091, ADR-099, ADR-016 | Stack divergence analysis 2026-02-26 |
| PRO-016 | Retool vs. Portal Admin for Staff Dashboards | Enhancement | Proposed | ADR-082, ADR-053, ADR-095 | Deep review 2026-02-26 |
| PRO-017 | Cloudflare Re-evaluation for SRF Domain Routing | Enhancement | Proposed | ADR-023, ADR-016 | Vendor drift analysis 2026-02-26 |

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
**Note:** Subsumed by PRO-013 (Internal Autonomous Agent Archetypes) as the "Editorial" trust profile. If PRO-013 is adopted, this proposal merges into it rather than graduating independently.

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
**Scheduling Notes:** The MCP Corpus server can serve autonomous AI agents working on behalf of SRF's internal stakeholders: monastics, correspondence staff, magazine editors, center leaders, and operational systems. Nine agent archetypes identified: Devotee Correspondence, Magazine Editorial, Content Integrity Watchdog, Translation QA, Center Leader Support, Seeker Trend Intelligence, Social Media Calendar, Knowledge Graph Curator, and Corpus Onboarding.

**Core idea.** One Librarian, many modes. The 9 archetypes are *modes* of a single Corpus Librarian (ADR-089) with role-scoped access — not 9 separate systems. Architecturally: one service layer with role-based API scoping. Four trust profiles: Research (read-only), Editorial (proposes to review queues), Operational (integrity monitoring, alert/quarantine), Intelligence (aggregated analytics, proposes structural changes).

**Governing principle.** Every agent is a librarian — finds, verifies, and surfaces the Master's words. No agent generates, interprets, or teaches (ADR-001, ADR-005). AI proposes, humans approve for all editorial agents (ADR-100). Every agent respects the technique boundary (Principle 3, ADR-104).

**Subsumes PRO-011** (Proactive Editorial AI Agent) as the "Editorial" trust profile.

*Implementation detail (quarantine model, event taxonomy, agent persona, cross-property potential, MCP tool mappings) preserved in `.elmer/proposals/archived/` and would move to DESIGN files on adoption.*

**Re-evaluate At:** Arc 3 boundary (when Tier 2 MCP scheduling is re-evaluated per PRO-001)
**Decision Required From:** Architecture + SRF stakeholder input on organizational needs

### PRO-014: Multi-Author Sacred Text Expansion

**Status:** Adopted — Document cascade merged 2026-02-25.
**Type:** Policy
**Governing Refs:** ADR-001, ADR-005, ADR-007, ADR-030, ADR-034, ADR-040, ADR-048, ADR-051, ADR-078, ADR-089, ADR-091, ADR-092, ADR-111

**Summary.** Expanded corpus scope from "Yogananda's published books" to "all SRF/YSS-published books" with a three-tier content hierarchy by author role: guru (Yogananda, Sri Yukteswar), president (Daya Mata, Mrinalini Mata, Rajarsi Janakananda), monastic (monastic speakers). All tiers receive verbatim fidelity, no AI synthesis, no machine translation. Tiers govern search inclusion, daily passage pool, and social media pool. Both blocking stakeholder decisions resolved 2026-02-25: theological hierarchy confirmed, endowment scope confirmed. *Tier values renamed 2026-02-26 from sacred/authorized/commentary to guru/president/monastic — role-based naming avoids value judgments about authors' spiritual stature.*

**Document cascade applied to:** PRINCIPLES.md §1–2, CLAUDE.md §1–2, CONTEXT.md §§ Mission/In Scope, ADR-001, ADR-005, ADR-007, ADR-030, ADR-039, ADR-048, ADR-051, ADR-078, ADR-089, ADR-091, ADR-092, ADR-111, DESIGN.md search/daily-passage APIs, DESIGN-arc1.md books schema (`content_tier` column, `author` DEFAULT removed).

**Remaining for Milestone 3a:** Non-Yogananda book catalog requires SRF confirmation. Author-specific chunking parameters (ADR-048) need empirical calibration when *The Holy Science* enters the pipeline.

*Adopted: 2026-02-25. Validated: 2026-02-25. Full exploration detail preserved in `.elmer/proposals/archived/`.*

### PRO-015: AWS SES as SendGrid Alternative for Email Delivery

**Status:** Proposed
**Type:** Enhancement
**Governing Refs:** ADR-091, ADR-099, ADR-016
**Dependencies:** Milestone 5a (daily email feature). No email infrastructure needed before then.
**Scheduling Notes:** Evaluate at Milestone 5a scoping. The portal currently specifies SendGrid (aligned with SRF Tech Stack Brief § Specialized Services). This proposal evaluates AWS SES as an alternative that may better serve the portal's specific constraints.

#### Context

ADR-091 specifies the Daily Email feature (Milestone 5a): one verbatim passage from Yogananda's published works, delivered daily to subscribers. The portal's email use case is narrow — a single passage with author/book/chapter citation, one link to the portal reading experience, no marketing automation, no templates, no campaigns. SRF's standard is SendGrid (Tech Stack Brief § Specialized Services: "Transactional email delivery, email templates designed in Stripo").

The question: does the portal's minimal, DELTA-constrained email use case justify staying with SendGrid, or does AWS SES serve it better?

#### For SES (the case for divergence)

1. **Already in the AWS footprint.** The portal uses S3, Bedrock, Lambda, EventBridge — all AWS. SES adds no new vendor, no new account, no new billing relationship. Terraform manages it alongside everything else (ADR-016).
2. **Cost.** SES: $0.10/1,000 emails, no monthly minimum. SendGrid free tier: 100 emails/day; paid starts at $19.95/month for 50K emails. At portal scale (estimated 5K–50K daily subscribers by Arc 5), SES costs $0.50–$5/day. SendGrid costs $19.95+/month.
3. **DELTA simplicity.** SES has no built-in engagement tracking by default — open/click tracking must be explicitly enabled via configuration sets. SendGrid enables open/click tracking by default and requires active configuration to disable it (Tracking Settings API or per-message headers). For a DELTA-compliant system that must never track engagement, the "off by default" posture is safer.
4. **No feature waste.** SendGrid's value is in templates (Stripo), A/B testing, marketing campaigns, contact management, engagement analytics. The portal uses none of these. The daily email is a Lambda function that renders one HTML passage and calls an email API.
5. **Terraform-native.** `aws_ses_domain_identity`, `aws_ses_configuration_set` — first-class Terraform resources. SendGrid's Terraform provider exists but is community-maintained and less mature.
6. **OIDC authentication.** Lambda already authenticates to AWS via OIDC (ADR-016). SES requires no additional API key — the Lambda execution role gets `ses:SendEmail` permission. SendGrid requires a separate API key stored as a secret.

#### Against SES (the case for alignment)

1. **SRF standard.** SendGrid is the established email provider (Tech Stack Brief § Specialized Services). SRF's AE team has SendGrid expertise, existing accounts, established deliverability reputation, and operational procedures. Diverging adds another "why is the portal different?" conversation.
2. **Deliverability bootstrapping.** SES requires warming a new sending domain — starting at low volume and gradually increasing over weeks. SendGrid's shared IP pools and established reputation provide good deliverability immediately. A new SES domain sending 50K emails on day one risks spam classification.
3. **Bounce/complaint handling.** SendGrid has mature bounce management, suppression lists, and automatic unsubscribe handling built in. SES requires building these with SNS topics, Lambda handlers, and a suppression list in the database — more code to write and maintain.
4. **SendGrid's free tier may suffice.** 100 emails/day (free) covers development and early testing. The Essentials plan ($19.95/month for 50K) covers the portal's likely volume through Arc 5. The cost difference is real but small relative to total infrastructure spend.
5. **Operational handoff.** When the portal transitions to SRF operations (Arc 6+), SendGrid means the operations team is on familiar ground. SES means training on a different email system — even if it's simpler.
6. **Avoid Redundancy principle.** Tech Stack Brief § Guiding Principle #7: "Where a standard has already been established in SRF, utilize that rather than introducing something new which overlaps."

#### Through (the synthesis)

The portal's email use case is genuinely different from SRF's typical transactional email: no templates, no marketing, no engagement tracking, one message type. This is the same pattern as DynamoDB → PostgreSQL (ADR-013) and Serverless Framework → Terraform (ADR-017) — the SRF standard serves the general case well, but the portal's specific constraints favor a different choice.

However, the cost savings are modest ($15–20/month), and the deliverability bootstrapping and bounce handling costs (developer time) may exceed the savings. The strongest SES argument is DELTA purity (tracking off by default); the strongest SendGrid argument is operational alignment.

**Recommendation:** Start with SendGrid (aligned, zero bootstrapping, immediate deliverability). If Milestone 5a implementation reveals that DELTA-compliant SendGrid configuration is fragile — if tracking keeps re-enabling after updates, or if the suppression of engagement analytics requires ongoing vigilance — revisit SES as a cleaner foundation. The migration path is straightforward: swap the API call in one Lambda function.

**Re-evaluate At:** Milestone 5a scoping (daily email implementation)
**Decision Required From:** Architecture + SRF AE team input (do they prefer portal on their SendGrid account or a separate email system?)

### PRO-016: Retool vs. Portal Admin for Staff Dashboards

**Status:** Proposed
**Type:** Enhancement
**Governing Refs:** ADR-082, ADR-053, ADR-095
**Dependencies:** Milestone 3b (editorial portal `/admin`), Milestone 3d (analytics dashboard)
**Scheduling Notes:** Evaluate at Milestone 3d scoping. The question is whether the analytics/reporting dashboard (Milestone 3d.4 "What Is Humanity Seeking?" admin view, standing operational metrics from DES-037) should use Retool or be built into the portal's own `/admin` route group.

#### Context

Two staff-facing interfaces appear in the architecture:

1. **Portal `/admin`** (Milestone 3b.5a/b) — Auth0-protected Next.js route group for editorial workflows: theme tag review, daily passage curation, calendar management, queue health, ingestion QA. Built with the portal's calm design system.

2. **Retool** — Referenced in the production architecture diagram (DESIGN.md), Milestone 3d.4, and DES-037 standing operational metrics. Implied use: analytics dashboards, search trend visualization, operational metrics.

The relationship between these is undefined. Do they coexist (editorial in `/admin`, analytics in Retool)? Does one subsume the other?

#### For Retool (separate analytics tool)

1. **Build vs. buy.** Analytics dashboards (charts, time series, geographic heatmaps) are what Retool excels at. Building equivalent visualizations in Next.js is feasible but slower.
2. **Iteration speed.** Staff can modify Retool dashboards without code deploys. Useful for evolving the "What Is Humanity Seeking?" views.
3. **SRF familiarity.** If SRF already uses Retool across other properties, operational handoff is easier.

#### Against Retool (build into portal admin)

1. **One fewer vendor.** Retool is a Tier 2 dependency. The 10-year horizon (ADR-004) favors fewer external dependencies.
2. **Design coherence.** Staff tools built in the portal's own design system maintain the calm technology aesthetic end-to-end.
3. **No additional authentication surface.** Everything in Auth0, one admin route group.
4. **Cost.** Retool has per-user pricing that may not be justified for 3–5 staff users.

#### Recommendation

Defer the decision. Build Milestone 3b editorial portal in `/admin`. At Milestone 3d scoping, evaluate whether the analytics visualization needs justify Retool or whether lightweight charting (e.g., Recharts) within `/admin` suffices. Remove Retool from the production architecture diagram until a decision is made — its presence implies an adopted choice that hasn't occurred.

**Re-evaluate At:** Milestone 3d scoping
**Decision Required From:** Architecture + SRF AE team (is Retool already in their stack?)

### PRO-017: Cloudflare Re-evaluation for SRF Domain Routing

**Status:** Proposed
**Type:** Enhancement
**Governing Refs:** ADR-023, ADR-016
**Dependencies:** Domain assignment for the portal. SRF decision on DNS routing.
**Scheduling Notes:** The portal's production architecture previously included Cloudflare (CDN, WAF, rate limiting) as a portal-managed infrastructure dependency. Analysis (2026-02-26) determined that Vercel Pro provides equivalent capabilities natively — Firewall Rules, DDoS protection, bot detection, CDN — making Cloudflare a redundant layer that adds double-CDN complexity without unique value.

**Current posture:** Cloudflare removed from portal infrastructure. Rate limiting (ADR-023) redesigned to use Vercel Firewall at the edge layer. All documents updated.

**Re-evaluate if:** SRF routes the portal's domain through Cloudflare as part of their organization-wide DNS/CDN strategy (SRF uses Cloudflare across other properties). In that case, the portal is fully compatible — Cloudflare would sit in front of Vercel transparently. The question then becomes whether to leverage Cloudflare's WAF rules *in addition to* Vercel Firewall, or let Vercel handle security alone. If Cloudflare is added, create a Terraform `/modules/cloudflare/` module for DNS records and WAF rules.

**What Vercel covers without Cloudflare:**
- Firewall Rules (IP-based rate limiting, path-based rules)
- DDoS mitigation (automatic, all plans)
- Bot protection (Pro tier)
- Global CDN with edge caching
- Edge Middleware for custom security logic

**What Cloudflare would add (if present):**
- Broader IP reputation database
- More granular WAF rule language (Cloudflare Rules)
- Workers for edge compute (redundant with Vercel Edge Functions)
- Cloudflare Analytics (redundant with Vercel Analytics)

**Re-evaluate At:** When portal domain is assigned, or if SRF indicates Cloudflare is required for organizational DNS routing
**Decision Required From:** Architecture + SRF AE team (does SRF route all properties through Cloudflare?)

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
