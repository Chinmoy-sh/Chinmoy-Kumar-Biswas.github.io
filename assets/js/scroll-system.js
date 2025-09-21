/**
 * ===============================================
 * SMOOTH SCROLL & NAVIGATION SYSTEM
 * Professional Portfolio by Chinmoy Kumar Biswas
 * Version: 2.0.0
 * ===============================================
 */

class SmoothScrollManager {
    constructor(options = {}) {
        this.config = {
            duration: 800,
            easing: 'easeInOutCubic',
            offset: 80,
            updateURL: true,
            scrollProgressBar: true,
            scrollToTopButton: true,
            activeNavHighlight: true,
            ...options
        };

        this.isScrolling = false;
        this.scrollDirection = 'down';
        this.lastScrollTop = 0;
        this.sections = [];
        this.navLinks = [];
        this.scrollProgressBar = null;
        this.scrollToTopBtn = null;

        this.easingFunctions = {
            easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
            easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
            easeInOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
        };

        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupScrollProgress();
        this.setupScrollToTop();
        this.setupActiveNavigation();
        this.setupScrollEffects();
        this.bindEvents();
    }

    setupSmoothScrolling() {
        // Find all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            if (link.getAttribute('href') !== '#') {
                link.addEventListener('click', this.handleSmoothScroll.bind(this));
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Home') {
                e.preventDefault();
                this.scrollToTarget(document.body, 0);
            } else if (e.key === 'End') {
                e.preventDefault();
                this.scrollToTarget(document.body, document.body.scrollHeight);
            }
        });
    }

    handleSmoothScroll(e) {
        e.preventDefault();

        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            this.scrollToTarget(targetElement);

            if (this.config.updateURL) {
                history.pushState(null, null, `#${targetId}`);
            }

            // Update aria-current for accessibility
            this.updateAriaCurrentNav(targetId);
        }
    }

    scrollToTarget(element, customPosition = null) {
        const targetPosition = customPosition !== null ?
            customPosition :
            element.getBoundingClientRect().top + window.pageYOffset - this.config.offset;

        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        this.isScrolling = true;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.config.duration, 1);
            const ease = this.easingFunctions[this.config.easing](progress);

            window.scrollTo(0, startPosition + (distance * ease));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isScrolling = false;

                // Focus the target element for accessibility
                if (element !== document.body) {
                    element.focus({ preventScroll: true });
                }
            }
        };

        requestAnimationFrame(animate);
    }

    setupScrollProgress() {
        if (!this.config.scrollProgressBar) return;

        // Create progress bar if it doesn't exist
        this.scrollProgressBar = document.querySelector('.scroll-progress');
        if (!this.scrollProgressBar) {
            const progressContainer = document.createElement('div');
            progressContainer.className = 'scroll-indicator';
            progressContainer.innerHTML = '<div class="scroll-progress"></div>';
            document.body.appendChild(progressContainer);
            this.scrollProgressBar = progressContainer.querySelector('.scroll-progress');
        }
    }

    updateScrollProgress() {
        if (!this.scrollProgressBar) return;

        const scrolled = window.pageYOffset;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = Math.min((scrolled / maxScroll) * 100, 100);

        this.scrollProgressBar.style.width = `${progress}%`;
    }

    setupScrollToTop() {
        if (!this.config.scrollToTopButton) return;

        this.scrollToTopBtn = document.querySelector('.scroll-to-top');
        if (!this.scrollToTopBtn) {
            this.scrollToTopBtn = document.createElement('button');
            this.scrollToTopBtn.className = 'scroll-to-top';
            this.scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
            this.scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
            this.scrollToTopBtn.setAttribute('title', 'Back to top');
            document.body.appendChild(this.scrollToTopBtn);
        }

        this.scrollToTopBtn.addEventListener('click', () => {
            this.scrollToTarget(document.body, 0);
        });
    }

    updateScrollToTop() {
        if (!this.scrollToTopBtn) return;

        const scrolled = window.pageYOffset;
        const shouldShow = scrolled > 500;

        this.scrollToTopBtn.classList.toggle('visible', shouldShow);
    }

    setupActiveNavigation() {
        if (!this.config.activeNavHighlight) return;

        // Find all sections with IDs
        this.sections = Array.from(document.querySelectorAll('section[id]'));
        this.navLinks = Array.from(document.querySelectorAll('.navbar .nav-links a[href^="#"]'));

        if (this.sections.length === 0) return;

        // Create intersection observer for sections
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateActiveNavLink(entry.target.id);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-50px 0px -50px 0px'
        });

        this.sections.forEach(section => {
            navObserver.observe(section);
        });
    }

    updateActiveNavLink(activeId) {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            link.classList.toggle('active', href === activeId);
            link.setAttribute('aria-current', href === activeId ? 'page' : 'false');
        });
    }

    updateAriaCurrentNav(targetId) {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            link.setAttribute('aria-current', href === targetId ? 'page' : 'false');
        });
    }

    setupScrollEffects() {
        // Navbar scroll effect
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            this.navbar = navbar;
        }

        // Parallax elements
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
    }

    handleNavbarScroll() {
        if (!this.navbar) return;

        const scrolled = window.pageYOffset;
        const isScrolledPast = scrolled > 50;

        this.navbar.classList.toggle('scrolled', isScrolledPast);
    }

    handleParallaxScroll() {
        if (this.parallaxElements.length === 0) return;

        this.parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(window.pageYOffset * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    updateScrollDirection() {
        const scrollTop = window.pageYOffset;

        if (scrollTop > this.lastScrollTop) {
            this.scrollDirection = 'down';
        } else if (scrollTop < this.lastScrollTop) {
            this.scrollDirection = 'up';
        }

        this.lastScrollTop = scrollTop;

        // Add scroll direction class to body for CSS animations
        document.body.classList.toggle('scrolling-down', this.scrollDirection === 'down');
        document.body.classList.toggle('scrolling-up', this.scrollDirection === 'up');
    }

    bindEvents() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (!this.isScrolling) {
                        this.updateScrollDirection();
                        this.updateScrollProgress();
                        this.updateScrollToTop();
                        this.handleNavbarScroll();
                        this.handleParallaxScroll();
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Handle initial scroll on page load
        setTimeout(handleScroll, 100);

        // Handle hash navigation on page load
        if (window.location.hash) {
            setTimeout(() => {
                const targetId = window.location.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    this.scrollToTarget(targetElement);
                }
            }, 500);
        }
    }

    // Public API methods
    scrollTo(target, options = {}) {
        const config = { ...this.config, ...options };
        this.config = config;

        if (typeof target === 'string') {
            target = document.querySelector(target) || document.getElementById(target);
        }

        if (target) {
            this.scrollToTarget(target);
        }
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    destroy() {
        // Remove event listeners
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.removeEventListener('click', this.handleSmoothScroll);
        });

        if (this.scrollToTopBtn) {
            this.scrollToTopBtn.remove();
        }

        if (this.scrollProgressBar?.parentElement) {
            this.scrollProgressBar.parentElement.remove();
        }
    }
}

