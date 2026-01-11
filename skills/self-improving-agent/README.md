# Self-Improving Agent

A universal self-improvement system that learns from ALL skill experiences and continuously updates the codebase.

## Overview

Unlike `self-improving-prd` (which only focuses on PRDs), this agent learns from **every skill interaction** to achieve true lifelong learning.

## Key Features

- **Multi-Memory Architecture**: Semantic + Episodic + Working memory
- **Universal Learning**: Learns from ALL skills, not just PRDs
- **Pattern Extraction**: Converts experiences into reusable patterns
- **Automatic Updates**: Updates related skills based on learned patterns
- **Confidence Tracking**: Measures pattern reliability over time
- **Human-in-the-Loop**: Collects feedback to validate improvements

## Memory System

```
~/.claude/memory/
├── semantic/       # Patterns, rules, best practices
├── episodic/       # Specific experiences and episodes
└── working/        # Current session context
```

## How It Works

```
Any Skill Completes
        ↓
Extract Experience → Identify Patterns → Update Skills → Consolidate Memory
        ↓                     ↓                  ↓              ↓
   What happened?    What can we reuse?   Which skills?    Track metrics
```

## Installation

```bash
ln -s ~/path/to/agent-playbook/skills/self-improving-agent/SKILL.md ~/.claude/skills/self-improving-agent.md
```

## Triggering

### Automatic
After ANY skill completes:
- prd-planner
- code-reviewer
- debugger
- refactoring-specialist
- etc.

### Manual
```
"自我进化"
"self-improve"
"分析今天的经验"
"总结这次教训"
```

## Example Learning

### Episode
```yaml
Skill: debugger
Situation: Form submission doesn't refresh data
Root Cause: Empty callback function
Pattern: Always verify callbacks have implementations
Confidence: 0.95 → Updates: debugger, prd-implementation-precheck
```

### Skill Update
```markdown
## Auto-Update (2025-01-11)

### Pattern Added
**Callback Verification**: Always verify that callback functions
passed as props are not empty and actually execute logic.

**Source**: Episode ep-2025-01-11-003 (3 occurrences)
**Action**: Added to debugger checklist
```

## vs self-improving-prd

| Feature | self-improving-prd | self-improving-agent |
|---------|---------------------|----------------------|
| Scope | PRD only | ALL skills |
| Memory | Single file | Multi-memory system |
| Learning | Reflection-based | Experience-based |
| Updates | PRD skills only | Any related skill |
| Research | PRD quality | General lifelong learning |

## Research Basis

- [SimpleMem: Efficient Lifelong Memory](https://arxiv.org/html/2601.02553v1)
- [ACM Memory Mechanisms Survey](https://dl.acm.org/doi/10.1145/3748302)
- [Lifelong Learning of LLM Agents](https://arxiv.org/html/2501.07278v1)

## License

MIT
