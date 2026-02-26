#!/usr/bin/env npx tsx
/**
 * Photo & Illustration Capture Script
 *
 * Captures photographs and illustrations embedded within cloud reader pages.
 * These images are composited into pre-rendered page blobs by the reader —
 * they don't exist as separate DOM elements.
 *
 * The script uses HTML5 Canvas extraction to obtain images at their native
 * resolution (naturalWidth × naturalHeight), independent of browser window size.
 * This is more reliable than element screenshots, which depend on display size.
 *
 * For each page known to have a photo/illustration (from extraction data):
 * 1. Navigates to the page
 * 2. Enumerates all virtual screens for that page number
 * 3. Extracts each screen via canvas at native resolution
 * 4. Saves to assets/ directory
 * 5. Builds a manifest linking captures to captions from extraction data
 *
 * Usage:
 *   npx tsx src/capture-photos.ts --book autobiography-of-a-yogi [--cdp-url ws://...]
 *
 * Prerequisites:
 *   - Chromium running with --remote-debugging-port=9222
 *   - Cloud reader open and authenticated with the book loaded
 *   - Extraction data available (Phase 2 complete)
 */

import { chromium, type Browser, type Page } from 'playwright';
import path from 'path';
import fs from 'fs/promises';
import { getBookPaths } from './config.js';
import { PageExtraction } from './types.js';
import {
  ensureDir, readJson, writeJson, padPage, parseFooterPageNumber,
  bufferHash, log, sleep, fileExists
} from './utils.js';

/** A captured photo/illustration screen */
interface PhotoCapture {
  /** The page number this screen belongs to */
  pageNumber: number;
  /** Virtual screen index within the page (1-based) */
  screenIndex: number;
  /** Total virtual screens for this page */
  totalScreens: number;
  /** Path to the saved image relative to book data dir */
  filePath: string;
  /** File size in bytes */
  fileSize: number;
  /** Image dimensions */
  width: number;
  height: number;
  /** SHA-256 hash */
  imageHash: string;
  /** Footer text when captured */
  footerText: string;
  /** Caption text from extraction data, if found */
  caption: string | null;
  /** Whether this screen contains a photo (vs text-only) based on file size heuristic */
  hasPhoto: boolean;
  /** Extraction method used */
  method: 'canvas-native';
  capturedAt: string;
}

/** Photo manifest */
interface PhotoManifest {
  bookSlug: string;
  capturedAt: string;
  totalPhotoPagesScanned: number;
  totalScreensCaptured: number;
  captures: PhotoCapture[];
}

function parseArgs() {
  const args = process.argv.slice(2);
  let bookSlug = 'autobiography-of-a-yogi';
  let cdpUrl = 'http://localhost:9222';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--book' && args[i + 1]) {
      bookSlug = args[i + 1];
      i++;
    } else if (args[i] === '--cdp-url' && args[i + 1]) {
      cdpUrl = args[i + 1];
      i++;
    }
  }

  return { bookSlug, cdpUrl };
}

/** Read footer text from the reader */
async function getFooterText(page: Page): Promise<string> {
  return page.evaluate(() => {
    const contentinfo = document.querySelector('[role="contentinfo"]');
    if (contentinfo?.textContent?.trim()) return contentinfo.textContent.trim();
    const ionFooter = document.querySelector('ion-footer');
    if (ionFooter?.textContent?.trim()) return ionFooter.textContent.trim();
    const footer = document.querySelector('[class*="footer"]');
    if (footer?.textContent?.trim()) return footer.textContent.trim();
    return '';
  });
}

/** Extract the current page image via canvas at native resolution.
 *  Returns the raw PNG buffer at naturalWidth × naturalHeight,
 *  independent of display size or browser window dimensions. */
async function extractPageImageViaCanvas(page: Page): Promise<{
  buffer: Buffer;
  width: number;
  height: number;
} | null> {
  const result = await page.evaluate(() => {
    const img = document.querySelector('.kg-full-page-img img') as HTMLImageElement | null;
    if (!img || !img.naturalWidth) return null;

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

    const dataUrl = canvas.toDataURL('image/png');
    return {
      base64: dataUrl.split(',')[1],
      width: img.naturalWidth,
      height: img.naturalHeight
    };
  });

  if (!result) return null;

  return {
    buffer: Buffer.from(result.base64, 'base64'),
    width: result.width,
    height: result.height
  };
}

