#!/usr/bin/env node
/**
 * Publish the Steven-approved held gatePass=yes pack (2026-10-28, via Chief of Staff).
 * Identity, FDA identifier, ASIN, and image come from the pack. Scores come only from
 * the existing upper-arm rubric. This script does not invent validation studies,
 * hands-on results, or numeric scores.
 */
import fs from 'node:fs';
import path from 'node:path';
import { findCommercialContamination } from './lib/commercial-isolation.mjs';
import { loadMethodology, projectPublicScores } from './lib/scorer.mjs';

const root = process.cwd();
const packPath = process.env.PUBLISH_PACK
  ?? '/tmp/publish-pack/PUBLISH-PACK-HELD-YES.md';
const trackerPath = process.env.PUBLISH_TRACKER
  ?? '/cursor/stores/store-756551b7-6f01-4305-b64e-3a77716e0c4f/backlog/BATCH-PUBLISH-N100-TRACKER.md';
const assetDir = process.env.PUBLISH_ASSETS ?? '/tmp/publish-pack/assets';
const imageOutDir = path.join(root, 'web/public/images/dossiers');
const inputDir = path.join(root, 'data/evidence/scoring-inputs');
const retrievedAt = '2026-10-28';

function cells(line) {
  return line.split('|').slice(1, -1).map((cell) => cell.trim());
}

function parsePack(markdown) {
  const rows = [];
  for (const line of markdown.split('\n')) {
    if (!line.startsWith('| ')) continue;
    const row = cells(line);
    if (!/^\d+$/.test(row[0] ?? '')) continue;
    const fdaCell = row[3];
    const number = (fdaCell.match(/DEN\d{6}|K\d{6}/) ?? [])[0];
    if (!number) throw new Error(`Missing clearance number for ${row[1]}`);
    rows.push({
      slug: row[1].replace(/`/g, ''),
      name: row[2],
      fdaCell,
      number,
      deNovo: /De Novo/i.test(fdaCell) || number.startsWith('DEN'),
      asin: row[4].replace(/`/g, ''),
      ready: row[7],
    });
  }
  if (rows.length !== 58) throw new Error(`Expected 58 pack rows, found ${rows.length}.`);
  if (new Set(rows.map((row) => row.slug)).size !== 58) throw new Error('Duplicate pack slug.');
  if (rows.some((row) => row.ready !== 'yes')) throw new Error('Pack row is not ready.');
  if (rows.some((row) => !/^[A-Z0-9]{10}$/.test(row.asin))) throw new Error('Pack ASIN is not 10 characters.');
  return rows;
}

