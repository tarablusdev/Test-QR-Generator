import { EmailQRGenerator } from './components/email-qr-generator.js';
import { EmailFormValidator } from './components/email-form-validator.js';
import { PDFGenerator } from './components/pdf-generator.js';
import { ThemeManager } from './utils/theme-manager.js';

class EmailQRGeneratorApp {
    constructor() {
        this.emailQRGenerator = new EmailQRGenerator();
        this.emailFormValidator = new EmailFormValidator();
        this.pdfGenerator = new PDFGenerator();
        this.themeManager = new ThemeManager();
        
        this.form = document.getElementById('email-form');
        this.generateBtn = document.getElementById('generate-email-btn');
        this.generateText = document.getElementById('generate-email-text');
        this.generateLoading = document.getElementById('generate-email-loading');
        
        this.loadingState = document.getElementById('loading-state');
        this.resultsSection = document.getElementById('results-section');
        this.errorSection = document.getElementById('error-section');
        this.errorMessage = document.getElementById('error-message');
        
        this.downloadPdfBtn = document.getElementById('download-pdf-btn');
        this.generateAnotherBtn = document.getElementById('generate-another-btn');
        this.dismissErrorBtn = document.getElementById('dismiss-error-btn');
        
        this.recipientInput = document.getElementById('recipient-input');
        this.subjectInput = document.getElementById('subject-input');
        this.bodyInput = document.getElementById('body-input');
        
        this.subjectCharCount = document.getElementById('subject-char-count');
        this.bodyCharCount = document.getElementById('body-char-count');
        
        this.displayRecipient = document.getElementById('display-recipient');
        this.displaySubject = document.getElementById('display-subject');
        this.displayBody = document.getElementById('display-body');
        
        this.qrCanvas = document.getElementById('qr-canvas');
        
        this.currentEmailData = null;
        this.currentQRCode = null;
    }

    init() {
        this.setupEventListeners();
        this.setupCharacterCounters();
        this.themeManager.init();
        
        // Focus on recipient input
        if (this.recipientInput) {
            this.recipientInput.focus();
        }
    }

    setupEventListeners() {
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Real-time validation
        if (this.recipientInput) {
            this.recipientInput.addEventListener('input', () => this.validateRecipient());
            this.recipientInput.addEventListener('blur', () => this.validateRecipient());
        }

        if (this.subjectInput) {
            this.subjectInput.addEventListener('input', () => this.validateSubject());
        }

        if (this.bodyInput) {
            this.bodyInput.addEventListener('input', () => this.validateBody());
        }

        // Action buttons
        if (this.downloadPdfBtn) {
            this.downloadPdfBtn.addEventListener('click', () => this.handleDownloadPDF());
        }

        if (this.generateAnotherBtn) {
            this.generateAnotherBtn.addEventListener('click', () => this.handleGenerateAnother());
        }

        if (this.dismissErrorBtn) {
            this.dismissErrorBtn.addEventListener('click', () => this.hideError());
        }
    }

