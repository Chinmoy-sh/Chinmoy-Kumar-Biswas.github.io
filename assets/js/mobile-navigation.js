/**
 * ===============================================
 * MOBILE NAVIGATION SYSTEM
 * Professional Portfolio by Chinmoy Kumar Biswas
 * Version: 2.0.0
 * ===============================================
 */

class MobileNavigation {
    constructor(options = {}) {
        this.config = {
            breakpoint: 768,
            animationDuration: 300,
            overlay: true,
            closeOnClick: true,
            closeOnScroll: false,
            swipeGestures: true,
            preventBodyScroll: true,
            focusTrap: true,
            ...options
        };

        this.isOpen = false;
        this.isAnimating = false;
        this.startX = null;
        this.startY = null;
        this.focusableElements = [];
        this.previousFocus = null;

        // DOM elements
        this.nav = null;
        this.menuBtn = null;
        this.menuOverlay = null;
        this.menuContainer = null;
        this.menuItems = [];

        this.init();
    }

    init() {
        this.findElements();
        this.createMobileElements();
        this.setupEventListeners();
        this.setupResponsiveHandling();
        this.setupAccessibility();

        console.log('📱 Mobile navigation system initialized');
    }

    findElements() {
        this.nav = document.querySelector('nav') || document.querySelector('.navbar');
        this.menuBtn = document.querySelector('.menu-btn');

        if (!this.nav) {
            console.warn('Navigation element not found');
            return;
        }

        this.menuItems = Array.from(this.nav.querySelectorAll('a'));
    }

    createMobileElements() {
        if (!this.nav) return;

        // Create hamburger button if it doesn't exist
        if (!this.menuBtn) {
            this.createMenuButton();
        }

        // Create mobile menu container
        this.createMenuContainer();

        // Create overlay if enabled
        if (this.config.overlay) {
            this.createOverlay();
        }

        // Setup initial state
        this.closeMenu(false);
    }

    createMenuButton() {
        this.menuBtn = document.createElement('button');
        this.menuBtn.className = 'menu-btn';
        this.menuBtn.innerHTML = `
            <span class="menu-btn-line"></span>
            <span class="menu-btn-line"></span>
            <span class="menu-btn-line"></span>
        `;

        // Add to navigation
        this.nav.appendChild(this.menuBtn);

        // Add styles
        this.addMenuButtonStyles();
    }

    addMenuButtonStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .menu-btn {
                display: none;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 48px;
                height: 48px;
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 8px;
                border-radius: 8px;
                transition: all 0.3s ease;
                z-index: 1001;
                position: relative;
            }
            
            .menu-btn:hover {
                background-color: var(--glass-bg);
                transform: scale(1.05);
            }
            
            .menu-btn-line {
                width: 24px;
                height: 2px;
                background-color: var(--text-primary);
                margin: 3px 0;
                transition: all 0.3s ease;
                border-radius: 2px;
            }
            
            .menu-btn.active .menu-btn-line:nth-child(1) {
                transform: translateY(8px) rotate(45deg);
            }
            
            .menu-btn.active .menu-btn-line:nth-child(2) {
                opacity: 0;
                transform: scaleX(0);
            }
            
            .menu-btn.active .menu-btn-line:nth-child(3) {
                transform: translateY(-8px) rotate(-45deg);
            }
            
            @media (max-width: 768px) {
                .menu-btn {
                    display: flex;
                }
            }
        `;

        document.head.appendChild(style);
    }

    createMenuContainer() {
        this.menuContainer = document.createElement('div');
        this.menuContainer.className = 'mobile-menu';
        this.menuContainer.setAttribute('aria-hidden', 'true');

        // Clone navigation items
        const navList = this.nav.querySelector('ul') || this.nav.querySelector('.nav-links');
        if (navList) {
            const mobileNavList = navList.cloneNode(true);
            mobileNavList.className = 'mobile-nav-list';
            this.menuContainer.appendChild(mobileNavList);
        }

        document.body.appendChild(this.menuContainer);

        // Add mobile menu styles
        this.addMobileMenuStyles();
    }

    addMobileMenuStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .mobile-menu {
                position: fixed;
                top: 0;
                right: -100%;
                width: 80%;
                max-width: 320px;
                height: 100vh;
                background: var(--glass-bg-strong);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-left: 1px solid var(--glass-border);
                z-index: 1000;
                transition: right ${this.config.animationDuration}ms ease;
                padding: 80px 20px 20px;
                box-shadow: var(--shadow-lg);
                overflow-y: auto;
            }
            
            .mobile-menu.open {
                right: 0;
            }
            
            .mobile-nav-list {
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .mobile-nav-list li {
                margin: 0;
            }
            
            .mobile-nav-list a {
                display: block;
                padding: 16px 20px;
                color: var(--text-primary);
                text-decoration: none;
                border-radius: 12px;
                transition: all 0.3s ease;
                font-size: 1.1rem;
                font-weight: 500;
                border: 1px solid transparent;
            }
            
            .mobile-nav-list a:hover,
            .mobile-nav-list a:focus {
                background: var(--glass-bg);
                border-color: var(--primary-color);
                color: var(--primary-color);
                transform: translateX(8px);
            }
            
            .mobile-nav-list a.active {
                background: var(--primary-gradient);
                color: white;
                font-weight: 600;
            }
            
            @media (min-width: 769px) {
                .mobile-menu {
                    display: none;
                }
            }
        `;

