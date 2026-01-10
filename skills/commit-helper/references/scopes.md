# Recommended Scopes

## Frontend

| Scope | Usage |
|-------|-------|
| `components` | UI component changes |
| `hooks` | Custom React hooks |
| `store` | State management (Redux, Zustand, etc.) |
| `styles` | CSS, styled-components, theme |
| `utils` | Utility functions |
| `forms` | Form-related changes |
| `routing` | Route configuration |

## Backend

| Scope | Usage |
|-------|-------|
| `api` | API endpoints, controllers |
| `models` | Data models, schemas |
| `services` | Business logic services |
| `database` | Database queries, migrations |
| `auth` | Authentication, authorization |
| `middleware` | Express/HTTP middleware |
| `validators` | Input validation |

## DevOps

| Scope | Usage |
|-------|-------|
| `ci` | Continuous Integration (GitHub Actions, Jenkins) |
| `cd` | Continuous Deployment |
| `docker` | Dockerfile, docker-compose |
| `k8s` | Kubernetes manifests |
| `terraform` | Infrastructure as Code |

## General

| Scope | Usage |
|-------|-------|
| `config` | Configuration changes |
| `deps` | Dependency updates |
| `tests` | Test files (use `test` type for test code changes) |
| `types` | TypeScript type definitions |
| `assets` | Images, fonts, static files |

## Project-Specific

Projects should define their own scopes based on their module structure. Document project-specific scopes in the project's CONTRIBUTING.md.
