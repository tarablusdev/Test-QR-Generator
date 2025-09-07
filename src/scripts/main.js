// Main application entry point
import { QRGenerator } from './components/qr-generator.js';
import { URLShortener } from './components/url-shortener.js';
import { ClipboardCopy } from './components/clipboard-copy.js';
import { PDFGenerator } from './components/pdf-generator.js';
import { FormValidator } from './components/form-validator.js';
import { ThemeToggle } from './components/theme-toggle.js';
import { DOMHelpers } from './utils/dom-helpers.js';
import { ErrorHandler } from './utils/error-handler.js';
import { LoadingStates } from './utils/loading-states.js';

class QRGeneratorApp {
  constructor() {
    this.qrGenerator = new QRGenerator();
    this.urlShortener = new URLShortener();
    this.clipboardCopy = new ClipboardCopy();
    this.pdfGenerator = new PDFGenerator();
    this.formValidator = new FormValidator();
    this.themeToggle = new ThemeToggle();
    
    this.currentData = {
      originalURL: null,
      normalizedURL: null,
      shortURL: null,
      qrDataURL: null
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
    const form = DOMHelpers.$('#url-form');
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

    // PDF download button
    const pdfBtn = DOMHelpers.$('#download-pdf-btn');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', () => {
        this.handlePDFDownload();
      });
    }

    // Generate another button
    const generateAnotherBtn = DOMHelpers.$('#generate-another-btn');
    if (generateAnotherBtn) {
      generateAnotherBtn.addEventListener('click', () => {
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
      LoadingStates.showButtonLoading('#generate-btn');

      // Generate QR code and shorten URL in parallel
      const [qrResult, shortResult] = await Promise.all([
        this.qrGenerator.generateQR(this.currentData.normalizedURL),
        this.urlShortener.shortenURL(this.currentData.normalizedURL)
      ]);

      // Check QR generation result
      if (!qrResult.success) {
        throw new Error(qrResult.error || 'Failed to generate QR code');
      }

      // Check URL shortening result
      if (!shortResult.success) {
        console.error('URL shortening failed:', shortResult.error);
        throw new Error(`URL shortening failed: ${shortResult.error}`);
      } else {
        this.currentData.shortURL = shortResult.shortURL;
        this.currentData.shorteningFailed = false;
      }

      // Store QR result
      this.currentData.qrDataURL = qrResult.dataURL;

      // Update UI
      this.displayResults();
      LoadingStates.showResults();

    } catch (error) {
      console.error('Form submission error:', error);
      ErrorHandler.showError(error.message || 'An unexpected error occurred');
    } finally {
      LoadingStates.hideButtonLoading('#generate-btn');
    }
  }

  displayResults() {
    // Display shortened URL
    const shortenedUrlElement = DOMHelpers.$('#shortened-url');
    if (shortenedUrlElement && this.currentData.shortURL) {
      DOMHelpers.setContent(shortenedUrlElement, this.currentData.shortURL);
    }

    // Show warning if URL shortening failed
    if (this.currentData.shorteningFailed) {
      const cardHeader = DOMHelpers.$('#results-section .card:nth-child(2) .card-header p');
      if (cardHeader) {
        DOMHelpers.setContent(cardHeader, 'Original URL (shortening service unavailable)');
        DOMHelpers.addClass(cardHeader, 'text-amber-600');
      }
    }

    // QR code is already displayed on the canvas by the QR generator
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

  async handlePDFDownload() {
    if (!this.currentData.qrDataURL || !this.currentData.shortURL) {
      ErrorHandler.showError('No data available for PDF generation');
      return;
    }

    try {
      LoadingStates.showButtonLoading('#download-pdf-btn');

      const result = await this.pdfGenerator.downloadPDF(
        this.currentData.qrDataURL,
        this.currentData.shortURL,
        this.currentData.originalURL,
        'qr-code.pdf'
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate PDF');
      }

    } catch (error) {
      console.error('PDF download error:', error);
      ErrorHandler.showError(error.message || 'Failed to download PDF');
    } finally {
      LoadingStates.hideButtonLoading('#download-pdf-btn');
    }
  }

  resetApplication() {
    // Clear form
    this.formValidator.setFieldValue('#url-input', '');
    this.formValidator.reset();

    // Clear data
    this.currentData = {
      originalURL: null,
      normalizedURL: null,
      shortURL: null,
      qrDataURL: null
    };

    // Clear QR code
    this.qrGenerator.clearQR();

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
    return !!(this.qrGenerator && this.urlShortener && this.clipboardCopy && this.pdfGenerator);
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new QRGeneratorApp();
  app.init();
  
  // Make app available globally for debugging
  window.QRGeneratorApp = app;
});
