<!-- elmer:archive
  id: explore-reduced-number-of-phases-each-phase-has-a-theme-synthesis
  topic: explore reduced number of phases, each phase has a theme
  archetype: explore-act
  model: opus
  status: approved
  ensemble_id: explore-reduced-number-of-phases-each-phase-has-a-theme
  ensemble_role: synthesis
  recovered_from: session logs (PROPOSAL.md never committed to git; worktree destroyed before archive)
  archived: 2026-02-24 17:00 UTC
  note: Reconstructed from 6 session log summaries. Original full text permanently lost due to ADR-033 bug.
-->

# Phase Consolidation: From 15 Phases to 7 Thematic Phases

*Reconstructed synthesis of 5 independent ensemble proposals*

> **Recovery note**: This document is reconstructed from session log summaries after a data-loss incident during `elmer approve`. The original full-text synthesis (written by the synthesis agent) was never committed to git and was destroyed when its worktree was removed. The structure and conclusions below are faithful to the synthesis agent's output; the prose is reconstructed.

---

## Ensemble Overview

Five independent replicas explored the same question — *how to consolidate the current 15-phase roadmap into fewer, thematically coherent phases* — followed by a synthesis pass that reconciled their proposals.

| Replica | Phases | Key Innovation |
|---------|--------|----------------|
| Replica 1 | 7 (Foundation → Community) | Cathedral vs garden sustainability framing |
| Replica 2 | 8 (Foundation → Polish) | "Never Build" list concept; desktop-first bias warning |
| Replica 3 | 7 (Foundation → Evolution) | Heritage languages prioritized to Phase 4; value-based success metrics |
| Replica 4 | 8 (PoC → Community Features) | Hybrid approach: 8 external chapters over 15 internal phases |
| Replica 5 | 7 (Foundation → Community) | Deferred features with activation triggers vs speculative sequencing |
| **Synthesis** | **7 + Deferred** | **Convergence analysis, timeline reality check, blind spots** |

**Total ensemble cost**: ~$16.08 across 6 sessions.

---

## Key Finding: Convergent Agreement

All 5 proposals independently arrived at the same core conclusions:

