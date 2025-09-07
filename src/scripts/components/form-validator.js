// Real-time URL validation
import { URLValidator } from '../utils/url-validator.js';
import { ErrorHandler } from '../utils/error-handler.js';

export class FormValidator {
  constructor() {
    this.validators = new Map();
    this.isValid = false;
  }

  addValidator(fieldId, validatorFn, options = {}) {
    this.validators.set(fieldId, {
      validate: validatorFn,
      realTime: options.realTime || false,
      debounceMs: options.debounceMs || 300
    });
  }

  setupURLValidator(fieldId = '#url-input') {
    const validator = (value) => {
      return URLValidator.validateAndNormalize(value);
    };

    this.addValidator(fieldId, validator, {
      realTime: true,
      debounceMs: 500
    });

    this.attachEventListeners(fieldId);
  }

  attachEventListeners(fieldId) {
    const field = document.querySelector(fieldId);
    if (!field) return;

    const validator = this.validators.get(fieldId);
    if (!validator) return;

    let debounceTimer;

    const validateField = () => {
      const result = validator.validate(field.value);
      this.handleValidationResult(fieldId, result);
      return result;
    };

    // Real-time validation with debounce
    if (validator.realTime) {
      field.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(validateField, validator.debounceMs);
      });
    }

    // Validation on blur
    field.addEventListener('blur', validateField);

    // Clear validation on focus
    field.addEventListener('focus', () => {
      ErrorHandler.clearAllFieldMessages(fieldId);
    });
  }

  handleValidationResult(fieldId, result) {
    ErrorHandler.clearAllFieldMessages(fieldId);

    if (result.isValid) {
      ErrorHandler.showFieldSuccess(fieldId, '✓ Valid URL');
      this.isValid = true;
    } else if (result.error) {
      ErrorHandler.showFieldError(fieldId, result.error);
      this.isValid = false;
    }

    return result;
  }

  validateField(fieldId) {
    const field = document.querySelector(fieldId);
    const validator = this.validators.get(fieldId);

    if (!field || !validator) {
      return { isValid: false, error: 'Field or validator not found' };
    }

    return validator.validate(field.value);
  }

  validateAll() {
    let allValid = true;
    const results = {};

    for (const [fieldId] of this.validators) {
      const result = this.validateField(fieldId);
      results[fieldId] = result;
      
      if (!result.isValid) {
        allValid = false;
      }
    }

    this.isValid = allValid;
    return {
      isValid: allValid,
      results: results
    };
  }

  reset() {
    for (const [fieldId] of this.validators) {
      ErrorHandler.clearAllFieldMessages(fieldId);
    }
    this.isValid = false;
  }

  getFieldValue(fieldId) {
    const field = document.querySelector(fieldId);
    return field ? field.value : null;
  }

  setFieldValue(fieldId, value) {
    const field = document.querySelector(fieldId);
    if (field) {
      field.value = value;
    }
  }
}
