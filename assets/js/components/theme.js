/**
 * THEME CONTROLLER MODULE
 * Handles theme switching between light and dark modes
 * @module theme
 */

let currentTheme = 'dark';
let themeToggleButtons = [];
let themeIcons = [];
let isInitialized = false;

/**
 * Initialize theme functionality
 */
export const initializeTheme = () => {
    if (isInitialized) return;

    // Get theme elements
    themeToggleButtons = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle, #section-theme-toggle');
    themeIcons = document.querySelectorAll('#theme-icon, #mobile-theme-icon');

    // Load saved theme
    loadSavedTheme();

    // Setup event listeners
    setupThemeToggleListeners();

    // Setup system theme listener
    setupSystemThemeListener();

    isInitialized = true;
};

/**
 * Load saved theme from localStorage
 */
const loadSavedTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Use saved theme, or system preference, or default to dark
    currentTheme = savedTheme || (prefersDark ? 'dark' : 'light') || 'dark';
    setTheme(currentTheme);
};

/**
 * Setup theme toggle event listeners
 */
const setupThemeToggleListeners = () => {
    themeToggleButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', toggleTheme);
        }
    });
};

/**
 * Setup system theme change listener
 */
const setupSystemThemeListener = () => {
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', handleSystemThemeChange);
    }
};

/**
 * Handle system theme change
 * @param {MediaQueryListEvent} e - Media query event
 */
const handleSystemThemeChange = (e) => {
    // Only auto-switch if user hasn't manually set a theme
    const userTheme = localStorage.getItem('theme');
    if (!userTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
    }
};

/**
 * Set theme
 * @param {string} theme - Theme to set ('light' or 'dark')
 */
