# Changelog

## [v1.15.12] - 2026-06-06
### Changed
- Synchronized HTML footer version strings across all public and administrative views to strictly match the v1.15.12 version baseline.

## [v1.15.11] - 2026-05-23
### Added
- Upgraded the print generator (`public/print.html` and `public/js/print.js`) with a non-printable control panel allowing volunteers to print all items or a specific range of Item Numbers.

## [v1.15.10] - 2026-05-23
### Fixed
- Increased item description truncation limit in `public/js/print.js` to 600 characters to optimize writable space on printed 8.5x11 bid sheets.

## [v1.15.9] - 2026-05-23
### Fixed
- Truncated item descriptions in `public/js/print.js` to 150 characters to prevent long text from pushing the empty bidding rows off the printed 8.5x11 pages.

## [v1.15.8] - 2026-05-23
### Changed
- Synchronized HTML footer version strings across all public and administrative views to match the `v1.15.8` version baseline.
### Maintenance
- Established a final pre-launch recovery checkpoint by pushing all production-ready source code to GitHub (`auction` branch) and staging a localized architectural backup in `.backups/stable_baseline_v1.15.8/`.

## [v1.15.7] - 2026-05-23
### Fixed
- Fixed CSS print layout in `print.html` by adding `.print-item` rules to prevent auction item tables from overflowing and overlapping onto subsequent PDF pages during generation.

## [v1.15.6] - 2026-05-23
### Added
- Built a hidden print-generation page (`print.html` and `js/print.js`) that queries the `auction_items` collection and renders perfectly formatted 8.5x11 bid sheets.
- Injected a "Print Bid Sheets" action button into the Admin Portal (Tab 2: Auction Items) for easy generation of physical bid sheets prior to the live event.

## [v1.15.5] - 2026-05-22
### Added
- Authored the Closeout Tab JavaScript rendering pipeline (`admin.js`), enabling real-time calculation and display of Itemized Settlements (Table A) and Aggregated Family Invoices (Table B).
- Bound the Closeout tables to the active `onSnapshot` bid stream, cross-referencing global maps for item names and bidder details natively in-memory without secondary database queries.
- Wired a functional inline payment status checkbox to Table A rows, immediately pushing `paid` state updates to the `auction_items` collection via `updateDoc`.

## [v1.15.4] - 2026-05-22
### Changed
- Enforced high-visibility text rendering (`text-gray-900 font-semibold`) on all HTML footer version strings.
- Synchronized static HTML version footers globally to track `v1.15.4`.

## [v1.15.3] - 2026-05-22
### Changed
- Synchronized all static HTML footers across the public directory (`admin.html`, `index.html`, `items.html`, `submit-item.html`) to display the unified current project version.

## [v1.15.2] - 2026-05-22
### Fixed
- Corrected a relative script path routing error in `admin.html` that caused 404 resource asset failures when trailing slashes or clean URLs were present.
- Hardened the Active Bids Rapid Entry form input handler to safely validate and normalize Item/Bidder string values, preventing undefined `NaN` properties from being pushed to the `auction_bids` Firestore collection.

## [v1.15.1] - 2026-05-22
### Added
- Initialized the Closeout Tab framework in the Admin Portal, featuring Table A (Itemized Settlement Grid) and Table B (Aggregated Invoices Grid).
- Upgraded the 'Save' logic in the Auction Items update routine to support an optional boolean parameter payload for payment status ('paid').

## [v1.15.0] - 2026-05-21
### Maintenance
- Established a total recovery checkpoint. Staged a localized structural backup in `.backups/stable_baseline_v1.8/` and pushed all production-ready source code to the isolated GitHub branch `auction`.

## [v1.14.0] - 2026-05-21
### Added
- Expanded Auction Item management in the Admin Portal to support full CRUD operations and UI display for Submitter Emails.
- Integrated a new Firebase Trigger Email auto-responder sequence in `submit-item.js` that immediately emails a personalized receipt and catalog link to donors when they submit an auction item.

