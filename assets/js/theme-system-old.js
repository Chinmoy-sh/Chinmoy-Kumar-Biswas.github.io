/**
 * ===============================================
 * ADVANCED THEME SYSTEM
 * Professional Portfolio by Chinmoy Kumar Biswas
 * Version: 2.0.0
 * ===============================================
 */

class ThemeManager {
    constructor(options = {}) {
        this.config = {
            storageKey: 'portfolio-theme',
            defaultTheme: 'dark',
            autoDetect: true,
            transition: true,
            transitionDuration: 300,
            persistence: true,
            systemPreference: true,
            ...options
        };

        this.themes = {
            dark: {
                name: 'Dark Theme',
                icon: '🌙',
                class: 'dark-theme'
            },
            light: {
                name: 'Light Theme',
                icon: '☀️',
                class: 'light-theme'
            },
            auto: {
                name: 'Auto (System)',
                icon: '🔄',
                class: 'auto-theme'
            }
        };

        this.currentTheme = null;
        this.systemTheme = null;
        this.toggleButtons = [];
        this.observers = [];

        this.init();
    }

    init() {
        this.detectSystemTheme();
        this.loadSavedTheme();
        this.setupToggleButtons();
        this.setupSystemListener();
        this.applyTransitionStyles();

        // Apply initial theme
        this.applyTheme(this.currentTheme);

        console.log(`🎨 Theme system initialized: ${this.currentTheme}`);
    }

    detectSystemTheme() {
        if (!window.matchMedia) {
            this.systemTheme = 'light';
            return;
        }

        this.systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    loadSavedTheme() {
        if (!this.config.persistence) {
            this.currentTheme = this.config.defaultTheme;
            return;
        }

        try {
            const savedTheme = localStorage.getItem(this.config.storageKey);

            if (savedTheme && this.themes[savedTheme]) {
                this.currentTheme = savedTheme;
            } else if (this.config.autoDetect && this.config.systemPreference) {
                this.currentTheme = 'auto';
            } else {
                this.currentTheme = this.config.defaultTheme;
            }
        } catch (error) {
            console.warn('Failed to load theme from storage:', error);
            this.currentTheme = this.config.defaultTheme;
        }
    }

    saveTheme(theme) {
        if (!this.config.persistence) return;

        try {
            localStorage.setItem(this.config.storageKey, theme);
        } catch (error) {
            console.warn('Failed to save theme to storage:', error);
        }
    }

    setupToggleButtons() {
        this.toggleButtons = Array.from(document.querySelectorAll('[data-theme-toggle]'));

        this.toggleButtons.forEach(button => {
            button.addEventListener('click', this.handleToggleClick.bind(this));

            // Set initial state
            this.updateButtonState(button);
        });

        // Create default toggle if none exists
        if (this.toggleButtons.length === 0) {
            this.createDefaultToggle();
        }
    }

    createDefaultToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('data-theme-toggle', '');
        toggle.setAttribute('aria-label', 'Toggle theme');
        toggle.innerHTML = '<i class="theme-icon fas fa-moon"></i>';

        // Try to add to navigation
        const nav = document.querySelector('.nav-actions') || document.querySelector('nav');
        if (nav) {
            nav.appendChild(toggle);
            this.toggleButtons.push(toggle);
            this.updateButtonState(toggle);
        }
    }

