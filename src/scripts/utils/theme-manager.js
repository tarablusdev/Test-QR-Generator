export class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.sunIcon = document.getElementById('sun-icon');
        this.moonIcon = document.getElementById('moon-icon');
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        this.storeTheme(this.currentTheme);
    }

    applyTheme(theme) {
        const html = document.documentElement;
        
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        
        this.updateIcons(theme);
    }

    updateIcons(theme) {
        if (this.sunIcon && this.moonIcon) {
            if (theme === 'dark') {
                this.sunIcon.classList.remove('hidden');
                this.moonIcon.classList.add('hidden');
            } else {
                this.sunIcon.classList.add('hidden');
                this.moonIcon.classList.remove('hidden');
            }
        }
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (error) {
            console.warn('Unable to access localStorage for theme preference');
            return null;
        }
    }

    storeTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.warn('Unable to store theme preference in localStorage');
        }
    }
}
