import QRCode from 'qrcode';

export class TextQRGenerator {
    constructor() {
        this.defaultOptions = {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
        };
    }

    /**
     * Generate QR code from plain text
     * @param {string} text - The text content to encode
     * @param {Object} options - QR code generation options
     * @returns {Promise<string>} - Data URL of the generated QR code
     */
    async generateQR(text, options = {}) {
        try {
            if (!text || typeof text !== 'string') {
                throw new Error('Text content is required and must be a string');
            }

            const trimmedText = text.trim();
            if (trimmedText.length === 0) {
                throw new Error('Text content cannot be empty');
            }

            if (trimmedText.length > 2000) {
                throw new Error('Text content is too long (maximum 2000 characters)');
            }

            // Merge options with defaults
            const qrOptions = {
                ...this.defaultOptions,
                ...options
            };

            // Generate QR code as data URL
            const dataURL = await QRCode.toDataURL(trimmedText, qrOptions);
            
            return dataURL;

        } catch (error) {
            console.error('Error generating text QR code:', error);
            throw new Error(`Failed to generate QR code: ${error.message}`);
        }
    }

    /**
     * Generate QR code with custom styling options
     * @param {string} text - The text content to encode
     * @param {Object} styleOptions - Custom styling options
     * @returns {Promise<string>} - Data URL of the generated QR code
     */
    async generateStyledQR(text, styleOptions = {}) {
        const options = {
            ...this.defaultOptions,
            width: styleOptions.size || 300,
            margin: styleOptions.margin || 2,
            color: {
                dark: styleOptions.foregroundColor || '#000000',
                light: styleOptions.backgroundColor || '#FFFFFF'
            },
            errorCorrectionLevel: styleOptions.errorCorrection || 'M'
        };

        return this.generateQR(text, options);
    }

    /**
     * Generate high-resolution QR code for printing
     * @param {string} text - The text content to encode
     * @returns {Promise<string>} - High-resolution data URL
     */
    async generatePrintQR(text) {
        const printOptions = {
            ...this.defaultOptions,
            width: 600, // Higher resolution for printing
            margin: 4,  // Larger margin for print
            errorCorrectionLevel: 'H' // Higher error correction for print
        };

        return this.generateQR(text, printOptions);
    }

    /**
     * Validate text content for QR code generation
     * @param {string} text - The text to validate
     * @returns {Object} - Validation result with isValid and details
     */
    validateTextContent(text) {
        const result = {
            isValid: false,
            error: null,
            warnings: [],
            estimatedSize: null
        };

        // Check if text exists
        if (!text || typeof text !== 'string') {
            result.error = 'Text content is required';
            return result;
        }

        const trimmedText = text.trim();

        // Check if text is empty
        if (trimmedText.length === 0) {
            result.error = 'Text content cannot be empty';
            return result;
        }

        // Check length limits
        if (trimmedText.length > 2000) {
            result.error = 'Text is too long (maximum 2000 characters)';
            return result;
        }

        // Warnings for optimal QR code scanning
        if (trimmedText.length > 300) {
            result.warnings.push('Long text may result in complex QR codes that are harder to scan');
        }

        if (trimmedText.includes('\n') && trimmedText.split('\n').length > 10) {
            result.warnings.push('Many line breaks may affect QR code readability');
        }

        // Estimate QR code complexity
        result.estimatedSize = this.estimateQRSize(trimmedText);
        
        result.isValid = true;
        return result;
    }

    /**
     * Estimate QR code size/complexity based on content
     * @param {string} text - The text content
     * @returns {string} - Size estimate (small, medium, large, very-large)
     */
    estimateQRSize(text) {
        const length = text.length;
        
        if (length <= 50) return 'small';
        if (length <= 150) return 'medium';
        if (length <= 300) return 'large';
        return 'very-large';
    }

    /**
     * Get recommended settings based on text content
     * @param {string} text - The text content
     * @returns {Object} - Recommended QR code settings
     */
    getRecommendedSettings(text) {
        const validation = this.validateTextContent(text);
        
        const recommendations = {
            errorCorrection: 'M',
            size: 300,
            margin: 2,
            printSize: 600
        };

        if (validation.estimatedSize === 'very-large') {
            recommendations.errorCorrection = 'L'; // Lower error correction for complex codes
            recommendations.size = 400; // Larger size for better readability
            recommendations.printSize = 800;
        } else if (validation.estimatedSize === 'small') {
            recommendations.errorCorrection = 'H'; // Higher error correction for simple codes
        }

        return recommendations;
    }

    /**
     * Format text for optimal QR code generation
     * @param {string} text - The raw text input
     * @returns {string} - Formatted text
     */
    formatTextForQR(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        // Trim whitespace
        let formatted = text.trim();

        // Normalize line endings
        formatted = formatted.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // Remove excessive consecutive line breaks (more than 2)
        formatted = formatted.replace(/\n{3,}/g, '\n\n');

        // Remove trailing spaces from each line
        formatted = formatted.split('\n').map(line => line.trimEnd()).join('\n');

        return formatted;
    }

    /**
     * Get text statistics for user information
     * @param {string} text - The text content
     * @returns {Object} - Text statistics
     */
    getTextStats(text) {
        if (!text || typeof text !== 'string') {
            return {
                characters: 0,
                lines: 0,
                words: 0,
                estimatedQRSize: 'small'
            };
        }

        const trimmedText = text.trim();
        const lines = trimmedText.split('\n').length;
        const words = trimmedText.split(/\s+/).filter(word => word.length > 0).length;

        return {
            characters: trimmedText.length,
            lines: lines,
            words: words,
            estimatedQRSize: this.estimateQRSize(trimmedText)
        };
    }
}
