"""Fallback seed payloads when live crawl is unavailable."""

from __future__ import annotations

from typing import Any

# Representative non-Oxiline devices per subcategory (rankings-derived metadata)
SEED_DEVICES: list[dict[str, Any]] = [
    # Blood Pressure
    {"slug": "withings-bpm-connect", "name": "Withings BPM Connect", "manufacturer": "Withings", "rank": 2, "clinical_score": 91, "price": 129.0, "fda_status": "FDA 510(k) Cleared", "connectivity": "Bluetooth WiFi", "subcategory_slugs": ["blood-pressure-monitors", "upper-arm-monitors"], "category_slug": "blood-pressure"},
    {"slug": "omron-10-series-upper-arm-blood-pressure-monitor", "name": "Omron 10 Series Upper Arm Blood Pressure Monitor", "manufacturer": "Omron", "rank": 3, "clinical_score": 86, "price": 100.0, "fda_status": "FDA 510(k) Cleared", "connectivity": "Bluetooth", "subcategory_slugs": ["blood-pressure-monitors", "upper-arm-monitors"], "category_slug": "blood-pressure"},
    {"slug": "omron-platinum-bp5450", "name": "Omron Platinum Upper Arm Blood Pressure Monitor", "manufacturer": "Omron", "rank": 4, "clinical_score": 85, "price": 84.0, "fda_status": "FDA 510(k) Cleared", "connectivity": "Bluetooth", "subcategory_slugs": ["blood-pressure-monitors", "upper-arm-monitors"], "category_slug": "blood-pressure"},
    {"slug": "ihealth-track-connected-blood-pressure-monitor", "name": "iHealth Track Connected Blood Pressure Monitor", "manufacturer": "iHealth", "rank": 11, "clinical_score": 77, "price": 40.0, "fda_status": "FDA 510(k) Cleared", "connectivity": "Bluetooth", "subcategory_slugs": ["blood-pressure-monitors"], "category_slug": "blood-pressure"},
    # Respiratory
    {"slug": "zewa-advanced-fingertip-pulse-oximeter", "name": "Zewa Advanced Fingertip Pulse Oximeter", "manufacturer": "Zewa Medical Technology", "rank": 4, "clinical_score": 87, "price": 27.0, "fda_status": "FDA 510(k) Cleared", "connectivity": "Bluetooth", "subcategory_slugs": ["pulse-oximeters", "fingertip-pulse-oximeters"], "category_slug": "respiratory"},
    {"slug": "nonin-3230-bluetooth-pulse-oximeter", "name": "Nonin 3230 Bluetooth Pulse Oximeter", "manufacturer": "Nonin", "rank": 2, "clinical_score": 90, "price": 249.0, "fda_status": "FDA 510(k) Cleared", "connectivity": "Bluetooth", "subcategory_slugs": ["pulse-oximeters", "fingertip-pulse-oximeters"], "category_slug": "respiratory"},
    {"slug": "philips-inspiratory-nebulizer", "name": "Philips InnoSpire Essence Nebulizer", "manufacturer": "Philips", "rank": 3, "clinical_score": 82, "price": 35.0, "fda_status": "FDA 510(k) Cleared", "connectivity": "None", "subcategory_slugs": ["nebulizers"], "category_slug": "respiratory"},
    {"slug": "mir-spirobank-smart", "name": "MIR Spirobank Smart", "manufacturer": "MIR", "rank": 1, "clinical_score": 88, "price": 199.0, "fda_status": "FDA 510(k) Cleared", "connectivity": "Bluetooth", "subcategory_slugs": ["home-spirometers"], "category_slug": "respiratory"},
    {"slug": "asthmamd-peak-flow-meter", "name": "AsthmaMD Peak Flow Meter", "manufacturer": "AsthmaMD", "rank": 2, "clinical_score": 79, "price": 19.0, "fda_status": "FDA Registered", "connectivity": "None", "subcategory_slugs": ["peak-flow-meters"], "category_slug": "respiratory"},
    # Sleep
    {"slug": "watchpat-one", "name": "WatchPAT ONE Home Sleep Test", "manufacturer": "Itamar Medical", "rank": 1, "clinical_score": 92, "price": 199.0, "fda_status": "FDA 510(k) Cleared", "connectivity": "Bluetooth", "subcategory_slugs": ["home-sleep-tests"], "category_slug": "sleep"},
    {"slug": "philips-dreamstation-home-sleep-test", "name": "Philips DreamStation Home Sleep Test", "manufacturer": "Philips", "rank": 2, "clinical_score": 88, "price": 250.0, "fda_status": "FDA 510(k) Cleared", "connectivity": "Bluetooth", "subcategory_slugs": ["home-sleep-tests"], "category_slug": "sleep"},
    {"slug": "zquiet-anti-snoring-mouthpiece", "name": "ZQuiet Anti-Snoring Mouthpiece", "manufacturer": "ZQuiet", "rank": 1, "clinical_score": 78, "price": 39.0, "fda_status": "FDA Registered", "connectivity": "None", "subcategory_slugs": ["anti-snoring-devices"], "category_slug": "sleep"},
    # Pain Relief
    {"slug": "tens-7000", "name": "TENS 7000 Dual Channel Unit", "manufacturer": "Roscoe Medical", "rank": 1, "clinical_score": 84, "price": 32.0, "fda_status": "FDA 510(k) Cleared", "connectivity": "None", "subcategory_slugs": ["tens-units"], "category_slug": "pain-relief"},
    {"slug": "theragun-mini", "name": "Theragun Mini Massage Gun", "manufacturer": "Therabody", "rank": 1, "clinical_score": 86, "price": 199.0, "fda_status": "Not fda regulated", "connectivity": "Bluetooth", "subcategory_slugs": ["massage-guns"], "category_slug": "pain-relief"},
    {"slug": "sunbeam-heating-pad", "name": "Sunbeam XpressHeat Heating Pad", "manufacturer": "Sunbeam", "rank": 2, "clinical_score": 80, "price": 35.0, "fda_status": "FDA Registered", "connectivity": "None", "subcategory_slugs": ["heating-pads"], "category_slug": "pain-relief"},
    # Temperature
    {"slug": "braun-thermoscan-7", "name": "Braun ThermoScan 7 Ear Thermometer", "manufacturer": "Braun", "rank": 1, "clinical_score": 91, "price": 59.0, "fda_status": "FDA 510(k) Cleared", "connectivity": "None", "subcategory_slugs": ["thermometers", "in-ear-thermometers"], "category_slug": "temperature"},
    {"slug": "ihealth-no-touch-thermometer", "name": "iHealth No-Touch Forehead Thermometer", "manufacturer": "iHealth", "rank": 1, "clinical_score": 85, "price": 35.0, "fda_status": "FDA 510(k) Cleared", "connectivity": "None", "subcategory_slugs": ["thermometers", "infrared-forehead-thermometers"], "category_slug": "temperature"},
    {"slug": "vicks-comfort-flex", "name": "Vicks ComfortFlex Digital Thermometer", "manufacturer": "Vicks", "rank": 3, "clinical_score": 82, "price": 12.0, "fda_status": "FDA Registered", "connectivity": "None", "subcategory_slugs": ["thermometers"], "category_slug": "temperature"},
]


