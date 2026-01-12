#!/usr/bin/env python3
# Template generator for performance profile.

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
    parser = argparse.ArgumentParser(description="Generate a performance profile.")
    parser.add_argument("--output", default="perf-profile.txt", help="Output file path")
    parser.add_argument("--name", default="example", help="Scenario name")
    parser.add_argument("--tool", default="perf", help="Profiling tool")
    parser.add_argument("--command", default="run-benchmark.sh", help="Command profiled")
    parser.add_argument("--duration", default="60s", help="Profile duration")
    parser.add_argument("--force", action="store_true", help="Overwrite existing file")
    args = parser.parse_args()

    content = textwrap.dedent(
        f"""\
        Profile: {args.name}
        Tool: {args.tool}
        Command: {args.command}
        Duration: {args.duration}

        Environment:
          - CPU:
          - Memory:
          - OS:
          - Build:

        Workload:
          - Input size:
          - Concurrency:
          - Dataset:

        Top Hotspots:
          - function_a: 0.00%
          - function_b: 0.00%

        Notes:
          - Findings summary
        """
    ).strip() + "\n"

    output = Path(args.output)
    if not write_output(output, content, args.force):
        return 1
    print(f"Wrote {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
