# Security Review Guidelines

## OWASP Top 10 Coverage

### A01:2021 – Broken Access Control
- [ ] Users can only access their own data
- [ ] API endpoints have proper authentication
- [ ] Admin actions require admin role
- [ ] No IDOR (Insecure Direct Object References)
- [ ] Proper authorization checks on all endpoints

### A02:2021 – Cryptographic Failures
- [ ] Passwords are hashed (bcrypt/argon2)
- [ ] HTTPS is enforced
- [ ] Sensitive data is encrypted at rest
- [ ] No weak cipher suites
- [ ] Proper key management

### A03:2021 – Injection
- [ ] Parameterized queries for SQL
- [ ] Input validation and sanitization
- [ ] ORM used safely
- [ ] No command injection from user input
- [ ] No LDAP injection

### A04:2021 – Insecure Design
- [ ] Rate limiting on auth endpoints
- [ ] Proper logout functionality
- [ ] Session timeout is reasonable
- [ ] No security through obscurity

### A05:2021 – Security Misconfiguration
- [ ] Debug mode off in production
- [ ] Error messages don't leak information
- [ ] Default credentials changed
- [ ] Security headers configured
- [ ] CORS configured correctly

### A06:2021 – Vulnerable Components
- [ ] Dependencies up to date
- [ ] No known vulnerabilities in deps
- [ ] Unused dependencies removed

### A07:2021 – Auth Failures
- [ ] Strong password policy
- [ ] No brute force protection needed (rate limiting)
- [ ] MFA implemented for sensitive operations
- [ ] Session IDs are random

### A08:2021 – Software/Data Integrity
- [ ] Dependencies from trusted sources
- [ ] CI/CD has integrity checks
- [ ] Verify data integrity

### A09:2021 – Logging Failures
- [ ] Security events logged
- [ ] Logs don't contain sensitive data
- [ ] Log tampering protection
- [ ] Audit trail for critical operations

### A10:2021 – SSRF
- [ ] No arbitrary URL fetching from user input
- [ ] Allowlist for external calls
- [ ] Network segmentation

## Frontend Security

- [ ] XSS prevention
- [ ] CSRF tokens
- [ ] Content Security Policy
- [ ] Subresource Integrity
- [ ] No `dangerouslySetInnerHTML` with user content

## Backend Security

- [ ] Input validation on all endpoints
- [ ] Output encoding
- [ ] Prepared statements
- [ ] Principle of least privilege
- [ ] Secure file upload handling

## Infrastructure Security

- [ ] Secrets in environment variables
- [ ] No secrets in code
- [ ] Proper RBAC
- [ ] Network security rules
- [ ] Regular security updates
