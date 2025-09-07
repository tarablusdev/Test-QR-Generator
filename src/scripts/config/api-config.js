// API Configuration for custom qubex.it URL shortener
export const API_CONFIG = {
  CUSTOM_SHORTENER: {
    BASE_URL: 'https://qubex.it',
    DATABASE_NAME: 'link-shortening-test',
    ENDPOINTS: {
      SHORTEN: '/api/shorten',
      REDIRECT: '/api'
    }
  }
};

// Get API configuration for custom shortener
export const getApiConfig = () => {
  const config = {
    CUSTOM_SHORTENER: {
      BASE_URL: 'https://qubex.it',
      DATABASE_NAME: 'link-shortening-test',
      ENDPOINTS: {
        SHORTEN: '/api/shorten',
        REDIRECT: '/api'
      }
    }
  };

  return config;
};
