/**
 * ===============================================
 * SECURITY & ANALYTICS INTEGRATION SYSTEM
 * Professional Portfolio by Chinmoy Kumar Biswas
 * Version: 2.0.0
 * ===============================================
 */

class SecurityManager {
    constructor(options = {}) {
        this.config = {
            enableCSP: true,
            enableXSSProtection: true,
            enableFormValidation: true,
            enableRateLimiting: true,
            enableSecurityHeaders: true,
            enableContentValidation: true,
            logSecurityEvents: true,
            ...options
        };

        this.securityLog = [];
        this.rateLimiters = new Map();
        this.trustedDomains = [
            'chinmoy-kumar-biswas.github.io',
            'localhost',
            'github.io',
            'fonts.googleapis.com',
            'fonts.gstatic.com'
        ];

        this.init();
    }

    init() {
        this.setupContentSecurityPolicy();
        this.setupXSSProtection();
        this.setupFormSecurity();
        this.setupRateLimiting();
        this.setupInputValidation();
        this.setupSecurityHeaders();
        this.monitorSecurity();

        console.log('🔒 Security management system initialized');
    }

    setupContentSecurityPolicy() {
        if (!this.config.enableCSP) return;

        // Add CSP meta tag if not present
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            const cspMeta = document.createElement('meta');
            cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
            cspMeta.setAttribute('content', this.generateCSPHeader());
            document.head.appendChild(cspMeta);
        }

