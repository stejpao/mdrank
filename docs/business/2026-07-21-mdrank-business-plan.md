# MDRank.org
## Automated Medical-Device Evidence, Ranking, and Intelligence Engine

**Detailed business and implementation plan**
**Version:** 2.0 — transitioned to MDRank.org
**Prepared:** July 21, 2026
**Purpose:** Independent review by other LLMs, advisors, operators, developers, and compliance counsel

> **Business boundary:** MDRank.org owns this automated evidence and ranking system. Authentic Reviews remains a separate affiliate editorial business and is not the deployment target for this engine. Existing Authentic Reviews routes, scores, conclusions, and commercial positioning are not MDRank evidence.

> **Verification note:** This document distinguishes what is operational now, what exists as a working pilot, what is scheduled, and what remains planned. It is not a claim that every proposed capability has already been completed.

---

# 1. Executive summary

MDRank.org is being developed into an automated, evidence-led product-curation business for home-health measurement tools. The intended product is not a generic AI blog and not an AI system pretending to have personally tested products. It is an **evidence-to-recommendation platform** that continuously gathers traceable public product evidence, resolves exact product models, applies deterministic eligibility and scoring rules, produces source-backed editorial outputs, and keeps published content current.

The central system is called **MDRank Evidence Engine**. MDRank Evidence Engine is intended to support:

1. Independent Editorial Top 10 category rankings.
2. Individual exact-model product dossiers.
3. Head-to-head product comparisons.
4. Buying guides and troubleshooting content.
5. Product-specific evidence, regulatory, validation, recall, fit, warranty, and eligibility records.
6. Public Experience Intelligence covering recurring likes, dislikes, ownership friction, persona fit, and a separate public-experience confidence level.
7. Search-engine, answer-engine, GEO, and LLM-citation content.
8. Affiliate monetization without allowing commission to alter editorial rank.
9. Clearly separated sponsored and paid-advertorial content.
10. Social derivatives for Facebook, Instagram, and Reels.
11. Private market-gap and product-opportunity intelligence that may inform outside merchants, including TrueVitals USA, without feeding commercial preferences back into editorial rankings.

The strategic moat is the **versioned evidence graph**, not article volume. Over time, that graph should contain exact model identities, citations, source dates, regulatory and validation records, fit and compatibility data, warranty and support facts, availability history, recurring usability-friction signals, score history, and reasons for ranking changes.

MDRank.org and TrueVitals USA are separate brands and companies. MDRank.org may independently cover or link to TrueVitals products under the same editorial rules applied to competitors. Ordinary affiliate relationships receive affiliate-commission disclosure. Actual paid content uses conspicuous Sponsored, Paid placement, or Advertorial labeling and a separate content lane.

## Current headline status

As of July 21, 2026:

- MDRank.org is a live Next.js/Vercel site with a PostgreSQL-capable data layer and bundled fallback data.
- The inherited live dataset contains synthetic scores, copied/source-derived ranking data, random score jitter, and unsupported hands-on or laboratory language. Those records are not valid MDRank evidence and must be quarantined from public ranking output.
- The evidence-engine contracts, human publication gate, Public Experience Intelligence contract, 40-candidate blood-pressure discovery queue, and 90-day blood-pressure-depth calendar have been transitioned into the MDRank repository.
- The 40 queue entries are discovered candidates, not screened, accepted, scored, or recommended products.
- Existing MDRank public device scores and Editor’s Choice labels are legacy placeholder output and must not seed or calibrate the new deterministic system.
- Authentic Reviews ranking-related automations are paused. Replacement MDRank jobs should be activated only after this repository passes tests and deploy verification.
- No new exact-model public dossier may publish without evidence validation and an explicit Telegram `Publish` action.
- Public Experience Intelligence has a versioned contract and deterministic confidence logic, but production review connectors remain dependent on permitted APIs, licensed feeds, or authorized exports.
- The first 90 days allocate 80 of 90 operating days to blood-pressure depth and keep all scheduled items private until approval.
- Full category-wide Top 10 autonomy is not yet production-ready. The immediate priority is removing unsupported public claims, establishing an honest methodology surface, and building accepted/rejected evidence records from the candidate queue.
- The Authentic Reviews route `/reviews/best-home-blood-pressure-monitors-2026` remains outside MDRank control. Its `9.7` score is not MDRank evidence and MDRank must not alter that page.

---

# 2. Business thesis

## 2.1 The problem

Most product-review businesses have one or more structural weaknesses:

- They rely on stale articles rather than maintained evidence.
- They merge different product variants under one name.
- They repeat manufacturer marketing claims as independent findings.
- They overstate hands-on testing or medical certainty.
- They rank whichever products have affiliate links.
- They fail to explain why a ranking changed.
- They publish broad “best” lists from an arbitrarily narrow candidate pool.
- They produce large amounts of undifferentiated AI prose that adds little information.

Home-health products add higher stakes. Exact model identity, measurement method, validation, fit, app dependence, regulatory status, warranty, consumables, recalls, and limitations can materially affect a recommendation.

## 2.2 The solution

MDRank.org should continuously curate the evidence and expose the useful result to readers:

> **MDRank.org continuously curates the evidence, explains the tradeoffs, and shows its work.**

The user-facing value proposition is:

- exact products rather than vague families;
- direct answers rather than filler;
- verified facts separated from manufacturer claims;
- visible source dates and limitations;
- a product score separated from evidence confidence;
- honest best-fit and poor-fit guidance;
- maintained rankings rather than one-time articles;
- clear commercial disclosure.

## 2.3 Strategic advantages

The model can create several compounding advantages:

1. **Evidence reuse:** One verified product record can power a dossier, ranking, comparison, FAQ, social asset, update note, sponsored derivative, and private sourcing report.
2. **Freshness:** Product availability, manuals, warranties, validation status, recalls, app requirements, and variants can be monitored.
3. **Auditability:** Git history, evidence IDs, source dates, hashes, and run manifests create a defensible record.
4. **Search breadth:** Exact-model pages, comparisons, fit guides, terminology explainers, troubleshooting assets, and tools can cover multiple stages of intent.
5. **Answer-engine usefulness:** Concise answer units, stable headings, explicit model names, visible evidence, and direct caveats make pages easier to quote accurately.
6. **Commercial separation:** Editorial rankings, sponsored features, and paid landings can reuse facts while remaining visibly and technically separate.
7. **Product intelligence:** Aggregate gaps can reveal underserved fit, support, warranty, usability, and accessory opportunities.

---

# 3. Scope and category strategy

MDRank.org focuses on **tools used to measure or monitor health**, rather than general supplements, medications, diet programs, or unrelated wellness products.

## Initial and near-term categories

- Upper-arm blood pressure monitors
- Arm-in and no-wrap blood pressure monitors
- Pulse oximeters
- Thermometers
- Blood glucose meters and continuous glucose monitors
- Heart-rate monitors
- Smartwatches and wearables with measurement functions
- Related home-vitals tools, accessories, and reporting utilities

## Category expansion rule

Each category needs its own eligibility gates, evidence requirements, score dimensions, confidence rules, risk controls, and freshness policy. Blood-pressure criteria must not be copied blindly into pulse oximeters, thermometers, glucose tools, or wearables.

