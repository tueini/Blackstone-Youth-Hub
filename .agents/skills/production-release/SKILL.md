---
name: production-release
description: >-
  Two-stage approval workflow triggered after merging website-beta changes to GitHub main.
  Use this skill whenever the user reports: "merge completed", "merge done", "PR done", "PR completed",
  "PR merged", "merged to main", or asks to synchronize local production files and deploy to the Firebase production site.
---

# Production Release: Local Website Sync & Production Deploy

This skill manages the safe, staged synchronization of the production `Website/` repository and subsequent deployment to the live Firebase production site (`youth.blackstoneward.org`).

## Trigger Conditions
Activate this skill whenever:
- The user reports any of: *"merge completed"*, *"merge done"*, *"PR done"*, *"PR completed"*, *"PR merged"*, *"Merged to main"*, or *"Completed the merge of website-beta files to GitHub"*.
- The user asks to sync the production repository or deploy to production after completing Phase 3 of the Air Gap protocol.

---

## Stage 1: Approval Gate — Sync Local `Website` Repository

### 1. Prompt for Approval
**NEVER** automatically update the local `Website` directory without explicit user approval.
Prompt the user using `ask_question` or a clear conversational prompt:

> *"GitHub merge to `main` is complete. Would you like me to update the local `Website` repository from `origin/main`?"*

Stop and await the user's response. Do NOT execute any git sync commands until the user replies with affirmative approval (e.g., "Approved", "Yes", "Proceed", or selecting the approved option).

### 2. Execution (Upon Approval)
Once approved:
1. Fetch latest changes from the remote:
   ```bash
   git fetch origin
   ```
2. Set upstream tracking if needed and fast-forward merge `origin/main` in the local sibling `Website/` directory:
   ```bash
   git -C ../Website branch --set-upstream-to=origin/main main && git -C ../Website merge origin/main
   ```
3. Synchronize the local `main` branch pointer in `Website-beta` as well:
   ```bash
   git branch -f main origin/main
   ```
4. Verify the state in `Website/`:
   ```bash
   git -C ../Website status && git -C ../Website log -n 1
   ```
5. Report the fast-forward commit hash, updated files, and branch status cleanly to the user.

---

## Stage 2: Approval Gate — Deploy to Firebase Production Site

### 1. Prompt for Approval
**NEVER** deploy to production automatically immediately after syncing.
Prompt the user for a separate, explicit approval:

> *"Local `Website` is now up to date with `main` at commit `[commit-hash]`. Would you like me to deploy to the Firebase production site (`youth.blackstoneward.org` / `hosting:youth`)?"*

Stop and await the user's explicit reply.

### 2. Execution (Upon Approval)
Once approved:
1. Deploy specifically to the production hosting target (`youth`) referencing the production `public` directory:
   ```bash
   firebase deploy --only hosting:youth
   ```
2. Verify output confirms:
   - `✔ Deploy complete!`
   - Target is `youth-blackstoneward` (associated with `youth.blackstoneward.org`).
3. Report completion and remind the user to perform any live smoke test checks on the production URL (`https://youth.blackstoneward.org`).
