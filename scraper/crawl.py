"""Web crawler for MedGrade Blood Pressure Monitors."""

from __future__ import annotations

import json
import random
import re
import time
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse

import httpx
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

from config import (
    ALLOWLIST_SUBCATEGORIES,
    ASSETS_DIR,
    BASE_URL,
    CATEGORY_MAP,
    PROXY_URLS,
    RANKINGS_URLS,
    USER_AGENTS,
)


def _random_delay(min_s: float = 1.0, max_s: float = 3.0) -> None:
    time.sleep(random.uniform(min_s, max_s))


def _pick_user_agent() -> str:
    return random.choice(USER_AGENTS)


def _pick_proxy() -> dict[str, str] | None:
    if not PROXY_URLS:
        return None
    proxy = random.choice(PROXY_URLS)
    return {"server": proxy}


def _fetch_html(url: str) -> str:
    """Fetch page HTML via Playwright with anti-bot measures."""
    _random_delay()
    with sync_playwright() as p:
        launch_kwargs: dict[str, Any] = {"headless": True}
        proxy = _pick_proxy()
        if proxy:
            launch_kwargs["proxy"] = proxy

        browser = p.chromium.launch(**launch_kwargs)
        context = browser.new_context(user_agent=_pick_user_agent())
        page = context.new_page()
        page.goto(url, wait_until="networkidle", timeout=60000)
        html = page.content()
        browser.close()
        return html


def _parse_price(text: str) -> float | None:
    if not text:
        return None
    text = text.strip()
    if not text.startswith("$") and not re.search(r"\$\s*\d", text):
        return None
    match = re.search(r"\$\s*([\d,]+(?:\.\d{2})?)", text.replace(",", ""))
    if not match:
        return None
    try:
        val = float(match.group(1))
        return val if val >= 5 else None
    except ValueError:
        return None


def _parse_score(text: str) -> int | None:
    if not text:
        return None
    match = re.search(r"(\d{1,3})\s*/?\s*100", text)
    if match:
        return int(match.group(1))
    match = re.search(r"(\d{1,3})%", text)
    if match:
        return int(match.group(1))
    return None


def _clean(text: str | None) -> str:
    if not text:
        return ""
    return re.sub(r"\s+", " ", text).strip()


def _extract_list_items(section: BeautifulSoup | None) -> list[str]:
    if not section:
        return []
    items: list[str] = []
    for li in section.select("li"):
        text = _clean(li.get_text())
        if text:
            items.append(text.lstrip("•").strip())
    for p in section.select("p"):
        text = _clean(p.get_text())
        if text and text not in items:
            items.append(text)
    return items


def _category_for_subcategory(sub_slug: str) -> str | None:
    for cat_slug, info in CATEGORY_MAP.items():
        if sub_slug in info["subcategories"]:
            return cat_slug
    return None


def scrape_landing_page() -> dict[str, Any]:
    """Scrape homepage copy for transformation."""
    html = _fetch_html(BASE_URL)
    soup = BeautifulSoup(html, "lxml")
    copy: dict[str, Any] = {"hero_title": None, "hero_body": None, "sections": []}

    h1 = soup.select_one("h1")
    if h1:
        copy["hero_title"] = _clean(h1.get_text())

    for h2 in soup.find_all("h2"):
        title = _clean(h2.get_text())
        paras = []
        sib = h2.find_next_sibling()
        while sib and sib.name not in ["h2", "h3"]:
            t = _clean(sib.get_text())
            if t:
                paras.append(t)
            sib = sib.find_next_sibling()
        if title:
            copy["sections"].append({"heading": title, "body": "\n".join(paras)})

    return copy


