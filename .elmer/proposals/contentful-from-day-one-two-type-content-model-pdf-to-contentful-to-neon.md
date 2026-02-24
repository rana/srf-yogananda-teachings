# Contentful from Day One: Two-Type Content Model, PDF → Contentful → Neon

## Summary

Move Contentful from Phase 9 to Phase 0. The portal's content source of truth becomes Contentful from the first day of implementation, not after eight phases of PDF-direct ingestion. The Autobiography PDF is imported *into* Contentful first, then the search pipeline reads *from* Contentful. This eliminates a planned Phase 9 migration, populates `contentful_id` columns from day one, and gives QA reviewers Contentful's editor UI instead of a CLI pager.

The content model is deliberately minimal: two content types (Book, Chapter) with room to grow. All future content types (Section, Person, Verse, TextBlock) can be added without touching the Phase 0 model. The ingestion pipeline splits into two stages: a one-time PDF → Contentful import (using `marker`), and a repeatable Contentful → Neon pipeline (pure TypeScript, no Python dependency at runtime).

## Context

### The Assumption That Changed

The existing architecture (ADR-010, DES-005, Phase 9 in ROADMAP.md) assumes books enter the portal through PDFs in Phases 0–8, with Contentful deferred to Phase 9 as a "production editorial source of truth." This was reasonable when we assumed no Contentful access existed.

New information: SRF's books are already in Contentful. SRF is on their highest Contentful tier. We will create our own Contentful space for Phase 0 development with full access, design the content model ourselves, and adapt when SRF grants access to their space later.

### What This Means

The PDF is still the Phase 0 *initial source* (Autobiography of a Yogi from spiritmaji.com — a digital PDF, not requiring OCR). But instead of going directly to Neon, it goes through Contentful as a structured intermediate layer. All subsequent reads — for search indexing, for the book reader, for webhook-driven updates — come from Contentful.

The flow changes from:
```
PDF → marker → Neon (Phases 0–8)
Contentful → webhook → Neon (Phase 9+)
```

To:
```
PDF → marker → Contentful (one-time import per book)
Contentful → batch/webhook → Neon (from Phase 0)
```

## Content Model

### Design Principles

1. **The editorial unit is the chapter.** Editors read and revise at chapter scope. Paragraph-level extraction is the chunking pipeline's job — derived data, not editorial structure.
2. **Two content types for Phase 0.** Book and Chapter. The existing four-type model (Book/Chapter/Section/TextBlock in DES-004) is deferred complexity. Section and TextBlock can be added when books with formal subsections arrive (Phase 3+) or when editors need paragraph-level control (Phase 9+ editorial workflows).
3. **Rich Text body with AST-level structure.** Contentful Rich Text stores each paragraph as a discrete `paragraph` node in a JSON document tree. The chunking pipeline walks this tree — no regex parsing, no Markdown heuristics.
4. **Extensible without migration.** Every future content type (Section, Person, Verse) can be added without modifying Book or Chapter. Fields like `author` (Short Text now, Reference later) can be changed via Contentful's content model editor.

### Content Type: Book

```
Content Type: Book
├── title           (Short Text, required, localized)
├── subtitle        (Short Text, localized)
├── slug            (Short Text, unique, required)        — URL: /books/{slug}
├── author          (Short Text, default: "Paramahansa Yogananda")
├── edition         (Short Text)                          — "13th Edition", "1946 Original"
├── editionYear     (Integer)
├── publicationYear (Integer)
├── isbn            (Short Text)
├── coverImage      (Media, localized)
├── description     (Rich Text, localized)                — synopsis/blurb
├── bookstoreUrl    (Short Text)                          — SRF Bookstore link
├── language        (Short Text, default: "en")
├── contentFormat   (Short Text, default: "prose")        — prose | chant | poetry (ADR-059)
├── sortOrder       (Integer)                             — display ordering in library
└── status          (Short Text, default: "draft")        — draft | review | published
```

No `chapters` reference field. Chapters reference their parent Book; queries fetch chapters by book reference. Bidirectional references create sync overhead with no benefit.

