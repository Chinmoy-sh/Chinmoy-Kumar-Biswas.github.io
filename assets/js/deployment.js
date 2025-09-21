/**
 * ===============================================
 * DEPLOYMENT CONFIGURATION SYSTEM
 * Professional Portfolio by Chinmoy Kumar Biswas
 * Version: 2.0.0
 * ===============================================
 */

class DeploymentManager {
    constructor(options = {}) {
        this.config = {
            environment: 'production',
            enableMinification: true,
            enableCompression: true,
            enableCaching: true,
            enableCDN: false,
            enableHTTPS: true,
            enableServiceWorker: true,
            enableAnalytics: true,
            enableErrorReporting: true,
            ...options
        };

        this.buildInfo = {
            version: '2.0.0',
            buildDate: new Date().toISOString(),
            buildNumber: Date.now(),
            gitCommit: null,
            environment: this.config.environment
        };

        this.init();
    }

    init() {
        this.detectEnvironment();
        this.setupErrorReporting();
        this.setupPerformanceOptimizations();
        this.setupCaching();
        this.setupServiceWorker();
        this.setupAnalytics();
        this.validateDeployment();

        console.log('🚀 Deployment management system initialized');
        console.log('📦 Build Info:', this.buildInfo);
    }

    detectEnvironment() {
        const hostname = window.location.hostname;

        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            this.config.environment = 'development';
        } else if (hostname.includes('github.io') || hostname.includes('netlify.app')) {
            this.config.environment = 'production';
        } else if (hostname.includes('staging') || hostname.includes('preview')) {
            this.config.environment = 'staging';
        }

        this.buildInfo.environment = this.config.environment;

