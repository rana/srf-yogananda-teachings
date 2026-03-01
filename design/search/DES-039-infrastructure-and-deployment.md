## DES-039: Infrastructure and Deployment

All infrastructure is defined as code per SRF engineering standards from Milestone 1a. See ADR-016.

### Bootstrap: Greenfield Provisioning

The portal starts greenfield — no existing infrastructure to import. Terraform creates all resources from scratch on first `terraform apply`. Any Neon projects or Vercel projects created during design exploration (e.g., via MCP) should be deleted before bootstrap to avoid naming conflicts.

**Bootstrap via script** (before first `terraform apply`):

```bash
./scripts/bootstrap.sh
```

The bootstrap script automates all CLI-scriptable setup. The human runs one script, pastes two credentials that require manual console creation (Neon org API key, Sentry auth token), and the script handles everything else: S3 bucket creation, DynamoDB table, OIDC provider, IAM role, Vercel CLI link, and GitHub secret population via `gh secret set`. The script is idempotent — safe to re-run.

**What the script does:**

| Step | Tool | What It Creates | Manual? |
|------|------|----------------|---------|
| 1 | AWS CLI | S3 bucket (`srf-portal-terraform-state`) — versioning, AES-256, public access blocked | No |
| 2 | AWS CLI | DynamoDB table (`srf-portal-terraform-locks`) — `LockID` partition key, on-demand | No |
| 3 | AWS CLI | OIDC provider + IAM role (`portal-ci`) from `terraform/bootstrap/trust-policy.json` | No |
| 4 | Prompt | Neon org API key — console-only, paste when prompted | **Yes** |
| 5 | Prompt | Sentry auth token — console-only, paste when prompted | **Yes** |
| 6 | Vercel CLI | Project link + API token | No |
| 7 | `gh` CLI | All 6 GitHub secrets in batch | No |
| 8 | Terraform | `terraform init` — connects to S3 backend | No |

**Prerequisites:** AWS CLI configured (`aws configure`), `gh` CLI authenticated, `vercel` CLI installed, Neon and Sentry accounts exist. See `docs/guides/manual-steps-milestone-1a.md` for the detailed human walkthrough.

After bootstrap, all infrastructure changes flow through PRs → `terraform plan` → merge → `terraform apply`.

### Environment Lifecycle Scripts (Arc 4+)

When multi-environment promotion activates in Arc 4, two additional scripts manage environments:

```bash
# Create a complete environment in ~2 minutes
./scripts/create-env.sh staging

# Destroy an environment in ~1 minute
./scripts/destroy-env.sh staging
```

**`create-env.sh {env}`** creates a Terraform workspace, a Neon branch from `main`, applies Terraform with the environment's tfvars, and configures GitHub Environment protection rules. **`destroy-env.sh {env}`** reverses all four steps. Both scripts are idempotent.

The branch=environment principle (ADR-020) means environments are disposable. Neon branching is instant and zero-cost. Vercel branch deployments are automatic. Sentry uses environment tags on a single DSN. No per-environment project creation needed.

### Terraform Module Layout

```
/terraform/
 main.tf — Provider configuration, S3 backend
 variables.tf — Input variables (project name, environment)
 outputs.tf — Connection strings, URLs, DSNs
 versions.tf — required_providers with version constraints

 /modules/
 /neon/ — Neon project, database, roles, pgvector, pg_search
 /vercel/ — Vercel project, env vars
 /sentry/ — Sentry project, DSN, alert rules
 /aws/ — IAM OIDC provider, Lambda role, S3 buckets, Budgets alarm, state backend
 /newrelic/ — Synthetics monitors, alert policies (Milestone 3d)

 /environments/
 dev.tfvars — Milestone 1a (only active environment)
 staging.tfvars — Arc 4+
 prod.tfvars — Arc 4+

 /bootstrap/
 trust-policy.json — IAM OIDC trust policy template (used by bootstrap.sh)
```

#### Progressive Module Activation

