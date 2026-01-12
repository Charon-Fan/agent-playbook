#!/usr/bin/env python3
# Lightweight secret scanner for common patterns.

from pathlib import Path
import argparse
import re

PATTERNS = [
    re.compile(r"AKIA[0-9A-Z]{16}"),
    re.compile(r"AIza[0-9A-Za-z_-]{35}"),
    re.compile(r"sk-[0-9A-Za-z]{20,}"),
]


def is_text_file(path: Path) -> bool:
    try:
        data = path.read_bytes()
    except OSError:
        return False
    return b"\x00" not in data


def main() -> int:
    parser = argparse.ArgumentParser(description="Scan for common secret patterns.")
    parser.add_argument("path", nargs="?", default=".", help="Path to scan")
    args = parser.parse_args()

    root = Path(args.path)
    if not root.exists():
        print("Path not found: " + str(root))
        return 1

    matches = []
    for file_path in root.rglob("*"):
        if not file_path.is_file():
            continue
        if file_path.suffix in {".png", ".jpg", ".jpeg", ".gif", ".pdf"}:
            continue
        if not is_text_file(file_path):
            continue
        text = file_path.read_text(encoding="utf-8", errors="ignore")
        for pattern in PATTERNS:
            if pattern.search(text):
                matches.append(str(file_path))
                break

    if matches:
        print("Potential secrets found:")
        for match in matches:
            print("- " + match)
        return 1

    print("No secrets found.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
