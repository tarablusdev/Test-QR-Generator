// VCard Form Validator Component
import { DOMHelpers } from '../utils/dom-helpers.js';

export class VCardFormValidator {
  constructor() {
    this.form = null;
    this.fields = {
      firstName: null,
      lastName: null,
      jobTitle: null,
      company: null,
      phone: null,
      email: null,
      website: null,
      street: null,
      city: null,
      state: null,
      zip: null,
      country: null
    };
  }

  setupValidation() {
    this.form = DOMHelpers.$('#vcard-form');
    if (!this.form) {
      console.warn('VCard form not found');
      return;
    }

    // Get field references
    Object.keys(this.fields).forEach(fieldName => {
      const fieldId = fieldName.replace(/([A-Z])/g, '-$1').toLowerCase();
      this.fields[fieldName] = DOMHelpers.$(`#${fieldId}`);
    });

    // Setup real-time validation
    this.attachValidationListeners();
  }

  attachValidationListeners() {
    // Email validation
    if (this.fields.email) {
      this.fields.email.addEventListener('blur', () => {
        this.validateEmail();
      });
    }

    // Website validation
    if (this.fields.website) {
      this.fields.website.addEventListener('blur', () => {
        this.validateWebsite();
      });
    }

    // Phone validation
    if (this.fields.phone) {
      this.fields.phone.addEventListener('blur', () => {
        this.validatePhone();
      });
    }

    // Name validation (at least one name required)
    if (this.fields.firstName && this.fields.lastName) {
      this.fields.firstName.addEventListener('blur', () => {
        this.validateNames();
      });
      this.fields.lastName.addEventListener('blur', () => {
        this.validateNames();
      });
    }
  }

  validateEmail() {
    const email = this.fields.email?.value.trim();
    if (!email) return true; // Optional field

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    if (!isValid) {
      this.showFieldError('email', 'Please enter a valid email address');
      return false;
    }

    this.clearFieldError('email');
    return true;
  }

  validateWebsite() {
    const website = this.fields.website?.value.trim();
    if (!website) return true; // Optional field

    try {
      new URL(website);
      this.clearFieldError('website');
      return true;
    } catch {
      this.showFieldError('website', 'Please enter a valid URL (e.g., https://example.com)');
      return false;
    }
  }

  validatePhone() {
    const phone = this.fields.phone?.value.trim();
    if (!phone) return true; // Optional field

    // Basic phone validation - allows various formats
    const phoneRegex = /^[\+]?[\d\s\-\(\)\.]{7,}$/;
    const isValid = phoneRegex.test(phone);

    if (!isValid) {
      this.showFieldError('phone', 'Please enter a valid phone number');
      return false;
    }

    this.clearFieldError('phone');
    return true;
  }

  validateNames() {
    const firstName = this.fields.firstName?.value.trim() || '';
    const lastName = this.fields.lastName?.value.trim() || '';

    if (!firstName && !lastName) {
      this.showFieldError('first-name', 'At least first name or last name is required');
      this.showFieldError('last-name', 'At least first name or last name is required');
      return false;
    }

    this.clearFieldError('first-name');
    this.clearFieldError('last-name');
    return true;
  }

  showFieldError(fieldName, message) {
    const fieldId = fieldName.replace(/([A-Z])/g, '-$1').toLowerCase();
    const errorElement = DOMHelpers.$(`#${fieldId}-error`);
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
    }

    // Add error styling to field
    const field = DOMHelpers.$(`#${fieldId}`);
    if (field) {
      field.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
      field.classList.remove('border-gray-300', 'focus:border-blue-500', 'focus:ring-blue-500');
    }
  }

  clearFieldError(fieldName) {
    const fieldId = fieldName.replace(/([A-Z])/g, '-$1').toLowerCase();
    const errorElement = DOMHelpers.$(`#${fieldId}-error`);
    
    if (errorElement) {
      errorElement.classList.add('hidden');
    }

    // Remove error styling from field
    const field = DOMHelpers.$(`#${fieldId}`);
    if (field) {
      field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
      field.classList.add('border-gray-300', 'focus:border-blue-500', 'focus:ring-blue-500');
    }
  }

  getFormData() {
    if (!this.form) {
      return {
        isValid: false,
        error: 'Form not found'
      };
    }

    // Get all field values
    const data = {};
    Object.keys(this.fields).forEach(fieldName => {
      const field = this.fields[fieldName];
      data[fieldName] = field ? field.value.trim() : '';
    });

    // Validate all fields
    const validations = [
      this.validateNames(),
      this.validateEmail(),
      this.validateWebsite(),
      this.validatePhone()
    ];

    const isValid = validations.every(validation => validation);

    if (!isValid) {
      return {
        isValid: false,
        error: 'Please correct the errors above'
      };
    }

    // Check if at least some data is provided
    const hasData = Object.values(data).some(value => value.length > 0);
    if (!hasData) {
      return {
        isValid: false,
        error: 'Please fill in at least some contact information'
      };
    }

    return {
      isValid: true,
      data: data
    };
  }

  reset() {
    if (!this.form) return;

    // Reset form
    this.form.reset();

    // Clear all errors
    Object.keys(this.fields).forEach(fieldName => {
      this.clearFieldError(fieldName);
    });
  }

  // Utility method to populate form with data (for editing)
  populateForm(data) {
    if (!this.form || !data) return;

    Object.keys(this.fields).forEach(fieldName => {
      const field = this.fields[fieldName];
      if (field && data[fieldName]) {
        field.value = data[fieldName];
      }
    });
  }
}