Modules are activated via feature-flag variables in `dev.tfvars`. This avoids commenting out modules or maintaining separate Terraform configurations per milestone.

| Variable | 1a | 1b | 1c | 2a | 3a+ |
|----------|----|----|----|----|-----|
| `enable_neon` | `true` | `true` | `true` | `true` | `true` |
| `enable_sentry` | `true` | `true` | `true` | `true` | `true` |
| `enable_aws_core` | `true` | `true` | `true` | `true` | `true` |
| `enable_vercel` | `false` | `false` | `true` | `true` | `true` |
| `enable_lambda` | `false` | `false` | `false` | `true` | `true` |
| `enable_newrelic` | `false` | `false` | `false` | `false` | 3d |

Each module is conditionally included via `count = var.enable_<module> ? 1 : 0`. The first `terraform apply` in Milestone 1a creates Neon project, Sentry project, and AWS core resources (OIDC provider, IAM roles, S3 bucket, Budget alarm). Milestone 1b adds Hindi/Spanish content (no new infrastructure modules). Milestone 1c adds Vercel. Milestone 2a adds Lambda (database backup via EventBridge Scheduler). Milestone 3a deploys batch Lambda functions (ingestion, relation computation) to already-working infrastructure. Clean, incremental, auditable.

### Three-Layer Neon Management Model

Neon infrastructure is managed through three distinct control planes, each with a clear purpose and boundary. This model applies to all Neon operations from Milestone 1a.

| Layer | Tool | What It Manages | When | Audit Trail |
|-------|------|----------------|------|-------------|
| **Infrastructure** | Terraform (`kislerdm/neon` provider) | Project, tier, persistent branches (production/staging/dev), compute configuration, branch protection | PRs → `terraform plan` → merge → `terraform apply` | Git + Terraform state in S3 |
| **Operations** | Neon MCP / CLI / API | Ephemeral branches, snapshots, schema diffs, verification, connection strings, Time Travel queries | Development sessions, CI runs | Conversation logs (MCP), CI logs (CLI) |
| **Data** | SQL via `@neondatabase/serverless` + dbmate | Schema migrations, content, queries, extensions | Application runtime, migration scripts | Git (migrations), database WAL |

**Design principle:** MCP operations should never create persistent state that Terraform doesn't know about. Ephemeral branches (CI test, PR preview, migration test, ingestion sandbox) are Operations-layer concerns — created and deleted within a session or CI run. Persistent branches (production, staging, dev) are Infrastructure-layer concerns — declared in Terraform, never created ad hoc.

**Neon MCP as development tool.** The Neon MCP server (`@neondatabase/mcp-server-neon`) is Claude's primary interface for Neon operations during development sessions. It provides:

| MCP Tool | Use Case |
|----------|----------|
| `run_sql` | Verify schema after migrations, test queries, inspect data |
| `prepare_database_migration` | Create branch, apply migration SQL, return branch for testing |
| `complete_database_migration` | Apply verified migration to the target branch |
| `compare_database_schema` | Schema diff between branches — drift detection |
| `create_branch` | Ephemeral branches for experimentation |
| `get_connection_string` | Retrieve connection strings for `.env.local` population |
| `describe_branch` | Verify branch state, compute configuration |
| `list_projects` | Verify project exists after `terraform apply` |

The MCP occupies the same role as `psql` for a human developer — exploratory, immediate, judgment-based. Terraform provides the plan/apply review gate for persistent infrastructure; MCP provides the interactive feedback loop for operational tasks.

**API key scoping per layer** (see ADR-124 § API Key Scoping Policy):

| Context | Key Type | Scope | Rationale |
|---------|----------|-------|-----------|
| Terraform (`terraform.yml`) | Organization API key | All projects in org | Can create/delete projects |
| CI branch operations (`neon-branch.yml`) | Project-scoped API key | Single project | Can create/delete branches but cannot delete the project |
| Claude Code / MCP development | Project-scoped API key | Single project | Least privilege for interactive operations |

