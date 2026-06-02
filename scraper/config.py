"""MDRank.org scraper configuration."""

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://medgrade.org"
BRAND_NAME = "MDRank"
SITE_DOMAIN = "mdrank.org"

USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
]

DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://mdrank:mdrank@localhost:5432/mdrank"
)

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai").lower()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
XAI_API_KEY = os.getenv("XAI_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "")
PROXY_URLS = [p.strip() for p in os.getenv("PROXY_URLS", "").split(",") if p.strip()]

ROOT_DIR = Path(__file__).resolve().parent.parent
ASSETS_DIR = ROOT_DIR / "assets" / "devices"
SEED_DIR = ROOT_DIR / "database" / "seed"

PURGE_BRANDS = ("oxiline",)

# category_slug -> list of subcategory slugs (MedGrade rankings ?category= slugs)
CATEGORY_MAP: dict[str, dict] = {
    "blood-pressure": {
        "name": "Blood Pressure",
        "subcategories": [
            "blood-pressure-monitors",
            "upper-arm-monitors",
            "wrist-blood-pressure-monitors",
        ],
    },
    "respiratory": {
        "name": "Respiratory",
        "subcategories": [
            "pulse-oximeters",
            "fingertip-pulse-oximeters",
            "nebulizers",
            "home-spirometers",
            "peak-flow-meters",
        ],
    },
    "sleep": {
        "name": "Sleep",
        "subcategories": [
            "home-sleep-tests",
            "anti-snoring-devices",
        ],
    },
    "pain-relief": {
        "name": "Pain Relief",
        "subcategories": [
            "tens-units",
            "massage-guns",
            "heating-pads",
        ],
    },
    "temperature": {
        "name": "Temperature",
        "subcategories": [
            "thermometers",
            "in-ear-thermometers",
            "infrared-forehead-thermometers",
        ],
    },
}

ALLOWLIST_SUBCATEGORIES: list[str] = [
    sub
    for cat in CATEGORY_MAP.values()
    for sub in cat["subcategories"]
]

RANKINGS_URLS = [f"{BASE_URL}/rankings/?category={slug}" for slug in ALLOWLIST_SUBCATEGORIES]

FDA_STATUS_MAP = {
    "fda 510(k) cleared": "fda_510k_cleared",
    "fda cleared": "fda_510k_cleared",
    "fda registered": "fda_registered",
    "not fda regulated": "not_fda_regulated",
}

def get_llm_client():
    """Return (client, model) for configured LLM provider."""
    from openai import OpenAI

    if LLM_PROVIDER == "xai" and XAI_API_KEY:
        model = LLM_MODEL or "grok-3-mini"
        return OpenAI(api_key=XAI_API_KEY, base_url="https://api.x.ai/v1"), model
    if OPENAI_API_KEY and not OPENAI_API_KEY.startswith("sk-your"):
        model = LLM_MODEL or "gpt-4o-mini"
        return OpenAI(api_key=OPENAI_API_KEY), model
    return None, None