The initial 90-day operating period deliberately prioritizes depth in home blood-pressure monitoring: 80–90% of research and production capacity goes to exact-model blood-pressure evidence, dossiers, comparisons, tools, and original findings; 10–20% may preserve carefully selected adjacent educational or category-readiness work. Safety-sensitive or clinically complex adjacent-category material remains private until category-specific rules and owner approval exist.

## Initial 90-day blood-pressure milestone

Before proposing broad expansion, the system should complete and verify:

- 30–40 screened exact-model blood-pressure candidates;
- at least 10 strong, human-approved public product dossiers;
- explicit accepted, rejected, ambiguous, unavailable, and insufficient-evidence records;
- at least five meaningful head-to-head comparisons;
- a public category methodology;
- an exact-model validation-status directory;
- a cuff-size and compatibility database;
- a warranty, support, consumables, and total-cost comparison;
- a product and ranking change log;
- at least one reproducible original category report based on the accumulated evidence graph.

The machine-readable calendar is `data/content-calendar/2026-07-22-to-2026-10-19-mdrank-bp-depth.json`. Earlier cross-category research is preserved under `data/content-calendar/archive/` rather than deleted. The next category requires an owner-approved proposal after this milestone is complete and performing acceptably.

## Depth before uncontrolled scale

A mature category should eventually include:

- one flagship independent Top 10;
- one public methodology page;
- 10 model-level dossiers;
- five to 10 meaningful comparisons;
- five to 10 supporting guides and troubleshooting pages;
- one useful calculator, checker, tracker, or downloadable report where appropriate;
- recurring evidence and lifecycle updates.

A Top 10 should begin from a broader pool, generally 20 to 40 plausible candidates. Products should be excluded explicitly when identity, evidence, availability, or safety gates fail.

---

# 4. MDRank Evidence Engine

## 4.1 What MDRank Evidence Engine is

MDRank Evidence Engine is a structured pipeline that turns approved evidence into eligible products, deterministic scores, confidence levels, rankings, and evidence-constrained explanations.

It is not:

- an LLM inventing scores;
- a hidden pay-to-rank system;
- a claim of laboratory or hands-on testing;
- a generic star-rating average;
- an affiliate-offer sorter;
- a substitute for professional medical, legal, tax, or regulatory advice.

## 4.2 End-to-end workflow

### Stage 1: Discover candidates

Candidates may come from validation registries, government databases, manufacturer catalogs, authorized retailer or affiliate feeds, existing category research, and search-demand analysis. Discovery proposes candidates; it does not rank them.

### Stage 2: Resolve exact identity

The engine normalizes:

- brand;
- exact model;
- aliases;
- market or jurisdiction;
- SKU, UPC, GTIN, ASIN, or other identifier when available;
- package and accessory variant;
- cuff, sensor, probe, strip, app, firmware, or regional differences;
- regulatory identifiers.

Ambiguous variants remain separate or become unrankable until resolved.

### Stage 3: Collect evidence

Approved source classes include:

| Tier | Source class | Typical use |
|---|---|---|
| A | Government, regulatory, recognized validation registries, recalls, peer-reviewed validation | Safety, regulatory and measurement credibility |
| B | Independent institutions, technical organizations, nonprofits, or laboratories | Independent limitations and performance context |
| C | Manufacturer manuals, specifications, warranty, privacy, and support pages | Attributed product facts |
| D | Authorized retailer APIs and affiliate feeds | Availability, package contents, compliant price information |
| E | Licensed or API-permitted user-experience aggregates | Recurring usability themes only |
| F | Reputable editorial or trade sources | Discovery and context, not primary proof |

Each material fact should carry an evidence ID, exact model, source URL, source class, retrieval date, normalized fact, confidence, materiality, freshness rule, and permitted acquisition/reuse mode.

### Stage 4: Validate claims

Deterministic validators check:

- unknown or orphan source references;
- duplicate source or evidence IDs;
- invalid URLs and dates;
- stale freshness-sensitive evidence;
- missing testing status;
- missing HSA/FSA status;
- unresolved model conflicts;
- unsupported schema versions;
- claims that do not point back to evidence.

The system is designed to fail closed. Missing evidence cannot become a scoring advantage.

### Stage 5: Apply eligibility gates

A product cannot receive a normal Top 10 rank unless it passes required gates, including:

- exact product identity;
- current credible availability;
- category fit;
- an official manual or authoritative specification source;
- safety and recall check;
- regulatory or validation check where applicable;
- minimum evidence coverage;
- no unresolved model-number conflict;
- no counterfeit-only or gray-market dependency.

### Stage 6: Score deterministically

The private category manifest defines dimensions, signals, weights, penalties, confidence calculation, thresholds, tie-breakers, stability rules, and manual-review triggers.

Publicly understandable factors normally include:

- measurement credibility;
- ease of correct use;
- fit and accessibility;
- ownership experience;
- value;
- support and expected longevity;
- evidence confidence.

Exact production mechanics remain private to reduce gaming and protect proprietary methodology. Tests use synthetic fixtures rather than exposing production weights.

The LLM does not choose numeric scores, weights, penalties, ranks, or tie-breaks.

### Stage 7: Generate evidence-constrained editorial

The LLM receives a normalized evidence packet and a completed ranking output. It may generate:

- direct TL;DR;
- best-fit and poor-fit user;
- short verdict;
- evidence-backed pros and cons;
- explanation of rank;
- caveats and unknowns;
- comparison summaries;
- FAQ drafts;
- source blocks and update notes.

Material factual sentences must remain traceable to evidence. Forbidden or unsupported hands-on, medical, regulatory, safety, price, and comparative language should fail validation.

### Stage 8: Build preview, request approval, then publish or escalate

During the initial reliability period, every new public URL requires an explicit human approval action through Telegram. Automation may discover, research, normalize, draft, validate, build a preview, and check schema, canonical, links, images, disclosures, and rights. It must stop before publication.

The Telegram approval packet must show:

- proposed title and URL;
- exact brand, model, market, and unresolved aliases;
- eligibility result, MDRank Evidence Engine score when eligible, and Evidence Confidence;
- primary sources and material claims;
- important limitations and unknowns;
- image origin and image-rights status;
- proposed schema types and disclosure status;
- `Publish`, `Hold`, and `Reject` controls.

Only a recorded `Publish` action may promote a new URL. A `Hold` keeps the complete private record; a `Reject` preserves the evidence and reason rather than deleting research. Routine nonmaterial evidence refreshes may eventually publish automatically only after the owner approves that operating change and the workflow has demonstrated reliability.

**Potential future safe automatic changes, after approval:**

- source-date refresh after true re-verification;
- corrected broken link;
- current availability or price-band refresh through an approved feed;
- nonmaterial wording correction;
- new evidence that does not create a material ranking or safety change.

**Human or owner review required:**

- new number-one product;
- top-three change;
- product entering or leaving a Top 10;
- recall or safety signal;
- disputed validation or regulatory status;
- ambiguous model merge;
- scoring-policy change;
- low-confidence material claim;
- sponsorship or commercial-conflict problem;
- new connector with uncertain permissions.

