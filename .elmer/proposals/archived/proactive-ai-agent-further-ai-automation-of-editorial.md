<!-- elmer:archive
  id: proactive-ai-agent-further-ai-automation-of-editorial
  topic: Proactive AI agent. Further AI automation of editorial duties. AI suggests/generates autonomously, humans approve or decline manually. Additional communication channels: email, MS Teams integration. People can click link to review, and/or button to approve/decline possibly. Approved items flow into the portal.
  archetype: explore-act
  model: opus
  status: approved
  archived: 2026-02-24 03:00 UTC
-->

# Proactive AI Agent for Editorial Automation

## Summary

Transform the current reactive editorial workflow into a proactive AI-driven system where Claude autonomously generates suggestions for theme tags, daily passages, editorial threads, and calendar content, delivering proposals through multiple communication channels (email, MS Teams, Slack) with one-click approval mechanisms. This shifts editorial work from "reviewing AI proposals in a queue" to "receiving curated recommendations with context," reducing cognitive load while maintaining the sacred human review gate.

## Analysis

The current editorial architecture (ADR-082) establishes a five-layer staff experience with review queues in `/admin`, email digests, and role-based workflows. While comprehensive, it requires editors to actively visit the portal and work through queues — a pull-based model that creates cognitive overhead and requires dedicated review sessions.

**Current State:**
- **Review queues** live in `/admin` portal, requiring login and active navigation
- **Email digests** notify about queue counts but don't contain actionable content
- **Human review gate** is mandatory (ADR-032, ADR-005, ADR-078) — AI proposes, humans approve
- **Webhook system** (ADR-106) exists for outbound content events but not for editorial workflows
- **Notification strategy** is limited to daily email digest with queue counts

**Key Pain Points:**
1. **Context switching** — Editors must leave their primary workflow (email, Teams) to review in the portal
2. **Queue fatigue** — "23 items awaiting review" creates pressure rather than invitation
3. **Batch processing** — Current design assumes 2-3 hour review sessions rather than micro-approvals
4. **Lost momentum** — By the time an editor reaches item 15 in a queue, context and care may diminish

**Opportunity Space:**
- Leverage existing webhook infrastructure (DES-052) for inbound editorial events
- Extend notification channels beyond email to MS Teams and Slack where staff already work
- Transform from "review queue" to "editorial suggestions delivered to you"
- Enable one-click approvals directly from communication tools
- Maintain theological safety through mandatory human gates

## Proposed Changes

### 1. Proactive AI Editorial Agent Service
**What:** New Lambda-based service that runs Claude Haiku/Sonnet to generate editorial suggestions autonomously
**Where:** `/lambda/editorial-agent/` with dedicated service in `/lib/services/editorial-agent.ts`
**Why:** Shifts from reactive queue processing to proactive content generation
**How:**
- Scheduled Lambda (daily/weekly) analyzes untagged passages, calendar gaps, and content patterns
- Generates contextual suggestions with rationale
- Queues proposals in new `editorial_proposals` table
- Triggers multi-channel distribution

### 2. Editorial Proposal Data Model
**What:** New database schema for AI-generated proposals with approval workflow
**Where:** Migration adding `editorial_proposals` and `proposal_decisions` tables
**Why:** Tracks proposals separately from content, enabling one-click approval and audit trail
**How:**
```sql
CREATE TABLE editorial_proposals (
  id UUID PRIMARY KEY,
  proposal_type TEXT, -- 'theme_tag', 'daily_passage', 'thread_sequence', 'calendar_event'
  content_id UUID, -- References chunk, thread, event
  ai_suggestion JSONB, -- Structured proposal with rationale
  confidence_score DECIMAL,
  generated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- Auto-reject if not reviewed
  status TEXT -- 'pending', 'approved', 'rejected', 'expired'
);

CREATE TABLE proposal_decisions (
  id UUID PRIMARY KEY,
  proposal_id UUID REFERENCES editorial_proposals,
  decision TEXT, -- 'approve', 'reject', 'modify'
  decided_by TEXT, -- Editor identifier
  decided_at TIMESTAMPTZ,
  decision_channel TEXT, -- 'portal', 'email', 'teams', 'slack'
  modifications JSONB -- If modified before approval
);
```

### 3. Multi-Channel Delivery System
**What:** Extend notification system to deliver rich, actionable proposals via email, MS Teams, and Slack
**Where:** New `/lib/services/editorial-delivery.ts` with channel-specific formatters
**Why:** Meet editors where they work rather than requiring portal visits
**How:**
- **Email:** Rich HTML emails with passage preview, AI rationale, and magic-link approval buttons
- **MS Teams:** Adaptive Cards with embedded content and approval actions via Teams webhooks
- **Slack:** Block Kit messages with interactive buttons via Slack Web API
- Each channel includes secure tokens for one-click approval without portal login

### 4. One-Click Approval API
**What:** New API endpoints for approving/rejecting proposals via secure tokens
**Where:** `/app/api/v1/editorial/approve/[token]` and `/approve/[token]` (GET for email links)
**Why:** Removes friction from the approval process while maintaining security
**How:**
- Generate short-lived signed JWT tokens embedded in approval links
- Token contains proposal ID, editor role, and expiration
- GET endpoint for email compatibility, POST for API clients
- Successful approval triggers content update and logs decision

