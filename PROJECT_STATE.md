# Project State & Documentation

**Environment**: Beta Testing Environment (Staging)
**Version**: v7.17.0
**Active Branch**: `beta-admin`
**Hosting Target**: `test-blackstoneward` (Staging Environment), `youth-blackstoneward` (Production: `youth.blackstoneward.org`)
**DevOps**: The beta environment is tracked on the `beta-admin` branch. Hosting targets are mapped in `.firebaserc` (`staging` -> `test-blackstoneward`, `youth` -> `youth-blackstoneward`).

- **Youth Hub Spotlight Metadata Date & Two-Pane Detail Modal (v7.17.0)**:
  - Added formatted spotlight date display at the bottom of each card in the Youth Spotlight grid (`public/index.html`). Dates are cleanly pinned to the bottom border using flex auto-margins, supporting ISO dates (`YYYY-MM-DD`) and text formats.
  - Made every spotlight card interactive and clickable with hover elevations and focus accessibility (`tabindex="0"`, `role="button"`, `Enter`/`Space` key support).
  - Built a responsive two-pane detail lightbox modal (`#spotlightDetailModal`) spawned upon clicking any spotlight card:
    - **Large Left Pane**: High-contrast dark viewer showcasing a large, crisp version of the spotlight image (or embedded video).
    - **Right Metadata Pane**: Editorial card displaying **Group** (styled badge), **Date** (calendar icon + formatted date), and **Description** (full readable text, scrollable for long stories).
    - Included optional video action button if media contains an associated video URL.
    - Wired backdrop click and `Escape` key listeners for smooth dismissibility.
  - Added `.spotlight-card` and `.line-clamp-3` styling in `public/assets/youth-hub.css`.
  - Bumped application version to `v7.17.0` across `cfm-config.js`, all templates, stylesheets, and footers.

- **Official Moroni Logo Asset Update & Global Cache Sync**:
  - Deployed updated `public/assets/ward-logo-moroni.png` provided by the user.
  - Synchronized cache-busting query strings (`?v=7.16.1`) across all logo instances (`public/index.html`, `public/admin/index.html`, `public/Combined/index.html`, `public/Priests/index.html`, `public/Teachers/index.html`, `public/Deacons/index.html`, `public/YW/index.html`, `public/Primary/index.html`).
  - Bumped application version to `v7.16.1` across `cfm-config.js`, all templates, stylesheets, and footers.

- **Admin Portal Seasonal Parallax & Warm Cream Editorial Redesign**:
  - Overhauled the Admin Portal (`public/admin/index.html`) to align with the Warm Cream Editorial design system established across the Youth Hub and secondary organization pages.
  - Implemented the panoramic seasonal parallax hero banner (`.admin-hero-banner.parallax`) at the top of the dashboard, displaying the active season's scenic landscape with dynamic gradient wash, quick navigation links ("View Youth Hub ↗", "Log Out"), and clean organization titles.
  - Upgraded the Login Screen (`#login-view`) into a scenic parallax gate with blurred frosted glass card (`.admin-login-card`), official Moroni branding (`ward-logo-moroni.png`), and high-contrast inputs.
  - Re-themed all management cards (Activities, Lessons, Birthdays, Announcements, Spotlights, Teacher Roster, Leaders Management, and Youth Theme & Scripture) with clean white cards (`#ffffff`), warm borders (`var(--border)`), and readable high-contrast form controls.
  - Integrated the unified Blackstone Ward Moroni footer (`.org-footer`) featuring the panoramic pine tree silhouette background and dynamic version indicator.
  - Built dedicated `public/assets/admin.css` to cleanly encapsulate styles, parallax animation engine, and responsive breakpoints without touching existing database/RBAC logic.
  - Synchronized global version `v7.16.0` and cache-busting query strings across all assets and templates.

- **Youth Home Page Combined Card Harmonization**:
  - Removed `.card-combined` highlighting from the Combined group card in `public/index.html` and removed specific `.card-combined` background overrides in `public/assets/youth-hub.css`.
  - The Combined card now displays the clean white card background (`#ffffff`) and standard border identical to all other unselected group cards (Priests, Teachers, Deacons, Young Women, Primary).
  - Synchronized global version `v7.15.3` and cache-busting query strings across all assets and footers.

- **Youth Home Page Top Menu Refinement**:
  - Removed the redundant "Announcements" link from the top navigation bar in `public/index.html`.
  - Added an "Admin" link positioned cleanly between "Spotlights" and "Get help", navigating directly to the Admin Portal (`/admin/index.html`).
  - Synchronized global version `v7.15.2` and cache-busting query strings across all assets and footers.

