# Agent Playbook

> A collection of practical guides, prompts, and skills for AI Agents (Claude Code)

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

- **[architecting-solutions](./skills/architecting-solutions.md)** - Analyzes requirements and creates detailed PRD documents for software implementation
- **[planning-with-files](./skills/planning-with-files.md)** - Uses persistent markdown files for planning and progress tracking (Manus-style workflow)
- **[self-improving-prd](./skills/self-improving-prd.md)** - A self-improving agent using reflection loops and multi-evaluator feedback to continuously optimize PRD generation

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
