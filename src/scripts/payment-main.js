import { PaymentQRGenerator } from './components/payment-qr-generator.js';
import { PaymentFormValidator } from './components/payment-form-validator.js';
import { PDFGenerator } from './components/pdf-generator.js';

class PaymentQRGeneratorApp {
    constructor() {
        this.qrGenerator = new PaymentQRGenerator();
        this.validator = new PaymentFormValidator();
        this.pdfGenerator = new PDFGenerator();
        
        this.elements = {
            form: document.getElementById('payment-form'),
            paymentType: document.getElementById('payment-type'),
            generateBtn: document.getElementById('generate-payment-btn'),
            generateText: document.getElementById('generate-payment-text'),
            generateLoading: document.getElementById('generate-payment-loading'),
            loadingState: document.getElementById('loading-state'),
            resultsSection: document.getElementById('results-section'),
            errorSection: document.getElementById('error-section'),
            errorMessage: document.getElementById('error-message'),
            dismissErrorBtn: document.getElementById('dismiss-error-btn'),
            qrCanvas: document.getElementById('qr-canvas'),
            paymentInfoDisplay: document.getElementById('payment-info-display'),
            downloadPdfBtn: document.getElementById('download-pdf-btn'),
            generateAnotherBtn: document.getElementById('generate-another-btn'),
            themeToggle: document.getElementById('theme-toggle'),
            
            // Payment type specific field containers
            paypalFields: document.getElementById('paypal-fields'),
            cryptoFields: document.getElementById('crypto-fields'),
            upiFields: document.getElementById('upi-fields'),
            ibanFields: document.getElementById('iban-fields'),
            urlFields: document.getElementById('url-fields')
        };

        this.currentPaymentData = null;
        this.currentQRCode = null;
    }

    init() {
        this.setupEventListeners();
        this.setupThemeToggle();
        this.setupPaymentTypeHandling();
    }

    setupEventListeners() {
        // Form submission
        this.elements.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Payment type change
        this.elements.paymentType.addEventListener('change', (e) => this.handlePaymentTypeChange(e));
        
        // Button clicks
        this.elements.dismissErrorBtn.addEventListener('click', () => this.dismissError());
        this.elements.downloadPdfBtn.addEventListener('click', () => this.downloadPDF());
        this.elements.generateAnotherBtn.addEventListener('click', () => this.resetForm());
    }

    setupThemeToggle() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        
        this.elements.themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    setupPaymentTypeHandling() {
        // Hide all field containers initially
        this.hideAllPaymentFields();
    }

    hideAllPaymentFields() {
        const fieldContainers = [
            this.elements.paypalFields,
            this.elements.cryptoFields,
            this.elements.upiFields,
            this.elements.ibanFields,
            this.elements.urlFields
        ];
        
        fieldContainers.forEach(container => {
            if (container) {
                container.classList.add('hidden');
            }
        });
    }

    handlePaymentTypeChange(e) {
        const paymentType = e.target.value;
        this.hideAllPaymentFields();
        
        // Show relevant fields based on payment type
        switch (paymentType) {
            case 'paypal':
                this.elements.paypalFields.classList.remove('hidden');
                break;
            case 'bitcoin':
            case 'ethereum':
                this.elements.cryptoFields.classList.remove('hidden');
                break;
            case 'upi':
                this.elements.upiFields.classList.remove('hidden');
                break;
            case 'iban':
                this.elements.ibanFields.classList.remove('hidden');
                break;
            case 'url':
                this.elements.urlFields.classList.remove('hidden');
                break;
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.elements.form);
        const paymentData = Object.fromEntries(formData.entries());
        
        // Validate form data
        const validation = this.validator.validatePaymentData(paymentData);
        if (!validation.isValid) {
            this.showError(validation.errors.join(', '));
            return;
        }
        
        try {
            this.showLoading();
            
            // Generate payment string based on type
            const paymentString = this.generatePaymentString(paymentData);
            
            // Generate QR code
            this.currentQRCode = await this.qrGenerator.generateQR(paymentString);
            this.currentPaymentData = paymentData;
            
            // Display results
            this.displayResults(paymentData, paymentString);
            
        } catch (error) {
            console.error('Error generating payment QR:', error);
            this.showError('Failed to generate payment QR code. Please try again.');
        }
    }

