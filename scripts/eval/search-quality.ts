/**
 * Search quality evaluation — M1a-8
 *
 * Tests representative queries against the search API and evaluates:
 * 1. Relevance: Do top results contain expected keywords/passages?
 * 2. Mode: Is hybrid search activating (vector + FTS)?
 * 3. Latency: Are queries completing within budget?
 * 4. Coverage: Are different chapters/themes represented?
 *
 * Usage:
 *   npx tsx scripts/eval/search-quality.ts
 *
 * Requires: NEON_DATABASE_URL, VOYAGE_API_KEY
 */

import pg from "pg";

// We import the search function directly for server-side evaluation
// (avoids needing a running Next.js server)
import { search } from "../../lib/services/search";

// ── Test Cases ──────────────────────────────────────────────────

interface TestCase {
  query: string;
  /** Keywords expected in at least one top-3 result */
  expectedKeywords: string[];
  /** Expected chapter numbers in top-5 results (at least one must appear) */
  expectedChapters?: number[];
  /** Maximum acceptable latency in ms */
  maxLatencyMs?: number;
}

const TEST_CASES: TestCase[] = [
  {
    query: "cosmic consciousness",
    expectedKeywords: ["cosmic", "consciousness"],
    expectedChapters: [14, 26, 43],
    maxLatencyMs: 2000,
  },
  {
    query: "meditation technique",
    expectedKeywords: ["meditation"],
    // Chapter 26 is "The Science of Kriya Yoga" — may not rank for generic "meditation technique"
    maxLatencyMs: 2000,
  },
  {
    query: "Babaji",
    expectedKeywords: ["Babaji"],
    expectedChapters: [33, 34, 36],
    maxLatencyMs: 2000,
  },
  {
    query: "Lahiri Mahasaya",
    expectedKeywords: ["Lahiri"],
    expectedChapters: [33, 34, 35, 36],
    maxLatencyMs: 2000,
  },
  {
    query: "Sri Yukteswar",
    expectedKeywords: ["Yukteswar", "Sri"],
    expectedChapters: [10, 12, 42, 43],
    maxLatencyMs: 2000,
  },
  {
    query: "divine mother",
    expectedKeywords: ["divine", "mother"],
    maxLatencyMs: 2000,
  },
  {
    query: "kriya yoga",
    expectedKeywords: ["kriya", "yoga"],
    expectedChapters: [26],
    maxLatencyMs: 2000,
  },
  {
    query: "death and afterlife",
    expectedKeywords: ["death"],
    expectedChapters: [2, 43],
    maxLatencyMs: 2000,
  },
  {
    query: "miracles and saints",
    expectedKeywords: ["miracle", "saint"],
    maxLatencyMs: 2000,
  },
  {
    query: "self-realization",
    expectedKeywords: ["self-realization", "realization"],
    maxLatencyMs: 2000,
  },
  {
    query: "love of God",
    expectedKeywords: ["love", "God"],
    maxLatencyMs: 2000,
  },
  {
    query: "karma and reincarnation",
    expectedKeywords: ["karma", "reincarnation"],
    maxLatencyMs: 2000,
  },
];

// ── Evaluation ──────────────────────────────────────────────────

interface TestResult {
  query: string;
  mode: string;
  totalResults: number;
  durationMs: number;
  keywordHit: boolean;
  chapterHit: boolean | null; // null = no expected chapters
  latencyOk: boolean;
  topSources: string[];
  passed: boolean;
}

async function evaluateQuery(
  pool: pg.Pool,
  tc: TestCase,
): Promise<TestResult> {
  const response = await search(pool, {
    query: tc.query,
    language: "en",
    limit: 10,
  });

  const top3Content = response.results
    .slice(0, 3)
    .map((r) => r.content.toLowerCase())
    .join(" ");

  const keywordHit = tc.expectedKeywords.some((kw) =>
    top3Content.includes(kw.toLowerCase()),
  );

  let chapterHit: boolean | null = null;
  if (tc.expectedChapters) {
    const top5Chapters = response.results
      .slice(0, 5)
      .map((r) => r.chapterNumber);
    chapterHit = tc.expectedChapters.some((ch) => top5Chapters.includes(ch));
  }

  const maxLatency = tc.maxLatencyMs ?? 2000;
  const latencyOk = response.durationMs <= maxLatency;

  const topSources = [
    ...new Set(response.results.slice(0, 3).flatMap((r) => r.sources)),
  ];

  const passed =
    keywordHit && (chapterHit === null || chapterHit) && latencyOk;

  return {
    query: tc.query,
    mode: response.mode,
    totalResults: response.totalResults,
    durationMs: response.durationMs,
    keywordHit,
    chapterHit,
    latencyOk,
    topSources,
    passed,
  };
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
  const dbUrl = process.env.NEON_DATABASE_URL;
  if (!dbUrl) {
    console.error("NEON_DATABASE_URL not set.");
    process.exit(1);
  }

  const pool = new pg.Pool({
    connectionString: dbUrl,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  console.log("Search Quality Evaluation — M1a-8\n");
  console.log("=".repeat(70));

  const results: TestResult[] = [];
  let passCount = 0;

  for (const tc of TEST_CASES) {
    const result = await evaluateQuery(pool, tc);
    results.push(result);
    if (result.passed) passCount++;

    const status = result.passed ? "PASS" : "FAIL";
    const icon = result.passed ? "+" : "-";
    console.log(
      `\n[${icon}] ${status}: "${result.query}"`,
    );
    console.log(
      `    Mode: ${result.mode} | Results: ${result.totalResults} | Time: ${result.durationMs}ms`,
    );
    console.log(
      `    Keywords: ${result.keywordHit ? "found" : "MISSING"} | Chapters: ${result.chapterHit === null ? "n/a" : result.chapterHit ? "found" : "MISSING"} | Latency: ${result.latencyOk ? "ok" : "SLOW"}`,
    );
    console.log(`    Top sources: ${result.topSources.join(", ")}`);
  }

  console.log("\n" + "=".repeat(70));
  console.log(
    `\nSummary: ${passCount}/${results.length} passed (${((passCount / results.length) * 100).toFixed(0)}%)`,
  );

  // Mode distribution
  const modes = results.reduce(
    (acc, r) => {
      acc[r.mode] = (acc[r.mode] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  console.log(`Modes: ${JSON.stringify(modes)}`);

  // Latency stats
  const latencies = results.map((r) => r.durationMs).sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.5)];
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  console.log(
    `Latency: avg=${avg.toFixed(0)}ms, p50=${p50}ms, p95=${p95}ms`,
  );

  // Source coverage
  const allSources = new Set(results.flatMap((r) => r.topSources));
  console.log(`Source types in top-3: ${[...allSources].join(", ")}`);

  await pool.end();

  if (passCount < results.length) {
    console.log(
      `\n${results.length - passCount} test(s) failed. Review results above.`,
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Evaluation failed:", err);
  process.exit(1);
});
