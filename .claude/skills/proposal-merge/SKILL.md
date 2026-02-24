---
name: proposal-merge
description: Decompose an elmer proposal into precise edits across DECISIONS.md, DESIGN.md, ROADMAP.md, and CONTEXT.md. Handles identifier assignment, cross-reference wiring, and conflict detection. Use when merging approved proposals into the canonical project documents.
argument-hint: "<proposal-filename.md>"
---

Read CONTEXT.md, DESIGN.md (index only — first 70 lines), DECISIONS.md (index only — first 120 lines), and ROADMAP.md to ground in the project's current state. Note the highest existing ADR number and DES number.

## Proposal Merge

**Input:** A proposal file from `.elmer/proposals/`. If `$ARGUMENTS` is a bare filename, resolve it under `.elmer/proposals/`. If it's a full path, use as-is.

Read the proposal file fully.

### Phase 1: Decompose

Break the proposal into discrete integration targets. For each proposed change, classify it:

| Classification | Target document | Action |
|---|---|---|
| New architectural decision | DECISIONS.md | New ADR-NNN, update index |
| Amendment to existing ADR | DECISIONS.md | Edit existing section, add revision note |
| New design section | DESIGN.md | New DES-NNN at correct position |
| Amendment to existing DES | DESIGN.md | Edit existing section |
| New phase deliverable | ROADMAP.md | Insert deliverable row in phase table |
| New phase or sub-phase | ROADMAP.md | Insert new phase section |
| New open question | CONTEXT.md | Add to appropriate tier |
| Resolved open question | CONTEXT.md | Move from open to resolved |
| Schema change | DESIGN.md § DES-004 | Amend data model section |
| New API surface | DESIGN.md § DES-019 | Amend API section |

For each item, record:
- **Source:** Which proposal section it comes from
- **Target:** Exact document and section
- **Action:** Append / amend / insert
- **Identifier:** Next available ADR or DES number (increment from current max)
- **Cross-references:** Which existing ADRs or DES sections it should reference or be referenced by

### Phase 2: Conflict Detection

Check for conflicts with existing content:
- Does an existing ADR already cover this decision? → Amend, don't duplicate
- Does an existing DES section already specify this behavior? → Extend, don't create parallel section
- Does a ROADMAP deliverable already exist for this? → Amend, don't duplicate
- Does the proposal reference ADR/DES numbers that may have shifted since proposal generation?

Flag all conflicts and stale references.

### Phase 3: Present Decomposition

Present the full decomposition to the user as a structured list grouped by target document. Include:
- Every edit with source, target, action, and identifier
- All detected conflicts with recommendations
- All cross-references that will be wired

**Ask for approval before proceeding.** The user may approve, reject specific items, or edit the plan.

### Phase 4: Execute

On approval, execute edits in this order:
1. DECISIONS.md — new ADRs and amendments (identifiers must exist before cross-referencing)
2. DESIGN.md — new DES sections and amendments
3. ROADMAP.md — phase and deliverable changes
4. CONTEXT.md — open questions and state changes

For each edit:
- Use the project's existing formatting conventions (read surrounding content for style)
- Add `*Added from proposal: [proposal-filename], [date]*` at the end of new sections
- Wire cross-references bidirectionally (if ADR-124 references DES-009, DES-009 should reference ADR-124)

### Phase 5: Post-Merge Validation

After all edits:
- Verify all new identifiers are in the correct index/table of contents
- Verify all cross-references resolve to real sections
- Check that CONTEXT.md "Current State" paragraph still accurately describes the project
- Report what changed, how many identifiers were added, and any items deferred

### Editorial Standards

- **Distill, don't paste.** Proposals contain analysis and rationale. ADRs need: Context, Decision, Rationale, Consequences. DES sections need: specification. Strip exploration prose.
- **Preserve the proposal's open questions.** These go to CONTEXT.md, not into ADRs.
- **Preserve the proposal's "What's Not Being Asked" insights.** These go to CONTEXT.md as Tier 2/3 open questions or as notes on existing open questions.
- **Match existing voice.** Read adjacent ADRs and DES sections. Match their tone, depth, and structure.
- **No identifier gaps.** ADR and DES numbers must be sequential with no gaps from the current max.

## Output Management

Segment edits into batches of up to 10 items, ordered by priority: high-priority items first (new ADRs, schema changes, phase deliverables), then lower-priority items (open questions, cross-reference wiring, editorial notes).

Present each batch for approval before executing. After each approved batch is executed, proceed immediately to present the next batch. Continue until all edits are processed. State the total count when complete.

Present the full decomposition before executing any batch. Do not execute without explicit approval.
