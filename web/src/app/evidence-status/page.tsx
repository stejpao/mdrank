import type { Metadata } from "next";
import Link from "next/link";

import { PublicPageJsonLd } from "@/components/PublicPageJsonLd";
import { publishedDossiers } from "@/data/publishedDossiers";
import { getPublicScore, listPublicScores } from "@/lib/publicScore";
import { socialMetadata } from "@/lib/pageMetadata";

const description =
  "What MDRank publishes for upper-arm home blood-pressure monitors: exact-model dossiers, Evidence Confidence, and MDRank Score plus category rank when a row is scored-eligible.";

export const metadata: Metadata = {
  title: "Evidence status",
  description,
  alternates: { canonical: "/evidence-status" },
  ...socialMetadata({
    title: "Evidence status",
    description,
    path: "/evidence-status",
    ogType: "website",
  }),
};

const ihealth = getPublicScore("ihealth-track-kn-550bt");
const evolv = getPublicScore("omron-evolv-bp7000");
const unrankedCount = listPublicScores().filter((row) => row.rankStatus !== "published").length;

const published = [
  `${publishedDossiers.length} upper-arm blood-pressure monitor dossiers are public, including iHealth Track KN-550BT (Evidence Confidence: High) and OMRON Evolv BP7000 (Evidence Confidence: Moderate).`,
  `iHealth Track KN-550BT MDRank Score ${ihealth.scoreLabel} / 100 and category rank ${ihealth.rankLabel} under rubric ${ihealth.rubricVersion}.`,
  "Exact-model identity, regulatory findings, validation status, limitations, and cited sources. Pack dossiers added on October 28, 2026 record the approved brand, model, FDA clearance identifier, Amazon.com ASIN, and illustrative photo.",
  "Testing status on each dossier: public evidence only. MDRank has not performed hands-on or laboratory testing of these monitors.",
  "Public Experience Confidence: Insufficient. No permitted customer-review record is in use, so the public-input sprinkle stays neutral.",
  "Affiliate, sponsorship, margin, inventory, advertising, and conversion data are unavailable to scoring.",
  "Every new public product page is reviewed before it is published.",
];

const withheld = [
  `${evolv.clearanceLabel ?? "OMRON Evolv BP7000"} stays unranked: score ${evolv.scoreLabel}, rank ${evolv.rankLabel}, because validation is family-level rather than exact-model.`,
  `${unrankedCount} public dossiers stay unranked. Family-level clearance crosswalks and packets without an exact-model measurement or validation record stay withheld under the same rubric.`,
  "Hands-on, laboratory, and independent testing claims. None are documented.",
  "Customer-review themes. No permitted customer-review record is in use.",
];

export default function EvidenceStatusPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <PublicPageJsonLd path="/evidence-status" />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Public record as of October 28, 2026</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Evidence status</h1>
      <p className="mt-5 text-lg leading-relaxed text-slate-700">
        MDRank publishes exact-model evidence for upper-arm home blood-pressure monitors under rubric upper-arm-home-bp-v1.0.0. Each dossier shows Evidence Confidence separately from the MDRank Score. Score and rank stay withheld when exact-model evidence is incomplete.
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
        <h2 className="text-2xl font-bold text-slate-950">Withheld when evidence is incomplete</h2>
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
