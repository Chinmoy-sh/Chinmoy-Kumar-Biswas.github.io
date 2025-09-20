/**
 * SECURITY UTILITIES MODULE
 * Comprehensive security utilities for input validation, sanitization, and protection
 * @module security
 */

/**
 * Advanced HTML sanitization to prevent XSS attacks
 * @param {string} input - Input string to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input, options = {}) => {
    if (typeof input !== 'string') return '';

    const {
        maxLength = 1000,
        allowWhitespace = true,
        allowNewlines = false,
        stripTags = true,
        trimWhitespace = true
    } = options;

    let sanitized = input;

    // Trim whitespace if requested
    if (trimWhitespace) {
        sanitized = sanitized.trim();
    }

    // Remove or escape HTML tags
    if (stripTags) {
        sanitized = sanitized.replace(/<[^>]*>/g, '');
    } else {
        sanitized = sanitized
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    // Handle newlines
    if (!allowNewlines) {
        sanitized = sanitized.replace(/[\r\n]/g, ' ');
    }

    // Handle whitespace
    if (!allowWhitespace) {
        sanitized = sanitized.replace(/\s+/g, '');
    } else {
        // Normalize multiple spaces
        sanitized = sanitized.replace(/\s+/g, ' ');
    }

    // Enforce length limit
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
};

/**
 * Enhanced email validation with security considerations
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') return false;

    // Basic length check
    if (email.length > 254) return false;

    // Enhanced email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Additional security checks
    const hasValidStructure = emailRegex.test(email);
    const noConsecutiveDots = !email.includes('..');
    const noStartEndDots = !email.startsWith('.') && !email.endsWith('.');
    const hasAtSymbol = email.split('@').length === 2;

    return hasValidStructure && noConsecutiveDots && noStartEndDots && hasAtSymbol;
};

/**
 * Validate URL with security considerations
 * @param {string} url - URL to validate
 * @param {Object} options - Validation options
 * @returns {boolean} True if valid URL
 */
export const validateURL = (url, options = {}) => {
    if (!url || typeof url !== 'string') return false;

    const { allowedProtocols = ['http:', 'https:'], maxLength = 2048 } = options;

    // Length check
    if (url.length > maxLength) return false;

    try {
        const urlObj = new URL(url);

        // Protocol check
        if (!allowedProtocols.includes(urlObj.protocol)) return false;

        // Basic security checks
        const hasValidHost = urlObj.hostname.length > 0;
        const noJavascriptProtocol = !url.toLowerCase().startsWith('javascript:');
        const noDataProtocol = !url.toLowerCase().startsWith('data:');

        return hasValidHost && noJavascriptProtocol && noDataProtocol;
    } catch {
        return false;
    }
};

/**
 * Phone number validation
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
export const validatePhone = (phone) => {
    if (!phone || typeof phone !== 'string') return false;

    // Remove common formatting characters
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');

    // Check if contains only digits and is reasonable length
    const isNumeric = /^\d+$/.test(cleaned);
    const isValidLength = cleaned.length >= 7 && cleaned.length <= 15;

    return isNumeric && isValidLength;
};

/**
 * Generic input validation with security rules
 * @param {string} input - Input to validate
 * @param {string} type - Type of validation
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result
 */
export const validateInput = (input, type, rules = {}) => {
    const result = {
        isValid: false,
        errors: [],
        sanitizedValue: ''
    };

    // Sanitize input first
    result.sanitizedValue = sanitizeInput(input, rules.sanitize);

    switch (type) {
        case 'name':
            if (rules.required && !result.sanitizedValue) {
                result.errors.push('Name is required');
            }
            if (result.sanitizedValue.length > (rules.maxLength || 100)) {
                result.errors.push(`Name must be less than ${rules.maxLength || 100} characters`);
            }
            if (result.sanitizedValue.length < (rules.minLength || 1)) {
                result.errors.push(`Name must be at least ${rules.minLength || 1} characters`);
            }
            break;

        case 'email':
            if (rules.required && !result.sanitizedValue) {
                result.errors.push('Email is required');
            }
            if (result.sanitizedValue && !validateEmail(result.sanitizedValue)) {
                result.errors.push('Please enter a valid email address');
            }
            break;

        case 'phone':
            if (rules.required && !result.sanitizedValue) {
                result.errors.push('Phone number is required');
            }
            if (result.sanitizedValue && !validatePhone(result.sanitizedValue)) {
                result.errors.push('Please enter a valid phone number');
            }
            break;

        case 'url':
            if (rules.required && !result.sanitizedValue) {
                result.errors.push('URL is required');
            }
            if (result.sanitizedValue && !validateURL(result.sanitizedValue, rules.url)) {
                result.errors.push('Please enter a valid URL');
            }
            break;

        case 'text':
        case 'message':
            if (rules.required && !result.sanitizedValue) {
                result.errors.push('This field is required');
            }
            if (result.sanitizedValue.length > (rules.maxLength || 5000)) {
                result.errors.push(`Text must be less than ${rules.maxLength || 5000} characters`);
            }
            if (result.sanitizedValue.length < (rules.minLength || 0)) {
                result.errors.push(`Text must be at least ${rules.minLength || 0} characters`);
            }
            break;

        default:
            result.errors.push('Unknown validation type');
    }

    result.isValid = result.errors.length === 0;
    return result;
};

