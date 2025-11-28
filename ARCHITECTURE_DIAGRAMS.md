# Survey Backend System - Visual Architecture & Flow Diagrams

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         SURVEY BACKEND SYSTEM                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (Browser)                    │  │
│  │                                                          │  │
│  │  survey.html                                            │  │
│  │  ├─ Form 1: Client Information                          │  │
│  │  ├─ Form 2: Citizens Charter                            │  │
│  │  ├─ Form 3: Service Quality (SQD)                       │  │
│  │  └─ Form 4: Suggestions & Email                         │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │        JavaScript Modules (ES6)                 │  │  │
│  │  │                                                  │  │  │
│  │  │  survey-validation.js                           │  │  │
│  │  │  ├─ validateField()  ← Real-time validation    │  │  │
│  │  │  ├─ showFieldError() ← Display errors near    │  │  │
│  │  │  └─ sanitizeInput()  ← XSS prevention         │  │  │
│  │  │                                                  │  │  │
│  │  │  survey-submission.js                           │  │  │
│  │  │  ├─ validateFormAndProceed()  ← Next/Back     │  │  │
│  │  │  ├─ submitSurvey()            ← Submit data   │  │  │
│  │  │  └─ handleCC1Change()         ← Conditional  │  │  │
│  │  │                                                  │  │  │
│  │  │  firebase-config.js                             │  │  │
│  │  │  ├─ saveSurveyResponse()      ← Save to DB   │  │  │
│  │  │  └─ checkDuplicateSubmission() ← Prevent dup│  │  │
│  │  │                                                  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                     HTTPS (Encrypted)                           │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   FIREBASE BACKEND                       │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │        Firestore (Database)                     │   │  │
│  │  │                                                 │   │  │
│  │  │  Collection: survey_responses                   │   │  │
│  │  │  ├─ Document 001                                │   │  │
│  │  │  │  ├─ clientType: "citizen"                    │   │  │
│  │  │  │  ├─ age: 35                                  │   │  │
│  │  │  │  ├─ serviceQuality: {...}                    │   │  │
│  │  │  │  ├─ feedback: {...}                          │   │  │
│  │  │  │  ├─ submittedAt: Timestamp ← Server-side   │   │  │
│  │  │  │  └─ ipAddress: "203.0.113.42"               │   │  │
│  │  │  ├─ Document 002                                │   │  │
│  │  │  └─ ...more documents                           │   │  │
│  │  │                                                 │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐   │  │
│  │  │    Firestore Security Rules (v2)               │   │  │
│  │  │                                                 │   │  │
│  │  │  allow create: if isValidSurveySubmission()    │   │  │
│  │  │  └─ Validates:                                 │   │  │
│  │  │     ├─ All required fields present             │   │  │
│  │  │     ├─ Correct data types                      │   │  │
│  │  │     ├─ Valid value ranges                      │   │  │
│  │  │     └─ Email format (if provided)              │   │  │
│  │  │                                                 │   │  │
│  │  │  allow read: if false  ← Users CANNOT read    │   │  │
│  │  │  allow update: if false ← Users CANNOT modify  │   │  │
│  │  │                                                 │   │  │
│  │  └─────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
USER JOURNEY THROUGH SURVEY