`author` is Short Text, not a Reference, because the People Library (ADR-036) is Phase 4+. When it arrives, this field becomes a Reference. No unused content types.

### Content Type: Chapter

```
Content Type: Chapter
├── title           (Short Text, required, localized)
├── slug            (Short Text, required)                — URL: /books/{book.slug}/{slug}
├── chapterNumber   (Integer, required)
├── book            (Reference → Book, required)
├── body            (Rich Text, required, localized)      — full chapter text
├── epigraph        (Long Text, localized)                — opening quotation
├── epigraphSource  (Short Text, localized)               — attribution
├── sortOrder       (Integer, required)
├── pageMap         (JSON)                                — paragraph → page number mapping
└── contentHash     (Short Text)                          — SHA-256 of body text (ADR-039)
```

**The `body` field** is Contentful Rich Text — a JSON AST:

```json
{
  "nodeType": "document",
  "content": [
    {
      "nodeType": "paragraph",
      "content": [
        { "nodeType": "text", "value": "The characteristic features...", "marks": [] }
      ]
    },
    {
      "nodeType": "heading-2",
      "content": [
        { "nodeType": "text", "value": "A section heading", "marks": [] }
      ]
    }
  ]
}
```

The chunking pipeline walks `content[]`, extracting each `paragraph` node as a candidate chunk. Marks (bold, italic) preserved for display, stripped for embedding. Poetry uses `blockquote` nodes. Section headings use `heading-2`/`heading-3` nodes and become `section_heading` metadata on subsequent chunks.

**The `pageMap` field** maps paragraph positions to physical page numbers:

```json
[
  { "paragraph": 0, "page": 1 },
  { "paragraph": 5, "page": 2 },
  { "paragraph": 12, "page": 3 }
]
```

Meaning: paragraphs 0–4 are on page 1, paragraphs 5–11 are on page 2, etc. The chunking pipeline reads this alongside the body AST to assign page numbers to each chunk.

`pageMap` is JSON (not embedded entries) because page numbers are citation metadata, not editorial content. Invisible in the editor, readable by the pipeline. Correctable without re-importing.

**`epigraph` is Long Text, not Rich Text:** Epigraphs are short quotations. Rich Text adds AST overhead for content that is always plain text. Simpler is better.

### Future Content Types (Not Phase 0)

| Content Type | Purpose | When Added |
|---|---|---|
| **Section** | Named subsections within chapters. For books like *God Talks with Arjuna* with formal structure. Added between Chapter and body text; chapters with sections would have their body split. | Phase 3+ (multi-book corpus) |
| **Person** | Authors, gurus, disciples. Book's `author` becomes a Reference. | Phase 4+ (People Library, ADR-036) |
| **Verse** | Scripture verse + commentary pairs. Atomic units for verse-aware chunking. | Phase 6 (ADR-048 verse-aware strategy) |
| **TextBlock** | Paragraph-level editorial control. Only if editors need to manage individual paragraphs. | Phase 9+ (evaluate need) |

## Ingestion Architecture

### Stage 1: PDF → Contentful (one-time import per book)

```
Step 1: Download PDF
 └── Autobiography of a Yogi (digital PDF, no OCR needed)
 └── Source: spiritmaji.com (interim; replaced by SRF material later)

Step 2: Extract structured text
 └── marker (Python, PDF → Markdown)
 └── Preserves headings, paragraphs, page breaks
 └── Output: chapters as separate Markdown sections

Step 2.5: Unicode NFC Normalization (ADR-080)
 └── Normalize diacritics before any processing

Step 3: Structure for Contentful
 └── Parse Markdown to identify:
     - Chapter boundaries (by heading level)
     - Paragraph boundaries (by blank lines)
     - Page boundaries (from PDF page metadata)
     - Epigraphs (opening quotes before first paragraph)
 └── For each chapter:
     - Convert paragraphs to Contentful Rich Text AST
     - Build pageMap from page boundary positions
     - Extract epigraph text and source

Step 4: Import into Contentful
 └── Create Book entry via Management API
 └── Create Chapter entries via Management API
 └── Publish all entries

Step 5: Human QA in Contentful
 └── Review imported text in Contentful's editor UI
 └── Correct spiritual terminology
 └── Verify chapter/page boundaries
 └── Flag Sanskrit diacritics
 └── NON-NEGOTIABLE for sacred texts
```

