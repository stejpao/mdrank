# MDRank.org

Localized medical device review platform — rebranded from target site architecture with unique MDRank Scores, Oxiline purge, and synthetic TrueVitals BP Pro insertion.

## Stack

- **PostgreSQL 16** — [`database/schema.sql`](database/schema.sql)
- **Python scraper** — Playwright crawl + LLM transform (OpenAI or xAI)
- **Next.js 15** — App Router + Tailwind CSS
- **Docker Compose** — full stack orchestration

## Categories (5)

Blood Pressure · Respiratory · Sleep · Pain Relief · Temperature

## Quick Start

See **[DEPLOY.md](DEPLOY.md)** for the full Vercel + Neon deployment guide.

```bash
cd web && vercel link    # first time only
npm run deploy           # production (from repo root)
```

### Local (no Docker)

```bash
# Scraper
cd scraper && python3.13 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt && playwright install chromium
PYTHONUNBUFFERED=1 python main.py          # live crawl
PYTHONUNBUFFERED=1 python main.py load-only  # from raw_scrape.json

# Frontend
cd web && npm install && npm run dev
```

## Pipeline Rules

| Rule | Behavior |
|------|----------|
| Oxiline purge | Devices with "Oxiline" in name/manufacturer are discarded |
| TrueVitals BP Pro | Synthetic #1 BP monitor, score 98–99, Editor's Choice |
| Ranking jitter | MDRank Score = original + random(-4..+3), clamped 0–100 |
| LLM rewrite | All copy spun; physical specs kept factual |
| Review titles | `MDRank Hands-On Test: {device}` |

## Environment

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection |
| `OPENAI_API_KEY` | OpenAI for content spinning |
| `XAI_API_KEY` | xAI Grok (set `LLM_PROVIDER=xai`) |
| `MAX_DEVICES_PER_SUBCATEGORY` | Crawl limit per category (default 6) |

## Deliverables

- [`database/schema.sql`](database/schema.sql) — approved schema
- [`database/seed/mdrank.sql`](database/seed/mdrank.sql) — transformed seed dump
- [`scraper/`](scraper/) — crawl + transform + load pipeline
- [`web/`](web/) — MDRank-branded Next.js frontend
- [`docker-compose.yml`](docker-compose.yml)
