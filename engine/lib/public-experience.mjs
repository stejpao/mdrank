import { validatePublicExperienceContract } from './contracts.mjs';

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const round = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

/**
 * Deterministic corpus confidence. Public experience describes ownership themes;
 * it never supplies measurement, clinical, regulatory, or safety evidence.
 */
export function scorePublicExperienceConfidence(record) {
  validatePublicExperienceContract(record);
  if (record.items.length === 0) return { confidence: 0, level: 'insufficient', usableItems: 0 };
  const uniqueItems = record.items.filter((item) => item.duplicateOf == null);
  const uniqueSources = new Set(uniqueItems.map((item) => item.sourceType)).size;
  const verifiedShare = uniqueItems.filter((item) => item.verifiedPurchase === true).length / uniqueItems.length;
  const recentShare = uniqueItems.filter((item) => item.ageDays <= 730).length / uniqueItems.length;
  const durationShare = uniqueItems.filter((item) => Number(item.ownershipDays) >= 30).length / uniqueItems.length;
  const suspiciousShare = uniqueItems.filter((item) => item.manipulationRisk === 'high').length / uniqueItems.length;
  const sampleFactor = Math.min(1, Math.log10(uniqueItems.length + 1) / 2);
  const sourceFactor = Math.min(1, uniqueSources / 4);
  const score = clamp01(
    0.30 * sampleFactor +
    0.20 * sourceFactor +
    0.15 * verifiedShare +
    0.15 * recentShare +
    0.10 * durationShare +
    0.10 * Number(record.themeAgreement ?? 0) -
    0.20 * suspiciousShare,
  );
  const confidence = round(score);
  const level = confidence >= 0.75 ? 'high' : confidence >= 0.5 ? 'moderate' : confidence >= 0.3 ? 'low' : 'insufficient';
  return { confidence, level, usableItems: uniqueItems.length, uniqueSources, limitations: record.limitations ?? [] };
}

export function buildPersonaFit({ verifiedProductFacts, recurringThemes, confidence }) {
  if (!Array.isArray(verifiedProductFacts) || !Array.isArray(recurringThemes)) throw new Error('Persona fit requires verifiedProductFacts and recurringThemes arrays.');
  if (!confidence || confidence.level === 'insufficient') return { status: 'insufficient', bestFit: [], poorFit: [], confidence: 'insufficient' };
  const bestFit = recurringThemes.filter((t) => t.direction === 'positive' && t.personaUse).map((t) => t.personaUse);
  const poorFit = recurringThemes.filter((t) => t.direction === 'negative' && t.personaAvoid).map((t) => t.personaAvoid);
  return { status: bestFit.length || poorFit.length ? 'qualified' : 'insufficient', bestFit: [...new Set(bestFit)], poorFit: [...new Set(poorFit)], confidence: confidence.level, basis: 'verified product facts plus recurring permitted public-experience themes; not medical advice or clinical evidence' };
}
