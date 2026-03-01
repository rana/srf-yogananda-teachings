#!/usr/bin/env npx tsx
/**
 * Book Page Capture Script
 *
 * Captures all pages of a book as high-resolution PNG images using Playwright.
 * Connects to an existing browser session (cloud reader must be open and authenticated).
 *
 * Two page-tracking modes (auto-detected):
 * - Footer-based: Reader shows "Page N of M ● X%" in footer (e.g. Spanish edition)
 * - Sequential: No footer text — captures pages by counting forward with hash-based
 *   page-change detection (e.g. English fixed-layout edition)
 *
 * Usage:
 *   npx tsx src/capture.ts --book autobiography-of-a-yogi [--resume-from 100] [--cdp-url ws://...]
 */

import { chromium, type Browser, type Page } from 'playwright';
import path from 'path';
import fs from 'fs/promises';
import { getBookPaths, getPipelineConfig } from './config.js';
import { CaptureMeta, CaptureLogEntry } from './types.js';
import {
  ensureDir, readJson, writeJson, padPage, parseFooterPageNumber,
  footerHasPageNumber, bufferHash, log, sleep, fileExists, getFileSize
} from './utils.js';

/** Parse CLI arguments */
function parseArgs(): { bookSlug: string; resumeFrom?: number; cdpUrl: string } {
  const args = process.argv.slice(2);
  let bookSlug = 'autobiography-of-a-yogi';
  let resumeFrom: number | undefined;
  let cdpUrl = 'http://localhost:9222';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--book' && args[i + 1]) {
      bookSlug = args[i + 1];
      i++;
    } else if (args[i] === '--resume-from' && args[i + 1]) {
      resumeFrom = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--cdp-url' && args[i + 1]) {
      cdpUrl = args[i + 1];
      i++;
    }
  }

  return { bookSlug, resumeFrom, cdpUrl };
}

/** Read footer text from the reader */
async function getFooterText(page: Page): Promise<string> {
  return page.evaluate(() => {
    const ionFooter = document.querySelector('ion-footer');
    if (ionFooter?.textContent?.trim()) return ionFooter.textContent.trim();

    const footer = document.querySelector('[class*="footer"]');
    if (footer?.textContent?.trim()) return footer.textContent.trim();

    const contentinfo = document.querySelector('[role="contentinfo"]');
    if (contentinfo?.textContent?.trim()) return contentinfo.textContent.trim();

    return '';
  });
}

/** Get the current page image hash without saving to disk */
async function getCurrentImageHash(page: Page): Promise<string> {
  const img = page.locator('.kg-full-page-img img');
  await img.waitFor({ state: 'visible', timeout: 10000 });
  const buffer = await img.screenshot({ scale: 'device' });
  return bufferHash(buffer);
}

/** Get viewport dimensions */
async function getViewportDims(page: Page): Promise<{ width: number; height: number }> {
  return page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));
}

/** Click to advance one page view (single right-click) */
async function clickRight(page: Page, dims: { width: number; height: number }): Promise<void> {
  await page.mouse.click(dims.width - 50, dims.height / 2);
  await sleep(350);
}

/** Click to go back one page view (single left-click) */
async function clickLeft(page: Page, dims: { width: number; height: number }): Promise<void> {
  await page.mouse.click(50, dims.height / 2);
  await sleep(350);
}

/** Navigate to a specific page using TOC */
async function navigateToPage(page: Page, targetPage: number, captureMeta: CaptureMeta): Promise<void> {
  const tocEntries = captureMeta.toc.filter(e => e.pageNumber !== null && e.pageNumber <= targetPage);
  const closest = tocEntries[tocEntries.length - 1];

  if (!closest) {
    log.warn(`No TOC entry found before page ${targetPage}, starting from beginning`);
    return;
  }

  log.info(`Navigating to ${closest.title} (page ${closest.pageNumber}) via TOC`);

  // Open TOC
  await page.mouse.move(400, 30);
  await sleep(600);

  const tocButton = page.locator('[data-testid="top_menu_table_of_contents"]').first();
  await tocButton.click({ force: true });
  await sleep(2000);

  // Click the TOC entry
  const clicked = await page.evaluate((title: string) => {
    const buttons = document.querySelectorAll('button[aria-label]');
    for (const btn of buttons) {
      if (btn.getAttribute('aria-label')?.includes(title.substring(0, 30))) {
        (btn as HTMLElement).click();
        return true;
      }
    }
    return false;
  }, closest.title);

  if (!clicked) {
    log.warn(`Could not find TOC entry: ${closest.title}`);
  }

  await sleep(1500);

  // Close TOC
  await page.keyboard.press('Escape');
  await sleep(800);
}

/**
 * Advance one physical page forward (footer-based mode).
 * Clicks until the footer page number changes.
 */
