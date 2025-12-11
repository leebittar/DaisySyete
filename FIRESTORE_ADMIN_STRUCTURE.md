# Firestore Admin Collection Visual Guide

## How to Create in Firebase Console

### Step-by-Step Screenshots Guide

```
FIREBASE CONSOLE
└── daisysyete-c9511 (Project)
    └── Build
        └── Firestore Database
            └── Start Collection
                └── Collection ID: admin_users
                    └── Document: (Auto or Manual ID)
```

---

## Collection: admin_users

### Structure Diagram

```
admin_users/
├── super_admin_001 (Document)
│   ├── email (string): "super@admin.com"
│   ├── name (string): "Super Administrator"
│   ├── role (string): "super_admin"
│   ├── isActive (boolean): true
│   ├── createdAt (timestamp): 2024-12-10
│   ├── permissions (array): ["all"]
│   ├── department (string): "System Administration"
│   └── lastLogin (timestamp): (empty)
│
├── admin_user_001 (Document)
│   ├── email (string): "admin@example.com"
│   ├── name (string): "John Doe"
│   ├── role (string): "admin"
│   ├── isActive (boolean): true
│   ├── createdAt (timestamp): 2024-12-10
│   ├── permissions (array): ["view_responses", "manage_questions"]
│   ├── department (string): "Data Management"
│   └── lastLogin (timestamp): 2024-12-10
│
└── questions_manager_001 (Document)
    ├── email (string): "questions@example.com"
    ├── name (string): "Jane Smith"
    ├── role (string): "questions_manager"
    ├── isActive (boolean): true
    ├── createdAt (timestamp): 2024-12-10
    ├── permissions (array): ["manage_questions"]
    ├── department (string): "Question Management"
    └── lastLogin (timestamp): (empty)
```

---

## Field Explanations

### email (string)
**What it is:** The login email address  
**Must match:** Firebase Authentication user email  
**Format:** valid@email.com  
**Example:** super@admin.com

### name (string)
**What it is:** Display name of the admin  
**Used for:** Welcome messages, audit logs  
**Example:** Super Administrator

### role (string)
**What it is:** Admin access level  
**Valid values:**
- `super_admin` - Full system access
- `admin` - Standard admin access
- `questions_manager` - Only manage questions
- `reports_viewer` - Only view reports

### isActive (boolean)
**What it is:** Whether admin can login  
**Values:**
- `true` - Can login
- `false` - Cannot login (disabled account)
**Use:** Deactivate accounts instead of deleting

### createdAt (timestamp)
**What it is:** Account creation date  
**Format:** Firestore timestamp  
**Why needed:** Audit trail, account history

### permissions (array)
**What it is:** List of allowed actions  
**Examples:**
```
["all"] - Super admin (all permissions)
["view_responses", "manage_questions"] - Standard admin
["manage_questions"] - Questions manager
["view_responses", "export_data"] - Reports viewer
```

### department (string)
**What it is:** Which department admin belongs to  
**Optional:** Yes  
**Examples:**
- "System Administration"
- "Data Management"
- "Question Management"
- "Compliance Reports"

### lastLogin (timestamp)
**What it is:** Last successful login time  
**Auto-updated:** Yes (on successful login)  
**Initially:** Empty  
**Used for:** Security audits, activity tracking

---

## Complete Document Examples

### Super Admin Document
```json
{
  "email": "super@admin.com",
  "name": "Super Administrator",
  "role": "super_admin",
  "isActive": true,
  "createdAt": timestamp(2024, 12, 10),
  "permissions": ["all"],
  "department": "System Administration",
  "lastLogin": "" (empty initially)
}
```

### Standard Admin Document
```json
{
  "email": "admin@valenzuela.gov.ph",
  "name": "Maria Santos",
  "role": "admin",
  "isActive": true,
  "createdAt": timestamp(2024, 12, 10),
  "permissions": ["view_responses", "manage_questions", "export_data"],
  "department": "Data Management",
  "lastLogin": "" (empty initially)
}
```

### Questions Manager Document
```json
{
  "email": "questions_manager@valenzuela.gov.ph",
  "name": "Carlos Reyes",
  "role": "questions_manager",
  "isActive": true,
  "createdAt": timestamp(2024, 12, 10),
  "permissions": ["manage_questions", "view_responses"],
  "department": "Survey Questions",
  "lastLogin": "" (empty initially)
}
```

### Disabled Admin (Example)
```json
{
  "email": "oldadmin@example.com",
  "name": "Inactive User",
  "role": "admin",
  "isActive": false,  // ← Cannot login when false
  "createdAt": timestamp(2024, 11, 01),
  "permissions": ["view_responses"],
  "department": "Archived",
  "lastLogin": timestamp(2024, 11, 15)
}
```

---

## Field Types in Firestore

| Type | Example | How to Select in Console |
|------|---------|------------------------|
| string | "super@admin.com" | Select "String" from dropdown |
| boolean | true / false | Select "Boolean" from dropdown |
| array | ["all"] or ["item1", "item2"] | Select "Array" from dropdown |
| timestamp | 2024-12-10T10:30:00Z | Select "Timestamp" from dropdown |

