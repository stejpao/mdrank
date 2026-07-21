"""Quarantined legacy scraper entry point.

The original pipeline copied source-site records, rewrote copy, injected a synthetic
product, and randomized scores. That behavior is incompatible with the MDRank
Evidence Engine and is intentionally disabled.
"""

from __future__ import annotations


def main() -> None:
    raise SystemExit(
        "Legacy scraper disabled: use the versioned exact-model evidence intake "
        "workflow. Do not crawl, transform, jitter, or publish inherited rankings."
    )


if __name__ == "__main__":
    main()