// Smooth scroll with additional features
class AdvancedScrollEffects {
    constructor() {
        this.scrollY = 0;
        this.elements = new Map();
        this.rafId = null;

        this.init();
    }

    init() {
        this.setupElements();
        this.bindEvents();
    }

    setupElements() {
        // Reveal on scroll elements
        document.querySelectorAll('[data-reveal]').forEach((el, index) => {
            this.elements.set(el, {
                type: 'reveal',
                delay: parseInt(el.dataset.revealDelay) || index * 100,
                distance: parseInt(el.dataset.revealDistance) || 50,
                duration: parseInt(el.dataset.revealDuration) || 600,
                revealed: false
            });
        });

        // Counter animation elements
        document.querySelectorAll('[data-counter]').forEach(el => {
            this.elements.set(el, {
                type: 'counter',
                target: parseInt(el.dataset.counter) || 0,
                duration: parseInt(el.dataset.counterDuration) || 2000,
                animated: false
            });
        });

        // Typing animation elements
        document.querySelectorAll('[data-typewriter]').forEach(el => {
            this.elements.set(el, {
                type: 'typewriter',
                text: el.dataset.typewriter || el.textContent,
                speed: parseInt(el.dataset.typewriterSpeed) || 100,
                started: false
            });
        });
    }

    checkVisibility() {
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;

        this.elements.forEach((config, element) => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;
            const elementVisible = (elementTop < scrollTop + windowHeight * 0.8) &&
                (elementTop + rect.height > scrollTop);

            if (elementVisible) {
                this.animateElement(element, config);
            }
        });
    }

    animateElement(element, config) {
        switch (config.type) {
            case 'reveal':
                if (!config.revealed) {
                    this.revealElement(element, config);
                }
                break;
            case 'counter':
                if (!config.animated) {
                    this.animateCounter(element, config);
                }
                break;
            case 'typewriter':
                if (!config.started) {
                    this.typewriterEffect(element, config);
                }
                break;
        }
    }

    revealElement(element, config) {
        config.revealed = true;

        setTimeout(() => {
            element.style.transition = `all ${config.duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1)';
            element.classList.add('revealed');
        }, config.delay);
    }

    animateCounter(element, config) {
        config.animated = true;

        const startValue = 0;
        const endValue = config.target;
        const duration = config.duration;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);
            element.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    typewriterEffect(element, config) {
        config.started = true;
        const text = config.text;
        element.textContent = '';

        let index = 0;
        const typeChar = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeChar, config.speed);
            } else {
                element.classList.add('typing-complete');
            }
        };

        typeChar();
    }

    bindEvents() {
        const handleScroll = () => {
            this.scrollY = window.pageYOffset;

            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }

            this.rafId = requestAnimationFrame(() => {
                this.checkVisibility();
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Check visibility on load
        setTimeout(() => this.checkVisibility(), 100);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize smooth scrolling
    const smoothScroll = new SmoothScrollManager({
        duration: 800,
        easing: 'easeInOutCubic',
        offset: 80
    });

    // Initialize advanced scroll effects
    const scrollEffects = new AdvancedScrollEffects();

    // Expose to global scope for external control
    window.smoothScroll = smoothScroll;
    // Alias expected by main.js waitForModule
    window.smoothScrollManager = smoothScroll;
    window.scrollEffects = scrollEffects;

    console.log('🚀 Advanced scroll system initialized');
});

// exports removed for non-module usage