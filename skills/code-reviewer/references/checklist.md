# Code Review Checklist

Use this checklist for systematic code reviews.

## Pre-Review

- [ ] I understand what this PR is trying to achieve
- [ ] I have read the linked issues/tickets
- [ ] I have checked the base branch is correct
- [ ] I have verified the PR is not a draft

## Code Review

### Correctness
- [ ] Code implements the stated requirements
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] No obvious bugs
- [ ] Input validation is present

### Security
- [ ] No hardcoded secrets/credentials
- [ ] User input is validated/sanitized
- [ ] SQL/NoSQL injection prevention
- [ ] XSS prevention (for web)
- [ ] CSRF protection (for state-changing operations)
- [ ] Authentication/authorization is correct
- [ ] Sensitive data is handled securely

### Performance
- [ ] No N+1 queries
- [ ] Appropriate caching (if applicable)
- [ ] Efficient algorithm/data structure choice
- [ ] No unnecessary database/network calls
- [ ] Pagination for large datasets
- [ ] Indexes used where appropriate

### Code Quality
- [ ] Code is readable and understandable
- [ ] Naming is clear and consistent
- [ ] No dead/commented-out code
- [ ] No duplicate code
- [ ] Appropriate abstractions
- [ ] Follows DRY, KISS, YAGNI
- [ ] Type definitions are accurate (if typed)

### Testing
- [ ] Tests cover new functionality
- [ ] Tests cover edge cases
- [ ] Tests are meaningful (not tautologies)
- [ ] No hardcoded test data that makes tests brittle
- [ ] All tests pass
- [ ] Test coverage not decreased

### Documentation
- [ ] Complex logic has comments
- [ ] Public APIs are documented
- [ ] Breaking changes are noted
- [ ] README/API docs updated if needed
- [ ] Migration guide provided for breaking changes

### Maintainability
- [ ] Code is modular
- [ ] Separation of concerns
- [ ] Easy to modify
- [ ] Easy to test
- [ ] Follows project conventions

### Style
- [ ] Consistent formatting
- [ ] Follows project style guide
- [ ] No lint errors
- [ ] No console.log/debugger left in

## Post-Review

- [ ] Provided clear, actionable feedback
- [ ] Explained reasoning for suggestions
- [ ] Flagged blocking issues separately from nice-to-haves
- [ ] Recognized good work in the PR
