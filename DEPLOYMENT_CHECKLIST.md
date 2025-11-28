# Survey Backend - Deployment Checklist

## 📋 Pre-Deployment Verification

Before going live, complete this checklist:

### File Structure ✓
- [ ] firebase-config.js exists in project root
- [ ] survey-validation.js exists in project root
- [ ] survey-submission.js exists in project root
- [ ] survey.html is updated with new module imports
- [ ] All 4 files are in same directory

### Browser Testing ✓
- [ ] Test in Chrome (latest version)
- [ ] Test in Firefox (latest version)
- [ ] Test in Safari (if available)
- [ ] Test on mobile browser
- [ ] Open DevTools console (F12) - no red errors
- [ ] Open DevTools Network tab - no failed requests

### Form Validation ✓
- [ ] Fill Form 1 with valid data, click Next → No errors
- [ ] Fill Form 1 with invalid data, click Next → Shows error messages
- [ ] Age field: 0 shows error, 1 works, 150 works, 151 shows error
- [ ] Email field: Can be empty (optional), "test@test.com" works, "invalid" shows error
- [ ] CC1 = "unaware" → CC2 & CC3 auto-filled with N/A
- [ ] All SQD questions require answer

### End-to-End Test ✓
- [ ] Open survey.html in fresh browser tab
- [ ] Accept privacy notice
- [ ] Fill all 4 forms completely
- [ ] No validation errors
- [ ] Click "Submit Survey"
- [ ] See confirmation modal
- [ ] Click "Submit Survey" in confirmation
- [ ] See "Thank You" modal
- [ ] Redirected to home page after 3 seconds

---

## 🔥 CRITICAL: Firebase Setup (Must Do This!)

### Deploy Security Rules (Required)

**These rules control WHO can submit and WHAT data is allowed**

#### Step 1: Open Firebase Console
```
https://console.firebase.google.com
Select Project: daisysyete-c9511
```

#### Step 2: Navigate to Firestore Rules
```
Firestore Database → Rules (top tab)
```

#### Step 3: Copy Security Rules
```
Location: FIREBASE_SECURITY_RULES.md
Copy: Everything from "rules_version = '2'" onwards
```

#### Step 4: Paste & Replace
```
In Firebase Console Rules editor:
1. Select ALL existing text (Ctrl+A)
2. Delete old rules
3. Paste new rules
4. Review syntax (should highlight correctly)
```

#### Step 5: Publish Rules
```
Click: PUBLISH button (top right)
Wait: "Rules updated successfully" message
Time: 1-2 minutes for deployment
```

#### Verify Deployment
```
Go to: Firestore Database → Collections
Should see: "survey_responses" (empty)
If error: Check rules have no syntax errors
```

---

## 🧪 Firestore Configuration

### Create Collection (Automatic)
- Don't manually create collection
- Firestore auto-creates on first write
- First survey submission creates "survey_responses"

### Indexes Setup
- No manual indexes needed for basic queries
- Firestore auto-indexes single-field queries
- For analytics later: May add composite indexes

### Backup Configuration
- Enable automatic backups
- Firebase Console → Firestore → Backups
- Recommended: Daily backups, 30-day retention

---

## 📤 Production Deployment

### Step 1: Upload Files
```
Upload to web hosting:
├── firebase-config.js
├── survey-validation.js
├── survey-submission.js
└── survey.html (updated)

Ensure all files in same directory
```

### Step 2: Verify Paths
```html
<!-- In survey.html, check script imports are correct -->
<script type="module">
  import { ... } from './survey-submission.js';
  import { ... } from './firebase-config.js';
</script>
```

### Step 3: Test Live
```
1. Open production survey.html
2. Complete full submission
3. Check Firebase Console → survey_responses
4. Verify document appears with correct data
```

### Step 4: Monitor for 24 Hours
```
- Watch for submission errors
- Monitor Firestore write volume
- Check for any console errors
- Verify duplicate prevention works
```

---

## 🔍 Security Checklist

- [ ] Firestore rules deployed (not just saved)
- [ ] Rules only allow CREATE (no READ/UPDATE/DELETE)
- [ ] No authentication required for users
- [ ] Admin authentication ready for Phase 2
- [ ] Email validation prevents invalid formats
- [ ] Age validation prevents unrealistic values
- [ ] Duplicate prevention active (5-min window)
- [ ] XSS sanitization enabled
- [ ] Server-side timestamps enabled
- [ ] IP logging enabled
- [ ] User Agent tracking enabled

---

## 📊 Monitoring Plan

### Daily Monitoring
```
Time: Every morning
Check: Firebase Console → Usage
Look for:
- Number of writes (expected: ~0-100 per day)
- Any write errors (should be 0)
- Storage size (should be minimal)
```

### Weekly Monitoring
```
Time: Every Sunday evening
Tasks:
1. Review survey_responses collection
2. Check for suspicious patterns
3. Verify duplicate prevention is working
4. Export sample of data
5. Check sentiment of feedback
```

### Monthly Monitoring
```
Time: End of month
Tasks:
1. Compile submission statistics
2. Analyze satisfaction scores by region
3. Review suggestions for improvements
4. Plan next month's admin features
```

---

## 🚨 Incident Response Plan

### If Surveys Stop Saving

**1. Check Firestore Rules (First!)**
```
Firebase Console → Firestore → Rules
Verify: rules contain "allow create: if isValidSurveySubmission()"
Try: Click "Publish" again (even if already published)
Wait: 1-2 minutes
```

**2. Check Firestore Status**
```
Firebase Status: https://status.firebase.google.com
If issues: Wait for Firebase to recover
```

