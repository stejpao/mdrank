import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { validateExactModelContract, validateMethodologyManifest, validatePublicExperienceContract } from '../lib/contracts.mjs';
import { scorePublicExperienceConfidence, buildPersonaFit } from '../lib/public-experience.mjs';
import { evaluatePublicationGate, buildApprovalPacket, formatApprovalPacketMarkdown } from '../lib/publication-gate.mjs';

function exactRecord() {
  return {
    schemaVersion:'1.0.0', disposition:'accepted',
    product:{id:'example-us-model',brand:'Example',exactModel:'X100-US',modelAliases:[],market:'US',manufacturer:'Example Inc',testingStatus:'public-evidence-only',hsaFsaStatus:'not-verified-for-this-product',currentAvailability:'available',retrievedAt:'2026-07-21',verifiedAt:'2026-07-21'},
    identity:{status:'resolved'}, identifiers:{sku:null,gtin:null,upc:null,asin:null}, regulatory:{status:'documented'}, validation:{status:'documented'}, documentation:{manualUrls:['https://example.com/manual.pdf']}, measurement:{method:'oscillometric'}, fit:{minimumCm:22,maximumCm:42}, accessoriesAndConsumables:{required:[]}, connectivityAndPrivacy:{appRequired:false}, power:{types:['battery']}, warrantyAndSupport:{warranty:'1 year'}, recallAndSafety:{checkedAt:'2026-07-21'}, conflicts:[], images:[],
    evidence:[{id:'manual',url:'https://example.com/manual.pdf',retrievedAt:'2026-07-21',acquisitionMethod:'public-document',reusePermission:'facts-and-citation'}],
    claims:[{id:'fit',text:'Fits 22 to 42 cm arms.',evidenceIds:['manual']}],
  };
}

test('exact-model contract accepts a complete resolved record',()=>assert.equal(validateExactModelContract(exactRecord()),true));
test('accepted record fails closed on unresolved identity and unknown evidence',()=>{
  const unresolved=exactRecord(); unresolved.identity.status='conflict';
  assert.throws(()=>validateExactModelContract(unresolved),/resolved exact-model identity/i);
  const bad=exactRecord(); bad.claims[0].evidenceIds=['missing'];
  assert.throws(()=>validateExactModelContract(bad),/unknown evidence/i);
});
test('image rights and acquisition methods are enumerated',()=>{
  const bad=exactRecord(); bad.images=[{id:'hero',rightsStatus:'found-online'}];
  assert.throws(()=>validateExactModelContract(bad),/invalid rightsStatus/i);
});

test('methodology manifest owns every numeric rule and forbids LLM numeric choice',()=>{
 const m={schemaVersion:'1.0.0',category:'blood-pressure',rubricVersion:'bp-1',eligibilityGates:['identity'],dimensions:[{key:'measurement',weight:0.6},{key:'fit',weight:0.4}],penalties:[],tieBreakers:['id'],stabilityRules:[],manualReviewTriggers:[],freshnessRules:[],confidenceCalculation:{type:'weighted'},scoreShrinkage:{neutral:5},llmMayChooseNumericRules:false};
 assert.equal(validateMethodologyManifest(m),true);
 assert.throws(()=>validateMethodologyManifest({...m,llmMayChooseNumericRules:true}),/must be false/i);
});

function experience() {
 return {schemaVersion:'1.0.0',productId:'example-us-model',themeAgreement:0.8,limitations:['Public reviews are self-selected.'],items:Array.from({length:20},(_,i)=>({id:`r${i}`,exactModelMatch:true,acquisitionMethod:'official-api',retrievedAt:'2026-07-21',sourceType:i%2?'retailer':'forum',verifiedPurchase:i%2===0,ageDays:30,ownershipDays:60,manipulationRisk:'low',clinicalAccuracyEvidence:false}))};
}
test('public experience confidence is deterministic and separate from clinical evidence',()=>{
 const a=scorePublicExperienceConfidence(experience()); const b=scorePublicExperienceConfidence(experience());
 assert.deepEqual(a,b); assert.ok(a.confidence>0);
 const bad=experience(); bad.items[0].clinicalAccuracyEvidence=true;
 assert.throws(()=>validatePublicExperienceContract(bad),/cannot be clinical accuracy evidence/i);
});
test('persona output returns insufficient rather than inventing a fit',()=>{
 assert.equal(buildPersonaFit({verifiedProductFacts:[],recurringThemes:[],confidence:{level:'insufficient'}}).status,'insufficient');
});

function candidate() {
 return {title:'Example X100-US Review',url:'/reviews/blood-pressure/example-x100-us',isNewPublicUrl:true,brand:'Example',exactModel:'X100-US',market:'US',identityStatus:'resolved',eligible:true,evidenceConfidence:0.85,minimumEvidenceConfidence:0.7,mdrankScore:7.4,primarySources:[{id:'manual',title:'Manual',url:'https://example.com/manual.pdf'}],materialClaims:[{text:'Fits 22 to 42 cm arms.',evidenceIds:['manual']}],limitations:['No hands-on testing.'],images:[],schemaTypes:['Product','Review','BreadcrumbList'],canonical:'/reviews/blood-pressure/example-x100-us',disclosureStatus:'approved',testingStatus:'public-evidence-only',humanApproval:{action:'hold'}};
}
test('publication gate requires explicit human Publish action',()=>{
 const held=evaluatePublicationGate(candidate()); assert.equal(held.allowed,false); assert.ok(held.blockers.includes('human-publish-approval-required'));
 const approved=candidate(); approved.humanApproval.action='publish'; assert.equal(evaluatePublicationGate(approved).allowed,true);
});
test('publication gate blocks protected routes and unresolved image rights',()=>{
 const c=candidate(); c.url='/reviews/best-home-blood-pressure-monitors-2026'; c.canonical=c.url; c.humanApproval.action='publish';
 assert.ok(evaluatePublicationGate(c).blockers.includes('protected-route'));
 const d=candidate(); d.images=[{id:'hero',rightsStatus:'found-online'}]; d.humanApproval.action='publish';
 assert.ok(evaluatePublicationGate(d).blockers.includes('image-rights-unresolved'));
});
test('approval packet contains Telegram controls but performs no action',()=>{
 const packet=buildApprovalPacket(candidate()); const md=formatApprovalPacketMarkdown(packet);
 assert.deepEqual(packet.controls.map(x=>x.action),['publish','hold','reject']);
 assert.match(md,/Publish · Hold · Reject/); assert.match(md,/No action is executed/);
});

test('90-day blood-pressure queue contains 40 unique unresolved exact-model candidates',()=>{
 const here=path.dirname(fileURLToPath(import.meta.url));
 const queue=JSON.parse(fs.readFileSync(path.resolve(here,'../../data/evidence/candidates/home-blood-pressure-monitors.90-day.json'),'utf8'));
 assert.equal(queue.candidates.length,40);
 assert.equal(new Set(queue.candidates.map(x=>`${x.brand}:${x.candidateModel}`)).size,40);
 assert.ok(queue.candidates.every(x=>['unresolved','model-family-caveat'].includes(x.identityStatus)));
});
