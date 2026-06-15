# Project State & Documentation

**Environment**: Beta Testing Environment (Staging)
**Version**: v7.12.77
**Active Branch**: `beta-admin`
**Hosting Target**: `test-blackstoneward` (Staging Environment)
**DevOps**: The beta environment is now securely tracked and isolated on the beta-admin branch of the GitHub repository.

- **Environment & Database Safety Protocols**: Updated `AG_Best_Practices.md` to explicitly define strict "Beta-First" operational rules and document the shared database bleed risk between the Beta and Production Firestore instances, forbidding destructive testing and careless security rule pushes.

- **Full Site Real-Time Synchronization Refactor**: Upgraded the data fetching scripts powering all secondary organization pages (Priests, YW, Teachers, Deacons, Primary, Combined) by replacing static `getDocs` calls with real-time `onSnapshot` listeners. Grid views for events, lessons, and birthdays now synchronize instantly with the database, ensuring seamless live updates for end-users whenever content is modified in the Admin Portal.

- **Real-Time Combined Events Synchronization**: Upgraded the homepage "Combined" activities fetching logic in `index.html` from a static `getDocs` call to a real-time `onSnapshot` listener. This resolves a critical data desync issue where edits made in the Admin Portal failed to reflect on the live public website without a manual hard refresh, while preserving the dynamic query limits for UI balancing.

- **Settings RBAC Content Leak & Default Routing**: Resolved a data visibility leak in the Settings module where Tier 2 users could see the Announcements container despite missing the navigation button. Injected a programmatic `navSpot.click()` in `setupRBAC` to explicitly route non-Admins to the Spotlights tab, simultaneously enforcing default routing and correctly hiding the Announcements container.

- **Missing updateDoc Firebase Import**: Fixed a critical `ReferenceError: updateDoc is not defined` bug during Spotlight reordering by explicitly importing `updateDoc` from the Firebase Firestore SDK in `admin-app.js`.

- **Spotlights Manual Reordering & Top-Default Restoration**: Restored missing functionality in the Spotlights module by calculating and applying a top-default `sortOrder` for newly added entries. Injected UI reordering arrows (↑/↓) that enable immediate local array swapping and dual-document Firestore updates (`updateDoc`) to permanently lock in the manually adjusted sorting.

- **Master Admin Teacher CSV Pipeline**: Expanded the CSV Import/Export tools to the Teachers module in the Admin Portal. Added `generateSymmetricCSV` and `processCSV` logic to support `teachers`, mapped strictly to `Name` and `Organization`. Added strict Tier 3 RBAC (Master Admin only) enforcement via `setupRBAC` to completely hide the CSV tools from standard Organization Leaders.

- **Teacher Debounce & Uniqueness Check**: Implemented UI debouncing and database uniqueness validation inside `window.saveEditedTeacher` to permanently prevent duplicate records. The save button is disabled immediately on click to prevent multi-click network blasting, and a `getDocs` uniqueness check ensures no duplicate `name` and `org` combinations are written for new entries.

- **Young Women Data Mapping Fix**: Resolved a critical load/save failure for the Young Women organization in the Admin Portal. Injected a `dbOrg` mapping variable in `admin-app.js` that correctly translates the UI string ('Young Women') into the expected database collection prefix ('YW') during Firestore reads and batched writes.

- **Teacher Dropdown UI Polish**: Removed the "Combined" option from the Teacher Organization dropdown in the inline editing UI. "Combined" is an event scope, and ensuring teachers are strictly mapped to proper organizations (or "General") prevents data pollution.

