// Copy to clipboard functionality using Clipboard API
import { DOMHelpers } from '../utils/dom-helpers.js';

export class ClipboardCopy {
  constructor() {
    this.isSupported = this.checkSupport();
  }

  checkSupport() {
    return navigator.clipboard && window.isSecureContext;
  }

  async copyText(text) {
    if (!text) {
      return {
        success: false,
        error: 'No text provided to copy'
      };
    }

    try {
      if (this.isSupported) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        this.fallbackCopy(text);
      }

      return {
        success: true,
        text: text
      };
    } catch (error) {
      console.error('Copy error:', error);
      return {
        success: false,
        error: error.message || 'Failed to copy to clipboard'
      };
    }
  }

  fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textArea);
    }
  }

  showCopyFeedback(buttonElement, duration = 2000) {
    if (!buttonElement) return;

    const feedback = buttonElement.querySelector('#copy-feedback') || 
                    buttonElement.querySelector('.copy-feedback');
    
    if (feedback) {
      DOMHelpers.addClass(feedback, 'show');
      
      setTimeout(() => {
        DOMHelpers.removeClass(feedback, 'show');
      }, duration);
    }
  }

  async copyWithFeedback(text, buttonElement) {
    const result = await this.copyText(text);
    
    if (result.success) {
      this.showCopyFeedback(buttonElement);
    }
    
    return result;
  }
}