`marker` is a one-time migration tool. Once content is in Contentful, `marker` is never needed again for that book.

### Stage 2: Contentful → Neon (repeatable pipeline)

```
Step 1: Fetch content from Contentful CDA
 └── Chapters by book reference, including linked Book metadata

Step 2: Extract text from Rich Text AST
 └── Walk body.content[] — each paragraph node yields text
 └── Headings become section_heading metadata on subsequent chunks
 └── Blockquotes flagged as poetry/epigraph (special chunking rules)

Step 3: Assign page numbers from pageMap

Step 4: Chunk by natural boundaries (ADR-048)
 └── Paragraph-based, 100–500 token range
 └── Poetry/epigraphs as single chunks
 └── No overlap (ADR-048 governs)

Step 5: Language detection (fastText, per-chunk)
Step 6: Entity resolution (ADR-116)
Step 7: Unified enrichment (ADR-115)
Step 8: Generate embeddings (Voyage voyage-3-large, ADR-118)
Step 9: Insert into Neon (contentful_id populated from Chapter entry ID)
Step 10: Compute chunk relations (ADR-050)
Step 11: Update suggestion dictionary (ADR-049)
```

This pipeline is pure TypeScript — no Python at runtime.

### Stage 3: Webhook Sync (Phase 0b or Phase 1)

```
Contentful publish event → Vercel Function
 ├── Fetch updated Chapter from CDA
 ├── Re-extract, re-chunk, re-embed
 ├── Upsert into Neon (matched by contentful_id)
 └── Log sync event
```

Real-time sync for editorial corrections. Batch script (Stage 2) sufficient for Phase 0a.

## Architecture Diagram

Replaces both diagrams in DESIGN.md (Phase 0 PDF-based and Phase 9+ Contentful-based):

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│    EDITORIAL LAYER                 SEARCH LAYER                  │
│    (Source of Truth)               (Derived Index)               │
│                                                                  │
│    ┌──────────────────┐            ┌──────────────────────────┐  │
│    │   Contentful     │   batch    │   Neon PostgreSQL        │  │
│    │                  │──ingest──►│   + pgvector              │  │
│    │   Book           │  (0a)     │                           │  │
│    │   └─ Chapter     │            │   book_chunks             │  │
│    │      (Rich Text  │  webhook  │   (text + embeddings +    │  │
│    │       body +     │──sync───►│    contentful_id)          │  │
│    │       pageMap)   │  (0b/1+)  │                           │  │
│    │                  │            │   Hybrid search:          │  │
│    │   Locales:       │            │   vector + BM25           │  │
│    │   en (Phase 0)   │            │                           │  │
│    │   + others (10+) │            │                           │  │
│    └──────────────────┘            └──────────────────────────┘  │
│            │                               │                     │
│     (book text                      (search results)             │
│      for reader)                                                 │
│            ▼                               ▼                     │
│    ┌──────────────────────────────────────────────────────────┐  │
│    │                    Next.js on Vercel                      │  │
│    │                                                          │  │
│    │  • Book Reader (SSG/ISR from Contentful at build time)   │  │
│    │  • Search UI (queries Neon via API routes)               │  │
│    │  • "Read in context" links to reader pages               │  │
│    └──────────────────────────────────────────────────────────┘  │
│                          │                                       │
│                          ▼                                       │
│    ┌──────────────────────────────────────────────────────────┐  │
│    │                  Supporting Services                      │  │
│    │                                                          │  │
│    │  • Claude API — query expansion + HyDE (Phase 2+)       │  │
│    │  • Cohere Rerank 3.5 — passage reranking (Phase 2+)     │  │
│    │  • Graph batch pipeline — Python + NetworkX (Phase 4+)   │  │
│    └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

One-time import (per book):
 PDF ──► marker ──► Contentful import script ──► Contentful

Repeatable ingestion (batch or webhook):
 Contentful CDA ──► Rich Text → Text ──► Chunking ──► Enrichment
                                        ──► Embeddings ──► Neon
