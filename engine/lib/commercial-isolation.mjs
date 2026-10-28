/**
 * Commercial and operator fields are unavailable to the scorer.
 * Amazon Associates tag sjpenterpri05-20, ASIN, merchant, and Unredacted
 * records are blocked here. Weight is zero because contaminated inputs
 * produce no score.
 */

const DEFAULT_KEY_FRAGMENTS = [
  'affiliate',
  'asin',
  'merchant',
  'paid',
  'sponsor',
  'margin',
  'inventory',
  'conversion',
  'epc',
  'clickthrough',
  'operator',
  'truevital',
  'truvital',
  'truehealth',
  'authenticreview',
  'unredacted',
  'associates',
  'amazontag',
  'hsafsa',
  'hsa',
  'fsa',
  'advertorial',
  'commission',
  'reservedrank',
  'brandboost',
  'brandfavor',
];

const DEFAULT_BLOCKED_VALUES = ['sjpenterpri05-20', 'unredacted'];

function normalizeKey(key) {
  return String(key).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function fragmentsFrom(manifest) {
  const listed = manifest?.commercialIsolation?.blockedKeyFragments;
  return (Array.isArray(listed) && listed.length > 0 ? listed : DEFAULT_KEY_FRAGMENTS).map((item) => normalizeKey(item));
}

function blockedValuesFrom(manifest) {
  const listed = manifest?.commercialIsolation?.blockedValues;
  return (Array.isArray(listed) && listed.length > 0 ? listed : DEFAULT_BLOCKED_VALUES).map((item) => String(item).toLowerCase());
}

export function findCommercialContamination(value, manifest, path = '$') {
  const hits = [];
  const fragments = fragmentsFrom(manifest);
  const blockedValues = blockedValuesFrom(manifest);

  function walk(node, nodePath) {
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, `${nodePath}[${index}]`));
      return;
    }
    if (node && typeof node === 'object') {
      for (const [key, child] of Object.entries(node)) {
        const normalized = normalizeKey(key);
        const fragment = fragments.find((item) => item && normalized.includes(item));
        if (fragment) hits.push({ path: `${nodePath}.${key}`, kind: 'key', fragment });
        walk(child, `${nodePath}.${key}`);
      }
      return;
    }
    if (typeof node === 'string') {
      const lower = node.toLowerCase();
      const blocked = blockedValues.find((item) => item && lower.includes(item));
      if (blocked) hits.push({ path: nodePath, kind: 'value', fragment: blocked });
    }
  }

  walk(value, path);
  return hits;
}
