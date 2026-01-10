# PRD Feedback Optimizer

> A self-improving skill that collects user feedback and iteratively optimizes the architecting-solutions skill.

## Overview

This skill automatically collects user feedback after PRD generation, analyzes the feedback, and updates the skill itself to improve future performance. It then creates a pull request with the improvements.

## When It Activates

This skill activates automatically after the `architecting-solutions` skill completes a PRD, before the final validation step.

## Workflow

```text
┌─────────────────────────────────────────────────────────────┐
│  architecting-solutions generates PRD                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  prd-feedback-optimizer collects feedback                   │
│  - Rate the PRD quality (1-10)                              │
│  - What was done well?                                      │
│  - What needs improvement?                                  │
│  - What was missing?                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Analyze feedback and extract insights                      │
│  - Pattern recognition                                      │
│  - Abstract key improvements                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Update architecting-solutions skill                        │
│  - Add new patterns to SKILL.md                             │
│  - Update checklists                                        │
│  - Enhance templates                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Create pull request                                        │
│  - Commit changes                                           │
│  - Push to remote                                           │
│  - Create PR with summary                                   │
└─────────────────────────────────────────────────────────────┘
```

## Feedback Collection Template

After each PRD generation, ask the user:

```markdown
## PRD Feedback Collection

Thank you for using the architecting-solutions skill! Your feedback helps improve future PRDs.

### 1. Overall Rating
How would you rate this PRD? (1-10)
- [ ] 1-3: Needs significant improvement
- [ ] 4-6: Acceptable but has issues
- [ ] 7-8: Good with minor issues
- [ ] 9-10: Excellent

### 2. What Was Done Well
What aspects of this PRD did you like?

### 3. What Needs Improvement
What should be improved?

### 4. What Was Missing
What important aspects were not covered?

### 5. Context (Optional)
- Project type: [web/mobile/api/library/other]
- Tech stack: [your tech stack]
- Team size: [solo/small/large]

---

**Your feedback will be used to:**
1. Update the skill's patterns and templates
2. Add domain-specific best practices
3. Create a pull request in the agent-playbook repository
```

## Feedback Analysis Process

### Step 1: Extract Actionable Insights

For each feedback item, categorize and extract:

```python
# Feedback categories
CATEGORIES = {
    "structure": ["organization", "sections", "flow", "clarity"],
    "content": ["completeness", "detail level", "accuracy", "relevance"],
    "domain": ["framework-specific", "language-specific", "pattern-specific"],
    "process": ["questions asked", "analysis depth", "research quality"],
}

# Extract patterns
def extract_insights(feedback):
    insights = []
    for item in feedback:
        category = categorize(item)
        pattern = abstract_pattern(item)
        insights.append({
            "category": category,
            "pattern": pattern,
            "context": get_context(item)
        })
    return insights
```

### Step 2: Update Strategy

Based on feedback category:

| Category | Update Action | Example |
|----------|---------------|---------|
| Structure | Add new sections to PRD template | Missing "Migration Strategy" section |
| Content | Enhance prompts for specific areas | Add "Error handling" to checklist |
| Domain | Add domain-specific patterns | React-specific state management guidance |
| Process | Add new questions to ask | Ask about "deployment strategy" |

### Step 3: Skill Update Locations

```text
~/.claude/skills/architecting-solutions/
├── SKILL.md              # Main skill file
│   ├── Questions to ask (line ~35-50)
│   ├── Workflow checklist (line ~20-30)
│   └── Quality checklist (line ~130-150)
└── reference/
    ├── prd-template.md   # PRD template structure
    └── best-practices.md # Domain-specific practices
```

## Automatic PR Process

### Step 1: Commit Changes

```bash
# Format: feedback-{category}-{short-description}
git add SKILL.md reference/
git commit -m "feat: improve PRD generation based on user feedback

- Add ${improvement_1}
- Enhance ${improvement_2}
- Add pattern: ${pattern_1}

Feedback summary:
${feedback_summary}

🤖 Generated with Claude Code"
```

