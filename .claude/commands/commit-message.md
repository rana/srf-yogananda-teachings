Draft a commit message for the current changes. Do NOT stage, commit, or push anything.

## Steps

1. Run `git status` (never use `-uall`) to see untracked and modified files.
2. Run `git diff` to see unstaged changes, and `git diff --cached` to see staged changes.
3. Run `git log --oneline -10` to see recent commit message style.
4. Analyze all changes (staged and unstaged) and draft a concise commit message:
   - Summarize the nature of the changes (new feature, enhancement, bug fix, refactor, docs, test, etc.).
   - Use the imperative mood (e.g., "Add", "Fix", "Update", "Remove").
   - Keep the subject line under 72 characters.
   - Add a body with bullet points if the changes span multiple concerns.
   - Match the style and conventions visible in recent commits.
5. Present the draft message to the user for review. Do NOT run any git commands that modify state.
