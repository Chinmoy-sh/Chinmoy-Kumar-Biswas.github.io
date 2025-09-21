/*
===============================================
DATA LOADER - DYNAMIC CONTENT POPULATION
===============================================
*/

// Global data object
let portfolioData = {};

// Initialize data loading
document.addEventListener('DOMContentLoaded', function () {
    loadPortfolioData();
});

/*
===============================================
DATA LOADING
===============================================
*/
async function loadPortfolioData() {
    try {
        const response = await fetch('./assets/data/content.json');
        portfolioData = await response.json();

        // Populate all sections
        populateHeroSection();
        populateAboutSection();
        populateSkillsSection();
        populateProjectsSection();
        populateExperienceSection();
        populateTestimonialsSection();
        populateCommunitySection();
        populateResourcesSection();
        populateContactSection();
        updateSEOMetadata();

        console.log('Portfolio data loaded successfully');
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        // Fallback to existing static content
    }
}

/*
===============================================
SECTION POPULATORS
===============================================
*/

function populateHeroSection() {
    const data = portfolioData.hero;
    if (!data) return;

    // Update hero content
    updateElement('.hero-greeting', data.greeting);
    updateElement('.hero-title', data.name);
    updateElement('.hero-subtitle', data.titles?.[0] || '');
    updateElement('.hero-description', data.description);

    // Update buttons
    const primaryBtn = document.querySelector('.hero-actions .btn-primary');
    const secondaryBtn = document.querySelector('.hero-actions .btn-outline');
    if (primaryBtn) primaryBtn.textContent = data.cta?.primary || 'View My Work';
    if (secondaryBtn) secondaryBtn.textContent = data.cta?.secondary || 'Get In Touch';

    // Update stats
    const stats = data.stats || [];
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        if (stats[index]) {
            const number = item.querySelector('.stat-number');
            const label = item.querySelector('.stat-label');
            if (number) number.textContent = stats[index].number;
            if (label) label.textContent = stats[index].label;
        }
    });

    // Setup typing animation with dynamic titles
    if (data.titles && data.titles.length > 0) {
        setupDynamicTyping(data.titles);
    }
}

function populateAboutSection() {
    const data = portfolioData.about;
    if (!data) return;

    // Update content
    updateElement('#about .section-title', data.title);
    updateElement('#about .section-subtitle', data.subtitle);
    updateElement('.about-text', data.description);

    // Update image
    const aboutImage = document.querySelector('.about-image img');
    if (aboutImage && data.image) {
        aboutImage.src = data.image;
        aboutImage.alt = data.title;
    }

    // Update highlights
    const highlights = data.highlights || [];
    const highlightItems = document.querySelectorAll('.highlight-item');
    highlightItems.forEach((item, index) => {
        if (highlights[index]) {
            const icon = item.querySelector('.highlight-icon');
            const text = item.querySelector('.highlight-text');
            if (icon) icon.textContent = highlights[index].icon;
            if (text) text.textContent = highlights[index].text;
        }
    });
}

function populateSkillsSection() {
    const data = portfolioData.skills;
    if (!data) return;

    // Update section headers
    updateElement('#skills .section-title', data.title);
    updateElement('#skills .section-subtitle', data.subtitle);
    updateElement('.skills-content p', data.description);

    // Populate skill categories
    const categoriesContainer = document.querySelector('.skill-categories');
    if (categoriesContainer && data.categories) {
        categoriesContainer.innerHTML = data.categories.map(category => `
            <div class="skill-category">
                <h4>${category.name}</h4>
                <div class="skill-list">
                    ${category.skills?.map(skill => `
                        <span class="skill-tag" data-skill="${skill.name}">${skill.name}</span>
                    `).join('') || ''}
                </div>
            </div>
        `).join('');
    }

    // Populate skill bars
    const skillsVisual = document.querySelector('.skills-visual');
    if (skillsVisual && data.categories) {
        const allSkills = data.categories.flatMap(cat => cat.skills || []).slice(0, 8); // Show top 8 skills
        skillsVisual.innerHTML = allSkills.map(skill => `
            <div class="skill-item">
                <div class="skill-header">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-level">${skill.level}</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-progress ${skill.level}" data-level="${skill.level}"></div>
                </div>
            </div>
        `).join('');
    }
}

