// WiFi QR Generator Component
import { DOMHelpers } from '../utils/dom-helpers.js';
import { ErrorHandler } from '../utils/error-handler.js';

export class WiFiQRGenerator {
  constructor() {
    this.qrLib = null;
    this.canvas = null;
    this.currentWiFiData = null;
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
      console.error('WiFi QR Generator initialization error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate WiFi QR code from network details
   * @param {Object} wifiData - WiFi network information
   * @param {string} wifiData.ssid - Network name (SSID)
   * @param {string} wifiData.password - Network password (optional)
   * @param {string} wifiData.security - Security type (WPA, WPA3, WEP, nopass)
   * @param {boolean} wifiData.hidden - Whether network is hidden (optional)
   * @returns {Object} Result object with success status and data
   */
  async generateWiFiQR(wifiData) {
    try {
      // Validate input
      const validation = this.validateWiFiData(wifiData);
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

      // Format WiFi string according to standard
      const wifiString = this.formatWiFiString(wifiData);
      console.log('Generated WiFi string:', wifiString);

      // Store current data
      this.currentWiFiData = { ...wifiData, wifiString };

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

      await this.qrLib.toCanvas(this.canvas, wifiString, qrOptions);

      // Get data URL for PDF generation
      const dataURL = this.canvas.toDataURL('image/png');

      return {
        success: true,
        dataURL: dataURL,
        wifiString: wifiString,
        wifiData: this.currentWiFiData
      };

    } catch (error) {
      console.error('WiFi QR generation error:', error);
      return {
        success: false,
        error: `Failed to generate WiFi QR code: ${error.message}`
      };
    }
  }

  /**
   * Format WiFi data into QR code string format
   * Format: WIFI:T:WPA;S:MySSID;P:mypassword;H:false;;
   */
  formatWiFiString(wifiData) {
    const { ssid, password, security, hidden = false } = wifiData;
    
    // Escape special characters in SSID and password
    const escapedSSID = this.escapeWiFiString(ssid);
    const escapedPassword = password ? this.escapeWiFiString(password) : '';
    
    // Map security types
    const securityMap = {
      'WPA': 'WPA',
      'WPA3': 'WPA',  // WPA3 uses WPA in QR format
      'WEP': 'WEP',
      'nopass': 'nopass'
    };
    
    const securityType = securityMap[security] || 'WPA';
    const hiddenFlag = hidden ? 'true' : 'false';
    
    // Build WiFi string
    let wifiString = `WIFI:T:${securityType};S:${escapedSSID};`;
    
    if (securityType !== 'nopass' && escapedPassword) {
      wifiString += `P:${escapedPassword};`;
    }
    
    wifiString += `H:${hiddenFlag};;`;
    
    return wifiString;
  }

  /**
   * Escape special characters for WiFi QR format
   */
  escapeWiFiString(str) {
    if (!str) return '';
    
    // Escape semicolons, commas, double quotes, and backslashes
    return str
      .replace(/\\/g, '\\\\')  // Escape backslashes first
      .replace(/;/g, '\\;')    // Escape semicolons
      .replace(/,/g, '\\,')    // Escape commas
      .replace(/"/g, '\\"');   // Escape double quotes
  }

  /**
   * Validate WiFi data
   */
  validateWiFiData(wifiData) {
    if (!wifiData || typeof wifiData !== 'object') {
      return { isValid: false, error: 'Invalid WiFi data provided' };
    }

    const { ssid, password, security } = wifiData;

    // SSID is required
    if (!ssid || typeof ssid !== 'string' || ssid.trim().length === 0) {
      return { isValid: false, error: 'Network name (SSID) is required' };
    }

    if (ssid.length > 32) {
      return { isValid: false, error: 'Network name cannot exceed 32 characters' };
    }

    // Validate security type
    const validSecurityTypes = ['WPA', 'WPA3', 'WEP', 'nopass'];
    if (!validSecurityTypes.includes(security)) {
      return { isValid: false, error: 'Invalid security type' };
    }

    // Password validation based on security type
    if (security !== 'nopass') {
      if (!password || password.length === 0) {
        return { isValid: false, error: 'Password is required for secured networks' };
      }

      // WPA/WPA2/WPA3 password length validation
      if ((security === 'WPA' || security === 'WPA3') && (password.length < 8 || password.length > 63)) {
        return { isValid: false, error: 'WPA password must be 8-63 characters long' };
      }

      // WEP password validation (5 or 13 characters for ASCII, or 10/26 hex characters)
      if (security === 'WEP') {
        const isValidWEP = password.length === 5 || password.length === 13 || 
                          (password.length === 10 && /^[0-9A-Fa-f]+$/.test(password)) ||
                          (password.length === 26 && /^[0-9A-Fa-f]+$/.test(password));
        
        if (!isValidWEP) {
          return { isValid: false, error: 'WEP password must be 5/13 characters or 10/26 hex digits' };
        }
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
    this.currentWiFiData = null;
  }

  /**
   * Get current WiFi data
   */
  getCurrentWiFiData() {
    return this.currentWiFiData ? { ...this.currentWiFiData } : null;
  }

  /**
   * Get security type display name
   */
  getSecurityDisplayName(security) {
    const displayNames = {
      'WPA': 'WPA/WPA2',
      'WPA3': 'WPA3',
      'WEP': 'WEP (Legacy)',
      'nopass': 'Open Network'
    };
    return displayNames[security] || security;
  }
}
