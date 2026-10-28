import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Evidence status",
  description:
    "What MDRank publishes: exact-model evidence dossiers and Evidence Confidence. Scores and category ranks stay withheld until the comparison cohort is complete.",
  alternates: { canonical: "/evidence-status" },
};

const published = [
  "Two upper-arm blood-pressure monitor dossiers: iHealth Track KN-550BT (Evidence Confidence: High) and OMRON Evolv BP7000 (Evidence Confidence: Moderate).",
  "Exact-model identity, regulatory findings, validation findings, cuff and workflow notes, limitations, and cited sources.",
  "Testing status on each dossier: public evidence only. MDRank has not performed hands-on or laboratory testing of these monitors.",
  "Public Experience Confidence: Insufficient. No permitted customer-review record is in use.",
  "Affiliate, sponsorship, margin, inventory, advertising, and conversion data are unavailable to scoring.",
  "Every new public product page is reviewed before it is published.",
];

const withheld = [
  "Numeric product scores.",
  "Category ranks, until the comparison cohort is complete.",
  "Hands-on, laboratory, and independent testing claims. None are documented.",
  "Customer-review themes. No permitted customer-review record is in use.",
];

export default function EvidenceStatusPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Public record as of July 22, 2026</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Evidence status</h1>
      <p className="mt-5 text-lg leading-relaxed text-slate-700">
        MDRank publishes exact-model evidence for home blood-pressure monitors. Each dossier shows what the record supports and an Evidence Confidence rating. Numeric scores and category ranks stay withheld until the comparison cohort is complete.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950">Published now</h2>
        <ul className="mt-4 space-y-3 text-slate-700">
          {published.map((item) => <li key={item} className="rounded-xl border border-slate-200 bg-white p-4">{item}</li>)}
        </ul>
        <p className="mt-5">
          <Link href="/devices" className="text-sm font-semibold text-indigo-700 hover:underline">Read the evidence dossiers</Link>
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-7">
        <h2 className="text-2xl font-bold text-slate-950">Withheld on these pages</h2>
        <ul className="mt-4 space-y-3 text-slate-700">
          {withheld.map((item) => <li key={item}>• {item}</li>)}
        </ul>
        <p className="mt-4 leading-relaxed text-slate-700">
          Evidence Confidence stays visible on each dossier and is separate from the product score. FDA clearance is not FDA approval, endorsement, independent validation, or proof of superior accuracy.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950">Category scope</h2>
        <p className="mt-3 leading-relaxed text-slate-700">
          Home blood-pressure monitors are the category with public dossiers. Other device categories do not have public dossiers. MDRank does not publish unsupported hands-on claims.
        </p>
      </section>
    </div>
  );
}
