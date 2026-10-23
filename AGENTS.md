# Operational Rules & Standing Instructions

These standing rules govern all agent operations in this repository.

## 1. Strict File Fence (Scope Lock)
- **Scope Lock**: The agent is expressly forbidden from altering any file, line of code, or logic block that is not explicitly named in the Mission Objective or directly required to resolve the immediate task.
- **No Unprompted Refactoring**: Never "clean up," refactor, or modernize code that falls outside the exact scope of the mission. Existing variables, comments, and adjacent logic must be preserved exactly as they are found.
- **Native Editing Only**: Changes must be made using native IDE file-editing tools. Using terminal commands like `sed`, `awk`, or `echo` to modify files is strictly forbidden.
- **Terminal Autonomy**: Safe, read-only terminal commands (such as `grep`, `ls`, and `cat`) are pre-authorized without asking for confirmation, provided they fall strictly within the current Scope Lock and File Fence.

## 2. Autonomous Versioning & Documentation
- **Version Management**: The agent manages decimal version increments (Patch, Minor, Major) based on the human operator's defined level of update.
- **Mandatory Footer & Client Version Sync**: With every version increment, the agent MUST update `public/cfm-config.js` (`window.APP_VERSION_GLOBAL = "X.XX.XX"`), update the static fallback in `public/index.html`'s footer, and ensure the script tag has a cache-busting query parameter (`/cfm-config.js?v=X.XX.XX`) so the staging site footer immediately displays the new version upon deployment.
- **Documentation**: Every completed mission must conclude with updates to `PROJECT_STATE.md` and `CHANGELOG.md` reflecting the new version number and detailing the specific changes made.

## 3. Beta-First Execution
- **Beta Isolation**: ALL new features, bug fixes, and architectural changes MUST be executed in the `Website-beta/` workspace and deployed to `test.blackstoneward.org` first. Direct production edits are strictly forbidden.

## 4. Code First, Deploy Second (Approval Gate)
- **No Local Bot Verification**: Do not launch local servers (`python3 -m http.server`, etc.) or utilize a headless browser subagent to verify work unless explicitly commanded.
- **Workflow**:
  1. Write the code locally.
  2. Stop and report: `"Code Complete. Awaiting deployment approval."`
  3. Wait for the human operator to test and explicitly reply `"Approved"`.
  4. Only execute deployment (e.g., `firebase deploy --only hosting:staging`) after receiving explicit approval.

## 5. Security & Credentials
- **No Hardcoded Secrets**: No passwords, hashes, or API keys are to be hardcoded into client-side JavaScript (`public/` directory). All sensitive logic must be deferred to Firebase Authentication, Cloud Functions, or Firestore Security Rules.

## 6. Shared Database Warning (Firestore Bleed Risk)
- **Shared Instance**: The Beta and Production environments share the exact same Firestore instance (`blackstoneward-b861c`).
- **No Destructive Testing**: Never run broad "Delete All" scripts in Beta, as they will wipe live production data.
- **Security Rule Bleed**: Any `firestore.rules` deployed from Beta instantly apply to the live Production site. Proceed with extreme caution.

## 7. Prompting Template (For Human Operator)
All missions should follow this structure to ensure compliance:

**Mission Objective:** @Workspace [State the goal or the specific bug to fix].

**Execution Plan:**
1. [Step 1]
2. [Step 2]
3. Update versioning and documentation (`PROJECT_STATE.md`, `CHANGELOG.md`).

**CRITICAL CONSTRAINTS (Scope Lock):**
- **File Fence:** You may ONLY modify [List specific files].
- **No Refactoring:** Do not alter any code unrelated to this specific objective.
- **Native Editing:** Do not use `sed` or terminal commands to edit files.

**Execution Checkpoint:** Do not launch a local server or browser subagent. Once the code is written locally, STOP and wait for my review. I will reply "Approved" when I am ready for you to run `firebase deploy`.

## 8. Automated GitHub Push Protocol (DevOps SOP)
GitHub authentication is securely handled via the system-authenticated GitHub CLI (`gh`) and macOS Keychain on this machine. Automated pushes are enabled.

### Phase 1: Agent Preparation & Push (IDE)
When instructed to push to GitHub (e.g., *"commit and push to GitHub"* or *"push to beta-admin"*), the agent stages, commits with the synchronized version number, and pushes directly to GitHub:
```bash
git add .
git commit -m "[Insert descriptive message here]"
git push origin beta-admin
```
No manual PAT tokens or external terminal commands are required from the human operator.

### Phase 2: The Cloud Merge (GitHub.com)
1. Log in to GitHub.com (or use `gh pr create`).
2. Navigate to the repository and open a **Pull Request** to merge the newly pushed branch (e.g., `beta-admin`) into `main`.
3. Review the code diff visually, then click **Merge pull request**.

### Phase 4: Local Website Sync & Production Deploy (Two-Stage Approval Gate)
After completing the Cloud Merge, inform the AG Agent with any of: *"merge completed"*, *"merge done"*, *"PR done"*, *"PR completed"*, or *"Merged to main"*.
The agent will activate the `.agents/skills/production-release/` skill:
1. **Gate 1 (Prompt to Sync)**: The agent explicitly asks for approval to update the local `Website/` repository from `origin/main`.
2. **Execute Sync**: Upon approval, pulls latest `main` into local `Website/` and aligns branch pointers.
3. **Gate 2 (Prompt to Deploy)**: The agent explicitly asks for approval to deploy to the live production site.
4. **Execute Deploy**: Upon approval, runs `firebase deploy --only hosting:youth --public ../Website/public` (`youth.blackstoneward.org`).

