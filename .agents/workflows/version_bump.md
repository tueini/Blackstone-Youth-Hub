---
description: How to correctly execute a DB Version Bump & Deployment
---

# Deploy and Version Database Seed Workflow

Whenever you are tasked with deploying updates that require an application version bump, do NOT simply modify `set_version.html` and run `firebase deploy`. Because the version footer dynamically reads from the active Firestore database, you MUST execute the client-side seed logic to officially sync the database to your static HTML edits.

Follow these strict execution stages:

1. **Modify Assets:** Update `set_version.html` inside the codebase to map the exact new string instance (e.g., `"7.1.12"`).
2. **Execute Deployment:** 
// turbo
3. Push changes cleanly: `firebase deploy --only hosting` (make sure you Zip backup first if prompted).
4. **Trigger Database Seeding:** Once deployment safely finishes, spawn the `browser_subagent` explicitly targeting the freshly deployed live URL:
   `https://blackstoneward-b861c.web.app/set_version.html`
5. **Verify Subagent Output:** The subagent will successfully load the DOM and trigger the nested `seed()` sequence autonomously communicating with Firestore. Wait for the Subagent to confirm "7.x.x Seeded!" appeared on the screen, then terminate!
6. **Finalize:** Inform the user the database correctly mirrors the codebase.