        // Monitor CSP violations
        document.addEventListener('securitypolicyviolation', (event) => {
            this.logSecurityEvent('CSP Violation', {
                violatedDirective: event.violatedDirective,
                blockedURI: event.blockedURI,
                documentURI: event.documentURI,
                effectiveDirective: event.effectiveDirective
            });
        });
    }

    generateCSPHeader() {
        return [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self' https://api.github.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join('; ');
    }

    setupXSSProtection() {
        if (!this.config.enableXSSProtection) return;

        // Sanitize user input
        document.addEventListener('input', (event) => {
            if (event.target.type === 'text' || event.target.type === 'email' || event.target.tagName === 'TEXTAREA') {
                const sanitized = this.sanitizeInput(event.target.value);
                if (sanitized !== event.target.value) {
                    event.target.value = sanitized;
                    this.logSecurityEvent('XSS Attempt Blocked', {
                        element: event.target.tagName,
                        originalValue: event.target.value,
                        sanitizedValue: sanitized
                    });
                }
            }
        });

        // Validate dynamic content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.validateContent(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    sanitizeInput(input) {
        if (typeof input !== 'string') return input;

        // Remove potentially dangerous characters and patterns
        return input
            .replace(/[<>]/g, '') // Remove < and >
            .replace(/javascript:/gi, '') // Remove javascript: URLs
            .replace(/on\w+\s*=/gi, '') // Remove event handlers
            .replace(/data:/gi, '') // Remove data: URLs
            .replace(/vbscript:/gi, '') // Remove vbscript: URLs
            .trim();
    }

    setupFormSecurity() {
        if (!this.config.enableFormValidation) return;

        // Add CSRF token to forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            this.addCSRFToken(form);
            this.setupFormValidation(form);
        });
    }

    addCSRFToken(form) {
        if (!form.querySelector('input[name="csrf_token"]')) {
            const csrfToken = document.createElement('input');
            csrfToken.type = 'hidden';
            csrfToken.name = 'csrf_token';
            csrfToken.value = this.generateCSRFToken();
            form.appendChild(csrfToken);
        }
    }

    generateCSRFToken() {
        return btoa(Math.random().toString(36).substr(2, 9) + Date.now().toString(36));
    }

    setupFormValidation(form) {
        form.addEventListener('submit', (event) => {
            if (!this.validateForm(form)) {
                event.preventDefault();
                this.logSecurityEvent('Form Validation Failed', {
                    form: form.action || form.id
                });
            }
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateInput(input) {
        const value = input.value;
        const type = input.type;

        // Basic validation
        if (input.required && !value.trim()) {
            this.showValidationError(input, 'This field is required');
            return false;
        }

        // Type-specific validation
        switch (type) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    this.showValidationError(input, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'url':
                if (!this.isValidURL(value)) {
                    this.showValidationError(input, 'Please enter a valid URL');
                    return false;
                }
                break;
            case 'tel':
                if (!this.isValidPhone(value)) {
                    this.showValidationError(input, 'Please enter a valid phone number');
                    return false;
                }
                break;
        }

        // Check for potential security issues
        if (this.containsSuspiciousContent(value)) {
            this.showValidationError(input, 'Invalid content detected');
            return false;
        }

        this.clearValidationError(input);
        return true;
    }

    setupRateLimiting() {
        if (!this.config.enableRateLimiting) return;

        // Rate limit form submissions
        document.addEventListener('submit', (event) => {
            const form = event.target;
            if (!this.checkRateLimit('form_submit', 3, 60000)) { // 3 per minute
                event.preventDefault();
                this.showRateLimitError(form);
            }
        });

        // Rate limit AJAX requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            if (!this.checkRateLimit('api_request', 10, 60000)) { // 10 per minute
                throw new Error('Rate limit exceeded');
            }
            return originalFetch.apply(window, args);
        };
    }

    checkRateLimit(key, maxRequests, timeWindow) {
        const now = Date.now();

        if (!this.rateLimiters.has(key)) {
            this.rateLimiters.set(key, []);
        }

        const requests = this.rateLimiters.get(key);

        // Remove old requests
        while (requests.length > 0 && requests[0] < now - timeWindow) {
            requests.shift();
        }

        if (requests.length >= maxRequests) {
            this.logSecurityEvent('Rate Limit Exceeded', { key, requests: requests.length });
            return false;
        }

        requests.push(now);
        return true;
    }

    setupInputValidation() {
        if (!this.config.enableContentValidation) return;

        // Real-time input validation
        document.addEventListener('input', (event) => {
            const input = event.target;
            this.validateInput(input);
        });
    }

    monitorSecurity() {
        // Monitor for suspicious activity
        this.setupClickjackingProtection();
        this.setupMixedContentDetection();
        this.setupErrorMonitoring();
    }

    setupClickjackingProtection() {
        // Prevent clickjacking
        if (window.top !== window.self) {
            this.logSecurityEvent('Potential Clickjacking Attempt', {
                referrer: document.referrer,
                parentURL: window.top.location.href
            });

            // Optional: break out of frame
            // window.top.location = window.self.location;
        }
    }

    // Utility methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    containsSuspiciousContent(content) {
        const suspiciousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe/i,
            /<object/i,
            /<embed/i,
            /data:text\/html/i
        ];

        return suspiciousPatterns.some(pattern => pattern.test(content));
    }

    logSecurityEvent(event, details = {}) {
        const logEntry = {
            timestamp: Date.now(),
            event,
            details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.securityLog.push(logEntry);

        if (this.config.logSecurityEvents) {
            console.warn('🔒 Security Event:', event, details);
        }

        // Keep only last 100 entries
        if (this.securityLog.length > 100) {
            this.securityLog.shift();
        }
    }

    getSecurityReport() {
        return {
            timestamp: Date.now(),
            totalEvents: this.securityLog.length,
            recentEvents: this.securityLog.slice(-10),
            rateLimiters: Object.fromEntries(this.rateLimiters),
            cspViolations: this.securityLog.filter(entry => entry.event === 'CSP Violation').length,
            xssAttempts: this.securityLog.filter(entry => entry.event === 'XSS Attempt Blocked').length
        };
    }
}

class AnalyticsManager {
    constructor(options = {}) {
        this.config = {
            enablePageTracking: true,
            enableEventTracking: true,
            enablePerformanceTracking: true,
            enableErrorTracking: true,
            enableUserInteractionTracking: true,
            enableConversionTracking: true,
            enablePrivacyMode: true,
            ...options
        };

        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.events = [];
        this.pageViews = [];
        this.conversionGoals = [];

        this.init();
    }

