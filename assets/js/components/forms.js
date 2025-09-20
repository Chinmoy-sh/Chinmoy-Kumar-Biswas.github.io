/**
 * FORM VALIDATION MODULE
 * Handles form validation, submission, and user feedback
 * @module forms
 */

import { sanitizeHTML, isValidEmail, debounce } from '../utils/utilities.js';

let forms = new Map();

/**
 * Initialize all forms
 */
export const initializeForms = () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        initializeContactForm();
    }

    // Initialize any other forms
    const allForms = document.querySelectorAll('form[data-validate]');
    allForms.forEach(form => {
        const formId = form.id || `form-${Date.now()}`;
        initializeForm(formId, form);
    });
};

/**
 * Initialize contact form specifically
 */
const initializeContactForm = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const formConfig = {
        form,
        fields: {
            name: {
                element: document.getElementById('name'),
                errorElement: document.getElementById('name-error'),
                rules: ['required', 'maxLength:100'],
                sanitize: true
            },
            email: {
                element: document.getElementById('email'),
                errorElement: document.getElementById('email-error'),
                rules: ['required', 'email'],
                sanitize: false
            },
            subject: {
                element: document.getElementById('subject'),
                errorElement: document.getElementById('subject-error'),
                rules: ['required', 'maxLength:200'],
                sanitize: true
            },
            message: {
                element: document.getElementById('message'),
                errorElement: document.getElementById('message-error'),
                rules: ['required', 'maxLength:2000'],
                sanitize: true
            }
        },
        onSubmit: handleContactFormSubmission
    };

    forms.set('contact', formConfig);
    setupFormValidation('contact');
};

/**
 * Initialize a generic form
 * @param {string} formId - Form identifier
 * @param {HTMLElement} formElement - Form element
 * @param {Object} config - Form configuration
 */
export const initializeForm = (formId, formElement, config = {}) => {
    if (!formElement) return;

    const formConfig = {
        form: formElement,
        fields: config.fields || {},
        validateOnInput: config.validateOnInput !== false,
        validateOnBlur: config.validateOnBlur !== false,
        showSuccessMessage: config.showSuccessMessage !== false,
        onSubmit: config.onSubmit || defaultFormSubmission,
        onValidate: config.onValidate || null,
        onError: config.onError || null
    };

    forms.set(formId, formConfig);
    setupFormValidation(formId);
};

/**
 * Setup form validation
 * @param {string} formId - Form identifier
 */
const setupFormValidation = (formId) => {
    const config = forms.get(formId);
    if (!config) return;

    const { form, fields } = config;

    // Setup field validation
    Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
        const { element } = fieldConfig;
        if (!element) return;

        // Real-time validation on input
        if (config.validateOnInput) {
            const debouncedValidate = debounce(() => {
                validateField(formId, fieldName);
            }, 300);

            element.addEventListener('input', debouncedValidate);
        }

        // Validation on blur
        if (config.validateOnBlur) {
            element.addEventListener('blur', () => {
                validateField(formId, fieldName);
            });
        }

        // Character counter for text fields
        if (fieldConfig.rules.some(rule => rule.startsWith('maxLength'))) {
            setupCharacterCounter(element, fieldConfig);
        }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmission(formId);
    });
};

/**
 * Setup character counter for field
 * @param {HTMLElement} element - Input element
 * @param {Object} fieldConfig - Field configuration
 */
const setupCharacterCounter = (element, fieldConfig) => {
    const maxLength = fieldConfig.rules
        .find(rule => rule.startsWith('maxLength'))
        ?.split(':')[1];

    if (!maxLength) return;

    // Create counter element
    const counter = document.createElement('div');
    counter.className = 'character-counter text-xs text-gray-500 mt-1';
    element.parentNode.appendChild(counter);

    // Update counter
    const updateCounter = () => {
        const current = element.value.length;
        const max = parseInt(maxLength);
        counter.textContent = `${current}/${max}`;

        if (current > max * 0.9) {
            counter.classList.add('text-yellow-600');
        } else {
            counter.classList.remove('text-yellow-600');
        }

        if (current > max) {
            counter.classList.add('text-red-600');
            counter.classList.remove('text-yellow-600');
        } else {
            counter.classList.remove('text-red-600');
        }
    };

    element.addEventListener('input', updateCounter);
    updateCounter();
};

