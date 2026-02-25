# SRF Online Teachings Portal — Proposals

> **Purpose.** Registry and staging area for feature proposals, theme ideas, and architectural suggestions. Each curated proposal gets a permanent PRO-NNN identifier. Proposals graduate to ADR/DES sections or milestone deliverables through the graduation protocol. PRO-NNN identifiers persist as historical markers even after adoption — they are never renamed or reassigned.

> **Loading guidance.** Load this file when evaluating proposals, at arc boundaries, or when a PRO-NNN is cross-referenced. Not needed during implementation unless a specific PRO is referenced.

> **Relationship to explorations.** Raw exploration files in `.elmer/proposals/` are unvetted AI ideation — they are not project documents. The `/dedup-proposals` skill consolidates explorations into curated PRO-NNN entries in this file. See § Intake Protocol.

## Index

| PRO | Title | Type | Status | Governing Refs | Origin |
|-----|-------|------|--------|----------------|--------|
| PRO-001 | SRF Corpus MCP — Three-Tier Architecture | Feature | Validated | ADR-101, DES-031, ADR-097 | ADR-101 (descheduled 2026-02-24) |
| PRO-002 | SRF Lessons Integration | Feature | Validated | ADR-085, ADR-121 | Stakeholder vision |
| PRO-003 | Text-to-Speech for Passages | Feature | Proposed | ADR-003, ADR-073 | Accessibility vision |
| PRO-004 | Audio-Visual Ambiance Toggle | Enhancement | Proposed | ADR-065 | Unscheduled feature |

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
**Governing Refs:** ADR-003, ADR-073
**Dependencies:** Passage display infrastructure (Milestone 2a). Screen reader emotional quality standards (ADR-073) inform voice selection criteria.
**Scheduling Notes:** Listed in ROADMAP.md § Unscheduled Features. TTS for displayed passages would extend accessibility beyond screen readers to seekers who prefer audio consumption. Voice selection must respect the devotional register — synthetic voices that trivialize sacred text are worse than no TTS. Evaluate browser-native speech synthesis vs. cloud TTS services; consider DELTA compliance for any cloud option.
**Re-evaluate At:** Arc 2 boundary
**Decision Required From:** Architecture + accessibility review

### PRO-004: Audio-Visual Ambiance Toggle

**Status:** Proposed
**Type:** Enhancement
**Governing Refs:** ADR-065
**Dependencies:** None architectural. Content dependency: curated ambient audio assets.
**Scheduling Notes:** Listed in ROADMAP.md § Deferred / Suspended. Optional temple bells or nature sounds during reading. Must respect Calm Technology principles — never autoplay, never default-on, never attention-seeking. Evaluated and deferred as non-essential to the core reading experience. Risk of trivializing the portal's contemplative register if poorly executed.
**Re-evaluate At:** Post-Arc 3 (after core experience is mature)
**Decision Required From:** Editorial + UX review

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
