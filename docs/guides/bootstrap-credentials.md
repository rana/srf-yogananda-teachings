# Bootstrap Credentials Checklist

One-time credential provisioning required before the first `terraform apply`. The human principal creates these accounts and tokens — they cannot be automated. See ADR-016 for infrastructure architecture, ADR-125 for secrets management strategy, ADR-126 for Vercel OIDC federation, and DES-039 for deployment spec.

## Milestone 1a (infrastructure bootstrap)

| Credential | Where to create | What it enables | Store as |
|---|---|---|---|
| **S3 bucket for Terraform state** | AWS Console → S3 → Create Bucket (`srf-portal-terraform-state`, versioning + AES-256 encryption) | State backend with versioning and encryption | Bucket name → `terraform { backend "s3" {} }` |
| **DynamoDB table for state locking** | AWS Console → DynamoDB → Create Table (`srf-portal-terraform-locks`, partition key `LockID` String, on-demand) | Prevents concurrent `terraform apply` | Table name → `backend "s3" { dynamodb_table }` |
| **AWS Account** (region: `us-west-2`) | aws.amazon.com | S3 backups, Lambda, Bedrock, EventBridge, Secrets Manager, KMS | — |
| **AWS IAM OIDC Identity Provider (GitHub)** | AWS IAM Console → Identity Providers | GitHub Actions → AWS auth (no stored keys) | — |
| **AWS IAM OIDC Identity Provider (Vercel)** | AWS IAM Console → Identity Providers | Vercel functions → Bedrock + Secrets Manager (ADR-126, no stored keys) | — |
| **AWS IAM Role (portal-ci)** | AWS IAM Console → Roles | Scoped CI permissions (Terraform, S3, Lambda, Secrets Manager) | ARN → GitHub secret `AWS_ROLE_ARN` |
| **AWS IAM Role (portal-vercel-runtime)** | Created by Terraform | Vercel OIDC → Bedrock inference + Secrets Manager reads | ARN → Vercel env var `AWS_ROLE_ARN` (set by Terraform) |
| **AWS KMS key (portal-secrets)** | Created by Terraform | Encrypts all Secrets Manager entries | Managed by Terraform |
| **AWS Secrets Manager entries** | Created by Terraform (empty), populated during bootstrap | Centralized secret store (ADR-125) | Secret values populated via `bootstrap.sh` or manually |
| **Neon API key** | console.neon.tech → API Keys | Terraform Neon provider | AWS Secrets Manager `/portal/production/neon/org-api-key` + GitHub secret `NEON_API_KEY` |
| **Vercel API token** | vercel.com → Settings → Tokens | Terraform Vercel provider | GitHub secret `VERCEL_TOKEN` |
| **Vercel Org/Team ID** | vercel.com → Settings → General | Scoping Terraform | GitHub secret `VERCEL_ORG_ID` |
| **Sentry auth token** | sentry.io → Settings → Auth Tokens | Terraform Sentry provider | AWS Secrets Manager `/portal/production/sentry/auth-token` + GitHub secret `SENTRY_AUTH_TOKEN` |
| **Sentry org slug** | sentry.io → Settings → General | Scoping Terraform | GitHub secret `SENTRY_ORG` |
| **Neon spend alert** | console.neon.tech → Billing → Alerts | Cost protection ($50/mo threshold) | Dashboard setting (manual) |
| **Vercel spend alert** | vercel.com → Settings → Billing → Spend Management | Cost protection ($50/mo threshold) | Dashboard setting (manual) |

## Milestone 1a (content + embeddings)

| Credential | Where to create | What it enables | Store as |
|---|---|---|---|
| **Voyage AI API key** | dash.voyageai.com → API Keys | Embedding generation (ADR-118) | AWS Secrets Manager `/portal/production/voyage/api-key` → Terraform distributes to Vercel |
| **Contentful Management Token** | app.contentful.com → Settings → API Keys | Content ingestion pipeline | AWS Secrets Manager `/portal/production/contentful/management-token` |
| **Contentful Access Token** | app.contentful.com → Settings → API Keys | Delivery API (read-only) | AWS Secrets Manager `/portal/production/contentful/access-token` → Terraform distributes to Vercel |
| **Contentful Space ID** | app.contentful.com → Settings → General | API scoping | GitHub secret `CONTENTFUL_SPACE_ID` (non-secret config) |

## Milestone 1c (deploy + AI enrichment)

| Credential | Where to create | What it enables | Store as |
|---|---|---|---|
| **AWS Bedrock model access** | AWS Console → Bedrock → Model Access (`us-west-2`) | Claude Haiku inference | Enabled for the `portal-vercel-runtime` IAM role |

## Arc 2 (observability + MCP)

| Credential | Where to create | What it enables | Store as |
|---|---|---|---|
| **New Relic User API key** | one.newrelic.com → API Keys → Create (User type) | MCP server: NRQL queries, alerts, APM, deployments | `.env.local` `NEW_RELIC_API_KEY` + VS Code MCP config |
| **New Relic Account ID** | one.newrelic.com → Account Settings | Scoping API queries (optional — can pass per query) | `.env.local` `NEW_RELIC_ACCOUNT_ID` |

## Later milestones (not needed for Arc 1)

| Credential | When | Notes |
|---|---|---|
| YouTube API Key | Arc 2 (video integration) | Google Cloud Console → Secrets Manager |
| Amplitude API Key | Milestone 3d (analytics) | Amplitude dashboard (`NEXT_PUBLIC_*` — Vercel env var, not Secrets Manager) |
| SendGrid API Key | Milestone 5a (email) | SendGrid dashboard → Secrets Manager (ADR-091; see PRO-015 for SES alternative) |
| ~~Cloudflare API Token~~ | Removed from portal stack (PRO-017) | If SRF routes domain through Cloudflare, add at that point |
| Auth0 credentials | Milestone 7a+ (if ever) | Auth0 dashboard → Secrets Manager |

## Auth Mechanism Summary

**Zero long-lived AWS credentials.** The portal uses OIDC federation for all AWS access — no IAM user access keys exist anywhere.

| Context | Mechanism | Credential | Stored Where |
|---------|-----------|------------|-------------|
| GitHub Actions → AWS | GitHub OIDC federation (ADR-016) | Ephemeral STS tokens | No stored keys |
| Vercel functions → Bedrock + Secrets Manager | Vercel OIDC federation (ADR-126) | Ephemeral STS tokens | No stored keys |
| Lambda → AWS services | IAM execution role | Automatic role credentials | No stored keys |
| Claude Code → Neon | Project-scoped API key | `NEON_API_KEY` | `.env.local` |
| CI → Neon branches | Project-scoped API key | `NEON_PROJECT_API_KEY` | GitHub secret |
| Terraform → providers | Org/account tokens | Various | GitHub secrets (CI-only) |
| Local dev → AWS | AWS credential chain | Named profile or access keys | `~/.aws/credentials` or `.env.local` |

**Secrets Manager as single source of truth (ADR-125).** All application secrets live in AWS Secrets Manager under `/portal/{environment}/{service}/{key-name}`. Terraform reads from Secrets Manager and distributes to Vercel env vars. Local dev uses `.env.local` directly (the `/lib/config.ts` facade checks env vars first).

See DES-039 § Environment Configuration for the complete `.env.example`, named constants, CI secrets table, and Claude Code developer tooling setup.
