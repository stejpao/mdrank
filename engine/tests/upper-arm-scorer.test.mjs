import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { validateMethodologyManifest } from '../lib/contracts.mjs';
import { findCommercialContamination } from '../lib/commercial-isolation.mjs';
import { loadMethodology, loadSeedInputs, projectPublicScores, rankCohort, scoreUpperArmHomeBp } from '../lib/scorer.mjs';

const manifest = loadMethodology();
const inputs = loadSeedInputs();
const byId = Object.fromEntries(inputs.map((input) => [input.productId, input]));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

test('approved upper-arm rubric validates and keeps commercial weight at zero', () => {
  assert.equal(validateMethodologyManifest(manifest), true);
  assert.equal(manifest.rubricVersion, 'upper-arm-home-bp-v1.0.0');
  assert.equal(manifest.category, 'upper-arm-home-bp');
  assert.equal(manifest.llmMayChooseNumericRules, false);
  assert.equal(manifest.livePublication.scoresAndRanksEnabled, true);
  assert.equal(manifest.deNovoCountsAsCleared, true);
  assert.equal(manifest.commercialIsolation.weight, 0);
  assert.ok(manifest.commercialIsolation.blockedValues.includes('sjpenterpri05-20'));
  assert.ok(manifest.commercialIsolation.blockedValues.includes('unredacted'));
  const weights = Object.fromEntries(manifest.dimensions.map((dimension) => [dimension.key, dimension.weight]));
  assert.deepEqual(weights, {
    validation: 0.28,
    measurement_performance: 0.18,
    regulatory: 0.12,
    cuff_fit: 0.12,
    power_warranty_ownership: 0.09,
    positioning_technique_resistance: 0.08,
    usability_display: 0.08,
    data_handling: 0.05,
  });
  assert.equal(manifest.publicInputSprinkle.weight, 0.05);
  assert.equal(manifest.publicInputSprinkle.neutralWhenNoCorpus, 0);
  assert.equal(manifest.dimensions.reduce((sum, dimension) => sum + dimension.weight, 0), 1);
  const tieText = JSON.stringify(manifest.tieBreakers);
  assert.doesNotMatch(tieText, /affiliate|asin|merchant|truevital|unredacted|hsa|brand/i);
});

test('seed scoring inputs exclude affiliate, ASIN, merchant, TrueVitals, and Unredacted fields', () => {
  const held = JSON.parse(fs.readFileSync('web/src/data/heldPublishDossiers.json', 'utf8'));
  const slugs = inputs.map((input) => input.slug).sort();
  assert.equal(slugs.length, 60);
  assert.ok(slugs.includes('ihealth-track-kn-550bt'));
  assert.ok(slugs.includes('omron-evolv-bp7000'));
  assert.deepEqual(
    slugs.filter((slug) => slug !== 'ihealth-track-kn-550bt' && slug !== 'omron-evolv-bp7000'),
    held.map((dossier) => dossier.slug).sort(),
  );
  const serialized = JSON.stringify(inputs);
  assert.equal(findCommercialContamination(inputs, manifest).length, 0);
  assert.doesNotMatch(serialized, /sjpenterpri05-20|B01C5QS1T8|B01MRL790Q|truevital|truvital|unredacted/i);
  assert.doesNotMatch(serialized, /"asin"/i);
  assert.doesNotMatch(fs.readFileSync('engine/lib/scorer.mjs', 'utf8'), /amazon\.ts|sjpenterpri05-20/);
  const projection = projectPublicScores();
  const eligible = projection.devices.filter((row) => row.eligible).map((row) => row.slug);
  assert.deepEqual(eligible, ['ihealth-track-kn-550bt']);
  for (const dossier of held) {
    const row = projection.devices.find((item) => item.slug === dossier.slug);
    assert.equal(row.eligible, false, dossier.slug);
    assert.equal(row.mdrankScore, null, dossier.slug);
    assert.equal(row.evidenceConfidence, dossier.evidenceConfidence, dossier.slug);
    assert.equal(dossier.scoreStatus, 'withheld');
    assert.equal(dossier.rankStatus, 'withheld');
  }
});

