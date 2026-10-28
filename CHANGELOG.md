> **Note**: The current app version is v7.18.1 on beta-admin.
 
## [2026-10-25 13:20] - v7.18.1 Sunday Lessons Public Calendar Real-Time Synchronization
- **Priests Lessons Listener**: Added real-time Firestore listener `qOrgLessons` on `public/Priests/index.html` subscribing to the `Priests_lessons` collection.
- **Calendar Grid & Pill Integration**: Lessons render onto their scheduled Sunday day cells as spiritual category pills (`Lesson: [Topic]`) with purple bullet dot indicator and responsive 2-line title wrapping.
- **List View & Sidebar Meta**:
  - Rendered teacher attribution (`Teacher: [Teacher]`) and lesson notes in the monthly agenda list view.
  - Formatted category badge specifically as `● Lesson` on lesson rows.
  - Linked lessons into the "UP NEXT" hero card and "Coming Up" sidebar list with meeting time metadata.
- **Interactive Detail Modal**: Modal displays full lesson curriculum, teacher name, notes, and a direct Google Calendar template export link.
- **Global Version Sync**: Bumped application version to `v7.18.1` across `cfm-config.js`, all templates, stylesheets, and footers.

## [2026-10-23 14:55] - v7.18.0 Unified Firebase Auth, Centralized RBAC & Cross-Subdomain SSO Migration
- **Option A Implementation**: Transitioned Youth Hub Admin to the unified Firebase Authentication and Role-Based Access Control (RBAC) model shared with the Ward site (`BW_Home`).
- **Unified Firestore Leaders Schema**: Replaced client-side static passwords with real-time verification against the central `ward_leaders` collection in Firestore.
- **Cross-Subdomain SSO Bridge**: Logging into either `blackstoneward.org/admin` or `youth.blackstoneward.org/admin` sets a secure `.blackstoneward.org` cookie (`ward_auth_session`) and session profile, enabling seamless instant navigation across both admin dashboards without re-authenticating.
- **Multi-Factor Leader Authentication**:
  - **Phone SMS Verification**: Direct 6-digit SMS text code authentication via Firebase Auth and reCAPTCHA.
  - **Passkeys (TouchID / FaceID)**: Biometric WebAuthn sign-in support.
  - **Password Fallback**: Verified against master SHA-256 hashes and leader personal passwords in Firestore.
- **Dynamic RBAC & Organization Access**:
  - Ward Administrators and Bishopric members automatically unlock all six youth organizations (`Combined`, `Priests`, `Teachers`, `Deacons`, `Young Women`, `Primary`), system settings, spotlights, and announcements.
  - Class/quorum leaders are strictly routed to their assigned organization tools.
- **Leader Identity Badge**: Displays leader initials, full name, and official calling/role title directly in the Admin sidebar.
- **Clean Logout Flow**: Completely clears cookies, storage, and Firebase Auth sessions.
- **Global Version Sync**: Bumped application version to `v7.18.0` across `cfm-config.js`, all templates, stylesheets, and footers.
## [2026-10-21 10:00] - Admin Portal Sidebar Logo Update
- **Admin Sidebar Brand Consistency**: Replaced the horizontal logo in the Admin Portal sidebar (`public/admin/index.html`) with the official Blackstone Ward Moroni logo (`ward-logo-moroni.png?v=7.17.0`) matching the footer branding while preserving navigation link structure.

## [2026-10-20 09:55] - v7.17.0 Youth Hub Spotlight Date Metadata & Two-Pane Detail Modal
- **Spotlight Date on Cards**: Formatted and rendered the spotlight date at the bottom border of every card in the Youth Spotlight grid, utilizing responsive auto-margin pinning.
- **Interactive Clickable Cards**: Made each card interactive with cursor indicators, subtle elevation hover effects, and keyboard accessibility.
- **Two-Pane Detail Lightbox Modal**: Clicking any card spawns a two-pane modal (`#spotlightDetailModal`):
  - **Large Left Pane**: Displays a large-scale presentation of the spotlight image (or embedded video).
  - **Right Metadata Pane**: Displays the spotlight's **Group** pill badge, formatted **Date**, and full **Description** with scrolling typography, plus an optional video action button when a video is attached.
  - Full dismissibility with floating close button, modal backdrop click, and `Escape` key shortcut.
- **Global Version Sync**: Bumped application version to `v7.17.0` across `cfm-config.js`, all templates, stylesheets, and footers.

## [2026-10-20 09:30] - v7.16.1 Official Moroni Logo Asset Update & Cache Sync
- **Updated Moroni Logo Asset**: Updated `public/assets/ward-logo-moroni.png` provided by the operator.
- **Cache-Busting & Global Sync**: Incremented asset query strings (`?v=7.16.1`) on all `ward-logo-moroni.png` instances across the home page, admin portal, and all 6 secondary organization pages.
- **Global Version Sync**: Bumped application version to `v7.16.1` across `cfm-config.js`, all templates, stylesheets, and footers.

## [2026-10-19 17:25] - v7.16.0 Admin Portal Seasons & Parallax Editorial Redesign
- **Warm Cream Editorial & Parallax Design**: Overhauled `public/admin/index.html` to adopt the site-wide seasons-based warm cream editorial aesthetic.
- **Panoramic Parallax Hero Banner**: Added dynamic seasonal parallax hero banner (`.admin-hero-banner.parallax`) at the top of the dashboard with active seasonal landscape, gradient wash, quick navigation links ("View Youth Hub ↗", "Log Out"), and responsive typography.
- **Scenic Login Gate**: Redesigned `#login-view` with blurred frosted glass card, official Moroni emblem (`ward-logo-moroni.png`), and high-contrast form controls on top of the seasonal scenic backdrop.
- **Editorial Cards & Themed Form Controls**: Replaced dark slate panels with crisp white cards (`#ffffff`), subtle borders (`var(--border)`), warm hover effects, and accessible readable inputs across all management modules (Activities, Lessons, Birthdays, Announcements, Spotlights, Teacher Roster, Leaders Management, and Youth Theme & Scripture).
- **Unified Footer**: Integrated the transparent pine tree silhouette footer (`.org-footer`) with centered Moroni emblem and dynamic version indicator.
- **Dedicated Stylesheet**: Created `public/assets/admin.css` to cleanly encapsulate the design tokens, parallax engine, and responsive styles without modifying business logic.
- **Global Version Sync**: Bumped application version to `v7.16.0` across `cfm-config.js`, all templates, stylesheets, and footers.

