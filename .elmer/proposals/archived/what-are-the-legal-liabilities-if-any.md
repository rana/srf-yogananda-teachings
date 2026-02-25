<!-- elmer:archive
  id: what-are-the-legal-liabilities-if-any
  topic: What are the legal liabilities, if any?
  archetype: explore-act
  model: opus
  status: approved
  archived: 2026-02-24 06:38 UTC
-->

# Legal Liability Analysis for SRF Online Teachings Portal

## Summary

The SRF Online Teachings Portal faces multiple categories of legal liability spanning intellectual property, privacy law, accessibility requirements, content liability, and AI-specific regulatory compliance. While the project's ethical framework (DELTA) and existing architectural decisions create strong protective foundations, several critical gaps require immediate attention before Phase 0a coding begins, particularly around copyright authorization, content licensing terms, liability insurance, and formal legal review of AI-generated features.

## Analysis

### Current Legal Protections in Architecture

The portal's existing design incorporates several liability-mitigating features:

1. **ADR-001 (Direct Quotes Only)** eliminates AI hallucination liability by prohibiting content generation
2. **ADR-099 (DELTA as GDPR Superstructure)** exceeds privacy requirements through principle-first design
3. **ADR-003 (Accessibility Phase 1)** reduces ADA/WCAG lawsuit exposure through proactive compliance
4. **ADR-081 (Machine-Readable Content)** establishes clear AI crawler permissions and citation requirements
5. **Human review gates** throughout content pipeline prevent automated publication of problematic content

### Identified Legal Risk Categories

Through examination of the project documentation, open questions, and architectural decisions, I've identified twelve distinct categories of legal liability:

1. **Copyright and Intellectual Property**
   - Unauthorized reproduction/distribution of copyrighted materials
   - Trademark infringement (SRF, YSS, Yogananda name/likeness)
   - Third-party content in ingested materials (forewords, translations)

2. **Privacy and Data Protection**
   - GDPR, CCPA, and global privacy law compliance
   - Cross-border data transfers
   - Sub-processor liability (Vercel, Neon, Auth0, etc.)

3. **Accessibility Lawsuits**
   - ADA Title III (US)
   - European Accessibility Act (EU)
   - Web Content Accessibility Guidelines (WCAG) compliance

4. **Content Liability**
   - Defamation claims (monastic biographies, historical narratives)
   - Crisis intervention duty (grief/death content adjacent to vulnerable users)
   - Medical/health claims in healing affirmations

5. **AI Regulatory Compliance**
   - EU AI Act classification and obligations
   - California AI transparency requirements
   - Bias and discrimination in search results

6. **Terms of Service Gaps**
   - No defined content license to users
   - Unclear API usage terms
   - Missing acceptable use policy

7. **International Jurisdiction**
   - Serving content in 100+ countries
   - Language-specific legal requirements
   - Religious content restrictions in certain nations

8. **Volunteer/VLD Liability**
   - Community-generated content moderation
   - Volunteer data access and confidentiality
   - Employment law classification risks

9. **Minor Protection**
   - COPPA compliance for users under 13
   - Parental consent mechanisms
   - Age-appropriate content filtering

10. **Platform Liability**
    - Section 230 safe harbor eligibility
    - Notice-and-takedown procedures
    - User-generated content (future phases)

11. **Contractual Obligations**
    - SRF partnership terms undefined
    - Philanthropist foundation agreements
    - Vendor service level agreements

12. **Insurance and Indemnification**
    - Cyber liability coverage gaps
    - Professional liability for AI features
    - Indemnification between SRF, foundation, and operators

## Proposed Changes

### Immediate Pre-Phase 0a Requirements

These must be resolved before any code is written:

1. **What:** Obtain written copyright license from SRF
   **Where:** Legal agreement between SRF and portal operator
   **Why:** Without explicit permission, the entire project constitutes copyright infringement
   **How:** Draft memorandum of understanding covering:
   - Rights to digitize and display SRF publications
   - Permitted uses (search, API, embeddings)
   - Geographic scope (worldwide distribution)
   - Duration and termination conditions

2. **What:** Define content licensing terms for users
   **Where:** `/terms` page and API documentation
   **Why:** Users need clear understanding of permitted uses
   **How:** Specify:
   - Read-only access for personal/educational use
   - No commercial reproduction
   - Required attribution format
   - API rate limits and acceptable use

