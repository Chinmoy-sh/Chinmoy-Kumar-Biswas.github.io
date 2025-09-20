/**
 * Security Testing and Audit Script
 * Comprehensive security validation for the portfolio
 * 
 * @version 1.0.0
 * @author Chinmoy Kumar Biswas
 */

const fs = require('fs').promises;
const path = require('path');

class SecurityAuditor {
    constructor() {
        this.vulnerabilities = [];
        this.warnings = [];
        this.recommendations = [];
        this.basePath = path.join(__dirname, '../../');
    }

    /**
     * Run comprehensive security audit
     */
    async runAudit() {
        console.log('🔒 Starting Security Audit...\n');

        try {
            await this.checkHTMLSecurity();
            await this.checkCSSSecurity();
            await this.checkJavaScriptSecurity();
            await this.checkConfigurationSecurity();
            await this.checkContentSecurityPolicy();
            await this.generateReport();
        } catch (error) {
            console.error('❌ Security audit failed:', error);
            process.exit(1);
        }
    }

    /**
     * Check HTML security issues
     */
    async checkHTMLSecurity() {
        console.log('📄 Checking HTML Security...');

        try {
            const htmlContent = await fs.readFile(path.join(this.basePath, 'index.html'), 'utf8');

            // Check for inline scripts without nonce
            const inlineScripts = htmlContent.match(/<script(?![^>]*src=)[^>]*>/g);
            if (inlineScripts && inlineScripts.length > 0) {
                this.warnings.push({
                    type: 'HTML',
                    issue: 'Inline scripts detected',
                    description: 'Consider using external scripts or adding nonce attributes for CSP compliance',
                    severity: 'medium'
                });
            }

            // Check for inline styles without nonce
            const inlineStyles = htmlContent.match(/<style[^>]*>/g);
            if (inlineStyles && inlineStyles.length > 0) {
                this.warnings.push({
                    type: 'HTML',
                    issue: 'Inline styles detected',
                    description: 'Consider using external stylesheets for better CSP compliance',
                    severity: 'low'
                });
            }

            // Check for external links without rel="noopener"
            const externalLinks = htmlContent.match(/<a[^>]+href=["']https?:\/\/[^"']*["'][^>]*target=["']_blank["'][^>]*>/g);
            if (externalLinks) {
                const unsafeLinks = externalLinks.filter(link => !link.includes('rel="noopener"'));
                if (unsafeLinks.length > 0) {
                    this.vulnerabilities.push({
                        type: 'HTML',
                        issue: 'Unsafe external links',
                        description: 'External links with target="_blank" should include rel="noopener" to prevent window.opener attacks',
                        severity: 'medium',
                        count: unsafeLinks.length
                    });
                }
            }

            // Check for form actions
            const forms = htmlContent.match(/<form[^>]*>/g);
            if (forms) {
                forms.forEach(form => {
                    if (!form.includes('method=') || form.includes('method="get"')) {
                        this.warnings.push({
                            type: 'HTML',
                            issue: 'Form without POST method',
                            description: 'Forms handling sensitive data should use POST method',
                            severity: 'low'
                        });
                    }
                });
            }

            // Check for CSP meta tag
            const cspMeta = htmlContent.match(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/i);
            if (!cspMeta) {
                this.warnings.push({
                    type: 'HTML',
                    issue: 'No Content Security Policy meta tag',
                    description: 'Consider adding a CSP meta tag for additional security',
                    severity: 'medium'
                });
            }

            console.log('✅ HTML Security Check Complete');
        } catch (error) {
            console.log('⚠️  Could not read index.html');
        }
    }

    /**
     * Check CSS security issues
     */
    async checkCSSSecurity() {
        console.log('🎨 Checking CSS Security...');

        try {
            const cssFiles = await this.findFiles(path.join(this.basePath, 'assets/css'), '.css');

            for (const file of cssFiles) {
                const cssContent = await fs.readFile(file, 'utf8');

                // Check for external font imports
                const fontImports = cssContent.match(/@import[^;]*fonts\.(googleapis|gstatic)\.com[^;]*;/g);
                if (fontImports) {
                    this.warnings.push({
                        type: 'CSS',
                        issue: 'External font imports',
                        description: 'Consider self-hosting fonts for better privacy and security',
                        severity: 'low',
                        file: path.basename(file)
                    });
                }

                // Check for javascript: URLs
                const jsUrls = cssContent.match(/javascript:/gi);
                if (jsUrls) {
                    this.vulnerabilities.push({
                        type: 'CSS',
                        issue: 'JavaScript URLs in CSS',
                        description: 'JavaScript URLs in CSS can be exploited for XSS attacks',
                        severity: 'high',
                        file: path.basename(file)
                    });
                }

                // Check for data URIs
                const dataUris = cssContent.match(/url\s*\(\s*["']?data:/gi);
                if (dataUris && dataUris.length > 10) {
                    this.warnings.push({
                        type: 'CSS',
                        issue: 'Many data URIs',
                        description: 'Consider optimizing large number of data URIs for performance',
                        severity: 'low',
                        file: path.basename(file),
                        count: dataUris.length
                    });
                }
            }

            console.log('✅ CSS Security Check Complete');
        } catch (error) {
            console.log('⚠️  Could not check CSS files:', error.message);
        }
    }

    /**
     * Check JavaScript security issues
     */
    async checkJavaScriptSecurity() {
        console.log('📜 Checking JavaScript Security...');

        try {
            const jsFiles = await this.findFiles(path.join(this.basePath, 'assets/js'), '.js');

            for (const file of jsFiles) {
                const jsContent = await fs.readFile(file, 'utf8');

                // Check for eval usage
                const evalUsage = jsContent.match(/\beval\s*\(/g);
                if (evalUsage) {
                    this.vulnerabilities.push({
                        type: 'JavaScript',
                        issue: 'eval() usage detected',
                        description: 'eval() can be dangerous and should be avoided',
                        severity: 'high',
                        file: path.basename(file),
                        count: evalUsage.length
                    });
                }

                // Check for innerHTML usage
                const innerHTMLUsage = jsContent.match(/\.innerHTML\s*=/g);
                if (innerHTMLUsage) {
                    this.warnings.push({
                        type: 'JavaScript',
                        issue: 'innerHTML usage detected',
                        description: 'Consider using textContent or proper sanitization to prevent XSS',
                        severity: 'medium',
                        file: path.basename(file),
                        count: innerHTMLUsage.length
                    });
                }

                // Check for document.write usage
                const documentWrite = jsContent.match(/document\.write\s*\(/g);
                if (documentWrite) {
                    this.vulnerabilities.push({
                        type: 'JavaScript',
                        issue: 'document.write usage',
                        description: 'document.write can be dangerous and is deprecated',
                        severity: 'medium',
                        file: path.basename(file),
                        count: documentWrite.length
                    });
                }

                // Check for localStorage without error handling
                const localStorageUsage = jsContent.match(/localStorage\.(setItem|getItem)/g);
                if (localStorageUsage) {
                    const hasErrorHandling = jsContent.includes('try') || jsContent.includes('catch');
                    if (!hasErrorHandling) {
                        this.warnings.push({
                            type: 'JavaScript',
                            issue: 'localStorage without error handling',
                            description: 'localStorage operations should include error handling',
                            severity: 'low',
                            file: path.basename(file)
                        });
                    }
                }

                // Check for console.log in production code
                const consoleLogs = jsContent.match(/console\.log\s*\(/g);
                if (consoleLogs && consoleLogs.length > 5) {
                    this.warnings.push({
                        type: 'JavaScript',
                        issue: 'Many console.log statements',
                        description: 'Consider removing debug console.log statements for production',
                        severity: 'low',
                        file: path.basename(file),
                        count: consoleLogs.length
                    });
                }

                // Check for hardcoded secrets (basic patterns)
                const secretPatterns = [
                    /api[_-]?key['"]\s*[:=]\s*['"][^'"]{20,}['"]/gi,
                    /secret['"]\s*[:=]\s*['"][^'"]{10,}['"]/gi,
                    /password['"]\s*[:=]\s*['"][^'"]{8,}['"]/gi
                ];

                secretPatterns.forEach(pattern => {
                    const matches = jsContent.match(pattern);
                    if (matches) {
                        this.vulnerabilities.push({
                            type: 'JavaScript',
                            issue: 'Possible hardcoded secret',
                            description: 'Potential hardcoded API key or secret detected',
                            severity: 'high',
                            file: path.basename(file),
                            count: matches.length
                        });
                    }
                });
            }

            console.log('✅ JavaScript Security Check Complete');
        } catch (error) {
            console.log('⚠️  Could not check JavaScript files:', error.message);
        }
    }

    /**
     * Check configuration security
     */
    async checkConfigurationSecurity() {
        console.log('⚙️  Checking Configuration Security...');

        try {
            // Check service worker security
            const swPath = path.join(this.basePath, 'sw.js');
            const swContent = await fs.readFile(swPath, 'utf8');

            // Check for broad cache patterns
            const broadPatterns = swContent.match(/\*\*\/\*/g);
            if (broadPatterns) {
                this.warnings.push({
                    type: 'Configuration',
                    issue: 'Broad cache patterns',
                    description: 'Consider more specific cache patterns for security',
                    severity: 'low'
                });
            }

            // Check for CORS headers in SW
            const corsHeaders = swContent.match(/Access-Control-Allow-Origin.*\*/g);
            if (corsHeaders) {
                this.warnings.push({
                    type: 'Configuration',
                    issue: 'Permissive CORS in Service Worker',
                    description: 'Wildcard CORS headers can be security risk',
                    severity: 'medium'
                });
            }

        } catch (error) {
            console.log('⚠️  Could not check service worker');
        }

        // Check for sensitive files
        const sensitiveFiles = ['.env', '.env.local', 'config.json', 'secrets.json'];
        for (const file of sensitiveFiles) {
            try {
                await fs.access(path.join(this.basePath, file));
                this.vulnerabilities.push({
                    type: 'Configuration',
                    issue: 'Sensitive file exposed',
                    description: `File ${file} should not be publicly accessible`,
                    severity: 'high'
                });
            } catch (error) {
                // File doesn't exist, which is good
            }
        }

        console.log('✅ Configuration Security Check Complete');
    }

    /**
     * Check Content Security Policy
     */
    async checkContentSecurityPolicy() {
        console.log('🛡️  Checking Content Security Policy...');

        try {
            const htmlContent = await fs.readFile(path.join(this.basePath, 'index.html'), 'utf8');
            const cspMatch = htmlContent.match(/content=["']([^"']*Content-Security-Policy[^"']*)["']/i);

            if (cspMatch) {
                const csp = cspMatch[1];

                // Check for unsafe-inline
                if (csp.includes("'unsafe-inline'")) {
                    this.warnings.push({
                        type: 'CSP',
                        issue: 'unsafe-inline in CSP',
                        description: 'Consider using nonces or hashes instead of unsafe-inline',
                        severity: 'medium'
                    });
                }

                // Check for unsafe-eval
                if (csp.includes("'unsafe-eval'")) {
                    this.vulnerabilities.push({
                        type: 'CSP',
                        issue: 'unsafe-eval in CSP',
                        description: 'unsafe-eval allows dangerous dynamic code execution',
                        severity: 'high'
                    });
                }

                // Check for missing directives
                const requiredDirectives = ['default-src', 'script-src', 'style-src', 'img-src'];
                const missingDirectives = requiredDirectives.filter(directive => !csp.includes(directive));

                if (missingDirectives.length > 0) {
                    this.warnings.push({
                        type: 'CSP',
                        issue: 'Missing CSP directives',
                        description: `Missing: ${missingDirectives.join(', ')}`,
                        severity: 'medium'
                    });
                }

                this.recommendations.push({
                    type: 'CSP',
                    suggestion: 'Consider implementing CSP reporting for monitoring violations'
                });
            } else {
                this.vulnerabilities.push({
                    type: 'CSP',
                    issue: 'No Content Security Policy',
                    description: 'Implementing CSP helps prevent XSS and other attacks',
                    severity: 'high'
                });
            }

            console.log('✅ CSP Check Complete');
        } catch (error) {
            console.log('⚠️  Could not check CSP');
        }
    }

    /**
     * Find files with specific extension
     */
    async findFiles(dir, extension) {
        const files = [];

        try {
            const items = await fs.readdir(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = await fs.stat(fullPath);

                if (stat.isDirectory()) {
                    files.push(...await this.findFiles(fullPath, extension));
                } else if (item.endsWith(extension)) {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            // Directory might not exist
        }

        return files;
    }

    /**
     * Generate comprehensive security report
     */
    async generateReport() {
        console.log('\n📊 Security Audit Report');
        console.log('========================\n');

        const totalIssues = this.vulnerabilities.length + this.warnings.length;

        if (totalIssues === 0) {
            console.log('🎉 No security issues found!\n');
        } else {
            console.log(`Found ${totalIssues} total issues:\n`);
        }

        // High severity vulnerabilities
        const highSeverity = this.vulnerabilities.filter(v => v.severity === 'high');
        if (highSeverity.length > 0) {
            console.log('🔴 HIGH SEVERITY VULNERABILITIES:');
            highSeverity.forEach(v => {
                console.log(`   • ${v.issue} (${v.type})`);
                console.log(`     ${v.description}`);
                if (v.file) console.log(`     File: ${v.file}`);
                if (v.count) console.log(`     Occurrences: ${v.count}`);
                console.log();
            });
        }

        // Medium severity issues
        const mediumSeverity = [...this.vulnerabilities, ...this.warnings].filter(i => i.severity === 'medium');
        if (mediumSeverity.length > 0) {
            console.log('🟡 MEDIUM SEVERITY ISSUES:');
            mediumSeverity.forEach(i => {
                console.log(`   • ${i.issue} (${i.type})`);
                console.log(`     ${i.description}`);
                if (i.file) console.log(`     File: ${i.file}`);
                if (i.count) console.log(`     Occurrences: ${i.count}`);
                console.log();
            });
        }

        // Low severity warnings
        const lowSeverity = this.warnings.filter(w => w.severity === 'low');
        if (lowSeverity.length > 0) {
            console.log('🟢 LOW SEVERITY WARNINGS:');
            lowSeverity.forEach(w => {
                console.log(`   • ${w.issue} (${w.type})`);
                console.log(`     ${w.description}`);
                if (w.file) console.log(`     File: ${w.file}`);
                if (w.count) console.log(`     Occurrences: ${w.count}`);
                console.log();
            });
        }

        // Recommendations
        if (this.recommendations.length > 0) {
            console.log('💡 RECOMMENDATIONS:');
            this.recommendations.forEach(r => {
                console.log(`   • ${r.suggestion} (${r.type})`);
            });
            console.log();
        }

        // Security score
        const score = Math.max(0, 100 - (highSeverity.length * 20) - (mediumSeverity.length * 10) - (lowSeverity.length * 5));
        console.log(`🏆 Security Score: ${score}/100`);

        if (score >= 90) {
            console.log('   Excellent security posture! 🛡️');
        } else if (score >= 70) {
            console.log('   Good security with room for improvement. 👍');
        } else if (score >= 50) {
            console.log('   Security needs attention. ⚠️');
        } else {
            console.log('   Critical security issues need immediate attention! 🚨');
        }

        // Save report to file
        const reportData = {
            timestamp: new Date().toISOString(),
            score,
            vulnerabilities: this.vulnerabilities,
            warnings: this.warnings,
            recommendations: this.recommendations
        };

        await fs.writeFile(
            path.join(this.basePath, 'tests/reports/security-report.json'),
            JSON.stringify(reportData, null, 2)
        );

        console.log('\n📄 Detailed report saved to tests/reports/security-report.json');

        // Exit with error code if high severity issues found
        if (highSeverity.length > 0) {
            console.log('\n❌ Security audit failed due to high severity vulnerabilities.');
            process.exit(1);
        }
    }
}

// Run audit if called directly
if (require.main === module) {
    const auditor = new SecurityAuditor();
    auditor.runAudit().catch(error => {
        console.error('Security audit error:', error);
        process.exit(1);
    });
}

module.exports = SecurityAuditor;