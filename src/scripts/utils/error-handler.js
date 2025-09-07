// Error handling utilities
import { DOMHelpers } from './dom-helpers.js';

export class ErrorHandler {
  static showError(message, element = '#error-section') {
    const errorSection = DOMHelpers.$(element);
    const errorMessage = DOMHelpers.$('#error-message');
    
    if (errorMessage) {
      DOMHelpers.setContent(errorMessage, message);
    }
    
    if (errorSection) {
      DOMHelpers.show(errorSection);
      // Hide other sections
      DOMHelpers.hide('#results-section');
      DOMHelpers.hide('#loading-state');
    }
  }

  static hideError(element = '#error-section') {
    DOMHelpers.hide(element);
  }

  static showFieldError(fieldId, message) {
    const field = DOMHelpers.$(fieldId);
    const errorElement = DOMHelpers.$(`${fieldId}-error`);
    
    if (field) {
      DOMHelpers.addClass(field, 'form-input-error');
    }
    
    if (errorElement) {
      DOMHelpers.setContent(errorElement, message);
      DOMHelpers.removeClass(errorElement, 'hidden');
    }
  }

  static hideFieldError(fieldId) {
    const field = DOMHelpers.$(fieldId);
    const errorElement = DOMHelpers.$(`${fieldId}-error`);
    
    if (field) {
      DOMHelpers.removeClass(field, 'form-input-error');
    }
    
    if (errorElement) {
      DOMHelpers.addClass(errorElement, 'hidden');
    }
  }

  static showFieldSuccess(fieldId, message) {
    const successElement = DOMHelpers.$(`${fieldId}-success`);
    
    if (successElement) {
      DOMHelpers.setContent(successElement, message);
      DOMHelpers.removeClass(successElement, 'hidden');
    }
  }

  static hideFieldSuccess(fieldId) {
    const successElement = DOMHelpers.$(`${fieldId}-success`);
    
    if (successElement) {
      DOMHelpers.addClass(successElement, 'hidden');
    }
  }

  static clearAllFieldMessages(fieldId) {
    this.hideFieldError(fieldId);
    this.hideFieldSuccess(fieldId);
  }
}
