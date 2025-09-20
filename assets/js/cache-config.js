/**
 * Advanced Caching and Asset Management Configuration
 * Comprehensive caching strategies for optimal performance
 * 
 * @version 1.0.0
 * @author Chinmoy Kumar Biswas
 */

// Cache configuration constants
const CACHE_CONFIG = {
    // Cache names with versioning
    STATIC_CACHE: 'portfolio-static-v2.0.0',
    DYNAMIC_CACHE: 'portfolio-dynamic-v2.0.0',
    API_CACHE: 'portfolio-api-v2.0.0',
    IMAGE_CACHE: 'portfolio-images-v2.0.0',
    FONT_CACHE: 'portfolio-fonts-v2.0.0',
    CDN_CACHE: 'portfolio-cdn-v2.0.0',

    // Cache expiration times (in milliseconds)
    STATIC_CACHE_TTL: 7 * 24 * 60 * 60 * 1000, // 7 days
    DYNAMIC_CACHE_TTL: 24 * 60 * 60 * 1000,     // 1 day
    API_CACHE_TTL: 5 * 60 * 1000,               // 5 minutes
    IMAGE_CACHE_TTL: 30 * 24 * 60 * 60 * 1000,  // 30 days
    FONT_CACHE_TTL: 365 * 24 * 60 * 60 * 1000,  // 1 year

    // Maximum cache sizes (in items)
    MAX_STATIC_ITEMS: 50,
    MAX_DYNAMIC_ITEMS: 30,
    MAX_API_ITEMS: 20,
    MAX_IMAGE_ITEMS: 100,
    MAX_FONT_ITEMS: 10,
    MAX_CDN_ITEMS: 25
};

// Asset categorization patterns
const ASSET_PATTERNS = {
    STATIC_ASSETS: [
        /\/$/,                          // Root document
        /\.html$/,                      // HTML files
        /\.css$/,                       // Stylesheets
        /\.js$/,                        // JavaScript files
        /\/manifest\.json$/,            // App manifest
        /\/favicon\.(ico|svg|png)$/,    // Favicons
        /\/sw\.js$/                     // Service worker
    ],

    IMAGES: [
        /\.(jpg|jpeg|png|gif|webp|svg)$/i,
        /\/images\//,
        /\/assets\/.*\.(jpg|jpeg|png|gif|webp|svg)$/i
    ],

    FONTS: [
        /\.(woff|woff2|ttf|otf|eot)$/i,
        /\/fonts\//,
        /\/assets\/fonts\//
    ],

    API_ENDPOINTS: [
        /\/api\//,
        /\.json$/
    ],

    CDN_RESOURCES: [
        /^https:\/\/cdn\./,
        /^https:\/\/cdnjs\.cloudflare\.com\//,
        /^https:\/\/fonts\.googleapis\.com\//,
        /^https:\/\/fonts\.gstatic\.com\//,
        /^https:\/\/unpkg\.com\//,
        /^https:\/\/threejs\.org\//
    ]
};

// Advanced caching strategies
class CacheStrategy {
    /**
     * Cache-first strategy with TTL
     * Best for: Static assets, images, fonts
     */
    static async cacheFirst(request, cacheName, ttl = null) {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            // Check if cached response is still valid
            if (ttl && CacheStrategy.isExpired(cachedResponse, ttl)) {
                cache.delete(request);
            } else {
                return cachedResponse;
            }
        }

