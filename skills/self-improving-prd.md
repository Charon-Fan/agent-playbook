---
name: self-improving-prd
description: A self-improving agent that uses reflection loops and multi-evaluator feedback to continuously optimize PRD generation quality.
allowed-tools: Read, Write, Edit, Bash, AskUserQuestion, WebSearch
hooks:
  after_complete:
    - trigger: create-pr
      mode: ask_first
      condition: skill_files_modified
      reason: "Submit improvements to repository"
    - trigger: session-logger
      mode: auto
      reason: "Save improvement session"
---

# Self-Improving PRD Agent

> "The best way to improve an agent is to look carefully at its output, especially the cases where it fails." — Anthropic Engineering

## Overview

This skill implements a self-improving feedback loop for PRD generation, based on Anthropic's agent pattern: **gather context → take action → verify work → improve → repeat**.

## The Self-Improvement Loop

```text
┌─────────────────────────────────────────────────────────────┐
│                    SELF-IMPROVEMENT LOOP                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│   1. GENERATE    2. REFLECT    3. EVALUATE    4. IMPROVE    │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│   │ Create  │───→│ Self-   │───→│ Multi-  │───→│ Update  │  │
│   │   PRD   │    │ Review  │    │ Evaluator│   │  Skill  │  │
│   └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│       ▲                                                │     │
│       └────────────────────────────────────────────────┘     │
│                         (Memory persist)                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## When to Use

This skill activates automatically after PRD generation. It can also be invoked with:
- "Improve this PRD"
- "Review and optimize the PRD"
- "Self-reflect on the PRD quality"

## Phase 1: Generate (Create PRD)

The agent generates a PRD using the architecting-solutions skill.

**Output**: `docs/{feature-name}-prd.md`

## Phase 2: Reflect (Self-Review)

Before asking the user, the agent performs self-reflection:

### Reflection Checklist

```markdown
## Self-Reflection Questions

1. **Completeness**: Are all sections filled with meaningful content?
2. **Specificity**: Are requirements specific enough to implement?
3. **Consistency**: Do all sections align with each other?
4. **Clarity**: Could another agent implement this without clarification?
5. **Edge Cases**: Have we considered failure scenarios?

### Self-Correction

If issues found:
- [ ] Fill missing sections
- [ ] Add specific examples
- [ ] Resolve inconsistencies
- [ ] Clarify ambiguous statements
```

### Reflection Memory

Store reflections in `~/.claude/memory/reflections.json`:

```json
{
  "reflections": [
    {
      "timestamp": "2025-01-10T10:00:00Z",
      "prd": "user-authentication",
      "issues_found": ["Missing error handling section"],
      "corrections_made": ["Added error handling to API contracts"],
      "pattern": "Always include error handling in API specs"
    }
  ]
}
```

## Phase 3: Evaluate (Multi-Evaluator Feedback)

### 3.1 Rules-Based Evaluation

Define concrete rules and check them:

```markdown
## Quality Rules Check

| Rule | Status | Notes |
|------|--------|-------|
| Success criteria are measurable | [ ] | |
| File paths use forward slashes | [ ] | |
| API contracts have request/response | [ ] | |
| Data models include types | [ ] | |
| Edge cases are documented | [ ] | |
```

**Implementation**: Create a linter/checklist script that validates the PRD.

### 3.2 User Feedback Collection

After self-reflection, collect user feedback:

```markdown
## PRD Quality Feedback

Thank you! I've self-reviewed the PRD and made initial improvements.
Your feedback will help me learn and improve future PRDs.

### Overall Rating (1-10)
How would you rate this PRD?

### What Was Effective
What aspects worked well?

### What Needs Improvement
What should be improved?

### Missing Elements
What was not covered?

### Context (Optional)
- Project type: web/mobile/api/library/other
- Tech stack:
- Domain specifics:
```

### 3.3 LLM-as-a-Judge (Optional)

For critical PRDs, use a subagent to evaluate:

```markdown
## Peer Review Prompt

