import Link from "next/link";

import { AmazonCanadaNote } from "@/components/AmazonCanadaNote";
import dossierFaqs from "@/data/dossierFaqs.json";
import publicOffers from "@/data/publicOffers.json";
import { publishedDossiers, type PublishedDossier } from "@/data/publishedDossiers";
import { amazonAssociateUrl } from "@/lib/amazon";
import { buildDossierStructuredData, scoreStatusFaq } from "@/lib/dossierSchema.mjs";
import { getPublicScore } from "@/lib/publicScore";

const PHOTO_CAPTION = "*Photo edited for clarity.";

type FaqMap = Record<string, Array<{ question: string; answer: string }>>;
type OfferMap = Record<string, { brand: string; asin: string; offerNote: string }>;

const faqsBySlug = dossierFaqs as FaqMap;
const offersBySlug = publicOffers as OfferMap;

type CommerceFields = {
  amazonListing?: { asin?: string; canadaLocalMatch?: "confirmed" | "not-documented" };
  illustrativePhoto?: { src?: string; caption?: string };
};

function jsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function DossierSeo({ dossier }: { dossier: PublishedDossier }) {
  const offer = offersBySlug[dossier.slug];
  const commerce = dossier as PublishedDossier & CommerceFields;
  const asin = commerce.amazonListing?.asin || offer?.asin || null;
  const canadaLocalMatch = commerce.amazonListing?.canadaLocalMatch ?? "not-documented";
  const photo = commerce.illustrativePhoto;
  const image =
    photo?.src && photo.caption === PHOTO_CAPTION ? `https://mdrank.org${photo.src}` : null;
  const score = getPublicScore(dossier.slug);
  const faqs = [
    ...(faqsBySlug[dossier.slug] ?? []).filter((faq) => !/score and category rank/i.test(faq.question)),
    scoreStatusFaq({
      scoreStatus: score.scoreStatus,
      rankStatus: score.rankStatus,
      scoreLabel: score.scoreLabel,
      rankLabel: score.rankLabel,
      rankDetail: score.rankDetail,
      rubricVersion: score.rubricVersion,
      evidenceConfidence: dossier.evidenceConfidence,
    }),
  ];
  const schemas = buildDossierStructuredData({
    slug: dossier.slug,
    name: dossier.name,
    model: dossier.model,
    manufacturer: dossier.manufacturer,
    brand: offer?.brand ?? dossier.manufacturer,
    category: dossier.category,
    description: dossier.directAnswer,
    faqs,
    asin,
    offerUrl: asin ? amazonAssociateUrl(asin) : null,
    offerNote: offer?.offerNote ?? null,
    image,
  });
  const peer = publishedDossiers.find((item) => item.slug !== dossier.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
      {schemas.map((schema) => (
        <script
          key={String(schema["@type"])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
        />
      ))}

      <section className="mt-10" aria-labelledby="dossier-faq-heading">
        <h2 id="dossier-faq-heading" className="text-2xl font-bold text-slate-950">
          Questions from this dossier
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          These answers use only the evidence already recorded for this exact model. The score question follows the published rubric row for this dossier. Evidence Confidence stays separate from the MDRank Score.
        </p>
        <div className="mt-5 space-y-4">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-bold text-slate-950">{faq.question}</h3>
              <p className="mt-2 leading-relaxed text-slate-700">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <nav className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6" aria-label="Trust">
        <h2 className="text-xl font-bold text-slate-950">How to read this record</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Methodology, commercial disclosures, and the evidence-system status are separate from this exact-model record.
          {asin ? (
            <>
              {" "}
              Structured data records verified Amazon.com listing ASIN {asin} with Associates tag sjpenterpri05-20. MDRank may earn a commission from a qualifying purchase through that listing. The listing has zero weight in the MDRank Score and category rank, and no price or availability is stated.
            </>
          ) : null}
        </p>
        {asin ? <AmazonCanadaNote asin={asin} canadaLocalMatch={canadaLocalMatch} /> : null}
        <ul className="mt-4 space-y-2 text-sm font-semibold">
          <li><Link href="/methodology" className="text-indigo-700 hover:underline">Methodology</Link></li>
          <li><Link href="/disclosures" className="text-indigo-700 hover:underline">Disclosures</Link></li>
          <li><Link href="/evidence-status" className="text-indigo-700 hover:underline">Evidence-system status</Link></li>
          {peer ? (
            <li>
              <Link href={`/devices/${peer.slug}`} className="text-indigo-700 hover:underline">
                Other published upper-arm dossier: {peer.model}
              </Link>
            </li>
          ) : null}
        </ul>
      </nav>
    </div>
  );
}
