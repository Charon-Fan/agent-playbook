#!/usr/bin/env bash
set -euo pipefail

TOOL_NAME="${1:-}"
TOOL_INPUT="${2:-}"
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRANCH="$(git -C "$ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

mkdir -p "$HOME/.claude/memory/working"

python - "$TOOL_NAME" "$TOOL_INPUT" "$ROOT" "$BRANCH" "$TS" <<'PY'
import json
import os
import sys

tool_name, tool_input, root, branch, ts = sys.argv[1:]

data = {
    "timestamp": ts,
    "tool": tool_name,
    "repo_root": root,
    "branch": branch,
    "input_preview": tool_input[:200],
}

path = os.path.expanduser("~/.claude/memory/working/current_session.json")
with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
PY
