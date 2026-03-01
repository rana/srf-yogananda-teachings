## DES-042: Glossary Architecture

The Vocabulary Bridge Layer 2 entries (ADR-129, DES-059) are surfaced as a user-facing glossary. See ADR-038. Sanskrit display and search normalization policy in ADR-080.

### ADR-080: Glossary Schema Extensions

The `glossary_terms` table (defined in ADR-038) gains three optional columns for Sanskrit and spiritual terminology support:

- **`phonetic_guide`** — Simplified pronunciation guide (e.g., "PRAH-nah-YAH-mah" for prāṇāyāma). Editorially written, based on standard Sanskrit phonology. Ships with Milestone 3b glossary.
- **`pronunciation_url`** — URL to an SRF-approved audio pronunciation recording. Nullable; populated when SRF provides recordings (Milestone 5b+). Stakeholder question pending.
- **`has_teaching_distinction`** — Boolean flag for terms where Yogananda's usage intentionally differs from common usage and the difference itself is part of the teaching (e.g., Aum vs. Om, "meditation," "Self-realization"). When true, the glossary UI highlights the distinction as pedagogically significant.

### Glossary API Endpoints

```
GET /api/v1/glossary → All glossary terms (paginated, cursor-based)
 ?language=en — Filter by language
 ?category=sanskrit — Filter by category
 ?q=samadhi — Search within glossary (trigram fuzzy)
 ?has_teaching_distinction=true — Filter to terms with teaching distinctions

GET /api/v1/glossary/{slug} → Single term with definition, Yogananda's explanation passage,
 phonetic guide, and pronunciation URL (if available)
```

### Glossary Page Layout

```
/glossary → Glossary landing
├── Search bar ("Find a term...")
├── Category filter (Sanskrit, Yogic Concepts, Spiritual States, Scriptural, Cosmological, Practice)
├── Alphabetical term list
│ ├── Term + phonetic guide (if available) + brief definition (1-2 sentences)
│ ├── 🔊 Pronunciation (if audio available — Milestone 5b+)
│ ├── "Yogananda's explanation →" link to source passage
│ ├── ⚡ Teaching distinction callout (if has_teaching_distinction)
│ │ └── "Yogananda's usage differs from common usage..." with explanation
│ └── Related theme links
└── Inline reader integration (opt-in via reader settings: "Show glossary terms")
 └── Dotted underline on recognized terms → tooltip with definition
```

---