test('KN-550BT publishes a rubric score and seed rank; Evolv stays unranked', () => {
  const projection = projectPublicScores();
  const ihealth = projection.devices.find((row) => row.slug === 'ihealth-track-kn-550bt');
  const evolv = projection.devices.find((row) => row.slug === 'omron-evolv-bp7000');
  assert.equal(ihealth.eligible, true);
  assert.equal(ihealth.mdrankScore, 78.3);
  assert.equal(ihealth.scoreLabel, '78.3');
  assert.equal(ihealth.rank, 1);
  assert.equal(ihealth.cohortSize, 1);
  assert.equal(ihealth.rankLabel, '1 of 1');
  assert.equal(ihealth.evidenceConfidence, 'High');
  assert.equal(ihealth.evidenceConfidenceNumeric, 0.91);
  assert.equal(ihealth.clearanceLabel, 'FDA-cleared K160014');
  assert.equal(ihealth.publicInputApplied, 0);
  assert.equal(ihealth.scoreStatus, 'published');
  assert.ok(ihealth.dimensionNotes.some((note) => note.key === 'positioning_technique_resistance' && note.state === 'neutral'));
  assert.equal(evolv.eligible, false);
  assert.equal(evolv.mdrankScore, null);
  assert.equal(evolv.rank, null);
  assert.equal(evolv.scoreLabel, 'Withheld');
  assert.equal(evolv.rankLabel, 'Withheld');
  assert.equal(evolv.evidenceConfidence, 'Moderate');
  assert.equal(evolv.evidenceConfidenceNumeric, 0.66);
  assert.ok(evolv.failedGates.includes('identity-resolved'));
  assert.ok(evolv.failedGates.includes('family-validation-not-exact'));
  assert.equal(evolv.clearanceLabel, 'FDA-cleared K162092');
  assert.doesNotMatch(JSON.stringify(projection), /FDA approved/i);
  assert.deepEqual(JSON.parse(fs.readFileSync('web/src/data/publicScores.json', 'utf8')), projection);
});

test('commercial, operator, ASIN, merchant, and Unredacted inputs fail closed', () => {
  const clean = scoreUpperArmHomeBp(byId['ihealth-track-kn-550bt'], manifest);
  const injections = [
    { affiliateEpc: 4.2 },
    { paidPlacement: true },
    { operatorBoost: 1 },
    { asin: 'B01C5QS1T8' },
    { merchant: 'Amazon' },
    { trueVitals: true },
    { truVitalsRelationship: 'owner' },
    { unredacted: true },
    { associatesTag: 'sjpenterpri05-20' },
    { hsaFsaStatus: 'eligible' },
  ];
  for (const extra of injections) {
    const contaminated = scoreUpperArmHomeBp({ ...clone(byId['ihealth-track-kn-550bt']), ...extra }, manifest);
    assert.equal(contaminated.mdrankScore, null, JSON.stringify(extra));
    assert.equal(contaminated.rankEligible, false);
    assert.ok(contaminated.failedGates.includes('no-commercial-fields-present'));
    assert.ok(contaminated.mdrankScore == null || contaminated.mdrankScore <= clean.mdrankScore);
  }
  const benign = scoreUpperArmHomeBp({ ...clone(byId['ihealth-track-kn-550bt']), reviewerNote: 'packet checked' }, manifest);
  assert.equal(benign.mdrankScore, clean.mdrankScore);
  const privateRecord = JSON.parse(fs.readFileSync('data/evidence/records/omron-evolv-bp7000.json', 'utf8'));
  const leaked = scoreUpperArmHomeBp(privateRecord, manifest);
  assert.equal(leaked.mdrankScore, null);
  assert.ok(leaked.failedGates.includes('no-commercial-fields-present'));
});

test('De Novo DEN clearance counts the same as a 510(k) K number', () => {
  const denovo = clone(byId['ihealth-track-kn-550bt']);
  denovo.productId = 'denovo-fixture';
  denovo.slug = 'denovo-fixture';
  denovo.regulatory.clearanceType = 'fda-de-novo';
  denovo.regulatory.clearanceNumber = 'DEN180001';
  const cleared = scoreUpperArmHomeBp(byId['ihealth-track-kn-550bt'], manifest);
  const novo = scoreUpperArmHomeBp(denovo, manifest);
  assert.equal(novo.eligible, true);
  assert.equal(novo.clearanceLabel, 'FDA-cleared DEN180001');
  assert.equal(
    novo.dimensionBreakdown.find((dimension) => dimension.key === 'regulatory').subscore,
    cleared.dimensionBreakdown.find((dimension) => dimension.key === 'regulatory').subscore,
  );
  assert.doesNotMatch(JSON.stringify(novo), /FDA approved/i);
});