/** Navigate to a target page by clicking forward/backward */
async function navigateToPage(page: Page, targetPage: number): Promise<boolean> {
  const dims = await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));

  for (let attempt = 0; attempt < 200; attempt++) {
    const footer = await getFooterText(page);
    const current = parseFooterPageNumber(footer);

    if (current === targetPage) return true;

    if (current === null || current < targetPage) {
      await page.mouse.click(dims.width - 50, dims.height / 2);
    } else {
      await page.mouse.click(50, dims.height / 2);
    }
    await sleep(350);

    // Check for no progress (stuck)
    const newFooter = await getFooterText(page);
    const newPage = parseFooterPageNumber(newFooter);
    if (newPage === current && attempt > 10) {
      log.warn(`Stuck navigating to page ${targetPage} (at ${current})`);
      return false;
    }
  }

  log.warn(`Could not reach page ${targetPage} after 200 attempts`);
  return false;
}

/** Find the first virtual screen of the current page by clicking left
 *  until the page number changes, then clicking right once */
async function rewindToFirstScreen(page: Page, pageNumber: number): Promise<void> {
  const dims = await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));

  for (let i = 0; i < 10; i++) {
    await page.mouse.click(50, dims.height / 2);
    await sleep(350);

    const footer = await getFooterText(page);
    const current = parseFooterPageNumber(footer);

    if (current !== pageNumber) {
      // Went past — go forward one to get back to first screen
      await page.mouse.click(dims.width - 50, dims.height / 2);
      await sleep(350);
      return;
    }
  }
}

/** Enumerate and capture all virtual screens for the current page number */
async function captureAllScreens(page: Page, pageNumber: number): Promise<Array<{
  buffer: Buffer;
  width: number;
  height: number;
  footer: string;
}>> {
  const dims = await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));

  const screens: Array<{ buffer: Buffer; width: number; height: number; footer: string }> = [];

  for (let screen = 0; screen < 8; screen++) {
    const footer = await getFooterText(page);
    const current = parseFooterPageNumber(footer);

    if (current !== pageNumber) break;

    const extracted = await extractPageImageViaCanvas(page);
    if (extracted) {
      screens.push({ ...extracted, footer });
    }

    // Advance to next virtual screen
    await page.mouse.click(dims.width - 50, dims.height / 2);
    await sleep(350);
  }

  return screens;
}

/** Scan extraction data to find pages with photos, illustrations, or captions */
async function findPhotoPages(extractedDir: string): Promise<Map<number, {
  hasPhoto: boolean;
  hasIllustration: boolean;
  captions: string[];
  pageType: string;
}>> {
  const photoPages = new Map<number, {
    hasPhoto: boolean;
    hasIllustration: boolean;
    captions: string[];
    pageType: string;
  }>();

  // Scan all extraction files
  const files = await fs.readdir(extractedDir);
  const jsonFiles = files.filter(f => f.endsWith('.json')).sort();

  for (const file of jsonFiles) {
    const extraction = await readJson<PageExtraction>(path.join(extractedDir, file));
    const pageNum = extraction.pageNumber;

    const hasPhoto = extraction.images.some(img => img.isPhotograph);
    const hasIllustration = extraction.images.some(img => img.isIllustration && !img.isDecorative);
    const captions = extraction.content
      .filter(b => b.type === 'caption')
      .map(b => b.text);
    const isPhotoPage = extraction.pageType === 'photograph' || extraction.pageType === 'illustration';

    if (hasPhoto || hasIllustration || captions.length > 0 || isPhotoPage) {
      photoPages.set(pageNum, {
        hasPhoto,
        hasIllustration,
        captions,
        pageType: extraction.pageType
      });
    }
  }

  return photoPages;
}