    init() {
        this.setupPageTracking();
        this.setupEventTracking();
        this.setupPerformanceTracking();
        this.setupErrorTracking();
        this.setupUserInteractionTracking();
        this.setupConversionTracking();
        this.setupPrivacyControls();

        console.log('📊 Analytics management system initialized');
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getUserId() {
        let userId = localStorage.getItem('portfolio_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('portfolio_user_id', userId);
        }
        return userId;
    }

    setupPageTracking() {
        if (!this.config.enablePageTracking) return;

        this.trackPageView();

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('page_blur', { timestamp: Date.now() });
            } else {
                this.trackEvent('page_focus', { timestamp: Date.now() });
            }
        });

        // Track time on page
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - this.pageLoadTime;
            this.trackEvent('page_exit', { timeOnPage });
        });

        this.pageLoadTime = Date.now();
    }

    trackPageView() {
        const pageView = {
            timestamp: Date.now(),
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            sessionId: this.sessionId,
            userId: this.userId,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            screen: {
                width: screen.width,
                height: screen.height
            }
        };

        this.pageViews.push(pageView);
        this.sendAnalytics('pageview', pageView);
    }

    setupEventTracking() {
        if (!this.config.enableEventTracking) return;

        // Track navigation clicks
        document.addEventListener('click', (event) => {
            const target = event.target;
            const link = target.closest('a');

            if (link) {
                this.trackEvent('navigation_click', {
                    href: link.href,
                    text: link.textContent.trim(),
                    section: this.getCurrentSection(link)
                });
            }

            // Track button clicks
            const button = target.closest('button');
            if (button) {
                this.trackEvent('button_click', {
                    text: button.textContent.trim(),
                    type: button.type,
                    id: button.id,
                    className: button.className
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (event) => {
            const form = event.target;
            this.trackEvent('form_submit', {
                action: form.action,
                method: form.method,
                id: form.id,
                fieldsCount: form.querySelectorAll('input, textarea, select').length
            });
        });

        // Track scroll depth
        this.setupScrollTracking();
    }

    setupScrollTracking() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 100];
        const tracked = new Set();

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
            }

            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !tracked.has(milestone)) {
                    tracked.add(milestone);
                    this.trackEvent('scroll_milestone', { milestone });
                }
            });
        });
    }

    setupPerformanceTracking() {
        if (!this.config.enablePerformanceTracking) return;

        // Track Core Web Vitals
        this.trackCoreWebVitals();

        // Track resource loading
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.trackPerformanceMetrics();
            }, 1000);
        });
    }

    trackCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.trackEvent('core_web_vital', {
                    metric: 'LCP',
                    value: lastEntry.startTime
                });
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // Cumulative Layout Shift (CLS)
            new PerformanceObserver((list) => {
                let clsValue = 0;
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.trackEvent('core_web_vital', {
                    metric: 'CLS',
                    value: clsValue
                });
            }).observe({ entryTypes: ['layout-shift'] });

            // First Input Delay (FID)
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.trackEvent('core_web_vital', {
                        metric: 'FID',
                        value: entry.processingStart - entry.startTime
                    });
                }
            }).observe({ entryTypes: ['first-input'] });
        }
    }

    trackPerformanceMetrics() {
        if ('performance' in window && 'getEntriesByType' in performance) {
            const navigation = performance.getEntriesByType('navigation')[0];

            if (navigation) {
                this.trackEvent('performance_metrics', {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
                    loadComplete: navigation.loadEventEnd - navigation.navigationStart,
                    ttfb: navigation.responseStart - navigation.navigationStart,
                    domInteractive: navigation.domInteractive - navigation.navigationStart
                });
            }
        }
    }

    setupErrorTracking() {
        if (!this.config.enableErrorTracking) return;

        // Track JavaScript errors
        window.addEventListener('error', (event) => {
            this.trackEvent('javascript_error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error ? event.error.stack : null
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.trackEvent('unhandled_promise_rejection', {
                reason: event.reason,
                stack: event.reason ? event.reason.stack : null
            });
        });

        // Track resource loading errors
        document.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.trackEvent('resource_error', {
                    element: event.target.tagName,
                    source: event.target.src || event.target.href,
                    message: 'Resource failed to load'
                });
            }
        }, true);
    }

    setupUserInteractionTracking() {
        if (!this.config.enableUserInteractionTracking) return;

        // Track theme changes
        document.addEventListener('theme-changed', (event) => {
            this.trackEvent('theme_change', {
                theme: event.detail.theme
            });
        });

        // Track mobile menu interactions
        document.addEventListener('mobile-menu-toggle', (event) => {
            this.trackEvent('mobile_menu', {
                action: event.detail.action
            });
        });

        // Track contact form interactions
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('input', (event) => {
                this.trackEvent('form_interaction', {
                    field: event.target.name,
                    type: event.target.type
                });
            });
        }
    }

    setupConversionTracking() {
        if (!this.config.enableConversionTracking) return;

        // Define conversion goals
        this.conversionGoals = [
            { id: 'contact_form_submit', selector: '#contact-form', event: 'submit' },
            { id: 'portfolio_download', selector: '[data-action="download-portfolio"]', event: 'click' },
            { id: 'social_link_click', selector: '.social-links a', event: 'click' },
            { id: 'project_view', selector: '.project-card', event: 'click' }
        ];

        this.conversionGoals.forEach(goal => {
            const elements = document.querySelectorAll(goal.selector);
            elements.forEach(element => {
                element.addEventListener(goal.event, () => {
                    this.trackConversion(goal.id, {
                        element: element.tagName,
                        text: element.textContent.trim(),
                        href: element.href
                    });
                });
            });
        });
    }

    trackConversion(goalId, data = {}) {
        this.trackEvent('conversion', {
            goalId,
            ...data
        });

        console.log('🎯 Conversion tracked:', goalId);
    }

    setupPrivacyControls() {
        if (!this.config.enablePrivacyMode) return;

        // Check for Do Not Track
        if (navigator.doNotTrack === '1') {
            this.config.enablePageTracking = false;
            this.config.enableEventTracking = false;
            console.log('📊 Tracking disabled due to Do Not Track preference');
        }

        // Respect user privacy preferences
        const privacyPreference = localStorage.getItem('privacy_preference');
        if (privacyPreference === 'minimal') {
            this.config.enableEventTracking = false;
            this.config.enableUserInteractionTracking = false;
        }
    }

    trackEvent(eventName, data = {}) {
        if (!this.config.enableEventTracking) return;

        const event = {
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            event: eventName,
            data,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.events.push(event);
        this.sendAnalytics('event', event);

        // Keep only last 1000 events in memory
        if (this.events.length > 1000) {
            this.events.shift();
        }
    }

    sendAnalytics(type, data) {
        // In a real implementation, you would send this to your analytics service
        console.log('📊 Analytics:', type, data);

        // Example: Send to Google Analytics
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', data.event, data.data);
        // }
    }

    getCurrentSection(element) {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = 'unknown';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });

        return currentSection;
    }

    getAnalyticsReport() {
        return {
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            pageViews: this.pageViews.length,
            events: this.events.length,
            conversionGoals: this.conversionGoals.length,
            recentEvents: this.events.slice(-10),
            topEvents: this.getTopEvents(),
            sessionDuration: Date.now() - this.pageLoadTime
        };
    }

    getTopEvents() {
        const eventCounts = {};
        this.events.forEach(event => {
            eventCounts[event.event] = (eventCounts[event.event] || 0) + 1;
        });

        return Object.entries(eventCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);
    }
}

// Initialize security and analytics
document.addEventListener('DOMContentLoaded', () => {
    const securityManager = new SecurityManager({
        enableCSP: true,
        enableXSSProtection: true,
        enableFormValidation: true,
        enableRateLimiting: true,
        enableSecurityHeaders: true,
        enableContentValidation: true,
        logSecurityEvents: true
    });

    const analyticsManager = new AnalyticsManager({
        enablePageTracking: true,
        enableEventTracking: true,
        enablePerformanceTracking: true,
        enableErrorTracking: true,
        enableUserInteractionTracking: true,
        enableConversionTracking: true,
        enablePrivacyMode: true
    });

    // Expose to global scope
    window.securityManager = securityManager;
    window.analyticsManager = analyticsManager;

    console.log('🔒📊 Security & Analytics systems ready');
});

export { SecurityManager, AnalyticsManager };