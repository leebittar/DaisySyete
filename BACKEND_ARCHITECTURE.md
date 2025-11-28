/**
 * ARTA CSS System - Survey Backend Architecture
 * ==============================================
 * 
 * Complete documentation for the Firebase-powered survey submission system.
 */

# Survey Backend Architecture Documentation

## Overview

The survey backend system is a **user-side only** implementation that handles:
- Client-side form validation with comprehensive error handling
- Real-time field validation with visual feedback
- Firebase Firestore integration for data persistence
- Duplicate submission prevention
- Data sanitization and security

### Tech Stack Decision: Firestore vs Realtime Database

**CHOSEN: Firestore (Cloud Firestore)**

Why Firestore over Realtime Database:

| Feature | Firestore | Realtime DB |
|---------|-----------|------------|
| **Data Structure** | Document-oriented (JSON-like) | Hierarchical JSON trees |
| **Querying** | Rich query API | Limited querying |
| **Indexes** | Automatic and custom | Manual setup |
| **Scalability** | Better for large datasets | Good but less flexible |
| **Security Rules** | More expressive & flexible | Good but simpler |
| **Offline Support** | Built-in via IndexedDB | Limited support |
| **Best For** | Structured survey data | Real-time applications |

**For an ARTA system**, Firestore is ideal because:
1. Survey data is highly structured (fixed schema)
2. Need complex security rules (users write-only)
3. Future analytics queries on submitted data
4. Better document management with auto-IDs
5. Easier to export/analyze reports later

---

## Project File Structure

```
DaisySyete/
├── survey.html                      # Main survey page
├── firebase-config.js              # Firebase initialization & Firestore functions
├── survey-validation.js            # Client-side validation rules & sanitization
├── survey-submission.js            # Form handling & submission flow
├── FIREBASE_SECURITY_RULES.md      # Firestore security rules (deploy manually)
├── BACKEND_ARCHITECTURE.md         # This file
├── script.js                       # Existing shared JS
└── style.css                       # Existing shared styles
```

---

## Detailed Component Breakdown

### 1. firebase-config.js
**Purpose:** Firebase initialization and Firestore operations

**Key Functions:**
- `initializeApp()` - Initialize Firebase with config
- `getFirestore()` - Get Firestore instance
- `saveSurveyResponse(surveyData)` - Save validated data to Firestore
- `checkDuplicateSubmission(clientType, email, minutesWindow)` - Check for recent submissions
- `markSubmissionTime(clientType, email)` - Mark submission in localStorage

**Firestore Collection Structure:**
```javascript
{
  survey_responses: [
    {
      // Auto-generated document ID by Firebase
      clientType: "citizen",
      date: "2025-11-28",
      age: 35,
      serviceAvailed: "License Renewal",
      regionOfResidence: "Valenzuela",
      sex: "Male",
      
      citizensCharter: {
        cc1: "1",  // Radio button value
        cc2: "Easy to see",
        cc3: "Helped very much"
      },
      
      serviceQuality: {
        sqd0: "5",  // CSAT rating
        sqd1: "5",
        sqd2: "4",
        sqd3: "5",
        sqd4: "5",
        sqd5: "4",
        sqd6: "5",
        sqd7: "5",
        sqd8: "4"
      },
      
      feedback: {
        suggestions: "Better parking needed",
        email: "user@example.com"
      },
      
      // Auto-added by backend
      completionStatus: "completed",
      privacyAccepted: true,
      submittedAt: Timestamp(2025-11-28T10:30:45Z),
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0...",
      surveyVersion: "1.0"
    }
  ]
}
```

**Security Features:**
- Server-side timestamp (prevents client tampering)
- IP address logging (for fraud detection)
- User Agent tracking (for compatibility analysis)
- Schema versioning (for future updates)

---

### 2. survey-validation.js
**Purpose:** Comprehensive client-side validation

**Key Features:**