        // Environment-specific configurations
        if (this.config.environment === 'development') {
            this.config.enableMinification = false;
            this.config.enableCompression = false;
            this.config.enableAnalytics = false;
        }
    }

    setupErrorReporting() {
        if (!this.config.enableErrorReporting) return;

        // Global error handler
        window.addEventListener('error', (event) => {
            this.reportError({
                type: 'javascript_error',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error ? event.error.stack : null,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                buildInfo: this.buildInfo
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.reportError({
                type: 'unhandled_promise_rejection',
                reason: event.reason,
                stack: event.reason ? event.reason.stack : null,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                buildInfo: this.buildInfo
            });
        });

        // Resource loading errors
        document.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.reportError({
                    type: 'resource_error',
                    element: event.target.tagName,
                    source: event.target.src || event.target.href,
                    message: 'Resource failed to load',
                    timestamp: Date.now(),
                    url: window.location.href,
                    buildInfo: this.buildInfo
                });
            }
        }, true);
    }

    reportError(errorData) {
        // In production, send to error reporting service
        if (this.config.environment === 'production') {
            console.error('🚨 Production Error:', errorData);

            // Example: Send to error reporting service
            // this.sendToErrorService(errorData);
        } else {
            console.error('🔧 Development Error:', errorData);
        }

        // Store locally for debugging
        this.storeErrorLocally(errorData);
    }

    storeErrorLocally(errorData) {
        try {
            const errors = JSON.parse(localStorage.getItem('deployment_errors') || '[]');
            errors.push(errorData);

            // Keep only last 50 errors
            if (errors.length > 50) {
                errors.shift();
            }

            localStorage.setItem('deployment_errors', JSON.stringify(errors));
        } catch (e) {
            console.error('Failed to store error locally:', e);
        }
    }

    setupPerformanceOptimizations() {
        // Lazy loading for images
        this.setupLazyLoading();

        // Resource hints
        this.addResourceHints();

        // Critical CSS loading
        this.optimizeCSSLoading();

        // JavaScript optimization
        this.optimizeJavaScript();
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    addResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
        ];

        hints.forEach(hint => {
            if (!document.querySelector(`link[href="${hint.href}"]`)) {
                const link = document.createElement('link');
                Object.assign(link, hint);
                document.head.appendChild(link);
            }
        });
    }

    optimizeCSSLoading() {
        // Inline critical CSS if not already done
        if (!document.querySelector('style[data-critical]')) {
            const criticalCSS = this.generateCriticalCSS();
            if (criticalCSS) {
                const style = document.createElement('style');
                style.setAttribute('data-critical', 'true');
                style.textContent = criticalCSS;
                document.head.insertBefore(style, document.head.firstChild);
            }
        }

        // Load non-critical CSS asynchronously
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-non-critical]');
        nonCriticalCSS.forEach(link => {
            link.rel = 'preload';
            link.as = 'style';
            link.onload = function () {
                this.rel = 'stylesheet';
            };
        });
    }

    generateCriticalCSS() {
        // This would typically be done during build time
        // For now, return basic critical styles
        return `
            /* Critical CSS for above-the-fold content */
            body { margin: 0; font-family: 'Inter', -apple-system, sans-serif; }
            .hero { min-height: 100vh; display: flex; align-items: center; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
            .navbar { position: fixed; top: 0; width: 100%; z-index: 1000; }
        `;
    }

    optimizeJavaScript() {
        // Defer non-critical JavaScript
        const scripts = document.querySelectorAll('script[data-non-critical]');
        scripts.forEach(script => {
            script.defer = true;
        });

        // Preload important JavaScript modules
        if (this.config.environment === 'production') {
            const moduleHints = [
                '/assets/js/main.js',
                '/assets/js/particles.js'
            ];

            moduleHints.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'modulepreload';
                link.href = href;
                document.head.appendChild(link);
            });
        }
    }

    setupCaching() {
        if (!this.config.enableCaching) return;

        // Set cache headers via meta tags (for static hosting)
        const cacheHeaders = [
            { name: 'Cache-Control', content: 'public, max-age=31536000' },
            { name: 'ETag', content: `"${this.buildInfo.buildNumber}"` }
        ];

        cacheHeaders.forEach(header => {
            const meta = document.createElement('meta');
            meta.httpEquiv = header.name;
            meta.content = header.content;
            document.head.appendChild(meta);
        });

        // Client-side cache management
        this.setupClientCaching();
    }

    setupClientCaching() {
        // Cache static resources in localStorage for faster loading
        const cacheableResources = [
            { url: '/data/portfolio-data.json', key: 'portfolio_data' }
        ];

        cacheableResources.forEach(resource => {
            this.cacheResource(resource.url, resource.key);
        });
    }

    async cacheResource(url, key) {
        try {
            const cached = localStorage.getItem(`cache_${key}`);
            const cacheTime = localStorage.getItem(`cache_time_${key}`);

            // Cache for 1 hour
            if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < 3600000) {
                return JSON.parse(cached);
            }

            const response = await fetch(url);
            const data = await response.text();

            localStorage.setItem(`cache_${key}`, data);
            localStorage.setItem(`cache_time_${key}`, Date.now().toString());

            return data;
        } catch (error) {
            console.warn('Failed to cache resource:', url, error);
        }
    }

    setupServiceWorker() {
        if (!this.config.enableServiceWorker || !('serviceWorker' in navigator)) return;

        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker registered successfully');

                // Handle service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateAvailable();
                        }
                    });
                });
            })
            .catch(error => {
                console.error('❌ Service Worker registration failed:', error);
                this.reportError({
                    type: 'service_worker_error',
                    message: 'Service Worker registration failed',
                    error: error.message,
                    buildInfo: this.buildInfo
                });
            });
    }

    showUpdateAvailable() {
        // Show update notification to user
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <p>🔄 A new version is available!</p>
                <button id="update-btn" class="btn btn-primary">Update Now</button>
                <button id="dismiss-btn" class="btn btn-secondary">Later</button>
            </div>
        `;

        document.body.appendChild(notification);

        document.getElementById('update-btn').addEventListener('click', () => {
            window.location.reload();
        });

        document.getElementById('dismiss-btn').addEventListener('click', () => {
            notification.remove();
        });
    }

    setupAnalytics() {
        if (!this.config.enableAnalytics || this.config.environment !== 'production') return;

        // Initialize analytics with build information
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('deployment_info', {
                version: this.buildInfo.version,
                buildDate: this.buildInfo.buildDate,
                environment: this.buildInfo.environment
            });
        }

        // Track deployment metrics
        this.trackDeploymentMetrics();
    }

    trackDeploymentMetrics() {
        // Track page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData && window.analyticsManager) {
                    window.analyticsManager.trackEvent('deployment_performance', {
                        loadTime: perfData.loadEventEnd - perfData.navigationStart,
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
                        buildVersion: this.buildInfo.version
                    });
                }
            }, 1000);
        });
    }

    validateDeployment() {
        const validations = [
            this.validateEnvironment(),
            this.validateSecurityHeaders(),
            this.validatePerformance(),
            this.validateAccessibility(),
            this.validateSEO()
        ];

        Promise.all(validations).then(results => {
            const issues = results.filter(result => !result.valid);

            if (issues.length === 0) {
                console.log('✅ Deployment validation passed');
            } else {
                console.warn('⚠️ Deployment validation issues found:', issues);
            }

            this.publishValidationReport({
                timestamp: Date.now(),
                buildInfo: this.buildInfo,
                validationResults: results
            });
        });
    }

    validateEnvironment() {
        return Promise.resolve({
            check: 'environment',
            valid: this.config.environment === 'production',
            details: { environment: this.config.environment }
        });
    }

    validateSecurityHeaders() {
        // Check for security headers (would be better done server-side)
        const securityChecks = [
            document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
            document.querySelector('meta[http-equiv="X-Content-Type-Options"]'),
            document.querySelector('meta[http-equiv="X-Frame-Options"]')
        ];

        return Promise.resolve({
            check: 'security_headers',
            valid: securityChecks.some(check => check !== null),
            details: { headersPresent: securityChecks.filter(Boolean).length }
        });
    }

    validatePerformance() {
        return new Promise(resolve => {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData ? perfData.loadEventEnd - perfData.navigationStart : 0;

                    resolve({
                        check: 'performance',
                        valid: loadTime < 3000, // Less than 3 seconds
                        details: { loadTime }
                    });
                }, 1000);
            });
        });
    }

    validateAccessibility() {
        const accessibilityChecks = [
            document.querySelector('html[lang]'),
            document.querySelectorAll('img[alt]').length > 0,
            document.querySelectorAll('a[href]').length > 0,
            document.querySelector('main, [role="main"]')
        ];

        return Promise.resolve({
            check: 'accessibility',
            valid: accessibilityChecks.filter(Boolean).length >= 3,
            details: { checksPass: accessibilityChecks.filter(Boolean).length }
        });
    }

    validateSEO() {
        const seoChecks = [
            document.querySelector('title'),
            document.querySelector('meta[name="description"]'),
            document.querySelector('meta[property="og:title"]'),
            document.querySelector('link[rel="canonical"]')
        ];

        return Promise.resolve({
            check: 'seo',
            valid: seoChecks.filter(Boolean).length >= 3,
            details: { checksPass: seoChecks.filter(Boolean).length }
        });
    }

    publishValidationReport(report) {
        // Store validation report
        localStorage.setItem('deployment_validation', JSON.stringify(report));

        // Send to monitoring service in production
        if (this.config.environment === 'production') {
            console.log('📊 Deployment Validation Report:', report);
        }
    }

    // Public API methods
    getBuildInfo() {
        return { ...this.buildInfo };
    }

    getDeploymentStatus() {
        return {
            environment: this.config.environment,
            version: this.buildInfo.version,
            buildDate: this.buildInfo.buildDate,
            features: {
                serviceWorker: this.config.enableServiceWorker && 'serviceWorker' in navigator,
                webVitals: 'PerformanceObserver' in window,
                intersectionObserver: 'IntersectionObserver' in window,
                webGL: !!document.createElement('canvas').getContext('webgl')
            }
        };
    }

    getErrorReport() {
        try {
            const errors = JSON.parse(localStorage.getItem('deployment_errors') || '[]');
            return {
                totalErrors: errors.length,
                recentErrors: errors.slice(-10),
                errorTypes: this.groupErrorsByType(errors)
            };
        } catch (e) {
            return { totalErrors: 0, recentErrors: [], errorTypes: {} };
        }
    }

    groupErrorsByType(errors) {
        return errors.reduce((acc, error) => {
            acc[error.type] = (acc[error.type] || 0) + 1;
            return acc;
        }, {});
    }

    clearErrorLog() {
        localStorage.removeItem('deployment_errors');
        console.log('🧹 Error log cleared');
    }
}

// CSS for deployment notifications
const deploymentStyles = `
    .update-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-secondary, #1a1a2e);
        border: 2px solid var(--primary-color, #00f5ff);
        border-radius: 12px;
        padding: 20px;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 245, 255, 0.2);
        animation: slideInRight 0.3s ease;
    }
    
    .update-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: center;
        text-align: center;
    }
    
    .update-content p {
        margin: 0;
        color: var(--text-primary, #ffffff);
        font-weight: 600;
    }
    
    .update-content .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        min-width: 80px;
    }
    
    .update-content .btn-primary {
        background: var(--primary-color, #00f5ff);
        color: var(--bg-primary, #0f0f23);
    }
    
    .update-content .btn-secondary {
        background: transparent;
        color: var(--text-secondary, #a0a0a0);
        border: 1px solid var(--text-secondary, #a0a0a0);
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        .update-notification {
            left: 20px;
            right: 20px;
            top: auto;
            bottom: 20px;
        }
        
        .update-content {
            flex-direction: row;
            justify-content: space-between;
        }
        
        .update-content .btn {
            flex: 1;
            margin: 0 5px;
        }
    }
`;

// Inject deployment styles
const deploymentStyleSheet = document.createElement('style');
deploymentStyleSheet.textContent = deploymentStyles;
document.head.appendChild(deploymentStyleSheet);

// Initialize deployment manager
document.addEventListener('DOMContentLoaded', () => {
    const deploymentManager = new DeploymentManager({
        environment: 'production',
        enableMinification: true,
        enableCompression: true,
        enableCaching: true,
        enableCDN: false,
        enableHTTPS: true,
        enableServiceWorker: true,
        enableAnalytics: true,
        enableErrorReporting: true
    });

    // Expose to global scope
    window.deploymentManager = deploymentManager;

    console.log('🚀 Deployment management system ready');
});

export default DeploymentManager;