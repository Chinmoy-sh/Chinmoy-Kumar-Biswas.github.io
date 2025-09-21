/**
 * MAIN APPLICATION MODULE
 * Entry point that initializes all components and manages the application
 * @module app
 */

// Import utilities
import { initializeServiceWorker } from './utils/serviceWorker.js';
import { getCurrentYear } from './utils/utilities.js';
import { initializeSecurity } from './utils/security.js';

// Import animations
import { initializeAnimations } from './animations/scrollAnimations.js';

// Import components
import { initializeNavigation } from './components/navigation.js';
import { initializeModals } from './components/modals.js';
import { initializeTheme } from './components/theme.js';
import { initializeCarousels } from './components/carousel.js';
import { initializeForms } from './components/forms.js';

/**
 * Application class to manage the entire portfolio
 */
class PortfolioApp {
    constructor() {
        this.isInitialized = false;
        this.components = new Map();
        this.config = {
            debug: false,
            performance: {
                enableAnimations: true,
                enableParticles: true,
                enableThreeJS: true
            }
        };
    }

    /**
     * Initialize the entire application
     */
    async init() {
        if (this.isInitialized) return;

        try {
            console.log('🚀 Initializing Portfolio Application...');

            // Initialize core utilities first
            await this.initializeUtilities();

            // Initialize components
            await this.initializeComponents();

            // Initialize animations and effects
            await this.initializeEffects();

            // Initialize 3D features
            await this.initialize3DFeatures();

            // Initialize project filtering
            this.initializeProjectFiltering();

            // Set current year
            this.setCurrentYear();

            this.isInitialized = true;
            console.log('✅ Portfolio Application initialized successfully!');

            // Hide loading spinner
            this.hideLoadingSpinner();

            // Dispatch ready event
            this.dispatchReadyEvent();

        } catch (error) {
            console.error('❌ Failed to initialize Portfolio Application:', error);

            // Hide spinner even on error
            this.hideLoadingSpinner();

            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize core utilities
     */
    async initializeUtilities() {
        console.log('📦 Initializing utilities...');

        // Initialize security monitoring first
        if (this.config.features?.enableSecurity !== false) {
            initializeSecurity();
        }

        // Initialize service worker for PWA functionality
        initializeServiceWorker();

        this.components.set('utilities', { initialized: true });
    }

    /**
     * Initialize all components
     */
    async initializeComponents() {
        console.log('🧩 Initializing components...');

        const componentInitializers = [
            { name: 'theme', init: initializeTheme },
            { name: 'navigation', init: initializeNavigation },
            { name: 'modals', init: initializeModals },
            { name: 'carousels', init: initializeCarousels },
            { name: 'forms', init: initializeForms }
        ];

        for (const { name, init } of componentInitializers) {
            try {
                await init();
                this.components.set(name, { initialized: true, timestamp: Date.now() });
                console.log(`  ✓ ${name} component initialized`);
            } catch (error) {
                console.error(`  ✗ Failed to initialize ${name} component:`, error);
                this.components.set(name, { initialized: false, error });
            }
        }
    }

    /**
     * Initialize animations and effects
     */
    async initializeEffects() {
        console.log('✨ Initializing animations and effects...');

        if (!this.config.performance.enableAnimations) {
            console.log('  ⚠️ Animations disabled by configuration');
            return;
        }

        try {
            initializeAnimations();
            this.components.set('animations', { initialized: true, timestamp: Date.now() });
            console.log('  ✓ Animations initialized');
        } catch (error) {
            console.error('  ✗ Failed to initialize animations:', error);
            this.components.set('animations', { initialized: false, error });
        }
    }

    /**
     * Initialize 3D features
     */
    async initialize3DFeatures() {
        console.log('🎮 Initializing 3D features...');

        if (!this.config.performance.enableThreeJS) {
            console.log('  ⚠️ 3D features disabled by configuration');
            return;
        }

        try {
            // Import and initialize 3D module only if needed
            const { ThreeJSSkillsShow } = await import('./components/threeJS.js').catch(() => ({}));

            if (ThreeJSSkillsShow) {
                const threeJS = new ThreeJSSkillsShow();
                await threeJS.init();
                this.components.set('threeJS', { initialized: true, instance: threeJS });
                console.log('  ✓ 3D features initialized');
            } else {
                console.log('  ⚠️ 3D features not available');
            }
        } catch (error) {
            console.error('  ✗ Failed to initialize 3D features:', error);
            this.showThreeJSFallback();
        }
    }

    /**
     * Initialize project filtering
     */
    initializeProjectFiltering() {
        console.log('🔍 Initializing project filtering...');

        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        if (filterButtons.length === 0 || projectCards.length === 0) {
            console.log('  ⚠️ Filter buttons or project cards not found');
            return;
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleProjectFilter(button, filterButtons, projectCards);
            });
        });

