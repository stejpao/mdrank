import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import held from '../../web/src/data/heldPublishDossiers.json' with { type: 'json' };
import {
  DOSSIER_PEER_MAX,
  DOSSIER_PEER_MIN,
  brandKey,
  isUpperArmCatalogDossier,
  selectDossierPeers,
} from '../../web/src/lib/dossierPeers.mjs';

const seeds = [
  {
    slug: 'ihealth-track-kn-550bt',
    name: 'iHealth Track Blood Pressure Monitor',
    manufacturer: 'iHealth Labs, Inc.',
    model: 'KN-550BT',
    category: 'Upper-arm blood-pressure monitor',
  },
  {
    slug: 'omron-evolv-bp7000',
    name: 'OMRON Evolv Wireless Upper Arm Blood Pressure Monitor',
    manufacturer: 'OMRON Healthcare',
    model: 'BP7000 / HEM-7600T-Z',
    category: 'Upper-arm blood-pressure monitor',
  },
];

const catalog = [
  ...seeds,
  ...held.map((dossier) => ({
    slug: dossier.slug,
    name: dossier.name,
    manufacturer: dossier.manufacturer,
    model: dossier.model,
    category: dossier.category,
  })),
];

const publishedSlugs = new Set(catalog.map((dossier) => dossier.slug));
const source = fs.readFileSync('web/src/data/publishedDossiers.ts', 'utf8');
const seo = fs.readFileSync('web/src/components/DossierSeo.tsx', 'utf8');

function peerSlugs(dossierSlug, sourceCatalog = catalog) {
  return selectDossierPeers(sourceCatalog, dossierSlug).map((peer) => peer.slug);
}

test('manufacturer tokens group the scored dossier with its brand and ignore commercial fields', () => {
  assert.equal(brandKey('iHealth Labs, Inc.'), brandKey('iHealth'));
  assert.equal(brandKey('iHealth Labs, Inc.'), 'ihealth');
  assert.equal(brandKey('OMRON Healthcare'), brandKey('OMRON'));
  assert.equal(brandKey('OMRON Healthcare'), 'omron');
  assert.equal(brandKey('A&D Medical'), 'a');
  assert.equal(brandKey('Easy@Home'), 'easy');
  assert.equal(brandKey('Beat (Lexington Wellness)'), 'beat');
});