## [2026-10-19 17:10] - v7.15.3 Youth Home Page Combined Card Style Harmonization
- **Combined Card White Background**: Removed `card-combined` highlighting from `public/index.html` and removed specific `.card-combined` background styling from `public/assets/youth-hub.css`. The Combined card now has the standard `#ffffff` white card background and border matching all other unselected groups.
- **Global Version Sync**: Bumped application version to `v7.15.3` across `cfm-config.js`, all templates, stylesheets, and footers.

## [2026-10-19 16:45] - v7.15.2 Youth Home Page Top Menu Refinement
- **Top Menu Update**: Removed the "Announcements" link from the top navigation bar on the Youth Home page (`public/index.html`).
- **Admin Portal Navigation**: Added an "Admin" link positioned cleanly between "Spotlights" and "Get help", pointing to `/admin/index.html`.
- **Global Version Sync**: Bumped application version to `v7.15.2` across `cfm-config.js`, all templates, stylesheets, and footers.

## [2026-10-19 16:35] - v7.15.1 Youth Home Page Footer Harmonization
- **Harmonized Home Footer**: Replaced the legacy text-and-link footer on `public/index.html` with the identical `.org-footer` from the secondary organization pages.
- **Silhouette & Moroni Emblem**: Rendered the transparent pine tree silhouette background (`footer-tree-silhouette.png`), flanking horizontal divider lines, centered Blackstone Ward Moroni logo (`ward-logo-moroni.png`) with link to `blackstoneward.org`, and dynamic italicized version tag.
- **Flush Edge Styling**: Added `.org-footer` styles and `html { background-color: var(--cream); }` to `public/assets/youth-hub.css`, ensuring the silhouette sits flush against the page baseline with zero seams.
- **Global Version Sync**: Bumped application version to `v7.15.1` across `cfm-config.js`, all templates, stylesheets, and footers.

## [2026-10-19 15:40] - v7.15.0 Full Organization Pages Migration
- **Secondary Pages Editorial Redesign**: Fully migrated all 5 secondary organization pages (`Priests/`, `Teachers/`, `Deacons/`, `YW/`, `Primary/`) to the approved editorial seasonal design matching the Combined pilot.
- **Dynamic Group Subtitle Format**: Applied the user's required subtext format across all non-Combined groups: `"Activities, service, and time together for " & [Group Name] & "."` (`Activities, service, and time together for Priests.`, `Activities, service, and time together for Teachers.`, `Activities, service, and time together for Deacons.`, `Activities, service, and time together for Young Women.`, `Activities, service, and time together for Primary.`).
- **Group Switcher Pill Highlighting**: Contextually highlighted the active organization tab on each page with official vector SVG emblems and `aria-current="page"` accessibility.
- **Combined + Quorum Event Aggregation**: Integrated dual Firestore `onSnapshot` queries on each quorum/class page listening to both quorum-specific collections (`Priests_events`, `Teachers_events`, `Deacons_events`, `YW_events`, `Primary_events`) and ward-wide `Combined_events` with category color support and ID deduplication.
- **Legend & Badge Combined Category Styling**: Added `.legend-dot.combined` and `.row-date-badge.combined` styles to `public/assets/org-page.css` and added Combined to the category legend for all quorum/class calendars.
- **Organization Feedback Routing**: Connected the interactive feedback modal to tag submissions with the respective organization name (`Priests`, `Teachers`, `Deacons`, `Young Women`, `Primary`).
- **Global Version & Cache Sync**: Bumped application version to `v7.15.0` across `cfm-config.js`, `public/index.html`, `public/Combined/index.html`, all 5 organization pages, and static footers.

## [2026-10-19 15:00] - v7.14.4 Uniform Calendar Grid & 2-Line Text Wrapping
- **Uniform Grid Sizing**: Configured `.cal-days-grid` with fixed `grid-auto-rows: 94px` (84px on mobile) and `.cal-day-cell` with fixed `height: 94px; overflow: hidden; box-sizing: border-box;`, making every day cell in the calendar grid identical and uniform in dimension.
- **2-Line Text Wrapping**: Upgraded `.cal-event-pill` and introduced `.cal-pill-title` with `-webkit-line-clamp: 2` and `overflow-wrap: break-word`, allowing event titles to wrap across two lines with graceful ellipsis truncation for longer names.
- **Top-Aligned Category Bullet**: Set `.cal-event-pill` to `align-items: flex-start` with bullet dot `margin-top: 3px`, ensuring category indicators remain cleanly aligned with the first line of wrapped text.
- **Cache-Busting & Version Sync**: Incremented cache-busters to `?v=7.14.4` across stylesheet, scripts, and image tags, and synchronized version `7.14.4` across `cfm-config.js`, `public/Combined/index.html`, and `public/index.html`.

## [2026-10-19 14:50] - v7.14.3 Group Switcher Tabs Vertical Centering
- **Symmetric Vertical Margin**: Updated `.group-tabs-container` with equal top and bottom margins (`margin-top: 24px; margin-bottom: 24px;`), moving the group switcher buttons down so they are perfectly centered between the bottom of the landscape hero banner and the Activity Calendar card.
- **Cache-Busting & Version Sync**: Incremented cache-busting query strings (`?v=7.14.3`) on `org-page.css`, `ward-logo-moroni.png`, and `footer-tree-silhouette.png`, and synchronized version `7.14.3` across `cfm-config.js`, `public/Combined/index.html`, and `public/index.html`.

## [2026-10-19 14:40] - v7.14.2 Footer Flush Background & Official Logo Integration
- **Transparent Silhouette Artwork**: Re-rendered `footer-tree-silhouette.png` with complete alpha transparency for the sky and mist, completely removing the white bounding box and contrast seams against the page container.
- **Flush Edge Alignment**: Configured `.org-footer` with transparent background and `background-size: 100% 100%`, and set `html` background to `var(--cream)` (`#faf6ef`) so the footer is completely flush with the bottom and sides with zero white gaps.
- **Official Youth Hub Logo Integration**: Replaced the extracted footer emblem with the official transparent, high-res Blackstone Ward Youth Hub logo (`ward-logo-moroni.png`) provided by the user.
- **Asset Cache-Busting & Version Sync**: Added `?v=7.14.2` query parameters to `footer-tree-silhouette.png`, `ward-logo-moroni.png`, and `org-page.css`, and synchronized version `7.14.2` across `cfm-config.js`, `public/Combined/index.html`, and `public/index.html`.

