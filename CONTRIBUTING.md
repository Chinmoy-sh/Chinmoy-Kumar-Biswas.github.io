# Contributing to Chinmoy Kumar Biswas Portfolio

Thank you for your interest in contributing to this portfolio project! This document provides
guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Submission Guidelines](#submission-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project follows a professional code of conduct:

- **Be Respectful**: Treat everyone with respect and professionalism
- **Be Collaborative**: Work together constructively and share knowledge
- **Be Inclusive**: Welcome contributors from all backgrounds and skill levels
- **Be Professional**: Maintain high standards in communication and code quality

## Getting Started

### Prerequisites

- Modern web browser with ES6 module support
- Node.js 16+ and npm 8+ (for development tools)
- Git for version control
- Code editor (VS Code recommended)

### Initial Setup

1. **Fork the Repository**

   ```bash
   # Fork via GitHub web interface, then clone your fork
   git clone https://github.com/YOUR-USERNAME/Chinmoy-Kumar-Biswas.github.io.git
   cd Chinmoy-Kumar-Biswas.github.io
   ```

2. **Add Upstream Remote**

   ```bash
   git remote add upstream https://github.com/Chinmoy-sh/Chinmoy-Kumar-Biswas.github.io.git
   ```

3. **Install Development Dependencies**

   ```bash
   npm install
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

## Development Process

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for new features
- **feature/**: Individual feature branches
- **hotfix/**: Critical bug fixes
- **release/**: Release preparation branches

### Workflow

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow coding standards
   - Write meaningful commit messages
   - Test your changes thoroughly

3. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

4. **Keep Up to Date**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

5. **Push and Create PR**

   ```bash
   git push origin feature/your-feature-name
   # Create pull request via GitHub web interface
   ```

## Coding Standards

### JavaScript

- **ES6+ Modules**: Use modern JavaScript features
- **JSDoc Comments**: Document all functions and classes
- **Error Handling**: Implement comprehensive error handling
- **Async/Await**: Use modern async patterns

```javascript
/**
 * Example function with proper documentation
 * @param {string} input - The input parameter
 * @param {Object} options - Configuration options
 * @returns {Promise<string>} The processed result
 * @throws {Error} When input is invalid
 */
async function processInput(input, options = {}) {
    try {
        // Implementation
        return result;
    } catch (error) {
        console.error('Error processing input:', error);
        throw new Error(`Processing failed: ${error.message}`);
    }
}
```

### CSS

- **BEM Methodology**: Use Block-Element-Modifier naming
- **CSS Custom Properties**: Use CSS variables for theming
- **Mobile-First**: Implement responsive design
- **Performance**: Optimize for speed and efficiency

```css
/* BEM naming example */
.portfolio-card {
    /* Block */
}

.portfolio-card__title {
    /* Element */
}

.portfolio-card--featured {
    /* Modifier */
}

/* Custom properties */
:root {
    --color-primary: #3b82f6;
    --spacing-md: 1rem;
}
```

### HTML

- **Semantic Markup**: Use appropriate HTML5 elements
- **Accessibility**: Include ARIA labels and attributes
- **Performance**: Optimize meta tags and structure

```html
<article class="portfolio-item" role="article" aria-labelledby="item-title">
    <h2 id="item-title" class="portfolio-item__title">Project Title</h2>
    <p class="portfolio-item__description">Project description</p>
</article>
```

## Submission Guidelines

### Pull Request Process

1. **Clear Description**: Explain what your PR does and why
2. **Related Issues**: Reference any related issues
3. **Testing**: Confirm your changes work correctly
4. **Documentation**: Update docs if needed
5. **Clean History**: Use clear, descriptive commit messages

### Commit Message Format

Use conventional commits format:

```git
type(scope): description

[optional body]

[optional footer]
```

Types:

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Formatting changes
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

Examples:

```bash
feat(navigation): add smooth scroll animation
fix(carousel): resolve touch event handling on mobile
docs(readme): update installation instructions
style(css): format stylesheets with prettier
```

### PR Title Format

- Use the same format as commit messages
- Be descriptive and specific
- Reference issue numbers when applicable

## Testing

### Manual Testing Checklist

- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness (various screen sizes)
- [ ] Accessibility compliance (screen readers, keyboard navigation)
- [ ] Performance (loading times, animation smoothness)
- [ ] PWA functionality (offline capability, installation)

### Code Quality Checks

```bash
# Run all linting tools
npm run lint

# Format code
npm run format

# Validate all code
npm run validate
```

### Browser Testing

- **Desktop**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Screen Sizes**: 320px to 4K displays
- **Accessibility**: Screen reader compatibility

## Documentation

### README Updates

When adding features, update:

- Feature descriptions
- Installation instructions
- Usage examples
- Configuration options

### Code Documentation

- **JSDoc**: Document all public functions
- **Inline Comments**: Explain complex logic
- **Architecture**: Document design decisions
- **APIs**: Document component interfaces

### Changelog

Update `CHANGELOG.md` with:

- New features
- Bug fixes
- Breaking changes
- Dependencies updates

## Community Guidelines

### Getting Help

- **Issues**: Use GitHub issues for bug reports and feature requests
- **Discussions**: Use GitHub discussions for questions and ideas
- **Email**: Contact bangladeshchinmoy@gmail.com for sensitive matters

### Reporting Bugs

Include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and system information
- Screenshots or videos if helpful

### Suggesting Features

Include:

- Clear description of the feature
- Use case and motivation
- Proposed implementation approach
- Potential impact and considerations

## Recognition

Contributors are recognized in:

- GitHub contributors list
- README acknowledgments
- Project documentation
- Release notes

Thank you for contributing to making this portfolio better! 🚀