### Boundary: Terraform vs. Operations vs. Application Code

| Managed by Terraform | Managed by Operations (MCP/CLI/API) | Managed by Application Code |
|---------------------|--------------------------------------|------------------------------|
| Service creation (Neon project, Vercel project, Sentry project) | Ephemeral branches (CI, PR, migration test) | Database schema + extensions (dbmate SQL migrations) |
| Persistent branches (production, staging, dev) | Snapshots (pre-migration, checkpoints) | `vercel.json`, `sentry.client.config.ts`, `newrelic.js` |
| Compute configuration (CU, autosuspend) | Schema diffs and verification | Lambda handler code (`/lambda/`) |
| Environment variables, secrets placeholders | Connection string retrieval | GitHub settings (manual), CI workflows (`.github/workflows/`) |
| AWS IAM roles, S3 buckets, Budgets alarm | Time Travel queries (debugging) | Application routing (`next.config.js`) |
| DNS records, domain bindings (when active) | Branch cleanup (nightly script) | Structured logging (`lib/logger.ts`) |
| Alert rules, Synthetics monitors | Compute start/suspend (operational) | — |

### Source Control and CI/CD

| Phase | SCM | CI/CD | Terraform State |
|-------|-----|-------|-----------------|
| **Primary (all arcs)** | GitHub | GitHub Actions | S3 + DynamoDB |
| **If SRF requires migration** | GitLab (SRF IDP) | GitLab CI/CD | GitLab Terraform backend |

#### CI/CD Pipeline (GitHub Actions)

```
On every PR:
 1. Lint + type check
 2. Vitest (unit/integration)
 3. axe-core (accessibility)
 4. next build
 5. Playwright (E2E)
 6. Lighthouse CI (performance)
 7. Search quality suite
 8. terraform fmt -check + terraform validate (if /terraform/ changed)
 9. terraform plan (if /terraform/ changed) — posted as PR comment

On merge to main:
 1. All of the above
 2. Neon snapshot (if /migrations/ changed) — pre-migration safety net via Neon Snapshot API (ADR-019 Layer 2)
 3. dbmate migrate — apply pending migrations
 4. terraform apply (dev)
```

Infrastructure changes (`/terraform/**`) trigger `terraform fmt -check`, `terraform validate`, `terraform plan` on PR, and `terraform apply` on merge. Migration changes (`/migrations/**`) trigger a pre-migration Neon snapshot before applying — provides instant rollback without timestamp arithmetic. Application changes trigger the full test suite. Multiple triggers can fire in the same PR.

**Pre-migration snapshot pattern:** When `/migrations/**` files change, the merge-to-main workflow calls `/scripts/neon-snapshot.sh` (using `NEON_PROJECT_API_KEY`) to create a snapshot named `pre-migrate-{sha}` before running `dbmate migrate`. If migration fails, restore from the snapshot. No Lambda infrastructure needed — this is a single API call to `POST /projects/{id}/branches/{branch_id}/snapshots`. (See ADR-019 Layer 2.)

#### Workflow File Structure

```
.github/
 workflows/
   ci.yml              — [1a] App CI: lint, type check, test, build, a11y, Lighthouse, search quality
   terraform.yml        — [1a] Infra CI: fmt, validate, plan (PR), apply (merge to main)
   neon-branch.yml      — [1c] Neon branch lifecycle: create on PR open, delete on PR close
   neon-cleanup.yml     — [1c] Nightly: delete orphaned Neon preview branches
 dependabot.yml         — [1a] Automated provider + dependency update PRs
```

Milestone 1a creates `ci.yml`, `terraform.yml`, and `dependabot.yml`. The Neon branch workflows (`neon-branch.yml`, `neon-cleanup.yml`) are added in 1c when preview deployments become active (Vercel enabled).

**`ci.yml`** runs on all PRs and pushes to main. No AWS credentials needed — pure app testing.