### Stage 9: Verify the live result

After deployment, automated or manual checks should verify:

- live URL and response;
- canonical;
- title, description, and H1;
- visible disclosure;
- source links and dates;
- affiliate redirects;
- indexing and sitemap status;
- JSON-LD validity;
- image rendering and alt text;
- page body and FAQ output;
- `llms.txt` and `llms-full.txt` generation when applicable.

A failed live check should halt or roll back the change.

## 4.3 Public Experience Intelligence layer

MDRank Evidence Engine should include a separate Public Experience Intelligence layer that analyzes permitted public product reviews and discussions. Its purpose is to explain recurring ownership experience, identify likely best-fit and poor-fit users, and show how confident MDRank.org is that the observed themes are real.

This layer should answer:

- What do owners consistently like?
- What complaints recur?
- Which problems appear after weeks or months of ownership?
- Who appears happiest with the product?
- Who is likely to find it frustrating?
- How broad, recent, diverse, and reliable is the public-opinion corpus?

Public opinion is not equivalent to independent validation, regulatory evidence, verified specifications, recall records, professional advice, or hands-on testing by MDRank.org. Review sentiment must never establish clinical accuracy or safety and cannot override authoritative evidence.

### Permitted acquisition hierarchy

Public-experience data should be collected through Terms-compliant methods in this order:

1. Licensed retailer or manufacturer review feeds.
2. Authorized exports from brands or merchants.
3. Official product-review platform APIs.
4. Public discussions obtained through official APIs.
5. Manually reviewed public sources where automated acquisition or republication is not permitted.

Examples of technically relevant official systems include Bazaarvoice Conversations for authorized product-review data, YouTube Data API comment threads for qualitative discussion, and approved Reddit API access for public posts and comments. Trustpilot is generally more useful for company or service sentiment than exact-model product sentiment. Retailer pages without an authorized API, export, feed, or license must not simply be scraped at scale. Source terms, storage limits, deletion requirements, quote rights, and permitted reuse must be recorded.

### Exact-model review matching

A public review can enter a model-level corpus only when it is tied to the exact product or to a documented equivalent variant. The record should retain:

- brand and exact model;
- market or regional suffix;
- UPC, GTIN, SKU, ASIN, or equivalent identifier when available;
- package and accessory differences;
- review source and source URL;
- review and retrieval dates;
- verified-purchase and incentivized-review indicators when supplied;
- ownership duration when stated;
- syndication origin when known;
- identity confidence and exclusion reason.

Ambiguous variants remain separate or are excluded. Reviews copied or syndicated across retailers must be deduplicated rather than counted as independent opinions.

### Experience-theme extraction

The analysis should classify observations into practical ownership themes such as:

- setup and onboarding;
- ease of correct use;
- display readability;
- comfort and fit;
- app connectivity and account requirements;
- household sharing;
- build quality and long-term reliability;
- battery life and portability;
- cleaning and maintenance;
- replaceable parts, accessories, and consumables;
- warranty and support;
- value perception.

The engine should distinguish a product problem from a retailer, shipping, packaging, user-understanding, compatibility, or isolated-defect problem. A delivery complaint must not automatically become evidence of poor product usability.

### Public Experience Confidence

Public Experience Confidence should be reported independently from the MDRank Evidence Engine product score and Evidence Confidence. It should reflect the coverage and reliability of the public-opinion corpus, considering:

- exact-model match rate;
- usable sample size, with diminishing returns rather than a raw-volume advantage;
- independent source diversity;
- recency and ownership duration;
- verified-purchase share where available;
- agreement of themes across sources;
- corpus completeness;
- syndicated-review duplication;
- disclosed incentives;
- suspicious phrase repetition, rating bursts, and distribution anomalies;
- whether one retailer, promotion, or launch period dominates the sample.

Public labels should use **High**, **Moderate**, **Low**, or **Insufficient** confidence and display the corpus size, source period, source-type count, material limitations, and last analysis date. The public methodology should explain the factors without exposing every private anti-manipulation threshold.

### Persona-Fit Confidence

Persona assertions should combine verified product characteristics with recurring ownership themes and known use requirements. They should describe practical needs, behavior, accessibility, and tradeoffs rather than infer diagnoses or sensitive personal traits.

Acceptable patterns include:

- best for people who want a compact monitor and already use a smartphone;
- well suited to a one-person household that prioritizes portability over extensive on-device history;
- less suitable for households that regularly share one monitor;
- consider another model if a replaceable cuff, large physical buttons, or smartphone-free operation is important.

Avoid statements such as “best for diabetics,” “perfect for elderly people,” or “clinically accurate because owners say it matches their doctor.” Public reviews cannot support diagnosis-specific targeting, clinical validation, or medical certainty.

### Public-facing output

A completed dossier or comparison may publish:

1. **Public Experience Summary** — overall direction and the most stable ownership pattern.
2. **Frequently Liked** — recurring positive themes with transparent corpus context.
3. **Frequently Disliked** — recurring complaints and limitations.
4. **Best-Fit and Poor-Fit Persona** — who should consider the product and who should consider alternatives.
5. **Public Experience Confidence** — confidence label, corpus size, source period, source diversity, and limitations.

The page should state that public feedback describes owner experience and does not replace independent validation, regulatory records, professional advice, or hands-on testing by MDRank.org.

### Manipulation and publication safeguards

The layer must:

- deduplicate syndicated reviews;
- separate verified, unverified, and incentivized feedback when the source exposes those labels;
- detect suspicious repetition and rating bursts;
- preserve important minority and long-term failure themes;
- avoid presenting the corpus as representative of every purchaser;
- use aggregate themes rather than republishing long copyrighted review text;
- retain source and retrieval dates;
- honor deletion and retention requirements;
- keep commercial, retailer, and affiliate performance outside the analysis;
- escalate major conflicts between public sentiment and authoritative evidence;
- publish `Insufficient` rather than invent a persona when the corpus is weak.

---

# 5. Product score, evidence confidence, and public-experience confidence

MDRank Evidence Engine treats product quality, authoritative evidence quality, and public-opinion coverage as separate concepts.

- **Product score:** What the verified signals suggest about the product under the category rubric.
- **Evidence Confidence:** How complete, independent, fresh, and internally consistent the authoritative product evidence is.
- **Public Experience Confidence:** How reliable, exact-model-specific, recent, diverse, and internally consistent the permitted public-review corpus is.
- **Persona-Fit Confidence:** How strongly verified product requirements and recurring public-experience themes support a practical best-fit or poor-fit assertion.

A product with attractive manufacturer specifications but little independent support may have a reasonable provisional score and only limited confidence. A product with insufficient identity or evidence should not rank normally.

Weak authoritative evidence should pull extreme product conclusions toward a neutral position rather than allow unjustified “best” or “worst” results. Weak public-experience evidence should produce a lower Public Experience Confidence label or `Insufficient`; it should not change the authoritative Evidence Confidence value by itself.

A product may therefore have strong regulatory and specification evidence but little reliable public feedback, or a large enthusiastic review corpus but limited independent validation. Those situations must remain visible rather than being collapsed into one confidence number.

