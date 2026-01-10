---
name: prd-feedback-optimizer
description: Collects user feedback after PRD generation and iteratively improves the architecting-solutions skill. Automatically updates skill files and creates pull requests with improvements.
allowed-tools: Read, Write, Edit, Bash, AskUserQuestion
---

# PRD Feedback Optimizer

A self-improving skill that collects user feedback after PRD generation and uses it to optimize the architecting-solutions skill.

## When to Use

This skill activates automatically after `architecting-solutions` completes a PRD. It can also be invoked manually with:

- "Collect feedback on this PRD"
- "Rate the PRD quality"
- "Improve the PRD skill"

## Workflow

```text
1. Collect user feedback (rating, what worked, what didn't)
2. Analyze feedback and extract actionable patterns
3. Update architecting-solutions skill files
4. Commit changes and create pull request
```

## Step 1: Collect Feedback

After PRD completion, ask the user these questions using AskUserQuestion:

```markdown
## PRD Feedback

Your feedback helps improve future PRD generation.

### Overall Quality
How would you rate this PRD? (1-10)

### What Was Good
What aspects of this PRD did you like?

### What Needs Improvement
What should be improved?

### What Was Missing
What important aspects were not covered?

### Context (Optional)
- Project type: web/mobile/api/library/other
- Tech stack:
- Team size:
```

## Step 2: Analyze Feedback

Categorize each feedback item:

| Category | Indicators | Action |
|----------|------------|--------|
| Structure | Organization, sections, flow | Update PRD template |
| Content | Completeness, detail, accuracy | Enhance prompts/checklists |
| Domain | Framework/language specific | Add domain patterns |
| Process | Questions, analysis, research | Update workflow |

Extract abstract patterns:
- **Concrete**: "Missing OAuth 2.0 flow diagram"
- **Abstract**: "Add authentication protocol specifications"

## Step 3: Update Skill Files

Target files to update:

```text
~/.claude/skills/architecting-solutions/
├── SKILL.md              # Questions, checklists
└── reference/
    ├── prd-template.md   # Template structure
    └── best-practices.md # Domain patterns
```

Update strategies by category:

1. **Structure issues**: Add new section to `reference/prd-template.md`
2. **Content issues**: Add item to quality checklist in `SKILL.md`
3. **Domain issues**: Add domain pattern to `reference/best-practices.md`
4. **Process issues**: Add question to "Step 1: Clarify Requirements"

## Step 4: Create Pull Request

Execute these commands:

```bash
cd ~/.claude/skills/architecting-solutions

# Create feature branch
git checkout -b feedback-improvement-$(date +%Y%m%d-%H%M%S)

# Add changes
git add SKILL.md reference/
git commit -m "$(cat <<'EOF'
feat: improve PRD generation based on user feedback

${SUMMARY_OF_CHANGES}

Feedback summary:
${FEEDBACK_SUMMARY}

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"

# Push to remote
git push -u origin feedback-improvement-$(date +%Y%m%d-%H%M%S)

# Create PR using gh CLI
gh pr create \
  --title "Improve PRD generation based on user feedback" \
  --body "$(cat <<'EOF'
## Summary
This PR improves the architecting-solutions skill based on recent user feedback.

## Changes
${CHANGES_BULLET_LIST}

## Feedback Summary
${USER_FEEDBACK_SUMMARY}

## Test Plan
- [ ] Verified skill still executes correctly
- [ ] New patterns produce better PRDs
- [ ] No regressions in existing functionality

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

## Integration with architecting-solutions

Add this to the end of `architecting-solutions/SKILL.md`:

```markdown
## Step 8: Collect Feedback and Improve

After delivering the PRD:

1. **Activate feedback collector** - Use prd-feedback-optimizer skill
2. **Collect user rating** - Ask for 1-10 rating and specific feedback
3. **Extract insights** - Abstract patterns from concrete feedback
4. **Update this skill** - Incorporate improvements
5. **Create PR** - Submit changes to repository

This continuous improvement loop ensures the skill evolves with real-world usage.
```

## Feedback to Pattern Examples

| User Feedback | Pattern | Skill Update |
|---------------|---------|--------------|
| Missing API docs | API contracts required | Add API section to template |
| Didn't ask about deployment | Deployment requirements | Add deployment question |
| Too generic for React | Framework-specific guidance | Add React patterns |
| Missing error handling | Error scenarios | Add error handling to checklist |
| Performance too vague | Specific metrics needed | Add performance metrics template |

## Quality Checklist for Updates

Before submitting PR:

- [ ] Feedback is accurately captured
- [ ] Pattern is properly abstracted
- [ ] Skill file syntax is valid
- [ ] Update location is appropriate
- [ ] Commit message is clear
- [ ] PR description is complete