┌─────────────────────────────────────────────────────────────────┐
│                    USER OPENS survey.html                        │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │  Privacy Notice     │
        │  Modal Displayed    │
        │  "Accept to proceed"│
        └────────┬────────────┘
                 │
         User accepts ───► Checks checkbox, clicks "Proceed"
                 │
                 ▼
    ┌──────────────────────────────┐
    │   FORM 1: Client Info        │
    │                              │
    │   Fields to fill:            │
    │   ├─ Client Type             │
    │   ├─ Date                    │
    │   ├─ Age                     │
    │   ├─ Service Availed         │
    │   ├─ Region of Residence     │
    │   └─ Sex                     │
    │                              │
    │   Real-time validation:      │
    │   ├─ On blur: Check required │
    │   ├─ On change: Validate fmt │
    │   └─ Show error near field   │
    └────────┬─────────────────────┘
             │
      User fills + clicks "NEXT"
             │
             ▼
    ┌─────────────────────────────────────┐
    │   validateFormAndProceed(1)         │
    │                                     │
    │   ✓ Collect all Form 1 data        │
    │   ✓ Validate each field            │
    │   ├─ Age not integer? → Show error │
    │   ├─ Future date? → Show error     │
    │   └─ Missing required? → Show error│
    │                                     │
    │   If VALID:                        │
    │   └─ Store in surveyState          │
    │   └─ Show Form 2                   │
    │                                     │
    │   If INVALID:                      │
    │   └─ Scroll to error               │
    │   └─ Stay on Form 1                │
    └─────────┬───────────────────────────┘
              │
              │ (If valid)
              ▼
    ┌──────────────────────────────┐
    │   FORM 2: Citizens Charter   │
    │                              │
    │   ├─ CC1: Awareness of CC    │
    │   ├─ CC2: Visibility ◄──────── Conditional
    │   └─ CC3: Helpfulness ◄────── (Only if cc1 ≠ "unaware")
    │                              │
    │   Note: If CC1 = "Unaware"  │
    │   └─ CC2 & CC3 auto-set N/A  │
    └────────┬─────────────────────┘
             │
      Click "NEXT"
             │
             ▼
    ┌──────────────────────────────┐
    │   FORM 3: Service Quality    │
    │   (9 SQD Questions)          │
    │                              │
    │   SQD 0-8: All required      │
    │   Rating scale: 1-5          │
    │   ├─ SQD0: Satisfaction      │
    │   ├─ SQD1: Professionalism   │
    │   ├─ SQD2: Speed             │
    │   ├─ SQD3: Accuracy          │
    │   ├─ SQD4: Courtesy          │
    │   ├─ SQD5: Cleanliness       │
    │   ├─ SQD6: Signage           │
    │   ├─ SQD7: Security          │
    │   └─ SQD8: Overall           │
    └────────┬─────────────────────┘
             │
      Click "NEXT"
             │
             ▼
    ┌──────────────────────────────┐
    │   FORM 4: Suggestions        │
    │   (Optional Feedback)        │
    │                              │
    │   ├─ Suggestions (optional)  │
    │   └─ Email (optional)        │
    └────────┬─────────────────────┘
             │
      Click "SUBMIT SURVEY"
             │
             ▼
    ┌─────────────────────────────────────────┐
    │   Confirmation Modal Shows             │
    │   "Are you sure to submit?"            │
    │   ├─ [Go Back]  [Submit Survey]        │
    └────────┬────────────────────────────────┘
             │
      User confirms submission
             │
             ▼
    ┌──────────────────────────────────────────┐
    │   submitSurvey()                        │
    │                                        │
    │   ✓ Format all 4 forms into 1 object  │
    │   ✓ Sanitize text fields (XSS prevent)│
    │   ✓ Check for duplicate submission    │
    │     └─ Within last 5 minutes?         │
    │       ├─ YES: Show error, stop       │
    │       └─ NO: Continue                │
    │   ✓ Call saveSurveyResponse()         │
    └─────────┬──────────────────────────────┘
              │
              ▼
    ┌──────────────────────────────────────────┐
    │   saveSurveyResponse(sanitizedData)    │
    │                                        │
    │   ✓ Initialize Firebase                │
    │   ✓ addDoc(collection(db, ...), data) │
    │     └─ Firestore receives data         │
    └─────────┬──────────────────────────────┘
              │
              ▼
    ┌──────────────────────────────────────────┐
    │   Firestore Security Rules Check        │
    │                                        │
    │   ✓ isValidSurveySubmission():        │
    │     ├─ All required fields? ✓         │
    │     ├─ Correct types? ✓               │
    │     ├─ Valid ranges? ✓                │
    │     ├─ Email format? ✓                │
    │     └─ PASS → Document created        │
    │                                        │
    │   Auto-added by server:               │
    │   ├─ submittedAt (server timestamp)   │
    │   ├─ ipAddress                        │
    │   ├─ userAgent                        │
    │   └─ surveyVersion                    │
    └─────────┬──────────────────────────────┘
              │
              ▼
    ┌──────────────────────────────────────────┐
    │   "Thank You" Modal Shows              │
    │   ✓ Success message displayed          │
    │   ✓ Timer starts (3 seconds)           │
    └─────────┬──────────────────────────────┘
              │
         3 seconds pass
              │
              ▼
    ┌──────────────────────────────────────────┐
    │   Redirected to index.html              │
    │   ✓ Survey complete!                   │
    └──────────────────────────────────────────┘
```

---

## Validation Flow Diagram

```
USER ENTERS DATA → ON BLUR/CHANGE EVENT

        ┌─────────────────────┐
        │  handleFieldValidation()
        │                     │
        │  event.target.value │
        └────────┬────────────┘
                 │
                 ▼
    ┌─────────────────────────────┐
    │   validateField(name, val)  │
    │                             │
    │   1. Get FIELD_RULES[name]  │
    │   2. Check: required?       │
    │   3. Check: type correct?   │
    │   4. Check: format valid?   │
    │   5. Check: length ok?      │
    │   6. Check: custom validator?
    │                             │
    │   Returns:                  │
    │   {valid: true/false,       │
    │    error: "error message"}  │
    └────────┬────────────────────┘
             │
        ┌────┴─────┐
        │           │
    VALID?       INVALID?
        │           │
        ▼           ▼
    ┌──────┐  ┌──────────────────────────┐
    │Clear │  │  showFieldError()        │
    │Error │  │  ├─ Find/create error   │
    │      │  │  │  element              │
    │      │  │  ├─ Set error message   │
    │      │  │  ├─ Show element        │
    │      │  │  └─ Make text red       │
    └──────┘  └──────────────────────────┘
