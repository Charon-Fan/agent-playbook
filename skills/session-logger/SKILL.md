---
name: session-logger
description: Saves conversation history to session log files. Use when user says "保存对话", "保存对话信息", "记录会话", "save session", or "save conversation". Automatically creates timestamped session log in sessions/ directory.
allowed-tools: Read, Write, Edit, Bash
---

# Session Logger

A skill for automatically saving conversation history to persistent session log files.

## When This Skill Activates

This skill activates when you:
- Say "保存对话信息" or "保存对话"
- Say "记录会话内容" or "保存session"
- Say "save session" or "save conversation"
- Ask to save the current conversation

## Session File Location

All sessions are saved to: `sessions/YYYY-MM-DD-{topic}.md`

## What Gets Logged

For each session, log:

1. **Metadata**
   - Date and duration
   - Context/working directory
   - Main topic

2. **Summary**
   - What was accomplished
   - Key decisions made
   - Files created/modified

3. **Actions Taken**
   - Checklist of completed tasks
   - Pending follow-ups

4. **Technical Notes**
   - Important code snippets
   - Commands used
   - Solutions found

5. **Open Questions**
   - Issues to revisit
   - Follow-up tasks

## Session Template

```markdown
# Session: {Topic}

**Date**: {YYYY-MM-DD}
**Duration**: {approximate}
**Context**: {project/directory}

## Summary

{What was accomplished in this session}

## Key Decisions

1. {Decision 1}
2. {Decision 2}

## Actions Taken

- [x] {Completed action 1}
- [x] {Completed action 2}
- [ ] {Pending action 3}

## Technical Notes

{Important technical details}

## Open Questions / Follow-ups

- {Question 1}
- {Question 2}

## Related Files

- `{file-path}` - {what changed}
```

## How to Use

### Option 1: Automatic Logging

Simply say:
```
"保存对话信息"
```

The skill will:
1. Review the conversation history
2. Extract key information
3. Create/update the session file

### Option 2: With Topic

Specify the session topic:
```
"保存对话，主题是 skill-router 创建"
```

### Option 3: Manual Prompt

If auto-extraction misses something, provide details:
```
"保存对话，重点是：1) 创建了 skill-router，2) 修复了 front matter"
```

## File Naming

| Input | Filename |
|-------|----------|
| "保存对话" | `YYYY-MM-DD-session.md` |
| "保存对话，主题是 prd" | `YYYY-MM-DD-prd.md` |
| "保存今天的讨论" | `YYYY-MM-DD-discussion.md` |

## Session Log Structure

```
sessions/
├── README.md                      # This file
├── 2025-01-11-skill-router.md     # Session about skill-router
├── 2025-01-11-prd-planner.md      # Session about PRD planner
└── 2025-01-12-refactoring.md      # Session about refactoring
```

## Privacy Note

Session logs are stored in `sessions/` which is in `.gitignore`.
- Logs are NOT committed to git
- Logs contain your actual conversation
- Safe to include sensitive information

## Quick Reference

| You say | Skill does |
|---------|------------|
| "保存对话信息" | Creates session log with today's date |
| "保存今天的对话" | Creates session log |
| "保存session" | Creates session log |
| "记录会话" | Creates session log |

## Best Practices

1. **Save at key milestones**: After completing a feature, fixing a bug, etc.
2. **Be specific with topics**: Helps when searching later
3. **Include code snippets**: Save important solutions
4. **Track decisions**: Why did you choose X over Y?
5. **List pending items**: What to do next time
