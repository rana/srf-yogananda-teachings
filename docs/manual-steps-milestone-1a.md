# Human Setup Runbook — Milestone 1a

*Governing refs: ADR-016, ADR-020, ADR-124, ADR-125, ADR-126, DES-039. Full credential inventory: [bootstrap-credentials.md](bootstrap-credentials.md).*

## The fast path

```bash
./scripts/bootstrap.sh
```

The bootstrap script automates everything it can. You paste two credentials when prompted (Neon org key, Sentry auth token). The script creates all AWS resources (including OIDC providers, IAM roles, Secrets Manager entries, and KMS key), configures Vercel, and populates GitHub secrets. Total time: ~5 minutes.

**Prerequisites:** AWS CLI configured (`aws configure`), `gh` CLI authenticated, `vercel` CLI installed, Neon account (org admin), Sentry account.

After the script completes, tell Claude: **"Bootstrap complete. Run terraform."**

---

## What the script does (reference)

The details below document what `bootstrap.sh` automates. Read this if the script fails, if you want to understand what's happening, or if you prefer to do it manually.

### Phase 1 — Infrastructure bootstrap (before `terraform apply`)

| Step | What | Tool | Manual? |
|------|------|------|---------|
| 1 | S3 bucket (`srf-portal-terraform-state`) — versioning, AES-256, public access blocked | AWS CLI | No |
| 2 | DynamoDB table (`srf-portal-terraform-locks`) — `LockID` partition key, on-demand | AWS CLI | No |
| 3 | GitHub OIDC provider (`token.actions.githubusercontent.com`) + IAM role (`portal-ci`) | AWS CLI + `terraform/bootstrap/trust-policy.json` | No |
| 4 | Vercel OIDC provider (`oidc.vercel.com/{TEAM_SLUG}`) — team issuer mode (ADR-126) | AWS CLI | No |
| 5 | KMS key (`portal-secrets`) for Secrets Manager encryption | AWS CLI | No |
| 6 | Secrets Manager entries (empty) for all Milestone 1a secrets | AWS CLI | No |
| 7 | Neon org API key — Organization Settings → API Keys → Create | **Paste when prompted** | Yes |
| 8 | Sentry auth token — Settings → Auth Tokens → Create | **Paste when prompted** | Yes |
| 9 | Sentry org slug — derived from auth token via Sentry API | Script fetches automatically | No |
| 10 | Populate Secrets Manager entries with Neon + Sentry values | AWS CLI | No |
| 11 | Vercel project link + API token + org ID | Vercel CLI | No |
| 12 | GitHub secrets (all CI-only values in batch) | `gh secret set` | No |
| 13 | `terraform init` — connects to S3 backend | Terraform CLI | No |

**Cost protection (manual, ~30 seconds):**
- Neon spend alert: console.neon.tech → Billing → Alerts → $50/mo
- Vercel spend alert: vercel.com → Settings → Billing → Spend Management → $50/mo

### Phase 2 — Claude runs Terraform

You wait. Claude handles:
1. `terraform apply` — creates Neon project, Sentry project, AWS core resources (OIDC providers, IAM roles, KMS key, Secrets Manager secrets, S3, Budget alarm), Vercel OIDC role (`portal-vercel-runtime`). Vercel activates in Milestone 1c.
2. MCP verification: `list_projects`, `run_sql` (confirms PG18, Scale tier, extensions)
3. Retrieves connection strings, DSN from Terraform output and MCP
4. Populates Secrets Manager with Neon connection strings
5. Populates `.env.local` with all values for local dev

**Claude tells you when Phase 2 is complete.**

### Phase 3 — Post-Terraform keys (you + Claude)

| Step | What | Where | Manual? |
|------|------|-------|---------|
| 14 | Neon project-scoped API key | Project Settings → API Keys → Create (or `neonctl api-keys create`) | Yes |
| 15 | Store Neon project key in Secrets Manager | `aws secretsmanager put-secret-value` | Claude |
| 16 | Verify MCP connection | Ask Claude to run `list_projects` | Claude |
| 17 | Voyage AI API key *(Milestone 1a)* | dash.voyageai.com → API Keys | Yes |
| 18 | Store Voyage key in Secrets Manager | `aws secretsmanager put-secret-value` | Claude |
| 19 | Contentful tokens *(Milestone 1a)* | app.contentful.com → Settings → API Keys | Yes |
| 20 | Store Contentful tokens in Secrets Manager | `aws secretsmanager put-secret-value` | Claude |
| 21 | Bedrock model access *(Milestone 1c)* | AWS Console → Bedrock → Model Access → `us-west-2` | Yes |

