// SMS QR Generator Main Application
import { SMSQRGenerator } from './components/sms-qr-generator.js';
import { SMSFormValidator } from './components/sms-form-validator.js';
import { ClipboardCopy } from './components/clipboard-copy.js';
import { PDFGenerator } from './components/pdf-generator.js';
import { ThemeToggle } from './components/theme-toggle.js';
import { DOMHelpers } from './utils/dom-helpers.js';
import { ErrorHandler } from './utils/error-handler.js';
import { LoadingStates } from './utils/loading-states.js';

class SMSQRGeneratorApp {
  constructor() {
    this.smsQRGenerator = new SMSQRGenerator();
    this.formValidator = new SMSFormValidator();
    this.clipboardCopy = new ClipboardCopy();
    this.pdfGenerator = new PDFGenerator();
    this.themeToggle = new ThemeToggle();
    
    this.currentData = {
      smsData: null,
      qrDataURL: null,
      messageString: null
    };
  }

  async init() {
    // Initialize components
    await this.smsQRGenerator.init();
    this.formValidator.setupValidation();
    this.themeToggle.init();
    
    // Setup event listeners
    this.attachEventListeners();
    
    // Reset application state
    this.resetApplication();
  }

  attachEventListeners() {
    // Form submission
    const form = DOMHelpers.$('#sms-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }

    // Character counter for message
    const messageInput = DOMHelpers.$('#message-input');
    const charCount = DOMHelpers.$('#char-count');
    if (messageInput && charCount) {
      messageInput.addEventListener('input', () => {
        const count = messageInput.value.length;
        DOMHelpers.setContent(charCount, `${count}/160`);
        
        // Change color based on character count
        if (count > 160) {
          charCount.className = 'text-sm text-red-500 dark:text-red-400';
        } else if (count > 140) {
          charCount.className = 'text-sm text-yellow-500 dark:text-yellow-400';
        } else {
          charCount.className = 'text-sm text-gray-500 dark:text-gray-400';
        }
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
      const formResult = this.formValidator.getFormData();
      if (!formResult.isValid) {
        ErrorHandler.showError(formResult.error || 'Please check your input and try again');
        return;
      }

      const smsData = formResult.data;
      this.currentData.smsData = smsData;

      // Show loading state
      LoadingStates.showLoading();
      LoadingStates.showButtonLoading('#generate-sms-btn');

      // Generate SMS QR code
      const qrResult = await this.smsQRGenerator.generateSMSQR(smsData);

      if (!qrResult.success) {
        throw new Error(qrResult.error || 'Failed to generate SMS QR code');
      }

      // Store results
      this.currentData.qrDataURL = qrResult.dataURL;
      this.currentData.messageString = qrResult.messageString;

      // Display results
      this.displayResults();
      LoadingStates.showResults();

    } catch (error) {
      console.error('SMS QR generation error:', error);
      ErrorHandler.showError(error.message || 'An unexpected error occurred');
    } finally {
      LoadingStates.hideButtonLoading('#generate-sms-btn');
    }
  }

  displayResults() {
    const { smsData } = this.currentData;
    if (!smsData) return;

    // Display SMS information
    const displayPhone = DOMHelpers.$('#display-phone');
    const displayMessage = DOMHelpers.$('#display-message');

    if (displayPhone) {
      DOMHelpers.setContent(displayPhone, smsData.phone);
    }

    if (displayMessage) {
      const platformName = smsData.platform === 'whatsapp' ? 'WhatsApp' : 'SMS';
      const messageText = smsData.message || `(No message - will open blank ${platformName})`;
      DOMHelpers.setContent(displayMessage, messageText);
    }
  }

  async handlePDFDownload() {
    if (!this.currentData.qrDataURL || !this.currentData.smsData) {
      ErrorHandler.showError('No SMS QR code available for download');
      return;
    }

    try {
      LoadingStates.showButtonLoading('#download-pdf-btn');

      const { smsData } = this.currentData;
      const platformName = smsData.platform === 'whatsapp' ? 'WhatsApp' : 'SMS';
      const title = `${platformName}: ${smsData.phone}`;
      const subtitle = smsData.message 
        ? `Message: ${smsData.message.substring(0, 50)}${smsData.message.length > 50 ? '...' : ''}`
        : 'Blank message';

      const result = await this.pdfGenerator.downloadPDF(
        this.currentData.qrDataURL,
        title,
        subtitle,
        `${smsData.platform}-${smsData.phone.replace(/[^0-9]/g, '')}.pdf`
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
    this.formValidator.reset();

    // Reset character counter
    const charCount = DOMHelpers.$('#char-count');
    if (charCount) {
      DOMHelpers.setContent(charCount, '0/160');
      charCount.className = 'text-sm text-gray-500 dark:text-gray-400';
    }

    // Clear data
    this.currentData = {
      smsData: null,
      qrDataURL: null,
      messageString: null
    };

    // Clear QR code
    this.smsQRGenerator.clearQR();

    // Reset UI states
    LoadingStates.resetAllStates();
    ErrorHandler.hideError();

    // Focus on phone input
    const phoneInput = DOMHelpers.$('#phone-input');
    if (phoneInput) {
      phoneInput.focus();
    }
  }

  // Public methods for external access
  getCurrentData() {
    return { ...this.currentData };
  }

  isReady() {
    return !!(this.smsQRGenerator && this.formValidator && this.pdfGenerator);
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const app = new SMSQRGeneratorApp();
  await app.init();
  
  // Make app available globally for debugging
  window.SMSQRGeneratorApp = app;
});
