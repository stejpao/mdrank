# Deploy MDRank.org on Vercel

One-command deploys assume the [Vercel CLI](https://vercel.com/docs/cli) is installed and authenticated (`vercel login`).

## First-time setup (once)

### 1. Link the project

**GitHub (connected):** https://github.com/stejpao/mdrank

Pushes to `main` auto-deploy to Vercel. The repo uses a root `vercel.json` that builds the `web/` app.

For CLI deploys from `web/`:

```bash
cd web
vercel link
```

When importing manually in the [Vercel dashboard](https://vercel.com/new), set **Root Directory** to `web` (or use the repo as-is with root `vercel.json`).

### 2. Deploy preview (no database required)

The app uses bundled JSON fallback until Postgres is connected.

```bash
npm run deploy:preview
```

Or from `web/`:

```bash
vercel
```

### 3. Database safety

The inherited PostgreSQL seed contains synthetic scores and unsupported testing claims. It is quarantined and must not be loaded. Production intentionally ignores `DATABASE_URL` unless `MDRANK_EVIDENCE_DB_V1=enabled` is also present.

Do not set that flag until the evidence-v1 schema, migrated records, approval fields, and validators have passed review. The current safe deployment uses the bundled empty approved corpus.

### 5. Add custom domain

Vercel dashboard → **Project → Settings → Domains** → add `mdrank.org`.

Update DNS at your registrar (A/CNAME records shown by Vercel). HTTPS is automatic.

### 6. Production deploy

```bash
npm run deploy
```

---

## One-command deploys (after setup)

From the **repo root**:

| Command | What it does |
|---------|--------------|
| `npm run deploy:preview` | Preview deployment |
| `npm run deploy` | Production deployment (`https://mdrank.vercel.app`) |

Or from `web/` (after `vercel link`):

```bash
npx vercel --prod
```

**Current production URL:** https://mdrank.vercel.app

---

## Environment variables

### Vercel (web app)

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | No, during quarantine | Ignored unless the evidence-v1 opt-in is enabled |
| `MDRANK_EVIDENCE_DB_V1` | No | Do not set until the approved schema migration is complete |

### Legacy scraper

The legacy crawler, copy rewriter, synthetic insertion, and score-jitter pipeline is disabled. Do not run or restore it. New intake must use permitted sources, exact-model contracts, deterministic scoring manifests, and the private publication gate.

---

## Device images

Vercel serves static files from `web/public/`. After scraping:

```bash
mkdir -p web/public/assets/devices
cp assets/devices/* web/public/assets/devices/ 2>/dev/null || true
git add web/public/assets/devices/
npm run deploy
```

---

## Troubleshooting

**Build fails:** Run `cd web && npm run build` locally first.

**Empty rankings:** This is the expected safe state until evidence-approved records receive human publication approval.

**Legacy rows appearing:** Confirm `MDRANK_EVIDENCE_DB_V1` is unset and redeploy. Do not load the inherited seed.

**www.mdrank.org certificate error:** Add and verify the `www` domain in Vercel or configure a registrar redirect to the apex domain.

---

## Checklist

- [ ] `npm test`
- [ ] `npm run build`
- [ ] Bundled approved corpus is empty or contains only approved evidence-v1 records
- [ ] `MDRANK_EVIDENCE_DB_V1` remains unset during quarantine
- [ ] Domain `mdrank.org` added
- [ ] `www.mdrank.org` certificate/redirect corrected
- [ ] Production deploy succeeds
- [ ] Home, methodology, status, robots, sitemap, and llms routes verified live
