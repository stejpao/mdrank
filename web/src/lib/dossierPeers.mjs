/**
 * Catalog peers for a published upper-arm dossier.
 *
 * The link set is deterministic and reads only identity fields: slug, name,
 * model, manufacturer, and category. Scores, ranks, prices, ASINs, and
 * affiliate data are not inputs.
 *
 * Rule:
 * 1. Keep dossiers whose category, name, and model describe an upper-arm
 *    monitor, and drop wrist or optical identities.
 * 2. Group the remaining dossiers by manufacturer token (lowercase, with
 *    parentheticals removed). "iHealth" and "iHealth Labs, Inc." share a
 *    token, as do "OMRON" and "OMRON Healthcare".
 * 3. Sort models by slug inside each manufacturer, sort manufacturers by
 *    that token, then interleave them round-robin. That is the catalog order.
 * 4. Link the immediate next dossier in that order, wrapping at the end, so
 *    the catalog stays one traversable cycle.
 * 5. Fill to four links with later dossiers from manufacturers not already
 *    chosen, wrapping as needed. A repeated manufacturer is not added just to
 *    reach four. Models from the same manufacturer start that fill at a
 *    rotating offset so a long run does not share one window.
 * 6. A same-manufacturer link is kept only for the cycle step, and only when
 *    that neighbour shares a manufacturer. If fewer than three other
 *    manufacturers exist, remaining slots fall back to other published
 *    upper-arm dossiers so a small catalog still interlinks.
 */

const WRIST_OR_OPTICAL = /\bwrist\b|\boptical\b/i;
const UPPER_ARM = /\bupper-arm\b|\bupper arm\b/i;

export const DOSSIER_PEER_MIN = 3;
export const DOSSIER_PEER_MAX = 4;

export function brandKey(manufacturer) {
  const normalized = String(manufacturer ?? "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  return normalized.split(/\s+/).find(Boolean) || "unknown";
}

export function isUpperArmCatalogDossier(dossier) {
  const identity = `${dossier?.category ?? ""} ${dossier?.name ?? ""} ${dossier?.model ?? ""}`;
  if (WRIST_OR_OPTICAL.test(identity)) return false;
  return UPPER_ARM.test(identity);
}

function compareText(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function dedupeBySlug(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    if (!item?.slug || seen.has(item.slug)) continue;
    seen.add(item.slug);
    result.push(item);
  }
  return result;
}

export function catalogPeerOrder(catalog) {
  const eligible = dedupeBySlug((catalog ?? []).filter(isUpperArmCatalogDossier));
  const groups = new Map();
  for (const dossier of eligible) {
    const key = brandKey(dossier.manufacturer);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(dossier);
  }
  const keys = [...groups.keys()].sort(compareText);
  for (const key of keys) {
    groups.get(key).sort((left, right) => compareText(left.slug, right.slug));
  }

  const sequence = [];
  const cursors = new Map(keys.map((key) => [key, 0]));
  let remaining = eligible.length;
  while (remaining > 0) {
    let progressed = false;
    for (const key of keys) {
      const group = groups.get(key);
      const cursor = cursors.get(key);
      if (cursor < group.length) {
        sequence.push(group[cursor]);
        cursors.set(key, cursor + 1);
        remaining -= 1;
        progressed = true;
      }
    }
    if (!progressed) break;
  }
  return sequence;
}

export function selectDossierPeers(catalog, slug) {
  const order = catalogPeerOrder(catalog);
  const index = order.findIndex((item) => item.slug === slug);
  if (index < 0 || order.length < 2) return [];

  const selfBrand = brandKey(order[index].manufacturer);
  const peers = [];
  const seen = new Set([slug]);
  const usedBrands = new Set();

  const successor = order[(index + 1) % order.length];
  peers.push(successor);
  seen.add(successor.slug);
  usedBrands.add(brandKey(successor.manufacturer));

  const different = [];
  for (let step = 1; step < order.length; step += 1) {
    const candidate = order[(index + step) % order.length];
    if (candidate.slug === slug || brandKey(candidate.manufacturer) === selfBrand) continue;
    different.push(candidate);
  }

  const siblingIndex = order
    .filter((item) => brandKey(item.manufacturer) === selfBrand)
    .slice()
    .sort((left, right) => compareText(left.slug, right.slug))
    .findIndex((item) => item.slug === slug);
  const start = different.length === 0 ? 0 : Math.max(0, siblingIndex) % different.length;

  for (let offset = 0; offset < different.length && peers.length < DOSSIER_PEER_MAX; offset += 1) {
    const candidate = different[(start + offset) % different.length];
    if (seen.has(candidate.slug) || usedBrands.has(brandKey(candidate.manufacturer))) continue;
    peers.push(candidate);
    seen.add(candidate.slug);
    usedBrands.add(brandKey(candidate.manufacturer));
  }

  if (peers.length < DOSSIER_PEER_MIN) {
    for (let step = 1; step < order.length && peers.length < DOSSIER_PEER_MAX; step += 1) {
      const candidate = order[(index + step) % order.length];
      if (seen.has(candidate.slug)) continue;
      peers.push(candidate);
      seen.add(candidate.slug);
    }
  }

  return peers;
}
