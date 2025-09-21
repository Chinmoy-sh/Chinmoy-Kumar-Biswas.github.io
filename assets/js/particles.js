/**
 * ===============================================
 * ADVANCED PARTICLE SYSTEM
 * Professional Portfolio by Chinmoy Kumar Biswas
 * Version: 2.0.0
 * ===============================================
 */

class ParticleSystem {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.connectionLines = [];
        this.animationId = null;
        this.isRunning = false;

        // Default configuration
        this.config = {
            particleCount: 80,
            particleSize: { min: 1, max: 3 },
            particleSpeed: { min: 0.1, max: 0.5 },
            particleOpacity: { min: 0.3, max: 0.8 },
            connectionDistance: 120,
            connectionOpacity: 0.15,
            colors: {
                particles: ['#00f5ff', '#ff006e', '#8338ec', '#00ff88'],
                connections: '#00f5ff'
            },
            mouse: {
                radius: 150,
                repel: false,
                attract: true
            },
            background: {
                gradient: true,
                opacity: 0.02
            },
            performance: {
                maxFPS: 60,
                enableConnections: true,
                enableMouseInteraction: true,
                enableGlow: true
            },
            ...options
        };

        this.mouse = {
            x: null,
            y: null,
            isMoving: false,
            lastMoved: 0
        };

        this.performance = {
            lastFrameTime: 0,
            deltaTime: 0,
            frameCount: 0,
            fps: 0,
            fpsUpdateTime: 0
        };

        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.setupPerformanceMonitoring();
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';

        this.ctx.scale(dpr, dpr);
        this.width = rect.width;
        this.height = rect.height;

