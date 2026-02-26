# Bootstrap Credentials Checklist

One-time credential provisioning required before the first `terraform apply`. The human principal creates these accounts and tokens — they cannot be automated. See ADR-016 for architecture and DES-039 for deployment spec.

## Milestone 1a (infrastructure bootstrap)

| Credential | Where to create | What it enables | Store as |
|---|---|---|---|
| **Terraform Cloud org + workspace** | app.terraform.io → New Organization | State backend (local execution mode), locking, versioning | TFC API token → GitHub secret `TF_API_TOKEN` |
| **AWS Account** (region: `us-west-2`) | aws.amazon.com | S3 backups, Lambda, Bedrock, EventBridge | — |
| **AWS IAM OIDC Identity Provider** | AWS IAM Console → Identity Providers | GitHub Actions → AWS auth (no stored keys) | — |
| **AWS IAM Role (portal-ci)** | AWS IAM Console → Roles | Scoped CI permissions (Terraform, S3, Lambda) | ARN → GitHub secret `AWS_ROLE_ARN` |
| **AWS IAM User (portal-app-bedrock)** | Created by Terraform (`aws_iam_user` + `aws_iam_access_key`) | Vercel → Bedrock inference (`bedrock:InvokeModel*`, `bedrock:Converse*`) | Terraform sets keys as Vercel env vars automatically |
| **Neon API key** | console.neon.tech → API Keys | Terraform Neon provider | GitHub secret `NEON_API_KEY` |
| **Vercel API token** | vercel.com → Settings → Tokens | Terraform Vercel provider | GitHub secret `VERCEL_TOKEN` |
| **Vercel Org/Team ID** | vercel.com → Settings → General | Scoping Terraform | GitHub secret `VERCEL_ORG_ID` |
| **Sentry auth token** | sentry.io → Settings → Auth Tokens | Terraform Sentry provider | GitHub secret `SENTRY_AUTH_TOKEN` |
| **Sentry org slug** | sentry.io → Settings → General | Scoping Terraform | GitHub secret `SENTRY_ORG` |
| **Neon spend alert** | console.neon.tech → Billing → Alerts | Cost protection ($50/mo threshold) | Dashboard setting (manual) |
| **Vercel spend alert** | vercel.com → Settings → Billing → Spend Management | Cost protection ($50/mo threshold) | Dashboard setting (manual) |

## Milestone 1b (content + AI)

| Credential | Where to create | What it enables | Store as |
|---|---|---|---|
| **AWS Bedrock model access** | AWS Console → Bedrock → Model Access (`us-west-2`) | Claude Haiku inference | Enabled on the `portal-app-bedrock` IAM user |
| **Voyage AI API key** | dash.voyageai.com → API Keys | Embedding generation (ADR-118) | GitHub secret `VOYAGE_API_KEY` + Vercel env var |
| **Contentful Management Token** | app.contentful.com → Settings → API Keys | Content ingestion pipeline | GitHub secret `CONTENTFUL_MANAGEMENT_TOKEN` |
| **Contentful Access Token** | app.contentful.com → Settings → API Keys | Delivery API (read-only) | Vercel env var `CONTENTFUL_ACCESS_TOKEN` |
| **Contentful Space ID** | app.contentful.com → Settings → General | API scoping | GitHub secret `CONTENTFUL_SPACE_ID` |

## Later milestones (not needed for Arc 1)

| Credential | When | Notes |
|---|---|---|
| YouTube API Key | Arc 2 (video integration) | Google Cloud Console |
| New Relic License Key | Milestone 3d (observability) | New Relic dashboard |
| Amplitude API Key | Milestone 3d (analytics) | Amplitude dashboard |
| SendGrid API Key | Milestone 5a (email) | SendGrid dashboard — SRF standard (ADR-091; see PRO-015 for SES alternative) |
| Cloudflare API Token | When custom domain assigned | Cloudflare dashboard |
| Auth0 credentials | Milestone 7a+ (if ever) | Auth0 dashboard |

## Auth Mechanism Summary

**Two AWS auth mechanisms serve different contexts.** GitHub Actions uses OIDC federation (`portal-ci` role) — no stored keys. Vercel functions use an IAM user (`portal-app-bedrock`) with Bedrock inference permissions only (`bedrock:InvokeModel*`, `bedrock:Converse*`) — keys stored as Vercel env vars and rotated quarterly (manual key rotation until Milestone 3d). Non-AWS providers (Neon, Vercel, Sentry, Voyage) use API tokens stored as GitHub secrets with quarterly manual rotation.

See DES-039 § Environment Configuration for the complete `.env.example`, named constants, CI secrets table, and Claude Code developer tooling setup.
