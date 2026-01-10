# Conventional Commits Specification

## Summary

The Conventional Commits specification is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history.

## Structure

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

## Scope

The scope should be the name of the npm package or module affected.

## Description

The description contains a short description of the change:

- Use imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No period (.) at the end

## Body

Just as in the subject, use the imperative, present tense: "fix" not "fixed" nor "fixes".

Explain **what** and **why** instead of **how**.

## Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

## Breaking Changes

A BREAKING CHANGE must be indicated in the footer. A BREAKING CHANGE must be a part of the type/scope or the description.

```
feat(api): remove deprecated endpoints

BREAKING CHANGE: The /api/v1/users endpoint has been removed.
```

## References

- https://www.conventionalcommits.org/
- https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format