        try {
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
                // Add timestamp header for TTL checking
                const responseToCache = networkResponse.clone();
                if (ttl) {
                    const headers = new Headers(responseToCache.headers);
                    headers.set('sw-cached-at', Date.now().toString());
                    const cachedResponse = new Response(responseToCache.body, {
                        status: responseToCache.status,
                        statusText: responseToCache.statusText,
                        headers: headers
                    });
                    cache.put(request, cachedResponse);
                } else {
                    cache.put(request, responseToCache);
                }
            }
            return networkResponse;
        } catch (error) {
            return cachedResponse || new Response('Offline', { status: 503 });
        }
    }

    /**
     * Network-first strategy with cache fallback
     * Best for: HTML documents, API responses
     */
    static async networkFirst(request, cacheName, ttl = null) {
        const cache = await caches.open(cacheName);

        try {
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
                const responseToCache = networkResponse.clone();
                if (ttl) {
                    const headers = new Headers(responseToCache.headers);
                    headers.set('sw-cached-at', Date.now().toString());
                    const cachedResponse = new Response(responseToCache.body, {
                        status: responseToCache.status,
                        statusText: responseToCache.statusText,
                        headers: headers
                    });
                    cache.put(request, cachedResponse);
                } else {
                    cache.put(request, responseToCache);
                }
            }
            return networkResponse;
        } catch (error) {
            const cachedResponse = await cache.match(request);
            if (cachedResponse && (!ttl || !CacheStrategy.isExpired(cachedResponse, ttl))) {
                return cachedResponse;
            }
            throw error;
        }
    }

    /**
     * Stale-while-revalidate strategy
     * Best for: CDN resources, third-party assets
     */
    static async staleWhileRevalidate(request, cacheName, ttl = null) {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);

        // Background fetch to update cache
        const networkResponsePromise = fetch(request).then(response => {
            if (response.ok) {
                const responseToCache = response.clone();
                if (ttl) {
                    const headers = new Headers(responseToCache.headers);
                    headers.set('sw-cached-at', Date.now().toString());
                    const cachedResponse = new Response(responseToCache.body, {
                        status: responseToCache.status,
                        statusText: responseToCache.statusText,
                        headers: headers
                    });
                    cache.put(request, cachedResponse);
                } else {
                    cache.put(request, responseToCache);
                }
            }
            return response;
        }).catch(() => null);

        // Return cached response immediately if available
        if (cachedResponse && (!ttl || !CacheStrategy.isExpired(cachedResponse, ttl))) {
            return cachedResponse;
        }

        // Otherwise wait for network
        return networkResponsePromise;
    }

    /**
     * Check if cached response is expired
     */
    static isExpired(response, ttl) {
        const cachedAt = response.headers.get('sw-cached-at');
        if (!cachedAt) return false;

        const cacheTime = parseInt(cachedAt, 10);
        const now = Date.now();
        return (now - cacheTime) > ttl;
    }

    /**
     * Get appropriate cache strategy for request
     */
    static getCacheStrategy(request) {
        const url = new URL(request.url);

        // Check patterns and return appropriate strategy
        if (CacheStrategy.matchesPatterns(url, ASSET_PATTERNS.STATIC_ASSETS)) {
            return {
                strategy: 'cacheFirst',
                cacheName: CACHE_CONFIG.STATIC_CACHE,
                ttl: CACHE_CONFIG.STATIC_CACHE_TTL
            };
        }

        if (CacheStrategy.matchesPatterns(url, ASSET_PATTERNS.IMAGES)) {
            return {
                strategy: 'cacheFirst',
                cacheName: CACHE_CONFIG.IMAGE_CACHE,
                ttl: CACHE_CONFIG.IMAGE_CACHE_TTL
            };
        }

        if (CacheStrategy.matchesPatterns(url, ASSET_PATTERNS.FONTS)) {
            return {
                strategy: 'cacheFirst',
                cacheName: CACHE_CONFIG.FONT_CACHE,
                ttl: CACHE_CONFIG.FONT_CACHE_TTL
            };
        }

        if (CacheStrategy.matchesPatterns(url, ASSET_PATTERNS.API_ENDPOINTS)) {
            return {
                strategy: 'networkFirst',
                cacheName: CACHE_CONFIG.API_CACHE,
                ttl: CACHE_CONFIG.API_CACHE_TTL
            };
        }

        if (CacheStrategy.matchesPatterns(url, ASSET_PATTERNS.CDN_RESOURCES)) {
            return {
                strategy: 'staleWhileRevalidate',
                cacheName: CACHE_CONFIG.CDN_CACHE,
                ttl: null // CDN resources don't need TTL
            };
        }

        // Default to dynamic cache
        return {
            strategy: 'networkFirst',
            cacheName: CACHE_CONFIG.DYNAMIC_CACHE,
            ttl: CACHE_CONFIG.DYNAMIC_CACHE_TTL
        };
    }

    /**
     * Check if URL matches any of the given patterns
     */
    static matchesPatterns(url, patterns) {
        return patterns.some(pattern => {
            if (pattern instanceof RegExp) {
                return pattern.test(url.pathname) || pattern.test(url.href);
            }
            return url.pathname.includes(pattern) || url.href.includes(pattern);
        });
    }
}

// Cache management utilities
class CacheManager {
    /**
     * Initialize cache management
     */
    static async init() {
        // Clean up expired caches
        await CacheManager.cleanupExpiredCaches();

        // Set up periodic cleanup
        setInterval(() => {
            CacheManager.cleanupExpiredCaches();
        }, 60 * 60 * 1000); // Every hour
    }

    /**
     * Clean up expired caches
     */
    static async cleanupExpiredCaches() {
        const cacheNames = await caches.keys();

        for (const cacheName of cacheNames) {
            if (cacheName.startsWith('portfolio-')) {
                const cache = await caches.open(cacheName);
                const requests = await cache.keys();

                for (const request of requests) {
                    const response = await cache.match(request);
                    const config = CacheStrategy.getCacheStrategy(request);

                    if (config.ttl && CacheStrategy.isExpired(response, config.ttl)) {
                        await cache.delete(request);
                        console.log('Deleted expired cache entry:', request.url);
                    }
                }
            }
        }
    }

    /**
     * Get cache statistics
     */
    static async getStats() {
        const cacheNames = await caches.keys();
        const stats = {};

        for (const cacheName of cacheNames) {
            if (cacheName.startsWith('portfolio-')) {
                const cache = await caches.open(cacheName);
                const requests = await cache.keys();
                stats[cacheName] = {
                    count: requests.length,
                    requests: requests.map(req => req.url)
                };
            }
        }

        return stats;
    }

    /**
     * Clear all caches
     */
    static async clearAll() {
        const cacheNames = await caches.keys();

        for (const cacheName of cacheNames) {
            if (cacheName.startsWith('portfolio-')) {
                await caches.delete(cacheName);
                console.log('Cleared cache:', cacheName);
            }
        }
    }

    /**
     * Preload critical resources
     */
    static async preloadCritical() {
        const criticalResources = [
            '/',
            '/assets/css/critical.css',
            '/assets/js/app.js',
            '/assets/js/performance.js',
            '/manifest.json',
            '/favicon.svg'
        ];

        const cache = await caches.open(CACHE_CONFIG.STATIC_CACHE);

        try {
            await cache.addAll(criticalResources);
            console.log('Critical resources preloaded');
        } catch (error) {
            console.warn('Failed to preload some critical resources:', error);
        }
    }
}

// Export for use in service worker
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CACHE_CONFIG,
        ASSET_PATTERNS,
        CacheStrategy,
        CacheManager
    };
}

// Global exposure for debugging
if (typeof window !== 'undefined') {
    window.CACHE_CONFIG = CACHE_CONFIG;
    window.CacheStrategy = CacheStrategy;
    window.CacheManager = CacheManager;
}