#!/usr/bin/env python3
# Template generator for QA test plan.

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
    parser = argparse.ArgumentParser(description="Generate a QA test plan.")
    parser.add_argument("--output", default="docs/test-plan.md", help="Output file path")
    parser.add_argument("--name", default="example", help="Feature or release name")
    parser.add_argument("--owner", default="team", help="Owning team")
    parser.add_argument("--force", action="store_true", help="Overwrite existing file")
    args = parser.parse_args()

    content = textwrap.dedent(
        f"""\
        # QA Test Plan

        ## Scope
        {args.name}

        ## Ownership
        - Owner: {args.owner}
        - QA lead: TBD

        ## Risks
        - High impact areas
        - Known regressions

        ## Test Matrix
        - Platforms
        - Browsers
        - Locales

        ## Environments
        - Staging
        - Production

        ## Test Data
        - Seed data requirements
        - Edge-case fixtures

        ## Exit Criteria
        - Critical tests passing
        - No unresolved P0/P1 issues
        """
    ).strip() + "\n"

    output = Path(args.output)
    if not write_output(output, content, args.force):
        return 1
    print(f"Wrote {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
