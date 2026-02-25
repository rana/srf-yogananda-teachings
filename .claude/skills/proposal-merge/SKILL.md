---
name: proposal-merge
description: Graduate a PRO-NNN proposal into precise edits across DECISIONS.md, DESIGN.md, ROADMAP.md, and CONTEXT.md. Assigns ADR/DES identifiers, detects conflicts, updates PRO status, presents full plan for approval before executing.
argument-hint: "<PRO-NNN>"
---

Read CONTEXT.md, DESIGN.md (index only — first 70 lines), DECISIONS.md (index only — first 120 lines), PROPOSALS.md, and ROADMAP.md to ground in the project's current state. Note the highest existing ADR number and DES number.

## Proposal Merge

**Input:** A PRO-NNN identifier from PROPOSALS.md. If `$ARGUMENTS` is a PRO-NNN (e.g., `PRO-003`), look it up in PROPOSALS.md. If it's a bare filename, resolve it under `.elmer/proposals/` and note that it should have been curated into a PRO-NNN entry first via `/dedup-proposals` — offer to create one.

Read the PRO entry in PROPOSALS.md fully. If the PRO has origin files in `.elmer/proposals/`, read those for the full analysis and proposed changes.

### Step 1: Decompose

Break the proposal into discrete integration targets. For each proposed change, classify it:

| Classification | Target document | Action |
|---|---|---|
| New architectural decision | DECISIONS-*.md + DECISIONS.md index | New ADR-NNN, update index |
| Amendment to existing ADR | DECISIONS-*.md | Edit existing section, add revision note |
| New design section | DESIGN-*.md + DESIGN.md TOC | New DES-NNN at correct position |
| Amendment to existing DES | DESIGN-*.md | Edit existing section |
| New arc/milestone deliverable | ROADMAP.md | Insert deliverable row in arc table |
| New arc or milestone | ROADMAP.md | Insert new arc section |
| New open question | CONTEXT.md | Add to appropriate tier |
| Resolved open question | CONTEXT.md | Move from open to resolved |
| Schema change | DESIGN-arc1.md § DES-004 | Amend data model section |
| New API surface | DESIGN.md § DES-019 | Amend API section |

For each item, record:
- **Source:** Which proposal section it comes from (PRO-NNN body or origin exploration)
- **Target:** Exact document and section
- **Action:** Append / amend / insert
- **Identifier:** Next available ADR or DES number (increment from current max)
- **Cross-references:** Which existing ADRs or DES sections it should reference or be referenced by

### Step 2: Conflict Detection

Check for conflicts with existing content:
- Does an existing ADR already cover this decision? → Amend, don't duplicate
- Does an existing DES section already specify this behavior? → Extend, don't create parallel section
- Does a ROADMAP deliverable already exist for this? → Amend, don't duplicate
- Does the proposal reference ADR/DES numbers that may have shifted since proposal generation?

Flag all conflicts and stale references.

### Step 3: Present Decomposition

Present the full decomposition to the user as a structured list grouped by target document. Include:
- Every edit with source, target, action, and identifier
- All detected conflicts with recommendations
- All cross-references that will be wired
- The PRO-NNN status update that will be applied on completion

**Ask for approval before proceeding.** The user may approve, reject specific items, or edit the plan.

### Step 4: Execute

On approval, execute edits in this order:
1. DECISIONS-*.md — new ADRs and amendments (identifiers must exist before cross-referencing)
2. DECISIONS.md — update index with new ADR entries
3. DESIGN-*.md — new DES sections and amendments
4. DESIGN.md — update TOC if new DES sections added
5. ROADMAP.md — arc and deliverable changes
6. CONTEXT.md — open questions and state changes
7. PROPOSALS.md — update PRO-NNN status to `Adopted → [ADR/DES/Milestone refs]`

For each edit:
- Use the project's existing formatting conventions (read surrounding content for style)
- Add `*Added from PRO-NNN: [title], [date]*` at the end of new sections
- Wire cross-references bidirectionally (if ADR-050 references DES-009, DES-009 should reference ADR-050)

### Step 5: Post-Merge Validation

After all edits:
- Verify all new identifiers are in the correct index/table of contents
- Verify all cross-references resolve to real sections
- Verify PRO-NNN status in PROPOSALS.md is updated to Adopted with correct cross-references
- Verify ROADMAP.md § Unscheduled Features summary table is updated (PRO row removed from Proposed, or moved to show adopted status)
- Check that CONTEXT.md "Current State" paragraph still accurately describes the project
- Report what changed, how many identifiers were added, and any items deferred

### Editorial Standards

- **Distill, don't paste.** Proposals and explorations contain analysis and rationale. ADRs need: Context, Decision, Rationale, Consequences. DES sections need: specification. Strip exploration prose.
- **Preserve the proposal's open questions.** These go to CONTEXT.md, not into ADRs.
- **Preserve the proposal's "What's Not Being Asked" insights.** These go to CONTEXT.md as Tier 2/3 open questions or as notes on existing open questions.
- **Match existing voice.** Read adjacent ADRs and DES sections. Match their tone, depth, and structure.
- **No identifier gaps.** ADR and DES numbers must be sequential with no gaps from the current max.
- **ADR maturity markers.** New ADRs created from proposals should carry appropriate maturity status (Active for current-arc work, Provisional for future-arc work). See ADR-098 for the classification.

## Output Management

Segment edits into batches of up to 10 items, ordered by priority: high-priority items first (new ADRs, schema changes, arc deliverables), then lower-priority items (open questions, cross-reference wiring, editorial notes).

Present each batch for approval before executing. After each approved batch is executed, proceed immediately to present the next batch. Continue until all edits are processed. State the total count when complete.

Present the full decomposition before executing any batch. Do not execute without explicit approval.
