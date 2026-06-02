"""LLM content transformation and MDRank data manipulation."""

from __future__ import annotations

import json
import random
import re
from typing import Any

from config import BRAND_NAME, FDA_STATUS_MAP, get_llm_client
from synthetic import build_truevitals_bp_pro


def is_oxiline(device: dict[str, Any]) -> bool:
    text = f"{device.get('name', '')} {device.get('manufacturer', '')}".lower()
    return "oxiline" in text


def jitter_mdrank_score(original: int | None) -> int:
    if original is None:
        return random.randint(65, 90)
    delta = random.randint(-4, 3)
    return max(0, min(100, original + delta))


def normalize_fda(text: str | None) -> str:
    if not text:
        return "unknown"
    lower = text.lower().strip()
    for key, value in FDA_STATUS_MAP.items():
        if key in lower:
            return value
    return "unknown"


def _fallback_rewrite(text: str, device_name: str) -> str:
    if not text:
        return f"Independent {BRAND_NAME} evaluation of the {device_name}."
    return re.sub(
        r"\b(MedGrade|clinical score|Clinical Score)\b",
        lambda m: BRAND_NAME + " Score" if "score" in m.group(0).lower() else BRAND_NAME,
        text,
        flags=re.IGNORECASE,
    )


def _fallback_transform(raw: dict[str, Any]) -> dict[str, Any]:
    device = raw.get("device", {})
    review = raw.get("review", {})
    name = device.get("name") or device.get("slug", "Device")
    original = device.get("clinical_score") or device.get("original_clinical_score")
    score = device.get("mdrank_score") or jitter_mdrank_score(original)

    return {
        "device": {
            "overview": _fallback_rewrite(device.get("overview") or "", name),
            "key_features": [
                _fallback_rewrite(f, name) for f in (device.get("key_features") or [])[:8]
            ],
        },
        "review": {
            "title": f"MDRank Hands-On Test: {name}",
            "excerpt": _fallback_rewrite(review.get("excerpt") or device.get("review_excerpt") or "", name),
            "strengths": [_fallback_rewrite(s, name) for s in (review.get("strengths") or [])],
            "limitations": [_fallback_rewrite(l, name) for l in (review.get("limitations") or [])],
            "recommend_if": review.get("recommend_if") or [],
            "avoid_if": review.get("avoid_if") or [],
            "sections": [
                {
                    **s,
                    "heading": _fallback_rewrite(s.get("heading", ""), name),
                    "body": _fallback_rewrite(s.get("body", ""), name),
                }
                for s in (review.get("sections") or [])
            ],
        },
        "mdrank_score": score,
        "landing_copy": {},
    }


def transform_with_llm(raw: dict[str, Any]) -> dict[str, Any]:
    client, model = get_llm_client()
    if not client:
        return _fallback_transform(raw)

    device = raw.get("device", {})
    review = raw.get("review", {})
    name = device.get("name") or device.get("slug")
    original = device.get("clinical_score") or device.get("original_clinical_score")
    score = device.get("mdrank_score") or jitter_mdrank_score(original)

    prompt = f"""Rewrite medical device content for {BRAND_NAME}.org. Make text unique (no copied sentences).
Keep ALL physical specs factual (dimensions, battery, cuff sizes, accuracy, prices, FDA status).
Use "MDRank Score" instead of "Clinical Score". Review title format: "MDRank Hands-On Test: {{device name}}".
Target MDRank Score: {score}

Return JSON:
{{
  "device": {{ "overview": "...", "key_features": ["..."] }},
  "review": {{
    "title": "MDRank Hands-On Test: ...",
    "excerpt": "...",
    "strengths": ["..."],
    "limitations": ["..."],
    "recommend_if": ["..."],
    "avoid_if": ["..."],
    "sections": [{{ "section_type": "clinical_summary", "heading": "...", "body": "...", "sort_order": 0 }}]
  }},
  "mdrank_score": {score}
}}

Device: {json.dumps(device, indent=2)[:5000]}
Review: {json.dumps(review, indent=2)[:6000]}
"""

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": f"You write for {BRAND_NAME}.org. Output valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.85,
        )
        result = json.loads(response.choices[0].message.content or "{}")
        result["mdrank_score"] = score
        if not result.get("review", {}).get("title"):
            result.setdefault("review", {})["title"] = f"MDRank Hands-On Test: {name}"
        return result
    except Exception as exc:
        print(f"  LLM failed ({exc}) — fallback transform")
        return _fallback_transform(raw)