## [v1.13.6] - 2026-05-21
### Changed
- Refactored the inline Edit mode for Auction Items to use a file picker (`<input type="file">`) for images instead of a manual text input, improving usability and preventing typos. Preserves the original image if no new file is selected.

## [v1.13.5] - 2026-05-21
### Added
- Added the missing "Description" field to the Auction Items data table in the Admin Portal, enabling full inline CRUD operations for item descriptions via a new `<textarea>` component.

## [v1.13.4] - 2026-05-21
### Fixed
- Fixed the image preview rendering in the Admin Portal by implementing `URL.createObjectURL` for immediate, live local previews before submission.
- Added a graceful `onerror` DOM replacement to handle broken or pending image deployments in the Admin data tables.

## [v1.13.3] - 2026-05-21
### Changed
- Removed all placeholders from the public "Submit Auction Item" text-only form for a cleaner UI.
- Corrected the template literal formatting on the dynamic `mailto:` photo link for successful parsing by native email clients.

## [v1.13.2] - 2026-05-21
### Security
- Patched `firestore.rules` to explicitly grant authenticated administrators read/write access to the new `/site_settings/item_counter` document, resolving "permission denied" errors during Auction Item creation.

## [v1.13.1] - 2026-05-21
### Changed
- Refined the "Add Auction Item" form in the Admin Portal by removing placeholders.
- Automated "Item Num" generation securely via a new Firestore counter (`site_settings/item_counter`) using transactions.

## [v1.13.0] - 2026-05-21
### Added
- Created public `submit-item.html` form utilizing Firebase Trigger Email extension for public submissions.
- Implemented dynamic `mailto:` link for submitters to instantly email item photos after text submission.
- Added "Donate an Item" call-to-action buttons/links on the Home and Catalog pages.

## [v1.12.0] - 2026-05-21
### Added
- Integrated Firebase Trigger Email extension by writing to a secure `/mail` collection.
- Automated email delivery to successfully registered bidders with their auto-assigned Bid Number.
- Added a "Send Email" action button to the Admin Dashboard Bidders table.

## [v1.11.2] - 2026-05-21
### Fixed
- Resolved Bidder Registration error by migrating sequential ID generation to a public counter document (`site_settings/bid_counter`) using Firestore Transactions, allowing unauthenticated registrations without exposing the secure `auction_bidders` collection.

## [v1.11.1] - 2026-05-21
### Fixed
- Relaxed strict phone number validation on the Bidder Registration form to accept special characters and spaces.
### Changed
- Updated Bidder Registration form submit button text.

## [v1.11.0] - 2026-05-21
### Added
- Implemented real-time CSS pulse animations in the public Auction Items catalog to visually highlight when a new highest bid is placed.

## [v1.10.0] - 2026-05-21
### Added
- Upgraded the public Auction Items catalog to track and display the current highest bids in real time via Firestore `onSnapshot`.
- Relaxed `firestore.rules` for the `auction_bids` collection to permit public reads, while maintaining secure write restrictions.

## [v1.9.2] - 2026-05-21
### Added
- Converted the "Bidder #" field in the Active Bids Rapid Entry form into a dynamic dropdown showing the bidder's name.
### Fixed
- Removed placeholder values from the "Bid Amount" input for clarity.

## [v1.9.1] - 2026-05-21
### Fixed
- Fixed an async race condition in `admin.js` where `onSnapshot` rendered the active bids before `loadItems()` could populate the `itemsMap`, resulting in placeholder thumbnails and "Unknown" names in the dashboard.
### Added
- Added an interactive thumbnail preview inside the Rapid Entry "Enter New Bid" area that updates dynamically when an item is selected from the dropdown.

## [v1.9.0] - 2026-05-21
### Added
- Refined the "Active Bids" tab UI to feature an Item # dropdown selector populated dynamically from the Firestore items collection.
- Enhanced the Highest Bids dashboard to display item thumbnails and names.
- Implemented full inline CRUD (Edit/Save/Delete) functionality for bids within the Active Bids drill-down History Modal.

