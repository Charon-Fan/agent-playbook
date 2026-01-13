# Edge Case Analysis Reference

This document provides detailed guidance for Step 2.5: Context-Aware Edge Case Analysis.

## Codebase Pattern Scanning Commands

Run these searches to understand how the project handles common scenarios:

```bash
# Delete strategy (soft delete vs hard delete)
grep -r "softDelete\|isDeleted\|deletedAt\|removed" src/ --include="*.ts" --include="*.tsx"

# Error handling patterns
grep -r "toast\|notification\|alert\|snackbar\|message\." src/ --include="*.tsx"

# Empty state handling
grep -r "empty\|noData\|EmptyState\|placeholder" src/ --include="*.tsx"

# Pagination patterns
grep -r "pageSize\|limit\|offset\|pagination\|perPage" src/ --include="*.ts"

# Loading state patterns
grep -r "loading\|isLoading\|pending\|Skeleton" src/ --include="*.tsx"

# Validation patterns
grep -r "validate\|validator\|yup\|zod\|schema" src/ --include="*.ts"
```

## Requirement Type Classification

| Requirement Type | Keywords | Key Edge Cases |
|-----------------|----------|----------------|
| CRUD Operations | create, edit, delete, list | Concurrent edits, cascade delete, validation |
| State Workflow | status, approval, flow | Invalid transitions, rollback, concurrent state |
| Async Operations | submit, load, sync | Timeout, retry, race conditions |
| Data Display | list, report, dashboard | Empty data, pagination, sorting, filtering |
| Form Input | form, input, submit | Validation, required fields, format |
| File Operations | upload, download, export | Size limits, format validation, progress |

## Smart Assumptions Output Format

Record inferred patterns in `{scope}-prd-notes.md`:

```markdown
## Inferred Patterns (from codebase)

| Edge Case | Source | Pattern Applied |
|-----------|--------|-----------------|
| Delete strategy | `src/models/User.ts:45` uses `deletedAt` | Soft delete |
| Error display | `src/utils/toast.ts` global Toast | Toast notification |
| Empty state | `src/components/EmptyState.tsx` exists | Reuse EmptyState component |
| Pagination | `src/hooks/usePagination.ts:12` default 20 | 20 items per page |
| Loading | `src/components/Skeleton.tsx` exists | Use Skeleton component |
```

## When to Ask Users

Only ask about edge cases when:

1. **No precedent in codebase** - First time the project encounters this scenario
2. **Multiple patterns exist** - Codebase has inconsistent approaches
3. **Business decision required** - Technical analysis cannot determine the answer

### Question Categories

| Category | Example Question | When to Ask |
|----------|-----------------|-------------|
| Data lifecycle | "Should deleted items be recoverable?" | No existing delete pattern found |
| Conflict resolution | "When two users edit simultaneously, who wins?" | Feature involves concurrent access |
| Failure handling | "If partial data saves, show error or partial success?" | Complex multi-step operation |
| Business rules | "Can users edit after submission?" | State machine not defined |

## User Confirmation Format

```markdown
## Edge Cases Requiring Confirmation

Based on the feature requirements, these edge cases need your input:

### 1. Concurrent Edit Handling
When two users edit the same record simultaneously:
- [ ] A: Last write wins (simpler, may lose data)
- [ ] B: Show conflict dialog (better UX, more complex)
- [ ] C: Lock record during edit (prevents conflicts, may block users)

### 2. Cascade Delete Behavior
When deleting a parent record with children:
- [ ] A: Block deletion, show warning
- [ ] B: Cascade delete all children
- [ ] C: Orphan children (set parent_id to null)

**Note**: Questions not listed above will follow existing codebase patterns.
```

## Edge Cases Section in Notes File

```markdown
## Edge Cases

### Auto-handled (following codebase patterns)
- Empty list → Use existing `EmptyState` component
- Network error → Retry 3 times (from `src/utils/api.ts:23`)
- Form validation → Real-time with inline errors (from `src/hooks/useForm.ts`)

### Confirmed by User
- Concurrent edit: Last write wins (confirmed {date})
- Cascade delete: Block and warn (confirmed {date})

### Open Questions
- (List any remaining questions)
```
