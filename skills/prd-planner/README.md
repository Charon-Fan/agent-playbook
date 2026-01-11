# PRD Planner

A PRD creation skill that uses persistent file-based planning to maintain coherent thinking and avoid context switching issues.

## Overview

PRD Planner combines PRD methodology with file-based persistence (planning-with-files) to create a single, coherent workflow that doesn't lose context during PRD creation.

## The Problem

Traditional PRD creation suffers from:
- **Context switching** - Requirements in memory, then forgotten
- **Lost thoughts** - Research findings not captured
- **"Left brain vs right brain"** - Different thinking modes conflict
- **Inconsistent output** - Each PRD looks different

## The Solution

Use a 3-file pattern that persists all thinking:

```text
docs/prd-task-plan.md      → Progress tracking
docs/prd-notes.md          → Research & requirements
docs/{feature}-prd.md      → Final PRD output
```

## Installation

```bash
# Create symbolic link to global skills directory
ln -s ~/Documents/code/GitHub/agent-playbook/skills/prd-planner/SKILL.md ~/.claude/skills/prd-planner.md
```

## Usage

```bash
# Simply ask for a PRD
"Create a PRD for user authentication"

# The skill will:
# 1. Create 3 files in docs/
# 2. Gather requirements (saved to notes)
# 3. Research best practices (saved to notes)
# 4. Design architecture (saved to notes)
# 5. Synthesize into PRD (reads from notes)
# 6. Validate with you
```

## Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRD Creation Workflow                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Initialize → Create 3 files with template                   │
│  2. Requirements → Gather to prd-notes.md                       │
│  3. Analysis → Research best practices, save to notes           │
│  4. Design → Propose architecture, save to notes                │
│  5. Synthesize → Read notes, write PRD, update plan             │
│  6. Validate → Review with user, finalize                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
docs/
├── prd-task-plan.md      # Progress tracking with checkboxes
├── prd-notes.md          # All research and requirements
└── {feature}-prd.md      # Final polished PRD
```

## Key Principles

| Principle | Implementation |
|-----------|----------------|
| Filesystem as memory | Store in files, not context |
| Always read before deciding | Read notes.md before design decisions |
| Update plan after phases | Checkboxes and timestamps in task_plan.md |
| One coherent workflow | Single skill, no context switching |

## Activation

This skill activates when user says:
- "Create a PRD..."
- "PRD for..."
- "产品需求文档"
- "Product requirements document"

**Different from:**
- `architecting-solutions` - For "design solution" or "architecture design"
- `planning-with-files` - For general task planning (not PRD-specific)

## License

MIT
