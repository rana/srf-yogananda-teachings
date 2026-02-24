<!-- elmer:archive
  id: explore-act
  topic: explore-act
  archetype: explore-act
  model: opus
  status: declined
  decline_reason: Synthesis approved
  completed_at: 2026-02-24T21:01:00.803226+00:00
  ensemble_id: explore-act
  ensemble_role: replica
  archived: 2026-02-24 21:17 UTC
-->

## Summary

The Neon PostgreSQL integration architecture requires strategic enhancements to support the portal's unique requirements for serving Yogananda's teachings at global scale. The current design uses Neon appropriately as the single source of truth, but specific implementation patterns around branching strategy, schema evolution governance, performance optimization, and disaster recovery need refinement to ensure the 10-year longevity horizon while maintaining sacred text fidelity.

## Analysis

The portal's Neon PostgreSQL architecture demonstrates sophisticated understanding of serverless database patterns, but several areas require action:

**Strengths identified:**
- Single-database architecture correctly chosen over multi-database complexity (ADR-013, ADR-117)
- pgvector + pg_search/ParadeDB hybrid search well-designed for multilingual retrieval
- Embedding model migration procedure (ADR-046) protects against AI model evolution
- Schema designed for multilingual from foundation (language columns everywhere)
- Proper use of Neon branching for safe migrations

**Gaps requiring action:**
- No defined Neon branch naming convention or lifecycle governance
- Missing connection pooling strategy for serverless edge functions
- Incomplete disaster recovery and backup strategy beyond Neon's built-in features
- No defined approach for handling Neon-specific features (branching, autoscaling, compute endpoints)
- Missing performance baseline requirements for Phase 0a validation
- Unclear separation between development, staging, and production database environments
- No defined strategy for managing database secrets across environments

## Proposed Changes

### 1. Neon Branch Lifecycle Governance
**What:** Establish branch naming conventions and lifecycle policies for Neon database branches
**Where:** New section in DESIGN-phase0.md after DES-004 (Data Model), new ADR-124 in DECISIONS-core.md
**Why:** Prevents branch proliferation and ensures safe, auditable schema evolution
**How:**
- Branch naming: `{purpose}-{date}-{identifier}` (e.g., `migration-2026-03-15-add-indices`, `feature-2026-03-20-graph-relations`)
- Lifecycle: feature branches live max 7 days, migration branches deleted after merge, hotfix branches deleted immediately after verification
- Add Terraform configuration for Neon project setup with branch policies

### 2. Connection Pooling Architecture
**What:** Implement PgBouncer-compatible connection pooling for serverless functions
**Where:** New subsection in DESIGN-phase0.md under "Infrastructure" section, update `/lib/db.ts` implementation notes
**Why:** Serverless functions can exhaust database connections without pooling; critical for Vercel Edge Functions
**How:**
- Use Neon's built-in connection pooling endpoint (port 5432 with `-pooler` suffix)
- Configure `pg` client with `{ connectionString: process.env.DATABASE_POOLING_URL }`
- Set appropriate pool size limits in Terraform: min_pool_size=0, max_pool_size=20 for serverless

### 3. Performance Baselines and Monitoring
**What:** Define specific performance requirements for Phase 0a validation
**Where:** Add to DESIGN-phase0.md § DES-003 (Search Architecture), new monitoring section
**Why:** ADR-123 establishes parameters as tunable, but no baseline targets exist
**How:**
- Vector search: < 100ms for top-20 retrieval at 50K chunks
- BM25 search: < 50ms for keyword queries
- Hybrid RRF fusion: < 150ms total
- Monitor via Neon's built-in metrics + custom CloudWatch metrics
- Add performance regression tests to CI pipeline

### 4. Database Environment Strategy
**What:** Define clear separation between development, staging, and production databases
**Where:** New section in DESIGN-phase0.md, update CONTEXT.md § Open Questions with environment decisions
**Why:** Current design assumes single production database but doesn't address pre-production environments
**How:**
- Development: Neon branch per developer, reset weekly
- Staging: Persistent Neon branch from production, updated via CI
- Production: Main branch with Point-in-Time Recovery enabled
- Use Neon's project-level isolation for prod vs non-prod

