#!/usr/bin/env python3
# Template generator for debug report.

from pathlib import Path
import argparse
import textwrap


def write_output(path: Path, content: str, force: bool) -> bool:
    if path.exists() and not force:
        print(f"{path} already exists (use --force to overwrite)")
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate a debug report.")
    parser.add_argument("--output", default="debug-report.md", help="Output file path")
    parser.add_argument("--name", default="example", help="Issue summary")
    parser.add_argument("--owner", default="team", help="Owning team")
    parser.add_argument("--force", action="store_true", help="Overwrite existing file")
    args = parser.parse_args()

    content = textwrap.dedent(
        f"""\
        # Debug Report

        ## Summary
        {args.name}

        ## Ownership
        - Owner: {args.owner}
        - On-call: TBD

        ## Environment
        - Service version:
        - Region:
        - Traffic level:

        ## Steps to Reproduce
        1. Step one
        2. Step two

        ## Expected vs Actual
        - Expected:
        - Actual:

        ## Logs and Evidence
        - Attach logs, screenshots, traces

        ## Root Cause
        TBD

        ## Fix
        - Code changes
        - Configuration changes

        ## Regression Tests
        - Add or update tests

        ## Follow-ups
        - Monitoring improvements
        - Runbook updates
        """
    ).strip() + "\n"

    output = Path(args.output)
    if not write_output(output, content, args.force):
        return 1
    print(f"Wrote {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
