// Event QR Generator Component
import QRCode from 'qrcode';
import { DOMHelpers } from '../utils/dom-helpers.js';

export class EventQRGenerator {
  constructor() {
    this.canvas = null;
    this.qrOptions = {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    };
  }

  async init() {
    this.canvas = DOMHelpers.$('#qr-canvas');
    if (!this.canvas) {
      throw new Error('QR canvas element not found');
    }
    return true;
  }

  generateICalString(eventData) {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    // Generate unique ID for the event
    const eventId = `event-${Date.now()}@qubex.it`;

    let ical = 'BEGIN:VCALENDAR\n';
    ical += 'VERSION:2.0\n';
    ical += 'PRODID:-//Qubex Tools//Event QR Generator//EN\n';
    ical += 'CALSCALE:GREGORIAN\n';
    ical += 'METHOD:PUBLISH\n';
    ical += 'BEGIN:VEVENT\n';
    ical += `UID:${eventId}\n`;
    ical += `DTSTAMP:${timestamp}\n`;

    // Event title (required)
    if (eventData.eventTitle) {
      ical += `SUMMARY:${this.escapeICalText(eventData.eventTitle)}\n`;
    }

    // Start and end dates/times
    const startDateTime = this.formatICalDateTime(eventData.startDate, eventData.startTime, eventData.allDay);
    const endDateTime = this.formatICalDateTime(eventData.endDate, eventData.endTime, eventData.allDay);

    if (eventData.allDay) {
      ical += `DTSTART;VALUE=DATE:${startDateTime}\n`;
      ical += `DTEND;VALUE=DATE:${endDateTime}\n`;
    } else {
      ical += `DTSTART:${startDateTime}\n`;
      ical += `DTEND:${endDateTime}\n`;
    }

    // Description
    if (eventData.eventDescription) {
      ical += `DESCRIPTION:${this.escapeICalText(eventData.eventDescription)}\n`;
    }

    // Location
    if (eventData.eventLocation) {
      ical += `LOCATION:${this.escapeICalText(eventData.eventLocation)}\n`;
    }

    // Organizer
    if (eventData.eventOrganizer) {
      // Check if organizer includes email
      const organizerText = eventData.eventOrganizer;
      const emailMatch = organizerText.match(/([^<>\s]+@[^<>\s]+)/);
      
      if (emailMatch) {
        const email = emailMatch[1];
        const name = organizerText.replace(/[<>()]/g, '').replace(email, '').trim();
        if (name) {
          ical += `ORGANIZER;CN="${this.escapeICalText(name)}":MAILTO:${email}\n`;
        } else {
          ical += `ORGANIZER:MAILTO:${email}\n`;
        }
      } else {
        ical += `ORGANIZER;CN="${this.escapeICalText(organizerText)}":MAILTO:noreply@qubex.it\n`;
      }
    }

    // Event URL
    if (eventData.eventUrl) {
      ical += `URL:${eventData.eventUrl}\n`;
    }

    // Status and other properties
    ical += 'STATUS:CONFIRMED\n';
    ical += 'TRANSP:OPAQUE\n';
    ical += 'SEQUENCE:0\n';
    ical += `CREATED:${timestamp}\n`;
    ical += `LAST-MODIFIED:${timestamp}\n`;

    ical += 'END:VEVENT\n';
    ical += 'END:VCALENDAR';

    return ical;
  }

  formatICalDateTime(date, time, isAllDay) {
    if (!date) return '';

    const dateObj = new Date(date);
    
    if (isAllDay) {
      // For all-day events, return YYYYMMDD format
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    }

    // For timed events, combine date and time
    if (time) {
      const [hours, minutes] = time.split(':');
      dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }

    // Return in UTC format: YYYYMMDDTHHMMSSZ
    return dateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  escapeICalText(text) {
    if (!text) return '';
    
    return text
      .replace(/\\/g, '\\\\')  // Escape backslashes
      .replace(/;/g, '\\;')    // Escape semicolons
      .replace(/,/g, '\\,')    // Escape commas
      .replace(/\n/g, '\\n')   // Escape newlines
      .replace(/\r/g, '');     // Remove carriage returns
  }

  async generateEventQR(eventData) {
    try {
      if (!this.canvas) {
        throw new Error('QR generator not initialized');
      }

      // Validate required fields
      if (!eventData.eventTitle) {
        throw new Error('Event title is required');
      }

      if (!eventData.startDate) {
        throw new Error('Start date is required');
      }

      if (!eventData.endDate) {
        throw new Error('End date is required');
      }

      // Validate date logic
      const startDate = new Date(eventData.startDate);
      const endDate = new Date(eventData.endDate);

      if (endDate < startDate) {
        throw new Error('End date cannot be before start date');
      }

      // For same day events with times, validate time logic
      if (eventData.startDate === eventData.endDate && 
          eventData.startTime && eventData.endTime && 
          !eventData.allDay) {
        if (eventData.endTime <= eventData.startTime) {
          throw new Error('End time must be after start time');
        }
      }

      // Generate iCalendar string
      const icalString = this.generateICalString(eventData);

      // Generate QR code
      await QRCode.toCanvas(this.canvas, icalString, this.qrOptions);

      // Get data URL for PDF generation
      const dataURL = this.canvas.toDataURL('image/png');

      return {
        success: true,
        dataURL: dataURL,
        icalString: icalString
      };

    } catch (error) {
      console.error('Event QR generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate Event QR code'
      };
    }
  }

  clearQR() {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  // Utility method to validate event data
  validateEventData(eventData) {
    const errors = [];

    // Check required fields
    if (!eventData.eventTitle) {
      errors.push('Event title is required');
    }

    if (!eventData.startDate) {
      errors.push('Start date is required');
    }

    if (!eventData.endDate) {
      errors.push('End date is required');
    }

    if (!eventData.allDay) {
      if (!eventData.startTime) {
        errors.push('Start time is required for timed events');
      }
      if (!eventData.endTime) {
        errors.push('End time is required for timed events');
      }
    }

    // Validate date logic
    if (eventData.startDate && eventData.endDate) {
      const startDate = new Date(eventData.startDate);
      const endDate = new Date(eventData.endDate);

      if (endDate < startDate) {
        errors.push('End date cannot be before start date');
      }

      // For same day events with times, validate time logic
      if (eventData.startDate === eventData.endDate && 
          eventData.startTime && eventData.endTime && 
          !eventData.allDay) {
        if (eventData.endTime <= eventData.startTime) {
          errors.push('End time must be after start time');
        }
      }
    }

    // Validate URL format if provided
    if (eventData.eventUrl && !this.isValidURL(eventData.eventUrl)) {
      errors.push('Please enter a valid event URL');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