## Current pilot example

The current OMRON Evolv BP7000 pilot:

- identifies the exact US model and alternate model references;
- links FDA 510(k), OMRON documentation, a STRIDE BP listing, and an openFDA query;
- states that no hands-on or laboratory testing occurred;
- distinguishes a one-piece attached cuff from a true fixed-opening arm-in design;
- records the FDA statement that the integrated cuff is not replaceable;
- flags the HEM-7600T versus HEM-7600T-Z suffix issue;
- reports a provisional score separately from evidence confidence;
- remains a private dossier rather than claiming to be a market-wide winner.

This is the intended behavior: surface useful findings and unresolved identity issues instead of smoothing them over.

---

# 6. Content products and page taxonomy

## Legacy flagship protection

The route `/reviews/best-home-blood-pressure-monitors-2026` is a legacy, manually curated flagship page and a separate editorial artifact from MDRank Evidence Engine.

MDRank Evidence Engine must not automatically change its:

- products;
- rankings;
- scores;
- winner;
- primary conclusions;
- commercial positioning;
- URL;
- overall editorial structure.

The legacy page may receive factual corrections, refreshed links, appropriate disclosures, technical SEO maintenance, and removal of unsupported claims. Those maintenance allowances do not authorize autonomous editorial restructuring or replacement of its product selection.

All new product dossiers, comparisons, educational guides, and future category rankings must be built through the MDRank Evidence Engine evidence engine. The legacy page’s scores are not MDRank Evidence Engine evidence. Its `9.7` score must not be described as an MDRank Evidence Engine-generated result or used to seed, calibrate, validate, or override MDRank Evidence Engine scoring.

MDRank Evidence Engine may link to the legacy flagship but must identify and treat it internally as a separate manually curated artifact. Any replacement, migration, conversion to data-driven rendering, or transfer of editorial authority requires explicit owner approval.

MDRank may link to the Authentic Reviews legacy flagship as an external editorial artifact, but it must not import that page’s scores or conclusions as evidence. MDRank does not own or redirect Authentic Reviews URLs; maintenance, migration, or replacement of that external page remains an explicit owner decision in the Authentic Reviews repository.

## Lane A: Independent Editorial Top 10

- Broad candidate screen before ranking.
- Same evidence and score rules for all eligible products.
- Affiliate links allowed.
- Commission, margin, inventory, sponsorship, and advertising data technically excluded from scoring.
- Indexed when complete and useful.
- Visible testing status, factors, limitations, sources, confidence, and last verification date.

## Lane B: Product dossier

A model-level evidence page answering:

1. What is the exact product and model?
2. What is verified independently?
3. What is only manufacturer-stated?
4. What are the important fit, compatibility, consumable, app, warranty, and ownership facts?
5. What is unknown or conflicting?
6. Who is it likely to fit or not fit?
7. What is the testing status?
8. What changed since the previous verification?

## Lane C: Head-to-head comparison

Compares exact variants across explicit dimensions. It must not merge regional or package differences and should avoid declaring a universal winner when the best choice depends on fit or use case.

## Lane D: Educational and troubleshooting content

Answer-first guides create search and answer-engine authority and support commercial pages through internal links. Stable, lower-risk educational pages are the main current autopublishing lane.

## Lane E: Sponsored Top 5 or partner content

- Commercial selection is permitted.
- Conspicuous Sponsored, Paid placement, or Advertorial disclosure.
- Separate template, URL, analytics, and explanation.
- Every factual claim remains evidence-checked.
- The selected products cannot be presented as independent market-wide winners.

## Lane F: Paid direct landing page

- Conversion-oriented.
- Clearly disclosed.
- Usually `noindex` and excluded from sitemaps when paid-only.
- Separate experiment and analytics identifiers.
- Reuses approved evidence without quoting editorial conclusions out of context.

## Lane G: Public tools and downloadable assets

Potential authority and lead-generation products include:

- blood-pressure tracker and doctor-report generator;
- cuff-size and fit checker;
- model-number decoder;
- product eligibility verification record;
- total cost-of-ownership calculator;
- recall or discontinued-model alerts;
- warranty and accessory comparison database;
- caregiver home-vitals checklist;
- annual category evidence reports.

---

# 7. Content calendar automation

## 7.1 Current dated calendar

The operational calendar covers July 22 through August 20, 2026.

| Action type | Count | Treatment |
|---|---:|---|
| Stable educational blog publication | 17 | Eligible for publication after evidence, duplicate, schema, build, and live checks |
| Private review draft | 4 | Exact-model evidence work only; no public winner claim |
| Private safety-sensitive content draft | 5 | Held for stronger primary evidence and clinical/legal review where specified |
| Review refresh or launch-readiness draft | 3 | Private audit and change plan; no silent ranking or launch |
| Distribution/evidence refresh | 1 | Supported corrections and gap audit only |

The calendar expands authority into glucose monitoring, pulse oximeters, thermometers, heart rate, wearables, regulatory literacy, home-vitals setup, caregiver guidance, and accuracy-claim interpretation.

## 7.2 Nightly calendar runner

The scheduled MDRank.org nightly job runs at **1:15 AM America/Toronto**. It reads the dated calendar, finds the entry matching the current date, and executes that entry’s action type.

For a `publish-blog` assignment, the expected sequence is:

1. Read repository authoring and schema rules.
2. Pull or inspect the latest repository state.
3. Run duplicate and adjacent-intent checks.
4. Research current authoritative sources.
5. Draft the specified article rather than invent a substitute.
6. Add an answer-first section, useful headings, parser-compatible FAQs when appropriate, one honest image, one CTA, safe medical language, and source dates.
7. Run the Next.js production build.
8. Inspect rendered HTML, schema, canonical, FAQ output, disclosures, and generated LLM files.
9. Fetch remote changes and commit only scoped work.
10. Push to `main` when all checks pass.
11. Verify the live URL with cache busting.
12. Report the result or blocker.

For private review or safety-sensitive assignments, the runner creates private evidence or draft artifacts and does not publish a public route.

## 7.3 Draft-only social queue

The calendar renderer generates one Facebook, Instagram, and Reel concept record for every calendar day. Thirty queue records currently exist under the private Hermes data area.

These records remain `publish: false` until:

- the MDRank.org Facebook Page exists;
- the Instagram account is professional and connected to the Page;
- the correct Meta Business assets and app are authorized;
- IDs and token scopes are verified;
- approval-required API test posts succeed;
- returned post IDs are read back;
- live posts are inspected.

## 7.4 SEO, AEO, GEO, and LLM packaging

Each public article is intended to include, when semantically appropriate:

- one canonical intent;
- direct answer near the top;
- exact product or concept naming;
- concise comparison tables;
- useful definitions;
- visible source and verification dates;
- FAQ answers matching visible content;
- valid Article, Review, Product, ItemList, FAQPage, BreadcrumbList, or MedicalWebPage schema only where appropriate;
- neutral `llms.txt` and `llms-full.txt` directory updates that list canonical public resources without telling an AI system what to cite or conclude;
- internal links into the category cluster;
- honest limitations and testing status.