    setupCharacterCounters() {
        if (this.subjectInput && this.subjectCharCount) {
            this.subjectInput.addEventListener('input', () => {
                const count = this.subjectInput.value.length;
                const maxLength = this.subjectInput.getAttribute('maxlength') || 100;
                this.subjectCharCount.textContent = `${count}/${maxLength}`;
                
                if (count > maxLength * 0.9) {
                    this.subjectCharCount.classList.add('text-orange-500');
                } else {
                    this.subjectCharCount.classList.remove('text-orange-500');
                }
            });
        }

        if (this.bodyInput && this.bodyCharCount) {
            this.bodyInput.addEventListener('input', () => {
                const count = this.bodyInput.value.length;
                const maxLength = this.bodyInput.getAttribute('maxlength') || 500;
                this.bodyCharCount.textContent = `${count}/${maxLength}`;
                
                if (count > maxLength * 0.9) {
                    this.bodyCharCount.classList.add('text-orange-500');
                } else {
                    this.bodyCharCount.classList.remove('text-orange-500');
                }
            });
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const recipient = this.recipientInput?.value.trim();
        const subject = this.subjectInput?.value.trim();
        const body = this.bodyInput?.value.trim();

        // Validate form
        const isRecipientValid = this.validateRecipient();
        const isSubjectValid = this.validateSubject();
        const isBodyValid = this.validateBody();

        if (!isRecipientValid || !isSubjectValid || !isBodyValid) {
            return;
        }

        try {
            this.showLoading();
            
            // Create email data
            this.currentEmailData = {
                recipient,
                subject: subject || '',
                body: body || ''
            };

            // Generate QR code
            this.currentQRCode = await this.emailQRGenerator.generateEmailQR(
                this.currentEmailData,
                this.qrCanvas
            );

            // Update display
            this.updateEmailDisplay();
            this.showResults();

        } catch (error) {
            console.error('Error generating email QR code:', error);
            this.showError('Failed to generate email QR code. Please try again.');
        }
    }

    validateRecipient() {
        const recipient = this.recipientInput?.value.trim();
        return this.emailFormValidator.validateRecipient(recipient);
    }

    validateSubject() {
        const subject = this.subjectInput?.value.trim();
        return this.emailFormValidator.validateSubject(subject);
    }

    validateBody() {
        const body = this.bodyInput?.value.trim();
        return this.emailFormValidator.validateBody(body);
    }

    updateEmailDisplay() {
        if (this.displayRecipient) {
            this.displayRecipient.textContent = this.currentEmailData.recipient;
        }

        if (this.displaySubject) {
            this.displaySubject.textContent = this.currentEmailData.subject || '(No subject)';
        }

        if (this.displayBody) {
            this.displayBody.textContent = this.currentEmailData.body || '(No message)';
        }
    }

    async handleDownloadPDF() {
        if (!this.currentEmailData || !this.currentQRCode) {
            this.showError('No QR code to download. Please generate a QR code first.');
            return;
        }

        try {
            const title = 'Email QR Code';
            const subtitle = `To: ${this.currentEmailData.recipient}`;
            const details = [
                `Subject: ${this.currentEmailData.subject || '(No subject)'}`,
                `Message: ${this.currentEmailData.body || '(No message)'}`
            ];

            await this.pdfGenerator.generatePDF(
                this.currentQRCode,
                title,
                subtitle,
                details
            );
        } catch (error) {
            console.error('Error generating PDF:', error);
            this.showError('Failed to generate PDF. Please try again.');
        }
    }

    handleGenerateAnother() {
        // Reset form
        if (this.form) {
            this.form.reset();
        }

        // Reset character counters
        if (this.subjectCharCount) {
            this.subjectCharCount.textContent = '0/100';
            this.subjectCharCount.classList.remove('text-orange-500');
        }
        if (this.bodyCharCount) {
            this.bodyCharCount.textContent = '0/500';
            this.bodyCharCount.classList.remove('text-orange-500');
        }

        // Clear validation states
        this.emailFormValidator.clearValidationStates();

        // Reset data
        this.currentEmailData = null;
        this.currentQRCode = null;

        // Show form, hide results
        this.hideResults();
        this.hideError();

        // Focus on recipient input
        if (this.recipientInput) {
            this.recipientInput.focus();
        }
    }

    showLoading() {
        this.hideError();
        this.hideResults();
        
        if (this.generateText) this.generateText.classList.add('hidden');
        if (this.generateLoading) this.generateLoading.classList.remove('hidden');
        if (this.generateBtn) this.generateBtn.disabled = true;
        if (this.loadingState) this.loadingState.classList.remove('hidden');
    }

    showResults() {
        this.hideLoading();
        this.hideError();
        
        if (this.resultsSection) {
            this.resultsSection.classList.remove('hidden');
            this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    showError(message) {
        this.hideLoading();
        this.hideResults();
        
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
        }
        if (this.errorSection) {
            this.errorSection.classList.remove('hidden');
            this.errorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    hideLoading() {
        if (this.generateText) this.generateText.classList.remove('hidden');
        if (this.generateLoading) this.generateLoading.classList.add('hidden');
        if (this.generateBtn) this.generateBtn.disabled = false;
        if (this.loadingState) this.loadingState.classList.add('hidden');
    }

    hideResults() {
        if (this.resultsSection) {
            this.resultsSection.classList.add('hidden');
        }
    }

    hideError() {
        if (this.errorSection) {
            this.errorSection.classList.add('hidden');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new EmailQRGeneratorApp();
    app.init();
});
