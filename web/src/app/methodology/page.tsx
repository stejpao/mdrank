import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MDRank Methodology",
  description: "How MDRank resolves exact medical-device models, evaluates evidence, and separates product score from Evidence Confidence.",
  alternates: { canonical: "/methodology" },
};

const principles = [
  ["Exact-model identity", "Regional variants, suffixes, packages, and accessories remain separate until equivalence is documented."],
  ["Deterministic scoring", "Versioned category manifests control eligibility gates, dimensions, weights, penalties, confidence shrinkage, tie-breakers, freshness, and review triggers. An LLM does not choose numeric rules."],
  ["Score separated from confidence", "The MDRank Score describes the result under a category rubric. Evidence Confidence describes how complete, independent, current, and consistent the supporting evidence is."],
  ["Public experience kept separate", "Permitted owner feedback may support recurring usability and ownership themes. It cannot establish clinical accuracy, regulatory status, validation, safety, or medical suitability."],
  ["Commercial isolation", "Affiliate, sponsorship, margin, inventory, conversion, and advertising data are unavailable to the scorer."],
  ["Publication review", "Every new public product page is reviewed before it is published. Unpublished research stays off the public site."],
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">Methodology version 1.0</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">How MDRank evaluates medical devices</h1>
      <p className="mt-5 text-lg leading-relaxed text-slate-700">MDRank evaluates exact device models against a published method. No product earns a public ranking merely because it appears in a manufacturer catalog, affiliate feed, competitor page, or an AI-generated summary.</p>

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
        <h2 className="text-2xl font-bold text-slate-950">Upper-arm home blood-pressure rubric</h2>
        <p className="mt-3 leading-relaxed text-slate-700">Rubric <strong>upper-arm-home-bp-v1.0.0</strong> is the owner-enabled method for this category. An MDRank Score is the weighted result for a resolved, FDA-cleared, exact-model row. A 510(k) K-number and a De Novo DEN-number both count as FDA-cleared. Clearance is not accuracy. Family-only validation is not scored. Missing facts shrink toward neutral. Evidence Confidence is calculated separately.</p>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr><th className="px-4 py-3">Dimension</th><th className="px-4 py-3">Weight</th><th className="px-4 py-3">What it uses</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr><td className="px-4 py-3">Exact-model validation</td><td className="px-4 py-3">0.28</td><td className="px-4 py-3">Peer-reviewed or registry results that name the exact model</td></tr>
              <tr><td className="px-4 py-3">Measurement performance (documented)</td><td className="px-4 py-3">0.18</td><td className="px-4 py-3">Attributed performance evidence, not a preference</td></tr>
              <tr><td className="px-4 py-3">Regulatory clearance posture</td><td className="px-4 py-3">0.12</td><td className="px-4 py-3">FDA-cleared K or DEN number and consistent GUDID notes</td></tr>
              <tr><td className="px-4 py-3">Cuff / fit coverage</td><td className="px-4 py-3">0.12</td><td className="px-4 py-3">Documented cuff ranges and package matrix</td></tr>
              <tr><td className="px-4 py-3">Power / warranty / ownership facts</td><td className="px-4 py-3">0.09</td><td className="px-4 py-3">Attributed support and ownership facts</td></tr>
              <tr><td className="px-4 py-3">Positioning / technique resistance</td><td className="px-4 py-3">0.08</td><td className="px-4 py-3">Documented resistance claims, not accuracy proof</td></tr>
              <tr><td className="px-4 py-3">Usability / display</td><td className="px-4 py-3">0.08</td><td className="px-4 py-3">Attributed usability facts</td></tr>
              <tr><td className="px-4 py-3">Data handling</td><td className="px-4 py-3">0.05</td><td className="px-4 py-3">Memory, sync, and privacy-relevant facts</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 leading-relaxed text-slate-700">A public-input sprinkle of 0.05 can apply only when a licensed exact-model customer-review corpus exists. It is hard-capped so it cannot by itself reverse a near peer inside the top five. No corpus means that sprinkle stays neutral. It is not clinical proof. Affiliate, sponsorship, margin, inventory, conversion, advertising, merchant, and operator fields stay at weight zero, including Amazon Associates tag sjpenterpri05-20.</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950">Testing language</h2>
        <p className="mt-3 leading-relaxed text-slate-700">Testing status is stated on every public result. MDRank does not publish unsupported hands-on claims. “Hands-on,” “independently tested,” “clinically proven,” and similar language is used only when an exact-model protocol, sample, tester, date, method, and result are documented for that page version.</p>
      </section>
    </div>
  );
}