The objective is useful, citation-friendly content, not keyword sludge or mass-produced near-duplicates.

---

# 8. Current automation inventory

| Automation | Schedule | Current role | Status |
|---|---|---|---|
| MDRank.org nightly calendar runner | Daily 1:15 AM Toronto | Executes the 90-day blood-pressure depth assignment; new URLs stop at approval | Enabled; reads July 22–October 19 calendar |
| MDRank Evidence Engine private product intake | Daily 1:00 AM Toronto | Researches one exact blood-pressure product into private evidence intake or a documented non-eligible disposition | Enabled; research-only |
| MDRank.org social draft pack | Daily 7:00 PM Toronto | Prepares current-day FB, IG, and Reel draft artifacts | Enabled; draft-only |
| MDRank Evidence Engine weekly checkpoint | Saturday 10:00 AM Toronto | Reports progress, evidence gaps, and next milestone | Enabled; first scheduled checkpoint pending |
| MDRank.org weekly SEO/AEO audit | Saturday 2:00 PM Toronto | Audits MDRank.org and related sites for major regressions | Enabled; latest reported run successful |

## Important distinction

These schedules do not mean the full MDRank Evidence Engine Top 10 production engine is complete. Current schedules automate calendar execution, private intake, draft preparation, and monitoring around the working pilot. Multi-category, category-wide scoring and exception-controlled public ranking updates remain a phased build.

---

# 9. Social publishing and media system

## Planned official Meta workflow

MDRank.org should publish through official Meta APIs, not unofficial browser automation.

Supported planned surfaces:

- Facebook Page feed posts;
- Instagram image and carousel posts;
- Instagram Reels;
- Facebook Page Reels.

A conservative Reel master should use:

- 9:16 MP4;
- 1080 × 1920;
- H.264 video and AAC audio;
- 15 to 45 seconds for normal editorial clips;
- burned-in captions inside safe margins;
- licensed or owned media;
- no unsupported medical or comparative claims.

## Social content pattern

- Direct answer or observation first.
- Two to four supporting facts for Facebook.
- Three to six concise points for Instagram.
- One meaningful caveat.
- Link to the full source-backed guide.
- Affiliate or sponsored disclosure only when the actual relationship requires it.
- No engagement bait, invented urgency, or repetitive logo-heavy tiles.

## Activation dependency

Steven’s side must complete or authorize the MDRank.org Page, Instagram professional account, Meta Business portfolio, app/login flow, and asset permissions. Tokens and secrets must remain outside Git and prompts.

---

# 10. Revenue model

MDRank.org can support multiple revenue layers without contaminating editorial rankings.

## 10.1 Affiliate revenue

- Amazon Associates.
- Direct manufacturer or retailer programs.
- Affiliate networks and approved product feeds.
- TrueVitals referrals under ordinary affiliate disclosure when applicable.

Affiliate analytics may track click-through rate, conversion, EPC, and revenue. Those fields remain in a separate business dataset that the editorial scorer cannot import.

## 10.2 Sponsored content

A sponsor may pay for a clearly identified commercial feature, but cannot buy an independent rank. Sponsored pages use separate URLs, templates, disclosures, analytics, and selection explanations.

## 10.3 Paid landing pages and partner advertising

Evidence-approved facts may support disclosed paid landings, whitelisted or partnership ads, and creator licensing after current FTC, Meta, Google, privacy, health-ad, image-license, and contract requirements are verified.

Paid-only pages should normally be noindexed and kept out of the editorial sitemap.

## 10.4 Lead capture and owned audience

Potential assets:

- trackers and doctor reports;
- fit and compatibility tools;
- downloadable buyer checklists;
- evidence-update newsletter;
- recall and model-change alerts;
- category evidence reports.

## 10.5 Licensing and syndication

Possible products include:

- embeddable comparison tables;
- evidence widgets;
- co-branded educational explainers;
- creator scripts and licensed short-form assets;
- data summaries with citations;
- methodology-backed retailer education.

Licensing must preserve source context, disclosures, and limitations.

## 10.6 Private product intelligence

A private monthly market-gap report can summarize:

- features common among strongly supported products;
- underserved fit and accessibility needs;
- recurring user-friction themes;
- weak warranty or support practices;
- consumable and accessory problems;
- price bands with poor evidence quality;
- documentation and validation gaps;
- potential wholesale, private-label, or improved-product opportunities.

This report may inform outside merchants, including TrueVitals USA. It must not feed back into independent editorial rankings.

---

# 11. Brand, disclosure, and conflict firewall

## 11.1 Separate-brand rule

MDRank.org and TrueVitals USA are separate brands and companies. Public content must not state or imply common ownership or corporate affiliation.

## 11.2 Relationship taxonomy

| Actual relationship | Required treatment |
|---|---|
| Independent editorial, no commission | Normal editorial; no invented commercial disclosure |
| Editorial with qualifying affiliate link | Ordinary affiliate-commission disclosure |
| Paid inclusion or placement | Conspicuous Sponsored or Paid placement disclosure |
| Paid narrative landing page | Conspicuous Advertorial/Advertising disclosure and usually noindex |
| Licensed creator or partner campaign | Platform-appropriate partnership disclosure plus contract and usage-right verification |

## 11.3 TrueVitals treatment

When a TrueVitals product appears in independent editorial:

- it must pass the same eligibility gates;
- it may rank below competitors or be excluded;
- it must show meaningful drawbacks;
- commission, margin, stock, and ad performance cannot enter the scorer;
- the ordinary affiliate disclosure applies if a qualifying link may earn commission;
- no ownership or corporate-affiliation statement should be invented.

If TrueVitals pays for a placement or advertorial, that content moves to the sponsored or paid lane and must not alter the independent ranking.

---

# 12. Medical, regulatory, and consumer-protection controls

## Health-claims discipline

Prefer defensible language such as:

- “may help track trends”;
- “measurement tool”;
- “home monitor”;
- “manufacturer states”;
- “public-evidence review”;
- “not verified for this exact product”;
- “consult a qualified clinician.”

Claims such as FDA-cleared, clinically validated, medical grade, doctor recommended, most accurate, hospital grade, HSA/FSA eligible, or clinically proven require exact-product, jurisdiction-specific, current evidence.

## Testing-status discipline

Use “researched,” “evaluated,” “compared,” or “curated from public evidence” unless a written testing protocol was actually performed for the exact product. Product samples and a documented protocol can be added later, but public-evidence analysis must never be mislabeled as hands-on testing.

## HSA/FSA discipline

Eligibility must be verified for the exact product and current offer. It can vary by plan administrator, prescription or letter requirements, jurisdiction, merchant, and documentation. Eligibility is not evidence of efficacy or quality and is not tax advice.

## Advertising discipline

Health advertising and targeting require current platform review. Campaigns should avoid implying that a viewer has hypertension, diabetes, a respiratory condition, medication use, or another sensitive health state unless current platform rules and counsel permit the execution.

## Items requiring counsel or platform verification

- Final FTC-style disclosure wording for paid and creator content.
- Current Meta and Google health-ad and sensitive-targeting policies.
- Creator licensing and whitelisting agreements.
- Privacy, pixel, retargeting, and consent implementation.
- Medical-review representations.
- HSA/FSA and tax-related wording.
- Use and licensing of manufacturer, retailer, creator, customer, and competitor media.

