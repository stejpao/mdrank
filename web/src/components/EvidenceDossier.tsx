import Image from "next/image";
import Link from "next/link";

import { DossierShare } from "@/components/DossierShare";
import type { HandlingMeter, PublishedDossier } from "@/data/publishedDossiers";
import { amazonAssociateUrl } from "@/lib/amazon";
import { getPublicScore } from "@/lib/publicScore";

const METER_FILL: Record<HandlingMeter, number> = {
  documented: 0,
  unsupported: 0,
  limited: 1,
  mixed: 2,
  strong: 4,
};

function FitMeter({ meter, fit }: { meter: HandlingMeter; fit: string }) {
  if (meter === "documented") {
    return <p className="text-xs text-slate-500">Specification. Not a product score.</p>;
  }
  const filled = METER_FILL[meter];
  return (
    <div className="mt-2" data-meter={meter}>
      <p className="text-sm font-semibold text-slate-900">{fit}</p>
      <div className="mt-2 flex gap-1" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <span key={index} className={`h-1.5 flex-1 rounded-sm ${index < filled ? "bg-slate-900" : "bg-slate-200"}`} />
        ))}
      </div>
      <p className="sr-only">{fit}. Qualitative fit from the dossier. Not a product score.</p>
    </div>
  );
}

function StatusCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-slate-950">{value}</p>
      {detail && <p className="mt-2 text-sm leading-relaxed text-slate-600">{detail}</p>}
    </div>
  );
}