**`terraform.yml`** runs only when `/terraform/**` changes. Uses OIDC federation (`AWS_ROLE_ARN`) for AWS auth. Provider tokens (`NEON_API_KEY`, `VERCEL_TOKEN`, `SENTRY_AUTH_TOKEN`) as GitHub secrets. Posts `terraform plan` output as PR comment. On merge to main, `terraform apply` runs automatically for the dev environment.

**`neon-branch.yml`** runs on PR lifecycle events. Uses `NEON_API_KEY` secret. Creates a Neon branch on PR open, deletes on PR close.

**`neon-cleanup.yml`** runs on `schedule: cron('0 3 * * *')`. Calls `/scripts/neon-branch-cleanup.sh`. Catches orphans.

**`dependabot.yml`** covers two ecosystems: `terraform` (provider updates for `/terraform/`) and `npm` (dependency updates). Provider update PRs automatically trigger `terraform.yml`, producing a plan diff for review.

#### Vercel Deployment Strategy

Vercel auto-deploys on git push via its native GitHub integration. Terraform manages the Vercel *project* (settings, environment variables, domain bindings) but does not trigger deployments. This keeps the Terraform boundary clean ("Terraform creates services; app code triggers deployments") and avoids race conditions between Terraform-triggered and git-triggered deploys.

For Arc 4+ multi-environment promotion (dev → staging → prod), deployment switches to Vercel CLI invoked from CI scripts (ADR-018), with Vercel's git integration disabled. This gives explicit control over which environment receives which build.

#### Neon Branch-per-PR

Preview deployments use Neon's branching for database isolation:

| Branch Type | Lifecycle | TTL | Cleanup |
|-------------|-----------|-----|---------|
| **Production** (`main`) | Permanent | — | — |
| **Preview** (per PR) | Created on PR open | 7 days after last commit | GitHub Action on PR close + nightly cleanup script |
| **CI test** (per run) | Created at test start | Deleted at test end | GitHub Action post-step |

TTL enforcement: a GitHub Action runs on PR close (`types: [closed]`) to delete the associated Neon branch via Neon API. A nightly cleanup script (`/scripts/neon-branch-cleanup.sh`) catches orphans — branches older than 7 days with no open PR. Both use the `NEON_API_KEY` secret.

#### Cost Alerting

Terraform provisions an AWS Budget alarm at 80% and 100% of monthly target ($100 for Arcs 1–3, adjusted as services scale). The alarm sends email to the human principal. Neon and Vercel cost alerts are configured manually in their dashboards (no Terraform provider support for spend alerts).

### Environment Configuration

The portal has three distinct configuration layers — application environment variables, named constants, and developer tooling — each with a clear owner and location. ADR-041 and all other sections reference this canonical definition.

#### 1. Application Environment Variables (`.env.example`)

Values that vary per environment or contain secrets. The `.env.example` file is the local development reference. In deployed environments, Terraform reads secrets from AWS Secrets Manager (ADR-125) and distributes them as Vercel environment variables. See `.env.example` for the canonical variable list with tag legend.

**Tag legend:** `[terraform]` = set by Terraform output in deployed environments (fill manually for local dev). `[secrets-manager]` = stored in AWS Secrets Manager; Terraform reads and distributes to Vercel; fill manually in `.env.local` for local dev. `[static]` = fixed value, same across all environments.

**Secrets management architecture (ADR-125).** Two tiers:

| Tier | What | Where | Changes via |
|------|------|-------|-------------|
| **Config** (non-secrets) | Named constants, per-environment config, `NEXT_PUBLIC_*` build-time vars | `/lib/config.ts` + Vercel env vars | Code PR or `terraform apply` |
| **Secrets** (all credentials) | API keys, tokens, connection strings | AWS Secrets Manager → Terraform → Vercel env vars | Secrets Manager update (+ `terraform apply` for Vercel distribution) |

Secrets Manager path convention: `/portal/{environment}/{service}/{key-name}` (e.g., `/portal/production/voyage/api-key`).