**3. Check Browser Console**
```
F12 → Console tab
Look for: Red error messages
Copy: Full error text
Search: Firebase documentation
```

**4. Fallback Plan**
```
If Firebase down:
1. Show user message: "Service temporarily unavailable"
2. Tell them: "Try again in 5 minutes"
3. Monitor: Watch Firebase status page
```

### If Validation Not Working

**1. Clear Browser Cache**
```
Ctrl+Shift+Delete (Windows)
Cmd+Shift+Delete (Mac)
Clear: All time
Reload: survey.html
```

**2. Check Field Names**
```
HTML: <input name="age" />
JS: FIELD_RULES["age"]
Must: Match exactly
```

**3. Check Console for Errors**
```
F12 → Console
Should see: No red errors
Should see: "Validation passed" messages
```

### If Duplicate Prevention Not Working

**1. Clear localStorage**
```
F12 → Application → Local Storage
Delete all entries starting with: "lastSurveySubmission_"
Try submitting again
```

**2. Check Time Window**
```
Default: 5 minutes
Edit: In firebase-config.js → checkDuplicateSubmission()
Change: minutesWindow parameter
```

---

## 📋 Launch Checklist

### Week Before Launch
- [ ] All files created and tested locally
- [ ] Firebase project configured
- [ ] Security rules ready to deploy
- [ ] Documentation reviewed
- [ ] Team trained on monitoring

### Day Before Launch
- [ ] Files uploaded to production
- [ ] Firestore rules prepared (not deployed yet)
- [ ] Test survey submitted to production
- [ ] Backup of current system
- [ ] Team on standby

### Launch Day
- [ ] Announce to users: Survey now available
- [ ] Monitor console for errors
- [ ] Watch Firestore writes come in
- [ ] Test first submission manually
- [ ] Keep team available for 8 hours

### First Week After Launch
- [ ] Daily monitoring of submissions
- [ ] Check for validation failures
- [ ] Review user feedback
- [ ] Monitor Firestore usage
- [ ] Document any issues

---

## ✨ Post-Launch Enhancements (Phase 2)

### Week 2-4:
- [ ] Create admin dashboard (read-only)
- [ ] Add email notification for admins
- [ ] Implement CSV export
- [ ] Set up automated daily reports
- [ ] Add Google Analytics tracking

### Month 2:
- [ ] Advanced analytics dashboards
- [ ] Survey data visualization
- [ ] Satisfaction trends over time
- [ ] Regional comparison analysis
- [ ] Automated improvement recommendations

### Quarter 2:
- [ ] Multi-language survey support
- [ ] Mobile app integration
- [ ] Real-time notifications for complaints
- [ ] Sentiment analysis of feedback
- [ ] Integration with ticketing system

---

## 🎓 Team Training

### For Developers
```
Topics to cover:
1. How validation works (client + server)
2. How submission flow works
3. How to monitor Firestore
4. How to handle errors
5. How to update security rules
```

### For Support Team
```
Common Issues:
1. "Survey won't submit" → Check Firestore status
2. "Validation errors appearing" → Clear browser cache
3. "Can't submit twice" → Explain 5-minute rule
4. "Data not showing up" → Check Firestore directly
```

### For Admin Team
```
Access Required:
1. Firebase Console access (read-only initially)
2. Can view survey responses
3. Can export data to CSV
4. Cannot modify or delete data
```

---

## 📞 Emergency Contacts

### If Firebase is Down
- Check: https://status.firebase.google.com
- Contact: Firebase Support (requires paid plan for priority)
- Workaround: Manual data collection form

### If Website is Compromised
- Disable: Survey temporarily
- Check: All code for malicious injections
- Restore: From clean backup
- Update: All security rules

### If Data is Leaked
- Notify: All users immediately
- Disable: Survey submissions
- Check: Firestore logs for suspicious access
- Implement: Encryption at rest

---

## ✅ Final Verification

Before declaring "LIVE":

- [ ] All 3 JavaScript files uploaded
- [ ] survey.html updated with imports
- [ ] Firestore rules deployed and published
- [ ] First test survey creates document in Firestore
- [ ] No errors in browser console
- [ ] Duplicate prevention blocks second submission
- [ ] Email validation working
- [ ] Age validation working
- [ ] All 4 forms validate correctly
- [ ] Mobile browser works (iOS & Android)
- [ ] Thank you message displays
- [ ] User redirects to home page
- [ ] All team members trained
- [ ] Monitoring plan in place

---

## 🚀 Go-Live Decision

**When to launch:**
✓ All checklist items completed  
✓ Team trained and ready  
✓ Monitoring plan active  
✓ Incident response plan documented  
✓ Backup and recovery tested  

**When NOT to launch:**
✗ Firebase rules not deployed  
✗ Files not uploaded to production  
✗ Validation not working in testing  
✗ Team not trained  
✗ No monitoring plan  

---

## 📝 Post-Launch Metrics

Track these metrics:

```
Daily:
- Total submissions
- Validation errors
- Duplicate submissions blocked
- Average satisfaction score (sqd0)

Weekly:
- Submissions by region
- Suggestions count
- Email collection rate
- Error types

Monthly:
- Satisfaction trends
- Regional comparisons
- Improvement areas
- Admin workload
```

---

**System is ready for launch when all sections above are green ✓**

**Expected live date: [Your date here]**  
**Deployed by: [Your name]**  
**Reviewed by: [Manager name]**  

---

**Thank you for using this survey backend system!**

For questions or issues, see: README_SURVEY_BACKEND.md
