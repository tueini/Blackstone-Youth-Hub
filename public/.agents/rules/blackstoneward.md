---
trigger: always_on
---

# BLACKSTONE WARD HUB STANDARDS (v4.8)

1. PATH AGNOSTICISM:
- Never hardcode organization names (e.g., "Priests"). 
- Always use `window.location.pathname` to detect the folder context.
- Target Firestore collections using the pattern: `ORGANIZATION_NAME + "_events"`.

2. DATA SYNC:
- Every quorum page must fetch from both its local collection and "Combined_events".
- Force "Combined_events" data to use `cat: 'combined'`.

3. UI INTEGRITY:
- Maintain the "Wipe-and-Sync" custom modal workflow for CSV imports.
- Ensure `renderDefaultPane()` resets headers to "Upcoming" and "Next Activities".

4. MOBILE COMPLIANCE:
- Use `addEventListener` for all click logic.
- Apply `touch-action: manipulation` to all touchable elements (days, buttons).
- Verify that the `-webkit-tap-highlight-color: transparent` style is preserved.

5. DATABASE SECURITY:
- Use the obfuscated password 'captainmoroni' (Base64).
- Adhere to the pre-configured production Firestore rules for write access.

6. PRODUCTION DATA INTEGRITY:
- Local Only: All data-heavy testing must be performed using the Firebase Emulator.
- Dry Runs: Before any `firebase deploy`, you must provide a log of the changes made and confirm that no "Mock" or "Test" data exists in the current deployment package.
- Environment Guard: Implement an environment check that prevents write operations to Firestore if the hostname is `localhost` unless a specific `DEBUG_MODE` flag is toggled.