3. **What:** Establish legal entity structure
   **Where:** Operational documentation
   **Why:** Determines liability exposure and insurance requirements
   **How:** Clarify:
   - Portal operator entity (foundation, SRF, or new entity)
   - Liability allocation between parties
   - Insurance requirements and coverage levels
   - Indemnification provisions

### Phase 0 Legal Infrastructure

4. **What:** Comprehensive Terms of Service and Privacy Policy
   **Where:** `/terms`, `/privacy`, and footer links
   **Why:** Legal requirement in all jurisdictions
   **How:** Include:
   - DELTA framework transparency
   - GDPR Article 13/14 disclosures
   - California privacy rights
   - Arbitration and venue clauses
   - DMCA safe harbor provisions

5. **What:** Cookie consent management system
   **Where:** Site-wide banner/modal
   **Why:** GDPR/ePrivacy Directive requirement
   **How:** Implement:
   - Granular consent categories
   - Legitimate interest balancing
   - Consent withdrawal mechanism
   - Consent proof storage

6. **What:** Accessibility legal review
   **Where:** Testing documentation and compliance reports
   **Why:** Proactive defense against ADA lawsuits
   **How:** Document:
   - WCAG 2.1 AA compliance testing
   - Screen reader compatibility
   - Keyboard navigation paths
   - Remediation timeline for any gaps

### Phase 1-3 Risk Mitigation

7. **What:** Crisis resource disclosure system
   **Where:** Grief/death related content pages
   **Why:** Potential duty of care to vulnerable users
   **How:** Implement:
   - Geo-located crisis helpline numbers
   - Non-intrusive placement
   - Clear disclaimer of non-professional nature

8. **What:** Medical disclaimer for healing content
   **Where:** Scientific Healing Affirmations sections
   **Why:** Avoid medical advice liability
   **How:** Add prominent disclaimers:
   - "Not medical advice"
   - "Consult healthcare providers"
   - "Spiritual practices complement medical care"

9. **What:** AI system disclosure and opt-out
   **Where:** Search interface and About page
   **Why:** EU AI Act and California SB 1001 compliance
   **How:** Provide:
   - Clear AI involvement disclosure
   - Explanation of search ranking
   - Opt-out for AI features (fallback to keyword search)

### Phase 4+ Governance Structures

10. **What:** VLD volunteer agreements
    **Where:** VLD onboarding process
    **Why:** Clarify volunteer vs. employee status
    **How:** Include:
    - Volunteer status confirmation
    - Confidentiality obligations
    - Intellectual property assignment
    - Limitation of liability

11. **What:** Content moderation framework
    **Where:** Editorial review portal
    **Why:** Platform liability protection
    **How:** Establish:
    - Clear content guidelines
    - Consistent enforcement
    - Appeals process
    - Documentation requirements

12. **What:** International compliance audit
    **Where:** Per-country deployment review
    **Why:** Jurisdiction-specific requirements
    **How:** Review:
    - Religious content restrictions
    - Data localization requirements
    - Language-specific regulations
    - Tax and business registration

## Open Questions

### Critical Legal Questions Requiring Counsel

1. **Copyright authorization chain:** Does SRF hold all necessary rights to sublicense Yogananda's works for digital distribution? Are there any third-party rights (translators, editors, photographers) that need clearing?

2. **Fair use analysis:** Can the portal claim fair use for search indexes, embeddings, and snippet display? What are the boundaries?

3. **International religious content:** Are there countries where distributing Yogananda's teachings could violate religious content laws? (Particularly relevant for Muslim-majority nations)

4. **Nonprofit vs. commercial classification:** Is the portal's free distribution model sufficient for nonprofit classification, or does the AI search create commercial activity?

5. **Liability insurance requirements:** What coverage levels are appropriate for:
   - Cyber liability (data breach, ransomware)
   - Professional liability (AI errors)
   - Media liability (defamation, copyright)
   - Directors & Officers (if separate entity)

6. **EU AI Act classification:** Is the portal a "limited risk" or "minimal risk" AI system? What are the corresponding obligations?

7. **Section 230 eligibility:** Does the curation and ranking of content disqualify the portal from Section 230 protections?

8. **Accessibility safe harbor:** Is there a documented remediation plan that provides protection during the improvement process?

### Stakeholder Legal Clarifications Needed

1. **Existing SRF legal review:** Has SRF's legal counsel reviewed the portal concept? What concerns were raised?

2. **Foundation structure:** Is the philanthropist's foundation a UK or US entity? This affects applicable law.

