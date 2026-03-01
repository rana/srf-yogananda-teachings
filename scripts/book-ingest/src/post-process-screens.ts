#!/usr/bin/env npx tsx
/**
 * Post-process reflowable book screen captures into page-based format.
 *
 * For reflowable Kindle books, each physical page spans multiple screens.
 * This script:
 * 1. Reads screen metadata (screen → footer text mapping)
 * 2. Parses page numbers from footers
 * 3. Renames screen files to sequential page files (page-NNNN.png)
 * 4. Creates a screen-aware capture-meta.json with remapped TOC
 * 5. Generates capture-log.json for the extraction pipeline
 *
 * Usage:
 *   npx tsx src/post-process-screens.ts --book autobiography-of-a-yogi
 */

import fs from 'fs/promises';
import path from 'path';
import { getBookPaths } from './config.js';
import { CaptureMeta, CaptureLogEntry } from './types.js';
import {
  ensureDir, readJson, writeJson, padPage, parseFooterPageNumber,
  log, fileExists, bufferHash
} from './utils.js';

interface ScreenMetaEntry {
  screen: number;
  footer: string;
}

interface ScreenPageMapping {
  screenNumber: number;
  bookPageNumber: number | null;  // null for front matter / transitions
  footer: string;
}

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

/** Parse page number from footer, handling "Location N" and empty footers */
function parsePageFromFooter(footer: string): number | null {
  if (!footer) return null;
  const pageMatch = footer.match(/Page\s+(\d+)\s+of/);
  if (pageMatch) return parseInt(pageMatch[1], 10);
  return null;  // Location-based or empty
}

/** Build screen→page mapping from metadata + interpolation */
function buildScreenPageMapping(
  metadata: ScreenMetaEntry[],
  totalScreens: number,
  anchorPoints: Array<{ screen: number; page: number }>
): ScreenPageMapping[] {
  const mapping: ScreenPageMapping[] = [];

  // Phase 1: use exact metadata for screens we have data for
  for (const entry of metadata) {
    mapping.push({
      screenNumber: entry.screen,
      bookPageNumber: parsePageFromFooter(entry.footer),
      footer: entry.footer
    });
  }

  // Phase 2: interpolate for remaining screens using anchor points
  if (metadata.length < totalScreens) {
    const lastMetaScreen = metadata.length;
    const lastMetaPage = mapping[mapping.length - 1]?.bookPageNumber ?? 286;

    // Build interpolation segments from anchor points
    const segments = [
      { screen: lastMetaScreen, page: lastMetaPage },
      ...anchorPoints.filter(a => a.screen > lastMetaScreen)
    ];

    for (let s = lastMetaScreen + 1; s <= totalScreens; s++) {
      // Find the segment this screen falls in
      let prevAnchor = segments[0];
      let nextAnchor = segments[segments.length - 1];

      for (let i = 0; i < segments.length - 1; i++) {
        if (s >= segments[i].screen && s <= segments[i + 1].screen) {
          prevAnchor = segments[i];
          nextAnchor = segments[i + 1];
          break;
        }
      }

      const ratio = (s - prevAnchor.screen) / (nextAnchor.screen - prevAnchor.screen);
      const interpolatedPage = Math.round(prevAnchor.page + ratio * (nextAnchor.page - prevAnchor.page));

      mapping.push({
        screenNumber: s,
        bookPageNumber: Math.min(interpolatedPage, 558),
        footer: `Page ${interpolatedPage} of 558 (interpolated)`
      });
    }
  }

  return mapping;
}

/** For screens with null page number, fill forward from nearest known page */
function fillNullPages(mapping: ScreenPageMapping[]): void {
  let lastKnownPage = 0;
  for (const entry of mapping) {
    if (entry.bookPageNumber !== null) {
      lastKnownPage = entry.bookPageNumber;
    } else {
      entry.bookPageNumber = lastKnownPage;
    }
  }
}

/** Convert book page numbers to screen numbers for TOC remapping */
function buildPageToScreenMap(mapping: ScreenPageMapping[]): Map<number, number> {
  const pageToFirstScreen = new Map<number, number>();
  for (const entry of mapping) {
    if (entry.bookPageNumber !== null && !pageToFirstScreen.has(entry.bookPageNumber)) {
      pageToFirstScreen.set(entry.bookPageNumber, entry.screenNumber);
    }
  }
  return pageToFirstScreen;
}

