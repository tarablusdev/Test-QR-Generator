// URL Shortener page functionality
import { URLShortener } from './components/url-shortener.js';
import { ClipboardCopy } from './components/clipboard-copy.js';
import { FormValidator } from './components/form-validator.js';
import { ThemeToggle } from './components/theme-toggle.js';
import { DOMHelpers } from './utils/dom-helpers.js';
import { ErrorHandler } from './utils/error-handler.js';
import { LoadingStates } from './utils/loading-states.js';

class URLShortenerApp {
  constructor() {
    this.urlShortener = new URLShortener();
    this.clipboardCopy = new ClipboardCopy();
    this.formValidator = new FormValidator();
    this.themeToggle = new ThemeToggle();
    
    this.currentData = {
      originalURL: null,
      normalizedURL: null,
      shortURL: null
    };
  }

  init() {
    this.setupFormValidation();
    this.attachEventListeners();
    this.themeToggle.init();
    this.resetApplication();
  }

  setupFormValidation() {
    this.formValidator.setupURLValidator('#url-input');
  }

  attachEventListeners() {
    // Form submission
    const form = DOMHelpers.$('#shortener-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }

    // Copy button
    const copyBtn = DOMHelpers.$('#copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        this.handleCopyURL();
      });
    }

    // Generate QR button
    const qrBtn = DOMHelpers.$('#generate-qr-btn');
    if (qrBtn) {
      qrBtn.addEventListener('click', () => {
        this.handleGenerateQR();
      });
    }

    // Shorten another button
    const shortenAnotherBtn = DOMHelpers.$('#shorten-another-btn');
    if (shortenAnotherBtn) {
      shortenAnotherBtn.addEventListener('click', () => {
        this.resetApplication();
      });
    }

    // Dismiss error button
    const dismissErrorBtn = DOMHelpers.$('#dismiss-error-btn');
    if (dismissErrorBtn) {
      dismissErrorBtn.addEventListener('click', () => {
        this.resetApplication();
      });
    }
  }

  async handleFormSubmit() {
    try {
      // Validate form
      const validation = this.formValidator.validateAll();
      if (!validation.isValid) {
        const urlResult = validation.results['#url-input'];
        if (urlResult && urlResult.error) {
          ErrorHandler.showError(urlResult.error);
        }
        return;
      }

      // Get normalized URL
      const urlInput = this.formValidator.getFieldValue('#url-input');
      const urlResult = validation.results['#url-input'];
      
      this.currentData.originalURL = urlInput;
      this.currentData.normalizedURL = urlResult.normalizedURL;

      // Show loading state
      LoadingStates.showLoading();
      LoadingStates.showButtonLoading('#shorten-btn');

      // Shorten URL
      const shortResult = await this.urlShortener.shortenURL(this.currentData.normalizedURL);

      // Check URL shortening result
      if (!shortResult.success) {
        console.error('URL shortening failed:', shortResult.error);
        throw new Error(`URL shortening failed: ${shortResult.error}`);
      }

      this.currentData.shortURL = shortResult.shortURL;

      // Update UI
      this.displayResults();
      LoadingStates.showResults();

    } catch (error) {
      console.error('Form submission error:', error);
      ErrorHandler.showError(error.message || 'An unexpected error occurred');
    } finally {
      LoadingStates.hideButtonLoading('#shorten-btn');
    }
  }

  displayResults() {
    // Display shortened URL
    const shortenedUrlElement = DOMHelpers.$('#shortened-url');
    if (shortenedUrlElement && this.currentData.shortURL) {
      DOMHelpers.setContent(shortenedUrlElement, this.currentData.shortURL);
    }

    // Display original URL
    const originalUrlElement = DOMHelpers.$('#original-url');
    if (originalUrlElement && this.currentData.originalURL) {
      DOMHelpers.setContent(originalUrlElement, this.currentData.originalURL);
    }
  }

  async handleCopyURL() {
    if (!this.currentData.shortURL) {
      ErrorHandler.showError('No URL to copy');
      return;
    }

    const copyBtn = DOMHelpers.$('#copy-btn');
    const result = await this.clipboardCopy.copyWithFeedback(
      this.currentData.shortURL, 
      copyBtn
    );

    if (!result.success) {
      ErrorHandler.showError(result.error || 'Failed to copy URL');
    }
  }

  handleGenerateQR() {
    if (!this.currentData.shortURL) {
      ErrorHandler.showError('No URL available for QR generation');
      return;
    }

    // Redirect to QR generator with the shortened URL
    const qrUrl = `/qr/?url=${encodeURIComponent(this.currentData.shortURL)}`;
    window.location.href = qrUrl;
  }

  resetApplication() {
    // Clear form
    this.formValidator.setFieldValue('#url-input', '');
    this.formValidator.reset();

    // Clear data
    this.currentData = {
      originalURL: null,
      normalizedURL: null,
      shortURL: null
    };

    // Reset UI states
    LoadingStates.resetAllStates();
    ErrorHandler.hideError();

    // Focus on input
    const urlInput = DOMHelpers.$('#url-input');
    if (urlInput) {
      urlInput.focus();
    }
  }

  // Public methods for external access
  getCurrentData() {
    return { ...this.currentData };
  }

  isReady() {
    return !!(this.urlShortener && this.clipboardCopy);
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new URLShortenerApp();
  app.init();
  
  // Make app available globally for debugging
  window.URLShortenerApp = app;
});
