---
name: self-improving-agent
description: A universal self-improving agent that learns from ALL skill experiences and continuously updates the codebase. Automatically triggers after any skill completes to analyze patterns, extract insights, and update related skills. Use when user says "自我进化", "self-improve", or any skill completes its workflow.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebSearch
hooks:
  after_complete:
    - trigger: create-pr
      mode: ask_first
      condition: skills_modified
    - trigger: session-logger
      mode: auto
---

# Self-Improving Agent

> "An AI agent that learns from every interaction, accumulating patterns and insights to continuously improve its own capabilities." — Based on 2025 lifelong learning research

## Overview

This is a **universal self-improvement system** that learns from ALL skill experiences, not just PRDs. It implements multi-memory architecture with semantic memory, episodic memory, and working memory to achieve true lifelong learning.

## Research-Based Design

Based on 2025 research:

| Research | Key Insight | Application |
|----------|-------------|-------------|
| [SimpleMem](https://arxiv.org/html/2601.02553v1) | Efficient lifelong memory | Pattern accumulation system |
| [Multi-Memory Survey](https://dl.acm.org/doi/10.1145/3748302) | Semantic + Episodic memory | World knowledge + experiences |
| [Lifelong Learning](https://arxiv.org/html/2501.07278v1) | Continuous task stream learning | Learn from every skill use |
| [Evo-Memory](https://shothota.medium.com/evo-memory-deepminds-new-benchmark) | Test-time lifelong learning | Real-time adaptation |

## The Self-Improvement Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                    UNIVERSAL SELF-IMPROVEMENT                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Any Skill Used → Extract Experience → Update Memory → Improve  │
│        │                  │                │         │          │
│        └──────────────────┴────────────────┴─────────┘          │
│                                                                 │
│   ┌─────────────────────────────────────────────────────┐       │
│   │              MULTI-MEMORY SYSTEM                      │       │
│   ├─────────────────────────────────────────────────────┤       │
│   │  Semantic Memory   │  Episodic Memory  │ Working Memory │  │
│   │  (Patterns/Rules)  │  (Experiences)    │  (Current)     │  │
│   └─────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## When This Activates

### Automatic Triggers (After ANY skill completes)
- `prd-planner` → Reflect on PRD quality
- `code-reviewer` → Extract code review patterns
- `debugger` → Capture debugging insights
- `refactoring-specialist` → Learn refactoring patterns
- `create-pr` → Improve PR descriptions
- ...ALL skills

### Manual Triggers
- User says "自我进化", "self-improve", "从经验中学习"
- User says "分析今天的经验", "总结教训"
- User asks to improve a specific skill

## Multi-Memory Architecture

### 1. Semantic Memory (`~/.claude/memory/semantic/`)

Stores **patterns, rules, and best practices**:

```json
{
  "patterns": {
    "code_review_security": {
      "pattern": "Always check for SQL injection in user input handling",
      "context": "code-reviewer",
      "confidence": 0.95,
      "applications": 23,
      "last_updated": "2025-01-11"
    },
    "prd_success_criteria": {
      "pattern": "Success criteria must be measurable with specific numbers",
      "context": "prd-planner",
      "confidence": 0.90,
      "applications": 15,
      "last_updated": "2025-01-10"
    }
  }
}
```

### 2. Episodic Memory (`~/.claude/memory/episodic/`)

Stores **specific experiences and what happened**:

```json
{
  "episodes": [
    {
      "id": "ep-2025-01-11-001",
      "timestamp": "2025-01-11T10:30:00Z",
      "skill": "debugger",
      "situation": "User reported data not refreshing after form submission",
      "root_cause": "Empty callback in onRefresh prop",
      "solution": "Implement actual refresh logic in callback",
      "lesson": "Always verify callbacks are not empty functions",
      "related_pattern": "callback_verification"
    }
  ]
}
```

### 3. Working Memory (`~/.claude/memory/working/`)

Stores **current session context**:

```json
{
  "current_session": {
    "skills_used": ["prd-planner", "self-improving-agent"],
    "files_modified": ["docs/feature-prd.md"],
    "decisions_made": ["Chose Option A for architecture"],
    "questions_raised": ["Should we use PostgreSQL or MongoDB?"],
    "timestamp": "2025-01-11T11:00:00Z"
  }
}
```

## Self-Improvement Process

### Phase 1: Experience Extraction

After any skill completes, extract:

```yaml
What happened:
  - Which skill was used?
  - What was the task?
  - What went well?
  - What went wrong?

Key Insights:
  - Root cause of any issues
  - Unexpected patterns discovered
  - User feedback received

Abstract Pattern:
  - Convert concrete experience to reusable rule
  - Determine which skill(s) to update
```

### Phase 2: Pattern Abstraction

Convert experiences to reusable patterns:

| Concrete Experience | Abstract Pattern | Target Skill |
|--------------------|------------------|--------------|
| "User forgot to save PRD notes" | "Always persist thinking to files" | prd-planner |
| "Code review missed SQL injection" | "Add security checklist item" | code-reviewer |
| "Callback was empty, didn't work" | "Verify callback implementations" | debugger |

### Phase 3: Skill Updates

Update the appropriate skill files:

```markdown
## Auto-Update (from self-improving-agent)

### Pattern Added (2025-01-11)
**Pattern**: Always verify callbacks are not empty functions
**Source**: Episode ep-2025-01-11-003
**Confidence**: 0.95

### Checklist Updated
- [ ] Verify all callbacks have implementations
- [ ] Test callback execution paths
```

### Phase 4: Memory Consolidation

1. **Update semantic memory** with new patterns
2. **Store episodic memory** of this experience
3. **Update pattern confidence** based on feedback
4. **Prune outdated patterns** (low confidence, old)

## Automatic Analysis Framework

### Root Cause Analysis Template

When analyzing any problem:

```markdown
## Problem Analysis

### What Happened
- Symptom: {what user saw}
- Skill: {which skill}
- Context: {what was being done}

### Root Cause
- Direct cause: {immediate reason}
- Underlying cause: {deeper issue}
- Pattern: {is this a recurring issue?}

### Solution
- What fixed it: {actual solution}
- Could it be prevented: {yes/no, how}

### Pattern to Extract
- For semantic memory: "{abstract rule}"
- Target skills: {which skills to update}
- Priority: {high/medium/low}
```

### Pattern Extraction Rules

```yaml
Extraction Rules:
  - If root_cause repeats 3+ times:
      pattern_level: critical
      action: Add to skill's "Critical Mistakes" section

  - If solution was effective:
      pattern_level: best_practice
      action: Add to skill's "Best Practices" section

  - If user provided positive feedback:
      pattern_level: strength
      action: Reinforce this approach

  - If user provided negative feedback:
      pattern_level: weakness
      action: Add to "What to Avoid" section
```

## Memory File Structure

```
~/.claude/memory/
├── semantic/
│   ├── patterns.json          # All learned patterns
│   ├── best_practices.json    # Proven effective methods
│   └── anti_patterns.json     # Common mistakes to avoid
├── episodic/
│   ├── episodes.json          # All experiences
│   └── reviews.json           # User feedback and ratings
├── working/
│   ├── current_session.json   # Current context
│   └── recent_context.json    # Last 5 sessions
└── index.json                 # Memory index and metadata
```

## Integration with Workflows

### Automatic Trigger Chain

```
Any Skill Complete
        ↓
workflow-orchestrator detects completion
        ↓
self-improving-agent (background)
        ↓
┌─────────────────────────────────────────┐
│  1. Extract experience from skill log   │
│  2. Identify patterns to abstract      │
│  3. Update relevant skills              │
│  4. Consolidate memory                  │
│  5. Generate improvement report        │
└─────────────────────────────────────────┘
        ↓
create-pr (if skills modified, ask_first)
        ↓
session-logger (auto)
```

### Skills That Should Update

| Trigger Skill | Learning Source | Updates To |
|---------------|-----------------|------------|
| `prd-planner` | PRD creation quality | `prd-planner`, `architecting-solutions` |
| `code-reviewer` | Code review patterns | `code-reviewer`, security patterns |
| `debugger` | Debugging insights | `debugger`, anti-patterns |
| `refactoring-specialist` | Refactoring approaches | All development skills |
| `create-pr` | PR workflow | `create-pr` |
| `user-feedback-*` | Direct feedback | Targeted skills |

## Continuous Learning Metrics

Track improvement over time:

```json
{
  "metrics": {
    "patterns_learned": 47,
    "patterns_applied": 238,
    "skills_updated": 12,
    "avg_confidence": 0.87,
    "user_satisfaction_trend": "improving",
    "error_rate_reduction": "-35%"
  }
}
```

## Human-in-the-Loop

### Feedback Collection

After each improvement cycle:

```markdown
## Self-Improvement Summary

I've learned from our session and updated:

### Updated Skills
- `debugger`: Added callback verification pattern
- `prd-planner`: Enhanced notes persistence reminder

### Patterns Extracted
1. Always verify callback implementations
2. Persist thinking to files before synthesizing

### Confidence Levels
- New patterns: 0.85 (needs validation)
- Reinforced patterns: 0.95 (well-established)

### Your Feedback
Rate these improvements (1-10):
- Were the updates helpful?
- Should I apply this pattern more broadly?
- Any corrections needed?
```

### Feedback Integration

```yaml
User Feedback:
  positive (rating >= 7):
    action: Increase pattern confidence
    scope: Expand to related skills

  neutral (rating 4-6):
    action: Keep pattern, gather more data
    scope: Current skill only

  negative (rating <= 3):
    action: Decrease confidence, revise pattern
    scope: Remove from active patterns
```

## Best Practices

### DO

- ✅ Learn from EVERY skill interaction
- ✅ Extract patterns at the right abstraction level
- ✅ Update multiple related skills
- ✅ Track confidence and apply counts
- ✅ Ask for user feedback on improvements

### DON'T

- ❌ Over-generalize from single experiences
- ❌ Update skills without confidence tracking
- ❌ Ignore negative feedback
- ❌ Make changes that break existing functionality
- ❌ Create contradictory patterns

## Quick Start

After any skill completes, this agent automatically:

1. **Analyzes** what happened
2. **Extracts** patterns and insights
3. **Updates** relevant skill files
4. **Logs** to memory for future reference
5. **Reports** summary to user

## References

- [SimpleMem: Efficient Lifelong Memory for LLM Agents](https://arxiv.org/html/2601.02553v1)
- [A Survey on the Memory Mechanism of Large Language Model Agents](https://dl.acm.org/doi/10.1145/3748302)
- [Lifelong Learning of LLM based Agents](https://arxiv.org/html/2501.07278v1)
- [Evo-Memory: DeepMind's Benchmark](https://shothota.medium.com/evo-memory-deepminds-new-benchmark)
- [Let's Build a Self-Improving AI Agent](https://medium.com/@nomannayeem/lets-build-a-self-improving-ai-agent-that-learns-from-your-feedback-722d2ce9c2d9)
