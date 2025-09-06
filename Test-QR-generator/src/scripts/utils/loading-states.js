// Loading state management
import { DOMHelpers } from './dom-helpers.js';

export class LoadingStates {
  static showLoading() {
    DOMHelpers.show('#loading-state');
    DOMHelpers.hide('#results-section');
    DOMHelpers.hide('#error-section');
  }

  static hideLoading() {
    DOMHelpers.hide('#loading-state');
  }

  static showResults() {
    DOMHelpers.hide('#loading-state');
    DOMHelpers.hide('#error-section');
    DOMHelpers.show('#results-section');
  }

  static showButtonLoading(buttonId) {
    const button = DOMHelpers.$(buttonId);
    const loadingElement = DOMHelpers.$(`${buttonId.replace('#', '#')}-loading`);
    const textElement = DOMHelpers.$(`${buttonId.replace('#', '#')}-text`);
    
    if (button) {
      button.disabled = true;
      DOMHelpers.addClass(button, 'btn-disabled');
    }
    
    if (textElement) {
      DOMHelpers.hide(textElement);
    }
    
    if (loadingElement) {
      DOMHelpers.show(loadingElement);
    }
  }

  static hideButtonLoading(buttonId) {
    const button = DOMHelpers.$(buttonId);
    const loadingElement = DOMHelpers.$(`${buttonId.replace('#', '#')}-loading`);
    const textElement = DOMHelpers.$(`${buttonId.replace('#', '#')}-text`);
    
    if (button) {
      button.disabled = false;
      DOMHelpers.removeClass(button, 'btn-disabled');
    }
    
    if (loadingElement) {
      DOMHelpers.hide(loadingElement);
    }
    
    if (textElement) {
      DOMHelpers.show(textElement);
    }
  }

  static resetAllStates() {
    DOMHelpers.hide('#loading-state');
    DOMHelpers.hide('#results-section');
    DOMHelpers.hide('#error-section');
  }
}
