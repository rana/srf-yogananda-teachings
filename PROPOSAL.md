# SRF Online Teachings Portal — Synthesized Implementation Proposal

## Summary

This synthesis consolidates five independent proposals exploring Neon PostgreSQL integration and implementation strategy for the SRF Online Teachings Portal. All proposals converge on the need to transition from extensive documentation (123 ADRs, 56 design sections) to working code, with Phase 0a validation of semantic search over Yogananda's text as the existential priority. The synthesis resolves contradictions around Contentful timing, identifies Neon-specific architectural opportunities overlooked by individual proposals, and provides a unified action plan that balances the project's sacred principles with pragmatic implementation needs.

## Convergence

All five proposals agree on these critical points:

1. **Implementation must begin immediately** — The project has over-designed without empirical contact. Phase 0a needs to start now.

2. **Edition confirmation is the primary blocker** — Without knowing which Autobiography edition provides canonical page numbers, no citation system can be built.

3. **Neon branching is underutilized** — All proposals identify Neon's Git-like branching as a key differentiator not fully leveraged in the current design.

4. **Parameters need discovery, not prescription** — Chunk size (200/300/500 tokens), RRF k-value, embedding weights should be empirically determined.

5. **Search quality validation is existential** — The 80% threshold for Phase 0a is make-or-break; if semantic search fails on Yogananda's metaphorical prose, the entire approach needs rethinking.

6. **PDF source and ingestion quality gates** — All proposals emphasize human QA review of ingested text before database insertion.

7. **MCP server should come early** — Building the SRF Corpus MCP server in Phase 0a (not 0b) accelerates development.

## Synthesis

### Neon Architecture Strategy

Combining insights from all proposals, the Neon integration should leverage these patterns:

**Branch Lifecycle Governance** (Proposals 1, 2, 4):
- Naming convention: `{purpose}-{date}-{identifier}` (e.g., `migration-2026-03-15-add-indices`)
- Feature branches: 7-day maximum lifetime
- Migration branches: Delete after merge to production
- Edition branches: Permanent branches for each book edition (1946, 1998, etc.)
- A/B testing branches: Parameter tuning experiments with production data

**Connection Pooling Architecture** (Proposals 1, 2):
- Use Neon's built-in pooler endpoint (`-pooler` suffix, port 5432)
- Three pools with different characteristics:
  - Search pool: High concurrency, transaction mode
  - Enrichment pool: Low concurrency, session mode
  - Batch pool: Single connection for long operations
- Dynamic sizing based on workload patterns

**Content Integrity Through Branching** (Proposals 2, 3):
- Every content change happens on a branch first
- SHA-256 hashes computed per chapter during ingestion
- Branch-based comparison for integrity verification
- Reference branches preserved for audit

### Implementation Sequence

Synthesizing all proposals' recommendations with conflict resolution:

#### Phase 0a Minimal Core (All proposals agree)
1. **Resolve blockers first** — Synchronous meeting with SRF for edition/PDF confirmation
2. **Initialize repository** — Minimal Next.js structure, no complexity
3. **Implement pure search** — Vector + BM25 without any AI enhancement
4. **Single book proof** — Autobiography only, full end-to-end experience
5. **Golden query validation** — 50 queries with expected results

#### Contentful Decision (Proposals 3, 5 disagree)
**Resolution:** Defer Contentful to Phase 9 as originally planned. Rationale:
- Phase 0a needs to move fast; learning Contentful API adds delay
- PDF ingestion is simpler for proof-of-concept
- Migration to Contentful later is acceptable technical debt for speed now
- Proposals 1, 2, 4 implicitly support PDF-first by not questioning it

#### Parameter Discovery Methodology (All proposals converge)
Create `/experiments/` directory with:
- Chunk size testing: 200/300/500 tokens on 30 diverse passages
- RRF k-parameter: Test 30/60/90 on golden query set
- Vector/BM25 weight ratios: Grid search from 0.5/0.5 to 0.8/0.2
- Document results in `/lib/config.ts` with evidence comments

### Database Environment Strategy

Synthesis of proposals 1, 2, and 4's environment recommendations:

