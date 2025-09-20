/**
 * Asset Compression and Optimization Utilities
 * Client-side optimization techniques for better performance
 * 
 * @version 1.0.0
 * @author Chinmoy Kumar Biswas
 */

class AssetOptimizer {
    constructor() {
        this.compressionSupported = this.checkCompressionSupport();
        this.webpSupported = null;
        this.modernFormatsSupported = {};

        this.init();
    }

    /**
     * Initialize asset optimization
     */
    async init() {
        // Check format support
        await this.checkFormatSupport();

        // Optimize images on load
        this.optimizeImages();

        // Setup lazy loading
        this.setupLazyLoading();

        // Optimize fonts
        this.optimizeFonts();

        // Setup resource hints
        this.setupResourceHints();

        // Monitor and optimize assets
        this.startAssetMonitoring();
    }

    /**
     * Check compression support
     */
    checkCompressionSupport() {
        // Check if browser supports modern compression
        return {
            brotli: 'CompressionStream' in window && 'DecompressionStream' in window,
            gzip: 'CompressionStream' in window,
            deflate: 'CompressionStream' in window
        };
    }

    /**
     * Check modern format support
     */
    async checkFormatSupport() {
        // Check WebP support
        this.webpSupported = await this.supportsWebP();

        // Check AVIF support
        this.modernFormatsSupported.avif = await this.supportsFormat('avif');

        // Check WebM support for video
        this.modernFormatsSupported.webm = await this.supportsFormat('webm');

        console.log('Format support:', {
            webp: this.webpSupported,
            avif: this.modernFormatsSupported.avif,
            webm: this.modernFormatsSupported.webm
        });
    }

    /**
     * Check WebP support
     */
    async supportsWebP() {
        return new Promise(resolve => {
            const webp = new Image();
            webp.onload = webp.onerror = () => {
                resolve(webp.height === 2);
            };
            webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    /**
     * Check format support generically
     */
    async supportsFormat(format) {
        return new Promise(resolve => {
            const video = document.createElement('video');
            const canPlay = video.canPlayType(`video/${format}`);
            resolve(canPlay !== '');
        });
    }

    /**
     * Optimize all images on the page
     */
    optimizeImages() {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            this.optimizeImage(img);
        });

        // Setup mutation observer for dynamically added images
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'IMG') {
                        this.optimizeImage(node);
                    } else if (node.querySelectorAll) {
                        const newImages = node.querySelectorAll('img');
                        newImages.forEach(img => this.optimizeImage(img));
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Optimize individual image
     */
    optimizeImage(img) {
        const originalSrc = img.src || img.dataset.src;
        if (!originalSrc) return;

        // Try to serve modern formats
        const optimizedSrc = this.getOptimizedImageSrc(originalSrc);

        if (optimizedSrc !== originalSrc) {
            // Test if optimized version exists
            this.testImageExists(optimizedSrc).then(exists => {
                if (exists) {
                    if (img.dataset.src) {
                        img.dataset.src = optimizedSrc;
                    } else {
                        img.src = optimizedSrc;
                    }
                }
            });
        }

        // Add loading optimization
        if (!img.loading) {
            img.loading = 'lazy';
        }

        // Add decode hint for better performance
        if (!img.decoding) {
            img.decoding = 'async';
        }

        // Setup responsive images if not already done
        this.setupResponsiveImage(img);
    }

    /**
     * Get optimized image source based on format support
     */
    getOptimizedImageSrc(originalSrc) {
        const url = new URL(originalSrc, window.location.origin);
        const extension = url.pathname.split('.').pop().toLowerCase();

        // If it's already a modern format, return as is
        if (['webp', 'avif'].includes(extension)) {
            return originalSrc;
        }

        // Convert to modern format if supported
        if (this.modernFormatsSupported.avif && ['jpg', 'jpeg', 'png'].includes(extension)) {
            return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
        } else if (this.webpSupported && ['jpg', 'jpeg', 'png'].includes(extension)) {
            return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }

        return originalSrc;
    }

    /**
     * Test if image exists
     */
    async testImageExists(src) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
        });
    }

    /**
     * Setup responsive images with srcset
     */
    setupResponsiveImage(img) {
        if (img.srcset || img.dataset.processed) return;

        const src = img.src || img.dataset.src;
        if (!src) return;

        const sizes = [480, 768, 1024, 1280, 1920];
        const srcsetEntries = [];

        sizes.forEach(size => {
            const responsiveSrc = this.generateResponsiveImageSrc(src, size);
            srcsetEntries.push(`${responsiveSrc} ${size}w`);
        });

        if (srcsetEntries.length > 0) {
            img.srcset = srcsetEntries.join(', ');
            img.sizes = '(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw';
        }

        img.dataset.processed = 'true';
    }

    /**
     * Generate responsive image source
     */
    generateResponsiveImageSrc(originalSrc, width) {
        const url = new URL(originalSrc, window.location.origin);
        const pathParts = url.pathname.split('.');
        const extension = pathParts.pop();
        const basePath = pathParts.join('.');

        return `${basePath}-${width}w.${extension}`;
    }

    /**
     * Setup intersection observer for lazy loading
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }

                        // Add fade-in animation
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.3s ease';
                        img.onload = () => {
                            img.style.opacity = '1';
                        };

                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });

            // Store observer for later use
            this.imageObserver = imageObserver;
        }
    }

    /**
     * Optimize font loading
     */
    optimizeFonts() {
        // Use font-display: swap for better loading performance
        const fontFaces = document.styleSheets;

        // Add preload hints for critical fonts
        this.preloadCriticalFonts();

        // Setup font loading monitoring
        if ('fonts' in document) {
            document.fonts.ready.then(() => {
                console.log('All fonts loaded');
                // Mark performance metric
                if (window.performanceMonitor) {
                    window.performanceMonitor.mark('fonts-loaded');
                }
            });
        }
    }

    /**
     * Preload critical fonts
     */
    preloadCriticalFonts() {
        const criticalFonts = [
            '/assets/fonts/inter-regular.woff2',
            '/assets/fonts/inter-semibold.woff2'
        ];

        criticalFonts.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = fontUrl;
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    /**
     * Setup resource hints for better performance
     */
    setupResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' }
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            link.rel = hint.rel;
            link.href = hint.href;
            if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
            document.head.appendChild(link);
        });
    }

    /**
     * Start monitoring asset performance
     */
    startAssetMonitoring() {
        // Monitor resource timing
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    // Log slow loading assets
                    if (entry.duration > 1000) {
                        console.warn('Slow asset detected:', {
                            name: entry.name,
                            duration: entry.duration,
                            size: entry.transferSize
                        });
                    }
                });
            });

            try {
                observer.observe({ entryTypes: ['resource'] });
            } catch (e) {
                console.warn('Resource timing observer not supported');
            }
        }
    }

    /**
     * Compress text content (for storage/transmission)
     */
    async compressText(text) {
        if (!this.compressionSupported.gzip) {
            return text;
        }

        try {
            const stream = new CompressionStream('gzip');
            const writer = stream.writable.getWriter();
            const reader = stream.readable.getReader();

            writer.write(new TextEncoder().encode(text));
            writer.close();

            const chunks = [];
            let result = await reader.read();

            while (!result.done) {
                chunks.push(result.value);
                result = await reader.read();
            }

            return new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []));
        } catch (error) {
            console.warn('Compression failed:', error);
            return text;
        }
    }

    /**
     * Decompress text content
     */
    async decompressText(compressedData) {
        if (!this.compressionSupported.gzip) {
            return compressedData;
        }

        try {
            const stream = new DecompressionStream('gzip');
            const writer = stream.writable.getWriter();
            const reader = stream.readable.getReader();

            writer.write(compressedData);
            writer.close();

            const chunks = [];
            let result = await reader.read();

            while (!result.done) {
                chunks.push(result.value);
                result = await reader.read();
            }

            const decompressed = new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []));
            return new TextDecoder().decode(decompressed);
        } catch (error) {
            console.warn('Decompression failed:', error);
            return compressedData;
        }
    }

    /**
     * Get optimization statistics
     */
    getStats() {
        const images = document.querySelectorAll('img');
        const optimizedImages = document.querySelectorAll('img[data-processed]');

        return {
            totalImages: images.length,
            optimizedImages: optimizedImages.length,
            webpSupported: this.webpSupported,
            avifSupported: this.modernFormatsSupported.avif,
            compressionSupported: this.compressionSupported
        };
    }

    /**
     * Clean up observers and resources
     */
    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
    }
}