#### Validation Patterns
```javascript
// Global regex patterns for common formats
email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
phone: /^(\+?\d{1,3}[-.\s]?)?\d{7,14}$/
numeric: /^\d+$/
alphanumeric: /^[a-zA-Z0-9\s\-.,()]+$/
```

#### Field Configuration
```javascript
FIELD_RULES = {
  age: {
    required: true,
    type: 'number',
    min: 1,
    max: 150,
    validator: (value) => {...},
    errorMsgCustom: 'Age must be between 1-150'
  },
  // ... more fields
}
```

#### Key Functions:
- `validateField(fieldName, value, formData)` - Validate single field
- `validateForm(formData, fieldNames)` - Validate entire form
- `sanitizeInput(input)` - XSS prevention via textContent
- `sanitizeFormData(formData)` - Sanitize all strings in object
- `showFieldError(fieldName, errorMsg)` - Display error near field
- `clearFieldError(fieldName)` - Remove error message
- `collectFormData(formId)` - Extract form data from DOM
- `formatSurveyForStorage(form1, form2, form3, form4)` - Structure data for Firestore

**Validation Rules per Form:**

**Form 1 (Client Info):**
- clientType: Required, select dropdown
- date: Required, not future date
- age: Required, integer 1-150
- serviceAvailed: Required, 2-100 chars, alphanumeric
- regionOfResidence: Required, 2-100 chars
- sex: Required, radio (Male/Female/Others)

**Form 2 (Citizens Charter):**
- cc1: Required, radio
- cc2: Required IF cc1 ≠ "unaware"
- cc3: Required IF cc1 ≠ "unaware"

**Form 3 (SQD Questions):**
- sqd0-sqd8: All required, radio (1-5 scale)

**Form 4 (Feedback):**
- suggestions: Optional, max 500 chars
- email: Optional, valid format if provided

---

### 3. survey-submission.js
**Purpose:** Form navigation, validation flow, Firebase submission

**Global State:**
```javascript
const surveyState = {
  currentForm: 1,
  totalForms: 4,
  formData: { form1: {}, form2: {}, form3: {}, form4: {} },
  isSubmitting: false
}
```

**Key Functions:**

#### Initialization & Setup
- `initializeSurveyHandlers()` - Set up all event listeners
- `setupFieldValidation()` - Real-time validation on blur/change
- `setupFormNavigation()` - Back/Next button handlers

#### Form Navigation
- `validateFormAndProceed(formNumber)` - Validate form, show errors, advance if valid
- `goToNextForm()` - Show next form, hide current
- `goToPreviousForm()` - Return to previous form
- `showForm(formNumber)` - Render specific form
- `hideAllForms()` - Hide all forms
- `updateProgressBar()` - Update % complete display
- `scrollToTop()` - Smooth scroll to top

#### Submission Flow
- `submitSurvey()` - Main submission function
- `showConfirmationBeforeSubmit()` - Show confirmation modal
- `completeSurvey()` - Handle confirmed submission
- `proceedToSurvey()` - Dismiss privacy notice, start form 1
- `resetSurveyState()` - Clear all data after successful submission
- `showError(message)` - Display error notification
- `showSuccessModal()` - Show thank you modal

#### Special Handlers
- `handlePrivacyCheckboxChange()` - Enable/disable proceed button
- `handleCC1Change(value)` - Conditionally enable cc2/cc3

---

## Complete Data Flow

### 1. User Opens Survey
```
survey.html loads → DOMContentLoaded fires → initializeSurveyHandlers()
↓
Set up field validation listeners
Set up form navigation (back/next)
Show Form 1 (Client Information)
```

### 2. User Fills Form 1
```
User enters data → blur/change event → handleFieldValidation()
↓
validateField() runs with FIELD_RULES
↓
Valid? → clearFieldError() : showFieldError()
```

### 3. User Clicks NEXT (Form 1)
```
validateForm() → validateFormAndProceed(1)
↓
Collect form-1 data via collectFormData()
Store in surveyState.formData.form1
↓
All required fields valid?
  ✓ YES → goToNextForm() → show Form 2
  ✗ NO → showFieldError() for each invalid field
```

