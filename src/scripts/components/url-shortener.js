// URL shortening functionality using TinyURL API
import { API_CONFIG } from '../config/api-config.js';

export class URLShortener {
  constructor() {
    this.config = API_CONFIG.TINYURL;
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

      // Call TinyURL API
      const response = await fetch(`${this.config.BASE_URL}${this.config.ENDPOINTS.CREATE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.API_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          url: originalURL,
          domain: 'tinyurl.com'
        })
      });

      if (!response.ok) {
        throw new Error(`TinyURL API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.errors && data.errors.length > 0) {
        throw new Error(`TinyURL API error: ${data.errors[0].message}`);
      }

      const shortURL = data.data.tiny_url;
      
      // Cache the result
      this.cache.set(originalURL, shortURL);
      
      return {
        success: true,
        shortURL: shortURL,
        originalURL: originalURL,
        alias: data.data.alias
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
        url: originalURL,
        domain: 'tinyurl.com'
      };

      // Add alias if provided
      if (alias) {
        requestBody.alias = alias;
      }

      const response = await fetch(`${this.config.BASE_URL}${this.config.ENDPOINTS.CREATE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`TinyURL API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.errors && data.errors.length > 0) {
        throw new Error(`TinyURL API error: ${data.errors[0].message}`);
      }

      const shortURL = data.data.tiny_url;
      
      // Cache the result
      this.cache.set(originalURL, shortURL);
      
      return {
        success: true,
        shortURL: shortURL,
        originalURL: originalURL,
        alias: data.data.alias
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
        message: result.success ? 'TinyURL API connection successful' : result.error
      };
    } catch (error) {
      return {
        success: false,
        message: `API connection test failed: ${error.message}`
      };
    }
  }

  // Get API usage info (if supported by the API)
  getApiInfo() {
    return {
      service: 'TinyURL',
      baseURL: this.config.BASE_URL,
      hasToken: !!this.config.API_TOKEN,
      cacheSize: this.cache.size
    };
  }
}