test('family-only validation cannot be upgraded, and a new URL is not scored for publication', () => {
  const upgraded = clone(byId['omron-evolv-bp7000']);
  upgraded.validation.scope = 'exact-model';
  upgraded.validation.namesExactModel = true;
  upgraded.validation.namedProtocolPass = true;
  const presented = scoreUpperArmHomeBp(upgraded, manifest);
  assert.equal(presented.mdrankScore, null);
  assert.ok(presented.failedGates.includes('family-validation-presented-as-exact'));
  const unpublished = clone(byId['ihealth-track-kn-550bt']);
  unpublished.publication = { alreadyPublic: false, humanPublish: false, url: '/devices/new-monitor' };
  const held = scoreUpperArmHomeBp(unpublished, manifest);
  assert.equal(held.mdrankScore, null);
  assert.ok(held.failedGates.includes('human-publish-for-new-url'));
});

test('wrist devices, stale evidence, recalls, and disabled live scores withhold', () => {
  const wrist = clone(byId['ihealth-track-kn-550bt']);
  wrist.formFactor = 'wrist';
  wrist.measurement.method = 'wrist';
  const rejected = scoreUpperArmHomeBp(wrist, manifest);
  assert.equal(rejected.inCohort, false);
  assert.ok(rejected.failedGates.includes('rejected-out-of-category'));
  assert.equal(rankCohort([rejected], manifest)[0].rank, null);
  const stale = clone(byId['ihealth-track-kn-550bt']);
  stale.evidenceDates.criticalRetrievedAt = '2020-01-01';
  assert.ok(scoreUpperArmHomeBp(stale, manifest).failedGates.includes('stale-critical-source-beyond-freshness'));
  const recall = clone(byId['ihealth-track-kn-550bt']);
  recall.recall.activeIndexedMatch = true;
  assert.equal(scoreUpperArmHomeBp(recall, manifest).mdrankScore, null);
  const paused = clone(manifest);
  paused.livePublication = { ...paused.livePublication, scoresAndRanksEnabled: false };
  assert.equal(scoreUpperArmHomeBp(byId['ihealth-track-kn-550bt'], paused).mdrankScore, null);
});

test('public-input sprinkle stays neutral without a corpus and cannot flip a near peer', () => {
  const withCorpus = clone(byId['ihealth-track-kn-550bt']);
  withCorpus.productId = 'bbbb-monitor';
  withCorpus.slug = 'bbbb-monitor';
  withCorpus.publicExperience = {
    licensedExactModelCorpus: true,
    exactModelMatch: true,
    clinicalAccuracyEvidence: false,
    themeDirection: 'positive',
  };
  const peer = clone(byId['ihealth-track-kn-550bt']);
  peer.productId = 'aaaa-monitor';
  peer.slug = 'aaaa-monitor';
  const ranked = rankCohort([
    scoreUpperArmHomeBp(withCorpus, manifest),
    scoreUpperArmHomeBp(peer, manifest),
  ], manifest).sort((a, b) => a.rank - b.rank);
  assert.equal(ranked[0].productId, 'aaaa-monitor');
  assert.equal(ranked[0].mdrankScore, ranked[1].mdrankScore);
  assert.equal(ranked[1].sprinkleApplied, 0);
  assert.equal(ranked[1].publicInputGuard, true);

  const clinical = clone(withCorpus);
  clinical.publicExperience.clinicalAccuracyEvidence = true;
  assert.equal(scoreUpperArmHomeBp(clinical, manifest).sprinkleApplied, 0);

  const distant = clone(byId['ihealth-track-kn-550bt']);
  distant.productId = 'cccc-monitor';
  distant.validation = { scope: 'none', namesExactModel: false, peerReviewed: false, namedProtocolPass: false, fundingIndependence: 'not-applicable' };
  const strong = scoreUpperArmHomeBp(withCorpus, manifest);
  const weak = scoreUpperArmHomeBp(distant, manifest);
  const separated = rankCohort([strong, weak], manifest);
  const strongRow = separated.find((row) => row.productId === 'bbbb-monitor');
  assert.equal(strongRow.sprinkleApplied, 0.05);
  assert.equal(strongRow.rank, 1);
  assert.ok(strongRow.mdrankScore > weak.mdrankScore);
});