- **Youth Home Page Footer Harmonization**:
  - Replaced the legacy text-and-link footer on the Youth Home page (`public/index.html`) with the identical `.org-footer` used on the secondary organization pages.
  - Features the transparent pine tree and mountain silhouette background (`footer-tree-silhouette.png`), flanking horizontal divider lines, centered Blackstone Ward Moroni logo (`ward-logo-moroni.png`) with link to `blackstoneward.org`, and dynamic italicized version tag.
  - Added `.org-footer` responsive styles and set `html { background-color: var(--cream); }` in `public/assets/youth-hub.css` for a completely flush bottom baseline without white margins or gaps.
  - Synchronized application version `v7.15.1` and cache-busting query strings across all assets and templates.

- **Full Organization Pages Migration (Priests, Teachers, Deacons, Young Women, Primary)**:
  - Migrated all five secondary organization pages (`public/Priests/index.html`, `public/Teachers/index.html`, `public/Deacons/index.html`, `public/YW/index.html`, `public/Primary/index.html`) from the legacy dark UI to the approved seasonal editorial design established in the Combined pilot.
  - Implemented the user-specified group subtitle pattern: `"Activities, service, and time together for " & [Group Name] & "."` across all non-Combined pages (`Activities, service, and time together for Priests.`, `Activities, service, and time together for Teachers.`, `Activities, service, and time together for Deacons.`, `Activities, service, and time together for Young Women.`, `Activities, service, and time together for Primary.`).
  - Active group switcher tab pill highlighting correctly tied to current organization page with vector icons and accessible `aria-current="page"`.
  - Added dual Firestore real-time listeners on each quorum/class page listening to both quorum-specific events (e.g. `Priests_events`) and ward-wide `Combined_events` with category inheritance and deduplication.
  - Added `.combined` category pill styling to `public/assets/org-page.css` (`.legend-dot.combined`, `.row-date-badge.combined`) and integrated into calendar legends.
  - Wired organization-scoped feedback submissions to Firestore `site_feedback`.
  - Upgraded global application version to `v7.15.0` with synchronized client cache-busters.
- **Uniform Calendar Grid & 2-Line Text Wrapping**:
  - Standardized `.cal-days-grid` with fixed `grid-auto-rows: 94px` (84px on mobile) and `.cal-day-cell` with `height: 94px; overflow: hidden; box-sizing: border-box;`, ensuring every single day cell in the calendar is strictly uniform in size across all weeks.
  - Implemented 2-line event title wrapping (`.cal-pill-title`) utilizing `-webkit-line-clamp: 2` with graceful ellipsis truncation for long titles.
  - Aligned `.cal-event-pill` with `align-items: flex-start;` and bullet dot `margin-top: 3px;` so category dots stay aligned with line 1 of multi-line titles.
  - Synchronized cache-busters (`?v=7.14.4`) across stylesheet and scripts for immediate client refresh.
- **Group Switcher Tab Bar Vertical Centering**:
  - Balanced the spacing of `.group-tabs-container` by setting equal top and bottom margins (`margin-top: 24px; margin-bottom: 24px;`).
  - Vertically centered the group pill switcher buttons symmetrically between the bottom edge of the top landscape hero banner and the top edge of the Activity Calendar card, resolving the flush top alignment.
  - Added cache-busting query strings (`?v=7.14.3`) across stylesheet, images, and script tags for immediate client updates.
- **Footer Transparent Flush Silhouette & Official Moroni Logo**:
  - Re-rendered `footer-tree-silhouette.png` with a 100% transparent background, eliminating white bounding rectangles, white side borders, and visual contrast seams against the page container.
  - Set `html { background-color: var(--cream); }` and `.org-footer { background-color: transparent; background-size: 100% 100%; background-position: center bottom; }`, ensuring the footer sits completely flush with the bottom edge of the page with zero white gaps.
  - Replaced the extracted logo with the official high-resolution, transparent Blackstone Ward Youth Hub logo (`ward-logo-moroni.png`) provided by the user.
  - Added cache-busting query strings (`?v=7.14.2`) to `footer-tree-silhouette.png`, `ward-logo-moroni.png`, and `org-page.css` for immediate cache refresh.
- **Footer Panoramic Silhouette & Blackstone Ward Moroni Branding**:
  - Added panoramic pine tree and rolling hill silhouette artwork (`public/assets/footer-tree-silhouette.png`) across the bottom of the footer, blended seamlessly into the warm page container tone with top feathered transparency.
  - Implemented the centered Blackstone Ward Moroni statue logo (`public/assets/ward-logo-moroni.png`) with cyan-blue "YOUTH HUB" all-caps sub-label and back-link to `https://blackstoneward.org`.
  - Flanked the brand block with subtle horizontal divider lines spanning the width of the main content layout.
  - Formatted the footer version display strictly as `"Version " + [version #]` (e.g. `Version 7.14.1`) in italic blue typography matching the user mockup.
  - Upgraded `public/cfm-config.js` `window.renderGlobalFooter` to detect short-format version elements (`data-format="short"`) for dynamic client-side rendering.
