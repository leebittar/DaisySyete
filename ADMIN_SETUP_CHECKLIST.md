# Firebase Admin Setup Checklist

## Pre-Setup Checklist
- [ ] Have access to Firebase Console (daisysyete-c9511 project)
- [ ] Know where to store admin passwords (password manager)
- [ ] Have admin email addresses ready
- [ ] Read the ADMIN_AUTHENTICATION_SETUP.md guide

---

## Firebase Console Setup

### Authentication Setup
- [ ] Go to https://console.firebase.google.com/u/0/project/daisysyete-c9511/authentication/
- [ ] Click "Sign-in method"
- [ ] Find "Email/Password"
- [ ] Click the toggle to enable it
- [ ] Click "Save"

### Create admin_users Collection
- [ ] Go to Firestore Database
- [ ] Click "Start Collection"
- [ ] Collection ID: `admin_users`
- [ ] Auto-generate first document ID
- [ ] Click "Next"

### Add Super Admin Document
**Document Fields (Copy-Paste Values):**

| Field | Value |
|-------|-------|
| email | super@admin.com |
| name | Super Administrator |
| role | super_admin |
| isActive | true (boolean) |
| permissions | ["all"] (array) |

- [ ] Click "Save"

### Create Firebase Auth User
- [ ] Go back to Authentication > Users tab
- [ ] Click "Create user" button
- [ ] Email: `super@admin.com`
- [ ] Password: [Enter strong password - save this!]
- [ ] Click "Create user"

### Update Firestore Rules
- [ ] Go to Firestore Database > Rules tab
- [ ] Replace existing rules with the code from ADMIN_AUTHENTICATION_SETUP.md
- [ ] Click "Publish"
- [ ] Confirm the publish

---

## Code Verification

### admin.html Updates
- [ ] Email field includes error div: `<div id="emailError" ...>`
- [ ] Password field includes error div: `<div id="passwordError" ...>`
- [ ] Login error div: `<div id="loginError" ...>`
- [ ] Email field shows red border on error
- [ ] Password field shows red border on error

### JavaScript Validation
- [ ] validateAdminLogin() function exists
- [ ] isValidEmail() function exists
- [ ] showFieldError() function exists
- [ ] clearLoginErrors() function exists
- [ ] Input event listeners added for auto-clear

---

## Testing Checklist

### Successful Login Test
1. [ ] Open admin login page
2. [ ] Enter email: `super@admin.com`
3. [ ] Enter password: [the one you created]
4. [ ] Click "Log In"
5. [ ] Should see success message
6. [ ] Should redirect to dashboard

### Error Validation Tests

**Test Empty Fields:**
- [ ] Clear email field, try to submit → "Email is required"
- [ ] Clear password field, try to submit → "Password is required"
- [ ] Field turns red when error shown
- [ ] Error clears when you start typing

**Test Invalid Email Format:**
- [ ] Enter: `notanemail`
- [ ] Click submit → "Please enter a valid email address"
- [ ] Field shows red border
- [ ] Error clears when editing

**Test Short Password:**
- [ ] Enter any email
- [ ] Enter: `12345` (less than 6 chars)
- [ ] Click submit → "Password must be at least 6 characters"
- [ ] Field shows red border

**Test Wrong Email:**
- [ ] Enter: `fake@example.com`
- [ ] Enter correct password
- [ ] Click submit → "Email not found. Invalid credentials."

**Test Wrong Password:**
- [ ] Enter: `super@admin.com`
- [ ] Enter: `wrongpassword`
- [ ] Click submit → "Incorrect password."

**Test Non-Admin User:**
- [ ] Create regular Firebase Auth user (without admin_users doc)
- [ ] Try to login with that email
- [ ] Should see: "You are not authorized as an admin."

**Test Disabled Admin:**
- [ ] In Firestore, set `isActive` to `false` for super admin
- [ ] Try to login
- [ ] Should see: "Your admin account is inactive..."
- [ ] Set `isActive` back to `true`

---

## Adding More Admins (Optional)

For each new admin:

### In Firebase Console
1. [ ] Go to Authentication > Users
2. [ ] Click "Create user"
3. [ ] Email: [admin email]
4. [ ] Password: [strong password]
5. [ ] Save credentials

### In Firestore
1. [ ] Open admin_users collection
2. [ ] Add new document
3. [ ] Add fields:
   - email: [same email from Firebase]
   - name: [Full name]
   - role: admin (or other role)
   - isActive: true
   - permissions: [select appropriate array]

---

## Security Checklist

- [ ] Never commit passwords to git
- [ ] Don't share super admin credentials
- [ ] Regularly audit admin_users collection
- [ ] Disable unused admin accounts
- [ ] Review Firebase Rules are correct
- [ ] Test that non-admin users can't login
- [ ] Enable 2FA in Firebase Console (optional but recommended)

---

## Troubleshooting Reference

| Problem | Solution |
|---------|----------|
| Login always fails with "Invalid credentials" | 1. Check Firebase Auth user exists 2. Verify email spelling 3. Check browser console |
| "You are not authorized" error | 1. Check admin_users document exists 2. Verify email matches exactly 3. Check role field exists |
| Fields not turning red on error | Check that classes include `border-red-500` styling |
| Errors not showing below fields | Check div IDs match: emailError, passwordError, loginError |
| Can't find Firestore Rules | Go to Firestore > Rules tab (not Settings) |
| Firebase config errors | Check API keys in console match config in admin.html |

---

## Next Steps After Setup

1. [ ] Test all login scenarios above
2. [ ] Create 2-3 additional admin accounts
3. [ ] Test admin features in dashboard
4. [ ] Set up password reset process with team
5. [ ] Document admin credentials securely
6. [ ] Inform team members of their login info
7. [ ] Monitor first logins

---

## Files Modified

- `admin.html` - Login form with complete validation
- Created: `ADMIN_AUTHENTICATION_SETUP.md` - Full setup guide
- Created: `ADMIN_AUTH_QUICK_SETUP.md` - Quick reference

---

## Support

If you encounter issues:
1. Check the ADMIN_AUTHENTICATION_SETUP.md guide
2. Review browser console for error messages
3. Verify Firestore collection and fields exist
4. Ensure Firebase Authentication is enabled
5. Confirm Firestore Rules are published

---

**Setup Complete When:**
✅ Super admin can login successfully
✅ Non-admin user gets error
✅ Invalid credentials show appropriate errors
✅ Fields turn red on errors
✅ Errors clear when typing
✅ Dashboard loads after successful login

