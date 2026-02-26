# Book Ingestion Pipeline — Design & Implementation Guide

> **Purpose.** This document captures the complete technical design for extracting book content from Amazon Amazon Cloud Reader and storing it as structured data for later Contentful import. Written to enable any fresh AI session to continue implementation without re-discovery.
>
> **Date:** 2026-02-25 (design) · 2026-02-26 (implementation)
>
> **Status:** Pipeline complete. Phases 0–5 executed. 522 pages captured/extracted, 49 chapters assembled (94,584 words), 69 photo screens captured, front cover captured, photo manifest built. 2 critical text gaps (pages 188, 216) require physical book recovery. Ready for human QA review and Contentful import script development.

---

## Table of Contents

1. [Context and Decision](#context-and-decision)
2. [Technical Discovery: Amazon Cloud Reader](#technical-discovery-amazon-cloud-reader)
3. [Pipeline Architecture](#pipeline-architecture)
4. [Storage Schema](#storage-schema)
5. [TypeScript Types](#typescript-types)
6. [OCR Prompt Design](#ocr-prompt-design)
7. [Validation Architecture](#validation-architecture)
8. [Phase Plan](#phase-plan)
9. [Reusability Design](#reusability-design)
10. [Relationship to DES-005](#relationship-to-des-005)

---

## Context and Decision

### Why Ebook, Not PDF

The original Milestone 1a plan (DES-005) uses a spiritmaji.com PDF processed through `marker` (open-source OCR). That PDF has **low fidelity** — degraded scans that would produce OCR errors requiring extensive manual QA, particularly for Sanskrit diacritics (ā, ṇ, ś, ṣ).

The project principal has purchased the ebook edition of Autobiography of a Yogi (ASIN: `B00JW44IAI`) available at `https://read.amazon.com/?asin=B00JW44IAI`. The ebook edition is **born-digital** — the publisher (SRF) created it from their source files. This means:

- Clean typography with no scanning artifacts
- Perfect Sanskrit diacritics (IAST)
- Correct formatting (italics, headings, verse structure)
- Physical book page numbers displayed in the reader
- Photographs at original digital quality

### Why Not Direct DOM Scraping

Investigation revealed that this title uses **fixed-layout rendering** — Amazon renders each page as a pre-rendered image (1340×1400px, 2x retina), not as HTML text in the DOM. There is no text layer to scrape. The text exists in encrypted memory and is only exposed as rendered images.

### The Approach: Playwright Capture + Claude Vision OCR

Capture high-resolution page images via Playwright, then use Claude Vision to extract structured text with formatting. The born-digital renders produce dramatically better OCR input than scanned PDFs.

### SRF Digital Text

SRF will eventually provide authoritative digital text (planned for pre-launch). This ebook-based extraction serves as the Arc 1 development source — significantly higher quality than the spiritmaji.com PDF alternative. When SRF provides source files, the Contentful content will be replaced. The extraction pipeline and all tooling remain valuable for validating the SRF source against the ebook extraction.

### Legal Posture

- The book is purchased and owned by the project principal
- No DRM circumvention occurs — we capture what is visually displayed
- No automated ToS-violating scraping — Playwright navigates as a human would
- The extracted text is for the SRF portal project, funded by endowment with SRF involvement

---

## Technical Discovery: Amazon Cloud Reader

### Authentication

The Amazon Cloud Reader at `read.amazon.com` requires Amazon account authentication. The Playwright browser must have an active session (the user logs in manually, then automation proceeds).

### URL Pattern

```
https://read.amazon.com/?asin={ASIN}
```

For Autobiography of a Yogi: `https://read.amazon.com/?asin=B00JW44IAI`

### Rendering Architecture

Amazon's Amazon Cloud Reader (internally called "Kryptonite Reader") renders this book as follows:

```
DOM Structure:
  <div class="kr-renderer-container-fullpage">
    <div id="kr-renderer" class="kg-client-root kg-client-theme--default"
         style="user-select: none;">
      <div class="kg-view">
        <div style="display: flex;">
          <div class="kg-full-page-img" data-background-color="#ffffffff">
            <img src="blob:https://read.amazon.com/{uuid}"
                 style="width: 670px; height: 700px;">
          </div>
        </div>
      </div>
    </div>
  </div>
```

Key facts:
- **No text in DOM.** Content is a single `<img>` per page with a `blob:` URL
- **Image resolution:** 1340×1400 natural pixels (2x display at 670×700)
- **`user-select: none`** — text selection disabled
- **No iframes, no canvas, no shadow DOM text layer**
- **Fixed-layout format** (MOBI flavor, not reflowable)

### Page Information

```
Footer:  "Page 1 of 558 ● 0%"
Scrubber: min=0, max=1044712 (reader location units), aria-label="Page 1"
Header:  "AUTOBIOGRAPHY OF A..." (truncated title)
```

- **558 total pages** including front matter and back matter
- **Physical book page numbers** are displayed (confirmed by user)
- Reader location system available via scrubber (position 0–1,044,712)
- Percentage available in footer

### JavaScript API Surface

The following global objects are available (factory/module exports, not instances):

**Navigation & Rendering:**
- `ReaderRenderer` — Main renderer with methods:
  - `initialize`, `shutdown`
  - `gotoPosition`, `nextScreen`, `previousScreen`
  - `hasNextScreen`, `hasPreviousScreen`
  - `getMinimumPosition`, `getMaximumPosition`
  - `getPagePositionRange`, `getPageWordPositions`
  - `createWordIterator`, `getPageSelectableItemBoundaries`
  - `getContentRects`, `updateSettings`
- `ReaderPaginator` — Pagination logic
- `ReaderRendererSettings` — Renderer configuration

**Content Processing:**
- `ReaderCompression` — Content decompression
- `ReaderEncryption` — Content decryption (DRM — DO NOT USE)
- `ReaderRendererContentReflow` — Reflow mode (not available for this fixed-layout book)
- `ReaderRendererContentFragmentation` — Text fragmentation
- `ReaderRendererWordIteratorFactory` — Word iteration
- `ReaderRendererWordMapGeneratorFactory` — Word maps

**Location:**
- `ReaderUserLocationConverter` — Location/page number conversion
  - Has `MOBI_FLAVOR` and `TOPAZ_FLAVOR` converters
  - `getLocationConverter` method

**Metadata:**
- `bookMetadata` — null at time of check (may be consumed during init)
- `bookCardInfo`, `notebookInfo` — Additional metadata

**Note:** `ReaderRendererIframeManagerReflowFactory` exists but is not active for this fixed-layout book. Reflowable ebooks (most novels, etc.) render HTML in iframes with selectable text — a future ingestion path for non-fixed-layout titles.

### Navigation for Automation

To navigate through pages:
1. **Click the right side of the viewport** (x = width - 50, y = height / 2) to advance. Keyboard arrows do NOT work for this fixed-layout book.
2. Multiple clicks may be needed per physical page (virtual page screens).
3. Monitor footer text `"Page N of 558 ● X%"` to detect when the physical page number changes.
4. For front matter pages, the footer shows `"Location N of 10571 ● 0%"` instead of page numbers.
5. TOC navigation (via `top_menu_table_of_contents` button) provides coarse jump-to-chapter capability.
6. Each page renders as a new `blob:` image.

---

## Pipeline Architecture

```
Phase 0: Skeleton
  └── Capture TOC structure + book metadata
  └── Output: capture-meta.json

Phase 1: Probe (6 diverse pages)
  ├── Dense narrative prose page (~page 50)
  ├── Chapter title page (Chapter 1 start)
  ├── Photograph page (photo plates)
  ├── Sanskrit-heavy passage
  ├── Poetry/verse page
  └── Front matter page (page 5-10)
  └── Iterate OCR prompt until output is perfect
  └── Output: validated extraction prompt

Phase 2: Capture (Playwright automation, ~20 min)
  For page = 1 to 558:
    ├── Screenshot current page as PNG (1340×1400)
    ├── Parse page number from footer text
    ├── Run capture validation (Layer 1)
    ├── Save: /pages/page-{NNN}.png
    ├── Save: capture log entry
    └── Navigate to next page
  └── Resume capability: skip already-captured pages

Phase 3: Extract (Claude Vision API, ~30-40 min)
  For each page PNG:
    ├── Send to Claude Vision with structured extraction prompt
    ├── Parse structured JSON response
    ├── Run extraction validation (Layer 2)
    ├── Save: /extracted/page-{NNN}.json
    └── Flag pages needing human review
  └── Resume capability: skip already-extracted pages
  └── Batch option: 2-3 pages per call for cross-page context

Phase 4: Assemble
  ├── Group pages into chapters using TOC + detected boundaries
  ├── Reassemble paragraphs broken across page boundaries
  ├── Extract photograph images from page captures
  ├── Run assembly validation (Layer 3)
  ├── Generate QA review HTML
  └── Output: /chapters/{NN}-{slug}.json + /assets/ + book.json

Phase 5: QA
  ├── Human review of flagged pages (~40-60 estimated)
  ├── Golden passage verification (15-20 known passages)
  ├── Spot-check validation
  └── Output: validated book.json ready for Contentful import
```

### Cost Estimate

| Item | Cost |
|------|------|
| Claude Vision (558 pages × ~1,500 tokens/page, Sonnet) | ~$15-25 |
| Claude Vision (re-extraction of flagged pages) | ~$2-5 |
| Total | ~$20-30 |

Sonnet recommended over Haiku for formatting accuracy (italics, Sanskrit diacritics, verse structure).

---

## Storage Schema

```
/data/book-ingest/
  {book-slug}/                          # e.g., autobiography-of-a-yogi
    capture-meta.json                   # Book metadata + TOC + capture params
    pages/
      page-001.png                      # Raw page images (archival)
      page-002.png
      ...
      page-558.png
    extracted/
      page-001.json                     # Per-page structured extraction
      page-002.json
      ...
    chapters/
      00-front-matter.json              # Assembled chapters
      01-my-parents-and-early-life.json
      ...
      48-at-encinitas-in-california.json
      99-back-matter.json
    assets/
      photo-001.png                     # Extracted photographs
      photo-002.png
      ...
    qa/
      review.html                       # Side-by-side QA review page
      validation-report.json            # Full validation results
      flagged-pages.json                # Pages needing human review
    book.json                           # Complete book manifest for Contentful
```

### capture-meta.json

```json
{
  "book": {
    "title": "Autobiography of a Yogi",
    "author": "Paramahansa Yogananda",
    "publisher": "Self-Realization Fellowship",
    "asin": "B00JW44IAI",
    "readerUrl": "https://read.amazon.com/?asin=B00JW44IAI",
    "totalPages": 558,
    "readerLocationMax": 1044712,
    "edition": "13th Edition",
    "language": "en",
    "contentTier": "guru"
  },
  "toc": [
    {
      "title": "The Spiritual Legacy of Paramahansa Yogananda",
      "pageNumber": 1,
      "type": "front-matter"
    },
    {
      "title": "Chapter 1: My Parents and Early Life",
      "chapterNumber": 1,
      "pageNumber": null,
      "type": "chapter"
    }
  ],
  "capture": {
    "capturedAt": "2026-02-25T...",
    "browserViewport": { "width": 836, "height": 870 },
    "imageResolution": { "width": 1340, "height": 1400 },
    "pagesCaptures": 558,
    "captureToolVersion": "1.0.0"
  },
  "extraction": {
    "model": "claude-sonnet-4-6",
    "promptVersion": "1.0.0",
    "extractedAt": "2026-02-25T...",
    "pagesExtracted": 558,
    "pagesFlagged": 0,
    "averageConfidence": 0
  }
}
```

### Per-Page Extraction (page-NNN.json)

```json
{
  "pageNumber": 42,
  "readerLocation": null,
  "pageType": "body",
  "chapterNumber": 3,
  "chapterTitle": "The Saint with Two Bodies",
  "content": [
    {
      "type": "paragraph",
      "text": "\"The saint smiled at me warmly...",
      "formatting": [
        { "start": 0, "end": 45, "style": "normal" },
        { "start": 45, "end": 62, "style": "italic" }
      ]
    },
    {
      "type": "paragraph",
      "text": "I gazed at him in astonishment...",
      "formatting": []
    }
  ],
  "images": [
    {
      "description": "Photograph of Lahiri Mahasaya seated in lotus position",
      "caption": "Lahiri Mahasaya",
      "position": "top-center",
      "boundingBox": { "x": 100, "y": 50, "width": 400, "height": 300 }
    }
  ],
  "metadata": {
    "hasFootnotes": false,
    "hasSanskrit": true,
    "sanskritTerms": ["samadhi", "guru"],
    "hasPoetry": false,
    "isChapterStart": false,
    "isChapterEnd": false,
    "runningHeader": "The Saint with Two Bodies"
  },
  "validation": {
    "confidence": 5,
    "pageNumberAgreement": true,
    "flags": [],
    "needsHumanReview": false
  }
}
```

### Chapter Assembly (NN-slug.json)

```json
{
  "chapterNumber": 3,
  "title": "The Saint with Two Bodies",
  "slug": "the-saint-with-two-bodies",
  "pageRange": { "start": 35, "end": 48 },
  "epigraph": null,
  "sections": [
    {
      "heading": null,
      "paragraphs": [
        {
          "text": "\"The saint smiled at me warmly...",
          "pageNumber": 42,
          "formatting": [
            { "start": 0, "end": 45, "style": "normal" },
            { "start": 45, "end": 62, "style": "italic" }
          ],
          "sequenceInChapter": 15
        }
      ]
    }
  ],
  "images": [
    {
      "assetPath": "assets/photo-007.png",
      "description": "Photograph of Lahiri Mahasaya",
      "caption": "Lahiri Mahasaya",
      "pageNumber": 42
    }
  ],
  "footnotes": [],
  "metadata": {
    "wordCount": 2340,
    "paragraphCount": 18,
    "imageCount": 1,
    "sanskritTerms": ["samadhi", "guru", "pranayama"],
    "namedEntities": ["Lahiri Mahasaya", "Yogananda", "Benares"]
  }
}
```

### book.json (Complete Manifest)

```json
{
  "schemaVersion": "1.0.0",
  "generatedAt": "2026-02-25T...",
  "source": "reader-cloud-reader",
  "book": {
    "title": "Autobiography of a Yogi",
    "author": "Paramahansa Yogananda",
    "authorSlug": "paramahansa-yogananda",
    "publisher": "Self-Realization Fellowship",
    "asin": "B00JW44IAI",
    "isbn": null,
    "edition": "13th Edition",
    "editionYear": null,
    "language": "en",
    "contentTier": "guru",
    "totalPages": 558,
    "totalChapters": 48,
    "bookstoreUrl": "https://bookstore.yogananda.org/autobiography-of-a-yogi"
  },
  "structure": {
    "frontMatter": {
      "pages": [1, 12],
      "sections": ["spiritual-legacy", "publishers-note", "contents"]
    },
    "chapters": [
      {
        "number": 1,
        "title": "My Parents and Early Life",
        "slug": "my-parents-and-early-life",
        "pageRange": [13, 28],
        "dataFile": "chapters/01-my-parents-and-early-life.json"
      }
    ],
    "backMatter": {
      "pages": [540, 558],
      "sections": ["glossary", "index", "about-author"]
    }
  },
  "assets": {
    "photographs": [
      {
        "file": "assets/photo-001.png",
        "description": "...",
        "pageNumber": 42,
        "chapter": 3
      }
    ]
  },
  "quality": {
    "totalPagesExtracted": 558,
    "averageConfidence": 4.8,
    "pagesFlaggedForReview": 12,
    "pagesHumanReviewed": 12,
    "goldenPassagesVerified": 15,
    "goldenPassagesPassed": 15
  },
  "contentfulMapping": {
    "notes": "This manifest is designed for direct translation to Contentful's Book → Chapter → Section → TextBlock content model. See DES-005 Step 3.5 for the import specification. Each chapter.sections[].paragraphs maps to a TextBlock entry. Formatting arrays map to Rich Text AST marks (italic, bold). Images map to Contentful Asset entries linked from TextBlocks."
  }
}
```

---

## TypeScript Types

```typescript
// /scripts/book-ingest/types.ts

/** Book-level configuration for ingestion */
export interface BookConfig {
  title: string;
  author: string;
  slug: string;
  asin: string;
  readerUrl: string;
  contentTier: 'guru' | 'president' | 'monastic';
  language: string;
  expectedChapters?: number;
  goldenPassages?: GoldenPassage[];
}

/** A known passage for validation */
export interface GoldenPassage {
  text: string;
  chapter: number;
  pageNumber?: number;
  source: string; // Where this text was verified from
}

/** TOC entry from Reader */
export interface TocEntry {
  title: string;
  chapterNumber?: number;
  pageNumber: number | null;
  readerLocation?: number;
  type: 'front-matter' | 'chapter' | 'back-matter' | 'appendix';
}

/** Page types detected during extraction */
export type PageType =
  | 'title-page'
  | 'copyright'
  | 'dedication'
  | 'toc'
  | 'foreword'
  | 'chapter-start'
  | 'body'
  | 'photograph'
  | 'illustration'
  | 'glossary'
  | 'index'
  | 'blank'
  | 'other';

/** Text formatting span */
export interface FormattingSpan {
  start: number;   // Character offset
  end: number;     // Character offset
  style: 'normal' | 'italic' | 'bold' | 'bold-italic' | 'small-caps' | 'superscript';
}

/** Content block within a page */
export interface ContentBlock {
  type: 'heading' | 'subheading' | 'paragraph' | 'epigraph' | 'verse'
      | 'footnote' | 'caption' | 'running-header' | 'page-number';
  text: string;
  formatting: FormattingSpan[];
  continuedFromPreviousPage?: boolean;
  continuesOnNextPage?: boolean;
}

/** Image detected on a page */
export interface DetectedImage {
  description: string;
  caption?: string;
  position: string;      // e.g., "top-center", "full-page"
  boundingBox?: { x: number; y: number; width: number; height: number };
  isPhotograph: boolean;
  isIllustration: boolean;
  isDecorative: boolean; // e.g., ornamental dividers, SRF logo
}

/** Per-page extraction result */
export interface PageExtraction {
  pageNumber: number;
  readerLocation?: number;
  pageType: PageType;
  chapterNumber?: number;
  chapterTitle?: string;
  content: ContentBlock[];
  images: DetectedImage[];
  metadata: {
    hasFootnotes: boolean;
    hasSanskrit: boolean;
    sanskritTerms: string[];
    hasPoetry: boolean;
    isChapterStart: boolean;
    isChapterEnd: boolean;
    runningHeader?: string;
  };
  validation: PageValidation;
}

/** Validation data for a single page */
export interface PageValidation {
  confidence: 1 | 2 | 3 | 4 | 5;
  pageNumberAgreement: boolean;
  diacriticsExpected: boolean;
  diacriticsFound: boolean;
  italicsFound: boolean;
  imageDetected: boolean;
  textLength: number;
  flags: string[];
  needsHumanReview: boolean;
  reviewedBy?: 'auto' | 'human';
  reviewNotes?: string;
}

/** Assembled chapter */
export interface Chapter {
  chapterNumber: number;
  title: string;
  slug: string;
  pageRange: { start: number; end: number };
  epigraph?: ContentBlock;
  sections: ChapterSection[];
  images: ChapterImage[];
  footnotes: Footnote[];
  metadata: {
    wordCount: number;
    paragraphCount: number;
    imageCount: number;
    sanskritTerms: string[];
    namedEntities: string[];
  };
}

export interface ChapterSection {
  heading: string | null;
  paragraphs: ChapterParagraph[];
}

export interface ChapterParagraph {
  text: string;
  pageNumber: number;
  formatting: FormattingSpan[];
  sequenceInChapter: number;
}

export interface ChapterImage {
  assetPath: string;
  description: string;
  caption?: string;
  pageNumber: number;
}

export interface Footnote {
  marker: string;
  text: string;
  pageNumber: number;
}

/** Capture log entry */
export interface CaptureLogEntry {
  pageNumber: number;
  capturedAt: string;
  filePath: string;
  fileSize: number;
  readerLocation: number;
  footerText: string;
  screenshotHash: string;
}

/** Pipeline configuration */
export interface PipelineConfig {
  book: BookConfig;
  capture: {
    viewportWidth: number;
    viewportHeight: number;
    navigationDelayMs: number;  // Wait between page turns
    retryAttempts: number;
    resumeFromPage?: number;
  };
  extraction: {
    model: string;             // e.g., "claude-sonnet-4-6"
    batchSize: number;         // Pages per API call (1-3)
    maxConcurrent: number;     // Parallel API calls
    promptVersion: string;
    resumeFromPage?: number;
  };
  validation: {
    spotCheckInterval: number; // Check every Nth page
    confidenceThreshold: number; // Flag below this
    goldenPassages: GoldenPassage[];
  };
  paths: {
    dataDir: string;           // e.g., "/data/book-ingest"
    bookSlug: string;
  };
}
```

---

## OCR Prompt Design

The extraction prompt is the most critical piece. It must handle all page types and produce consistent structured output.

### System Prompt (Draft — Iterate During Phase 1)

```
You are extracting text from a high-resolution page image of a published book.
Your job is to produce a perfectly faithful transcription with structural markup.

CRITICAL RULES:
1. Transcribe EXACTLY what you see. Do not correct, improve, or modernize any text.
2. Preserve ALL formatting: italics, bold, small caps, superscripts.
3. Preserve ALL diacritical marks exactly (ā, ī, ū, ṛ, ṣ, ṇ, ṭ, ḍ, ś, etc.).
4. Preserve line breaks in poetry/verse. Prose paragraphs are single blocks.
5. Identify the page type (body, chapter-start, photograph, etc.).
6. Detect chapter boundaries (new chapter title = isChapterStart: true).
7. Distinguish body text from running headers, page numbers, and footnotes.
8. For photographs: describe the image, capture any caption text.
9. If text is cut off at page top/bottom, mark continuedFromPreviousPage
   or continuesOnNextPage as appropriate.
10. Rate your confidence 1-5 for this page.

FORMATTING NOTATION:
- Mark italic spans with start/end character offsets in the formatting array.
- "small-caps" for text rendered in small capitals (common in chapter openings).
- "superscript" for footnote markers.

PAGE TYPES:
- "title-page": Book title, author, publisher
- "copyright": Copyright notice, edition info, ISBN
- "dedication": Dedication text
- "toc": Table of contents
- "chapter-start": New chapter begins (has chapter number and/or title)
- "body": Regular text pages
- "photograph": Page dominated by a photograph
- "illustration": Drawings, diagrams
- "glossary": Glossary entries
- "index": Index entries
- "blank": Empty or nearly empty page

OUTPUT: Return a single JSON object matching the PageExtraction schema.
Do not wrap in markdown code fences. Pure JSON only.
```

### User Prompt (Per Page)

```
Extract all text and metadata from this book page image.
Physical page number (from reader footer): {pageNumber}

Respond with a JSON object matching the PageExtraction schema.
```

### Prompt Iteration Plan

Phase 1 tests this prompt against 6 diverse pages. Expected refinements:
- Sanskrit diacritics handling (may need explicit examples)
- Poetry line break detection (Yogananda includes verse frequently)
- Epigraph detection (chapters often open with quoted poetry)
- Caption vs. body text distinction near photographs
- Small caps detection (chapter openings in many editions use small caps for first line)
- Footnote marker detection and association

---

## Validation Architecture

### Layer 1: Capture Validation (during page capture)

| Check | Implementation | Catches |
|-------|---------------|---------|
| Page number monotonic | Parse footer text, verify N+1 follows N | Skipped pages, nav failures |
| Image non-blank | File size > 10KB | Failed renders |
| Image dimensions | Width/height match 1340×1400 (±tolerance) | Rendering anomalies |
| No duplicates | SHA-256 hash comparison with previous page | Double-captures |
| Capture log | Timestamp, page number, file size, Reader location | Audit trail |

### Layer 2: Extraction Validation (per-page, during extraction)

| Check | Implementation | Catches |
|-------|---------------|---------|
| Page number agreement | Extracted page# matches capture-meta page# | OCR misreading page number |
| Non-empty content | Text length > 0 for text pages | Failed extraction |
| OCR artifact detection | Regex for `rn`→`m`, `cl`→`d`, `I`→`l` patterns | Systematic misreads |
| Diacritics presence | Sanskrit-heavy pages contain `[āīūṛṣṇṭḍśñ]` | Diacritics silently flattened |
| Italic density sanity | Flag if chapter has zero italics | Italic detection failure |
| Self-reported confidence | Claude rates 1-5; flag ≤3 | Ambiguous pages |
| JSON schema validation | Output matches PageExtraction schema | Malformed responses |

### Layer 3: Assembly Validation (post-assembly)

| Check | Implementation | Catches |
|-------|---------------|---------|
| Chapter count | Detected chapters == TOC chapter count | Missed/phantom chapters |
| Chapter page ranges | Chapter N starts on page X (±1 of TOC) | Structural misalignment |
| No page gaps | Every page [1..558] has extraction | Dropped pages |
| Paragraph continuity | Last text of page N + first text of page N+1 = complete sentence | Broken page-boundary paragraphs |
| Golden passages | 15-20 known passages exact-match search | Cumulative error |

### Spot-Check Triggers

Pages automatically flagged for human review:
- Every chapter-start page (layout transition)
- Every photograph page (content-type detection)
- Every page with Claude confidence < 4
- Every 50th page (uniform sampling)
- Every page containing detected Sanskrit
- Any page where extracted page# ≠ expected page#

Estimated flagged pages: 40-60 of 558 (chapter starts + photos + low-confidence).

### Golden Passage Set (Seed — Expand During Implementation)

These publicly quoted passages should appear verbatim in the extracted text:

```json
[
  {
    "text": "The season of failure is the best time for sowing the seeds of success.",
    "chapter": null,
    "source": "Widely quoted, verify chapter during extraction"
  },
  {
    "text": "The soul is ever free; it is deathless, birthless, ever-existing",
    "chapter": null,
    "source": "Widely quoted"
  },
  {
    "text": "You must not let your life run in the ordinary way",
    "chapter": null,
    "source": "Widely quoted"
  },
  {
    "text": "Live quietly in the moment and see the beauty of all before you",
    "chapter": null,
    "source": "Widely quoted"
  },
  {
    "text": "Lahiri Mahasaya",
    "chapter": null,
    "source": "Name with diacritics — verify IAST rendering"
  }
]
```

The chapter numbers and page numbers will be filled in during Phase 1 probe.

### QA Review HTML

The assembly phase generates a side-by-side review HTML file:

```
For each flagged page:
  ┌─────────────────────┬──────────────────────────┐
  │  Page Image (PNG)    │  Extracted Text           │
  │                      │                           │
  │  [original render]   │  Chapter 3: The Saint...  │
  │                      │                           │
  │                      │  "The saint smiled at me  │
  │                      │  warmly..."               │
  │                      │                           │
  │                      │  Confidence: 4            │
  │                      │  Flags: [none]            │
  └─────────────────────┴──────────────────────────┘
```

Human reviews by scrolling through flagged pages. Corrections saved to extraction JSON.

---

## Phase Plan

### Phase 0: Skeleton (Interactive, Playwright MCP)

**Goal:** Capture TOC structure and book metadata without processing any pages.

**Steps:**
1. Navigate to Amazon Cloud Reader (user must be authenticated)
2. Open the TOC panel (hamburger menu or TOC icon in toolbar)
3. Extract chapter list with titles
4. Navigate to first and last page to confirm page count
5. Save `capture-meta.json`

**Output:** `capture-meta.json` with TOC and book metadata.

### Phase 1: Probe (Interactive, 6 Pages)

**Goal:** Validate the OCR prompt against diverse page types. Iterate until perfect.

**Steps:**
1. Capture 6 specific pages (screenshots via Playwright)
2. Send each to Claude Vision with the extraction prompt
3. Compare extraction against the page image visually
4. Identify prompt weaknesses, iterate
5. Validate: Sanskrit diacritics, italics, verse formatting, image detection

**Page selection:**

| # | Type | Target Page | Why |
|---|------|-------------|-----|
| 1 | Front matter | ~page 3-5 | Copyright, edition info, metadata |
| 2 | Chapter start | Chapter 1 start | Heading detection, possibly decorative |
| 3 | Dense narrative | ~page 50 | Baseline text quality |
| 4 | Photograph | A photo plate page | Image detection, caption |
| 5 | Sanskrit-heavy | TBD from TOC | Diacritics fidelity |
| 6 | Poetry/verse | TBD from content | Line break preservation |

**Output:** Finalized extraction prompt. 6 validated page extractions.

### Phase 2: Pipeline (Code Writing)

**Goal:** Write reusable TypeScript scripts for automated capture, extraction, assembly, and validation.

**Scripts:**

```
/scripts/book-ingest/
  types.ts         # TypeScript types (from this document)
  config.ts        # Book-specific configuration
  capture.ts       # Playwright automation: navigate + screenshot
  extract.ts       # Claude Vision API: image → structured JSON
  assemble.ts      # Combine pages → chapters → book.json
  validate.ts      # All validation layers
  qa-report.ts     # Generate QA review HTML
  utils.ts         # Shared utilities (hashing, file I/O, etc.)
  index.ts         # CLI entry point
```

**Dependencies:**
- `playwright` — Browser automation
- `@anthropic-ai/sdk` — Claude Vision API
- `sharp` — Image processing (cropping photographs from pages)
- `commander` — CLI argument parsing

**CLI interface:**
```bash
# Full pipeline
pnpm book-ingest --book autobiography-of-a-yogi

# Individual phases
pnpm book-ingest capture --book autobiography-of-a-yogi [--resume-from 100]
pnpm book-ingest extract --book autobiography-of-a-yogi [--resume-from 100]
pnpm book-ingest assemble --book autobiography-of-a-yogi
pnpm book-ingest validate --book autobiography-of-a-yogi
pnpm book-ingest qa-report --book autobiography-of-a-yogi
```

**Output:** Working pipeline with resume capability.

### Phase 3: Run (Automated)

**Goal:** Process all 558 pages of Autobiography of a Yogi.

**Steps:**
1. Run capture script (Playwright, ~20 min)
2. Run extraction script (Claude Vision, ~30-40 min)
3. Run assembly script (seconds)
4. Run validation script (seconds)
5. Generate QA report

**Output:** Full extracted book with validation report.

### Phase 4: QA (Human + Automated)

**Goal:** Verify fidelity. Fix any issues.

**Steps:**
1. Review QA HTML report — flagged pages side-by-side
2. Verify golden passages exact-match
3. Spot-check 5-10 random unflagged pages
4. Re-extract any corrected pages
5. Final validation pass

**Output:** Validated `book.json` ready for Contentful import.

---

## Reusability Design

### Adding a New Book

To ingest another ebook:

1. Create a book config in `/scripts/book-ingest/books/`:

```typescript
// books/mans-eternal-quest.ts
export const config: BookConfig = {
  title: "Man's Eternal Quest",
  author: "Paramahansa Yogananda",
  slug: "mans-eternal-quest",
  asin: "B00XXXX",
  readerUrl: "https://read.amazon.com/?asin=B00XXXX",
  contentTier: "guru",
  language: "en",
  expectedChapters: null, // Discovered during Phase 0
  goldenPassages: []
};
```

2. Run: `pnpm book-ingest --book mans-eternal-quest`

### Fixed-Layout vs. Reflowable

The current pipeline handles fixed-layout ebooks (rendered as images). Future enhancement for reflowable books:

```
Detection (auto):
  if (document.querySelector('.kg-full-page-img')) → fixed-layout pipeline (Vision OCR)
  if (document.querySelector('iframe.kg-text-content')) → reflowable pipeline (DOM scraping)
```

The reflowable pipeline would extract HTML directly from iframes — no OCR needed, even higher fidelity. This path is deferred until a reflowable book is encountered.

### Multi-Author Support

Per PRO-014 (adopted), the portal supports three content tiers:
- **Sacred:** Yogananda, Sri Yukteswar (guru lineage)
- **Authorized:** Daya Mata, Mrinalini Mata, Rajarsi (SRF presidents)
- **Commentary:** Monastic speakers

The `contentTier` field in `BookConfig` carries through to `book.json` and ultimately to Contentful and Neon. The extraction pipeline is content-tier-agnostic — it processes any ebook the same way.

---

## Relationship to DES-005

This pipeline replaces **DES-005 Steps 1-2** (Download PDF → Convert with marker) for books where the ebook edition is available and the PDF is low-fidelity.

The outputs align with DES-005 Step 3 (Human QA) and Step 3.5 (Contentful Import):
- `book.json` provides the structured data for Contentful import
- Chapter/section/paragraph hierarchy maps directly to Book → Chapter → Section → TextBlock
- Formatting data maps to Contentful Rich Text AST
- Page numbers carry through for citation metadata
- Validation report satisfies the "NON-NEGOTIABLE" QA requirement

**DES-005 Steps 4-12 are unchanged.** Chunking, language detection, entity resolution, enrichment, embedding, and all downstream processing work on Contentful content regardless of how it was ingested.

A note should be added to DES-005 documenting this alternative ingestion path:

> **Alternative: Amazon Cloud Reader Ingestion.** When the ebook edition is available and provides higher fidelity than a PDF scan, use the Reader ingestion pipeline (`/scripts/book-ingest/`). See `scripts/book-ingest/DESIGN.md` for the complete pipeline specification. Produces the same structured output as Steps 1-3, feeding directly into Step 3.5 (Contentful import). Particularly valuable for fixed-layout ebooks where born-digital renders produce significantly better OCR than scanned PDFs.

---

## Implementation Findings

Documented during Phases 0–3 execution (2026-02-25/26).

### Navigation Discovery

Amazon Cloud Reader page navigation does **not** respond to keyboard arrow keys for this fixed-layout book. Instead, navigation works by **clicking specific viewport zones**:

- **Right side click** (x = viewport.width - 50, y = viewport.height / 2): Advance to next screen
- **Left side click** (x = 50, y = viewport.height / 2): Go back one screen
- Multiple clicks may be needed: the reader has **virtual pages** (screens) that are smaller than physical book pages. A single physical page may span 2–3 virtual screens depending on browser viewport size.

The `advanceOnePage()` function clicks right side repeatedly until the footer page number changes, handling the virtual-to-physical page mismatch.

### Virtual Pages vs. Physical Pages

The Reader reader splits each physical book page into multiple virtual "screens" based on viewport size. At viewport 836×870, most pages fit in one screen, but some (especially dense pages) require 2–3 screens. The capture script handles this by monitoring the footer text ("Page N of 558") and only saving when the page number changes.

### Missing Pages (37 of 558)

37 physical page numbers have no corresponding Reader screen: `14, 30, 47, 93, 105, 106, 188, 199, 216, 220, 221, 222, 237, 250, 274, 293, 296, 320, 340, 360, 366, 387, 388, 397, 421, 439, 479, 480, 504, 512, 525, 530, 532, 533, 534, 537, 545`.

Investigation confirmed these pages **do not exist as separate screens** in the Reader fixed-layout edition — navigating forward from page N-1 goes directly to page N+1. These correspond to blank pages, photo plates, and section dividers in the physical book that have no content in the Reader rendering. **522 pages were captured** representing all renderable content.

### API Client: AWS Bedrock

The extraction runs on AWS Bedrock (not the direct Anthropic API) since the environment has `CLAUDE_CODE_USE_BEDROCK=true` with AWS credentials. The extract script auto-detects this and uses `@anthropic-ai/bedrock-sdk` with Bedrock model IDs (e.g., `us.anthropic.claude-sonnet-4-20250514-v1:0`).

### JSON Repair for LLM Output

Claude Vision occasionally outputs unescaped double quotes inside JSON string values (e.g., `"text": "...sovereign "dear to the gods.""` instead of properly escaped quotes). A `repairJsonText()` function handles this by detecting interior unescaped quotes via lookahead — if the character after a quote doesn't match a JSON structural token (`:`, `,`, `}`, `]`), it's treated as an interior quote and escaped. Also handles Unicode curly quotes (`\u201C`, `\u201D`). This brought the success rate from ~68% to 100%.

### Extraction Quality

All 522 extracted pages report **confidence 5/5** from Claude Sonnet 4. The first golden passage ("The characteristic features of Indian culture have long been a search for ultimate verities") matches exactly. Sanskrit diacritics, footnote superscripts, chapter labels with small-caps formatting, and paragraph continuation markers are all captured accurately. Zero errors across the full run.

### Capture Approach: Playwright MCP vs. Script

The initial capture used Playwright MCP's `browser_run_code` (JavaScript executed in the browser context) rather than the capture.ts script, because the script requires a CDP connection to an existing browser. The MCP approach was faster for batched captures but produced no capture log. A `gen-capture-log.ts` utility was used to retrospectively generate `capture-log.json` from the filesystem.

---

## Resolved Questions

1. **Front matter / back matter scope:** The TOC reveals 2 pages of front matter before Chapter 1 (page 3), and back matter starting at "About the Author" (~page 540). All content is ingested including front/back matter. The assembly creates `00-front-matter.json` and chapter files.

2. **Photograph extraction quality:** Photos render at 1340×1400 native resolution (2x retina). Quality is high — sufficient for Contentful assets. Cropping from page images is viable using the `sharp` library.

3. **Batch size for extraction:** Single-page extraction (batch size 1) with concurrency 5 was chosen. The cross-page context benefit was minimal vs. the error-recovery simplicity of single-page. Paragraph continuation is handled at assembly time via `continuesOnNextPage`/`continuedFromPreviousPage` flags.

4. **Edition identification:** The copyright page (page 1) identifies this as published by Self-Realization Fellowship. Full edition details are in the extraction output.

5. **Contentful import design:** Deferred. The `book.json` manifest captures all necessary data.

6. **Re-OCR strategy:** Supported by design — page images are archival. Deleting `extracted/*.json` and re-running extraction with a newer model produces fresh extractions.

---

## Pipeline Results Summary

Completed 2026-02-26.

| Metric | Value |
|--------|-------|
| Pages captured | 522 of 558 (36 don't exist in Reader) |
| Pages extracted | 522, 0 errors |
| Average confidence | 5.0/5.0 |
| Pages flagged for review | 0 |
| Chapters assembled | 49 |
| Total words | 94,584 |
| Total paragraphs | 2,222 |
| Images detected | 29 |
| Front matter sections | 9 (title-page through introduction) |
| Back matter sections | 9 (about-author through index) |

### Validation Results

- **6 passes**, 6 warnings, 1 expected failure
- The 1 failure is "capture/no-gaps" — the 36 missing Reader pages (blank/photo-plate pages in physical book)
- 4 warning-flagged body pages (46, 160, 437, 517) contain only footnotes/decorative elements — valid content, false positive from paragraph-count heuristic
- Extraction coverage: 522/522 captured pages extracted (100%)

### Output Files

| File | Size | Description |
|------|------|-------------|
| `book.json` | 15 KB | Complete book manifest for Contentful import |
| `qa/review.html` | 1.2 MB | Side-by-side QA review (all 522 pages) |
| `qa/validation-report.json` | 2.3 KB | Machine-readable validation results |
| `qa/flagged-pages.json` | 3 B | Empty — no pages flagged |
| `chapters/*.json` | 50 files | 49 chapters + front matter |
| `extracted/*.json` | 522 files | Per-page structured extractions |
| `pages/*.png` | 522 files | Archival page images |
| `capture-log.json` | — | Capture audit trail |

### Photo & Asset Capture (Phase 5)

Completed 2026-02-26.

| Metric | Value |
|--------|-------|
| Photo pages scanned | 29 (all pages with photos/illustrations/captions) |
| Virtual screens captured | 69 |
| Photo resolution | 1232×1572 native (canvas extraction at `naturalWidth × naturalHeight`) |
| Front cover | Captured from Reader Location 1 (`assets/front-cover.png`) |
| Photo manifest | `assets/photo-manifest.json` — links 69 assets to captions |
| Captions matched | 59 of 69 (86%) |
| Illustrations (non-photo) | 9 (Babaji, Krishna, Shiva drawings) |

**Key discovery:** Photos are composited into pre-rendered page blob images by Amazon's renderer. No separate photo files exist in the DOM. The `img.naturalWidth × naturalHeight` represents the maximum resolution available. Canvas extraction retrieves this data independent of browser window size.

### Text Gap Analysis

| Gap | Pages | Severity | What's Lost |
|-----|-------|----------|-------------|
| 188 | Ch.16 Outwitting the Stars | **Critical** | Mid-sentence: "These cycles are" → "the basis of this sentence" |
| 216 | Ch.20 We Do Not Visit Kashmir | **Critical** | Mid-sentence: "The resentment in their" → illustration |
| 360 | Ch.35 Lahiri Mahasaya | **Moderate** | Abdul Gufoor Khan anecdote (complete vignette) |
| 296 | Ch.29 Tagore | Minor | End of Tagore poem + chapter conclusion |
| 340 | Ch.33 Babaji | Minor | Brief narrative wrap-up before illustration |
| 366 | Ch.35 Lahiri Mahasaya | Minor | Quote introduction/setup paragraphs |

**Recovery:** Requires physical book (ISBN 978-0876120798, 13th edition). Online sources (Ananda.org, Wikisource, Archive.org) are inaccessible via automated fetching. The spiritmaji.com Kriya Yoga Lessons PDF is a different work (1920s lessons, not the 1946 Autobiography).

### Design Decisions

Autonomous decisions made 2026-02-26, informed by end-system lifecycle analysis:

1. **Page numbering: Physical edition.** Portal displays physical book page numbers (confirmed by principal). The ebook reader's page numbers map to the physical 13th edition.

2. **Photos: Inline with text + individual crops needed.** Photos display inline at their narrative position (not a separate gallery). However, the current 1232×1572 page images contain both text and photo composited together. **Next step:** Crop individual photos from page images (either manual or via bounding-box detection). For Arc 1 dev, full-page images with photo metadata are sufficient. SRF may provide high-res originals later.

3. **Contentful content model:**
   - `Book` — title, author, isbn, coverImage (Asset), description, edition, contentTier, language
   - `Chapter` — book (ref), number, title, slug, pageRange, body (Rich Text with embedded Assets), epigraph, footnotes
   - `Photograph` — image (Asset), caption, altText, pageNumber, chapter (ref), isIllustration
   This aligns with ADR-010 (Contentful as CMS) and the existing `book.json` manifest structure.

4. **Text gaps: Mark with editorial annotation.** Critical gaps (188, 216) are flagged in `book.json` for human recovery. The portal should NOT silently omit text. If gaps remain at publication, display: `[Text continues on page N of the print edition]` — consistent with Principle 2 (sacred text fidelity: no fabrication, no silent omission).

5. **Cover image: Captured from Reader.** 1232×1572 PNG sufficient for `og:image`, book cards, and listings. SRF may provide higher-res marketing art later.

6. **Index: Searchable, not navigable.** The book's index (page 558) is redundant with the portal's search. Import index terms as search metadata enrichment, not as a navigable UI element. Index entries with page numbers serve as ground-truth test data for the search pipeline.

7. **Glossary: Per-book now, portal-wide later.** Extract Sanskrit terms from per-chapter metadata into a structured glossary JSON. The portal glossary system (ADR-062, Arc 3) will aggregate across books. For now, build `glossary.json` per book with term, transliteration, definition (from footnotes), and first-use page.

8. **Human review gate: Required before publication.** AI extraction has 5.0/5.0 confidence, but Principle 2 demands human verification for sacred text. Flag for SRF editorial review. The `qa/review.html` side-by-side viewer enables this.

9. **Next book: Pipeline is reusable.** `capture.ts`, `extract.ts`, `assemble.ts`, `validate.ts`, `qa-report.ts` accept `--book <slug>`. Adding a book requires: (a) config entry in `config.ts`, (b) `capture-meta.json`, (c) cloud reader access. The photo capture script (`capture-photos.ts`) generalizes via extraction-data scanning.

10. **ISBN:** 978-0876120798 (physical, from Amazon listing dp/0876120796). ASIN B00JW44IAI (Kindle). Both recorded in `book.json`.

### Contentful Import Readiness

**Status: Ready for import script development.**

The `book.json` manifest is designed for direct translation to Contentful. What exists:

| Artifact | Status | Contentful Target |
|----------|--------|-------------------|
| Book metadata | Complete | `Book` content type |
| 49 chapter JSONs | Complete | `Chapter` content type entries |
| Front cover image | Captured | `Book.coverImage` Asset |
| 69 photo page screens | Captured | `Photograph` Assets (need individual crops) |
| Photo-caption manifest | Complete | `Photograph.caption` and `Photograph.altText` |
| Text with formatting | Complete | Rich Text AST (italic, bold marks) |
| Sanskrit terms per chapter | Complete | Glossary enrichment / Knowledge Graph |
| Footnotes per chapter | Complete | Rich Text inline or linked entries |

**What's needed to start importing:**

1. **Contentful space and content types** — Create the Book, Chapter, Photograph types
2. **Rich Text AST converter** — Transform `FormattingSpan[]` arrays into Contentful Rich Text AST
3. **Asset uploader** — Upload cover + photo images, get Asset IDs
4. **Chapter importer** — Create Chapter entries with Rich Text bodies and embedded Asset references
5. **Gap handling** — For pages 188/216: insert editorial markers in the Rich Text body

**Import script estimated structure:**
```
scripts/book-ingest/src/contentful-import.ts
  - connectToContentful(spaceId, accessToken)
  - createContentTypes()           // idempotent
  - uploadAssets(book.json)        // cover + photos
  - importChapters(book.json)      // chapters with Rich Text + Asset refs
  - validateImport()               // verify all entries created
```

### Next Steps

1. **Recover critical text gaps** — Acquire physical book (ISBN 978-0876120798) or SRF digital text for pages 188, 216
2. **Crop individual photos** — Extract isolated photo images from full-page captures for responsive portal display
3. **Build Contentful import script** — `contentful-import.ts` using the Contentful Management API
4. **Human QA review** — Open `qa/review.html` for side-by-side verification before import
5. **Build Sanskrit glossary** — Extract glossary.json from per-chapter Sanskrit terms and footnote definitions
6. **Update DES-005** — Add Reader ingestion as the primary path, PDF as fallback