You are a senior engineering lead reviewing a PRD.
Evaluate based on:
1. Implementation readiness
2. Technical feasibility
3. Completeness
4. Clarity

Provide:
- Overall assessment (1-10)
- Critical issues (if any)
- Improvement suggestions
```

## Phase 4: Improve (Update & Persist)

### 4.1 Abstract Patterns

Convert concrete feedback into abstract patterns:

| Concrete Feedback | Abstract Pattern | Memory Update |
|-------------------|------------------|---------------|
| "Missing OAuth flow" | API authentication protocols need complete flow specification | Add to API template |
| "Too vague on React state" | Framework-specific state management patterns | Add React patterns |
| "Didn't ask about scale" | Non-functional requirements must include scalability | Add to checklist |

### 4.2 Update Strategy

**By Feedback Category**:

| Category | Update Target | File |
|----------|---------------|------|
| Structure | PRD template sections | `reference/prd-template.md` |
| Process | Questions to ask user | `SKILL.md` - Step 1 |
| Content | Quality checklist | `SKILL.md` - Quality section |
| Domain | Framework/language patterns | `reference/best-practices.md` |

### 4.3 Memory System

Store learned patterns in `~/.claude/memory/prd-patterns.json`:

```json
{
  "patterns": {
    "api_specification": {
      "pattern": "API contracts must include authentication, rate limiting, and error handling",
      "source": "user_feedback",
      "confidence": 0.9,
      "applications": 5
    },
    "react_state_management": {
      "pattern": "For React apps, specify prop drilling vs context vs state management library",
      "source": "reflection",
      "confidence": 0.8,
      "applications": 2
    }
  },
  "context_map": {
    "react": ["state_management", "component_patterns", "hooks"],
    "api": ["authentication", "rate_limiting", "versioning", "error_handling"]
  }
}
```

## Automatic PR Creation

### Commit Format

```bash
git add SKILL.md reference/ ~/.claude/memory/
git commit -m "$(cat <<'EOF'
feat(self-improving): improve PRD generation based on feedback

## Patterns Learned
- ${pattern_1}: ${description_1}
- ${pattern_2}: ${description_2}

## Skill Updates
- Update ${section} with ${improvement}
- Add ${new_item} to ${checklist}

## Feedback Summary
${user_feedback_summary}

## Metrics
- Previous quality rating: ${old_rating}/10
- Pattern confidence: ${confidence}

🤖 Generated with Claude Code
EOF
)"
```

### Create PR

```bash
git checkout -b self-improvement/$(date +%Y%m%d)
git push -u origin self-improvement/$(date +%Y%m%d)

gh pr create \
  --title "Self-improvement: PRD generation update $(date +%Y%m%d)" \
  --body-file - <<'EOF'
## Self-Improvement Update

This PR updates the PRD generation skill based on accumulated feedback and reflections.

## What Changed

${changes_summary}

## Patterns Abstracted

${patterns_list}

## Learning Metrics

| Metric | Value |
|--------|-------|
| Feedback instances | ${count} |
| New patterns | ${new_patterns} |
| Pattern applications | ${applications} |

## Test Plan

- [ ] Skill execution tested
- [ ] New patterns produce better outputs
- [ ] No regressions

---

This is an automated self-improvement update.
EOF
```

## Integration with architecting-solutions

Add to `architecting-solutions/SKILL.md` after Step 7:

```markdown
## Step 8: Self-Improvement Loop

After PRD delivery:

1. **Self-Reflect** - Review the PRD against quality checklist
2. **Collect Feedback** - Gather user ratings and specific feedback
3. **Evaluate** - Use rules, feedback, and optional peer review
4. **Abstract Patterns** - Convert concrete feedback into reusable patterns
5. **Update Skill** - Apply patterns to skill files
6. **Persist Memory** - Store patterns for future retrieval
7. **Create PR** - Submit improvements to repository

