// SMS Form Validator Component
import { DOMHelpers } from '../utils/dom-helpers.js';

export class SMSFormValidator {
  constructor() {
    this.fields = new Map();
    this.validationRules = {
      '#platform-select': {
        required: true,
        validator: this.validatePlatform.bind(this)
      },
      '#phone-input': {
        required: true,
        validator: this.validatePhone.bind(this)
      },
      '#message-input': {
        required: false,
        maxLength: 160,
        validator: this.validateMessage.bind(this)
      }
    };
  }

  /**
   * Setup validation for all SMS form fields
   */
  setupValidation() {
    Object.keys(this.validationRules).forEach(selector => {
      this.setupFieldValidator(selector);
    });

    // Setup real-time character counter for message
    const messageInput = DOMHelpers.$('#message-input');
    if (messageInput) {
      messageInput.addEventListener('input', () => {
        this.updateCharacterCount();
      });
    }

    // Setup platform change listener
    const platformSelect = DOMHelpers.$('#platform-select');
    if (platformSelect) {
      platformSelect.addEventListener('change', () => {
        this.updatePlatformHelp();
      });
    }

    // Initialize platform help text
    this.updatePlatformHelp();
  }

  /**
   * Setup individual field validator
   */
  setupFieldValidator(selector) {
    const field = DOMHelpers.$(selector);
    if (!field) return;

    // Store field reference
    this.fields.set(selector, {
      element: field,
      isValid: false,
      error: null,
      value: null
    });

    // Add event listeners
    field.addEventListener('input', () => this.validateField(selector));
    field.addEventListener('blur', () => this.validateField(selector));
  }

  /**
   * Update character count display
   */
  updateCharacterCount() {
    const messageInput = DOMHelpers.$('#message-input');
    const charCount = DOMHelpers.$('#char-count');
    
    if (!messageInput || !charCount) return;

    const count = messageInput.value.length;
    DOMHelpers.setContent(charCount, `${count}/160`);
    
    // Update color based on character count
    if (count > 160) {
      charCount.className = 'text-sm text-red-500 dark:text-red-400';
    } else if (count > 140) {
      charCount.className = 'text-sm text-yellow-500 dark:text-yellow-400';
    } else {
      charCount.className = 'text-sm text-gray-500 dark:text-gray-400';
    }
  }

