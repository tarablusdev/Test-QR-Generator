export class PaymentFormValidator {
    constructor() {
        this.validationRules = {
            paypal: {
                required: ['paymentType', 'paypalUsername'],
                optional: ['paypalAmount']
            },
            bitcoin: {
                required: ['paymentType', 'cryptoAddress'],
                optional: ['cryptoAmount']
            },
            ethereum: {
                required: ['paymentType', 'cryptoAddress'],
                optional: ['cryptoAmount']
            },
            upi: {
                required: ['paymentType', 'upiId', 'upiName'],
                optional: ['upiAmount']
            },
            iban: {
                required: ['paymentType', 'ibanCode', 'ibanName'],
                optional: ['ibanAmount']
            },
            url: {
                required: ['paymentType', 'paymentUrl'],
                optional: []
            }
        };
    }

    validatePaymentData(paymentData) {
        const errors = [];
        const { paymentType } = paymentData;

        // Check if payment type is selected
        if (!paymentType) {
            errors.push('Please select a payment type');
            return { isValid: false, errors };
        }

        // Check if payment type is supported
        if (!this.validationRules[paymentType]) {
            errors.push('Unsupported payment type selected');
            return { isValid: false, errors };
        }

        // Validate required fields
        const rules = this.validationRules[paymentType];
        for (const field of rules.required) {
            if (!paymentData[field] || paymentData[field].trim() === '') {
                errors.push(this.getFieldErrorMessage(field));
            }
        }

        // Validate specific payment type data
        switch (paymentType) {
            case 'paypal':
                this.validatePayPalData(paymentData, errors);
                break;
            case 'bitcoin':
                this.validateBitcoinData(paymentData, errors);
                break;
            case 'ethereum':
                this.validateEthereumData(paymentData, errors);
                break;
            case 'upi':
                this.validateUPIData(paymentData, errors);
                break;
            case 'iban':
                this.validateIBANData(paymentData, errors);
                break;
            case 'url':
                this.validateURLData(paymentData, errors);
                break;
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validatePayPalData(data, errors) {
        const { paypalUsername, paypalAmount } = data;

        // Validate username format
        if (paypalUsername) {
            const usernameRegex = /^[a-zA-Z0-9._-]+$/;
            if (!usernameRegex.test(paypalUsername)) {
                errors.push('PayPal username can only contain letters, numbers, dots, underscores, and hyphens');
            }
            if (paypalUsername.length < 3) {
                errors.push('PayPal username must be at least 3 characters long');
            }
            if (paypalUsername.length > 50) {
                errors.push('PayPal username must be less than 50 characters');
            }
        }

        // Validate amount if provided
        if (paypalAmount && paypalAmount.trim() !== '') {
            const amount = parseFloat(paypalAmount);
            if (isNaN(amount) || amount <= 0) {
                errors.push('PayPal amount must be a positive number');
            }
            if (amount > 10000) {
                errors.push('PayPal amount cannot exceed $10,000');
            }
        }
    }

    validateBitcoinData(data, errors) {
        const { cryptoAddress, cryptoAmount } = data;

        // Validate Bitcoin address format
        if (cryptoAddress) {
            const bitcoinRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
            if (!bitcoinRegex.test(cryptoAddress)) {
                errors.push('Invalid Bitcoin address format');
            }
        }

        // Validate amount if provided
        if (cryptoAmount && cryptoAmount.trim() !== '') {
            const amount = parseFloat(cryptoAmount);
            if (isNaN(amount) || amount <= 0) {
                errors.push('Bitcoin amount must be a positive number');
            }
            if (amount > 21) {
                errors.push('Bitcoin amount cannot exceed 21 BTC');
            }
        }
    }

    validateEthereumData(data, errors) {
        const { cryptoAddress, cryptoAmount } = data;

        // Validate Ethereum address format
        if (cryptoAddress) {
            const ethereumRegex = /^0x[a-fA-F0-9]{40}$/;
            if (!ethereumRegex.test(cryptoAddress)) {
                errors.push('Invalid Ethereum address format (must start with 0x and be 42 characters long)');
            }
        }

        // Validate amount if provided
        if (cryptoAmount && cryptoAmount.trim() !== '') {
            const amount = parseFloat(cryptoAmount);
            if (isNaN(amount) || amount <= 0) {
                errors.push('Ethereum amount must be a positive number');
            }
            if (amount > 1000) {
                errors.push('Ethereum amount cannot exceed 1000 ETH');
            }
        }
    }

    validateUPIData(data, errors) {
        const { upiId, upiName, upiAmount } = data;

        // Validate UPI ID format
        if (upiId) {
            const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+$/;
            if (!upiRegex.test(upiId)) {
                errors.push('Invalid UPI ID format (should be like user@bank)');
            }
        }

        // Validate payee name
        if (upiName) {
            if (upiName.length < 2) {
                errors.push('Payee name must be at least 2 characters long');
            }
            if (upiName.length > 100) {
                errors.push('Payee name must be less than 100 characters');
            }
            const nameRegex = /^[a-zA-Z\s.'-]+$/;
            if (!nameRegex.test(upiName)) {
                errors.push('Payee name can only contain letters, spaces, dots, apostrophes, and hyphens');
            }
        }

        // Validate amount if provided
        if (upiAmount && upiAmount.trim() !== '') {
            const amount = parseFloat(upiAmount);
            if (isNaN(amount) || amount <= 0) {
                errors.push('UPI amount must be a positive number');
            }
            if (amount > 100000) {
                errors.push('UPI amount cannot exceed ₹1,00,000');
            }
        }
    }

    validateIBANData(data, errors) {
        const { ibanCode, ibanName, ibanAmount } = data;

        // Validate IBAN format
        if (ibanCode) {
            const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/;
            const cleanIban = ibanCode.replace(/\s/g, '').toUpperCase();
            
            if (!ibanRegex.test(cleanIban)) {
                errors.push('Invalid IBAN format');
            } else if (!this.validateIBANChecksum(cleanIban)) {
                errors.push('Invalid IBAN checksum');
            }
        }

        // Validate account holder name
        if (ibanName) {
            if (ibanName.length < 2) {
                errors.push('Account holder name must be at least 2 characters long');
            }
            if (ibanName.length > 100) {
                errors.push('Account holder name must be less than 100 characters');
            }
            const nameRegex = /^[a-zA-Z\s.'-]+$/;
            if (!nameRegex.test(ibanName)) {
                errors.push('Account holder name can only contain letters, spaces, dots, apostrophes, and hyphens');
            }
        }

        // Validate amount if provided
        if (ibanAmount && ibanAmount.trim() !== '') {
            const amount = parseFloat(ibanAmount);
            if (isNaN(amount) || amount <= 0) {
                errors.push('IBAN amount must be a positive number');
            }
            if (amount > 999999) {
                errors.push('IBAN amount cannot exceed €999,999');
            }
        }
    }

    validateURLData(data, errors) {
        const { paymentUrl } = data;

        if (paymentUrl) {
            try {
                const url = new URL(paymentUrl);
                
                // Check protocol
                if (!['http:', 'https:'].includes(url.protocol)) {
                    errors.push('Payment URL must use HTTP or HTTPS protocol');
                }
                
                // Check if URL is too long
                if (paymentUrl.length > 2048) {
                    errors.push('Payment URL is too long (maximum 2048 characters)');
                }
                
                // Check for suspicious patterns
                if (this.containsSuspiciousPatterns(paymentUrl)) {
                    errors.push('Payment URL contains suspicious patterns');
                }
                
            } catch (error) {
                errors.push('Invalid payment URL format');
            }
        }
    }

    validateIBANChecksum(iban) {
        // Move first 4 characters to end
        const rearranged = iban.slice(4) + iban.slice(0, 4);
        
        // Replace letters with numbers (A=10, B=11, ..., Z=35)
        const numericString = rearranged.replace(/[A-Z]/g, (char) => {
            return (char.charCodeAt(0) - 55).toString();
        });
        
        // Calculate mod 97
        let remainder = 0;
        for (let i = 0; i < numericString.length; i++) {
            remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
        }
        
        return remainder === 1;
    }

    containsSuspiciousPatterns(url) {
        const suspiciousPatterns = [
            /javascript:/i,
            /data:/i,
            /vbscript:/i,
            /<script/i,
            /onclick/i,
            /onerror/i,
            /onload/i
        ];
        
        return suspiciousPatterns.some(pattern => pattern.test(url));
    }

    getFieldErrorMessage(field) {
        const errorMessages = {
            paymentType: 'Please select a payment type',
            paypalUsername: 'PayPal username is required',
            cryptoAddress: 'Wallet address is required',
            upiId: 'UPI ID is required',
            upiName: 'Payee name is required',
            ibanCode: 'IBAN code is required',
            ibanName: 'Account holder name is required',
            paymentUrl: 'Payment URL is required'
        };
        
        return errorMessages[field] || `${field} is required`;
    }

    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return input;
        }
        
        // Remove potentially dangerous characters
        return input
            .replace(/[<>'"]/g, '')
            .trim();
    }

    formatAmount(amount, currency = '') {
        if (!amount || isNaN(parseFloat(amount))) {
            return '';
        }
        
        const num = parseFloat(amount);
        const formatted = num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        });
        
        return currency ? `${currency}${formatted}` : formatted;
    }

    validateRealTimeField(fieldName, value, paymentType) {
        const errors = [];
        
        switch (fieldName) {
            case 'paypalUsername':
                if (value && paymentType === 'paypal') {
                    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
                    if (!usernameRegex.test(value)) {
                        errors.push('Username can only contain letters, numbers, dots, underscores, and hyphens');
                    }
                }
                break;
                
            case 'cryptoAddress':
                if (value) {
                    if (paymentType === 'bitcoin') {
                        const bitcoinRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
                        if (!bitcoinRegex.test(value)) {
                            errors.push('Invalid Bitcoin address format');
                        }
                    } else if (paymentType === 'ethereum') {
                        const ethereumRegex = /^0x[a-fA-F0-9]{40}$/;
                        if (!ethereumRegex.test(value)) {
                            errors.push('Invalid Ethereum address format');
                        }
                    }
                }
                break;
                
            case 'upiId':
                if (value && paymentType === 'upi') {
                    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+$/;
                    if (!upiRegex.test(value)) {
                        errors.push('Invalid UPI ID format (should be like user@bank)');
                    }
                }
                break;
                
            case 'ibanCode':
                if (value && paymentType === 'iban') {
                    const cleanIban = value.replace(/\s/g, '').toUpperCase();
                    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/;
                    if (!ibanRegex.test(cleanIban)) {
                        errors.push('Invalid IBAN format');
                    }
                }
                break;
                
            case 'paymentUrl':
                if (value && paymentType === 'url') {
                    try {
                        const url = new URL(value);
                        if (!['http:', 'https:'].includes(url.protocol)) {
                            errors.push('URL must use HTTP or HTTPS protocol');
                        }
                    } catch (error) {
                        errors.push('Invalid URL format');
                    }
                }
                break;
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
