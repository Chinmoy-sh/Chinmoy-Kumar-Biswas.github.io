# Testing Framework Documentation

## Overview

This comprehensive testing framework provides complete quality assurance for the Chinmoy Kumar
Biswas portfolio project. It includes unit tests, integration tests, end-to-end tests,
accessibility testing, performance auditing, security validation, and cross-browser
compatibility testing.

## Test Structure

```text
tests/
├── package.json              # Testing dependencies
├── test-runner.js            # Master test orchestrator
├── config/                   # Test configurations
│   ├── jest.config.js       # Jest configuration
│   ├── playwright.config.js # Playwright configuration
│   ├── pa11y.json           # Accessibility testing config
│   └── lighthouse.json      # Performance testing config
├── setup/                   # Test setup files
│   └── jest.setup.js       # Jest global setup
├── unit/                    # Unit tests
│   └── performance.test.js  # Performance utilities tests
├── integration/             # Integration tests
├── e2e/                     # End-to-end tests
│   └── portfolio.test.js    # Main portfolio E2E tests
├── cross-browser/           # Cross-browser tests
│   └── compatibility.test.js # Browser compatibility tests
├── security/                # Security tests
│   └── security-audit.js    # Security audit script
└── reports/                 # Generated test reports
    ├── coverage/           # Code coverage reports
    ├── playwright/         # E2E test reports
    ├── lighthouse/         # Performance reports
    └── accessibility/      # Accessibility reports
```

## Available Test Commands

### Complete Test Suite

```bash
# Run all tests
npm test

# Run master test runner
node tests/test-runner.js
```

### Individual Test Suites

```bash
# Unit tests
npm run test:unit

# Integration tests  
npm run test:integration

# End-to-end tests
npm run test:e2e

# Accessibility tests
npm run test:accessibility

# Performance tests
npm run test:performance

# Security audit
npm run test:security

# Cross-browser tests
npm run test:cross-browser
```

### Code Validation

```bash
# HTML validation
npm run validate:html

# CSS validation
npm run validate:css

# JavaScript validation
npm run validate:js

# Link validation
npm run validate:links

# All validation
npm run validate:all
```

### Coverage and Monitoring

```bash
# Generate coverage report
npm run coverage

# Watch mode for development
npm run test:watch
```

## Test Categories

### 1. Unit Tests

- **Framework**: Jest with jsdom
- **Coverage**: Performance monitoring, resource optimization, image optimization
- **Location**: `tests/unit/`
- **Focuses on**: Individual function and class testing

### 2. Integration Tests

- **Framework**: Jest with Playwright
- **Coverage**: Component interactions, API integrations
- **Location**: `tests/integration/`
- **Focuses on**: Module interaction testing

### 3. End-to-End Tests

- **Framework**: Playwright
- **Coverage**: Full user workflows, navigation, forms, theme switching
- **Location**: `tests/e2e/`
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari, Tablet

### 4. Cross-Browser Tests

- **Framework**: Playwright with multiple device configs
- **Coverage**: Responsive design, feature compatibility, performance across browsers
- **Location**: `tests/cross-browser/`
- **Devices**: Desktop Chrome/Firefox/Safari, iPhone 12, iPad Pro, Galaxy S21

### 5. Accessibility Tests

- **Framework**: Pa11y-CI
- **Standards**: WCAG 2.1 AA compliance
- **Coverage**: All major page sections, keyboard navigation, screen reader compatibility
- **Reports**: Visual screenshots and detailed accessibility reports

### 6. Performance Tests

- **Framework**: Lighthouse CI
- **Metrics**: Core Web Vitals, Performance score, Best practices
- **Thresholds**: Performance >80%, Accessibility >90%, Best Practices >80%, SEO >90%
- **Coverage**: Load times, resource optimization, caching effectiveness

### 7. Security Tests

- **Framework**: Custom security auditor
- **Coverage**: XSS prevention, CSP validation, secure headers, input sanitization
- **Scans**: HTML, CSS, JavaScript, configuration files
- **Reports**: Vulnerability classification with severity levels

