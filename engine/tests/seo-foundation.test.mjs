import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import faqs from '../../web/src/data/dossierFaqs.json' with { type: 'json' };
import offers from '../../web/src/data/publicOffers.json' with { type: 'json' };
import scores from '../../web/src/data/publicScores.json' with { type: 'json' };
import { buildDossierStructuredData, scoreStatusFaq } from '../../web/src/lib/dossierSchema.mjs';

const SITE = 'https://mdrank.org';
const PUBLIC_PATHS = [
  '/',
  '/methodology',
  '/evidence-status',
  '/privacy',
  '/disclosures',
  '/devices',
  '/devices/ihealth-track-kn-550bt',
  '/devices/omron-evolv-bp7000',
];

const data = fs.readFileSync('web/src/data/publishedDossiers.ts', 'utf8');
const sitemap = fs.readFileSync('web/src/app/sitemap.ts', 'utf8');
const llms = fs.readFileSync('web/public/llms.txt', 'utf8');
const footer = fs.readFileSync('web/src/components/Footer.tsx', 'utf8');
const dossier = fs.readFileSync('web/src/components/EvidenceDossier.tsx', 'utf8');
const seo = fs.readFileSync('web/src/components/DossierSeo.tsx', 'utf8');
const disclosures = fs.readFileSync('web/src/app/disclosures/page.tsx', 'utf8');
const amazon = fs.readFileSync('web/src/lib/amazon.ts', 'utf8');

function schemasFor(slug) {
  const offer = offers[slug];
  const name = slug === 'ihealth-track-kn-550bt'
    ? 'iHealth Track Blood Pressure Monitor'
    : 'OMRON Evolv Wireless Upper Arm Blood Pressure Monitor';
  return buildDossierStructuredData({
    slug,
    name,
    model: slug === 'ihealth-track-kn-550bt' ? 'KN-550BT' : 'BP7000 / HEM-7600T-Z',
    manufacturer: slug === 'ihealth-track-kn-550bt' ? 'iHealth Labs, Inc.' : 'OMRON Healthcare',
    brand: offer.brand,
    category: 'Upper-arm blood-pressure monitor',
    description: 'Score and rank remain withheld.',
    faqs: faqs[slug],
    asin: offer.asin,
    offerUrl: `https://www.amazon.com/dp/${offer.asin}?tag=sjpenterpri05-20`,
    offerNote: offer.offerNote,
    image: null,
  });
}

test('direct answers match the live rubric score status', () => {
  const answers = [...data.matchAll(/directAnswer:\s*\n\s*"([^"]+)"/g)].map((match) => match[1]);
  assert.equal(answers.length, 2);
  assert.match(dossier, /id="direct-answer"/);
  assert.match(answers[0], /FDA clearance K160014/);
  assert.match(answers[0], /MDRank Score and category rank/);
  assert.match(answers[0], /Evidence Confidence stays High/);
  assert.doesNotMatch(answers[0], /remain withheld|score and category rank are withheld/i);
  assert.match(answers[1], /FDA clearance K162092/);
  assert.match(answers[1], /family-level caveat/);
  assert.match(answers[1], /MDRank Score and category rank are withheld/);
  assert.match(answers[1], /Evidence Confidence stays Moderate/);
});

test('FAQ score status follows the published rubric row', () => {
  const ihealth = scores.devices.find((row) => row.slug === 'ihealth-track-kn-550bt');
  const omron = scores.devices.find((row) => row.slug === 'omron-evolv-bp7000');
  assert.equal(ihealth.mdrankScore, 78.3);
  assert.equal(ihealth.rankLabel, '1 of 1');
  assert.equal(ihealth.scoreStatus, 'published');
  assert.equal(omron.mdrankScore, null);
  assert.equal(omron.scoreStatus, 'withheld');
  const ihealthFaq = scoreStatusFaq({ ...ihealth, evidenceConfidence: ihealth.evidenceConfidence });
  const omronFaq = scoreStatusFaq({ ...omron, evidenceConfidence: omron.evidenceConfidence });
  assert.match(ihealthFaq.answer, /MDRank Score 78\.3/);
  assert.match(ihealthFaq.answer, /category rank 1 of 1/);
  assert.match(ihealthFaq.answer, /Evidence Confidence stays High/);
  assert.doesNotMatch(ihealthFaq.answer, /withheld/i);
  assert.match(omronFaq.answer, /Family-level validation is not exact-model validation/);
  assert.match(omronFaq.answer, /Evidence Confidence stays Moderate/);
  assert.equal(faqs['ihealth-track-kn-550bt'].length + 1, 5);
  assert.equal(faqs['omron-evolv-bp7000'].length + 1, 5);
  assert.match(seo, /scoreStatusFaq/);
  assert.match(seo, /getPublicScore/);
  assert.doesNotMatch(JSON.stringify(faqs), /not yet validated|remain withheld/);
});

