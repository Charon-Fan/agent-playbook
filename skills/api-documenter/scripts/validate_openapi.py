#!/usr/bin/env python3
# Template validator for OpenAPI schema.

from pathlib import Path
import argparse

DEFAULT_REQUIRED = [
    "openapi:",
    "info:",
    "servers:",
    "paths:",
    "components:",
    "securitySchemes:",
]


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a generated artifact.")
    parser.add_argument("--input", default="openapi.yaml", help="Input file path")
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
    required = DEFAULT_REQUIRED + args.require
    missing = [token for token in required if token not in text]
    if missing:
        print("Missing required sections: " + ", ".join(missing))
        return 1

    print(f"Validated {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
