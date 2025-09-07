// URL validation functions
export class URLValidator {
  static isValidURL(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  static normalizeURL(url) {
    // Add https:// if no protocol is specified
    if (!url.match(/^https?:\/\//)) {
      url = 'https://' + url;
    }
    
    try {
      const normalizedURL = new URL(url);
      return normalizedURL.href;
    } catch (_) {
      return null;
    }
  }

  static validateAndNormalize(input) {
    if (!input || typeof input !== 'string') {
      return {
        isValid: false,
        error: 'Please enter a URL',
        normalizedURL: null
      };
    }

    const trimmedInput = input.trim();
    
    if (trimmedInput.length === 0) {
      return {
        isValid: false,
        error: 'Please enter a URL',
        normalizedURL: null
      };
    }

    // Try to normalize the URL
    const normalizedURL = this.normalizeURL(trimmedInput);
    
    if (!normalizedURL) {
      return {
        isValid: false,
        error: 'Please enter a valid URL (e.g., https://example.com)',
        normalizedURL: null
      };
    }

    // Additional validation
    if (!this.isValidURL(normalizedURL)) {
      return {
        isValid: false,
        error: 'Please enter a valid HTTP or HTTPS URL',
        normalizedURL: null
      };
    }

    return {
      isValid: true,
      error: null,
      normalizedURL: normalizedURL
    };
  }

  static getDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (_) {
      return null;
    }
  }
}
