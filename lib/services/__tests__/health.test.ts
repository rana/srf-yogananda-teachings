/**
 * Health service unit tests — M2a-21.
 *
 * Tests the health check service with mock pg.Pool.
 */

import { describe, it, expect, vi } from "vitest";
import { getHealthStatus } from "../health";

function mockPool(
  overrides: {
    dbFail?: boolean;
    searchRows?: Record<string, unknown>[];
    booksRows?: Record<string, unknown>[];
  } = {},
) {
  const queryFn = vi.fn().mockImplementation((sql: string) => {
    if (overrides.dbFail && sql === "SELECT 1") {
      return Promise.reject(new Error("connection refused"));
    }
    if (sql === "SELECT 1") {
      return Promise.resolve({ rows: [{ "?column?": 1 }] });
    }
    if (sql.includes("book_chunks")) {
      return Promise.resolve({
        rows: overrides.searchRows ?? [{ total: "2681", with_embeddings: "2681" }],
      });
    }
    if (sql.includes("books")) {
      return Promise.resolve({
        rows: overrides.booksRows ?? [{ count: "2", languages: ["en", "es"] }],
      });
    }
    return Promise.resolve({ rows: [] });
  });

  return { query: queryFn } as unknown as import("pg").Pool;
}

describe("getHealthStatus", () => {
  it("returns ok when all checks pass", async () => {
    const pool = mockPool();
    const health = await getHealthStatus(pool);

    expect(health.status).toBe("ok");
    expect(health.milestone).toBe("1c");
    expect(health.checks.database.status).toBe("ok");
    expect(health.checks.database.latencyMs).toBeGreaterThanOrEqual(0);
    expect(health.checks.search.status).toBe("ok");
    expect(health.checks.search.chunksCount).toBe(2681);
    expect(health.checks.search.embeddingsCount).toBe(2681);
    expect(health.checks.books.count).toBe(2);
    expect(health.checks.books.languages).toEqual(["en", "es"]);
    expect(health.timestamp).toBeDefined();
  });

  it("returns down when database fails", async () => {
    const pool = mockPool({ dbFail: true });
    const health = await getHealthStatus(pool);

    expect(health.status).toBe("down");
    expect(health.checks.database.status).toBe("error");
    expect(health.checks.database.error).toBe("connection refused");
  });

  it("returns degraded when search has zero chunks", async () => {
    const pool = mockPool({ searchRows: [{ total: "0", with_embeddings: "0" }] });
    const health = await getHealthStatus(pool);

    expect(health.status).toBe("degraded");
    expect(health.checks.search.status).toBe("error");
    expect(health.checks.search.chunksCount).toBe(0);
  });

  it("reports correct version from env", async () => {
    process.env.DEPLOY_VERSION = "v1.0.3";
    const pool = mockPool();
    const health = await getHealthStatus(pool);

    expect(health.version).toBe("v1.0.3");
    delete process.env.DEPLOY_VERSION;
  });

  it("defaults version to 0.0.0 when not set", async () => {
    delete process.env.DEPLOY_VERSION;
    const pool = mockPool();
    const health = await getHealthStatus(pool);

    expect(health.version).toBe("0.0.0");
  });
});