```

---

## Duplicate Submission Prevention

```
USER SUBMITS SURVEY

    ┌──────────────────────────────────┐
    │  checkDuplicateSubmission()      │
    │                                  │
    │  lastSubmissionKey =             │
    │  "lastSurveySubmission_" +       │
    │  clientType + "_" + email        │
    │                                  │
    │  Example:                        │
    │  "lastSurveySubmission_citizen_  │
    │   user@example.com"              │
    └─────────┬────────────────────────┘
              │
              ▼
    ┌─────────────────────────────────┐
    │  Check localStorage              │
    │  Does lastSubmissionKey exist?   │
    └─────┬───────────────────┬────────┘
          │                   │
        YES                 NO
          │                   │
          ▼                   ▼
    ┌──────────────────┐  ┌─────────────┐
    │ Get last time    │  │ No duplicate│
    │ Calculate diff   │  │ Allow submit│
    │ = now - lastTime │  │             │
    └──────┬───────────┘  └─────────────┘
           │
           ▼
    ┌──────────────────┐
    │ Diff < 5 min?    │
    └────┬──────────┬──┘
        YES        NO
         │          │
         ▼          ▼
    ┌────────┐  ┌──────────────┐
    │ BLOCK  │  │ ALLOW & MARK │
    │ ERROR: │  │ Save time:   │
    │"Already│  │ localStorage │
    │submit" │  │[key]=now()   │
    │        │  │              │
    └────────┘  └──────────────┘

TIMELINE EXAMPLE:
┌─────────────────────────────────────────────────┐
│  10:00:00 - User submits survey 1               │
│             lastSubmissionTime = 10:00:00       │
│                                                 │
│  10:03:00 - User tries to submit again (3 min) │
│             Blocked! "Already submitted"        │
│                                                 │
│  10:05:30 - User tries again (5.5 min) ✓       │
│             Allowed! New submission accepted    │
└─────────────────────────────────────────────────┘
```

---

## Security Validation Layers

```
REQUEST TO SUBMIT SURVEY

        ┌─────────────────────────┐
        │  Browser (Layer 1)      │
        │  Client-Side Validation │
        └────────┬────────────────┘
                 │
    ┌────────────┼────────────────┐
    │            │                │
    ▼            ▼                ▼
┌──────┐   ┌──────────┐   ┌─────────────┐
│Type  │   │Format    │   │XSS          │
│Check │   │Validation│   │Sanitization │
│      │   │├─Email   │   │├─Escape HTML│
│      │   │├─Phone   │   │└─Remove tags│
│      │   │├─Date    │   │             │
│      │   │└─Numeric │   │             │
└──────┘   └──────────┘   └─────────────┘
    │            │                │
    └────────────┼────────────────┘
                 │
        ✓ All valid? Continue
        ✗ Invalid? Show error & stop
                 │
                 ▼
        ┌─────────────────────────┐
        │  Network (Layer 2)      │
        │  HTTPS/TLS Encryption   │
        │  (Automatic - Firebase) │
        └────────┬────────────────┘
                 │
                 ▼
        ┌─────────────────────────┐
        │  Firestore (Layer 3)    │
        │  Server-Side Validation │
        └────────┬────────────────┘
                 │
    ┌────────────┼────────────────┐
    │            │                │
    ▼            ▼                ▼
┌──────────┐ ┌──────────┐ ┌─────────────┐
│Required  │ │Type      │ │Range        │
│Fields    │ │Checking  │ │Validation   │
│├─All flds│ │├─age:num │ │├─age 1-150  │
│├─No null │ │├─str:str │ │├─SQD 1-5    │
│├─No empty│ │└─map:obj │ │└─Valid email│
│          │ │          │ │             │
└──────────┘ └──────────┘ └─────────────┘
    │            │                │
    └────────────┼────────────────┘
                 │
        ✓ Valid? Save to DB
        ✗ Invalid? Reject with error
                 │
                 ▼
        ┌─────────────────────────┐
        │  Document Stored        │
        │  ✓ ID auto-generated    │
        │  ✓ Timestamp server-side│
        │  ✓ IP address logged    │
        │  ✓ User Agent tracked   │
        └─────────────────────────┘