function parseTracker(markdown, slugs) {
  const wanted = new Set(slugs);
  const bySlug = new Map();
  for (const line of markdown.split('\n')) {
    if (!line.startsWith('| ')) continue;
    const row = cells(line);
    const slug = (row[0] ?? '').replace(/`/g, '');
    if (!wanted.has(slug) || row.length < 12) continue;
    bySlug.set(slug, {
      brand: row[1],
      model: row[2],
      form: row[3],
      k: row[4],
      src: row[5],
      asin: row[6],
      notes: row[9],
      gate: row[10],
    });
  }
  return bySlug;
}

function familyCaveat(src, notes) {
  return /crosswalk caveat|family includes|family summary|family not |pmn names .+ not /i.test(`${src} ${notes}`);
}

function fdaUrl(src, number, deNovo) {
  const urls = [...src.matchAll(/https:\/\/[^\s)]+/g)].map((match) => match[0].replace(/[.,;]+$/g, ''));
  const preferred = urls.find((url) => url.includes('accessdata.fda.gov') && url.includes(number));
  if (preferred) return preferred;
  const any = urls.find((url) => url.includes('accessdata.fda.gov'));
  if (any) return any;
  const page = deNovo ? 'denovo.cfm' : 'pmn.cfm';
  return `https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/${page}?ID=${number}`;
}

function clearancePhrase(row) {
  return row.deNovo ? `FDA-cleared (De Novo ${row.number})` : `FDA-cleared ${row.number}`;
}

function jpegSize(file) {
  const data = fs.readFileSync(file);
  let i = 2;
  while (i < data.length - 8) {
    if (data[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = data[i + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return { height: data.readUInt16BE(i + 5), width: data.readUInt16BE(i + 7) };
    }
    if (marker === 0xd8 || marker === 0xd9) {
      i += 2;
      continue;
    }
    i += 2 + data.readUInt16BE(i + 2);
  }
  throw new Error(`No JPEG size in ${file}`);
}

function scoringInput(row, screen) {
  const phrase = clearancePhrase(row);
  return {
    schemaVersion: '1.0.0',
    productId: row.slug,
    slug: row.slug,
    brand: screen.brand,
    exactModel: screen.model,
    market: 'US',
    formFactor: 'upper-arm',
    identity: {
      status: screen.family ? 'resolved-with-model-family-caveat' : 'resolved',
    },
    testingStatus: 'public-evidence-only',
    testingLanguage: { handsOnClaimWithoutProtocol: false },
    disclosureStatus: 'independent-editorial',
    publication: {
      alreadyPublic: false,
      humanPublish: true,
      url: `/devices/${row.slug}`,
    },
    regulatory: {
      clearanceType: row.deNovo ? 'fda-de-novo' : 'fda-510k',
      clearanceNumber: row.number,
    },
    validation: {
      scope: 'none',
      namesExactModel: false,
      peerReviewed: false,
      namedProtocolPass: false,
      fundingIndependence: 'not-applicable',
    },
    measurement: {},
    fit: { rangesCm: [] },
    usability: {},
    dataHandling: {},
    ownership: {},
    recall: {},
    conflicts: [],
    publicExperience: { licensedExactModelCorpus: false },
    evidenceDates: { criticalRetrievedAt: retrievedAt, asOf: retrievedAt },
    primarySources: [
      {
        id: 'fda-clearance',
        sourceClass: 'A',
        url: screen.url,
        retrievedAt,
      },
    ],
    materialClaims: [
      {
        id: 'clearance',
        text: `The published packet records ${phrase} for this exact model. Clearance is not accuracy proof.`,
        evidenceIds: ['fda-clearance'],
      },
    ],
  };
}

function dossier(row, screen, score) {
  const phrase = clearancePhrase(row);
  const level = score.evidenceConfidence;
  if (!level) throw new Error(`Missing Evidence Confidence for ${row.slug}`);
  const familySentence = screen.family
    ? `The FDA record is a model-family crosswalk, so family-level context is not scored as exact-model validation. `
    : '';
  const directAnswer = `${row.name} is published as a United States upper-arm home blood-pressure monitor. The clearance identifier is ${phrase}. ${familySentence}MDRank Score and category rank are withheld because exact-model validation evidence is insufficient for rubric upper-arm-home-bp-v1.0.0. Evidence Confidence stays ${level} and is separate from the score. FDA clearance is not FDA approval, endorsement, independent validation, or proof of superior accuracy.`;
  const scoreReason = screen.family
    ? `Withheld under rubric upper-arm-home-bp-v1.0.0. Identity is resolved with a model-family caveat, and this packet does not contain exact-model validation. Family-level records are not scored as exact-model validation. Evidence Confidence stays ${level} and separate.`
    : `Withheld under rubric upper-arm-home-bp-v1.0.0. The published packet records exact-model identity and FDA clearance, and it does not include the exact-model measurement and validation record required for a score. Evidence Confidence stays ${level} and separate.`;
  const photoSrc = `/images/dossiers/${row.slug}-real-use.jpg`;
  return {
    slug: row.slug,
    name: row.name,
    manufacturer: screen.brand,
    model: screen.model,
    market: 'United States',
    category: 'Upper-arm blood-pressure monitor',
    evidenceCutoff: 'October 28, 2026',
    publishedOn: '2026-10-28',
    directAnswer,
    disposition: 'accepted-evidence-dossier',
    evidenceConfidence: level,
    publicExperienceConfidence: 'Insufficient',
    testingStatus: 'Public evidence only. MDRank has not performed hands-on or laboratory testing of this monitor.',
    scoreStatus: 'withheld',
    rankStatus: 'withheld',
    scoreReason,
    illustrativePhoto: {
      src: photoSrc,
      width: screen.width,
      height: screen.height,
      alt: `Illustrative real-use photo edited for clarity, showing an upper-arm cuff and monitor for the ${row.name}. Not manufacturer or clinical photography.`,
      caption: '*Photo edited for clarity.',
      rightsStatus: 'owned',
      rightsNote: 'Owner-supplied illustrative photograph edited for clarity. Rights status: owned. It is not manufacturer photography, clinical photography, or an MDRank hands-on or laboratory test.',
    },
    amazonListing: {
      asin: row.asin,
      canadaLocalMatch: 'not-documented',
      listingNote: `Amazon.com listing ASIN ${row.asin} is the approved publish-pack listing for ${row.name}. Amazon marketing copy is not MDRank evidence. No price or availability is asserted.`,
    },
    handlingGlance: [
      {
        id: 'clearance',
        label: 'FDA clearance',
        summary: phrase,
        fit: 'Clearance identifier recorded',
        confidence: 'Stated from the cited clearance record',
        meter: 'documented',
      },
      {
        id: 'validation',
        label: 'Validation',
        summary: 'No exact-model validation study in this packet',
        fit: 'Not established',
        confidence: 'Insufficient',
        meter: 'unsupported',
      },
      {
        id: 'cuff-fit',
        label: 'Cuff fit',
        summary: 'Cuff range not documented in this packet',
        fit: 'Not established',
        confidence: 'Insufficient',
        meter: 'unsupported',
      },
      {
        id: 'measurement',
        label: 'Measurement record',
        summary: 'Not documented in this packet',
        fit: 'Not established',
        confidence: 'Insufficient',
        meter: 'unsupported',
      },
    ],
    handlingReport: [
      {
        id: 'clearance',
        criterion: 'FDA clearance',
        finding: `${phrase}. FDA clearance is not FDA approval, endorsement, independent validation, or proof of superior accuracy.`,
        confidence: 'Stated from the cited clearance record',
        sourceClass: 'A',
        sourceLabel: `FDA record ${row.number}`,
      },
      {
        id: 'validation',
        criterion: 'Exact-model validation',
        finding: screen.family
          ? 'Not established. The FDA record is a model-family crosswalk, and no exact-model validation study is in this packet.'
          : 'Not established. No exact-model peer-reviewed validation study is recorded in this published packet.',
        confidence: 'Insufficient',
        sourceClass: 'A',
        sourceLabel: `FDA record ${row.number}`,
      },
      {
        id: 'cuff-fit',
        criterion: 'Cuff fit',
        finding: 'Not documented in this published packet.',
        confidence: 'Insufficient',
        sourceClass: 'A',
        sourceLabel: `FDA record ${row.number}`,
      },
    ],
    exactIdentity: [
      `Retail identity in this dossier: ${row.name}.`,
      `Market: United States. The publish screen classified this model as an upper-arm home blood-pressure monitor.`,
      `Clearance identifier: ${phrase}.`,
      `Amazon.com ASIN ${row.asin} is the listing named in the approved publish pack. That ASIN is not a scoring input.`,
    ],
    regulatoryFindings: [
      `${phrase} is the clearance identifier recorded for ${screen.model}. FDA clearance is not FDA approval, endorsement, independent validation, or proof of superior accuracy.`,
      'The clearance identifier is cited from the FDA database record linked in the evidence ledger.',
      screen.family
        ? 'The FDA record is a model-family crosswalk. This dossier does not treat the family record as exact-model validation.'
        : 'No separate exact-model validation study is attached to this clearance identifier in the published packet.',
      'This packet does not claim the result of an openFDA recall or enforcement query.',
    ],
    validationFindings: [
      'No peer-reviewed exact-model validation study is recorded in this published packet.',
      'MDRank has not performed hands-on or laboratory testing of this monitor.',
      'Family-level records are not transferred as exact-model validation.',
    ],
    hsaFsa: {
      status: 'Not documented in this published packet',
      basis: 'No HSA/FSA eligibility source is recorded for this exact model in the published packet.',
      limitations: [
        'Eligibility is not asserted.',
        'An eligibility display, if one is added later, stays separate from the MDRank Score and category rank.',
        'MDRank did not complete checkout or test benefit-card acceptance.',
      ],
    },
    specifications: [
      { label: 'Form factor', value: 'Upper-arm home blood-pressure monitor, as screened for this dossier' },
      { label: 'FDA clearance', value: phrase },
      { label: 'Cuff range', value: 'Not documented in this published packet' },
      { label: 'Measurement specifications', value: 'Not documented in this published packet. MDRank did not measure this monitor.' },
    ],
    personaFit: [
      {
        persona: 'Buyer comparing this exact model',
        fit: 'Not established',
        confidence: 'Insufficient',
        basis: 'Cuff range and on-device workflow are not in the published packet, so no persona fit is assigned.',
      },
    ],
    limitations: [
      'MDRank did not perform hands-on, laboratory, or independent performance testing.',
      'Exact-model validation, cuff range, power, memory, and accuracy bands are not in this published packet.',
      'Amazon marketing copy, prices, and identifier crosswalks beyond the approved ASIN are not MDRank evidence.',
      'No licensed or API-permitted exact-model customer-review corpus was acquired.',
      'The photograph on this page is an owner-supplied illustrative image edited for clarity. It is not manufacturer photography, clinical photography, or an MDRank hands-on or laboratory test.',
      ...(screen.family
        ? ['The cited FDA record is a model-family crosswalk. Family-level context stays unranked.']
        : []),
    ],
    sources: [
      {
        label: `FDA record ${row.number}`,
        url: screen.url,
        sourceClass: 'A',
      },
    ],
    changeLog: [
      'October 28, 2026: Published after Chief of Staff confirmation that Steven approved the held gatePass=yes pack. Score and rank withheld. Illustrative photo and disclosed Amazon Associates link added. Affiliate weight remains zero.',
    ],
  };
}

function faqsFor(row) {
  const phrase = clearancePhrase(row);
  return [
    {
      question: `Is the ${row.name} FDA cleared?`,
      answer: `The published packet records ${phrase} for this exact model. FDA clearance is not FDA approval, endorsement, independent validation, or proof of superior accuracy.`,
    },
    {
      question: `Did MDRank test the ${row.name}?`,
      answer: 'Public evidence only. MDRank has not performed hands-on or laboratory testing of this monitor. No licensed or API-permitted exact-model customer-review corpus was acquired.',
    },
    {
      question: `What exact-model validation is recorded for the ${row.name}?`,
      answer: 'No peer-reviewed exact-model validation study is recorded in this published packet. Family-level records are not transferred as exact-model validation. MDRank has not performed hands-on or laboratory testing of this monitor.',
    },
  ];
}

function writeSitemap(slugs) {
  const deviceUrls = slugs
    .map((slug) => `    { url: "https://mdrank.org/devices/${slug}", lastModified, changeFrequency: "monthly", priority: 0.7 },`)
    .join('\n');
  const source = `import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-28T00:00:00Z");
  return [
    { url: "https://mdrank.org/", lastModified, changeFrequency: "weekly", priority: 1 },
    { url: "https://mdrank.org/methodology", lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://mdrank.org/evidence-status", lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: "https://mdrank.org/devices", lastModified, changeFrequency: "weekly", priority: 0.8 },
${deviceUrls}
    { url: "https://mdrank.org/disclosures", lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: "https://mdrank.org/privacy", lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
`;
  fs.writeFileSync(path.join(root, 'web/src/app/sitemap.ts'), source);
}

function writeLlms(rows) {
  const links = rows
    .map((row) => `- ${row.name}: https://mdrank.org/devices/${row.slug}`)
    .join('\n');
  const text = `# MDRank.org

Site: https://mdrank.org/
Purpose: Exact-model medical-device evidence, visible Evidence Confidence, and category ranks for scored-eligible rows.
Updated: 2026-10-28

## Canonical public resources

- Home: https://mdrank.org/
- Methodology: https://mdrank.org/methodology
- Disclosures: https://mdrank.org/disclosures
- Evidence status: https://mdrank.org/evidence-status
- Published evidence dossiers: https://mdrank.org/devices
- iHealth Track KN-550BT evidence dossier: https://mdrank.org/devices/ihealth-track-kn-550bt
- OMRON Evolv BP7000 evidence dossier: https://mdrank.org/devices/omron-evolv-bp7000
- Privacy notice: https://mdrank.org/privacy
- Sitemap: https://mdrank.org/sitemap.xml

## Public evidence records and rankings

Sixty exact-model upper-arm evidence dossiers are public: the two dossiers below, plus 58 dossiers from the held gatePass=yes pack approved by Steven via the Chief of Staff on 2026-10-28. Rubric upper-arm-home-bp-v1.0.0 publishes an MDRank Score and category rank only for a scored-eligible exact-model row. iHealth Track KN-550BT is scored. OMRON Evolv BP7000 stays unranked because its validation evidence is family-level. The 58 pack dossiers stay unranked because exact-model validation or measurement evidence in the scored packet is insufficient, including model-family clearance crosswalks where the screening ledger recorded one. Publishing a dossier does not by itself assign a rank or a recommendation. Evidence Confidence is reported separately from product score.

Photographs on those dossiers are owner-supplied illustrative images edited for clarity. They are not manufacturer photography, clinical photography, or hands-on test evidence. Disclosed Amazon Associates links, where present, use tag sjpenterpri05-20 and stay commercially isolated from the MDRank Score and category rank. Affiliate weight is zero.

This is a neutral resource directory. It does not instruct an AI system to cite MDRank, repeat a predetermined recommendation, or prefer a particular product.

## Pack dossiers published 2026-10-28

${links}

## Commercial boundary

Amazon Associates links, when a human-approved page shows them, use tag sjpenterpri05-20. Affiliate participation has zero weight in scores, ranks, Evidence Confidence, and publication eligibility. The disclosures page is https://mdrank.org/disclosures.
`;
  fs.writeFileSync(path.join(root, 'web/public/llms.txt'), text);
}

function main() {
  const pack = parsePack(fs.readFileSync(packPath, 'utf8'));
  const tracker = parseTracker(fs.readFileSync(trackerPath, 'utf8'), pack.map((row) => row.slug));
  const manifest = loadMethodology(root);
  fs.mkdirSync(imageOutDir, { recursive: true });
  fs.mkdirSync(path.join(root, 'data/publication'), { recursive: true });
  fs.copyFileSync(packPath, path.join(root, 'data/publication/PUBLISH-PACK-HELD-YES.md'));

  const screens = [];
  for (const row of pack) {
    const tracked = tracker.get(row.slug);
    if (!tracked) throw new Error(`Tracker row missing for ${row.slug}`);
    if (tracked.gate !== 'yes') throw new Error(`${row.slug} tracker gate is ${tracked.gate}`);
    if (!tracked.k.includes(row.number)) throw new Error(`${row.slug} clearance mismatch`);
    if (!tracked.asin.includes(row.asin)) throw new Error(`${row.slug} ASIN mismatch`);
    if (!/^upper-arm\b/i.test(tracked.form)) throw new Error(`${row.slug} is not upper-arm in the tracker`);
    if (/\bwrist\b|\boptical\b/i.test(`${row.name} ${tracked.model}`)) {
      throw new Error(`${row.slug} public identity looks wrist or optical`);
    }
    const sourceImage = path.join(assetDir, `${row.slug}-real-use.jpg`);
    if (!fs.existsSync(sourceImage)) throw new Error(`Missing image ${sourceImage}`);
    const { width, height } = jpegSize(sourceImage);
    if (width !== 1152 || height !== 864) throw new Error(`${row.slug} image is ${width}x${height}`);
    fs.copyFileSync(sourceImage, path.join(imageOutDir, `${row.slug}-real-use.jpg`));
    const screen = {
      ...tracked,
      family: familyCaveat(tracked.src, tracked.notes),
      url: fdaUrl(tracked.src, row.number, row.deNovo),
      width,
      height,
    };
    const input = scoringInput(row, screen);
    const hits = findCommercialContamination(input, manifest);
    if (hits.length > 0) throw new Error(`Commercial field in ${row.slug}: ${JSON.stringify(hits)}`);
    fs.writeFileSync(path.join(inputDir, `${row.slug}.json`), `${JSON.stringify(input, null, 2)}\n`);
    screens.push({ row, screen });
  }

  const projection = projectPublicScores(root);
  const bySlug = new Map(projection.devices.map((device) => [device.slug, device]));
  const ihealth = bySlug.get('ihealth-track-kn-550bt');
  const evolv = bySlug.get('omron-evolv-bp7000');
  if (ihealth?.mdrankScore !== 78.3 || ihealth.rankLabel !== '1 of 1') {
    throw new Error(`KN-550BT score changed: ${JSON.stringify(ihealth)}`);
  }
  if (evolv?.eligible !== false || !evolv.failedGates.includes('family-validation-not-exact')) {
    throw new Error('Evolv no longer follows the family withhold.');
  }

  const dossiers = [];
  const faqAdd = {};
  const offerAdd = {};
  for (const { row, screen } of screens) {
    const score = bySlug.get(row.slug);
    if (!score || score.eligible !== false || score.mdrankScore != null || score.scoreStatus !== 'withheld') {
      throw new Error(`Expected withheld score for ${row.slug}: ${JSON.stringify(score)}`);
    }
    if (screen.family && !score.failedGates.includes('family-validation-not-exact')) {
      throw new Error(`${row.slug} family caveat did not withhold`);
    }
    const record = dossier(row, screen, score);
    const serialized = JSON.stringify(record);
    if (/FDA approved/i.test(serialized)) throw new Error(`FDA approved phrase in ${row.slug}`);
    if (serialized.includes('sjpenterpri05-20')) throw new Error(`Affiliate tag stored on dossier object for ${row.slug}`);
    dossiers.push(record);
    faqAdd[row.slug] = faqsFor(row);
    offerAdd[row.slug] = {
      brand: screen.brand,
      asin: row.asin,
      offerNote: `Amazon.com listing ASIN ${row.asin} for ${row.name}. No price or availability is asserted.`,
    };
  }

  fs.writeFileSync(path.join(root, 'web/src/data/publicScores.json'), `${JSON.stringify(projection, null, 2)}\n`);
  fs.writeFileSync(path.join(root, 'web/src/data/heldPublishDossiers.json'), `${JSON.stringify(dossiers, null, 2)}\n`);

  const faqPath = path.join(root, 'web/src/data/dossierFaqs.json');
  const faqs = JSON.parse(fs.readFileSync(faqPath, 'utf8'));
  for (const slug of Object.keys(faqAdd)) delete faqs[slug];
  Object.assign(faqs, faqAdd);
  fs.writeFileSync(faqPath, `${JSON.stringify(faqs, null, 2)}\n`);

  const offerPath = path.join(root, 'web/src/data/publicOffers.json');
  const offers = JSON.parse(fs.readFileSync(offerPath, 'utf8'));
  for (const slug of Object.keys(offerAdd)) delete offers[slug];
  Object.assign(offers, offerAdd);
  fs.writeFileSync(offerPath, `${JSON.stringify(offers, null, 2)}\n`);

  const liveSlugs = ['ihealth-track-kn-550bt', 'omron-evolv-bp7000'];
  writeSitemap([...liveSlugs, ...pack.map((row) => row.slug)]);
  writeLlms(pack);

  const familySlugs = screens.filter((item) => item.screen.family).map((item) => item.row.slug);
  console.log(JSON.stringify({
    dossiers: dossiers.length,
    family: familySlugs.length,
    familySlugs,
    eligible: projection.devices.filter((device) => device.eligible).map((device) => device.slug),
    confidence: [...new Set(dossiers.map((item) => item.evidenceConfidence))],
  }, null, 2));
}

main();
