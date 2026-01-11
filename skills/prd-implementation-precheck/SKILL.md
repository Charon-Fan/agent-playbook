---
name: prd-implementation-precheck
description: Implement PRDs/specs with a mandatory precheck review before coding. Use when a user asks to implement a PRD/feature spec/requirements doc or says "implement PRD/spec". Perform a preflight review, raise questions on scope/consistency/risks, then implement after confirmation.
---

# PRD Implementation Precheck

## Overview

Perform a short PRD precheck, present issues and questions, then implement only after the user confirms or adjusts the PRD.

## Workflow

1. Locate the PRD and any referenced files.
2. Precheck the PRD and summarize intent in 1-2 sentences.
3. List findings and questions (blockers first), then ask for confirmation to proceed.
4. After confirmation, implement the PRD with minimal, consistent changes.
5. Validate (tests or manual steps) or state what was not run.

## Precheck Checklist

- Scope: Identify over-broad changes; suggest a smaller, targeted approach.
- Alignment: Flag conflicts with existing patterns or architecture; propose alternatives.
- Dependencies: Note missing hooks/providers/data sources or unclear ownership.
- Behavior: Verify flows and edge cases are specified; ask for gaps.
- Risks: Call out performance, regressions, or migration risks.
- Testing: Check success criteria and test coverage; request specifics if vague.

## Output Expectations

- Provide a concise precheck report with questions and risks.
- Ask explicitly: "Proceed as-is, or update the PRD?"
- If no blockers, state assumptions and continue only with user approval.