```

---

## Form State Machine

```
SURVEY FORM PROGRESSION

           START
             │
             ▼
    ┌─────────────────┐
    │  Privacy Notice │
    │  Modal          │
    │                 │
    │ [ Accept ] [ No]│
    └────┬─────────┬──┘
         │         │
    Accept     Decline
         │         │
         ▼         ▼
    ┌─────┐   ┌─────────┐
    │Form1│   │ Exit    │
    │     │   │ (home)  │
    └──┬──┘   └─────────┘
       │
    Click NEXT
       │
       ▼
    ┌──────────────────┐
    │  Validate Form 1 │
    └──┬───────────┬───┘
       │           │
    VALID      INVALID
       │           │
       ▼           │
    ┌──────┐       │
    │Form2 │       │
    │      │       │
    └──┬───┘       │
       │           │
    [Back] [Next]  │
       │    │      │
    Form1  │      │
          Valid?   │
             │     │
          ┌──┘     │
          │        │
          ▼        │
       ┌──────┐    │
       │Form3 │    │
       │      │    │
       └──┬───┘    │
          │        │
       [Back] [Next]
          │    │   │
       Form2  │   │
             Valid?
                │  │
             ┌──┘  │
             │     │
             ▼     │
          ┌──────────┐
          │Form4     │
          │          │
          └──┬───┬───┘
             │   │
          [Back][Submit]
             │   │
          Form3  │
              Confirm?
                 │
             ┌───┘
             │
             ▼
        ┌─────────┐
        │ Save to │
        │Firebase │
        └────┬────┘
             │
          Success?
          ┌──┴──┐
          │     │
         YES   NO
          │     │
          ▼     ▼
    ┌────────┐ ┌──────┐
    │ Thank  │ │Error │
    │ You    │ │Modal │
    │ Modal  │ │      │
    └────┬───┘ └──────┘
         │
      Wait 3s
         │
         ▼
    ┌─────────┐
    │Redirect │
    │Home     │
    └─────────┘
```

---

## Firestore Document Structure Diagram

```
Firestore Project: daisysyete-c9511
│
└── Database (default)
    │
    └── Collections
        │
        └── survey_responses/  (auto-created on first write)
            │
            ├── aBc123XyZ/  (auto-generated document ID)
            │   │
            │   ├─ clientType: "citizen"  (string)
            │   ├─ date: "2025-11-28"  (string)
            │   ├─ age: 35  (number)
            │   ├─ serviceAvailed: "License Renewal"  (string)
            │   ├─ regionOfResidence: "Valenzuela"  (string)
            │   ├─ sex: "Male"  (string)
            │   │
            │   ├─ citizensCharter: (map/object)
            │   │   ├─ cc1: "1"
            │   │   ├─ cc2: "Easy to see"
            │   │   └─ cc3: "Helped very much"
            │   │
            │   ├─ serviceQuality: (map/object)
            │   │   ├─ sqd0: "5"
            │   │   ├─ sqd1: "5"
            │   │   ├─ sqd2: "4"
            │   │   ├─ sqd3: "5"
            │   │   ├─ sqd4: "5"
            │   │   ├─ sqd5: "4"
            │   │   ├─ sqd6: "5"
            │   │   ├─ sqd7: "5"
            │   │   └─ sqd8: "4"
            │   │
            │   ├─ feedback: (map/object)
            │   │   ├─ suggestions: "Better parking needed"
            │   │   └─ email: "user@example.com"
            │   │
            │   ├─ completionStatus: "completed"  (string)
            │   ├─ privacyAccepted: true  (boolean)
            │   ├─ submittedAt: Timestamp(2025-11-28T10:30:45Z)  ← Server-side
            │   ├─ ipAddress: "203.0.113.42"  (string)
            │   ├─ userAgent: "Mozilla/5.0..."  (string)
            │   └─ surveyVersion: "1.0"  (string)
            │
            ├── DeF456gHi/  (next document)
            │   └── ... (same structure)
            │
            └── ... (more documents)


FILE SIZE ESTIMATE:
┌──────────────────────────────────┐
│ Per Document:                    │
├──────────────────────────────────┤
│ Text fields: ~600 bytes          │
│ Metadata: ~300 bytes             │
│ ─────────────────────────────────│
│ Total per survey: ~1 KB          │
│                                  │
│ 1000 surveys: ~1 MB              │
│ 100,000 surveys: ~100 MB         │
└──────────────────────────────────┘
```

---

**Visual diagrams complete!**

Use these diagrams to understand:
- System architecture
- Data flow through the system
- Form progression logic
- Validation layers
- Duplicate prevention mechanism
- Security validation
- Firestore document structure
