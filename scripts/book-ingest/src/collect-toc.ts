#!/usr/bin/env npx tsx
/**
 * TOC Collection Script
 *
 * Collects Table of Contents entries with page numbers from Amazon Cloud Reader
 * using Playwright. Connects to an existing browser session via CDP.
 *
 * Prerequisites:
 * - The book must be purchased and open in Cloud Reader
 * - Chromium must be running with --remote-debugging-port=9222
 * - The book must be fixed-layout (uses .kg-full-page-img img)
 *
 * Usage:
 *   npx tsx src/collect-toc.ts --book autobiografia-de-un-yogui [--cdp-url ws://...]
 *
 * Output:
 *   Writes capture-meta.json to data/book-ingest/<slug>/capture-meta.json
 *
 * How it works:
 * 1. Connects to the browser via CDP
 * 2. Finds the Cloud Reader page
 * 3. Verifies fixed-layout format (.kg-full-page-img img present)
 * 4. Reads total pages from footer ("Page N of M")
 * 5. Gets image resolution from the page image element
 * 6. Opens TOC panel
 * 7. Clicks each TOC entry, waits for page load, reads footer page number
 * 8. Classifies entries as front-matter, chapter, or back-matter
 * 9. Writes capture-meta.json
 *
 * Known issues:
 * - Cloud Reader uses shadow DOM — standard CSS selectors don't work for TOC
 * - Uses [role="listbox"] > [role="listitem"] locators (accessibility tree)
 * - Some entries may fail with "outside of viewport" — script retries with scroll
 * - Footer may return stale page numbers if navigation is slow — script uses
 *   1.5s delay between clicks (adjustable via --nav-delay)
 * - Front matter pages may show "Location N" instead of "Page N" — recorded as null
 */

import { chromium, type Browser, type Page, type Locator } from 'playwright';
import path from 'path';
import { BOOK_CONFIGS, getBookPaths } from './config.js';
import { CaptureMeta, TocEntry } from './types.js';
import { ensureDir, writeJson, log, sleep, fileExists } from './utils.js';

/** Parse CLI arguments */
function parseArgs() {
  const args = process.argv.slice(2);
  let bookSlug = '';
  let cdpUrl = 'http://localhost:9222';
  let navDelay = 1500;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--book' && args[i + 1]) {
      bookSlug = args[i + 1];
      i++;
    } else if (args[i] === '--cdp-url' && args[i + 1]) {
      cdpUrl = args[i + 1];
      i++;
    } else if (args[i] === '--nav-delay' && args[i + 1]) {
      navDelay = parseInt(args[i + 1], 10);
      i++;
    }
  }

  if (!bookSlug) {
    console.error('Usage: npx tsx src/collect-toc.ts --book <slug>');
    console.error(`Available: ${Object.keys(BOOK_CONFIGS).join(', ')}`);
    process.exit(1);
  }

  return { bookSlug, cdpUrl, navDelay };
}

/** Parse page number from Cloud Reader footer text */
function parsePageNumber(footer: string): number | null {
  const match = footer.match(/Page\s+(\d+)\s+of/);
  return match ? parseInt(match[1], 10) : null;
}

