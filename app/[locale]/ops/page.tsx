/**
 * Operational dashboard — /ops (M1c-16, DES-060 § Layer 2).
 *
 * Displays system health, SLI/SLO status, corpus stats.
 * Not public-facing but not auth-gated in Arc 1.
 */

import { setRequestLocale } from "next-intl/server";
import pool from "@/lib/db";
import { getHealthStatus } from "@/lib/services/health";

export const dynamic = "force-dynamic";

export default async function OpsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const health = await getHealthStatus(pool);

  // Search query stats
  let queryStats = { total: 0, avgDurationMs: 0, modes: {} as Record<string, number> };
  try {
    const { rows } = await pool.query(
      `SELECT
        COUNT(*) AS total,
        ROUND(AVG(duration_ms)) AS avg_duration,
        search_mode,
        COUNT(*) AS mode_count
       FROM search_queries
       GROUP BY search_mode`,
    );
    let total = 0;
    let totalDuration = 0;
    const modes: Record<string, number> = {};
    for (const row of rows) {
      const count = parseInt(row.mode_count, 10);
      total += count;
      totalDuration += parseInt(row.avg_duration, 10) * count;
      modes[row.search_mode] = count;
    }
    queryStats = {
      total,
      avgDurationMs: total > 0 ? Math.round(totalDuration / total) : 0,
      modes,
    };
  } catch {
    // Stats unavailable
  }

  // Corpus coverage
  let corpusStats = { books: 0, chapters: 0, chunks: 0, languages: [] as string[] };
  try {
    const { rows } = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM books) AS books,
        (SELECT COUNT(*) FROM chapters) AS chapters,
        (SELECT COUNT(*) FROM book_chunks) AS chunks`,
    );
    const { rows: langRows } = await pool.query(
      `SELECT DISTINCT language FROM books ORDER BY language`,
    );
    corpusStats = {
      books: parseInt(rows[0].books, 10),
      chapters: parseInt(rows[0].chapters, 10),
      chunks: parseInt(rows[0].chunks, 10),
      languages: langRows.map((r) => r.language),
    };
  } catch {
    // Stats unavailable
  }

  const statusColor =
    health.status === "ok"
      ? "text-green-700 bg-green-50"
      : health.status === "degraded"
        ? "text-amber-700 bg-amber-50"
        : "text-red-700 bg-red-50";

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-semibold text-gray-900">
          Operations Dashboard
        </h1>
        <p className="mb-8 text-sm text-gray-500">
          v{health.version} &middot; Milestone {health.milestone} &middot;{" "}
          {health.timestamp}
        </p>

        {/* System Health */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-medium text-gray-800">System Health</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card
              title="Overall"
              value={health.status.toUpperCase()}
              className={statusColor}
            />
            <Card
              title="Database"
              value={
                health.checks.database.status === "ok"
                  ? `OK (${health.checks.database.latencyMs}ms)`
                  : `ERROR: ${health.checks.database.error}`
              }
              className={
                health.checks.database.status === "ok"
                  ? "text-green-700 bg-green-50"
                  : "text-red-700 bg-red-50"
              }
            />
            <Card
              title="Search"
              value={
                health.checks.search.status === "ok"
                  ? `${health.checks.search.embeddingsCount}/${health.checks.search.chunksCount} embedded`
                  : "No chunks"
              }
              className={
                health.checks.search.status === "ok"
                  ? "text-green-700 bg-green-50"
                  : "text-amber-700 bg-amber-50"
              }
            />
          </div>
        </section>

        {/* Corpus */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-medium text-gray-800">Corpus</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <Card title="Books" value={String(corpusStats.books)} />
            <Card title="Chapters" value={String(corpusStats.chapters)} />
            <Card title="Chunks" value={String(corpusStats.chunks)} />
            <Card
              title="Languages"
              value={corpusStats.languages.join(", ") || "—"}
            />
          </div>
        </section>

        {/* Search Activity */}
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-medium text-gray-800">
            Search Activity
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card title="Total Queries" value={String(queryStats.total)} />
            <Card
              title="Avg Latency"
              value={queryStats.avgDurationMs ? `${queryStats.avgDurationMs}ms` : "—"}
            />
            <Card
              title="Modes"
              value={
                Object.entries(queryStats.modes)
                  .map(([mode, count]) => `${mode}: ${count}`)
                  .join(", ") || "—"
              }
            />
          </div>
        </section>

        {/* SLI/SLO Targets (ADR-095) */}
        <section>
          <h2 className="mb-3 text-lg font-medium text-gray-800">
            SLI/SLO Targets
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    SLI
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Target
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">
                    Current
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-50">
                  <td className="px-4 py-2">Search p95 latency</td>
                  <td className="px-4 py-2">&lt; 500ms</td>
                  <td className="px-4 py-2">
                    {queryStats.avgDurationMs
                      ? `~${queryStats.avgDurationMs}ms avg`
                      : "—"}
                  </td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="px-4 py-2">Uptime</td>
                  <td className="px-4 py-2">99.5%</td>
                  <td className="px-4 py-2">—</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="px-4 py-2">Search quality (Recall@3)</td>
                  <td className="px-4 py-2">&ge; 80%</td>
                  <td className="px-4 py-2">
                    EN: 100%, ES: 100%
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Error rate</td>
                  <td className="px-4 py-2">&lt; 1%</td>
                  <td className="px-4 py-2">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({
  title,
  value,
  className = "text-gray-700 bg-white",
}: {
  title: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-gray-200 px-4 py-3 ${className}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-60">
        {title}
      </p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
