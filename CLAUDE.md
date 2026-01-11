# Claude Code Instructions for agent-playbook

## Default Behavior

When working on this repository, **always use the skill-router skill first** when:
- User asks for help or guidance
- Request seems ambiguous or could use multiple skills
- User mentions "skill", "which", "how to"
- User is unsure about the best approach

## Skill Priority

The skill-router should be your entry point for all skill-related questions. It will:
1. Analyze the user's request
2. Match to the most appropriate skill
3. Ask clarifying questions if needed
4. Recommend the best skill for the task

## When Creating PRs

Always use the `create-pr` skill when:
- User asks to create a pull request
- User says "submit my changes" or "push and create PR"
- User wants to submit code for review

This ensures bilingual documentation stays in sync.

## Project Context

This is the **agent-playbook** repository - a collection of Claude Code skills.
- Skills are located in `skills/` directory
- Each skill has a `SKILL.md` file (the actual skill)
- Each skill may have a `README.md` file (documentation)
- Symbolic links are created in `~/.claude/skills/` for global availability
