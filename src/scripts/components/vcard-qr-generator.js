// VCard QR Generator Component
import QRCode from 'qrcode';
import { DOMHelpers } from '../utils/dom-helpers.js';

export class VCardQRGenerator {
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

  generateVCardString(vcardData) {
    let vcard = 'BEGIN:VCARD\n';
    vcard += 'VERSION:3.0\n';

    // Name (required)
    const firstName = vcardData.firstName || '';
    const lastName = vcardData.lastName || '';
    if (firstName || lastName) {
      vcard += `N:${lastName};${firstName};;;\n`;
      vcard += `FN:${firstName} ${lastName}`.trim() + '\n';
    }

    // Organization
    if (vcardData.company) {
      vcard += `ORG:${vcardData.company}\n`;
    }

    // Job Title
    if (vcardData.jobTitle) {
      vcard += `TITLE:${vcardData.jobTitle}\n`;
    }

    // Phone
    if (vcardData.phone) {
      vcard += `TEL:${vcardData.phone}\n`;
    }

    // Email
    if (vcardData.email) {
      vcard += `EMAIL:${vcardData.email}\n`;
    }

    // Website
    if (vcardData.website) {
      vcard += `URL:${vcardData.website}\n`;
    }

    // Address
    const addressParts = [
      '', // PO Box (empty)
      '', // Extended address (empty)
      vcardData.street || '',
      vcardData.city || '',
      vcardData.state || '',
      vcardData.zip || '',
      vcardData.country || ''
    ];

    if (addressParts.some(part => part.trim())) {
      vcard += `ADR:${addressParts.join(';')}\n`;
    }

    vcard += 'END:VCARD';

    return vcard;
  }

  async generateVCardQR(vcardData) {
    try {
      if (!this.canvas) {
        throw new Error('QR generator not initialized');
      }

      // Validate required fields
      if (!vcardData.firstName && !vcardData.lastName) {
        throw new Error('At least first name or last name is required');
      }

      // Generate VCard string
      const vcardString = this.generateVCardString(vcardData);

      // Generate QR code
      await QRCode.toCanvas(this.canvas, vcardString, this.qrOptions);

      // Get data URL for PDF generation
      const dataURL = this.canvas.toDataURL('image/png');

      return {
        success: true,
        dataURL: dataURL,
        vcardString: vcardString
      };

    } catch (error) {
      console.error('VCard QR generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate VCard QR code'
      };
    }
  }

  clearQR() {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  // Utility method to validate VCard data
  validateVCardData(vcardData) {
    const errors = [];

    // Check required fields
    if (!vcardData.firstName && !vcardData.lastName) {
      errors.push('At least first name or last name is required');
    }

    // Validate email format if provided
    if (vcardData.email && !this.isValidEmail(vcardData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate URL format if provided
    if (vcardData.website && !this.isValidURL(vcardData.website)) {
      errors.push('Please enter a valid website URL');
    }

    // Validate phone format if provided (basic validation)
    if (vcardData.phone && !this.isValidPhone(vcardData.phone)) {
      errors.push('Please enter a valid phone number');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  isValidPhone(phone) {
    // Basic phone validation - allows various formats
    const phoneRegex = /^[\+]?[\d\s\-\(\)\.]{7,}$/;
    return phoneRegex.test(phone);
  }
}
