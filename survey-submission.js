/**
 * Survey Submission Handler
 * ======================================
 * 
 * Manages form progression, validation, and submission to Firebase.
 * Integrates client-side validation with Firebase backend.
 */

import {
  validateField,
  validateForm,
  sanitizeFormData,
  showFieldError,
  clearFieldError,
  clearAllErrors,
  collectFormData,
  formatSurveyForStorage
} from './survey-validation.js';

import {
  saveSurveyResponse,
  checkDuplicateSubmission,
  markSubmissionTime
} from './firebase-config.js';

/**
 * Global survey state
 */
const surveyState = {
  currentForm: 1,
  totalForms: 4,
  formData: {
    form1: {},
    form2: {},
    form3: {},
    form4: {}
  },
  isSubmitting: false
};

/**
 * Initialize survey submission handlers
 * Call this on survey.html page load
 */
export function initializeSurveyHandlers() {
  // Set up form validation on input change
  setupFieldValidation();

  // Set up form navigation
  setupFormNavigation();

  // Render SQD (Service Quality) questions for Form 3
  if (window.renderSQDQuestions) {
    window.renderSQDQuestions();
  }

  // Privacy checkbox handler
  const privacyCheckbox = document.getElementById('privacy-checkbox');
  if (privacyCheckbox) {
    privacyCheckbox.addEventListener('change', handlePrivacyCheckboxChange);
  }
}

/**
 * Set up real-time field validation
 */
function setupFieldValidation() {
  const allInputs = document.querySelectorAll('input, select, textarea');

  allInputs.forEach((input) => {
    input.addEventListener('blur', handleFieldValidation);
    input.addEventListener('change', handleFieldValidation);
  });
}

/**
 * Handle individual field validation on blur/change
 * 
 * @param {Event} event
 */
function handleFieldValidation(event) {
  const field = event.target;
  const fieldName = field.name;

  if (!fieldName) return;

  const value = field.type === 'radio' || field.type === 'checkbox'
    ? field.checked ? field.value : ''
    : field.value;

  const validation = validateField(fieldName, value, surveyState.formData);

  if (validation.valid) {
    clearFieldError(fieldName);
  } else {
    showFieldError(fieldName, validation.error);
  }
}

/**
 * Set up form navigation buttons
 */
function setupFormNavigation() {
  const backButton = document.getElementById('back-button');
  const nextButton = document.getElementById('next-button');
  const form1HomeLink = document.getElementById('form1-home-link');

  if (backButton) {
    backButton.addEventListener('click', (e) => {
      e.preventDefault();
      goToPreviousForm();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      goToNextForm();
    });
  }

  if (form1HomeLink) {
    form1HomeLink.addEventListener('click', (e) => {
      e.preventDefault();
      goToHome();
    });
  }
}

/**
 * Handle privacy checkbox
 * 
 * @param {Event} event
 */