async function advanceOnePageFooter(page: Page, dims: { width: number; height: number }): Promise<string> {
  const startFooter = await getFooterText(page);
  const startPage = parseFooterPageNumber(startFooter);

  for (let click = 0; click < 15; click++) {
    await clickRight(page, dims);

    const footer = await getFooterText(page);
    const currentPage = parseFooterPageNumber(footer);

    if (currentPage !== null && startPage !== null && currentPage !== startPage) {
      return footer;
    }

    // Location-based pages (front matter): any change counts
    if (!footerHasPageNumber(footer) && !footerHasPageNumber(startFooter)) {
      if (footer !== startFooter) {
        return footer;
      }
    }
  }

  return await getFooterText(page);
}

/**
 * Advance one page forward (hash-based mode).
 * Clicks right and verifies the page image actually changed.
 * Returns the new image hash, or null if the page didn't change (end of book).
 */
async function advanceOnePageHash(page: Page, dims: { width: number; height: number }, currentHash: string): Promise<string | null> {
  await clickRight(page, dims);

  // Check if page actually changed
  for (let retry = 0; retry < 5; retry++) {
    const newHash = await getCurrentImageHash(page);
    if (newHash !== currentHash) {
      return newHash;
    }
    // Page might still be rendering — wait a bit more
    await sleep(200);
  }

  // One more click in case the first was absorbed by UI chrome
  await clickRight(page, dims);
  await sleep(400);

  const finalHash = await getCurrentImageHash(page);
  return finalHash !== currentHash ? finalHash : null;
}

/** Capture screenshot of the current page at device scale */
async function capturePageImage(page: Page, outputPath: string): Promise<{ size: number; hash: string }> {
  const img = page.locator('.kg-full-page-img img');
  await img.waitFor({ state: 'visible', timeout: 10000 });

  const buffer = await img.screenshot({ scale: 'device' });
  await fs.writeFile(outputPath, buffer);

  return {
    size: buffer.length,
    hash: bufferHash(buffer)
  };
}

/** Detect whether the reader provides footer page numbers */
async function detectTrackingMode(page: Page): Promise<'footer' | 'sequential'> {
  const footer = await getFooterText(page);
  if (footerHasPageNumber(footer) || footer.includes('Location')) {
    log.info(`Tracking mode: footer-based (footer text: "${footer}")`);
    return 'footer';
  }
  log.info('Tracking mode: sequential (no footer text detected)');
  return 'sequential';
}

