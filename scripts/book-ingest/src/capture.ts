#!/usr/bin/env npx tsx
/**
 * Book Page Capture Script
 *
 * Captures all pages of a book as high-resolution PNG images using Playwright.
 * Connects to an existing browser session (cloud reader must be open and authenticated).
 *
 * Usage:
 *   npx tsx src/capture.ts --book autobiography-of-a-yogi [--resume-from 100] [--cdp-url ws://...]
 *
 * The script:
 * 1. Connects to an existing Chromium browser via CDP
 * 2. Navigates to page 1 (or resume page)
 * 3. For each page: captures screenshot at device scale (2x), records metadata
 * 4. Advances to next page by clicking right side of viewport
 * 5. Handles virtual page vs physical page mismatch (multiple clicks per physical page)
 * 6. Saves capture log for resume capability
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
    // Try multiple selectors for the footer
    const ionFooter = document.querySelector('ion-footer');
    if (ionFooter?.textContent?.trim()) return ionFooter.textContent.trim();

    const footer = document.querySelector('[class*="footer"]');
    if (footer?.textContent?.trim()) return footer.textContent.trim();

    const contentinfo = document.querySelector('[role="contentinfo"]');
    if (contentinfo?.textContent?.trim()) return contentinfo.textContent.trim();

    return '';
  });
}

/** Navigate to a specific page using TOC */
async function navigateToPage(page: Page, targetPage: number, captureMeta: CaptureMeta): Promise<void> {
  // Find the closest TOC entry before the target page
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

  // Click the TOC entry using JavaScript (handles viewport issues)
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

  // Now advance page by page to the target
  let currentFooter = await getFooterText(page);
  let currentPage = parseFooterPageNumber(currentFooter);

  while (currentPage !== null && currentPage < targetPage) {
    await advanceOnePage(page);
    currentFooter = await getFooterText(page);
    currentPage = parseFooterPageNumber(currentFooter);
  }
}

/** Advance one physical page forward */
async function advanceOnePage(page: Page): Promise<string> {
  const startFooter = await getFooterText(page);
  const startPage = parseFooterPageNumber(startFooter);

  // Click right side of viewport to advance
  const dims = await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));

  // Multiple clicks may be needed for multi-screen physical pages
  for (let click = 0; click < 15; click++) {
    await page.mouse.click(dims.width - 50, dims.height / 2);
    await sleep(300);

    const footer = await getFooterText(page);
    const currentPage = parseFooterPageNumber(footer);

    // If page number changed, we've advanced one physical page
    if (currentPage !== null && startPage !== null && currentPage !== startPage) {
      return footer;
    }

    // If we're in location mode (front matter) and location changed significantly
    if (!footerHasPageNumber(footer) && !footerHasPageNumber(startFooter)) {
      // For location-based pages, any advancement counts
      if (footer !== startFooter) {
        return footer;
      }
    }
  }

  // Return whatever footer we have after max clicks
  return await getFooterText(page);
}

/** Go back one physical page */
async function goBackOnePage(page: Page): Promise<string> {
  const startFooter = await getFooterText(page);
  const startPage = parseFooterPageNumber(startFooter);

  for (let click = 0; click < 15; click++) {
    await page.mouse.click(50, 425);
    await sleep(300);

    const footer = await getFooterText(page);
    const currentPage = parseFooterPageNumber(footer);

    if (currentPage !== null && startPage !== null && currentPage !== startPage) {
      return footer;
    }

    if (!footerHasPageNumber(footer) && !footerHasPageNumber(startFooter)) {
      if (footer !== startFooter) {
        return footer;
      }
    }
  }

  return await getFooterText(page);
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

/** Main capture loop */
async function runCapture(bookSlug: string, resumeFrom?: number, cdpUrl?: string): Promise<void> {
  const config = getPipelineConfig(bookSlug);
  const paths = getBookPaths(bookSlug);

  // Ensure directories exist
  await ensureDir(paths.pages);

  // Read capture metadata
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

  // Determine start page
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
    log.error('Or run: chromium --remote-debugging-port=9222');
    throw err;
  }

  const contexts = browser.contexts();
  if (contexts.length === 0) {
    throw new Error('No browser contexts found');
  }

  const context = contexts[0];
  const pages = context.pages();

  // Find the reader page
  let readerPage = pages.find(p => p.url().includes('read.amazon.com'));
  if (!readerPage) {
    throw new Error('No cloud reader page found. Navigate to the book first.');
  }

  log.info(`Found reader page: ${readerPage.url()}`);

  // Navigate to start page
  if (startPage > 1) {
    await navigateToPage(readerPage, startPage, captureMeta);
  } else {
    // Navigate to beginning (Title Page)
    await navigateToPage(readerPage, 1, captureMeta);
  }

  // Wait for page to render
  await sleep(1000);

  // Capture loop
  let consecutiveErrors = 0;
  let lastCapturedPage = 0;
  let previousHash = '';

  for (let targetPage = startPage; targetPage <= totalPages; targetPage++) {
    // Skip already captured pages
    if (capturedPages.has(targetPage)) {
      log.info(`Skipping page ${targetPage} (already captured)`);
      continue;
    }

    try {
      // Verify we're on the right page
      const footer = await getFooterText(readerPage);
      const currentPage = parseFooterPageNumber(footer);

      // If we're not on the target page, navigate there
      if (currentPage !== null && currentPage !== targetPage) {
        if (currentPage < targetPage) {
          // Need to advance
          while (true) {
            const newFooter = await advanceOnePage(readerPage);
            const newPage = parseFooterPageNumber(newFooter);
            if (newPage !== null && newPage >= targetPage) break;
            // Safety: if we're not making progress, navigate via TOC
            if (newPage === currentPage) {
              log.warn(`Stuck on page ${currentPage}, navigating via TOC`);
              await navigateToPage(readerPage, targetPage, captureMeta);
              break;
            }
          }
        } else if (currentPage > targetPage) {
          // Need to go back
          while (true) {
            const newFooter = await goBackOnePage(readerPage);
            const newPage = parseFooterPageNumber(newFooter);
            if (newPage !== null && newPage <= targetPage) break;
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

      // Validate capture
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

      // Save capture log every 10 pages
      if (targetPage % 10 === 0 || targetPage === totalPages) {
        await writeJson(captureLogPath, captureLog);
      }

      log.progress(targetPage, totalPages, `Captured page ${targetPage} (${size} bytes)`);

      // Advance to next page
      if (targetPage < totalPages) {
        await advanceOnePage(readerPage);
      }

      consecutiveErrors = 0;
      lastCapturedPage = targetPage;

    } catch (err) {
      consecutiveErrors++;
      log.error(`Error capturing page ${targetPage}: ${err}`);

      if (consecutiveErrors >= 5) {
        log.error('Too many consecutive errors, saving progress and stopping');
        await writeJson(captureLogPath, captureLog);
        throw err;
      }

      // Try to recover by navigating via TOC
      log.info('Attempting recovery via TOC navigation');
      try {
        await navigateToPage(readerPage, targetPage, captureMeta);
      } catch {
        log.error('Recovery failed');
      }
    }
  }

  // Final save
  await writeJson(captureLogPath, captureLog);
  log.info(`Capture complete! ${captureLog.length} pages captured.`);

  // Don't disconnect — leave browser open for user
}

// Run if called directly
const { bookSlug, resumeFrom, cdpUrl } = parseArgs();
runCapture(bookSlug, resumeFrom, cdpUrl).catch(err => {
  log.error('Capture failed:', err);
  process.exit(1);
});
