# Security Configuration

This document outlines the security configuration and best practices implemented in this portfolio.

## Content Security Policy (CSP)

### Recommended CSP Headers

For production deployment, add these security headers to your web server configuration:

```nginx
# Nginx Configuration
add_header Content-Security-Policy "default-src 'self'; 
    script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; 
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; 
    font-src 'self' https://fonts.gstatic.com; 
    img-src 'self' data: https:; 
    connect-src 'self' https:; 
    media-src 'self'; 
    object-src 'none'; 
    frame-src 'none'; 
    base-uri 'self'; 
    form-action 'self'; 
    frame-ancestors 'none';";
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy strict-origin-when-cross-origin;
add_header Permissions-Policy "camera=(), microphone=(), location=(), payment=()";
```

```apache
# Apache Configuration
Header always set Content-Security-Policy "default-src 'self'; 
    script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; 
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; 
    font-src 'self' https://fonts.gstatic.com; 
    img-src 'self' data: https:; 
    connect-src 'self' https:; 
    media-src 'self'; 
    object-src 'none'; 
    frame-src 'none'; 
    base-uri 'self'; 
    form-action 'self'; 
    frame-ancestors 'none';"
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy strict-origin-when-cross-origin
Header always set Permissions-Policy "camera=(), microphone=(), location=(), payment=()"
```

### CSP Breakdown

- **default-src 'self'**: Only allow resources from the same origin by default
- **script-src**: Allow scripts from self and trusted CDNs
- **style-src**: Allow styles from self, inline styles, and font services
- **font-src**: Allow fonts from self and Google Fonts
- **img-src**: Allow images from self, data URIs, and HTTPS sources
- **object-src 'none'**: Disable plugins like Flash
- **frame-src 'none'**: Prevent framing attacks
- **base-uri 'self'**: Restrict base tag to same origin

## Security Headers

### X-Content-Type-Options

Prevents MIME type sniffing attacks by ensuring browsers respect declared content types.

### X-Frame-Options

Prevents clickjacking attacks by denying the page from being embedded in frames.

### X-XSS-Protection

Enables browser's built-in XSS protection (legacy support).

### Referrer-Policy

Controls how much referrer information is sent with requests.

### Permissions-Policy

Restricts access to browser features like camera, microphone, and location.

## Input Validation & Sanitization

### Form Security

All form inputs are validated and sanitized:

```javascript
// Input sanitization
function sanitizeInput(input) {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .substring(0, 1000);   // Limit length
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
```

### Client-Side Validation

- Real-time form validation
- Input length restrictions
- Format validation (email, phone)
- XSS prevention through input sanitization

## HTTPS & Transport Security

### Strict Transport Security (HSTS)

Add HSTS header for enhanced security:

```git
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Certificate Configuration

- Use valid SSL/TLS certificates
- Enable HTTP/2 for improved performance
- Configure secure cipher suites
- Disable weak protocols (SSLv3, TLS 1.0, TLS 1.1)

## Third-Party Resources

### Trusted CDNs Only

- Google Fonts: `fonts.googleapis.com`, `fonts.gstatic.com`
- Three.js CDN: `cdn.jsdelivr.net`, `cdnjs.cloudflare.com`
- All CDNs use HTTPS and integrity checks where possible

### Subresource Integrity (SRI)

For critical external resources, implement SRI hashes:

```html
<script src="https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.min.js"
        integrity="sha384-..."
        crossorigin="anonymous"></script>
```

## Privacy & Data Protection

### No Tracking

- No Google Analytics or tracking scripts
- No third-party cookies
- No personal data collection without consent
- Local storage used only for user preferences (theme)

### GDPR Compliance

- Clear privacy policy
- No data collection without consent
- User control over stored preferences
- Right to data deletion (localStorage clear)

## Vulnerability Prevention

### Cross-Site Scripting (XSS)

- Input sanitization
- Content Security Policy
- No `eval()` or dangerous functions
- Proper output encoding

### Cross-Site Request Forgery (CSRF)

- Same-origin policy enforcement
- No state-changing GET requests
- Form validation and confirmation

### Content Injection

- Strict CSP policy
- Input validation
- Output encoding
- No dynamic script generation

## Security Monitoring

### Error Handling

```javascript
// Secure error handling
window.addEventListener('error', (event) => {
    // Log error without exposing sensitive information
    console.error('Application error:', {
        message: event.message,
        source: event.filename,
        line: event.lineno
    });
    
    // Don't expose error details to users
    if (CONFIG.features.debugMode) {
        console.error('Debug info:', event);
    }
});
```

### Security Checklist

- [ ] CSP headers implemented
- [ ] All security headers configured
- [ ] HTTPS enforced
- [ ] Input validation in place
- [ ] No XSS vulnerabilities
- [ ] No sensitive data exposure
- [ ] Third-party resources secured
- [ ] Error handling implemented
- [ ] Security monitoring active

## Regular Security Updates

1. **Monthly Reviews**: Check for new vulnerabilities
2. **Dependency Updates**: Keep all dependencies current
3. **Security Audits**: Regular `npm audit` runs
4. **Penetration Testing**: Periodic security assessments
5. **Monitoring**: Continuous security monitoring

## Reporting Security Issues

If you discover a security vulnerability, please send an email to:
**bangladeshchinmoy@gmail.com**

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested remediation (if known)

We take security seriously and will respond promptly to all reports.
