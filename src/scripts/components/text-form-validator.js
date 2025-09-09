export class TextFormValidator {
    constructor() {
        this.maxLength = 2000;
        this.minLength = 1;
        this.warningThreshold = 300;
    }

    /**
     * Validate text input for QR code generation
     * @param {string} text - The text to validate
     * @returns {Object} - Validation result
     */
    validateText(text) {
        const result = {
            isValid: false,
            error: null,
            warning: null,
            suggestions: []
        };

        // Check if text exists
        if (text === null || text === undefined) {
            result.error = 'Text content is required';
            return result;
        }

        // Convert to string if not already
        const textStr = String(text);
        const trimmedText = textStr.trim();

        // Check minimum length
        if (trimmedText.length < this.minLength) {
            result.error = 'Please enter some text to generate a QR code';
            return result;
        }

        // Check maximum length
        if (trimmedText.length > this.maxLength) {
            result.error = `Text is too long. Maximum ${this.maxLength} characters allowed (current: ${trimmedText.length})`;
            return result;
        }

        // Check for potential scanning issues
        const scanningIssues = this.checkScanningOptimization(trimmedText);
        if (scanningIssues.warning) {
            result.warning = scanningIssues.warning;
        }
        if (scanningIssues.suggestions.length > 0) {
            result.suggestions = scanningIssues.suggestions;
        }

        // All validations passed
        result.isValid = true;
        return result;
    }

    /**
     * Check for potential QR code scanning optimization issues
     * @param {string} text - The text to analyze
     * @returns {Object} - Optimization analysis
     */
    checkScanningOptimization(text) {
        const analysis = {
            warning: null,
            suggestions: []
        };

        const length = text.length;

        // Length-based warnings
        if (length > this.warningThreshold) {
            analysis.warning = `Long text (${length} characters) may create complex QR codes that are harder to scan`;
            analysis.suggestions.push('Consider shortening the text for better scanning reliability');
        }

        // Line break analysis
        const lines = text.split('\n').length;
        if (lines > 15) {
            analysis.suggestions.push('Consider reducing the number of line breaks for better readability');
        }

        // Special character analysis
        const specialCharCount = (text.match(/[^\w\s\n.,!?;:()\-]/g) || []).length;
        if (specialCharCount > length * 0.2) {
            analysis.suggestions.push('High number of special characters may affect QR code complexity');
        }

        // Very long lines
        const longLines = text.split('\n').filter(line => line.length > 100);
        if (longLines.length > 0) {
            analysis.suggestions.push('Consider breaking very long lines for better formatting');
        }

        return analysis;
    }

    /**
     * Real-time validation for input events
     * @param {string} text - Current text input
     * @returns {Object} - Real-time validation result
     */
    validateRealTime(text) {
        const result = {
            isValid: true,
            showError: false,
            showWarning: false,
            message: '',
            characterCount: {
                current: 0,
                max: this.maxLength,
                percentage: 0,
                status: 'normal' // normal, warning, danger
            }
        };

        if (!text) {
            result.characterCount.current = 0;
            result.characterCount.percentage = 0;
            return result;
        }

        const textStr = String(text);
        const trimmedText = textStr.trim();
        const length = trimmedText.length;

        // Update character count
        result.characterCount.current = length;
        result.characterCount.percentage = (length / this.maxLength) * 100;

        // Determine character count status
        if (length > this.maxLength * 0.9) {
            result.characterCount.status = 'danger';
        } else if (length > this.maxLength * 0.7) {
            result.characterCount.status = 'warning';
        } else {
            result.characterCount.status = 'normal';
        }

        // Check if over limit
        if (length > this.maxLength) {
            result.isValid = false;
            result.showError = true;
            result.message = `Text exceeds maximum length by ${length - this.maxLength} characters`;
            return result;
        }

        // Check for warnings
        if (length > this.warningThreshold) {
            result.showWarning = true;
            result.message = 'Long text may create complex QR codes';
        }

        return result;
    }

    /**
     * Validate and format text for optimal QR code generation
     * @param {string} text - Raw text input
     * @returns {Object} - Formatted text and validation result
     */
    validateAndFormat(text) {
        const validation = this.validateText(text);
        
        if (!validation.isValid) {
            return {
                ...validation,
                formattedText: text
            };
        }

        const formattedText = this.formatText(text);
        
        return {
            ...validation,
            formattedText: formattedText,
            wasFormatted: formattedText !== text
        };
    }

    /**
     * Format text for optimal QR code generation
     * @param {string} text - Raw text input
     * @returns {string} - Formatted text
     */
    formatText(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        let formatted = text;

        // Trim overall whitespace
        formatted = formatted.trim();

        // Normalize line endings
        formatted = formatted.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        // Remove excessive consecutive line breaks (more than 2)
        formatted = formatted.replace(/\n{3,}/g, '\n\n');

        // Remove trailing spaces from each line
        formatted = formatted.split('\n').map(line => line.trimEnd()).join('\n');

        // Remove leading/trailing empty lines
        formatted = formatted.replace(/^\n+|\n+$/g, '');

        return formatted;
    }

    /**
     * Get text complexity analysis
     * @param {string} text - Text to analyze
     * @returns {Object} - Complexity analysis
     */
    getComplexityAnalysis(text) {
        if (!text || typeof text !== 'string') {
            return {
                complexity: 'minimal',
                score: 0,
                factors: []
            };
        }

        const trimmedText = text.trim();
        let score = 0;
        const factors = [];

        // Length factor
        const length = trimmedText.length;
        if (length > 500) {
            score += 3;
            factors.push('Very long text');
        } else if (length > 200) {
            score += 2;
            factors.push('Long text');
        } else if (length > 50) {
            score += 1;
            factors.push('Medium length text');
        }

        // Line breaks factor
        const lines = trimmedText.split('\n').length;
        if (lines > 10) {
            score += 2;
            factors.push('Many line breaks');
        } else if (lines > 5) {
            score += 1;
            factors.push('Multiple lines');
        }

        // Special characters factor
        const specialChars = (trimmedText.match(/[^\w\s\n.,!?;:()\-]/g) || []).length;
        if (specialChars > length * 0.15) {
            score += 2;
            factors.push('Many special characters');
        } else if (specialChars > length * 0.05) {
            score += 1;
            factors.push('Some special characters');
        }

        // Unicode characters factor
        const unicodeChars = (trimmedText.match(/[^\x00-\x7F]/g) || []).length;
        if (unicodeChars > 0) {
            score += 1;
            factors.push('Unicode characters');
        }

        // Determine complexity level
        let complexity;
        if (score >= 6) {
            complexity = 'very-high';
        } else if (score >= 4) {
            complexity = 'high';
        } else if (score >= 2) {
            complexity = 'medium';
        } else if (score >= 1) {
            complexity = 'low';
        } else {
            complexity = 'minimal';
        }

        return {
            complexity,
            score,
            factors
        };
    }

    /**
     * Get recommendations based on text analysis
     * @param {string} text - Text to analyze
     * @returns {Array} - Array of recommendation objects
     */
    getRecommendations(text) {
        const recommendations = [];
        
        if (!text || typeof text !== 'string') {
            return recommendations;
        }

        const trimmedText = text.trim();
        const length = trimmedText.length;
        const complexity = this.getComplexityAnalysis(text);

        // Length recommendations
        if (length > 500) {
            recommendations.push({
                type: 'warning',
                title: 'Consider shortening text',
                message: 'Very long text creates complex QR codes that may be difficult to scan',
                priority: 'high'
            });
        } else if (length > 200) {
            recommendations.push({
                type: 'info',
                title: 'Text length notice',
                message: 'Longer text creates more complex QR codes',
                priority: 'medium'
            });
        }

        // Complexity recommendations
        if (complexity.complexity === 'very-high' || complexity.complexity === 'high') {
            recommendations.push({
                type: 'warning',
                title: 'High complexity detected',
                message: 'Consider simplifying the text for better QR code scanning',
                priority: 'high'
            });
        }

        // Line break recommendations
        const lines = trimmedText.split('\n').length;
        if (lines > 15) {
            recommendations.push({
                type: 'info',
                title: 'Many line breaks',
                message: 'Consider reducing line breaks for better readability',
                priority: 'low'
            });
        }

        // Format recommendations
        const formatted = this.formatText(text);
        if (formatted !== text) {
            recommendations.push({
                type: 'info',
                title: 'Text formatting',
                message: 'Text can be automatically formatted for better QR code generation',
                priority: 'low'
            });
        }

        return recommendations;
    }
}