**Credential distribution pattern.** Terraform data sources read secret values from Secrets Manager and set them as `vercel_project_environment_variable` resources. Result: a single `terraform apply` distributes secrets to Vercel — the human never manually copies secrets between platforms. For local development, `.env.local` provides the same values directly. The `/lib/config.ts` facade checks environment variables first, so local dev works without Secrets Manager access.

**AWS authentication by context (ADR-126):**

| Context | Auth mechanism | Credentials |
|---|---|---|
| **Vercel functions → Bedrock + Secrets Manager** | Vercel OIDC federation (`portal-vercel-runtime` role) | `AWS_ROLE_ARN` env var (not a secret) — no stored keys |
| **Lambda → Bedrock/S3** | IAM execution role (attached by Terraform) | No env vars needed — role is automatic |
| **GitHub Actions → AWS** | GitHub OIDC federation (ADR-016, `portal-ci` role) | `AWS_ROLE_ARN` secret, no stored keys |
| **Local dev → Bedrock** | AWS credential chain fallback | `AWS_PROFILE=srf-dev` or `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` in `.env.local` |

**Zero long-lived AWS credentials.** Vercel OIDC (ADR-126) authenticates Vercel functions to AWS via short-lived OIDC tokens exchanged for temporary IAM credentials through `AssumeRoleWithWebIdentity`. The `awsCredentialsProvider` from `@vercel/functions/oidc` handles the STS exchange and credential refresh. Combined with GitHub Actions OIDC (ADR-016), no long-lived AWS credentials exist in any environment.

**Environment-scoped security.** The Vercel OIDC `sub` claim includes the deployment environment (`production`, `preview`, `development`). Separate IAM roles per environment scope Secrets Manager access: production deployments can only read `/portal/production/*` secrets. Preview deployments cannot assume the production role.

**`ANTHROPIC_API_KEY` is removed from `.env.example`.** The application code uses `@anthropic-ai/bedrock-sdk` (not `@anthropic-ai/sdk`) for all Claude calls, routing through Bedrock in every environment including local dev. One code path, one auth mechanism. If a developer cannot access Bedrock (e.g., no AWS account yet during initial scaffold), the search pipeline gracefully degrades — search works without Claude-powered query expansion, returning BM25 + vector results only.

**What is NOT in `.env.example`:**
- Model IDs, chunk sizes, search parameters → `/lib/config.ts` (see below)
- CI-only secrets (NEON_API_KEY, VERCEL_TOKEN, AWS_ROLE_ARN) → GitHub Secrets only (see CONTEXT.md § Bootstrap Credentials Checklist)
- Claude Code developer tooling → developer shell profile (see below)

#### 2. Named Constants (`/lib/config.ts` — ADR-123)

Tunable parameters that are not secrets and do not vary between environments. These are the "magic numbers" that ADR-123 requires as named constants. They change via code PRs, not env var updates.

