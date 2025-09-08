// Home page functionality
import { ThemeToggle } from './components/theme-toggle.js';

class HomePage {
  constructor() {
    this.themeToggle = new ThemeToggle();
  }

  init() {
    this.themeToggle.init();
    this.setupAnalytics();
  }

  setupAnalytics() {
    // Track tool clicks for analytics
    const qrLink = document.querySelector('a[href="/qr/"]');
    const shortenerLink = document.querySelector('a[href="/shortener/"]');

    if (qrLink) {
      qrLink.addEventListener('click', () => {
        this.trackEvent('tool_click', 'qr_generator');
      });
    }

    if (shortenerLink) {
      shortenerLink.addEventListener('click', () => {
        this.trackEvent('tool_click', 'url_shortener');
      });
    }
  }

  trackEvent(action, tool) {
    // Simple analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        'tool_name': tool,
        'page_title': document.title
      });
    }
  }
}

// Initialize home page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const homePage = new HomePage();
  homePage.init();
  
  // Make available globally for debugging
  window.HomePage = homePage;
});
