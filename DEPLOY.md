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

### 2. Deploy preview

The app serves only the bundled, reviewed public corpus. The inherited SQL schema and rows are unreachable from the web application.

```bash
npm run deploy:preview
```

Or from `web/`:

```bash
vercel
```

### 3. Database safety

The inherited PostgreSQL seed contains synthetic scores and unsupported testing claims. It is quarantined and must not be loaded. The legacy PostgreSQL adapter has been removed from the web application, and `DATABASE_URL` is ignored.

A future evidence-v1 adapter may be introduced only after its schema, migrated records, approval fields, and publication validators pass review. The current safe deployment uses the bundled empty approved corpus.

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

No web-application environment variables are currently required. `DATABASE_URL` and the former `MDRANK_EVIDENCE_DB_V1` switch cannot enable database publishing.

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

**Legacy rows appearing:** Stop the deployment and inspect its commit. Current `main` has no legacy database read path and cannot publish those rows through an environment flag.

**www.mdrank.org certificate error:** Add and verify the `www` domain in Vercel or configure a registrar redirect to the apex domain.

---

## Checklist

- [ ] `npm test`
- [ ] `npm run build`
- [ ] Bundled approved corpus is empty or contains only approved evidence-v1 records
- [ ] Legacy database read path remains absent
- [ ] Domain `mdrank.org` added
- [ ] `www.mdrank.org` certificate/redirect corrected
- [ ] Production deploy succeeds
- [ ] Home, methodology, status, robots, sitemap, and llms routes verified live
