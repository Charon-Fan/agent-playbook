#!/usr/bin/env python3
# Template generator for documentation scaffold.

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
    parser = argparse.ArgumentParser(description="Generate documentation scaffold.")
    parser.add_argument("--output", default="docs/README.md", help="Output file path")
    parser.add_argument("--name", default="example", help="Product or service name")
    parser.add_argument("--owner", default="team", help="Owning team")
    parser.add_argument("--force", action="store_true", help="Overwrite existing file")
    args = parser.parse_args()

    content = textwrap.dedent(
        f"""\
        # Documentation

        ## Overview
        Describe {args.name} and its purpose.

        ## Ownership
        - Owner: {args.owner}
        - Support channel: TBD

        ## Quickstart
        1. Install dependencies
        2. Configure environment
        3. Run the service

        ## Configuration
        - Required environment variables
        - Feature flags

        ## Usage
        Examples for {args.name}.

        ## API Reference
        - Endpoints or SDK methods

        ## Troubleshooting
        - Common errors and fixes

        ## Changelog
        - Recent updates
        """
    ).strip() + "\n"

    output = Path(args.output)
    if not write_output(output, content, args.force):
        return 1
    print(f"Wrote {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
