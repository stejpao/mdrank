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

test('illustrative photos and disclosed Amazon links stay outside scoring',()=>{
  const amazon=fs.readFileSync('web/src/lib/amazon.ts','utf8');
  const catalog=fs.readFileSync('web/src/components/DossierCatalog.tsx','utf8');
  const guard=fs.readFileSync('web/src/lib/catalog.ts','utf8');
  assert.match(component,/from "next\/image"/);
  assert.match(component,/<Image/);
  assert.match(component,/const photo = dossier\.illustrativePhoto/);
  assert.match(component,/alt=\{photo\.alt\}/);
  assert.match(component,/\{photo\.caption\}/);
  assert.match(component,/data-rights-status=\{photo\.rightsStatus\}/);
  assert.equal((data.match(/caption: "\*Photo edited for clarity\.",/g)||[]).length,2);
  assert.equal((data.match(/Illustrative real-use photo edited for clarity/g)||[]).length,2);
  assert.match(data,/Not manufacturer or clinical photography/);
  assert.equal((data.match(/rightsStatus: "owned",/g)||[]).length,2);
  assert.match(amazon,/sjpenterpri05-20/);
  assert.match(amazon,/https:\/\/www\.amazon\.com\/dp\/\$\{asin\}\?tag=\$\{AMAZON_ASSOCIATES_TAG\}/);
  assert.deepEqual([...data.matchAll(/asin: "([A-Z0-9]{10})"/g)].map((match)=>match[1]),['B01C5QS1T8','B01MRL790Q']);
  assert.match(component,/amazonAssociateUrl/);
  assert.match(component,/Affiliate disclosure/);
  assert.match(component,/may earn a commission/i);
  assert.match(component,/No price, offer schema, rating schema, or editor-assigned score appears on this dossier/);
  assert.doesNotMatch(component,/"@type": "Offer"|aggregateRating|offers:/i);
  assert.doesNotMatch([publicCopy,catalog,amazon].join('\n'),/AggregateRating|retail_price|Check Price|Buy Now|href=\{?['"]?\/go\/|FDA approved/i);
  assert.match(index,/DossierCatalog/);
  assert.match(index,/isPublicUpperArmDossier/);
  assert.match(catalog,/htmlFor="dossier-search"/);
  assert.match(catalog,/<legend[^>]*>Brand<\/legend>/);
  assert.match(catalog,/>Withheld</);
  assert.doesNotMatch(catalog,/mdrank_score|rank_in_subcategory|Editor/);
  assert.match(guard,/\\bwrist\\b/);
  assert.match(guard,/\\boptical\\b/);
  assert.doesNotMatch(index,/candidates|home-blood-pressure-monitors/);
  const deviceDirs=fs.readdirSync('web/src/app/devices',{withFileTypes:true}).filter((entry)=>entry.isDirectory()).map((entry)=>entry.name).sort();
  assert.deepEqual(deviceDirs,['[slug]','ihealth-track-kn-550bt','omron-evolv-bp7000']);
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
