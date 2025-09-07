// URL shortening functionality using custom qubex.it domain
export class URLShortener {
  constructor() {
    // Use Vercel dev server during development, production domain in production
    this.baseURL = import.meta.env.DEV ? 'http://localhost:3000' : 'https://qubex.it';
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

      // Call custom shortening API
      const response = await fetch(`${this.baseURL}/api/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: originalURL
        })
      });

      if (!response.ok) {
        throw new Error(`Shortening API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const shortURL = data.shortUrl;
      
      // Cache the result
      this.cache.set(originalURL, shortURL);
      
      return {
        success: true,
        shortURL: shortURL,
        originalURL: originalURL,
        shortCode: data.shortCode
      };
    } catch (error) {
      console.error('URL shortening error:', error);
      
      // Check if it's a CORS or network error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Network error: Unable to connect to URL shortening service. Please check your internet connection.'
        };
      }
      
      // Check if it's a CORS error
      if (error.message.includes('CORS')) {
        return {
          success: false,
          error: 'CORS error: The URL shortening service is not accessible from this domain.'
        };
      }
      
      // For other API errors, provide a user-friendly message
      return {
        success: false,
        error: error.message || 'Failed to shorten URL. Please try again later.'
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

  // Method to create custom alias (optional feature)
  async shortenWithAlias(originalURL, alias = null) {
    try {
      // Check cache first
      if (this.cache.has(originalURL)) {
        return {
          success: true,
          shortURL: this.cache.get(originalURL),
          originalURL: originalURL
        };
      }

      const requestBody = {
        url: originalURL
      };

      // Add alias if provided (for future implementation)
      if (alias) {
        requestBody.alias = alias;
      }

      const response = await fetch(`${this.baseURL}/api/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Shortening API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const shortURL = data.shortUrl;
      
      // Cache the result
      this.cache.set(originalURL, shortURL);
      
      return {
        success: true,
        shortURL: shortURL,
        originalURL: originalURL,
        shortCode: data.shortCode
      };
    } catch (error) {
      console.error('URL shortening with alias error:', error);
      return {
        success: false,
        error: error.message || 'Failed to shorten URL with custom alias'
      };
    }
  }

  clearCache() {
    this.cache.clear();
  }

  getCachedURL(originalURL) {
    return this.cache.get(originalURL) || null;
  }

  // Test API connection
  async testConnection() {
    try {
      const testURL = 'https://example.com';
      const result = await this.shortenURL(testURL);
      return {
        success: result.success,
        message: result.success ? 'qubex.it API connection successful' : result.error
      };
    } catch (error) {
      return {
        success: false,
        message: `API connection test failed: ${error.message}`
      };
    }
  }

  // Get API usage info
  getApiInfo() {
    return {
      service: 'qubex.it Custom Shortener',
      baseURL: this.baseURL,
      cacheSize: this.cache.size
    };
  }
}
