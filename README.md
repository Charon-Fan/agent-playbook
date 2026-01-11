# Agent Playbook

> A collection of practical guides, prompts, and skills for AI Agents (Claude Code)

English | [简体中文](./README.zh-CN.md)

## Overview

This repository organizes and stores practical resources for working with AI Agents like Claude Code, including prompt templates, custom skills, usage examples, and best practices.

## Installation

### Method 1: Symbolic Links (Recommended)

Link the skills to your global Claude Code skills directory:

```bash
# Create symbolic links for each skill
ln -s /path/to/agent-playbook/skills/*.md ~/.claude/skills/
```

Example:
```bash
ln -s ~/Documents/code/GitHub/agent-playbook/skills/self-improving-prd.md ~/.claude/skills/
ln -s ~/Documents/code/GitHub/agent-playbook/skills/architecting-solutions.md ~/.claude/skills/
ln -s ~/Documents/code/GitHub/agent-playbook/skills/planning-with-files.md ~/.claude/skills/
```

### Method 2: Copy Skills

Copy the skills directly to your global Claude Code directory:

```bash
cp /path/to/agent-playbook/skills/*.md ~/.claude/skills/
```

### Method 3: Add to Project-Specific Skills

For project-specific usage, create a `.claude/skills` directory in your project:

```bash
mkdir -p .claude/skills
cp /path/to/agent-playbook/skills/*.md .claude/skills/
```

### Verify Installation

List your installed skills:

```bash
ls -la ~/.claude/skills/
```

## Project Structure

```text
agent-playbook/
├── prompts/       # Prompt templates and examples
├── skills/        # Custom skills documentation
├── agents/        # Agent configurations and use cases
├── examples/      # Complete usage examples
└── README.md      # Project documentation
```

## Directory Contents

### [prompts/](./prompts/)
Prompt templates for various scenarios:
- Code generation
- Code review
- Debugging
- Documentation
- Other use cases

### [skills/](./skills/)
Documentation for custom Claude Code skills:

#### Meta Skills

| Skill | Description |
|-------|-------------|
| **[skill-router](./skills/skill-router/)** | Intelligently routes user requests to the most appropriate skill |
| **[create-pr](./skills/create-pr/)** | Creates PRs with automatic bilingual documentation updates |
| **[session-logger](./skills/session-logger/)** | Saves conversation history to session log files |

#### Core Development

| Skill | Description |
|-------|-------------|
| **[commit-helper](./skills/commit-helper/)** | Git commit messages following Conventional Commits specification |
| **[code-reviewer](./skills/code-reviewer/)** | Comprehensive code review for quality, security, and best practices |
| **[debugger](./skills/debugger/)** | Systematic debugging and issue resolution |
| **[refactoring-specialist](./skills/refactoring-specialist/)** | Code refactoring and technical debt reduction |

#### Documentation & Testing

| Skill | Description |
|-------|-------------|
| **[documentation-engineer](./skills/documentation-engineer/)** | Technical documentation and README creation |
| **[api-documenter](./skills/api-documenter/)** | OpenAPI/Swagger API documentation |
| **[test-automator](./skills/test-automator/)** | Automated testing framework setup and test creation |
| **[qa-expert](./skills/qa-expert/)** | Quality assurance strategy and quality gates |

#### Architecture & DevOps

| Skill | Description |
|-------|-------------|
| **[api-designer](./skills/api-designer/)** | REST and GraphQL API architecture design |
| **[security-auditor](./skills/security-auditor/)** | Security audit covering OWASP Top 10 |
| **[performance-engineer](./skills/performance-engineer/)** | Performance optimization and analysis |
| **[deployment-engineer](./skills/deployment-engineer/)** | CI/CD pipelines and deployment automation |

#### Planning & Architecture

| Skill | Description |
|-------|-------------|
| **[prd-planner](./skills/prd-planner/)** | Creates PRDs using persistent file-based planning (avoids context switching) |
| **[prd-implementation-precheck](./skills/prd-implementation-precheck/)** | Performs preflight review before implementing PRDs |
| **[architecting-solutions](./skills/architecting-solutions.md)** | Technical solution and architecture design (not PRD-specific) |
| **[planning-with-files](./skills/planning-with-files.md)** | General file-based planning for multi-step tasks |
| **[self-improving-prd](./skills/self-improving-prd.md)** | Self-improving PRD with reflection loops |

### [agents/](./agents/)
Agent configurations and usage patterns:
- Scenario-specific agent configurations
- Agent collaboration patterns
- Best practices and case studies

### [examples/](./examples/)
Complete usage examples and tutorials

## Usage

Once installed, skills are automatically available in any Claude Code session. You can invoke them by:

1. **Direct activation** - The skill activates based on context (e.g., mentioning "PRD", "planning")
2. **Manual invocation** - Explicitly ask Claude to use a specific skill

Example:
```
You: Create a PRD for a new authentication feature
```

The architecting-solutions skill will activate automatically.

## Updating Skills

When you update skills in agent-playbook, the symbolic links ensure you always have the latest version. To update:

```bash
cd /path/to/agent-playbook
git pull origin main
```

If using copied skills, re-copy the updated files:
```bash
cp /path/to/agent-playbook/skills/*.md ~/.claude/skills/
```

## Contributing

Contributions are welcome! Feel free to submit PRs with your own prompts, skills, or use cases.

## License

MIT License