### 4. Repeat Forms 2-3
```
Same flow as Form 1
surveyState.formData.form2 ← Form 2 data
surveyState.formData.form3 ← Form 3 data
```

### 5. User Completes Form 4 & Clicks Submit
```
validateForm(4) → showConfirmationBeforeSubmit()
↓
User confirms → completeSurvey()
↓
Collect Form 4 data
formatSurveyForStorage() → Combine all forms into single object
sanitizeFormData() → XSS prevention
↓
checkDuplicateSubmission() → If recent submission, reject with error
↓
saveSurveyResponse() → Call Firebase function
↓
addDoc(collection(db, 'survey_responses'), data)
↓
Success? 
  ✓ YES → markSubmissionTime() → showSuccessModal() → redirect to home
  ✗ NO → showError() → keep user on form
```

---

## Validation & Security Layers

### Client-Side Validation (survey-validation.js)
- Required field checks
- Format validation (email, phone, numeric)
- Length limits (min/max)
- Type checking
- Custom validator functions
- XSS sanitization via textContent

### Firestore Security Rules
- Schema validation
- Type checking
- Field requirement enforcement
- Value range validation
- Email format validation
- Anonymous write-only access

### Backend Safeguards
- Server-side timestamp (Firestore serverTimestamp())
- IP address logging
- User Agent tracking
- Duplicate submission prevention (5-min window)
- Document auto-ID (no predictable IDs)

---

## Error Handling Strategy

### Form Validation Errors
1. Field-level validation fails
2. Error message displays near field
3. Page scrolls to first error
4. User cannot proceed to next form
5. Error clears when valid input entered

### Submission Errors
1. Network error → "Failed to save survey. Please try again."
2. Duplicate submission → "You've already submitted recently. Wait 5 minutes."
3. Firebase error → "An unexpected error occurred. Please try again."
4. Browser alert + visual notification on screen

### Graceful Fallbacks
- If IP service fails → "unknown" IP stored
- If localStorage unavailable → Duplicate check skipped
- If IndexedDB fails → Offline sync disabled (but submission still works)

---

## Testing Checklist

### Unit Tests (for validation)
```javascript
test('validateField accepts valid age', () => {
  const result = validateField('age', '35', {});
  expect(result.valid).toBe(true);
});

test('validateField rejects age > 150', () => {
  const result = validateField('age', '200', {});
  expect(result.valid).toBe(false);
});

test('sanitizeInput prevents XSS', () => {
  const input = '<script>alert("xss")</script>';
  const sanitized = sanitizeInput(input);
  expect(sanitized).not.toContain('<script>');
});
```

### Integration Tests
```javascript
test('Form 1 submission stores data', async () => {
  // Fill Form 1
  // Click Next
  // Verify surveyState.formData.form1 is populated
});

test('Duplicate submission prevented', async () => {
  // Submit survey once
  // Try to submit again within 5 mins
  // Expect error: "You've already submitted recently"
});
```

### Manual QA Steps
1. Fill all 4 forms with valid data
2. Verify progress bar updates
3. Try submitting with invalid data (should show errors)
4. Go back and modify answers
5. Complete submission
6. Verify data in Firestore
7. Try duplicate submission immediately (should fail)

---

## Firestore Database Structure

### Collections
```
daisysyete-c9511 (project)
  └── survey_responses/ (collection)
      ├── doc_auto_id_001/ (document)
      │   ├── clientType: string
      │   ├── date: string
      │   ├── age: number
      │   ├── serviceAvailed: string
      │   ├── regionOfResidence: string
      │   ├── sex: string
      │   ├── citizensCharter: map
      │   ├── serviceQuality: map
      │   ├── feedback: map
      │   ├── completionStatus: string
      │   ├── privacyAccepted: boolean
      │   ├── submittedAt: timestamp
      │   ├── ipAddress: string
      │   ├── userAgent: string
      │   └── surveyVersion: string
      │
      ├── doc_auto_id_002/
      └── ... (more documents)
```