- **Secondary Organization Pages Redesign (Pilot: Combined Group)**:
  - Rebuilt `/Combined/index.html` from the legacy dark theme to the seasonal editorial aesthetic matching the approved GUI mockup.
  - Linked the seasonal environment system (`seasons.css` and `org-page.css`) so background landscapes (`autumn-landscape.png`, `winter-landscape.png`, etc.) and warm color palettes automatically switch with the season.
  - Implemented the official Blackstone Ward logo with back-link to `https://blackstoneward.org` and blue "Youth Hub" subtitle.
  - Added clean breadcrumbs navigation (`Home / Activities / Combined`) and group subtitle (`Activities, service and time together for all youth.`).
  - Added the horizontal group switcher pill bar with official vector symbols (`assets/symbols/`).
  - Implemented the interactive 7-day Activity Calendar card with dynamic month navigation, day cells, today highlight, category pills, legend, and list view toggle.
  - Added the dynamic "UP NEXT" card, "Good to know" card, and full-width "Coming up" upcoming activities list.
  - Real-time synchronization powered by Firestore `onSnapshot` on `Combined_events`.
- **Blackstone Ward Home Logo & Blue Youth Hub Subtitle**:
  - Replaced the placeholder SVG emblem in the top-left header with the official Blackstone Ward horizontal logo (`ward-logo-horizontal-v1.0.6.png`) from the main homepage.
  - Scaled and responsive-fitted the logo for the Youth Hub header, with "Youth Hub" prominently displayed below it in brand blue (`#2165a2`).
  - Configured the top-left brand link to navigate back to `https://blackstoneward.org` seamlessly.
- **Parallax Engine Repair & Asset Resolution**:
  - Resolved 404 image load failures by placing landscape seasonal images in both `/public/` root and `/public/assets/`, and updating CSS variables in `seasons.css` and `youth-hub.css` to root-relative paths (`/assets/autumn-landscape.png`, etc.).
  - Added explicit `body[data-season="fall"]` selector in `seasons.css` matching the NY timezone seasonal calculator.
  - Upgraded `.welcome-scene` with `min-height: 560px` and enhanced `.parallax .scene-image` with `inset: -160px 0` to provide ample vertical buffer for continuous parallax translation.
  - Aligned `.parallax .scene-wash` gradient transparency with the Ward Homepage (`rgba(var(--page-rgb), 0) 84%`), revealing the scenic landscape clearly behind the right-hand hero cards.
  - Upgraded the JavaScript parallax engine to calculate fluid scroll-anchored offsets (`scrolled * speed`), eliminating early clamping and providing smooth, immediate parallax motion.
  - Removed restrictive `transform: none !important;` overrides from reduced-motion media query on the parallax background image.
  - Hid the header unlock button when the spotlight section is locked, preserving the prominent black "Unlock spotlights →" banner as the single clear call-to-action.
  - Dynamically displays the `🔒 Lock` button beside the "Youth Spotlight" header only after the spotlight section is successfully unlocked, allowing users to re-lock the section on demand.
- **Spotlight Video Autoplay Prevention on Unlock**:
  - Parameterized `parseVideoEmbedUrl(url, autoplay = false)` to default `autoplay` to `false` for embedded cards.
  - Stripped automatic `autoplay=1` parameter injection for Vimeo and YouTube embed links generated for spotlight cards.
  - Updated the spotlight card `<iframe>` permissions to omit `allow="autoplay"`, preventing browsers and video players from starting playback automatically upon unlocking the spotlight section.
  - Preserved explicit `autoplay=1` behavior and iframe permissions exclusively for the announcement video lightbox modal overlay.
- **Youth Spotlight Header, Lock/Unlock Toggle & Bulk Reduction**:
  - Added a dedicated "Youth Spotlight" section header above the spotlight cards.
  - Placed an interactive Lock/Unlock toggle button next to the header, enabling immediate locking (clearing session unlock) or triggering the leader access gate when locked.
  - Removed redundant "Youth" / "Spotlight" labels from each spotlight card to eliminate bulk, cleanly displaying only the media, title/name, and description.
- **Admin Portal Youth Theme & Scripture Manager**:
  - Added a dedicated "Theme" tab in the Admin Portal under **Settings & Privacy** (`#theme-section`).
  - Allows Master Admins to view and edit both the **Theme Title** and **Scripture Reference** with real-time saving to Firestore (`home_content/general_info`), automatically updating the Youth Hub homepage.
  - Enforced Tier 3 (Master Admin) RBAC visibility for the Theme tab.
- **Official SVG Symbols Integration**:
  - Replaced organization card icons with the official custom vector symbol suite located in `public/assets/symbols/`: `combined.svg`, `priests.svg`, `teachers.svg`, `deacons.svg`, `young-women.svg`, and `primary.svg`.