    generatePaymentString(paymentData) {
        const { paymentType } = paymentData;
        
        switch (paymentType) {
            case 'paypal':
                return this.generatePayPalString(paymentData);
            case 'bitcoin':
                return this.generateBitcoinString(paymentData);
            case 'ethereum':
                return this.generateEthereumString(paymentData);
            case 'upi':
                return this.generateUPIString(paymentData);
            case 'iban':
                return this.generateIBANString(paymentData);
            case 'url':
                return paymentData.paymentUrl;
            default:
                throw new Error('Unsupported payment type');
        }
    }

    generatePayPalString(data) {
        let paypalUrl = `https://paypal.me/${data.paypalUsername}`;
        if (data.paypalAmount && parseFloat(data.paypalAmount) > 0) {
            paypalUrl += `/${data.paypalAmount}`;
        }
        return paypalUrl;
    }

    generateBitcoinString(data) {
        let bitcoinUri = `bitcoin:${data.cryptoAddress}`;
        if (data.cryptoAmount && parseFloat(data.cryptoAmount) > 0) {
            bitcoinUri += `?amount=${data.cryptoAmount}`;
        }
        return bitcoinUri;
    }

    generateEthereumString(data) {
        let ethereumUri = `ethereum:${data.cryptoAddress}`;
        if (data.cryptoAmount && parseFloat(data.cryptoAmount) > 0) {
            ethereumUri += `?value=${data.cryptoAmount}`;
        }
        return ethereumUri;
    }

    generateUPIString(data) {
        let upiString = `upi://pay?pa=${data.upiId}&pn=${encodeURIComponent(data.upiName)}`;
        if (data.upiAmount && parseFloat(data.upiAmount) > 0) {
            upiString += `&am=${data.upiAmount}&cu=INR`;
        }
        return upiString;
    }

    generateIBANString(data) {
        // For IBAN, we'll create a simple payment URL format
        // In practice, this would integrate with specific banking systems
        let ibanString = `iban:${data.ibanCode}?beneficiary=${encodeURIComponent(data.ibanName)}`;
        if (data.ibanAmount && parseFloat(data.ibanAmount) > 0) {
            ibanString += `&amount=${data.ibanAmount}&currency=EUR`;
        }
        return ibanString;
    }