function populateProjectsSection() {
    const data = portfolioData.projects;
    if (!data) return;

    // Update section headers
    updateElement('#projects .section-title', data.title);
    updateElement('#projects .section-subtitle', data.subtitle);
    updateElement('#projects .section-text', data.description);

    // Populate filters
    const filtersContainer = document.querySelector('.projects-filters');
    if (filtersContainer && data.filters) {
        filtersContainer.innerHTML = data.filters.map(filter => `
            <button class="filter-btn ${filter.id === 'all' ? 'active' : ''}" data-filter="${filter.id}">
                ${filter.name}
            </button>
        `).join('');
    }

    // Populate projects
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid && data.items) {
        projectsGrid.innerHTML = data.items.map(project => `
            <div class="project-card card animate-on-scroll" data-category="${project.category}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                    <div class="project-overlay">
                        <a href="${project.liveUrl}" class="project-link" target="_blank" aria-label="View Live Project">
                            <i class="icon-external-link"></i>
                        </a>
                        <a href="${project.githubUrl}" class="project-link" target="_blank" aria-label="View Source Code">
                            <i class="icon-github"></i>
                        </a>
                    </div>
                </div>
                <div class="project-content">
                    <div class="project-category">${project.category}</div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function populateExperienceSection() {
    const data = portfolioData.experience;
    if (!data) return;

    // Update section headers
    updateElement('#experience .section-title', data.title);
    updateElement('#experience .section-subtitle', data.subtitle);
    updateElement('#experience .section-text', data.description);

    // Populate timeline
    const timeline = document.querySelector('.timeline');
    if (timeline && data.items) {
        timeline.innerHTML = data.items.map((item, index) => `
            <div class="timeline-item animate-on-scroll">
                <div class="timeline-content">
                    <div class="timeline-date">${item.period}</div>
                    <h3 class="timeline-title">${item.title}</h3>
                    <div class="timeline-company">${item.company} - ${item.location}</div>
                    <p class="timeline-description">${item.description}</p>
                    <div class="timeline-skills">
                        ${item.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                <div class="timeline-marker"></div>
            </div>
        `).join('');
    }
}

function populateTestimonialsSection() {
    const data = portfolioData.testimonials;
    if (!data) return;

    // Update section headers
    updateElement('#testimonials .section-title', data.title);
    updateElement('#testimonials .section-subtitle', data.subtitle);

    // Create testimonials slider
    const testimonialsContainer = document.querySelector('.testimonials-container');
    if (testimonialsContainer && data.items) {
        testimonialsContainer.innerHTML = `
            <div class="testimonials-slider">
                ${data.items.map(testimonial => `
                    <div class="testimonial-card card">
                        <div class="testimonial-content">
                            <div class="rating">
                                ${Array(testimonial.rating).fill('⭐').join('')}
                            </div>
                            <p class="testimonial-text">"${testimonial.text}"</p>
                        </div>
                        <div class="testimonial-author">
                            <img src="${testimonial.image}" alt="${testimonial.name}" loading="lazy">
                            <div class="author-info">
                                <h4>${testimonial.name}</h4>
                                <p>${testimonial.position} at ${testimonial.company}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function populateCommunitySection() {
    const data = portfolioData.community;
    if (!data) return;

    // Update section headers
    updateElement('#community .section-title', data.title);
    updateElement('#community .section-subtitle', data.subtitle);
    updateElement('#community .section-text', data.description);

    // Populate contributions
    const contributionsGrid = document.querySelector('.contributions-grid');
    if (contributionsGrid && data.contributions) {
        contributionsGrid.innerHTML = data.contributions.map(contribution => `
            <div class="contribution-card card animate-on-scroll">
                <div class="contribution-icon">${contribution.icon}</div>
                <div class="contribution-content">
                    <div class="contribution-type">${contribution.type}</div>
                    <h3 class="contribution-title">${contribution.title}</h3>
                    <p class="contribution-description">${contribution.description}</p>
                    <a href="${contribution.url}" class="contribution-link" target="_blank">Learn More</a>
                </div>
            </div>
        `).join('');
    }

    // Populate community stats
    const communityStats = document.querySelector('.community-stats');
    if (communityStats && data.stats) {
        communityStats.innerHTML = data.stats.map(stat => `
            <div class="stat-item">
                <span class="stat-number">${stat.number}</span>
                <span class="stat-label">${stat.label}</span>
            </div>
        `).join('');
    }
}

function populateResourcesSection() {
    const data = portfolioData.resources;
    if (!data) return;

    // Update section headers
    updateElement('#resources .section-title', data.title);
    updateElement('#resources .section-subtitle', data.subtitle);
    updateElement('#resources .section-text', data.description);

    // Populate resource categories
    const resourcesGrid = document.querySelector('.resources-grid');
    if (resourcesGrid && data.categories) {
        resourcesGrid.innerHTML = data.categories.map(category => `
            <div class="resource-category animate-on-scroll">
                <h3>${category.name}</h3>
                <div class="resource-list">
                    ${category.items.map(item => `
                        <div class="resource-item">
                            <a href="${item.url}" target="_blank" class="resource-link">
                                <h4>${item.name}</h4>
                                <p>${item.description}</p>
                                <span class="resource-type">${item.type}</span>
                            </a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
}

function populateContactSection() {
    const data = portfolioData.contact;
    if (!data) return;

    // Update section headers
    updateElement('#contact .section-title', data.title);
    updateElement('#contact .section-subtitle', data.subtitle);
    updateElement('.contact-info p', data.description);

    // Populate contact methods
    const contactMethods = document.querySelector('.contact-methods');
    if (contactMethods && data.methods) {
        contactMethods.innerHTML = data.methods.map(method => `
            <div class="contact-method">
                <div class="contact-icon">${method.icon}</div>
                <div class="contact-details">
                    <h4>${method.label}</h4>
                    <p><a href="${method.url}">${method.value}</a></p>
                </div>
            </div>
        `).join('');
    }

    // Populate social links (update footer or contact social section)
    const socialLinks = document.querySelector('.social-links');
    if (socialLinks && data.social) {
        socialLinks.innerHTML = data.social.map(social => `
            <a href="${social.url}" target="_blank" class="social-link" aria-label="${social.platform}">
                <i class="icon-${social.icon}"></i>
            </a>
        `).join('');
    }
}

function updateSEOMetadata() {
    const seo = portfolioData.seo;
    if (!seo) return;

    // Update page title
    document.title = seo.title;

    // Update meta tags
    updateMetaTag('description', seo.description);
    updateMetaTag('keywords', seo.keywords);
    updateMetaTag('author', seo.author);

    // Update Open Graph tags
    updateMetaTag('og:title', seo.title);
    updateMetaTag('og:description', seo.description);
    updateMetaTag('og:image', seo.image);
    updateMetaTag('og:url', seo.url);

    // Update Twitter Card tags
    updateMetaTag('twitter:title', seo.title);
    updateMetaTag('twitter:description', seo.description);
    updateMetaTag('twitter:image', seo.image);
}

/*
===============================================
UTILITY FUNCTIONS
===============================================
*/

function updateElement(selector, content) {
    const element = document.querySelector(selector);
    if (element && content) {
        element.textContent = content;
    }
}

function updateMetaTag(name, content) {
    if (!content) return;

    let selector = `meta[name="${name}"]`;
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
        selector = `meta[property="${name}"]`;
    }

    let meta = document.querySelector(selector);
    if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
            meta.setAttribute('property', name);
        } else {
            meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
}

function setupDynamicTyping(titles) {
    const typingElement = document.querySelector('.hero-subtitle');
    if (!typingElement || !titles.length) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = titles[textIndex];

        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % titles.length;
            typeSpeed = 500; // Pause before next text
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing animation
    setTimeout(type, 1000);
}

/*
===============================================
DYNAMIC CONTENT HELPERS
===============================================
*/

// Function to get portfolio data (for other modules)
function getPortfolioData() {
    return portfolioData;
}

// Function to update specific data (for real-time updates)
function updatePortfolioData(section, newData) {
    if (portfolioData[section]) {
        portfolioData[section] = { ...portfolioData[section], ...newData };
        // Re-populate the specific section
        switch (section) {
            case 'hero': populateHeroSection(); break;
            case 'about': populateAboutSection(); break;
            case 'skills': populateSkillsSection(); break;
            case 'projects': populateProjectsSection(); break;
            case 'experience': populateExperienceSection(); break;
            case 'contact': populateContactSection(); break;
        }
    }
}

// Export functions for use in other modules
window.portfolioDataLoader = {
    getPortfolioData,
    updatePortfolioData,
    loadPortfolioData
};