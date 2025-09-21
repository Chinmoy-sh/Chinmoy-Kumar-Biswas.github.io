/**
 * ===============================================
 * ADVANCED THEME MANAGEMENT SYSTEM
 * Professional Portfolio by Chinmoy Kumar Biswas
 * Version: 2.0.0
 * ===============================================
 */

class ThemeManager {
    constructor(options = {}) {
        this.config = {
            defaultTheme: 'dark',
            autoDetect: true,
            transition: true,
            persistence: true,
            transitions: {
                duration: '0.3s',
                easing: 'ease-in-out'
            },
            ...options
        };

        this.currentTheme = null;
        this.systemTheme = null;
        this.observers = [];
        this.themes = {
            dark: {
                name: 'Dark',
                icon: 'fas fa-moon',
                variables: {
                    '--primary-color': '#00f5ff',
                    '--secondary-color': '#ff006e',
                    '--accent-color': '#8338ec',
                    '--bg-primary': '#0f0f23',
                    '--bg-secondary': '#16213e',
                    '--bg-tertiary': '#1a1a2e',
                    '--text-primary': '#ffffff',
                    '--text-secondary': '#b8b8b8',
                    '--text-tertiary': '#8a8a8a'
                }
            },
            light: {
                name: 'Light',
                icon: 'fas fa-sun',
                variables: {
                    '--primary-color': '#0ea5e9',
                    '--secondary-color': '#e11d48',
                    '--accent-color': '#7c3aed',
                    '--bg-primary': '#ffffff',
                    '--bg-secondary': '#f8fafc',
                    '--bg-tertiary': '#f1f5f9',
                    '--text-primary': '#1e293b',
                    '--text-secondary': '#475569',
                    '--text-tertiary': '#64748b'
                }
            },
            auto: {
                name: 'Auto',
                icon: 'fas fa-adjust'
            }
        };

        this.init();
    }

    init() {
        this.detectSystemTheme();
        this.setupSystemThemeListener();
        this.setupTransitions();
        this.loadSavedTheme();
        this.setupThemeToggle();

        console.log('🎨 Theme management system initialized');
    }

    detectSystemTheme() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            this.systemTheme = darkModeQuery.matches ? 'dark' : 'light';

