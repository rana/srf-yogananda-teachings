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
| 6 | Sentry org slug — Settings → General | **Paste when prompted** | Yes |
| 7 | Vercel project link + API token | Vercel CLI | No |
| 8 | GitHub secrets (all values in batch) | `gh secret set` | No |
| 9 | `terraform init` — connects to S3 backend | Terraform CLI | No |

**Cost protection (manual, ~30 seconds):**
- Neon spend alert: console.neon.tech → Billing → Alerts → $50/mo
- Vercel spend alert: vercel.com → Settings → Billing → Spend Management → $50/mo

### Phase 2 — Claude runs Terraform

You wait. Claude handles:
1. `terraform apply` — creates Neon project, Sentry project, IAM user, Vercel project
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
