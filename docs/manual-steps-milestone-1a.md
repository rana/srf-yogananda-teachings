# Human Setup Runbook — Milestone 1a

*Governing refs: ADR-016, ADR-020, ADR-124, DES-039. Full credential inventory: [bootstrap-credentials.md](bootstrap-credentials.md).*

## The fast path

```bash
./scripts/bootstrap.sh
```

The bootstrap script automates everything it can. You paste two credentials when prompted (Neon org key, Sentry auth token). The script creates all AWS resources, configures Vercel, and populates GitHub secrets. Total time: ~5 minutes.

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
| 3 | OIDC provider (`token.actions.githubusercontent.com`) + IAM role (`portal-ci`) | AWS CLI + `terraform/bootstrap/trust-policy.json` | No |
| 4 | Neon org API key — Organization Settings → API Keys → Create | **Paste when prompted** | Yes |
| 5 | Sentry auth token — Settings → Auth Tokens → Create | **Paste when prompted** | Yes |
| 6 | Sentry org slug — derived from auth token via Sentry API | Script fetches automatically | No |
| 7 | Vercel project link + API token + org ID | Vercel CLI | No |
| 8 | GitHub secrets (all values in batch) | `gh secret set` | No |
| 9 | `terraform init` — connects to S3 backend | Terraform CLI | No |

**Cost protection (manual, ~30 seconds):**
- Neon spend alert: console.neon.tech → Billing → Alerts → $50/mo
- Vercel spend alert: vercel.com → Settings → Billing → Spend Management → $50/mo

### Phase 2 — Claude runs Terraform

You wait. Claude handles:
1. `terraform apply` — creates Neon project, Sentry project, AWS core resources (OIDC, IAM roles, S3, Budget alarm). Vercel activates in Milestone 1b.
2. MCP verification: `list_projects`, `run_sql` (confirms PG18, Scale tier, extensions)
3. Retrieves connection strings, DSN, AWS keys from Terraform output and MCP
4. Populates `.env.local` with all Terraform-derived values

**Claude tells you when Phase 2 is complete.**

### Phase 3 — Post-Terraform keys (you + Claude)

| Step | What | Where | Manual? |
|------|------|-------|---------|
| 10 | Neon project-scoped API key | Project Settings → API Keys → Create (or `neonctl api-keys create`) | Yes |
| 11 | Verify MCP connection | Ask Claude to run `list_projects` | Claude |
| 12 | Voyage AI API key *(Milestone 1b)* | dash.voyageai.com → API Keys | Yes |
| 13 | Contentful tokens *(Milestone 1b)* | app.contentful.com → Settings → API Keys | Yes |
| 14 | Bedrock model access *(Milestone 1b)* | AWS Console → Bedrock → Model Access → `us-west-2` | Yes |

**Where post-Terraform keys go:**

| Key | `.env.local` | GitHub Secret | Vercel Env Var |
|-----|-------------|--------------|----------------|
| Neon project-scoped key | `NEON_API_KEY` | `NEON_PROJECT_API_KEY` | — |
| Voyage AI | `VOYAGE_API_KEY` | `VOYAGE_API_KEY` | `VOYAGE_API_KEY` |
| Contentful Space ID | `CONTENTFUL_SPACE_ID` | `CONTENTFUL_SPACE_ID` | — |
| Contentful Access Token | `CONTENTFUL_ACCESS_TOKEN` | — | `CONTENTFUL_ACCESS_TOKEN` |
| Contentful Management Token | `CONTENTFUL_MANAGEMENT_TOKEN` | `CONTENTFUL_MANAGEMENT_TOKEN` | — |
| Bedrock keys (local dev) | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | — | Set by Terraform |

---

## Who populates `.env.local`

`.env.example` is the reference template — don't edit it. `.env.local` is your working copy. Most values are populated by Claude after `terraform apply`; you fill in only 4.

| Variable | Who | How |
|----------|-----|-----|
| `NEON_DATABASE_URL` | Claude | MCP `get_connection_string` after `terraform apply` |
| `NEON_DATABASE_URL_DIRECT` | Claude | MCP `get_connection_string` after `terraform apply` |
| `NEON_PROJECT_ID` | Claude | MCP `list_projects` after `terraform apply` |
| `NEON_API_KEY` | **You** | Phase 3, step 10 — paste project-scoped key |
| `AWS_REGION` | Claude | Static `us-west-2` |
| `AWS_ACCESS_KEY_ID` | Claude | Terraform output |
| `AWS_SECRET_ACCESS_KEY` | Claude | Terraform output |
| `VOYAGE_API_KEY` | **You** | Milestone 1b — Voyage dashboard |
| `CONTENTFUL_SPACE_ID` | Claude | Terraform output |
| `CONTENTFUL_ACCESS_TOKEN` | **You** | Milestone 1b — Contentful dashboard |
| `CONTENTFUL_MANAGEMENT_TOKEN` | **You** | Milestone 1b — Contentful dashboard |
| `NEXT_PUBLIC_SENTRY_DSN` | Claude | Terraform output |
| `SENTRY_AUTH_TOKEN` | Claude | Captured by `bootstrap.sh` |

---

## Ongoing

### Quarterly key rotation

- **Neon project key:** Create new → update GitHub + `.env.local` → revoke old (no rotate-in-place API)
- **Bedrock IAM keys:** Create new → update Vercel env vars → delete old
- **Other tokens:** Rotate Voyage, Sentry, Vercel tokens on the same quarterly cadence

---

## Auth mechanisms (reference)

| Context | Mechanism | Stored Where |
|---------|-----------|-------------|
| GitHub Actions → AWS | OIDC federation (`portal-ci` role) | No stored keys |
| Vercel → Bedrock | IAM user (`portal-app-bedrock`) | Vercel env vars |
| Claude Code → Neon | Project-scoped API key | `.env.local` |
| CI → Neon branches | Project-scoped API key | GitHub secret |
| Terraform → providers | Org/account tokens | GitHub secrets |
