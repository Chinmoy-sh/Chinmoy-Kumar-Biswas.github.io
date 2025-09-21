/**
 * ===============================================
 * CONTENT MANAGEMENT SYSTEM
 * Professional Portfolio by Chinmoy Kumar Biswas
 * Version: 2.0.0
 * ===============================================
 */

class ContentManager {
    constructor(options = {}) {
        this.config = {
            dataSource: './data/portfolio-data.json',
            cacheTime: 5 * 60 * 1000, // 5 minutes
            lazy: true,
            animations: true,
            fallbackData: null,
            ...options
        };

        this.data = null;
        this.isLoaded = false;
        this.loadPromise = null;
        this.observers = [];

        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.populateContent();
            this.setupDynamicFeatures();

            console.log('📄 Content management system initialized');
        } catch (error) {
            console.error('❌ Failed to initialize content manager:', error);
            this.handleLoadError(error);
        }
    }

    async loadData() {
        // Return existing promise if already loading
        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = this.fetchData();
        return this.loadPromise;
    }

    async fetchData() {
        try {
            const cachedData = this.getCachedData();
            if (cachedData) {
                this.data = cachedData;
                this.isLoaded = true;
                return cachedData;
            }

            const response = await fetch(this.config.dataSource);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.data = data;
            this.isLoaded = true;

            // Cache the data
            this.setCachedData(data);

            return data;

        } catch (error) {
            console.warn('Failed to load remote data, using fallback:', error);

            if (this.config.fallbackData) {
                this.data = this.config.fallbackData;
                this.isLoaded = true;
                return this.data;
            }

            throw error;
        }
    }

    getCachedData() {
        try {
            const cached = localStorage.getItem('portfolio-data');
            const cacheTime = localStorage.getItem('portfolio-data-time');

            if (cached && cacheTime) {
                const age = Date.now() - parseInt(cacheTime);
                if (age < this.config.cacheTime) {
                    return JSON.parse(cached);
                }
            }
        } catch (error) {
            console.warn('Failed to get cached data:', error);
        }

        return null;
    }

    setCachedData(data) {
        try {
            localStorage.setItem('portfolio-data', JSON.stringify(data));
            localStorage.setItem('portfolio-data-time', Date.now().toString());
        } catch (error) {
            console.warn('Failed to cache data:', error);
        }
    }

    handleLoadError(error) {
        // Create fallback content
        this.createFallbackContent();
        console.warn('Using fallback content due to load error:', error);
    }

    createFallbackContent() {
        // Basic fallback data structure
        this.data = {
            personal: {
                name: 'Chinmoy Kumar Biswas',
                title: 'Full Stack Developer',
                description: 'Passionate developer creating amazing web experiences.'
            },
            skills: { technical: [], soft: [] },
            projects: [],
            experience: [],
            services: [],
            contact: { formFields: [] }
        };
        this.isLoaded = true;
    }

    async populateContent() {
        if (!this.data) {
            await this.loadData();
        }

        // Populate different sections
        this.populateHeroSection();
        this.populateAboutSection();
        this.populateSkillsSection();
        this.populateProjectsSection();
        this.populateExperienceSection();
        this.populateServicesSection();
        this.populateTestimonialsSection();
        this.populateContactSection();

        // Update meta information
        this.updateMetaInformation();

        console.log('📄 Content populated successfully');
    }

    populateHeroSection() {
        const hero = document.querySelector('#home') || document.querySelector('#hero');
        if (!hero || !this.data.personal) return;

        const { name, title, tagline, description } = this.data.personal;

        // Update hero content
        const heroTitle = hero.querySelector('.hero-title');
        const heroNameEl = document.getElementById('hero-name');
        const heroSubtitle = hero.querySelector('.hero-subtitle') || document.getElementById('hero-title');
        const heroDescription = hero.querySelector('.hero-description') || document.getElementById('hero-tagline');
        const heroTagline = hero.querySelector('.hero-tagline') || document.getElementById('hero-tagline');

        if (heroNameEl) {
            heroNameEl.textContent = name;
        } else if (heroTitle) {
            heroTitle.textContent = name;
        }
        if (heroSubtitle) heroSubtitle.textContent = title;
        if (heroTagline) heroTagline.textContent = tagline;
        if (heroDescription) heroDescription.textContent = description;

        // Update social media links
        this.updateSocialMediaLinks();
    }

    updateSocialMediaLinks() {
        const socialContainer = document.querySelector('#hero-social') || document.querySelector('.social-links');
        if (!socialContainer || !this.data.personal.socialMedia) return;

        socialContainer.innerHTML = '';
        if (!socialContainer.classList.contains('social-links')) {
            socialContainer.classList.add('social-links');
        }

        Object.entries(this.data.personal.socialMedia).forEach(([platform, info]) => {
            const link = document.createElement('a');
            link.href = info.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = `social-link ${platform}`;
            link.setAttribute('aria-label', info.label);
            link.innerHTML = `<i class="${info.icon}"></i>`;

            socialContainer.appendChild(link);
        });
    }

    populateAboutSection() {
        const aboutSection = document.querySelector('#about');
        if (!aboutSection || !this.data.about) return;

        const aboutContent = aboutSection.querySelector('.about-content');
        if (!aboutContent) return;

        aboutContent.innerHTML = `
            <div class="about-text">
                <p class="about-intro">${this.data.about.introduction}</p>
                
                <div class="about-highlights">
                    <h3>What I Bring to the Table</h3>
                    <ul class="highlights-list">
                        ${this.data.about.highlights.map(highlight =>
            `<li>${highlight}</li>`
        ).join('')}
                    </ul>
                </div>
                
                <div class="about-philosophy">
                    <blockquote>
                        <p>${this.data.about.philosophy}</p>
                    </blockquote>
                </div>
                
                <div class="about-interests">
                    <h4>When I'm not coding</h4>
                    <div class="interests-grid">
                        ${this.data.about.personalInterests.map(interest =>
            `<span class="interest-tag">${interest}</span>`
        ).join('')}
                    </div>
                </div>
                
                <div class="fun-facts">
                    <h4>Fun Facts</h4>
                    <div class="facts-grid">
                        ${this.data.about.funFacts.map(fact =>
            `<div class="fact-item">${fact}</div>`
        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    populateSkillsSection() {
        const skillsSection = document.querySelector('#skills');
        if (!skillsSection || !this.data.skills) return;

        const skillsContainer = skillsSection.querySelector('.skills-container') || document.getElementById('skills-grid');
        if (!skillsContainer) return;

        // Flatten technical skills into card grid
        const skillCards = this.data.skills.technical
            .flatMap(category => category.skills.map(skill => ({ ...skill, category: category.category })))
            .map(skill => `
                <div class="skill-card" data-skill="${(skill.name || '').toLowerCase()}">
                    <div class="skill-icon" style="background: linear-gradient(135deg, ${skill.color}33, ${skill.color}66); color: #fff;">
                        <i class="${skill.icon}"></i>
                    </div>
                    <div class="skill-title">${skill.name}</div>
                    <div class="skill-description">${skill.category}</div>
                    <div class="skill-progress">
                        <div class="skill-progress-bar" data-level="${skill.level}" style="width: 0%;"></div>
                    </div>
                </div>
            `)
            .join('');

        skillsContainer.innerHTML = skillCards;

        // Animate skill bars when they come into view
        this.animateSkillBars();
    }

    populateProjectsSection() {
        const projectsSection = document.querySelector('#projects');
        if (!projectsSection || !this.data.projects) return;

        const projectsContainer = projectsSection.querySelector('.projects-container') || document.getElementById('projects-grid');
        if (!projectsContainer) return;

        // Create filter buttons
        const categories = [...new Set(this.data.projects.map(project => project.category))];
        const filterHtml = `
            <div class="projects-filters">
                <button class="filter-btn active" data-filter="all">All Projects</button>
                ${categories.map(category => `
                    <button class="filter-btn" data-filter="${category.toLowerCase().replace(/\s+/g, '-')}">${category}</button>
                `).join('')}
            </div>
        `;

        // Create projects grid using CSS-aligned classes
        const projectsHtml = `
            <div class="projects-grid">
                ${this.data.projects.map(project => `
                    <article class="project-card ${project.featured ? 'card-featured' : ''}" data-category="${project.category.toLowerCase().replace(/\s+/g, '-')}" data-project-id="${project.id}">
                        <div class="project-card-image">
                            <img src="${project.thumbnail}" alt="${project.title}" loading="lazy">
                            <div class="project-card-overlay">
                                <div class="project-card-actions">
                                    ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="btn btn-primary" aria-label="View Live"><i class="fas fa-external-link-alt"></i></a>` : ''}
                                    <a href="${project.githubUrl}" target="_blank" class="btn btn-secondary" aria-label="View Code"><i class="fab fa-github"></i></a>
                                    <button class="btn btn-outline project-details-btn" aria-label="View Details"><i class="fas fa-info-circle"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="project-card-content">
                            <div class="project-meta">
                                <span class="project-category">${project.category}</span>
                                <span class="project-status status-${project.status.toLowerCase()}">${project.status}</span>
                            </div>
                            <h3 class="project-card-title">${project.title}</h3>
                            <p class="project-card-description">${project.description}</p>
                            <div class="project-card-tags">
                                ${project.technologies.slice(0, 5).map(tech => `<span class="project-tag">${tech}</span>`).join('')}
                                ${project.technologies.length > 5 ? `<span class="project-tag">+${project.technologies.length - 5}</span>` : ''}
                            </div>
                        </div>
                    </article>
                `).join('')}
            </div>
        `;

        projectsContainer.innerHTML = filterHtml + projectsHtml;

        // Setup project filtering
        this.setupProjectFiltering();

        // Setup project modals
        this.setupProjectModals();
    }

    populateExperienceSection() {
        const experienceSection = document.querySelector('#experience');
        if (!experienceSection || !this.data.experience) return;

        const timelineContainer = experienceSection.querySelector('.timeline-container') || document.getElementById('experience-timeline');
        if (!timelineContainer) return;

        timelineContainer.innerHTML = `
            <div class="timeline">
                ${this.data.experience.map((exp, index) => `
                    <div class="timeline-item ${index % 2 === 0 ? 'left' : 'right'}">
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <div class="company-info">
                                    <img src="${exp.logo}" alt="${exp.company}" class="company-logo" loading="lazy">
                                    <div class="position-info">
                                        <h3>${exp.position}</h3>
                                        <h4>${exp.company}</h4>
                                        <div class="timeline-meta">
                                            <span class="duration">${exp.duration}</span>
                                            <span class="location">${exp.location}</span>
                                            <span class="type">${exp.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="timeline-date">
                                    ${exp.endDate === 'Present' ?
                `${this.formatDate(exp.startDate)} - Present` :
                `${this.formatDate(exp.startDate)} - ${this.formatDate(exp.endDate)}`
            }
                                </div>
                            </div>
                            
                            <div class="timeline-body">
                                <p class="experience-description">${exp.description}</p>
                                
                                <div class="achievements">
                                    <h5>Key Achievements</h5>
                                    <ul>
                                        ${exp.achievements.map(achievement =>
                `<li>${achievement}</li>`
            ).join('')}
                                    </ul>
                                </div>
                                
                                <div class="technologies">
                                    <h5>Technologies Used</h5>
                                    <div class="tech-tags">
                                        ${exp.technologies.map(tech =>
                `<span class="tech-tag">${tech}</span>`
            ).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="timeline-marker"></div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    populateServicesSection() {
        const servicesSection = document.querySelector('#services');
        if (!servicesSection || !this.data.services) return;

        const servicesContainer = servicesSection.querySelector('.services-container');
        if (!servicesContainer) return;

        servicesContainer.innerHTML = `
            <div class="services-grid">
                ${this.data.services.map(service => `
                    <div class="service-card">
                        <div class="service-icon">
                            <i class="${service.icon}"></i>
                        </div>
                        <h3 class="service-title">${service.title}</h3>
                        <p class="service-description">${service.description}</p>
                        
                        <div class="service-features">
                            <h4>What's Included</h4>
                            <ul>
                                ${service.features.map(feature =>
            `<li>${feature}</li>`
        ).join('')}
                            </ul>
                        </div>
                        
                        <div class="service-tech">
                            <h4>Technologies</h4>
                            <div class="tech-tags">
                                ${service.technologies.map(tech =>
            `<span class="tech-tag">${tech}</span>`
        ).join('')}
                            </div>
                        </div>
                        
                        <div class="service-pricing">
                            <span class="price">Starting at ${service.startingPrice}</span>
                            <button class="btn btn-primary service-inquiry-btn" data-service="${service.title}">
                                Get Quote
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Setup service inquiry handlers
        this.setupServiceInquiries();
    }

    populateTestimonialsSection() {
        const testimonialsSection = document.querySelector('#testimonials');
        if (!testimonialsSection || !this.data.testimonials) return;

        const testimonialsContainer = testimonialsSection.querySelector('.testimonials-container');
        if (!testimonialsContainer) return;

        testimonialsContainer.innerHTML = `
            <div class="testimonials-slider">
                ${this.data.testimonials.map(testimonial => `
                    <div class="testimonial-item">
                        <div class="testimonial-content">
                            <div class="testimonial-rating">
                                ${Array.from({ length: testimonial.rating }, () => '<i class="fas fa-star"></i>').join('')}
                            </div>
                            <blockquote>
                                <p>"${testimonial.text}"</p>
                            </blockquote>
                        </div>
                        <div class="testimonial-author">
                            <img src="${testimonial.image}" alt="${testimonial.name}" class="author-image" loading="lazy">
                            <div class="author-info">
                                <h4>${testimonial.name}</h4>
                                <p>${testimonial.position} at ${testimonial.company}</p>
                                <span class="project-type">${testimonial.projectType}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Setup testimonials slider
        this.setupTestimonialsSlider();
    }

    populateContactSection() {
        const contactSection = document.querySelector('#contact');
        if (!contactSection || !this.data.contact) return;

        const contactForm = contactSection.querySelector('#contact-form') || document.getElementById('contact-form');
        if (!contactForm) return;

        // Generate form fields
        const formFields = this.data.contact.formFields.map(field => {
            switch (field.type) {
                case 'textarea':
                    return `
                        <div class="form-field">
                            <label for="${field.name}">${field.label} ${field.required ? '*' : ''}</label>
                            <textarea 
                                id="${field.name}" 
                                name="${field.name}" 
                                placeholder="${field.placeholder}" 
                                ${field.required ? 'required' : ''}
                                ${field.validation ? `data-rules="${field.validation}"` : ''}
                                rows="${field.rows || 4}"
                            ></textarea>
                        </div>
                    `;

                case 'select':
                    return `
                        <div class="form-field">
                            <label for="${field.name}">${field.label} ${field.required ? '*' : ''}</label>
                            <select 
                                id="${field.name}" 
                                name="${field.name}" 
                                ${field.required ? 'required' : ''}
                            >
                                ${field.options.map(option =>
                        `<option value="${option.value}">${option.text}</option>`
                    ).join('')}
                            </select>
                        </div>
                    `;

                default:
                    return `
                        <div class="form-field">
                            <label for="${field.name}">${field.label} ${field.required ? '*' : ''}</label>
                            <input 
                                type="${field.type}" 
                                id="${field.name}" 
                                name="${field.name}" 
                                placeholder="${field.placeholder}" 
                                ${field.required ? 'required' : ''}
                                ${field.validation ? `data-rules="${field.validation}"` : ''}
                            >
                        </div>
                    `;
            }
        }).join('');

        contactForm.innerHTML = `
            ${formFields}
            <div class="form-field">
                <button type="submit" class="btn btn-primary btn-large">
                    <i class="fas fa-paper-plane"></i>
                    Send Message
                </button>
            </div>
        `;

        // Update contact info
        this.updateContactInfo();
    }

    updateContactInfo() {
        const contactInfo = document.querySelector('#contact-info') || document.querySelector('.contact-info');
        if (!contactInfo || !this.data.contact) return;

        const { availability, responseTime, timezone, workingHours } = this.data.contact;

        contactInfo.innerHTML = `
            <div class="contact-item">
                <i class="fas fa-clock"></i>
                <div class="contact-details">
                    <h4>Availability</h4>
                    <p>${availability}</p>
                </div>
            </div>
            <div class="contact-item">
                <i class="fas fa-reply"></i>
                <div class="contact-details">
                    <h4>Response Time</h4>
                    <p>${responseTime}</p>
                </div>
            </div>
            <div class="contact-item">
                <i class="fas fa-globe"></i>
                <div class="contact-details">
                    <h4>Timezone</h4>
                    <p>${timezone}</p>
                </div>
            </div>
            <div class="contact-item">
                <i class="fas fa-business-time"></i>
                <div class="contact-details">
                    <h4>Working Hours</h4>
                    <p>${workingHours}</p>
                </div>
            </div>
        `;
    }

    updateMetaInformation() {
        if (!this.data.personal) return;

        // Update document title
        document.title = `${this.data.personal.name} - ${this.data.personal.title}`;

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = this.data.personal.description;
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');

        if (ogTitle) ogTitle.content = `${this.data.personal.name} - ${this.data.personal.title}`;
        if (ogDescription) ogDescription.content = this.data.personal.description;
    }

    setupDynamicFeatures() {
        this.setupLazyLoading();
        this.setupIntersectionObserver();
        this.setupDynamicAnimations();
    }

    setupProjectFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter projects
                projectCards.forEach(card => {
                    const category = card.dataset.category;
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.classList.add('filtered-in');
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('filtered-in');
                    }
                });
            });
        });
    }

    setupProjectModals() {
        const detailsBtns = document.querySelectorAll('.project-details-btn');

        detailsBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.project-card');
                const projectId = parseInt(card.dataset.projectId);
                this.showProjectModal(projectId);
            });
        });
    }

    showProjectModal(projectId) {
        const project = this.data.projects.find(p => p.id === projectId);
        if (!project) return;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${project.title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="project-images">
                        ${project.images.map(img =>
            `<img src="${img}" alt="${project.title}" loading="lazy">`
        ).join('')}
                    </div>
                    <div class="project-details">
                        <p class="project-long-description">${project.longDescription}</p>
                        
                        <div class="project-features">
                            <h4>Key Features</h4>
                            <ul>
                                ${project.features.map(feature =>
            `<li>${feature}</li>`
        ).join('')}
                            </ul>
                        </div>
                        
                        <div class="project-tech-stack">
                            <h4>Technology Stack</h4>
                            <div class="tech-tags">
                                ${project.technologies.map(tech =>
            `<span class="tech-tag">${tech}</span>`
        ).join('')}
                            </div>
                        </div>
                        
                        <div class="project-actions">
                            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="btn btn-primary">View Live</a>` : ''}
                            <a href="${project.githubUrl}" target="_blank" class="btn btn-secondary">View Code</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(modal);

        // Setup close functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Show modal
        setTimeout(() => modal.classList.add('show'), 10);
    }

    setupServiceInquiries() {
        const inquiryBtns = document.querySelectorAll('.service-inquiry-btn');

        inquiryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const service = btn.dataset.service;
                const contactForm = document.querySelector('#contact-form');
                const subjectField = contactForm?.querySelector('[name="subject"]');
                const messageField = contactForm?.querySelector('[name="message"]');

                if (subjectField) {
                    subjectField.value = `Inquiry about ${service}`;
                }

                if (messageField) {
                    messageField.value = `Hi, I'm interested in your ${service} service. Could you please provide more information about...`;
                }

                // Scroll to contact form
                contactForm?.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    setupTestimonialsSlider() {
        // Basic slider implementation
        const slider = document.querySelector('.testimonials-slider');
        const items = slider?.querySelectorAll('.testimonial-item');

        if (!items || items.length <= 1) return;

        let currentIndex = 0;
        const totalItems = items.length;

        // Auto-rotate testimonials
        setInterval(() => {
            items[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % totalItems;
            items[currentIndex].classList.add('active');
        }, 5000);

        // Show first item
        items[0]?.classList.add('active');
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress-bar, .skill-fill, .soft-skill-fill');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    bar.classList.add('animate');
                    const target = parseInt(bar.getAttribute('data-level'));
                    if (!isNaN(target)) {
                        bar.style.width = `${target}%`;
                    }
                }
            });
        });

        skillBars.forEach(bar => observer.observe(bar));
    }

    setupLazyLoading() {
        // Enhanced lazy loading for images
        const images = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    setupIntersectionObserver() {
        // Setup reveal animations for sections and revealable elements
        const sections = document.querySelectorAll('section');
        const revealables = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => sectionObserver.observe(section));
        revealables.forEach(el => sectionObserver.observe(el));
    }

    setupDynamicAnimations() {
        // Counter animations for statistics
        const counters = document.querySelectorAll('[data-counter]');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.counter);
                    this.animateCounter(counter, 0, target);
                    counterObserver.unobserve(counter);
                }
            });
        });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element, start, end, duration = 2000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    }

    // Public API methods
    async getData() {
        if (!this.isLoaded) {
            await this.loadData();
        }
        return this.data;
    }

    async refreshData() {
        this.loadPromise = null;
        this.isLoaded = false;
        localStorage.removeItem('portfolio-data');
        localStorage.removeItem('portfolio-data-time');

        await this.loadData();
        this.populateContent();
    }

    subscribe(callback) {
        this.observers.push(callback);
    }

    unsubscribe(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }

    notify(event, data) {
        this.observers.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Content observer error:', error);
            }
        });
    }
}

// Initialize content manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const contentManager = new ContentManager({
        dataSource: './data/portfolio-data.json',
        cacheTime: 5 * 60 * 1000,
        lazy: true,
        animations: true
    });

    window.contentManager = contentManager;
    console.log('📄 Content management system ready');
});