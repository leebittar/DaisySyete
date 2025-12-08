# Survey Questions Management - Setup & Usage Guide

## Overview

The Manage Questions tab in the Admin Dashboard now has full Firestore integration with real-time question management. All survey questions from the ARTA CSM system are now loaded from Firestore instead of hardcoded defaults.

## Features

### 1. **Load Default Questions**
- Button: "Load Default Questions" (Green button in Manage Questions tab)
- Action: Initializes Firestore with all 12 default ARTA survey questions
- Includes:
  - **9 Service Quality (SQD) Questions** (SQD0-SQD8)
  - **3 Citizen's Charter (CC) Questions** (CC1-CC3)
- Smart initialization: Skips questions that already exist

### 2. **Edit Question**
- Click "EDIT" button on any question card
- Opens modal with form fields:
  - **Code** (Read-only): e.g., SQD0, CC1
  - **Text** (Editable): Question content
  - **Type** (Dropdown): SQD or CC
  - **Required** (Checkbox): Mark as required/optional
- Click "Save Changes" to persist to Firestore
- Changes appear in real-time across the survey and admin dashboard

### 3. **Add Question**
- Click "Add CGOV Question" button
- Opens modal with form fields:
  - **Code** (Required): Unique question identifier (e.g., SQD9, CC4)
  - **Text** (Required): Question content
  - **Type** (Dropdown): SQD or CC
  - **Required** (Checkbox): Mark as required/optional
- Validation: Cannot create questions with duplicate codes
- Click "Add" to save to Firestore

### 4. **Delete Question**
- Click trash icon on any question card
- Confirmation modal appears: "Are you sure you want to delete..."
- Click "Confirm" to delete permanently from Firestore
- Deleted questions are immediately removed from the UI

## Setup Instructions

### Step 1: Access the Admin Dashboard
1. Go to `admin.html`
2. Login with credentials:
   - **Email**: super@admin.com
   - **Password**: password123

### Step 2: Initialize Survey Questions
1. Navigate to **Manage Questions** tab (left sidebar)
2. Click **"Load Default Questions"** button (green button)
3. Confirmation dialog appears
4. Click to confirm
5. System initializes all 12 ARTA survey questions in Firestore
6. Questions appear in the Question List automatically

### Step 3: Manage Questions as Needed
Once initialized:
- **Edit**: Click EDIT to modify question text, type, or requirement
- **Add**: Click "Add CGOV Question" to add custom questions
- **Delete**: Click trash icon and confirm deletion

## Firestore Collection Structure

### Collection: `survey_questions`

Each document represents one question with the following fields:

```json
{
  "code": "SQD0",                          // Unique question code
  "text": "I am satisfied with...",        // Question text/content
  "type": "SQD",                           // Question type: SQD or CC
  "required": true,                        // Required question flag
  "createdAt": "2024-12-08T10:30:00Z",     // Server timestamp
  "updatedAt": "2024-12-08T10:30:00Z"      // Last update timestamp
}
```

### Document IDs
Documents are automatically named using the question code in lowercase, e.g.:
- `sqd0` for SQD0
- `cc1` for CC1
- `sqd9` for custom question SQD9

## Default Questions

### Service Quality (SQD) - 9 Questions
| Code | Question | Required |
|------|----------|----------|
| SQD0 | I am satisfied with the service that I availed. | ✓ |
| SQD1 | I spent a reasonable amount of time for my transaction. | ✓ |
| SQD2 | The office followed the transaction's requirements and steps based on the information provided. | ✓ |
| SQD3 | The steps (including payment) I needed to do for my transaction were easy and simple. | ✓ |
| SQD4 | I easily found information about my transaction from the office or its website. | ✓ |
| SQD5 | I paid a reasonable amount of fees for my transaction. (If service was free, mark the 'N/A' option) | ✓ |
| SQD6 | I feel the office was fair to everyone, or 'walang palakasan', during my transaction. | ✓ |
| SQD7 | I was treated courteously by the staff, and (if asked for help) the staff was helpful. | ✓ |
| SQD8 | I got what I needed from the government office, or if denied, the reason was explained to me clearly. | ✓ |