- **Teachers UI Standardization & Render Fix**: Resolved a critical rendering failure in the Teachers module where `localeCompare` crashed on undefined names. Synced `fullOrgTeachers` state back to the `window` object in the Firebase `onSnapshot` listener to unblock the rendering pipeline, and explicitly appended a `renderTeacherList()` UI refresh call at the end of the `saveEditedTeacher` execution to prevent silent save states. Rebuilt the `#teachers-section` HTML structure to match the Leaders module, successfully injecting the missing responsive `overflow-x-auto` wrapper and explicit Grid-based data columns (Teacher Name, Organization, Actions).
- **Teacher Rendering & Strict Mode Fix**: Diagnosed and resolved a fatal `ReferenceError` preventing the `+ Add Teacher` button from updating the UI. The issue occurred because ES Module strict mode blocked `renderTeacherList()` from implicitly accessing the `fullOrgTeachers` variable without a `window.` declaration. Injected `const orgTeachers = window.fullOrgTeachers;` to fix the reference crash. Simultaneously corrected the `<select>` dropdown options in the edit pane to explicitly match the new unified organizational structures (Combined, Priests, Teachers, Deacons, Young Women, Primary, General) and updated the read-only logic check for `General`.
- **Leader CRUD Initialization Fix**: Repaired the `+ Add Leader` button in the Settings & Privacy tab which was completely unresponsive due to an event propagation/default submission clash. Injected `e.preventDefault()` and `e.stopPropagation()` into the listener, and replaced the hardcoded `org: 'Priests'` default with a dynamic `window.ORGANIZATION_NAME` assignment to ensure clean data generation across all ward organizations.
- **Teacher CRUD Parity**: Fully deprecated the legacy "Add/Edit Teacher" popup modal in favor of the standard inline responsive flex-card editing experience. Additionally patched the `+ Add Teacher` button to resolve an event propagation conflict by injecting `e.preventDefault()` and `e.stopPropagation()`. The button now injects a `temp_` row immediately into the list for fluid, in-place data entry, utilizing `addDoc` correctly upon save to eliminate database collisions.
- **Admin Announcements & Leaders Hotfix**: Corrected a bug where Announcements were overly filtered by organization rather than serving as global broadcasts, and wrapped the edit controls in a strict Master Admin RBAC check. Expanded the Spotlights module to utilize the standardized responsive flex-cards with complete inline editing inputs (removing outdated `prompt()` dialogs). Upgraded the parent `#teachers-section` and `#leaders-section` UI wrappers to feature unified flexbox headers and text gradients. Finally, updated `firestore.rules` to explicitly grant read/write access to the `home_leaders` collection (`{document=**}`), permanently resolving the "Missing or insufficient permissions" error during leader creation.
- **Admin CRUD Parity & Bug Fixes**: Resolved persistent "Loading..." hangs for Announcements and Spotlights by correcting misaligned DOM IDs (`announcements-data`) and ensuring missing Firebase Firestore exports (`orderBy`, `addDoc`) were explicitly imported. Upgraded both the Teachers and Leaders modules to achieve full CRUD UI parity with the Activities tab, replacing rigid tables with responsive flex-cards featuring inline `<input>` editing, hover-state action columns, and keyboard support (Enter to save, Escape to cancel).
- **Tabbed Settings Refactor & Dynamic Privacy Gate**: Overhauled the Settings & Privacy UI from a dual-pane sidebar to a horizontal tabbed interface. Standardized the CRUD operations for both Announcements and Spotlights, implementing uniform responsive Flexbox Cards mirroring the Activities module. Eliminated the legacy manual "Privacy Gate Configuration" and the "Danger Zone" entirely. Engineered a dynamic synchronization hook (`syncPrivacyGate`) that automatically extracts leader last names from the new Leaders database table upon any CRUD operation, actively managing the `site_settings/privacy_config` without manual intervention.
- **Settings & Privacy Dual-Pane Architecture**: Refactored the `#system-settings-container` into a responsive dual-pane layout, isolating navigation controls on the left and dynamic content modules on the right. Integrated existing Announcements, Spotlights, and Teachers tools as togglable `.settings-module` panes.
- **Leaders UI Skeleton & Settings RBAC**: Built the structural frontend foundation for a new "Leaders" management module, complete with a data table for tracking names, organizations, and callings. Enforced Tier 2 (Org Leader) vs Tier 3 (Admin) Role-Based Access Control logic on the Settings navigation, allowing Tier 2 to manage Spotlights and Teachers while restricting access to Announcements and Leaders.
- **Strict CSV Mapping & Privacy Standardization**: Refactored the CSV import and export logic (`processCSV` and `generateSymmetricCSV`) in the Admin Portal to strictly enforce privacy-first mappings. Birthdays are now explicitly exported and imported using isolated `Month` and `Day` columns, entirely dropping the legacy date string parsing. Data extraction points across all modules (Activities, Lessons, Birthdays) are now strictly trimmed to prevent whitespace drift, and CSV headers were explicitly hardcoded for structural consistency.
- **PDF Export Standardization & JS Bleed Fix**: Extracted the duplicate PDF generation logic from the inline scripts of all secondary organization pages (Priests, Teachers, Deacons, YW, Primary, Combined) into a new, cleanly imported module (`public/js/print-handler.js`). Corrected improperly formatted multiline strings in the mobile print handler that contained unescaped `</script>` tags, successfully eliminating the critical "JavaScript bleed" bug where raw code was rendering directly onto the HTML pages.
- **Feedback Modal Logic & Syntax Stabilization**: Removed an accidental duplicate inclusion of `cfm-config.js` in `public/index.html` that was causing a fatal `SyntaxError: Identifier 'CFM_LOOKUP' has already been declared` and halting parsing. Consolidated the "Suggestions & Help" modal trigger logic exclusively within the inline `index.html` module script (eliminating the redundant `DOMContentLoaded` listener from `cfm-config.js`). Additionally, explicitly toggled `.hidden` and `.flex` CSS utility classes directly during the JavaScript `openFeedback()` execution to prevent Tailwind parsing conflicts.
- **Dual-UX Responsive Architecture**: Implemented a responsive slide-out drawer sidebar for mobile devices (`md:hidden` hamburger toggle) while retaining the static left-pane on desktop. Converted the rigid Activities table (`#data-editor-list`) into a dynamic CSS Flexbox card layout that stacks vertically on mobile devices and aligns horizontally on larger screens.
- **Privacy-First Birthday Refactor**: Removed year data from the Birthdays management UI to enhance privacy. Replaced the native date input with dynamic Month and Day dropdowns (`.b-month-select` and `.b-day-select`). Updated saving and parsing logic to seamlessly parse legacy `YYYY-MM-DD` entries and export a clean `MMM DD` format. Additionally, refactored the frontend banner logic in `inject_bdays.js` and `birthday-protocol.js` to strictly match on Month and Day components, entirely ignoring the year.
- **Birthday Native Date Implementation**: Fixed missing calendar UI on the Birthdays tab by migrating the input from a hardcoded `type="text"` to a native `type="date"` field. The date picker now displays the browser's native dark-themed icon correctly and inherits the standardized `w-[140px]` class for consistent alignment across all dashboard modules.
- **Date Input Standardization & Theming**: Standardized date and layout constraints across `renderDataManager()`, `renderLessonManager()`, and `renderBirthdayManager()` by enforcing a universal `w-[140px] shrink-0` class for consistent spacing. Injected the Tailwind `[color-scheme:dark]` modifier into all input strings to force the browser to render the native calendar popup icons in a light color scheme, contrasting flawlessly with the dark dashboard aesthetic.
- **Admin UI/UX Refinements**: Fixed organization switcher persistence to explicitly show a "Loading Data..." state on `#lesson-schedule-data` and `#admin-birthdays-list` while fetching new organization arrays. Restored native HTML5 `<input type="date">` functionality by removing custom calendar emojis, and implemented smooth scrolling to newly spawned inputs within the Birthdays manager.
- **Authorization Variable Sync**: Replaced legacy `isAdminMode` security checks with the active `window.currentUserRole` state for the "Save Changes to Database" (.sync-firebase-btn) and "Danger Zone" (#wipeBtn) buttons in `admin-app.js`, completely resolving the silent failure block while enforcing correct RBAC tiers.
- **Admin Memory Leak & Sync Alignment**: Resolved a JavaScript memory leak by ensuring the `birthdays` array clears consistently upon organization switching in `admin-app.js`. Replicated the "Save Changes to Database" function universally across Activities, Lessons, and Birthdays tabs using shared query selectors, standardizing database commits.
- **Combined Tab Lockdown & UI Cleanup**: Enforced conditional tab visibility for the "Combined" organization, restricting it securely to the Activities view while hiding redundant tabs. Cleaned up outdated HTML sub-headers from Admin Manager sections and injected contextual calendar emoji identifiers directly into all date-based input modules.
- **Lesson UI HTML Injection**: Restored the missing `#lessons-section` UI directly below the `#teachers-section` within the `#lessons-manager` container in `public/admin/index.html` and properly closed the container to prevent DOM collapse.
- **HTML Structural Balancing**: Repaired a critical HTML nesting bug in `public/admin/index.html` where the `#lessons-manager` container was physically trapped inside the `#activities-section`. Inserted the proper closing `</div>` immediately before the lessons manager, and removed the orphaned closing tag directly before `#birthdays-section` to perfectly balance the DOM tree and ensure tabs render as true siblings.
- **Master UI Unhide (Visibility Fix)**: Removed hardcoded `.hidden` classes from the `#dashboard-tabs` and `#admin-dashboard` root containers in `public/admin/index.html`. These parent wrappers were structurally blocking the entire UI from rendering even after successful authentication and data injection. Additionally verified the tab-switching logic in `admin-app.js` correctly maintains visibility of these containers when switching between organizations, ensuring the dashboard properly displays.
- **Hard HTML Overwrite & JS Lockdown**: Executed a hard HTML replacement of the `#lessons-manager` tab to entirely rebuild the UI structure with dedicated `div`-based containers (`#teacher-roster-data` and `#lesson-schedule-data`). The previous table-based layout (`<tbody>`) was completely replaced with modern Tailwind flex/grid components, fixing the blank UI issue. Updated button IDs to `addTeacherBtn` and `addLessonBtn` and locked down the JavaScript logic in `admin-app.js` and `admin-data.js` to strictly target the new inner data elements, permanently preventing the parent UI components from being overwritten or stripped out by browser rendering engines.
- **Stacked UI Component Integrity Verification**: Verified that `#teachers-section` and `#lessons-section` Stacked UI elements (including their `+ Add` buttons and data wrappers) are solidly injected within the `#lessons-manager` HTML tree. Adjusted the `admin-app.js` data-binding empty state injection to perfectly format the `<p>No teachers found.</p>` fallback message directly into `#teacher-roster-data`, ensuring total UI control separation.

## Application Version
**7.12.60** (May 2026 DB Sync Pending)

## Recent Significant Actions
- **Pipeline Halt Resolution & HTML Structure Repair**: Discovered that an unprotected `.replace()` on potentially undefined properties (`item.details`) in the *Activities* module was silently throwing a TypeError, halting the global `refreshUI()` pipeline and completely preventing the *Lessons* and *Birthdays* rendering functions from ever executing (explaining the blank screens). Applied strict `String()` wrappers across the `renderDataManager` template to resolve. Additionally, repaired misaligned `</div>` closures in `index.html` that had inadvertently orphaned the Lessons and Birthdays tab containers outside the `#admin-dashboard` layout flow.
- **Data Rendering TypeError Fix**: Addressed a critical bug causing the Lessons and Birthdays tabs to render blank. Applied safety fallbacks (`(item.property || '')`) to string `.replace()` methods within the HTML template generation loops in `admin-app.js` to gracefully handle undefined object values without throwing an uncaught TypeError.
- **Legacy Script Decoupling**: Safely decoupled the legacy `admin-data.js` script from the Admin Portal by deleting its `<script>` inclusion in `index.html` and removing its initialization call (`window.initAdminDashboard`) from `authAdmin()`. This eradicated a critical data clobbering collision where the legacy script was wiping out `#lesson-schedule-data` and `#admin-birthdays-list` via `.innerHTML` shortly after `admin-app.js` rendered them.
- **Activity UI Restoration & Filter Fix**: Rebuilt the missing `data-editor-list` HTML table structure within the Activities tab. Hardened the "See Past" filtering algorithms in `admin-app.js` to rely on strict local timezone parsing (`new Date()`) instead of UTC ISO strings to prevent date boundary clipping.
- **Admin Tab Standardization**: Implemented universal UI parity across the Activities, Lessons, and Birthdays tabs. All three managers now feature visually identical Gradient Header typographies and perfectly unified row-level styling (dark mode hover states, padding, borders, and flex layouts).
- **Universal CSV Operations**: Injected dedicated Upload/Download CSV control blocks into the Lessons and Birthdays sections. Re-engineered `processCSV()` and `generateSymmetricCSV()` to be fully context-aware based on the user's active tab, enabling distinct spreadsheet import/exports for scheduled events, curriculum topics, and member milestones.
- **Data Clobbering Resolution**: Nullified redundant rendering routines in `admin-data.js` to ensure `admin-app.js` securely manages all Admin Live Editor scopes without HTML DOM collisions.

- **DOM Parsing & Race Condition Fix**: Wrapped the `.dash-tab` event listener initialization block inside `admin-app.js` with a `document.addEventListener('DOMContentLoaded', ...)` closure. This prevents execution timing failures by guaranteeing the HTML structure is entirely parsed and rendered by the browser before the JS attempts to query and bind the navigation buttons. Additionally, confirmed the `admin-app.js` module script tag remains physically situated at the absolute bottom of the `<body>` in `index.html`.
- **Tab Navigation Listener Restoration**: Successfully reconnected the `.dash-tab` click event listeners by injecting them directly into `admin-app.js`. This guarantees that the tab switching logic is safely initialized as part of the JavaScript bundle cycle rather than relying on inline HTML scripting. The internal listener logic now correctly utilizes `e.currentTarget` to handle padding clicks and executes explicit `classList` toggling to unhide specific `#targetId` DOM containers like `#lessons-manager`.
- **DOM Parsing Fix for Dashboard Tabs**: Repaired the `.dash-tab` click event listeners in `public/admin/index.html`. The previous refactor incorrectly placed the synchronous query selector logic inside the `<head>` tag, which failed because the `<body>` elements had not yet been parsed. Relocated the initialization script block to the very bottom of the `<body>`, guaranteeing the DOM elements are fully constructed before binding click handlers and ensuring the RBAC engine programmatic clicks from `admin-app.js` trigger successfully. This restored full functionality to the "Lessons & Teachers" tab.
- **Admin Tab Switching Race Condition Fix**: Diagnosed and resolved a critical race condition where programmatic tab-clicking by the RBAC engine (`admin-app.js`) fired before the visual `.dash-tab` listeners were registered to the DOM via `DOMContentLoaded`. Restructured the primary tab-switching logic in `index.html` to execute synchronously immediately upon HTML parsing. Additionally, hardened the event listener to utilize `e.currentTarget` rather than `e.target`, ensuring deep clicks on button padding reliably execute the unhide logic for `#lessons-manager`.
- **Visibility & Rendering Hotfix**: Diagnosed and resolved the core issue causing the "Lessons & Teachers" tab to remain hidden for Tier 2 Admins. Updated the `setupRBAC` engine pointer in `admin-app.js` to correctly target `[data-target="lessons-manager"]` (instead of the deprecated `-section`), ensuring the tab safely unhides itself on authentication. Additionally, verified that the `renderTeacherList()` function gracefully injects a purely cosmetic "No teachers tracked yet" message without ever mutating the `.hidden` classes of the structural `#teachers-section` wrapper, permanently protecting the "+ Add Teacher" invocation button.
- **Teacher UI Invocation Audit**: Conducted a final physical audit of the `+ Add Teacher` button. Confirmed it is prominently injected at the top of `#teachers-section` within the "Lessons & Teachers" tab (rather than globally in the Live Editor). Verified that no rogue Tailwind classes or RBAC logic hide this button from Tier 2 administrators. The modal successfully triggers and inherently scales its input fields based on the active user role.
- **Data Binding & RBAC Enforcement**: Validated the complete connection between the Firestore data streams (`home_teachers` and organizational lessons) and the new Stacked UI containers. Successfully enforced Tier 2 vs Tier 3 RBAC constraints across both rendering logic and save payloads.
- **Stacked UI Layout Engine**: Refactored the "Lessons & Teachers" tab into a vertically stacked interface (`#lessons-manager`). Created a dedicated `#teachers-section` at the top (featuring the Teacher Roster and the "+ Add Teacher" invocation) and nested the `#lessons-section` below it. Implemented smooth-scrolling local anchor links (`⬇ Skip to Lesson Schedule` and `⬆ Back to Teacher Roster`) for rapid vertical navigation.

## GitHub Tracking Status
- **Repository**: [tueini/Blackstone-Youth-Hub](https://github.com/tueini/Blackstone-Youth-Hub)
- **Status**: The project has been successfully initialized as a Git repository. Version **v7.12.24** is currently live on Firebase and securely tracked on the `beta-admin` branch.
- **Sanitization**: All legacy `.zip` archives, the `zzarch/` and `zzimport/` directories, and obsolete files like `set_version.html` were successfully deleted.
- **Security**: Firebase secrets (e.g., `.firebaserc`, `zzGoogle/`) and `node_modules` are safely ignored in `.gitignore`.

## SMTP & Email Settings
- **Provider**: SendGrid (`@sendgrid/mail`)
- **Sender**: `"Blackstone Ward Hub" <hub@blackstoneward.org>`
- **Recipient**: `duanepharris@gmail.com`
- **Authentication**: Uses Firebase Secrets (`SENDGRID_API_KEY`) within Cloud Functions.
- **Status**: **LIVE & VERIFIED** in Beta Environment.
- **Trigger**: An `onDocumentCreated` listener on the `site_feedback/{docId}` Firestore collection invokes the `sendFeedbackEmail` function, routing structured feedback messages directly over SMTP.

## Base64 Image Logic Status
- **Spotlight Image Processing**: Image uploads are handled by intercepting `<input type="file">` elements, drawing them to a transient HTML `<canvas>`, and proportionally scaling them down to a maximum width of 800px (at 0.7 JPEG quality). 
- **Firestore Direct Injection**: The canvas output is exported as a Base64 stream and injected directly into standard Firestore document arrays. The scaling constraint guarantees that large source images (like 24MB iPhone photos) do not exceed Firebase's strict 1MB document size limit.
- **DOM Stability Abstraction**: Extremely long Base64 string representations previously caused browser engine crashes when bound as native inline HTML attributes (`onclick="..."`). The architecture has been refactored to parse execution dynamically by assigning explicit array index targets onto `.edit-spot-btn` nodes. This guarantees `window.editSpot()` executes safely regardless of image payload length without bogging down the DOM.
- **Authentication Note (Purged)**: All legacy Base64 validation logic that was previously used for password validation or privacy gates was completely purged in v7.2.1 and replaced with native SubtleCrypto SHA-256 digests. Base64 is now strictly reserved for media storage.

## Full File Inventory

```text
.DS_Store
.agents/workflows/version_bump.md
.firebaserc
.gitignore
Admin/.DS_Store
Admin/Credentials_Deacons.docx
Admin/Credentials_Priests.docx
Admin/Credentials_Primary.docx
Admin/Credentials_Teachers.docx
Admin/Credentials_YW.docx
Blackstone Ward Youth Hub Tech Doc.docx
CHANGELOG.md
PROJECT_STATE.md
Youth_Hub_Backup/BACKUP_LOG.md
Youth_Hub_Backup/Blackstone_Hub_V7.11.0_Snapshot.zip
cors.json
firebase.json
firestore.rules
functions/index.js
functions/package-lock.json
functions/package.json
index.html
master.json
public/.DS_Store
public/.agents/rules/blackstoneward.code-workspace
public/.agents/rules/blackstoneward.md
public/404.html
public/Combined/404.html
public/Combined/index.html
public/Deacons/.DS_Store
public/Deacons/404.html
public/Deacons/index.html
public/Priests/.DS_Store
public/Priests/404.html
public/Priests/index.html
public/Primary/.DS_Store
public/Primary/404.html
public/Primary/index.html
public/Teachers/.DS_Store
public/Teachers/404.html
public/Teachers/index.html
public/YW/.DS_Store
public/YW/404.html
public/YW/index.html
public/cfm-config.js
public/images/.DS_Store
public/images/BlackstoneYouthHubLogo.png
public/images/spotlight.jpeg
public/images/spotlightv1.jpeg
public/images/spotlightv2.jpeg
public/index.html
public/inject_bdays.js
public/js/birthday-protocol.js
public/js/config.js
public/security-config.js
public/server.log
update_subpages.js
```