test('dossier schema is Product, Brand, Offer, and FAQPage without ratings or prices', () => {
  assert.deepEqual(Object.keys(offers).sort(), ['ihealth-track-kn-550bt', 'omron-evolv-bp7000']);
  assert.match(amazon, /sjpenterpri05-20/);
  assert.match(amazon, /https:\/\/www\.amazon\.com\/dp\/\$\{asin\}\?tag=\$\{AMAZON_ASSOCIATES_TAG\}/);
  for (const slug of Object.keys(offers)) {
    const graph = schemasFor(slug);
    const product = graph.find((node) => node['@type'] === 'Product');
    const faqPage = graph.find((node) => node['@type'] === 'FAQPage');
    assert.ok(product);
    assert.equal(product.brand['@type'], 'Brand');
    assert.equal(product.brand.name, offers[slug].brand);
    assert.equal(product.offers['@type'], 'Offer');
    assert.equal(product.offers.url, `https://www.amazon.com/dp/${offers[slug].asin}?tag=sjpenterpri05-20`);
    assert.equal(product.offers.seller.name, 'Amazon.com');
    assert.equal(product.image, undefined);
    assert.equal(product.aggregateRating, undefined);
    assert.equal(product.offers.price, undefined);
    assert.equal(product.offers.priceCurrency, undefined);
    assert.equal(product.offers.availability, undefined);
    assert.equal(faqPage.mainEntity.length, faqs[slug].length);
    assert.ok(faqPage.mainEntity.length >= 3 && faqPage.mainEntity.length <= 5);
    assert.deepEqual(
      faqPage.mainEntity.map((item) => item.name),
      faqs[slug].map((item) => item.question),
    );
    assert.deepEqual(
      faqPage.mainEntity.map((item) => item.acceptedAnswer.text),
      faqs[slug].map((item) => item.answer),
    );
    const serialized = JSON.stringify(graph);
    assert.doesNotMatch(serialized, /AggregateRating|ratingValue|reviewCount|bestRating|worstRating/);
    assert.doesNotMatch(serialized, /"price"|"priceCurrency"/);
  }
  assert.throws(() => buildDossierStructuredData({
    slug: 'ihealth-track-kn-550bt',
    name: 'x',
    model: 'x',
    manufacturer: 'x',
    brand: 'x',
    category: 'x',
    description: 'x',
    faqs: faqs['ihealth-track-kn-550bt'],
    offerUrl: 'https://www.amazon.com/dp/B01C5QS1T8',
  }), /Associates tag/);
  assert.throws(() => buildDossierStructuredData({
    slug: 'ihealth-track-kn-550bt',
    name: 'x',
    model: 'x',
    manufacturer: 'x',
    brand: 'x',
    category: 'x',
    description: 'x',
    faqs: faqs['ihealth-track-kn-550bt'].slice(0, 2),
  }), /3 to 5/);
});

