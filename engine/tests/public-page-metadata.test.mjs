import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { buildPublicPageSchema, canonicalUrl, publicIndexPaths } from "../../web/src/lib/publicPageSchema.mjs";

const SITE = "https://mdrank.org";

const PUBLIC_PAGES = [
  {
    file: "web/src/app/layout.tsx",
    path: "/",
    title: "MDRank — Medical devices, ranked by evidence",
    socialTitle: "MDRank — Medical devices, ranked by evidence",
    ogType: "website",
    image: null,
  },
  {
    file: "web/src/app/methodology/page.tsx",
    path: "/methodology",
    title: "MDRank Methodology",
    socialTitle: "MDRank Methodology | MDRank",
    ogType: "website",
    image: null,
  },
  {
    file: "web/src/app/evidence-status/page.tsx",
    path: "/evidence-status",
    title: "Evidence status",
    socialTitle: "Evidence status | MDRank",
    ogType: "website",
    image: null,
  },
  {
    file: "web/src/app/devices/page.tsx",
    path: "/devices",
    title: "Published Medical-Device Evidence Dossiers",
    socialTitle: "Published Medical-Device Evidence Dossiers | MDRank",
    ogType: "website",
    image: null,
  },
  {
    file: "web/src/app/devices/ihealth-track-kn-550bt/page.tsx",
    path: "/devices/ihealth-track-kn-550bt",
    title: "iHealth Track KN-550BT Evidence Dossier",
    socialTitle: "iHealth Track KN-550BT Evidence Dossier | MDRank",
    ogType: "article",
    image: "/images/dossiers/ihealth-kn-550bt-real-use.jpg",
  },
  {
    file: "web/src/app/devices/omron-evolv-bp7000/page.tsx",
    path: "/devices/omron-evolv-bp7000",
    title: "OMRON Evolv BP7000 Evidence Dossier",
    socialTitle: "OMRON Evolv BP7000 Evidence Dossier | MDRank",
    ogType: "article",
    image: "/images/dossiers/omron-evolv-bp7000-real-use.jpg",
  },
  {
    file: "web/src/app/disclosures/page.tsx",
    path: "/disclosures",
    title: "Disclosures",
    socialTitle: "Disclosures | MDRank",
    ogType: "website",
    image: null,
  },
  {
    file: "web/src/app/privacy/page.tsx",
    path: "/privacy",
    title: "Privacy notice",
    socialTitle: "Privacy notice | MDRank",
    ogType: "website",
    image: null,
  },
];

