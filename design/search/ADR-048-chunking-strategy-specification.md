## ADR-048: Chunking Strategy Specification

The chunking algorithm is the single most important factor in search retrieval quality. Yogananda's prose style varies dramatically across books, requiring a nuanced strategy.

### Default Chunking (Milestones 1a–3c: narrative, collected talks, short works)

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Unit** | Paragraph (typographic paragraph breaks in source text) | Yogananda's paragraphs correspond to idea boundaries |
| **Token range** | 100–500 tokens (target: 200–300) | Balances specificity with context |
| **Minimum** | 100 tokens — paragraphs below this are merged with the following paragraph | Prevents orphaned fragments |
| **Maximum** | 500 tokens — split at sentence boundaries, keeping both halves above 100 tokens | Prevents imprecise retrieval |
| **Overlap** | None | Paragraph boundaries are natural semantic boundaries; overlap introduces duplicate search results |

**Metadata preserved per chunk:** `book_id`, `chapter_id`, `paragraph_index` (position within chapter), `page_number` (from source), `language`.

### Special Handling

| Content Type | Strategy | Rationale |
|-------------|----------|-----------|
| **Epigraphs and poetry** | Single chunk regardless of length | Splitting a poem mid-stanza destroys meaning |
| **Lists and enumerations** | Single chunk | Yogananda's numbered instructions are semantically atomic |
| **Dialogue and quoted speech** | Single chunk for continuous exchanges; split at speaker changes if >500 tokens | Preserves conversational flow |
| **Aphorisms (*Sayings*, *Scientific Healing Affirmations*)** | One chunk per standalone saying/affirmation regardless of length | These books are already atomically organized |
| **Chapter titles and section headers** | Not chunked separately — prepended to first paragraph as metadata context | Headers are context, not content |

### Verse-Aware Chunking (Milestone 3d: *Second Coming of Christ*, *God Talks With Arjuna*, *Wine of the Mystic*)

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Unit** | Verse-commentary pair | Maintains the interpretive relationship |
| **Long commentaries** | Split at paragraph boundaries within commentary; each sub-chunk retains verse text as prefix | Verse context travels with every fragment |
| **Cross-reference** | Verse reference stored as structured metadata (e.g., "Bhagavad Gita IV:7") | Enables side-by-side commentary view |

### Per-Language Validation (Milestone 5b)

English-calibrated chunk sizes (200–300 tokens) may produce different semantic density across scripts. CJK tokenization differs significantly from Latin scripts; Devanagari and Bengali have different word-boundary characteristics. Validate retrieval quality per language before committing to chunk sizes. Adjust token ranges per language if necessary. See ROADMAP Milestone 5b for the formal validation requirement.

### Semantic Density Classification

Not all passages carry equal semantic weight per token. Some sentences condense an entire teaching into ten words ("The soul is ever free"). Others are narrative connective tissue ("We traveled by train to Puri"). Semantic density — meaning per word — is a useful signal for multiple portal features.

**Classification:** A `semantic_density` score per chunk, computed during ingestion:

| Score | Label | Description | Example |
|-------|-------|-------------|---------|
| `high` | Aphoristic | Maximum meaning per token. Standalone truth. Dwell-worthy. | *"The soul is ever free; it is deathless, birthless..."* |
| `medium` | Expository | Standard teaching prose. Develops an idea across sentences. | *"When you practice meditation regularly, the mind..."* |
| `low` | Narrative | Story, transition, biographical detail. Context, not teaching. | *"We arrived at the station in the early morning..."* |

**How computed:** Claude Opus (ADR-014 batch tier, "Classifying" category from ADR-005) classifies each chunk during ingestion. Not a numeric score — a three-level enum. Spot-checked by reviewer.

**Column:** `ALTER TABLE book_chunks ADD COLUMN semantic_density TEXT CHECK (semantic_density IN ('high', 'medium', 'low'));`

**Where it's used:**

| Feature | How density helps |
|---------|-------------------|
| Today's Wisdom | Favors `high` density passages — aphorisms, standalone truths |
| Quiet Corner | Uses only `high` density passages — affirmations must stand alone |
| "The Essential Yogananda" | A curated view of the ~200 highest-density passages across the entire library. Not a new page initially — a filter on the `/themes` or `/explore` page. The 200 passages that pack the most teaching per word. |
| Self-Revealing Navigation (DES-015) | The "most evocative passage" selected for the warm-background hint on first visit is the highest-density passage in the chapter's first screen |
| Search result ranking | Density as a tiebreaker when relevance scores are close — prefer aphoristic passages that stand alone over narrative context |

**Milestone:** Populated during Milestone 3a ingestion (when Claude batch processing is available). Retroactively applied to Arc 1 content.

### ADR-039 ext: Corpus Stylometric Fingerprint

Content Integrity Verification (ADR-039) uses per-chapter content hashes to verify text hasn't been altered. A stylometric fingerprint adds a deeper layer: not just "this text hasn't been changed" but "this text is consistent with the verified patterns of Yogananda's writing."

**What the fingerprint captures:**

| Dimension | Signal |
|-----------|--------|
| **Sentence length distribution** | Mean, median, and standard deviation of words per sentence, per book |
| **Vocabulary frequency** | The characteristic vocabulary profile — frequency of spiritual terms, pronouns, imperative forms |
| **Metaphor recurrence** | Yogananda's distinctive metaphors: ocean/wave, lotus, light/darkness, divine mother. Frequency and distribution. |
| **Rhetorical mode ratio** | Declarative vs. imperative vs. interrogative sentences across the corpus |
| **Passage structure** | Average paragraph length, dialogue-to-exposition ratio, quotation density |

**How computed:** A batch analysis script run once after full corpus ingestion. Outputs a JSON fingerprint file per book and one for the aggregate corpus. Stored alongside content hashes on the `/integrity` page.

**Who this serves:**
- **Content integrity.** In a world of AI-generated spiritual content, the ability to verify "this passage is consistent with Yogananda's writing style" is a unique trust signal.
- **Scholars.** Stylometric analysis is a recognized methodology in textual scholarship. Making the portal's fingerprint public invites scholarly engagement.
- **AI systems consuming portal content (ADR-081).** The fingerprint helps AI systems distinguish authentic Yogananda passages from AI-generated imitations.

**What this is not:** Not a plagiarism detector. Not a tool for verifying external claims about Yogananda's authorship. It is a statistical profile of the authenticated corpus — a reference point, not a judge.

**Milestone:** Milestone 3d+ (requires substantial corpus ingestion). Published on the `/integrity` page alongside content hashes.

---
