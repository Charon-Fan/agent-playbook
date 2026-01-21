# @codeharbor/agent-playbook

One-command installer and workflow fixer for agent-playbook across Claude Code and Codex.

## Quick Start

```bash
pnpm dlx @codeharbor/agent-playbook init
# or
npm exec -- @codeharbor/agent-playbook init
```

Project-only setup:

```bash
pnpm dlx @codeharbor/agent-playbook init --project
```

## What It Does
- Links skills to `~/.claude/skills` and `~/.codex/skills` (or project `.claude/.codex`).
- Installs a stable CLI copy under `~/.claude/agent-playbook/` for hook execution.
- Adds Claude hooks for SessionEnd (session logs) and PostToolUse (self-improve MVP).
- Records a metadata block in `~/.codex/config.toml`.

## Commands
- `agent-playbook init [--project] [--copy] [--hooks] [--no-hooks] [--session-dir <path>] [--dry-run] [--repo <path>]`
- `agent-playbook status`
- `agent-playbook doctor`
- `agent-playbook repair`
- `agent-playbook uninstall`
- `agent-playbook session-log [--session-dir <path>]`
- `agent-playbook self-improve`

## Notes
- Default session logs go to repo `sessions/` if a Git root is found; otherwise `~/.claude/sessions/`.
- Hooks are merged without overwriting existing user hooks.
- Requires Node.js 18+.

## Advanced
- Override Claude/Codex config paths for testing:
  - `AGENT_PLAYBOOK_CLAUDE_DIR=/tmp/claude`
  - `AGENT_PLAYBOOK_CODEX_DIR=/tmp/codex`
