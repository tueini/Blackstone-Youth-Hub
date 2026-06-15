# AntiGravity (AG) Agent Best Practices & Operational Protocol

This document serves as the core "System Prompt" and operational rulebook for all AntiGravity (AG) agent instances working within the Blackstone Youth Hub repository.

## 1. Core Philosophy: High-Trust Execution, Strict Scope Bounding
The AG agent is authorized to operate autonomously to achieve the stated feature or fix, provided it strictly adheres to the negative constraints defined in each mission.

## 2. The "Strict File Fence" (Negative Prompting)
* **Rule:** The agent is expressly forbidden from altering any file, line of code, or logic block that is not explicitly named in the Mission Objective or directly required to resolve the immediate issue.
* **No Unprompted Refactoring:** The agent must *never* "clean up," refactor, or modernize code that falls outside the exact scope of the mission. Existing variables, comments, and adjacent logic must be preserved exactly as they are found.

## 3. Autonomous Versioning & Documentation
* **Rule:** The agent is responsible for determining the appropriate version increment (Patch, Minor, Major) based on the scope of its work. The human operator will define the *level* of the update, but the agent manages the actual decimal increment.
* **Documentation:** Every successful mission *must* conclude with an update to `PROJECT_STATE.md` and `CHANGELOG.md` reflecting the new version number and detailing the specific changes made.

## 4. The "Code First, Deploy Second" Checkpoint (No Local Bot Verification)
* **Rule:** The agent must *not* attempt to launch local servers (`python3 -m http.server`, etc.) or utilize a headless Browser Subagent to verify its own work unless explicitly commanded to do so.
* **Workflow:**
    1. The agent writes the code locally.
    2. The agent stops and reports "Code Complete. Awaiting deployment approval."
    3. The human operator performs a visual check or local test.
    4. Upon receiving the "Approved" command from the human, the agent executes the deployment (e.g., `firebase deploy --only hosting:staging`).

## 5. Security & Credentials
* **Rule:** No passwords, hashes, or API keys are to be hardcoded into client-side JavaScript (`public/` directory). All sensitive logic must be deferred to Firebase Authentication, Cloud Functions, or Firestore Security Rules.

## 6. Terminal & Native Editing Protocol
* **Native Editing Only:** The agent must use its native IDE file-editing and rewriting tools to apply changes directly to the codebase. 
* **No Terminal Editors:** The agent is strictly forbidden from using terminal commands like `sed`, `awk`, or `echo` to modify files.
* **Terminal Autonomy:** The agent is pre-authorized to execute safe, read-only terminal commands (such as `grep`, `ls`, and `cat`) without asking for human confirmation, provided they fall strictly within the current Scope Lock and File Fence.

## 7. Prompting Template
All missions should follow this structure to ensure compliance:

**Mission Objective:** @Workspace [State the goal or the specific bug to fix].

**Execution Plan:**
1. [Step 1]
2. [Step 2]
3. Update versioning and documentation (`PROJECT_STATE.md`, `CHANGELOG.md`).

**CRITICAL CONSTRAINTS (Scope Lock):**
* **File Fence:** You may ONLY modify [List specific files].
* **No Refactoring:** Do not alter any code unrelated to this specific objective.
* **Native Editing:** Do not use `sed` or terminal commands to edit files.

**Execution Checkpoint:** Do not launch a local server or browser subagent. Once the code is written locally, STOP and wait for my review. I will reply "Approved" when I am ready for you to run `firebase deploy`.

## 8. Environment & Database Safety Protocols

* **Beta-First Execution:** ALL new features, bug fixes, and architectural changes MUST be executed in the `Website-beta/` workspace and deployed to `test.blackstoneward.org` first. Direct production edits are strictly forbidden.
* **Shared Database Warning (Bleed Risk):** The Beta and Production environments share the exact same Firestore instance (`blackstoneward-b861c`).
* **No Destructive Testing:** Never run broad "Delete All" scripts in Beta, as they will wipe live production data.
* **Security Rule Bleed:** Any `firestore.rules` deployed from Beta instantly apply to the live Production site. Proceed with extreme caution.

## 9. The "Air Gap" GitHub Push Protocol (DevOps SOP)

Due to GitHub deprecating standard password authentication for terminal operations, and to protect Personal Access Tokens (PAT) from being permanently stored in cloud-synced AI chat histories, all code pushes to GitHub must follow the "Air Gap" protocol. 

This protocol splits the labor: the AG Agent prepares the package, and the Human Operator pushes it using native terminal tools.

### Phase 1: Agent Preparation (IDE)
Feed the AG Agent a sanitized prompt to stage and commit the code locally. Do not include tokens in the prompt.
**Prompt Template:**
> `@Workspace` Stage and commit all recent changes to prepare for a GitHub push. 
> Execute `git add .` and `git commit -m "[Insert descriptive message here]"`. 
> STOP after committing. Do not attempt to push.

### Phase 2: Human Execution (Native Mac Terminal)
The Human Operator executes the push bypassing the headless IDE restrictions and the Mac Keychain entirely.
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