### 5. Intelligent Proposal Timing
**What:** Context-aware scheduling that delivers proposals at optimal times
**Where:** `/lib/services/proposal-scheduler.ts`
**Why:** Respect monastic schedules and editorial rhythms
**How:**
- Morning proposals (6 AM): Theme tags and daily passage selections
- Afternoon proposals (2 PM): Editorial threads and cross-references
- Weekly proposals (Monday AM): Calendar events for upcoming week
- Urgent proposals: Citation errors and QA flags delivered immediately
- Timezone-aware delivery based on editor location

### 6. MS Teams Integration Architecture
**What:** Native Teams app using Incoming Webhooks and Adaptive Cards
**Where:** `/lib/integrations/teams/` with webhook configuration in environment
**Why:** SRF uses Microsoft 365; Teams is their primary collaboration platform
**How:**
- Configure Incoming Webhook connector for SRF editorial channel
- Format proposals as Adaptive Cards with embedded passage text
- Include action buttons that POST back to portal API
- Track approvals via Teams user identity mapped to Auth0

### 7. Proposal Quality Feedback Loop
**What:** Track approval rates and editor modifications to improve AI suggestions
**Where:** `/lib/services/proposal-analytics.ts`
**Why:** Continuously improve suggestion quality based on editorial decisions
**How:**
- Log approval/rejection rates by proposal type and editor
- Capture modifications made before approval
- Feed patterns back into prompt engineering
- Monthly report on AI suggestion quality trends

### 8. Editorial Preference Profiles
**What:** Per-editor preferences for delivery channels, timing, and batch sizes
**Where:** Extended `staff_profiles` table with preference columns
**Why:** Respect individual working styles and schedules
**How:**
```sql
ALTER TABLE staff_profiles ADD COLUMN
  delivery_channels TEXT[], -- ['email', 'teams']
  delivery_schedule JSONB, -- {"theme_tags": "daily_9am", "passages": "weekly_monday"}
  batch_size INTEGER, -- Max proposals per delivery
  auto_expire_hours INTEGER -- Auto-reject timeout
```

### 9. Failsafe Boundaries
**What:** Hard limits ensuring AI never bypasses human review
**Where:** `/lib/services/editorial-agent.ts` validation layer
**Why:** Maintain theological integrity and sacred text fidelity
**How:**
- All proposals require explicit human approval — no auto-approval ever
- Proposals expire and auto-reject after 72 hours
- AI confidence thresholds: only propose if confidence > 0.7
- Daily proposal limits to prevent overwhelming editors
- Circuit breaker: pause AI agent if rejection rate > 50% for 3 days

### 10. Gradual Rollout Strategy
**What:** Phased introduction starting with low-risk proposals
**Where:** Feature flags in `/lib/config.ts`
**Why:** Build trust and refine system before full automation
**How:**
- Phase 1: Theme tag suggestions for high-confidence matches only
- Phase 2: Daily passage proposals from pre-approved pool
- Phase 3: Editorial thread sequences for existing threads
- Phase 4: Calendar event associations
- Phase 5: Full autonomous proposal generation

## Open Questions

1. **MS Teams Security Model:** Does SRF's Teams configuration allow incoming webhooks? What authentication is required for app registration?

2. **Editorial Capacity:** How many proposals per day can editors realistically review? Should we start with weekly batches?

3. **Modification Workflow:** When editors want to modify a proposal (not just approve/reject), should they do this in Teams/Slack or redirect to portal?

4. **Prompt Versioning:** How do we track which prompt version generated each proposal for quality analysis?

5. **Cross-Editor Coordination:** If multiple editors receive the same proposal, how do we prevent duplicate approvals?

6. **Mobile Approval Experience:** Should we build a lightweight mobile web view for approvals, or rely on Teams/Slack mobile apps?

7. **Proposal Rationale Depth:** How much context should AI include? Full passage text, surrounding context, thematic analysis?

8. **Emergency Override:** Should senior editors have ability to bulk-approve AI proposals in exceptional circumstances?

## What's Not Being Asked

**The Attention Economy of Sacred Review:** The current design assumes editorial review is a dedicated practice requiring full presence. Moving to micro-approvals in communication tools risks fragmenting the contemplative quality of reviewing sacred texts. Should proposal delivery intentionally batch into morning and evening "editorial meditation" sessions rather than continuous flow?

**AI Drift and Theological Consistency:** As the AI agent learns from approval patterns, it may unconsciously drift toward editor preferences rather than theological accuracy. Need a periodic "theological calibration" where proposals are reviewed against original principles, not just recent approval patterns.

**The Paradox of Efficiency:** Making editorial review more efficient might reduce the time editors spend with the teachings. Is this efficiency gain actually a spiritual loss? Should the system intentionally introduce "dwell time" — requiring editors to read full passages before approving tags?

**Global Editorial Participation:** Current design assumes SRF/US-based editors. As portal scales globally, should regional editors have different proposal streams? Hindi/Bengali content reviewed by YSS editors in Indian timezones?

**The Hidden Labor of Rejection:** Rejecting an AI proposal currently requires no explanation. Should editors be prompted to briefly indicate why (wrong theme, needs different passage, theological concern) to improve future proposals? Or does this add burden to an already careful process?

**Automation as Distancing:** Each layer of automation creates distance between the human and the sacred text. At what point does the editorial role shift from "steward of teachings" to "manager of AI"? Should we intentionally limit automation to preserve direct engagement?

**Communication Tool Lock-In:** Integrating with MS Teams/Slack creates dependencies on commercial platforms. Should we also build an open protocol (webhook + email) that any tool can consume? RSS-style editorial feeds?

**The Unreviewed Remainder:** Focusing AI on high-confidence proposals means low-confidence content may never get tagged. Should there be a "sweep" process that periodically surfaces neglected content for human review?