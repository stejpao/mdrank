import fs from 'node:fs';
import path from 'node:path';
import { validateMethodologyManifest } from './contracts.mjs';
import { findCommercialContamination } from './commercial-isolation.mjs';

const DAY_MS = 86400000;
const CLEARANCE_PATTERN_FALLBACK = /^(K|DEN)\d{6}$/;

function roundTo(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function getPath(obj, dotted) {
  return String(dotted).split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function clearancePattern(manifest) {
  const source = manifest.clearanceNumberPattern;
  if (typeof source !== 'string' || source.length === 0) return CLEARANCE_PATTERN_FALLBACK;
  return new RegExp(source);
}

function cuffSpanCm(ranges) {
  if (!Array.isArray(ranges) || ranges.length === 0) return null;
  const mins = [];
  const maxs = [];
  for (const range of ranges) {
    const min = Number(range?.min);
    const max = Number(range?.max);
    if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return null;
    mins.push(min);
    maxs.push(max);
  }
  return Math.max(...maxs) - Math.min(...mins);
}

function ageDays(asOf, retrievedAt) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf ?? '') || !/^\d{4}-\d{2}-\d{2}$/.test(retrievedAt ?? '')) return null;
  return Math.round((Date.parse(`${asOf}T00:00:00Z`) - Date.parse(`${retrievedAt}T00:00:00Z`)) / DAY_MS);
}

function factorState(factor, input) {
  const value = getPath(input, factor.path);
  if (factor.kind === 'clearance-number') {
    if (value == null || value === '') return 'missing';
    return typeof value === 'string' && new RegExp(factor.pattern).test(value) ? 'present' : 'absent';
  }
  if (factor.kind === 'attributed-band') {
    if (typeof value !== 'string' || value.trim() === '') return 'missing';
    return /\d/.test(value) ? 'partial' : 'missing';
  }
  if (factor.kind === 'nonempty-string') {
    return typeof value === 'string' && value.trim() ? 'present' : 'missing';
  }
  if (factor.kind === 'boolean') {
    if (value === true) {
      if (factor.requiresEvidenceIds) {
        const ids = getPath(input, factor.requiresEvidenceIds);
        if (!Array.isArray(ids) || ids.length === 0) return 'missing';
      }
      return 'present';
    }
    if (value === false) return 'absent';
    return 'missing';
  }
  if (factor.kind === 'enum') {
    if (value == null || value === '') return 'missing';
    if (factor.presentValues?.includes(value)) return 'present';
    if (factor.partialValues?.includes(value)) return 'partial';
    if (factor.unknownValues?.includes(value)) return 'unknown';
    if (factor.absentValues?.includes(value)) return 'absent';
    return 'missing';
  }
  if (factor.kind === 'range-present') {
    return cuffSpanCm(value) == null ? 'missing' : 'present';
  }
  if (factor.kind === 'cuff-span') return 'span';
  throw new Error(`Unknown factor kind ${factor.kind}.`);
}

function pointsFor(factor, state, neutral) {
  if (state === 'missing') return neutral;
  if (state === 'present') return Number(factor.presentScore);
  if (state === 'partial') return Number(factor.partialScore);
  if (state === 'unknown') return Number(factor.unknownScore ?? neutral);
  if (state === 'absent') return Number(factor.absentScore);
  throw new Error(`Unknown factor state ${state}.`);
}

function dimensionNote(dimension, states, subscore, input) {
  const allMissing = states.every((state) => state === 'missing');
  if (dimension.key === 'regulatory') {
    const label = clearanceLabel(input);
    return {
      state: allMissing ? 'neutral' : subscore >= 0.8 ? 'documented' : 'partial',
      note: label
        ? `${dimension.label}: ${label}. Clearance is not accuracy proof.`
        : `${dimension.label}: clearance identifier is missing, so this factor stays neutral.`,
    };
  }
  if (allMissing) {
    return {
      state: 'neutral',
      note: `${dimension.label}: not documented in the evidence packet, so this dimension stays at neutral.`,
    };
  }
  if (subscore + 1e-9 >= 0.8) {
    return { state: 'documented', note: `${dimension.label}: documented exact-model evidence.` };
  }
  return {
    state: 'partial',
    note: `${dimension.label}: partial. Attributed specifications are not a full result, and missing facts stay at neutral.`,
  };
}