### Citizen's Charter (CC) - 3 Questions
| Code | Question | Required |
|------|----------|----------|
| CC1 | Which of the following best describes your awareness of a CC? | ✓ |
| CC2 | If aware of the CC (answered 1–3 in CC1), would you say that the CC of this office was...? | ✓ |
| CC3 | If aware of the CC (answered 1–3 in CC1), would you say that the CC of this office was...? | ✓ |

## Real-Time Synchronization

### Admin Changes → Survey Form
When you edit, add, or delete questions in the admin dashboard:
1. Changes are saved to Firestore
2. Survey.html immediately loads the updated questions
3. Users taking the survey see the latest questions

### Multi-Tab Synchronization
If you have multiple admin dashboard tabs open:
- All tabs receive real-time updates via Firestore listeners
- Questions list refreshes automatically in each tab
- No page refresh needed

## Browser Console Functions

For advanced users, these functions are available in the browser console:

```javascript
// Load default questions programmatically
initializeDefaultSurveyQuestions()

// Clear all questions (WARNING: irreversible!)
clearAllSurveyQuestions()
```

## Troubleshooting

### Questions Not Loading
**Problem**: Manage Questions tab shows "No questions available"
**Solution**: 
- Check that Firestore database is initialized
- Click "Load Default Questions" button
- Check browser console for errors

### Cannot Edit/Add/Delete Questions
**Problem**: Modal appears but changes don't save
**Solution**:
- Verify you're logged in as super admin
- Check Firestore security rules allow write access
- Check browser console for error messages
- Try refreshing the page

### Firestore Rules Error
**Problem**: Error message about permissions
**Solution**:
- Ensure Firestore security rules allow authenticated users to read/write
- Use the rules from FIREBASE_SECURITY_RULES.md

## Files Modified

1. **admin.html**
   - Added Firestore integration for question management
   - Added "Load Default Questions" button
   - Updated edit, add, delete functions to use Firestore

2. **setup-survey-questions.js** (NEW)
   - Contains default question definitions
   - Functions to initialize and clear questions
   - Works with Firestore via window.db

3. **survey-submission.js**
   - Already configured to load questions from Firestore
   - No changes needed

## API Reference

### Functions in admin.html

#### `initializeSurveyQuestionsFromFirestore()`
Sets up real-time listener for survey questions collection.
```javascript
initializeSurveyQuestionsFromFirestore();
```

#### `loadSurveyQuestions()`
Renders question cards in the UI based on `window.allSurveyQuestions`.
```javascript
loadSurveyQuestions();
```

#### `saveEditedQuestion(event)`
Saves edited question to Firestore.
```javascript
saveEditedQuestion(event);  // Called on form submit
```

#### `addNewQuestion(event)`
Adds new question to Firestore with validation.
```javascript
addNewQuestion(event);  // Called on form submit
```

#### `deleteQuestion(questionId)`
Deletes question from Firestore.
```javascript
deleteQuestion(questionId);
```

### Global State

#### `window.allSurveyQuestions`
Array of all survey questions loaded from Firestore.
```javascript
window.allSurveyQuestions.map(q => ({
  id: q.id,
  code: q.code,
  text: q.text,
  type: q.type,
  required: q.required
}))
```

## Next Steps

1. ✅ Load default questions using "Load Default Questions" button
2. ✅ Test editing a question
3. ✅ Test adding a custom question
4. ✅ Test deleting a question
5. ✅ Verify survey.html loads updated questions
6. ✅ Monitor Firestore collection for data persistence

## Support

For issues or questions:
1. Check browser console (F12) for error messages
2. Review Firestore database in Firebase Console
3. Ensure security rules allow database access
4. Check that questions are properly saved with all required fields

---
**Last Updated**: December 8, 2025
**Status**: Ready for Production