export const setTheme = (theme) => {
    if (theme !== 'light' && theme !== 'dark') {
        console.warn(`Invalid theme: ${theme}. Using 'dark' as fallback.`);
        theme = 'dark';
    }

    currentTheme = theme;

    // Update body classes
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${theme}-mode`);

    // Update document element attribute for CSS targeting
    document.documentElement.setAttribute('data-theme', theme);

    // Update theme icons
    updateThemeIcons(theme);

    // Update meta theme-color for browser UI
    updateMetaThemeColor(theme);

    // Save to localStorage
    localStorage.setItem('theme', theme);

    // Dispatch custom event for other components
    dispatchThemeChangeEvent(theme);

    console.log(`Theme changed to: ${theme}`);
};

/**
 * Toggle between light and dark themes
 */
export const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
};

/**
 * Update theme icons
 * @param {string} theme - Current theme
 */
const updateThemeIcons = (theme) => {
    themeIcons.forEach(icon => {
        if (icon) {
            if (theme === 'light') {
                // In light mode, show moon icon (to switch to dark)
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                // In dark mode, show sun icon (to switch to light)
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    });

    // Update button attributes for accessibility
    themeToggleButtons.forEach(button => {
        if (button) {
            const label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
            button.setAttribute('aria-label', label);
            button.setAttribute('title', label);
        }
    });
};

/**
 * Update meta theme-color for browser UI
 * @param {string} theme - Current theme
 */
const updateMetaThemeColor = (theme) => {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }

    // Also update fallback meta if it exists
    const fallbackMeta = document.querySelector('meta#fallback-theme-color');

    const colors = {
        light: '#f0f2f5',
        dark: '#0f172a'
    };

    const color = colors[theme];
    metaThemeColor.content = color;

    if (fallbackMeta) {
        fallbackMeta.content = color;
    }
};

/**
 * Dispatch theme change event
 * @param {string} theme - New theme
 */
const dispatchThemeChangeEvent = (theme) => {
    const event = new CustomEvent('themeChanged', {
        detail: { theme, previousTheme: theme === 'dark' ? 'light' : 'dark' }
    });
    document.dispatchEvent(event);
};

/**
 * Get current theme
 * @returns {string} Current theme ('light' or 'dark')
 */
export const getCurrentTheme = () => currentTheme;

/**
 * Check if dark theme is active
 * @returns {boolean} True if dark theme is active
 */
export const isDarkTheme = () => currentTheme === 'dark';

/**
 * Check if light theme is active
 * @returns {boolean} True if light theme is active
 */
export const isLightTheme = () => currentTheme === 'light';

/**
 * Apply theme to specific element
 * @param {HTMLElement} element - Element to apply theme to
 * @param {string} theme - Theme to apply
 */
export const applyThemeToElement = (element, theme = currentTheme) => {
    if (!element) return;

    element.classList.remove('light-theme', 'dark-theme');
    element.classList.add(`${theme}-theme`);
    element.setAttribute('data-theme', theme);
};

/**
 * Get theme colors for current theme
 * @returns {Object} Object containing theme colors
 */
export const getThemeColors = () => {
    const themes = {
        light: {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            accent: '#06b6d4',
            background: '#ffffff',
            surface: '#f8fafc',
            text: '#1f2937',
            textSecondary: '#6b7280',
            border: '#e5e7eb'
        },
        dark: {
            primary: '#6366f1',
            secondary: '#8b5cf6',
            accent: '#06b6d4',
            background: '#0f172a',
            surface: '#1e293b',
            text: '#f1f5f9',
            textSecondary: '#94a3b8',
            border: '#334155'
        }
    };

    return themes[currentTheme] || themes.dark;
};

/**
 * Create theme preference controls
 * @param {HTMLElement} container - Container element
 */
export const createThemeControls = (container) => {
    if (!container) return;

    const controlsHTML = `
        <div class="theme-controls flex items-center space-x-4">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme:
            </span>
            <div class="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button 
                    class="theme-option px-3 py-1 text-sm font-medium rounded-md transition-colors ${currentTheme === 'light' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}" 
                    data-theme="light"
                    aria-label="Switch to light theme"
                >
                    Light
                </button>
                <button 
                    class="theme-option px-3 py-1 text-sm font-medium rounded-md transition-colors ${currentTheme === 'dark' ? 'bg-gray-800 shadow-sm text-white' : 'text-gray-400 hover:text-gray-100'}" 
                    data-theme="dark"
                    aria-label="Switch to dark theme"
                >
                    Dark
                </button>
                <button 
                    class="theme-option px-3 py-1 text-sm font-medium rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" 
                    data-theme="auto"
                    aria-label="Use system theme preference"
                >
                    Auto
                </button>
            </div>
        </div>
    `;

    container.innerHTML = controlsHTML;

    // Add event listeners
    const themeOptions = container.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const selectedTheme = e.target.dataset.theme;

            if (selectedTheme === 'auto') {
                // Remove saved preference and use system
                localStorage.removeItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setTheme(prefersDark ? 'dark' : 'light');
            } else {
                setTheme(selectedTheme);
            }

            // Update button states
            updateThemeControlsState(container, selectedTheme);
        });
    });
};

/**
 * Update theme controls state
 * @param {HTMLElement} container - Controls container
 * @param {string} activeTheme - Active theme
 */
const updateThemeControlsState = (container, activeTheme) => {
    const options = container.querySelectorAll('.theme-option');

    options.forEach(option => {
        const theme = option.dataset.theme;
        option.classList.remove('bg-white', 'shadow-sm', 'text-gray-900', 'bg-gray-800', 'text-white');

        if (theme === activeTheme || (activeTheme === currentTheme && theme === currentTheme)) {
            if (theme === 'light') {
                option.classList.add('bg-white', 'shadow-sm', 'text-gray-900');
            } else if (theme === 'dark') {
                option.classList.add('bg-gray-800', 'shadow-sm', 'text-white');
            }
        } else {
            option.classList.add(theme === 'light' ? 'text-gray-600' : 'text-gray-400');
        }
    });
};

/**
 * Listen for theme changes
 * @param {Function} callback - Callback function to execute on theme change
 */
export const onThemeChange = (callback) => {
    if (typeof callback !== 'function') return;

    document.addEventListener('themeChanged', callback);

    // Return cleanup function
    return () => {
        document.removeEventListener('themeChanged', callback);
    };
};

export default {
    initializeTheme,
    setTheme,
    toggleTheme,
    getCurrentTheme,
    isDarkTheme,
    isLightTheme,
    applyThemeToElement,
    getThemeColors,
    createThemeControls,
    onThemeChange
};