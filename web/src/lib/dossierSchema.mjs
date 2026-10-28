const SITE = "https://mdrank.org";
const ASSOCIATES_TAG = "sjpenterpri05-20";
const FORBIDDEN_KEYS = /^(aggregateRating|ratingValue|reviewCount|bestRating|worstRating|price|priceCurrency)$/i;

function assertHonestSchema(value, path = "$") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertHonestSchema(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.test(key)) {
      throw new Error(`Forbidden schema field ${path}.${key}`);
    }
    assertHonestSchema(child, `${path}.${key}`);
  }
}

function requireFaqs(faqs) {
  if (!Array.isArray(faqs) || faqs.length < 3 || faqs.length > 5) {
    throw new Error("Dossier FAQPage requires 3 to 5 questions grounded in that dossier.");
  }
  return faqs.map((faq) => {
    const question = String(faq.question ?? "").trim();
    const answer = String(faq.answer ?? "").trim();
    if (!question || !answer) throw new Error("Dossier FAQ entries need a question and an answer.");
    return { question, answer };
  });
}

/**
 * Visible FAQ for the published score row. Scored-eligible rows state the
 * rubric score and rank. Family-only rows stay withheld. No rating fields.
 */
export function scoreStatusFaq(score) {
  const evidenceConfidence = score.evidenceConfidence;
  if (score.scoreStatus === "published" && score.rankStatus === "published") {
    return {
      question: "What MDRank Score and category rank are published?",
      answer: `Rubric ${score.rubricVersion} publishes MDRank Score ${score.scoreLabel} and category rank ${score.rankLabel} for this exact model. ${score.rankDetail} Evidence Confidence stays ${evidenceConfidence} and is separate from the score.`,
    };
  }
  return {
    question: "Why are the MDRank Score and category rank withheld?",
    answer: `${score.rankDetail} Evidence Confidence stays ${evidenceConfidence} and is separate from the score.`,
  };
}

/**
 * Product, Brand, Offer, and FAQPage for one published dossier.
 * BreadcrumbList stays on the dossier template. No rating fields.
 */
export function buildDossierStructuredData(input) {
  const slug = String(input.slug ?? "");
  const url = `${SITE}/devices/${slug}`;
  const faqs = requireFaqs(input.faqs);
  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    model: input.model,
    category: input.category,
    description: input.description,
    url,
    brand: { "@type": "Brand", name: input.brand },
    manufacturer: { "@type": "Organization", name: input.manufacturer },
  };

  if (input.image) product.image = input.image;

  if (input.offerUrl) {
    const offerUrl = String(input.offerUrl);
    if (!offerUrl.startsWith("https://www.amazon.com/dp/")) {
      throw new Error("Amazon offer URL must be an Amazon.com /dp/ link.");
    }
    if (!offerUrl.includes(`tag=${ASSOCIATES_TAG}`)) {
      throw new Error("Amazon offer URL must use the disclosed Associates tag.");
    }
    product.offers = {
      "@type": "Offer",
      url: offerUrl,
      seller: { "@type": "Organization", name: "Amazon.com" },
      description: input.offerNote,
    };
    if (input.asin) {
      product.additionalProperty = {
        "@type": "PropertyValue",
        name: "Amazon ASIN",
        value: input.asin,
      };
    }
  }

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const graph = [product, faqPage];
  assertHonestSchema(graph);
  return graph;
}
