/**
 * Database connection pool.
 *
 * Uses NEON_DATABASE_URL (pooled) for serverless API routes.
 * Business logic in /lib/services/ receives the pool as a dependency
 * — no framework imports in the service layer (PRI-10).
 */

import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export default pool;