function scoreDimension(dimension, input, neutral) {
  const states = [];
  const pointList = [];
  for (const factor of dimension.factors) {
    if (factor.kind === 'cuff-span') {
      const span = cuffSpanCm(getPath(input, factor.path));
      if (span == null) {
        states.push('missing');
        pointList.push(neutral);
        continue;
      }
      const band = [...factor.bands].sort((a, b) => b.minSpanCm - a.minSpanCm).find((item) => span >= item.minSpanCm);
      states.push(band ? 'present' : 'missing');
      pointList.push(band ? Number(band.score) : neutral);
      continue;
    }
    const state = factorState(factor, input);
    states.push(state);
    pointList.push(pointsFor(factor, state, neutral));
  }
  const subscore = pointList.reduce((sum, value) => sum + value, 0) / pointList.length;
  const explained = dimensionNote(dimension, states, subscore, input);
  return {
    key: dimension.key,
    label: dimension.label,
    weight: dimension.weight,
    subscore: roundTo(subscore, 4),
    state: explained.state,
    note: explained.note,
  };
}

export function clearanceLabel(input) {
  const type = input?.regulatory?.clearanceType;
  const number = input?.regulatory?.clearanceNumber;
  if ((type === 'fda-510k' || type === 'fda-de-novo') && typeof number === 'string') return `FDA-cleared ${number}`;
  return null;
}

function sourceIds(input) {
  return new Set((input.primarySources ?? []).map((source) => source.id).filter(Boolean));
}

function hasClass(input, sourceClass) {
  return (input.primarySources ?? []).some((source) => source.sourceClass === sourceClass);
}

function validationPosture(input) {
  const scope = input?.validation?.scope;
  if (scope === 'exact-model' && input.validation.peerReviewed === true && input.validation.namedProtocolPass === true) {
    if (input.validation.fundingIndependence === 'independent') return 'exact-independent';
    if (input.validation.fundingIndependence === 'manufacturer-funded') return 'exact-manufacturer-funded';
    if (input.validation.fundingIndependence === 'unknown') return 'exact-funding-unknown';
    return 'exact-funding-unknown';
  }
  if (scope === 'family-only') return 'family-only';
  if (scope === 'none') return 'none';
  return 'missing';
}

export function computeEvidenceConfidence(input, manifest) {
  const calc = manifest.confidenceCalculation;
  const neutral = Number(manifest.scoreShrinkage.neutral);
  const checks = [
    typeof input?.regulatory?.clearanceNumber === 'string' && clearancePattern(manifest).test(input.regulatory.clearanceNumber),
    hasClass(input, 'A'),
    hasClass(input, 'C'),
    cuffSpanCm(input?.fit?.rangesCm) != null,
    input?.measurement?.method === 'oscillometric',
    typeof input?.measurement?.pressureAccuracyBand === 'string' && /\d/.test(input.measurement.pressureAccuracyBand),
    validationPosture(input).startsWith('exact-'),
    input?.usability?.displayDocumented === true || input?.dataHandling?.memoryDocumented === true,
    input?.ownership?.powerDocumented === true,
  ];
  const completeness = checks.filter(Boolean).length / checks.length;
  const independence = Number(calc.independenceScores[validationPosture(input)] ?? neutral);
  const days = ageDays(input?.evidenceDates?.asOf, input?.evidenceDates?.criticalRetrievedAt);
  const maxAge = Number(manifest.freshnessRules.find((rule) => rule.id === 'critical-class-a-c')?.maxAgeDays ?? 540);
  const currency = days == null ? neutral : days >= 0 && days <= maxAge ? 1 : 0.4;
  let consistencyKey = 'unresolved';
  if (Array.isArray(input?.conflicts) && input.conflicts.some((item) => item?.material === true)) consistencyKey = 'conflict';
  else if (input?.identity?.status === 'resolved' && input?.validation?.scope !== 'family-only') consistencyKey = 'resolved';
  else if (input?.identity?.status === 'resolved-with-model-family-caveat' || input?.validation?.scope === 'family-only') consistencyKey = 'resolved-with-model-family-caveat';
  else if (input?.identity?.status === 'resolved') consistencyKey = 'resolved';
  const consistency = Number(calc.consistencyScores[consistencyKey] ?? 0);
  const numeric = clamp01(
    calc.weights.completeness * completeness +
    calc.weights.independence * independence +
    calc.weights.currency * currency +
    calc.weights.consistency * consistency,
  );
  const rounded = roundTo(numeric, 2);
  const ordinal = [...calc.ordinal].sort((a, b) => b.minimum - a.minimum).find((item) => rounded + 1e-9 >= item.minimum);
  return { numeric: rounded, level: ordinal?.level ?? 'Insufficient', separateFromScore: true };
}

