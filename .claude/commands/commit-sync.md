Stage all changes, commit with the provided message, and sync with the remote. The user must supply the commit message as the argument: `/commit-sync <message>`

If no argument is provided, ask the user for a commit message before proceeding.

## Steps

1. Run `git status` (never use `-uall`) to confirm there are changes to commit. If there are no changes, inform the user and stop.
2. Do NOT commit files that likely contain secrets (`.env`, `credentials.json`, etc.). Warn the user if any are present.
3. Stage all relevant changed files by name (prefer explicit file names over `git add -A`). Use `git add -A` only if the number of changed files makes individual staging impractical (more than ~15 files).
4. Commit using a HEREDOC for the message to preserve formatting:
   ```
   git commit -m "$(cat <<'EOF'
   <message>

   Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
   EOF
   )"
   ```
5. If the commit fails due to a pre-commit hook, fix the issue, re-stage, and create a NEW commit (never amend).
6. Run `git push` to sync with the remote. If the current branch has no upstream, use `git push -u origin <branch>`.
7. Run `git status` to confirm clean working tree and show the result to the user.
