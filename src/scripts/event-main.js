// Event QR Generator Main Application
import { EventQRGenerator } from './components/event-qr-generator.js';
import { EventFormValidator } from './components/event-form-validator.js';
import { ClipboardCopy } from './components/clipboard-copy.js';
import { PDFGenerator } from './components/pdf-generator.js';
import { ThemeToggle } from './components/theme-toggle.js';
import { DOMHelpers } from './utils/dom-helpers.js';
import { ErrorHandler } from './utils/error-handler.js';
import { LoadingStates } from './utils/loading-states.js';

class EventQRGeneratorApp {
  constructor() {
    this.eventQRGenerator = new EventQRGenerator();
    this.formValidator = new EventFormValidator();
    this.clipboardCopy = new ClipboardCopy();
    this.pdfGenerator = new PDFGenerator();
    this.themeToggle = new ThemeToggle();
    
    this.currentData = {
      eventData: null,
      qrDataURL: null,
      icalString: null
    };
  }

  async init() {
    // Initialize components
    await this.eventQRGenerator.init();
    this.formValidator.setupValidation();
    this.themeToggle.init();
    
    // Setup event listeners
    this.attachEventListeners();
    
    // Reset application state
    this.resetApplication();
  }

  attachEventListeners() {
    // Form submission
    const form = DOMHelpers.$('#event-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }

    // All day event checkbox
    const allDayCheckbox = DOMHelpers.$('#all-day-event');
    if (allDayCheckbox) {
      allDayCheckbox.addEventListener('change', (e) => {
        this.handleAllDayToggle(e.target.checked);
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

  handleAllDayToggle(isAllDay) {
    const startTime = DOMHelpers.$('#start-time');
    const endTime = DOMHelpers.$('#end-time');
    
    if (startTime && endTime) {
      if (isAllDay) {
        startTime.disabled = true;
        endTime.disabled = true;
        startTime.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-500');
        endTime.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-500');
      } else {
        startTime.disabled = false;
        endTime.disabled = false;
        startTime.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-500');
        endTime.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-500');
      }
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

      const eventData = formResult.data;
      this.currentData.eventData = eventData;

      // Show loading state
      LoadingStates.showLoading();
      LoadingStates.showButtonLoading('#generate-event-btn');

      // Generate Event QR code
      const qrResult = await this.eventQRGenerator.generateEventQR(eventData);

      if (!qrResult.success) {
        throw new Error(qrResult.error || 'Failed to generate Event QR code');
      }

      // Store results
      this.currentData.qrDataURL = qrResult.dataURL;
      this.currentData.icalString = qrResult.icalString;

      // Display results
      this.displayResults();
      LoadingStates.showResults();

    } catch (error) {
      console.error('Event QR generation error:', error);
      ErrorHandler.showError(error.message || 'An unexpected error occurred');
    } finally {
      LoadingStates.hideButtonLoading('#generate-event-btn');
    }
  }

  displayResults() {
    const { eventData } = this.currentData;
    if (!eventData) return;

    // Display event preview
    const eventPreview = DOMHelpers.$('#event-preview');
    if (!eventPreview) return;

    let previewHTML = '';

    // Event Title
    if (eventData.eventTitle) {
      previewHTML += `
        <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-600 dark:text-gray-300 font-medium">Event:</span>
          <span class="text-gray-900 dark:text-gray-100 font-semibold">${eventData.eventTitle}</span>
        </div>
      `;
    }

    // Date and Time
    const startDateTime = this.formatDateTime(eventData.startDate, eventData.startTime, eventData.allDay);
    const endDateTime = this.formatDateTime(eventData.endDate, eventData.endTime, eventData.allDay);
    
    previewHTML += `
      <div class="flex justify-between items-start py-2 border-b border-gray-200 dark:border-gray-700">
        <span class="text-gray-600 dark:text-gray-300 font-medium">Start:</span>
        <span class="text-gray-900 dark:text-gray-100 text-right">${startDateTime}</span>
      </div>
    `;

    previewHTML += `
      <div class="flex justify-between items-start py-2 border-b border-gray-200 dark:border-gray-700">
        <span class="text-gray-600 dark:text-gray-300 font-medium">End:</span>
        <span class="text-gray-900 dark:text-gray-100 text-right">${endDateTime}</span>
      </div>
    `;

    // Location
    if (eventData.eventLocation) {
      previewHTML += `
        <div class="flex justify-between items-start py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-600 dark:text-gray-300 font-medium">Location:</span>
          <span class="text-gray-900 dark:text-gray-100 text-right max-w-xs">${eventData.eventLocation}</span>
        </div>
      `;
    }

    // Description
    if (eventData.eventDescription) {
      previewHTML += `
        <div class="flex justify-between items-start py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-600 dark:text-gray-300 font-medium">Description:</span>
          <span class="text-gray-900 dark:text-gray-100 text-right max-w-xs">${eventData.eventDescription}</span>
        </div>
      `;
    }

    // Organizer
    if (eventData.eventOrganizer) {
      previewHTML += `
        <div class="flex justify-between items-start py-2 border-b border-gray-200 dark:border-gray-700">
          <span class="text-gray-600 dark:text-gray-300 font-medium">Organizer:</span>
          <span class="text-gray-900 dark:text-gray-100 text-right max-w-xs">${eventData.eventOrganizer}</span>
        </div>
      `;
    }

    // Event URL
    if (eventData.eventUrl) {
      previewHTML += `
        <div class="flex justify-between items-start py-2">
          <span class="text-gray-600 dark:text-gray-300 font-medium">URL:</span>
          <span class="text-gray-900 dark:text-gray-100 text-right max-w-xs font-mono text-sm">${eventData.eventUrl}</span>
        </div>
      `;
    }

    eventPreview.innerHTML = previewHTML;
  }

  formatDateTime(date, time, isAllDay) {
    if (!date) return 'Not set';
    
    const dateObj = new Date(date);
    const dateStr = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    if (isAllDay || !time) {
      return `${dateStr} (All day)`;
    }

    return `${dateStr} at ${time}`;
  }

  async handlePDFDownload() {
    if (!this.currentData.qrDataURL || !this.currentData.eventData) {
      ErrorHandler.showError('No Event QR code available for download');
      return;
    }

    try {
      LoadingStates.showButtonLoading('#download-pdf-btn');

      const { eventData } = this.currentData;
      const title = `Event: ${eventData.eventTitle}`;
      const subtitle = eventData.eventLocation ? `Location: ${eventData.eventLocation}` : 'Calendar Event QR Code';

      const fileName = eventData.eventTitle 
        ? `event-${eventData.eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
        : 'event-calendar.pdf';

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
      eventData: null,
      qrDataURL: null,
      icalString: null
    };

    // Clear QR code
    this.eventQRGenerator.clearQR();

    // Reset UI states
    LoadingStates.resetAllStates();
    ErrorHandler.hideError();

    // Reset all day toggle
    const allDayCheckbox = DOMHelpers.$('#all-day-event');
    if (allDayCheckbox) {
      allDayCheckbox.checked = false;
      this.handleAllDayToggle(false);
    }

    // Focus on event title input
    const eventTitleInput = DOMHelpers.$('#event-title');
    if (eventTitleInput) {
      eventTitleInput.focus();
    }
  }

  // Public methods for external access
  getCurrentData() {
    return { ...this.currentData };
  }

  isReady() {
    return !!(this.eventQRGenerator && this.formValidator && this.pdfGenerator);
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const app = new EventQRGeneratorApp();
  await app.init();
  
  // Make app available globally for debugging
  window.EventQRGeneratorApp = app;
});