---

# 13. Technology architecture

## Current foundation

- Next.js 15 App Router on Vercel.
- TypeScript and React for public rendering; versioned JSON contracts and records for the evidence layer.
- GitHub repository and Git audit history.
- Vercel deployment.
- Node scripts using native `fetch`.
- JSON evidence and export files.
- Hermes scheduled jobs.
- Generated `llms.txt` and `llms-full.txt` during production build.
- IndexNow submission during postbuild when configured.

## Intended file-backed architecture

```text
data/curation/
  categories/       Public-safe category definitions
  products/         Normalized product identities
  sources/          Source metadata
  evidence/         Compact traceable evidence records
  rankings/         Deterministic ranking outputs
  changes/          Ranking and evidence change logs
  exports/          Site-safe generated outputs

scripts/curation/
  contracts.mjs
  ingest.mjs
  normalize.mjs
  score.mjs
  validate.mjs
  detect-changes.mjs
  generate-editorial.mjs
  publish-safe-refresh.mjs
  connectors/

src/pages/products/[slug].astro
src/pages/methodology/[category].astro
src/components/curation/
```

Private production scoring logic belongs outside public page content. Large raw source snapshots belong outside Git under the Hermes data directory; the repository should contain compact records, dates, hashes, parsed fields, and run manifests.

## Current implemented commands

```text
npm run build
npm run curation:test
npm run curation:pilot
npm run curation:pilot:omron
npm run calendar:test
npm run calendar:build
npm run social:validate
```

## Current automated test coverage

The curation suite currently tests, among other things:

- accepted traceable evidence records;
- rejection of unknown, duplicate, orphan, stale, and invalid evidence;
- required testing and HSA/FSA statuses;
- source-linked claims;
- public disclosure and private scoring separation;
- evidence-constrained Markdown and HTML output;
- sponsored disclosure behavior;
- weak-evidence score shrinkage;
- failed eligibility gates;
- invalid confidence handling;
- commercial-performance exclusion from scores;
- stable tie-breaking;
- private-weight omission from public methodology.

The calendar suite tests:

- 30 contiguous dated entries;
- unique publishable slugs;
- complete rendering of strategic fields;
- 30 draft-only social records;
- all 30 phone-calendar cards;
- no duplicate existing blog slugs;
- rejection of duplicate dates or slugs.

---

# 14. Operating model

## Daily

- Execute the dated calendar assignment.
- Research one exact product privately.
- Prepare the day’s draft-only social pack.
- Monitor build or source failures associated with those jobs.

## Weekly

- MDRank Evidence Engine checkpoint: candidate count, accepted/rejected identities, strongest new evidence, largest unresolved gap, and next milestone.
- SEO/AEO audit: canonicals, indexing controls, schema, key routes, obvious content regressions, and claim risks.
- Link and availability spot checks.

## Monthly target state

- Full category rescoring.
- Comparison-table refresh.
- Evidence-update digest.
- Private market-gap and product-opportunity report.
- Review of exceptions and sources nearing freshness limits.
- One high-authority public tool or data asset advanced.

## Quarterly target state

- Rubric and source-policy review.
- Full conflict audit.
- Category pruning and expansion decision.
- Medical, regulatory, affiliate, ad, and privacy process review.

## Operator interface

The intended operator experience is exception-based. Routine work happens automatically; material events arrive as concise Telegram checkpoints showing:

- what changed;
- affected product and category;
- previous and proposed score or rank;
- evidence links;
- reason for escalation;
- approve, reject, or hold decision.

---

# 15. Status matrix: built, pilot, planned, and dependent

## Operational now

- Live Next.js site and build process.
- Evidence contracts, candidate queue, private approval packet generator, and transparency pages.
- Neutral LLM resource directory and generated crawler/sitemap routes.
- Dated 90-day blood-pressure-depth calendar.
- Contract, quarantine, and calendar validation tests.
- One private OMRON Evolv BP7000 evidence record transitioned with its model-family caveat intact.
- Legacy public scores, review routes, database rows, and score-jitter pipeline quarantined from production output.

## Working pilot, not full production

- Versioned exact-model evidence contract.
- Deterministic category-manifest validation.
- Deterministic Public Experience Confidence calculation with clinical-evidence prohibition.
- Human publication gate and Telegram-friendly approval packet generator.
- Forty-product discovery queue; candidates are not yet screened or ranked.

## Planned or incomplete

- Public Experience Intelligence connectors, review-corpus contracts, deduplication, manipulation checks, theme extraction, and persona-fit outputs.
- Broad 20–40-product candidate screens for each finished Top 10.
- Production category manifests beyond the pilot.
- Full approved source connectors.
- Automated change detection and source hash monitoring.
- Data-driven public product and methodology pages.
- Public ranking change logs.
- Safe-refresh publisher with automatic rollback.
- Mature exception queue with approve/reject actions.
- Compliant retailer and affiliate feeds.
- Live official Meta publishing.
- GA4/Search Console feedback loop for MDRank.org if access is not already complete.
- Revenue analytics isolated from editorial scoring.
- Sponsored Top 5 and paid-direct templates.
- Monthly private market-gap report generator.
- Public tools and downloadable reports.
- Written hands-on testing protocol and sample-handling process.

## Owner or third-party dependencies

- MDRank.org Meta Page, professional Instagram account, Business portfolio, app, and authorization.
- Affiliate account and feed access.
- Confirmation of publicly authorized authors and reviewer credentials.
- Documented clinical review process for higher-risk content.
- Licensed product/catalog data where necessary.
- Product samples if hands-on claims are ever desired.
- Counsel/platform review for ads, whitelisting, creator licensing, disclosures, privacy, and sensitive-health targeting.

---

# 16. Phased roadmap

## Phase 0: Trust and disclosure reset

**Objective:** Ensure public promises match actual operations.

- Audit testing and first-person language.
- Verify medical-review representations.
- Align editorial, affiliate, sponsored, and correction policies.
- Preserve the separate-brand rule.
- Register the existing blood-pressure flagship as a protected legacy artifact, not an automation template.

**Important current constraint:** `/reviews/best-home-blood-pressure-monitors-2026` remains manually curated. MDRank Evidence Engine cannot autonomously change its products, rankings, scores, conclusions, URL, or overall structure. Its `9.7` score is not an MDRank Evidence Engine result. Any migration or replacement requires explicit owner approval.

## Phase 1: Evidence contracts and deterministic scorer

**Objective:** Reproduce a category result from structured evidence rather than hardcoded prose.

Current pilot progress includes contracts, validators, score tests, evidence records, and generated dossiers. The next milestone is a broader, defensible candidate pool.

## Phase 2: Data-driven Next.js rendering

**Objective:** Render product dossiers, methodologies, comparisons, and rankings from validated exports.

Required outputs include source lists, confidence, applicable disclosure, score explanation, update history, schema, and limitations.

## Phase 3: Approved connectors and change detection

**Objective:** Refresh evidence without uncontrolled scraping.