## [2026-10-19 10:15] - v7.14.1 Footer Silhouette & Moroni Branding
- **Panoramic Pine Silhouette Artwork**: Integrated high-resolution landscape tree and mountain silhouette (`footer-tree-silhouette.png`) anchored along the footer baseline with top gradient transparency.
- **Moroni Statue & Youth Hub Brand Block**: Extracted and rendered the centered Blackstone Ward Moroni logo (`ward-logo-moroni.png`) with cyan-blue "YOUTH HUB" title, linked back to `https://blackstoneward.org`.
- **Flanked Horizontal Dividers**: Positioned responsive 1px horizontal divider lines flanking both sides of the central Moroni emblem, extending across the card width.
- **Clean Blue Version Display**: Configured footer version display to render strictly `"Version " + [version #]` (e.g. `Version 7.14.1`) in italic blue font.
- **Dynamic & Fallback Version Synchronization**: Upgraded `renderGlobalFooter` in `cfm-config.js` to format `data-format="short"` version tags dynamically, and synchronized global version `7.14.1` across `cfm-config.js`, `public/Combined/index.html`, and `public/index.html`.

## [2026-10-19 09:59] - v7.14.0 Secondary Organization Pages Redesign (Combined Pilot)
- **Combined Page GUI Redesign**: Overhauled `/Combined/index.html` to match the approved seasonal editorial design mockup.
- **Seasonal Background Engine**: Integrated with `seasons.css` and `org-page.css` for automated seasonal landscape artwork and palette transitions.
- **Interactive Activity Calendar**: Built 7-day responsive calendar grid with month navigation (`< October 2026 >`), today highlighting, category color-coded event pills, category legend, and calendar/list toggle.
- **Sidebar & Coming Up Modules**: Implemented real-time dynamic "UP NEXT" card, "Good to know" help card, and full-width "Coming up" upcoming activity list.
- **Interactive Event Details Modal**: Added interactive event detail popover dialog with Google Calendar integration.
- **Client Cache-Busting & Version Sync**: Synchronized global version to `7.14.0` across `cfm-config.js`, `index.html` cache-buster (`/cfm-config.js?v=7.14.0`), and static footer fallbacks.

## [2026-10-19 01:02] - v7.13.7 Blackstone Ward Home Logo Integration
- **Brand Logo & Return Link**: Replaced top-left brand element with official Blackstone Ward horizontal logo (`ward-logo-horizontal-v1.0.6.png`) from the main homepage, configured to link back to `https://blackstoneward.org`.
- **Blue Youth Hub Label**: Scaled the logo to fit the header layout and placed "Youth Hub" underneath in brand blue (`#2165a2`) with clean letter-spacing and typography.
- **Client Cache-Busting & Version Sync**: Synchronized global version to `7.13.7` across `cfm-config.js`, `index.html` cache-buster (`/cfm-config.js?v=7.13.7`), and static footer fallback.

## [2026-10-19 00:56] - v7.13.6 Parallax Engine Repair & Asset Resolution
- **Asset Resolution & Fallback**: Corrected seasonal landscape image paths in `seasons.css` and `youth-hub.css` to root-relative `/assets/...`, added fallback assets in `/public/`, and added explicit `body[data-season="fall"]` rule to eliminate 404s.
- **Continuous Scroll Parallax**: Re-engineered parallax JavaScript to use fluid scroll-anchored translation (`Math.min(150, scrolled * speed)`), removing mid-scroll clamp freezing and premature limits.
- **Enhanced Visual Depth**: Increased `.scene-image` vertical buffer (`inset: -160px 0`), added `min-height: 560px` to `.welcome-scene`, and refined `.scene-wash` gradient transparency to reveal the landscape behind the hero cards.
- **Client Cache-Busting & Version Sync**: Synchronized global version to `7.13.6` across `cfm-config.js`, `index.html` cache-buster (`/cfm-config.js?v=7.13.6`), and static footer fallback.

## [2026-10-19 00:52] - v7.13.5 Youth Spotlight Conditional Lock Button
- **Conditional Lock Button Display**: Hid the header button when spotlights are locked to eliminate redundant unlock buttons and keep the black "Unlock spotlights →" banner as the single action.
- **Post-Unlock Lock Toggle**: Dynamically displays the `🔒 Lock` button beside the "Youth Spotlight" header only after unlocking, allowing users to re-lock the section at any time.
- **Client Cache-Busting & Version Sync**: Synchronized global version to `7.13.5` across `cfm-config.js`, `index.html` cache-buster (`/cfm-config.js?v=7.13.5`), and static footer fallback.

## [2026-10-19 00:48] - v7.13.4 Spotlight Video Autoplay Prevention
- **Disable Spotlight Card Autoplay**: Configured `parseVideoEmbedUrl` to default to `autoplay = false` for inline card renders, removing forced `autoplay=1` parameter injection for Vimeo and YouTube embed links.
- **Iframe Permission Hardening**: Removed `allow="autoplay"` from spotlight card `<iframe>` containers so video players stay paused until visitors click play.
- **Preserved Lightbox Modal Autoplay**: Announcement video modal lightbox continues to autoplay as expected when clicked, with automatic parameter handling.
- **Client Cache-Busting & Version Sync**: Synchronized global version to `7.13.4` across `cfm-config.js`, `index.html` cache-buster (`/cfm-config.js?v=7.13.4`), and static footer fallback.

## [2026-10-19 00:43] - v7.13.3 Youth Spotlight Header, Lock/Unlock Toggle & Card Streamlining
- **Section Header & Lock Toggle**: Added a dedicated "Youth Spotlight" header above the spotlights container with an interactive Lock/Unlock button enabling quick locking (session reset) or gate access trigger.
- **Card Bulk Removal**: Removed redundant "Youth" badge and "Spotlight" fallback labels from individual spotlight cards to streamline the presentation and eliminate visual clutter.
- **Client Cache-Busting & Version Sync**: Synchronized global version to `7.13.3` across `cfm-config.js`, `index.html` cache-buster (`/cfm-config.js?v=7.13.3`), and static footer fallback.

## [2026-10-19 00:36] - v7.13.2 Admin Portal Theme & Scripture Editor
- **Admin Theme & Scripture Tab**: Added a dedicated "Theme" tab in the Admin Portal under **Settings & Privacy**, providing input controls for Theme Title and Scripture Reference.
- **Atomic Firestore Sync**: Bound inputs to Firestore document `home_content/general_info` (`theme` and `scripture`), with live status confirmation and automated updates to the Youth Hub homepage.
- **RBAC Access Control**: Configured tab visibility strictly for Tier 3 (Master Admin) users.
- **Client Cache-Busting & Version Sync**: Synchronized global version to `7.13.2` across `cfm-config.js`, `index.html` cache-buster (`/cfm-config.js?v=7.13.2`), and static footer fallback.