/** Parse total pages from footer text */
function parseTotalPages(footer: string): number | null {
  const match = footer.match(/Page\s+\d+\s+of\s+(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/** Classify a TOC entry as front-matter, chapter, or back-matter */
function classifyTocEntry(
  title: string,
  index: number,
  firstChapterIndex: number,
  lastChapterIndex: number
): 'front-matter' | 'chapter' | 'back-matter' {
  if (index < firstChapterIndex) return 'front-matter';
  if (index > lastChapterIndex) return 'back-matter';
  return 'chapter';
}

/** Extract chapter number from a title like "1. My Parents..." or "CAPÍTULO 1: ..." */
function extractChapterNumber(title: string): number | null {
  // "N. Title" pattern (SRF editions)
  const dotMatch = title.match(/^(\d+)\.\s/);
  if (dotMatch) return parseInt(dotMatch[1], 10);

  // "CAPÍTULO N: Title" pattern (some Spanish editions)
  const capMatch = title.match(/CAP[ÍI]TULO\s+(\d+)/i);
  if (capMatch) return parseInt(capMatch[1], 10);

  // "Chapter N" pattern (English)
  const chMatch = title.match(/Chapter\s+(\d+)/i);
  if (chMatch) return parseInt(chMatch[1], 10);

  return null;
}

/** Main TOC collection */
async function collectToc(bookSlug: string, cdpUrl: string, navDelay: number): Promise<void> {
  const bookConfig = BOOK_CONFIGS[bookSlug];
  if (!bookConfig) {
    throw new Error(`Unknown book: ${bookSlug}. Available: ${Object.keys(BOOK_CONFIGS).join(', ')}`);
  }

  const paths = getBookPaths(bookSlug);
  await ensureDir(paths.root);

  // Check if capture-meta already exists
  if (await fileExists(paths.captureMeta)) {
    log.warn(`capture-meta.json already exists at ${paths.captureMeta}`);
    log.warn('Delete it first if you want to regenerate.');
    process.exit(1);
  }

  // Connect to browser
  log.info(`Connecting to browser at ${cdpUrl}...`);
  let browser: Browser;
  try {
    browser = await chromium.connectOverCDP(cdpUrl);
    log.info('Connected to browser via CDP');
  } catch (err) {
    log.error('Failed to connect. Ensure Chromium is running with --remote-debugging-port=9222');
    throw err;
  }

  const contexts = browser.contexts();
  if (contexts.length === 0) throw new Error('No browser contexts found');

  const context = contexts[0];
  const pages = context.pages();
  const readerPage = pages.find(p => p.url().includes('read.amazon.com'));
  if (!readerPage) {
    throw new Error('No Cloud Reader page found. Navigate to the book first.');
  }

  log.info(`Found reader page: ${readerPage.url()}`);

  // Verify this is the right book
  if (!readerPage.url().includes(bookConfig.asin)) {
    log.warn(`Current page ASIN doesn't match config. Expected ${bookConfig.asin}`);
    log.warn(`Page URL: ${readerPage.url()}`);
    log.warn('Continuing anyway — verify manually.');
  }

  // Check fixed-layout format
  const format = await readerPage.evaluate(() => {
    const img = document.querySelector('.kg-full-page-img img') as HTMLImageElement | null;
    return {
      isFixedLayout: !!img,
      imageWidth: img?.naturalWidth ?? 0,
      imageHeight: img?.naturalHeight ?? 0,
    };
  });

  if (!format.isFixedLayout) {
    log.error('This book is NOT fixed-layout (no .kg-full-page-img img found).');
    log.error('The capture pipeline requires fixed-layout. Aborting.');
    process.exit(1);
  }

  log.info(`Fixed-layout confirmed. Image resolution: ${format.imageWidth}x${format.imageHeight}`);

  // Read total pages from footer
  const footerEl = readerPage.locator('[role="contentinfo"]');
  const footerText = await footerEl.textContent({ timeout: 5000 }) ?? '';
  const totalPages = parseTotalPages(footerText);
  if (!totalPages) {
    throw new Error(`Could not parse total pages from footer: "${footerText}"`);
  }
  log.info(`Total pages: ${totalPages}`);

  // Open TOC panel
  log.info('Opening Table of Contents...');
  const tocButton = readerPage.getByRole('button', { name: 'Table of Contents' });
  await tocButton.click({ force: true, timeout: 5000 });
  await sleep(1500);

  // Count TOC entries
  const listbox = readerPage.locator('[role="listbox"]');
  const items = listbox.locator('[role="listitem"]');
  const itemCount = await items.count();
  log.info(`Found ${itemCount} TOC entries`);

  if (itemCount === 0) {
    throw new Error('No TOC entries found. The TOC panel may not have opened.');
  }

  // First pass: collect all titles to identify chapter range
  const titles: string[] = [];
  for (let i = 0; i < itemCount; i++) {
    const btn = items.nth(i).locator('button').first();
    const text = await btn.textContent({ timeout: 2000 });
    titles.push(text?.trim() ?? '');
  }

  // Find first and last chapter indices
  let firstChapterIdx = -1;
  let lastChapterIdx = -1;
  for (let i = 0; i < titles.length; i++) {
    if (extractChapterNumber(titles[i]) !== null) {
      if (firstChapterIdx === -1) firstChapterIdx = i;
      lastChapterIdx = i;
    }
  }

  if (firstChapterIdx === -1) {
    throw new Error('No numbered chapters found in TOC. Check title parsing patterns.');
  }

  log.info(`Chapter range: indices ${firstChapterIdx}–${lastChapterIdx} (${lastChapterIdx - firstChapterIdx + 1} chapters)`);

  // Second pass: click each entry and collect page numbers
  const tocEntries: TocEntry[] = [];
  const failedIndices: number[] = [];

  for (let i = 0; i < itemCount; i++) {
    try {
      const item = items.nth(i);
      const btn = item.locator('button').first();

      // Scroll into view to avoid viewport issues
      await item.scrollIntoViewIfNeeded({ timeout: 3000 });
      await sleep(300);

      await btn.click({ force: true, timeout: 5000 });
      await sleep(navDelay);

      const footer = await footerEl.textContent({ timeout: 3000 }) ?? '';
      const pageNum = parsePageNumber(footer);

      const entryType = classifyTocEntry(titles[i], i, firstChapterIdx, lastChapterIdx);
      const chapterNum = entryType === 'chapter' ? extractChapterNumber(titles[i]) : undefined;

      const entry: TocEntry = {
        index: i,
        title: titles[i],
        pageNumber: pageNum,
        type: entryType,
        readerLocation: 0,
      };
      if (chapterNum !== undefined && chapterNum !== null) {
        entry.chapterNumber = chapterNum;
      }

      tocEntries.push(entry);
      log.progress(i + 1, itemCount, `${titles[i]} → Page ${pageNum ?? '?'}`);
    } catch (err) {
      log.warn(`Failed entry ${i} ("${titles[i]}"): ${err}`);
      failedIndices.push(i);
    }
  }

  // Retry failed entries
  if (failedIndices.length > 0) {
    log.info(`Retrying ${failedIndices.length} failed entries...`);
    for (const i of failedIndices) {
      try {
        const item = items.nth(i);
        const btn = item.locator('button').first();
        await item.scrollIntoViewIfNeeded({ timeout: 3000 });
        await sleep(500);
        await btn.click({ timeout: 5000 });
        await sleep(navDelay + 500); // Extra delay for retries

        const footer = await footerEl.textContent({ timeout: 3000 }) ?? '';
        const pageNum = parsePageNumber(footer);

        const entryType = classifyTocEntry(titles[i], i, firstChapterIdx, lastChapterIdx);
        const chapterNum = entryType === 'chapter' ? extractChapterNumber(titles[i]) : undefined;

        const entry: TocEntry = {
          index: i,
          title: titles[i],
          pageNumber: pageNum,
          type: entryType,
          readerLocation: 0,
        };
        if (chapterNum !== undefined && chapterNum !== null) {
          entry.chapterNumber = chapterNum;
        }

        tocEntries.push(entry);
        log.info(`Retry succeeded: ${titles[i]} → Page ${pageNum ?? '?'}`);
      } catch (err) {
        log.error(`Retry failed for entry ${i} ("${titles[i]}"): ${err}`);
        // Insert placeholder
        tocEntries.push({
          index: i,
          title: titles[i],
          pageNumber: null,
          type: classifyTocEntry(titles[i], i, firstChapterIdx, lastChapterIdx),
          readerLocation: 0,
        });
      }
    }
  }

  // Sort by index (retries may be out of order)
  tocEntries.sort((a, b) => a.index - b.index);

  // Validate: check for null page numbers in chapters
  const nullChapters = tocEntries.filter(e => e.type === 'chapter' && e.pageNumber === null);
  if (nullChapters.length > 0) {
    log.warn(`${nullChapters.length} chapters have null page numbers — may need manual fix:`);
    for (const ch of nullChapters) {
      log.warn(`  ${ch.title}`);
    }
  }

  // Build capture-meta
  const captureMeta: CaptureMeta = {
    book: {
      title: bookConfig.title,
      author: bookConfig.author,
      publisher: 'Self-Realization Fellowship',
      asin: bookConfig.asin,
      readerUrl: bookConfig.readerUrl,
      totalPages,
      readerLocationMax: 0,
      language: bookConfig.language,
      authorTier: bookConfig.authorTier,
    },
    toc: tocEntries,
    capture: {
      capturedAt: new Date().toISOString(),
      imageResolution: {
        width: format.imageWidth,
        height: format.imageHeight,
      },
      captureMethod: 'playwright-element-screenshot-device-scale',
      tocCollectionMethod: 'collect-toc-script-playwright-cdp',
      notes: `Automated TOC collection via collect-toc.ts. ${tocEntries.length} entries, ${tocEntries.filter(e => e.type === 'chapter').length} chapters. Navigation delay: ${navDelay}ms.`,
    },
  };

  // Write capture-meta.json
  await writeJson(paths.captureMeta, captureMeta);
  log.info(`capture-meta.json written to ${paths.captureMeta}`);

  // Summary
  const frontMatter = tocEntries.filter(e => e.type === 'front-matter').length;
  const chapters = tocEntries.filter(e => e.type === 'chapter').length;
  const backMatter = tocEntries.filter(e => e.type === 'back-matter').length;
  log.info(`Summary: ${frontMatter} front-matter, ${chapters} chapters, ${backMatter} back-matter`);

  if (bookConfig.expectedChapters && chapters !== bookConfig.expectedChapters) {
    log.warn(`Expected ${bookConfig.expectedChapters} chapters but found ${chapters}`);
  }
}

// Run
const { bookSlug, cdpUrl, navDelay } = parseArgs();
collectToc(bookSlug, cdpUrl, navDelay).catch(err => {
  log.error('TOC collection failed:', err);
  process.exit(1);
});
