# MDRank repository instructions

## Mission

MDRank.org is the automated, evidence-led medical-device ranking system. Its primary asset is a versioned exact-model evidence graph. It is not an AI review farm and must never present generated summaries as personal product experience.

Authentic Reviews, TrueVitals USA, and MDRank.org are separate brands and businesses. Do not imply common ownership or affiliation. Commercial data must not influence MDRank scores.

## Current safety state

The inherited seed and fallback datasets contain synthetic scores, source-derived rankings, random score jitter, and unsupported hands-on/laboratory language. They are quarantined legacy fixtures and must not be published, loaded into production, or used to calibrate MDRank.

## Non-negotiable rules

1. Resolve exact model, market, suffix, package, and identifiers before transferring evidence.
2. LLMs may extract and draft but may not choose numeric scores, weights, penalties, ranks, or tie-breakers.
3. Product score, Evidence Confidence, Public Experience Confidence, and Persona-Fit Confidence are separate.
4. Public reviews cannot prove clinical accuracy, safety, validation, regulatory status, or medical suitability.
5. FDA clearance is not FDA approval, endorsement, independent validation, or proof of superior accuracy.
6. Do not claim hands-on testing, laboratory testing, independent testing, medical review, clinical proof, or personal use without a documented exact-model protocol and reviewer record.
7. Do not scrape or reuse content/media contrary to source terms. Every image needs an enumerated rights status.
8. Affiliate, sponsorship, margin, inventory, advertising, and conversion data are unavailable to the scorer.
9. Every new public product URL requires an explicit Telegram Publish action after preview and validation. Hold and Reject preserve private evidence.
10. Never weaken a gate to satisfy a publication quota.

## Initial operating scope

For the first 90 days, allocate 80–90% of effort to home blood-pressure monitoring. Adjacent safety-sensitive categories remain private until category-specific methodology and owner approval exist.

## Required checks

Before commit or deployment:

- `npm test`
- `npm run build`
- Confirm no inherited synthetic device is publicly returned.
- Confirm robots, sitemap, canonical, metadata, and visible claims.
- Verify every changed live route after deployment.
