#!/usr/bin/env python3
# Template generator for deployment plan.

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
    parser = argparse.ArgumentParser(description="Generate a deployment plan.")
    parser.add_argument("--output", default="deploy-plan.md", help="Output file path")
    parser.add_argument("--name", default="example", help="Service or app name")
    parser.add_argument("--env", default="production", help="Target environment")
    parser.add_argument("--owner", default="team", help="Owning team")
    parser.add_argument("--force", action="store_true", help="Overwrite existing file")
    args = parser.parse_args()

    content = textwrap.dedent(
        f"""\
        # Deployment Plan

        ## Overview
        - Service: {args.name}
        - Environment: {args.env}
        - Owner: {args.owner}

        ## Preconditions
        - Release approved
        - Change window confirmed
        - Backups verified

        ## Steps
        1. Build and publish artifacts
        2. Deploy to staging and run smoke tests
        3. Run migrations (if needed)
        4. Deploy to {args.env}
        5. Verify health checks and dashboards

        ## Verification
        - Health endpoint returns 200
        - Key metrics within baseline
        - Error budget stable

        ## Rollback
        - Revert to last known good release
        - Disable feature flags
        - Communicate rollback status

        ## Observability
        - Dashboard links
        - Alert channels
        """
    ).strip() + "\n"

    output = Path(args.output)
    if not write_output(output, content, args.force):
        return 1
    print(f"Wrote {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
