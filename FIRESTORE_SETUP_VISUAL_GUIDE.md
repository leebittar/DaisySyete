# Firestore Setup Step-by-Step Visual Guide

## How to Access Firebase Console

1. Open: https://console.firebase.google.com/u/0/project/daisysyete-c9511
2. You should see the DaisySyete project
3. Look for the left sidebar with menu options

---

## Step 1: Enable Firebase Authentication

### Navigate to Authentication
```
Left Sidebar:
├── Build (expand if needed)
├── Authentication ← Click here
```

### Enable Email/Password Sign-in

**Current Screen Should Show:**
```
┌─────────────────────────────────────┐
│ Authentication                       │
│                                      │
│ Sign-in method  [← Tab to click]    │
│ Users           [  Inactive tab]    │
│ Templates       [  Inactive tab]    │
└─────────────────────────────────────┘
```

**Click "Sign-in method" Tab, you'll see:**
```
┌──────────────────────────────────────┐
│ Sign-in method                        │
│                                       │
│ ☑ Email/Password    [⚙ settings]    │
│ ☐ Phone            [➕ Add method]   │
│ ☐ Google           [➕ Add method]   │
│ ☐ Facebook         [➕ Add method]   │
│ ☐ GitHub           [➕ Add method]   │
│ ...                                  │
└──────────────────────────────────────┘
```

**Action:** Find "Email/Password"
- If it has a ☑ checkbox (blue) → Already enabled ✅
- If it has a ☐ checkbox (gray) → Click to enable, then Save

**Visual Confirmation:**
```
✅ Email/Password is showing with blue toggle = Enabled

❌ Email/Password is grayed out = Not enabled yet
   Click it, then find the "Save" button at bottom right
```

---

## Step 2: Create admin_users Collection

### Navigate to Firestore Database
```
Left Sidebar:
├── Build
├── Firestore Database ← Click here
```

**Your screen should show:**
```
┌─────────────────────────────────────┐
│ Firestore Database                   │
│                                      │
│ [Data] [Rules] [Backups] [Indexes]  │
│                                      │
│ Collection (Default)                │
│                                      │
│ (Empty database - no collections)   │
│ [+ Start collection] ← Click here   │
└─────────────────────────────────────┘
```

### Start New Collection

**Click "Start collection" button:**
```
Dialog Box Appears:
┌─────────────────────────────────┐
│ Start collection                │
│                                 │
│ Collection ID:                  │
│ ┌─────────────────────────────┐ │
│ │ admin_users                 │ │ ← Type this
│ └─────────────────────────────┘ │
│                                 │
│        [Cancel] [Next] ← Click   │
└─────────────────────────────────┘
```

**Type:** `admin_users` (exactly, lowercase, underscore)

**Click "Next" →**

---

## Step 3: Add First Document (Super Admin)

### Auto-Generate ID Dialog

**Screen shows:**
```
┌──────────────────────────────────────┐
│ Add the first document to...        │
│ admin_users                          │
│                                      │
│ Document ID                          │
│ ◉ Auto-generate ID (selected)       │
│ ○ Custom ID                          │
│                                      │
│      [Cancel] [Save] ← Click        │
└──────────────────────────────────────┘
```

**Select:** "Auto-generate ID" (usually already selected)  
**Click:** "Save"

**Result:** Document created with auto-ID like `kX7pQr2vL9nM`

---

## Step 4: Add Fields to Super Admin Document

### Add Field: email

**Screen shows:**
```
┌──────────────────────────────────────┐
│ Document: kX7pQr2vL9nM               │
│                                      │
│ [+ Add field] ← Click here          │
└──────────────────────────────────────┘
```

**Click "Add field":**
```
New row appears:
┌──────────────────────────────────────┐
│ Field name: [_____________]          │
│ Type:       [String ▼]              │
│ Value:      [_____________]          │
│                                      │
│                    [Save] ← Click   │
└──────────────────────────────────────┘
```

**Fill in:**
- Field name: `email`
- Type: `String` (should be default)
- Value: `super@admin.com`

**Click "Save"** ✓

### Add Field: name

**Click "Add field" again:**
```
┌──────────────────────────────────────┐
│ Field name: [_____________]          │
│ Type:       [String ▼]              │
│ Value:      [_____________]          │
│                                      │
│                    [Save]           │
└──────────────────────────────────────┘
```

**Fill in:**
- Field name: `name`
- Type: `String`
- Value: `Super Administrator`

**Click "Save"** ✓

### Add Field: role

**Click "Add field" again:**
```
- Field name: role
- Type: String
- Value: super_admin
```