## [v1.8.1] - 2026-05-21
### Fixed
- Fixed a syntax error involving escaped backticks in `admin.js` that broke the Admin Login listener.

## [v1.8.0] - 2026-05-21
### Added
- Built out the "Active Bids" tab in the Admin Portal with a rapid-entry form.
- Added a real-time dashboard showing the highest bid per item.
- Implemented a drill-down modal to view the chronological bid history for any item.
- Configured `auction_bids` Firestore security rules to restrict access to authenticated admins.

## [v1.7.1] - 2026-05-21
### Fixed
- Updated HTML footer versioning across the site.
- Darkened the footer text color for improved readability and contrast.

## [v1.7.0] - 2026-05-21
### Added
- Added full inline CRUD capabilities (Edit/Save/Delete) to the Auction Items data table within the Admin Portal.

## [v1.6.0] - 2026-05-21
### Added
- Refactored the Admin Portal UI into a tabbed navigation system (Bidders, Auction Items, Active Bids).
- Implemented a JavaScript file picker for capturing local image paths when adding Auction Items.
- Added a new data table to the Admin Dashboard to visualize all posted auction items with image thumbnails.

## [v1.5.0] - 2026-05-21
### Added
- Added an "Add Auction Item" form in the Admin Portal to securely insert data into the `auction_items` Firestore collection.
- Added a "View Auction Items" prominent call-to-action button in the public homepage hero section.

## [v1.4.0] - 2026-05-21
### Added
- Created the public Auction Items catalog (`items.html`).
- Implemented `public/js/items.js` to fetch and render items from the `auction_items` Firestore collection.
### Security
- Updated `firestore.rules` to allow public read access and authenticated write access to the `auction_items` collection.

## [v1.3.3] - 2026-05-21
### Fixed
- Parallax background image bug resolved by migrating from a Tailwind arbitrary URL utility to an inline `style` attribute, ensuring `bg-fixed` behaves correctly across all environments.
### Added
- Injected the current semantic version number into the global footer for easier debugging.

## [v1.3.2] - 2026-05-21
### Changed
- Replaced the basic home page header with a visually rich Parallax Hero Image banner.
- Upgraded typography and styling for the main content sections to modern, elevated "cards" with shadows and structural padding.

## [v1.3.1] - 2026-05-21
### Added
- Added a "Return to Auction Main Page" link to the Admin Login view to improve navigation.

## [v1.3.0] - 2026-05-21
### Added
- Upgraded Admin Portal dashboard to include full inline CRUD capabilities.
- Added "Manually Add Bidder" functionality to insert walk-in registrations directly to the top of the table.
- Added an "Actions" column with Edit and Delete buttons for every registered bidder.
- Implemented secure `updateDoc` and `deleteDoc` integrations with Firebase to manage bidder data.

## [v1.2.1] - 2026-05-21
### Added
- Added a subtle footer link to the bottom of the home page navigating to the Admin Portal.

## [v1.2.0] - 2026-05-21
### Added
- Created `public/admin.html` and `public/js/admin.js` for a secure Admin Portal.
- Integrated Firebase Authentication to protect the admin dashboard.
- Implemented a dashboard data table to view registered bidders and manage check-ins.
### Security
- Updated `firestore.rules` to lock down `auction_bidders` collection (only authenticated users can read/update).

## [v1.1.1] - 2026-05-20
### Security
- Updated `firestore.rules` to allow public read/write access to the `auction_bidders` collection for remote bidder registration.

## [v1.1.0] - 2026-05-20
### Added
- Created `public/js/registration.js` to handle remote bidder registration.
- Connected form to Firebase Firestore `auction_bidders` collection.
- Implemented sequential Bid Number generation logic.
- Updated `public/index.html` to import the new `registration.js` module.
