# Project State & Documentation

## Current Stable Version
**v7.11.0** (As referenced in `public/cfm-config.js`).

## SMTP & Email Settings
- **Provider**: SendGrid (`@sendgrid/mail`)
- **Sender**: `hub@blackstoneward.org`
- **Recipient**: `duanepharris@gmail.com`
- **Authentication**: Uses Firebase Secrets (`SENDGRID_API_KEY`) within Cloud Functions.
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
Youth_Hub_Backup/2026-04-04_2157_Blackstone_Hub_V5.8.1.zip
Youth_Hub_Backup/2026-04-04_2230_Blackstone_Hub_V6.0.zip
Youth_Hub_Backup/2026-04-04_2238_Blackstone_Hub_V6.1.zip
Youth_Hub_Backup/2026-04-04_2245_Blackstone_Hub_V6.2.zip
Youth_Hub_Backup/2026-04-04_2307_Blackstone_Hub_V6.3.zip
Youth_Hub_Backup/2026-04-04_2348_Blackstone_Hub_V6.4.zip
Youth_Hub_Backup/2026-04-04_Blackstone_Hub_V5.8.0.zip
Youth_Hub_Backup/2026-04-05_0001_Blackstone_Hub_V6.4.zip
Youth_Hub_Backup/2026-04-05_1448_Blackstone_Hub_V6.5.zip
Youth_Hub_Backup/2026-04-05_1804_Blackstone_Hub_V6.6.zip
Youth_Hub_Backup/2026-04-05_1818_Blackstone_Hub_V6.7.zip
Youth_Hub_Backup/2026-04-05_1832_Blackstone_Hub_V6.8.zip
Youth_Hub_Backup/2026-04-05_1844_Blackstone_Hub_V6.9.zip
Youth_Hub_Backup/2026-04-05_1901_Blackstone_Hub_V6.10.zip
Youth_Hub_Backup/2026-04-05_1912_Blackstone_Hub_V6.11.zip
Youth_Hub_Backup/2026-04-05_1941_Blackstone_Hub_V6.12.zip
Youth_Hub_Backup/2026-04-05_1946_Blackstone_Hub_V6.13.zip
Youth_Hub_Backup/2026-04-05_2038_Blackstone_Hub_V7.0.zip
Youth_Hub_Backup/2026-04-05_2113_Blackstone_Hub_V7.0.1.zip
Youth_Hub_Backup/2026-04-05_2141_Blackstone_Hub_V7.1.0.zip
Youth_Hub_Backup/2026-04-05_2158_Blackstone_Hub_V7.1.1.zip
Youth_Hub_Backup/2026-04-05_2203_Blackstone_Hub_V7.1.2.zip
Youth_Hub_Backup/2026-04-05_2244_Blackstone_Hub_V7.1.3.zip
Youth_Hub_Backup/2026-04-06_1016_Blackstone_Hub_V7.1.6.zip
Youth_Hub_Backup/2026-04-06_1204_Blackstone_Hub_V7.1.7.zip
Youth_Hub_Backup/2026-04-07_1107_Blackstone_Hub_V7.1.8.zip
Youth_Hub_Backup/2026-04-07_2020_Blackstone_Hub_V7.1.9.zip
Youth_Hub_Backup/2026-04-07_2026_Blackstone_Hub_V7.1.10.zip
Youth_Hub_Backup/2026-04-07_2108_Blackstone_Hub_V7.1.11.zip
Youth_Hub_Backup/2026-04-12_1949_Blackstone_Hub_V7.1.12.zip
Youth_Hub_Backup/2026-04-13_0100_Blackstone_Hub_V7.2.1.zip
Youth_Hub_Backup/2026-04-17_0005_Blackstone_Hub_V7.10.5.zip
Youth_Hub_Backup/BACKUP_LOG.md
Youth_Hub_Backup/Backup_V7.4.0_SafeGuard.zip
Youth_Hub_Backup/PRE_VIDEO_STABLE_V7.10.2_2026-04-16_11-38.zip
Youth_Hub_Backup/SUCCESS_STABLE_SMTP_V7.10.2_2026-04-13_02-01.zip
Youth_Hub_Backup/V7.10.0_Snapshot2.zip
Youth_Hub_Backup/V7.5.0_Snapshot.zip
Youth_Hub_Backup/V7.6.0_Snapshot.zip
Youth_Hub_Backup/V7.7.0_Snapshot.zip
Youth_Hub_Backup/V7.8.0_Snapshot.zip
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
public/set_version.html
update_subpages.js
zzGoogle/client_secret_956450429708-116fpbs1e1d3j2qvvg91se6crt0dd0ds.apps.googleusercontent.com.json
zzRes/.DS_Store
zzRes/0master.json
zzRes/priests_20260404.jpeg
zzRes/site_structure.json
zzSchedule_Export/2026 Youth Activities.pdf
zzarch/.DS_Store
zzarch/Priests/index_v4-0.html
zzarch/Priests/index_v4-1.html
zzarch/firebase_20260317.json
zzarch/index_20260316.html
zzarch/index_20260317v1.html
zzarch/index_20260317v3.html
zzarch/index_20260317v4.html
zzarch/index_20260317v5.html
zzarch/index_20260317v6.html
zzarch/index_20260317v7.html
zzarch/index_v1.html
zzarch/index_v2.html
zzimport/.DS_Store
zzimport/Combined/.DS_Store
zzimport/Combined/20260317_import.csv
zzimport/Combined/20260321_import.csv
zzimport/Combined/Apple_Picking_3Amigos_20250918.jpeg
zzimport/Combined/Apple_Picking_Chair_20250918.jpeg
zzimport/Combined/Apple_Picking_Tractor_20250918.jpeg
zzimport/Combined/ChristmasProgram_20241113.jpg
zzimport/Combined/Service_PizzaBreak2_20241116.jpeg
zzimport/Combined/Service_PizzaBreak_20241116.jpeg
zzimport/Combined/spotlight.jpeg
zzimport/Deacons/20260317_import.csv
zzimport/Home/EthanWildLion.mov
zzimport/Membership/YM_20260406.pdf
zzimport/Membership/YW_20260406.pdf
zzimport/Priests/.DS_Store
zzimport/Priests/20260317_priests_import.csv
zzimport/Priests/priests_20260404.jpeg
zzimport/Teachers/20260318_teachers_import.csv
zzimport/YW/20260321_yw_import.csv
zzimport/lessons/2026_come_follow_me_for_home_and_church_old_testament.pdf
zzimport/lessons/CFM_Lessons and Dates.pdf
```