/** Main capture loop */
async function capturePhotos(bookSlug: string, cdpUrl: string): Promise<void> {
  const paths = getBookPaths(bookSlug);
  const assetsDir = paths.assets;
  await ensureDir(assetsDir);

  // Find photo pages from extraction data
  log.info('Scanning extraction data for photo/illustration pages...');
  const photoPages = await findPhotoPages(paths.extracted);
  const sortedPages = [...photoPages.keys()].sort((a, b) => a - b);

  log.info(`Found ${sortedPages.length} pages with photos/illustrations/captions:`);
  for (const p of sortedPages) {
    const info = photoPages.get(p)!;
    const tags = [
      info.hasPhoto && 'photo',
      info.hasIllustration && 'illustration',
      info.captions.length > 0 && `${info.captions.length} caption(s)`,
      info.pageType !== 'body' && info.pageType
    ].filter(Boolean).join(', ');
    log.info(`  Page ${p}: ${tags}`);
  }

  // Load existing manifest for resume
  const manifestPath = path.join(assetsDir, 'photo-manifest.json');
  let manifest: PhotoManifest = {
    bookSlug,
    capturedAt: new Date().toISOString(),
    totalPhotoPagesScanned: 0,
    totalScreensCaptured: 0,
    captures: []
  };
  if (await fileExists(manifestPath)) {
    manifest = await readJson<PhotoManifest>(manifestPath);
    log.info(`Loaded existing manifest with ${manifest.captures.length} captures`);
  }
  const alreadyCaptured = new Set(manifest.captures.map(c => c.pageNumber));

  // Connect to browser
  let browser: Browser;
  try {
    browser = await chromium.connectOverCDP(cdpUrl);
    log.info('Connected to browser via CDP');
  } catch (err) {
    log.error('Failed to connect to browser. Make sure Chromium is running with --remote-debugging-port=9222');
    throw err;
  }

  const contexts = browser.contexts();
  if (contexts.length === 0) throw new Error('No browser contexts found');

  const readerPage = contexts[0].pages().find(p => p.url().includes('read.amazon.com'));
  if (!readerPage) throw new Error('No cloud reader page found');

  log.info(`Found reader page: ${readerPage.url()}`);

  let totalCaptured = 0;

  for (let idx = 0; idx < sortedPages.length; idx++) {
    const targetPage = sortedPages[idx];
    const pageInfo = photoPages.get(targetPage)!;

    // Skip if already captured
    if (alreadyCaptured.has(targetPage)) {
      log.info(`[${idx + 1}/${sortedPages.length}] Skipping page ${targetPage} (already captured)`);
      continue;
    }

    log.info(`[${idx + 1}/${sortedPages.length}] Processing page ${targetPage}...`);

    // Navigate to target page
    const reached = await navigateToPage(readerPage, targetPage);
    if (!reached) {
      log.warn(`  Could not reach page ${targetPage}, skipping`);
      continue;
    }

    // Rewind to first virtual screen of this page
    await rewindToFirstScreen(readerPage, targetPage);

    // Capture all virtual screens
    const screens = await captureAllScreens(readerPage, targetPage);

    if (screens.length === 0) {
      log.warn(`  No screens captured for page ${targetPage}`);
      continue;
    }

    log.info(`  Found ${screens.length} virtual screen(s) for page ${targetPage}`);

    // Save each screen
    for (let s = 0; s < screens.length; s++) {
      const screen = screens[s];
      const hash = bufferHash(screen.buffer);
      const suffix = screens.length > 1 ? `-s${s + 1}` : '';
      const filename = `photo-p${padPage(targetPage)}${suffix}.png`;
      const outputPath = path.join(assetsDir, filename);

      await fs.writeFile(outputPath, screen.buffer);

      const capture: PhotoCapture = {
        pageNumber: targetPage,
        screenIndex: s + 1,
        totalScreens: screens.length,
        filePath: `assets/${filename}`,
        fileSize: screen.buffer.length,
        width: screen.width,
        height: screen.height,
        imageHash: hash,
        footerText: screen.footer,
        caption: pageInfo.captions.length > 0 ? pageInfo.captions.join(' — ') : null,
        hasPhoto: screen.buffer.length > 100000, // Photos tend to be >100KB
        method: 'canvas-native',
        capturedAt: new Date().toISOString()
      };

      manifest.captures.push(capture);
      totalCaptured++;

      const photoTag = capture.hasPhoto ? 'PHOTO' : 'text';
      log.info(`  Saved ${filename} (${screen.width}×${screen.height}, ${screen.buffer.length} bytes) [${photoTag}]`);
    }

    alreadyCaptured.add(targetPage);
    manifest.totalPhotoPagesScanned++;
    manifest.totalScreensCaptured += screens.length;

    // Save manifest periodically for resume
    if (totalCaptured % 5 === 0) {
      await writeJson(manifestPath, manifest);
    }
  }

  // Final save
  manifest.capturedAt = new Date().toISOString();
  await writeJson(manifestPath, manifest);

  // Summary
  const photos = manifest.captures.filter(c => c.hasPhoto);
  const textScreens = manifest.captures.filter(c => !c.hasPhoto);
  const withCaptions = manifest.captures.filter(c => c.caption);

  log.info(`\n=== Photo Capture Summary ===`);
  log.info(`Pages scanned: ${manifest.totalPhotoPagesScanned}`);
  log.info(`Total screens captured: ${manifest.totalScreensCaptured}`);
  log.info(`Photo screens: ${photos.length}`);
  log.info(`Text-only screens: ${textScreens.length}`);
  log.info(`Screens with captions: ${withCaptions.length}`);
  log.info(`Resolution: ${manifest.captures[0]?.width}×${manifest.captures[0]?.height} (native)`);
  log.info(`Method: canvas-native (independent of window size)`);
  log.info(`Manifest: ${manifestPath}`);
}

const { bookSlug, cdpUrl } = parseArgs();
capturePhotos(bookSlug, cdpUrl).catch(err => {
  log.error('Photo capture failed:', err);
  process.exit(1);
});
