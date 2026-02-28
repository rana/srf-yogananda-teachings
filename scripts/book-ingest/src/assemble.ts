#!/usr/bin/env npx tsx
/**
 * Chapter Assembly Script
 *
 * Combines per-page extractions into chapter-level files and a complete book manifest.
 * Handles paragraph continuation across page boundaries.
 *
 * Usage:
 *   npx tsx src/assemble.ts --book autobiography-of-a-yogi
 */

import path from 'path';
import { getBookPaths, getPipelineConfig } from './config.js';
import {
  PageExtraction, CaptureMeta, Chapter, ChapterSection, ChapterParagraph,
  ChapterImage, Footnote, ContentBlock, TocEntry
} from './types.js';
import {
  ensureDir, readJson, writeJson, padPage, slugify, log, fileExists
} from './utils.js';

/** Parse CLI arguments */
function parseArgs() {
  const args = process.argv.slice(2);
  let bookSlug = 'autobiography-of-a-yogi';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--book' && args[i + 1]) {
      bookSlug = args[i + 1];
      i++;
    }
  }

  return { bookSlug };
}

/** Load all page extractions */
async function loadExtractions(pagesDir: string, totalPages: number): Promise<Map<number, PageExtraction>> {
  const extractions = new Map<number, PageExtraction>();

  for (let p = 1; p <= totalPages; p++) {
    const filePath = path.join(pagesDir, `page-${padPage(p)}.json`);
    if (await fileExists(filePath)) {
      try {
        const extraction = await readJson<PageExtraction>(filePath);
        extractions.set(p, extraction);
      } catch (err) {
        log.warn(`Failed to load extraction for page ${p}: ${err}`);
      }
    }
  }

  return extractions;
}

/** Determine chapter boundaries from TOC and extractions */
function buildChapterRanges(
  toc: TocEntry[],
  extractions: Map<number, PageExtraction>,
  totalPages: number
): Array<{ chapterNumber: number; title: string; startPage: number; endPage: number }> {
  const chapters = toc.filter(e => e.type === 'chapter' && e.pageNumber !== null);
  const ranges: Array<{ chapterNumber: number; title: string; startPage: number; endPage: number }> = [];

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    const nextChapter = chapters[i + 1];

    // End page is one before the next chapter, or before back matter
    let endPage: number;
    if (nextChapter && nextChapter.pageNumber !== null) {
      endPage = nextChapter.pageNumber - 1;
    } else {
      // Last chapter — find where back matter starts
      const backMatter = toc.find(e => e.type === 'back-matter' && e.pageNumber !== null);
      endPage = backMatter ? backMatter.pageNumber! - 1 : totalPages;
    }

    ranges.push({
      chapterNumber: chapter.chapterNumber!,
      title: chapter.title.replace(/^\d+\.\s*/, ''), // Remove "1. " prefix
      startPage: chapter.pageNumber!,
      endPage
    });
  }

  return ranges;
}

