import QRCode from 'qrcode';

export class EmailQRGenerator {
    constructor() {
        this.qrOptions = {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 300
        };
    }

    /**
     * Generate email QR code with mailto format
     * @param {Object} emailData - Email information
     * @param {string} emailData.recipient - Recipient email address
     * @param {string} emailData.subject - Email subject (optional)
     * @param {string} emailData.body - Email body text (optional)
     * @param {HTMLCanvasElement} canvas - Canvas element to render QR code
     * @returns {Promise<string>} QR code data URL
     */
    async generateEmailQR(emailData, canvas) {
        try {
            // Validate email data
            this.validateEmailData(emailData);

            // Create mailto URL
            const mailtoUrl = this.createMailtoUrl(emailData);

            // Generate QR code
            const qrCodeDataUrl = await QRCode.toCanvas(canvas, mailtoUrl, this.qrOptions);
            
            // Return the data URL for PDF generation
            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error('Error generating email QR code:', error);
            throw new Error('Failed to generate email QR code');
        }
    }

    /**
     * Create mailto URL from email data
     * @param {Object} emailData - Email information
     * @returns {string} Formatted mailto URL
     */
    createMailtoUrl(emailData) {
        const { recipient, subject, body } = emailData;
        
        // Start with mailto: and recipient
        let mailtoUrl = `mailto:${encodeURIComponent(recipient)}`;
        
        // Add query parameters if subject or body are provided
        const params = [];
        
        if (subject && subject.trim()) {
            params.push(`subject=${encodeURIComponent(subject.trim())}`);
        }
        
        if (body && body.trim()) {
            params.push(`body=${encodeURIComponent(body.trim())}`);
        }
        
        // Add parameters to URL if any exist
        if (params.length > 0) {
            mailtoUrl += '?' + params.join('&');
        }
        
        return mailtoUrl;
    }

    /**
     * Validate email data
     * @param {Object} emailData - Email information to validate
     * @throws {Error} If validation fails
     */
    validateEmailData(emailData) {
        if (!emailData) {
            throw new Error('Email data is required');
        }

        if (!emailData.recipient || !emailData.recipient.trim()) {
            throw new Error('Recipient email is required');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailData.recipient.trim())) {
            throw new Error('Invalid recipient email format');
        }

        // Validate subject length (optional but if provided, should be reasonable)
        if (emailData.subject && emailData.subject.length > 100) {
            throw new Error('Subject is too long (maximum 100 characters)');
        }

        // Validate body length (optional but if provided, should be reasonable)
        if (emailData.body && emailData.body.length > 500) {
            throw new Error('Email body is too long (maximum 500 characters)');
        }
    }

    /**
     * Get email information from mailto URL
     * @param {string} mailtoUrl - Mailto URL to parse
     * @returns {Object} Parsed email information
     */
    parseMailtoUrl(mailtoUrl) {
        try {
            if (!mailtoUrl.startsWith('mailto:')) {
                throw new Error('Invalid mailto URL');
            }

            const url = new URL(mailtoUrl);
            const recipient = decodeURIComponent(url.pathname);
            const subject = url.searchParams.get('subject') || '';
            const body = url.searchParams.get('body') || '';

            return {
                recipient,
                subject,
                body
            };
        } catch (error) {
            console.error('Error parsing mailto URL:', error);
            throw new Error('Failed to parse mailto URL');
        }
    }

    /**
     * Validate mailto URL format
     * @param {string} mailtoUrl - Mailto URL to validate
     * @returns {boolean} True if valid
     */
    isValidMailtoUrl(mailtoUrl) {
        try {
            const emailData = this.parseMailtoUrl(mailtoUrl);
            this.validateEmailData(emailData);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Generate QR code as data URL without canvas
     * @param {Object} emailData - Email information
     * @returns {Promise<string>} QR code data URL
     */
    async generateEmailQRDataUrl(emailData) {
        try {
            this.validateEmailData(emailData);
            const mailtoUrl = this.createMailtoUrl(emailData);
            return await QRCode.toDataURL(mailtoUrl, this.qrOptions);
        } catch (error) {
            console.error('Error generating email QR data URL:', error);
            throw new Error('Failed to generate email QR code');
        }
    }

    /**
     * Update QR code options
     * @param {Object} options - New QR code options
     */
    updateQROptions(options) {
        this.qrOptions = { ...this.qrOptions, ...options };
    }

    /**
     * Get current QR code options
     * @returns {Object} Current QR code options
     */
    getQROptions() {
        return { ...this.qrOptions };
    }
}
