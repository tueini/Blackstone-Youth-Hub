# Operational Rules & Standing Instructions

These standing rules are derived directly from `AG_Best_Practices.md` and govern all agent operations in this repository.

## 1. Strict File Fence (Scope Lock)
- **Scope Lock**: The agent is expressly forbidden from altering any file, line of code, or logic block that is not explicitly named in the Mission Objective or directly required to resolve the immediate task.
- **No Unprompted Refactoring**: Never "clean up," refactor, or modernize code that falls outside the exact scope of the mission. Existing variables, comments, and adjacent logic must be preserved exactly as they are found.
- **Native Editing Only**: Changes must be made using native IDE file-editing tools. Using terminal commands like `sed`, `awk`, or `echo` to modify files is strictly forbidden.

## 2. Autonomous Versioning & Documentation
- **Version Management**: The agent manages decimal version increments (Patch, Minor, Major) based on the human operator's defined level of update.
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

## 5. Shared Database Warning (Firestore Bleed Risk)
- **Shared Instance**: The Beta and Production environments share the exact same Firestore instance (`blackstoneward-b861c`).
- **No Destructive Testing**: Never run broad "Delete All" scripts in Beta, as they will wipe live production data.
- **Security Rule Bleed**: Any `firestore.rules` deployed from Beta instantly apply to the live Production site. Proceed with extreme caution.