/** Assemble a single chapter from its page extractions */
function assembleChapter(
  chapterNumber: number,
  title: string,
  startPage: number,
  endPage: number,
  extractions: Map<number, PageExtraction>
): Chapter {
  const slug = slugify(title);
  const paragraphs: ChapterParagraph[] = [];
  const images: ChapterImage[] = [];
  const footnotes: Footnote[] = [];
  const allSanskritTerms = new Set<string>();
  const allEntities = new Set<string>();
  let sequenceCounter = 0;

  for (let p = startPage; p <= endPage; p++) {
    const extraction = extractions.get(p);
    if (!extraction) continue;

    for (const block of extraction.content) {
      // Skip non-content blocks
      if (['running-header', 'page-number', 'decorative'].includes(block.type)) {
        continue;
      }

      // Handle footnotes
      if (block.type === 'footnote') {
        footnotes.push({
          marker: block.text.match(/^(\d+|[*†‡§])/)?.[1] || '',
          text: block.text,
          pageNumber: p
        });
        continue;
      }

      // Handle paragraphs and other text content
      if (['paragraph', 'heading', 'subheading', 'chapter-label', 'epigraph', 'verse', 'caption'].includes(block.type)) {
        // Check if this continues from previous page
        if (block.continuedFromPreviousPage && paragraphs.length > 0) {
          // Merge with the last paragraph
          const last = paragraphs[paragraphs.length - 1];
          // Add space if needed between the continuation
          const separator = last.text.endsWith('-') ? '' : ' ';
          if (last.text.endsWith('-')) {
            // Remove hyphen for word continuation
            last.text = last.text.slice(0, -1);
          }
          last.text += separator + block.text;
          // Adjust formatting spans (offset by the length of existing text)
          const offset = last.text.length - block.text.length;
          for (const span of block.formatting) {
            last.formatting.push({
              start: span.start + offset,
              end: span.end + offset,
              style: span.style
            });
          }
        } else {
          sequenceCounter++;
          paragraphs.push({
            text: block.text,
            pageNumber: p,
            formatting: [...block.formatting],
            sequenceInChapter: sequenceCounter
          });
        }
      }
    }

    // Collect images
    for (const img of extraction.images) {
      if (img.isPhotograph || img.isIllustration) {
        images.push({
          assetPath: `assets/page-${padPage(p)}-photo.png`,
          description: img.description,
          caption: img.caption,
          pageNumber: p
        });
      }
    }

    // Collect Sanskrit terms
    for (const term of extraction.metadata.sanskritTerms) {
      allSanskritTerms.add(term);
    }
  }

  // Count words
  const wordCount = paragraphs.reduce((sum, p) => sum + p.text.split(/\s+/).length, 0);

  return {
    chapterNumber,
    title,
    slug,
    pageRange: { start: startPage, end: endPage },
    sections: [{
      heading: null,
      paragraphs
    }],
    images,
    footnotes,
    metadata: {
      wordCount,
      paragraphCount: paragraphs.length,
      imageCount: images.length,
      sanskritTerms: Array.from(allSanskritTerms),
      namedEntities: Array.from(allEntities)
    }
  };
}

/** Assemble front matter */
function assembleFrontMatter(
  toc: TocEntry[],
  extractions: Map<number, PageExtraction>,
  firstChapterPage: number
): Chapter {
  const paragraphs: ChapterParagraph[] = [];
  let seq = 0;

  // Front matter is everything before the first chapter
  for (let p = 1; p < firstChapterPage; p++) {
    const extraction = extractions.get(p);
    if (!extraction) continue;

    for (const block of extraction.content) {
      if (['running-header', 'page-number', 'decorative'].includes(block.type)) continue;

      seq++;
      paragraphs.push({
        text: block.text,
        pageNumber: p,
        formatting: [...block.formatting],
        sequenceInChapter: seq
      });
    }
  }

  return {
    chapterNumber: 0,
    title: 'Front Matter',
    slug: 'front-matter',
    pageRange: { start: 1, end: firstChapterPage - 1 },
    sections: [{ heading: null, paragraphs }],
    images: [],
    footnotes: [],
    metadata: {
      wordCount: paragraphs.reduce((sum, p) => sum + p.text.split(/\s+/).length, 0),
      paragraphCount: paragraphs.length,
      imageCount: 0,
      sanskritTerms: [],
      namedEntities: []
    }
  };
}

