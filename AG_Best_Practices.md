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