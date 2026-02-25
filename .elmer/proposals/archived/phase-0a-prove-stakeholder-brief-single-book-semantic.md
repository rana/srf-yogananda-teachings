<!-- elmer:archive
  id: phase-0a-prove-stakeholder-brief-single-book-semantic
  topic: Phase 0a: Prove — Stakeholder Brief. Single-book semantic search proof with Autobiography of a Yogi. Covers: ingestion pipeline, hybrid search API, search UI, book reader, quality evaluation. Key SRF decisions: edition confirmation, PDF source, search quality threshold.
  archetype: retrospective-brief
  model: opus
  status: approved
  archived: 2026-02-24 03:00 UTC
-->

# Phase 0a: Prove — Stakeholder Brief
## Single-Book Semantic Search Proof of Concept

**Document Date:** February 23, 2026
**Phase:** 0a (Prove)
**Duration:** 2–3 weeks
**Focus Book:** Autobiography of a Yogi

---

## Executive Summary

Phase 0a answers one existential question: **Does semantic search work across Paramahansa Yogananda's text?**

This phase delivers the minimum vertical slice of the portal — a working semantic search over *Autobiography of a Yogi* that returns high-quality, relevant, verbatim passages with accurate citations. We will ingest one book, build hybrid search (vector + keyword), create a basic reader, and prove that seekers can find meaningful passages when they ask spiritual questions.

Everything else — the AI librarian enhancements, multi-book expansion, visual polish, editorial tools — waits until we prove this core capability works.

### Key Outcomes

1. **Working semantic search** — A seeker types "How do I overcome fear?" and receives 3–5 relevant Yogananda quotes with accurate book/chapter/page citations
2. **Quality threshold met** — ≥80% of test queries return at least one relevant passage in top 3 results
3. **Technical foundation proven** — PostgreSQL + pgvector + pg_search delivers sub-2-second hybrid search
4. **Zero AI-generated content** — Every displayed word is Yogananda's verbatim text with citation

---

## Critical SRF Decisions Required

Before any code is written, we need two specific decisions from SRF:

### 1. Edition Confirmation (Blocks All Citations)

**Question:** Which edition of *Autobiography of a Yogi* is the canonical page-number reference?

- 1946 first edition
- 1998 13th edition
- Current printing

**Why this matters:** Every citation in the portal depends on this decision. Deep links, page references, and "Read in context" features all require knowing which physical book we're referencing.

**Recommendation:** Use the current SRF printing that seekers can purchase today from the SRF Bookstore.

### 2. PDF Source Confirmation

**Question:** Which PDF should we use for ingestion?

**Why this matters:** Text extraction quality depends on having a clean, well-formatted PDF. OCR errors compound through the entire system.

**Recommendation:** Request the official PDF from the SRF AE (Audio Engineering) team that was used for the SRF app or ebook production.

---

## Technical Approach

### What We're Building

```
User Query → Hybrid Search → Ranked Passages → Read in Context
     ↓             ↓                ↓                 ↓
"overcome    Vector (semantic)  Top verbatim    Link to exact
  fear"     + BM25 (keyword)     quotes         chapter/page
             = Best of both      with citations
```

### Architecture (Deliberately Minimal)

- **Frontend:** Next.js running locally (no deployment yet)
- **Database:** Neon PostgreSQL with pgvector and pg_search extensions
- **Search:** Pure hybrid retrieval — no AI in the search path
- **AI Usage:** Only offline for ingestion QA and search quality evaluation

### Key Technical Decisions

1. **Paragraph-based chunking** — Preserves Yogananda's complete thoughts (100–500 tokens)
2. **Voyage embeddings** — Multilingual model (1024 dimensions) ready for Phase 10 translations
3. **Reciprocal Rank Fusion** — Combines vector and keyword search mathematically
4. **No query expansion yet** — Pure retrieval first, AI enhancements in Phase 0b

---

## Deliverables

### Prerequisites (Conversations, Not Code)

1. ✓ Edition confirmation from SRF
2. ✓ PDF source confirmation from SRF AE team

### Eight Core Deliverables

| # | Deliverable | Success Criteria |
|---|-------------|------------------|
| **0a.1** | **Repository setup** | `pnpm dev` starts working Next.js app |
| **0a.2** | **Database schema** | All tables created with proper indexes, pgvector + pg_search enabled |
| **0a.3** | **PDF ingestion** | Autobiography text extracted, chunked, embedded, stored |
| **0a.4** | **Human QA** | Ingested text reviewed for OCR errors, formatting issues |
| **0a.5** | **Search API** | `/api/v1/search` returns ranked passages with citations |
| **0a.6** | **Search UI** | Query bar, results display, "Read in context" links |
| **0a.7** | **Book reader** | Chapter navigation, optimal typography, SRF Bookstore links |
| **0a.8** | **Quality evaluation** | ≥80% of 50 test queries return relevant results |

