#!/usr/bin/env python3
# Template generator for API design.

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
    parser = argparse.ArgumentParser(description="Generate a starter API design.")
    parser.add_argument("--output", default="api-design.md", help="Output file path")
    parser.add_argument("--name", default="example", help="Primary resource name")
    parser.add_argument("--owner", default="team", help="Owning team or service")
    parser.add_argument("--force", action="store_true", help="Overwrite existing file")
    args = parser.parse_args()

    content = textwrap.dedent(
        f"""\
        # API Design

        ## Overview
        Describe the API for {args.name}.

        ## Ownership
        - Owner: {args.owner}
        - Stakeholders: TBD

        ## Goals
        - Provide CRUD for {args.name}
        - Maintain backward compatibility

        ## Non-Goals
        - Bulk export
        - Cross-service transactions

        ## Resources
        - {args.name}
        - {args.name}-metadata

        ## Endpoints
        | Method | Path | Description | Auth |
        | --- | --- | --- | --- |
        | GET | /{args.name} | List {args.name} | Required |
        | POST | /{args.name} | Create {args.name} | Required |

        ## Authentication
        - OAuth2 bearer tokens
        - Service-to-service mTLS

        ## Error Model
        - Use RFC7807 problem details
        - Standard error codes and retry hints

        ## Pagination and Filtering
        - Cursor-based pagination
        - Filter by status, owner, and created_at

        ## Rate Limits
        - 100 rps per token, burst 200

        ## Observability
        - Structured logs with request_id
        - Metrics: latency, error rate, saturation

        ## Open Questions
        - Define data retention policy
        """
    ).strip() + "\n"

    output = Path(args.output)
    if not write_output(output, content, args.force):
        return 1
    print(f"Wrote {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