test("public pages declare Open Graph and Twitter cards that match the canonical", () => {
  const helper = fs.readFileSync("web/src/lib/pageMetadata.ts", "utf8");
  assert.match(helper, /siteName: SITE_NAME/);
  assert.match(helper, /SITE_NAME = "MDRank"/);
  assert.match(helper, /approvedShareImage/);
  assert.match(helper, /card: image \? "summary_large_image" : "summary"/);

  for (const page of PUBLIC_PAGES) {
    const source = fs.readFileSync(page.file, "utf8");
    assert.match(source, /socialMetadata\(/);
    assert.match(source, new RegExp(`title: "${page.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
    if (page.path === "/") {
      assert.match(source, /canonical: "\/"/);
      assert.match(source, /path: "\/"/);
    } else {
      assert.match(source, new RegExp(`canonical: "${page.path}"`));
      assert.match(source, new RegExp(`path: "${page.path}"`));
    }
    if (page.image) {
      assert.match(source, /ogType: "article"/);
      assert.match(source, /approvedShareImage\(dossier\.illustrativePhoto\)/);
      assert.equal(fs.readFileSync("web/src/data/publishedDossiers.ts", "utf8").includes(page.image), true);
      assert.equal(fs.existsSync(`web/public${page.image}`), true);
    } else if (page.path !== "/") {
      assert.doesNotMatch(source, /og:image|approvedShareImage|ogType: "article"/);
    }
    assert.equal(canonicalUrl(page.path), page.path === "/" ? SITE : `${SITE}${page.path}`);
    assert.equal(page.socialTitle.includes("FDA approved"), false);
  }
});

test("home and index pages emit Organization, WebSite, WebPage, and breadcrumbs only", () => {
  assert.deepEqual(publicIndexPaths, [
    "/",
    "/methodology",
    "/evidence-status",
    "/devices",
    "/disclosures",
    "/privacy",
  ]);

  const home = buildPublicPageSchema("/");
  assert.deepEqual(
    home.map((node) => node["@type"]),
    ["Organization", "WebSite", "WebPage"],
  );
  assert.equal(home[0].name, "MDRank");
  assert.equal(home[0].url, SITE);
  assert.equal(home[1].name, "MDRank");
  assert.equal(home[1].url, SITE);
  assert.equal(home[2].url, SITE);

  for (const path of publicIndexPaths) {
    const nodes = buildPublicPageSchema(path);
    const serialized = JSON.stringify(nodes);
    JSON.parse(serialized);
    assert.doesNotMatch(serialized, /AggregateRating|ratingValue|reviewCount|bestRating|worstRating/);
    assert.doesNotMatch(serialized, /"@type":"Review"|"@type": "Review"/);
    assert.doesNotMatch(serialized, /MDRank Score|category rank|FDA approved/i);
    for (const node of nodes) {
      assert.equal(node["@context"], "https://schema.org");
      assert.equal(node.url === undefined || String(node.url).startsWith(SITE), true);
    }
    const page = fs.readFileSync(
      path === "/" ? "web/src/app/page.tsx" : `web/src/app${path}/page.tsx`,
      "utf8",
    );
    assert.match(page, new RegExp(`<PublicPageJsonLd path="${path === "/" ? "/" : path}" />`));
  }

  const devices = buildPublicPageSchema("/devices");
  assert.equal(devices[0]["@type"], "CollectionPage");
  assert.equal(devices[1]["@type"], "BreadcrumbList");
  assert.equal(devices[1].itemListElement[1].item, `${SITE}/devices`);
  assert.equal(devices[1].itemListElement[0].item, SITE);

  const component = fs.readFileSync("web/src/components/PublicPageJsonLd.tsx", "utf8");
  assert.match(component, /application\/ld\+json/);
  assert.doesNotMatch(fs.readFileSync("web/src/app/sitemap.ts", "utf8"), /openGraph|Organization/);
});

test("sitemap, affiliate tag, and dossier evidence files stay untouched by schema copy", () => {
  const sitemap = fs.readFileSync("web/src/app/sitemap.ts", "utf8");
  for (const path of ["/", "/methodology", "/evidence-status", "/devices", "/devices/ihealth-track-kn-550bt", "/devices/omron-evolv-bp7000", "/disclosures", "/privacy"]) {
    assert.match(sitemap, new RegExp(path === "/" ? String.raw`https://mdrank\.org/` : path.replaceAll("/", String.raw`\/`)));
  }
  assert.doesNotMatch(sitemap, /\/rankings|\/reviews/);
  assert.match(fs.readFileSync("web/src/lib/amazon.ts", "utf8"), /sjpenterpri05-20/);
  assert.match(fs.readFileSync("web/src/app/disclosures/page.tsx", "utf8"), /sjpenterpri05-20/);
  const dossiers = fs.readFileSync("web/src/components/EvidenceDossier.tsx", "utf8");
  assert.match(dossiers, /"@type": "Article"/);
  assert.match(dossiers, /"@type": "BreadcrumbList"/);
  assert.doesNotMatch(dossiers, /AggregateRating/);
  for (const path of publicIndexPaths) {
    const serialized = JSON.stringify(buildPublicPageSchema(path));
    assert.doesNotMatch(serialized, /AggregateRating|"@type":"Review"|ratingValue/);
  }
});