/** Main capture loop */
async function runCapture(bookSlug: string, resumeFrom?: number, cdpUrl?: string): Promise<void> {
  const config = getPipelineConfig(bookSlug);
  const paths = getBookPaths(bookSlug);

  await ensureDir(paths.pages);

  if (!await fileExists(paths.captureMeta)) {
    throw new Error(`capture-meta.json not found at ${paths.captureMeta}. Run Phase 0 first.`);
  }
  const captureMeta = await readJson<CaptureMeta>(paths.captureMeta);
  const totalPages = captureMeta.book.totalPages;

  log.info(`Starting capture for "${captureMeta.book.title}" (${totalPages} pages)`);

  // Load or initialize capture log
  const captureLogPath = paths.captureLog;
  let captureLog: CaptureLogEntry[] = [];
  if (await fileExists(captureLogPath)) {
    captureLog = await readJson<CaptureLogEntry[]>(captureLogPath);
    log.info(`Loaded existing capture log with ${captureLog.length} entries`);
  }

  const startPage = resumeFrom ?? 1;
  const capturedPages = new Set(captureLog.map(e => e.pageNumber));

  log.info(`Will capture pages ${startPage} to ${totalPages}`);
  if (capturedPages.size > 0) {
    log.info(`${capturedPages.size} pages already captured, will skip those`);
  }

  // Connect to browser
  let browser: Browser;
  try {
    browser = await chromium.connectOverCDP(cdpUrl || 'http://localhost:9222');
    log.info('Connected to browser via CDP');
  } catch (err) {
    log.error('Failed to connect to browser. Make sure Chromium is running with --remote-debugging-port=9222');
    log.error('  chromium --remote-debugging-port=9222');
    throw err;
  }

  const contexts = browser.contexts();
  if (contexts.length === 0) {
    throw new Error('No browser contexts found');
  }

  const context = contexts[0];
  const browserPages = context.pages();

  const readerPage = browserPages.find(p => p.url().includes('read.amazon.com'));
  if (!readerPage) {
    throw new Error('No cloud reader page found. Navigate to the book first.');
  }

  log.info(`Found reader page: ${readerPage.url()}`);

  // Navigate to start
  await navigateToPage(readerPage, startPage, captureMeta);
  await sleep(1000);

  // Auto-detect tracking mode
  const trackingMode = await detectTrackingMode(readerPage);
  const dims = await getViewportDims(readerPage);

  // For sequential mode with resume, we need to advance from the TOC entry to the exact page
  if (trackingMode === 'sequential' && startPage > 1) {
    // TOC navigation got us close; advance to exact start page by counting clicks
    const closestToc = captureMeta.toc
      .filter(e => e.pageNumber !== null && e.pageNumber <= startPage)
      .pop();
    const tocPage = closestToc?.pageNumber ?? 1;
    const clicksNeeded = startPage - tocPage;
    if (clicksNeeded > 0) {
      log.info(`Sequential resume: advancing ${clicksNeeded} pages from TOC entry (page ${tocPage}) to page ${startPage}`);
      let hash = await getCurrentImageHash(readerPage);
      for (let i = 0; i < clicksNeeded; i++) {
        const newHash = await advanceOnePageHash(readerPage, dims, hash);
        if (newHash) hash = newHash;
      }
    }
  }

  // Capture loop
  let consecutiveErrors = 0;
  let previousHash = '';

  for (let targetPage = startPage; targetPage <= totalPages; targetPage++) {
    if (capturedPages.has(targetPage)) {
      log.info(`Skipping page ${targetPage} (already captured)`);
      // In sequential mode, we still need to advance past skipped pages
      if (trackingMode === 'sequential' && targetPage < totalPages) {
        const hash = await getCurrentImageHash(readerPage);
        await advanceOnePageHash(readerPage, dims, hash);
      }
      continue;
    }

    try {
      // Footer-based mode: verify we're on the right page and navigate if not
      if (trackingMode === 'footer') {
        const footer = await getFooterText(readerPage);
        const currentPage = parseFooterPageNumber(footer);

        if (currentPage !== null && currentPage !== targetPage) {
          if (currentPage < targetPage) {
            while (true) {
              const newFooter = await advanceOnePageFooter(readerPage, dims);
              const newPage = parseFooterPageNumber(newFooter);
              if (newPage !== null && newPage >= targetPage) break;
              if (newPage === currentPage) {
                log.warn(`Stuck on page ${currentPage}, navigating via TOC`);
                await navigateToPage(readerPage, targetPage, captureMeta);
                break;
              }
            }
          } else {
            // Go back via TOC (simpler than clicking left many times)
            await navigateToPage(readerPage, targetPage, captureMeta);
          }
        }
      }

      // Wait for render
      await sleep(200);

      // Capture the page
      const outputPath = path.join(paths.pages, `page-${padPage(targetPage)}.png`);
      const { size, hash } = await capturePageImage(readerPage, outputPath);

      // Duplicate detection
      if (hash === previousHash) {
        log.warn(`Page ${targetPage} has same hash as previous page — possible duplicate`);
      }
      previousHash = hash;

      if (size < 5000) {
        log.warn(`Page ${targetPage}: suspiciously small file (${size} bytes)`);
      }

      // Record in capture log
      const logEntry: CaptureLogEntry = {
        pageNumber: targetPage,
        capturedAt: new Date().toISOString(),
        filePath: `pages/page-${padPage(targetPage)}.png`,
        fileSize: size,
        footerText: await getFooterText(readerPage),
        imageHash: hash
      };
      captureLog.push(logEntry);
      capturedPages.add(targetPage);

      if (targetPage % 10 === 0 || targetPage === totalPages) {
        await writeJson(captureLogPath, captureLog);
      }

      log.progress(targetPage, totalPages, `Captured page ${targetPage} (${size} bytes)`);

      // Advance to next page
      if (targetPage < totalPages) {
        if (trackingMode === 'footer') {
          await advanceOnePageFooter(readerPage, dims);
        } else {
          // Sequential mode: single click + hash verification
          const newHash = await advanceOnePageHash(readerPage, dims, hash);
          if (newHash === null && targetPage < totalPages - 1) {
            log.warn(`Page ${targetPage}: advance click didn't change page — retrying with extra click`);
            // Additional retry with longer wait
            await sleep(500);
            await clickRight(readerPage, dims);
            await sleep(500);
          }
        }
      }

      consecutiveErrors = 0;

    } catch (err) {
      consecutiveErrors++;
      log.error(`Error capturing page ${targetPage}: ${err}`);

      if (consecutiveErrors >= 5) {
        log.error('Too many consecutive errors, saving progress and stopping');
        await writeJson(captureLogPath, captureLog);
        throw err;
      }

      // Try to recover via TOC
      log.info('Attempting recovery via TOC navigation');
      try {
        await navigateToPage(readerPage, targetPage, captureMeta);
        await sleep(1000);

        // In sequential mode, we can't verify position via footer, so just continue
        if (trackingMode === 'sequential') {
          log.info(`Recovery: re-navigated via TOC, continuing from page ${targetPage}`);
        }
      } catch {
        log.error('Recovery failed');
      }
    }
  }

  // Final save
  await writeJson(captureLogPath, captureLog);
  log.info(`Capture complete! ${captureLog.length} pages captured.`);
}

// Run if called directly
const { bookSlug, resumeFrom, cdpUrl } = parseArgs();
runCapture(bookSlug, resumeFrom, cdpUrl).catch(err => {
  log.error('Capture failed:', err);
  process.exit(1);
});
