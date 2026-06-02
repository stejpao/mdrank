"""Main MDRank pipeline: crawl → transform → load → export."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from config import SEED_DIR
from crawl import crawl_all, save_raw_json
from export_seed import generate_sql_dump
from load import load_processed
from transform import process_pipeline


def export_json(processed: list, output: Path) -> None:
    from export_json import export_processed  # local helper below

    export_processed(processed, output)


def main() -> None:
    raw_path = Path(__file__).resolve().parent / "raw_scrape.json"
    max_per = int(os.getenv("MAX_DEVICES_PER_SUBCATEGORY", "6"))

    if len(sys.argv) > 1 and sys.argv[1] == "export-only":
        data = json.loads(raw_path.read_text()) if raw_path.exists() else {"landing": {}, "devices": []}
        devices = data if isinstance(data, list) else data.get("devices", [])
        landing = data.get("landing", {}) if isinstance(data, dict) else {}
        processed = process_pipeline(devices, landing)
        generate_sql_dump(devices, landing, SEED_DIR / "mdrank.sql")
        return

    landing: dict = {}
    raw_devices: list = []

    if len(sys.argv) > 1 and sys.argv[1] == "load-only" and raw_path.exists():
        data = json.loads(raw_path.read_text())
        if isinstance(data, list):
            raw_devices = data
        else:
            landing = data.get("landing", {})
            raw_devices = data.get("devices", [])
    else:
        print("=== Phase 1: Crawling target site (5 categories) ===")
        try:
            landing, raw_devices = crawl_all(max_per_subcategory=max_per, skip_reviews=False)
        except Exception as exc:
            print(f"Crawl failed: {exc}")
            from seed_data import build_seed_payloads
            landing, raw_devices = build_seed_payloads()

        save_raw_json({"landing": landing, "devices": raw_devices}, raw_path)

    print(f"\n=== Phase 2: Transform (Oxiline purge + TrueVitals + jitter) ===")
    processed = process_pipeline(raw_devices, landing)
    print(f"Processed {len(processed)} devices")

    print("\n=== Phase 3: Load ===")
    try:
        load_processed(processed, landing)
    except Exception as exc:
        print(f"DB load skipped: {exc}")

    print("\n=== Phase 4: Export SQL + JSON ===")
    generate_sql_dump(raw_devices, landing, SEED_DIR / "mdrank.sql")

    json_out = Path(__file__).resolve().parent.parent / "web" / "src" / "data" / "devices.json"
    json_out.parent.mkdir(parents=True, exist_ok=True)
    export_data = {
        "landing": landing,
        "devices": [
            {"device": p["device_record"], "review": p["review_record"]}
            for p in processed
        ],
    }
    json_out.write_text(json.dumps(export_data, indent=2), encoding="utf-8")
    print(f"Exported frontend JSON to {json_out}")
    print("\nDone!")


if __name__ == "__main__":
    main()
