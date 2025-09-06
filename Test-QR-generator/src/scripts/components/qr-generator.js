// QR code generation using qrcode.js library
import QRCode from 'qrcode';
import { DOMHelpers } from '../utils/dom-helpers.js';

export class QRGenerator {
  constructor() {
    this.canvas = DOMHelpers.$('#qr-canvas');
    this.container = DOMHelpers.$('#qr-code-container');
  }

  async generateQR(url, options = {}) {
    const defaultOptions = {
      width: 256,
      height: 256,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1
    };

    const qrOptions = { ...defaultOptions, ...options };

    try {
      if (!this.canvas) {
        throw new Error('QR canvas element not found');
      }

      // Generate QR code on canvas
      await QRCode.toCanvas(this.canvas, url, qrOptions);
      
      return {
        success: true,
        canvas: this.canvas,
        dataURL: this.canvas.toDataURL('image/png')
      };
    } catch (error) {
      console.error('QR generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate QR code'
      };
    }
  }

  getQRDataURL() {
    if (this.canvas) {
      return this.canvas.toDataURL('image/png');
    }
    return null;
  }

  getQRBlob() {
    return new Promise((resolve) => {
      if (this.canvas) {
        this.canvas.toBlob(resolve, 'image/png');
      } else {
        resolve(null);
      }
    });
  }

  clearQR() {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  downloadQR(filename = 'qr-code.png') {
    if (!this.canvas) return false;

    try {
      const link = document.createElement('a');
      link.download = filename;
      link.href = this.canvas.toDataURL('image/png');
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('QR download error:', error);
      return false;
    }
  }
}
