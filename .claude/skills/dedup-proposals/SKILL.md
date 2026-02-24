---
name: dedup-proposals
description: Deduplicate and synthesize overlapping elmer proposals. Without arguments, scans all proposals and reports variant clusters. With a filename argument, finds all related explorations of the same topic and synthesizes them into one richer document preserving all unique ideas.
argument-hint: "[optional proposal-filename.md]"
---

## Proposal Deduplication and Synthesis

### Mode Selection

**No arguments** (`/dedup-proposals`): Triage mode — scan all proposals, report clusters, recommend actions.

**With argument** (`/dedup-proposals <filename>`): Synthesis mode — find all related explorations of the named proposal's topic, merge them into one canonical document.

---

### Triage Mode (no arguments)

Read all `.md` files in `.elmer/proposals/`. For each file, extract:
- The `elmer:archive` metadata block (topic, id, archetype, status)
- The first 200 words of the Summary section

Cluster proposals by topic similarity:
1. **Exact match:** Same `topic` field in elmer metadata
2. **Near match:** Topics sharing 3+ significant words (excluding stopwords)
3. **Content match:** Summaries with >40% semantic overlap

For each cluster, report:
- File names and sizes
- Overlap percentage (structural alignment of sections)
- Which file is more developed (word count, section completeness)
- Unique ideas in each file not present in the other(s)
- Contradictions between files (if any)
- Recommendation: which to use as canonical base, what to preserve from others

For non-clustered proposals, report: "No duplicates found."

Present the full report. Offer three actions:
1. Auto-resolve all clusters using recommendations
2. Resolve cluster-by-cluster with approval
3. Show side-by-side comparison for a specific cluster

---

### Synthesis Mode (with argument)

**Step 1: Find related explorations**

Read the named file. Extract its `topic` field from the `elmer:archive` metadata block.

Scan all other `.md` files in `.elmer/proposals/`:
- Check for exact topic match (same elmer topic string)
- Check for near topic match (3+ shared significant words in topic)
- Check for content overlap (>40% of proposed changes target the same ADRs/DES sections)

Report what was found:
```
Found N related exploration(s):
  → filename.md (topic match: exact|near|content, overlap: NN%)
```

If no related explorations found, report and stop.

**Step 2: Structural alignment**

For each section present in any source file (Summary, Analysis, Proposed Changes, Open Questions, What's Not Being Asked), compare across all sources:

- **Shared ideas:** Present in 2+ sources (strengthened signal)
- **Unique to source A:** Ideas only in one exploration
- **Unique to source B:** Ideas only in the other
- **Contradictions:** Claims or recommendations that conflict

Present the alignment table to the user.

**Step 3: Synthesize**

On approval, produce a single merged document:

- **Structure:** Use the clearest organizational structure from any source
- **Shared ideas:** Collapse to the stronger phrasing. Note reinforcement: "Both explorations independently identified this concern."
- **Unique ideas:** Preserve all. Weave into the appropriate section. Do not relegate to an appendix — integrate as first-class content.
- **Contradictions:** Preserve both positions with a note explaining the tension. Do not resolve — that's the human's job.
- **Provenance note:** Add a synthesis note at the top of the merged document:

```markdown
<!-- Synthesis note:
  Merged from N explorations of: "[topic]"
  Sources:
    - filename-a.md (YYYY-MM-DD HH:MM UTC) — emphasized [brief characterization]
    - filename-b.md (YYYY-MM-DD HH:MM UTC) — emphasized [brief characterization]
  Ideas flagged by multiple explorations are noted as reinforced signals.
-->
```

- **Elmer metadata:** Preserve the `elmer:archive` block. Update the `id` to the canonical filename (without `-2` suffix). Add `synthesized_from` field listing source IDs.

**Step 4: Write and archive**

- Write the synthesized document to `.elmer/proposals/` using the canonical filename (shortest variant, no `-2` suffix)
- Move superseded source files to `.elmer/proposals/archived/` (create directory if needed)
- Report the synthesis: word counts, unique ideas preserved, contradictions flagged

---

### Quality Standards

- **Lossless on ideas, lossy on phrasing.** Every distinct insight from every source must appear in the output. Redundant prose is collapsed.
- **Parallax is signal.** When two explorations reach the same conclusion independently, that's stronger evidence than either alone. Mark it.
- **Don't resolve tensions.** If Source A says "defer Neptune" and Source B says "keep Neptune but simplify," present both. Synthesis combines perspectives — it doesn't make decisions.
- **Preserve the "What's Not Being Asked" sections fully.** These contain the highest-value insights and are the most likely to differ between explorations.

## Output Management

Present the structural alignment before writing anything. The user approves, edits, or rejects the synthesis plan before the merged document is produced.

If multiple clusters need deduplication, segment into groups. Present each cluster's synthesis plan for approval. After each approved synthesis is executed, proceed immediately to present the next cluster. Continue until all clusters are processed. State the total count when complete.