---

## Adding Documents Step-by-Step

### In Firebase Console:

1. **Click "Add Document"**
   ```
   admin_users collection
   └── [+ Add document] ← Click here
   ```

2. **Choose Document ID**
   - Option A: Auto ID (recommended)
   - Option B: Custom ID (e.g., "super_admin_001")

3. **Add Fields One by One**
   - Click "Add field"
   - Field name: email
   - Type: String
   - Value: super@admin.com
   - Click "Save"

4. **Repeat for Each Field**
   - name (String)
   - role (String)
   - isActive (Boolean)
   - createdAt (Timestamp)
   - permissions (Array)
   - department (String)
   - lastLogin (Array or String)

---

## Array Field Format

### For permissions array:

In Firebase Console:
1. Field name: `permissions`
2. Type: `Array`
3. Array elements: (add each one)
   - Element 1: `all` or `view_responses` etc.
   - Element 2: (if multiple)

**Or paste JSON format:**
```javascript
["all"]
["view_responses", "manage_questions"]
```

---

## Timestamp Field Format

### For createdAt and lastLogin:

In Firebase Console:
1. Field name: `createdAt`
2. Type: `Timestamp`
3. Click the calendar icon
4. Select date and time
5. Save

**Current timestamp example:**
```
December 10, 2024 at 2:30:45 PM UTC
```

---

## Visual Walkthrough: Creating Super Admin

### Screen 1: Collections View
```
┌─────────────────────────────────────┐
│ admin_users (Collection)             │
│                                      │
│  [+ Add document]  [⋯]              │
│                                      │
│  (No documents yet)                 │
└─────────────────────────────────────┘
```

### Screen 2: Add Document Dialog
```
┌──────────────────────────────────────┐
│ Start collection                      │
│                                       │
│ Document ID:                          │
│ [Auto-generate ID] ◉  (selected)     │
│ [Custom ID]       ○                   │
│                                       │
│              [Cancel] [Save]         │
└──────────────────────────────────────┘
```

### Screen 3: Add Fields
```
┌──────────────────────────────────────┐
│ Document (Auto-generated ID)          │
│                                       │
│ Field 1: email (String)              │
│ Value: super@admin.com               │
│ ✓ Save                               │
│                                       │
│ [+ Add field]                        │
│                                       │
│ Field 2: name (String)               │
│ Value: Super Administrator            │
│ ✓ Save                               │
│                                       │
│ [+ Add field]                        │
│ ... (continue for all fields)        │
└──────────────────────────────────────┘
```

### Screen 4: Complete Document
```
admin_users
└── kX7pQr2vL9nM (Auto-generated ID)
    ├── email (string): "super@admin.com"
    ├── name (string): "Super Administrator"
    ├── role (string): "super_admin"
    ├── isActive (boolean): true
    ├── createdAt (timestamp): Dec 10, 2024
    ├── permissions (array): ["all"]
    ├── department (string): "System Admin"
    └── lastLogin (string): ""
```

---

## Common Mistakes to Avoid

❌ **Wrong:** Field name has typo
```
"emial" instead of "email"  ← Login will fail!
```

✅ **Right:** Match exactly
```
"email"  ← Matches Firebase Auth email
```

---

❌ **Wrong:** Email doesn't match Firebase
```
Firebase Auth: super@admin.com
Firestore: superadmin@example.com  ← Won't match!
```

✅ **Right:** Identical emails
```
Firebase Auth: super@admin.com
Firestore: super@admin.com  ← Perfect!
```

---

❌ **Wrong:** Boolean as string
```
"isActive": "true"  ← Wrong type!
```

✅ **Right:** Boolean value
```
"isActive": true  ← Correct!
```

---

❌ **Wrong:** Permissions as object
```
"permissions": {
  "all": true  ← Wrong structure!
}
```

✅ **Right:** Permissions as array
```
"permissions": ["all"]  ← Correct!
```

---

## Security Rules Check

Your Firestore Rules should include:
```javascript
match /admin_users/{document=**} {
  allow read, write: if request.auth != null;
}
```

This ensures:
- Only authenticated users can access
- Admins can read/write their own data
- Privacy is maintained

---

## Verification Checklist

After creating the collection:

- [ ] Collection name is exactly: `admin_users`
- [ ] Super admin document has email: `super@admin.com`
- [ ] Email field name is: `email` (not "emial" or "Email")
- [ ] Role field is: `super_admin`
- [ ] isActive field is: `true` (boolean, not string)
- [ ] Permissions array contains: `["all"]`
- [ ] Firebase Auth user exists with same email
- [ ] Firestore Rules are published
- [ ] Firebase Authentication is enabled

---

## Quick Reference: What Goes Where

```
FIREBASE AUTHENTICATION
├── Users Tab
│   └── Create User
│       ├── Email: super@admin.com
│       └── Password: [strong password]
│
FIRESTORE DATABASE
├── Collections
│   └── admin_users
│       └── Document
│           ├── email: super@admin.com
│           ├── role: super_admin
│           ├── isActive: true
│           └── ... (other fields)
```

These TWO places must have matching emails!

