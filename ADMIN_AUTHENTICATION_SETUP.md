# Admin Authentication Setup Guide

## Overview
This guide explains how to set up Firebase Authentication and Firestore roles for the admin dashboard login system.

---

## Step 1: Set Up Firebase Authentication

### 1.1 Enable Email/Password Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `daisysyete-c9511`
3. Navigate to **Build > Authentication**
4. Click on **Sign-in method** tab
5. Click on **Email/Password**
6. Enable **Email/Password** authentication
7. Save changes

---

## Step 2: Create Admin Users Collection in Firestore

### 2.1 Create the `admin_users` Collection

1. Go to **Build > Firestore Database**
2. Click **Start Collection**
3. Collection name: `admin_users`
4. Click **Next**

### 2.2 Add First Document (Super Admin)

1. Document ID: Use the Firebase Authentication user's UID (recommended). If you used an auto-generated or custom ID previously, you may need to update the document ID to match the user's UID so Firestore security rules can validate the authenticated user.

   How to get the user UID:

   - Firebase Console → Authentication → Users → find the user (e.g. `super@admin.com`) → copy the `UID` value.
   - When creating the `admin_users` document, paste the UID as the **Document ID**.
   - Example Document ID: `p2c3d4e5f6g7h8i9j0k...` (the UID string shown in the Users table)
2. Add the following fields:

```
Field Name          | Type      | Value
--------------------|-----------|------------------------------------------
email               | string    | super@admin.com
name                | string    | Super Administrator
role                | string    | super_admin
password            | string    | (Leave empty - Firebase handles this)
isActive            | boolean   | true
createdAt           | timestamp | (Set to current date)
permissions         | array     | ["all"]
department          | string    | System Administration
lastLogin           | timestamp | (Empty initially)
```

**Example Document Structure:**
```
{
   "email": "super@admin.com",
   "name": "Super Administrator",
   "role": "super_admin",
   "isActive": true,
   "createdAt": "2024-12-10T10:00:00Z",
   "permissions": ["all"],
   "department": "System Administration",
   "lastLogin": ""
}
```

Notes:
- If your `admin_users` documents are keyed by auto-generated IDs (or a name like `super_admin_001`), your current Firestore rules (which check `exists(.../admin_users/$(request.auth.uid))`) will block reads — update the document ID to the user's UID or adjust rules accordingly.
- The recommended, secure approach is: create the Firebase Auth user first, copy their UID, then create the `admin_users` document with that UID as the document ID.

---

## Step 3: Create Firebase Authentication User

### 3.1 Create Super Admin User in Firebase Auth

1. Stay in **Authentication** section
2. Go to **Users** tab
3. Click **Create user**
4. Email: `super@admin.com`
5. Password: Create a strong password (e.g., `SuperAdmin@2024!`)
6. Click **Create user**

**Note:** This password must match what you set in Firebase. Users will authenticate with Firebase Authentication service.

---

## Step 4: Create Security Rules for Firestore

### 4.1 Set Up Firestore Security Rules

1. Go to **Build > Firestore Database**
2. Click on **Rules** tab
3. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow anyone to read survey_responses (for guest access)
    match /survey_responses/{document=**} {
      allow read: if true;
      allow write: if false; // Only server writes
    }

    // Only authenticated admin users can access admin_users collection
    match /admin_users/{document=**} {
      allow read: if request.auth != null && 
                     exists(/databases/$(database)/documents/admin_users/$(request.auth.uid));
      allow write: if request.auth.uid != null &&
                      get(/databases/$(database)/documents/admin_users/$(request.auth.uid)).data.role == 'super_admin';
    }

    // Questions collection
    match /survey_questions/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null &&
                      get(/databases/$(database)/documents/admin_users/$(request.auth.uid)).data.role in ['super_admin', 'questions_manager'];
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. Click **Publish**

---

## Step 5: Add More Admin Users (Optional)

### 5.1 Create New Admin Users

To add new admin users with different roles:

1. **In Firebase Authentication:**
   - Go to Users tab
   - Click Create user
   - Email: `admin_user@example.com`
   - Password: Set a password
   - Click Create user

2. **In Firestore (admin_users collection):**
   - Click **Add document**
   - Document ID: Can be auto-generated
   - Add fields:

```json
{
  "email": "admin_user@example.com",
  "name": "Admin User Name",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-12-10",
  "permissions": [
    "view_responses",
    "export_data",
    "manage_questions"
  ],
  "department": "Data Management",
  "lastLogin": ""
}
```

---

## Step 6: Admin Roles Reference

### Available Roles:

| Role | Description | Permissions |
|------|-------------|-------------|
| `super_admin` | Full system access | All |
| `admin` | Standard admin | view_responses, export_data, manage_questions |
| `questions_manager` | Only manage questions | manage_questions, view_responses |
| `reports_viewer` | View reports only | view_responses, export_data |

---

## Step 7: Login Validation Flow

### How Login Works:

1. **User enters email & password**
   - Frontend validates format
   - Shows error under field if invalid

2. **Firebase Authentication**
   - `signInWithEmailAndPassword()` is called
   - Firebase verifies credentials
   - Returns user if valid, throws error if invalid

3. **Firestore Admin Check**
   - System queries `admin_users` collection
   - Searches for document with matching email
   - Verifies user has admin role
   - Checks if `isActive` is `true`

4. **Session Storage**
   - On success: Stores user data in sessionStorage
   - User can now access dashboard
   - Session expires when browser tab closes

---

## Step 8: Error Messages Shown

The login form will display specific error messages:

| Scenario | Error Message |
|----------|---------------|
| Empty email field | "Email is required" |
| Invalid email format | "Please enter a valid email address" |
| Empty password | "Password is required" |
| Password too short | "Password must be at least 6 characters" |
| Email not in Firebase Auth | "Email not found. Invalid credentials." |
| Wrong password | "Incorrect password." |
| Email not in admin_users | "You are not authorized as an admin." |
| isActive is false | "Your admin account is inactive. Contact super admin." |
| Too many failed attempts | "Too many failed login attempts. Try again later." |

---

## Step 9: Field Validation Features

### Visual Feedback:

1. **Red Border:** Input field shows red border when error occurs
2. **Error Message:** Displays below input field
3. **Auto-clear:** Errors disappear when user starts typing
4. **Real-time Validation:** Frontend validates before sending to Firebase

### Input Fields Validated:

- ✅ Email format (must be valid email)
- ✅ Password length (minimum 6 characters)
- ✅ Required fields
- ✅ Firebase authentication response
- ✅ Admin role verification

---

## Step 10: Testing

### Test Super Admin Login:

1. Open admin.html
2. Enter email: `super@admin.com`
3. Enter password: (the password you set)
4. Click Log In
5. Should see success message and access dashboard

### Test Error States:

1. **Invalid Email Format:**
   - Enter: `notanemail`
   - See: "Please enter a valid email address"

2. **Wrong Password:**
   - Enter: `super@admin.com` / `wrongpassword`
   - See: "Incorrect password."

3. **Non-Admin Email:**
   - Create a Firebase user without admin_users record
   - See: "You are not authorized as an admin."

---

## Step 11: Managing Admin Accounts

### Disable an Admin:

1. Go to **Firestore > admin_users collection**
2. Find the admin document
3. Set `isActive` to `false`
4. They can no longer log in

### Change Admin Role:

1. Go to **Firestore > admin_users collection**
2. Find the admin document
3. Update the `role` field
4. Changes apply on next login

### Delete Admin:

1. Go to **Authentication > Users**
2. Click the three dots next to user
3. Click **Delete user**
4. Go to **Firestore > admin_users**
5. Delete the corresponding document

---

## Security Best Practices

✅ **Do:**
- Use strong passwords (minimum 8 characters recommended)
- Enable 2FA in Firebase Console
- Regularly audit admin_users collection
- Disable inactive admin accounts
- Use environment variables for sensitive data
- Monitor login attempts

❌ **Don't:**
- Share super admin credentials
- Store passwords in code
- Use generic passwords like "password123"
- Leave unused admin accounts active
- Commit Firebase config to git without rules

---

## Firestore Collection Structure

```
daisysyete-c9511 (Project)
├── survey_responses (Public Read)
│   └── [response documents]
├── survey_questions (Public Read, Admin Write)
│   └── [question documents]
├── admin_users (Admin Only)
│   ├── super_admin_001
│   │   ├── email: "super@admin.com"
│   │   ├── name: "Super Administrator"
│   │   ├── role: "super_admin"
│   │   ├── isActive: true
│   │   ├── permissions: ["all"]
│   │   └── ...
│   └── [other admin users]
```

---

## Troubleshooting

### Issue: "You are not authorized as an admin"
**Solution:** Check if admin_users document exists with matching email

### Issue: "Invalid email or password"
**Solution:** Verify Firebase Auth user exists with that email

### Issue: Login always fails
**Solution:** 
1. Check Firebase rules are published
2. Verify Firestore collections exist
3. Check browser console for errors
4. Ensure Firebase config is correct

### Issue: Can't reset admin password
**Solution:** 
1. Go to Firebase Auth
2. Select the user
3. Use "Reset Password" option
4. Send reset email to admin

---

## Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Console](https://console.firebase.google.com/u/0/project/daisysyete-c9511)

