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

test('public dossiers show rubric scores only for scored-eligible rows',()=>{
  assert.match(component,/getPublicScore/);
  assert.match(component,/score\.scoreLabel/);
  assert.match(component,/score\.rankLabel/);
  assert.match(component,/No editor-assigned substitute/);
  assert.match(component,/score\.rubricVersion/);
  assert.match(data,/scoreStatus: "published"/);
  assert.match(data,/scoreStatus: "withheld"/);
  assert.match(data,/rankStatus: "published"/);
  assert.match(data,/rankStatus: "withheld"/);
  assert.match(publicCopy,/Evidence Confidence/);
  assert.match(publicCopy,/Public Experience/);
  assert.match(publicCopy,/upper-arm-home-bp-v1\.0\.0/);
  assert.doesNotMatch(publicCopy,/mdrank_score|rank_in_subcategory|Editor&apos;s Choice|recommended product/i);
  assert.doesNotMatch(publicCopy,/FDA approved/i);
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
  assert.match(component,/Buy on Amazon/);
  assert.match(component,/data-affiliate="amazon-associates"/);
  assert.match(component,/data-merchant="Amazon"/);
  assert.match(component,/data-field="purchase_url"/);
  assert.match(component,/AmazonCanadaNote/);
  assert.match(component,/aria-describedby="amazon-canada-local-match"/);
  const canadaNote=fs.readFileSync('web/src/components/AmazonCanadaNote.tsx','utf8');
  const seo=fs.readFileSync('web/src/components/DossierSeo.tsx','utf8');
  assert.match(canadaNote,/This link is the US amazon\.com exact-model ASIN/);
  assert.match(canadaNote,/Amazon may show Canadian shoppers an Amazon\.ca &ldquo;Local match&rdquo; similar product that is not this exact model/);
  assert.match(canadaNote,/A Local match does not appear on every visit/);
  assert.match(canadaNote,/Check the product title and model on Amazon before buying/);
  assert.match(canadaNote,/No Amazon\.ca Local-match substitute is documented for this listing/);
  assert.doesNotMatch(canadaNote,/always appears|will substitute|always substitute/i);
  assert.match(seo,/AmazonCanadaNote/);
  assert.equal((data.match(/canadaLocalMatch: "confirmed"/g)||[]).length,2);
  assert.doesNotMatch(data,/canadaLocalMatch: "not-documented"/);
  assert.doesNotMatch([data,component,canadaNote,seo,amazon].join('\n'),/amazon\.ca\/dp\/|sjpenterpri03-20/);
  assert.match(component,/data-affiliate-weight="0"/);
  assert.match(component,/DossierShare/);
  assert.match(component,/data-section="handling-report"/);
  assert.match(component,/Persona fit/);
  assert.doesNotMatch(component,/min-w-\[720px\]/);
  assert.match(component,/No price or rating schema appears on this dossier/);
  assert.match(component,/zero weight in the MDRank Score and category rank/);
  assert.doesNotMatch(component,/"@type": "Offer"|aggregateRating|offers:/i);
  assert.doesNotMatch([publicCopy,catalog,amazon].join('\n'),/AggregateRating|retail_price|Check Price|Buy Now|href=\{?['"]?\/go\/|FDA approved/i);
  assert.match(index,/DossierCatalog/);
  assert.match(index,/isPublicUpperArmDossier/);
  assert.match(catalog,/htmlFor="dossier-search"/);
  assert.match(catalog,/<legend[^>]*>Brand<\/legend>/);
  assert.match(catalog,/dossier\.scoreLabel/);
  assert.match(catalog,/dossier\.rankLabel/);
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
