import QRCode from 'https://cdn.skypack.dev/qrcode';

export class PaymentQRGenerator {
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
            width: 256
        };
    }

    async generateQR(paymentString) {
        try {
            // Validate payment string
            if (!paymentString || typeof paymentString !== 'string') {
                throw new Error('Invalid payment string provided');
            }

            // Generate QR code data URL
            const qrDataURL = await QRCode.toDataURL(paymentString, this.qrOptions);
            
            return {
                dataURL: qrDataURL,
                paymentString: paymentString,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw new Error('Failed to generate QR code: ' + error.message);
        }
    }

    displayQR(canvasElement, qrData) {
        if (!canvasElement || !qrData) {
            throw new Error('Canvas element and QR data are required');
        }

        try {
            const ctx = canvasElement.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Set canvas dimensions
                canvasElement.width = img.width;
                canvasElement.height = img.height;
                
                // Clear canvas and draw QR code
                ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                ctx.drawImage(img, 0, 0);
                
                // Add fade-in animation
                canvasElement.style.opacity = '0';
                canvasElement.style.transition = 'opacity 0.3s ease-in-out';
                
                requestAnimationFrame(() => {
                    canvasElement.style.opacity = '1';
                });
            };
            
            img.onerror = () => {
                throw new Error('Failed to load QR code image');
            };
            
            img.src = qrData.dataURL;
        } catch (error) {
            console.error('Error displaying QR code:', error);
            throw new Error('Failed to display QR code: ' + error.message);
        }
    }

    async generateQRCanvas(paymentString, size = 256) {
        try {
            const options = {
                ...this.qrOptions,
                width: size
            };
            
            // Create a temporary canvas
            const canvas = document.createElement('canvas');
            await QRCode.toCanvas(canvas, paymentString, options);
            
            return canvas;
        } catch (error) {
            console.error('Error generating QR canvas:', error);
            throw new Error('Failed to generate QR canvas: ' + error.message);
        }
    }

    validatePaymentString(paymentString, paymentType) {
        if (!paymentString || typeof paymentString !== 'string') {
            return { isValid: false, error: 'Payment string is required' };
        }

        switch (paymentType) {
            case 'paypal':
                return this.validatePayPalString(paymentString);
            case 'bitcoin':
                return this.validateBitcoinString(paymentString);
            case 'ethereum':
                return this.validateEthereumString(paymentString);
            case 'upi':
                return this.validateUPIString(paymentString);
            case 'iban':
                return this.validateIBANString(paymentString);
            case 'url':
                return this.validateURLString(paymentString);
            default:
                return { isValid: false, error: 'Unsupported payment type' };
        }
    }

    validatePayPalString(paymentString) {
        const paypalRegex = /^https:\/\/paypal\.me\/[a-zA-Z0-9._-]+(\/.+)?$/;
        
        if (!paypalRegex.test(paymentString)) {
            return { isValid: false, error: 'Invalid PayPal.me URL format' };
        }
        
        return { isValid: true };
    }

    validateBitcoinString(paymentString) {
        const bitcoinRegex = /^bitcoin:[13][a-km-zA-HJ-NP-Z1-9]{25,34}(\?.*)?$/;
        
        if (!bitcoinRegex.test(paymentString)) {
            return { isValid: false, error: 'Invalid Bitcoin URI format' };
        }
        
        return { isValid: true };
    }

    validateEthereumString(paymentString) {
        const ethereumRegex = /^ethereum:0x[a-fA-F0-9]{40}(\?.*)?$/;
        
        if (!ethereumRegex.test(paymentString)) {
            return { isValid: false, error: 'Invalid Ethereum URI format' };
        }
        
        return { isValid: true };
    }

    validateUPIString(paymentString) {
        const upiRegex = /^upi:\/\/pay\?pa=[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+&pn=.+/;
        
        if (!upiRegex.test(paymentString)) {
            return { isValid: false, error: 'Invalid UPI string format' };
        }
        
        return { isValid: true };
    }

    validateIBANString(paymentString) {
        const ibanRegex = /^iban:[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}(\?.*)?$/;
        
        if (!ibanRegex.test(paymentString)) {
            return { isValid: false, error: 'Invalid IBAN string format' };
        }
        
        return { isValid: true };
    }

    validateURLString(paymentString) {
        try {
            const url = new URL(paymentString);
            
            if (!['http:', 'https:'].includes(url.protocol)) {
                return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
            }
            
            return { isValid: true };
        } catch (error) {
            return { isValid: false, error: 'Invalid URL format' };
        }
    }

    getPaymentTypeFromString(paymentString) {
        if (paymentString.startsWith('https://paypal.me/')) {
            return 'paypal';
        } else if (paymentString.startsWith('bitcoin:')) {
            return 'bitcoin';
        } else if (paymentString.startsWith('ethereum:')) {
            return 'ethereum';
        } else if (paymentString.startsWith('upi://')) {
            return 'upi';
        } else if (paymentString.startsWith('iban:')) {
            return 'iban';
        } else if (paymentString.startsWith('http')) {
            return 'url';
        } else {
            return 'unknown';
        }
    }

    extractPaymentInfo(paymentString) {
        const paymentType = this.getPaymentTypeFromString(paymentString);
        
        switch (paymentType) {
            case 'paypal':
                return this.extractPayPalInfo(paymentString);
            case 'bitcoin':
                return this.extractBitcoinInfo(paymentString);
            case 'ethereum':
                return this.extractEthereumInfo(paymentString);
            case 'upi':
                return this.extractUPIInfo(paymentString);
            case 'iban':
                return this.extractIBANInfo(paymentString);
            case 'url':
                return { type: 'url', url: paymentString };
            default:
                return { type: 'unknown', raw: paymentString };
        }
    }

    extractPayPalInfo(paymentString) {
        const match = paymentString.match(/https:\/\/paypal\.me\/([a-zA-Z0-9._-]+)(?:\/(.+))?/);
        
        if (match) {
            return {
                type: 'paypal',
                username: match[1],
                amount: match[2] || null,
                url: paymentString
            };
        }
        
        return { type: 'paypal', raw: paymentString };
    }

    extractBitcoinInfo(paymentString) {
        const match = paymentString.match(/bitcoin:([13][a-km-zA-HJ-NP-Z1-9]{25,34})(?:\?(.*))?/);
        
        if (match) {
            const params = new URLSearchParams(match[2] || '');
            
            return {
                type: 'bitcoin',
                address: match[1],
                amount: params.get('amount'),
                label: params.get('label'),
                message: params.get('message'),
                uri: paymentString
            };
        }
        
        return { type: 'bitcoin', raw: paymentString };
    }

    extractEthereumInfo(paymentString) {
        const match = paymentString.match(/ethereum:(0x[a-fA-F0-9]{40})(?:\?(.*))?/);
        
        if (match) {
            const params = new URLSearchParams(match[2] || '');
            
            return {
                type: 'ethereum',
                address: match[1],
                value: params.get('value'),
                gas: params.get('gas'),
                gasPrice: params.get('gasPrice'),
                uri: paymentString
            };
        }
        
        return { type: 'ethereum', raw: paymentString };
    }

    extractUPIInfo(paymentString) {
        const params = new URLSearchParams(paymentString.split('?')[1] || '');
        
        return {
            type: 'upi',
            payeeAddress: params.get('pa'),
            payeeName: params.get('pn'),
            amount: params.get('am'),
            currency: params.get('cu'),
            transactionId: params.get('tid'),
            transactionRef: params.get('tr'),
            note: params.get('tn'),
            uri: paymentString
        };
    }

    extractIBANInfo(paymentString) {
        const match = paymentString.match(/iban:([A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}(?:[A-Z0-9]?){0,16})(?:\?(.*))?/);
        
        if (match) {
            const params = new URLSearchParams(match[2] || '');
            
            return {
                type: 'iban',
                iban: match[1],
                beneficiary: params.get('beneficiary'),
                amount: params.get('amount'),
                currency: params.get('currency'),
                reference: params.get('reference'),
                uri: paymentString
            };
        }
        
        return { type: 'iban', raw: paymentString };
    }
}
