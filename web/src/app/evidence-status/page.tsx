import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MDRank Evidence-System Status",
  description: "Current implementation status, public corpus state, safeguards, and initial blood-pressure milestone for MDRank.org.",
  alternates: { canonical: "/evidence-status" },
};

const milestone = [
  "30–40 exact-model candidates screened",
  "At least 10 evidence-complete, human-approved public dossiers",
  "Explicit rejected, ambiguous, unavailable, and insufficient-evidence records",
  "Five or more meaningful head-to-head comparisons",
  "Public category methodology",
  "Validation-status directory",
  "Cuff-size and compatibility database",
  "Warranty, support, consumables, and total-cost comparison",
  "Product and ranking change log",
  "One reproducible original category report",
];

export default function EvidenceStatusPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Updated July 22, 2026</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">MDRank evidence-system status</h1>
      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <strong>Public rankings are temporarily withheld.</strong>
        <p className="mt-2 leading-relaxed">The inherited site contained synthetic scores, copied or source-derived rankings, random score adjustments, and unsupported hands-on language. Those records have been removed from public output and cannot seed the rebuilt system.</p>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950">Current verified implementation</h2>
        <ul className="mt-4 space-y-3 text-slate-700">
          <li>• Versioned exact-model, methodology, public-experience, and publication-gate contracts.</li>
          <li>• Two human-approved, unranked public blood-pressure-monitor evidence dossiers with score, rank, testing status, confidence, sources, and limitations shown separately.</li>
          <li>• Forty discovered blood-pressure candidates awaiting exact-model screening. Discovery is not approval.</li>
          <li>• A 90-day calendar allocating 80 of 90 days to blood-pressure depth.</li>
          <li>• Human approval required before every new public product URL.</li>
          <li>• Commercial performance data isolated from scoring.</li>
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-7">
        <h2 className="text-2xl font-bold text-slate-950">First category milestone</h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2">
          {milestone.map((item, index) => <li key={item} className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700"><strong className="text-indigo-700">{index + 1}.</strong> {item}</li>)}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950">What is not live</h2>
        <p className="mt-3 leading-relaxed text-slate-700">There is no production-grade public scoring corpus, licensed public-review connector, complete validation directory, automated public ranking, or documented hands-on testing program yet. Accepted evidence dossiers may be public with score and rank withheld; MDRank will not represent planned capability as operational.</p>
      </section>
    </div>
  );
}