## [2026-10-19 00:13] - v7.13.1 Official SVG Symbols Integration
- **Official SVG Symbols**: Replaced placeholder card icons with the dedicated vector symbols from `public/assets/symbols/`: `combined.svg`, `priests.svg`, `teachers.svg`, `deacons.svg`, `young-women.svg`, and `primary.svg`.
- **Client Cache-Busting & Version Sync**: Synchronized global version to `7.13.1` across `cfm-config.js`, `index.html` cache-buster (`/cfm-config.js?v=7.13.1`), and static footer fallback.

## [2026-10-19 00:05] - v7.13.0 Seasonal Parallax & Editorial GUI Redesign
- **Seasonal Parallax Redesign**: Transformed the Youth Hub homepage to match the warm, editorial aesthetic of the Ward Home with Massachusetts seasonal palette switching and responsive parallax scrolling (`seasons.css`, landscape assets).
- **Custom Vector Icon Suite**: Integrated crisp inline SVGs matching the approved GUI layout: dual-loop gradient logo emblem, 3-person team (`Combined`), priest in suit (`Priests`), scriptures (`Teachers`), shield (`Deacons`), lotus blossom (`Young Women`), and radiant sun (`Primary`).
- **Dynamic "UP NEXT" Hero Card**: Automatically displays the next upcoming Combined youth activity in real-time from Firestore with custom date box badge (`OCT` / `14`).
- **Dynamic Theme & Scripture**: Bound the Hero theme heading and scripture to Firestore `home_content/general_info`.
- **Coming Up & Announcements Modernization**: Rendered activities and announcements in the clean two-column layout with date box badges, circular megaphone badges, and preserved video modal deep linking.
- **Spotlights Protected Banner**: Redesigned the gated youth spotlights banner with circular lock badge and modal integration.
- **Client Cache-Busting & Version Sync**: Synchronized global version to `7.13.0` across `cfm-config.js`, `index.html` cache-buster (`/cfm-config.js?v=7.13.0`), and static footer.

## [2026-10-18 09:40] - v7.12.86 Multi-Site Hosting & Subdomain Migration
- **Youth Hub Subdomain Migration**: Successfully decoupled the Youth Hub from the apex domain `blackstoneward.org` to its dedicated custom subdomain `youth.blackstoneward.org` on Firebase Hosting multi-site target `youth-blackstoneward`.
- **Target Mapping Update**: Updated `.firebaserc` (`"youth": ["youth-blackstoneward"]`) and `firebase.json` (`"target": "youth"`).

## [2026-10-16 12:15] - v7.12.86 Restore Deterministic Video ID Deep-Linking
- **Video ID & Announcement Document ID Resolution**: Restored and enhanced the deep-linking engine in `public/index.html` to scan active announcements for exact Vimeo/YouTube Video IDs (e.g. `?video=1236419866`, `?watch=1236419866`) or Firestore announcement document IDs (`?video=<DOC_ID>`). If multiple video announcements exist simultaneously, the modal player opens the specific video matched by ID rather than defaulting to the first item.
- **Graceful Fallbacks**: Preserved `?video=true`, `?watch=true`, and `#video` to automatically open the most recent active video announcement. If an unmatched ID is provided, the engine gracefully falls back to the top video.
- **Client Cache-Busting & Version Sync**: Synchronized global version to `7.12.86` across `cfm-config.js`, `index.html` script cache-buster (`/cfm-config.js?v=7.12.86`), and static footer fallback.

## [2026-10-16 01:15] - v7.12.85 Announcements Manager Manual Reordering
- **Interactive Reordering Tool**: Added dedicated ↑ and ↓ reordering arrow buttons to each announcement card in the Admin Portal (Settings & Privacy -> Announcements Manager).
- **Atomic Firestore Synchronization**: Swapping adjacent announcement cards uses an atomic Firestore `writeBatch` update on `timestamp` (the primary field used in `orderBy("timestamp", "desc")` on the client site), with automatic collision handling and timestamp redistribution if documents share equal timestamps.
- **Top-Priority New Entries**: Newly created announcements calculate a top-default timestamp that prepends above existing items, maintaining consistent ascending/descending alignment.
- **Visual Boundaries & Polish**: Bound list boundary states with disabled and muted styling on the first (↑) and last (↓) items, accompanied by a new instructional subtitle in the Announcements Manager header.

## [2026-10-16 01:00] - v7.12.84 Video Modal Header Title URL Label Fix
- **URL Link Text Mapping**: Replaced announcement body text references in the video modal banner with the announcement's dedicated URL link text (`data.linkText`, e.g., "Defying Defeat"), ensuring the lightbox header displays the clean video title rather than lengthy announcement descriptions.
- **Unified Video Embed Parser**: Merged full video parsing capabilities supporting YouTube (desktop watch, youtu.be, shorts, embed) and Vimeo (standard, player, unlisted, and vanity links).
- **Auto-Open Deep Linking**: Enabled deep linking via `?video=true`, `?watch=true`, and `#video` query parameters to trigger automatic announcement video modal launch on page load.
- **Video Modal Header Banner**: Added dynamic video announcement title rendering with responsive truncation in the lightbox header.
- **Spotlights Compatibility**: Gated spotlights automatically resolve embedded YouTube/Vimeo URLs and generate HQ thumbnails.

## [2026-10-15 23:35] - v7.12.81 Video Announcement Auto-Open Deep-Linking
- **Deep-Link Auto-Opening**: Integrated URL parameter (`?video=true`, `?watch=true`) and hash (`#video`) handling on `public/index.html` to automatically open the in-page video modal when visitors access the direct share link. Cleans URL on modal dismiss via `history.replaceState`.

## [2026-10-15 23:26] - v7.12.80 Video Modal Header Banner Title Refinement
- **Header Banner URL Label Binding**: Modified video modal trigger in `public/index.html` to pass the announcement's specific URL label (`linkText`) to the modal title element (`#videoModalTitle`), replacing the general announcement text with the clean video title.

## [2026-10-15 23:17] - v7.12.79 Home Announcements In-Interface Video Modal
- **In-Interface Video Modal**: Built an in-page 16:9 responsive video modal (`#videoModal`) directly into `public/index.html`.
- **Automatic Video URL Detection**: Announcements containing Vimeo (standard, unlisted, vanity/redirects) or YouTube (watch, shorts, youtu.be, embed) URLs are now automatically identified and rendered as interactive `▶ Watch Video` modal triggers, eliminating disruptive redirects off-site.
- **Accessible Modal Lifecycle**: Provided clean backdrop click dismiss, keyboard `Escape` support, and immediate iframe teardown upon closing to prevent lingering audio playback. Non-video URLs continue opening in new tabs via `target="_blank"`.