/** Main assembly */
async function runAssembly(bookSlug: string): Promise<void> {
  const config = getPipelineConfig(bookSlug);
  const paths = getBookPaths(bookSlug);

  await ensureDir(paths.chapters);
  await ensureDir(paths.assets);

  // Load metadata and extractions
  const captureMeta = await readJson<CaptureMeta>(paths.captureMeta);
  const totalPages = captureMeta.book.totalPages;

  log.info(`Loading extractions for "${captureMeta.book.title}"...`);
  const extractions = await loadExtractions(paths.extracted, totalPages);
  log.info(`Loaded ${extractions.size} page extractions`);

  // Build chapter ranges
  const chapterRanges = buildChapterRanges(captureMeta.toc, extractions, totalPages);
  log.info(`Found ${chapterRanges.length} chapters`);

  // Assemble front matter
  const firstChapterPage = chapterRanges[0]?.startPage ?? 1;
  if (firstChapterPage > 1) {
    const frontMatter = assembleFrontMatter(captureMeta.toc, extractions, firstChapterPage);
    const frontMatterPath = path.join(paths.chapters, '00-front-matter.json');
    await writeJson(frontMatterPath, frontMatter);
    log.info(`Assembled front matter (pages 1-${firstChapterPage - 1})`);
  }

  // Assemble each chapter
  const chapters: Chapter[] = [];
  for (const range of chapterRanges) {
    const chapter = assembleChapter(
      range.chapterNumber, range.title, range.startPage, range.endPage, extractions
    );
    chapters.push(chapter);

    const chapterFile = `${padPage(range.chapterNumber).slice(1)}-${chapter.slug}.json`;
    const chapterPath = path.join(paths.chapters, chapterFile);
    await writeJson(chapterPath, chapter);

    log.info(`Assembled Chapter ${range.chapterNumber}: ${range.title} (pages ${range.startPage}-${range.endPage}, ${chapter.metadata.wordCount} words)`);
  }

  // Build book manifest
  const totalWords = chapters.reduce((sum, ch) => sum + ch.metadata.wordCount, 0);
  const totalParagraphs = chapters.reduce((sum, ch) => sum + ch.metadata.paragraphCount, 0);
  const totalImages = chapters.reduce((sum, ch) => sum + ch.metadata.imageCount, 0);

  // Compute quality metrics from extractions
  let totalConfidence = 0;
  let confidenceCount = 0;
  let flaggedPages = 0;
  for (const [, ext] of extractions) {
    totalConfidence += ext.validation.confidence;
    confidenceCount++;
    if (ext.validation.needsHumanReview) flaggedPages++;
  }

  const manifest = {
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'cloud-reader',
    book: {
      title: captureMeta.book.title,
      author: captureMeta.book.author,
      authorSlug: slugify(captureMeta.book.author),
      publisher: captureMeta.book.publisher,
      asin: captureMeta.book.asin,
      language: captureMeta.book.language,
      authorTier: captureMeta.book.authorTier,
      totalPages,
      totalChapters: chapters.length
    },
    structure: {
      frontMatter: {
        pageRange: [1, firstChapterPage - 1],
        sections: captureMeta.toc
          .filter(e => e.type === 'front-matter')
          .map(e => slugify(e.title))
      },
      chapters: chapters.map(ch => ({
        number: ch.chapterNumber,
        title: ch.title,
        slug: ch.slug,
        pageRange: [ch.pageRange.start, ch.pageRange.end],
        dataFile: `chapters/${padPage(ch.chapterNumber).slice(1)}-${ch.slug}.json`
      })),
      backMatter: {
        pageRange: [
          chapterRanges[chapterRanges.length - 1]?.endPage + 1 || totalPages,
          totalPages
        ],
        sections: captureMeta.toc
          .filter(e => e.type === 'back-matter')
          .map(e => slugify(e.title))
      }
    },
    statistics: {
      totalWords,
      totalParagraphs,
      totalImages,
      totalChapters: chapters.length
    },
    quality: {
      totalPagesExtracted: extractions.size,
      averageConfidence: confidenceCount > 0 ? Math.round((totalConfidence / confidenceCount) * 10) / 10 : 0,
      pagesFlaggedForReview: flaggedPages,
      pagesHumanReviewed: 0,
      goldenPassagesVerified: 0,
      goldenPassagesPassed: 0
    },
    contentfulMapping: {
      notes: 'This manifest is designed for direct translation to Contentful\'s Book → Chapter → Section → TextBlock content model. Each chapter.sections[].paragraphs maps to a TextBlock entry. Formatting arrays map to Rich Text AST marks (italic, bold). Images map to Contentful Asset entries linked from TextBlocks.'
    }
  };

  await writeJson(paths.bookManifest, manifest);
  log.info(`Book manifest saved to ${paths.bookManifest}`);
  log.info(`Total: ${totalWords} words, ${totalParagraphs} paragraphs, ${totalImages} images across ${chapters.length} chapters`);
}

// Run if called directly
const { bookSlug } = parseArgs();
runAssembly(bookSlug).catch(err => {
  log.error('Assembly failed:', err);
  process.exit(1);
});
