---
name: cultural-lens
description: Inhabit a specific cultural, spiritual, or demographic perspective and audit the design for sensitivity, inclusion, accessibility, and blind spots. Use when checking how the portal serves specific populations.
argument-hint: "[culture, perspective, or demographic]"
---

Read CONTEXT.md, DESIGN.md, DECISIONS.md, and ROADMAP.md to ground in the project's actual state.

## Cultural Perspective Audit

Inhabit the perspective of: $ARGUMENTS

From this perspective:

1. **Language & communication** — Does the portal communicate naturally and respectfully? Are translations adequate? Is the tone culturally appropriate?
2. **Visual & interaction design** — Do the design tokens, imagery, and interaction patterns feel welcoming or alien? Cultural associations of colors, symbols, layouts?
3. **Technical access** — Can this person actually use the portal? Device availability, bandwidth constraints, data costs, browser diversity.
4. **Spiritual context** — How does Yogananda's teaching intersect with this person's existing spiritual or philosophical framework? What's the entry point?
5. **Content relevance** — Which books, themes, or teachings have particular resonance? Which might need additional context?
6. **Assumptions examined** — What does the current design assume about the user that may not hold for this perspective?
7. **What uplifts?** — What simple touches would make this person feel welcomed and served?
8. **What alienates?** — What might feel exclusionary, insensitive, or simply confusing?

For every finding:
1. The specific concern or opportunity
2. Where it manifests (design element, content decision, UX flow)
3. The proposed change or consideration
4. Where it should be documented (DESIGN.md section, ADR, CONTEXT.md)

Present as an action list. No changes to files — document only.

## Output Management

**Hard constraints:**
- Maximum 8 findings per run. Prioritize by severity of cultural impact.
- $ARGUMENTS (the perspective) is effectively required for this skill. If omitted, ask the user rather than attempting all perspectives.
- Write findings to CULTURAL-LENS-AUDIT.md incrementally. Do not accumulate a single large response.

**Document reading strategy:**
- CONTEXT.md and ROADMAP.md: read fully (short documents).
- DESIGN.md: read sections relevant to the cultural dimension — visual design, content strategy, accessibility. Skip API and infrastructure sections.
- DECISIONS.md: read the index first. Only read specific ADRs touching internationalization, accessibility, or content policy.

**If output would exceed comfortable length:**
Stop. Write what you have to CULTURAL-LENS-AUDIT.md. Tell the user which dimensions remain unreviewed and offer to continue.

What questions would I benefit from asking?

What am I not asking?

You have complete design autonomy.