## [2026-04-13 01:30] - v7.10.1 Global Branding & Routing
- Universal Version Logic: Extracted version management to `cfm-config.js` and injected dynamic footer branding uniformly across all organizational pages (Deacons, Priests, etc.).
- Routing Refinement: Corrected static `<h1>` initial states mapped dynamically in secondary organizational loops to appropriately render localized titles, eliminating the visual jump from default legacy strings.
- Master Footer Synchronization: Forced Suggestions & Help logic to mount in a persistent global component appended beneath secondary calendars for full accessibility.

# Blackstone Ward Youth Hub: Change Logs

## [2026-04-13 04:55] - v7.10.0 UI Core Recovery & S-Permissions Patch
- **Spotlight Recovery & UI Sanity**: Fully mapped historical `index.html` buffers forcefully restoring the localized Private Youth Spotlight image arrays missing from syntax override regressions safely rendering flawlessly.
- **SG Eventarc IAM Execution**: Finalized runtime mapping executing standard IAM Service Roles explicitly granting `sendFeedbackEmail` safe pipeline clearance to correctly bypass permissions validation inside `us-central1`.
- **Global Error Handling**: Injected raw visual network intercepts into the shared Feedback form natively routing `Permissions or Network Error` to screen catching failed hooks correctly.## [2026-04-13 04:20] - v7.9.0 Global Feedback SG Integration
- **Serverless Cloud API Tracking**: Seamlessly initialized explicit Node.js backend functions mapping strictly to `@sendgrid/mail`. Mapped safe variables natively resolving secrets logic parameters automatically masking SMTP bounds.
- **`site_feedback` Fire-Hooks**: Instantiated an `onDocumentCreated` backend logic route firing securely mapping raw data into HTML wrappers specifically routing accurately to `duanepharris@gmail.com`.
- **UI Global Overrides**: Formally implemented floating Glassmorphic Modals cleanly nested dynamically internally into Side Navigations mapping cleanly directly inside footers spanning exactly visually safely.## [2026-04-13 03:15] - v7.8.0 Refined Typography
- **List View Upgrade**: Exchanged generic structural dashes explicitly rendering inline `•` styled correctly for standard mapping logic arrays. 
- **Service Integration**: The inline `⭐` formally replaces standard dots dynamically highlighting all valid `isService` tasks mapping securely across list-views recursively integrating accurately into Download Generation exports flawlessly.## [2026-04-13 03:00] - v7.7.0 Service Integration
- **Service Boolean Matrix**: Infused `isService` logic parameters capturing states from a dedicated modal checkbox inside the Admin UI tracking seamlessly across all events natively on Firestore.
- **Visual Design Mapping**: Conditionally rendered native text-yellow-400 drop-shadow `★` badges appending gracefully onto calendars, detailed popovers, side-panels, block lists, and legends.## [2026-04-13 02:45] - v7.6.0 Contextual Sync
- **Live Dropdown Filtering (`onSnapshot`)**: Upgraded Lesson Manager teacher selectors natively binding to active `onSnapshot` queries natively pulling localized (`where("org", "in", [currentOrg, "General"])`) arrays replacing the legacy rigid static lists.
- **Legacy Sanitation**: Fully removed `typeof TEACHER_LIST` fallback parameters stripping array overrides forcing exclusively organic Firestore references.## [2026-04-13 02:00] - v7.5.0 Safe-Guard & Sync
- **Safe-Guard Zip Backup**: Compressed the full codebase isolating stable V7.4.0 assets locally.
- **Teacher UI Organization Matrix**: Overhauled the dynamic teacher list rendering logic to explicitly map and organize DOM rows grouped structurally under nested layout blocks corresponding precisely to active internal `org` bounds. Retained inline edit and delete parsing strictly within new structure.
## [2026-04-13 01:45] - v7.4.0 Autonomous Versioning & Teacher Dash
- **V7.4.0**: Enabled Autonomous Versioning and launched the Unified Teacher Management dashboard.
## [2026-04-13 01:30] - v7.3.0 Dynamic Organization Teachers
- **Unified Teacher Management UI:** Added "Manage Teachers" section to `index.html` allowing centralized CRUD operations mapped directly to `home_teachers` in Firestore. Teachers are assigned to dedicated Organizations or 'General'.
- **Context-Aware Lesson Editors:** Converted static `TEACHER_LIST` inputs across all organization sub-pages (`Combined`, `Deacons`, `Priests`, `Primary`, `Teachers`, `YW`) to dynamically fetch relevant authorized teachers via `initApp()` based strictly on `org` targeting boundaries.
- **One-Shot Seed Migration:** Constructed robust `firestore.writeBatch()` extraction algorithm in `index.html` safely porting hardcoded static values from `cfm-config.js` immediately to secure native instances to retain layout consistency.
## [2026-04-13 01:00] - v7.2.1 Full Codebase Base64 Purge
- **Complete SHA-256 Gating**: Removed the final traces of plain-text passwords and legacy Base64 validation logic across all organizational sub-directories (Primary, Deacons, Teachers, Priests, YW, Combined). Implemented native SubtleCrypto digest functions mapping to `SECURE_AUTH_HASHES`, ensuring end-to-end cryptographic hashing validation with whitespace stripping and case-insensitive sanitation.
- **Snapshot Configured**: Version backup safely packed.

## [2026-04-12 19:49] - v7.2.0 Cryptographic Shield
- **V7.2.0**: Replaced Base64 obfuscation with SHA-256 hashing for enhanced privacy gate security.
## [2026-04-07 21:07] - v7.1.11 SHA-256 Gatekeeper Protection
- **Privacy Lock Architecture**: Converted the Spotlights feed into a natively restricted container mapping off a singular `sessionStorage` token or administrative authorization bounds! Before displaying any images over public internet arrays, a standalone Gateway UI requires manual validation.
- **SubtleCrypto Hashing Protocol**: Fused native browser array-mapping utilizing `crypto.subtle.digest` alongside nested `TextEncoder` blocks extracting SHA-256 integers from raw user inputs. Validated hex blocks cross-reference immediately securely without triggering network responses against `verifyAccess` bounds containing names (Harris, Hunsaker, Truscott... etc).