def _build_payload(meta: dict[str, Any]) -> dict[str, Any]:
    slug = meta["slug"]
    device = {
        "slug": slug,
        "source_url": f"https://medgrade.org/devices/{slug}/",
        "name": meta["name"],
        "manufacturer": meta["manufacturer"],
        "clinical_score": meta["clinical_score"],
        "fda_status": meta["fda_status"],
        "retail_price": meta["price"],
        "connectivity": meta.get("connectivity"),
        "rank": meta["rank"],
        "subcategory_slugs": meta["subcategory_slugs"],
        "category_slug": meta["category_slug"],
        "overview": f"The {meta['name']} is a {meta['manufacturer']} device evaluated in our {meta['category_slug'].replace('-', ' ')} category.",
        "key_features": [meta["fda_status"], f"Connectivity: {meta.get('connectivity', 'N/A')}"],
        "specs": {"connectivity": meta.get("connectivity"), "power_source": "Battery powered"},
        "review_url": f"https://medgrade.org/reviews/{slug}-review/",
    }
    review = {
        "slug": f"{slug}-review",
        "source_url": device["review_url"],
        "title": f"{meta['name']} Review",
        "strengths": [f"Solid performance with score {meta['clinical_score']}/100", "Reliable for home use"],
        "limitations": ["Feature set varies by model year"],
        "recommend_if": ["You want a proven option in this category"],
        "avoid_if": ["You need a different form factor"],
        "sections": [
            {"section_type": "clinical_summary", "heading": "Clinical Summary", "body": f"MDRank evaluation pending full hands-on test. Source score: {meta['clinical_score']}/100.", "sort_order": 0},
        ],
    }
    return {"device": device, "review": review, "rankings_meta": meta}


def build_seed_payloads() -> tuple[dict[str, Any], list[dict[str, Any]]]:
    landing = {
        "hero_title": "MDRank — Data-Driven Device Rankings",
        "hero_body": "Independent hands-on evaluations across Blood Pressure, Respiratory, Sleep, Pain Relief, and Temperature categories.",
        "sections": [
            {"heading": "Device Comparisons", "body": "Side-by-side MDRank Scores, FDA status, and pricing."},
            {"heading": "Independent Testing", "body": "We purchase devices at retail and test without manufacturer influence."},
        ],
    }
    devices = [_build_payload(m) for m in SEED_DEVICES if "oxiline" not in m["name"].lower()]
    return landing, devices
