# Admin Question Management - Implementation Guide

## Overview

You can now manage survey questions directly in the Admin Dashboard. Any changes you make (edit, add, delete) will automatically sync with the survey.html form that users see.

## How It Works

### Question Data Flow

```
┌─────────────────────────────────┐
│   script.js                     │
│   (SQD Questions Array)         │
└────────────────┬────────────────┘
                 │
                 │ Loaded at startup
                 │
                 ▼
┌─────────────────────────────────┐
│   Admin Dashboard (admin.html)  │
│   - Load questions              │
│   - Edit questions              │
│   - Add questions               │
│   - Delete questions            │
└────────────────┬────────────────┘
                 │
         Save to localStorage
                 │
                 ▼
┌─────────────────────────────────┐
│   Browser localStorage          │
│   - sqdQuestions                │
│   - allSurveyQuestions          │
└────────────────┬────────────────┘
                 │
                 │ Load on page open
                 │
                 ▼
┌─────────────────────────────────┐
│   Survey Form (survey.html)     │
│   - Displays updated questions  │
│   - Users fill out survey       │
└─────────────────────────────────┘
```

## Features

### 1. View Existing Questions
- Questions from survey.html automatically appear in the Manage Questions tab
- Displays both:
  - **SQD Questions** (SQD0-SQD8): Service Quality metrics
  - **CC Questions** (CC1-CC3): Citizens Charter metrics

### 2. Edit Questions
1. Click **EDIT** button on any question card
2. Modal opens with editable fields:
   - **Code** (read-only): SQD0, SQD1, etc.
   - **Text** (editable): The question content
   - **Type** (dropdown): SQD or CC
   - **Required** (checkbox): Mark as required
3. Click **Save Changes**
4. Changes appear immediately in:
   - Admin dashboard (refreshed)
   - localStorage (persisted)
   - survey.html (next time page loads)

### 3. Add Questions
1. Click **Add CGOV Question** button (green)
2. Modal opens with form:
   - **Code** (required): Unique identifier (e.g., SQD9)
   - **Text** (required): Question content
   - **Type** (dropdown): SQD or CC
   - **Required** (checkbox): Mark as required
3. Click **Add**
4. System validates:
   - Code must be unique
   - Code and text are required
5. New question appears in:
   - Admin dashboard list
   - localStorage (persisted)
   - survey.html (next time page loads)

### 4. Delete Questions
1. Click **trash icon** on any question card
2. Confirmation modal appears
3. Click **Confirm** to delete
4. Question is removed from:
   - Admin dashboard (immediately)
   - localStorage (persisted)
   - survey.html (next time page loads)

## File Changes

### 1. `admin.html` - Updated Functions

#### `loadSurveyQuestionsFromScript()`
- Loads SQD questions from global `sqdQuestions` array (from script.js)
- Adds hardcoded CC questions (CC1-CC3)
- Populates `window.allSurveyQuestions` array

#### `saveEditedQuestion(event)`
- Updates question text, type, and required status
- Updates `sqdQuestions` array for SQD questions
- Saves to localStorage for persistence
- Refreshes UI immediately

#### `addNewQuestion(event)`
- Validates unique code and required fields
- Adds question to `window.allSurveyQuestions`
- Updates `sqdQuestions` array if type is SQD
- Saves to localStorage
- Refreshes UI

#### `deleteQuestion(questionId)`
- Removes question from `window.allSurveyQuestions`
- Removes from `sqdQuestions` if type is SQD
- Saves to localStorage
- Refreshes UI

### 2. `script.js` - Modified Initialization

Changed from:
```javascript
const sqdQuestions = [...]
```

To:
```javascript
let sqdQuestions = [...]

// Load from localStorage if updated by admin
(function loadQuestionsFromStorage() {
  const storedQuestions = localStorage.getItem('sqdQuestions');
  if (storedQuestions) {
    sqdQuestions = JSON.parse(storedQuestions);
  }
})();
```

This ensures survey.html always gets the latest questions from the admin dashboard.

## Question Structure

### In Admin Dashboard
```javascript
{
  id: 'sqd0',              // Lowercase unique ID
  code: 'SQD0',            // Display code
  text: '...',             // Question text (without code prefix)
  type: 'SQD',             // Question type (SQD or CC)
  required: true           // Required flag
}
```

### In script.js
```javascript
sqdQuestions[0] = "SQD0. I am satisfied with the service..."
```

### In localStorage
```json
{
  "sqdQuestions": ["SQD0. ...", "SQD1. ...", ...],
  "allSurveyQuestions": [{id, code, text, type, required}, ...]
}
```