  /**
   * Validate phone number field
   */
  validatePhone(value) {
    if (!value || value.trim().length === 0) {
      return { isValid: false, error: 'Phone number is required' };
    }

    const trimmedValue = value.trim();
    
    // Remove all non-digit characters except +
    const cleanPhone = trimmedValue.replace(/[^\d+]/g, '');
    
    // Check if it's empty after cleaning
    if (cleanPhone.length === 0) {
      return { isValid: false, error: 'Please enter a valid phone number' };
    }

    // Validate phone number format
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

    // Additional validation for common formats
    if (cleanPhone.length === 10 && /^\d{10}$/.test(cleanPhone)) {
      // US 10-digit format
      return { isValid: true, normalizedValue: trimmedValue };
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith('1') && /^1\d{10}$/.test(cleanPhone)) {
      // US 11-digit format with country code
      return { isValid: true, normalizedValue: trimmedValue };
    } else if (cleanPhone.startsWith('+') && cleanPhone.length >= 8 && cleanPhone.length <= 16) {
      // International format
      return { isValid: true, normalizedValue: trimmedValue };
    } else if (cleanPhone.length >= 7 && cleanPhone.length <= 15) {
      // Other valid formats
      return { isValid: true, normalizedValue: trimmedValue };
    }

    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  /**
   * Validate platform field
   */
  validatePlatform(value) {
    if (!value || value.trim().length === 0) {
      return { isValid: false, error: 'Please select a messaging platform' };
    }

    const validPlatforms = ['sms', 'whatsapp'];
    if (!validPlatforms.includes(value)) {
      return { isValid: false, error: 'Please select a valid messaging platform' };
    }

    return { isValid: true, normalizedValue: value };
  }

  /**
   * Validate message field
   */
  validateMessage(value) {
    // Message is optional, so empty is valid
    if (!value) {
      return { isValid: true, normalizedValue: '' };
    }

    // Check character limit
    if (value.length > 160) {
      return { isValid: false, error: 'Message cannot exceed 160 characters' };
    }

    // Check for problematic characters that might cause issues
    if (value.includes('\n') && value.split('\n').length > 5) {
      return { isValid: false, error: 'Message has too many line breaks' };
    }

    return { isValid: true, normalizedValue: value };
  }

  /**
   * Validate individual field
   */
  validateField(selector) {
    const fieldData = this.fields.get(selector);
    const rules = this.validationRules[selector];
    
    if (!fieldData || !rules) return { isValid: false, error: 'Field not found' };

    const value = fieldData.element.value;
    let result = { isValid: true, normalizedValue: value };

    // Check required field
    if (rules.required && (!value || value.trim().length === 0)) {
      result = { isValid: false, error: 'This field is required' };
    } else if (rules.validator) {
      // Run custom validator if provided
      result = rules.validator(value);
    }

    // Update field data
    fieldData.isValid = result.isValid;
    fieldData.error = result.error || null;
    fieldData.value = result.normalizedValue || value;

    // Update UI
    this.updateFieldUI(selector, result);

    return result;
  }

  /**
   * Validate all fields
   */
  validateAll() {
    const results = {};
    let allValid = true;

    Object.keys(this.validationRules).forEach(selector => {
      const result = this.validateField(selector);
      results[selector] = result;
      if (!result.isValid) {
        allValid = false;
      }
    });

    return {
      isValid: allValid,
      results: results
    };
  }

  /**
   * Update platform help text based on selected platform
   */
  updatePlatformHelp() {
    const platformSelect = DOMHelpers.$('#platform-select');
    const helpText = DOMHelpers.$('#platform-select').parentElement.querySelector('.text-sm.text-gray-600');
    
    if (!platformSelect || !helpText) return;

    const platform = platformSelect.value;
    let helpMessage = 'Choose which messaging platform the QR code should open';
    
    if (platform === 'sms') {
      helpMessage = 'QR code will open the default SMS app with pre-filled message';
    } else if (platform === 'whatsapp') {
      helpMessage = 'QR code will open WhatsApp with pre-filled message (WhatsApp must be installed)';
    }
    
    DOMHelpers.setContent(helpText, helpMessage);
  }

  /**
   * Update field UI based on validation result
   */
  updateFieldUI(selector, result) {
    const field = DOMHelpers.$(selector);
    let errorElement;
    
    // Handle different error element patterns
    if (selector === '#platform-select') {
      errorElement = DOMHelpers.$('#platform-error');
    } else {
      errorElement = DOMHelpers.$(selector.replace('-input', '-error'));
    }
    
    if (!field) return;

    // Remove existing validation classes
    field.classList.remove('border-red-500', 'border-green-500', 'focus:ring-red-500', 'focus:ring-green-500');

    if (result.isValid) {
      // Valid state - only show green for non-empty fields
      if (field.value.trim().length > 0) {
        field.classList.add('border-green-500', 'focus:ring-green-500');
      }
      this.clearFieldError(selector);
    } else {
      // Invalid state
      field.classList.add('border-red-500', 'focus:ring-red-500');
      this.showFieldError(selector, result.error);
    }
  }

  /**
   * Show field error
   */
  showFieldError(selector, message) {
    let errorElement;
    if (selector === '#platform-select') {
      errorElement = DOMHelpers.$('#platform-error');
    } else {
      errorElement = DOMHelpers.$(selector.replace('-input', '-error'));
    }
    
    if (errorElement) {
      DOMHelpers.setContent(errorElement, message);
      errorElement.classList.remove('hidden');
    }
  }

  /**
   * Clear field error
   */
  clearFieldError(selector) {
    let errorElement;
    if (selector === '#platform-select') {
      errorElement = DOMHelpers.$('#platform-error');
    } else {
      errorElement = DOMHelpers.$(selector.replace('-input', '-error'));
    }
    
    if (errorElement) {
      errorElement.classList.add('hidden');
      DOMHelpers.setContent(errorElement, '');
    }
  }

  /**
   * Get field value
   */
  getFieldValue(selector) {
    const fieldData = this.fields.get(selector);
    return fieldData ? fieldData.value : null;
  }

  /**
   * Set field value
   */
  setFieldValue(selector, value) {
    const field = DOMHelpers.$(selector);
    if (field) {
      field.value = value;
      this.validateField(selector);
      
      // Update character count if it's the message field
      if (selector === '#message-input') {
        this.updateCharacterCount();
      }
    }
  }

  /**
   * Reset all fields
   */
  reset() {
    this.fields.forEach((fieldData, selector) => {
      fieldData.element.value = '';
      fieldData.isValid = false;
      fieldData.error = null;
      fieldData.value = null;
      
      // Reset UI
      fieldData.element.classList.remove('border-red-500', 'border-green-500', 'focus:ring-red-500', 'focus:ring-green-500');
      this.clearFieldError(selector);
    });

    // Reset character counter
    this.updateCharacterCount();
  }

  /**
   * Get all form data
   */
  getFormData() {
    const validation = this.validateAll();
    if (!validation.isValid) {
      // Find first error to show
      const firstError = Object.values(validation.results).find(result => !result.isValid);
      return { 
        isValid: false, 
        error: firstError ? firstError.error : 'Form validation failed' 
      };
    }

    return {
      isValid: true,
      data: {
        platform: this.getFieldValue('#platform-select'),
        phone: this.getFieldValue('#phone-input'),
        message: this.getFieldValue('#message-input') || ''
      }
    };
  }

  /**
   * Format phone number for display
   */
  formatPhoneForDisplay(phone) {
    if (!phone) return '';
    
    // Remove all non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Format US numbers
    if (cleanPhone.length === 10 && /^\d{10}$/.test(cleanPhone)) {
      return `(${cleanPhone.substring(0, 3)}) ${cleanPhone.substring(3, 6)}-${cleanPhone.substring(6)}`;
    } else if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
      const digits = cleanPhone.substring(1);
      return `+1 (${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
    }
    
    return phone; // Return original if no formatting applied
  }
}
