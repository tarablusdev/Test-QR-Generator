// Location Form Validator Component
import { DOMHelpers } from '../utils/dom-helpers.js';

export class LocationFormValidator {
  constructor() {
    this.form = null;
    this.fields = {
      mapsUrl: null,
      locationLabel: null
    };
    this.errors = {};
  }

  setupValidation() {
    this.form = DOMHelpers.$('#location-form');
    if (!this.form) {
      console.error('Location form not found');
      return;
    }

    // Get form fields
    this.fields.mapsUrl = DOMHelpers.$('#maps-url');
    this.fields.locationLabel = DOMHelpers.$('#location-label');

    // Setup real-time validation
    this.attachValidationListeners();
  }

  attachValidationListeners() {
    // Maps URL validation
    if (this.fields.mapsUrl) {
      this.fields.mapsUrl.addEventListener('blur', () => {
        this.validateMapsUrl();
      });

      this.fields.mapsUrl.addEventListener('input', () => {
        this.clearFieldError('mapsUrl');
      });
    }
  }

  /**
   * Validate Google Maps URL
   * @returns {boolean}
   */
  validateMapsUrl() {
    const url = this.fields.mapsUrl?.value?.trim();
    
    if (!url) {
      this.setFieldError('mapsUrl', 'Google Maps URL is required');
      return false;
    }

    // Basic URL format validation
    try {
      new URL(url);
    } catch {
      this.setFieldError('mapsUrl', 'Please enter a valid URL');
      return false;
    }

    // Check if it's a Google Maps URL
    const isGoogleMapsUrl = this.isValidGoogleMapsUrl(url);
    if (!isGoogleMapsUrl.valid) {
      this.setFieldError('mapsUrl', isGoogleMapsUrl.error);
      return false;
    }

    this.clearFieldError('mapsUrl');
    return true;
  }

  /**
   * Check if URL is a valid Google Maps URL
   * @param {string} url 
   * @returns {Object}
   */
  isValidGoogleMapsUrl(url) {
    const lowerUrl = url.toLowerCase();
    
    // Check for Google Maps domains
    const validDomains = [
      'maps.google.com',
      'www.google.com/maps',
      'google.com/maps',
      'maps.app.goo.gl',
      'goo.gl/maps'
    ];

    const hasValidDomain = validDomains.some(domain => lowerUrl.includes(domain));
    
    if (!hasValidDomain) {
      return {
        valid: false,
        error: 'Please enter a Google Maps URL (maps.google.com or goo.gl/maps)'
      };
    }

    // Check for coordinate patterns or location indicators
    const hasCoordinates = this.hasCoordinatePattern(url);
    const hasLocationQuery = this.hasLocationQuery(url);
    
    if (!hasCoordinates && !hasLocationQuery) {
      return {
        valid: false,
        error: 'URL should contain location information or coordinates'
      };
    }

    return { valid: true };
  }

  /**
   * Check if URL contains coordinate patterns
   * @param {string} url 
   * @returns {boolean}
   */
  hasCoordinatePattern(url) {
    const patterns = [
      /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/,  // ?q=lat,lng
      /@(-?\d+\.?\d*),(-?\d+\.?\d*),/,      // @lat,lng,zoom
      /\/(-?\d+\.?\d*),(-?\d+\.?\d*)/,      // /lat,lng
      /[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/,  // ?ll=lat,lng
      /[?&]center=(-?\d+\.?\d*),(-?\d+\.?\d*)/,  // ?center=lat,lng
      /(-?\d{1,3}\.\d{4,}),\s*(-?\d{1,3}\.\d{4,})/ // General coordinate pattern
    ];

    return patterns.some(pattern => pattern.test(url));
  }

  /**
   * Check if URL contains location query indicators
   * @param {string} url 
   * @returns {boolean}
   */
  hasLocationQuery(url) {
    const indicators = [
      'q=',           // Search query
      'place/',       // Place ID
      'data=',        // Map data
      '/maps/@',      // Maps coordinates
      'goo.gl/maps',  // Short URL
      'maps.app.goo.gl' // New short URL format
    ];

    return indicators.some(indicator => url.includes(indicator));
  }

  /**
   * Validate location label (optional field)
   * @returns {boolean}
   */
  validateLocationLabel() {
    const label = this.fields.locationLabel?.value?.trim();
    
    // Label is optional, so empty is valid
    if (!label) {
      this.clearFieldError('locationLabel');
      return true;
    }

    // Check length (reasonable limit)
    if (label.length > 100) {
      this.setFieldError('locationLabel', 'Location label should be less than 100 characters');
      return false;
    }

    this.clearFieldError('locationLabel');
    return true;
  }

  /**
   * Set field error
   * @param {string} fieldName 
   * @param {string} message 
   */
  setFieldError(fieldName, message) {
    this.errors[fieldName] = message;
    
    const field = this.fields[fieldName];
    const errorElement = DOMHelpers.$(`#${fieldName.replace(/([A-Z])/g, '-$1').toLowerCase()}-error`);
    
    if (field) {
      field.classList.add('form-input-error');
    }
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
    }
  }

  /**
   * Clear field error
   * @param {string} fieldName 
   */
  clearFieldError(fieldName) {
    delete this.errors[fieldName];
    
    const field = this.fields[fieldName];
    const errorElement = DOMHelpers.$(`#${fieldName.replace(/([A-Z])/g, '-$1').toLowerCase()}-error`);
    
    if (field) {
      field.classList.remove('form-input-error');
    }
    
    if (errorElement) {
      errorElement.classList.add('hidden');
    }
  }

  /**
   * Clear all errors
   */
  clearAllErrors() {
    Object.keys(this.errors).forEach(fieldName => {
      this.clearFieldError(fieldName);
    });
    this.errors = {};
  }

  /**
   * Validate entire form and return data
   * @returns {Object}
   */
  getFormData() {
    this.clearAllErrors();

    // Validate all fields
    const mapsUrlValid = this.validateMapsUrl();
    const locationLabelValid = this.validateLocationLabel();

    const isValid = mapsUrlValid && locationLabelValid;

    if (!isValid) {
      const firstError = Object.values(this.errors)[0];
      return {
        isValid: false,
        error: firstError || 'Please check your input and try again'
      };
    }

    // Return validated data
    const data = {
      mapsUrl: this.fields.mapsUrl?.value?.trim() || '',
      locationLabel: this.fields.locationLabel?.value?.trim() || '',
      originalUrl: this.fields.mapsUrl?.value?.trim() || ''
    };

    return {
      isValid: true,
      data: data
    };
  }

  /**
   * Reset form and clear all errors
   */
  reset() {
    if (this.form) {
      this.form.reset();
    }
    this.clearAllErrors();
  }

  /**
   * Get current form values without validation
   * @returns {Object}
   */
  getCurrentValues() {
    return {
      mapsUrl: this.fields.mapsUrl?.value?.trim() || '',
      locationLabel: this.fields.locationLabel?.value?.trim() || ''
    };
  }

  /**
   * Set form values
   * @param {Object} values 
   */
  setValues(values) {
    if (values.mapsUrl && this.fields.mapsUrl) {
      this.fields.mapsUrl.value = values.mapsUrl;
    }
    if (values.locationLabel && this.fields.locationLabel) {
      this.fields.locationLabel.value = values.locationLabel;
    }
  }
}