        document.head.appendChild(style);
    }

    createOverlay() {
        this.menuOverlay = document.createElement('div');
        this.menuOverlay.className = 'mobile-menu-overlay';
        this.menuOverlay.setAttribute('aria-hidden', 'true');

        document.body.appendChild(this.menuOverlay);

        // Add overlay styles
        const style = document.createElement('style');
        style.textContent = `
            .mobile-menu-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
                opacity: 0;
                visibility: hidden;
                transition: all ${this.config.animationDuration}ms ease;
                backdrop-filter: blur(2px);
            }
            
            .mobile-menu-overlay.active {
                opacity: 1;
                visibility: visible;
            }
        `;

        document.head.appendChild(style);
    }

    setupEventListeners() {
        if (this.menuBtn) {
            this.menuBtn.addEventListener('click', this.toggleMenu.bind(this));
        }

        if (this.menuOverlay && this.config.closeOnClick) {
            this.menuOverlay.addEventListener('click', this.closeMenu.bind(this));
        }

        if (this.config.closeOnClick) {
            this.menuContainer?.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    this.closeMenu();
                }
            });
        }

        // Escape key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Touch gestures
        if (this.config.swipeGestures && this.menuContainer) {
            this.setupSwipeGestures();
        }
    }

    setupSwipeGestures() {
        const container = this.menuContainer;

        container.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            if (!this.startX || !this.startY) return;

            const diffX = e.changedTouches[0].clientX - this.startX;
            const diffY = e.changedTouches[0].clientY - this.startY;

            // Swipe right to close (threshold: 50px)
            if (diffX > 50 && Math.abs(diffX) > Math.abs(diffY)) {
                this.closeMenu();
            }

            this.startX = null;
            this.startY = null;
        }, { passive: true });
    }

    setupResponsiveHandling() {
        const handleResize = () => {
            if (window.innerWidth > this.config.breakpoint && this.isOpen) {
                this.closeMenu(false);
            }
        };

        window.addEventListener('resize', handleResize);

        // Initial check
        handleResize();
    }

    setupAccessibility() {
        if (!this.menuContainer) return;

        // Set ARIA attributes
        if (this.menuBtn) {
            this.menuBtn.setAttribute('aria-expanded', 'false');
            this.menuBtn.setAttribute('aria-controls', 'mobile-menu');
            this.menuBtn.setAttribute('aria-label', 'Toggle mobile menu');
        }

        this.menuContainer.setAttribute('id', 'mobile-menu');
        this.menuContainer.setAttribute('role', 'navigation');
        this.menuContainer.setAttribute('aria-label', 'Mobile navigation menu');
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu(animate = true) {
        if (this.isOpen || this.isAnimating) return;

        this.isAnimating = true;
        this.isOpen = true;

        // Store current focus
        this.previousFocus = document.activeElement;

        // Add classes
        this.menuBtn?.classList.add('active');
        this.menuContainer?.classList.add('open');
        this.menuOverlay?.classList.add('active');

        // Update ARIA attributes
        this.menuBtn?.setAttribute('aria-expanded', 'true');
        this.menuContainer?.setAttribute('aria-hidden', 'false');
        this.menuOverlay?.setAttribute('aria-hidden', 'false');

        // Prevent body scroll
        if (this.config.preventBodyScroll) {
            document.body.style.overflow = 'hidden';
        }

        setTimeout(() => {
            this.isAnimating = false;
        }, animate ? this.config.animationDuration : 0);

        // Dispatch event
        this.dispatchEvent('menuopen');

        console.log('📱 Mobile menu opened');
    }

    closeMenu(animate = true) {
        if (!this.isOpen && !this.isAnimating) return;

        this.isAnimating = true;
        this.isOpen = false;

        // Remove classes
        this.menuBtn?.classList.remove('active');
        this.menuContainer?.classList.remove('open');
        this.menuOverlay?.classList.remove('active');

        // Update ARIA attributes
        this.menuBtn?.setAttribute('aria-expanded', 'false');
        this.menuContainer?.setAttribute('aria-hidden', 'true');
        this.menuOverlay?.setAttribute('aria-hidden', 'true');

        // Restore body scroll
        if (this.config.preventBodyScroll) {
            document.body.style.overflow = '';
        }

        // Restore focus
        setTimeout(() => {
            if (this.previousFocus) {
                this.previousFocus.focus();
                this.previousFocus = null;
            }
            this.isAnimating = false;
        }, animate ? this.config.animationDuration : 0);

        // Dispatch event
        this.dispatchEvent('menuclose');

        console.log('📱 Mobile menu closed');
    }

    dispatchEvent(eventName) {
        const event = new CustomEvent(eventName, {
            detail: {
                isOpen: this.isOpen,
                menuContainer: this.menuContainer,
                menuBtn: this.menuBtn
            }
        });

        document.dispatchEvent(event);
    }

    // Public API
    isMenuOpen() {
        return this.isOpen;
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    destroy() {
        // Remove event listeners and elements
        this.menuContainer?.remove();
        this.menuOverlay?.remove();

        if (this.menuBtn && this.menuBtn.parentNode) {
            this.menuBtn.remove();
        }

        // Clean up body styles
        if (this.config.preventBodyScroll) {
            document.body.style.overflow = '';
        }

        console.log('📱 Mobile navigation destroyed');
    }
}

// Initialize mobile navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const mobileNav = new MobileNavigation({
        breakpoint: 768,
        animationDuration: 300,
        overlay: true,
        closeOnClick: true,
        swipeGestures: true,
        preventBodyScroll: true,
        focusTrap: true
    });

    // Expose to global scope
    window.mobileNav = mobileNav;

    console.log('📱 Mobile navigation system ready');
});

// export removed for non-module usage