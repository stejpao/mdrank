const EXACT_MODEL_SCHEMA_VERSION = '1.0.0';
const METHODOLOGY_SCHEMA_VERSION = '1.0.0';
const EXPERIENCE_SCHEMA_VERSION = '1.0.0';

const REQUIRED_PRODUCT_FIELDS = [
  'id', 'brand', 'exactModel', 'market', 'manufacturer', 'testingStatus',
  'hsaFsaStatus', 'currentAvailability', 'retrievedAt', 'verifiedAt',
];
const REQUIRED_SECTIONS = [
  'identifiers', 'regulatory', 'validation', 'documentation', 'measurement',
  'fit', 'accessoriesAndConsumables', 'connectivityAndPrivacy', 'power',
  'warrantyAndSupport', 'recallAndSafety', 'conflicts', 'images',
];
const DISPOSITIONS = new Set(['accepted', 'pending', 'rejected', 'identity-review', 'ambiguous', 'unavailable', 'insufficient-evidence']);
const RIGHTS = new Set(['owned', 'original-product-photography', 'manufacturer-authorized', 'properly-licensed', 'api-feed-permitted', 'generated', 'public-domain', 'none']);
const ACQUISITION = new Set(['official-api', 'licensed-feed', 'authorized-export', 'public-document', 'public-page-manual-review', 'public-dataset']);

function required(value, label) {
  if (value === undefined || value === null || value === '') throw new Error(`${label} is required.`);
}
function validDate(value, label) {
  required(value, label);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) throw new Error(`${label} must be YYYY-MM-DD.`);
}

export function validateExactModelContract(record) {
  if (record?.schemaVersion !== EXACT_MODEL_SCHEMA_VERSION) throw new Error(`Exact-model schemaVersion must be ${EXACT_MODEL_SCHEMA_VERSION}.`);
  if (!DISPOSITIONS.has(record.disposition)) throw new Error('Exact-model disposition is invalid.');
  for (const field of REQUIRED_PRODUCT_FIELDS) required(record.product?.[field], `product.${field}`);
  for (const section of REQUIRED_SECTIONS) required(record[section], section);
  validDate(record.product.retrievedAt, 'product.retrievedAt');
  validDate(record.product.verifiedAt, 'product.verifiedAt');
  if (!Array.isArray(record.product.modelAliases)) throw new Error('product.modelAliases must be an array.');
  if (!Array.isArray(record.evidence) || record.evidence.length === 0) throw new Error('At least one evidence item is required.');
  const ids = new Set();
  for (const evidence of record.evidence) {
    required(evidence.id, 'evidence.id'); required(evidence.url, `evidence ${evidence.id}.url`);
    if (ids.has(evidence.id)) throw new Error(`Duplicate evidence id ${evidence.id}.`);
    ids.add(evidence.id);
    try { new URL(evidence.url); } catch { throw new Error(`Evidence ${evidence.id} has an invalid URL.`); }
    validDate(evidence.retrievedAt, `evidence ${evidence.id}.retrievedAt`);
    if (!ACQUISITION.has(evidence.acquisitionMethod)) throw new Error(`Evidence ${evidence.id} has an unsupported acquisition method.`);
    required(evidence.reusePermission, `evidence ${evidence.id}.reusePermission`);
  }
  if (!Array.isArray(record.claims)) throw new Error('claims must be an array.');
  for (const claim of record.claims) {
    required(claim.id, 'claim.id'); required(claim.text, `claim ${claim.id}.text`);
    if (!Array.isArray(claim.evidenceIds) || claim.evidenceIds.length === 0) throw new Error(`Claim ${claim.id} requires evidenceIds.`);
    for (const id of claim.evidenceIds) if (!ids.has(id)) throw new Error(`Claim ${claim.id} references unknown evidence ${id}.`);
  }
  if (!Array.isArray(record.images)) throw new Error('images must be an array.');
  for (const image of record.images) if (!RIGHTS.has(image.rightsStatus)) throw new Error(`Image ${image.id ?? 'unknown'} has invalid rightsStatus.`);
  if (record.identity?.status !== 'resolved' && record.disposition === 'accepted') throw new Error('An accepted product requires resolved exact-model identity.');
  return true;
}

export function validateMethodologyManifest(manifest) {
  if (manifest?.schemaVersion !== METHODOLOGY_SCHEMA_VERSION) throw new Error(`Methodology schemaVersion must be ${METHODOLOGY_SCHEMA_VERSION}.`);
  required(manifest.category, 'category'); required(manifest.rubricVersion, 'rubricVersion');
  for (const key of ['eligibilityGates', 'dimensions', 'penalties', 'tieBreakers', 'stabilityRules', 'manualReviewTriggers', 'freshnessRules']) {
    if (!Array.isArray(manifest[key])) throw new Error(`${key} must be an array controlled by the methodology manifest.`);
  }
  if (manifest.dimensions.length === 0) throw new Error('dimensions must not be empty.');
  const weight = manifest.dimensions.reduce((sum, d) => sum + Number(d.weight), 0);
  if (!Number.isFinite(weight) || Math.abs(weight - 1) > 1e-9) throw new Error('Methodology dimension weights must total 1.');
  required(manifest.confidenceCalculation, 'confidenceCalculation');
  required(manifest.scoreShrinkage, 'scoreShrinkage');
  if (manifest.llmMayChooseNumericRules !== false) throw new Error('llmMayChooseNumericRules must be false.');
  return true;
}

export function validatePublicExperienceContract(record) {
  if (record?.schemaVersion !== EXPERIENCE_SCHEMA_VERSION) throw new Error(`Public-experience schemaVersion must be ${EXPERIENCE_SCHEMA_VERSION}.`);
  required(record.productId, 'productId');
  if (!Array.isArray(record.items)) throw new Error('items must be an array.');
  for (const item of record.items) {
    required(item.id, 'experience item id');
    if (item.exactModelMatch !== true) throw new Error(`Experience item ${item.id} is not an exact-model match.`);
    if (!ACQUISITION.has(item.acquisitionMethod)) throw new Error(`Experience item ${item.id} has an unsupported acquisition method.`);
    if (item.clinicalAccuracyEvidence === true) throw new Error('Public experience cannot be clinical accuracy evidence.');
    validDate(item.retrievedAt, `experience item ${item.id}.retrievedAt`);
  }
  return true;
}

export const contractVersions = Object.freeze({ exactModel: EXACT_MODEL_SCHEMA_VERSION, methodology: METHODOLOGY_SCHEMA_VERSION, publicExperience: EXPERIENCE_SCHEMA_VERSION });