def build_spec_json(device: dict[str, Any]) -> dict[str, Any]:
    specs = dict(device.get("specs") or {})
    for key in ("connectivity", "cuff_size_range", "power_source", "model_number"):
        val = device.get(key)
        if val and key not in specs:
            specs[key] = val
    if device.get("model_number"):
        specs.setdefault("model_number", device["model_number"])
    return specs


def build_device_record(raw: dict[str, Any], transformed: dict[str, Any]) -> dict[str, Any]:
    device = raw.get("device", {})
    meta = raw.get("rankings_meta", {})
    t_device = transformed.get("device", {})
    original = device.get("clinical_score") or device.get("original_clinical_score") or meta.get("clinical_score")

    return {
        "slug": device.get("slug"),
        "source_url": device.get("source_url"),
        "source_device_id": device.get("source_device_id"),
        "name": device.get("name"),
        "manufacturer": device.get("manufacturer") or "Unknown",
        "mdrank_score": transformed.get("mdrank_score") or jitter_mdrank_score(original),
        "fda_status": normalize_fda(device.get("fda_status") or meta.get("fda_status")),
        "connectivity": device.get("connectivity") or (device.get("specs") or {}).get("connectivity"),
        "retail_price": device.get("retail_price") or meta.get("price"),
        "spec_json": build_spec_json(device),
        "image_url": device.get("image_public_path") or device.get("image_url"),
        "image_local_path": device.get("image_local_path"),
        "overview": t_device.get("overview") or device.get("overview"),
        "key_features": t_device.get("key_features") or device.get("key_features") or [],
        "is_editors_choice": device.get("is_editors_choice", False),
        "is_synthetic": device.get("is_synthetic", False),
        "rank_in_subcategory": device.get("rank") or meta.get("rank"),
        "subcategory_slugs": device.get("subcategory_slugs") or meta.get("subcategory_slugs") or [meta.get("subcategory_slug")],
        "category_slug": device.get("category_slug") or meta.get("category_slug"),
        "original_clinical_score": original,
    }


def build_review_record(raw: dict[str, Any], transformed: dict[str, Any], device_slug: str) -> dict[str, Any]:
    review = raw.get("review", {})
    t_review = transformed.get("review", {})
    device = raw.get("device", {})
    name = device.get("name") or device_slug

    slug = review.get("slug") or f"{device_slug}-hands-on-test"
    if not slug.endswith("-hands-on-test") and not device.get("is_synthetic"):
        slug = f"{device_slug}-hands-on-test"

    return {
        "slug": slug,
        "source_url": review.get("source_url") or device.get("review_url"),
        "title": t_review.get("title") or f"MDRank Hands-On Test: {name}",
        "excerpt": t_review.get("excerpt") or device.get("review_excerpt"),
        "strengths": t_review.get("strengths") or review.get("strengths") or [],
        "limitations": t_review.get("limitations") or review.get("limitations") or [],
        "recommend_if": t_review.get("recommend_if") or review.get("recommend_if") or [],
        "avoid_if": t_review.get("avoid_if") or review.get("avoid_if") or [],
        "sections": t_review.get("sections") or review.get("sections") or [],
    }


def process_pipeline(raw_results: list[dict[str, Any]], landing_raw: dict | None = None) -> list[dict[str, Any]]:
    """Apply Oxiline purge, transform, and inject TrueVitals."""
    processed: list[dict[str, Any]] = []
    seen_slugs: set[str] = set()

    for raw in raw_results:
        device = raw.get("device", {})
        slug = device.get("slug")
        if not slug or device.get("error"):
            continue
        if is_oxiline(device):
            print(f"  PURGED Oxiline device: {slug}")
            continue
        if slug in seen_slugs:
            continue
        seen_slugs.add(slug)

        print(f"  Transforming: {slug}")
        transformed = transform_with_llm(raw)
        processed.append({
            "raw": raw,
            "transformed": transformed,
            "device_record": build_device_record(raw, transformed),
            "review_record": build_review_record(raw, transformed, slug),
        })

    # Inject TrueVitals BP Pro at rank 1 for Blood Pressure
    tv = build_truevitals_bp_pro()
    tv_transformed = _fallback_transform(tv)
    tv_transformed["mdrank_score"] = tv["device"]["mdrank_score"]
    processed = [p for p in processed if p["device_record"]["slug"] != "truevitals-bp-pro"]
    processed.insert(0, {
        "raw": tv,
        "transformed": tv_transformed,
        "device_record": build_device_record(tv, tv_transformed),
        "review_record": build_review_record(tv, tv_transformed, "truevitals-bp-pro"),
    })

    return processed
