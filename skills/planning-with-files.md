---
name: planning-with-files
description: Uses persistent markdown files for planning, progress tracking, and knowledge storage (Manus-style workflow). Use this skill for multi-step tasks, research, or projects requiring organization.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# Planning with Files

> "Work like Manus" — Uses persistent markdown files for planning, progress tracking, and knowledge storage.

## Description

A Claude Code skill that transforms your workflow to use persistent markdown files for planning and progress tracking — the pattern that made Manus AI worth billions.

## The Problem

Claude Code (and most AI agents) suffer from:
- **Volatile memory** — TodoWrite tool disappears on context reset
- **Goal drift** — Original goals get forgotten after many tool calls
- **Hidden errors** — Failures aren't tracked, mistakes repeat
- **Context stuffing** — Everything crammed into context instead of stored

## The Solution: 3-File Pattern

For every complex task, create THREE files:

```text
task_plan.md      → Track phases and progress
notes.md          → Store research and findings
[deliverable].md  → Final output
```

### The Workflow Loop

```text
1. Create task_plan.md with goal and phases
2. Research → save to notes.md → update task_plan.md
3. Read notes.md → create deliverable → update task_plan.md
4. Deliver final output
```

## When to Use

**Use this pattern for:**
- Multi-step tasks (3+ steps)
- Research tasks
- Building/creating projects
- Tasks spanning many tool calls
- Anything requiring organization

**Skip for:**
- Simple questions
- Single-file edits
- Quick lookups

## Installation

This skill is typically installed globally at `~/.claude/skills/planning-with-files/`.

You can install it via:

```bash
cd ~/.claude/skills
git clone https://github.com/OthmanAdi/planning-with-files.git
```

## The Manus Principles

| Principle | Implementation |
|-----------|----------------|
| Filesystem as memory | Store in files, not context |
| Attention manipulation | Re-read plan before decisions |
| Error persistence | Log failures in plan file |
| Goal tracking | Checkboxes show progress |
| Append-only context | Never modify history |

## Example

**You:** "Research the benefits of TypeScript and write a summary"

**Claude creates:**

```markdown
# Task Plan: TypeScript Benefits Research

## Goal
Create a research summary on TypeScript benefits.

## Phases
- [x] Phase 1: Create plan ✓
- [ ] Phase 2: Research and gather sources (CURRENT)
- [ ] Phase 3: Synthesize findings
- [ ] Phase 4: Deliver summary

## Status
**Currently in Phase 2** - Searching for sources
```

## Links

- [GitHub Repository](https://github.com/OthmanAdi/planning-with-files)
- [Context Engineering for AI Agents](https://manus.im/de/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)