### Step 2: Create Branch and PR

```bash
# Create feature branch
git checkout -b feedback-improvement-$(date +%Y%m%d)

# Push to remote
git push -u origin feedback-improvement-$(date +%Y%m%d)

# Create PR
gh pr create \
  --title "Improve PRD generation based on user feedback" \
  --body "$(cat <<'EOF'
## Summary
This PR improves the architecting-solutions skill based on recent user feedback.

## Changes
${changes_list}

## Feedback Summary
${feedback_summary}

## Test Plan
- [ ] Verified skill still executes correctly
- [ ] New patterns produce better PRDs
- [ ] No regressions in existing functionality

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

## Feedback to Pattern Mapping

### Common Feedback Patterns

| User Feedback | Abstract Pattern | Skill Update |
|---------------|------------------|--------------|
| "Missing API documentation" | API contracts must be documented | Add API section to PRD template |
| "Didn't ask about deployment" | Clarify deployment requirements | Add deployment question to Step 1 |
| "Too generic, not specific to React" | Framework-specific guidance needed | Add React patterns to best-practices |
| "Missing error handling" | Error scenarios must be considered | Add error handling to checklist |
| "Performance section too vague" | Need specific performance metrics | Add performance template with metrics |

## Continuous Improvement Loop

```text
┌─────────────────────────────────────────────────────────────┐
│                     FEEDBACK LOOP                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│   ┌─────────┐    ┌──────────┐    ┌─────────────┐            │
│   │  Generate   │→  Collect  │→  │  Analyze    │            │
│   │    PRD      │   Feedback   │   Feedback    │            │
│   └─────────┘    └──────────┘    └─────────────┘            │
│       ▲                               │                      │
│       │                               ▼                      │
│       │                    ┌─────────────┐                   │
│       │                    │   Update    │                   │
│       │                    │    Skill    │                   │
│       │                    └─────────────┘                   │
│       │                               │                      │
│       │                               ▼                      │
│       │                    ┌─────────────┐                   │
│       │                    │ Create PR   │                   │
│       │                    └─────────────┘                   │
│       │                               │                      │
│       └───────────────────────────────┘                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Installation

To integrate this skill with architecting-solutions:

1. Add this skill to your global skills: `~/.claude/skills/prd-feedback-optimizer/`
2. Modify `architecting-solutions/SKILL.md` to include feedback step
3. Configure git remote for automatic PR creation

## Configuration

Create `~/.claude/skills/prd-feedback-optimizer/config.yaml`:

```yaml
# Repository for skill improvements
feedback_repository:
  owner: "your-username"
  repo: "agent-playbook"
  branch: "main"

# Auto-PR settings
auto_pr:
  enabled: true
  create_branch: true
  push_immediately: true

# Feedback storage
feedback_storage:
  local_file: "~/.claude/skills/feedback-history.json"
```

## Example Session

```text
You: "Create a PRD for a user authentication system"

Claude: [Generates PRD using architecting-solutions]

Claude: [Activates prd-feedback-optimizer]

---
## PRD Feedback Collection

Thank you for using the architecting-solutions skill! Your feedback helps improve future PRDs.

### 1. Overall Rating
How would you rate this PRD? (1-10)

You: "I'd give it a 7. Good structure but missing OAuth 2.0 specifics."

Claude: Thank you! Let me capture that feedback...

[Analyzing feedback]
- Category: content, domain
- Pattern: Authentication-specific requirements needed
- Action: Add OAuth 2.0 section to authentication PRD template

[Updating skill]
- Updated reference/prd-template.md with OAuth 2.0 section
- Added authentication-specific questions to SKILL.md

[Creating PR]
✓ Branch created: feedback-improvement-20250110
✓ Changes committed
✓ Pushed to remote
✓ PR created: https://github.com/your-username/agent-playbook/pull/1
---
```

## Links

- [Repository](https://github.com/your-username/agent-playbook)
- [Related: architecting-solutions](./architecting-solutions.md)
