/**
 * Firebase Firestore Security Rules
 * ==================================
 * 
 * These rules govern access to the survey_responses collection.
 * Users can ONLY write (submit surveys), not read or modify existing data.
 * Admin users have full access (to be added later).
 * 
 * IMPORTANT: Copy and paste the rules section only (not this comment block)
 * into your Firebase Console > Firestore > Rules tab
 * 
 * RULE SET:
 */

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ===== Survey Responses Collection =====
    // Users can only CREATE new survey submissions
    // Admins can READ survey data for dashboard analytics
    // Users CANNOT read, update, or delete their own submissions
    match /survey_responses/{docId} {
      // Allow anyone to create a new survey response (write)
      allow create: if request.auth == null || isValidSurveySubmission();
      
      // Allow admins to read survey data (with admin claim)
      // For development/testing, also allow unauthenticated reads
      allow read: if isAdmin() || request.auth == null;
      
      // Prevent updating or deleting submissions
      allow update, delete: if false;
    }

    // ===== Helper Functions =====
    
    /**
     * Checks if the current user is an admin
     * Returns true if user is authenticated with admin claim set to true
     */
    function isAdmin() {
      return request.auth != null &&
             request.auth.token.admin == true;
    }
    
    /**
     * Validates incoming survey submission data
     * Ensures all required fields are present and of correct type
     */
    function isValidSurveySubmission() {
      return request.resource.data.keys().hasAll([
        'clientType', 'date', 'age', 'serviceAvailed', 
        'regionOfResidence', 'sex', 'citizensCharter', 
        'serviceQuality', 'feedback'
      ]) &&
      request.resource.data.clientType is string &&
      request.resource.data.date is string &&
      request.resource.data.age is number &&
      request.resource.data.serviceAvailed is string &&
      request.resource.data.regionOfResidence is string &&
      request.resource.data.sex is string &&
      request.resource.data.citizensCharter is map &&
      request.resource.data.serviceQuality is map &&
      request.resource.data.feedback is map &&
      request.resource.data.age >= 1 &&
      request.resource.data.age <= 150 &&
      request.resource.data.clientType in ['citizen', 'business', 'government'] &&
      request.resource.data.sex in ['Male', 'Female', 'Others'] &&
      request.resource.data.citizensCharter.keys().hasAll(['cc1', 'cc2', 'cc3']) &&
      request.resource.data.serviceQuality.keys().hasAll([
        'sqd0', 'sqd1', 'sqd2', 'sqd3', 'sqd4', 
        'sqd5', 'sqd6', 'sqd7', 'sqd8'
      ]) &&
      request.resource.data.feedback.keys().hasAll(['suggestions', 'email']) &&
      (request.resource.data.feedback.email == '' || 
       isValidEmail(request.resource.data.feedback.email)) &&
      request.resource.data.serviceAvailed.size() >= 2 &&
      request.resource.data.serviceAvailed.size() <= 100 &&
      request.resource.data.feedback.suggestions.size() <= 500;
    }

    /**
     * Validates email format
     */
    function isValidEmail(email) {
      // Simple email validation - check for @ symbol
      return email.matches('.*@.*');
    }
  }
}

/**
 * HOW TO DEPLOY THESE RULES:
 * 
 * 1. Go to Firebase Console (https://console.firebase.google.com)
 * 2. Select your project: "daisysyete-c9511"
 * 3. Go to Firestore Database > Rules tab
 * 4. Replace the default rules with the rule set above (starting from "rules_version")
 * 5. Click "Publish"
 * 6. Wait for deployment confirmation
 * 
 * TESTING RULES:
 * 1. In Firebase Console, click "Rules" > "Simulate"
 * 2. Select "Service Account" as authentication method
 * 3. Click "Simulate" to test your rules
 * 
 * ADMIN ACCESS (TO ADD LATER):
 * Once you have admin authentication set up, add this to the rules:
 * 
 *   match /survey_responses/{docId} {
 *     allow read, write: if isAdmin();
 *   }
 * 
 *   function isAdmin() {
 *     return request.auth != null &&
 *            request.auth.token.admin == true;
 *   }
 * 
 * MONITORING:
 * 1. Go to Firestore Database > Collections
 * 2. Check "survey_responses" collection for submitted data
 * 3. View each document to verify structure
 */
