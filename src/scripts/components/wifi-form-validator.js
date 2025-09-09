// WiFi Form Validator Component
import { DOMHelpers } from '../utils/dom-helpers.js';

export class WiFiFormValidator {
  constructor() {
    this.fields = new Map();
    this.validationRules = {
      '#ssid-input': {
        required: true,
        maxLength: 32,
        validator: this.validateSSID.bind(this)
      },
      '#password-input': {
        required: false, // Conditional based on security type
        validator: this.validatePassword.bind(this)
      },
      '#security-select': {
        required: true,
        validator: this.validateSecurity.bind(this)
      }
    };
  }

  /**
   * Setup validation for all WiFi form fields
   */
  setupValidation() {
    Object.keys(this.validationRules).forEach(selector => {
      this.setupFieldValidator(selector);
    });

    // Setup security type change handler
    const securitySelect = DOMHelpers.$('#security-select');
    if (securitySelect) {
      securitySelect.addEventListener('change', () => {
        this.handleSecurityTypeChange();
        this.validateField('#password-input');
      });
    }

    // Setup show/hide password toggle
    const showPasswordCheckbox = DOMHelpers.$('#show-password');
    const passwordInput = DOMHelpers.$('#password-input');
    if (showPasswordCheckbox && passwordInput) {
      showPasswordCheckbox.addEventListener('change', () => {
        passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
      });
    }
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
   * Handle security type change
   */
  handleSecurityTypeChange() {
    const securitySelect = DOMHelpers.$('#security-select');
    const passwordInput = DOMHelpers.$('#password-input');
    const passwordLabel = DOMHelpers.$('label[for="password-input"]');
    
    if (!securitySelect || !passwordInput) return;

    const isOpenNetwork = securitySelect.value === 'nopass';
    
    // Update password field requirements
    passwordInput.required = !isOpenNetwork;
    
    // Update label to indicate if password is required
    if (passwordLabel) {
      const labelText = isOpenNetwork ? 'Password' : 'Password *';
      passwordLabel.textContent = labelText;
    }

    // Clear password if switching to open network
    if (isOpenNetwork && passwordInput.value) {
      passwordInput.value = '';
      this.clearFieldError('#password-input');
    }

    // Update placeholder
    passwordInput.placeholder = isOpenNetwork 
      ? 'No password required for open network' 
      : 'Enter WiFi password';
    
    // Disable/enable password field
    passwordInput.disabled = isOpenNetwork;
    
    if (isOpenNetwork) {
      passwordInput.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      passwordInput.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }

  /**
   * Validate SSID field
   */
  validateSSID(value) {
    if (!value || value.trim().length === 0) {
      return { isValid: false, error: 'Network name is required' };
    }

    const trimmedValue = value.trim();
    
    if (trimmedValue.length > 32) {
      return { isValid: false, error: 'Network name cannot exceed 32 characters' };
    }

    // Check for invalid characters (basic validation)
    if (trimmedValue.includes('\n') || trimmedValue.includes('\r')) {
      return { isValid: false, error: 'Network name cannot contain line breaks' };
    }

    return { isValid: true, normalizedValue: trimmedValue };
  }

  /**
   * Validate password field
   */
  validatePassword(value) {
    const securitySelect = DOMHelpers.$('#security-select');
    if (!securitySelect) {
      return { isValid: false, error: 'Security type not found' };
    }

    const securityType = securitySelect.value;

    // No password required for open networks
    if (securityType === 'nopass') {
      return { isValid: true, normalizedValue: '' };
    }

    // Password is required for secured networks
    if (!value || value.length === 0) {
      return { isValid: false, error: 'Password is required for secured networks' };
    }

    // Validate based on security type
    switch (securityType) {
      case 'WPA':
      case 'WPA3':
        if (value.length < 8) {
          return { isValid: false, error: 'WPA password must be at least 8 characters' };
        }
        if (value.length > 63) {
          return { isValid: false, error: 'WPA password cannot exceed 63 characters' };
        }
        break;

      case 'WEP':
        const isValidWEP = value.length === 5 || value.length === 13 || 
                          (value.length === 10 && /^[0-9A-Fa-f]+$/.test(value)) ||
                          (value.length === 26 && /^[0-9A-Fa-f]+$/.test(value));
        
        if (!isValidWEP) {
          return { 
            isValid: false, 
            error: 'WEP password must be 5 or 13 characters, or 10/26 hex digits' 
          };
        }
        break;

      default:
        return { isValid: false, error: 'Invalid security type' };
    }

    return { isValid: true, normalizedValue: value };
  }

  /**
   * Validate security type
   */
  validateSecurity(value) {
    const validTypes = ['WPA', 'WPA3', 'WEP', 'nopass'];
    
    if (!validTypes.includes(value)) {
      return { isValid: false, error: 'Invalid security type' };
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

    // Run custom validator if provided
    if (rules.validator) {
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
   * Update field UI based on validation result
   */
  updateFieldUI(selector, result) {
    const field = DOMHelpers.$(selector);
    const errorElement = DOMHelpers.$(selector.replace('-input', '-error').replace('-select', '-error'));
    
    if (!field) return;

    // Remove existing validation classes
    field.classList.remove('border-red-500', 'border-green-500', 'focus:ring-red-500', 'focus:ring-green-500');

    if (result.isValid) {
      // Valid state
      field.classList.add('border-green-500', 'focus:ring-green-500');
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
    const errorElement = DOMHelpers.$(selector.replace('-input', '-error').replace('-select', '-error'));
    if (errorElement) {
      DOMHelpers.setContent(errorElement, message);
      errorElement.classList.remove('hidden');
    }
  }

  /**
   * Clear field error
   */
  clearFieldError(selector) {
    const errorElement = DOMHelpers.$(selector.replace('-input', '-error').replace('-select', '-error'));
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

    // Reset security type to default
    const securitySelect = DOMHelpers.$('#security-select');
    if (securitySelect) {
      securitySelect.value = 'WPA';
      this.handleSecurityTypeChange();
    }

    // Reset show password checkbox
    const showPasswordCheckbox = DOMHelpers.$('#show-password');
    if (showPasswordCheckbox) {
      showPasswordCheckbox.checked = false;
    }
  }

  /**
   * Get all form data
   */
  getFormData() {
    const validation = this.validateAll();
    if (!validation.isValid) {
      return { isValid: false, error: 'Form validation failed' };
    }

    return {
      isValid: true,
      data: {
        ssid: this.getFieldValue('#ssid-input'),
        password: this.getFieldValue('#password-input'),
        security: this.getFieldValue('#security-select')
      }
    };
  }
}