This continuous loop ensures the skill evolves with each use.
```

## Best Practices

### Do's

- **Self-reflect before asking** - Catch obvious issues first
- **Abstract patterns** - Turn concrete feedback into reusable rules
- **Store context** - Remember domain-specific patterns
- **Measure quality** - Track ratings over time
- **Use multi-evaluator** - Combine rules + feedback + LLM judge

### Don'ts

- **Don't ask generic questions** - Be specific about what needs feedback
- **Don't ignore patterns** - Look for recurring issues across PRDs
- **Don't overwrite without analysis** - Understand why a change helps
- **Don't forget edge cases** - Note what scenarios weren't covered

## Quality Metrics

Track these over time:

```json
{
  "metrics": {
    "average_rating": 7.5,
    "rating_trend": "improving",
    "patterns_learned": 23,
    "patterns_applied": 156,
    "auto_corrections": 45,
    "user_satisfaction": 0.85
  }
}
```

## References

- [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Reflection & Reflexion mechanisms](https://cloud.tencent.com/developer/article/2588362)
- [Google's Reasoning Memory](https://www.xiaohu.ai/c/ai/google-ai-agent-self-improve-dd3593b2-2759-4b0f-95e8-ce12e6faa361)

---

## Self-Improvement Log

### Pattern Learned: Document Separation for Complex PRDs (2025-01-11)

**Source**: User feedback on Borrow Refresh PRD

**Experience**: Single large PRD file (~500 lines) with mixed product/technical content was hard to follow. User created 4 separate files with clear purposes.

**Pattern**: For non-trivial PRDs, split into 4 files:

| File | Purpose | Audience |
|------|---------|----------|
| `{name}-notes.md` | Thinking process, options analysis | Self + future reviewers |
| `{name}-task-plan.md` | Project tracking, phases, progress | PM + development lead |
| `{name}-prd.md` | Product requirements (what & why) | PM + stakeholders + developers |
| `{name}-tech.md` | Technical design (how) | Developers + architects |

**Quality Rules Added**:
- [ ] PRD focuses on problem, goals, scope, user flows
- [ ] Tech doc focuses on API, data flow, implementation
- [ ] Notes document architecture options with A/B/C analysis
- [ ] Task plan has checkboxes with timestamps
- [ ] PRD references tech doc, doesn't duplicate

**Confidence**: 0.95 (based on direct user comparison)

### Pattern Learned: Measurable Success Criteria (2025-01-11)

**Source**: User's PRD success criteria section

**Experience**: Vague success criteria like "data refreshes" don't enable verification. Specific timings like "within 3-5 seconds" make testing possible.

**Pattern**:

| Bad | Good |
|-----|------|
| "Data refreshes after transaction" | "BorrowHome data refreshes within 3-5 seconds after pending transaction completes" |
| "Manual refresh works" | "Manual refresh button triggers full refresh and shows loading state" |
| "No performance regression" | "API response time under 500ms for 95th percentile" |

**Quality Rules Added**:
- [ ] Success criteria include specific numbers/timings
- [ ] Each criterion is objectively verifiable
- [ ] Performance targets have percentiles (e.g., 95th, 99th)
- [ ] User-facing behavior has observable indicators

**Confidence**: 0.90

### Pattern Learned: Non-Goals Section (2025-01-11)

**Source**: User's PRD structure

**Experience**: Without explicit non-goals, scope creeps during implementation. "What we won't do" is as important as "what we will do."

**Pattern**:

```markdown
## Goals
- [Specific achievable outcomes]

## Non-Goals
- [Explicit exclusions - things that might seem related but aren't]
```

**Example from Borrow Refresh**:
- Goals: "Unified refresh entry point", "Manual refresh button"
- Non-Goals: "Full Jotai migration", "Real-time updates"

**Quality Rules Added**:
- [ ] Goals section has 3-5 focused items
- [ ] Non-goals section explicitly excludes reasonable-but-out-of-scope items
- [ ] Each non-goal has a brief rationale if not obvious

**Confidence**: 0.90
