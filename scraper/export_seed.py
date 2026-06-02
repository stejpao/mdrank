"""Generate MDRank SQL seed dump without a live database."""

from __future__ import annotations

import json
import uuid
from pathlib import Path

from config import BRAND_NAME, SEED_DIR
from transform import process_pipeline


def _sql_val(v) -> str:
    if v is None:
        return "NULL"
    if isinstance(v, bool):
        return "TRUE" if v else "FALSE"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, (dict, list)):
        escaped = json.dumps(v).replace("'", "''")
        return f"'{escaped}'::jsonb"
    escaped = str(v).replace("'", "''")
    return f"'{escaped}'"


def generate_sql_dump(raw_results: list[dict], landing: dict | None, output_path: Path) -> None:
    processed = process_pipeline(raw_results, landing)
    lines = [
        f"-- {BRAND_NAME}.org transformed seed dump",
        f"-- Devices: {len(processed)} (includes TrueVitals BP Pro synthetic)",
        "",
        "BEGIN;",
        "",
    ]

    if landing:
        title = (landing.get("hero_title") or "MDRank — Data-Driven Device Rankings").replace("MedGrade", "MDRank")
        body = (landing.get("hero_body") or "Independent clinical device rankings and hands-on reviews.").replace("MedGrade", "MDRank")
        lines.append(
            f"INSERT INTO site_pages (slug, page_type, title, body, is_published) "
            f"VALUES ('home', 'landing_hero', {_sql_val(title)}, {_sql_val(body)}, TRUE) "
            f"ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body;"
        )
        lines.append("")

    for item in processed:
        d = item["device_record"]
        r = item["review_record"]
        device_id = str(uuid.uuid4())
        review_id = str(uuid.uuid4())

        cols = [
            "id", "slug", "source_url", "name", "manufacturer", "mdrank_score",
            "fda_status", "connectivity", "retail_price", "spec_json", "image_url",
            "overview", "key_features", "is_editors_choice", "is_synthetic",
            "rank_in_subcategory", "is_published",
        ]
        vals = [
            f"'{device_id}'",
            _sql_val(d["slug"]),
            _sql_val(d.get("source_url")),
            _sql_val(d["name"]),
            _sql_val(d["manufacturer"]),
            str(d["mdrank_score"]),
            f"'{d['fda_status']}'::fda_status",
            _sql_val(d.get("connectivity")),
            str(d["retail_price"]) if d.get("retail_price") is not None else "NULL",
            _sql_val(d.get("spec_json") or {}),
            _sql_val(d.get("image_url")),
            _sql_val(d.get("overview")),
            _sql_val(d.get("key_features") or []),
            "TRUE" if d.get("is_editors_choice") else "FALSE",
            "TRUE" if d.get("is_synthetic") else "FALSE",
            str(d["rank_in_subcategory"]) if d.get("rank_in_subcategory") else "NULL",
            "TRUE",
        ]
        lines.append(f"INSERT INTO devices ({', '.join(cols)}) VALUES ({', '.join(vals)}) ON CONFLICT (slug) DO NOTHING;")

        slugs = d.get("subcategory_slugs") or []
        if isinstance(slugs, str):
            slugs = [slugs]
        for sub_slug in slugs:
            if sub_slug:
                rank = d.get("rank_in_subcategory")
                lines.append(
                    f"INSERT INTO device_subcategories (device_id, subcategory_id, rank) "
                    f"SELECT '{device_id}'::uuid, id, {rank if rank else 'NULL'} FROM subcategories WHERE slug = '{sub_slug}' "
                    f"ON CONFLICT DO NOTHING;"
                )

        lines.append(
            f"INSERT INTO reviews (id, device_id, slug, title, excerpt, strengths, limitations, recommend_if, avoid_if, is_published, published_at) "
            f"VALUES ('{review_id}', '{device_id}'::uuid, {_sql_val(r['slug'])}, {_sql_val(r['title'])}, {_sql_val(r.get('excerpt'))}, "
            f"{_sql_val(r.get('strengths') or [])}, {_sql_val(r.get('limitations') or [])}, "
            f"{_sql_val(r.get('recommend_if') or [])}, {_sql_val(r.get('avoid_if') or [])}, TRUE, NOW()) "
            f"ON CONFLICT (slug) DO NOTHING;"
        )

        for section in r.get("sections") or []:
            sec_id = str(uuid.uuid4())
            lines.append(
                f"INSERT INTO review_sections (id, review_id, section_type, heading, body, sort_order) "
                f"VALUES ('{sec_id}', '{review_id}'::uuid, '{section.get('section_type', 'overview')}'::review_section_type, "
                f"{_sql_val(section.get('heading', 'Section'))}, {_sql_val(section.get('body', ''))}, {section.get('sort_order', 0)});"
            )
        lines.append("")

    lines.append("COMMIT;")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Generated {output_path} ({len(processed)} devices)")
