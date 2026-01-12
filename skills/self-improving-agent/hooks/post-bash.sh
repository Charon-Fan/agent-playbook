#!/usr/bin/env bash
set -euo pipefail

TOOL_OUTPUT="${1:-}"
EXIT_CODE="${2:-0}"
TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

if [ "$EXIT_CODE" -eq 0 ]; then
  exit 0
fi

mkdir -p "$HOME/.claude/memory/working"

python - "$TOOL_OUTPUT" "$EXIT_CODE" "$TS" <<'PY'
import json
import os
import sys

output, exit_code, ts = sys.argv[1:]

data = {
    "timestamp": ts,
    "exit_code": int(exit_code),
    "output_preview": output[:800],
}

path = os.path.expanduser("~/.claude/memory/working/last_error.json")
with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
PY

echo "self-improving-agent: captured error context for self-correction"