/**
 * Validate a single field
 * @param {string} formId - Form identifier
 * @param {string} fieldName - Field name
 * @returns {boolean} Validation result
 */
const validateField = (formId, fieldName) => {
    const config = forms.get(formId);
    if (!config) return false;

    const fieldConfig = config.fields[fieldName];
    if (!fieldConfig) return false;

    const { element, errorElement, rules, sanitize } = fieldConfig;
    if (!element) return false;

    const value = element.value.trim();
    const sanitizedValue = sanitize ? sanitizeHTML(value) : value;

    // Clear previous errors
    clearFieldError(element, errorElement);

    // Validate rules
    for (const rule of rules) {
        const error = validateRule(sanitizedValue, rule, fieldName);
        if (error) {
            showFieldError(element, errorElement, error);
            return false;
        }
    }

    // Show success state
    showFieldSuccess(element);
    return true;
};

/**
 * Validate a single rule
 * @param {string} value - Field value
 * @param {string} rule - Validation rule
 * @param {string} fieldName - Field name for error messages
 * @returns {string|null} Error message or null if valid
 */
const validateRule = (value, rule, fieldName) => {
    const [ruleName, ruleValue] = rule.split(':');
    const fieldLabel = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

    switch (ruleName) {
        case 'required':
            return value === '' ? `${fieldLabel} is required.` : null;

        case 'email':
            return !isValidEmail(value) ? 'Please enter a valid email address.' : null;

        case 'minLength':
            const minLen = parseInt(ruleValue);
            return value.length < minLen ? `${fieldLabel} must be at least ${minLen} characters.` : null;

        case 'maxLength':
            const maxLen = parseInt(ruleValue);
            return value.length > maxLen ? `${fieldLabel} must be less than ${maxLen} characters.` : null;

        case 'pattern':
            const regex = new RegExp(ruleValue);
            return !regex.test(value) ? `${fieldLabel} format is invalid.` : null;

        case 'numeric':
            return isNaN(value) ? `${fieldLabel} must be a number.` : null;

        case 'phone':
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            return !phoneRegex.test(value.replace(/\s|-|\(|\)/g, '')) ? 'Please enter a valid phone number.' : null;

        default:
            return null;
    }
};

/**
 * Show field error
 * @param {HTMLElement} element - Input element
 * @param {HTMLElement} errorElement - Error message element
 * @param {string} message - Error message
 */
const showFieldError = (element, errorElement, message) => {
    // Update element styles
    element.classList.add('border-red-500', 'border-2');
    element.classList.remove('border-gray-300', 'border-green-500');

    // Show error message
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        errorElement.classList.add('text-red-500');
    }

    // Add ARIA attributes for accessibility
    element.setAttribute('aria-invalid', 'true');
    if (errorElement) {
        element.setAttribute('aria-describedby', errorElement.id);
    }
};

/**
 * Show field success
 * @param {HTMLElement} element - Input element
 */
const showFieldSuccess = (element) => {
    element.classList.add('border-green-500', 'border-2');
    element.classList.remove('border-red-500', 'border-gray-300');
    element.setAttribute('aria-invalid', 'false');
};

/**
 * Clear field error
 * @param {HTMLElement} element - Input element
 * @param {HTMLElement} errorElement - Error message element
 */
const clearFieldError = (element, errorElement) => {
    element.classList.remove('border-red-500', 'border-green-500', 'border-2');
    element.classList.add('border-gray-300');
    element.removeAttribute('aria-invalid');

    if (errorElement) {
        errorElement.classList.add('hidden');
        errorElement.textContent = '';
    }
};

/**
 * Handle form submission
 * @param {string} formId - Form identifier
 */
