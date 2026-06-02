"""Load transformed MDRank data into PostgreSQL."""

from __future__ import annotations

import json
from typing import Any

from db import create_scrape_run, finish_scrape_run, get_connection
from transform import process_pipeline


def _upsert_device(conn, record: dict[str, Any]) -> str:
    row = conn.execute(
        """
        INSERT INTO devices (
            slug, source_url, source_device_id, name, manufacturer, mdrank_score,
            fda_status, connectivity, retail_price, spec_json, image_url, image_local_path,
            overview, key_features, is_editors_choice, is_synthetic,
            rank_in_subcategory, is_published
        ) VALUES (
            %(slug)s, %(source_url)s, %(source_device_id)s, %(name)s, %(manufacturer)s, %(mdrank_score)s,
            %(fda_status)s::fda_status, %(connectivity)s, %(retail_price)s, %(spec_json)s::jsonb,
            %(image_url)s, %(image_local_path)s, %(overview)s, %(key_features)s::jsonb,
            %(is_editors_choice)s, %(is_synthetic)s, %(rank_in_subcategory)s, TRUE
        )
        ON CONFLICT (slug) DO UPDATE SET
            source_url = EXCLUDED.source_url,
            name = EXCLUDED.name,
            manufacturer = EXCLUDED.manufacturer,
            mdrank_score = EXCLUDED.mdrank_score,
            fda_status = EXCLUDED.fda_status,
            connectivity = EXCLUDED.connectivity,
            retail_price = EXCLUDED.retail_price,
            spec_json = EXCLUDED.spec_json,
            image_url = EXCLUDED.image_url,
            overview = EXCLUDED.overview,
            key_features = EXCLUDED.key_features,
            is_editors_choice = EXCLUDED.is_editors_choice,
            is_synthetic = EXCLUDED.is_synthetic,
            rank_in_subcategory = EXCLUDED.rank_in_subcategory,
            is_published = TRUE,
            updated_at = NOW()
        RETURNING id::text
        """,
        {
            **record,
            "spec_json": json.dumps(record.get("spec_json") or {}),
            "key_features": json.dumps(record.get("key_features") or []),
            "source_device_id": record.get("source_device_id"),
        },
    ).fetchone()
    return row["id"]


def _link_subcategories(conn, device_id: str, slugs: list[str], rank: int | None) -> None:
    if not slugs:
        return
    for slug in slugs:
        if not slug:
            continue
        conn.execute(
            """
            INSERT INTO device_subcategories (device_id, subcategory_id, rank)
            SELECT %s::uuid, id, %s FROM subcategories WHERE slug = %s
            ON CONFLICT (device_id, subcategory_id) DO UPDATE SET rank = EXCLUDED.rank
            """,
            (device_id, rank, slug),
        )


def _upsert_review(conn, device_id: str, review: dict[str, Any]) -> str:
    row = conn.execute(
        """
        INSERT INTO reviews (
            device_id, slug, source_url, title, excerpt,
            strengths, limitations, recommend_if, avoid_if, is_published, published_at
        ) VALUES (
            %s::uuid, %s, %s, %s, %s,
            %s::jsonb, %s::jsonb, %s::jsonb, %s::jsonb, TRUE, NOW()
        )
        ON CONFLICT (device_id) DO UPDATE SET
            slug = EXCLUDED.slug, title = EXCLUDED.title, excerpt = EXCLUDED.excerpt,
            strengths = EXCLUDED.strengths, limitations = EXCLUDED.limitations,
            recommend_if = EXCLUDED.recommend_if, avoid_if = EXCLUDED.avoid_if,
            is_published = TRUE, published_at = NOW(), updated_at = NOW()
        RETURNING id::text
        """,
        (
            device_id,
            review["slug"],
            review.get("source_url"),
            review["title"],
            review.get("excerpt"),
            json.dumps(review.get("strengths") or []),
            json.dumps(review.get("limitations") or []),
            json.dumps(review.get("recommend_if") or []),
            json.dumps(review.get("avoid_if") or []),
        ),
    ).fetchone()
    return row["id"]


def _upsert_review_sections(conn, review_id: str, sections: list[dict[str, Any]]) -> None:
    conn.execute("DELETE FROM review_sections WHERE review_id = %s::uuid", (review_id,))
    for section in sections:
        conn.execute(
            """
            INSERT INTO review_sections (review_id, section_type, heading, body, sort_order)
            VALUES (%s::uuid, %s::review_section_type, %s, %s, %s)
            """,
            (
                review_id,
                section.get("section_type", "overview"),
                section.get("heading", "Section"),
                section.get("body", ""),
                section.get("sort_order", 0),
            ),
        )


def _upsert_landing(conn, landing: dict[str, Any]) -> None:
    title = landing.get("hero_title") or "MDRank — Data-Driven Device Rankings"
    body = landing.get("hero_body") or ""
    sections = landing.get("sections") or []
    if sections and not body:
        body = "\n\n".join(f"## {s['heading']}\n{s['body']}" for s in sections[:4])

    conn.execute(
        """
        INSERT INTO site_pages (slug, page_type, title, body, is_published)
        VALUES ('home', 'landing_hero', %s, %s, TRUE)
        ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, body = EXCLUDED.body, is_published = TRUE
        """,
        (title.replace("MedGrade", "MDRank"), body.replace("MedGrade", "MDRank")),
    )


def load_processed(processed: list[dict[str, Any]], landing: dict | None = None) -> int:
    with get_connection() as conn:
        run_id = create_scrape_run(conn)
        loaded = 0

        if landing:
            _upsert_landing(conn, landing)

        for item in processed:
            device_record = item["device_record"]
            review_record = item["review_record"]
            slug = device_record.get("slug")
            if not slug:
                continue

            device_id = _upsert_device(conn, device_record)
            slugs = device_record.get("subcategory_slugs") or []
            if isinstance(slugs, str):
                slugs = [slugs]
            _link_subcategories(conn, device_id, [s for s in slugs if s], device_record.get("rank_in_subcategory"))

            review_id = _upsert_review(conn, device_id, review_record)
            _upsert_review_sections(conn, review_id, review_record.get("sections") or [])
            loaded += 1

        finish_scrape_run(conn, run_id, "loaded", f"Loaded {loaded} devices")
        print(f"Loaded {loaded} devices into database")
        return loaded


def load_all(raw_results: list[dict[str, Any]], landing: dict | None = None) -> int:
    processed = process_pipeline(raw_results, landing)
    return load_processed(processed, landing)