/**
 * Rate limiting utility to prevent abuse
 * @param {string} key - Unique key for rate limiting
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} timeWindow - Time window in milliseconds
 * @returns {boolean} True if request is allowed
 */
export const checkRateLimit = (key, maxRequests = 10, timeWindow = 60000) => {
    const now = Date.now();
    const rateLimitKey = `rate_limit_${key}`;

    // Get existing data
    let requestData;
    try {
        requestData = JSON.parse(localStorage.getItem(rateLimitKey)) || { count: 0, resetTime: now + timeWindow };
    } catch {
        requestData = { count: 0, resetTime: now + timeWindow };
    }

    // Reset if time window has passed
    if (now > requestData.resetTime) {
        requestData = { count: 1, resetTime: now + timeWindow };
        localStorage.setItem(rateLimitKey, JSON.stringify(requestData));
        return true;
    }

    // Check if within limit
    if (requestData.count < maxRequests) {
        requestData.count++;
        localStorage.setItem(rateLimitKey, JSON.stringify(requestData));
        return true;
    }

    return false;
};

/**
 * Generate secure random token
 * @param {number} length - Token length
 * @returns {string} Random token
 */
export const generateSecureToken = (length = 32) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    // Use crypto.getRandomValues if available
    if (window.crypto && window.crypto.getRandomValues) {
        const randomBytes = new Uint8Array(length);
        window.crypto.getRandomValues(randomBytes);

        for (let i = 0; i < length; i++) {
            result += charset[randomBytes[i] % charset.length];
        }
    } else {
        // Fallback to Math.random (less secure)
        for (let i = 0; i < length; i++) {
            result += charset[Math.floor(Math.random() * charset.length)];
        }
    }

    return result;
};

/**
 * Secure form submission handler
 * @param {FormData} formData - Form data to process
 * @param {Object} config - Security configuration
 * @returns {Object} Processing result
 */
export const secureFormSubmission = (formData, config = {}) => {
    const result = {
        success: false,
        errors: [],
        sanitizedData: {},
        token: null
    };

    // Generate security token
    result.token = generateSecureToken();

    // Check rate limiting
    if (!checkRateLimit('form_submission', config.maxSubmissions || 5, config.timeWindow || 300000)) {
        result.errors.push('Too many submissions. Please wait before trying again.');
        return result;
    }

    // Process each field
    for (const [key, value] of formData.entries()) {
        const fieldConfig = config.fields?.[key] || {};
        const validation = validateInput(value, fieldConfig.type || 'text', fieldConfig.rules || {});

        if (!validation.isValid) {
            result.errors.push(...validation.errors);
        } else {
            result.sanitizedData[key] = validation.sanitizedValue;
        }
    }

    result.success = result.errors.length === 0;
    return result;
};

/**
 * Security event logger
 * @param {string} event - Event type
 * @param {Object} details - Event details
 */
export const logSecurityEvent = (event, details = {}) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        event,
        details,
        userAgent: navigator.userAgent,
        url: window.location.href
    };

    // In production, send to security monitoring service
    if (window.CONFIG?.features?.debugMode) {
        console.warn('Security Event:', logEntry);
    }

    // Store locally for debugging (limit size)
    try {
        const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        logs.push(logEntry);

        // Keep only last 50 logs
        if (logs.length > 50) {
            logs.splice(0, logs.length - 50);
        }

        localStorage.setItem('security_logs', JSON.stringify(logs));
    } catch (error) {
        console.error('Failed to log security event:', error);
    }
};

/**
 * Initialize security monitoring
 */
export const initializeSecurity = () => {
    // Monitor for potential XSS attempts
    const originalInnerHTML = Element.prototype.innerHTML;
    Element.prototype.innerHTML = function (value) {
        if (typeof value === 'string' && (value.includes('<script') || value.includes('javascript:'))) {
            logSecurityEvent('potential_xss_attempt', {
                element: this.tagName,
                content: value.substring(0, 100)
            });
        }
        return originalInnerHTML.call(this, value);
    };

    // Monitor for console access attempts
    const originalLog = console.log;
    console.log = function (...args) {
        if (args.some(arg => typeof arg === 'string' && arg.includes('password'))) {
            logSecurityEvent('sensitive_console_log', { args: args.map(a => typeof a) });
        }
        return originalLog.apply(this, args);
    };

    // Monitor for localStorage abuse
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
        if (value && value.length > 10000) {
            logSecurityEvent('large_storage_write', { key, size: value.length });
        }
        return originalSetItem.call(this, key, value);
    };

    logSecurityEvent('security_monitoring_initialized');
};