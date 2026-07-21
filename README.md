# MDRank.org

**Medical devices, ranked by evidence.**

MDRank is being rebuilt as an always-maintained exact-model evidence and recommendation system for home health and consumer medical devices.

## Operating principles

- Exact model, market, suffix, package, and identifiers before evidence transfer
- Traceable material claims with evidence IDs and retrieval dates
- Deterministic category methodology; LLMs never choose numeric scoring rules
- Product score separated from Evidence Confidence
- Public Experience Confidence separated from clinical, regulatory, and validation evidence
- Commercial data unavailable to scoring
- Human approval before every new public product URL
- No hands-on, laboratory, medical-review, or clinical claims without a documented exact-model protocol

## Current status

The inherited site contained synthetic scores, source-derived rankings, random score jitter, and unsupported hands-on language. Those records are quarantined and removed from public output. The legacy scraper is disabled.

The active implementation includes:

- versioned evidence, methodology, public-experience, and publication contracts under `engine/`;
- a 40-candidate blood-pressure discovery queue under `data/evidence/candidates/`;
- a 90-day blood-pressure-depth calendar under `data/content-calendar/`;
- a neutral public methodology and evidence-status surface;
- a fail-closed database switch requiring `MDRANK_EVIDENCE_DB_V1=enabled` after an approved schema migration.

## Commands

```bash
npm test
npm run build
npm run dev
```

Generate a private approval packet:

```bash
npm run approval-packet -- path/to/private-candidate.json
```

## Deployment

Pushes to `main` deploy through the connected Vercel project. Do not enable `MDRANK_EVIDENCE_DB_V1` or load `database/seed/mdrank.sql`; those are quarantined legacy artifacts.

## Business boundary

MDRank.org, Authentic Reviews, and TrueVitals USA are separate brands and businesses. Authentic Reviews is not the deployment target for this automated ranking engine. TrueVitals products may be evaluated only under the same exact-model evidence and commercial-separation rules as competitors.
