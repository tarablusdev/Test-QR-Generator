// API Configuration using environment variables
export const API_CONFIG = {
  TINYURL: {
    BASE_URL: 'https://api.tinyurl.com',
    API_TOKEN: import.meta.env.VITE_TINYURL_API_TOKEN,
    ENDPOINTS: {
      CREATE: '/create'
    }
  }
};

// Get API configuration with fallback for development
export const getApiConfig = () => {
  const config = {
    TINYURL: {
      BASE_URL: 'https://api.tinyurl.com',
      API_TOKEN: import.meta.env.VITE_TINYURL_API_TOKEN,
      ENDPOINTS: {
        CREATE: '/create'
      }
    }
  };

  // Warn if API token is missing
  if (!config.TINYURL.API_TOKEN) {
    console.warn('VITE_TINYURL_API_TOKEN environment variable is not set. URL shortening will not work.');
  }

  return config;
};
