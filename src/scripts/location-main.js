// Location QR Generator Main Application
import { LocationQRGenerator } from './components/location-qr-generator.js';
import { LocationFormValidator } from './components/location-form-validator.js';
import { ClipboardCopy } from './components/clipboard-copy.js';
import { PDFGenerator } from './components/pdf-generator.js';
import { ThemeToggle } from './components/theme-toggle.js';
import { DOMHelpers } from './utils/dom-helpers.js';
import { ErrorHandler } from './utils/error-handler.js';
import { LoadingStates } from './utils/loading-states.js';

class LocationQRGeneratorApp {
  constructor() {
    this.locationQRGenerator = new LocationQRGenerator();
    this.formValidator = new LocationFormValidator();
    this.clipboardCopy = new ClipboardCopy();
    this.pdfGenerator = new PDFGenerator();
    this.themeToggle = new ThemeToggle();
    
    this.currentData = {
      locationData: null,
      qrDataURL: null,
      geoUri: null
    };
  }

  async init() {
    // Initialize components
    await this.locationQRGenerator.init();
    this.formValidator.setupValidation();
    this.themeToggle.init();
    
    // Setup event listeners
    this.attachEventListeners();
    
    // Reset application state
    this.resetApplication();
  }

  attachEventListeners() {
    // Form submission
    const form = DOMHelpers.$('#location-form');
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

      const locationData = formResult.data;
      this.currentData.locationData = locationData;

      // Show loading state
      LoadingStates.showLoading();
      LoadingStates.showButtonLoading('#generate-location-btn');

      // Generate Location QR code
      const qrResult = await this.locationQRGenerator.generateLocationQR(locationData);

      if (!qrResult.success) {
        throw new Error(qrResult.error || 'Failed to generate Location QR code');
      }

      // Store results
      this.currentData.qrDataURL = qrResult.dataURL;
      this.currentData.geoUri = qrResult.geoUri;

      // Display results
      this.displayResults();
      LoadingStates.showResults();

    } catch (error) {
      console.error('Location QR generation error:', error);
      ErrorHandler.showError(error.message || 'An unexpected error occurred');
    } finally {
      LoadingStates.hideButtonLoading('#generate-location-btn');
    }
  }

  displayResults() {
    const { locationData } = this.currentData;
    if (!locationData) return;

    // Display location preview
    const locationPreview = DOMHelpers.$('#location-preview');
    if (!locationPreview) return;

    let previewHTML = '';

    // Location Label
    if (locationData.locationLabel) {
      previewHTML += `
        <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-600 dark:text-gray-300 font-medium">Location:</span>
          <span class="text-gray-900 dark:text-gray-100 font-semibold">${locationData.locationLabel}</span>
        </div>
      `;
    }

    // Coordinates
    if (locationData.latitude && locationData.longitude) {
      previewHTML += `
        <div class="flex justify-between items-start py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-600 dark:text-gray-300 font-medium">Coordinates:</span>
          <span class="text-gray-900 dark:text-gray-100 text-right font-mono text-sm">${locationData.latitude}, ${locationData.longitude}</span>
        </div>
      `;
    }

    // Original Google Maps URL
    if (locationData.originalUrl) {
      const displayUrl = locationData.originalUrl.length > 50 
        ? locationData.originalUrl.substring(0, 50) + '...'
        : locationData.originalUrl;
      
      previewHTML += `
        <div class="flex justify-between items-start py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-600 dark:text-gray-300 font-medium">Source URL:</span>
          <span class="text-gray-900 dark:text-gray-100 text-right font-mono text-xs break-all max-w-xs">${displayUrl}</span>
        </div>
      `;
    }

    // Generated Geo URI
    if (this.currentData.geoUri) {
      previewHTML += `
        <div class="flex justify-between items-start py-2">
          <span class="text-gray-600 dark:text-gray-300 font-medium">QR Content:</span>
          <span class="text-gray-900 dark:text-gray-100 text-right font-mono text-sm">${this.currentData.geoUri}</span>
        </div>
      `;
    }

    locationPreview.innerHTML = previewHTML;
  }

  async handlePDFDownload() {
    if (!this.currentData.qrDataURL || !this.currentData.locationData) {
      ErrorHandler.showError('No Location QR code available for download');
      return;
    }

    try {
      LoadingStates.showButtonLoading('#download-pdf-btn');

      const { locationData } = this.currentData;
      const title = locationData.locationLabel 
        ? `Location: ${locationData.locationLabel}`
        : 'Location QR Code';
      
      const subtitle = locationData.latitude && locationData.longitude
        ? `Coordinates: ${locationData.latitude}, ${locationData.longitude}`
        : 'Google Maps Location QR Code';

      const fileName = locationData.locationLabel 
        ? `location-${locationData.locationLabel.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
        : 'location-qr-code.pdf';

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
      locationData: null,
      qrDataURL: null,
      geoUri: null
    };

    // Clear QR code
    this.locationQRGenerator.clearQR();

    // Reset UI states
    LoadingStates.resetAllStates();
    ErrorHandler.hideError();

    // Focus on maps URL input
    const mapsUrlInput = DOMHelpers.$('#maps-url');
    if (mapsUrlInput) {
      mapsUrlInput.focus();
    }
  }

  // Public methods for external access
  getCurrentData() {
    return { ...this.currentData };
  }

  isReady() {
    return !!(this.locationQRGenerator && this.formValidator && this.pdfGenerator);
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const app = new LocationQRGeneratorApp();
  await app.init();
  
  // Make app available globally for debugging
  window.LocationQRGeneratorApp = app;
});