function handlePrivacyCheckboxChange(event) {
  const proceedBtn = document.getElementById('proceed-btn');
  if (proceedBtn) {
    if (event.target.checked) {
      proceedBtn.disabled = false;
      proceedBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      proceedBtn.disabled = true;
      proceedBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
  }
}

/**
 * Validate and proceed to next form
 * 
 * @param {number} formNumber - Current form number (1-4)
 */
export function validateFormAndProceed(formNumber) {
  const form = document.getElementById(`form-${formNumber}`);
  if (!form) {
    console.error(`Form ${formNumber} not found`);
    return;
  }

  // Collect form data
  const formData = collectFormData(`form-${formNumber}`);
  surveyState.formData[`form${formNumber}`] = formData;

  // Define required fields for each form
  const requiredFields = getRequiredFieldsForForm(formNumber);

  // Validate form
  const { valid, errors } = validateForm(formData, requiredFields);

  // Clear previous errors
  clearAllErrors(errors);

  if (!valid) {
    // Show all errors
    Object.entries(errors).forEach(([fieldName, errorMsg]) => {
      showFieldError(fieldName, errorMsg);
    });

    // Scroll to first error
    const firstErrorField = document.querySelector(`[name="${Object.keys(errors)[0]}"]`);
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return false;
  }

  // Validation passed
  goToNextForm();
  return true;
}

/**
 * Get required fields for each form
 * 
 * @param {number} formNumber
 * @returns {Array}
 */
function getRequiredFieldsForForm(formNumber) {
  const fieldsByForm = {
    1: ['clientType', 'date', 'age', 'serviceAvailed', 'regionOfResidence', 'sex'],
    2: ['cc1', 'cc2', 'cc3'],
    3: ['sqd0', 'sqd1', 'sqd2', 'sqd3', 'sqd4', 'sqd5', 'sqd6', 'sqd7', 'sqd8'],
    4: [] // Form 4 has no required fields
  };

  return fieldsByForm[formNumber] || [];
}

/**
 * Navigate to next form
 */
function goToNextForm() {
  if (surveyState.currentForm < surveyState.totalForms) {
    hideAllForms();
    surveyState.currentForm++;
    showForm(surveyState.currentForm);
    updateProgressBar();
    scrollToTop();
  }
}

/**
 * Navigate to previous form
 */
function goToPreviousForm() {
  if (surveyState.currentForm > 1) {
    hideAllForms();
    surveyState.currentForm--;
    showForm(surveyState.currentForm);
    updateProgressBar();
    scrollToTop();
  }
}

/**
 * Hide all forms
 */
function hideAllForms() {
  for (let i = 1; i <= surveyState.totalForms; i++) {
    const form = document.getElementById(`form-${i}`);
    if (form) form.classList.add('hidden');
  }
}

/**
 * Show specific form
 * 
 * @param {number} formNumber
 */
function showForm(formNumber) {
  const form = document.getElementById(`form-${formNumber}`);
  if (form) {
    form.classList.remove('hidden');

    // Show/hide header
    const header = document.getElementById('survey-header');
    if (formNumber > 1) {
      header.classList.remove('hidden');
    } else {
      header.classList.add('hidden');
    }

    // Show/hide next button
    const nextButton = document.getElementById('next-button');
    if (nextButton) {
      if (formNumber < surveyState.totalForms) {
        nextButton.classList.add('hidden');
      } else {
        nextButton.classList.add('hidden');
      }
    }
  }
}

/**
 * Update progress bar
 */
function updateProgressBar() {
  const progress = (surveyState.currentForm / surveyState.totalForms) * 100;
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  if (progressText) {
    progressText.textContent = `${Math.round(progress)}% Complete`;
  }
}

/**
 * Scroll to top of page
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Handle final survey submission
 */
export async function submitSurvey() {
  if (surveyState.isSubmitting) return;

  // Collect form 4 data (optional fields)
  const form4Data = collectFormData('form-4');
  surveyState.formData.form4 = form4Data;

  // Validate form 4 before submission
  const { valid: isForm4Valid, errors: form4Errors } = validateForm(form4Data, ['suggestions', 'email']);
  
  if (!isForm4Valid) {
    // Show all validation errors
    Object.entries(form4Errors).forEach(([fieldName, errorMsg]) => {
      showFieldError(fieldName, errorMsg);
    });

    // Scroll to first error field
    const firstErrorFieldName = Object.keys(form4Errors)[0];
    const firstErrorField = document.querySelector(`[name="${firstErrorFieldName}"]`);
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return; // Don't proceed with submission
  }

  try {
    surveyState.isSubmitting = true;

    // Format data for storage
    const surveyData = formatSurveyForStorage(
      surveyState.formData.form1,
      surveyState.formData.form2,
      surveyState.formData.form3,
      surveyState.formData.form4
    );

    // Sanitize all string fields
    const sanitizedData = sanitizeFormData(surveyData);

    // Check for duplicate submissions
    const isDuplicate = await checkDuplicateSubmission(
      sanitizedData.clientType,
      sanitizedData.feedback.email
    );

    if (isDuplicate) {
      showError('You have already submitted a survey recently. Please wait a few minutes before submitting again.');
      surveyState.isSubmitting = false;
      return;
    }

    // Save to Firebase
    const result = await saveSurveyResponse(sanitizedData);

    if (result.success) {
      // Mark submission time
      markSubmissionTime(sanitizedData.clientType, sanitizedData.feedback.email);

      // Show success modal
      showSuccessModal();

      // Reset survey state
      resetSurveyState();

      // Redirect after delay
      setTimeout(() => {
        goToHome();
      }, 3000);
    } else {
      showError(result.error || 'Failed to submit survey. Please try again.');
    }
  } catch (error) {
    console.error('Survey submission error:', error);
    showError('An unexpected error occurred. Please try again.');
  } finally {
    surveyState.isSubmitting = false;
  }
}

/**
 * Show error modal
 * 
 * @param {string} message
 */
function showError(message) {
  // Use browser alert as fallback
  alert(message);

  // Alternatively, create custom error modal
  const errorDiv = document.createElement('div');
  errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

/**
 * Show success modal
 */
function showSuccessModal() {
  const modal = document.getElementById('thank-you-modal');
  if (modal) {
    showModal('thank-you-modal');
  }
}

/**
 * Reset survey state after submission
 */
function resetSurveyState() {
  surveyState.currentForm = 1;
  surveyState.formData = {
    form1: {},
    form2: {},
    form3: {},
    form4: {}
  };
}

/**
 * Navigate to home page
 */
export function goToHome() {
  window.location.href = '/index.html';
}

/**
 * Handle confirmation modal before final submission
 */
export function showConfirmationBeforeSubmit() {
  const modal = document.getElementById('submit-confirm-modal');
  if (modal) {
    showModal('submit-confirm-modal');
  }
}

/**
 * Complete survey after confirmation
 */
export async function completeSurvey() {
  const modal = document.getElementById('submit-confirm-modal');
  if (modal) {
    closeModal('submit-confirm-modal');
  }
  await submitSurvey();
}

/**
 * Proceed to survey after privacy notice acceptance
 */
export function proceedToSurvey() {
  const privacyModal = document.getElementById('data-privacy-modal');
  if (privacyModal) {
    closeModal('data-privacy-modal');
  }
  goToNextForm();
}

/**
 * Show modal helper (reuses existing modal functions)
 * 
 * @param {string} modalId
 */
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
  }
}

/**
 * Close modal helper
 * 
 * @param {string} modalId
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Handle special SQD conditional validation (cc2, cc3 depend on cc1)
 */
export function handleCC1Change(value) {
  // If user selects "unaware" (value 4), disable cc2 and cc3
  const cc2Container = document.querySelector('[name="cc2"]')?.closest('.form-section');
  const cc3Container = document.querySelector('[name="cc3"]')?.closest('.form-section');

  if (value === '4') {
    // Disable and set to N/A
    if (cc2Container) cc2Container.classList.add('opacity-50', 'pointer-events-none');
    if (cc3Container) cc3Container.classList.add('opacity-50', 'pointer-events-none');

    // Auto-select N/A for both
    const cc2NA = document.getElementById('cc2-na');
    const cc3NA = document.getElementById('cc3-na');
    if (cc2NA) cc2NA.checked = true;
    if (cc3NA) cc3NA.checked = true;
  } else {
    // Enable fields
    if (cc2Container) cc2Container.classList.remove('opacity-50', 'pointer-events-none');
    if (cc3Container) cc3Container.classList.remove('opacity-50', 'pointer-events-none');
  }
}

// Export survey state for debugging
export { surveyState };
