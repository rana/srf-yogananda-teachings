/**
 * Shared utilities for the book ingestion pipeline
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

/** Ensure a directory exists */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

/** Compute SHA-256 hash of a file */
export async function fileHash(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

/** Compute SHA-256 hash of a buffer */
export function bufferHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/** Read JSON file */
export async function readJson<T>(filePath: string): Promise<T> {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data) as T;
}

/** Write JSON file with pretty formatting */
export async function writeJson(filePath: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

/** Format page number as zero-padded string: 1 → "001", 42 → "042" */
export function padPage(n: number): string {
  return String(n).padStart(3, '0');
}

/** Generate a slug from a title */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Parse page number from reader footer text like "Page 42 of 558 ● 8%" */
export function parseFooterPageNumber(footerText: string): number | null {
  const match = footerText.match(/Page\s+(\d+)\s+of/);
  return match ? parseInt(match[1], 10) : null;
}

/** Parse reader location from footer text like "Location 7 of 10571 ● 0%" */
export function parseFooterLocation(footerText: string): number | null {
  const match = footerText.match(/Location\s+(\d+)\s+of/);
  return match ? parseInt(match[1], 10) : null;
}

/** Check if footer indicates a page number (vs. location) */
export function footerHasPageNumber(footerText: string): boolean {
  return /Page\s+\d+\s+of/.test(footerText);
}

/** Simple logger */
export const log = {
  info: (msg: string, ...args: unknown[]) => {
    console.log(`[${new Date().toISOString()}] INFO  ${msg}`, ...args);
  },
  warn: (msg: string, ...args: unknown[]) => {
    console.warn(`[${new Date().toISOString()}] WARN  ${msg}`, ...args);
  },
  error: (msg: string, ...args: unknown[]) => {
    console.error(`[${new Date().toISOString()}] ERROR ${msg}`, ...args);
  },
  progress: (current: number, total: number, msg: string) => {
    const pct = Math.round((current / total) * 100);
    console.log(`[${new Date().toISOString()}] [${current}/${total} ${pct}%] ${msg}`);
  }
};

/** Sleep for a given number of milliseconds */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Check if a file exists */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/** Get file size in bytes, or 0 if file doesn't exist */
export async function getFileSize(filePath: string): Promise<number> {
  try {
    const stat = await fs.stat(filePath);
    return stat.size;
  } catch {
    return 0;
  }
}
