# Legacy Files

This folder contains the original monolithic files from the portfolio before the architectural
transformation to a modular design.

## Files

- `script.js` - Original monolithic JavaScript file
- `style.css` - Original monolithic CSS file

## Purpose

These files are kept for reference and comparison purposes to show the evolution from monolithic to
modular architecture. They are not used in the current production version of the portfolio.

## Migration

The functionality from these files has been split into:

### From script.js

- `assets/js/app.js` - Main application controller
- `assets/js/components/` - Individual feature modules
- `assets/js/utils/` - Utility functions
- `assets/js/animations/` - Animation controllers

### From style.css

- `assets/css/main.css` - Entry point and utilities
- `assets/css/variables.css` - Design tokens
- `assets/css/base.css` - Global styles
- `assets/css/layout.css` - Layout systems
- `assets/css/components.css` - Component styles
- `assets/css/animations.css` - Animation definitions

## Notes

- These files can be safely removed in a future cleanup if reference is no longer needed
- Current architecture provides better maintainability, performance, and scalability
- All functionality has been preserved and enhanced in the new modular system