test('every published dossier links to 3-4 other published upper-arm dossiers', () => {
  assert.equal(DOSSIER_PEER_MIN, 3);
  assert.equal(DOSSIER_PEER_MAX, 4);
  assert.equal(catalog.length, 60);
  assert.equal(publishedSlugs.size, 60);
  for (const seed of seeds) {
    assert.match(source, new RegExp(`slug: "${seed.slug}"`));
    assert.match(source, new RegExp(`manufacturer: "${seed.manufacturer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
    assert.match(source, new RegExp(`category: "${seed.category}"`));
  }
  assert.equal(held.length, 58);

  const inbound = new Map(catalog.map((dossier) => [dossier.slug, 0]));
  const rankedWords = /\bbetter\b|\btop\b|\bbest\b|\brecommended\b|\brank\b|\bscore\b|FDA approved/i;

  for (const dossier of catalog) {
    const peers = selectDossierPeers(catalog, dossier.slug);
    const slugs = peers.map((peer) => peer.slug);
    assert.ok(peers.length >= DOSSIER_PEER_MIN && peers.length <= DOSSIER_PEER_MAX, dossier.slug);
    assert.equal(new Set(slugs).size, peers.length, dossier.slug);
    assert.equal(slugs.includes(dossier.slug), false, dossier.slug);
    for (const peer of peers) {
      assert.equal(publishedSlugs.has(peer.slug), true, peer.slug);
      assert.equal(isUpperArmCatalogDossier(peer), true, peer.slug);
      assert.equal(rankedWords.test(`${peer.name} ${peer.model}`), false, peer.slug);
      inbound.set(peer.slug, inbound.get(peer.slug) + 1);
    }
    const sameBrand = peers.filter((peer) => brandKey(peer.manufacturer) === brandKey(dossier.manufacturer));
    assert.ok(sameBrand.length <= 1, `${dossier.slug} same-brand peers: ${sameBrand.map((peer) => peer.slug).join(',')}`);
    const peerBrands = new Set(peers.map((peer) => brandKey(peer.manufacturer)));
    assert.equal(peerBrands.size, peers.length, `${dossier.slug} repeats a manufacturer`);
  }

  for (const [slug, count] of inbound) {
    assert.ok(count >= 1, `${slug} has no inbound catalog peer`);
  }

  const ihealthInbound = inbound.get('ihealth-track-kn-550bt');
  const othersPointingAtIhealth = catalog.filter((dossier) => (
    dossier.slug !== 'ihealth-track-kn-550bt' && peerSlugs(dossier.slug).includes('ihealth-track-kn-550bt')
  ));
  assert.ok(othersPointingAtIhealth.length < catalog.length - 1);
  assert.ok(ihealthInbound < 12, `scored dossier inbound ${ihealthInbound}`);
});

test('peer selection is deterministic and ignores order, scores, and affiliate fields', () => {
  const reversed = [...catalog].reverse();
  const rotated = [...catalog.slice(17), ...catalog.slice(0, 17)];
  const boosted = catalog.map((dossier) => ({
    ...dossier,
    mdrankScore: dossier.slug === 'ihealth-track-kn-550bt' ? 100 : 0,
    rankLabel: dossier.slug === 'ihealth-track-kn-550bt' ? '1 of 1' : 'withheld',
    asin: 'B000000000',
    affiliateWeight: dossier.slug === 'ihealth-track-kn-550bt' ? 50 : 0,
  }));

  for (const dossier of catalog) {
    const expected = peerSlugs(dossier.slug);
    assert.deepEqual(peerSlugs(dossier.slug), expected);
    assert.deepEqual(peerSlugs(dossier.slug, reversed), expected);
    assert.deepEqual(peerSlugs(dossier.slug, rotated), expected);
    assert.deepEqual(peerSlugs(dossier.slug, boosted), expected);
  }
});

test('wrist and optical identities are never peer targets', () => {
  const polluted = [
    ...catalog,
    {
      slug: 'fake-wrist-monitor',
      name: 'Example Wrist Monitor',
      manufacturer: 'Example',
      model: 'WR-1',
      category: 'Wrist blood-pressure monitor',
    },
    {
      slug: 'fake-optical-band',
      name: 'Example Optical Band',
      manufacturer: 'Example',
      model: 'OP-1',
      category: 'Upper-arm optical sensor',
    },
  ];
  assert.equal(isUpperArmCatalogDossier(polluted.at(-2)), false);
  assert.equal(isUpperArmCatalogDossier(polluted.at(-1)), false);
  assert.deepEqual(selectDossierPeers(polluted, 'fake-wrist-monitor'), []);
  assert.deepEqual(selectDossierPeers(polluted, 'fake-optical-band'), []);
  for (const dossier of catalog) {
    const slugs = peerSlugs(dossier.slug, polluted);
    assert.equal(slugs.includes('fake-wrist-monitor'), false);
    assert.equal(slugs.includes('fake-optical-band'), false);
    assert.deepEqual(slugs, peerSlugs(dossier.slug));
  }
});

test('unpublished slugs and unknown dossiers are not linked', () => {
  assert.deepEqual(selectDossierPeers(catalog, 'welch-allyn-home-1700-series'), []);
  assert.equal(publishedSlugs.has('welch-allyn-home-1700-series'), false);
  assert.equal(publishedSlugs.has('omron-platinum-bp5450'), false);
  const slugs = new Set(catalog.flatMap((dossier) => peerSlugs(dossier.slug)));
  assert.equal(slugs.has('welch-allyn-home-1700-series'), false);
  assert.equal(slugs.has('omron-platinum-bp5450'), false);
});

test('a same-manufacturer block still yields 3-4 peers and keeps alternatives when they exist', () => {
  const block = [
    { slug: 'a-1', name: 'Alpha 1', manufacturer: 'Alpha', model: '1', category: 'Upper-arm blood-pressure monitor' },
    { slug: 'a-2', name: 'Alpha 2', manufacturer: 'Alpha', model: '2', category: 'Upper-arm blood-pressure monitor' },
    { slug: 'a-3', name: 'Alpha 3', manufacturer: 'Alpha', model: '3', category: 'Upper-arm blood-pressure monitor' },
    { slug: 'a-4', name: 'Alpha 4', manufacturer: 'Alpha', model: '4', category: 'Upper-arm blood-pressure monitor' },
    { slug: 'b-1', name: 'Beta 1', manufacturer: 'Beta', model: '1', category: 'Upper-arm blood-pressure monitor' },
    { slug: 'c-1', name: 'Gamma 1', manufacturer: 'Gamma', model: '1', category: 'Upper-arm blood-pressure monitor' },
    { slug: 'd-1', name: 'Delta 1', manufacturer: 'Delta', model: '1', category: 'Upper-arm blood-pressure monitor' },
  ];
  for (const dossier of block) {
    const peers = selectDossierPeers(block, dossier.slug);
    assert.ok(peers.length >= 3 && peers.length <= 4, dossier.slug);
    assert.equal(peers.some((peer) => peer.slug === dossier.slug), false);
    const peerBrands = new Set(peers.map((peer) => brandKey(peer.manufacturer)));
    const otherBrandCount = new Set(
      block
        .filter((item) => brandKey(item.manufacturer) !== brandKey(dossier.manufacturer))
        .map((item) => brandKey(item.manufacturer)),
    ).size;
    if (otherBrandCount >= DOSSIER_PEER_MIN) assert.equal(peerBrands.size, peers.length, dossier.slug);
    if (dossier.manufacturer === 'Alpha') {
      const sameBrand = peers.filter((peer) => brandKey(peer.manufacturer) === 'alpha');
      assert.ok(sameBrand.length <= 1);
    }
  }
  const alphaTwo = selectDossierPeers(block, 'a-2').map((peer) => peer.slug);
  assert.equal(alphaTwo.includes('b-1'), true);
  assert.equal(alphaTwo.includes('c-1'), true);
  assert.equal(alphaTwo.includes('d-1'), true);

  const onlyBrand = block.filter((dossier) => dossier.manufacturer === 'Alpha');
  const closed = selectDossierPeers(onlyBrand, 'a-1');
  assert.deepEqual(closed.map((peer) => peer.slug), ['a-2', 'a-3', 'a-4']);
  assert.equal(closed.some((peer) => peer.slug === 'a-1'), false);
});

test('dossier pages render the catalog peer block instead of the first other dossier', () => {
  assert.match(seo, /selectDossierPeers\(publishedDossiers, dossier\.slug\)/);
  assert.match(seo, /data-section="catalog-peers"/);
  assert.match(seo, /Other upper-arm monitors in the catalog/);
  assert.match(seo, /href=\{\`\/devices\/\$\{peer\.slug\}\`\}/);
  assert.match(seo, /\{peer\.name\}/);
  assert.doesNotMatch(seo, /publishedDossiers\.find\(\(item\) => item\.slug !== dossier\.slug\)/);
  assert.doesNotMatch(seo, /Other published upper-arm dossier:/);
  assert.doesNotMatch(seo, /FDA approved|AggregateRating|\bbest\b|\brecommended\b|\bbetter\b/i);
  assert.match(seo, /sjpenterpri05-20/);
  assert.match(seo, /buildDossierStructuredData/);
  const block = seo.slice(seo.indexOf('data-section="catalog-peers"'), seo.indexOf('aria-label="Trust"'));
  assert.doesNotMatch(block, /\bscore\b|\brank\b|\bordered\b|<ol/i);
});