function failedGates(input, manifest) {
  const failed = [];
  const identity = input?.identity?.status;
  const scope = input?.validation?.scope;
  const formFactor = input?.formFactor;
  const method = input?.measurement?.method;
  if (identity !== 'resolved') failed.push('identity-resolved');
  if (scope === 'family-only' || identity === 'resolved-with-model-family-caveat') failed.push('family-validation-not-exact');
  if (scope === 'exact-model' && identity === 'resolved-with-model-family-caveat') failed.push('family-validation-presented-as-exact');
  if (formFactor === 'wrist' || formFactor === 'optical' || formFactor === 'cuffless' || method === 'wrist' || method === 'optical' || method === 'cuffless') {
    failed.push('rejected-out-of-category');
  } else if (formFactor !== 'upper-arm' || method !== 'oscillometric') {
    failed.push('category-upper-arm-home-bp');
  }
  if (input?.market !== 'US') failed.push('market-US-seed');
  if (typeof input?.testingStatus !== 'string' || input.testingStatus.trim() === '') failed.push('testing-status-declared');
  if (input?.testingLanguage?.handsOnClaimWithoutProtocol === true) failed.push('testing-language-violation');
  if (!hasClass(input, 'A') && !hasClass(input, 'C')) failed.push('minimum-primary-sources');
  const ids = sourceIds(input);
  const claims = input?.materialClaims;
  if (!Array.isArray(claims) || claims.some((claim) => !Array.isArray(claim.evidenceIds) || claim.evidenceIds.length === 0 || claim.evidenceIds.some((id) => !ids.has(id)))) {
    failed.push('material-claims-traceable');
  }
  const disclosure = input?.disclosureStatus;
  if (disclosure !== 'independent-editorial' && disclosure !== 'approved') failed.push('disclosure-status-ok-for-page-type');
  if (input?.publication?.alreadyPublic !== true && input?.publication?.humanPublish !== true) failed.push('human-publish-for-new-url');
  const clearanceType = input?.regulatory?.clearanceType;
  const clearanceNumber = input?.regulatory?.clearanceNumber;
  const cleared = (clearanceType === 'fda-510k' || clearanceType === 'fda-de-novo') && typeof clearanceNumber === 'string' && clearancePattern(manifest).test(clearanceNumber);
  if (!cleared) failed.push('regulatory-clearance-required');
  if (input?.recall?.activeIndexedMatch === true) failed.push('active-indexed-recall-unaddressed');
  if (Array.isArray(input?.conflicts) && input.conflicts.some((item) => item?.material === true)) failed.push('material-source-conflict');
  const days = ageDays(input?.evidenceDates?.asOf, input?.evidenceDates?.criticalRetrievedAt);
  const maxAge = Number(manifest.freshnessRules.find((rule) => rule.id === 'critical-class-a-c')?.maxAgeDays ?? 540);
  if (days == null || days < 0 || days > maxAge) failed.push('stale-critical-source-beyond-freshness');
  if (manifest.livePublication?.scoresAndRanksEnabled !== true) failed.push('live-scores-not-enabled');
  return [...new Set(failed)];
}

function sprinkleDelta(input, manifest) {
  const cap = Number(manifest.publicInputSprinkle?.maxAbsoluteContribution ?? 0);
  const experience = input?.publicExperience;
  if (!experience || experience.licensedExactModelCorpus !== true) return 0;
  if (experience.exactModelMatch !== true || experience.clinicalAccuracyEvidence === true) return 0;
  if (experience.themeDirection === 'positive') return cap;
  if (experience.themeDirection === 'negative') return -cap;
  return 0;
}

function withheld(input, manifest, gates, extra = {}) {
  const confidence = extra.confidence ?? null;
  return {
    productId: input?.productId ?? null,
    slug: input?.slug ?? input?.productId ?? null,
    eligible: false,
    rankEligible: false,
    inCohort: !gates.includes('rejected-out-of-category'),
    failedGates: gates,
    penaltiesApplied: gates.filter((gate) => manifest.penalties.some((penalty) => penalty.id === gate)),
    mdrankScore: null,
    scoreUnit: null,
    baseUnit: null,
    sprinkleDelta: 0,
    sprinkleApplied: 0,
    publicInputGuard: false,
    evidenceConfidence: confidence,
    dimensionBreakdown: [],
    clearanceLabel: clearanceLabel(input),
    validationScope: input?.validation?.scope ?? null,
    criticalRetrievedAt: input?.evidenceDates?.criticalRetrievedAt ?? null,
    cuffSpanCm: cuffSpanCm(input?.fit?.rangesCm),
    rubricVersion: manifest.rubricVersion,
    ...extra.rest,
  };
}

