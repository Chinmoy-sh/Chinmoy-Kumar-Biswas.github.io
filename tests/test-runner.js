#!/usr/bin/env node

/**
 * Master Test Runner for Portfolio Project
 * Orchestrates all testing and validation processes
 * 
 * @version 1.0.0
 * @author Chinmoy Kumar Biswas
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class TestRunner {
    constructor() {
        this.results = {
            unit: { passed: false, output: '' },
            integration: { passed: false, output: '' },
            e2e: { passed: false, output: '' },
            accessibility: { passed: false, output: '' },
            performance: { passed: false, output: '' },
            security: { passed: false, output: '' },
            crossBrowser: { passed: false, output: '' },
            validation: { passed: false, output: '' }
        };

        this.basePath = path.join(__dirname, '..');
        this.startTime = Date.now();
    }

    /**
     * Run all tests
     */
    async runAll() {
        console.log('🚀 Starting Comprehensive Test Suite\n');
        console.log('=====================================\n');

        try {
            // Create reports directory
            await this.ensureReportsDirectory();

            // Start local server for testing
            const server = await this.startTestServer();

            try {
                // Run all test suites
                await this.runUnitTests();
                await this.runIntegrationTests();
                await this.runE2ETests();
                await this.runAccessibilityTests();
                await this.runPerformanceTests();
                await this.runSecurityAudit();
                await this.runCrossBrowserTests();
                await this.runValidationTests();

                // Generate final report
                await this.generateFinalReport();

            } finally {
                // Stop test server
                if (server) {
                    server.kill();
                }
            }

        } catch (error) {
            console.error('❌ Test suite failed:', error);
            process.exit(1);
        }
    }

    /**
     * Ensure reports directory exists
     */
    async ensureReportsDirectory() {
        const dirs = [
            'tests/reports',
            'tests/reports/coverage',
            'tests/reports/playwright',
            'tests/reports/lighthouse',
            'tests/reports/accessibility'
        ];

        for (const dir of dirs) {
            const fullPath = path.join(this.basePath, dir);
            try {
                await fs.mkdir(fullPath, { recursive: true });
            } catch (error) {
                // Directory might already exist
            }
        }
    }

    /**
     * Start test server
     */
    async startTestServer() {
        return new Promise((resolve, reject) => {
            console.log('🔧 Starting test server...');

            const server = spawn('python', ['-m', 'http.server', '3000'], {
                cwd: this.basePath,
                stdio: 'pipe'
            });

            let serverReady = false;

            server.stdout.on('data', (data) => {
                if (data.toString().includes('Serving HTTP')) {
                    console.log('✅ Test server started on http://localhost:3000\n');
                    serverReady = true;
                    resolve(server);
                }
            });

            server.stderr.on('data', (data) => {
                console.error('Server error:', data.toString());
            });

            server.on('close', (code) => {
                if (!serverReady) {
                    reject(new Error(`Server failed to start (exit code ${code})`));
                }
            });

            // Timeout if server doesn't start
            setTimeout(() => {
                if (!serverReady) {
                    server.kill();
                    reject(new Error('Server start timeout'));
                }
            }, 10000);
        });
    }

    /**
     * Run unit tests
     */
    async runUnitTests() {
        console.log('🧪 Running Unit Tests...');

        try {
            const output = execSync('npm run test:unit', {
                cwd: path.join(this.basePath, 'tests'),
                encoding: 'utf8',
                stdio: 'pipe'
            });

            this.results.unit.passed = true;
            this.results.unit.output = output;
            console.log('✅ Unit tests passed\n');

        } catch (error) {
            this.results.unit.passed = false;
            this.results.unit.output = error.stdout || error.message;
            console.log('❌ Unit tests failed\n');
        }
    }

    /**
     * Run integration tests
     */
    async runIntegrationTests() {
        console.log('🔗 Running Integration Tests...');

        try {
            const output = execSync('npm run test:integration', {
                cwd: path.join(this.basePath, 'tests'),
                encoding: 'utf8',
                stdio: 'pipe'
            });

            this.results.integration.passed = true;
            this.results.integration.output = output;
            console.log('✅ Integration tests passed\n');

        } catch (error) {
            this.results.integration.passed = false;
            this.results.integration.output = error.stdout || error.message;
            console.log('❌ Integration tests failed\n');
        }
    }

    /**
     * Run E2E tests
     */
    async runE2ETests() {
        console.log('🎭 Running E2E Tests...');

        try {
            const output = execSync('npm run test:e2e', {
                cwd: path.join(this.basePath, 'tests'),
                encoding: 'utf8',
                stdio: 'pipe'
            });

            this.results.e2e.passed = true;
            this.results.e2e.output = output;
            console.log('✅ E2E tests passed\n');

        } catch (error) {
            this.results.e2e.passed = false;
            this.results.e2e.output = error.stdout || error.message;
            console.log('❌ E2E tests failed\n');
        }
    }

    /**
     * Run accessibility tests
     */
    async runAccessibilityTests() {
        console.log('♿ Running Accessibility Tests...');

        try {
            const output = execSync('npm run test:accessibility', {
                cwd: path.join(this.basePath, 'tests'),
                encoding: 'utf8',
                stdio: 'pipe'
            });

            this.results.accessibility.passed = true;
            this.results.accessibility.output = output;
            console.log('✅ Accessibility tests passed\n');

        } catch (error) {
            this.results.accessibility.passed = false;
            this.results.accessibility.output = error.stdout || error.message;
            console.log('❌ Accessibility tests failed\n');
        }
    }

    /**
     * Run performance tests
     */
    async runPerformanceTests() {
        console.log('⚡ Running Performance Tests...');

        try {
            const output = execSync('npm run test:performance', {
                cwd: path.join(this.basePath, 'tests'),
                encoding: 'utf8',
                stdio: 'pipe'
            });

            this.results.performance.passed = true;
            this.results.performance.output = output;
            console.log('✅ Performance tests passed\n');

        } catch (error) {
            this.results.performance.passed = false;
            this.results.performance.output = error.stdout || error.message;
            console.log('❌ Performance tests failed\n');
        }
    }

    /**
     * Run security audit
     */
    async runSecurityAudit() {
        console.log('🔒 Running Security Audit...');

        try {
            const output = execSync('npm run test:security', {
                cwd: path.join(this.basePath, 'tests'),
                encoding: 'utf8',
                stdio: 'pipe'
            });

            this.results.security.passed = true;
            this.results.security.output = output;
            console.log('✅ Security audit passed\n');

        } catch (error) {
            this.results.security.passed = false;
            this.results.security.output = error.stdout || error.message;
            console.log('❌ Security audit failed\n');
        }
    }

    /**
     * Run cross-browser tests
     */
    async runCrossBrowserTests() {
        console.log('🌐 Running Cross-Browser Tests...');

        try {
            const output = execSync('npm run test:cross-browser', {
                cwd: path.join(this.basePath, 'tests'),
                encoding: 'utf8',
                stdio: 'pipe'
            });

            this.results.crossBrowser.passed = true;
            this.results.crossBrowser.output = output;
            console.log('✅ Cross-browser tests passed\n');

        } catch (error) {
            this.results.crossBrowser.passed = false;
            this.results.crossBrowser.output = error.stdout || error.message;
            console.log('❌ Cross-browser tests failed\n');
        }
    }

    /**
     * Run validation tests
     */
    async runValidationTests() {
        console.log('✅ Running Code Validation...');

        try {
            const output = execSync('npm run validate:all', {
                cwd: path.join(this.basePath, 'tests'),
                encoding: 'utf8',
                stdio: 'pipe'
            });

            this.results.validation.passed = true;
            this.results.validation.output = output;
            console.log('✅ Code validation passed\n');

        } catch (error) {
            this.results.validation.passed = false;
            this.results.validation.output = error.stdout || error.message;
            console.log('❌ Code validation failed\n');
        }
    }

    /**
     * Generate final comprehensive report
     */
    async generateFinalReport() {
        const endTime = Date.now();
        const duration = ((endTime - this.startTime) / 1000).toFixed(2);

        console.log('\n📊 Test Suite Summary');
        console.log('=====================\n');

        const testSuites = Object.keys(this.results);
        const passedSuites = testSuites.filter(suite => this.results[suite].passed);
        const failedSuites = testSuites.filter(suite => !this.results[suite].passed);

        console.log(`Total Test Suites: ${testSuites.length}`);
        console.log(`Passed: ${passedSuites.length} ✅`);
        console.log(`Failed: ${failedSuites.length} ❌`);
        console.log(`Duration: ${duration}s\n`);

        // Detailed results
        testSuites.forEach(suite => {
            const status = this.results[suite].passed ? '✅' : '❌';
            const suiteName = suite.charAt(0).toUpperCase() + suite.slice(1);
            console.log(`${status} ${suiteName} Tests`);
        });

        console.log('\n');

        // Overall status
        const overallPassed = failedSuites.length === 0;
        if (overallPassed) {
            console.log('🎉 All tests passed! Portfolio is production ready! 🚀');
        } else {
            console.log('⚠️  Some tests failed. Please review the results above.');
        }

        // Save detailed report
        const report = {
            timestamp: new Date().toISOString(),
            duration: parseFloat(duration),
            overall: {
                passed: overallPassed,
                totalSuites: testSuites.length,
                passedSuites: passedSuites.length,
                failedSuites: failedSuites.length
            },
            results: this.results,
            summary: {
                passed: passedSuites,
                failed: failedSuites
            }
        };

        const reportPath = path.join(this.basePath, 'tests/reports/final-test-report.json');
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

        console.log(`\n📄 Detailed report saved to: ${reportPath}`);

        // Exit with appropriate code
        if (!overallPassed) {
            process.exit(1);
        }
    }
}

// CLI interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const runner = new TestRunner();

    if (args.length === 0) {
        runner.runAll().catch(error => {
            console.error('Test runner error:', error);
            process.exit(1);
        });
    } else {
        console.log('Available commands:');
        console.log('  npm test         - Run all tests');
        console.log('  npm run test:unit - Run unit tests only');
        console.log('  npm run test:e2e  - Run E2E tests only');
        console.log('  npm run validate:all - Run all validation');
    }
}

module.exports = TestRunner;