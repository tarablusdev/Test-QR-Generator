// Theme toggle functionality for dark mode
export class ThemeToggle {
  constructor() {
    this.theme = this.getInitialTheme();
    this.toggleButton = null;
    this.sunIcon = null;
    this.moonIcon = null;
  }

  init() {
    this.toggleButton = document.getElementById('theme-toggle');
    this.sunIcon = document.getElementById('sun-icon');
    this.moonIcon = document.getElementById('moon-icon');

    if (!this.toggleButton) {
      console.warn('Theme toggle button not found');
      return;
    }

    // Apply initial theme
    this.applyTheme(this.theme);
    
    // Add event listener
    this.toggleButton.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  getInitialTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add('dark');
      this.updateIcons(true);
    } else {
      html.classList.remove('dark');
      this.updateIcons(false);
    }

    // Save to localStorage
    localStorage.setItem('theme', theme);
    this.theme = theme;
  }

  updateIcons(isDark) {
    if (!this.sunIcon || !this.moonIcon) return;

    if (isDark) {
      // Dark mode: show sun icon (to switch to light)
      this.sunIcon.classList.remove('hidden');
      this.moonIcon.classList.add('hidden');
    } else {
      // Light mode: show moon icon (to switch to dark)
      this.sunIcon.classList.add('hidden');
      this.moonIcon.classList.remove('hidden');
    }
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  getCurrentTheme() {
    return this.theme;
  }

  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.applyTheme(theme);
    }
  }
}