---

## Quality Evaluation Framework

### Test Query Categories

We will evaluate 50 queries across these categories:

1. **Conceptual** — "How do I find inner peace?"
2. **Topical** — "What did Yogananda say about meditation?"
3. **Keyword** — "divine mother"
4. **Narrative** — "Meeting with Gandhi"
5. **Sanskrit terms** — "samadhi"
6. **Emotional/situational** — "I'm grieving"

### Success Metric

**≥80% of queries must return at least one relevant passage in the top 3 results**

### Evaluation Process

1. Human curators create golden query set with expected passages
2. System runs queries through hybrid search
3. Claude evaluates whether results match expectations
4. Human review validates Claude's assessment

---

## Risk Mitigation

### If Search Quality Fails (<80% Threshold)

We have four contingency plans ready:

1. **Adjust chunking** — Test 200, 300, 500 token sizes
2. **Try different embedding model** — Cohere, BGE-M3, or E5
3. **Tune RRF parameters** — Adjust k-constant and vector/keyword weights
4. **Manual curation bridge** — Tag common queries with expected passages

### Other Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Poor OCR quality | Search failures | Manual review + correction |
| Sanskrit diacritics lost | Terms not found | Special handling in ingestion |
| Long passages truncated | Incomplete thoughts | Paragraph boundary detection |
| Poetry formatting lost | Poor readability | Preserve line breaks in chunks |

---

## Timeline

### Week 1: Foundation
- Days 1–2: Repository setup, database schema
- Days 3–4: PDF ingestion pipeline
- Day 5: Human QA of ingested text

### Week 2: Search & Read
- Days 6–7: Search API with hybrid retrieval
- Days 8–9: Search UI and book reader
- Day 10: Initial testing and refinement

### Week 3: Evaluation
- Days 11–12: Create 50-query golden set
- Days 13–14: Run evaluation suite
- Day 15: Document results, prepare Phase 0b

---

## Resource Requirements

### Human Resources
- **Principal:** Strategic decisions, SRF coordination
- **AI (Claude):** Implementation, testing, evaluation
- **Reviewer:** 4–6 hours for ingested text QA

### Technical Resources
- **Neon:** Free tier (sufficient for single book)
- **Embeddings:** ~$0.30 one-time cost
- **Claude API:** ~$5–10 for enrichment
- **Total Phase Cost:** <$15

---

## Success Criteria Summary

✓ **Technical Success**
- Hybrid search returns results in <2 seconds
- Deep links navigate to correct passages
- Zero errors in production logs

✓ **Quality Success**
- ≥80% search quality threshold met
- No AI-generated content in results
- All passages include accurate citations

✓ **Stakeholder Success**
- SRF can see Yogananda's actual words being surfaced
- Search results feel spiritually relevant
- Clear path to Phase 0b visible

---

## What Happens Next (Phase 0b)

Once Phase 0a proves semantic search works, Phase 0b adds:

- **AI librarian layer** — Query expansion, intent classification, passage ranking
- **Deployment to Vercel** — Public URL for stakeholder review
- **Homepage** — "Today's Wisdom" with random passages
- **Search suggestions** — Autocomplete and zero-state chips
- **Observability** — Error tracking, structured logging, health checks

Phase 0b transforms the local proof into a deployed, observable, AI-enhanced portal ready for multi-book expansion in Phase 1.

---

## Open Questions for SRF

Beyond the two critical decisions (edition and PDF source), we have additional questions that don't block Phase 0a but need answers soon:

### Content Questions
1. Which books have official translations in which languages?
2. Does *God Talks with Arjuna* display Devanagari verses? Preferred typeface?
3. Copyright/licensing: Read-online only, or downloadable/printable?

### Editorial Questions
1. Does SRF have existing brand voice guidelines?
2. Preferred transliterations: "Babaji" vs "Bābājī"?
3. Who reviews AI-drafted UI translations?

### Technical Questions
1. Optimal chunk size for Yogananda's prose style?
2. Single authoritative edition per book, or acknowledge variants?
3. Should Phase 0a explicitly validate tunable parameters?

---

## Conclusion

Phase 0a is deliberately minimal — eight deliverables answering one question: Does semantic search work?

The architecture is proven (PostgreSQL + vectors), the approach is sound (hybrid search), and the scope is achievable (one book, two weeks). We're not building the complete portal yet — just proving the foundation is solid.

With SRF's edition and PDF decisions, we can begin immediately. The portal's success rests on getting search right, and Phase 0a proves we can deliver exactly what seekers need: Yogananda's verbatim words, accurately cited, spiritually relevant.

**Next Step:** Confirm the edition and PDF source, then begin implementation.

---

*This proposal is part of the SRF Online Teachings Portal project, funded by a British philanthropist to make Paramahansa Yogananda's teachings freely available worldwide.*