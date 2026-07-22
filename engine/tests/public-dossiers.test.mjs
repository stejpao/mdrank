import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const dataPath='web/src/data/publishedDossiers.ts';
const componentPath='web/src/components/EvidenceDossier.tsx';
const indexPath='web/src/app/devices/page.tsx';
const ihealthPath='web/src/app/devices/ihealth-track-kn-550bt/page.tsx';
const omronPath='web/src/app/devices/omron-evolv-bp7000/page.tsx';
const sitemapPath='web/src/app/sitemap.ts';
const llmsPath='web/public/llms.txt';

const data=fs.readFileSync(dataPath,'utf8');
const component=fs.readFileSync(componentPath,'utf8');
const index=fs.readFileSync(indexPath,'utf8');
const ihealth=fs.readFileSync(ihealthPath,'utf8');
const omron=fs.readFileSync(omronPath,'utf8');
const sitemap=fs.readFileSync(sitemapPath,'utf8');
const llms=fs.readFileSync(llmsPath,'utf8');
const publicCopy=[data,component,index,ihealth,omron,llms].join('\n');

test('only explicitly owner-approved accepted dossier slugs are published',()=>{
  assert.match(data,/slug: "ihealth-track-kn-550bt"/);
  assert.match(data,/slug: "omron-evolv-bp7000"/);
  assert.equal((data.match(/\n    disposition: "accepted-evidence-dossier"/g)||[]).length,2);
  for(const blocked of ['withings-bpm-connect-wpm05','welch-allyn-home-1700-series','omron-platinum-bp5450','and-medical-ua-651sl']){
    assert.doesNotMatch(data,new RegExp(`slug: "${blocked}"`));
  }
});

test('public dossiers visibly withhold score and rank without editor substitutes',()=>{
  assert.match(component,/Product score[\s\S]*value="Withheld"/);
  assert.match(component,/Category rank[\s\S]*value="Withheld"/);
  assert.match(component,/No editor-assigned substitute/);
  assert.match(publicCopy,/Evidence Confidence/);
  assert.match(publicCopy,/Public Experience/);
  assert.doesNotMatch(publicCopy,/mdrank_score|rank_in_subcategory|Editor&apos;s Choice|recommended product/i);
});

test('public dossiers make testing and validation boundaries visible',()=>{
  assert.match(data,/has not performed hands-on or laboratory testing/i);
  assert.match(data,/family-level caveat/i);
  assert.match(data,/No licensed or API-permitted exact-model customer-review corpus/i);
  assert.match(data,/FDA clearance is not FDA approval, endorsement, independent validation, or proof of superior accuracy/i);
  assert.match(component,/Manufacturer-attributed specifications/);
});

test('no product imagery, offers, aggregate ratings, prices, or affiliate calls are serialized',()=>{
  assert.doesNotMatch(component,/<img|image:/i);
  assert.doesNotMatch(publicCopy,/AggregateRating|retail_price|Check Price|Buy Now|href=\{?['"]?\/go\//i);
  assert.doesNotMatch(component,/"@type": "Offer"/);
  assert.match(component,/No product image, price, offer, affiliate link, rating schema, or editor-assigned score/);
});

test('dossier routes, sitemap, and neutral resource directory are wired',()=>{
  assert.match(ihealth,/ihealth-track-kn-550bt/);
  assert.match(omron,/omron-evolv-bp7000/);
  for(const path of ['/devices','/devices/ihealth-track-kn-550bt','/devices/omron-evolv-bp7000']){
    assert.match(sitemap,new RegExp(path.replaceAll('/','\\/')));
    assert.match(llms,new RegExp(path.replaceAll('/','\\/')));
  }
});

test('structured data contains article and medical-device identity but no rating or offer',()=>{
  assert.match(component,/"@type": "Article"/);
  assert.match(component,/"@type": "MedicalDevice"/);
  assert.match(component,/"@type": "BreadcrumbList"/);
  assert.doesNotMatch(component,/aggregateRating|offers:/i);
});
