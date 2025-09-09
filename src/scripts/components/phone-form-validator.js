// Phone Form Validator Component
import { DOMHelpers } from '../utils/dom-helpers.js';

export class PhoneFormValidator {
  constructor() {
    this.form = null;
    this.platformSelect = null;
    this.phoneInput = null;
    this.displayNameInput = null;
    this.validationRules = {
      platform: {
        required: true,
        validValues: ['phone', 'whatsapp']
      },
      phone: {
        required: true,
        minLength: 7,
        maxLength: 20,
        pattern: /^[\+]?[\d\s\-\(\)\.]+$/
      },
      displayName: {
        required: false,
        maxLength: 50
      }
    };
  }

  setupValidation() {
    // Get form elements
    this.form = DOMHelpers.$('#phone-form');
    this.platformSelect = DOMHelpers.$('#platform-select');
    this.phoneInput = DOMHelpers.$('#phone-input');
    this.displayNameInput = DOMHelpers.$('#display-name-input');

    if (!this.form || !this.platformSelect || !this.phoneInput) {
      console.error('Required form elements not found');
      return;
    }

    // Setup real-time validation
    this.attachValidationListeners();
  }

  attachValidationListeners() {
    // Platform validation
    if (this.platformSelect) {
      this.platformSelect.addEventListener('change', () => {
        this.validatePlatformField();
      });
    }

    // Phone number validation
    if (this.phoneInput) {
      this.phoneInput.addEventListener('input', () => {
        this.validatePhoneField();
      });

      this.phoneInput.addEventListener('blur', () => {
        this.validatePhoneField(true);
      });

      // Format phone number as user types
      this.phoneInput.addEventListener('input', (e) => {
        this.formatPhoneInput(e.target);
      });
    }

    // Display name validation
    if (this.displayNameInput) {
      this.displayNameInput.addEventListener('input', () => {
        this.validateDisplayNameField();
      });

      this.displayNameInput.addEventListener('blur', () => {
        this.validateDisplayNameField(true);
      });
    }
  }

  /**
   * Format phone input as user types
   */
  formatPhoneInput(input) {
    let value = input.value;
    const cursorPosition = input.selectionStart;
    
    // Remove all non-digit characters except + at the beginning
    let cleaned = value.replace(/[^\d+]/g, '');
    
    // Ensure + only appears at the beginning
    if (cleaned.includes('+')) {
      const plusIndex = cleaned.indexOf('+');
      if (plusIndex > 0) {
        cleaned = cleaned.substring(0, plusIndex) + cleaned.substring(plusIndex + 1);
      }
    }
    
    // Update input value if it changed
    if (value !== cleaned) {
      input.value = cleaned;
      // Try to maintain cursor position
      const newPosition = Math.min(cursorPosition, cleaned.length);
      input.setSelectionRange(newPosition, newPosition);
    }
  }

  /**
   * Validate platform field
   */
  validatePlatformField(showErrors = false) {
    if (!this.platformSelect) return { isValid: true };

    const value = this.platformSelect.value;
    const errorElement = DOMHelpers.$('#platform-error');

    // Clear previous states
    this.clearFieldValidation(this.platformSelect, errorElement);

    // Required field check
    if (!value) {
      if (showErrors) {
        this.showFieldError(this.platformSelect, errorElement, 'Platform selection is required');
      }
      return { isValid: false, error: 'Platform selection is required' };
    }

    // Validate platform value
    if (!this.validationRules.platform.validValues.includes(value)) {
      if (showErrors) {
        this.showFieldError(this.platformSelect, errorElement, 'Invalid platform selected');
      }
      return { isValid: false, error: 'Invalid platform selected' };
    }

    return { isValid: true, value: value };
  }

  /**
   * Validate phone number field
   */
  validatePhoneField(showErrors = false) {
    if (!this.phoneInput) return { isValid: true };

    const value = this.phoneInput.value.trim();
    const errorElement = DOMHelpers.$('#phone-error');
    const successElement = DOMHelpers.$('#phone-success');

    // Clear previous states
    this.clearFieldValidation(this.phoneInput, errorElement, successElement);

    // Required field check
    if (!value) {
      if (showErrors) {
        this.showFieldError(this.phoneInput, errorElement, 'Phone number is required');
      }
      return { isValid: false, error: 'Phone number is required' };
    }

    // Length validation
    if (value.length < this.validationRules.phone.minLength) {
      if (showErrors) {
        this.showFieldError(this.phoneInput, errorElement, 'Phone number is too short');
      }
      return { isValid: false, error: 'Phone number is too short' };
    }

    if (value.length > this.validationRules.phone.maxLength) {
      if (showErrors) {
        this.showFieldError(this.phoneInput, errorElement, 'Phone number is too long');
      }
      return { isValid: false, error: 'Phone number is too long' };
    }

    // Pattern validation
    if (!this.validationRules.phone.pattern.test(value)) {
      if (showErrors) {
        this.showFieldError(this.phoneInput, errorElement, 'Please enter a valid phone number');
      }
      return { isValid: false, error: 'Please enter a valid phone number' };
    }

    // Advanced phone number validation
    const phoneValidation = this.validatePhoneNumberFormat(value);
    if (!phoneValidation.isValid) {
      if (showErrors) {
        this.showFieldError(this.phoneInput, errorElement, phoneValidation.error);
      }
      return phoneValidation;
    }

    // Show success state
    if (showErrors) {
      this.showFieldSuccess(this.phoneInput, successElement, 'Valid phone number');
    }

    return { isValid: true, value: value };
  }

