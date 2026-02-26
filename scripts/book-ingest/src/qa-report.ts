#!/usr/bin/env npx tsx
/**
 * QA Report Generator
 *
 * Generates an HTML side-by-side review page for human QA.
 * Shows the original page image alongside the extracted text for flagged pages.
 *
 * Usage:
 *   npx tsx src/qa-report.ts --book autobiography-of-a-yogi [--all]
 */

import path from 'path';
import fs from 'fs/promises';
import { getBookPaths } from './config.js';
import { PageExtraction, CaptureMeta } from './types.js';
import { readJson, padPage, log, fileExists, ensureDir } from './utils.js';

function parseArgs() {
  const args = process.argv.slice(2);
  let bookSlug = 'autobiography-of-a-yogi';
  let showAll = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--book' && args[i + 1]) {
      bookSlug = args[i + 1];
      i++;
    } else if (args[i] === '--all') {
      showAll = true;
    }
  }

  return { bookSlug, showAll };
}

/** Convert a formatting span to HTML */
function formatText(text: string, formatting: Array<{ start: number; end: number; style: string }>): string {
  if (!formatting || formatting.length === 0) {
    return escapeHtml(text);
  }

  // Sort by start position
  const spans = [...formatting].sort((a, b) => a.start - b.start);
  let result = '';
  let lastEnd = 0;

  for (const span of spans) {
    // Add unformatted text before this span
    if (span.start > lastEnd) {
      result += escapeHtml(text.slice(lastEnd, span.start));
    }

    const content = escapeHtml(text.slice(span.start, span.end));
    switch (span.style) {
      case 'italic':
        result += `<em>${content}</em>`;
        break;
      case 'bold':
        result += `<strong>${content}</strong>`;
        break;
      case 'bold-italic':
        result += `<strong><em>${content}</em></strong>`;
        break;
      case 'small-caps':
        result += `<span style="font-variant:small-caps">${content}</span>`;
        break;
      case 'superscript':
        result += `<sup>${content}</sup>`;
        break;
      default:
        result += content;
    }
    lastEnd = span.end;
  }

  // Add remaining unformatted text
  if (lastEnd < text.length) {
    result += escapeHtml(text.slice(lastEnd));
  }

  return result;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

/** Generate the HTML report */
async function generateReport(bookSlug: string, showAll: boolean): Promise<void> {
  const paths = getBookPaths(bookSlug);
  await ensureDir(paths.qa);

  const captureMeta = await readJson<CaptureMeta>(paths.captureMeta);
  const totalPages = captureMeta.book.totalPages;

  log.info(`Generating QA report for "${captureMeta.book.title}"`);

  // Collect pages to show
  const pages: Array<{ pageNum: number; extraction: PageExtraction; imagePath: string }> = [];

  for (let p = 1; p <= totalPages; p++) {
    const extractedPath = path.join(paths.extracted, `page-${padPage(p)}.json`);
    const imagePath = path.join(paths.pages, `page-${padPage(p)}.png`);

    if (!await fileExists(extractedPath)) continue;
    if (!await fileExists(imagePath)) continue;

    const extraction = await readJson<PageExtraction>(extractedPath);

    if (showAll || extraction.validation.needsHumanReview || extraction.validation.confidence <= 3) {
      pages.push({ pageNum: p, extraction, imagePath: `../pages/page-${padPage(p)}.png` });
    }
  }

  log.info(`Including ${pages.length} pages in QA report`);

  // Generate HTML
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QA Report — ${escapeHtml(captureMeta.book.title)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Georgia', serif; background: #f5f5f0; color: #333; padding: 20px; }
    h1 { text-align: center; margin-bottom: 10px; color: #1a2744; }
    .summary { text-align: center; margin-bottom: 30px; color: #666; }
    .page-review {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .page-image { padding: 10px; background: #f0f0f0; }
    .page-image img { width: 100%; height: auto; border: 1px solid #ddd; }
    .page-text { padding: 20px; overflow-y: auto; max-height: 800px; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      background: #1a2744;
      color: white;
      grid-column: 1 / -1;
    }
    .page-header .page-num { font-weight: bold; }
    .page-header .page-type { opacity: 0.8; }
    .page-header .confidence {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.9em;
    }
    .confidence-5, .confidence-4 { background: #2d7d46; }
    .confidence-3 { background: #d4a017; color: #333; }
    .confidence-2, .confidence-1 { background: #c0392b; }
    .content-block { margin-bottom: 12px; }
    .content-block.heading { font-size: 1.4em; font-weight: bold; color: #1a2744; }
    .content-block.chapter-label { font-size: 0.9em; text-transform: uppercase; letter-spacing: 2px; color: #666; }
    .content-block.verse { font-style: italic; padding-left: 30px; white-space: pre-line; }
    .content-block.footnote { font-size: 0.85em; color: #666; border-top: 1px solid #ddd; padding-top: 8px; margin-top: 16px; }
    .content-block.caption { font-style: italic; text-align: center; color: #555; }
    .flags { margin-top: 10px; }
    .flag { background: #fff3cd; color: #856404; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; display: inline-block; margin: 2px; }
    .metadata { font-size: 0.8em; color: #999; margin-top: 10px; border-top: 1px solid #eee; padding-top: 8px; }
    .nav { position: fixed; bottom: 20px; right: 20px; display: flex; gap: 10px; }
    .nav a { background: #1a2744; color: white; padding: 10px 15px; border-radius: 4px; text-decoration: none; }
    .image-note { background: #e8f4f8; padding: 10px; border-radius: 4px; margin-bottom: 10px; }
    .continued { color: #888; font-style: italic; font-size: 0.85em; }
  </style>
</head>
<body>
  <h1>QA Report — ${escapeHtml(captureMeta.book.title)}</h1>
  <p class="summary">${pages.length} pages to review · Generated ${new Date().toISOString()}</p>

  ${pages.map((p, idx) => `
  <div class="page-review" id="page-${p.pageNum}">
    <div class="page-header">
      <span class="page-num">Page ${p.pageNum}</span>
      <span class="page-type">${p.extraction.pageType}${p.extraction.chapterNumber ? ` · Chapter ${p.extraction.chapterNumber}` : ''}</span>
      <span class="confidence confidence-${p.extraction.validation.confidence}">
        Confidence: ${p.extraction.validation.confidence}/5
      </span>
    </div>
    <div class="page-image">
      <img src="${p.imagePath}" alt="Page ${p.pageNum}" loading="lazy">
    </div>
    <div class="page-text">
      ${p.extraction.images.length > 0 ? `
        <div class="image-note">
          ${p.extraction.images.map(img => `📷 ${escapeHtml(img.description)}${img.caption ? ` — <em>${escapeHtml(img.caption)}</em>` : ''}`).join('<br>')}
        </div>
      ` : ''}
      ${p.extraction.content.map(block => `
        <div class="content-block ${block.type}">
          ${block.continuedFromPreviousPage ? '<span class="continued">↑ continued from previous page</span><br>' : ''}
          ${formatText(block.text, block.formatting)}
          ${block.continuesOnNextPage ? '<br><span class="continued">↓ continues on next page</span>' : ''}
        </div>
      `).join('')}
      ${p.extraction.validation.flags.length > 0 ? `
        <div class="flags">
          ${p.extraction.validation.flags.map(f => `<span class="flag">${escapeHtml(f)}</span>`).join('')}
        </div>
      ` : ''}
      <div class="metadata">
        Sanskrit: ${p.extraction.metadata.sanskritTerms.join(', ') || 'none'} ·
        Italics: ${p.extraction.metadata.hasItalics ? 'yes' : 'no'} ·
        Footnotes: ${p.extraction.metadata.hasFootnotes ? 'yes' : 'no'}
      </div>
    </div>
  </div>
  `).join('')}

  <nav class="nav">
    <a href="#page-${pages[0]?.pageNum || 1}">↑ Top</a>
  </nav>
</body>
</html>`;

  const reportPath = path.join(paths.qa, 'review.html');
  await fs.writeFile(reportPath, html, 'utf-8');
  log.info(`QA report saved to ${reportPath}`);

  // Also generate a flagged pages summary
  const flaggedPages = pages
    .filter(p => p.extraction.validation.needsHumanReview)
    .map(p => ({
      pageNumber: p.pageNum,
      pageType: p.extraction.pageType,
      confidence: p.extraction.validation.confidence,
      flags: p.extraction.validation.flags
    }));

  await fs.writeFile(
    path.join(paths.qa, 'flagged-pages.json'),
    JSON.stringify(flaggedPages, null, 2) + '\n',
    'utf-8'
  );
  log.info(`${flaggedPages.length} flagged pages saved to flagged-pages.json`);
}

const { bookSlug, showAll } = parseArgs();
generateReport(bookSlug, showAll).catch(err => {
  log.error('QA report generation failed:', err);
  process.exit(1);
});