**Click "Save"** ✓

### Add Field: isActive

**Click "Add field" again:**
```
┌──────────────────────────────────────┐
│ Field name: [isActive]               │
│ Type:       [Boolean ▼]  ← Click!   │
│ Value:      [true ▼]                │
│                                      │
│                    [Save]           │
└──────────────────────────────────────┘
```

**Fill in:**
- Field name: `isActive`
- Type: **Boolean** (click dropdown and select)
- Value: **true** (select from dropdown)

**Click "Save"** ✓

### Add Field: permissions

**Click "Add field" again:**
```
┌──────────────────────────────────────┐
│ Field name: [permissions]            │
│ Type:       [Array ▼]  ← Click!     │
│ Value:                               │
│   - ["all"]  ← Type array element   │
│                                      │
│                    [Save]           │
└──────────────────────────────────────┘
```

**Fill in:**
- Field name: `permissions`
- Type: **Array** (click dropdown and select)
- Add array element: click "Add element"
  - Type: `all`

**Click "Save"** ✓

### Add Field: createdAt (Optional)

**Click "Add field" again:**
```
- Field name: createdAt
- Type: Timestamp (click dropdown)
- Value: Click calendar → Select today's date
```

**Click "Save"** ✓

### Add Field: department (Optional)

**Click "Add field" again:**
```
- Field name: department
- Type: String
- Value: System Administration
```

**Click "Save"** ✓

---

## Step 5: Verify Your Collection

**Final result should look like:**
```
Firestore Database > Data Tab

admin_users (Collection)
│
└── kX7pQr2vL9nM (Document)
    ├── createdAt: Dec 10, 2024 (timestamp)
    ├── department: "System Administration" (string)
    ├── email: "super@admin.com" (string)
    ├── isActive: true (boolean)
    ├── name: "Super Administrator" (string)
    ├── permissions: ["all"] (array)
    └── role: "super_admin" (string)
```

✅ All 7 fields present
✅ Correct types
✅ Correct values

---

## Step 6: Create Firebase Auth User

### Go to Authentication > Users

**Navigate to:**
```
Left Sidebar:
├── Build
├── Authentication
│   ├── Sign-in method (already done)
│   └── Users ← Click here
```

**Screen shows:**
```
┌──────────────────────────────────────┐
│ Authentication > Users Tab           │
│                                      │
│ [+ Create user] ← Click here        │
│                                      │
│ (No users created yet)               │
└──────────────────────────────────────┘
```

### Create User Dialog

**Click "Create user":**
```
Dialog appears:
┌──────────────────────────────────────┐
│ Create user                          │
│                                      │
│ Email:    [____________________]    │
│           super@admin.com ← Type   │
│                                      │
│ Password: [____________________]    │
│           [strong password] ← Type  │
│                                      │
│ □ Auto-generate password            │
│                                      │
│  [Cancel] [Create user]             │
└──────────────────────────────────────┘
```

**Fill in:**
- Email: `super@admin.com` (MUST MATCH Firestore document!)
- Password: (strong password, e.g., `SuperAdmin@2024!`)

**Click "Create user"** ✓

**Result:**
```
User created successfully!

User:  super@admin.com
UID:   (randomly generated)
Created: Just now

Close this dialog
```

---

## Step 7: Update Firestore Security Rules

### Go to Firestore Rules

**Navigate to:**
```
Left Sidebar:
├── Build
├── Firestore Database
└── Rules tab ← Click here
```

**Screen shows:**
```
┌──────────────────────────────────────┐
│ Firestore Database > Rules           │
│                                      │
│ [Current Rules Code]                │
│ (Default rules that allow all)      │
│                                      │
│ rules_version = '2';                │
│ service cloud.firestore {           │
│   match /databases/{database}/...   │
│   ...                               │
│ }                                   │
│                                      │
│                    [Publish]        │
└──────────────────────────────────────┘
```

### Replace with Security Rules

**Select ALL existing text (Ctrl+A)**

**Delete**

