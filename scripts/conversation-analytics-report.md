# Conversation Analytics Report

*Generated: 2026-03-01 17:07 UTC*

**Corpus:** 233 conversations, 809 MB total
**Date range:** 2026-02-19 to 2026-03-01

## Skill/Command Usage

| Rank | Skill | Invocations | % of sessions |
|------|-------|-------------|---------------|
| 1 | `/explore-act` | 68 | 29% |
| 2 | `/commit` | 68 | 29% |
| 3 | `/explore` | 25 | 11% |
| 4 | `/commit-all` | 19 | 8% |
| 5 | `/coherence` | 7 | 3% |
| 6 | `/compose` | 5 | 2% |
| 7 | `/deep-review` | 2 | 1% |
| 8 | `/compact` | 1 | 0% |
| 9 | `/crystallize` | 1 | 0% |
| 10 | `/mission-align` | 1 | 0% |

**Never invoked (37):** `/api-review`, `/arc-gate`, `/archaeology`, `/calibrate`, `/cognitive-debug`, `/consequences`, `/context-switch`, `/cultural-lens`, `/dedup-proposals`, `/doc-health`, `/docs-quality`, `/drift-detect`, `/gaps`, `/garden`, `/ghost`, `/hardening-audit`, `/implement`, `/incident-ready`, `/inversion`, `/launch-gate`, `/morning`, `/ops-review`, `/park`, `/proposal-merge`, `/reframe`, `/resume`, `/scope`, `/seeker-ux`, `/steelman`, `/supply-chain-audit`, `/theme-integrate`, `/threat-model`, `/tomorrow`, `/triad`, `/verify`, `/why-chain`, `/workflow-trace`

## Topic Distribution

| Topic | Signal hits | Sessions touching |
|-------|------------|-------------------|
| commit | 555 | 213 |
| cognitive | 256 | 119 |
| design | 243 | 102 |
| infrastructure | 216 | 89 |
| frontend | 136 | 69 |
| editorial | 122 | 61 |
| meta | 112 | 52 |
| search | 110 | 56 |
| book_ingestion | 107 | 52 |
| principles | 101 | 57 |
| multilingual | 94 | 45 |
| proposals | 92 | 53 |

## Tool Usage (Top 20)

| Tool | Total calls |
|------|------------|
| `Read` | 3757 |
| `Edit` | 3205 |
| `Bash` | 1757 |
| `Grep` | 1733 |
| `TodoWrite` | 1128 |
| `Task` | 198 |
| `mcp__plugin_playwright_playwright__browser_run_code` | 136 |
| `WebFetch` | 104 |
| `Write` | 96 |
| `Glob` | 66 |
| `ToolSearch` | 52 |
| `Agent` | 50 |
| `mcp__plugin_playwright_playwright__browser_evaluate` | 34 |
| `TaskOutput` | 32 |
| `mcp__plugin_playwright_playwright__browser_click` | 22 |
| `mcp__plugin_playwright_playwright__browser_snapshot` | 19 |
| `mcp__plugin_playwright_playwright__browser_take_screenshot` | 11 |
| `ExitPlanMode` | 10 |
| `AskUserQuestion` | 9 |
| `mcp__plugin_playwright_playwright__browser_wait_for` | 9 |

## Session Engagement

| Category | Count | Avg turns | Top topic |
|----------|-------|-----------|-----------|
| trivial (<10KB) | 15 | 0 | uncategorized |
| short (10-100KB) | 36 | 8 | commit |
| medium (100KB-1MB) | 80 | 18 | commit |
| substantial (1-5MB) | 53 | 58 | commit |
| major (>5MB) | 49 | 171 | commit |

## Correction Patterns

**Total corrections detected:** 64 across 40 sessions (17% of sessions)

| Pattern | Count | Example |
|---------|-------|---------|
| `instead` | 24 | Yes, ADRs and incorporate them into the design documents now.  Find appropriate place(s) to preserve your questions for ... |
| `actually` | 20 | <task-notification> <task-id>a8ed376</task-id> <tool-use-id>toolu_bdrk_016DwfGQBmAt6GaXQTYmUnT3</tool-use-id> <status>co... |
| `simplify` | 7 | <ide_selection>The user selected the lines 65 to 83 from /home/rana/prj/srf-yogananda-teachings/tmp.md: Reflect through ... |
| `wrong` | 4 | This session is being continued from a previous conversation that ran out of context. The summary below covers the earli... |
| `dont_do` | 2 | This session is being continued from a previous conversation that ran out of context. The summary below covers the earli... |
| `revert` | 2 | This session is being continued from a previous conversation that ran out of context. The summary below covers the earli... |
| `too_much` | 2 | <command-message>explore-act</command-message> <command-name>/explore-act</command-name> <command-args>Evaluate whether ... |
| `i_meant` | 2 | <ide_opened_file>The user opened the file /home/rana/.bashrc in the IDE. This may or may not be related to the current t... |
| `direct_no` | 1 | <ide_opened_file>The user opened the file /home/rana/prj/srf-yogananda-teachings/.elmer/worktrees/srf-visual-design-lang... |

## Repeated Instructions (3+ sessions)

Phrases appearing in first user message across multiple sessions:

| Phrase | Sessions |
|--------|----------|
| `command message command name` | 174 |
| `command name command args` | 93 |
| `message command name explore` | 86 |
| `message command name commit` | 74 |
| `command message commit command` | 66 |
| `message commit command message` | 66 |
| `commit command message command` | 66 |
| `command name commit command` | 66 |
| `name commit command name` | 66 |
| `command message explore act` | 64 |
| `message explore act command` | 64 |
| `explore act command message` | 64 |
| `act command message command` | 64 |
| `command name explore act` | 64 |
| `name explore act command` | 64 |
| `explore act command name` | 64 |
| `act command name command` | 64 |
| `home rana prj srf` | 47 |
| `rana prj srf yogananda` | 47 |
| `prj srf yogananda teachings` | 47 |

## Weekly Activity

| Week | Sessions | Total MB | Top skill |
|------|----------|----------|-----------|
| 2026-W07 | 35 | 137 | `/explore` |
| 2026-W08 | 168 | 577 | `/commit` |
| 2026-W09 | 30 | 95 | `/explore-act` |