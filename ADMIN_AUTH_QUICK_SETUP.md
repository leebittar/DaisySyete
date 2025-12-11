# Firebase Admin Setup Quick Reference

## Quick Setup (5 Minutes)

### 1. Enable Firebase Auth
- Firebase Console > Authentication > Sign-in Method
- Enable Email/Password
- Publish

### 2. Create `admin_users` Collection
- Firestore > Start Collection > `admin_users`

### 3. Add Super Admin Document
```json
{
  "email": "super@admin.com",
  "name": "Super Administrator",
  "role": "super_admin",
  "isActive": true,
  "createdAt": "2024-12-10",
  "permissions": ["all"]
}
```

### 4. Create Firebase User
- Authentication > Create User
- Email: super@admin.com
- Password: (your strong password)

### 5. Update Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /admin_users/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /survey_responses/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Login Form Features

### Validation:
- ✅ Email format check (before sending to Firebase)
- ✅ Password length (min 6 chars)
- ✅ Required field check
- ✅ Firebase authentication verification
- ✅ Admin role check in Firestore
- ✅ Active status verification

### Error Display:
- Red border on invalid fields
- Error message below each field
- Clears on user input
- Loading overlay during login

### Supported Error Messages:
```
"Email is required"
"Please enter a valid email address"
"Password is required"
"Password must be at least 6 characters"
"Email not found. Invalid credentials."
"Incorrect password."
"You are not authorized as an admin."
"Your admin account is inactive. Contact super admin."
"Too many failed login attempts. Try again later."
```

---

## Database Schema

### admin_users Collection Fields:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| email | string | Yes | Unique, matches Firebase Auth |
| name | string | Yes | Display name |
| role | string | Yes | super_admin, admin, etc. |
| isActive | boolean | Yes | Set to false to disable |
| createdAt | timestamp | No | When account created |
| permissions | array | No | List of allowed actions |
| department | string | No | For organization |
| lastLogin | timestamp | No | Auto-updated on login |

---

## Adding More Admins

### Step 1: Firebase Auth
```
Email: admin@example.com
Password: (strong password)
```

### Step 2: Firestore Document
```json
{
  "email": "admin@example.com",
  "name": "Admin Name",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-12-10",
  "permissions": ["view_responses", "manage_questions"]
}
```

---

## Disable Admin

Change `isActive` to `false` in Firestore document

---

## Reset Admin Password

Firebase Console > Authentication > Select User > Reset Password

---

## Login Flow Diagram

```
User enters credentials
    ↓
Frontend validates format
    ↓
Firebase signInWithEmailAndPassword()
    ↓
Query Firestore admin_users
    ↓
Check role and isActive
    ↓
Success → Store session → Show dashboard
    ↓
Fail → Show error → Highlight field
```

---

## File Modified

- `/admin.html` - Login form with validation and Firebase auth

---

## Test Credentials

After setup:
- Email: super@admin.com
- Password: (your set password)

