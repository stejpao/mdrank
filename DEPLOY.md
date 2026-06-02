# Deploy MDRank.org on Vercel

One-command deploys assume the [Vercel CLI](https://vercel.com/docs/cli) is installed and authenticated (`vercel login`).

## First-time setup (once)

### 1. Link the project

From the repo root:

```bash
cd web
vercel link
```

When prompted:

- **Set up and deploy?** Yes
- **Which scope?** Your team or personal account
- **Link to existing project?** Create new → name it `mdrank` (or similar)
- **In which directory is your code located?** `./` (you are already in `web/`)

Alternatively, import the Git repo in the [Vercel dashboard](https://vercel.com/new) and set **Root Directory** to `web`.

### 2. Deploy preview (no database required)

The app uses bundled JSON fallback until Postgres is connected.

```bash
npm run deploy:preview
```

Or from `web/`:

```bash
vercel
```

### 3. Add Neon Postgres (recommended for production)

**Dashboard:** Project → **Storage** → **Create Database** → **Neon** → Connect to this project.

**CLI:**

```bash
vercel integration add neon
```

Neon injects a connection string (often `POSTGRES_URL`). In **Project → Settings → Environment Variables**, add:

| Variable | Value | Environments |
|----------|-------|--------------|
| `DATABASE_URL` | Paste Neon **pooled** connection string | Production, Preview, Development |

Use the **Pooled** URL from Neon (not the direct connection) for serverless.

Pull env vars locally:

```bash
cd web
vercel env pull .env.local
```

### 4. Load the database

From your machine (requires `psql`):

```bash
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed/mdrank.sql
```

Run against the **Production** `DATABASE_URL` from Vercel/Neon.

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
| `DATABASE_URL` | Production | Neon pooled Postgres URL |

### Local scraper only (not on Vercel)

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | For DB load | Same Neon URL |
| `XAI_API_KEY` | Optional | Unique LLM copy (`LLM_PROVIDER=xai`) |
| `OPENAI_API_KEY` | Optional | Alternative to xAI |
| `MAX_DEVICES_PER_SUBCATEGORY` | Optional | Default `6` |

The scraper runs **locally**, not on Vercel:

```bash
cd scraper
source .venv/bin/activate
vercel env pull ../web/.env.local   # get DATABASE_URL
export $(grep DATABASE_URL ../web/.env.local | xargs)
PYTHONUNBUFFERED=1 python main.py
psql "$DATABASE_URL" -f ../database/seed/mdrank.sql
```

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

**Empty rankings:** Check `DATABASE_URL` in Vercel env vars and that seed SQL was applied.

**DB connection errors on Vercel:** Use Neon’s **pooled** connection string. Add `?sslmode=require` if needed.

**Still shows old MedGrade branding:** Redeploy after pulling latest `main`.

---

## Checklist

- [ ] `vercel link` in `web/`
- [ ] Preview deploy works
- [ ] Neon connected, `DATABASE_URL` set
- [ ] `schema.sql` + `mdrank.sql` applied
- [ ] Domain `mdrank.org` added
- [ ] `npm run deploy` (production)