        // Trigger initial filter to show all projects
        const allButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allButton) {
            allButton.click();
        }

        console.log('  ✓ Project filtering initialized');
    }

    /**
     * Handle project filtering
     * @param {HTMLElement} activeButton - Clicked filter button
     * @param {NodeList} allButtons - All filter buttons
     * @param {NodeList} projectCards - All project cards
     */
    handleProjectFilter(activeButton, allButtons, projectCards) {
        // Update active button state
        allButtons.forEach(btn => {
            btn.classList.remove('active-filter', 'bg-indigo-600', 'text-white');
            btn.classList.add('bg-gray-700', 'text-gray-300');
        });

        activeButton.classList.add('active-filter', 'bg-indigo-600', 'text-white');
        activeButton.classList.remove('bg-gray-700', 'text-gray-300');

        const filterValue = activeButton.dataset.filter;

        // Filter projects
        projectCards.forEach(card => {
            const technologies = card.dataset.tech || '';
            const shouldShow = filterValue === 'all' || technologies.includes(filterValue);

            if (shouldShow) {
                card.style.display = 'block';
                card.classList.remove('filtered-out');
            } else {
                card.style.display = 'none';
                card.classList.add('filtered-out');
            }
        });

        // Dispatch filter event
        this.dispatchEvent('projectsFiltered', { filter: filterValue });
    }

    /**
     * Set current year in footer
     */
    setCurrentYear() {
        const currentYearSpan = document.getElementById('current-year');
        if (currentYearSpan) {
            currentYearSpan.textContent = getCurrentYear();
        }
    }

    /**
     * Show Three.js fallback
     */
    showThreeJSFallback() {
        const fallback = document.getElementById('three-fallback');
        if (fallback) {
            fallback.classList.remove('hidden');
            fallback.classList.add('flex');
        }
    }

    /**
     * Handle initialization errors
     * @param {Error} error - Initialization error
     */
    handleInitializationError(error) {
        // Show user-friendly error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'fixed top-4 left-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-md';
        errorMessage.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>⚠️</span>
                <div>
                    <p class="font-medium">Initialization Error</p>
                    <p class="text-sm opacity-90">Some features may not work properly. Please refresh the page.</p>
                </div>
            </div>
        `;

        document.body.appendChild(errorMessage);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorMessage.parentNode) {
                document.body.removeChild(errorMessage);
            }
        }, 10000);
    }

    /**
     * Hide loading spinner
     */
    hideLoadingSpinner() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.style.opacity = '0';
            setTimeout(() => {
                spinner.style.display = 'none';
            }, 500);
        }
    }

    /**
     * Dispatch ready event
     */
    dispatchReadyEvent() {
        const event = new CustomEvent('portfolioReady', {
            detail: {
                components: Object.fromEntries(this.components),
                timestamp: Date.now(),
                version: '2.0.0'
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Dispatch custom event
     * @param {string} eventName - Event name
     * @param {Object} detail - Event detail
     */
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    /**
     * Get component status
     * @param {string} componentName - Component name
     * @returns {Object|null} Component status
     */
    getComponentStatus(componentName) {
        return this.components.get(componentName) || null;
    }

    /**
     * Get all components status
     * @returns {Object} All components status
     */
    getAllComponentsStatus() {
        return Object.fromEntries(this.components);
    }

    /**
     * Enable debug mode
     */
    enableDebug() {
        this.config.debug = true;
        console.log('🐛 Debug mode enabled');

        // Add debug panel to DOM
        this.createDebugPanel();
    }

    /**
     * Create debug panel
     */
    createDebugPanel() {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.className = 'fixed bottom-4 left-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-xs z-50';
        debugPanel.innerHTML = `
            <h3 class="font-bold mb-2">Debug Panel</h3>
            <div id="debug-content">
                <p>Components: ${this.components.size}</p>
                <p>Initialized: ${this.isInitialized}</p>
            </div>
            <button id="debug-close" class="mt-2 text-red-400 hover:text-red-300">Close</button>
        `;

        document.body.appendChild(debugPanel);

        // Close button
        document.getElementById('debug-close').addEventListener('click', () => {
            debugPanel.remove();
        });

        // Update panel every 5 seconds
        const updatePanel = () => {
            const content = document.getElementById('debug-content');
            if (content) {
                content.innerHTML = `
                    <p>Components: ${this.components.size}</p>
                    <p>Initialized: ${this.isInitialized}</p>
                    <p>Memory: ${(performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(2) || 'N/A'} MB</p>
                `;
            }
        };

        setInterval(updatePanel, 5000);
    }

    /**
     * Reload application
     */
    async reload() {
        console.log('🔄 Reloading Portfolio Application...');
        this.isInitialized = false;
        this.components.clear();
        await this.init();
    }

    /**
     * Destroy application
     */
    destroy() {
        console.log('💣 Destroying Portfolio Application...');

        // Clean up components
        this.components.forEach((component, name) => {
            if (component.destroy && typeof component.destroy === 'function') {
                try {
                    component.destroy();
                } catch (error) {
                    console.error(`Failed to destroy ${name}:`, error);
                }
            }
        });

        // Clear components
        this.components.clear();
        this.isInitialized = false;

        console.log('✅ Portfolio Application destroyed');
    }
}

// Create global app instance
const app = new PortfolioApp();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Make app available globally for debugging
window.portfolioApp = app;

// Export for ES modules
export default app;
export { PortfolioApp };