def discover_device_slugs(max_per_subcategory: int = 8) -> list[dict[str, Any]]:
    """Discover devices from all allowlisted subcategory rankings pages."""
    devices: dict[str, dict[str, Any]] = {}

    for sub_slug in ALLOWLIST_SUBCATEGORIES:
        rankings_url = f"{BASE_URL}/rankings/?category={sub_slug}"
        cat_slug = _category_for_subcategory(sub_slug)
        print(f"Discovering: {sub_slug}")
        try:
            html = _fetch_html(rankings_url)
        except Exception as exc:
            print(f"  Skip {sub_slug}: {exc}")
            continue

        soup = BeautifulSoup(html, "lxml")
        count = 0

        for link in soup.select('a[href*="/devices/"]'):
            if count >= max_per_subcategory:
                break
            href = link.get("href", "")
            match = re.search(r"/devices/([^/]+)/?", href)
            if not match:
                continue
            slug = match.group(1)
            name = _clean(link.get_text()) or slug
            if "oxiline" in name.lower() or "oxiline" in slug.lower():
                continue

            row = link.find_parent("tr")
            rank = None
            score = None
            price = None
            fda = None
            if row:
                cells = [_clean(c.get_text()) for c in row.select("td")]
                if cells and cells[0].isdigit():
                    rank = int(cells[0])
                for cell in cells:
                    if score is None:
                        score = _parse_score(cell)
                    if price is None:
                        p = _parse_price(cell)
                        if p is not None:
                            price = p
                    if fda is None and "fda" in cell.lower():
                        fda = cell

            existing = devices.get(slug)
            subcats = list(existing.get("subcategory_slugs", [])) if existing else []
            if sub_slug not in subcats:
                subcats.append(sub_slug)

            devices[slug] = {
                "slug": slug,
                "name": name,
                "rank": rank or (existing or {}).get("rank"),
                "clinical_score": score or (existing or {}).get("clinical_score"),
                "price": price or (existing or {}).get("price"),
                "fda_status": fda or (existing or {}).get("fda_status"),
                "subcategory_slug": sub_slug,
                "subcategory_slugs": subcats,
                "category_slug": cat_slug,
            }
            count += 1

    return sorted(devices.values(), key=lambda d: (d.get("category_slug") or "", d.get("rank") or 999))


