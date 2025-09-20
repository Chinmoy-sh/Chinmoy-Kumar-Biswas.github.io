/**
 * Jest Configuration for Portfolio Testing
 * Unit and integration testing setup
 * 
 * @version 1.0.0
 * @author Chinmoy Kumar Biswas
 */

module.exports = {
    // Test environment
    testEnvironment: 'jsdom',

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/setup/jest.setup.js'],

    // Test file patterns
    testMatch: [
        '<rootDir>/../unit/**/*.test.js',
        '<rootDir>/../integration/**/*.test.js'
    ],

    // Module paths
    roots: ['<rootDir>/..'],

    // Module name mapping
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/../../assets/js/$1',
        '^@css/(.*)$': '<rootDir>/../../assets/css/$1',
        '^@utils/(.*)$': '<rootDir>/../../assets/js/utils/$1',
        '^@components/(.*)$': '<rootDir>/../../assets/js/components/$1'
    },

    // Transform files
    transform: {
        '^.+\\.js$': 'babel-jest'
    },

    // Coverage configuration
    collectCoverage: true,
    coverageDirectory: '<rootDir>/../reports/coverage',
    coverageReporters: ['html', 'text', 'json', 'lcov'],

    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },

    // Files to collect coverage from
    collectCoverageFrom: [
        '../../assets/js/**/*.js',
        '!../../assets/js/**/*.min.js',
        '!../../assets/js/vendor/**',
        '!**/node_modules/**'
    ],

    // Test timeout
    testTimeout: 10000,

    // Verbose output
    verbose: true,

    // Mock configuration
    clearMocks: true,
    restoreMocks: true,

    // Module file extensions
    moduleFileExtensions: ['js', 'json'],

    // Global test variables
    globals: {
        'jest': true,
        'window': true,
        'document': true,
        'navigator': true
    }
};