## Usage Examples

### Example 1: Edit SQD Question Text

1. Admin Dashboard → Manage Questions tab
2. Find SQD0: "I am satisfied with the service that I availed."
3. Click EDIT button
4. Change text to: "I am very satisfied with the service that I availed."
5. Click Save Changes
6. Changes appear:
   - ✅ Admin dashboard updates immediately
   - ✅ localStorage updated
   - ✅ survey.html shows new text (on next reload)

### Example 2: Add New Question

1. Click "Add CGOV Question"
2. Fill form:
   - Code: SQD9
   - Text: "The office staff provided clear written instructions"
   - Type: SQD
   - Required: ✓
3. Click Add
4. New question appears in:
   - ✅ Admin list
   - ✅ localStorage
   - ✅ survey.html (next reload)

### Example 3: Delete Question

1. Find question to delete
2. Click trash icon
3. Confirm deletion
4. Question removed from:
   - ✅ Admin dashboard
   - ✅ localStorage
   - ✅ survey.html (next reload)

## How Survey.html Gets Updated

1. **survey.html loads** → script.js initializes
2. **script.js checks localStorage** → Gets updated `sqdQuestions`
3. **renderSQDQuestions()** renders the questions
4. **Users see latest questions** in survey form

## Data Persistence

Changes are saved to **browser localStorage**:
- `sqdQuestions` - Array of SQD question strings
- `allSurveyQuestions` - Full question objects

### Clearing localStorage (Reset to Defaults)

If you want to reset questions to defaults:

```javascript
// In browser console:
localStorage.removeItem('sqdQuestions');
localStorage.removeItem('allSurveyQuestions');
location.reload(); // Refresh page
```

## Current Questions

### Service Quality (SQD) - 9 Questions
| Code | Question |
|------|----------|
| SQD0 | I am satisfied with the service that I availed. |
| SQD1 | I spent a reasonable amount of time for my transaction. |
| SQD2 | The office followed the transaction's requirements and steps based on the information provided. |
| SQD3 | The steps (including payment) I needed to do for my transaction were easy and simple. |
| SQD4 | I easily found information about my transaction from the office or its website. |
| SQD5 | I paid a reasonable amount of fees for my transaction. (If service was free, mark the 'N/A' option) |
| SQD6 | I feel the office was fair to everyone, or 'walang palakasan', during my transaction. |
| SQD7 | I was treated courteously by the staff, and (if asked for help) the staff was helpful. |
| SQD8 | I got what I needed from the government office, or if denied, the reason was explained to me clearly. |

### Citizen's Charter (CC) - 3 Questions
| Code | Question |
|------|----------|
| CC1 | Which of the following best describes your awareness of a CC? |
| CC2 | If aware of the CC (answered 1–3 in CC1), would you say that the CC of this office was easy to see? |
| CC3 | If aware of the CC (answered 1–3 in CC1), would you say that the CC of this office was helpful? |

## Testing Steps

1. **Login to admin.html**
   - Email: super@admin.com
   - Password: password123

2. **Go to Manage Questions tab**
   - Should see 12 questions (9 SQD + 3 CC)

3. **Edit a question**
   - Click EDIT on SQD0
   - Change text
   - Click Save Changes
   - Verify change appears in dashboard

4. **Add a question**
   - Click "Add CGOV Question"
   - Fill all fields
   - Click Add
   - Verify it appears in list

5. **Delete a question**
   - Click trash icon
   - Confirm deletion
   - Verify it's removed

6. **Check survey.html**
   - Open survey.html in new browser tab
   - Navigate to SQD questions section
   - Verify edited/added questions appear
   - (May need to refresh page)

7. **Close and reopen both pages**
   - Changes should persist in localStorage
   - Questions should still be updated

## Troubleshooting

### Questions don't load
- Check browser console (F12) for errors
- Verify script.js is loaded before admin.html
- Clear cache and reload

### Changes not appearing in survey.html
- Reload survey.html page (F5)
- Check localStorage in DevTools
- Verify sqdQuestions array is being saved

### Questions reverted after refresh
- This is normal - localStorage persists changes
- If you want defaults, clear localStorage

### Can't edit/add/delete
- Verify you're logged in as admin
- Check browser console for error messages
- Try closing and reopening modal

## Browser Compatibility

Works in all modern browsers supporting:
- localStorage API
- ES6 JavaScript
- localStorage space: ~5-10 MB per domain

---

**Status**: ✅ Ready to Use
**Last Updated**: December 8, 2025