```typescript
// /lib/config.ts — Named constants per ADR-123
// These are tunable defaults, not architectural commitments.
// Change via PR with evidence. Annotate: date, old → new, reason.

// ── AI Model Selection (ADR-014) ───────────────────────────────
export const BEDROCK_REGION = 'us-west-2';

// Real-time models (search pipeline — latency-sensitive)
export const CLAUDE_MODEL_CLASSIFY = 'anthropic.claude-3-5-haiku-20241022-v1:0';
export const CLAUDE_MODEL_EXPAND   = 'anthropic.claude-3-5-haiku-20241022-v1:0';
export const CLAUDE_MODEL_RANK     = 'anthropic.claude-3-5-haiku-20241022-v1:0';

// Batch models (offline — quality-sensitive)
export const CLAUDE_MODEL_BATCH    = 'anthropic.claude-opus-4-6-v1';

// ── Embedding (ADR-118) ────────────────────────────────────────
export const EMBEDDING_MODEL      = 'voyage-3-large';
export const EMBEDDING_DIMENSIONS = 1024;
export const EMBEDDING_INPUT_TYPE_QUERY    = 'query';
export const EMBEDDING_INPUT_TYPE_DOCUMENT = 'document';

// ── Chunking (ADR-048) ────────────────────────────────────────
export const CHUNK_SIZE_TOKENS    = 1000;
export const CHUNK_OVERLAP_TOKENS = 200;

// ── Search (ADR-044, ADR-119) ──────────────────────────────────
export const RRF_K = 60;
export const SEARCH_RESULTS_DEFAULT = 10;
export const SEARCH_RESULTS_MAX     = 50;
export const SEARCH_DEBOUNCE_MS     = 300;

// ── Rate Limiting (ADR-023) ────────────────────────────────────
export const RATE_LIMIT_SEARCH_RPM = 30;
export const RATE_LIMIT_API_RPM    = 60;

// ── Database Connection Resilience ────────────────────────────
export const DB_RETRY_COUNT          = 5;
export const DB_RETRY_FACTOR         = 2;
export const DB_RETRY_MIN_TIMEOUT_MS = 1000;

// ── Cache TTLs ─────────────────────────────────────────────────
export const CACHE_TTL_SEARCH_SECONDS     = 300;
export const CACHE_TTL_SUGGESTIONS_SECONDS = 3600;
```

Model IDs are parameters, not secrets — they don't need env var indirection. When a model is upgraded, the change is a code PR with a `terraform plan`-equivalent diff: visible, reviewable, and auditable.

#### 3. CI-Only Secrets (GitHub Secrets)

Never in `.env.local` or `.env.example`. Used only by GitHub Actions and Terraform. Documented in CONTEXT.md § Bootstrap Credentials Checklist.

| Secret | Used by | Purpose |
|---|---|---|
| `TF_STATE_BUCKET` | Terraform | S3 state backend bucket name (not a secret, but CI needs it) |
| `AWS_ROLE_ARN` | GitHub Actions OIDC | Assume IAM role for AWS operations |
| `NEON_API_KEY` | Terraform, branch cleanup script | Neon provider + branch management |
| `VERCEL_TOKEN` | Terraform | Vercel provider |
| `VERCEL_ORG_ID` | Terraform | Scope Vercel operations |
| `SENTRY_ORG` | Terraform | Scope Sentry operations |

#### 4. Developer Tooling (Claude Code + MCP)

The AI developer (Claude Code) needs its own configuration, separate from the application. These are set in the developer's shell profile or session, not in `.env.example`.

```bash
# Claude Code — route through AWS Bedrock (same account as app)
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-west-2
export AWS_PROFILE=srf-dev           # or AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY

# Claude Code — Bedrock bearer token (alternative to IAM credentials)
# export AWS_BEARER_TOKEN_BEDROCK=   # If using bearer token auth instead of IAM

# Claude Code — experimental features
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

# MCP servers (configured in .claude/settings.json, not env vars)
# Neon MCP: uses NEON_API_KEY from env or settings
# Sentry MCP: uses SENTRY_AUTH_TOKEN from env or settings
```

**Why separate from `.env.example`:** Claude Code env vars configure the *development tool*, not the application. They route the AI developer through the project's AWS account (same billing, same permissions). A human developer using VS Code wouldn't need these; an AI developer using Claude Code does. The application code never reads `CLAUDE_CODE_USE_BEDROCK` — only the Claude Code CLI does.

**AWS authentication for local development:** The developer (human or AI) authenticates to AWS via an IAM user with an `srf-dev` profile, or via `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`. This is separate from the OIDC federation used by GitHub Actions. The IAM user needs Bedrock inference permissions (`bedrock:InvokeModel*`, `bedrock:Converse*`) for the configured region.

### Local Development Environment

Developers run the app locally without Terraform. The development environment uses a Neon dev branch (not local PostgreSQL) to ensure extension parity (pgvector, pg_search, pg_trgm, unaccent, pg_stat_statements).