### Indexes Needed
None! Firestore automatically indexes single-field queries. For advanced analytics later:
- Composite index on: `clientType` + `submittedAt`
- Composite index on: `regionOfResidence` + `serviceQuality.sqd0`

---

## Deployment Instructions

### Step 1: Deploy Firebase Security Rules
1. Open Firebase Console → daisysyete-c9511
2. Go to Firestore Database → Rules tab
3. Copy rules from FIREBASE_SECURITY_RULES.md
4. Paste into editor (replace defaults)
5. Click Publish

### Step 2: Deploy JavaScript Files
1. Upload to project root:
   - firebase-config.js
   - survey-validation.js
   - survey-submission.js
2. Update survey.html imports to correct paths
3. Test locally first

### Step 3: Test Survey Flow
1. Open survey.html in browser
2. Fill all forms with valid data
3. Submit survey
4. Check Firestore Console → survey_responses collection
5. Verify document created with correct structure

### Step 4: Monitor Production
1. Monitor Firestore writes in Console
2. Check browser console for errors
3. Review authentication metrics
4. Track duplicate submission rates

---

## Future Enhancements

### Phase 2: Admin Dashboard
- Read-only access to survey_responses
- Admin authentication via custom claims
- Real-time analytics dashboard
- Export to CSV/PDF

### Phase 3: Advanced Features
- Survey version management
- A/B testing different question sets
- Conditional branching (skip questions)
- Multi-language support
- Mobile app integration

### Phase 4: Analytics
- Aggregate satisfaction scores by region
- Time-series analysis of trends
- Automated report generation
- Data visualization dashboards

---

## Troubleshooting Guide

### Issue: Surveys not saving to Firestore
**Solutions:**
1. Check Firebase Console → Firestore → Usage
2. Verify security rules are deployed
3. Check browser console for errors
4. Ensure firebase-config.js is loaded
5. Verify survey data passes validation

### Issue: Duplicate submissions allowed
**Solutions:**
1. Clear localStorage: `localStorage.clear()`
2. Check time window is 5 minutes
3. Verify email/clientType are being stored
4. Test with different email addresses

### Issue: Validation not showing errors
**Solutions:**
1. Check field names match HTML `name` attributes
2. Verify FIELD_RULES has entries for all fields
3. Check error element IDs: `{fieldName}-error`
4. Ensure showFieldError() is being called

### Issue: Form navigation buttons not working
**Solutions:**
1. Verify onclick handlers are in survey-submission.js
2. Check form IDs match: `form-1`, `form-2`, `form-3`, `form-4`
3. Check global functions exposed via `window`
4. Verify validateFormAndProceed() is exported

---

## Security Considerations

✅ **Implemented:**
- XSS prevention via textContent sanitization
- Input validation (type, length, format)
- Firestore security rules (schema validation)
- Anonymous write-only access (no authentication needed)
- Server-side timestamp (prevents tampering)
- Duplicate submission prevention

⚠️ **Recommended (Phase 2):**
- Rate limiting (prevent form spam)
- CAPTCHA integration
- Email verification for contact
- DDoS protection (via Firebase)
- Data encryption at rest

❌ **Out of Scope (User-Side Only):**
- User authentication
- Admin access control
- Advanced compliance (encryption, key management)
- HIPAA/PCI-DSS compliance

---

## Performance Metrics

### Expected Performance
- Form load: < 100ms
- Validation: < 5ms per field
- Firestore write: < 500ms (varies by connection)
- Page transition: 300ms (smooth scroll)

### Optimization Tips
- Enable IndexedDB persistence (already done)
- Batch writes if submitting multiple forms
- Lazy load analytics script
- Cache validation rules

---

## License & Support

This backend system was built for:
- **Project:** ARTA CSS - Valenzuela City
- **Version:** 1.0
- **Last Updated:** 2025-11-28

For questions or bug reports:
1. Check this documentation
2. Review browser console for errors
3. Test with different browsers
4. Review Firebase logs

---

**End of Documentation**
