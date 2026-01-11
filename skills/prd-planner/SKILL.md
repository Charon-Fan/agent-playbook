---
name: prd-planner
description: Creates PRDs using persistent file-based planning. Use when user explicitly says "PRD", "product requirements document", or "产品需求文档". Combines PRD methodology with planning-with-files to avoid context switching.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, AskUserQuestion, WebSearch
hooks:
  after_complete:
    - trigger: self-improving-prd
      mode: background
      reason: "Reflect on and improve the PRD quality"
    - trigger: session-logger
      mode: auto
      reason: "Save session context"
---

# PRD Planner

A PRD creation skill that uses persistent file-based planning to maintain coherent thinking and avoid "left-brain vs right-brain" context switching issues.

## When This Skill Activates

This skill activates when you:
- Explicitly say "PRD", "prd", "create a PRD", or "产品需求文档"
- Say "product requirements document" or "产品需求"
- Mention "write a PRD for..."
- Say "PRD planning" or "PRD 设计"

**If user says "design solution" or "architecture design" without mentioning PRD, use `architecting-solutions` instead.**

## The Core Philosophy

> "PRD creation should be traceable, coherent, and persistent - not scattered across context switches."

This skill combines:
- **PRD methodology** (from architecting-solutions)
- **File-based persistence** (from planning-with-files)

To create a single, coherent PRD creation workflow that doesn't lose context.

## 3-File Pattern for PRD Creation

For every PRD project, create THREE files:

```text
docs/prd-task-plan.md      → Track PRD creation phases and progress
docs/prd-notes.md          → Store research, requirements, findings
docs/{feature-name}-prd.md → Final PRD document
```

### File Purposes

| File | Purpose | Updated When |
|------|---------|--------------|
| `prd-task-plan.md` | Track progress, phases, checkboxes | Each phase completion |
| `prd-notes.md` | Raw research, user requirements, constraints | New information gathered |
| `{feature}-prd.md` | Polished PRD output | After requirements are clear |

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
                    ↓
           All thinking persisted to files
                    ↓
              No context switching
```

## Step 1: Initialize

Create the three files with templates:

### prd-task-plan.md

```markdown
# PRD Task Plan: {Feature Name}

## Goal
Create a comprehensive PRD for {feature description}.

## Owner
{User name/role}

## Phases
- [x] Phase 1: Initialize files ✓
- [ ] Phase 2: Gather requirements (CURRENT)
- [ ] Phase 3: Research & analysis
- [ ] Phase 4: Design solution
- [ ] Phase 5: Write PRD
- [ ] Phase 6: Validate & finalize

## Status
**Currently in Phase 2** - Gathering requirements from user

## Progress Log
- {timestamp} - Phase 1 complete: Files initialized
```

### prd-notes.md

```markdown
# PRD Notes: {Feature Name}

## Raw Requirements
(Add user requirements as they emerge)

## Constraints
(Add technical, business, time constraints)

## Research Findings
(Add research on best practices, similar solutions)

## Architecture Ideas
(Add design ideas, trade-offs)

## Open Questions
(Track questions to ask user)
```

### {feature}-prd.md

```markdown
# PRD: {Feature Name}

> Status: DRAFT - Last updated: {timestamp}

