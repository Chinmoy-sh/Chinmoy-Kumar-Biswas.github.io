/**
 * ===============================================
 * PERFORMANCE MONITORING & SEO OPTIMIZATION
 * Professional Portfolio by Chinmoy Kumar Biswas
 * Version: 2.0.0
 * ===============================================
 */

class PerformanceMonitor {
    constructor(options = {}) {
        this.config = {
            enablePerformanceAPI: true,
            enableWebVitals: true,
            enableResourceTiming: true,
            enableLongTaskTiming: true,
            reportingEndpoint: null,
            reportingThreshold: 1000, // ms
            enableConsoleLogging: true,
            enableLocalStorage: true,
            ...options
        };

        this.metrics = {
            navigation: {},
            resources: [],
            vitals: {},
            customMetrics: {},
            errors: []
        };

        this.observers = [];

        this.init();
    }

    init() {
        if (!this.isSupported()) {
            console.warn('Performance API not fully supported');
            return;
        }

        this.measureNavigationTiming();
        this.measureResourceTiming();
        this.measureWebVitals();
        this.setupLongTaskObserver();
        this.setupLayoutShiftObserver();
        this.setupErrorTracking();
        this.scheduleReporting();

        console.log('📊 Performance monitoring initialized');
    }

    isSupported() {
        return 'performance' in window &&
            'getEntriesByType' in performance;
    }

    measureNavigationTiming() {
        if (!this.config.enablePerformanceAPI) return;

        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];