Each connector must declare permitted acquisition mode, source tier, fields, rate limit, and failure behavior. Unchanged hashes should produce no editorial diff.

## Phase 4: Evidence-constrained editorial and Public Experience Intelligence

**Objective:** Generate readable evidence-led copy and qualified public-experience/persona outputs while preventing invention, review manipulation, and score contamination.

Every material sentence should map to evidence. Unsupported claims and false testing language should fail. Review-corpus outputs should retain exact-model provenance, deduplicate syndication, classify recurring themes, separate product problems from retailer problems, and publish `Insufficient` when persona-fit evidence is weak.

## Phase 5: Safe autopublishing and exception queue

**Objective:** Publish routine nonmaterial refreshes while blocking material changes.

A safe change creates a scoped commit, passes build and rendered checks, deploys, and passes live verification. Failure stops or reverts the change.

## Phase 6: Category expansion

**Objective:** Add category-specific engines for pulse oximeters, thermometers, glucose, heart rate, and wearables after the first model proves reliable.

## Phase 7: Revenue and commercial lanes

**Objective:** Add affiliate feeds, sponsored templates, paid direct pages, creator licensing, market-gap reports, and revenue analytics without exposing or contaminating independent scores.

---

# 17. Success metrics

## Trust and quality

- Percentage of material factual claims with evidence pointers.
- Evidence coverage per ranked product.
- Share of products with high or moderate evidence confidence.
- Source freshness compliance.
- Unsupported claims blocked before publication.
- Correction rate and time to correction.
- Ambiguous models excluded rather than merged.
- Percentage of public-experience outputs with exact-model review provenance.
- Public-review duplication and exclusion rate.
- Share of persona-fit outputs labeled High, Moderate, Low, or Insufficient with visible corpus limitations.

## Audience and authority

- Non-brand organic impressions and clicks.
- Exact-model and comparison-query growth.
- Referring domains to tools and evidence assets.
- Mentions or citations by publications and answer engines.
- Returning visitors and newsletter subscribers.
- Search visibility across multiple measurement categories.

## Commercial

- Outbound affiliate click-through rate.
- Earnings per visitor and by category.
- Conversion rate by buyer-intent page.
- Sponsored and licensing revenue, reported separately.
- Revenue from tools, lead capture, or partnerships.

Commercial outcomes must never become scoring inputs.

## Operating leverage

- Percentage of routine refreshes completed without human input.
- Exceptions per month.
- Human-review minutes per category.
- Source failure rate.
- Build or live-verification failure rate.
- Rollback rate.

**Long-term operating target:** At least 90% of routine, nonmaterial refreshes happen automatically while every material ranking, safety, sponsorship, or conflict change remains auditable and intentionally reviewed.

---

# 18. Risks and mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| False hands-on impression | Trust and regulatory risk | Explicit testing status; block “we tested” without protocol |
| Model or variant merge error | Wrong recommendation or evidence | Exact identity gate; variant records; unresolved means unrankable |
| Stale regulatory or safety evidence | Reader harm and reputation | Freshness rules, scheduled checks, event exceptions |
| Manufacturer claims treated as independent | Inflated conclusions | Source-tier labeling and attributed wording |
| Affiliate bias | Destroys trust | Technical exclusion of commercial fields; tests; public disclosure |
| Sponsored content disguised as editorial | FTC and reputation risk | Separate lane, template, URL, analytics, and conspicuous disclosure |
| Thin AI page expansion | Search-quality and brand risk | Depth-first categories, duplicate gates, evidence requirement |
| Terms-of-service or copyright violation | Legal/platform risk | Official APIs, licensed feeds, manual-only sources, no prohibited scraping |
| Review manipulation or syndicated duplication | False popularity, repeated complaints, or distorted persona fit | Exact-model matching, deduplication, incentive labels, anomaly checks, source diversity, visible confidence |
| Public sentiment mistaken for clinical evidence | Unsafe or misleading product claims | Separate confidence outputs; prohibit sentiment-based accuracy, safety, and medical assertions |
| Legacy flagship modified by automation | Loss of manually curated rankings, URL equity, or editorial intent | Protected-route preflight; no autonomous score/product/structure changes; owner approval for migration |
| Medical-review claim without proof | Trust and liability risk | Verify reviewer authorization and page-level process |
| Meta token or identity error | Wrong-account publishing | Read-back IDs, draft mode, approval-required first posts, stop conditions |
| Unclean concurrent Git state | Publishing conflict or accidental commit | Fetch-first workflow, scoped commits, clean-tree checks |
| Scoring manipulation or drift | Unreproducible rankings | Versioned manifests, deterministic tests, change logs |
| Overdependence on one traffic source | Business fragility | Search, answer engines, social, email, tools, licensing, and direct audience |

---

# 19. Immediate priorities

## Next 30 days

1. Execute the dated authority calendar with daily validation and live checks.
2. Continue one exact-product private intake per day.
3. Define the Public Experience Intelligence data contract and pilot it on one exact model using only permitted sources.
4. Expand the authoritative evidence corpus beyond the first dossiers.
5. Keep safety-sensitive and ranked content private until evidence gates pass.
6. Activate weekly MDRank Evidence Engine progress reporting.
7. Clean and commit the final revised calendar and current dossier artifacts as scoped baseline changes.
8. Resolve MDRank.org Meta assets and perform approval-required API test posts.
9. Confirm affiliate networks, compliant product feeds, and any licensed review-data access.
10. Verify public author and medical-review representations.
11. Define the first category that will receive a full candidate screen and data-driven comparison.

## Recommended first category milestone

Before publishing a new market-wide ranking, document enough exact products to create a credible comparison and explicitly reject ambiguous candidates. For a finished Top 10, screen a broader 20–40-product pool and require sufficient eligible products with adequate evidence.

## Owner inputs with the highest leverage

1. Meta authorization for MDRank.org assets.
2. Affiliate account and feed access.
3. Confirmation of public authors, reviewers, credentials, and actual review process.
4. Priority category and merchant economics for private opportunity research.
5. Product samples and a written protocol if future hands-on testing is desired.
6. Licensed product-review feed, retailer export, or approved API access if broader public-experience coverage is desired.

The engine can continue private evidence intake and calendar publishing without all of these inputs, but monetization, social distribution, and higher-risk review promotion depend on them.

---

# 20. Financial planning framework

This plan does not invent revenue forecasts without real traffic, ranking, click, commission, and conversion data. A reviewable model should use scenario inputs rather than unsupported projections.

## Affiliate model

```text
Monthly affiliate revenue =
monthly sessions × commercial-page share × outbound click rate ×
merchant conversion rate × average order value × commission rate
```

## Sponsored and licensing model

```text
Monthly partner revenue =
approved sponsored packages + creator/licensing fees + data/widget licenses
```

## Cost model

```text
Monthly operating cost =
hosting + model/API usage + data/feed licenses + media generation +
contract review + clinical review + product samples + human exception handling
```

## Unit-economics rule

Revenue analytics should optimize topic prioritization, CTA presentation, merchant selection, and commercial lane design. They must not modify independent product ranks.

A separate financial model should be created after at least 60–90 days of reliable MDRank.org analytics and affiliate attribution.