1. **15 phases create cognitive overload** — both for stakeholders reviewing the roadmap and for development teams tracking progress
2. **7–8 thematic phases** is the natural consolidation point (Miller's Law: 7±2)
3. **A "Deferred" section is essential** — features that don't fit a theme or depend on organizational readiness belong in a pool with activation triggers, not locked into a speculative sequence
4. **Phase 0a/0b should merge** — the artificial split between "Prove" and "Deploy" is a single Foundation concern
5. **Heritage languages should move earlier** — Hindi/Bengali before generic "Global" expansion

---

## Recommended 7-Phase Structure

The synthesis reconciled the 5 proposals into this structure:

### Phase 1: Foundation
*Combines current Phases 0a + 0b + 1*

Prove semantic search works, deploy the portal with SRF identity. A single coherent milestone that takes the project from concept to a working product a stakeholder can use.

### Phase 2: Corpus
*Combines current Phases 3 + 6*

Complete the searchable Yogananda library — all books, all volumes. Scale from single-book proof to the full English corpus. Connect related content across works.

### Phase 3: Experience
*Enhanced current Phase 2*

Transform reading from functional to contemplative. Reading modes, focused reader, typographic refinement. The portal becomes a place people want to spend time.

### Phase 4: Intelligence
*Combines current Phases 4 + 5*

Surface connections and themes across teachings. Thematic navigation, knowledge graph traversal, editorial tools for human-curated connections. AI assists; humans approve.

### Phase 5: Heritage
*Hindi/Bengali first — not generic "Global"*

Serve heritage language communities before attempting broad internationalization. Hindi and Bengali speakers have the deepest existing relationship with these teachings. This inverts the original Phase 10 approach of treating all languages equally — prioritize by cultural connection, not alphabetical order.

### Phase 6: Reach
*Combines current Phases 7 + 8*

Distribution channels — email subscriptions, social media, magazine integration, MCP server for external AI access. Bring teachings to seekers where they already are rather than requiring them to visit the portal.

### Phase 7: Multimedia
*Current Phase 12*

Video, audio, and image intelligence. Unified semantic search across all media types. The most technically ambitious phase, deferred until the text foundation is proven.

---

## Deferred Features Strategy

Rather than speculative Phase 13/14/15 sequencing, features are categorized by what blocks them:

### Technical Deferred
Features awaiting technical maturity or infrastructure decisions:
- PWA / offline support
- Contentful CMS integration (when contract signed)
- GitLab migration (when access provisioned)
- Advanced staff tools

### Feature Deferred
Features awaiting usage data to justify investment:
- User accounts and personalization
- Study circles and community features
- External MCP server access
- SMS gateways

### Organizational Deferred
Features awaiting organizational readiness or stakeholder decisions:
- Additional languages beyond Hindi/Bengali (when reviewers identified)
- Lessons integration (if SRF decides to include)
- Community moderation (when VLD structure defined)
- Translation activation (when reviewers identified)

**Each deferred feature has a measurable activation trigger** — not "someday" but "when X condition is met, this feature enters the next available phase."

---

## Timeline Reality Check

The synthesis verified against CONTEXT.md that Brother Chidananda announced a "later in 2026" launch target.

**The math doesn't work**: Even 7 phases at 3 months each = 21 months. Starting from early 2025, that's late 2026 at the absolute earliest — and only if every phase executes perfectly with no gaps.

**December 2026 is impossible with sequential phases.** The real constraint isn't cognitive simplicity (7 vs 15 phases) — it's the launch deadline. This requires either:
- Parallel execution of multiple phases simultaneously
- Redefining "launch" as Phase 1–3 only, with later phases as post-launch evolution
- Accepting that the timeline has already slipped

This timeline reality was the synthesis's most critical finding — all 5 replica proposals missed it because they focused on organizational clarity rather than calendar feasibility.

---

## Critical Blind Spots

Three issues that all proposals either missed or underweighted:

### 1. Desktop-First Architecture Contradicts Global Equity
The project's Global Equity principle (from CONTEXT.md) implies mobile-first or at minimum mobile-equal design. But the current architecture and Phase 1 deliverables are desktop-centric. If Heritage (Phase 5) serves Hindi/Bengali speakers, many of whom are mobile-primary users, the desktop-first foundation may need rethinking before Phase 5, not after.

### 2. Monastic Editorial Availability Is Unverified
Multiple phases depend on monastic editors reviewing, curating, and approving content. CONTEXT.md lists this as an open question. If editorial availability is limited (e.g., 2 hours/week rather than 20), phases that depend on editorial review become bottlenecks. No proposal modeled this constraint.

### 3. Phase Boundaries May Be the Wrong Model
All 5 proposals accepted the premise that phases are the right organizing principle. But for continuous software delivery, phases create artificial stop-start boundaries. An alternative: **continuous delivery with capability milestones** — features ship when ready, milestones mark capability thresholds for stakeholder communication. The 7-phase structure would then be a communication tool, not a development constraint.

---

## What the Replicas Uniquely Contributed

Each replica surfaced insights the others missed:

- **Replica 1**: Cathedral vs garden sustainability model — are we building a monument or cultivating a living system?
- **Replica 2**: The "Never Build" list — explicitly naming features that should never be built prevents feature creep more effectively than deferring them
- **Replica 3**: Value-based success metrics per phase — each phase should define what "done" means in terms of user value, not feature completion
- **Replica 4**: Hybrid internal/external framing — keep 15 phases for development tracking, communicate 7–8 themes externally
- **Replica 5**: Activation triggers for deferred features — measurable conditions that promote a feature from deferred to active

---

## Recommendations

1. **Adopt the 7-phase thematic structure** for stakeholder communication and roadmap planning
2. **Implement the Deferred Features pool** with explicit activation triggers
3. **Confront the December 2026 timeline** — define what "launch" means (Phase 1–3?) and communicate it
4. **Validate monastic editorial availability** before committing to phases that depend on it
5. **Consider continuous delivery** with milestone communication rather than rigid phase gates
6. **Prioritize mobile-equal design** from Phase 1 if Global Equity is a real principle, not aspirational
7. **Create a "Never Build" list** alongside the Deferred list

---

## Replica Details

### Replica 1: 7 Phases
Foundation (0a+0b) → Library (3+6+parts of 5) → Editorial (4+parts of 5+2) → Reach (8+14) → Global (10) → Media (12+7) → Community (13+14+7)

Key insight: The "sustainability model" question — cathedral (built once, maintained forever) vs garden (continuously tended, evolving).

### Replica 2: 8 Phases
Foundation → Reading Experience → Corpus → Intelligence → Distribution → Multimedia → Global → Polish

Key insight: Desktop-first bias warning; "Never Build" list concept; silence on maintenance between phases.

### Replica 3: 7 Phases
Foundation → Library → Understanding → World → Practice → Community → Evolution

Key insight: Heritage languages at Phase 4 (World), not Phase 7+. Value-based success metrics. Risk of Deferred items becoming permanently deferred without forcing functions.

### Replica 4: 8 Phases
Proof of Concept → Portal Foundation → Content Expansion → Intelligent Connections → Study Tools → Global Reach → Distribution Channels → Community Features

Key insight: Hybrid approach — 8 themes for external communication, 15 phases for internal planning. Alternative framing as 3–4 "commitment levels" for funding discussions. Whether phases need to be sequential at all.

### Replica 5: 7 Phases
Foundation → Experience → Corpus → Operations → Global → Multimedia → Community

Key insight: Deferred features with specific activation triggers rather than speculative sequencing. Longer feedback cycles as hidden cost of consolidation. Risk of features languishing in "deferred" status.

---

*Reconstructed 2026-02-24 from session log summaries. Original synthesis by Claude Opus (ensemble session c8eaef2c). Cost: $2.13 (synthesis) / $16.08 (total ensemble).*