    handleToggleClick(event) {
        event.preventDefault();

        const button = event.currentTarget;
        const mode = button.dataset.themeToggle || 'cycle';

        switch (mode) {
            case 'cycle':
                this.cycleTheme();
                break;
            case 'toggle':
                this.toggleTheme();
                break;
            default:
                if (this.themes[mode]) {
                    this.setTheme(mode);
                }
                break;
        }

        // Update all toggle buttons
        this.toggleButtons.forEach(btn => this.updateButtonState(btn));

        // Provide haptic feedback on supported devices
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    cycleTheme() {
        const themeOrder = ['dark', 'light', 'auto'];
        const currentIndex = themeOrder.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themeOrder.length;

        this.setTheme(themeOrder[nextIndex]);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        if (!this.themes[theme]) {
            console.warn(`Unknown theme: ${theme}`);
            return;
        }

        const previousTheme = this.currentTheme;
        this.currentTheme = theme;

        this.applyTheme(theme);
        this.saveTheme(theme);
        this.notifyObservers(theme, previousTheme);

        // Announce theme change for screen readers
        this.announceThemeChange(theme);

        console.log(`🎨 Theme changed to: ${theme}`);
    }

    applyTheme(theme) {
        const body = document.body;
        const html = document.documentElement;

        // Remove all theme classes
        Object.values(this.themes).forEach(themeConfig => {
            body.classList.remove(themeConfig.class);
            html.classList.remove(themeConfig.class);
        });

        // Determine effective theme
        let effectiveTheme = theme;
        if (theme === 'auto') {
            effectiveTheme = this.systemTheme;
        }

        // Apply theme class
        const themeClass = this.themes[effectiveTheme]?.class || this.themes.dark.class;
        body.classList.add(themeClass);
        html.classList.add(themeClass);

        // Set data attribute for CSS targeting
        html.setAttribute('data-theme', effectiveTheme);
        body.setAttribute('data-theme', effectiveTheme);

        // Update CSS custom properties for immediate effect
        this.updateCSSProperties(effectiveTheme);

        // Update meta theme-color
        this.updateMetaThemeColor(effectiveTheme);
    }

    updateCSSProperties(theme) {
        const root = document.documentElement;

        // Theme-specific color updates
        const colorMappings = {
            dark: {
                '--bg-primary': '#0f0f23',
                '--bg-secondary': '#16213e',
                '--text-primary': '#ffffff',
                '--text-secondary': '#b8b8b8'
            },
            light: {
                '--bg-primary': '#ffffff',
                '--bg-secondary': '#f8fafc',
                '--text-primary': '#1e293b',
                '--text-secondary': '#475569'
            }
        };

        const colors = colorMappings[theme];
        if (colors) {
            Object.entries(colors).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });
        }
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name=\"theme-color\"]');

        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        const themeColors = {
            dark: '#0f0f23',
            light: '#ffffff'
        };