export function scoreUpperArmHomeBp(input, manifest) {
  validateMethodologyManifest(manifest);
  if (manifest.llmMayChooseNumericRules !== false) throw new Error('llmMayChooseNumericRules must be false.');
  const contamination = findCommercialContamination(input, manifest);
  if (contamination.length > 0) {
    return withheld(input, manifest, ['no-commercial-fields-present'], {
      confidence: null,
      rest: { commercialHits: contamination.map((hit) => hit.path) },
    });
  }
  const confidence = computeEvidenceConfidence(input, manifest);
  const gates = failedGates(input, manifest);
  if (gates.length > 0) return withheld(input, manifest, gates, { confidence });

  const neutral = Number(manifest.scoreShrinkage.neutral);
  const dimensionBreakdown = manifest.dimensions.map((dimension) => scoreDimension(dimension, input, neutral));
  const baseUnit = dimensionBreakdown.reduce((sum, dimension) => sum + dimension.weight * dimension.subscore, 0);
  const delta = sprinkleDelta(input, manifest);
  return {
    productId: input.productId,
    slug: input.slug ?? input.productId,
    eligible: true,
    rankEligible: true,
    inCohort: true,
    failedGates: [],
    penaltiesApplied: [],
    mdrankScore: roundTo(clamp01(baseUnit + delta) * 100, 1),
    scoreUnit: clamp01(baseUnit + delta),
    baseUnit,
    sprinkleDelta: delta,
    sprinkleApplied: delta,
    publicInputGuard: false,
    evidenceConfidence: confidence,
    dimensionBreakdown,
    clearanceLabel: clearanceLabel(input),
    validationScope: input.validation.scope,
    criticalRetrievedAt: input.evidenceDates.criticalRetrievedAt,
    cuffSpanCm: cuffSpanCm(input.fit.rangesCm),
    rubricVersion: manifest.rubricVersion,
    commercialHits: [],
  };
}

function tieEpsilon(manifest) {
  return Number(manifest.stabilityRules.find((rule) => rule.id === 'minimum-score-delta')?.minimumDeltaOnUnitInterval ?? 0.005);
}

function validationRank(scope) {
  if (scope === 'exact-model') return 2;
  if (scope === 'none') return 1;
  return 0;
}

export function compareScoredRows(a, b, manifest) {
  const epsilon = tieEpsilon(manifest);
  if (Math.abs(a.scoreUnit - b.scoreUnit) > epsilon) return b.scoreUnit - a.scoreUnit;
  const confidenceGap = (b.evidenceConfidence?.numeric ?? 0) - (a.evidenceConfidence?.numeric ?? 0);
  if (confidenceGap !== 0) return confidenceGap;
  const postureGap = validationRank(b.validationScope) - validationRank(a.validationScope);
  if (postureGap !== 0) return postureGap;
  const dateGap = String(b.criticalRetrievedAt ?? '').localeCompare(String(a.criticalRetrievedAt ?? ''));
  if (dateGap !== 0) return dateGap;
  const spanGap = (b.cuffSpanCm ?? -1) - (a.cuffSpanCm ?? -1);
  if (spanGap !== 0) return spanGap;
  return String(a.productId).localeCompare(String(b.productId));
}