// Critical resource preloader
class CriticalResourcePreloader {
    constructor() {
        this.preloadQueue = [];
        this.loadedResources = new Set();
    }

    /**
     * Preload critical resources immediately
     */
    preloadCritical() {
        const criticalResources = [
            { href: '/assets/css/critical.css', as: 'style' },
            { href: '/assets/js/app.js', as: 'script' },
            { href: '/assets/fonts/inter-regular.woff2', as: 'font', type: 'font/woff2' }
        ];

        criticalResources.forEach(resource => {
            this.preloadResource(resource);
        });
    }

    /**
     * Preload a single resource
     */
    preloadResource(resource) {
        if (this.loadedResources.has(resource.href)) {
            return;
        }

        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;

        if (resource.type) link.type = resource.type;
        if (resource.crossorigin) link.crossOrigin = resource.crossorigin;

        document.head.appendChild(link);
        this.loadedResources.add(resource.href);

        console.log('Preloaded:', resource.href);
    }

    /**
     * Queue resource for later preloading
     */
    queueResource(resource, priority = 'normal') {
        this.preloadQueue.push({ ...resource, priority });

        if (priority === 'high') {
            this.preloadResource(resource);
        }
    }

    /**
     * Process preload queue
     */
    processQueue() {
        // Sort by priority
        this.preloadQueue.sort((a, b) => {
            const priorities = { high: 3, normal: 2, low: 1 };
            return priorities[b.priority] - priorities[a.priority];
        });

        // Preload queued resources
        this.preloadQueue.forEach(resource => {
            this.preloadResource(resource);
        });

        this.preloadQueue = [];
    }
}

// Initialize optimization
const assetOptimizer = new AssetOptimizer();
const criticalPreloader = new CriticalResourcePreloader();

// Start critical resource preloading immediately
criticalPreloader.preloadCritical();

// Export for global access
window.AssetOptimizer = AssetOptimizer;
window.CriticalResourcePreloader = CriticalResourcePreloader;
window.assetOptimizer = assetOptimizer;
window.criticalPreloader = criticalPreloader;