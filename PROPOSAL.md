# Copyright and Content Licensing Strategy Proposal

## Summary

Establish a clear copyright stance that balances SRF's retention of all rights with a generous accessibility posture that welcomes search engines, AI models, researchers, and seekers worldwide. This proposal defines both the technical implementation (legal pages, API headers, machine-readable declarations) and the theological framing that makes "freely available" meaningful without implying public domain or relinquishment of rights.

## Analysis

The current documentation contains scattered references to copyright but lacks a unified stance. CONTEXT.md lists it as an open question requiring stakeholder input. ADR-081 (Machine-Readable Content and AI Citation Strategy) enthusiastically welcomes AI crawlers and establishes llms.txt/llms-full.txt files but doesn't address the copyright implications. The tension is clear: how can content be "freely available to all" (the philanthropist's vision) while SRF retains copyright (organizational necessity)?

Three key insights emerged:

1. **"Available" ≠ "Public Domain"** — Content can be freely accessible for reading, reference, and citation while remaining under copyright. Libraries do this daily. The portal can follow this established model.

2. **Machine consumers matter** — The portal already welcomes GPTBot, ClaudeBot, and other AI crawlers (ADR-081). These systems need explicit guidance about acceptable use. The portal should tell them not just *how* to cite but *that citation is required*.

3. **Theological alignment** — The mission is making teachings "available freely throughout the world." This availability serves a spiritual purpose: reaching seekers at their moment of need. Copyright retention ensures the teachings remain unaltered and properly attributed — protecting their integrity, not restricting their reach.

## Proposed Changes

### 1. Create `/legal` Page with Clear Copyright Statement
- **What:** Add a legal information page with copyright notice, content licensing terms, and usage guidelines
- **Where:** `/app/legal/page.tsx` (Next.js page route)
- **Why:** Provides human-readable legal clarity linked from every page footer
- **How:**
  - Copyright notice: "© [current year] Self-Realization Fellowship. All rights reserved."
  - Usage statement explaining permitted uses (reading, personal study, non-commercial sharing with attribution)
  - Explicit permissions for search engines and AI systems to index and cite with proper attribution
  - Prohibition on commercial use, derivative works, or redistribution without permission

### 2. Add `/copyright.json` Machine-Readable Endpoint
- **What:** JSON endpoint declaring copyright status and permitted uses for automated systems
- **Where:** `/app/api/v1/copyright/route.ts`
- **Why:** Machine consumers need structured data, not HTML pages
- **How:**
```json
{
  "rights_holder": "Self-Realization Fellowship",
  "copyright_year_start": 1920,
  "copyright_status": "in_copyright",
  "license_type": "all_rights_reserved_with_permissions",
  "permitted_uses": [
    "indexing_for_search",
    "citation_with_attribution",
    "personal_study",
    "non_commercial_sharing_with_link"
  ],
  "required_attribution": {
    "format": "[Quote] — Paramahansa Yogananda, [Book], Ch. [N] via teachings.yogananda.org",
    "include_url": true
  },
  "prohibited_uses": [
    "commercial_reproduction",
    "derivative_works",
    "ai_training_without_attribution",
    "paraphrasing_as_original"
  ],
  "contact": "legal@yogananda.org"
}
```

### 3. Enhance `llms.txt` with Explicit Copyright Declaration
- **What:** Add copyright and attribution requirements to the existing llms.txt guidance
- **Where:** Modify ADR-081 section 2 in DECISIONS.md
- **Why:** AI systems reading llms.txt need to understand the content's legal status
- **How:** Add section after "Preferred Behavior":
```
## Copyright and Attribution
- All content © Self-Realization Fellowship. All rights reserved.
- You may quote for reference with proper attribution.
- Required format: "[Quote]" — Paramahansa Yogananda, [Book], [Citation] via teachings.yogananda.org
- Do not imply content is public domain or freely reusable.
- Commercial use prohibited without permission.
```

### 4. Add X-Copyright HTTP Headers to API Responses
- **What:** Include copyright metadata in HTTP response headers for all content APIs
- **Where:** Middleware in `/lib/middleware/copyright-headers.ts`
- **Why:** Ensures copyright notice travels with content even when accessed programmatically
- **How:**
```typescript
headers.set('X-Copyright', '© Self-Realization Fellowship');
headers.set('X-License', 'All rights reserved - Citation permitted with attribution');
headers.set('X-Attribution-Required', 'true');
```

### 5. Update Privacy Policy with Content Rights Section
- **What:** Add section to privacy policy explaining the portal's content rights position
- **Where:** `/app/privacy/page.tsx` (specified in ROADMAP Phase 1.20)
- **Why:** Seekers need to understand what they can do with content they read
- **How:** New section "Content and Copyright" explaining that:
  - All content remains under SRF copyright
  - Personal use and sharing with attribution is encouraged
  - The portal exists to serve seekers, not to release content into public domain

### 6. Add Copyright Notice to Every Content Display
- **What:** Unobtrusive copyright line on passage displays, book pages, and PDFs
- **Where:** Component updates in `/components/PassageDisplay.tsx`, `/components/BookReader.tsx`
- **Why:** Gentle reminder of copyright without disrupting reading experience
- **How:** Small text at bottom: "© Self-Realization Fellowship • [Book Title]"

### 7. Create "Sharing Guidelines" Help Section
- **What:** User-friendly explanation of how to share portal content appropriately
- **Where:** `/app/help/sharing/page.tsx` linked from About page
- **Why:** Empowers seekers to share teachings while respecting copyright
- **How:**
  - Examples of proper attribution
  - Explanation of why attribution matters (preserving authenticity)
  - Invitation to share freely with proper credit
  - Social media sharing best practices

### 8. Document Formal Permissions for AI Training
- **What:** Clear statement in ADR-081 about AI training corpus inclusion
- **Where:** New section in ADR-081 "Copyright Posture for AI Training"
- **Why:** The portal wants to be the authoritative source when AI quotes Yogananda
- **How:** "SRF grants permission for AI training systems to include portal content in their training corpora, provided: (1) Yogananda's words are marked as copyrighted material requiring attribution, (2) The portal URL is preserved as the source, (3) No implication that the content is public domain."

## Open Questions

1. **Enforcement stance:** Should the portal actively monitor for copyright violations or focus only on proper attribution in its own systems?

2. **API terms of service:** Should authenticated API access (Phase 13+) require explicit acceptance of terms?

3. **Translation rights:** How do copyright notices work for official translations? Does each translation need its own copyright statement?

4. **Community collections:** When Phase 14 enables community curation, what rights do contributors have to their arrangements of SRF content?

5. **MCP external tier implications:** Should the MCP external tier (ADR-101 Tier 3) require registration to ensure copyright acknowledgment?

## What's Not Being Asked

**Revenue protection:** The copyright discussion focuses on attribution and integrity, not monetization. This aligns with the mission but may not align with traditional organizational copyright concerns.

**Competitive moats:** The proposal makes content maximally available rather than creating exclusive access. This serves seekers but doesn't create competitive advantage.

**Future content strategy:** What happens when unpublished materials become available? The current stance assumes all portal content should be equally accessible.

**International copyright complexity:** Different jurisdictions have different copyright terms and fair use concepts. The portal takes a single global stance rather than jurisdiction-specific policies.

**Derivative works policy:** The portal prohibits derivative works, but what about translations by devoted seekers? Study guides? Commentaries? The line between sharing and derivation needs clearer definition.