def scrape_device_page(slug: str, rankings_meta: dict[str, Any] | None = None) -> dict[str, Any]:
    """Scrape a device profile page."""
    url = f"{BASE_URL}/devices/{slug}/"
    html = _fetch_html(url)
    soup = BeautifulSoup(html, "lxml")

    data: dict[str, Any] = {
        "slug": slug,
        "source_url": url,
        "name": rankings_meta.get("name") if rankings_meta else None,
        "manufacturer": None,
        "model_number": None,
        "clinical_score": rankings_meta.get("clinical_score") if rankings_meta else None,
        "measurement_accuracy": rankings_meta.get("measurement_accuracy") if rankings_meta else None,
        "fda_status": rankings_meta.get("fda_status") if rankings_meta else None,
        "retail_price": rankings_meta.get("price") if rankings_meta else None,
        "rank": rankings_meta.get("rank") if rankings_meta else None,
        "connectivity": None,
        "cuff_size_range": None,
        "power_source": None,
        "overview": None,
        "key_features": [],
        "specs": {},
        "clinical_evidence": None,
        "clinical_recommendation": None,
        "hsa_fsa_eligibility": None,
        "hsa_fsa_guidance": None,
        "replacement_cuff_label": None,
        "replacement_cuff_price": None,
        "testing_period": None,
        "review_excerpt": None,
        "review_url": None,
        "image_url": None,
        "retailers": [],
    }

    h1 = soup.select_one("h1")
    if h1:
        data["name"] = _clean(h1.get_text())

    for heading in soup.find_all(["h2", "h3", "h4", "dt", "strong", "span"]):
        label = _clean(heading.get_text()).lower().rstrip(":")
        if not label:
            continue

        value_el = heading.find_next(["dd", "p", "span", "div"])
        value = _clean(value_el.get_text()) if value_el else ""

        if label == "manufacturer" and value:
            data["manufacturer"] = value
        elif label == "model number" and value:
            data["model_number"] = value
        elif label == "connectivity" and value and not data["connectivity"]:
            data["connectivity"] = value
        elif "cuff size" in label and value:
            data["cuff_size_range"] = value
        elif label == "power source" and value:
            data["power_source"] = value
        elif label == "device price" and value:
            data["retail_price"] = _parse_price(value) or data["retail_price"]
        elif "hsa" in label and "fsa" in label and "eligibility" in label and value:
            data["hsa_fsa_eligibility"] = value

    for section in soup.find_all(["section", "div"]):
        heading = section.find(["h2", "h3"])
        if not heading:
            continue
        title = _clean(heading.get_text()).lower()

        if "key features" in title:
            data["key_features"] = _extract_list_items(section)
        elif "device overview" in title or title == "overview":
            paras = [_clean(p.get_text()) for p in section.select("p") if _clean(p.get_text())]
            if paras:
                data["overview"] = paras[0]
        elif "technical specifications" in title or title == "specifications":
            for row in section.select("tr"):
                cells = [_clean(c.get_text()) for c in row.select("td, th")]
                if len(cells) >= 2:
                    key = cells[0].lower().replace(" ", "_")
                    data["specs"][key] = cells[1]
                    if key == "connectivity" and not data["connectivity"]:
                        data["connectivity"] = cells[1]
                    if "cuff_size" in key and not data["cuff_size_range"]:
                        data["cuff_size_range"] = cells[1]
                    if key == "power_source" and not data["power_source"]:
                        data["power_source"] = cells[1]
            for dt in section.select("dt"):
                key = _clean(dt.get_text()).lower().replace(" ", "_").rstrip(":")
                dd = dt.find_next("dd")
                if dd:
                    data["specs"][key] = _clean(dd.get_text())

    review_link = soup.select_one('a[href*="/reviews/"]')
    if review_link:
        data["review_url"] = urljoin(BASE_URL, review_link.get("href", ""))

    for img in soup.select("img"):
        src = img.get("src") or img.get("data-src") or ""
        alt = (img.get("alt") or "").lower()
        if src and ("device" in alt or slug.replace("-", " ") in alt or "product" in src.lower()):
            data["image_url"] = urljoin(BASE_URL, src)
            break

    if not data["image_url"]:
        for img in soup.select("img[src]"):
            src = img.get("src", "")
            if src and not any(x in src.lower() for x in ["logo", "icon", "avatar", "sprite"]):
                data["image_url"] = urljoin(BASE_URL, src)
                break

    score_el = soup.find(string=re.compile(r"\d{1,3}\s*/?\s*100"))
    if score_el and not data["clinical_score"]:
        data["clinical_score"] = _parse_score(str(score_el))

    for badge in soup.select("[class*='badge'], [class*='tag'], span, div"):
        text = _clean(badge.get_text())
        lower = text.lower()
        if not data["clinical_evidence"] and "clinical evidence" in lower:
            data["clinical_evidence"] = text
        if not data["clinical_recommendation"] and "recommended" in lower:
            data["clinical_recommendation"] = text
        if not data["fda_status"] and "fda" in lower:
            data["fda_status"] = text

    for block in soup.select("blockquote, .clinical-review, [class*='review']"):
        text = _clean(block.get_text())
        if len(text) > 80:
            data["review_excerpt"] = text[:500]
            break

    for h in soup.find_all(["h3", "h4"]):
        if "where to buy" in _clean(h.get_text()).lower():
            section = h.find_parent(["section", "div"]) or h
            for card in section.select("[class*='retailer'], [class*='store'], div"):
                name_el = card.select_one("h3, h4, strong")
                if not name_el:
                    continue
                name = _clean(name_el.get_text())
                if not name or name.lower() == "where to buy":
                    continue
                price_text = card.get_text()
                retailers = data["retailers"]
                retailers.append(
                    {
                        "retailer_name": name,
                        "price": _parse_price(price_text),
                        "shipping_notes": "",
                        "hsa_note": "",
                    }
                )

    return data