export function EvidenceDossier({ dossier }: { dossier: PublishedDossier }) {
  const photo = dossier.illustrativePhoto;
  const amazonUrl = dossier.amazonListing ? amazonAssociateUrl(dossier.amazonListing.asin) : null;
  const score = getPublicScore(dossier.slug);
  if (score.scoreStatus !== dossier.scoreStatus || score.rankStatus !== dossier.rankStatus) {
    throw new Error(`Scorer status does not match the published dossier for ${dossier.slug}.`);
  }
  if (score.evidenceConfidence !== dossier.evidenceConfidence) {
    throw new Error(`Evidence Confidence does not match the scorer for ${dossier.slug}.`);
  }
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${dossier.name} evidence dossier`,
    description: dossier.directAnswer,
    datePublished: "2026-07-22",
    dateModified: "2026-10-28",
    mainEntityOfPage: `https://mdrank.org/devices/${dossier.slug}`,
    author: { "@type": "Organization", name: "MDRank", url: "https://mdrank.org" },
    publisher: { "@type": "Organization", name: "MDRank", url: "https://mdrank.org" },
    about: {
      "@type": "MedicalDevice",
      name: dossier.name,
      model: dossier.model,
      manufacturer: { "@type": "Organization", name: dossier.manufacturer },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mdrank.org/" },
      { "@type": "ListItem", position: 2, name: "Evidence dossiers", item: "https://mdrank.org/devices" },
      { "@type": "ListItem", position: 3, name: dossier.name, item: `https://mdrank.org/devices/${dossier.slug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6 md:pb-10 md:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/" className="hover:text-indigo-700">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/devices" className="hover:text-indigo-700">Evidence dossiers</Link>
        <span className="mx-2">/</span>
        <span>{dossier.model}</span>
      </nav>

      <header className="mt-6 border-b border-slate-200 pb-8">
        {photo ? (
          <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              priority
              sizes="(min-width: 768px) 720px, 100vw"
              data-rights-status={photo.rightsStatus}
              className="h-auto w-full bg-slate-100"
            />
            <figcaption className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">{photo.caption}</figcaption>
            <p className="px-4 pb-4 text-xs leading-relaxed text-slate-500">{photo.rightsNote}</p>
          </figure>
        ) : null}
        <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Published evidence dossier</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{dossier.name}</h1>
            <p className="mt-3 text-lg text-slate-600">Exact model: <strong>{dossier.model}</strong> · {dossier.market}</p>
          </div>
          <DossierShare name={dossier.name} model={dossier.model} />
        </div>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Direct answer</h2>
          <p className="mt-3 leading-relaxed text-slate-800">{dossier.directAnswer}</p>
        </div>
      </header>
      <DossierShare name={dossier.name} model={dossier.model} variant="dock" />

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Dossier status">
        <StatusCard
          label="Product score"
          value={score.scoreLabel}
          detail={score.eligible ? `Rubric ${score.rubricVersion}. No editor-assigned substitute` : "No editor-assigned substitute"}
        />
        <StatusCard label="Category rank" value={score.rankLabel} detail={score.rankDetail} />
        <StatusCard label="Evidence Confidence" value={dossier.evidenceConfidence} detail="Separate from product score" />
        <StatusCard label="Public Experience" value={dossier.publicExperienceConfidence} detail="No permitted customer reviews in use" />
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-slate-800">
        <h2 className="text-xl font-bold text-slate-950">{score.eligible ? "How this score was produced" : "Why score and rank are withheld"}</h2>
        <p className="mt-3 leading-relaxed">{dossier.scoreReason}</p>
        {score.eligible ? (
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700">
            {score.dimensionNotes.map((note) => <li key={note.key}>• {note.note}</li>)}
          </ul>
        ) : null}
        <p className="mt-3 text-sm"><strong>Testing status:</strong> {dossier.testingStatus}</p>
      </section>

      <section className="mt-8" aria-labelledby="handling-glance-heading" data-section="handling-glance" data-affiliate-weight="0">
        <h2 id="handling-glance-heading" className="text-2xl font-bold text-slate-950">Handling snapshot</h2>
        <p className="mt-2 text-sm text-slate-600">Qualitative ownership notes from the published specifications and persona-fit record. Not a product score or rank.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {dossier.handlingGlance.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4" data-criterion={item.id}>
              <h3 className="text-sm font-semibold text-slate-500">{item.label}</h3>
              <p className="mt-1 font-semibold text-slate-950">{item.summary}</p>
              <FitMeter meter={item.meter} fit={item.fit} />
              <p className="mt-2 text-xs text-slate-500">Confidence: {item.confidence}</p>
            </article>
          ))}
        </div>
        <details className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer text-base font-bold text-slate-950">Detailed handling report</summary>
          <div className="mt-4 space-y-4" data-section="handling-report">
            {dossier.handlingReport.map((row) => (
              <article key={row.id} data-criterion={row.id} className="border-t border-slate-100 pt-4">
                <h3 className="font-semibold text-slate-950">{row.criterion}</h3>
                <dl className="mt-2 grid gap-2 text-sm">
                  <div>
                    <dt className="font-semibold text-slate-500">Finding</dt>
                    <dd data-field="finding">{row.finding}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">Confidence</dt>
                    <dd data-field="confidence">{row.confidence}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">Source class</dt>
                    <dd data-field="source-class">{row.sourceClass}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-500">Source</dt>
                    <dd data-field="source-label">{row.sourceLabel}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </details>
      </section>

      {amazonUrl && dossier.amazonListing ? (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6" aria-labelledby="where-to-buy-heading" data-section="where-to-buy" data-affiliate-weight="0">
          <h2 id="where-to-buy-heading" className="text-xl font-bold text-slate-950">Where to buy</h2>
          <p className="mt-3 leading-relaxed text-slate-800" data-field="where-to-buy-answer">
            Where to buy: the Amazon.com listing for {dossier.name} ({dossier.model}, ASIN {dossier.amazonListing.asin}) is {amazonUrl}. The link has zero weight on the MDRank Score and category rank.
          </p>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="font-semibold text-slate-500">purchase_url</dt>
              <dd className="break-all" data-field="purchase_url">{amazonUrl}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">asin</dt>
              <dd data-field="asin">{dossier.amazonListing.asin}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">merchant</dt>
              <dd data-field="merchant">Amazon</dd>
            </div>
          </dl>
          <a
            href={amazonUrl}
            rel="sponsored nofollow noopener noreferrer"
            target="_blank"
            data-affiliate="amazon-associates"
            data-asin={dossier.amazonListing.asin}
            data-merchant="Amazon"
            className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
          >
            Buy on Amazon
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            <strong>Affiliate disclosure:</strong> MDRank may earn a commission if you buy through this Amazon link. As an Amazon Associate, MDRank earns from qualifying purchases. Affiliate relationships have zero weight on the product score and category rank.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{dossier.amazonListing.listingNote}</p>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950">Verified exact identity</h2>
        <ul className="mt-4 space-y-3 text-slate-700">
          {dossier.exactIdentity.map((item) => <li key={item} className="rounded-xl border border-slate-200 bg-white p-4">{item}</li>)}
        </ul>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Regulatory and safety research</h2>
          <ul className="mt-4 space-y-3 text-slate-700">
            {dossier.regulatoryFindings.map((item) => <li key={item} className="border-l-4 border-indigo-200 pl-4 leading-relaxed">{item}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Clinical-validation evidence</h2>
          <ul className="mt-4 space-y-3 text-slate-700">
            {dossier.validationFindings.map((item) => <li key={item} className="border-l-4 border-emerald-200 pl-4 leading-relaxed">{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-sky-200 bg-sky-50 p-6">
        <h2 className="text-2xl font-bold text-slate-950">HSA/FSA eligibility</h2>
        <p className="mt-3 font-semibold text-sky-950">{dossier.hsaFsa.status}</p>
        <p className="mt-2 leading-relaxed text-slate-700">{dossier.hsaFsa.basis}</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          {dossier.hsaFsa.limitations.map((item) => <li key={item}>• {item}</li>)}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950">Manufacturer-attributed specifications</h2>
        <p className="mt-2 text-sm text-slate-600">These specifications come from the cited manufacturer/FDA materials. MDRank did not independently measure them.</p>
        <dl className="mt-5 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {dossier.specifications.map((spec) => (
            <div key={spec.label} className="grid gap-2 px-5 py-4 sm:grid-cols-[15rem_1fr]">
              <dt className="font-semibold text-slate-700">{spec.label}</dt>
              <dd className="text-slate-700">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10" aria-labelledby="persona-fit-heading">
        <h2 id="persona-fit-heading" className="text-2xl font-bold text-slate-950">Persona fit</h2>
        <p className="mt-2 text-sm text-slate-600">Fit statements describe documented cuff and workflow requirements. They are not medical-suitability determinations.</p>
        <div className="mt-4 grid gap-3">
          {dossier.personaFit.map((row) => (
            <article key={row.persona} className="rounded-2xl border border-slate-200 bg-white p-4" data-persona={row.persona}>
              <h3 className="font-semibold text-slate-950">{row.persona}</h3>
              <p className="mt-2 text-sm font-semibold text-slate-800" data-field="fit">{row.fit}</p>
              <p className="mt-1 text-sm text-slate-600" data-field="confidence">Confidence: {row.confidence}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700" data-field="basis">{row.basis}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-2xl font-bold text-amber-950">Material limitations</h2>
        <ul className="mt-4 space-y-3 text-amber-950">
          {dossier.limitations.map((item) => <li key={item}>• {item}</li>)}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950">Evidence ledger</h2>
        <p className="mt-2 text-sm text-slate-600">Evidence cutoff: {dossier.evidenceCutoff}. Source class A is regulatory, government, registry, or peer-reviewed evidence; C is manufacturer documentation; D is current-offer or eligibility evidence.</p>
        <ul className="mt-5 space-y-3">
          {dossier.sources.map((source) => (
            <li key={source.url} className="rounded-xl border border-slate-200 bg-white p-4">
              <span className="mr-3 inline-flex rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">Class {source.sourceClass}</span>
              <a href={source.url} rel="noreferrer" className="font-semibold text-indigo-700 underline decoration-indigo-200 underline-offset-2 hover:text-indigo-900">{source.label}</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-950">Publication and change log</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">{dossier.changeLog.map((item) => <li key={item}>• {item}</li>)}</ul>
        <p className="mt-4 text-sm text-slate-600">No price, offer schema, rating schema, or editor-assigned score appears on this dossier. The illustrative photo is not product evidence. A disclosed Amazon link, when shown, stays commercially isolated from the MDRank Score and category rank.</p>
      </section>
    </div>
  );
}