            if (navigation) {
                this.metrics.navigation = {
                    dnsLookup: this.roundMetric(navigation.domainLookupEnd - navigation.domainLookupStart),
                    tcpConnect: this.roundMetric(navigation.connectEnd - navigation.connectStart),
                    tlsHandshake: navigation.secureConnectionStart > 0 ?
                        this.roundMetric(navigation.connectEnd - navigation.secureConnectionStart) : 0,
                    serverResponse: this.roundMetric(navigation.responseStart - navigation.requestStart),
                    documentDownload: this.roundMetric(navigation.responseEnd - navigation.responseStart),
                    domProcessing: this.roundMetric(navigation.domComplete - navigation.domLoading),
                    domContentLoaded: this.roundMetric(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
                    windowLoad: this.roundMetric(navigation.loadEventEnd - navigation.loadEventStart),
                    totalPageLoad: this.roundMetric(navigation.loadEventEnd - navigation.navigationStart),
                    firstByte: this.roundMetric(navigation.responseStart - navigation.navigationStart),
                    domInteractive: this.roundMetric(navigation.domInteractive - navigation.navigationStart)
                };

                this.logMetric('Navigation Timing', this.metrics.navigation);

                // Check for performance issues
                this.analyzeNavigationPerformance();
            }
        });
    }

    measureResourceTiming() {
        if (!this.config.enableResourceTiming) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                const resources = performance.getEntriesByType('resource');

                this.metrics.resources = resources.map(resource => ({
                    name: resource.name.split('/').pop(),
                    type: this.getResourceType(resource),
                    size: resource.transferSize || resource.encodedBodySize,
                    duration: this.roundMetric(resource.duration),
                    startTime: this.roundMetric(resource.startTime),
                    blocking: resource.renderBlockingStatus || 'non-blocking'
                }));

                this.analyzeResourcePerformance();
                this.logMetric('Resource Timing', this.getResourceSummary());
            }, 1000);
        });
    }

    measureWebVitals() {
        if (!this.config.enableWebVitals) return;

        // First Contentful Paint (FCP)
        this.observeEntryTypes(['paint'], (entries) => {
            entries.forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.vitals.fcp = this.roundMetric(entry.startTime);
                    this.logMetric('First Contentful Paint', `${this.metrics.vitals.fcp}ms`);
                }
                if (entry.name === 'first-paint') {
                    this.metrics.vitals.fp = this.roundMetric(entry.startTime);
                    this.logMetric('First Paint', `${this.metrics.vitals.fp}ms`);
                }
            });
        });

        // Largest Contentful Paint (LCP)
        this.observeEntryTypes(['largest-contentful-paint'], (entries) => {
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
                this.metrics.vitals.lcp = this.roundMetric(lastEntry.startTime);
                this.logMetric('Largest Contentful Paint', `${this.metrics.vitals.lcp}ms`);
            }
        });

        // First Input Delay (FID)
        this.observeEntryTypes(['first-input'], (entries) => {
            entries.forEach(entry => {
                this.metrics.vitals.fid = this.roundMetric(entry.processingStart - entry.startTime);
                this.logMetric('First Input Delay', `${this.metrics.vitals.fid}ms`);
            });
        });

        // Time to Interactive (TTI) - Custom implementation
        this.measureTimeToInteractive();
    }

    measureTimeToInteractive() {
        let longTasksAfterFCP = 0;
        let lastLongTaskTime = 0;

        // Monitor long tasks after FCP
        const checkTTI = () => {
            if (this.metrics.vitals.fcp) {
                const currentTime = performance.now();
                const timeSinceLastLongTask = currentTime - lastLongTaskTime;

                if (timeSinceLastLongTask >= 5000 && longTasksAfterFCP === 0) {
                    this.metrics.vitals.tti = this.roundMetric(Math.max(this.metrics.vitals.fcp, lastLongTaskTime));
                    this.logMetric('Time to Interactive', `${this.metrics.vitals.tti}ms`);
                    return true;
                }
            }
            return false;
        };

        // Check periodically
        const ttiInterval = setInterval(() => {
            if (checkTTI()) {
                clearInterval(ttiInterval);
            }
        }, 100);

        // Fallback: assume TTI after 10 seconds if no long tasks
        setTimeout(() => {
            if (!this.metrics.vitals.tti) {
                this.metrics.vitals.tti = this.roundMetric(performance.now());
                this.logMetric('Time to Interactive (Estimated)', `${this.metrics.vitals.tti}ms`);
                clearInterval(ttiInterval);
            }
        }, 10000);
    }

    setupLongTaskObserver() {
        if (!this.config.enableLongTaskTiming) return;

        this.observeEntryTypes(['longtask'], (entries) => {
            entries.forEach(entry => {
                const longTask = {
                    duration: this.roundMetric(entry.duration),
                    startTime: this.roundMetric(entry.startTime),
                    attribution: entry.attribution || []
                };

                this.metrics.customMetrics.longTasks = this.metrics.customMetrics.longTasks || [];
                this.metrics.customMetrics.longTasks.push(longTask);

                if (entry.duration > 50) {
                    this.logMetric('Long Task Detected', `${longTask.duration}ms at ${longTask.startTime}ms`);
                }
            });
        });
    }

    setupLayoutShiftObserver() {
        let clsScore = 0;

        this.observeEntryTypes(['layout-shift'], (entries) => {
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsScore += entry.value;
                }
            });

            this.metrics.vitals.cls = this.roundMetric(clsScore, 4);

            if (clsScore > 0.1) {
                this.logMetric('Cumulative Layout Shift', `${this.metrics.vitals.cls} (needs improvement)`);
            }
        });
    }

    setupErrorTracking() {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            this.trackError({
                type: 'JavaScript Error',
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack,
                timestamp: Date.now()
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.trackError({
                type: 'Unhandled Promise Rejection',
                message: event.reason?.message || 'Unknown rejection',
                stack: event.reason?.stack,
                timestamp: Date.now()
            });
        });

        // Resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.trackError({
                    type: 'Resource Error',
                    element: event.target.tagName,
                    source: event.target.src || event.target.href,
                    timestamp: Date.now()
                });
            }
        }, true);
    }

    trackError(errorInfo) {
        this.metrics.errors.push(errorInfo);

        if (this.config.enableConsoleLogging) {
            console.error('Performance Monitor - Error tracked:', errorInfo);
        }

        // Report critical errors immediately
        if (this.config.reportingEndpoint) {
            this.reportError(errorInfo);
        }
    }

    observeEntryTypes(types, callback) {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    callback(list.getEntries());
                });

                observer.observe({ entryTypes: types });
                this.observers.push(observer);
            } catch (error) {
                console.warn('Failed to observe performance entries:', error);
            }
        }
    }

    analyzeNavigationPerformance() {
        const issues = [];
        const nav = this.metrics.navigation;

        if (nav.dnsLookup > 100) issues.push('Slow DNS lookup');
        if (nav.serverResponse > 500) issues.push('Slow server response');
        if (nav.totalPageLoad > 3000) issues.push('Slow page load');
        if (nav.domProcessing > 1000) issues.push('Heavy DOM processing');

        if (issues.length > 0) {
            this.logMetric('Performance Issues', issues);
        }
    }

    analyzeResourcePerformance() {
        const largeResources = this.metrics.resources.filter(r => r.size > 100000);
        const slowResources = this.metrics.resources.filter(r => r.duration > 1000);

        if (largeResources.length > 0) {
            this.logMetric('Large Resources (>100KB)', largeResources.map(r => `${r.name}: ${(r.size / 1024).toFixed(1)}KB`));
        }

        if (slowResources.length > 0) {
            this.logMetric('Slow Resources (>1s)', slowResources.map(r => `${r.name}: ${r.duration}ms`));
        }
    }

    getResourceSummary() {
        const summary = {
            totalResources: this.metrics.resources.length,
            totalSize: this.metrics.resources.reduce((sum, r) => sum + r.size, 0),
            totalDuration: this.metrics.resources.reduce((sum, r) => sum + r.duration, 0),
            byType: {}
        };

        this.metrics.resources.forEach(resource => {
            if (!summary.byType[resource.type]) {
                summary.byType[resource.type] = { count: 0, size: 0 };
            }
            summary.byType[resource.type].count++;
            summary.byType[resource.type].size += resource.size;
        });

        return summary;
    }

    getResourceType(resource) {
        const extension = resource.name.split('.').pop()?.toLowerCase();

        if (['js', 'mjs'].includes(extension)) return 'script';
        if (['css'].includes(extension)) return 'stylesheet';
        if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(extension)) return 'image';
        if (['woff', 'woff2', 'ttf', 'eot'].includes(extension)) return 'font';
        if (resource.name.includes('api') || extension === 'json') return 'api';

        return 'other';
    }

    scheduleReporting() {
        // Report metrics after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.generateReport();
            }, 2000);
        });

        // Report before page unload
        window.addEventListener('beforeunload', () => {
            this.generateReport(true);
        });
    }

    generateReport(isBeforeUnload = false) {
        const report = {
            url: window.location.href,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            connection: this.getConnectionInfo(),
            metrics: this.metrics,
            recommendations: this.getRecommendations(),
            grade: this.calculatePerformanceGrade()
        };

        if (this.config.enableConsoleLogging) {
            this.logReport(report);
        }

        if (this.config.enableLocalStorage) {
            this.saveToLocalStorage(report);
        }

        if (this.config.reportingEndpoint) {
            this.sendReport(report, isBeforeUnload);
        }

        return report;
    }

    getConnectionInfo() {
        if ('connection' in navigator) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            };
        }
        return null;
    }

    getRecommendations() {
        const recommendations = [];
        const nav = this.metrics.navigation;
        const vitals = this.metrics.vitals;

        if (nav.serverResponse > 500) {
            recommendations.push('Optimize server response time');
        }

        if (vitals.lcp > 2500) {
            recommendations.push('Improve Largest Contentful Paint');
        }

        if (vitals.fid > 100) {
            recommendations.push('Reduce First Input Delay');
        }

        if (vitals.cls > 0.1) {
            recommendations.push('Minimize Cumulative Layout Shift');
        }

        const largeResources = this.metrics.resources.filter(r => r.size > 100000);
        if (largeResources.length > 0) {
            recommendations.push('Optimize large resources');
        }

        return recommendations;
    }

    calculatePerformanceGrade() {
        let score = 100;
        const nav = this.metrics.navigation;
        const vitals = this.metrics.vitals;

        // Navigation timing penalties
        if (nav.totalPageLoad > 3000) score -= 20;
        else if (nav.totalPageLoad > 2000) score -= 10;

        // Web Vitals penalties
        if (vitals.lcp > 4000) score -= 20;
        else if (vitals.lcp > 2500) score -= 10;

        if (vitals.fid > 300) score -= 15;
        else if (vitals.fid > 100) score -= 8;

        if (vitals.cls > 0.25) score -= 15;
        else if (vitals.cls > 0.1) score -= 8;

        // Resource penalties
        const totalResourceSize = this.metrics.resources.reduce((sum, r) => sum + r.size, 0);
        if (totalResourceSize > 2000000) score -= 15; // >2MB
        else if (totalResourceSize > 1000000) score -= 8; // >1MB

        return Math.max(0, score);
    }

    logReport(report) {
        console.group('📊 Performance Report');
        console.log('Grade:', `${report.grade}/100`);
        console.log('Navigation Timing:', report.metrics.navigation);
        console.log('Web Vitals:', report.metrics.vitals);
        console.log('Resource Summary:', this.getResourceSummary());
        if (report.recommendations.length > 0) {
            console.log('Recommendations:', report.recommendations);
        }
        console.groupEnd();
    }

    saveToLocalStorage(report) {
        try {
            const reports = JSON.parse(localStorage.getItem('performance-reports') || '[]');
            reports.push(report);

            // Keep only last 10 reports
            if (reports.length > 10) {
                reports.splice(0, reports.length - 10);
            }

            localStorage.setItem('performance-reports', JSON.stringify(reports));
        } catch (error) {
            console.warn('Failed to save performance report to localStorage:', error);
        }
    }

    async sendReport(report, isBeforeUnload = false) {
        try {
            const method = isBeforeUnload ? 'sendBeacon' : 'fetch';

            if (method === 'sendBeacon' && 'sendBeacon' in navigator) {
                navigator.sendBeacon(this.config.reportingEndpoint, JSON.stringify(report));
            } else {
                await fetch(this.config.reportingEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(report)
                });
            }
        } catch (error) {
            console.warn('Failed to send performance report:', error);
        }
    }

    async reportError(errorInfo) {
        if (!this.config.reportingEndpoint) return;

        try {
            await fetch(`${this.config.reportingEndpoint}/errors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(errorInfo)
            });
        } catch (error) {
            console.warn('Failed to report error:', error);
        }
    }

    logMetric(name, value) {
        if (this.config.enableConsoleLogging) {
            console.log(`📊 ${name}:`, value);
        }
    }

    roundMetric(value, decimals = 2) {
        return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }

    // Public API methods
    getMetrics() {
        return this.metrics;
    }

    getGrade() {
        return this.calculatePerformanceGrade();
    }

    trackCustomMetric(name, value, unit = 'ms') {
        this.metrics.customMetrics[name] = { value, unit, timestamp: performance.now() };
        this.logMetric(`Custom Metric - ${name}`, `${value}${unit}`);
    }

    disconnect() {
        this.observers.forEach(observer => {
            try {
                observer.disconnect();
            } catch (error) {
                console.warn('Failed to disconnect performance observer:', error);
            }
        });
        this.observers = [];
    }
}

// SEO Optimization utilities
class SEOOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeMetaTags();
        this.addStructuredData();
        this.setupCanonicalUrls();
        this.optimizeImages();
        this.setupSocialMetaTags();

        console.log('🔍 SEO optimization applied');
    }

    optimizeMetaTags() {
        // Ensure viewport meta tag
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0';
            document.head.appendChild(viewport);
        }

        // Add robots meta tag if not present
        if (!document.querySelector('meta[name="robots"]')) {
            const robots = document.createElement('meta');
            robots.name = 'robots';
            robots.content = 'index, follow, max-image-preview:large';
            document.head.appendChild(robots);
        }
    }

    addStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Chinmoy Kumar Biswas",
            "jobTitle": "Full Stack Developer",
            "url": window.location.origin,
            "sameAs": [
                "https://github.com/Chinmoy-Kumar-Biswas",
                "https://linkedin.com/in/chinmoy-kumar-biswas"
            ],
            "knowsAbout": [
                "JavaScript", "React", "Node.js", "Python", "Web Development",
                "Full Stack Development", "Software Engineering"
            ],
            "description": "Passionate full-stack developer with expertise in modern web technologies"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    setupCanonicalUrls() {
        if (!document.querySelector('link[rel="canonical"]')) {
            const canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = window.location.origin + window.location.pathname;
            document.head.appendChild(canonical);
        }
    }

    optimizeImages() {
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            if (!img.alt) {
                img.alt = 'Portfolio image';
            }
        });
    }

    setupSocialMetaTags() {
        const socialTags = [
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: window.location.href },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:creator', content: '@chinmoybiswas' }
        ];

        socialTags.forEach(tag => {
            const existing = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`);
            if (!existing) {
                const meta = document.createElement('meta');
                if (tag.property) {
                    meta.setAttribute('property', tag.property);
                } else {
                    meta.setAttribute('name', tag.name);
                }
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }
}

// Initialize performance monitoring and SEO optimization
document.addEventListener('DOMContentLoaded', () => {
    const performanceMonitor = new PerformanceMonitor({
        enablePerformanceAPI: true,
        enableWebVitals: true,
        enableResourceTiming: true,
        enableLongTaskTiming: true,
        enableConsoleLogging: true,
        enableLocalStorage: true
    });

    const seoOptimizer = new SEOOptimizer();

    // Expose to global scope
    window.performanceMonitor = performanceMonitor;
    window.seoOptimizer = seoOptimizer;

    console.log('📊 Performance monitoring and SEO optimization ready');
});

// exports removed for non-module usage