## Table of Contents
- [Problem Statement](#problem-statement)
- [Success Criteria](#success-criteria)
- [Requirements](#requirements)
- [Architecture](#architecture)
- [Implementation Plan](#implementation-plan)

---

## Problem Statement
_To be filled after requirements gathering_

## Success Criteria
_To be filled after requirements gathering_

... (rest of PRD sections)
```

## Step 2: Gather Requirements

Ask clarifying questions and save responses to `prd-notes.md`:

### Core Questions to Ask

1. **Problem**: What problem are we solving?
2. **Users**: Who will use this?
3. **Success**: How do we know it's successful?
4. **Constraints**: Any technical/time/budget constraints?

Save each answer to `prd-notes.md` under appropriate section.

**Always update `prd-task-plan.md` after gathering info:**
```markdown
- [x] Phase 2: Gather requirements ✓
- [ ] Phase 3: Research & analysis (CURRENT)
```

## Step 3: Research & Analysis

Research best practices and save to `prd-notes.md`:

```bash
# Search for similar implementations
grep -r "keyword" packages/ --include="*.ts"

# Search web for best practices
web search "best practices for {feature}"
```

Save findings to `prd-notes.md` → Research Findings section.

## Step 4: Design Solution

Propose architecture with trade-offs, save to `prd-notes.md`:

```markdown
## Architecture Options

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | ... | ... | ... |
| B | ... | ... | ... |

**Selected**: Option A - because ...
```

## Step 5: Write PRD

Read `prd-notes.md` and synthesize into polished PRD:

```markdown
1. Read prd-notes.md to understand:
   - Requirements gathered
   - Research findings
   - Architecture decisions
   - Trade-offs considered

2. Write {feature}-prd.md with:
   - Clear problem statement
   - Measurable success criteria
   - Functional requirements
   - Non-functional requirements
   - Architecture design
   - Implementation phases
   - Testing approach
```

## Step 6: Validate & Finalize

Review with user:
1. Present PRD summary
2. Ask for feedback
3. Incorporate changes
4. Mark Phase 6 complete

## Important Rules

### ALWAYS Use Files (Never Memory Only)

❌ **Bad**: Keep requirements in memory, then write PRD
✅ **Good**: Save requirements to notes.md, then read and synthesize

### ALWAYS Update Plan After Each Phase

❌ **Bad**: Complete phase and move on
✅ **Good**: Complete phase, update task_plan.md with checkbox and timestamp

### ALWAYS Read Notes Before Decisions

❌ **Bad**: Make design decisions from memory
✅ **Good**: Read prd-notes.md first, then decide

### NEVER Skip The Planning Files

❌ **Bad**: "Quick PRD" - skip straight to writing
✅ **Good**: Even for quick PRDs, create the 3 files (it prevents rework)

## Phase Transitions

```markdown
# In prd-task-plan.md, update like this:

- [ ] Phase 2: Gather requirements
- [x] Phase 3: Research & analysis ✓
- [ ] Phase 4: Design solution (CURRENT)

## Status
**Currently in Phase 4** - Designing solution architecture

## Progress Log
- {timestamp} - Phase 3 complete: Researched 3 similar implementations
- {timestamp} - Phase 4 started: Exploring architecture options
```

## Completing a PRD

When all phases are done:

```markdown
## Phases
- [x] Phase 1: Initialize files ✓
- [x] Phase 2: Gather requirements ✓
- [x] Phase 3: Research & analysis ✓
- [x] Phase 4: Design solution ✓
- [x] Phase 5: Write PRD ✓
- [x] Phase 6: Validate & finalize ✓

## Status
✅ **COMPLETE** - PRD delivered to {location}

## Progress Log
- {timestamp} - PRD complete: docs/{feature}-prd.md
```

## File Cleanup (Optional)

After PRD is complete:
- Keep `prd-notes.md` for reference
- Archive `prd-task-plan.md` or delete
- Final PRD is `{feature}-prd.md`

## Quick Start Template

```markdown
# PRD Task Plan: {Feature}

## Goal
Create PRD for {description}

## Phases
- [ ] Initialize 3 files
- [ ] Gather requirements
- [ ] Research & analysis
- [ ] Design solution
- [ ] Write PRD
- [ ] Validate & finalize

## Status
Phase 1: Initializing files
```

## Why This Works

| Problem | Solution |
|---------|----------|
| Context switching | All thinking in files, read anytime |
| Lost requirements | Saved to notes.md immediately |
| Inconsistent PRDs | Same process, same structure |
| "Left brain vs right brain" | One coherent workflow |
| Re-explaining context | Files contain full context |

## References

- [planning-with-files](../planning-with-files.md) - File-based planning methodology
- [architecting-solutions](../architecting-solutions.md) - PRD creation best practices

---

## Auto-Trigger (Automation)

When this skill completes (all phases checked ✅), automatically trigger:

### 1. self-improving-prd (background)
- **Mode**: background - runs without blocking
- **Purpose**: Reflect on the PRD and identify improvements
- **Action**: Reads the PRD, runs quality checks, saves patterns

### 2. session-logger (auto)
- **Mode**: auto - executes immediately
- **Purpose**: Save session context for future reference
- **Action**: Creates session file with summary, decisions, files created

### Workflow Visualization

```
prd-planner complete
       │
       ├──→ self-improving-prd (background) ──┐
       │                                      │
       └──→ session-logger (auto)             │
                    │                         │
                    └─────────────────────────┘
                           (save session)
```

### Implementation

After completing Phase 6, the skill should:

1. **Check completion** - Verify all checkboxes are marked
2. **Update status** - Set task plan status to "COMPLETE"
3. **Trigger hooks** - Call the skills defined in `hooks:after_complete`
4. **Inform user** - Show what was triggered and why

```markdown
## PRD Complete ✅

All phases completed. PRD delivered to: docs/{feature}-prd.md

### Auto-Triggered:

- [🔄] self-improving-prd (running in background)
- [✓] session-logger (saved)

Would you like to review the improvements or create a PR?
```
