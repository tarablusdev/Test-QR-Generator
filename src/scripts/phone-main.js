// Phone QR Generator Main Application
import { PhoneQRGenerator } from './components/phone-qr-generator.js';
import { PhoneFormValidator } from './components/phone-form-validator.js';
import { ClipboardCopy } from './components/clipboard-copy.js';
import { PDFGenerator } from './components/pdf-generator.js';
import { ThemeToggle } from './components/theme-toggle.js';
import { DOMHelpers } from './utils/dom-helpers.js';
import { ErrorHandler } from './utils/error-handler.js';
import { LoadingStates } from './utils/loading-states.js';

class PhoneQRGeneratorApp {
  constructor() {
    this.phoneQRGenerator = new PhoneQRGenerator();
    this.formValidator = new PhoneFormValidator();
    this.clipboardCopy = new ClipboardCopy();
    this.pdfGenerator = new PDFGenerator();
    this.themeToggle = new ThemeToggle();
    
    this.currentData = {
      phoneData: null,
      qrDataURL: null,
      phoneString: null
    };
  }

  async init() {
    // Initialize components
    await this.phoneQRGenerator.init();
    this.formValidator.setupValidation();
    this.themeToggle.init();
    
    // Setup event listeners
    this.attachEventListeners();
    
    // Reset application state
    this.resetApplication();
  }

  attachEventListeners() {
    // Form submission
    const form = DOMHelpers.$('#phone-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
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

      const phoneData = formResult.data;
      this.currentData.phoneData = phoneData;

      // Show loading state
      LoadingStates.showLoading();
      LoadingStates.showButtonLoading('#generate-phone-btn');

      // Generate phone QR code
      const qrResult = await this.phoneQRGenerator.generatePhoneQR(phoneData);

      if (!qrResult.success) {
        throw new Error(qrResult.error || 'Failed to generate phone QR code');
      }

      // Store results
      this.currentData.qrDataURL = qrResult.dataURL;
      this.currentData.phoneString = qrResult.phoneString;

      // Display results
      this.displayResults();
      LoadingStates.showResults();

    } catch (error) {
      console.error('Phone QR generation error:', error);
      ErrorHandler.showError(error.message || 'An unexpected error occurred');
    } finally {
      LoadingStates.hideButtonLoading('#generate-phone-btn');
    }
  }

  displayResults() {
    const { phoneData } = this.currentData;
    if (!phoneData) return;

    // Display phone information
    const displayPlatform = DOMHelpers.$('#display-platform');
    const displayPhone = DOMHelpers.$('#display-phone');
    const displayNameValue = DOMHelpers.$('#display-name-value');
    const displayNameSection = DOMHelpers.$('#display-name-section');
    const displayFormat = DOMHelpers.$('#display-format');

    if (displayPlatform) {
      const platformName = phoneData.platform === 'whatsapp' ? 'WhatsApp Call' : 'Phone Call';
      DOMHelpers.setContent(displayPlatform, platformName);
    }

    if (displayPhone) {
      const formattedPhone = this.phoneQRGenerator.getFormattedPhoneDisplay(phoneData.phone);
      DOMHelpers.setContent(displayPhone, formattedPhone);
    }

    if (displayNameValue && displayNameSection) {
      if (phoneData.displayName && phoneData.displayName.trim()) {
        DOMHelpers.setContent(displayNameValue, phoneData.displayName);
        DOMHelpers.removeClass(displayNameSection, 'hidden');
      } else {
        DOMHelpers.addClass(displayNameSection, 'hidden');
      }
    }

    if (displayFormat && this.currentData.phoneString) {
      DOMHelpers.setContent(displayFormat, this.currentData.phoneString);
    }
  }

  async handlePDFDownload() {
    if (!this.currentData.qrDataURL || !this.currentData.phoneData) {
      ErrorHandler.showError('No phone QR code available for download');
      return;
    }

    try {
      LoadingStates.showButtonLoading('#download-pdf-btn');

      const { phoneData } = this.currentData;
      const formattedPhone = this.phoneQRGenerator.getFormattedPhoneDisplay(phoneData.phone);
      const platformName = phoneData.platform === 'whatsapp' ? 'WhatsApp' : 'Phone';
      
      let title = `${platformName}: ${formattedPhone}`;
      let subtitle = `${platformName === 'WhatsApp' ? 'WhatsApp call' : 'Click-to-call'} QR Code`;
      
      if (phoneData.displayName && phoneData.displayName.trim()) {
        title = `${phoneData.displayName}`;
        subtitle = `${platformName}: ${formattedPhone}`;
      }

      // Create safe filename
      const cleanPhone = phoneData.phone.replace(/[^0-9]/g, '');
      const cleanName = phoneData.displayName 
        ? phoneData.displayName.replace(/[^a-zA-Z0-9]/g, '_')
        : 'phone';
      const filename = `${cleanName}_${cleanPhone}.pdf`;

      const result = await this.pdfGenerator.downloadPDF(
        this.currentData.qrDataURL,
        title,
        subtitle,
        filename
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

    // Clear data
    this.currentData = {
      phoneData: null,
      qrDataURL: null,
      phoneString: null
    };

    // Clear QR code
    this.phoneQRGenerator.clearQR();

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
    return !!(this.phoneQRGenerator && this.formValidator && this.pdfGenerator);
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const app = new PhoneQRGeneratorApp();
  await app.init();
  
  // Make app available globally for debugging
  window.PhoneQRGeneratorApp = app;
});
