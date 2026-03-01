/**
 * Book configurations and pipeline settings
 */

import { BookConfig, PipelineConfig, GoldenPassage } from './types.js';
import path from 'path';

/** Root data directory for all book ingestions */
const DATA_ROOT = path.resolve(import.meta.dirname, '../../..', 'data/book-ingest');

/** Golden passages for Autobiography of a Yogi (English) validation */
const AOY_GOLDEN_PASSAGES: GoldenPassage[] = [
  {
    text: 'The characteristic features of Indian culture have long been a search for ultimate verities',
    chapter: 1,
    pageNumber: 3,
    source: 'Chapter 1 opening line — verified from probe-02 capture'
  },
  {
    text: 'disciple-guru',
    chapter: 1,
    pageNumber: 3,
    source: 'Sanskrit compound with footnote — Chapter 1 page 3'
  },
  {
    text: 'Paramahansa Yogananda',
    chapter: null,
    source: 'Author name — should appear in frontispiece caption and throughout'
  }
];

/** Golden passages for Autobiografía de un yogui (Spanish) validation */
const AOY_ES_GOLDEN_PASSAGES: GoldenPassage[] = [
  {
    text: 'Paramahansa Yogananda',
    chapter: null,
    source: 'Author name — should appear on title page and throughout'
  },
  {
    text: 'Sri Yukteswar',
    chapter: null,
    source: 'Guru name — should appear in chapters 10, 12, 42, 43'
  },
  {
    text: 'Kriya Yoga',
    chapter: 26,
    source: 'Chapter 26 title: "La ciencia del Kriya Yoga" — term appears untranslated'
  }
];

/** Autobiography of a Yogi — English (SRF edition, ASIN B00JW44IAI) */
export const AUTOBIOGRAPHY_OF_A_YOGI: BookConfig = {
  title: 'Autobiography of a Yogi',
  author: 'Paramahansa Yogananda',
  slug: 'autobiography-of-a-yogi',
  asin: 'B00JW44IAI',
  readerUrl: 'https://read.amazon.com/?asin=B00JW44IAI',
  authorTier: 'guru',
  language: 'en',
  expectedChapters: 49,
  goldenPassages: AOY_GOLDEN_PASSAGES
};

/**
 * Autobiografía de un yogui — Spanish (SRF edition, ASIN B07G5KL5RL)
 *
 * Self-Realization Fellowship Kindle edition. ISBN 978-0876128213.
 * 811 Kindle pages, 49 chapters (matches English SRF edition structure).
 * This is the canonical SRF translation — same publisher as the English ebook.
 *
 * Note: ASIN B0FDKZ2FLN is a third-party "Editorial Recién Traducido, 2025"
 * translation — do NOT use. It has only 48 chapters and different translation.
 */
export const AUTOBIOGRAFIA_DE_UN_YOGUI: BookConfig = {
  title: 'Autobiografía de un yogui',
  author: 'Paramahansa Yogananda',
  slug: 'autobiografia-de-un-yogui',
  asin: 'B07G5KL5RL',
  readerUrl: 'https://read.amazon.com/?asin=B07G5KL5RL',
  authorTier: 'guru',
  language: 'es',
  expectedChapters: 49,
  goldenPassages: AOY_ES_GOLDEN_PASSAGES
};

/** Registry of all book configs */
export const BOOK_CONFIGS: Record<string, BookConfig> = {
  'autobiography-of-a-yogi': AUTOBIOGRAPHY_OF_A_YOGI,
  'autobiografia-de-un-yogui': AUTOBIOGRAFIA_DE_UN_YOGUI
};

/** Build pipeline config for a book */
export function getPipelineConfig(bookSlug: string): PipelineConfig {
  const book = BOOK_CONFIGS[bookSlug];
  if (!book) {
    throw new Error(`Unknown book: ${bookSlug}. Available: ${Object.keys(BOOK_CONFIGS).join(', ')}`);
  }

  return {
    book,
    capture: {
      navigationDelayMs: 300,
      maxClicksPerPage: 8,
      retryAttempts: 3,
      resumeFromPage: undefined
    },
    extraction: {
      model: 'claude-sonnet-4-20250514',
      maxConcurrent: 5,
      promptVersion: '1.0.0',
      resumeFromPage: undefined
    },
    validation: {
      spotCheckInterval: 50,
      confidenceThreshold: 3,
      goldenPassages: book.goldenPassages || []
    },
    paths: {
      dataDir: DATA_ROOT,
      bookSlug
    }
  };
}

/** Get the data directory for a specific book */
export function getBookDataDir(bookSlug: string): string {
  return path.join(DATA_ROOT, bookSlug);
}

/** Get standard paths for a book's data */
export function getBookPaths(bookSlug: string) {
  const bookDir = getBookDataDir(bookSlug);
  return {
    root: bookDir,
    captureMeta: path.join(bookDir, 'capture-meta.json'),
    pages: path.join(bookDir, 'pages'),
    extracted: path.join(bookDir, 'extracted'),
    chapters: path.join(bookDir, 'chapters'),
    assets: path.join(bookDir, 'assets'),
    qa: path.join(bookDir, 'qa'),
    captureLog: path.join(bookDir, 'capture-log.json'),
    bookManifest: path.join(bookDir, 'book.json')
  };
}
