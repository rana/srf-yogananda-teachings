# SRF Online Teachings Portal — Future Open Questions

These are genuine open questions parked until their arc approaches. Triaged from CONTEXT.md during documentation crystallization (2026-02-23). Each question links to the ADR or design section that governs it.

When an arc enters active planning, move its questions back to CONTEXT.md § Open Questions for resolution.

---

## Milestone 3b+ (Editorial)

### Stakeholder
- [ ] Extreme-context access and institutional intermediaries: lighter-weight surfaces for hospitals, prisons, hospices, refugee camps? Institutional intermediary persona (chaplain, volunteer, hospice worker) accessing on behalf of seekers who cannot browse freely. If SRF affirms institutional access as in-scope, needs design attention by Milestone 3b. (ADR-006, ADR-071, DES-011, ADR-067)

---

## Milestone 3d+ (Complete)

### Stakeholder
- [ ] Does the philanthropist's foundation want to publish "What Is Humanity Seeking?" as a standalone annual communications asset? Communications planning should begin before Milestone 3d dashboard ships. (ADR-090)
- [ ] Annual impact report format — PDF, web page, or both? Published by SRF or the foundation? (ADR-090)
- [ ] How does SRF frame impact for the foundation when the most meaningful outcomes are unmeasurable? Is the "What Is Humanity Seeking?" narrative sufficient, or are conventional reach metrics required? (ADR-090)
- [ ] Philanthropist's foundation operational visibility: editorial pipeline health or only impact metrics? (ADR-090, ADR-082)

---

## Milestone 5a+ (Distribution)

### Stakeholder
- [ ] Does SRF want Yogananda's teachings accessible to external AI assistants (ChatGPT, Claude, Gemini) via MCP? Distribution channel or risk to sacred text fidelity? Presentation constraints for AI consumers? Open, registered, or restricted access? (ADR-101, ADR-001, ADR-026, ADR-081)
- [ ] MCP and the SRF mobile app: should the app access portal content via MCP tools alongside HTTP API routes? (ADR-101, ADR-011)
- [ ] Sacred text in AI context: external AI may juxtapose Yogananda's words with other traditions. Interfaith enrichment or inappropriate decontextualization? (ADR-101, ADR-001)
- [ ] MCP copyright implications: "freely accessible on the portal" vs. "freely redistributable through any AI assistant worldwide." Legal and stakeholder question. (ADR-101, ADR-081, ADR-099)

---

## Arc 4 (Service)

### Technical
- [ ] GitLab migration plan: CI/CD pipeline rewrite (GitHub Actions → GitLab CI), Terraform state backend migration, developer workflow change. Deserves an ADR before Arc 4 planning. (ADR-016, ADR-018, ADR-017)

---

## Milestone 5b+ (Languages)

### Technical
- [ ] Voyage voyage-3-large vs. voyage-multilingual-2 for CJK-heavy text: benchmark when CJK content exists. (ADR-118)
- [ ] Multilingual embedding quality evaluation: benchmark Voyage against Cohere embed-v3, BGE-M3 using actual translated passages. (ADR-047, ADR-118)
- [ ] Domain-adapted embeddings research: fine-tune multilingual base model on Yogananda's corpus. Requires multilingual corpus and per-language evaluation suites. (ADR-047)
- [ ] Transliteration support for Indic script search suggestions: Romanized input ("samadhi" not "समाधि"), CJK substring matching. (ADR-049, Milestone 5b)
- [ ] pgvector HNSW tuning at multilingual scale: ~400K chunks × 1024 dimensions. Document tuning strategy and Neon compute scaling threshold. (ADR-009, ADR-046, ADR-047)
- [ ] Mixed-script embedding quality for Gita commentary: validate excluding Devanāgarī from embedding input doesn't degrade verse-specific retrieval. (ADR-080, ADR-048, ADR-046)

### Stakeholder
- [ ] Hindi/Bengali/Thai audio-first pilot: can SRF provide Yogananda voice recordings alongside the text launch? Deferring all audio to Arc 6 creates a cultural equity gap for oral-tradition populations. (ADR-026, ADR-057, ADR-006)
- [ ] YSS photographic archives of Indian biographical sites (Gorakhpur, Serampore, Ranchi, Dakshineswar) for Sacred Places. (DES-023, ADR-069)
- [ ] India's DPDPA cross-border transfer provisions: monitor as Milestone 5b Hindi/Bengali approaches. (ADR-099, ADR-077)
- [ ] Thailand's PDPA compliance: verify data handling for Thai locale. (ADR-099, ADR-077)
- [ ] Brazil LGPD Data Protection Officer requirement for Portuguese-language content. (ADR-099)

---

## Arc 6+ (Media)

### Technical
- [ ] Cloudflare R2 vs S3 for media assets: zero egress fees matter for free portal serving audio globally over 10 years. (ADR-057, ADR-004)
- [ ] Chant-to-recording catalog: does SRF maintain a mapping between chants and recordings? Data import vs. Arc 6 curation task. (ADR-059, ADR-057)

### Stakeholder
- [ ] Sanskrit term pronunciation recordings: approved audio for key terms (samadhi, pranayama, Kriya Yoga, Aum)? Glossary schema reserves `pronunciation_url`. (ADR-080, ADR-038)

---

## Arc 7 (Community)

### Stakeholder
- [ ] Does the teaching portal get its own mobile app, or integrate into the SRF/YSS app? (ADR-011)
- [ ] Can SRF provide center location data for "Meditation Near Me" feature? (Milestone 7b)
- [ ] Community curation governance: who reviews community collections? Theological boundaries for collection approval? Disclaimer text? (ADR-086)
- [ ] VLD portal roles: `vld` Auth0 role? Who manages assignment? Can curation count toward service hours? (ADR-087)
- [ ] Community collection attribution: curator names or anonymous by default? Ego dynamics vs. accountability. (ADR-086)
- [ ] Community curation vs. official SRF publications: complementary or competing? Visual distinction from Editorial Reading Threads? (ADR-086, DES-026)
- [ ] VLD coordinator role: same as portal coordinator or separate? (ADR-087)
- [ ] VLD service reporting: participation reports vs. no-gamification principle. (ADR-087, ADR-095)
- [ ] VLD expansion beyond curation: translation review, theme tag review, feedback triage? (ADR-087, ADR-082)
- [ ] Existing VLD digital tooling integration. (ADR-087)