### 5. Disaster Recovery and Backup Strategy
**What:** Comprehensive backup and recovery plan beyond Neon's defaults
**Where:** New ADR-125 in DECISIONS-operations.md, operational procedure in `/docs/operational/disaster-recovery.md`
**Why:** 10-year longevity requires explicit disaster recovery planning
**How:**
- Daily automated pg_dump exports to S3 with 30-day retention
- Weekly full export with 1-year retention for compliance
- Documented recovery procedures with RTO/RPO targets (RTO: 4 hours, RPO: 1 hour)
- Annual DR drill requirement

### 6. Secret Management Architecture
**What:** Secure database credential management across environments
**Where:** Update DESIGN-phase0.md infrastructure section, new operational procedure
**Why:** Database credentials are the keys to the kingdom for sacred text
**How:**
- AWS Secrets Manager for production credentials
- Vercel environment variables for non-prod
- Rotation policy: 90 days for production, never store in code
- Separate read-only credentials for analytics/monitoring

### 7. Neon-Specific Feature Utilization
**What:** Document explicit decisions about Neon's unique features
**Where:** New section in DESIGN-phase0.md § Database Infrastructure
**Why:** Neon offers features (autoscaling, compute endpoints, SQL editor) that need governance
**How:**
- Autoscaling: Enable with min=0.25 CPU for cost optimization during low traffic
- Compute endpoints: Single read-write endpoint initially, add read replicas at Phase 4
- SQL Editor: Disabled in production for security
- Branching: Use for all schema migrations per procedure

### 8. Query Performance Optimization Patterns
**What:** Establish patterns for query optimization specific to pgvector + BM25 hybrid search
**Where:** New subsection in DESIGN-phase0.md § DES-003
**Why:** Hybrid search has unique optimization requirements
**How:**
- Prepared statements for all repeated queries
- Materialized views for theme statistics (refresh nightly)
- Connection warming for cold starts
- Query plan analysis requirements before new index creation

### 9. Data Integrity Constraints
**What:** Add critical business logic constraints at database level
**Where:** Update schema in DESIGN-phase0.md § DES-004
**Why:** Sacred text fidelity requires database-level guarantees
**How:**
- Add CHECK constraints for embedding dimensions
- Foreign key constraints with explicit CASCADE/RESTRICT policies
- Unique constraints on content_hash to prevent duplicate chunks
- Trigger to update canonical_chunk_id bidirectionally

### 10. Monitoring and Alerting Strategy
**What:** Comprehensive database monitoring aligned with sacred text responsibilities
**Where:** New section in DESIGN.md § Observability (DES-037)
**Why:** Database health directly impacts seekers' access to teachings
**How:**
- Alert on: connection saturation, slow queries (>1s), replication lag, storage growth
- Daily report: query patterns, cache hit rates, index usage
- Weekly review: slow query log, unused indexes, table growth
- Integration with Sentry for application-level database errors

## Open Questions

1. **Neon pricing tier commitment:** Should the project commit to Neon Pro ($69/month minimum) from Phase 0a, or start with Free tier limits for initial development?

2. **Multi-region strategy:** When should the portal consider Neon's multi-region capabilities? Phase 4 (global launch) or Phase 10 (multilingual)?

3. **Read replica timing:** At what query volume should read replicas be introduced? Specific QPS threshold needed.

4. **Development database funding:** Who pays for developer Neon branches? Individual developers, project fund, or SRF infrastructure budget?

5. **GDPR data residency:** Will European seekers' data require EU-region database? Neon supports this but needs architectural planning.

## What's Not Being Asked

**Database vendor lock-in mitigation:** While Neon uses standard PostgreSQL, some features (branching, connection pooling endpoint) are Neon-specific. The proposal doesn't fully address migration strategy to vanilla PostgreSQL or alternative providers.

**Cost optimization at scale:** The current design assumes modest scale. At 1M+ seekers, database costs could exceed $1000/month. No discussion of cost optimization strategies like data archival, partitioning, or caching layers.

**Compliance and audit logging:** For a portal handling sacred texts and potentially personal meditation experiences (Phase 13+), there's no mention of audit logging, data lineage, or compliance reporting capabilities.

**Performance testing methodology:** While the proposal suggests performance baselines, it doesn't address how to conduct realistic load testing on a serverless database that autoscales.

**Schema versioning beyond migrations:** How will the portal handle schema documentation, API contract testing, and backwards compatibility when multiple client versions exist (web, future mobile app)?

**Database-level multitenancy:** If SRF decides to offer white-label portals for affiliate organizations, the current single-database design would need significant rework.