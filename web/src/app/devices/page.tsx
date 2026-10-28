import type { Metadata } from "next";
import Link from "next/link";

import { publishedDossiers } from "@/data/publishedDossiers";

export const metadata: Metadata = {
  title: "Published Medical-Device Evidence Dossiers",
  description: "Exact-model evidence dossiers with Evidence Confidence, limitations, and testing status. Scores and ranks stay withheld until the comparison cohort is complete.",
  alternates: { canonical: "/devices" },
  robots: { index: true, follow: true },
};

export default function DossiersIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Published records</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Medical-device evidence dossiers</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-700">
        These exact-model dossiers are published. A published dossier is not a score, a rank, a recommendation, a hands-on test, or a customer-review summary. Each page shows its status directly.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-800">
        <strong>Scores and ranks stay withheld until the comparison cohort is complete.</strong>
        <p className="mt-2">Evidence Confidence is shown on each dossier and is separate from the product score.</p>
      </div>

      <div className="mt-8 grid gap-5">
        {publishedDossiers.map((dossier) => (
          <article key={dossier.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">{dossier.category}</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">{dossier.name}</h2>
                <p className="mt-1 text-sm text-slate-500">Exact model: {dossier.model}</p>
              </div>
              <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                <div><strong>Score:</strong> Withheld</div>
                <div><strong>Rank:</strong> Withheld</div>
                <div><strong>Evidence Confidence:</strong> {dossier.evidenceConfidence}</div>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-slate-700">{dossier.directAnswer}</p>
            <Link href={`/devices/${dossier.slug}`} className="mt-5 inline-flex rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800">
              Read the evidence dossier
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