- **Development**: Neon branch per developer, reset weekly
- **Staging**: Persistent branch from production, CI-updated
- **Production**: Main branch with Point-in-Time Recovery
- **Archive**: Permanent branches for each book edition
- **Experiments**: Temporary branches for A/B testing

### Performance Requirements

Consolidating performance targets from proposals 1 and 2:

- Vector search: < 100ms for top-20 retrieval at 50K chunks
- BM25 search: < 50ms for keyword queries
- Hybrid RRF fusion: < 150ms total
- First Contentful Paint: < 1.5s on 3G (per ADR-003)
- Connection pool saturation: < 80% under normal load

## Resolved Tensions

### Tension 1: AI Enhancement in Phase 0a
- **Proposal 3**: Include enrichment and Claude from start
- **Proposal 5**: Remove all AI from Phase 0a
- **Resolution**: Adopt Proposal 5's approach. Pure search first, AI enhancements in Phase 0b. This reduces risk and proves the core value proposition.

### Tension 2: Schema Complexity
- **Proposal 3**: Create all tables upfront for all phases
- **Proposal 5**: Minimal schema for Phase 0a only
- **Resolution**: Middle path — create core tables plus language columns (for multilingual foundation) but defer graph, entity, and enrichment tables until needed.

### Tension 3: Tooling Investment
- **Proposal 2**: Build sophisticated tools (graph query DSL, embedding introspection)
- **Proposal 5**: Defer all non-essential tooling
- **Resolution**: Build only MCP server and golden query tests in Phase 0a. Defer sophisticated tooling until value is proven.

### Tension 4: Documentation Updates
- **Proposal 1**: Comprehensive documentation updates before coding
- **Proposal 4**: Update documentation after implementation
- **Resolution**: Document decisions only (ADRs), update design docs after implementation proves patterns work.

## Unique Contributions

### From Proposal 1 (Overlooked by others)
- **Disaster Recovery Strategy**: Daily pg_dump to S3, weekly archives, annual DR drills
- **Secret Management Architecture**: AWS Secrets Manager for production, 90-day rotation
- **Neon-specific features governance**: Explicit decisions on autoscaling, compute endpoints, SQL editor access

### From Proposal 2 (Unique insights)
- **Edition preservation as branches**: Each book edition gets a permanent Neon branch
- **Graph Query DSL**: Domain-specific language for concept traversal (defer to Phase 4)
- **Stylometric fingerprinting**: Statistical verification of Yogananda's writing patterns
- **Cross-language semantic unity question**: Should Hindi "भक्ति" mathematically equal English "devotion"?

### From Proposal 3 (Not mentioned elsewhere)
- **Entity Registry pre-population**: Seed canonical vocabulary before first ingestion
- **Portal-as-library metaphor challenge**: Seekers might want a teacher, not a library
- **Mobile viewport testing**: Include in Phase 0a despite desktop-first approach
- **Monastic review packets**: Consider paper-based review process for editors

### From Proposal 4 (Unique elements)
- **20 elmer proposals need consolidation**: Use dedup-proposals skill before implementation
- **Theme integration**: Use theme-integrate skill for self-worth, AUM, extra-solar proposals
- **Stakeholder communication brief**: One-page status updates for SRF

### From Proposal 5 (Critical additions)
- **Blocking questions checklist**: `/docs/phase-0a-blockers.md` before any code
- **Daily progress tracking**: `/docs/progress/phase-0a.md` for session continuity
- **Single book, full experience**: Complete Autobiography portal before adding books
- **Cost of perfection question**: Ship 80% quality and iterate vs. delaying for 95%

## Proposed Changes

### 1. Create Blocking Questions Checklist
**What:** Document that must be resolved before coding begins
**Where:** `/docs/phase-0a-blockers.md`
**Why:** Starting without answers guarantees expensive rework
**Confidence:** High (convergent across all proposals)
**Trigger:** Immediately, before any other action

### 2. Initialize Minimal Repository
**What:** Bootstrap Next.js with essential structure only
**Where:** Project root
**Why:** Can't validate anything without code
**Confidence:** High (convergent)
**Trigger:** After blockers resolved