3. **SRF trademark licensing:** Will SRF provide formal trademark licenses for the portal's use of SRF/YSS marks?

4. **Content correction liability:** If errors are discovered in the source texts, who bears responsibility for corrections?

5. **Monastic content review:** Has legal counsel reviewed the biographical content plans for defamation risk?

## What's Not Being Asked

### Hidden Legal Complexities

1. **Embeddings as derivative works:** The legal status of vector embeddings from copyrighted text remains unsettled. The portal creates and stores embeddings of Yogananda's entire corpus. Could these be considered unauthorized derivative works?

2. **LLM training data liability:** ADR-081 explicitly welcomes AI crawlers to train on portal content. If future LLMs generate harmful content traced to portal training data, could there be contributory liability?

3. **Sacred text legal protections:** Some jurisdictions provide special legal status to religious texts. Has this been evaluated for Yogananda's works?

4. **Succession of digital rights:** Yogananda passed away in 1952. How have his digital rights (which didn't exist then) been legally transferred to SRF?

5. **Multi-language liability multiplication:** Each translation potentially introduces new copyright holders, new cultural sensitivities, and new legal jurisdictions. The legal complexity scales geometrically, not linearly, with languages.

6. **API as unintended circumvention:** The portal's generous API could enable bulk extraction that undermines SRF's physical book sales, even if not intended for that purpose.

7. **Theological interpretation liability:** While the portal only quotes verbatim, the acts of ranking, contextualizing, and juxtaposing passages create implicit theological interpretations. Could sectarian disputes within the Yogananda lineage create legal challenges?

8. **Long-term content preservation obligations:** If the portal becomes the primary digital source for these teachings, does it create a duty to maintain them indefinitely?

9. **AI model deprecation risk:** When Claude Haiku or Voyage embeddings are discontinued, the portal must re-embed the entire corpus. The legal right to continuously process the content in new models needs explicit permission.

10. **Cross-border data sovereignty:** The portal's architecture assumes free flow of data between US, EU, and Indian infrastructure. Evolving data sovereignty laws could fracture this model.

### Regulatory Horizon Scanning

1. **Age-appropriate design codes:** UK and California are implementing strict requirements for services accessible to minors. The portal's open access model may need age-gating.

2. **AI liability frameworks:** The EU is considering strict liability for AI systems. The portal's search could face liability for any harms, regardless of fault.

3. **Religious content regulation:** Several countries are strengthening control over religious content online. The portal may need geo-blocking capabilities.

4. **Embedding regulation:** Proposed EU regulations may classify embeddings as personal data when derived from authored works, triggering GDPR requirements.

5. **Accessibility litigation trends:** ADA lawsuits against websites are increasing exponentially. The portal's high visibility makes it an attractive target.

### Unstated Stakeholder Assumptions

1. **SRF assumes copyright is settled:** The project proceeds as if SRF's rights to Yogananda's works are absolute, but the chain of title may have gaps.

2. **Foundation assumes nonprofit immunity:** The philanthropist may believe charitable purpose provides broad liability protection, but this varies significantly by jurisdiction.

3. **Technical team assumes terms later:** The architecture focuses on technical excellence while deferring legal framework, but retrofitting legal compliance is much harder than building it in.

4. **Everyone assumes goodwill protection:** The spiritual nature of the content may seem to provide moral protection from lawsuits, but legal systems don't recognize this distinction.

5. **Content assumed apolitical:** Yogananda's writings include views on diet, health, education, and social organization that may be controversial or regulated in some jurisdictions.

### Implementation Priority Order

Given the analysis above, here's the recommended sequence for addressing legal liabilities:

**Before ANY code (blocking Phase 0a):**
1. SRF copyright authorization
2. Basic Terms of Service
3. Entity structure clarification
4. Insurance evaluation

**Phase 0 (parallel with development):**
5. Comprehensive legal documentation
6. Privacy infrastructure
7. Accessibility documentation
8. AI disclosures

**Phase 1-3 (before public launch):**
9. Crisis resource system
10. Medical disclaimers
11. Content moderation framework
12. International compliance review

**Phase 4+ (operational maturity):**
13. VLD agreements
14. Platform governance
15. Ongoing regulatory monitoring

The portal's mission is noble, its architecture is thoughtful, and its ethical framework is strong. But legal liability doesn't respect good intentions. These proposed changes would transform potential vulnerabilities into documented, defensible positions, protecting both the teachings and those who serve them.