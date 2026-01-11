---
name: workflow-orchestrator
description: Automatically coordinates multi-skill workflows and triggers follow-up actions. Use when completing PRD creation, implementation, or any milestone that should trigger additional skills. This skill reads the auto-trigger configuration and executes the workflow chain.
allowed-tools: Read, Write, Edit, Bash, Grep, AskUserQuestion
---

# Workflow Orchestrator

A skill that automatically coordinates workflows across multiple skills, triggering follow-up actions at appropriate milestones.

## When This Skill Activates

This skill should be triggered automatically when:
- A skill completes its main workflow
- A milestone is reached (PRD complete, implementation done, etc.)
- User says "complete workflow" or "finish the process"

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Workflow Orchestration                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Detect Milestone → 2. Read Hooks → 3. Execute Chain    │
│                                                             │
│  prd-planner complete                                       │
│       ↓                                                     │
│  workflow-orchestrator                                      │
│       ↓                                                     │
│  ┌─────────────────────────────────────┐                   │
│  │ auto-trigger self-improving-prd     │ (background)       │
│  │ auto-trigger session-logger         │ (auto)            │
│  └─────────────────────────────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Trigger Configuration

Read trigger definitions from `skills/auto-trigger/SKILL.md`:

```yaml
prd_complete:
  - trigger: self-improving-prd
    mode: background
  - trigger: session-logger
    mode: auto
```

## Execution Modes

| Mode | Behavior | Use When |
|------|----------|----------|
| `auto` | Execute immediately, no confirmation | Logging, status updates |
| `background` | Execute without blocking | Reflection, analysis |
| `ask_first` | Ask user before executing | PRs, deployments, major changes |

## Milestone Detection

### PRD Complete

```markdown
Detected when:
- docs/{feature}-prd.md exists
- All phases in prd-task-plan.md are checked
- Status shows "COMPLETE"

Actions:
1. Trigger self-improving-prd (background)
2. Trigger session-logger (auto)
```

### Implementation Complete

```markdown
Detected when:
- All PRD requirements implemented
- Tests pass
- Code committed

Actions:
1. Trigger code-reviewer (ask_first)
2. Trigger create-pr if changes staged
3. Trigger session-logger (auto)
```

### Self-Improvement Complete

```markdown
Detected when:
- Reflection complete
- Patterns abstracted
- Skill files modified

Actions:
1. Trigger create-pr (ask_first)
2. Trigger session-logger (auto)
```

## Hook Implementation in Skills

To enable auto-trigger, add this section to any skill's SKILL.md:

```markdown
## Auto-Trigger (After Completion)

When this skill completes, automatically trigger:

```yaml
- trigger: skill-name
  mode: auto|background|ask_first
  context: "relevant context"
```

### Current Skill Hooks

- **prd-planner**: After PRD complete → self-improving-prd + session-logger
- **self-improving-prd**: After improvement → create-pr + session-logger
- **prd-implementation-precheck**: After implementation → code-reviewer + session-logger
- **create-pr**: After PR created → session-logger
```

## Workflow Examples

### Example 1: PRD Creation Workflow

```
User: "Create a PRD for user authentication"
        ↓
prd-planner executes
        ↓
Phase 6 complete: PRD delivered
        ↓
workflow-orchestrator detects milestone
        ↓
┌─────────────────────────────────┐
│ Background: self-improving-prd  │ → Reflects and improves
│ Auto: session-logger             │ → Saves session
└─────────────────────────────────┘
```

### Example 2: Full Feature Workflow

```
User: "Create a PRD and implement it"
        ↓
prd-planner → workflow-orchestrator
        ↓
self-improving-prd → workflow-orchestrator
        ↓
prd-implementation-precheck
        ↓
implementation complete → workflow-orchestrator
        ↓
code-reviewer → workflow-orchestrator
        ↓
create-pr → workflow-orchestrator
        ↓
session-logger
```

## Implementation Steps

### Step 1: Detect Milestone

Check for completion indicators:

```bash
# PRD complete?
grep -q "COMPLETE" docs/prd-task-plan.md

# All phases checked?
grep -q "^\- \[x\].*Phase 6" docs/prd-task-plan.md

# PRD file exists?
ls docs/{feature}-prd.md
```

### Step 2: Read Trigger Config

```bash
# Read hooks from auto-trigger skill
cat skills/auto-trigger/SKILL.md
```

### Step 3: Execute Hooks

For each hook in order:
1. Check if condition is met
2. Execute based on mode
3. Pass context to triggered skill
4. Wait/continue based on mode

### Step 4: Update Status

Log what was triggered and the result:

```markdown
## Workflow Execution

- [x] self-improving-prd (background) - Started
- [x] session-logger (auto) - Session saved
- [ ] create-pr (ask_first) - Pending user approval
```

## Skills with Auto-Trigger

| Skill | Triggers After |
|-------|----------------|
| `prd-planner` | self-improving-prd, session-logger |
| `self-improving-prd` | create-pr, session-logger |
| `prd-implementation-precheck` | code-reviewer, session-logger |
| `code-reviewer` | session-logger |
| `create-pr` | session-logger |
| `refactoring-specialist` | session-logger |
| `debugger` | session-logger |

## Adding Auto-Trigger to Existing Skills

To add auto-trigger capability to an existing skill, add to the end of its SKILL.md:

```markdown
---

## Auto-Trigger

When this skill completes, automatically trigger:

- `session-logger` (auto) - Save session context
```

For more complex triggers, specify mode and context:

```markdown
## Auto-Trigger

When this skill completes:

- `next-skill` (background) - Description
- `session-logger` (auto) - Save session
- `create-pr` (ask_first) - Create PR if files modified
```

## Best Practices

1. **Always log to session** - Every workflow should end with session-logger
2. **Ask before major actions** - PRs, deployments, destructive changes
3. **Background for analysis** - Reflection, evaluation, optimization
4. **Auto for status** - Logging, status updates, bookmarks
5. **Don't create loops** - Ensure chains terminate