### 3. Implement Neon Branch Strategy
**What:** Branch naming conventions and lifecycle policies
**Where:** `/docs/operational/neon-branch-patterns.md` and Terraform config
**Why:** Prevents branch sprawl, enables advanced patterns
**Confidence:** High (convergent)
**Trigger:** With repository initialization

### 4. Build Pure Hybrid Search
**What:** Vector + BM25 with RRF, no AI enhancements
**Where:** `/lib/services/search.ts` and `/app/api/v1/search`
**Why:** Proves core value proposition with minimal complexity
**Confidence:** High (convergent)
**Trigger:** After schema creation

### 5. Consolidate Elmer Proposals
**What:** Deduplicate and merge 20 existing proposals
**Where:** Use dedup-proposals and proposal-merge skills
**Why:** Captures valuable insights, reduces confusion
**Confidence:** Medium (only Proposal 4 mentioned)
**Trigger:** Before Phase 0b planning

### 6. Create Parameter Discovery Framework
**What:** Experimental framework for tuning magic numbers
**Where:** `/experiments/` directory
**Why:** Design guesses at values; reality differs
**Confidence:** High (convergent)
**Trigger:** During Phase 0a implementation

### 7. Implement Content Integrity System
**What:** SHA-256 hashing with branch-based verification
**Where:** Ingestion pipeline and `/api/v1/integrity`
**Why:** Sacred text fidelity requires cryptographic guarantees
**Confidence:** High (multiple proposals)
**Trigger:** During ingestion pipeline build

### 8. Establish MCP Server Early
**What:** SRF Corpus MCP server in Phase 0a
**Where:** `/lib/mcp/srf-corpus/`
**Why:** Accelerates development with Claude Code
**Confidence:** High (convergent)
**Trigger:** After database populated

### 9. Create Connection Pooling Architecture
**What:** Three pools with different characteristics
**Where:** `/lib/db/connection-pools.ts`
**Why:** Serverless functions exhaust connections without pooling
**Confidence:** High (Proposals 1, 2)
**Trigger:** Before Vercel deployment

### 10. Build Progress Dashboard
**What:** Daily-updated progress tracking
**Where:** `/docs/progress/phase-0a.md`
**Why:** AI sessions lack memory; stakeholders need visibility
**Confidence:** Medium (Proposal 5)
**Trigger:** From day one of implementation

## Resolved Questions

### Which Autobiography edition for citations?
**Recommendation:** Default to 1998 13th edition if SRF doesn't respond within one week. Configure as parameter per ADR-123 for easy adjustment. This unblocks development while remaining flexible.

### Contentful from Phase 0 or Phase 9?
**Recommendation:** Stay with Phase 9 as designed. PDF-first is simpler for proof-of-concept. The migration debt is acceptable for the speed benefit now.

### How many tables in initial schema?
**Recommendation:** Core tables only (books, chapters, chunks, embeddings) plus language columns on all content tables. Add enrichment tables in Phase 0b after search is proven.

### Should Phase 0a include mobile testing?
**Recommendation:** Yes, basic viewport testing only. Full mobile experience in Phase 1, but Phase 0a should verify nothing breaks on mobile.

### Parameter discovery before or during implementation?
**Recommendation:** During. Start with educated guesses from design docs, then refine through experimentation. Document evidence for each change.

## Remaining Questions

### Critical (Need SRF Response)
1. **Which Autobiography edition is canonical?** (1946, 1998, or current) — Cannot proceed without this
2. **PDF source approval** — Must come from SRF AE team or is spiritmaji.com acceptable?
3. **YSS consultation contact** — Who reviews Hindi/Bengali cultural sensitivity even for English Phase 0?

### Technical (Need Empirical Testing)
1. **Optimal chunk size** — 200, 300, or 500 tokens? Requires testing on actual passages
2. **Search quality threshold** — Is 80% good enough for Phase 0a success?
3. **Embedding model stability** — Voyage voyage-3-large availability and pricing confirmed?

### Organizational (Need Stakeholder Alignment)
1. **Human technical lead** — Who maintains context across AI sessions?
2. **Monastic editor capacity** — Who commits 2-3 hours daily from Phase 4?
3. **Success metrics for philanthropist** — What demonstrates ROI after 12 months?