        // Update particle positions if canvas was resized
        if (this.particles.length > 0) {
            this.particles.forEach(particle => {
                particle.x = Math.min(particle.x, this.width);
                particle.y = Math.min(particle.y, this.height);
            });
        }
    }

    createParticles() {
        this.particles = [];

        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        const colors = this.config.colors.particles;
        const color = colors[Math.floor(Math.random() * colors.length)];

        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            vx: (Math.random() - 0.5) * (this.config.particleSpeed.max - this.config.particleSpeed.min) + this.config.particleSpeed.min,
            vy: (Math.random() - 0.5) * (this.config.particleSpeed.max - this.config.particleSpeed.min) + this.config.particleSpeed.min,
            size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
            opacity: Math.random() * (this.config.particleOpacity.max - this.config.particleOpacity.min) + this.config.particleOpacity.min,
            color: color,
            originalSize: 0,
            pulsePhase: Math.random() * Math.PI * 2,
            trail: []
        };
    }

    setupEventListeners() {
        // Mouse tracking
        const updateMousePosition = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.isMoving = true;
            this.mouse.lastMoved = performance.now();
        };

        this.canvas.addEventListener('mousemove', updateMousePosition);
        this.canvas.addEventListener('mouseenter', updateMousePosition);

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
            this.mouse.isMoving = false;
        });

        // Resize handling with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
            }, 100);
        });

        // Visibility change handling for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }

    setupPerformanceMonitoring() {
        // Monitor performance and adjust quality accordingly
        setInterval(() => {
            if (this.performance.fps < 30 && this.config.particleCount > 20) {
                this.optimizePerformance();
            }
        }, 5000);
    }

    optimizePerformance() {
        // Reduce particle count
        this.config.particleCount = Math.max(20, this.config.particleCount - 10);

        // Disable expensive features
        this.config.performance.enableConnections = false;
        this.config.performance.enableGlow = false;

        console.log('🔧 Particle system optimized for performance');
        this.createParticles();
    }

    updateParticles(deltaTime) {
        const currentTime = performance.now();

        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;

            // Boundary collision with bounce
            if (particle.x <= 0 || particle.x >= this.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.width, particle.x));
            }

            if (particle.y <= 0 || particle.y >= this.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.height, particle.y));
            }

            // Mouse interaction
            if (this.config.performance.enableMouseInteraction && this.mouse.x !== null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.mouse.radius) {
                    const force = (this.config.mouse.radius - distance) / this.config.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    const forceMultiplier = this.config.mouse.repel ? -force : force;

                    particle.vx += Math.cos(angle) * forceMultiplier * 0.02;
                    particle.vy += Math.sin(angle) * forceMultiplier * 0.02;

                    // Increase particle size near mouse
                    particle.size = particle.originalSize + force * 2;
                    particle.opacity = Math.min(1, particle.opacity + force * 0.3);
                } else {
                    // Reset to original size
                    particle.size = particle.originalSize || particle.size;
                }
            }

            // Pulsing effect
            particle.pulsePhase += 0.02;
            const pulseSize = Math.sin(particle.pulsePhase) * 0.3;
            particle.size += pulseSize;

            // Trail effect
            if (particle.trail.length > 5) {
                particle.trail.shift();
            }
            particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.opacity });

            // Velocity dampening
            particle.vx *= 0.999;
            particle.vy *= 0.999;
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            // Draw trail
            if (particle.trail.length > 1) {
                this.ctx.save();
                particle.trail.forEach((point, index) => {
                    const trailOpacity = (index / particle.trail.length) * particle.opacity * 0.3;
                    const trailSize = particle.size * (index / particle.trail.length) * 0.5;

                    this.ctx.globalAlpha = trailOpacity;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.beginPath();
                    this.ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
                    this.ctx.fill();
                });
                this.ctx.restore();
            }

            // Draw main particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;

            if (this.config.performance.enableGlow) {
                // Glow effect
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = particle.color;
            }

            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        });
    }

    drawConnections() {
        if (!this.config.performance.enableConnections) return;

        this.ctx.save();
        this.ctx.strokeStyle = this.config.colors.connections;
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle1 = this.particles[i];
                const particle2 = this.particles[j];

                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * this.config.connectionOpacity;
                    this.ctx.globalAlpha = opacity;

                    this.ctx.beginPath();
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                }
            }
        }

        this.ctx.restore();
    }

    drawBackground() {
        if (!this.config.background.gradient) return;

        const gradient = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, Math.max(this.width, this.height) / 2
        );

        gradient.addColorStop(0, `rgba(0, 245, 255, ${this.config.background.opacity})`);
        gradient.addColorStop(0.5, `rgba(131, 56, 236, ${this.config.background.opacity * 0.5})`);
        gradient.addColorStop(1, 'transparent');

        this.ctx.save();
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.restore();
    }

    calculatePerformance(currentTime) {
        this.performance.frameCount++;

        if (currentTime - this.performance.fpsUpdateTime >= 1000) {
            this.performance.fps = this.performance.frameCount;
            this.performance.frameCount = 0;
            this.performance.fpsUpdateTime = currentTime;
        }

        this.performance.deltaTime = currentTime - this.performance.lastFrameTime;
        this.performance.lastFrameTime = currentTime;
    }

    animate(currentTime) {
        if (!this.isRunning) return;

        this.calculatePerformance(currentTime);

        // FPS limiting
        const targetFPS = this.config.performance.maxFPS;
        const targetFrameTime = 1000 / targetFPS;

        if (this.performance.deltaTime < targetFrameTime) {
            this.animationId = requestAnimationFrame((time) => this.animate(time));
            return;
        }

        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Draw background
        this.drawBackground();

        // Update and draw particles
        this.updateParticles(this.performance.deltaTime * 0.016); // Normalize to ~60fps
        this.drawConnections();
        this.drawParticles();

        // Check if mouse stopped moving
        if (this.mouse.isMoving && currentTime - this.mouse.lastMoved > 100) {
            this.mouse.isMoving = false;
        }

        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.performance.lastFrameTime = performance.now();
        this.animationId = requestAnimationFrame((time) => this.animate(time));

        console.log('🌟 Particle system started');
    }

    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.isRunning) {
            this.start();
        }
    }

    stop() {
        this.pause();
        this.ctx.clearRect(0, 0, this.width, this.height);
        console.log('⏹️ Particle system stopped');
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.createParticles();
    }

    // Public API methods
    addParticles(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    }

    removeParticles(count) {
        this.particles.splice(0, count);
    }

    setMouseMode(mode) {
        this.config.mouse.repel = mode === 'repel';
        this.config.mouse.attract = mode === 'attract';
    }

    getPerformanceStats() {
        return {
            fps: this.performance.fps,
            particleCount: this.particles.length,
            isRunning: this.isRunning,
            memoryUsage: this.particles.length * 8 // Rough estimate
        };
    }
}

// Particle system factory with presets
const ParticlePresets = {
    minimal: {
        particleCount: 30,
        connectionDistance: 100,
        performance: { enableConnections: false, enableGlow: false }
    },

    standard: {
        particleCount: 60,
        connectionDistance: 120,
        performance: { enableConnections: true, enableGlow: true }
    },

    enhanced: {
        particleCount: 100,
        connectionDistance: 150,
        performance: { enableConnections: true, enableGlow: true, enableMouseInteraction: true }
    },

    performance: {
        particleCount: 20,
        connectionDistance: 80,
        performance: { enableConnections: false, enableGlow: false, enableMouseInteraction: false }
    }
};

// Initialize particle system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    // Detect performance capability
    const isLowPerformance = /Mobi|Android/i.test(navigator.userAgent) ||
        navigator.hardwareConcurrency < 4 ||
        window.innerWidth < 768;

    const preset = isLowPerformance ? 'performance' : 'standard';
    const config = ParticlePresets[preset];

    const particleSystem = new ParticleSystem(canvas, config);
    particleSystem.start();

    // Expose to global scope for debugging
    window.particleSystem = particleSystem;

    console.log(`🎨 Particle system initialized with ${preset} preset`);
});

// exports removed for non-module usage