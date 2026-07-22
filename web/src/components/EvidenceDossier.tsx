import Link from "next/link";

import type { PublishedDossier } from "@/data/publishedDossiers";

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
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${dossier.name} evidence dossier`,
    description: dossier.directAnswer,
    datePublished: "2026-07-22",
    dateModified: "2026-07-22",
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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
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
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Accepted unranked evidence dossier</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">{dossier.name}</h1>
        <p className="mt-3 text-lg text-slate-600">Exact model: <strong>{dossier.model}</strong> · {dossier.market}</p>
        <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-indigo-900">Direct answer</h2>
          <p className="mt-3 leading-relaxed text-indigo-950">{dossier.directAnswer}</p>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Dossier status">
        <StatusCard label="Product score" value="Withheld" detail="No editor-assigned substitute" />
        <StatusCard label="Category rank" value="Withheld" detail="Comparison cohort incomplete" />
        <StatusCard label="Evidence Confidence" value={dossier.evidenceConfidence} detail="Separate from product score" />
        <StatusCard label="Public Experience" value={dossier.publicExperienceConfidence} detail="No permitted review corpus used" />
      </section>

      <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <h2 className="text-xl font-bold">Why score and rank are withheld</h2>
        <p className="mt-3 leading-relaxed">{dossier.scoreReason}</p>
        <p className="mt-3 text-sm"><strong>Testing status:</strong> {dossier.testingStatus}</p>
      </section>

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

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950">Persona Fit Matrix</h2>
        <p className="mt-2 text-sm text-slate-600">Fit statements describe documented cuff and workflow requirements. They are not medical-suitability determinations.</p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr><th className="px-4 py-3">Persona</th><th className="px-4 py-3">Fit</th><th className="px-4 py-3">Confidence</th><th className="px-4 py-3">Basis</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dossier.personaFit.map((row) => (
                <tr key={row.persona}><td className="px-4 py-3 font-medium text-slate-900">{row.persona}</td><td className="px-4 py-3">{row.fit}</td><td className="px-4 py-3">{row.confidence}</td><td className="px-4 py-3 text-slate-600">{row.basis}</td></tr>
              ))}
            </tbody>
          </table>
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
        <p className="mt-4 text-sm text-slate-600">No product image, price, offer, affiliate link, rating schema, or editor-assigned score appears on this dossier.</p>
      </section>
    </div>
  );
}
