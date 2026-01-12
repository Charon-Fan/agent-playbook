#!/usr/bin/env bash
set -euo pipefail

TS="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

mkdir -p "$HOME/.claude/memory/working"

echo "{\"timestamp\": \"$TS\", \"event\": \"session_end\"}" > "$HOME/.claude/memory/working/session_end.json"

echo "self-improving-agent: consider running evolution review for this session"
