// Location QR Generator Component
import QRCode from 'qrcode';
import { DOMHelpers } from '../utils/dom-helpers.js';

export class LocationQRGenerator {
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
  }

  /**
   * Extract coordinates from Google Maps URL
   * @param {string} url - Google Maps URL
   * @returns {Object} - {latitude, longitude, success, error}
   */
  parseGoogleMapsUrl(url) {
    try {
      // Clean and normalize the URL
      const cleanUrl = url.trim();
      
      // Pattern 1: Direct coordinates in URL (maps.google.com/maps?q=lat,lng)
      let match = cleanUrl.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (match) {
        return {
          success: true,
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2])
        };
      }

      // Pattern 2: @coordinates format (maps.google.com/maps/@lat,lng,zoom)
      match = cleanUrl.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),/);
      if (match) {
        return {
          success: true,
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2])
        };
      }

      // Pattern 3: Place coordinates in URL path
      match = cleanUrl.match(/\/(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (match) {
        return {
          success: true,
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2])
        };
      }

      // Pattern 4: ll parameter (latitude,longitude)
      match = cleanUrl.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (match) {
        return {
          success: true,
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2])
        };
      }

      // Pattern 5: center parameter
      match = cleanUrl.match(/[?&]center=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (match) {
        return {
          success: true,
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2])
        };
      }

      // Pattern 6: Google Maps short URL (goo.gl/maps or maps.app.goo.gl)
      if (cleanUrl.includes('goo.gl/maps') || cleanUrl.includes('maps.app.goo.gl')) {
        return {
          success: false,
          error: 'Short URLs need to be expanded. Please visit the link and copy the full URL from your browser.'
        };
      }

      // Pattern 7: Try to extract any coordinate-like patterns
      const coordPattern = /(-?\d{1,3}\.\d{4,}),\s*(-?\d{1,3}\.\d{4,})/;
      match = cleanUrl.match(coordPattern);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        
        // Validate coordinate ranges
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return {
            success: true,
            latitude: lat,
            longitude: lng
          };
        }
      }

      return {
        success: false,
        error: 'Could not extract coordinates from this URL. Please ensure it\'s a valid Google Maps URL with location information.'
      };

    } catch (error) {
      return {
        success: false,
        error: 'Invalid URL format. Please check the URL and try again.'
      };
    }
  }

  /**
   * Validate coordinates
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {Object}
   */
  validateCoordinates(latitude, longitude) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return {
        isValid: false,
        error: 'Coordinates must be numbers'
      };
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      return {
        isValid: false,
        error: 'Invalid coordinate values'
      };
    }

    if (latitude < -90 || latitude > 90) {
      return {
        isValid: false,
        error: 'Latitude must be between -90 and 90 degrees'
      };
    }

    if (longitude < -180 || longitude > 180) {
      return {
        isValid: false,
        error: 'Longitude must be between -180 and 180 degrees'
      };
    }

    return { isValid: true };
  }

  /**
   * Generate geo URI from coordinates
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {string}
   */
  generateGeoUri(latitude, longitude) {
    // Format coordinates to 6 decimal places for precision
    const lat = parseFloat(latitude).toFixed(6);
    const lng = parseFloat(longitude).toFixed(6);
    return `geo:${lat},${lng}`;
  }

  /**
   * Generate Location QR code
   * @param {Object} locationData 
   * @returns {Promise<Object>}
   */
  async generateLocationQR(locationData) {
    try {
      if (!this.canvas) {
        throw new Error('QR canvas not initialized');
      }

      // Parse Google Maps URL to extract coordinates
      const parseResult = this.parseGoogleMapsUrl(locationData.mapsUrl);
      if (!parseResult.success) {
        return {
          success: false,
          error: parseResult.error
        };
      }

      const { latitude, longitude } = parseResult;

      // Validate coordinates
      const validation = this.validateCoordinates(latitude, longitude);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Generate geo URI
      const geoUri = this.generateGeoUri(latitude, longitude);

      // Generate QR code
      await QRCode.toCanvas(this.canvas, geoUri, this.qrOptions);

      // Get data URL for PDF generation
      const dataURL = this.canvas.toDataURL('image/png');

      return {
        success: true,
        dataURL: dataURL,
        geoUri: geoUri,
        coordinates: {
          latitude: latitude,
          longitude: longitude
        }
      };

    } catch (error) {
      console.error('Location QR generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate location QR code'
      };
    }
  }

  /**
   * Clear the QR code canvas
   */
  clearQR() {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Update QR code options
   * @param {Object} options 
   */
  updateOptions(options) {
    this.qrOptions = { ...this.qrOptions, ...options };
  }
}
