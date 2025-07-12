// Mobile Menu Toggle
document.getElementById('mobile-menu-button').addEventListener('click', function () {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('#mobile-menu a').forEach(item => {
    item.addEventListener('click', () => {
        document.getElementById('mobile-menu').classList.add('hidden');
    });
});

// Intersection Observer for scroll animations
const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
const sectionTitles = document.querySelectorAll('.section-title');
const heroContent = document.querySelector('#hero .animate-fade-in');
const aboutImage = document.querySelector('#about .animate-slide-left');
const aboutText = document.querySelector('#about .animate-slide-right');
const contactSection = document.querySelector('#contact .animate-fade-in');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the element is visible
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const animationType = target.dataset.animation;
            const delay = parseInt(target.dataset.delay) || 0;

            setTimeout(() => {
                if (animationType === 'fade-in') {
                    target.classList.add('is-visible');
                } else if (animationType === 'slide-in-left') {
                    target.classList.add('is-visible', 'animate-slide-left');
                } else if (animationType === 'slide-in-right') {
                    target.classList.add('is-visible', 'animate-slide-right');
                } else if (animationType === 'zoom-in') {
                    target.classList.add('is-visible', 'animate-zoom-in');
                } else if (animationType === 'rotate-in') {
                    target.classList.add('is-visible', 'animate-rotate-in');
                } else {
                    target.classList.add('is-visible'); // Default fade-in
                }
            }, delay);
            observer.unobserve(target); // Stop observing once animated
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe section titles
sectionTitles.forEach(title => {
    observer.observe(title);
});

// Observe elements with animate-on-scroll class
animateOnScrollElements.forEach(element => {
    observer.observe(element);
});

// Observe specific elements with custom animations
if (heroContent) observer.observe(heroContent);
if (aboutImage) observer.observe(aboutImage);
if (aboutText) observer.observe(aboutText);
if (contactSection) observer.observe(contactSection);

// Project Data (for modal)
const projectsData = {
    project1: {
        title: "E-commerce Platform",
        image: "https://placehold.co/800x500/3b82f6/ffffff?text=E-commerce+Platform",
        description: "This is a robust full-stack e-commerce solution designed to provide a seamless shopping experience. It features user authentication, a comprehensive product catalog with search and filtering, a secure shopping cart, and integrated payment processing. The backend is built with Node.js and Express.js, utilizing MongoDB for flexible data storage. The frontend is a dynamic single-page application developed with React, ensuring a highly responsive user interface.",
        technologies: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Stripe API"],
        liveDemo: "#",
        github: "#"
    },
    project2: {
        title: "Task Management App",
        image: "https://placehold.co/800x500/6366f1/ffffff?text=Task+Manager+App",
        description: "A highly interactive task management application that helps users organize their daily tasks efficiently. Key features include drag-and-drop functionality for easy task reordering, real-time updates across multiple devices, and collaborative features allowing teams to manage projects together. The application leverages Vue.js for a reactive frontend and Firebase for real-time database and authentication, providing a fast and scalable solution.",
        technologies: ["Vue.js", "Firebase", "Drag & Drop API", "Firestore", "Vuex"],
        liveDemo: "#",
        github: "#"
    },
    project3: {
        title: "Interactive Data Dashboard",
        image: "https://placehold.co/800x500/f59e0b/ffffff?text=Data+Dashboard",
        description: "An intuitive and dynamic data visualization dashboard built to provide insights from complex datasets. It integrates D3.js for powerful and customizable charts (bar charts, line graphs, pie charts) and React for managing the interactive UI components. Users can filter data, zoom into specific time ranges, and explore trends with ease. This project demonstrates strong data handling and visualization capabilities.",
        technologies: ["D3.js", "React", "Chart.js", "Data Visualization", "API Integration"],
        liveDemo: "#",
        github: "#"
    },
    project4: {
        title: "Mobile App Concept (UI/UX)",
        image: "https://placehold.co/800x500/475569/ffffff?text=Mobile+App+Concept",
        description: "This project showcases the complete UI/UX design and prototyping for a modern fitness tracking mobile application. The design process involved extensive user research, wireframing, and high-fidelity mockups created in Figma. The focus was on creating an intuitive and engaging user experience, including features like workout tracking, progress visualization, and personalized recommendations. A detailed case study outlines the design decisions and user flow.",
        technologies: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping", "Usability Testing"],
        liveDemo: "#", // Link to a Behance or Dribbble case study
        github: "#" // Link to design files or a design repo
    },
    project5: {
        title: "Personal Blog Platform",
        image: "https://placehold.co/800x500/6b7280/ffffff?text=Blog+Platform",
        description: "A custom-built personal blog platform designed for content creators. It features a robust content management system (CMS) for easy post creation and management, full markdown support for rich text editing, and is optimized for SEO to ensure discoverability. The platform is built with Next.js for server-side rendering and static site generation, providing fast load times and a great user experience. GraphQL is used for efficient data fetching.",
        technologies: ["Next.js", "React", "GraphQL", "Strapi CMS", "Markdown", "SEO Optimization"],
        liveDemo: "#",
        github: "#"
    },
    project6: {
        title: "Simple Game Development",
        image: "https://placehold.co/800x500/374151/ffffff?text=Game+Dev",
        description: "A fun, browser-based game developed using pure JavaScript and HTML Canvas. This project demonstrates fundamental game development mechanics, including sprite animation, collision detection, score tracking, and basic physics. It's a testament to building interactive experiences from scratch and understanding core game loop principles.",
        technologies: ["JavaScript", "HTML Canvas", "Game Loop", "Collision Detection", "Basic Physics"],
        liveDemo: "#", // Link to playable game
        github: "#"
    }
};

const projectCards = document.querySelectorAll('.project-card');
const projectDetailModal = document.getElementById('project-detail-modal');
const closeModalButton = document.getElementById('close-modal-button');
const modalProjectTitle = document.getElementById('modal-project-title');
const modalProjectImage = document.getElementById('modal-project-image');
const modalProjectDescription = document.getElementById('modal-project-description');
const modalProjectTech = document.getElementById('modal-project-tech');
const modalLiveDemo = document.getElementById('modal-live-demo');
const modalGithub = document.getElementById('modal-github');

// Function to open the project modal
function openProjectModal(projectId) {
    const project = projectsData[projectId];
    if (project) {
        modalProjectTitle.textContent = project.title;
        modalProjectImage.src = project.image;
        modalProjectImage.alt = project.title;
        modalProjectDescription.textContent = project.description;

        // Clear previous technologies
        modalProjectTech.innerHTML = '';
        project.technologies.forEach(tech => {
            const span = document.createElement('span');
            // Use dark theme appropriate colors for tech tags in modal
            span.className = 'bg-indigo-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full';
            span.textContent = tech;
            modalProjectTech.appendChild(span);
        });

        modalLiveDemo.href = project.liveDemo;
        modalGithub.href = project.github;

        projectDetailModal.classList.remove('hidden');
        setTimeout(() => {
            projectDetailModal.classList.add('is-visible');
        }, 10); // Small delay for transition
    }
}

// Function to close the project modal
function closeProjectModal() {
    projectDetailModal.classList.remove('is-visible');
    setTimeout(() => {
        projectDetailModal.classList.add('hidden');
    }, 300); // Wait for transition to finish
}

// Add click listeners to project cards
projectCards.forEach(card => {
    card.addEventListener('click', function () {
        const projectId = this.dataset.projectId;
        openProjectModal(projectId);
    });
});

// Add click listener to close modal button
closeModalButton.addEventListener('click', closeProjectModal);

// Close modal if clicked outside content
projectDetailModal.addEventListener('click', function (event) {
    if (event.target === projectDetailModal) {
        closeProjectModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && projectDetailModal.classList.contains('is-visible')) {
        closeProjectModal();
    }
});