async function run() {
  const { bookSlug } = parseArgs();
  const paths = getBookPaths(bookSlug);

  // Load screen metadata
  const metaPath = path.join(paths.root, 'screen-metadata.json');
  if (!await fileExists(metaPath)) {
    throw new Error(`screen-metadata.json not found at ${metaPath}`);
  }
  const metadata = await readJson<ScreenMetaEntry[]>(metaPath);
  log.info(`Loaded ${metadata.length} screen metadata entries`);

  // Count total screen files
  const pagesDir = paths.pages;
  const screenFiles = (await fs.readdir(pagesDir))
    .filter(f => f.startsWith('screen-') && f.endsWith('.png'))
    .sort();
  const totalScreens = screenFiles.length;
  log.info(`Found ${totalScreens} screen files`);

  if (totalScreens === 0) {
    throw new Error('No screen files found');
  }

  // Anchor points from capture batch summaries (for interpolation)
  const anchorPoints = [
    { screen: 600, page: 353 },
    { screen: 800, page: 476 },
    { screen: totalScreens, page: 558 }
  ];

  // Build mapping
  const mapping = buildScreenPageMapping(metadata, totalScreens, anchorPoints);
  fillNullPages(mapping);
  log.info(`Built mapping for ${mapping.length} screens`);

  // Save full mapping for reference
  await writeJson(path.join(paths.root, 'screen-page-mapping.json'), mapping);

  // Build page→screen lookup
  const pageToScreen = buildPageToScreenMap(mapping);
  log.info(`Mapped ${pageToScreen.size} unique book pages to first screen numbers`);

  // Rename screen files to page files (sequential numbering)
  log.info('Renaming screen files to page files...');
  const captureLog: CaptureLogEntry[] = [];

  for (let i = 0; i < totalScreens; i++) {
    const screenNum = i + 1;
    const screenFile = `screen-${String(screenNum).padStart(4, '0')}.png`;
    const pageFile = `page-${String(screenNum).padStart(4, '0')}.png`;
    const screenPath = path.join(pagesDir, screenFile);
    const pagePath = path.join(pagesDir, pageFile);

    if (await fileExists(screenPath)) {
      await fs.rename(screenPath, pagePath);

      const stat = await fs.stat(pagePath);
      captureLog.push({
        pageNumber: screenNum,
        capturedAt: new Date().toISOString(),
        filePath: `pages/${pageFile}`,
        fileSize: stat.size,
        footerText: mapping[i]?.footer ?? '',
        imageHash: ''  // Skip hash for speed
      });
    }

    if (screenNum % 100 === 0) {
      log.progress(screenNum, totalScreens, `Renamed ${screenNum} files`);
    }
  }

  log.info(`Renamed ${captureLog.length} screen files to page files`);

  // Save capture log
  await writeJson(paths.captureLog, captureLog);

  // Update capture-meta.json with screen-based pagination
  const captureMeta = await readJson<CaptureMeta>(paths.captureMeta);
  const originalTotalPages = captureMeta.book.totalPages;

  // Remap TOC page numbers to screen numbers
  const remappedToc = captureMeta.toc.map(entry => {
    const remapped = { ...entry };
    if (entry.pageNumber !== null) {
      const screenNum = pageToScreen.get(entry.pageNumber);
      if (screenNum !== undefined) {
        remapped.pageNumber = screenNum;
      } else {
        // Interpolate: find closest known page
        let closest = 1;
        for (const [bookPage, screen] of pageToScreen) {
          if (bookPage <= entry.pageNumber && bookPage > (pageToScreen.get(closest) ? closest : 0)) {
            closest = bookPage;
          }
        }
        const closestScreen = pageToScreen.get(closest) ?? 1;
        // Estimate offset
        const pagesPerScreen = 558 / totalScreens;
        remapped.pageNumber = Math.min(
          closestScreen + Math.round((entry.pageNumber - closest) / pagesPerScreen),
          totalScreens
        );
      }
    }
    return remapped;
  });

  // Save updated capture-meta.json
  const updatedMeta = {
    ...captureMeta,
    book: {
      ...captureMeta.book,
      totalPages: totalScreens,
      originalTotalPages: originalTotalPages,
      captureMode: 'reflowable-screens'
    },
    toc: remappedToc
  };

  // Back up original
  const backupPath = path.join(paths.root, 'capture-meta-original.json');
  if (!await fileExists(backupPath)) {
    await writeJson(backupPath, captureMeta);
    log.info(`Backed up original capture-meta.json to ${backupPath}`);
  }

  await writeJson(paths.captureMeta, updatedMeta);
  log.info(`Updated capture-meta.json: totalPages ${originalTotalPages} → ${totalScreens}`);

  // Summary stats
  const pagesWithMultipleScreens = new Map<number, number>();
  for (const m of mapping) {
    if (m.bookPageNumber !== null) {
      pagesWithMultipleScreens.set(
        m.bookPageNumber,
        (pagesWithMultipleScreens.get(m.bookPageNumber) ?? 0) + 1
      );
    }
  }

  let singleScreenPages = 0;
  let multiScreenPages = 0;
  for (const [, count] of pagesWithMultipleScreens) {
    if (count === 1) singleScreenPages++;
    else multiScreenPages++;
  }

  log.info(`Page distribution: ${singleScreenPages} single-screen pages, ${multiScreenPages} multi-screen pages`);
  log.info(`Average screens per page: ${(totalScreens / pageToScreen.size).toFixed(2)}`);
  log.info('Post-processing complete. Run extraction pipeline next.');
}

run().catch(err => {
  log.error('Post-processing failed:', err);
  process.exit(1);
});
