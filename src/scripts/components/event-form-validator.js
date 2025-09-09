// Event Form Validator Component
import { DOMHelpers } from '../utils/dom-helpers.js';

export class EventFormValidator {
  constructor() {
    this.form = null;
    this.fields = {
      eventTitle: null,
      eventDescription: null,
      eventLocation: null,
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      allDay: null,
      eventOrganizer: null,
      eventUrl: null
    };
  }

  setupValidation() {
    this.form = DOMHelpers.$('#event-form');
    if (!this.form) {
      console.warn('Event form not found');
      return;
    }

    // Get field references
    Object.keys(this.fields).forEach(fieldName => {
      const fieldId = fieldName.replace(/([A-Z])/g, '-$1').toLowerCase();
      this.fields[fieldName] = DOMHelpers.$(`#${fieldId}`);
    });

    // Setup real-time validation
    this.attachValidationListeners();
  }

  attachValidationListeners() {
    // Event title validation
    if (this.fields.eventTitle) {
      this.fields.eventTitle.addEventListener('blur', () => {
        this.validateEventTitle();
      });
    }

    // Date validation
    if (this.fields.startDate && this.fields.endDate) {
      this.fields.startDate.addEventListener('change', () => {
        this.validateDates();
        this.autoSetEndDate();
      });
      this.fields.endDate.addEventListener('change', () => {
        this.validateDates();
      });
    }

    // Time validation
    if (this.fields.startTime && this.fields.endTime) {
      this.fields.startTime.addEventListener('change', () => {
        this.validateTimes();
      });
      this.fields.endTime.addEventListener('change', () => {
        this.validateTimes();
      });
    }

    // URL validation
    if (this.fields.eventUrl) {
      this.fields.eventUrl.addEventListener('blur', () => {
        this.validateEventUrl();
      });
    }
  }

  validateEventTitle() {
    const title = this.fields.eventTitle?.value.trim();
    if (!title) {
      this.showFieldError('event-title', 'Event title is required');
      return false;
    }

    this.clearFieldError('event-title');
    return true;
  }

  validateDates() {
    const startDate = this.fields.startDate?.value;
    const endDate = this.fields.endDate?.value;

    if (!startDate) {
      this.showFieldError('start-date', 'Start date is required');
      return false;
    }

    if (!endDate) {
      this.showFieldError('end-date', 'End date is required');
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      this.showFieldError('end-date', 'End date cannot be before start date');
      return false;
    }

    this.clearFieldError('start-date');
    this.clearFieldError('end-date');
    return true;
  }

  validateTimes() {
    const allDay = this.fields.allDay?.checked;
    if (allDay) return true; // Skip time validation for all-day events

    const startDate = this.fields.startDate?.value;
    const endDate = this.fields.endDate?.value;
    const startTime = this.fields.startTime?.value;
    const endTime = this.fields.endTime?.value;

    if (!startTime) {
      this.showFieldError('start-time', 'Start time is required');
      return false;
    }

    if (!endTime) {
      this.showFieldError('end-time', 'End time is required');
      return false;
    }

    // If same day, validate time logic
    if (startDate === endDate && endTime <= startTime) {
      this.showFieldError('end-time', 'End time must be after start time');
      return false;
    }

    this.clearFieldError('start-time');
    this.clearFieldError('end-time');
    return true;
  }

  validateEventUrl() {
    const url = this.fields.eventUrl?.value.trim();
    if (!url) return true; // Optional field

    try {
      new URL(url);
      this.clearFieldError('event-url');
      return true;
    } catch {
      this.showFieldError('event-url', 'Please enter a valid URL (e.g., https://example.com)');
      return false;
    }
  }

  autoSetEndDate() {
    // Auto-set end date to start date if not set
    const startDate = this.fields.startDate?.value;
    const endDate = this.fields.endDate?.value;

    if (startDate && !endDate && this.fields.endDate) {
      this.fields.endDate.value = startDate;
    }
  }

  showFieldError(fieldName, message) {
    const errorElement = DOMHelpers.$(`#${fieldName}-error`);
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
    }

    // Add error styling to field
    const field = DOMHelpers.$(`#${fieldName}`);
    if (field) {
      field.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
      field.classList.remove('border-gray-300', 'focus:border-blue-500', 'focus:ring-blue-500');
    }
  }

  clearFieldError(fieldName) {
    const errorElement = DOMHelpers.$(`#${fieldName}-error`);
    
    if (errorElement) {
      errorElement.classList.add('hidden');
    }

    // Remove error styling from field
    const field = DOMHelpers.$(`#${fieldName}`);
    if (field) {
      field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
      field.classList.add('border-gray-300', 'focus:border-blue-500', 'focus:ring-blue-500');
    }
  }

  getFormData() {
    if (!this.form) {
      return {
        isValid: false,
        error: 'Form not found'
      };
    }

    // Get all field values
    const data = {};
    Object.keys(this.fields).forEach(fieldName => {
      const field = this.fields[fieldName];
      if (field) {
        if (field.type === 'checkbox') {
          data[fieldName] = field.checked;
        } else {
          data[fieldName] = field.value.trim();
        }
      }
    });

    // Validate all fields
    const validations = [
      this.validateEventTitle(),
      this.validateDates(),
      this.validateTimes(),
      this.validateEventUrl()
    ];

    const isValid = validations.every(validation => validation);

    if (!isValid) {
      return {
        isValid: false,
        error: 'Please correct the errors above'
      };
    }

    // Additional validation for required fields
    if (!data.eventTitle) {
      return {
        isValid: false,
        error: 'Event title is required'
      };
    }

    if (!data.startDate || !data.endDate) {
      return {
        isValid: false,
        error: 'Start and end dates are required'
      };
    }

    if (!data.allDay && (!data.startTime || !data.endTime)) {
      return {
        isValid: false,
        error: 'Start and end times are required for timed events'
      };
    }

    return {
      isValid: true,
      data: data
    };
  }

  reset() {
    if (!this.form) return;

    // Reset form
    this.form.reset();

    // Clear all errors
    Object.keys(this.fields).forEach(fieldName => {
      const fieldId = fieldName.replace(/([A-Z])/g, '-$1').toLowerCase();
      this.clearFieldError(fieldId);
    });

    // Set default dates to today
    const today = new Date().toISOString().split('T')[0];
    if (this.fields.startDate) {
      this.fields.startDate.value = today;
    }
    if (this.fields.endDate) {
      this.fields.endDate.value = today;
    }

    // Set default times
    const now = new Date();
    const currentHour = now.getHours();
    const nextHour = (currentHour + 1) % 24;
    
    if (this.fields.startTime) {
      this.fields.startTime.value = `${currentHour.toString().padStart(2, '0')}:00`;
    }
    if (this.fields.endTime) {
      this.fields.endTime.value = `${nextHour.toString().padStart(2, '0')}:00`;
    }
  }

  // Utility method to populate form with data (for editing)
  populateForm(data) {
    if (!this.form || !data) return;

    Object.keys(this.fields).forEach(fieldName => {
      const field = this.fields[fieldName];
      if (field && data[fieldName] !== undefined) {
        if (field.type === 'checkbox') {
          field.checked = data[fieldName];
        } else {
          field.value = data[fieldName];
        }
      }
    });
  }
}