**Bootstrap sequence:**

1. Clone repo, `pnpm install`
2. Copy `.env.example` → `.env.local`, fill in values (see § Environment Variables above)
3. `pnpm db:migrate` — applies dbmate migrations to the Neon dev branch
4. `pnpm dev` — starts Next.js dev server at `localhost:3000`

**Neon dev branch workflow:**

- The `dev` branch is created from `main` during initial Neon project setup (Terraform or console)
- Developers connect to the dev branch via `NEON_DATABASE_URL` in `.env.local`
- Each developer may create personal branches from `dev` for isolated work: `neonctl branches create --name feat/my-feature --parent dev`
- CI creates ephemeral branches per PR (see § Neon Branch-per-PR above); developers do not share the CI branch
- When working on migrations, run `pnpm db:migrate` against the dev branch and verify with `pnpm db:status`

**Contentful local access:**

- Contentful Delivery API (read-only) is accessed via `CONTENTFUL_ACCESS_TOKEN` + `CONTENTFUL_SPACE_ID` in `.env.local`
- The book reader fetches from Contentful Delivery API; search fetches from Neon. Both work locally without additional setup
- For ingestion development, the `CONTENTFUL_MANAGEMENT_TOKEN` is needed — only for developers working on the ingestion pipeline

**Test data seeding:**

- `pnpm db:seed` loads a minimal dataset for local development: a subset of Autobiography chapters (3–5 chapters), pre-computed embeddings, and a handful of search queries for the golden set
- The seed script is idempotent — safe to run repeatedly
- Full corpus ingestion is a separate pipeline step, not part of local dev setup

**Offline/degraded mode:**

- If Neon is unreachable, `pnpm dev` still starts — page rendering works, but search and reader API calls fail with clear error messages
- If Contentful is unreachable, the book reader shows a fallback message; search continues to work (Neon is the search index)
- Claude API unavailability (Bedrock) degrades search to pure hybrid results — no query expansion or passage ranking

**Claude Code developer tooling:**

- MCP servers configured in `.claude/settings.json` provide database access and context. See § Developer Tooling above for the Neon MCP configuration
- Claude Code can run migrations, query the dev branch, and execute the ingestion pipeline directly

Terraform manages deployed environments only. Local development uses direct Neon connection strings and local config files.

*Section revised: 2026-02-25, consolidated environment configuration into single source of truth. Three layers: .env.example (secrets + per-environment), /lib/config.ts (named constants per ADR-123), developer tooling (Claude Code). Region updated to us-west-2 per human directive. Naming standardized: NEON_DATABASE_URL, CONTENTFUL_ACCESS_TOKEN. Updated: CI workflow file structure (ci.yml + terraform.yml + neon-branch.yml + neon-cleanup.yml + dependabot.yml), progressive module activation via feature flags, secret rotation clarified (manual until 3d), Terraform boundary corrected (GitHub settings manual, not Terraform-managed).*
*Section revised: 2026-02-26, expanded Local Development Environment subsection with Neon branch workflow, Contentful access, test data seeding, offline/degraded mode, and Claude Code tooling.*
*Section revised: 2026-02-26, bootstrap automation via `scripts/bootstrap.sh` (ADR-020), environment lifecycle scripts (`create-env.sh`/`destroy-env.sh` for Arc 4+), `terraform/bootstrap/trust-policy.json` added to module layout.*
*Section revised: 2026-02-28, secrets management architecture — AWS Secrets Manager as single source of truth (ADR-125), Vercel OIDC federation for zero long-lived AWS credentials (ADR-126), environment-scoped security, /lib/config.ts facade pattern.*

**Operational surface companion:** DES-060 specifies the operational *surface* built on top of this infrastructure foundation — health endpoint, `/ops` dashboard, deployment ceremony scripts, SLI/SLO framework, and design-artifact traceability. DES-039 is the infrastructure; DES-060 is the visibility layer. See PRO-035, PRO-036, PRO-037, PRO-039.

---