def scrape_review_page(review_url: str) -> dict[str, Any]:
    """Scrape a full clinical review page."""
    html = _fetch_html(review_url)
    soup = BeautifulSoup(html, "lxml")

    slug = urlparse(review_url).path.strip("/").split("/")[-1]
    data: dict[str, Any] = {
        "slug": slug,
        "source_url": review_url,
        "title": None,
        "sections": [],
        "strengths": [],
        "limitations": [],
        "recommend_if": [],
        "avoid_if": [],
        "indicated_for": [],
        "contraindications": [],
        "table_of_contents": [],
        "subscores": {},
    }

    h1 = soup.select_one("h1")
    if h1:
        data["title"] = _clean(h1.get_text())

    for link in soup.select('nav a, .toc a, [class*="toc"] a, a[href^="#"]'):
        label = _clean(link.get_text())
        href = link.get("href", "")
        if label and href.startswith("#"):
            data["table_of_contents"].append({"id": href.lstrip("#"), "label": label})

    headings = soup.find_all(["h2", "h3"])
    for heading in headings:
        title = _clean(heading.get_text())
        if not title:
            continue
        lower = title.lower()

        section_body_parts: list[str] = []
        sibling = heading.find_next_sibling()
        while sibling and sibling.name not in ["h2", "h3"]:
            text = _clean(sibling.get_text())
            if text:
                section_body_parts.append(text)
            sibling = sibling.find_next_sibling()

        body = "\n\n".join(section_body_parts)

        if "strength" in lower:
            data["strengths"] = _extract_list_items(heading.find_parent(["section", "div"]))
        elif "limitation" in lower:
            data["limitations"] = _extract_list_items(heading.find_parent(["section", "div"]))
        elif "recommend if" in lower:
            data["recommend_if"] = _extract_list_items(heading.find_parent(["section", "div"]))
        elif "avoid if" in lower:
            data["avoid_if"] = _extract_list_items(heading.find_parent(["section", "div"]))
        elif "indicated for" in lower:
            data["indicated_for"] = _extract_list_items(heading.find_parent(["section", "div"]))
        elif "contraindication" in lower:
            data["contraindications"] = _extract_list_items(heading.find_parent(["section", "div"]))
        elif body:
            section_type = "overview"
            if "clinical summary" in lower:
                section_type = "clinical_summary"
            elif "performance" in lower:
                section_type = "performance_metric"
            elif "quick take" in lower:
                section_type = "quick_take"
            elif "real-world" in lower or "real world" in lower:
                section_type = "real_world_usage"
            elif "cost" in lower or "coverage" in lower:
                section_type = "cost_coverage"
            elif "patient" in lower or "suitability" in lower:
                section_type = "patient_suitability"
            elif "efficacy" in lower:
                section_type = "clinical_efficacy"
            elif "recommendation" in lower:
                section_type = "clinical_recommendation"
            elif "methodology" in lower:
                section_type = "methodology"

            score = _parse_score(body)
            metric_key = re.sub(r"[^a-z0-9]+", "_", lower).strip("_")
            if score is not None and any(k in lower for k in ["accuracy", "comfort", "use", "app", "build", "value", "repeatability", "arrhythmia", "cuff"]):
                data["subscores"][metric_key] = {"score": score, "narrative": body}

            data["sections"].append(
                {
                    "section_type": section_type,
                    "heading": title,
                    "body": body,
                    "sort_order": len(data["sections"]),
                }
            )

    return data


def download_image(image_url: str, slug: str) -> str | None:
    """Download device image to assets folder."""
    if not image_url:
        return None

    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    ext = Path(urlparse(image_url).path).suffix or ".jpg"
    if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        ext = ".jpg"

    local_path = ASSETS_DIR / f"{slug}{ext}"
    public_path = f"/assets/devices/{slug}{ext}"

    headers = {"User-Agent": _pick_user_agent()}
    try:
        with httpx.Client(timeout=30, follow_redirects=True) as client:
            resp = client.get(image_url, headers=headers)
            resp.raise_for_status()
            local_path.write_bytes(resp.content)
        return public_path
    except Exception:
        return None


def crawl_all(max_per_subcategory: int = 8, skip_reviews: bool = False) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    """Full crawl across 5 MDRank categories."""
    print("Scraping landing page...")
    landing = scrape_landing_page()

    print("Discovering devices from rankings...")
    rankings = discover_device_slugs(max_per_subcategory=max_per_subcategory)
    print(f"Found {len(rankings)} unique devices (Oxiline excluded at discovery)")

    results: list[dict[str, Any]] = []
    for meta in rankings:
        slug = meta["slug"]
        print(f"Scraping device: {slug} [{meta.get('category_slug')}]")
        try:
            device = scrape_device_page(slug, meta)
            if "oxiline" in (device.get("name") or "").lower() or "oxiline" in (device.get("manufacturer") or "").lower():
                print(f"  SKIP Oxiline: {slug}")
                continue

            device["subcategory_slugs"] = meta.get("subcategory_slugs", [])
            device["category_slug"] = meta.get("category_slug")

            review_data: dict[str, Any] = {}
            if device.get("review_url") and not skip_reviews:
                print(f"  Review: {device['review_url']}")
                review_data = scrape_review_page(device["review_url"])

            if device.get("image_url"):
                device["image_public_path"] = download_image(device["image_url"], slug)

            results.append({"device": device, "review": review_data, "rankings_meta": meta})
        except Exception as exc:
            print(f"  ERROR {slug}: {exc}")

    return landing, results


def save_raw_json(results: list[dict[str, Any]], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(results, indent=2), encoding="utf-8")


if __name__ == "__main__":
    landing, data = crawl_all()
    out = Path(__file__).resolve().parent / "raw_scrape.json"
    save_raw_json({"landing": landing, "devices": data}, out)
    print(f"Saved {len(data)} devices to {out}")