## Configuration Details

### Jest Configuration

- **Environment**: jsdom for DOM simulation
- **Coverage**: 70% threshold for branches, functions, lines, statements  
- **Setup**: Global mocks for browser APIs, performance APIs, storage APIs
- **Reporters**: HTML, text, JSON, LCOV formats

### Playwright Configuration

- **Timeout**: 30 seconds per test
- **Retries**: 2 retries in CI environment
- **Screenshots**: On failure only
- **Video**: Retained on failure
- **Trace**: On first retry

### Pa11y Configuration

- **Standard**: WCAG2AA
- **Wait time**: 2 seconds for dynamic content
- **Screenshots**: Generated for each tested page
- **Ignore**: Specific non-critical warnings

### Lighthouse Configuration

- **Runs**: 3 runs per test for accuracy
- **Thresholds**: High standards for production readiness
- **Output**: Filesystem storage with detailed reports

## Quality Gates

### Code Coverage Requirements

- **Branches**: ≥70%
- **Functions**: ≥70%
- **Lines**: ≥70%  
- **Statements**: ≥70%

### Performance Requirements

- **Performance Score**: ≥80/100
- **Accessibility Score**: ≥90/100
- **Best Practices Score**: ≥80/100
- **SEO Score**: ≥90/100
- **PWA Score**: ≥80/100

### Security Requirements

- **No high-severity vulnerabilities**
- **CSP implementation required**
- **Input sanitization validated**
- **Secure headers confirmed**

### Accessibility Requirements

- **WCAG 2.1 AA compliance**
- **Keyboard navigation support**
- **Screen reader compatibility**
- **Semantic HTML structure**

## Continuous Integration

The testing framework is designed for CI/CD integration:

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: cd tests && npm install

- name: Start test server
  run: python -m http.server 3000 &

- name: Run test suite
  run: node tests/test-runner.js

- name: Upload test reports
  uses: actions/upload-artifact@v3
  with:
    name: test-reports
    path: tests/reports/
```

## Debugging Tests

### Local Development

```bash
# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- performance.test.js

# Run with coverage
npm run coverage
```

### Browser Testing

```bash
# Debug Playwright tests
npx playwright test --debug

# Show browser during tests  
npx playwright test --headed

# Generate trace
npx playwright test --trace on
```

### Performance Debugging

```bash
# Run Lighthouse locally
npx lighthouse http://localhost:3000 --output=html --output-path=report.html

# Run accessibility audit
npx pa11y http://localhost:3000
```

## Maintenance

### Updating Dependencies

```bash
# Update testing dependencies
cd tests && npm update

# Check for security vulnerabilities
npm audit
```

### Adding New Tests

1. Create test files in appropriate directory
2. Follow existing naming conventions
3. Update test runner if needed
4. Document new test coverage

### Modifying Thresholds

- Update configuration files in `tests/config/`
- Adjust quality gates in test runner
- Update documentation accordingly

## Reporting

All test runs generate comprehensive reports:

- **Coverage Reports**: HTML and LCOV formats
- **E2E Reports**: Screenshots, videos, traces
- **Performance Reports**: Lighthouse detailed analysis  
- **Accessibility Reports**: WCAG compliance details
- **Security Reports**: Vulnerability assessments
- **Final Report**: JSON summary of all test results

Reports are saved to `tests/reports/` with timestamps for historical tracking.

## Troubleshooting

### Common Issues

1. **Server start failures**
   - Ensure port 3000 is available
   - Check Python installation

2. **Browser launch errors**
   - Install Playwright browsers: `npx playwright install`
   - Check system dependencies

3. **Coverage threshold failures**
   - Review uncovered code paths  
   - Add missing test cases

4. **Performance test failures**
   - Check network conditions
   - Review resource optimization

For detailed troubleshooting, check the generated reports in `tests/reports/`.
