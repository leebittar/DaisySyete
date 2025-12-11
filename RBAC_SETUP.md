Role-Based Access Control (RBAC) Setup
======================================

This file describes the files added and how to use them to implement RBAC for the admin dashboard.

Files added
- `rbac.js` - client-side role enforcement and navigation guard (loaded by `admin.html`).
- `firestore.rules` - Firestore Security Rules to enforce role restrictions server-side.
- `tools/migrate-admins.js` - Node migration script to copy existing admin docs into UID-keyed docs.

1) How the client-side RBAC works
- After login the app stores `adminUser` into `sessionStorage` (this includes `role` and `uid`).
- `rbac.js` reads that object and hides sidebar links (and the Add User button) based on the role.
- It also wraps the global `navigateTo(viewId)` function to block unauthorized navigation attempts.

Default role → views mapping (in `rbac.js`):
- `super_admin`: dashboard, raw-responses, compliance-reports, manage-questions, user-management, system-settings
- `admin`: dashboard, user-management, manage-questions, compliance-reports
- `data_analyst`: dashboard, raw-responses, compliance-reports
- `survey_manager`: dashboard, manage-questions

2) Firestore rules
- Copy `firestore.rules` to Firestore console (Rules tab) and publish.
- These rules require that the authenticated user has an `admin_users/<UID>` document.
- Only `super_admin` may write to `admin_users` collection.

3) Migration script
- If your `admin_users` documents were created using auto-IDs or email-based IDs, run the provided migration script.
- Steps to run migration script:
  - Install Node dependencies: `npm install firebase-admin`
  - Download a Firebase service account key file and place it at `./service-account.json`
  - Run: `node tools/migrate-admins.js`
- The script will copy data into `admin_users/<uid>` for matching emails and add a `migratedFrom` field.

4) Testing
- Create users in Firebase Auth and create corresponding `admin_users/<UID>` documents with fields: `email`, `name`, `role`, `isActive`, `permissions`.
- Login as each role and verify:
  - Links that should be hidden are hidden.
  - Trying to navigate to a blocked view shows an "Access denied" message.
- Use the Firebase Emulator Suite to test rules locally before publishing if possible.

5) Notes
- Server-side rules are authoritative: even if client hides links, direct Firestore queries are protected by rules.
- Keep `admin_users` document ID equal to Firebase Auth UID for rules to work (recommended).

If you want, I can also:
- Add a small "Admin Management" UI to create admin users (only visible to `super_admin`) that writes the `admin_users/<UID>` doc after you create an Auth user.
- Add unit tests or emulator config for local rule testing.