const handleFormSubmission = async (formId) => {
    const config = forms.get(formId);
    if (!config) return;

    const { form, fields, onSubmit } = config;

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalText = submitButton?.textContent;
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
    }

    // Validate all fields
    let isValid = true;
    const formData = {};

    Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
        const fieldValid = validateField(formId, fieldName);
        if (!fieldValid) {
            isValid = false;
        }

        // Collect form data
        if (fieldConfig.element) {
            const value = fieldConfig.element.value.trim();
            formData[fieldName] = fieldConfig.sanitize ? sanitizeHTML(value) : value;
        }
    });

    try {
        if (isValid) {
            await onSubmit(formData, form);

            if (config.showSuccessMessage) {
                showFormSuccess(form, 'Form submitted successfully!');
            }
        } else {
            showFormError(form, 'Please correct the errors in the form.');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showFormError(form, 'An error occurred while submitting the form. Please try again.');

        if (config.onError) {
            config.onError(error, formData);
        }
    } finally {
        // Reset submit button
        if (submitButton && originalText) {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }
};

/**
 * Handle contact form submission
 * @param {Object} formData - Form data
 * @param {HTMLElement} form - Form element
 */
const handleContactFormSubmission = async (formData, form) => {
    const { name, email, subject, message } = formData;

    // Create mailto link
    const mailtoLink = `mailto:bangladeshchinmoy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

    // Open email client
    window.location.href = mailtoLink;

    // Clear form
    form.reset();

    // Clear field states
    const config = forms.get('contact');
    if (config) {
        Object.values(config.fields).forEach(fieldConfig => {
            if (fieldConfig.element && fieldConfig.errorElement) {
                clearFieldError(fieldConfig.element, fieldConfig.errorElement);
            }
        });
    }

    // Show success message
    showNotification('Your email client should open shortly with your message. Thank you!', 'success');
};

/**
 * Default form submission handler
 * @param {Object} formData - Form data
 * @param {HTMLElement} form - Form element
 */
const defaultFormSubmission = async (formData, form) => {
    console.log('Form submitted:', formData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    form.reset();
};

/**
 * Show form success message
 * @param {HTMLElement} form - Form element
 * @param {string} message - Success message
 */
const showFormSuccess = (form, message) => {
    const existingAlert = form.querySelector('.form-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = 'form-alert bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4';
    alert.textContent = message;

    form.insertBefore(alert, form.firstChild);

    // Remove alert after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
};

/**
 * Show form error message
 * @param {HTMLElement} form - Form element
 * @param {string} message - Error message
 */
const showFormError = (form, message) => {
    const existingAlert = form.querySelector('.form-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = 'form-alert bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
    alert.textContent = message;

    form.insertBefore(alert, form.firstChild);

    // Remove alert after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
};

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type
 */
const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    const colorClasses = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-yellow-600',
        info: 'bg-blue-600'
    };

    notification.className = `
        fixed top-4 right-4 ${colorClasses[type]} text-white px-6 py-4 rounded-lg shadow-lg z-50
        transition-all duration-300 transform translate-x-full max-w-sm
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.classList.remove('translate-x-full');
    });

    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
};

/**
 * Validate entire form
 * @param {string} formId - Form identifier
 * @returns {boolean} Validation result
 */
export const validateForm = (formId) => {
    const config = forms.get(formId);
    if (!config) return false;

    let isValid = true;
    Object.keys(config.fields).forEach(fieldName => {
        const fieldValid = validateField(formId, fieldName);
        if (!fieldValid) {
            isValid = false;
        }
    });

    return isValid;
};

/**
 * Reset form
 * @param {string} formId - Form identifier
 */
export const resetForm = (formId) => {
    const config = forms.get(formId);
    if (!config) return;

    const { form, fields } = config;

    form.reset();

    // Clear field states
    Object.values(fields).forEach(fieldConfig => {
        if (fieldConfig.element && fieldConfig.errorElement) {
            clearFieldError(fieldConfig.element, fieldConfig.errorElement);
        }
    });

    // Remove form alerts
    const alerts = form.querySelectorAll('.form-alert');
    alerts.forEach(alert => alert.remove());
};

/**
 * Get form data
 * @param {string} formId - Form identifier
 * @returns {Object} Form data
 */
export const getFormData = (formId) => {
    const config = forms.get(formId);
    if (!config) return {};

    const formData = {};
    Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
        if (fieldConfig.element) {
            const value = fieldConfig.element.value.trim();
            formData[fieldName] = fieldConfig.sanitize ? sanitizeHTML(value) : value;
        }
    });

    return formData;
};

export default {
    initializeForms,
    initializeForm,
    validateForm,
    resetForm,
    getFormData
};