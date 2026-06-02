"""Export JSON for Next.js frontend fallback."""

import json
from pathlib import Path

from export_seed import generate_sql_dump  # noqa: F401
from seed_data import build_seed_payloads
from transform import build_device_record, build_review_record, transform_with_llm

OUT = Path(__file__).resolve().parent.parent / "web" / "src" / "data" / "devices.json"


def main() -> None:
    payloads = build_seed_payloads()
    devices = []
    for raw in payloads:
        transformed = transform_with_llm(raw)
        device = build_device_record(raw, transformed)
        review = build_review_record(raw, transformed, device["slug"])

        subscores_dict = device.pop("subscores", {}) or {}
        device["subscores"] = [
            {"metric_key": k, "score": v["score"], "narrative": v.get("narrative", "")}
            for k, v in subscores_dict.items()
            if isinstance(v, dict) and v.get("score") is not None
        ]

        specs_dict = device.pop("specs", {}) or {}
        device["specs"] = [
            {"spec_key": k, "spec_value": v}
            for k, v in specs_dict.items()
            if v
        ]

        devices.append({"device": device, "review": review})

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"devices": devices}, indent=2), encoding="utf-8")
    print(f"Exported {len(devices)} devices to {OUT}")


if __name__ == "__main__":
    main()
