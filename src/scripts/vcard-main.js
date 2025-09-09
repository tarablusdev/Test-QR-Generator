// VCard QR Generator Main Application
import { VCardQRGenerator } from './components/vcard-qr-generator.js';
import { VCardFormValidator } from './components/vcard-form-validator.js';
import { ClipboardCopy } from './components/clipboard-copy.js';
import { PDFGenerator } from './components/pdf-generator.js';
import { ThemeToggle } from './components/theme-toggle.js';
import { DOMHelpers } from './utils/dom-helpers.js';
import { ErrorHandler } from './utils/error-handler.js';
import { LoadingStates } from './utils/loading-states.js';

class VCardQRGeneratorApp {
  constructor() {
    this.vcardQRGenerator = new VCardQRGenerator();
    this.formValidator = new VCardFormValidator();
    this.clipboardCopy = new ClipboardCopy();
    this.pdfGenerator = new PDFGenerator();
    this.themeToggle = new ThemeToggle();
    
    this.currentData = {
      vcardData: null,
      qrDataURL: null,
      vcardString: null
    };
  }

  async init() {
    // Initialize components
    await this.vcardQRGenerator.init();
    this.formValidator.setupValidation();
    this.themeToggle.init();
    
    // Setup event listeners
    this.attachEventListeners();
    
    // Reset application state
    this.resetApplication();
  }

  attachEventListeners() {
    // Form submission
    const form = DOMHelpers.$('#vcard-form');
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

      const vcardData = formResult.data;
      this.currentData.vcardData = vcardData;

      // Show loading state
      LoadingStates.showLoading();
      LoadingStates.showButtonLoading('#generate-vcard-btn');

      // Generate VCard QR code
      const qrResult = await this.vcardQRGenerator.generateVCardQR(vcardData);

      if (!qrResult.success) {
        throw new Error(qrResult.error || 'Failed to generate VCard QR code');
      }

      // Store results
      this.currentData.qrDataURL = qrResult.dataURL;
      this.currentData.vcardString = qrResult.vcardString;

      // Display results
      this.displayResults();
      LoadingStates.showResults();

    } catch (error) {
      console.error('VCard QR generation error:', error);
      ErrorHandler.showError(error.message || 'An unexpected error occurred');
    } finally {
      LoadingStates.hideButtonLoading('#generate-vcard-btn');
    }
  }

  displayResults() {
    const { vcardData } = this.currentData;
    if (!vcardData) return;

    // Display contact preview
    const contactPreview = DOMHelpers.$('#contact-preview');
    if (!contactPreview) return;

    let previewHTML = '';

    // Name
    if (vcardData.firstName || vcardData.lastName) {
      const fullName = `${vcardData.firstName || ''} ${vcardData.lastName || ''}`.trim();
      previewHTML += `
        <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-600 dark:text-gray-300 font-medium">Name:</span>
          <span class="text-gray-900 dark:text-gray-100 font-semibold">${fullName}</span>
        </div>
      `;
    }

    // Job Title
    if (vcardData.jobTitle) {
      previewHTML += `
        <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-600 dark:text-gray-300 font-medium">Job Title:</span>
          <span class="text-gray-900 dark:text-gray-100">${vcardData.jobTitle}</span>
        </div>
      `;
    }

    // Company
    if (vcardData.company) {
      previewHTML += `
        <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-600 dark:text-gray-300 font-medium">Company:</span>
          <span class="text-gray-900 dark:text-gray-100">${vcardData.company}</span>
        </div>
      `;
    }

    // Phone
    if (vcardData.phone) {
      previewHTML += `
        <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-600 dark:text-gray-300 font-medium">Phone:</span>
          <span class="text-gray-900 dark:text-gray-100 font-mono">${vcardData.phone}</span>
        </div>
      `;
    }

    // Email
    if (vcardData.email) {
      previewHTML += `
        <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-600 dark:text-gray-300 font-medium">Email:</span>
          <span class="text-gray-900 dark:text-gray-100 font-mono">${vcardData.email}</span>
        </div>
      `;
    }

    // Website
    if (vcardData.website) {
      previewHTML += `
        <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-600 dark:text-gray-300 font-medium">Website:</span>
          <span class="text-gray-900 dark:text-gray-100 font-mono">${vcardData.website}</span>
        </div>
      `;
    }

    // Address
    const addressParts = [
      vcardData.street,
      vcardData.city,
      vcardData.state,
      vcardData.zip,
      vcardData.country
    ].filter(part => part && part.trim());

    if (addressParts.length > 0) {
      const address = addressParts.join(', ');
      previewHTML += `
        <div class="flex justify-between items-start py-2">
          <span class="text-gray-600 dark:text-gray-300 font-medium">Address:</span>
          <span class="text-gray-900 dark:text-gray-100 text-right max-w-xs">${address}</span>
        </div>
      `;
    }

    contactPreview.innerHTML = previewHTML;
  }

  async handlePDFDownload() {
    if (!this.currentData.qrDataURL || !this.currentData.vcardData) {
      ErrorHandler.showError('No VCard QR code available for download');
      return;
    }

    try {
      LoadingStates.showButtonLoading('#download-pdf-btn');

      const { vcardData } = this.currentData;
      const fullName = `${vcardData.firstName || ''} ${vcardData.lastName || ''}`.trim();
      const title = `Contact: ${fullName}`;
      const subtitle = vcardData.company ? `${vcardData.company}` : 'VCard QR Code';

      const fileName = fullName 
        ? `vcard-${fullName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
        : 'vcard-contact.pdf';

      const result = await this.pdfGenerator.downloadPDF(
        this.currentData.qrDataURL,
        title,
        subtitle,
        fileName
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
      vcardData: null,
      qrDataURL: null,
      vcardString: null
    };

    // Clear QR code
    this.vcardQRGenerator.clearQR();

    // Reset UI states
    LoadingStates.resetAllStates();
    ErrorHandler.hideError();

    // Focus on first name input
    const firstNameInput = DOMHelpers.$('#first-name');
    if (firstNameInput) {
      firstNameInput.focus();
    }
  }

  // Public methods for external access
  getCurrentData() {
    return { ...this.currentData };
  }

  isReady() {
    return !!(this.vcardQRGenerator && this.formValidator && this.pdfGenerator);
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const app = new VCardQRGeneratorApp();
  await app.init();
  
  // Make app available globally for debugging
  window.VCardQRGeneratorApp = app;
});
