/**
 * APPLICATION CONFIGURATION
 * Central configuration file for the portfolio application
 * @module config
 */

export const CONFIG = {
    // Application metadata
    app: {
        name: 'Chinmoy Kumar Biswas Portfolio',
        version: '2.0.0',
        author: 'Chinmoy Kumar Biswas',
        description: 'Modern portfolio showcasing web development projects and skills',
        keywords: ['portfolio', 'web developer', 'react', 'javascript', 'ui/ux'],
        url: 'https://chinmoy-kumar-biswas.github.io',
        email: 'bangladeshchinmoy@gmail.com'
    },

    // Performance settings
    performance: {
        // Animation settings
        animations: {
            enabled: true,
            respectReducedMotion: true,
            intersectionThreshold: 0.1,
            intersectionRootMargin: '0px 0px -50px 0px',
            animationDelayMs: 16, // ~60fps
            debounceDelayMs: 100
        },

        // Particle system settings
        particles: {
            enabled: true,
            maxParticles: {
                mobile: 12,
                tablet: 18,
                desktop: 22
            },
            colors: [
                'rgba(99, 102, 241,', // indigo
                'rgba(251, 191, 36,', // amber
                'rgba(129, 140, 248,', // indigo-light
                'rgba(165, 243, 252,', // cyan
                'rgba(236, 72, 153,' // pink
            ]
        },

        // Floating icons settings
        floatingIcons: {
            enabled: true,
            maxIcons: {
                mobile: 8,
                tablet: 12,
                desktop: 14
            },
            icons: [
                'fab fa-react',
                'fab fa-node',
                'fas fa-database',
                'fab fa-github',
                'fas fa-cloud',
                'fas fa-bolt',
                'fas fa-lock',
                'fas fa-code',
                'fas fa-mobile-alt',
                'fas fa-cubes'
            ],
            colors: ['#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#22d3ee', '#f472b6']
        },

        // 3D features settings
        threeJS: {
            enabled: true,
            fallbackEnabled: true,
            antialias: true,
            alpha: true,
            maxPixelRatio: 2
        }
    },

    // Theme settings
    theme: {
        default: 'dark',
        respectSystemPreference: true,
        colors: {
            light: {
                primary: '#6366f1',
                secondary: '#8b5cf6',
                accent: '#06b6d4',
                background: '#ffffff',
                surface: '#f8fafc',
                text: '#1f2937',
                textSecondary: '#6b7280',
                border: '#e5e7eb',
                themeColor: '#f0f2f5'
            },
            dark: {
                primary: '#6366f1',
                secondary: '#8b5cf6',
                accent: '#06b6d4',
                background: '#0f172a',
                surface: '#1e293b',
                text: '#f1f5f9',
                textSecondary: '#94a3b8',
                border: '#334155',
                themeColor: '#0f172a'
            }
        }
    },

    // Navigation settings
    navigation: {
        mobileBreakpoint: 768,
        scrollOffset: 150, // Offset for fixed navbar in scroll spy
        smoothScrollDuration: 800,
        scrollToTopThreshold: 300
    },

    // Modal settings
    modals: {
        animationDuration: 300,
        backdropClose: true,
        escapeClose: true,
        bodyScrollLock: true
    },

    // Carousel settings
    carousel: {
        testimonial: {
            autoplay: true,
            interval: 5000,
            pauseOnHover: true,
            showDots: true,
            showArrows: true,
            infinite: true
        }
    },

    // Form validation settings
    forms: {
        contact: {
            validateOnInput: true,
            validateOnBlur: true,
            showCharacterCount: true,
            rules: {
                name: {
                    required: true,
                    maxLength: 100,
                    sanitize: true
                },
                email: {
                    required: true,
                    email: true,
                    sanitize: false
                },
                subject: {
                    required: true,
                    maxLength: 200,
                    sanitize: true
                },
                message: {
                    required: true,
                    maxLength: 2000,
                    sanitize: true
                }
            }
        }
    },

    // Social links
    social: {
        github: 'https://github.com/Chinmoy-Kumar-Biswas',
        linkedin: 'https://linkedin.com/in/chinmoy-kumar-biswas',
        twitter: 'https://twitter.com/chinmoybiswas',
        email: 'mailto:bangladeshchinmoy@gmail.com',
        resume: '#' // Update with actual resume link
    },

    // Project categories for filtering
    projectCategories: [
        { id: 'all', label: 'All Projects' },
        { id: 'react', label: 'React' },
        { id: 'vue', label: 'Vue.js' },
        { id: 'node', label: 'Node.js' },
        { id: 'python', label: 'Python' },
        { id: 'ui-ux', label: 'UI/UX' },
        { id: 'mobile', label: 'Mobile' }
    ],

    // Skills data
    skills: {
        frontend: [
            { name: 'React', level: 90, color: '#61DAFB' },
            { name: 'Vue.js', level: 85, color: '#4FC08D' },
            { name: 'JavaScript', level: 95, color: '#F7DF1E' },
            { name: 'TypeScript', level: 80, color: '#3178C6' },
            { name: 'HTML5', level: 95, color: '#E34F26' },
            { name: 'CSS3', level: 90, color: '#1572B6' },
            { name: 'Tailwind CSS', level: 88, color: '#38B2AC' },
            { name: 'SASS/SCSS', level: 85, color: '#CC6699' }
        ],
        backend: [
            { name: 'Node.js', level: 88, color: '#68A063' },
            { name: 'Express.js', level: 85, color: '#000000' },
            { name: 'Python', level: 82, color: '#3776AB' },
            { name: 'MongoDB', level: 80, color: '#47A248' },
            { name: 'PostgreSQL', level: 75, color: '#336791' },
            { name: 'Firebase', level: 85, color: '#FFCA28' },
            { name: 'GraphQL', level: 70, color: '#E10098' },
            { name: 'REST APIs', level: 90, color: '#FF6B35' }
        ],
        tools: [
            { name: 'Git', level: 90, color: '#F05032' },
            { name: 'Docker', level: 70, color: '#2496ED' },
            { name: 'Webpack', level: 75, color: '#8DD6F9' },
            { name: 'Vite', level: 85, color: '#646CFF' },
            { name: 'Jest', level: 80, color: '#C21325' },
            { name: 'Figma', level: 85, color: '#F24E1E' },
            { name: 'VS Code', level: 95, color: '#007ACC' },
            { name: 'Chrome DevTools', level: 90, color: '#4285F4' }
        ]
    },

    // Testimonials data
    testimonials: [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Product Manager',
            company: 'Tech Innovations Inc.',
            image: 'https://placehold.co/80x80/6366f1/ffffff?text=SJ',
            content: 'Chinmoy delivered exceptional work on our e-commerce platform. His attention to detail and technical expertise made the project a huge success.',
            rating: 5
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'CTO',
            company: 'StartupXYZ',
            image: 'https://placehold.co/80x80/8b5cf6/ffffff?text=MC',
            content: 'Working with Chinmoy was a pleasure. He understood our requirements perfectly and delivered a scalable solution that exceeded our expectations.',
            rating: 5
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            role: 'Design Lead',
            company: 'Creative Agency',
            image: 'https://placehold.co/80x80/06b6d4/ffffff?text=ER',
            content: 'Chinmoy\'s ability to translate designs into pixel-perfect code is remarkable. He\'s a developer who truly understands both design and development.',
            rating: 5
        }
    ],

    // SEO settings
    seo: {
        defaultTitle: 'Chinmoy Kumar Biswas - Full Stack Developer & UI/UX Designer',
        titleTemplate: '%s | Chinmoy Kumar Biswas',
        defaultDescription: 'Experienced Full Stack Developer specializing in React, Node.js, and modern web technologies. Creating beautiful, functional, and user-centric digital experiences.',
        siteUrl: 'https://chinmoy-kumar-biswas.github.io',
        twitterUsername: '@chinmoybiswas',
        defaultImage: '/images/chinmoy.png',
        favicon: '/favicon.ico'
    },

    // Analytics settings
    analytics: {
        googleAnalytics: {
            enabled: false, // Set to true when you have GA tracking ID
            trackingId: 'GA_MEASUREMENT_ID' // Replace with actual ID
        },
        tracking: {
            pageViews: true,
            events: true,
            performance: true
        }
    },

    // PWA settings
    pwa: {
        enabled: true,
        name: 'Chinmoy Kumar Biswas',
        shortName: 'CKB Portfolio',
        description: 'Portfolio of Chinmoy Kumar Biswas - Full Stack Developer',
        themeColor: '#6366f1',
        backgroundColor: '#0f172a',
        display: 'standalone',
        orientation: 'portrait-primary',
        startUrl: '/',
        scope: '/',
        manifestPath: '/manifest.json',
        serviceWorkerPath: '/sw.js',
        iconPath: '/images/chinmoy.png'
    },

    // Development settings
    development: {
        debug: false, // Set to true for debug mode
        showPerformanceMetrics: false,
        logLevel: 'info', // 'debug', 'info', 'warn', 'error'
        hotReload: false
    },

    // Feature flags
    features: {
        threeJSSkills: true,
        particleSystem: true,
        floatingIcons: true,
        testimonialCarousel: true,
        projectFiltering: true,
        contactForm: true,
        themeToggle: true,
        scrollAnimations: true,
        lazyLoading: true,
        serviceWorker: true
    },

    // API endpoints (if needed)
    api: {
        baseUrl: process.env.NODE_ENV === 'production'
            ? 'https://api.chinmoy-kumar-biswas.com'
            : 'http://localhost:3000',
        endpoints: {
            contact: '/api/contact',
            projects: '/api/projects',
            skills: '/api/skills'
        }
    },

    // Error handling
    errorHandling: {
        showUserFriendlyMessages: true,
        logErrors: true,
        fallbackEnabled: true,
        retryAttempts: 3,
        retryDelay: 1000
    }
};

// Helper functions to get configuration values
export const getConfig = (path, defaultValue = null) => {
    return path.split('.').reduce((obj, key) => obj?.[key], CONFIG) ?? defaultValue;
};

export const isFeatureEnabled = (feature) => {
    return getConfig(`features.${feature}`, false);
};

export const getThemeColor = (theme = 'dark', colorKey = 'primary') => {
    return getConfig(`theme.colors.${theme}.${colorKey}`, '#6366f1');
};

export const getPerformanceSetting = (setting) => {
    return getConfig(`performance.${setting}`);
};

export const getDeviceLimits = (feature, device = 'desktop') => {
    return getConfig(`performance.${feature}.max${feature.charAt(0).toUpperCase() + feature.slice(1)}.${device}`, 10);
};

// Export individual sections for easier imports
export const {
    app,
    performance,
    theme,
    navigation,
    modals,
    carousel,
    forms,
    social,
    projectCategories,
    skills,
    testimonials,
    seo,
    analytics,
    pwa,
    development,
    features,
    api,
    errorHandling
} = CONFIG;

export default CONFIG;