---
name: mission-align
description: SRF principle alignment check. Verifies designs honor verbatim fidelity, calm technology, DELTA compliance, signpost-not-destination, global equity, human review gates, and sacred text integrity.
argument-hint: "[optional principle to focus on]"
---

Read CONTEXT.md, DESIGN.md, DECISIONS.md, and ROADMAP.md to ground in the project's actual state.

## SRF Mission Alignment Check

Audit against the project's stated principles:

1. **Verbatim fidelity** (ADR-001, ADR-075, ADR-078) — The AI is a librarian, never an oracle. Every passage has book/chapter/page citation. No orphaned quotes. No paraphrasing. Only official SRF/YSS translations.
2. **Calm technology** — No gamification, no aggressive notifications, no dopamine loops. Warm cream, serif typography, generous whitespace.
3. **DELTA compliance** (ADR-095) — No user identification, no session tracking, no behavioral profiling. Amplitude event allowlist only.
4. **Signpost, not destination** — Points toward deeper practice without tracking conversions. No engagement metrics optimizing for screen time. No "sign up to access" gates.
5. **Human review as mandatory gate** (ADR-078, ADR-032, ADR-005) — No user-facing content without human verification. AI proposes, humans approve.
6. **Global equity** (ADR-006) — One product, complete at every level. Bihar to San Francisco. Performance budgets, progressive enhancement, data-cost awareness.
7. **Content availability honesty** — No machine-translated substitutes. Honest about scope. English fallback always marked `[EN]`.
8. **10-year architecture horizon** (ADR-004, ADR-013) — Dependencies as commitments. Data in PostgreSQL. Business logic framework-agnostic.
9. **Accessibility from Milestone 2a** (ADR-003) — WCAG 2.1 AA. Semantic HTML, keyboard navigation, 44x44px touch targets. Performance for 3G in rural India.
10. **Multilingual from foundation** (ADR-075-078) — Every content table has `language`. Every API accepts `language`. Zero schema migrations to add a language.
11. **SRF Lessons boundary** — Lesson content permanently excluded. Published descriptions of Kriya Yoga (e.g., Autobiography Ch. 26) included. Practice Bridge links to SRF resources.

Focus area: $ARGUMENTS

For every misalignment or risk:
1. What principle is at risk and how
2. Where the issue is (file, section, ADR, design element)
3. The specific change to restore alignment

Present as an action list. No changes to files — document only.

## Output Management

**Hard constraints:**
- Segment output into groups of up to 8 findings, ordered by severity.
- If no $ARGUMENTS focus area is given, audit only the top 3 most at-risk principles rather than all 11.
- Write findings to MISSION-ALIGN-AUDIT.md incrementally. Do not accumulate a single large response.
- After completing each segment, continue immediately to the next. Do not wait for user input.
- Continue until ALL principles in the focus area are audited. State the total count when complete.
- If the analysis surface is too large to complete in one session, state what was covered and what remains.

**Document reading strategy:**
- CONTEXT.md and ROADMAP.md: read fully (short documents).
- DESIGN.md and DECISIONS.md: read the index/overview sections first. Only read specific ADR or design sections relevant to the focused principle(s).

What questions would I benefit from asking?

What am I not asking?

You have complete design autonomy.