function applySprinkleGuard(rows, manifest) {
  const guard = manifest.publicInputSprinkle?.top5FlipGuard ?? { peerGap: 0.05, topN: 5 };
  const next = rows.map((row) => ({ ...row }));
  const order = (field) => [...next].sort((a, b) => (b[field] - a[field]) || String(a.productId).localeCompare(String(b.productId)));
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < next.length; i += 1) {
      for (let j = i + 1; j < next.length; j += 1) {
        const a = next[i];
        const b = next[j];
        if (Math.abs(a.baseUnit - b.baseUnit) > guard.peerGap) continue;
        const baseWinner = Math.abs(a.baseUnit - b.baseUnit) <= tieEpsilon(manifest)
          ? (String(a.productId) < String(b.productId) ? a : b)
          : (a.baseUnit > b.baseUnit ? a : b);
        const scoreWinner = Math.abs(a.scoreUnit - b.scoreUnit) <= tieEpsilon(manifest)
          ? (String(a.productId) < String(b.productId) ? a : b)
          : (a.scoreUnit > b.scoreUnit ? a : b);
        if (baseWinner.productId === scoreWinner.productId) continue;
        const baseOrder = order('baseUnit');
        const scoreOrder = order('scoreUnit');
        const inTop = (list, id) => list.findIndex((row) => row.productId === id) < guard.topN;
        if (![a, b].some((row) => inTop(baseOrder, row.productId) || inTop(scoreOrder, row.productId))) continue;
        for (const row of [a, b]) {
          if (row.sprinkleApplied !== 0) {
            row.sprinkleApplied = 0;
            row.scoreUnit = row.baseUnit;
            row.publicInputGuard = true;
            row.mdrankScore = roundTo(clamp01(row.baseUnit) * 100, 1);
            changed = true;
          }
        }
      }
    }
  }
  return next;
}

export function rankCohort(results, manifest) {
  const eligible = results.filter((row) => row.rankEligible && row.mdrankScore != null && row.inCohort !== false);
  const guarded = applySprinkleGuard(eligible, manifest);
  guarded.sort((a, b) => compareScoredRows(a, b, manifest));
  const ranked = guarded.map((row, index) => ({
    ...row,
    rank: index + 1,
    cohortSize: guarded.length,
  }));
  const rankedIds = new Set(ranked.map((row) => row.productId));
  const withheldRows = results.filter((row) => !rankedIds.has(row.productId)).map((row) => ({
    ...row,
    rank: null,
    cohortSize: ranked.length,
  }));
  return [...ranked, ...withheldRows];
}

export function loadMethodology(root = process.cwd()) {
  const file = path.join(root, 'data/methodology/upper-arm-home-bp-v1.0.0.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function loadSeedInputs(root = process.cwd()) {
  const directory = path.join(root, 'data/evidence/scoring-inputs');
  return fs.readdirSync(directory)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8')));
}

export function scoreSeedCohort(root = process.cwd()) {
  const manifest = loadMethodology(root);
  const inputs = loadSeedInputs(root);
  const scored = inputs.map((input) => scoreUpperArmHomeBp(input, manifest));
  return { manifest, results: rankCohort(scored, manifest) };
}

function scoreLabel(row) {
  return row.mdrankScore == null ? 'Withheld' : row.mdrankScore.toFixed(1);
}

function rankLabel(row) {
  if (row.rank == null) return 'Withheld';
  return `${row.rank} of ${row.cohortSize}`;
}

function rankDetail(row) {
  if (row.rank == null) {
    if (row.failedGates?.includes('family-validation-not-exact')) {
      return 'Withheld. Family-level validation is not exact-model validation, so this dossier stays unranked.';
    }
    return 'Withheld. Exact-model evidence is incomplete for a score under this rubric.';
  }
  return `${row.rank} of ${row.cohortSize} scored-eligible public dossiers under ${row.rubricVersion}. This is not a market-wide best list.`;
}

export function projectPublicScores(root = process.cwd()) {
  const { manifest, results } = scoreSeedCohort(root);
  return {
    rubricVersion: manifest.rubricVersion,
    category: manifest.category,
    scoreScale: '0-100',
    liveScoresEnabled: manifest.livePublication.scoresAndRanksEnabled === true,
    devices: results.map((row) => ({
      slug: row.slug,
      productId: row.productId,
      eligible: row.eligible,
      scoreStatus: row.eligible ? 'published' : 'withheld',
      rankStatus: row.rank == null ? 'withheld' : 'published',
      mdrankScore: row.mdrankScore,
      scoreLabel: scoreLabel(row),
      rank: row.rank,
      cohortSize: row.cohortSize,
      rankLabel: rankLabel(row),
      rankDetail: rankDetail(row),
      evidenceConfidence: row.evidenceConfidence?.level ?? null,
      evidenceConfidenceNumeric: row.evidenceConfidence?.numeric ?? null,
      clearanceLabel: row.clearanceLabel,
      failedGates: row.failedGates,
      rubricVersion: row.rubricVersion,
      publicInputApplied: row.sprinkleApplied ?? 0,
      dimensionNotes: (row.dimensionBreakdown ?? []).map((dimension) => ({
        key: dimension.key,
        label: dimension.label,
        state: dimension.state,
        note: dimension.note,
      })),
    })),
  };
}
