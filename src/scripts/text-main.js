import { TextQRGenerator } from './components/text-qr-generator.js';
import { TextFormValidator } from './components/text-form-validator.js';
import { PDFGenerator } from './components/pdf-generator.js';

class TextQRGeneratorApp {
    constructor() {
        this.qrGenerator = new TextQRGenerator();
        this.formValidator = new TextFormValidator();
        this.pdfGenerator = new PDFGenerator();
        
        this.elements = {
            form: document.getElementById('text-form'),
            textInput: document.getElementById('text-input'),
            charCount: document.getElementById('char-count'),
            generateBtn: document.getElementById('generate-btn'),
            generateText: document.getElementById('generate-text'),
            generateLoading: document.getElementById('generate-loading'),
            loadingState: document.getElementById('loading-state'),
            resultsSection: document.getElementById('results-section'),
            errorSection: document.getElementById('error-section'),
            errorMessage: document.getElementById('error-message'),
            qrCanvas: document.getElementById('qr-canvas'),
            textPreview: document.getElementById('text-preview'),
            downloadPdfBtn: document.getElementById('download-pdf-btn'),
            generateAnotherBtn: document.getElementById('generate-another-btn'),
            dismissErrorBtn: document.getElementById('dismiss-error-btn'),
            themeToggle: document.getElementById('theme-toggle')
        };

        this.currentText = '';
        this.currentQRDataURL = '';
    }

    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.updateCharacterCount();
    }

    setupEventListeners() {
        // Form submission
        this.elements.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Text input changes
        this.elements.textInput.addEventListener('input', () => {
            this.updateCharacterCount();
            this.validateInput();
        });
        
        // Character count update
        this.elements.textInput.addEventListener('input', () => this.updateCharacterCount());
        
        // Button clicks
        this.elements.downloadPdfBtn.addEventListener('click', () => this.handleDownloadPDF());
        this.elements.generateAnotherBtn.addEventListener('click', () => this.handleGenerateAnother());
        this.elements.dismissErrorBtn.addEventListener('click', () => this.hideError());
        
        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Handle URL parameters for pre-filling text
        this.handleURLParameters();
    }

    handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const textParam = urlParams.get('text');
        
        if (textParam) {
            this.elements.textInput.value = decodeURIComponent(textParam);
            this.updateCharacterCount();
            this.validateInput();
        }
    }

    updateCharacterCount() {
        const textLength = this.elements.textInput.value.length;
        const maxLength = 2000;
        this.elements.charCount.textContent = `${textLength} / ${maxLength} characters`;
        
        // Update color based on usage
        if (textLength > maxLength * 0.9) {
            this.elements.charCount.classList.add('text-red-500');
            this.elements.charCount.classList.remove('text-gray-500');
        } else if (textLength > maxLength * 0.7) {
            this.elements.charCount.classList.add('text-yellow-500');
            this.elements.charCount.classList.remove('text-gray-500', 'text-red-500');
        } else {
            this.elements.charCount.classList.add('text-gray-500');
            this.elements.charCount.classList.remove('text-yellow-500', 'text-red-500');
        }
    }

    validateInput() {
        const text = this.elements.textInput.value.trim();
        const validation = this.formValidator.validateText(text);
        
        this.clearValidationMessages();
        
        if (!validation.isValid) {
            this.showInputError(validation.error);
            this.elements.generateBtn.disabled = true;
            this.elements.generateBtn.classList.add('btn-disabled');
        } else {
            this.showInputSuccess('Text is ready for QR code generation');
            this.elements.generateBtn.disabled = false;
            this.elements.generateBtn.classList.remove('btn-disabled');
        }
        
        return validation.isValid;
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const text = this.elements.textInput.value.trim();
        
        if (!this.validateInput()) {
            return;
        }

        try {
            this.showLoading();
            this.currentText = text;
            
            // Generate QR code
            const qrDataURL = await this.qrGenerator.generateQR(text);
            this.currentQRDataURL = qrDataURL;
            
            // Display results
            this.showResults(text, qrDataURL);
            
        } catch (error) {
            console.error('Error generating QR code:', error);
            this.showError('Failed to generate QR code. Please try again.');
        }
    }

    showLoading() {
        this.hideAllSections();
        this.elements.generateText.classList.add('hidden');
        this.elements.generateLoading.classList.remove('hidden');
        this.elements.generateBtn.disabled = true;
        this.elements.loadingState.classList.remove('hidden');
    }

    showResults(text, qrDataURL) {
        this.hideAllSections();
        this.resetGenerateButton();
        
        // Display QR code
        const img = new Image();
        img.onload = () => {
            const canvas = this.elements.qrCanvas;
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = qrDataURL;
        
        // Display text preview
        this.elements.textPreview.textContent = text;
        
        // Show results section
        this.elements.resultsSection.classList.remove('hidden');
        
        // Scroll to results
        this.elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    showError(message) {
        this.hideAllSections();
        this.resetGenerateButton();
        this.elements.errorMessage.textContent = message;
        this.elements.errorSection.classList.remove('hidden');
    }

    hideError() {
        this.elements.errorSection.classList.add('hidden');
    }

    hideAllSections() {
        this.elements.loadingState.classList.add('hidden');
        this.elements.resultsSection.classList.add('hidden');
        this.elements.errorSection.classList.add('hidden');
    }

    resetGenerateButton() {
        this.elements.generateText.classList.remove('hidden');
        this.elements.generateLoading.classList.add('hidden');
        this.elements.generateBtn.disabled = false;
    }

    showInputError(message) {
        const errorElement = document.getElementById('text-error');
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        this.elements.textInput.classList.add('form-input-error');
    }

    showInputSuccess(message) {
        const successElement = document.getElementById('text-success');
        successElement.textContent = message;
        successElement.classList.remove('hidden');
        this.elements.textInput.classList.remove('form-input-error');
    }

    clearValidationMessages() {
        const errorElement = document.getElementById('text-error');
        const successElement = document.getElementById('text-success');
        
        errorElement.classList.add('hidden');
        successElement.classList.add('hidden');
        this.elements.textInput.classList.remove('form-input-error');
    }

    async handleDownloadPDF() {
        if (!this.currentQRDataURL || !this.currentText) {
            this.showError('No QR code available for download');
            return;
        }

        try {
            this.elements.downloadPdfBtn.disabled = true;
            this.elements.downloadPdfBtn.innerHTML = `
                <span class="loading-spinner mr-2"></span>
                Generating PDF...
            `;

            await this.pdfGenerator.generateTextQRPDF(
                this.currentQRDataURL,
                this.currentText,
                'text-qr-code.pdf'
            );

        } catch (error) {
            console.error('Error generating PDF:', error);
            this.showError('Failed to generate PDF. Please try again.');
        } finally {
            this.elements.downloadPdfBtn.disabled = false;
            this.elements.downloadPdfBtn.innerHTML = `
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download PDF
            `;
        }
    }

    handleGenerateAnother() {
        this.hideAllSections();
        this.elements.textInput.value = '';
        this.elements.textInput.focus();
        this.updateCharacterCount();
        this.clearValidationMessages();
        this.currentText = '';
        this.currentQRDataURL = '';
        
        // Scroll back to form
        this.elements.form.scrollIntoView({ behavior: 'smooth' });
    }

    initializeTheme() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
        }
    }

    toggleTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new TextQRGeneratorApp();
    app.init();
});
