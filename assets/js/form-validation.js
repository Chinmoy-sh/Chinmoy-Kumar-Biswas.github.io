/**
 * ===============================================
 * FORM VALIDATION & HANDLING SYSTEM
 * Professional Portfolio by Chinmoy Kumar Biswas
 * Version: 2.0.0
 * ===============================================
 */

class FormValidator {
    constructor(options = {}) {
        this.config = {
            validateOnBlur: true,
            validateOnInput: true,
            showValidIcon: true,
            showInvalidIcon: true,
            realTimeValidation: true,
            customMessages: {},
            emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phoneRegex: /^[\+]?[0-9\s\-\(\)]{10,}$/,
            ...options
        };

        this.forms = new Map();
        this.validationRules = new Map();

        this.init();
    }

    init() {
        this.setupDefaultRules();
        this.findAndInitializeForms();
        this.setupGlobalEventListeners();

        console.log('📝 Form validation system initialized');
    }

    setupDefaultRules() {
        // Email validation
        this.addRule('email', {
            validate: (value) => this.config.emailRegex.test(value),
            message: 'Please enter a valid email address'
        });

        // Required field validation
        this.addRule('required', {
            validate: (value) => value && value.trim().length > 0,
            message: 'This field is required'
        });

        // Minimum length validation
        this.addRule('minlength', {
            validate: (value, minLength) => value.length >= parseInt(minLength),
            message: (minLength) => `Minimum ${minLength} characters required`
        });

        // Maximum length validation
        this.addRule('maxlength', {
            validate: (value, maxLength) => value.length <= parseInt(maxLength),
            message: (maxLength) => `Maximum ${maxLength} characters allowed`
        });

        // Phone number validation
        this.addRule('phone', {
            validate: (value) => this.config.phoneRegex.test(value),
            message: 'Please enter a valid phone number'
        });

        // URL validation
        this.addRule('url', {
            validate: (value) => {
                try {
                    new URL(value);
                    return true;
                } catch {
                    return false;
                }
            },
            message: 'Please enter a valid URL'
        });

        // Name validation
        this.addRule('name', {
            validate: (value) => /^[a-zA-Z\s]{2,50}$/.test(value),
            message: 'Name should contain only letters and be 2-50 characters'
        });
    }