- **Seasonal Parallax Redesign & Editorial GUI Overhaul**:
  - Overhauled the Youth Hub frontend from the dark theme to the warm, editorial aesthetic of the Ward Home with Massachusetts seasonal palette switching and responsive parallax scrolling (`seasons.css`, `autumn-landscape.png`, `spring-landscape.png`, `summer-landscape.png`, `winter-landscape.png`).
  - Implemented the custom vector icon suite matching the GUI design: dual-loop gradient emblem, 3-person team (`Combined`), priest in suit (`Priests`), scriptures (`Teachers`), armor shield (`Deacons`), lotus blossom (`Young Women`), and radiant sun (`Primary`).
  - Added the floating **"UP NEXT"** hero card dynamically bound via real-time Firestore query to the next upcoming Combined youth event.
  - Linked the Hero theme title and scripture dynamically to Firestore `home_content/general_info`.
  - Upgraded the **"Coming up"** and **"Announcements"** cards with stacked date boxes (`OCT` / `14`), megaphone badges, and preserved on-site video player deep linking.
  - Redesigned the protected **Youth Spotlights** banner with circular lock badge and smooth leader access gate integration.

- **Youth Hub Subdomain Migration**: Successfully decoupled the Youth Hub from the apex domain `blackstoneward.org` to its dedicated custom subdomain `youth.blackstoneward.org` on Firebase Hosting multi-site target `youth-blackstoneward`. Updated `.firebaserc` and `firebase.json` hosting target definitions to `youth`. Main domain now serves the Ward Homepage with automated 301 redirects for legacy paths.

- **Deterministic Video ID & Document ID Deep-Linking**: Restored and hardened the video modal auto-open engine in `public/index.html` to support querying by exact Vimeo or YouTube Video ID (e.g. `?video=1236419866`) or Firestore Announcement document ID (`?video=<DOC_ID>`). When visitors navigate to a targeted video link, the script scans all active announcements, matching the unique ID token across the URL, embed link, and document ID to reliably launch the intended video player modal even when multiple announcements feature videos. Retains `?video=true`, `?watch=true`, and `#video` as shortcuts to auto-play the newest video.

- **Announcements Manual Reordering (Up/Down Arrows & Timestamp Sync)**: Added dedicated reordering tools to the Announcements Manager in the Admin Portal (Settings & Privacy -> Announcements). Announcement cards now feature interactive ↑ and ↓ arrows with dynamic disabled/opacity styling at the list boundaries. Reordering performs an instant local array swap for zero-latency UI feedback, followed by an atomic Firestore `writeBatch` update that synchronizes document timestamps (and automatically redistributes timestamps if records share identical creation times). Newly created announcements are dynamically assigned top-priority timestamps ensuring they seamlessly prepend above existing items.

- **Video Announcement Auto-Open Deep-Linking**: Implemented direct URL parameter and hash detection (`?video=true`, `?watch=true`, `#video`) in `public/index.html`. Visiting the home page via deep-link automatically triggers and opens the video modal overlay with the embedded player once announcements load, and cleanly resets the URL in browser history upon dismissal without triggering page reload.

- **Video Modal Header Banner Title Refinement**: Updated the video modal trigger in `public/index.html` to pass the announcement's specific URL label (`linkText`) instead of the general announcement body text, ensuring the modal's header banner cleanly displays the video title (e.g. "Dare Mighty Things").

- **Announcement Video Lightbox & Universal Video Embed Resolution (Option 3)**: Implemented a responsive dark-mode video lightbox modal (`#videoModal`) on the homepage to play YouTube and Vimeo videos on-site without navigating away or breaking grid layout balance. Engineered `parseVideoInfo(url)` to automatically detect and extract video IDs from any YouTube format (`watch?v=`, `youtu.be/`, `shorts/`, `embed/`) and Vimeo links, converting them into auto-playing embed URLs (`/embed/ID?autoplay=1`). Announcements containing video links now feature a stylized "▶ Watch Video" button triggering the on-site lightbox player. Also integrated the parser into the Youth Spotlights module to ensure YouTube links correctly generate video thumbnails and embed within the existing player window without encountering YouTube's `X-Frame-Options` iframe restriction.

- **initHub() Scope Repair**: Resolved a critical `ReferenceError` inside `public/index.html` by replacing an out-of-scope `annContainer` reference with a fresh DOM query, successfully preventing the rendering pipeline from aborting and restoring the Youth Spotlights and Next Combined Events functionality.

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
**7.12.83** (May 2026 DB Sync Pending)

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
- **Status**: The project has been successfully initialized as a Git repository. Version **v7.12.84** is currently live on Firebase and securely tracked on the `beta-admin` branch.
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
