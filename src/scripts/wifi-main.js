// WiFi QR Generator Main Application
import { WiFiQRGenerator } from './components/wifi-qr-generator.js';
import { WiFiFormValidator } from './components/wifi-form-validator.js';
import { ClipboardCopy } from './components/clipboard-copy.js';
import { PDFGenerator } from './components/pdf-generator.js';
import { ThemeToggle } from './components/theme-toggle.js';
import { DOMHelpers } from './utils/dom-helpers.js';
import { ErrorHandler } from './utils/error-handler.js';
import { LoadingStates } from './utils/loading-states.js';

class WiFiQRGeneratorApp {
  constructor() {
    this.wifiQRGenerator = new WiFiQRGenerator();
    this.formValidator = new WiFiFormValidator();
    this.clipboardCopy = new ClipboardCopy();
    this.pdfGenerator = new PDFGenerator();
    this.themeToggle = new ThemeToggle();
    
    this.currentData = {
      wifiData: null,
      qrDataURL: null,
      wifiString: null
    };
  }

  async init() {
    // Initialize components
    await this.wifiQRGenerator.init();
    this.formValidator.setupValidation();
    this.themeToggle.init();
    
    // Setup event listeners
    this.attachEventListeners();
    
    // Reset application state
    this.resetApplication();
  }

  attachEventListeners() {
    // Form submission
    const form = DOMHelpers.$('#wifi-form');
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

      const wifiData = formResult.data;
      this.currentData.wifiData = wifiData;

      // Show loading state
      LoadingStates.showLoading();
      LoadingStates.showButtonLoading('#generate-wifi-btn');

      // Generate WiFi QR code
      const qrResult = await this.wifiQRGenerator.generateWiFiQR(wifiData);

      if (!qrResult.success) {
        throw new Error(qrResult.error || 'Failed to generate WiFi QR code');
      }

      // Store results
      this.currentData.qrDataURL = qrResult.dataURL;
      this.currentData.wifiString = qrResult.wifiString;

      // Display results
      this.displayResults();
      LoadingStates.showResults();

    } catch (error) {
      console.error('WiFi QR generation error:', error);
      ErrorHandler.showError(error.message || 'An unexpected error occurred');
    } finally {
      LoadingStates.hideButtonLoading('#generate-wifi-btn');
    }
  }

  displayResults() {
    const { wifiData } = this.currentData;
    if (!wifiData) return;

    // Display network information
    const displaySSID = DOMHelpers.$('#display-ssid');
    const displaySecurity = DOMHelpers.$('#display-security');
    const displayPassword = DOMHelpers.$('#display-password');

    if (displaySSID) {
      DOMHelpers.setContent(displaySSID, wifiData.ssid);
    }

    if (displaySecurity) {
      const securityName = this.wifiQRGenerator.getSecurityDisplayName(wifiData.security);
      DOMHelpers.setContent(displaySecurity, securityName);
    }

    if (displayPassword) {
      const passwordText = wifiData.security === 'nopass' 
        ? 'No password required' 
        : (wifiData.password || 'Not set');
      DOMHelpers.setContent(displayPassword, passwordText);
    }
  }

  async handlePDFDownload() {
    if (!this.currentData.qrDataURL || !this.currentData.wifiData) {
      ErrorHandler.showError('No WiFi QR code available for download');
      return;
    }

    try {
      LoadingStates.showButtonLoading('#download-pdf-btn');

      const { wifiData } = this.currentData;
      const title = `WiFi: ${wifiData.ssid}`;
      const subtitle = `Security: ${this.wifiQRGenerator.getSecurityDisplayName(wifiData.security)}`;

      const result = await this.pdfGenerator.downloadPDF(
        this.currentData.qrDataURL,
        title,
        subtitle,
        `wifi-${wifiData.ssid.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
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
      wifiData: null,
      qrDataURL: null,
      wifiString: null
    };

    // Clear QR code
    this.wifiQRGenerator.clearQR();

    // Reset UI states
    LoadingStates.resetAllStates();
    ErrorHandler.hideError();

    // Focus on SSID input
    const ssidInput = DOMHelpers.$('#ssid-input');
    if (ssidInput) {
      ssidInput.focus();
    }
  }

  // Public methods for external access
  getCurrentData() {
    return { ...this.currentData };
  }

  isReady() {
    return !!(this.wifiQRGenerator && this.formValidator && this.pdfGenerator);
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const app = new WiFiQRGeneratorApp();
  await app.init();
  
  // Make app available globally for debugging
  window.WiFiQRGeneratorApp = app;
});