**Where post-Terraform keys go:**

| Key | `.env.local` | Secrets Manager | GitHub Secret | Vercel Env Var |
|-----|-------------|----------------|--------------|----------------|
| Neon project-scoped key | `NEON_API_KEY` | `/portal/production/neon/project-api-key` | `NEON_PROJECT_API_KEY` | — |
| Voyage AI | `VOYAGE_API_KEY` | `/portal/production/voyage/api-key` | — | Set by Terraform from SM |
| Contentful Space ID | `CONTENTFUL_SPACE_ID` | — (non-secret) | `CONTENTFUL_SPACE_ID` | — |
| Contentful Access Token | `CONTENTFUL_ACCESS_TOKEN` | `/portal/production/contentful/access-token` | — | Set by Terraform from SM |
| Contentful Management Token | `CONTENTFUL_MANAGEMENT_TOKEN` | `/portal/production/contentful/management-token` | — | — (scripts only) |

---

## Who populates `.env.local`

`.env.example` is the reference template — don't edit it. `.env.local` is your working copy. Most values are populated by Claude after `terraform apply`; you fill in only 4.

| Variable | Who | How |
|----------|-----|-----|
| `NEON_DATABASE_URL` | Claude | MCP `get_connection_string` after `terraform apply` |
| `NEON_DATABASE_URL_DIRECT` | Claude | MCP `get_connection_string` after `terraform apply` |
| `NEON_PROJECT_ID` | Claude | MCP `list_projects` after `terraform apply` |
| `NEON_API_KEY` | **You** | Phase 3, step 14 — paste project-scoped key |
| `AWS_REGION` | Claude | Static `us-west-2` |
| `AWS_ACCESS_KEY_ID` | Claude | From your `srf-dev` IAM user (local dev only) |
| `AWS_SECRET_ACCESS_KEY` | Claude | Paired with above (local dev only) |
| `VOYAGE_API_KEY` | **You** | Milestone 1a — Voyage dashboard |
| `CONTENTFUL_SPACE_ID` | Claude | Terraform output |
| `CONTENTFUL_ACCESS_TOKEN` | **You** | Milestone 1a — Contentful dashboard |
| `CONTENTFUL_MANAGEMENT_TOKEN` | **You** | Milestone 1a — Contentful dashboard |
| `NEXT_PUBLIC_SENTRY_DSN` | Claude | Terraform output |
| `SENTRY_AUTH_TOKEN` | Claude | Captured by `bootstrap.sh` |

**Note:** `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are only used for local development. In deployed environments (Vercel), the portal uses Vercel OIDC federation (ADR-126) — no access keys exist. Alternatively, use `AWS_PROFILE=srf-dev` instead of explicit keys.

---

## Ongoing

### Secret rotation

Secrets Manager is the single source of truth for all application secrets (ADR-125). Rotation procedure:

1. **Create new credential** at the provider (Voyage, Contentful, Neon, Sentry)
2. **Update Secrets Manager** — `aws secretsmanager put-secret-value --secret-id /portal/production/{service}/{key}`
3. **Run `terraform apply`** — Terraform reads new value from Secrets Manager and updates Vercel env vars
4. **Revoke old credential** at the provider

**No more multi-platform manual updates.** Update one place (Secrets Manager), run Terraform, done.

**Rotation cadence:** Quarterly for all third-party API tokens. AWS credentials require no rotation (OIDC tokens are ephemeral).

---

## Auth mechanisms (reference)

| Context | Mechanism | Stored Where |
|---------|-----------|-------------|
| GitHub Actions → AWS | GitHub OIDC federation (`portal-ci` role) | No stored keys |
| Vercel → Bedrock + Secrets Manager | Vercel OIDC federation (`portal-vercel-runtime` role, ADR-126) | No stored keys |
| Lambda → AWS services | IAM execution role | No stored keys |
| Claude Code → Neon | Project-scoped API key | `.env.local` |
| CI → Neon branches | Project-scoped API key | GitHub secret |
| Terraform → providers | Org/account tokens | GitHub secrets |
| Local dev → AWS | Named profile or access keys | `~/.aws/credentials` or `.env.local` |
