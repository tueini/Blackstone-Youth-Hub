# Project State: Blackstone Ward Youth Auction

**Current Version:** v1.15.12
**Status:** In Development

## Risk Mitigation & Architecture Baselines
- **v1.15.8 Stable Baseline**: Final pre-launch recovery checkpoint established. All core auction engine source code fully synced to the `auction` branch on GitHub, with a localized structural backup stored in `.backups/stable_baseline_v1.15.8/`.
- **v1.8 Stable Baseline**: Core auction engine code isolated to `.backups/stable_baseline_v1.8/` and synced to the `auction` GitHub branch for total recovery capability prior to the live event.

## Recent Updates
- Synchronized HTML footer version strings across all public and administrative views to strictly match the v1.15.12 baseline.
- Upgraded the print generator with a non-printable control panel allowing volunteers to print all items or a specific range of Item Numbers.
- Updated print description truncation limit to 600 characters to balance descriptive text and writable space on printed bid sheets.
- Truncated item descriptions to 150 characters in public/js/print.js to prevent text from overflowing and pushing the bidding rows off the printed page.
- Synchronized HTML footer version strings across all public and administrative views to match the v1.15.8 baseline.
- Fixed CSS print layout in print.html by adding .print-item rules to prevent auction item tables from overflowing and overlapping onto subsequent PDF pages.
- Built a hidden print-generation page (print.html) that dynamically generates perfectly formatted 8.5x11 bid sheets for all auction items, accessible via a new "Print Bid Sheets" button in the Admin Portal's Auction Items tab.
- Completed the Closeout Tab financial rendering system in the Admin Portal, featuring real-time synchronization with active bids to calculate Itemized Settlements (Table A) and Aggregated Family Invoices (Table B).
- Synchronized the hardcoded HTML footer version tracking strings to `v1.15.4` across all public deployment views and enforced high-visibility text rendering (`text-gray-900 font-semibold`).
- Corrected the `admin.js` script path in `admin.html` to an absolute path (`/js/admin.js`) to resolve 404 routing errors on clean URLs.
- Fortified the Rapid Entry "Enter New Bid" form in `admin.js` with NaN validation to prevent runtime errors and invalid data types from entering the `auction_bids` Firestore collection.
- Initialized the Closeout Tab framework in the Admin Portal, featuring Table A (Itemized Settlement) and Table B (Aggregated Invoices).
- Upgraded the 'Save' logic in the Auction Items update routine to support an optional secondary boolean parameter payload for payment status ('paid').
- Expanded the Auction Items database schema to securely track Submitter Emails in the Admin Portal, enabling complete inline CRUD operations for donor contact details.
- Integrated an automated Trigger Email confirmation sequence to immediately send donors a personalized "Thank You" receipt and catalog link upon successful public item submission.
- Upgraded the UX in the Admin Portal Auction Items table by replacing the manual image path text input with a standard file picker during inline editing, automatically retaining the original image if no new file is selected.
- Added the missing "Description" column to the Admin Portal's Auction Items data table, fully wiring it into the inline edit/save CRUD operations.
- Improved the Admin Portal image rendering UX by implementing `URL.createObjectURL` for live local form previews, and adding a graceful CSS-styled fallback (`onerror`) for broken or pending images in the Auction Items and Bids data tables.
- Cleaned up the public "Submit Auction Item" form by removing all prepopulated placeholders. Corrected the syntax of the dynamic mailto: subject line to ensure photos attach securely to the right email thread.
- Updated `firestore.rules` to secure the new `/site_settings/item_counter` document, granting read/write access strictly to authenticated admins.
- Refined the "Add Auction Item" form in the Admin Portal by removing placeholders. Automated "Item Num" generation securely via a new Firestore counter (`site_settings/item_counter`) using transactions.
- Built a public "Submit Auction Item" text-only form (`submit-item.html`) using the Firebase Trigger Email extension to route submissions. Includes a dynamic mailto link for seamless photo submission. Added "Donate an Item" navigation links to the homepage and catalog.
- Integrated Firebase Trigger Email extension by creating a secure `/mail` collection.
- Added auto-email confirmation upon successful Bidder Registration.
- Added a manual "Send Email" action button to the Admin Portal Bidders table.
- Implemented a Public Counter Document (`site_settings/bid_counter`) using Firestore Transactions to securely generate sequential Bid Numbers for unauthenticated users without exposing the `auction_bidders` collection.
- Relaxed strict cell phone validation and updated button copy on the Bidder Registration form.
- Added CSS pulse animations to the public Auction Items catalog that trigger whenever a new high bid is registered in real-time.
- Upgraded the public Auction Items catalog to display real-time highest bids and winning bidder numbers.
- Refined the "Enter New Bid" form: Converted the "Bidder #" input into a dynamically populated dropdown showing the bidder's number and full name. Removed the placeholder from the "Bid Amount" input.
- Fixed a race condition between `loadItems` and the `onSnapshot` listener that caused the Active Bids UI to occasionally render blank/unknown item details.
- Added an interactive thumbnail preview inside the "Enter New Bid" area.
- Refined the "Active Bids" tab UI: added an Item # dropdown for rapid entry, injected item thumbnails/names into the data table, and fully implemented inline CRUD (Edit/Delete) for individual bids within the History Modal.
- Fixed a syntax error in `admin.js` that was preventing the Firebase Authentication listener and login form from firing.
- Built out the "Active Bids" tab in the Admin Portal with a rapid-entry form, a real-time dashboard showing the highest bid per item, and a drill-down modal to view item bid history.
- Configured the `auction_bids` database rules to restrict read/write access to authenticated users.
- Synced the HTML footer version number (`v1.7.1`) in `index.html` and `admin.html`, and darkened the text color (`text-gray-900`) for better visibility.
- Upgraded the Auction Items tab in the Admin Portal to include inline Update and Delete (CRUD) capabilities.
- Refactored the Admin Portal into a tabbed interface (Bidders, Auction Items, Active Bids).
- Implemented a smart file picker for the "Add Auction Item" form targeting the `images/items/` sub-directory.
- Added a data table in the Admin Portal to view submitted Auction Items.
- Built the public Auction Items catalog (`items.html`) with grid layout.
- Connected the catalog to a new `auction_items` Firestore collection.
- Added database security rules allowing public read access to `auction_items`.
- Diagnostic Fix: Converted Tailwind `bg-[url(...)]` to an inline style attribute to ensure the Parallax effect renders correctly, and injected version number into the footer.
- Upgraded the home page UI with a Parallax Hero Image banner and elevated card stylings.
- Added a "Return to Auction Main Page" link to the Admin Login view.
- Upgraded Admin Portal with inline CRUD capabilities (Create, Update, Delete) for bidders.
- Added a subtle footer link in `index.html` pointing to the Admin Portal.
- Created Admin Portal (`admin.html`) with Firebase Authentication.
- Secured `auction_bidders` in `firestore.rules` (only authenticated users can read/update/delete).
- Added dashboard to view registered bidders and check them in.
- Updated `firestore.rules` to allow public access to `auction_bidders` collection.
- Built JavaScript logic to handle Remote Bidder Registration form.
- Connected registration to Firebase Firestore (`auction_bidders` collection).
- Added automatic sequential Bid Number generation.
- Imported `registration.js` into `index.html`.