## [2026-04-07 20:26] - v7.1.10 Mobile Compliance Optimization
- **Base64 Event Listener Abstraction**: Extracted heavily saturated metadata (massive Base64 string representations of Spotlight imagery) out of native HTML inline DOM node queries (`onclick="..."`). Refactored execution dynamically by assigning target attributes onto `.edit-spot-btn` natively parsing explicit array index iterations! This guarantees `window.editSpot()` executes safely regardless of image variable payload length without crashing browser engines.

## [2026-04-07 20:20] - v7.1.9 Smart Sort Algorithm
- **Spotlight Date Input**: Expanded the `manageSpotlightForm` UI element to allow a strict `spotDate` ISO configuration when constructing new Spotlights globally.
- **Legacy Migration Matrix**: Booted a `.writeBatch()` sweep mapping logic onto `initHub()`. This silently parses all legacy documents that previously lacked a custom `sortOrder` dimension, natively converting their creation `.timestamp` hashes into an integer index alongside string mapping current ISOs securely backward.
- **Algorithmic Sandwich Insertion**: When adding a new Spotlight locally, the codebase queries the layout arrays. It finds its exact semantic "Neighbors" filtering ascending string representations of its target Date. It extracts the numerical `.sortOrder` of both bounds dynamically dividing that sum mathematically mapping a fractional or perfectly mid-aligned float value! This inserts the Spotlights safely alongside any custom manipulation swaps.

## [2026-04-07 10:55] - v7.1.8 Symmetry & Logic Engine
- **Dynamic Event Scaling**: Rewrote the `Combined_events` fetch sequence to wait for the DOM load. It now dynamically measures `annContainer.offsetHeight` and mathematically maps integer height divisors bounding the upcoming events column to perfectly parallel the Announcement column height on Desktop breakpoints (>1024px).
- **Sort-Swapping Pipeline**: Injected dedicated `swapAnn()` batch rewrite logic alongside Up/Down micro-buttons on the `admin-controls`. This safely fetches and swaps literal Timestamp metadata between adjacent elements array bindings, executing highly consistent manual reordering without forcing backend field migrations!
- **Implicit Whitespace Rendering**: Attached `.whitespace-pre-wrap` onto announcement arrays natively fixing the "Enter" keyboard stroke truncation bug.

## [2026-04-06 12:04] - v7.1.7 Pathing Regression Sync
- **Absolute Targeting Conversion**: Transitioned sub-page directory rendering paths across all 6 organization grids from pseudo relative targets (`../js/config.js`, `../images`) to explicit absolute variables mapped internally(`/js/config.js`). This explicitly shields the structural layouts from "null origin" CORS violations when viewing folders independently.
- **Clean Configuration Architecture**: Registered `"cleanUrls": true` securely across `firebase.json` rendering bindings, seamlessly securing URL states off the Host level.

## [2026-04-06 10:16] - v7.1.6 Announcement CRUD & Polishing
- **Full Announcement Editing**: Inserted an interactive pencil "Edit" icon dynamically beside the "Delete" hook on all active `home_announcements` cards. Calling this hook seamlessly extracts the live strings and populates the `#admin-controls` node natively. Added `.updateDoc` overrides to bypass database overlap issues.
- **Dynamic Link Parsing**: Altered `initHub` generation sequence to securely parse missing `<linkText>` strings into a default `"View More"` visual layout if the originating administrator forgets to define a custom hypertext variable, preventing invisible or improperly mapped button schemas.

## [2026-04-06 09:50] - v7.1.5 Clean Hyperlinks 
- **Admin Routing Constraints**: Engineered two new structural input nodes (`#new-ann-link-url` & `#new-ann-link-text`) explicitly mapped to the Announcement backend forms. Built logic handlers forcing URL parameters to inherently require Text parameters before Database submission resolves, securing against broken formatting natively.
- **Card Anchoring Hooks**: Refactored front-end logic in index.html to actively parse DB data strings looking for `linkUrl`. Upon detection, visually generates a thumb-friendly (`padding-x,y`) stylized absolute anchor `<a>` targeting `_blank` background execution, shielding users from raw URL texts.

## [2026-04-06 09:28] - v7.1.4 Pipeline Seal & Security Audit
- **Deployment Stabilization**: Validated the Base64 implementation scaling and execution parameters. Images safely convert to Data URIs locally prior to Firebase storage, resolving all 404s and network limits.
- **Rules Documentation Sync**: Formatted and codified `firestore.rules` inside the local repository, mapping explicit write triggers properly for `Deacons_events` (fixing syntax typoes) and matching the live console structure to ensure the deployment configuration remains identical across testing structures.

## [2026-04-05 22:44] - v7.1.3 Base64 Image Pivot
- **Architectural Shift**: Stripped the `firebase-storage.js` module dependencies out of the project entirely to bypass persistent CORS origin blocking errors stemming from local CLI setups and external Google Cloud environments.
- **Direct Database Injection**: Modified the Spotlights interface to dynamically scrape `<input type="file">` structures, aggressively shrink output strings to a functional `MAX_WIDTH` of `800px` at `0.7` JPEG quality natively via `<canvas>`, and funnel the ensuing Base64 string parameters straight into standard `Firestore` document arrays! The 800px constraint prevents iPhone payloads from exceeding the strict 1MB document max in Firebase.

## [2026-04-05 22:03] - v7.1.2 CORS Firewall Safety Limits
- **CORS Root Configurator**: Generated `/cors.json` structurally inside the main Hub repo tree. This standardizes cross-origin policy metrics exclusively tracking GET/PUT blocks into Firebase Storage constraints, clearing up upload hangs natively.
- **Promise 10-Second Abort Logic**: Hardcoded `Promise.race()` logic around `uploadBytesResumable` executions. If a Firebase payload exceeds 10 literal seconds, it throws an artificial interrupt exception, strips the upload stream via `.cancel()`, and visually alerts the user rather than soft-locking.
- **Cancel Override UI**: Wired `resetSpotlightForm` hooks directly onto `#cancelSpotBtn` so uploading states can be bypassed manually by admins via active clicking mid-stream.

## [2026-04-05 21:58] - v7.1.1 Resumable Spotlight Uploads
- **Upload Bytes Tracking**: Refactored the core image push function from `uploadString` to `uploadBytesResumable`. To facilitate this, Javascript automatically intercepts the `data_url` output from the canvas resizing sequence, generates an internal `Blob` via generic fetch sequences, and streams progress percentage payloads securely back to the admin UI element (`Uploading... 45%`).
- **Enhanced Log Telemetry**: Injected deep explicit `console.error()` boundaries framing Firebase transaction processes, ensuring immediate terminal alerts if the storage module halts on CORS boundaries or Firebase UI constraints.
- **Snapshot Configured**: Built standard terminal ZIP backup of layout structure.