    findAndInitializeForms() {
        const forms = document.querySelectorAll('form[data-validate]');

        forms.forEach(form => {
            this.initializeForm(form);
        });

        // Initialize contact form specifically
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            this.initializeForm(contactForm);
        }
    }

    initializeForm(form) {
        if (!form) return;

        const formId = form.id || `form-${Date.now()}`;
        form.id = formId;

        const formData = {
            element: form,
            fields: new Map(),
            isValid: false,
            onSubmit: null,
            onValidate: null
        };

        this.forms.set(formId, formData);

        // Find and initialize form fields
        this.initializeFormFields(form, formData);

        // Setup form event listeners
        this.setupFormEventListeners(form, formData);

        console.log(`📝 Form initialized: ${formId}`);
    }

    initializeFormFields(form, formData) {
        const fields = form.querySelectorAll('input, textarea, select');

        fields.forEach(field => {
            if (field.type === 'submit' || field.type === 'button') return;

            const fieldId = field.id || field.name || `field-${Date.now()}`;
            field.id = fieldId;

            const fieldConfig = {
                element: field,
                rules: this.extractValidationRules(field),
                isValid: false,
                errors: [],
                touched: false
            };

            formData.fields.set(fieldId, fieldConfig);

            // Setup field event listeners
            this.setupFieldEventListeners(field, fieldConfig, formData);

            // Create error message element
            this.createErrorElement(field);
        });
    }

    extractValidationRules(field) {
        const rules = [];

        // HTML5 validation attributes
        if (field.required) {
            rules.push({ name: 'required' });
        }

        if (field.type === 'email') {
            rules.push({ name: 'email' });
        }

        if (field.minLength) {
            rules.push({ name: 'minlength', param: field.minLength });
        }

        if (field.maxLength) {
            rules.push({ name: 'maxlength', param: field.maxLength });
        }

        // Custom data attributes
        if (field.dataset.rules) {
            const customRules = field.dataset.rules.split(',');
            customRules.forEach(rule => {
                const [name, param] = rule.trim().split(':');
                rules.push({ name, param });
            });
        }

        return rules;
    }

    createErrorElement(field) {
        const errorId = `${field.id}-error`;
        let errorElement = document.getElementById(errorId);

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = errorId;
            errorElement.className = 'field-error';
            errorElement.setAttribute('role', 'alert');
            errorElement.setAttribute('aria-live', 'polite');

            // Insert after the field
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }

        // Add error styles if not already present
        this.addErrorStyles();

        return errorElement;
    }

    addErrorStyles() {
        if (document.getElementById('form-validation-styles')) return;

        const style = document.createElement('style');
        style.id = 'form-validation-styles';
        style.textContent = `
            .field-error {
                color: var(--error-color, #ef4444);
                font-size: 0.875rem;
                margin-top: 4px;
                display: none;
                animation: fadeInError 0.3s ease;
            }
            
            .field-error.show {
                display: block;
            }
            
            .form-field.invalid input,
            .form-field.invalid textarea,
            .form-field.invalid select {
                border-color: var(--error-color, #ef4444) !important;
                box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1) !important;
            }
            
            .form-field.valid input,
            .form-field.valid textarea,
            .form-field.valid select {
                border-color: var(--success-color, #10b981) !important;
                box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1) !important;
            }
            
            .form-field {
                position: relative;
            }
            
            .form-field.valid::after {
                content: '✓';
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--success-color, #10b981);
                font-weight: bold;
                pointer-events: none;
            }
            
            .form-field.invalid::after {
                content: '✗';
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--error-color, #ef4444);
                font-weight: bold;
                pointer-events: none;
            }
            
            @keyframes fadeInError {
                from {
                    opacity: 0;
                    transform: translateY(-5px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .form-submit {
                transition: all 0.3s ease;
            }
            
            .form-submit:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none !important;
            }
            
            .form-submit.loading {
                position: relative;
                color: transparent;
            }
            
            .form-submit.loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                margin: -10px 0 0 -10px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
        `;

        document.head.appendChild(style);
    }

    setupFormEventListeners(form, formData) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form, formData);
        });

        form.addEventListener('reset', () => {
            this.resetForm(form.id);
        });
    }

    setupFieldEventListeners(field, fieldConfig, formData) {
        if (this.config.validateOnInput) {
            field.addEventListener('input', () => {
                if (fieldConfig.touched || this.config.realTimeValidation) {
                    this.validateField(field.id, formData);
                }
            });
        }

        if (this.config.validateOnBlur) {
            field.addEventListener('blur', () => {
                fieldConfig.touched = true;
                this.validateField(field.id, formData);
            });
        }

        field.addEventListener('focus', () => {
            this.clearFieldError(field.id);
        });
    }

    setupGlobalEventListeners() {
        // Handle form submission via AJAX for forms with data-ajax attribute
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.hasAttribute('data-ajax')) {
                e.preventDefault();
                this.handleAjaxSubmission(form);
            }
        });
    }

    validateField(fieldId, formData) {
        const fieldConfig = formData.fields.get(fieldId);
        if (!fieldConfig) return false;

        const field = fieldConfig.element;
        const value = field.value.trim();
        const errors = [];

        // Validate against each rule
        for (const rule of fieldConfig.rules) {
            const validationRule = this.validationRules.get(rule.name);
            if (!validationRule) continue;

            let isValid;
            if (rule.name === 'required' || value.length > 0) {
                isValid = validationRule.validate(value, rule.param);

                if (!isValid) {
                    const message = typeof validationRule.message === 'function'
                        ? validationRule.message(rule.param)
                        : validationRule.message;

                    errors.push(this.config.customMessages[rule.name] || message);
                }
            }
        }

        fieldConfig.errors = errors;
        fieldConfig.isValid = errors.length === 0;

        this.updateFieldUI(fieldId, fieldConfig);
        this.updateFormState(formData);

        return fieldConfig.isValid;
    }

    updateFieldUI(fieldId, fieldConfig) {
        const field = fieldConfig.element;
        const fieldContainer = field.closest('.form-field') || field.parentElement;
        const errorElement = document.getElementById(`${fieldId}-error`);

        // Update field container classes
        fieldContainer.classList.remove('valid', 'invalid');
        if (fieldConfig.touched) {
            fieldContainer.classList.add(fieldConfig.isValid ? 'valid' : 'invalid');
        }

        // Update error message
        if (errorElement) {
            if (fieldConfig.errors.length > 0 && fieldConfig.touched) {
                errorElement.textContent = fieldConfig.errors[0];
                errorElement.classList.add('show');
            } else {
                errorElement.classList.remove('show');
            }
        }

        // Update ARIA attributes
        field.setAttribute('aria-invalid', !fieldConfig.isValid);
        if (errorElement && fieldConfig.errors.length > 0) {
            field.setAttribute('aria-describedby', errorElement.id);
        } else {
            field.removeAttribute('aria-describedby');
        }
    }

    clearFieldError(fieldId) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    updateFormState(formData) {
        const allValid = Array.from(formData.fields.values())
            .every(field => field.isValid || !field.touched);

        formData.isValid = allValid;

        // Update submit button state
        const submitButton = formData.element.querySelector('[type="submit"]');
        if (submitButton) {
            submitButton.disabled = !allValid;
        }
    }

    validateForm(formId) {
        const formData = this.forms.get(formId);
        if (!formData) return false;

        let isValid = true;

        // Validate all fields
        for (const [fieldId, fieldConfig] of formData.fields) {
            fieldConfig.touched = true;
            if (!this.validateField(fieldId, formData)) {
                isValid = false;
            }
        }

        return isValid;
    }

    async handleFormSubmit(form, formData) {
        const isValid = this.validateForm(form.id);

        if (!isValid) {
            this.focusFirstInvalidField(form);
            return;
        }

        const submitButton = form.querySelector('[type="submit"]');
        const originalText = submitButton ? submitButton.textContent : '';

        try {
            // Show loading state
            if (submitButton) {
                submitButton.classList.add('loading');
                submitButton.disabled = true;
            }

            // Call custom submit handler if provided
            if (formData.onSubmit) {
                await formData.onSubmit(this.getFormData(form.id));
            } else {
                // Default submission handling
                await this.handleDefaultSubmission(form);
            }

            this.showSuccessMessage(form);
            this.resetForm(form.id);

        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage(form, error.message);
        } finally {
            // Reset loading state
            if (submitButton) {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        }
    }

    async handleDefaultSubmission(form) {
        // Simulate form submission
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted successfully');
                resolve();
            }, 1000);
        });
    }

    async handleAjaxSubmission(form) {
        const formData = new FormData(form);
        const action = form.action || '/submit';
        const method = form.method || 'POST';

        try {
            const response = await fetch(action, {
                method: method,
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            this.showSuccessMessage(form, result.message);
            this.resetForm(form.id);

        } catch (error) {
            this.showErrorMessage(form, error.message);
        }
    }

    focusFirstInvalidField(form) {
        const firstInvalid = form.querySelector('.form-field.invalid input, .form-field.invalid textarea, .form-field.invalid select');
        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    showSuccessMessage(form, message = 'Form submitted successfully!') {
        this.showFormMessage(form, message, 'success');
    }

    showErrorMessage(form, message = 'An error occurred. Please try again.') {
        this.showFormMessage(form, message, 'error');
    }

    showFormMessage(form, message, type) {
        let messageElement = form.querySelector('.form-message');

        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'form-message';
            messageElement.setAttribute('role', 'alert');
            messageElement.setAttribute('aria-live', 'polite');
            form.insertBefore(messageElement, form.firstChild);
        }

        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        messageElement.style.display = 'block';

        // Add message styles
        this.addMessageStyles();

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }

    addMessageStyles() {
        if (document.getElementById('form-message-styles')) return;

        const style = document.createElement('style');
        style.id = 'form-message-styles';
        style.textContent = `
            .form-message {
                padding: 12px 16px;
                border-radius: 8px;
                margin-bottom: 16px;
                font-weight: 500;
                animation: slideInMessage 0.3s ease;
            }
            
            .form-message.success {
                background-color: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.3);
                color: var(--success-color, #10b981);
            }
            
            .form-message.error {
                background-color: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                color: var(--error-color, #ef4444);
            }
            
            @keyframes slideInMessage {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;

        document.head.appendChild(style);
    }

    resetForm(formId) {
        const formData = this.forms.get(formId);
        if (!formData) return;

        // Reset form element
        formData.element.reset();

        // Reset field states
        for (const [fieldId, fieldConfig] of formData.fields) {
            fieldConfig.isValid = false;
            fieldConfig.errors = [];
            fieldConfig.touched = false;

            // Clear UI
            const fieldContainer = fieldConfig.element.closest('.form-field') || fieldConfig.element.parentElement;
            fieldContainer.classList.remove('valid', 'invalid');

            const errorElement = document.getElementById(`${fieldId}-error`);
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        }

        // Update form state
        this.updateFormState(formData);

        // Hide any messages
        const messageElement = formData.element.querySelector('.form-message');
        if (messageElement) {
            messageElement.style.display = 'none';
        }
    }

    getFormData(formId) {
        const formData = this.forms.get(formId);
        if (!formData) return {};

        const data = {};

        for (const [fieldId, fieldConfig] of formData.fields) {
            const field = fieldConfig.element;
            data[field.name || fieldId] = field.value;
        }

        return data;
    }

    // Public API methods
    addRule(name, rule) {
        this.validationRules.set(name, rule);
    }

    removeRule(name) {
        this.validationRules.delete(name);
    }

    onFormSubmit(formId, callback) {
        const formData = this.forms.get(formId);
        if (formData) {
            formData.onSubmit = callback;
        }
    }

    onFormValidate(formId, callback) {
        const formData = this.forms.get(formId);
        if (formData) {
            formData.onValidate = callback;
        }
    }

    isFormValid(formId) {
        const formData = this.forms.get(formId);
        return formData ? formData.isValid : false;
    }

    getFormErrors(formId) {
        const formData = this.forms.get(formId);
        if (!formData) return [];

        const errors = [];
        for (const [fieldId, fieldConfig] of formData.fields) {
            if (fieldConfig.errors.length > 0) {
                errors.push({
                    field: fieldId,
                    errors: fieldConfig.errors
                });
            }
        }

        return errors;
    }
}

// Initialize form validation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const formValidator = new FormValidator({
        validateOnBlur: true,
        validateOnInput: true,
        showValidIcon: true,
        showInvalidIcon: true,
        realTimeValidation: true
    });

    // Expose to global scope
    window.formValidator = formValidator;

    // Setup contact form if it exists
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        formValidator.onFormSubmit('contact-form', async (data) => {
            console.log('Contact form submitted:', data);

            // Here you would typically send the data to your server
            // For demo purposes, we'll just log it

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // You can integrate with services like Formspree, Netlify Forms, etc.
            // Example with Formspree:
            // const response = await fetch('https://formspree.io/f/your-form-id', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
        });
    }

    console.log('📝 Form validation system ready');
});

// export removed for non-module usage