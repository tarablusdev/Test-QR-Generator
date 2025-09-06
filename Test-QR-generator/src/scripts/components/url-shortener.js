// URL shortening functionality (mock service initially)
export class URLShortener {
  constructor() {
    this.baseURL = 'https://short.ly';
    this.cache = new Map();
  }

  async shortenURL(originalURL) {
    try {
      // Check cache first
      if (this.cache.has(originalURL)) {
        return {
          success: true,
          shortURL: this.cache.get(originalURL),
          originalURL: originalURL
        };
      }

      // Mock URL shortening service
      const shortCode = this.generateShortCode();
      const shortURL = `${this.baseURL}/${shortCode}`;
      
      // Simulate API delay
      await this.delay(500);
      
      // Cache the result
      this.cache.set(originalURL, shortURL);
      
      return {
        success: true,
        shortURL: shortURL,
        originalURL: originalURL,
        shortCode: shortCode
      };
    } catch (error) {
      console.error('URL shortening error:', error);
      return {
        success: false,
        error: error.message || 'Failed to shorten URL'
      };
    }
  }

  generateShortCode(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Method to integrate with real URL shortening service
  async shortenWithService(originalURL, apiKey = null) {
    // This would integrate with services like bit.ly, tinyurl, etc.
    // For now, return mock data
    return this.shortenURL(originalURL);
  }

  clearCache() {
    this.cache.clear();
  }

  getCachedURL(originalURL) {
    return this.cache.get(originalURL) || null;
  }
}
