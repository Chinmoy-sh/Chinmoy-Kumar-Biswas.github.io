/**
 * SERVICE WORKER REGISTRATION MODULE
 * Handles service worker registration and management
 * @module serviceWorker
 */

/**
 * Register service worker for caching and offline functionality
 */
export const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });

                console.log('Service Worker registered successfully:', registration);

                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New content is available, prompt user to refresh
                                showUpdateNotification();
                            }
                        });
                    }
                });

                // Check for updates every hour
                setInterval(() => {
                    registration.update();
                }, 60 * 60 * 1000);

            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        });
    } else {
        console.log('Service Worker not supported in this browser');
    }
};

/**
 * Show update notification to user
 */
const showUpdateNotification = () => {
    if (Notification.permission === 'granted') {
        new Notification('Portfolio Updated', {
            body: 'New content is available. Refresh to get the latest version.',
            icon: '/images/chinmoy.png',
            badge: '/images/chinmoy.png',
            tag: 'portfolio-update'
        });
    } else {
        // Fallback: show in-app notification
        showInAppNotification();
    }
};

/**
 * Show in-app update notification
 */
const showInAppNotification = () => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-indigo-600 text-white p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full';
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium">Update Available</p>
                <p class="text-xs opacity-90">Refresh for the latest version</p>
            </div>
            <button class="refresh-btn text-white hover:text-gray-200 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.classList.remove('translate-x-full');
    });

    // Add refresh functionality
    const refreshBtn = notification.querySelector('.refresh-btn');
    refreshBtn.addEventListener('click', () => {
        window.location.reload();
    });

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 10000);
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
        try {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }
    return Notification.permission === 'granted';
};

/**
 * Check if app is running as PWA
 */
export const isPWA = () => {
    return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
};

/**
 * Show install prompt for PWA
 */
export const showInstallPrompt = () => {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        // Show custom install button
        const installBtn = document.createElement('button');
        installBtn.className = 'fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors z-50';
        installBtn.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span>Install App</span>
            </div>
        `;

        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const choiceResult = await deferredPrompt.userChoice;

                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }

                deferredPrompt = null;
                installBtn.remove();
            }
        });

        document.body.appendChild(installBtn);
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        const installBtn = document.querySelector('button[data-install]');
        if (installBtn) {
            installBtn.remove();
        }
    });
};

/**
 * Initialize all service worker related functionality
 */
export const initializeServiceWorker = () => {
    registerServiceWorker();
    requestNotificationPermission();
    showInstallPrompt();
};

export default {
    registerServiceWorker,
    requestNotificationPermission,
    isPWA,
    showInstallPrompt,
    initializeServiceWorker
};