            // Apply system theme if auto-detect is enabled
            if (this.config.autoDetect && !this.getSavedTheme()) {
                this.setTheme(this.systemTheme, false);
            }
        }
    }

    setupSystemThemeListener() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkModeQuery.addListener((e) => {
                this.systemTheme = e.matches ? 'dark' : 'light';

                // Update if current theme is auto or not set
                if (this.currentTheme === 'auto' || !this.currentTheme) {
                    this.applyTheme(this.systemTheme);
                    this.notifyObservers(this.systemTheme, this.currentTheme);
                }
            });
        }
    }

    setupTransitions() {
        if (!this.config.transition) return;

        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                transition: 
                    background-color ${this.config.transitions.duration} ${this.config.transitions.easing},
                    color ${this.config.transitions.duration} ${this.config.transitions.easing},
                    border-color ${this.config.transitions.duration} ${this.config.transitions.easing},
                    box-shadow ${this.config.transitions.duration} ${this.config.transitions.easing} !important;
            }
        `;
        document.head.appendChild(style);
    }

    loadSavedTheme() {
        const savedTheme = this.getSavedTheme();
        const themeToApply = savedTheme || this.config.defaultTheme;

        this.setTheme(themeToApply, false);
    }

    getSavedTheme() {
        if (!this.config.persistence) return null;

        try {
            return localStorage.getItem('portfolio_theme');
        } catch (e) {
            console.warn('Failed to load saved theme:', e);
            return null;
        }
    }

    saveTheme(theme) {
        if (!this.config.persistence) return;

        try {
            localStorage.setItem('portfolio_theme', theme);
        } catch (e) {
            console.warn('Failed to save theme:', e);
        }
    }

    setupThemeToggle() {
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                this.toggleTheme();
            });

            // Update button icon
            this.updateToggleButton(toggleButton);
        }
    }

    updateToggleButton(button) {
        if (!button) return;

        const theme = this.getEffectiveTheme();
        const themeConfig = this.themes[theme];

        if (themeConfig && themeConfig.icon) {
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = themeConfig.icon;
            }
        }

        button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
        button.title = `Current: ${this.themes[theme]?.name || theme} theme`;
    }

    setTheme(theme, save = true) {
        if (!this.themes[theme] && theme !== 'auto') {
            console.warn(`Theme '${theme}' not found`);
            return false;
        }

        const previousTheme = this.currentTheme;
        this.currentTheme = theme;

        // Determine effective theme
        const effectiveTheme = this.getEffectiveTheme();

        // Apply theme
        this.applyTheme(effectiveTheme);

        // Save theme preference
        if (save) {
            this.saveTheme(theme);
        }

        // Update UI elements
        this.updateUIElements();

        // Notify observers
        this.notifyObservers(effectiveTheme, previousTheme);

        console.log(`🎨 Theme changed to: ${theme} (effective: ${effectiveTheme})`);
        return true;
    }

    getEffectiveTheme() {
        if (this.currentTheme === 'auto') {
            return this.systemTheme || 'dark';
        }
        return this.currentTheme || this.systemTheme || this.config.defaultTheme;
    }

    applyTheme(theme) {
        const themeConfig = this.themes[theme];
        if (!themeConfig || !themeConfig.variables) return;

        const root = document.documentElement;

        // Apply CSS variables
        Object.entries(themeConfig.variables).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Update data attribute for CSS selectors
        root.setAttribute('data-theme', theme);

        // Update body class
        document.body.className = document.body.className
            .replace(/theme-\w+/g, '')
            .trim();
        document.body.classList.add(`theme-${theme}`);
    }

    updateUIElements() {
        // Update theme toggle button
        const toggleButton = document.getElementById('theme-toggle');
        this.updateToggleButton(toggleButton);

        // Update any theme-aware components
        document.querySelectorAll('[data-theme-aware]').forEach(element => {
            const theme = this.getEffectiveTheme();
            element.setAttribute('data-current-theme', theme);
        });
    }

    toggleTheme() {
        const currentEffective = this.getEffectiveTheme();
        const newTheme = currentEffective === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    cycleTheme() {
        const themes = Object.keys(this.themes);
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];

        this.setTheme(nextTheme);
    }

    addObserver(callback) {
        if (typeof callback === 'function') {
            this.observers.push(callback);
        }
    }

    removeObserver(callback) {
        const index = this.observers.indexOf(callback);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers(newTheme, previousTheme) {
        this.observers.forEach(callback => {
            try {
                callback(newTheme, previousTheme, this);
            } catch (error) {
                console.error('Theme observer error:', error);
            }
        });
    }

    registerTheme(name, config) {
        if (!name || !config) {
            console.warn('Invalid theme registration');
            return false;
        }

        this.themes[name] = {
            name: config.name || name,
            icon: config.icon || 'fas fa-palette',
            variables: config.variables || {}
        };

        return true;
    }

    // Utility methods
    isDarkMode() {
        const effective = this.getEffectiveTheme();
        return effective === 'dark';
    }

    isLightMode() {
        const effective = this.getEffectiveTheme();
        return effective === 'light';
    }

    // Debug methods
    getThemeInfo() {
        return {
            current: this.currentTheme,
            effective: this.getEffectiveTheme(),
            system: this.systemTheme,
            available: Object.keys(this.themes)
        };
    }
}

// Theme-aware component utilities
class ThemeAwareComponent {
    constructor(element, themeManager) {
        this.element = element;
        this.themeManager = themeManager;
        this.themeCallbacks = new Map();

        // Listen to theme changes
        this.themeManager.addObserver(this.handleThemeChange.bind(this));
    }

    handleThemeChange(newTheme, previousTheme) {
        const callback = this.themeCallbacks.get(newTheme);
        if (callback) {
            callback.call(this, this.element, newTheme, previousTheme);
        }
    }

    onTheme(theme, callback) {
        this.themeCallbacks.set(theme, callback);

        // Execute immediately if current theme matches
        if (this.themeManager.getEffectiveTheme() === theme) {
            callback.call(this, this.element, theme);
        }
    }
}

// Initialize theme system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager({
        defaultTheme: 'dark',
        autoDetect: true,
        transition: true,
        persistence: true
    });

    // Expose to global scope
    window.themeManager = themeManager;
    window.ThemeAwareComponent = ThemeAwareComponent;

    // Add theme change animations
    themeManager.addObserver((newTheme, previousTheme) => {
        // Animate theme transition
        document.body.style.opacity = '0.95';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 150);

        // Update particle system colors if available
        if (window.particleSystem) {
            const themeColors = {
                dark: ['#00f5ff', '#ff006e', '#8338ec', '#00ff88'],
                light: ['#0ea5e9', '#e11d48', '#7c3aed', '#059669']
            };

            const effectiveTheme = themeManager.getEffectiveTheme();
            window.particleSystem.updateConfig({
                colors: {
                    particles: themeColors[effectiveTheme] || themeColors.dark,
                    connections: themeColors[effectiveTheme][0]
                }
            });
        }

        // Custom event for other components
        document.dispatchEvent(new CustomEvent('themechange', {
            detail: { newTheme, previousTheme, effective: themeManager.getEffectiveTheme() }
        }));
    });

    console.log('🎨 Advanced theme system initialized');
});

// exports removed for non-module usage