## [2026-04-05 21:39] - v7.1.0 Direct Spotlight Management & Image Compilation
- **Firebase Storage Integration**: Replaced raw string-based Google Drive URL hooks within Spotlights to target native `<input type="file">` streams. Hooked `firebase-storage.js` natively to route photos directly via active UI handlers.
- **Canvas Edge Resizing**: To prevent iPhone 15 Pro Max 24MB raw file dumps from instantly locking Firebase Quotas via pure Javascript constraints, mapped a transient HTML `<canvas>` to automatically hijack all image uploads. Javascript forces an active proportional rescale down to `MAX_WIDTH = 1200` before parsing the scaled image into a Base64 stream, allowing near-instant execution overheads.
- **Edit Modal Routing**: Added dynamic `Edit` bindings mapped to the administrative spotlight iterations. Admins can click "Edit" on a spotlight to auto-populate the CMS layout block. Changes are actively monitored and piped securely into `updateDoc` triggers rather than `addDoc`, while orphaned storage photos are actively pruned (`deleteObject`) to conserve database footprints.

## [2026-04-05 21:13] - v7.0.1 Spotlight Google Drive URL Support
- **Drive Logic Interceptor**: Standard `share` URIs sourced directly from Google Drive open inside interactive HTML viewers natively. To resolve silent frontend rendering failures when a leader pastes a Viewer URL into the Hub, an active string parser was built into `saveSpotBtn`. The javascript instantly intercepts `/file/d/` string parameters, isolates the actual global byte ID, and aggressively overwrites the URL to export the raw file bytes direct to the payload (`drive.google.com/uc?export=view&id=XYZ`), maintaining flawless component integration cleanly.
- **Error Transparency Execution**: Hardcoded explicit Javascript `try/catch` handlers mapped dynamically around all administrative Firebase API pushes within `index.html`. This ensures that any Firestore/Cloud permission denials print directly to the user viewport rather than logging silent network exceptions.
- **Admin Refactoring**: Brought global `security-config.js` password definitions dynamically into line with `blackstoneward.md` criteria matrices.
- **Backups**: Replicated output and compiled `2026-04-05_2113_Blackstone_Hub_V7.0.1.zip`.

## [2026-04-05 20:38] - v7.0.0 Home Page Restructure
- **Youth Spotlights (New Feature)**: Added a massive full layout grid mapping to `home_spotlights` in Firebase. Hooked fully into the Hub Manage tools to insert descriptions, organizational tags, and live direct Image URL strings (like Google Drive previews).
- **Core Organization Restructure**: Implemented deep layout cleanup across `index.html`. Removed `Master` designation, implemented hard visual block separations using `<hr>`, created specific `Activities` and `General Announcements` headers.
- **Info Consolidation**: Purged the older Theme box placement entirely. Mapped Youth Theme variables gracefully directly above the global footer version display. Rewrote the Next Event cycle into a simplified `Next Combined Events` dual-array render using `.docs.forEach()` pulling down `limit(2)` results!

## [2026-04-05 19:46] - v6.13.0 Verified Content Hotfix
- **Ghost-DOM PDF Integration**: Completely bypassed all HTML DOM stacking conflicts (which previously threw blank layouts if the user inadvertently triggered Chromium Viewport overlap logic) by explicitly mapping `html2pdf.js` away from scanning the visible DOM entirely. PDF snapshots now execute directly on hardcoded native memory strings pushed to a secure iframe under the hood. 
- **Inline Hash Injection**: Hardcoded inline hex identifiers for standard categorical matrices directly into the Javascript payload string so that native memory bytes calculate the perfect Quorum category colors (blue, yellow, orange) despite the string natively having zero ties to external CSS libraries. 
- **Backups**: Replicated output and compiled `2026-04-05_1946_Blackstone_Hub_V6.13.zip`.

## [2026-04-05 19:41] - v6.12.0 Verified Content PDF Mission
- **Visibility-First PDF Extraction**: Completely replaced the original `left: -9999px` absolute bypass strategy. Chromium sometimes prunes mathematically-offscreen nodes to save memory, stalling DOM exports. Enforced hardcoded `display: block !important` and `visibility: visible !important`, mapped transparently against `z-index: -9999` to keep the layout rendering fully "On Screen" without visually disrupting user experience!
- **Handshake Expansion**: Escalated the `setTimeout()` validation hook up to `500` milliseconds, directly compensating for alphabetizing iterations and ensuring CFM integrations bind to the `tempDiv` canvas before `html2pdf.js` generates the document.
- **Dynamic File Registry**: Mapped conditional Javascript conditionals triggering explicit filenames corresponding to specific data streams (`YHub_All_Sched.pdf` vs `YHub_Lessons_Sched.pdf`).
- **Backups**: Replicated output and compiled `2026-04-05_1941_Blackstone_Hub_V6.12.zip`.

## [2026-04-05 19:12] - v6.11.0 Data-First Export
- **Async Render Pipeline**: Refactored `handlePrint` into an exclusive `async` framework. Added a strict structural Javascript `setTimeout` stalling processing metrics by precisely 100ms so `html2canvas` properly detects UI block geometries on the browser DOM structure before snapshot creation occurs.
- **Backplate Integrity Injection**: Destroyed relative transparency settings in `tempDiv`. Pushed explicit `#ffffff` absolute colors as PDF boundaries, accompanied strictly by absolute `#000` text assignments to negate any rogue cascading styling (which previously overrode text logic causing visual failure and blank PDFs).
- **DOM Placement Rendering**: To prevent invisible scaling artifacts and DOM clipping, the snapshot HTML wrapper is now natively pushed off the visible user screen space (`left: -9999px`), ensuring standard generation can proceed securely unlinked from viewport tracking.
- **Backups**: Replicated output and compiled `2026-04-05_1912_Blackstone_Hub_V6.11.zip`.

## [2026-04-05 19:01] - v6.10.0 Mobile PDF Visibility Engine
- **Core Javascript PDF Mapping**: Deprecated `window.print()` functionality to replace it entirely with a raw `html2pdf.js` builder running off a CDN array natively processing the document payload. Desktop natively triggers a `.save()` call immediately pushing byte data to download folder. 
- **Safari Security Bypass**: iOS completely kills async Popups. Designed a synchronous parser that pre-loads `window.open` at clicktime (simulating a 'Generating PDF' screen natively blocking touches), builds the Blob layout silently in the background, and dynamically injects `url` straight into the window location avoiding the firewall!
- **Feedback Loop**: Updated the generic dropdowns to lock active selection strings while processing chunks to guarantee zero click-bounce artifacts.
- **Backups**: Replicated output and compiled `2026-04-05_1901_Blackstone_Hub_V6.10.zip`.

