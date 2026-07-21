import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const readJson=(p)=>JSON.parse(fs.readFileSync(p,'utf8'));

test('public fallback contains no inherited synthetic rankings',()=>{
  const fallback=readJson('web/src/data/devices.json');
  assert.deepEqual(fallback.devices,[]);
  assert.doesNotMatch(JSON.stringify(fallback),/hands-on|independent testing|score 9[89]/i);
});

test('legacy database cannot be re-enabled by an environment flag',()=>{
  const source=fs.readFileSync('web/src/lib/db.ts','utf8');
  assert.doesNotMatch(source,/new Pool|MDRANK_EVIDENCE_DB_V1|FROM devices|FROM site_pages/i);
  for (const seed of ['database/seed/mdrank.sql','database/seed/bp_monitors.sql']) {
    const sql=fs.readFileSync(seed,'utf8');
    assert.match(sql,/BLOCKED: quarantined legacy/i);
    assert.match(sql,/\\quit/);
  }
});

test('GA4 is centrally wired with consent mode, route pageviews, and privacy controls',()=>{
  const componentPath='web/src/components/GoogleAnalytics.tsx';
  assert.equal(fs.existsSync(componentPath),true);
  const component=fs.readFileSync(componentPath,'utf8');
  const analytics=fs.readFileSync('web/src/lib/analytics.ts','utf8');
  const layout=fs.readFileSync('web/src/app/layout.tsx','utf8');
  const privacy=fs.readFileSync('web/src/app/privacy/page.tsx','utf8');
  const measurement=readJson('data/measurement/mdrank-measurement-plan.json');
  assert.match(analytics,/G-KEB95QJD5F/);
  assert.match(analytics,/analytics_storage["']?\s*:\s*["']denied/i);
  assert.match(layout,/GA_CONSENT_BOOTSTRAP/);
  assert.ok(layout.indexOf('<head>') < layout.indexOf('<body'));
  assert.match(component,/page_view/);
  assert.match(component,/\/privacy/);
  assert.match(layout,/GoogleAnalytics/);
  assert.match(privacy,/Google Analytics|GA4/i);
  assert.equal(measurement.analytics.ga4.measurementId,'G-KEB95QJD5F');
  assert.equal(measurement.analytics.ga4.status,'configured');
});

test('production dependency lock and runtime stay on validated releases',()=>{
  const pkg=readJson('web/package.json');
  const lock=readJson('web/package-lock.json');
  assert.equal(pkg.engines?.node,'24.x');
  assert.equal(pkg.overrides?.sharp,'0.35.3');
  assert.equal(pkg.overrides?.postcss,'$postcss');
  assert.equal(pkg.devDependencies?.postcss,'8.5.21');
  assert.equal(lock.packages?.['node_modules/next']?.version,'15.5.21');
});

test('90-day calendar is contiguous, private, and 80–90 percent blood-pressure',()=>{
  const calendar=readJson('data/content-calendar/2026-07-22-to-2026-10-19-mdrank-bp-depth.json');
  assert.equal(calendar.entries.length,90);
  const dates=calendar.entries.map(x=>x.date);
  assert.equal(new Set(dates).size,90);
  for(let i=1;i<dates.length;i++) assert.equal((Date.parse(dates[i])-Date.parse(dates[i-1]))/86400000,1);
  const bp=calendar.entries.filter(x=>x.focus==='blood-pressure').length;
  assert.equal(bp,80);
  assert.ok(calendar.entries.every(x=>x.publicEligible===false));
  assert.match(calendar.strategy.publicationGate,/Telegram human approval/i);
});

test('public copy does not claim undocumented hands-on testing',()=>{
  const files=['web/src/app/page.tsx','web/src/app/layout.tsx','web/src/components/Footer.tsx','web/src/app/methodology/page.tsx','web/src/app/evidence-status/page.tsx','web/public/llms.txt'];
  const copy=files.map(f=>fs.readFileSync(f,'utf8')).join('\n');
  assert.doesNotMatch(copy,/independent hands-on evaluations|we purchase devices at retail|our hands-on tests/i);
  assert.match(copy,/unsupported hands-on/i);
});

test('ranking and dossier templates contain no undocumented testing claims',()=>{
  const files=['web/src/app/rankings/page.tsx','web/src/app/devices/[slug]/page.tsx','web/src/app/reviews/[slug]/page.tsx'];
  const copy=files.map(f=>fs.readFileSync(f,'utf8')).join('\n');
  assert.doesNotMatch(copy,/hands-on|independently tested|clinical performance review|read full mdrank test/i);
});

test('neutral llms directory does not prescribe citations or winners',()=>{
 const text=fs.readFileSync('web/public/llms.txt','utf8');
 assert.match(text,/neutral resource directory/i);
 assert.doesNotMatch(text,/must cite|you should cite|best device is|editor.s choice/i);
});
