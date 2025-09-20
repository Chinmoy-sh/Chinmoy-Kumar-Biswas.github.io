import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                navigator: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                fetch: 'readonly',
                URL: 'readonly',
                URLSearchParams: 'readonly',
                IntersectionObserver: 'readonly',
                PerformanceObserver: 'readonly',
                ResizeObserver: 'readonly',
                MutationObserver: 'readonly',
                requestAnimationFrame: 'readonly',
                cancelAnimationFrame: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                THREE: 'readonly' // For Three.js
            }
        },
        rules: {
            // Error Prevention
            'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
            'no-console': 'warn',
            'no-debugger': 'error',
            'no-alert': 'warn',

            // Code Quality
            'prefer-const': 'error',
            'no-var': 'error',
            'prefer-arrow-functions': 'off',
            'arrow-spacing': 'error',
            'prefer-template': 'error',

            // Style Consistency
            'indent': ['error', 2],
            'quotes': ['error', 'single', { 'avoidEscape': true }],
            'semi': ['error', 'always'],
            'comma-dangle': ['error', 'never'],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],

            // Modern JavaScript
            'prefer-destructuring': ['error', {
                'array': true,
                'object': true
            }],
            'prefer-spread': 'error',
            'prefer-rest-params': 'error',

            // Functions
            'func-style': ['error', 'declaration', { 'allowArrowFunctions': true }],
            'no-unused-expressions': 'error',
            'consistent-return': 'error',

            // Error Handling
            'no-throw-literal': 'error',
            'prefer-promise-reject-errors': 'error',

            // Performance
            'no-loop-func': 'error',
            'no-await-in-loop': 'warn'
        }
    },
    {
        files: ['config/*.js'],
        rules: {
            'no-unused-vars': 'off' // Config files may export unused variables
        }
    }
];