---

# 21. Due-diligence questions for independent reviewers and other LLMs

A reviewer should challenge the plan using these questions:

## Evidence integrity

- Does every material product claim have a traceable source?
- Are exact model, market, and variant resolved?
- Are manufacturer claims clearly attributed?
- Are missing and conflicting facts visible?
- Are source freshness and permitted-use mode recorded?

## Scoring integrity

- Can the same input reproduce the same score and rank?
- Are commission, margin, stock, sponsor priority, and ad performance absent from scorer inputs?
- Does weak evidence lower confidence and prevent extreme scores?
- Are eligibility gates enforced before ranking?
- Are rubric changes versioned and reviewed?

## Public Experience Intelligence integrity

- Are reviews tied to the exact model and documented equivalent variants only?
- Are syndicated reviews deduplicated and incentivized or verified labels retained when available?
- Are public-review acquisition, storage, deletion, quotation, and reuse modes permitted?
- Does the system distinguish product problems from retailer, shipping, compatibility, and isolated-defect issues?
- Are Public Experience Confidence and Persona-Fit Confidence separate from Evidence Confidence and the product score?
- Does weak coverage produce `Insufficient` rather than a fabricated persona?
- Are clinical accuracy, safety, and diagnosis-specific assertions prohibited when based only on owner feedback?

## Legacy flagship integrity

- Is `/reviews/best-home-blood-pressure-monitors-2026` excluded from autonomous product, ranking, score, conclusion, URL, and structural changes?
- Is its `9.7` score excluded from MDRank Evidence Engine evidence and described only as a legacy manual score?
- Would any migration, replacement, or transfer to MDRank Evidence Engine require explicit owner approval?

## Editorial integrity

- Does the page accurately state whether hands-on testing occurred?
- Does it include meaningful drawbacks and poor-fit users?
- Is a pilot being misrepresented as a market-wide winner?
- Are sponsored and paid lanes conspicuous and separate?
- Are MDRank.org and TrueVitals USA treated as separate brands and companies?

## Automation safety

- Can a recall, top-three change, model conflict, or low-confidence claim auto-publish?
- Do builds, schema, links, canonical, disclosures, and live routes receive verification?
- Is rollback or stop behavior implemented?
- Are connectors compliant with source terms?
- Are secrets kept out of Git, prompts, and logs?

## Business viability

- Is traffic being earned through information gain rather than article volume?
- Are evidence records reused across multiple genuinely distinct outputs?
- Are affiliate and partner opportunities diversified?
- Are public tools and owned-audience assets being built?
- Is the organization measuring operating leverage and correction quality, not only page count?

---

# 22. Verification appendix

## Primary repository artifacts

- `CLAUDE.md` — governing MDRank repository instructions.
- `docs/business/2026-07-21-mdrank-business-plan.md` — this transitioned implementation mandate.
- `data/content-calendar/2026-07-22-to-2026-10-19-mdrank-bp-depth.json` — machine-readable 90-day calendar.
- `data/evidence/candidates/home-blood-pressure-monitors.90-day.json` — 40-candidate discovery queue.
- `data/evidence/records/omron-evolv-bp7000.json` — transitioned private model-level evidence record.
- `engine/lib/contracts.mjs` — exact-model, methodology, and public-experience contracts.
- `engine/lib/publication-gate.mjs` — fail-closed human publication gate.
- `engine/generate-approval-packet.mjs` — private Telegram-friendly approval packet generator.
- `engine/tests/` — contract, quarantine, calendar, and public-copy tests.
- `web/src/app/methodology/page.tsx` — public methodology surface.
- `web/src/app/evidence-status/page.tsx` — implementation and corpus status.
- `web/src/data/devices.json` — approved public fallback corpus, currently empty.
- `package.json` — test, build, and approval-packet commands.

## Current test results at preparation time

- `npm test`: 15 tests passed, zero failed.
- `npm run build`: Next.js production build completed successfully.
- Local homepage, methodology, evidence status, robots, sitemap, and llms routes returned HTTP 200.
- Inherited TrueVitals and hands-on routes returned HTTP 404 locally after quarantine.
- Canonicals resolved to `https://mdrank.org/`, `/methodology`, and `/evidence-status`.
- OAI-SearchBot is explicitly allowed and the sitemap lists only the three approved canonical pages.

## Current implementation caveats

1. Legacy synthetic/source-derived ranking data remains visible in Git history but is removed from the public fallback, blocked behind an evidence-v1 database opt-in, and replaced by fail-fast seed files.
2. MDRank Evidence Engine is a working foundation, not yet a complete autonomous Top 10 platform.
3. Public Experience Intelligence contracts and deterministic confidence logic are implemented; production connectors, licensed corpora, deduplication storage, theme extraction, and public rendering remain incomplete.
4. MDRank-specific scheduled jobs should remain inactive until the first post-deployment verification succeeds.
5. Public medical-review representations require operational verification of the actual reviewer and page-level process.
6. The Authentic Reviews legacy route is external to MDRank. Its products, rankings, scores, conclusions, URL, and structure are outside MDRank control; its `9.7` score is not MDRank evidence.
7. Search traffic, affiliate revenue, answer-engine citations, and future ad performance are opportunities, not guaranteed outcomes.

## Official policy references

- FTC Disclosures 101 for Social Media Influencers: `https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers`
- FTC Endorsement Guides Q&A: `https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking`
- Meta Pages API posts: `https://developers.facebook.com/documentation/pages-api/posts`
- Meta Instagram content publishing: `https://developers.facebook.com/documentation/instagram-platform/content-publishing`
- Meta Reels publishing: `https://developers.facebook.com/documentation/video-api/guides/reels-publishing`
- Google Ads healthcare policy: `https://support.google.com/adspolicy/answer/176031`
- Google restricted personalized advertising: `https://support.google.com/adspolicy/answer/143465`

These external requirements change. They must be rechecked immediately before launching paid campaigns, creator licensing, automated social publishing, or sensitive health targeting.

---

# 23. Final recommendation

Proceed with the build, but preserve the order of operations:

1. Make public trust language match real operations.
2. Preserve the legacy blood-pressure flagship as a manually curated artifact unless the owner explicitly approves migration.
3. Expand exact-model authoritative evidence records.
4. Add the separate Public Experience Intelligence corpus, confidence, and persona-fit layer through permitted sources.
5. Prove deterministic category rankings from a broad candidate pool.
6. Render public pages from validated data.
7. Add approved connectors and change detection.
8. Constrain LLM output to verified evidence and qualified public-experience themes.
9. Automate only routine, low-risk publication.
10. Escalate safety, ranking, identity, scoring, public-opinion conflict, and commercial-conflict changes.
11. Expand category by category.
12. Add revenue, sponsored, paid, social, and product-intelligence layers without contaminating editorial independence.

The strongest business identity is not “automated AI reviews.” It is:

> **An always-maintained evidence and recommendation system for products people use to measure their health.**

That system can become a search authority, affiliate business, social content engine, product-intelligence resource, licensing platform, and carefully separated paid-media asset while retaining the credibility required for every one of those revenue streams.