    displayResults(paymentData, paymentString) {
        // Display QR code
        this.qrGenerator.displayQR(this.elements.qrCanvas, this.currentQRCode);
        
        // Display payment information
        this.displayPaymentInfo(paymentData, paymentString);
        
        // Show results section
        this.hideLoading();
        this.elements.resultsSection.classList.remove('hidden');
        this.elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    displayPaymentInfo(paymentData, paymentString) {
        const { paymentType } = paymentData;
        let infoHTML = '';
        
        switch (paymentType) {
            case 'paypal':
                infoHTML = this.getPayPalInfoHTML(paymentData, paymentString);
                break;
            case 'bitcoin':
            case 'ethereum':
                infoHTML = this.getCryptoInfoHTML(paymentData, paymentString, paymentType);
                break;
            case 'upi':
                infoHTML = this.getUPIInfoHTML(paymentData, paymentString);
                break;
            case 'iban':
                infoHTML = this.getIBANInfoHTML(paymentData, paymentString);
                break;
            case 'url':
                infoHTML = this.getURLInfoHTML(paymentData, paymentString);
                break;
        }
        
        this.elements.paymentInfoDisplay.innerHTML = infoHTML;
    }

    getPayPalInfoHTML(data, paymentString) {
        return `
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300 font-medium">Payment Type:</span>
                <span class="text-gray-900 dark:text-gray-100">PayPal</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300 font-medium">Username:</span>
                <span class="text-gray-900 dark:text-gray-100 font-mono">${data.paypalUsername}</span>
            </div>
            ${data.paypalAmount ? `
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300 font-medium">Amount:</span>
                <span class="text-gray-900 dark:text-gray-100">$${data.paypalAmount}</span>
            </div>
            ` : ''}
            <div class="py-2">
                <span class="text-gray-600 dark:text-gray-300 font-medium block mb-2">Payment URL:</span>
                <div class="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm break-all">${paymentString}</div>
            </div>
        `;
    }

    getCryptoInfoHTML(data, paymentString, type) {
        const cryptoName = type.charAt(0).toUpperCase() + type.slice(1);
        return `
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300 font-medium">Payment Type:</span>
                <span class="text-gray-900 dark:text-gray-100">${cryptoName}</span>
            </div>
            <div class="py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300 font-medium block mb-2">Wallet Address:</span>
                <div class="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm break-all">${data.cryptoAddress}</div>
            </div>
            ${data.cryptoAmount ? `
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300 font-medium">Amount:</span>
                <span class="text-gray-900 dark:text-gray-100">${data.cryptoAmount} ${type.toUpperCase()}</span>
            </div>
            ` : ''}
            <div class="py-2">
                <span class="text-gray-600 dark:text-gray-300 font-medium block mb-2">Payment URI:</span>
                <div class="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm break-all">${paymentString}</div>
            </div>
        `;
    }

    getUPIInfoHTML(data, paymentString) {
        return `
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300 font-medium">Payment Type:</span>
                <span class="text-gray-900 dark:text-gray-100">UPI (India)</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300 font-medium">UPI ID:</span>
                <span class="text-gray-900 dark:text-gray-100 font-mono">${data.upiId}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300 font-medium">Payee Name:</span>
                <span class="text-gray-900 dark:text-gray-100">${data.upiName}</span>
            </div>
            ${data.upiAmount ? `
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300 font-medium">Amount:</span>
                <span class="text-gray-900 dark:text-gray-100">₹${data.upiAmount}</span>
            </div>
            ` : ''}
            <div class="py-2">
                <span class="text-gray-600 dark:text-gray-300 font-medium block mb-2">UPI String:</span>
                <div class="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm break-all">${paymentString}</div>
            </div>
        `;
    }

    getIBANInfoHTML(data, paymentString) {
        return `
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300 font-medium">Payment Type:</span>
                <span class="text-gray-900 dark:text-gray-100">IBAN (Europe)</span>
            </div>
            <div class="py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300 font-medium block mb-2">IBAN Code:</span>
                <div class="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm break-all">${data.ibanCode}</div>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300 font-medium">Account Holder:</span>
                <span class="text-gray-900 dark:text-gray-100">${data.ibanName}</span>
            </div>
            ${data.ibanAmount ? `
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300 font-medium">Amount:</span>
                <span class="text-gray-900 dark:text-gray-100">€${data.ibanAmount}</span>
            </div>
            ` : ''}
            <div class="py-2">
                <span class="text-gray-600 dark:text-gray-300 font-medium block mb-2">Payment String:</span>
                <div class="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm break-all">${paymentString}</div>
            </div>
        `;
    }

    getURLInfoHTML(data, paymentString) {
        return `
            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span class="text-gray-600 dark:text-gray-300 font-medium">Payment Type:</span>
                <span class="text-gray-900 dark:text-gray-100">Custom URL</span>
            </div>
            <div class="py-2">
                <span class="text-gray-600 dark:text-gray-300 font-medium block mb-2">Payment URL:</span>
                <div class="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm break-all">${paymentString}</div>
            </div>
        `;
    }

    showLoading() {
        this.elements.generateText.classList.add('hidden');
        this.elements.generateLoading.classList.remove('hidden');
        this.elements.generateBtn.disabled = true;
        this.elements.loadingState.classList.remove('hidden');
        this.elements.resultsSection.classList.add('hidden');
        this.elements.errorSection.classList.add('hidden');
    }

    hideLoading() {
        this.elements.generateText.classList.remove('hidden');
        this.elements.generateLoading.classList.add('hidden');
        this.elements.generateBtn.disabled = false;
        this.elements.loadingState.classList.add('hidden');
    }

    showError(message) {
        this.hideLoading();
        this.elements.errorMessage.textContent = message;
        this.elements.errorSection.classList.remove('hidden');
        this.elements.resultsSection.classList.add('hidden');
        this.elements.errorSection.scrollIntoView({ behavior: 'smooth' });
    }

    dismissError() {
        this.elements.errorSection.classList.add('hidden');
    }

    async downloadPDF() {
        if (!this.currentQRCode || !this.currentPaymentData) {
            this.showError('No QR code available for download');
            return;
        }

        try {
            const { paymentType } = this.currentPaymentData;
            const filename = `payment-qr-${paymentType}-${Date.now()}.pdf`;
            
            await this.pdfGenerator.generatePaymentQRPDF(
                this.currentQRCode,
                this.currentPaymentData,
                filename
            );
        } catch (error) {
            console.error('Error generating PDF:', error);
            this.showError('Failed to generate PDF. Please try again.');
        }
    }

    resetForm() {
        this.elements.form.reset();
        this.hideAllPaymentFields();
        this.elements.resultsSection.classList.add('hidden');
        this.elements.errorSection.classList.add('hidden');
        this.currentPaymentData = null;
        this.currentQRCode = null;
        
        // Scroll back to form
        this.elements.form.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PaymentQRGeneratorApp();
    app.init();
});
