// Phone QR Generator Component
import { DOMHelpers } from '../utils/dom-helpers.js';
import { ErrorHandler } from '../utils/error-handler.js';

export class PhoneQRGenerator {
  constructor() {
    this.qrLib = null;
    this.canvas = null;
    this.currentPhoneData = null;
  }

  async init() {
    try {
      // Import QR code library
      const QRCode = await import('https://cdn.skypack.dev/qrcode');
      this.qrLib = QRCode.default || QRCode;
      
      // Get canvas element
      this.canvas = DOMHelpers.$('#qr-canvas');
      if (!this.canvas) {
        throw new Error('QR canvas element not found');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Phone QR Generator initialization error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate phone QR code from phone details
   * @param {Object} phoneData - Phone information
   * @param {string} phoneData.platform - Platform (phone or whatsapp)
   * @param {string} phoneData.phone - Phone number
   * @param {string} phoneData.displayName - Display name (optional)
   * @returns {Object} Result object with success status and data
   */
  async generatePhoneQR(phoneData) {
    try {
      // Validate input
      const validation = this.validatePhoneData(phoneData);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Initialize if not already done
      if (!this.qrLib) {
        const initResult = await this.init();
        if (!initResult.success) {
          return { success: false, error: initResult.error };
        }
      }

      // Format phone string
      const phoneString = this.formatPhoneString(phoneData);
      console.log('Generated phone string:', phoneString);

      // Store current data
      this.currentPhoneData = { ...phoneData, phoneString };

      // Generate QR code
      const qrOptions = {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      };

      await this.qrLib.toCanvas(this.canvas, phoneString, qrOptions);

      // Get data URL for PDF generation
      const dataURL = this.canvas.toDataURL('image/png');

      return {
        success: true,
        dataURL: dataURL,
        phoneString: phoneString,
        phoneData: this.currentPhoneData
      };

    } catch (error) {
      console.error('Phone QR generation error:', error);
      return {
        success: false,
        error: `Failed to generate QR code: ${error.message}`
      };
    }
  }

  /**
   * Format phone data into QR code string format
   * Phone Format: tel:+1234567890
   * WhatsApp Format: https://wa.me/1234567890
   */
  formatPhoneString(phoneData) {
    const { platform, phone } = phoneData;
    
    // Clean and format phone number
    const cleanPhone = this.formatPhoneNumber(phone);
    
    if (platform === 'whatsapp') {
      return this.formatWhatsAppString(cleanPhone);
    } else {
      return this.formatTelString(cleanPhone);
    }
  }

  /**
   * Format tel: URI string
   * Format: tel:+1234567890
   */
  formatTelString(cleanPhone) {
    return `tel:${cleanPhone}`;
  }

  /**
   * Format WhatsApp string
   * Format: https://wa.me/1234567890
   */
  formatWhatsAppString(cleanPhone) {
    // Remove + from phone number for WhatsApp format
    const whatsappPhone = cleanPhone.startsWith('+') ? cleanPhone.substring(1) : cleanPhone;
    return `https://wa.me/${whatsappPhone}`;
  }

  /**
   * Format phone number for phone QR code
   */
  formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Remove all non-digit characters except +
    let cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // If it doesn't start with +, and it's a US number (10 digits), add +1
    if (!cleanPhone.startsWith('+')) {
      if (cleanPhone.length === 10) {
        cleanPhone = '+1' + cleanPhone;
      } else if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
        cleanPhone = '+' + cleanPhone;
      } else {
        // For other formats, just add + if not present
        cleanPhone = '+' + cleanPhone;
      }
    }
    
    return cleanPhone;
  }

  /**
   * Validate phone data
   */
  validatePhoneData(phoneData) {
    if (!phoneData || typeof phoneData !== 'object') {
      return { isValid: false, error: 'Invalid phone data provided' };
    }

    const { platform, phone, displayName } = phoneData;

    // Platform is required
    if (!platform || typeof platform !== 'string') {
      return { isValid: false, error: 'Platform is required' };
    }

    // Validate platform
    const validPlatforms = ['phone', 'whatsapp'];
    if (!validPlatforms.includes(platform)) {
      return { isValid: false, error: 'Invalid platform selected' };
    }

    // Phone number is required
    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
      return { isValid: false, error: 'Phone number is required' };
    }

    // Validate phone number format
    const phoneValidation = this.validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      return { isValid: false, error: phoneValidation.error };
    }

    // Display name validation (optional but has limits if provided)
    if (displayName && typeof displayName === 'string') {
      if (displayName.length > 50) {
        return { isValid: false, error: 'Display name cannot exceed 50 characters' };
      }
    }

    return { isValid: true };
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phone) {
    if (!phone) {
      return { isValid: false, error: 'Phone number is required' };
    }

    // Remove all non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Check if it's empty after cleaning
    if (cleanPhone.length === 0) {
      return { isValid: false, error: 'Please enter a valid phone number' };
    }

    // Check for valid international format
    if (cleanPhone.startsWith('+')) {
      // International format: +[country code][number]
      const digits = cleanPhone.substring(1);
      if (digits.length < 7 || digits.length > 15) {
        return { isValid: false, error: 'International phone number must be 7-15 digits after country code' };
      }
      if (!/^\d+$/.test(digits)) {
        return { isValid: false, error: 'Phone number can only contain digits and + symbol' };
      }
    } else {
      // Domestic format
      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        return { isValid: false, error: 'Phone number must be 7-15 digits long' };
      }
      if (!/^\d+$/.test(cleanPhone)) {
        return { isValid: false, error: 'Phone number can only contain digits' };
      }
    }

    return { isValid: true };
  }

  /**
   * Clear the QR code display
   */
  clearQR() {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.currentPhoneData = null;
  }

  /**
   * Get current phone data
   */
  getCurrentPhoneData() {
    return this.currentPhoneData ? { ...this.currentPhoneData } : null;
  }

  /**
   * Get formatted phone number for display
   */
  getFormattedPhoneDisplay(phone) {
    const cleanPhone = this.formatPhoneNumber(phone);
    
    // Format for better readability
    if (cleanPhone.startsWith('+1') && cleanPhone.length === 12) {
      // US number: +1 (XXX) XXX-XXXX
      const digits = cleanPhone.substring(2);
      return `+1 (${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
    } else if (cleanPhone.startsWith('+')) {
      // International: keep as is but add spaces for readability
      if (cleanPhone.length <= 8) {
        return cleanPhone;
      }
      // Add spaces every 3-4 digits for better readability
      const countryCode = cleanPhone.substring(0, cleanPhone.length >= 12 ? 3 : 2);
      const remaining = cleanPhone.substring(countryCode.length);
      if (remaining.length <= 6) {
        return `${countryCode} ${remaining}`;
      } else {
        const middle = remaining.substring(0, 3);
        const end = remaining.substring(3);
        return `${countryCode} ${middle} ${end}`;
      }
    }
    
    return cleanPhone;
  }

  /**
   * Check if phone number appears to be valid
   */
  isValidPhoneFormat(phone) {
    const validation = this.validatePhoneNumber(phone);
    return validation.isValid;
  }
}
