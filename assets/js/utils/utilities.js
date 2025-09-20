/**
 * UTILITY FUNCTIONS MODULE
 * Provides common utility functions used throughout the application
 * @module utils
 */

// Performance configuration constants
export const PERFORMANCE_CONFIG = {
    INTERSECTION_THRESHOLD: 0.1,
    INTERSECTION_ROOT_MARGIN: '0px 0px -50px 0px',
    ANIMATION_DELAY_MS: 16, // ~60fps
    DEBOUNCE_DELAY_MS: 100,
    MAX_PARTICLES: { mobile: 12, desktop: 22 },
    MAX_ICONS: { mobile: 8, desktop: 14 }
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function to limit function execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeHTML = (str) => {
    if (!str) return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} el - Element to check
 * @param {number} offset - Offset from viewport edges
 * @returns {boolean} True if element is in viewport
 */
export const isInViewport = (el, offset = 0) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    return (
        rect.top >= -offset &&
        rect.left >= -offset &&
        rect.bottom <= windowHeight + offset &&
        rect.right <= windowWidth + offset
    );
};

/**
 * Get element offset from document top
 * @param {HTMLElement} element - Element to measure
 * @returns {number} Offset from document top
 */
export const getElementOffset = (element) => {
    if (!element) return 0;
    let offsetTop = 0;
    while (element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent;
    }
    return offsetTop;
};

/**
 * Smooth scroll to element or position
 * @param {HTMLElement|number} target - Element or Y position
 * @param {number} offset - Offset from target position
 * @param {number} duration - Animation duration in milliseconds
 */
export const smoothScrollTo = (target, offset = 0, duration = 800) => {
    const targetPosition = typeof target === 'number'
        ? target
        : getElementOffset(target) + offset;

    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
};

/**
 * Get device type based on screen size
 * @returns {string} Device type: 'mobile', 'tablet', or 'desktop'
 */
export const getDeviceType = () => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
export const prefersReducedMotion = () => {
    return window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Generate random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export const randomBetween = (min, max) => {
    return Math.random() * (max - min) + min;
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'en-US') => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            const success = document.execCommand('copy');
            textArea.remove();
            return success;
        }
    } catch (error) {
        console.error('Failed to copy text to clipboard:', error);
        return false;
    }
};

/**
 * Create DOM element with attributes and classes
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string|Array} classes - CSS classes
 * @param {string} content - Text content
 * @returns {HTMLElement} Created element
 */
export const createElement = (tag, attributes = {}, classes = [], content = '') => {
    const element = document.createElement(tag);

    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });

    // Add classes
    const classArray = Array.isArray(classes) ? classes : [classes];
    classArray.filter(Boolean).forEach(className => {
        element.classList.add(className);
    });

    // Set content
    if (content) {
        element.textContent = content;
    }

    return element;
};

/**
 * Wait for specified time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after delay
 */
export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Load script dynamically
 * @param {string} src - Script source URL
 * @param {boolean} async - Load asynchronously
 * @returns {Promise<Event>} Promise that resolves when script loads
 */
export const loadScript = (src, async = true) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = async;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

/**
 * Load CSS file dynamically
 * @param {string} href - CSS file URL
 * @returns {Promise<Event>} Promise that resolves when CSS loads
 */
export const loadCSS = (href) => {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
    });
};

/**
 * Get current year
 * @returns {number} Current year
 */
export const getCurrentYear = () => {
    return new Date().getFullYear();
};

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if string is empty or contains only whitespace
 * @param {string} str - String to check
 * @returns {boolean} True if string is empty
 */
export const isEmpty = (str) => {
    return !str || str.trim().length === 0;
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert string to kebab-case
 * @param {string} str - String to convert
 * @returns {string} Kebab-case string
 */
export const toKebabCase = (str) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
};

// Export all utilities as a single object for backward compatibility
export default {
    PERFORMANCE_CONFIG,
    debounce,
    throttle,
    sanitizeHTML,
    isValidEmail,
    isInViewport,
    getElementOffset,
    smoothScrollTo,
    getDeviceType,
    prefersReducedMotion,
    randomBetween,
    formatDate,
    copyToClipboard,
    createElement,
    delay,
    loadScript,
    loadCSS,
    getCurrentYear,
    formatFileSize,
    isEmpty,
    capitalize,
    toKebabCase
};