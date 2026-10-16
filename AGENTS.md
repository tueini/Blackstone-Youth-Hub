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

## 8. The "Air Gap" GitHub Push Protocol (DevOps SOP)
Due to GitHub deprecating standard password authentication for terminal operations, and to protect Personal Access Tokens (PAT) from being permanently stored in cloud-synced AI chat histories, all code pushes to GitHub must follow the "Air Gap" protocol.

This protocol splits the labor: the AG Agent prepares the package, and the Human Operator pushes it using native terminal tools.

### Phase 1: Agent Preparation (IDE)
Feed the AG Agent a sanitized prompt to stage and commit the code locally. Do not include tokens in the prompt.
**Prompt Template:**
> `@Workspace` Stage and commit all recent changes to prepare for a GitHub push. 
> Execute `git add .` and `git commit -m "[Insert descriptive message here]"`. 
> STOP after committing. Do not attempt to push.

### Phase 2: Human Execution (Native Mac Terminal)
The Human Operator executes the push bypassing the headless IDE restrictions and the Mac Keychain entirely:
1. Generate or retrieve your active GitHub PAT (Must have `repo` scope).
2. Open the native Mac Terminal (`Cmd + Space` -> `Terminal`).
3. Navigate to the active workspace:
   `cd /Users/dharris/Documents/0Church/Blackstone_Ward/Youth/[Active-Workspace-Folder]/`
4. Execute the "Direct Token Bypass" push command:
   `git push https://tueini:[PASTE_PAT_HERE]@github.com/tueini/Blackstone-Youth-Hub.git [branch-name]`
   *(Note: This method is highly secure as it holds the token in RAM for the transaction but does not write it to the local `.git/config` file).*

### Phase 3: The Cloud Merge (GitHub.com)
1. Log in to GitHub.com.
2. Navigate to the repository and open a **Pull Request** to merge the newly pushed branch (e.g., `beta-admin`) into `main`.
3. Review the code diff visually, then click **Merge pull request**.
