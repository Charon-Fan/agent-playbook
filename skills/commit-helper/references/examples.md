# Commit Message Examples

## Features

```
feat(auth): add OAuth2 login support

Implement OAuth2 authentication flow supporting Google and GitHub
providers. Users can now link multiple social accounts to their profile.

Closes #123
```

```
feat(components): add data table component

New reusable table component with built-in sorting, filtering, and
pagination. Uses TanStack Table for performance.
```

## Bug Fixes

```
fix(api): resolve race condition in user creation

Concurrent requests could create duplicate users. Added unique constraint
on email field with proper error handling.

Fixes #456
```

```
fix(auth): prevent session token leakage

Session tokens were being logged in debug output. Removed sensitive
data from debug logs.
```

## Refactoring

```
refactor(user): extract validation logic

Moved user validation logic into a dedicated validator module to
enable reuse across different parts of the application.
```

```
refactor(api): simplify error handling middleware

Unified error response format across all API endpoints.
```

## Documentation

```
docs: update installation guide with new requirements

Added Python 3.12 and Node.js 20 to the supported versions list.
Updated docker-compose examples.
```

```
docs(api): add OpenAPI specification for v2 endpoints

Complete API documentation including request/response schemas and
authentication requirements.
```

## Performance

```
perf(api): add database query caching

Implemented Redis caching for frequently accessed data. Reduced
average response time from 200ms to 50ms.
```

```
perf(frontend): lazy load images below fold

Implemented Intersection Observer for lazy loading. Reduced initial
page load by 40%.
```

## Breaking Changes

```
feat(api): migrate to REST v2

API endpoints have been restructured for better consistency.
Old v1 endpoints are deprecated.

BREAKING CHANGE: All `/api/v1/*` endpoints moved to `/api/v2/*`.
Migration guide: docs/api-migration-v1-to-v2.md

Closes #789
```

## Complex Example

```
feat(payment): integrate Stripe payment processing

Add comprehensive Stripe integration for subscription and one-time payments.
Includes webhook handling for payment events and automatic invoice generation.

Key features:
- Support for multiple payment methods (card, Apple Pay, Google Pay)
- Subscription lifecycle management
- Payment failure retry logic
- PCI-compliant card handling via Stripe Elements

Security considerations:
- All card data is handled directly by Stripe
- Webhook signatures are verified
- Sensitive payment data is never stored locally

Migration notes:
- Existing users need to add payment method
- Trial period extended by 14 days for existing users

Related tickets: FEAT-123, FEAT-124
Breaking Change: Old PayPal integration removed
```
