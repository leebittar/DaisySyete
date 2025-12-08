# Quick Start - Admin Question Management

## 🚀 One-Minute Setup

1. Open **admin.html** in browser
2. Login: `super@admin.com` / `password123`
3. Go to **Manage Questions** tab
4. See all 12 survey questions from survey.html
5. Edit, add, or delete as needed
6. Changes automatically sync to survey.html

---

## ✨ What's New

### View Current Questions
- All 12 questions from survey.html automatically appear
- 9 SQD (Service Quality) + 3 CC (Citizen's Charter)
- Shows type and required status

### Edit Questions
- Click **EDIT** button on any question
- Modify text, type, or required status
- Click **Save Changes**
- ✅ Updates appear in survey.html

### Add Questions
- Click **Add CGOV Question** button
- Fill form (code, text, type, required)
- Click **Add**
- ✅ Appears in survey.html

### Delete Questions
- Click **trash icon**
- Confirm deletion
- ✅ Removed from survey.html

---

## 📊 Example: Edit SQD0

**Before:**
```
"I am satisfied with the service that I availed."
```

**In Admin:**
1. Manage Questions tab
2. Find SQD0
3. Click EDIT
4. Change to: "I am very satisfied with the service that I availed."
5. Click Save Changes

**After:**
- ✅ Admin dashboard shows new text
- ✅ survey.html shows new text (reload needed)

---

## 🔄 How Changes Sync

```
Admin edits question
        ↓
Updates in-memory array
        ↓
Saves to browser localStorage
        ↓
survey.html loads and checks localStorage
        ↓
renderSQDQuestions() uses updated questions
        ↓
Users see new questions in survey form
```

---

## 🧪 Test It

1. **Edit a question in admin**
   - Go to Manage Questions
   - Edit SQD0 text
   - Save

2. **Check survey.html**
   - Open survey.html in new tab
   - Go to SQD questions section
   - Verify edited question appears

3. **Refresh both pages**
   - Changes persist in localStorage
   - No page reload needed for admin
   - survey.html needs refresh to see changes

---

## 📁 Files Changed

| File | Change |
|------|--------|
| `admin.html` | CRUD functions save to localStorage |
| `script.js` | Loads questions from localStorage at startup |

---

## 💾 Data Storage

Questions stored in browser `localStorage`:
- `sqdQuestions` - Question strings (for renderSQDQuestions)
- `allSurveyQuestions` - Full question objects (for admin)

Persists across page refreshes.

---

## ⚙️ Current Questions

### SQD (Service Quality) - 9 Questions
- SQD0 through SQD8
- Likert scale 1-5 in survey

### CC (Citizen's Charter) - 3 Questions
- CC1, CC2, CC3
- Multiple choice options in survey

---

## 🆘 Troubleshooting

| Issue | Fix |
|-------|-----|
| Questions don't load | Reload admin.html page |
| Changes not in survey.html | Reload survey.html (F5) |
| Forgot what changed | Check localStorage in DevTools |
| Want defaults back | Clear localStorage, reload |

---

## 🎯 Key Points

✅ Questions load from survey.html automatically
✅ Edit/add/delete works instantly in admin
✅ Changes save to localStorage (persist on refresh)
✅ survey.html auto-loads updated questions
✅ No manual sync needed
✅ Works across browser tabs

---

**Status**: Ready to Use! 🎉