## [2026-04-05 18:44] - v6.9.0 Custom Export Patch
- **Dynamic PDF Overhaul**: Trashed the rigid PDF parsing generator script and rebuilt `handlePrint()` into an exclusive content router that natively processes structural arguments (`all`, `activities`, `lessons`). 
- **Teacher/Notes PDF Sync**: When mapping Sunday Lessons to the PDF tree, the builder natively evaluates the raw Firebase `teacher` string and `notes` parameter array created in V6.6, appending them perfectly in line underneath the `topic` output.
- **Button Migrations**: Converted all active "Download (PDF)" nodes across both Grid and List interfaces into `<select>` parameters mapping identical tailwind classes. Native `onChange` listeners allow 1-tap download tracking.
- **Backups**: Replicated output and compiled `2026-04-05_1844_Blackstone_Hub_V6.9.zip`.

## [2026-04-05 18:32] - v6.8.0 UI Rescue Patch
- **Input Scaling Locked**: Forcibly broke passive `min-h-[44px]` height variables scaling out to form dimensions across Edit rows. Inserted hard `h-[45px] max-h-[45px]` logic directly onto Input, Select, and Date nodes preventing any grid-based height distortions entirely.
- **Admin Authenticator Injection**: Rewrote the javascript unlock callback tree so that verifying a password explicitly commands the engine to `renderDataManager()` and `renderLessonManager()` sequentially instead of awaiting a background refresh. Tables now instantly trigger visually on login.
- **Calendar Position Logic**: Appended explicit `display: block !important; margin-right: 10px; opacity: 1;` settings to standard `-webkit-calendar-picker-indicator` filtering logic to finally squash stubborn OS UI overwrites preventing icon mapping.
- **Backups**: Shifted architecture to `2026-04-05_1832_Blackstone_Hub_V6.8.zip`.

## [2026-04-05 18:18] - v6.7.0 Visible Date Picker Matrix
- **Mobile Readability Fix**: Bruteforced `-webkit-calendar-picker-indicator` in global CSS tags to invert the standard webkit black-on-black UI element so users can actually see the calendar hit-box. Enforced OS-level `color-scheme: dark;`.
- **Thumb Tap Parameters**: Set `#44px` height thresholds. Fixed `<input>` mapping from generic `blue/amber` outlines to standard `slate-600` borders returning `violet-500` feedback focus shadows.
- **Backups**: Verified V6.7 fallback architecture via ZIP.

## [2026-04-05 18:04] - v6.6.0 Sunday Lessons Dashboard Rebrand
- **UX UI Redesign**: Rebranded the "Sunday Curriculum" admin interface to use the more active "Sunday Lessons" title.
- **Dual Flow Buttons**: Added an identical `+ Add Lesson` button inside a Flex container on the Lesson table header to grant dual-points of entry, optimizing standard mobile accessibility parameters.
- **Backups**: Shifted and locked `2026-04-05_1804_Blackstone_Hub_V6.6.zip` dynamically.

## [2026-04-05 14:48] - v6.5.0 Enhanced Sunday Lesson Manager
- **CFM Auto-Fill Integration**: Stood up `cfm-config.js` with the full 2026 CFM parsed layout. Dropped an `onChange` watcher on the native browser Date inputs to dynamically populate the Topic inputs if a mapped Sunday bounds is selected.
- **Teacher Configuration**: Phased out manual input in favor of a `<select>` alphabetical index loop over `TEACHER_LIST` names list. 
- **Notes Architecture**: Rewrote the inline table row UI editor inside the quorums to push a 4-column span grid including a native bottom-bound text-area to handle detailed `<p>` notes fields.
- **Backups**: Shifted up and locked `2026-04-05_1448_Blackstone_Hub_V6.5.zip` architecture.

## [2026-04-04 23:48] - v6.4.0 Centralized Tiered Security
- **Security**: Implemented tiered security leveraging obfuscated central `<script src="security-config.js">`. Deprecated local HTML map vectors in favor of dynamic `btoa(p)` matches against `YOUTH_HUB_AUTH`.
- **Backups**: Snapped localized code directly into `2026-04-04_2348_Blackstone_Hub_V6.4.zip`.


## [2026-04-04 23:07] - v6.3.0 Sub-Header Labels
- **UI UX**: Added organization labels (Primary, Priests, etc.) formatted `text-purple-400` to all sub-pages beneath the Logo to fix navigation clarity.
- **Backups**: Verified Root `<header>` isolation. Zipped snapshot `2026-04-04_2307_Blackstone_Hub_V6.3.zip` safely tracking the exact changes.


## [2026-04-04 22:45] - v6.2.0 Hero Logo Layout
- **Branding**: Centred and scaled branding to 150px; removed redundant header text; synchronized global versioning.
- **Backups**: Successfully dropped timestamp compression zip map into `/Youth_Hub_Backup/2026-04-04_2245_Blackstone_Hub_V6.2.zip`.


## [2026-04-04 22:38] - v6.1.0 Logo Refine Matrix
- **UI Refresh**: Stripped redundant textual headers and replaced them entirely with exact Logo image map links. Restrained to 50px bounds mapped exclusively to `.png` paths.
- **Backups**: Snapped architecture into `2026-04-04_2238_Blackstone_Hub_V6.1.zip`.

## [2026-04-04 22:24] - v6.0.0 Logo & Header Refactor
- **Branding**: Implemented horizontal logo header mapping (`images/BlackstoneYouthHubLogo.png` with `max-height: 45px`) alongside `Blackstone Ward Youth Hub` alt-text accessibility. Explicitly scrubbed hardcoded `2026` string vectors.
- **Backups**: Packed localized snapshot `2026-04-04_2224_Blackstone_Hub_V6.0.0.zip` according to high-precision timestamp directives.


## [2026-04-04 21:50] - v5.8.0 Archive Snapshot 
- **Backups**: Successfully deployed `2026-04-04_Blackstone_Hub_V5.8.0.zip` to the `Youth_Hub_Backup` directory.
- **Cleanup**: Verified root and `/public` directories are strictly isolated to active codebase files (zero legacy clones or orphan `.zip` distributions exist).
- **Milestone Feature List**:
  - Global Version Alignment string formats unified.
  - Persistent Mobile Administration controls locked to `isAdminMode`.
  - Sunday Curriculum tracking pipeline schema deployed natively to Editor UI.