  /**
   * Validate display name field
   */
  validateDisplayNameField(showErrors = false) {
    if (!this.displayNameInput) return { isValid: true };

    const value = this.displayNameInput.value.trim();
    const errorElement = DOMHelpers.$('#display-name-error');

    // Clear previous states
    this.clearFieldValidation(this.displayNameInput, errorElement);

    // Optional field - empty is valid
    if (!value) {
      return { isValid: true, value: '' };
    }

    // Length validation
    if (value.length > this.validationRules.displayName.maxLength) {
      if (showErrors) {
        this.showFieldError(this.displayNameInput, errorElement, 
          `Display name cannot exceed ${this.validationRules.displayName.maxLength} characters`);
      }
      return { 
        isValid: false, 
        error: `Display name cannot exceed ${this.validationRules.displayName.maxLength} characters` 
      };
    }

    // Basic content validation
    if (value.length > 0 && value.length < 2) {
      if (showErrors) {
        this.showFieldError(this.displayNameInput, errorElement, 'Display name must be at least 2 characters');
      }
      return { isValid: false, error: 'Display name must be at least 2 characters' };
    }

    return { isValid: true, value: value };
  }

  /**
   * Advanced phone number format validation
   */
  validatePhoneNumberFormat(phone) {
    if (!phone) {
      return { isValid: false, error: 'Phone number is required' };
    }

    // Remove all non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Check if it's empty after cleaning
    if (cleanPhone.length === 0) {
      return { isValid: false, error: 'Please enter a valid phone number' };
    }

    // Check for multiple + signs
    const plusCount = (cleanPhone.match(/\+/g) || []).length;
    if (plusCount > 1) {
      return { isValid: false, error: 'Phone number can only have one + symbol at the beginning' };
    }

    // Check if + is not at the beginning
    if (cleanPhone.includes('+') && !cleanPhone.startsWith('+')) {
      return { isValid: false, error: '+ symbol must be at the beginning of the phone number' };
    }

    // Check for valid international format
    if (cleanPhone.startsWith('+')) {
      // International format: +[country code][number]
      const digits = cleanPhone.substring(1);
      if (digits.length < 7 || digits.length > 15) {
        return { isValid: false, error: 'International phone number must be 7-15 digits after country code' };
      }
      if (!/^\d+$/.test(digits)) {
        return { isValid: false, error: 'Phone number can only contain digits and + symbol' };
      }
    } else {
      // Domestic format
      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        return { isValid: false, error: 'Phone number must be 7-15 digits long' };
      }
      if (!/^\d+$/.test(cleanPhone)) {
        return { isValid: false, error: 'Phone number can only contain digits' };
      }
    }

    return { isValid: true };
  }

  /**
   * Show field error state
   */
  showFieldError(input, errorElement, message) {
    if (input) {
      input.classList.add('form-input-error');
    }
    if (errorElement) {
      DOMHelpers.setContent(errorElement, message);
      DOMHelpers.removeClass(errorElement, 'hidden');
    }
  }

  /**
   * Show field success state
   */
  showFieldSuccess(input, successElement, message) {
    if (input) {
      input.classList.remove('form-input-error');
    }
    if (successElement) {
      DOMHelpers.setContent(successElement, message);
      DOMHelpers.removeClass(successElement, 'hidden');
    }
  }

  /**
   * Clear field validation state
   */
  clearFieldValidation(input, errorElement, successElement = null) {
    if (input) {
      input.classList.remove('form-input-error');
    }
    if (errorElement) {
      DOMHelpers.addClass(errorElement, 'hidden');
      DOMHelpers.setContent(errorElement, '');
    }
    if (successElement) {
      DOMHelpers.addClass(successElement, 'hidden');
      DOMHelpers.setContent(successElement, '');
    }
  }

  /**
   * Validate entire form and return data
   */
  getFormData() {
    // Validate all fields
    const platformValidation = this.validatePlatformField(true);
    const phoneValidation = this.validatePhoneField(true);
    const displayNameValidation = this.validateDisplayNameField(true);

    // Check if all validations passed
    const isValid = platformValidation.isValid && phoneValidation.isValid && displayNameValidation.isValid;

    if (!isValid) {
      const errors = [];
      if (!platformValidation.isValid) errors.push(platformValidation.error);
      if (!phoneValidation.isValid) errors.push(phoneValidation.error);
      if (!displayNameValidation.isValid) errors.push(displayNameValidation.error);
      
      return {
        isValid: false,
        error: errors.join('. ')
      };
    }

    // Return validated data
    return {
      isValid: true,
      data: {
        platform: platformValidation.value,
        phone: phoneValidation.value,
        displayName: displayNameValidation.value || ''
      }
    };
  }

  /**
   * Reset form validation
   */
  reset() {
    if (this.form) {
      this.form.reset();
    }

    // Clear all validation states
    const platformError = DOMHelpers.$('#platform-error');
    const phoneError = DOMHelpers.$('#phone-error');
    const phoneSuccess = DOMHelpers.$('#phone-success');
    const displayNameError = DOMHelpers.$('#display-name-error');

    this.clearFieldValidation(this.platformSelect, platformError);
    this.clearFieldValidation(this.phoneInput, phoneError, phoneSuccess);
    this.clearFieldValidation(this.displayNameInput, displayNameError);
  }

  /**
   * Check if form is valid without showing errors
   */
  isFormValid() {
    const platformValidation = this.validatePlatformField(false);
    const phoneValidation = this.validatePhoneField(false);
    const displayNameValidation = this.validateDisplayNameField(false);
    
    return platformValidation.isValid && phoneValidation.isValid && displayNameValidation.isValid;
  }

  /**
   * Get current form values without validation
   */
  getCurrentValues() {
    return {
      platform: this.platformSelect ? this.platformSelect.value : 'phone',
      phone: this.phoneInput ? this.phoneInput.value.trim() : '',
      displayName: this.displayNameInput ? this.displayNameInput.value.trim() : ''
    };
  }
}
