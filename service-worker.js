/*
===============================================
SERVICE WORKER - PWA FEATURES
Professional Portfolio by Chinmoy Kumar Biswas
Version: 2.0.0
===============================================
*/

const CACHE_NAME = 'chinmoy-portfolio-v2.0.0';
const STATIC_CACHE = 'static-v2.0.0';
const DYNAMIC_CACHE = 'dynamic-v2.0.0';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    './assets/css/reset.css',
    './assets/css/variables.css',
    './assets/css/base.css',
    './assets/css/components.css',
    './assets/css/layout.css',
    './assets/css/animations.css',
    './assets/js/main.js',
    './assets/js/data-loader.js',
    './assets/js/performance.js',
    './assets/data/content.json',
    './images/chinmoy.png',
    './images/pro3.jpg'
];

const CACHE_URLS = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com'
];

// Install Event
self.addEventListener('install', (event) => {
    console.log(' Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log(' Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error(' Service Worker: Failed to cache static assets', error);
            })
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    console.log(' Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log(' Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Handle different types of requests
    if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
        // Static assets - Cache First strategy
        event.respondWith(cacheFirst(request));
    } else if (url.origin === location.origin) {
        // Same origin - Network First strategy
        event.respondWith(networkFirst(request));
    } else {
        // External resources - Stale While Revalidate
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Caching Strategies
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        return cachedResponse || fetch(request);
    } catch (error) {
        console.error('Cache First failed:', error);
        return fetch(request);
    }
}

async function networkFirst(request) {
    const dynamicCache = await caches.open(DYNAMIC_CACHE);
    
    try {
        const networkResponse = await fetch(request);
        dynamicCache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);
        return cachedResponse || new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await caches.match(request);
    
    const networkPromise = fetch(request)
        .then(response => {
            cache.put(request, response.clone());
            return response;
        })
        .catch(() => cachedResponse);
    
    return cachedResponse || networkPromise;
}

// Background Sync (if supported)
if ('sync' in self.registration) {
    self.addEventListener('sync', (event) => {
        if (event.tag === 'background-sync') {
            console.log('Background sync triggered');
            event.waitUntil(handleBackgroundSync());
        }
    });
}

async function handleBackgroundSync() {
    try {
        // Handle any pending background tasks
        console.log('Handling background sync tasks');
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notifications (basic setup)
self.addEventListener('push', (event) => {
    if (event.data) {
        const options = {
            body: event.data.text(),
            icon: './images/chinmoy.png',
            badge: './images/chinmoy.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };
        
        event.waitUntil(
            self.registration.showNotification('Portfolio Update', options)
        );
    }
});

// Message handling
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
