const SITE = "https://mdrank.org";

const PAGES = {
  "/": {
    type: "WebPage",
    name: "MDRank — Medical devices, ranked by evidence",
    breadcrumbs: null,
    site: true,
  },
  "/methodology": {
    type: "WebPage",
    name: "MDRank Methodology",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Methodology", path: "/methodology" },
    ],
  },
  "/evidence-status": {
    type: "WebPage",
    name: "Evidence status",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Evidence status", path: "/evidence-status" },
    ],
  },
  "/devices": {
    type: "CollectionPage",
    name: "Published Medical-Device Evidence Dossiers",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Evidence dossiers", path: "/devices" },
    ],
  },
  "/disclosures": {
    type: "WebPage",
    name: "Disclosures",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Disclosures", path: "/disclosures" },
    ],
  },
  "/privacy": {
    type: "WebPage",
    name: "Privacy notice",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Privacy notice", path: "/privacy" },
    ],
  },
};

const ALLOWED_TYPES = new Set([
  "Organization",
  "WebSite",
  "WebPage",
  "CollectionPage",
  "BreadcrumbList",
  "ListItem",
]);

const FORBIDDEN_KEY = /^(aggregateRating|review|reviews|ratingValue|reviewCount|bestRating|worstRating|rating|mdrankScore|rank|rankLabel)$/i;

export function canonicalUrl(path) {
  if (typeof path !== "string" || !path.startsWith("/")) {
    throw new Error(`Public page path must start with /: ${path}`);
  }
  return path === "/" ? SITE : `${SITE}${path}`;
}

function assertAllowed(value, path) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertAllowed(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_KEY.test(key)) {
      throw new Error(`Forbidden schema field ${path}.${key}`);
    }
    if (key === "@type") {
      const types = Array.isArray(child) ? child : [child];
      for (const type of types) {
        if (!ALLOWED_TYPES.has(type)) {
          throw new Error(`Unsupported schema.org type ${type}`);
        }
      }
    }
    assertAllowed(child, `${path}.${key}`);
  }
}

/**
 * Organization and WebSite for the home page. WebPage or CollectionPage,
 * plus BreadcrumbList, for the other public index pages.
 * No ratings, reviews, scores, or ranks.
 */
export function buildPublicPageSchema(path) {
  const page = PAGES[path];
  if (!page) throw new Error(`No public index schema for ${path}`);

  const nodes = [];
  if (page.site) {
    nodes.push(
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "MDRank",
        url: SITE,
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "MDRank",
        url: SITE,
      },
    );
  }

  nodes.push({
    "@context": "https://schema.org",
    "@type": page.type,
    name: page.name,
    url: canonicalUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: "MDRank",
      url: SITE,
    },
  });

  if (page.breadcrumbs) {
    nodes.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: page.breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: canonicalUrl(crumb.path),
      })),
    });
  }

  const serialized = JSON.stringify(nodes);
  if (/FDA approved/i.test(serialized)) {
    throw new Error("Public page schema must not say FDA approved.");
  }
  if (/MDRank Score|category rank|AggregateRating|ratingValue/i.test(serialized)) {
    throw new Error("Public page schema must not include scores, ranks, or ratings.");
  }
  assertAllowed(nodes, "$");
  return JSON.parse(serialized);
}

export const publicIndexPaths = Object.keys(PAGES);