test('visible FAQ and trust links use the same dossier evidence', () => {
  assert.match(seo, /description: dossier\.directAnswer/);
  assert.match(seo, /dossierFaqs\.json/);
  assert.match(seo, /faq\.question/);
  assert.match(seo, /faq\.answer/);
  assert.match(seo, /href="\/methodology"/);
  assert.match(seo, /href="\/disclosures"/);
  assert.match(seo, /href="\/evidence-status"/);
  assert.match(seo, /may earn a commission/);
  assert.match(seo, /zero weight in the MDRank Score and category rank/);
  assert.match(seo, /AmazonCanadaNote/);
  const canadaNote = fs.readFileSync('web/src/components/AmazonCanadaNote.tsx', 'utf8');
  assert.match(canadaNote, /Local match/);
  assert.match(fs.readFileSync('web/src/data/publishedDossiers.ts', 'utf8'), /canadaLocalMatch: "confirmed"/);
  assert.doesNotMatch(seo, /Buy Now|Check Price|AggregateRating/);
  assert.match(seo, /\*Photo edited for clarity\./);
  assert.match(dossier, /"@type": "BreadcrumbList"/);
  assert.doesNotMatch(dossier, /AggregateRating/);
  for (const slug of ['ihealth-track-kn-550bt', 'omron-evolv-bp7000']) {
    const page = fs.readFileSync(`web/src/app/devices/${slug}/page.tsx`, 'utf8');
    assert.match(page, /DossierSeo/);
    for (const faq of faqs[slug]) {
      assert.equal(faq.answer.includes('FDA approved'), false);
    }
  }
});

test('llms.txt and sitemap list the public product and trust pages', () => {
  for (const path of PUBLIC_PATHS) {
    assert.match(llms, new RegExp(path === '/' ? String.raw`https://mdrank\.org/` : path.replaceAll('/', String.raw`\/`)));
    assert.match(sitemap, new RegExp(path.replaceAll('/', String.raw`\/`)));
  }
  assert.match(sitemap, /2026-10-28T00:00:00Z/);
  assert.match(llms, /iHealth Track KN-550BT is scored/);
  assert.match(llms, /OMRON Evolv BP7000 stays unranked/);
  assert.doesNotMatch(sitemap, /\/rankings|\/reviews/);
  assert.doesNotMatch(llms, /must cite|you should cite|best device is|editor.s choice/i);
  assert.match(llms, /sjpenterpri05-20/);
  assert.match(llms, /zero weight/i);
});

test('disclosures page and footer trust cluster are public', () => {
  assert.match(disclosures, /sjpenterpri05-20/);
  assert.match(disclosures, /weight zero/i);
  assert.match(disclosures, /TrueVitals USA/);
  assert.match(disclosures, /True Health Co/);
  assert.match(disclosures, /separate brands and businesses/);
  assert.match(disclosures, /same exact-model, eligibility, and commercial-isolation rules as any other brand/);
  assert.match(disclosures, /Paid placement remains not live/);
  assert.match(disclosures, /scored-eligible exact-model dossier/);
  assert.match(disclosures, /upper-arm-home-bp-v1\.0\.0/);
  assert.doesNotMatch(disclosures, /AggregateRating|Unredacted/);
  assert.match(footer, /href="\/methodology"/);
  assert.match(footer, /href="\/disclosures"/);
  assert.match(footer, /href="\/evidence-status"/);
  assert.match(footer, /href="\/privacy"/);
  assert.match(footer, /aria-label="Trust"/);
  const deviceDirs = fs.readdirSync('web/src/app/devices', { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  assert.deepEqual(deviceDirs, ['[slug]', 'ihealth-track-kn-550bt', 'omron-evolv-bp7000']);
});

test('schema image is included only with the approved caption', () => {
  const withImage = buildDossierStructuredData({
    slug: 'omron-evolv-bp7000',
    name: 'OMRON Evolv Wireless Upper Arm Blood Pressure Monitor',
    model: 'BP7000 / HEM-7600T-Z',
    manufacturer: 'OMRON Healthcare',
    brand: 'OMRON',
    category: 'Upper-arm blood-pressure monitor',
    description: 'Score and rank remain withheld.',
    faqs: faqs['omron-evolv-bp7000'],
    asin: 'B01MRL790Q',
    offerUrl: 'https://www.amazon.com/dp/B01MRL790Q?tag=sjpenterpri05-20',
    offerNote: offers['omron-evolv-bp7000'].offerNote,
    image: `${SITE}/images/dossiers/omron-evolv-bp7000-real-use.jpg`,
  });
  const product = withImage.find((node) => node['@type'] === 'Product');
  assert.equal(product.image, `${SITE}/images/dossiers/omron-evolv-bp7000-real-use.jpg`);
  assert.equal(product.aggregateRating, undefined);
});