        metaThemeColor.content = themeColors[theme] || themeColors.dark;
    }

    updateButtonState(button) {
        const themeConfig = this.themes[this.currentTheme];

        // Update icon
        const icon = button.querySelector('.theme-icon');
        if (icon) {
            // Update icon class based on current theme
            const iconClasses = {
                dark: 'fa-moon',
                light: 'fa-sun',
                auto: 'fa-adjust'
            };

            icon.className = `theme-icon fas ${iconClasses[this.currentTheme] || iconClasses.dark}`;
        }

        // Update aria-label
        button.setAttribute('aria-label', `Switch to next theme (current: ${themeConfig.name})`);
        button.setAttribute('title', themeConfig.name);

        // Update pressed state
        button.setAttribute('aria-pressed', 'false');
    }

    setupSystemListener() {
        if (!this.config.systemPreference || !window.matchMedia) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (e) => {
            this.systemTheme = e.matches ? 'dark' : 'light';

            // If current theme is auto, reapply theme
            if (this.currentTheme === 'auto') {
                this.applyTheme('auto');
            }

            console.log(`🔄 System theme changed to: ${this.systemTheme}`);
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        } else {
            // Legacy support
            mediaQuery.addListener(handleSystemThemeChange);
        }
    }

    applyTransitionStyles() {
        if (!this.config.transition) return;

        const style = document.createElement('style');
        style.textContent = `\n            *,\n            *::before,\n            *::after {\n                transition: \n                    background-color ${this.config.transitionDuration}ms ease,\n                    border-color ${this.config.transitionDuration}ms ease,\n                    color ${this.config.transitionDuration}ms ease,\n                    box-shadow ${this.config.transitionDuration}ms ease !important;\n            }\n        `;
        document.head.appendChild(style);

        // Remove transitions after initial load to prevent issues
        setTimeout(() => {
            style.remove();
        }, this.config.transitionDuration + 100);
    }

    announceThemeChange(theme) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Theme changed to ${this.themes[theme].name}`;

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Observer pattern for theme changes
    addObserver(callback) {
        this.observers.push(callback);
    }

    removeObserver(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }

    notifyObservers(newTheme, previousTheme) {
        this.observers.forEach(callback => {
            try {
                callback(newTheme, previousTheme);
            } catch (error) {
                console.error('Theme observer error:', error);
            }
        });
    }

    // Public API methods
    getCurrentTheme() {
        return this.currentTheme;
    }

    getEffectiveTheme() {
        return this.currentTheme === 'auto' ? this.systemTheme : this.currentTheme;
    }

    getSystemTheme() {
        return this.systemTheme;
    }

    isAutoTheme() {
        return this.currentTheme === 'auto';
    }

    addCustomTheme(id, config) {
        this.themes[id] = config;
    }

    removeCustomTheme(id) {
        if (this.themes[id] && !['dark', 'light', 'auto'].includes(id)) {
            delete this.themes[id];
        }
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
    }\n}\n\n// Theme-aware component utilities\nclass ThemeAwareComponent {\n    constructor(element, themeManager) {\n        this.element = element;\n        this.themeManager = themeManager;\n        this.themeCallbacks = new Map();\n        \n        // Listen to theme changes\n        this.themeManager.addObserver(this.handleThemeChange.bind(this));\n    }\n    \n    handleThemeChange(newTheme, previousTheme) {\n        const callback = this.themeCallbacks.get(newTheme);\n        if (callback) {\n            callback.call(this, this.element, newTheme, previousTheme);\n        }\n    }\n    \n    onTheme(theme, callback) {\n        this.themeCallbacks.set(theme, callback);\n        \n        // Execute immediately if current theme matches\n        if (this.themeManager.getEffectiveTheme() === theme) {\n            callback.call(this, this.element, theme);\n        }\n    }\n}\n\n// Initialize theme system when DOM is ready\ndocument.addEventListener('DOMContentLoaded', () => {\n    const themeManager = new ThemeManager({\n        defaultTheme: 'dark',\n        autoDetect: true,\n        transition: true,\n        persistence: true\n    });\n    \n    // Expose to global scope\n    window.themeManager = themeManager;\n    window.ThemeAwareComponent = ThemeAwareComponent;\n    \n    // Add theme change animations\n    themeManager.addObserver((newTheme, previousTheme) => {\n        // Animate theme transition\n        document.body.style.opacity = '0.95';\n        setTimeout(() => {\n            document.body.style.opacity = '1';\n        }, 150);\n        \n        // Update particle system colors if available\n        if (window.particleSystem) {\n            const themeColors = {\n                dark: ['#00f5ff', '#ff006e', '#8338ec', '#00ff88'],\n                light: ['#0ea5e9', '#e11d48', '#7c3aed', '#059669']\n            };\n            \n            const effectiveTheme = themeManager.getEffectiveTheme();\n            window.particleSystem.updateConfig({\n                colors: {\n                    particles: themeColors[effectiveTheme] || themeColors.dark,\n                    connections: themeColors[effectiveTheme][0]\n                }\n            });\n        }\n        \n        // Custom event for other components\n        document.dispatchEvent(new CustomEvent('themechange', {\n            detail: { newTheme, previousTheme, effective: themeManager.getEffectiveTheme() }\n        }));\n    });\n    \n    console.log('🎨 Advanced theme system initialized');\n});\n\nexport { ThemeManager, ThemeAwareComponent };"