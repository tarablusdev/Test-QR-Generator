export class EmailFormValidator {
    constructor() {
        this.recipientInput = document.getElementById('recipient-input');
        this.subjectInput = document.getElementById('subject-input');
        this.bodyInput = document.getElementById('body-input');
        
        this.recipientError = document.getElementById('recipient-error');
        this.subjectError = document.getElementById('subject-error');
        this.bodyError = document.getElementById('body-error');
        
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    }

    /**
     * Validate recipient email address
     * @param {string} recipient - Email address to validate
     * @returns {boolean} True if valid
     */
    validateRecipient(recipient) {
        const errorElement = this.recipientError;
        const inputElement = this.recipientInput;
        
        // Clear previous error state
        this.clearFieldError(inputElement, errorElement);
        
        if (!recipient) {
            this.showFieldError(inputElement, errorElement, 'Recipient email is required');
            return false;
        }

        if (recipient.length > 254) {
            this.showFieldError(inputElement, errorElement, 'Email address is too long (maximum 254 characters)');
            return false;
        }

        if (!this.emailRegex.test(recipient)) {
            this.showFieldError(inputElement, errorElement, 'Please enter a valid email address');
            return false;
        }

        // Additional email validation checks
        if (recipient.includes('..')) {
            this.showFieldError(inputElement, errorElement, 'Email address cannot contain consecutive dots');
            return false;
        }

        if (recipient.startsWith('.') || recipient.endsWith('.')) {
            this.showFieldError(inputElement, errorElement, 'Email address cannot start or end with a dot');
            return false;
        }

        const [localPart, domain] = recipient.split('@');
        
        if (localPart.length > 64) {
            this.showFieldError(inputElement, errorElement, 'Email local part is too long (maximum 64 characters)');
            return false;
        }

        if (domain.length > 253) {
            this.showFieldError(inputElement, errorElement, 'Email domain is too long (maximum 253 characters)');
            return false;
        }

        // Show success state
        this.showFieldSuccess(inputElement);
        return true;
    }

    /**
     * Validate email subject
     * @param {string} subject - Subject to validate
     * @returns {boolean} True if valid
     */
    validateSubject(subject) {
        const errorElement = this.subjectError;
        const inputElement = this.subjectInput;
        
        // Clear previous error state
        this.clearFieldError(inputElement, errorElement);
        
        // Subject is optional, so empty is valid
        if (!subject) {
            return true;
        }

        if (subject.length > 100) {
            this.showFieldError(inputElement, errorElement, 'Subject is too long (maximum 100 characters)');
            return false;
        }

        // Check for potentially problematic characters
        const problematicChars = /[\r\n\t]/;
        if (problematicChars.test(subject)) {
            this.showFieldError(inputElement, errorElement, 'Subject cannot contain line breaks or tabs');
            return false;
        }

        return true;
    }

    /**
     * Validate email body
     * @param {string} body - Body text to validate
     * @returns {boolean} True if valid
     */
    validateBody(body) {
        const errorElement = this.bodyError;
        const inputElement = this.bodyInput;
        
        // Clear previous error state
        this.clearFieldError(inputElement, errorElement);
        
        // Body is optional, so empty is valid
        if (!body) {
            return true;
        }

        if (body.length > 500) {
            this.showFieldError(inputElement, errorElement, 'Email body is too long (maximum 500 characters)');
            return false;
        }

        return true;
    }

    /**
     * Validate complete email form
     * @returns {Object} Validation result with isValid flag and data
     */
    validateForm() {
        const recipient = this.recipientInput?.value.trim() || '';
        const subject = this.subjectInput?.value.trim() || '';
        const body = this.bodyInput?.value.trim() || '';

        const isRecipientValid = this.validateRecipient(recipient);
        const isSubjectValid = this.validateSubject(subject);
        const isBodyValid = this.validateBody(body);

        const isValid = isRecipientValid && isSubjectValid && isBodyValid;

        return {
            isValid,
            data: isValid ? { recipient, subject, body } : null,
            errors: {
                recipient: !isRecipientValid,
                subject: !isSubjectValid,
                body: !isBodyValid
            }
        };
    }

    /**
     * Show field error state
     * @param {HTMLElement} inputElement - Input element
     * @param {HTMLElement} errorElement - Error message element
     * @param {string} message - Error message
     */
    showFieldError(inputElement, errorElement, message) {
        if (inputElement) {
            inputElement.classList.add('form-input-error');
            inputElement.classList.remove('border-green-500', 'focus:border-green-500', 'focus:ring-green-500');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    /**
     * Show field success state
     * @param {HTMLElement} inputElement - Input element
     */
    showFieldSuccess(inputElement) {
        if (inputElement) {
            inputElement.classList.remove('form-input-error');
            inputElement.classList.add('border-green-500', 'focus:border-green-500', 'focus:ring-green-500');
        }
    }

    /**
     * Clear field error state
     * @param {HTMLElement} inputElement - Input element
     * @param {HTMLElement} errorElement - Error message element
     */
    clearFieldError(inputElement, errorElement) {
        if (inputElement) {
            inputElement.classList.remove('form-input-error', 'border-green-500', 'focus:border-green-500', 'focus:ring-green-500');
        }
        
        if (errorElement) {
            errorElement.classList.add('hidden');
            errorElement.textContent = '';
        }
    }

    /**
     * Clear all validation states
     */
    clearValidationStates() {
        this.clearFieldError(this.recipientInput, this.recipientError);
        this.clearFieldError(this.subjectInput, this.subjectError);
        this.clearFieldError(this.bodyInput, this.bodyError);
    }

    /**
     * Validate email address format (static method)
     * @param {string} email - Email address to validate
     * @returns {boolean} True if valid format
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Sanitize input text
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     */
    static sanitizeText(text) {
        if (!text) return '';
        
        return text
            .trim()
            .replace(/[\r\n\t]/g, ' ') // Replace line breaks and tabs with spaces
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .substring(0, 1000); // Limit length for security
    }

    /**
     * Get validation rules for display
     * @returns {Object} Validation rules
     */
    getValidationRules() {
        return {
            recipient: {
                required: true,
                maxLength: 254,
                format: 'Valid email address'
            },
            subject: {
                required: false,
                maxLength: 100,
                format: 'No line breaks or tabs'
            },
            body: {
                required: false,
                maxLength: 500,
                format: 'Plain text'
            }
        };
    }
}
