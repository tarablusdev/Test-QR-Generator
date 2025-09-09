// SMS QR Generator Component
import { DOMHelpers } from '../utils/dom-helpers.js';
import { ErrorHandler } from '../utils/error-handler.js';

export class SMSQRGenerator {
  constructor() {
    this.qrLib = null;
    this.canvas = null;
    this.currentSMSData = null;
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
      console.error('SMS QR Generator initialization error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate messaging QR code from message details
   * @param {Object} smsData - Message information
   * @param {string} smsData.platform - Platform (sms or whatsapp)
   * @param {string} smsData.phone - Phone number
   * @param {string} smsData.message - Pre-filled message (optional)
   * @returns {Object} Result object with success status and data
   */
  async generateSMSQR(smsData) {
    try {
      // Validate input
      const validation = this.validateSMSData(smsData);
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

      // Format message string according to platform
      const messageString = this.formatMessageString(smsData);
      console.log('Generated message string:', messageString);

      // Store current data
      this.currentSMSData = { ...smsData, messageString };

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

      await this.qrLib.toCanvas(this.canvas, messageString, qrOptions);

      // Get data URL for PDF generation
      const dataURL = this.canvas.toDataURL('image/png');

      return {
        success: true,
        dataURL: dataURL,
        messageString: messageString,
        smsData: this.currentSMSData
      };

    } catch (error) {
      console.error('SMS QR generation error:', error);
      return {
        success: false,
        error: `Failed to generate QR code: ${error.message}`
      };
    }
  }

  /**
   * Format message data into QR code string format based on platform
   * SMS Format: SMSTO:+1234567890:Hello World
   * WhatsApp Format: https://wa.me/1234567890?text=Hello%20World
   */
  formatMessageString(smsData) {
    const { platform, phone, message = '' } = smsData;
    
    // Clean and format phone number
    const cleanPhone = this.formatPhoneNumber(phone);
    
    if (platform === 'whatsapp') {
      return this.formatWhatsAppString(cleanPhone, message);
    } else {
      return this.formatSMSString(cleanPhone, message);
    }
  }

  /**
   * Format SMS string
   * Format: SMSTO:+1234567890:Hello World
   */
  formatSMSString(cleanPhone, message) {
    // Encode message to handle special characters
    const encodedMessage = message ? encodeURIComponent(message) : '';
    return `SMSTO:${cleanPhone}:${encodedMessage}`;
  }

  /**
   * Format WhatsApp string
   * Format: https://wa.me/1234567890?text=Hello%20World
   */
  formatWhatsAppString(cleanPhone, message) {
    // Remove + from phone number for WhatsApp format
    const whatsappPhone = cleanPhone.startsWith('+') ? cleanPhone.substring(1) : cleanPhone;
    
    // Encode message for URL
    const encodedMessage = message ? encodeURIComponent(message) : '';
    
    // Build WhatsApp URL
    if (encodedMessage) {
      return `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;
    } else {
      return `https://wa.me/${whatsappPhone}`;
    }
  }

  /**
   * Format phone number for SMS QR code
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
   * Validate message data
   */
  validateSMSData(smsData) {
    if (!smsData || typeof smsData !== 'object') {
      return { isValid: false, error: 'Invalid message data provided' };
    }

    const { platform, phone, message } = smsData;

    // Platform is required
    if (!platform || typeof platform !== 'string') {
      return { isValid: false, error: 'Platform is required' };
    }

    // Validate platform
    const validPlatforms = ['sms', 'whatsapp'];
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

    // Message validation (optional but has limits if provided)
    if (message && typeof message === 'string') {
      if (message.length > 160) {
        return { isValid: false, error: 'Message cannot exceed 160 characters' };
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
    this.currentSMSData = null;
  }

  /**
   * Get current SMS data
   */
  getCurrentSMSData() {
    return this.currentSMSData ? { ...this.currentSMSData } : null;
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
      // International: keep as is but add spaces
      return cleanPhone.replace(/(\+\d{1,3})(\d{3})(\d+)/, '$1 $2 $3');
    }
    
    return cleanPhone;
  }
}
