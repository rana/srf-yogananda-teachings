# Getting Started

You need 5 accounts and about 15 minutes. After that, Claude builds everything autonomously.

---

## Step 1: Install tools

```bash
# Required
node --version    # 20+
pnpm --version    # 9+

# For database verification
psql --version    # any (apt install postgresql-client / brew install libpq)

# For Milestone 1c infrastructure (not needed yet)
aws --version     # v2 (https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
gh --version      # any (apt install gh / brew install gh)
terraform -v      # 1.7+ (https://developer.hashicorp.com/terraform/install)
```

---

## Step 2: Create accounts (~15 min)

Create these 5 accounts. Keep the tokens somewhere — you'll paste them to Claude in Step 3.

### 1. Neon (database)
- Go to [console.neon.tech](https://console.neon.tech) and sign up
- Don't create a project yet — Claude does that via MCP
- Note your **org API key**: Organization Settings → API Keys → Create

### 2. Contentful (content management)
- Go to [app.contentful.com](https://app.contentful.com) and sign up (free Community tier)
- Create a space (any name — Claude configures the content model)
- Go to Settings → API Keys → Add API Key
- Note three values:
  - **Space ID** (Settings → General Settings)
  - **Content Delivery API access token**
  - **Content Management API personal access token** (Settings → CMA tokens → Generate)

### 3. Voyage AI (embeddings)
- Go to [dash.voyageai.com](https://dash.voyageai.com) and sign up
- Note your **API key**: Dashboard → API Keys

### 4. Sentry (error tracking)
- Go to [sentry.io](https://sentry.io) and sign up (free Developer tier)
- Create a project → choose Next.js
- Note two values:
  - **DSN** (shown after project creation, also in Settings → Client Keys)
  - **Auth token**: Settings → Auth Tokens → Create (scopes: project:read, project:write, org:read)

### 5. AWS (infrastructure)
- If you don't have an account: [aws.amazon.com](https://aws.amazon.com)
- Configure the CLI: `aws configure` with region `us-west-2`
- Only needed for Milestone 1c deployment — not blocking for Milestone 1a

---

## Step 3: Tell Claude your credentials

Copy this template, fill in your values, and paste it to Claude:

```
Accounts created. Here are my credentials:

Neon org API key: [paste]
Contentful space ID: [paste]
Contentful delivery token: [paste]
Contentful management token: [paste]
Voyage API key: [paste]
Sentry DSN: [paste]
Sentry auth token: [paste]
```

**What Claude does with these:**
1. Creates a Neon project via MCP (PostgreSQL 18, pgvector, pg_search)
2. Fills in `.env.local` with all connection strings and tokens
3. Runs the verification script to confirm everything works

You don't fill `.env.local` yourself. Claude handles it.

---

## Step 4: Verify

```bash
./scripts/verify.sh
```

Green = ready. Claude begins building Milestone 1a.

If anything fails, the script tells you exactly what's wrong.

For write-access testing (creates and immediately deletes test data):
```bash
./scripts/verify.sh --write
```

---

## What happens next

Claude builds Milestone 1a autonomously — no human gates:

1. **Repository setup** — Next.js + TypeScript + Tailwind
2. **Database schema** — 19 tables covering search, content, themes
3. **Contentful content model** — Book → Chapter → Section → TextBlock
4. **English Autobiography import** — already extracted, imports to Contentful + Neon
5. **Search API** — hybrid vector + full-text with RRF fusion
6. **Search UI** — "What did Yogananda say about..." with verbatim results
7. **Book reader** — chapter navigation with deep-link anchors
8. **Search quality evaluation** — 58-query golden set across 7 difficulty categories

When you're ready for Milestone 1c (deployment), run:
```bash
./scripts/bootstrap.sh    # Creates AWS infrastructure (~5 min, prompts for 2 credentials)
./scripts/verify.sh       # Confirms everything works
```

---

## Reference docs

These exist for troubleshooting and understanding the system — you don't need to read them to get started:

- [bootstrap-credentials.md](bootstrap-credentials.md) — Complete credential inventory with storage locations
- [manual-steps-milestone-1a.md](manual-steps-milestone-1a.md) — Detailed reference of what `bootstrap.sh` automates
- `.env.example` — Template showing all environment variables
