#!/usr/bin/env python3
# Template validator for API design.

from pathlib import Path
import argparse

DEFAULT_REQUIRED = [
    "## Overview",
    "## Ownership",
    "## Resources",
    "## Endpoints",
    "## Authentication",
    "## Error Model",
    "## Pagination",
    "## Rate Limits",
]


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a generated artifact.")
    parser.add_argument("--input", default="api-design.md", help="Input file path")
    parser.add_argument(
        "--require",
        action="append",
        default=[],
        help="Additional required section heading",
    )
    args = parser.parse_args()

    path = Path(args.input)
    if not path.exists():
        print(f"Missing file: {path}")
        return 1

    text = path.read_text(encoding="utf-8", errors="ignore")
    text_lower = text.lower()
    required = DEFAULT_REQUIRED + args.require
    missing = [section for section in required if section.lower() not in text_lower]
    if missing:
        print("Missing required sections: " + ", ".join(missing))
        return 1

    print(f"Validated {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
