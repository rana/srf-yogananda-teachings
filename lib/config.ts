/**
 * Named constants per ADR-123.
 *
 * Every parameter documents: value, rationale, evaluation trigger.
 * Parameters are tunable defaults, not architectural commitments.
 */

// ── Search ──────────────────────────────────────────────────────

/** Reciprocal Rank Fusion constant. Higher values favor lower-ranked results. */
export const RRF_K = 60; // Standard RRF default. Evaluate after M1a-8 search quality test.

/** Maximum search results returned. */
export const SEARCH_RESULTS_LIMIT = 20; // Sufficient for top-3 evaluation. Revisit at M1a-8.

/** Minimum similarity threshold for vector search results. */
export const VECTOR_SIMILARITY_THRESHOLD = 0.3; // Conservative. Evaluate at M1a-8.

// ── Chunking ────────────────────────────────────────────────────

/** Target chunk size in tokens. */
export const CHUNK_TARGET_TOKENS = 300; // Paragraph-based. ADR-048. Evaluate at M1a-8.

/** Minimum chunk size in tokens. */
export const CHUNK_MIN_TOKENS = 100; // ADR-048. Short paragraphs stay whole.

/** Maximum chunk size in tokens. */
export const CHUNK_MAX_TOKENS = 500; // ADR-048. Long paragraphs may split.

// ── Embeddings ──────────────────────────────────────────────────

/** Voyage embedding model. */
export const EMBEDDING_MODEL = "voyage-3-large"; // ADR-118. 1024 dimensions.

/** Embedding dimensions. */
export const EMBEDDING_DIMENSIONS = 1024; // voyage-3-large output size.

// ── Passages ────────────────────────────────────────────────────

/** Minimum passage length for Today's Wisdom display (characters). */
export const PASSAGE_MIN_LENGTH = 80; // Below this, passages lack context. Evaluate at M2a.

/** Maximum passage length for Today's Wisdom display (characters). */
export const PASSAGE_MAX_LENGTH = 600; // Comfortable single-screen reading. Evaluate at M2a.

/** Maximum passage length for Quiet Corner reflections (characters). */
export const REFLECTION_MAX_LENGTH = 500; // Shorter for contemplative focus. Evaluate at M2a.

// ── Reading ─────────────────────────────────────────────────────

/** Optimal line length for English prose (characters). */
export const LINE_LENGTH_MIN_CHARS = 65; // Typography standard. ADR-006.

/** Maximum line length for English prose (characters). */
export const LINE_LENGTH_MAX_CHARS = 75; // Typography standard. ADR-006.

/** Maximum content width for reading column (rem). */
export const READING_MAX_WIDTH_REM = 38; // Produces ~65-75 chars with body text.
