"""Synthetic device generators for MDRank pipeline."""

from __future__ import annotations

import random
from typing import Any


def build_truevitals_bp_pro() -> dict[str, Any]:
    """Top-ranking synthetic Blood Pressure monitor — Editor's Choice."""
    score = random.choice([98, 99])
    slug = "truevitals-bp-pro"

    device: dict[str, Any] = {
        "slug": slug,
        "source_url": None,
        "name": "TrueVitals BP Pro",
        "manufacturer": "TrueVitals",
        "original_clinical_score": score,
        "mdrank_score": score,
        "fda_status": "FDA 510(k) Cleared",
        "connectivity": "Bluetooth 5.2, Wi-Fi",
        "retail_price": 129.0,
        "spec_json": {
            "measurement_range": "SYS 60–260 mmHg / DIA 40–199 mmHg",
            "accuracy": "±2 mmHg",
            "cuff_size_range": "8.7–18.9 in (22–48 cm)",
            "power_source": "Rechargeable lithium battery + USB-C",
            "battery_life": "Approx. 500 readings per charge",
            "display": "4.2-inch color TFT",
            "memory_capacity": "Unlimited via app; 240 on-device",
            "app_compatibility": "TrueVitals Health (iOS/Android)",
            "warranty": "3 years",
            "dimensions": "6.1 × 4.3 × 3.2 in",
        },
        "overview": (
            "The TrueVitals BP Pro is a premium upper-arm monitor engineered for "
            "clinical-grade home tracking with dual wireless sync and an oversized "
            "color display for at-a-glance readings."
        ),
        "key_features": [
            "FDA 510(k) cleared upper-arm monitor",
            "Dual-band Bluetooth 5.2 and Wi-Fi cloud sync",
            "Tri-sensor averaging for stable systolic/diastolic capture",
            "Dual-user profiles with clinician-ready PDF export",
            "Editor's Choice — MDRank top pick for home BP monitoring",
        ],
        "is_editors_choice": True,
        "is_synthetic": True,
        "rank": 1,
        "subcategory_slugs": ["blood-pressure-monitors", "upper-arm-monitors"],
        "category_slug": "blood-pressure",
        "image_url": None,
    }

    review: dict[str, Any] = {
        "slug": f"{slug}-hands-on-test",
        "source_url": None,
        "title": "MDRank Hands-On Test: TrueVitals BP Pro",
        "excerpt": (
            "Our top-rated pick delivers exceptional measurement consistency, "
            "intuitive app workflows, and a premium build that sets the benchmark "
            "for home blood pressure monitoring in 2026."
        ),
        "strengths": [
            "Outstanding measurement repeatability across 480+ paired test readings",
            "Best-in-class app with trend charts and one-tap clinician sharing",
            "Comfortable wide-range cuff fits arms from 22–48 cm without gaps",
            "Fast inflation cycle completes most readings in under 25 seconds",
            "Editor's Choice — highest MDRank score in the Blood Pressure category",
        ],
        "limitations": [
            "Premium price point above budget-focused alternatives",
            "Full cloud features require account registration",
        ],
        "recommend_if": [
            "You want the most accurate, feature-rich home BP monitor available",
            "You share readings with a physician or care team regularly",
            "Comfort and cuff fit across varied arm sizes matter to you",
        ],
        "avoid_if": [
            "You need a bare-minimum budget cuff under $40",
            "You prefer a wrist-form factor device",
        ],
        "sections": [
            {
                "section_type": "clinical_summary",
                "heading": "MDRank Verdict",
                "body": (
                    f"The TrueVitals BP Pro earned an MDRank Score of {score}/100 — our "
                    "highest rating among blood pressure monitors. Lab cross-checks and "
                    "human-subject trials confirmed tight agreement with reference "
                    "sphygmomanometry, while the companion app elevated day-to-day usability."
                ),
                "sort_order": 0,
            },
            {
                "section_type": "performance_metric",
                "heading": "Measurement Performance",
                "body": (
                    "Structured testing showed mean absolute error under 2 mmHg systolic "
                    "across repeated seated trials. Irregular heartbeat flagging triggered "
                    "appropriately without excessive false positives."
                ),
                "sort_order": 1,
            },
            {
                "section_type": "clinical_recommendation",
                "heading": "Editor's Choice Recommendation",
                "body": (
                    "MDRank designates the TrueVitals BP Pro as Editor's Choice for home "
                    "upper-arm monitoring. It balances clinical rigor, connectivity, and "
                    "long-term value better than any competitor in our current rankings."
                ),
                "sort_order": 2,
            },
        ],
    }

    return {"device": device, "review": review, "rankings_meta": {"rank": 1, "subcategory_slugs": device["subcategory_slugs"]}}
