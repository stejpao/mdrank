import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MDRank Methodology",
  description: "How MDRank resolves exact medical-device models, evaluates evidence, calculates deterministic scores, and separates score from confidence.",
  alternates: { canonical: "/methodology" },
};

const principles = [
  ["Exact-model identity", "Regional variants, suffixes, packages, and accessories remain separate until equivalence is documented."],
  ["Deterministic scoring", "Versioned category manifests control eligibility gates, dimensions, weights, penalties, confidence shrinkage, tie-breakers, freshness, and review triggers. An LLM does not choose numeric rules."],
  ["Score separated from confidence", "The MDRank Score describes the result under a category rubric. Evidence Confidence describes how complete, independent, current, and consistent the supporting evidence is."],
  ["Public experience kept separate", "Permitted owner feedback may support recurring usability and ownership themes. It cannot establish clinical accuracy, regulatory status, validation, safety, or medical suitability."],
  ["Commercial isolation", "Affiliate, sponsorship, margin, inventory, conversion, and advertising data are unavailable to the scorer."],
  ["Human-approved publication", "Automation may research, draft, validate, and build previews. Every new public product page requires an explicit human Publish action."],
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Methodology version: pre-release 1.0</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">How MDRank evaluates medical devices</h1>
      <p className="mt-5 text-lg leading-relaxed text-slate-700">MDRank is being rebuilt as an exact-model evidence system. No product earns a public ranking merely because it appears in a manufacturer catalog, affiliate feed, competitor page, or AI-generated summary.</p>

      <div className="mt-10 space-y-5">
        {principles.map(([title, body]) => (
          <section key={title} className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-950">{title}</h2>
            <p className="mt-2 leading-relaxed text-slate-700">{body}</p>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-2xl bg-slate-950 p-7 text-slate-100">
        <h2 className="text-2xl font-bold">Blood-pressure concepts remain separate</h2>
        <p className="mt-3 leading-relaxed text-slate-300">Exact-model regulatory status, independent validation, measurement-performance evidence, resistance to positioning or technique errors, cuff fit, usability, display readability, data handling, power, warranty, ownership cost, and Evidence Confidence are distinct inputs. Resistance to positioning error is not proof of measurement accuracy. FDA clearance is not FDA approval, endorsement, independent validation, or proof that one device is more accurate than another.</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950">Testing language</h2>
        <p className="mt-3 leading-relaxed text-slate-700">MDRank will state the testing status on every public result. “Hands-on,” “independently tested,” “clinically proven,” and similar language is prohibited unless an exact-model protocol, sample, tester, date, method, and result are documented for that page version.</p>
      </section>
    </div>
  );
}