```

## Document Change Manifest

### ADR-010 (DECISIONS-core.md)
- Title: "Contentful as Editorial Source of Truth (from Phase 0)"
- Remove: "Phases 0–8 operate without Contentful"
- Decision: Contentful is the source from Phase 0. PDF ingestion goes through Contentful.
- Consequences: Phase 0 depends on Contentful API access. `contentful_id` populated from day one.

### DES-004 (DESIGN-phase0.md) — Contentful Content Model
- Replace four-type model (Book/Chapter/Section/TextBlock) with two-type model (Book/Chapter)
- Add fields: `pageMap`, `slug`, `contentHash`, `epigraph`, `epigraphSource`, `status`, `contentFormat`
- Note future content types (Section, Person, Verse, TextBlock) with phase targets

### DES-005 (DESIGN-phase0.md) — Content Ingestion Pipeline
- Replace "Phase 0 Pipeline (PDF → Neon)" with two-stage architecture
- Merge "Production Pipeline (Contentful → Neon)" into the main pipeline
- Fix pre-existing inconsistency: DES-005 specifies 1-sentence overlap; ADR-048 says "Overlap: None." ADR-048 governs.

### DESIGN.md — Architecture Diagrams
- Replace both diagrams with single merged diagram
- Remove "Phase 9+" qualifier from Contentful integration
- Remove: "Phases 0–8 use PDF-ingested content in Neon directly"
- Move Contentful MCP from "Phase 9+ (evaluate)" to "Phase 0b (evaluate)"

### ROADMAP.md — Phase 0a
- Prerequisites: Replace "PDF source confirmation" with "Contentful space creation + API access"
- Deliverable 0a.3: Split into 0a.3a (PDF → Contentful import) and 0a.3b (Contentful → Neon ingestion)
- Deliverable 0a.4: Remove OCR flagging; QA focuses on chunk boundaries, formatting, pageMap accuracy
- Technology: Add Contentful CDA; annotate `marker` as one-time import tool

### ROADMAP.md — Phase 9
- Remove Contentful content model, content import, reader migration deliverables (now Phase 0)
- Keep: GitLab migration, regional distribution, Contentful Custom Apps, Cosmic Chants
- Revise success criteria
- Consider rename from "Integrate"

### CONTEXT.md
- Replace spiritmaji.com reference with Contentful source note
- Update "What's next" to reflect Contentful in Phase 0a
- Add open question: "When will SRF grant access to their Contentful space?"

### CLAUDE.md
- Add Contentful to Phase 0 technologies in Quick Reference
- Move Contentful MCP to Phase 0b
- Add `/scripts/import/` to code layout

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Contentful becomes Phase 0 dependency | Low | Read-only CDA has 99.95% SLA. Ingestion is batch. If Contentful down, retry. Neon search index is independent. |
| Content model diverges from SRF's | Medium | Clean model, adapt when SRF access granted. Neon schema unchanged regardless. |
| Page number accuracy from PDF | Low | Digital PDF (no OCR). Human QA verifies. pageMap correctable in Contentful. |
| Free tier limits | None | Autobiography ≈ 50 entries. Free tier allows 10K. Paid tier for multi-book if needed. |
| `marker` extraction quality | Medium | Digital PDF with selectable text. Human QA in Contentful catches issues. |

## What This Enables

1. **Higher fidelity from day one.** Structured content, no OCR artifacts, no "unofficial scans" going directly to search.
2. **`contentful_id` populated immediately.** Every chunk traces to its source entry from the first ingestion.
3. **QA in Contentful's editor.** Reviewers see formatted text in a rich editor, not raw text in a CLI pager.
4. **Locale infrastructure exercised early.** Even with English only, the Contentful locale structure is visible and testable.
5. **Corrections flow naturally.** Update text in Contentful → re-sync → search index updates. No dual-track maintenance.
6. **Phase 9 becomes lighter.** Most Contentful integration work is done. Phase 9 focuses on GitLab migration and regional distribution.
7. **Book reader uses Contentful SSG/ISR from Phase 1.** Reader pages built from Contentful at build time, not from Neon queries.
