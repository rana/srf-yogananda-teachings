/**
 * Health API — /api/v1/health (M1c-5)
 *
 * Returns system health: database connectivity, search readiness, books count.
 * Cache-Control: no-store (always fresh).
 */

import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getHealthStatus } from "@/lib/services/health";

export async function GET() {
  const health = await getHealthStatus(pool);

  const status = health.status === "down" ? 503 : 200;

  return NextResponse.json(health, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
