#!/usr/bin/env python3
# Template generator for performance report.

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
    parser = argparse.ArgumentParser(description="Generate a performance report.")
    parser.add_argument("--output", default="perf-report.md", help="Output file path")
    parser.add_argument("--name", default="example", help="System or endpoint name")
    parser.add_argument("--owner", default="team", help="Owning team")
    parser.add_argument("--force", action="store_true", help="Overwrite existing file")
    args = parser.parse_args()

    content = textwrap.dedent(
        f"""\
        # Performance Report

        ## Summary
        {args.name}

        ## Ownership
        - Owner: {args.owner}

        ## Baseline Metrics
        - p50 latency:
        - p95 latency:
        - error rate:
        - throughput:

        ## Findings
        - Top bottlenecks
        - Resource saturation

        ## Recommendations
        - Short-term fixes
        - Long-term optimizations

        ## Validation
        - Benchmark commands
        - Regression checks
        """
    ).strip() + "\n"

    output = Path(args.output)
    if not write_output(output, content, args.force):
        return 1
    print(f"Wrote {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