**Paste this code:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow anyone to read survey_responses
    match /survey_responses/{document=**} {
      allow read: if true;
      allow write: if false;
    }

    // Only authenticated admin users can access admin_users
    match /admin_users/{document=**} {
      allow read, write: if request.auth != null;
    }

    // Questions collection
    match /survey_questions/{document=**} {
      allow read: if true;
      allow write: if false;
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Visual Check:**
```
┌──────────────────────────────────────┐
│ Rules Code:                          │
│                                      │
│ rules_version = '2';                │
│ service cloud.firestore {           │
│   match /admin_users/{document=**}  │
│     allow read, write: if...        │
│   ...                               │
│ }                                   │
│                                      │
│ ✓ Code visible in editor            │
│                                      │
│                    [Publish]        │
└──────────────────────────────────────┘
```

### Publish Rules

**Click "Publish" button**

**Confirmation message:**
```
✅ Rules published successfully

Your Firestore security rules are now live.
```

✓ Rules are published

---

## Step 8: Test Login

### Open Admin Login Page

1. Open: `admin.html` in your browser
2. You should see the login form:

```
┌─────────────────────────────────────┐
│        [ARTA CSS System Image]      │
│                                      │
│              Log In                 │
│                                      │
│ Email:    [super@admin.com____]    │
│ Password: [_______________]         │
│ [Forgot password?]                 │
│                                      │
│ [         Log In        ]           │
└─────────────────────────────────────┘
```

### Test Successful Login

**Enter:**
- Email: `super@admin.com`
- Password: (the one you set)

**Click "Log In"**

**Expected Result:**
```
Loading overlay appears (1 second)
↓
"Welcome, Super Administrator!" message
↓
Dashboard loads (you see analytics)
```

✅ Login successful!

### Test Error Cases

**Test 1: Wrong Password**
- Email: `super@admin.com`
- Password: `wrongpassword`
- Click "Log In"
- Should see: "Incorrect password."
- Password field should have red border ✓

**Test 2: Invalid Email**
- Email: `notanemail`
- Password: `anything`
- Click "Log In"
- Should see: "Please enter a valid email address"
- Email field should have red border ✓

**Test 3: Non-existent Email**
- Email: `fake@example.com`
- Password: `password123`
- Click "Log In"
- Should see: "Email not found. Invalid credentials."
- Password field should have red border ✓

---

## Troubleshooting Visual Guide

### Issue: Login fails with "Invalid credentials"

**Checklist:**
```
1. Check email in form: super@admin.com ✓
2. Check email in Firebase Auth users: super@admin.com ✓
3. Check email in Firestore document: super@admin.com ✓
4. All THREE must match exactly!

If mismatch:
   Firebase: super@admin.com
   Firestore: superadmin@example.com  ← WRONG!
   
   Fix: Update one to match the other
```

### Issue: "You are not authorized as an admin"

**Checklist:**
```
1. admin_users collection exists? ✓
2. Document with matching email exists? ✓
3. Document has "role" field? ✓
4. Role value is "super_admin" or "admin"? ✓
5. isActive field is true? ✓

If missing any:
   Add the missing field to Firestore document
```

### Issue: Can't find Firestore Rules tab

**Solution:**
```
You should be in:
Firestore Database > [Data] [Rules] [Backups]
                            ↑ Click this tab

NOT in:
Project Settings > Rules
(Wrong place!)
```

---

## Visual Summary: Complete Setup

```
✅ Step 1: Firebase Auth enabled
   Authentication > Sign-in Method > Email/Password (enabled)

✅ Step 2: admin_users collection created
   Firestore > Collections > admin_users

✅ Step 3: Super admin document added
   admin_users/[Auto-ID]
   └── 7 fields with correct values

✅ Step 4: Firebase Auth user created
   Authentication > Users > super@admin.com

✅ Step 5: Security Rules updated
   Firestore > Rules > Published

✅ Step 6: Login tested
   admin.html > super@admin.com / password > Works! ✓
```

---

## After Setup: What You Should See

### In Firebase Console

**Authentication > Users Tab:**
```
Users:
├── super@admin.com
│   ├── UID: (auto-generated)
│   ├── Created: Today
│   └── Last sign in: (empty until first login)
```

**Firestore > Data Tab:**
```
Collections:
└── admin_users
    └── [Document ID]
        ├── email: "super@admin.com"
        ├── name: "Super Administrator"
        ├── role: "super_admin"
        ├── isActive: true
        ├── permissions: ["all"]
        ├── department: "System Administration"
        └── createdAt: (timestamp)
```

### In Admin Dashboard

**After logging in:**
```
┌─────────────────────────────────┐
│ [Logo] ARTA Customer Satisfaction│
│ [Admin Profile ▼]               │
│                                 │
│ Sidebar with:                   │
│ Dashboard  (highlighted)        │
│ Raw Responses                   │
│ Compliance Reports              │
│ Manage Questions                │
│ User Management                 │
│ System Settings                 │
│                                 │
│ [Main content area]             │
└─────────────────────────────────┘
```

✅ Setup complete and working!

